'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { DailyWorkoutCelebration } from './DailyWorkoutCelebration';
import { shareWorkoutStreak } from '@/lib/daily-workout/share';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { getStreak, getTz } from '@/lib/streak-client';

/**
 * Fires the once-per-day "you showed up today" streak celebration.
 *
 * SINGLE TRIGGER: every route change. When `/api/workout/streak` says
 * `completedToday`, we atomically claim the celebration via POST
 * /api/workout/celebrate — the first claim per (user, date) wins and fires the
 * popup; later calls (same day, any device) return `claimed: false`.
 *
 * Why route changes, and only route changes: a navigation is a natural break,
 * and EVERY completion flow (lesson, opening, /play game, puzzle, workout, run,
 * and anything built later) ends by navigating somewhere. So this one trigger
 * catches them all with zero per-flow wiring — no flow has to remember to
 * announce itself, which is exactly what kept silently breaking. It can't fire
 * mid-puzzle because the route doesn't change mid-puzzle. And re-checking on
 * every nav is safe: the claim is atomic + idempotent per (user, date), so it
 * fires at most once a day no matter how often we check.
 */
export function DailyWorkoutWatcher() {
  // When the streak is folded into the completion screen (StreakComplete), that
  // surface atomically claims + shows the day, so this navigation-based modal
  // would only ever be a redundant backstop. Stay inert to avoid the separate
  // popup the inline design replaces.
  if (FEATURE_FLAGS.STREAK_ON_COMPLETE) return null;
  return <DailyWorkoutWatcherInner />;
}

function DailyWorkoutWatcherInner() {
  const { user } = useUser();
  const pathname = usePathname();
  const [streak, setStreak] = useState<number | null>(null);
  const checkingRef = useRef(false);
  const firedThisSessionRef = useRef(false);
  const initedRef = useRef(false);

  // Hold the latest user in a ref so `check` stays referentially stable. If
  // `check` (or an effect) depended on the `user` object directly, it would
  // re-run every time Supabase hands back a NEW user object — which it does on
  // every TOKEN_REFRESHED and on tab focus, with NO navigation. That churn was
  // re-firing this check mid-lesson: once the first puzzle attempt writes a row
  // the day counts (`completedToday` flips true), so a token refresh on
  // question 3 would pop the celebration over the board instead of waiting for
  // the user to finish. Keeping `user` in a ref means we only re-check on a real
  // navigation or the explicit activity event — never on auth-token churn.
  const userRef = useRef(user);
  userRef.current = user;

  const tz = getTz();

  // `fresh` skips the shared streak cache — used when a completion write just
  // landed (cp:activity-recorded), where a cached read would still say
  // completedToday=false. Route-change checks read through the cache; the
  // completion screens fresh-read on mount and update it, so the nav after a
  // finish still sees the flipped day without another 4-table scan.
  const check = useCallback(async (fresh = false) => {
    if (!userRef.current || checkingRef.current || firedThisSessionRef.current) return;
    checkingRef.current = true;
    try {
      const data = await getStreak(fresh ? { fresh: true } : undefined);
      if (!data?.completedToday) return;

      const claimRes = await fetch(`/api/workout/celebrate?tz=${encodeURIComponent(tz)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streak: data.current }),
      });
      if (!claimRes.ok) return;
      const claim = (await claimRes.json()) as { claimed: boolean };
      if (!claim.claimed) return;

      firedThisSessionRef.current = true;
      setStreak(data.current);
    } catch {
      /* swallow */
    } finally {
      checkingRef.current = false;
    }
  }, [tz]);

  // One-shot check the moment the user first loads (app entry). For a "first of
  // the day" user nothing counts yet, so this is a safe baseline that won't pop.
  // `initedRef` guards against re-firing on later user-identity churn.
  useEffect(() => {
    if (!user || initedRef.current) return;
    initedRef.current = true;
    check();
  }, [user, check]);

  // Re-check on every REAL navigation. `check` is now referentially stable, so
  // this effect's deps only change when `pathname` actually changes — i.e. a
  // genuine route change, the natural end of every completion flow. It no longer
  // re-runs on auth-token refreshes (the mid-lesson misfire).
  useEffect(() => {
    if (!userRef.current) return;
    check();
  }, [pathname, check]);

  // Also re-check the instant a completion write commits. Route change alone
  // races the DB write (e.g. /play's `session.end()` is fire-and-forget), so a
  // fast click-through could land on the next screen before the streak flips —
  // making the celebration fire a navigation late. This catches the write the
  // moment it lands. `check()` is idempotent + atomically claimed, so the extra
  // trigger can't double-fire.
  useEffect(() => {
    if (!user) return;
    const onActivity = () => check(true);
    window.addEventListener('cp:activity-recorded', onActivity);
    return () => window.removeEventListener('cp:activity-recorded', onActivity);
  }, [user, check]);

  if (streak === null) return null;

  return (
    <DailyWorkoutCelebration
      streak={streak}
      open
      onClose={() => setStreak(null)}
      onShare={() => shareWorkoutStreak(streak)}
    />
  );
}
