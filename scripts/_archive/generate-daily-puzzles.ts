/**
 * Generate Daily Rook Puzzles
 *
 * Creates a JSON file with pre-selected puzzles for the next 90 days.
 * Each day gets 22 puzzles with linear difficulty (400 → ~2200 ELO).
 * First 3 puzzles are all ~400 rating to build confidence.
 * Same seed = same puzzles, so all users get identical puzzles on a given day.
 *
 * Data source: data/clean-puzzles-v2/level{1-8}-{theme}.json
 *
 * Usage: npx ts-node scripts/generate-daily-puzzles.ts
 *
 * Output: data/daily-challenge-puzzles.json
 */

import * as fs from 'fs';
import * as path from 'path';

const CLEAN_PUZZLES_DIR = path.join(process.cwd(), 'data', 'clean-puzzles-v2');
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'daily-challenge-puzzles.json');
const DAYS_TO_GENERATE = 90;

interface Puzzle {
  puzzleId: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
  gameUrl: string;
}

interface DailyChallengePuzzles {
  generatedAt: string;
  coverageStart: string;
  coverageEnd: string;
  days: Record<string, Puzzle[]>;
}

// Seeded random number generator (same as API)
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

// Get date seed (same as API)
function getDateSeed(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    const char = date.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// 22 puzzle targets: first 3 at ~400 (confidence), then 500 → ~2200 in 100-step increments.
// Each target maps to one or more level files in clean-puzzles-v2.
// clean-puzzles-v2 levels: 1=400-800, 2=800-1000, 3=1000-1200, 4=1200-1400,
// 5=1400-1600, 6=1600-1800, 7=1800-2000, 8=2000-2199.
const PUZZLE_TARGETS: Array<{ min: number; max: number; levels: number[] }> = [
  { min: 350, max: 475, levels: [1] },        // #1  - 400 (confidence)
  { min: 350, max: 475, levels: [1] },        // #2  - 400 (confidence)
  { min: 350, max: 475, levels: [1] },        // #3  - 400 (confidence)
  { min: 425, max: 575, levels: [1] },        // #4  - 500
  { min: 525, max: 675, levels: [1] },        // #5  - 600
  { min: 625, max: 775, levels: [1] },        // #6  - 700
  { min: 725, max: 875, levels: [1, 2] },     // #7  - 800
  { min: 825, max: 975, levels: [2] },        // #8  - 900
  { min: 925, max: 1075, levels: [2, 3] },    // #9  - 1000
  { min: 1025, max: 1175, levels: [3] },      // #10 - 1100
  { min: 1125, max: 1275, levels: [3, 4] },   // #11 - 1200
  { min: 1225, max: 1375, levels: [4] },      // #12 - 1300
  { min: 1325, max: 1475, levels: [4, 5] },   // #13 - 1400
  { min: 1425, max: 1575, levels: [5] },      // #14 - 1500
  { min: 1525, max: 1675, levels: [5, 6] },   // #15 - 1600
  { min: 1625, max: 1775, levels: [6] },      // #16 - 1700
  { min: 1725, max: 1875, levels: [6, 7] },   // #17 - 1800
  { min: 1825, max: 1975, levels: [7] },      // #18 - 1900
  { min: 1925, max: 2075, levels: [7, 8] },   // #19 - 2000
  { min: 2025, max: 2175, levels: [8] },      // #20 - 2100
  { min: 2100, max: 2199, levels: [8] },      // #21 - 2150
  { min: 2150, max: 2199, levels: [8] },      // #22 - 2199 (top of available range)
];

// Tactical themes to prioritize
const TACTICAL_THEMES = [
  'fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck',
  'mateIn1', 'mateIn2', 'mateIn3', 'backRankMate', 'smotheredMate',
  'attraction', 'deflection', 'interference', 'clearance',
  'hangingPiece', 'trappedPiece', 'exposedKing', 'sacrifice',
  'promotion', 'defensiveMove', 'xRayAttack',
  'crushing', 'kingsideAttack', 'queensideAttack',
];

interface CleanPuzzleFile {
  level: number;
  ratingRange: string;
  theme: string;
  puzzles: Array<{
    puzzleId: string;
    fen: string;
    moves: string;
    rating: number;
    allThemes?: string[];
    gameUrl: string;
  }>;
}

// Per-level Map<theme, Puzzle[]>
type LevelPuzzles = Map<string, Puzzle[]>;

// Load puzzles for a single level from clean-puzzles-v2 JSON files
function loadPuzzlesForLevel(level: number): LevelPuzzles {
  const puzzlesByTheme: LevelPuzzles = new Map();
  const prefix = `level${level}-`;

  if (!fs.existsSync(CLEAN_PUZZLES_DIR)) {
    console.warn(`  Warning: clean-puzzles-v2 dir not found: ${CLEAN_PUZZLES_DIR}`);
    return puzzlesByTheme;
  }

  const files = fs.readdirSync(CLEAN_PUZZLES_DIR)
    .filter(f => f.startsWith(prefix) && f.endsWith('.json'));

  for (const file of files) {
    const theme = file.replace(prefix, '').replace('.json', '');

    // Only load tactical themes
    if (!TACTICAL_THEMES.includes(theme)) continue;

    try {
      const content = fs.readFileSync(path.join(CLEAN_PUZZLES_DIR, file), 'utf-8');
      const data = JSON.parse(content) as CleanPuzzleFile;
      const puzzles: Puzzle[] = data.puzzles.map(p => ({
        puzzleId: p.puzzleId,
        fen: p.fen,
        moves: p.moves.split(' '),
        rating: p.rating,
        themes: p.allThemes ?? [theme],
        gameUrl: p.gameUrl,
      }));
      puzzlesByTheme.set(theme, puzzles);
    } catch (e) {
      console.error(`  Error loading ${file}:`, e);
    }
  }

  return puzzlesByTheme;
}

// Load all puzzles for all 8 levels
function loadAllPuzzles(): Map<number, LevelPuzzles> {
  const allPuzzles = new Map<number, LevelPuzzles>();

  for (let level = 1; level <= 8; level++) {
    console.log(`  Loading level${level}...`);
    const puzzles = loadPuzzlesForLevel(level);
    allPuzzles.set(level, puzzles);

    let count = 0;
    puzzles.forEach(p => count += p.length);
    console.log(`    Loaded ${puzzles.size} themes, ${count} puzzles`);
  }

  return allPuzzles;
}

// Get a flat Map<theme, Puzzle[]> by merging the requested levels
function mergeLevels(
  allPuzzles: Map<number, LevelPuzzles>,
  levels: number[],
): LevelPuzzles {
  const merged: LevelPuzzles = new Map();
  for (const level of levels) {
    const levelPuzzles = allPuzzles.get(level);
    if (!levelPuzzles) continue;
    levelPuzzles.forEach((puzzles, theme) => {
      const existing = merged.get(theme) ?? [];
      merged.set(theme, existing.concat(puzzles));
    });
  }
  return merged;
}

// Generate puzzles for a single day
function generateDayPuzzles(
  date: string,
  allPuzzles: Map<number, LevelPuzzles>,
): Puzzle[] {
  const seed = getDateSeed(date);
  const random = seededRandom(seed);

  const puzzles: Puzzle[] = [];
  const usedPuzzleIds = new Set<string>();
  const usedThemes = new Set<string>();
  let lastPrimaryTheme = ''; // Track previous puzzle's primary Lichess theme for diversity

  for (const target of PUZZLE_TARGETS) {
    const targetPuzzles = mergeLevels(allPuzzles, target.levels);
    const themes = Array.from(targetPuzzles.keys());
    if (themes.length === 0) continue;

    // Shuffle themes
    const shuffled = [...themes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Prefer unused themes
    const sorted = [
      ...shuffled.filter(t => !usedThemes.has(t)),
      ...shuffled.filter(t => usedThemes.has(t)),
    ];

    // Find a puzzle — prefer one whose primary theme differs from the last puzzle's
    let found = false;
    for (const theme of sorted) {
      const themePuzzles = targetPuzzles.get(theme) || [];

      // Filter by rating range, not used, and different primary theme from last puzzle
      let eligible = themePuzzles.filter(p =>
        p.rating >= target.min &&
        p.rating <= target.max &&
        !usedPuzzleIds.has(p.puzzleId) &&
        p.themes[0] !== lastPrimaryTheme
      );

      // If no eligible with different theme, allow same theme as fallback
      if (eligible.length === 0) {
        eligible = themePuzzles.filter(p =>
          p.rating >= target.min &&
          p.rating <= target.max &&
          !usedPuzzleIds.has(p.puzzleId)
        );
      }

      if (eligible.length === 0) continue;

      const idx = Math.floor(random() * eligible.length);
      const puzzle = eligible[idx];

      puzzles.push({ ...puzzle });

      usedPuzzleIds.add(puzzle.puzzleId);
      usedThemes.add(theme);
      lastPrimaryTheme = puzzle.themes[0];
      found = true;
      break;
    }

    if (!found) {
      // Fallback: try any puzzle in a wider rating range across all themes
      for (const theme of sorted) {
        const themePuzzles = targetPuzzles.get(theme) || [];

        const eligible = themePuzzles.filter(p =>
          p.rating >= target.min - 50 &&
          p.rating <= target.max + 100 &&
          !usedPuzzleIds.has(p.puzzleId)
        );

        if (eligible.length === 0) continue;

        const idx = Math.floor(random() * eligible.length);
        const puzzle = eligible[idx];

        puzzles.push({ ...puzzle });

        usedPuzzleIds.add(puzzle.puzzleId);
        usedThemes.add(theme);
        lastPrimaryTheme = puzzle.themes[0];
        break;
      }
    }
  }

  // Sort by rating
  puzzles.sort((a, b) => a.rating - b.rating);

  // Post-sort theme diversity: swap consecutive puzzles that share the same primary theme
  for (let i = 1; i < puzzles.length - 1; i++) {
    if (puzzles[i].themes[0] === puzzles[i - 1].themes[0]) {
      // Try swapping with the next puzzle if it has a different theme
      if (puzzles[i + 1].themes[0] !== puzzles[i - 1].themes[0]) {
        [puzzles[i], puzzles[i + 1]] = [puzzles[i + 1], puzzles[i]];
      }
    }
  }

  return puzzles;
}

// Main
function main() {
  console.log('Loading puzzle files from clean-puzzles-v2...');
  const allPuzzles = loadAllPuzzles();

  const today = new Date();
  const output: DailyChallengePuzzles = {
    generatedAt: new Date().toISOString(),
    coverageStart: today.toISOString().split('T')[0],
    coverageEnd: '',
    days: {},
  };

  console.log(`\nGenerating puzzles for ${DAYS_TO_GENERATE} days...`);

  let minPuzzles = 22;
  let maxPuzzles = 0;

  for (let i = 0; i < DAYS_TO_GENERATE; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const puzzles = generateDayPuzzles(dateStr, allPuzzles);
    output.days[dateStr] = puzzles;

    minPuzzles = Math.min(minPuzzles, puzzles.length);
    maxPuzzles = Math.max(maxPuzzles, puzzles.length);

    if (i === 0) {
      console.log(`  ${dateStr}: ${puzzles.length} puzzles`);
      console.log(`    Ratings: ${puzzles.map(p => p.rating).join(', ')}`);
    }
  }

  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + DAYS_TO_GENERATE - 1);
  output.coverageEnd = endDate.toISOString().split('T')[0];

  console.log(`\nPuzzle counts: min=${minPuzzles}, max=${maxPuzzles}`);

  console.log(`\nWriting to ${OUTPUT_FILE}...`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  const stats = fs.statSync(OUTPUT_FILE);
  console.log(`Done! File size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`Coverage: ${output.coverageStart} to ${output.coverageEnd}`);
}

main();
