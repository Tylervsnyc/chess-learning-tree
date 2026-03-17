#!/usr/bin/env npx tsx
/**
 * Daily UX Report — queries PostHog + Stripe, posts to Linear.
 *
 * Usage:
 *   npx tsx scripts/daily-report.ts              # yesterday's report
 *   npx tsx scripts/daily-report.ts --date=2026-03-05  # specific date
 *   npx tsx scripts/daily-report.ts --dry-run     # print to console only
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const PH_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY!;
const PH_PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '296329';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const LINEAR_API_KEY = process.env.LINEAR_API_KEY!;
const LINEAR_TEAM_ID = '54251f1e-c50a-49ee-8b04-974acf6ffb10';

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dateArg = args.find(a => a.startsWith('--date='))?.split('=')[1];

// Target date (defaults to yesterday UTC)
function getTargetDate(): string {
  if (dateArg) return dateArg;
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

const targetDate = getTargetDate();
const dayStart = `${targetDate}T00:00:00Z`;
const dayEnd = new Date(new Date(dayStart).getTime() + 86400000).toISOString();

// Previous day for comparison
const prevDate = new Date(new Date(dayStart).getTime() - 86400000).toISOString().slice(0, 10);
const prevStart = `${prevDate}T00:00:00Z`;

console.log(`Daily report for ${targetDate} (comparing to ${prevDate})\n`);

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
    console.warn(`[${label || 'query'}] PostHog ${res.status}: ${t.slice(0, 150)}`);
    return { results: [], columns: [] };
  }
  return res.json();
}

function dayFilter(dateStr: string) {
  // PostHog optimizes `now() - interval N day` but NOT `toDateTime(...)` — the latter
  // skips ClickHouse partition pruning and times out. So we compute the offset in days.
  const now = new Date();
  const target = new Date(`${dateStr}T00:00:00Z`);
  const diffMs = now.getTime() - target.getTime();
  const daysAgo = Math.ceil(diffMs / 86400000);
  const daysAgoEnd = daysAgo - 1;
  return `timestamp >= now() - interval ${daysAgo} day AND timestamp < now() - interval ${daysAgoEnd} day`;
}

// ---------------------------------------------------------------------------
// Queries — all run in parallel
// ---------------------------------------------------------------------------

async function getOverview(date: string) {
  const f = dayFilter(date);
  const r = await hogql(`
    SELECT count() as events, count(DISTINCT distinct_id) as users,
      countIf(event = '$pageview') as pageviews
    FROM events WHERE ${f}
  `, 'overview');
  const row = r.results[0] || [0, 0, 0];
  return { events: row[0] as number, users: row[1] as number, pageviews: row[2] as number };
}

async function getTrafficSources(date: string) {
  const f = dayFilter(date);
  const r = await hogql(`
    SELECT properties.$referring_domain as ref, count(DISTINCT distinct_id) as users
    FROM events WHERE event = '$pageview' AND ${f}
      AND properties.$referring_domain IS NOT NULL AND properties.$referring_domain != ''
    GROUP BY ref ORDER BY users DESC LIMIT 10
  `);
  return r.results.map(row => ({ source: row[0] as string, users: row[1] as number }));
}

async function getDeviceSplit(date: string) {
  const f = dayFilter(date);
  const r = await hogql(`
    SELECT properties.$device_type as device, count(DISTINCT distinct_id) as users
    FROM events WHERE event = '$pageview' AND ${f}
    GROUP BY device ORDER BY users DESC
  `);
  return r.results.map(row => ({ device: row[0] as string, users: row[1] as number }));
}

async function getReturningUsers(date: string) {
  const f = dayFilter(date);
  const r = await hogql(`
    SELECT countIf(event = '$identify') as identified
    FROM events WHERE ${f}
  `, 'returning');
  return (r.results[0]?.[0] as number) || 0;
}

async function getHomepageStats(date: string) {
  const f = dayFilter(date);
  const r = await hogql(`
    SELECT count(DISTINCT distinct_id) FROM events
    WHERE event = '$pageview'
      AND (properties.$pathname = '/' OR properties.$pathname = '')
      AND ${f}
  `, 'homepage');
  return {
    visitors: (r.results[0]?.[0] as number) || 0,
  };
}

async function getTutorialFunnel(date: string) {
  const f = dayFilter(date);
  const r = await hogql(`
    SELECT
      event,
      count() as total,
      count(DISTINCT distinct_id) as uniq
    FROM events
    WHERE event IN ('tutorial_started', 'tutorial_completed') AND ${f}
    GROUP BY event
  `, 'tutorial');
  const map: Record<string, { total: number; uniq: number }> = {};
  r.results.forEach(row => {
    map[row[0] as string] = { total: row[1] as number, uniq: row[2] as number };
  });
  return {
    starts: map['tutorial_started']?.total ?? 0,
    uniqueStarts: map['tutorial_started']?.uniq ?? 0,
    completions: map['tutorial_completed']?.total ?? 0,
    uniqueCompletions: map['tutorial_completed']?.uniq ?? 0,
  };
}

async function getTutorialDropoff(date: string) {
  const f = dayFilter(date);
  const r = await hogql(`
    SELECT properties.stepId as step, count() as cnt
    FROM events WHERE event = 'tutorial_step_completed' AND ${f}
    GROUP BY step ORDER BY cnt DESC
  `);
  return r.results.map(row => ({ step: row[0] as string, count: row[1] as number }));
}

async function getSignupFunnel(date: string) {
  const f = dayFilter(date);
  const r = await hogql(`
    SELECT event, count() as cnt, count(DISTINCT distinct_id) as users
    FROM events WHERE ${f}
      AND event IN ('signup_page_viewed', 'signup_started', 'signup_failed', 'login_completed', '$identify')
    GROUP BY event ORDER BY cnt DESC
  `);
  const map: Record<string, { count: number; users: number }> = {};
  r.results.forEach(row => {
    map[row[0] as string] = { count: row[1] as number, users: row[2] as number };
  });
  return map;
}

async function getOnboardingFunnel(date: string) {
  const f = dayFilter(date);
  const r = await hogql(`
    SELECT event, count() as cnt, count(DISTINCT distinct_id) as users
    FROM events WHERE ${f}
      AND event IN ('onboarding_started', 'onboarding_level_selected', 'onboarding_completed')
    GROUP BY event
  `, 'onboarding');
  const map: Record<string, { count: number; users: number }> = {};
  r.results.forEach(row => {
    map[row[0] as string] = { count: row[1] as number, users: row[2] as number };
  });

  // Level breakdown
  const levels = await hogql(`
    SELECT properties.level as level, count() as cnt
    FROM events WHERE event = 'onboarding_level_selected' AND ${f}
    GROUP BY level ORDER BY cnt DESC
  `, 'onboarding-levels');

  return {
    started: map['onboarding_started']?.users ?? 0,
    levelSelected: map['onboarding_level_selected']?.users ?? 0,
    completed: map['onboarding_completed']?.users ?? 0,
    levels: levels.results.map(row => ({ level: row[0] as string, count: row[1] as number })),
  };
}

async function getEngagement(date: string) {
  const f = dayFilter(date);
  const r = await hogql(`
    SELECT
      countIf(event = 'lesson_completed') as lessons_completed,
      countIf(event = 'daily_challenge_completed') as daily_completed,
      countIf(event = 'puzzle_attempted') as puzzles_attempted
    FROM events WHERE ${f}
  `);
  const row = r.results[0] || [0, 0, 0];
  return { lessons: row[0] as number, daily: row[1] as number, puzzles: row[2] as number };
}

async function getPaywallViews(date: string) {
  const f = dayFilter(date);
  const r = await hogql(`
    SELECT count() as views, count(DISTINCT distinct_id) as users
    FROM events WHERE event = 'paywall_viewed' AND ${f}
  `, 'paywall');
  const row = r.results[0] || [0, 0];
  return { views: row[0] as number, users: row[1] as number };
}

async function getAdClicks(date: string) {
  const f = dayFilter(date);
  const r = await hogql(`
    SELECT countIf(event = 'ad_click') as clicks, countIf(event = 'ad_impression') as impressions
    FROM events WHERE ${f} AND event IN ('ad_click', 'ad_impression')
  `, 'ads');
  const row = r.results[0] || [0, 0];
  return { clicks: row[0] as number, impressions: row[1] as number };
}

// ---------------------------------------------------------------------------
// Stripe — premium signups
// ---------------------------------------------------------------------------
async function getPremiumSignups(date: string): Promise<number> {
  if (!STRIPE_SECRET_KEY) return -1; // not configured

  const start = Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 1000);
  const end = start + 86400;

  const res = await fetch(
    `https://api.stripe.com/v1/subscriptions?created[gte]=${start}&created[lt]=${end}&status=active&limit=100`,
    { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } }
  );

  if (!res.ok) {
    console.warn(`Stripe API error: ${res.status}`);
    return -1;
  }

  const data = await res.json();
  return data.data?.length ?? 0;
}

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------
function pct(num: number, denom: number): string {
  if (denom === 0) return '0%';
  return `${Math.round((num / denom) * 100)}%`;
}

function delta(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '(new)' : '';
  const d = Math.round(((current - previous) / previous) * 100);
  if (d > 0) return `+${d}%`;
  if (d < 0) return `${d}%`;
  return '0%';
}

// ---------------------------------------------------------------------------
// Build the report
// ---------------------------------------------------------------------------
async function buildReport(): Promise<string> {
  // PostHog has a 3-concurrent-query limit, so batch in groups of 3
  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  const [overview, prevOverview, sources] = await Promise.all([
    getOverview(targetDate), getOverview(prevDate), getTrafficSources(targetDate),
  ]);
  await wait(500);
  const [devices, returning, homepage] = await Promise.all([
    getDeviceSplit(targetDate), getReturningUsers(targetDate), getHomepageStats(targetDate),
  ]);
  await wait(500);
  const [tutorial, prevTutorial, tutorialSteps] = await Promise.all([
    getTutorialFunnel(targetDate), getTutorialFunnel(prevDate), getTutorialDropoff(targetDate),
  ]);
  await wait(500);
  const [signup, engagement, prevEngagement] = await Promise.all([
    getSignupFunnel(targetDate), getEngagement(targetDate), getEngagement(prevDate),
  ]);
  await wait(500);
  const [onboarding, prevOnboarding] = await Promise.all([
    getOnboardingFunnel(targetDate), getOnboardingFunnel(prevDate),
  ]);
  await wait(500);
  const [paywall, ads] = await Promise.all([
    getPaywallViews(targetDate), getAdClicks(targetDate),
  ]);
  const premiumSignups = await getPremiumSignups(targetDate);

  const totalUsers = overview.users;
  const mobileUsers = devices.filter(d => d.device === 'Mobile').reduce((s, d) => s + d.users, 0);
  const desktopUsers = devices.filter(d => d.device === 'Desktop').reduce((s, d) => s + d.users, 0);
  const newUsers = totalUsers - returning;

  const signupViews = signup['signup_page_viewed']?.users ?? 0;
  const signupStarts = signup['signup_started']?.users ?? 0;
  const signupFails = signup['signup_failed']?.count ?? 0;
  const loginsCompleted = signup['login_completed']?.users ?? 0;
  const signupConversion = pct(loginsCompleted, totalUsers);

  // Traffic sources formatted
  const sourcesFormatted = sources.map(s => {
    const name = s.source === '$direct' ? 'Direct' : s.source;
    return `| ${name} | ${s.users} |`;
  }).join('\n');

  // Tutorial steps formatted
  const stepsFormatted = tutorialSteps.map(s => `| ${s.step} | ${s.count} |`).join('\n');

  const report = `# Daily Report -- ${targetDate}

## Traffic

| Stat | Today | Yesterday | Change |
|------|-------|-----------|--------|
| Unique Visitors | **${totalUsers}** | ${prevOverview.users} | ${delta(totalUsers, prevOverview.users)} |
| Pageviews | ${overview.pageviews} | ${prevOverview.pageviews} | ${delta(overview.pageviews, prevOverview.pageviews)} |
| Total Events | ${overview.events} | ${prevOverview.events} | ${delta(overview.events, prevOverview.events)} |
| Returning Users | ${returning} | -- | -- |
| New Users | ${newUsers} | -- | -- |
| Mobile / Desktop | ${mobileUsers} / ${desktopUsers} | -- | ${pct(mobileUsers, totalUsers)} mobile |

### Sources

| Source | Users |
|--------|-------|
${sourcesFormatted}

## Landing Page

| Stat | Value |
|------|-------|
| Homepage Visitors | ${homepage.visitors} |
| Homepage -> Tutorial | ${tutorial.uniqueStarts} (${pct(tutorial.uniqueStarts, homepage.visitors)} of homepage visitors) |
| Landing Page Variant | *(manual -- note which version was live)* |

## Welcome Funnel

| Step | Today | Yesterday | Change |
|------|-------|-----------|--------|
| Onboarding Started | ${onboarding.started} | ${prevOnboarding.started} | ${delta(onboarding.started, prevOnboarding.started)} |
| Level Selected | ${onboarding.levelSelected} | ${prevOnboarding.levelSelected} | ${delta(onboarding.levelSelected, prevOnboarding.levelSelected)} |
| Completed | ${onboarding.completed} | ${prevOnboarding.completed} | ${delta(onboarding.completed, prevOnboarding.completed)} |
| Completion Rate | ${pct(onboarding.completed, onboarding.levelSelected)} | ${pct(prevOnboarding.completed, prevOnboarding.levelSelected)} | -- |

### Level Choices

| Level | Count |
|-------|-------|
${onboarding.levels.map((l: { level: string; count: number }) => `| ${l.level} | ${l.count} |`).join('\n') || '| (no data) | -- |'}

## Tutorial Funnel

| Stat | Today | Yesterday | Change |
|------|-------|-----------|--------|
| Tutorial Starts | ${tutorial.uniqueStarts} | ${prevTutorial.uniqueStarts} | ${delta(tutorial.uniqueStarts, prevTutorial.uniqueStarts)} |
| Tutorial Completions | ${tutorial.uniqueCompletions} | ${prevTutorial.uniqueCompletions} | ${delta(tutorial.uniqueCompletions, prevTutorial.uniqueCompletions)} |
| Completion Rate | ${pct(tutorial.uniqueCompletions, tutorial.uniqueStarts)} | ${pct(prevTutorial.uniqueCompletions, prevTutorial.uniqueStarts)} | -- |
| Drop-off Point | see below | -- | -- |

### Tutorial Steps Completed

| Step | Count |
|------|-------|
${stepsFormatted || '| (no data) | -- |'}

## Signup & Auth

| Stat | Value |
|------|-------|
| Signup Page Views | ${signupViews} |
| Signups Started | ${signupStarts} |
| Signup Failures | ${signupFails} |
| Logins Completed | ${loginsCompleted} |
| Signup Conversion (signups / visitors) | **${signupConversion}** |

## Engagement

| Stat | Today | Yesterday | Change |
|------|-------|-----------|--------|
| Lessons Completed | ${engagement.lessons} | ${prevEngagement.lessons} | ${delta(engagement.lessons, prevEngagement.lessons)} |
| Daily Challenge Completions | ${engagement.daily} | ${prevEngagement.daily} | ${delta(engagement.daily, prevEngagement.daily)} |
| Puzzles Attempted | ${engagement.puzzles} | ${prevEngagement.puzzles} | ${delta(engagement.puzzles, prevEngagement.puzzles)} |
| Paywall Views | ${paywall.views} (${paywall.users} unique) | -- | -- |

## Revenue

| Stat | Value |
|------|-------|
| Ad Impressions | ${ads.impressions} |
| Ad Clicks | ${ads.clicks} (${pct(ads.clicks, ads.impressions)} CTR) |
| Premium Signups | ${premiumSignups === -1 ? '(Stripe not configured)' : premiumSignups} |

---
*Generated by scripts/daily-report.ts*`;

  return report;
}

// ---------------------------------------------------------------------------
// Post to Linear
// ---------------------------------------------------------------------------
async function postToLinear(title: string, content: string) {
  const mutation = `
    mutation CreateDocument($input: DocumentCreateInput!) {
      documentCreate(input: $input) {
        success
        document { id url }
      }
    }
  `;

  const res = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: LINEAR_API_KEY,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          title,
          content,
          teamId: LINEAR_TEAM_ID,
        },
      },
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Linear API error ${res.status}: ${t.slice(0, 300)}`);
  }

  const data = await res.json();
  if (data.errors) {
    throw new Error(`Linear GraphQL error: ${JSON.stringify(data.errors)}`);
  }

  return data.data.documentCreate.document;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  // Preflight checks
  if (!PH_API_KEY) { console.error('Missing POSTHOG_PERSONAL_API_KEY'); process.exit(1); }

  console.log('Fetching PostHog + Stripe data...');
  const report = await buildReport();

  if (dryRun) {
    console.log('\n--- DRY RUN ---\n');
    console.log(report);
    return;
  }

  if (!LINEAR_API_KEY) {
    console.error('Missing LINEAR_API_KEY in .env.local -- printing to console instead.\n');
    console.log(report);
    process.exit(1);
  }

  console.log('Posting to Linear...');
  const title = `Daily Report -- ${targetDate}`;
  const doc = await postToLinear(title, report);
  console.log(`Posted to Linear: ${doc.url}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
