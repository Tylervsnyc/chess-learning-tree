'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { useRouter, useParams } from 'next/navigation';
import { LEVEL_TEST_CONFIG, getLevelTestConfig } from '@/data/level-unlock-tests';
import { getFirstLessonIdForLevel } from '@/lib/curriculum-registry';
import { playCorrectSound, playErrorSound, playMoveSound, playCaptureSound, playCelebrationSound, warmupAudio, vibrateOnCorrect, vibrateOnError } from '@/lib/sounds';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup';
import { useLessonProgress } from '@/hooks/useProgress';
import { useUser } from '@/hooks/useUser';
import { processPuzzle, ProcessedPuzzle, RawPuzzle, isCorrectMove, parseUciMove } from '@/lib/puzzle-utils';
import confetti from 'canvas-confetti';

type TestState = 'loading' | 'intro' | 'playing' | 'passed' | 'failed';
type MoveStatus = 'playing' | 'correct' | 'wrong';

export default function LevelTestPage() {
  const router = useRouter();
  const params = useParams();
  const transition = params.transition as string;

  // Auth check
  const { user, loading: userLoading } = useUser();

  // Progress hook for unlocking levels and setting starting lesson
  const { unlockLevel, setStartingLesson } = useLessonProgress();

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

  // Confetti ref to prevent re-firing
  const confettiFired = useRef(false);

  const { puzzleCount, maxWrongAnswers, passingScore } = LEVEL_TEST_CONFIG;

  // Warmup audio on first user interaction (unlocks audio on mobile)
  useEffect(() => {
    const handleFirstInteraction = () => {
      warmupAudio();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

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
      for (const move of moves) {
        styles[move.to] = {
          background: move.captured
            ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
            : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
        };
      }
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
            }
          } catch {
            // Puzzle complete
            const newStreak = streak + 1;
            setMoveStatus('correct');
            playCorrectSound(correctCount);
            vibrateOnCorrect();
            setStreak(newStreak);
          }
        }, 400);

        return true;
      } else {
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
        // Unlock the level and set starting lesson!
        if (targetLevel) {
          unlockLevel(targetLevel.number);
          // Set the first lesson of the new level as the starting lesson
          // This unlocks all lessons up to and including this one
          const firstLessonId = getFirstLessonIdForLevel(targetLevel.number);
          if (firstLessonId) {
            setStartingLesson(firstLessonId);
          }
        }
      } else {
        setTestState('failed');
      }
      return;
    }

    setCurrentIndex(prev => prev + 1);
  }, [moveStatus, correctCount, wrongCount, currentIndex, puzzleCount, maxWrongAnswers, passingScore, targetLevel, unlockLevel, setStartingLesson]);

  // Handle going back to learn page (with scrollTo if test passed)
  const handleBackToLearn = useCallback(() => {
    if (testState === 'passed' && targetLevel) {
      const firstLessonId = getFirstLessonIdForLevel(targetLevel.number);
      if (firstLessonId) {
        router.push(`/learn?scrollTo=${firstLessonId}`);
        return;
      }
    }
    router.push('/learn');
  }, [router, testState, targetLevel]);

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
      <div className="h-screen bg-[#131F24] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Auth check - must be logged in to take level tests
  if (!user) {
    return (
      <div className="h-screen bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Sign In Required</h1>
          <p className="text-white/60 mb-6">
            Please sign in to take level tests and track your progress.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-[#1CB0F6] text-white font-bold rounded-xl hover:bg-[#1A9FE0] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-6 py-3 bg-[#58CC02] text-white font-bold rounded-xl hover:bg-[#4CAF00] transition-colors"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state while validating transition
  if (isValid === null) {
    return (
      <div className="h-screen bg-[#131F24] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Invalid transition
  if (isValid === false) {
    return (
      <div className="h-screen bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Test</h1>
          <p className="text-white/60 mb-6">
            The test &quot;{transition}&quot; doesn&apos;t exist.
          </p>
          <button
            onClick={handleBackToLearn}
            className="px-6 py-2 bg-[#1CB0F6] text-white font-bold rounded-xl hover:bg-[#1A9FE0] transition-colors"
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
      <div className="h-screen bg-[#131F24] flex items-center justify-center">
        <style>{progressBarStyles}</style>
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white/60">Loading test puzzles...</p>
        </div>
      </div>
    );
  }

  // Intro screen - show test parameters before starting
  if (testState === 'intro') {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-3xl font-black text-white mb-2">
            Level {targetLevel?.number || parseInt(transition.split('-')[1])} Test
          </h1>
          <p className="text-white/60 mb-6">
            Prove your skills to unlock the next level
          </p>

          {/* Test parameters */}
          <div className="bg-[#1A2C35] rounded-2xl p-6 mb-6 text-left">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Puzzles</span>
                <span className="text-white font-bold">{puzzleCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">To pass</span>
                <span className="text-[#58CC02] font-bold">{passingScore} correct</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Max wrong</span>
                <span className="text-[#FF4B4B] font-bold">{maxWrongAnswers}</span>
              </div>
            </div>
          </div>

          <p className="text-white/40 text-sm mb-6">
            Each puzzle is from the level you&apos;re testing into
          </p>

          <button
            onClick={() => {
              warmupAudio(); // Warmup audio NOW - user just clicked
              setTestState('playing');
            }}
            className="w-full py-4 rounded-xl font-bold text-lg text-white bg-[#58CC02] shadow-[0_4px_0_#3d8c01] active:translate-y-[2px] active:shadow-[0_2px_0_#3d8c01] transition-all"
          >
            Start Test
          </button>

          <button
            onClick={handleBackToLearn}
            className="w-full py-3 mt-3 text-white/60 hover:text-white transition-colors"
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
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-black text-[#58CC02] mb-2">Test Passed!</h1>
          <p className="text-white/60 mb-2">
            You scored {correctCount}/{puzzleCount}
          </p>
          <p className="text-white/80 mb-6">
            {targetLevel ? `Level ${targetLevel.number} is now unlocked!` : 'Great job!'}
          </p>
          <button
            onClick={handleBackToLearn}
            className="w-full py-4 rounded-xl font-bold text-lg text-white bg-[#58CC02] shadow-[0_4px_0_#3d8c01] active:translate-y-[2px] active:shadow-[0_2px_0_#3d8c01] transition-all"
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
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-3xl font-black text-[#FF4B4B] mb-2">Test Not Passed</h1>
          <p className="text-white/60 mb-6">
            You scored {correctCount}/{puzzleCount}. Need {passingScore} to pass.
          </p>
          <p className="text-white/40 text-sm mb-6">
            Keep practicing the current level and try again when you&apos;re ready!
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
                confettiFired.current = false;
                // Re-fetch puzzles
                fetch(`/api/level-test?transition=${transition}`)
                  .then(res => res.json())
                  .then(data => {
                    const processed = data.puzzles.map(processPuzzle);
                    setPuzzles(processed);
                    if (processed.length > 0) {
                      setCurrentFen(processed[0].puzzleFen);
                    }
                    setTestState('playing');
                  })
                  .catch(() => {
                    // Error re-fetching puzzles
                  });
              }}
              className="w-full py-4 rounded-xl font-bold text-lg text-white bg-[#1CB0F6] shadow-[0_4px_0_#1487c0] active:translate-y-[2px] active:shadow-[0_2px_0_#1487c0] transition-all"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToLearn}
              className="w-full py-3 text-white/60 hover:text-white transition-colors"
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
      <div className="h-screen bg-[#131F24] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#131F24] text-white flex flex-col overflow-hidden">
      <style>{progressBarStyles}</style>

      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBackToLearn}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>

          <div className="flex-1 mx-4">
            <ChessProgressBar
              current={currentIndex + (moveStatus === 'correct' ? 1 : 0)}
              total={puzzleCount}
              streak={streak}
              hadWrongAnswer={hadWrongAnswer}
            />
          </div>

          <div className="text-gray-400">
            {currentIndex + 1}/{puzzleCount}
          </div>
        </div>
      </div>

      {/* Test info banner */}
      <div className="bg-[#1A2C35]/50 px-4 py-2 text-center">
        <span className="text-sm text-white/60">
          Level {transition.split('-')[0]} → {transition.split('-')[1]} Test
        </span>
        <span className="mx-3 text-white/30">•</span>
        <span className="text-sm">
          <span className="text-[#58CC02]">{correctCount} correct</span>
          <span className="text-white/30 mx-2">•</span>
          <span className="text-[#FF4B4B]">{wrongCount}/{maxWrongAnswers} wrong</span>
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-2 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Turn indicator */}
          <div className="flex items-center justify-between mb-2 h-8">
            <div className="text-base font-semibold text-gray-300">
              Puzzle {currentIndex + 1}
            </div>
            <span className={`text-base font-bold ${
              currentPuzzle.playerColor === 'white' ? 'text-white' : 'text-gray-300'
            }`}>
              {currentPuzzle.playerColor === 'white' ? 'White' : 'Black'} to move
            </span>
          </div>

          {/* Chessboard */}
          <div className="relative">
            <Chessboard
              options={{
                position: currentFen,
                boardOrientation: currentPuzzle.playerColor,
                onSquareClick: isAnimatingSetup ? undefined : onSquareClick,
                squareStyles: squareStyles,
                animationDurationInMs: animationDuration,
                boardStyle: {
                  borderRadius: '8px 8px 0 0',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                },
                darkSquareStyle: { backgroundColor: '#779952' },
                lightSquareStyle: { backgroundColor: '#edeed1' },
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
