import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Chess } from 'chess.js';

const PUZZLES_BASE = join(process.cwd(), 'data', 'puzzles-by-rating');

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  nbPlays: number;
  themes: string[];
  url: string;
}

interface ChallengePuzzle {
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

// Get the right directory for a rating
function getRatingDir(rating: number): string {
  if (rating < 800) return '0400-0800';
  if (rating < 1200) return '0800-1200';
  if (rating < 1600) return '1200-1600';
  if (rating < 2000) return '1600-2000';
  return '2000-plus';
}

// Process puzzle into challenge format
function processPuzzle(raw: RawPuzzle): ChallengePuzzle {
  const chess = new Chess(raw.fen);
  const moveList = raw.moves.split(' ');

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

// Use seeded random for daily consistency
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetRating = parseInt(searchParams.get('rating') || '400', 10);
  const seed = parseInt(searchParams.get('seed') || Date.now().toString(), 10);
  const excludeIds = (searchParams.get('exclude') || '').split(',').filter(Boolean);

  const ratingDir = getRatingDir(targetRating);
  const csvPath = join(PUZZLES_BASE, `${ratingDir}.csv`);

  try {
    const content = readFileSync(csvPath, 'utf-8');
    const lines = content.trim().split('\n');

    // Find puzzles within ±100 of target rating with 2000+ plays
    const candidates: RawPuzzle[] = [];
    const minRating = targetRating - 100;
    const maxRating = targetRating + 100;
    const excludeSet = new Set(excludeIds);

    for (let i = 1; i < lines.length && candidates.length < 500; i++) {
      const parts = lines[i].split(',');
      if (parts.length < 9) continue;

      const puzzleId = parts[0];
      const rating = parseInt(parts[3], 10);
      const nbPlays = parseInt(parts[6], 10);

      if (rating >= minRating && rating <= maxRating && nbPlays >= 2000 && !excludeSet.has(puzzleId)) {
        candidates.push({
          puzzleId,
          fen: parts[1],
          moves: parts[2],
          rating,
          nbPlays,
          themes: parts[7].split(' '),
          url: parts[8],
        });
      }
    }

    if (candidates.length === 0) {
      return NextResponse.json({ error: 'No puzzles found for this rating' }, { status: 404 });
    }

    // Use seeded random to pick a puzzle (consistent for the day)
    const index = Math.floor(seededRandom(seed + targetRating) * candidates.length);
    const puzzle = processPuzzle(candidates[index]);

    return NextResponse.json({ puzzle });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error}` }, { status: 500 });
  }
}
