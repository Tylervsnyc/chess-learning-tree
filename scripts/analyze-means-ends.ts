/**
 * Analyze MEANS → END combinations in puzzle data
 * Looking for skill-stack combinations where a TOOL enables a GOAL
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const BASE_DIR = join(process.cwd(), 'data', 'puzzles-by-rating');
const BRACKETS = ['0400-0800', '0800-1200', '1200-1600'];

// MEANS themes (tools/enablers)
const MEANS = [
  'deflection',
  'attraction',
  'capturingDefender',
  'sacrifice',
  'clearance',
  'interference',
  'quietMove',
  'intermezzo'
];

// ENDS themes (goals/results)
const ENDS = [
  'mateIn1',
  'mateIn2',
  'mateIn3',
  'backRankMate',
  'smotheredMate',
  'fork',
  'skewer',
  'trappedPiece',
  'hangingPiece',
  'promotion'
];

function countCombinations(bracket: string): Map<string, number> {
  const dir = join(BASE_DIR, bracket);
  const files = readdirSync(dir).filter(f => f.endsWith('.csv'));
  const comboCounts = new Map<string, number>();
  const seenIds = new Set<string>();

  for (const file of files) {
    const content = readFileSync(join(dir, file), 'utf-8');
    const lines = content.trim().split('\n');

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length < 9) continue;

      const puzzleId = parts[0];
      if (seenIds.has(puzzleId)) continue;
      seenIds.add(puzzleId);

      const themes = parts[7].split(' ');

      // Check each MEANS + END combination
      for (const means of MEANS) {
        if (!themes.includes(means)) continue;
        for (const end of ENDS) {
          if (!themes.includes(end)) continue;
          const key = `${means} → ${end}`;
          comboCounts.set(key, (comboCounts.get(key) || 0) + 1);
        }
      }
    }
  }

  return comboCounts;
}

console.log('MEANS → END PUZZLE COUNTS\n');
console.log('Looking for skill-stack combinations where a TOOL enables a GOAL\n');

for (const bracket of BRACKETS) {
  const levelNum = BRACKETS.indexOf(bracket) + 1;
  console.log('='.repeat(60));
  console.log(`LEVEL ${levelNum} (${bracket})`);
  console.log('='.repeat(60) + '\n');

  const counts = countCombinations(bracket);

  // Sort by count descending
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  // Group by MEANS
  const byMeans = new Map<string, { end: string; count: number }[]>();
  for (const [combo, count] of sorted) {
    const [means, end] = combo.split(' → ');
    if (!byMeans.has(means)) byMeans.set(means, []);
    byMeans.get(means)!.push({ end, count });
  }

  // Print grouped by MEANS
  for (const means of MEANS) {
    const ends = byMeans.get(means);
    if (!ends || ends.length === 0) continue;

    const total = ends.reduce((sum, e) => sum + e.count, 0);
    console.log(`${means.toUpperCase()} (${total.toLocaleString()} total)`);

    for (const { end, count } of ends.slice(0, 6)) {
      if (count >= 20) {
        const bar = '█'.repeat(Math.min(30, Math.floor(count / 500)));
        console.log(`  → ${end.padEnd(15)} ${count.toLocaleString().padStart(7)} ${bar}`);
      }
    }
    console.log('');
  }
}
