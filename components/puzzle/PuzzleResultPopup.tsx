'use client';

import React from 'react';

interface PuzzleResultPopupProps {
  type: 'correct' | 'incorrect';
  onContinue: () => void;
  showSolution?: boolean;
  onShowSolution?: () => void;
}

export function PuzzleResultPopup({
  type,
  onContinue,
  showSolution,
  onShowSolution,
}: PuzzleResultPopupProps) {
  const isCorrect = type === 'correct';

  return (
    <div
      className={`
        w-full z-50
        px-4 py-2.5
        rounded-b-2xl
        ${isCorrect ? 'bg-[#D7FFB8]' : 'bg-[#FFDFE0]'}
      `}
      style={{
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div className="max-w-lg mx-auto">
        {/* Icon + Text row */}
        <div className="flex items-center gap-2 mb-2">
          {isCorrect ? (
            <div className="w-7 h-7 rounded-full bg-[#58CC02] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#FF4B4B] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </div>
          )}
          <span className={`text-lg font-bold ${isCorrect ? 'text-[#58CC02]' : 'text-[#FF4B4B]'}`}>
            {isCorrect ? 'Excellent!' : "Oops, that's not correct"}
          </span>
        </div>

        {/* Button */}
        {!isCorrect && !showSolution && onShowSolution ? (
          <button
            onClick={onShowSolution}
            className="w-full py-2.5 bg-[#FF4B4B] text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_#CC3939] active:translate-y-[2px] active:shadow-[0_2px_0_#CC3939] transition-all"
          >
            Try Again
          </button>
        ) : (
          <button
            onClick={onContinue}
            className={`
              w-full py-2.5 font-bold rounded-xl uppercase tracking-wide transition-all
              active:translate-y-[2px]
              ${isCorrect
                ? 'bg-[#58CC02] text-white shadow-[0_4px_0_#46A302] active:shadow-[0_2px_0_#46A302]'
                : 'bg-[#FF4B4B] text-white shadow-[0_4px_0_#CC3939] active:shadow-[0_2px_0_#CC3939]'
              }
            `}
          >
            Continue
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
