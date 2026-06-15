import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const PH_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY!;
const PH_PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '296329';

async function hogql(query: string): Promise<any[]> {
  const res = await fetch(`https://us.posthog.com/api/projects/${PH_PROJECT_ID}/query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PH_API_KEY}` },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  if (!res.ok) { console.error('PH', res.status, (await res.text()).slice(0, 300)); return []; }
  return (await res.json()).results || [];
}

const IG = `(person.properties.$initial_utm_source = 'instagram'
  OR person.properties.$initial_referring_domain ILIKE '%instagram%')`;
const WINDOW = `timestamp > now() - INTERVAL 21 DAY`;

async function main() {
  // Cohort: IG persons who fired onboarding_started in the window.
  // Split: touched the board vs never touched.
  console.log('\n=== IG ONBOARDING COHORT (21d): touched vs frozen ===');
  const cohort = await hogql(`
    WITH ig_persons AS (
      SELECT person_id,
             max(event = 'onboarding_board_touched') AS touched,
             max(event = 'onboarding_started') AS started
      FROM events
      WHERE ${WINDOW} AND ${IG}
        AND event IN ('onboarding_started','onboarding_board_touched')
      GROUP BY person_id
    )
    SELECT countIf(started AND touched) AS touched,
           countIf(started AND NOT touched) AS frozen,
           count() AS total
    FROM ig_persons WHERE started
  `);
  console.log('  touched:', cohort[0]?.[0], ' frozen:', cohort[0]?.[1], ' total:', cohort[0]?.[2]);

  // Device / browser split among FROZEN (never touched) IG landers.
  console.log('\n=== FROZEN IG landers — device + in-app browser split ===');
  const dev = await hogql(`
    WITH frozen AS (
      SELECT person_id FROM events
      WHERE ${WINDOW} AND ${IG} AND event IN ('onboarding_started','onboarding_board_touched')
      GROUP BY person_id
      HAVING max(event='onboarding_started') AND NOT max(event='onboarding_board_touched')
    )
    SELECT
      properties.$device_type AS device,
      multiIf(properties.$browser ILIKE '%instagram%' OR properties.$raw_user_agent ILIKE '%instagram%','IG webview',
              properties.$browser ILIKE '%facebook%' OR properties.$raw_user_agent ILIKE '%FBAN%','FB webview','browser') AS ctx,
      count(DISTINCT person_id) AS people
    FROM events
    WHERE ${WINDOW} AND event = '$pageview' AND person_id IN (SELECT person_id FROM frozen)
    GROUP BY device, ctx ORDER BY people DESC
  `);
  for (const r of dev) console.log('  ', (r[0]||'?').padEnd(8), (r[1]||'?').padEnd(12), r[2]);

  // How long do FROZEN landers stay? Session duration proxy = max-min ts per person.
  console.log('\n=== FROZEN IG landers — time on site before leaving ===');
  const dwell = await hogql(`
    WITH frozen AS (
      SELECT person_id FROM events
      WHERE ${WINDOW} AND ${IG} AND event IN ('onboarding_started','onboarding_board_touched')
      GROUP BY person_id
      HAVING max(event='onboarding_started') AND NOT max(event='onboarding_board_touched')
    ),
    spans AS (
      SELECT person_id, dateDiff('second', min(timestamp), max(timestamp)) AS secs, count() AS evts
      FROM events WHERE ${WINDOW} AND person_id IN (SELECT person_id FROM frozen)
      GROUP BY person_id
    )
    SELECT
      countIf(secs < 3) AS under3s,
      countIf(secs >= 3 AND secs < 7) AS s3_7,
      countIf(secs >= 7 AND secs < 20) AS s7_20,
      countIf(secs >= 20) AS over20s,
      round(avg(secs),1) AS avg_secs,
      round(avg(evts),1) AS avg_events
    FROM spans
  `);
  const d = dwell[0] || [];
  console.log(`  <3s: ${d[0]}   3-7s: ${d[1]}   7-20s: ${d[2]}   >20s: ${d[3]}`);
  console.log(`  avg dwell: ${d[4]}s   avg events/person: ${d[5]}`);
  console.log('  (idle nudge fires at 7s — anyone <7s never saw a hint)');

  // Do frozen landers fire ANY autocapture click before leaving?
  console.log('\n=== FROZEN IG landers — any click at all? (autocapture) ===');
  const clicks = await hogql(`
    WITH frozen AS (
      SELECT person_id FROM events
      WHERE ${WINDOW} AND ${IG} AND event IN ('onboarding_started','onboarding_board_touched')
      GROUP BY person_id
      HAVING max(event='onboarding_started') AND NOT max(event='onboarding_board_touched')
    )
    SELECT
      countIf(has_click) AS clicked_something,
      countIf(NOT has_click) AS zero_clicks
    FROM (
      SELECT person_id, max(event = '$autocapture') AS has_click
      FROM events WHERE ${WINDOW} AND person_id IN (SELECT person_id FROM frozen)
      GROUP BY person_id
    )
  `);
  console.log('  clicked something:', clicks[0]?.[0], '  zero clicks (pure bounce):', clicks[0]?.[1]);
}
main();
