import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getRatingBracket, processPuzzleFromCSV, RawPuzzleCSV } from '@/lib/puzzle-utils';

const PUZZLES_BASE = join(process.cwd(), 'data', 'puzzles-by-rating');

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

  const ratingDir = getRatingBracket(targetRating);
  const csvPath = join(PUZZLES_BASE, `${ratingDir}.csv`);

  try {
    const content = readFileSync(csvPath, 'utf-8');
    const lines = content.trim().split('\n');

    // Find puzzles within ±100 of target rating with 2000+ plays
    const candidates: RawPuzzleCSV[] = [];
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
    const puzzle = processPuzzleFromCSV(candidates[index]);

    return NextResponse.json({ puzzle });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error}` }, { status: 500 });
  }
}
