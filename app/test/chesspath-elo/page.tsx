'use client';

import { useMemo, useState } from 'react';
import { ChessPathEloGraph } from '@/components/profile/ChessPathEloGraph';
import {
  chessPathEloSeries,
  chessPathToday,
  type EloSeriesPoint,
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

// A date `n` days ago as YYYY-MM-DD.
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Typical-user journeys: [daysAgo, raw estimate]. The estimate wobbles (dips
// happen!) and the graph plots it honestly (CHE-385) — same number and curve
// the profile shows. Encouragement lives in copy: a down day hides the badge.
const PERSONAS: { label: string; blurb: string; days: [number, number][] }[] = [
  {
    label: 'Day 3 — brand new',
    blurb: 'Just downloaded it',
    days: [[3, 450], [1, 480], [0, 520]],
  },
  {
    label: '2 weeks in',
    blurb: 'Building the habit',
    days: [
      [14, 450], [13, 465], [11, 458], [10, 500], [8, 520],
      [7, 512], [5, 555], [4, 580], [2, 600], [1, 612], [0, 645],
    ],
  },
  {
    label: '1 month in',
    blurb: 'Hooked',
    days: [
      [30, 430], [29, 445], [27, 438], [26, 470], [24, 485], [22, 476],
      [20, 510], [18, 535], [16, 524], [14, 560], [12, 585], [11, 600],
      [9, 618], [7, 640], [6, 631], [4, 672], [3, 690], [1, 706], [0, 738],
    ],
  },
  {
    label: 'Bad day (no gain)',
    blurb: 'Showed up, missed the bar',
    days: [
      [10, 600], [8, 640], [7, 660], [5, 700], [4, 690], [2, 720], [1, 740], [0, 735],
    ],
  },
];

export default function ChessPathEloTest() {
  const [persona, setPersona] = useState(2);
  const [replayKey, setReplayKey] = useState(0);

  const { points, today } = useMemo(() => {
    const series: EloSeriesPoint[] = PERSONAS[persona].days.map(([n, elo]) => ({
      date: daysAgo(n),
      elo,
    }));
    const pts = chessPathEloSeries(series); // whole journey — matches production
    return { points: pts, today: chessPathToday(pts) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona]);

  return (
    <div className="min-h-full overflow-auto bg-[#E8F4FB] px-4 py-10">
      <div className="mx-auto max-w-sm">
        {/* ── The real chart-first completion popup (mock) ───────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-white px-6 pt-6 pb-5 shadow-xl ring-1 ring-black/5">
          <div className="w-full rounded-xl bg-[#f0f4f8] px-4 py-2 text-center">
            <h2 className="text-[15px] font-black leading-tight text-chess-text">Lesson Complete!</h2>
            <div className="mt-1 text-xs font-bold text-chess-text-muted">Forks &amp; Skewers · 5/6</div>
          </div>

          {/* ELO card */}
          <div className="mt-4 w-full rounded-2xl border border-chess-blue/15 bg-gradient-to-b from-chess-blue/[0.06] to-white p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wide text-chess-blue">
                Chess Path ELO
              </span>
              {today.gainedToday > 0 && (
                <span className="text-sm font-black text-emerald-500">+{today.gainedToday} today</span>
              )}
            </div>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-3xl font-black tabular-nums leading-none text-chess-text">
                {today.current.toLocaleString()}
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-chess-text-muted">
                {tierFor(today.current)}
              </span>
            </div>
            <div className="mt-2">
              <ChessPathEloGraph key={`${replayKey}-${persona}`} points={points} heightClass="h-24" />
            </div>
          </div>

          <button className="mt-5 w-full rounded-2xl bg-chess-blue py-4 text-base font-black text-white shadow-[0_4px_0_var(--color-chess-blue-shadow)] active:translate-y-0.5">
            Continue
          </button>
        </div>

        {/* ── Persona switcher ───────────────────────────── */}
        <div className="mt-8 rounded-2xl bg-white/70 p-4 ring-1 ring-chess-blue/10">
          <p className="text-[11px] font-black uppercase tracking-wide text-chess-text-muted">
            Typical user
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {PERSONAS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setPersona(i)}
                className={`rounded-xl px-3 py-2 text-left transition-colors ${i === persona ? 'bg-chess-blue text-white' : 'bg-slate-100 text-chess-text-muted'}`}
              >
                <span className="block text-xs font-black">{p.label}</span>
                <span className={`block text-[10px] leading-tight ${i === persona ? 'text-white/80' : 'text-chess-text-faint'}`}>
                  {p.blurb}
                </span>
              </button>
            ))}
          </div>
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
