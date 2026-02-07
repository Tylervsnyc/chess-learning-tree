'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { useRouter } from 'next/navigation';
import { LEVEL_TEST_CONFIG } from '@/data/level-unlock-tests';
import { playCorrectSound, playErrorSound, playMoveSound, playCaptureSound, playCelebrationSound, warmupAudio } from '@/lib/sounds';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup';

interface TestPuzzle {
  id: string;
  fen: string;
  moves: string[];
  rating: number;
  theme: string;
}

interface LevelUnlockTestProps {
  transition: string; // e.g., "1-2"
}

type TestState = 'loading' | 'playing' | 'passed' | 'failed';
type MoveStatus = 'playing' | 'correct' | 'wrong';

export default function LevelUnlockTest({ transition }: LevelUnlockTestProps) {
  const router = useRouter();
  const [testState, setTestState] = useState<TestState>('loading');
  const [puzzles, setPuzzles] = useState<TestPuzzle[]>([]);
  const [variantId, setVariantId] = useState<string>('');
  const [targetLevel, setTargetLevel] = useState<{ number: number; key: string; name: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [chess, setChess] = useState<Chess | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveStatus, setMoveStatus] = useState<MoveStatus>('playing');
  const [boardKey, setBoardKey] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Streak tracking for progress bar effects
  const [streak, setStreak] = useState(0);
  const [hadWrongAnswer, setHadWrongAnswer] = useState(false);

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

  // Fetch test puzzles
  useEffect(() => {
    async function fetchPuzzles() {
      try {
        const res = await fetch(`/api/level-test?transition=${transition}`);
        if (!res.ok) {
          throw new Error('Failed to fetch test puzzles');
        }

        const data = await res.json();
        setPuzzles(data.puzzles);
        setVariantId(data.variantId);
        setTargetLevel(data.targetLevel);
        setTestState('playing');
      } catch (error) {
        console.error('Error fetching test puzzles:', error);
      }
    }

    fetchPuzzles();
  }, [transition]);

  // Set up current puzzle
  useEffect(() => {
    if (puzzles.length === 0 || currentIndex >= puzzles.length) return;

    const puzzle = puzzles[currentIndex];
    const newChess = new Chess(puzzle.fen);

    // Apply the setup move (opponent's move that creates the tactic)
    if (puzzle.moves.length > 0) {
      const setupMove = puzzle.moves[0];
      try {
        newChess.move({
          from: setupMove.slice(0, 2) as Square,
          to: setupMove.slice(2, 4) as Square,
          promotion: setupMove.length > 4 ? (setupMove[4] as 'q' | 'r' | 'b' | 'n') : undefined,
        });
      } catch (e) {
        console.error('Error applying setup move:', e);
      }
    }

    setChess(newChess);
    setMoveIndex(1); // Start at move 1 (first player move)
    setMoveStatus('playing');
    setSelectedSquare(null);
    setBoardKey(prev => prev + 1);
  }, [currentIndex, puzzles]);

  const currentPuzzle = puzzles[currentIndex];
  const playerColor = chess?.turn() === 'w' ? 'white' : 'black';

  // Square styles for selected piece and legal moves
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

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
  }, [selectedSquare, chess]);

  const handlePuzzleComplete = useCallback((wasCorrect: boolean) => {
    setMoveStatus(wasCorrect ? 'correct' : 'wrong');

    if (wasCorrect) {
      playCorrectSound(correctCount);
      setStreak(prev => prev + 1);
    } else {
      playErrorSound();
      setStreak(0);
      setHadWrongAnswer(true);
    }

    setCorrectCount(prev => wasCorrect ? prev + 1 : prev);
    setWrongCount(prev => wasCorrect ? prev : prev + 1);
  }, [correctCount]);

  // Handle continue button from popup
  const handleContinue = useCallback(() => {
    // State has already been updated in handlePuzzleComplete
    // Check for early termination
    if (wrongCount > maxWrongAnswers) {
      // Failed - too many wrong answers
      setTestState('failed');
      recordResult(false, correctCount, wrongCount);
    } else if (correctCount >= passingScore) {
      // Passed - enough correct answers
      setTestState('passed');
      playCelebrationSound(correctCount);
      recordResult(true, correctCount, wrongCount);
    } else if (currentIndex + 1 >= puzzles.length) {
      // All puzzles done - check final score
      if (correctCount >= passingScore) {
        setTestState('passed');
        playCelebrationSound(correctCount);
        recordResult(true, correctCount, wrongCount);
      } else {
        setTestState('failed');
        recordResult(false, correctCount, wrongCount);
      }
    } else {
      // Next puzzle
      setCurrentIndex(currentIndex + 1);
    }
  }, [correctCount, wrongCount, currentIndex, puzzles.length, maxWrongAnswers, passingScore]);

  const recordResult = async (passed: boolean, correct: number, wrong: number) => {
    try {
      await fetch('/api/level-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transition,
          variantId,
          passed,
          correctCount: correct,
          wrongCount: wrong,
        }),
      });
    } catch (error) {
      console.error('Error recording test result:', error);
    }
  };

  const tryMove = useCallback((from: Square, to: Square): boolean => {
    if (!chess || !currentPuzzle || moveStatus !== 'playing') return false;

    const expectedMove = currentPuzzle.moves[moveIndex];
    if (!expectedMove) return false;

    const attemptedMove = from + to;

    // Check if this is the correct move (checking from/to squares)
    const isCorrect = expectedMove.startsWith(attemptedMove);

    if (isCorrect) {
      // Make the move
      try {
        const move = chess.move({
          from,
          to,
          promotion: 'q', // Auto-promote to queen
        });

        if (move) {
          setSelectedSquare(null);
          if (move.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }

          // Check if puzzle is complete
          if (moveIndex >= currentPuzzle.moves.length - 1) {
            handlePuzzleComplete(true);
          } else {
            // Make opponent's response
            const opponentMove = currentPuzzle.moves[moveIndex + 1];
            if (opponentMove) {
              setTimeout(() => {
                try {
                  const oppMove = chess.move({
                    from: opponentMove.slice(0, 2) as Square,
                    to: opponentMove.slice(2, 4) as Square,
                    promotion: opponentMove.length > 4 ? (opponentMove[4] as 'q' | 'r' | 'b' | 'n') : undefined,
                  });
                  if (oppMove?.captured) {
                    playCaptureSound();
                  } else {
                    playMoveSound();
                  }
                  setMoveIndex(moveIndex + 2);
                  setChess(new Chess(chess.fen()));

                  // Check if puzzle complete after opponent move
                  if (moveIndex + 2 >= currentPuzzle.moves.length) {
                    handlePuzzleComplete(true);
                  }
                } catch (e) {
                  console.error('Error making opponent move:', e);
                }
              }, 400);
            }
          }
          return true;
        }
      } catch (e) {
        console.error('Error making move:', e);
      }
    } else {
      // Wrong move
      setSelectedSquare(null);
      handlePuzzleComplete(false);
    }

    return false;
  }, [chess, currentPuzzle, moveStatus, moveIndex, handlePuzzleComplete]);

  // Handle square click for tap-to-move
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

  const handleCancel = () => {
    router.push('/learn');
  };

  const handlePass = () => {
    if (targetLevel) {
      router.push(`/learn?level=${targetLevel.key}`);
    } else {
      router.push('/learn');
    }
  };

  const handleFail = () => {
    router.push('/learn');
  };

  // Loading state - matches lesson page structure
  if (testState === 'loading') {
    return (
      <div className="h-full bg-[#131F24] text-white flex flex-col overflow-hidden">
        <style>{progressBarStyles}</style>
        {/* Header placeholder */}
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push('/learn')}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex-1 mx-4">
              <ChessProgressBar current={0} total={puzzleCount} streak={0} />
            </div>
            <div className="text-gray-400">0/{puzzleCount}</div>
          </div>
        </div>
        {/* Loading content */}
        <div className="flex-1 flex flex-col items-center px-4 pt-1 overflow-hidden">
          <div className="w-full max-w-lg">
            <div className="flex items-center justify-between mb-2 h-8">
              <div className="h-5 w-32 bg-gray-700 rounded animate-pulse" />
              <div className="h-5 w-24 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="aspect-square bg-gray-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Passed state
  if (testState === 'passed') {
    return (
      <div className="h-full bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-black text-[#58CC02] mb-2">Level Unlocked!</h1>
          <p className="text-white/60 mb-2">
            {correctCount}/{puzzleCount} correct
          </p>
          {targetLevel && (
            <p className="text-white mb-6">
              You're ready for <span className="text-[#58CC02] font-bold">{targetLevel.name}</span>!
            </p>
          )}
          <button
            onClick={handlePass}
            className="px-8 py-3 bg-[#58CC02] text-white font-bold rounded-xl hover:bg-[#4CAF00] transition-colors shadow-[0_4px_0_#3d8a01] active:translate-y-[2px] active:shadow-[0_2px_0_#3d8a01]"
          >
            Start {targetLevel?.name || 'Next Level'}
          </button>
        </div>
      </div>
    );
  }

  // Failed state
  if (testState === 'failed') {
    return (
      <div className="h-full bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">💪</div>
          <h1 className="text-3xl font-black text-[#FF4B4B] mb-2">Not Quite Yet</h1>
          <p className="text-white/60 mb-6">
            {correctCount}/{puzzleCount} correct ({wrongCount} wrong).
            <br />
            Keep practicing and try again!
          </p>
          <button
            onClick={handleFail}
            className="px-8 py-3 bg-[#1CB0F6] text-white font-bold rounded-xl hover:bg-[#1A9FE0] transition-colors shadow-[0_4px_0_#1489bd] active:translate-y-[2px] active:shadow-[0_2px_0_#1489bd]"
          >
            Continue Learning
          </button>
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div className="h-full bg-[#131F24] text-white flex flex-col overflow-hidden">
      <style>{progressBarStyles}</style>
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>

          {/* Progress bar with streak effect */}
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

      {/* Main content - fixed layout to prevent board movement */}
      <div className="flex-1 flex flex-col items-center px-4 pt-1 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Title + Turn indicator on same line */}
          <div className="flex items-center justify-between mb-2 h-8">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-gray-300">
                {targetLevel?.name || 'Level'} Test
              </h1>
              <span className="text-xs text-white/40">
                ({correctCount}/{passingScore} to pass)
              </span>
            </div>
            <span className={`text-base font-bold ${
              playerColor === 'white' ? 'text-white' : 'text-gray-300'
            }`}>
              {playerColor === 'white' ? 'White' : 'Black'} to move
            </span>
          </div>

          {/* Chessboard */}
          <div className="relative">
            {chess && (
              <Chessboard
                key={boardKey}
                options={{
                  position: chess.fen(),
                  boardOrientation: playerColor as 'white' | 'black',
                  onSquareClick: onSquareClick,
                  squareStyles: squareStyles,
                  boardStyle: {
                    borderRadius: '8px 8px 0 0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  },
                  darkSquareStyle: { backgroundColor: '#779952' },
                  lightSquareStyle: { backgroundColor: '#edeed1' },
                }}
              />
            )}
          </div>

          {/* Result popup - directly below board */}
          {moveStatus === 'correct' && (
            <PuzzleResultPopup
              type="correct"
              message="Excellent!"
              onContinue={handleContinue}
            />
          )}

          {moveStatus === 'wrong' && (
            <PuzzleResultPopup
              type="incorrect"
              message="That's not quite right"
              onContinue={handleContinue}
            />
          )}

          {/* Status text when playing */}
          {moveStatus === 'playing' && (
            <div className="h-6 text-center mt-3 text-white/40 text-sm">
              Find the best move
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
