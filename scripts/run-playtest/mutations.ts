/**
 * Level mutations — single-feature edits to a RunPuzzle.
 *
 * WHY: the hypothesis loop needs to ask "what if we changed just this one
 * thing?" and run a controlled experiment. A mutation is a NAMED, REPLAYABLE
 * transform. The name lives in the experiment log so future runs can audit
 * exactly what changed.
 *
 * Each mutation is a pure function `(puzzle) => puzzle`. We always clone the
 * arrays we touch so the catalog the rest of the pipeline reads stays intact.
 */

import type { EnemyPiece, PieceType, RunPuzzle } from '../../lib/run/types';

/** Discriminated union — one shape per mutation kind. */
export type LevelMutation =
  | { kind: 'addPawn'; file: number; rank: number }
  | { kind: 'addPiece'; pieceType: PieceType; file: number; rank: number }
  | { kind: 'removePiece'; file: number; rank: number }
  | { kind: 'addHazard'; file: number; rank: number }
  | { kind: 'setMoveLimit'; moveLimit: number }
  | { kind: 'setEnemiesPerTurn'; enemiesPerTurn: number };

/** Apply a mutation to a puzzle, returning a NEW puzzle. */
export function applyMutation(puzzle: RunPuzzle, mutation: LevelMutation): RunPuzzle {
  switch (mutation.kind) {
    case 'addPawn':
      return addPiece(puzzle, 'pawn', mutation.file, mutation.rank);
    case 'addPiece':
      return addPiece(puzzle, mutation.pieceType, mutation.file, mutation.rank);
    case 'removePiece':
      return removePiece(puzzle, mutation.file, mutation.rank);
    case 'addHazard':
      return addHazard(puzzle, mutation.file, mutation.rank);
    case 'setMoveLimit':
      return { ...puzzle, moveLimit: mutation.moveLimit };
    case 'setEnemiesPerTurn':
      return { ...puzzle, enemiesPerTurn: mutation.enemiesPerTurn };
  }
}

/** Short label for logging/display. */
export function describeMutation(m: LevelMutation): string {
  switch (m.kind) {
    case 'addPawn':
      return `+pawn@${sqLabel(m.file, m.rank)}`;
    case 'addPiece':
      return `+${m.pieceType}@${sqLabel(m.file, m.rank)}`;
    case 'removePiece':
      return `-piece@${sqLabel(m.file, m.rank)}`;
    case 'addHazard':
      return `+hazard@${sqLabel(m.file, m.rank)}`;
    case 'setMoveLimit':
      return `moveLimit=${m.moveLimit}`;
    case 'setEnemiesPerTurn':
      return `enemiesPerTurn=${m.enemiesPerTurn}`;
  }
}

function addPiece(
  puzzle: RunPuzzle,
  pieceType: PieceType,
  file: number,
  rank: number,
): RunPuzzle {
  // WHY: refuse to overlap an existing piece — the resulting puzzle would be
  // invalid and the engine asserts elsewhere. Caller is expected to pick an
  // empty square.
  if (puzzle.pieces.some((p) => p.file === file && p.rank === rank)) {
    return puzzle;
  }
  const piece: EnemyPiece = { type: pieceType, color: 'black', file, rank };
  return { ...puzzle, pieces: [...puzzle.pieces, piece] };
}

function removePiece(puzzle: RunPuzzle, file: number, rank: number): RunPuzzle {
  const filtered = puzzle.pieces.filter(
    (p) => !(p.file === file && p.rank === rank),
  );
  if (filtered.length === puzzle.pieces.length) return puzzle;
  return { ...puzzle, pieces: filtered };
}

function addHazard(puzzle: RunPuzzle, file: number, rank: number): RunPuzzle {
  const hazards = puzzle.hazards ?? [];
  if (hazards.some((h) => h.file === file && h.rank === rank)) return puzzle;
  return { ...puzzle, hazards: [...hazards, { file, rank }] };
}

function sqLabel(file: number, rank: number): string {
  return `${String.fromCharCode('a'.charCodeAt(0) + file - 1)}${rank}`;
}

// ─── Convenience constructors (used by hypothesis-queue + tests) ────────────

export function addPawn(file: number, rank: number): LevelMutation {
  return { kind: 'addPawn', file, rank };
}

export function removePieceAt(file: number, rank: number): LevelMutation {
  return { kind: 'removePiece', file, rank };
}

export function addHazardAt(file: number, rank: number): LevelMutation {
  return { kind: 'addHazard', file, rank };
}

export function setMoveLimit(n: number): LevelMutation {
  return { kind: 'setMoveLimit', moveLimit: n };
}

export function setEnemiesPerTurn(n: number): LevelMutation {
  return { kind: 'setEnemiesPerTurn', enemiesPerTurn: n };
}
