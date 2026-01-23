'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HelpIconButton } from './ThemeHelpModal';
import { ChessProgressBar, progressBarStyles } from './ChessProgressBar';

interface PuzzleHeaderProps {
  themeName: string;
  currentPuzzle: number;
  totalPuzzles: number;
  streak?: number;
  hadWrongAnswer?: boolean;
  onHelpClick?: () => void;
}

export function PuzzleHeader({ themeName, currentPuzzle, totalPuzzles, streak = 0, hadWrongAnswer = false, onHelpClick }: PuzzleHeaderProps) {
  const router = useRouter();

  return (
    <div className="w-full">
      <style>{progressBarStyles}</style>
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

      {/* Theme name with help icon */}
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-xl font-bold text-white">{themeName}</h1>
        {onHelpClick && <HelpIconButton onClick={onHelpClick} />}
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <ChessProgressBar
          current={currentPuzzle - 1}
          total={totalPuzzles}
          streak={streak}
          hadWrongAnswer={hadWrongAnswer}
        />
      </div>
    </div>
  );
}
