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
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
config({ path: '.env.local' });

const PH_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY!;
const PH_PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '296329';

// Supabase service-role client — the DB is the source of truth for cohort
// retention. PostHog distinct_id mapping is unreliable on our tiny base, so
// D1/D7 are computed straight from signups + activity rows (see getCohortRetention).
function makeServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s+/g, '');
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

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

// ---------------------------------------------------------------------------
// Slack mirroring: capture everything we print so we can post it to a channel.
// Posts when --slack is passed or SLACK_WEBHOOK_URL is set in the env.
// ---------------------------------------------------------------------------
const slackBuffer: string[] = [];
const baseLog = console.log.bind(console);
console.log = (...a: unknown[]) => {
  slackBuffer.push(a.map(String).join(' '));
  baseLog(...a);
};

const wantSlack = args.includes('--slack') || !!process.env.SLACK_WEBHOOK_URL;

async function postToSlack(text: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.warn('  [slack] SLACK_WEBHOOK_URL not set — skipping Slack post');
    return;
  }
  // Slack messages cap at 40k chars; code blocks render the monospace report well.
  const body = '```' + text.slice(0, 38000) + '```';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: body }),
  });
  if (!res.ok) {
    baseLog(`  [slack] post failed ${res.status}: ${(await res.text()).slice(0, 150)}`);
  } else {
    baseLog('  [slack] posted report to channel');
  }
}

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
 * Build a timestamp filter aligned to UTC CALENDAR days.
 *
 * We anchor on `toStartOfDay(now(), 'UTC')` rather than bare `now()`. Bare
 * `now()` makes the window a rolling noon-to-noon slice (whatever time-of-day
 * the report runs), so "yesterday" silently straddled two calendar days — an
 * ad whose clicks landed after the run-time cutoff showed up as zero. Anchoring
 * to the start-of-day boundary makes "yesterday" mean the real UTC calendar day,
 * matching getTargetDate() (which is UTC) and the DB-truth cohort queries.
 *
 * `toStartOfDay(now())` is a deterministic function of now(), evaluated once at
 * query planning — so ClickHouse still prunes partitions (the thing that timed
 * out before was toDateTime *literals*, not now()-derived expressions).
 */
function dayFilter(dateStr: string, days = 1) {
  // Whole UTC days between the start of dateStr and the start of today — an
  // exact integer because both endpoints are midnights.
  const now = new Date();
  const startOfTodayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const targetStartUTC = Date.parse(`${dateStr}T00:00:00Z`);
  const daysAgo = Math.round((startOfTodayUTC - targetStartUTC) / 86400000);
  // Window covers the `days` calendar days ending at (and including) dateStr.
  const startInterval = daysAgo + days - 1; // older bound: start of first day in window
  const endInterval = daysAgo - 1;          // newer bound: start of the day AFTER dateStr
  const anchor = `toStartOfDay(now(), 'UTC')`;
  // endInterval is -1 only when dateStr is today; the day-after boundary is then
  // start-of-tomorrow. Avoid emitting `interval -1 day` (keep it unambiguous).
  const endBound = endInterval >= 0
    ? `${anchor} - interval ${endInterval} day`
    : `${anchor} + interval ${-endInterval} day`;
  return `timestamp >= ${anchor} - interval ${startInterval} day AND timestamp < ${endBound}`;
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

// Instagram-acquired visitors only. Uses PostHog's first-touch PERSON
// properties so EVERY event a person fires (not just the landing pageview) is
// attributed to how they arrived — utm_source lives only on the first pageview,
// person.$initial_* persists across the whole session. Catches both the tagged
// ad (utm_source=instagram) and organic IG referrals.
const IG_SOURCE = `(
  person.properties.$initial_utm_source = 'instagram'
  OR person.properties.$initial_referring_domain ILIKE '%instagram%'
  OR person.properties.$initial_referring_domain ILIKE '%l.instagram%'
)`;

// PAID IG only — the boosted ad tags its link utm_medium=paid, so this isolates
// the spend from organic IG posts/referrals. See data/growth/ig-ad-sprint-2026-06.md.
const PAID_IG_SOURCE = `(
  person.properties.$initial_utm_source = 'instagram'
  AND person.properties.$initial_utm_medium = 'paid'
)`;

/**
 * Per-PERSON funnel for one acquisition source. Unlike getWelcomeFunnel (which
 * counts events), this counts DISTINCT people who reached each step — the right
 * unit for "of the N who landed, how many converted." `sourceClause` is an
 * extra WHERE predicate (e.g. IG_SOURCE).
 */
async function getSourceFunnel(filter: string, sourceClause: string) {
  // After onboarding, users branch to a game OR a lesson/tutorial — parallel,
  // not sequential. Collapse them into one "started an activity" step so the
  // funnel stays monotonic and the real cliff is unambiguous.
  const r = await hogql(`
    SELECT
      uniqIf(person_id, event = '$pageview' AND (properties.$pathname = '/' OR properties.$pathname = '/welcome')) as landing,
      uniqIf(person_id, event = 'onboarding_started') as onb_started,
      uniqIf(person_id, event = 'onboarding_board_touched') as board_touched,
      uniqIf(person_id, event = 'onboarding_checkmate_won') as checkmate_won,
      uniqIf(person_id, event = 'onboarding_completed') as onb_completed,
      uniqIf(person_id, event IN ('game_started', 'tutorial_started', 'lesson_started')) as activity_started,
      uniqIf(person_id, event = 'onboarding_signup_prompt_shown') as prompt_shown,
      uniqIf(person_id, event = 'onboarding_signup_prompt_oauth_started') as oauth_started,
      uniqIf(person_id, event = 'signup_completed') as signup_completed,
      uniq(person_id) as any_person
    FROM events WHERE ${filter} AND ${sourceClause}
  `, 'ig-funnel');
  const row = r.results[0] || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  return {
    landing: num(row[0]),
    onbStarted: num(row[1]),
    boardTouched: num(row[2]),   // CHE-359 checkmate landing: first board interaction
    checkmateWon: num(row[3]),   // CHE-359 checkmate landing: solved the mate-in-1
    onbCompleted: num(row[4]),
    activityStarted: num(row[5]),
    promptShown: num(row[6]),
    oauthStarted: num(row[7]),
    signupCompleted: num(row[8]),
    anyPerson: num(row[9]),
  };
}

// Cache the full auth-user list so the target + previous-period calls don't
// double-fetch the admin API.
let _authUsersCache: { created_at: string; provider: string }[] | null = null;
async function fetchAuthUsers(sb: SupabaseClient): Promise<{ created_at: string; provider: string }[]> {
  if (_authUsersCache) return _authUsersCache;
  const out: { created_at: string; provider: string }[] = [];
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users?.length) break;
    for (const u of data.users) {
      if (u.created_at) out.push({ created_at: u.created_at, provider: (u.app_metadata?.provider as string) || 'unknown' });
    }
    if (data.users.length < 1000) break;
  }
  _authUsersCache = out;
  return out;
}

// New signups = accounts CREATED in the window (DB truth via auth.users).
// DB truth is the authority here: it can't be lost to client-side gaps. We
// only fall back to the signup_completed event if service creds are missing —
// and that fallback now undercounts OAuth (historically ~5x; CHE-366 fixed the
// OAuth callback to fire analytics 2026-06-08, so new event data is reliable,
// but older windows still under-report and DB truth sidesteps that entirely).
async function getNewSignups(dateStr: string, days: number) {
  const sb = makeServiceClient();
  if (sb) {
    const targetStart = Date.parse(`${dateStr}T00:00:00Z`);
    const startMs = targetStart - (days - 1) * DAY_MS; // start of first day in window
    const endMs = targetStart + DAY_MS;                // start of the day after dateStr
    const users = await fetchAuthUsers(sb);
    let total = 0, email = 0, google = 0, apple = 0;
    for (const u of users) {
      const t = Date.parse(u.created_at);
      if (Number.isNaN(t) || t < startMs || t >= endMs) continue;
      total++;
      if (u.provider === 'email') email++;
      else if (u.provider === 'google') google++;
      else if (u.provider === 'apple') apple++;
    }
    return { total, email, google, apple };
  }
  // Fallback: event-based (KNOWN to undercount OAuth ~5x — service creds missing).
  const r = await hogql(`
    SELECT
      countIf(event = 'signup_completed') as signups,
      countIf(event = 'signup_completed' AND properties.method = 'email') as email,
      countIf(event = 'signup_completed' AND properties.method = 'google') as google,
      countIf(event = 'signup_completed' AND properties.method = 'apple') as apple
    FROM events WHERE ${dayFilter(dateStr, days)}
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
// Cohort retention (D1 / D7) — DB is the source of truth
// ---------------------------------------------------------------------------
//
// A real signup-cohort read, not the period-overlap proxy above. For each
// signup we bucket their own activity by whole days SINCE signup (UTC), then:
//   D1 retained  = active on the day after signup (offset == 1)
//   D7 retained  = active on ANY day in offsets 1..7 (rolling return-within-a-week)
// Only "matured" cohorts count: a user must have signed up long enough ago that
// the window has fully elapsed (>= 2 days for D1, >= 8 days for D7), else they'd
// drag the rate down for not-yet-possible activity.
type CohortRetention = {
  available: boolean;
  d1: { cohort: number; retained: number };
  d7: { cohort: number; retained: number };
  windowDays: number;
};

const DAY_MS = 86400000;
const dayIndex = (ts: string | Date) => Math.floor(new Date(ts).getTime() / DAY_MS); // UTC day number

async function getCohortRetention(windowDays = 60): Promise<CohortRetention> {
  const empty: CohortRetention = {
    available: false,
    d1: { cohort: 0, retained: 0 },
    d7: { cohort: 0, retained: 0 },
    windowDays,
  };
  const sb = makeServiceClient();
  if (!sb) {
    console.warn('  [cohort] no Supabase service creds — skipping D1/D7');
    return empty;
  }

  const since = new Date(Date.now() - windowDays * DAY_MS).toISOString();

  // Signups in the window: user id -> signup UTC day index.
  const { data: signups, error: sErr } = await sb
    .from('profiles')
    .select('id, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: true });
  if (sErr || !signups) {
    console.warn(`  [cohort] signups read failed: ${sErr?.message ?? 'no data'}`);
    return empty;
  }
  const signupDay = new Map<string, number>();
  for (const r of signups) {
    if (r.id && r.created_at) signupDay.set(r.id as string, dayIndex(r.created_at as string));
  }
  if (signupDay.size === 0) return { ...empty, available: true };

  // Activity rows across every loop surface. Probed defensively — a missing
  // table/column is skipped + logged, matching db-baseline. Matches the streak
  // definition of "active" (do-anything), plus workout sessions.
  const sources: { table: string; ts: string }[] = [
    { table: 'puzzle_attempts', ts: 'attempted_at' },
    { table: 'lesson_progress', ts: 'started_at' },
    { table: 'game_sessions', ts: 'ended_at' },
    { table: 'daily_challenge_results', ts: 'created_at' },
    { table: 'opening_progress', ts: 'completed_at' },
    { table: 'workout_sessions', ts: 'created_at' },
  ];

  // user id -> set of day-offsets-since-signup on which they were active.
  const offsets = new Map<string, Set<number>>();
  for (const { table, ts } of sources) {
    const { data, error } = await sb
      .from(table)
      .select(`user_id, ${ts}`)
      .gte(ts, since)
      .not(ts, 'is', null)
      .limit(50000);
    if (error) {
      console.warn(`  [cohort] skip ${table}.${ts}: ${error.message}`);
      continue;
    }
    const rows = (data ?? []) as unknown as Array<Record<string, unknown>>;
    for (const row of rows) {
      const uid = row.user_id as string | null;
      const when = row[ts] as string | null;
      if (!uid || !when) continue;
      const start = signupDay.get(uid);
      if (start === undefined) continue; // activity from a pre-window signup
      const offset = dayIndex(when) - start;
      if (offset <= 0) continue; // signup-day activity isn't "return"
      let set = offsets.get(uid);
      if (!set) { set = new Set(); offsets.set(uid, set); }
      set.add(offset);
    }
  }

  const today = dayIndex(new Date());
  let d1Cohort = 0, d1Ret = 0, d7Cohort = 0, d7Ret = 0;
  for (const [uid, start] of signupDay) {
    const age = today - start;
    const set = offsets.get(uid);
    if (age >= 2) { // day+1 has fully elapsed
      d1Cohort++;
      if (set?.has(1)) d1Ret++;
    }
    if (age >= 8) { // days 1..7 have fully elapsed
      d7Cohort++;
      if (set && [1, 2, 3, 4, 5, 6, 7].some((o) => set.has(o))) d7Ret++;
    }
  }

  return {
    available: true,
    d1: { cohort: d1Cohort, retained: d1Ret },
    d7: { cohort: d7Cohort, retained: d7Ret },
    windowDays,
  };
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
    getNewSignups(targetDate, rangeDays), getNewSignups(prevDate, rangeDays), getActivity(f),
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

  // Cohort retention — straight from the DB, independent of PostHog.
  const cohort = await getCohortRetention();

  // Instagram acquisition funnels (per-person). `igFunnel` = all IG (paid +
  // organic); `paidFunnel` = the boosted ad only (utm_medium=paid).
  const igFunnel = await getSourceFunnel(f, IG_SOURCE);
  const paidFunnel = await getSourceFunnel(f, PAID_IG_SOURCE);

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

  console.log(section(`COHORT RETENTION (DB truth, last ${cohort.windowDays}d of signups)`));
  if (!cohort.available) {
    console.log('  Unavailable — no Supabase service creds in env.');
  } else if (cohort.d1.cohort === 0) {
    console.log('  No matured signup cohorts in window yet.');
  } else {
    console.log(`  D1 (active day after signup):   ${cohort.d1.retained}/${cohort.d1.cohort}  (${pct(cohort.d1.retained, cohort.d1.cohort)})`);
    if (cohort.d7.cohort > 0) {
      console.log(`  D7 (returned within a week):    ${cohort.d7.retained}/${cohort.d7.cohort}  (${pct(cohort.d7.retained, cohort.d7.cohort)})`);
    } else {
      console.log(`  D7: no cohort old enough (need signups >= 8d ago)`);
    }
    console.log(`  Note: D1 = active on signup-day+1; D7 = active any day in offsets 1-7 (UTC).`);
  }

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

  const printFunnel = (title: string, fn: typeof igFunnel, emptyNote: string) => {
    console.log(section(title));
    if (fn.anyPerson === 0) {
      console.log(`  ${emptyNote}`);
      return;
    }
    const steps = [
      { label: 'Landed (/ or /welcome)', count: fn.landing },
      { label: 'Onboarding started', count: fn.onbStarted },
      { label: 'Board touched', count: fn.boardTouched },
      { label: 'Checkmate won', count: fn.checkmateWon },
      { label: 'Picked a path', count: fn.onbCompleted },
      { label: 'Started an activity', count: fn.activityStarted },
      { label: 'Signup prompt shown', count: fn.promptShown },
      { label: 'One-tap OAuth started', count: fn.oauthStarted },
      { label: 'Signup completed', count: fn.signupCompleted },
    ];
    const max = Math.max(...steps.map(s => s.count), 1);
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const drop = i > 0 && steps[i - 1].count > 0
        ? `  drop: ${pct(steps[i - 1].count - step.count, steps[i - 1].count)}`
        : '';
      console.log(`  ${step.label.padEnd(25)} ${String(step.count).padStart(5)}  ${bar(step.count, max)}${drop}`);
    }
    console.log(`\n  People in window: ${fn.anyPerson}  ·  landing -> signup: ${pct(fn.signupCompleted, fn.landing)}`);
  };

  printFunnel(
    'INSTAGRAM FUNNEL (all IG, per-person, first-touch)',
    igFunnel,
    'No IG-acquired visitors in window.',
  );
  printFunnel(
    'PAID IG AD FUNNEL (utm_medium=paid only)',
    paidFunnel,
    'No paid-IG visitors yet — once the boosted ad delivers clicks they land here ($5/day x 10d probe, see data/growth/ig-ad-sprint-2026-06.md).',
  );

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

main()
  .then(async () => {
    if (wantSlack) await postToSlack(slackBuffer.join('\n'));
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
