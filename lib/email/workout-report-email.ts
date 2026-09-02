import { createServiceClient } from '@/lib/supabase/service';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { BoxingWorkoutReport } from '@/lib/email/templates/BoxingWorkoutReport';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { currentStreakFromDays } from '@/lib/streak/activity';
import type { HardestSolve } from '@/lib/workout/hardest-solve';

/**
 * The post-workout email (cb_workout_report).
 *
 * Called from /api/workout/finish (inside `after()`, so it never delays the
 * result card) once a FRESH session row has landed — a replayed finish must
 * not mail twice, and the route already knows which is which.
 *
 * Two gates, both must be open:
 *   - FEATURE_FLAGS.WORKOUT_REPORT_EMAIL (code)
 *   - CB_EMAIL_LIFECYCLE_ENABLED=true (server env; the Chess Boxing email
 *     kill-switch shared with the drip cron). Off → dry-run log line only.
 *
 * Belt and braces: email_log is checked for this session id, so even a
 * double invocation sends once.
 */

export interface WorkoutReportEmailInput {
  userId: string;
  sessionId: string;
  score: number;
  correct: number;
  wrong: number;
  punches?: number;
  bestRound?: number;
  isPersonalBest?: boolean;
  previousBest?: number;
  /** The hardest puzzle they solved, to picture on a board. */
  hardest?: HardestSolve | null;
  /** IANA timezone the client reported, for the streak day boundary. */
  tz?: unknown;
}

export type WorkoutReportEmailResult =
  | { status: 'sent'; to: string }
  | { status: 'dry-run'; to: string }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; error: string };

export async function sendWorkoutReportEmail(
  input: WorkoutReportEmailInput,
): Promise<WorkoutReportEmailResult> {
  if (!FEATURE_FLAGS.WORKOUT_REPORT_EMAIL) return { status: 'skipped', reason: 'flag off' };
  if (!input.sessionId) return { status: 'skipped', reason: 'no session id' };

  const enabled = process.env.CB_EMAIL_LIFECYCLE_ENABLED === 'true';
  const supabase = createServiceClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('email, display_name')
    .eq('id', input.userId)
    .maybeSingle();
  if (error) return { status: 'failed', error: `profile read: ${error.message}` };
  const to = profile?.email ?? null;
  if (!to) return { status: 'skipped', reason: 'no email on profile' };

  // Never mail a dead mailbox (bounces reconciled by scripts/sync-email-bounces.ts).
  const { data: bounced } = await supabase
    .from('email_log')
    .select('id')
    .eq('email_address', to)
    .eq('status', 'bounced')
    .limit(1);
  if (bounced && bounced.length > 0) return { status: 'skipped', reason: 'address bounced' };

  // One email per workout, ever.
  const { data: already } = await supabase
    .from('email_log')
    .select('id')
    .eq('user_id', input.userId)
    .eq('email_type', 'cb_workout_report')
    .contains('metadata', { session_id: input.sessionId })
    .limit(1);
  if (already && already.length > 0) return { status: 'skipped', reason: 'already sent for session' };

  // Streak AFTER this workout: the row is in, so today counts. Only THIS
  // user's boxing rows (the cron-wide helper scans every user — too heavy for
  // a per-finish call). Days are bucketed in the client's timezone.
  let currentStreak = 0;
  try {
    const tz = typeof input.tz === 'string' && input.tz ? input.tz : 'UTC';
    const dayIn = (iso: string) => {
      try {
        return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date(iso));
      } catch {
        return iso.slice(0, 10);
      }
    };
    const since = new Date(Date.now() - 120 * 24 * 3600 * 1000).toISOString();
    const [workouts, bouts] = await Promise.all([
      supabase
        .from('workout_sessions')
        .select('created_at')
        .eq('user_id', input.userId)
        .gte('created_at', since),
      supabase
        .from('bout_sessions')
        .select('ended_at')
        .eq('user_id', input.userId)
        .gte('ended_at', since),
    ]);
    const days = new Set<string>();
    for (const r of workouts.data ?? []) if (r.created_at) days.add(dayIn(String(r.created_at)));
    for (const r of bouts.data ?? []) if (r.ended_at) days.add(dayIn(String(r.ended_at)));
    currentStreak = currentStreakFromDays([...days].sort(), dayIn(new Date().toISOString()));
  } catch (e) {
    console.error('[workout-report-email] streak derive failed', e);
  }

  const appUrl = getAppUrl();
  const react = BoxingWorkoutReport({
    displayName: profile?.display_name || undefined,
    appUrl,
    unsubscribeUrl: getUnsubscribeUrl(input.userId, 'cb_workout_report'),
    sessionId: input.sessionId,
    score: input.score,
    correct: input.correct,
    wrong: input.wrong,
    punches: input.punches,
    bestRound: input.bestRound,
    isPersonalBest: input.isPersonalBest,
    previousBest: input.previousBest,
    hardest: input.hardest ?? undefined,
    currentStreak: currentStreak > 0 ? currentStreak : undefined,
  });

  const subject = input.wrong > 0
    ? `Great workout. ${input.correct}/${input.correct + input.wrong}, and your report is ready.`
    : `Great workout. ${input.correct} for ${input.correct}.`;

  if (!enabled) {
    console.log(`[workout-report-email:dry-run] WOULD send cb_workout_report to ${to} (session ${input.sessionId})`);
    return { status: 'dry-run', to };
  }

  const result = await sendEmail({
    to,
    userId: input.userId,
    type: 'cb_workout_report',
    subject,
    react,
    metadata: {
      session_id: input.sessionId,
      score: input.score,
      correct: input.correct,
      wrong: input.wrong,
      is_personal_best: Boolean(input.isPersonalBest),
      has_report: input.wrong > 0,
      hardest_rating: input.hardest?.rating ?? null,
    },
  });
  if (!result.success) return { status: 'failed', error: result.error ?? 'unknown' };
  return { status: 'sent', to };
}
