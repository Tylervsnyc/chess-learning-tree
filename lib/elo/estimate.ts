/**
 * lib/elo/estimate.ts
 *
 * Estimates a user's chess rating from their real history and produces a
 * rating-over-time series for the profile graph.
 *
 * We don't store a user ELO anywhere (see RULES.md §20 — user ELO was
 * deliberately removed). Instead we *derive* an estimate by replaying every
 * puzzle attempt and Rookie game in chronological order through a standard
 * Elo update:
 *
 *   - A puzzle attempt is a "game" vs an opponent rated at the puzzle's
 *     difficulty. Correct = win, incorrect = loss.
 *   - A Rookie game is a game vs an opponent at Rookie's level ELO
 *     (Lv1=200 … Lv10=2000). Win = 1, draw = 0.5, loss = 0.
 *
 * Everyone starts at a beginner BASELINE. The rating moves quickly while the
 * sample is small (provisional K) and settles as more events accrue. Because
 * Elo is self-correcting (a strong player gains almost nothing from an easy
 * puzzle), the estimate converges rather than drifting.
 *
 * This is intentionally an *estimate*, surfaced as a Beta number — not a
 * rating system of record.
 */

export const ELO_BASELINE = 600;
const ELO_FLOOR = 100;
const ELO_CEIL = 2800;

// Base K-factors. Games count for more than a single puzzle.
const K_PUZZLE = 16;
const K_GAME = 32;

// Provisional period: the first PROVISIONAL_EVENTS updates are amplified so a
// new user's estimate finds its level fast, then relaxes to the base K.
const PROVISIONAL_EVENTS = 25;
const PROVISIONAL_MULT = 2.5;

export type EloEventKind = 'puzzle' | 'game';

export interface EloEvent {
  /** ISO timestamp */
  at: string;
  kind: EloEventKind;
  /** Opponent rating: the puzzle's difficulty, or Rookie's level ELO. */
  opponent: number;
  /** Result from the user's perspective: 1 win, 0.5 draw, 0 loss. */
  score: number;
}

export interface EloSeriesPoint {
  /** YYYY-MM-DD (UTC) */
  date: string;
  elo: number;
}

export interface EloEstimate {
  current: number;
  /** Number of history events that fed the estimate. */
  events: number;
  /** Daily rating curve, oldest → newest, including the baseline start. */
  series: EloSeriesPoint[];
}

function expectedScore(rating: number, opponent: number): number {
  return 1 / (1 + Math.pow(10, (opponent - rating) / 400));
}

function clamp(r: number): number {
  return Math.max(ELO_FLOOR, Math.min(ELO_CEIL, r));
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * Replay events into a current rating + daily series.
 * Events may be unsorted; they are sorted by timestamp here.
 */
export function estimateElo(events: EloEvent[]): EloEstimate {
  const sorted = [...events]
    .filter((e) => Number.isFinite(e.opponent) && e.opponent > 0 && Number.isFinite(e.score))
    .sort((a, b) => a.at.localeCompare(b.at));

  let rating = ELO_BASELINE;

  if (sorted.length === 0) {
    return { current: ELO_BASELINE, events: 0, series: [] };
  }

  // Daily series: keep the rating as of the END of each calendar day.
  const byDay = new Map<string, number>();
  // Seed the curve with the baseline on the day before the first event so the
  // graph starts from a meaningful origin.
  const firstDay = dayKey(sorted[0].at);
  byDay.set(firstDay, ELO_BASELINE);

  sorted.forEach((e, i) => {
    const base = e.kind === 'game' ? K_GAME : K_PUZZLE;
    const provisional =
      i < PROVISIONAL_EVENTS
        ? 1 + (PROVISIONAL_MULT - 1) * (1 - i / PROVISIONAL_EVENTS)
        : 1;
    const k = base * provisional;
    rating = clamp(rating + k * (e.score - expectedScore(rating, e.opponent)));
    byDay.set(dayKey(e.at), Math.round(rating));
  });

  const series: EloSeriesPoint[] = [...byDay.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, elo]) => ({ date, elo }));

  return { current: Math.round(rating), events: sorted.length, series };
}
