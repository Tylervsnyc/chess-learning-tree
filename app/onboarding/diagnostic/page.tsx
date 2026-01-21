'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingPuzzleBoard, OnboardingPuzzle } from '@/components/onboarding/OnboardingPuzzleBoard';

const COLORS = {
  green: '#58CC02',
  blue: '#1CB0F6',
  orange: '#FF9600',
};

// Adaptive Elo Configuration
const STARTING_RATING = 1200;
const MIN_PUZZLES = 5;
const MAX_PUZZLES = 10;
const STABILITY_THRESHOLD = 50; // Rating stable if last 3 within ±50
const STABILITY_COUNT = 3;

// Available rating buckets (must match diagnostic-puzzles.json keys)
const RATING_BUCKETS = [500, 800, 1100, 1400, 1700];

// Map any rating to nearest available bucket
function getNearestBucket(rating: number): number {
  let nearest = RATING_BUCKETS[0];
  let minDiff = Math.abs(rating - nearest);

  for (const bucket of RATING_BUCKETS) {
    const diff = Math.abs(rating - bucket);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = bucket;
    }
  }
  return nearest;
}

// Calculate expected score using Elo formula
function getExpectedScore(playerRating: number, puzzleRating: number): number {
  return 1 / (1 + Math.pow(10, (puzzleRating - playerRating) / 400));
}

// Get K-factor (decreases as we get more data)
function getKFactor(puzzleNumber: number): number {
  // Start aggressive (80), decrease to 32 by puzzle 10
  return Math.max(32, 80 - (puzzleNumber * 5));
}

// Check if rating has stabilized
function isRatingStable(history: number[]): boolean {
  if (history.length < STABILITY_COUNT) return false;

  const recent = history.slice(-STABILITY_COUNT);
  const min = Math.min(...recent);
  const max = Math.max(...recent);

  return (max - min) <= STABILITY_THRESHOLD * 2;
}

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
  const [seenPuzzleIds, setSeenPuzzleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  // Adaptive Elo state
  const [estimatedRating, setEstimatedRating] = useState(STARTING_RATING);
  const [ratingHistory, setRatingHistory] = useState<number[]>([STARTING_RATING]);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const initialized = useRef(false);

  useEffect(() => {
    if (isLoaded && !initialized.current) {
      initialized.current = true;
      reset();
    }
  }, [isLoaded, reset]);

  // Load puzzle at the current estimated rating
  const loadPuzzleAtRating = useCallback(async (targetRating: number, exclude: string[]) => {
    setLoading(true);
    setError(null);

    // Map to nearest available bucket
    const bucket = getNearestBucket(targetRating);

    try {
      const excludeParam = exclude.length > 0 ? `&exclude=${exclude.join(',')}` : '';
      const res = await fetch(`/api/onboarding-puzzles?rating=${bucket}&count=1${excludeParam}`);
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

  // Load first puzzle on mount
  useEffect(() => {
    if (isLoaded && initialized.current && puzzlesCompleted === 0 && !currentPuzzle) {
      loadPuzzleAtRating(STARTING_RATING, []);
    }
  }, [isLoaded, puzzlesCompleted, currentPuzzle, loadPuzzleAtRating]);

  const handleResult = useCallback((correct: boolean) => {
    if (!currentPuzzle) return;

    const puzzleRating = currentPuzzle.rating;
    const newCompleted = puzzlesCompleted + 1;
    const newSeen = [...seenPuzzleIds, currentPuzzle.puzzleId];
    const newTotalCorrect = correct ? totalCorrect + 1 : totalCorrect;

    // Calculate new rating using Elo formula
    const K = getKFactor(newCompleted);
    const expected = getExpectedScore(estimatedRating, puzzleRating);
    const actual = correct ? 1 : 0;
    const newRating = Math.round(estimatedRating + K * (actual - expected));

    // Clamp rating to reasonable bounds
    const clampedRating = Math.max(400, Math.min(2200, newRating));
    const newHistory = [...ratingHistory, clampedRating];

    // Update state
    setPuzzlesCompleted(newCompleted);
    setSeenPuzzleIds(newSeen);
    setEstimatedRating(clampedRating);
    setRatingHistory(newHistory);
    setTotalCorrect(newTotalCorrect);
    recordResult(currentPuzzle.puzzleId, correct);

    // Update streak
    if (correct) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Check if we should stop
    const reachedMin = newCompleted >= MIN_PUZZLES;
    const reachedMax = newCompleted >= MAX_PUZZLES;
    const ratingStable = reachedMin && isRatingStable(newHistory);

    if (reachedMax || ratingStable) {
      // Calculate final rating (average of last few readings for stability)
      const recentRatings = newHistory.slice(-STABILITY_COUNT);
      const finalElo = Math.round(
        recentRatings.reduce((a, b) => a + b, 0) / recentRatings.length
      );

      // Map ELO to level
      const levelIndex = finalElo < 800 ? 0 :
                         finalElo < 1000 ? 1 :
                         finalElo < 1200 ? 2 :
                         finalElo < 1400 ? 3 :
                         finalElo < 1600 ? 4 : 5;

      const levelNames = ['beginner', 'casual', 'club', 'tournament', 'advanced', 'expert'];
      const levelName = levelNames[levelIndex];

      const params = new URLSearchParams({
        elo: finalElo.toString(),
        level: levelName,
        correct: newTotalCorrect.toString(),
        total: newCompleted.toString(),
      });

      router.push(`/onboarding/complete?${params.toString()}`);
    } else {
      // Load next puzzle at new estimated rating
      setCurrentPuzzle(null);
      loadPuzzleAtRating(clampedRating, newSeen);
    }
  }, [currentPuzzle, puzzlesCompleted, seenPuzzleIds, totalCorrect, estimatedRating, ratingHistory, recordResult, router, loadPuzzleAtRating]);

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

  // Calculate progress (show progress toward MIN_PUZZLES, then extend if needed)
  const displayMax = Math.max(MIN_PUZZLES, puzzlesCompleted + 1);
  const progressPercent = (puzzlesCompleted / displayMax) * 100;

  return (
    <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
      <style jsx>{streakStyles}</style>

      {/* Header - same style as lesson page */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>

          {/* Progress bar with streak effect */}
          <div className="flex-1 mx-4">
            <div className="h-3 bg-[#0D1A1F] rounded-full overflow-hidden border border-white/10">
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
            {puzzlesCompleted + 1}/{displayMax}
          </div>
        </div>
      </div>

      {/* Current rating indicator */}
      {puzzlesCompleted > 0 && (
        <div className="text-center py-2 bg-[#0D1A1F]">
          <span className="text-gray-500 text-sm">
            Estimated rating: <span className="text-[#1CB0F6] font-medium">{estimatedRating}</span>
          </span>
        </div>
      )}

      {/* Main content - fixed layout to prevent board movement */}
      <div className="flex-1 flex flex-col items-center px-4 pt-4 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Loading state */}
          {loading && !currentPuzzle && (
            <div className="space-y-4">
              <div className="text-center h-8">
                <div className="h-6 w-36 mx-auto bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="aspect-square bg-gray-800 rounded-lg animate-pulse" />
              <div className="text-center h-6">
                <span className="text-gray-500">Loading puzzle...</span>
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
        </div>
      </div>
    </div>
  );
}
