'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import {
  processPuzzle,
  parseUciMove,
  isCorrectMove,
  isAlternateCheckmate,
  BOARD_COLORS,
  type RawPuzzle,
} from '@/lib/puzzle-utils';
import {
  playMoveSound,
  playCaptureSound,
  playCorrectSound,
  playErrorSound,
  vibrateOnCorrect,
  vibrateOnError,
} from '@/lib/sounds';

/**
 * A single puzzle the user solves inside an Interval Workout chess segment.
 *
 * Lichess puzzle convention (RULES.md §24): moves[0] is the OPPONENT'S setup
 * move. We apply it first (via processPuzzle), then the user plays from the
 * resulting position. Opponent replies in the solution line are auto-played.
 *
 * Forgiving, timed UX: a correct completing move -> onCorrect(); a wrong move
 * -> brief red flash, then onWrong() so the parent loads the next puzzle.
 */

export interface WorkoutPuzzleData {
  id?: string;
  puzzleId?: string;
  fen: string;
  moves: string[] | string;
  rating: number;
  themes?: string[];
}

interface Props {
  puzzle: WorkoutPuzzleData;
  onCorrect: () => void;
  onWrong: () => void;
}

export function WorkoutPuzzle({ puzzle, onCorrect, onWrong }: Props) {
  // Normalize moves to a string[] and build the processed (post-setup) puzzle.
  const processed = useMemo(() => {
    const movesArr = Array.isArray(puzzle.moves)
      ? puzzle.moves
      : puzzle.moves.split(' ');
    const raw: RawPuzzle = {
      id: puzzle.puzzleId || puzzle.id || 'workout',
      fen: puzzle.fen,
      moves: movesArr,
      rating: puzzle.rating,
      themes: puzzle.themes,
    };
    return processPuzzle(raw);
  }, [puzzle]);

  const [fen, setFen] = useState(processed.puzzleFen);
  const [moveIndex, setMoveIndex] = useState(0); // index into processed.solutionMoves
  const [status, setStatus] = useState<'playing' | 'wrong' | 'done'>('playing');
  const [selected, setSelected] = useState<Square | null>(null);
  const advancedRef = useRef(false);

  // Reset whenever a new puzzle is fed in.
  useEffect(() => {
    setFen(processed.puzzleFen);
    setMoveIndex(0);
    setStatus('playing');
    setSelected(null);
    advancedRef.current = false;
  }, [processed]);

  const game = useMemo(() => {
    try {
      return new Chess(fen);
    } catch {
      return null;
    }
  }, [fen]);

  const themes = useMemo(() => processed.themes ?? [], [processed.themes]);

  const finishWrong = useCallback(() => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    setStatus('wrong');
    playErrorSound();
    vibrateOnError();
    // Brief red feedback, then advance to the next puzzle.
    setTimeout(() => onWrong(), 650);
  }, [onWrong]);

  const finishCorrect = useCallback(() => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    setStatus('done');
    playCorrectSound(0);
    vibrateOnCorrect();
    setTimeout(() => onCorrect(), 450);
  }, [onCorrect]);

  const tryMove = useCallback(
    (from: Square, to: Square): boolean => {
      if (!game || status !== 'playing') return false;
      if (moveIndex >= processed.solutionMoves.length) return false;

      const copy = new Chess(game.fen());
      let move;
      try {
        move = copy.move({ from, to, promotion: 'q' });
      } catch {
        return false;
      }
      if (!move) return false;

      const expectedUci = processed.solutionMoves[moveIndex];
      const promotion = move.promotion;
      const correct =
        isCorrectMove(from, to, promotion, expectedUci) ||
        isAlternateCheckmate(copy, themes);

      if (!correct) {
        finishWrong();
        return false;
      }

      // Correct move — apply it.
      setFen(copy.fen());
      setSelected(null);
      if (move.captured) playCaptureSound();
      else playMoveSound();

      const next = moveIndex + 1;
      setMoveIndex(next);

      if (next >= processed.solutionMoves.length || copy.isCheckmate()) {
        finishCorrect();
        return true;
      }

      // Auto-play opponent's reply, then it's the user's turn again.
      setTimeout(() => {
        const oppGame = new Chess(copy.fen());
        const oppUci = processed.solutionMoves[next];
        const { from: of, to: ot, promotion: op } = parseUciMove(oppUci);
        try {
          const opp = oppGame.move({ from: of, to: ot, promotion: op });
          if (opp) {
            setFen(oppGame.fen());
            setMoveIndex(next + 1);
            if (opp.captured) playCaptureSound();
            else playMoveSound();
            if (next + 1 >= processed.solutionMoves.length) {
              finishCorrect();
            }
          }
        } catch {
          finishCorrect();
        }
      }, 350);

      return true;
    },
    [game, status, moveIndex, processed, themes, finishWrong, finishCorrect],
  );

  // Click-to-move support (mirrors lesson page selection behavior).
  const onSquareClick = useCallback(
    ({ square }: { square: string }) => {
      if (!game || status !== 'playing') return;
      const sq = square as Square;
      if (selected) {
        if (sq === selected) {
          setSelected(null);
          return;
        }
        const moved = tryMove(selected, sq);
        if (!moved) {
          // If clicking another own piece, switch selection.
          const piece = game.get(sq);
          if (piece && piece.color === game.turn()) {
            setSelected(sq);
          } else {
            setSelected(null);
          }
        }
        return;
      }
      const piece = game.get(sq);
      if (piece && piece.color === game.turn()) {
        setSelected(sq);
      }
    },
    [game, status, selected, tryMove],
  );

  // Square highlights: setup move (orange) on first move, selection + legal
  // dots (blue). Explicitly clear stale squares to {} (react-chessboard v5).
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    if (moveIndex === 0 && status === 'playing') {
      styles[processed.lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
      styles[processed.lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
    }

    if (selected && game) {
      styles[selected] = { backgroundColor: 'rgba(100, 200, 255, 0.6)' };
      for (const m of game.moves({ square: selected, verbose: true })) {
        styles[m.to] = {
          background: m.captured
            ? 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.3) 60%)'
            : 'radial-gradient(circle, rgba(0,0,0,0.2) 25%, transparent 25%)',
        };
      }
    }

    return styles;
  }, [moveIndex, status, selected, game, processed.lastMoveFrom, processed.lastMoveTo]);

  return (
    <div className="w-full max-w-[440px] mx-auto">
      <div
        className="relative w-full"
        style={{
          outline: status === 'wrong' ? '4px solid var(--color-chess-red)' : 'none',
          borderRadius: 8,
          transition: 'outline-color 120ms ease',
        }}
      >
        <ChessPathBoard
          options={{
            position: fen,
            boardOrientation: processed.playerColor,
            onPieceDrop: (args: { sourceSquare: string; targetSquare: string | null }) =>
              args.targetSquare
                ? tryMove(args.sourceSquare as Square, args.targetSquare as Square)
                : false,
            onSquareClick,
            squareStyles,
            animationDurationInMs: 250,
            darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
            lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
          }}
        />
      </div>
    </div>
  );
}
