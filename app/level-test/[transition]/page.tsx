'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { Chess, Square } from 'chess.js';
import { useRouter, useParams } from 'next/navigation';
import { LEVEL_TEST_CONFIG, getLevelTestConfig } from '@/data/level-unlock-tests';
import { getFirstLessonIdForLevel } from '@/lib/curriculum-registry';
import { playCorrectSound, playErrorSound, playMoveSound, playCaptureSound, playCelebrationSound, warmupAudio, vibrateOnCorrect, vibrateOnError } from '@/lib/sounds';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup';
import { useLessonProgress } from '@/hooks/useProgress';
import { useUser } from '@/hooks/useUser';
import { processPuzzle, ProcessedPuzzle, RawPuzzle, isCorrectMove, parseUciMove, isAlternateCheckmate, BOARD_COLORS } from '@/lib/puzzle-utils';
import { useAudioWarmup } from '@/hooks/useAudioWarmup';
import confetti from 'canvas-confetti';
import { CreateProfileModal } from '@/components/subscription/CreateProfileModal';

type TestState = 'loading' | 'intro' | 'playing' | 'passed' | 'failed';
type MoveStatus = 'playing' | 'correct' | 'wrong';

export default function LevelTestPage() {
  const router = useRouter();
  const params = useParams();
  const transition = params.transition as string;

  // Auth check
  const { user, loading: userLoading } = useUser();

  // Progress hook for unlocking levels (which also sets currentPosition)
  const { unlockLevel } = useLessonProgress();

  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [testState, setTestState] = useState<TestState>('loading');
  const [puzzles, setPuzzles] = useState<ProcessedPuzzle[]>([]);
  const [targetLevel, setTargetLevel] = useState<{ number: number; key: string; name: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Current position (starts as puzzle position, updates as moves are made)
  const [currentFen, setCurrentFen] = useState<string>('');
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveStatus, setMoveStatus] = useState<MoveStatus>('playing');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Setup move animation - show opponent's last move animating
  const [isAnimatingSetup, setIsAnimatingSetup] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0); // Start at 0 to prevent piece flying

  // Streak tracking for progress bar effects
  const [streak, setStreak] = useState(0);
  const [hadWrongAnswer, setHadWrongAnswer] = useState(false);

  // Progress bar value - updated immediately when puzzle is solved (not on Continue)
  const [solvedPuzzleCount, setSolvedPuzzleCount] = useState(0);

  // Track previously highlighted selection squares so we can explicitly clear them
  // (react-chessboard v5 caches square styles — omitting a style doesn't remove it)
  const prevSelectionSquaresRef = useRef<Square[]>([]);

  // Confetti ref to prevent re-firing
  const confettiFired = useRef(false);

  const { puzzleCount, maxWrongAnswers, passingScore } = LEVEL_TEST_CONFIG;

  // Warmup audio on first user interaction (unlocks audio on mobile)
  useAudioWarmup();

  // Validate transition
  useEffect(() => {
    const config = getLevelTestConfig(transition);
    if (!config) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [transition]);

  // Fetch and process test puzzles
  useEffect(() => {
    if (isValid === false) return;

    async function fetchPuzzles() {
      try {
        const res = await fetch(`/api/level-test?transition=${transition}`);
        if (!res.ok) {
          throw new Error('Failed to fetch test puzzles');
        }

        const data = await res.json();

        // Pre-process all puzzles upfront
        const processed = data.puzzles.map(processPuzzle);
        setPuzzles(processed);
        setTargetLevel(data.targetLevel);

        // Initialize first puzzle with setup animation
        if (processed.length > 0) {
          // Step 1: Instantly snap to starting position
          setAnimationDuration(0);
          setCurrentFen(processed[0].originalFen); // Start with position BEFORE opponent's move
          setIsAnimatingSetup(true);
          // Step 2: Enable animation, then animate the setup move
          setTimeout(() => {
            setAnimationDuration(300);
            setCurrentFen(processed[0].puzzleFen);
            setTimeout(() => {
              setIsAnimatingSetup(false);
            }, 300);
          }, 100);
        }

        // Show intro screen before starting
        setTestState('intro');
      } catch {
        // Error fetching puzzles
      }
    }

    fetchPuzzles();
  }, [transition, isValid]);

  // Reset state when moving to next puzzle
  useEffect(() => {
    if (puzzles.length === 0 || currentIndex >= puzzles.length) return;

    const puzzle = puzzles[currentIndex];
    // Step 1: Instantly snap to starting position (no flying pieces)
    setAnimationDuration(0);
    setCurrentFen(puzzle.originalFen); // Start with position BEFORE opponent's move
    setIsAnimatingSetup(true);
    setMoveIndex(0);
    setMoveStatus('playing');
    setSelectedSquare(null);

    // Step 2: Enable animation, then animate the setup move
    const timer = setTimeout(() => {
      setAnimationDuration(300); // Enable animation
      setCurrentFen(puzzle.puzzleFen); // Animate setup move
      setTimeout(() => {
        setIsAnimatingSetup(false);
      }, 300);
    }, 100); // Brief delay to ensure instant position is rendered first

    return () => clearTimeout(timer);
  }, [currentIndex, puzzles]);

  const currentPuzzle = puzzles[currentIndex];

  // Create chess instance for move validation
  const chess = useMemo(() => {
    if (!currentFen) return null;
    try {
      return new Chess(currentFen);
    } catch {
      return null;
    }
  }, [currentFen]);

  // Square styles for highlighting
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Highlight last move
    if (currentPuzzle && moveIndex === 0) {
      styles[currentPuzzle.lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
      styles[currentPuzzle.lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
    }

    if (selectedSquare && chess) {
      styles[selectedSquare] = { backgroundColor: 'rgba(100, 200, 255, 0.6)' };
      const moves = chess.moves({ square: selectedSquare, verbose: true });
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
  }, [selectedSquare, chess, currentPuzzle, moveIndex]);

  // Try to make a move
  const tryMove = useCallback((from: Square, to: Square) => {
    if (!chess || !currentPuzzle || moveStatus !== 'playing') return false;

    const solutionMoves = currentPuzzle.solutionMoves;
    if (moveIndex >= solutionMoves.length) return false;

    const chessCopy = new Chess(chess.fen());

    try {
      const move = chessCopy.move({ from, to, promotion: 'q' });
      if (!move) return false;

      const expectedUCI = solutionMoves[moveIndex];

      if (isCorrectMove(from, to, move.promotion, expectedUCI)) {
        // Correct move
        setCurrentFen(chessCopy.fen());
        setSelectedSquare(null);

        if (move.captured) {
          playCaptureSound();
        } else {
          playMoveSound();
        }

        const nextMoveIndex = moveIndex + 1;
        setMoveIndex(nextMoveIndex);

        // Check if puzzle is complete
        if (nextMoveIndex >= solutionMoves.length) {
          const newStreak = streak + 1;
          setMoveStatus('correct');
          playCorrectSound(correctCount);
          vibrateOnCorrect();
          setStreak(newStreak);
          setSolvedPuzzleCount(c => c + 1);
          return true;
        }

        // Auto-play opponent's response
        setTimeout(() => {
          const opponentGame = new Chess(chessCopy.fen());
          const opponentMoveUci = solutionMoves[nextMoveIndex];
          const { from: oppFrom, to: oppTo, promotion: oppPromo } = parseUciMove(opponentMoveUci);
          try {
            const oppMove = opponentGame.move({
              from: oppFrom as Square,
              to: oppTo as Square,
              promotion: oppPromo as 'q' | 'r' | 'b' | 'n' | undefined,
            });

            setCurrentFen(opponentGame.fen());
            setMoveIndex(nextMoveIndex + 1);

            if (oppMove && oppMove.captured) {
              playCaptureSound();
            } else {
              playMoveSound();
            }

            // Check if puzzle is complete after opponent move
            if (nextMoveIndex + 1 >= solutionMoves.length) {
              const newStreak = streak + 1;
              setMoveStatus('correct');
              playCorrectSound(correctCount);
              vibrateOnCorrect();
              setStreak(newStreak);
              setSolvedPuzzleCount(c => c + 1);
            }
          } catch {
            // Puzzle complete
            const newStreak = streak + 1;
            setMoveStatus('correct');
            playCorrectSound(correctCount);
            vibrateOnCorrect();
            setStreak(newStreak);
            setSolvedPuzzleCount(c => c + 1);
          }
        }, 400);

        return true;
      } else {
        // Check for alternate checkmate (accept ANY checkmate in mate puzzles)
        if (isAlternateCheckmate(chessCopy, currentPuzzle.themes ?? [])) {
          setCurrentFen(chessCopy.fen());
          setSelectedSquare(null);
          if (move.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
          const newStreak = streak + 1;
          setMoveStatus('correct');
          playCorrectSound(correctCount);
          vibrateOnCorrect();
          setStreak(newStreak);
          setSolvedPuzzleCount(c => c + 1);
          return true;
        }

        // Wrong move
        setSelectedSquare(null);
        playErrorSound();
        vibrateOnError();
        setStreak(0);
        setHadWrongAnswer(true);
        setMoveStatus('wrong');
        return false;
      }
    } catch {
      return false;
    }
  }, [chess, currentPuzzle, moveIndex, moveStatus, streak, correctCount]);

  // Handle square click
  const onSquareClick = useCallback(
    ({ square }: { piece: { pieceType: string } | null; square: string }) => {
      if (!chess || moveStatus !== 'playing') return;
      const clickedSquare = square as Square;

      if (!selectedSquare) {
        const piece = chess.get(clickedSquare);
        if (piece && piece.color === chess.turn()) {
          setSelectedSquare(clickedSquare);
        }
      } else if (selectedSquare === clickedSquare) {
        setSelectedSquare(null);
      } else {
        const legalMoves = chess.moves({ square: selectedSquare, verbose: true });
        const isLegalMove = legalMoves.some(m => m.to === clickedSquare);

        if (isLegalMove) {
          tryMove(selectedSquare, clickedSquare);
        } else {
          const piece = chess.get(clickedSquare);
          if (piece && piece.color === chess.turn()) {
            setSelectedSquare(clickedSquare);
          } else {
            setSelectedSquare(null);
          }
        }
      }
    },
    [chess, selectedSquare, moveStatus, tryMove]
  );

  // Handle continue after puzzle result
  const handleContinue = useCallback(() => {
    const isCorrect = moveStatus === 'correct';
    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
    const newWrongCount = isCorrect ? wrongCount : wrongCount + 1;

    setCorrectCount(newCorrectCount);
    setWrongCount(newWrongCount);

    // Check for test completion
    if (newWrongCount >= maxWrongAnswers) {
      setTestState('failed');
      return;
    }

    if (currentIndex + 1 >= puzzleCount) {
      if (newCorrectCount >= passingScore) {
        setTestState('passed');
        playCelebrationSound(newCorrectCount);
        // Unlock the level (which also sets currentPosition to first lesson)
        if (targetLevel) {
          const firstLessonId = getFirstLessonIdForLevel(targetLevel.number);
          unlockLevel(targetLevel.number, firstLessonId || undefined);
        }
      } else {
        setTestState('failed');
      }
      return;
    }

    setCurrentIndex(prev => prev + 1);
  }, [moveStatus, correctCount, wrongCount, currentIndex, puzzleCount, maxWrongAnswers, passingScore, targetLevel, unlockLevel]);

  // Handle going back to learn page (currentPosition is already set by unlockLevel)
  const handleBackToLearn = useCallback(() => {
    router.push('/learn');
  }, [router]);

  // Confetti effect on test passed - wrapped in useEffect
  useEffect(() => {
    if (testState === 'passed' && !confettiFired.current && typeof window !== 'undefined') {
      confettiFired.current = true;
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ['#58CC02', '#1CB0F6', '#FFC800', '#FFFFFF'],
      });
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ['#58CC02', '#1CB0F6', '#FFC800', '#FFFFFF'],
      });
    }
  }, [testState]);

  // Loading state while checking auth
  if (userLoading) {
    return (
      <div className="h-full bg-chess-page flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-chess-green border-t-transparent rounded-full" />
      </div>
    );
  }

  // Auth check - must be logged in to take level tests
  if (!user) {
    return (
      <CreateProfileModal
        isOpen={true}
        onClose={() => router.push('/learn')}
        context="level-test"
      />
    );
  }

  // Loading state while validating transition
  if (isValid === null) {
    return (
      <div className="h-full bg-chess-page flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-chess-green border-t-transparent rounded-full" />
      </div>
    );
  }

  // Invalid transition
  if (isValid === false) {
    return (
      <div className="h-full bg-chess-page flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-chess-text mb-2">Invalid Test</h1>
          <p className="text-chess-text-muted mb-6">
            The test &quot;{transition}&quot; doesn&apos;t exist.
          </p>
          <button
            onClick={handleBackToLearn}
            className="px-6 py-2 bg-chess-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
          >
            Back to Chess Path
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (testState === 'loading') {
    return (
      <div className="h-full bg-chess-page flex items-center justify-center">
        <style>{progressBarStyles}</style>
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-chess-green border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-chess-text-muted">Loading test puzzles...</p>
        </div>
      </div>
    );
  }

  // Intro screen - show test parameters before starting
  if (testState === 'intro') {
    return (
      <div className="h-full bg-chess-page flex flex-col items-center pt-6 px-4">
        <div className="text-center max-w-sm w-full">
          <div className="flex justify-center mb-3">
            <AnimatedLogo
              theme="light"
              iconOnly
              size={1.5}
              autoPlay
              perpetual
            />
          </div>

          <h1 className="text-3xl font-black text-chess-text mb-1">
            Level {targetLevel?.number || parseInt(transition.split('-')[1])} Test
          </h1>
          <p className="text-chess-text-muted mb-5">
            Prove your skills to unlock the next level
          </p>

          {/* Rules card */}
          <div className="bg-chess-surface rounded-2xl px-5 py-4 mb-4 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-chess-text-muted text-sm">Puzzles</span>
              <span className="text-chess-text font-bold">{puzzleCount}</span>
            </div>
            <div className="border-t border-slate-100 mb-3" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-chess-text-muted text-sm">Lives</span>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <svg key={i} className="w-5 h-5 text-chess-red" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 mb-3" />
            <p className="text-sm font-bold text-chess-text">
              3 wrong and you&apos;re out
            </p>
          </div>

          <p className="text-chess-text-faint text-sm mb-4">
            Puzzles are from the level you&apos;re testing into
          </p>

          <button
            onClick={() => {
              warmupAudio(); // Warmup audio NOW - user just clicked
              setTestState('playing');
            }}
            className="w-full py-4 rounded-xl font-bold text-lg text-white bg-chess-green shadow-[0_4px_0_#3d8c01] active:translate-y-[2px] active:shadow-[0_2px_0_#3d8c01] transition-all hover:bg-chess-green-dark"
          >
            Start Test
          </button>

          <button
            onClick={handleBackToLearn}
            className="w-full py-3 mt-3 text-chess-text-muted hover:text-chess-text transition-colors"
          >
            Back to Chess Path
          </button>
        </div>
      </div>
    );
  }

  // Test passed
  if (testState === 'passed') {
    return (
      <div className="min-h-screen bg-chess-page flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <AnimatedLogo
              theme="light"
              iconOnly
              size={1.5}
              autoPlay
            />
          </div>
          <h1 className="text-3xl font-black text-chess-green mb-2">Test Passed!</h1>
          <p className="text-chess-text-muted mb-2">
            You scored {correctCount}/{puzzleCount}
          </p>
          <p className="text-chess-text font-semibold mb-8">
            {targetLevel ? `Level ${targetLevel.number} is now unlocked` : 'Great job!'}
          </p>
          <button
            onClick={handleBackToLearn}
            className="w-full py-4 rounded-xl font-bold text-lg text-white bg-chess-green shadow-[0_4px_0_#3d8c01] active:translate-y-[2px] active:shadow-[0_2px_0_#3d8c01] transition-all hover:bg-chess-green-dark"
          >
            Continue to Level {targetLevel?.number || 2}
          </button>
        </div>
      </div>
    );
  }

  // Test failed
  if (testState === 'failed') {
    return (
      <div className="min-h-screen bg-chess-page flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="flex justify-center gap-1 mb-4">
            {[0, 1, 2].map(i => (
              <svg key={i} className="w-8 h-8 text-[#c5d4de]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ))}
          </div>
          <h1 className="text-3xl font-black text-chess-red mb-2">Out of Lives</h1>
          <p className="text-chess-text-muted mb-2">
            You got {correctCount} out of {correctCount + wrongCount} correct
          </p>
          <p className="text-chess-text-faint text-sm mb-8">
            Keep practicing and try again when you&apos;re ready
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                warmupAudio(); // Warmup audio NOW - user just clicked
                setTestState('loading');
                setCurrentIndex(0);
                setCorrectCount(0);
                setWrongCount(0);
                setStreak(0);
                setHadWrongAnswer(false);
                setSolvedPuzzleCount(0);
                confettiFired.current = false;
                // Re-fetch puzzles
                fetch(`/api/level-test?transition=${transition}`)
                  .then(res => res.json())
                  .then(data => {
                    const processed = data.puzzles.map(processPuzzle);
                    setPuzzles(processed);
                    if (processed.length > 0) {
                      // Use 3-step animation pattern to prevent pieces flying
                      setAnimationDuration(0);
                      setCurrentFen(processed[0].originalFen);
                      setTimeout(() => {
                        setAnimationDuration(300);
                        setCurrentFen(processed[0].puzzleFen);
                      }, 100);
                    }
                    setTestState('playing');
                  })
                  .catch(() => {
                    // Error re-fetching puzzles
                  });
              }}
              className="w-full py-4 rounded-xl font-bold text-lg text-white bg-chess-blue shadow-[0_4px_0_#1487c0] active:translate-y-[2px] active:shadow-[0_2px_0_#1487c0] transition-all hover:bg-blue-600"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToLearn}
              className="w-full py-3 text-chess-text-muted hover:text-chess-text transition-colors"
            >
              Back to Chess Path
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing state - wait for puzzle to be ready
  if (!currentPuzzle || !currentFen || !chess) {
    return (
      <div className="h-full bg-chess-page flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-chess-green border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-full bg-chess-page text-chess-text flex flex-col overflow-hidden">
      <style>{progressBarStyles}</style>

      {/* Header */}
      <div className="bg-chess-surface border-b border-chess-text-faint/10 px-4 py-3 flex-shrink-0 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBackToLearn}
            className="text-chess-text-muted hover:text-chess-text"
          >
            ✕
          </button>

          <div className="flex-1 mx-4">
            <ChessProgressBar
              current={solvedPuzzleCount}
              total={puzzleCount}
              streak={streak}
              hadWrongAnswer={hadWrongAnswer}
            />
          </div>
        </div>
      </div>

      {/* Test info banner */}
      <div className="bg-chess-surface/50 px-4 py-2 border-b border-chess-text-faint/10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <span className="text-sm">
            <span className="text-chess-green font-semibold">{correctCount}</span>
            <span className="text-chess-text-faint"> correct</span>
          </span>
          <span className="text-sm text-chess-text-muted">
            Puzzle {currentIndex + 1}/{puzzleCount}
          </span>
          <div className="flex items-center gap-0.5">
            {[0, 1, 2].map(i => (
              <svg
                key={i}
                className={`w-5 h-5 transition-all duration-300 ${
                  i < (maxWrongAnswers - wrongCount) ? 'text-chess-red' : 'text-[#c5d4de]'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-2 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Turn indicator */}
          <div className="flex items-center justify-between mb-2 h-8">
            <div className="text-base font-semibold text-chess-text-muted">
              Puzzle {currentIndex + 1}
            </div>
            <span className={`text-base font-bold ${currentPuzzle.playerColor === 'white' ? 'text-chess-text' : 'text-chess-text-muted'}`}>
              {currentPuzzle.playerColor === 'white' ? 'White' : 'Black'} to move
            </span>
          </div>

          {/* Chessboard */}
          <div className="relative">
            <ChessPathBoard
              options={{
                position: currentFen,
                boardOrientation: currentPuzzle.playerColor,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onPieceDrop: isAnimatingSetup ? undefined : (args: any) => {
                  tryMove(args.sourceSquare as Square, args.targetSquare as Square);
                  return true;
                },
                onSquareClick: isAnimatingSetup ? undefined : onSquareClick,
                squareStyles: squareStyles,
                animationDurationInMs: animationDuration,
                boardStyle: {
                  borderRadius: '8px 8px 0 0',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                },
                darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
                lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
              }}
            />
          </div>

          {/* Result popup */}
          {moveStatus === 'correct' && (
            <PuzzleResultPopup
              type="correct"
              message="Great move!"
              onContinue={handleContinue}
            />
          )}

          {moveStatus === 'wrong' && (
            <PuzzleResultPopup
              type="incorrect"
              message="Not quite right."
              onContinue={handleContinue}
            />
          )}
        </div>
      </div>
    </div>
  );
}
