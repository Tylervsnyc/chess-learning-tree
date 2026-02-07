import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { ReEngagement } from '@/lib/email/templates/ReEngagement';

// Verify cron secret
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  return authHeader === `Bearer ${cronSecret}`;
}

// Create service role client
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Supabase configuration missing');
  return createClient(url, serviceKey);
}

// Calculate days between two dates
function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getServiceClient();
    const today = new Date();

    // Target users who haven't played in 7-14 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0];

    // Find inactive users
    // NOTE: Per RULES.md Section 23, we use last_activity_date (not last_played_date) and removed best_streak
    const { data: users, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        display_name,
        current_streak,
        last_activity_date,
        email_preferences (
          marketing,
          unsubscribed_all
        )
      `)
      .not('email', 'is', null)
      .not('last_activity_date', 'is', null)
      .lte('last_activity_date', sevenDaysAgo)
      .gte('last_activity_date', fourteenDaysAgo);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Also check we haven't sent a re-engagement email recently
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();

    const results = {
      sent: 0,
      skipped: 0,
      errors: 0,
    };

    const appUrl = getAppUrl();

    for (const user of users || []) {
      const prefs = user.email_preferences?.[0] || user.email_preferences;

      // Skip if user has opted out
      if (prefs?.unsubscribed_all || prefs?.marketing === false) {
        results.skipped++;
        continue;
      }

      // Check if we've sent a re-engagement email recently
      const { data: recentEmails } = await supabase
        .from('email_log')
        .select('id')
        .eq('user_id', user.id)
        .eq('email_type', 're_engagement')
        .gte('sent_at', threeDaysAgo)
        .limit(1);

      if (recentEmails && recentEmails.length > 0) {
        results.skipped++;
        continue;
      }

      const lastActivityDate = new Date(user.last_activity_date);
      const daysSinceLastPlay = daysBetween(lastActivityDate, today);

      const result = await sendEmail({
        to: user.email,
        userId: user.id,
        type: 're_engagement',
        subject: 'We miss you at The Chess Path!',
        react: ReEngagement({
          displayName: user.display_name || 'Chess Player',
          daysSinceLastPlay,
          previousStreak: user.current_streak || 0,
          appUrl,
          unsubscribeUrl: getUnsubscribeUrl(user.id, 're_engagement'),
        }),
        metadata: { daysSinceLastPlay, previousStreak: user.current_streak },
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
    console.error('Re-engagement cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
