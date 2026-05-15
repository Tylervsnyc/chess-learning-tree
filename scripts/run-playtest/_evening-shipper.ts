/**
 * Ship the 6 winners from the 2026-05-15-evening session into lib/run/runs.ts.
 *
 * Reads each candidate .ts file, extracts the `make(...)` lines (which are
 * identical in form to the helpers in runs.ts), and inserts a new RunDef.
 */

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const WINNERS = [
  { file: 'normal-02', id: 'royal-standoff', name: 'Royal Standoff', blurb: 'A back-rank fortress collapses on you. Carve a path through pawns and queens.' },
  { file: 'normal-04', id: 'endgame-assault', name: 'Endgame Assault', blurb: 'Pawns advance, pieces wait. Real-chess pressure meets roguelike chaos.' },
  { file: 'walls-03', id: 'iron-veil', name: 'Iron Veil', blurb: 'Defended chains, layered ranks, no easy capture. Every wall is a trap.' },
  { file: 'walls-02', id: 'stone-citadel', name: 'Stone Citadel', blurb: 'Walls within walls. Tempo is everything; one wasted move ends you.' },
  { file: 'mixed-02', id: 'crossroads', name: 'Crossroads', blurb: 'Queens cover diagonals, knights cover the middle. Pick your route.' },
  { file: 'mixed-04', id: 'pincer', name: 'Pincer', blurb: 'Squeezed from both flanks. Bishops on one side, queens on the other.' },
];

function extractLevels(candidatePath: string): string[] {
  const content = readFileSync(candidatePath, 'utf-8');
  const lines = content.split('\n');
  const makeLines: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('make(')) {
      // Strip trailing comma from raw line, keep one trailing comma in output
      const cleaned = trimmed.replace(/,$/, '');
      makeLines.push(cleaned);
    }
  }
  if (makeLines.length !== 10) {
    throw new Error(`Expected 10 make() lines in ${candidatePath}, got ${makeLines.length}`);
  }
  return makeLines;
}

function buildRunDef(winner: typeof WINNERS[0]): string {
  const candidatePath = path.resolve(
    `data/run-playtest/candidate-levels/2026-05-15-evening/${winner.file}.ts`,
  );
  const levelLines = extractLevels(candidatePath);
  return `// Run — ${winner.name} (auto-generated 2026-05-15-evening, sourced from ${winner.file}).
const RUN_${winner.id.toUpperCase().replace(/-/g, '_')}: RunDef = {
  id: '${winner.id}',
  name: '${winner.name}',
  blurb: '${winner.blurb}',
  levels: [
${levelLines.map((l) => `    ${l},`).join('\n')}
  ],
};
`;
}

function main(): void {
  const runsPath = path.resolve('lib/run/runs.ts');
  const runsContent = readFileSync(runsPath, 'utf-8');

  // Build all 6 new RunDefs.
  const newRunDefs = WINNERS.map(buildRunDef).join('\n');

  // Find the RUNS export array.
  const runsArrayMatch = runsContent.match(/export const RUNS:[^=]*=\s*\[([\s\S]*?)\];/);
  if (!runsArrayMatch) {
    throw new Error('Could not find RUNS array export in runs.ts');
  }

  // Insert new RunDefs BEFORE the RUNS export, append IDs to the array.
  const exportIdx = runsContent.indexOf('export const RUNS:');
  if (exportIdx < 0) throw new Error('No export const RUNS:');

  // Compose new file content.
  const before = runsContent.slice(0, exportIdx);
  const exportSection = runsContent.slice(exportIdx);

  // Append new IDs into the RUNS array.
  const newIds = WINNERS.map((w) => `RUN_${w.id.toUpperCase().replace(/-/g, '_')}`);
  const updatedExport = exportSection.replace(
    /export const RUNS:[^=]*=\s*\[([\s\S]*?)\];/,
    (full, arrInner) => {
      const trimmedInner = arrInner.replace(/\s+$/, '');
      const sep = trimmedInner.endsWith(',') ? '\n' : ',\n';
      const newInner = `${trimmedInner}${sep}  ${newIds.join(',\n  ')},\n`;
      return `export const RUNS: ReadonlyArray<RunDef> = [\n${newInner}];`;
    },
  );

  const newContent = `${before}\n// ─────────────────────────────────────────────────────────────────────────────\n// 2026-05-15 Evening session — 6 calibrated 10-level runs.\n\n${newRunDefs}\n${updatedExport}`;
  writeFileSync(runsPath, newContent, 'utf-8');
  console.log(`[ship] inserted ${WINNERS.length} runs into ${runsPath}`);
  console.log(`[ship] new run IDs: ${WINNERS.map((w) => w.id).join(', ')}`);
}

main();
