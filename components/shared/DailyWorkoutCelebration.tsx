'use client';

import { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { MiniRookieIcon } from './MiniRookieIcon';
import { pickCelebrationLine, isMilestone } from '@/lib/daily-workout/celebration-lines';

interface DailyWorkoutCelebrationProps {
  /** Final streak number after today is counted. */
  streak: number;
  open: boolean;
  onClose: () => void;
  onShare?: () => void;
}

const PALETTE = ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF', '#FFD166', '#FF4B4B', '#A560E8'];

export function DailyWorkoutCelebration({ streak, open, onClose, onShare }: DailyWorkoutCelebrationProps) {
  const line = useMemo(() => (open ? pickCelebrationLine(streak) : null), [open, streak]);
  const milestone = isMilestone(streak);
  const [displayStreak, setDisplayStreak] = useState(Math.max(0, streak - 1));

  // Confetti burst on open. Extra burst for milestones.
  useEffect(() => {
    if (!open) return;

    const baseOpts = {
      particleCount: 90,
      spread: 70,
      colors: PALETTE,
      gravity: 1.05,
      ticks: 220,
    };
    confetti({ ...baseOpts, angle: 60, origin: { x: 0.1, y: 0.6 } });
    confetti({ ...baseOpts, angle: 120, origin: { x: 0.9, y: 0.6 } });

    if (milestone) {
      const t = setTimeout(() => {
        confetti({
          particleCount: 160,
          spread: 110,
          startVelocity: 45,
          origin: { x: 0.5, y: 0.5 },
          colors: PALETTE,
          ticks: 260,
        });
      }, 350);
      return () => clearTimeout(t);
    }
  }, [open, milestone]);

  // Streak tick-up: previous → current over ~700ms with a final snap.
  useEffect(() => {
    if (!open) {
      setDisplayStreak(Math.max(0, streak - 1));
      return;
    }
    const start = Math.max(0, streak - 1);
    setDisplayStreak(start);
    const delay = setTimeout(() => {
      let n = start;
      const interval = setInterval(() => {
        n += 1;
        setDisplayStreak(n);
        if (n >= streak) clearInterval(interval);
      }, 80);
      return () => clearInterval(interval);
    }, 400);
    return () => clearTimeout(delay);
  }, [open, streak]);

  if (!open || !line) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm workout-celebration-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes workoutOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes workoutPopIn {
          0%   { opacity: 0; transform: scale(0.6) translateY(20px); }
          60%  { opacity: 1; transform: scale(1.06) translateY(0); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes workoutBigBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%      { transform: translateY(-6px) rotate(-3deg); }
          50%      { transform: translateY(-10px) rotate(0deg); }
          75%      { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes workoutNumberPunch {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.18); }
          100% { transform: scale(1); }
        }
        .workout-celebration-overlay { animation: workoutOverlayIn 0.25s ease-out; }
        .workout-celebration-card    { animation: workoutPopIn 0.55s cubic-bezier(.2,.9,.3,1.2); }
        .workout-big-rookie          { animation: workoutBigBob 1.4s ease-in-out infinite; transform-origin: center 95%; }
        .workout-number              { animation: workoutNumberPunch 0.35s ease-out; }
        @keyframes workoutShareWiggle {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(-12deg) scale(1.12); }
          75%      { transform: rotate(12deg) scale(1.12); }
        }
        .workout-share-btn:hover .workout-share-icon { animation: workoutShareWiggle 0.45s ease-in-out; }
      `}</style>

      <div
        className="workout-celebration-card relative mx-4 max-w-sm w-full bg-chess-surface rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full text-chess-text-muted hover:bg-slate-100 flex items-center justify-center text-lg font-bold"
        >
          ×
        </button>

        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-chess-text-muted mb-1">
          Workout streak
        </div>

        <div className="workout-big-rookie my-3">
          <MiniRookieIcon active gold={streak >= 100} size={108} />
        </div>

        <div
          key={displayStreak}
          className="workout-number text-6xl font-black text-chess-text tabular-nums leading-none"
          style={milestone && streak >= 100 ? { color: '#F5B40A' } : undefined}
        >
          {displayStreak}
        </div>
        <div className="text-xs font-black uppercase tracking-widest text-chess-text-muted mt-1 mb-5">
          day{streak === 1 ? '' : 's'} in a row
        </div>

        <div className="text-xl font-black text-chess-text leading-tight">{line.headline}</div>
        {line.sub && (
          <div className="text-sm text-chess-text-muted mt-2 leading-snug">{line.sub}</div>
        )}

        <div className="flex gap-2 mt-6 w-full">
          {onShare && (
            <button
              onClick={onShare}
              className="workout-share-btn group flex-1 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 text-white bg-chess-blue shadow-[0_3px_0_0_var(--color-chess-blue-shadow)] active:translate-y-[1px] active:shadow-[0_2px_0_0_var(--color-chess-blue-shadow)] transition-all"
            >
              <svg className="workout-share-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
              </svg>
              Share
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-black text-sm text-white bg-chess-green shadow-[0_3px_0_0_var(--color-chess-green-shadow)] active:translate-y-[1px] active:shadow-[0_2px_0_0_var(--color-chess-green-shadow)] transition-all"
          >
            Keep going
          </button>
        </div>
      </div>
    </div>
  );
}
