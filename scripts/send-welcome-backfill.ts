/**
 * One-time backfill: send welcome email to all existing users who haven't received one.
 *
 * Usage:
 *   npx tsx scripts/send-welcome-backfill.ts           # dry-run (default)
 *   npx tsx scripts/send-welcome-backfill.ts --send     # actually send
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '../lib/email/send';
import { Welcome } from '../lib/email/templates/Welcome';

const DRY_RUN = !process.argv.includes('--send');
const BATCH_DELAY_MS = 500; // 500ms between sends to respect Resend rate limits

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const appUrl = getAppUrl();

  // Get all users with email
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, display_name, email');

  if (usersError) {
    console.error('Failed to fetch users:', usersError);
    process.exit(1);
  }

  // Get users who already received welcome email
  const { data: sentLogs } = await supabase
    .from('email_log')
    .select('user_id')
    .eq('email_type', 'welcome')
    .eq('status', 'sent');

  const alreadySent = new Set((sentLogs ?? []).map((l) => l.user_id));

  const eligible = (users ?? []).filter(
    (u) => u.email && !alreadySent.has(u.id)
  );

  console.log(`Total users: ${users?.length ?? 0}`);
  console.log(`Already sent: ${alreadySent.size}`);
  console.log(`Eligible: ${eligible.length}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE SEND'}`);
  console.log('---');

  if (DRY_RUN) {
    for (const user of eligible) {
      console.log(`[DRY] Would send to: ${user.email} (${user.display_name ?? 'no name'})`);
    }
    console.log(`\nDry run complete. Run with --send to actually send.`);
    return;
  }

  let sent = 0;
  let failed = 0;

  for (const user of eligible) {
    const displayName = user.display_name ?? 'Chess Player';
    const unsubscribeUrl = getUnsubscribeUrl(user.id);

    const result = await sendEmail({
      to: user.email,
      userId: user.id,
      type: 'welcome',
      subject: 'Welcome to Chess Path!',
      react: Welcome({ displayName, appUrl, unsubscribeUrl }),
    });

    if (result.success) {
      sent++;
      console.log(`[OK] ${user.email}`);
    } else {
      failed++;
      console.log(`[FAIL] ${user.email}: ${result.error}`);
    }

    // Rate limit delay
    await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
  }

  console.log(`\nDone! Sent: ${sent}, Failed: ${failed}`);
}

main().catch(console.error);
