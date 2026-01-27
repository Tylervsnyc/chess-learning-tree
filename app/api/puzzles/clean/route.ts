import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Clean Puzzles API
 *
 * Serves community-verified puzzles (1000+ plays, single tactical theme)
 * from pre-extracted JSON files.
 *
 * Query params:
 *   - level: 1, 2, or 3
 *   - theme: fork, pin, skewer, checkmate, backRankMate, etc.
 *   - limit: number of puzzles to return (default 6)
 *   - offset: pagination offset (default 0)
 *   - minRating: filter by minimum rating
 *   - maxRating: filter by maximum rating
 */

interface CleanPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  popularity: number;
  nbPlays: number;
  theme: string;
  allThemes: string[];
  gameUrl: string;
}

interface CleanPuzzleFile {
  level: number;
  ratingRange: string;
  theme: string;
  count: number;
  puzzles: CleanPuzzle[];
}

// Cache loaded files
const fileCache: Record<string, CleanPuzzleFile> = {};

function loadPuzzleFile(level: number, theme: string): CleanPuzzleFile | null {
  const cacheKey = `level${level}-${theme}`;

  if (fileCache[cacheKey]) {
    return fileCache[cacheKey];
  }

  const filePath = path.join(process.cwd(), 'data', 'clean-puzzles-v2', `${cacheKey}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as CleanPuzzleFile;
    fileCache[cacheKey] = data;
    return data;
  } catch (e) {
    console.error(`Error loading puzzle file ${filePath}:`, e);
    return null;
  }
}

function listAvailableThemes(level: number): string[] {
  const dir = path.join(process.cwd(), 'data', 'clean-puzzles-v2');

  if (!fs.existsSync(dir)) {
    return [];
  }

  const prefix = `level${level}-`;
  const files = fs.readdirSync(dir).filter(f => f.startsWith(prefix) && f.endsWith('.json'));

  return files.map(f => f.replace(prefix, '').replace('.json', ''));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const level = parseInt(searchParams.get('level') || '1');
  const theme = searchParams.get('theme');
  const limit = parseInt(searchParams.get('limit') || '6');
  const offset = parseInt(searchParams.get('offset') || '0');
  const minRating = searchParams.get('minRating') ? parseInt(searchParams.get('minRating')!) : undefined;
  const maxRating = searchParams.get('maxRating') ? parseInt(searchParams.get('maxRating')!) : undefined;

  // Validate level
  if (level < 1 || level > 3) {
    return NextResponse.json({
      error: 'Invalid level. Must be 1, 2, or 3.',
    }, { status: 400 });
  }

  // If no theme specified, return available themes
  if (!theme) {
    const themes = listAvailableThemes(level);
    return NextResponse.json({
      level,
      availableThemes: themes,
      hint: 'Specify ?theme=fork to get puzzles',
    });
  }

  // Load puzzle file
  const data = loadPuzzleFile(level, theme);

  if (!data) {
    const available = listAvailableThemes(level);
    return NextResponse.json({
      error: `Theme "${theme}" not found for level ${level}`,
      availableThemes: available,
    }, { status: 404 });
  }

  // Filter by rating if specified
  let puzzles = data.puzzles;

  if (minRating !== undefined) {
    puzzles = puzzles.filter(p => p.rating >= minRating);
  }

  if (maxRating !== undefined) {
    puzzles = puzzles.filter(p => p.rating < maxRating);
  }

  // Apply pagination
  const total = puzzles.length;
  const paginatedPuzzles = puzzles.slice(offset, offset + limit);

  // Transform to API format
  const response = paginatedPuzzles.map(p => ({
    id: p.puzzleId,
    fen: p.fen,
    moves: p.moves.split(' '),
    rating: p.rating,
    popularity: p.popularity,
    plays: p.nbPlays,
    theme: p.theme,
    themes: p.allThemes,
    url: `https://lichess.org/training/${p.puzzleId}`,
  }));

  return NextResponse.json({
    level,
    theme,
    ratingRange: data.ratingRange,
    total,
    offset,
    limit,
    count: response.length,
    puzzles: response,
  });
}
