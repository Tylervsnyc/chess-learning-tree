'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * WelcomeHero — the photo card on the Chess Boxing onboarding welcome step.
 *
 * The pitch of this app is that real people do this together in a real gym,
 * and we HAVE the proof — these are the Chessboxing NYC meetup at Gleason's,
 * not stock photography. A slow-panning stack of them says "in community with
 * people around the world" far better than the sentence does, and carries the
 * one thing an illustration can't: it's obviously not a concept.
 *
 * SIZING (Tyler, v3 review): this was full-bleed and it swamped the screen.
 * It's now a contained 4:3 card that shares the stage with the animated logo,
 * which is the brand element and stays the hero.
 *
 * SOURCE IMAGES: generated with sharp's `.rotate()` — WITHOUT it, EXIF
 * orientation is dropped and IMG_9139 (stored 1600×1200, orientation 6) came
 * out on its side. Any future frame added here must go through `.rotate()`.
 * The two group shots crop from the top: sharp's `attention` strategy picks
 * the chess boards and cuts everyone's heads off.
 *
 * Cost (perf conventions in CLAUDE.md): 640×480 WebP, ~45KB each, 174KB total.
 */

interface Frame {
  src: string;
  /** Kept meaningful — this is a real photograph of real people. */
  alt: string;
  /** Pan direction, so consecutive frames never drift the same way. */
  drift: 'in' | 'out';
}

const FRAMES: Frame[] = [
  {
    src: '/boxing/welcome/gloves-up.webp',
    alt: 'Chess boxers with gloves up behind a row of chess boards at Gleason’s Gym',
    drift: 'in',
  },
  {
    src: '/boxing/welcome/boards.webp',
    alt: 'Players in hand wraps at a line of boards with a clock, heavy bags behind them',
    drift: 'out',
  },
  {
    src: '/boxing/welcome/phones.webp',
    alt: 'Boxers in hand wraps training on their phones beside the ring',
    drift: 'in',
  },
  {
    src: '/boxing/welcome/crew.webp',
    alt: 'The Chessboxing NYC meetup lined up in front of the ring',
    drift: 'out',
  },
];

const HOLD_MS = 3200;

export function WelcomeHero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    // Respect a reduced-motion preference: hold on the first frame, no pan.
    const reduce =
      typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const t = setInterval(() => setI((n) => (n + 1) % FRAMES.length), HOLD_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#101a33]">
      <style>{`
        @keyframes cbDriftIn  { from { transform: scale(1.00) translate3d(0,0,0); }
                                to   { transform: scale(1.12) translate3d(0,-1.5%,0); } }
        @keyframes cbDriftOut { from { transform: scale(1.12) translate3d(0,-1.5%,0); }
                                to   { transform: scale(1.00) translate3d(0,0,0); } }
        .cb-frame { opacity: 0; transition: opacity 900ms ease-in-out; }
        .cb-frame[data-on="true"] { opacity: 1; }
        .cb-frame[data-on="true"] .cb-pan { animation-play-state: running; }
        .cb-pan { will-change: transform; animation-duration: 8s;
                  animation-timing-function: linear; animation-fill-mode: both;
                  animation-play-state: paused; }
        .cb-pan[data-drift="in"]  { animation-name: cbDriftIn; }
        .cb-pan[data-drift="out"] { animation-name: cbDriftOut; }
        @media (prefers-reduced-motion: reduce) {
          .cb-pan { animation: none; }
          .cb-frame { transition: none; }
        }
      `}</style>

      {FRAMES.map((f, n) => (
        <div key={f.src} className="cb-frame absolute inset-0" data-on={n === i}>
          <div className="cb-pan absolute inset-0" data-drift={f.drift}>
            {/* All four load eagerly. They are stacked and cross-fading, so a
                lazily-loaded frame is simply blank when its turn comes — the
                browser has no reason to prioritise an element sitting at
                opacity 0. ~350KB total for the set, which is the price of the
                screen actually working. */}
            <Image
              src={f.src}
              alt={n === i ? f.alt : ''}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      ))}

      {/* Light scrim only — the copy lives below the card now, so this is just
          to keep the location tag legible against a bright frame. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(16,26,51,0.35) 0%, rgba(16,26,51,0) 38%)',
        }}
      />

      {/* Where it was shot — the specificity IS the credibility. */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm px-2 py-[3px]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e5484d]" />
        <span className="text-[8.5px] font-black uppercase tracking-[0.16em] text-white/90">
          Gleason&apos;s Gym, Brooklyn
        </span>
      </div>

      {/* Frame dots — shows the stack is a set, not a single static photo. */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        {FRAMES.map((f, n) => (
          <span
            key={f.src}
            className={`block h-1 rounded-full transition-all ${
              n === i ? 'w-3 bg-white/90' : 'w-1 bg-white/45'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
