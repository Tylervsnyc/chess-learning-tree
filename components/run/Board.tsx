'use client';

import { useMemo } from 'react';
import { defaultPieces } from 'react-chessboard';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { RookieCell } from './RookieCell';
import { rookieLegalMoves } from '@/lib/run/movement';
import { nextEnemyMovers } from '@/lib/run/pawn-ai';
import { visibleEnemySquares } from '@/lib/run/abilities';
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
  /** Transient Aegis VFX — attacker lunges at Rookie then bounces back. */
  aegisFx?: { attackerSquare: string; rookieSquare: string; id: number } | null;
  /** Transient per-ability cast VFX (charge / phase / leap / dart casts). */
  abilityFx?: {
    kind:
      | 'pawn-charge'
      | 'phase-step'
      | 'leap'
      | 'freeze-ray'
      | 'poison-dart'
      | 'rabies-dart';
    from: string;
    to: string;
    id: number;
  } | null;
  /** Transient poison-death VFX — green bubbles drowning each dying piece. */
  poisonDeathFx?: {
    deaths: { square: string; pieceType: PieceType }[];
    id: number;
  } | null;
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

// Goal-row "Enchanted Dawn" — soft golden sunrise gradient so rank 8 reads as
// a magical finish-line. Animated motes/haze added via overlay in JSX.
const GOAL_GRADIENT =
  'linear-gradient(180deg, #fff1b8 0%, #ffd56a 45%, #e89c1a 100%)';
const GOAL_INSET_RING = 'inset 0 0 0 1px rgba(255,245,200,0.5)';

// Scattered mote positions for the goal-row overlay — non-uniform so the
// magic doesn't read as a repeating tile pattern.
// [left%, top%, sizePx, delayS, durS]
const GOAL_MOTES: Array<[number, number, number, number, number]> = [
  [3, 60, 2, 0.0, 4.1], [9, 22, 3, 1.3, 4.8], [14, 78, 2, 0.6, 3.9],
  [18, 38, 4, 2.0, 5.1], [23, 12, 2, 0.9, 4.4], [27, 65, 3, 1.6, 4.6],
  [33, 42, 2, 0.3, 4.0], [38, 88, 3, 2.2, 5.0], [42, 18, 5, 0.5, 5.4],
  [47, 55, 2, 1.1, 4.2], [52, 30, 3, 1.8, 4.7], [57, 72, 2, 0.4, 3.8],
  [62, 8, 3, 2.4, 4.9], [66, 48, 4, 0.7, 5.2], [71, 82, 2, 1.4, 4.3],
  [75, 25, 3, 2.1, 4.8], [79, 60, 2, 0.8, 4.0], [84, 15, 4, 1.5, 5.0],
  [88, 70, 3, 0.2, 4.5], [93, 40, 2, 1.9, 4.4], [97, 85, 3, 1.0, 4.6],
];
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
  aegisFx = null,
  abilityFx = null,
  poisonDeathFx = null,
  telekinesisTarget = null,
  legalAbilityMoves,
  abilityTier,
  onSquareClick,
  onPieceDrop,
}: BoardProps) {
  const rookieSprite = ROOKIE_SPRITE[state.form];

  const rookieSq = toSquare(state.rookie);
  const attackerAtRookie = useMemo(
    () =>
      state.status === 'lost'
        ? state.pieces.find(
            (p) => p.file === state.rookie.file && p.rank === state.rookie.rank,
          ) ?? null
        : null,
    [state.status, state.pieces, state.rookie],
  );

  const position = useMemo(() => {
    const map: Record<string, { pieceType: string }> = {};
    for (const p of state.pieces) {
      const sq = toSquare(p);
      // The attacker on Rookie's square is rendered as a static overlay
      // (below) so the chessboard's piece-animation can't hide it.
      if (state.status === 'lost' && sq === rookieSq) continue;
      map[sq] = { pieceType: ENEMY_SPRITE[p.type] };
    }
    if (state.status !== 'lost') {
      map[rookieSq] = { pieceType: rookieSprite };
    }
    return map;
  }, [state.pieces, rookieSprite, state.status, rookieSq]);

  const wiggleSquares = useMemo(() => {
    if (state.status !== 'playing' || state.turn !== 'rookie') return [];
    return nextEnemyMovers(state).map((p) => toSquare(p));
  }, [state]);

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Goal rank — "Enchanted Dawn" golden sunrise gradient.
    for (let f = 1; f <= 8; f++) {
      const sq = `${String.fromCharCode('a'.charCodeAt(0) + f - 1)}8`;
      styles[sq] = {
        backgroundImage: GOAL_GRADIENT,
        boxShadow: GOAL_INSET_RING,
      };
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
        const prev = styles[sq] ?? {};
        const dotLayer = isCapture ? CAPTURE_RING : MOVE_DOT;
        styles[sq] = {
          ...prev,
          backgroundImage: prev.backgroundImage
            ? `${dotLayer}, ${prev.backgroundImage}`
            : dotLayer,
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
        const prev = styles[sq] ?? {};
        const dotLayer = isCapture
          ? `radial-gradient(circle, transparent 60%, ${color} 60%)`
          : `radial-gradient(circle, ${color} 22%, transparent 22%)`;
        styles[sq] = {
          ...prev,
          backgroundImage: prev.backgroundImage
            ? `${dotLayer}, ${prev.backgroundImage}`
            : dotLayer,
        };
      }
    }

    // Dart-style abilities (freeze ray, poison dart, rabies dart) highlight
    // every enemy Rookie can currently SEE — line-of-sight per current form.
    const activeId = state.activeAbility?.id;
    const isDartActive =
      activeId === 'freeze-ray' ||
      activeId === 'poison-dart' ||
      activeId === 'rabies-dart';
    if (isDartActive && state.activeAbility?.step === 'pick-enemy') {
      const color = ABILITY_TIER_DOT[(abilityTier ?? 1) as AbilityTier];
      for (const c of visibleEnemySquares(state)) {
        const sq = toSquare(c);
        const prev = styles[sq] ?? {};
        const ring = `radial-gradient(circle, transparent 58%, ${color} 58% 68%, transparent 68%)`;
        styles[sq] = {
          ...prev,
          backgroundImage: prev.backgroundImage
            ? `${ring}, ${prev.backgroundImage}`
            : ring,
        };
      }
    }

    // Aegis shield — light-blue inset ring + wash on Rookie's square whenever
    // her shield is currently raised. Layered with whatever's already on that
    // square (e.g. selection ring).
    if (state.shieldUp && state.status === 'playing') {
      const rookieSq = toSquare(state.rookie);
      const prev = styles[rookieSq] ?? {};
      const aegisRing =
        'inset 0 0 0 5px rgba(56, 189, 248, 1), inset 0 0 0 7px rgba(255, 255, 255, 0.85), inset 0 0 24px rgba(125, 211, 252, 0.9)';
      const merged = prev.boxShadow ? `${prev.boxShadow}, ${aegisRing}` : aegisRing;
      styles[rookieSq] = {
        ...prev,
        boxShadow: merged,
      };
    }

    // Decoy mark — pulsing violet ring + jester-magic wash on the marked
    // square. Teammates will treat this piece as Rookie.
    if (state.decoyTarget) {
      const sq = state.decoyTarget;
      styles[sq] = {
        ...styles[sq],
        backgroundColor: 'rgba(168, 85, 247, 0.45)',
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(255, 215, 122, 0.35) 0 3px, transparent 3px 8px)',
        boxShadow:
          'inset 0 0 0 3px rgba(217, 70, 239, 0.95), inset 0 0 16px rgba(255, 215, 122, 0.7)',
        animation: 'decoyPulse 1.4s ease-in-out infinite',
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

    // Poisoned-piece highlight — sickly green wash with diagonal hatch.
    for (const sq of state.poisonedSquares) {
      styles[sq] = {
        ...styles[sq],
        backgroundColor: 'rgba(132, 204, 22, 0.4)',
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(101, 163, 13, 0.55) 0 3px, transparent 3px 9px)',
        boxShadow: 'inset 0 0 0 2px rgba(101, 163, 13, 0.95)',
      };
    }

    // Rabid-piece highlight — angry crimson wash with a vibrating ring.
    for (const sq of state.rabidSquares) {
      styles[sq] = {
        ...styles[sq],
        backgroundColor: 'rgba(220, 38, 38, 0.45)',
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(127, 29, 29, 0.5) 0 2px, transparent 2px 6px)',
        boxShadow:
          'inset 0 0 0 3px rgba(220, 38, 38, 1), inset 0 0 16px rgba(248, 113, 113, 0.85)',
        animation: 'rookiesRunRabidPulse 0.7s ease-in-out infinite',
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

  // Convert from→to squares into board-percentage centers for overlay VFX.
  // Board is rendered white-orientation: file 1 = leftmost, rank 8 = topmost.
  const fxGeom = useMemo(() => {
    if (!abilityFx) return null;
    const f = fromSquare(abilityFx.from);
    const t = fromSquare(abilityFx.to);
    const fromX = (f.file - 0.5) * 12.5;
    const fromY = (8 - f.rank + 0.5) * 12.5;
    const toX = (t.file - 0.5) * 12.5;
    const toY = (8 - t.rank + 0.5) * 12.5;
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;
    return { fromX, fromY, toX, toY, midX, midY, length, angleDeg, dx, dy };
  }, [abilityFx]);

  // Surge filter chain — N cyan ghost silhouettes echoed behind Rookie, one
  // per bonusMovesLeft. Zero-blur drop-shadows give a hard "clone" silhouette.
  const surgeFilter = useMemo(() => {
    const n = state.bonusMovesLeft;
    if (n <= 0) return null;
    const layers: string[] = ['drop-shadow(0 0 8px rgba(34,211,238,0.95))'];
    // Each clone shifts further back-left with shrinking opacity.
    for (let i = 1; i <= Math.min(n, 3); i++) {
      const dx = -i * 7;
      const dy = i * 3;
      const alpha = 0.75 - (i - 1) * 0.18;
      layers.push(`drop-shadow(${dx}px ${dy}px 0 rgba(34,211,238,${alpha}))`);
    }
    return layers.join(' ');
  }, [state.bonusMovesLeft]);

  // Shield pulse — when Rookie's Aegis shield is currently up, pulse her
  // square's inset ring so the protection reads as alive.
  const rookieShieldSquare = useMemo(() => {
    if (!state.shieldUp) return null;
    if (state.status !== 'playing') return null;
    return toSquare(state.rookie);
  }, [state.shieldUp, state.rookie, state.status]);

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
        @keyframes rookiesRunRabidPulse {
          0%, 100% {
            box-shadow: inset 0 0 0 3px rgba(220, 38, 38, 1), inset 0 0 16px rgba(248, 113, 113, 0.85);
          }
          50% {
            box-shadow: inset 0 0 0 4px rgba(239, 68, 68, 1), inset 0 0 24px rgba(252, 165, 165, 1);
          }
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
        @keyframes rookiesRunDawnMote {
          0%, 100% { opacity: 0; transform: translate(0, 0) scale(0.5); }
          50%      { opacity: 1; transform: translate(4px, -6px) scale(1); }
        }
        @keyframes rookiesRunAegisShieldPulse {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(125, 211, 252, 1)) drop-shadow(0 0 12px rgba(56, 189, 248, 0.85)); }
          50%      { filter: drop-shadow(0 0 12px rgba(125, 211, 252, 1)) drop-shadow(0 0 22px rgba(56, 189, 248, 1)); }
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
        ${surgeFilter
          ? `[data-square="${toSquare(state.rookie)}"] > div {
               filter: ${surgeFilter};
             }
             [data-square="${toSquare(state.rookie)}"]::before {
               content: '+${state.bonusMovesLeft}';
               position: absolute;
               top: 2%;
               right: 4%;
               font-size: 22%;
               font-weight: 900;
               color: #ecfeff;
               background: linear-gradient(135deg, #06b6d4, #0891b2);
               padding: 4% 7%;
               border-radius: 999px;
               box-shadow: 0 0 8px rgba(34,211,238,0.9), inset 0 0 4px rgba(255,255,255,0.5);
               pointer-events: none;
               z-index: 6;
               line-height: 1;
               animation: rookiesRunSurgePulse 1s ease-in-out infinite;
             }
             [data-square="${toSquare(state.rookie)}"] {
               position: relative;
             }`
          : ''}
        @keyframes rookiesRunSurgePulse {
          0%, 100% { transform: scale(1);   box-shadow: 0 0 6px rgba(34,211,238,0.7), inset 0 0 4px rgba(255,255,255,0.5); }
          50%      { transform: scale(1.1); box-shadow: 0 0 14px rgba(34,211,238,1),  inset 0 0 6px rgba(255,255,255,0.8); }
        }
        @keyframes rrSpritePhaseLand {
          0%   { opacity: 0.1; filter: drop-shadow(0 0 12px rgba(125,211,252,1)) blur(2px); }
          60%  { opacity: 0.85; filter: drop-shadow(0 0 10px rgba(125,211,252,1)) blur(0.5px); }
          100% { opacity: 1;    filter: drop-shadow(0 0 0 rgba(125,211,252,0))   blur(0); }
        }
        @keyframes rrSpriteLeapLand {
          0%   { transform: translateY(-22%) scale(1.25); }
          55%  { transform: translateY(0)    scale(1.35, 0.7); }
          78%  { transform: translateY(0)    scale(0.9, 1.1); }
          100% { transform: translateY(0)    scale(1); }
        }
        @keyframes rrSpriteCharge {
          0%   { transform: scale(1)    skewX(0deg);  filter: drop-shadow(0 0 0 rgba(255,140,40,0)); }
          25%  { transform: scale(1.05) skewX(-6deg); filter: drop-shadow(0 0 10px rgba(255,140,40,0.95)); }
          70%  { transform: scale(0.95) skewX(3deg);  filter: drop-shadow(0 0 6px rgba(255,140,40,0.7)); }
          100% { transform: scale(1)    skewX(0deg);  filter: drop-shadow(0 0 0 rgba(255,140,40,0)); }
        }
        ${abilityFx && abilityFx.kind === 'phase-step'
          ? `[data-square="${abilityFx.to}"] > div {
               animation: rrSpritePhaseLand 600ms ease-out both;
             }`
          : ''}
        ${abilityFx && abilityFx.kind === 'leap'
          ? `[data-square="${abilityFx.to}"] > div {
               animation: rrSpriteLeapLand 700ms cubic-bezier(0.5, 0, 0.4, 1.4) both;
               transform-origin: 50% 100%;
             }`
          : ''}
        ${abilityFx && abilityFx.kind === 'pawn-charge'
          ? `[data-square="${abilityFx.to}"] > div {
               animation: rrSpriteCharge 600ms ease-out both;
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
      <div style={{ position: 'relative' }}>
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
        {state.status === 'playing' && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '12.5%',
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            {/* Soft haze — radial washes that span the whole rank. */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at 30% 50%, rgba(255,255,220,0.45), transparent 55%), radial-gradient(ellipse at 75% 40%, rgba(255,220,150,0.4), transparent 60%)',
                mixBlendMode: 'screen',
              }}
            />
            {/* Drifting motes — scattered across the row, not tile-repeated. */}
            {GOAL_MOTES.map((m, i) => (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: `${m[0]}%`,
                  top: `${m[1]}%`,
                  width: m[2],
                  height: m[2],
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 0 8px 2px rgba(255,240,180,0.9)',
                  animation: `rookiesRunDawnMote ${m[4]}s ease-in-out ${m[3]}s infinite`,
                }}
              />
            ))}
          </div>
        )}
        {abilityFx && fxGeom && (
          <AbilityFxLayer fx={abilityFx} geom={fxGeom} />
        )}
        {poisonDeathFx && <PoisonDeathLayer fx={poisonDeathFx} />}
        {state.status === 'lost' && (
          <>
            {attackerAtRookie &&
              (() => {
                const PieceComp =
                  defaultPieces[
                    ENEMY_SPRITE[attackerAtRookie.type] as keyof typeof defaultPieces
                  ];
                return (
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      left: `${(state.rookie.file - 1) * 12.5}%`,
                      top: `${(8 - state.rookie.rank) * 12.5}%`,
                      width: '12.5%',
                      height: '12.5%',
                      pointerEvents: 'none',
                      zIndex: 4,
                    }}
                  >
                    {PieceComp ? <PieceComp /> : null}
                  </div>
                );
              })()}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                left: `${(state.rookie.file - 1) * 12.5}%`,
                top: `${(8 - state.rookie.rank) * 12.5}%`,
                width: '12.5%',
                height: '12.5%',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            >
              <RookieCell form={state.form} dying glitching={false} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

interface FxGeom {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  midX: number;
  midY: number;
  length: number;
  angleDeg: number;
  dx: number;
  dy: number;
}

interface AbilityFxLayerProps {
  fx: NonNullable<BoardProps['abilityFx']>;
  geom: FxGeom;
}

/**
 * Renders one of five ability cast effects, layered absolutely over the
 * board. Each kind uses different SVG/CSS pieces, all keyed off the fx id so
 * React tears them down and remounts when a new cast fires.
 */
function AbilityFxLayer({ fx, geom }: AbilityFxLayerProps) {
  const { fromX, fromY, toX, toY, midX, midY, length, angleDeg } = geom;

  if (fx.kind === 'pawn-charge') {
    // Orange comet streak — a thin rotated bar from origin to target that
    // grows in then snaps out, with a bright head at the leading edge.
    return (
      <div
        key={fx.id}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 4,
        }}
      >
        <style>{`
          @keyframes rrFxChargeStreak-${Math.floor(fx.id)} {
            0%   { transform: translate(-50%, -50%) rotate(${angleDeg}deg) scaleX(0); opacity: 0.9; }
            40%  { transform: translate(-50%, -50%) rotate(${angleDeg}deg) scaleX(1); opacity: 1; }
            100% { transform: translate(-50%, -50%) rotate(${angleDeg}deg) scaleX(1); opacity: 0; }
          }
          @keyframes rrFxChargeBurst-${Math.floor(fx.id)} {
            0%   { transform: translate(-50%, -50%) scale(0.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
          }
        `}</style>
        <div
          style={{
            position: 'absolute',
            left: `${fromX}%`,
            top: `${fromY}%`,
            width: `${length}%`,
            height: '4%',
            background:
              'linear-gradient(90deg, rgba(255,180,40,0) 0%, rgba(255,180,40,0.8) 30%, rgba(255,120,30,1) 70%, rgba(255,255,255,1) 100%)',
            transformOrigin: '0% 50%',
            transform: `translate(0, -50%) rotate(${angleDeg}deg)`,
            filter:
              'drop-shadow(0 0 6px rgba(255,140,40,0.9)) drop-shadow(0 0 12px rgba(255,100,20,0.6))',
            animation: `rrFxChargeStreak-${Math.floor(fx.id)} 600ms ease-out forwards`,
            borderRadius: '999px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${fromX}%`,
            top: `${fromY}%`,
            width: '14%',
            height: '14%',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,180,40,0.9) 40%, rgba(255,80,20,0) 80%)',
            animation: `rrFxChargeBurst-${Math.floor(fx.id)} 500ms ease-out forwards`,
          }}
        />
      </div>
    );
  }

  if (fx.kind === 'phase-step') {
    // Two ghost-rooks: one fading out at origin, one fading in at target.
    // Plus a thin ghost-blue dashed line linking them.
    return (
      <div
        key={fx.id}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 4,
        }}
      >
        <style>{`
          @keyframes rrFxPhaseFade-${Math.floor(fx.id)} {
            0%   { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0;   transform: translate(-50%, -50%) scale(0.9); }
          }
          @keyframes rrFxPhaseAppear-${Math.floor(fx.id)} {
            0%   { opacity: 0;   transform: translate(-50%, -50%) scale(0.6); }
            70%  { opacity: 0.7; transform: translate(-50%, -50%) scale(1.05); }
            100% { opacity: 0;   transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes rrFxPhaseLine-${Math.floor(fx.id)} {
            0%, 100% { opacity: 0; }
            30%      { opacity: 0.85; }
          }
        `}</style>
        {/* Dashed ghost-blue link */}
        <div
          style={{
            position: 'absolute',
            left: `${fromX}%`,
            top: `${fromY}%`,
            width: `${length}%`,
            height: '2.5%',
            transformOrigin: '0% 50%',
            transform: `translate(0, -50%) rotate(${angleDeg}deg)`,
            background:
              'repeating-linear-gradient(90deg, rgba(125,211,252,0.95) 0 6px, transparent 6px 12px)',
            filter: 'drop-shadow(0 0 6px rgba(125,211,252,0.95))',
            animation: `rrFxPhaseLine-${Math.floor(fx.id)} 600ms ease-out forwards`,
          }}
        />
        {/* Ghost at origin (fading out) */}
        <div
          style={{
            position: 'absolute',
            left: `${fromX}%`,
            top: `${fromY}%`,
            width: '12%',
            height: '12%',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(125,211,252,0.85) 0%, rgba(56,189,248,0.4) 50%, transparent 80%)',
            filter: 'blur(2px)',
            animation: `rrFxPhaseFade-${Math.floor(fx.id)} 500ms ease-out forwards`,
          }}
        />
        {/* Ghost at target (fading in then out) */}
        <div
          style={{
            position: 'absolute',
            left: `${toX}%`,
            top: `${toY}%`,
            width: '14%',
            height: '14%',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(165,243,252,1) 0%, rgba(34,211,238,0.5) 50%, transparent 80%)',
            filter: 'blur(2px)',
            animation: `rrFxPhaseAppear-${Math.floor(fx.id)} 600ms ease-out forwards`,
          }}
        />
      </div>
    );
  }

  if (fx.kind === 'leap') {
    // Curved dashed arc from origin to target + landing shockwave on target.
    // The arc is approximated by a quadratic-bezier SVG path.
    const ctrlX = midX;
    // Lift the control point upward (in screen coords, smaller y) so the arc
    // bows up — proportional to the jump length, capped so short hops still curve.
    const lift = Math.min(18, 6 + length * 0.4);
    const ctrlY = midY - lift;
    const pathD = `M ${fromX} ${fromY} Q ${ctrlX} ${ctrlY} ${toX} ${toY}`;
    return (
      <div
        key={fx.id}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 4,
        }}
      >
        <style>{`
          @keyframes rrFxLeapArc-${Math.floor(fx.id)} {
            0%   { stroke-dashoffset: 100; opacity: 0; }
            30%  { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 0; }
          }
          @keyframes rrFxLeapLand-${Math.floor(fx.id)} {
            0%   { transform: translate(-50%, -50%) scale(0.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
          }
        `}</style>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        >
          <path
            d={pathD}
            fill="none"
            stroke="rgba(245,158,11,0.95)"
            strokeWidth={1.6}
            strokeDasharray="2.5 1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.9))',
              strokeDasharray: '100 100',
              animation: `rrFxLeapArc-${Math.floor(fx.id)} 650ms ease-out forwards`,
            }}
          />
        </svg>
        {/* Landing shockwave */}
        <div
          style={{
            position: 'absolute',
            left: `${toX}%`,
            top: `${toY}%`,
            width: '18%',
            height: '18%',
            borderRadius: '50%',
            border: '3px solid rgba(245,158,11,0.95)',
            boxShadow:
              '0 0 16px rgba(245,158,11,0.95), inset 0 0 12px rgba(255,210,80,0.9)',
            animation: `rrFxLeapLand-${Math.floor(fx.id)} 500ms ease-out 300ms forwards`,
            opacity: 0,
          }}
        />
      </div>
    );
  }

  if (fx.kind === 'freeze-ray') {
    // Cyan beam from origin to target + snowflake glyph traveling along it.
    return (
      <div
        key={fx.id}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 4,
        }}
      >
        <style>{`
          @keyframes rrFxFreezeBeam-${Math.floor(fx.id)} {
            0%   { transform: translate(0, -50%) rotate(${angleDeg}deg) scaleX(0); opacity: 1; }
            45%  { transform: translate(0, -50%) rotate(${angleDeg}deg) scaleX(1); opacity: 1; }
            100% { transform: translate(0, -50%) rotate(${angleDeg}deg) scaleX(1); opacity: 0; }
          }
          @keyframes rrFxFreezeFlake-${Math.floor(fx.id)} {
            0%   { left: ${fromX}%; top: ${fromY}%; transform: translate(-50%, -50%) rotate(0deg) scale(0.6); opacity: 1; }
            70%  { left: ${toX}%;   top: ${toY}%;   transform: translate(-50%, -50%) rotate(540deg) scale(1.4); opacity: 1; }
            100% { left: ${toX}%;   top: ${toY}%;   transform: translate(-50%, -50%) rotate(720deg) scale(2);   opacity: 0; }
          }
          @keyframes rrFxFreezeBurst-${Math.floor(fx.id)} {
            0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
          }
        `}</style>
        <div
          style={{
            position: 'absolute',
            left: `${fromX}%`,
            top: `${fromY}%`,
            width: `${length}%`,
            height: '3%',
            transformOrigin: '0% 50%',
            background:
              'linear-gradient(90deg, rgba(125,211,252,0) 0%, rgba(125,211,252,0.85) 20%, rgba(255,255,255,1) 50%, rgba(125,211,252,0.85) 80%, rgba(125,211,252,0) 100%)',
            filter: 'drop-shadow(0 0 8px rgba(125,211,252,1))',
            animation: `rrFxFreezeBeam-${Math.floor(fx.id)} 700ms ease-out forwards`,
            borderRadius: '999px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '12%',
            height: '12%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8cqw',
            filter: 'drop-shadow(0 0 6px rgba(125,211,252,1))',
            animation: `rrFxFreezeFlake-${Math.floor(fx.id)} 700ms ease-out forwards`,
            color: '#e0f2fe',
          }}
        >
          ❄
        </div>
        <div
          style={{
            position: 'absolute',
            left: `${toX}%`,
            top: `${toY}%`,
            width: '20%',
            height: '20%',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(125,211,252,0.6) 40%, transparent 75%)',
            animation: `rrFxFreezeBurst-${Math.floor(fx.id)} 400ms ease-out 350ms forwards`,
            opacity: 0,
          }}
        />
      </div>
    );
  }

  if (fx.kind === 'poison-dart' || fx.kind === 'rabies-dart') {
    // Thin arrow streak from origin to target + a small impact burst on the
    // target. Colour & burst differ between poison (sickly green) and rabies
    // (angry red).
    const isPoison = fx.kind === 'poison-dart';
    const stroke = isPoison ? '#65a30d' : '#dc2626';
    const head = isPoison ? '#bef264' : '#fca5a5';
    const haze = isPoison
      ? 'rgba(132, 204, 22, 0.55)'
      : 'rgba(220, 38, 38, 0.65)';
    const burstGrad = isPoison
      ? 'radial-gradient(circle, rgba(190,242,100,1) 0%, rgba(132,204,22,0.85) 40%, transparent 80%)'
      : 'radial-gradient(circle, rgba(252,165,165,1) 0%, rgba(220,38,38,0.85) 40%, transparent 80%)';
    return (
      <div
        key={fx.id}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 4,
        }}
      >
        <style>{`
          @keyframes rrFxDartShaft-${Math.floor(fx.id)} {
            0%   { transform: translate(0, -50%) rotate(${angleDeg}deg) scaleX(0); opacity: 1; }
            55%  { transform: translate(0, -50%) rotate(${angleDeg}deg) scaleX(1); opacity: 1; }
            100% { transform: translate(0, -50%) rotate(${angleDeg}deg) scaleX(1); opacity: 0; }
          }
          @keyframes rrFxDartHead-${Math.floor(fx.id)} {
            0%   { left: ${fromX}%; top: ${fromY}%; transform: translate(-50%, -50%) scale(0.4); opacity: 1; }
            70%  { left: ${toX}%;   top: ${toY}%;   transform: translate(-50%, -50%) scale(1);   opacity: 1; }
            100% { left: ${toX}%;   top: ${toY}%;   transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
          }
          @keyframes rrFxDartBurst-${Math.floor(fx.id)} {
            0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
          }
        `}</style>
        <div
          style={{
            position: 'absolute',
            left: `${fromX}%`,
            top: `${fromY}%`,
            width: `${length}%`,
            height: '2%',
            transformOrigin: '0% 50%',
            background: `linear-gradient(90deg, ${haze} 0%, ${stroke} 50%, ${head} 100%)`,
            filter: `drop-shadow(0 0 5px ${haze})`,
            animation: `rrFxDartShaft-${Math.floor(fx.id)} 500ms ease-out forwards`,
            borderRadius: '999px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '7%',
            height: '7%',
            borderRadius: '50%',
            background: head,
            filter: `drop-shadow(0 0 6px ${stroke})`,
            animation: `rrFxDartHead-${Math.floor(fx.id)} 500ms ease-out forwards`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${toX}%`,
            top: `${toY}%`,
            width: '18%',
            height: '18%',
            borderRadius: '50%',
            background: burstGrad,
            animation: `rrFxDartBurst-${Math.floor(fx.id)} 380ms ease-out 380ms forwards`,
            opacity: 0,
          }}
        />
      </div>
    );
  }

  return null;
}

// Green-bubble drowning VFX for poisoned pieces dying at end-of-turn. For
// each death square, paints a ghost of the dying piece sinking + desaturating
// into sickly green, surrounded by rising bubbles and a toxic glow puddle.
function PoisonDeathLayer({
  fx,
}: {
  fx: { deaths: { square: string; pieceType: PieceType }[]; id: number };
}) {
  // Per-bubble offsets — non-uniform so the cluster doesn't read as a grid.
  // [leftOffset%, delay ms, durMs, sizePct]
  const BUBBLES: Array<[number, number, number, number]> = [
    [-22, 0, 900, 12],
    [-8, 120, 820, 16],
    [10, 60, 940, 14],
    [22, 200, 860, 11],
    [-14, 280, 880, 10],
    [4, 360, 800, 13],
    [18, 440, 760, 9],
  ];
  const idKey = Math.floor(fx.id);
  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6 }}
    >
      <style>{`
        @keyframes rrPoisonSink-${idKey} {
          0%   { transform: translate(-50%, -50%) scale(1);    filter: saturate(1)   hue-rotate(0deg)   brightness(1);   opacity: 1; }
          40%  { transform: translate(-50%, -40%) scale(0.92); filter: saturate(0.4) hue-rotate(70deg)  brightness(0.85); opacity: 0.9; }
          100% { transform: translate(-50%, -25%) scale(0.55); filter: saturate(0.2) hue-rotate(110deg) brightness(0.55); opacity: 0; }
        }
        @keyframes rrPoisonPuddle-${idKey} {
          0%   { transform: translate(-50%, -50%) scale(0.4); opacity: 0; }
          25%  { transform: translate(-50%, -50%) scale(1);   opacity: 0.85; }
          100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0; }
        }
        @keyframes rrPoisonBubble-${idKey} {
          0%   { transform: translate(-50%, 30%) scale(0.4); opacity: 0; }
          15%  { transform: translate(-50%, 10%) scale(0.85); opacity: 0.95; }
          70%  { transform: translate(-50%, -70%) scale(1.05); opacity: 0.85; }
          100% { transform: translate(-50%, -110%) scale(0.5); opacity: 0; }
        }
      `}</style>
      {fx.deaths.map((d, i) => {
        const c = fromSquare(d.square);
        const cx = (c.file - 1) * 12.5 + 6.25;
        const cy = (8 - c.rank) * 12.5 + 6.25;
        const PieceComp =
          defaultPieces[ENEMY_SPRITE[d.pieceType] as keyof typeof defaultPieces];
        return (
          <div key={`${idKey}-${i}`} style={{ position: 'absolute', inset: 0 }}>
            {/* Toxic puddle wash on the square. */}
            <div
              style={{
                position: 'absolute',
                left: `${cx}%`,
                top: `${cy}%`,
                width: '12%',
                height: '12%',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(132,204,22,0.85) 0%, rgba(101,163,13,0.6) 55%, transparent 80%)',
                filter: 'blur(2px)',
                animation: `rrPoisonPuddle-${idKey} 900ms ease-out forwards`,
              }}
            />
            {/* Ghost of the dying piece sinking + going green. */}
            {PieceComp && (
              <div
                style={{
                  position: 'absolute',
                  left: `${cx}%`,
                  top: `${cy}%`,
                  width: '12.5%',
                  height: '12.5%',
                  animation: `rrPoisonSink-${idKey} 900ms ease-in forwards`,
                  transformOrigin: 'center center',
                }}
              >
                <PieceComp />
              </div>
            )}
            {/* Rising bubbles. */}
            {BUBBLES.map((b, bi) => (
              <span
                key={bi}
                style={{
                  position: 'absolute',
                  left: `calc(${cx}% + ${b[0] * 0.05}%)`,
                  top: `${cy}%`,
                  width: `${b[3] * 0.35}%`,
                  height: `${b[3] * 0.35}%`,
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle at 35% 30%, rgba(236,252,203,0.95) 0%, rgba(163,230,53,0.85) 40%, rgba(101,163,13,0.7) 75%, rgba(77,124,15,0.5) 100%)',
                  boxShadow:
                    'inset -1px -2px 3px rgba(63,98,18,0.5), 0 0 4px rgba(132,204,22,0.7)',
                  animation: `rrPoisonBubble-${idKey} ${b[2]}ms ease-out ${b[1]}ms forwards`,
                  opacity: 0,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
