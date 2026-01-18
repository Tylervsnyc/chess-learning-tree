'use client';

import React, { useEffect, useState } from 'react';

interface PuzzleFeedbackProps {
  type: 'correct' | 'incorrect' | null;
  onAnimationComplete?: () => void;
}

export function PuzzleFeedback({ type, onAnimationComplete }: PuzzleFeedbackProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (type) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onAnimationComplete?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [type, onAnimationComplete]);

  if (!type || !visible) return null;

  const isCorrect = type === 'correct';

  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center z-50 pointer-events-none
        animate-[fadeIn_0.2s_ease-out]
      `}
    >
      <div
        className={`
          px-8 py-4 rounded-2xl text-xl font-bold
          ${isCorrect ? 'bg-[#58CC02] text-white' : 'bg-[#FF4B4B] text-white'}
          animate-[scaleIn_0.3s_ease-out]
        `}
      >
        {isCorrect ? (
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <span>Correct!</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
            <span>Try again</span>
          </div>
        )}
      </div>
    </div>
  );
}
