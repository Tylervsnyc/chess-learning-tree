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
