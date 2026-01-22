'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { OnboardingEvents } from '@/lib/analytics/posthog';

export default function OnboardingChoicePage() {
  useEffect(() => {
    OnboardingEvents.onboardingStarted();
  }, []);

  const handlePathClick = (path: 'beginner' | 'diagnostic' | 'connect') => {
    OnboardingEvents.pathChosen(path);
  };

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col">
      {/* Gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]" />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 -mt-16">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎯</div>
          <h1 className="text-xl font-black text-white mb-1">
            How should we start?
          </h1>
          <p className="text-gray-400 text-sm">
            Pick the path that works for you
          </p>
        </div>

        {/* Options */}
        <div className="w-full max-w-[320px] space-y-4">
          {/* Start from beginning */}
          <Link
            href="/learn?guest=true&level=beginner"
            onClick={() => handlePathClick('beginner')}
            className="block w-full p-4 rounded-2xl transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
            style={{ backgroundColor: '#58CC02' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                🌱
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-white text-lg">Start from the beginning</div>
                <div className="text-white/70 text-sm">Perfect for new players</div>
              </div>
            </div>
          </Link>

          {/* Find my level */}
          <Link
            href="/onboarding/diagnostic"
            onClick={() => handlePathClick('diagnostic')}
            className="block w-full p-4 rounded-2xl transition-all active:translate-y-[2px] shadow-[0_4px_0_#b36b00]"
            style={{ backgroundColor: '#FF9600' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                🧩
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-black text-lg">Find my level</div>
                <div className="text-black/70 text-sm">A few puzzles to find your ELO</div>
              </div>
            </div>
          </Link>

          {/* Connect existing account */}
          <Link
            href="/onboarding/connect-account"
            onClick={() => handlePathClick('connect')}
            className="block w-full p-4 rounded-2xl transition-all active:translate-y-[2px] shadow-[0_4px_0_#0d7ec4]"
            style={{ backgroundColor: '#1CB0F6' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                🔗
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-white text-lg">I play on Lichess or Chess.com</div>
                <div className="text-white/70 text-sm">Import your rating automatically</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
