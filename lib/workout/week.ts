import type { SupabaseClient } from '@supabase/supabase-js';
import { getTodayInTZ, isValidDate } from '@/lib/run/daily';

/**
 * Weekly workout points (Monday → Sunday in the user's tz) — shared by
 * GET /api/workout/week and GET /api/profile/dashboard. Keep both routes
 * calling this so they can't drift.
 */

export interface WeekDay {
  date: string; // YYYY-MM-DD
  label: string; // Mon
  points: number;
}

export interface WeekData {
  days: WeekDay[];
  weekTotal: number;
}

/** Thrown when the tz param doesn't resolve to a valid date (route → 400). */
export class InvalidTimezoneError extends Error {
  constructor() {
    super('invalid tz');
    this.name = 'InvalidTimezoneError';
  }
}

const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export async function getWorkoutWeek(
  supabase: SupabaseClient,
  userId: string,
  tz: string,
): Promise<WeekData> {
  const today = getTodayInTZ(tz);
  if (!isValidDate(today)) {
    throw new InvalidTimezoneError();
  }

  // Monday of the current week. JS getUTCDay: 0=Sun..6=Sat → offset back to Mon.
  const todayUtc = new Date(today + 'T00:00:00Z');
  const dow = todayUtc.getUTCDay();
  const backToMonday = dow === 0 ? 6 : dow - 1;
  const monday = shiftDate(today, -backToMonday);

  const weekDates = Array.from({ length: 7 }, (_, i) => shiftDate(monday, i));

  // Pull sessions from Monday 00:00 local → now. Convert the local Monday to a
  // safe UTC lower bound by walking back one extra day (covers any tz offset).
  const since = shiftDate(monday, -1) + 'T00:00:00Z';

  const { data, error } = await supabase
    .from('workout_sessions')
    .select('created_at, points')
    .eq('user_id', userId)
    .gte('created_at', since);

  if (error) {
    console.error('workout week read failed', error);
    throw new Error('workout week read failed');
  }

  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const pointsByDate = new Map<string, number>();
  for (const r of data ?? []) {
    const ts = r.created_at as string;
    if (!ts) continue;
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) continue;
    const localDate = fmt.format(d);
    const pts = typeof r.points === 'number' ? r.points : 0;
    pointsByDate.set(localDate, (pointsByDate.get(localDate) ?? 0) + pts);
  }

  let weekTotal = 0;
  const days = weekDates.map((date, i) => {
    const points = pointsByDate.get(date) ?? 0;
    weekTotal += points;
    return { date, label: LABELS[i], points };
  });

  return { days, weekTotal };
}

function shiftDate(yyyyMmDd: string, deltaDays: number): string {
  const d = new Date(yyyyMmDd + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}
