/**
 * Honcho Pedagogical Event Logger
 *
 * Logs game events to Honcho in plain-language pedagogical format.
 * Every message includes the concept, curriculum reference, and game phase.
 *
 * Pipeline: Game event → Chess Analysis Agent → Honcho message
 *
 * All logging is fire-and-forget — never blocks the game loop.
 *
 * @see CHE-199 https://linear.app/chesspathapp/issue/CHE-199
 */

import { logToHoncho, type createHonchoGameSession } from './honcho';
import { analyzePosition, type AnalysisInput, type AnalysisOutput } from './chess-analysis-agent';
import { classifyOpening } from './opening-classifier';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

type HonchoSession = Awaited<ReturnType<typeof createHonchoGameSession>>;

export interface BoardEvent {
  fen: string;
  movePlayed: string;
  bestMove: string;
  evalBefore: number;
  evalAfter: number;
  moveNumber: number;
  phase: 'opening' | 'middlegame' | 'endgame';
  color: 'white' | 'black';
  eventType: 'blunder' | 'missed_win' | 'brilliant' | 'missed_tactic' | 'good_move';
}

export interface BehavioralEvent {
  moveNumber: number;
  type: 'long_think_correct' | 'long_think_mistake' | 'repeated_concept_miss' | 'panic_sequence';
  detail: string;
}

export interface GameSummaryEvent {
  result: 'win' | 'loss' | 'draw';
  moveCount: number;
  openingName: string | null;
  openingEco: string | null;
  color: 'white' | 'black';
  blunders: number;
  mistakes: number;
  brilliantMoves: number;
  playerAccuracy: number;
  primaryWeakness: string | null;
  phase: { opening: string; middlegame: string; endgame: string };
}

// ════════════════════════════════
// BOARD EVENT LOGGING
// ════════════════════════════════

/**
 * Log a significant board event (blunder, brilliant, missed tactic, etc.)
 * Runs the analysis agent first to get pedagogical context, then logs to Honcho.
 *
 * Fire-and-forget — call without await.
 */
export function logBoardEvent(
  honcho: HonchoSession,
  event: BoardEvent,
  completedLessons: string[],
) {
  const input: AnalysisInput = {
    ...event,
    completedLessons,
  };

  // Analysis agent interprets, then log result to Honcho
  analyzePosition(input)
    .then((analysis: AnalysisOutput) => {
      logToHoncho(honcho.session, honcho.user, analysis.honchoMessage);
    })
    .catch((err) => {
      console.error('Board event logging failed:', err);
    });
}

// ════════════════════════════════
// BEHAVIORAL EVENT LOGGING
// ════════════════════════════════

/**
 * Log a behavioral event (time patterns, repeated mistakes, panic).
 * No analysis agent needed — these are pattern-based, not position-based.
 */
export function logBehavioralEvent(
  honcho: HonchoSession,
  event: BehavioralEvent,
) {
  const messages: Record<BehavioralEvent['type'], string> = {
    long_think_correct: `Player took a long time on move ${event.moveNumber} but found the right move. ${event.detail}`,
    long_think_mistake: `Player thought for a long time on move ${event.moveNumber} but still made a mistake. Calculation may have broken down. ${event.detail}`,
    repeated_concept_miss: `Player missed the same concept again on move ${event.moveNumber}. ${event.detail}`,
    panic_sequence: `Player made several fast moves after a long think around move ${event.moveNumber}. Possible panic or frustration. ${event.detail}`,
  };

  logToHoncho(honcho.session, honcho.user, messages[event.type]);
}

// ════════════════════════════════
// GAME SUMMARY LOGGING
// ════════════════════════════════

/**
 * Log the end-of-game summary to Honcho.
 * Fires once when the game ends.
 */
export function logGameSummary(
  honcho: HonchoSession,
  summary: GameSummaryEvent,
) {
  const opening = summary.openingName
    ? `playing the ${summary.openingName}${summary.openingEco ? ` (${summary.openingEco})` : ''}`
    : 'with an unknown opening';

  const resultText = summary.result === 'win'
    ? 'won'
    : summary.result === 'loss'
      ? 'lost'
      : 'drew';

  const weaknessText = summary.primaryWeakness
    ? ` Primary weakness: ${summary.primaryWeakness}.`
    : '';

  const statsText = [
    summary.blunders > 0 ? `${summary.blunders} blunder${summary.blunders > 1 ? 's' : ''}` : null,
    summary.mistakes > 0 ? `${summary.mistakes} mistake${summary.mistakes > 1 ? 's' : ''}` : null,
    summary.brilliantMoves > 0 ? `${summary.brilliantMoves} brilliant move${summary.brilliantMoves > 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(', ');

  const phaseText = `Opening: ${summary.phase.opening}. Middlegame: ${summary.phase.middlegame}. Endgame: ${summary.phase.endgame}.`;

  const message = `Game ended: ${resultText} in ${summary.moveCount} moves as ${summary.color} ${opening}. ` +
    `Accuracy: ${Math.round(summary.playerAccuracy)}%. ` +
    (statsText ? `Key stats: ${statsText}. ` : '') +
    `Phase breakdown — ${phaseText}` +
    weaknessText;

  logToHoncho(honcho.session, honcho.user, message);
}

// ════════════════════════════════
// OPENING CLASSIFICATION (CHE-200)
// ════════════════════════════════

/**
 * Classify the opening at move 8 and log to Honcho.
 * Call once when moveNumber === 8.
 */
export function logOpeningClassification(
  honcho: HonchoSession,
  moves: string[],
  color: 'white' | 'black',
) {
  const result = classifyOpening(moves);
  if (!result) return result;

  const message = `Player opened with the ${result.name} (${result.eco}) playing ${color}.`;
  logToHoncho(honcho.session, honcho.user, message);

  return result;
}
