'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOnboarding, getPlacementPuzzleRating, getPlacementElo } from '@/hooks/useOnboarding';
import { OnboardingPuzzleBoard, OnboardingPuzzle } from '@/components/onboarding/OnboardingPuzzleBoard';

const PLACEMENT_COUNT = 5;
const PASS_THRESHOLD = 3;

export default function PlacementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, isLoaded } = useOnboarding();

  const [puzzles, setPuzzles] = useState<OnboardingPuzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the level from state or URL param
  const level = state.selectedLevel || searchParams.get('level') as 'intermediate' | 'advanced' | null;

  // Redirect if no level selected
  useEffect(() => {
    if (isLoaded && !level) {
      router.push('/onboarding/select-level');
    }
  }, [isLoaded, level, router]);

  // Load puzzles
  useEffect(() => {
    if (!level) return;

    async function loadPuzzles() {
      setLoading(true);
      setError(null);

      try {
        const targetRating = getPlacementPuzzleRating(level);
        const res = await fetch(`/api/onboarding-puzzles?rating=${targetRating}&count=${PLACEMENT_COUNT}`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
        } else if (data.puzzles && data.puzzles.length > 0) {
          setPuzzles(data.puzzles);
        } else {
          setError('No puzzles available');
        }
      } catch (err) {
        setError('Failed to load puzzles');
        console.error(err);
      }

      setLoading(false);
    }

    loadPuzzles();
  }, [level]);

  // Handle puzzle result
  const handleResult = useCallback((correct: boolean) => {
    const newCorrectCount = correct ? correctCount + 1 : correctCount;
    setCorrectCount(newCorrectCount);

    // Check if done
    if (currentIndex >= puzzles.length - 1) {
      // Navigate to complete page with results
      const passed = newCorrectCount >= PASS_THRESHOLD;
      const { elo, suggestedLevel } = getPlacementElo(level, passed);

      const params = new URLSearchParams({
        elo: elo.toString(),
        level: level || 'intermediate',
        passed: passed.toString(),
        score: `${newCorrectCount}/${PLACEMENT_COUNT}`,
      });

      if (suggestedLevel) {
        params.set('suggestedLevel', suggestedLevel);
      }

      router.push(`/onboarding/complete?${params.toString()}`);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, correctCount, puzzles.length, level, router]);

  // Handle back navigation
  const handleBack = () => {
    router.push('/onboarding/select-level');
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">Loading puzzles...</div>
          <div className="text-gray-500 text-sm">Preparing your placement test</div>
        </div>
      </div>
    );
  }

  if (error || puzzles.length === 0) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">😔</div>
          <h1 className="text-xl font-bold text-white mb-2">Unable to load puzzles</h1>
          <p className="text-gray-400 mb-6">{error || 'No puzzles available for this level'}</p>
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

  const currentPuzzle = puzzles[currentIndex];

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
                className="h-full bg-[#1CB0F6] transition-all duration-300"
                style={{ width: `${((currentIndex) / puzzles.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-gray-400 text-sm">
            {currentIndex + 1}/{puzzles.length}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="max-w-lg w-full">
          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-lg font-semibold text-white">Placement Test</h1>
            <p className="text-gray-400 text-sm">
              Solve {PLACEMENT_COUNT} puzzles to confirm your level
            </p>
          </div>

          {/* Puzzle board */}
          <OnboardingPuzzleBoard
            puzzle={currentPuzzle}
            puzzleIndex={currentIndex}
            onResult={handleResult}
          />

          {/* Score indicator */}
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: PLACEMENT_COUNT }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i < currentIndex
                    ? i < correctCount || (i === currentIndex - 1 && correctCount > 0)
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : i === currentIndex
                      ? 'bg-[#1CB0F6]'
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
