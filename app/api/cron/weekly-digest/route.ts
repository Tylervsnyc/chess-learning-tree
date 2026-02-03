import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { WeeklyDigest } from '@/lib/email/templates/WeeklyDigest';

// Verify cron secret
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  return authHeader === `Bearer ${cronSecret}`;
}

// Create service role client
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Supabase configuration missing');
  return createClient(url, serviceKey);
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getServiceClient();
    const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

    // Get all users with their email preferences
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        display_name,
        current_streak,
        email_preferences (
          weekly_digest,
          unsubscribed_all
        )
      `)
      .not('email', 'is', null);

    if (usersError) {
      console.error('Database error:', usersError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const results = {
      sent: 0,
      skipped: 0,
      errors: 0,
    };

    const appUrl = getAppUrl();

    for (const user of users || []) {
      const prefs = user.email_preferences?.[0] || user.email_preferences;

      // Skip if user has opted out
      if (prefs?.unsubscribed_all || prefs?.weekly_digest === false) {
        results.skipped++;
        continue;
      }

      // Get user's puzzle attempts for the week
      const { data: attempts } = await supabase
        .from('puzzle_attempts')
        .select('correct, themes, rating')
        .eq('user_id', user.id)
        .gte('attempted_at', oneWeekAgo);

      const puzzlesSolved = attempts?.filter(a => a.correct).length || 0;
      const totalAttempts = attempts?.length || 0;
      const accuracy = totalAttempts > 0
        ? Math.round((puzzlesSolved / totalAttempts) * 100)
        : 0;

      // Calculate ELO change (simplified - compare to start of week)
      // For now, we'll use 0 as we don't track historical ELO
      const eloChange = 0;

      // Find top theme this week
      const themeCounts: Record<string, number> = {};
      attempts?.filter(a => a.correct).forEach(attempt => {
        attempt.themes?.forEach((theme: string) => {
          themeCounts[theme] = (themeCounts[theme] || 0) + 1;
        });
      });

      const topTheme = Object.entries(themeCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

      const result = await sendEmail({
        to: user.email,
        userId: user.id,
        type: 'weekly_digest',
        subject: `Your Week in Chess: ${puzzlesSolved} puzzles solved`,
        react: WeeklyDigest({
          displayName: user.display_name || 'Chess Player',
          puzzlesSolved,
          accuracy,
          currentStreak: user.current_streak || 0,
          eloChange,
          topTheme,
          appUrl,
          unsubscribeUrl: getUnsubscribeUrl(user.id, 'weekly_digest'),
        }),
        metadata: { puzzlesSolved, accuracy, topTheme },
      });

      if (result.success) {
        results.sent++;
      } else {
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Weekly digest cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
