import { NextRequest, NextResponse } from 'next/server';
import { queryPostHog } from '@/lib/posthog-server';
import { verifyAdmin } from '@/lib/admin-auth';
import { createServiceClient } from '@/lib/supabase/service';

// ---------------------------------------------------------------------------
// Stage definitions (ordered top-to-bottom of the funnel)
// ---------------------------------------------------------------------------

const STAGE_DEFS = [
  { id: 'landing_page', label: 'Landing Page', event: '$pageview', filter: `AND properties.$pathname = '/'` },
  { id: 'tutorial_started', label: 'Tutorial Started', event: 'tutorial_started', filter: '' },
  { id: 'tutorial_completed', label: 'Tutorial Completed', event: 'tutorial_completed', filter: '' },
  { id: 'signup_page', label: 'Signup Page', event: 'signup_page_viewed', filter: '' },
  { id: 'signed_up', label: 'Signed Up', event: 'signup_completed', filter: '' },
  { id: 'onboarding_completed', label: 'Onboarding Done', event: 'onboarding_completed', filter: '' },
  { id: 'first_lesson', label: 'First Lesson', event: 'lesson_started', filter: '' },
  { id: 'lesson_completed', label: 'Lesson Done', event: 'lesson_completed', filter: '' },
  { id: 'paywall_viewed', label: 'Saw Paywall', event: 'paywall_viewed', filter: '' },
  { id: 'checkout_started', label: 'Started Checkout', event: 'checkout_started', filter: '' },
  { id: 'premium_converted', label: 'Premium', event: 'checkout_completed', filter: '' },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

type QueryDef = { key: string; hogql: string };

async function runBatched(queries: QueryDef[]): Promise<Record<string, number>> {
  const results: Record<string, number> = {};
  const batchSize = 3;

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (q) => {
        try {
          const res = await queryPostHog(q.hogql);
          return { key: q.key, value: Number(res.results[0]?.[0] ?? 0) };
        } catch (err) {
          console.error(`PostHog query failed for ${q.key}:`, err);
          return { key: q.key, value: 0 };
        }
      })
    );
    for (const r of batchResults) {
      results[r.key] = r.value;
    }
    if (i + batchSize < queries.length) {
      await sleep(500);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// GET /api/admin/funnel?days=30
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { isAdmin, error: authError } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: authError },
      { status: authError?.includes('Unauthorized') ? 401 : 403 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const daysParam = Math.min(Math.max(parseInt(searchParams.get('days') || '30', 10) || 30, 1), 90);

  try {
    // -----------------------------------------------------------------------
    // 1. Live today's funnel from PostHog
    // -----------------------------------------------------------------------

    const todayDateFilter = `timestamp >= now() - interval 1 day`;

    const todayQueries: QueryDef[] = STAGE_DEFS.map((s) => ({
      key: s.id,
      hogql: `SELECT count(DISTINCT distinct_id) FROM events WHERE event = '${s.event}' ${s.filter} AND ${todayDateFilter}`,
    }));

    // DAU for today
    todayQueries.push({
      key: 'dau',
      hogql: `SELECT count(DISTINCT distinct_id) FROM events WHERE ${todayDateFilter}`,
    });

    // Total users (all time)
    todayQueries.push({
      key: 'total_users',
      hogql: `SELECT count(DISTINCT distinct_id) FROM events`,
    });

    const todayCounts = await runBatched(todayQueries);

    const todayStages = STAGE_DEFS.map((s) => ({
      id: s.id,
      label: s.label,
      count: todayCounts[s.id] ?? 0,
    }));

    // -----------------------------------------------------------------------
    // 2. Historical snapshots from Supabase
    // -----------------------------------------------------------------------

    const supabase = createServiceClient();
    const cutoffDate = new Date();
    cutoffDate.setUTCDate(cutoffDate.getUTCDate() - daysParam);
    const cutoff = cutoffDate.toISOString().split('T')[0];

    const { data: snapshots, error: dbError } = await supabase
      .from('daily_funnel_snapshots')
      .select('*')
      .gte('snapshot_date', cutoff)
      .order('snapshot_date', { ascending: true });

    if (dbError) {
      console.error('Supabase query error:', dbError);
    }

    const rows = snapshots || [];
    const dates = rows.map((r) => r.snapshot_date);

    // Build stages record: stage_id -> array of daily counts
    const stageIds = STAGE_DEFS.map((s) => s.id);
    const stagesHistory: Record<string, number[]> = {};
    for (const sid of stageIds) {
      stagesHistory[sid] = rows.map((r) => r[sid] ?? 0);
    }
    // Also include dau and total_users in history
    stagesHistory['daily_active_users'] = rows.map((r) => r.daily_active_users ?? 0);
    stagesHistory['total_users'] = rows.map((r) => r.total_users ?? 0);

    // -----------------------------------------------------------------------
    // 3. Lessons per day (last N days from PostHog)
    // -----------------------------------------------------------------------

    let lessonsPerDay: { date: string; count: number }[] = [];
    try {
      const lpd = await queryPostHog(`
        SELECT toDate(timestamp) as day, count() as cnt
        FROM events
        WHERE event = 'lesson_completed'
          AND timestamp >= now() - interval ${daysParam} day
        GROUP BY day
        ORDER BY day ASC
      `);
      lessonsPerDay = lpd.results.map((r) => ({
        date: String(r[0]),
        count: Number(r[1]),
      }));
    } catch (err) {
      console.error('Lessons per day query failed:', err);
    }

    // -----------------------------------------------------------------------
    // 4. Top users (most events in last 7 days) — get IDs from PostHog,
    //    then resolve names/emails from Supabase profiles
    // -----------------------------------------------------------------------

    let topUsers: {
      email: string | null;
      displayName: string | null;
      events: number;
      lessons: number;
      dailyRooks: number;
      lastSeen: string;
    }[] = [];

    try {
      const top = await queryPostHog(`
        SELECT
          distinct_id,
          count() as total_events,
          countIf(event = 'lesson_completed') as lessons,
          countIf(event = 'daily_challenge_completed') as daily_rooks,
          max(timestamp) as last_seen
        FROM events
        WHERE timestamp >= now() - interval 7 day
          AND distinct_id NOT LIKE '%$%'
        GROUP BY distinct_id
        ORDER BY total_events DESC
        LIMIT 15
      `);

      const userIds = top.results.map((r) => String(r[0]));

      // Lookup profiles in Supabase
      let profileMap: Record<string, { email: string | null; display_name: string | null }> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, display_name')
          .in('id', userIds);
        if (profiles) {
          for (const p of profiles) {
            profileMap[p.id] = { email: p.email, display_name: p.display_name };
          }
        }
      }

      topUsers = top.results.map((r) => {
        const uid = String(r[0]);
        const profile = profileMap[uid];
        return {
          email: profile?.email ?? null,
          displayName: profile?.display_name ?? null,
          events: Number(r[1]),
          lessons: Number(r[2]),
          dailyRooks: Number(r[3]),
          lastSeen: String(r[4]),
        };
      });
    } catch (err) {
      console.error('Top users query failed:', err);
    }

    // -----------------------------------------------------------------------
    // 5. Churned / at-risk users — active 7-30 days ago, NOT seen in last 7 days
    // -----------------------------------------------------------------------

    let churnedUsers: {
      email: string | null;
      displayName: string | null;
      lastSeen: string;
      totalLessons: number;
    }[] = [];

    try {
      const churned = await queryPostHog(`
        SELECT
          distinct_id,
          max(timestamp) as last_seen,
          countIf(event = 'lesson_completed') as total_lessons
        FROM events
        WHERE distinct_id NOT LIKE '%$%'
        GROUP BY distinct_id
        HAVING last_seen < now() - interval 7 day
          AND last_seen >= now() - interval 30 day
          AND count() >= 5
        ORDER BY total_lessons DESC
        LIMIT 15
      `);

      const churnIds = churned.results.map((r) => String(r[0]));

      let churnProfileMap: Record<string, { email: string | null; display_name: string | null }> = {};
      if (churnIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, display_name')
          .in('id', churnIds);
        if (profiles) {
          for (const p of profiles) {
            churnProfileMap[p.id] = { email: p.email, display_name: p.display_name };
          }
        }
      }

      churnedUsers = churned.results.map((r) => {
        const uid = String(r[0]);
        const profile = churnProfileMap[uid];
        return {
          email: profile?.email ?? null,
          displayName: profile?.display_name ?? null,
          lastSeen: String(r[1]),
          totalLessons: Number(r[2]),
        };
      });
    } catch (err) {
      console.error('Churned users query failed:', err);
    }

    return NextResponse.json({
      today: {
        date: new Date().toISOString().split('T')[0],
        stages: todayStages,
        totalUsers: todayCounts.total_users ?? 0,
        dau: todayCounts.dau ?? 0,
      },
      history: {
        dates,
        stages: stagesHistory,
      },
      lessonsPerDay,
      topUsers,
      churnedUsers,
    });
  } catch (error) {
    console.error('Error in funnel API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
