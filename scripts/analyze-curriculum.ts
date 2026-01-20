/**
 * Analyze puzzle database using theme-analyzer to find PRIMARY themes at each ELO
 * This gives us accurate data for building the curriculum
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { analyzePuzzle } from '../lib/theme-analyzer';

const PUZZLES_DIR = join(__dirname, '..', 'data', 'puzzles-by-rating');
const MIN_PLAYS = 1000;

interface PuzzleRow {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  nbPlays: number;
  themes: string;
  url: string;
}

function parseCsv(filePath: string): PuzzleRow[] {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const puzzles: PuzzleRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 9) {
      puzzles.push({
        puzzleId: parts[0],
        fen: parts[1],
        moves: parts[2],
        rating: parseInt(parts[3], 10),
        nbPlays: parseInt(parts[6], 10),
        themes: parts[7],
        url: parts[8],
      });
    }
  }

  return puzzles;
}

function analyzeRatingBand(band: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`ANALYZING: ${band} ELO (${MIN_PLAYS}+ plays)`);
  console.log('='.repeat(60));

  const filePath = join(PUZZLES_DIR, `${band}.csv`);
  const puzzles = parseCsv(filePath);

  // Filter by min plays
  const filtered = puzzles.filter(p => p.nbPlays >= MIN_PLAYS);
  console.log(`Total puzzles with ${MIN_PLAYS}+ plays: ${filtered.length}`);

  // Analyze each puzzle and count by primary theme
  const themeCounts: Map<string, number> = new Map();
  const themeExamples: Map<string, PuzzleRow[]> = new Map();

  for (const puzzle of filtered) {
    try {
      const analysis = analyzePuzzle(
        puzzle.puzzleId,
        puzzle.fen,
        puzzle.moves,
        puzzle.rating,
        puzzle.themes,
        puzzle.url
      );

      const primary = analysis.predictedPrimaryTheme;
      themeCounts.set(primary, (themeCounts.get(primary) || 0) + 1);

      // Store a few examples per theme
      if (!themeExamples.has(primary)) {
        themeExamples.set(primary, []);
      }
      const examples = themeExamples.get(primary)!;
      if (examples.length < 3) {
        examples.push(puzzle);
      }
    } catch (e) {
      // Skip puzzles that fail to analyze
    }
  }

  // Sort by count descending
  const sorted = Array.from(themeCounts.entries()).sort((a, b) => b[1] - a[1]);

  console.log(`\nPRIMARY THEME BREAKDOWN:`);
  console.log('-'.repeat(40));

  for (const [theme, count] of sorted) {
    const pct = ((count / filtered.length) * 100).toFixed(1);
    console.log(`${count.toString().padStart(6)} (${pct.padStart(5)}%)  ${theme}`);
  }

  // Also break down by 200-point sub-ranges
  console.log(`\nBREAKDOWN BY 200-POINT RANGES:`);
  console.log('-'.repeat(40));

  const baseRating = parseInt(band.split('-')[0], 10);
  const ranges = [
    { min: baseRating, max: baseRating + 200, label: `${baseRating}-${baseRating + 200}` },
    { min: baseRating + 200, max: baseRating + 400, label: `${baseRating + 200}-${baseRating + 400}` },
  ];

  for (const range of ranges) {
    const inRange = filtered.filter(p => p.rating >= range.min && p.rating < range.max);
    console.log(`\n${range.label}: ${inRange.length} puzzles`);

    const subCounts: Map<string, number> = new Map();
    for (const puzzle of inRange) {
      try {
        const analysis = analyzePuzzle(
          puzzle.puzzleId,
          puzzle.fen,
          puzzle.moves,
          puzzle.rating,
          puzzle.themes,
          puzzle.url
        );
        const primary = analysis.predictedPrimaryTheme;
        subCounts.set(primary, (subCounts.get(primary) || 0) + 1);
      } catch (e) {
        // Skip
      }
    }

    const subSorted = Array.from(subCounts.entries()).sort((a, b) => b[1] - a[1]);
    for (const [theme, count] of subSorted.slice(0, 15)) {
      const pct = ((count / inRange.length) * 100).toFixed(1);
      console.log(`  ${count.toString().padStart(5)} (${pct.padStart(5)}%)  ${theme}`);
    }
  }

  return { total: filtered.length, themes: sorted };
}

// Main execution
console.log('CHESS PUZZLE CURRICULUM ANALYSIS');
console.log('Using theme-analyzer to identify PRIMARY themes');
console.log(`Minimum plays threshold: ${MIN_PLAYS}`);

const bands = ['0400-0800', '0800-1200', '1200-1600', '1600-2000'];

for (const band of bands) {
  analyzeRatingBand(band);
}

console.log('\n' + '='.repeat(60));
console.log('ANALYSIS COMPLETE');
console.log('='.repeat(60));
