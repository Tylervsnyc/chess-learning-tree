/**
 * lib/rookie/pick-move.ts
 *
 * THE one place Rookie decides on a move. Every surface that plays her —
 * /play, the workout's Fight Rounds, /box/bout — calls this and nothing else.
 *
 * Before this existed the selection pipeline was copy-pasted three times and
 * had already drifted apart: only /play ever reached for Maia, so "Level 5"
 * meant a different opponent depending on which screen you were on, and the
 * opening-book gate disagreed at L1-L2. A difficulty ladder you cannot measure
 * is not a ladder, and you cannot measure one Rookie when there are three.
 *
 * The pipeline, in order:
 *   1. Reactive opening book  — capped so beginners don't face 15 moves of theory
 *   2. Maia (L5/L6)           — neural net tuned to a human rating
 *   3. Random move            — the beginner "hung piece" feel Stockfish can't fake
 *   4. Stockfish MultiPV      — sampled from a candidate pool, not argmax
 *   5. Random fallback        — engine unavailable or errored; never stall the game
 *
 * This function is PURE DECISION: it returns the move plus how long the engine
 * actually thought. Pacing, animation, generation guards and applying the move
 * stay with the caller, because each surface has different rules about those
 * (a bout freezes mid-think at the bell; /play doesn't).
 */

import { Chess } from 'chess.js';
import { getReactiveBookMove } from '@/lib/rookie-opening-book';
import { getLevelEngineConfig, getEasyFirstWinConfig } from '@/lib/rookie-levels';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import { maia } from '@/lib/maia/maia-adapter';

/**
 * Book cap: at or below BOOK_CAP_MAX_LEVEL, Rookie leaves book after this many
 * of HER moves. Above it she plays the full trie — a stronger player has
 * legitimately met theory before.
 */
export const BOOK_MOVE_CAP = 5;
export const BOOK_CAP_MAX_LEVEL = 4;

/** Levels that play through Maia, with the human rating each targets. */
const MAIA_LEVELS: Record<number, number> = { 5: 1300, 6: 1500 };

export type RookieEngine =
  | 'opening-book'
  | 'maia'
  | 'random'
  | 'stockfish'
  | 'random-fallback';

export type RookieMove = { san: string } | { from: string; to: string; promotion?: string };

export interface RookieDecision {
  engine: RookieEngine;
  move: RookieMove;
  /** Milliseconds the engine actually spent — callers pace off this. */
  thinkMs: number;
  /** One-line description for the game log. */
  summary: string;
  /** Structured payload for the game log / telemetry. */
  detail: Record<string, unknown>;
  /** Only set when the book matched a named opening. */
  opening?: { slug: string; name: string };
}

export interface RookieMoveRequest {
  fen: string;
  /** Full SAN history of the game so far, both sides, in order. */
  sans: string[];
  rookieColor: 'white' | 'black';
  level: number;
  /** Openings the user has studied — biases the book toward them. */
  studiedSlugs?: string[];
  /**
   * IG_EASY_FIRST_WIN: swap in the extra blunder-prone engine and skip book
   * theory entirely, so a cold beginner wins fast. Display level stays 1.
   */
  easyFirstWin?: boolean;
  /**
   * False while the Stockfish worker is still warming up (the wasm binary is
   * heavyweight and the first segment of a workout can start before it lands).
   * Rookie plays a random move rather than stalling the board.
   */
  engineReady?: boolean;
}

/** How many moves ROOKIE has played, from the full both-sides SAN history. */
function rookieMovesPlayed(sans: string[], rookieColor: 'white' | 'black'): number {
  const parity = rookieColor === 'white' ? 0 : 1;
  return sans.filter((_, i) => i % 2 === parity).length;
}

/** A uniformly random legal move. Returns null only in a finished position. */
function randomMove(fen: string): { from: string; to: string; promotion?: string; san: string } | null {
  const moves = new Chess(fen).moves({ verbose: true });
  if (moves.length === 0) return null;
  const pick = moves[Math.floor(Math.random() * moves.length)];
  return { from: pick.from, to: pick.to, promotion: pick.promotion, san: pick.san };
}

function fromUci(uci: string): { from: string; to: string; promotion?: string } {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci.length > 4 ? uci[4] : undefined,
  };
}

/**
 * Decide Rookie's move. Resolves to null ONLY when the position has no legal
 * moves (the caller should already have detected game over) — every other
 * path, including a dead engine, still returns a move.
 */
export async function pickRookieMove(req: RookieMoveRequest): Promise<RookieDecision | null> {
  const { fen, sans, rookieColor, level, studiedSlugs, easyFirstWin = false, engineReady = true } = req;

  const fallback = (reason: RookieEngine, summary: string, detail: Record<string, unknown> = {}) => {
    const mv = randomMove(fen);
    if (!mv) return null;
    return {
      engine: reason,
      move: { from: mv.from, to: mv.to, promotion: mv.promotion },
      thinkMs: 0,
      summary: `${summary} -> ${mv.san}`,
      detail: { ...detail, move: mv.san },
    } satisfies RookieDecision;
  };

  // ── 1. Opening book ──────────────────────────────────────────────────────
  const capped = level <= BOOK_CAP_MAX_LEVEL && rookieMovesPlayed(sans, rookieColor) >= BOOK_MOVE_CAP;
  if (!capped && !easyFirstWin) {
    const book = getReactiveBookMove(fen, sans, rookieColor, studiedSlugs);
    if (book.inBook && book.moveSan) {
      return {
        engine: 'opening-book',
        move: { san: book.moveSan },
        thinkMs: 0,
        summary: `opening-book: ${book.moveSan}${book.matchedName ? ` (${book.matchedName})` : ''}`,
        detail: { engine: 'opening-book', opening: book.matchedSlug, move: book.moveSan },
        ...(book.matchedSlug && book.matchedName
          ? { opening: { slug: book.matchedSlug, name: book.matchedName } }
          : {}),
      };
    }
  }

  // ── 2. Maia (L5/L6) ──────────────────────────────────────────────────────
  const maiaElo = easyFirstWin ? undefined : MAIA_LEVELS[level];
  if (maiaElo && maia.getStatus() === 'ready') {
    const started = Date.now();
    try {
      const uci = await maia.getMaiaMove(fen, maiaElo, maiaElo);
      if (uci) {
        return {
          engine: 'maia',
          move: fromUci(uci),
          thinkMs: Date.now() - started,
          summary: `maia (elo=${maiaElo})`,
          detail: { engine: 'maia', rookieLevel: level, eloSelf: maiaElo },
        };
      }
    } catch {
      /* fall through to Stockfish's fallback below */
    }
    return fallback('random-fallback', 'maia error → random fallback', { engine: 'random-fallback' });
  }

  const cfg = easyFirstWin ? getEasyFirstWinConfig() : getLevelEngineConfig(level);

  // ── 3. Random move injection ─────────────────────────────────────────────
  // Even at skill 0 Stockfish's worst move is around 1000 ELO, so a genuine
  // beginner blunder has to be injected deliberately.
  if (cfg.randomMoveChance && Math.random() < cfg.randomMoveChance) {
    return fallback('random', `random move (level=${level}, chance=${cfg.randomMoveChance})`, {
      engine: 'random',
      rookieLevel: level,
      chance: cfg.randomMoveChance,
    });
  }

  // ── 4. Stockfish, sampled ────────────────────────────────────────────────
  if (!engineReady) {
    return fallback('random-fallback', 'engine warming → random', { engine: 'random-fallback' });
  }

  const started = Date.now();
  try {
    const uci = await stockfish.getBestMoveSampled(
      fen,
      cfg.skillLevel,
      cfg.depth,
      cfg.multiPV,
      cfg.poolSize,
      cfg.tolerance,
    );
    if (uci) {
      return {
        engine: 'stockfish',
        move: fromUci(uci),
        thinkMs: Date.now() - started,
        summary: `stockfish sampled (level=${level}, skill=${cfg.skillLevel}, depth=${cfg.depth}, pool=${cfg.poolSize}/${cfg.multiPV})`,
        detail: { engine: 'stockfish-sampled', rookieLevel: level, ...cfg },
      };
    }
  } catch {
    /* handled below */
  }

  // ── 5. Never stall ───────────────────────────────────────────────────────
  return fallback('random-fallback', 'engine error → random fallback', {
    engine: 'random-fallback',
  });
}
