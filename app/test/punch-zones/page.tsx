'use client';

/**
 * /test/punch-zones — QUADRANT FIGHT prototype (NOT linked from the app).
 *
 * The game itself lives in components/box/QuadrantFight.tsx (shared with the
 * Chess Boxing workout + Bout opt-in). This page is the full-page harness:
 * same game, page chrome only, plus a round-length picker + level dial and
 * the boot-timing readout. Judging/tracking is FROZEN — edit nothing about
 * timing or scoring without a playtest.
 */

import { useState } from 'react';
import QuadrantFight from '@/components/box/QuadrantFight';
import type { FightStats } from '@/lib/box/fight-stats';

const DURATIONS = [
  { label: '1:00', ms: 60_000 },
  { label: '3:00', ms: 180_000 },
];

export default function PunchZonesPage() {
  const [durationMs, setDurationMs] = useState(180_000);
  const [level, setLevel] = useState(1);
  const [gen, setGen] = useState(0); // remount key — a new mount = a new round clock
  const [last, setLast] = useState<FightStats | null>(null);

  return (
    <div className="h-full overflow-auto bg-slate-950 text-white">
      <div className="mx-auto max-w-lg px-4 py-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quadrant Fight <span className="text-slate-500 text-sm font-normal">/test prototype</span></h1>
          <p className="text-slate-400 text-sm">Punch the green squares. Dodge the red. One round, the bell ends it.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          {DURATIONS.map((d) => (
            <button
              key={d.ms}
              onClick={() => { setDurationMs(d.ms); setGen((g) => g + 1); }}
              className={`min-h-11 px-4 rounded-full font-bold ${durationMs === d.ms ? 'bg-green-500 text-green-950' : 'bg-slate-800 text-slate-300'}`}
            >
              {d.label}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-slate-300">
            Level
            <input
              type="range"
              min={1}
              max={10}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-28"
            />
            <span className="w-5 font-bold tabular-nums">{level}</span>
          </label>
        </div>

        <QuadrantFight
          key={`${gen}-${durationMs}`}
          durationMs={durationMs}
          level={level}
          onFinish={(s) => { console.info('[qf-finish]', s); setLast(s); }}
        />

        <button
          onClick={() => { setLast(null); setGen((g) => g + 1); }}
          className="self-center min-h-11 px-6 rounded-full bg-slate-800 text-slate-200 font-bold"
        >
          New round (remount)
        </button>

        {last && (
          <pre className="rounded-xl bg-slate-900 p-3 text-xs text-slate-300 overflow-x-auto">
            {JSON.stringify(last, null, 2)}
          </pre>
        )}

        <p className="text-slate-400 text-xs">
          Yellow dots = wrists · blue ring = head · each lit square has its own clock.
          Amber −N = damage you dealt · red −N = damage you took. Tempo ramps over the round;
          2 commands at once after halfway, 3 in the last fifth at level 5+. Boot timing is
          logged as <code>[qf-boot]</code> and shown under the tiles; onFinish is logged as <code>[qf-finish]</code>.
          MoveNet Lightning from npm, weights self-hosted in /models/movenet-lightning.
        </p>
      </div>
    </div>
  );
}
