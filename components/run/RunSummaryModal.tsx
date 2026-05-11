'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { PIECE_VALUES } from '@/lib/run/scoring';
import type { PieceType } from '@/lib/run/types';

export interface LevelResult {
  level: number;
  cleared: boolean;
  moves: number;
  captures: PieceType[];
  score: number;
}

interface RunSummaryModalProps {
  iso: string;
  totalLevels: number;
  levelsCleared: number;
  totalMoves: number;
  totalScore: number;
  elapsedSeconds: number;
  levelResults: LevelResult[];
  shareString: string;
  /** True when run was completed (all levels cleared). False on death. */
  completed: boolean;
  onReplay: () => void;
  /** Name of the next run to advance to. When set, shows a "Next Run" button. */
  nextRunName?: string;
  onNextRun?: () => void;
}

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function captureSummary(captures: PieceType[]): string {
  if (captures.length === 0) return '—';
  const counts: Record<string, number> = {};
  for (const c of captures) counts[c] = (counts[c] ?? 0) + 1;
  const glyph: Record<PieceType, string> = {
    pawn: '♙',
    knight: '♘',
    bishop: '♗',
    queen: '♕',
  };
  return (Object.keys(counts) as PieceType[])
    .map((t) => `${counts[t]}${glyph[t]}`)
    .join(' ');
}

export function RunSummaryModal({
  iso,
  totalLevels,
  levelsCleared,
  totalMoves,
  totalScore,
  elapsedSeconds,
  levelResults,
  shareString,
  completed,
  onReplay,
  nextRunName,
  onNextRun,
}: RunSummaryModalProps) {
  const [shareCopied, setShareCopied] = useState(false);
  const [displayTotal, setDisplayTotal] = useState(0);

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

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const target = totalScore;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayTotal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [totalScore]);

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
    : `Reached level ${Math.min(totalLevels, levelsCleared + 1)} of ${totalLevels}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 animate-[rookiesRunFadeIn_180ms_ease-out]">
      <style>{`
        @keyframes rookiesRunFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rookiesRunPopIn {
          0%   { opacity: 0; transform: scale(0.9) translateY(8px); }
          60%  { opacity: 1; transform: scale(1.02) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes rookiesRunRowIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="w-full max-w-sm rounded-3xl bg-chess-surface shadow-2xl p-6 text-center max-h-full overflow-auto"
        style={{ animation: 'rookiesRunPopIn 360ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="text-xs uppercase tracking-widest text-chess-text-faint">
          {iso}
        </div>
        <h2 className="mt-1 text-3xl font-black text-chess-text">{title}</h2>
        <p className="mt-1 text-sm text-chess-text-muted">
          {subtitle} · {totalMoves} {totalMoves === 1 ? 'move' : 'moves'} ·{' '}
          {formatSeconds(elapsedSeconds)}
        </p>

        <div className="mt-5 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-950/30 py-5">
          <div className="text-[11px] uppercase tracking-widest text-chess-text-faint">
            Total score
          </div>
          <div className="mt-1 text-5xl font-black tabular-nums text-chess-text">
            {displayTotal.toLocaleString()}
          </div>
        </div>

        <div className="mt-5 text-left">
          <div className="text-[11px] uppercase tracking-widest text-chess-text-faint mb-1.5 px-1">
            Per level
          </div>
          <div className="rounded-2xl bg-chess-page divide-y divide-chess-text/5">
            {levelResults.map((r, idx) => (
              <div
                key={r.level}
                className="flex items-center gap-3 px-3 py-2 text-sm"
                style={{
                  animation: `rookiesRunRowIn 320ms ease-out both`,
                  animationDelay: `${300 + idx * 50}ms`,
                }}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                    r.cleared
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {r.cleared ? '✓' : '✕'}
                </div>
                <div className="flex-1">
                  <div className="text-chess-text font-bold">Level {r.level}</div>
                  <div className="text-[11px] text-chess-text-faint tabular-nums">
                    {r.moves} {r.moves === 1 ? 'move' : 'moves'} · {captureSummary(r.captures)}
                  </div>
                </div>
                <div
                  className={`tabular-nums font-black ${
                    r.cleared ? 'text-chess-text' : 'text-chess-text-faint'
                  }`}
                >
                  {r.cleared ? `+${r.score.toLocaleString()}` : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {completed && nextRunName && onNextRun && (
          <button
            onClick={onNextRun}
            className="mt-5 w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] text-white font-black text-base shadow-lg transition-all"
          >
            Next Run · {nextRunName} →
          </button>
        )}

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
            Replay
          </button>
        </div>
      </div>
    </div>
  );
}

/** Score one level: BASE - MOVE_PENALTY×moves + Σ captures + LEVEL_BONUS. */
export function scoreForLevel(moves: number, captures: PieceType[]): number {
  const BASE = 100;
  const MOVE_PENALTY = 10;
  const captureBonus = captures.reduce(
    (s, t) => s + (PIECE_VALUES[t] ?? 0),
    0,
  );
  const LEVEL_BONUS = 250;
  return Math.max(0, BASE - MOVE_PENALTY * moves + captureBonus + LEVEL_BONUS);
}
