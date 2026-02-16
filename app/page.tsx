'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { Chess } from 'chess.js';
import { useUser } from '@/hooks/useUser';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { BOARD_COLORS } from '@/lib/puzzle-utils';
import { trackEvent } from '@/lib/analytics/posthog';

// King Hunt puzzle - 8 move checkmate (mateIn4)
const PUZZLE = {
  fen: 'r1bqr1kR/pp1n2p1/2n1p1P1/2ppP1P1/3P1P2/P1P5/2P5/R1BQK3 b Q - 2 17',
  moves: ['g8h8', 'd1h5', 'h8g8', 'h5h7', 'g8f8', 'h7h8', 'f8e7', 'h8g7'],
  orientation: 'white' as const,
};

type Variant = 'a' | 'b' | 'c';

// Measures the ref container and returns the largest square that fits inside it
function useBoardSizeFromRef(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function measure() {
      const { width, height } = el!.getBoundingClientRect();
      setSize(Math.max(200, Math.min(480, width, height)));
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

// ─── Board wrapper (shared) ───
function BoardSection({ boardContainerRef, boardSize }: {
  boardContainerRef: React.RefObject<HTMLDivElement | null>;
  boardSize: number;
}) {
  return (
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
  );
}

// ─── CTA button (shared) ───
function CTAButton({ href, label, boardSize, variant, secondary }: {
  href: string;
  label: string;
  boardSize: number;
  variant: Variant;
  secondary?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Link
        href={href}
        onClick={() => trackEvent('landing_cta_clicked', { variant, label })}
        className="py-3.5 text-center font-bold text-base rounded-2xl text-white transition-all hover:brightness-105 active:translate-y-[2px] bg-chess-green shadow-[0_4px_0_var(--color-chess-green-shadow)]"
        style={{ width: Math.max(boardSize, 280) }}
      >
        {label}
      </Link>
      {secondary && (
        <p className="text-chess-text-faint text-xs">{secondary}</p>
      )}
    </div>
  );
}

// ─── Footer (shared) ───
function Footer() {
  return (
    <div className="flex flex-col items-center gap-2.5">
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
  );
}

// ═══════════════════════════════════════════════════════
// VARIANT A — "Value Prop"
// Hypothesis: Explaining the benefit clearly reduces bounce
// ═══════════════════════════════════════════════════════
function VariantA({ boardContainerRef, boardSize }: {
  boardContainerRef: React.RefObject<HTMLDivElement | null>;
  boardSize: number;
}) {
  return (
    <div className="h-full md:max-h-[700px] bg-chess-page flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center px-4 min-h-0 max-w-lg md:max-w-xl mx-auto w-full">
        {/* Hero copy */}
        <div className="pt-5 pb-2 flex flex-col items-center text-center">
          <div className="mb-3" style={{ transform: 'scale(0.5)', transformOrigin: 'center' }}>
            <AnimatedLogo theme="light" size="md" />
          </div>
          <h1 className="text-2xl font-black text-chess-text leading-tight mb-1.5"
              style={{ fontFamily: 'var(--font-display, Playfair Display), serif' }}>
            Get Better at Chess.<br />5 Minutes a Day.
          </h1>
          <p className="text-chess-text-muted text-sm leading-relaxed max-w-xs">
            Bite-sized puzzles that actually make you a stronger player. Free forever.
          </p>
        </div>

        {/* Board */}
        <BoardSection boardContainerRef={boardContainerRef} boardSize={boardSize} />

        {/* CTA */}
        <div className="pb-3 pt-2 flex flex-col items-center gap-3">
          <CTAButton
            href="/about"
            label="Start Free Lessons"
            boardSize={boardSize}
            variant="a"
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// VARIANT B — Control (original)
// Baseline: current landing page for comparison
// ═══════════════════════════════════════════════════════
function VariantB({ boardContainerRef, boardSize }: {
  boardContainerRef: React.RefObject<HTMLDivElement | null>;
  boardSize: number;
}) {
  return (
    <div className="h-full md:max-h-[700px] bg-chess-page flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center px-3 min-h-0 max-w-lg md:max-w-xl mx-auto w-full">
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

        <BoardSection boardContainerRef={boardContainerRef} boardSize={boardSize} />

        <div className="pb-3 pt-3 flex flex-col items-center gap-3">
          <CTAButton
            href="/about"
            label="Start Learning"
            boardSize={boardSize}
            variant="b"
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// VARIANT C — "Daily Habit"
// Hypothesis: Routine/habit framing drives signups
// ═══════════════════════════════════════════════════════
function VariantC({ boardContainerRef, boardSize }: {
  boardContainerRef: React.RefObject<HTMLDivElement | null>;
  boardSize: number;
}) {
  return (
    <div className="h-full md:max-h-[700px] bg-chess-page flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center px-4 min-h-0 max-w-lg md:max-w-xl mx-auto w-full">
        {/* Daily habit pitch */}
        <div className="pt-5 pb-2 flex flex-col items-center text-center">
          <div className="mb-3" style={{ transform: 'scale(0.5)', transformOrigin: 'center' }}>
            <AnimatedLogo theme="light" size="md" />
          </div>
          <h1 className="text-2xl font-black text-chess-text leading-tight mb-2.5"
              style={{ fontFamily: 'var(--font-display, Playfair Display), serif' }}>
            Your Daily Chess Workout
          </h1>
          {/* Benefit pills — flush with board width */}
          <div className="flex items-center gap-1.5 justify-center" style={{ width: boardSize || 280 }}>
            <span className="bg-chess-surface text-chess-text-muted text-[11px] font-medium px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="text-chess-green text-xs">&#9201;</span> 5 min/day
            </span>
            <span className="bg-chess-surface text-chess-text-muted text-[11px] font-medium px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="text-chess-blue text-xs">&#9822;</span> Beginner friendly
            </span>
            <span className="bg-chess-surface text-chess-text-muted text-[11px] font-medium px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="text-chess-gold text-xs">&#9733;</span> 100% free
            </span>
          </div>
        </div>

        {/* Board */}
        <BoardSection boardContainerRef={boardContainerRef} boardSize={boardSize} />

        {/* CTA */}
        <div className="pb-3 pt-2 flex flex-col items-center gap-3">
          <CTAButton
            href="/about"
            label="Start Today — It's Free"
            boardSize={boardSize}
            variant="c"
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Main page — picks variant from ?v= param
// ═══════════════════════════════════════════════════════
export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useUser();
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const boardSize = useBoardSizeFromRef(boardContainerRef);

  // Pick variant: ?v=a|b|c, or random for real users
  const variant: Variant = (() => {
    const v = searchParams.get('v');
    if (v === 'a' || v === 'b' || v === 'c') return v;
    // Stable random: pick once per session
    const options: Variant[] = ['a', 'b', 'c'];
    return options[Math.floor(Math.random() * options.length)];
  })();

  // Track variant view
  useEffect(() => {
    trackEvent('landing_variant_viewed', { variant });
  }, [variant]);

  // Redirect logged-in users to /learn
  useEffect(() => {
    if (!loading && user) {
      router.push('/learn');
    }
  }, [user, loading, router]);

  const props = { boardContainerRef, boardSize };

  switch (variant) {
    case 'a': return <VariantA {...props} />;
    case 'b': return <VariantB {...props} />;
    case 'c': return <VariantC {...props} />;
  }
}
