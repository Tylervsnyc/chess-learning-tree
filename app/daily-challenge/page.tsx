'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import {
  playCorrectSound,
  playErrorSound,
  playMoveSound,
  playCaptureSound,
} from '@/lib/sounds';
import { useLessonProgress } from '@/hooks/useProgress';

interface ChallengePuzzle {
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

interface PuzzleResult {
  puzzle: ChallengePuzzle;
  solved: boolean;
  targetRating: number;
}

const STARTING_RATING = 400;
const RATING_INCREMENT = 100;
const MAX_LIVES = 3;
const CHALLENGE_DURATION = 5 * 60; // 5 minutes in seconds

// Get today's seed for consistent daily puzzles
function getTodaySeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

export default function DailyChallengePage() {
  const router = useRouter();
  const { recordPuzzleAttempt } = useLessonProgress();

  // Challenge state
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'playing' | 'ended'>('loading');
  const [currentPuzzle, setCurrentPuzzle] = useState<ChallengePuzzle | null>(null);
  const [currentRating, setCurrentRating] = useState(STARTING_RATING);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_DURATION);
  const [puzzleResults, setPuzzleResults] = useState<PuzzleResult[]>([]);
  const [highestRating, setHighestRating] = useState(STARTING_RATING);

  // Puzzle interaction state
  const [currentFen, setCurrentFen] = useState<string | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveStatus, setMoveStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [showingSolution, setShowingSolution] = useState(false);
  const [solutionMoveShown, setSolutionMoveShown] = useState(false);

  // Review state
  const [reviewingPuzzle, setReviewingPuzzle] = useState<PuzzleResult | null>(null);

  const seed = getTodaySeed();
  const usedPuzzleIds = puzzleResults.map(r => r.puzzle.puzzleId);

  // Fetch puzzle at current rating
  const fetchPuzzle = useCallback(async (rating: number) => {
    try {
      const exclude = usedPuzzleIds.join(',');
      const res = await fetch(
        `/api/challenge-puzzle?rating=${rating}&seed=${seed}&exclude=${exclude}`
      );
      const data = await res.json();
      if (data.puzzle) {
        setCurrentPuzzle(data.puzzle);
        setCurrentFen(data.puzzle.puzzleFen);
        setMoveIndex(0);
        setMoveStatus('playing');
        setSelectedSquare(null);
        setShowingSolution(false);
        setSolutionMoveShown(false);
      }
    } catch (error) {
      console.error('Failed to fetch puzzle:', error);
    }
  }, [seed, usedPuzzleIds]);

  // Initial load
  useEffect(() => {
    fetchPuzzle(STARTING_RATING).then(() => setGameState('ready'));
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Check for game over
  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') {
      setGameState('ended');
    }
  }, [lives, gameState]);

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

  // Square styles
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    if (solutionMoveShown && currentPuzzle) {
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
      } catch {}
    } else if (currentPuzzle && moveIndex === 0) {
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
        setCurrentFen(gameCopy.fen());
        setSelectedSquare(null);

        if (move.captured) {
          playCaptureSound();
        } else {
          playMoveSound();
        }

        const nextMoveIndex = moveIndex + 1;
        setMoveIndex(nextMoveIndex);

        if (nextMoveIndex >= currentPuzzle.solutionMoves.length) {
          setMoveStatus('correct');
          playCorrectSound(puzzleResults.length);
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

            if (oppMove && oppMove.captured) {
              playCaptureSound();
            } else {
              playMoveSound();
            }

            if (nextMoveIndex + 1 >= currentPuzzle.solutionMoves.length) {
              setMoveStatus('correct');
              playCorrectSound(puzzleResults.length);
            }
          } catch {
            setMoveStatus('correct');
            playCorrectSound(puzzleResults.length);
          }
        }, 400);

        return true;
      } else {
        setMoveStatus('wrong');
        setSelectedSquare(null);
        playErrorSound();
        return false;
      }
    } catch {
      return false;
    }
  }, [game, currentPuzzle, moveIndex, moveStatus, puzzleResults.length]);

  // Handle square click
  const onSquareClick = useCallback(
    ({ piece, square }: { piece: { pieceType: string } | null; square: string }) => {
      if (!game || moveStatus !== 'playing') return;
      const clickedSquare = square as Square;

      if (!selectedSquare) {
        const p = game.get(clickedSquare);
        if (p && p.color === game.turn()) {
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
          const p = game.get(clickedSquare);
          if (p && p.color === game.turn()) {
            setSelectedSquare(clickedSquare);
          } else {
            setSelectedSquare(null);
          }
        }
      }
    },
    [game, selectedSquare, moveStatus, tryMove]
  );

  // Handle continue after correct
  const handleCorrect = useCallback(() => {
    if (!currentPuzzle) return;

    const result: PuzzleResult = {
      puzzle: currentPuzzle,
      solved: true,
      targetRating: currentRating,
    };
    setPuzzleResults(prev => [...prev, result]);

    // Record for profile stats
    recordPuzzleAttempt(currentPuzzle.puzzleId, 'daily-challenge', true, {
      themes: currentPuzzle.themes,
      rating: currentPuzzle.rating,
      fen: currentPuzzle.puzzleFen,
      solution: currentPuzzle.solution,
    });

    const newRating = currentRating + RATING_INCREMENT;
    setCurrentRating(newRating);
    setHighestRating(Math.max(highestRating, newRating));

    fetchPuzzle(newRating);
  }, [currentPuzzle, currentRating, highestRating, fetchPuzzle, recordPuzzleAttempt]);

  // Show solution and continue
  const showSolutionAndContinue = useCallback(() => {
    if (!currentPuzzle || !currentFen) return;

    setShowingSolution(true);

    try {
      const chess = new Chess(currentPuzzle.puzzleFen);
      const firstMove = currentPuzzle.solutionMoves[0];
      if (firstMove) {
        chess.move(firstMove);
        setCurrentFen(chess.fen());
        setSolutionMoveShown(true);
      }
    } catch {}
  }, [currentPuzzle, currentFen]);

  // Handle continue after wrong (lose a life)
  const handleWrong = useCallback(() => {
    if (!currentPuzzle) return;

    const result: PuzzleResult = {
      puzzle: currentPuzzle,
      solved: false,
      targetRating: currentRating,
    };
    setPuzzleResults(prev => [...prev, result]);

    // Record for profile stats
    recordPuzzleAttempt(currentPuzzle.puzzleId, 'daily-challenge', false, {
      themes: currentPuzzle.themes,
      rating: currentPuzzle.rating,
      fen: currentPuzzle.puzzleFen,
      solution: currentPuzzle.solution,
    });

    const newLives = lives - 1;
    setLives(newLives);

    if (newLives > 0) {
      // Continue at same rating
      fetchPuzzle(currentRating);
    }
  }, [currentPuzzle, currentRating, lives, fetchPuzzle, recordPuzzleAttempt]);

  // Start the challenge
  const startChallenge = () => {
    setGameState('playing');
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Review a puzzle
  const reviewPuzzle = (result: PuzzleResult) => {
    setReviewingPuzzle(result);
  };

  // Render lives as hearts
  const renderLives = () => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: MAX_LIVES }).map((_, i) => (
          <span
            key={i}
            className={`text-2xl ${i < lives ? 'text-red-500' : 'text-gray-600'}`}
          >
            {i < lives ? '♥' : '♡'}
          </span>
        ))}
      </div>
    );
  };

  // Ready screen
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-[#131F24] text-white flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-3xl font-bold">Daily Challenge</h1>
          <p className="text-gray-400 max-w-md">
            Solve as many puzzles as you can in 5 minutes. Each correct answer increases
            the difficulty. You have 3 lives - lose them all and the challenge ends!
          </p>

          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-4xl mb-2">⏱️</div>
              <div className="text-gray-400">5 Minutes</div>
            </div>
            <div>
              <div className="text-4xl mb-2">♥♥♥</div>
              <div className="text-gray-400">3 Lives</div>
            </div>
            <div>
              <div className="text-4xl mb-2">📈</div>
              <div className="text-gray-400">Rising Difficulty</div>
            </div>
          </div>

          <button
            onClick={startChallenge}
            className="px-8 py-4 bg-[#58CC02] text-white font-bold rounded-xl text-xl shadow-[0_4px_0_#3d8c01] hover:shadow-[0_2px_0_#3d8c01] hover:translate-y-[2px] transition-all"
          >
            Start Challenge
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (gameState === 'loading' || !currentPuzzle) {
    return (
      <div className="min-h-screen bg-[#131F24] text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // End screen with review
  if (gameState === 'ended') {
    const solvedCount = puzzleResults.filter(r => r.solved).length;

    // If reviewing a specific puzzle
    if (reviewingPuzzle) {
      return (
        <div className="min-h-screen bg-[#131F24] text-white">
          <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <button
                onClick={() => setReviewingPuzzle(null)}
                className="text-gray-400 hover:text-white"
              >
                &larr; Back to Results
              </button>
              <div className="text-gray-400">
                Rating: {reviewingPuzzle.puzzle.rating}
              </div>
              <div className={reviewingPuzzle.solved ? 'text-green-400' : 'text-red-400'}>
                {reviewingPuzzle.solved ? '✓ Solved' : '✗ Missed'}
              </div>
            </div>
          </div>

          <div className="max-w-lg mx-auto px-4 py-6">
            <div className="mb-4">
              <Chessboard
                options={{
                  position: reviewingPuzzle.puzzle.puzzleFen,
                  boardOrientation: reviewingPuzzle.puzzle.playerColor,
                  boardStyle: {
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  },
                  darkSquareStyle: { backgroundColor: '#779952' },
                  lightSquareStyle: { backgroundColor: '#edeed1' },
                }}
              />
            </div>

            <div className="bg-[#1A2C35] rounded-xl p-4 space-y-3">
              <div>
                <div className="text-gray-400 text-sm">Solution</div>
                <div className="text-white font-mono">{reviewingPuzzle.puzzle.solution}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Themes</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {reviewingPuzzle.puzzle.themes.map(theme => (
                    <span
                      key={theme}
                      className="px-2 py-1 bg-[#131F24] rounded text-sm text-gray-300"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href={reviewingPuzzle.puzzle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-400 hover:text-blue-300 text-sm"
              >
                View on Lichess →
              </a>
            </div>
          </div>
        </div>
      );
    }

    // Results overview
    return (
      <div className="min-h-screen bg-[#131F24] text-white">
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white"
            >
              &larr; Home
            </button>
            <h1 className="text-xl font-bold">Challenge Complete</h1>
            <div className="w-16" />
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Stats */}
          <div className="text-center space-y-2">
            <div className="text-5xl font-bold text-[#58CC02]">{solvedCount}</div>
            <div className="text-gray-400">Puzzles Solved</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{highestRating}</div>
              <div className="text-sm text-gray-400">Highest Rating</div>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">
                {puzzleResults.length > 0
                  ? Math.round((solvedCount / puzzleResults.length) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
          </div>

          {/* Puzzle list */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Puzzles</h2>
            <div className="space-y-2">
              {puzzleResults.map((result, index) => (
                <button
                  key={result.puzzle.puzzleId}
                  onClick={() => reviewPuzzle(result)}
                  className="w-full flex items-center justify-between p-3 bg-[#1A2C35] rounded-xl hover:bg-[#2A3C45] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">#{index + 1}</span>
                    <span className={result.solved ? 'text-green-400' : 'text-red-400'}>
                      {result.solved ? '✓' : '✗'}
                    </span>
                    <span className="text-gray-300">Rating {result.puzzle.rating}</span>
                  </div>
                  <span className="text-gray-500">→</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full py-4 bg-[#58CC02] text-white font-bold rounded-xl text-lg shadow-[0_4px_0_#3d8c01] hover:shadow-[0_2px_0_#3d8c01] hover:translate-y-[2px] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#f5f5f5] border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          {/* Top row: Difficulty, Timer, End */}
          <div className="flex items-center justify-between mb-3">
            {/* Difficulty + Rating + Bonus */}
            <div className="flex items-center gap-3">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Difficulty</div>
                <div className="text-gray-900 font-bold">{currentRating >= 1600 ? 'Master' : currentRating >= 1200 ? 'Advanced' : currentRating >= 800 ? 'Intermediate' : 'Beginner'} <span className="font-normal">{currentRating}</span></div>
              </div>
              {moveStatus === 'correct' && (
                <div className="bg-[#f6b26b] text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <span>🔥</span> +100!
                </div>
              )}
            </div>

            {/* Lives */}
            <div className="flex items-center gap-1">
              {renderLives()}
            </div>

            {/* Timer + End */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full ${timeLeft <= 30 ? 'text-red-500' : 'text-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
                <span className="text-xl font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={() => setGameState('ended')}
                className="bg-[#c94a4a] hover:bg-[#b43e3e] text-white font-semibold px-4 py-2 rounded-full transition-colors"
              >
                End
              </button>
            </div>
          </div>

          {/* Progress squares */}
          <div className="flex gap-1 flex-wrap">
            {puzzleResults.map((result, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded flex items-center justify-center text-sm font-semibold ${
                  result.solved
                    ? 'bg-[#7cb342] text-white'
                    : 'bg-[#c94a4a] text-white'
                }`}
              >
                {index + 1}
              </div>
            ))}
            {/* Current puzzle */}
            <div className="w-8 h-8 rounded flex items-center justify-center text-sm font-semibold bg-[#c8e6c9] text-[#558b2f] border-2 border-[#7cb342]">
              {puzzleResults.length + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Turn indicator */}
        <div className="text-center mb-4">
          <span className={`text-xl font-bold ${
            currentPuzzle.playerColor === 'white' ? 'text-white' : 'text-gray-300'
          }`}>
            {currentPuzzle.playerColor === 'white' ? 'White' : 'Black'} to move
          </span>
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
                onClick={handleCorrect}
                className="w-full py-4 bg-[#58CC02] text-white font-bold rounded-xl text-lg shadow-[0_4px_0_#3d8c01] hover:shadow-[0_2px_0_#3d8c01] hover:translate-y-[2px] transition-all"
              >
                Next Puzzle
              </button>
            </div>
          )}

          {moveStatus === 'wrong' && !showingSolution && (
            <div className="space-y-4">
              <div className="p-4 bg-red-600/20 border border-red-500 rounded-xl text-center">
                <div className="text-2xl mb-1">✗</div>
                <div className="text-red-400 font-bold text-lg">Incorrect</div>
                <div className="text-gray-400 text-sm mt-1">-1 Life</div>
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
                onClick={handleWrong}
                className="w-full py-4 bg-[#1A2C35] text-white font-bold rounded-xl text-lg border border-white/20 hover:bg-[#2A3C45] transition-all"
              >
                {lives > 1 ? 'Continue' : 'End Challenge'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
