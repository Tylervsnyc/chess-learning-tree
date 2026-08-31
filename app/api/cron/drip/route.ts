import * as React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { DripDay3LeftOff } from '@/lib/email/templates/DripDay3LeftOff';
import { DripDay1 } from '@/lib/email/templates/DripDay1';
import { DripDay7 } from '@/lib/email/templates/DripDay7';
import { Winback } from '@/lib/email/templates/Winback';
import { BoxingWelcome } from '@/lib/email/templates/BoxingWelcome';
import { BoxingWeeklyReport } from '@/lib/email/templates/BoxingWeeklyReport';
import { BoxingComeback } from '@/lib/email/templates/BoxingComeback';
import { BoxingHighScore } from '@/lib/email/templates/BoxingHighScore';
import { withCronHeartbeat } from '@/lib/cron/heartbeat';
import { createServiceClient } from '@/lib/supabase/service';
import { fetchSuppressedAddresses, isSuppressed } from '@/lib/email/suppression';
import {
  fetchActivityByUser,
  fetchFirstActivityByUser,
  fetchSolverSet,
  fetchBoxingActivityByUser,
  currentStreakFromDays,
} from '@/lib/streak/activity';
import type { BoxingActivity } from '@/lib/streak/activity';
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

// The Chess Boxing lifecycle set gets its OWN flag. EMAIL_LIFECYCLE_ENABLED is
// already 'true' in production, so reusing it would ship all four of these live
// on the first deploy instead of letting us read a dry run first.
const CB_LIFECYCLE_ENABLED = process.env.CB_EMAIL_LIFECYCLE_ENABLED === 'true';

// Window edges, in whole days back from "now", for created_at-based cohorts.
const WINBACK_INACTIVE_DAYS = 14;

// Chess Boxing: the comeback fires after a shorter dark spell than the Chess
// Path winback — a boxer who misses a week has usually left the gym.
const CB_COMEBACK_INACTIVE_DAYS = 7;
// The weekly report needs a real training week, not a single visit.
const CB_WEEKLY_MIN_WORKOUTS = 3;

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

    // Addresses that have already bounced. email_log.status is written 'sent'
    // at send time and only becomes truthful once
    // scripts/sync-email-bounces.ts reconciles it with Resend — without this
    // screen the crons keep mailing dead mailboxes daily, which is exactly how
    // sender reputation erodes.
    const [activityByUser, firstActivityByUser, solverSet, suppressed, profilesRes] =
      await Promise.all([
        fetchActivityByUser(supabase),
        fetchFirstActivityByUser(supabase),
        fetchSolverSet(supabase),
        fetchSuppressedAddresses(supabase),
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
        if (!user.email || isOptedOut(user) || isSuppressed(suppressed, user.email)) {
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
    if (!CB_LIFECYCLE_ENABLED) {
      console.log('[drip] CB_EMAIL_LIFECYCLE_ENABLED is OFF — Chess Boxing emails run as DRY-RUN (no real sends).');
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
      opts?: {
        /**
         * 'once' (default) = never send this type to a user twice, ever.
         * 'daily' = at most once per UTC day (cb_highscore — a new record
         * can legitimately happen again tomorrow).
         * 'weekly' = at most once per rolling 7 days (cb_weekly_report).
         */
        dedupe?: 'once' | 'daily' | 'weekly';
        /** Which kill-switch gates this type. Defaults to EMAIL_LIFECYCLE_ENABLED. */
        enabled?: boolean;
      },
    ) {
      const dedupe = opts?.dedupe ?? 'once';
      const enabled = opts?.enabled ?? LIFECYCLE_ENABLED;
      const res = newLifecycleResult();
      results[key] = res;

      for (const user of users) {
        if (!user.email) {
          res.skipped++;
          continue;
        }

        // Respect marketing preference + global unsubscribe, and never mail an
        // address that has already bounced.
        if (isOptedOut(user) || isSuppressed(suppressed, user.email)) {
          res.skipped++;
          continue;
        }

        // Dedup: never send the same lifecycle email twice (or, for repeating
        // types, twice in one day).
        let dedupeQuery = supabase
          .from('email_log')
          .select('id')
          .eq('user_id', user.id)
          .eq('email_type', emailType);
        if (dedupe === 'daily') {
          dedupeQuery = dedupeQuery.gte('sent_at', `${todayUtc}T00:00:00.000Z`);
        } else if (dedupe === 'weekly') {
          dedupeQuery = dedupeQuery.gte(
            'sent_at',
            new Date(today.getTime() - 7 * 24 * 3600 * 1000).toISOString(),
          );
        }
        const { data: existing } = await dedupeQuery.limit(1);

        if (existing && existing.length > 0) {
          res.skipped++;
          continue;
        }

        const { subject, react, metadata } = build(user);

        // HARD GUARDRAIL: when the flag is OFF, dry-run only. Log what we
        // WOULD send and call sendEmail() for NONE of the lifecycle types.
        if (!enabled) {
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


    // ----------------------------------------------------------------------
    // Chess Boxing lifecycle (cb_highscore / cb_welcome / cb_weekly_report /
    // cb_comeback). Targeting runs on BOXING activity only — bout_sessions +
    // workout_sessions — so a Chess Path user who has never opened /box is
    // never in any of these audiences.
    //
    // Gated behind CB_EMAIL_LIFECYCLE_ENABLED (its own flag; see the top of
    // this file for why it isn't EMAIL_LIFECYCLE_ENABLED).
    // ----------------------------------------------------------------------
    {
      const boxingByUser = await fetchBoxingActivityByUser(supabase);
      const cbOpts = { enabled: CB_LIFECYCLE_ENABLED } as const;
      // Tyler (2026-08-31): only cb_welcome is LIVE for now. The other three
      // stay in dry-run regardless of the flag until their copy is finalized.
      const cbHold = { enabled: false } as const;
      const boxersOnly = allProfiles.filter((u) => boxingByUser.has(u.id));
      const box = (u: LifecycleUser): BoxingActivity => boxingByUser.get(u.id)!;

      // At most ONE Chess Boxing email per person per run. The windows overlap
      // by design, and two emails from the same product on the same morning is
      // how you get unsubscribed. Blocks run in priority order and claim their
      // audience; later blocks only see who is left. Order: the celebration
      // (cb_highscore) beats everything; then the one-time welcome, so a
      // brand-new boxer never gets a weekly report before their welcome; then
      // the weekly report; then the comeback.
      const cbClaimed = new Set<string>();
      const claim = (users: LifecycleUser[]): LifecycleUser[] => {
        const fresh = users.filter((u) => !cbClaimed.has(u.id));
        for (const u of fresh) cbClaimed.add(u.id);
        return fresh;
      };

      // --- cb_highscore: yesterday's best workout score beat every prior day ---
      // dedupe 'daily' = at most one per user per UTC day. The trigger itself
      // only matches the morning after the record, so in practice that is one
      // email per new record.
      {
        const users = claim(
          boxersOnly.filter((u) => {
            const b = box(u);
            return b.yesterdayBestScore > 0 && b.yesterdayBestScore > b.priorBestScore;
          }),
        );

        await processLifecycle('cb_highscore', 'cb_highscore', users, (user) => {
          const b = box(user);
          return {
            subject: `${b.yesterdayBestScore}. New personal best.`,
            react: BoxingHighScore({
              displayName: user.display_name || undefined,
              appUrl,
              unsubscribeUrl: getUnsubscribeUrl(user.id, 'cb_highscore'),
              score: b.yesterdayBestScore,
              previousBest: b.priorBestScore > 0 ? b.priorBestScore : undefined,
            }),
            metadata: {
              lifecycle: 'cb_highscore',
              score: b.yesterdayBestScore,
              previous_best: b.priorBestScore,
            },
          };
        }, { ...cbHold, dedupe: 'daily' });
      }

      // --- cb_welcome: first EVER boxing activity (bout or workout) 20-48h ago ---
      // Same window shape as day1 (28h wide against a daily cron), which the
      // email_log dedup then narrows to at-most-once.
      {
        const windowStart = new Date(today.getTime() - 48 * 3600 * 1000).toISOString();
        const windowEnd = new Date(today.getTime() - 20 * 3600 * 1000).toISOString();

        const users = claim(
          boxersOnly.filter((u) => {
            const first = box(u).firstAt;
            return first !== null && first >= windowStart && first < windowEnd;
          }),
        );

        await processLifecycle('cb_welcome', 'cb_welcome', users, (user) => {
          const b = box(user);
          return {
            subject: 'Welcome to the gym',
            react: BoxingWelcome({
              displayName: user.display_name || undefined,
              appUrl,
              unsubscribeUrl: getUnsubscribeUrl(user.id, 'cb_welcome'),
              result: b.firstBoutResult ?? undefined,
              punches: b.punches > 0 ? b.punches : undefined,
            }),
            metadata: {
              lifecycle: 'cb_welcome',
              first_boxing_at: b.firstAt,
              first_bout_result: b.firstBoutResult,
            },
          };
        }, cbOpts);
      }

      // --- cb_weekly_report: 3+ workouts in the trailing 7 days ---
      // Fires on any day the condition holds; the 'weekly' email_log dedup
      // caps it at one per user per rolling 7 days.
      {
        const users = claim(
          boxersOnly.filter((u) => box(u).recentWorkouts >= CB_WEEKLY_MIN_WORKOUTS),
        );

        await processLifecycle('cb_weekly_report', 'cb_weekly_report', users, (user) => {
          const b = box(user);
          const streak = currentStreakFromDays(
            activityByUser.get(user.id)?.days ?? [],
            todayUtc,
          );
          return {
            subject: 'Your week on the card',
            react: BoxingWeeklyReport({
              displayName: user.display_name || undefined,
              appUrl,
              unsubscribeUrl: getUnsubscribeUrl(user.id, 'cb_weekly_report'),
              workouts: b.recentWorkouts,
              punches: b.recentPunches > 0 ? b.recentPunches : undefined,
              bestRound: b.recentBestRound > 0 ? b.recentBestRound : undefined,
              currentStreak: streak > 0 ? streak : undefined,
              wins: b.recentWins,
              losses: b.recentLosses,
              draws: b.recentDraws,
            }),
            metadata: {
              lifecycle: 'cb_weekly_report',
              workouts_7d: b.recentWorkouts,
              punches_7d: b.recentPunches,
              best_round_7d: b.recentBestRound,
              record_7d: `${b.recentWins}-${b.recentLosses}-${b.recentDraws}`,
            },
          };
        }, { ...cbHold, dedupe: 'weekly' });
      }

      // --- cb_comeback: 7+ days since any boxing ---
      {
        const cutoff = new Date(today);
        cutoff.setDate(cutoff.getDate() - CB_COMEBACK_INACTIVE_DAYS);
        const cutoffStr = cutoff.toISOString().split('T')[0];

        const users = claim(
          boxersOnly.filter((u) => {
            const lastDay = box(u).lastDay;
            return lastDay !== null && lastDay <= cutoffStr && u.created_at < startOfWindow(8);
          }),
        );

        await processLifecycle('cb_comeback', 'cb_comeback', users, (user) => {
          const b = box(user);
          return {
            subject: 'Still your best round',
            react: BoxingComeback({
              displayName: user.display_name || undefined,
              appUrl,
              unsubscribeUrl: getUnsubscribeUrl(user.id, 'cb_comeback'),
              bestRound: b.bestRound > 0 ? b.bestRound : undefined,
              punches: b.punches > 0 ? b.punches : undefined,
              bouts: b.bouts > 0 ? b.bouts : undefined,
            }),
            metadata: { lifecycle: 'cb_comeback', last_boxing_day: b.lastDay },
          };
        }, cbHold);
      }
    }

    return NextResponse.json({
      success: true,
      lifecycleEnabled: LIFECYCLE_ENABLED,
      cbLifecycleEnabled: CB_LIFECYCLE_ENABLED,
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
