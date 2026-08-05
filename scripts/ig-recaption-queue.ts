/**
 * Rewrite captions on UNPOSTED items in the IG Blob queue using the current
 * copy pools in lib/ig-captions.ts (small pools made the feed read like
 * reposts — Tyler, 2026-08-04). Keeps the Rating line and the quip.
 *
 *   npx tsx scripts/ig-recaption-queue.ts          # dry run — prints before/after
 *   npx tsx scripts/ig-recaption-queue.ts --save   # writes the manifest back to Blob
 *
 * All caption copy lives in lib/ig-captions.ts. Nothing is duplicated here.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as fs from 'fs';
import { loadQueue, saveQueue } from '../lib/ig-queue';
import {
  THEME_HOOKS, GUESS_LINES, CTA_LINES,
  captionHash, hookForReel, guessLineFor, ctaFor,
} from '../lib/ig-captions';

// puzzleId → the puzzle itself, from the render pools. Needed for the theme AND
// for the position, so difficult items get a real insight hook rather than hype.
interface PoolPuzzle { puzzleId: string; fen: string; moves: string; theme: string }
const PUZZLES: Record<string, PoolPuzzle> = {};
for (const f of ['data/video-puzzle-pool.json', 'data/video-puzzle-pool-hard.json']) {
  if (!fs.existsSync(f)) continue;
  for (const p of JSON.parse(fs.readFileSync(f, 'utf8')).puzzles ?? []) {
    if (p.puzzleId) PUZZLES[p.puzzleId] = p;
  }
}

// Queue captions passed through stripEmojis, so match hooks emoji-blind
const norm = (s: string) => s.replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, ' ').trim();

// Old hook text → theme, for legacy items with no puzzleId. The first two
// entries of each pool are the original (pre-2026-08-04) hooks.
const OLD_HOOK_THEME: Record<string, string> = {};
for (const [theme, hooks] of Object.entries(THEME_HOOKS)) {
  for (const h of hooks.slice(0, 2)) OLD_HOOK_THEME[norm(h)] = theme;
}

async function main() {
  const save = process.argv.includes('--save');
  const queue = await loadQueue();
  const unposted = queue.filter(q => !q.posted);
  let changed = 0;

  for (const item of unposted) {
    const lines = item.caption.split('\n');
    const firstLine = lines.find(l => l.trim() !== '') ?? '';
    if (!firstLine) continue;

    // Seed on puzzleId ONLY — same seed the renderer uses. That makes this
    // script idempotent: it converges each queued caption on exactly what
    // lib/ig-captions.ts would write today, instead of reshuffling every run.
    const hash = captionHash(item.puzzleId ?? item.date);
    // The item's own flag is authoritative (set at render time). Only legacy
    // items with no flag at all fall back to reading their text.
    const isDifficult = item.difficult ?? /DIFFICULT|TOUGH|miss it/i.test(firstLine);

    const puzzle = item.puzzleId ? PUZZLES[item.puzzleId] : undefined;
    const theme = puzzle?.theme || OLD_HOOK_THEME[norm(firstLine)] || 'generic';

    // hookForReel prefers a position-derived insight on difficult reels and
    // falls back to the pools when the position yields nothing provable.
    const newHook = hookForReel({
      puzzleId: item.puzzleId ?? item.date,
      rating: 0,
      theme,
      quip: '',
      difficult: isDifficult,
      fen: puzzle?.fen,
      rawMoves: puzzle?.moves.split(' '),
    });

    // Queue captions are emoji-stripped, so match every pool line emoji-blind.
    const GUESS_SET = new Set(GUESS_LINES.map(norm));
    const CTA_SET = new Set(CTA_LINES.map(norm));

    const caption = lines
      .map(line => {
        if (line === firstLine) return newHook;
        if (GUESS_SET.has(norm(line))) return guessLineFor(hash);
        if (CTA_SET.has(norm(line))) return ctaFor(hash);
        return line;
      })
      .join('\n');

    if (caption !== item.caption) {
      changed++;
      if (!save) {
        console.log(`--- ${item.date}${item.difficult ? ' (difficult)' : ''} ---`);
        console.log(`OLD: ${firstLine}`);
        console.log(`NEW: ${caption.split('\n')[0]}`);
      }
      item.caption = caption;
    }
  }

  console.log(`\n${unposted.length} unposted items, ${changed} captions rewritten.`);
  if (save) {
    await saveQueue(queue);
    console.log('Manifest saved to Blob.');
  } else {
    console.log('Dry run — re-run with --save to write.');
  }
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
