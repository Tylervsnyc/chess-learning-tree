'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { ProEvents, type ProLimitKind } from '@/lib/analytics/posthog';
import { getTz } from '@/lib/streak-client';
import { ProPaywall } from '@/components/pro/ProPaywall';
import { useUser } from '@/hooks/useUser';
import { PRO_FREE_LIMITS } from '@/lib/subscription';

/**
 * useProGate — the ONE way any surface (Chess Path, Chess Boxing, web) asks
 * "may this free user start another lesson / fight / Puzzle Boxing?" or "is
 * this a Pro feature?" (FEATURE_FLAGS.PRO — Rookie Pro, one subscription
 * across all three apps).
 *
 *   const { gate, requirePro, paywall, isPro } = useProGate();
 *   gate('bout', () => router.push('/box/bout'));   // daily-limit check, then go
 *   // or read limits directly once `ready` (the lesson page: limits.canLesson)
 *   requirePro('custom_rounds', () => setCustom(true)); // Pro feature, else paywall
 *   …
 *   {paywall}                                        // render once in the tree
 *
 * `requirePro(feature)` fires `pro_gate_hit {feature, app}` when a free user
 * bumps into a Pro feature, then opens the paywall with that feature as the
 * trigger — so daily-report.ts can read which gate converts, per app.
 *
 * Flag OFF: `gate` and `requirePro` run the action immediately, `paywall` is
 * null, `isPro` is true, `ready` is true and NOTHING is fetched — zero
 * behaviour change. Limits come fresh from /api/pro/limits on mount and on
 * every gate call (four HEAD counts) so the truth is always
 * the DB, never a client counter. If the endpoint fails, the action runs —
 * never block a fight over a stat line.
 */

/**
 * Every Pro-only feature a surface can gate on. Add here first — the union is
 * what keeps `pro_gate_hit.feature` a closed, reportable set.
 *   Chess Path: review (the day's free full review is used) / variations ("Try it")
 *   Chess Boxing: custom_rounds, history, settings, profile, bout, workout,
 *                 report / fixit (workout report lines + Fix-It)
 * Daily limits (lessons, reviews, fights, Puzzle Boxing) go through `gate` /
 * the `limit_<kind>` trigger instead.
 */
export type ProGateFeature =
  | 'review'
  | 'variations'
  | 'report'
  | 'fixit'
  | 'custom_rounds'
  | 'history'
  | 'settings'
  | 'profile'
  | 'bout'
  | 'workout';

export interface ProLimitsState {
  isPro: boolean;
  lessonsToday: number;
  reviewsToday: number;
  boutsToday: number;
  workoutsToday: number;
  lessonLimit: number;
  reviewLimit: number;
  boutLimit: number;
  workoutLimit: number;
  canLesson: boolean;
  canReview: boolean;
  canBout: boolean;
  canWorkout: boolean;
  authenticated: boolean;
}

const OPEN: ProLimitsState = {
  isPro: true,
  lessonsToday: 0,
  reviewsToday: 0,
  boutsToday: 0,
  workoutsToday: 0,
  lessonLimit: PRO_FREE_LIMITS.LESSONS_PER_DAY,
  reviewLimit: PRO_FREE_LIMITS.REVIEWS_PER_DAY,
  boutLimit: PRO_FREE_LIMITS.BOUTS_PER_DAY,
  workoutLimit: PRO_FREE_LIMITS.WORKOUTS_PER_DAY,
  canLesson: true,
  canReview: true,
  canBout: true,
  canWorkout: true,
  authenticated: false,
};

const CAN: Record<ProLimitKind, keyof ProLimitsState> = {
  lesson: 'canLesson',
  review: 'canReview',
  bout: 'canBout',
  workout: 'canWorkout',
};

export async function fetchProLimits(): Promise<ProLimitsState> {
  try {
    const res = await fetch(`/api/pro/limits?tz=${encodeURIComponent(getTz())}`, { cache: 'no-store' });
    if (!res.ok) return OPEN;
    const d = await res.json();
    return {
      isPro: !!d.isPro,
      lessonsToday: d.lessonsToday ?? 0,
      reviewsToday: d.reviewsToday ?? 0,
      boutsToday: d.boutsToday ?? 0,
      workoutsToday: d.workoutsToday ?? 0,
      lessonLimit: d.lessonLimit ?? OPEN.lessonLimit,
      reviewLimit: d.reviewLimit ?? OPEN.reviewLimit,
      boutLimit: d.boutLimit ?? OPEN.boutLimit,
      workoutLimit: d.workoutLimit ?? OPEN.workoutLimit,
      canLesson: d.canLesson !== false,
      canReview: d.canReview !== false,
      canBout: d.canBout !== false,
      canWorkout: d.canWorkout !== false,
      authenticated: !!d.authenticated,
    };
  } catch {
    return OPEN;
  }
}

export function useProGate() {
  const enabled = FEATURE_FLAGS.PRO;
  const { user } = useUser();
  const [limits, setLimits] = useState<ProLimitsState>(OPEN);
  // False only while PRO is on and the first /api/pro/limits read is in flight.
  const [ready, setReady] = useState(!enabled);
  const [trigger, setTrigger] = useState<string | null>(null);
  const pendingRef = useRef<(() => void) | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) return OPEN;
    const l = await fetchProLimits();
    setLimits(l);
    setReady(true);
    return l;
  }, [enabled]);

  // Re-read when the signed-in account changes (sign in mid-session, switch).
  const userId = user?.id ?? null;
  useEffect(() => {
    void refresh();
  }, [refresh, userId]);

  const openPaywall = useCallback(
    (t: string, onUnlocked?: () => void) => {
      if (!enabled) {
        onUnlocked?.();
        return;
      }
      pendingRef.current = onUnlocked ?? null;
      setTrigger(t);
    },
    [enabled],
  );

  /** Daily-limit gate for starting a lesson, fight or Puzzle Boxing workout. */
  const gate = useCallback(
    async (kind: ProLimitKind, action: () => void) => {
      if (!enabled) {
        action();
        return;
      }
      const l = await refresh();
      const ok = l[CAN[kind]] !== false;
      if (ok) {
        action();
        return;
      }
      ProEvents.limitHit(kind);
      openPaywall(`limit_${kind}`, action);
    },
    [enabled, refresh, openPaywall],
  );

  /** Pro-feature gate: run if Pro, else log the gate hit + show the paywall (and run on unlock). */
  const requirePro = useCallback(
    (feature: ProGateFeature, action: () => void) => {
      if (!enabled || limits.isPro) {
        action();
        return;
      }
      ProEvents.gateHit(feature);
      openPaywall(feature, action);
    },
    [enabled, limits.isPro, openPaywall],
  );

  const paywall: ReactNode =
    enabled && trigger ? (
      <ProPaywall
        trigger={trigger}
        userId={user?.id ?? null}
        onClose={() => {
          setTrigger(null);
          pendingRef.current = null;
        }}
        onUnlocked={() => {
          const run = pendingRef.current;
          pendingRef.current = null;
          void refresh().then(() => run?.());
        }}
      />
    ) : null;

  return {
    enabled,
    isPro: enabled ? limits.isPro : true,
    ready: enabled ? ready : true,
    limits,
    refresh,
    gate,
    requirePro,
    openPaywall,
    paywall,
  };
}
