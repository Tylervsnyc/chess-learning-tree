'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * WelcomeHero — the photo stage on the Chess Boxing onboarding welcome step.
 *
 * The first version of that screen was a logo and two paragraphs, and Tyler
 * called it exactly right: static and boring. The pitch of this app is that
 * real people do this together in a real gym, and we HAVE the proof — these
 * are the Chessboxing NYC meetup at Gleason's, not stock photography. A
 * slow-panning stack of them says "in community with people around the world"
 * far better than the sentence does.
 *
 * Real photos also carry the one thing an illustration can't: it's obviously
 * not a concept. Hand wraps, phones, boards on a folding table, heavy bags.
 *
 * Cost control (perf conventions in CLAUDE.md): 720×960 WebP, ~90KB each.
 * Only the first frame is `priority`; the rest decode during the first hold,
 * so nothing but frame one is on the critical path.
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

      {/* Scrim: the headline sits on top of this, so it has to hold contrast
          against every frame, not just the darkest one. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(16,26,51,0.15) 0%, rgba(16,26,51,0.35) 45%, rgba(16,26,51,0.92) 88%, #101a33 100%)',
        }}
      />

      {/* Where it was shot — the specificity IS the credibility. */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur-sm px-2.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e5484d]" />
        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/85">
          Gleason&apos;s Gym, Brooklyn
        </span>
      </div>
    </div>
  );
}
