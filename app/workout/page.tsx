'use client';

import { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';
import { DailyPuzzleCounter } from '@/components/subscription/DailyPuzzleCounter';
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

// Theme display names
const THEME_NAMES: Record<string, string> = {
  advancedPawn: 'Advanced Pawn',
  attraction: 'Attraction',
  backRankMate: 'Back Rank Mate',
  bishopEndgame: 'Bishop Endgame',
  clearance: 'Clearance',
  defensiveMove: 'Defensive Move',
  deflection: 'Deflection',
  discoveredAttack: 'Discovered Attack',
  endgame: 'Endgame',
  exposedKing: 'Exposed King',
  fork: 'Fork',
  hangingPiece: 'Hanging Piece',
  interference: 'Interference',
  knightEndgame: 'Knight Endgame',
  mateIn1: 'Mate in 1',
  mateIn2: 'Mate in 2',
  mateIn3: 'Mate in 3',
  pawnEndgame: 'Pawn Endgame',
  pin: 'Pin',
  promotion: 'Promotion',
  queenEndgame: 'Queen Endgame',
  quietMove: 'Quiet Move',
  rookEndgame: 'Rook Endgame',
  sacrifice: 'Sacrifice',
  skewer: 'Skewer',
  trappedPiece: 'Trapped Piece',
  zugzwang: 'Zugzwang',
};

// Wrapper component to handle Suspense for useSearchParams
export default function WorkoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <WorkoutContent />
    </Suspense>
  );
}

function WorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useUser();

  // Puzzle state
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [game, setGame] = useState<Chess | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<'loading' | 'playing' | 'correct' | 'incorrect'>('loading');
  const [startTime, setStartTime] = useState<number>(0);

  // Theme selection
  const [themes, setThemes] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>(searchParams.get('theme') || '');

  // Session stats
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  // Subscription state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [dailyPuzzlesUsed, setDailyPuzzlesUsed] = useState(0);

  // Help modal state
  const [showHelpModal, setShowHelpModal] = useState(false);

  // User rating (from profile or default)
  const userRating = profile?.elo_rating || 800;

  // Find primary theme from current puzzle for help modal
  const primaryTheme = useMemo(() => {
    if (!puzzle?.themes) return null;
    for (const theme of puzzle.themes) {
      if (getThemeExplanation(theme)) return theme;
    }
    return null;
  }, [puzzle]);

  // Fetch available themes
  useEffect(() => {
    async function fetchThemes() {
      try {
        const res = await fetch(`/api/puzzles?mode=themes&userRating=${userRating}`);
        const data = await res.json();
        setThemes(data.themes || []);
      } catch (error) {
        console.error('Failed to fetch themes:', error);
      }
    }
    fetchThemes();
  }, [userRating]);

  // Fetch a new puzzle
  const fetchPuzzle = useCallback(async () => {
    setStatus('loading');
    try {
      const themeParam = selectedTheme ? `&theme=${selectedTheme}` : '';
      const res = await fetch(`/api/puzzles?userRating=${userRating}${themeParam}`);

      // Handle rate limit (429)
      if (res.status === 429) {
        const data = await res.json();
        if (data.upgradeRequired) {
          setDailyPuzzlesUsed(data.dailyPuzzlesUsed || 15);
          setShowUpgradeModal(true);
          setStatus('playing'); // Reset status
          return;
        }
      }

      const data = await res.json();

      if (data.puzzle) {
        setPuzzle(data.puzzle);

        // Initialize chess game with puzzle position
        const chess = new Chess(data.puzzle.fen);

        // The first move in the array is the opponent's last move (already played)
        // We need to show it being played, then let user solve from there
        if (data.puzzle.moves.length > 0) {
          // Play opponent's move
          const opponentMove = data.puzzle.moves[0];
          chess.move({
            from: opponentMove.slice(0, 2),
            to: opponentMove.slice(2, 4),
            promotion: opponentMove.length > 4 ? opponentMove[4] : undefined,
          });
        }

        setGame(chess);
        setMoveIndex(1); // Start at move index 1 (user's first move)
        setStatus('playing');
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error('Failed to fetch puzzle:', error);
    }
  }, [userRating, selectedTheme]);

  // Fetch initial puzzle
  useEffect(() => {
    fetchPuzzle();
  }, [fetchPuzzle]);

  // Record attempt to Supabase
  const recordAttempt = async (correct: boolean) => {
    if (!user || !puzzle) return;

    const supabase = createClient();
    const timeSpent = Date.now() - startTime;

    try {
      await supabase.from('puzzle_attempts').insert({
        user_id: user.id,
        puzzle_id: puzzle.puzzleId,
        themes: puzzle.themes,
        rating: puzzle.rating,
        correct,
        time_spent_ms: timeSpent,
        fen: puzzle.fen,
        solution: puzzle.moves.slice(1).join(' '),
      });
    } catch (error) {
      console.error('Failed to record attempt:', error);
    }
  };

  // Handle piece drop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onDrop({ sourceSquare, targetSquare, piece }: any) {
    if (!targetSquare || !game || !puzzle || status !== 'playing') return false;

    const expectedMove = puzzle.moves[moveIndex];
    if (!expectedMove) return false;

    // Check if this is the expected move
    const moveStr = sourceSquare + targetSquare;
    const expectedMoveBase = expectedMove.slice(0, 4);

    // Handle promotion
    let promotion: 'q' | 'r' | 'b' | 'n' | undefined;
    if (expectedMove.length > 4) {
      promotion = expectedMove[4] as 'q' | 'r' | 'b' | 'n';
    } else if (piece[1] === 'P' && (targetSquare[1] === '8' || targetSquare[1] === '1')) {
      promotion = 'q'; // Default to queen
    }

    // Check if move matches expected
    if (moveStr !== expectedMoveBase) {
      // Wrong move
      setStatus('incorrect');
      setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      recordAttempt(false);
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
        setStatus('correct');
        setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
        recordAttempt(true);
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

  // Determine board orientation
  const boardOrientation = game ? (game.turn() === 'w' ? 'white' : 'black') : 'white';

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white"
          >
            &larr; Back
          </button>
          <h1 className="text-xl font-bold">Puzzle Workout</h1>
          <div className="text-sm text-gray-400">
            Rating: {userRating}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chessboard */}
          <div className="flex-1">
            <div className="bg-[#1A2C35] rounded-xl p-4">
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

            {/* Status message */}
            <div className="mt-4 text-center">
              {status === 'loading' && (
                <div className="text-gray-400">Loading puzzle...</div>
              )}
              {status === 'playing' && puzzle && (
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <span><span className="text-gray-500">Puzzle rating:</span> {puzzle.rating}</span>
                  <span className="text-gray-500">|</span>
                  <span><span className="text-gray-500">Theme:</span> {THEME_NAMES[puzzle.themes[0]] || puzzle.themes[0]}</span>
                  {primaryTheme && (
                    <HelpIconButton onClick={() => setShowHelpModal(true)} />
                  )}
                </div>
              )}
              {status === 'correct' && (
                <div className="text-green-400 text-lg font-semibold">
                  Correct!
                </div>
              )}
              {status === 'incorrect' && (
                <div className="text-red-400 text-lg font-semibold">
                  Incorrect - try the next one
                </div>
              )}
            </div>

            {/* Next puzzle button */}
            {(status === 'correct' || status === 'incorrect') && (
              <div className="mt-4 text-center">
                <button
                  onClick={fetchPuzzle}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Next Puzzle
                </button>
                {status === 'incorrect' && puzzle && (
                  <div className="mt-3 text-sm text-gray-500">
                    Solution: {puzzle.moves.slice(1).join(' ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-64 space-y-4">
            {/* Daily puzzle counter */}
            <DailyPuzzleCounter onUpgradeClick={() => setShowUpgradeModal(true)} />

            {/* Theme selector */}
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <h3 className="font-semibold mb-3 text-gray-300">Theme Filter</h3>
              <select
                value={selectedTheme}
                onChange={(e) => {
                  setSelectedTheme(e.target.value);
                  // Update URL without navigation
                  const url = new URL(window.location.href);
                  if (e.target.value) {
                    url.searchParams.set('theme', e.target.value);
                  } else {
                    url.searchParams.delete('theme');
                  }
                  window.history.replaceState({}, '', url);
                }}
                className="w-full px-3 py-2 bg-[#131F24] border border-gray-600 rounded-lg text-white text-sm"
              >
                <option value="">All Themes</option>
                {themes.map(theme => (
                  <option key={theme} value={theme}>
                    {THEME_NAMES[theme] || theme}
                  </option>
                ))}
              </select>
              {selectedTheme && (
                <button
                  onClick={() => {
                    setSelectedTheme('');
                    const url = new URL(window.location.href);
                    url.searchParams.delete('theme');
                    window.history.replaceState({}, '', url);
                  }}
                  className="mt-2 text-xs text-gray-400 hover:text-white"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Session stats */}
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <h3 className="font-semibold mb-3 text-gray-300">Session Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{sessionStats.correct}</div>
                  <div className="text-xs text-gray-500">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{sessionStats.incorrect}</div>
                  <div className="text-xs text-gray-500">Incorrect</div>
                </div>
              </div>
              {(sessionStats.correct + sessionStats.incorrect) > 0 && (
                <div className="mt-3 text-center text-sm text-gray-400">
                  Accuracy: {Math.round((sessionStats.correct / (sessionStats.correct + sessionStats.incorrect)) * 100)}%
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <h3 className="font-semibold mb-2 text-gray-300">How to Play</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>Find the best move</li>
                <li>Drag pieces to make moves</li>
                <li>Complete the puzzle sequence</li>
              </ul>
            </div>

            {!user && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <p className="text-sm text-amber-400">
                  Sign in to track your progress and improve your rating!
                </p>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="mt-2 text-sm text-amber-300 hover:text-amber-200 underline"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
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
