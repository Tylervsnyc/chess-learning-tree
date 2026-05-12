'use client';

import { useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';

interface RunIntroModalProps {
  onClose: () => void;
}

interface Slide {
  title: string;
  body: string;
  icon: React.ReactNode;
}

const SLIDES: Slide[] = [
  {
    title: 'Climb to the 8th rank',
    body: 'Get Rookie to the top of the board. Ten levels. One daily run.',
    icon: (
      <div className="flex items-center justify-center">
        <BreathingRook size="md" animate={true} mood="happy" />
      </div>
    ),
  },
  {
    title: 'Capture to charge tempo',
    body: 'Every piece Rookie takes fills the tempo meter. Bigger piece, bigger boost.',
    icon: (
      <div className="flex gap-1 px-4 w-full">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="flex-1 h-4 rounded-sm bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]"
            style={{
              animation: `rookiesRunFillBar 1.6s ease-in-out ${i * 0.08}s infinite`,
            }}
          />
        ))}
      </div>
    ),
  },
  {
    title: 'Collect up to 3 powers',
    body: 'When tempo fills, choose 1 of 3 cards. Powers stick for the whole run — pick them again to level them up. Max 3 in your rack.',
    icon: (
      <div className="flex gap-2 px-2 items-end">
        <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-zinc-200 to-zinc-400 border-2 border-zinc-500 shadow-md -rotate-6" />
        <div className="w-16 h-24 rounded-lg bg-gradient-to-br from-emerald-300 to-emerald-500 border-2 border-emerald-600 shadow-lg" />
        <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-sky-300 to-sky-500 border-2 border-sky-600 shadow-md rotate-6" />
      </div>
    ),
  },
  {
    title: 'Stack them. Get loud.',
    body: 'Bishop steps, freeze rays, detonations, time rewinds. Five tiers each — pick the same power again to upgrade it. Uses refill every level.',
    icon: (
      <div className="flex items-center justify-center text-5xl text-amber-500 font-black">
        <span style={{ textShadow: '0 0 16px rgba(251,191,36,0.65)' }}>★</span>
      </div>
    ),
  },
];

export function RunIntroModal({ onClose }: RunIntroModalProps) {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <>
      <style>{`
        @keyframes rookiesRunFillBar {
          0%, 100% { opacity: 0.4; transform: scaleY(0.7); }
          50%      { opacity: 1;   transform: scaleY(1); }
        }
        @keyframes rookiesRunIntroPop {
          0%   { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        style={{ animation: 'rookiesRunIntroPop 0.3s ease-out backwards' }}
      >
        <div className="w-full max-w-sm bg-chess-surface rounded-3xl shadow-2xl flex flex-col relative overflow-hidden">
          <button
            type="button"
            onClick={onClose}
            aria-label="Skip intro"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-chess-text/10 hover:bg-chess-text/20 active:scale-90 flex items-center justify-center text-chess-text-muted transition-all z-10"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="px-6 pt-8 pb-4 flex flex-col items-center gap-5">
            <div className="h-24 w-full flex items-center justify-center">
              {slide.icon}
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-black text-chess-text leading-tight">
                {slide.title}
              </h2>
              <p className="text-sm text-chess-text-muted mt-2 leading-snug px-2">
                {slide.body}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 pb-3">
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-chess-text' : 'w-1.5 bg-chess-text/25'
                }`}
              />
            ))}
          </div>

          <div className="px-5 pb-5">
            <button
              type="button"
              onClick={() => (isLast ? onClose() : setStep(step + 1))}
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] text-white font-black text-base shadow-lg transition-all"
            >
              {isLast ? 'Play' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
