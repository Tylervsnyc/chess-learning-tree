import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
const projectId = process.env.POSTHOG_PROJECT_ID || '296329';

async function hogql(query) {
  const res = await fetch(`https://us.posthog.com/api/projects/${projectId}/query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } })
  });
  if (!res.ok) {
    const t = await res.text();
    console.error('Query failed:', res.status, t.slice(0, 300));
    return null;
  }
  return await res.json();
}

async function countEvent(eventName) {
  const r = await hogql(`SELECT count() AS total, count(DISTINCT distinct_id) AS uniq FROM events WHERE event = '${eventName}' AND timestamp >= now() - interval 7 day`);
  if (!r || !r.results?.[0]) return { total: 0, unique: 0 };
  return { total: r.results[0][0], unique: r.results[0][1] };
}

console.log('Fetching PostHog data (last 7 days)...\n');

const events = [
  '$pageview',
  'tutorial_started', 'tutorial_completed', 'tutorial_skipped',
  'lesson_started', 'lesson_completed', 'lesson_abandoned',
  'daily_challenge_viewed', 'daily_challenge_started', 'daily_challenge_completed',
  'level_test_started', 'level_test_completed',
  'paywall_viewed', 'pricing_viewed', 'checkout_started', 'checkout_completed',
  'signup_page_viewed', 'signup_started', 'signup_completed',
  'login_page_viewed', 'login_completed',
  'share_clicked', 'share_completed',
  'tree_level_viewed'
];

// Fetch all counts in parallel
const results = await Promise.all(events.map(e => countEvent(e)));
const f = {};
events.forEach((e, i) => { f[e] = results[i]; });

console.log('=== UNIQUE USER FUNNEL (7d) ===');
console.log(`Site Visitors:              ${f['$pageview'].unique}`);
console.log(`  Tutorial Started:         ${f['tutorial_started'].unique}`);
console.log(`  Tutorial Completed:       ${f['tutorial_completed'].unique}`);
console.log(`  Tutorial Skipped:         ${f['tutorial_skipped'].unique}`);
console.log(`  Lesson Started:           ${f['lesson_started'].unique} (${f['lesson_started'].total} events)`);
console.log(`  Lesson Completed:         ${f['lesson_completed'].unique} (${f['lesson_completed'].total} events)`);
console.log(`  Lesson Abandoned:         ${f['lesson_abandoned'].unique} (${f['lesson_abandoned'].total} events)`);
console.log(`  Daily Rook Viewed:        ${f['daily_challenge_viewed'].unique}`);
console.log(`  Daily Rook Started:       ${f['daily_challenge_started'].unique}`);
console.log(`  Daily Rook Completed:     ${f['daily_challenge_completed'].unique}`);
console.log(`  Level Test Started:       ${f['level_test_started'].unique}`);
console.log(`  Level Test Completed:     ${f['level_test_completed'].unique}`);
console.log(`  Tree Level Viewed:        ${f['tree_level_viewed'].unique}`);
console.log(`  Share Clicked:            ${f['share_clicked'].unique}`);
console.log(`  Share Completed:          ${f['share_completed'].unique}`);
console.log();
console.log('=== AUTH FUNNEL (7d) ===');
console.log(`Signup Page Viewed:         ${f['signup_page_viewed'].unique}`);
console.log(`Signup Started:             ${f['signup_started'].unique}`);
console.log(`Signup Completed:           ${f['signup_completed'].unique}`);
console.log(`Login Page Viewed:          ${f['login_page_viewed'].unique}`);
console.log(`Login Completed:            ${f['login_completed'].unique}`);
console.log();
console.log('=== MONETIZATION FUNNEL (7d) ===');
console.log(`Paywall Viewed:             ${f['paywall_viewed'].unique} (${f['paywall_viewed'].total} events)`);
console.log(`Pricing Viewed:             ${f['pricing_viewed'].unique} (${f['pricing_viewed'].total} events)`);
console.log(`Checkout Started:           ${f['checkout_started'].unique} (${f['checkout_started'].total} events)`);
console.log(`Checkout Completed:         ${f['checkout_completed'].unique} (${f['checkout_completed'].total} events)`);

// Paywall triggers
const triggers = await hogql("SELECT properties.trigger, count(), count(DISTINCT distinct_id) FROM events WHERE event = 'paywall_viewed' AND timestamp >= now() - interval 7 day GROUP BY properties.trigger ORDER BY count() DESC");
if (triggers) {
  console.log('\n=== PAYWALL TRIGGERS (7d) ===');
  triggers.results.forEach(r => console.log(`${r[0] || 'unknown'}: ${r[1]} events (${r[2]} unique)`));
}

// Top pages
const pages = await hogql("SELECT properties.$pathname, count(), count(DISTINCT distinct_id) FROM events WHERE event = '$pageview' AND timestamp >= now() - interval 7 day AND properties.$pathname NOT LIKE '%_next%' GROUP BY properties.$pathname ORDER BY count() DESC LIMIT 20");
if (pages) {
  console.log('\n=== TOP PAGES (7d) ===');
  pages.results.forEach(r => console.log(`${r[0]} | ${r[1]} views | ${r[2]} unique`));
}

// Lesson completions by ID
const lessons = await hogql("SELECT properties.lessonId, count(), count(DISTINCT distinct_id) FROM events WHERE event = 'lesson_completed' AND timestamp >= now() - interval 7 day GROUP BY properties.lessonId ORDER BY count() DESC LIMIT 15");
if (lessons) {
  console.log('\n=== LESSON COMPLETIONS BY ID (7d) ===');
  lessons.results.forEach(r => console.log(`${r[0]} | ${r[1]} completions | ${r[2]} unique`));
}

// SankeyMatic output
const v = f['$pageview'].unique;
const tut = f['tutorial_started'].unique;
const tutDone = f['tutorial_completed'].unique;
const les = f['lesson_started'].unique;
const lesDone = f['lesson_completed'].unique;
const daily = f['daily_challenge_viewed'].unique;
const dailyStart = f['daily_challenge_started'].unique;
const pw = f['paywall_viewed'].unique;
const pr = f['pricing_viewed'].unique;
const co = f['checkout_started'].unique;
const paid = f['checkout_completed'].unique;
const shared = f['share_completed'].unique;
const signedUp = f['signup_completed'].unique;

const bounce = Math.max(1, v - les - tut - daily);
const tutDrop = Math.max(0, tut - tutDone);
const lesDrop = Math.max(0, les - lesDone);
const lesContinue = Math.max(0, lesDone - pw - shared);
const pwDrop = Math.max(0, pw - pr);
const prDrop = Math.max(0, pr - co);
const coDrop = Math.max(0, co - paid);
const dailyDrop = Math.max(0, daily - dailyStart);

const lines = [
  `// Chess Path User Funnel - ${v} unique visitors, 7-day window`,
  `// Generated ${new Date().toISOString().slice(0,10)}`,
  ``,
  `Site Visitors [${tut}] Started Tutorial`,
  `Site Visitors [${les}] Started Lesson`,
  `Site Visitors [${daily}] Viewed Daily Rook`,
  `Site Visitors [${bounce}] Bounced`,
];

if (tutDone > 0) lines.push(`Started Tutorial [${tutDone}] Completed Tutorial`);
if (tutDrop > 0) lines.push(`Started Tutorial [${tutDrop}] Dropped Tutorial`);

lines.push(`Started Lesson [${lesDone}] Completed Lesson`);
if (lesDrop > 0) lines.push(`Started Lesson [${lesDrop}] Abandoned Lesson`);

if (pw > 0) lines.push(`Completed Lesson [${pw}] Saw Paywall`);
if (shared > 0) lines.push(`Completed Lesson [${shared}] Shared`);
if (lesContinue > 0) lines.push(`Completed Lesson [${lesContinue}] Continued Learning`);

if (pw > 0 && pr > 0) lines.push(`Saw Paywall [${pr}] Visited Pricing`);
if (pwDrop > 0) lines.push(`Saw Paywall [${pwDrop}] Dropped at Paywall`);

if (pr > 0 && co > 0) lines.push(`Visited Pricing [${co}] Started Checkout`);
if (prDrop > 0) lines.push(`Visited Pricing [${prDrop}] Dropped at Pricing`);

if (co > 0 && paid > 0) lines.push(`Started Checkout [${paid}] Paid`);
if (coDrop > 0) lines.push(`Started Checkout [${coDrop}] Dropped at Checkout`);

if (dailyStart > 0) lines.push(`Viewed Daily Rook [${dailyStart}] Played Daily Rook`);
if (dailyDrop > 0) lines.push(`Viewed Daily Rook [${dailyDrop}] Didn't Start Daily`);

if (signedUp > 0) lines.push(`\n// Auth flow\nSite Visitors [${signedUp}] Signed Up`);

console.log('\n\n========================================');
console.log('SANKEYMATIC CODE');
console.log('Paste at: https://sankeymatic.com/build/');
console.log('========================================\n');
console.log(lines.join('\n'));
