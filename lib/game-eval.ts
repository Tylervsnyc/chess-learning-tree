/**
 * Game Evaluation Engine
 *
 * Converts Stockfish centipawn evaluations into:
 * - Win percentages (Lichess sigmoid)
 * - Move classifications (inaccuracy/mistake/blunder)
 * - Per-move and game accuracy scores
 *
 * Math adapted from Lichess open source (lichess-org/lila):
 * - Sigmoid: scalachess/core/src/main/scala/eval.scala
 * - Accuracy: modules/analyse/src/main/AccuracyPercent.scala
 * - Classification: modules/tree/src/main/Advice.scala
 */

import { Chess } from 'chess.js';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export type MoveClassification =
  | 'brilliant'    // sound sacrifice that keeps you on top (rare)
  | 'great'        // best move that punished an opponent's error (rare)
  | 'checkmate'    // the mating move — engines can't eval a finished game
  | 'good'         // small or no win% loss
  | 'inaccuracy'   // >= 10% win% drop
  | 'mistake'      // >= 20% win% drop
  | 'blunder'      // >= 30% win% drop
  | 'book'         // opening book move
  | 'forced'       // only reasonable move
  | 'unknown';     // no trustworthy eval for this move — never grade it

export interface PositionEval {
  cp: number | null;       // centipawns (positive = white advantage)
  mate: number | null;     // mate in N (positive = white mates)
  bestMove: string | null; // UCI notation
  bestLine: string[];      // PV line
  depth: number;
}

export interface MoveEvaluation {
  moveNumber: number;
  san: string;
  movedBy: 'player' | 'rookie';
  evalBefore: PositionEval;
  evalAfter: PositionEval;
  winPercentBefore: number;   // 0-100 from mover's perspective
  winPercentAfter: number;    // 0-100 from mover's perspective
  winPercentDelta: number;    // drop in win% (positive = lost ground)
  classification: MoveClassification;
  accuracy: number;           // 0-100
  bestMoveSan: string | null;
}

export interface GameAnalysis {
  moves: MoveEvaluation[];
  playerAccuracy: number;       // 0-100 game accuracy
  rookieAccuracy: number;       // 0-100 game accuracy
  playerMoveCount: number;
  blunders: number;
  mistakes: number;
  inaccuracies: number;
  brilliantMoves: number;
  greatMoves: number;
}

/**
 * The ONE depth a finished game is graded at — the post-game pass on /play,
 * the stored grades, /review's fallback re-grade, the bout review, the
 * backfill and the Legendary calibration all use it, so a move can't grade
 * one way on the finish screen and another in the review. (Live in-game evals
 * run shallower — they drive the eval bar and Rookie's mood, never grades.)
 */
export const GRADE_DEPTH = 14;

// ════════════════════════════════
// CORE MATH — Lichess sigmoid
// ════════════════════════════════

const SIGMOID_MULTIPLIER = -0.00368208;
const CP_CAP = 1000;

/**
 * Convert centipawns to winning chances [-1, +1].
 * 0 = equal, +1 = white wins, -1 = black wins.
 * Calibrated from real game data (Lichess PR #11148).
 */
export function cpToWinningChances(cp: number): number {
  const clamped = Math.max(-CP_CAP, Math.min(CP_CAP, cp));
  return 2 / (1 + Math.exp(SIGMOID_MULTIPLIER * clamped)) - 1;
}

/**
 * Convert mate-in-N to equivalent centipawns.
 * Mate-in-1 = ~2000cp, Mate-in-10+ = ~1100cp.
 */
export function mateToEquivalentCp(mate: number): number {
  const sign = mate > 0 ? 1 : -1;
  const distance = Math.min(10, Math.abs(mate));
  return sign * (21 - distance) * 100;
}

/**
 * Get winning chances from any eval (cp or mate).
 * Returns [-1, +1] from white's perspective.
 */
export function evalToWinningChances(cp: number | null, mate: number | null): number {
  if (mate !== null) {
    return cpToWinningChances(mateToEquivalentCp(mate));
  }
  if (cp !== null) {
    return cpToWinningChances(cp);
  }
  // No eval — 0 keeps DISPLAY surfaces (eval bar) centered, but grading code
  // must never reach here: analyzeGameMoves marks such moves 'unknown'.
  return 0;
}

/** Does this position eval carry a real score? Grading requires one. */
export function hasUsableEval(e: PositionEval | null | undefined): e is PositionEval {
  return !!e && (e.cp !== null || e.mate !== null);
}

/**
 * Convert winning chances [-1, +1] to win percent [0, 100].
 * 50 = equal, 100 = white winning, 0 = black winning.
 */
export function winningChancesToPercent(wc: number): number {
  return 50 + 50 * wc;
}

/**
 * Get win percent [0, 100] from white's perspective.
 */
export function evalToWinPercent(cp: number | null, mate: number | null): number {
  return winningChancesToPercent(evalToWinningChances(cp, mate));
}

/**
 * Flip win percent to be from a specific color's perspective.
 */
export function winPercentForColor(whiteWinPercent: number, color: 'white' | 'black'): number {
  return color === 'white' ? whiteWinPercent : 100 - whiteWinPercent;
}

// ════════════════════════════════
// MOVE CLASSIFICATION
// ════════════════════════════════

// Win% drop thresholds (from Lichess Advice.scala). Lichess's 0.3/0.2/0.1
// are on the winning-chances scale [-1, +1]; our deltas are in win% points
// [0, 100], so the equivalent thresholds are halved-of-100 = 15/10/5.
// (The old 30/20/10 misread the scale and was 2x more lenient than Lichess.)
const BLUNDER_THRESHOLD = 15;
const MISTAKE_THRESHOLD = 10;
const INACCURACY_THRESHOLD = 5;
const GREAT_MOVE_THRESHOLD = 2; // within 2% of engine's best
// "!" is earned, not given: the best move only rates 'great' when it punished
// an opponent error (their previous move dropped ≥ this much win%). Playing
// the top move in a quiet position is just 'good' — chess.com's bar.
const GREAT_PUNISH_MIN = 10;
// Already at ≥ this win% before moving → nothing left to punish; no "!".
const GREAT_MAX_WP_BEFORE = 90;

/**
 * Classify a move based on win% delta.
 * @param winPercentDelta - drop in win% (positive = lost ground)
 * @param wasBestMove - did they play the engine's #1 choice?
 * @param alternativeCount - how many reasonable alternatives exist?
 * @param punishedError - did the opponent's previous move hand over ≥ GREAT_PUNISH_MIN win%?
 */
export function classifyMove(
  winPercentDelta: number,
  wasBestMove: boolean,
  alternativeCount?: number,
  punishedError = false,
): MoveClassification {
  // Gained or maintained position
  if (winPercentDelta <= 0) {
    if (wasBestMove && alternativeCount !== undefined && alternativeCount <= 1) {
      return 'forced';
    }
    if (wasBestMove && punishedError) return 'great';
    return 'good';
  }

  // Lost ground
  if (winPercentDelta >= BLUNDER_THRESHOLD) return 'blunder';
  if (winPercentDelta >= MISTAKE_THRESHOLD) return 'mistake';
  if (winPercentDelta >= INACCURACY_THRESHOLD) return 'inaccuracy';

  if (winPercentDelta <= GREAT_MOVE_THRESHOLD && wasBestMove && punishedError) return 'great';

  return 'good';
}

// ════════════════════════════════
// ACCURACY CALCULATION
// ════════════════════════════════

/**
 * Per-move accuracy (Lichess AccuracyPercent.scala).
 * Exponential decay based on win% drop.
 */
export function moveAccuracy(winPercentBefore: number, winPercentAfter: number): number {
  if (winPercentAfter >= winPercentBefore) return 100;

  const winDiff = winPercentBefore - winPercentAfter;
  const raw = 103.1668 * Math.exp(-0.04354 * winDiff) - 3.1669;
  // +1 uncertainty bonus (Lichess convention)
  return Math.max(0, Math.min(100, raw + 1));
}

/**
 * Harmonic mean — penalizes individual bad moves harder than arithmetic mean.
 */
function harmonicMean(values: number[]): number {
  if (values.length === 0) return 0;
  // Avoid division by zero: treat 0 accuracy as 0.1
  const sum = values.reduce((acc, v) => acc + 1 / Math.max(v, 0.1), 0);
  return values.length / sum;
}

/**
 * Compute game accuracy using Lichess's blend:
 * average of volatility-weighted mean + harmonic mean.
 */
export function gameAccuracy(moveAccuracies: number[], winPercents: number[]): number {
  if (moveAccuracies.length === 0) return 0;
  if (moveAccuracies.length === 1) return moveAccuracies[0];

  // 1. Volatility-weighted mean
  const windowSize = Math.max(2, Math.min(8, Math.floor(moveAccuracies.length / 10)));
  const weights: number[] = [];

  for (let i = 0; i < moveAccuracies.length; i++) {
    // Sliding window around this move
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(winPercents.length, start + windowSize);
    const window = winPercents.slice(start, end);

    // Standard deviation of win% in window = volatility
    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const variance = window.reduce((a, v) => a + (v - mean) ** 2, 0) / window.length;
    const stddev = Math.sqrt(variance);

    // Clamp weight [0.5, 12] — volatile positions count more
    weights.push(Math.max(0.5, Math.min(12, stddev)));
  }

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const weightedMean = moveAccuracies.reduce((acc, v, i) => acc + v * weights[i], 0) / totalWeight;

  // 2. Harmonic mean
  const hMean = harmonicMean(moveAccuracies);

  // 3. Blend
  return (weightedMean + hMean) / 2;
}

// ════════════════════════════════
// KEY MOMENTS (replaces heuristic game-review.ts)
// ════════════════════════════════

export type MomentType = 'blunder' | 'mistake' | 'best-move' | 'turning-point';

export interface KeyMoment {
  type: MomentType;
  moveNumber: number;
  title: string;
  fenBefore: string;
  fenAfter: string;
  moveSan: string;
  from: string;
  to: string;
  movedBy: 'player' | 'rookie';
  description: string;
  winPercentDelta: number;
}

/**
 * Extract key moments from a GameAnalysis + move records.
 * Finds the biggest blunder, best move, and turning point — all eval-driven.
 */
export function extractKeyMoments(
  analysis: GameAnalysis,
  moveRecords: { san: string; movedBy: 'player' | 'rookie'; moveNumber: number; fenAfter: string; from: string; to: string }[],
  playerName?: string,
): KeyMoment[] {
  const moments: KeyMoment[] = [];
  const name = playerName || 'You';

  // Helper: get FEN before a move (previous move's fenAfter, or start position)
  const fenBefore = (idx: number) =>
    idx > 0 ? moveRecords[idx - 1].fenAfter : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  // Only look at player moves for mistakes/best moves
  const playerMoveIndices = analysis.moves
    .map((m, i) => ({ eval: m, idx: i }))
    .filter(({ eval: m }) => m.movedBy === 'player');

  // 1. Biggest blunder/mistake — largest win% drop
  const worstMove = playerMoveIndices
    .filter(({ eval: m }) => m.classification === 'blunder' || m.classification === 'mistake')
    .sort((a, b) => b.eval.winPercentDelta - a.eval.winPercentDelta)[0];

  if (worstMove) {
    const m = worstMove.eval;
    const rec = moveRecords[worstMove.idx];
    const drop = Math.round(m.winPercentDelta);
    const isBlunder = m.classification === 'blunder';
    moments.push({
      type: isBlunder ? 'blunder' : 'mistake',
      moveNumber: m.moveNumber,
      title: isBlunder ? 'Blunder' : 'Mistake',
      fenBefore: fenBefore(worstMove.idx),
      fenAfter: rec.fenAfter,
      moveSan: m.san,
      from: rec.from,
      to: rec.to,
      movedBy: 'player',
      winPercentDelta: m.winPercentDelta,
      description: m.bestMoveSan
        ? `${m.san} cost ${name.toLowerCase() === 'you' ? 'you' : name} ${drop}% winning chances. ${m.bestMoveSan} was better here.`
        : `${m.san} dropped your chances by ${drop}%. Before moving, ask: "What can they do after this?"`,
    });
  }

  // 2. Best move — highest accuracy player move (great/brilliant)
  const bestMove = playerMoveIndices
    .filter(({ eval: m }) => m.classification === 'great' || m.classification === 'brilliant')
    .sort((a, b) => a.eval.winPercentDelta - b.eval.winPercentDelta)[0];

  if (bestMove) {
    const m = bestMove.eval;
    const rec = moveRecords[bestMove.idx];
    moments.push({
      type: 'best-move',
      moveNumber: m.moveNumber,
      title: m.classification === 'brilliant' ? 'Legendary' : 'Great move',
      fenBefore: fenBefore(bestMove.idx),
      fenAfter: rec.fenAfter,
      moveSan: m.san,
      from: rec.from,
      to: rec.to,
      movedBy: 'player',
      winPercentDelta: m.winPercentDelta,
      description: m.classification === 'brilliant'
        ? `${m.san} — the only winning move, and you found it.`
        : `${m.san} — engine's top choice. You saw what Rookie saw.`,
    });
  }

  // 3. Turning point — biggest absolute eval swing in either direction
  if (analysis.moves.length >= 6) {
    const turningPoint = [...analysis.moves]
      .sort((a, b) => Math.abs(b.winPercentDelta) - Math.abs(a.winPercentDelta))[0];

    // Only add if it's different from the worst/best move already shown
    const alreadyShown = moments.map(m => m.moveNumber);
    if (turningPoint && !alreadyShown.includes(turningPoint.moveNumber)) {
      const idx = analysis.moves.indexOf(turningPoint);
      const rec = moveRecords[idx];
      if (rec) {
        const gained = turningPoint.winPercentDelta < 0;
        moments.push({
          type: 'turning-point',
          moveNumber: turningPoint.moveNumber,
          title: 'Turning point',
          fenBefore: fenBefore(idx),
          fenAfter: rec.fenAfter,
          moveSan: turningPoint.san,
          from: rec.from,
          to: rec.to,
          movedBy: turningPoint.movedBy,
          winPercentDelta: turningPoint.winPercentDelta,
          description: gained
            ? `Move ${turningPoint.moveNumber} is where ${turningPoint.movedBy === 'player' ? name.toLowerCase() === 'you' ? 'you' : name : 'Rookie'} took control.`
            : `The game slipped on move ${turningPoint.moveNumber}. Things were close before this.`,
        });
      }
    }
  }

  // Sort by move number for chronological display
  moments.sort((a, b) => a.moveNumber - b.moveNumber);

  return moments;
}

// ════════════════════════════════
// BRILLIANT ("LEGENDARY") MOVE DETECTION — chess.com-style, scaled by level
// ════════════════════════════════

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const PIECE_VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

/**
 * The Legendary gates. One set per Rookie level: a beginner's sacrifice only
 * has to be near-best and leave them okay; at the top of the ladder it has to
 * be the engine's move, from a position that was still a fight.
 */
export interface LegendaryRules {
  /** Max win% the move may give up vs. best. Always kept < INACCURACY_THRESHOLD
   *  so a move can never be Legendary AND an inaccuracy. */
  maxDelta: number;
  /** At/above this win% before the move you're already winning — nothing to prove. */
  maxWpBefore: number;
  /** The mover must still have at least this win% after the sacrifice. */
  minWpAfter: number;
  /** Material (pawn units) the move itself puts en prise. */
  minSac: number;
  /** Must be exactly the engine's top move, not merely within maxDelta. */
  requireEngineBest: boolean;
  /** Max centipawns the move may give up vs. the engine's best. Win% flattens
   *  out near 0 and 100 (a whole piece costs ~2% when you're +8 or -8), so a
   *  win%-only "near-best" check lets real losses through at both ends; this
   *  gate doesn't saturate. */
  maxCpLoss: number;
}

/**
 * Calibrated 2026-09-21 by scripts/calibrate-legendary.ts on 555 real
 * play-rookie games, graded at GRADE_DEPTH with the app's own WASM engine,
 * AFTER the book pass (book moves are never Legendary).
 *
 * Two axes:
 *  - SKILL (maxCpLoss) scales with level: how close to the engine's move the
 *    sacrifice must be — 1.5 pawns of slack at L1, 0.4 at L10.
 *  - SITUATION (maxWpBefore 92 / minWpAfter 10) is shared: not already won
 *    before, not dead lost after. Kept this loose on purpose — against a weak
 *    Rookie players are usually far ahead, against a strong one usually
 *    behind, and a sound sac happens in both.
 *
 * The target was ~1 game in 4 at every level. With an HONEST sacrifice (one
 * the move itself makes — see sacrificeNetLoss) real games don't contain that
 * many: even with every situation gate removed, L1 tops out at 19% and L5 at
 * 11%. These gates are the loosest defensible set; they land 7-21% per level
 * (~15% overall). Getting to 25% would mean calling non-sacrifices Legendary.
 *
 * maxDelta stays 4.9 (< INACCURACY_THRESHOLD): never Legendary AND an
 * inaccuracy. L8-10 have 6-18 games from ONE player each — too few to fit;
 * they extend the skill trend.
 */
const SITUATION = { maxWpBefore: 92, minWpAfter: 10, maxDelta: 4.9, minSac: 2, requireEngineBest: false };
const LEGENDARY_RULES_BY_LEVEL: Record<number, LegendaryRules> = {
  1: { ...SITUATION, maxCpLoss: 150 },
  2: { ...SITUATION, maxCpLoss: 135 },
  3: { ...SITUATION, maxCpLoss: 120 },
  4: { ...SITUATION, maxCpLoss: 105 },
  5: { ...SITUATION, maxCpLoss: 90 },
  6: { ...SITUATION, maxCpLoss: 80 },
  7: { ...SITUATION, maxCpLoss: 70 },
  8: { ...SITUATION, maxCpLoss: 60 },
  9: { ...SITUATION, maxCpLoss: 50 },
  10: { ...SITUATION, maxCpLoss: 40 },
};

/** Default when the level is unknown (old rows, test pages): the middle of the ladder. */
const DEFAULT_LEGENDARY_LEVEL = 3;

/** Legendary gates for a Rookie level (1-10; anything else clamps). */
export function legendaryRulesForLevel(level?: number | null): LegendaryRules {
  const l = level == null || !Number.isFinite(level)
    ? DEFAULT_LEGENDARY_LEVEL
    : Math.max(1, Math.min(10, Math.round(level)));
  return LEGENDARY_RULES_BY_LEVEL[l];
}

export interface BrilliantInput {
  fenBefore: string;
  fenAfter: string;
  san: string;
  /** Win% drop for the mover (positive = lost ground). */
  winPercentDelta: number;
  /** Win% from the mover's perspective before / after the move. */
  winPercentBefore: number;
  winPercentAfter: number;
  /** Eval before the move (white perspective) — used to skip mate-in-N positions. */
  evalBefore?: { mate: number | null };
  /** SAN of the opponent's previous move (to detect plain recaptures). */
  prevSan?: string | null;
  /** Did the mover play exactly the engine's top move? */
  playedEngineBest?: boolean;
  /** Centipawns given up vs. the engine's best (mover's view; see cpLossForMover). */
  cpLoss?: number | null;
}

/** Destination square of a SAN move (null for castling). */
function sanToSquare(san: string): string | null {
  const m = san.match(/([a-h][1-8])(?:=?[QRBN])?[+#]?$/);
  return m ? m[1] : null;
}

function materialBalance(c: Chess, color: 'w' | 'b'): number {
  const opp = color === 'w' ? 'b' : 'w';
  let sum = 0;
  for (const sq of c.board().flat()) {
    if (!sq) continue;
    sum += (sq.color === color ? 1 : sq.color === opp ? -1 : 0) * PIECE_VALUE[sq.type];
  }
  return sum;
}

/**
 * Worst-case material balance for `mover` after the side to move in `fen`
 * (the opponent) makes its best 1-ply capture of a NON-pawn mover piece, with
 * the mover's recapture credited. null = no such capture exists.
 * `skipSquare` ignores captures landing there; `onlySquare` considers only those.
 */
function worstBalanceAfterCapture(
  fen: string,
  mover: 'w' | 'b',
  skipSquare?: string,
  onlySquare?: string,
): number | null {
  let c: Chess;
  try { c = new Chess(fen); } catch { return null; }
  const balance = materialBalance(c, mover);
  let worst = Infinity;
  for (const cap of c.moves({ verbose: true })) {
    if (!cap.captured || cap.captured === 'p') continue; // pawns don't count as a sac
    if (skipSquare && cap.to === skipSquare) continue;
    if (onlySquare && cap.to !== onlySquare) continue;
    const victim = PIECE_VALUE[cap.captured];
    const attacker = PIECE_VALUE[cap.piece];
    const sim = new Chess(fen);
    sim.move(cap.san);
    const canRecapture = sim.moves({ verbose: true }).some(r => r.to === cap.to && r.captured);
    worst = Math.min(worst, balance - victim + (canRecapture ? attacker : 0));
  }
  return worst === Infinity ? null : worst;
}

/** From/to squares of the move fenBefore → fenAfter (via SAN when given). */
function movedSquares(fenBefore: string, fenAfter: string, san?: string): { from: string; to: string } | undefined {
  try {
    if (san) {
      const m = new Chess(fenBefore).move(san);
      return { from: m.from, to: m.to };
    }
    const key = (f: string) => f.split(' ').slice(0, 2).join(' ');
    const target = key(fenAfter);
    for (const m of new Chess(fenBefore).moves({ verbose: true })) {
      const t = new Chess(fenBefore);
      t.move(m.san);
      if (key(t.fen()) === target) return { from: m.from, to: m.to };
    }
  } catch { /* unparseable */ }
  return undefined;
}

/**
 * How much material THIS MOVE puts en prise (pawn units) — the sacrifice size.
 *
 *   loss after the move  = balance before − worst balance after the
 *                          opponent's best capture (recapture credited)
 *   risk already there   = the same measure on the position BEFORE the move,
 *                          as if the opponent were to move, ignoring the moved
 *                          piece itself
 *   sacrifice            = loss after − risk already there
 *
 * Subtracting the pre-existing risk is the point: a piece that was ALREADY
 * hanging and stays hanging is not a sacrifice this move made — counting it
 * was what turned every king shuffle of a beginner (whose pieces hang all
 * game) into a "Legendary" move. Moving an attacked piece onto another
 * attacked square still counts: the moved piece is excluded from the "risk
 * already there" side.
 *
 * null = nothing capturable after the move, or an unparseable position.
 */
export function sacrificeNetLoss(fenBefore: string, fenAfter: string, san?: string): number | null {
  let before: Chess;
  try { before = new Chess(fenBefore); } catch { return null; }
  const mover = before.turn();
  const balanceBefore = materialBalance(before, mover);

  // Which piece moved? Its origin square is excluded from the "already at
  // risk" scan so moving an attacked piece onto a new attacked square counts.
  const moved = movedSquares(fenBefore, fenAfter, san);

  // In check there is no null move to measure pre-existing risk against, so
  // only the piece that MOVED can be the sacrifice (an interposing piece can
  // be; a king step never is). Otherwise every check evasion with a piece
  // already hanging elsewhere read as a sac.
  if (before.inCheck()) {
    if (!moved) return null;
    const worst = worstBalanceAfterCapture(fenAfter, mover, undefined, moved.to);
    return worst === null ? null : balanceBefore - worst;
  }

  const worstAfter = worstBalanceAfterCapture(fenAfter, mover);
  if (worstAfter === null) return null;
  const lossAfter = balanceBefore - worstAfter;

  // Null move: the opponent to move in the pre-move position — what was
  // already en prise before this move was made.
  let riskBefore = 0;
  const parts = fenBefore.split(' ');
  parts[1] = mover === 'w' ? 'b' : 'w';
  parts[3] = '-';
  const worstBefore = worstBalanceAfterCapture(parts.join(' '), mover, moved?.from);
  if (worstBefore !== null) riskBefore = Math.max(0, balanceBefore - worstBefore);
  return lossAfter - riskBefore;
}

/** Did this move give up at least `minSac` of material? */
export function isSacrifice(fenBefore: string, fenAfter: string, minSac = 2): boolean {
  const loss = sacrificeNetLoss(fenBefore, fenAfter);
  return loss !== null && loss >= minSac;
}

/**
 * Centipawns the mover gave up: eval before (= the engine's best line) minus
 * eval after, from the mover's side. Mates map to mateToEquivalentCp; plain
 * scores clamp at ±2000 so a mate-in-N swing stays comparable.
 */
export function cpLossForMover(
  before: { cp: number | null; mate: number | null },
  after: { cp: number | null; mate: number | null },
  moverColor: 'white' | 'black',
): number | null {
  const cpOf = (e: { cp: number | null; mate: number | null }) =>
    e.mate !== null ? mateToEquivalentCp(e.mate) : e.cp !== null ? Math.max(-2000, Math.min(2000, e.cp)) : null;
  const b = cpOf(before);
  const a = cpOf(after);
  if (b === null || a === null) return null;
  return (moverColor === 'white' ? 1 : -1) * (b - a);
}

/** Everything the Legendary gates test, as raw numbers (cached by the calibration script). */
export interface LegendaryFacts {
  delta: number;
  wpBefore: number;
  wpAfter: number;
  /** sacrificeNetLoss — null when nothing is capturable. */
  sac: number | null;
  playedEngineBest: boolean;
  /** Centipawns given up vs. best, mover's view. null = unknown. */
  cpLoss: number | null;
  /** Only one legal move. */
  forced: boolean;
  /** Plain recapture on the square the opponent just took on. */
  recapture: boolean;
  /** The mover already had a forced mate before the move. */
  mateForMover: boolean;
}

export function legendaryFacts(input: BrilliantInput): LegendaryFacts | null {
  const { fenBefore, fenAfter, san, winPercentDelta, winPercentBefore, winPercentAfter, evalBefore, prevSan } = input;
  let chess: Chess;
  try { chess = new Chess(fenBefore); } catch { return null; }
  const moverIsWhite = chess.turn() === 'w';
  return {
    delta: winPercentDelta,
    wpBefore: winPercentBefore,
    wpAfter: winPercentAfter,
    sac: sacrificeNetLoss(fenBefore, fenAfter, san),
    playedEngineBest: !!input.playedEngineBest,
    cpLoss: input.cpLoss ?? null,
    forced: chess.moves().length <= 1,
    recapture: !!prevSan && prevSan.includes('x') && san.includes('x') &&
      sanToSquare(prevSan) !== null && sanToSquare(prevSan) === sanToSquare(san),
    mateForMover: evalBefore?.mate != null && (evalBefore.mate > 0) === moverIsWhite,
  };
}

/** The gates themselves — pure arithmetic on LegendaryFacts. */
export function passesLegendary(f: LegendaryFacts, rules: LegendaryRules): boolean {
  // 1. Best or near-best — and never as bad as an inaccuracy.
  if (f.delta > rules.maxDelta || f.delta >= INACCURACY_THRESHOLD) return false;
  if (rules.requireEngineBest && !f.playedEngineBest) return false;
  if (f.cpLoss !== null && f.cpLoss > rules.maxCpLoss) return false;
  // 2. The position was still a fight (not already won, not a forced mate).
  if (f.wpBefore >= rules.maxWpBefore) return false;
  if (f.mateForMover) return false;
  // 3. The sacrifice still leaves you okay.
  if (f.wpAfter < rules.minWpAfter) return false;
  // 4. A real choice, not a forced or automatic move.
  if (f.forced || f.recapture) return false;
  // 5. It gives up material.
  return f.sac !== null && f.sac >= rules.minSac;
}

/**
 * chess.com-style "brilliant" (shown as Legendary): a best-or-near-best move
 * that sacrifices material, from a position that wasn't already won, that
 * still leaves the mover okay, and that wasn't forced. Pure — no engine calls.
 * Book moves are excluded by the book pass (lib/review/book-moves), which runs
 * on every graded game.
 */
export function isBrilliant(input: BrilliantInput, rules: LegendaryRules = legendaryRulesForLevel()): boolean {
  const facts = legendaryFacts(input);
  return !!facts && passesLegendary(facts, rules);
}

// ════════════════════════════════
// FULL GAME ANALYSIS
// ════════════════════════════════

/**
 * Analyze an array of position evals into classified, scored moves.
 *
 * @param positionEvals - eval for every position (N+1 for N moves: start + after each move)
 * @param moves - move info (san, movedBy) for each move; pass fenAfter to
 *   enable brilliant-move detection (fenBefore = previous fenAfter / startFen)
 * @param playerColor - which color the player was
 * @param startFen - starting position (default: standard start)
 * @param options.playerLevel - Rookie level the game was played at (1-10);
 *   scales the Legendary gates (legendaryRulesForLevel). Unknown → default.
 */
export function analyzeGameMoves(
  positionEvals: (PositionEval | null)[],
  moves: { san: string; movedBy: 'player' | 'rookie'; moveNumber: number; fenAfter?: string; fenBefore?: string }[],
  playerColor: 'white' | 'black',
  startFen: string = START_FEN,
  options: { playerLevel?: number | null } = {},
): GameAnalysis {
  const legendaryRules = legendaryRulesForLevel(options.playerLevel);
  const evaluatedMoves: MoveEvaluation[] = [];
  // Win% the previous move (the opponent's) gave away — fuels the "!" gate.
  let prevMoveDelta: number | null = null;
  // Parity must respect the starting position — a game (or stored fragment)
  // where black moves first would otherwise grade every move as its opponent's.
  const firstMover: 'white' | 'black' = (startFen.split(' ')[1] || 'w') === 'b' ? 'black' : 'white';
  const NO_EVAL: PositionEval = { cp: null, mate: null, bestMove: null, bestLine: [], depth: 0 };

  for (let i = 0; i < moves.length; i++) {
    const evalBefore = positionEvals[i];
    const evalAfter = positionEvals[i + 1];
    const move = moves[i];
    const fenBefore = move.fenBefore ?? (i > 0 ? moves[i - 1].fenAfter : startFen);

    // Determine mover's color
    const moverColor: 'white' | 'black' =
      i % 2 === 0 ? firstMover : firstMover === 'white' ? 'black' : 'white';

    // The mating move ends the game — no eval needed, and the terminal
    // position can't be scored anyway.
    if (move.san.endsWith('#')) {
      evaluatedMoves.push({
        moveNumber: move.moveNumber,
        san: move.san,
        movedBy: move.movedBy,
        evalBefore: evalBefore ?? NO_EVAL,
        evalAfter: evalAfter ?? NO_EVAL,
        winPercentBefore: 100,
        winPercentAfter: 100,
        winPercentDelta: 0,
        classification: 'checkmate',
        accuracy: 100,
        bestMoveSan: move.san,
      });
      prevMoveDelta = null;
      continue;
    }

    // No trustworthy eval on either side of the move → the move is
    // UNGRADABLE. Never fall back to "assume equal" — that graded every
    // move around an engine failure as "good". Emit a placeholder so
    // downstream index-aligned consumers (badges, key moments, coach) stay
    // in sync; they skip 'unknown'.
    if (!hasUsableEval(evalBefore) || !hasUsableEval(evalAfter)) {
      evaluatedMoves.push({
        moveNumber: move.moveNumber,
        san: move.san,
        movedBy: move.movedBy,
        evalBefore: evalBefore ?? NO_EVAL,
        evalAfter: evalAfter ?? NO_EVAL,
        winPercentBefore: 50,
        winPercentAfter: 50,
        winPercentDelta: 0,
        classification: 'unknown',
        accuracy: 0, // excluded from accuracy math below
        bestMoveSan: null,
      });
      prevMoveDelta = null;
      continue;
    }

    // Win% from mover's perspective
    const wpBefore = winPercentForColor(
      evalToWinPercent(evalBefore.cp, evalBefore.mate),
      moverColor,
    );
    const wpAfter = winPercentForColor(
      evalToWinPercent(evalAfter.cp, evalAfter.mate),
      moverColor,
    );

    const delta = wpBefore - wpAfter; // positive = lost ground

    // Compare the played move against the engine's actual best move from the
    // position before it (captured by the same eval search — Lichess shows
    // "X was best" the same way). Falls back to the delta heuristic when the
    // engine line is missing or unparsable.
    let bestMoveSan: string | null = null;
    let playedEngineBest = false;
    if (fenBefore && evalBefore.bestMove) {
      try {
        const board = new Chess(fenBefore);
        const played = board.move(move.san);
        const playedUci = played.from + played.to + (played.promotion ?? '');
        playedEngineBest = playedUci === evalBefore.bestMove;
        if (playedEngineBest) {
          bestMoveSan = played.san;
        } else {
          const bm = evalBefore.bestMove;
          const alt = new Chess(fenBefore).move({
            from: bm.slice(0, 2),
            to: bm.slice(2, 4),
            promotion: bm.length > 4 ? bm.slice(4, 5) : undefined,
          });
          bestMoveSan = alt.san;
        }
      } catch {
        // illegal/garbled move data — leave nulls, grade on delta alone
      }
    }
    const effectivelyBest = playedEngineBest || delta <= GREAT_MOVE_THRESHOLD;

    // "!" only when this best move cashes in an opponent error, from a
    // position that wasn't already decided.
    const punishedError =
      prevMoveDelta !== null &&
      prevMoveDelta >= GREAT_PUNISH_MIN &&
      wpBefore < GREAT_MAX_WP_BEFORE;

    let classification = classifyMove(delta, effectivelyBest, undefined, punishedError);
    const accuracy = moveAccuracy(wpBefore, wpAfter);

    // Brilliant: needs board state AND a trustworthy eval (guaranteed above).
    if (move.fenAfter && fenBefore && classification !== 'forced') {
      const brilliant = isBrilliant({
        fenBefore,
        fenAfter: move.fenAfter,
        san: move.san,
        winPercentDelta: delta,
        winPercentBefore: wpBefore,
        winPercentAfter: wpAfter,
        evalBefore: { mate: evalBefore.mate },
        prevSan: i > 0 ? moves[i - 1].san : null,
        playedEngineBest,
        cpLoss: cpLossForMover(evalBefore, evalAfter, moverColor),
      }, legendaryRules);
      if (brilliant) classification = 'brilliant';
    }

    evaluatedMoves.push({
      moveNumber: move.moveNumber,
      san: move.san,
      movedBy: move.movedBy,
      evalBefore,
      evalAfter,
      winPercentBefore: wpBefore,
      winPercentAfter: wpAfter,
      winPercentDelta: delta,
      classification,
      accuracy,
      bestMoveSan,
    });
    prevMoveDelta = delta;
  }

  // Separate player and rookie moves for game accuracy — ungradable moves
  // carry no information and must not drag the accuracy average.
  const gradable = evaluatedMoves.filter(m => m.classification !== 'unknown');
  const playerEvals = gradable.filter(m => m.movedBy === 'player');
  const rookieEvals = gradable.filter(m => m.movedBy === 'rookie');

  const playerAccuracies = playerEvals.map(m => m.accuracy);
  const rookieAccuracies = rookieEvals.map(m => m.accuracy);

  const playerWinPercents = playerEvals.map(m => m.winPercentBefore);
  const rookieWinPercents = rookieEvals.map(m => m.winPercentBefore);

  return {
    moves: evaluatedMoves,
    playerAccuracy: gameAccuracy(playerAccuracies, playerWinPercents),
    rookieAccuracy: gameAccuracy(rookieAccuracies, rookieWinPercents),
    playerMoveCount: playerEvals.length,
    blunders: playerEvals.filter(m => m.classification === 'blunder').length,
    mistakes: playerEvals.filter(m => m.classification === 'mistake').length,
    inaccuracies: playerEvals.filter(m => m.classification === 'inaccuracy').length,
    brilliantMoves: playerEvals.filter(m => m.classification === 'brilliant').length,
    greatMoves: playerEvals.filter(m => m.classification === 'great').length,
  };
}
