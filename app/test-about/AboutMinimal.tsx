'use client';

import Link from 'next/link';

export default function AboutMinimal() {
  return (
    <div className="h-screen bg-[#eef6fc] text-[#3c3c3c] flex flex-col overflow-hidden">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16">
        <div className="max-w-sm w-full text-center">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">What is The Chess Path?</h1>

          {/* Subtitle */}
          <p className="text-[#58CC02] font-medium mb-8">
            The smartest way to get better at chess
          </p>

          {/* Key points */}
          <div className="space-y-6 text-left mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#58CC02]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#58CC02]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[#3c3c3c]/80">
                  <span className="font-semibold text-[#3c3c3c]">3,000+ curated puzzles</span> hand-checked by humans and organized by a chess education expert
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1CB0F6]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#1CB0F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-[#3c3c3c]/80">
                  <span className="font-semibold text-[#3c3c3c]">5-10 minutes a day</span> is all you need. Science shows short daily practice beats marathon sessions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FF9600]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#FF9600]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[#3c3c3c]/80">
                  <span className="font-semibold text-[#3c3c3c]">Free to start.</span> Do 2 lessons a day for free. Go premium for unlimited access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA - Fixed at bottom */}
      <div className="px-6 pb-8 pt-4">
        <div className="max-w-sm mx-auto">
          <Link
            href="/learn"
            className="block w-full py-4 text-center font-bold text-lg rounded-2xl text-white transition-all hover:brightness-105 active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
            style={{ backgroundColor: '#58CC02' }}
          >
            Begin Learning
          </Link>
        </div>
      </div>
    </div>
  );
}
