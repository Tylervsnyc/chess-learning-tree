/**
 * One-off: did the sprint's OAuth taps come from the Instagram in-app webview?
 * Pulls browser/UA properties for every signup-prompt OAuth start + signup
 * completion since the ad sprint began (2026-06-03).
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const { queryPostHog } = await import('../lib/posthog-server');

  const starts = await queryPostHog(`
    SELECT
      timestamp,
      distinct_id,
      properties.provider,
      properties.$browser,
      properties.$os,
      properties.$raw_user_agent,
      person.properties.$initial_utm_medium
    FROM events
    WHERE event = 'onboarding_signup_prompt_oauth_started'
      AND timestamp >= '2026-06-03'
    ORDER BY timestamp
    LIMIT 100
  `);

  console.log('=== OAuth STARTS since 2026-06-03 ===');
  for (const r of starts.results) {
    const [ts, id, provider, browser, os, ua, utm] = r as string[];
    const inIgWebview = /Instagram/i.test(ua ?? '');
    console.log(
      `${String(ts).slice(0, 16)}  ${String(id).slice(0, 8)}  ${provider}  ` +
      `browser=${browser}/${os}  utm_medium=${utm ?? '-'}  IG_WEBVIEW=${inIgWebview}`
    );
    if (ua) console.log(`    UA: ${ua}`);
  }

  const completes = await queryPostHog(`
    SELECT timestamp, distinct_id, properties.$browser, properties.$raw_user_agent
    FROM events
    WHERE event = 'signup_completed'
      AND timestamp >= '2026-06-03'
    ORDER BY timestamp
    LIMIT 100
  `);

  console.log('\n=== SIGNUP COMPLETIONS since 2026-06-03 ===');
  for (const r of completes.results) {
    const [ts, id, browser, ua] = r as string[];
    const inIgWebview = /Instagram/i.test(ua ?? '');
    console.log(`${String(ts).slice(0, 16)}  ${String(id).slice(0, 8)}  browser=${browser}  IG_WEBVIEW=${inIgWebview}`);
    if (ua) console.log(`    UA: ${ua}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
