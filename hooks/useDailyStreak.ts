'use client';

import { useEffect, useState } from 'react';
import { getStreak } from '@/lib/streak-client';

/**
 * Returns the user's overall daily-workout streak (the same number the
 * celebration popup and share cards show). Source of truth is
 * /api/workout/streak, read through the shared streak-client cache.
 * Returns null until loaded; 0 for logged-out / no streak.
 *
 * Used by share surfaces (lesson / opening / play) so every share card shows
 * one consistent "DAY STREAK" number.
 */
export function useDailyStreak(): number | null {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getStreak()
      .then((data) => {
        if (!cancelled) setStreak(typeof data?.current === 'number' ? data.current : 0);
      })
      .catch(() => {
        if (!cancelled) setStreak(0);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return streak;
}
