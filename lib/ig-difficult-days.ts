/**
 * Reel TIER cadence — ONE source of truth for which weekday gets which tier AND
 * the clock used to read it. Imported by the renderer (scripts/render-daily-video.ts)
 * and the poster (lib/ig-queue.ts → /api/cron/ig-post).
 *
 *   impossible — Tue(2), Thu(4), Sat(6)
 *   difficult  — Sun(0), Mon(1), Wed(3), Fri(5)
 *   normal     — no days (2026-09-29: difficult reached ~3x normal over 54 posts).
 *                The tier still exists as the last-resort fallback bucket.
 *
 * See RULES.md §44.
 *
 * Dependency-free on purpose: the renderer must be able to import this without
 * pulling in @vercel/blob.
 */
export type ReelTier = 'normal' | 'difficult' | 'impossible';

export const IMPOSSIBLE_DOW = new Set([2, 4, 6]);
export const DIFFICULT_DOW = new Set([0, 1, 3, 5]);

/** Posting slots per week for each tier — for runway math. */
export const TIER_SLOTS_PER_WEEK: Record<ReelTier, number> = {
  impossible: IMPOSSIBLE_DOW.size,
  difficult: DIFFICULT_DOW.size,
  normal: 7 - IMPOSSIBLE_DOW.size - DIFFICULT_DOW.size,
};

/** Tiers that actually get posting days — the only ones refill stocks and low-water alerts watch. */
export const ACTIVE_TIERS: ReelTier[] = (['normal', 'difficult', 'impossible'] as const)
  .filter(t => TIER_SLOTS_PER_WEEK[t] > 0);

const DOW_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function tierForDow(dow: number): ReelTier {
  if (IMPOSSIBLE_DOW.has(dow)) return 'impossible';
  if (DIFFICULT_DOW.has(dow)) return 'difficult';
  return 'normal';
}

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

/** Which tier posts on this instant (ET)? */
export function tierForDate(d: Date): ReelTier {
  return tierForDow(easternDayOfWeek(d));
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

/** Which tier is the reel dated `dateStr` ("M.D.YY")? Unparseable → normal. */
export function tierForDateLabel(dateStr: string): ReelTier {
  const dow = dayOfWeekForDateLabel(dateStr);
  return dow >= 0 ? tierForDow(dow) : 'normal';
}

/**
 * Tier of a record written before tiers existed (queue item, sidecar, ledger
 * row). `tier` wins when present; otherwise the legacy `difficult` boolean.
 */
export function tierOf(rec: { tier?: ReelTier; difficult?: boolean }): ReelTier {
  return rec.tier ?? (rec.difficult ? 'difficult' : 'normal');
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
