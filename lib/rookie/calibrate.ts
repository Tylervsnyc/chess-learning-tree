/**
 * lib/rookie/calibrate.ts
 *
 * Measures what Rookie's 10 levels ACTUALLY play at, in human Elo.
 *
 * Why this exists: `ROOKIE_LEVELS[n].elo` (200…2000) was typed onto the engine
 * configs by hand and never measured. That is not cosmetic — lib/elo/profile-elo.ts
 * feeds `getLevelElo(level)` in as the OPPONENT RATING for every Rookie game a
 * user plays, so a wrong ladder quietly skews everyone's Chess Path ELO. And
 * matchmaking ("Rookie finds your level") is meaningless on invented numbers.
 *
 * ── Method: one absolute anchor + a relative chain ──────────────────────────
 * The obvious approach — play every level against Maia at its nominal rating —
 * does not work at the bottom. Maia3 is trained on human games in roughly the
 * 1100-2000 band; ask it to play at 300 and you are extrapolating off the end
 * of its training data. Worse, a genuinely 300-rated Rookie scores ~0/60
 * against anything Maia can credibly produce, and a score of zero carries no
 * information — it only says "somewhere below", not how far.
 *
 * So we do what engine rating lists do:
 *
 *   1. ANCHOR — find the one level whose score against Maia at a rating inside
 *      Maia's honest band lands in [0.25, 0.75], where the score is actually
 *      informative. That level gets an absolute rating.
 *   2. CHAIN  — play each adjacent pair of levels against each other (L1 vs L2,
 *      L2 vs L3, … L9 vs L10) and measure the Elo GAP between them. Rookie can
 *      always play Rookie, at any strength, with no external model needed.
 *   3. SOLVE  — walk the chain out from the anchor in both directions.
 *
 * A saturated pair (one side wins essentially everything) yields only a lower
 * bound on the gap; those are clamped and flagged rather than silently
 * reported as fact.
 *
 * Colours are alternated in every matchup so White's first-move advantage
 * cancels instead of biasing the result.
 *
 * Pure logic, no React. Runs in the browser because both engines are wasm and
 * pickRookieMove is the real client-side pipeline — measuring a node
 * reimplementation would measure the wrong Rookie.
 */

import { Chess } from 'chess.js';
import { pickRookieMove } from './pick-move';
import { maia } from '@/lib/maia/maia-adapter';

/** Plies before a game is called a draw. ~150 moves a side is plenty. */
const MAX_PLIES = 300;

/**
 * Maia's honest band. Outside this we'd be extrapolating past its training
 * data and reporting confident nonsense.
 */
export const MAIA_MIN_ELO = 1100;
export const MAIA_MAX_ELO = 1900;

/** Scores this lopsided carry no usable information — treat as a bound. */
const SATURATION = 0.02;
/** Cap on a single measured gap, in Elo, when a pair saturates. */
const MAX_GAP = 600;

export type Player =
  | { kind: 'rookie'; level: number }
  | { kind: 'maia'; elo: number };

export function playerLabel(p: Player): string {
  return p.kind === 'rookie' ? `Rookie L${p.level}` : `Maia ${p.elo}`;
}

/** Score for WHITE: 1 win, 0.5 draw, 0 loss. */
export type GameScore = 0 | 0.5 | 1;

async function moveFor(p: Player, fen: string, sans: string[], color: 'white' | 'black'): Promise<string | null> {
  if (p.kind === 'maia') {
    return maia.getMaiaMove(fen, p.elo, p.elo);
  }
  const decision = await pickRookieMove({ fen, sans, rookieColor: color, level: p.level });
  if (!decision) return null;
  if ('san' in decision.move) {
    // Book moves come back as SAN; convert so the caller has one shape.
    const g = new Chess(fen);
    try {
      const mv = g.move(decision.move.san);
      return `${mv.from}${mv.to}${mv.promotion ?? ''}`;
    } catch {
      return null;
    }
  }
  const { from, to, promotion } = decision.move;
  return `${from}${to}${promotion ?? ''}`;
}

/** Play one full game. Resolves to White's score. */
export async function playGame(white: Player, black: Player): Promise<GameScore> {
  const game = new Chess();
  const sans: string[] = [];

  for (let ply = 0; ply < MAX_PLIES; ply++) {
    if (game.isGameOver()) break;
    const toMove = game.turn() === 'w' ? 'white' : 'black';
    const player = toMove === 'white' ? white : black;

    const uci = await moveFor(player, game.fen(), sans, toMove);
    let applied = false;
    if (uci) {
      try {
        const mv = game.move({
          from: uci.slice(0, 2),
          to: uci.slice(2, 4),
          promotion: (uci.length > 4 ? uci[4] : 'q') as 'q' | 'r' | 'b' | 'n',
        });
        sans.push(mv.san);
        applied = true;
      } catch {
        applied = false;
      }
    }
    if (!applied) {
      // An engine that cannot produce a legal move forfeits the position; a
      // silent random substitute would quietly inflate that side's rating.
      return toMove === 'white' ? 0 : 1;
    }
  }

  if (game.isCheckmate()) {
    // The side to move is the one that got mated.
    return game.turn() === 'w' ? 0 : 1;
  }
  return 0.5;
}

export interface MatchResult {
  a: Player;
  b: Player;
  games: number;
  /** A's score share across the match, 0..1. */
  scoreA: number;
  /** Elo of A minus Elo of B, derived from scoreA. */
  eloDiff: number;
  /** True when the score saturated — eloDiff is only a bound. */
  saturated: boolean;
}

/**
 * Elo difference implied by a score share. The inverse of the usual
 * expectancy curve; ±MAX_GAP when the score saturates, since the real
 * difference is unbounded there.
 */
export function eloDiffFromScore(score: number): { diff: number; saturated: boolean } {
  if (score <= SATURATION) return { diff: -MAX_GAP, saturated: true };
  if (score >= 1 - SATURATION) return { diff: MAX_GAP, saturated: true };
  return { diff: -400 * Math.log10(1 / score - 1), saturated: false };
}

/**
 * Play `games` between two players, alternating colours, and derive the Elo
 * gap. `onGame` reports progress after every game so a long sweep isn't a
 * frozen screen.
 */
export async function playMatch(
  a: Player,
  b: Player,
  games: number,
  onGame?: (played: number, total: number) => void,
  shouldStop?: () => boolean,
): Promise<MatchResult> {
  let scoreA = 0;
  let played = 0;

  for (let i = 0; i < games; i++) {
    if (shouldStop?.()) break;
    // A is white on even games, black on odd — the advantage cancels.
    const aIsWhite = i % 2 === 0;
    const whiteScore = aIsWhite ? await playGame(a, b) : await playGame(b, a);
    scoreA += aIsWhite ? whiteScore : 1 - whiteScore;
    played++;
    onGame?.(played, games);
  }

  const share = played > 0 ? scoreA / played : 0.5;
  const { diff, saturated } = eloDiffFromScore(share);
  return { a, b, games: played, scoreA: share, eloDiff: diff, saturated };
}

export interface CalibrationResult {
  /** Measured Elo per level, index 0 = L1. */
  elos: number[];
  /** Which level carried the absolute anchor, and against what. */
  anchor: { level: number; maiaElo: number; scoreShare: number } | null;
  /** Gap between level n and n+1, index 0 = L1→L2. */
  gaps: MatchResult[];
  /** Levels whose rating rests on at least one saturated (bounded) gap. */
  uncertain: number[];
}

/**
 * Solve the ladder from one anchored level plus the adjacent-pair gaps.
 * `gaps[i]` is the measured Elo of level i+1 minus level i+2 (a is the lower
 * level), so walking up means subtracting the diff.
 */
export function solveLadder(
  anchorLevel: number,
  anchorElo: number,
  gaps: MatchResult[],
): { elos: number[]; uncertain: number[] } {
  const elos = new Array<number>(10).fill(NaN);
  const shaky = new Set<number>();
  elos[anchorLevel - 1] = anchorElo;

  // Upward: L(n+1) = L(n) - gap(n)   [gap is lower minus higher, so negative]
  let doubtful = false;
  for (let lvl = anchorLevel; lvl < 10; lvl++) {
    const g = gaps[lvl - 1];
    if (!g) break;
    if (g.saturated) doubtful = true;
    elos[lvl] = Math.round(elos[lvl - 1] - g.eloDiff);
    if (doubtful) shaky.add(lvl + 1);
  }

  // Downward: L(n-1) = L(n) + gap(n-1)
  doubtful = false;
  for (let lvl = anchorLevel; lvl > 1; lvl--) {
    const g = gaps[lvl - 2];
    if (!g) break;
    if (g.saturated) doubtful = true;
    elos[lvl - 2] = Math.round(elos[lvl - 1] + g.eloDiff);
    if (doubtful) shaky.add(lvl - 1);
  }

  return { elos, uncertain: [...shaky].sort((x, y) => x - y) };
}
