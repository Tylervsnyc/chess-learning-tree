/**
 * Send the "streak science" broadcast (Showing up beats talent) to all users
 * who haven't already received it. Respects marketing preference + unsubscribe.
 *
 * Usage:
 *   npx tsx scripts/send-streak-science.ts                  # dry-run (default)
 *   npx tsx scripts/send-streak-science.ts --test=you@x.com # send ONE test
 *   npx tsx scripts/send-streak-science.ts --send           # live to everyone
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '../lib/email/send';
import { StreakScience } from '../lib/email/templates/StreakScience';

const TEST_ARG = process.argv.find((a) => a.startsWith('--test='));
const TEST_EMAIL = TEST_ARG ? TEST_ARG.split('=')[1] : null;
const DRY_RUN = !process.argv.includes('--send') && !TEST_EMAIL;
const BATCH_DELAY_MS = 500;
const EMAIL_TYPE = 'streak_science' as const;
const SUBJECT = 'Introducing: Streaks, Showing Up Beats Talent';

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const appUrl = getAppUrl();

  // ── Test mode: send a single email to the given address (look up its user
  // so opt-out + unsubscribe link are real), then stop. ──────────────────────
  if (TEST_EMAIL) {
    const { data: u } = await supabase
      .from('profiles')
      .select('id, display_name, email')
      .eq('email', TEST_EMAIL)
      .single();

    const userId = u?.id;
    const displayName = u?.display_name ?? undefined;
    const unsubscribeUrl = userId
      ? getUnsubscribeUrl(userId, EMAIL_TYPE)
      : `${appUrl}/api/email/unsubscribe?preview=1`;

    console.log(`TEST SEND -> ${TEST_EMAIL} (${displayName ?? 'no name'}${userId ? '' : ', not a registered user'})`);
    const result = await sendEmail({
      to: TEST_EMAIL,
      userId,
      type: EMAIL_TYPE,
      subject: SUBJECT,
      react: StreakScience({ displayName, appUrl, unsubscribeUrl }),
      metadata: { test: true },
    });
    console.log(result.success ? `[OK] sent, id=${result.id}` : `[FAIL] ${result.error}`);
    return;
  }

  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, display_name, email');

  if (usersError) {
    console.error('Failed to fetch users:', usersError);
    process.exit(1);
  }

  const { data: sentLogs } = await supabase
    .from('email_log')
    .select('user_id')
    .eq('email_type', EMAIL_TYPE)
    .eq('status', 'sent');

  const alreadySent = new Set((sentLogs ?? []).map((l) => l.user_id));
  const eligible = (users ?? []).filter((u) => u.email && !alreadySent.has(u.id));

  console.log(`Total users: ${users?.length ?? 0}`);
  console.log(`Already sent: ${alreadySent.size}`);
  console.log(`Eligible (before preference check): ${eligible.length}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE SEND'}`);
  console.log(`Subject: ${SUBJECT}`);
  console.log('---');

  if (DRY_RUN) {
    for (const user of eligible) {
      console.log(`[DRY] Would attempt: ${user.email} (${user.display_name ?? 'no name'})`);
    }
    console.log(`\nDry run complete. ${eligible.length} users would receive it (pending marketing-preference check at send time). Run with --send to send for real.`);
    return;
  }

  let sent = 0;
  let failed = 0;
  let optedOut = 0;

  for (const user of eligible) {
    const displayName = user.display_name ?? undefined;
    const unsubscribeUrl = getUnsubscribeUrl(user.id, EMAIL_TYPE);

    const result = await sendEmail({
      to: user.email,
      userId: user.id,
      type: EMAIL_TYPE,
      subject: SUBJECT,
      react: StreakScience({ displayName, appUrl, unsubscribeUrl }),
    });

    if (result.success) {
      sent++;
      console.log(`[OK] ${user.email}`);
    } else if (result.error?.includes('opted out')) {
      optedOut++;
      console.log(`[SKIP] ${user.email}: opted out`);
    } else {
      failed++;
      console.log(`[FAIL] ${user.email}: ${result.error}`);
    }

    await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
  }

  console.log(`\nDone! Sent: ${sent}, Opted out: ${optedOut}, Failed: ${failed}`);
}

main().catch(console.error);
