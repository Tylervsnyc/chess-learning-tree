import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { DripDay3LeftOff } from '@/lib/email/templates/DripDay3LeftOff';
import { withCronHeartbeat } from '@/lib/cron/heartbeat';
import { createServiceClient } from '@/lib/supabase/service';
import type { EmailType } from '@/types/email';

interface DripDay {
  day: number;
  emailType: EmailType;
}

const DRIP_DAYS: DripDay[] = [
  { day: 3, emailType: 'drip_day3' },
];

export const GET = withCronHeartbeat('drip', async (_request: NextRequest) => {
  try {
    const supabase = createServiceClient();
    const appUrl = getAppUrl();
    const today = new Date();

    const results: Record<string, { sent: number; skipped: number; errors: number }> = {};

    for (const { day, emailType } of DRIP_DAYS) {
      const dayResults = { sent: 0, skipped: 0, errors: 0 };
      results[`day_${day}`] = dayResults;

      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() - day);
      const targetDateStr = targetDate.toISOString().split('T')[0];

      // Users whose last activity was exactly 3 days ago
      const { data: users, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          display_name,
          current_position,
          subscription_status,
          email_preferences (
            marketing,
            unsubscribed_all
          )
        `)
        .not('email', 'is', null)
        .eq('last_activity_date', targetDateStr);

      if (error) {
        console.error(`Database error for day ${day}:`, error);
        dayResults.errors++;
        continue;
      }

      for (const user of users || []) {
        // Check email preferences
        const prefs = user.email_preferences?.[0] || user.email_preferences;
        if (prefs?.unsubscribed_all || prefs?.marketing === false) {
          dayResults.skipped++;
          continue;
        }

        // Check if this drip email was already sent
        const { data: existingEmails } = await supabase
          .from('email_log')
          .select('id')
          .eq('user_id', user.id)
          .eq('email_type', emailType)
          .limit(1);

        if (existingEmails && existingEmails.length > 0) {
          dayResults.skipped++;
          continue;
        }

        const displayName = user.display_name || 'Chess Player';
        const unsubscribeUrl = getUnsubscribeUrl(user.id, emailType);

        const subject = 'You Made Rookie Cry!';
        const react = DripDay3LeftOff({
          displayName,
          currentLevel: '',
          currentLesson: '',
          appUrl,
          unsubscribeUrl,
        });

        const result = await sendEmail({
          to: user.email,
          userId: user.id,
          type: emailType,
          subject,
          react,
          metadata: {
            drip_day: day,
            current_position: user.current_position,
          },
        });

        if (result.success) {
          dayResults.sent++;
        } else {
          dayResults.errors++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Drip campaign cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
