import { NextResponse } from 'next/server';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const PUZZLES_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');

interface LichessPuzzle {
  puzzleId: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
  gameUrl: string;
}

function parseCSVLine(line: string): LichessPuzzle | null {
  const parts = line.split(',');
  if (parts.length < 9 || parts[0] === 'PuzzleId') return null;

  return {
    puzzleId: parts[0],
    fen: parts[1],
    moves: parts[2].split(' '),
    rating: parseInt(parts[3], 10),
    themes: parts[7].split(' '),
    gameUrl: parts[8],
  };
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
// Each puzzle targets a specific rating range
const PUZZLE_TARGETS = [
  // Easy (400-800)
  { min: 400, max: 550, bracket: '0400-0800' },
  { min: 500, max: 650, bracket: '0400-0800' },
  { min: 600, max: 750, bracket: '0400-0800' },
  { min: 700, max: 850, bracket: '0400-0800' },
  // Medium (800-1200)
  { min: 800, max: 950, bracket: '0800-1200' },
  { min: 900, max: 1050, bracket: '0800-1200' },
  { min: 1000, max: 1150, bracket: '0800-1200' },
  { min: 1100, max: 1250, bracket: '0800-1200' },
  // Hard (1200-1600)
  { min: 1200, max: 1350, bracket: '1200-1600' },
  { min: 1300, max: 1450, bracket: '1200-1600' },
  { min: 1400, max: 1550, bracket: '1200-1600' },
  { min: 1500, max: 1650, bracket: '1200-1600' },
  // Very Hard (1600-2000)
  { min: 1600, max: 1750, bracket: '1600-2000' },
  { min: 1700, max: 1850, bracket: '1600-2000' },
  { min: 1800, max: 1950, bracket: '1600-2000' },
  { min: 1900, max: 2050, bracket: '1600-2000' },
  // Expert (2000+)
  { min: 2000, max: 2150, bracket: '2000-plus' },
  { min: 2100, max: 2250, bracket: '2000-plus' },
  { min: 2200, max: 2400, bracket: '2000-plus' },
  { min: 2300, max: 2600, bracket: '2000-plus' },
];

// Prioritize tactical themes over endgame themes for variety
const TACTICAL_THEMES = [
  'fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck',
  'mateIn1', 'mateIn2', 'mateIn3', 'backRankMate', 'smotheredMate',
  'attraction', 'deflection', 'interference', 'clearance',
  'hangingPiece', 'trappedPiece', 'exposedKing', 'sacrifice',
  'advancedPawn', 'promotion', 'defensiveMove', 'xRayAttack',
];

function getAllThemes(bracket: string): string[] {
  const dir = join(PUZZLES_DIR, bracket);
  try {
    const allThemes = readdirSync(dir)
      .filter(f => f.endsWith('.csv'))
      .map(f => f.replace('.csv', ''));

    // Prioritize tactical themes, filter out pure endgame themes
    const tactical = allThemes.filter(t => TACTICAL_THEMES.includes(t));
    // If we have tactical themes, prefer those; otherwise use all
    return tactical.length >= 5 ? tactical : allThemes;
  } catch {
    return [];
  }
}

function getPuzzleFromTheme(
  bracket: string,
  theme: string,
  minRating: number,
  maxRating: number,
  random: () => number,
  usedPuzzleIds: Set<string>
): LichessPuzzle | null {
  const filePath = join(PUZZLES_DIR, bracket, `${theme}.csv`);
  if (!existsSync(filePath)) return null;

  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');

    const puzzles: LichessPuzzle[] = [];
    for (let i = 1; i < lines.length; i++) {
      const puzzle = parseCSVLine(lines[i]);
      if (puzzle &&
          puzzle.rating >= minRating &&
          puzzle.rating <= maxRating &&
          !usedPuzzleIds.has(puzzle.puzzleId)) {
        puzzles.push(puzzle);
      }
    }

    if (puzzles.length === 0) return null;

    // Pick a random puzzle from this theme
    const idx = Math.floor(random() * puzzles.length);
    return puzzles[idx];
  } catch {
    return null;
  }
}

function getPuzzlesFromBracket(
  bracket: string,
  minRating: number,
  maxRating: number,
  count: number,
  random: () => number,
  usedPuzzleIds: Set<string>,
  usedThemes: Set<string>
): LichessPuzzle[] {
  const themes = getAllThemes(bracket);
  if (themes.length === 0) return [];

  // Shuffle themes to get variety
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

    const puzzle = getPuzzleFromTheme(bracket, theme, minRating, maxRating, random, usedPuzzleIds);
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
 * Puzzles progress from 400 ELO to 2000 ELO
 *
 * Dev mode: ?testSeed=123 to get different puzzles for testing
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testSeed = searchParams.get('testSeed');

  const today = new Date().toISOString().split('T')[0];
  const seed = testSeed ? parseInt(testSeed, 10) : getDateSeed(today);
  const random = seededRandom(seed);

  // Get one puzzle for each target rating range
  const allPuzzles: LichessPuzzle[] = [];
  const usedPuzzleIds = new Set<string>();
  const usedThemes = new Set<string>();

  for (const target of PUZZLE_TARGETS) {
    const puzzles = getPuzzlesFromBracket(
      target.bracket,
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

  // Already in order by target, but sort to be safe
  allPuzzles.sort((a, b) => a.rating - b.rating);

  return NextResponse.json({
    date: today,
    puzzles: allPuzzles,
  });
}
