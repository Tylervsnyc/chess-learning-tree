'use client';

import { useState } from 'react';
import AboutMinimal from './AboutMinimal';
import AboutCards from './AboutCards';
import AboutStory from './AboutStory';

type Variant = 'minimal' | 'cards' | 'story';

export default function TestAboutPage() {
  const [activeVariant, setActiveVariant] = useState<Variant>('minimal');

  return (
    <div className="min-h-screen bg-[#eef6fc]">
      {/* Variant Switcher */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-white/90 backdrop-blur-sm p-1.5 rounded-full border border-black/10 shadow-sm">
        <button
          onClick={() => setActiveVariant('minimal')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeVariant === 'minimal'
              ? 'bg-[#58CC02] text-white'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Minimal
        </button>
        <button
          onClick={() => setActiveVariant('cards')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeVariant === 'cards'
              ? 'bg-[#58CC02] text-white'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Cards
        </button>
        <button
          onClick={() => setActiveVariant('story')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeVariant === 'story'
              ? 'bg-[#58CC02] text-white'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Story
        </button>
        <a
          href="/"
          className="px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:text-gray-800 transition-all"
        >
          Home →
        </a>
      </div>

      {/* Active Variant */}
      {activeVariant === 'minimal' && <AboutMinimal />}
      {activeVariant === 'cards' && <AboutCards />}
      {activeVariant === 'story' && <AboutStory />}
    </div>
  );
}
