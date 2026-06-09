import * as React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { DripDay3LeftOff } from '@/lib/email/templates/DripDay3LeftOff';
import { DripDay1 } from '@/lib/email/templates/DripDay1';
import { DripDay7 } from '@/lib/email/templates/DripDay7';
import { Winback } from '@/lib/email/templates/Winback';
import { withCronHeartbeat } from '@/lib/cron/heartbeat';
import { createServiceClient } from '@/lib/supabase/service';
import {
  fetchActivityByUser,
  fetchFirstActivityByUser,
  fetchSolverSet,
  currentStreakFromDays,
} from '@/lib/streak/activity';
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
  created_at: string;
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
    // Shared targeting data (CHE-368): all selection runs on DERIVED activity
    // from the real activity tables, never profiles.current_streak /
    // last_activity_date — those columns drifted into ghost data (repaired
    // 2026-06-09) and games/workouts/openings never updated them anyway.
    // ----------------------------------------------------------------------
    const PROFILE_SELECT = `
      id,
      email,
      display_name,
      created_at,
      current_position,
      email_preferences (
        marketing,
        unsubscribed_all
      )
    ` as const;

    const [activityByUser, firstActivityByUser, solverSet, profilesRes] = await Promise.all([
      fetchActivityByUser(supabase),
      fetchFirstActivityByUser(supabase),
      fetchSolverSet(supabase),
      supabase.from('profiles').select(PROFILE_SELECT).not('email', 'is', null),
    ]);

    if (profilesRes.error) {
      console.error('Drip profiles query error:', profilesRes.error);
      return NextResponse.json({ error: 'profiles read failed' }, { status: 500 });
    }
    const allProfiles = (profilesRes.data ?? []) as unknown as LifecycleUser[];
    const todayUtc = today.toISOString().split('T')[0];

    // ----------------------------------------------------------------------
    // Existing day-3 drip (last finished unit exactly N days ago)
    // ----------------------------------------------------------------------
    for (const { day, emailType } of DRIP_DAYS) {
      const dayResults = { sent: 0, skipped: 0, errors: 0 };
      results[`day_${day}`] = dayResults;

      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() - day);
      const targetDateStr = targetDate.toISOString().split('T')[0];

      // Users whose last finished unit was exactly `day` days ago (derived).
      const users = allProfiles.filter(
        (u) => activityByUser.get(u.id)?.lastDay === targetDateStr,
      );

      for (const user of users) {
        // Check email preferences
        if (!user.email || isOptedOut(user)) {
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

    // --- day1: the D1 return trigger (CHE-368) ---
    // Fires ~20-48h after the user's FIRST activity (any engagement, incl. raw
    // puzzle attempts; falls back to signup time if they never touched
    // anything). Targets NON-SOLVERS only — the aha-moment is solving 1 puzzle
    // within 48h (D7 50% vs 12%), so the email deep-links to ONE easy puzzle
    // (/solve), not the home screen. The 28h-wide window plus the email_log
    // dedup in processLifecycle guarantees at-most-once even though the cron
    // only runs daily.
    {
      const windowStart = new Date(today.getTime() - 48 * 3600 * 1000).toISOString();
      const windowEnd = new Date(today.getTime() - 20 * 3600 * 1000).toISOString();

      const eligible = allProfiles.filter((u) => {
        const first = firstActivityByUser.get(u.id) ?? u.created_at;
        if (!first || first < windowStart || first >= windowEnd) return false;
        return !solverSet.has(u.id);
      });

      await processLifecycle('day_1', 'drip_day1', eligible, (user) => ({
        subject: 'One Move. One Win.',
        react: DripDay1({
          displayName: user.display_name || undefined,
          appUrl,
          unsubscribeUrl: getUnsubscribeUrl(user.id, 'drip_day1'),
        }),
        metadata: {
          lifecycle: 'day1',
          trigger: 'first_activity_20h',
          current_position: user.current_position,
        },
      }));
    }

    // --- day7: signed up ~7 days ago (week-one check-in) ---
    // created_at in [8 days ago, 7 days ago). Streak shown is DERIVED from
    // real activity — never profiles.current_streak (ghost data, CHE-368).
    {
      const users = allProfiles.filter(
        (u) => u.created_at >= startOfWindow(8) && u.created_at < startOfWindow(7),
      );

      await processLifecycle('day_7', 'drip_day7', users, (user) => {
        const streak = currentStreakFromDays(
          activityByUser.get(user.id)?.days ?? [],
          todayUtc,
        );
        return {
          subject: 'One Week In — How Are We Doing?',
          react: DripDay7({
            displayName: user.display_name || undefined,
            appUrl,
            unsubscribeUrl: getUnsubscribeUrl(user.id, 'drip_day7'),
            currentStreak: streak > 0 ? streak : undefined,
          }),
          metadata: {
            lifecycle: 'day7',
            current_streak: streak,
            current_position: user.current_position,
          },
        };
      });
    }

    // --- winback: inactive 14+ days ---
    // Derived last finished unit <= today - 14. Users with no finished unit
    // ever are excluded (nothing to win back; day1 already covered them).
    // Exclude brand-new accounts so this can never collide with the day1/day7
    // windows (belt-and-suspenders; a 14d-inactive user is older anyway).
    {
      const inactiveCutoff = new Date(today);
      inactiveCutoff.setDate(inactiveCutoff.getDate() - WINBACK_INACTIVE_DAYS);
      const inactiveCutoffStr = inactiveCutoff.toISOString().split('T')[0];

      const users = allProfiles.filter((u) => {
        const lastDay = activityByUser.get(u.id)?.lastDay ?? null;
        return lastDay !== null && lastDay <= inactiveCutoffStr && u.created_at < startOfWindow(8);
      });

      await processLifecycle('winback', 'winback', users, (user) => ({
        subject: 'The Board’s Still Set Up',
        react: Winback({
          displayName: user.display_name || undefined,
          appUrl,
          unsubscribeUrl: getUnsubscribeUrl(user.id, 'winback'),
        }),
        metadata: {
          lifecycle: 'winback',
          last_activity_day: activityByUser.get(user.id)?.lastDay ?? null,
        },
      }));
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
