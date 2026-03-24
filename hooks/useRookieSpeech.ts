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
import {
  type ThreadState,
  createThreadState,
  activateThread,
  getThreadLine,
  pickThread,
} from '@/lib/speech/threads';
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
  const { queueQuip, waitForIdle, clearQueue, displayText, msgKey } = useRookieQuipQueue(
    speakQuip,
    isTalkingRef,
  );

  // ── Internal state (refs to avoid re-render storms) ──
  const beatRef = useRef<BeatState>(createBeatState());
  const queueStateRef = useRef<QueueState>(createSeededQueueState(initialUsedRecently));
  const threadStateRef = useRef<ThreadState>(createThreadState());
  const linePoolRef = useRef<SpeechLine[]>([...AUTHORED_LINES]);
  const playerNameRef = useRef<string>('');
  const playerColorRef = useRef<'white' | 'black'>('white');

  // ── Helpers ──

  /** Build a QueueContext from SpeechInput + current state */
  const buildContext = useCallback(
    (input: SpeechInput): QueueContext => ({
      beat: beatRef.current.currentBeat,
      evalMood: beatRef.current.evalMood,
      event: input.event,
      movedBy: input.movedBy,
      moveNumber: input.moveNumber,
      activeThreadId: threadStateRef.current.activeThread?.id ?? null,
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
      // Reset all state
      beatRef.current = createBeatState();
      queueStateRef.current = createQueueState();
      threadStateRef.current = createThreadState();
      linePoolRef.current = [...AUTHORED_LINES];
      playerNameRef.current = playerName;
      playerColorRef.current = playerColor;
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

      // ── CORE RULE: Rookie only speaks when something EARNS it. ──
      // She does NOT comment on every move. She speaks on:
      //   - Beat transitions (early_game start, turning_point, game_end)
      //   - Notable events (check, castle, checkmate, blunder, great_move)
      //   - Thread check-ins at turning_point/late_game transitions
      // Regular moves with event 'none' and no beat change = silence.

      // 2. If beat changed to early_game, activate thread + speak opener
      if (
        beatResult.newBeat === 'early_game' &&
        !threadStateRef.current.activeThread
      ) {
        threadStateRef.current = activateThread(threadStateRef.current);
        if (threadStateRef.current.activeThread) {
          queueQuip(threadStateRef.current.activeThread.opener);
          queueStateRef.current.quipCount++;
        }
        return;
      }

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

      // 4. Turning point — always speak (thread line or pool)
      if (beatResult.newBeat === 'turning_point') {
        const threadResult = getThreadLine(threadStateRef.current, beatRef.current.evalMood);
        if (threadResult) {
          threadStateRef.current = threadResult.newState;
          queueQuip(threadResult.line);
          queueStateRef.current.quipCount++;
        } else {
          const context = buildContext(input);
          selectAndQueue(context);
        }
        return;
      }

      // 5. Late game transition — one thread check-in
      if (beatResult.newBeat === 'late_game') {
        const threadResult = getThreadLine(threadStateRef.current, beatRef.current.evalMood);
        if (threadResult) {
          threadStateRef.current = threadResult.newState;
          queueQuip(threadResult.line);
          queueStateRef.current.quipCount++;
        }
        return;
      }

      // 6. Notable events only — skip if nothing interesting happened
      if (input.event === 'none') return; // ← THE KEY LINE. Silence is default.

      // 7. Something happened (capture, check, castle, blunder, great_move)
      //    Speak if under the quip limit.
      const context = buildContext(input);
      selectAndQueue(context);
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
        activeThreadId: threadStateRef.current.activeThread?.id ?? null,
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

  /** Reset for new game */
  const reset = useCallback(() => {
    // Transfer usedThisGame to usedRecently
    queueStateRef.current = endGame(queueStateRef.current);
    // Reset beat and thread state
    beatRef.current = createBeatState();
    threadStateRef.current = createThreadState();
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
    activeThread: threadStateRef.current.activeThread?.name ?? null,
    /** Get all used line IDs (thisGame + recently) for persistence */
    getUsedRecently: (): string[] => {
      const all = new Set<string>();
      queueStateRef.current.usedThisGame.forEach(id => all.add(id));
      queueStateRef.current.usedRecently.forEach(id => all.add(id));
      return Array.from(all);
    },
  };
}
