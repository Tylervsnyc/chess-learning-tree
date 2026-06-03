'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { DailyWorkoutCelebration } from './DailyWorkoutCelebration';
import { shareWorkoutStreak } from '@/lib/daily-workout/share';
import { WORKOUT_ACTIVITY_EVENT } from '@/lib/daily-workout/events';

type WorkoutResponse = {
  current: number;
  longest: number;
  completedToday: boolean;
};

/**
 * Checks /api/workout/streak on mount and whenever an activity completes
 * (the WORKOUT_ACTIVITY_EVENT signal — finishing a lesson/puzzle set/run/
 * workout). When `completedToday` is true, atomically claims the celebration
 * via POST /api/workout/celebrate. The first claim per (user, date) wins —
 * fires the popup. Subsequent calls (same day, any device) return
 * `claimed: false` and stay quiet.
 *
 * We deliberately do NOT poll on window focus/visibility: that fired the
 * celebration at random moments (e.g. mid-puzzle) once the day was already
 * marked complete. Firing on the explicit completion event keeps it at a
 * natural break instead.
 */
export function DailyWorkoutWatcher() {
  const { user } = useUser();
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

  useEffect(() => {
    if (!user) return;
    check();
    const onActivity = () => check();
    window.addEventListener(WORKOUT_ACTIVITY_EVENT, onActivity);
    return () => {
      window.removeEventListener(WORKOUT_ACTIVITY_EVENT, onActivity);
    };
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
