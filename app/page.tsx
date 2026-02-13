'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { Chess } from 'chess.js';
import { useUser } from '@/hooks/useUser';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { BOARD_COLORS } from '@/lib/puzzle-utils';

// King Hunt puzzle - 8 move checkmate (mateIn4)
const PUZZLE = {
  fen: 'r1bqr1kR/pp1n2p1/2n1p1P1/2ppP1P1/3P1P2/P1P5/2P5/R1BQK3 b Q - 2 17',
  moves: ['g8h8', 'd1h5', 'h8g8', 'h5h7', 'g8f8', 'h7h8', 'f8e7', 'h8g7'],
  orientation: 'white' as const,
};

// Measures the ref container and returns the largest square that fits inside it
function useBoardSizeFromRef(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function measure() {
      const { width, height } = el!.getBoundingClientRect();
      // Square board = min(width, height), clamped to a reasonable range
      setSize(Math.max(200, Math.min(360, width, height)));
    }

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

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
    [lastMove[0]]: { backgroundColor: 'rgba(var(--color-chess-green), 0.5)' },
    [lastMove[1]]: { backgroundColor: 'rgba(var(--color-chess-green), 0.5)' },
  } : {};

  return (
    <div style={{ width: size, height: size }} className="relative">
      <ChessPathBoard
        options={{
          position: game.fen(),
          boardOrientation: PUZZLE.orientation,
          squareStyles: customSquareStyles,
          boardStyle: { borderRadius: '16px' },
          darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
          lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
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
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const boardSize = useBoardSizeFromRef(boardContainerRef);

  // Redirect logged-in users to /learn (don't block page render)
  useEffect(() => {
    if (!loading && user) {
      router.push('/learn');
    }
  }, [user, loading, router]);

  return (
    <div className="h-full bg-chess-page flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center px-3 min-h-0 max-w-lg mx-auto w-full">
        {/* Top: logo + tagline (fixed size) */}
        <div className="pt-4 pb-3 flex flex-col items-center">
          <div className="mb-3" style={{ transform: 'scale(0.6)', transformOrigin: 'center' }}>
            <AnimatedLogo theme="light" size="md" />
          </div>
          <div className="bg-chess-surface rounded-2xl px-4 py-2.5 text-center shadow-sm" style={{ width: 'min(92vw, 340px)' }}>
            <p className="text-chess-text-muted text-sm leading-relaxed">
              Chess. Made Simple.
            </p>
          </div>
        </div>

        {/* Middle: board takes all remaining space (flex-1) */}
        <div ref={boardContainerRef} className="flex-1 min-h-0 w-full flex items-center justify-center">
          {boardSize > 0 && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)' }}
            >
              <AnimatedBoard size={boardSize} />
            </div>
          )}
        </div>

        {/* Bottom: CTA + login (fixed size) */}
        <div className="pb-3 pt-3 flex flex-col items-center gap-3">
          <Link
            href="/about"
            className="py-3 text-center font-bold text-base rounded-2xl text-white transition-all hover:brightness-105 active:translate-y-[2px] bg-chess-green shadow-[0_4px_0_var(--color-chess-green-shadow)]"
            style={{ width: Math.max(boardSize, 260) }}
          >
            Start Learning
          </Link>
          <div className="bg-chess-surface rounded-xl px-4 py-2.5 shadow-sm">
            <Link
              href="/auth/login"
              className="text-chess-text-muted text-sm hover:text-chess-text transition-colors"
            >
              Already have an account? <span className="font-medium text-chess-green">Sign in</span>
            </Link>
          </div>
          <a href="mailto:support@chesspath.app" className="text-chess-text-faint text-[10px] hover:text-chess-text-muted">
            support@chesspath.app
          </a>
        </div>
      </div>
    </div>
  );
}
