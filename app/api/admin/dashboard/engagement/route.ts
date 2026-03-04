import { NextRequest, NextResponse } from 'next/server';
import { queryPostHog } from '@/lib/posthog-server';
import { verifyAdmin } from '@/lib/admin-auth';

const VALID_PERIODS: Record<string, number> = {
  '1d': 1,
  '7d': 7,
  '30d': 30,
};

async function getActiveUsers() {
  try {
    const result = await queryPostHog(`
      SELECT
        countDistinctIf(distinct_id, timestamp >= now() - interval 1 day) as dau,
        countDistinctIf(distinct_id, timestamp >= now() - interval 7 day) as wau,
        countDistinctIf(distinct_id, timestamp >= now() - interval 30 day) as mau
      FROM events
      WHERE timestamp >= now() - interval 30 day
    `);
    const row = result.results[0];
    return {
      daily: Number(row?.[0] ?? 0),
      weekly: Number(row?.[1] ?? 0),
      monthly: Number(row?.[2] ?? 0),
    };
  } catch (error) {
    console.error('Failed to fetch active users:', error);
    return null;
  }
}

async function getPeriodMetrics(days: number) {
  try {
    const result = await queryPostHog(`
      SELECT
        countIf(event = 'lesson_started') as lesson_starts,
        countIf(event = 'lesson_completed') as lesson_completions,
        countIf(event = 'daily_challenge_started') as daily_rook_starts,
        countIf(event = 'daily_challenge_completed') as daily_rook_completions,
        countIf(event = 'signup_completed') as signups,
        countIf(event = 'puzzle_solved') as puzzles_solved
      FROM events
      WHERE timestamp >= now() - interval ${days} day
    `);
    const row = result.results[0];
    return {
      lessonStarts: Number(row?.[0] ?? 0),
      lessonCompletions: Number(row?.[1] ?? 0),
      dailyRookStarts: Number(row?.[2] ?? 0),
      dailyRookCompletions: Number(row?.[3] ?? 0),
      signups: Number(row?.[4] ?? 0),
      puzzlesSolved: Number(row?.[5] ?? 0),
    };
  } catch (error) {
    console.error('Failed to fetch period metrics:', error);
    return null;
  }
}

async function getFunnels(days: number) {
  try {
    const result = await queryPostHog(`
      SELECT event, count() as cnt
      FROM events
      WHERE event IN (
        'signup_page_viewed', 'signup_started', 'signup_completed',
        'lesson_started', 'lesson_completed',
        'paywall_viewed', 'pricing_viewed', 'checkout_started', 'checkout_completed',
        'daily_challenge_viewed', 'daily_challenge_started', 'daily_challenge_completed'
      )
      AND timestamp >= now() - interval ${days} day
      GROUP BY event
    `);

    const counts = Object.fromEntries(
      result.results.map(r => [r[0] as string, Number(r[1])])
    );

    return {
      signup: {
        viewed: counts['signup_page_viewed'] || 0,
        started: counts['signup_started'] || 0,
        completed: counts['signup_completed'] || 0,
      },
      lesson: {
        started: counts['lesson_started'] || 0,
        completed: counts['lesson_completed'] || 0,
      },
      subscription: {
        paywallViewed: counts['paywall_viewed'] || 0,
        pricingViewed: counts['pricing_viewed'] || 0,
        checkoutStarted: counts['checkout_started'] || 0,
        paid: counts['checkout_completed'] || 0,
      },
      dailyChallenge: {
        viewed: counts['daily_challenge_viewed'] || 0,
        started: counts['daily_challenge_started'] || 0,
        completed: counts['daily_challenge_completed'] || 0,
      },
    };
  } catch (error) {
    console.error('Failed to fetch funnels:', error);
    return null;
  }
}

async function getRetention() {
  try {
    const result = await queryPostHog(`
      WITH first_seen AS (
        SELECT
          distinct_id,
          min(timestamp) as first_ts
        FROM events
        WHERE timestamp >= now() - interval 60 day
        GROUP BY distinct_id
        HAVING first_ts >= now() - interval 30 day
      ),
      returns AS (
        SELECT
          f.distinct_id,
          f.first_ts,
          countIf(e.timestamp >= f.first_ts + interval 1 day AND e.timestamp < f.first_ts + interval 2 day) > 0 as returned_day1,
          countIf(e.timestamp >= f.first_ts + interval 1 day AND e.timestamp < f.first_ts + interval 8 day) > 0 as returned_day7,
          countIf(e.timestamp >= f.first_ts + interval 1 day AND e.timestamp < f.first_ts + interval 31 day) > 0 as returned_day30
        FROM first_seen f
        LEFT JOIN events e ON f.distinct_id = e.distinct_id
        GROUP BY f.distinct_id, f.first_ts
      )
      SELECT
        count() as total_users,
        countIf(returned_day1) as d1,
        countIf(returned_day7) as d7,
        countIf(returned_day30) as d30
      FROM returns
    `);

    const row = result.results[0];
    const total = Number(row?.[0] ?? 0);
    if (total === 0) {
      return { day1: 0, day7: 0, day30: 0 };
    }

    return {
      day1: Math.round((Number(row?.[1] ?? 0) / total) * 100),
      day7: Math.round((Number(row?.[2] ?? 0) / total) * 100),
      day30: Math.round((Number(row?.[3] ?? 0) / total) * 100),
    };
  } catch (error) {
    console.error('Failed to fetch retention:', error);
    return null;
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
  const period = searchParams.get('period') || '7d';
  const days = VALID_PERIODS[period];

  if (!days) {
    return NextResponse.json(
      { error: 'Invalid period. Use 1d, 7d, or 30d.' },
      { status: 400 }
    );
  }

  try {
    const [activeUsers, metrics, funnels, retention] = await Promise.all([
      getActiveUsers(),
      getPeriodMetrics(days),
      getFunnels(days),
      getRetention(),
    ]);

    return NextResponse.json({
      period,
      activeUsers,
      metrics,
      funnels,
      retention,
    });
  } catch (error) {
    console.error('Error in admin dashboard engagement API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
