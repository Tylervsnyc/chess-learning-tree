'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useUser } from '@/hooks/useUser';

// King Hunt puzzle - 8 move checkmate (mateIn4)
const PUZZLE = {
  fen: 'r1bqr1kR/pp1n2p1/2n1p1P1/2ppP1P1/3P1P2/P1P5/2P5/R1BQK3 b Q - 2 17',
  moves: ['g8h8', 'd1h5', 'h8g8', 'h5h7', 'g8f8', 'h7h8', 'f8e7', 'h8g7'],
  orientation: 'white' as const,
};

function AnimatedBoard({ size }: { size: number }) {
  const [game, setGame] = useState(() => new Chess(PUZZLE.fen));
  const [moveIndex, setMoveIndex] = useState(-1);
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);
  const [isCheckmate, setIsCheckmate] = useState(false);

  const resetPuzzle = useCallback(() => {
    setGame(new Chess(PUZZLE.fen));
    setMoveIndex(-1);
    setLastMove(null);
    setIsCheckmate(false);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (moveIndex < PUZZLE.moves.length - 1) {
        const nextIndex = moveIndex + 1;
        const move = PUZZLE.moves[nextIndex];
        const from = move.slice(0, 2);
        const to = move.slice(2, 4);
        const promotion = move.length > 4 ? move[4] : undefined;

        try {
          const newGame = new Chess(game.fen());
          newGame.move({ from, to, promotion });
          setGame(newGame);
          setLastMove([from, to]);
          setMoveIndex(nextIndex);

          // Check for checkmate
          if (newGame.isCheckmate()) {
            setIsCheckmate(true);
          }
        } catch {
          resetPuzzle();
        }
      } else {
        // Pause longer on checkmate, then reset
        setTimeout(resetPuzzle, 2500);
      }
    }, moveIndex === -1 ? 1200 : 800);

    return () => clearTimeout(timeout);
  }, [moveIndex, game, resetPuzzle]);

  const customSquareStyles = lastMove ? {
    [lastMove[0]]: { backgroundColor: 'rgba(88, 204, 2, 0.5)' },
    [lastMove[1]]: { backgroundColor: 'rgba(88, 204, 2, 0.5)' },
  } : {};

  return (
    <div style={{ width: size, height: size }} className="relative">
      <Chessboard
        options={{
          position: game.fen(),
          boardOrientation: PUZZLE.orientation,
          squareStyles: customSquareStyles,
          boardStyle: { borderRadius: '16px' },
          darkSquareStyle: { backgroundColor: '#779952' },
          lightSquareStyle: { backgroundColor: '#edeed1' },
        }}
      />
      {isCheckmate && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg animate-pulse"
            style={{ boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)' }}
          >
            CHECKMATE!
          </div>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { user, profile, loading } = useUser();

  useEffect(() => {
    if (!loading && user && profile) {
      // Always redirect signed-in users to the chess path
      // They can see their next lesson and click to start
      router.push('/learn');
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-5 pt-12 pb-4">
        {/* Title with gradient */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-black">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400">
              THE CHESS PATH
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-[280px] mx-auto">
            Curated puzzles to help you improve in the shortest time possible
          </p>
        </div>

        {/* Founder badge */}
        <div className="mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-700 bg-gray-900/50">
          <span className="text-cyan-400 text-xs">★</span>
          <span className="text-gray-300 text-xs">
            From the founder of <span className="text-white font-medium">Storytime Chess</span>
          </span>
        </div>

        {/* Board with neon border */}
        <div
          className="p-1 rounded-xl mb-5"
          style={{
            background: 'linear-gradient(135deg, #00FFFF, #FF00FF, #FFFF00)',
            boxShadow: '0 0 30px rgba(0,255,255,0.3), 0 0 60px rgba(255,0,255,0.2)',
          }}
        >
          <div className="bg-[#131F24] rounded-lg p-1">
            <AnimatedBoard size={Math.min(280, typeof window !== 'undefined' ? window.innerWidth - 60 : 280)} />
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/onboarding"
          className="w-full max-w-[300px] py-4 text-center font-bold text-lg rounded-2xl text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
          style={{ backgroundColor: '#58CC02' }}
        >
          Start Learning
        </Link>

        {/* Small login link */}
        <Link
          href="/auth/login"
          className="mt-4 text-gray-500 text-sm hover:text-gray-300 transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
