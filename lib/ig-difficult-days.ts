/**
 * "Difficult puzzle" cadence — ONE source of truth for the weekday set AND the
 * clock used to read it. Imported by the renderer (scripts/render-daily-video.ts)
 * and the poster (lib/ig-queue.ts → /api/cron/ig-post).
 *
 * Difficult reels post 5 days/week — Mon(1), Tue(2), Thu(4), Fri(5), Sat(6).
 * Wed(3) + Sun(0) stay normal for variety. See RULES.md §44.
 *
 * Dependency-free on purpose: the renderer must be able to import this without
 * pulling in @vercel/blob.
 */
export const DIFFICULT_DOW = new Set([1, 2, 4, 5, 6]);

const DOW_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Weekday (0=Sun..6=Sat) of an instant in America/New_York — the audience's day.
 * The account posts on an ET schedule, so ET is the only clock that counts.
 */
export function easternDayOfWeek(d: Date): number {
  const wd = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
  }).format(d);
  return DOW_NAMES.indexOf(wd);
}

/** Is this instant on a difficult day (ET)? */
export function isDifficultDay(d: Date): boolean {
  return DIFFICULT_DOW.has(easternDayOfWeek(d));
}

/**
 * Weekday of a bare "M.D.YY" calendar label. A label has no timezone, so it is
 * read as a plain calendar date (UTC) — never the render machine's local clock.
 * Returns -1 if the label is unparseable.
 */
export function dayOfWeekForDateLabel(dateStr: string): number {
  const m = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2})$/);
  if (!m) return -1;
  const [, mo, d, yy] = m;
  return new Date(Date.UTC(2000 + Number(yy), Number(mo) - 1, Number(d))).getUTCDay();
}

/** Is the reel dated `dateStr` ("M.D.YY") a difficult one? */
export function isDifficultDateLabel(dateStr: string): boolean {
  const dow = dayOfWeekForDateLabel(dateStr);
  return dow >= 0 && DIFFICULT_DOW.has(dow);
}

/** Today's "M.D.YY" label in America/New_York — matches the poster's clock. */
export function easternDateLabel(d: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: '2-digit', month: 'numeric', day: 'numeric',
  }).formatToParts(d);
  const get = (t: string) => parts.find(p => p.type === t)!.value;
  return `${get('month')}.${get('day')}.${get('year')}`;
}
