/**
 * Deterministic daily seed for Rookie's Run.
 *
 * Same YYYY-MM-DD → same starting file (b–g). Each day a player faces the
 * same 10 levels in sequence — what varies between days is Rookie's spawn
 * column (and tomorrow we can rotate level orderings if needed).
 */

import { DEFAULT_RUN_ID, getRunById } from './runs';
import type { BoardState, Coord, RunPuzzle } from './types';

/** Mulberry32 — tiny seeded PRNG. No external deps. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash an ISO date string to a 32-bit unsigned int. */
export function hashDate(iso: string): number {
  let h = 2166136261 >>> 0; // FNV-1a basis
  for (let i = 0; i < iso.length; i++) {
    h ^= iso.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** Today's date in YYYY-MM-DD (local time). */
export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Pick Rookie's starting file for a given date (files 2..7, never corners). */
export function rookieStartForDate(iso: string): Coord {
  const rng = mulberry32(hashDate(iso));
  const file = 2 + Math.floor(rng() * 6);
  return { file, rank: 1 };
}

/** Build the puzzle for a specific level on a given date and run. */
export function puzzleForDate(
  iso: string,
  levelIndex = 0,
  runId: string = DEFAULT_RUN_ID,
): RunPuzzle {
  const start = rookieStartForDate(iso);
  const run = getRunById(runId);
  const builder = run.levels[levelIndex];
  if (builder) return builder(start);
  // Out-of-range level — bail out to the first level of the run.
  return run.levels[0](start);
}

/** Total levels in the given run. */
export function totalLevelsForRun(runId: string = DEFAULT_RUN_ID): number {
  const run = getRunById(runId);
  return run.levels.length;
}

/** Build all puzzles for a given date and run, in order. */
export function runForDate(
  iso: string,
  runId: string = DEFAULT_RUN_ID,
): RunPuzzle[] {
  const start = rookieStartForDate(iso);
  const run = getRunById(runId);
  return run.levels.map((b) => b(start));
}

/** Convert a puzzle to the initial board state (Rookie's turn, no moves yet). */
export function puzzleToBoardState(
  puzzle: RunPuzzle,
  carry: { tempo?: number; hand?: BoardState['hand'] } = {},
): BoardState {
  return {
    rookie: { ...puzzle.rookieStart },
    pieces: puzzle.pieces.map((p) => ({ ...p })),
    hazards: (puzzle.hazards ?? []).map((h) => ({ ...h })),
    turn: 'rookie',
    status: 'playing',
    moveCount: 0,
    captures: [],
    tempo: carry.tempo ?? 0,
    form: 'rook',
    formMovesLeft: 0,
    moveLimit: puzzle.moveLimit ?? null,
    enemiesPerTurn: puzzle.enemiesPerTurn ?? 1,
    enemyMovedSquares: [],
    frozenSquares: [],
    hand: carry.hand ?? [],
    pendingDraw: null,
    level: puzzle.level,
  };
}

/** Convenience: today's first-level initial board state. */
export function todayBoardState(now: Date = new Date()): {
  iso: string;
  state: BoardState;
  puzzle: RunPuzzle;
} {
  const iso = todayISO(now);
  const puzzle = puzzleForDate(iso, 0);
  return { iso, state: puzzleToBoardState(puzzle), puzzle };
}
