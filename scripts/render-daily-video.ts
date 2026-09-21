/**
 * Render Daily Puzzle Video — the ONLY renderer for daily puzzle reels.
 *
 *   npx tsx scripts/render-daily-video.ts                      # next unused puzzle, today
 *   npx tsx scripts/render-daily-video.ts --date=8.14.26       # render for a target date
 *   npx tsx scripts/render-daily-video.ts --min-rating=1700    # extra rating floor
 *   npx tsx scripts/render-daily-video.ts --tier=impossible    # force a tier (normal|difficult|impossible)
 *   npx tsx scripts/render-daily-video.ts --from-daily=2026-04-29 --index=18
 *                                                             # render a specific
 *                                                             # daily-challenge puzzle
 *
 * Sources of truth this obeys:
 *   - lib/ig-difficult-days.ts  — which days are difficult, and on which clock
 *   - lib/ig-captions.ts        — every word of the caption
 *   - lib/ig-reels.ts           — which puzzles are already used (disk ∪ ledger ∪ Blob queue)
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Chess } from 'chess.js';
import { describeResult } from '../remotion/lib/describe-result';
import { getVideoQuip } from '../remotion/lib/video-quips';
import { tierForDateLabel, easternDateLabel, type ReelTier } from '../lib/ig-difficult-days';
import { generateCaption, primaryTheme } from '../lib/ig-captions';
import { loadQueue, REEL_FORMAT_VERSION } from '../lib/ig-queue';
import {
  loadUsage, saveUsage, usedPuzzleIds, writeSidecar, allPoolPuzzles, TIER_POOLS,
  type PoolPuzzle,
} from '../lib/ig-reels';

const DAILY_FILE = path.join(process.cwd(), 'data', 'daily-challenge-puzzles.json');
const OUTPUT_DIR = path.join(process.cwd(), 'out', 'videos');
// Slim entry: only the daily-puzzle composition (bundles on a clean checkout).
const ENTRY_POINT = path.join(process.cwd(), 'remotion', 'daily-puzzle-entry.ts');
const TIERS: ReelTier[] = ['normal', 'difficult', 'impossible'];

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

/** A specific puzzle by id, from any tier's pool. Used for re-renders. */
function puzzleById(id: string): PoolPuzzle {
  const found = allPoolPuzzles()[id];
  if (!found) throw new Error(`Puzzle ${id} is in no pool`);
  return found;
}

/** Next unused puzzle from the tier's pool, honouring an optional rating floor. */
function puzzleFromPool(tier: ReelTier, minRating: number, excludeIds: string[]): PoolPuzzle {
  const { file: poolFile, curate } = TIER_POOLS[tier];
  if (!fs.existsSync(poolFile)) {
    throw new Error(`Pool file not found (${path.basename(poolFile)}). Run: npx tsx ${curate}`);
  }
  const pool: { puzzles: PoolPuzzle[] } = JSON.parse(fs.readFileSync(poolFile, 'utf-8'));

  // Dedup against everything actually rendered, not just the ledger — the
  // ledger has drifted before and we double-posted puzzles because of it.
  // `excludeIds` widens it with the Blob queue — the only record that survives
  // a machine without out/ (CI), since posted items are never removed from it.
  const used = usedPuzzleIds(excludeIds);
  const puzzle = pool.puzzles.find(p => !used.has(p.puzzleId) && p.rating >= minRating);
  if (!puzzle) {
    throw new Error(
      `No unused puzzles left in the ${tier} pool` +
      `${minRating ? ` with rating >= ${minRating}` : ''}. Re-run ${curate}.`,
    );
  }

  const remaining = pool.puzzles.filter(p => !used.has(p.puzzleId)).length - 1;
  if (remaining < 10) {
    console.warn(`⚠ Only ${remaining} unused puzzles left in the ${tier} pool — top up via ${curate}`);
  }
  return puzzle;
}

/** Every puzzle id ever queued (posted or not). Fails loud — a silent miss double-posts. */
async function queuedPuzzleIds(): Promise<string[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN not set — cannot dedup against the IG queue. ' +
      'Set it (.env.local) or pass --puzzle-id to re-render a specific puzzle.');
  }
  return (await loadQueue()).map(i => i.puzzleId).filter((id): id is string => !!id);
}

async function main() {
  const args = parseArgs();
  const minRating = args['min-rating'] ? parseInt(args['min-rating'], 10) : 0;

  // Target date drives BOTH the output folder and the tier.
  // Default is today in ET — the same clock the poster uses.
  const dateStr = args['date'] || easternDateLabel();

  const forced = args['tier'] as ReelTier | undefined;
  if (forced && !TIERS.includes(forced)) {
    throw new Error(`--tier must be one of ${TIERS.join('|')}, got "${forced}"`);
  }
  const tier: ReelTier = forced ?? tierForDateLabel(dateStr);
  const difficult = tier !== 'normal';

  // --puzzle-id re-renders a SPECIFIC puzzle, dedup deliberately bypassed. This
  // is how an already-queued reel gets rebuilt in the current video format.
  const puzzle = args['puzzle-id']
    ? puzzleById(args['puzzle-id'])
    : args['from-daily']
      ? puzzleFromDaily(args['from-daily'], parseInt(args['index'] ?? '1', 10))
      : puzzleFromPool(tier, minRating, await queuedPuzzleIds());

  console.log(
    `${tier.toUpperCase()} render for ${dateStr} — ` +
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
    tier,
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
    tier,
    // Difficult reels open with a line derived from THIS position, not hype.
    fen: puzzle.fen,
    rawMoves,
  });
  fs.writeFileSync(outputFile.replace('.mp4', '.txt'), caption);

  // Sidecar — the authority on this reel's tier from here on.
  writeSidecar(outputFile, {
    puzzleId: puzzle.puzzleId,
    date: dateStr,
    tier,
    difficult,
    rating: puzzle.rating,
    theme: puzzle.theme,
    quip,
    renderedAt: new Date().toISOString(),
    formatVersion: REEL_FORMAT_VERSION,
  });

  // Ledger (a cache of disk, kept for ids whose mp4 gets cleaned up later)
  const usage = loadUsage();
  if (!usage.usedPuzzleIds.includes(puzzle.puzzleId)) usage.usedPuzzleIds.push(puzzle.puzzleId);
  usage.renders.push({
    puzzleId: puzzle.puzzleId,
    date: dateStr,
    file: path.basename(outputFile),
    difficult,
    tier,
  });
  saveUsage(usage);

  console.log(`\nDone!`);
  console.log(`  Video:   ${outputFile}`);
  console.log(`  Caption: ${outputFile.replace('.mp4', '.txt')}`);
  console.log(`\n--- CAPTION ---\n${caption}\n--- END ---`);
}

main().catch(e => { console.error(e); process.exit(1); });
