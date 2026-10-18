'use client';

import { BreathingRook } from '@/components/ui/BreathingRook';
import { TALK_LINE, TALK_MOODS } from '../script';
import type { Stage } from '../stage';

export function TalkDemo({ stage }: { stage: Stage }) {
  const level = stage.isTalking ? stage.talkIntensity : 0;

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <p className="text-xs font-bold uppercase tracking-wider text-chess-text-faint">The line</p>
      <p className="mt-1 text-lg font-bold">&ldquo;{TALK_LINE}&rdquo;</p>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2">
        {TALK_MOODS.map((m) => (
          <button
            key={m}
            onClick={() => stage.say(TALK_LINE, { mood: m })}
            className={`flex flex-col items-center gap-2 rounded-2xl p-3 min-h-[44px] bg-chess-page transition ${
              stage.mood === m ? 'ring-2 ring-chess-text' : 'hover:-translate-y-0.5'
            }`}
          >
            <BreathingRook size="xs" mood={m} />
            <span className="text-sm font-bold capitalize">{m}</span>
          </button>
        ))}
      </div>

      {/* Live loudness — the exact signal that pulses her blocks */}
      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-wider text-chess-text-faint">Voice signal driving the pulse</p>
        <div className="mt-2 h-3 rounded-full bg-chess-page overflow-hidden">
          <div className="h-full bg-chess-green transition-[width] duration-75" style={{ width: `${Math.round(level * 100)}%` }} />
        </div>
        <p className="mt-2 text-sm text-chess-text-faint">
          Her blocks brighten and swell with each burst of speech. The center reacts most, the edges follow.
        </p>
      </div>
    </div>
  );
}
