/**
 * Curate the HARD Video Puzzle Pool (2000+)
 *
 * Builds data/video-puzzle-pool-hard.json — the pool used on DIFFICULT days
 * (DIFFICULT_DOW) by scripts/render-daily-video.ts. Sourced from the raw Lichess
 * 2000-plus per-theme CSVs, which the normal pool (clean-puzzles-v2, capped at
 * ~1999) can't reach.
 *
 * Same output schema as data/video-puzzle-pool.json so the renderer treats them
 * identically. Dedup is shared via data/video-puzzle-usage.json (by puzzleId).
 *
 * Usage: npx tsx scripts/curate-video-puzzles-hard.ts               # difficult pool, 2000-2400
 *        npx tsx scripts/curate-video-puzzles-hard.ts --impossible  # impossible pool, 2401-2800
 *
 * --impossible builds data/video-puzzle-pool-impossible.json for the IMPOSSIBLE
 * tier (Thu/Sat, lib/ig-difficult-days.ts). Same filters, higher band. The raw
 * CSVs are gitignored, so this only runs locally — commit the JSON it writes.
 */

import * as fs from 'fs';
import * as path from 'path';
import { HARD_VIDEO_THEMES } from '../lib/ig-captions';

const SRC_DIR = path.join(process.cwd(), 'data', 'puzzles-by-rating', '2000-plus');
const IMPOSSIBLE = process.argv.includes('--impossible');
const OUTPUT = path.join(
  process.cwd(), 'data',
  IMPOSSIBLE ? 'video-puzzle-pool-impossible.json' : 'video-puzzle-pool-hard.json',
);

// Themes we write hooks for, minus mateIn1 (never a "difficult" puzzle). Some
// don't exist as 2000+ files (smotheredMate/kingside/queensideAttack) — skipped
// gracefully below.
const VIDEO_THEMES = HARD_VIDEO_THEMES;

// Difficult: hard-but-solvable / watchable. Impossible: the band above it —
// capped at 2800 so the solutions stay explainable in a 20-second reel.
const MIN_RATING = IMPOSSIBLE ? 2401 : 2000;
const MAX_RATING = IMPOSSIBLE ? 2800 : 2400;
const MIN_POPULARITY = 85;
const MIN_MOVES = 3;
const MAX_MOVES = 8;
const PER_THEME = 20; // balanced sample per theme

interface HardPoolPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  theme: string;
  allThemes: string[];
  gameUrl: string;
}

// Deterministic LCG shuffle (matches curate-video-puzzles.ts seed behavior)
let seed = 42;
function seededShuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function main() {
  console.log(`Curating ${IMPOSSIBLE ? 'IMPOSSIBLE' : 'HARD'} video puzzle pool ` +
    `(${MIN_RATING}-${MAX_RATING}) from raw Lichess CSVs...\n`);

  const pool: HardPoolPuzzle[] = [];

  for (const theme of VIDEO_THEMES) {
    const filepath = path.join(SRC_DIR, `${theme}.csv`);
    if (!fs.existsSync(filepath)) {
      console.log(`  ${theme.padEnd(18)} — no 2000+ file, skipped`);
      continue;
    }

    const lines = fs.readFileSync(filepath, 'utf-8').trim().split('\n');
    const candidates: HardPoolPuzzle[] = [];

    // Cols: PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
    for (let i = 1; i < lines.length; i++) {
      const c = lines[i].split(',');
      const puzzleId = c[0];
      const fen = c[1];
      const moves = c[2];
      const rating = parseInt(c[3], 10);
      const popularity = parseInt(c[5], 10);
      const themesRaw = c[7] || '';
      const gameUrl = c[8] || '';

      const numSolutionMoves = moves.split(' ').length - 1;
      if (numSolutionMoves < MIN_MOVES || numSolutionMoves > MAX_MOVES) continue;
      if (rating < MIN_RATING || rating > MAX_RATING) continue;
      if (!Number.isNaN(popularity) && popularity < MIN_POPULARITY) continue;

      candidates.push({
        puzzleId,
        fen,
        moves,
        rating,
        theme,
        allThemes: themesRaw.split(' ').filter(Boolean),
        gameUrl,
      });
    }

    seededShuffle(candidates);
    const picked = candidates.slice(0, PER_THEME);
    pool.push(...picked);
    console.log(`  ${theme.padEnd(18)} — ${candidates.length} usable → picked ${picked.length}`);
  }

  // Final shuffle so days rotate across themes
  seededShuffle(pool);

  const result = {
    generatedAt: new Date().toISOString(),
    count: pool.length,
    puzzles: pool,
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2));

  const ratings = pool.map((p) => p.rating);
  console.log(`\n${IMPOSSIBLE ? 'Impossible' : 'Hard'} pool: ${pool.length} puzzles`);
  console.log(`Rating range: ${Math.min(...ratings)} - ${Math.max(...ratings)}`);
  console.log(`Written to ${OUTPUT}`);
}

main();
