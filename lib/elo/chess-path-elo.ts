/**
 * lib/elo/chess-path-elo.ts
 *
 * "Chess Path ELO" — the user-facing, *encouraging* scoreboard.
 *
 * It is derived from the honest rating estimate (lib/elo/estimate.ts) but with
 * one deliberate brand rule: **it only ever goes up or holds, never down.**
 * The honest estimate can dip on a bad day; Chess Path ELO is a running maximum,
 * so a day where you didn't gain simply holds flat. We never punish showing up.
 *
 * It also fills *every calendar day* in the window (carry-forward on idle days)
 * so the completion-screen graph shows a continuous "days of effort" line with
 * one tick per day — and marks which days the user was actually active.
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
  elo: number; // monotonic, non-decreasing
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
 * Build the Chess Path ELO line: a monotonic, every-calendar-day series ending
 * today. `windowDays` controls how many days of history to show (default 14).
 */
export function chessPathEloSeries(
  estimate: EloSeriesPoint[],
  opts: { windowDays?: number; today?: string } = {},
): ChessPathPoint[] {
  const windowDays = opts.windowDays ?? 14;
  const today = opts.today ?? todayUTC();

  if (estimate.length === 0) return [];

  // Running maximum per active day + the set of active days.
  const sorted = [...estimate].sort((a, b) => a.date.localeCompare(b.date));
  const runningByDate = new Map<string, number>();
  const activeDays = new Set<string>();
  let running = sorted[0].elo;
  for (const p of sorted) {
    running = Math.max(running, p.elo);
    runningByDate.set(p.date, running);
    activeDays.add(p.date);
  }

  // Window: last `windowDays` calendar days ending today (but never before the
  // first day we have any data for).
  const firstDay = sorted[0].date;
  let start = addDaysUTC(today, -(windowDays - 1));
  if (start < firstDay) start = firstDay;

  // Walk every calendar day, carrying the last known value forward on idle days.
  const points: ChessPathPoint[] = [];
  let carried = runningByDate.get(firstDay) ?? sorted[0].elo;
  // Seed `carried` with the running value as of the day *before* the window.
  for (const p of sorted) {
    if (p.date < start) carried = runningByDate.get(p.date)!;
    else break;
  }

  for (let day = start; day <= today; day = addDaysUTC(day, 1)) {
    if (runningByDate.has(day)) carried = runningByDate.get(day)!;
    points.push({ date: day, elo: carried, active: activeDays.has(day) });
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
 * Build a per-attempt, monotonic line for the current session — "you're getting
 * better right now." Index 0 is the baseline; each solved puzzle steps it up.
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
  let run = ratings[0];
  return ratings.map((r, i) => {
    run = Math.max(run, r);
    return { date: `s${i}`, elo: run, active: i > 0 };
  });
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

/** Session headline: current rating + total gained across the session. */
export function chessPathSession(points: ChessPathPoint[]): { current: number; gained: number } {
  if (points.length === 0) return { current: 0, gained: 0 };
  const current = points[points.length - 1].elo;
  const start = points[0].elo;
  return { current, gained: Math.max(0, current - start) };
}

/** Today's headline numbers for the completion popup. */
export function chessPathToday(points: ChessPathPoint[]): {
  current: number;
  previous: number;
  gainedToday: number;
} {
  if (points.length === 0) return { current: 0, previous: 0, gainedToday: 0 };
  const current = points[points.length - 1].elo;
  const previous = points.length > 1 ? points[points.length - 2].elo : current;
  return { current, previous, gainedToday: Math.max(0, current - previous) };
}
