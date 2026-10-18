'use client';

import { BreathingRook } from '@/components/ui/BreathingRook';
import { ACTIVE_MOODS, POTENTIAL_MOODS } from '@/lib/rookie-os/types';
import { MOOD_COLORS } from '../script';
import type { Stage } from '../stage';

export function MoodGallery({ stage }: { stage: Stage }) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ACTIVE_MOODS.map((m) => (
          <button
            key={m}
            onClick={() => stage.setLook(m)}
            className={`bg-white rounded-2xl p-3 flex flex-col items-center gap-2 min-h-[44px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition ${
              stage.mood === m ? 'ring-2 ring-chess-text' : 'hover:-translate-y-0.5'
            }`}
          >
            <BreathingRook size="sm" mood={m} animate />
            <span className="font-black capitalize text-sm">{m}</span>
            <span className="text-[12px] text-chess-text-muted text-center leading-tight">{MOOD_COLORS[m]}</span>
          </button>
        ))}
      </div>
      <p className="mt-6 text-xs font-bold uppercase tracking-wider text-chess-text-faint">
        Designed, not in games yet
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {POTENTIAL_MOODS.map((m) => (
          <button
            key={m}
            onClick={() => stage.setLook(m)}
            className={`flex items-center gap-2 bg-white rounded-full pl-2 pr-3 min-h-[44px] shadow-[0_1px_6px_rgba(0,0,0,0.05)] ${
              stage.mood === m ? 'ring-2 ring-chess-text' : ''
            }`}
          >
            <BreathingRook size="xs" mood={m} />
            <span className="text-sm font-bold capitalize">{m}</span>
          </button>
        ))}
      </div>
    </>
  );
}
