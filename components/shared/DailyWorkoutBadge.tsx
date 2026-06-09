'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { WorkoutEvents } from '@/lib/analytics/posthog';
import { getStreak, type StreakData } from '@/lib/streak-client';
import { MiniRookieIcon } from './MiniRookieIcon';
import { StreakModal } from './StreakModal';

type WorkoutResponse = StreakData;

const cacheKey = (userId: string) => `cp:workout-streak:${userId}`;

function readCache(userId: string): WorkoutResponse | null {
  try {
    const raw = localStorage.getItem(cacheKey(userId));
    return raw ? (JSON.parse(raw) as WorkoutResponse) : null;
  } catch {
    return null;
  }
}

export function DailyWorkoutBadge() {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const [data, setData] = useState<WorkoutResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Last `current` we've seen, to detect a live increase. null = no read yet
  // (the first read is a baseline, not an extension — don't fire on mount).
  const lastStreakRef = useRef<number | null>(null);

  const refetch = useCallback((fresh = false) => {
    if (!user) return;
    getStreak(fresh ? { fresh: true } : undefined)
      .then((next) => {
        if (!next) return;
        const prev = lastStreakRef.current;
        if (prev !== null && next.current > prev) {
          WorkoutEvents.streakExtended(next.current, next.longest);
        }
        lastStreakRef.current = next.current;
        setData(next);
        try {
          localStorage.setItem(cacheKey(user.id), JSON.stringify(next));
        } catch {
          // ignore quota / private-mode errors
        }
      })
      .catch(() => {});
  }, [user]);

  // Refetch on mount, on every navigation (any completion flow ends by
  // navigating), and when the tab regains focus. `pathname` in the deps drives
  // the route-change refresh — same single trigger the celebration uses.
  useEffect(() => {
    if (!user) return;
    // Show the last-known streak instantly while we revalidate in the
    // background, so the badge doesn't flash 0 for ~2s on every load.
    const cached = readCache(user.id);
    if (cached) setData(cached);
    refetch();
    const onFocus = () => refetch();
    // A finished /play game resets on the same route (no nav), so revalidate on
    // the activity signal too — otherwise the badge count lags a navigation.
    // Fresh: the completion write just landed, a cached read would miss it.
    const onActivity = () => refetch(true);
    window.addEventListener('focus', onFocus);
    window.addEventListener('cp:activity-recorded', onActivity);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('cp:activity-recorded', onActivity);
    };
  }, [user, pathname, refetch]);

  if (loading || !user) return null;

  const current = data?.current ?? 0;
  const completedToday = data?.completedToday ?? false;

  const title = completedToday
    ? `${current}-day streak — you showed up today. Rookie noticed.`
    : current > 0
      ? `${current}-day streak. Do anything today to keep it alive.`
      : 'Do anything today to start your streak.';

  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        title={title}
        className={`inline-flex items-center gap-1.5 leading-none shrink-0 rounded-md px-2 py-1 font-black transition-all ${
          completedToday
            ? 'bg-orange-100 text-orange-800 shadow-[0_2px_0_0_#fbbf24]'
            : 'bg-chess-text/50 text-white animate-pulse-soft'
        }`}
      >
        <MiniRookieIcon active={completedToday} gold={current >= 100} size={20} />
        <span className="tabular-nums text-sm">{current}</span>
      </button>
      <StreakModal open={modalOpen} onClose={() => setModalOpen(false)} data={data} today={today} />
    </>
  );
}
