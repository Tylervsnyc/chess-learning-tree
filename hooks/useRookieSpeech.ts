'use client';

import { useRef, useCallback, useEffect } from 'react';
import {
  type Beat,
  type BeatState,
  createBeatState,
  updateBeat,
  getEvalMood,
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
import { QUIP_POOL, getTimeOfDay, milestoneForGameCount } from '@/lib/quips/quip-pool';
import { selectByCategory } from '@/lib/speech/priority-queue';
import type { SessionBreadcrumb } from '@/lib/session-breadcrumb';
import { SWING_THRESHOLD } from '@/lib/eval-zones';
import { toneForLevel } from '@/lib/quips/tone';

// ════════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════════

export interface SpeechInput {
  moveNumber: number;
  /** Rookie's eval in pawn units (from eval-zones OSOT) */
  rookiePawns: number;
  prevRookiePawns?: number;
  isGameOver: boolean;
  piecesRemaining: number;
  movedBy: 'player' | 'rookie';
  event: GameEvent;
  playerName: string;
  playerColor: 'white' | 'black';
  capturedPiece?: string;
  /** Material value of the captured piece (1=pawn, 3=knight/bishop, 5=rook, 9=queen) */
  capturedPieceValue?: number;
  /** Which piece was moved (e.g. 'queen', 'knight') */
  movedPiece?: string;
}

export interface EvalUpdate {
  /** Rookie's eval in pawn units */
  rookiePawns: number;
  prevRookiePawns?: number;
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
  generateGameEndLine?: (context: {
    playerName: string;
    rookieWon: boolean;
    accuracy?: number;
    gameSummary?: {
      result: string;
      moveCount: number;
      openingName?: string | null;
      blunders: number;
      mistakes: number;
      brilliantMoves: number;
      keyMoments?: string;
    };
  }) => Promise<string>;
  /** Seed usedRecently from persisted memory (loaded from Supabase) */
  initialUsedRecently?: string[];
  /** Rookie personality gauge (1-5). Controls tone filtering on quip selection. Defaults to 3 (baseline). */
  attitudeLevel?: number;
}

// ════════════════════════════════════════════════════════════════
// Constants
// ════════════════════════════════════════════════════════════════

const QUIP_COOLDOWN_MOVES = 8; // minimum moves between event-triggered quips
const CAPTURE_SEQUENCE_MIN = 3; // minimum consecutive captures to trigger capture_sequence

/** Tracks an ongoing capture sequence */
interface CaptureSequence {
  count: number;
  /** Material gained by player (positive) or lost (negative) */
  playerSwing: number;
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
  const { speakQuip, isTalkingRef, generateOpeningLine, generateGameEndLine, initialUsedRecently, attitudeLevel } = options;

  // Keep tone in a ref so it's always up-to-date inside memoized callbacks
  // without forcing consumers to re-subscribe on every slider change.
  const toneRef = useRef(toneForLevel(attitudeLevel ?? 3));
  useEffect(() => {
    toneRef.current = toneForLevel(attitudeLevel ?? 3);
  }, [attitudeLevel]);

  // Playback queue (handles timing, speech bubble, TTS)
  const { queueQuip, waitForIdle, clearQueue, clearDisplay, displayText, msgKey } = useRookieQuipQueue(
    speakQuip,
    isTalkingRef,
  );

  // ── Internal state (refs to avoid re-render storms) ──
  const beatRef = useRef<BeatState>(createBeatState());
  const queueStateRef = useRef<QueueState>(createSeededQueueState(initialUsedRecently));
  const threadNameRef = useRef<string | null>(null);
  const linePoolRef = useRef<SpeechLine[]>([...QUIP_POOL]);
  const playerNameRef = useRef<string>('');
  const playerColorRef = useRef<'white' | 'black'>('white');
  const lastQuipMoveRef = useRef(0); // move number of last quip — for cooldown
  const playerHasCastledRef = useRef(false); // tracks if player has castled (for "no castle" quips)
  const gameEndedRef = useRef(false); // once game_end fires, no more quips
  const captureSeqRef = useRef<CaptureSequence>({ count: 0, playerSwing: 0 });

  useEffect(() => {
    if (!initialUsedRecently) return;
    queueStateRef.current.usedRecently = new Set(initialUsedRecently);
  }, [initialUsedRecently]);

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
      movedPiece: input.movedPiece,
      tone: toneRef.current,
    }),
    [],
  );

  /** Select and queue a line from the pool for the current context */
  const selectAndQueue = useCallback(
    (context: QueueContext) => {
      const result = selectLine(linePoolRef.current, context, queueStateRef.current);
      if (result) {
        queueQuip(result.text, 'normal', result.templateText, result.line.sfx ?? undefined);
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
        if (result) queueQuip(result.text, priority, result.templateText);
      };

      if (!generator) { fallback(); return; }

      generator
        .then((text) => {
          linePoolRef.current.push(createGeneratedLine(text, beat, 90));
          const result = selectLine(linePoolRef.current, context, queueStateRef.current);
          if (result) queueQuip(result.text, priority, result.templateText);
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
      linePoolRef.current = [...QUIP_POOL];
      playerNameRef.current = playerName;
      playerColorRef.current = playerColor;
      lastQuipMoveRef.current = 0;
      playerHasCastledRef.current = false;
      gameEndedRef.current = false;
      captureSeqRef.current = { count: 0, playerSwing: 0 };
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
        tone: toneRef.current,
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
      // Guard: once game_end fires, no more speech events
      if (gameEndedRef.current) return;

      // 1. Update beat (pawn units)
      const beatResult = updateBeat(beatRef.current, {
        moveNumber: input.moveNumber,
        rookiePawns: input.rookiePawns,
        prevRookiePawns: input.prevRookiePawns,
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

      // ── CAPTURE SEQUENCE TRACKING ──
      // Accumulate consecutive captures. Fire capture_sequence when the dust settles.
      const isCapture = input.event === 'capture';
      const seq = captureSeqRef.current;

      if (isCapture && input.capturedPieceValue) {
        // Accumulate: player captures are positive, rookie captures are negative
        const sign = input.movedBy === 'player' ? 1 : -1;
        seq.count++;
        seq.playerSwing += sign * input.capturedPieceValue;
      } else if (seq.count >= CAPTURE_SEQUENCE_MIN) {
        // Sequence just ended — fire the event
        const seqContext: QueueContext = {
          beat: beatRef.current.currentBeat,
          evalMood: beatRef.current.evalMood,
          event: 'capture_sequence',
          movedBy: input.movedBy,
          moveNumber: input.moveNumber,
          activeThreadId: null,
          playerName: input.playerName,
          playerColor: input.playerColor,
          materialSwing: seq.playerSwing,
          captureCount: seq.count,
          tone: toneRef.current,
        };
        // Bypass cooldown — this is a big moment
        if (selectAndQueue(seqContext)) {
          lastQuipMoveRef.current = input.moveNumber;
        }
        captureSeqRef.current = { count: 0, playerSwing: 0 };
      } else {
        // Not enough captures to be a sequence — reset
        captureSeqRef.current = { count: 0, playerSwing: 0 };
      }

      // ── CORE RULE: Rookie only speaks when something EARNS it. ──
      // She does NOT comment on every move. She speaks on:
      //   - Resign (checked first — overrides game_end beat transition)
      //   - Beat transitions (early_game start, turning_point, game_end)
      //   - Notable events (check, castle, checkmate, blunder, great_move)
      //   - Capture sequences (3+ consecutive captures)
      // Regular moves with event 'none' and no beat change = silence.

      // 2. Resign — always speak, bypass cooldown. Must be checked before
      //    game_end beat transition which would otherwise intercept it.
      if (input.event === 'resign') {
        const context = buildContext(input);
        selectAndQueue(context);
        return;
      }

      // 3. Early game transition — no automatic quip, just note it
      if (beatResult.newBeat === 'early_game') return;

      // 4. Game end — lock out mid-game quips. The real end-of-game speech
      //    comes from onPostGame (which has analysis data for a better line).
      if (beatResult.newBeat === 'game_end') {
        gameEndedRef.current = true;
        return;
      }

      // 4. Turning point — speak from pool, but respect cooldown
      if (beatResult.newBeat === 'turning_point') {
        if (input.moveNumber - lastQuipMoveRef.current < QUIP_COOLDOWN_MOVES) return;
        const context = buildContext(input);
        if (selectAndQueue(context)) {
          lastQuipMoveRef.current = input.moveNumber;
        }
        return;
      }

      // 5. Late game transition — speak from pool, but respect cooldown
      if (beatResult.newBeat === 'late_game') {
        if (input.moveNumber - lastQuipMoveRef.current < QUIP_COOLDOWN_MOVES) return;
        const context = buildContext(input);
        if (selectAndQueue(context)) {
          lastQuipMoveRef.current = input.moveNumber;
        }
        return;
      }

      // 7. Nothing interesting = silence
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

  /** Call when entering post-game phase with full game summary */
  const onPostGame = useCallback(
    (accuracy?: number, rookieWon?: boolean, gameSummary?: {
      result: string;
      moveCount: number;
      openingName?: string | null;
      blunders: number;
      mistakes: number;
      brilliantMoves: number;
      keyMoments?: string;
    }) => {
      // Update beat to post_game (0 pawns = neutral for post-game)
      const beatResult = updateBeat(beatRef.current, {
        moveNumber: beatRef.current.moveCount,
        rookiePawns: 0,
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
        tone: toneRef.current,
      };

      // Generate Rookie's game summary with full analysis context
      generateOrFallback(
        generateGameEndLine && accuracy !== undefined
          ? generateGameEndLine({
              playerName: playerNameRef.current,
              rookieWon: rookieWon ?? false,
              accuracy,
              gameSummary,
            })
          : undefined,
        'post_game',
        context,
      );
    },
    [generateGameEndLine, generateOrFallback],
  );

  /** Call when Stockfish eval arrives — detects blunders from eval swing (pawn units) */
  const onEvalUpdate = useCallback(
    (update: EvalUpdate) => {
      // Only detect blunders after player moves
      if (update.lastMovedBy !== 'player') return;
      if (update.prevRookiePawns === undefined) return;

      // Blunder = eval swing >= SWING_THRESHOLD in Rookie's favor (player lost ground)
      const swing = update.rookiePawns - update.prevRookiePawns;
      if (swing < SWING_THRESHOLD) return;

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
        tone: toneRef.current,
      };

      if (selectAndQueue(context)) {
        lastQuipMoveRef.current = update.moveNumber;
      }
    },
    [selectAndQueue],
  );

  /** Call when eval mood zone changes (even/losing/desperate/winning). Gives Rookie a chance to comment. */
  const onMoodChange = useCallback(
    (moveNumber: number, rookiePawns: number) => {
      // Respect cooldown
      if (moveNumber - lastQuipMoveRef.current < QUIP_COOLDOWN_MOVES) return;

      // Compute fresh evalMood from pawn units
      const freshEvalMood = getEvalMood(rookiePawns);

      const context: QueueContext = {
        beat: beatRef.current.currentBeat,
        evalMood: freshEvalMood,
        event: 'mood_change',
        movedBy: 'rookie', // mood is Rookie's feeling
        moveNumber,
        activeThreadId: null,
        playerName: playerNameRef.current,
        playerColor: playerColorRef.current,
        tone: toneRef.current,
      };

      if (selectAndQueue(context)) {
        lastQuipMoveRef.current = moveNumber;
      }
    },
    [selectAndQueue],
  );

  /** Call when alarm variant is active (Rookie is getting crushed, 5+ pawns behind). Fires sore loser quips. */
  const onAlarm = useCallback(
    (moveNumber: number, rookiePawns: number) => {
      // Respect cooldown
      if (moveNumber - lastQuipMoveRef.current < QUIP_COOLDOWN_MOVES) return;

      const freshEvalMood = getEvalMood(rookiePawns);

      const context: QueueContext = {
        beat: beatRef.current.currentBeat,
        evalMood: freshEvalMood,
        event: 'alarm',
        movedBy: 'rookie',
        moveNumber,
        activeThreadId: null,
        playerName: playerNameRef.current,
        playerColor: playerColorRef.current,
        tone: toneRef.current,
      };

      if (selectAndQueue(context)) {
        lastQuipMoveRef.current = moveNumber;
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

  /** Queue a post-game WIN quip from the unified pool (play:win). */
  const queueWinQuip = useCallback(
    (playerName?: string) => {
      const result = selectByCategory(QUIP_POOL, 'play:win', queueStateRef.current, playerName);
      if (result) {
        queueQuip(result.text, 'high');
        return result.text;
      }
      return null;
    },
    [queueQuip],
  );

  /** Queue a post-game LOSS quip from the unified pool (play:loss). */
  const queueLossQuip = useCallback(
    (playerName?: string) => {
      const result = selectByCategory(QUIP_POOL, 'play:loss', queueStateRef.current, playerName);
      if (result) {
        queueQuip(result.text, 'high');
        return result.text;
      }
      return null;
    },
    [queueQuip],
  );

  /** Queue a level-up quip (play:levelup:<level>). */
  const queueLevelUpQuip = useCallback(
    (level: number, playerName?: string) => {
      const result = selectByCategory(
        QUIP_POOL,
        `play:levelup:${level}`,
        queueStateRef.current,
        playerName,
      );
      if (result) {
        queueQuip(result.text, 'high');
        return result.text;
      }
      return null;
    },
    [queueQuip],
  );

  /**
   * Queue a landing quip for the /play home. Prefers the most specific match:
   *   1. Breadcrumb-aware (daily score band, lesson, opening)
   *   2. Milestone game count
   *   3. Close-to-levelup (one win away)
   *   4. Generic time-of-day / day-of-week landing
   */
  const queueLandingQuip = useCallback(
    (ctx: {
      breadcrumb?: SessionBreadcrumb | null;
      gamesPlayed?: number;
      winsAtLevel?: number;
      winsNeeded?: number;
      playerName?: string;
      now?: Date;
    }) => {
      const { breadcrumb, gamesPlayed, winsAtLevel, winsNeeded, playerName } = ctx;
      const now = ctx.now ?? new Date();
      const state = queueStateRef.current;

      // 1. Breadcrumb
      if (breadcrumb) {
        if (breadcrumb.type === 'daily') {
          const { score, total } = breadcrumb;
          const pct = total > 0 ? score / total : 0;
          const band = pct >= 0.7 ? 'high' : pct >= 0.4 ? 'mid' : 'low';
          const result = selectByCategory(
            QUIP_POOL,
            `play:landing:daily:${band}`,
            state,
            playerName,
            { score, total, breadcrumbType: 'daily' },
          );
          if (result) { queueQuip(result.text, 'high'); return result.text; }
        } else if (breadcrumb.type === 'opening') {
          const result = selectByCategory(
            QUIP_POOL,
            'play:landing:opening',
            state,
            playerName,
            { openingName: breadcrumb.openingName, breadcrumbType: 'opening' },
          );
          if (result) { queueQuip(result.text, 'high'); return result.text; }
        } else if (breadcrumb.type === 'lesson') {
          const result = selectByCategory(
            QUIP_POOL,
            'play:landing:lesson',
            state,
            playerName,
            { lessonName: breadcrumb.lessonName, breadcrumbType: 'lesson' },
          );
          if (result) { queueQuip(result.text, 'high'); return result.text; }
        }
      }

      // 2. Milestone
      const milestone = milestoneForGameCount(gamesPlayed);
      if (milestone !== null) {
        const result = selectByCategory(
          QUIP_POOL,
          `play:landing:milestone:${milestone}`,
          state,
          playerName,
        );
        if (result) { queueQuip(result.text, 'high'); return result.text; }
      }

      // 3. Close to level up
      if (winsAtLevel !== undefined && winsNeeded !== undefined && winsNeeded - winsAtLevel === 1) {
        const result = selectByCategory(QUIP_POOL, 'play:landing:closelevel', state, playerName);
        if (result) { queueQuip(result.text, 'high'); return result.text; }
      }

      // 4. Generic time-of-day / day-of-week landing.
      // Walk specificity tiers: day+time, time-only, day-only, generic.
      const tod = getTimeOfDay(now);
      const dow = now.getDay();
      const all = QUIP_POOL.filter(l => l.category === 'play:landing');
      const pickFromTier = (tier: typeof all) => {
        const fresh = tier.filter(l => !state.usedRecently.has(l.id));
        const candidates = fresh.length > 0 ? fresh : tier;
        if (candidates.length === 0) return null;
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        state.usedRecently.add(pick.id);
        return pick;
      };
      const dayAndTime = all.filter(l => l.conditions?.dayOfWeek?.includes(dow) && l.conditions?.timeOfDay === tod);
      const timeOnly = all.filter(l => !l.conditions?.dayOfWeek && l.conditions?.timeOfDay === tod);
      const dayOnly = all.filter(l => l.conditions?.dayOfWeek?.includes(dow) && !l.conditions?.timeOfDay);
      const generic = all.filter(l => !l.conditions?.dayOfWeek && !l.conditions?.timeOfDay);
      for (const tier of [dayAndTime, timeOnly, dayOnly, generic]) {
        const pick = pickFromTier(tier);
        if (pick) { queueQuip(pick.text, 'high'); return pick.text; }
      }
      return null;
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
    /** Call when eval-based mood is APPLIED — Rookie reacts to emotional shifts */
    onMoodChange,
    /** Call when alarm variant is active (5+ pawns behind) — fires sore loser quips */
    onAlarm,
    /** Reset for new game */
    reset,
    /** Queue an arbitrary text line */
    queueDirect,
    /** Queue a post-game win quip */
    queueWinQuip,
    /** Queue a post-game loss quip */
    queueLossQuip,
    /** Queue a level-up quip for the given level */
    queueLevelUpQuip,
    /** Queue a /play landing quip (breadcrumb/milestone/time aware) */
    queueLandingQuip,
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
