#!/usr/bin/env npx tsx
/**
 * Chess Path 3.0 — Daily Report
 *
 * Queries PostHog for a single day and prints a full diagnostics report:
 * welcome funnel, signups, activity breakdown, tutorial/level-test rates,
 * share funnel, and return rate.
 *
 * Usage:
 *   npx tsx scripts/daily-report.ts                   # yesterday
 *   npx tsx scripts/daily-report.ts --date=2026-04-12  # specific date
 *   npx tsx scripts/daily-report.ts --days=7           # last 7 days summary
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const PH_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY!;
const PH_PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '296329';

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const dateArg = args.find(a => a.startsWith('--date='))?.split('=')[1];
const daysArg = args.find(a => a.startsWith('--days='))?.split('=')[1];
const rangeDays = daysArg ? parseInt(daysArg, 10) : 1;

function getTargetDate(): string {
  if (dateArg) return dateArg;
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

const targetDate = getTargetDate();

// For single-day mode, compare to previous day
const prevDate = new Date(new Date(`${targetDate}T00:00:00Z`).getTime() - 86400000)
  .toISOString().slice(0, 10);

const isRange = rangeDays > 1;
const rangeLabel = isRange ? `${rangeDays}-day summary ending ${targetDate}` : targetDate;

console.log(`\n  Chess Path 3.0 — Daily Report`);
console.log(`  ${rangeLabel}\n`);

// ---------------------------------------------------------------------------
// PostHog helpers
// ---------------------------------------------------------------------------
interface QResult { results: unknown[][]; columns: string[] }

async function hogql(query: string, label?: string): Promise<QResult> {
  const res = await fetch(`https://us.posthog.com/api/projects/${PH_PROJECT_ID}/query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PH_API_KEY}` },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.warn(`  [${label || 'query'}] PostHog ${res.status}: ${t.slice(0, 150)}`);
    return { results: [], columns: [] };
  }
  return res.json();
}

/**
 * Build a timestamp filter using `now() - interval N day` so ClickHouse
 * can prune partitions (toDateTime literals skip pruning and time out).
 */
function dayFilter(dateStr: string, days = 1) {
  const now = new Date();
  const target = new Date(`${dateStr}T00:00:00Z`);
  const daysAgo = Math.ceil((now.getTime() - target.getTime()) / 86400000);
  const daysAgoEnd = daysAgo - days;
  return `timestamp >= now() - interval ${daysAgo} day AND timestamp < now() - interval ${daysAgoEnd} day`;
}

const f = dayFilter(targetDate, rangeDays);
const fp = dayFilter(prevDate, rangeDays); // previous period for comparison

// PostHog rate limit: batch queries in groups of 3 with small delay
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function num(val: unknown): number { return Number(val ?? 0); }
function pct(n: number, d: number): string {
  if (d === 0) return '-';
  return `${Math.round((n / d) * 100)}%`;
}
function delta(cur: number, prev: number): string {
  if (prev === 0) return cur > 0 ? '(new)' : '';
  const d = Math.round(((cur - prev) / prev) * 100);
  if (d > 0) return `+${d}%`;
  if (d < 0) return `${d}%`;
  return '=';
}
function bar(n: number, max: number, width = 20): string {
  if (max === 0) return '';
  const filled = Math.round((n / max) * width);
  return '\u2588'.repeat(filled) + '\u2591'.repeat(width - filled);
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

async function getOverview(filter: string) {
  const r = await hogql(`
    SELECT count() as events, count(DISTINCT distinct_id) as users,
      countIf(event = '$pageview') as pageviews
    FROM events WHERE ${filter}
  `, 'overview');
  const row = r.results[0] || [0, 0, 0];
  return { events: num(row[0]), users: num(row[1]), pageviews: num(row[2]) };
}

async function getWelcomeFunnel(filter: string) {
  // Full funnel: landing -> tutorial start -> tutorial complete -> signup prompt -> signup
  const r = await hogql(`
    SELECT
      countIf(event = '$pageview' AND (properties.$pathname = '/' OR properties.$pathname = '/welcome')) as landing,
      countIf(event = 'tutorial_started') as tut_started,
      countIf(event = 'tutorial_completed') as tut_completed,
      countIf(event = 'onboarding_started') as onb_started,
      countIf(event = 'onboarding_completed') as onb_completed,
      countIf(event = 'onboarding_signup_prompt_shown') as signup_prompt_shown,
      countIf(event = 'onboarding_signup_prompt_clicked') as signup_prompt_clicked,
      countIf(event = 'signup_completed') as signup_completed
    FROM events WHERE ${filter}
  `, 'welcome-funnel');
  const row = r.results[0] || [0, 0, 0, 0, 0, 0, 0, 0];
  return {
    landing: num(row[0]),
    tutStarted: num(row[1]),
    tutCompleted: num(row[2]),
    onbStarted: num(row[3]),
    onbCompleted: num(row[4]),
    signupPromptShown: num(row[5]),
    signupPromptClicked: num(row[6]),
    signupCompleted: num(row[7]),
  };
}

async function getNewSignups(filter: string) {
  const r = await hogql(`
    SELECT
      countIf(event = 'signup_completed') as signups,
      countIf(event = 'signup_completed' AND properties.method = 'email') as email,
      countIf(event = 'signup_completed' AND properties.method = 'google') as google,
      countIf(event = 'signup_completed' AND properties.method = 'apple') as apple
    FROM events WHERE ${filter}
  `, 'signups');
  const row = r.results[0] || [0, 0, 0, 0];
  return { total: num(row[0]), email: num(row[1]), google: num(row[2]), apple: num(row[3]) };
}

async function getActivity(filter: string) {
  const r = await hogql(`
    SELECT
      countIf(event = 'puzzle_attempted' AND (properties.source IS NULL OR properties.source != 'openings')) as path_puzzles,
      countIf(event = 'lesson_completed' AND (properties.source IS NULL OR properties.source != 'openings')) as path_lessons,
      countIf(event = 'game_ended') as games_played,
      countIf(event = 'daily_challenge_completed') as daily_challenges,
      countIf(event = 'lesson_completed' AND properties.source = 'openings') as opening_lessons,
      countIf(event = 'lesson_started' AND properties.source = 'openings') as opening_starts
    FROM events WHERE ${filter}
  `, 'activity');
  const row = r.results[0] || [0, 0, 0, 0, 0, 0];
  return {
    pathPuzzles: num(row[0]),
    pathLessons: num(row[1]),
    gamesPlayed: num(row[2]),
    dailyChallenges: num(row[3]),
    openingLessons: num(row[4]),
    openingStarts: num(row[5]),
  };
}

async function getTutorialBreakdown(filter: string) {
  const r = await hogql(`
    SELECT
      properties.tutorial as tutorial,
      countIf(event = 'tutorial_started') as starts,
      countIf(event = 'tutorial_completed') as completions,
      countIf(event = 'tutorial_skipped') as skips
    FROM events
    WHERE ${filter} AND event IN ('tutorial_started', 'tutorial_completed', 'tutorial_skipped')
    GROUP BY tutorial
  `, 'tutorial-breakdown');
  return r.results.map(row => ({
    tutorial: String(row[0] ?? 'unknown'),
    starts: num(row[1]),
    completions: num(row[2]),
    skips: num(row[3]),
  }));
}

async function getLevelTests(filter: string) {
  const r = await hogql(`
    SELECT
      countIf(event = 'level_test_started') as starts,
      countIf(event = 'level_test_completed') as completions,
      countIf(event = 'level_test_completed' AND properties.passed = true) as passed,
      countIf(event = 'level_test_completed' AND properties.passed = false) as failed
    FROM events WHERE ${filter}
  `, 'level-tests');
  const row = r.results[0] || [0, 0, 0, 0];
  return { starts: num(row[0]), completions: num(row[1]), passed: num(row[2]), failed: num(row[3]) };
}

async function getShareFunnel(filter: string) {
  const r = await hogql(`
    SELECT
      countIf(event = 'share_clicked') as clicked,
      countIf(event = 'share_generated') as generated,
      countIf(event = 'share_completed') as completed,
      countIf(event = 'share_failed') as failed
    FROM events WHERE ${filter}
  `, 'share-funnel');
  const row = r.results[0] || [0, 0, 0, 0];
  return { clicked: num(row[0]), generated: num(row[1]), completed: num(row[2]), failed: num(row[3]) };
}

async function getReturnRate(filter: string, prevFilter: string) {
  // Users who were active in the previous period AND also active in this period
  const r = await hogql(`
    SELECT count(DISTINCT e1.distinct_id) as returning
    FROM events e1
    WHERE e1.distinct_id IN (
      SELECT DISTINCT distinct_id FROM events WHERE ${prevFilter}
    ) AND ${filter}
  `, 'return-rate');
  return num(r.results[0]?.[0]);
}

async function getTrafficSources(filter: string) {
  const r = await hogql(`
    SELECT properties.$referring_domain as ref, count(DISTINCT distinct_id) as users
    FROM events WHERE event = '$pageview' AND ${filter}
      AND properties.$referring_domain IS NOT NULL AND properties.$referring_domain != ''
    GROUP BY ref ORDER BY users DESC LIMIT 8
  `, 'sources');
  return r.results.map(row => ({
    source: String(row[0]) === '$direct' ? 'Direct' : String(row[0]),
    users: num(row[1]),
  }));
}

async function getDeviceSplit(filter: string) {
  const r = await hogql(`
    SELECT properties.$device_type as device, count(DISTINCT distinct_id) as users
    FROM events WHERE event = '$pageview' AND ${filter}
    GROUP BY device ORDER BY users DESC
  `, 'devices');
  const map: Record<string, number> = {};
  r.results.forEach(row => { map[String(row[0] ?? 'Unknown').toLowerCase()] = num(row[1]); });
  const total = Object.values(map).reduce((s, v) => s + v, 0);
  return { mobile: map['mobile'] || 0, desktop: map['desktop'] || 0, total };
}

async function getTopPages(filter: string) {
  const r = await hogql(`
    SELECT properties.$pathname as page, count() as views
    FROM events WHERE event = '$pageview' AND ${filter}
    GROUP BY page ORDER BY views DESC LIMIT 10
  `, 'top-pages');
  return r.results.map(row => ({ page: String(row[0]), views: num(row[1]) }));
}

async function getPlayDetails(filter: string) {
  const r = await hogql(`
    SELECT
      countIf(properties.result = 'win') as wins,
      countIf(properties.result = 'loss') as losses,
      countIf(properties.result = 'draw') as draws,
      avg(properties.moveCount) as avg_moves
    FROM events WHERE event = 'game_ended' AND ${filter}
  `, 'play-details');
  const row = r.results[0] || [0, 0, 0, 0];
  return { wins: num(row[0]), losses: num(row[1]), draws: num(row[2]), avgMoves: Math.round(num(row[3])) };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!PH_API_KEY) {
    console.error('  Missing POSTHOG_PERSONAL_API_KEY in .env.local');
    process.exit(1);
  }

  console.log('  Fetching data from PostHog...\n');

  // Batch 1
  const [overview, prevOverview, funnel] = await Promise.all([
    getOverview(f), getOverview(fp), getWelcomeFunnel(f),
  ]);
  await wait(500);

  // Batch 2
  const [signups, prevSignups, activity] = await Promise.all([
    getNewSignups(f), getNewSignups(fp), getActivity(f),
  ]);
  await wait(500);

  // Batch 3
  const [prevActivity, tutorials, levelTests] = await Promise.all([
    getActivity(fp), getTutorialBreakdown(f), getLevelTests(f),
  ]);
  await wait(500);

  // Batch 4
  const [shareFunnel, returning, sources] = await Promise.all([
    getShareFunnel(f), getReturnRate(f, fp), getTrafficSources(f),
  ]);
  await wait(500);

  // Batch 5
  const [devices, topPages, playDetails] = await Promise.all([
    getDeviceSplit(f), getTopPages(f), getPlayDetails(f),
  ]);

  // ---------------------------------------------------------------------------
  // Print report
  // ---------------------------------------------------------------------------
  const line = '─'.repeat(60);
  const section = (title: string) => `\n  ${line}\n  ${title}\n  ${line}`;

  console.log(section('TRAFFIC'));
  console.log(`  Unique visitors:  ${overview.users}  (prev: ${prevOverview.users}, ${delta(overview.users, prevOverview.users)})`);
  console.log(`  Pageviews:        ${overview.pageviews}  (prev: ${prevOverview.pageviews}, ${delta(overview.pageviews, prevOverview.pageviews)})`);
  console.log(`  Total events:     ${overview.events}`);
  console.log(`  Mobile/Desktop:   ${devices.mobile}/${devices.desktop}  (${pct(devices.mobile, devices.total)} mobile)`);
  console.log(`  Returning users:  ${returning}  (${pct(returning, overview.users)} of total)`);

  if (sources.length > 0) {
    console.log(`\n  Traffic sources:`);
    for (const s of sources) {
      console.log(`    ${s.source.padEnd(30)} ${s.users} users`);
    }
  }

  console.log(section('WELCOME FUNNEL'));
  const funnelSteps = [
    { label: 'Landing (/ + /welcome)', count: funnel.landing },
    { label: 'Tutorial started', count: funnel.tutStarted },
    { label: 'Tutorial completed', count: funnel.tutCompleted },
    { label: 'Onboarding started', count: funnel.onbStarted },
    { label: 'Onboarding completed', count: funnel.onbCompleted },
    { label: 'Signup prompt shown', count: funnel.signupPromptShown },
    { label: 'Signup prompt clicked', count: funnel.signupPromptClicked },
    { label: 'Signup completed', count: funnel.signupCompleted },
  ];
  const maxFunnel = Math.max(...funnelSteps.map(s => s.count), 1);
  for (let i = 0; i < funnelSteps.length; i++) {
    const step = funnelSteps[i];
    const dropoff = i > 0 && funnelSteps[i - 1].count > 0
      ? `  drop: ${pct(funnelSteps[i - 1].count - step.count, funnelSteps[i - 1].count)}`
      : '';
    console.log(`  ${step.label.padEnd(25)} ${String(step.count).padStart(5)}  ${bar(step.count, maxFunnel)}${dropoff}`);
  }
  console.log(`\n  Overall conversion (landing -> signup): ${pct(funnel.signupCompleted, funnel.landing)}`);

  console.log(section('NEW SIGNUPS'));
  console.log(`  Total:   ${signups.total}  (prev: ${prevSignups.total}, ${delta(signups.total, prevSignups.total)})`);
  if (signups.total > 0) {
    console.log(`  Email:   ${signups.email}`);
    console.log(`  Google:  ${signups.google}`);
    console.log(`  Apple:   ${signups.apple}`);
  }

  console.log(section('DAILY ACTIVITY'));
  const act = [
    { label: 'Path puzzles attempted', cur: activity.pathPuzzles, prev: prevActivity.pathPuzzles },
    { label: 'Path lessons completed', cur: activity.pathLessons, prev: prevActivity.pathLessons },
    { label: 'Games played (/play)', cur: activity.gamesPlayed, prev: prevActivity.gamesPlayed },
    { label: 'Daily challenges done', cur: activity.dailyChallenges, prev: prevActivity.dailyChallenges },
    { label: 'Opening lessons done', cur: activity.openingLessons, prev: prevActivity.openingLessons },
    { label: 'Opening lessons started', cur: activity.openingStarts, prev: prevActivity.openingStarts },
  ];
  for (const a of act) {
    console.log(`  ${a.label.padEnd(27)} ${String(a.cur).padStart(5)}  (prev: ${a.prev}, ${delta(a.cur, a.prev)})`);
  }

  if (activity.gamesPlayed > 0) {
    console.log(`\n  Play Rookie breakdown:`);
    console.log(`    Wins: ${playDetails.wins}  Losses: ${playDetails.losses}  Draws: ${playDetails.draws}  Avg moves: ${playDetails.avgMoves}`);
  }

  console.log(section('TUTORIAL COMPLETION'));
  if (tutorials.length === 0) {
    console.log('  No tutorial activity');
  } else {
    for (const t of tutorials) {
      console.log(`  ${t.tutorial.padEnd(20)} started: ${t.starts}  completed: ${t.completions}  skipped: ${t.skips}  rate: ${pct(t.completions, t.starts)}`);
    }
  }

  console.log(section('LEVEL TESTS'));
  if (levelTests.starts === 0) {
    console.log('  No level test activity');
  } else {
    console.log(`  Started:    ${levelTests.starts}`);
    console.log(`  Completed:  ${levelTests.completions}`);
    console.log(`  Passed:     ${levelTests.passed}  (${pct(levelTests.passed, levelTests.completions)})`);
    console.log(`  Failed:     ${levelTests.failed}  (${pct(levelTests.failed, levelTests.completions)})`);
  }

  console.log(section('SHARE FUNNEL'));
  if (shareFunnel.clicked === 0) {
    console.log('  No share activity');
  } else {
    console.log(`  Clicked:    ${shareFunnel.clicked}`);
    console.log(`  Generated:  ${shareFunnel.generated}`);
    console.log(`  Completed:  ${shareFunnel.completed}  (${pct(shareFunnel.completed, shareFunnel.clicked)} of clicks)`);
    if (shareFunnel.failed > 0) console.log(`  Failed:     ${shareFunnel.failed}`);
  }

  console.log(section('TOP PAGES'));
  for (const p of topPages) {
    console.log(`  ${p.page.padEnd(35)} ${p.views} views`);
  }

  console.log(`\n  ${line}`);
  console.log(`  Report complete.\n`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
