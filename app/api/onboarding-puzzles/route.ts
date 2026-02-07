import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { getRatingBracket, processPuzzleFromCSV, RawPuzzleCSV } from '@/lib/puzzle-utils';

// Bundled diagnostic puzzles (for Vercel deployment)
import diagnosticPuzzles from '@/data/diagnostic-puzzles.json';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');

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
    const allPuzzles: RawPuzzleCSV[] = [];
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
    const puzzles = selected.map(p => processPuzzleFromCSV(p)).filter(Boolean);

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
