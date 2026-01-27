'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { useRouter } from 'next/navigation';
import { LEVEL_TEST_CONFIG } from '@/data/level-unlock-tests';
import { playCorrectSound, playErrorSound, playMoveSound, playCaptureSound } from '@/lib/sounds';

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
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [boardKey, setBoardKey] = useState(0);

  const { puzzleCount, maxWrongAnswers, passingScore } = LEVEL_TEST_CONFIG;

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
    setFeedback(null);
    setBoardKey(prev => prev + 1);
  }, [currentIndex, puzzles]);

  const currentPuzzle = puzzles[currentIndex];
  const playerColor = chess?.turn() === 'w' ? 'white' : 'black';

  const handlePuzzleComplete = useCallback((wasCorrect: boolean) => {
    setFeedback(wasCorrect ? 'correct' : 'wrong');

    if (wasCorrect) {
      playCorrectSound(correctCount);
    } else {
      playErrorSound();
    }

    const newCorrect = wasCorrect ? correctCount + 1 : correctCount;
    const newWrong = wasCorrect ? wrongCount : wrongCount + 1;

    setCorrectCount(newCorrect);
    setWrongCount(newWrong);

    // Check for early termination
    setTimeout(() => {
      if (newWrong > maxWrongAnswers) {
        // Failed - too many wrong answers
        setTestState('failed');
        recordResult(false, newCorrect, newWrong);
      } else if (newCorrect >= passingScore) {
        // Passed - enough correct answers
        setTestState('passed');
        recordResult(true, newCorrect, newWrong);
      } else if (currentIndex + 1 >= puzzles.length) {
        // All puzzles done - check final score
        if (newCorrect >= passingScore) {
          setTestState('passed');
          recordResult(true, newCorrect, newWrong);
        } else {
          setTestState('failed');
          recordResult(false, newCorrect, newWrong);
        }
      } else {
        // Next puzzle
        setCurrentIndex(currentIndex + 1);
      }
    }, 1200);
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

  const handleMove = useCallback((sourceSquare: string, targetSquare: string): boolean => {
    if (!chess || !currentPuzzle || feedback) return false;

    const expectedMove = currentPuzzle.moves[moveIndex];
    if (!expectedMove) return false;

    const attemptedMove = sourceSquare + targetSquare;

    // Check if this is the correct move (checking from/to squares)
    const isCorrect = expectedMove.startsWith(attemptedMove);

    if (isCorrect) {
      // Make the move
      try {
        const move = chess.move({
          from: sourceSquare as Square,
          to: targetSquare as Square,
          promotion: 'q', // Auto-promote to queen
        });

        if (move) {
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
      handlePuzzleComplete(false);
    }

    return false;
  }, [chess, currentPuzzle, feedback, moveIndex, handlePuzzleComplete]);

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

  // Loading state
  if (testState === 'loading') {
    return (
      <div className="h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white/60">Loading test puzzles...</p>
        </div>
      </div>
    );
  }

  // Passed state
  if (testState === 'passed') {
    return (
      <div className="h-screen bg-[#131F24] flex items-center justify-center p-4">
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
      <div className="h-screen bg-[#131F24] flex items-center justify-center p-4">
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
    <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="text-white/60 hover:text-white text-xl w-8"
          >
            ✕
          </button>
          <div className="text-center flex-1">
            <div className="text-sm text-white/50">
              {targetLevel?.name || 'Level'} Unlock Test
            </div>
            <div className="text-xs text-white/30">
              {correctCount} correct · {wrongCount}/{maxWrongAnswers + 1} wrong allowed
            </div>
          </div>
          <div className="text-white/60 w-8 text-right">
            {currentIndex + 1}/{puzzleCount}
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-lg mx-auto mt-2">
          <div className="h-3 bg-[#0D1A1F] rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${((currentIndex) / puzzleCount) * 100}%`,
                background: '#58CC02',
              }}
            />
          </div>
        </div>
      </div>

      {/* Puzzle area */}
      <div className="flex-1 flex flex-col items-center px-4 pt-4 overflow-hidden">
        <div className="w-full max-w-md">
          {/* Turn indicator */}
          <div className="text-center mb-3 h-8">
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                playerColor === 'white'
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-white border border-white/20'
              }`}
            >
              Play as {playerColor}
            </span>
          </div>

          {/* Board */}
          <div className={`relative rounded-xl overflow-hidden ${feedback ? 'pointer-events-none' : ''}`}>
            {chess && (
              <Chessboard
                key={boardKey}
                options={{
                  position: chess.fen(),
                  onPieceDrop: (info: { piece: unknown; sourceSquare: string; targetSquare: string | null }) => {
                    if (!info.targetSquare) return false;
                    return handleMove(info.sourceSquare, info.targetSquare);
                  },
                  boardOrientation: playerColor as 'white' | 'black',
                  boardStyle: { borderRadius: '12px' },
                  darkSquareStyle: { backgroundColor: '#779952' },
                  lightSquareStyle: { backgroundColor: '#edeed1' },
                }}
              />
            )}

            {/* Feedback overlay */}
            {feedback && (
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  feedback === 'correct' ? 'bg-[#58CC02]/80' : 'bg-[#FF4B4B]/80'
                }`}
              >
                <div className="text-white text-6xl font-black">
                  {feedback === 'correct' ? '✓' : '✗'}
                </div>
              </div>
            )}
          </div>

          {/* Theme hint */}
          {currentPuzzle && (
            <div className="text-center mt-3 text-white/40 text-sm">
              Find the best move
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
