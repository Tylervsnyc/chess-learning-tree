'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingPuzzleBoard, OnboardingPuzzle } from '@/components/onboarding/OnboardingPuzzleBoard';
import { OnboardingEvents } from '@/lib/analytics/posthog';
import { ThemeHelpModal, HelpIconButton } from '@/components/puzzle/ThemeHelpModal';
import { getThemeExplanation } from '@/data/theme-explanations';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';

const COLORS = {
  green: '#58CC02',
  blue: '#1CB0F6',
  orange: '#FF9600',
};

// Adaptive Testing Configuration - Binary Search Style
// Big jumps early to quickly bracket ability, smaller jumps to refine
const DEFAULT_STARTING_RATING = 600;  // Fallback if no self-assessment
const MIN_PUZZLES = 4; // Reduced from 5 since we now have self-assessment
const MAX_PUZZLES = 6; // Reduced from 8 since we start at a better point

// Self-assessment options with starting ratings (simplified to 3)
const SELF_ASSESSMENT_OPTIONS = [
  { label: "I'm a beginner", emoji: '🌱', rating: 500, description: "New to chess or just learning" },
  { label: "I'm intermediate", emoji: '♟️', rating: 900, description: "Know tactics, play online" },
  { label: "I'm advanced", emoji: '⚔️', rating: 1400, description: "Club or tournament player" },
];

// Available rating buckets (must match diagnostic-puzzles.json keys)
const RATING_BUCKETS = [500, 800, 1100, 1400, 1700, 2000];
const MIN_RATING = 400;
const MAX_RATING = 2200;

// Step sizes decrease as we hone in on their level
// Puzzle 1-2: Big jumps (±400) - quickly find the ballpark
// Puzzle 3-4: Medium jumps (±250) - narrow it down
// Puzzle 5+: Small jumps (±150) - fine tune
function getStepSize(puzzleNumber: number): number {
  if (puzzleNumber <= 2) return 400;
  if (puzzleNumber <= 4) return 250;
  return 150;
}

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

// Simple binary search style rating update
// Correct = jump UP by step size, Wrong = jump DOWN by step size
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

export default function DiagnosticPage() {
  const router = useRouter();
  const { recordResult, isLoaded, reset } = useOnboarding();

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
  const [results, setResults] = useState<boolean[]>([]); // Track correct/incorrect sequence

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
    if (isLoaded && !initialized.current) {
      initialized.current = true;
      reset();
    }
  }, [isLoaded, reset]);

  // Handle self-assessment selection
  const handleSelfAssessment = (rating: number) => {
    setStartingRating(rating);
    setEstimatedRating(rating);
    setRatingHistory([rating]);
    setSelfAssessmentComplete(true);
    OnboardingEvents.diagnosticStarted();
  };

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

  // Load first puzzle after self-assessment
  useEffect(() => {
    if (isLoaded && initialized.current && selfAssessmentComplete && puzzlesCompleted === 0 && !currentPuzzle) {
      loadPuzzleAtRating(startingRating, []);
    }
  }, [isLoaded, selfAssessmentComplete, startingRating, puzzlesCompleted, currentPuzzle, loadPuzzleAtRating]);

  const handleResult = useCallback((correct: boolean) => {
    if (!currentPuzzle) return;

    const newCompleted = puzzlesCompleted + 1;
    const newSeen = [...seenPuzzleIds, currentPuzzle.puzzleId];
    const newTotalCorrect = correct ? totalCorrect + 1 : totalCorrect;
    const newResults = [...results, correct];

    // Simple binary search: correct = go harder, wrong = go easier
    const newRating = calculateNewRating(estimatedRating, correct, newCompleted);
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

    // Track puzzle completion
    OnboardingEvents.diagnosticPuzzleCompleted(newCompleted, correct, estimatedRating);

    // Stop conditions:
    // 1. Always do at least MIN_PUZZLES (5)
    // 2. Stop at MAX_PUZZLES (8)
    // 3. After min, stop if we've found both a ceiling AND floor (got one wrong after right, or right after wrong)
    const reachedMax = newCompleted >= MAX_PUZZLES;
    const reachedMin = newCompleted >= MIN_PUZZLES;
    const hitRatingBounds = newRating >= MAX_RATING - 50 || newRating <= MIN_RATING + 50;

    // Check if we've bracketed their level (found both ceiling and floor)
    const hadCorrect = newResults.some(r => r);
    const hadWrong = newResults.some(r => !r);
    const foundBracket = hadCorrect && hadWrong;

    const shouldStop = reachedMax || (reachedMin && foundBracket) || (reachedMin && hitRatingBounds);

    if (shouldStop) {
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

      // Track diagnostic completion
      OnboardingEvents.diagnosticCompleted(finalElo);
      OnboardingEvents.onboardingCompleted(finalElo);

      router.push(`/onboarding/complete?${params.toString()}`);
    } else {
      // Load next puzzle at the new rating level
      setCurrentPuzzle(null);
      loadPuzzleAtRating(newRating, newSeen);
    }
  }, [currentPuzzle, puzzlesCompleted, seenPuzzleIds, totalCorrect, results, estimatedRating, ratingHistory, recordResult, router, loadPuzzleAtRating]);

  const handleBack = () => {
    // Track abandonment if they started the diagnostic
    if (selfAssessmentComplete && puzzlesCompleted > 0) {
      OnboardingEvents.diagnosticAbandoned(puzzlesCompleted);
    }
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

  // Self-assessment screen - matches onboarding page design
  if (!selfAssessmentComplete) {
    return (
      <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
        {/* Gradient top bar */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />

        {/* Content area - same layout rules as onboarding */}
        <div className="flex-1 flex flex-col items-center px-3 pt-6 min-h-0">
          {/* Title first, then logo */}
          <div className="mb-4 text-center">
            <h1 className="font-bold mb-3" style={{ fontSize: 'clamp(1.25rem, 4vh, 1.75rem)' }}>
              <span className="text-white">Let&apos;s get you on the</span>
            </h1>
            <Image
              src="/brand/icon-96.svg"
              alt="Chess Path"
              width={72}
              height={72}
              className="mx-auto mb-2"
              style={{ width: 'clamp(56px, 10vh, 72px)', height: 'clamp(56px, 10vh, 72px)' }}
            />
            <div className="font-bold" style={{ fontSize: 'clamp(1.75rem, 5vh, 2.5rem)' }}>
              <span className="text-white">chess</span>
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }}>path</span>
            </div>
          </div>

          {/* Skill level buttons - all same height */}
          <div className="w-full max-w-[320px] space-y-3">
            {SELF_ASSESSMENT_OPTIONS.map((option) => (
              <button
                key={option.rating}
                onClick={() => handleSelfAssessment(option.rating)}
                className="block w-full h-20 p-4 rounded-2xl transition-all active:translate-y-[2px] bg-[#1A2C35] border-2 border-gray-600 hover:border-white/30 text-left shadow-[0_4px_0_#0d1a1f]"
              >
                <div className="flex items-center gap-4 h-full">
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

            {/* Import ELO button - same height as others */}
            <button
              onClick={() => {
                // TODO: Implement ELO import modal
                alert('Coming soon! Import from Lichess or Chess.com');
              }}
              className="block w-full h-20 p-4 rounded-2xl transition-all active:translate-y-[2px] shadow-[0_4px_0_#0d7ec4]"
              style={{ backgroundColor: '#1CB0F6' }}
            >
              <div className="flex items-center gap-4 h-full">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                  🔗
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-white text-lg">Import my ELO</div>
                  <div className="text-white/70 text-sm">From Lichess or Chess.com</div>
                </div>
              </div>
            </button>

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
              showSkip={true}
            />
          )}
        </div>
      </div>

      {/* Theme help modal */}
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
