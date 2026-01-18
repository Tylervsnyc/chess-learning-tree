import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');

export interface LichessPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  popularity: number;
  nbPlays: number;
  themes: string;
  gameUrl: string;
}

function parseCSVLine(line: string): LichessPuzzle | null {
  // CSV format: PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
  const parts = line.split(',');
  if (parts.length < 9) return null;

  return {
    puzzleId: parts[0],
    fen: parts[1],
    moves: parts[2],
    rating: parseInt(parts[3], 10),
    popularity: parseInt(parts[5], 10),
    nbPlays: parseInt(parts[6], 10),
    themes: parts[7],
    gameUrl: parts[8],
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ratingBand = searchParams.get('rating') || '0800-1200';
  const theme = searchParams.get('theme') || 'defensiveMove';
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const limit = parseInt(searchParams.get('limit') || '100', 10);
  const minPlays = parseInt(searchParams.get('minPlays') || '5000', 10);

  const filePath = join(PUZZLES_DIR, ratingBand, `${theme}.csv`);

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: `File not found: ${ratingBand}/${theme}.csv` },
      { status: 404 }
    );
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');

    // Skip header, filter by minPlays, apply offset and limit
    const puzzles: LichessPuzzle[] = [];
    let skipped = 0;
    let totalMatching = 0;

    for (let i = 1; i < lines.length; i++) {
      const puzzle = parseCSVLine(lines[i]);
      if (puzzle && puzzle.nbPlays >= minPlays) {
        totalMatching++;
        if (skipped < offset) {
          skipped++;
          continue;
        }
        if (puzzles.length < limit) {
          puzzles.push(puzzle);
        }
      }
    }

    return NextResponse.json({
      puzzles,
      total: totalMatching,
      offset,
      limit,
      minPlays,
      ratingBand,
      theme,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to read file: ${error}` },
      { status: 500 }
    );
  }
}
