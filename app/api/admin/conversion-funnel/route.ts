import { NextRequest, NextResponse } from 'next/server';
import { queryPostHog } from '@/lib/posthog-server';
import { verifyAdmin } from '@/lib/admin-auth';

const VALID_PERIODS: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

const STAGE_DEFS = [
  { id: 'ad_traffic', label: 'Ad Traffic', icon: '📢' },
  { id: 'landing', label: 'Landing Page', icon: '🏠' },
  { id: 'signup_page', label: 'Signup Page', icon: '📝' },
  { id: 'signed_up', label: 'Signed Up', icon: '✅' },
  { id: 'first_lesson', label: 'First Lesson', icon: '♟️' },
  { id: 'lesson_done', label: 'Lesson Done', icon: '🎯' },
  { id: 'paywall', label: 'Paywall Hit', icon: '🔒' },
  { id: 'checkout', label: 'Checkout', icon: '💳' },
  { id: 'premium', label: 'Premium', icon: '👑' },
] as const;

async function getAdTraffic(days: number) {
  try {
    const result = await queryPostHog(`
      SELECT countDistinct(distinct_id)
      FROM events
      WHERE event = '$pageview'
        AND timestamp >= now() - interval ${days} day
        AND properties.utm_source IS NOT NULL
        AND properties.utm_source != ''
    `);
    const count = Number(result.results[0]?.[0] ?? 0);
    return count > 0 ? count : null;
  } catch (error) {
    console.error('Failed to fetch ad traffic:', error);
    return null;
  }
}

async function getLandingPageViews(days: number) {
  try {
    const result = await queryPostHog(`
      SELECT countDistinct(distinct_id)
      FROM events
      WHERE event = '$pageview'
        AND timestamp >= now() - interval ${days} day
        AND properties.$pathname = '/'
    `);
    return Number(result.results[0]?.[0] ?? 0);
  } catch (error) {
    console.error('Failed to fetch landing page views:', error);
    return 0;
  }
}

async function getFunnelEvents(days: number) {
  try {
    const result = await queryPostHog(`
      SELECT event, countDistinct(distinct_id) as users
      FROM events
      WHERE event IN (
        'signup_page_viewed', 'signup_completed',
        'lesson_started', 'lesson_completed',
        'paywall_viewed', 'checkout_started', 'checkout_completed'
      )
      AND timestamp >= now() - interval ${days} day
      GROUP BY event
    `);

    return Object.fromEntries(
      result.results.map(r => [r[0] as string, Number(r[1])])
    );
  } catch (error) {
    console.error('Failed to fetch funnel events:', error);
    return {};
  }
}

export async function GET(request: NextRequest) {
  const { isAdmin, error: authError } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: authError },
      { status: authError?.includes('Unauthorized') ? 401 : 403 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get('period') || '30d';
  const days = VALID_PERIODS[period];

  if (!days) {
    return NextResponse.json(
      { error: 'Invalid period. Use 7d, 30d, or 90d.' },
      { status: 400 }
    );
  }

  try {
    const [adTraffic, landingViews, funnelCounts] = await Promise.all([
      getAdTraffic(days),
      getLandingPageViews(days),
      getFunnelEvents(days),
    ]);

    const stageCounts: Record<string, number | null> = {
      ad_traffic: adTraffic,
      landing: landingViews,
      signup_page: funnelCounts['signup_page_viewed'] || 0,
      signed_up: funnelCounts['signup_completed'] || 0,
      first_lesson: funnelCounts['lesson_started'] || 0,
      lesson_done: funnelCounts['lesson_completed'] || 0,
      paywall: funnelCounts['paywall_viewed'] || 0,
      checkout: funnelCounts['checkout_started'] || 0,
      premium: funnelCounts['checkout_completed'] || 0,
    };

    const stages = STAGE_DEFS.map(def => ({
      id: def.id,
      label: def.label,
      icon: def.icon,
      count: stageCounts[def.id] ?? null,
    }));

    return NextResponse.json({
      period,
      stages,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in conversion funnel API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
