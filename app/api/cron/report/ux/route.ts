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
    console.error(`UX report: ${label} query failed:`, err);
    return null;
  }
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const today = new Date().toISOString().split('T')[0];
  const metrics: Record<string, number | string | null> = {};
  const suggestions: Suggestion[] = [];
  const errors: string[] = [];

  // --- Rage clicks in last 24h ---
  const rageClicks = await safeQuery(
    `SELECT count() FROM events WHERE event = '$rageclick' AND timestamp >= today() - interval 1 day`,
    'rage_clicks'
  );
  if (rageClicks) {
    metrics.rage_clicks_24h = Number(rageClicks[0]?.[0] ?? 0);
  } else {
    metrics.rage_clicks_24h = null;
    errors.push('rage_clicks');
  }

  // --- Top rage-clicked element ---
  const topRageElement = await safeQuery(
    `SELECT properties."$el_text", properties."$pathname", count() as cnt FROM events WHERE event = '$rageclick' AND timestamp >= today() - interval 1 day GROUP BY 1, 2 ORDER BY cnt DESC LIMIT 1`,
    'top_rage_element'
  );
  if (topRageElement && topRageElement.length > 0 && topRageElement[0]) {
    const elText = String(topRageElement[0][0] ?? 'unknown');
    const page = String(topRageElement[0][1] ?? 'unknown');
    metrics.top_rage_element = `${elText} on ${page}`;
  } else {
    metrics.top_rage_element = null;
  }

  // --- Highest exit rate page (min 10 views) ---
  const exitRates = await safeQuery(
    `SELECT
      leaves.pathname,
      leaves.leave_count,
      views.view_count,
      leaves.leave_count * 100 / views.view_count as exit_rate
    FROM (
      SELECT properties."$pathname" as pathname, count() as leave_count
      FROM events
      WHERE event = '$pageleave' AND timestamp >= today() - interval 1 day
      GROUP BY pathname
    ) as leaves
    JOIN (
      SELECT properties."$pathname" as pathname, count() as view_count
      FROM events
      WHERE event = '$pageview' AND timestamp >= today() - interval 1 day
      GROUP BY pathname
      HAVING view_count >= 10
    ) as views ON leaves.pathname = views.pathname
    ORDER BY exit_rate DESC
    LIMIT 1`,
    'exit_rates'
  );
  if (exitRates && exitRates.length > 0 && exitRates[0]) {
    metrics.highest_exit_page = String(exitRates[0][0] ?? 'unknown');
    metrics.highest_exit_rate = Math.round(Number(exitRates[0][3] ?? 0) * 100) / 100;
  } else {
    metrics.highest_exit_page = null;
    metrics.highest_exit_rate = null;
    if (!exitRates) errors.push('exit_rates');
  }

  // --- Mobile traffic percentage ---
  const mobilePct = await safeQuery(
    `SELECT countIf(properties."$device_type" = 'Mobile') * 100 / count() FROM events WHERE event = '$pageview' AND timestamp >= today() - interval 1 day`,
    'mobile_pct'
  );
  if (mobilePct) {
    metrics.mobile_pct = Math.round(Number(mobilePct[0]?.[0] ?? 0) * 100) / 100;
  } else {
    metrics.mobile_pct = null;
    errors.push('mobile_pct');
  }

  // --- Error events in last 24h ---
  const errorEvents = await safeQuery(
    `SELECT count() FROM events WHERE event = '$exception' AND timestamp >= today() - interval 1 day`,
    'error_events'
  );
  if (errorEvents) {
    metrics.error_events_24h = Number(errorEvents[0]?.[0] ?? 0);
  } else {
    metrics.error_events_24h = null;
    errors.push('error_events');
  }

  // --- Generate suggestions ---
  if (typeof metrics.rage_clicks_24h === 'number' && metrics.rage_clicks_24h > 10) {
    suggestions.push({
      priority: 'high',
      title: 'Rage clicks detected',
      detail: `${metrics.rage_clicks_24h} rage clicks detected — users are frustrated with ${metrics.top_rage_element || 'unknown element'}`,
      action: 'Investigate the rage-clicked element for usability issues',
    });
  }

  if (typeof metrics.highest_exit_rate === 'number' && metrics.highest_exit_rate > 70) {
    suggestions.push({
      priority: 'medium',
      title: 'High exit rate page',
      detail: `${metrics.highest_exit_page} has ${metrics.highest_exit_rate}% exit rate — users are dropping off here`,
      action: 'Review page content and UX flow for drop-off causes',
    });
  }

  if (typeof metrics.mobile_pct === 'number' && metrics.mobile_pct > 80) {
    suggestions.push({
      priority: 'low',
      title: 'Heavy mobile traffic',
      detail: `${metrics.mobile_pct}% mobile traffic — keep prioritizing mobile-first`,
      action: 'Continue mobile-first development approach',
    });
  }

  if (typeof metrics.error_events_24h === 'number' && metrics.error_events_24h > 5) {
    suggestions.push({
      priority: 'high',
      title: 'Error events spike',
      detail: `${metrics.error_events_24h} error events in last 24h — check error logs`,
      action: 'Review PostHog error recordings and Vercel logs',
    });
  }

  // --- Store report ---
  const { error: upsertError } = await supabase
    .from('dashboard_reports')
    .upsert({
      report_type: 'ux',
      generated_at: new Date().toISOString(),
      period: today,
      metrics,
      suggestions,
      raw_data: { errors },
    }, { onConflict: 'report_type,period' });

  if (upsertError) {
    console.error('UX report: failed to store:', upsertError);
    return NextResponse.json(
      { error: `Failed to store report: ${upsertError.message}` },
      { status: 500 }
    );
  }

  console.log(`[UX Report] Generated for ${today}: rage_clicks=${metrics.rage_clicks_24h}, errors=${metrics.error_events_24h}, ${suggestions.length} suggestions`);

  return NextResponse.json({
    success: true,
    report_type: 'ux',
    period: today,
    metrics,
    suggestions,
    errors: errors.length > 0 ? errors : undefined,
  });
}
