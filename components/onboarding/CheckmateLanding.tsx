'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { CSSProperties } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { BOARD_COLORS, getCheckmateSquareHighlights } from '@/lib/puzzle-utils';
import {
  playCorrectSound,
  playMoveSound,
  playCaptureSound,
  playErrorSound,
  warmupAudio,
  vibrateOnCorrect,
  vibrateOnError,
} from '@/lib/sounds';
import { selectQuipByCategory } from '@/lib/quips/select';
import { OnboardingEvents } from '@/lib/analytics/posthog';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { SignupPrompt } from './SignupPrompt';

/**
 * Cold-traffic checkmate landing (CHE-359). Message-match the paid IG ad: it
 * shows lesson 1.1.1's highlighted checkmate-in-1, so this drops cold visitors
 * STRAIGHT onto that exact board — the product starts before they choose
 * anything. Tap the queen, tap the glowing square, win, then capture signup at
 * the peak. Shown only to the IG cohort behind IG_LANDING_CHECKMATE (see
 * OnboardingFlow). Presentational — the parent wires routing + analytics.
 *
 * Board mechanics mirror TutorialFlow's guided puzzle 1, but with the board
 * already at the player's turn (no setup-move animation — that's the whole point
 * for cold traffic). Mobile-first, centered + capped, ≥44px tap targets (§50).
 */

// The ad's exact moment — lesson 1.1.1 PUZZLE_1 (Qd3→h7#, bishop on c2 defends h7).
// `fen` is the post-setup position (player to move) so the board is instant.
const PUZZLE = {
  fen: 'r1b2rk1/4qpp1/p2np2p/1p1p4/3P4/1PPQ1N2/P1B2PPP/R4RK1 w - - 0 19',
  pieceSquare: 'd3' as Square,
  checkmateSquare: 'h7' as Square,
} as const;

const POST_WIN_ROUTE = '/lesson/1.1.1?from=onboarding';
const IDLE_NUDGE_MS = 7000;

function greenTarget(strong: boolean): CSSProperties {
  return {
    backgroundColor: 'rgba(88, 204, 2, 0.45)',
    boxShadow: strong
      ? 'inset 0 0 0 4px #58CC02, 0 0 26px rgba(88, 204, 2, 0.95)'
      : 'inset 0 0 0 3px #58CC02, 0 0 18px rgba(88, 204, 2, 0.7)',
  };
}

export function CheckmateLanding({
  onContinue,
  onSignIn,
}: {
  onContinue: (route: string) => void;
  onSignIn: () => void;
}) {
  const [currentFen, setCurrentFen] = useState<string>(PUZZLE.fen);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [solved, setSolved] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [nudge, setNudge] = useState(false);
  const [shake, setShake] = useState(false);
  const [showCheckmateHighlights, setShowCheckmateHighlights] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [quip, setQuip] = useState('');

  // Guards: state batches, so booleans alone can't stop same-cycle/StrictMode double-fires.
  const solvedRef = useRef(false);
  const wonFiredRef = useRef(false);
  const touchedRef = useRef(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  // react-chessboard v5 caches square styles — omitting a style doesn't remove it,
  // so track previously-styled selection squares and clear them explicitly.
  const prevSelectionSquaresRef = useRef<Square[]>([]);

  const game = useMemo(() => {
    try { return new Chess(currentFen); } catch { return null; }
  }, [currentFen]);

  // First interaction: unlock iOS audio (no intro popup to do it) + fire the
  // "did the board pull ANY action" diagnostic, exactly once.
  const markTouched = useCallback(() => {
    if (touchedRef.current) return;
    touchedRef.current = true;
    warmupAudio();
    OnboardingEvents.boardTouched();
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setNudge(false);
  }, []);

  // Idle nudge — if they haven't touched the board, brighten the target + Rookie hint.
  useEffect(() => {
    idleTimerRef.current = setTimeout(() => {
      if (!touchedRef.current) setNudge(true);
    }, IDLE_NUDGE_MS);
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, []);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }, []);

  const win = useCallback((copy: Chess, captured: boolean) => {
    solvedRef.current = true;
    setSolved(true);
    setCurrentFen(copy.fen());
    setSelectedSquare(null);
    if (captured) { playCaptureSound(); } else { playMoveSound(); }
    playCorrectSound(0);
    vibrateOnCorrect();
    if (!wonFiredRef.current) { wonFiredRef.current = true; OnboardingEvents.checkmateWon(); }
    // Pool loads on demand (CHE-373) — quip lands a beat later, fallback if it fails.
    const fallback = 'Checkmate. You just won your first game of chess.';
    selectQuipByCategory('play:win')
      .then((q) => setQuip(q?.text || fallback))
      .catch(() => setQuip(fallback));
    setShowCheckmateHighlights(true);
    setTimeout(() => setShowSignup(true), 1300);
  }, []);

  // Try a move (tap-to-move or drag). Only Qh7# wins; any other legal move is a
  // gentle "not quite" (never punish). Illegal → ignored.
  const attemptMove = useCallback((from: Square, to: Square): boolean => {
    if (solvedRef.current) return false;
    try {
      const copy = new Chess(currentFen);
      const move = copy.move({ from, to, promotion: 'q' });
      if (!move) return false;
      if (copy.isCheckmate()) {
        win(copy, !!move.captured);
        return true;
      }
      // Legal but not mate — gentle nudge, snap back, leave the position untouched.
      playErrorSound();
      vibrateOnError();
      triggerShake();
      setSelectedSquare(null);
      setWrongCount(c => c + 1);
      return false;
    } catch {
      return false;
    }
  }, [currentFen, win, triggerShake]);

  const onSquareClick = useCallback(({ square }: { piece: unknown; square: string }) => {
    if (!game || solvedRef.current) return;
    markTouched();
    const sq = square as Square;

    if (!selectedSquare) {
      const piece = game.get(sq);
      if (piece && piece.color === game.turn()) setSelectedSquare(sq);
      return;
    }
    if (selectedSquare === sq) { setSelectedSquare(null); return; }

    const legal = game.moves({ square: selectedSquare, verbose: true });
    if (legal.some(m => m.to === sq)) {
      attemptMove(selectedSquare, sq);
    } else {
      const piece = game.get(sq);
      if (piece && piece.color === game.turn()) setSelectedSquare(sq);
      else setSelectedSquare(null);
    }
  }, [game, selectedSquare, attemptMove, markTouched]);

  const onPieceDrop = useCallback((args: { sourceSquare: string; targetSquare: string }): boolean => {
    markTouched();
    return attemptMove(args.sourceSquare as Square, args.targetSquare as Square);
  }, [attemptMove, markTouched]);

  const squareStyles = useMemo(() => {
    const styles: Record<string, CSSProperties> = {};

    if (solved) {
      // Checkmate explanation: red = king-escape squares the mater covers, yellow = blocked by own pieces.
      if (game && game.isCheckmate()) {
        const h = getCheckmateSquareHighlights(game, game.turn());
        const all = [...h.attackedSquares, ...h.blockedByFriendlySquares];
        if (showCheckmateHighlights) {
          h.attackedSquares.forEach(sq => {
            styles[sq] = {
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
              boxShadow: 'inset 0 0 0 3px rgba(255, 0, 0, 0.8), 0 0 12px rgba(255, 0, 0, 0.4)',
            };
          });
          h.blockedByFriendlySquares.forEach(sq => {
            styles[sq] = {
              backgroundColor: 'rgba(255, 255, 0, 0.5)',
              boxShadow: 'inset 0 0 0 3px rgba(255, 200, 0, 0.8), 0 0 12px rgba(255, 255, 0, 0.4)',
            };
          });
        } else {
          all.forEach(sq => { styles[sq] = {}; });
        }
      }
      for (const sq of prevSelectionSquaresRef.current) if (!styles[sq]) styles[sq] = {};
      prevSelectionSquaresRef.current = [];
      return styles;
    }

    // The glowing mate target — always on (the tap target); brighter on idle / after a miss.
    styles[PUZZLE.checkmateSquare] = greenTarget(nudge || wrongCount > 0);

    // Highlight the piece to move (blue = "start here"; the arrow + green target
    // complete the picture so a total beginner doesn't need to know it's a queen).
    if (selectedSquare !== PUZZLE.pieceSquare) {
      styles[PUZZLE.pieceSquare] = {
        ...styles[PUZZLE.pieceSquare],
        backgroundColor: 'rgba(28, 176, 246, 0.30)',
        boxShadow: 'inset 0 0 0 4px rgba(28, 176, 246, 0.95)',
      };
    }

    // Selected piece + legal-move dots (clear stale ones via the ref).
    if (selectedSquare && game) {
      styles[selectedSquare] = { ...styles[selectedSquare], backgroundColor: 'rgba(100, 200, 255, 0.6)' };
      const current: Square[] = [selectedSquare];
      for (const m of game.moves({ square: selectedSquare, verbose: true })) {
        const t = m.to as Square;
        if (t === PUZZLE.checkmateSquare) continue; // keep the green target visible
        styles[t] = {
          ...styles[t],
          backgroundImage: m.captured
            ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
            : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
        };
        current.push(t);
      }
      prevSelectionSquaresRef.current = current;
    } else {
      for (const sq of prevSelectionSquaresRef.current) if (!styles[sq]) styles[sq] = {};
      prevSelectionSquaresRef.current = [];
    }

    return styles;
  }, [game, selectedSquare, solved, nudge, wrongCount, showCheckmateHighlights]);

  // Arrow showing the exact move (your piece -> the green square). Shown until the
  // piece is picked up or the puzzle is solved — guides the very first action with
  // zero chess knowledge required.
  const boardArrows = useMemo(() => {
    if (solved || selectedSquare) return [];
    return [{ startSquare: PUZZLE.pieceSquare, endSquare: PUZZLE.checkmateSquare, color: 'rgba(28, 176, 246, 0.9)' }];
  }, [solved, selectedSquare]);

  const hintMessage = solved
    ? quip
    : wrongCount > 0
      ? 'So close! Tap the queen, follow the arrow, and checkmate the black king!'
      : 'Tap the queen, follow the arrow, and checkmate the black king!';

  return (
    <div className="h-[100dvh] flex flex-col bg-chess-page overflow-hidden relative">
      <style>{`
        @keyframes cml-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .cml-shake { animation: cml-shake 0.4s ease-in-out; }
        @keyframes cml-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Logo */}
      <div className="pt-5 pl-5">
        <AnimatedLogo size={0.28} perpetual theme="light" />
      </div>

      {/* Headline — near-zero copy, message-matches the ad */}
      <div className="px-6 max-w-lg mx-auto w-full text-center mt-1">
        <h1 className="font-black text-chess-text leading-tight" style={{ fontSize: 'clamp(22px, 6.5vw, 30px)' }}>
          {solved ? 'Checkmate!' : 'Checkmate in one move.'}
        </h1>
        {!solved && (
          <p className="mt-1 text-chess-text-muted font-semibold" style={{ fontSize: 'clamp(13px, 3.6vw, 15px)' }}>
            White to move
          </p>
        )}
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center px-3">
        <div className="w-full max-w-[min(92vw,440px)] md:max-w-[520px] mx-auto">
          <div className={shake ? 'cml-shake' : ''}>
            <ChessPathBoard
              options={{
                position: currentFen,
                boardOrientation: 'white',
                onSquareClick: solved ? undefined : onSquareClick,
                onPieceDrop: (solved ? undefined : onPieceDrop) as never,
                allowDragging: !solved,
                squareStyles,
                arrows: boardArrows,
                animationDurationInMs: 250,
                draggingPieceGhostStyle: { opacity: 1 },
                darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
                lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
              }}
            />
          </div>
        </div>
      </div>

      {/* Rookie hint bar (tap guidance → win quip) */}
      <div
        key={`${solved}-${wrongCount}`}
        className="w-full"
        style={{ animation: 'cml-rise 0.3s ease-out' }}
      >
        <div className="max-w-lg mx-auto px-6 pb-3">
          <div
            className="rounded-2xl py-2.5 px-4 flex items-center gap-2.5"
            style={{
              backgroundColor: 'var(--color-chess-green)',
              boxShadow: '0 4px 0 var(--color-chess-green-dark), 0 2px 8px rgba(88, 204, 2, 0.3)',
            }}
          >
            <div className="flex-shrink-0">
              <BreathingRook size="xs" animate mood={solved ? 'happy' : 'neutral'} />
            </div>
            <p className="font-bold text-white leading-snug" style={{ fontSize: 15 }}>
              {hintMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Sign in (low-emphasis escape for returning users) */}
      {!showSignup && (
        <div className="text-center pb-5">
          <button
            onClick={onSignIn}
            className="text-[13px] font-semibold text-chess-text-muted hover:text-chess-text transition-colors min-h-[44px] px-4"
          >
            I already have an account
          </button>
        </div>
      )}

      {/* Win → capture signup at the peak, then continue the real lesson 1.1.1 */}
      {showSignup && (
        <SignupPrompt
          source="checkmate"
          valueLabel="first win"
          nextOverride={POST_WIN_ROUTE}
          onDismiss={() => onContinue(POST_WIN_ROUTE)}
        />
      )}
    </div>
  );
}
