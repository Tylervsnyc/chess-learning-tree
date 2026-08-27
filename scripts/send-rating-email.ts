/**
 * One-off "your estimated rating" blast from Rookie.
 *
 * For every user with email + at least one rated puzzle/game, computes their
 * estimated rating (same model as /api/profile/elo) and emails them the
 * Rookie-voiced RatingReveal. Skips opt-outs and anyone already sent.
 *
 * SAFE BY DEFAULT — dry run. Nothing sends without --send.
 *
 * Usage:
 *   npx tsx scripts/send-rating-email.ts                 # dry run, all users
 *   npx tsx scripts/send-rating-email.ts --only=you@x.com # dry run, one user
 *   npx tsx scripts/send-rating-email.ts --only=you@x.com --send   # really send one
 *   npx tsx scripts/send-rating-email.ts --send          # really send the blast
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createServiceClient } from '../lib/supabase/service';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '../lib/email/send';
import { RatingReveal } from '../lib/email/templates/RatingReveal';
import { estimateElo, type EloEvent } from '../lib/elo/estimate';
import { getLevelElo } from '../lib/rookie-levels';
import ratingIndex from '../data/puzzle-rating-index.json';

const PUZZLE_RATINGS = ratingIndex as Record<string, number>;
const EMAIL_TYPE = 'rating_reveal' as const;
const MIN_EVENTS = 3; // don't email a rating built from one or two data points

function scoreFromResult(result: string | null): number | null {
  switch (result) {
    case 'win':
      return 1;
    case 'draw':
      return 0.5;
    case 'loss':
      return 0;
    default:
      return null;
  }
}

async function ratingForUser(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
) {
  const [puzzles, games] = await Promise.all([
    supabase
      .from('puzzle_attempts')
      .select('puzzle_id, correct, attempted_at')
      .eq('user_id', userId)
      .order('attempted_at', { ascending: true })
      .limit(10000),
    supabase
      .from('game_sessions')
      .select('rookie_difficulty, result, ended_at')
      .eq('user_id', userId)
      .not('ended_at', 'is', null)
      .order('ended_at', { ascending: true })
      .limit(5000),
  ]);

  const events: EloEvent[] = [];
  for (const p of puzzles.data ?? []) {
    const rating = PUZZLE_RATINGS[p.puzzle_id as string];
    if (typeof rating !== 'number' || !p.attempted_at) continue;
    events.push({ at: p.attempted_at, kind: 'puzzle', opponent: rating, score: p.correct ? 1 : 0 });
  }
  for (const g of games.data ?? []) {
    const score = scoreFromResult(g.result as string | null);
    if (score === null || !g.ended_at) continue;
    events.push({ at: g.ended_at, kind: 'game', opponent: getLevelElo((g.rookie_difficulty as number) ?? 1), score });
  }

  return estimateElo(events);
}

async function alreadySent(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from('email_log')
    .select('id')
    .eq('user_id', userId)
    .eq('email_type', EMAIL_TYPE)
    // 'sent' = Resend accepted it, 'delivered' = it landed. Both mean this
    // person already got it; matching only 'sent' re-mails everyone once
    // scripts/sync-email-bounces.ts promotes their row to 'delivered'.
    .in('status', ['sent', 'delivered'])
    .limit(1);
  return !!(data && data.length > 0);
}

async function main() {
  const args = process.argv.slice(2);
  const send = args.includes('--send');
  const only = args.find((a) => a.startsWith('--only='))?.split('=')[1];

  const supabase = createServiceClient();
  const appUrl = getAppUrl();

  let query = supabase
    .from('profiles')
    .select('id, email, display_name')
    .not('email', 'is', null);
  if (only) query = query.eq('email', only);

  const { data: profiles, error } = await query;
  if (error) {
    console.error('Failed to load profiles:', error.message);
    process.exit(1);
  }

  console.log(`${send ? 'SENDING' : 'DRY RUN'} — ${profiles?.length ?? 0} profile(s) to consider\n`);

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const p of profiles ?? []) {
    const email = p.email as string;
    const displayName = (p.display_name as string) || undefined;

    if (await alreadySent(supabase, p.id as string)) {
      skipped++;
      continue;
    }

    const est = await ratingForUser(supabase, p.id as string);
    if (est.events < MIN_EVENTS) {
      skipped++;
      continue;
    }

    if (!send) {
      console.log(`  would email ${email.padEnd(34)} rating ${est.current}  (${est.events} events)`);
      sent++;
      continue;
    }

    const res = await sendEmail({
      to: email,
      userId: p.id as string,
      type: EMAIL_TYPE,
      subject: `I worked out your chess rating. It's ${est.current}.`,
      react: RatingReveal({
        displayName,
        rating: est.current,
        series: est.series,
        appUrl,
        unsubscribeUrl: getUnsubscribeUrl(p.id as string, EMAIL_TYPE),
      }),
      metadata: { rating: est.current, events: est.events },
    });

    if (res.success) {
      sent++;
      console.log(`  sent ${email.padEnd(34)} rating ${est.current}`);
    } else if (res.error?.includes('opted out')) {
      skipped++;
    } else {
      failed++;
      console.log(`  FAILED ${email}: ${res.error}`);
    }

    // Gentle rate limit (Resend allows bursts, but be polite).
    await new Promise((r) => setTimeout(r, 120));
  }

  console.log(`\n${send ? 'Sent' : 'Would send'}: ${sent}   Skipped: ${skipped}   Failed: ${failed}`);
  if (!send) console.log('\nRe-run with --send to actually send.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
