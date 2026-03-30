/**
 * Layer 2: Chess Intelligence Agent
 *
 * Processes every chess move and produces a structured "briefing" in plain English.
 * The LLM never interprets chess itself — it only reads this briefing.
 *
 * Sub-Components:
 *   A. Opening Tracker     — Lichess Explorer API for book status
 *   B. Position Translator — Stockfish eval → plain English
 *   C. Turning Point Detector — eval deltas, book departures, phase transitions
 *   D. Player Pattern Tracker — move speed, castling, piece affinity, style
 *
 * @see CHE-185 https://linear.app/chesspathapp/issue/CHE-185
 */

import type { ChessBriefing, GameEvent, RookieMood } from './types';
import { evalToRookieMood, type EvalMoodResult } from '@/lib/rookie-mood-eval';
import { evalToWinPercent, winPercentForColor } from '@/lib/game-eval';

// ════════════════════════════════
// SUB-COMPONENT A: OPENING TRACKER
// ════════════════════════════════

export interface OpeningTrackerResult {
  /** Opening name from Lichess (e.g., "Sicilian Defense: Najdorf Variation") */
  opening: string | null;
  /** ECO code (e.g., "B90") */
  eco: string | null;
  /** Book status based on master game count */
  bookStatus: 'in_book' | 'sideline' | 'out_of_book';
  /** Number of master games reaching this position */
  masterGames: number;
  /** Move number where player left book (null if still in book) */
  leftBookAt: number | null;
}

// Thresholds from CHE-185 spec
const BOOK_THRESHOLD = 100;    // 100+ master games = definitely book
const SIDELINE_THRESHOLD = 10; // 10-100 = known but uncommon

/** Cache Lichess responses to avoid redundant API calls within a game */
const lichessCache = new Map<string, { opening: string | null; eco: string | null; totalGames: number }>();

/**
 * Query the Lichess Masters Opening Explorer for a position.
 * Returns opening name, ECO code, and total master games.
 * Fails gracefully — returns null opening on error.
 */
async function queryLichessExplorer(
  fen: string,
): Promise<{ opening: string | null; eco: string | null; totalGames: number }> {
  const cached = lichessCache.get(fen);
  if (cached) return cached;

  try {
    const encoded = encodeURIComponent(fen);
    const response = await fetch(
      `https://explorer.lichess.ovh/masters?fen=${encoded}&topGames=0&recentGames=0`,
      { signal: AbortSignal.timeout(3000) },
    );

    if (!response.ok) {
      const fallback = { opening: null, eco: null, totalGames: 0 };
      lichessCache.set(fen, fallback);
      return fallback;
    }

    const data = await response.json();
    const totalGames = (data.white ?? 0) + (data.draws ?? 0) + (data.black ?? 0);
    const opening = data.opening?.name ?? null;
    const eco = data.opening?.eco ?? null;

    const result = { opening, eco, totalGames };
    lichessCache.set(fen, result);
    return result;
  } catch {
    // Network error, timeout, etc. — degrade gracefully
    const fallback = { opening: null, eco: null, totalGames: 0 };
    lichessCache.set(fen, fallback);
    return fallback;
  }
}

// ════════════════════════════════
// SUB-COMPONENT B: POSITION TRANSLATOR
// ════════════════════════════════

export interface PositionTranslation {
  /** Plain-English position summary for the LLM */
  summary: string;
  /** Tone guidance for how Rookie should feel about this */
  toneGuidance: string;
  /** Win% from Rookie's perspective */
  rookieWinPercent: number;
}

/**
 * Convert Stockfish eval to plain English. The LLM never sees "+1.3".
 *
 * Uses centipawns (converted to pawns for thresholds) and perspective
 * to produce a sentence the LLM can work with.
 */
export function translatePosition(
  cp: number | null,
  mate: number | null,
  rookieColor: 'white' | 'black',
  prevSummary?: string,
): PositionTranslation {
  const whiteWp = evalToWinPercent(cp, mate);
  const rookieWp = winPercentForColor(whiteWp, rookieColor);

  // Mate scenarios
  if (mate !== null) {
    const absMate = Math.abs(mate);
    const whiteMating = mate > 0;
    const rookieMating =
      (whiteMating && rookieColor === 'white') ||
      (!whiteMating && rookieColor === 'black');

    if (rookieMating) {
      return {
        summary: `Rookie has checkmate in ${absMate}.`,
        toneGuidance: absMate <= 2 ? 'Triumphant, barely containing excitement' : 'Confident, seeing the finish line',
        rookieWinPercent: rookieWp,
      };
    } else {
      return {
        summary: `Player has checkmate in ${absMate}.`,
        toneGuidance: absMate <= 2 ? 'Accepting defeat, maybe impressed' : 'Worried, searching for escape',
        rookieWinPercent: rookieWp,
      };
    }
  }

  // Convert cp to pawns for human-readable thresholds
  const cpVal = cp ?? 0;
  const pawns = cpVal / 100;
  const absPawns = Math.abs(pawns);
  const whiteAhead = pawns > 0;
  const rookieAhead =
    (whiteAhead && rookieColor === 'white') ||
    (!whiteAhead && rookieColor === 'black');

  if (absPawns <= 0.3) {
    return {
      summary: 'Dead equal. Neither side has an edge.',
      toneGuidance: 'Neutral, observational',
      rookieWinPercent: rookieWp,
    };
  }

  if (absPawns <= 1.0) {
    const who = rookieAhead ? 'Rookie' : 'Player';
    return {
      summary: `${who} has a slight edge — small imbalance but nothing decisive.`,
      toneGuidance: rookieAhead
        ? 'Noting the imbalance, quietly pleased'
        : 'Noting the imbalance, slightly concerned',
      rookieWinPercent: rookieWp,
    };
  }

  if (absPawns <= 2.0) {
    const who = rookieAhead ? 'Rookie' : 'Player';
    return {
      summary: `${who} has a clear advantage. The position is tilting.`,
      toneGuidance: rookieAhead
        ? 'Acknowledge the shift, confident'
        : 'Acknowledge the shift, concerned',
      rookieWinPercent: rookieWp,
    };
  }

  if (absPawns <= 5.0) {
    if (rookieAhead) {
      return {
        summary: 'Rookie is winning. Significant material or positional advantage.',
        toneGuidance: 'Serious but excited — the advantage is real',
        rookieWinPercent: rookieWp,
      };
    } else {
      return {
        summary: 'Player is winning. Rookie is in serious trouble.',
        toneGuidance: 'Empathetic if player is winning. Serious, acknowledging the gap.',
        rookieWinPercent: rookieWp,
      };
    }
  }

  // 5.0+
  if (rookieAhead) {
    return {
      summary: 'Completely won for Rookie. Player would need a miracle.',
      toneGuidance: 'Gentle, no need to rub it in — celebratory if player resigned',
      rookieWinPercent: rookieWp,
    };
  } else {
    return {
      summary: 'Completely lost for Rookie. This is over unless something wild happens.',
      toneGuidance: 'Graceful in defeat, maybe impressed by the player',
      rookieWinPercent: rookieWp,
    };
  }
}

// ════════════════════════════════
// SUB-COMPONENT C: TURNING POINT DETECTOR
// ════════════════════════════════

export type ResponseType = 'full_llm_call' | 'authored_quip' | 'silence';

export interface TurningPointResult {
  /** Is this move a turning point? */
  isTurningPoint: boolean;
  /** Why (plain English, for the briefing) */
  reason: string | null;
  /** What response type this move warrants */
  responseType: ResponseType;
}

// Eval swing thresholds (in win% points)
const BLUNDER_SWING = 15;    // 15% win% change = blunder/brilliant
const QUIET_THRESHOLD = 3;   // Under 3% change = quiet move

/**
 * Determine if a move is a turning point and what response it warrants.
 */
export function detectTurningPoint(input: {
  /** Win% delta (positive = Rookie's position improved) */
  rookieWpDelta: number;
  /** Who just moved */
  movedBy: 'player' | 'rookie';
  /** Did the player just leave book? */
  justLeftBook: boolean;
  /** Phase transition detected? */
  phaseChanged: boolean;
  /** Previous phase */
  prevPhase: 'opening' | 'middlegame' | 'endgame';
  /** New phase */
  newPhase: 'opening' | 'middlegame' | 'endgame';
  /** Current book status */
  bookStatus: 'in_book' | 'sideline' | 'out_of_book';
  /** Move number */
  moveNumber: number;
  /** Is material imbalanced without recent recapture? */
  isSacrifice: boolean;
}): TurningPointResult {
  const { rookieWpDelta, movedBy, justLeftBook, phaseChanged, prevPhase, newPhase, bookStatus, moveNumber, isSacrifice } = input;

  const absDelta = Math.abs(rookieWpDelta);

  // FULL LLM CALL triggers
  // 1. Big eval swing (blunder or brilliant)
  if (absDelta >= BLUNDER_SWING) {
    const isBlunder = (movedBy === 'player' && rookieWpDelta > 0) ||
                      (movedBy === 'rookie' && rookieWpDelta < 0);
    const moverName = movedBy === 'player' ? 'Player' : 'Rookie';
    if (isBlunder) {
      return {
        isTurningPoint: true,
        reason: `${moverName} blundered — ${Math.round(absDelta)}% swing.`,
        responseType: 'full_llm_call',
      };
    } else {
      return {
        isTurningPoint: true,
        reason: `${moverName} played a brilliant move — ${Math.round(absDelta)}% swing.`,
        responseType: 'full_llm_call',
      };
    }
  }

  // 2. Player leaves book
  if (justLeftBook) {
    return {
      isTurningPoint: true,
      reason: 'Player left opening book — on their own now.',
      responseType: 'full_llm_call',
    };
  }

  // 3. Phase transition
  if (phaseChanged) {
    return {
      isTurningPoint: true,
      reason: `Game transitioned from ${prevPhase} to ${newPhase}.`,
      responseType: 'full_llm_call',
    };
  }

  // 4. Piece sacrifice (material imbalance, no recapture)
  if (isSacrifice && moveNumber > 4) {
    return {
      isTurningPoint: true,
      reason: 'Piece sacrifice — material given up without immediate recapture.',
      responseType: 'full_llm_call',
    };
  }

  // AUTHORED QUIP — book move or mild events
  if (bookStatus === 'in_book') {
    return {
      isTurningPoint: false,
      reason: null,
      responseType: 'authored_quip',
    };
  }

  // QUIET MOVE — small eval change, nothing notable
  if (absDelta < QUIET_THRESHOLD) {
    return {
      isTurningPoint: false,
      reason: null,
      responseType: 'silence',
    };
  }

  // Middle ground — noticeable but not dramatic
  return {
    isTurningPoint: false,
    reason: null,
    responseType: 'authored_quip',
  };
}

// ════════════════════════════════
// SUB-COMPONENT D: PLAYER PATTERN TRACKER
// ════════════════════════════════

export interface PlayerPatterns {
  /** Average move time in seconds */
  avgMoveTime: number;
  /** Trend: speeding up, slowing, or steady */
  speedTrend: 'speeding_up' | 'slowing' | 'steady';
  /** Has the player castled, and which side? */
  castled: 'kingside' | 'queenside' | 'not_yet' | 'never_castled';
  /** Move number when they castled (null if not yet) */
  castledAt: number | null;
  /** Most-moved piece type this game */
  favoritePiece: string | null;
  /** Style indicators based on behavior */
  style: 'aggressive' | 'solid' | 'tactical' | 'unknown';
  /** Consecutive captures by this player */
  captureStreak: number;
  /** Total pieces traded away (from starting 16 each) */
  piecesTraded: number;
}

interface MoveTimeEntry {
  moveNumber: number;
  timeSeconds: number;
}

interface PieceMoveCount {
  [piece: string]: number;
}

/** Mutable state accumulated across a game for the pattern tracker */
export interface PatternTrackerState {
  moveTimes: MoveTimeEntry[];
  pieceMoves: PieceMoveCount;
  castled: 'kingside' | 'queenside' | 'not_yet';
  castledAt: number | null;
  captures: number;
  totalPlayerMoves: number;
  consecutiveCaptures: number;
  earlyQueenMoves: number; // queen moves before move 10
}

export function createPatternTrackerState(): PatternTrackerState {
  return {
    moveTimes: [],
    pieceMoves: {},
    castled: 'not_yet',
    castledAt: null,
    captures: 0,
    totalPlayerMoves: 0,
    consecutiveCaptures: 0,
    earlyQueenMoves: 0,
  };
}

/**
 * Update pattern tracker state with a new player move.
 * Call this only for the PLAYER's moves (not Rookie's).
 */
export function updatePatternTracker(
  state: PatternTrackerState,
  input: {
    moveNumber: number;
    san: string;
    moveTimeSeconds: number | null;
    piece: string | null; // 'p', 'n', 'b', 'r', 'q', 'k'
    isCapture: boolean;
    piecesRemaining: number;
  },
): PatternTrackerState {
  const next = { ...state };
  next.totalPlayerMoves++;

  // Track move time
  if (input.moveTimeSeconds !== null) {
    next.moveTimes = [...state.moveTimes, { moveNumber: input.moveNumber, timeSeconds: input.moveTimeSeconds }];
  }

  // Track piece moves
  if (input.piece) {
    next.pieceMoves = { ...state.pieceMoves };
    next.pieceMoves[input.piece] = (next.pieceMoves[input.piece] ?? 0) + 1;
  }

  // Track castling
  if (input.san === 'O-O' || input.san === 'O-O-O') {
    next.castled = input.san === 'O-O' ? 'kingside' : 'queenside';
    next.castledAt = input.moveNumber;
  }

  // Track captures
  if (input.isCapture) {
    next.captures++;
    next.consecutiveCaptures = state.consecutiveCaptures + 1;
  } else {
    next.consecutiveCaptures = 0;
  }

  // Track early queen moves
  if (input.piece === 'q' && input.moveNumber <= 10) {
    next.earlyQueenMoves = state.earlyQueenMoves + 1;
  }

  return next;
}

/** Compute player patterns from accumulated state */
export function computePatterns(state: PatternTrackerState, isGameOver: boolean, piecesRemaining: number = 32): PlayerPatterns {
  // Average move time
  const times = state.moveTimes;
  const avgMoveTime = times.length > 0
    ? times.reduce((sum, t) => sum + t.timeSeconds, 0) / times.length
    : 0;

  // Speed trend: compare first half to second half
  let speedTrend: 'speeding_up' | 'slowing' | 'steady' = 'steady';
  if (times.length >= 6) {
    const mid = Math.floor(times.length / 2);
    const firstHalf = times.slice(0, mid);
    const secondHalf = times.slice(mid);
    const firstAvg = firstHalf.reduce((s, t) => s + t.timeSeconds, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((s, t) => s + t.timeSeconds, 0) / secondHalf.length;
    const ratio = secondAvg / firstAvg;
    if (ratio > 1.3) speedTrend = 'slowing';
    else if (ratio < 0.7) speedTrend = 'speeding_up';
  }

  // Castling
  const castled = isGameOver && state.castled === 'not_yet' ? 'never_castled' : state.castled;

  // Favorite piece (most-moved, excluding pawns and king)
  let favoritePiece: string | null = null;
  let maxMoves = 0;
  for (const [piece, count] of Object.entries(state.pieceMoves)) {
    if (piece === 'p' || piece === 'k') continue; // ignore pawns and king
    if (count > maxMoves) {
      maxMoves = count;
      favoritePiece = piece;
    }
  }

  // Style detection
  let style: 'aggressive' | 'solid' | 'tactical' | 'unknown' = 'unknown';
  if (state.totalPlayerMoves >= 5) {
    const captureRate = state.captures / state.totalPlayerMoves;
    if (captureRate > 0.35 || state.earlyQueenMoves >= 2) {
      style = 'aggressive';
    } else if (state.consecutiveCaptures >= 3) {
      style = 'tactical';
    } else if (captureRate < 0.15 && state.castled !== 'not_yet') {
      style = 'solid';
    }
  }

  const pieceNames: Record<string, string> = { n: 'knight', b: 'bishop', r: 'rook', q: 'queen' };

  return {
    avgMoveTime: Math.round(avgMoveTime * 10) / 10,
    speedTrend,
    castled,
    castledAt: state.castledAt,
    favoritePiece: favoritePiece ? pieceNames[favoritePiece] ?? favoritePiece : null,
    style,
    captureStreak: state.consecutiveCaptures,
    piecesTraded: 32 - piecesRemaining,
  };
}

// ════════════════════════════════
// GAME PHASE DETECTION
// ════════════════════════════════

/**
 * Detect game phase based on move number and pieces remaining.
 * Simple but effective — matches beat-sheet thresholds.
 */
export function detectPhase(
  moveNumber: number,
  piecesRemaining: number,
): 'opening' | 'middlegame' | 'endgame' {
  // Endgame: few pieces left (queens traded or very late)
  if (piecesRemaining <= 12) return 'endgame';
  // Opening: first ~8 moves with most pieces still on board
  if (moveNumber <= 8 && piecesRemaining >= 28) return 'opening';
  // Late middlegame transitions to endgame around move 30+ with fewer pieces
  if (moveNumber >= 30 && piecesRemaining <= 16) return 'endgame';
  return 'middlegame';
}

// ════════════════════════════════
// CHESS INTELLIGENCE AGENT
// ════════════════════════════════

/** Input for processing a single move */
export interface MoveInput {
  /** FEN after the move was played */
  fen: string;
  /** SAN notation of the move */
  san: string;
  /** Full move number (1, 2, 3...) */
  moveNumber: number;
  /** Who played this move */
  movedBy: 'player' | 'rookie';
  /** Stockfish centipawns (positive = white advantage) */
  cp: number | null;
  /** Stockfish mate in N (positive = white mates) */
  mate: number | null;
  /** Which color Rookie is playing */
  rookieColor: 'white' | 'black';
  /** Player's display name */
  playerName: string;
  /** Time taken for this move in seconds (null if not tracked) */
  moveTimeSeconds: number | null;
  /** Piece that moved (lowercase: p, n, b, r, q, k) */
  piece: string | null;
  /** Is this move a capture? */
  isCapture: boolean;
  /** Total pieces remaining on the board */
  piecesRemaining: number;
  /** Is this a check? */
  isCheck: boolean;
  /** Is this checkmate? */
  isCheckmate: boolean;
  /** Is this stalemate? */
  isStalemate: boolean;
  /** Is this a castling move? */
  isCastle: boolean;
  /** Is this a promotion? */
  isPromotion: boolean;
}

/** Persistent state for the intelligence agent across a game */
export interface IntelligenceState {
  /** Previous Rookie win% for swing detection */
  prevRookieWp: number;
  /** Previous mood */
  prevMood: RookieMood;
  /** Previous phase */
  prevPhase: 'opening' | 'middlegame' | 'endgame';
  /** Opening tracker — was the game in book last move? */
  wasInBook: boolean;
  /** Opening name once detected */
  openingName: string | null;
  /** ECO code once detected */
  eco: string | null;
  /** Move where player left book */
  leftBookAt: number | null;
  /** Player pattern tracker state */
  patterns: PatternTrackerState;
  /** Total moves processed */
  totalMoves: number;
  /** Material balance tracking: last known material count */
  prevPiecesRemaining: number;
  /** Was the last move a capture (for sacrifice detection) */
  prevMoveWasCapture: boolean;
}

/** Create initial intelligence state at game start */
export function createIntelligenceState(): IntelligenceState {
  return {
    prevRookieWp: 50,
    prevMood: 'neutral',
    prevPhase: 'opening',
    wasInBook: true, // assume we start in book
    openingName: null,
    eco: null,
    leftBookAt: null,
    patterns: createPatternTrackerState(),
    totalMoves: 0,
    prevPiecesRemaining: 32,
    prevMoveWasCapture: false,
  };
}

/** The full output of processing one move */
export interface IntelligenceResult {
  /** The assembled Chess Briefing for the LLM */
  briefing: ChessBriefing;
  /** Opening tracker details */
  openingTracker: OpeningTrackerResult;
  /** Position translation */
  position: PositionTranslation;
  /** Turning point detection */
  turningPoint: TurningPointResult;
  /** Player patterns (only updated on player moves) */
  playerPatterns: PlayerPatterns;
  /** Mood result from eval */
  moodResult: EvalMoodResult;
  /** Updated state to pass to next call */
  nextState: IntelligenceState;
}

/**
 * Process a single move through all 4 sub-components and assemble the Chess Briefing.
 *
 * Call this after every move (both player and Rookie moves).
 * Returns the briefing + updated state to carry forward.
 */
export async function processMove(
  input: MoveInput,
  state: IntelligenceState,
): Promise<IntelligenceResult> {
  // ── Sub-Component A: Opening Tracker ──
  const lichess = await queryLichessExplorer(input.fen);
  const masterGames = lichess.totalGames;

  let bookStatus: OpeningTrackerResult['bookStatus'];
  if (masterGames >= BOOK_THRESHOLD) bookStatus = 'in_book';
  else if (masterGames >= SIDELINE_THRESHOLD) bookStatus = 'sideline';
  else bookStatus = 'out_of_book';

  // Track when player leaves book
  const justLeftBook = state.wasInBook && bookStatus === 'out_of_book';
  const leftBookAt = justLeftBook ? input.moveNumber : state.leftBookAt;
  const openingName = lichess.opening ?? state.openingName;
  const eco = lichess.eco ?? state.eco;

  const openingTracker: OpeningTrackerResult = {
    opening: openingName,
    eco,
    bookStatus,
    masterGames,
    leftBookAt,
  };

  // ── Sub-Component B: Position Translator ──
  const position = translatePosition(input.cp, input.mate, input.rookieColor);

  // ── Mood (cross-cutting) ──
  const moodResult = evalToRookieMood(input.cp, input.mate, input.rookieColor, state.prevRookieWp);

  // ── Sub-Component C: Turning Point Detector ──
  const phase = detectPhase(input.moveNumber, input.piecesRemaining);
  const phaseChanged = phase !== state.prevPhase;

  // Sacrifice detection: material dropped but not a recapture
  const materialLost = state.prevPiecesRemaining - input.piecesRemaining;
  const isSacrifice = input.movedBy === 'player' &&
    !input.isCapture &&
    state.prevMoveWasCapture &&
    materialLost > 0;

  const turningPoint = detectTurningPoint({
    rookieWpDelta: position.rookieWinPercent - state.prevRookieWp,
    movedBy: input.movedBy,
    justLeftBook,
    phaseChanged,
    prevPhase: state.prevPhase,
    newPhase: phase,
    bookStatus,
    moveNumber: input.moveNumber,
    isSacrifice,
  });

  // ── Sub-Component D: Player Pattern Tracker ──
  let patterns = state.patterns;
  if (input.movedBy === 'player') {
    patterns = updatePatternTracker(patterns, {
      moveNumber: input.moveNumber,
      san: input.san,
      moveTimeSeconds: input.moveTimeSeconds,
      piece: input.piece,
      isCapture: input.isCapture,
      piecesRemaining: input.piecesRemaining,
    });
  }
  const playerPatterns = computePatterns(patterns, input.isCheckmate || input.isStalemate, input.piecesRemaining);

  // ── Detect game events ──
  const events: GameEvent[] = [];
  if (input.isCapture) events.push('capture');
  if (input.isCheck) events.push('check');
  if (input.isCheckmate) events.push('checkmate');
  if (input.isCastle) events.push('castle');
  if (input.isStalemate) events.push('stalemate');
  if (input.isPromotion) events.push('promotion');
  if (moodResult.mood !== state.prevMood) events.push('mood_change');

  // Classify blunder/great move from eval swing
  const absDelta = Math.abs(position.rookieWinPercent - state.prevRookieWp);
  if (absDelta >= BLUNDER_SWING) {
    const moverLost = (input.movedBy === 'player' && position.rookieWinPercent > state.prevRookieWp) ||
                      (input.movedBy === 'rookie' && position.rookieWinPercent < state.prevRookieWp);
    if (moverLost) events.push('blunder');
    else events.push('great_move');
  }

  // ── Assemble Chess Briefing ──
  // Build the position summary with context
  let positionSummary = position.summary;

  // Add "what happened" context for turning points
  if (turningPoint.isTurningPoint && turningPoint.reason) {
    positionSummary += ` ${turningPoint.reason}`;
  }

  // Add player pattern context if interesting
  if (playerPatterns.avgMoveTime > 0 && input.movedBy === 'player') {
    if (input.moveTimeSeconds !== null && input.moveTimeSeconds < 1.5) {
      positionSummary += ` Player moved very fast (${input.moveTimeSeconds}s).`;
    } else if (input.moveTimeSeconds !== null && input.moveTimeSeconds > 15) {
      positionSummary += ` Player took a long time (${input.moveTimeSeconds}s).`;
    }
  }

  const briefing: ChessBriefing = {
    positionSummary,
    mood: moodResult.mood,
    moodChanged: moodResult.mood !== state.prevMood,
    previousMood: state.prevMood,
    inBook: bookStatus !== 'out_of_book',
    openingName,
    isTurningPoint: turningPoint.isTurningPoint,
    turningPointReason: turningPoint.reason,
    phase,
    movedBy: input.movedBy,
    movedPiece: input.piece,
    events,
    moveNumber: input.moveNumber,
    playerName: input.playerName,
    playerColor: input.rookieColor === 'white' ? 'black' : 'white',
  };

  // ── Update state for next move ──
  const nextState: IntelligenceState = {
    prevRookieWp: position.rookieWinPercent,
    prevMood: moodResult.mood,
    prevPhase: phase,
    wasInBook: bookStatus !== 'out_of_book',
    openingName,
    eco,
    leftBookAt,
    patterns,
    totalMoves: state.totalMoves + 1,
    prevPiecesRemaining: input.piecesRemaining,
    prevMoveWasCapture: input.isCapture,
  };

  return {
    briefing,
    openingTracker,
    position,
    turningPoint,
    playerPatterns,
    moodResult,
    nextState,
  };
}

// ════════════════════════════════
// BRIEFING FORMATTER (for LLM injection)
// ════════════════════════════════

/**
 * Format a ChessBriefing into the plain-text block injected into the LLM prompt.
 * This is what goes into the scenario/system message.
 */
export function formatBriefingForPrompt(
  briefing: ChessBriefing,
  openingTracker: OpeningTrackerResult,
  playerPatterns: PlayerPatterns,
  position: PositionTranslation,
): string {
  const lines: string[] = ['CHESS BRIEFING:'];

  // Opening
  if (openingTracker.opening) {
    lines.push(`Opening: ${openingTracker.opening}${openingTracker.eco ? ` (ECO ${openingTracker.eco})` : ''}`);
  }

  // Book status
  if (openingTracker.leftBookAt) {
    lines.push(`Book Status: Player left book at move ${openingTracker.leftBookAt}`);
  } else if (openingTracker.bookStatus === 'in_book') {
    lines.push(`Book Status: Still in book (${openingTracker.masterGames} master games)`);
  } else if (openingTracker.bookStatus === 'sideline') {
    lines.push(`Book Status: Sideline (${openingTracker.masterGames} master games)`);
  } else {
    lines.push('Book Status: Out of book');
  }

  // Position
  lines.push(`Position: ${briefing.positionSummary}`);

  // Mood
  lines.push(`Mood: ${briefing.mood}${briefing.moodChanged ? ` (was ${briefing.previousMood})` : ''}`);

  // Tone
  lines.push(`Tone: ${position.toneGuidance}`);

  // Phase
  lines.push(`Phase: ${briefing.phase}`);

  // Events
  if (briefing.events.length > 0) {
    lines.push(`Events: ${briefing.events.join(', ')}`);
  }

  // Turning point
  if (briefing.isTurningPoint && briefing.turningPointReason) {
    lines.push(`Turning Point: ${briefing.turningPointReason}`);
  }

  // Player patterns (only if enough data)
  if (playerPatterns.avgMoveTime > 0) {
    const patternParts: string[] = [];
    patternParts.push(`avg ${playerPatterns.avgMoveTime}s/move`);
    if (playerPatterns.speedTrend !== 'steady') patternParts.push(playerPatterns.speedTrend.replace('_', ' '));
    if (playerPatterns.castled === 'kingside' || playerPatterns.castled === 'queenside') {
      patternParts.push(`castled ${playerPatterns.castled}`);
    } else if (playerPatterns.castled === 'never_castled') {
      patternParts.push('never castled');
    }
    if (playerPatterns.style !== 'unknown') patternParts.push(`${playerPatterns.style} style`);
    if (playerPatterns.favoritePiece) patternParts.push(`favors ${playerPatterns.favoritePiece}`);
    lines.push(`Player: ${patternParts.join(', ')}`);
  }

  return lines.join('\n');
}

/** Clear the Lichess cache (call between games) */
export function clearLichessCache(): void {
  lichessCache.clear();
}
