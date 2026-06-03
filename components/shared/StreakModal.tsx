'use client';

import { useMemo, useState } from 'react';
import { MiniRookieIcon } from './MiniRookieIcon';

export interface StreakData {
  current: number;
  longest: number;
  completedToday: boolean;
  activeDays: string[];
}

interface StreakModalProps {
  open: boolean;
  onClose: () => void;
  data: StreakData | null;
  /** Today's date as YYYY-MM-DD in the user's TZ, for highlighting. */
  today: string;
  /** Optional custom share handler; falls back to the Web Share API. */
  onShare?: () => void;
}

const MESSAGE = 'Keep your streak alive by playing a game or taking a lesson every day!';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function ymd(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function StreakModal({ open, onClose, data, today, onShare }: StreakModalProps) {
  const current = data?.current ?? 0;
  const activeSet = useMemo(() => new Set(data?.activeDays ?? []), [data]);

  const handleShare = async () => {
    if (onShare) return onShare();
    const text = `I just hit my ${current}-day streak on Chess Path!`;
    const cardUrl = `/api/og/streak?streak=${current}`;

    // Prefer sharing the branded reel-sized streak card when the platform supports files.
    try {
      const res = await fetch(cardUrl, { cache: 'no-store' });
      const blob = await res.blob();
      const file = new File([blob], `chess-path-streak-${current}.png`, { type: blob.type });
      if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text });
        return;
      }
    } catch {
      // fall through to text/link share below
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ text, url: 'https://chesspath.app' }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${text} https://chesspath.app`).catch(() => {});
    }
  };

  // Calendar starts on the current month and can page backward/forward.
  const [y, m, d] = today.split('-').map(Number);
  const [view, setView] = useState({ year: y, month: (m ?? 1) - 1 });
  // Reset to current month each time the modal re-opens.
  const [openedFor, setOpenedFor] = useState(false);
  if (open && !openedFor) {
    setView({ year: y, month: (m ?? 1) - 1 });
    setOpenedFor(true);
  }
  if (!open && openedFor) setOpenedFor(false);

  if (!open) return null;

  const firstDow = new Date(Date.UTC(view.year, view.month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(view.year, view.month + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  const prevMonth = () =>
    setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }));
  const nextMonth = () =>
    setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }));

  // Don't let the user page past the current month.
  const atCurrentMonth = view.year === y && view.month === (m ?? 1) - 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm streak-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Streak"
    >
      <style>{`
        @keyframes streakOverlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes streakPopIn {
          0%   { opacity: 0; transform: scale(0.7) translateY(20px); }
          60%  { opacity: 1; transform: scale(1.04) translateY(0); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes streakBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-8px) rotate(0deg); }
        }
        .streak-modal-overlay { animation: streakOverlayIn 0.2s ease-out; }
        .streak-modal-card    { animation: streakPopIn 0.5s cubic-bezier(.2,.9,.3,1.2); }
        .streak-modal-rookie  { animation: streakBob 1.6s ease-in-out infinite; transform-origin: center 95%; }
      `}</style>

      <div
        className="streak-modal-card relative mx-4 max-w-sm w-full bg-chess-surface rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center text-xl font-bold leading-none"
        >
          ×
        </button>

        {/* Arc dome header */}
        <div className="relative bg-gradient-to-b from-chess-blue to-chess-blue-dark px-8 pt-9 pb-12 text-center text-white">
          <div className="streak-modal-rookie mx-auto w-fit mb-1 drop-shadow-lg">
            <MiniRookieIcon active gold={current >= 100} size={96} />
          </div>
          <div className="text-7xl font-black tabular-nums leading-none">{current}</div>
          <div className="text-xs font-black uppercase tracking-[0.2em] mt-2 opacity-90">
            day{current === 1 ? '' : 's'} streak
          </div>
          <svg
            className="absolute -bottom-px left-0 w-full"
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
            style={{ height: 24 }}
            aria-hidden
          >
            <path d="M0 12 Q50 -4 100 12 Z" fill="var(--color-chess-surface)" />
          </svg>
        </div>

        <div className="px-6 pt-2 pb-6">
          {/* Message */}
          <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-bold leading-snug text-chess-text text-center mb-4">
            {MESSAGE}
          </div>

          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              aria-label="Previous month"
              className="w-8 h-8 rounded-full text-chess-text-muted hover:bg-slate-100 flex items-center justify-center text-lg font-bold"
            >
              ‹
            </button>
            <div className="font-black text-sm text-chess-text">
              {MONTHS[view.month]} {view.year}
            </div>
            <button
              onClick={nextMonth}
              disabled={atCurrentMonth}
              aria-label="Next month"
              className="w-8 h-8 rounded-full text-chess-text-muted hover:bg-slate-100 flex items-center justify-center text-lg font-bold disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ›
            </button>
          </div>

          {/* Calendar — runs of active days merge into one continuous capsule */}
          <div className="grid grid-cols-7 gap-y-1.5 text-center">
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="text-[11px] font-bold text-chess-text-muted py-1 opacity-70">
                {wd}
              </div>
            ))}
            {cells.map((day, i) => {
              if (day === null) return <div key={`e${i}`} />;
              const dateStr = ymd(view.year, view.month, day);
              const isActive = activeSet.has(dateStr);
              const isToday = dateStr === today;
              const col = i % 7;
              const runLeft = isActive && col > 0 && activeSet.has(ymd(view.year, view.month, day - 1));
              const runRight = isActive && col < 6 && activeSet.has(ymd(view.year, view.month, day + 1));
              const radius = isActive
                ? `${runLeft ? '' : 'rounded-l-full'} ${runRight ? '' : 'rounded-r-full'} ${!runLeft && !runRight ? 'rounded-full' : ''}`
                : 'rounded-full';
              return (
                <div key={dateStr} className="flex items-center justify-center">
                  <div
                    className={`w-full h-8 mx-[1px] flex items-center justify-center text-sm font-bold tabular-nums ${radius} ${
                      isActive
                        ? 'bg-gradient-to-b from-chess-blue to-chess-blue-dark text-white'
                        : isToday
                          ? 'ring-2 ring-chess-blue text-chess-text rounded-full'
                          : 'text-chess-text-muted'
                    }`}
                  >
                    {day}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="w-full mt-5 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white bg-chess-blue shadow-[0_3px_0_0_var(--color-chess-blue-shadow)] active:translate-y-[1px] active:shadow-[0_2px_0_0_var(--color-chess-blue-shadow)] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
            </svg>
            Share my streak
          </button>
        </div>
      </div>
    </div>
  );
}
