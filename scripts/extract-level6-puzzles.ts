/**
 * Extract Clean Puzzles for Level 6 (1600-1800 ELO)
 *
 * Reads CSV files from data/puzzles-by-rating/1600-2000/ and extracts puzzles:
 * - Rating between 1500-1900 (wider range; curriculum filters tighter)
 * - nbPlays >= 500
 * - One JSON file per CSV-filename theme (fork, pin, etc.)
 * - Additional JSON files for themes found in the themes column but NOT
 *   represented as CSV filenames (intermezzo, zwischenzug, mateIn3, etc.)
 *
 * Output: data/clean-puzzles-v2/level6-{theme}.json
 *
 * Usage: npx tsx scripts/extract-level6-puzzles.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// CONFIG
// ============================================================================

const LEVEL = 6;
const RATING_RANGE_LABEL = '1600-1800';
const MIN_RATING = 1500;
const MAX_RATING = 1900;
const MIN_PLAYS = 500;

const CSV_DIR = path.join(process.cwd(), 'data', 'puzzles-by-rating', '1600-2000');
const OUTPUT_DIR = path.join(process.cwd(), 'data', 'clean-puzzles-v2');

// Extra themes to extract by scanning the themes column across ALL CSVs.
// These themes don't have their own CSV file but appear as tags on puzzles.
const EXTRA_THEMES = [
  'intermezzo',
  'zwischenzug',
  'mateIn3',
  'mateIn4',
  'mateIn5',
  'doubleCheck',
  'xRayAttack',
  'zugzwang',
  'smotheredMate',
  'hookMate',
  'arabianMate',
  'dovetailMate',
  'doubleBishopMate',
  'underPromotion',
  'exposedKing',
  'crushing',
  'hangingPiece',
  'trappedPiece',
  'kingsideAttack',
  'queensideAttack',
];

// ============================================================================
// TYPES
// ============================================================================

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

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  popularity: number;
  nbPlays: number;
  themes: string[];
  gameUrl: string;
}

// ============================================================================
// CSV PARSING
// ============================================================================

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseCsvFile(filePath: string): RawPuzzle[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').slice(1); // skip header
  const puzzles: RawPuzzle[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const fields = parseCsvLine(line);
    if (fields.length < 8) continue;

    const rating = parseInt(fields[3], 10) || 0;
    const nbPlays = parseInt(fields[6], 10) || 0;
    const popularity = parseInt(fields[5], 10) || 0;
    const themes = fields[7]?.split(' ').filter(Boolean) || [];
    const gameUrl = fields[8] || '';

    // Apply rating and nbPlays filters
    if (rating < MIN_RATING || rating > MAX_RATING) continue;
    if (nbPlays < MIN_PLAYS) continue;

    puzzles.push({
      puzzleId: fields[0],
      fen: fields[1],
      moves: fields[2],
      rating,
      popularity,
      nbPlays,
      themes,
      gameUrl,
    });
  }

  return puzzles;
}

// ============================================================================
// MAIN
// ============================================================================

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Step 1: Find all CSV files and their theme names
const csvFiles = fs.readdirSync(CSV_DIR).filter(f => f.endsWith('.csv'));
const csvThemes = csvFiles.map(f => f.replace('.csv', ''));

console.log(`Found ${csvFiles.length} CSV files in ${CSV_DIR}`);
console.log(`CSV themes: ${csvThemes.join(', ')}`);

// Determine which extra themes are NOT already covered by CSV filenames
const extraThemesToExtract = EXTRA_THEMES.filter(t => !csvThemes.includes(t));
console.log(`\nExtra themes to extract from themes column: ${extraThemesToExtract.join(', ')}`);

// Step 2: Extract puzzles from each CSV file (one JSON per CSV theme)
// Also collect ALL puzzles for extra-theme scanning
const allPuzzlesMap = new Map<string, RawPuzzle>();
const themeResults = new Map<string, CleanPuzzle[]>();

for (const csvFile of csvFiles) {
  const themeName = csvFile.replace('.csv', '');
  const filePath = path.join(CSV_DIR, csvFile);

  console.log(`\nProcessing ${csvFile}...`);
  const puzzles = parseCsvFile(filePath);
  console.log(`  ${puzzles.length} puzzles in rating ${MIN_RATING}-${MAX_RATING} with >= ${MIN_PLAYS} plays`);

  // For the CSV-filename theme, filter to puzzles that have this theme tag
  const matchingPuzzles = puzzles.filter(p => p.themes.includes(themeName));
  console.log(`  ${matchingPuzzles.length} puzzles with '${themeName}' in themes`);

  const cleanPuzzles: CleanPuzzle[] = matchingPuzzles.map(p => ({
    puzzleId: p.puzzleId,
    fen: p.fen,
    moves: p.moves,
    rating: p.rating,
    popularity: p.popularity,
    nbPlays: p.nbPlays,
    theme: themeName,
    allThemes: p.themes,
    gameUrl: p.gameUrl,
  }));

  // Sort by rating asc, then by popularity desc
  cleanPuzzles.sort((a, b) => {
    if (a.rating !== b.rating) return a.rating - b.rating;
    return b.popularity - a.popularity;
  });

  themeResults.set(themeName, cleanPuzzles);

  // Collect all puzzles for extra-theme scanning (dedup by puzzleId)
  for (const p of puzzles) {
    if (!allPuzzlesMap.has(p.puzzleId)) {
      allPuzzlesMap.set(p.puzzleId, p);
    }
  }
}

console.log(`\nTotal unique puzzles collected: ${allPuzzlesMap.size}`);

// Step 3: Extract extra themes by scanning ALL collected puzzles
console.log(`\nExtracting extra themes from themes column...`);

for (const extraTheme of extraThemesToExtract) {
  const matchingPuzzles: CleanPuzzle[] = [];

  for (const p of allPuzzlesMap.values()) {
    if (p.themes.includes(extraTheme)) {
      matchingPuzzles.push({
        puzzleId: p.puzzleId,
        fen: p.fen,
        moves: p.moves,
        rating: p.rating,
        popularity: p.popularity,
        nbPlays: p.nbPlays,
        theme: extraTheme,
        allThemes: p.themes,
        gameUrl: p.gameUrl,
      });
    }
  }

  // Sort by rating asc, then by popularity desc
  matchingPuzzles.sort((a, b) => {
    if (a.rating !== b.rating) return a.rating - b.rating;
    return b.popularity - a.popularity;
  });

  if (matchingPuzzles.length > 0) {
    themeResults.set(extraTheme, matchingPuzzles);
    console.log(`  ${extraTheme}: ${matchingPuzzles.length} puzzles`);
  } else {
    console.log(`  ${extraTheme}: 0 puzzles (skipping)`);
  }
}

// Step 4: Write JSON files
console.log(`\n${'='.repeat(70)}`);
console.log('WRITING OUTPUT FILES');
console.log(`${'='.repeat(70)}`);

let filesWritten = 0;
const summary: Record<string, number> = {};

for (const [theme, puzzles] of themeResults) {
  if (puzzles.length === 0) continue;

  const outputFile = path.join(OUTPUT_DIR, `level${LEVEL}-${theme}.json`);
  const output = {
    level: LEVEL,
    ratingRange: RATING_RANGE_LABEL,
    theme,
    count: puzzles.length,
    puzzles,
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  summary[theme] = puzzles.length;
  filesWritten++;
  console.log(`  level${LEVEL}-${theme}.json: ${puzzles.length} puzzles`);
}

console.log(`\n${'='.repeat(70)}`);
console.log('EXTRACTION COMPLETE');
console.log(`${'='.repeat(70)}`);
console.log(`Files written: ${filesWritten}`);
console.log(`Output directory: ${OUTPUT_DIR}`);

// Print summary sorted by count
console.log(`\nSummary (sorted by count):`);
console.log('-'.repeat(50));

const sortedSummary = Object.entries(summary).sort((a, b) => b[1] - a[1]);
let totalPuzzles = 0;
for (const [theme, count] of sortedSummary) {
  console.log(`  ${theme.padEnd(25)} ${count.toString().padStart(6)} puzzles`);
  totalPuzzles += count;
}
console.log('-'.repeat(50));
console.log(`  ${'TOTAL'.padEnd(25)} ${totalPuzzles.toString().padStart(6)} puzzles (across all themes, may overlap)`);
