/**
 * build-puzzle-rating-index.ts
 *
 * Scans the committed puzzle data files and emits a compact
 * `data/puzzle-rating-index.json` map of { [puzzleId]: rating }.
 *
 * Why: the estimated-ELO feature needs to look up the difficulty rating of
 * every puzzle a user has attempted. The raw puzzle pools total ~100MB across
 * 300+ files — far too much to parse at request time. This precomputes a small
 * id→rating index (a few hundred KB) that the server can load instantly.
 *
 * Run:  npx tsx scripts/build-puzzle-rating-index.ts
 * Re-run whenever the puzzle pools change.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'data', 'puzzle-rating-index.json');

// Directories / files to harvest. Each is walked recursively for any object
// that has both a `puzzleId` (string) and a `rating` (number).
const SOURCES = [
  path.join(ROOT, 'data', 'clean-puzzles-v2'),
  path.join(ROOT, 'data', 'video-puzzle-pool.json'),
  path.join(ROOT, 'data', 'daily-challenge-puzzles.json'),
];

const index: Record<string, number> = {};
let pairs = 0;

function harvest(node: unknown): void {
  if (node == null) return;
  if (Array.isArray(node)) {
    for (const item of node) harvest(item);
    return;
  }
  if (typeof node === 'object') {
    const obj = node as Record<string, unknown>;
    const id = obj.puzzleId;
    const rating = obj.rating;
    if (typeof id === 'string' && typeof rating === 'number' && rating > 0) {
      // First write wins; ratings for a given id are identical across pools.
      if (index[id] === undefined) {
        index[id] = Math.round(rating);
        pairs++;
      }
    }
    for (const v of Object.values(obj)) harvest(v);
  }
}

function readJsonSafe(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    console.warn(`  ! skipped ${path.relative(ROOT, file)}: ${(e as Error).message}`);
    return null;
  }
}

function walkSource(src: string): void {
  if (!fs.existsSync(src)) {
    console.warn(`  ! missing source ${path.relative(ROOT, src)}`);
    return;
  }
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(src)) {
      if (name.endsWith('.json')) harvest(readJsonSafe(path.join(src, name)));
    }
  } else {
    harvest(readJsonSafe(src));
  }
}

console.log('Building puzzle rating index…');
for (const src of SOURCES) {
  console.log(`  scanning ${path.relative(ROOT, src)}`);
  walkSource(src);
}

fs.writeFileSync(OUT, JSON.stringify(index));
const sizeKb = Math.round(fs.statSync(OUT).size / 1024);
console.log(`\nWrote ${pairs.toLocaleString()} puzzle ratings → ${path.relative(ROOT, OUT)} (${sizeKb} KB)`);
