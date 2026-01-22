'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';
import { ThemeHelpModal, HelpIconButton } from '@/components/puzzle/ThemeHelpModal';
import { getThemeExplanation } from '@/data/theme-explanations';

interface Puzzle {
  puzzleId: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
  gameUrl: string;
}

const TOTAL_TIME = 5 * 60 * 1000; // 5 minutes in ms
const MAX_LIVES = 3;

export default function DailyChallengePage() {
  const router = useRouter();
  const { user, profile } = useUser();

  // Game state
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [game, setGame] = useState<Chess | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<'loading' | 'playing' | 'correct' | 'incorrect'>('loading');

  // Challenge stats
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);

  // Subscription state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [dailyPuzzlesUsed, setDailyPuzzlesUsed] = useState(0);

  // Help modal state
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const userRating = profile?.elo_rating || 800;

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 100) {
            setGameState('finished');
            return 0;
          }
          return prev - 100;
        });
      }, 100);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameState, timeLeft]);

  // Fetch a new puzzle
  const fetchPuzzle = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch(`/api/puzzles?userRating=${userRating}`);

      // Handle rate limit (429)
      if (res.status === 429) {
        const data = await res.json();
        if (data.upgradeRequired) {
          setDailyPuzzlesUsed(data.dailyPuzzlesUsed || 15);
          setShowUpgradeModal(true);
          setGameState('finished');
          if (timerRef.current) clearInterval(timerRef.current);
          return;
        }
      }

      const data = await res.json();

      if (data.puzzle) {
        setPuzzle(data.puzzle);

        // Initialize chess game with puzzle position
        const chess = new Chess(data.puzzle.fen);

        // Play opponent's move (first move in the array)
        if (data.puzzle.moves.length > 0) {
          const opponentMove = data.puzzle.moves[0];
          chess.move({
            from: opponentMove.slice(0, 2),
            to: opponentMove.slice(2, 4),
            promotion: opponentMove.length > 4 ? opponentMove[4] : undefined,
          });
        }

        setGame(chess);
        setMoveIndex(1);
        setStatus('playing');
      }
    } catch (error) {
      console.error('Failed to fetch puzzle:', error);
    }
  }, [userRating]);

  // Start the challenge
  const startChallenge = () => {
    setGameState('playing');
    setLives(MAX_LIVES);
    setScore(0);
    setStreak(0);
    setTimeLeft(TOTAL_TIME);
    setPuzzlesSolved(0);
    fetchPuzzle();
  };

  // Handle correct answer
  const handleCorrect = () => {
    const streakBonus = Math.floor(streak / 3) * 10;
    const newScore = score + 100 + streakBonus;
    setScore(newScore);
    setStreak(prev => prev + 1);
    setPuzzlesSolved(prev => prev + 1);
    setStatus('correct');

    // Load next puzzle after brief delay
    setTimeout(() => {
      fetchPuzzle();
    }, 800);
  };

  // Handle incorrect answer
  const handleIncorrect = () => {
    const newLives = lives - 1;
    setLives(newLives);
    setStreak(0);
    setStatus('incorrect');

    if (newLives <= 0) {
      setGameState('finished');
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      // Load next puzzle after brief delay
      setTimeout(() => {
        fetchPuzzle();
      }, 1200);
    }
  };

  // Record result to Supabase
  const recordResult = async () => {
    if (!user) return;

    const supabase = createClient();
    try {
      await supabase.from('daily_challenge_results').insert({
        user_id: user.id,
        score,
        puzzles_solved: puzzlesSolved,
        time_used_ms: TOTAL_TIME - timeLeft,
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Failed to record result:', error);
    }
  };

  // Record when finished
  useEffect(() => {
    if (gameState === 'finished' && user) {
      recordResult();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // Handle piece drop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onDrop({ sourceSquare, targetSquare, piece }: any) {
    if (!targetSquare || !game || !puzzle || status !== 'playing' || gameState !== 'playing') return false;

    const expectedMove = puzzle.moves[moveIndex];
    if (!expectedMove) return false;

    const moveStr = sourceSquare + targetSquare;
    const expectedMoveBase = expectedMove.slice(0, 4);

    // Handle promotion
    let promotion: 'q' | 'r' | 'b' | 'n' | undefined;
    if (expectedMove.length > 4) {
      promotion = expectedMove[4] as 'q' | 'r' | 'b' | 'n';
    } else if (piece[1] === 'P' && (targetSquare[1] === '8' || targetSquare[1] === '1')) {
      promotion = 'q';
    }

    // Check if move matches expected
    if (moveStr !== expectedMoveBase) {
      handleIncorrect();
      return false;
    }

    // Make the move
    try {
      const newGame = new Chess(game.fen());
      newGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion,
      });
      setGame(newGame);

      // Check if puzzle complete
      if (moveIndex >= puzzle.moves.length - 1) {
        handleCorrect();
        return true;
      }

      // Play opponent's response
      const nextMove = puzzle.moves[moveIndex + 1];
      if (nextMove) {
        setTimeout(() => {
          const responseGame = new Chess(newGame.fen());
          responseGame.move({
            from: nextMove.slice(0, 2),
            to: nextMove.slice(2, 4),
            promotion: nextMove.length > 4 ? nextMove[4] as 'q' | 'r' | 'b' | 'n' : undefined,
          });
          setGame(responseGame);
          setMoveIndex(prev => prev + 2);
        }, 300);
      } else {
        setMoveIndex(prev => prev + 1);
      }

      return true;
    } catch {
      return false;
    }
  }

  // Format time display
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Board orientation
  const boardOrientation = game ? (game.turn() === 'w' ? 'white' : 'black') : 'white';

  // Find primary theme from current puzzle for help modal
  const primaryTheme = useMemo(() => {
    if (!puzzle?.themes) return null;
    for (const theme of puzzle.themes) {
      if (getThemeExplanation(theme)) return theme;
    }
    return null;
  }, [puzzle]);

  // Ready screen
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-[#131F24] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B, #A560E8)' }}
          >
            <span className="text-4xl">🔥</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Daily Challenge</h1>
          <p className="text-gray-400 mb-8">
            Solve as many puzzles as you can in 5 minutes. You have 3 lives.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-white font-bold">5:00</div>
              <div className="text-gray-500 text-xs">Time Limit</div>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <div className="text-2xl mb-1">❤️</div>
              <div className="text-white font-bold">3</div>
              <div className="text-gray-500 text-xs">Lives</div>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-white font-bold">+10</div>
              <div className="text-gray-500 text-xs">Streak Bonus</div>
            </div>
          </div>

          <button
            onClick={startChallenge}
            className="w-full py-4 rounded-xl text-white font-bold text-lg transition-transform active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}
          >
            Start Challenge
          </button>

          <button
            onClick={() => router.push('/home')}
            className="mt-4 text-gray-500 hover:text-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Finished screen
  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-[#131F24] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B, #A560E8)' }}
          >
            <span className="text-4xl">{lives > 0 ? '🎉' : '💪'}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {lives > 0 ? "Time's Up!" : 'Game Over'}
          </h1>
          <p className="text-gray-400 mb-8">
            {lives > 0 ? 'Great effort! Keep practicing.' : "Don't give up, try again!"}
          </p>

          <div className="bg-[#1A2C35] rounded-2xl p-6 mb-8">
            <div className="text-5xl font-bold text-white mb-2">{score}</div>
            <div className="text-gray-400 mb-4">points</div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-gray-500 text-sm">Puzzles Solved</div>
                <div className="text-white font-bold text-xl">{puzzlesSolved}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Time Used</div>
                <div className="text-white font-bold text-xl">{formatTime(TOTAL_TIME - timeLeft)}</div>
              </div>
            </div>
          </div>

          <button
            onClick={startChallenge}
            className="w-full py-4 rounded-xl text-white font-bold text-lg transition-transform active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}
          >
            Play Again
          </button>

          <button
            onClick={() => router.push('/home')}
            className="mt-4 text-gray-500 hover:text-gray-300 transition-colors block w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Playing screen
  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header with stats */}
      <div
        className="px-4 py-3"
        style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span key={i} className={`text-xl ${i < lives ? '' : 'opacity-30'}`}>
                ❤️
              </span>
            ))}
          </div>
          <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
          <div className="text-right">
            <div className="text-xs opacity-80">Score</div>
            <div className="font-bold">{score}</div>
          </div>
        </div>
      </div>

      {/* Streak indicator */}
      {streak > 0 && (
        <div className="bg-yellow-500/20 text-yellow-400 text-center py-1 text-sm font-medium">
          🔥 {streak} streak! {streak >= 3 && `(+${Math.floor(streak / 3) * 10} bonus)`}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Chessboard */}
        <div className="bg-[#1A2C35] rounded-xl p-4 mb-4">
          {game && (
            <Chessboard
              options={{
                position: game.fen(),
                onPieceDrop: onDrop,
                boardOrientation: boardOrientation,
                boardStyle: {
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                },
                darkSquareStyle: { backgroundColor: '#779952' },
                lightSquareStyle: { backgroundColor: '#edeed1' },
              }}
            />
          )}
        </div>

        {/* Status */}
        <div className="text-center">
          {status === 'loading' && (
            <div className="text-gray-400">Loading puzzle...</div>
          )}
          {status === 'playing' && puzzle && (
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <span>Find the best move</span>
              {primaryTheme && (
                <HelpIconButton onClick={() => setShowHelpModal(true)} />
              )}
            </div>
          )}
          {status === 'correct' && (
            <div className="text-green-400 text-lg font-semibold animate-pulse">
              +100 Correct!
            </div>
          )}
          {status === 'incorrect' && (
            <div className="text-red-400 text-lg font-semibold">
              Wrong! {lives > 0 ? 'Next puzzle...' : 'No lives left'}
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        dailyPuzzlesUsed={dailyPuzzlesUsed}
      />

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
