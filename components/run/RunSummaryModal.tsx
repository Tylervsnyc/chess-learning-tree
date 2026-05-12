'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { RunStats } from '@/lib/run/history';

interface RunSummaryModalProps {
  iso: string;
  totalLevels: number;
  /** Level the player reached this run (1-indexed). */
  levelReached: number;
  /** True when the run was completed (all levels cleared). */
  completed: boolean;
  stats: RunStats;
  shareString: string;
  onReplay: () => void;
  nextRunName?: string;
  onNextRun?: () => void;
}

export function RunSummaryModal({
  iso,
  totalLevels,
  levelReached,
  completed,
  stats,
  shareString,
  onReplay,
  nextRunName,
  onNextRun,
}: RunSummaryModalProps) {
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (!completed) return;
    const palette = ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF', '#FFD166'];
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 65,
      origin: { x: 0.15, y: 0.55 },
      colors: palette,
      gravity: 1.1,
      ticks: 180,
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 65,
      origin: { x: 0.85, y: 0.55 },
      colors: palette,
      gravity: 1.1,
      ticks: 180,
    });
  }, [completed]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareString);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    } catch {
      /* no clipboard */
    }
  };

  const title = completed ? 'Run complete!' : 'Captured.';
  const subtitle = completed
    ? `All ${totalLevels} levels cleared`
    : `Reached Level ${levelReached} of ${totalLevels}`;

  // Build distribution rows: one per level, 1..totalLevels.
  const rows = Array.from({ length: totalLevels }, (_, i) => {
    const level = i + 1;
    const count = stats.distribution[level] ?? 0;
    const pct =
      stats.maxBucket === 0 ? 0 : Math.round((count / stats.maxBucket) * 100);
    return { level, count, pct, isToday: level === levelReached };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 animate-[rookiesRunFadeIn_180ms_ease-out] overscroll-contain"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <style>{`
        @keyframes rookiesRunFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rookiesRunPopIn {
          0%   { opacity: 0; transform: scale(0.9) translateY(8px); }
          60%  { opacity: 1; transform: scale(1.02) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes rookiesRunBarIn {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>

      <div
        className="w-full max-w-sm rounded-3xl bg-chess-surface shadow-2xl p-6 text-center overflow-y-auto overscroll-contain"
        style={{
          animation: 'rookiesRunPopIn 360ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxHeight: 'calc(100dvh - 3rem)',
        }}
      >
        <div className="text-xs uppercase tracking-widest text-chess-text-faint">
          {iso}
        </div>
        <h2 className="mt-1 text-3xl font-black text-chess-text">{title}</h2>
        <p className="mt-1 text-sm text-chess-text-muted">{subtitle}</p>

        <div className="mt-5 grid grid-cols-4 gap-2">
          <Stat value={stats.played} label="Played" />
          <Stat value={`${stats.winPct}%`} label="Win" />
          <Stat value={stats.currentStreak} label="Streak" />
          <Stat value={stats.maxStreak} label="Max" />
        </div>

        <div className="mt-6 text-left">
          <div className="text-[11px] uppercase tracking-widest text-chess-text-faint mb-2 px-1">
            Levels reached
          </div>
          <div className="flex flex-col gap-1">
            {rows.map((r, idx) => (
              <div key={r.level} className="flex items-center gap-2 text-sm">
                <div className="w-5 text-right text-[12px] font-bold text-chess-text-muted tabular-nums">
                  {r.level}
                </div>
                <div className="flex-1 h-6 rounded bg-chess-page overflow-hidden relative">
                  <div
                    className={`h-full flex items-center justify-end pr-2 text-[11px] font-black text-white tabular-nums ${
                      r.isToday ? 'bg-emerald-500' : 'bg-chess-text/40'
                    }`}
                    style={{
                      width: `${Math.max(r.count > 0 ? 10 : 0, r.pct)}%`,
                      transformOrigin: 'left center',
                      animation: `rookiesRunBarIn 500ms ease-out both`,
                      animationDelay: `${200 + idx * 40}ms`,
                    }}
                  >
                    {r.count > 0 ? r.count : ''}
                  </div>
                  {r.count === 0 && r.isToday && (
                    <div className="absolute inset-0 flex items-center px-2 text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                      ← you
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {completed && nextRunName && onNextRun ? (
          <>
            <button
              onClick={onNextRun}
              className="mt-6 w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] text-white font-black text-base shadow-lg transition-all"
            >
              Next Run · {nextRunName} →
            </button>
            <div className="mt-3 flex gap-2 justify-center">
              <button
                onClick={handleCopy}
                className="tap-highlight px-4 py-2 rounded-xl bg-chess-text text-white text-sm font-bold"
              >
                {shareCopied ? 'Copied!' : 'Share'}
              </button>
              <button
                onClick={onReplay}
                className="tap-highlight px-4 py-2 rounded-xl bg-chess-page text-chess-text text-sm font-bold border border-chess-text/10"
              >
                Replay this run
              </button>
            </div>
          </>
        ) : (
          <div className="mt-6 flex gap-2 justify-center">
            <button
              onClick={handleCopy}
              className="tap-highlight px-4 py-2 rounded-xl bg-chess-text text-white text-sm font-bold"
            >
              {shareCopied ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={onReplay}
              className="tap-highlight px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-black"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-black text-chess-text tabular-nums leading-none">
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wide text-chess-text-faint">
        {label}
      </div>
    </div>
  );
}
