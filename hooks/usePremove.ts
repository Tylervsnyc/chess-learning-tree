import { useCallback, useEffect, useRef, useState } from 'react';
import type { Square } from 'chess.js';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { isPremoveLegal, type Premove } from '@/lib/chess/premove';

interface UsePremoveOptions {
  /** Current position. The runner is keyed on this — it fires when the FEN changes. */
  fen: string;
  /** Is it the player's turn in `fen`? */
  isMyTurn: boolean;
  /**
   * The surface's normal move handler — the SAME one a hand-made move goes
   * through, so sounds, speech, mood, eval, logging, game-over and the
   * opponent's next reply all fire identically.
   */
  tryMove: (from: Square, to: Square) => boolean;
  /** Off during setup screens, exercise segments, game over, review, etc. */
  enabled: boolean;
  /**
   * Puzzle/lesson surfaces only: return false to cancel silently instead of
   * playing. Their `tryMove` scores a legal-but-wrong move as a WRONG ANSWER —
   * a premove must never cost someone a puzzle.
   */
  validate?: (from: Square, to: Square) => boolean;
  /**
   * Wait this long after the opponent's move lands before playing the premove,
   * so their move finishes animating first. Defaults to the 300ms board
   * animation every surface uses. (Lichess fires instantly; for beginners two
   * moves in the same frame is unreadable.)
   */
  fireDelayMs?: number;
}

interface UsePremoveResult {
  /** The pending premove, for square highlighting. */
  premove: Premove | null;
  setPremove: (premove: Premove | null) => void;
  clearPremove: () => void;
  /** Flag + `enabled`, resolved — pass straight into useClickToMove. */
  premoveEnabled: boolean;
}

/**
 * Owns the one pending premove and plays it when the turn comes back around.
 *
 * The runner is an EFFECT keyed on `fen`, not a call inside the opponent's move
 * handler, and that's load-bearing: every `tryMove` in this codebase closes over
 * the `fen` STATE (`new Chess(fen)`), so firing synchronously from
 * `applyRookieMove` would play the premove against the pre-opponent position.
 * Running after the commit means the existing handler needs no changes at all.
 */
export function usePremove({
  fen,
  isMyTurn,
  tryMove,
  enabled,
  validate,
  fireDelayMs = 300,
}: UsePremoveOptions): UsePremoveResult {
  const premoveEnabled = FEATURE_FLAGS.PREMOVE && enabled;
  const [premove, setPremoveState] = useState<Premove | null>(null);

  // Latest-value refs so the runner effect can depend on `fen` alone — it must
  // fire once per position, never again because a callback identity changed.
  const tryMoveRef = useRef(tryMove);
  tryMoveRef.current = tryMove;
  const validateRef = useRef(validate);
  validateRef.current = validate;
  const premoveRef = useRef(premove);
  premoveRef.current = premove;
  const isMyTurnRef = useRef(isMyTurn);
  isMyTurnRef.current = isMyTurn;

  const clearPremove = useCallback(() => setPremoveState(null), []);
  const setPremove = useCallback((next: Premove | null) => setPremoveState(next), []);

  // Drop the pending premove whenever the board stops accepting input (new
  // game, game over, bell, exercise segment, review) so nothing stale can fire
  // into a position it wasn't set for.
  useEffect(() => {
    if (!premoveEnabled) setPremoveState(null);
  }, [premoveEnabled]);

  const firedForFen = useRef<string | null>(null);

  useEffect(() => {
    if (!premoveEnabled) return;
    const pending = premoveRef.current;
    if (!pending || !isMyTurnRef.current) return;
    if (firedForFen.current === fen) return;
    firedForFen.current = fen;

    // Clear FIRST — whatever happens next, this premove is spent.
    setPremoveState(null);

    if (!isPremoveLegal(fen, pending)) return;
    if (validateRef.current && !validateRef.current(pending.from, pending.to)) return;

    const timer = setTimeout(() => tryMoveRef.current(pending.from, pending.to), fireDelayMs);
    return () => clearTimeout(timer);
  }, [fen, premoveEnabled, fireDelayMs]);

  return { premove, setPremove, clearPremove, premoveEnabled };
}
