'use client';

import { SelectedLevel } from '@/hooks/useOnboarding';

interface PlacementResultsProps {
  score: string;
  passed: boolean;
  determinedLevel: SelectedLevel;
  startingElo: number;
  suggestedLevel?: SelectedLevel;
  isDiagnostic?: boolean;
  finalRating?: number;
  onContinue: () => void;
  onTryLower?: () => void;
}

const LEVEL_DISPLAY = {
  beginner: {
    name: 'Beginner',
    description: 'Starting with the fundamentals',
    icon: '🌱',
    gradient: 'linear-gradient(135deg, #58CC02, #2FCBEF)',
    eloRange: '< 800 ELO',
  },
  intermediate: {
    name: 'Intermediate',
    description: 'Building your tactical foundation',
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #1CB0F6, #A560E8)',
    eloRange: '800-1200 ELO',
  },
  advanced: {
    name: 'Advanced',
    description: 'Sharpening your tactical skills',
    icon: '🏆',
    gradient: 'linear-gradient(135deg, #FF9600, #FF6B6B)',
    eloRange: '1200+ ELO',
  },
} as const;

export function PlacementResults({
  score,
  passed,
  determinedLevel,
  startingElo,
  suggestedLevel,
  isDiagnostic = false,
  finalRating,
  onContinue,
  onTryLower,
}: PlacementResultsProps) {
  const levelInfo = determinedLevel ? LEVEL_DISPLAY[determinedLevel] : LEVEL_DISPLAY.beginner;

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Result header */}
      <div className="text-center mb-6">
        {isDiagnostic ? (
          <>
            <div className="text-5xl mb-3">🧩</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Quiz Complete!
            </h1>
          </>
        ) : passed ? (
          <>
            <div className="text-5xl mb-3">🎉</div>
            <h1 className="text-2xl font-bold text-[#58CC02] mb-2">
              Level Confirmed!
            </h1>
          </>
        ) : (
          <>
            <div className="text-5xl mb-3">💪</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Let&apos;s Start Here
            </h1>
          </>
        )}

        {/* Score */}
        <p className="text-gray-400">
          You scored <span className="text-white font-semibold">{score}</span>
        </p>

        {/* Final rating from diagnostic */}
        {isDiagnostic && finalRating && (
          <p className="text-gray-400 mt-1">
            Final rating: <span className="text-[#1CB0F6] font-semibold">{finalRating}</span>
          </p>
        )}
      </div>

      {/* Level card */}
      <div
        className="rounded-xl p-6 mb-6 text-center"
        style={{ background: levelInfo.gradient }}
      >
        <div className="text-4xl mb-2">{levelInfo.icon}</div>
        <h2 className="text-xl font-bold text-white mb-1">{levelInfo.name}</h2>
        <p className="text-white/80 text-sm mb-3">{levelInfo.description}</p>
        <div className="inline-block px-4 py-2 bg-white/20 rounded-full">
          <span className="text-white font-semibold">Starting at {startingElo} ELO</span>
        </div>
      </div>

      {/* Suggestion for failed placement */}
      {!passed && suggestedLevel && !isDiagnostic && (
        <div className="bg-[#1A2C35] rounded-xl p-4 mb-6 border border-white/10">
          <p className="text-gray-300 text-sm text-center mb-3">
            Based on your results, we recommend starting at a lower level.
            You can always progress quickly if it&apos;s too easy!
          </p>
          <button
            onClick={onTryLower}
            className="w-full py-3 bg-[#58CC02] text-white font-bold rounded-xl shadow-[0_4px_0_#3d8c01] hover:shadow-[0_2px_0_#3d8c01] hover:translate-y-[2px] transition-all mb-3"
          >
            Start as {LEVEL_DISPLAY[suggestedLevel].name}
          </button>
          <button
            onClick={onContinue}
            className="w-full py-3 bg-transparent text-gray-400 font-medium text-sm hover:text-white transition-colors"
          >
            Keep my selection anyway
          </button>
        </div>
      )}

      {/* Continue button */}
      {(passed || isDiagnostic || !suggestedLevel) && (
        <button
          onClick={onContinue}
          className="w-full py-4 bg-[#58CC02] text-white font-bold rounded-xl text-lg shadow-[0_4px_0_#3d8c01] hover:shadow-[0_2px_0_#3d8c01] hover:translate-y-[2px] transition-all"
        >
          Begin Your Journey
        </button>
      )}

      {/* Note about adjusting */}
      <p className="text-center text-gray-500 text-xs mt-4">
        Your level will adapt as you learn
      </p>
    </div>
  );
}
