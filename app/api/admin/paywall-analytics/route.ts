import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEventCountsByProperty } from '@/lib/posthog-server';

/**
 * Verify the requesting user is authenticated and has admin privileges.
 * Follows the same pattern as app/api/admin/users/route.ts.
 */
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
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

export async function GET(request: NextRequest) {
  // Admin auth check
  const { isAdmin, error: authError } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: authError },
      { status: authError?.includes('Unauthorized') ? 401 : 403 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get('period') || '30d';
  const daysBack = VALID_PERIODS[period];

  if (!daysBack) {
    return NextResponse.json(
      { error: 'Invalid period. Use 7d, 30d, or 90d.' },
      { status: 400 }
    );
  }

  try {
    // Query PostHog for paywall views and checkout completions in parallel
    const [views, conversions] = await Promise.all([
      getEventCountsByProperty('paywall_viewed', 'trigger', daysBack),
      getEventCountsByProperty('checkout_completed', 'trigger', daysBack),
    ]);

    // Build a map of trigger -> { views, conversions, rate }
    const conversionMap = new Map<string, number>();
    for (const c of conversions) {
      conversionMap.set(c.value, c.count);
    }

    // Also include triggers that have conversions but no views (edge case)
    const allTriggers = new Set([
      ...views.map(v => v.value),
      ...conversions.map(c => c.value),
    ]);

    const viewMap = new Map<string, number>();
    for (const v of views) {
      viewMap.set(v.value, v.count);
    }

    const data = Array.from(allTriggers).map(trigger => {
      const viewCount = viewMap.get(trigger) || 0;
      const conversionCount = conversionMap.get(trigger) || 0;
      const rate = viewCount > 0
        ? Math.round((conversionCount / viewCount) * 10000) / 100
        : 0;

      return {
        trigger,
        views: viewCount,
        conversions: conversionCount,
        rate,
      };
    });

    // Sort by views descending
    data.sort((a, b) => b.views - a.views);

    const totalViews = data.reduce((sum, d) => sum + d.views, 0);
    const totalConversions = data.reduce((sum, d) => sum + d.conversions, 0);
    const overallRate = totalViews > 0
      ? Math.round((totalConversions / totalViews) * 10000) / 100
      : 0;

    return NextResponse.json({
      period,
      daysBack,
      data,
      totals: {
        views: totalViews,
        conversions: totalConversions,
        rate: overallRate,
      },
    });
  } catch (error) {
    console.error('Paywall analytics error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
