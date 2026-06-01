'use client';

import { useEffect, useState } from 'react';

/**
 * Returns the user's overall daily-workout streak (the same number the
 * celebration popup and share cards show). Source of truth is
 * /api/workout/streak. Returns null until loaded; 0 for logged-out / no streak.
 *
 * Used by share surfaces (lesson / opening / play) so every share card shows
 * one consistent "DAY STREAK" number.
 */
export function useDailyStreak(): number | null {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    const tz =
      typeof Intl !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        : 'UTC';
    let cancelled = false;
    fetch(`/api/workout/streak?tz=${encodeURIComponent(tz)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
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
