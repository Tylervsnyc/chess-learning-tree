'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

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
      const maxFromWidth = width - 24;
      const maxFromHeight = height * 0.34;
      return Math.min(260, maxFromWidth, maxFromHeight);
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

          if (newGame.isCheckmate()) {
            setIsCheckmate(true);
          }
        } catch {
          resetPuzzle();
        }
      } else {
        setTimeout(resetPuzzle, 2500);
      }
    }, moveIndex === -1 ? 1200 : 800);

    return () => clearTimeout(timeout);
  }, [moveIndex, game, resetPuzzle]);

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

export default function LandingNowWhat() {
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
        <h1 className="text-center mb-2">
          <span
            className="block text-gray-400 font-medium leading-tight"
            style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)' }}
          >
            You know how the pieces move.
          </span>
          <span
            className="block font-bold leading-tight text-transparent bg-clip-text mt-1"
            style={{
              fontSize: 'clamp(2.5rem, 10vw, 3.5rem)',
              backgroundImage: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)'
            }}
          >
            Now what?
          </span>
        </h1>

        {/* Board with brand gradient border */}
        <div
          className="p-1 rounded-xl mt-4"
          style={{
            background: 'linear-gradient(135deg, #4ade80, #38bdf8, #a78bfa)',
            boxShadow: '0 0 30px rgba(74,222,128,0.3), 0 0 60px rgba(56,189,248,0.2)',
          }}
        >
          <div className="bg-[#131F24] rounded-lg p-1">
            <AnimatedBoard size={boardSize} />
          </div>
        </div>

        {/* Subtext */}
        <p className="text-gray-400 text-sm mt-4 text-center max-w-[300px]">
          Learn the 50 tactical patterns that appear in 80% of games—in the right order.
        </p>

        {/* CTA Button */}
        <Link
          href="/onboarding"
          className="py-3 mt-4 text-center font-bold text-base rounded-2xl text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
          style={{ backgroundColor: '#58CC02', width: boardSize }}
        >
          Find Your Starting Point
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
