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

/**
 * CHE-387: DB-truth attributed signups. PostHog cannot see IG one-tap OAuth
 * signups (the IG in-app -> system browser handoff returns the user as a fresh
 * person, $initial_referring_domain = $direct), so the funnel showed 0 signups
 * while signups actually succeeded. First-touch attribution is now frozen in a
 * first-party cookie on landing and stamped onto profiles.first_touch_* at
 * signup — counting those rows is the truth; the signup_completed event is
 * kept as a secondary number so we can watch the gap close.
 */
async function getDbAttributedSignups(dateStr: string, days: number): Promise<{
  available: boolean;
  ig: number;
  paid: number;
}> {
  const sb = makeServiceClient();
  if (!sb) return { available: false, ig: 0, paid: 0 };

  const targetStart = Date.parse(`${dateStr}T00:00:00Z`);
  const startIso = new Date(targetStart - (days - 1) * DAY_MS).toISOString();
  const endIso = new Date(targetStart + DAY_MS).toISOString();

  const { data, error } = await sb
    .from('profiles')
    .select('first_touch_source, first_touch_medium, first_touch_referrer')
    .gte('created_at', startIso)
    .lt('created_at', endIso)
    .not('first_touch_at', 'is', null);

  if (error) {
    // 42703 = first_touch_* migration not applied yet.
    console.warn(`  [db-signups] ${error.code}: ${error.message}`);
    return { available: false, ig: 0, paid: 0 };
  }

  let ig = 0;
  let paid = 0;
  for (const r of data ?? []) {
    const src = ((r.first_touch_source as string | null) || '').toLowerCase();
    const medium = ((r.first_touch_medium as string | null) || '').toLowerCase();
    const referrer = ((r.first_touch_referrer as string | null) || '').toLowerCase();
    if (src.includes('instagram') || referrer.includes('instagram')) ig++;
    if (src.includes('instagram') && medium === 'paid') paid++;
  }
  return { available: true, ig, paid };
}

/**
 * Chess Path ELO funnel (CHE-370). Reach of the legible-progress surface by mode,
 * the soft-signup CTR, and the headline conversion: of the new logged-out users
 * who saw the first-rating ceremony, how many went on to complete signup.
 */
async function getEloFunnel(filter: string) {
  const r = await hogql(`
    SELECT
      uniqIf(person_id, event = 'elo_revealed') as revealed,
      uniqIf(person_id, event = 'elo_revealed' AND properties.mode = 'first_reveal') as revealed_first,
      uniqIf(person_id, event = 'elo_revealed' AND properties.mode = 'session') as revealed_session,
      uniqIf(person_id, event = 'elo_revealed' AND properties.mode = 'daily') as revealed_daily,
      uniqIf(person_id, event = 'elo_signup_clicked' AND properties.mode = 'first_reveal') as clicked_first,
      uniqIf(person_id, event = 'elo_keep_playing') as kept_playing
    FROM events WHERE ${filter}
  `, 'elo-funnel');
  const row = r.results[0] || [0, 0, 0, 0, 0, 0];

  // Person-level: saw the first-rating ceremony AND completed signup.
  const conv = await hogql(`
    SELECT count() FROM (
      SELECT person_id FROM events WHERE ${filter}
      GROUP BY person_id
      HAVING countIf(event = 'elo_revealed' AND properties.mode = 'first_reveal') > 0
         AND countIf(event = 'signup_completed') > 0
    )
  `, 'elo-first-signup');
  const firstToSignup = num((conv.results[0] || [0])[0]);

  return {
    revealed: num(row[0]),
    revealedFirst: num(row[1]),
    revealedSession: num(row[2]),
    revealedDaily: num(row[3]),
    clickedFirst: num(row[4]),
    keptPlaying: num(row[5]),
    firstToSignup,
  };
}

// ---------------------------------------------------------------------------
// LOST INTENT — session-level watchdog (added 2026-06-15).
//
// Why: we found the dead OAuth-button bug only because Tyler manually watched a
// replay. This scans EVERY session's event stream for signup-intent that failed
// and surfaces the high-signal ones with a one-tap PostHog replay link, so the
// suspicious 3 get watched instead of all 200. Detects, by session:
//   - OAUTH STALLED: tapped Google/Apple (oauth_started) but never returned
//     (no /auth/callback, no signup_completed) = the dead-button signature.
//   - DEAD CTA?:     engaged user saw the prompt but engaged ZERO call-to-action
//     before leaving = today's exact bug (couldn't tap the buttons).
//   - FORM LEFT:     clicked through to the form / elo soft-ask, never finished.
// signup_completed is unreliable across the IG webview->browser handoff (CHE-387),
// so reaching /auth/callback ALSO counts as success to avoid false alarms.
// ---------------------------------------------------------------------------
type LostSession = {
  sid: string; did: string; started: string; ended: string;
  os: string; browser: string; ref: string;
  engaged: number; promptShown: number; ctaClicked: number;
  oauthStarted: number; eloClicked: number;
  kind: 'OAUTH STALLED' | 'DEAD CTA?' | 'FORM LEFT';
  replay: string;
};

async function getLostIntent(filter: string): Promise<{
  sessions: LostSession[]; bouncedAtPrompt: number;
}> {
  const r = await hogql(`
    SELECT
      toString(properties.$session_id) AS sid,
      any(distinct_id) AS did,
      toString(min(timestamp)) AS started,
      toString(max(timestamp)) AS ended,
      any(properties.$os) AS os,
      any(properties.$browser) AS browser,
      any(properties.$referring_domain) AS ref,
      countIf(event IN ('game_ended','lesson_completed','daily_challenge_completed')) AS engaged,
      countIf(event = 'onboarding_signup_prompt_shown') AS prompt_shown,
      countIf(event = 'onboarding_signup_prompt_clicked') AS cta_clicked,
      countIf(event = 'onboarding_signup_prompt_oauth_started') AS oauth_started,
      countIf(event = 'elo_signup_clicked') AS elo_clicked,
      countIf(event = 'signup_completed') AS signup_done,
      countIf(event = '$pageview' AND properties.$pathname = '/auth/callback') AS callback
    FROM events
    WHERE ${filter} AND properties.$session_id IS NOT NULL AND toString(properties.$session_id) != ''
    GROUP BY sid
    HAVING (prompt_shown > 0 OR oauth_started > 0 OR elo_clicked > 0 OR cta_clicked > 0)
       AND signup_done = 0 AND callback = 0
    ORDER BY oauth_started DESC, engaged DESC, prompt_shown DESC
    LIMIT 60
  `, 'lost-intent');

  // Persons who actually signed up in the window — signup_completed now fires
  // server-side on the anonymous distinct_id (the same id the session's events
  // carry), so this reliably clears OAUTH STALLED false-positives where the tap
  // succeeded but the old client event never fired.
  const su = await hogql(`
    SELECT DISTINCT distinct_id FROM events WHERE ${filter} AND event = 'signup_completed'
  `, 'lost-intent-signedup');
  const signedUp = new Set(su.results.map(row => String(row[0])));

  const sessions: LostSession[] = [];
  let bouncedAtPrompt = 0;
  for (const row of r.results) {
    if (signedUp.has(String(row[1]))) continue; // distinct_id completed signup — not lost
    const oauthStarted = num(row[10]);
    const ctaClicked = num(row[9]);
    const eloClicked = num(row[11]);
    const promptShown = num(row[8]);
    const engaged = num(row[7]);

    // Classify by how far the intent got. High-signal subset only.
    let kind: LostSession['kind'] | null = null;
    if (oauthStarted > 0) kind = 'OAUTH STALLED';
    else if (ctaClicked > 0 || eloClicked > 0) kind = 'FORM LEFT';
    else if (promptShown > 0 && engaged > 0) kind = 'DEAD CTA?';
    else { bouncedAtPrompt++; continue; } // saw prompt, not engaged, no tap — low signal, count only

    const sid = String(row[0]);
    sessions.push({
      sid,
      did: String(row[1]),
      started: String(row[2]),
      ended: String(row[3]),
      os: String(row[4] ?? '?'),
      browser: String(row[5] ?? '?'),
      ref: String(row[6] ?? 'direct'),
      engaged, promptShown, ctaClicked, oauthStarted, eloClicked,
      kind,
      replay: `https://us.posthog.com/project/${PH_PROJECT_ID}/replay/${sid}`,
    });
  }
  return { sessions, bouncedAtPrompt };
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
// ── Instagram post performance (read-only, Instagram Login API) ──
interface IgPost {
  date: string; views: number; reach: number; likes: number;
  comments: number; saves: number; shares: number; title: string;
}
async function getInstagramPosts(windowDays = 5, limit = 20): Promise<{ available: boolean; posts: IgPost[] }> {
  const TOKEN = process.env.IG_ACCESS_TOKEN;
  const ACCOUNT = process.env.IG_ACCOUNT_ID;
  if (!TOKEN || !ACCOUNT) return { available: false, posts: [] };
  const IG_BASE = 'https://graph.instagram.com/v21.0';
  const g = async (path: string, params: Record<string, string> = {}) => {
    const url = new URL(`${IG_BASE}/${path}`);
    url.searchParams.set('access_token', TOKEN);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message ?? 'ig error');
    return json;
  };
  const ins = async (id: string): Promise<Record<string, number>> => {
    const out: Record<string, number> = {};
    try {
      const r = await g(`${id}/insights`, { metric: 'reach,views,likes,comments,saved,shares' });
      for (const m of r.data ?? []) out[m.name] = m.values?.[0]?.value ?? 0;
    } catch { /* metrics vary by media type / permission */ }
    return out;
  };
  try {
    const media = await g(`${ACCOUNT}/media`, {
      fields: 'id,caption,timestamp,like_count,comments_count',
      limit: String(limit),
    });
    const posts: IgPost[] = [];
    for (const m of media.data ?? []) {
      const i = await ins(m.id);
      posts.push({
        date: (m.timestamp ?? '').slice(0, 10),
        views: i.views ?? 0, reach: i.reach ?? 0,
        likes: i.likes ?? m.like_count ?? 0, comments: i.comments ?? m.comments_count ?? 0,
        saves: i.saved ?? 0, shares: i.shares ?? 0,
        title: (m.caption ?? '').split('\n')[0].slice(0, 40),
      });
    }
    // Keep only posts published within the last `windowDays` (anchored to the
    // report's target date) so the SOCIAL section is a rolling 5-day view.
    const cutoff = new Date(`${targetDate}T00:00:00Z`);
    cutoff.setUTCDate(cutoff.getUTCDate() - (windowDays - 1));
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    const windowed = posts.filter(p => p.date >= cutoffStr);
    return { available: true, posts: windowed };
  } catch { return { available: false, posts: [] }; }
}

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

  // Instagram post performance — from the IG Login API, independent of PostHog.
  const igPosts = await getInstagramPosts(5);

  // Instagram acquisition funnels (per-person). `igFunnel` = all IG (paid +
  // organic); `paidFunnel` = the boosted ad only (utm_medium=paid).
  const igFunnel = await getSourceFunnel(f, IG_SOURCE);
  const paidFunnel = await getSourceFunnel(f, PAID_IG_SOURCE);

  // CHE-387: DB-truth signup attribution (profiles.first_touch_*) — PostHog
  // loses OAuth signups across the IG in-app -> system browser handoff.
  const dbSignups = await getDbAttributedSignups(targetDate, rangeDays);

  // Chess Path ELO (CHE-370) — legible-progress surface + new-user signup hook.
  const elo = await getEloFunnel(f);

  // LOST INTENT watchdog — sessions where signup intent fired but failed.
  const lost = await getLostIntent(f);

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

  console.log(section('SOCIAL — INSTAGRAM (@chesspath.app, last 5 days)'));
  if (!igPosts.available) {
    console.log('  Unavailable — no IG_ACCESS_TOKEN/IG_ACCOUNT_ID in env (or insights not permitted).');
  } else if (igPosts.posts.length === 0) {
    console.log('  No posts in the last 5 days.');
  } else {
    console.log('  date         views  reach  likes  saves  shr  post');
    const c = (v: number, w: number) => String(v).padStart(w);
    for (const p of igPosts.posts) {
      console.log(`  ${p.date}  ${c(p.views, 6)}  ${c(p.reach, 5)}  ${c(p.likes, 5)}  ${c(p.saves, 5)}  ${c(p.shares, 3)}  ${p.title}`);
    }
    const sum = (k: keyof IgPost) => igPosts.posts.reduce((t, p) => t + (p[k] as number), 0);
    console.log(`\n  5-day totals (${igPosts.posts.length} posts):  ${sum('views')} views · ${sum('reach')} reach · ${sum('likes')} likes · ${sum('saves')} saves · ${sum('shares')} shares`);
    const ranked = [...igPosts.posts].filter(p => p.views > 0).sort((a, b) => b.views - a.views);
    if (ranked.length > 0) {
      const best = ranked[0];
      console.log(`  Top post (5d): "${best.title}" — ${best.views} views, ${best.saves} saves, ${best.shares} shares.`);
      console.log(`  Note: newest posts are still accumulating views — judge a post after ~3 days.`);
    }
  }

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

  console.log(section('🚨 LOST INTENT (sessions that tried to sign up & failed)'));
  if (lost.sessions.length === 0) {
    console.log(`  None flagged. ${lost.bouncedAtPrompt > 0 ? `(${lost.bouncedAtPrompt} saw the prompt, didn't engage a CTA — normal bails.)` : ''}`);
  } else {
    const bug = lost.sessions.filter(s => s.kind === 'OAUTH STALLED' || s.kind === 'DEAD CTA?').length;
    console.log(`  ${lost.sessions.length} flagged — ${bug} look like a BUG (tapped/engaged, went nowhere). WATCH THESE:`);
    console.log('');
    for (const s of lost.sessions.slice(0, 15)) {
      const tag = s.kind === 'OAUTH STALLED' ? '🔴 OAUTH STALLED'
        : s.kind === 'DEAD CTA?' ? '🔴 DEAD CTA?  '
        : '🟡 FORM LEFT  ';
      const did = s.engaged > 0 ? `engaged x${s.engaged}` : 'not engaged';
      console.log(`  ${tag}  ${s.os}/${s.browser}  ${did}  via ${s.ref}`);
      console.log(`     ${s.replay}`);
    }
    if (lost.sessions.length > 15) console.log(`  …and ${lost.sessions.length - 15} more.`);
    if (lost.bouncedAtPrompt > 0) console.log(`\n  (+ ${lost.bouncedAtPrompt} more saw the prompt but engaged no CTA — likely normal bails, not shown.)`);
    console.log(`\n  🔴 = tapped a button / engaged a CTA and it went nowhere = probable bug. Watch the replay.`);
  }

  console.log(section('CHESS PATH ELO (CHE-370 — legible progress + signup hook)'));
  if (elo.revealed === 0) {
    console.log('  No elo_revealed events yet in window (flag CHESS_PATH_ELO on prod).');
  } else {
    console.log(`  Revealed (people who saw the ELO surface):  ${elo.revealed}`);
    console.log(`    first_reveal (new logged-out ceremony):   ${elo.revealedFirst}`);
    console.log(`    session (returning logged-out climb):     ${elo.revealedSession}`);
    console.log(`    daily (logged-in day line):               ${elo.revealedDaily}`);
    console.log(`  New-user signup hook:`);
    console.log(`    ceremony shown -> tapped "Save rating":   ${elo.clickedFirst}/${elo.revealedFirst}  (${pct(elo.clickedFirst, elo.revealedFirst)})`);
    console.log(`    ceremony shown -> signup COMPLETED:       ${elo.firstToSignup}/${elo.revealedFirst}  (${pct(elo.firstToSignup, elo.revealedFirst)})`);
    console.log(`    "Keep playing" taps (soft-ask escapes):   ${elo.keptPlaying}`);
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

  const printFunnel = (title: string, fn: typeof igFunnel, emptyNote: string, dbSignupCount: number | null) => {
    console.log(section(title));
    if (fn.anyPerson === 0 && !dbSignupCount) {
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
      // CHE-387: the DB is the truth for signups — PostHog can't see OAuth
      // signups that cross the IG in-app -> system browser handoff.
      { label: 'Signup completed', count: dbSignupCount ?? fn.signupCompleted },
    ];
    const max = Math.max(...steps.map(s => s.count), 1);
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const drop = i > 0 && steps[i - 1].count > 0
        ? `  drop: ${pct(steps[i - 1].count - step.count, steps[i - 1].count)}`
        : '';
      console.log(`  ${step.label.padEnd(25)} ${String(step.count).padStart(5)}  ${bar(step.count, max)}${drop}`);
    }
    const signupTruth = dbSignupCount ?? fn.signupCompleted;
    console.log(`\n  People in window: ${fn.anyPerson}  ·  landing -> signup: ${pct(signupTruth, fn.landing)}`);
    if (dbSignupCount !== null) {
      console.log(`  Signup completed: DB-truth ${dbSignupCount} · PostHog event ${fn.signupCompleted}`);
      console.log(`  Note: DB attribution (profiles.first_touch_*) only exists for signups after 2026-06-10 (CHE-387).`);
    } else {
      console.log(`  Signup completed is the PostHog event count — DB attribution unavailable (first_touch_* migration not applied or no service creds).`);
    }
  };

  printFunnel(
    'INSTAGRAM FUNNEL (all IG, per-person, first-touch)',
    igFunnel,
    'No IG-acquired visitors in window.',
    dbSignups.available ? dbSignups.ig : null,
  );
  printFunnel(
    'PAID IG AD FUNNEL (utm_medium=paid only)',
    paidFunnel,
    'No paid-IG visitors yet — once the boosted ad delivers clicks they land here ($5/day x 10d probe, see data/growth/ig-ad-sprint-2026-06.md).',
    dbSignups.available ? dbSignups.paid : null,
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
