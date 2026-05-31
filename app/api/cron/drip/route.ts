import * as React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { DripDay3LeftOff } from '@/lib/email/templates/DripDay3LeftOff';
import { DripDay1 } from '@/lib/email/templates/DripDay1';
import { DripDay7 } from '@/lib/email/templates/DripDay7';
import { Winback } from '@/lib/email/templates/Winback';
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

// --- Lifecycle re-engagement emails (day1 / day7 / winback) ---
// HARD GUARDRAIL: these NEVER send to real users unless EMAIL_LIFECYCLE_ENABLED
// is explicitly set to 'true'. Default is OFF -> dry-run only (console.log the
// recipient + type, call sendEmail() for NONE of these new lifecycle types).
const LIFECYCLE_ENABLED = process.env.EMAIL_LIFECYCLE_ENABLED === 'true';

// Window edges, in whole days back from "now", for created_at-based cohorts.
const WINBACK_INACTIVE_DAYS = 14;

type LifecycleResult = { sent: number; skipped: number; errors: number; dryRun: number };

function newLifecycleResult(): LifecycleResult {
  return { sent: 0, skipped: 0, errors: 0, dryRun: 0 };
}

interface LifecycleUser {
  id: string;
  email: string | null;
  display_name: string | null;
  current_streak: number | null;
  last_activity_date: string | null;
  current_position: string | null;
  email_preferences:
    | { marketing: boolean | null; unsubscribed_all: boolean | null }
    | { marketing: boolean | null; unsubscribed_all: boolean | null }[]
    | null;
}

function isOptedOut(user: LifecycleUser): boolean {
  const prefs = Array.isArray(user.email_preferences)
    ? user.email_preferences[0]
    : user.email_preferences;
  return Boolean(prefs?.unsubscribed_all) || prefs?.marketing === false;
}

export const GET = withCronHeartbeat('drip', async (_request: NextRequest) => {
  try {
    const supabase = createServiceClient();
    const appUrl = getAppUrl();
    const today = new Date();

    const results: Record<string, { sent: number; skipped: number; errors: number; dryRun?: number }> = {};

    // ----------------------------------------------------------------------
    // Existing day-3 drip (activity-based, unchanged behavior — keeps sending)
    // ----------------------------------------------------------------------
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

    // ----------------------------------------------------------------------
    // New lifecycle emails (day1 / day7 / winback)
    // Gated behind EMAIL_LIFECYCLE_ENABLED (defaults OFF -> dry-run only).
    // ----------------------------------------------------------------------
    if (!LIFECYCLE_ENABLED) {
      console.log('[drip] EMAIL_LIFECYCLE_ENABLED is OFF — lifecycle emails run as DRY-RUN (no real sends).');
    }

    const PROFILE_SELECT = `
      id,
      email,
      display_name,
      current_streak,
      last_activity_date,
      current_position,
      email_preferences (
        marketing,
        unsubscribed_all
      )
    ` as const;

    // Compute window boundaries as ISO timestamps.
    const startOfWindow = (daysAgo: number): string => {
      const d = new Date(today);
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString();
    };

    // Helper: shared per-user processing for a lifecycle email.
    async function processLifecycle(
      key: string,
      emailType: EmailType,
      users: LifecycleUser[],
      build: (user: LifecycleUser) => { subject: string; react: React.ReactElement; metadata: Record<string, unknown> },
    ) {
      const res = newLifecycleResult();
      results[key] = res;

      for (const user of users) {
        if (!user.email) {
          res.skipped++;
          continue;
        }

        // Respect marketing preference + global unsubscribe.
        if (isOptedOut(user)) {
          res.skipped++;
          continue;
        }

        // Dedup: never send the same lifecycle email twice.
        const { data: existing } = await supabase
          .from('email_log')
          .select('id')
          .eq('user_id', user.id)
          .eq('email_type', emailType)
          .limit(1);

        if (existing && existing.length > 0) {
          res.skipped++;
          continue;
        }

        const { subject, react, metadata } = build(user);

        // HARD GUARDRAIL: when the flag is OFF, dry-run only. Log what we
        // WOULD send and call sendEmail() for NONE of the lifecycle types.
        if (!LIFECYCLE_ENABLED) {
          console.log(
            `[drip:dry-run] WOULD send ${emailType} to ${user.email} (userId=${user.id})`,
          );
          res.dryRun++;
          continue;
        }

        const result = await sendEmail({
          to: user.email,
          userId: user.id,
          type: emailType,
          subject,
          react,
          metadata,
        });

        if (result.success) {
          res.sent++;
        } else {
          res.errors++;
        }
      }
    }

    // --- day1: signed up ~1 day ago, hasn't come back since signup ---
    // created_at in [2 days ago, 1 day ago). i.e. account is between 1 and 2 days old.
    {
      const { data: users, error } = await supabase
        .from('profiles')
        .select(PROFILE_SELECT)
        .not('email', 'is', null)
        .gte('created_at', startOfWindow(2))
        .lt('created_at', startOfWindow(1));

      if (error) {
        console.error('Lifecycle day1 query error:', error);
        const r = newLifecycleResult();
        r.errors++;
        results.day_1 = r;
      } else {
        const signupCutoff = new Date(today);
        signupCutoff.setDate(signupCutoff.getDate() - 1);
        const signupCutoffStr = signupCutoff.toISOString().split('T')[0];

        // Only users who have NOT returned: no activity, or last activity is on/before signup day.
        const eligible = (users || []).filter((u) => {
          const la = (u as LifecycleUser).last_activity_date;
          return !la || la <= signupCutoffStr;
        }) as LifecycleUser[];

        await processLifecycle('day_1', 'drip_day1', eligible, (user) => ({
          subject: 'Did You Forget About Me Already?',
          react: DripDay1({
            displayName: user.display_name || undefined,
            appUrl,
            unsubscribeUrl: getUnsubscribeUrl(user.id, 'drip_day1'),
          }),
          metadata: { lifecycle: 'day1', current_position: user.current_position },
        }));
      }
    }

    // --- day7: signed up ~7 days ago (week-one check-in) ---
    // created_at in [8 days ago, 7 days ago).
    {
      const { data: users, error } = await supabase
        .from('profiles')
        .select(PROFILE_SELECT)
        .not('email', 'is', null)
        .gte('created_at', startOfWindow(8))
        .lt('created_at', startOfWindow(7));

      if (error) {
        console.error('Lifecycle day7 query error:', error);
        const r = newLifecycleResult();
        r.errors++;
        results.day_7 = r;
      } else {
        await processLifecycle('day_7', 'drip_day7', (users || []) as LifecycleUser[], (user) => ({
          subject: 'One Week In — How Are We Doing?',
          react: DripDay7({
            displayName: user.display_name || undefined,
            appUrl,
            unsubscribeUrl: getUnsubscribeUrl(user.id, 'drip_day7'),
            currentStreak: user.current_streak ?? undefined,
          }),
          metadata: {
            lifecycle: 'day7',
            current_streak: user.current_streak,
            current_position: user.current_position,
          },
        }));
      }
    }

    // --- winback: inactive 14+ days ---
    // last_activity_date <= today - 14. Exclude brand-new accounts so this can
    // never collide with the day1/day7 windows (a 14d-inactive user is older
    // than the day7 window anyway; this guard is belt-and-suspenders).
    {
      const inactiveCutoff = new Date(today);
      inactiveCutoff.setDate(inactiveCutoff.getDate() - WINBACK_INACTIVE_DAYS);
      const inactiveCutoffStr = inactiveCutoff.toISOString().split('T')[0];

      const { data: users, error } = await supabase
        .from('profiles')
        .select(PROFILE_SELECT)
        .not('email', 'is', null)
        .not('last_activity_date', 'is', null)
        .lte('last_activity_date', inactiveCutoffStr)
        // Account must be older than the day7 window to avoid any window overlap.
        .lt('created_at', startOfWindow(8));

      if (error) {
        console.error('Lifecycle winback query error:', error);
        const r = newLifecycleResult();
        r.errors++;
        results.winback = r;
      } else {
        await processLifecycle('winback', 'winback', (users || []) as LifecycleUser[], (user) => ({
          subject: 'The Board’s Still Set Up',
          react: Winback({
            displayName: user.display_name || undefined,
            appUrl,
            unsubscribeUrl: getUnsubscribeUrl(user.id, 'winback'),
          }),
          metadata: { lifecycle: 'winback', last_activity_date: user.last_activity_date },
        }));
      }
    }

    return NextResponse.json({
      success: true,
      lifecycleEnabled: LIFECYCLE_ENABLED,
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
