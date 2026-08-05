/**
 * Rebuild captions on UNPOSTED items in the IG Blob queue from the current
 * lib/ig-captions.ts structure — setup above the spoiler gap, payoff below.
 * Carries the original Rating and quip over; everything else is regenerated.
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
import { THEME_HOOKS, generateCaption } from '../lib/ig-captions';
import { stripEmojis } from '../lib/instagram';

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

  let skipped = 0;

  for (const item of unposted) {
    const firstLine = item.caption.split('\n').find(l => l.trim() !== '') ?? '';
    if (!firstLine) continue;

    // Rebuilding needs the position — that's what names the side to move and
    // derives the payoff. Without it we cannot safely restructure, so leave the
    // item alone rather than write a caption we can't stand behind.
    const puzzle = item.puzzleId ? PUZZLES[item.puzzleId] : undefined;
    if (!puzzle) { skipped++; continue; }

    // Carry the two human-written values over from the old caption.
    const rating = Number(item.caption.match(/Rating:\s*(\d+)/)?.[1] ?? 0);
    const quip = item.caption.match(/"([^"]+)"/)?.[1] ?? '';

    // The item's own flag is authoritative (set at render time). Only legacy
    // items with no flag at all fall back to reading their text.
    const isDifficult = item.difficult ?? /DIFFICULT|TOUGH|miss it/i.test(firstLine);

    // Regenerate the WHOLE caption. The structure changed (setup above the
    // spoiler gap, payoff below), so a line-by-line swap can't get there.
    const caption = stripEmojis(generateCaption({
      puzzleId: item.puzzleId!,
      rating,
      theme: puzzle.theme || OLD_HOOK_THEME[norm(firstLine)] || 'generic',
      quip,
      difficult: isDifficult,
      fen: puzzle.fen,
      rawMoves: puzzle.moves.split(' '),
    }));

    if (caption !== item.caption) {
      changed++;
      if (!save) {
        console.log(`--- ${item.date}${item.difficult ? ' (difficult)' : ''} ---`);
        console.log(`OLD first line: ${firstLine}`);
        console.log(caption.split('\n').map(l => `    ${l}`).join('\n'));
        console.log('');
      }
      item.caption = caption;
    }
  }

  console.log(`\n${unposted.length} unposted items, ${changed} captions rebuilt, ` +
    `${skipped} skipped (no puzzle data — left untouched).`);
  if (save) {
    await saveQueue(queue);
    console.log('Manifest saved to Blob.');
  } else {
    console.log('Dry run — re-run with --save to write.');
  }
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
