import { NextRequest, NextResponse } from 'next/server';
import { Chess } from 'chess.js';
import lessonData from '@/data/lesson-puzzle-sets.json';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');

interface LessonInfo {
  lessonId: string;
  lessonName: string;
  puzzleIds: string[];
  puzzleCount: number;
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

// Get lesson info from the JSON data
function getLessonInfo(lessonId: string): LessonInfo | null {
  const lesson = (lessonData as LessonInfo[]).find(l => l.lessonId === lessonId);
  return lesson || null;
}

// Load puzzle by ID from CSV files
function loadPuzzleById(puzzleId: string): RawPuzzle | null {
  try {
    if (!existsSync(PUZZLES_DIR)) {
      return null;
    }
    const brackets = readdirSync(PUZZLES_DIR).filter(d => !d.endsWith('.csv'));
    for (const bracket of brackets) {
      const bracketDir = join(PUZZLES_DIR, bracket);
      if (!existsSync(bracketDir)) continue;
      const files = readdirSync(bracketDir).filter(f => f.endsWith('.csv'));
      for (const file of files) {
        const content = readFileSync(join(bracketDir, file), 'utf-8');
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.startsWith(puzzleId + ',')) {
            const parts = line.split(',');
            if (parts.length >= 9) {
              return {
                puzzleId: parts[0],
                fen: parts[1],
                moves: parts[2],
                rating: parseInt(parts[3], 10),
                themes: parts[7].split(' '),
                url: parts[8],
              };
            }
          }
        }
      }
    }
  } catch (e) {
    console.error('Error loading puzzle:', e);
  }
  return null;
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

  // Load puzzles from CSV files using the puzzle IDs
  const rawPuzzles: RawPuzzle[] = [];
  for (const puzzleId of lessonInfo.puzzleIds) {
    const puzzle = loadPuzzleById(puzzleId);
    if (puzzle) {
      rawPuzzles.push(puzzle);
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
