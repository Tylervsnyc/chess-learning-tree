'use client';

import { useState } from 'react';
import { BoxingLogoLoader } from '@/components/chessboxing/BoxingLogoLoader';

export default function ChessBoxingLoaderPage() {
  const [runId, setRunId] = useState(0);
  return (
    <div className="h-full overflow-auto bg-[#101a33] text-white">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold">Chess Boxing — loading animation</h1>
        <p className="mt-1 text-sm text-white/60">
          Board fades in, rope draws itself, pads pop clockwise, Rookie enters center-out, then breathes.
        </p>
        <button
          onClick={() => setRunId((r) => r + 1)}
          className="mt-4 rounded-lg bg-[#e5484d] px-4 py-2 text-sm font-semibold hover:brightness-110"
        >
          Replay
        </button>

        <div className="mt-8 flex flex-wrap items-end gap-10">
          {[240, 120, 64].map((s) => (
            <div key={s}>
              <BoxingLogoLoader key={`${runId}-${s}`} size={s} />
              <div className="mt-2 text-center text-xs text-white/40">{s}px</div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-white/5 p-6">
          <h2 className="text-sm font-semibold text-white/70">Full-screen splash preview</h2>
          <div className="mt-4 flex h-[420px] items-center justify-center rounded-lg bg-[#101a33] ring-1 ring-white/10">
            <BoxingLogoLoader key={`splash-${runId}`} size={140} />
          </div>
        </div>
      </div>
    </div>
  );
}
