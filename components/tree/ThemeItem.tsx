'use client';

import React from 'react';
import { Theme, ThemeProgress } from '@/types/curriculum';
import { CheckIcon, PlayIcon, LockIcon } from '@/components/ui/icons';

interface ThemeItemProps {
  theme: Theme;
  progress?: ThemeProgress;
  isAvailable: boolean;
  onClick?: () => void;
}

export function ThemeItem({ theme, progress, isAvailable, onClick }: ThemeItemProps) {
  const isCompleted = progress?.completed ?? false;
  const puzzlesSolved = progress?.puzzlesSolved ?? 0;
  const totalPuzzles = progress?.totalPuzzles ?? 10;

  const getStatusIcon = () => {
    if (isCompleted) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#58CC02] flex items-center justify-center">
          <CheckIcon size={18} className="text-white" />
        </div>
      );
    }
    if (isAvailable) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#1CB0F6] flex items-center justify-center">
          <PlayIcon size={18} className="text-white" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
        <LockIcon size={16} className="text-gray-400" />
      </div>
    );
  };

  // Progress dots (5 dots representing progress)
  const renderProgressDots = () => {
    const dots = [];
    const filledDots = Math.floor((puzzlesSolved / totalPuzzles) * 5);

    for (let i = 0; i < 5; i++) {
      dots.push(
        <div
          key={i}
          className={`
            w-2 h-2 rounded-full transition-colors
            ${i < filledDots ? 'bg-[#58CC02]' : 'bg-gray-600'}
          `}
        />
      );
    }
    return dots;
  };

  return (
    <button
      onClick={isAvailable ? onClick : undefined}
      disabled={!isAvailable}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl
        transition-all duration-200 tap-highlight
        ${isAvailable ? 'hover:bg-white/5 active:bg-white/10 cursor-pointer' : 'cursor-not-allowed opacity-60'}
        ${isCompleted ? 'bg-[#58CC02]/10' : ''}
      `}
    >
      {getStatusIcon()}

      <div className="flex-1 text-left">
        <span
          className={`
            text-sm font-medium
            ${isCompleted ? 'text-[#58CC02]' : isAvailable ? 'text-white' : 'text-gray-400'}
          `}
        >
          {theme.name}
        </span>

        {/* Progress indicator */}
        {isAvailable && !isCompleted && (
          <div className="flex items-center gap-1 mt-1">
            {renderProgressDots()}
            <span className="ml-2 text-xs text-gray-400">
              {puzzlesSolved}/{totalPuzzles}
            </span>
          </div>
        )}
      </div>

      {/* Arrow indicator for available themes */}
      {isAvailable && !isCompleted && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-gray-400"
        >
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      )}
    </button>
  );
}
