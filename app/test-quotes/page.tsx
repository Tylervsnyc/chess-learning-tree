'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PERFECT_QUOTES, GREAT_QUOTES, OKAY_QUOTES } from '@/data/celebration-quotes';

type Tier = 'perfect' | 'great' | 'okay';

const TIER_CONFIG = {
  perfect: {
    label: 'Perfect (6/6)',
    color: '#FFC800',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/30',
    quotes: PERFECT_QUOTES,
  },
  great: {
    label: 'Great (5/6)',
    color: '#58CC02',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30',
    quotes: GREAT_QUOTES,
  },
  okay: {
    label: 'Okay (0-4/6)',
    color: '#6B7280',
    bgColor: 'bg-gray-400/10',
    borderColor: 'border-gray-400/30',
    quotes: OKAY_QUOTES,
  },
};

export default function TestQuotesPage() {
  const [activeTier, setActiveTier] = useState<Tier>('perfect');
  const [searchQuery, setSearchQuery] = useState('');

  const config = TIER_CONFIG[activeTier];
  const filteredQuotes = config.quotes.filter((quote) =>
    quote.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalQuotes = PERFECT_QUOTES.length + GREAT_QUOTES.length + OKAY_QUOTES.length;

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link href="/learn" className="text-gray-400 hover:text-white text-sm">
              ← Back
            </Link>
            <div className="text-sm text-gray-400">
              {totalQuotes} total quotes
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">Celebration Quotes</h1>

          {/* Tier tabs */}
          <div className="flex gap-2 mb-4">
            {(Object.keys(TIER_CONFIG) as Tier[]).map((tier) => {
              const tierConfig = TIER_CONFIG[tier];
              const isActive = activeTier === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? `${tierConfig.bgColor} border ${tierConfig.borderColor}`
                      : 'bg-[#2A3C45] hover:bg-[#3A4C55]'
                  }`}
                  style={{ color: isActive ? tierConfig.color : undefined }}
                >
                  {tierConfig.label}
                  <span className="ml-2 text-xs opacity-60">
                    ({tierConfig.quotes.length})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search quotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#0D1A1F] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      {/* Quotes list */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid gap-3">
          {filteredQuotes.map((quote, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl ${config.bgColor} border ${config.borderColor}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-xs font-mono opacity-50 mt-1 w-6 text-right flex-shrink-0"
                  style={{ color: config.color }}
                >
                  {index + 1}
                </span>
                <p className="text-white italic">"{quote}"</p>
              </div>
            </div>
          ))}
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No quotes match your search
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h2 className="text-lg font-bold mb-4">Quote Categories</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <div className="text-2xl font-bold" style={{ color: '#FFC800' }}>
                {PERFECT_QUOTES.length}
              </div>
              <div className="text-sm text-gray-400">Perfect</div>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <div className="text-2xl font-bold" style={{ color: '#58CC02' }}>
                {GREAT_QUOTES.length}
              </div>
              <div className="text-sm text-gray-400">Great</div>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <div className="text-2xl font-bold" style={{ color: '#6B7280' }}>
                {OKAY_QUOTES.length}
              </div>
              <div className="text-sm text-gray-400">Okay</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
