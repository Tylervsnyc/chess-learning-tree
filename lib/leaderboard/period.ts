/**
 * Leaderboard time windows.
 *
 * Boards are ranked over a rolling period. To keep a global competition
 * consistent for everyone regardless of where they live, windows are anchored
 * to a single canonical timezone (US Eastern — where the launch crew trains)
 * rather than each viewer's local clock.
 */

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly';

export const PERIODS: LeaderboardPeriod[] = ['daily', 'weekly', 'monthly'];

export function isPeriod(v: unknown): v is LeaderboardPeriod {
  return v === 'daily' || v === 'weekly' || v === 'monthly';
}

// Canonical anchor timezone for all boards.
const TZ = 'America/New_York';

/** Current wall-clock date parts in the anchor timezone. */
function nowInTz(): { y: number; m: number; d: number; weekday: number } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return {
    y: Number(get('year')),
    m: Number(get('month')),
    d: Number(get('day')),
    weekday: weekdayMap[get('weekday')] ?? 0,
  };
}

/**
 * Start of the current period as an ISO timestamp (UTC), for
 * `created_at >= start` filters. Daily = since local midnight ET; weekly =
 * since Monday 00:00 ET; monthly = since the 1st 00:00 ET.
 *
 * Uses the ET midnight ≈ 05:00 UTC approximation (EST -5 / EDT -4). Exactness
 * to the hour doesn't matter for a rolling board; day-grain does, and this
 * keeps the boundary stable within ET.
 */
export function periodStartISO(period: LeaderboardPeriod): string {
  const { y, m, d, weekday } = nowInTz();
  // Midnight ET expressed in UTC (~05:00 UTC). Using 05:00 keeps us on the
  // correct calendar day for both EST and EDT.
  const midnightEtToUtc = (yy: number, mm: number, dd: number) =>
    new Date(Date.UTC(yy, mm - 1, dd, 5, 0, 0, 0));

  if (period === 'daily') {
    return midnightEtToUtc(y, m, d).toISOString();
  }
  if (period === 'weekly') {
    // Back up to Monday (treat Monday as the week start).
    const daysSinceMonday = (weekday + 6) % 7; // Mon=0 … Sun=6
    const base = midnightEtToUtc(y, m, d);
    base.setUTCDate(base.getUTCDate() - daysSinceMonday);
    return base.toISOString();
  }
  // monthly
  return midnightEtToUtc(y, m, 1).toISOString();
}
