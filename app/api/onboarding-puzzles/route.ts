import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { Chess } from 'chess.js';

// Bundled diagnostic puzzles (for Vercel deployment)
import diagnosticPuzzles from '@/data/diagnostic-puzzles.json';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  nbPlays: number;
  themes: string[];
  url: string;
}

interface OnboardingPuzzle {
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

// Get rating bracket from puzzle target rating
function getRatingBracket(rating: number): string {
  if (rating < 800) return '0400-0800';
  if (rating < 1200) return '0800-1200';
  if (rating < 1600) return '1200-1600';
  if (rating < 2000) return '1600-2000';
  return '2000-plus';
}

// Process puzzle into onboarding format
function processPuzzle(raw: RawPuzzle): OnboardingPuzzle {
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
  const targetRating = parseInt(searchParams.get('rating') || '800', 10);
  const count = Math.min(parseInt(searchParams.get('count') || '5', 10), 20);
  const excludeIds = searchParams.get('exclude')?.split(',').filter(Boolean) || [];
  const theme = searchParams.get('theme'); // Optional theme filter

  // Try bundled diagnostic puzzles first (works on Vercel)
  const ratingKey = String(targetRating) as keyof typeof diagnosticPuzzles;
  const bundledPuzzles = diagnosticPuzzles[ratingKey];

  if (bundledPuzzles && bundledPuzzles.length > 0) {
    const excludeSet = new Set(excludeIds);
    const available = bundledPuzzles.filter((p: { puzzleId: string }) => !excludeSet.has(p.puzzleId));
    const shuffled = available.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    return NextResponse.json({
      puzzles: selected,
      targetRating,
      source: 'bundled',
    });
  }

  // Fall back to CSV files (local development)
  const ratingBracket = getRatingBracket(targetRating);
  const bracketDir = join(PUZZLES_DIR, ratingBracket);

  if (!existsSync(bracketDir)) {
    return NextResponse.json(
      { error: `Rating bracket not found: ${ratingBracket}` },
      { status: 404 }
    );
  }

  try {
    // Get theme files - filter to specific theme if provided
    let themeFiles = readdirSync(bracketDir).filter(f => f.endsWith('.csv'));

    if (theme) {
      // Try to find a file matching the theme
      const themeFile = themeFiles.find(f => f.toLowerCase().includes(theme.toLowerCase()));
      if (themeFile) {
        themeFiles = [themeFile];
      }
    }

    if (themeFiles.length === 0) {
      return NextResponse.json(
        { error: 'No puzzle files found' },
        { status: 404 }
      );
    }

    // Collect puzzles from all themes
    const allPuzzles: RawPuzzle[] = [];
    const excludeSet = new Set(excludeIds);

    for (const file of themeFiles) {
      const content = readFileSync(join(bracketDir, file), 'utf-8');
      const lines = content.trim().split('\n');

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length < 9) continue;

        const puzzleId = parts[0];
        const puzzleRating = parseInt(parts[3], 10);
        const nbPlays = parseInt(parts[6], 10);

        // Skip excluded puzzles and those with low play counts
        if (excludeSet.has(puzzleId) || nbPlays < 1000) continue;

        // Skip if already have this puzzle
        if (allPuzzles.some(p => p.puzzleId === puzzleId)) continue;

        // Filter to puzzles close to target rating (±200)
        if (Math.abs(puzzleRating - targetRating) <= 200) {
          allPuzzles.push({
            puzzleId,
            fen: parts[1],
            moves: parts[2],
            rating: puzzleRating,
            nbPlays,
            themes: parts[7].split(' '),
            url: parts[8],
          });
        }

        // Limit search for performance
        if (allPuzzles.length >= 100) break;
      }

      if (allPuzzles.length >= 100) break;
    }

    // If not enough puzzles in tight range, expand search
    if (allPuzzles.length < count) {
      for (const file of themeFiles) {
        const content = readFileSync(join(bracketDir, file), 'utf-8');
        const lines = content.trim().split('\n');

        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',');
          if (parts.length < 9) continue;

          const puzzleId = parts[0];
          const nbPlays = parseInt(parts[6], 10);

          if (excludeSet.has(puzzleId) || nbPlays < 500) continue;
          if (allPuzzles.some(p => p.puzzleId === puzzleId)) continue;

          allPuzzles.push({
            puzzleId,
            fen: parts[1],
            moves: parts[2],
            rating: parseInt(parts[3], 10),
            nbPlays,
            themes: parts[7].split(' '),
            url: parts[8],
          });

          if (allPuzzles.length >= 100) break;
        }

        if (allPuzzles.length >= 100) break;
      }
    }

    // Shuffle and select
    const shuffled = allPuzzles.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    // Process into onboarding format
    const puzzles = selected.map(processPuzzle);

    return NextResponse.json({
      puzzles,
      targetRating,
      ratingBracket,
      total: allPuzzles.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to load puzzles: ${error}` },
      { status: 500 }
    );
  }
}
