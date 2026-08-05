/**
 * Instagram post queue, stored as a single JSON manifest in Vercel Blob.
 * Decouples rendering (local, whenever) from posting (daily cron, reliable).
 *
 * Videos live in Blob; the manifest tracks order + posted state. The daily
 * cron pops the oldest unposted item, publishes it, and saves the manifest back.
 */
import { list, put } from '@vercel/blob';
import { easternDayOfWeek, isDifficultDay } from './ig-difficult-days';

// Re-exported so callers have one import site for queue + cadence.
export { easternDayOfWeek, isDifficultDay };

const MANIFEST_PATH = 'ig-queue/manifest.json';

export interface QueueItem {
  date: string;        // original folder name, e.g. "5.31.26"
  caption: string;
  videoUrl: string;    // public Blob URL
  sortKey: number;     // chronological sort (ms)
  posted: boolean;
  postedAt?: string;
  mediaId?: string;
  difficult?: boolean; // true = a "Difficult Puzzle" reel (posts on difficult days)
  puzzleId?: string;   // Lichess puzzle id, for dedup across folders/renders
}

/** Parse "M.D.YY" into a sortable timestamp; falls back to 0 if unparseable. */
export function dateToSortKey(date: string): number {
  const m = date.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2})$/);
  if (!m) return 0;
  const [, mo, d, yy] = m;
  return Date.UTC(2000 + Number(yy), Number(mo) - 1, Number(d));
}

export async function loadQueue(): Promise<QueueItem[]> {
  const { blobs } = await list({ prefix: MANIFEST_PATH });
  const manifest = blobs.find(b => b.pathname === MANIFEST_PATH);
  if (!manifest) return [];
  const res = await fetch(manifest.url, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function saveQueue(queue: QueueItem[]): Promise<void> {
  await put(MANIFEST_PATH, JSON.stringify(queue, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

const oldestUnposted = (queue: QueueItem[], difficult: boolean): QueueItem | null =>
  queue
    .filter(i => !i.posted && !!i.difficult === difficult)
    .sort((a, b) => a.sortKey - b.sortKey)[0] ?? null;

/**
 * Weekday-aware pick for the daily poster. On difficult days (DIFFICULT_DOW in
 * ET — currently Mon/Tue/Thu/Fri/Sat) it serves the oldest unposted DIFFICULT
 * reel; on the remaining days the oldest NORMAL reel. If the preferred pool is
 * empty it falls back to the other pool so the account never silently skips a
 * day. Returns what was picked + why.
 */
export function nextForDate(
  queue: QueueItem[],
  when: Date,
): { item: QueueItem; wantedDifficult: boolean; fellBack: boolean } | null {
  const wantDifficult = isDifficultDay(when);
  const preferred = oldestUnposted(queue, wantDifficult);
  if (preferred) return { item: preferred, wantedDifficult: wantDifficult, fellBack: false };
  const other = oldestUnposted(queue, !wantDifficult);
  if (other) return { item: other, wantedDifficult: wantDifficult, fellBack: true };
  return null;
}

/** Unposted counts per pool + rough runway, for refill/reporting. */
export function queueRunway(queue: QueueItem[]) {
  const normal = queue.filter(i => !i.posted && !i.difficult).length;
  const difficult = queue.filter(i => !i.posted && i.difficult).length;
  return {
    normal,
    difficult,
    normalDays: normal,          // ~1 normal post per Wed/Sun
    difficultWeeks: difficult / 5, // 5 difficult slots per week (Mon/Tue/Thu/Fri/Sat)
  };
}
