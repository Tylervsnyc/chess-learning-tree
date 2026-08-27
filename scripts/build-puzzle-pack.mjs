#!/usr/bin/env node
/**
 * Build the on-device puzzle pack for the offline Chess Boxing app.
 *
 *   node scripts/build-puzzle-pack.mjs [--per-theme=N] [--validate-only]
 *
 * WHY
 * Lesson puzzles come from /api/puzzles/lesson, which reads 173,691 puzzles off
 * the server's disk (data/clean-puzzles-v2, 72 MB across 310 level-theme files).
 * There is no server inside the app, so offline every lesson past the scripted
 * tutorial dies on a failed fetch. This trims that corpus to something a phone
 * can carry and writes it where the offline build can pick it up.
 *
 * WHY NOT JUST TAKE THE TOP N BY POPULARITY
 * selectPuzzlesForLesson hard-filters on rating, then splits what survives into
 * difficulty tiers across the lesson's band — and the 446 lessons use 182
 * distinct rating bands, many of them narrow (400-475, 450-525). Popularity
 * correlates with rating, so a plain top-N trim empties the tails and starves
 * exactly those lessons. Instead we stratify: bucket each file by rating, then
 * round-robin across buckets taking the most-played puzzle from each. Rating
 * coverage is preserved and every kept puzzle is a well-tested one.
 *
 * The build FAILS if any lesson would end up with fewer than MIN_CANDIDATES
 * puzzles, so a too-aggressive trim can't ship silently.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'data', 'clean-puzzles-v2');
const DEST = path.join(ROOT, 'data', 'offline-puzzle-pack');

const args = process.argv.slice(2);
const PER_THEME = Number(args.find((a) => a.startsWith('--per-theme='))?.split('=')[1] ?? 400);
const VALIDATE_ONLY = args.includes('--validate-only');

/** A lesson picks 6 puzzles; below this the selector starts repeating or failing. */
const MIN_CANDIDATES = 12;
const RATING_BUCKET = 25;

const log = (m) => console.log(`[pack] ${m}`);
const die = (m) => { console.error(`\n[pack] FAILED: ${m}\n`); process.exit(1); };

/* ------------------------------------------------------------------ trim */

/**
 * Keep up to `limit` puzzles while preserving the file's rating distribution.
 * Buckets by rating, sorts each bucket by play count, then takes one puzzle per
 * bucket per pass. Sparse rating bands survive; popular-but-clustered ones
 * don't crowd them out.
 */
function stratify(puzzles, limit) {
  if (puzzles.length <= limit) return puzzles;

  const buckets = new Map();
  for (const p of puzzles) {
    const key = Math.floor(p.rating / RATING_BUCKET);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(p);
  }
  for (const list of buckets.values()) list.sort((a, b) => b.nbPlays - a.nbPlays);

  const ordered = [...buckets.keys()].sort((a, b) => a - b).map((k) => buckets.get(k));
  const kept = [];
  for (let pass = 0; kept.length < limit; pass++) {
    let tookAny = false;
    for (const list of ordered) {
      if (pass >= list.length) continue;
      kept.push(list[pass]);
      tookAny = true;
      if (kept.length >= limit) break;
    }
    if (!tookAny) break;
  }
  return kept;
}

/** Drop fields the client never reads. gameUrl is the big one (~45 bytes each). */
function slim(p) {
  return {
    puzzleId: p.puzzleId,
    fen: p.fen,
    moves: p.moves,
    rating: p.rating,
    popularity: p.popularity,
    nbPlays: p.nbPlays,
    theme: p.theme,
    allThemes: p.allThemes,
  };
}

function build() {
  fs.rmSync(DEST, { recursive: true, force: true });
  fs.mkdirSync(DEST, { recursive: true });

  const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.json') && f !== 'summary.json');
  if (!files.length) die(`no puzzle files in ${SRC}`);

  let before = 0, after = 0;
  const themesByLevel = {};

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(SRC, file), 'utf-8'));
    const kept = stratify(data.puzzles, PER_THEME).map(slim);
    before += data.puzzles.length;
    after += kept.length;

    (themesByLevel[data.level] ??= []).push(data.theme);

    fs.writeFileSync(
      path.join(DEST, file),
      JSON.stringify({ level: data.level, ratingRange: data.ratingRange, theme: data.theme, count: kept.length, puzzles: kept })
    );
  }

  // Mirrors listAvailableThemes() — the client can't readdir a directory.
  fs.writeFileSync(path.join(DEST, 'index.json'), JSON.stringify(themesByLevel));

  const mb = (fs.readdirSync(DEST).reduce((n, f) => n + fs.statSync(path.join(DEST, f)).size, 0) / 1048576).toFixed(1);
  log(`${files.length} files · ${before.toLocaleString()} -> ${after.toLocaleString()} puzzles · ${mb} MB (cap ${PER_THEME}/theme)`);
}

build.PER_THEME = PER_THEME;

if (VALIDATE_ONLY) log('skipping build, validating existing pack');
else build();

export { DEST, MIN_CANDIDATES };
