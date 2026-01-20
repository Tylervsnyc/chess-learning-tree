'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding, getNextRating, getFinalEloFromDiagnostic } from '@/hooks/useOnboarding';
import { OnboardingPuzzleBoard, OnboardingPuzzle } from '@/components/onboarding/OnboardingPuzzleBoard';

const DIAGNOSTIC_COUNT = 5;
const STARTING_RATING = 800;

const COLORS = {
  green: '#58CC02',
  blue: '#1CB0F6',
  orange: '#FF9600',
};

// Streak animation styles (same as lesson page)
const streakStyles = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
  }
  @keyframes rainbowFlow {
    0% { background-position: 0% 50%, 0% 50%; }
    100% { background-position: 0% 50%, 300% 50%; }
  }
`;

function getStreakStyle(streak: number): React.CSSProperties {
  if (streak < 2) {
    return {
      background: COLORS.green,
      backgroundSize: 'auto',
      animation: 'none',
      boxShadow: 'none',
    };
  }
  const intensity = Math.min(streak / 5, 1);
  return {
    background: `
      radial-gradient(ellipse at center,
        rgba(255, 255, 255, ${0.3 + intensity * 0.7}) 0%,
        rgba(255, 220, 240, ${0.2 + intensity * 0.4}) 20%,
        transparent 50%),
      linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
    `,
    backgroundSize: '100% 100%, 300% 100%',
    animation: `rainbowFlow ${3 - streak * 0.3}s linear infinite${streak >= 4 ? `, shake 0.4s infinite` : ''}`,
    boxShadow: `
      0 0 ${streak * 5}px rgba(255, 200, 220, ${0.4 + intensity * 0.4}),
      0 0 ${streak * 10}px rgba(255, 150, 200, 0.4)
    `,
  };
}

export default function DiagnosticPage() {
  const router = useRouter();
  const { recordResult, isLoaded, reset } = useOnboarding();

  const [currentPuzzle, setCurrentPuzzle] = useState<OnboardingPuzzle | null>(null);
  const [puzzlesCompleted, setPuzzlesCompleted] = useState(0);
  const [puzzlesCorrect, setPuzzlesCorrect] = useState(0);
  const [currentRating, setCurrentRating] = useState(STARTING_RATING);
  const [seenPuzzleIds, setSeenPuzzleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [justAnswered, setJustAnswered] = useState(false);

  const initialized = useRef(false);

  useEffect(() => {
    if (isLoaded && !initialized.current) {
      initialized.current = true;
      reset();
    }
  }, [isLoaded, reset]);

  const loadNextPuzzle = useCallback(async (targetRating: number, exclude: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const excludeParam = exclude.length > 0 ? `&exclude=${exclude.join(',')}` : '';
      const res = await fetch(`/api/onboarding-puzzles?rating=${targetRating}&count=1${excludeParam}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.puzzles && data.puzzles.length > 0) {
        setCurrentPuzzle(data.puzzles[0]);
      } else {
        setError('No puzzles available');
      }
    } catch (err) {
      setError('Failed to load puzzle');
      console.error(err);
    }

    setLoading(false);
    setJustAnswered(false);
  }, []);

  useEffect(() => {
    if (isLoaded && initialized.current && puzzlesCompleted === 0 && !currentPuzzle) {
      loadNextPuzzle(STARTING_RATING, []);
    }
  }, [isLoaded, puzzlesCompleted, currentPuzzle, loadNextPuzzle]);

  const handleResult = useCallback((correct: boolean) => {
    if (!currentPuzzle) return;

    const newCompleted = puzzlesCompleted + 1;
    const newCorrect = correct ? puzzlesCorrect + 1 : puzzlesCorrect;
    const newRating = getNextRating(currentRating, correct, newCompleted);
    const newSeen = [...seenPuzzleIds, currentPuzzle.puzzleId];

    setPuzzlesCompleted(newCompleted);
    setPuzzlesCorrect(newCorrect);
    setCurrentRating(newRating);
    setSeenPuzzleIds(newSeen);
    recordResult(currentPuzzle.puzzleId, correct);
    setJustAnswered(true);

    // Update streak
    if (correct) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    if (newCompleted >= DIAGNOSTIC_COUNT) {
      const finalElo = getFinalEloFromDiagnostic(newRating);
      const levelName = finalElo < 700 ? 'beginner' :
                        finalElo < 1000 ? 'intermediate' : 'advanced';

      const params = new URLSearchParams({
        elo: finalElo.toString(),
        level: levelName,
        finalRating: newRating.toString(),
      });

      router.push(`/onboarding/complete?${params.toString()}`);
    } else {
      setCurrentPuzzle(null);
      loadNextPuzzle(newRating, newSeen);
    }
  }, [currentPuzzle, puzzlesCompleted, puzzlesCorrect, currentRating, seenPuzzleIds, recordResult, router, loadNextPuzzle]);

  const handleBack = () => {
    router.push('/onboarding');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error && !currentPuzzle) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-white mb-2">Unable to load puzzles</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-xl font-bold shadow-[0_4px_0_#3d8c01] active:translate-y-[2px] transition-all"
            style={{ backgroundColor: COLORS.green, color: '#fff' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress - include just answered state
  const progressPercent = ((puzzlesCompleted + (justAnswered ? 0 : 0)) / DIAGNOSTIC_COUNT) * 100;

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col">
      <style jsx>{streakStyles}</style>

      {/* Header - same style as lesson page */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>

          {/* Progress bar with streak effect */}
          <div className="flex-1 mx-4">
            <div className="h-3 bg-[#131F24] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  ...getStreakStyle(streak),
                }}
              />
            </div>
          </div>

          <div className="text-gray-400 font-medium">
            {puzzlesCompleted + 1}/{DIAGNOSTIC_COUNT}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-4">
        <div className="w-full max-w-lg">
          {/* Loading state */}
          {loading && !currentPuzzle && (
            <div className="text-center text-gray-400">Loading puzzle...</div>
          )}

          {/* Puzzle board */}
          {currentPuzzle && (
            <OnboardingPuzzleBoard
              puzzle={currentPuzzle}
              puzzleIndex={puzzlesCompleted}
              onResult={handleResult}
            />
          )}
        </div>
      </div>
    </div>
  );
}
