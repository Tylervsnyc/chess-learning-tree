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

import type { AbilityId, AbilityOffer, OwnedAbility } from './abilities';

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
   * Squares (algebraic) of enemies that are frozen and must skip their
   * action. A freeze lasts TWO enemy turns — see `frozenTurnsLeft` for the
   * remaining turn count per square. Squares stay listed here for the full
   * lifetime of the freeze so the icy visual persists.
   */
  frozenSquares: string[];
  /**
   * Remaining enemy turns each frozen square will stay frozen. Decremented
   * at the end of each enemy turn; when it hits 0 the entry is removed from
   * both maps.
   */
  frozenTurnsLeft: Record<string, number>;
  /** Permanent abilities Rookie has accrued this run. */
  abilities: OwnedAbility[];
  /** When the tempo meter fills, the player is offered 3 ability choices. */
  pendingOffer: AbilityOffer | null;
  /** Currently-targeting ability — drives ability resolution UI. */
  activeAbility: { id: AbilityId; step: 'pick-square' | 'pick-enemy' } | null;
  /** Current level number (1-based) — drives pawn promotion options. */
  level: number;
  /**
   * Short position-history buffer (capped at 2) — powers the Recall ability.
   * Pushed on each Rookie move; popped when Recall fires.
   */
  history: { rookie: Coord; enemyPieces: EnemyPiece[] }[];
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
