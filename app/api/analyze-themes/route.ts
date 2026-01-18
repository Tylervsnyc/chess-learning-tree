import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { analyzePuzzle, PuzzleAnalysis } from '@/lib/theme-analyzer';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ratingBand = searchParams.get('rating') || '0400-0800';
  const batchSize = parseInt(searchParams.get('batch') || '10', 10);
  const minPlays = parseInt(searchParams.get('minPlays') || '5000', 10);
  const excludeParam = searchParams.get('exclude') || '';
  const excludeSet = new Set(excludeParam ? excludeParam.split(',') : []);

  const ratingDir = join(PUZZLES_DIR, ratingBand);

  if (!existsSync(ratingDir)) {
    return NextResponse.json({ error: 'Rating band not found' }, { status: 404 });
  }

  try {
    // Exclude generic/overlapping theme files for better variety
    const EXCLUDED_THEMES = [
      'advancedPawn.csv',  // Too generic, overlaps with promotion
      'endgame.csv',       // Too generic, use specific endgame types instead
      'sacrifice.csv',     // Usually a means to an end, not primary tactic
      'exposedKing.csv',   // Describes position, not tactic
    ];

    // Get all theme files in this rating band
    const themeFiles = readdirSync(ratingDir)
      .filter(f => f.endsWith('.csv') && !EXCLUDED_THEMES.includes(f));

    // Collect puzzles grouped by their source theme for variety
    const puzzlesByTheme: Map<string, Array<{
      puzzleId: string;
      fen: string;
      moves: string;
      rating: number;
      nbPlays: number;
      themes: string;
      url: string;
      sourceTheme: string;
    }>> = new Map();

    const seenPuzzleIds = new Set<string>();

    // Read puzzles from each theme file, filtering by minPlays and exclusions
    for (const themeFile of themeFiles) {
      const themeName = themeFile.replace('.csv', '');
      const filePath = join(ratingDir, themeFile);
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.trim().split('\n');

      const themePuzzles: typeof puzzlesByTheme extends Map<string, infer T> ? T : never = [];

      // Skip header, collect puzzles that meet criteria
      for (let i = 1; i < lines.length && themePuzzles.length < 20; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 9) {
          const puzzleId = parts[0];
          const nbPlays = parseInt(parts[6], 10);

          // Skip if already seen, excluded, or not enough plays
          if (seenPuzzleIds.has(puzzleId) || excludeSet.has(puzzleId) || nbPlays < minPlays) {
            continue;
          }

          seenPuzzleIds.add(puzzleId);
          themePuzzles.push({
            puzzleId,
            fen: parts[1],
            moves: parts[2],
            rating: parseInt(parts[3], 10),
            nbPlays,
            themes: parts[7],
            url: parts[8],
            sourceTheme: themeName
          });
        }
      }

      if (themePuzzles.length > 0) {
        // Shuffle puzzles within each theme
        themePuzzles.sort(() => Math.random() - 0.5);
        puzzlesByTheme.set(themeName, themePuzzles);
      }
    }

    // Round-robin select from different themes for variety
    const batch: Array<{
      puzzleId: string;
      fen: string;
      moves: string;
      rating: number;
      nbPlays: number;
      themes: string;
      url: string;
      sourceTheme: string;
    }> = [];

    const themeNames = Array.from(puzzlesByTheme.keys());
    // Shuffle theme order for variety
    themeNames.sort(() => Math.random() - 0.5);

    let themeIndex = 0;
    const themePositions = new Map<string, number>();
    themeNames.forEach(t => themePositions.set(t, 0));

    while (batch.length < batchSize && themeNames.length > 0) {
      const themeName = themeNames[themeIndex % themeNames.length];
      const themePuzzles = puzzlesByTheme.get(themeName)!;
      const pos = themePositions.get(themeName)!;

      if (pos < themePuzzles.length) {
        batch.push(themePuzzles[pos]);
        themePositions.set(themeName, pos + 1);
      }

      themeIndex++;

      // Break if we've gone through all themes without finding new puzzles
      if (themeIndex >= themeNames.length * 20) break;
    }

    // Final shuffle so themes aren't in predictable order
    batch.sort(() => Math.random() - 0.5);

    // Analyze each puzzle
    const analyzed: PuzzleAnalysis[] = batch.map(p =>
      analyzePuzzle(p.puzzleId, p.fen, p.moves, p.rating, p.themes, p.url)
    );

    return NextResponse.json({
      puzzles: analyzed,
      total: seenPuzzleIds.size,
      batchSize,
      minPlays,
      ratingBand,
      excludedCount: excludeSet.size
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error}` }, { status: 500 });
  }
}
