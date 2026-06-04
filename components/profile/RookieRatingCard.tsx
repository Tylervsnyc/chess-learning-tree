'use client';

import { useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { rookieRating, type EloSeriesPoint } from '@/lib/elo/rookie-rating';

export interface RookieRatingData {
  current: number;
  events: number;
  series: EloSeriesPoint[];
}

type EloRange = 'week' | 'month' | 'all';

const ELO_RANGES: { key: EloRange; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'all', label: 'Since start' },
];

// Earliest YYYY-MM-DD (local) that falls inside the selected window.
function rangeCutoff(range: EloRange): string | null {
  if (range === 'all') return null;
  const d = new Date();
  d.setDate(d.getDate() - (range === 'week' ? 7 : 30));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * RookieRatingCard — the single estimated-rating surface on the profile.
 * Rookie's voice (headline, tier, quote) sits on top of the detailed chart
 * with a Week / Month / Since-start toggle. Voice lives in
 * lib/elo/rookie-rating.ts. (Replaces the old split "fun window" + EloCard.)
 */
export function RookieRatingCard({
  data,
  loading,
}: {
  data: RookieRatingData | null;
  loading?: boolean;
}) {
  const [range, setRange] = useState<EloRange>('all'); // default: since they started

  const hasData = !!data && data.events > 0;
  const r = hasData ? rookieRating(data!.current, data!.series) : null;

  // ── Slice the full daily series down to the selected window ──────────────
  const fullSeries = data?.series ?? [];
  const cutoff = rangeCutoff(range);
  let windowSeries = cutoff ? fullSeries.filter((p) => p.date >= cutoff) : fullSeries;
  // Anchor the line to where the rating actually was entering the window, so a
  // short window still draws a real trend instead of a flat single point.
  if (cutoff && windowSeries.length < fullSeries.length) {
    const priorIdx = fullSeries.findIndex((p) => p.date >= cutoff) - 1;
    if (priorIdx >= 0) windowSeries = [fullSeries[priorIdx], ...windowSeries];
  }

  const hasSeries = hasData && windowSeries.length >= 2;

  // ── Build the SVG line path in a 0–100 × 0–100 viewBox ───────────────────
  const W = 100;
  const H = 100;
  const PAD_Y = 8;

  let linePath = '';
  let areaPath = '';
  let lastPt: { x: number; y: number } | null = null;
  let lo = 0;
  let hi = 0;

  if (hasSeries) {
    const elos = windowSeries.map((p) => p.elo);
    lo = Math.min(...elos);
    hi = Math.max(...elos);
    const span = Math.max(1, hi - lo);
    const n = windowSeries.length;
    const coords = windowSeries.map((p, i) => {
      const x = n === 1 ? W : (i / (n - 1)) * W;
      const y = PAD_Y + (1 - (p.elo - lo) / span) * (H - PAD_Y * 2);
      return { x, y };
    });
    linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(' ');
    areaPath = `${linePath} L${W},${H} L0,${H} Z`;
    lastPt = coords[coords.length - 1];
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-chess-blue/20 bg-gradient-to-b from-white to-chess-blue/5 p-5 shadow-sm sm:p-6">
      {/* Header: Rookie + her line */}
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <BreathingRook size="sm" mood={hasData ? 'happy' : 'neutral'} animate />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-black uppercase tracking-wide text-chess-blue">
              From Rookie
            </h2>
            <span className="inline-flex items-center rounded-full bg-chess-blue/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-chess-blue">
              Beta
            </span>
          </div>
          <p className="mt-1 text-[15px] font-bold leading-snug text-chess-text">
            {loading || !r ? 'Let me look at your games…' : r.headline}
          </p>
        </div>
      </div>

      {/* The number + tier */}
      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black leading-none tabular-nums text-chess-text">
            {loading || !hasData ? '–' : data!.current.toLocaleString()}
          </span>
          <span className="text-sm font-bold text-chess-text-muted">ELO</span>
        </div>
        {r && (
          <span className="rounded-full bg-chess-blue px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white">
            {r.tier}
          </span>
        )}
      </div>

      {/* Range toggle */}
      {hasData && (
        <div className="mt-3 inline-flex rounded-full bg-slate-100 p-0.5">
          {ELO_RANGES.map((rg) => (
            <button
              key={rg.key}
              type="button"
              onClick={() => setRange(rg.key)}
              className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                range === rg.key ? 'bg-white text-chess-text shadow-sm' : 'text-chess-text-muted'
              }`}
            >
              {rg.label}
            </button>
          ))}
        </div>
      )}

      {/* Chart */}
      {loading ? (
        <div className="mt-4 h-28 animate-pulse rounded-xl bg-slate-100" />
      ) : !hasData ? (
        <p className="mt-3 text-sm leading-snug text-chess-text-muted">
          Solve a few puzzles or play me a game and I&apos;ll work out your rating — then I&apos;ll tell you what I think.
        </p>
      ) : !hasSeries ? (
        <p className="mt-4 text-sm leading-snug text-chess-text-muted">
          {range !== 'all'
            ? `No rating activity in the last ${range === 'week' ? '7 days' : '30 days'}. Try “Since start” to see your full history.`
            : 'Play a few more games and the trend line will fill in here.'}
        </p>
      ) : (
        <>
          <div className="mt-4 relative">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-28 w-full" aria-hidden>
              <defs>
                <linearGradient id="rookieEloFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chess-blue, #3b82f6)" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="var(--color-chess-blue, #3b82f6)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#rookieEloFill)" />
              <path
                d={linePath}
                fill="none"
                stroke="var(--color-chess-blue, #3b82f6)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {lastPt && (
                <circle
                  cx={lastPt.x}
                  cy={lastPt.y}
                  r={3.5}
                  fill="var(--color-chess-blue, #3b82f6)"
                  stroke="white"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-chess-text-faint">
            <span>Low {lo.toLocaleString()}</span>
            <span>High {hi.toLocaleString()}</span>
          </div>
        </>
      )}

      {/* Rookie's quote */}
      {r && (
        <div className="mt-3 rounded-2xl border-l-[3px] border-chess-blue bg-chess-blue/5 px-3.5 py-3">
          <p className="text-[13.5px] italic leading-relaxed text-chess-text">{r.line}</p>
          {r.trend && (
            <p className="mt-1.5 text-[12.5px] italic leading-relaxed text-chess-text-muted">{r.trend}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RookieRatingCard;
