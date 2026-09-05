import { NextRequest, NextResponse } from 'next/server';
import { withCronHeartbeat } from '@/lib/cron/heartbeat';
import { createServiceClient } from '@/lib/supabase/service';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { fetchSuppressedAddresses, isSuppressed } from '@/lib/email/suppression';
import { BoxingWeeklyTop10, weeklyTop10Subject } from '@/lib/email/templates/BoxingWeeklyTop10';
import { getWeeklyRecap, type WeeklyRecap } from '@/lib/leaderboard/weekly-recap';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

/**
 * GET /api/cron/weekly-top10 — Monday 12:00 UTC (8am ET), see vercel.json.
 *
 * Mails LAST week's Chess Boxing global Top 10 to the WHOLE Chess Path list
 * (every profile with an email), with the shareable board card, the Session
 * of the Week, and where the reader finished.
 *
 * Guardrails:
 * - CB_WEEKLY_TOP10_EMAIL env flag OFF (default) = DRY RUN: computes the recap,
 *   counts recipients, sends nothing, returns { dryRun: true, ... }.
 * - ?dry=1 forces a dry run even with the flag on.
 * - ?to=email sends ONE test to that address (flag must be on). Logged with
 *   test:true so it never blocks the real send.
 * - ?ws=YYYY-MM-DD picks a specific Monday instead of the previous week.
 * - Fewer than 3 competitors → { skipped: 'not_enough_competitors' }.
 * - Dedupe: one per user per week via email_log metadata.weekStart.
 * - Preferences (marketing / unsubscribed_all) are enforced by sendEmail();
 *   bounced addresses are screened via lib/email/suppression.
 */

const MIN_COMPETITORS = 3;
const EMAIL_TYPE = 'cb_weekly_top10' as const;
const UTM = 'utm_source=email&utm_medium=lifecycle&utm_campaign=cb_weekly_top10';

function buildCardUrls(appUrl: string, recap: WeeklyRecap) {
  const rows = recap.top.map((r) => `${r.username}:${r.points}`).join(',');
  const q = new URLSearchParams({ ws: recap.weekStart, rows, total: String(recap.totalCompetitors) });
  if (recap.sessionOfWeek) {
    const s = recap.sessionOfWeek;
    q.set('sow', `${s.username}:${s.points}:${s.accuracyPct}`);
    if (s.perfect) q.set('perfect', '1');
  }
  // One card per recipient: their own handle is the highlighted row.
  const cardUrl = (username?: string | null) => {
    const p = new URLSearchParams(q);
    if (username) p.set('me', username);
    return `${appUrl}/api/og/leaderboard-week?${p.toString()}`;
  };

  return { cardUrl };
}

export const GET = withCronHeartbeat('weekly-top10', async (request: NextRequest) => {
  const url = new URL(request.url);
  const forceDry = url.searchParams.get('dry') === '1';
  const testTo = url.searchParams.get('to');
  const wsParam = url.searchParams.get('ws') || undefined;

  const flagOn = FEATURE_FLAGS.CB_WEEKLY_TOP10_EMAIL;
  const dryRun = forceDry || !flagOn;

  const recap = await getWeeklyRecap(wsParam);
  const top10 = recap.top.map((r) => ({ rank: r.rank, username: r.username, points: r.points }));

  if (recap.totalCompetitors < MIN_COMPETITORS) {
    return NextResponse.json({
      skipped: 'not_enough_competitors',
      weekStart: recap.weekStart,
      totalCompetitors: recap.totalCompetitors,
      top10,
    });
  }

  const appUrl = getAppUrl();
  const { cardUrl } = buildCardUrls(appUrl, recap);
  const leaderboardUrl = `${appUrl}/leaderboard?period=weekly&${UTM}`;
  const rankById = new Map(recap.ranked.map((r) => [r.userId, r]));
  const subject = weeklyTop10Subject(recap.weekStart);

  const supabase = createServiceClient();

  const buildFor = (user: { id: string; display_name: string | null }) => {
    const mine = rankById.get(user.id) ?? null;
    return BoxingWeeklyTop10({
      recap: {
        weekStart: recap.weekStart,
        top: recap.top,
        sessionOfWeek: recap.sessionOfWeek
          ? {
              username: recap.sessionOfWeek.username,
              points: recap.sessionOfWeek.points,
              correct: recap.sessionOfWeek.correct,
              wrong: recap.sessionOfWeek.wrong,
              accuracyPct: recap.sessionOfWeek.accuracyPct,
              perfect: recap.sessionOfWeek.perfect,
            }
          : null,
        totalCompetitors: recap.totalCompetitors,
      },
      recipient: {
        displayName: user.display_name || undefined,
        rank: mine?.rank ?? null,
        points: mine?.points ?? null,
        isTop10: mine ? mine.rank <= recap.top.length : false,
      },
      cardUrl: cardUrl(mine?.username ?? null),
      leaderboardUrl,
      unsubscribeUrl: getUnsubscribeUrl(user.id, EMAIL_TYPE),
    });
  };

  // --- Single test send ---------------------------------------------------
  if (testTo) {
    if (!flagOn) {
      return NextResponse.json(
        { error: 'CB_WEEKLY_TOP10_EMAIL is off — set it to true to send a test', weekStart: recap.weekStart, top10 },
        { status: 400 },
      );
    }
    const { data: prof } = await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('email', testTo)
      .maybeSingle();
    const user = prof
      ? { id: prof.id as string, display_name: (prof.display_name as string | null) ?? null }
      : { id: '', display_name: null };
    const result = await sendEmail({
      to: testTo,
      // A test to an unknown address has no userId (no prefs check, no dedupe).
      userId: user.id || undefined,
      type: EMAIL_TYPE,
      subject,
      react: buildFor(user),
      metadata: { weekStart: recap.weekStart, test: true },
    });
    return NextResponse.json({ test: true, to: testTo, weekStart: recap.weekStart, result, cardUrl: cardUrl(null) });
  }

  // --- The whole list -----------------------------------------------------
  const [profilesRes, suppressed, sentRes] = await Promise.all([
    supabase.from('profiles').select('id, email, display_name').not('email', 'is', null),
    fetchSuppressedAddresses(supabase),
    supabase
      .from('email_log')
      .select('user_id, metadata')
      .eq('email_type', EMAIL_TYPE)
      .eq('status', 'sent')
      .eq('metadata->>weekStart', recap.weekStart),
  ]);
  if (profilesRes.error) {
    console.error('[weekly-top10] profiles read failed', profilesRes.error);
    return NextResponse.json({ error: 'profiles read failed' }, { status: 500 });
  }

  // Test sends carry test:true; they do not count as the real send.
  const alreadySent = new Set<string>();
  for (const r of sentRes.data ?? []) {
    const meta = (r.metadata ?? {}) as { test?: boolean };
    if (r.user_id && meta.test !== true) alreadySent.add(r.user_id as string);
  }

  type Profile = { id: string; email: string; display_name: string | null };
  const recipients: Profile[] = [];
  let skippedSuppressed = 0;
  let skippedDedupe = 0;
  for (const p of (profilesRes.data ?? []) as Profile[]) {
    if (!p.email) continue;
    if (isSuppressed(suppressed, p.email)) { skippedSuppressed++; continue; }
    if (alreadySent.has(p.id)) { skippedDedupe++; continue; }
    recipients.push(p);
  }

  if (dryRun) {
    console.log(
      `[weekly-top10:dry-run] week ${recap.weekStart}: would send to ${recipients.length} (suppressed ${skippedSuppressed}, already sent ${skippedDedupe}); flag=${flagOn}`,
    );
    return NextResponse.json({
      dryRun: true,
      flagOn,
      weekStart: recap.weekStart,
      recipients: recipients.length,
      skippedSuppressed,
      skippedDedupe,
      totalCompetitors: recap.totalCompetitors,
      top10,
      sessionOfWeek: recap.sessionOfWeek,
      cardUrl: cardUrl(null),
    });
  }

  let sent = 0;
  let optedOut = 0;
  let errors = 0;
  for (const p of recipients) {
    const result = await sendEmail({
      to: p.email,
      userId: p.id,
      type: EMAIL_TYPE,
      subject,
      react: buildFor(p),
      metadata: { weekStart: recap.weekStart, rank: rankById.get(p.id)?.rank ?? null },
    });
    if (result.success) sent++;
    else if (result.error === 'User has opted out of this email type') optedOut++;
    else errors++;
  }

  return NextResponse.json({
    dryRun: false,
    weekStart: recap.weekStart,
    sent,
    optedOut,
    errors,
    skippedSuppressed,
    skippedDedupe,
    totalCompetitors: recap.totalCompetitors,
    top10,
    cardUrl: cardUrl(null),
  });
});
