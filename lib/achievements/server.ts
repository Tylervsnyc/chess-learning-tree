import type { SupabaseClient } from '@supabase/supabase-js';
import { getTodayInTZ, isValidDate } from '@/lib/run/daily';
import { fetchCompletionTimestamps, computeStreak, shiftDate } from '@/lib/streak/compute';
import { periodStartISO } from '@/lib/leaderboard/period';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import {
  evaluate,
  nextMedalTeaser,
  rowToUnlock,
  type AchievementEvent,
  type AchievementContext,
} from './engine';
import type { AchievementRow, AchievementUnlock, NextMedal } from './types';

export interface AchievementOutcome {
  /** Fresh unlocks/upgrades from this event, followed by the unseen backlog. */
  unlocks: AchievementUnlock[];
  /** Closest in-progress ladder medal, for the result card's teaser line. */
  nextMedal: NextMedal | null;
}

const NONE: AchievementOutcome = { unlocks: [], nextMedal: null };

/**
 * Server side of the achievements engine. Called from the finish routes
 * (/api/bout/finish, /api/workout/finish) with the SERVICE client —
 * user_achievements has no client write policy, same trust model as
 * bout_sessions (nobody hand-mints an Undisputed belt).
 *
 * Best-effort by design: achievements must never fail a finish in the user's
 * face. Any error (including the table not being migrated yet — DDL is run by
 * hand on the live DB) degrades to "no new achievements".
 */
export async function processAchievementEvent(
  svc: SupabaseClient,
  userId: string,
  event: AchievementEvent,
  tzRaw?: unknown,
): Promise<AchievementOutcome> {
  if (!FEATURE_FLAGS.ACHIEVEMENTS) return NONE;
  try {
    const tz = typeof tzRaw === 'string' && tzRaw.length <= 64 ? tzRaw : 'UTC';
    const today = safeToday(tz);

    // Existing rows — also the probe for "table not migrated yet".
    const { data: rowData, error: rowError } = await svc
      .from('user_achievements')
      .select('achievement_id, tier, progress, unlocked_at, upgraded_at, seen')
      .eq('user_id', userId);
    if (rowError) {
      if (!/user_achievements/.test(rowError.message ?? '')) {
        console.error('achievements read failed', rowError);
      }
      return NONE;
    }
    const rows = new Map<string, AchievementRow>(
      ((rowData ?? []) as AchievementRow[]).map((r) => [r.achievement_id, r]),
    );

    const ctx = await buildContext(svc, userId, event, tz, today, rows);
    const { writes, unlocks } = evaluate(event, ctx);

    // Unseen backlog: medals earned earlier but never played (overflow, a
    // closed tab). Replayed after the fresh ones; the overlay marks them seen.
    const freshIds = new Set(unlocks.map((u) => u.id));
    const backlog: AchievementUnlock[] = [];
    for (const row of rows.values()) {
      if (row.seen || freshIds.has(row.achievement_id)) continue;
      const u = rowToUnlock(row);
      if (u) backlog.push(u);
    }

    if (writes.length === 0) return { unlocks: backlog, nextMedal: nextMedalTeaser(rows) };

    const now = new Date().toISOString();
    const upserts = writes.map((w) => {
      const existing = rows.get(w.achievement_id);
      return {
        user_id: userId,
        achievement_id: w.achievement_id,
        tier: w.tier,
        progress: w.progress,
        unlocked_at: existing?.unlocked_at ?? now,
        upgraded_at: existing && w.celebrate ? now : (existing?.upgraded_at ?? null),
        // A fresh celebration resets seen so the trophy case can mark it new;
        // silent counter ticks keep the stored value.
        seen: w.celebrate ? false : (existing?.seen ?? false),
      };
    });
    const { error: writeError } = await svc
      .from('user_achievements')
      .upsert(upserts, { onConflict: 'user_id,achievement_id' });
    if (writeError) {
      console.error('achievements write failed', writeError);
      return NONE;
    }

    // Post-write rows for the teaser (no re-read: fold the upserts in).
    const after = new Map(rows);
    for (const u of upserts) {
      after.set(u.achievement_id, {
        achievement_id: u.achievement_id,
        tier: u.tier,
        progress: u.progress,
        unlocked_at: u.unlocked_at,
        upgraded_at: u.upgraded_at,
        seen: u.seen,
      });
    }

    return { unlocks: [...unlocks, ...backlog], nextMedal: nextMedalTeaser(after) };
  } catch (e) {
    console.error('achievements processing failed', e);
    return NONE;
  }
}

async function buildContext(
  svc: SupabaseClient,
  userId: string,
  event: AchievementEvent,
  tz: string,
  today: string,
  rows: Map<string, AchievementRow>,
): Promise<AchievementContext> {
  // Streak — the shared computation over the 5 completion tables. The finish
  // routes call this AFTER inserting the session row, so today is included.
  const since = shiftDate(today, -400) + 'T00:00:00Z';
  const { timestamps } = await fetchCompletionTimestamps(svc, userId, since);
  const streak = computeStreak(timestamps, tz, today);

  // Gap before today: days between today and the most recent earlier active day.
  const earlier = streak.activeDays.filter((d) => d < today);
  const prevDay = earlier.length ? earlier[earlier.length - 1] : null;
  const gapDaysBeforeToday = prevDay ? diffDays(prevDay, today) - 1 : null;

  const localHour = hourInTz(tz);
  const localWeekday = weekdayInTz(tz);

  let boutLossesToday = 0;
  let rankedWinDayStreak = 0;

  // Both counts on every event — "Both Barrels" needs the pair.
  const dayStart = periodStartISO('daily');
  const [{ data: todayBouts }, { data: todayWorkouts }] = await Promise.all([
    svc.from('bout_sessions').select('result').eq('user_id', userId).gte('created_at', dayStart),
    svc.from('workout_sessions').select('id').eq('user_id', userId).gte('created_at', dayStart),
  ]);
  const boutsToday = (todayBouts ?? []).length;
  const workoutsToday = (todayWorkouts ?? []).length;

  if (event.kind === 'bout_finished') {
    boutLossesToday = ((todayBouts ?? []) as { result: string }[]).filter(
      (b) => b.result === 'loss',
    ).length;

    // "And STILL": consecutive days ending today where a RANKED bout (points>0)
    // was won. Cheap: last ~30 days of ranked bouts, walk back day by day.
    if (event.ranked && event.result === 'win') {
      const { data: ranked } = await svc
        .from('bout_sessions')
        .select('created_at, result, points')
        .eq('user_id', userId)
        .gt('points', 0)
        .gte('created_at', shiftDate(today, -30) + 'T00:00:00Z');
      const winDays = new Set<string>();
      const lossDays = new Set<string>();
      for (const b of (ranked ?? []) as { created_at: string; result: string }[]) {
        const day = localDay(b.created_at, tz);
        if (b.result === 'win') winDays.add(day);
        else lossDays.add(day);
      }
      let cursor = today;
      while (winDays.has(cursor) && !lossDays.has(cursor)) {
        rankedWinDayStreak++;
        cursor = shiftDate(cursor, -1);
      }
    }
  }

  return {
    rows,
    streakCurrent: streak.current,
    gapDaysBeforeToday,
    localHour,
    localWeekday,
    boutsToday,
    boutLossesToday,
    workoutsToday,
    rankedWinDayStreak,
  };
}

function safeToday(tz: string): string {
  const t = getTodayInTZ(tz);
  return isValidDate(t) ? t : getTodayInTZ('UTC');
}

function hourInTz(tz: string): number {
  try {
    const h = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).format(
      new Date(),
    );
    const n = parseInt(h, 10);
    return Number.isFinite(n) ? n % 24 : 12;
  } catch {
    return 12; // unknown tz — never fires Night Shift by accident
  }
}

function weekdayInTz(tz: string): number | null {
  try {
    const w = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(new Date());
    const idx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(w);
    return idx >= 0 ? idx : null;
  } catch {
    return null;
  }
}

function localDay(ts: string, tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(ts));
  } catch {
    return ts.slice(0, 10);
  }
}

function diffDays(a: string, b: string): number {
  return Math.round(
    (new Date(b + 'T00:00:00Z').getTime() - new Date(a + 'T00:00:00Z').getTime()) / 86_400_000,
  );
}
