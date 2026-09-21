/**
 * Instagram post queue, stored as a single JSON manifest in Vercel Blob.
 * Decouples rendering (local, whenever) from posting (daily cron, reliable).
 *
 * Videos live in Blob; the manifest tracks order + posted state. The daily
 * cron pops the oldest unposted item, publishes it, and saves the manifest back.
 */
import { list, put } from '@vercel/blob';
import {
  easternDayOfWeek, tierForDate, tierOf, TIER_SLOTS_PER_WEEK, type ReelTier,
} from './ig-difficult-days';

// Re-exported so callers have one import site for queue + cadence.
export { easternDayOfWeek, tierForDate, tierOf, type ReelTier };

const MANIFEST_PATH = 'ig-queue/manifest.json';

/**
 * The video format the DailyPuzzleVideo composition renders today. Bump it when
 * the composition changes in a way that should migrate unposted reels
 * (scripts/ig-rerender-queue.ts). Fresh renders are stamped with it.
 * 5 = final end card (slow fly-in + squash landing, badge lands last).
 * 6 = net-material result headline (a trade is never "Won the Queen!").
 */
export const REEL_FORMAT_VERSION = 6;

export interface QueueItem {
  date: string;        // original folder name, e.g. "5.31.26"
  caption: string;
  videoUrl: string;    // public Blob URL
  sortKey: number;     // chronological sort (ms)
  posted: boolean;
  postedAt?: string;
  mediaId?: string;
  /** normal | difficult | impossible. Absent on items queued before tiers — read via tierOf(). */
  tier?: ReelTier;
  /** Legacy flag, still written (= tier !== 'normal') so an older poster degrades sanely. */
  difficult?: boolean;
  puzzleId?: string;   // Lichess puzzle id, for dedup across folders/renders
  /**
   * Which video format this reel was rendered in. 2 = the no-spoiler format
   * (Stage 1 "{Color} to move" only, Stage 5s payoff card). Absent/1 = the old
   * format. scripts/ig-rerender-queue.ts migrates 1 → 2 and is resumable on it.
   */
  formatVersion?: number;
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

  // The manifest is written to a FIXED pathname with allowOverwrite, so its
  // public URL sits behind the Blob CDN and can serve a stale copy for a while
  // after a write — observed 2026-08-05 returning a queue 4 items out of date.
  // `cache: 'no-store'` only governs the local fetch cache, not the CDN, so the
  // uploadedAt stamp goes in the URL to force a fresh edge lookup. Without this
  // any read-modify-write on the queue can silently clobber a recent write.
  const fresh = `${manifest.url}?v=${new Date(manifest.uploadedAt).getTime()}`;
  const res = await fetch(fresh, { cache: 'no-store' });
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

const oldestUnposted = (queue: QueueItem[], tier: ReelTier): QueueItem | null =>
  queue
    .filter(i => !i.posted && tierOf(i) === tier)
    .sort((a, b) => a.sortKey - b.sortKey)[0] ?? null;

/**
 * When a tier's bucket is dry, serve the NEAREST tier — never jump straight to
 * normal (the format that underperforms ~5x) while hard reels are sitting there.
 */
const FALLBACK_ORDER: Record<ReelTier, ReelTier[]> = {
  impossible: ['impossible', 'difficult', 'normal'],
  difficult: ['difficult', 'impossible', 'normal'],
  normal: ['normal', 'difficult', 'impossible'],
};

/**
 * Weekday-aware pick for the daily poster: the oldest unposted reel of today's
 * tier (tierForDate, ET). If that bucket is empty it falls back per
 * FALLBACK_ORDER so the account never skips a day — and reports `fellBack` so
 * the caller can raise the alarm. Returns what was picked + why.
 */
export function nextForDate(
  queue: QueueItem[],
  when: Date,
): { item: QueueItem; wantedTier: ReelTier; fellBack: boolean } | null {
  const wantedTier = tierForDate(when);
  for (const tier of FALLBACK_ORDER[wantedTier]) {
    const item = oldestUnposted(queue, tier);
    if (item) return { item, wantedTier, fellBack: tier !== wantedTier };
  }
  return null;
}

/** Unposted count + weeks of runway per tier, for refill/reporting/alerts. */
export function queueRunway(queue: QueueItem[]) {
  const count = (tier: ReelTier) => queue.filter(i => !i.posted && tierOf(i) === tier).length;
  const out = {} as Record<ReelTier, { count: number; weeks: number }>;
  for (const tier of ['normal', 'difficult', 'impossible'] as const) {
    const n = count(tier);
    out[tier] = { count: n, weeks: n / TIER_SLOTS_PER_WEEK[tier] };
  }
  return out;
}
