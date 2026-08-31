'use client';

import { useState } from 'react';
import { SplashScene, SPLASH_VARIANTS, type SplashVariant } from '@/components/chessboxing/NativeSplash';

/** Replay the Chess Path app's cold-start splash. Dev only. */
export default function NativeSplashTest() {
  const [variant, setVariant] = useState<SplashVariant>('hop');
  const [run, setRun] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [playing, setPlaying] = useState(false);

  const play = (v: SplashVariant) => {
    setVariant(v);
    setExiting(false);
    setPlaying(true);
    setRun((r) => r + 1);
    setTimeout(() => setExiting(true), 1500);
    setTimeout(() => setPlaying(false), 1900);
  };

  return (
    <div className="h-full overflow-auto bg-chess-page p-6">
      <h1 className="text-xl font-bold mb-1">Native splash</h1>
      <p className="text-sm text-gray-600 mb-4">
        What the Chess Path iOS app shows on cold start. Frame 0 of every variant is
        identical to the native launch image; the fade at the end reveals /play.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {SPLASH_VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => play(v)}
            className="px-4 py-2 rounded-xl bg-white shadow font-semibold min-h-11"
          >
            {v}
          </button>
        ))}
        <button
          onClick={() => play(SPLASH_VARIANTS[Math.floor(Math.random() * SPLASH_VARIANTS.length)])}
          className="px-4 py-2 rounded-xl bg-chess-green text-white shadow font-semibold min-h-11"
        >
          random (real)
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Also: any page with <code>?nativeSplash=hop</code> plays the real component.
      </p>
      {playing && <SplashScene key={run} variant={variant} exiting={exiting} />}
    </div>
  );
}
