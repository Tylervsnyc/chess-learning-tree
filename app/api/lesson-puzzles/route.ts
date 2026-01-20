import { NextRequest, NextResponse } from 'next/server';
import { Chess } from 'chess.js';
import { getPuzzlesForLesson, getLessonInfo, EmbeddedPuzzle } from '@/data/lesson-puzzle-sets';

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

// Process embedded puzzle into lesson format
function processPuzzle(raw: EmbeddedPuzzle): LessonPuzzle {
  const chess = new Chess(raw.fen);
  const moveList = raw.moves.split(' ');

  // Apply setup move
  const setupUci = moveList[0];
  const lastMoveFrom = setupUci.slice(0, 2);
  const lastMoveTo = setupUci.slice(2, 4);

  const setupResult = chess.move({
    from: lastMoveFrom,
    to: lastMoveTo,
    promotion: setupUci[4] as any
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
      promotion: uci[4] as any
    });
    if (result) {
      solutionMoves.push(result.san);
    }
  }

  // Format solution with move numbers
  const solution = formatSolution(solutionMoves, playerColor === 'black');

  return {
    puzzleId: raw.id,
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

  // Get puzzles directly from embedded data
  const embeddedPuzzles = getPuzzlesForLesson(lessonId);

  if (embeddedPuzzles.length === 0) {
    return NextResponse.json({
      error: 'No puzzles available for this lesson',
      lessonId,
      lessonName: lessonInfo.name,
    }, { status: 404 });
  }

  try {
    // Process into lesson format
    const puzzles = embeddedPuzzles.map(processPuzzle);

    return NextResponse.json({
      lessonId,
      lessonName: lessonInfo.name,
      lessonDescription: '',
      puzzles,
      puzzleCount: puzzles.length,
      isStatic: true,
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error}` }, { status: 500 });
  }
}
