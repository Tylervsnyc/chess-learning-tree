'use client';

import { useMemo } from 'react';
import { defaultPieces } from 'react-chessboard';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { RookieCell } from './RookieCell';
import { rookieLegalMoves } from '@/lib/run/movement';
import { nextEnemyMovers } from '@/lib/run/pawn-ai';
import type { BoardState, PieceType, RookieForm } from '@/lib/run/types';
import { toSquare } from '@/lib/run/types';

interface BoardProps {
  state: BoardState;
  /** Currently-selected square (Rookie's square when she's been tapped). */
  selectedSquare: string | null;
  /** Set during the death sequence so RookieCell can play her crumble anim. */
  dying?: boolean;
  /** True briefly after Rookie's form changes — plays the glitch effect. */
  glitching?: boolean;
  onSquareClick: (square: string) => void;
  /** Called when Rookie is dragged onto a square. Return true to accept the
   *  move, false to snap her back. */
  onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
}

// Goal-row gold — strong amber wash so rank 8 reads as "the finish line".
const GOAL_GLOW = 'rgba(255, 191, 36, 0.55)';
// Hazard squares — dark crimson wash with a subtle no-entry vibe.
const HAZARD_BG = 'rgba(190, 18, 60, 0.45)';
const HAZARD_PATTERN =
  'repeating-linear-gradient(45deg, rgba(0,0,0,0.18) 0 6px, transparent 6px 12px)';
// Selected-piece highlight — same blue as /learn (BasicsTutorial pattern).
const SELECTED_BG = 'rgba(28, 176, 246, 0.18)';
const SELECTED_RING = 'inset 0 0 0 3px rgba(28, 176, 246, 0.75)';
// Legal-move dot (empty square) and capture ring — radial-gradient pattern
// lifted from the /learn tutorial board.
const MOVE_DOT =
  'radial-gradient(circle, rgba(0, 0, 0, 0.22) 22%, transparent 22%)';
const CAPTURE_RING =
  'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.32) 60%)';

const ROOKIE_SPRITE: Record<RookieForm, string> = {
  rook: 'wR',
  knight: 'wN',
  bishop: 'wB',
  queen: 'wQ',
};

const ENEMY_SPRITE: Record<PieceType, string> = {
  pawn: 'bP',
  knight: 'bN',
  bishop: 'bB',
  queen: 'bQ',
};

export function RunBoard({
  state,
  selectedSquare,
  dying = false,
  glitching = false,
  onSquareClick,
  onPieceDrop,
}: BoardProps) {
  const rookieSprite = ROOKIE_SPRITE[state.form];

  const position = useMemo(() => {
    const map: Record<string, { pieceType: string }> = {};
    for (const p of state.pieces) {
      map[toSquare(p)] = { pieceType: ENEMY_SPRITE[p.type] };
    }
    map[toSquare(state.rookie)] = { pieceType: rookieSprite };
    return map;
  }, [state.rookie, state.pieces, rookieSprite]);

  const wiggleSquares = useMemo(() => {
    if (state.status !== 'playing' || state.turn !== 'rookie') return [];
    return nextEnemyMovers(state).map((p) => toSquare(p));
  }, [state]);

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Goal rank gold wash.
    for (let f = 1; f <= 8; f++) {
      const sq = `${String.fromCharCode('a'.charCodeAt(0) + f - 1)}8`;
      styles[sq] = { backgroundColor: GOAL_GLOW };
    }

    // Hazard squares — dark wash + hatched pattern.
    for (const h of state.hazards) {
      const sq = toSquare(h);
      styles[sq] = {
        ...styles[sq],
        backgroundColor: HAZARD_BG,
        backgroundImage: HAZARD_PATTERN,
      };
    }

    // Selection: only when Rookie is selected, show her ring + legal-move
    // dots/rings.
    if (selectedSquare && state.turn === 'rookie' && state.status === 'playing') {
      styles[selectedSquare] = {
        ...styles[selectedSquare],
        backgroundColor: SELECTED_BG,
        boxShadow: SELECTED_RING,
      };
      for (const m of rookieLegalMoves(state)) {
        const sq = toSquare(m);
        const isCapture = state.pieces.some(
          (p) => p.file === m.file && p.rank === m.rank,
        );
        styles[sq] = {
          ...styles[sq],
          backgroundImage: isCapture ? CAPTURE_RING : MOVE_DOT,
        };
      }
    }

    return styles;
  }, [state, selectedSquare]);

  const pieces = useMemo(
    () => ({
      ...defaultPieces,
      // Custom Rookie sprite for each of her three forms.
      wR: () => (
        <RookieCell
          form="rook"
          dying={dying && state.form === 'rook'}
          glitching={glitching && state.form === 'rook'}
        />
      ),
      wN: () => (
        <RookieCell
          form="knight"
          dying={dying && state.form === 'knight'}
          glitching={glitching && state.form === 'knight'}
        />
      ),
      wB: () => (
        <RookieCell
          form="bishop"
          dying={dying && state.form === 'bishop'}
          glitching={glitching && state.form === 'bishop'}
        />
      ),
      wQ: () => (
        <RookieCell
          form="queen"
          dying={dying && state.form === 'queen'}
          glitching={glitching && state.form === 'queen'}
        />
      ),
    }),
    [dying, glitching, state.form],
  );

  return (
    <>
      <style>{`
        @keyframes rookiesRunWiggle {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25%      { transform: translateX(-1.5px) rotate(-3deg); }
          75%      { transform: translateX(1.5px) rotate(3deg); }
        }
        @keyframes rookieCrumble {
          0%   { opacity: 1;   transform: scale(1)    rotate(0deg);  filter: brightness(1); }
          40%  { opacity: 0.9; transform: scale(0.96) rotate(-4deg); filter: brightness(0.85); }
          70%  { opacity: 0.6; transform: scale(0.78) rotate(6deg)   translateY(2px); filter: brightness(0.5); }
          100% { opacity: 0;   transform: scale(0.4)  rotate(-10deg) translateY(8px); filter: brightness(0.3); }
        }
        @keyframes rookieGlitchBase {
          0%, 100% { transform: translate(0, 0); }
          20%      { transform: translate(2px, 0); }
          40%      { transform: translate(-2px, 0); }
          60%      { transform: translate(0, 1px); }
          80%      { transform: translate(1px, -1px); }
        }
        @keyframes rookieGlitchShakeR {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          10%      { transform: translate(3px, -2px); opacity: 0.75; }
          30%      { transform: translate(-2px, 1px); opacity: 0.6; }
          50%      { transform: translate(4px, 2px); opacity: 0.75; }
          70%      { transform: translate(-3px, -1px); opacity: 0.5; }
        }
        @keyframes rookieGlitchShakeB {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          15%      { transform: translate(-3px, 2px); opacity: 0.75; }
          35%      { transform: translate(2px, -1px); opacity: 0.6; }
          55%      { transform: translate(-4px, -2px); opacity: 0.75; }
          75%      { transform: translate(3px, 1px); opacity: 0.5; }
        }
        @keyframes rookieGlitchScan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
        ${wiggleSquares
          .map(
            (sq) => `[data-square="${sq}"] > div > img,
                     [data-square="${sq}"] > div > svg {
               animation: rookiesRunWiggle 1.4s ease-in-out infinite;
               transform-origin: 50% 80%;
             }`,
          )
          .join('\n')}
      `}</style>
      <ChessPathBoard
        options={{
          id: 'rookies-run-board',
          position,
          pieces,
          squareStyles,
          showNotation: false,
          boardOrientation: 'white',
          allowDragging: true,
          canDragPiece: ({ piece }) =>
            piece?.pieceType === rookieSprite &&
            state.turn === 'rookie' &&
            state.status === 'playing',
          onPieceDrop: ({ sourceSquare, targetSquare }) =>
            targetSquare ? onPieceDrop(sourceSquare, targetSquare) : false,
          onSquareClick: ({ square }) => onSquareClick(square),
          animationDurationInMs: 300,
        }}
      />
    </>
  );
}
