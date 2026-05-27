'use client';

import { RunLanding } from '@/components/run/RunLanding';

/* iPhone 14 logical viewport: 390 × 844 */
const PHONE_W = 390;
const PHONE_H = 844;

export default function RunLandingPhonePage() {
  return (
    <div className="min-h-screen w-full overflow-auto bg-neutral-900 text-white flex flex-col items-center justify-center p-6 gap-4">
      <p className="text-[11px] tracking-[0.3em] uppercase text-white/60 font-bold">
        Rookie&apos;s Run — phone preview · iPhone 14 (390 × 844)
      </p>

      {/* iPhone bezel */}
      <div
        className="relative bg-black rounded-[52px] p-[14px] shadow-2xl"
        style={{ boxShadow: '0 30px 80px -10px rgba(0,0,0,0.6), inset 0 0 0 2px #2a2a2a' }}
      >
        {/* Screen */}
        <div
          className="relative rounded-[40px] overflow-hidden bg-chess-page"
          style={{ width: PHONE_W, height: PHONE_H }}
        >
          {/* Dynamic island */}
          <div
            className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-black rounded-full z-10 pointer-events-none"
            style={{ width: 110, height: 32 }}
          />

          {/* The actual landing */}
          <div className="absolute inset-0">
            <RunLanding
              onStart={() => alert('Play tapped — would start the run')}
              dateLabel="MAY 26"
            />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-white/50 italic">
        If you can see the Play button without scrolling, we&apos;re good.
      </p>
    </div>
  );
}
