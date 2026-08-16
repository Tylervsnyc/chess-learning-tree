/**
 * Pull human playtest traces out of Supabase onto disk.
 *
 * Traces captured from the deployed app (phone browser, TestFlight) land in
 * the run_traces table; the rest of the playtest tooling — including
 * bots/t5-human.ts — reads JSON files out of data/run-playtest/human-traces/.
 * This bridges the two, so a session played on a phone feeds the same
 * analysis as one played on localhost.
 *
 *   npx tsx scripts/run-playtest/pull-traces.ts            # last 7 days
 *   npx tsx scripts/run-playtest/pull-traces.ts 2026-08-01 # since a date
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
 *   node --env-file=.env.local --import tsx scripts/run-playtest/pull-traces.ts
 */

import { createClient } from '@supabase/supabase-js';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const OUT_DIR = join(process.cwd(), 'data', 'run-playtest', 'human-traces');

function safe(part: string): string {
  return part.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.');
    console.error('Try: node --env-file=.env.local --import tsx scripts/run-playtest/pull-traces.ts');
    process.exit(1);
  }

  const since =
    process.argv[2] ??
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('run_traces')
    .select('id, run_id, run_date, level, outcome, payload, created_at')
    .gte('run_date', since)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Query failed:', error.message);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  let written = 0;
  let skipped = 0;
  for (const row of data ?? []) {
    const stamp = String(row.created_at).replace(/[:.]/g, '-');
    const name = `${safe(row.run_id)}-L${safe(String(row.level))}-${stamp}.json`;
    const path = join(OUT_DIR, name);
    // Traces are immutable, so a file that already exists is the same trace.
    if (existsSync(path)) {
      skipped++;
      continue;
    }
    writeFileSync(path, JSON.stringify(row.payload, null, 2), 'utf8');
    written++;
  }

  console.log(`since ${since}: ${written} written, ${skipped} already on disk -> ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
