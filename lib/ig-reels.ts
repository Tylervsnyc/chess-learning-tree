/**
 * Rendered reels on disk — ONE source of truth for "what have we already made".
 *
 * The old design trusted `data/video-puzzle-usage.json` alone. That ledger
 * drifted (44 rendered puzzles were missing from it) and the renderer re-picked
 * puzzles it had already used, which put the SAME puzzle on Instagram twice
 * (Cwu4G, amUUt — 2026-08). Disk is the thing that actually exists, so disk is
 * the authority; the ledger is now a durable cache of ids whose .mp4 may have
 * been cleaned up.
 *
 * Each render also writes a SIDECAR (`daily.{date}-{id}.json`) next to the mp4
 * holding its metadata — crucially `difficult`. Nothing downstream re-infers
 * that flag from caption text ever again.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

export const VIDEOS_DIR = join(process.cwd(), 'out', 'videos');
export const USAGE_FILE = join(process.cwd(), 'data', 'video-puzzle-usage.json');

export interface ReelMeta {
  puzzleId: string;
  date: string;        // folder / label, "M.D.YY"
  difficult: boolean;
  rating?: number;
  theme?: string;
  quip?: string;
  renderedAt?: string;
}

export interface DiscoveredReel extends ReelMeta {
  mp4: string;
  caption: string;
  hasSidecar: boolean;
}

export interface UsageData {
  usedPuzzleIds: string[];
  renders: { puzzleId: string; date: string; file: string; difficult?: boolean }[];
}

export function loadUsage(): UsageData {
  if (!existsSync(USAGE_FILE)) return { usedPuzzleIds: [], renders: [] };
  const raw = JSON.parse(readFileSync(USAGE_FILE, 'utf-8'));
  return { usedPuzzleIds: raw.usedPuzzleIds ?? [], renders: raw.renders ?? [] };
}

export function saveUsage(usage: UsageData): void {
  writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
}

const sidecarPath = (mp4: string) => mp4.replace(/\.mp4$/, '.json');
const captionPath = (mp4: string) => mp4.replace(/\.mp4$/, '.txt');

/** Write the per-reel metadata sidecar. Called by the renderer. */
export function writeSidecar(mp4: string, meta: ReelMeta): void {
  writeFileSync(sidecarPath(mp4), JSON.stringify(meta, null, 2));
}

/**
 * Every daily reel across every date folder — NOT one-per-folder.
 * `difficult` comes from the sidecar; legacy renders fall back to the ledger,
 * then to caption text (in that order of trust).
 */
export function discoverReels(): DiscoveredReel[] {
  if (!existsSync(VIDEOS_DIR)) return [];

  const ledgerDifficult: Record<string, boolean> = {};
  for (const r of loadUsage().renders) {
    if (r.puzzleId) ledgerDifficult[r.puzzleId] = !!r.difficult;
  }

  const reels: DiscoveredReel[] = [];
  for (const entry of readdirSync(VIDEOS_DIR)) {
    const dir = join(VIDEOS_DIR, entry);
    if (!statSync(dir).isDirectory()) continue;
    const files = readdirSync(dir);

    for (const name of files.filter(f => f.startsWith('daily.') && f.endsWith('.mp4'))) {
      const mp4 = join(dir, name);
      const puzzleId = name.replace(/\.mp4$/, '').split('-').pop()!;
      const caption = existsSync(captionPath(mp4))
        ? readFileSync(captionPath(mp4), 'utf-8')
        : '';

      const hasSidecar = existsSync(sidecarPath(mp4));
      const side: Partial<ReelMeta> = hasSidecar
        ? JSON.parse(readFileSync(sidecarPath(mp4), 'utf-8'))
        : {};

      const difficult = hasSidecar
        ? !!side.difficult
        : ledgerDifficult[puzzleId] ?? /difficult puzzle/i.test(caption);

      reels.push({
        puzzleId,
        date: entry,
        difficult,
        rating: side.rating,
        theme: side.theme,
        quip: side.quip,
        renderedAt: side.renderedAt,
        mp4,
        caption,
        hasSidecar,
      });
    }
  }
  return reels;
}

/**
 * Every puzzle id we must never render again: everything on disk UNION the
 * ledger. Pass extra ids (e.g. from the Blob queue) to widen it further.
 */
export function usedPuzzleIds(extra: Iterable<string> = []): Set<string> {
  const used = new Set<string>(loadUsage().usedPuzzleIds);
  for (const r of discoverReels()) used.add(r.puzzleId);
  for (const id of extra) used.add(id);
  return used;
}
