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

/** True if a Boulder (experimental board-editing ability) sits on `at`. */
export function boulderAt(state: BoardState, at: Coord): boolean {
  return (state.boulders ?? []).some((b) => b.file === at.file && b.rank === at.rank);
}

/** True if a Smoke cloud (experimental board-editing ability) covers `at`. */
export function smokeAt(state: BoardState, at: Coord): boolean {
  return (state.smoke ?? []).some((c) => c.file === at.file && c.rank === at.rank);
}

/**
 * Squares an ENEMY may neither enter, capture on, nor slide through:
 * hazards (already enemy no-go), smoke clouds and boulders. Rookie is only
 * blocked by hazards + boulders (she moves freely through smoke).
 */
export function enemyNoGo(state: BoardState, at: Coord): boolean {
  return isHazard(state.hazards, at) || smokeAt(state, at) || boulderAt(state, at);
}

/** True if a friendly ally occupies this square — blocks Rookie's movement. */
function isAlly(state: BoardState, at: Coord): boolean {
  return (state.allies ?? []).some((a) => a.file === at.file && a.rank === at.rank);
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
      if (boulderAt(state, square)) break; // boulder blocks the ray
      if (isAlly(state, square)) break; // friendly ally — can't pass through
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
    if (boulderAt(state, square)) continue; // may jump over, never land on
    if (isAlly(state, square)) continue;
    moves.push(square);
  }
  return moves;
}

function pawnMoves(state: BoardState): Coord[] {
  const moves: Coord[] = [];
  const { rookie, pieces, hazards } = state;
  const forward = { file: rookie.file, rank: rookie.rank + 1 };
  if (
    forward.rank <= 8 &&
    !isHazard(hazards, forward) &&
    !boulderAt(state, forward) &&
    !enemyAt(pieces, forward) &&
    !isAlly(state, forward)
  ) {
    moves.push(forward);
  }
  for (const df of [-1, 1]) {
    const sq = { file: rookie.file + df, rank: rookie.rank + 1 };
    if (sq.file < 1 || sq.file > 8 || sq.rank > 8) continue;
    if (isHazard(hazards, sq)) continue;
    if (boulderAt(state, sq)) continue;
    if (isAlly(state, sq)) continue;
    if (enemyAt(pieces, sq)) moves.push(sq);
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
    if (boulderAt(state, square)) continue; // may jump over, never land on
    if (isAlly(state, square)) continue;
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
    case 'pawn':
      return pawnMoves(state);
    case 'rook':
    default:
      return slideMoves(state, ROOK_DIRS);
  }
}

/** True if `target` is a legal Rookie destination from the current state. */
export function isLegalRookieMove(state: BoardState, target: Coord): boolean {
  return rookieLegalMoves(state).some((m) => coordEq(m, target));
}

