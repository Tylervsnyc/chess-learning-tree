'use client';

import { useEffect, useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { ChessPathEloGraph } from '@/components/profile/ChessPathEloGraph';
import {
  chessPathEloSeries,
  chessPathToday,
  type ChessPathPoint,
} from '@/lib/elo/chess-path-elo';

const TIERS = [
  { min: 0, tier: 'Just Starting' },
  { min: 400, tier: 'Finding It' },
  { min: 800, tier: 'Climbing' },
  { min: 1200, tier: 'Sharp' },
  { min: 1600, tier: 'Dangerous' },
];
const tierFor = (elo: number) =>
  [...TIERS].reverse().find((t) => elo >= t.min)?.tier ?? 'Just Starting';

// ── Synthetic demo points (a monotonic climb ending at `to`) ─────────────────
function demoPoints(from: number, to: number): ChessPathPoint[] {
  const shape = [0, 0.08, 0.16, 0.12, 0.26, 0.34, 0.3, 0.46, 0.55, 0.64, 0.8, 1];
  const base = from - 120;
  const raw = shape.map((s) => Math.round(base + s * (from - base)));
  let run = raw[0];
  const pts: ChessPathPoint[] = raw.map((v, i) => {
    run = Math.max(run, v);
    return { date: `d${i}`, elo: run, active: true };
  });
  pts.push({ date: 'today', elo: to, active: true });
  return pts;
}

const SCENARIOS = [
  { label: 'First week', from: 600, to: 614 },
  { label: 'Two weeks in', from: 740, to: 758 },
  { label: 'Crushed it', from: 805, to: 832 },
  { label: 'On a tear', from: 980, to: 1006 },
];

export default function ChessPathEloTest() {
  const [scenario, setScenario] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [useReal, setUseReal] = useState(false);
  const [realPoints, setRealPoints] = useState<ChessPathPoint[] | null>(null);
  const [realError, setRealError] = useState<string | null>(null);

  useEffect(() => {
    if (!useReal || realPoints) return;
    fetch('/api/profile/elo?fresh=1')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then((data) => {
        const pts = chessPathEloSeries(data.series ?? []);
        if (pts.length < 2) setRealError('Not enough history yet — solve a few puzzles first.');
        else setRealPoints(pts);
      })
      .catch((e) => setRealError(`Couldn't load your data (${e.message}). Are you logged in?`));
  }, [useReal, realPoints]);

  const sc = SCENARIOS[scenario];
  const points = useReal ? realPoints : demoPoints(sc.from, sc.to);
  const today = points ? chessPathToday(points) : null;

  return (
    <div className="min-h-full overflow-auto bg-[#E8F4FB] px-4 py-10">
      <div className="mx-auto max-w-md">
        {/* ── The celebration popup mock ─────────────────────────────── */}
        <div className="relative overflow-hidden rounded-[28px] bg-white p-7 shadow-xl ring-1 ring-chess-blue/10">
          <div className="flex flex-col items-center text-center">
            <BreathingRook size="lg" mood="happy" animate />
            <p className="mt-4 text-[11px] font-black uppercase tracking-[0.14em] text-chess-blue">
              Lesson complete
            </p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-chess-text">Look at you go.</h1>
          </div>

          <div className="mt-6 rounded-3xl border border-chess-blue/15 bg-gradient-to-b from-chess-blue/[0.06] to-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wide text-chess-blue">
                Chess Path ELO
              </span>
              {today && today.gainedToday > 0 && (
                <span className="text-sm font-black text-emerald-500">+{today.gainedToday} today</span>
              )}
            </div>

            {today ? (
              <>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-5xl font-black tabular-nums leading-none text-chess-text">
                    {today.current.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wide text-chess-text-muted">
                    {tierFor(today.current)}
                  </span>
                </div>
                <div className="mt-4">
                  {points && <ChessPathEloGraph key={`${replayKey}-${useReal}-${scenario}`} points={points} />}
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-chess-text-muted">{realError ?? 'Loading your real data…'}</p>
            )}
          </div>

          <button className="mt-6 w-full rounded-2xl bg-chess-blue py-4 text-base font-black text-white shadow-[0_4px_0_var(--color-chess-blue-shadow)] active:translate-y-0.5 active:shadow-[0_2px_0_var(--color-chess-blue-shadow)]">
            Keep going
          </button>
        </div>

        {/* ── Demo controls ─────────────────────────────── */}
        <div className="mt-8 rounded-2xl bg-white/70 p-4 ring-1 ring-chess-blue/10">
          <div className="flex gap-2">
            <button
              onClick={() => setUseReal(false)}
              className={`flex-1 rounded-xl py-2 text-xs font-black uppercase tracking-wide transition-colors ${!useReal ? 'bg-chess-blue text-white' : 'bg-slate-100 text-chess-text-muted'}`}
            >
              Demo
            </button>
            <button
              onClick={() => setUseReal(true)}
              className={`flex-1 rounded-xl py-2 text-xs font-black uppercase tracking-wide transition-colors ${useReal ? 'bg-chess-blue text-white' : 'bg-slate-100 text-chess-text-muted'}`}
            >
              My real data
            </button>
          </div>

          {!useReal && (
            <>
              <p className="mt-4 text-[11px] font-black uppercase tracking-wide text-chess-text-muted">Finish</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SCENARIOS.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setScenario(i)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${i === scenario ? 'bg-chess-text text-white' : 'bg-slate-100 text-chess-text-muted'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            onClick={() => setReplayKey((k) => k + 1)}
            className="mt-3 w-full rounded-xl border-2 border-chess-blue/30 py-2 text-xs font-black uppercase tracking-wide text-chess-blue"
          >
            Replay animation
          </button>
        </div>
      </div>
    </div>
  );
}
