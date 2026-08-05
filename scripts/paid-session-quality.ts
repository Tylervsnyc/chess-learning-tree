#!/usr/bin/env npx tsx
/**
 * Diagnose paid-IG traffic QUALITY, not just funnel position.
 *
 * The question this answers: when a paid IG click lands and bounces, do they
 * bounce INSTANTLY (<3s = junk traffic / accidental taps — no landing page can
 * save it) or do they LINGER then leave (10s+ = real intent, the PAGE is failing
 * to hook them — iterate the landing)?
 *
 * Per-person session = first..last event timestamp on their landing visit.
 *
 * Usage: npx tsx scripts/paid-session-quality.ts [--days=7]
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

const PH_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY!;
const PH_PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '296329';

const daysArg = process.argv.slice(2).find(a => a.startsWith('--days='))?.split('=')[1];
const days = daysArg ? parseInt(daysArg, 10) : 7;

async function hogql(query: string): Promise<{ results: unknown[][]; columns: string[] }> {
  const res = await fetch(`https://us.posthog.com/api/projects/${PH_PROJECT_ID}/query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PH_API_KEY}` },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  if (!res.ok) throw new Error(`PostHog ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

const PAID = `(person.properties.$initial_utm_source = 'instagram' AND person.properties.$initial_utm_medium = 'paid')`;
const IG_ORGANIC = `(person.properties.$initial_utm_source = 'instagram' AND (person.properties.$initial_utm_medium != 'paid' OR isNull(person.properties.$initial_utm_medium)))`;

async function profile(label: string, predicate: string) {
  // Per person: session span (sec), event count, pageview count, did they fire any
  // engagement event (board touch / move / activity).
  const q = await hogql(`
    WITH per_person AS (
      SELECT
        person_id,
        dateDiff('second', min(timestamp), max(timestamp)) AS span_sec,
        count() AS events,
        countIf(event = '$pageview') AS pageviews,
        countIf(event IN ('board_touched','piece_moved','move_made','square_clicked','workout_started','lesson_started','puzzle_attempt','game_started','path_selected')) AS engaged_events
      FROM events
      WHERE timestamp > now() - interval ${days} day AND ${predicate}
      GROUP BY person_id
    )
    SELECT
      count() AS people,
      countIf(span_sec < 3) AS instant_bounce,
      countIf(span_sec >= 3 AND span_sec < 10) AS quick,
      countIf(span_sec >= 10 AND span_sec < 30) AS lingered,
      countIf(span_sec >= 30) AS engaged_time,
      countIf(engaged_events > 0) AS did_something,
      round(median(span_sec)) AS median_sec,
      round(avg(span_sec)) AS avg_sec
    FROM per_person
  `);
  const r = q.results[0] || [];
  const n = Number(r[0] ?? 0);
  const pct = (x: number) => (n ? Math.round((x / n) * 100) : 0);
  const [instant, quick, ling, eng, did, med, avg] = r.slice(1).map(Number);

  console.log(`\n  ${label}  (last ${days}d)`);
  console.log(`  ${'─'.repeat(58)}`);
  console.log(`  People landed:            ${n}`);
  console.log(`  Instant bounce (<3s):     ${instant}  (${pct(instant)}%)   <- junk-traffic signal`);
  console.log(`  Quick leave (3-10s):      ${quick}  (${pct(quick)}%)`);
  console.log(`  Lingered (10-30s):        ${ling}  (${pct(ling)}%)`);
  console.log(`  Engaged time (30s+):      ${eng}  (${pct(eng)}%)`);
  console.log(`  Did SOMETHING (board/move/activity): ${did}  (${pct(did)}%)`);
  console.log(`  Median session:           ${med}s    ·    Avg: ${avg}s`);
}

async function main() {
  console.log(`\n  PAID IG TRAFFIC QUALITY DIAGNOSTIC`);
  console.log(`  If most paid clicks bounce <3s -> junk traffic, switch targeting/channel.`);
  console.log(`  If they linger 10s+ then leave -> the PAGE is failing, iterate landing.`);
  await profile('PAID IG  (utm_medium=paid)', PAID);
  await profile('ORGANIC IG  (baseline for comparison)', IG_ORGANIC);
  console.log('');
}

main().catch(e => { console.error(e); process.exit(1); });
