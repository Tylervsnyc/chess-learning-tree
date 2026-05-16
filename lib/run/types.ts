/**
 * Core types for Rookie's Run.
 *
 * Sprint 2: 10-level run, Rookie can temporarily transform into Knight or Bishop
 * via the Tempo system (capture pieces → spend tempo to transform).
 *
 * Coordinate system: standard chess.
 *   file: 1-8 (a=1 through h=8)
 *   rank: 1-8 (white's first row = 1, white's promotion row = 8)
 *
 * Rookie starts on rank 1 and wins by reaching rank 8.
 */

import type { AbilityId, AbilityOffer, OwnedAbility } from './abilities';

export type PieceType = 'pawn' | 'knight' | 'bishop' | 'queen';
export type PieceColor = 'black';

/** Rookie's current movement form. She starts and reverts to 'rook'. */
export type RookieForm = 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export interface Coord {
  file: number; // 1-8
  rank: number; // 1-8
}

export interface EnemyPiece {
  type: PieceType;
  color: PieceColor;
  file: number;
  rank: number;
}

export type Turn = 'rookie' | 'enemy';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface BoardState {
  rookie: Coord;
  pieces: EnemyPiece[];
  hazards: Coord[]; // no-go squares for Rookie (introduced level 8+)
  turn: Turn;
  status: GameStatus;
  moveCount: number; // counts Rookie's moves only
  captures: PieceType[]; // chronological list of piece types Rookie has captured
  tempo: number; // current tempo (0..TEMPO_MAX)
  form: RookieForm; // Rookie's current movement form
  formMovesLeft: number; // remaining Rookie moves until auto-revert (0 when rook)
  moveLimit: number | null; // null = no limit; otherwise hard cap on Rookie moves
  enemiesPerTurn: number; // how many enemies act per enemy turn (default 1)
  /** Squares (algebraic) of pieces that have already moved this enemy turn. */
  enemyMovedSquares: string[];
  /**
   * Squares (algebraic) that an enemy *vacated* during the current enemy
   * turn — i.e. their position at the start of the turn. Treated as ghost
   * blockers for subsequent movers so the player can plan threats from the
   * board they actually saw. Cleared when control returns to Rookie.
   */
  enemyVacatedSquares: string[];
  /**
   * Squares (algebraic) of enemies that are frozen and must skip their
   * action. A freeze lasts TWO enemy turns — see `frozenTurnsLeft` for the
   * remaining turn count per square. Squares stay listed here for the full
   * lifetime of the freeze so the icy visual persists.
   */
  frozenSquares: string[];
  /**
   * Remaining enemy turns each frozen square will stay frozen. Decremented
   * at the end of each enemy turn; when it hits 0 the entry is removed from
   * both maps.
   */
  frozenTurnsLeft: Record<string, number>;
  /**
   * Decoy target — the algebraic square of an enemy piece that has been
   * marked as a decoy. While set, enemy AI treats this piece like Rookie:
   * teammates will capture it if they can, otherwise approach. Cleared when
   * the piece is captured (or moves) or when `decoyTurnsLeft` hits 0.
   */
  decoyTarget: string | null;
  /** Remaining enemy turns the decoy mark stays active. */
  decoyTurnsLeft: number;
  /**
   * Poisoned-piece squares (algebraic). On each enemy turn, every poisoned
   * square ticks down; when its counter hits 0 the piece dies (counted as a
   * capture for tempo / share). Moving a poisoned piece carries the poison
   * to its new square.
   */
  poisonedSquares: string[];
  /** Remaining enemy turns until each poisoned square's piece dies. */
  poisonedTurnsLeft: Record<string, number>;
  /**
   * Rabid-piece squares (algebraic). A rabid piece, on its turn, tries to
   * capture the nearest living thing (Rookie or any enemy). On Chebyshev
   * ties, picks the biggest piece. If nothing is reachable to capture this
   * turn, it approaches the nearest target instead. Rabies ticks down each
   * enemy turn; on 0 the piece reverts to normal AI.
   */
  rabidSquares: string[];
  /** Remaining enemy turns each rabid square stays rabid. */
  rabidTurnsLeft: Record<string, number>;
  /** Permanent abilities Rookie has accrued this run. */
  abilities: OwnedAbility[];
  /** When the tempo meter fills, the player is offered 3 ability choices. */
  pendingOffer: AbilityOffer | null;
  /** Currently-targeting ability — drives ability resolution UI. */
  activeAbility: { id: AbilityId; step: 'pick-square' | 'pick-enemy' } | null;
  /** Current level number (1-based) — drives pawn promotion options. */
  level: number;
  /**
   * Extra Rookie moves queued by Surge. While > 0, the turn stays with Rookie
   * after a move or ability instead of handing off to the enemy. Decremented
   * once per move/ability consumed. Resets to 0 at the start of each level.
   */
  bonusMovesLeft: number;
  /**
   * True while Rookie has an Aegis shield raised. Set by tapping the Aegis
   * ability card (which also decrements a charge). Consumed when an enemy
   * tries to capture her (T1-T4) — T5 keeps the shield up permanently.
   * Resets between levels.
   */
  shieldUp: boolean;
  /**
   * Transient signal: set on the state returned from an enemy step when Aegis
   * intercepts a capture. UI watches `id` for changes to fire the lunge-and-
   * bounce VFX. Not cleared by the engine — the UI tracks the last-seen id.
   */
  lastAegisIntercept?: { attackerSquare: string; rookieSquare: string; id: number };
  /**
   * Transient signal: set when an enemy attempts to capture Rookie while she
   * is in king form (Become King impervious). Distinct from Aegis so the UI
   * fires gold-themed VFX instead of the blue shield. UI tracks last-seen id.
   */
  lastImperviousBounce?: { attackerSquare: string; rookieSquare: string; id: number };
  /**
   * Transient signal: set when a Rookie ability resolves so the UI can fire
   * the matching cast VFX (charge streak / phase ghost / leap arc / freeze
   * dart / poison dart / rabies dart). UI tracks the last-seen id.
   */
  lastAbilityFx?: {
    kind:
      | 'phase-step'
      | 'leap'
      | 'freeze-ray'
      | 'poison-dart'
      | 'rabies-dart';
    from: string;
    to: string;
    id: number;
  };
  /**
   * Transient signal: set on the state returned from an enemy turn when one
   * or more poisoned pieces' counters tick to 0 and they die. UI watches `id`
   * for changes to fire the green-bubble drowning VFX on each death square.
   * Not cleared by the engine — the UI tracks the last-seen id.
   */
  lastPoisonDeath?: {
    deaths: { square: string; pieceType: PieceType }[];
    id: number;
  };
  /**
   * Transient signal: set when an enemy piece captures another enemy piece
   * (rabid friendly-fire or decoy-mark lure). The UI uses it to slide the
   * attacker sprite from fromSq -> toSq, since the chessboard's built-in diff
   * treats this as a piece-type swap and snaps.
   */
  lastEnemyCaptureFx?: {
    fromSq: string;
    toSq: string;
    pieceType: PieceType;
    id: number;
  };
  /**
   * Instant-ability undo handle. When a transform or Surge resolves we stash
   * the relevant pre-cast values here. Re-tapping the same card BEFORE the
   * next Rookie move restores them (refunding the use). Cleared on any
   * Rookie move (regular or ability) or when a different ability fires.
   */
  /**
   * Per-attempt RNG seed used by the enemy AI to randomize tiebreaks (e.g.
   * which pawn advances when several are tied for "lowest rank", or which
   * piece approaches when multiple are equidistant from Rookie). Fixed for
   * the lifetime of a single level attempt — replays of the same state from
   * the same seed produce the same moves — but a fresh seed is generated on
   * every retry / level transition so the same strategy can't be memorized.
   */
  aiRngSeed: number;
  cancellableActivation?: {
    abilityId: AbilityId;
    snapshot: {
      form: RookieForm;
      formMovesLeft: number;
      bonusMovesLeft: number;
      abilities: OwnedAbility[];
      shieldUp: boolean;
    };
  };
}

export interface RunPuzzle {
  level: number; // 1..10
  rookieStart: Coord;
  pieces: EnemyPiece[];
  hazards?: Coord[];
  moveLimit?: number;
  /** Pieces Rookie is allowed to transform into on this level. */
  allowedForms?: RookieForm[];
  /** Enemies that act each enemy turn (default 1). */
  enemiesPerTurn?: number;
}

/** Convert (file, rank) to algebraic square string e.g. 'e1'. */
export function toSquare({ file, rank }: Coord): string {
  return `${String.fromCharCode('a'.charCodeAt(0) + file - 1)}${rank}`;
}

/** Convert algebraic square string e.g. 'e1' to (file, rank). */
export function fromSquare(sq: string): Coord {
  return {
    file: sq.charCodeAt(0) - 'a'.charCodeAt(0) + 1,
    rank: parseInt(sq[1], 10),
  };
}

export function coordEq(a: Coord, b: Coord): boolean {
  return a.file === b.file && a.rank === b.rank;
}
