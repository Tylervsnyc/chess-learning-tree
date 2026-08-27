/**
 * Client-side reader for the on-device puzzle pack.
 *
 * The server equivalent is lib/puzzle-file-loader.ts, which readFileSync's
 * data/clean-puzzles-v2. There is no filesystem in a webview, so the pack ships
 * as static files under /puzzle-pack/ and we fetch them — off the device's own
 * disk inside the app, so it costs no network and effectively no time.
 *
 * Same shape, same cache-by-(level,theme) behaviour, so lib/puzzle-selector.ts
 * can consume the result unchanged.
 *
 * Built by scripts/build-puzzle-pack.mjs; copied into the bundle by
 * scripts/build-offline.mjs.
 */
import type { Puzzle } from '@/lib/puzzle-selector';

interface PackPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  popularity: number;
  nbPlays: number;
  theme: string;
  allThemes: string[];
}

const fileCache = new Map<string, Promise<Puzzle[]>>();
let themeIndex: Promise<Record<string, string[]>> | null = null;

/** Matches transformToPuzzle() in app/api/puzzles/lesson/route.ts. */
function toPuzzle(p: PackPuzzle): Puzzle {
  return {
    id: p.puzzleId,
    fen: p.fen,
    moves: p.moves.split(' '),
    rating: p.rating,
    popularity: p.popularity,
    plays: p.nbPlays,
    theme: p.theme,
    themes: p.allThemes,
    url: `https://lichess.org/training/${p.puzzleId}`,
  };
}

/**
 * Puzzles for one level+theme, or [] if that combination isn't in the pack.
 *
 * A miss is not an error: the pack covers 310 level-theme combinations and a
 * lesson asking for one outside that set should fall through to its other
 * themes, exactly as the server route does with a null file.
 */
export function loadPackFile(level: number, theme: string): Promise<Puzzle[]> {
  const key = `level${level}-${theme}`;
  let hit = fileCache.get(key);
  if (hit) return hit;

  hit = fetch(`/puzzle-pack/${key}.json`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => (data?.puzzles ? (data.puzzles as PackPuzzle[]).map(toPuzzle) : []))
    .catch(() => []);

  fileCache.set(key, hit);
  return hit;
}

/** Mirrors listAvailableThemes() — the client can't readdir, so the pack ships an index. */
export async function listPackThemes(level: number): Promise<string[]> {
  themeIndex ??= fetch('/puzzle-pack/index.json')
    .then((res) => (res.ok ? res.json() : {}))
    .catch(() => ({}));
  return (await themeIndex)[String(level)] ?? [];
}
