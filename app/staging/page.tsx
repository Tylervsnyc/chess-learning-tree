'use client';

import Link from 'next/link';
import { useLessonProgress } from '@/hooks/useProgress';

export default function StagingLanding() {
  const { completedLessons } = useLessonProgress();
  const hasStarted = completedLessons.length > 0;

  return (
    <div className="min-h-screen bg-[#131F24] text-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#58CC02] to-[#45a501] rounded-xl flex items-center justify-center">
            <span className="text-xl">♟</span>
          </div>
          <div>
            <h1 className="text-xl font-black">Chess Path</h1>
            <p className="text-xs text-[#58CC02]">V2 Beta</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="max-w-md text-center">
          {/* Hero */}
          <div className="mb-8">
            <div className="text-6xl mb-4">♚</div>
            <h2 className="text-3xl font-black mb-3">
              Learn Chess Tactics
            </h2>
            <p className="text-gray-400 text-lg">
              Master checkmates, forks, pins, and more with our bite-sized lessons.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1A2C35] rounded-xl p-3">
              <div className="text-2xl font-black text-[#58CC02]">3</div>
              <div className="text-xs text-gray-400">Levels</div>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-3">
              <div className="text-2xl font-black text-[#1CB0F6]">168</div>
              <div className="text-xs text-gray-400">Lessons</div>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-3">
              <div className="text-2xl font-black text-[#CE82FF]">1,008</div>
              <div className="text-xs text-gray-400">Puzzles</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              href="/staging/learn"
              className="block w-full py-4 px-6 bg-[#58CC02] hover:bg-[#4db302] text-white font-bold rounded-xl text-lg transition-colors"
            >
              {hasStarted ? 'Continue Learning' : 'Start Learning'}
            </Link>
          </div>

          {/* Level Preview */}
          <div className="mt-8 text-left">
            <h3 className="text-sm font-bold text-gray-400 mb-3">YOUR JOURNEY</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-[#1A2C35] rounded-xl p-3">
                <div className="w-10 h-10 bg-[#58CC02] rounded-lg flex items-center justify-center font-bold">1</div>
                <div>
                  <div className="font-bold">How to Lose Friends</div>
                  <div className="text-xs text-gray-400">400-800 ELO • Checkmates & Basic Tactics</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#1A2C35] rounded-xl p-3">
                <div className="w-10 h-10 bg-[#1CB0F6] rounded-lg flex items-center justify-center font-bold">2</div>
                <div>
                  <div className="font-bold">How to Impose Your Will</div>
                  <div className="text-xs text-gray-400">800-1000 ELO • Pins, Skewers & Discoveries</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#1A2C35] rounded-xl p-3">
                <div className="w-10 h-10 bg-[#CE82FF] rounded-lg flex items-center justify-center font-bold">3</div>
                <div>
                  <div className="font-bold">They&apos;ll Never See It Coming</div>
                  <div className="text-xs text-gray-400">1000-1200 ELO • Advanced Combinations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 text-center text-xs text-gray-500">
        <Link href="/staging/admin" className="hover:text-gray-300">
          Admin View
        </Link>
      </div>
    </div>
  );
}
