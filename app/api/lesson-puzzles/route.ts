import { NextRequest, NextResponse } from 'next/server';
import { Chess } from 'chess.js';
import lessonData from '@/data/lesson-puzzle-sets.json';
import puzzleData from '@/data/lesson-puzzles-full.json';

interface PuzzleSlot {
  puzzleId: string;
  slot: number;
  trueDifficulty: number;
}

interface LessonInfo {
  lessonId: string;
  lessonName: string;
  puzzleIds?: string[];
  puzzles?: PuzzleSlot[];
  puzzleCount?: number;
}

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string[];
  url: string;
}

interface LessonPuzzle {
  puzzleId: string;
  fen: string;
  puzzleFen: string;
  moves: string;
  rating: number;
  themes: string[];
  url: string;
  setupMove: string;
  lastMoveFrom: string;
  lastMoveTo: string;
  solution: string;
  solutionMoves: string[];
  playerColor: 'white' | 'black';
}

// Type the puzzle data
const puzzleMap = puzzleData as Record<string, RawPuzzle>;

// Get lesson info from the JSON data
function getLessonInfo(lessonId: string): LessonInfo | null {
  const lesson = (lessonData as LessonInfo[]).find(l => l.lessonId === lessonId);
  return lesson || null;
}

// Process raw puzzle into lesson format
function processPuzzle(raw: RawPuzzle): LessonPuzzle {
  const chess = new Chess(raw.fen);
  const moveList = raw.moves.split(' ');

  // Apply setup move
  const setupUci = moveList[0];
  const lastMoveFrom = setupUci.slice(0, 2);
  const lastMoveTo = setupUci.slice(2, 4);

  const setupResult = chess.move({
    from: lastMoveFrom,
    to: lastMoveTo,
    promotion: setupUci[4] as 'q' | 'r' | 'b' | 'n' | undefined
  });

  const setupMove = setupResult?.san || setupUci;
  const puzzleFen = chess.fen();
  const playerColor = chess.turn() === 'w' ? 'white' : 'black';

  // Get solution in SAN
  const solutionMoves: string[] = [];
  for (let i = 1; i < moveList.length; i++) {
    const uci = moveList[i];
    const result = chess.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci[4] as 'q' | 'r' | 'b' | 'n' | undefined
    });
    if (result) {
      solutionMoves.push(result.san);
    }
  }

  // Format solution with move numbers
  const solution = formatSolution(solutionMoves, playerColor === 'black');

  return {
    puzzleId: raw.puzzleId,
    fen: raw.fen,
    puzzleFen,
    moves: raw.moves,
    rating: raw.rating,
    themes: raw.themes,
    url: raw.url,
    setupMove,
    lastMoveFrom,
    lastMoveTo,
    solution,
    solutionMoves,
    playerColor,
  };
}

function formatSolution(moves: string[], startsAsBlack: boolean): string {
  if (moves.length === 0) return '';
  const parts: string[] = [];
  let moveNum = 1;
  let isWhiteMove = !startsAsBlack;

  for (let i = 0; i < moves.length; i++) {
    const san = moves[i];
    if (isWhiteMove) {
      parts.push(`${moveNum}.${san}`);
    } else {
      if (i === 0 && startsAsBlack) {
        parts.push(`${moveNum}...${san}`);
      } else {
        parts.push(san);
      }
      moveNum++;
    }
    isWhiteMove = !isWhiteMove;
  }
  return parts.join(' ');
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lessonId = searchParams.get('lessonId');

  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId required' }, { status: 400 });
  }

  const lessonInfo = getLessonInfo(lessonId);
  if (!lessonInfo) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  // Load puzzles from the embedded JSON data (handles both formats)
  const rawPuzzles: RawPuzzle[] = [];

  // Format 1: puzzleIds array (levels 1-5)
  if (lessonInfo.puzzleIds && lessonInfo.puzzleIds.length > 0) {
    for (const puzzleId of lessonInfo.puzzleIds) {
      const puzzle = puzzleMap[puzzleId];
      if (puzzle) {
        rawPuzzles.push(puzzle);
      }
    }
  }
  // Format 2: puzzles array with objects (levels 6-8)
  else if (lessonInfo.puzzles && lessonInfo.puzzles.length > 0) {
    for (const slot of lessonInfo.puzzles) {
      const puzzle = puzzleMap[slot.puzzleId];
      if (puzzle) {
        rawPuzzles.push(puzzle);
      }
    }
  }

  if (rawPuzzles.length === 0) {
    return NextResponse.json({
      error: 'Puzzles not yet generated for this lesson',
      lessonId,
      lessonName: lessonInfo.lessonName,
      needsGeneration: true,
    }, { status: 404 });
  }

  try {
    // Process into lesson format
    const puzzles = rawPuzzles.map(processPuzzle);

    return NextResponse.json({
      lessonId,
      lessonName: lessonInfo.lessonName,
      lessonDescription: '',
      puzzles,
      puzzleCount: puzzles.length,
      isStatic: true,
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error}` }, { status: 500 });
  }
}
