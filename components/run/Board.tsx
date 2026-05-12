'use client';

import { useMemo } from 'react';
import { defaultPieces } from 'react-chessboard';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { RookieCell } from './RookieCell';
import { rookieLegalMoves } from '@/lib/run/movement';
import { nextEnemyMovers } from '@/lib/run/pawn-ai';
import type { AbilityTier } from '@/lib/run/abilities';
import type { BoardState, Coord, PieceType, RookieForm } from '@/lib/run/types';
import { fromSquare, toSquare } from '@/lib/run/types';

interface BoardProps {
  state: BoardState;
  /** Currently-selected square (Rookie's square when she's been tapped). */
  selectedSquare: string | null;
  /** Set during the death sequence so RookieCell can play her crumble anim. */
  dying?: boolean;
  /** True briefly after Rookie's form changes — plays the glitch effect. */
  glitching?: boolean;
  /** Transient bomb VFX — set when bomb resolves, cleared after the anim. */
  bombFx?: { file: number; rank: number; id: number } | null;
  /** Transient Aegis VFX — attacker lunges at Rookie then bounces back. */
  aegisFx?: { attackerSquare: string; rookieSquare: string; id: number } | null;
  /** Enemy piece currently selected as the telekinesis source (step 1 → 2).
   *  When set, that square gets a magical purple glow. */
  telekinesisTarget?: { file: number; rank: number } | null;
  /** Squares highlighted as ability move targets (movement-style abilities). */
  legalAbilityMoves?: Coord[];
  /** Tier of the active ability — drives highlight color. */
  abilityTier?: AbilityTier;
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

const ABILITY_TIER_DOT: Record<AbilityTier, string> = {
  1: 'rgba(120,113,108,0.55)',
  2: 'rgba(16,185,129,0.65)',
  3: 'rgba(14,165,233,0.65)',
  4: 'rgba(245,158,11,0.75)',
  5: 'rgba(244,114,182,0.75)',
};

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
  bombFx = null,
  aegisFx = null,
  telekinesisTarget = null,
  legalAbilityMoves,
  abilityTier,
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

    // Ability move highlights — tier-colored dots / capture rings.
    if (legalAbilityMoves && legalAbilityMoves.length > 0) {
      const color = ABILITY_TIER_DOT[(abilityTier ?? 1) as AbilityTier];
      for (const m of legalAbilityMoves) {
        const sq = toSquare(m);
        const isCapture = state.pieces.some(
          (p) => p.file === m.file && p.rank === m.rank,
        );
        styles[sq] = {
          ...styles[sq],
          backgroundImage: isCapture
            ? `radial-gradient(circle, transparent 60%, ${color} 60%)`
            : `radial-gradient(circle, ${color} 22%, transparent 22%)`,
        };
      }
    }

    // Aegis passive shield — light-blue inset ring + faint wash on Rookie's
    // square whenever she has charges available. Layered with whatever's
    // already on that square (e.g. selection ring).
    const aegisOwned = state.abilities.find((a) => a.id === 'aegis');
    const aegisActive =
      !!aegisOwned && (aegisOwned.tier === 5 || aegisOwned.usesLeftThisLevel > 0);
    if (aegisActive && state.status === 'playing') {
      const rookieSq = toSquare(state.rookie);
      const prev = styles[rookieSq] ?? {};
      const aegisRing =
        'inset 0 0 0 3px rgba(56, 189, 248, 0.9), inset 0 0 16px rgba(125, 211, 252, 0.65)';
      const merged = prev.boxShadow ? `${prev.boxShadow}, ${aegisRing}` : aegisRing;
      styles[rookieSq] = {
        ...prev,
        boxShadow: merged,
      };
    }

    // Frozen-enemy highlight — icy blue wash with a shimmer overlay.
    for (const sq of state.frozenSquares) {
      styles[sq] = {
        ...styles[sq],
        backgroundColor: 'rgba(125, 211, 252, 0.55)',
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 3px, transparent 3px 8px)',
        boxShadow: 'inset 0 0 0 2px rgba(56, 189, 248, 0.9)',
      };
    }

    // 8th-rank "level cleared" gold blaze.
    if (state.status === 'won') {
      for (let f = 1; f <= 8; f++) {
        const sq = `${String.fromCharCode('a'.charCodeAt(0) + f - 1)}8`;
        styles[sq] = {
          ...styles[sq],
          backgroundColor: 'rgba(255, 215, 0, 0.85)',
          boxShadow: 'inset 0 0 18px rgba(255, 255, 255, 0.9)',
        };
      }
    }

    return styles;
  }, [state, selectedSquare, legalAbilityMoves, abilityTier]);

  const bombSquare = bombFx
    ? toSquare({ file: bombFx.file, rank: bombFx.rank })
    : null;

  const telekinesisSquare = telekinesisTarget
    ? toSquare({ file: telekinesisTarget.file, rank: telekinesisTarget.rank })
    : null;

  // Aegis lunge geometry — translate the attacker piece toward Rookie's
  // square (in units of "one square width = 100% of the piece") then back.
  const aegisLunge = useMemo(() => {
    if (!aegisFx) return null;
    const a = fromSquare(aegisFx.attackerSquare);
    const r = fromSquare(aegisFx.rookieSquare);
    const dx = (r.file - a.file) * 55; // 55% — stops short of fully entering
    const dy = -(r.rank - a.rank) * 55; // visual y inverts rank
    return { dx, dy, attackerSquare: aegisFx.attackerSquare, rookieSquare: aegisFx.rookieSquare, id: aegisFx.id };
  }, [aegisFx]);

  // Shield pulse — when Rookie has Aegis charges, gently pulse her square's
  // inset ring so the protection reads as alive.
  const rookieShieldSquare = useMemo(() => {
    const owned = state.abilities.find((a) => a.id === 'aegis');
    if (!owned) return null;
    if (owned.tier !== 5 && owned.usesLeftThisLevel <= 0) return null;
    if (state.status !== 'playing') return null;
    return toSquare(state.rookie);
  }, [state.abilities, state.rookie, state.status]);

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
        @keyframes rookiesRunFrozenShimmer {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.85; }
        }
        @keyframes rookiesRunBombFlash {
          0%   { transform: scale(0.4); opacity: 1; box-shadow: 0 0 0 0 rgba(255,180,40,0.95), 0 0 0 0 rgba(255,80,20,0.8); }
          40%  { transform: scale(1.6); opacity: 0.9; box-shadow: 0 0 40px 16px rgba(255,180,40,0.85), 0 0 80px 24px rgba(255,80,20,0.5); }
          100% { transform: scale(2.4); opacity: 0;   box-shadow: 0 0 60px 40px rgba(255,80,20,0); }
        }
        @keyframes rookiesRunTkPulse {
          0%, 100% { box-shadow: inset 0 0 0 3px rgba(168, 85, 247, 0.95), inset 0 0 24px rgba(217, 70, 239, 0.55); background-color: rgba(168, 85, 247, 0.22); }
          50%      { box-shadow: inset 0 0 0 4px rgba(217, 70, 239, 1),     inset 0 0 36px rgba(168, 85, 247, 0.85); background-color: rgba(217, 70, 239, 0.35); }
        }
        @keyframes rookiesRunTkFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-6%) rotate(-2deg); }
        }
        @keyframes rookiesRunTkSparkle {
          0%   { transform: scale(0.4) rotate(0deg);   opacity: 0; }
          30%  { transform: scale(1)   rotate(120deg); opacity: 1; }
          70%  { transform: scale(1.1) rotate(240deg); opacity: 0.9; }
          100% { transform: scale(0.3) rotate(360deg); opacity: 0; }
        }
        @keyframes rookiesRunGoalGlow {
          0%, 100% { filter: brightness(1); }
          50%      { filter: brightness(1.25); }
        }
        @keyframes rookiesRunAegisShieldPulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(125, 211, 252, 0.85)) drop-shadow(0 0 8px rgba(56, 189, 248, 0.55)); }
          50%      { filter: drop-shadow(0 0 7px rgba(125, 211, 252, 1))    drop-shadow(0 0 14px rgba(56, 189, 248, 0.9)); }
        }
        ${state.status === 'won'
          ? `[data-square$="8"] { animation: rookiesRunGoalGlow 1.2s ease-in-out infinite; }`
          : ''}
        ${state.frozenSquares
          .map(
            (sq) => `[data-square="${sq}"] > div > img,
                     [data-square="${sq}"] > div > svg {
               filter: drop-shadow(0 0 6px rgba(56,189,248,0.9)) saturate(0.6) brightness(1.05);
             }`,
          )
          .join('\n')}
        ${rookieShieldSquare
          ? `[data-square="${rookieShieldSquare}"] > div > img,
             [data-square="${rookieShieldSquare}"] > div > svg {
               animation: rookiesRunAegisShieldPulse 1.8s ease-in-out infinite;
             }`
          : ''}
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
      {bombSquare && (
        <style key={bombFx?.id}>{`
          [data-square="${bombSquare}"] {
            position: relative;
          }
          [data-square="${bombSquare}"]::after {
            content: '';
            position: absolute;
            inset: 8%;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,180,40,0.85) 35%, rgba(255,80,20,0.55) 65%, transparent 80%);
            pointer-events: none;
            z-index: 5;
            animation: rookiesRunBombFlash 600ms ease-out forwards;
          }
        `}</style>
      )}
      {aegisLunge && (
        <style key={aegisLunge.id}>{`
          @keyframes rookiesRunAegisLunge-${Math.floor(aegisLunge.id)} {
            0%   { transform: translate(0, 0) scale(1); }
            35%  { transform: translate(${aegisLunge.dx}%, ${aegisLunge.dy}%) scale(1.08); }
            55%  { transform: translate(${aegisLunge.dx * 0.92}%, ${aegisLunge.dy * 0.92}%) scale(0.92); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes rookiesRunAegisRipple-${Math.floor(aegisLunge.id)} {
            0%   { box-shadow: inset 0 0 0 0 rgba(125, 211, 252, 0.95), inset 0 0 0 rgba(56, 189, 248, 0); background-color: rgba(125, 211, 252, 0); }
            25%  { box-shadow: inset 0 0 0 6px rgba(125, 211, 252, 1),  inset 0 0 30px rgba(56, 189, 248, 0.95); background-color: rgba(125, 211, 252, 0.55); }
            100% { box-shadow: inset 0 0 0 0 rgba(125, 211, 252, 0),    inset 0 0 0 rgba(56, 189, 248, 0); background-color: rgba(125, 211, 252, 0); }
          }
          [data-square="${aegisLunge.attackerSquare}"] > div > img,
          [data-square="${aegisLunge.attackerSquare}"] > div > svg {
            animation: rookiesRunAegisLunge-${Math.floor(aegisLunge.id)} 700ms cubic-bezier(0.5, -0.2, 0.4, 1.4) both;
            z-index: 4;
          }
          [data-square="${aegisLunge.rookieSquare}"] {
            position: relative;
            animation: rookiesRunAegisRipple-${Math.floor(aegisLunge.id)} 700ms ease-out both;
          }
        `}</style>
      )}
      {telekinesisSquare && (
        <style>{`
          [data-square="${telekinesisSquare}"] {
            position: relative;
            animation: rookiesRunTkPulse 1.1s ease-in-out infinite;
            border-radius: 4px;
          }
          [data-square="${telekinesisSquare}"] > div > img,
          [data-square="${telekinesisSquare}"] > div > svg {
            animation: rookiesRunTkFloat 1.4s ease-in-out infinite;
            transform-origin: 50% 80%;
            filter: drop-shadow(0 0 8px rgba(217, 70, 239, 0.95)) drop-shadow(0 0 14px rgba(168, 85, 247, 0.75));
          }
          [data-square="${telekinesisSquare}"]::before {
            content: '✨';
            position: absolute;
            top: 4%;
            left: 6%;
            font-size: 38%;
            pointer-events: none;
            z-index: 5;
            animation: rookiesRunTkSparkle 1.6s ease-in-out infinite;
            filter: drop-shadow(0 0 4px rgba(255, 220, 130, 0.9));
          }
          [data-square="${telekinesisSquare}"]::after {
            content: '✨';
            position: absolute;
            bottom: 6%;
            right: 8%;
            font-size: 30%;
            pointer-events: none;
            z-index: 5;
            animation: rookiesRunTkSparkle 1.6s ease-in-out 0.5s infinite;
            filter: drop-shadow(0 0 4px rgba(255, 220, 130, 0.9));
          }
        `}</style>
      )}
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
