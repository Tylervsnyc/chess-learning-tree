/**
 * IG inventory refill — the one command that keeps the poster fed.
 *
 *   npx tsx scripts/ig-refill.ts                 # upload any un-queued renders on disk
 *   npx tsx scripts/ig-refill.ts --render=14     # render 14 days ahead first, then upload
 *   npx tsx scripts/ig-refill.ts --render=14 --start=7.28.26
 *   npx tsx scripts/ig-refill.ts --rebuild       # wipe queue + rebuild from disk (careful)
 *   npx tsx scripts/ig-refill.ts --dry           # show what would happen, touch nothing
 *
 * Fixes the old ig-upload-queue.ts pitfalls:
 *   - dedups by PUZZLE ID, not folder date → multiple reels per day all get queued
 *   - tags each item difficult/normal (from its caption) so the weekday-aware
 *     cron can serve difficult reels on Thu/Sat
 *   - reports runway per pool so you know when to refill again
 *
 * Rendering is local (Remotion). Difficult vs normal is auto-picked by the
 * target DATE inside render-daily-video.ts (Thu/Sat → hard pool).
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { uploadToBlob, stripEmojis } from '../lib/instagram';
import {
  loadQueue, saveQueue, dateToSortKey, queueRunway, type QueueItem,
} from '../lib/ig-queue';

const VIDEOS_DIR = 'out/videos';

const arg = (name: string): string | undefined =>
  process.argv.find(a => a.startsWith(`--${name}=`))?.split('=')[1];
const flag = (name: string): boolean => process.argv.includes(`--${name}`);

interface DiscoveredReel {
  date: string;       // folder name, e.g. "7.28.26"
  puzzleId: string;   // from filename
  mp4: string;
  caption: string;
  difficult: boolean;
}

/** puzzleId → difficult, from the render log (the reliable source of truth). */
function difficultMap(): Record<string, boolean> {
  const f = join('data', 'video-puzzle-usage.json');
  if (!existsSync(f)) return {};
  const usage = JSON.parse(readFileSync(f, 'utf8'));
  const map: Record<string, boolean> = {};
  for (const r of usage.renders ?? []) if (r.puzzleId) map[r.puzzleId] = !!r.difficult;
  return map;
}

/** Every daily reel across every folder — NOT one-per-folder. */
function discoverReels(): DiscoveredReel[] {
  if (!existsSync(VIDEOS_DIR)) return [];
  const diffByPuzzle = difficultMap();
  const reels: DiscoveredReel[] = [];
  for (const entry of readdirSync(VIDEOS_DIR)) {
    const dir = join(VIDEOS_DIR, entry);
    if (!statSync(dir).isDirectory()) continue;
    const files = readdirSync(dir);
    for (const mp4 of files.filter(f => f.startsWith('daily.') && f.endsWith('.mp4'))) {
      const base = mp4.replace(/\.mp4$/, '');            // daily.7.28.26-abc12
      const puzzleId = base.split('-').pop()!;            // abc12
      const txt = `${base}.txt`;
      const caption = files.includes(txt) ? readFileSync(join(dir, txt), 'utf8') : '';
      // Trust the render log; fall back to caption text for legacy renders.
      const difficult = diffByPuzzle[puzzleId] ?? /difficult puzzle/i.test(caption);
      reels.push({ date: entry, puzzleId, mp4: join(dir, mp4), caption, difficult });
    }
  }
  return reels;
}

/** Render `count` days ahead, starting from `start` (M.D.YY) or today. */
function renderAhead(count: number, start?: string) {
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

  if (renderCount > 0) renderAhead(renderCount, arg('start'));

  let queue: QueueItem[] = rebuild ? [] : await loadQueue();
  const havePuzzle = new Set(queue.map(i => i.puzzleId).filter(Boolean));
  const haveDate = new Set(queue.map(i => i.date)); // legacy items without puzzleId

  const reels = discoverReels();
  console.log(`\nDisk: ${reels.length} reels found. Queue: ${queue.length} items.` +
    (difficultOnly ? ' (difficult-only)' : ''));

  let addedN = 0, addedD = 0;
  for (const r of reels) {
    if (difficultOnly && !r.difficult) continue;
    if (havePuzzle.has(r.puzzleId)) continue;
    if (!havePuzzle.size && haveDate.has(r.date)) continue; // conservative on legacy queues
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
    `\n${dry ? '[DRY] would add' : 'Added'} ${addedN} normal + ${addedD} difficult.`,
  );
  console.log(
    `Runway — normal: ${rw.normal} unposted (~${rw.normal} days) · ` +
    `difficult: ${rw.difficult} unposted (~${rw.difficultWeeks.toFixed(1)} weeks at 5 difficult days/wk)`,
  );
  if (rw.difficult < 4) console.warn('⚠ Difficult pool low — render more: --render=14');
}

main().catch(e => { console.error(e); process.exit(1); });
