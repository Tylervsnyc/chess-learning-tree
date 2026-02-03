import { NextResponse } from 'next/server';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// Use the clean-puzzles-v2 JSON files that are deployed to production
const PUZZLES_DIR = join(process.cwd(), 'data', 'clean-puzzles-v2');

interface CleanPuzzle {
  puzzleId: string;
  fen: string;
  moves: string; // space-separated string in JSON files
  rating: number;
  theme: string;
  allThemes: string[];
  gameUrl: string;
}

interface LichessPuzzle {
  puzzleId: string;
  fen: string;
  moves: string[]; // API returns array
  rating: number;
  themes: string[];
  gameUrl: string;
}

// Seeded random number generator for consistent daily puzzles
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

// Get date seed (same for all users on same day)
function getDateSeed(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    const char = date.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// 20 puzzles with deliberate rating targets for smooth progression
const PUZZLE_TARGETS = [
  // Easy (400-800) - level1
  { min: 400, max: 550, level: 1 },
  { min: 500, max: 650, level: 1 },
  { min: 600, max: 750, level: 1 },
  { min: 700, max: 850, level: 1 },
  // Medium (800-1200) - level2
  { min: 800, max: 950, level: 2 },
  { min: 900, max: 1050, level: 2 },
  { min: 1000, max: 1150, level: 2 },
  { min: 1100, max: 1250, level: 2 },
  // Hard (1200-1600) - level3
  { min: 1200, max: 1350, level: 3 },
  { min: 1300, max: 1450, level: 3 },
  { min: 1400, max: 1550, level: 3 },
  { min: 1500, max: 1650, level: 3 },
  // Very Hard (1600-2000) - level4
  { min: 1600, max: 1750, level: 4 },
  { min: 1700, max: 1850, level: 4 },
  { min: 1800, max: 1950, level: 4 },
  { min: 1900, max: 2050, level: 4 },
  // Expert (2000+) - level5
  { min: 2000, max: 2150, level: 5 },
  { min: 2100, max: 2250, level: 5 },
  { min: 2200, max: 2400, level: 5 },
  { min: 2300, max: 2600, level: 5 },
];

// Prioritize tactical themes over endgame themes for variety
const TACTICAL_THEMES = [
  'fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck',
  'mateIn1', 'mateIn2', 'mateIn3', 'backRankMate', 'smotheredMate',
  'attraction', 'deflection', 'interference', 'clearance',
  'hangingPiece', 'trappedPiece', 'exposedKing', 'sacrifice',
  'advancedPawn', 'promotion', 'defensiveMove', 'xRayAttack',
  'crushing', 'kingsideAttack', 'queensideAttack',
];

function getThemesForLevel(level: number): string[] {
  try {
    const allFiles = readdirSync(PUZZLES_DIR)
      .filter(f => f.startsWith(`level${level}-`) && f.endsWith('.json'))
      .map(f => f.replace(`level${level}-`, '').replace('.json', ''));

    // Prioritize tactical themes
    const tactical = allFiles.filter(t => TACTICAL_THEMES.includes(t));
    return tactical.length >= 5 ? tactical : allFiles;
  } catch {
    return [];
  }
}

// Cache for loaded puzzle files to avoid re-reading
const puzzleCache = new Map<string, CleanPuzzle[]>();

function loadPuzzlesFromTheme(level: number, theme: string): CleanPuzzle[] {
  const cacheKey = `${level}-${theme}`;
  if (puzzleCache.has(cacheKey)) {
    return puzzleCache.get(cacheKey)!;
  }

  const filePath = join(PUZZLES_DIR, `level${level}-${theme}.json`);
  if (!existsSync(filePath)) return [];

  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    const puzzles = data.puzzles || [];
    puzzleCache.set(cacheKey, puzzles);
    return puzzles;
  } catch {
    return [];
  }
}

function getPuzzleFromTheme(
  level: number,
  theme: string,
  minRating: number,
  maxRating: number,
  random: () => number,
  usedPuzzleIds: Set<string>
): LichessPuzzle | null {
  const puzzles = loadPuzzlesFromTheme(level, theme);

  // Filter by rating and not already used
  const eligible = puzzles.filter(p =>
    p.rating >= minRating &&
    p.rating <= maxRating &&
    !usedPuzzleIds.has(p.puzzleId)
  );

  if (eligible.length === 0) return null;

  // Pick a random puzzle
  const idx = Math.floor(random() * eligible.length);
  const puzzle = eligible[idx];

  return {
    puzzleId: puzzle.puzzleId,
    fen: puzzle.fen,
    moves: puzzle.moves.split(' '), // Convert space-separated string to array
    rating: puzzle.rating,
    themes: puzzle.allThemes || [puzzle.theme],
    gameUrl: puzzle.gameUrl,
  };
}

function getPuzzlesFromLevel(
  level: number,
  minRating: number,
  maxRating: number,
  count: number,
  random: () => number,
  usedPuzzleIds: Set<string>,
  usedThemes: Set<string>
): LichessPuzzle[] {
  const themes = getThemesForLevel(level);
  if (themes.length === 0) return [];

  // Shuffle themes for variety
  const shuffledThemes = [...themes];
  for (let i = shuffledThemes.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffledThemes[i], shuffledThemes[j]] = [shuffledThemes[j], shuffledThemes[i]];
  }

  // Prefer themes we haven't used yet
  const sortedThemes = [
    ...shuffledThemes.filter(t => !usedThemes.has(t)),
    ...shuffledThemes.filter(t => usedThemes.has(t)),
  ];

  const puzzles: LichessPuzzle[] = [];

  for (const theme of sortedThemes) {
    if (puzzles.length >= count) break;

    const puzzle = getPuzzleFromTheme(level, theme, minRating, maxRating, random, usedPuzzleIds);
    if (puzzle) {
      puzzles.push(puzzle);
      usedPuzzleIds.add(puzzle.puzzleId);
      usedThemes.add(theme);
    }
  }

  return puzzles;
}

/**
 * GET /api/daily-challenge/puzzles
 * Returns today's daily challenge puzzles - same for all users
 * Puzzles progress from 400 ELO to 2400 ELO
 *
 * Dev mode: ?testSeed=123 to get different puzzles for testing
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testSeed = searchParams.get('testSeed');

  const today = new Date().toISOString().split('T')[0];
  const seed = testSeed ? parseInt(testSeed, 10) : getDateSeed(today);
  const random = seededRandom(seed);

  // Clear cache for fresh selection each request
  puzzleCache.clear();

  // Get one puzzle for each target rating range
  const allPuzzles: LichessPuzzle[] = [];
  const usedPuzzleIds = new Set<string>();
  const usedThemes = new Set<string>();

  for (const target of PUZZLE_TARGETS) {
    const puzzles = getPuzzlesFromLevel(
      target.level,
      target.min,
      target.max,
      1, // Just 1 puzzle per target
      random,
      usedPuzzleIds,
      usedThemes
    );
    if (puzzles.length > 0) {
      allPuzzles.push(puzzles[0]);
    }
  }

  // Sort by rating to ensure progression
  allPuzzles.sort((a, b) => a.rating - b.rating);

  return NextResponse.json({
    date: today,
    puzzles: allPuzzles,
  });
}
