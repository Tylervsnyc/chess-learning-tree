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

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export type MoveClassification =
  | 'brilliant'    // best move in a sharp position (dopamine reward)
  | 'great'        // engine's top move
  | 'good'         // small or no win% loss
  | 'inaccuracy'   // >= 10% win% drop
  | 'mistake'      // >= 20% win% drop
  | 'blunder'      // >= 30% win% drop
  | 'book'         // opening book move
  | 'forced';      // only reasonable move

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
  return 0; // no eval = assume equal
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

// Win% drop thresholds (from Lichess Advice.scala)
const BLUNDER_THRESHOLD = 30;
const MISTAKE_THRESHOLD = 20;
const INACCURACY_THRESHOLD = 10;
const GREAT_MOVE_THRESHOLD = 2; // within 2% of engine's best

/**
 * Classify a move based on win% delta.
 * @param winPercentDelta - drop in win% (positive = lost ground)
 * @param wasBestMove - did they play the engine's #1 choice?
 * @param alternativeCount - how many reasonable alternatives exist?
 */
export function classifyMove(
  winPercentDelta: number,
  wasBestMove: boolean,
  alternativeCount?: number,
): MoveClassification {
  // Gained or maintained position
  if (winPercentDelta <= 0) {
    if (wasBestMove && alternativeCount !== undefined && alternativeCount <= 1) {
      return 'forced';
    }
    if (wasBestMove) return 'great';
    return 'good';
  }

  // Lost ground
  if (winPercentDelta >= BLUNDER_THRESHOLD) return 'blunder';
  if (winPercentDelta >= MISTAKE_THRESHOLD) return 'mistake';
  if (winPercentDelta >= INACCURACY_THRESHOLD) return 'inaccuracy';

  if (winPercentDelta <= GREAT_MOVE_THRESHOLD && wasBestMove) return 'great';

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
// FULL GAME ANALYSIS
// ════════════════════════════════

/**
 * Analyze an array of position evals into classified, scored moves.
 *
 * @param positionEvals - eval for every position (N+1 for N moves: start + after each move)
 * @param moves - move info (san, movedBy) for each move
 * @param playerColor - which color the player was
 */
export function analyzeGameMoves(
  positionEvals: PositionEval[],
  moves: { san: string; movedBy: 'player' | 'rookie'; moveNumber: number }[],
  playerColor: 'white' | 'black',
): GameAnalysis {
  const evaluatedMoves: MoveEvaluation[] = [];

  for (let i = 0; i < moves.length; i++) {
    const evalBefore = positionEvals[i];
    const evalAfter = positionEvals[i + 1];
    if (!evalBefore || !evalAfter) continue;

    const move = moves[i];

    // Determine mover's color
    const moverColor: 'white' | 'black' = i % 2 === 0 ? 'white' : 'black';

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
    const wasBestMove = evalBefore.bestMove !== null &&
      move.san !== null; // We can't easily compare SAN to UCI here — use delta instead
    const effectivelyBest = delta <= GREAT_MOVE_THRESHOLD;

    const classification = classifyMove(delta, effectivelyBest);
    const accuracy = moveAccuracy(wpBefore, wpAfter);

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
      bestMoveSan: null, // filled by post-game analysis with deeper search
    });
  }

  // Separate player and rookie moves for game accuracy
  const playerEvals = evaluatedMoves.filter(m => m.movedBy === 'player');
  const rookieEvals = evaluatedMoves.filter(m => m.movedBy === 'rookie');

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
