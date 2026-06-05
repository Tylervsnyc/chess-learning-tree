'use client';

import { RookiesRunLogo } from '@/components/run/RookiesRunLogo';

const VIDEO_SRC = '/Gameplay/run-board-loop.mp4';

export default function RunLandingV4Page() {
  return (
    <div className="min-h-screen w-full overflow-auto bg-chess-page text-chess-text">
      <div className="mx-auto max-w-[420px] px-3 py-4">
        <LandingCard />
      </div>
    </div>
  );
}

function LandingCard() {
  const rules = [
    { n: 1, title: 'The goal.',    sub: 'Get Rookie to the other side.' },
    { n: 2, title: 'The enemies.', sub: 'Dozens of them. They want her gone.' },
    { n: 3, title: 'The morals.',  sub: 'Zero. Unlock abilities. Win ugly.' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-chess-text/10 flex flex-col gap-3">
      {/* Header — logo carries the title */}
      <div className="flex items-center justify-between">
        <RookiesRunLogo scale={0.32} />
        <span className="text-[10px] uppercase tracking-[0.2em] text-chess-text-muted font-bold">
          May 26
        </span>
      </div>

      {/* Headline */}
      <div>
        <p className="text-[19px] font-black text-chess-text leading-tight">
          Get Rookie to the other side.
        </p>
        <p className="text-[12px] text-chess-text-muted italic leading-snug mt-0.5">
          By any means necessary.
        </p>
      </div>

      {/* Footage — the example */}
      <div className="relative rounded-xl overflow-hidden border border-chess-text/15 bg-chess-page">
        <video
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          className="block w-full h-auto"
        />
      </div>

      {/* Rules */}
      <ol className="flex flex-col gap-1.5">
        {rules.map((r) => (
          <li key={r.n} className="flex items-baseline gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-chess-text text-white font-black flex items-center justify-center text-[10px]">
              {r.n}
            </span>
            <p className="text-[13px] leading-snug">
              <span className="font-black text-chess-text">{r.title}</span>{' '}
              <span className="text-chess-text-muted">{r.sub}</span>
            </p>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="w-full py-3.5 rounded-2xl bg-chess-text text-white font-black text-[15px] tracking-wide active:translate-y-px transition-transform"
        style={{ boxShadow: '0 4px 0 #1a2c33, 0 6px 12px rgba(0,0,0,0.12)' }}
      >
        Play Today&apos;s Run <span className="opacity-80">→</span>
      </button>
    </div>
  );
}

