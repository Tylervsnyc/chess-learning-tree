'use client';

import { useState } from 'react';
import { LockerHome } from '@/components/chessboxing/LockerHome';

export default function LockerLivePage() {
  const [streak, setStreak] = useState(13);
  const [useReal, setUseReal] = useState(false);
  return (
    <div className="h-full overflow-auto bg-[#0f1524] text-white">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold">Chess Boxing — locker home (live)</h1>
        <p className="mt-1 text-sm text-white/60">
          Layered art from redraw 3. Chalk tallies on the door = the streak. Tap the gloves.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={useReal} onChange={(e) => setUseReal(e.target.checked)} />
            use my real streak
          </label>
          {!useReal && (
            <label className="flex items-center gap-3 text-sm text-white/70">
              preview streak
              <input type="range" min={0} max={45} value={streak} onChange={(e) => setStreak(Number(e.target.value))} />
              <span className="w-8 font-bold text-white">{streak}</span>
            </label>
          )}
        </div>

        <div className="mx-auto mt-6 max-w-[380px] overflow-hidden rounded-2xl ring-1 ring-white/10">
          <LockerHome
            key={useReal ? 'real' : `preview-${streak}`}
            previewStreak={useReal ? undefined : streak}
            onFight={() => console.log('[locker] FIGHT tapped')}
            onTrain={() => console.log('[locker] TRAIN tapped')}
          />
        </div>
      </div>
    </div>
  );
}
