/**
 * db-baseline.ts — READ-ONLY database reconciliation / baseline metrics.
 *
 * Purpose: reconcile PostHog analytics (reporting ~0 signups / ~4 visitors/day)
 * against the database, which is the source of truth.
 *
 * STRICTLY READ-ONLY: only SELECT / count queries. No writes of any kind.
 *
 * Run: npx tsx scripts/db-baseline.ts
 */
import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s+/g, '');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const sb: SupabaseClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------- helpers ----------
const DAY_MS = 24 * 60 * 60 * 1000;
const now = new Date();
const iso = (d: Date) => d.toISOString();
const dayKey = (d: Date | string) => new Date(d).toISOString().slice(0, 10);
const ago = (days: number) => new Date(now.getTime() - days * DAY_MS);

function hr(label: string) {
  console.log('\n' + '='.repeat(64));
  console.log(label);
  console.log('='.repeat(64));
}

/** Count rows in a table, optionally with a created_at >= cutoff filter. */
async function countRows(
  table: string,
  tsCol?: string,
  gte?: Date
): Promise<number | null> {
  let q = sb.from(table).select('*', { count: 'exact', head: true });
  if (tsCol && gte) q = q.gte(tsCol, iso(gte));
  const { count, error } = await q;
  if (error) {
    console.log(`  [skip] ${table}${tsCol ? ` (${tsCol})` : ''}: ${error.message}`);
    return null;
  }
  return count ?? 0;
}

// NOTE on schema discovery: PostgREST does NOT expose `information_schema` to
// the service-role client (confirmed 2026-05-30: "Invalid schema: information_schema").
// So we discover columns by sampling one row per table, and probe the known
// candidate activity tables below — any missing table/column is skipped + logged.

/**
 * Pull a per-day distinct-user count for the last `days` days from a table
 * that has a user_id column and a timestamp column.
 */
async function dailyActiveUsers(
  table: string,
  userCol: string,
  tsCol: string,
  days: number
): Promise<Map<string, Set<string>> | null> {
  const cutoff = ago(days);
  const { data, error } = await sb
    .from(table)
    .select(`${userCol}, ${tsCol}`)
    .gte(tsCol, iso(cutoff))
    .limit(100000);
  if (error) {
    console.log(`  [skip] ${table}: ${error.message}`);
    return null;
  }
  const byDay = new Map<string, Set<string>>();
  for (const row of data ?? []) {
    const ts = (row as Record<string, unknown>)[tsCol];
    const uid = (row as Record<string, unknown>)[userCol];
    if (!ts || !uid) continue;
    const k = dayKey(ts as string);
    if (!byDay.has(k)) byDay.set(k, new Set());
    byDay.get(k)!.add(String(uid));
  }
  return byDay;
}

/** Most recent timestamp in a table for a given column. */
async function mostRecent(table: string, tsCol: string): Promise<string | null> {
  const { data, error } = await sb
    .from(table)
    .select(tsCol)
    .order(tsCol, { ascending: false })
    .limit(1);
  if (error) {
    console.log(`  [skip] ${table}.${tsCol}: ${error.message}`);
    return null;
  }
  const v = data?.[0]?.[tsCol as keyof (typeof data)[0]];
  return v ? String(v) : null;
}

async function main() {
  console.log(`DB BASELINE — read-only recon`);
  console.log(`Run at: ${iso(now)}`);
  console.log(`Supabase host: ${supabaseUrl!.replace(/https?:\/\//, '').split('/')[0]}`);

  // ---------- 1. REGISTERED USERS (profiles) ----------
  hr('1. REGISTERED USERS (profiles)');
  const totalProfiles = await countRows('profiles');
  console.log(`  Total profiles:            ${totalProfiles ?? 'ERR'}`);
  for (const d of [7, 30, 60]) {
    const c = await countRows('profiles', 'created_at', ago(d));
    console.log(`  New in last ${String(d).padStart(2)} days:       ${c ?? 'ERR'}`);
  }
  const lastSignup = await mostRecent('profiles', 'created_at');
  console.log(`  Most recent signup:        ${lastSignup ?? 'none'}`);

  // Signups per WEEK for the last 12 weeks (table=profiles, column=created_at).
  // Week 0 = most recent 7 days. Pull the 84-day window once and bucket client-side.
  {
    const cutoff = ago(84);
    const { data, error } = await sb
      .from('profiles')
      .select('created_at')
      .gte('created_at', iso(cutoff))
      .order('created_at', { ascending: true })
      .limit(100000);
    if (error) {
      console.log(`  Weekly signup buckets: [skip] ${error.message}`);
    } else {
      const buckets = new Map<number, number>();
      for (const r of data ?? []) {
        const ts = (r as { created_at: string }).created_at;
        if (!ts) continue;
        const ageDays = (now.getTime() - new Date(ts).getTime()) / DAY_MS;
        const w = Math.floor(ageDays / 7);
        buckets.set(w, (buckets.get(w) ?? 0) + 1);
      }
      let max = 0;
      for (let w = 0; w < 12; w++) max = Math.max(max, buckets.get(w) ?? 0);
      console.log(`\n  Signups per week (week 0 = most recent 7 days):`);
      for (let w = 0; w < 12; w++) {
        const c = buckets.get(w) ?? 0;
        const start = dayKey(ago((w + 1) * 7));
        const end = dayKey(ago(w * 7));
        const bar = max ? '█'.repeat(Math.round((c / max) * 24)) : '';
        console.log(`    w-${String(w).padStart(2)} ${start}..${end}  ${String(c).padStart(4)}  ${bar}`);
      }
    }
  }

  // Cross-check against auth.users via the Admin API (source of truth for signups).
  try {
    const { data: au, error: auErr } = await sb.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (auErr) {
      console.log(`  auth.users (admin API):    [skip] ${auErr.message}`);
    } else {
      // listUsers doesn't return a total; page through to count + find newest.
      let page = 1;
      let total = 0;
      let newest: string | null = null;
      const recent: Record<number, number> = { 7: 0, 30: 0, 60: 0 };
      // guard the loop
      for (; page <= 200; page++) {
        const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
        if (error) break;
        const users = data?.users ?? [];
        if (users.length === 0) break;
        total += users.length;
        for (const u of users) {
          const created = u.created_at ? new Date(u.created_at) : null;
          if (created) {
            if (!newest || created > new Date(newest)) newest = u.created_at!;
            for (const d of [7, 30, 60]) if (created >= ago(d)) recent[d]++;
          }
        }
        if (users.length < 200) break;
      }
      void au;
      console.log(`  auth.users total:          ${total}`);
      console.log(`  auth.users new 7/30/60d:   ${recent[7]} / ${recent[30]} / ${recent[60]}`);
      console.log(`  auth.users newest signup:  ${newest ?? 'none'}`);
    }
  } catch (e) {
    console.log(`  auth.users (admin API):    [skip] ${(e as Error).message}`);
  }

  // ---------- 2. PREMIUM / PAYING ----------
  hr('2. PREMIUM / PAYING USERS (profiles.subscription_status)');
  try {
    const { data, error } = await sb
      .from('profiles')
      .select('subscription_status')
      .limit(100000);
    if (error) {
      console.log(`  [skip] ${error.message}`);
    } else {
      const counts = new Map<string, number>();
      for (const r of data ?? []) {
        const s = String((r as { subscription_status: unknown }).subscription_status ?? 'null');
        counts.set(s, (counts.get(s) ?? 0) + 1);
      }
      const paying = [...counts.entries()]
        .filter(([k]) => /premium|active|paid|trial|pro/i.test(k))
        .reduce((a, [, v]) => a + v, 0);
      console.log(`  Breakdown by subscription_status:`);
      for (const [k, v] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
        console.log(`    ${k.padEnd(20)} ${v}`);
      }
      console.log(`  Premium/paying-ish total:  ${paying}`);
    }
  } catch (e) {
    console.log(`  [skip] ${(e as Error).message}`);
  }
  // Optional revenue_snapshots (Stripe-derived)
  const lastRev = await mostRecent('revenue_snapshots', 'snapshot_date');
  if (lastRev) {
    const { data } = await sb
      .from('revenue_snapshots')
      .select('snapshot_date,total_subscribers,mrr_cents')
      .order('snapshot_date', { ascending: false })
      .limit(1);
    const r = data?.[0] as
      | { snapshot_date: string; total_subscribers: number; mrr_cents: number }
      | undefined;
    if (r)
      console.log(
        `  Latest revenue_snapshot:   ${r.snapshot_date} — subs=${r.total_subscribers}, mrr=$${(r.mrr_cents / 100).toFixed(2)}`
      );
  }

  // ---------- 3. ACTIVITY TABLE ROW COUNTS + RECENCY ----------
  // Candidate activity tables: (table, userCol, tsCol).
  // Column names VERIFIED against the live schema (2026-05-30):
  //   puzzle_attempts uses `attempted_at` (NOT created_at — RULES.md §23 is stale).
  //   level_test_attempts uses `attempted_at` (NOT created_at).
  //   lesson_progress: `started_at` captures activity even when a lesson isn't finished.
  //   run_completions: `completed_at` (table exists; see app/api/run/complete/route.ts).
  const activityTables: Array<{ t: string; u: string; ts: string }> = [
    { t: 'puzzle_attempts', u: 'user_id', ts: 'attempted_at' },
    { t: 'lesson_progress', u: 'user_id', ts: 'started_at' },
    { t: 'daily_challenge_results', u: 'user_id', ts: 'created_at' },
    { t: 'level_test_attempts', u: 'user_id', ts: 'attempted_at' },
    { t: 'run_completions', u: 'user_id', ts: 'completed_at' },
  ];

  hr('3. ACTIVITY TABLES — total rows, last-30d rows, most recent');
  const live: Array<{ t: string; u: string; ts: string }> = [];
  for (const a of activityTables) {
    const total = await countRows(a.t);
    if (total === null) continue; // table/col missing — skip silently-ish (logged)
    const last30 = await countRows(a.t, a.ts, ago(30));
    const recent = await mostRecent(a.t, a.ts);
    console.log(
      `  ${a.t.padEnd(24)} total=${String(total).padStart(6)}  last30d=${String(last30 ?? '?').padStart(5)}  newest=${recent ?? 'none'}`
    );
    live.push(a);
  }

  // ---------- 4. REAL DAU (last 30 days, union of live activity tables) ----------
  hr('4. REAL DAU — distinct active user_ids per day, last 30 days (UNION of activity tables)');
  console.log(`  Tables unioned: ${live.map((a) => `${a.t}(${a.ts})`).join(', ') || '(none)'}`);
  const unionByDay = new Map<string, Set<string>>();
  for (const a of live) {
    const byDay = await dailyActiveUsers(a.t, a.u, a.ts, 30);
    if (!byDay) continue;
    for (const [k, set] of byDay) {
      if (!unionByDay.has(k)) unionByDay.set(k, new Set());
      for (const uid of set) unionByDay.get(k)!.add(uid);
    }
  }
  // Print every day in the last 30 days, including zeros. Newest first.
  console.log('\n  date         DAU');
  let activeDays = 0;
  let peak = 0;
  let sum = 0;
  let maxDau = 0;
  for (let i = 0; i < 30; i++) maxDau = Math.max(maxDau, unionByDay.get(dayKey(ago(i)))?.size ?? 0);
  for (let i = 0; i < 30; i++) {
    const k = dayKey(ago(i));
    const n = unionByDay.get(k)?.size ?? 0;
    if (n > 0) activeDays++;
    if (n > peak) peak = n;
    sum += n;
    const bar = maxDau ? '█'.repeat(Math.round((n / maxDau) * 24)) : '';
    console.log(`  ${k}   ${String(n).padStart(4)}  ${bar}`);
  }
  console.log(`  ---`);
  console.log(`  30-day average DAU:        ${(sum / 30).toFixed(2)}   (sum of daily distinct=${sum} / 30 days)`);
  console.log(`  Active days (of 30):       ${activeDays}`);
  console.log(`  Peak single-day DAU:       ${peak}`);

  // True distinct users active over trailing windows (deduped across the window).
  for (const w of [7, 30]) {
    const set = new Set<string>();
    for (let i = 0; i < w; i++) for (const u of unionByDay.get(dayKey(ago(i))) ?? []) set.add(u);
    console.log(`  Distinct active users ${String(w).padStart(2)}d:  ${set.size}`);
  }

  // ---------- 5. MOST RECENT ACTIVITY OVERALL ----------
  hr('5. MOST RECENT ACTIVITY OVERALL (across all live activity tables)');
  let newestOverall: { table: string; ts: string } | null = null;
  for (const a of live) {
    const recent = await mostRecent(a.t, a.ts);
    if (recent && (!newestOverall || new Date(recent) > new Date(newestOverall.ts))) {
      newestOverall = { table: a.t, ts: recent };
    }
  }
  if (newestOverall) {
    const ageDays = ((now.getTime() - new Date(newestOverall.ts).getTime()) / DAY_MS).toFixed(1);
    console.log(`  Newest activity:           ${newestOverall.ts}  (${newestOverall.table})`);
    console.log(`  That was ~${ageDays} days ago.`);
  } else {
    console.log(`  No activity found in any table.`);
  }

  console.log('\nDone. (read-only; no writes performed)\n');
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
