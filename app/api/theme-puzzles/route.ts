import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { processPuzzleFromCSV, RawPuzzleCSV, ServerProcessedPuzzle } from '@/lib/puzzle-utils';

const BASE_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');

function loadPuzzlesWithThemes(bracket: string, theme1: string, theme2: string, limit: number = 20, exclude: string[] = []): ServerProcessedPuzzle[] {
  // Sanitize bracket to prevent path traversal
  const safeBracket = bracket.replace(/[^a-zA-Z0-9_-]/g, '');
  const bracketDir = join(BASE_DIR, safeBracket);
  if (!existsSync(bracketDir)) return [];

  const files = readdirSync(bracketDir).filter(f => f.endsWith('.csv'));
  const puzzles: ServerProcessedPuzzle[] = [];
  const seenIds = new Set<string>();

  // Shuffle files for variety
  const shuffledFiles = files.sort(() => Math.random() - 0.5);

  for (const file of shuffledFiles) {
    if (puzzles.length >= limit) break;

    const content = readFileSync(join(bracketDir, file), 'utf-8');
    const lines = content.trim().split('\n');

    // Shuffle lines for variety within each file
    const dataLines = lines.slice(1).sort(() => Math.random() - 0.5);

    for (const line of dataLines) {
      if (puzzles.length >= limit) break;

      const parts = line.split(',');
      if (parts.length < 9) continue;

      const puzzleId = parts[0];
      if (seenIds.has(puzzleId)) continue;

      const themes = parts[7].split(' ');

      // Check if puzzle has both required themes
      if (!themes.includes(theme1) || !themes.includes(theme2)) continue;

      // Check if puzzle has any excluded themes
      if (exclude.length > 0 && exclude.some(ex => themes.includes(ex))) continue;

      seenIds.add(puzzleId);

      const raw: RawPuzzleCSV = {
        puzzleId,
        fen: parts[1],
        moves: parts[2],
        rating: parseInt(parts[3], 10),
        themes,
      };

      const processed = processPuzzleFromCSV(raw);
      if (processed) {
        puzzles.push(processed);
      }
    }
  }

  // Final shuffle
  return puzzles.sort(() => Math.random() - 0.5);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const theme1 = searchParams.get('theme1');
  const theme2 = searchParams.get('theme2');
  const bracket = searchParams.get('bracket') || '0400-0800';
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const exclude = searchParams.get('exclude')?.split(',').filter(Boolean) || [];

  if (!theme1 || !theme2) {
    return NextResponse.json({ error: 'theme1 and theme2 are required' }, { status: 400 });
  }

  const puzzles = loadPuzzlesWithThemes(bracket, theme1, theme2, limit, exclude);

  return NextResponse.json({
    puzzles,
    query: { theme1, theme2, bracket, limit, exclude }
  });
}
