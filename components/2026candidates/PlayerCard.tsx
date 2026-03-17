'use client';

import Image from 'next/image';
import { Player } from '@/data/2026candidates/types';

/**
 * Thin horizontal player card with clear WHITE / BLACK labels.
 * Spans wide, minimal height. Floats over the facecam zone.
 */
export function PlayerCard({
  white,
  black,
  round,
}: {
  white: Player;
  black: Player;
  round: number;
}) {
  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm">
      {/* White player */}
      <div className="flex items-center gap-1.5 py-1.5 pl-2 pr-3">
        <div className="rounded bg-slate-100 px-1 py-0.5 text-[8px] font-black uppercase tracking-wider text-chess-text-muted">
          W
        </div>
        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
          <Image src={white.photo} alt={white.name} fill className="object-cover" />
        </div>
        <span className="text-[11px] font-bold text-chess-text">{white.name.split(' ').pop()}</span>
        <span className="text-[9px] font-bold text-chess-green">{white.points}</span>
      </div>

      {/* Round divider */}
      <div className="flex flex-col items-center border-x border-slate-200 px-2 py-1">
        <span className="text-[8px] font-bold uppercase tracking-wider text-chess-text-faint">R{round}</span>
      </div>

      {/* Black player */}
      <div className="flex items-center gap-1.5 py-1.5 pl-3 pr-2">
        <div className="rounded bg-chess-text px-1 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
          B
        </div>
        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
          <Image src={black.photo} alt={black.name} fill className="object-cover" />
        </div>
        <span className="text-[11px] font-bold text-chess-text">{black.name.split(' ').pop()}</span>
        <span className="text-[9px] font-bold text-chess-green">{black.points}</span>
      </div>
    </div>
  );
}
