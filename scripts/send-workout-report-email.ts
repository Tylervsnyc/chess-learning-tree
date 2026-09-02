/**
 * Send (or dry-run) the post-workout email for ONE real workout session.
 *
 *   npx tsx scripts/send-workout-report-email.ts --user=<email>              # dry run, latest workout
 *   npx tsx scripts/send-workout-report-email.ts --session=<id>              # dry run, that session
 *   npx tsx scripts/send-workout-report-email.ts --user=<email> --send       # real send to the profile's address
 *   npx tsx scripts/send-workout-report-email.ts --user=<email> --send --to=you@place.com   # real send, redirected
 *   npx tsx scripts/send-workout-report-email.ts --user=<email> --preview    # write an .html next to the data
 *
 * Uses the same builder as /api/workout/finish (lib/email/workout-report-email.ts),
 * so what you see here is what a user gets. --send goes through email_log's
 * per-session dedupe unless --to redirects it.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { render } from '@react-email/render';
import { writeFileSync } from 'fs';
import { BoxingWorkoutReport } from '../lib/email/templates/BoxingWorkoutReport';
import { sendWorkoutReportEmail } from '../lib/email/workout-report-email';
import { getUnsubscribeUrl, getAppUrl } from '../lib/email/send';
import { getResendClient, CB_EMAIL_FROM } from '../lib/email/resend';

const arg = (k: string) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=').slice(1).join('=');
const flag = (k: string) => process.argv.includes(`--${k}`);

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let sessionId = arg('session');
  let userId: string | null = null;

  if (!sessionId) {
    const email = arg('user');
    if (!email) throw new Error('pass --user=<email> or --session=<id>');
    const { data: p } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
    if (!p) throw new Error(`no profile for ${email}`);
    userId = p.id;
    const { data: s } = await supabase
      .from('workout_sessions')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!s) throw new Error(`no workouts for ${email}`);
    sessionId = s.id;
  }

  const { data: row, error } = await supabase
    .from('workout_sessions')
    .select('id, user_id, points, correct_count, wrong_count, punches, best_round_points, created_at')
    .eq('id', sessionId!)
    .maybeSingle();
  if (error || !row) throw new Error(`session ${sessionId} not found: ${error?.message ?? ''}`);
  userId = row.user_id;

  const { data: prior } = await supabase
    .from('workout_sessions')
    .select('points')
    .eq('user_id', userId)
    .lt('created_at', row.created_at);
  const previousBest = Math.max(0, ...(prior ?? []).map((r) => (r.points as number) ?? 0));
  const score = row.points ?? 0;

  const input = {
    userId: userId!,
    sessionId: row.id,
    score,
    correct: row.correct_count ?? 0,
    wrong: row.wrong_count ?? 0,
    punches: row.punches > 0 ? row.punches : undefined,
    bestRound: row.best_round_points > 0 ? row.best_round_points : undefined,
    isPersonalBest: score > previousBest && score > 0,
    previousBest: previousBest > 0 ? previousBest : undefined,
    tz: 'America/New_York',
  };
  console.log('session', row.id, 'created', row.created_at);
  console.log(input);

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, display_name')
    .eq('id', userId!)
    .maybeSingle();

  const react = BoxingWorkoutReport({
    displayName: profile?.display_name || undefined,
    appUrl: getAppUrl(),
    unsubscribeUrl: getUnsubscribeUrl(userId!, 'cb_workout_report'),
    sessionId: row.id,
    score: input.score,
    correct: input.correct,
    wrong: input.wrong,
    punches: input.punches,
    bestRound: input.bestRound,
    isPersonalBest: input.isPersonalBest,
    previousBest: input.previousBest,
  });

  if (flag('preview')) {
    const out = `data/workout-reports/${row.id}.email.html`;
    writeFileSync(out, await render(react));
    console.log('wrote', out);
    return;
  }

  const redirect = arg('to');
  if (flag('send') && redirect) {
    // Test path: one raw Resend send to a chosen address, no email_log row.
    const resend = getResendClient();
    const { data, error: sendErr } = await resend.emails.send({
      from: CB_EMAIL_FROM,
      to: redirect,
      subject: `[test] Your workout report is ready (${input.correct}/${input.correct + input.wrong})`,
      react,
    });
    if (sendErr) throw new Error(sendErr.message);
    console.log('sent to', redirect, 'resend id', data?.id);
    return;
  }

  if (flag('send')) {
    process.env.CB_EMAIL_LIFECYCLE_ENABLED = 'true';
  } else {
    process.env.CB_EMAIL_LIFECYCLE_ENABLED = 'false';
    console.log('(dry run — pass --send to really send)');
  }
  const result = await sendWorkoutReportEmail(input);
  console.log(result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
