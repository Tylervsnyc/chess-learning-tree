/**
 * IG inventory refill — the one command that keeps the poster fed.
 *
 *   npx tsx scripts/ig-refill.ts                 # upload any un-queued renders on disk
 *   npx tsx scripts/ig-refill.ts --render=14     # render 14 days ahead first, then upload
 *   npx tsx scripts/ig-refill.ts --render=28 --render-difficult-only
 *                                                # only render the difficult days in that window
 *   npx tsx scripts/ig-refill.ts --render=14 --start=7.28.26
 *   npx tsx scripts/ig-refill.ts --rebuild       # wipe queue + rebuild from disk (careful)
 *   npx tsx scripts/ig-refill.ts --dry           # show what would happen, touch nothing
 *
 * The ONLY path that puts a reel into the post queue.
 *   - dedups by PUZZLE ID, not folder date → multiple reels per day all get queued
 *   - reads each reel's `difficult` flag from its render sidecar (lib/ig-reels.ts),
 *     never by sniffing caption text
 *   - reports runway per pool so you know when to refill again
 *
 * Rendering is local (Remotion). Difficult vs normal is auto-picked by the
 * target DATE inside render-daily-video.ts (DIFFICULT_DOW → hard pool).
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { execSync } from 'child_process';
import { uploadToBlob, stripEmojis } from '../lib/instagram';
import {
  loadQueue, saveQueue, dateToSortKey, queueRunway, type QueueItem,
} from '../lib/ig-queue';
import { discoverReels } from '../lib/ig-reels';
import { isDifficultDateLabel } from '../lib/ig-difficult-days';

const arg = (name: string): string | undefined =>
  process.argv.find(a => a.startsWith(`--${name}=`))?.split('=')[1];
const flag = (name: string): boolean => process.argv.includes(`--${name}`);

/**
 * Render `count` days ahead, starting from `start` (M.D.YY) or today.
 * With `difficultOnly`, normal days in the window are skipped — difficult reels
 * are the ones that perform (~5x) and the ones the queue actually runs short of.
 */
function renderAhead(count: number, start?: string, difficultOnly = false) {
  const parse = (s: string) => {
    const [m, d, y] = s.split('.').map(Number);
    return new Date(2000 + y, m - 1, d);
  };
  const fmt = (dt: Date) =>
    `${dt.getMonth() + 1}.${dt.getDate()}.${String(dt.getFullYear()).slice(-2)}`;
  const base = start ? parse(start) : new Date();
  for (let i = 0; i < count; i++) {
    const dt = new Date(base);
    dt.setDate(base.getDate() + i);
    const dateStr = fmt(dt);
    if (difficultOnly && !isDifficultDateLabel(dateStr)) {
      console.log(`\n── Skipping ${dateStr} (normal day, --render-difficult-only) ──`);
      continue;
    }
    console.log(`\n── Rendering ${dateStr} (${i + 1}/${count}) ──`);
    try {
      execSync(`npx tsx scripts/render-daily-video.ts --date=${dateStr}`, {
        stdio: 'inherit', timeout: 320_000,
      });
    } catch {
      console.error(`  render failed for ${dateStr} — continuing`);
    }
  }
}

async function main() {
  const dry = flag('dry');
  const rebuild = flag('rebuild');
  const difficultOnly = flag('difficult-only');
  const renderCount = arg('render') ? parseInt(arg('render')!, 10) : 0;

  if (renderCount > 0) {
    renderAhead(renderCount, arg('start'), flag('render-difficult-only'));
  }

  let queue: QueueItem[] = rebuild ? [] : await loadQueue();
  const havePuzzle = new Set(queue.map(i => i.puzzleId).filter(Boolean));
  const haveDate = new Set(queue.map(i => i.date)); // legacy items without puzzleId

  const reels = discoverReels();
  console.log(`\nDisk: ${reels.length} reels found. Queue: ${queue.length} items.` +
    (difficultOnly ? ' (difficult-only)' : ''));

  const noSidecar = reels.filter(r => !r.hasSidecar).length;
  if (noSidecar) {
    console.log(`  (${noSidecar} legacy reels have no metadata sidecar — ` +
      `run: npx tsx scripts/ig-reconcile.ts --write)`);
  }

  let addedN = 0, addedD = 0, skippedNoCaption = 0;
  for (const r of reels) {
    if (difficultOnly && !r.difficult) continue;
    if (havePuzzle.has(r.puzzleId)) continue;
    if (!havePuzzle.size && haveDate.has(r.date)) continue; // conservative on legacy queues
    // Never queue a reel with no caption — it would post as a bare video.
    if (r.caption.trim().length < 20) {
      console.warn(`  ! ${r.date} ${r.puzzleId} has no caption file — skipped`);
      skippedNoCaption++;
      continue;
    }
    console.log(`  + ${r.difficult ? 'DIFFICULT' : 'normal   '} ${r.date} ${r.puzzleId}`);
    if (!dry) {
      const videoUrl = await uploadToBlob(r.mp4, `ig-queue/videos/${r.date}-${r.puzzleId}.mp4`);
      queue.push({
        date: r.date,
        caption: stripEmojis(r.caption),
        videoUrl,
        sortKey: dateToSortKey(r.date),
        posted: false,
        difficult: r.difficult,
        puzzleId: r.puzzleId,
      });
    }
    r.difficult ? addedD++ : addedN++;
    havePuzzle.add(r.puzzleId);
  }

  if (!dry) await saveQueue(queue);

  const rw = queueRunway(queue);
  console.log(
    `\n${dry ? '[DRY] would add' : 'Added'} ${addedN} normal + ${addedD} difficult.` +
    (skippedNoCaption ? ` (${skippedNoCaption} skipped — no caption)` : ''),
  );
  console.log(
    `Runway — normal: ${rw.normal} unposted (~${rw.normal} days) · ` +
    `difficult: ${rw.difficult} unposted (~${rw.difficultWeeks.toFixed(1)} weeks at 5 difficult days/wk)`,
  );
  if (rw.difficult < 4) {
    console.warn('⚠ Difficult pool low — render more: --render=28 --render-difficult-only');
  }
  // 5 difficult slots/wk vs 2 normal. A big normal backlog is dead inventory in
  // the format that underperforms ~5x, so flag the imbalance explicitly.
  const normalWeeks = rw.normal / 2;
  if (normalWeeks > rw.difficultWeeks * 2 && rw.normal > 10) {
    console.warn(
      `⚠ Inventory is lopsided — normal has ~${normalWeeks.toFixed(0)} weeks of runway ` +
      `vs ~${rw.difficultWeeks.toFixed(1)} for difficult. Render difficult days only: ` +
      `--render=28 --render-difficult-only`,
    );
  }
}

main().catch(e => { console.error(e); process.exit(1); });
