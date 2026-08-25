/**
 * Audit every handle already in the database against the CURRENT filter.
 *
 * Why this exists: the filter (lib/username/validate.ts) only runs on write.
 * Handles claimed before a rule existed keep sitting on the public
 * leaderboard — that's how `fattass` and `assguy` were live on 2026-08-25,
 * hours after the filter shipped. Every time you tighten the rules, run this.
 *
 *   npx tsx scripts/audit-usernames.ts          # report only
 *   npx tsx scripts/audit-usernames.ts --fix    # null out the failures
 *
 * `--fix` sets username to NULL rather than deleting anything: the account,
 * its history and its scores are untouched, it just leaves the leaderboards
 * until the person picks a new name. Nulling is reversible; deleting is not.
 */

import * as dotenv from 'dotenv';
import { validateUsername } from '../lib/username/validate';

dotenv.config({ path: '.env.local' });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
};

interface Row {
  id: string;
  username: string;
  email: string | null;
}

async function main() {
  const fix = process.argv.includes('--fix');

  const res = await fetch(
    `${URL}/rest/v1/profiles?select=id,username,email&username=not.is.null`,
    { headers },
  );
  if (!res.ok) {
    console.error(`Fetch failed: ${res.status} ${await res.text()}`);
    process.exit(1);
  }

  const rows: Row[] = await res.json();
  const bad = rows
    .map((r) => ({ row: r, check: validateUsername(r.username) }))
    .filter((x) => !x.check.ok);

  console.log(`Checked ${rows.length} handles.`);

  if (bad.length === 0) {
    console.log('All pass the current filter.');
    return;
  }

  console.log(`\n${bad.length} fail:\n`);
  for (const { row, check } of bad) {
    const reason = check.ok ? '' : check.problem;
    console.log(`  ${row.username.padEnd(22)} ${(row.email ?? '—').padEnd(30)} ${reason}`);
  }

  if (!fix) {
    console.log('\nRe-run with --fix to null these out.');
    process.exit(1);
  }

  console.log('\nNulling...');
  for (const { row } of bad) {
    const r = await fetch(`${URL}/rest/v1/profiles?id=eq.${row.id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ username: null }),
    });
    console.log(`  ${row.username}: ${r.ok ? 'cleared' : `FAILED ${r.status}`}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
