#!/usr/bin/env npx tsx
/**
 * Analyze Instagram traffic bounce behavior for a given day.
 * Usage: npx tsx scripts/insta-bounce-analysis.ts [--date=2026-04-13]
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

const PH_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY!;
const PH_PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '296329';

const dateArg = process.argv.find(a => a.startsWith('--date='))?.split('=')[1];
function getTargetDate(): string {
  if (dateArg) return dateArg;
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
const targetDate = getTargetDate();

interface QResult { results: unknown[][]; columns: string[] }

async function hogql(query: string, label?: string): Promise<QResult> {
  const res = await fetch(`https://us.posthog.com/api/projects/${PH_PROJECT_ID}/query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PH_API_KEY}` },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.warn(`  [${label || 'query'}] PostHog ${res.status}: ${t.slice(0, 200)}`);
    return { results: [], columns: [] };
  }
  return res.json();
}

function dayFilter(dateStr: string, days = 1) {
  const now = new Date();
  const target = new Date(`${dateStr}T00:00:00Z`);
  const daysAgo = Math.ceil((now.getTime() - target.getTime()) / 86400000);
  const daysAgoEnd = daysAgo - days;
  return `timestamp >= now() - interval ${daysAgo} day AND timestamp < now() - interval ${daysAgoEnd} day`;
}

const f = dayFilter(targetDate);
const num = (v: unknown) => Number(v ?? 0);
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  if (!PH_API_KEY) { console.error('Missing POSTHOG_PERSONAL_API_KEY'); process.exit(1); }

  console.log(`\n  Instagram Bounce Analysis — ${targetDate}\n`);
  console.log('  Fetching...\n');

  // 1. What events do Instagram users fire?
  const r1 = await hogql(`
    SELECT event, count() as cnt
    FROM events
    WHERE ${f}
      AND distinct_id IN (
        SELECT DISTINCT distinct_id FROM events
        WHERE ${f} AND properties."$referring_domain" = 'instagram.com'
      )
    GROUP BY event ORDER BY cnt DESC LIMIT 20
  `, 'insta-events');

  console.log('  Top events from Instagram users:');
  for (const row of r1.results) {
    console.log(`    ${String(row[0]).padEnd(40)} ${row[1]}`);
  }

  await wait(500);

  // 2. Session duration distribution
  const r2 = await hogql(`
    SELECT
      distinct_id,
      min(timestamp) as first_ev,
      max(timestamp) as last_ev,
      count() as evts
    FROM events
    WHERE ${f}
      AND distinct_id IN (
        SELECT DISTINCT distinct_id FROM events
        WHERE ${f} AND properties."$referring_domain" = 'instagram.com'
      )
    GROUP BY distinct_id
    ORDER BY evts DESC
    LIMIT 30
  `, 'insta-sessions');

  console.log('\n  Instagram user sessions (top 30 by event count):');
  let bouncers = 0;
  let engaged = 0;
  for (const row of r2.results) {
    const first = new Date(String(row[1]));
    const last = new Date(String(row[2]));
    const durSec = Math.round((last.getTime() - first.getTime()) / 1000);
    const evts = num(row[3]);
    if (evts <= 2) bouncers++;
    else engaged++;
    console.log(`    events=${String(evts).padStart(4)}  duration=${String(durSec).padStart(5)}s (${Math.round(durSec / 60)}min)`);
  }

  await wait(500);

  // 3. Engagement buckets
  const r3 = await hogql(`
    SELECT
      multiIf(
        evts = 1, '1 event (bounce)',
        evts = 2, '2 events',
        evts <= 5, '3-5 events',
        evts <= 10, '6-10 events',
        '10+ events'
      ) as bucket,
      count() as users
    FROM (
      SELECT distinct_id, count() as evts
      FROM events
      WHERE ${f}
        AND distinct_id IN (
          SELECT DISTINCT distinct_id FROM events
          WHERE ${f} AND properties."$referring_domain" = 'instagram.com'
        )
      GROUP BY distinct_id
    )
    GROUP BY bucket
    ORDER BY bucket
  `, 'insta-buckets');

  console.log('\n  Engagement buckets:');
  for (const row of r3.results) {
    console.log(`    ${String(row[0]).padEnd(20)} ${String(row[1]).padStart(4)} users`);
  }

  await wait(500);

  // 4. What pages do Instagram bouncers see (users with <=2 events)?
  const r4 = await hogql(`
    SELECT properties."$pathname" as page, count() as views
    FROM events
    WHERE ${f}
      AND event = '$pageview'
      AND distinct_id IN (
        SELECT distinct_id
        FROM events
        WHERE ${f}
          AND distinct_id IN (
            SELECT DISTINCT distinct_id FROM events
            WHERE ${f} AND properties."$referring_domain" = 'instagram.com'
          )
        GROUP BY distinct_id
        HAVING count() <= 3
      )
    GROUP BY page ORDER BY views DESC LIMIT 10
  `, 'bouncer-pages');

  console.log('\n  Pages seen by bouncers (<=3 events):');
  for (const row of r4.results) {
    console.log(`    ${String(row[0]).padEnd(35)} ${row[1]} views`);
  }

  await wait(500);

  // 5. Onboarding funnel specifically for Instagram users
  const r5 = await hogql(`
    SELECT
      countIf(event = 'onboarding_started') as started,
      countIf(event = 'onboarding_completed') as completed,
      countIf(event = 'onboarding_route_selected') as route_selected,
      countIf(event = 'tutorial_started') as tut_started,
      countIf(event = 'tutorial_completed') as tut_completed,
      countIf(event = 'puzzle_attempted') as puzzles,
      countIf(event = 'signup_completed') as signups
    FROM events
    WHERE ${f}
      AND distinct_id IN (
        SELECT DISTINCT distinct_id FROM events
        WHERE ${f} AND properties."$referring_domain" = 'instagram.com'
      )
  `, 'insta-funnel');

  const frow = r5.results[0] || [0, 0, 0, 0, 0, 0, 0];
  console.log('\n  Instagram-only funnel:');
  console.log(`    Onboarding started:     ${frow[0]}`);
  console.log(`    Onboarding completed:   ${frow[1]}`);
  console.log(`    Route selected:         ${frow[2]}`);
  console.log(`    Tutorial started:       ${frow[3]}`);
  console.log(`    Tutorial completed:     ${frow[4]}`);
  console.log(`    Puzzles attempted:      ${frow[5]}`);
  console.log(`    Signups:                ${frow[6]}`);

  // 6. Compare with non-Instagram users
  await wait(500);
  const r6 = await hogql(`
    SELECT
      countIf(event = 'onboarding_started') as started,
      countIf(event = 'onboarding_completed') as completed,
      countIf(event = 'puzzle_attempted') as puzzles,
      countIf(event = 'signup_completed') as signups
    FROM events
    WHERE ${f}
      AND distinct_id NOT IN (
        SELECT DISTINCT distinct_id FROM events
        WHERE ${f} AND properties."$referring_domain" = 'instagram.com'
      )
  `, 'non-insta-funnel');

  const nrow = r6.results[0] || [0, 0, 0, 0];
  console.log('\n  Non-Instagram funnel (for comparison):');
  console.log(`    Onboarding started:     ${nrow[0]}`);
  console.log(`    Onboarding completed:   ${nrow[1]}`);
  console.log(`    Puzzles attempted:      ${nrow[2]}`);
  console.log(`    Signups:                ${nrow[3]}`);

  console.log('\n  Done.\n');
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
