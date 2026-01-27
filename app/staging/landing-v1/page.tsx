'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useUser } from '@/hooks/useUser';

// King Hunt puzzle - 8 move checkmate (mateIn4)
const PUZZLE = {
  fen: 'r1bqr1kR/pp1n2p1/2n1p1P1/2ppP1P1/3P1P2/P1P5/2P5/R1BQK3 b Q - 2 17',
  moves: ['g8h8', 'd1h5', 'h8g8', 'h5h7', 'g8f8', 'h7h8', 'f8e7', 'h8g7'],
  orientation: 'white' as const,
};

function useResponsiveBoardSize() {
  const [size, setSize] = useState(280);

  useEffect(() => {
    function calculateSize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Use more width (only 24px total padding), cap at 85% of available height minus other content
      const maxFromWidth = width - 24;
      const maxFromHeight = height * 0.42; // 42% of viewport height for board
      return Math.min(320, maxFromWidth, maxFromHeight);
    }

    setSize(calculateSize());

    const handleResize = () => setSize(calculateSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

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

export default function LandingPageV1() {
  const router = useRouter();
  const { user, profile, loading } = useUser();
  const boardSize = useResponsiveBoardSize();

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
    <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
      {/* Flexible content area - no justify-center, starts from top */}
      <div className="flex-1 flex flex-col items-center px-3 pt-4 min-h-0">
        {/* Logo and Title - scales with viewport */}
        <div className="mb-[1vh] text-center">
          <Image
            src="/brand/icon-96.svg"
            alt="Chess Path"
            width={96}
            height={96}
            className="mx-auto mb-[1vh]"
            style={{ width: 'clamp(64px, 12vh, 96px)', height: 'clamp(64px, 12vh, 96px)' }}
          />
          <h1 className="font-bold" style={{ fontSize: 'clamp(2rem, 6vh, 3rem)' }}>
            <span className="text-white">chess</span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }}>path</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1 max-w-[260px] mx-auto">
            Curated puzzles to help you improve in the shortest time possible
          </p>
        </div>

        {/* Founder badge */}
        <div className="mb-[1.5vh] inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-700 bg-gray-900/50">
          <span className="text-cyan-400 text-xs">★</span>
          <span className="text-gray-300 text-xs">
            From the founder of <span className="text-white font-medium">Storytime Chess</span>
          </span>
        </div>

        {/* Board with brand gradient border - scales with viewport */}
        <div
          className="p-1 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #4ade80, #38bdf8, #a78bfa)',
            boxShadow: '0 0 30px rgba(74,222,128,0.3), 0 0 60px rgba(56,189,248,0.2)',
          }}
        >
          <div className="bg-[#131F24] rounded-lg p-1">
            <AnimatedBoard size={boardSize} />
          </div>
        </div>

        {/* CTA Button - matches board width */}
        <Link
          href="/staging/learn"
          className="py-3 mt-3 text-center font-bold text-base rounded-2xl text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
          style={{ backgroundColor: '#58CC02', width: boardSize }}
        >
          Start Learning
        </Link>

        {/* Small login link */}
        <Link
          href="/auth/login"
          className="mt-2 text-gray-500 text-xs hover:text-gray-300 transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
