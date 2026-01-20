'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { useLessonProgress } from '@/hooks/useProgress';
import {
  playCorrectSound,
  playErrorSound,
  playCelebrationSound,
  playMoveSound,
  playCaptureSound,
} from '@/lib/sounds';

// CSS for streak animations
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

// Supernova Gentle streak effect
function getStreakStyle(streak: number, hadWrongAnswer: boolean): React.CSSProperties {
  if (hadWrongAnswer || streak < 2) {
    return {
      background: '#58CC02',
      backgroundSize: 'auto',
      animation: 'none',
      boxShadow: 'none',
    };
  }
  const intensity = Math.min(streak / 6, 1);
  return {
    background: `
      radial-gradient(ellipse at center,
        rgba(255, 255, 255, ${0.3 + intensity * 0.7}) 0%,
        rgba(255, 220, 240, ${0.2 + intensity * 0.4}) 20%,
        transparent 50%),
      linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
    `,
    backgroundSize: '100% 100%, 300% 100%',
    animation: `rainbowFlow ${3 - streak * 0.2}s linear infinite${streak >= 4 ? `, shake 0.4s infinite` : ''}`,
    boxShadow: `
      0 0 ${streak * 5}px rgba(255, 200, 220, ${0.4 + intensity * 0.4}),
      0 0 ${streak * 10}px rgba(255, 150, 200, 0.4)
    `,
  };
}

interface LessonPuzzle {
  puzzleId: string;
  fen: string;
  puzzleFen: string;
  moves: string;
  rating: number;
  themes: string[];
  url: string;
  setupMove: string;
  lastMoveFrom: string;
  lastMoveTo: string;
  solution: string;
  solutionMoves: string[];
  playerColor: 'white' | 'black';
}

type PuzzleResult = 'pending' | 'correct' | 'wrong';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const { completeLesson, recordPuzzleAttempt } = useLessonProgress();

  // Lesson state
  const [lessonName, setLessonName] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [puzzles, setPuzzles] = useState<LessonPuzzle[]>([]);
  const [loading, setLoading] = useState(true);

  // Progress state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Record<string, PuzzleResult>>({});
  const [retryQueue, setRetryQueue] = useState<LessonPuzzle[]>([]);
  const [inRetryMode, setInRetryMode] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  // Puzzle interaction state
  const [currentFen, setCurrentFen] = useState<string | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveStatus, setMoveStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [showingSolution, setShowingSolution] = useState(false);
  const [solutionMoveShown, setSolutionMoveShown] = useState(false);

  // Streak tracking for progress bar effect
  const [streak, setStreak] = useState(0);
  const [hadWrongAnswer, setHadWrongAnswer] = useState(false);
  const [completedPuzzleCount, setCompletedPuzzleCount] = useState(0);

  // Flagged puzzles tracking
  const [flaggedPuzzles, setFlaggedPuzzles] = useState<Set<string>>(new Set());

  // Load flagged puzzles from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('flagged-puzzles');
      if (stored) {
        setFlaggedPuzzles(new Set(JSON.parse(stored)));
      }
    } catch {
      // Ignore errors
    }
  }, []);

  // Flag/unflag a puzzle
  const toggleFlag = useCallback((puzzleId: string) => {
    setFlaggedPuzzles(prev => {
      const next = new Set(prev);
      if (next.has(puzzleId)) {
        next.delete(puzzleId);
      } else {
        next.add(puzzleId);
      }
      localStorage.setItem('flagged-puzzles', JSON.stringify([...next]));
      return next;
    });
  }, []);

  // Current puzzle (from main list or retry queue)
  const currentPuzzle = inRetryMode
    ? retryQueue[currentIndex]
    : puzzles[currentIndex];

  const totalPuzzles = inRetryMode ? retryQueue.length : puzzles.length;

  // Load lesson puzzles
  useEffect(() => {
    async function loadLesson() {
      setLoading(true);
      try {
        const res = await fetch(`/api/lesson-puzzles?lessonId=${lessonId}&count=6`);
        const data = await res.json();
        if (data.puzzles) {
          setPuzzles(data.puzzles);
          setLessonName(data.lessonName);
          setLessonDescription(data.lessonDescription);
          // Initialize results
          const initialResults: Record<string, PuzzleResult> = {};
          data.puzzles.forEach((p: LessonPuzzle) => {
            initialResults[p.puzzleId] = 'pending';
          });
          setResults(initialResults);
        }
      } catch (error) {
        console.error('Failed to load lesson:', error);
      }
      setLoading(false);
    }
    loadLesson();
  }, [lessonId]);

  // Reset puzzle state when current puzzle changes
  useEffect(() => {
    if (currentPuzzle) {
      setCurrentFen(currentPuzzle.puzzleFen);
      setMoveIndex(0);
      setMoveStatus('playing');
      setSelectedSquare(null);
      setShowingSolution(false);
      setSolutionMoveShown(false);
    }
  }, [currentPuzzle]);

  // Chess game for current position
  const game = useMemo(() => {
    const fen = currentFen || currentPuzzle?.puzzleFen;
    if (!fen) return null;
    try {
      return new Chess(fen);
    } catch {
      return null;
    }
  }, [currentFen, currentPuzzle]);

  // Square styles (last move highlight + selected piece + solution highlight)
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // When showing solution, highlight the move that was played
    if (solutionMoveShown && currentPuzzle) {
      // Get the first move's from/to squares
      try {
        const chess = new Chess(currentPuzzle.puzzleFen);
        const firstMove = currentPuzzle.solutionMoves[0];
        if (firstMove) {
          const move = chess.move(firstMove);
          if (move) {
            styles[move.from] = { backgroundColor: 'rgba(88, 204, 2, 0.5)' };
            styles[move.to] = { backgroundColor: 'rgba(88, 204, 2, 0.6)' };
          }
        }
      } catch {
        // Ignore errors
      }
    } else if (currentPuzzle && moveIndex === 0) {
      // Show last move highlight only at start
      styles[currentPuzzle.lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
      styles[currentPuzzle.lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
    }

    if (selectedSquare && game) {
      styles[selectedSquare] = { backgroundColor: 'rgba(100, 200, 255, 0.6)' };
      const moves = game.moves({ square: selectedSquare, verbose: true });
      for (const move of moves) {
        styles[move.to] = {
          background: move.captured
            ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
            : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
        };
      }
    }

    return styles;
  }, [selectedSquare, game, currentPuzzle, moveIndex, solutionMoveShown]);

  // Try to make a move
  const tryMove = useCallback((from: Square, to: Square) => {
    if (!game || !currentPuzzle || moveStatus !== 'playing') return false;

    if (moveIndex >= currentPuzzle.solutionMoves.length) return false;

    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (!move) return false;

      const expectedMove = currentPuzzle.solutionMoves[moveIndex];

      if (move.san === expectedMove) {
        // Correct move
        setCurrentFen(gameCopy.fen());
        setSelectedSquare(null);

        // Play move or capture sound based on whether piece was captured
        if (move.captured) {
          playCaptureSound();
        } else {
          playMoveSound();
        }

        const nextMoveIndex = moveIndex + 1;
        setMoveIndex(nextMoveIndex);

        if (nextMoveIndex >= currentPuzzle.solutionMoves.length) {
          // Puzzle complete!
          setMoveStatus('correct');
          playCorrectSound(completedPuzzleCount);
          setStreak(s => s + 1);
          setCompletedPuzzleCount(c => c + 1);
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

            // Play move or capture sound for opponent
            if (oppMove && oppMove.captured) {
              playCaptureSound();
            } else {
              playMoveSound();
            }

            if (nextMoveIndex + 1 >= currentPuzzle.solutionMoves.length) {
              setMoveStatus('correct');
              playCorrectSound(completedPuzzleCount);
              setStreak(s => s + 1);
              setCompletedPuzzleCount(c => c + 1);
            }
          } catch {
            setMoveStatus('correct');
            playCorrectSound(completedPuzzleCount);
            setStreak(s => s + 1);
            setCompletedPuzzleCount(c => c + 1);
          }
        }, 400);

        return true;
      } else {
        // Wrong move
        setMoveStatus('wrong');
        setSelectedSquare(null);
        playErrorSound();
        setStreak(0);
        setHadWrongAnswer(true);
        return false;
      }
    } catch {
      return false;
    }
  }, [game, currentPuzzle, moveIndex, moveStatus]);

  // Handle square click
  const onSquareClick = useCallback(
    ({ square }: { piece: { pieceType: string } | null; square: string }) => {
      if (!game || moveStatus !== 'playing') return;
      const clickedSquare = square as Square;

      if (!selectedSquare) {
        const piece = game.get(clickedSquare);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(clickedSquare);
        }
      } else if (selectedSquare === clickedSquare) {
        setSelectedSquare(null);
      } else {
        const legalMoves = game.moves({ square: selectedSquare, verbose: true });
        const isLegalMove = legalMoves.some(m => m.to === clickedSquare);

        if (isLegalMove) {
          tryMove(selectedSquare, clickedSquare);
        } else {
          const piece = game.get(clickedSquare);
          if (piece && piece.color === game.turn()) {
            setSelectedSquare(clickedSquare);
          } else {
            setSelectedSquare(null);
          }
        }
      }
    },
    [game, selectedSquare, moveStatus, tryMove]
  );

  // Record result and advance
  const recordAndAdvance = useCallback((result: 'correct' | 'wrong') => {
    if (!currentPuzzle) return;

    // Update results
    setResults(prev => ({ ...prev, [currentPuzzle.puzzleId]: result }));

    // Record puzzle attempt for stats (with theme data for profile)
    recordPuzzleAttempt(currentPuzzle.puzzleId, lessonId, result === 'correct', {
      themes: currentPuzzle.themes,
      rating: currentPuzzle.rating,
      fen: currentPuzzle.puzzleFen,
      solution: currentPuzzle.solution,
    });

    // Check if this is end of current set
    if (currentIndex >= totalPuzzles - 1) {
      if (inRetryMode) {
        // Check if any retries were wrong
        const stillWrong = retryQueue.filter(p =>
          results[p.puzzleId] === 'wrong' || (p.puzzleId === currentPuzzle.puzzleId && result === 'wrong')
        );

        if (stillWrong.length > 0 || result === 'wrong') {
          // Need to retry the ones that are still wrong
          const newRetryQueue = result === 'wrong'
            ? [currentPuzzle]
            : [];
          setRetryQueue(newRetryQueue);
          setCurrentIndex(0);

          if (newRetryQueue.length === 0) {
            // All done!
            setLessonComplete(true);
            completeLesson(lessonId);
            playCelebrationSound();
          }
        } else {
          // All retries passed!
          setLessonComplete(true);
          completeLesson(lessonId);
          playCelebrationSound();
        }
      } else {
        // End of main puzzles - check for wrong answers
        const wrongPuzzles = puzzles.filter(p =>
          results[p.puzzleId] === 'wrong' || (p.puzzleId === currentPuzzle.puzzleId && result === 'wrong')
        );

        if (wrongPuzzles.length > 0 || result === 'wrong') {
          // Enter retry mode
          const toRetry = result === 'wrong'
            ? [...wrongPuzzles.filter(p => p.puzzleId !== currentPuzzle.puzzleId), currentPuzzle]
            : wrongPuzzles;
          setRetryQueue(toRetry);
          setInRetryMode(true);
          setCurrentIndex(0);
        } else {
          // Perfect score!
          setLessonComplete(true);
          completeLesson(lessonId);
          playCelebrationSound();
        }
      }
    } else {
      // Move to next puzzle
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentPuzzle, currentIndex, totalPuzzles, inRetryMode, retryQueue, puzzles, results, completeLesson, recordPuzzleAttempt, lessonId]);

  // Handle continue after correct/wrong
  const handleContinue = useCallback(() => {
    if (moveStatus === 'correct') {
      recordAndAdvance('correct');
    } else if (moveStatus === 'wrong') {
      recordAndAdvance('wrong');
    }
  }, [moveStatus, recordAndAdvance]);

  // Show solution by playing the first move on the board
  const showSolutionAndContinue = useCallback(() => {
    if (!currentPuzzle || !currentFen) return;

    setShowingSolution(true);

    // Play the first solution move on the board
    try {
      const chess = new Chess(currentPuzzle.puzzleFen);
      const firstMove = currentPuzzle.solutionMoves[0];
      if (firstMove) {
        chess.move(firstMove);
        setCurrentFen(chess.fen());
        setSolutionMoveShown(true);
      }
    } catch {
      // If move fails, just show notation
    }
  }, [currentPuzzle, currentFen]);

  // Progress stats
  const correctCount = Object.values(results).filter(r => r === 'correct').length;
  const wrongCount = Object.values(results).filter(r => r === 'wrong').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131F24] text-white flex items-center justify-center">
        <div className="text-xl">Loading lesson...</div>
      </div>
    );
  }

  if (lessonComplete) {
    return (
      <div className="min-h-screen bg-[#131F24] text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl font-bold text-[#58CC02]">Lesson Complete!</h1>
          <p className="text-xl text-gray-300">{lessonName}</p>
          <div className="text-lg">
            <span className="text-green-400">{correctCount} correct</span>
            {wrongCount > 0 && (
              <span className="text-gray-400"> (retried {wrongCount})</span>
            )}
          </div>
          <button
            onClick={() => router.push('/')}
            className="mt-8 px-8 py-4 bg-[#58CC02] text-white font-bold rounded-xl text-xl shadow-[0_4px_0_#3d8c01] hover:shadow-[0_2px_0_#3d8c01] hover:translate-y-[2px] transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (!currentPuzzle) {
    return (
      <div className="min-h-screen bg-[#131F24] text-white flex items-center justify-center">
        <div className="text-xl">No puzzles found for this lesson.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      <style>{streakStyles}</style>
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>

          {/* Progress bar with streak effect */}
          <div className="flex-1 mx-4">
            <div className="h-3 bg-[#131F24] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + (moveStatus === 'correct' ? 1 : 0)) / totalPuzzles) * 100}%`,
                  ...getStreakStyle(streak, hadWrongAnswer),
                }}
              />
            </div>
          </div>

          <div className="text-gray-400">
            {currentIndex + 1}/{totalPuzzles}
            {inRetryMode && <span className="text-yellow-400 ml-2">(retry)</span>}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Lesson info */}
        <div className="text-center mb-4">
          <h1 className="text-lg font-semibold text-gray-300">{lessonName}</h1>
          {inRetryMode && (
            <p className="text-yellow-400 text-sm mt-1">
              Let&apos;s try {retryQueue.length === 1 ? 'that one' : 'those'} again
            </p>
          )}
        </div>

        {/* Turn indicator + Flag button */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className={`text-xl font-bold ${
            currentPuzzle.playerColor === 'white' ? 'text-white' : 'text-gray-300'
          }`}>
            {currentPuzzle.playerColor === 'white' ? 'White' : 'Black'} to move
          </span>
          <button
            onClick={() => toggleFlag(currentPuzzle.puzzleId)}
            className={`p-1.5 rounded transition-colors ${
              flaggedPuzzles.has(currentPuzzle.puzzleId)
                ? 'text-red-500 bg-red-500/20'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/10'
            }`}
            title={flaggedPuzzles.has(currentPuzzle.puzzleId) ? 'Unflag puzzle' : 'Flag puzzle as problematic'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Chessboard */}
        <div className="mb-4">
          <Chessboard
            options={{
              position: currentFen || currentPuzzle.puzzleFen,
              boardOrientation: currentPuzzle.playerColor,
              onSquareClick: onSquareClick,
              squareStyles: squareStyles,
              boardStyle: {
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              },
              darkSquareStyle: { backgroundColor: '#779952' },
              lightSquareStyle: { backgroundColor: '#edeed1' },
            }}
          />
        </div>

        {/* Feedback area */}
        <div className="mt-6">
          {moveStatus === 'playing' && (
            <div className="text-center text-gray-400">
              Find the best move
            </div>
          )}

          {moveStatus === 'correct' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-600/20 border border-green-500 rounded-xl text-center">
                <div className="text-2xl mb-1">✓</div>
                <div className="text-green-400 font-bold text-lg">Correct!</div>
              </div>
              <button
                onClick={handleContinue}
                className="w-full py-4 bg-[#58CC02] text-white font-bold rounded-xl text-lg shadow-[0_4px_0_#3d8c01] hover:shadow-[0_2px_0_#3d8c01] hover:translate-y-[2px] transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {moveStatus === 'wrong' && !showingSolution && (
            <div className="space-y-4">
              <div className="p-4 bg-red-600/20 border border-red-500 rounded-xl text-center">
                <div className="text-2xl mb-1">✗</div>
                <div className="text-red-400 font-bold text-lg">Incorrect</div>
              </div>
              <button
                onClick={showSolutionAndContinue}
                className="w-full py-4 bg-[#FF4B4B] text-white font-bold rounded-xl text-lg shadow-[0_4px_0_#cc2929] hover:shadow-[0_2px_0_#cc2929] hover:translate-y-[2px] transition-all"
              >
                Show Solution
              </button>
            </div>
          )}

          {moveStatus === 'wrong' && showingSolution && (
            <div className="space-y-4">
              <div className="p-4 bg-[#1A2C35] border border-green-500/50 rounded-xl">
                <div className="text-green-400 font-medium mb-1">
                  The correct move: {currentPuzzle.solutionMoves[0]}
                </div>
                <div className="text-gray-400 text-sm">
                  Look at the highlighted squares on the board
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="w-full py-4 bg-[#1A2C35] text-white font-bold rounded-xl text-lg border border-white/20 hover:bg-[#2A3C45] transition-all"
              >
                Got it
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
