/**
 * Reconciles email_log.status with what Resend actually did.
 *
 * sendEmail() writes 'sent' the moment Resend accepts a message. Delivery,
 * bounce and suppression all happen afterwards, and nothing wrote them back —
 * so the DB believed every address was fine while Resend knew otherwise. The
 * Chess Boxing launch send exposed 6 bounces recorded as 'sent'.
 *
 *   npx tsx scripts/sync-email-bounces.ts              # dry run, prints changes
 *   npx tsx scripts/sync-email-bounces.ts --write      # apply
 *   npx tsx scripts/sync-email-bounces.ts --write --all # re-check every row
 *
 * By default it only re-checks rows that are still 'sent' (a terminal
 * 'delivered' / 'bounced' will not change again). --all forces a full pass.
 *
 * The durable fix is a Resend webhook pointed at an endpoint that writes these
 * rows as the events arrive; this script is what keeps the data honest until
 * that exists, and is worth running after any broadcast.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const WRITE = process.argv.includes('--write');
const ALL = process.argv.includes('--all');

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * email_log.status is CHECK'd to ('sent','delivered','bounced','failed'), so
 * Resend's richer vocabulary has to be mapped down. Anything that means "this
 * mailbox will not accept mail" becomes 'bounced', which is what
 * lib/email/suppression.ts screens on.
 */
function mapEvent(event: string): 'sent' | 'delivered' | 'bounced' | 'failed' | null {
  switch (event) {
    case 'delivered':
    case 'opened':
    case 'clicked':
      return 'delivered';
    case 'bounced':
    case 'suppressed':
      return 'bounced';
    case 'complained':
      return 'failed'; // spam report — stop mailing, but not a dead mailbox
    case 'sent':
    case 'queued':
    case 'scheduled':
      return null; // not terminal yet
    default:
      return null;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');

  let q = sb.from('email_log').select('id,email_address,email_type,resend_id,status')
    .not('resend_id', 'is', null);
  if (!ALL) q = q.eq('status', 'sent');

  const { data: rows, error } = await q;
  if (error) throw new Error(`email_log read failed: ${error.message}`);

  console.log(`\n  Checking ${rows?.length ?? 0} row(s) against Resend${ALL ? ' (--all)' : ''}.\n`);

  const changes: { id: string; email: string; type: string; from: string; to: string }[] = [];
  let unchanged = 0;
  let unknown = 0;

  for (const r of rows ?? []) {
    const res = await fetch(`https://api.resend.com/emails/${r.resend_id}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      unknown++;
      await sleep(120);
      continue;
    }
    const body = (await res.json()) as { last_event?: string };
    const mapped = body.last_event ? mapEvent(body.last_event) : null;

    if (mapped && mapped !== r.status) {
      changes.push({
        id: r.id, email: r.email_address, type: r.email_type,
        from: r.status, to: mapped,
      });
    } else {
      unchanged++;
    }
    await sleep(120); // Resend allows ~2 req/sec
  }

  const dead = changes.filter((c) => c.to === 'bounced' || c.to === 'failed');

  for (const c of dead) {
    console.log(`  ${c.to.toUpperCase().padEnd(9)} ${c.email.padEnd(38)} ${c.type}`);
  }

  console.log(`\n  unchanged      : ${unchanged}`);
  console.log(`  now delivered  : ${changes.filter((c) => c.to === 'delivered').length}`);
  console.log(`  now dead       : ${dead.length}`);
  if (unknown) console.log(`  not found      : ${unknown} (older than Resend's retention)`);

  const addrs = new Set(dead.map((c) => c.email.toLowerCase()));
  console.log(`  distinct dead addresses: ${addrs.size}`);

  if (!WRITE) {
    console.log('\n  DRY RUN — nothing written. Pass --write to apply.\n');
    return;
  }

  let wrote = 0;
  for (const c of changes) {
    const { error: e } = await sb.from('email_log').update({ status: c.to }).eq('id', c.id);
    if (e) console.error(`  update failed for ${c.email}: ${e.message}`);
    else wrote++;
  }

  console.log(`\n  Wrote ${wrote} row(s). Those addresses are now screened out of every`);
  console.log('  broadcast and lifecycle send via lib/email/suppression.ts.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
