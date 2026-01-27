'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const PUZZLE = {
  fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
  moves: ['h5f7'],
  orientation: 'white' as const,
};

function useResponsiveBoardSize() {
  const [size, setSize] = useState(280);

  useEffect(() => {
    function calculateSize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const maxFromWidth = width - 24;
      const maxFromHeight = height * 0.36;
      return Math.min(280, maxFromWidth, maxFromHeight);
    }

    setSize(calculateSize());

    const handleResize = () => setSize(calculateSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

function AnimatedPuzzleBoard({ size }: { size: number }) {
  const [game, setGame] = useState(() => new Chess(PUZZLE.fen));
  const [showCheckmate, setShowCheckmate] = useState(false);
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);

  const resetPuzzle = useCallback(() => {
    setGame(new Chess(PUZZLE.fen));
    setShowCheckmate(false);
    setLastMove(null);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!showCheckmate) {
        const move = PUZZLE.moves[0];
        const from = move.slice(0, 2);
        const to = move.slice(2, 4);

        try {
          const newGame = new Chess(game.fen());
          newGame.move({ from, to });
          setGame(newGame);
          setLastMove([from, to]);
          setShowCheckmate(true);
        } catch {
          resetPuzzle();
        }
      } else {
        setTimeout(resetPuzzle, 3000);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [showCheckmate, game, resetPuzzle]);

  const customSquareStyles = lastMove
    ? {
        [lastMove[0]]: { backgroundColor: 'rgba(88, 204, 2, 0.5)' },
        [lastMove[1]]: { backgroundColor: 'rgba(88, 204, 2, 0.5)' },
      }
    : {};

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
      {showCheckmate && (
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

export default function LandingBeatFriends() {
  const boardSize = useResponsiveBoardSize();

  return (
    <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center px-3 pt-12 min-h-0">
        {/* Small logo */}
        <div className="flex items-center gap-2 mb-4">
          <Image
            src="/brand/icon-96.svg?v=2"
            alt="Chess Path"
            width={32}
            height={32}
          />
          <span className="text-white/60 text-sm font-medium">chesspath</span>
        </div>

        {/* BIG TAGLINE */}
        <h1 className="text-center mb-6">
          <span
            className="block text-white font-bold leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 7vw, 2.5rem)' }}
          >
            Want to beat your
          </span>
          <span
            className="block font-bold leading-tight text-transparent bg-clip-text"
            style={{
              fontSize: 'clamp(2.25rem, 9vw, 3.25rem)',
              backgroundImage: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)'
            }}
          >
            friends at chess?
          </span>
        </h1>

        {/* Board with brand gradient border */}
        <div
          className="p-1 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #4ade80, #38bdf8, #a78bfa)',
            boxShadow: '0 0 30px rgba(74,222,128,0.3), 0 0 60px rgba(56,189,248,0.2)',
          }}
        >
          <div className="bg-[#131F24] rounded-lg p-1">
            <AnimatedPuzzleBoard size={boardSize} />
          </div>
        </div>

        {/* Subtext */}
        <p className="text-gray-400 text-sm mt-4 text-center max-w-[280px]">
          Learn the tactics that actually win games. 5 minutes a day is all it takes.
        </p>

        {/* CTA Button */}
        <Link
          href="/onboarding"
          className="py-3 mt-4 text-center font-bold text-base rounded-2xl text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
          style={{ backgroundColor: '#58CC02', width: boardSize }}
        >
          Start Winning
        </Link>

        {/* Small login link */}
        <Link
          href="/auth/login"
          className="mt-3 text-gray-500 text-xs hover:text-gray-300 transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
