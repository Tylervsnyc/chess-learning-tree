import * as fs from 'fs';
import * as path from 'path';
import { BOXING_THEMES, type BoxingTheme } from './themes';

export interface BoxingPuzzle {
  puzzleId: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
}

// clean-puzzles-v2 level → rating range mapping.
const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
type Level = typeof LEVELS[number];

function levelFor(rating: number): Level {
  if (rating < 800) return 1;
  if (rating < 1000) return 2;
  if (rating < 1200) return 3;
  if (rating < 1400) return 4;
  if (rating < 1600) return 5;
  if (rating < 1800) return 6;
  if (rating < 2000) return 7;
  return 8;
}

interface RawPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  allThemes?: string[];
}

const cache = new Map<string, BoxingPuzzle[]>();
function loadThemeLevel(theme: string, level: Level): BoxingPuzzle[] {
  const key = `${level}/${theme}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const filePath = path.join(
    process.cwd(),
    'data',
    'clean-puzzles-v2',
    `level${level}-${theme}.json`,
  );
  if (!fs.existsSync(filePath)) {
    cache.set(key, []);
    return [];
  }

  try {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as { puzzles: RawPuzzle[] };
    const puzzles: BoxingPuzzle[] = (json.puzzles ?? []).map((p) => ({
      puzzleId: p.puzzleId,
      fen: p.fen,
      moves: p.moves.split(' '),
      rating: p.rating,
      themes: p.allThemes ?? [],
    }));
    cache.set(key, puzzles);
    return puzzles;
  } catch {
    cache.set(key, []);
    return [];
  }
}

// Target rating for puzzle i of N, linear 500 -> 2200.
function targetRating(i: number, total: number): number {
  if (total <= 1) return 1000;
  return Math.round(500 + (i / (total - 1)) * 1700);
}

function pickMixedTheme(rng: () => number, lastTheme: string | null): string {
  const pool = BOXING_THEMES.filter((t) => t !== lastTheme);
  return pool[Math.floor(rng() * pool.length)];
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface SelectOpts {
  theme: BoxingTheme;
  pages: number;
  excluded: Set<string>;
  seed?: number;
}

export function selectBoxingPuzzles(opts: SelectOpts): BoxingPuzzle[] {
  const total = opts.pages * 6;
  const seed = opts.seed ?? Date.now();
  let s = seed;
  const rng = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };

  const out: BoxingPuzzle[] = [];
  const chosenIds = new Set<string>();
  let lastTheme: string | null = null;

  // Adjacent levels to try, in order, for a given target level.
  const levelOrder = (target: Level): Level[] => {
    const order: Level[] = [target];
    for (let d = 1; d < LEVELS.length; d++) {
      if (target - d >= 1) order.push((target - d) as Level);
      if (target + d <= 8) order.push((target + d) as Level);
    }
    return order;
  };

  for (let i = 0; i < total; i++) {
    const target = targetRating(i, total);
    const level = levelFor(target);

    const themesToTry: string[] =
      opts.theme === 'mixed'
        ? (() => {
            const first = pickMixedTheme(rng, lastTheme);
            const rest = shuffle(
              BOXING_THEMES.filter((t) => t !== first && t !== lastTheme),
              rng,
            );
            return [first, ...rest];
          })()
        : [opts.theme];

    const levels = levelOrder(level);

    let picked: BoxingPuzzle | null = null;
    let pickedTheme: string | null = null;

    // Pass 1: prefer puzzles within 150 of target rating, near-level first.
    for (const t of themesToTry) {
      for (const l of levels) {
        const pool = loadThemeLevel(t, l);
        const candidates = pool.filter(
          (p) =>
            !opts.excluded.has(p.puzzleId) &&
            !chosenIds.has(p.puzzleId) &&
            Math.abs(p.rating - target) <= 150,
        );
        if (candidates.length > 0) {
          picked = shuffle(candidates, rng)[0];
          pickedTheme = t;
          break;
        }
      }
      if (picked) break;
    }

    // Pass 2: any unused puzzle from the requested theme(s), any level.
    if (!picked) {
      for (const t of themesToTry) {
        for (const l of levels) {
          const pool = loadThemeLevel(t, l);
          const candidates = pool.filter(
            (p) => !opts.excluded.has(p.puzzleId) && !chosenIds.has(p.puzzleId),
          );
          if (candidates.length > 0) {
            picked = shuffle(candidates, rng)[0];
            pickedTheme = t;
            break;
          }
        }
        if (picked) break;
      }
    }

    if (!picked) {
      throw new Error(
        `Boxing pool exhausted near rating ${target}. Try a different theme or reduce pages.`,
      );
    }

    chosenIds.add(picked.puzzleId);
    out.push(picked);
    lastTheme = pickedTheme;
  }

  return out;
}
