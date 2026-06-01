/**
 * Instagram post queue, stored as a single JSON manifest in Vercel Blob.
 * Decouples rendering (local, whenever) from posting (daily cron, reliable).
 *
 * Videos live in Blob; the manifest tracks order + posted state. The daily
 * cron pops the oldest unposted item, publishes it, and saves the manifest back.
 */
import { list, put } from '@vercel/blob';

const MANIFEST_PATH = 'ig-queue/manifest.json';

export interface QueueItem {
  date: string;        // original folder name, e.g. "5.31.26"
  caption: string;
  videoUrl: string;    // public Blob URL
  sortKey: number;     // chronological sort (ms)
  posted: boolean;
  postedAt?: string;
  mediaId?: string;
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

/** Oldest unposted item, or null if the queue is drained. */
export function nextUnposted(queue: QueueItem[]): QueueItem | null {
  return queue
    .filter(i => !i.posted)
    .sort((a, b) => a.sortKey - b.sortKey)[0] ?? null;
}
