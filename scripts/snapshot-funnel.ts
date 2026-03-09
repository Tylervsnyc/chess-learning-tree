#!/usr/bin/env npx tsx
/**
 * Daily funnel snapshot script.
 * Queries PostHog for a single day's funnel metrics and upserts into Supabase.
 *
 * Usage:
 *   npx tsx scripts/snapshot-funnel.ts              # yesterday
 *   npx tsx scripts/snapshot-funnel.ts --date=2026-03-08
 *   npx tsx scripts/snapshot-funnel.ts --dry-run
 *   npx tsx scripts/snapshot-funnel.ts --date=2026-03-01 --dry-run
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const POSTHOG_API_BASE = 'https://us.posthog.com';
const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!POSTHOG_API_KEY) {
  console.error('Missing POSTHOG_PERSONAL_API_KEY in .env.local');
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dateArg = args.find((a) => a.startsWith('--date='))?.split('=')[1];

function getTargetDate(): string {
  if (dateArg) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
      console.error('Invalid date format. Use YYYY-MM-DD.');
      process.exit(1);
    }
    return dateArg;
  }
  // Default: yesterday
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
}

const targetDate = getTargetDate();

// ---------------------------------------------------------------------------
// PostHog query helper
// ---------------------------------------------------------------------------

async function queryPostHog(hogql: string): Promise<{ results: unknown[][]; columns: string[] }> {
  const response = await fetch(`${POSTHOG_API_BASE}/api/projects/@current/query/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${POSTHOG_API_KEY}`,
    },
    body: JSON.stringify({
      query: { kind: 'HogQLQuery', query: hogql },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PostHog API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return { results: data.results || [], columns: data.columns || [] };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Date math — use now() - interval N day for ClickHouse partition pruning
// ---------------------------------------------------------------------------

function getDaysAgo(dateStr: string): { daysAgo: number; daysAgoEnd: number } {
  const now = new Date();
  const target = new Date(`${dateStr}T00:00:00Z`);
  const daysAgo = Math.ceil((now.getTime() - target.getTime()) / 86400000);
  const daysAgoEnd = daysAgo - 1;
  return { daysAgo, daysAgoEnd };
}

// ---------------------------------------------------------------------------
// Query builders
// ---------------------------------------------------------------------------

type QueryDef = { key: string; hogql: string };

function buildDailyQueries(dateStr: string): QueryDef[] {
  const { daysAgo, daysAgoEnd } = getDaysAgo(dateStr);
  const dateFilter = `timestamp >= now() - interval ${daysAgo} day AND timestamp < now() - interval ${daysAgoEnd} day`;

  return [
    {
      key: 'landing_page',
      hogql: `SELECT countDistinct(distinct_id) FROM events WHERE event = '$pageview' AND properties.$pathname = '/' AND ${dateFilter}`,
    },
    {
      key: 'tutorial_started',
      hogql: `SELECT countDistinct(distinct_id) FROM events WHERE event = 'tutorial_started' AND ${dateFilter}`,
    },
    {
      key: 'tutorial_completed',
      hogql: `SELECT countDistinct(distinct_id) FROM events WHERE event = 'tutorial_completed' AND ${dateFilter}`,
    },
    {
      key: 'signup_page',
      hogql: `SELECT countDistinct(distinct_id) FROM events WHERE event = 'signup_page_viewed' AND ${dateFilter}`,
    },
    {
      key: 'signed_up',
      hogql: `SELECT countDistinct(distinct_id) FROM events WHERE event = 'signup_completed' AND ${dateFilter}`,
    },
    {
      key: 'onboarding_completed',
      hogql: `SELECT countDistinct(distinct_id) FROM events WHERE event = 'onboarding_completed' AND ${dateFilter}`,
    },
    {
      key: 'first_lesson',
      hogql: `SELECT countDistinct(distinct_id) FROM events WHERE event = 'lesson_started' AND ${dateFilter}`,
    },
    {
      key: 'lesson_completed',
      hogql: `SELECT countDistinct(distinct_id) FROM events WHERE event = 'lesson_completed' AND ${dateFilter}`,
    },
    {
      key: 'daily_active_users',
      hogql: `SELECT countDistinct(distinct_id) FROM events WHERE ${dateFilter}`,
    },
    {
      key: 'paywall_viewed',
      hogql: `SELECT countDistinct(distinct_id) FROM events WHERE event = 'paywall_viewed' AND ${dateFilter}`,
    },
    {
      key: 'checkout_started',
      hogql: `SELECT countDistinct(distinct_id) FROM events WHERE event = 'checkout_started' AND ${dateFilter}`,
    },
    {
      key: 'premium_converted',
      hogql: `SELECT countDistinct(distinct_id) FROM events WHERE event = 'checkout_completed' AND ${dateFilter}`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Execute queries in batches of 3
// ---------------------------------------------------------------------------

async function runBatched(queries: QueryDef[]): Promise<Record<string, number>> {
  const results: Record<string, number> = {};
  const batchSize = 3;

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (q) => {
        const res = await queryPostHog(q.hogql);
        return { key: q.key, value: Number(res.results[0]?.[0] ?? 0) };
      })
    );
    for (const r of batchResults) {
      results[r.key] = r.value;
    }
    // Wait between batches (skip after last)
    if (i + batchSize < queries.length) {
      await sleep(500);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Snapshotting funnel for ${targetDate}${dryRun ? ' (DRY RUN)' : ''}`);

  // Build and run daily queries
  const dailyQueries = buildDailyQueries(targetDate);
  const dailyCounts = await runBatched(dailyQueries);

  // Query total users (all time) — separate batch
  await sleep(500);
  const totalResult = await queryPostHog(
    `SELECT countDistinct(distinct_id) FROM events`
  );
  const totalUsers = Number(totalResult.results[0]?.[0] ?? 0);

  const snapshot = {
    snapshot_date: targetDate,
    landing_page: dailyCounts.landing_page ?? 0,
    tutorial_started: dailyCounts.tutorial_started ?? 0,
    tutorial_completed: dailyCounts.tutorial_completed ?? 0,
    signup_page: dailyCounts.signup_page ?? 0,
    signed_up: dailyCounts.signed_up ?? 0,
    onboarding_completed: dailyCounts.onboarding_completed ?? 0,
    first_lesson: dailyCounts.first_lesson ?? 0,
    lesson_completed: dailyCounts.lesson_completed ?? 0,
    daily_active_users: dailyCounts.daily_active_users ?? 0,
    paywall_viewed: dailyCounts.paywall_viewed ?? 0,
    checkout_started: dailyCounts.checkout_started ?? 0,
    premium_converted: dailyCounts.premium_converted ?? 0,
    total_users: totalUsers,
  };

  console.log('\nSnapshot data:');
  console.table(snapshot);

  if (dryRun) {
    console.log('\nDry run — not writing to database.');
    return;
  }

  // Upsert into Supabase
  const { error } = await supabase
    .from('daily_funnel_snapshots')
    .upsert(snapshot, { onConflict: 'snapshot_date' });

  if (error) {
    console.error('Supabase upsert error:', error);
    process.exit(1);
  }

  console.log(`\nSaved snapshot for ${targetDate}.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
