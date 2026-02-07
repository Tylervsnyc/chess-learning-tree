'use client';

import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { LEVEL_SKIP_QUIZ } from '@/types/permissions';
import { BOARD_COLORS } from '@/lib/puzzle-utils';

interface QuizPuzzle {
  id: string;
  fen: string;
  moves: string[];
  rating: number;
  theme: string;
}

interface LevelSkipQuizProps {
  targetLevel: 2 | 3;
  onPass: () => void;
  onFail: () => void;
  onCancel: () => void;
}

type QuizState = 'loading' | 'playing' | 'passed' | 'failed';

export default function LevelSkipQuiz({
  targetLevel,
  onPass,
  onFail,
  onCancel,
}: LevelSkipQuizProps) {
  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [puzzles, setPuzzles] = useState<QuizPuzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [chess, setChess] = useState<Chess | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const { questionsCount, maxWrongAnswers, passingScore } = LEVEL_SKIP_QUIZ;

  // Fetch puzzles for the quiz
  useEffect(() => {
    async function fetchPuzzles() {
      try {
        // Get a mix of themes for the quiz
        const themes = ['fork', 'pin', 'checkmate', 'discoveredAttack', 'skewer'];
        const puzzlesPerTheme = Math.ceil(questionsCount / themes.length);
        const allPuzzles: QuizPuzzle[] = [];

        for (const theme of themes) {
          const res = await fetch(
            `/api/puzzles/clean?level=${targetLevel}&theme=${theme}&limit=${puzzlesPerTheme}`
          );
          if (res.ok) {
            const data = await res.json();
            allPuzzles.push(...data.puzzles);
          }
        }

        // Shuffle and take the required number
        const shuffled = allPuzzles.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, questionsCount);

        if (selected.length < questionsCount) {
          console.warn(`Only found ${selected.length} puzzles, needed ${questionsCount}`);
        }

        setPuzzles(selected);
        setQuizState('playing');
      } catch (error) {
        console.error('Error fetching quiz puzzles:', error);
      }
    }

    fetchPuzzles();
  }, [targetLevel, questionsCount]);

  // Set up current puzzle
  useEffect(() => {
    if (puzzles.length === 0 || currentIndex >= puzzles.length) return;

    const puzzle = puzzles[currentIndex];
    const newChess = new Chess(puzzle.fen);

    // Apply the setup move (opponent's move)
    if (puzzle.moves.length > 0) {
      const setupMove = puzzle.moves[0];
      newChess.move({
        from: setupMove.slice(0, 2),
        to: setupMove.slice(2, 4),
        promotion: setupMove.length > 4 ? setupMove[4] as 'q' | 'r' | 'b' | 'n' : undefined,
      });
    }

    setChess(newChess);
    setMoveIndex(1); // Start at move 1 (first player move)
    setFeedback(null);
  }, [currentIndex, puzzles]);

  const currentPuzzle = puzzles[currentIndex];
  const playerColor = chess?.turn() === 'w' ? 'white' : 'black';

  const handleMove = ({ sourceSquare, targetSquare }: { piece: unknown; sourceSquare: string; targetSquare: string | null }): boolean => {
    if (!chess || !currentPuzzle || feedback || !targetSquare) return false;

    const expectedMove = currentPuzzle.moves[moveIndex];
    const attemptedMove = sourceSquare + targetSquare;

    // Check if this is the correct move (simplified - just checking from/to)
    const isCorrect = expectedMove?.startsWith(attemptedMove);

    if (isCorrect) {
      // Make the move
      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Auto-promote to queen
      });

      if (move) {
        // Check if puzzle is complete
        if (moveIndex >= currentPuzzle.moves.length - 1) {
          // Puzzle complete!
          handlePuzzleComplete(true);
        } else {
          // Make opponent's response
          const opponentMove = currentPuzzle.moves[moveIndex + 1];
          if (opponentMove) {
            setTimeout(() => {
              chess.move({
                from: opponentMove.slice(0, 2),
                to: opponentMove.slice(2, 4),
                promotion: opponentMove.length > 4 ? opponentMove[4] as 'q' | 'r' | 'b' | 'n' : undefined,
              });
              setMoveIndex(moveIndex + 2);
              setChess(new Chess(chess.fen()));
            }, 300);
          }
        }
        return true;
      }
    } else {
      // Wrong move
      handlePuzzleComplete(false);
    }

    return false;
  };

  const handlePuzzleComplete = (wasCorrect: boolean) => {
    setFeedback(wasCorrect ? 'correct' : 'wrong');

    const newCorrect = wasCorrect ? correctCount + 1 : correctCount;
    const newWrong = wasCorrect ? wrongCount : wrongCount + 1;

    setCorrectCount(newCorrect);
    setWrongCount(newWrong);

    // Check for early termination
    setTimeout(() => {
      if (newWrong > maxWrongAnswers) {
        setQuizState('failed');
      } else if (newCorrect >= passingScore) {
        setQuizState('passed');
      } else if (currentIndex + 1 >= puzzles.length) {
        // All puzzles done
        if (newCorrect >= passingScore) {
          setQuizState('passed');
        } else {
          setQuizState('failed');
        }
      } else {
        // Next puzzle
        setCurrentIndex(currentIndex + 1);
      }
    }, 1000);
  };

  // Render based on state
  if (quizState === 'loading') {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white/60">Loading quiz puzzles...</p>
        </div>
      </div>
    );
  }

  if (quizState === 'passed') {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-black text-[#58CC02] mb-2">You Passed!</h1>
          <p className="text-white/60 mb-6">
            {correctCount}/{questionsCount} correct. You're ready for Level {targetLevel}!
          </p>
          <button
            onClick={onPass}
            className="px-8 py-3 bg-[#58CC02] text-white font-bold rounded-xl hover:bg-[#4CAF00] transition-colors"
          >
            Start Level {targetLevel}
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'failed') {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😅</div>
          <h1 className="text-3xl font-black text-[#FF4B4B] mb-2">Not Quite</h1>
          <p className="text-white/60 mb-6">
            {correctCount}/{questionsCount} correct ({wrongCount} wrong).
            Let's build up those skills first!
          </p>
          <button
            onClick={onFail}
            className="px-8 py-3 bg-[#1CB0F6] text-white font-bold rounded-xl hover:bg-[#1A9FE0] transition-colors"
          >
            Continue Current Level
          </button>
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-white/60 hover:text-white text-xl"
          >
            ✕
          </button>
          <div className="text-center">
            <div className="text-sm text-white/50">Level {targetLevel} Skip Quiz</div>
            <div className="text-xs text-white/30">
              {correctCount} correct • {wrongCount}/{maxWrongAnswers + 1} wrong allowed
            </div>
          </div>
          <div className="text-white/60">
            {currentIndex + 1}/{questionsCount}
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-lg mx-auto mt-2">
          <div className="h-2 bg-[#0D1A1F] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questionsCount) * 100}%`,
                background: `linear-gradient(90deg, #58CC02 ${(correctCount / (currentIndex + 1)) * 100}%, #FF4B4B ${(correctCount / (currentIndex + 1)) * 100}%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Puzzle */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Turn indicator */}
          <div className="text-center mb-2">
            <span className={`text-sm px-3 py-1 rounded-full ${
              playerColor === 'white' ? 'bg-white text-black' : 'bg-gray-800 text-white'
            }`}>
              Play as {playerColor}
            </span>
          </div>

          {/* Board */}
          <div className={`relative rounded-xl overflow-hidden ${feedback ? 'pointer-events-none' : ''}`}>
            {chess && (
              <Chessboard
                options={{
                  position: chess.fen(),
                  onPieceDrop: handleMove,
                  boardOrientation: playerColor as 'white' | 'black',
                  boardStyle: { borderRadius: '12px' },
                  darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
                  lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
                }}
              />
            )}

            {/* Feedback overlay */}
            {feedback && (
              <div className={`absolute inset-0 flex items-center justify-center ${
                feedback === 'correct' ? 'bg-[#58CC02]/80' : 'bg-[#FF4B4B]/80'
              }`}>
                <div className="text-white text-4xl font-black">
                  {feedback === 'correct' ? '✓' : '✗'}
                </div>
              </div>
            )}
          </div>

          {/* Theme hint */}
          {currentPuzzle && (
            <div className="text-center mt-3 text-white/40 text-sm">
              Theme: {currentPuzzle.theme}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
