/**
 * Where a level-unlock test's 10 puzzles come from.
 *
 * On the web that's GET /api/level-test, which also reads the user's past
 * attempts from Supabase so it can hand out the least-recently-used variant.
 * Offline there's neither a server nor a query, so variant rotation falls back
 * to a counter in localStorage: same goal (don't show the same test twice in a
 * row), no network. The server remains the source of truth whenever it's
 * reachable — this only decides which variant to *show*, never whether the
 * level unlocks.
 */
import { IS_OFFLINE_APP } from '@/lib/config/offline';
import { getLevelTestConfig, LEVEL_TEST_CONFIG } from '@/data/level-unlock-tests';
import { loadPackFile } from './pack-client';

const VARIANT_KEY = 'cp:level-test-variant';

export interface LevelTestPayload {
  transition: string;
  variantId: string;
  config: typeof LEVEL_TEST_CONFIG;
  targetLevel: { number: number; key: string; name: string };
  puzzles: Array<{ id: string; fen: string; moves: string[]; rating: number; theme: string }>;
}

/** Round-robin through the variants so a retry isn't the identical test. */
function nextVariantIndex(transition: string, count: number): number {
  try {
    const raw = localStorage.getItem(VARIANT_KEY);
    const seen: Record<string, number> = raw ? JSON.parse(raw) : {};
    const next = ((seen[transition] ?? -1) + 1) % count;
    seen[transition] = next;
    localStorage.setItem(VARIANT_KEY, JSON.stringify(seen));
    return next;
  } catch {
    return 0;
  }
}

async function buildOnDevice(transition: string): Promise<LevelTestPayload | null> {
  const testConfig = getLevelTestConfig(transition);
  if (!testConfig) return null;

  const variant = testConfig.variants[nextVariantIndex(transition, testConfig.variants.length)];
  const perTheme = Math.ceil(LEVEL_TEST_CONFIG.puzzleCount / variant.themes.length);

  const files = await Promise.all(variant.themes.map((t) => loadPackFile(testConfig.toLevel, t)));

  const collected = files.flatMap((puzzles) =>
    puzzles
      .filter((p) => p.rating >= testConfig.ratingMin && p.rating <= testConfig.ratingMax)
      .sort(() => Math.random() - 0.5)
      .slice(0, perTheme)
      .map((p) => ({ id: p.id, fen: p.fen, moves: p.moves, rating: p.rating, theme: p.theme }))
  );

  return {
    transition,
    variantId: variant.id,
    config: LEVEL_TEST_CONFIG,
    targetLevel: { number: testConfig.toLevel, key: testConfig.levelKey, name: testConfig.levelName },
    puzzles: collected.sort(() => Math.random() - 0.5).slice(0, LEVEL_TEST_CONFIG.puzzleCount),
  };
}

export async function fetchLevelTest(transition: string): Promise<LevelTestPayload | null> {
  if (IS_OFFLINE_APP) return buildOnDevice(transition);

  const res = await fetch(`/api/level-test?transition=${transition}`);
  if (!res.ok) throw new Error('Failed to fetch test puzzles');
  return res.json();
}
