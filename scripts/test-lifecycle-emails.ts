/**
 * Lifecycle email pre-flight: report cohort sizes (blast radius) and send each
 * template to a test address. Read-only on the DB; sends only to the address you pass.
 *
 *   npx tsx scripts/test-lifecycle-emails.ts you@example.com
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { getResendClient, EMAIL_FROM } from '../lib/email/resend';
import { getAppUrl } from '../lib/email/send';
import { DripDay1 } from '../lib/email/templates/DripDay1';
import { DripDay3LeftOff } from '../lib/email/templates/DripDay3LeftOff';
import { DripDay7 } from '../lib/email/templates/DripDay7';
import { Winback } from '../lib/email/templates/Winback';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const today = new Date();
const startOfWindow = (daysAgo: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};
const dateStr = (daysAgo: number) => startOfWindow(daysAgo).split('T')[0];

async function cohortSizes() {
  // day3: last_activity_date exactly 3 days ago
  const day3 = await supabase.from('profiles').select('id', { count: 'exact', head: true })
    .not('email', 'is', null).eq('last_activity_date', dateStr(3));
  // day1: created 1-2 days ago
  const day1 = await supabase.from('profiles').select('id', { count: 'exact', head: true })
    .not('email', 'is', null).gte('created_at', startOfWindow(2)).lt('created_at', startOfWindow(1));
  // day7: created 7-8 days ago
  const day7 = await supabase.from('profiles').select('id', { count: 'exact', head: true })
    .not('email', 'is', null).gte('created_at', startOfWindow(8)).lt('created_at', startOfWindow(7));
  // winback: inactive 14+ days, account older than day7 window
  const winback = await supabase.from('profiles').select('id', { count: 'exact', head: true })
    .not('email', 'is', null).not('last_activity_date', 'is', null)
    .lte('last_activity_date', dateStr(14)).lt('created_at', startOfWindow(8));

  console.log('\n=== Cohort sizes RIGHT NOW (max recipients per run, before dedup/opt-out) ===');
  console.log(`  day1 (signed up 1-2d ago, not returned): ${day1.count ?? '?'}`);
  console.log(`  day3 (last active exactly 3d ago):        ${day3.count ?? '?'}  <- NOT gated, sends when cron runs`);
  console.log(`  day7 (signed up 7-8d ago):                ${day7.count ?? '?'}`);
  console.log(`  winback (inactive 14+ days):              ${winback.count ?? '?'}`);
}

async function testSends(to: string) {
  const resend = getResendClient();
  const appUrl = getAppUrl();
  const unsub = `${appUrl}/api/email/unsubscribe?test=1`;

  const emails = [
    { subject: '[TEST] Did You Forget About Me Already?', react: DripDay1({ displayName: 'Tyler', appUrl, unsubscribeUrl: unsub }) },
    { subject: '[TEST] You Made Rookie Cry!', react: DripDay3LeftOff({ displayName: 'Tyler', currentLevel: '', currentLesson: '', appUrl, unsubscribeUrl: unsub }) },
    { subject: '[TEST] One Week In — How Are We Doing?', react: DripDay7({ displayName: 'Tyler', appUrl, unsubscribeUrl: unsub, currentStreak: 3 }) },
    { subject: '[TEST] The Board’s Still Set Up', react: Winback({ displayName: 'Tyler', appUrl, unsubscribeUrl: unsub }) },
  ];

  console.log(`\n=== Sending ${emails.length} test emails to ${to} ===`);
  for (const e of emails) {
    const { data, error } = await resend.emails.send({ from: EMAIL_FROM, to, subject: e.subject, react: e.react });
    if (error) console.error(`  FAIL ${e.subject}:`, error);
    else console.log(`  sent ${e.subject} (id: ${data?.id})`);
  }
}

async function main() {
  const to = process.argv[2];
  if (!to) { console.error('Usage: npx tsx scripts/test-lifecycle-emails.ts you@example.com'); process.exit(1); }
  await cohortSizes();
  await testSends(to);
}

main().catch(e => { console.error(e); process.exit(1); });
