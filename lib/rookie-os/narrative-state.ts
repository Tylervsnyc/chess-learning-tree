/**
 * Layer 3: Narrative State Machine
 *
 * Tracks the game as a story with chapters, emotional arcs, and callback
 * opportunities. Updated after every move. Injected into the LLM prompt
 * alongside the Chess Briefing so Rookie can reference earlier moments.
 *
 * Token budget: ~200-300 tokens when serialized for prompt injection.
 *
 * @see CHE-186 https://linear.app/chesspathapp/issue/CHE-186
 */

import type { NarrativeState, NarrativeCallback, RookieMood, ChessBriefing } from './types';

// ════════════════════════════════
// CHAPTERS
// ════════════════════════════════

/**
 * Game chapters in narrative order. The state machine can only move forward
 * (no going back to opening_moves from crisis), except resolution can
 * briefly revisit tension if the advantage slips.
 */
export type Chapter = NarrativeState['chapter'];

const CHAPTER_ORDER: Chapter[] = [
  'opening_moves',
  'development',
  'tension',
  'crisis',
  'resolution',
];

// ════════════════════════════════
// MOMENTUM
// ════════════════════════════════

export type Momentum =
  | 'building'      // player steadily improving or maintaining advantage
  | 'stable'        // even, nothing dramatic
  | 'collapsing'    // player losing ground
  | 'recovering'    // player clawing back from a deficit
  | 'volatile';     // swinging back and forth

export type RookieEnergy = 'low' | 'medium' | 'high' | 'maximum';

// ════════════════════════════════
// EXTENDED STATE (internal, richer than the types.ts NarrativeState)
// ════════════════════════════════

export interface NarrativeStateFull extends NarrativeState {
  /** Chapters visited so far (for arc summary) */
  chapterHistory: Chapter[];
  /** Current momentum direction */
  momentum: Momentum;
  /** Rookie's current energy level */
  rookieEnergy: RookieEnergy;
  /** Moves since Rookie last spoke (for pacing) */
  movesSinceLastQuip: number;
  /** Running description of player's momentum arc */
  playerMomentumDescription: string;
  /** Recent win% values for momentum detection (last 6) */
  recentWinPercents: number[];
}

// ════════════════════════════════
// CREATION
// ════════════════════════════════

export function createNarrativeState(): NarrativeStateFull {
  return {
    chapter: 'opening_moves',
    callbacks: [],
    emotionalArc: '',
    gamesThisSession: 0,
    chapterHistory: ['opening_moves'],
    momentum: 'stable',
    rookieEnergy: 'medium',
    movesSinceLastQuip: 0,
    playerMomentumDescription: '',
    recentWinPercents: [50],
  };
}

// ════════════════════════════════
// CHAPTER DETECTION
// ════════════════════════════════

/**
 * Determine which chapter the game is in based on the briefing.
 * Chapters only move forward (with one exception: resolution -> tension if advantage slips).
 */
function detectChapter(
  briefing: ChessBriefing,
  currentChapter: Chapter,
  momentum: Momentum,
): Chapter {
  const { phase, isTurningPoint, events, moveNumber } = briefing;

  // Game end events -> resolution
  if (events.includes('checkmate') || events.includes('stalemate')) {
    return 'resolution';
  }

  // Crisis: turning points with big events (blunders, brilliant moves)
  if (isTurningPoint && (events.includes('blunder') || events.includes('great_move'))) {
    return 'crisis';
  }

  // Phase-based transitions
  if (phase === 'endgame') {
    // Endgame with volatile momentum = crisis, otherwise resolution
    return momentum === 'volatile' || momentum === 'collapsing' ? 'crisis' : 'resolution';
  }

  if (phase === 'opening') {
    return briefing.inBook ? 'opening_moves' : 'development';
  }

  // Middlegame chapter selection
  if (phase === 'middlegame') {
    if (isTurningPoint) return 'crisis';
    if (momentum === 'volatile' || momentum === 'collapsing') return 'tension';

    // Don't regress from tension/crisis to development
    const currentIdx = CHAPTER_ORDER.indexOf(currentChapter);
    const devIdx = CHAPTER_ORDER.indexOf('development');
    if (currentIdx > devIdx) return currentChapter;

    return moveNumber <= 12 ? 'development' : 'tension';
  }

  return currentChapter;
}

// ════════════════════════════════
// MOMENTUM DETECTION
// ════════════════════════════════

/**
 * Detect momentum from recent win% trend (from player's perspective).
 * Uses the last 6 data points.
 */
function detectMomentum(recentWps: number[]): Momentum {
  if (recentWps.length < 3) return 'stable';

  const last3 = recentWps.slice(-3);
  const prev3 = recentWps.slice(-6, -3);

  if (prev3.length === 0) {
    // Not enough history, check trend of last 3
    const trend = last3[last3.length - 1] - last3[0];
    if (trend > 10) return 'building';
    if (trend < -10) return 'collapsing';
    return 'stable';
  }

  const avgRecent = last3.reduce((a, b) => a + b, 0) / last3.length;
  const avgPrev = prev3.reduce((a, b) => a + b, 0) / prev3.length;
  const delta = avgRecent - avgPrev;

  // Check volatility: standard deviation of last 6
  const all = [...prev3, ...last3];
  const mean = all.reduce((a, b) => a + b, 0) / all.length;
  const variance = all.reduce((a, v) => a + (v - mean) ** 2, 0) / all.length;
  const stddev = Math.sqrt(variance);

  if (stddev > 15) return 'volatile';
  if (delta > 8) return avgRecent < 45 ? 'recovering' : 'building';
  if (delta < -8) return 'collapsing';
  return 'stable';
}

// ════════════════════════════════
// ROOKIE ENERGY
// ════════════════════════════════

function computeRookieEnergy(
  chapter: Chapter,
  momentum: Momentum,
  isTurningPoint: boolean,
  events: string[],
): RookieEnergy {
  // Game-ending events = maximum
  if (events.includes('checkmate') || events.includes('stalemate')) return 'maximum';

  // Turning points always raise energy
  if (isTurningPoint) return 'high';

  // Crisis chapter = high energy
  if (chapter === 'crisis') return 'high';

  // Volatile momentum = high
  if (momentum === 'volatile') return 'high';

  // Opening/development = low-medium
  if (chapter === 'opening_moves') return 'low';
  if (chapter === 'development') return 'medium';

  // Tension = medium
  if (chapter === 'tension') return 'medium';

  // Resolution = medium (winding down)
  return 'medium';
}

// ════════════════════════════════
// EMOTIONAL ARC
// ════════════════════════════════

const ARC_LABELS: Record<Momentum, string> = {
  building: 'confidence rising',
  stable: 'steady',
  collapsing: 'falling apart',
  recovering: 'fighting back',
  volatile: 'chaotic swings',
};

function buildEmotionalArc(chapterHistory: Chapter[], momentum: Momentum): string {
  // Take the last 3 unique chapters + current momentum for a concise arc
  const unique = [...new Set(chapterHistory)].slice(-3);
  const chapterLabels = unique.map(c => c.replace(/_/g, ' '));
  const arcLabel = ARC_LABELS[momentum];
  return `${chapterLabels.join(' → ')} (${arcLabel})`;
}

function buildMomentumDescription(
  momentum: Momentum,
  chapter: Chapter,
  rookieWp: number,
): string {
  const playerWp = 100 - rookieWp;

  if (chapter === 'opening_moves') return 'Game just started.';

  const playerAhead = playerWp > 55;
  const rookieAhead = rookieWp > 55;
  const even = !playerAhead && !rookieAhead;

  switch (momentum) {
    case 'building':
      return playerAhead
        ? 'Player building a strong position. Confidence growing.'
        : 'Rookie steadily improving. Player needs to find counterplay.';
    case 'collapsing':
      return playerAhead
        ? 'Rookie\'s position is crumbling. Player smells blood.'
        : 'Player\'s advantage is slipping away.';
    case 'recovering':
      return 'Fighting back from a worse position. Momentum shifting.';
    case 'volatile':
      return 'Wild game. Advantage swinging back and forth.';
    case 'stable':
      if (even) return 'Balanced game. Both sides playing carefully.';
      return playerAhead
        ? 'Player holds a steady advantage.'
        : 'Rookie holds a steady advantage.';
  }
}

// ════════════════════════════════
// CALLBACK BANK
// ════════════════════════════════

const MAX_CALLBACKS = 8;

/**
 * Determine if this move should be logged as a callback opportunity.
 * Returns a description, or null if not notable enough.
 */
function evaluateCallback(briefing: ChessBriefing): string | null {
  const { events, moveNumber, movedBy, isTurningPoint, turningPointReason } = briefing;

  // Blunders are always callback-worthy
  if (events.includes('blunder')) {
    const who = movedBy === 'player' ? briefing.playerName : 'Rookie';
    return `${who} blundered on move ${moveNumber}`;
  }

  // Brilliant moves
  if (events.includes('great_move')) {
    const who = movedBy === 'player' ? briefing.playerName : 'Rookie';
    return `${who} found a brilliant move on move ${moveNumber}`;
  }

  // Turning points with a reason
  if (isTurningPoint && turningPointReason) {
    return turningPointReason;
  }

  // Checkmate
  if (events.includes('checkmate')) {
    const who = movedBy === 'player' ? briefing.playerName : 'Rookie';
    return `${who} delivered checkmate`;
  }

  // Promotions are dramatic
  if (events.includes('promotion')) {
    return `Pawn promotion on move ${moveNumber}`;
  }

  return null;
}

/** Mark a callback as referenced (so we don't repeat it) */
export function markCallbackUsed(state: NarrativeStateFull, moveNumber: number): NarrativeStateFull {
  return {
    ...state,
    callbacks: state.callbacks.map(cb =>
      cb.moveNumber === moveNumber ? { ...cb, referenced: true } : cb,
    ),
  };
}

/** Get usable (unreferenced) callbacks for prompt injection */
export function getUsableCallbacks(state: NarrativeStateFull): NarrativeCallback[] {
  return state.callbacks.filter(cb => !cb.referenced);
}

// ════════════════════════════════
// UPDATE (called after every move)
// ════════════════════════════════

export interface NarrativeInput {
  /** Chess Briefing from Layer 2 */
  briefing: ChessBriefing;
  /** Rookie's win% (from Layer 2) */
  rookieWinPercent: number;
  /** Did Rookie speak on this move? (for pacing) */
  rookieSpoke: boolean;
}

/**
 * Update the narrative state after a move.
 * Call this after Layer 2 processes the move and after the response is delivered.
 */
export function updateNarrativeState(
  state: NarrativeStateFull,
  input: NarrativeInput,
): NarrativeStateFull {
  const { briefing, rookieWinPercent, rookieSpoke } = input;

  // Update win% history (keep last 6)
  const playerWp = 100 - rookieWinPercent;
  const recentWps = [...state.recentWinPercents, playerWp].slice(-6);

  // Detect momentum
  const momentum = detectMomentum(recentWps);

  // Detect chapter
  const chapter = detectChapter(briefing, state.chapter, momentum);
  const chapterChanged = chapter !== state.chapter;
  const chapterHistory = chapterChanged
    ? [...state.chapterHistory, chapter]
    : state.chapterHistory;

  // Compute energy
  const rookieEnergy = computeRookieEnergy(
    chapter,
    momentum,
    briefing.isTurningPoint,
    briefing.events,
  );

  // Update callback bank
  let callbacks = [...state.callbacks];
  const callbackDesc = evaluateCallback(briefing);
  if (callbackDesc && callbacks.length < MAX_CALLBACKS) {
    callbacks.push({
      moveNumber: briefing.moveNumber,
      description: callbackDesc,
      mood: briefing.mood,
      referenced: false,
    });
  }

  // Build arc descriptions
  const emotionalArc = buildEmotionalArc(chapterHistory, momentum);
  const playerMomentumDescription = buildMomentumDescription(momentum, chapter, rookieWinPercent);

  // Pacing
  const movesSinceLastQuip = rookieSpoke ? 0 : state.movesSinceLastQuip + 1;

  return {
    chapter,
    callbacks,
    emotionalArc,
    gamesThisSession: state.gamesThisSession,
    chapterHistory,
    momentum,
    rookieEnergy,
    movesSinceLastQuip,
    playerMomentumDescription,
    recentWinPercents: recentWps,
  };
}

/** Increment games counter (call at game start) */
export function startNewGame(state: NarrativeStateFull): NarrativeStateFull {
  return {
    ...createNarrativeState(),
    gamesThisSession: state.gamesThisSession + 1,
  };
}

// ════════════════════════════════
// PROMPT FORMATTER
// ════════════════════════════════

/**
 * Format narrative state for LLM prompt injection.
 * Kept concise to stay within ~200-300 token budget.
 */
export function formatNarrativeForPrompt(state: NarrativeStateFull): string {
  const lines: string[] = ['NARRATIVE CONTEXT:'];

  lines.push(`Story: ${state.emotionalArc}`);
  lines.push(`Chapter: ${state.chapter.replace(/_/g, ' ')}`);
  lines.push(`Momentum: ${state.playerMomentumDescription}`);
  lines.push(`Energy: ${state.rookieEnergy}`);

  // Include usable callbacks (max 3 for token budget)
  const usable = getUsableCallbacks(state).slice(0, 3);
  if (usable.length > 0) {
    lines.push('Moments you can reference:');
    for (const cb of usable) {
      lines.push(`  - Move ${cb.moveNumber}: ${cb.description} (mood: ${cb.mood})`);
    }
  }

  // Pacing hint
  if (state.movesSinceLastQuip >= 4) {
    lines.push('Note: You haven\'t spoken in a while. Consider commenting if something is worth noting.');
  }

  return lines.join('\n');
}
