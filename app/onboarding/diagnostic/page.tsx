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
const MIN_PUZZLES = 3; // Minimum before we can stop (need at least a few data points)
const MAX_PUZZLES = 12;

// Available rating buckets (must match diagnostic-puzzles.json keys)
const RATING_BUCKETS = [500, 800, 1100, 1400, 1700];
const MIN_RATING = 400;
const MAX_RATING = 2000;

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

// Calculate new rating after a puzzle result
function calculateNewRating(
  currentRating: number,
  puzzleRating: number,
  correct: boolean,
  puzzleNumber: number
): number {
  // K-factor: aggressive early (100), decreases over time
  const K = Math.max(40, 100 - (puzzleNumber * 6));

  // Expected score using Elo formula
  const expected = 1 / (1 + Math.pow(10, (puzzleRating - currentRating) / 400));
  const actual = correct ? 1 : 0;

  const newRating = currentRating + K * (actual - expected);
  return Math.round(Math.max(MIN_RATING, Math.min(MAX_RATING, newRating)));
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
  const [results, setResults] = useState<boolean[]>([]); // Track correct/incorrect sequence

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
    const newResults = [...results, correct];

    // Calculate new rating
    const newRating = calculateNewRating(estimatedRating, puzzleRating, correct, newCompleted);
    const newHistory = [...ratingHistory, newRating];

    // Update state
    setPuzzlesCompleted(newCompleted);
    setSeenPuzzleIds(newSeen);
    setEstimatedRating(newRating);
    setRatingHistory(newHistory);
    setTotalCorrect(newTotalCorrect);
    setResults(newResults);
    recordResult(currentPuzzle.puzzleId, correct);

    // Update streak for UI
    if (correct) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Determine if we should stop
    const reachedMax = newCompleted >= MAX_PUZZLES;
    const reachedMin = newCompleted >= MIN_PUZZLES;

    // Check if we've found their level:
    // - They missed one after getting some right (found ceiling)
    // - They got one right after missing some (found floor)
    // - They've hit our rating bounds (can't test higher/lower)
    const hadCorrect = newResults.slice(0, -1).some(r => r);
    const hadWrong = newResults.slice(0, -1).some(r => !r);
    const foundCeiling = !correct && hadCorrect; // Missed after getting some right
    const foundFloor = correct && hadWrong; // Got one right after missing some
    const hitRatingCeiling = newRating >= MAX_RATING - 50;
    const hitRatingFloor = newRating <= MIN_RATING + 50;

    const shouldStop = reachedMax ||
      (reachedMin && foundCeiling) ||
      (reachedMin && foundFloor) ||
      (reachedMin && hitRatingCeiling) ||
      (reachedMin && hitRatingFloor);

    if (shouldStop) {
      // Use current rating as final (it already reflects their performance)
      const finalElo = newRating;

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
      loadPuzzleAtRating(newRating, newSeen);
    }
  }, [currentPuzzle, puzzlesCompleted, seenPuzzleIds, totalCorrect, results, estimatedRating, ratingHistory, recordResult, router, loadPuzzleAtRating]);

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
