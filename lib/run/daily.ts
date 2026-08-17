import { EXPERIMENTAL_RUN_IDS, RUNS, STC_RUN_IDS } from './runs';

// STC mini-runs and experimental playtest runs never rotate as dailies.
// CRITICAL: the daily is index math over this pool — its LENGTH and ORDER
// define every date's run, so excluded sets must keep existing entries stable.
const EXCLUDED = new Set<string>([...STC_RUN_IDS, ...EXPERIMENTAL_RUN_IDS]);

const DAILY_POOL = RUNS.filter((r) => !EXCLUDED.has(r.id));

const EPOCH_DATE = '2026-01-01';

function daysSinceEpoch(yyyyMmDd: string): number {
  const a = Date.UTC(
    Number(yyyyMmDd.slice(0, 4)),
    Number(yyyyMmDd.slice(5, 7)) - 1,
    Number(yyyyMmDd.slice(8, 10)),
  );
  const b = Date.UTC(2026, 0, 1);
  return Math.floor((a - b) / 86400000);
}

export function getRunIdForDate(yyyyMmDd: string): string {
  if (DAILY_POOL.length === 0) return RUNS[0].id;
  const idx = ((daysSinceEpoch(yyyyMmDd) % DAILY_POOL.length) + DAILY_POOL.length) % DAILY_POOL.length;
  return DAILY_POOL[idx].id;
}

export function getTodayInTZ(tz: string): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(new Date());
}

export function isValidDate(yyyyMmDd: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return false;
  const d = new Date(yyyyMmDd + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === yyyyMmDd;
}

export function isFutureDate(yyyyMmDd: string, tz: string): boolean {
  return yyyyMmDd > getTodayInTZ(tz);
}

export function getDailyVaultDates(tz: string, count = 30): string[] {
  const today = getTodayInTZ(tz);
  const out: string[] = [];
  const base = new Date(today + 'T00:00:00Z');
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export const DAILY_EPOCH = EPOCH_DATE;
