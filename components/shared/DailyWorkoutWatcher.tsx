'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { DailyWorkoutCelebration } from './DailyWorkoutCelebration';

const LAST_CELEBRATED_KEY = 'daily-workout-last-celebrated';

type WorkoutResponse = {
  current: number;
  longest: number;
  completedToday: boolean;
};

/**
 * Polls /api/workout/streak on mount + window focus. When `completedToday`
 * flips true (and we haven't celebrated today yet), fires the celebration.
 *
 * Idempotent across reloads via localStorage(`daily-workout-last-celebrated` =
 * today's date in user TZ).
 */
export function DailyWorkoutWatcher() {
  const { user } = useUser();
  const [streak, setStreak] = useState<number | null>(null);
  const checkingRef = useRef(false);

  const tz = typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    : 'UTC';

  const todayInTZ = useCallback((): string => {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return fmt.format(new Date());
  }, [tz]);

  const check = useCallback(async () => {
    if (!user || checkingRef.current) return;
    checkingRef.current = true;
    try {
      const res = await fetch(`/api/workout/streak?tz=${encodeURIComponent(tz)}`, {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = (await res.json()) as WorkoutResponse;
      if (!data.completedToday) return;

      const today = todayInTZ();
      const lastCelebrated = localStorage.getItem(LAST_CELEBRATED_KEY);
      if (lastCelebrated === today) return;

      // Fire it.
      setStreak(data.current);
      localStorage.setItem(LAST_CELEBRATED_KEY, today);
    } catch {
      /* swallow */
    } finally {
      checkingRef.current = false;
    }
  }, [user, tz, todayInTZ]);

  useEffect(() => {
    if (!user) return;
    check();
    const onFocus = () => check();
    const onVisible = () => { if (!document.hidden) check(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [user, check]);

  if (streak === null) return null;

  return (
    <DailyWorkoutCelebration
      streak={streak}
      open
      onClose={() => setStreak(null)}
    />
  );
}
