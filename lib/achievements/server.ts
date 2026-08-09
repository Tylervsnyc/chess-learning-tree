import type { SupabaseClient } from '@supabase/supabase-js';
import { getTodayInTZ, isValidDate } from '@/lib/run/daily';
import { fetchCompletionTimestamps, computeStreak, shiftDate } from '@/lib/streak/compute';
import { periodStartISO } from '@/lib/leaderboard/period';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { evaluate, type AchievementEvent, type AchievementContext } from './engine';
import type { AchievementRow, AchievementUnlock } from './types';

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
): Promise<AchievementUnlock[]> {
  if (!FEATURE_FLAGS.ACHIEVEMENTS) return [];
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
      return [];
    }
    const rows = new Map<string, AchievementRow>(
      ((rowData ?? []) as AchievementRow[]).map((r) => [r.achievement_id, r]),
    );

    const ctx = await buildContext(svc, userId, event, tz, today, rows);
    const { writes, unlocks } = evaluate(event, ctx);
    if (writes.length === 0) return [];

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
      return [];
    }

    return unlocks;
  } catch (e) {
    console.error('achievements processing failed', e);
    return [];
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

  let boutLossesToday = 0;
  let workoutsToday = 0;
  let rankedWinDayStreak = 0;

  if (event.kind === 'bout_finished') {
    const dayStart = periodStartISO('daily');
    const { data: todayBouts } = await svc
      .from('bout_sessions')
      .select('result')
      .eq('user_id', userId)
      .gte('created_at', dayStart);
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
  } else {
    const { data: todayWorkouts } = await svc
      .from('workout_sessions')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', periodStartISO('daily'));
    workoutsToday = (todayWorkouts ?? []).length;
  }

  return {
    rows,
    streakCurrent: streak.current,
    gapDaysBeforeToday,
    localHour,
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
