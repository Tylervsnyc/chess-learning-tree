'use client';

import Image from 'next/image';
import { Player } from '@/data/2026candidates/types';

/**
 * Scoreboard strip — player photos + names + eval bar in one row.
 * White player on left, black player on right, eval bar between.
 */
export function EvalBar({
  eval: cp,
  white,
  black,
}: {
  eval: number;
  white: Player;
  black: Player;
}) {
  const whitePercent = Math.min(
    94,
    Math.max(6, 50 + 50 * (2 / (1 + Math.exp(-cp / 400)) - 1))
  );

  const isMate = Math.abs(cp) > 9000;
  const mateIn = isMate ? Math.abs(cp) - 10000 : null;
  const displayEval = isMate
    ? `M${Math.abs(mateIn!)}`
    : (Math.abs(cp) / 100).toFixed(1);
  const isWhiteAdvantage = cp >= 0;

  return (
    <div className="flex w-full items-center gap-1.5">
      {/* White player */}
      <div className="flex shrink-0 items-center gap-1">
        <div className="relative h-5 w-5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
          <Image src={white.photo} alt={white.name} fill className="object-cover" />
        </div>
        <span className="text-[10px] font-bold text-chess-text">
          {white.name.split(' ').pop()}
        </span>
      </div>

      {/* Eval bar */}
      <div className="flex h-4 flex-1 items-stretch overflow-hidden rounded">
        {/* White section */}
        <div
          className="relative flex items-center justify-end pr-1 transition-all duration-500 ease-out"
          style={{ width: `${whitePercent}%`, backgroundColor: '#e8e8e8' }}
        >
          {isWhiteAdvantage && (
            <span className="text-[8px] font-bold text-chess-text">+{displayEval}</span>
          )}
        </div>
        {/* Black section */}
        <div
          className="relative flex items-center pl-1 transition-all duration-500 ease-out"
          style={{ width: `${100 - whitePercent}%`, backgroundColor: '#2A3C45' }}
        >
          {!isWhiteAdvantage && (
            <span className="text-[8px] font-bold text-white">+{displayEval}</span>
          )}
        </div>
      </div>

      {/* Black player */}
      <div className="flex shrink-0 items-center gap-1">
        <span className="text-[10px] font-bold text-chess-text">
          {black.name.split(' ').pop()}
        </span>
        <div className="relative h-5 w-5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
          <Image src={black.photo} alt={black.name} fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}
