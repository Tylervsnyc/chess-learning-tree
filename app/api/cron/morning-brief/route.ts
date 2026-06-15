import { NextRequest, NextResponse } from 'next/server';
import { withCronHeartbeat } from '@/lib/cron/heartbeat';
import { createServiceClient } from '@/lib/supabase/service';
import { queryPostHog } from '@/lib/posthog-server';

// ---------------------------------------------------------------------------
// LOST INTENT watchdog (2026-06-15). We found the dead OAuth-button bug only
// because Tyler manually watched a replay. This scans yesterday's sessions for
// signup intent that FAILED and drops the high-signal ones (with a one-tap
// replay link) straight into the morning brief, so the suspicious few get
// watched instead of all of them. signup_completed is unreliable across the IG
// webview->browser handoff (CHE-387), so reaching /auth/callback also counts as
// success to avoid false alarms. Mirrors getLostIntent in scripts/daily-report.ts.
// ---------------------------------------------------------------------------
type LostKind = 'OAUTH STALLED' | 'DEAD CTA?' | 'FORM LEFT';
interface LostSession {
  os: string; browser: string; ref: string; engaged: number; kind: LostKind; replay: string;
}

async function getLostIntentSessions(): Promise<{ sessions: LostSession[]; bounced: number }> {
  const projectId = process.env.POSTHOG_PROJECT_ID || '296329';
  // Yesterday's full UTC day — matches the brief's day-over-day cadence.
  const filter = `timestamp >= toStartOfDay(now(), 'UTC') - interval 1 day AND timestamp < toStartOfDay(now(), 'UTC')`;
  try {
    const { results } = await queryPostHog(`
      SELECT
        toString(properties.$session_id) AS sid,
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
    `);
    const sessions: LostSession[] = [];
    let bounced = 0;
    for (const row of results as unknown[][]) {
      const engaged = Number(row[4] ?? 0);
      const promptShown = Number(row[5] ?? 0);
      const ctaClicked = Number(row[6] ?? 0);
      const oauthStarted = Number(row[7] ?? 0);
      const eloClicked = Number(row[8] ?? 0);
      let kind: LostKind | null = null;
      if (oauthStarted > 0) kind = 'OAUTH STALLED';
      else if (ctaClicked > 0 || eloClicked > 0) kind = 'FORM LEFT';
      else if (promptShown > 0 && engaged > 0) kind = 'DEAD CTA?';
      else { bounced++; continue; }
      sessions.push({
        os: String(row[1] ?? '?'),
        browser: String(row[2] ?? '?'),
        ref: String(row[3] ?? 'direct'),
        engaged, kind,
        replay: `https://us.posthog.com/project/${projectId}/replay/${String(row[0])}`,
      });
    }
    return { sessions, bounced };
  } catch (err) {
    // Never let the watchdog break the brief — degrade to nothing.
    console.error('Morning brief: lost-intent query failed:', err);
    return { sessions: [], bounced: 0 };
  }
}

interface Suggestion {
  priority: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  action: string;
}

interface ReportRow {
  report_type: string;
  generated_at: string;
  period: string;
  metrics: Record<string, number | string | null> | null;
  suggestions: Suggestion[] | null;
}

const REPORT_TYPES = ['growth', 'engagement', 'content', 'revenue'] as const;

// Headline numbers surfaced in WHAT CHANGED, with the report they live in.
const HEADLINES: { type: string; key: string; label: string; prefix?: string }[] = [
  { type: 'engagement', key: 'active_users_yesterday', label: 'Active users' },
  { type: 'engagement', key: 'signups_yesterday', label: 'Signups' },
  { type: 'engagement', key: 'lessons_yesterday', label: 'Lessons completed' },
  { type: 'engagement', key: 'daily_rooks_yesterday', label: 'Daily Rooks completed' },
  { type: 'engagement', key: 'puzzles_solved_yesterday', label: 'Puzzles solved' },
  { type: 'content', key: 'total_attempts_yesterday', label: 'Puzzle attempts' },
  { type: 'revenue', key: 'mrr_current', label: 'MRR', prefix: '$' },
];

function num(row: ReportRow | undefined, key: string): number | null {
  const value = row?.metrics?.[key];
  return typeof value === 'number' ? value : null;
}

function str(row: ReportRow | undefined, key: string): string | null {
  const value = row?.metrics?.[key];
  return typeof value === 'string' ? value : null;
}

function fmt(value: number | null, prefix = ''): string {
  if (value == null) return 'n/a';
  return `${prefix}${value}`;
}

// Day-over-day delta line. Flags swings over +/-30% as worth a look.
function deltaLine(
  label: string,
  today: number | null,
  yesterday: number | null,
  prefix = ''
): { line: string; flagged: string | null } {
  if (today == null && yesterday == null) {
    return { line: `${label}: n/a (no data either day)`, flagged: null };
  }
  if (yesterday == null) {
    return { line: `${label}: ${fmt(today, prefix)} (no prior day to compare)`, flagged: null };
  }
  if (today == null) {
    return { line: `${label}: n/a today (was ${fmt(yesterday, prefix)})`, flagged: null };
  }
  if (yesterday === 0) {
    const line = today === 0
      ? `${label}: ${fmt(today, prefix)} (flat)`
      : `${label}: ${fmt(today, prefix)} (was 0)`;
    const flagged = today === 0 ? null : `${label} went from 0 to ${fmt(today, prefix)}`;
    return { line: flagged ? `${line} — worth a look` : line, flagged };
  }
  const pct = Math.round(((today - yesterday) / yesterday) * 100);
  const sign = pct > 0 ? '+' : '';
  const base = `${label}: ${fmt(today, prefix)} (was ${fmt(yesterday, prefix)}, ${sign}${pct}%)`;
  if (Math.abs(pct) > 30) {
    return { line: `${base} — worth a look`, flagged: `${label} swung ${sign}${pct}% day-over-day` };
  }
  return { line: base, flagged: null };
}

export const GET = withCronHeartbeat('morning-brief', async (_request: NextRequest) => {
  const supabase = createServiceClient();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // --- Fetch today's + yesterday's report rows ---
  const { data: rows, error: fetchError } = await supabase
    .from('dashboard_reports')
    .select('report_type, generated_at, period, metrics, suggestions')
    .in('report_type', [...REPORT_TYPES])
    .in('period', [today, yesterday])
    .order('generated_at', { ascending: false });

  if (fetchError) {
    console.error('Morning brief: failed to fetch reports:', fetchError);
    return NextResponse.json(
      { error: `Failed to fetch reports: ${fetchError.message}` },
      { status: 500 }
    );
  }

  // Most recent row per (type, period) — rows are already newest-first.
  const byTypePeriod = new Map<string, ReportRow>();
  for (const row of (rows ?? []) as ReportRow[]) {
    const key = `${row.report_type}:${row.period}`;
    if (!byTypePeriod.has(key)) byTypePeriod.set(key, row);
  }
  const todayReport = (type: string) => byTypePeriod.get(`${type}:${today}`);
  const prevReport = (type: string) => byTypePeriod.get(`${type}:${yesterday}`);

  const missingReports = REPORT_TYPES.filter((type) => !todayReport(type));

  // --- LOST INTENT: sessions that tried to sign up yesterday and failed ---
  const lost = await getLostIntentSessions();
  const lostBugs = lost.sessions.filter(
    (s) => s.kind === 'OAUTH STALLED' || s.kind === 'DEAD CTA?'
  );
  const lostIntentLines: string[] = lost.sessions.length === 0
    ? [`- None flagged${lost.bounced > 0 ? ` (${lost.bounced} saw the prompt, didn't engage a CTA — normal bails)` : ''}.`]
    : (() => {
        const lines = [
          `- ${lost.sessions.length} flagged, ${lostBugs.length} look like a BUG (engaged a CTA, went nowhere). Watch:`,
        ];
        for (const s of lost.sessions.slice(0, 8)) {
          const icon = s.kind === 'FORM LEFT' ? '🟡' : '🔴';
          const eng = s.engaged > 0 ? `engaged x${s.engaged}` : 'not engaged';
          lines.push(`   ${icon} ${s.kind} · ${s.os}/${s.browser} · ${eng} · via ${s.ref} · <${s.replay}|watch>`);
        }
        if (lost.sessions.length > 8) lines.push(`   …and ${lost.sessions.length - 8} more.`);
        return lines;
      })();

  // --- WHAT CHANGED ---
  const changedLines: string[] = [];
  const flaggedSwings: string[] = [];
  for (const headline of HEADLINES) {
    const { line, flagged } = deltaLine(
      headline.label,
      num(todayReport(headline.type), headline.key),
      num(prevReport(headline.type), headline.key),
      headline.prefix
    );
    changedLines.push(`- ${line}`);
    if (flagged) flaggedSwings.push(flagged);
  }

  // --- Per-domain sections ---
  const growth = todayReport('growth');
  const growthLines = growth
    ? [
        `- Paywall conversion (7d): ${fmt(num(growth, 'paywall_conversion_rate'))}%`,
        `- Signup-to-lesson (7d): ${fmt(num(growth, 'signup_to_lesson_rate'))}%`,
        `- Shares (7d): ${fmt(num(growth, 'share_count_7d'))} · referral signups (7d): ${fmt(num(growth, 'referral_signups_7d'))}`,
      ]
    : ['- No growth report stored today.'];

  const engagement = todayReport('engagement');
  const engagementLines = engagement
    ? [
        `- Signups (7d): ${fmt(num(engagement, 'signups_7d'))}`,
        `- Lessons/day (7d avg): ${fmt(num(engagement, 'lessons_7d_avg'))} (${fmt(num(engagement, 'lessons_change_pct'))}% WoW)`,
        `- Daily Rooks/day (7d avg): ${fmt(num(engagement, 'daily_rooks_7d_avg'))} (${fmt(num(engagement, 'daily_rook_change_pct'))}% WoW)`,
      ]
    : ['- No engagement report stored today.'];

  const content = todayReport('content');
  const contentLines = content
    ? [
        `- Avg puzzle accuracy: ${fmt(num(content, 'avg_accuracy'))}%`,
        `- Most attempted theme: ${str(content, 'most_attempted_theme') ?? 'n/a'}`,
        `- Hardest puzzle: ${str(content, 'hardest_puzzle') ?? 'n/a'} (${fmt(num(content, 'hardest_puzzle_rate'))}% solve rate)`,
      ]
    : ['- No content report stored today.'];

  const revenue = todayReport('revenue');
  const revenueLines = revenue
    ? [
        `- MRR: $${fmt(num(revenue, 'mrr_current'))} (${fmt(num(revenue, 'mrr_change_pct'))}% WoW)`,
        `- New subscribers (7d): ${fmt(num(revenue, 'new_subscribers_7d'))} · churned (7d): ${fmt(num(revenue, 'churned_7d'))}`,
      ]
    : ['- No revenue report stored today.'];

  // --- WHAT TO DO (mechanical, max 3) ---
  const actions: string[] = [];
  for (const type of missingReports) {
    actions.push(`The ${type} report cron has no row for today — check cron_heartbeats for report-${type}.`);
  }
  const signupsToday = num(engagement, 'signups_yesterday');
  const activeToday = num(engagement, 'active_users_yesterday');
  if (signupsToday === 0 && activeToday != null && activeToday > 0) {
    actions.push(`Signups at 0 while ${activeToday} users were active — check the capture funnel.`);
  }
  if (lostBugs.length > 0) {
    actions.push(`${lostBugs.length} session(s) tried to sign up and the CTA went nowhere — watch the replays in LOST INTENT (probable capture bug).`);
  }
  for (const swing of flaggedSwings) {
    actions.push(`${swing} — dig into what moved it.`);
  }
  for (const type of REPORT_TYPES) {
    for (const suggestion of todayReport(type)?.suggestions ?? []) {
      if (suggestion.priority === 'high') {
        actions.push(`[${type}] ${suggestion.title}: ${suggestion.action}`);
      }
    }
  }
  const todoLines = actions.length > 0
    ? actions.slice(0, 3).map((action) => `- ${action}`)
    : ['Nothing urgent.'];

  // --- Compose the brief ---
  const sections = [
    `*Morning brief — ${today}*`,
    '',
    '*WHAT CHANGED* (vs yesterday)',
    ...changedLines,
    '',
    '*GROWTH / FUNNEL*',
    ...growthLines,
    '',
    '*ENGAGEMENT*',
    ...engagementLines,
    '',
    '*🚨 LOST INTENT* (tried to sign up yesterday & failed)',
    ...lostIntentLines,
    '',
    '*CONTENT*',
    ...contentLines,
    '',
    '*REVENUE*',
    ...revenueLines,
    '',
    '*WHAT TO DO*',
    ...todoLines,
  ];
  if (missingReports.length > 0) {
    sections.push('', `Missing report rows today: ${missingReports.join(', ')}`);
  }
  const brief = sections.join('\n');

  // --- Store the brief for the audit trail ---
  await supabase
    .from('dashboard_reports')
    .delete()
    .eq('report_type', 'morning_brief')
    .eq('period', today);

  const { error: insertError } = await supabase
    .from('dashboard_reports')
    .insert({
      report_type: 'morning_brief',
      generated_at: new Date().toISOString(),
      period: today,
      metrics: { brief_length: brief.length, missing_report_count: missingReports.length },
      suggestions: [],
      raw_data: { brief, missing_reports: missingReports },
    });

  if (insertError) {
    console.error('Morning brief: failed to store:', insertError);
    return NextResponse.json(
      { error: `Failed to store brief: ${insertError.message}` },
      { status: 500 }
    );
  }

  // --- Post to Slack ---
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('Morning brief: SLACK_WEBHOOK_URL not set — brief stored but not posted');
    return NextResponse.json({
      ok: false,
      reason: 'SLACK_WEBHOOK_URL not set',
      posted: false,
      missingReports,
      briefLength: brief.length,
    });
  }

  const slackResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: brief }),
  });

  if (!slackResponse.ok) {
    const detail = (await slackResponse.text()).slice(0, 150);
    console.error(`Morning brief: Slack post failed ${slackResponse.status}: ${detail}`);
    return NextResponse.json(
      {
        ok: false,
        reason: `Slack post failed: HTTP ${slackResponse.status}`,
        posted: false,
        missingReports,
        briefLength: brief.length,
      },
      { status: 500 }
    );
  }

  console.log(`[Morning Brief] Posted for ${today}: ${brief.length} chars, ${missingReports.length} missing reports`);

  return NextResponse.json({
    ok: true,
    posted: true,
    missingReports,
    briefLength: brief.length,
  });
});
