'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { DailyWorkoutCelebration } from './DailyWorkoutCelebration';
import { shareWorkoutStreak } from '@/lib/daily-workout/share';

type WorkoutResponse = {
  current: number;
  longest: number;
  completedToday: boolean;
};

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
  const { user } = useUser();
  const pathname = usePathname();
  const [streak, setStreak] = useState<number | null>(null);
  const checkingRef = useRef(false);
  const firedThisSessionRef = useRef(false);

  const tz = typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    : 'UTC';

  const check = useCallback(async () => {
    if (!user || checkingRef.current || firedThisSessionRef.current) return;
    checkingRef.current = true;
    try {
      const streakRes = await fetch(`/api/workout/streak?tz=${encodeURIComponent(tz)}`, {
        cache: 'no-store',
      });
      if (!streakRes.ok) return;
      const data = (await streakRes.json()) as WorkoutResponse;
      if (!data.completedToday) return;

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
  }, [user, tz]);

  // Re-check on mount and on every navigation. `pathname` in the deps means
  // this re-runs each time the route changes — the universal catch-all.
  useEffect(() => {
    if (!user) return;
    check();
  }, [user, pathname, check]);

  // Also re-check the instant a completion write commits. Route change alone
  // races the DB write (e.g. /play's `session.end()` is fire-and-forget), so a
  // fast click-through could land on the next screen before the streak flips —
  // making the celebration fire a navigation late. This catches the write the
  // moment it lands. `check()` is idempotent + atomically claimed, so the extra
  // trigger can't double-fire.
  useEffect(() => {
    if (!user) return;
    const onActivity = () => check();
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
