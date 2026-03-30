/**
 * Layer 6: Decision Gate + Prompt Assembly Pipeline
 *
 * The traffic controller: evaluates every move and decides what response
 * type it gets (silence, authored quip, or full LLM narrative). Then
 * assembles all 6 layers into the correct prompt order for the Claude API.
 *
 * Target: 5-8 LLM calls per game, under $0.25/game.
 *
 * @see CHE-189 https://linear.app/chesspathapp/issue/CHE-189
 */

import type { ResponseRoute, ChessBriefing } from './types';
import type { IntelligenceResult, ResponseType } from './chess-intelligence';
import type { NarrativeStateFull } from './narrative-state';
import type { LorebookMatch } from './lorebook';
import type { AntiRepetitionState } from './anti-repetition';
import { ROOKIE_CHARACTER_CARD } from './character-card';
import { formatBriefingForPrompt } from './chess-intelligence';
import { formatNarrativeForPrompt } from './narrative-state';
import { formatLorebookForPrompt, matchLorebook } from './lorebook';
import { buildPostHistoryInstructions, getMaxTokens, NARRATIVE_INFERENCE_PARAMS } from './anti-repetition';

// ════════════════════════════════
// DECISION GATE
// ════════════════════════════════

export interface DecisionResult {
  /** The routing decision */
  route: ResponseRoute;
  /** Response type from the turning point detector */
  responseType: ResponseType;
  /** Max tokens for LLM call (only relevant for llm_narrative) */
  maxTokens: number;
  /** Matched lorebook entries (for debugging/logging) */
  lorebookMatches: LorebookMatch[];
}

/**
 * The Decision Gate: evaluate a move and decide what response it gets.
 *
 * This is the cost controller. Book moves and quiet moves get free
 * authored quips (or silence). Only turning points trigger LLM calls.
 */
export function decide(
  intelligence: IntelligenceResult,
  narrativeState: NarrativeStateFull,
): DecisionResult {
  const { briefing, turningPoint } = intelligence;
  const lorebookMatches = matchLorebook(briefing);

  // ── SILENCE: quiet moves with nothing to say ──
  if (turningPoint.responseType === 'silence') {
    return {
      route: { type: 'silence' },
      responseType: 'silence',
      maxTokens: 0,
      lorebookMatches,
    };
  }

  // ── AUTHORED QUIP: book moves, mild events ──
  // The old speech system handles authored quip selection — we just signal the route.
  if (turningPoint.responseType === 'authored_quip') {
    return {
      route: { type: 'silence' },
      responseType: 'authored_quip',
      maxTokens: 0,
      lorebookMatches,
    };
  }

  // ── FULL LLM CALL: turning points ──
  // Determine response length based on severity
  const isCritical = briefing.events.includes('checkmate') ||
    briefing.events.includes('stalemate') ||
    (briefing.events.includes('blunder') && briefing.isTurningPoint);

  const tokenType = isCritical ? 'extended' : 'normal';
  const maxTokens = getMaxTokens(tokenType);

  return {
    route: {
      type: 'llm_narrative',
      briefing,
      narrativeState,
    },
    responseType: 'full_llm_call',
    maxTokens,
    lorebookMatches,
  };
}

// ════════════════════════════════
// PROMPT ASSEMBLY
// ════════════════════════════════

/**
 * Claude API message format.
 * Using the standard messages array structure.
 */
export interface AssembledPrompt {
  /** System message (all non-chat context) */
  system: string;
  /** Messages array for Claude API */
  messages: { role: 'user' | 'assistant'; content: string }[];
  /** Inference parameters */
  params: {
    temperature: number;
    top_p: number;
    max_tokens: number;
  };
}

export interface GameHistory {
  /** Recent moves + Rookie responses for chat history */
  entries: {
    moveNumber: number;
    moveSan: string;
    movedBy: 'player' | 'rookie';
    rookieResponse: string | null;
  }[];
}

/**
 * Assemble all 6 layers into the final Claude API prompt.
 *
 * SillyTavern-verified ordering:
 *   1. system_prompt (Layer 1)
 *   2. description (Layer 1)
 *   3. personality (Layer 1)
 *   4. Lorebook entries (Layer 4)
 *   5. Chess Briefing (Layer 2)
 *   6. Narrative State (Layer 3)
 *   7. mes_example (Layer 1)
 *   8. Recent game history
 *   9. Current move trigger
 *  10. post_history_instructions (Layer 5) — LAST
 */
export function assemblePrompt(
  intelligence: IntelligenceResult,
  narrativeState: NarrativeStateFull,
  antiRepState: AntiRepetitionState,
  lorebookMatches: LorebookMatch[],
  gameHistory: GameHistory,
  maxTokens: number,
  playerFacts: string[] = [],
  /** Honcho player context from peer.chat() — injected at top of system prompt */
  honchoPlayerContext: string | null = null,
): AssembledPrompt {
  const card = ROOKIE_CHARACTER_CARD;
  const { briefing, openingTracker, playerPatterns, position } = intelligence;

  // ── Build system message (positions 1-7) ──
  const systemParts: string[] = [];

  // 1. System prompt (Layer 1)
  systemParts.push(card.system_prompt);

  // 1b. Honcho player context (CHE-201) — what Rookie knows about this player
  if (honchoPlayerContext) {
    systemParts.push('');
    systemParts.push('## What I know about this player');
    systemParts.push(honchoPlayerContext);
    systemParts.push('---');
  }

  // 2. Description (Layer 1)
  systemParts.push('');
  systemParts.push('[Character Description]');
  systemParts.push(card.description
    .replace(/\{\{char\}\}/g, 'Rookie')
    .replace(/\{\{user\}\}/g, briefing.playerName));

  // 3. Personality (Layer 1)
  systemParts.push('');
  systemParts.push(`[Personality: ${card.personality}]`);

  // 4. Lorebook entries (Layer 4)
  const lorebookText = formatLorebookForPrompt(lorebookMatches);
  if (lorebookText) {
    systemParts.push('');
    systemParts.push(lorebookText);
  }

  // 5. Chess Briefing (Layer 2)
  systemParts.push('');
  systemParts.push(formatBriefingForPrompt(briefing, openingTracker, playerPatterns, position));

  // 6. Narrative State (Layer 3)
  systemParts.push('');
  systemParts.push(formatNarrativeForPrompt(narrativeState));

  // 6b. Cross-game memory (player facts from previous games)
  if (playerFacts.length > 0) {
    systemParts.push('');
    systemParts.push(`PLAYER MEMORY (things you remember about ${briefing.playerName} from past games):`);
    for (const fact of playerFacts.slice(-5)) {
      systemParts.push(`- ${fact}`);
    }
    systemParts.push('Reference ONE of these naturally if relevant to the current moment. Don\'t list them.');
  }

  // 7. Example dialogues (Layer 1)
  systemParts.push('');
  systemParts.push('[Example Dialogues]');
  systemParts.push(card.mes_example
    .replace(/\{\{char\}\}/g, 'Rookie')
    .replace(/\{\{user\}\}/g, briefing.playerName));

  const system = systemParts.join('\n');

  // ── Build messages (positions 8-10) ──
  const messages: { role: 'user' | 'assistant'; content: string }[] = [];

  // 8. Recent game history (last 8 exchanges)
  const recentHistory = gameHistory.entries.slice(-8);
  for (const entry of recentHistory) {
    const who = entry.movedBy === 'player' ? briefing.playerName : 'Rookie';
    messages.push({
      role: 'user',
      content: `[Move ${entry.moveNumber}: ${who} plays ${entry.moveSan}]`,
    });
    if (entry.rookieResponse) {
      messages.push({
        role: 'assistant',
        content: entry.rookieResponse,
      });
    }
  }

  // 9. Current move trigger
  const currentMoveWho = briefing.movedBy === 'player' ? briefing.playerName : 'Rookie';
  messages.push({
    role: 'user',
    content: `[Move ${briefing.moveNumber}: ${currentMoveWho} just played. Respond as Rookie.]`,
  });

  // 10. Post-history instructions (Layer 5) — injected as a final user message
  const postHistory = buildPostHistoryInstructions(
    antiRepState,
    narrativeState,
    briefing.mood,
  );
  // Append post-history to the last user message for maximum recency impact
  messages[messages.length - 1].content += '\n\n' + postHistory;

  return {
    system,
    messages,
    params: {
      temperature: NARRATIVE_INFERENCE_PARAMS.temperature,
      top_p: NARRATIVE_INFERENCE_PARAMS.top_p,
      max_tokens: maxTokens,
    },
  };
}

// ════════════════════════════════
// FULL PIPELINE
// ════════════════════════════════

/**
 * The complete pipeline: move → decision → (optional) prompt assembly.
 *
 * Returns the decision and, if it's an LLM call, the assembled prompt.
 * The caller is responsible for:
 *   - Executing the Claude API call (if LLM route)
 *   - Selecting from the authored quip pool (if authored route)
 *   - Updating narrative state after the response
 *   - Logging the quip in anti-repetition state
 */
export interface PipelineResult {
  /** What kind of response this move gets */
  decision: DecisionResult;
  /** Assembled prompt (only present for LLM routes) */
  prompt: AssembledPrompt | null;
}

export function runPipeline(
  intelligence: IntelligenceResult,
  narrativeState: NarrativeStateFull,
  antiRepState: AntiRepetitionState,
  gameHistory: GameHistory,
  playerFacts: string[] = [],
  /** Honcho player context — cached at game start, reused for all triggers */
  honchoPlayerContext: string | null = null,
): PipelineResult {
  // Step 1: Decision Gate
  const decision = decide(intelligence, narrativeState);

  // Step 2: If LLM route, assemble the prompt
  let prompt: AssembledPrompt | null = null;
  if (decision.route.type === 'llm_narrative') {
    prompt = assemblePrompt(
      intelligence,
      narrativeState,
      antiRepState,
      decision.lorebookMatches,
      gameHistory,
      decision.maxTokens,
      playerFacts,
      honchoPlayerContext,
    );
  }

  return { decision, prompt };
}
