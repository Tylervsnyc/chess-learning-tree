'use client';

/**
 * Static SVG-style 8x8 board used by the playtest replay viewer.
 *
 * Deliberately not the real Board.tsx — that component is 1000+ lines of
 * animations, FX layers, drag/drop, and react-chessboard wiring we don't
 * need here. The viewer renders many board snapshots in a row (one per
 * decision), so we keep the markup cheap: a CSS grid of squares, Unicode
 * chess glyphs for pieces, a couple of background washes for goal/hazard/
 * frozen squares.
 *
 * The component is mobile-first — sized via container width — so it works
 * on phone-sized viewports without any media queries.
 */

import type {
  AbilityId,
  AbilityTier,
} from '@/lib/run/abilities';
import type { SerializedBoard } from '@/scripts/run-playtest/types';
import { toSquare } from '@/lib/run/types';
import type { PieceType, RookieForm } from '@/lib/run/types';

// White-piece glyphs for Rookie (she's our player → light side).
const ROOKIE_GLYPH: Record<RookieForm, string> = {
  rook: '♖',    // ♖
  knight: '♘',  // ♘
  bishop: '♗',  // ♗
  queen: '♕',   // ♕
};

// Black-piece glyphs for enemies.
const ENEMY_GLYPH: Record<PieceType, string> = {
  pawn: '♟',    // ♟
  knight: '♞',  // ♞
  bishop: '♝',  // ♝
  queen: '♛',   // ♛
};

interface ReplayBoardProps {
  board: SerializedBoard;
  /** Square (algebraic) to highlight as the action's "from". */
  fromSquare?: string | null;
  /** Square (algebraic) to highlight as the action's "to". */
  toSquareHi?: string | null;
}

/** Color of the from/to highlights. Subtle so it doesn't fight the glyphs. */
const FROM_BG = 'rgba(28, 176, 246, 0.30)';
const FROM_RING = 'inset 0 0 0 3px rgba(28, 176, 246, 0.85)';
const TO_BG = 'rgba(132, 204, 22, 0.35)';
const TO_RING = 'inset 0 0 0 3px rgba(101, 163, 13, 0.95)';

// Light/dark square pair. Matches the rest of the app's board palette.
const LIGHT_BG = '#f0d9b5';
const DARK_BG = '#b58863';

// Goal rank — warm sunrise (mirrors the game board's "Enchanted Dawn").
const GOAL_BG =
  'linear-gradient(180deg, #fff1b8 0%, #ffd56a 45%, #e89c1a 100%)';

// Hazard wash.
const HAZARD_BG = 'rgba(190, 18, 60, 0.55)';

// Frozen square wash.
const FROZEN_BG = 'rgba(125, 211, 252, 0.55)';

export function ReplayBoard({
  board,
  fromSquare = null,
  toSquareHi = null,
}: ReplayBoardProps): React.ReactElement {
  // Build square index → metadata maps once. Easier than calling .find in
  // every render of the grid.
  const enemyAt = new Map<string, PieceType>();
  for (const p of board.pieces) {
    enemyAt.set(toSquare({ file: p.file, rank: p.rank }), p.type);
  }
  const hazardSet = new Set(
    board.hazards.map((h) => toSquare(h)),
  );
  const frozenSet = new Set(board.frozenSquares);
  const rookieSq = toSquare(board.rookie);

  // Render rank 8 at the top, rank 1 at the bottom. Files a..h left-to-right.
  const rows: React.ReactElement[] = [];
  for (let rank = 8; rank >= 1; rank--) {
    const cells: React.ReactElement[] = [];
    for (let file = 1; file <= 8; file++) {
      const sq = toSquare({ file, rank });
      const isLight = (file + rank) % 2 === 1;
      const isGoal = rank === 8;
      const isHazard = hazardSet.has(sq);
      const isFrozen = frozenSet.has(sq);
      const isRookie = sq === rookieSq;
      const enemy = enemyAt.get(sq);
      const isFrom = fromSquare === sq;
      const isTo = toSquareHi === sq;

      // Decide cell background. Goal > hazard > frozen > checker pattern.
      let background: string;
      let backgroundColor: string | undefined;
      if (isGoal) {
        background = GOAL_BG;
        backgroundColor = undefined;
      } else if (isHazard) {
        background = '';
        backgroundColor = HAZARD_BG;
      } else if (isFrozen) {
        background = '';
        backgroundColor = FROZEN_BG;
      } else {
        background = '';
        backgroundColor = isLight ? LIGHT_BG : DARK_BG;
      }
      // From/to wash layers on top of the base color via boxShadow ring +
      // a translucent overlay color (keeps the glyph readable).
      if (isFrom) backgroundColor = FROM_BG;
      if (isTo) backgroundColor = TO_BG;

      const boxShadow = isFrom
        ? FROM_RING
        : isTo
          ? TO_RING
          : undefined;

      const glyph = isRookie
        ? ROOKIE_GLYPH[board.form]
        : enemy
          ? ENEMY_GLYPH[enemy]
          : '';
      // Rookie glyphs render in a slightly cooler/brighter hue so they read
      // as "us" against the dark enemy pieces.
      const glyphColor = isRookie
        ? '#0f172a'
        : enemy
          ? '#000000'
          : 'transparent';

      cells.push(
        <div
          key={sq}
          data-square={sq}
          className="relative flex items-center justify-center aspect-square select-none"
          style={{
            background,
            backgroundColor,
            boxShadow,
          }}
        >
          {glyph && (
            <span
              aria-hidden
              className="text-[8cqw] leading-none"
              style={{
                color: glyphColor,
                fontFamily:
                  '"Noto Sans Symbols 2", "Segoe UI Symbol", "Apple Symbols", sans-serif',
                // Frozen enemies get an icy tint so the freeze is visible.
                opacity: isFrozen && !isRookie ? 0.85 : 1,
                textShadow: isFrozen && !isRookie ? '0 0 4px rgba(56, 189, 248, 0.95)' : undefined,
                // Rookie's shield reads as a soft cyan halo around her glyph.
                filter:
                  isRookie && board.shieldUp
                    ? 'drop-shadow(0 0 4px rgba(56,189,248,1)) drop-shadow(0 0 8px rgba(125,211,252,0.9))'
                    : undefined,
              }}
            >
              {glyph}
            </span>
          )}
          {/* Bonus-moves badge when Surge is active. */}
          {isRookie && board.bonusMovesLeft > 0 && (
            <span
              aria-hidden
              className="absolute top-0 right-0 rounded-full bg-cyan-500 px-1 py-0.5 text-[6cqw] font-bold text-white shadow"
              style={{ lineHeight: 1 }}
            >
              +{board.bonusMovesLeft}
            </span>
          )}
        </div>,
      );
    }
    rows.push(
      <div
        key={`r${rank}`}
        className="grid grid-cols-8"
        style={{ containerType: 'inline-size' }}
      >
        {cells}
      </div>,
    );
  }

  return (
    <div
      className="w-full max-w-md mx-auto overflow-hidden rounded-lg border border-stone-300 shadow-sm"
      style={{
        containerType: 'inline-size',
      }}
    >
      {rows}
    </div>
  );
}

/**
 * Helper: extract `(fromSquare, toSquare)` highlights from a decision-log
 * entry's action. Used by the replay page to decorate the board. Returns
 * `{from, to}` — either or both may be null when the action has no
 * spatial counterpart (e.g. offer pick).
 */
export function actionHighlights(
  beforeBoard: SerializedBoard,
  action:
    | { kind: 'move'; target: { file: number; rank: number } }
    | { kind: 'ability-target'; abilityId: AbilityId; target: { file: number; rank: number } }
    | { kind: 'activate-ability'; abilityId: AbilityId }
    | { kind: 'pick-offer'; optionIndex: 0 | 1 }
    | { kind: 'dismiss-offer' },
): { from: string | null; to: string | null } {
  switch (action.kind) {
    case 'move':
      return {
        from: toSquare(beforeBoard.rookie),
        to: toSquare(action.target),
      };
    case 'ability-target':
      return {
        from: toSquare(beforeBoard.rookie),
        to: toSquare(action.target),
      };
    case 'activate-ability':
      // No spatial move — just light up Rookie's square as the focus.
      return { from: toSquare(beforeBoard.rookie), to: null };
    case 'pick-offer':
    case 'dismiss-offer':
      return { from: null, to: null };
  }
}

// Re-export ability tier type for callers that want to color-code abilities
// alongside the board. Currently unused inside this file, but keeps imports
// tidy at the page level.
export type { AbilityTier };
