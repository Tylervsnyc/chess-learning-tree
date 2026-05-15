/**
 * Shared builders for the 2026-05-15-evening candidate levels.
 */

import type { Coord, EnemyPiece, RookieForm, RunPuzzle } from '../../../../lib/run/types';

export type LevelBuilder = (rookieStart: Coord) => RunPuzzle;

export const pawn = (file: number, rank: number): EnemyPiece => ({
  type: 'pawn', color: 'black', file, rank,
});
export const knight = (file: number, rank: number): EnemyPiece => ({
  type: 'knight', color: 'black', file, rank,
});
export const bishop = (file: number, rank: number): EnemyPiece => ({
  type: 'bishop', color: 'black', file, rank,
});
export const queen = (file: number, rank: number): EnemyPiece => ({
  type: 'queen', color: 'black', file, rank,
});

export const make = (
  level: number,
  pieces: EnemyPiece[],
  opts: {
    hazards?: Coord[];
    moveLimit?: number;
    allowedForms?: RookieForm[];
    enemiesPerTurn?: number;
  } = {},
): LevelBuilder => (rookieStart) => ({
  level,
  rookieStart,
  pieces: pieces.map((p) => ({ ...p })),
  hazards: opts.hazards?.map((h) => ({ ...h })),
  moveLimit: opts.moveLimit,
  allowedForms: opts.allowedForms,
  enemiesPerTurn: opts.enemiesPerTurn,
});
