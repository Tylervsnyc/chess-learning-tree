import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import {
  Puzzle,
  LessonSelectionCriteria,
  selectPuzzlesForLesson,
} from '@/lib/puzzle-selector';

/**
 * Lesson Puzzles API
 *
 * Selects 6 puzzles for a lesson using educational best practices:
 * - Difficulty curve (easy → hard)
 * - Solution diversity (no similar moves consecutively)
 * - Theme interleaving for mixed practice
 * - No repeat puzzles
 *
 * Query params:
 *   - lessonId: Lesson ID (e.g., "1.1.1") to look up criteria
 *   - excludeIds: Comma-separated puzzle IDs to exclude (for reviews)
 *
 * Or direct criteria:
 *   - level: 1-5 (determined from ratingMin)
 *   - themes: Comma-separated themes
 *   - mixed: "true" for mixed practice (any theme matches)
 *   - ratingMin, ratingMax: Rating range
 *   - minPlays: Minimum play count
 *   - pieceFilter: queen, rook, bishop, knight, pawn
 *   - excludeThemes: Comma-separated themes to exclude
 *   - excludeIds: Comma-separated puzzle IDs to exclude
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

function transformToPuzzle(p: CleanPuzzle): Puzzle {
  return {
    id: p.puzzleId,
    fen: p.fen,
    moves: p.moves.split(' '),
    rating: p.rating,
    popularity: p.popularity,
    plays: p.nbPlays,
    theme: p.theme,
    themes: p.allThemes,
    url: `https://lichess.org/training/${p.puzzleId}`,
  };
}

function getLevelFromRating(ratingMin: number): number {
  if (ratingMin < 800) return 1;
  if (ratingMin < 1000) return 2;
  if (ratingMin < 1200) return 3;
  if (ratingMin < 1400) return 4;
  return 5;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse parameters
  const themesParam = searchParams.get('themes');
  const isMixed = searchParams.get('mixed') === 'true';
  const ratingMin = parseInt(searchParams.get('ratingMin') || '400');
  const ratingMax = parseInt(searchParams.get('ratingMax') || '800');
  const minPlays = parseInt(searchParams.get('minPlays') || '1000');
  const pieceFilter = searchParams.get('pieceFilter') as 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn' | null;
  const excludeThemesParam = searchParams.get('excludeThemes');
  const excludeIdsParam = searchParams.get('excludeIds');

  // Validate themes
  if (!themesParam) {
    return NextResponse.json({
      error: 'Missing required parameter: themes',
      example: '/api/puzzles/lesson?themes=fork,pin&ratingMin=800&ratingMax=1000',
    }, { status: 400 });
  }

  const themes = themesParam.split(',').map(t => t.trim());
  const excludeThemes = excludeThemesParam?.split(',').map(t => t.trim());
  const excludePuzzleIds = excludeIdsParam?.split(',').map(id => id.trim());

  // Determine level from rating
  const level = getLevelFromRating(ratingMin);

  // Load puzzles for each theme
  const allPuzzles: Puzzle[] = [];
  const loadedThemes: string[] = [];
  const missingThemes: string[] = [];

  for (const theme of themes) {
    const data = loadPuzzleFile(level, theme);
    if (data) {
      loadedThemes.push(theme);
      allPuzzles.push(...data.puzzles.map(transformToPuzzle));
    } else {
      missingThemes.push(theme);
    }
  }

  if (allPuzzles.length === 0) {
    const available = listAvailableThemes(level);
    return NextResponse.json({
      error: `No puzzles found for themes: ${themes.join(', ')}`,
      availableThemes: available,
      level,
    }, { status: 404 });
  }

  // Build selection criteria
  const criteria: LessonSelectionCriteria = {
    themes,
    isMixedPractice: isMixed,
    excludeThemes,
    ratingMin,
    ratingMax,
    minPlays,
    pieceFilter: pieceFilter || undefined,
    excludePuzzleIds,
  };

  // Select puzzles using the algorithm
  const result = selectPuzzlesForLesson(allPuzzles, criteria);

  // Transform for API response
  const response = {
    puzzles: result.puzzles.map(p => ({
      id: p.id,
      fen: p.fen,
      moves: p.moves,
      rating: p.rating,
      popularity: p.popularity,
      plays: p.plays,
      theme: p.theme,
      themes: p.themes,
      url: p.url,
    })),
    selection: {
      criteria: {
        themes: loadedThemes,
        missingThemes,
        isMixedPractice: isMixed,
        ratingRange: `${ratingMin}-${ratingMax}`,
        minPlays,
        pieceFilter: pieceFilter || 'any',
      },
      metadata: result.metadata,
      difficultyDistribution: result.puzzles.map((p, i) => ({
        position: i + 1,
        tier: i < 2 ? 'easy' : i < 4 ? 'medium' : 'hard',
        rating: p.rating,
        theme: p.theme,
      })),
    },
  };

  return NextResponse.json(response);
}
