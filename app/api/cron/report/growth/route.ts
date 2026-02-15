import { NextRequest, NextResponse } from 'next/server';
import { verifyCronSecret } from '@/lib/cron-auth';
import { createServiceClient } from '@/lib/supabase/service';
import { queryPostHog } from '@/lib/posthog-server';

interface Suggestion {
  priority: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  action: string;
}

async function safeQuery(hogql: string, label: string): Promise<unknown[][] | null> {
  try {
    const result = await queryPostHog(hogql);
    return result.results;
  } catch (err) {
    console.error(`Growth report: ${label} query failed:`, err);
    return null;
  }
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const today = new Date().toISOString().split('T')[0];
  const metrics: Record<string, number | null> = {};
  const suggestions: Suggestion[] = [];
  const errors: string[] = [];

  // --- Paywall conversion rate (7d) ---
  const paywallFunnel = await safeQuery(
    `SELECT
      countIf(event = 'paywall_viewed') as paywall_views,
      countIf(event = 'checkout_completed') as checkouts
    FROM events
    WHERE event IN ('paywall_viewed', 'checkout_completed')
      AND timestamp >= today() - interval 7 day AND timestamp < today()`,
    'paywall_funnel'
  );
  if (paywallFunnel && paywallFunnel[0]) {
    const views = Number(paywallFunnel[0][0] ?? 0);
    const checkouts = Number(paywallFunnel[0][1] ?? 0);
    metrics.paywall_conversion_rate = views > 0
      ? Math.round((checkouts / views) * 10000) / 100
      : null;
  } else {
    metrics.paywall_conversion_rate = null;
    errors.push('paywall_funnel');
  }

  // --- Signup to lesson rate (7d) ---
  const signupToLesson = await safeQuery(
    `WITH signups AS (
      SELECT distinct_id
      FROM events
      WHERE event = 'signup_completed'
        AND timestamp >= today() - interval 7 day AND timestamp < today()
    ),
    lesson_completers AS (
      SELECT DISTINCT distinct_id
      FROM events
      WHERE event = 'lesson_completed'
        AND timestamp >= today() - interval 7 day AND timestamp < today()
    )
    SELECT
      count() as total_signups,
      countIf(s.distinct_id IN (SELECT distinct_id FROM lesson_completers)) as completed_lesson
    FROM signups s`,
    'signup_to_lesson'
  );
  if (signupToLesson && signupToLesson[0]) {
    const totalSignups = Number(signupToLesson[0][0] ?? 0);
    const completedLesson = Number(signupToLesson[0][1] ?? 0);
    metrics.signup_to_lesson_rate = totalSignups > 0
      ? Math.round((completedLesson / totalSignups) * 10000) / 100
      : null;
  } else {
    metrics.signup_to_lesson_rate = null;
    errors.push('signup_to_lesson');
  }

  // --- Lesson to subscriber rate (7d) ---
  const lessonToSub = await safeQuery(
    `WITH lesson_users AS (
      SELECT DISTINCT distinct_id
      FROM events
      WHERE event = 'lesson_completed'
        AND timestamp >= today() - interval 7 day AND timestamp < today()
    ),
    subscribers AS (
      SELECT DISTINCT distinct_id
      FROM events
      WHERE event = 'checkout_completed'
        AND timestamp >= today() - interval 7 day AND timestamp < today()
    )
    SELECT
      count() as total_lesson_users,
      countIf(l.distinct_id IN (SELECT distinct_id FROM subscribers)) as subscribed
    FROM lesson_users l`,
    'lesson_to_sub'
  );
  if (lessonToSub && lessonToSub[0]) {
    const totalLessonUsers = Number(lessonToSub[0][0] ?? 0);
    const subscribed = Number(lessonToSub[0][1] ?? 0);
    metrics.lesson_to_subscriber_rate = totalLessonUsers > 0
      ? Math.round((subscribed / totalLessonUsers) * 10000) / 100
      : null;
  } else {
    metrics.lesson_to_subscriber_rate = null;
    errors.push('lesson_to_sub');
  }

  // --- Share count (7d) ---
  const shareCount = await safeQuery(
    `SELECT count() FROM events WHERE event = 'share_initiated' AND timestamp >= today() - interval 7 day AND timestamp < today()`,
    'share_count'
  );
  if (shareCount) {
    metrics.share_count_7d = Number(shareCount[0]?.[0] ?? 0);
  } else {
    metrics.share_count_7d = null;
    errors.push('share_count');
  }

  // --- Previous week shares for trend ---
  const shareCountPrev = await safeQuery(
    `SELECT count() FROM events WHERE event = 'share_initiated' AND timestamp >= today() - interval 14 day AND timestamp < today() - interval 7 day`,
    'share_count_prev'
  );

  // --- Referral signups (7d) ---
  const referralSignups = await safeQuery(
    `SELECT count() FROM events WHERE event = 'signup_completed' AND properties."$referring_domain" IS NOT NULL AND properties."$referring_domain" != '' AND timestamp >= today() - interval 7 day AND timestamp < today()`,
    'referral_signups'
  );
  if (referralSignups) {
    metrics.referral_signups_7d = Number(referralSignups[0]?.[0] ?? 0);
  } else {
    metrics.referral_signups_7d = null;
    errors.push('referral_signups');
  }

  // --- Generate suggestions ---
  if (typeof metrics.paywall_conversion_rate === 'number' && metrics.paywall_conversion_rate < 3) {
    suggestions.push({
      priority: 'high',
      title: 'Low paywall conversion',
      detail: `Paywall converting at only ${metrics.paywall_conversion_rate}% — test different copy or pricing`,
      action: 'Run A/B test on paywall messaging and pricing tiers',
    });
  }

  if (typeof metrics.signup_to_lesson_rate === 'number') {
    if (metrics.signup_to_lesson_rate > 70) {
      suggestions.push({
        priority: 'low',
        title: 'Strong onboarding',
        detail: `${metrics.signup_to_lesson_rate}% of signups complete a lesson — great first experience`,
        action: 'Maintain current onboarding flow',
      });
    }
    if (metrics.signup_to_lesson_rate < 30) {
      suggestions.push({
        priority: 'high',
        title: 'Weak onboarding',
        detail: `Only ${metrics.signup_to_lesson_rate}% of signups try a lesson — onboarding needs work`,
        action: 'Redesign post-signup flow to guide users to first lesson',
      });
    }
  }

  if (metrics.share_count_7d != null && shareCountPrev && shareCountPrev[0]) {
    const prevShares = Number(shareCountPrev[0][0] ?? 0);
    if (prevShares > 0 && metrics.share_count_7d > prevShares) {
      const changePct = Math.round(((metrics.share_count_7d - prevShares) / prevShares) * 100);
      suggestions.push({
        priority: 'low',
        title: 'Shares growing',
        detail: `Shares up ${changePct}% — organic growth is working`,
        action: 'Continue investing in share-worthy content and features',
      });
    }
  }

  // --- Store report ---
  await supabase
    .from('dashboard_reports')
    .delete()
    .eq('report_type', 'growth')
    .eq('period', today);

  const { error: insertError } = await supabase
    .from('dashboard_reports')
    .insert({
      report_type: 'growth',
      generated_at: new Date().toISOString(),
      period: today,
      metrics,
      suggestions,
      raw_data: { errors },
    });

  if (insertError) {
    console.error('Growth report: failed to store:', insertError);
    return NextResponse.json(
      { error: `Failed to store report: ${insertError.message}` },
      { status: 500 }
    );
  }

  console.log(`[Growth Report] Generated for ${today}: paywall_conv=${metrics.paywall_conversion_rate}%, signup_to_lesson=${metrics.signup_to_lesson_rate}%, ${suggestions.length} suggestions`);

  return NextResponse.json({
    success: true,
    report_type: 'growth',
    period: today,
    metrics,
    suggestions,
    errors: errors.length > 0 ? errors : undefined,
  });
}
