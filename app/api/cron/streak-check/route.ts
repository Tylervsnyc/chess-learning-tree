import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { StreakWarning } from '@/lib/email/templates/StreakWarning';
import { StreakLost } from '@/lib/email/templates/StreakLost';

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error('CRON_SECRET not configured');
    return false;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

// Create service role client
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase configuration missing');
  }

  return createClient(url, serviceKey);
}

export async function GET(request: NextRequest) {
  // Verify cron authorization
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getServiceClient();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

    // Find users who:
    // 1. Played yesterday but not today (streak at risk)
    // 2. Played two days ago but not yesterday (streak lost)
    const { data: users, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        display_name,
        current_streak,
        best_streak,
        last_played_date,
        email_preferences (
          streak_warnings,
          unsubscribed_all
        )
      `)
      .gt('current_streak', 0)
      .not('email', 'is', null);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const results = {
      warnings_sent: 0,
      lost_sent: 0,
      skipped: 0,
      errors: 0,
    };

    const appUrl = getAppUrl();

    for (const user of users || []) {
      const prefs = user.email_preferences?.[0] || user.email_preferences;
      const lastPlayed = user.last_played_date;

      // Skip if user has opted out
      if (prefs?.unsubscribed_all || prefs?.streak_warnings === false) {
        results.skipped++;
        continue;
      }

      // Determine which email to send
      if (lastPlayed === yesterday) {
        // Streak at risk - played yesterday, hasn't played today
        const result = await sendEmail({
          to: user.email,
          userId: user.id,
          type: 'streak_warning',
          subject: `⚡ Your ${user.current_streak}-day streak is at risk!`,
          react: StreakWarning({
            displayName: user.display_name || 'Chess Player',
            currentStreak: user.current_streak,
            appUrl,
            unsubscribeUrl: getUnsubscribeUrl(user.id, 'streak_warning'),
          }),
          metadata: { streak: user.current_streak },
        });

        if (result.success) {
          results.warnings_sent++;
        } else {
          results.errors++;
        }
      } else if (lastPlayed === twoDaysAgo) {
        // Streak lost - last played 2 days ago
        const lostStreak = user.current_streak;

        // Update the user's streak to 0
        await supabase
          .from('profiles')
          .update({ current_streak: 0 })
          .eq('id', user.id);

        const result = await sendEmail({
          to: user.email,
          userId: user.id,
          type: 'streak_lost',
          subject: `Your ${lostStreak}-day streak ended`,
          react: StreakLost({
            displayName: user.display_name || 'Chess Player',
            lostStreak,
            appUrl,
            unsubscribeUrl: getUnsubscribeUrl(user.id, 'streak_lost'),
          }),
          metadata: { lostStreak },
        });

        if (result.success) {
          results.lost_sent++;
        } else {
          results.errors++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
