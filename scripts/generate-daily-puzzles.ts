/**
 * Generate Daily Challenge Puzzles
 *
 * Creates a JSON file with pre-selected puzzles for the next 90 days.
 * Each day gets 22 puzzles with linear difficulty (400 → 2300 ELO).
 * First 3 puzzles are all ~400 rating to build confidence.
 * Same seed = same puzzles, so all users get identical puzzles on a given day.
 *
 * Data sources:
 * - clean-puzzles-v2/*.json for levels 1-5 (400-1600)
 * - puzzles-by-rating/*.csv for 1600-2000 and 2000+ brackets
 *
 * Usage: npx ts-node scripts/generate-daily-puzzles.ts
 *
 * Output: data/daily-challenge-puzzles.json
 */

import * as fs from 'fs';
import * as path from 'path';

const CLEAN_PUZZLES_DIR = path.join(process.cwd(), 'data', 'clean-puzzles-v2');
const RAW_PUZZLES_DIR = path.join(process.cwd(), 'data', 'puzzles-by-rating');
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

// 22 puzzle targets: first 3 at ~400 (confidence), then 500 → 2300 in 100-step increments
// Each target maps to the appropriate bracket folder in puzzles-by-rating
const PUZZLE_TARGETS = [
  { min: 350, max: 475, bracket: '0400-0800' },   // #1  - 400 (confidence)
  { min: 350, max: 475, bracket: '0400-0800' },   // #2  - 400 (confidence)
  { min: 350, max: 475, bracket: '0400-0800' },   // #3  - 400 (confidence)
  { min: 425, max: 575, bracket: '0400-0800' },   // #4  - 500
  { min: 525, max: 675, bracket: '0400-0800' },   // #5  - 600
  { min: 625, max: 775, bracket: '0400-0800' },   // #6  - 700
  { min: 725, max: 875, bracket: '0800-1200' },   // #7  - 800
  { min: 825, max: 975, bracket: '0800-1200' },   // #8  - 900
  { min: 925, max: 1075, bracket: '0800-1200' },  // #9  - 1000
  { min: 1025, max: 1175, bracket: '0800-1200' }, // #10 - 1100
  { min: 1125, max: 1275, bracket: '1200-1600' }, // #11 - 1200
  { min: 1225, max: 1375, bracket: '1200-1600' }, // #12 - 1300
  { min: 1325, max: 1475, bracket: '1200-1600' }, // #13 - 1400
  { min: 1425, max: 1575, bracket: '1200-1600' }, // #14 - 1500
  { min: 1525, max: 1675, bracket: '1600-2000' }, // #15 - 1600
  { min: 1625, max: 1775, bracket: '1600-2000' }, // #16 - 1700
  { min: 1725, max: 1875, bracket: '1600-2000' }, // #17 - 1800
  { min: 1825, max: 1975, bracket: '1600-2000' }, // #18 - 1900
  { min: 1925, max: 2075, bracket: '2000-plus' }, // #19 - 2000
  { min: 2025, max: 2175, bracket: '2000-plus' }, // #20 - 2100
  { min: 2100, max: 2300, bracket: '2000-plus' }, // #21 - 2200
  { min: 2200, max: 2500, bracket: '2000-plus' }, // #22 - 2300
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

// Parse CSV line from Lichess puzzle format
function parseCSVLine(line: string): Puzzle | null {
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

// Load puzzles from CSV files in a bracket folder
function loadPuzzlesFromBracket(bracket: string): Map<string, Puzzle[]> {
  const puzzlesByTheme = new Map<string, Puzzle[]>();
  const bracketDir = path.join(RAW_PUZZLES_DIR, bracket);

  if (!fs.existsSync(bracketDir)) {
    console.warn(`  Warning: Bracket directory not found: ${bracketDir}`);
    return puzzlesByTheme;
  }

  const files = fs.readdirSync(bracketDir).filter(f => f.endsWith('.csv'));

  for (const file of files) {
    const theme = file.replace('.csv', '');

    // Only load tactical themes to keep memory usage reasonable
    if (!TACTICAL_THEMES.includes(theme)) continue;

    try {
      const content = fs.readFileSync(path.join(bracketDir, file), 'utf-8');
      const lines = content.trim().split('\n');
      const puzzles: Puzzle[] = [];

      // Sample to keep memory reasonable (max 2000 per theme)
      const sampleRate = lines.length > 2000 ? Math.floor(lines.length / 2000) : 1;

      for (let i = 1; i < lines.length; i += sampleRate) {
        const puzzle = parseCSVLine(lines[i]);
        if (puzzle) {
          puzzles.push(puzzle);
        }
      }

      puzzlesByTheme.set(theme, puzzles);
    } catch (e) {
      console.error(`  Error loading ${bracket}/${file}:`, e);
    }
  }

  return puzzlesByTheme;
}

// Load all puzzles from all brackets
function loadAllPuzzles(): Map<string, Map<string, Puzzle[]>> {
  const brackets = ['0400-0800', '0800-1200', '1200-1600', '1600-2000', '2000-plus'];
  const allPuzzles = new Map<string, Map<string, Puzzle[]>>();

  for (const bracket of brackets) {
    console.log(`  Loading ${bracket}...`);
    const puzzles = loadPuzzlesFromBracket(bracket);
    allPuzzles.set(bracket, puzzles);

    let count = 0;
    puzzles.forEach(p => count += p.length);
    console.log(`    Loaded ${puzzles.size} themes, ${count} puzzles`);
  }

  return allPuzzles;
}

// Get available themes for a bracket
function getThemesForBracket(allPuzzles: Map<string, Map<string, Puzzle[]>>, bracket: string): string[] {
  const bracketPuzzles = allPuzzles.get(bracket);
  if (!bracketPuzzles) return [];

  const themes = Array.from(bracketPuzzles.keys());

  // Prioritize tactical themes
  const tactical = themes.filter(t => TACTICAL_THEMES.includes(t));
  return tactical.length >= 5 ? tactical : themes;
}

// Generate puzzles for a single day
function generateDayPuzzles(
  date: string,
  allPuzzles: Map<string, Map<string, Puzzle[]>>
): Puzzle[] {
  const seed = getDateSeed(date);
  const random = seededRandom(seed);

  const puzzles: Puzzle[] = [];
  const usedPuzzleIds = new Set<string>();
  const usedThemes = new Set<string>();
  let lastPrimaryTheme = ''; // Track previous puzzle's primary Lichess theme for diversity

  for (const target of PUZZLE_TARGETS) {
    const themes = getThemesForBracket(allPuzzles, target.bracket);
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
      const bracketPuzzles = allPuzzles.get(target.bracket);
      if (!bracketPuzzles) continue;

      const themePuzzles = bracketPuzzles.get(theme) || [];

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

      puzzles.push({
        puzzleId: puzzle.puzzleId,
        fen: puzzle.fen,
        moves: puzzle.moves,
        rating: puzzle.rating,
        themes: puzzle.themes,
        gameUrl: puzzle.gameUrl,
      });

      usedPuzzleIds.add(puzzle.puzzleId);
      usedThemes.add(theme);
      lastPrimaryTheme = puzzle.themes[0];
      found = true;
      break;
    }

    if (!found) {
      // Fallback: try any puzzle in a wider rating range across all themes
      for (const theme of sorted) {
        const bracketPuzzles = allPuzzles.get(target.bracket);
        if (!bracketPuzzles) continue;

        const themePuzzles = bracketPuzzles.get(theme) || [];

        // Widen the range a bit
        const eligible = themePuzzles.filter(p =>
          p.rating >= target.min - 50 &&
          p.rating <= target.max + 100 &&
          !usedPuzzleIds.has(p.puzzleId)
        );

        if (eligible.length === 0) continue;

        const idx = Math.floor(random() * eligible.length);
        const puzzle = eligible[idx];

        puzzles.push({
          puzzleId: puzzle.puzzleId,
          fen: puzzle.fen,
          moves: puzzle.moves,
          rating: puzzle.rating,
          themes: puzzle.themes,
          gameUrl: puzzle.gameUrl,
        });

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
  console.log('Loading puzzle files from raw CSVs...');
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
