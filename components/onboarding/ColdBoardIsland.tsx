'use client';

// MINIMAL interactivity island for the cold-IG fast landing (ColdBoardLanding).
//
// CRITICAL BUNDLE RULE: nothing heavy on the critical path. This file does NOT
// static-import chess.js, react-chessboard, lib/quips/*, lib/sounds, or
// canvas-confetti. The ONLY legal/winning move is hardcoded (d3->h7#), so no
// chess engine is needed. Confetti (lib/confetti — already lazy) and the
// SignupPrompt chain load via `await import(...)` AFTER the win, never on mount.
//
// Tap-to-move: first tap selects the queen, second tap on the win square wins;
// any other tap is a gentle shake (never punishing). Analytics reuse the SAME
// OnboardingEvents names so the daily-report funnel keeps working.

import { useState, useRef, useCallback, useEffect } from 'react';
import type { ReactNode, ComponentType } from 'react';
import { OnboardingEvents } from '@/lib/analytics/posthog';
import { StaticBoard } from './ColdBoardLanding';

// Mirrors CheckmateLanding: win -> continue the real lesson 1.1.1.
const POST_WIN_ROUTE = '/lesson/1.1.1?from=onboarding';

// Lazily-loaded SignupPrompt (keeps its OAuth/supabase deps off the critical
// path). Resolved only after the win.
type SignupPromptProps = {
  onDismiss: () => void;
  source: 'checkmate';
  valueLabel: string;
  nextOverride: string;
};
type SignupPromptComponent = ComponentType<SignupPromptProps>;

export function ColdBoardIsland({
  pieces,
  queenSquare,
  winSquare,
  children,
}: {
  pieces: Record<string, string>;
  queenSquare: string;
  winSquare: string;
  /** SSR fallback board, rendered until this island hydrates + takes over. */
  children: ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [solved, setSolved] = useState(false);
  const [winLine, setWinLine] = useState('');
  const [SignupPrompt, setSignupPrompt] = useState<SignupPromptComponent | null>(null);

  const touchedRef = useRef(false);
  const wonRef = useRef(false);

  // Take over from the SSR fallback once mounted, and fire onboarding_started
  // exactly once (same event name the existing funnel reads).
  useEffect(() => {
    setHydrated(true);
    OnboardingEvents.started();
  }, []);

  const markTouched = useCallback(() => {
    if (touchedRef.current) return;
    touchedRef.current = true;
    OnboardingEvents.boardTouched();
  }, []);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }, []);

  const handleWin = useCallback(() => {
    if (wonRef.current) return;
    wonRef.current = true;
    setSolved(true);
    setSelected(null);
    setWinLine('Checkmate. You just won your first game of chess.');
    OnboardingEvents.checkmateWon();

    // Everything below is lazy — none of it is on the critical path.
    import('@/lib/confetti')
      .then((m) => m.fireConfetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } }))
      .catch(() => {});
    import('./SignupPrompt')
      .then((m) => setSignupPrompt(() => m.SignupPrompt))
      .catch(() => {});
  }, []);

  const onSquareTap = useCallback(
    (square: string) => {
      if (solved) return;
      markTouched();

      if (!selected) {
        // Only the player's queen is selectable — keeps the one-path intent.
        if (square === queenSquare) setSelected(square);
        return;
      }
      if (square === selected) {
        setSelected(null);
        return;
      }
      if (selected === queenSquare && square === winSquare) {
        handleWin();
        return;
      }
      // Re-select the queen if tapped again; otherwise gentle "not quite".
      if (square === queenSquare) {
        setSelected(queenSquare);
      } else {
        triggerShake();
        setSelected(null);
      }
    },
    [solved, selected, queenSquare, winSquare, markTouched, handleWin, triggerShake],
  );

  // After the win, drop the queen onto h7 + clear the captured pawn so the
  // board shows the mate without needing a chess engine.
  const displayPieces = solved
    ? (() => {
        const next = { ...pieces };
        delete next[queenSquare];
        next[winSquare] = 'Q';
        return next;
      })()
    : pieces;

  return (
    <>
      <style>{`
        @keyframes cbl-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes cbl-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Before hydration: render the SSR fallback verbatim (it already painted
          at FCP — no flash). After: the interactive board. Same StaticBoard. */}
      {!hydrated ? (
        children
      ) : (
        <StaticBoard
          pieces={displayPieces}
          queenSquare={solved ? '' : queenSquare}
          winSquare={solved ? '' : winSquare}
          selected={selected}
          shake={shake}
          onSquareTap={solved ? undefined : onSquareTap}
        />
      )}

      {solved && winLine && (
        <p
          className="mt-4 text-center font-black text-chess-text px-4"
          style={{ fontSize: 'clamp(15px, 4.5vw, 18px)', animation: 'cbl-rise 0.3s ease-out' }}
        >
          {winLine}
        </p>
      )}

      {/* Win -> capture signup at the peak, then continue real lesson 1.1.1.
          SignupPrompt is webview-safe (CHE-390) and carries utm/first-touch. */}
      {solved && SignupPrompt && (
        <SignupPrompt
          source="checkmate"
          valueLabel="first win"
          nextOverride={POST_WIN_ROUTE}
          onDismiss={() => {
            window.location.href = POST_WIN_ROUTE;
          }}
        />
      )}
    </>
  );
}
