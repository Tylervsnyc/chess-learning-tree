/**
 * Rookie's movement — dispatches by current form (rook | knight | bishop).
 *
 * Sliders (rook, bishop) ray outward in their directions until blocked.
 * Knight jumps to the 8 L-squares, skipping pieces in between.
 *
 * Rookie may never land on a hazard square.
 */

import type { BoardState, Coord, EnemyPiece, RookieForm } from './types';
import { coordEq } from './types';

const ROOK_DIRS: ReadonlyArray<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const BISHOP_DIRS: ReadonlyArray<[number, number]> = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const KING_DELTAS: ReadonlyArray<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const KNIGHT_DELTAS: ReadonlyArray<[number, number]> = [
  [1, 2],
  [2, 1],
  [-1, 2],
  [-2, 1],
  [1, -2],
  [2, -1],
  [-1, -2],
  [-2, -1],
];

/** Find an enemy piece at the given square, or undefined. */
export function enemyAt(pieces: EnemyPiece[], at: Coord): EnemyPiece | undefined {
  return pieces.find((p) => p.file === at.file && p.rank === at.rank);
}

function isHazard(hazards: Coord[], at: Coord): boolean {
  return hazards.some((h) => h.file === at.file && h.rank === at.rank);
}

function slideMoves(
  state: BoardState,
  dirs: ReadonlyArray<[number, number]>,
): Coord[] {
  const moves: Coord[] = [];
  const { rookie, pieces, hazards } = state;
  for (const [df, dr] of dirs) {
    let f = rookie.file + df;
    let r = rookie.rank + dr;
    while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
      const square = { file: f, rank: r };
      if (isHazard(hazards, square)) break; // hazard blocks the ray
      const blocker = enemyAt(pieces, square);
      if (blocker) {
        moves.push(square);
        break;
      }
      moves.push(square);
      f += df;
      r += dr;
    }
  }
  return moves;
}

function knightMoves(state: BoardState): Coord[] {
  const moves: Coord[] = [];
  const { rookie, hazards } = state;
  for (const [df, dr] of KNIGHT_DELTAS) {
    const f = rookie.file + df;
    const r = rookie.rank + dr;
    if (f < 1 || f > 8 || r < 1 || r > 8) continue;
    const square = { file: f, rank: r };
    if (isHazard(hazards, square)) continue;
    moves.push(square);
  }
  return moves;
}

function kingMoves(state: BoardState): Coord[] {
  const moves: Coord[] = [];
  const { rookie, hazards } = state;
  for (const [df, dr] of KING_DELTAS) {
    const f = rookie.file + df;
    const r = rookie.rank + dr;
    if (f < 1 || f > 8 || r < 1 || r > 8) continue;
    const square = { file: f, rank: r };
    if (isHazard(hazards, square)) continue;
    moves.push(square);
  }
  return moves;
}

/** Returns the list of squares Rookie can legally move to from her current position. */
export function rookieLegalMoves(state: BoardState): Coord[] {
  switch (state.form) {
    case 'knight':
      return knightMoves(state);
    case 'bishop':
      return slideMoves(state, BISHOP_DIRS);
    case 'queen':
      return [...slideMoves(state, ROOK_DIRS), ...slideMoves(state, BISHOP_DIRS)];
    case 'king':
      return kingMoves(state);
    case 'rook':
    default:
      return slideMoves(state, ROOK_DIRS);
  }
}

/** True if `target` is a legal Rookie destination from the current state. */
export function isLegalRookieMove(state: BoardState, target: Coord): boolean {
  return rookieLegalMoves(state).some((m) => coordEq(m, target));
}

/** Cost in tempo to transform into a given form. Rook is free (auto-revert). */
export function transformCost(form: RookieForm): number {
  switch (form) {
    case 'knight':
      return 2;
    case 'bishop':
      return 3;
    case 'queen':
      return 4;
    case 'king':
      return 4;
    case 'rook':
      return 0;
  }
}

/** How many Rookie moves a transformation lasts before auto-revert. */
export const FORM_DURATION = 3;
