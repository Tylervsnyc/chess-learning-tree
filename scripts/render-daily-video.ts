/**
 * Render Daily Puzzle Video — the ONLY renderer for daily puzzle reels.
 *
 *   npx tsx scripts/render-daily-video.ts                      # next unused puzzle, today
 *   npx tsx scripts/render-daily-video.ts --date=8.14.26       # render for a target date
 *   npx tsx scripts/render-daily-video.ts --min-rating=1700    # extra rating floor
 *   npx tsx scripts/render-daily-video.ts --difficult          # force the hard pool
 *   npx tsx scripts/render-daily-video.ts --no-difficult       # force the normal pool
 *   npx tsx scripts/render-daily-video.ts --from-daily=2026-04-29 --index=18
 *                                                             # render a specific
 *                                                             # daily-challenge puzzle
 *
 * Sources of truth this obeys:
 *   - lib/ig-difficult-days.ts  — which days are difficult, and on which clock
 *   - lib/ig-captions.ts        — every word of the caption
 *   - lib/ig-reels.ts           — which puzzles are already used (disk ∪ ledger)
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Chess } from 'chess.js';
import { describeResult } from '../remotion/lib/describe-result';
import { getVideoQuip } from '../remotion/lib/video-quips';
import { isDifficultDateLabel, easternDateLabel } from '../lib/ig-difficult-days';
import { generateCaption, primaryTheme } from '../lib/ig-captions';
import { loadUsage, saveUsage, usedPuzzleIds, writeSidecar } from '../lib/ig-reels';

const POOL_FILE = path.join(process.cwd(), 'data', 'video-puzzle-pool.json');
const HARD_POOL_FILE = path.join(process.cwd(), 'data', 'video-puzzle-pool-hard.json');
const DAILY_FILE = path.join(process.cwd(), 'data', 'daily-challenge-puzzles.json');
const OUTPUT_DIR = path.join(process.cwd(), 'out', 'videos');
const ENTRY_POINT = path.join(process.cwd(), 'remotion', 'index.ts');

interface PoolPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  theme: string;
  allThemes: string[];
  gameUrl?: string;
}

function parseArgs() {
  const args: Record<string, string> = {};
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--(\w[\w-]*)=(.+)$/);
    if (match) args[match[1]] = match[2];
  }
  return args;
}

/** Pick a specific puzzle out of the daily-challenge set (was render-daily-video-from-id.ts). */
function puzzleFromDaily(date: string, indexFromOne: number): PoolPuzzle {
  const data = JSON.parse(fs.readFileSync(DAILY_FILE, 'utf-8'));
  const day = data.days[date];
  if (!day) throw new Error(`No daily puzzles for ${date}`);
  const p = day[indexFromOne - 1];
  if (!p) throw new Error(`No puzzle at index ${indexFromOne} for ${date}`);
  return {
    puzzleId: p.puzzleId,
    fen: p.fen,
    moves: Array.isArray(p.moves) ? p.moves.join(' ') : p.moves,
    rating: p.rating,
    theme: primaryTheme(p.themes),
    allThemes: p.themes,
  };
}

/** A specific puzzle by id, from either pool. Used for re-renders. */
function puzzleById(id: string): PoolPuzzle {
  for (const file of [POOL_FILE, HARD_POOL_FILE]) {
    if (!fs.existsSync(file)) continue;
    const pool: { puzzles: PoolPuzzle[] } = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const found = pool.puzzles.find(p => p.puzzleId === id);
    if (found) return found;
  }
  throw new Error(`Puzzle ${id} is in neither pool`);
}

/** Next unused puzzle from the right pool, honouring an optional rating floor. */
function puzzleFromPool(difficult: boolean, minRating: number): PoolPuzzle {
  const poolFile = difficult ? HARD_POOL_FILE : POOL_FILE;
  if (!fs.existsSync(poolFile)) {
    const script = difficult ? 'scripts/curate-video-puzzles-hard.ts' : 'scripts/curate-video-puzzles.ts';
    throw new Error(`Pool file not found (${path.basename(poolFile)}). Run: npx tsx ${script}`);
  }
  const pool: { puzzles: PoolPuzzle[] } = JSON.parse(fs.readFileSync(poolFile, 'utf-8'));

  // Dedup against everything actually rendered, not just the ledger — the
  // ledger has drifted before and we double-posted puzzles because of it.
  const used = usedPuzzleIds();
  const puzzle = pool.puzzles.find(p => !used.has(p.puzzleId) && p.rating >= minRating);
  if (!puzzle) {
    throw new Error(
      `No unused puzzles left in the ${difficult ? 'hard' : 'normal'} pool` +
      `${minRating ? ` with rating >= ${minRating}` : ''}. Re-run the curation script.`,
    );
  }

  const remaining = pool.puzzles.filter(p => !used.has(p.puzzleId)).length - 1;
  if (remaining < 10) {
    const script = difficult ? 'curate-video-puzzles-hard.ts' : 'curate-video-puzzles.ts';
    console.warn(`⚠ Only ${remaining} unused puzzles left in the ${difficult ? 'hard' : 'normal'} pool — top up via scripts/${script}`);
  }
  return puzzle;
}

function main() {
  const args = parseArgs();
  const minRating = args['min-rating'] ? parseInt(args['min-rating'], 10) : 0;

  // Target date drives BOTH the output folder and the difficult-day check.
  // Default is today in ET — the same clock the poster uses.
  const dateStr = args['date'] || easternDateLabel();

  const forceOn = process.argv.includes('--difficult');
  const forceOff = process.argv.includes('--no-difficult');
  const difficult = forceOff ? false : forceOn || isDifficultDateLabel(dateStr);

  // --puzzle-id re-renders a SPECIFIC puzzle, dedup deliberately bypassed. This
  // is how an already-queued reel gets rebuilt in the current video format.
  const puzzle = args['puzzle-id']
    ? puzzleById(args['puzzle-id'])
    : args['from-daily']
      ? puzzleFromDaily(args['from-daily'], parseInt(args['index'] ?? '1', 10))
      : puzzleFromPool(difficult, minRating);

  console.log(
    `${difficult ? 'DIFFICULT' : 'Normal'} render for ${dateStr} — ` +
    `puzzle ${puzzle.puzzleId} (${puzzle.theme}, rating ${puzzle.rating})`,
  );

  const dayDir = path.join(OUTPUT_DIR, dateStr);
  fs.mkdirSync(dayDir, { recursive: true });
  const outputFile = path.join(dayDir, `daily.${dateStr}-${puzzle.puzzleId}.mp4`);

  // Analyze the puzzle to get an accurate result + a context-aware quip.
  const rawMoves = puzzle.moves.split(' ');
  const setupUci = rawMoves[0];
  const chess = new Chess(puzzle.fen);
  chess.move({
    from: setupUci.slice(0, 2),
    to: setupUci.slice(2, 4),
    promotion: setupUci.length > 4 ? setupUci[4] : undefined,
  });
  const puzzleFen = chess.fen();
  const playerColor = chess.turn() === 'w' ? 'white' : 'black';
  const solutionUciMoves = rawMoves.slice(1);

  const finalChess = new Chess(puzzleFen);
  for (const uci of solutionUciMoves) {
    try {
      finalChess.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci.length > 4 ? uci[4] : undefined,
      });
    } catch { break; }
  }

  const result = describeResult(
    puzzleFen, finalChess.fen(), playerColor as 'white' | 'black',
    puzzle.allThemes, solutionUciMoves,
  );
  const quip = getVideoQuip(puzzle.puzzleId, result, puzzle.allThemes, puzzle.theme);
  console.log(`  Result: "${result.text}" (${result.category})`);
  console.log(`  Quip:   "${quip}"`);

  const inputProps = {
    puzzleId: puzzle.puzzleId,
    rawFen: puzzle.fen,
    rawMoves,
    rating: puzzle.rating,
    themes: puzzle.allThemes,
    quip,
    difficult,
  };
  const propsJson = JSON.stringify(inputProps);

  console.log(`Rendering → ${path.basename(outputFile)}...`);
  try {
    execSync(
      `npx remotion render ${ENTRY_POINT} DailyPuzzleVideo "${outputFile}" --props='${propsJson.replace(/'/g, "'\\''")}' --config=remotion.config.ts`,
      { stdio: 'inherit', timeout: 600_000 },
    );
  } catch (err) {
    console.error('Render failed:', err);
    process.exit(1);
  }

  // Caption (lib/ig-captions.ts is the only place this copy lives)
  const caption = generateCaption({
    puzzleId: puzzle.puzzleId,
    rating: puzzle.rating,
    theme: puzzle.theme,
    quip,
    difficult,
    // Difficult reels open with a line derived from THIS position, not hype.
    fen: puzzle.fen,
    rawMoves,
  });
  fs.writeFileSync(outputFile.replace('.mp4', '.txt'), caption);

  // Sidecar — the authority on this reel's `difficult` flag from here on.
  writeSidecar(outputFile, {
    puzzleId: puzzle.puzzleId,
    date: dateStr,
    difficult,
    rating: puzzle.rating,
    theme: puzzle.theme,
    quip,
    renderedAt: new Date().toISOString(),
  });

  // Ledger (a cache of disk, kept for ids whose mp4 gets cleaned up later)
  const usage = loadUsage();
  if (!usage.usedPuzzleIds.includes(puzzle.puzzleId)) usage.usedPuzzleIds.push(puzzle.puzzleId);
  usage.renders.push({
    puzzleId: puzzle.puzzleId,
    date: dateStr,
    file: path.basename(outputFile),
    difficult,
  });
  saveUsage(usage);

  console.log(`\nDone!`);
  console.log(`  Video:   ${outputFile}`);
  console.log(`  Caption: ${outputFile.replace('.mp4', '.txt')}`);
  console.log(`\n--- CAPTION ---\n${caption}\n--- END ---`);
}

main();
