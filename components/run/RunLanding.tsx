'use client';

import { RookiesRunLogo } from './RookiesRunLogo';

interface RunLandingProps {
  onStart: () => void;
  /** Optional tagline override (e.g. STC co-brand). */
  tagline?: string;
  /** Optional display date label (e.g. "May 26"). */
  dateLabel?: string;
}

const VIDEO_SRC = '/run/landing-board.mp4';

const RULES: { n: number; title: string; sub: string }[] = [
  { n: 1, title: 'The goal.',    sub: 'Get Rookie to the other side.' },
  { n: 2, title: 'The enemies.', sub: 'Dozens of them. They want her gone.' },
  { n: 3, title: 'The morals.',  sub: 'Zero. Unlock abilities. Win ugly.' },
];

export function RunLanding({ onStart, tagline, dateLabel }: RunLandingProps) {
  return (
    <div className="h-full w-full bg-chess-page text-chess-text flex items-center justify-center px-3 py-2">
      <div className="w-full max-w-[360px] bg-white rounded-2xl p-3 shadow-sm border border-chess-text/10 flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <RookiesRunLogo scale={0.26} />
          {dateLabel && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-chess-text-muted font-bold">
              {dateLabel}
            </span>
          )}
        </div>

        {/* Headline */}
        <div>
          <p className="text-[16px] font-black text-chess-text leading-tight">
            Get Rookie to the other side.
          </p>
          <p className="text-[11px] text-chess-text-muted italic leading-snug mt-0.5">
            {tagline ?? 'By any means necessary.'}
          </p>
        </div>

        {/* Footage — capped height so the page fits a phone */}
        <div className="relative rounded-xl overflow-hidden border border-chess-text/15 bg-chess-page">
          <video
            src={VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            className="block w-full h-[260px] object-contain"
          />
        </div>

        {/* Rules */}
        <ol className="flex flex-col gap-1">
          {RULES.map((r) => (
            <li key={r.n} className="flex items-baseline gap-2">
              <span className="shrink-0 w-4 h-4 rounded-full bg-chess-text text-white font-black flex items-center justify-center text-[9px]">
                {r.n}
              </span>
              <p className="text-[12px] leading-snug">
                <span className="font-black text-chess-text">{r.title}</span>{' '}
                <span className="text-chess-text-muted">{r.sub}</span>
              </p>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onStart}
          className="w-full py-3 rounded-2xl bg-chess-text text-white font-black text-[14px] tracking-wide active:translate-y-px transition-transform"
          style={{ boxShadow: '0 4px 0 #1a2c33, 0 6px 12px rgba(0,0,0,0.12)' }}
        >
          Play Today&apos;s Run <span className="opacity-80">→</span>
        </button>
      </div>
    </div>
  );
}
