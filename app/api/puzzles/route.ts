import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { createClient } from '@/lib/supabase/server';
import { canUserSolvePuzzle } from '@/lib/subscription';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');

export interface LichessPuzzle {
  puzzleId: string;
  fen: string;
  moves: string[];
  rating: number;
  popularity: number;
  nbPlays: number;
  themes: string[];
  gameUrl: string;
}

function parseCSVLine(line: string): LichessPuzzle | null {
  // CSV format: PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
  const parts = line.split(',');
  if (parts.length < 9 || parts[0] === 'PuzzleId') return null;

  return {
    puzzleId: parts[0],
    fen: parts[1],
    moves: parts[2].split(' '),
    rating: parseInt(parts[3], 10),
    popularity: parseInt(parts[5], 10),
    nbPlays: parseInt(parts[6], 10),
    themes: parts[7].split(' '),
    gameUrl: parts[8],
  };
}

// Get rating bracket from user rating
function getRatingBracket(rating: number): string {
  if (rating < 800) return '0400-0800';
  if (rating < 1200) return '0800-1200';
  if (rating < 1600) return '1200-1600';
  if (rating < 2000) return '1600-2000';
  return '2000-plus';
}

// Get available themes for a rating bracket
function getAvailableThemes(ratingBracket: string): string[] {
  const dir = join(PUZZLES_DIR, ratingBracket);
  try {
    const files = readdirSync(dir);
    return files
      .filter(f => f.endsWith('.csv'))
      .map(f => f.replace('.csv', ''))
      .sort();
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode') || 'random'; // 'random', 'list', 'themes'
  const userRating = parseInt(searchParams.get('userRating') || '800', 10);
  const theme = searchParams.get('theme') || '';
  const count = Math.min(parseInt(searchParams.get('count') || '1', 10), 20);

  const ratingBracket = getRatingBracket(userRating);

  // Return available themes (no rate limiting for this)
  if (mode === 'themes') {
    const themes = getAvailableThemes(ratingBracket);
    return NextResponse.json({ themes, ratingBracket });
  }

  // Rate limiting check for puzzle requests
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { allowed, info } = await canUserSolvePuzzle(supabase, user?.id ?? null);

    if (!allowed && info) {
      return NextResponse.json(
        {
          error: 'Daily puzzle limit reached',
          upgradeRequired: true,
          dailyPuzzlesUsed: info.dailyPuzzlesUsed,
          dailyPuzzlesRemaining: info.dailyPuzzlesRemaining,
        },
        { status: 429 }
      );
    }
  } catch (error) {
    // If rate limiting fails, allow the request (fail open for better UX)
    console.error('Rate limiting check failed:', error);
  }

  // Pick random theme if not specified
  const selectedTheme = theme || (() => {
    const themes = getAvailableThemes(ratingBracket);
    return themes[Math.floor(Math.random() * themes.length)] || 'fork';
  })();

  const filePath = join(PUZZLES_DIR, ratingBracket, `${selectedTheme}.csv`);

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: `Theme not found: ${selectedTheme}` },
      { status: 404 }
    );
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');

    // Parse all valid puzzles
    const allPuzzles: LichessPuzzle[] = [];
    for (let i = 1; i < lines.length; i++) {
      const puzzle = parseCSVLine(lines[i]);
      if (puzzle && puzzle.nbPlays >= 1000) {
        // Filter to puzzles close to user's rating (±300)
        if (Math.abs(puzzle.rating - userRating) <= 300) {
          allPuzzles.push(puzzle);
        }
      }
    }

    // If not enough puzzles in rating range, expand search
    if (allPuzzles.length < count) {
      for (let i = 1; i < lines.length; i++) {
        const puzzle = parseCSVLine(lines[i]);
        if (puzzle && puzzle.nbPlays >= 1000) {
          if (!allPuzzles.find(p => p.puzzleId === puzzle.puzzleId)) {
            allPuzzles.push(puzzle);
          }
        }
        if (allPuzzles.length >= 100) break; // Limit for performance
      }
    }

    // Random selection
    const shuffled = allPuzzles.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    if (count === 1 && selected.length > 0) {
      return NextResponse.json({ puzzle: selected[0], theme: selectedTheme });
    }

    return NextResponse.json({
      puzzles: selected,
      total: allPuzzles.length,
      ratingBracket,
      theme: selectedTheme,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to read puzzles: ${error}` },
      { status: 500 }
    );
  }
}
