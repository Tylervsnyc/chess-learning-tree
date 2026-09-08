'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { ProEvents, type ProLimitKind } from '@/lib/analytics/posthog';
import { getTz } from '@/lib/streak-client';
import { ProPaywall } from '@/components/pro/ProPaywall';
import { useUser } from '@/hooks/useUser';

/**
 * useProGate — the ONE way any surface (Chess Boxing, Chess Path, web) asks
 * "may this free user start another Chess Boxing / workout?" or "is this a
 * Pro feature?" (FEATURE_FLAGS.PRO — one Pro across the family).
 *
 *   const { gate, requirePro, paywall, isPro } = useProGate();
 *   gate('bout', () => router.push('/box/bout'));   // daily-limit check, then go
 *   requirePro('custom_rounds', () => setCustom(true)); // Pro feature, else paywall
 *   …
 *   {paywall}                                        // render once in the tree
 *
 * `requirePro(feature)` fires `pro_gate_hit {feature, app}` when a free user
 * bumps into a Pro feature, then opens the paywall with that feature as the
 * trigger — so daily-report.ts can read which gate converts, per app.
 *
 * Flag OFF: `gate` and `requirePro` run the action immediately, `paywall` is
 * null, `isPro` is true — zero behaviour change. Limits come fresh from
 * /api/pro/limits on every gate call (two HEAD counts) so the truth is always
 * the DB, never a client counter. If the endpoint fails, the action runs —
 * never block a fight over a stat line.
 */

/**
 * Every Pro-only feature a surface can gate on. Add here first — the union is
 * what keeps `pro_gate_hit.feature` a closed, reportable set.
 *   Chess Path: lesson_level (Level 3+), level_test_pass ("Go to Level N"),
 *               review / variations ("Try it") / report / fixit (Rookie's words)
 *   Chess Boxing: custom_rounds, history, settings, profile, bout, workout
 */
export type ProGateFeature =
  | 'lesson_level'
  | 'level_test_pass'
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
  boutsToday: number;
  workoutsToday: number;
  boutLimit: number;
  workoutLimit: number;
  canBout: boolean;
  canWorkout: boolean;
  authenticated: boolean;
}

const OPEN: ProLimitsState = {
  isPro: true,
  boutsToday: 0,
  workoutsToday: 0,
  boutLimit: 1,
  workoutLimit: 1,
  canBout: true,
  canWorkout: true,
  authenticated: false,
};

export async function fetchProLimits(): Promise<ProLimitsState> {
  try {
    const res = await fetch(`/api/pro/limits?tz=${encodeURIComponent(getTz())}`, { cache: 'no-store' });
    if (!res.ok) return OPEN;
    const d = await res.json();
    return {
      isPro: !!d.isPro,
      boutsToday: d.boutsToday ?? 0,
      workoutsToday: d.workoutsToday ?? 0,
      boutLimit: d.boutLimit ?? 1,
      workoutLimit: d.workoutLimit ?? 1,
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
  const [trigger, setTrigger] = useState<string | null>(null);
  const pendingRef = useRef<(() => void) | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) return OPEN;
    const l = await fetchProLimits();
    setLimits(l);
    return l;
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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

  /** Daily-limit gate for launching a bout or a workout. */
  const gate = useCallback(
    async (kind: ProLimitKind, action: () => void) => {
      if (!enabled) {
        action();
        return;
      }
      const l = await refresh();
      const ok = kind === 'bout' ? l.canBout : l.canWorkout;
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
    limits,
    refresh,
    gate,
    requirePro,
    openPaywall,
    paywall,
  };
}
