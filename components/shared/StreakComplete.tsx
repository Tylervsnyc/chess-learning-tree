'use client';

import { useEffect, useRef, useState } from 'react';
import RookieCampfire from './RookieCampfire';
import { useUser } from '@/hooks/useUser';
import { pickCelebrationLine } from '@/lib/daily-workout/celebration-lines';
import { shareWorkoutStreak } from '@/lib/daily-workout/share';
import { claimStreakToday } from '@/lib/streak-client';

type Phase =
  | { kind: 'loading' }
  | { kind: 'hidden' } // today didn't count (race never resolved, or no activity)
  | { kind: 'earned'; streak: number } // first finish today — full celebration
  | { kind: 'kept'; streak: number }; // already celebrated today — quiet chip

/**
 * StreakComplete — the daily "you showed up today" streak, folded INLINE into a
 * completion screen (used by the workout finish screen; ActivityComplete flows
 * run the same claim via their streak pre-step window).
 *
 * On mount, claimStreakToday() polls /api/workout/streak for the completion
 * write to land, then atomically claims the day:
 *   - first claim of the day → full celebration (campfire + tick-up + line)
 *   - already claimed (another surface today) → a quiet "streak alive" chip
 */
export function StreakComplete({ compact = false }: { compact?: boolean } = {}) {
  const { user, loading } = useUser();
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' });
  const ranRef = useRef(false);

  // Cancel only on UNMOUNT. The claim effect below re-runs on user-identity
  // churn (token refresh hands back a new object) — ranRef makes the re-run a
  // no-op, and the cancel must not kill the poll already in flight.
  const signalRef = useRef({ cancelled: false });
  useEffect(() => () => {
    signalRef.current.cancelled = true;
  }, []);

  useEffect(() => {
    if (loading || ranRef.current) return;
    ranRef.current = true;
    // No streak for logged-out users — skip the poll entirely (the streak
    // endpoint would just 401 four times).
    if (!user) {
      setPhase({ kind: 'hidden' });
      return;
    }

    const signal = signalRef.current;
    // Poll window: now, +1.2s, +2.4s, +3.6s — this surface renders alongside
    // the rest of the finish screen, so the longer window costs nothing.
    claimStreakToday({ attempts: 4, delayMs: 1200, signal }).then((res) => {
      if (signal.cancelled) return;
      if (res.status === 'none') setPhase({ kind: 'hidden' });
      else setPhase({ kind: res.status === 'celebrated' ? 'earned' : 'kept', streak: res.streak });
    });
  }, [loading, user]);

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
