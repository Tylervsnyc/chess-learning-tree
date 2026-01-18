'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface PuzzleCompleteProps {
  themeName: string;
  totalPuzzles: number;
}

export function PuzzleComplete({ themeName, totalPuzzles }: PuzzleCompleteProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      {/* Success icon */}
      <div className="w-24 h-24 rounded-full bg-[#58CC02] flex items-center justify-center mb-6 animate-[scaleIn_0.5s_ease-out]">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </div>

      {/* Congratulations text */}
      <h1 className="text-2xl font-bold text-white mb-2">
        Theme Complete!
      </h1>
      <p className="text-gray-400 mb-8">
        You solved all {totalPuzzles} puzzles in<br />
        <span className="text-white font-semibold">{themeName}</span>
      </p>

      {/* Stats */}
      <div className="flex gap-8 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-[#58CC02]">{totalPuzzles}</div>
          <div className="text-sm text-gray-400">Puzzles</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#1CB0F6]">100%</div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={() => router.push('/')}
        className="
          w-full max-w-sm py-4 px-8
          bg-[#58CC02] hover:bg-[#4CAD02]
          text-white font-bold text-lg
          rounded-2xl transition-colors
          shadow-[0_4px_0_#4CAD02] hover:shadow-[0_2px_0_#4CAD02]
          hover:translate-y-[2px]
        "
      >
        Continue
      </button>
    </div>
  );
}
