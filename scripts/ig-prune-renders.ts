/**
 * Delete the local .mp4 of reels that have ALREADY POSTED.
 *
 *   npx tsx scripts/ig-prune-renders.ts          # dry run — list what would go
 *   npx tsx scripts/ig-prune-renders.ts --delete # actually delete
 *
 * A posted reel's video is published on Instagram and stored in Blob, so the
 * local copy is dead weight. The .txt caption and .json sidecar STAY — dedup
 * reads the sidecars (lib/ig-reels.ts renderedPuzzleIds), so pruning videos
 * never narrows the "have we used this puzzle" check back down to the ledger.
 *
 * Only touches reels the queue says are posted. Anything unposted, anything not
 * in the queue, and every sidecar is left alone.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { existsSync, statSync, unlinkSync } from 'fs';
import { loadQueue } from '../lib/ig-queue';
import { discoverReels, renderedPuzzleIds } from '../lib/ig-reels';

const DELETE = process.argv.includes('--delete');
const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;

async function main() {
  const queue = await loadQueue();
  const postedIds = new Set(queue.filter(i => i.posted && i.puzzleId).map(i => i.puzzleId!));
  const unpostedIds = new Set(queue.filter(i => !i.posted && i.puzzleId).map(i => i.puzzleId!));

  const reels = discoverReels();
  const idsBefore = renderedPuzzleIds().size;

  // Belt and braces: never delete something that is also queued unposted.
  const prunable = reels.filter(r =>
    postedIds.has(r.puzzleId) && !unpostedIds.has(r.puzzleId) && existsSync(r.mp4),
  );

  let bytes = 0;
  for (const r of prunable) bytes += statSync(r.mp4).size;

  console.log(`${reels.length} reels on disk · ${postedIds.size} posted per the queue`);
  console.log(`${prunable.length} local video(s) prunable, ${mb(bytes)}\n`);

  if (!prunable.length) { console.log('Nothing to prune.'); return; }

  for (const r of prunable.slice(0, DELETE ? prunable.length : 10)) {
    console.log(`  ${DELETE ? 'deleting' : 'would delete'} ${r.mp4}`);
    if (DELETE) unlinkSync(r.mp4);
  }
  if (!DELETE && prunable.length > 10) console.log(`  … and ${prunable.length - 10} more`);

  if (!DELETE) {
    console.log(`\nDry run — re-run with --delete to free ${mb(bytes)}.`);
    return;
  }

  // The whole point of keeping sidecars: dedup must not shrink.
  const idsAfter = renderedPuzzleIds().size;
  console.log(`\nFreed ${mb(bytes)}. Rendered-puzzle ids: ${idsBefore} → ${idsAfter}` +
    (idsAfter === idsBefore ? ' (unchanged — dedup intact)' : ' ⚠ CHANGED — investigate before rendering'));
}

main().catch(e => { console.error(e); process.exit(1); });
