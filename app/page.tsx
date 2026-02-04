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

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const boardSize = useResponsiveBoardSize();

  // Redirect logged-in users to /learn (don't block page render)
  useEffect(() => {
    if (!loading && user) {
      router.push('/learn');
    }
  }, [user, loading, router]);

  return (
    <div className="h-full bg-[#eef6fc] flex flex-col overflow-hidden">
      {/* Flexible content area */}
      <div className="flex-1 flex flex-col items-center px-3 pt-6 min-h-0">
        {/* Logo */}
        <Image
          src="/brand/logo-stacked-light.svg"
          alt="ChessPath"
          width={260}
          height={156}
          className="mb-2"
          style={{ width: 'clamp(200px, 55vw, 260px)', height: 'auto' }}
          priority
        />

        {/* Tagline card */}
        <div className="mb-4 bg-white rounded-2xl px-4 py-3 text-center shadow-sm" style={{ width: 'min(92vw, 340px)' }}>
          <p className="text-slate-600 text-sm leading-relaxed">
            Curated puzzles to help you improve in the shortest time possible
          </p>
        </div>

        {/* Board with subtle shadow */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <AnimatedBoard size={boardSize} />
        </div>

        {/* CTA Button */}
        <Link
          href="/about"
          className="py-3.5 mt-5 text-center font-bold text-base rounded-2xl text-white transition-all hover:brightness-105 active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
          style={{ backgroundColor: '#58CC02', width: boardSize }}
        >
          Start Learning
        </Link>

        {/* Login link in card */}
        <div className="mt-4 bg-white rounded-xl px-4 py-3 shadow-sm">
          <Link
            href="/auth/login"
            className="text-slate-500 text-sm hover:text-slate-700 transition-colors"
          >
            Already have an account? <span className="font-medium text-[#58CC02]">Sign in</span>
          </Link>
        </div>

        {/* Support email */}
        <a href="mailto:support@chesspath.app" className="mt-auto mb-3 text-slate-400 text-[10px] hover:text-slate-500">
          support@chesspath.app
        </a>
      </div>
    </div>
  );
}
