/**
 * Migrate every UNPOSTED queued reel to the current video format.
 *
 *   npx tsx scripts/ig-rerender-queue.ts --dry        # show the plan, touch nothing
 *   npx tsx scripts/ig-rerender-queue.ts              # migrate everything
 *   npx tsx scripts/ig-rerender-queue.ts --difficult-only
 *   npx tsx scripts/ig-rerender-queue.ts --limit=5    # do a few first
 *
 * Captions alone could be fixed in place, but the VIDEO also carried the old
 * format: Stage 1 said "Can you find the solution?" and Stage 4 was 3s with no
 * explanation. Those only change by re-rendering, so this re-renders each reel
 * from its own puzzle, re-uploads it, and rewrites the manifest entry.
 *
 * Resumable: each migrated item is stamped `formatVersion: 2` and skipped on the
 * next run, and the manifest is saved after EVERY item — a crash mid-way costs
 * one reel, not the batch.
 *
 * Items whose puzzle is in neither pool cannot be rebuilt. They are reported and
 * left alone; `--drop-orphans` removes them from the queue instead, so nothing
 * off-format can post.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as fs from 'fs';
import { execSync } from 'child_process';
import { loadQueue, saveQueue } from '../lib/ig-queue';
import { uploadToBlob, stripEmojis } from '../lib/instagram';

const CURRENT_FORMAT = 2;

const arg = (n: string) => process.argv.find(a => a.startsWith(`--${n}=`))?.split('=')[1];
const flag = (n: string) => process.argv.includes(`--${n}`);

const POOL_IDS = new Set<string>();
for (const f of ['data/video-puzzle-pool.json', 'data/video-puzzle-pool-hard.json']) {
  if (!fs.existsSync(f)) continue;
  for (const p of JSON.parse(fs.readFileSync(f, 'utf8')).puzzles ?? []) POOL_IDS.add(p.puzzleId);
}

/** Re-render one puzzle at its own date; returns the new mp4 + caption paths. */
function rerender(puzzleId: string, date: string, difficult: boolean) {
  const forceFlag = difficult ? '--difficult' : '--no-difficult';
  execSync(
    `npx tsx scripts/render-daily-video.ts --puzzle-id=${puzzleId} --date=${date} ${forceFlag}`,
    { stdio: 'inherit', timeout: 600_000 },
  );
  const mp4 = `out/videos/${date}/daily.${date}-${puzzleId}.mp4`;
  const txt = mp4.replace('.mp4', '.txt');
  if (!fs.existsSync(mp4) || !fs.existsSync(txt)) {
    throw new Error(`render produced no output for ${puzzleId} @ ${date}`);
  }
  return { mp4, caption: fs.readFileSync(txt, 'utf8') };
}

async function main() {
  const dry = flag('dry');
  const difficultOnly = flag('difficult-only');
  const dropOrphans = flag('drop-orphans');
  const limit = arg('limit') ? parseInt(arg('limit')!, 10) : Infinity;

  let queue = await loadQueue();
  const unposted = queue.filter(i => !i.posted);

  const orphans = unposted.filter(i => !i.puzzleId || !POOL_IDS.has(i.puzzleId));
  const todo = unposted
    .filter(i => i.puzzleId && POOL_IDS.has(i.puzzleId))
    .filter(i => (i.formatVersion ?? 1) < CURRENT_FORMAT)
    .filter(i => !difficultOnly || i.difficult)
    .sort((a, b) => a.sortKey - b.sortKey);          // soonest-to-post first

  const done = unposted.filter(i => (i.formatVersion ?? 1) >= CURRENT_FORMAT).length;
  console.log(
    `Queue: ${unposted.length} unposted · ${done} already on format ${CURRENT_FORMAT} · ` +
    `${todo.length} to migrate · ${orphans.length} orphan(s) with no pool puzzle`,
  );
  console.log('Order is soonest-to-post first, so the next reels out are fixed first.\n');

  if (orphans.length) {
    for (const o of orphans) {
      console.log(`  orphan ${o.date} (${o.puzzleId ?? 'no puzzleId'}) — ` +
        (dropOrphans ? 'will be REMOVED from the queue' : 'left as-is; pass --drop-orphans to remove'));
    }
    console.log('');
  }

  if (dry) {
    for (const i of todo.slice(0, limit)) {
      console.log(`  would re-render ${i.difficult ? 'DIFFICULT' : 'normal   '} ${i.date} ${i.puzzleId}`);
    }
    console.log(`\n[DRY] ${Math.min(todo.length, limit)} reel(s) would be migrated.`);
    return;
  }

  if (dropOrphans && orphans.length) {
    const drop = new Set(orphans);
    queue = queue.filter(i => !drop.has(i));
    await saveQueue(queue);
    console.log(`Removed ${orphans.length} orphan(s) from the queue.\n`);
  }

  let ok = 0, failed = 0;
  const batch = todo.slice(0, limit);

  for (const [n, item] of batch.entries()) {
    const label = `${item.date} ${item.puzzleId} (${item.difficult ? 'difficult' : 'normal'})`;
    console.log(`\n── [${n + 1}/${batch.length}] ${label} ──`);
    try {
      const { mp4, caption } = rerender(item.puzzleId!, item.date, !!item.difficult);
      const videoUrl = await uploadToBlob(
        mp4, `ig-queue/videos/${item.date}-${item.puzzleId}-v${CURRENT_FORMAT}.mp4`,
      );

      // Mutate the ONE in-memory queue and save it. Re-reading per item looked
      // safer but was the opposite: the manifest URL is CDN-cached, so a stale
      // read would drop whatever the previous iteration had just written.
      item.videoUrl = videoUrl;
      item.caption = stripEmojis(caption);
      item.formatVersion = CURRENT_FORMAT;
      await saveQueue(queue);
      ok++;
      console.log(`   migrated → format ${CURRENT_FORMAT}`);
    } catch (err) {
      failed++;
      console.error(`   FAILED: ${(err as Error).message} — continuing`);
    }
  }

  const remaining = queue
    .filter(i => !i.posted && i.puzzleId && POOL_IDS.has(i.puzzleId))
    .filter(i => (i.formatVersion ?? 1) < CURRENT_FORMAT).length;
  console.log(`\nMigrated ${ok}, failed ${failed}. ${remaining} unposted reel(s) still on the old format.`);
  if (remaining) console.log('Re-run to continue — completed items are skipped.');
}

main().catch(e => { console.error(e); process.exit(1); });
