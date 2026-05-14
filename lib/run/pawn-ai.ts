/**
 * Enemy AI for Rookie's Run.
 *
 * One enemy acts per turn — keeps the animation legible. Priority is global
 * across all enemies:
 *   1. Any piece that can capture Rookie this turn does so (tiebreak: piece
 *      value descending → leftmost → lowest).
 *   2. Otherwise the "most threatening" piece advances:
 *      - Pawns: lowest rank, leftmost (closest to rank 1).
 *      - Sliders/knights/queen: closest piece to Rookie steps toward her.
 *   3. If no one can act, the turn passes back to Rookie.
 *
 * Enemy pieces never step onto hazard squares either.
 */

import {
  clearStatusOnSquare,
  relocateStatusMarkers,
  tryAegisIntercept,
} from './abilities';
import { enemyAt } from './movement';
import { TEMPO_MAX, TEMPO_REWARD } from './scoring';
import { fromSquare, toSquare } from './types';
import type { BoardState, Coord, EnemyPiece, PieceType } from './types';

const BLACK_FORWARD = -1;

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
const QUEEN_DIRS: ReadonlyArray<[number, number]> = [...ROOK_DIRS, ...BISHOP_DIRS];
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

const PIECE_THREAT: Record<PieceType, number> = {
  queen: 4,
  bishop: 2,
  knight: 2,
  pawn: 1,
};

function inBounds(c: Coord): boolean {
  return c.file >= 1 && c.file <= 8 && c.rank >= 1 && c.rank <= 8;
}

function isHazard(hazards: Coord[], at: Coord): boolean {
  return hazards.some((h) => h.file === at.file && h.rank === at.rank);
}

/**
 * "Ghost blockers" — squares vacated by enemies earlier in this same turn.
 * Subsequent enemies treat them as still occupied so the player can plan
 * threats from the board they saw at the start of the turn (no piece can
 * slide through, jump onto, or advance into a square another enemy just left).
 */
function vacatedSet(state: BoardState): Set<string> {
  const out = new Set<string>();
  for (const sq of state.enemyVacatedSquares ?? []) {
    const file = sq.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const rank = parseInt(sq[1], 10);
    out.add(`${file},${rank}`);
  }
  return out;
}

function isVacated(vacated: ReadonlySet<string>, at: Coord): boolean {
  return vacated.has(`${at.file},${at.rank}`);
}

/** All squares this piece could move to (or capture on) given the board. */
function pieceLegalMoves(piece: EnemyPiece, state: BoardState): Coord[] {
  const vacated = vacatedSet(state);
  switch (piece.type) {
    case 'pawn': {
      // Advances one rank (no two-square open; no captures from advancing).
      const target: Coord = { file: piece.file, rank: piece.rank + BLACK_FORWARD };
      const out: Coord[] = [];
      if (
        inBounds(target) &&
        !isHazard(state.hazards, target) &&
        !enemyAt(state.pieces, target) &&
        !isVacated(vacated, target) &&
        !(state.rookie.file === target.file && state.rookie.rank === target.rank)
      ) {
        out.push(target);
      }
      // Diagonal captures of Rookie.
      for (const df of [-1, 1]) {
        const cap: Coord = { file: piece.file + df, rank: piece.rank + BLACK_FORWARD };
        if (
          inBounds(cap) &&
          !isHazard(state.hazards, cap) &&
          state.rookie.file === cap.file &&
          state.rookie.rank === cap.rank
        ) {
          out.push(cap);
        }
      }
      return out;
    }
    case 'knight': {
      const out: Coord[] = [];
      for (const [df, dr] of KNIGHT_DELTAS) {
        const c: Coord = { file: piece.file + df, rank: piece.rank + dr };
        if (!inBounds(c)) continue;
        if (isHazard(state.hazards, c)) continue;
        if (isVacated(vacated, c)) continue; // ghost blocker
        const blocker = enemyAt(state.pieces, c);
        if (blocker && blocker !== piece) continue; // can't land on friendly
        out.push(c);
      }
      return out;
    }
    case 'bishop':
    case 'queen': {
      const dirs = piece.type === 'queen' ? QUEEN_DIRS : BISHOP_DIRS;
      return slidingMoves(piece, state, dirs, vacated);
    }
  }
}

function slidingMoves(
  piece: EnemyPiece,
  state: BoardState,
  dirs: ReadonlyArray<[number, number]>,
  vacated: ReadonlySet<string> = new Set(),
): Coord[] {
  const out: Coord[] = [];
  for (const [df, dr] of dirs) {
    let f = piece.file + df;
    let r = piece.rank + dr;
    while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
      const c: Coord = { file: f, rank: r };
      if (isHazard(state.hazards, c)) break;
      if (isVacated(vacated, c)) break; // ghost blocker — stop before
      const blocker = enemyAt(state.pieces, c);
      const isRookie = state.rookie.file === f && state.rookie.rank === r;
      if (blocker && blocker !== piece) break; // friendly blocker — stop before
      if (isRookie) {
        out.push(c);
        break; // capture and stop
      }
      out.push(c);
      f += df;
      r += dr;
    }
  }
  return out;
}

function canCapture(piece: EnemyPiece, state: BoardState): boolean {
  return pieceLegalMoves(piece, state).some(
    (m) => m.file === state.rookie.file && m.rank === state.rookie.rank,
  );
}

function chebyshev(a: Coord, b: Coord): number {
  return Math.max(Math.abs(a.file - b.file), Math.abs(a.rank - b.rank));
}

/** Pick the single best move for `piece` that gets it closer to Rookie. */
function approachMove(piece: EnemyPiece, state: BoardState): Coord | null {
  const moves = pieceLegalMoves(piece, state);
  if (moves.length === 0) return null;
  const cur = chebyshev({ file: piece.file, rank: piece.rank }, state.rookie);
  let best: Coord | null = null;
  let bestDist = Infinity;
  for (const m of moves) {
    const d = chebyshev(m, state.rookie);
    if (d < bestDist || (d === bestDist && best && (m.file < best.file || (m.file === best.file && m.rank < best.rank)))) {
      bestDist = d;
      best = m;
    }
  }
  // Only move if it gets us strictly closer to Rookie.
  if (best && bestDist < cur) return best;
  return null;
}

function coordKey(c: { file: number; rank: number }): string {
  return `${c.file},${c.rank}`;
}

/**
 * When a decoy mark is active, return the "view state" the AI should plan
 * against: the marked piece is removed from `pieces` (it can't act, and isn't
 * a friendly blocker) and `rookie` is moved onto its square (so all existing
 * capture / approach logic naturally treats the mark as the target). Returns
 * null when no decoy is active or the marked piece is already gone.
 */
function decoyViewState(state: BoardState): {
  view: BoardState;
  decoyPiece: EnemyPiece;
} | null {
  if (!state.decoyTarget || state.decoyTurnsLeft <= 0) return null;
  const dt = fromSquare(state.decoyTarget);
  const decoyPiece = state.pieces.find(
    (p) => p.file === dt.file && p.rank === dt.rank,
  );
  if (!decoyPiece) return null;
  return {
    view: {
      ...state,
      rookie: { file: dt.file, rank: dt.rank },
      pieces: state.pieces.filter((p) => p !== decoyPiece),
    },
    decoyPiece,
  };
}

type EnemyAction = {
  mover: EnemyPiece;
  target: Coord;
  isCapture: boolean;
  isDecoyCapture?: boolean;
  isRabidCapture?: boolean;
};

/** Pick the enemy that will act, and the move they'll make. */
function chooseEnemyAction(
  state: BoardState,
  excludeSquares: ReadonlySet<string> = new Set(),
): EnemyAction | null {
  // If a decoy mark is active, run the existing capture/approach logic on a
  // view where the marked piece IS Rookie. Any capture returned is a friendly
  // fire against the decoy, not a loss.
  const decoy = decoyViewState(state);
  if (decoy) {
    const inner = chooseEnemyActionAgainst(decoy.view, excludeSquares);
    if (inner) {
      return {
        mover: inner.mover,
        target: inner.target,
        isCapture: inner.isCapture,
        isDecoyCapture: inner.isCapture,
      };
    }
    // Decoy is active but nobody can usefully act on it — fall through to
    // ordinary Rookie-targeting so the turn isn't a complete waste.
  }
  return chooseEnemyActionAgainst(state, excludeSquares);
}

function chooseEnemyActionAgainst(
  state: BoardState,
  excludeSquares: ReadonlySet<string>,
): EnemyAction | null {
  // Frozen squares are treated as if those pieces have already moved.
  const frozen = new Set(
    state.frozenSquares
      .map((sq) => {
        const file = sq.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
        const rank = parseInt(sq[1], 10);
        return `${file},${rank}`;
      }),
  );
  const isExcluded = (p: EnemyPiece) =>
    excludeSquares.has(coordKey(p)) || frozen.has(coordKey(p));

  // 0) Rabid pieces act on berserker logic first. They attack the nearest
  // reachable entity (Rookie counts; ties → biggest piece wins). If no
  // capture is reachable they approach the top-priority target instead.
  const rabid = new Set(
    state.rabidSquares.map((sq) => {
      const file = sq.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
      const rank = parseInt(sq[1], 10);
      return `${file},${rank}`;
    }),
  );
  if (rabid.size > 0) {
    const rabidPieces = state.pieces.filter(
      (p) => !isExcluded(p) && rabid.has(coordKey(p)),
    );
    const captures: Array<{
      mover: EnemyPiece;
      target: Coord;
      isCapture: boolean;
      isRabidCapture?: boolean;
      victimValue: number;
    }> = [];
    const approaches: Array<{
      mover: EnemyPiece;
      target: Coord;
      isCapture: boolean;
      approachDist: number;
    }> = [];
    for (const p of rabidPieces) {
      const a = rabidAction(p, state);
      if (!a) continue;
      if (a.kind === 'capture') {
        captures.push({
          mover: p,
          target: a.target,
          isCapture: a.isRookie,
          isRabidCapture: !a.isRookie,
          victimValue: a.victimValue,
        });
      } else {
        approaches.push({
          mover: p,
          target: a.target,
          isCapture: false,
          approachDist: a.approachDist,
        });
      }
    }
    if (captures.length > 0) {
      captures.sort((a, b) => {
        if (a.victimValue !== b.victimValue) return b.victimValue - a.victimValue;
        if (a.mover.file !== b.mover.file) return a.mover.file - b.mover.file;
        return a.mover.rank - b.mover.rank;
      });
      const pick = captures[0];
      return {
        mover: pick.mover,
        target: pick.target,
        isCapture: pick.isCapture,
        isRabidCapture: pick.isRabidCapture,
      };
    }
    if (approaches.length > 0) {
      approaches.sort((a, b) => {
        if (a.approachDist !== b.approachDist) return a.approachDist - b.approachDist;
        if (a.mover.file !== b.mover.file) return a.mover.file - b.mover.file;
        return a.mover.rank - b.mover.rank;
      });
      const pick = approaches[0];
      return { mover: pick.mover, target: pick.target, isCapture: pick.isCapture };
    }
    // No rabid piece can usefully act — fall through to normal AI for the
    // non-rabid pieces.
  }

  const isNormallyEligible = (p: EnemyPiece) =>
    !isExcluded(p) && !rabid.has(coordKey(p));
  // 1) Capture priority.
  const capturers = state.pieces
    .filter((p) => isNormallyEligible(p) && canCapture(p, state))
    .sort((a, b) => {
      const ta = PIECE_THREAT[a.type] ?? 0;
      const tb = PIECE_THREAT[b.type] ?? 0;
      if (ta !== tb) return tb - ta;
      if (a.file !== b.file) return a.file - b.file;
      return a.rank - b.rank;
    });
  if (capturers.length > 0) {
    return { mover: capturers[0], target: { ...state.rookie }, isCapture: true };
  }

  // 2) Movers: pawns advance toward rank 1; others approach Rookie.
  const vacated = vacatedSet(state);
  type Candidate = { mover: EnemyPiece; target: Coord; priority: number };
  const candidates: Candidate[] = [];
  for (const p of state.pieces) {
    if (!isNormallyEligible(p)) continue;
    if (p.type === 'pawn') {
      const target: Coord = { file: p.file, rank: p.rank + BLACK_FORWARD };
      if (
        inBounds(target) &&
        !isHazard(state.hazards, target) &&
        !enemyAt(state.pieces, target) &&
        !isVacated(vacated, target) &&
        !(state.rookie.file === target.file && state.rookie.rank === target.rank)
      ) {
        // Lower rank = higher priority (closer to rank 1 = bigger threat).
        candidates.push({ mover: p, target, priority: -p.rank });
      }
    } else {
      const target = approachMove(p, state);
      if (target) {
        // Closer to Rookie = higher priority (negative chebyshev).
        candidates.push({
          mover: p,
          target,
          priority: -chebyshev(target, state.rookie) + 0.5, // non-pawns slightly favored
        });
      }
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    if (a.mover.file !== b.mover.file) return a.mover.file - b.mover.file;
    return a.mover.rank - b.mover.rank;
  });
  return { mover: candidates[0].mover, target: candidates[0].target, isCapture: false };
}

/**
 * Squares this rabid piece can land on AS A CAPTURE this turn. Unlike normal
 * pieceLegalMoves, friendly pieces ARE legal capture targets here (rabies
 * doesn't care about teamwork). Rookie's square is also a capture target.
 * Bishops/queens still stop at the first thing on their ray.
 */
function rabidCaptureSquares(piece: EnemyPiece, state: BoardState): Coord[] {
  const vacated = vacatedSet(state);
  const out: Coord[] = [];
  switch (piece.type) {
    case 'pawn': {
      for (const df of [-1, 1]) {
        const c: Coord = { file: piece.file + df, rank: piece.rank + BLACK_FORWARD };
        if (!inBounds(c)) continue;
        if (isHazard(state.hazards, c)) continue;
        if (isVacated(vacated, c)) continue;
        const isRookie = state.rookie.file === c.file && state.rookie.rank === c.rank;
        const friendly = enemyAt(state.pieces, c);
        if (isRookie || (friendly && friendly !== piece)) out.push(c);
      }
      return out;
    }
    case 'knight': {
      for (const [df, dr] of KNIGHT_DELTAS) {
        const c: Coord = { file: piece.file + df, rank: piece.rank + dr };
        if (!inBounds(c)) continue;
        if (isHazard(state.hazards, c)) continue;
        if (isVacated(vacated, c)) continue;
        const isRookie = state.rookie.file === c.file && state.rookie.rank === c.rank;
        const friendly = enemyAt(state.pieces, c);
        if (isRookie || (friendly && friendly !== piece)) out.push(c);
      }
      return out;
    }
    case 'bishop':
    case 'queen': {
      const dirs = piece.type === 'queen' ? QUEEN_DIRS : BISHOP_DIRS;
      for (const [df, dr] of dirs) {
        let f = piece.file + df;
        let r = piece.rank + dr;
        while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
          const c: Coord = { file: f, rank: r };
          if (isHazard(state.hazards, c)) break;
          if (isVacated(vacated, c)) break;
          const isRookie = state.rookie.file === f && state.rookie.rank === r;
          const friendly = enemyAt(state.pieces, c);
          if (isRookie || (friendly && friendly !== piece)) {
            out.push(c);
            break;
          }
          f += df;
          r += dr;
        }
      }
      return out;
    }
  }
}

/**
 * Pick a rabid piece's action for this turn.
 *
 * Algorithm:
 *   1) Build a target list = Rookie + every other enemy. Rookie counts as the
 *      biggest piece (queen-tier 4).
 *   2) Sort by (Chebyshev distance asc, value desc) — closest pieces first,
 *      biggest piece on distance ties.
 *   3) If any sorted target is in `rabidCaptureSquares`, that's the kill.
 *   4) Otherwise the rabid piece approaches the top-priority target with a
 *      normal (non-capture) move that strictly reduces Chebyshev distance.
 */
type RabidAction =
  | { kind: 'capture'; target: Coord; isRookie: boolean; victimValue: number }
  | { kind: 'approach'; target: Coord; approachDist: number };

function rabidAction(piece: EnemyPiece, state: BoardState): RabidAction | null {
  const piecePos: Coord = { file: piece.file, rank: piece.rank };
  const targets: Array<{ at: Coord; value: number; isRookie: boolean }> = [
    { at: { ...state.rookie }, value: PIECE_THREAT.queen, isRookie: true },
  ];
  for (const p of state.pieces) {
    if (p === piece) continue;
    targets.push({
      at: { file: p.file, rank: p.rank },
      value: PIECE_THREAT[p.type] ?? 0,
      isRookie: false,
    });
  }
  if (targets.length === 0) return null;
  targets.sort((a, b) => {
    const da = chebyshev(piecePos, a.at);
    const db = chebyshev(piecePos, b.at);
    if (da !== db) return da - db;
    if (a.value !== b.value) return b.value - a.value;
    if (a.at.file !== b.at.file) return a.at.file - b.at.file;
    return a.at.rank - b.at.rank;
  });
  const captureSquares = rabidCaptureSquares(piece, state);
  for (const t of targets) {
    if (
      captureSquares.some((c) => c.file === t.at.file && c.rank === t.at.rank)
    ) {
      return {
        kind: 'capture',
        target: t.at,
        isRookie: t.isRookie,
        victimValue: t.value,
      };
    }
  }
  // No capture — approach the nearest target with a non-capture move.
  const focus = targets[0];
  const moves = pieceLegalMoves(piece, state).filter(
    (m) => !(m.file === state.rookie.file && m.rank === state.rookie.rank),
  );
  if (moves.length === 0) return null;
  const cur = chebyshev(piecePos, focus.at);
  let best: Coord | null = null;
  let bestDist = Infinity;
  for (const m of moves) {
    const d = chebyshev(m, focus.at);
    if (d < bestDist) {
      bestDist = d;
      best = m;
    }
  }
  if (!best || bestDist >= cur) return null;
  return { kind: 'approach', target: best, approachDist: bestDist };
}

/** Pawn promotion pool by level. Levels 1-4 → B/N, levels 5+ → B/N/Q. */
function promotionPool(level: number): PieceType[] {
  return level >= 5 ? ['bishop', 'knight', 'queen'] : ['bishop', 'knight'];
}

/** Apply a single chosen action to the state, returning the new state. */
function applyAction(state: BoardState, action: EnemyAction): BoardState {
  const { mover, target, isCapture, isDecoyCapture, isRabidCapture } = action;
  const fromSq = toSquare({ file: mover.file, rank: mover.rank });
  const toSq = toSquare(target);

  // Friendly-fire on the decoy: remove the marked piece, mover takes its
  // square, Rookie banks the capture (+ tempo), decoy mark clears. NOT a loss.
  if (isDecoyCapture) {
    const decoyPiece = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    const pieces = state.pieces
      .filter((p) => p !== decoyPiece)
      .map((p) =>
        p === mover ? { ...p, file: target.file, rank: target.rank } : { ...p },
      );
    const capturedType: PieceType | null = decoyPiece?.type ?? null;
    const tempoGain = capturedType ? TEMPO_REWARD[capturedType] ?? 0 : 0;
    const cleared = clearStatusOnSquare(state, toSq);
    const relocated = relocateStatusMarkers({ ...state, ...cleared }, fromSq, toSq);
    return {
      ...state,
      ...cleared,
      ...relocated,
      pieces,
      captures: capturedType
        ? [...state.captures, capturedType]
        : state.captures,
      tempo: Math.min(TEMPO_MAX, state.tempo + tempoGain),
      decoyTarget: null,
      decoyTurnsLeft: 0,
    };
  }

  // Rabid friendly-fire: same shape as decoy capture but rabies stays on the
  // mover (markers follow), and there's no decoy mark to clear.
  if (isRabidCapture) {
    const victim = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    const pieces = state.pieces
      .filter((p) => p !== victim)
      .map((p) =>
        p === mover ? { ...p, file: target.file, rank: target.rank } : { ...p },
      );
    const capturedType: PieceType | null = victim?.type ?? null;
    const tempoGain = capturedType ? TEMPO_REWARD[capturedType] ?? 0 : 0;
    const cleared = clearStatusOnSquare(state, toSq);
    const relocated = relocateStatusMarkers({ ...state, ...cleared }, fromSq, toSq);
    return {
      ...state,
      ...cleared,
      ...relocated,
      pieces,
      captures: capturedType
        ? [...state.captures, capturedType]
        : state.captures,
      tempo: Math.min(TEMPO_MAX, state.tempo + tempoGain),
    };
  }

  const newPieces = state.pieces.map((p) => {
    if (p !== mover) return { ...p };
    const moved: EnemyPiece = { ...p, file: target.file, rank: target.rank };
    // Pawn promotion: reaches Rookie's home rank.
    if (moved.type === 'pawn' && target.rank === 1) {
      const pool = promotionPool(state.level);
      moved.type = pool[Math.floor(Math.random() * pool.length)];
    }
    return moved;
  });
  if (isCapture) {
    return { ...state, pieces: newPieces, status: 'lost' };
  }
  const relocated = relocateStatusMarkers(state, fromSq, toSq);
  return { ...state, ...relocated, pieces: newPieces };
}

/**
 * Advance the enemy turn by ONE piece. Returns the new state.
 *
 * - If no piece can act, or the budget is spent, sets turn back to 'rookie'
 *   and clears enemyMovedSquares.
 * - If a capture happens, sets status='lost' and turn='rookie'.
 * - Otherwise leaves turn='enemy' so the caller can step again.
 */
export function stepEnemyTurn(state: BoardState): BoardState {
  if (state.status !== 'playing' || state.turn !== 'enemy') return state;
  const budget = Math.max(1, state.enemiesPerTurn ?? 1);
  const exclude = new Set(state.enemyMovedSquares);

  const endTurn = (s: BoardState): BoardState => {
    // Decrement freeze counters; drop entries that have run out.
    const nextFrozenTurnsLeft: Record<string, number> = {};
    const nextFrozenSquares: string[] = [];
    for (const sq of s.frozenSquares) {
      const left = (s.frozenTurnsLeft[sq] ?? 1) - 1;
      if (left > 0) {
        nextFrozenSquares.push(sq);
        nextFrozenTurnsLeft[sq] = left;
      }
    }
    // Decoy mark ticks down at end of enemy turn. Clears if it hits 0 or the
    // marked piece is no longer on the board.
    let decoyTarget = s.decoyTarget;
    let decoyTurnsLeft = s.decoyTurnsLeft;
    if (decoyTarget) {
      const dt = fromSquare(decoyTarget);
      const stillThere = s.pieces.some(
        (p) => p.file === dt.file && p.rank === dt.rank,
      );
      decoyTurnsLeft = Math.max(0, decoyTurnsLeft - 1);
      if (!stillThere || decoyTurnsLeft <= 0) {
        decoyTarget = null;
        decoyTurnsLeft = 0;
      }
    }
    // Decrement rabies counters; drop entries that have run out or have lost
    // their piece.
    const nextRabidSquares: string[] = [];
    const nextRabidTurnsLeft: Record<string, number> = {};
    for (const sq of s.rabidSquares) {
      const here = s.pieces.some((p) => toSquare(p) === sq);
      if (!here) continue;
      const left = (s.rabidTurnsLeft[sq] ?? 1) - 1;
      if (left > 0) {
        nextRabidSquares.push(sq);
        nextRabidTurnsLeft[sq] = left;
      }
    }
    // Decrement poison counters; pieces hitting 0 die (counted as a Rookie
    // capture — tempo + share).
    let pieces = s.pieces;
    let captures = s.captures;
    let tempo = s.tempo;
    const nextPoisonedSquares: string[] = [];
    const nextPoisonedTurnsLeft: Record<string, number> = {};
    for (const sq of s.poisonedSquares) {
      const victim = s.pieces.find((p) => toSquare(p) === sq);
      if (!victim) continue;
      const left = (s.poisonedTurnsLeft[sq] ?? 1) - 1;
      if (left > 0) {
        nextPoisonedSquares.push(sq);
        nextPoisonedTurnsLeft[sq] = left;
        continue;
      }
      pieces = pieces.filter((p) => p !== victim);
      captures = [...captures, victim.type];
      tempo = Math.min(TEMPO_MAX, tempo + (TEMPO_REWARD[victim.type] ?? 0));
      // Strip any other markers on the dying square.
      const ri = nextRabidSquares.indexOf(sq);
      if (ri >= 0) {
        nextRabidSquares.splice(ri, 1);
        delete nextRabidTurnsLeft[sq];
      }
      const fi = nextFrozenSquares.indexOf(sq);
      if (fi >= 0) {
        nextFrozenSquares.splice(fi, 1);
        delete nextFrozenTurnsLeft[sq];
      }
    }
    return {
      ...s,
      pieces,
      captures,
      tempo,
      turn: 'rookie',
      enemyMovedSquares: [],
      enemyVacatedSquares: [],
      frozenSquares: nextFrozenSquares,
      frozenTurnsLeft: nextFrozenTurnsLeft,
      decoyTarget,
      decoyTurnsLeft,
      poisonedSquares: nextPoisonedSquares,
      poisonedTurnsLeft: nextPoisonedTurnsLeft,
      rabidSquares: nextRabidSquares,
      rabidTurnsLeft: nextRabidTurnsLeft,
    };
  };

  if (state.enemyMovedSquares.length >= budget) return endTurn(state);

  const action = chooseEnemyAction(state, exclude);
  if (!action) return endTurn(state);

  // Aegis intercept — if Rookie is about to be captured AND she has Aegis
  // charges, fire it instead. Attacker either dies (T5) or is just blocked.
  // (Decoy captures are friendly fire and never trigger Aegis.)
  if (action.isCapture && !action.isDecoyCapture) {
    const blocked = tryAegisIntercept(state, action.mover);
    if (blocked) {
      const aegisOwned = blocked.abilities.find((a) => a.id === 'aegis');
      const attackerSquare = coordKey({ file: action.mover.file, rank: action.mover.rank });
      const withFx: BoardState = {
        ...blocked,
        lastAegisIntercept: {
          attackerSquare,
          rookieSquare: toSquare(blocked.rookie),
          id: Date.now() + Math.random(),
        },
      };
      // Non-T5: shield is consumed by this hit. End the turn so the remaining
      // budget can't slip a second capturer past a now-dropped shield.
      if (!aegisOwned || aegisOwned.tier !== 5) return endTurn(withFx);
      // T5: shield stays up forever — keep ticking the budget. Mark this
      // attacker as having "acted" (it actually vanished) so we don't re-pick it.
      const nextMoved = [...state.enemyMovedSquares, attackerSquare];
      if (nextMoved.length >= budget) return endTurn(withFx);
      return { ...withFx, turn: 'enemy', enemyMovedSquares: nextMoved };
    }
  }

  const originSquare = toSquare({ file: action.mover.file, rank: action.mover.rank });
  const after = applyAction(state, action);
  if (after.status === 'lost') return endTurn(after);

  const nextMoved = [...state.enemyMovedSquares, coordKey(action.target)];
  const nextVacated = [...(state.enemyVacatedSquares ?? []), originSquare];
  if (nextMoved.length >= budget) return endTurn(after);
  return {
    ...after,
    turn: 'enemy',
    enemyMovedSquares: nextMoved,
    enemyVacatedSquares: nextVacated,
  };
}

/**
 * Back-compat: bulk-run the entire enemy turn (used by tests or one-shot).
 * Prefer `stepEnemyTurn` from the UI so each move animates.
 */
export function runEnemyTurn(state: BoardState): BoardState {
  let cur = state;
  // Safety: cap at enemiesPerTurn iterations.
  const cap = Math.max(1, state.enemiesPerTurn ?? 1);
  for (let i = 0; i <= cap; i++) {
    if (cur.turn !== 'enemy' || cur.status !== 'playing') break;
    cur = stepEnemyTurn(cur);
  }
  return cur;
}

export { enemyAt };

/**
 * Returns the enemies that will act on the NEXT enemy turn (up to budget),
 * in order. Used to telegraph threats with a wiggle.
 */
export function nextEnemyMovers(state: BoardState): EnemyPiece[] {
  const budget = Math.max(1, state.enemiesPerTurn ?? 1);
  const remaining = budget - state.enemyMovedSquares.length;
  if (remaining <= 0) return [];

  let cur: BoardState = { ...state, turn: 'enemy' };
  const movers: EnemyPiece[] = [];

  for (let i = 0; i < remaining; i++) {
    const exclude = new Set(cur.enemyMovedSquares);
    const action = chooseEnemyAction(cur, exclude);
    if (!action) break;
    movers.push(action.mover);
    const originSquare = toSquare({ file: action.mover.file, rank: action.mover.rank });
    const after = applyAction(cur, action);
    if (after.status === 'lost') break;
    cur = {
      ...after,
      enemyMovedSquares: [...cur.enemyMovedSquares, coordKey(action.target)],
      enemyVacatedSquares: [...(cur.enemyVacatedSquares ?? []), originSquare],
    };
  }
  return movers;
}

/** Back-compat single-mover (returns first upcoming mover or null). */
export function nextEnemyMover(state: BoardState): EnemyPiece | null {
  return nextEnemyMovers(state)[0] ?? null;
}
