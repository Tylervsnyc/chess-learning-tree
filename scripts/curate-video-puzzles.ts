/**
 * Curate Video Puzzle Pool
 *
 * Filters clean-puzzles-v2 for video-friendly puzzles:
 * - Mates (mateIn1, mateIn2, mateIn3) — these are the most dramatic on video
 * - Clean tactical themes (fork, pin, sacrifice, backRankMate)
 * - 4-8 solution moves (not too short, not too long for a ~15-20s reel)
 * - Rating 600-1800 (accessible audience)
 *
 * Output: data/video-puzzle-pool.json (~100-200 puzzles)
 *
 * Usage: npx tsx scripts/curate-video-puzzles.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const CLEAN_DIR = path.join(process.cwd(), 'data', 'clean-puzzles-v2');
const OUTPUT = path.join(process.cwd(), 'data', 'video-puzzle-pool.json');

// Themes that look good on video (visual drama, clear result)
const VIDEO_THEMES = [
  'mateIn1', 'mateIn2', 'mateIn3',
  'backRankMate', 'smotheredMate',
  'fork', 'pin', 'skewer',
  'sacrifice', 'discoveredAttack',
  'kingsideAttack', 'queensideAttack',
  'deflection', 'attraction',
];

// Levels to pull from (covers 400-1800 rating range)
const LEVELS = [1, 2, 3, 4, 5];

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  popularity?: number;
  nbPlays?: number;
  theme: string;
  allThemes: string[];
  gameUrl: string;
}

interface PuzzleFile {
  level: number;
  theme: string;
  count: number;
  puzzles: RawPuzzle[];
}

interface VideoPoolPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  theme: string;
  allThemes: string[];
  gameUrl: string;
  numMoves: number;
}

function main() {
  console.log('Curating video puzzle pool from clean-puzzles-v2...\n');

  const allCandidates: VideoPoolPuzzle[] = [];

  for (const level of LEVELS) {
    for (const theme of VIDEO_THEMES) {
      const filename = `level${level}-${theme}.json`;
      const filepath = path.join(CLEAN_DIR, filename);

      if (!fs.existsSync(filepath)) continue;

      const data: PuzzleFile = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

      for (const p of data.puzzles) {
        const moveList = p.moves.split(' ');
        const numSolutionMoves = moveList.length - 1; // subtract setup move

        // Filter: 3-8 solution moves (not too short for video, not too long)
        if (numSolutionMoves < 3 || numSolutionMoves > 8) continue;

        // Filter: rating 500-1800 (accessible for IG audience)
        if (p.rating < 500 || p.rating > 1800) continue;

        // Prefer popular puzzles (if field exists)
        if (p.popularity !== undefined && p.popularity < 80) continue;

        allCandidates.push({
          puzzleId: p.puzzleId,
          fen: p.fen,
          moves: p.moves,
          rating: p.rating,
          theme: p.theme,
          allThemes: p.allThemes,
          gameUrl: p.gameUrl,
          numMoves: numSolutionMoves,
        });
      }
    }
  }

  console.log(`Found ${allCandidates.length} candidates total`);

  // Sample across rating buckets to get a good spread
  // 4 buckets: 500-800, 800-1100, 1100-1400, 1400-1800
  const buckets: VideoPoolPuzzle[][] = [[], [], [], []];
  for (const p of allCandidates) {
    if (p.rating < 800) buckets[0].push(p);
    else if (p.rating < 1100) buckets[1].push(p);
    else if (p.rating < 1400) buckets[2].push(p);
    else buckets[3].push(p);
  }

  // Shuffle each bucket deterministically
  let seed = 42;
  const seededShuffle = (arr: VideoPoolPuzzle[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const j = seed % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  buckets.forEach(seededShuffle);

  // Take 50 from each bucket (or all if fewer)
  const pool: VideoPoolPuzzle[] = [];
  for (const bucket of buckets) {
    pool.push(...bucket.slice(0, 50));
  }

  // Final shuffle
  seededShuffle(pool);

  // Strip numMoves from output (internal only)
  const output = pool.map(({ numMoves: _, ...rest }) => rest);

  const result = {
    generatedAt: new Date().toISOString(),
    count: output.length,
    puzzles: output,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2));

  // Stats
  const themes = new Map<string, number>();
  for (const p of output) {
    themes.set(p.theme, (themes.get(p.theme) || 0) + 1);
  }

  console.log(`\nPool: ${output.length} puzzles`);
  console.log(`Rating range: ${Math.min(...output.map(p => p.rating))} - ${Math.max(...output.map(p => p.rating))}`);
  console.log('\nTheme distribution:');
  [...themes.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([t, c]) => console.log(`  ${t}: ${c}`));

  console.log(`\nWritten to ${OUTPUT}`);
}

main();
