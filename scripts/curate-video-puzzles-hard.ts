/**
 * Curate the HARD Video Puzzle Pool (2000+)
 *
 * Builds data/video-puzzle-pool-hard.json — the pool used on DIFFICULT days
 * (Thu/Sat) by scripts/render-daily-video.ts. Sourced from the raw Lichess
 * 2000-plus per-theme CSVs, which the normal pool (clean-puzzles-v2, capped at
 * ~1999) can't reach.
 *
 * Same output schema as data/video-puzzle-pool.json so the renderer treats them
 * identically. Dedup is shared via data/video-puzzle-usage.json (by puzzleId).
 *
 * Usage: npx tsx scripts/curate-video-puzzles-hard.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.join(process.cwd(), 'data', 'puzzles-by-rating', '2000-plus');
const OUTPUT = path.join(process.cwd(), 'data', 'video-puzzle-pool-hard.json');

// Video-friendly themes (visual drama, clear result). Some don't exist as 2000+
// files (mateIn1/mateIn3/smotheredMate/kingside/queensideAttack) — skipped gracefully.
const VIDEO_THEMES = [
  'mateIn2', 'mateIn3',
  'backRankMate', 'smotheredMate',
  'fork', 'pin', 'skewer',
  'sacrifice', 'discoveredAttack',
  'kingsideAttack', 'queensideAttack',
  'deflection', 'attraction',
];

const MIN_RATING = 2000;
const MAX_RATING = 2400; // keep it hard-but-solvable / watchable, not insane
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
  console.log('Curating HARD video puzzle pool (2000+) from raw Lichess CSVs...\n');

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
  console.log(`\nHard pool: ${pool.length} puzzles`);
  console.log(`Rating range: ${Math.min(...ratings)} - ${Math.max(...ratings)}`);
  console.log(`Written to ${OUTPUT}`);
}

main();
