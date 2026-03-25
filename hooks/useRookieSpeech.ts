'use client';

import { useRef, useCallback } from 'react';
import {
  type Beat,
  type BeatState,
  createBeatState,
  updateBeat,
} from '@/lib/speech/beat-sheet';
import {
  type GameEvent,
  type QueueState,
  type QueueContext,
  type SpeechLine,
  createQueueState,
  createGeneratedLine,
  selectLine,
  endGame,
} from '@/lib/speech/priority-queue';
import { pickThread } from '@/lib/speech/threads';
import { useRookieQuipQueue } from '@/hooks/useRookieQuipQueue';
import { AUTHORED_LINES } from '@/lib/speech/line-pool';

// ════════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════════

export interface SpeechInput {
  moveNumber: number;
  rookieWinPercent: number;
  prevRookieWinPercent?: number;
  isGameOver: boolean;
  piecesRemaining: number;
  movedBy: 'player' | 'rookie';
  event: GameEvent;
  playerName: string;
  playerColor: 'white' | 'black';
  capturedPiece?: string;
}

export interface EvalUpdate {
  rookieWinPercent: number;
  prevRookieWinPercent?: number;
  moveNumber: number;
  lastMovedBy: 'player' | 'rookie';
  playerName: string;
  playerColor: 'white' | 'black';
}

export interface UseRookieSpeechOptions {
  speakQuip: (text: string) => void;
  isTalkingRef: React.RefObject<boolean>;
  /** Called to generate opening line via Claude. Optional — falls back to authored lines. */
  generateOpeningLine?: (threadName: string, playerName: string) => Promise<string>;
  /** Called to generate game-end line via Claude. Optional — falls back to authored lines. */
  generateGameEndLine?: (context: { playerName: string; rookieWon: boolean; accuracy?: number }) => Promise<string>;
  /** Seed usedRecently from persisted memory (loaded from Supabase) */
  initialUsedRecently?: string[];
}

// ════════════════════════════════════════════════════════════════
// Constants
// ════════════════════════════════════════════════════════════════

const QUIP_COOLDOWN_MOVES = 4; // minimum moves between event-triggered quips
const BLUNDER_THRESHOLD = 15; // rookieWinPercent swing to count as a blunder

// ════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════

function createSeededQueueState(seeds?: string[]): QueueState {
  const state = createQueueState();
  if (seeds) seeds.forEach(id => state.usedRecently.add(id));
  return state;
}

// ════════════════════════════════════════════════════════════════
// Hook
// ════════════════════════════════════════════════════════════════

export function useRookieSpeech(options: UseRookieSpeechOptions) {
  const { speakQuip, isTalkingRef, generateOpeningLine, generateGameEndLine, initialUsedRecently } = options;

  // Playback queue (handles timing, speech bubble, TTS)
  const { queueQuip, waitForIdle, clearQueue, clearDisplay, displayText, msgKey } = useRookieQuipQueue(
    speakQuip,
    isTalkingRef,
  );

  // ── Internal state (refs to avoid re-render storms) ──
  const beatRef = useRef<BeatState>(createBeatState());
  const queueStateRef = useRef<QueueState>(createSeededQueueState(initialUsedRecently));
  const threadNameRef = useRef<string | null>(null);
  const linePoolRef = useRef<SpeechLine[]>([...AUTHORED_LINES]);
  const playerNameRef = useRef<string>('');
  const playerColorRef = useRef<'white' | 'black'>('white');
  const lastQuipMoveRef = useRef(0); // move number of last quip — for cooldown
  const playerHasCastledRef = useRef(false); // tracks if player has castled (for "no castle" quips)

  // ── Helpers ──

  /** Build a QueueContext from SpeechInput + current state */
  const buildContext = useCallback(
    (input: SpeechInput): QueueContext => ({
      beat: beatRef.current.currentBeat,
      evalMood: beatRef.current.evalMood,
      event: input.event,
      movedBy: input.movedBy,
      moveNumber: input.moveNumber,
      activeThreadId: null,
      playerName: input.playerName,
      playerColor: input.playerColor,
      capturedPiece: input.capturedPiece,
    }),
    [],
  );

  /** Select and queue a line from the pool for the current context */
  const selectAndQueue = useCallback(
    (context: QueueContext) => {
      const result = selectLine(linePoolRef.current, context, queueStateRef.current);
      if (result) {
        queueQuip(result.text);
        return true;
      }
      return false;
    },
    [queueQuip],
  );

  /** Try a Claude generator; on success push to pool and select; on failure fall back to authored pool */
  const generateOrFallback = useCallback(
    (
      generator: Promise<string> | undefined,
      beat: Beat,
      context: QueueContext,
      priority: 'high' | 'normal' = 'normal',
    ) => {
      const fallback = () => {
        const result = selectLine(linePoolRef.current, context, queueStateRef.current);
        if (result) queueQuip(result.text, priority);
      };

      if (!generator) { fallback(); return; }

      generator
        .then((text) => {
          linePoolRef.current.push(createGeneratedLine(text, beat, 90));
          const result = selectLine(linePoolRef.current, context, queueStateRef.current);
          if (result) queueQuip(result.text, priority);
        })
        .catch(fallback);
    },
    [queueQuip],
  );

  // ════════════════════════════════════════════════════════════════
  // Public API
  // ════════════════════════════════════════════════════════════════

  /** Call at game start to trigger opening beat */
  const onGameStart = useCallback(
    (playerColor: 'white' | 'black', playerName: string) => {
      // Reset all state — preserve usedRecently for cross-game variety
      beatRef.current = createBeatState();
      queueStateRef.current = endGame(queueStateRef.current);
      threadNameRef.current = null;
      linePoolRef.current = [...AUTHORED_LINES];
      playerNameRef.current = playerName;
      playerColorRef.current = playerColor;
      lastQuipMoveRef.current = 0;
      playerHasCastledRef.current = false;
      clearQueue();

      const context: QueueContext = {
        beat: 'opening',
        evalMood: 'even',
        event: 'none',
        movedBy: 'rookie', // doesn't matter for opening
        moveNumber: 0,
        activeThreadId: null,
        playerName,
        playerColor,
      };

      // Try Claude-generated opening line, fall back to authored pool
      const thread = pickThread();
      generateOrFallback(
        generateOpeningLine ? generateOpeningLine(thread.name, playerName) : undefined,
        'opening',
        context,
      );
    },
    [clearQueue, generateOpeningLine, generateOrFallback],
  );

  /** Call after every move with current game state */
  const onMove = useCallback(
    (input: SpeechInput) => {
      // 1. Update beat
      const beatResult = updateBeat(beatRef.current, {
        moveNumber: input.moveNumber,
        rookieWinPercent: input.rookieWinPercent,
        prevRookieWinPercent: input.prevRookieWinPercent,
        isGameOver: input.isGameOver,
        isPostGame: false,
        piecesRemaining: input.piecesRemaining,
      });
      beatRef.current = beatResult.state;

      // Dismiss speech bubble after 4 moves
      const BUBBLE_DISMISS_MOVES = 4;
      if (displayText && input.moveNumber - lastQuipMoveRef.current >= BUBBLE_DISMISS_MOVES) {
        clearDisplay();
      }

      // On first castle, permanently remove "no castle" nag lines from the pool
      if (input.event === 'castle' && input.movedBy === 'player' && !playerHasCastledRef.current) {
        playerHasCastledRef.current = true;
        linePoolRef.current = linePoolRef.current.filter(line => !line.id.startsWith('no_castle'));
      }

      // ── CORE RULE: Rookie only speaks when something EARNS it. ──
      // She does NOT comment on every move. She speaks on:
      //   - Beat transitions (early_game start, turning_point, game_end)
      //   - Notable events (check, castle, checkmate, blunder, great_move)
      //   - Thread check-ins at turning_point/late_game transitions
      // Regular moves with event 'none' and no beat change = silence.

      // 2. Early game transition — no automatic quip, just note it
      if (beatResult.newBeat === 'early_game') return;

      // 3. Game end — always speak
      if (beatResult.newBeat === 'game_end') {
        const context = buildContext(input);
        const rookieWon = input.rookieWinPercent > 50;
        generateOrFallback(
          generateGameEndLine ? generateGameEndLine({ playerName: input.playerName, rookieWon }) : undefined,
          'game_end',
          context,
          'high',
        );
        return;
      }

      // 4. Turning point — speak from pool, bypass cooldown
      if (beatResult.newBeat === 'turning_point') {
        const context = buildContext(input);
        if (selectAndQueue(context)) {
          lastQuipMoveRef.current = input.moveNumber;
        }
        return;
      }

      // 5. Late game transition — speak from pool, bypass cooldown
      if (beatResult.newBeat === 'late_game') {
        const context = buildContext(input);
        if (selectAndQueue(context)) {
          lastQuipMoveRef.current = input.moveNumber;
        }
        return;
      }

      // 6. Nothing interesting = silence
      if (input.event === 'none') return;

      // 7. Cooldown: don't react to events if Rookie spoke recently
      if (input.moveNumber - lastQuipMoveRef.current < QUIP_COOLDOWN_MOVES) return;

      // 8. Something happened (capture, check, castle, blunder, great_move)
      const context = buildContext(input);
      if (selectAndQueue(context)) {
        lastQuipMoveRef.current = input.moveNumber;
      }
    },
    [buildContext, generateGameEndLine, generateOrFallback, queueQuip, selectAndQueue],
  );

  /** Call when entering post-game phase */
  const onPostGame = useCallback(
    (accuracy?: number) => {
      // Update beat to post_game
      const beatResult = updateBeat(beatRef.current, {
        moveNumber: beatRef.current.moveCount,
        rookieWinPercent: 50, // neutral for post-game
        isGameOver: true,
        isPostGame: true,
        piecesRemaining: 0,
      });
      beatRef.current = beatResult.state;

      const context: QueueContext = {
        beat: 'post_game',
        evalMood: beatRef.current.evalMood,
        event: 'none',
        movedBy: 'rookie',
        moveNumber: beatRef.current.moveCount,
        activeThreadId: null,
        playerName: playerNameRef.current,
      };

      // Try Claude game-end line for post-game if we haven't already
      generateOrFallback(
        generateGameEndLine && accuracy !== undefined
          ? generateGameEndLine({ playerName: playerNameRef.current, rookieWon: false, accuracy })
          : undefined,
        'post_game',
        context,
      );
    },
    [generateGameEndLine, generateOrFallback],
  );

  /** Call when Stockfish eval arrives — detects blunders from eval swing */
  const onEvalUpdate = useCallback(
    (update: EvalUpdate) => {
      // Only detect blunders after player moves
      if (update.lastMovedBy !== 'player') return;
      if (update.prevRookieWinPercent === undefined) return;

      const swing = update.rookieWinPercent - update.prevRookieWinPercent;
      if (swing < BLUNDER_THRESHOLD) return;

      // Respect cooldown
      if (update.moveNumber - lastQuipMoveRef.current < QUIP_COOLDOWN_MOVES) return;

      // Fire a blunder quip
      const context: QueueContext = {
        beat: beatRef.current.currentBeat,
        evalMood: beatRef.current.evalMood,
        event: 'blunder',
        movedBy: 'player',
        moveNumber: update.moveNumber,
        activeThreadId: null,
        playerName: update.playerName,
        playerColor: update.playerColor,
      };

      if (selectAndQueue(context)) {
        lastQuipMoveRef.current = update.moveNumber;
      }
    },
    [selectAndQueue],
  );

  /** Reset for new game */
  const reset = useCallback(() => {
    // Transfer usedThisGame to usedRecently
    queueStateRef.current = endGame(queueStateRef.current);
    // Reset beat and thread state
    beatRef.current = createBeatState();
    threadNameRef.current = null;
    // Clear playback queue
    clearQueue();
  }, [clearQueue]);

  /** Queue an arbitrary line (for analysis reactions, coaching, etc.) */
  const queueDirect = useCallback(
    (text: string, priority: 'high' | 'normal' = 'normal') => {
      queueQuip(text, priority);
    },
    [queueQuip],
  );

  return {
    /** Call after every move with current game state. Handles beat updates + quip selection. */
    onMove,
    /** Call at game start to trigger opening beat */
    onGameStart,
    /** Call when entering post-game phase */
    onPostGame,
    /** Call when Stockfish eval arrives — detects blunders from eval swing */
    onEvalUpdate,
    /** Reset for new game */
    reset,
    /** Queue an arbitrary text line */
    queueDirect,
    /** Current display text */
    displayText,
    /** Key for animation */
    msgKey,
    /** Wait for speech to finish */
    waitForIdle,
    /** Current beat (for debug/UI) */
    currentBeat: beatRef.current.currentBeat,
    /** Active thread name (for debug/UI) */
    activeThread: threadNameRef.current,
    /** Get all used line IDs (thisGame + recently) for persistence */
    getUsedRecently: (): string[] => {
      const all = new Set<string>();
      queueStateRef.current.usedThisGame.forEach(id => all.add(id));
      queueStateRef.current.usedRecently.forEach(id => all.add(id));
      return Array.from(all);
    },
  };
}
