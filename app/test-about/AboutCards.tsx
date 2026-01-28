'use client';

import Link from 'next/link';

export default function AboutCards() {
  return (
    <div className="h-screen bg-[#eef6fc] text-[#3c3c3c] flex flex-col overflow-hidden">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-20 overflow-hidden">
        <div className="max-w-sm w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#58CC02]/20 text-[#58CC02] px-3 py-1.5 rounded-full text-sm font-medium mb-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              Chess, simplified
            </div>
            <h1 className="text-2xl font-bold">The Chess Path</h1>
          </div>

          {/* Feature Cards */}
          <div className="space-y-3">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#58CC02] to-[#3d8c01] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-semibold">Expert Curriculum</h3>
              </div>
              <p className="text-sm text-[#3c3c3c]/70 leading-relaxed">
                3,000+ puzzles curated by a chess education expert. Every puzzle hand-checked for quality.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1CB0F6] to-[#0d8ed8] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold">5 Minutes a Day</h3>
              </div>
              <p className="text-sm text-[#3c3c3c]/70 leading-relaxed">
                Science shows short daily practice beats long sessions. Build a habit that sticks.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9600] to-[#e68500] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Free to Play</h3>
              </div>
              <p className="text-sm text-[#3c3c3c]/70 leading-relaxed">
                2 free lessons every day. Go premium for unlimited access and accelerated learning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA - Fixed at bottom */}
      <div className="px-4 pb-8 pt-4">
        <div className="max-w-sm mx-auto">
          <Link
            href="/learn"
            className="block w-full py-4 text-center font-bold text-lg rounded-2xl text-white transition-all hover:brightness-105 active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
            style={{ backgroundColor: '#58CC02' }}
          >
            Begin Learning
          </Link>
          <p className="text-center text-[#3c3c3c]/40 text-xs mt-3">
            No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
