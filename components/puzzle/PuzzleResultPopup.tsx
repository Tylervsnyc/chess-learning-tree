'use client';

import React from 'react';

interface PuzzleResultPopupProps {
  type: 'correct' | 'incorrect';
  onContinue: () => void;
  showSolution?: boolean;
  solutionText?: string;
  onShowSolution?: () => void;
}

export function PuzzleResultPopup({
  type,
  onContinue,
  showSolution,
  solutionText,
  onShowSolution,
}: PuzzleResultPopupProps) {
  const isCorrect = type === 'correct';

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 rounded-lg">
      <div
        className={`
          px-8 py-6 rounded-2xl text-center mx-4 max-w-sm w-full
          ${isCorrect ? 'bg-[#58CC02]' : 'bg-[#FF4B4B]'}
          animate-[scaleIn_0.2s_ease-out]
          shadow-2xl
        `}
        style={{
          animation: 'scaleIn 0.2s ease-out',
        }}
      >
        {/* Icon */}
        <div className="mb-3">
          {isCorrect ? (
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="white"
              className="mx-auto"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          ) : (
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="white"
              className="mx-auto"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          )}
        </div>

        {/* Text */}
        <h2 className="text-2xl font-black text-white mb-4">
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h2>

        {/* Solution display for incorrect */}
        {!isCorrect && showSolution && solutionText && (
          <div className="bg-white/20 rounded-xl p-3 mb-4">
            <div className="text-white/80 text-sm mb-1">The correct move was:</div>
            <div className="text-white font-bold text-lg">{solutionText}</div>
          </div>
        )}

        {/* Buttons */}
        {!isCorrect && !showSolution && onShowSolution ? (
          <button
            onClick={onShowSolution}
            className="w-full py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-all"
          >
            Show Solution
          </button>
        ) : (
          <button
            onClick={onContinue}
            className={`
              w-full py-3 font-bold rounded-xl transition-all
              ${isCorrect
                ? 'bg-white text-[#58CC02] hover:bg-white/90'
                : 'bg-white text-[#FF4B4B] hover:bg-white/90'
              }
            `}
          >
            Continue
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
