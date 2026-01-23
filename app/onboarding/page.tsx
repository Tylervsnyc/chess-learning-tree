'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OnboardingEvents } from '@/lib/analytics/posthog';

export default function OnboardingChoicePage() {
  useEffect(() => {
    OnboardingEvents.onboardingStarted();
  }, []);

  const handlePathClick = (path: 'beginner' | 'diagnostic' | 'connect') => {
    OnboardingEvents.pathChosen(path);
  };

  return (
    <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
      {/* Gradient accent */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />

      {/* Main content - same layout as landing page */}
      <div className="flex-1 flex flex-col items-center px-3 pt-6 min-h-0">
        {/* Title first, then logo */}
        <div className="mb-4 text-center">
          <h1 className="font-bold mb-3" style={{ fontSize: 'clamp(1.25rem, 4vh, 1.75rem)' }}>
            <span className="text-white">Let&apos;s get you on the</span>
          </h1>
          <Image
            src="/brand/icon-96.svg"
            alt="Chess Path"
            width={72}
            height={72}
            className="mx-auto mb-2"
            style={{ width: 'clamp(56px, 10vh, 72px)', height: 'clamp(56px, 10vh, 72px)' }}
          />
          <div className="font-bold" style={{ fontSize: 'clamp(1.75rem, 5vh, 2.5rem)' }}>
            <span className="text-white">chess</span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }}>path</span>
          </div>
        </div>

        {/* Options - all same height */}
        <div className="w-full max-w-[320px] space-y-3">
          {/* Start from beginning */}
          <Link
            href="/learn?guest=true&level=beginner"
            onClick={() => handlePathClick('beginner')}
            className="block w-full h-20 p-4 rounded-2xl transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
            style={{ backgroundColor: '#58CC02' }}
          >
            <div className="flex items-center gap-4 h-full">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                🌱
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-white text-lg">I&apos;m a beginner</div>
                <div className="text-white/70 text-sm">Start from the basics</div>
              </div>
            </div>
          </Link>

          {/* Find my level */}
          <Link
            href="/onboarding/diagnostic"
            onClick={() => handlePathClick('diagnostic')}
            className="block w-full h-20 p-4 rounded-2xl transition-all active:translate-y-[2px] shadow-[0_4px_0_#b36b00]"
            style={{ backgroundColor: '#FF9600' }}
          >
            <div className="flex items-center gap-4 h-full">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                🧩
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-black text-lg">Find my level</div>
                <div className="text-black/70 text-sm">Quick puzzles to set your ELO</div>
              </div>
            </div>
          </Link>

          {/* Connect existing account */}
          <Link
            href="/onboarding/connect-account"
            onClick={() => handlePathClick('connect')}
            className="block w-full h-20 p-4 rounded-2xl transition-all active:translate-y-[2px] shadow-[0_4px_0_#0d7ec4]"
            style={{ backgroundColor: '#1CB0F6' }}
          >
            <div className="flex items-center gap-4 h-full">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                🔗
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-white text-lg">Import my ELO</div>
                <div className="text-white/70 text-sm">From Lichess or Chess.com</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
