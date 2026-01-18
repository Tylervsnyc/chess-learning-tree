'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface PuzzleHeaderProps {
  themeName: string;
  currentPuzzle: number;
  totalPuzzles: number;
}

export function PuzzleHeader({ themeName, currentPuzzle, totalPuzzles }: PuzzleHeaderProps) {
  const router = useRouter();

  return (
    <div className="w-full">
      {/* Top bar with back button and progress */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          <span className="text-sm">Back</span>
        </button>

        <div className="text-sm text-gray-400">
          <span className="text-white font-semibold">{currentPuzzle}</span>
          <span> / {totalPuzzles}</span>
        </div>
      </div>

      {/* Theme name */}
      <h1 className="text-xl font-bold text-white mb-2">{themeName}</h1>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-[#58CC02] transition-all duration-500 ease-out"
          style={{ width: `${((currentPuzzle - 1) / totalPuzzles) * 100}%` }}
        />
      </div>
    </div>
  );
}
