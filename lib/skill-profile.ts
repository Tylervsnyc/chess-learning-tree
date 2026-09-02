/**
 * Skill profile — layer 1 of "learn from your mistakes" (Chess Boxing).
 *
 * Every puzzle a user answers in a workout carries Lichess theme tags
 * (fork, pin, backRankMate, ...) and a rating. We fold each result into one
 * row per (user, theme) in `user_skill`. Weekly report + targeted training
 * (layers 2/3) only READ this table.
 *
 * Gated by FEATURE_FLAGS.SKILL_PROFILE. Requires migration
 * supabase/migrations/2026-08-24-user-skill.sql.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

export interface PuzzleResult {
  puzzleId?: string;
  themes?: string[];
  rating?: number;
  correct: boolean;
  /** Time from puzzle shown to answer, ms (client-measured). */
  timeMs?: number;
  /** Start position (before the setup move) — only used to picture a solve. */
  fen?: string;
  /** Solution line, UCI, moves[0] = opponent's setup move. */
  moves?: string[];
}

// Lichess meta-tags that say nothing about a skill.
const IGNORED_THEMES = new Set([
  'short', 'long', 'veryLong', 'oneMove', 'master', 'masterVsMaster', 'superGM',
  'crushing', 'advantage', 'equality', 'mate', 'opening', 'middlegame', 'endgame',
]);

const MAX_RESULTS = 200;
const MAX_TIME_MS = 5 * 60 * 1000;

/** Minimum attempts before a theme counts as a real signal (not noise). */
export const MIN_ATTEMPTS_FOR_SIGNAL = 12;

interface ThemeAgg {
  attempts: number;
  correct: number;
  missRatingSum: number;
  solveRatingSum: number;
  solveTimeMs: number;
}

/** Fold raw results into per-theme totals. Pure; exported for tests. */
export function aggregateByTheme(results: PuzzleResult[]): Map<string, ThemeAgg> {
  const out = new Map<string, ThemeAgg>();
  for (const r of results.slice(0, MAX_RESULTS)) {
    const rating = Number.isFinite(r.rating) ? Math.max(0, Math.trunc(r.rating!)) : 0;
    const time = Number.isFinite(r.timeMs) ? Math.min(MAX_TIME_MS, Math.max(0, Math.trunc(r.timeMs!))) : 0;
    const themes = Array.isArray(r.themes) ? r.themes : [];
    for (const t of themes) {
      if (typeof t !== 'string' || !t || IGNORED_THEMES.has(t)) continue;
      const a = out.get(t) ?? { attempts: 0, correct: 0, missRatingSum: 0, solveRatingSum: 0, solveTimeMs: 0 };
      a.attempts += 1;
      if (r.correct) {
        a.correct += 1;
        a.solveRatingSum += rating;
        a.solveTimeMs += time;
      } else {
        a.missRatingSum += rating;
      }
      out.set(t, a);
    }
  }
  return out;
}

/** Parse the untrusted `puzzleResults` field from the finish payload. */
export function parsePuzzleResults(raw: unknown): PuzzleResult[] {
  if (!Array.isArray(raw)) return [];
  const out: PuzzleResult[] = [];
  for (const item of raw.slice(0, MAX_RESULTS)) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    if (typeof o.correct !== 'boolean') continue;
    out.push({
      puzzleId: typeof o.puzzleId === 'string' ? o.puzzleId : undefined,
      themes: Array.isArray(o.themes) ? o.themes.filter((t): t is string => typeof t === 'string') : [],
      rating: typeof o.rating === 'number' ? o.rating : undefined,
      correct: o.correct,
      timeMs: typeof o.timeMs === 'number' ? o.timeMs : undefined,
      fen: typeof o.fen === 'string' && o.fen.length > 0 && o.fen.length <= 100 ? o.fen : undefined,
      moves: Array.isArray(o.moves)
        ? o.moves.filter((m): m is string => typeof m === 'string' && m.length <= 8).slice(0, 40)
        : undefined,
    });
  }
  return out;
}

/**
 * Write a session's results into user_skill. Service-role client required
 * (table has no user write policy). Never throws — a skill write must not
 * fail a workout finish.
 */
export async function recordSkillResults(
  service: SupabaseClient,
  userId: string,
  results: PuzzleResult[],
): Promise<void> {
  const agg = aggregateByTheme(results);
  if (agg.size === 0) return;
  await Promise.all(
    Array.from(agg.entries()).map(async ([theme, a]) => {
      const { error } = await service.rpc('bump_user_skill', {
        p_user_id: userId,
        p_theme: theme,
        p_attempts: a.attempts,
        p_correct: a.correct,
        p_miss_rating_sum: a.missRatingSum,
        p_solve_rating_sum: a.solveRatingSum,
        p_solve_time_ms: a.solveTimeMs,
      });
      if (error) console.error('user_skill bump failed', theme, error.message);
    }),
  );
}

export interface SkillRow {
  theme: string;
  attempts: number;
  correct: number;
  miss_rating_sum: number;
  solve_rating_sum: number;
  solve_time_ms: number;
  last_seen: string;
}

export interface ThemeSkill {
  theme: string;
  attempts: number;
  accuracy: number; // 0..1
  avgMissRating: number | null;
  avgSolveTimeSec: number | null;
  /** Higher = bigger blind spot. 0 when below MIN_ATTEMPTS_FOR_SIGNAL. */
  weakness: number;
}

/**
 * Read + score a user's profile. Weakness = miss rate, boosted when the
 * misses were EASY relative to the user's overall solve level (missing a
 * 900 fork when you solve 1300s is a real blind spot; missing 1600s isn't).
 */
export async function getSkillProfile(
  client: SupabaseClient,
  userId: string,
): Promise<{ themes: ThemeSkill[]; weakest: ThemeSkill[]; strongest: ThemeSkill[]; userLevel: number | null }> {
  const { data, error } = await client
    .from('user_skill')
    .select('theme, attempts, correct, miss_rating_sum, solve_rating_sum, solve_time_ms, last_seen')
    .eq('user_id', userId);
  if (error || !data) return { themes: [], weakest: [], strongest: [], userLevel: null };
  const rows = data as SkillRow[];

  const totalCorrect = rows.reduce((s, r) => s + r.correct, 0);
  const totalSolveRating = rows.reduce((s, r) => s + Number(r.solve_rating_sum), 0);
  const userLevel = totalCorrect > 0 ? totalSolveRating / totalCorrect : 1000;

  const themes = rows.map<ThemeSkill>((r) => {
    const misses = r.attempts - r.correct;
    const accuracy = r.attempts > 0 ? r.correct / r.attempts : 0;
    const avgMissRating = misses > 0 ? Number(r.miss_rating_sum) / misses : null;
    const avgSolveTimeSec = r.correct > 0 ? Number(r.solve_time_ms) / r.correct / 1000 : null;
    let weakness = 0;
    if (r.attempts >= MIN_ATTEMPTS_FOR_SIGNAL && misses > 0) {
      const missRate = 1 - accuracy;
      // 1.0 at user level, up to ~2.0 when misses are 400 below it, floor 0.5.
      const easeBoost = avgMissRating == null ? 1 : Math.min(2, Math.max(0.5, 1 + (userLevel - avgMissRating) / 400));
      weakness = Math.round(missRate * easeBoost * 100) / 100;
    }
    return { theme: r.theme, attempts: r.attempts, accuracy, avgMissRating, avgSolveTimeSec, weakness };
  });

  const signal = themes.filter((t) => t.attempts >= MIN_ATTEMPTS_FOR_SIGNAL);
  const weakest = [...signal].sort((a, b) => b.weakness - a.weakness).filter((t) => t.weakness > 0).slice(0, 3);
  const strongest = [...signal].sort((a, b) => b.accuracy - a.accuracy).slice(0, 3);
  // userLevel = avg rating of solved puzzles; null when nothing solved yet.
  return { themes, weakest, strongest, userLevel: totalCorrect > 0 ? Math.round(userLevel) : null };
}
