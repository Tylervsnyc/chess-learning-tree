#!/usr/bin/env npx tsx
/**
 * Deep audit of /welcome bounces from Instagram traffic, weekend 2026-05-09 .. 2026-05-10.
 * Slices: device, viewport, browser, time-on-page distribution, exit pathing, button taps.
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

const KEY = process.env.POSTHOG_PERSONAL_API_KEY!;
const PID = process.env.POSTHOG_PROJECT_ID || '296329';

async function q(query: string, label: string) {
  const r = await fetch(`https://us.posthog.com/api/projects/${PID}/query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  if (!r.ok) { console.warn(`  [${label}] ${r.status}: ${(await r.text()).slice(0, 200)}`); return { results: [] as unknown[][] }; }
  return r.json() as Promise<{ results: unknown[][] }>;
}

const FILT = `timestamp >= toDateTime('2026-05-09 00:00:00') AND timestamp < toDateTime('2026-05-11 00:00:00')`;
const IG_USERS = `(SELECT DISTINCT distinct_id FROM events WHERE ${FILT} AND properties.$referring_domain = 'instagram.com')`;

async function main() {
  console.log('\n  /welcome deep audit — IG traffic 2026-05-09..10\n');

  // 1) Device + browser distribution of IG visitors
  const r1 = await q(`
    SELECT properties.$device_type, properties.$browser, count(DISTINCT distinct_id) as users
    FROM events
    WHERE ${FILT} AND distinct_id IN ${IG_USERS} AND event = '$pageview'
    GROUP BY 1, 2 ORDER BY users DESC LIMIT 20
  `, 'device-browser');
  console.log('  Device × Browser (unique IG users):');
  for (const row of r1.results) console.log(`    ${String(row[0]).padEnd(10)} ${String(row[1]).padEnd(20)} ${row[2]}`);

  // 2) Viewport sizes
  const r2 = await q(`
    SELECT properties.$viewport_width, properties.$viewport_height, count() as views
    FROM events
    WHERE ${FILT} AND distinct_id IN ${IG_USERS} AND event = '$pageview' AND properties.$pathname = '/welcome'
    GROUP BY 1, 2 ORDER BY views DESC LIMIT 10
  `, 'viewport');
  console.log('\n  Viewports of IG /welcome views:');
  for (const row of r2.results) console.log(`    ${String(row[0])}×${String(row[1])}  ${row[2]} views`);

  // 3) Time-to-bounce: time between $pageview on /welcome and last event for users with <=2 events
  const r3 = await q(`
    SELECT
      multiIf(
        diff_ms < 500, '<0.5s',
        diff_ms < 1000, '0.5-1s',
        diff_ms < 2000, '1-2s',
        diff_ms < 5000, '2-5s',
        diff_ms < 10000, '5-10s',
        '>10s'
      ) as bucket, count() as users
    FROM (
      SELECT distinct_id, dateDiff('millisecond', min(timestamp), max(timestamp)) as diff_ms, count() as ec
      FROM events
      WHERE ${FILT} AND distinct_id IN ${IG_USERS}
      GROUP BY distinct_id HAVING ec <= 3
    )
    GROUP BY bucket ORDER BY bucket
  `, 'bounce-timing');
  console.log('\n  Bounce timing (IG users with ≤3 events):');
  for (const row of r3.results) console.log(`    ${String(row[0]).padEnd(8)} ${row[1]} users`);

  // 4) Did bouncers ever fire ANY click event (autocapture / button)?
  const r4 = await q(`
    SELECT
      countIf(event = '$autocapture') as autocaptures,
      countIf(event = 'onboarding_route_selected') as routes,
      countIf(event = 'play_button_click') as plays,
      count(DISTINCT distinct_id) as bouncers
    FROM events
    WHERE ${FILT}
      AND distinct_id IN (
        SELECT distinct_id FROM events WHERE ${FILT} AND distinct_id IN ${IG_USERS}
        GROUP BY distinct_id HAVING count() <= 3
      )
  `, 'bouncer-clicks');
  const fr = r4.results[0] || [0,0,0,0];
  console.log('\n  Did bouncers click ANYTHING?');
  console.log(`    Autocaptured clicks among bouncers: ${fr[0]}`);
  console.log(`    Route selections:                   ${fr[1]}`);
  console.log(`    Bouncer count:                      ${fr[3]}`);

  // 5) Funnel by device_type
  const r5 = await q(`
    SELECT properties.$device_type as dev,
      count(DISTINCT distinct_id) as users,
      countIf(event = 'onboarding_started') as starts,
      countIf(event = 'onboarding_route_selected') as routes
    FROM events
    WHERE ${FILT} AND distinct_id IN ${IG_USERS}
    GROUP BY dev ORDER BY users DESC
  `, 'funnel-by-device');
  console.log('\n  Funnel by device_type:');
  for (const row of r5.results) console.log(`    ${String(row[0]).padEnd(10)} users=${row[1]}  starts=${row[2]}  routes=${row[3]}`);

  // 6) UTM / campaign breakdown so we know what the ad promised
  const r6 = await q(`
    SELECT properties.utm_source, properties.utm_medium, properties.utm_campaign, properties.utm_content, count() as views
    FROM events
    WHERE ${FILT} AND distinct_id IN ${IG_USERS} AND event = '$pageview' AND properties.$pathname = '/welcome'
    GROUP BY 1,2,3,4 ORDER BY views DESC LIMIT 10
  `, 'utm');
  console.log('\n  UTM breakdown of /welcome views from IG:');
  for (const row of r6.results) console.log(`    src=${row[0]} med=${row[1]} camp=${row[2]} content=${row[3]} → ${row[4]}`);

  // 7) Top exit URLs (where do they go after /welcome — anywhere?)
  const r7 = await q(`
    SELECT properties.$pathname as p, count() as n
    FROM events
    WHERE ${FILT} AND distinct_id IN ${IG_USERS} AND event = '$pageview'
    GROUP BY p ORDER BY n DESC LIMIT 10
  `, 'pages');
  console.log('\n  All pages IG users viewed:');
  for (const row of r7.results) console.log(`    ${String(row[0]).padEnd(40)} ${row[1]}`);

  // 8) os + os_version (iOS vs Android — IG in-app webview behaves differently)
  const r8 = await q(`
    SELECT properties.$os, properties.$os_version, count(DISTINCT distinct_id) as users
    FROM events
    WHERE ${FILT} AND distinct_id IN ${IG_USERS}
    GROUP BY 1,2 ORDER BY users DESC LIMIT 10
  `, 'os');
  console.log('\n  OS breakdown:');
  for (const row of r8.results) console.log(`    ${String(row[0]).padEnd(12)} ${String(row[1]).padEnd(10)} ${row[2]}`);

  console.log('\n  Done.\n');
}
main().catch(e => { console.error(e); process.exit(1); });
