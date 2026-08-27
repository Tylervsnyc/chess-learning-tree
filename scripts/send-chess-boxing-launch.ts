/**
 * Chess Boxing launch announcement — to every Chess Path user who hasn't
 * opted out of marketing email.
 *
 * SAFE BY DEFAULT. Does nothing but print the audience unless you pass --send.
 *
 *   npx tsx scripts/send-chess-boxing-launch.ts                      # dry run: who would get it
 *   npx tsx scripts/send-chess-boxing-launch.ts --preview            # write an .html preview to open in a browser
 *   npx tsx scripts/send-chess-boxing-launch.ts --test you@place.com # one real email to one address
 *   npx tsx scripts/send-chess-boxing-launch.ts --celebration        # the poster version instead
 *   npx tsx scripts/send-chess-boxing-launch.ts --send               # THE REAL THING
 *   npx tsx scripts/send-chess-boxing-launch.ts --send --limit 5     # the real thing, first 5 only
 *
 * Idempotent: anyone with a 'sent' row in email_log for this type is skipped,
 * so an interrupted run can just be re-run.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { render } from '@react-email/render';
import { writeFileSync } from 'fs';
import { ChessBoxingLaunch } from '../lib/email/templates/ChessBoxingLaunch';
import { BoxingLaunchParty } from '../lib/email/templates/BoxingLaunchParty';
import { sendEmail, getUnsubscribeUrl, getAppUrl, generateUnsubscribeToken } from '../lib/email/send';
import { getResendClient, EMAIL_FROM } from '../lib/email/resend';

/**
 * Two takes on the same moment. Pass --celebration for the poster version
 * (cb_launch_party); the default is the explainer (chess_boxing_launch).
 * SEND ONE OF THE TWO. Both are previewable at /test/email-preview.
 */
const VARIANTS = {
  explainer: {
    type: 'chess_boxing_launch' as const,
    subject: 'Chess Boxing is out. I got hit in the face.',
    render: ChessBoxingLaunch,
    label: 'the explainer',
  },
  celebration: {
    type: 'cb_launch_party' as const,
    subject: 'Chess Boxing App is LIVE in App Store!',
    render: BoxingLaunchParty,
    label: 'the celebration',
  },
};

const argv = process.argv.slice(2);
const has = (f: string) => argv.includes(f);
const val = (f: string) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

const VARIANT = has('--celebration') ? VARIANTS.celebration : VARIANTS.explainer;
const EMAIL_TYPE = VARIANT.type;
const SUBJECT = VARIANT.subject;
const Template = VARIANT.render;

const DO_SEND = has('--send');
const TEST_TO = val('--test');
const PREVIEW = has('--preview');
const LIMIT = val('--limit') ? parseInt(val('--limit')!, 10) : undefined;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * A first name we're willing to put in "Hey ___ --", or undefined to fall back
 * to a plain greeting. Most display_names here are auto-filled from the email
 * address, and "Hey Niklasokennedy --" is worse than no name at all.
 */
function firstName(displayName: string | null, email?: string): string | undefined {
  if (!displayName) return undefined;
  const raw = displayName.trim();

  // A long display_name that is just the email local-part is an auto-fill,
  // not a name ("niklasokennedy"). Short matches are real first names that
  // happen to also be the address ("tyler"), so leave those alone.
  const local = (email || '').split('@')[0].toLowerCase().replace(/[^a-z]/g, '');
  const flat = raw.toLowerCase().replace(/[^a-z]/g, '');
  if (local && flat === local && raw.length >= 10) return undefined;

  const n = raw.split(/\s+/)[0];
  if (!n) return undefined;
  if (n.length > 14 || n.length < 2) return undefined;
  if (!/^[A-Za-z][A-Za-z'’-]*$/.test(n)) return undefined; // no dots, digits, @

  return n.charAt(0).toUpperCase() + n.slice(1);
}

async function main() {
  const appUrl = getAppUrl();

  // ---- preview -----------------------------------------------------------
  if (PREVIEW) {
    const html = await render(
      Template({
        displayName: 'Tyler',
        appUrl,
        unsubscribeUrl: `${appUrl}/api/email/unsubscribe?preview=1`,
      })
    );
    const out = `chess-boxing-${has('--celebration') ? 'celebration' : 'explainer'}-preview.html`;
    writeFileSync(out, html);
    console.log(`Preview written to ${out}`);
    console.log(`Subject: ${SUBJECT}`);
    return;
  }

  // ---- single test send --------------------------------------------------
  if (TEST_TO) {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: TEST_TO,
      subject: `[TEST] ${SUBJECT}`,
      react: Template({
        displayName: 'Tyler',
        appUrl,
        unsubscribeUrl: `${appUrl}/api/email/unsubscribe?test=1`,
      }),
    });
    if (error) {
      console.error('Failed to send:', error);
      process.exit(1);
    }
    console.log(`Test email sent to ${TEST_TO} (id: ${data?.id})`);
    return;
  }

  // ---- build the audience ------------------------------------------------
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profiles, error: pErr } = await sb
    .from('profiles')
    .select('id, email, display_name, created_at')
    .not('email', 'is', null)
    .order('created_at', { ascending: true });
  if (pErr) throw pErr;

  const { data: prefs } = await sb
    .from('email_preferences')
    .select('user_id, marketing, unsubscribed_all');
  const prefBy = new Map((prefs || []).map((p: any) => [p.user_id, p]));

  const { data: already } = await sb
    .from('email_log')
    .select('user_id')
    .eq('email_type', EMAIL_TYPE)
    .eq('status', 'sent');
  const sentTo = new Set((already || []).map((r: any) => r.user_id));

  const optedOut: string[] = [];
  const skipped: string[] = [];
  const recipients = (profiles as any[]).filter((p) => {
    const pr: any = prefBy.get(p.id);
    if (pr && (pr.unsubscribed_all || pr.marketing === false)) {
      optedOut.push(p.email);
      return false;
    }
    if (sentTo.has(p.id)) {
      skipped.push(p.email);
      return false;
    }
    return true;
  });

  const targets = LIMIT ? recipients.slice(0, LIMIT) : recipients;

  console.log('');
  console.log(`  Chess Boxing launch (${VARIANT.label}) — "${SUBJECT}"`);
  console.log(`  ${'-'.repeat(58)}`);
  console.log(`  profiles with an email : ${profiles!.length}`);
  console.log(`  opted out of marketing : ${optedOut.length}`);
  console.log(`  already sent this email: ${skipped.length}`);
  console.log(`  WILL RECEIVE           : ${targets.length}`);
  console.log(`  ${'-'.repeat(58)}`);

  if (!DO_SEND) {
    console.log('');
    console.log('  DRY RUN — nothing was sent. Pass --send to actually send.');
    console.log('');
    for (const r of targets.slice(0, 10)) {
      console.log(`    ${r.email.padEnd(36)} ${firstName(r.display_name, r.email) ?? '(no name)'}`);
    }
    if (targets.length > 10) console.log(`    ... and ${targets.length - 10} more`);
    console.log('');
    return;
  }

  // ---- the real send -----------------------------------------------------
  console.log('');
  console.log('  SENDING FOR REAL in 5 seconds — ctrl-C to abort.');
  await sleep(5000);

  let ok = 0;
  let failed = 0;
  for (const [i, r] of targets.entries()) {
    const unsubscribeUrl = getUnsubscribeUrl(r.id, EMAIL_TYPE);
    const result = await sendEmail({
      to: r.email,
      userId: r.id,
      type: EMAIL_TYPE,
      subject: SUBJECT,
      react: Template({
        displayName: firstName(r.display_name, r.email),
        appUrl,
        unsubscribeUrl,
      }),
      metadata: { campaign: 'chess_boxing_launch' },
    });

    if (result.success) {
      ok++;
      console.log(`  [${i + 1}/${targets.length}] sent    ${r.email}`);
    } else {
      failed++;
      console.log(`  [${i + 1}/${targets.length}] FAILED  ${r.email} — ${result.error}`);
    }
    await sleep(600); // Resend allows 2/sec; stay well under
  }

  console.log('');
  console.log(`  Done. sent: ${ok}   failed: ${failed}`);
  console.log('');
}

// keep the unused import honest — token helper is exported for ad-hoc checks
void generateUnsubscribeToken;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
