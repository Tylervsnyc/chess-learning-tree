/**
 * Core types for Rookie's Run.
 *
 * Sprint 2: 10-level run, Rookie can temporarily transform into Knight or Bishop
 * via the Tempo system (capture pieces → spend tempo to transform).
 *
 * Coordinate system: standard chess.
 *   file: 1-8 (a=1 through h=8)
 *   rank: 1-8 (white's first row = 1, white's promotion row = 8)
 *
 * Rookie starts on rank 1 and wins by reaching rank 8.
 */

import type { CardId } from './cards';

export type PieceType = 'pawn' | 'knight' | 'bishop' | 'queen';
export type PieceColor = 'black';

/** Rookie's current movement form. She starts and reverts to 'rook'. */
export type RookieForm = 'rook' | 'knight' | 'bishop' | 'queen';

export interface Coord {
  file: number; // 1-8
  rank: number; // 1-8
}

export interface EnemyPiece {
  type: PieceType;
  color: PieceColor;
  file: number;
  rank: number;
}

export type Turn = 'rookie' | 'enemy';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface BoardState {
  rookie: Coord;
  pieces: EnemyPiece[];
  hazards: Coord[]; // no-go squares for Rookie (introduced level 8+)
  turn: Turn;
  status: GameStatus;
  moveCount: number; // counts Rookie's moves only
  captures: PieceType[]; // chronological list of piece types Rookie has captured
  tempo: number; // current tempo (0..TEMPO_MAX)
  form: RookieForm; // Rookie's current movement form
  formMovesLeft: number; // remaining Rookie moves until auto-revert (0 when rook)
  moveLimit: number | null; // null = no limit; otherwise hard cap on Rookie moves
  enemiesPerTurn: number; // how many enemies act per enemy turn (default 1)
  /** Squares (algebraic) of pieces that have already moved this enemy turn. */
  enemyMovedSquares: string[];
  /**
   * Squares (algebraic) that an enemy *vacated* during the current enemy
   * turn — i.e. their position at the start of the turn. Treated as ghost
   * blockers for subsequent movers so the player can plan threats from the
   * board they actually saw. Cleared when control returns to Rookie.
   */
  enemyVacatedSquares: string[];
  /**
   * Squares (algebraic) of enemies that are frozen and must skip their next
   * action. Cleared at the end of the enemy turn (when control returns to
   * Rookie), so freeze always lasts exactly one enemy turn.
   */
  frozenSquares: string[];
  /** Cards currently in Rookie's hand (max HAND_SIZE). */
  hand: CardId[];
  /** When the tempo meter fills, the player is offered cards to draw. */
  pendingDraw: CardId[] | null;
  /** Current level number (1-based) — drives pawn promotion options. */
  level: number;
}

export interface RunPuzzle {
  level: number; // 1..10
  rookieStart: Coord;
  pieces: EnemyPiece[];
  hazards?: Coord[];
  moveLimit?: number;
  /** Pieces Rookie is allowed to transform into on this level. */
  allowedForms?: RookieForm[];
  /** Enemies that act each enemy turn (default 1). */
  enemiesPerTurn?: number;
}

/** Convert (file, rank) to algebraic square string e.g. 'e1'. */
export function toSquare({ file, rank }: Coord): string {
  return `${String.fromCharCode('a'.charCodeAt(0) + file - 1)}${rank}`;
}

/** Convert algebraic square string e.g. 'e1' to (file, rank). */
export function fromSquare(sq: string): Coord {
  return {
    file: sq.charCodeAt(0) - 'a'.charCodeAt(0) + 1,
    rank: parseInt(sq[1], 10),
  };
}

export function coordEq(a: Coord, b: Coord): boolean {
  return a.file === b.file && a.rank === b.rank;
}
