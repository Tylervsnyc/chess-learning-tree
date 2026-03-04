import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { DripDay3LeftOff } from '@/lib/email/templates/DripDay3LeftOff';
import { DripDay5Streak } from '@/lib/email/templates/DripDay5Streak';
import { DripDay7Premium } from '@/lib/email/templates/DripDay7Premium';
import { verifyCronSecret } from '@/lib/cron-auth';
import { createServiceClient } from '@/lib/supabase/service';
import type { EmailType } from '@/types/email';

// Map level number to human-readable name
const LEVEL_NAMES: Record<string, string> = {
  '1': 'Level 1 — Begin to Believe',
  '2': 'Level 2',
  '3': 'Level 3',
  '4': 'Level 4',
  '5': 'Level 5',
  '6': 'Level 6',
  '7': 'Level 7',
  '8': 'Level 8',
};

function parsePosition(position: string): { level: string; lesson: string } {
  const parts = position.split('.');
  const levelNum = parts[0] || '1';
  const sectionNum = parts[1] || '1';
  const lessonNum = parts[2] || '1';
  return {
    level: LEVEL_NAMES[levelNum] || `Level ${levelNum}`,
    lesson: `Section ${sectionNum}, Lesson ${lessonNum}`,
  };
}

interface DripDay {
  day: number;
  emailType: EmailType;
}

const DRIP_DAYS: DripDay[] = [
  { day: 3, emailType: 'drip_day3' },
  { day: 5, emailType: 'drip_day5' },
  { day: 7, emailType: 'drip_day7' },
];

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const appUrl = getAppUrl();
    const today = new Date();

    const results: Record<string, { sent: number; skipped: number; errors: number }> = {};

    for (const { day, emailType } of DRIP_DAYS) {
      const dayResults = { sent: 0, skipped: 0, errors: 0 };
      results[`day_${day}`] = dayResults;

      // Day 3: find users inactive for 3+ days (last_activity_date)
      // Day 5/7: still based on signup date
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() - day);
      const targetDateStr = targetDate.toISOString().split('T')[0];

      let users, error;

      if (day === 3) {
        // Users whose last activity was exactly 3 days ago
        ({ data: users, error } = await supabase
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
          .gte('last_activity_date', `${targetDateStr}T00:00:00.000Z`)
          .lt('last_activity_date', `${targetDateStr}T23:59:59.999Z`));
      } else {
        // Day 5/7: users who signed up on the target date
        ({ data: users, error } = await supabase
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
          .gte('created_at', `${targetDateStr}T00:00:00.000Z`)
          .lt('created_at', `${targetDateStr}T23:59:59.999Z`));
      }

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

        // Day 7: skip premium users
        if (day === 7 && user.subscription_status === 'premium') {
          dayResults.skipped++;
          continue;
        }

        const displayName = user.display_name || 'Chess Player';
        const unsubscribeUrl = getUnsubscribeUrl(user.id, emailType);

        let subject: string;
        let react: React.ReactElement;

        switch (day) {
          case 3: {
            subject = 'You Made Rookie Cry!';
            react = DripDay3LeftOff({
              displayName,
              currentLevel: '',
              currentLesson: '',
              appUrl,
              unsubscribeUrl,
            });
            break;
          }
          case 5: {
            subject = 'Have you met the Daily Rook? 22 puzzles, one shot.';
            react = DripDay5Streak({
              displayName,
              appUrl,
              unsubscribeUrl,
            });
            break;
          }
          case 7: {
            subject = 'Ready to unlock your full chess potential?';
            react = DripDay7Premium({
              displayName,
              appUrl,
              unsubscribeUrl,
            });
            break;
          }
          default:
            continue;
        }

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
}
