'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Chess, type Square } from 'chess.js';
import type { PositionEval } from '@/lib/game-eval';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';

/**
 * "Try it" variations in the post-game review.
 *
 * Owns ONE optional branch off the mainline: the user moves BOTH sides from
 * any reviewed position, we keep a single linear line (no tree), and show the
 * engine's best move for whoever is to move at every position in it.
 *
 * Engine sequencing: the shared Stockfish adapter runs one `go` at a time from
 * a FIFO queue, and the deep post-game pass awaits each position before
 * enqueuing the next. A branch eval queued mid-pass therefore runs right after
 * the deep search that's in flight and never cancels it — it just delays the
 * next deep position by ~1s (depth 12). Nothing here calls `stockfish.cancel()`.
 */

export interface BranchMove {
  san: string;
  from: string;
  to: string;
  /** UCI, e.g. "e2e4" / "e7e8q". */
  uci: string;
  fenAfter: string;
}

export interface ReviewBranch {
  /** Mainline reviewMoveIndex the branch roots at (-1 = start position). */
  rootPly: number;
  /** FEN of that mainline position. */
  rootFen: string;
  moves: BranchMove[];
  /** Index within `moves`; -1 = at the root. */
  cursor: number;
  /** index i = eval of the position after branch move i. */
  evals: (PositionEval | null)[];
}

export interface MainlinePosition {
  ply: number;
  fen: string;
  /** Eval of that mainline position (for the instant best-line hint). */
  eval?: PositionEval | null;
}

interface Options {
  /** Where the board currently is on the mainline (read when a branch starts). */
  getMainline: () => MainlinePosition;
  /** Engine depth for branch positions. */
  depth?: number;
}

const BRANCH_DEPTH = 12;

function toUci(m: { from: string; to: string; promotion?: string }): string {
  return `${m.from}${m.to}${m.promotion ?? ''}`;
}

/** "10. Bxf7+ Kxf7 11. Ng5+" (or "10... Kxf7 11. Ng5+" when the line starts with black). */
export function formatBranchLine(rootFen: string, sans: string[]): string {
  if (sans.length === 0) return '';
  const parts = rootFen.split(' ');
  let white = (parts[1] || 'w') === 'w';
  let num = parseInt(parts[5] || '1', 10) || 1;
  const out: string[] = [];
  sans.forEach((san, i) => {
    if (white) out.push(`${num}. ${san}`);
    else {
      out.push(i === 0 ? `${num}... ${san}` : san);
      num++;
    }
    white = !white;
  });
  return out.join(' ');
}

export function useReviewBranch({ getMainline, depth = BRANCH_DEPTH }: Options) {
  const [branch, setBranch] = useState<ReviewBranch | null>(null);
  const branchRef = useRef(branch);
  branchRef.current = branch;
  // Bumped on exit()/new branch so in-flight engine results for a dead branch are dropped.
  const genRef = useRef(0);
  const getMainlineRef = useRef(getMainline);
  getMainlineRef.current = getMainline;

  const inBranch = branch !== null;
  const cursor = branch?.cursor ?? -1;
  const currentMove = branch && cursor >= 0 ? branch.moves[cursor] : null;
  const currentFen = branch ? (cursor >= 0 ? branch.moves[cursor].fenAfter : branch.rootFen) : null;
  const currentEval: PositionEval | null | undefined = branch
    ? (cursor >= 0 ? branch.evals[cursor] : getMainlineRef.current().eval)
    : null;

  /** Request a refined eval for branch move `index` (position `fen`). */
  const requestEval = useCallback((index: number, fen: string) => {
    const gen = genRef.current;
    stockfish.getFullEval(fen, depth).then((result) => {
      if (!result || gen !== genRef.current) return;
      setBranch((prev) => {
        // The line may have been truncated + re-extended: only store if the
        // position at this index is still the one we evaluated.
        if (!prev || prev.moves[index]?.fenAfter !== fen) return prev;
        const evals = prev.evals.slice();
        evals[index] = {
          cp: result.cp,
          mate: result.mate,
          bestMove: result.bestMove,
          bestLine: result.bestLine,
          depth,
        };
        return { ...prev, evals };
      });
    }).catch(() => {});
  }, [depth]);

  /**
   * Play `from`→`to` from the current position. From a mainline position this
   * starts a new branch (discarding any old one); from a branch position it
   * extends the line, truncating anything after the cursor first.
   * Returns false when the move is illegal.
   */
  const startOrExtend = useCallback((from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n'): boolean => {
    const prev = branchRef.current;
    const root = prev ? null : getMainlineRef.current();
    const baseFen = prev
      ? (prev.cursor >= 0 ? prev.moves[prev.cursor].fenAfter : prev.rootFen)
      : root!.fen;

    const g = new Chess(baseFen);
    let mv;
    try {
      mv = g.move({ from, to, promotion: promotion ?? 'q' });
    } catch {
      return false;
    }
    if (!mv) return false;

    const move: BranchMove = { san: mv.san, from: mv.from, to: mv.to, uci: toUci(mv), fenAfter: g.fen() };

    let next: ReviewBranch;
    if (!prev) {
      genRef.current++;
      next = { rootPly: root!.ply, rootFen: root!.fen, moves: [move], cursor: 0, evals: [null] };
    } else {
      const keep = prev.cursor + 1; // truncate after the cursor — one linear line
      next = {
        ...prev,
        moves: [...prev.moves.slice(0, keep), move],
        evals: [...prev.evals.slice(0, keep), null],
        cursor: keep,
      };
    }

    // Instant source: if the user just played the engine's best move from the
    // previous position, that eval's PV already tells us the next best move.
    const prevEval: PositionEval | null | undefined = next.cursor === 0
      ? (root?.eval ?? getMainlineRef.current().eval)
      : next.evals[next.cursor - 1];
    if (prevEval?.bestMove === move.uci && prevEval.bestLine.length > 1) {
      next.evals[next.cursor] = {
        cp: prevEval.cp,
        mate: prevEval.mate,
        bestMove: prevEval.bestLine[1],
        bestLine: prevEval.bestLine.slice(1),
        depth: 0, // provisional — refined below
      };
    }

    branchRef.current = next;
    setBranch(next);
    requestEval(next.cursor, move.fenAfter);
    return true;
  }, [requestEval]);

  const back = useCallback(() => {
    setBranch((prev) => (prev && prev.cursor >= 0 ? { ...prev, cursor: prev.cursor - 1 } : prev));
  }, []);

  const forward = useCallback(() => {
    setBranch((prev) => (prev && prev.cursor < prev.moves.length - 1 ? { ...prev, cursor: prev.cursor + 1 } : prev));
  }, []);

  const exit = useCallback(() => {
    genRef.current++;
    branchRef.current = null;
    setBranch((prev) => (prev ? null : prev));
  }, []);

  const lineSan = useMemo(
    () => (branch ? formatBranchLine(branch.rootFen, branch.moves.map((m) => m.san)) : ''),
    [branch],
  );

  const bestMoveForCurrent = currentEval?.bestMove ?? null;

  // Drop any in-flight results on unmount.
  useEffect(() => () => { genRef.current++; }, []);

  return {
    branch,
    inBranch,
    rootPly: branch?.rootPly ?? -1,
    cursor,
    atTip: !branch || cursor >= branch.moves.length - 1,
    currentFen,
    currentMove,
    currentEval: currentEval ?? null,
    lineSan,
    bestMoveForCurrent,
    startOrExtend,
    back,
    forward,
    exit,
  };
}
