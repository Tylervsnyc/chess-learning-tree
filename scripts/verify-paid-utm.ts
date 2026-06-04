#!/usr/bin/env npx tsx
/**
 * Verify the paid-IG ad link is tracking BEFORE spending money on it.
 *
 * Why: the daily report's PAID IG funnel keys on PostHog first-touch person
 * properties `$initial_utm_source = 'instagram'` AND `$initial_utm_medium = 'paid'`.
 * Those `$initial_*` props are frozen on a person's FIRST-EVER visit and never
 * overwritten — so you must click the test link from a FRESH identity
 * (incognito window, or a device that's never visited chesspath.app), or this
 * will show nothing even when the ad URL is correct.
 *
 * Flow:
 *   1. Open this link in an INCOGNITO window:
 *      https://chesspath.app/?utm_source=instagram&utm_medium=paid&utm_campaign=ad2
 *   2. Run: npx tsx scripts/verify-paid-utm.ts
 *   3. If it finds your hit, the pipeline works end-to-end — launch the ad.
 *
 * Usage:
 *   npx tsx scripts/verify-paid-utm.ts            # look back 2 hours (default)
 *   npx tsx scripts/verify-paid-utm.ts --hours=6  # widen the window
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const PH_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY!;
const PH_PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '296329';

const hoursArg = process.argv.slice(2).find(a => a.startsWith('--hours='))?.split('=')[1];
const hours = hoursArg ? parseInt(hoursArg, 10) : 2;

interface QResult { results: unknown[][]; columns: string[] }

async function hogql(query: string): Promise<QResult> {
  const res = await fetch(`https://us.posthog.com/api/projects/${PH_PROJECT_ID}/query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PH_API_KEY}` },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PostHog ${res.status}: ${t.slice(0, 200)}`);
  }
  return res.json();
}

async function main() {
  console.log(`\n  Verifying paid-IG tracking — last ${hours}h\n`);

  // Exactly the predicate the daily report uses for the PAID IG funnel.
  const PAID = `(
    person.properties.$initial_utm_source = 'instagram'
    AND person.properties.$initial_utm_medium = 'paid'
  )`;

  // 1) Did ANY person with the frozen paid-IG first-touch fire events recently?
  const paid = await hogql(`
    SELECT
      uniq(person_id) as people,
      count() as events,
      max(timestamp) as last_seen,
      any(person.properties.$initial_utm_campaign) as campaign,
      any(person.properties.$initial_referring_domain) as ref
    FROM events
    WHERE timestamp > now() - interval ${hours} hour AND ${PAID}
  `);
  const p = paid.results[0] || [0, 0, null, null, null];
  const people = Number(p[0] ?? 0);

  if (people > 0) {
    console.log('  PASS — paid-IG tracking works end-to-end.');
    console.log(`    people:        ${people}`);
    console.log(`    events:        ${Number(p[1] ?? 0)}`);
    console.log(`    last seen:     ${p[2] ?? '?'}`);
    console.log(`    utm_campaign:  ${p[3] ?? '(none)'}`);
    console.log(`    referrer:      ${p[4] ?? '(none)'}`);
    console.log(`\n  This is exactly what the daily report's PAID IG funnel counts. Safe to launch.\n`);
    return;
  }

  console.log('  No paid-IG person found yet. Diagnosing why...\n');

  // 2) Did the raw utm params land on ANY pageview at all (per-event, not frozen)?
  //    This separates "URL is wrong" from "you tested as a known person".
  const raw = await hogql(`
    SELECT
      countIf(properties.$current_url ILIKE '%utm_medium=paid%') as url_has_paid,
      countIf(properties.utm_medium = 'paid') as ev_utm_paid,
      countIf(properties.utm_source = 'instagram') as ev_utm_ig,
      count() as pageviews
    FROM events
    WHERE timestamp > now() - interval ${hours} hour AND event = '$pageview'
  `);
  const rr = raw.results[0] || [0, 0, 0, 0];
  console.log('  Raw pageviews this window (per-event, not first-touch):');
  console.log(`    total pageviews:            ${Number(rr[3] ?? 0)}`);
  console.log(`    URL contained utm_medium=paid: ${Number(rr[0] ?? 0)}`);
  console.log(`    event utm_medium=paid:         ${Number(rr[1] ?? 0)}`);
  console.log(`    event utm_source=instagram:    ${Number(rr[2] ?? 0)}`);

  const urlHadPaid = Number(rr[0] ?? 0) > 0;
  console.log('');
  if (urlHadPaid) {
    console.log('  DIAGNOSIS: the paid UTM landed on a pageview, but no NEW person carries it');
    console.log('  as a first-touch property. Almost certainly you clicked as a KNOWN person');
    console.log('  (your $initial_* props are frozen from an earlier visit).');
    console.log('  → Re-test in a fresh incognito window / a device that never visited the site.');
  } else {
    console.log('  DIAGNOSIS: no pageview in this window carried utm_medium=paid at all.');
    console.log('  Either the click has not landed yet, or the ad URL is missing the params.');
    console.log('  → Confirm you opened the link with ?utm_source=instagram&utm_medium=paid');
    console.log('    and that PostHog is loading on that pageview, then widen with --hours=6.');
  }
  console.log('');
}

main().catch(e => { console.error(e); process.exit(1); });
