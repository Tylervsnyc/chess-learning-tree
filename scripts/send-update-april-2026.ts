/**
 * Send the April 2026 update email (Play Rookie launch) to all users who haven't
 * already received it. Respects marketing preference.
 *
 * Usage:
 *   npx tsx scripts/send-update-april-2026.ts           # dry-run (default)
 *   npx tsx scripts/send-update-april-2026.ts --send     # actually send
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '../lib/email/send';
import { UpdateApril2026 } from '../lib/email/templates/UpdateApril2026';

const DRY_RUN = !process.argv.includes('--send');
const BATCH_DELAY_MS = 500;
const SUBJECT = "You can finally play me. (I'm nervous.)";

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const appUrl = getAppUrl();

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
    .eq('email_type', 'update_april_2026')
    .eq('status', 'sent');

  const alreadySent = new Set((sentLogs ?? []).map((l) => l.user_id));

  const eligible = (users ?? []).filter(
    (u) => u.email && !alreadySent.has(u.id)
  );

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
    console.log(`\nDry run complete. ${eligible.length} users would receive the email (pending marketing preference check at send time). Run with --send to actually send.`);
    return;
  }

  let sent = 0;
  let failed = 0;
  let optedOut = 0;

  for (const user of eligible) {
    const displayName = user.display_name ?? undefined;
    const unsubscribeUrl = getUnsubscribeUrl(user.id, 'update_april_2026');

    const result = await sendEmail({
      to: user.email,
      userId: user.id,
      type: 'update_april_2026',
      subject: SUBJECT,
      react: UpdateApril2026({ displayName, appUrl, unsubscribeUrl }),
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
