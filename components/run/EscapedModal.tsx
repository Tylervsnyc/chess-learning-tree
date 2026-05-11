'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { ScoreBreakdown } from '@/lib/run/scoring';

interface EscapedModalProps {
  iso: string;
  moves: number;
  levelsCleared: number;
  totalLevels: number;
  score: ScoreBreakdown;
  shareString: string;
  onReplay: () => void;
}

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function EscapedModal({
  iso,
  moves,
  levelsCleared,
  totalLevels,
  score,
  shareString,
  onReplay,
}: EscapedModalProps) {
  const [shareCopied, setShareCopied] = useState(false);
  const [displayTotal, setDisplayTotal] = useState(0);

  // Confetti burst on mount — same palette as the /learn tutorial.
  useEffect(() => {
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
    const t = setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 90,
        spread: 120,
        origin: { x: 0.5, y: 0.35 },
        colors: palette,
        gravity: 1.0,
        ticks: 200,
      });
    }, 250);
    return () => clearTimeout(t);
  }, []);

  // Roll the total score up from 0 over ~900ms.
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const target = score.total;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayTotal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score.total]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareString);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    } catch {
      /* no clipboard */
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-[rookiesRunFadeIn_180ms_ease-out]">
      <style>{`
        @keyframes rookiesRunFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rookiesRunPopIn {
          0%   { opacity: 0; transform: scale(0.85) translateY(8px); }
          60%  { opacity: 1; transform: scale(1.03) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes rookiesRunRowIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="w-full max-w-sm rounded-3xl bg-chess-surface shadow-2xl p-6 text-center"
        style={{ animation: 'rookiesRunPopIn 360ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="text-xs uppercase tracking-widest text-chess-text-faint">
          {iso}
        </div>
        <h2 className="mt-1 text-3xl font-black text-chess-text">
          {levelsCleared === totalLevels ? 'Run complete!' : 'Escaped!'}
        </h2>
        <p className="mt-1 text-sm text-chess-text-muted">
          {levelsCleared}/{totalLevels} levels · {moves}{' '}
          {moves === 1 ? 'move' : 'moves'} · {formatSeconds(score.seconds)}
        </p>

        {/* Big score */}
        <div className="mt-5 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-950/30 py-5">
          <div className="text-[11px] uppercase tracking-widest text-chess-text-faint">
            Score
          </div>
          <div className="mt-1 text-5xl font-black tabular-nums text-chess-text">
            {displayTotal.toLocaleString()}
          </div>
        </div>

        {/* Breakdown */}
        <dl className="mt-4 space-y-1 text-left text-sm">
          <ScoreRow
            label="Base"
            value={`+${score.base}`}
            tone="neutral"
            delayMs={300}
          />
          <ScoreRow
            label={`Moves (${moves})`}
            value={`${score.movePenalty}`}
            tone="negative"
            delayMs={400}
          />
          <ScoreRow
            label={`Captures${score.captureBonus > 0 ? '' : ' (none)'}`}
            value={`${score.captureBonus > 0 ? '+' : ''}${score.captureBonus}`}
            tone={score.captureBonus > 0 ? 'positive' : 'muted'}
            delayMs={500}
          />
          <ScoreRow
            label={`Time (${score.seconds}s)`}
            value={`${score.timePenalty}`}
            tone="negative"
            delayMs={600}
          />
          {score.levelBonus > 0 && (
            <ScoreRow
              label={`Levels (${levelsCleared})`}
              value={`+${score.levelBonus}`}
              tone="positive"
              delayMs={700}
            />
          )}
          {score.tempoBonus > 0 && (
            <ScoreRow
              label="Tempo bank"
              value={`+${score.tempoBonus}`}
              tone="positive"
              delayMs={800}
            />
          )}
        </dl>

        <div className="mt-5 flex gap-2 justify-center">
          <button
            onClick={handleCopy}
            className="tap-highlight px-4 py-2 rounded-xl bg-chess-text text-white text-sm font-bold"
          >
            {shareCopied ? 'Copied!' : 'Share result'}
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

function ScoreRow({
  label,
  value,
  tone,
  delayMs,
}: {
  label: string;
  value: string;
  tone: 'positive' | 'negative' | 'neutral' | 'muted';
  delayMs: number;
}) {
  const color =
    tone === 'positive'
      ? 'text-emerald-600 dark:text-emerald-400'
      : tone === 'negative'
        ? 'text-rose-500 dark:text-rose-400'
        : tone === 'muted'
          ? 'text-chess-text-faint'
          : 'text-chess-text';
  return (
    <div
      className="flex justify-between border-b border-chess-text/5 pb-1"
      style={{
        animation: `rookiesRunRowIn 360ms ease-out both`,
        animationDelay: `${delayMs}ms`,
      }}
    >
      <dt className="text-chess-text-muted">{label}</dt>
      <dd className={`tabular-nums font-semibold ${color}`}>{value}</dd>
    </div>
  );
}
