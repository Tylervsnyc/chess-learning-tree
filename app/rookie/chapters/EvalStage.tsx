'use client';

import { useEffect, useRef, useState } from 'react';
import { evalToRookieMood } from '@/lib/eval-zones';
import { AUTOPLAY_CURVE } from '../script';
import type { Stage } from '../stage';

const MIN = -8;
const MAX = 8;

// Zone bands in Rookie's pawns — mirrors the thresholds in lib/eval-zones.ts.
const BANDS: { from: number; to: number; mood: string; color: string }[] = [
  { from: MIN, to: -3, mood: 'defeated', color: '#2a2a2f' },
  { from: -3, to: -1.5, mood: 'panicking', color: '#dc1414' },
  { from: -1.5, to: -0.5, mood: 'nervous', color: '#788caa' },
  { from: -0.5, to: 0.5, mood: 'neutral', color: '#cbd5e1' },
  { from: 0.5, to: 1.5, mood: 'scheming', color: '#00b450' },
  { from: 1.5, to: 3, mood: 'happy', color: '#58cc02' },
  { from: 3, to: MAX, mood: 'smug', color: '#a050dc' },
];

const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;

function formatPawns(v: number) {
  const r = Math.round(v * 10) / 10;
  return `${r > 0 ? '+' : ''}${r.toFixed(1)}`;
}

export function EvalStage({ stage }: { stage: Stage }) {
  const [value, setValue] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setLook } = stage;

  // The real mapping the /play screen uses (Rookie playing white, so +cp = Rookie ahead).
  const result = evalToRookieMood(Math.round(value * 100), null, 'white');

  useEffect(() => { setLook(result.mood); }, [result.mood, setLook]);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const autoplay = () => {
    if (timer.current) clearInterval(timer.current);
    let i = 0;
    setPlaying(true);
    setValue(AUTOPLAY_CURVE[0]);
    timer.current = setInterval(() => {
      i++;
      if (i >= AUTOPLAY_CURVE.length) {
        clearInterval(timer.current!);
        timer.current = null;
        setPlaying(false);
        return;
      }
      setValue(AUTOPLAY_CURVE[i]);
    }, 1100);
  };

  const onDrag = (v: number) => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; setPlaying(false); }
    setValue(v);
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-chess-text-faint">Rookie&apos;s evaluation</p>
          <p className="text-3xl font-black tabular-nums">{formatPawns(value)}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black capitalize">{result.mood}</p>
          <p className="text-sm text-chess-text-muted">{result.reason}</p>
        </div>
      </div>

      {/* Zone bar */}
      <div className="relative mt-5 h-4 rounded-full overflow-hidden flex">
        {BANDS.map((b) => (
          <div key={b.mood} style={{ width: `${pct(b.to) - pct(b.from)}%`, background: b.color }} />
        ))}
        <div
          className="absolute top-[-4px] w-1.5 h-6 rounded-full bg-chess-text shadow transition-[left] duration-500"
          style={{ left: `calc(${pct(value)}% - 3px)` }}
        />
      </div>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={0.1}
        value={value}
        onChange={(e) => onDrag(parseFloat(e.target.value))}
        aria-label="Rookie's evaluation in pawns"
        className="mt-3 w-full h-11 accent-chess-text cursor-pointer"
      />
      <div className="flex justify-between text-[11px] font-bold text-chess-text-faint">
        <span>Rookie losing</span>
        <span>Even</span>
        <span>Rookie winning</span>
      </div>

      <button
        onClick={autoplay}
        disabled={playing}
        className="mt-5 min-h-[48px] px-5 rounded-2xl bg-chess-blue text-white font-bold shadow-[0_4px_0_var(--color-chess-blue-shadow)] active:translate-y-[2px] disabled:opacity-60"
      >
        {playing ? 'Playing a game…' : 'Autoplay a game'}
      </button>
      <p className="mt-2 text-sm text-chess-text-faint">
        A sample game: Rookie gets ahead, gets smug, then throws it away.
      </p>
    </div>
  );
}
