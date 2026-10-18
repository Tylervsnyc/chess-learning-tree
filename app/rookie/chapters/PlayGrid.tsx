'use client';

import { useRef } from 'react';
import { InteractiveRook } from '@/components/ui/InteractiveRook';
import { LEARN_TAP_REACTIONS } from '@/data/quips/learn-tap-quips';
import { ShuffleBag } from '@/lib/shuffle-bag';
import type { Stage } from '../stage';

// The tour only shows the modes that read well from a click; /play has them all.
const TOUR_MODES = ['tractor', 'eraser', 'paint', 'shockwave'];
const TOUR_REACTIONS = TOUR_MODES.map((m) => LEARN_TAP_REACTIONS.find((r) => r.mode === m)!);

/** The interactive Rookie from /play — four shipped modes, with their shipped quips. */
export function PlayGrid({ stage }: { stage: Stage }) {
  const bags = useRef(new Map(TOUR_REACTIONS.map((r) => [r.mode, new ShuffleBag(r.quips)])));

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TOUR_REACTIONS.map((r) => (
          <div
            key={r.mode}
            onPointerDown={() => stage.say(bags.current.get(r.mode)!.draw())}
            className="bg-white rounded-2xl pt-4 pb-3 flex flex-col items-center gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.05)] touch-none select-none cursor-pointer"
          >
            <div className="h-[110px] flex items-center justify-center">
              <InteractiveRook mode={r.mode} blockSize={16} />
            </div>
            <p className="text-[12px] font-bold uppercase tracking-wider text-chess-text-muted">{r.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-chess-text-faint">Tap or drag each one. These are live from the Play screen.</p>
    </>
  );
}
