'use client';

/**
 * EvalGraph — the whole game at a glance, board-width.
 *
 * Lichess-style: y = White's winning chances (top = White winning, bottom =
 * Black winning), midline at 50%. The current position is a vertical cursor;
 * tap or drag anywhere to jump. Player mistakes/blunders are marked.
 *
 * Replaces the old swinging eval bar in review (RULES.md §50: scales with the
 * board, no fixed widths, tap targets are the whole strip).
 */

import { useCallback, useMemo, useRef } from 'react';
import { evalToWinPercent } from '@/lib/game-eval';
import type { PositionEval, MoveClassification } from '@/lib/game-eval';

interface EvalGraphProps {
  /** One eval per position: index 0 = start, index N = after move N. Holes allowed. */
  evals: (PositionEval | null | undefined)[];
  /** Per-move info for markers (index i = move i, which lands on position i+1). */
  moves: { movedBy: 'player' | 'rookie'; classification?: MoveClassification | null }[];
  /** 0-based move index currently shown; -1 = start position. */
  currentMoveIndex: number;
  onSelectMove: (moveIndex: number) => void;
  /** Height in px. Width is always 100% of the container. */
  height?: number;
}

const W = 1000; // viewBox width — the SVG stretches to the container
const MARK: Partial<Record<MoveClassification, string>> = {
  blunder: '#EB4034',
  mistake: '#F59E0B',
  brilliant: '#1CB0F6',
};

export function EvalGraph({ evals, moves, currentMoveIndex, onSelectMove, height = 72 }: EvalGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const n = Math.max(1, moves.length); // number of moves → positions 0..n
  const H = height;
  const mid = H / 2;

  // White win% per position, carrying the last known value across holes.
  const points = useMemo(() => {
    const out: { x: number; y: number }[] = [];
    let last = 50;
    for (let i = 0; i <= n; i++) {
      const e = evals[i];
      if (e && (e.cp !== null || e.mate !== null)) last = evalToWinPercent(e.cp, e.mate);
      const x = (i / n) * W;
      const y = H - (last / 100) * H;
      out.push({ x, y });
    }
    return out;
  }, [evals, n, H]);

  const linePath = useMemo(
    () => points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
    [points],
  );
  // Fill from the line down to the bottom; the dark bottom layer shows through
  // wherever Black is better, the light fill where White is better.
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;

  const cursorX = ((currentMoveIndex + 1) / n) * W;

  const seek = useCallback((clientX: number) => {
    const el = svgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const pos = Math.round(frac * n); // position index 0..n
    onSelectMove(pos - 1);
  }, [n, onSelectMove]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="w-full rounded-lg overflow-hidden select-none touch-none cursor-pointer"
      style={{ height: H }}
      role="slider"
      aria-label="Game evaluation"
      aria-valuemin={-1}
      aria-valuemax={n - 1}
      aria-valuenow={currentMoveIndex}
      onPointerDown={(e) => {
        (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
        seek(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons & 1) seek(e.clientX);
      }}
    >
      {/* Black's side (bottom layer) */}
      <rect x={0} y={0} width={W} height={H} fill="#2A3C45" />
      {/* White's side */}
      <path d={areaPath} fill="#e8e8e8" />
      {/* Midline */}
      <line x1={0} x2={W} y1={mid} y2={mid} stroke="rgba(0,0,0,0.25)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {/* Eval line */}
      <path d={linePath} fill="none" stroke="#58CC02" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      {/* Markers for the player's notable moves */}
      {moves.map((m, i) => {
        if (m.movedBy !== 'player' || !m.classification) return null;
        const color = MARK[m.classification];
        if (!color) return null;
        const p = points[i + 1];
        if (!p) return null;
        return (
          <g key={i} transform={`translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`}>
            {/* scale-corrected dot: the viewBox is stretched horizontally, so draw as an ellipse in local units */}
            <ellipse rx={W / 160} ry={4.5} fill={color} stroke="#fff" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          </g>
        );
      })}
      {/* Cursor */}
      <line
        x1={cursorX} x2={cursorX} y1={0} y2={H}
        stroke="#58CC02" strokeWidth={2} vectorEffect="non-scaling-stroke"
        style={{ transition: 'x1 120ms ease-out, x2 120ms ease-out' }}
      />
    </svg>
  );
}
