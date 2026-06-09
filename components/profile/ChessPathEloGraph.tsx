'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChessPathPoint } from '@/lib/elo/chess-path-elo';

// Graph geometry (viewBox units)
const W = 100;
const H = 60;
const PAD = 9;
const X0 = 4;
const X1 = W - 4;

const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const backOut = (p: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

/**
 * ChessPathEloGraph — the "days of effort" line.
 *
 * One tick per calendar day, the line climbing, and (when `animateToday`) the
 * final dot lifts from yesterday's level up to today's with a pop + slow
 * breathing pulse. Dots are real round HTML elements positioned over the SVG —
 * SVG <circle>s distort into ellipses under preserveAspectRatio="none".
 *
 * Pass a windowed, monotonic series from chessPathEloSeries(). The last point
 * is "today"; the second-to-last is where the rise animates from.
 */
export function ChessPathEloGraph({
  points,
  animateToday = true,
}: {
  points: ChessPathPoint[];
  animateToday?: boolean;
}) {
  const [progress, setProgress] = useState(animateToday ? 0 : 1);
  const rafRef = useRef<number | null>(null);

  const fromElo = points.length > 1 ? points[points.length - 2].elo : points[0]?.elo ?? 0;
  const toElo = points[points.length - 1]?.elo ?? 0;

  const run = useCallback(() => {
    if (!animateToday) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setProgress(0);
    const DURATION = 1100;
    const delay = setTimeout(() => {
      let start: number | null = null;
      const tick = (ts: number) => {
        if (start === null) start = ts;
        const p = Math.min(1, (ts - start) / DURATION);
        setProgress(p);
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 450);
    return () => clearTimeout(delay);
  }, [animateToday, fromElo, toElo]);

  useEffect(() => {
    const cleanup = run();
    return () => {
      cleanup?.();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [run]);

  if (points.length < 2) return null;

  // Fixed scale across the whole window (incl. today's target) so nothing
  // rescales mid-animation.
  const allElos = points.map((p) => p.elo);
  const lo = Math.min(...allElos);
  const hi = Math.max(...allElos);
  const span = Math.max(1, hi - lo);
  const n = points.length;
  const coordOf = (elo: number, i: number) => ({
    x: X0 + (i / (n - 1)) * (X1 - X0),
    y: PAD + (1 - (elo - lo) / span) * (H - PAD * 2),
  });

  const pastCoords = points.slice(0, -1).map((p, i) => coordOf(p.elo, i));
  const eased = easeOut(progress);
  const liveElo = fromElo + (toElo - fromElo) * eased;
  const todayCoord = coordOf(liveElo, n - 1);

  const lineCoords = [...pastCoords, todayCoord];
  const linePath = lineCoords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(2)},${c.y.toFixed(2)}`)
    .join(' ');
  const areaPath = `${linePath} L${todayCoord.x.toFixed(2)},${H} L${pastCoords[0].x.toFixed(2)},${H} Z`;
  const dotScale = animateToday ? backOut(Math.min(1, progress * 1.1)) : 1;

  return (
    <div className="relative h-32 w-full">
      <style>{`
        @keyframes rookieDotPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 5px rgba(28,176,246,0.18); }
          50%      { transform: scale(1.14); box-shadow: 0 0 0 9px rgba(28,176,246,0.08); }
        }
      `}</style>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="cpEloFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chess-blue)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-chess-blue)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#cpEloFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-chess-blue)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* a tick for every day */}
      {pastCoords.map((c, i) => (
        <div
          key={i}
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white ring-[1.5px] ring-chess-blue/55"
          style={{ left: `${(c.x / W) * 100}%`, top: `${(c.y / H) * 100}%`, transform: 'translate(-50%, -50%)' }}
        />
      ))}

      {/* today's dot — outer positions + pops, inner pulses */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: `${(todayCoord.x / W) * 100}%`,
          top: `${(todayCoord.y / H) * 100}%`,
          transform: `translate(-50%, -50%) scale(${dotScale})`,
        }}
      >
        <div
          className="h-3 w-3 rounded-full bg-chess-blue ring-2 ring-white"
          style={{ animation: 'rookieDotPulse 2.2s ease-in-out infinite' }}
        />
      </div>
      <div
        className="pointer-events-none absolute text-[9px] font-black uppercase tracking-wide text-chess-blue"
        style={{ left: `${(todayCoord.x / W) * 100}%`, bottom: '-2px', transform: 'translateX(-60%)' }}
      >
        Today
      </div>
    </div>
  );
}

export default ChessPathEloGraph;
