'use client';

import { useMemo } from 'react';

const ENCOURAGING_MESSAGES = [
  "Almost there! A little more practice and you've got this.",
  "Good effort! Let's give it another shot.",
  "You're building your skills! Try again to master this lesson.",
  "Chess takes practice -- you're on the right track!",
  "Keep going! Every attempt makes you stronger.",
  "You're getting closer! One more try could be the one.",
  "Great learning happens through practice. Let's go again!",
  "Not quite yet, but you're improving with every puzzle.",
];

const tryAgainStyles = `
  @keyframes tryAgainFadeInUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  .animate-tryAgainFadeInUp {
    animation: tryAgainFadeInUp 0.4s ease-out forwards;
  }
  @keyframes gentlePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

interface LessonTryAgainScreenProps {
  score: number;
  totalPuzzles: number;
  lessonName: string;
  onContinue: () => void;
}

export function LessonTryAgainScreen({
  score,
  totalPuzzles,
  lessonName,
  onContinue,
}: LessonTryAgainScreenProps) {
  // Pick a random encouraging message (stable per render)
  const message = useMemo(
    () => ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)],
    []
  );

  return (
    <div className="h-full bg-chess-page text-chess-text flex flex-col items-center overflow-auto px-5 py-6">
      <style>{tryAgainStyles}</style>
      <div className="max-w-sm w-full flex flex-col items-center">
        {/* Rook icon with gentle animation */}
        <div
          className="flex items-center justify-center animate-tryAgainFadeInUp"
          style={{ height: '160px', animationFillMode: 'backwards' }}
        >
          <div
            className="text-7xl"
            style={{ animation: 'gentlePulse 2s ease-in-out infinite' }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simple rook silhouette in warm orange */}
              <rect x="20" y="75" width="60" height="12" rx="3" fill="var(--color-chess-orange)" opacity="0.9" />
              <rect x="25" y="35" width="50" height="40" rx="2" fill="var(--color-chess-orange)" opacity="0.9" />
              <rect x="25" y="25" width="10" height="15" rx="1" fill="var(--color-chess-orange)" opacity="0.9" />
              <rect x="45" y="25" width="10" height="15" rx="1" fill="var(--color-chess-orange)" opacity="0.9" />
              <rect x="65" y="25" width="10" height="15" rx="1" fill="var(--color-chess-orange)" opacity="0.9" />
              <rect x="22" y="20" width="56" height="8" rx="2" fill="var(--color-chess-orange)" opacity="0.9" />
            </svg>
          </div>
        </div>

        {/* Score display */}
        <div
          className="text-center mb-2 animate-tryAgainFadeInUp"
          style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
        >
          <div
            className="text-4xl font-black mb-1"
            style={{ color: 'var(--color-chess-orange)' }}
          >
            {score}/{totalPuzzles}
          </div>
          <div className="text-sm text-chess-text-muted uppercase tracking-wider">
            Keep Practicing
          </div>
        </div>

        {/* Lesson name */}
        <div
          className="text-center mb-2 animate-tryAgainFadeInUp"
          style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}
        >
          <div className="text-sm text-chess-text-faint">{lessonName}</div>
        </div>

        {/* Encouraging message */}
        <div
          className="text-center mb-8 animate-tryAgainFadeInUp"
          style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
        >
          <p className="text-lg text-chess-text font-medium">
            {message}
          </p>
        </div>

        {/* Tip card */}
        <div
          className="w-full bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 animate-tryAgainFadeInUp"
          style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0" style={{ marginTop: '2px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="var(--color-chess-blue)" strokeWidth="2" />
                <path d="M12 7v6" stroke="var(--color-chess-blue)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16.5" r="1" fill="var(--color-chess-blue)" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-chess-text mb-0.5">Tip</p>
              <p className="text-sm text-chess-text-muted">
                You need 4 out of {totalPuzzles} correct on your first try to pass. Take your time with each puzzle!
              </p>
            </div>
          </div>
        </div>

        {/* Back to Path button */}
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all active:translate-y-[2px] active:scale-[0.98] animate-tryAgainFadeInUp"
          style={{
            backgroundColor: 'var(--color-chess-blue)',
            boxShadow: '0 4px 0 var(--color-chess-blue-dark)',
            animationDelay: '0.4s',
            animationFillMode: 'backwards',
          }}
        >
          Back to Path
        </button>
      </div>
    </div>
  );
}
