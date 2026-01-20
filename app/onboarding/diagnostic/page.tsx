'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding, getNextRating, getFinalEloFromDiagnostic } from '@/hooks/useOnboarding';
import { OnboardingPuzzleBoard, OnboardingPuzzle } from '@/components/onboarding/OnboardingPuzzleBoard';

const DIAGNOSTIC_COUNT = 10;
const STARTING_RATING = 700;

// Animated rating display component
function AdaptiveRatingDisplay({ rating, isAnimating }: { rating: number; isAnimating: boolean }) {
  const getLevelInfo = (r: number) => {
    if (r < 700) return { label: 'Beginner', color: '#58CC02' };
    if (r < 900) return { label: 'Developing', color: '#58CC02' };
    if (r < 1100) return { label: 'Intermediate', color: '#1CB0F6' };
    return { label: 'Advanced', color: '#FF9600' };
  };

  const info = getLevelInfo(rating);
  const progress = Math.min(100, Math.max(0, ((rating - 400) / 1200) * 100));

  return (
    <div className="bg-[#1A2C35] rounded-xl p-4 border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm">Estimated Rating</span>
        <span
          className={`text-lg font-bold transition-all duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}
          style={{ color: info.color }}
        >
          {rating}
        </span>
      </div>
      <div className="h-2 bg-[#131F24] rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, #58CC02, ${info.color})`,
          }}
        />
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm" style={{ color: info.color }}>
          {info.label}
        </span>
      </div>
    </div>
  );
}

export default function DiagnosticPage() {
  const router = useRouter();
  const { recordResult, state, isLoaded, reset } = useOnboarding();

  const [currentPuzzle, setCurrentPuzzle] = useState<OnboardingPuzzle | null>(null);
  const [puzzlesCompleted, setPuzzlesCompleted] = useState(0);
  const [puzzlesCorrect, setPuzzlesCorrect] = useState(0);
  const [currentRating, setCurrentRating] = useState(STARTING_RATING);
  const [seenPuzzleIds, setSeenPuzzleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRatingAnimating, setIsRatingAnimating] = useState(false);

  // Track if we've initialized
  const initialized = useRef(false);

  // Reset state on mount
  useEffect(() => {
    if (isLoaded && !initialized.current) {
      initialized.current = true;
      reset();
    }
  }, [isLoaded, reset]);

  // Load next puzzle based on current rating
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
  }, []);

  // Load first puzzle
  useEffect(() => {
    if (isLoaded && initialized.current && puzzlesCompleted === 0 && !currentPuzzle) {
      loadNextPuzzle(STARTING_RATING, []);
    }
  }, [isLoaded, puzzlesCompleted, currentPuzzle, loadNextPuzzle]);

  // Handle puzzle result
  const handleResult = useCallback((correct: boolean) => {
    if (!currentPuzzle) return;

    const newCompleted = puzzlesCompleted + 1;
    const newCorrect = correct ? puzzlesCorrect + 1 : puzzlesCorrect;
    const newRating = getNextRating(currentRating, correct, newCompleted);
    const newSeen = [...seenPuzzleIds, currentPuzzle.puzzleId];

    // Animate rating change
    setIsRatingAnimating(true);
    setTimeout(() => setIsRatingAnimating(false), 500);

    // Update state
    setPuzzlesCompleted(newCompleted);
    setPuzzlesCorrect(newCorrect);
    setCurrentRating(newRating);
    setSeenPuzzleIds(newSeen);

    // Record result in hook
    recordResult(currentPuzzle.puzzleId, correct);

    // Check if done
    if (newCompleted >= DIAGNOSTIC_COUNT) {
      // Navigate to complete page with final rating
      const finalElo = getFinalEloFromDiagnostic(newRating);
      const levelName = finalElo < 700 ? 'beginner' :
                        finalElo < 1000 ? 'intermediate' : 'advanced';

      const params = new URLSearchParams({
        elo: finalElo.toString(),
        level: levelName,
        score: `${newCorrect}/${DIAGNOSTIC_COUNT}`,
        diagnostic: 'true',
        finalRating: newRating.toString(),
      });

      router.push(`/onboarding/complete?${params.toString()}`);
    } else {
      // Load next puzzle at new rating
      setCurrentPuzzle(null);
      loadNextPuzzle(newRating, newSeen);
    }
  }, [currentPuzzle, puzzlesCompleted, puzzlesCorrect, currentRating, seenPuzzleIds, recordResult, router, loadNextPuzzle]);

  // Handle back navigation
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
          <div className="text-5xl mb-4">😔</div>
          <h1 className="text-xl font-bold text-white mb-2">Unable to load puzzles</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-[#1A2C35] text-white rounded-xl border border-white/20 hover:bg-[#2A3C45] transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Progress bar */}
          <div className="flex-1 mx-4">
            <div className="h-3 bg-[#131F24] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(puzzlesCompleted / DIAGNOSTIC_COUNT) * 100}%`,
                  background: 'linear-gradient(90deg, #58CC02, #1CB0F6)',
                }}
              />
            </div>
          </div>

          <div className="text-gray-400 text-sm">
            {puzzlesCompleted + 1}/{DIAGNOSTIC_COUNT}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 py-6">
        <div className="max-w-lg w-full">
          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-lg font-semibold text-white">Diagnostic Quiz</h1>
            <p className="text-gray-400 text-sm">
              Finding your perfect starting point
            </p>
          </div>

          {/* Rating display */}
          <div className="mb-4">
            <AdaptiveRatingDisplay
              rating={currentRating}
              isAnimating={isRatingAnimating}
            />
          </div>

          {/* Loading state */}
          {loading && !currentPuzzle && (
            <div className="bg-[#1A2C35] rounded-xl p-8 text-center">
              <div className="text-gray-400 mb-2">Loading puzzle...</div>
              <div className="text-gray-500 text-sm">
                Targeting ~{currentRating} rating
              </div>
            </div>
          )}

          {/* Puzzle board */}
          {currentPuzzle && (
            <OnboardingPuzzleBoard
              puzzle={currentPuzzle}
              puzzleIndex={puzzlesCompleted}
              onResult={handleResult}
            />
          )}

          {/* Progress indicators */}
          <div className="mt-4 flex justify-center gap-1">
            {Array.from({ length: DIAGNOSTIC_COUNT }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < puzzlesCompleted
                    ? 'bg-[#1CB0F6]'
                    : i === puzzlesCompleted
                      ? 'bg-white'
                      : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
