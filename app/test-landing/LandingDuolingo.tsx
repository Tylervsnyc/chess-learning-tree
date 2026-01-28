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

export default function LandingDuolingo() {
  const boardSize = useResponsiveBoardSize();

  return (
    <div className="h-screen bg-[#eef6fc] flex flex-col overflow-hidden">
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
        <div className="mb-3 bg-white rounded-2xl px-4 py-3 text-center shadow-sm" style={{ width: 'min(92vw, 340px)' }}>
          <h1 className="mb-1">
            <span className="text-slate-800 font-bold text-2xl">Duolingo, </span>
            <span className="font-bold text-2xl text-[#58CC02]">but for chess.</span>
          </h1>
          <p className="text-slate-500 text-sm">
            5 minutes a day. Bite-sized puzzles. Real improvement.
          </p>
        </div>

        {/* Board with subtle shadow */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <AnimatedPuzzleBoard size={boardSize} />
        </div>

        {/* CTA Button */}
        <Link
          href="/learn"
          className="py-3.5 mt-4 text-center font-bold text-base rounded-2xl text-white transition-all hover:brightness-105 active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
          style={{ backgroundColor: '#58CC02', width: boardSize }}
        >
          Start Learning Free
        </Link>

        {/* Login link in card */}
        <div className="mt-3 bg-white rounded-xl px-4 py-3 shadow-sm">
          <Link
            href="/auth/login"
            className="text-slate-500 text-sm hover:text-slate-700 transition-colors"
          >
            Already have an account? <span className="font-medium text-[#58CC02]">Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
