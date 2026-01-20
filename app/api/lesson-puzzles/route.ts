import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Chess } from 'chess.js';
import { getLessonById as getLevel1Lesson } from '@/data/level1-curriculum';
import { getLessonByIdLevel2 as getLevel2Lesson } from '@/data/level2-curriculum';
import { getLessonByIdLevel3 as getLevel3Lesson } from '@/data/level3-curriculum';
import { getLessonByIdLevel4 as getLevel4Lesson } from '@/data/level4-curriculum';
import { getLessonByIdLevel5 as getLevel5Lesson } from '@/data/level5-curriculum';
import { getPuzzleIdsForLesson } from '@/data/lesson-puzzle-sets';

const PUZZLES_BASE_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');

// Map level prefix to puzzle bracket
function getPuzzleBracket(lessonId: string): string {
  const levelPrefix = lessonId.split('.')[0];
  switch (levelPrefix) {
    case '1': return '0400-0800';
    case '2': return '0800-1200';
    case '3': return '0800-1200';
    case '4': return '1200-1600';
    case '5': return '1200-1600';
    default: return '0400-0800';
  }
}

// Get lesson from any level
function getLessonById(lessonId: string) {
  const levelPrefix = lessonId.split('.')[0];
  switch (levelPrefix) {
    case '1': return getLevel1Lesson(lessonId);
    case '2': return getLevel2Lesson(lessonId);
    case '3': return getLevel3Lesson(lessonId);
    case '4': return getLevel4Lesson(lessonId);
    case '5': return getLevel5Lesson(lessonId);
    default: return null;
  }
}

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  nbPlays: number;
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

// Process puzzle into lesson format
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

  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  // Get the STATIC puzzle IDs for this lesson
  const puzzleIds = getPuzzleIdsForLesson(lessonId);

  if (puzzleIds.length === 0) {
    return NextResponse.json({
      error: 'No puzzles available for this lesson',
      lessonId,
      lessonName: lesson.name,
    }, { status: 404 });
  }

  try {
    // Load the specific puzzles by ID from CSV files
    const puzzleIdSet = new Set(puzzleIds);
    const foundPuzzles: RawPuzzle[] = [];
    const puzzleBracket = getPuzzleBracket(lessonId);
    const puzzlesDir = join(PUZZLES_BASE_DIR, puzzleBracket);
    const themeFiles = readdirSync(puzzlesDir).filter(f => f.endsWith('.csv'));

    for (const file of themeFiles) {
      const content = readFileSync(join(puzzlesDir, file), 'utf-8');
      const lines = content.trim().split('\n');

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length < 9) continue;

        const puzzleId = parts[0];

        if (puzzleIdSet.has(puzzleId) && !foundPuzzles.some(p => p.puzzleId === puzzleId)) {
          foundPuzzles.push({
            puzzleId,
            fen: parts[1],
            moves: parts[2],
            rating: parseInt(parts[3], 10),
            nbPlays: parseInt(parts[6], 10),
            themes: parts[7].split(' '),
            url: parts[8],
          });

          // Stop if we found all puzzles
          if (foundPuzzles.length >= puzzleIds.length) break;
        }
      }

      if (foundPuzzles.length >= puzzleIds.length) break;
    }

    // Sort by the order in puzzleIds (maintains curated order)
    foundPuzzles.sort((a, b) => puzzleIds.indexOf(a.puzzleId) - puzzleIds.indexOf(b.puzzleId));

    // Process into lesson format
    const puzzles = foundPuzzles.map(processPuzzle);

    return NextResponse.json({
      lessonId,
      lessonName: lesson.name,
      lessonDescription: lesson.description,
      puzzles,
      puzzleCount: puzzles.length,
      isStatic: true, // These are curated, static puzzles
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error}` }, { status: 500 });
  }
}
