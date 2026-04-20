'use client';

import { useCallback, useState } from 'react';
import { ROOKIE_LEVELS, WINS_TO_ADVANCE } from '@/lib/rookie-levels';
import { QUIP_POOL } from '@/lib/quips/quip-pool';

function levelUpQuipFor(level: number): string | null {
  const line = QUIP_POOL.find(l => l.category === `play:levelup:${level}`);
  return line?.text ?? null;
}
import { LevelUpCelebration } from '@/components/play/LevelUpCelebration';

function LevelProgressBar({
  currentLevel,
  winsAtLevel,
  animDurationMs = 700,
  celebrate = false,
}: {
  currentLevel: number;
  winsAtLevel: number;
  animDurationMs?: number;
  celebrate?: boolean;
}) {
  const levelPct = (lvl: number) => ((lvl - 1) / 9) * 100;
  const fillPct = levelPct(currentLevel) + (winsAtLevel / WINS_TO_ADVANCE) * (100 / 9);

  return (
    <div className="w-full">
      <div className="relative h-4 mb-1">
        {ROOKIE_LEVELS.map((l) => {
          const pos = levelPct(l.level);
          const isCompleted = l.level < currentLevel;
          const isCurrent = l.level === currentLevel;
          return (
            <span
              key={l.level}
              className={`absolute -translate-x-1/2 text-[10px] font-bold tabular-nums ${
                isCurrent ? 'text-chess-green'
                  : isCompleted ? 'text-chess-text-muted' : 'text-chess-disabled'
              }`}
              style={{ left: `${pos}%` }}
            >
              {l.level}
            </span>
          );
        })}
      </div>
      <div className="relative h-3.5 rounded-full overflow-hidden bg-slate-200"
        style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.04)' }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full ease-out"
          style={{
            width: `${Math.max(fillPct, 1)}%`,
            background: celebrate
              ? 'linear-gradient(to right, #FFD700, #FFA500, #FFD700)'
              : 'linear-gradient(to right, #58CC02, #6EE018)',
            boxShadow: celebrate
              ? 'inset 0 -1px 0 rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5), 0 0 18px rgba(255, 200, 0, 0.8)'
              : 'inset 0 -1px 0 rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
            transition: `width ${animDurationMs}ms ease-out, background 300ms ease-out, box-shadow 300ms ease-out`,
          }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full pointer-events-none ease-out"
          style={{
            width: `${Math.max(fillPct, 1)}%`,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, transparent 50%)',
            transition: `width ${animDurationMs}ms ease-out`,
          }}
        />
        {ROOKIE_LEVELS.slice(1, -1).map((l) => {
          const pos = levelPct(l.level);
          const isCompleted = l.level < currentLevel;
          return (
            <div
              key={l.level}
              className="absolute top-0 bottom-0 w-[2px] z-10"
              style={{
                left: `${pos}%`,
                background: isCompleted
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.12)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function LevelUpTestPage() {
  const [fromLevel, setFromLevel] = useState(1);
  const [barState, setBarState] = useState<{ level: number; wins: number; duration: number }>({
    level: 1,
    wins: 0,
    duration: 0,
  });
  const [quip, setQuip] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const play = useCallback(
    async (startLevel: number) => {
      if (playing) return;
      const newLevel = Math.min(10, startLevel + 1);
      setPlaying(true);
      setQuip(null);
      setCelebrating(false);

      // Reset to start: old level, 0 wins
      setBarState({ level: startLevel, wins: 0, duration: 0 });
      await new Promise((r) => setTimeout(r, 50));

      // Fill to 3/3 wins at old level (simulates the 3rd win happening)
      setBarState({ level: startLevel, wins: WINS_TO_ADVANCE, duration: 700 });
      await new Promise((r) => setTimeout(r, 900));

      // Snap to old level full — mirror production exact sequence
      setBarState({ level: startLevel, wins: WINS_TO_ADVANCE, duration: 0 });
      await new Promise((r) => setTimeout(r, 80));

      // Trigger gold + fireworks at the moment of transition
      setCelebrating(true);

      // Animate to new level, 0 wins
      const DURATION = 1600;
      setBarState({ level: newLevel, wins: 0, duration: DURATION });
      await new Promise((r) => setTimeout(r, DURATION + 100));

      // Let celebration finish, then fade
      await new Promise((r) => setTimeout(r, 300));
      setCelebrating(false);

      // Show the level-up quip (visual only — this page doesn't play voice)
      setQuip(levelUpQuipFor(newLevel) ?? '(no quip defined)');

      // Play audio via the same endpoint the app uses
      try {
        const res = await fetch('/api/rookie-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ speakOnly: levelUpQuipFor(newLevel) }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.audio) {
            const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
            audio.play().catch(() => {});
          }
        }
      } catch {}

      setPlaying(false);
    },
    [playing]
  );

  return (
    <div className="fixed inset-0 overflow-auto bg-white">
      <div className="mx-auto max-w-xl px-6 py-10">
        <h1 className="text-2xl font-bold text-chess-text mb-2">Level-Up Animation Test</h1>
        <p className="text-sm text-chess-text-muted mb-8">
          Preview the progress bar animation and per-level quip. Start from any level.
        </p>

        <div className="mb-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
          <div className="relative">
            <LevelProgressBar
              currentLevel={barState.level}
              winsAtLevel={barState.wins}
              animDurationMs={barState.duration}
              celebrate={celebrating}
            />
            <LevelUpCelebration active={celebrating} />
          </div>
          <div className="mt-6 min-h-[72px] flex items-center justify-center">
            {quip ? (
              <div className="text-center px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-wide text-chess-green mb-1">
                  Level {barState.level} — Rookie
                </div>
                <div className="text-chess-text font-medium">&ldquo;{quip}&rdquo;</div>
              </div>
            ) : (
              <div className="text-xs text-chess-text-muted">
                {playing ? 'Animating…' : 'Pick a starting level and press Play.'}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-chess-text-muted uppercase tracking-wide block mb-2">
            Start from level
          </label>
          <div className="grid grid-cols-5 gap-2">
            {ROOKIE_LEVELS.slice(0, 9).map((l) => (
              <button
                key={l.level}
                onClick={() => setFromLevel(l.level)}
                className={`py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                  fromLevel === l.level
                    ? 'bg-chess-green text-white border-chess-green'
                    : 'bg-white text-chess-text border-slate-200 hover:border-chess-green'
                }`}
              >
                {l.level}
              </button>
            ))}
          </div>
          <div className="text-xs text-chess-text-muted mt-2">
            Will animate from level {fromLevel} → {fromLevel + 1}
          </div>
        </div>

        <button
          onClick={() => play(fromLevel)}
          disabled={playing}
          className="w-full py-4 rounded-xl bg-chess-green text-white font-bold text-lg disabled:opacity-50"
          style={{ boxShadow: '0 4px 0 var(--color-chess-green-dark)' }}
        >
          {playing ? 'Playing…' : 'Play animation'}
        </button>
      </div>
    </div>
  );
}
