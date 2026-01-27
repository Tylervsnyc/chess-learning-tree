'use client';

import { useState } from 'react';
import LandingDuolingo from './LandingDuolingo';
import LandingNowWhat from './LandingNowWhat';
import LandingBeatFriends from './LandingBeatFriends';

type Variant = 'duolingo' | 'nowwhat' | 'friends';

export default function TestLandingPage() {
  const [activeVariant, setActiveVariant] = useState<Variant>('duolingo');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Variant Switcher */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-black/90 backdrop-blur-sm p-1.5 rounded-full border border-white/10">
        <button
          onClick={() => setActiveVariant('duolingo')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeVariant === 'duolingo'
              ? 'bg-[#58CC02] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Duolingo
        </button>
        <button
          onClick={() => setActiveVariant('nowwhat')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeVariant === 'nowwhat'
              ? 'bg-[#58CC02] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Now What?
        </button>
        <button
          onClick={() => setActiveVariant('friends')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeVariant === 'friends'
              ? 'bg-[#58CC02] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Beat Friends
        </button>
        <a
          href="/"
          className="px-3 py-1.5 rounded-full text-xs font-medium text-gray-400 hover:text-white transition-all"
        >
          Current →
        </a>
      </div>

      {/* Active Variant */}
      {activeVariant === 'duolingo' && <LandingDuolingo />}
      {activeVariant === 'nowwhat' && <LandingNowWhat />}
      {activeVariant === 'friends' && <LandingBeatFriends />}
    </div>
  );
}
