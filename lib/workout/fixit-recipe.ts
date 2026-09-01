/**
 * Fix-It recipe — layer 3 of "learn from your mistakes" (Chess Boxing).
 *
 * Turns a user's skill profile (`lib/skill-profile.ts`) + the puzzles they
 * missed in their last workout into a 10-puzzle remedial set:
 *
 *   warm-up (2)  → forcing-move discipline (short mates)
 *   core (3)     → weakest theme, LONG lines (the "stopped calculating" habit)
 *   bridge (2)   → the themes from the last workout's misses
 *   consolidate (2) → quiet / defensive moves (finish the combination)
 *   closer (1)   → weakest theme at the top of the band
 *
 * Pure planning in `buildFixitRecipe`; `fillFixitRecipe` draws puzzles from
 * data/clean-puzzles-v2 via `lib/puzzle-file-loader.ts`. Used by the report
 * script and by /api/workout/fixit.
 */
import { loadPuzzleFile, type CleanPuzzle } from '@/lib/puzzle-file-loader';
import type { ThemeSkill } from '@/lib/skill-profile';

export const FIXIT_SIZE = 10;

/** Lichess meta-tags — never a training target. */
const META = new Set([
  'short', 'long', 'veryLong', 'oneMove', 'master', 'masterVsMaster', 'superGM',
  'crushing', 'advantage', 'equality', 'mate', 'opening', 'middlegame', 'endgame',
]);

/** Themes that exist as clean-puzzles-v2 files (the loader needs a file per theme). */
const FILE_THEMES = new Set([
  'advancedPawn', 'arabianMate', 'attraction', 'backRankMate', 'bishopEndgame', 'clearance',
  'defensiveMove', 'deflection', 'discoveredAttack', 'doubleBishopMate', 'doubleCheck',
  'dovetailMate', 'exposedKing', 'fork', 'hangingPiece', 'hookMate', 'interference',
  'intermezzo', 'kingsideAttack', 'knightEndgame', 'mateIn1', 'mateIn2', 'mateIn3', 'mateIn4',
  'mateIn5', 'pawnEndgame', 'pin', 'promotion', 'queenEndgame', 'queensideAttack', 'quietMove',
  'rookEndgame', 'sacrifice', 'skewer', 'smotheredMate', 'trappedPiece', 'underPromotion',
  'xRayAttack', 'zugzwang',
]);

export interface FixitSlot {
  /** Short, plain-words reason shown in the UI ("Forks that finish"). */
  label: string;
  /** File theme to draw from (must be in FILE_THEMES). */
  theme: string;
  /** Extra tags the puzzle must ALSO carry (e.g. 'long'). Empty = any. */
  requireAny?: string[];
  minRating: number;
  maxRating: number;
  count: number;
}

export interface FixitInput {
  /** From getSkillProfile(); may be empty for a new user. */
  weakest: ThemeSkill[];
  /** Last workout's missed puzzles (themes optional — older rows lack them). */
  lastMisses: { themes?: string[]; rating?: number }[];
  /** Rating the user reliably solves at. Falls back to the misses' median. */
  userLevel?: number;
}

const DEFAULT_LEVEL = 1400;

function median(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function trainable(theme: string): boolean {
  return FILE_THEMES.has(theme) && !META.has(theme);
}

/** Count non-meta themes across the last misses, most frequent first. */
function missThemes(misses: FixitInput['lastMisses']): string[] {
  const counts = new Map<string, number>();
  for (const m of misses) for (const t of m.themes ?? []) {
    if (trainable(t)) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

/** Build the 10-slot plan. Pure. */
export function buildFixitRecipe(input: FixitInput): FixitSlot[] {
  // The adaptive workout ramps from ~800 up, so the average SOLVED rating
  // understates the user; the misses show the ceiling. Train just under it.
  const missMedian = median(input.lastMisses.map((m) => m.rating ?? 0).filter((r) => r > 0));
  const level = Math.max(
    input.userLevel ?? 0,
    missMedian != null ? missMedian - 200 : 0,
  ) || DEFAULT_LEVEL;

  const weak = input.weakest.map((w) => w.theme).filter(trainable);
  const fromMisses = missThemes(input.lastMisses);
  // Ordered pool of target themes: skill-profile weaknesses first (they have
  // sample size), then whatever the last workout exposed, then a safe default.
  const targets = Array.from(new Set([...weak, ...fromMisses, 'fork', 'pin', 'skewer']));
  const core = targets[0];
  const bridge = targets.find((t) => t !== core && t !== 'defensiveMove') ?? 'pin';
  const closer = targets.find((t) => t !== core && t !== bridge) ?? 'skewer';

  const clamp = (r: number) => Math.max(600, Math.min(2300, Math.round(r / 50) * 50));

  return [
    {
      label: 'Warm-up: find the forcing move',
      theme: 'mateIn2',
      requireAny: ['short'],
      minRating: clamp(level - 250),
      maxRating: clamp(level - 50),
      count: 2,
    },
    {
      label: `${pretty(core)} that finish the job`,
      theme: core,
      requireAny: ['long', 'veryLong'],
      minRating: clamp(level - 100),
      maxRating: clamp(level + 150),
      count: 3,
    },
    {
      label: `${pretty(bridge)} from your last workout`,
      theme: bridge,
      minRating: clamp(level - 50),
      maxRating: clamp(level + 200),
      count: 2,
    },
    {
      label: 'Keep what you won: the quiet move',
      theme: 'defensiveMove',
      minRating: clamp(level - 150),
      maxRating: clamp(level + 100),
      count: 2,
    },
    {
      label: `Closer: ${pretty(closer)}, full length`,
      theme: closer,
      requireAny: ['long', 'veryLong'],
      minRating: clamp(level + 50),
      maxRating: clamp(level + 250),
      count: 1,
    },
  ];
}

/** Human label for a Lichess theme tag ("discoveredAttack" → "Discovered attacks"). */
export function pretty(theme: string): string {
  const words = theme.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
  const cap = words.charAt(0).toUpperCase() + words.slice(1);
  return /mate|move/.test(words) ? cap : `${cap}s`;
}

/** clean-puzzles-v2 level for a rating (1: 400-800, 2: 800-1000, then 200/step). */
export function levelForRating(rating: number): number {
  if (rating < 800) return 1;
  if (rating < 1000) return 2;
  return Math.min(8, Math.floor((rating - 1000) / 200) + 3);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface FixitPick extends CleanPuzzle {
  slotLabel: string;
}

/**
 * Draw puzzles for each slot from the level files. Skips ids in `exclude`
 * (seen history + the misses themselves). Relaxes the tag/rating constraint
 * before leaving a slot short, so the set is always FIXIT_SIZE when the
 * theme file exists at all.
 */
export function fillFixitRecipe(slots: FixitSlot[], exclude: Set<string>): FixitPick[] {
  const out: FixitPick[] = [];
  const taken = new Set<string>(exclude);

  for (const slot of slots) {
    const levels = new Set<number>();
    for (let r = slot.minRating; r <= slot.maxRating; r += 100) levels.add(levelForRating(r));
    levels.add(levelForRating(slot.maxRating));

    const pool: CleanPuzzle[] = [];
    for (const lvl of levels) {
      const file = loadPuzzleFile(lvl, slot.theme);
      if (file) pool.push(...file.puzzles);
    }
    const fresh = pool.filter((p) => !taken.has(p.puzzleId) && p.popularity >= 80);

    const strict = fresh.filter(
      (p) =>
        p.rating >= slot.minRating &&
        p.rating <= slot.maxRating &&
        (!slot.requireAny || slot.requireAny.some((t) => p.allThemes.includes(t))),
    );
    const relaxed = fresh.filter((p) => p.rating >= slot.minRating - 100 && p.rating <= slot.maxRating + 100);

    const picks: CleanPuzzle[] = [];
    for (const cand of [...shuffle(strict), ...shuffle(relaxed)]) {
      if (picks.length >= slot.count) break;
      if (taken.has(cand.puzzleId)) continue;
      taken.add(cand.puzzleId);
      picks.push(cand);
    }
    out.push(...picks.map((p) => ({ ...p, slotLabel: slot.label })));
  }
  return out.slice(0, FIXIT_SIZE);
}
