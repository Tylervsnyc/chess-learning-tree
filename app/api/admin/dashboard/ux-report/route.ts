import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { queryPostHog } from '@/lib/posthog-server';

async function verifyAdmin(): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { isAdmin: false, error: 'Unauthorized - please log in' };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { isAdmin: false, error: 'Could not verify admin status' };
    }

    if (!profile.is_admin) {
      return { isAdmin: false, error: 'Forbidden - admin access required' };
    }

    return { isAdmin: true };
  } catch {
    return { isAdmin: false, error: 'Authentication error' };
  }
}

const VALID_PERIODS: Record<string, number> = {
  '1d': 1,
  '7d': 7,
  '30d': 30,
};

interface Issue {
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
}

async function getRageClicks(days: number) {
  try {
    const result = await queryPostHog(`
      SELECT
        properties."$el_text" as element,
        properties."$pathname" as path,
        count() as cnt
      FROM events
      WHERE event = '$rageclick'
        AND timestamp >= now() - interval ${days} day
      GROUP BY element, path
      ORDER BY cnt DESC
      LIMIT 10
    `);

    return result.results.map(r => ({
      element: String(r[0] ?? '(no text)'),
      count: Number(r[2] ?? 0),
      url: String(r[1] ?? ''),
    }));
  } catch (error) {
    console.error('Failed to fetch rage clicks:', error);
    return null;
  }
}

async function getExitPages(days: number) {
  try {
    const result = await queryPostHog(`
      WITH
        leaves AS (
          SELECT properties."$pathname" as path, count() as exits
          FROM events
          WHERE event = '$pageleave'
            AND timestamp >= now() - interval ${days} day
          GROUP BY path
        ),
        views AS (
          SELECT properties."$pathname" as path, count() as pageviews
          FROM events
          WHERE event = '$pageview'
            AND timestamp >= now() - interval ${days} day
          GROUP BY path
        )
      SELECT
        v.path,
        COALESCE(l.exits, 0) as exits,
        v.pageviews,
        COALESCE(l.exits, 0) * 100.0 / v.pageviews as exit_rate
      FROM views v
      LEFT JOIN leaves l ON v.path = l.path
      WHERE v.pageviews >= 10
      ORDER BY exit_rate DESC
      LIMIT 10
    `);

    return result.results.map(r => ({
      path: String(r[0] ?? ''),
      exits: Number(r[1] ?? 0),
      pageviews: Number(r[2] ?? 0),
      exitRate: Math.round(Number(r[3] ?? 0) * 100) / 100,
    }));
  } catch (error) {
    console.error('Failed to fetch exit pages:', error);
    return null;
  }
}

async function getDeviceBreakdown(days: number) {
  try {
    const result = await queryPostHog(`
      SELECT properties."$device_type" as device, count() as cnt
      FROM events
      WHERE event = '$pageview'
        AND timestamp >= now() - interval ${days} day
      GROUP BY device
      ORDER BY cnt DESC
    `);

    const total = result.results.reduce((sum, r) => sum + Number(r[1] ?? 0), 0);
    if (total === 0) return { mobile: 0, desktop: 0, tablet: 0 };

    const deviceMap: Record<string, number> = {};
    for (const r of result.results) {
      const device = String(r[0] ?? 'Unknown').toLowerCase();
      const count = Number(r[1] ?? 0);
      deviceMap[device] = (deviceMap[device] || 0) + count;
    }

    return {
      mobile: Math.round(((deviceMap['mobile'] || 0) / total) * 100),
      desktop: Math.round(((deviceMap['desktop'] || 0) / total) * 100),
      tablet: Math.round(((deviceMap['tablet'] || 0) / total) * 100),
    };
  } catch (error) {
    console.error('Failed to fetch device breakdown:', error);
    return null;
  }
}

async function getTopEvents(days: number) {
  try {
    const result = await queryPostHog(`
      SELECT event, count() as cnt
      FROM events
      WHERE timestamp >= now() - interval ${days} day
        AND event NOT LIKE '$%'
      GROUP BY event
      ORDER BY cnt DESC
      LIMIT 20
    `);

    return result.results.map(r => ({
      event: String(r[0] ?? ''),
      count: Number(r[1] ?? 0),
    }));
  } catch (error) {
    console.error('Failed to fetch top events:', error);
    return null;
  }
}

function deriveIssues(
  rageClicks: { element: string; count: number; url: string }[] | null,
  exitPages: { path: string; exits: number; pageviews: number; exitRate: number }[] | null,
): Issue[] {
  const issues: Issue[] = [];

  if (rageClicks) {
    const totalRage = rageClicks.reduce((sum, r) => sum + r.count, 0);
    if (totalRage > 15) {
      issues.push({
        severity: 'high',
        title: `${totalRage} rage clicks detected`,
        detail: `Most frustrated element: "${rageClicks[0]?.element}" on ${rageClicks[0]?.url} (${rageClicks[0]?.count} clicks)`,
      });
    } else if (totalRage > 5) {
      issues.push({
        severity: 'medium',
        title: `${totalRage} rage clicks detected`,
        detail: `Top element: "${rageClicks[0]?.element}" on ${rageClicks[0]?.url}`,
      });
    }

    for (const rc of rageClicks) {
      if (rc.count >= 5) {
        issues.push({
          severity: 'medium',
          title: `Rage clicks on "${rc.element}"`,
          detail: `${rc.count} rage clicks on ${rc.url}. Element may be unresponsive or confusing.`,
        });
      }
    }
  }

  if (exitPages) {
    for (const page of exitPages) {
      if (page.exitRate > 80 && page.pageviews >= 20) {
        issues.push({
          severity: 'high',
          title: `${page.exitRate}% exit rate on ${page.path}`,
          detail: `${page.exits} exits out of ${page.pageviews} pageviews. Users are leaving from this page.`,
        });
      } else if (page.exitRate > 60 && page.pageviews >= 15) {
        issues.push({
          severity: 'medium',
          title: `${page.exitRate}% exit rate on ${page.path}`,
          detail: `${page.exits} exits out of ${page.pageviews} pageviews.`,
        });
      }
    }
  }

  const order = { high: 0, medium: 1, low: 2 };
  issues.sort((a, b) => order[a.severity] - order[b.severity]);

  return issues;
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
    const [rageClicks, topExitPages, deviceBreakdown, topEvents] = await Promise.all([
      getRageClicks(days),
      getExitPages(days),
      getDeviceBreakdown(days),
      getTopEvents(days),
    ]);

    const issues = deriveIssues(rageClicks, topExitPages);

    return NextResponse.json({
      period,
      rageClicks,
      topExitPages,
      deviceBreakdown,
      topEvents,
      issues,
    });
  } catch (error) {
    console.error('Error in admin dashboard UX report API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
