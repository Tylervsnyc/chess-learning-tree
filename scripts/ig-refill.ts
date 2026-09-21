/**
 * IG inventory refill — the one command that keeps the poster fed.
 *
 *   npx tsx scripts/ig-refill.ts --top-up           # render whatever each tier is short of, then upload
 *   npx tsx scripts/ig-refill.ts --top-up --max=20  # same, bigger batch (default max 6 renders)
 *   npx tsx scripts/ig-refill.ts                    # upload any un-queued renders on disk
 *   npx tsx scripts/ig-refill.ts --render=14        # render 14 calendar days ahead first, then upload
 *   npx tsx scripts/ig-refill.ts --render=14 --start=7.28.26
 *   npx tsx scripts/ig-refill.ts --rebuild          # wipe queue + rebuild from disk (careful)
 *   npx tsx scripts/ig-refill.ts --dry              # show what would happen, touch nothing
 *
 * The ONLY path that puts a reel into the post queue. `--top-up` is what the
 * scheduled GitHub Action (.github/workflows/ig-refill.yml) runs every day, so
 * the queue refills itself.
 *   - dedups by PUZZLE ID, not folder date → multiple reels per day all get queued
 *   - reads each reel's tier from its render sidecar (lib/ig-reels.ts),
 *     never by sniffing caption text
 *   - reports runway per tier, exits non-zero when any tier is still low
 *
 * Tiers + weekdays: lib/ig-difficult-days.ts (normal / difficult / impossible).
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { execSync } from 'child_process';
import { uploadToBlob, stripEmojis } from '../lib/instagram';
import {
  loadQueue, saveQueue, dateToSortKey, queueRunway, tierOf,
  type QueueItem, type ReelTier,
} from '../lib/ig-queue';
import { discoverReels } from '../lib/ig-reels';
import { tierForDateLabel, easternDateLabel, TIER_SLOTS_PER_WEEK } from '../lib/ig-difficult-days';

const arg = (name: string): string | undefined =>
  process.argv.find(a => a.startsWith(`--${name}=`))?.split('=')[1];
const flag = (name: string): boolean => process.argv.includes(`--${name}`);

const TIERS: ReelTier[] = ['normal', 'difficult', 'impossible'];

/** Top-up targets: ~4 weeks of runway per tier. */
const TARGET_WEEKS = 4;
/** Below this many unposted reels in any tier, the run fails (→ GitHub alert). */
const LOW_WATER = 4;

// "M.D.YY" ↔ UTC calendar date. Labels have no timezone (see ig-difficult-days).
const parseLabel = (s: string) => new Date(dateToSortKey(s));
const fmtLabel = (dt: Date) =>
  `${dt.getUTCMonth() + 1}.${dt.getUTCDate()}.${String(dt.getUTCFullYear()).slice(-2)}`;
const addDays = (dt: Date, n: number) => new Date(dt.getTime() + n * 86_400_000);

function render(dateStr: string, tier?: ReelTier): boolean {
  try {
    execSync(
      `npx tsx scripts/render-daily-video.ts --date=${dateStr}${tier ? ` --tier=${tier}` : ''}`,
      { stdio: 'inherit', timeout: 600_000 },
    );
    return true;
  } catch {
    console.error(`  render failed for ${dateStr} — continuing`);
    return false;
  }
}

/** Render `count` calendar days ahead, starting from `start` (M.D.YY) or today. */
function renderAhead(count: number, start?: string) {
  const base = parseLabel(start ?? easternDateLabel());
  for (let i = 0; i < count; i++) {
    const dateStr = fmtLabel(addDays(base, i));
    console.log(`\n── Rendering ${dateStr} (${tierForDateLabel(dateStr)}, ${i + 1}/${count}) ──`);
    render(dateStr);
  }
}

/**
 * Render only what each tier is short of, most-starved tier first, up to `max`.
 * Each reel is dated on the next free weekday of its tier after that tier's
 * newest queued reel — so labels line up with the day they will actually post.
 */
function topUp(queue: QueueItem[], max: number, dry: boolean) {
  const rw = queueRunway(queue);
  const have: Record<ReelTier, number> = {
    normal: rw.normal.count, difficult: rw.difficult.count, impossible: rw.impossible.count,
  };
  const target = (t: ReelTier) => Math.ceil(TIER_SLOTS_PER_WEEK[t] * TARGET_WEEKS);

  // Cursor per tier = newest reel of that tier already queued, never before yesterday.
  const today = parseLabel(easternDateLabel());
  const cursor = {} as Record<ReelTier, Date>;
  for (const t of TIERS) {
    const newest = Math.max(0, ...queue.filter(i => tierOf(i) === t).map(i => i.sortKey));
    cursor[t] = new Date(Math.max(newest, addDays(today, -1).getTime()));
  }
  const nextDateFor = (t: ReelTier) => {
    let d = addDays(cursor[t], 1);
    while (tierForDateLabel(fmtLabel(d)) !== t) d = addDays(d, 1);
    cursor[t] = d;
    return fmtLabel(d);
  };

  console.log('Top-up plan — ' + TIERS.map(t => `${t} ${have[t]}/${target(t)}`).join(' · '));
  for (let n = 0; n < max; n++) {
    // Most-starved = fewest weeks of runway relative to its posting rate.
    const short = TIERS
      .filter(t => have[t] < target(t))
      .sort((a, b) => have[a] / TIER_SLOTS_PER_WEEK[a] - have[b] / TIER_SLOTS_PER_WEEK[b]);
    if (!short.length) break;
    const tier = short[0];
    const dateStr = nextDateFor(tier);
    console.log(`\n── [${n + 1}/${max}] ${tier.toUpperCase()} for ${dateStr} ──`);
    if (dry || render(dateStr, tier)) have[tier]++;
  }
}

async function main() {
  const dry = flag('dry');
  const rebuild = flag('rebuild');
  const renderCount = arg('render') ? parseInt(arg('render')!, 10) : 0;

  let queue: QueueItem[] = rebuild ? [] : await loadQueue();

  if (flag('top-up')) {
    topUp(queue, arg('max') ? parseInt(arg('max')!, 10) : 6, dry);
    if (dry) {
      console.log('\n[DRY] nothing rendered or uploaded.');
      return;
    }
    // Re-read: renders take minutes; never write back a stale copy of the manifest.
    queue = await loadQueue();
  } else if (renderCount > 0) {
    renderAhead(renderCount, arg('start'));
  }

  const havePuzzle = new Set(queue.map(i => i.puzzleId).filter(Boolean));
  const haveDate = new Set(queue.map(i => i.date)); // legacy items without puzzleId

  const reels = discoverReels();
  console.log(`\nDisk: ${reels.length} reels found. Queue: ${queue.length} items.`);

  const noSidecar = reels.filter(r => !r.hasSidecar).length;
  if (noSidecar) {
    console.log(`  (${noSidecar} legacy reels have no metadata sidecar — ` +
      `run: npx tsx scripts/ig-reconcile.ts --write)`);
  }

  const added: Record<ReelTier, number> = { normal: 0, difficult: 0, impossible: 0 };
  let skippedNoCaption = 0;
  for (const r of reels) {
    if (havePuzzle.has(r.puzzleId)) continue;
    if (!havePuzzle.size && haveDate.has(r.date)) continue; // conservative on legacy queues
    // Never queue a reel with no caption — it would post as a bare video.
    if (r.caption.trim().length < 20) {
      console.warn(`  ! ${r.date} ${r.puzzleId} has no caption file — skipped`);
      skippedNoCaption++;
      continue;
    }
    console.log(`  + ${r.tier.padEnd(10)} ${r.date} ${r.puzzleId}`);
    if (!dry) {
      const videoUrl = await uploadToBlob(r.mp4, `ig-queue/videos/${r.date}-${r.puzzleId}.mp4`);
      queue.push({
        date: r.date,
        caption: stripEmojis(r.caption),
        videoUrl,
        sortKey: dateToSortKey(r.date),
        posted: false,
        tier: r.tier,
        difficult: r.tier !== 'normal',
        puzzleId: r.puzzleId,
        ...(r.formatVersion ? { formatVersion: r.formatVersion } : {}),
      });
    }
    added[r.tier]++;
    havePuzzle.add(r.puzzleId);
  }

  if (!dry) await saveQueue(queue);

  const rw = queueRunway(queue);
  console.log(
    `\n${dry ? '[DRY] would add' : 'Added'} ` +
    TIERS.map(t => `${added[t]} ${t}`).join(' + ') + '.' +
    (skippedNoCaption ? ` (${skippedNoCaption} skipped — no caption)` : ''),
  );
  console.log('Runway — ' + TIERS.map(t =>
    `${t}: ${rw[t].count} unposted (~${rw[t].weeks.toFixed(1)} wks)`).join(' · '));

  const low = TIERS.filter(t => rw[t].count < LOW_WATER);
  if (low.length) {
    console.warn(`⚠ Low: ${low.join(', ')} — run: npx tsx scripts/ig-refill.ts --top-up --max=20`);
    process.exitCode = 1;
  }
}

main().catch(e => { console.error(e); process.exit(1); });
