'use client';

import Link from 'next/link';

export default function StagingOnboardingPage() {
  const handleBeginnerClick = () => {
    // Set user as beginner (level 1) and go directly to learn
    localStorage.setItem('staging-user-level', '1');
    localStorage.setItem('staging-user-elo', '500');
  };

  return (
    <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
      {/* Gradient top bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #58CC02, #1CB0F6, #CE82FF)' }} />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-8 min-h-0">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#58CC02] to-[#45a501] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">♟</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">
            Where should we start?
          </h1>
          <p className="text-gray-400">
            Choose your path to chess mastery
          </p>
        </div>

        {/* Options */}
        <div className="w-full max-w-[340px] space-y-3">
          {/* Start from beginning */}
          <Link
            href="/staging/learn"
            onClick={handleBeginnerClick}
            className="block w-full p-4 rounded-2xl transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
            style={{ backgroundColor: '#58CC02' }}
          >
            <div className="flex items-center gap-4">
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
            href="/staging/onboarding/diagnostic"
            className="block w-full p-4 rounded-2xl transition-all active:translate-y-[2px] shadow-[0_4px_0_#b36b00]"
            style={{ backgroundColor: '#FF9600' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                🧩
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-black text-lg">Find my level</div>
                <div className="text-black/70 text-sm">Quick puzzles to find your starting point</div>
              </div>
            </div>
          </Link>

          {/* Import ELO (disabled for staging) */}
          <button
            disabled
            className="block w-full p-4 rounded-2xl opacity-50 cursor-not-allowed"
            style={{ backgroundColor: '#1A2C35' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                🔗
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-white text-lg">Import my ELO</div>
                <div className="text-gray-500 text-sm">Coming soon</div>
              </div>
            </div>
          </button>
        </div>

        {/* Level preview */}
        <div className="mt-8 w-full max-w-[340px]">
          <h3 className="text-xs font-bold text-gray-500 mb-3">V2 CURRICULUM LEVELS</h3>
          <div className="flex gap-2">
            <div className="flex-1 bg-[#1A2C35] rounded-xl p-3 text-center">
              <div className="text-[#58CC02] font-bold">Level 1</div>
              <div className="text-xs text-gray-400">400-800</div>
            </div>
            <div className="flex-1 bg-[#1A2C35] rounded-xl p-3 text-center">
              <div className="text-[#1CB0F6] font-bold">Level 2</div>
              <div className="text-xs text-gray-400">800-1000</div>
            </div>
            <div className="flex-1 bg-[#1A2C35] rounded-xl p-3 text-center">
              <div className="text-[#CE82FF] font-bold">Level 3</div>
              <div className="text-xs text-gray-400">1000-1200</div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <Link
          href="/staging"
          className="mt-6 text-gray-500 hover:text-white text-sm transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
