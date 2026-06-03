'use client';

import { BreathingRook } from '@/components/ui/BreathingRook';
import { rookieRating, type EloSeriesPoint } from '@/lib/elo/rookie-rating';

export interface RookieRatingData {
  current: number;
  events: number;
  series: EloSeriesPoint[];
}

/**
 * RookieRatingCard — the "fun window" for a user's estimated rating, voiced
 * by Rookie. A self-contained card: drop it on the profile, in a modal
 * (see RookieRatingModal), anywhere. Voice lives in lib/elo/rookie-rating.ts.
 */
export function RookieRatingCard({
  data,
  loading,
  compact = false,
}: {
  data: RookieRatingData | null;
  loading?: boolean;
  /** Tighter padding for use inside a modal. */
  compact?: boolean;
}) {
  const hasData = !!data && data.events > 0;
  const r = hasData ? rookieRating(data!.current, data!.series) : null;

  // ── Mini sparkline (0–100 × 0–100, drawn flat to fill width) ──────────────
  const W = 100;
  const H = 100;
  const PAD = 8;
  let linePath = '';
  let areaPath = '';
  let lastPt: { x: number; y: number } | null = null;

  const series = data?.series ?? [];
  if (series.length >= 2) {
    const elos = series.map((p) => p.elo);
    const lo = Math.min(...elos);
    const hi = Math.max(...elos);
    const span = Math.max(1, hi - lo);
    const n = series.length;
    const coords = series.map((p, i) => ({
      x: (i / (n - 1)) * W,
      y: PAD + (1 - (p.elo - lo) / span) * (H - PAD * 2),
    }));
    linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(' ');
    areaPath = `${linePath} L${W},${H} L0,${H} Z`;
    lastPt = coords[coords.length - 1];
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-chess-blue/20 bg-gradient-to-b from-white to-chess-blue/5 shadow-sm ${
        compact ? 'p-5' : 'p-5 sm:p-6'
      }`}
    >
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

      {/* The number */}
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

      {/* Sparkline */}
      {!loading && series.length >= 2 && (
        <div className="mt-3">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-16 w-full" aria-hidden>
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

      {!loading && !hasData && (
        <p className="mt-3 text-sm leading-snug text-chess-text-muted">
          Solve a few puzzles or play me a game and I&apos;ll work out your rating — then I&apos;ll tell you what I think.
        </p>
      )}
    </div>
  );
}

export default RookieRatingCard;
