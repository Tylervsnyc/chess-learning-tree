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

const BRACKETS = ['0400-0800', '0800-1200', '1200-1600', '1600-2000', '2000-plus'] as const;
type Bracket = typeof BRACKETS[number];

function bracketFor(rating: number): Bracket {
  if (rating < 800) return '0400-0800';
  if (rating < 1200) return '0800-1200';
  if (rating < 1600) return '1200-1600';
  if (rating < 2000) return '1600-2000';
  return '2000-plus';
}

// Read one theme+bracket CSV. Returns all rows parsed.
const cache = new Map<string, BoxingPuzzle[]>();
function loadThemeBracket(theme: string, bracket: Bracket): BoxingPuzzle[] {
  const key = `${bracket}/${theme}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const filePath = path.join(process.cwd(), 'data', 'puzzles-by-rating', bracket, `${theme}.csv`);
  if (!fs.existsSync(filePath)) {
    cache.set(key, []);
    return [];
  }

  const text = fs.readFileSync(filePath, 'utf-8');
  const lines = text.split('\n').slice(1);
  const puzzles: BoxingPuzzle[] = [];
  for (const line of lines) {
    if (!line) continue;
    const cols = line.split(',');
    if (cols.length < 8) continue;
    puzzles.push({
      puzzleId: cols[0],
      fen: cols[1],
      moves: cols[2].split(' '),
      rating: parseInt(cols[3], 10),
      themes: cols[7].split(' ').filter(Boolean),
    });
  }
  cache.set(key, puzzles);
  return puzzles;
}

// Target rating for puzzle i of N, linear 500 -> 2300.
function targetRating(i: number, total: number): number {
  if (total <= 1) return 1000;
  return Math.round(500 + (i / (total - 1)) * 1800);
}

// Mixed-mode theme rotation: avoids back-to-back repeats.
function pickMixedTheme(index: number, rng: () => number, lastTheme: string | null): string {
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
  pages: number;            // 1-8
  excluded: Set<string>;    // puzzle ids already drawn
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

  for (let i = 0; i < total; i++) {
    const target = targetRating(i, total);
    const bracket = bracketFor(target);

    // In mixed mode, try the rotated theme first, then fall back to any other theme.
    const themesToTry: string[] =
      opts.theme === 'mixed'
        ? (() => {
            const first = pickMixedTheme(i, rng, lastTheme);
            const rest = shuffle(
              BOXING_THEMES.filter((t) => t !== first && t !== lastTheme),
              rng,
            );
            return [first, ...rest];
          })()
        : [opts.theme];

    // Try the exact bracket first, then adjacent brackets as fallback.
    const bracketOrder: Bracket[] = [bracket];
    const idx = BRACKETS.indexOf(bracket);
    if (idx > 0) bracketOrder.push(BRACKETS[idx - 1]);
    if (idx < BRACKETS.length - 1) bracketOrder.push(BRACKETS[idx + 1]);

    let picked: BoxingPuzzle | null = null;
    let pickedTheme: string | null = null;
    const tolerance = 150;

    for (const theme of themesToTry) {
      for (const b of bracketOrder) {
        const pool = loadThemeBracket(theme, b);
        const candidates = pool.filter(
          (p) =>
            !opts.excluded.has(p.puzzleId) &&
            !chosenIds.has(p.puzzleId) &&
            Math.abs(p.rating - target) <= tolerance,
        );
        if (candidates.length > 0) {
          picked = shuffle(candidates, rng)[0];
          pickedTheme = theme;
          break;
        }
      }
      if (picked) break;
    }

    // Last-ditch: any puzzle in the bracket matching any tried theme, ignore tolerance.
    if (!picked) {
      for (const theme of themesToTry) {
        for (const b of bracketOrder) {
          const pool = loadThemeBracket(theme, b);
          const candidates = pool.filter(
            (p) => !opts.excluded.has(p.puzzleId) && !chosenIds.has(p.puzzleId),
          );
          if (candidates.length > 0) {
            picked = shuffle(candidates, rng)[0];
            pickedTheme = theme;
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
