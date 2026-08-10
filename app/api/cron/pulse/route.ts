import { NextResponse } from 'next/server';
import { withCronHeartbeat } from '@/lib/cron/heartbeat';
import { createServiceClient } from '@/lib/supabase/service';
import { queryPostHog } from '@/lib/posthog-server';
import { postToSlack } from '@/lib/slack/notify';

/**
 * PULSE — the real-time watch on chesspath.app, posted to #chessboxing.
 *
 * Everything else we have is daily and batch (morning-brief, the 4 report
 * crons). If the site breaks at 9am we currently find out tomorrow. This runs
 * every 30 minutes and posts ONLY when something is worth knowing, so an empty
 * channel means healthy — the moment it starts chattering on normal days,
 * people stop reading it and the whole thing is worthless.
 *
 * Signals, in priority order:
 *   1. BROKEN   — a cron failed since the last pulse (DB truth, heartbeats).
 *   2. TESTERS  — bouts/signups from the native app (in_native_app), the thing
 *                 that actually matters while TestFlight is going out.
 *   3. TRAFFIC  — this hour's sessions vs the same hour over the last 7 days.
 *
 * Window: fixed PULSE_WINDOW_MIN, matched to the cron schedule. Stateless on
 * purpose — no "last seen" row to drift or double-fire off. A missed run means
 * a gap, not a duplicate storm, which is the right failure direction for an
 * alerting tool.
 *
 * Traffic alerts need a real baseline: below MIN_BASELINE sessions/hour the
 * numbers are noise (we do ~25 visitors/day), so the drop check stays quiet
 * rather than crying wolf every quiet night.
 */

const PULSE_WINDOW_MIN = 30;
const MIN_BASELINE = 5; // sessions/hr — below this, "traffic dropped" is noise
const DROP_RATIO = 0.4; // this hour under 40% of baseline = worth a ping

type Line = { emoji: string; text: string };

/** Crons that errored since the last pulse. DB truth, cheap, never lies. */
async function checkCronFailures(sinceISO: string): Promise<Line[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('cron_heartbeats')
      .select('cron_name, error, created_at')
      .eq('status', 'error')
      .gte('created_at', sinceISO)
      .order('created_at', { ascending: false });
    if (error || !data?.length) return [];
    // One line per distinct cron — a cron failing 3x in 30min is one problem.
    const seen = new Set<string>();
    const lines: Line[] = [];
    for (const row of data as { cron_name: string; error: string | null }[]) {
      if (seen.has(row.cron_name)) continue;
      seen.add(row.cron_name);
      lines.push({
        emoji: ':rotating_light:',
        text: `*${row.cron_name}* cron failed — ${(row.error ?? 'no message').slice(0, 160)}`,
      });
    }
    return lines;
  } catch {
    return [];
  }
}

/** Native-app activity: the TestFlight cohort actually using the thing. */
async function checkAppActivity(sinceISO: string): Promise<Line[]> {
  const lines: Line[] = [];
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from('bout_sessions')
      .select('user_id, points, punches')
      .gte('created_at', sinceISO);
    const bouts = (data ?? []) as { user_id: string; points: number | null; punches: number | null }[];
    if (bouts.length) {
      const fighters = new Set(bouts.map((b) => b.user_id)).size;
      const punches = bouts.reduce((n, b) => n + (b.punches ?? 0), 0);
      lines.push({
        emoji: ':boxing_glove:',
        text: `*${bouts.length} bout${bouts.length === 1 ? '' : 's'}* from ${fighters} fighter${fighters === 1 ? '' : 's'}${punches ? ` · ${punches} punches` : ''}`,
      });
    }
  } catch {
    /* table may not exist yet in this env — silence beats a false alarm */
  }

  // Signups split by app vs web. in_native_app is a PostHog super property
  // registered in PostHogProvider, so it rides on every event from the shell.
  try {
    const { results } = await queryPostHog(`
      SELECT
        countIf(properties.in_native_app = true) AS app,
        count() AS total
      FROM events
      WHERE event = 'signup_completed'
        AND timestamp >= toDateTime('${sinceISO.slice(0, 19).replace('T', ' ')}')
    `);
    const row = (results as unknown[][])[0] ?? [];
    const app = Number(row[0] ?? 0);
    const total = Number(row[1] ?? 0);
    if (total > 0) {
      lines.push({
        emoji: ':tada:',
        text: `*${total} signup${total === 1 ? '' : 's'}*${app ? ` (${app} from the iOS app)` : ''}`,
      });
    }
  } catch {
    /* PostHog unreachable — the cron heartbeat records it, don't double-alert */
  }
  return lines;
}

/** This hour vs the same hour across the previous 7 days. */
async function checkTraffic(): Promise<Line[]> {
  try {
    const { results } = await queryPostHog(`
      SELECT
        uniqIf(properties.$session_id, timestamp >= now() - interval 1 hour) AS now_sessions,
        uniqIf(properties.$session_id,
          timestamp < now() - interval 1 hour
          AND timestamp >= now() - interval 8 day
          AND toHour(timestamp) = toHour(now())
        ) / 7 AS baseline
      FROM events
      WHERE timestamp >= now() - interval 8 day
    `);
    const row = (results as unknown[][])[0] ?? [];
    const nowSessions = Number(row[0] ?? 0);
    const baseline = Number(row[1] ?? 0);
    if (baseline < MIN_BASELINE) return []; // too small to mean anything
    if (nowSessions < baseline * DROP_RATIO) {
      return [{
        emoji: ':chart_with_downwards_trend:',
        text: `Traffic down: *${nowSessions}* sessions this hour vs ~${baseline.toFixed(0)} normal`,
      }];
    }
    if (nowSessions > baseline * 3) {
      return [{
        emoji: ':fire:',
        text: `Traffic spike: *${nowSessions}* sessions this hour vs ~${baseline.toFixed(0)} normal`,
      }];
    }
    return [];
  } catch {
    return [];
  }
}

export const GET = withCronHeartbeat('pulse', async (request) => {
  // ?test=1 forces a post so the Slack pipe itself can be verified. Without it
  // a healthy run and a missing/empty webhook look IDENTICAL (both return
  // posted:false) — and on Vercel an env var that "looks set" may be an empty
  // string, so behavior is the only honest proof. See CLAUDE.md.
  if (new URL(request.url).searchParams.get('test') === '1') {
    const res = await postToSlack('live', ':white_check_mark:  Pulse self-test — the webhook is wired up.');
    return NextResponse.json({ ok: true, test: true, posted: res.ok, reason: res.reason });
  }

  const sinceISO = new Date(Date.now() - PULSE_WINDOW_MIN * 60_000).toISOString();

  const [failures, activity, traffic] = await Promise.all([
    checkCronFailures(sinceISO),
    checkAppActivity(sinceISO),
    checkTraffic(),
  ]);

  const lines = [...failures, ...activity, ...traffic];
  if (lines.length === 0) {
    // Healthy. Say nothing — a channel that pings every 30 minutes gets muted,
    // and a muted channel is the same as no monitoring at all.
    return NextResponse.json({ ok: true, posted: false, checks: 3 });
  }

  const body = lines.map((l) => `${l.emoji}  ${l.text}`).join('\n');
  const posted = await postToSlack('live', body);

  return NextResponse.json({
    ok: true,
    posted: posted.ok,
    reason: posted.reason,
    lines: lines.length,
  });
});
