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
    console.error(`Engagement report: ${label} query failed:`, err);
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

  // --- Lessons yesterday ---
  const lessonsYesterday = await safeQuery(
    `SELECT count() FROM events WHERE event = 'lesson_completed' AND timestamp >= today() - interval 1 day AND timestamp < today()`,
    'lessons_yesterday'
  );
  if (lessonsYesterday) {
    metrics.lessons_yesterday = Number(lessonsYesterday[0]?.[0] ?? 0);
  } else {
    metrics.lessons_yesterday = null;
    errors.push('lessons_yesterday');
  }

  // --- Lessons 7d average ---
  const lessons7d = await safeQuery(
    `SELECT count() / 7 FROM events WHERE event = 'lesson_completed' AND timestamp >= today() - interval 7 day AND timestamp < today()`,
    'lessons_7d_avg'
  );
  if (lessons7d) {
    metrics.lessons_7d_avg = Math.round(Number(lessons7d[0]?.[0] ?? 0) * 100) / 100;
  } else {
    metrics.lessons_7d_avg = null;
    errors.push('lessons_7d_avg');
  }

  // --- Lessons previous 7d (for change %) ---
  const lessonsPrev7d = await safeQuery(
    `SELECT count() / 7 FROM events WHERE event = 'lesson_completed' AND timestamp >= today() - interval 14 day AND timestamp < today() - interval 7 day`,
    'lessons_prev_7d'
  );
  if (lessonsPrev7d && lessons7d) {
    const current = Number(lessons7d[0]?.[0] ?? 0);
    const previous = Number(lessonsPrev7d[0]?.[0] ?? 0);
    metrics.lessons_change_pct = previous > 0
      ? Math.round(((current - previous) / previous) * 10000) / 100
      : null;
  } else {
    metrics.lessons_change_pct = null;
  }

  // --- Daily Rook completions yesterday ---
  const dailyRooksYesterday = await safeQuery(
    `SELECT count() FROM events WHERE event = 'daily_challenge_completed' AND timestamp >= today() - interval 1 day AND timestamp < today()`,
    'daily_rooks_yesterday'
  );
  if (dailyRooksYesterday) {
    metrics.daily_rooks_yesterday = Number(dailyRooksYesterday[0]?.[0] ?? 0);
  } else {
    metrics.daily_rooks_yesterday = null;
    errors.push('daily_rooks_yesterday');
  }

  // --- Daily Rook 7d average ---
  const dailyRooks7d = await safeQuery(
    `SELECT count() / 7 FROM events WHERE event = 'daily_challenge_completed' AND timestamp >= today() - interval 7 day AND timestamp < today()`,
    'daily_rooks_7d_avg'
  );
  if (dailyRooks7d) {
    metrics.daily_rooks_7d_avg = Math.round(Number(dailyRooks7d[0]?.[0] ?? 0) * 100) / 100;
  } else {
    metrics.daily_rooks_7d_avg = null;
    errors.push('daily_rooks_7d_avg');
  }

  // --- Daily Rook previous 7d ---
  const dailyRooksPrev7d = await safeQuery(
    `SELECT count() / 7 FROM events WHERE event = 'daily_challenge_completed' AND timestamp >= today() - interval 14 day AND timestamp < today() - interval 7 day`,
    'daily_rooks_prev_7d'
  );
  if (dailyRooksPrev7d && dailyRooks7d) {
    const current = Number(dailyRooks7d[0]?.[0] ?? 0);
    const previous = Number(dailyRooksPrev7d[0]?.[0] ?? 0);
    metrics.daily_rook_change_pct = previous > 0
      ? Math.round(((current - previous) / previous) * 10000) / 100
      : null;
  } else {
    metrics.daily_rook_change_pct = null;
  }

  // --- Signups yesterday ---
  const signupsYesterday = await safeQuery(
    `SELECT count() FROM events WHERE event = 'signup_completed' AND timestamp >= today() - interval 1 day AND timestamp < today()`,
    'signups_yesterday'
  );
  if (signupsYesterday) {
    metrics.signups_yesterday = Number(signupsYesterday[0]?.[0] ?? 0);
  } else {
    metrics.signups_yesterday = null;
    errors.push('signups_yesterday');
  }

  // --- Signups 7d ---
  const signups7d = await safeQuery(
    `SELECT count() FROM events WHERE event = 'signup_completed' AND timestamp >= today() - interval 7 day AND timestamp < today()`,
    'signups_7d'
  );
  if (signups7d) {
    metrics.signups_7d = Number(signups7d[0]?.[0] ?? 0);
  } else {
    metrics.signups_7d = null;
    errors.push('signups_7d');
  }

  // --- Puzzles solved yesterday ---
  const puzzlesYesterday = await safeQuery(
    `SELECT count() FROM events WHERE event = 'puzzle_solved' AND timestamp >= today() - interval 1 day AND timestamp < today()`,
    'puzzles_solved_yesterday'
  );
  if (puzzlesYesterday) {
    metrics.puzzles_solved_yesterday = Number(puzzlesYesterday[0]?.[0] ?? 0);
  } else {
    metrics.puzzles_solved_yesterday = null;
    errors.push('puzzles_solved_yesterday');
  }

  // --- DAU yesterday ---
  const dauYesterday = await safeQuery(
    `SELECT countDistinct(distinct_id) FROM events WHERE timestamp >= today() - interval 1 day AND timestamp < today()`,
    'active_users_yesterday'
  );
  if (dauYesterday) {
    metrics.active_users_yesterday = Number(dauYesterday[0]?.[0] ?? 0);
  } else {
    metrics.active_users_yesterday = null;
    errors.push('active_users_yesterday');
  }

  // --- Generate suggestions ---
  if (metrics.lessons_yesterday != null && metrics.lessons_7d_avg != null) {
    if (metrics.lessons_7d_avg > 0 && metrics.lessons_yesterday > metrics.lessons_7d_avg * 1.2) {
      suggestions.push({
        priority: 'low',
        title: 'Great lesson day',
        detail: `Great day! ${metrics.lessons_yesterday} lessons completed — 20%+ above average`,
        action: 'Identify what drove engagement and replicate it',
      });
    }
    if (metrics.lessons_7d_avg > 0 && metrics.lessons_yesterday < metrics.lessons_7d_avg * 0.5) {
      suggestions.push({
        priority: 'high',
        title: 'Lesson completions dropped',
        detail: `Lesson completions dropped to ${metrics.lessons_yesterday} — check for issues`,
        action: 'Check for app errors or content issues blocking lesson completion',
      });
    }
  }

  if (metrics.daily_rook_change_pct != null && metrics.daily_rook_change_pct < -20) {
    suggestions.push({
      priority: 'medium',
      title: 'Daily Rook participation down',
      detail: `Daily Rook participation down ${Math.abs(metrics.daily_rook_change_pct)}% — consider promoting it`,
      action: 'Add push notifications or email reminders for Daily Rook',
    });
  }

  if (metrics.signups_7d != null && metrics.signups_yesterday != null) {
    const signupsPrev7d = await safeQuery(
      `SELECT count() FROM events WHERE event = 'signup_completed' AND timestamp >= today() - interval 14 day AND timestamp < today() - interval 7 day`,
      'signups_prev_7d'
    );
    if (signupsPrev7d) {
      const prev = Number(signupsPrev7d[0]?.[0] ?? 0);
      if (prev > 0 && metrics.signups_7d > prev) {
        const changePct = Math.round(((metrics.signups_7d - prev) / prev) * 100);
        suggestions.push({
          priority: 'low',
          title: 'Signups trending up',
          detail: `Signups trending up +${changePct}% — growth channel working`,
          action: 'Continue current marketing and organic growth efforts',
        });
      }
    }
  }

  if (metrics.active_users_yesterday != null && metrics.active_users_yesterday < 10) {
    suggestions.push({
      priority: 'medium',
      title: 'Low daily active users',
      detail: `Only ${metrics.active_users_yesterday} active users yesterday — engagement needs attention`,
      action: 'Review retention flow and re-engagement campaigns',
    });
  }

  // --- Store report ---
  const { error: upsertError } = await supabase
    .from('dashboard_reports')
    .upsert({
      report_type: 'engagement',
      generated_at: new Date().toISOString(),
      period: today,
      metrics,
      suggestions,
      raw_data: { errors },
    }, { onConflict: 'report_type,period' });

  if (upsertError) {
    console.error('Engagement report: failed to store:', upsertError);
    return NextResponse.json(
      { error: `Failed to store report: ${upsertError.message}` },
      { status: 500 }
    );
  }

  console.log(`[Engagement Report] Generated for ${today}: lessons=${metrics.lessons_yesterday}, DAU=${metrics.active_users_yesterday}, ${suggestions.length} suggestions`);

  return NextResponse.json({
    success: true,
    report_type: 'engagement',
    period: today,
    metrics,
    suggestions,
    errors: errors.length > 0 ? errors : undefined,
  });
}
