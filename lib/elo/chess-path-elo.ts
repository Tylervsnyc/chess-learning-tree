/**
 * lib/elo/chess-path-elo.ts
 *
 * "Chess Path ELO" — display helpers for the rating estimate.
 *
 * One source of truth (CHE-385): the rating IS the honest estimate from
 * lib/elo/estimate.ts — the same number everywhere (popup headline = profile
 * headline). Graphs plot the real curve, dips included; encouragement lives in
 * the copy (a down day simply doesn't show a "+N" badge), never in the math.
 * The old "running maximum, only ever goes up" transform is gone — it made the
 * popup disagree with the profile and rendered flat lines on plateaus.
 *
 * What this module adds is shape, not value: it fills *every calendar day*
 * (carry-forward on idle days) so the completion-screen graph shows a
 * continuous "days of effort" line with one tick per day — and marks which
 * days the user was actually active.
 *
 * Pure functions, no React/DOM — safe in a server route or a node script.
 */

import { estimateEloPerEvent, type EloEvent } from './estimate';

export interface EloSeriesPoint {
  date: string; // YYYY-MM-DD (UTC)
  elo: number;
}

export interface ChessPathPoint {
  date: string; // YYYY-MM-DD (UTC)
  elo: number; // honest end-of-day estimate (carried forward on idle days)
  active: boolean; // did the user do something this day?
}

function addDaysUTC(dateStr: string, n: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Build the Chess Path ELO line: the honest estimate as an every-calendar-day
 * series ending today. By default it spans the user's whole journey (so the
 * graph always shows the real climb arc, never an artificially flat window);
 * pass `windowDays` to clip to the last N calendar days.
 */
export function chessPathEloSeries(
  estimate: EloSeriesPoint[],
  opts: { windowDays?: number; today?: string } = {},
): ChessPathPoint[] {
  const today = opts.today ?? todayUTC();

  if (estimate.length === 0) return [];

  const sorted = [...estimate].sort((a, b) => a.date.localeCompare(b.date));
  const eloByDate = new Map<string, number>();
  for (const p of sorted) eloByDate.set(p.date, p.elo);

  // Window: whole journey by default, or the last `windowDays` calendar days
  // ending today (but never before the first day we have any data for).
  const firstDay = sorted[0].date;
  let start = firstDay;
  if (opts.windowDays) {
    const winStart = addDaysUTC(today, -(opts.windowDays - 1));
    if (winStart > start) start = winStart;
  }

  // Walk every calendar day, carrying the last known value forward on idle days.
  // Seed `carried` with the value as of the day *before* the window.
  let carried = sorted[0].elo;
  for (const p of sorted) {
    if (p.date < start) carried = p.elo;
    else break;
  }

  const points: ChessPathPoint[] = [];
  for (let day = start; day <= today; day = addDaysUTC(day, 1)) {
    const dayElo = eloByDate.get(day);
    if (dayElo !== undefined) carried = dayElo;
    points.push({ date: day, elo: carried, active: dayElo !== undefined });
  }

  return points;
}

// ── Within-session line (logged-out signup teaser) ──────────────────────────

export interface SessionAttempt {
  /** Puzzle rating if known; lesson puzzles often have none. */
  rating?: number;
  correct: boolean;
  /** epoch ms */
  timestamp: number;
}

// Lesson puzzles frequently carry no rating — treat them as a beginner opponent
// so a solved one still nudges the rating up.
const SESSION_DEFAULT_OPPONENT = 450;

/**
 * Build a per-attempt line for the current session — "you're getting better
 * right now." Index 0 is the baseline; each rated attempt moves the honest
 * estimate (a miss can dip it — the "+N this session" badge hides when ≤ 0).
 */
export function chessPathSessionSeries(attempts: SessionAttempt[]): ChessPathPoint[] {
  if (attempts.length === 0) return [];
  const sorted = [...attempts].sort((a, b) => a.timestamp - b.timestamp);
  const events: EloEvent[] = sorted.map((a) => ({
    at: new Date(a.timestamp).toISOString(),
    kind: 'puzzle',
    opponent: typeof a.rating === 'number' && a.rating > 0 ? a.rating : SESSION_DEFAULT_OPPONENT,
    score: a.correct ? 1 : 0,
  }));
  const ratings = estimateEloPerEvent(events); // length = attempts + 1 (incl. baseline)
  return ratings.map((r, i) => ({ date: `s${i}`, elo: r, active: i > 0 }));
}

/** Friendly tier label for a rating (our own encouraging scale). */
export function chessPathTier(elo: number): string {
  const bands = [
    { min: 0, label: 'Just Starting' },
    { min: 400, label: 'Finding It' },
    { min: 800, label: 'Climbing' },
    { min: 1200, label: 'Sharp' },
    { min: 1600, label: 'Dangerous' },
  ];
  return [...bands].reverse().find((b) => elo >= b.min)?.label ?? 'Just Starting';
}

/**
 * Aspirational projection for a new user: "if you keep doing a lesson a day,
 * here's where you head." Decelerating daily gains, `days` points starting at
 * the current rating. Clearly a projection (shown dotted) — not a promise.
 */
export function projectChessPathElo(current: number, days = 5): number[] {
  const out = [Math.round(current)];
  let gain = 26;
  for (let i = 1; i < days; i++) {
    out.push(out[i - 1] + Math.round(gain));
    gain *= 0.86;
  }
  return out;
}

/**
 * Session headline: current rating + net change across the session.
 * `gained` is the REAL delta (can be negative) — display gates on > 0.
 */
export function chessPathSession(points: ChessPathPoint[]): { current: number; gained: number } {
  if (points.length === 0) return { current: 0, gained: 0 };
  const current = points[points.length - 1].elo;
  const start = points[0].elo;
  return { current, gained: current - start };
}

/**
 * Today's headline numbers for the completion popup.
 * `gainedToday` is the REAL delta vs yesterday (can be negative) — display
 * gates on > 0 so a down day just shows no badge.
 */
export function chessPathToday(points: ChessPathPoint[]): {
  current: number;
  previous: number;
  gainedToday: number;
} {
  if (points.length === 0) return { current: 0, previous: 0, gainedToday: 0 };
  const current = points[points.length - 1].elo;
  const previous = points.length > 1 ? points[points.length - 2].elo : current;
  return { current, previous, gainedToday: current - previous };
}
