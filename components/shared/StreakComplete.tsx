'use client';

import { useEffect, useRef, useState } from 'react';
import RookieCampfire from './RookieCampfire';
import { pickCelebrationLine } from '@/lib/daily-workout/celebration-lines';
import { shareWorkoutStreak } from '@/lib/daily-workout/share';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { getStreak, type StreakData } from '@/lib/streak-client';

type WorkoutResponse = StreakData;

type Phase =
  | { kind: 'loading' }
  | { kind: 'hidden' } // today didn't count (race never resolved, or no activity)
  | { kind: 'earned'; streak: number } // first finish today — full celebration
  | { kind: 'kept'; streak: number }; // already celebrated today — quiet chip

const tzOf = () =>
  typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    : 'UTC';

/**
 * StreakComplete — the daily "you showed up today" streak, folded INLINE into a
 * unit's completion screen (lesson / play / opening / workout) instead of the
 * separate DailyWorkoutCelebration modal.
 *
 * On mount it reads /api/workout/streak. Because a unit's completion write can
 * still be in flight when the completion screen mounts (e.g. game_sessions.end()
 * is fire-and-forget), it polls a few times until `completedToday` flips true.
 * Once it does, it atomically claims the day via /api/workout/celebrate:
 *   - first claim of the day  → full celebration (campfire + tick-up + line)
 *   - already claimed (another surface today) → a quiet "streak alive" chip
 *
 * The atomic claim means this and the DailyWorkoutWatcher backstop can never
 * both celebrate. When FEATURE_FLAGS.STREAK_ON_COMPLETE is on, the watcher is
 * inert and this owns the moment entirely.
 */
export function StreakComplete({ compact = false }: { compact?: boolean } = {}) {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' });
  const ranRef = useRef(false);

  useEffect(() => {
    if (!FEATURE_FLAGS.STREAK_ON_COMPLETE) return;
    if (ranRef.current) return;
    ranRef.current = true;

    let cancelled = false;
    const tz = tzOf();

    // fresh: this surface exists to catch the completion write the moment it
    // lands — a cached read would defeat the polling. The fresh result also
    // updates the shared cache, so the badge/watcher see the new streak free.
    const fetchStreak = async (): Promise<WorkoutResponse | null> =>
      getStreak({ fresh: true });

    const claim = async (streak: number): Promise<boolean> => {
      try {
        const res = await fetch(`/api/workout/celebrate?tz=${encodeURIComponent(tz)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ streak }),
        });
        if (!res.ok) return false;
        const data = (await res.json()) as { claimed: boolean };
        return !!data.claimed;
      } catch {
        return false;
      }
    };

    const run = async () => {
      // Poll for the completion write to land: now, +1.2s, +2.4s, +3.6s.
      for (let attempt = 0; attempt < 4 && !cancelled; attempt++) {
        if (attempt > 0) await new Promise((r) => setTimeout(r, 1200));
        const data = await fetchStreak();
        if (cancelled) return;
        if (data?.completedToday) {
          const claimed = await claim(data.current);
          if (cancelled) return;
          setPhase({ kind: claimed ? 'earned' : 'kept', streak: data.current });
          return;
        }
      }
      if (!cancelled) setPhase({ kind: 'hidden' });
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (phase.kind === 'loading' || phase.kind === 'hidden') return null;

  // Compact: the streak still claims on mount, but we render only the quiet
  // one-line chip (no full campfire window) — used when the ELO chart is the
  // hero of the completion screen.
  if (compact || phase.kind === 'kept') {
    return (
      <div className="w-full flex items-center justify-center gap-2 rounded-xl bg-chess-page px-3 py-2">
        <span className="shrink-0">
          <RookieCampfire blockSize={9} active blaze={blazeFor(phase.streak)} withFx={false} />
        </span>
        <span className="text-xs font-black text-chess-text">
          Day {phase.streak} · streak alive
        </span>
      </div>
    );
  }

  return <StreakEarned streak={phase.streak} />;
}

function blazeFor(streak: number) {
  return Math.max(0.5, Math.min(1, streak / 60));
}

/** Full inline celebration: campfire, number tick-up, Rookie line, share. */
function StreakEarned({ streak }: { streak: number }) {
  const line = useRef(pickCelebrationLine(streak)).current;
  const [display, setDisplay] = useState(Math.max(0, streak - 1));

  // Tick the number up from yesterday's value to today's.
  useEffect(() => {
    const start = Math.max(0, streak - 1);
    setDisplay(start);
    if (start >= streak) return;
    let interval: ReturnType<typeof setInterval> | null = null;
    const delay = setTimeout(() => {
      let n = start;
      interval = setInterval(() => {
        n += 1;
        setDisplay(n);
        if (n >= streak && interval) clearInterval(interval);
      }, 90);
    }, 350);
    return () => {
      clearTimeout(delay);
      if (interval) clearInterval(interval);
    };
  }, [streak]);

  return (
    <div className="w-full flex flex-col items-center text-center rounded-2xl bg-chess-page px-4 py-3">
      <style>{`
        @keyframes streakNumberPunch { 0%{transform:scale(1)} 50%{transform:scale(1.16)} 100%{transform:scale(1)} }
        .streak-number { animation: streakNumberPunch .3s ease-out; }
      `}</style>

      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-chess-text-muted">
        The streak continues
      </div>

      <div className="my-1 flex justify-center">
        <RookieCampfire blockSize={13} active blaze={blazeFor(streak)} />
      </div>

      <div className="flex items-baseline gap-1.5">
        <span
          key={display}
          className="streak-number text-4xl font-black text-chess-text tabular-nums leading-none"
          style={streak >= 100 ? { color: '#F5B40A' } : undefined}
        >
          {display}
        </span>
        <span className="text-[11px] font-black uppercase tracking-widest text-chess-text-muted">
          day{streak === 1 ? '' : 's'}
        </span>
      </div>

      <div className="text-sm font-black text-chess-text leading-tight mt-1.5">
        {line.headline}
      </div>
      {line.sub && (
        <div className="text-xs text-chess-text-muted mt-1 leading-snug">{line.sub}</div>
      )}

      <button
        onClick={() => shareWorkoutStreak(streak)}
        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs text-white bg-chess-blue shadow-[0_2px_0_0_var(--color-chess-blue-shadow)] active:translate-y-[1px] transition-all"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
        </svg>
        Share
      </button>
    </div>
  );
}
