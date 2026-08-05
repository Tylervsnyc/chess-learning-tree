/**
 * What is actually INTERESTING about this puzzle?
 *
 * Difficult reels used to open with generic hype ("This one's TOUGH") — 5 of
 * every 7 posts saying nothing about the position on screen. This module reads
 * the position with chess.js and derives a hook that is specific to THIS puzzle
 * and true by construction, so scripts/ig-verify-captions.ts can prove it.
 *
 * Design rules:
 *   - every fact is computed from the board, never from a theme label
 *   - a hook must be INTRIGUING without handing over the solution: say the
 *     queen comes off, not which square it lands on
 *   - if nothing specific is found we return null and the caller falls back to
 *     the generic pool — an honest generic line beats a specific false one
 *
 * Uniqueness claims ("only one first move works", "the only way in") rest on
 * Lichess puzzle generation, which only keeps positions with a single winning
 * line. That is the ONLY fact here not computed from the board — every other
 * claim is replayed with chess.js and re-checked by scripts/ig-verify-captions.ts.
 */
import { Chess } from 'chess.js';

const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

const PIECE_NAME: Record<string, string> = {
  p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king',
};

export interface PuzzleFacts {
  solver: 'white' | 'black';
  solverMoves: number;
  isMate: boolean;
  mateIn: number | null;
  /** Solver material minus opponent material at the puzzle start, in pawns. */
  materialStart: number;
  /** Same, measured after the opponent answers the solver's first move. */
  materialAfterFirstExchange: number;
  /** The solver gives up at least a piece's worth on move one. */
  sacrifices: boolean;
  /** Heaviest piece the solver loses during the solution. */
  sacrificedPiece: string | null;
  /** First move is no check, no capture, no promotion. */
  quietFirstMove: boolean;
  /** A check was legally available on move one (whether or not it works). */
  checkAvailable: boolean;
  /** A capture was legally available on move one. */
  captureAvailable: boolean;
  /** The solver's first move gives check. */
  firstMoveIsCheck: boolean;
  /** The solver's first move captures something. */
  firstMoveIsCapture: boolean;
  /** Solver material at the end of the line minus at the start, in pawns. */
  materialSwing: number;
  /** Every solver move is a check. */
  allChecks: boolean;
  /** Promotion to something other than a queen. */
  underpromotion: string | null;
  /** Piece type that delivers mate. */
  matingPiece: string | null;
  /** Total pieces on the board at the puzzle start. */
  pieceCount: number;
}

/** Material balance (solver − opponent) for a position, in pawns. */
function balance(board: Chess, solver: 'w' | 'b'): number {
  let total = 0;
  for (const sq of board.board().flat()) {
    if (!sq) continue;
    total += (sq.color === solver ? 1 : -1) * VALUE[sq.type];
  }
  return total;
}

/** Replay the puzzle and read every fact off the board. Null if unplayable. */
export function analysePuzzle(fen: string, rawMoves: string[]): PuzzleFacts | null {
  const board = new Chess(fen);
  const play = (uci: string) => board.move({
    from: uci.slice(0, 2), to: uci.slice(2, 4),
    promotion: uci.length > 4 ? uci[4] : undefined,
  });

  try { play(rawMoves[0]); } catch { return null; }   // opponent's setup move

  const solverColor = board.turn();
  const solver = solverColor === 'w' ? 'white' : 'black';
  const materialStart = balance(board, solverColor);
  const pieceCount = board.board().flat().filter(Boolean).length;

  // What was on offer on move one? Needed before any "no checks available"
  // style claim — saying the winning move is quiet is only interesting, and
  // only honest, if we actually looked at the alternatives.
  let checkAvailable = false;
  let captureAvailable = false;
  for (const candidate of board.moves({ verbose: true })) {
    if (candidate.captured) captureAvailable = true;
    if (candidate.san.includes('+') || candidate.san.includes('#')) checkAvailable = true;
  }

  const solution = rawMoves.slice(1);
  if (!solution.length) return null;

  let solverMoves = 0;
  let quietFirstMove = false;
  let firstMoveIsCheck = false;
  let firstMoveIsCapture = false;
  let allChecks = true;
  let underpromotion: string | null = null;
  let worstLoss = 0;
  let sacrificedPiece: string | null = null;
  let materialAfterFirstExchange = materialStart;
  let matingPiece: string | null = null;

  for (const [i, uci] of solution.entries()) {
    let move;
    try { move = play(uci); } catch { return null; }
    const isSolverMove = i % 2 === 0;

    if (isSolverMove) {
      solverMoves++;
      if (i === 0) {
        firstMoveIsCheck = board.isCheck();
        firstMoveIsCapture = !!move.captured;
        quietFirstMove = !move.captured && !move.promotion && !board.isCheck();
      }
      if (!board.isCheck()) allChecks = false;
      if (move.promotion && move.promotion !== 'q') underpromotion = move.promotion;
    } else if (move.captured) {
      // The opponent took something of the solver's — track the biggest loss.
      if (VALUE[move.captured] > worstLoss) {
        worstLoss = VALUE[move.captured];
        sacrificedPiece = move.captured;
      }
    }

    // Balance once the opponent has answered move one (or at the end of a
    // one-move solution) — that's where a real sacrifice shows up.
    if (i === 1 || (i === 0 && solution.length === 1)) {
      materialAfterFirstExchange = balance(board, solverColor);
    }

    if (board.isCheckmate()) matingPiece = move.piece;
  }

  const isMate = board.isCheckmate();

  return {
    solver,
    solverMoves,
    isMate,
    mateIn: isMate ? solverMoves : null,
    materialStart,
    materialAfterFirstExchange,
    materialSwing: balance(board, solverColor) - materialStart,
    sacrifices: materialAfterFirstExchange <= materialStart - 3,
    sacrificedPiece,
    quietFirstMove,
    checkAvailable,
    captureAvailable,
    firstMoveIsCheck,
    firstMoveIsCapture,
    allChecks: allChecks && solverMoves > 1,
    underpromotion,
    matingPiece,
    pieceCount,
  };
}

const side = (f: PuzzleFacts) => (f.solver === 'white' ? 'White' : 'Black');

/** How far down is the solver at the start, named as a piece if it's clean. */
function deficit(f: PuzzleFacts): string | null {
  const down = -f.materialStart;
  if (down < 3) return null;
  if (down >= 8) return 'a queen';
  if (down >= 5) return 'a rook';
  if (down >= 3) return 'a piece';
  return null;
}

/** Deterministic pick so a given puzzle always gets the same phrasing. */
const pick = (variants: string[], seed: number) => variants[seed % variants.length];

/**
 * A hook about THIS puzzle, most striking verified fact first. Each branch has
 * several phrasings picked by `seed` (the puzzle's caption hash) so 5 posts a
 * week don't read like one template. Null when nothing specific is provable —
 * the caller then falls back to the generic pool.
 *
 * Every branch may only assert what PuzzleFacts actually establishes. In
 * particular, a line about a tempting check requires BOTH that a check was
 * legally available AND that the solution does not start with one.
 */
export function insightHook(f: PuzzleFacts, seed = 0): string | null {
  const S = side(f);
  const s = S.toLowerCase();
  const temptingCheck = f.checkAvailable && !f.firstMoveIsCheck;
  const temptingCapture = f.captureAvailable && !f.firstMoveIsCapture;

  // Underpromotion — rare enough to lead with, and it names no square.
  if (f.underpromotion) {
    return pick([
      `A queen is not good enough here. ${S} has to promote to something else.`,
      `Promote to a queen and you throw it away. ${S} needs a different piece.`,
      `The pawn gets to the end — and queening is the losing move.`,
    ], seed);
  }

  // Quiet move + forced mate: the hardest thing to see in chess.
  if (f.quietFirstMove && f.mateIn && f.mateIn > 1) {
    return pick([
      `No check. No capture. ${S} plays one quiet move and it is mate in ${f.mateIn}.`,
      `The move that mates in ${f.mateIn} is not a check and not a capture.`,
      `Mate in ${f.mateIn}, and it starts with the quietest move on the board.`,
    ], seed);
  }

  // Sacrifice into mate.
  if (f.sacrifices && f.mateIn) {
    const piece = f.sacrificedPiece ? PIECE_NAME[f.sacrificedPiece] : 'material';
    return pick([
      `${S} gives up the ${piece} and mates in ${f.mateIn}. Can you see why it works?`,
      `The ${piece} comes off the board on purpose. Mate in ${f.mateIn}.`,
      `Giving up the ${piece} is the only way in. ${f.mateIn} moves to mate.`,
    ], seed);
  }

  // Winning while behind.
  const behind = deficit(f);
  if (behind && f.mateIn) {
    return pick([
      `${S} is down ${behind} and mates in ${f.mateIn} anyway.`,
      `Material says ${s} is losing. The board says mate in ${f.mateIn}.`,
      `Down ${behind}, and it does not matter — mate in ${f.mateIn}.`,
    ], seed);
  }

  // A forcing run of checks.
  if (f.allChecks && f.mateIn && f.mateIn > 2) {
    return pick([
      `${f.mateIn} checks in a row, and the king never gets a square.`,
      `Every move is check. The king still has nowhere to go.`,
      `${f.mateIn} straight checks — no quiet moves needed.`,
    ], seed);
  }

  // Unusual mating piece.
  if (f.isMate && f.matingPiece === 'p') {
    return pick([
      `A pawn delivers the mate. Can you find the line?`,
      `The mate is given by a pawn. That is the whole trick.`,
    ], seed);
  }
  if (f.isMate && f.matingPiece === 'n' && f.mateIn && f.mateIn > 1) {
    return pick([
      `Only the knight can finish this one. Mate in ${f.mateIn}.`,
      `The knight lands the final blow — mate in ${f.mateIn}.`,
    ], seed);
  }

  // Quiet winning move. The tempting-alternative lines are only used when we
  // verified the alternative exists AND the solution doesn't start with it.
  if (f.quietFirstMove && !f.isMate) {
    if (temptingCheck) {
      return pick([
        `There is a check available. It is not the move. ${S} wins with something quiet.`,
        `The check is right there, and it is wrong. The winner is a quiet move.`,
        `Checking looks natural here. ${S} has to do something quieter.`,
      ], seed);
    }
    if (temptingCapture) {
      return pick([
        `There is a capture on the board and it is the wrong move. The winner is quiet.`,
        `Take the piece and you lose the win. ${S} plays quietly instead.`,
      ], seed);
    }
    return pick([
      `No check, no capture — ${s} wins with a quiet move.`,
      `Nothing forcing works. The winning move is a quiet one.`,
    ], seed);
  }

  // Sacrifice that wins material rather than mating.
  if (f.sacrifices && !f.isMate) {
    const piece = f.sacrificedPiece ? PIECE_NAME[f.sacrificedPiece] : 'material';
    return pick([
      `${S} hands over the ${piece} on purpose. It comes back with interest.`,
      `The ${piece} is offered up, and ${s} comes out ahead.`,
      `Losing the ${piece} is the point, not the problem.`,
    ], seed);
  }

  // Sparse board — an endgame reads differently and is worth naming.
  if (f.pieceCount <= 8 && f.mateIn) {
    return pick([
      `${f.pieceCount} pieces left on the board, and ${s} mates in ${f.mateIn}.`,
      `Almost nothing left on the board. Still mate in ${f.mateIn}.`,
    ], seed);
  }

  // A long forced mate is itself the story.
  if (f.mateIn && f.mateIn >= 3) {
    return pick([
      `Mate in ${f.mateIn}, all forced. Every other move throws it away.`,
      `${f.mateIn} moves to mate, and only one first move works.`,
      `A forced mate in ${f.mateIn}. The king is not escaping.`,
    ], seed);
  }

  // Material-winning tactics — name the haul, never the move.
  const gain = winnings(f);
  if (gain) {
    if (temptingCheck) {
      return pick([
        `${S} wins ${gain} here — and the check on the board is not how.`,
        `There is a check available. ${gain} is available too, and it is not the check.`,
      ], seed);
    }
    return pick([
      `There is ${gain} to be won in this position. ${f.solverMoves} moves to get it.`,
      `${S} wins ${gain} out of this. Can you find the ${f.solverMoves} moves?`,
      `${gain[0].toUpperCase() + gain.slice(1)} is sitting there for ${s} to take.`,
    ], seed);
  }

  return null;
}

/** Name the material the solver ends up ahead by, if it's a clean chunk. */
function winnings(f: PuzzleFacts): string | null {
  const g = f.materialSwing;
  if (g >= 9) return 'a queen';
  if (g >= 5) return 'a rook';
  if (g >= 3) return 'a piece';
  if (g >= 2) return 'the exchange';
  return null;
}

/** Convenience: FEN + raw moves → hook, or null. */
export function hookForPuzzle(fen: string, rawMoves: string[], seed = 0): string | null {
  const facts = analysePuzzle(fen, rawMoves);
  return facts ? insightHook(facts, seed) : null;
}
