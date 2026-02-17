import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Verify the requesting user is authenticated and has admin privileges
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

const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '107029';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

interface PositionStats {
  position: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

function getDateRange(range: string): string {
  switch (range) {
    case '7d': return '-7d';
    case '30d': return '-30d';
    case '90d': return '-90d';
    default: return '-7d';
  }
}

async function queryPostHogEvents(
  eventName: string,
  dateAfter: string,
): Promise<Record<string, number>> {
  if (!POSTHOG_API_KEY) {
    return {};
  }

  const positionCounts: Record<string, number> = {};

  try {
    // Use PostHog events API to get events with position property
    const url = new URL(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/events`);
    url.searchParams.set('event', eventName);
    url.searchParams.set('after', dateAfter);
    url.searchParams.set('limit', '10000');

    const res = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${POSTHOG_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`PostHog API error for ${eventName}: ${res.status} ${res.statusText}`);
      return {};
    }

    const data = await res.json();
    const events = data.results || [];

    for (const event of events) {
      const position = event.properties?.position || 'unknown';
      positionCounts[position] = (positionCounts[position] || 0) + 1;
    }
  } catch (error) {
    console.error(`Failed to query PostHog for ${eventName}:`, error);
  }

  return positionCounts;
}

export async function GET(request: NextRequest) {
  const { isAdmin, error: authError } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: authError },
      { status: authError?.includes('Unauthorized') ? 401 : 403 }
    );
  }

  const range = request.nextUrl.searchParams.get('range') || '7d';
  const dateAfter = getDateRange(range);

  // Calculate the actual date string for the API
  const now = new Date();
  const daysBack = dateAfter === '-7d' ? 7 : dateAfter === '-30d' ? 30 : 90;
  const afterDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  const afterDateStr = afterDate.toISOString();

  // Query both event types in parallel
  const [impressionsByPosition, clicksByPosition] = await Promise.all([
    queryPostHogEvents('ad_impression', afterDateStr),
    queryPostHogEvents('ad_click', afterDateStr),
  ]);

  // Merge into position stats
  const allPositions = new Set([
    ...Object.keys(impressionsByPosition),
    ...Object.keys(clicksByPosition),
  ]);

  const positions: PositionStats[] = Array.from(allPositions).map((position) => {
    const impressions = impressionsByPosition[position] || 0;
    const clicks = clicksByPosition[position] || 0;
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    return { position, impressions, clicks, ctr };
  });

  // Sort by impressions descending
  positions.sort((a, b) => b.impressions - a.impressions);

  const totalImpressions = positions.reduce((sum, p) => sum + p.impressions, 0);
  const totalClicks = positions.reduce((sum, p) => sum + p.clicks, 0);

  return NextResponse.json({
    positions,
    totalImpressions,
    totalClicks,
    dateRange: range,
  });
}
