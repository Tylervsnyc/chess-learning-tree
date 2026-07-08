/**
 * Brilliant Move Detection (Chess.com-style)
 *
 * A move is "brilliant" when it's the engine's best move AND it sacrifices
 * material — the player offers a piece the opponent could naively grab, but
 * the engine eval says the position stays good (so the sac is sound).
 *
 * Modeled on Chess.com's post-2023 criteria (sacrifice + best move + not
 * already winning + not bad afterward) and the open-source freechess
 * reimplementation. Eval gates live in lib/game-eval.ts; this module only
 * answers: "did this move offer material?"
 */

import { Chess } from 'chess.js';

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

/**
 * Minimum net material offered (in pawns) to count as a sacrifice.
 * 2 = exchange sac (rook for minor) or bigger. Raise to 3 to require a
 * full minor piece; lower to 1 to count pawn sacs (Chess.com does this
 * for low-rated players, but it cheapens the badge).
 */
const MIN_SACRIFICE_VALUE = 2;

/**
 * Net material the side NOT to move is offering: the best naive capture
 * available to the side to move, counting one recapture deep.
 * "Naive" is the point — a poisoned piece still counts as offered;
 * the engine eval gate is what proves the offer is sound.
 */
function offeredMaterial(chess: Chess): number {
  let best = 0;

  const captures = chess.moves({ verbose: true }).filter(m => m.captured);
  for (const cap of captures) {
    const victim = PIECE_VALUES[cap.captured!] ?? 0;
    if (victim < 1) continue;

    chess.move(cap);
    const recaptures = chess
      .moves({ verbose: true })
      .filter(m => m.to === cap.to && m.captured);
    chess.undo();

    // No recapture: full piece is hanging. Recapture exists: attacker
    // trades itself, so net = victim - attacker (exchange approximation).
    const net = recaptures.length === 0
      ? victim
      : victim - (PIECE_VALUES[cap.piece] ?? 0);

    if (net > best) best = net;
  }

  return best;
}

/** Flip side-to-move so we can ask "what could the opponent grab right now?" */
function flipTurn(fen: string): string | null {
  const parts = fen.split(' ');
  if (parts.length < 4) return null;
  parts[1] = parts[1] === 'w' ? 'b' : 'w';
  parts[3] = '-'; // en passant square is meaningless after flipping
  return parts.join(' ');
}

/**
 * Does this move sacrifice material?
 *
 * Compares what the opponent could grab AFTER the move vs BEFORE it (so a
 * piece that was already hanging doesn't credit an unrelated move), minus
 * whatever the move itself captured (Bxf7 offers the bishop but pocketed a
 * pawn — net 2, not 3).
 *
 * Returns false on any parse error — never let detection break analysis.
 */
export function isSacrifice(fenBefore: string, san: string): boolean {
  try {
    const chess = new Chess(fenBefore);
    const move = chess.move(san);
    if (!move) return false;

    // A fresh queen reads as "hanging material" and false-positives (known
    // freechess bug) — promotions never qualify.
    if (move.promotion) return false;

    // Game over after the move: opponent has no captures, nothing is offered.
    if (chess.isGameOver()) return false;

    const offeredAfter = offeredMaterial(chess);
    if (offeredAfter < MIN_SACRIFICE_VALUE) return false;

    // What was already grabbable before the move. If the mover was in check,
    // the flipped position is illegal — treat as 0 (conservatively generous).
    let offeredBefore = 0;
    const flipped = flipTurn(fenBefore);
    if (flipped) {
      try {
        offeredBefore = offeredMaterial(new Chess(flipped));
      } catch {
        offeredBefore = 0;
      }
    }

    const gainedByMove = move.captured ? (PIECE_VALUES[move.captured] ?? 0) : 0;
    return offeredAfter - offeredBefore - gainedByMove >= MIN_SACRIFICE_VALUE;
  } catch {
    return false;
  }
}
