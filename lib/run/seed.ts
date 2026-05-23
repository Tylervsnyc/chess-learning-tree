/**
 * Deterministic daily seed for Rookie's Run.
 *
 * Same YYYY-MM-DD → same starting file (b–g). Each day a player faces the
 * same 10 levels in sequence — what varies between days is Rookie's spawn
 * column (and tomorrow we can rotate level orderings if needed).
 */

import {
  offerIsExhausted,
  refreshAbilityUses,
  rollOffer,
  squadSpawnFor,
} from './abilities';
import { DEFAULT_RUN_ID, getRunById } from './runs';
import { TEMPO_MAX } from './scoring';
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
/** Generate a fresh 32-bit seed for the enemy-AI RNG. */
function newAiRngSeed(): number {
  return ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) || 1;
}

/** Pick a random starting file for Rookie on her designed start rank,
 *  avoiding enemy- and hazard-occupied squares so the level remains
 *  legal. Keeps the puzzle's intended rank so spawn camping / forced
 *  paths designed into the level stay intact. */
function randomizedRookieStart(puzzle: RunPuzzle): { file: number; rank: number } {
  const startRank = puzzle.rookieStart.rank;
  const occupied = new Set<number>();
  for (const p of puzzle.pieces) {
    if (p.rank === startRank) occupied.add(p.file);
  }
  for (const h of puzzle.hazards ?? []) {
    if (h.rank === startRank) occupied.add(h.file);
  }
  // A file is "open" if nothing blocks Rookie from sliding straight to rank 8.
  const blockersAhead = new Set<number>();
  for (const p of puzzle.pieces) {
    if (p.rank > startRank && p.rank <= 8) blockersAhead.add(p.file);
  }
  for (const h of puzzle.hazards ?? []) {
    if (h.rank > startRank && h.rank <= 8) blockersAhead.add(h.file);
  }
  const available: number[] = [];
  for (let f = 1; f <= 8; f++) {
    if (!occupied.has(f) && blockersAhead.has(f)) available.push(f);
  }
  // Fallback: if every file is open, allow any unoccupied file rather than crash.
  if (available.length === 0) {
    for (let f = 1; f <= 8; f++) {
      if (!occupied.has(f)) available.push(f);
    }
  }
  if (available.length === 0) return { ...puzzle.rookieStart };
  return {
    file: available[Math.floor(Math.random() * available.length)],
    rank: startRank,
  };
}

export function puzzleToBoardState(
  puzzle: RunPuzzle,
  carry: {
    tempo?: number;
    abilities?: BoardState['abilities'];
    pendingOffer?: BoardState['pendingOffer'];
    aiRngSeed?: number;
    /** Run id — only STC mini-runs lock Rookie into a non-rook form. */
    runId?: string;
  } = {},
): BoardState {
  const abilities = refreshAbilityUses(carry.abilities ?? []);
  // Forced offer at start of level 6: if no offer carried over and the player
  // hasn't hit one organically, force one so progression doesn't stall.
  let pendingOffer = carry.pendingOffer ?? null;
  let tempo = carry.tempo ?? 0;
  const rookieStart = randomizedRookieStart(puzzle);
  const piecesCopy = puzzle.pieces.map((p) => ({ ...p }));
  const hazardsCopy = (puzzle.hazards ?? []).map((h) => ({ ...h }));
  // Squad is a passive: whenever Rookie owns the squad ability, her roster
  // spawns each level. Roster size scales with the owned tier.
  const ownedSquad = abilities.find((a) => a.id === 'squad');
  const allies = ownedSquad
    ? squadSpawnFor(ownedSquad.tier, rookieStart, piecesCopy, hazardsCopy)
    : [];
  const base: BoardState = {
    rookie: rookieStart,
    pieces: piecesCopy,
    allies,
    drones: [],
    allyTurnIndex: 0,
    hazards: hazardsCopy,
    turn: 'rookie',
    status: 'playing',
    moveCount: 0,
    captures: [],
    tempo,
    form: 'rook',
    formMovesLeft: 0,
    ...((): Partial<BoardState> => {
      // STC mini-runs only: lock Rookie into a single non-rook form for the
      // whole level. Non-STC themed runs (Knight's Academy etc.) use
      // allowedForms to restrict transforms, not to override the starting form.
      if (!carry.runId?.startsWith('stc-')) return {};
      const af = puzzle.allowedForms;
      if (af && af.length === 1 && af[0] !== 'rook') {
        return { form: af[0], formMovesLeft: -1 };
      }
      return {};
    })(),
    runId: carry.runId,
    moveLimit: puzzle.moveLimit ?? null,
    enemiesPerTurn: puzzle.enemiesPerTurn ?? 1,
    enemyMovedSquares: [],
    enemyVacatedSquares: [],
    frozenSquares: [],
    frozenTurnsLeft: {},
    decoyTarget: null,
    decoyTurnsLeft: 0,
    poisonedSquares: [],
    poisonedTurnsLeft: {},
    rabidSquares: [],
    rabidTurnsLeft: {},
    abilities,
    pendingOffer,
    activeAbility: null,
    level: puzzle.level,
    bonusMovesLeft: 0,
    shieldUp: false,
    aiRngSeed: carry.aiRngSeed ?? newAiRngSeed(),
  };
  if (puzzle.level === 6 && !pendingOffer && !offerIsExhausted(base)) {
    const rolled = rollOffer(base, mulberry32((puzzle.level * 7919) >>> 0));
    if (rolled.length > 0) {
      pendingOffer = rolled;
      tempo = TEMPO_MAX;
      return { ...base, pendingOffer, tempo };
    }
  }
  return base;
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
