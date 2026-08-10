/**
 * backfill-achievements.ts — one-time grant of every achievement already
 * earned from history, so day-one users open the trophy case and find it
 * half full instead of empty (docs/chess-boxing-achievements-plan.md §5).
 *
 * Replays each user's bout_sessions + workout_sessions chronologically
 * through the SAME pure engine the finish routes use (lib/achievements/
 * engine.ts), with per-event context rebuilt from history. Seeds the
 * puzzle-grinder counter from lifetime workout corrects + lesson
 * puzzle_attempts. Everything lands with seen=false — the trophy case marks
 * it new; no unlock animations replay.
 *
 * Idempotent: tiers/progress are recomputed from scratch and upserted, and
 * existing seen/unlocked_at values are preserved. Timezone: history is
 * replayed in UTC (we don't know where each session was fought from) — a
 * Night Shift medal is deliberately NOT backfilled, and streaks may read a
 * day shorter than the user's local truth. Close enough for medals.
 *
 * Run: npx tsx scripts/backfill-achievements.ts [--dry]
 */
import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { evaluate, type AchievementEvent, type AchievementContext } from '../lib/achievements/engine';
import { ACHIEVEMENT_CATALOG } from '../lib/achievements/catalog';
import type { AchievementRow } from '../lib/achievements/types';
import { computeStreak } from '../lib/streak/compute';
import { boxingRoundCount, materialBalance, type BoutFormat } from '../lib/bout/bout';

dotenv.config({ path: '.env.local' });

const DRY = process.argv.includes('--dry');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s+/g, '');
if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
const sb: SupabaseClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const day = (ts: string) => ts.slice(0, 10);

async function main() {
  const { data: users, error } = await sb.from('profiles').select('id');
  if (error) throw error;

  let touched = 0;
  for (const { id: userId } of users ?? []) {
    const [bouts, workouts, lessonAttempts, completions] = await Promise.all([
      sb
        .from('bout_sessions')
        .select('outcome, result, level, points, moves, clock_left_seconds, final_fen, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true }),
      sb
        .from('workout_sessions')
        .select('points, correct_count, wrong_count, perfect, duration_minutes, punches, best_round_points, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true }),
      sb.from('puzzle_attempts').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('correct', true),
      collectCompletionTimestamps(userId),
    ]);
    if (bouts.error && !/bout_sessions/.test(bouts.error.message ?? '')) throw bouts.error;
    const boutRows = bouts.data ?? [];
    const workoutRows = workouts.data ?? [];
    if (boutRows.length === 0 && workoutRows.length === 0) continue;

    // Rows accumulate across the replay — the engine sees its own past writes.
    const rows = new Map<string, AchievementRow>();
    const apply = (event: AchievementEvent, ctx: AchievementContext) => {
      const { writes } = evaluate(event, ctx);
      for (const w of writes) {
        const prev = rows.get(w.achievement_id);
        rows.set(w.achievement_id, {
          achievement_id: w.achievement_id,
          tier: w.tier,
          progress: w.progress,
          unlocked_at: prev?.unlocked_at ?? new Date().toISOString(),
          upgraded_at: prev && w.celebrate ? new Date().toISOString() : (prev?.upgraded_at ?? null),
          seen: false,
        });
      }
    };

    // Seed the lesson-side puzzle count so puzzle-grinder reflects lifetime
    // solves, not just workouts. (Workout corrects arrive via the replay.)
    const lessonSolves = lessonAttempts.count ?? 0;
    if (lessonSolves > 0) {
      rows.set('puzzle-grinder', {
        achievement_id: 'puzzle-grinder',
        tier: 0, // recomputed by the first replayed count() call — or fixed below
        progress: lessonSolves,
        unlocked_at: new Date().toISOString(),
        upgraded_at: null,
        seen: false,
      });
    }

    const allTimestamps = completions;
    const baseCtx = (ts: string): AchievementContext => ({
      rows,
      streakCurrent: computeStreak(
        allTimestamps.filter((t) => t <= ts),
        'UTC',
        day(ts),
      ).current,
      gapDaysBeforeToday: null, // not reconstructable per-event cheaply; skip Comeback Kid
      localHour: 12, // unknown historical tz — never backfill Night Shift
      boutLossesToday: 0,
      workoutsToday: 0,
      rankedWinDayStreak: 0,
    });

    // Replay bouts + workouts in one chronological stream.
    type Item = { ts: string; ev: AchievementEvent; kind: 'bout' | 'workout' };
    const stream: Item[] = [
      ...boutRows.map((b): Item => {
        let material: number | null = null;
        try {
          material = b.final_fen ? materialBalance(b.final_fen as string) : null;
        } catch {
          material = null;
        }
        // Format wasn't stored on bout_sessions — assume the ranked Standard
        // card (Championship Rounds is not backfilled).
        const format: BoutFormat = 'standard';
        return {
          ts: b.created_at as string,
          kind: 'bout',
          ev: {
            kind: 'bout_finished',
            outcome: b.outcome as never,
            result: b.result as never,
            level: (b.level as number) ?? 1,
            ranked: ((b.points as number) ?? 0) > 0,
            format,
            roundsSurvived: 0, // not stored — Went the Distance is not backfilled
            boxingRounds: boxingRoundCount(format),
            clockLeftSeconds: (b.clock_left_seconds as number) ?? 999,
            material,
          },
        };
      }),
      ...workoutRows.map(
        (w): Item => ({
          ts: w.created_at as string,
          kind: 'workout',
          ev: {
            kind: 'workout_finished',
            correct: (w.correct_count as number) ?? 0,
            punches: (w.punches as number) ?? 0,
            perfect: w.perfect === true,
            durationMinutes: (w.duration_minutes as number) ?? null,
            bestRoundPoints: (w.best_round_points as number) ?? 0,
            bestCombo: 0, // not stored — Combo Meal is not backfilled
            firedUp: false,
            struckOutFirstSegment: false,
            isPersonalBest: false, // recomputed below
          },
        }),
      ),
    ].sort((a, b) => (a.ts < b.ts ? -1 : 1));

    // Recompute per-day/percumulative facts the finish routes knew live.
    let bestPoints = 0;
    const lossByDay = new Map<string, number>();
    const workoutsByDay = new Map<string, number>();
    for (const item of stream) {
      const ctx = baseCtx(item.ts);
      if (item.kind === 'bout') {
        const ev = item.ev as Extract<AchievementEvent, { kind: 'bout_finished' }>;
        if (ev.result === 'loss') {
          lossByDay.set(day(item.ts), (lossByDay.get(day(item.ts)) ?? 0) + 1);
        }
        ctx.boutLossesToday = lossByDay.get(day(item.ts)) ?? 0;
      } else {
        const ev = item.ev as Extract<AchievementEvent, { kind: 'workout_finished' }>;
        workoutsByDay.set(day(item.ts), (workoutsByDay.get(day(item.ts)) ?? 0) + 1);
        ctx.workoutsToday = workoutsByDay.get(day(item.ts)) ?? 0;
        const w = workoutRows.find((r) => r.created_at === item.ts);
        const pts = (w?.points as number) ?? 0;
        ev.isPersonalBest = pts > bestPoints && pts > 0;
        bestPoints = Math.max(bestPoints, pts);
      }
      apply(item.ev, ctx);
    }

    // Normalize count-ladder tiers from final progress (covers the seeded
    // lesson-solve counter when no workout ever replayed on top of it).
    for (const [id, row] of rows) {
      const def = ACHIEVEMENT_CATALOG.find((d) => d.id === id);
      if (!def?.thresholds || row.progress == null) continue;
      const tier = def.thresholds.filter((t) => (row.progress ?? 0) >= t).length;
      if (tier > row.tier) rows.set(id, { ...row, tier });
    }

    if (rows.size === 0) continue;
    touched++;
    const summary = [...rows.values()]
      .filter((r) => r.tier > 0)
      .map((r) => `${r.achievement_id}:${r.tier}`)
      .join(' ');
    console.log(`${userId}  ${summary || '(counters only)'}`);

    if (!DRY) {
      const { error: upsertError } = await sb.from('user_achievements').upsert(
        [...rows.values()].map((r) => ({ user_id: userId, ...r })),
        { onConflict: 'user_id,achievement_id' },
      );
      if (upsertError) throw upsertError;
    }
  }
  console.log(`\n${DRY ? '[dry run] ' : ''}${touched} users with achievements.`);
}

/** All completion timestamps (the 5 streak tables), for streak context. */
async function collectCompletionTimestamps(userId: string): Promise<string[]> {
  const [lessons, games, workouts, openings, bouts] = await Promise.all([
    sb.from('lesson_progress').select('completed_at').eq('user_id', userId),
    sb.from('game_sessions').select('ended_at').eq('user_id', userId).not('ended_at', 'is', null),
    sb.from('workout_sessions').select('created_at').eq('user_id', userId),
    sb.from('opening_progress').select('completed_at').eq('user_id', userId),
    sb.from('bout_sessions').select('ended_at').eq('user_id', userId),
  ]);
  return [
    ...((lessons.data ?? []) as { completed_at: string }[]).map((r) => r.completed_at),
    ...((games.data ?? []) as { ended_at: string }[]).map((r) => r.ended_at),
    ...((workouts.data ?? []) as { created_at: string }[]).map((r) => r.created_at),
    ...((openings.data ?? []) as { completed_at: string }[]).map((r) => r.completed_at),
    ...((bouts.data ?? []) as { ended_at: string }[]).map((r) => r.ended_at),
  ].filter(Boolean);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
