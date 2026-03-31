'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { Chess, Square } from 'chess.js';
import { useUser } from '@/hooks/useUser';
import { useLessonProgress } from '@/hooks/useProgress';
import { createClient } from '@/lib/supabase/client';
import {
  playCorrectSound,
  playErrorSound,
  playMoveSound,
  playCaptureSound,
  warmupAudio,
} from '@/lib/sounds';
import { normalizeMove, processPuzzleWithSAN, BOARD_COLORS, isAlternateCheckmate } from '@/lib/puzzle-utils';
import { useAudioWarmup } from '@/hooks/useAudioWarmup';
import { ShareEvents, EngagementEvents } from '@/lib/analytics/posthog';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { DailyRookDisplay, BlockResult } from '@/components/daily-challenge/DailyRookDisplay';
import { CreateProfileModal } from '@/components/subscription/CreateProfileModal';
import { AdSlot } from '@/components/ads/AdSlot';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { useGameSession } from '@/hooks/useGameSession';

interface Puzzle {
  puzzleId: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
  gameUrl: string;
}

// Processed puzzle format (like LessonPuzzle)
interface ProcessedPuzzle {
  puzzleId: string;
  originalFen: string;
  puzzleFen: string; // Position after opponent's first move
  rating: number;
  themes: string[];
  solutionMoves: string[]; // Player's moves in SAN format
  uciSolutionMoves: string[]; // Player's moves in UCI format (for sharing)
  playerColor: 'white' | 'black';
  lastMoveFrom: string;
  lastMoveTo: string;
}

const TOTAL_TIME = 5 * 60 * 1000; // 5 minutes in ms
const MAX_LIVES = 3;

// Transform raw puzzle to processed format using shared processPuzzleWithSAN
function processPuzzle(puzzle: Puzzle): ProcessedPuzzle {
  const processed = processPuzzleWithSAN({
    id: puzzle.puzzleId,
    fen: puzzle.fen,
    moves: puzzle.moves,
    rating: puzzle.rating,
    themes: puzzle.themes,
  });

  return {
    puzzleId: puzzle.puzzleId,
    originalFen: processed.originalFen,
    puzzleFen: processed.puzzleFen,
    rating: processed.rating,
    themes: processed.themes || [],
    solutionMoves: processed.solutionMovesSAN,
    uciSolutionMoves: processed.solutionMoves,
    playerColor: processed.playerColor,
    lastMoveFrom: processed.lastMoveFrom,
    lastMoveTo: processed.lastMoveTo,
  };
}

export default function DailyChallengePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();
  const { recordDailyActivity, currentStreak } = useLessonProgress();
  const { startSession, recordPuzzleResult, endSession: endGameSession } = useGameSession('daily-rook', user?.id);

  // Dev mode: use ?testSeed=X to get different puzzles
  const testSeed = searchParams.get('testSeed');

  // Game state - simple: just an array of puzzles and current index
  const [gameState, setGameState] = useState<'ready' | 'loading' | 'playing' | 'finished'>('ready');
  const [allPuzzles, setAllPuzzles] = useState<ProcessedPuzzle[]>([]);
  const [puzzleIndex, setPuzzleIndex] = useState(0);

  // Board state (like lesson page pattern)
  const [currentFen, setCurrentFen] = useState<string | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveStatus, setMoveStatus] = useState<'playing' | 'correct' | 'incorrect'>('playing');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Track previously highlighted selection squares so we can explicitly clear them
  // (react-chessboard v5 caches square styles — omitting a style doesn't remove it)
  const prevSelectionSquaresRef = useRef<Square[]>([]);

  // Setup move animation - show opponent's last move animating
  const [isAnimatingSetup, setIsAnimatingSetup] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0); // Start at 0 to prevent piece flying

  // Challenge stats
  const [lives, setLives] = useState(MAX_LIVES);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [puzzlesWrong, setPuzzlesWrong] = useState(0);

  // Track results for each puzzle
  const [puzzleResults, setPuzzleResults] = useState<Record<string, 'correct' | 'wrong'>>({});

  // Coaching tracking
  const puzzleStartTimeRef = useRef<number>(Date.now());
  const firstWrongMoveRef = useRef<string | null>(null);
  const honchoSessionIdRef = useRef<string | null>(null);

  // Review mode state
  const [reviewingPuzzle, setReviewingPuzzle] = useState<ProcessedPuzzle | null>(null);
  const [reviewMoveIndex, setReviewMoveIndex] = useState(0);
  const [reviewFen, setReviewFen] = useState<string | null>(null);

  // Track if user already completed today (prevents replay)
  const [alreadyCompletedToday, setAlreadyCompletedToday] = useState(false);
  const [checkingCompletion, setCheckingCompletion] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);
  // Share state
  const [cardSharing, setCardSharing] = useState(false);
  const shareImageRef = useRef<Blob | null>(null);
  const shareImageFetchingRef = useRef(false);
  const [shareImageReady, setShareImageReady] = useState(false);
  const shareParamsRef = useRef<string>('');

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasRecordedRef = useRef(false);

  // Capture the final elapsed time at the moment the game ends (avoids stale timeLeft in effects)
  const finalElapsedMsRef = useRef<number>(0);

  // Current puzzle - simple array index
  const currentPuzzle = allPuzzles[puzzleIndex] || null;

  // Derive game from currentFen (like lesson page - prevents jerky updates)
  const game = useMemo(() => {
    const fen = currentFen || currentPuzzle?.puzzleFen;
    if (!fen) return null;
    try {
      return new Chess(fen);
    } catch {
      return null;
    }
  }, [currentFen, currentPuzzle]);

  // Board orientation based on player color
  const boardOrientation = currentPuzzle?.playerColor || 'white';

  // Review game (for finished screen)
  const reviewGame = useMemo(() => {
    if (!reviewFen) return null;
    try {
      return new Chess(reviewFen);
    } catch {
      return null;
    }
  }, [reviewFen]);

  // Start reviewing a puzzle
  const startReview = useCallback((puzzle: ProcessedPuzzle) => {
    setReviewingPuzzle(puzzle);
    setReviewFen(puzzle.puzzleFen);
    setReviewMoveIndex(0);
  }, []);

  // Play next move in review
  const playNextReviewMove = useCallback(() => {
    if (!reviewingPuzzle || !reviewGame) return;
    if (reviewMoveIndex >= reviewingPuzzle.solutionMoves.length) return;

    const move = reviewingPuzzle.solutionMoves[reviewMoveIndex];
    try {
      const newGame = new Chess(reviewGame.fen());
      newGame.move(move);
      setReviewFen(newGame.fen());
      setReviewMoveIndex(prev => prev + 1);
      playMoveSound();
    } catch {
      // Move failed
    }
  }, [reviewingPuzzle, reviewGame, reviewMoveIndex]);

  // Reset review to start
  const resetReview = useCallback(() => {
    if (!reviewingPuzzle) return;
    setReviewFen(reviewingPuzzle.puzzleFen);
    setReviewMoveIndex(0);
  }, [reviewingPuzzle]);

  // Close review
  const closeReview = useCallback(() => {
    setReviewingPuzzle(null);
    setReviewFen(null);
    setReviewMoveIndex(0);
  }, []);

  // Get list of attempted puzzles with results
  const attemptedPuzzles = useMemo(() => {
    return allPuzzles
      .filter(p => puzzleResults[p.puzzleId])
      .map(p => ({
        ...p,
        result: puzzleResults[p.puzzleId],
      }));
  }, [allPuzzles, puzzleResults]);

  // Check if user already completed today's challenge
  useEffect(() => {
    const checkTodayCompletion = async () => {
      // Wait for user loading to complete before checking
      if (userLoading) {
        return;
      }

      // If no user (guest), just show ready screen
      if (!user) {
        setCheckingCompletion(false);
        return;
      }

      try {
        const res = await fetch('/api/daily-challenge/leaderboard?limit=10');
        const data = await res.json();

        // Check if user has a result - either in userEntry OR in leaderboard with isCurrentUser
        const userInLeaderboard = (data.leaderboard || []).find((e: { isCurrentUser: boolean; puzzlesCompleted: number; timeMs: number }) => e.isCurrentUser);
        const existingResult = data.userEntry || userInLeaderboard;

        if (existingResult) {
          // User already completed today - show finished screen
          setAlreadyCompletedToday(true);
          setPuzzlesSolved(existingResult.puzzlesCompleted);
          setTimeLeft(TOTAL_TIME - existingResult.timeMs);
          finalElapsedMsRef.current = existingResult.timeMs;
          hasRecordedRef.current = true; // Don't re-record on revisit

          // Also fetch today's puzzles for review
          try {
            const puzzleRes = await fetch('/api/daily-challenge/puzzles');
            const puzzleData = await puzzleRes.json();
            if (puzzleData.puzzles) {
              const processed = puzzleData.puzzles.map((p: Puzzle) => processPuzzle(p));
              setAllPuzzles(processed);
              // Mark puzzles as attempted (we don't know which were correct/wrong, so mark all as reviewed)
              const results: Record<string, 'correct' | 'wrong'> = {};
              processed.slice(0, existingResult.puzzlesCompleted).forEach((p: ProcessedPuzzle) => {
                results[p.puzzleId] = 'correct';
              });
              setPuzzleResults(results);
            }
          } catch (puzzleError) {
            console.error('Failed to fetch puzzles for review:', puzzleError);
          }

          setGameState('finished');
        }
      } catch (error) {
        console.error('Failed to check completion:', error);
      }

      setCheckingCompletion(false);
    };

    checkTodayCompletion();
  }, [user, userLoading]);

  // Warmup audio on first interaction
  useAudioWarmup();

  // Timer effect - use end time ref for accuracy
  const endTimeRef = useRef<number>(0);

  useEffect(() => {
    if (gameState === 'playing') {
      // Set end time when game starts
      if (endTimeRef.current === 0) {
        endTimeRef.current = Date.now() + TOTAL_TIME;
      }

      timerRef.current = setInterval(() => {
        const remaining = endTimeRef.current - Date.now();
        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          finalElapsedMsRef.current = TOTAL_TIME; // Full time used
          setTimeLeft(0);
          endGameSession().catch(() => {});
          setGameState('finished');
        } else {
          setTimeLeft(remaining);
        }
      }, 100);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else if (gameState === 'ready' || gameState === 'loading') {
      // Reset end time when not playing
      endTimeRef.current = 0;
    }
  }, [gameState]);

  // Initialize puzzle when currentElo or tierPuzzleIndex changes
  useEffect(() => {
    if (currentPuzzle && gameState === 'playing') {
      // Step 1: Instantly snap to starting position (no flying pieces)
      setAnimationDuration(0);
      setCurrentFen(currentPuzzle.originalFen); // Start with position BEFORE opponent's move
      setIsAnimatingSetup(true);
      setMoveIndex(0);
      setMoveStatus('playing');
      setSelectedSquare(null);

      // Step 2: Enable animation, then animate the setup move
      const timer = setTimeout(() => {
        setAnimationDuration(300); // Enable animation
        setCurrentFen(currentPuzzle.puzzleFen); // Animate setup move
        setTimeout(() => {
          setIsAnimatingSetup(false); // Allow interaction after animation
        }, 300);
      }, 100); // Brief delay to ensure instant position is rendered first

      return () => clearTimeout(timer);
    }
  }, [currentPuzzle, gameState]);

  // Fetch today's puzzles
  const fetchDailyPuzzles = useCallback(async () => {
    try {
      const url = testSeed
        ? `/api/daily-challenge/puzzles?testSeed=${testSeed}`
        : '/api/daily-challenge/puzzles';
      const res = await fetch(url);
      const data = await res.json();
      if (data.puzzles) {
        const processed = data.puzzles.map((p: Puzzle) => processPuzzle(p));
        setAllPuzzles(processed);
        return processed;
      }
    } catch (error) {
      console.error('Failed to fetch daily puzzles:', error);
    }
    return [];
  }, [testSeed]);

  // Track page view
  useEffect(() => {
    EngagementEvents.dailyChallengeViewed();
  }, []);

  // Start the challenge
  const startChallenge = async () => {
    // Warmup audio NOW - user just clicked, and we have time while puzzles load
    warmupAudio();

    // Reset state
    setLives(MAX_LIVES);
    setStreak(0);
    setTimeLeft(TOTAL_TIME);
    setPuzzlesSolved(0);
    setPuzzlesWrong(0);
    setPuzzleResults({});
    setPuzzleIndex(0);
    setCurrentFen(null);
    setMoveIndex(0);
    setMoveStatus('playing');
    setSelectedSquare(null);
    setReviewingPuzzle(null);
    hasRecordedRef.current = false;
    finalElapsedMsRef.current = 0;
    shareImageRef.current = null;
    shareImageFetchingRef.current = false;
    setShareImageReady(false);
    shareParamsRef.current = '';

    // Show loading state
    setGameState('loading');

    // Fetch puzzles FIRST
    const puzzles = await fetchDailyPuzzles();

    // Only start the game (and timer) after puzzles are loaded
    if (puzzles.length > 0) {
      EngagementEvents.dailyChallengeStarted();
      startSession();
      // Animate the first puzzle's setup move
      // Step 1: Instantly snap to starting position
      setAnimationDuration(0);
      setCurrentFen(puzzles[0].originalFen); // Start with position BEFORE opponent's move
      setIsAnimatingSetup(true);
      setGameState('playing');
      // Log Honcho session start
      if (user?.id) {
        const today = new Date().toISOString().slice(0, 10);
        const sessionId = `daily-${today}`;
        honchoSessionIdRef.current = sessionId;
        fetch('/api/honcho', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'start_session', gameId: sessionId, userId: user.id }),
        }).catch(() => {});
        fetch('/api/honcho', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'log_message',
            gameId: sessionId,
            userId: user.id,
            message: `Daily challenge started. ${puzzles.length} puzzles, 5-minute timer.`,
          }),
        }).catch(() => {});
      }
      // Step 2: Enable animation, then animate the setup move
      setTimeout(() => {
        setAnimationDuration(300);
        setCurrentFen(puzzles[0].puzzleFen);
        setTimeout(() => {
          setIsAnimatingSetup(false);
        }, 300);
      }, 100);
    }
  };

  // Handle correct answer - advance to next puzzle
  const handleCorrect = useCallback(() => {
    setStreak(prev => prev + 1);
    setPuzzlesSolved(prev => prev + 1);
    setMoveStatus('correct');
    playCorrectSound(puzzlesSolved);

    // Record result
    if (currentPuzzle) {
      setPuzzleResults(prev => ({ ...prev, [currentPuzzle.puzzleId]: 'correct' }));
      recordPuzzleResult({
        puzzleId: currentPuzzle.puzzleId,
        puzzleTheme: currentPuzzle.themes?.[0] || 'general',
        puzzleRating: currentPuzzle.rating || 0,
        correct: true,
        firstAttemptSan: firstWrongMoveRef.current,
        retryCount: 0,
        timeMs: Date.now() - puzzleStartTimeRef.current,
      });
      // Log to Honcho
      if (user?.id && honchoSessionIdRef.current) {
        const timeMs = Date.now() - puzzleStartTimeRef.current;
        const themes = currentPuzzle.themes.join(', ') || 'general';
        fetch('/api/honcho', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'log_message',
            gameId: honchoSessionIdRef.current,
            userId: user.id,
            message: `Solved puzzle #${puzzleIndex + 1} (${themes}) rated ${currentPuzzle.rating} on first attempt in ${Math.round(timeMs / 1000)}s.`,
          }),
        }).catch(() => {});
      }
    }

    // Advance to next puzzle after brief delay
    setTimeout(() => {
      const nextIndex = puzzleIndex + 1;
      firstWrongMoveRef.current = null;
      if (nextIndex >= allPuzzles.length) {
        // Completed all puzzles! Capture elapsed time NOW before state changes
        if (timerRef.current) clearInterval(timerRef.current);
        finalElapsedMsRef.current = endTimeRef.current > 0
          ? Math.max(0, TOTAL_TIME - (endTimeRef.current - Date.now()))
          : TOTAL_TIME - timeLeft;
        endGameSession().catch(() => {});
        setGameState('finished');
      } else {
        setPuzzleIndex(nextIndex);
        setMoveIndex(0);
        setMoveStatus('playing');
        setSelectedSquare(null);
        puzzleStartTimeRef.current = Date.now();
      }
    }, 600);
  }, [currentPuzzle, puzzlesSolved, puzzleIndex, allPuzzles.length]);

  // Handle incorrect answer - lose a life, advance to next puzzle
  const handleIncorrect = useCallback(() => {
    const newLives = lives - 1;
    setLives(newLives);
    setStreak(0);
    setPuzzlesWrong(prev => prev + 1);
    setMoveStatus('incorrect');
    playErrorSound();

    // Record result
    if (currentPuzzle) {
      setPuzzleResults(prev => ({ ...prev, [currentPuzzle.puzzleId]: 'wrong' }));
      recordPuzzleResult({
        puzzleId: currentPuzzle.puzzleId,
        puzzleTheme: currentPuzzle.themes?.[0] || 'general',
        puzzleRating: currentPuzzle.rating || 0,
        correct: false,
        firstAttemptSan: firstWrongMoveRef.current,
        retryCount: 0,
        timeMs: Date.now() - puzzleStartTimeRef.current,
      });
      // Log to Honcho
      if (user?.id && honchoSessionIdRef.current) {
        const themes = currentPuzzle.themes.join(', ') || 'general';
        const wrongMove = firstWrongMoveRef.current || 'unknown';
        const solution = currentPuzzle.solutionMoves[0] || 'unknown';
        fetch('/api/honcho', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'log_message',
            gameId: honchoSessionIdRef.current,
            userId: user.id,
            message: `Failed puzzle #${puzzleIndex + 1} (${themes}) rated ${currentPuzzle.rating}. Wrong move: ${wrongMove}. Correct was: ${solution}.`,
          }),
        }).catch(() => {});
      }
    }

    if (newLives <= 0) {
      // Capture elapsed time NOW before state changes
      if (timerRef.current) clearInterval(timerRef.current);
      finalElapsedMsRef.current = endTimeRef.current > 0
        ? Math.max(0, TOTAL_TIME - (endTimeRef.current - Date.now()))
        : TOTAL_TIME - timeLeft;
      endGameSession().catch(() => {});
      setGameState('finished');
    } else {
      // Advance to next puzzle
      setTimeout(() => {
        const nextIndex = puzzleIndex + 1;
        firstWrongMoveRef.current = null;
        if (nextIndex >= allPuzzles.length) {
          // Capture elapsed time NOW before state changes
          if (timerRef.current) clearInterval(timerRef.current);
          finalElapsedMsRef.current = endTimeRef.current > 0
            ? Math.max(0, TOTAL_TIME - (endTimeRef.current - Date.now()))
            : TOTAL_TIME - timeLeft;
          endGameSession().catch(() => {});
          setGameState('finished');
        } else {
          setPuzzleIndex(nextIndex);
          setMoveIndex(0);
          setMoveStatus('playing');
          setSelectedSquare(null);
          puzzleStartTimeRef.current = Date.now();
        }
      }, 800);
    }
  }, [lives, currentPuzzle, puzzleIndex, allPuzzles.length]);

  // Try to make a move (core puzzle logic from lesson page)
  const tryMove = useCallback((from: Square, to: Square): boolean => {
    if (!game || !currentPuzzle || moveStatus !== 'playing') return false;
    if (moveIndex >= currentPuzzle.solutionMoves.length) return false;

    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (!move) return false;

      const expectedMove = currentPuzzle.solutionMoves[moveIndex];


      if (normalizeMove(move.san) === normalizeMove(expectedMove)) {
        // Correct move!
        setCurrentFen(gameCopy.fen());
        setSelectedSquare(null);

        if (move.captured) {
          playCaptureSound();
        } else {
          playMoveSound();
        }

        const nextMoveIndex = moveIndex + 1;
        setMoveIndex(nextMoveIndex);

        // Check if puzzle complete
        if (nextMoveIndex >= currentPuzzle.solutionMoves.length) {
          handleCorrect();
          return true;
        }

        // Auto-play opponent's response
        setTimeout(() => {
          const opponentGame = new Chess(gameCopy.fen());
          const opponentMove = currentPuzzle.solutionMoves[nextMoveIndex];
          try {
            const oppMove = opponentGame.move(opponentMove);
            setCurrentFen(opponentGame.fen());
            setMoveIndex(nextMoveIndex + 1);

            if (oppMove?.captured) {
              playCaptureSound();
            } else {
              playMoveSound();
            }

            // Check if puzzle complete after opponent move
            if (nextMoveIndex + 1 >= currentPuzzle.solutionMoves.length) {
              handleCorrect();
            }
          } catch {
            // Puzzle complete
            handleCorrect();
          }
        }, 300);

        return true;
      } else {
        // Check for alternate checkmate in mate-themed puzzles
        if (isAlternateCheckmate(gameCopy, currentPuzzle.themes ?? [])) {
          // Accept ANY checkmate in mate puzzles
          setCurrentFen(gameCopy.fen());
          setSelectedSquare(null);
          if (move.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
          handleCorrect();
          return true;
        }

        // Wrong move — capture the first wrong attempt SAN
        if (!firstWrongMoveRef.current) firstWrongMoveRef.current = move.san;
        setSelectedSquare(null);
        handleIncorrect();
        return false;
      }
    } catch {
      return false;
    }
  }, [game, currentPuzzle, moveIndex, moveStatus, handleCorrect, handleIncorrect]);

  // Handle piece drop (drag and drop)
  const onDrop = useCallback(({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string; piece: string }) => {
    if (!targetSquare) return false;
    setSelectedSquare(null);
    return tryMove(sourceSquare as Square, targetSquare as Square);
  }, [tryMove]);

  // Handle square click (click-to-move)
  const onSquareClick = useCallback(
    ({ square }: { piece: { pieceType: string } | null; square: string }) => {
      if (!game || moveStatus !== 'playing' || gameState !== 'playing') return;
      const clickedSquare = square as Square;

      if (!selectedSquare) {
        // No square selected - select if it's player's piece
        const piece = game.get(clickedSquare);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(clickedSquare);
        }
      } else if (selectedSquare === clickedSquare) {
        // Clicked same square - deselect
        setSelectedSquare(null);
      } else {
        // Different square clicked - try to move or select new piece
        const legalMoves = game.moves({ square: selectedSquare, verbose: true });
        const isLegalMove = legalMoves.some(m => m.to === clickedSquare);

        if (isLegalMove) {
          tryMove(selectedSquare, clickedSquare);
        } else {
          // Not a legal move - check if clicking on another friendly piece
          const piece = game.get(clickedSquare);
          if (piece && piece.color === game.turn()) {
            setSelectedSquare(clickedSquare);
          } else {
            setSelectedSquare(null);
          }
        }
      }
    },
    [game, selectedSquare, moveStatus, gameState, tryMove]
  );

  // Record result to Supabase
  const recordResult = useCallback(async (finalPuzzlesSolved: number, finalTimeLeft: number) => {
    if (!user) {
      console.warn('Cannot record result: user not logged in');
      return;
    }
    if (hasRecordedRef.current) return;
    hasRecordedRef.current = true;

    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from('daily_challenge_results').upsert({
      user_id: user.id,
      challenge_date: today,
      score: finalPuzzlesSolved, // score = puzzles completed
      puzzles_completed: finalPuzzlesSolved,
      time_used_ms: TOTAL_TIME - finalTimeLeft,
    }, { onConflict: 'user_id,challenge_date' });

    if (error) {
      console.error('Failed to record result:', error.message, error.code);
    } else {
      setAlreadyCompletedToday(true); // Prevent replay in same session
    }
  }, [user]);

  // Record when finished
  useEffect(() => {
    if (gameState === 'finished') {
      // Only fire analytics on fresh completion, not revisits
      if (!hasRecordedRef.current) {
        EngagementEvents.dailyChallengeCompleted(puzzlesSolved === allPuzzles.length);
      }
      // Trigger PWA install prompt after first puzzle experience
      window.dispatchEvent(new Event('chess-path:puzzle-complete'));

      if (user) {
        // Use finalElapsedMsRef which was captured at the exact moment the game ended
        const finalTimeLeft = TOTAL_TIME - finalElapsedMsRef.current;
        recordResult(puzzlesSolved, finalTimeLeft);
        // Update global day streak (per RULES.md Section 11)
        recordDailyActivity();
        // Log Honcho summary + trigger dream
        if (honchoSessionIdRef.current) {
          const elapsed = finalElapsedMsRef.current;
          const minutes = Math.floor(elapsed / 60000);
          const seconds = Math.floor((elapsed % 60000) / 1000);
          const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          const accuracy = allPuzzles.length > 0 ? Math.round((puzzlesSolved / (puzzlesSolved + puzzlesWrong)) * 100) : 0;

          const correctThemes = allPuzzles
            .filter((_, i) => puzzleResults[allPuzzles[i]?.puzzleId] === 'correct')
            .flatMap(p => p.themes);
          const missedThemes = allPuzzles
            .filter((_, i) => puzzleResults[allPuzzles[i]?.puzzleId] === 'wrong')
            .flatMap(p => p.themes);
          const uniqueCorrect = [...new Set(correctThemes)].join(', ') || 'none';
          const uniqueMissed = [...new Set(missedThemes)].join(', ') || 'none';

          const maxSolvedRating = allPuzzles
            .filter((_, i) => puzzleResults[allPuzzles[i]?.puzzleId] === 'correct')
            .reduce((max, p) => Math.max(max, p.rating), 0);
          const firstFailRating = allPuzzles
            .find((_, i) => puzzleResults[allPuzzles[i]?.puzzleId] === 'wrong')
            ?.rating ?? 0;

          const summaryParts = [
            `Daily challenge complete: ${puzzlesSolved}/${allPuzzles.length} puzzles in ${timeStr}.`,
            `Accuracy: ${accuracy}%. Lives remaining: ${lives}/${MAX_LIVES}.`,
            `Themes correct: ${uniqueCorrect}. Themes missed: ${uniqueMissed}.`,
            maxSolvedRating > 0 ? `Highest puzzle solved: rated ${maxSolvedRating}.` : null,
            firstFailRating > 0 ? `Stopped at: rated ${firstFailRating}.` : null,
            currentStreak > 0 ? `Streak: ${currentStreak} days.` : null,
          ].filter(Boolean).join(' ');

          fetch('/api/honcho', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'log_summary_message',
              gameId: honchoSessionIdRef.current,
              userId: user.id,
              message: summaryParts,
            }),
          }).catch(() => {});
        }
      }
    }
  }, [gameState, puzzlesSolved, recordResult, recordDailyActivity, user]);

  // Pre-fetch share image when game finishes; re-fetches when rank data arrives
  // Uses paramsKey dedup to avoid redundant fetches, never clears cached image
  useEffect(() => {
    if (!FEATURE_FLAGS.SHOW_SHARING) return;
    if (gameState !== 'finished' || allPuzzles.length === 0) return;
    if (shareImageFetchingRef.current) return;

    const ogParams = new URLSearchParams({
      score: String(puzzlesSolved),
      time: String(finalElapsedMsRef.current > 0 ? finalElapsedMsRef.current : TOTAL_TIME - timeLeft),
      format: 'story',
    });
    const resultsStr = allPuzzles.map(p => puzzleResults[p.puzzleId] === 'correct' ? '1' : '0').join(',');
    ogParams.set('results', resultsStr);

    // Skip if we already fetched with these exact params
    const paramsKey = ogParams.toString();
    if (shareParamsRef.current === paramsKey && shareImageRef.current) return;

    shareImageFetchingRef.current = true;
    shareParamsRef.current = paramsKey;

    fetch(`/api/og/daily-challenge?${paramsKey}`)
      .then(res => res.ok ? res.blob() : null)
      .then(blob => {
        if (blob) {
          shareImageRef.current = blob;
          setShareImageReady(true);
        }
      })
      .catch(() => {})
      .finally(() => { shareImageFetchingRef.current = false; });
  }, [gameState, allPuzzles, puzzlesSolved, timeLeft, puzzleResults]);

  // Format time display
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Find primary theme from current puzzle for help modal
  // Square styles (highlight opponent's last move and selected square)
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Highlight opponent's last move with orange (only before player's first move)
    if (currentPuzzle && moveIndex === 0 && !selectedSquare) {
      styles[currentPuzzle.lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
      styles[currentPuzzle.lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
    }

    // Highlight selected square and show legal moves
    if (selectedSquare && game) {
      styles[selectedSquare] = { backgroundColor: 'rgba(100, 200, 255, 0.6)' };
      const moves = game.moves({ square: selectedSquare, verbose: true });
      const currentSelectionSquares: Square[] = [selectedSquare];
      for (const move of moves) {
        styles[move.to] = {
          background: move.captured
            ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
            : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
        };
        currentSelectionSquares.push(move.to as Square);
      }
      // Track current selection squares so we can clear them when deselected
      prevSelectionSquaresRef.current = currentSelectionSquares;
    } else {
      // Explicitly clear previous selection squares so react-chessboard removes cached styles
      for (const sq of prevSelectionSquaresRef.current) {
        if (!styles[sq]) {
          styles[sq] = {};
        }
      }
      prevSelectionSquaresRef.current = [];
    }

    return styles;
  }, [currentPuzzle, moveIndex, selectedSquare, game]);

  // Build results array for DailyRookDisplay (22 entries in fill order)
  const buildResultsArray = useCallback((): BlockResult[] => {
    if (allPuzzles.length === 0) return Array(22).fill('pending');
    return allPuzzles.map((p, i) => {
      if (i > puzzleIndex && gameState === 'playing') return 'pending';
      if (i === puzzleIndex && gameState === 'playing') return 'pending';
      const result = puzzleResults[p.puzzleId];
      if (!result) return 'pending';
      return result;
    });
  }, [allPuzzles, puzzleIndex, puzzleResults, gameState]);

  // Completion time (time used) — use ref for accuracy, fall back to state calculation
  const completionTimeMs = finalElapsedMsRef.current > 0 ? finalElapsedMsRef.current : TOTAL_TIME - timeLeft;

  // Loading state while checking if user already completed today
  if (checkingCompletion || userLoading) {
    return (
      <div className="h-full bg-chess-page flex flex-col items-center justify-center">
        <BreathingRook size="lg" animate />
      </div>
    );
  }

  // Determine the rook display mode
  const rookMode = gameState === 'ready' || gameState === 'loading'
    ? 'demo'
    : gameState === 'playing'
      ? 'playing'
      : 'finished';

  // ─── SPLIT SCREEN LAYOUT (all 3 states) ───────────────────────────────
  return (
    <div className={`h-full bg-chess-page text-chess-text flex flex-col items-center ${gameState === 'playing' ? 'overflow-hidden justify-center' : 'overflow-auto'}`}>
      {/* Top section — changes per state */}
      <div className="w-full max-w-md">
        {/* ── READY / LOADING ── */}
        {(gameState === 'ready' || gameState === 'loading') && (
          <div className="flex flex-col items-center justify-start px-4 pt-4 pb-2">
            <div className="text-center max-w-sm w-full flex flex-col">
              {/* Title */}
              <div
                className="inline-block px-5 py-2.5 rounded-xl mb-2 border-2 border-chess-orange/50 self-center"
                style={{ background: 'linear-gradient(135deg, rgba(255,150,0,0.15), rgba(255,107,107,0.15))' }}
              >
                <h1
                  className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-chess-orange via-[#FF6B6B] to-chess-orange"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  THE DAILY ROOK
                </h1>
              </div>

              {/* Tagline */}
              <p
                className="text-sm font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-chess-orange via-[#e05a5a] to-chess-orange mb-4"
              >
                Solve Puzzles. Build the Rook. Improve at Chess.
              </p>

              {/* Rules */}
              <div
                className="rounded-2xl p-3 mb-3 text-left space-y-2 border border-chess-orange/20"
                style={{ background: 'linear-gradient(145deg, rgba(255,150,0,0.08), rgba(255,107,107,0.06), rgba(255,150,0,0.04))' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#38bdf8]/30"
                    style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(56,189,248,0.25))' }}
                  >
                    <span className="text-[#38bdf8] font-black text-xs">5</span>
                  </div>
                  <div className="text-chess-text font-bold text-sm">5 minutes on the clock</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#4ade80]/30"
                    style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.25))' }}
                  >
                    <svg className="w-3.5 h-3.5 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                  </div>
                  <div className="text-chess-text font-bold text-sm">Puzzles get harder</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#f87171]/30"
                    style={{ background: 'linear-gradient(135deg, rgba(248,113,113,0.15), rgba(248,113,113,0.25))' }}
                  >
                    <span className="text-[#f87171] font-black text-xs">3</span>
                  </div>
                  <div className="text-chess-text font-bold text-sm">3 mistakes and you&apos;re out</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#fbbf24]/30"
                    style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.25))' }}
                  >
                    <svg className="w-3.5 h-3.5 text-[#fbbf24]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 3h14a2 2 0 0 1 2 2v2a5 5 0 0 1-5 5h-1v2h2a2 2 0 0 1 2 2v4h-4v-2H9v2H5v-4a2 2 0 0 1 2-2h2v-2H8a5 5 0 0 1-5-5V5a2 2 0 0 1 2-2z"/>
                    </svg>
                  </div>
                  <div className="text-chess-text font-bold text-sm">Same puzzles for everyone</div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={startChallenge}
                  disabled={gameState === 'loading'}
                  className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-transform active:scale-[0.98] disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, var(--color-chess-orange), #FF6B6B)', boxShadow: '0 3px 0 #CC6600' }}
                >
                  {gameState === 'loading' ? 'Loading...' : 'Begin the Challenge'}
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--color-chess-green)', boxShadow: '0 3px 0 var(--color-chess-green-shadow)' }}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PLAYING ── */}
        {gameState === 'playing' && (
          <div
            className="flex flex-col max-w-md mx-auto px-3 pt-1 pb-1 w-full"
            style={{ maxWidth: 'min(28rem, calc(100dvh - 19rem))' }}
          >
            <div className="flex flex-col">
              <div className="mb-1">
                {game && (
                  <ChessPathBoard
                    options={{
                      position: game.fen(),
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onPieceDrop: isAnimatingSetup ? undefined : (args: any) =>
                        onDrop({ sourceSquare: args.sourceSquare, targetSquare: args.targetSquare, piece: args.piece }),
                      onSquareClick: isAnimatingSetup ? undefined : onSquareClick,
                      boardOrientation: boardOrientation,
                      squareStyles: squareStyles,
                      animationDurationInMs: animationDuration,
                      draggingPieceGhostStyle: { opacity: 1 },
                      boardStyle: {
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                      },
                      darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
                      lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── FINISHED ── */}
        {gameState === 'finished' && (
          <div className="px-4 py-2">
            <div className="max-w-md mx-auto w-full">
              {/* Score card — matches share card design */}
              <div className="bg-chess-surface rounded-2xl p-4 mb-3 celebratory-glow text-center">
                <h2 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-chess-orange via-[#FF6B6B] to-chess-orange mb-2">
                  {puzzlesSolved === allPuzzles.length ? 'Perfect Run!' : lives <= 0 ? 'Game Over' : 'Time\'s Up!'}
                </h2>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-5xl font-black text-chess-orange">{puzzlesSolved}</span>
                  <span className="text-lg font-bold text-chess-orange/35">/{allPuzzles.length || 22}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-base font-semibold text-chess-text/40">in {formatTime(completionTimeMs)}</span>
                </div>
              </div>

              {/* Share Results button */}
              {FEATURE_FLAGS.SHOW_SHARING && (
                <button
                  onClick={async () => {
                    if (cardSharing || !shareImageRef.current) return;
                    setCardSharing(true);
                    ShareEvents.shareClicked('daily_challenge', 'image');
                    try {
                      // Image is guaranteed ready (button disabled until pre-fetch completes)
                      // No async work before navigator.share() — preserves user activation
                      const blob = shareImageRef.current;
                      const file = new File([blob], 'daily-rook.png', { type: 'image/png' });

                      // Try native share (mobile share sheet) — skip canShare check,
                      // just attempt it and catch errors
                      let shared = false;
                      if (typeof navigator !== 'undefined' && 'share' in navigator) {
                        try {
                          await navigator.share({
                            files: [file],
                            title: 'The Daily Rook',
                            text: `I solved ${puzzlesSolved} puzzles on today's Daily Rook!\nchesspath.app/daily-challenge`,
                          });
                          shared = true;
                          ShareEvents.shareCompleted('daily_challenge', 'native_image');
                        } catch (shareErr) {
                          if (shareErr instanceof Error && shareErr.name === 'AbortError') {
                            shared = true; // User cancelled — don't fall through to download
                          }
                          // TypeError = browser doesn't support file sharing → fall through
                        }
                      }

                      if (!shared) {
                        // Fallback: download the image
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'daily-rook.png';
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }, 1000);
                        ShareEvents.shareCompleted('daily_challenge', 'download');
                      }
                    } catch (err) {
                      console.error('Share failed:', err);
                      ShareEvents.shareFailed('daily_challenge', err instanceof Error ? err.message : 'unknown');
                    } finally {
                      setCardSharing(false);
                    }
                  }}
                  disabled={cardSharing || !shareImageReady}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70 mb-2"
                  style={{ background: 'linear-gradient(135deg, var(--color-chess-orange), #FF6B6B)', boxShadow: '0 3px 0 #CC6600' }}
                >
                  {cardSharing ? (
                    <span className="animate-pulse">Sharing...</span>
                  ) : !shareImageReady ? (
                    <span className="animate-pulse">Preparing...</span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share Results
                    </>
                  )}
                </button>
              )}

              {/* Puzzle Review Section */}
              {attemptedPuzzles.length > 0 && (
                <div className="bg-chess-surface rounded-xl p-3 mb-2 shadow-sm">
                  <h2 className="text-sm font-bold text-chess-text mb-2">Review Puzzles</h2>
                  <div className="space-y-1 max-h-28 overflow-y-auto">
                    {attemptedPuzzles.map((puzzle, idx) => (
                      <button
                        key={puzzle.puzzleId}
                        onClick={() => startReview(puzzle)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                          reviewingPuzzle?.puzzleId === puzzle.puzzleId
                            ? 'bg-chess-blue/15 border border-chess-blue/30'
                            : 'bg-chess-page hover:bg-[#dce8f0]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                            puzzle.result === 'correct'
                              ? 'bg-chess-green/15 text-chess-green'
                              : 'bg-chess-red/15 text-chess-red'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className="text-chess-text text-sm">Puzzle {idx + 1}</span>
                        </div>
                        <span className="text-chess-text-muted text-xs">{puzzle.rating}</span>
                      </button>
                    ))}
                  </div>

                </div>
              )}

              {/* Ad slot after completion */}
              <div className="mb-2">
                <AdSlot position="daily-complete" />
              </div>

              {/* Bottom action buttons */}
              {!user ? (
                <>
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm transition-transform active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, var(--color-chess-orange), #FF6B6B)', boxShadow: '0 3px 0 #CC6600' }}
                  >
                    Sign Up to Save Your Score
                  </button>
                  <button
                    onClick={() => router.push('/auth/login?redirect=%2Fdaily-challenge')}
                    className="text-chess-text-muted hover:text-chess-text transition-colors text-xs mt-2"
                  >
                    Already have an account? Log in
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm transition-transform active:scale-[0.98] mt-2 shadow-[0_3px_0_var(--color-chess-green-shadow)]"
                    style={{ backgroundColor: 'var(--color-chess-green)' }}
                  >
                    Start Learning
                  </button>
                  <div className="mt-2 text-chess-text-muted text-xs text-center">
                    New challenge drops at midnight!
                  </div>
                  <CreateProfileModal
                    isOpen={showSignupModal}
                    onClose={() => setShowSignupModal(false)}
                    context="daily-rook"
                  />
                </>
              ) : alreadyCompletedToday ? (
                <>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full py-3 rounded-xl text-white font-bold transition-transform active:scale-[0.98] shadow-[0_4px_0_var(--color-chess-green-shadow)]"
                    style={{ backgroundColor: 'var(--color-chess-green)' }}
                  >
                    Back to Home
                  </button>
                  <div className="mt-2 text-chess-text-muted text-xs text-center">
                    New challenge drops at midnight!
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={startChallenge}
                    className="w-full py-3 rounded-xl text-white font-bold transition-transform active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, var(--color-chess-orange), #FF6B6B)' }}
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="mt-2 text-chess-text-muted hover:text-chess-text transition-colors block w-full text-sm"
                  >
                    Back to Home
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom section — rook or review board */}
      {reviewingPuzzle && reviewGame ? (
        <div className="flex-shrink-0 px-4 pb-2 pt-1">
          <div className="max-w-md mx-auto w-full">
            <div className="rounded-lg overflow-hidden mb-2">
              <ChessPathBoard
                options={{
                  position: reviewGame.fen(),
                  boardOrientation: reviewingPuzzle.playerColor,
                  boardStyle: {
                    borderRadius: '8px',
                  },
                  darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
                  lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetReview}
                className="py-2 px-3 rounded-lg bg-chess-blue text-white text-xs font-bold shadow-[0_3px_0_var(--color-chess-blue-dark)] active:scale-[0.98] transition-all"
              >
                Reset
              </button>
              <button
                onClick={playNextReviewMove}
                disabled={reviewMoveIndex >= reviewingPuzzle.solutionMoves.length}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.98] ${
                  reviewMoveIndex >= reviewingPuzzle.solutionMoves.length
                    ? 'bg-[#dce8f0] text-chess-text-muted'
                    : 'bg-chess-green text-white shadow-[0_3px_0_var(--color-chess-green-shadow)]'
                }`}
              >
                {reviewMoveIndex >= reviewingPuzzle.solutionMoves.length
                  ? 'Done'
                  : `Play ${reviewingPuzzle.solutionMoves[reviewMoveIndex]}`}
              </button>
              <button
                onClick={closeReview}
                className="flex-[2] py-2 rounded-lg text-xs font-bold text-white active:scale-[0.98] transition-all"
                style={{ background: 'linear-gradient(135deg, var(--color-chess-orange), #FF6B6B)', boxShadow: '0 3px 0 #CC6600' }}
              >
                Close
              </button>
            </div>
            <div className="text-center text-chess-text-muted text-[10px] mt-1">
              Move {reviewMoveIndex}/{reviewingPuzzle.solutionMoves.length}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto w-full">
          <DailyRookDisplay
            results={buildResultsArray()}
            lives={lives}
            maxLives={MAX_LIVES}
            timeLeft={timeLeft}
            mode={rookMode}
            totalTime={gameState === 'finished' ? completionTimeMs : undefined}
            statusNode={gameState === 'playing' ? (
              <>
                {moveStatus === 'playing' && currentPuzzle && game && (
                  <div className="flex flex-col items-center gap-0.5">
                    <div className={`text-lg font-black ${game.turn() === 'w' ? 'text-chess-text' : 'text-[#4a5c6a]'}`}>
                      {game.turn() === 'w' ? 'White' : 'Black'} to move
                    </div>
                    <div className="text-chess-text-muted text-sm">
                      Find the best move
                    </div>
                  </div>
                )}
                {moveStatus === 'correct' && (
                  <div className="text-lg text-green-400 font-black animate-pulse">
                    Correct!
                  </div>
                )}
                {moveStatus === 'incorrect' && (
                  <div className="text-lg text-red-400 font-black">
                    Wrong! {lives > 0 ? 'Next puzzle...' : 'No lives left'}
                  </div>
                )}
              </>
            ) : undefined}
          />
        </div>
      )}

    </div>
  );
}
