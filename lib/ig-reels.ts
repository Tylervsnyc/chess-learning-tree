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
import { tierOf, type ReelTier } from './ig-difficult-days';

export const VIDEOS_DIR = join(process.cwd(), 'out', 'videos');
export const USAGE_FILE = join(process.cwd(), 'data', 'video-puzzle-usage.json');

/** The curated puzzle pool each tier renders from, and the script that builds it. */
export const TIER_POOLS: Record<ReelTier, { file: string; curate: string }> = {
  normal: {
    file: join(process.cwd(), 'data', 'video-puzzle-pool.json'),
    curate: 'scripts/curate-video-puzzles.ts',
  },
  difficult: {
    file: join(process.cwd(), 'data', 'video-puzzle-pool-hard.json'),
    curate: 'scripts/curate-video-puzzles-hard.ts',
  },
  impossible: {
    file: join(process.cwd(), 'data', 'video-puzzle-pool-impossible.json'),
    curate: 'scripts/curate-video-puzzles-hard.ts --impossible',
  },
};

export interface PoolPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  theme: string;
  allThemes: string[];
  gameUrl?: string;
}

/** Every puzzle across every tier's pool, by id (missing pool files are skipped). */
export function allPoolPuzzles(): Record<string, PoolPuzzle> {
  const out: Record<string, PoolPuzzle> = {};
  for (const { file } of Object.values(TIER_POOLS)) {
    if (!existsSync(file)) continue;
    for (const p of JSON.parse(readFileSync(file, 'utf-8')).puzzles ?? []) out[p.puzzleId] = p;
  }
  return out;
}

export interface ReelMeta {
  puzzleId: string;
  date: string;        // folder / label, "M.D.YY"
  tier: ReelTier;
  /** Legacy (= tier !== 'normal'); old sidecars only have this. */
  difficult: boolean;
  rating?: number;
  theme?: string;
  quip?: string;
  renderedAt?: string;
  /** REEL_FORMAT_VERSION (lib/ig-queue.ts) the reel was rendered in. */
  formatVersion?: number;
}

export interface DiscoveredReel extends ReelMeta {
  mp4: string;
  caption: string;
  hasSidecar: boolean;
}

export interface UsageData {
  usedPuzzleIds: string[];
  renders: { puzzleId: string; date: string; file: string; difficult?: boolean; tier?: ReelTier }[];
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
 * `tier` comes from the sidecar; legacy renders fall back to the ledger,
 * then to caption text (in that order of trust).
 */
export function discoverReels(): DiscoveredReel[] {
  if (!existsSync(VIDEOS_DIR)) return [];

  const ledgerTier: Record<string, ReelTier> = {};
  for (const r of loadUsage().renders) {
    if (r.puzzleId) ledgerTier[r.puzzleId] = tierOf(r);
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

      const tier: ReelTier = hasSidecar
        ? tierOf(side)
        : ledgerTier[puzzleId] ?? (/difficult puzzle/i.test(caption) ? 'difficult' : 'normal');

      reels.push({
        puzzleId,
        date: entry,
        tier,
        difficult: tier !== 'normal',
        rating: side.rating,
        theme: side.theme,
        quip: side.quip,
        renderedAt: side.renderedAt,
        formatVersion: side.formatVersion,
        mp4,
        caption,
        hasSidecar,
      });
    }
  }
  return reels;
}

/**
 * Every puzzle id ever rendered, read from the SIDECARS on disk.
 *
 * Deliberately keyed on the .json sidecar rather than the .mp4: a posted reel's
 * video is safe to delete (it lives on Instagram and in Blob), but the record
 * that we rendered that puzzle must survive, or dedup silently narrows to the
 * ledger — the exact failure that put the same puzzle on the account twice.
 * Sidecars are ~200 bytes, so keeping them forever is free.
 */
export function renderedPuzzleIds(): Set<string> {
  const ids = new Set<string>();
  if (!existsSync(VIDEOS_DIR)) return ids;
  for (const entry of readdirSync(VIDEOS_DIR)) {
    const dir = join(VIDEOS_DIR, entry);
    if (!statSync(dir).isDirectory()) continue;
    for (const name of readdirSync(dir)) {
      if (!name.startsWith('daily.')) continue;
      if (name.endsWith('.json') || name.endsWith('.mp4')) {
        ids.add(name.replace(/\.(json|mp4)$/, '').split('-').pop()!);
      }
    }
  }
  return ids;
}

/**
 * Every puzzle id we must never render again: everything on disk UNION the
 * ledger. Pass extra ids (e.g. from the Blob queue) to widen it further.
 */
export function usedPuzzleIds(extra: Iterable<string> = []): Set<string> {
  const used = new Set<string>(loadUsage().usedPuzzleIds);
  for (const id of renderedPuzzleIds()) used.add(id);
  for (const id of extra) used.add(id);
  return used;
}
