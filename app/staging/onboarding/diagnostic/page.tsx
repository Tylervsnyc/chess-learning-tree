'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingPuzzleBoard, OnboardingPuzzle } from '@/components/onboarding/OnboardingPuzzleBoard';
import { ThemeHelpModal, HelpIconButton } from '@/components/puzzle/ThemeHelpModal';
import { getThemeExplanation } from '@/data/theme-explanations';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';

const COLORS = {
  green: '#58CC02',
  blue: '#1CB0F6',
  purple: '#CE82FF',
};

// Adaptive Testing Configuration
const DEFAULT_STARTING_RATING = 600;
const MIN_PUZZLES = 4;
const MAX_PUZZLES = 6;

// Self-assessment options for V2 (3 levels only)
const SELF_ASSESSMENT_OPTIONS = [
  { label: "I'm new to tactics", emoji: '🌱', rating: 500, description: "Learning the basics" },
  { label: "I know some tactics", emoji: '♟️', rating: 800, description: "Forks, pins, basic mates" },
  { label: "I'm experienced", emoji: '⚔️', rating: 1100, description: "Ready for advanced combos" },
];

// Rating buckets (from diagnostic-puzzles.json)
const RATING_BUCKETS = [500, 800, 1100, 1400];
const MIN_RATING = 400;
const MAX_RATING = 1200; // Cap at level 3 max for V2

function getStepSize(puzzleNumber: number): number {
  if (puzzleNumber <= 2) return 300;
  if (puzzleNumber <= 4) return 200;
  return 100;
}

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

function calculateNewRating(
  currentRating: number,
  correct: boolean,
  puzzleNumber: number
): number {
  const step = getStepSize(puzzleNumber);
  const newRating = correct
    ? currentRating + step
    : currentRating - step;
  return Math.round(Math.max(MIN_RATING, Math.min(MAX_RATING, newRating)));
}

export default function StagingDiagnosticPage() {
  const router = useRouter();

  // Self-assessment state
  const [selfAssessmentComplete, setSelfAssessmentComplete] = useState(false);
  const [startingRating, setStartingRating] = useState(DEFAULT_STARTING_RATING);

  const [currentPuzzle, setCurrentPuzzle] = useState<OnboardingPuzzle | null>(null);
  const [puzzlesCompleted, setPuzzlesCompleted] = useState(0);
  const [seenPuzzleIds, setSeenPuzzleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  // Adaptive Elo state
  const [estimatedRating, setEstimatedRating] = useState(DEFAULT_STARTING_RATING);
  const [ratingHistory, setRatingHistory] = useState<number[]>([DEFAULT_STARTING_RATING]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  // Help modal state
  const [showHelpModal, setShowHelpModal] = useState(false);

  const initialized = useRef(false);

  // Find primary theme from current puzzle for help modal
  const primaryTheme = useMemo(() => {
    if (!currentPuzzle?.themes) return null;
    for (const theme of currentPuzzle.themes) {
      if (getThemeExplanation(theme)) return theme;
    }
    return null;
  }, [currentPuzzle]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
    }
  }, []);

  // Handle self-assessment selection
  const handleSelfAssessment = (rating: number) => {
    setStartingRating(rating);
    setEstimatedRating(rating);
    setRatingHistory([rating]);
    setSelfAssessmentComplete(true);
  };

  // Load puzzle at the current estimated rating
  const loadPuzzleAtRating = useCallback(async (targetRating: number, exclude: string[]) => {
    setLoading(true);
    setError(null);

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

  // Load first puzzle after self-assessment
  useEffect(() => {
    if (initialized.current && selfAssessmentComplete && puzzlesCompleted === 0 && !currentPuzzle) {
      loadPuzzleAtRating(startingRating, []);
    }
  }, [selfAssessmentComplete, startingRating, puzzlesCompleted, currentPuzzle, loadPuzzleAtRating]);

  const handleResult = useCallback((correct: boolean) => {
    if (!currentPuzzle) return;

    const newCompleted = puzzlesCompleted + 1;
    const newSeen = [...seenPuzzleIds, currentPuzzle.puzzleId];
    const newTotalCorrect = correct ? totalCorrect + 1 : totalCorrect;
    const newResults = [...results, correct];

    const newRating = calculateNewRating(estimatedRating, correct, newCompleted);
    const newHistory = [...ratingHistory, newRating];

    setPuzzlesCompleted(newCompleted);
    setSeenPuzzleIds(newSeen);
    setEstimatedRating(newRating);
    setRatingHistory(newHistory);
    setTotalCorrect(newTotalCorrect);
    setResults(newResults);

    if (correct) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Stop conditions
    const reachedMax = newCompleted >= MAX_PUZZLES;
    const reachedMin = newCompleted >= MIN_PUZZLES;
    const hitRatingBounds = newRating >= MAX_RATING - 50 || newRating <= MIN_RATING + 50;
    const hadCorrect = newResults.some(r => r);
    const hadWrong = newResults.some(r => !r);
    const foundBracket = hadCorrect && hadWrong;

    const shouldStop = reachedMax || (reachedMin && foundBracket) || (reachedMin && hitRatingBounds);

    if (shouldStop) {
      const finalElo = newRating;

      // Map ELO to V2 level (1, 2, or 3)
      const level = finalElo < 700 ? 1 :
                    finalElo < 950 ? 2 : 3;

      const params = new URLSearchParams({
        elo: finalElo.toString(),
        level: level.toString(),
        correct: newTotalCorrect.toString(),
        total: newCompleted.toString(),
      });

      router.push(`/staging/onboarding/complete?${params.toString()}`);
    } else {
      setCurrentPuzzle(null);
      loadPuzzleAtRating(newRating, newSeen);
    }
  }, [currentPuzzle, puzzlesCompleted, seenPuzzleIds, totalCorrect, results, estimatedRating, ratingHistory, router, loadPuzzleAtRating]);

  const handleBack = () => {
    router.push('/staging/onboarding');
  };

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

  // Self-assessment screen
  if (!selfAssessmentComplete) {
    return (
      <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
        <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #58CC02, #1CB0F6, #CE82FF)' }} />

        <div className="flex-1 flex flex-col items-center px-4 pt-8 min-h-0">
          <div className="mb-6 text-center">
            <div className="text-5xl mb-4">🧩</div>
            <h1 className="text-2xl font-black text-white mb-2">
              Quick Assessment
            </h1>
            <p className="text-gray-400">
              We&apos;ll find the right starting point for you
            </p>
          </div>

          <div className="w-full max-w-[340px] space-y-3">
            {SELF_ASSESSMENT_OPTIONS.map((option) => (
              <button
                key={option.rating}
                onClick={() => handleSelfAssessment(option.rating)}
                className="block w-full p-4 rounded-2xl transition-all active:translate-y-[2px] bg-[#1A2C35] border-2 border-gray-600 hover:border-white/30 text-left shadow-[0_4px_0_#0d1a1f]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {option.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white text-lg">{option.label}</div>
                    <div className="text-gray-400 text-sm">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}

            <button
              onClick={handleBack}
              className="w-full text-gray-500 hover:text-white text-sm py-2 mt-2 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
      <style>{progressBarStyles}</style>

      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>

          <div className="flex-1 mx-4">
            <ChessProgressBar
              current={puzzlesCompleted}
              total={MAX_PUZZLES}
              streak={streak}
            />
          </div>

          <div className="flex items-center gap-2 text-gray-400 font-medium">
            <span>Puzzle {puzzlesCompleted + 1}</span>
            {primaryTheme && (
              <HelpIconButton onClick={() => setShowHelpModal(true)} />
            )}
          </div>
        </div>
      </div>

      {/* Rating indicator */}
      {puzzlesCompleted > 0 && (
        <div className="text-center py-2 bg-[#0D1A1F]">
          <span className="text-gray-500 text-sm">
            Estimated rating: <span className="text-[#1CB0F6] font-medium">{estimatedRating}</span>
          </span>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-4 overflow-hidden">
        <div className="w-full max-w-lg">
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

          {currentPuzzle && (
            <OnboardingPuzzleBoard
              puzzle={currentPuzzle}
              puzzleIndex={puzzlesCompleted}
              onResult={handleResult}
              showSkip={true}
            />
          )}
        </div>
      </div>

      {primaryTheme && (
        <ThemeHelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          themeId={primaryTheme}
        />
      )}
    </div>
  );
}
