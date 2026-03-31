/**
 * useRookieNarrative — Hook that wires the 6-layer Rookie engine into the play page.
 *
 * On each move:
 *   1. Layer 2: Process move through Chess Intelligence Agent
 *   2. Layer 3: Update Narrative State Machine
 *   3. Layer 4+6: Run Decision Gate (lorebook matching happens inside)
 *   4. If LLM route: Assemble prompt (all 6 layers) → call /api/rookie-narrative
 *   5. Layer 5: Log response in anti-repetition tracker
 *
 * Returns the narrative response (or null for silence/authored quip routes)
 * and updated mood for BreathingRook.
 *
 * @see CHE-177 https://linear.app/chesspathapp/issue/CHE-177
 */

import { useRef, useCallback } from 'react';
import type { RookieMood } from '@/lib/rookie-os/types';
import {
  processMove,
  createIntelligenceState,
  clearLichessCache,
  type MoveInput,
  type IntelligenceState,
  type IntelligenceResult,
} from '@/lib/rookie-os/chess-intelligence';
import {
  createNarrativeState,
  updateNarrativeState,
  startNewGame,
  type NarrativeStateFull,
} from '@/lib/rookie-os/narrative-state';
import {
  createAntiRepetitionState,
  logQuip,
  type AntiRepetitionState,
} from '@/lib/rookie-os/anti-repetition';
import {
  runPipeline,
  type GameHistory,
} from '@/lib/rookie-os/decision-gate';
import {
  EMPTY_ROOKIE_MEMORY,
  formatHonchoSummaryForPrompt,
  type RookieMemoryContext,
} from '@/lib/rookie-memory';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export interface NarrativeMoveInput {
  /** FEN after the move */
  fen: string;
  /** SAN notation */
  san: string;
  /** Full move number */
  moveNumber: number;
  /** Who moved */
  movedBy: 'player' | 'rookie';
  /** Stockfish centipawns (positive = white) */
  cp: number | null;
  /** Mate in N */
  mate: number | null;
  /** Rookie's color */
  rookieColor: 'white' | 'black';
  /** Player name */
  playerName: string;
  /** Move time in seconds (null if not tracked) */
  moveTimeSeconds: number | null;
  /** Piece that moved */
  piece: string | null;
  /** Is capture */
  isCapture: boolean;
  /** Pieces remaining on board */
  piecesRemaining: number;
  /** Is check */
  isCheck: boolean;
  /** Is checkmate */
  isCheckmate: boolean;
  /** Is stalemate */
  isStalemate: boolean;
  /** Is castling */
  isCastle: boolean;
  /** Is promotion */
  isPromotion: boolean;
}

export interface NarrativeResult {
  /** 'silence' | 'authored_quip' | 'llm_narrative' */
  type: 'silence' | 'authored_quip' | 'llm_narrative';
  /** The narrative text (null for silence, empty for authored_quip placeholder) */
  text: string | null;
  /** Rookie's mood from the intelligence agent */
  mood: RookieMood;
  /** Whether mood changed from previous move */
  moodChanged: boolean;
  /** Is this a turning point? */
  isTurningPoint: boolean;
  /** The full intelligence result (for debugging/logging) */
  intelligence: IntelligenceResult;
}

// ════════════════════════════════
// HOOK
// ════════════════════════════════

export function useRookieNarrative() {
  // Mutable state refs (these persist across renders but don't trigger re-renders)
  const intelligenceRef = useRef<IntelligenceState>(createIntelligenceState());
  const narrativeRef = useRef<NarrativeStateFull>(createNarrativeState());
  const antiRepRef = useRef<AntiRepetitionState>(createAntiRepetitionState());
  const gameHistoryRef = useRef<GameHistory>({ entries: [] });
  const llmCallCountRef = useRef(0);
  const memoryContextRef = useRef<RookieMemoryContext>(EMPTY_ROOKIE_MEMORY);

  /**
   * Process a move through the full 6-layer pipeline.
   *
   * Call this after every move (player or Rookie). For LLM routes,
   * this makes an async API call and returns the narrative text.
   * For silence/authored routes, returns immediately.
   */
  const onMove = useCallback(async (input: NarrativeMoveInput): Promise<NarrativeResult> => {
    // ── Layer 2: Chess Intelligence Agent ──
    const moveInput: MoveInput = {
      fen: input.fen,
      san: input.san,
      moveNumber: input.moveNumber,
      movedBy: input.movedBy,
      cp: input.cp,
      mate: input.mate,
      rookieColor: input.rookieColor,
      playerName: input.playerName,
      moveTimeSeconds: input.moveTimeSeconds,
      piece: input.piece,
      isCapture: input.isCapture,
      piecesRemaining: input.piecesRemaining,
      isCheck: input.isCheck,
      isCheckmate: input.isCheckmate,
      isStalemate: input.isStalemate,
      isCastle: input.isCastle,
      isPromotion: input.isPromotion,
    };

    const intelligence = await processMove(moveInput, intelligenceRef.current);
    intelligenceRef.current = intelligence.nextState;

    // ── Layer 6: Decision Gate + Prompt Assembly ──
    const { decision, prompt } = runPipeline(
      intelligence,
      narrativeRef.current,
      antiRepRef.current,
      gameHistoryRef.current,
      memoryContextRef.current.playerFacts,
      formatHonchoSummaryForPrompt(memoryContextRef.current.honchoSummary),
    );

    // ── Route handling ──
    let resultText: string | null = null;
    let resultType: NarrativeResult['type'] = 'silence';

    if (decision.route.type === 'silence') {
      resultType = 'silence';
      resultText = null;
    } else if (decision.route.type === 'authored_quip') {
      // The play page's existing speech system handles authored quips.
      // We return the type so the caller knows to use the quip pool.
      resultType = 'authored_quip';
      resultText = null;
    } else if (decision.route.type === 'llm_narrative' && prompt) {
      // Make the LLM call
      resultType = 'llm_narrative';
      llmCallCountRef.current++;

      try {
        const res = await fetch('/api/rookie-narrative', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: prompt.system,
            messages: prompt.messages,
            params: prompt.params,
          }),
        });
        const data = await res.json();
        resultText = res.ok && data.text ? data.text : null;
      } catch {
        // LLM call failed — degrade to silence
        resultText = null;
        resultType = 'silence';
      }
    }

    // ── Layer 3: Update Narrative State ──
    const rookieSpoke = resultType !== 'silence';
    narrativeRef.current = updateNarrativeState(narrativeRef.current, {
      briefing: intelligence.briefing,
      rookieWinPercent: intelligence.position.rookieWinPercent,
      rookieSpoke,
    });

    // ── Layer 5: Log in anti-repetition tracker ──
    if (resultText) {
      antiRepRef.current = logQuip(
        antiRepRef.current,
        input.moveNumber,
        resultText,
        null, // style detection could be added later
      );
    }

    // ── Update game history ──
    gameHistoryRef.current = {
      entries: [
        ...gameHistoryRef.current.entries,
        {
          moveNumber: input.moveNumber,
          moveSan: input.san,
          movedBy: input.movedBy,
          rookieResponse: resultText,
        },
      ].slice(-16), // keep last 16 entries
    };

    return {
      type: resultType,
      text: resultText,
      mood: intelligence.moodResult.mood,
      moodChanged: intelligence.briefing.moodChanged,
      isTurningPoint: intelligence.briefing.isTurningPoint,
      intelligence,
    };
  }, []);

  /**
   * Reset state for a new game.
   * Call this when starting a new game.
   */
  const resetForNewGame = useCallback(() => {
    intelligenceRef.current = createIntelligenceState();
    narrativeRef.current = startNewGame(narrativeRef.current);
    antiRepRef.current = createAntiRepetitionState();
    gameHistoryRef.current = { entries: [] };
    llmCallCountRef.current = 0;
    memoryContextRef.current = EMPTY_ROOKIE_MEMORY;
    clearLichessCache();
  }, []);

  /** Get the current LLM call count (for monitoring/debugging) */
  const getLlmCallCount = useCallback(() => llmCallCountRef.current, []);

  /** Get current narrative state (for debugging) */
  const getNarrativeState = useCallback(() => narrativeRef.current, []);

  /** Set cross-game memory used by Rookie's narrative layer. */
  const setMemoryContext = useCallback((memory: RookieMemoryContext) => {
    memoryContextRef.current = memory;
  }, []);

  /** Is the game currently in opening book? (based on last processed move) */
  const isInBook = useCallback(() => intelligenceRef.current.wasInBook, []);

  return {
    onMove,
    resetForNewGame,
    setMemoryContext,
    getLlmCallCount,
    getNarrativeState,
    isInBook,
  };
}
