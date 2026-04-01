'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { Chess, Square } from 'chess.js';
import { BreathingRook, RookieMood } from '@/components/ui/BreathingRook';
import {
  playMoveSound,
  playCaptureSound,
  warmupAudio,
  playCelebrationSound,
} from '@/lib/sounds';
import { getRookieMove } from '@/lib/rookie-engine';
import { useRookieSpeech, type EvalUpdate } from '@/hooks/useRookieSpeech';
import { type GameEvent } from '@/lib/speech/priority-queue';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import { GameSession, MoveRecord, GameResult, ResultMethod } from '@/lib/game-session';
import { useUser } from '@/hooks/useUser';
import { useRookieVoice } from '@/hooks/useRookieVoice';
import { hasHangingPiece, findFreeCaptureAvailable } from '@/lib/board-analysis';
import { evalToWinPercent, GameAnalysis, PositionEval, analyzeGameMoves, extractKeyMoments, KeyMoment } from '@/lib/game-eval';
import { usePostGameAnalysis } from '@/hooks/usePostGameAnalysis';
import { loadSpeechMemory, saveSpeechMemory } from '@/lib/speech/memory';
import { extractFacts } from '@/lib/speech/fact-extractor';
import { generateFreeCoaching, CoachingScript } from '@/lib/coaching-prompt';
import { CoachingDrawer } from '@/components/coaching/CoachingDrawer';
import { useRookieNarrative, type NarrativeResult } from '@/hooks/useRookieNarrative';
import { useRookieMood } from '@/hooks/useRookieMood';
import { classifyOpening } from '@/lib/opening-classifier';
import { detectOpeningBook } from '@/lib/opening-book-detector';
import {
  buildRookieMemoryContext,
  EMPTY_ROOKIE_MEMORY,
  formatHonchoSummaryForPrompt,
  toSpeechMemory,
  updateRookieMemoryContext,
  type RookieMemoryContext,
} from '@/lib/rookie-memory';

const SKILL_LEVELS = [
  { name: 'Beginner', label: 'I just learned the rules' },
  { name: 'Casual', label: 'I know the basics' },
  { name: 'Intermediate', label: 'I play sometimes' },
  { name: 'Advanced', label: 'I study chess' },
  { name: 'Expert', label: 'Challenge me' },
];

const SF_CONFIG: [number, number][] = [
  [0, 1],   // Beginner — minimax fallback
  [3, 5],   // Casual
  [8, 8],   // Intermediate
  [14, 12], // Advanced
  [20, 16], // Expert
];

/** Interpolate Stockfish config from continuous skill level (0-4) */
function interpolateSfConfig(level: number): [number, number] {
  const clamped = Math.max(0, Math.min(4, level));
  const lo = Math.floor(clamped);
  const hi = Math.min(lo + 1, SF_CONFIG.length - 1);
  const t = clamped - lo;
  return [
    Math.round(SF_CONFIG[lo][0] + t * (SF_CONFIG[hi][0] - SF_CONFIG[lo][0])),
    Math.round(SF_CONFIG[lo][1] + t * (SF_CONFIG[hi][1] - SF_CONFIG[lo][1])),
  ];
}

interface DebugEntry {
  id: number;
  moveNum: number;
  timestamp: number;
  type: 'move' | 'mood' | 'quip' | 'engine' | 'eval' | 'speech' | 'game-event';
  who: 'player' | 'rookie' | 'system';
  summary: string;
  details: Record<string, unknown>;
}

let debugIdCounter = 0;

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const ANIM_MS = 300;

const SNAP_STRENGTH = 0.3; // how close (in level units) before snapping kicks in

/** Magnetic snap: if within SNAP_STRENGTH of an integer, pull toward it */
function magneticSnap(raw: number): number {
  const nearest = Math.round(raw);
  const dist = Math.abs(raw - nearest);
  if (dist < SNAP_STRENGTH) {
    // Ease toward the snap point — stronger as you get closer
    const t = dist / SNAP_STRENGTH; // 0 = on it, 1 = edge of zone
    return nearest + (raw - nearest) * (t * t); // quadratic ease
  }
  return raw;
}

function SkillSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const getValueFromX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 4;
    return magneticSnap(Math.max(0, Math.min(4, raw)));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    onChange(getValueFromX(e.clientX));
  }, [getValueFromX, onChange]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    onChange(getValueFromX(e.clientX));
  }, [getValueFromX, onChange]);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Find nearest snap label
  const nearestSnap = Math.round(value);
  const distToSnap = Math.abs(value - nearestSnap);
  const labelOpacity = distToSnap < 0.4 ? 1 - distToSnap / 0.4 : 0;

  return (
    <div className="space-y-2">
      {/* Current level label */}
      <div className="text-center h-10 flex flex-col items-center justify-center">
        <span
          className="text-sm font-bold text-chess-text transition-opacity"
          style={{ opacity: labelOpacity }}
        >
          {SKILL_LEVELS[nearestSnap]?.name}
        </span>
        <span
          className="text-[10px] text-chess-text-muted transition-opacity"
          style={{ opacity: labelOpacity }}
        >
          {SKILL_LEVELS[nearestSnap]?.label}
        </span>
      </div>

      {/* Slider track */}
      <div
        ref={trackRef}
        className="relative h-10 flex items-center cursor-pointer touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Track background */}
        <div className="absolute inset-x-0 h-1.5 bg-chess-surface rounded-full" />
        {/* Active fill */}
        <div
          className="absolute left-0 h-1.5 bg-chess-green rounded-full transition-none"
          style={{ width: `${(value / 4) * 100}%` }}
        />
        {/* Snap dots */}
        {SKILL_LEVELS.map((_, i) => (
          <div
            key={i}
            className={`absolute w-2.5 h-2.5 rounded-full -translate-x-1/2 transition-colors ${
              i <= Math.round(value) ? 'bg-chess-green' : 'bg-chess-disabled'
            }`}
            style={{ left: `${(i / 4) * 100}%` }}
          />
        ))}
        {/* Thumb */}
        <div
          className="absolute w-6 h-6 -translate-x-1/2 rounded-full bg-white shadow-md border-2 border-chess-green transition-none"
          style={{ left: `${(value / 4) * 100}%` }}
        />
      </div>

      {/* Labels under dots */}
      <div className="relative h-4">
        {SKILL_LEVELS.map((lv, i) => (
          <span
            key={i}
            className="absolute text-[9px] text-chess-text-muted -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${(i / 4) * 100}%` }}
          >
            {lv.name}
          </span>
        ))}
      </div>
    </div>
  );
}

type Phase = 'setup' | 'playing' | 'gameover' | 'review';

function toGameEvent(g: Chess, result: { captured?: string; san: string }): GameEvent {
  if (g.isCheckmate()) return 'checkmate';
  if (g.isStalemate()) return 'stalemate';
  if (g.isCheck()) return 'check';
  const san = result.san;
  if (san === 'O-O' || san === 'O-O-O') return 'castle';
  if (result.captured) return 'capture';
  return 'none';
}

function countPieces(fen: string): number {
  const board = fen.split(' ')[0];
  return (board.match(/[pnbrqkPNBRQK]/g) || []).length;
}

const PIECE_NAMES: Record<string, string> = {
  p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king',
};

const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
};

// Arrow colors for review mode
const ARROW_GREEN = 'rgba(88, 204, 2, 0.85)';
const ARROW_RED = 'rgba(235, 64, 52, 0.85)';
const ARROW_AMBER = 'rgba(245, 158, 11, 0.85)';

function getArrowColor(type: string): string {
  if (type === 'blunder' || type === 'mistake') return ARROW_RED;
  if (type === 'turning-point') return '#F5A623'; // amber
  return ARROW_GREEN;
}

// Eval bar: convert eval to white percentage using Lichess sigmoid (50 = even)
function evalToWhitePercent(cp: number | null, mate: number | null): number {
  const pct = evalToWinPercent(cp, mate);
  // Clamp to 5-95% so the bar never fully disappears
  return Math.max(5, Math.min(95, pct));
}

export default function PlayRookiePage() {
  const { user } = useUser();
  const [rookieMemory, setRookieMemory] = useState<RookieMemoryContext>(EMPTY_ROOKIE_MEMORY);
  const rookieMemoryRef = useRef<RookieMemoryContext>(EMPTY_ROOKIE_MEMORY);

  // Load speech memory + Honcho context on login (before game starts)
  useEffect(() => {
    if (!user?.id) {
      setRookieMemory(EMPTY_ROOKIE_MEMORY);
      rookieMemoryRef.current = EMPTY_ROOKIE_MEMORY;
      return;
    }

    const honchoFetch = (action: string) =>
      fetch('/api/honcho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId: user.id }),
      }).then(r => r.json()).catch(() => ({}));

    Promise.all([
      loadSpeechMemory(user.id),
      honchoFetch('get_context').then(d => d.context ?? null),
      honchoFetch('get_last_game').then(d => d.lastGame ?? null),
      honchoFetch('get_representation').then(d => d.representation ?? null),
    ]).then(([speechMemory, honchoSummary, lastGameContext, honchoRepresentation]) => {
      const memory = buildRookieMemoryContext({ speechMemory, honchoSummary, lastGameContext, honchoRepresentation });
      setRookieMemory(memory);
      rookieMemoryRef.current = memory;

      const honchoPreview = formatHonchoSummaryForPrompt(honchoSummary);
      if (honchoPreview) {
        console.log('[Honcho] Chat context:', honchoPreview.slice(0, 80));
      }
      if (honchoRepresentation) {
        console.log('[Honcho] Representation:', honchoRepresentation.slice(0, 80));
      }
      if (lastGameContext) {
        console.log('[Honcho] Last game:', lastGameContext.slice(0, 80));
      }
    });
  }, [user?.id]);

  const [phase, setPhase] = useState<Phase>('setup');
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [skillLevel, setSkillLevel] = useState(1); // continuous 0-4 float
  const [playerName, setPlayerName] = useState('');

  // FEN is the single source of truth for board state
  const [fen, setFen] = useState(START_FEN);
  const [selected, setSelected] = useState<Square | null>(null);
  const [lastMv, setLastMv] = useState<{ from: Square; to: Square } | null>(null);
  const [rookieThinking, setRookieThinking] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [resignArmed, setResignArmed] = useState(false);

  // Eval bar state
  const [evalPct, setEvalPct] = useState(50); // white percentage
  const evalCp = useRef(0); // raw centipawns for display
  const evalMate = useRef<number | null>(null); // mate-in-N
  const lastMovedByRef = useRef<'player' | 'rookie'>('player'); // who moved last (for blunder detection)
  const speechEvalUpdateRef = useRef<((update: EvalUpdate) => void) | null>(null); // set after speech hook init

  // Review state
  const [keyMoments, setKeyMoments] = useState<KeyMoment[]>([]);
  const [reviewMomentIndex, setReviewMomentIndex] = useState(0);
  const [reviewMoveIndex, setReviewMoveIndex] = useState(0);
  const [reviewText, setReviewText] = useState<string | null>(null);
  const [reviewArrows, setReviewArrows] = useState<{ startSquare: string; endSquare: string; color: string }[]>([]);

  // Post-game analysis
  const postGame = usePostGameAnalysis();

  // 6-layer narrative engine
  const narrative = useRookieNarrative();

  // Coaching drawer
  const [coachingScript, setCoachingScript] = useState<CoachingScript | null>(null);
  const [showCoaching, setShowCoaching] = useState(false);

  // Quip state
  const [audioOn, setAudioOn] = useState(true);

  // Unified mood system
  const moodSystem = useRookieMood(playerColor);
  const rookieMood = moodSystem.mood;
  const rookieAlarm = moodSystem.alarmVariant;

  // Debug log
  const [debugLog, setDebugLog] = useState<DebugEntry[]>([]);
  const [debugOpen, setDebugOpen] = useState(false);
  const debugEndRef = useRef<HTMLDivElement>(null);

  const log = useCallback((entry: Omit<DebugEntry, 'id' | 'timestamp'>) => {
    setDebugLog(prev => [...prev, { ...entry, id: debugIdCounter++, timestamp: Date.now() }]);
  }, []);

  // Auto-scroll debug log
  useEffect(() => {
    if (debugOpen && debugEndRef.current) {
      debugEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [debugLog, debugOpen]);

  const moveNumRef = useRef(0);
  const rookieTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Session tracking for coaching
  const sessionRef = useRef<GameSession | null>(null);
  const moveStartRef = useRef<number>(Date.now());
  // Local move log — always tracks moves for review, even without login
  const moveLogRef = useRef<MoveRecord[]>([]);

  // Honcho memory integration
  const honchoGameIdRef = useRef<string | null>(null);
  const honchoOpeningLoggedRef = useRef(false);


  // Stockfish init
  const sfReadyRef = useRef(false);
  useEffect(() => {
    stockfish.init().then(() => { sfReadyRef.current = true; }).catch(() => {});
  }, []);

  // Derive game state from FEN (no mutable ref)
  const game = useMemo(() => new Chess(fen), [fen]);
  const isMyTurn = (game.turn() === 'w' && playerColor === 'white') || (game.turn() === 'b' && playerColor === 'black');


  // Accumulate position evals during play — used for instant post-game analysis
  const positionEvalsRef = useRef<PositionEval[]>([]);

  // Update eval bar + eval-based mood after each position change
  const updateEval = useCallback((fenStr: string) => {
    if (!sfReadyRef.current || phase !== 'playing') return;
    stockfish.getFullEval(fenStr, 10).then((result) => {
      if (!result) return;
      const { cp, mate, bestMove } = result;
      evalCp.current = cp ?? 0;
      evalMate.current = mate;
      setEvalPct(evalToWhitePercent(cp, mate));

      // Store eval for post-game analysis
      positionEvalsRef.current.push({
        cp: cp,
        mate: mate,
        bestMove: bestMove,
        bestLine: [],
        depth: 10,
      });

      // Drive Rookie's mood from eval via unified mood system
      const moodUpdate = moodSystem.onEval(cp, mate, moveNumRef.current);

      // Check for blunders via speech system
      speechEvalUpdateRef.current?.({
        rookieWinPercent: moodUpdate.rookieWinPercent,
        prevRookieWinPercent: moodSystem.getPrevRookieWinPercent(),
        moveNumber: moveNumRef.current,
        lastMovedBy: lastMovedByRef.current,
        playerName: playerName || 'friend',
        playerColor,
      });

      // Honcho: log blunders/mistakes from eval swings (catches what narrative misses)
      if (user?.id && honchoGameIdRef.current && lastMovedByRef.current === 'player') {
        const prevWp = moodSystem.getPrevRookieWinPercent() ?? 50;
        const wpDelta = moodUpdate.rookieWinPercent - prevWp; // positive = Rookie gained = player lost
        const lastMove = moveLogRef.current[moveLogRef.current.length - 1];
        if (wpDelta >= 30 && lastMove) {
          // Blunder: 30%+ swing against player
          fetch('/api/honcho', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'log_event', gameId: honchoGameIdRef.current, userId: user.id,
              event: {
                fen: lastMove.fenAfter, movePlayed: lastMove.san, bestMove: bestMove ?? 'unknown',
                evalBefore: positionEvalsRef.current[positionEvalsRef.current.length - 2]?.cp ?? 0,
                evalAfter: cp ?? 0, moveNumber: moveNumRef.current,
                phase: moveNumRef.current <= 10 ? 'opening' : moveNumRef.current <= 30 ? 'middlegame' : 'endgame',
                color: playerColor, eventType: 'blunder',
              }, completedLessons: [],
            }),
          }).catch(() => {});
          log({ moveNum: moveNumRef.current, type: 'game-event', who: 'system', summary: `[Honcho] blunder logged: ${lastMove.san} (${Math.round(wpDelta)}% swing)`, details: { wpDelta, bestMove } });
        } else if (wpDelta >= 20 && lastMove) {
          // Mistake: 20%+ swing
          fetch('/api/honcho', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'log_event', gameId: honchoGameIdRef.current, userId: user.id,
              event: {
                fen: lastMove.fenAfter, movePlayed: lastMove.san, bestMove: bestMove ?? 'unknown',
                evalBefore: positionEvalsRef.current[positionEvalsRef.current.length - 2]?.cp ?? 0,
                evalAfter: cp ?? 0, moveNumber: moveNumRef.current,
                phase: moveNumRef.current <= 10 ? 'opening' : moveNumRef.current <= 30 ? 'middlegame' : 'endgame',
                color: playerColor, eventType: 'missed_tactic',
              }, completedLessons: [],
            }),
          }).catch(() => {});
          log({ moveNum: moveNumRef.current, type: 'game-event', who: 'system', summary: `[Honcho] mistake logged: ${lastMove.san} (${Math.round(wpDelta)}% swing)`, details: { wpDelta, bestMove } });
        }
      }

      // Let Rookie react when the eval mood zone changes
      if (moodSystem.checkEvalMoodZone(moodUpdate.rookieWinPercent)) {
        speech.onMoodChange(moveNumRef.current, moodUpdate.rookieWinPercent);
      }

      // Fire sore loser quips when alarm is active (8+ pawns behind)
      if (moodSystem.alarmVariant) {
        speech.onAlarm(moveNumRef.current, moodUpdate.rookieWinPercent);
      }

      log({
        moveNum: moveNumRef.current,
        type: 'eval',
        who: 'system',
        summary: `cp=${cp} mate=${mate} rookieWp=${moodUpdate.rookieWinPercent.toFixed(1)}% mood=${moodUpdate.mood}${moodUpdate.applied ? ' APPLIED' : ' held'}`,
        details: { cp, mate, rookieWinPercent: moodUpdate.rookieWinPercent, mood: moodUpdate.mood, isSwing: moodUpdate.isSwing, moodApplied: moodUpdate.applied },
      });
    }).catch(() => {});
  }, [phase, playerColor, playerName, log]);

  // ════════════════════════════════
  // AUDIO (with real-time amplitude for talk animation)
  // ════════════════════════════════
  const { speakQuip, talkIntensity, isTalking, isTalkingRef } = useRookieVoice(audioOn);

  // ── Speech system (replaces getRookieQuip + getMoodShiftQuip) ──
  const generateOpeningLine = useCallback(async (threadName: string, pName: string): Promise<string> => {
    const res = await fetch('/api/rookie-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'opening',
        context: {
          threadName,
          playerName: pName,
          memory: rookieMemoryRef.current,
        },
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.text) throw new Error('Failed');
    return data.text;
  }, []);

  const generateGameEndLine = useCallback(async (ctx: {
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
  }): Promise<string> => {
    const res = await fetch('/api/rookie-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'game_end',
        context: {
          ...ctx,
          memory: rookieMemoryRef.current,
        },
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.text) throw new Error('Failed');
    return data.text;
  }, [narrative]);

  const speech = useRookieSpeech({
    speakQuip,
    isTalkingRef,
    generateOpeningLine,
    generateGameEndLine,
    initialUsedRecently: rookieMemory.usedRecently,
  });

  // Wire up eval-based blunder detection (speech is defined after updateEval, so use ref)
  speechEvalUpdateRef.current = speech.onEvalUpdate;

  // ── 6-layer narrative processing (runs alongside existing speech system) ──
  const processNarrative = useCallback(async (
    g: Chess,
    result: { san: string; piece: string; from: string; to: string; captured?: string | null; flags: string },
    movedBy: 'player' | 'rookie',
    newFen: string,
  ) => {
    // Only run if we have eval data (Stockfish is ready)
    if (!sfReadyRef.current) return;
    const rookieColor = playerColor === 'white' ? 'black' : 'white';

    const narrativeResult = await narrative.onMove({
      fen: newFen,
      san: result.san,
      moveNumber: moveNumRef.current,
      movedBy,
      cp: evalCp.current,
      mate: evalMate.current,
      rookieColor: rookieColor as 'white' | 'black',
      playerName: playerName || 'friend',
      moveTimeSeconds: movedBy === 'player' ? (Date.now() - moveStartRef.current) / 1000 : null,
      piece: result.piece,
      isCapture: !!result.captured,
      piecesRemaining: countPieces(newFen),
      isCheck: g.isCheck(),
      isCheckmate: g.isCheckmate(),
      isStalemate: g.isStalemate(),
      isCastle: result.flags.includes('k') || result.flags.includes('q'),
      isPromotion: result.flags.includes('p'),
    });

    // Honcho: log opening at move 8, log blunders/brilliants
    if (user?.id && honchoGameIdRef.current) {
      const gameId = honchoGameIdRef.current;
      const userId = user.id;

      // Opening classification at move 8
      if (moveNumRef.current === 8 && !honchoOpeningLoggedRef.current) {
        honchoOpeningLoggedRef.current = true;
        const gameMoves = moveLogRef.current.map(m => m.san);
        const opening = classifyOpening(gameMoves);
        if (opening) {
          fetch('/api/honcho', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'log_opening', gameId, userId, moves: gameMoves, color: playerColor }),
          }).catch(() => {});
          log({ moveNum: 8, type: 'game-event', who: 'system', summary: `Honcho: opening=${opening.name} (${opening.eco})`, details: { opening } });
        }
      }

      // Log significant events (blunders, mistakes, brilliants) — from narrative turning points
      if (narrativeResult.isTurningPoint && movedBy === 'player') {
        const events = narrativeResult.intelligence.briefing.events;
        const eventType = events.includes('blunder') ? 'blunder'
          : events.includes('great_move') ? 'brilliant'
          : null;
        // Get Stockfish's best move from the previous eval (before this move was played)
        const prevEval = positionEvalsRef.current[positionEvalsRef.current.length - 2];
        const sfBestMove = prevEval?.bestMove ?? 'unknown';
        if (eventType) {
          fetch('/api/honcho', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'log_event',
              gameId,
              userId,
              event: {
                fen: newFen,
                movePlayed: result.san,
                bestMove: sfBestMove,
                evalBefore: evalCp.current,
                evalAfter: evalCp.current,
                moveNumber: moveNumRef.current,
                phase: narrativeResult.intelligence.briefing.phase,
                color: playerColor,
                eventType,
              },
              completedLessons: [],
            }),
          }).catch(() => {});
          log({ moveNum: moveNumRef.current, type: 'game-event', who: 'system', summary: `Honcho: logged ${eventType} move ${moveNumRef.current}`, details: { eventType } });
        }
      }
    }

    // If the narrative engine returned LLM text, route through the quip queue
    // but only if Rookie isn't already talking (don't pile up prompts during fast play)
    // and only if the game is still in progress
    if (narrativeResult.type === 'llm_narrative' && narrativeResult.text
      && !isTalkingRef.current && !g.isGameOver()) {
      speech.queueDirect(narrativeResult.text, 'high');
      log({
        moveNum: moveNumRef.current,
        type: 'speech',
        who: 'system',
        summary: `[NARRATIVE] ${narrativeResult.text.slice(0, 80)}...`,
        details: {
          type: narrativeResult.type,
          isTurningPoint: narrativeResult.isTurningPoint,
          mood: narrativeResult.mood,
          llmCalls: narrative.getLlmCallCount(),
        },
      });
    }

    // Use narrative mood if it changed (narrative engine sees full context)
    if (narrativeResult.moodChanged) {
      moodSystem.onNarrativeMood(narrativeResult.mood, true, moveNumRef.current);
    }
  }, [playerColor, playerName, narrative, moodSystem, speech, log]);

  // ════════════════════════════════
  // MOOD — event overrides (captures, checks, game end)
  // Eval-based baseline mood is handled in updateEval above
  // All mood logic now lives in useRookieMood hook
  // ════════════════════════════════

  const updateMood = useCallback((g: Chess, movedBy: 'player' | 'rookie') => {
    const event = g.isCheckmate() ? 'checkmate' as const
      : g.isStalemate() ? 'stalemate' as const
      : g.isDraw() ? 'draw' as const
      : g.isCheck() ? 'check' as const
      : 'none' as const;

    const result = moodSystem.onGameEvent(event, movedBy, moveNumRef.current);
    if (result) {
      log({
        moveNum: moveNumRef.current,
        type: 'mood',
        who: movedBy,
        summary: `${result.reason} -> ${result.mood}`,
        details: { mood: result.mood, source: result.source, event },
      });
    }
  }, [moodSystem, log]);

  // ════════════════════════════════
  // SESSION RECORDING — track moves for coaching
  // ════════════════════════════════
  const recordMoveToSession = useCallback((
    g: Chess,
    result: { san: string; piece: string; from: string; to: string; captured?: string | null; flags: string },
    movedBy: 'player' | 'rookie',
    prevFen: string,
  ) => {
    const session = sessionRef.current;
    const playerCol = playerColor === 'white' ? 'w' : 'b';
    const timeMs = movedBy === 'player' ? Date.now() - moveStartRef.current : null;

    const moveRecord: MoveRecord = {
      moveNumber: moveNumRef.current,
      movedBy,
      san: result.san,
      piece: result.piece,
      from: result.from,
      to: result.to,
      isCapture: !!result.captured,
      isCheck: g.isCheck(),
      isCastling: result.flags.includes('k') || result.flags.includes('q'),
      fenAfter: g.fen(),
      timeToMoveMs: timeMs,
      pieceHung: movedBy === 'player' ? hasHangingPiece(g.fen(), playerCol as 'w' | 'b') : false,
      captureAvailable: movedBy === 'player' ? !!findFreeCaptureAvailable(prevFen, playerCol as 'w' | 'b') : false,
      captureTaken: movedBy === 'player' ? !!result.captured : false,
      rookieMood: rookieMood,
    };
    moveLogRef.current.push(moveRecord);
    if (session) session.recordMove(moveRecord);

    // Honcho: detect behavioral events (long thinks, panic sequences)
    if (movedBy === 'player' && user?.id && honchoGameIdRef.current && timeMs) {
      const timeSec = timeMs / 1000;
      const playerMoves = moveLogRef.current.filter(m => m.movedBy === 'player');

      // Long think (>15s)
      if (timeSec > 15) {
        // We'll know if it was correct once the eval comes in — log the think for now
        fetch('/api/honcho', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'log_event', gameId: honchoGameIdRef.current, userId: user.id,
            event: {
              fen: g.fen(), movePlayed: result.san, bestMove: 'unknown',
              evalBefore: 0, evalAfter: 0, moveNumber: moveNumRef.current,
              phase: moveNumRef.current <= 10 ? 'opening' : moveNumRef.current <= 30 ? 'middlegame' : 'endgame',
              color: playerColor, eventType: 'good_move',
            }, completedLessons: [],
            behavioral: { type: 'long_think', seconds: Math.round(timeSec) },
          }),
        }).catch(() => {});
      }

      // Panic sequence: 3+ consecutive fast moves (<2s each) after a long think (>10s)
      if (playerMoves.length >= 3) {
        const last3 = playerMoves.slice(-3);
        const allFast = last3.every(m => m.timeToMoveMs !== null && m.timeToMoveMs < 2000);
        const hadLongThink = playerMoves.length >= 4 &&
          (playerMoves[playerMoves.length - 4]?.timeToMoveMs ?? 0) > 10000;
        if (allFast && hadLongThink) {
          fetch('/api/honcho', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'log_event', gameId: honchoGameIdRef.current, userId: user.id,
              event: {
                fen: g.fen(), movePlayed: result.san, bestMove: 'unknown',
                evalBefore: 0, evalAfter: 0, moveNumber: moveNumRef.current,
                phase: moveNumRef.current <= 10 ? 'opening' : moveNumRef.current <= 30 ? 'middlegame' : 'endgame',
                color: playerColor, eventType: 'good_move',
              }, completedLessons: [],
              behavioral: { type: 'panic_sequence', moveNumber: moveNumRef.current },
            }),
          }).catch(() => {});
          log({ moveNum: moveNumRef.current, type: 'game-event', who: 'system', summary: '[Honcho] panic sequence detected', details: {} });
        }
      }
    }

    // Reset timer for next player move
    if (movedBy === 'rookie') moveStartRef.current = Date.now();
  }, [playerColor, rookieMood, user?.id]);

  const endSession = useCallback((g: Chess) => {
    let result: GameResult | undefined;
    let method: ResultMethod | undefined;

    if (g.isCheckmate()) {
      const loser = g.turn();
      const playerLost = (loser === 'w' && playerColor === 'white') || (loser === 'b' && playerColor === 'black');
      result = playerLost ? 'loss' : 'win';
      method = 'checkmate';
    } else if (g.isStalemate()) {
      result = 'draw';
      method = 'stalemate';
    } else if (g.isDraw()) {
      result = 'draw';
    }

    // Analyze game for review — always works, even without login
    const moves = moveLogRef.current;
    const moveInfos = moves.map(m => ({ san: m.san, movedBy: m.movedBy, moveNumber: m.moveNumber }));
    const analysis = moves.length > 0
      ? analyzeGameMoves(positionEvalsRef.current, moveInfos, playerColor)
      : null;

    if (moves.length > 0 && analysis) {
      // Extract eval-based key moments (replaces old heuristic review)
      const moveRecs = moves.map(m => ({ san: m.san, movedBy: m.movedBy, moveNumber: m.moveNumber, fenAfter: m.fenAfter, from: m.from, to: m.to }));
      setKeyMoments(extractKeyMoments(analysis, moveRecs, playerName || undefined));

      // Instant post-game analysis from evals collected during play — no re-analysis needed
      postGame.setInstantAnalysis(analysis);

      // Generate coaching script with analysis data
      const coaching = generateFreeCoaching(
        {
          themesSeen: [],
          themesCorrect: [],
          themesMissed: [],
          puzzlesTotal: 0,
          puzzlesCorrect: 0,
          bestStreak: 0,
          piecesHung: moves.filter(m => m.movedBy === 'player' && m.pieceHung).length,
          capturesMissed: moves.filter(m => m.movedBy === 'player' && m.captureAvailable && !m.captureTaken).length,
          result,
        },
        playerName || undefined,
        analysis,
      );
      setCoachingScript(coaching);

      // Honcho: log rich game summary with key moments
      if (user?.id && honchoGameIdRef.current && result && analysis) {
        const gameMoves = moves.map(m => m.san);
        const opening = classifyOpening(gameMoves);
        const moments = extractKeyMoments(analysis, moveRecs, playerName || undefined);

        // Build key moments text for the summary
        const momentLines = moments.map(m => {
          if (m.type === 'blunder') return `Biggest blunder: ${m.moveSan} on move ${m.moveNumber} (${m.description})`;
          if (m.type === 'mistake') return `Mistake: ${m.moveSan} on move ${m.moveNumber} (${m.description})`;
          if (m.type === 'best-move') return `Best move: ${m.moveSan} on move ${m.moveNumber} (${m.description})`;
          if (m.type === 'turning-point') return `Turning point: move ${m.moveNumber} (${m.description})`;
          return '';
        }).filter(Boolean);

        // Opening book detection
        const bookResult = detectOpeningBook(gameMoves, playerColor);
        const deviationText = bookResult.found && bookResult.deviationMoveNumber > 0
          ? `Left ${bookResult.openingName} book at move ${bookResult.deviationMoveNumber}, playing ${bookResult.playerMoveSan} instead of ${bookResult.bookMoveSan}.`
          : '';

        fetch('/api/honcho', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'log_summary',
            gameId: honchoGameIdRef.current,
            userId: user.id,
            summary: {
              result,
              moveCount: moves.length,
              openingName: opening?.name ?? null,
              openingEco: opening?.eco ?? null,
              color: playerColor,
              blunders: analysis.blunders,
              mistakes: analysis.mistakes,
              brilliantMoves: analysis.brilliantMoves,
              playerAccuracy: analysis.playerAccuracy,
              primaryWeakness: momentLines.length > 0 ? momentLines.join('. ') : null,
              deviation: deviationText || null,
              phase: {
                opening: analysis.blunders === 0 ? 'solid' : 'shaky',
                middlegame: analysis.playerAccuracy > 70 ? 'solid' : 'weak',
                endgame: moves.length > 40 ? 'reached' : 'not reached',
              },
            },
          }),
        }).then(r => {
          console.log(`[Honcho] Summary logged: ${r.ok ? 'ok' : 'failed'} — ${result} in ${moves.length} moves, accuracy ${Math.round(analysis.playerAccuracy)}%`);
        }).catch(err => {
          console.error('[Honcho] Summary log failed:', err);
        });
      }

      // Generate Rookie's post-game summary with full analysis data
      if (analysis && result) {
        const rookieWon = result === 'loss';
        const gameSummary = {
          result,
          moveCount: moves.length,
          openingName: classifyOpening(moves.map(m => m.san))?.name ?? null,
          blunders: analysis.blunders,
          mistakes: analysis.mistakes,
          brilliantMoves: analysis.brilliantMoves,
          keyMoments: extractKeyMoments(analysis, moves.map(m => ({ san: m.san, movedBy: m.movedBy, moveNumber: m.moveNumber, fenAfter: m.fenAfter, from: m.from, to: m.to })), playerName || undefined)
            .map(m => `${m.type}: ${m.moveSan} on move ${m.moveNumber}`)
            .join('. ') || undefined,
        };
        speech.onPostGame(analysis.playerAccuracy, rookieWon, gameSummary);
      }
    }

    // Save to DB if logged in
    const session = sessionRef.current;
    if (session) {
      session.end(result, method).catch(console.error);
      sessionRef.current = null;
    }

    // Save speech memory (fact extraction + line drain)
    if (user?.id && result) {
      const mem = rookieMemoryRef.current;

      const newFacts = extractFacts({
        result,
        resultMethod: method,
        playerColor,
        moves,
        analysis,
        gamesPlayed: mem.gamesPlayed,
        totalWins: mem.totalWins,
      });

      const updatedMemory = updateRookieMemoryContext(mem, {
        usedRecently: speech.getUsedRecently(),
        playerFacts: [...mem.playerFacts, ...newFacts].slice(-20),
        gamesPlayed: mem.gamesPlayed + 1,
        totalWins: mem.totalWins + (result === 'win' ? 1 : 0),
        totalLosses: mem.totalLosses + (result === 'loss' ? 1 : 0),
        totalDraws: mem.totalDraws + (result === 'draw' ? 1 : 0),
      });
      rookieMemoryRef.current = updatedMemory;
      setRookieMemory(updatedMemory);
      saveSpeechMemory(user.id, toSpeechMemory(updatedMemory));
    }
  }, [playerColor, postGame, speech, user?.id]);

  // ════════════════════════════════
  // ROOKIE'S TURN
  // ════════════════════════════════
  // Wait for Rookie to finish speaking before moving (Dr. Wolf style)
  const waitForSpeech = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const check = () => {
        if (!isTalkingRef.current) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }, [isTalkingRef]);

  const scheduleRookieMove = useCallback((currentFen: string) => {
    setRookieThinking(true);

    const applyRookieMove = async (moveInfo: { from: string; to: string; promotion?: string } | { san: string }) => {
      // Rookie moves while still talking — game flows naturally
      const g = new Chess(currentFen);
      const result = 'san' in moveInfo
        ? g.move(moveInfo.san)
        : g.move({ from: moveInfo.from as Square, to: moveInfo.to as Square, promotion: (moveInfo.promotion || 'q') as 'q' | 'r' | 'b' | 'n' });
      if (!result) { setRookieThinking(false); return; }

      moveNumRef.current++;
      lastMovedByRef.current = 'rookie';
      const newFen = g.fen();

      setFen(newFen);
      setLastMv({ from: result.from as Square, to: result.to as Square });
      setSelected(null);
      setRookieThinking(false);

      if (result.captured) playCaptureSound();
      else playMoveSound();

      log({
        moveNum: moveNumRef.current,
        type: 'move',
        who: 'rookie',
        summary: `${result.san}${result.captured ? ' captures ' + PIECE_NAMES[result.captured] : ''}${g.isCheck() ? ' +' : ''}`,
        details: { san: result.san, from: result.from, to: result.to, captured: result.captured || null },
      });

      // Update eval bar
      updateEval(newFen);

      const speechInput = {
        moveNumber: moveNumRef.current,
        rookieWinPercent: moodSystem.getRookieWinPercent(),
        prevRookieWinPercent: moodSystem.getPrevRookieWinPercent(),
        isGameOver: g.isGameOver(),
        piecesRemaining: countPieces(newFen),
        movedBy: 'rookie' as const,
        event: toGameEvent(g, result),
        playerName: playerName || 'friend',
        playerColor,
        capturedPiece: result.captured ? PIECE_NAMES[result.captured] : undefined,
        capturedPieceValue: result.captured ? PIECE_VALUES[result.captured] : undefined,
        movedPiece: PIECE_NAMES[result.piece],
      };
      // Suppress old quip system during opening book — narrative engine handles it
      if (!narrative.isInBook()) speech.onMove(speechInput);
      log({
        moveNum: moveNumRef.current,
        type: 'speech',
        who: 'rookie',
        summary: `onMove event=${speechInput.event} rookieWp=${speechInput.rookieWinPercent.toFixed(1)}%`,
        details: { event: speechInput.event, rookieWinPercent: speechInput.rookieWinPercent, capturedPiece: speechInput.capturedPiece || null },
      });

      updateMood(g, 'rookie');
      recordMoveToSession(g, result, 'rookie', currentFen);

      // Run 6-layer narrative engine (async, non-blocking)
      processNarrative(g, result, 'rookie', newFen);

      if (g.isGameOver()) {
        const resultText = g.isCheckmate()
          ? ((g.turn() === 'w' && playerColor === 'white') || (g.turn() === 'b' && playerColor === 'black') ? 'Rookie wins by checkmate' : 'Player wins by checkmate')
          : g.isStalemate() ? 'Stalemate' : 'Draw';
        log({ moveNum: moveNumRef.current, type: 'game-event', who: 'system', summary: resultText, details: {} });
        if (g.isCheckmate()) {
          const loser = g.turn();
          const iLost = (loser === 'w' && playerColor === 'white') || (loser === 'b' && playerColor === 'black');
          setGameResult(iLost ? 'Rookie wins!' : 'You win!');
          if (!iLost) playCelebrationSound();
        } else {
          setGameResult(g.isStalemate() ? 'Stalemate!' : 'Draw!');
        }
        endSession(g);
        setPhase('gameover');
      }
    };

    // Beginner range (< 0.5) uses minimax, others use Stockfish
    if (skillLevel < 0.5 || !sfReadyRef.current) {
      log({ moveNum: moveNumRef.current, type: 'engine', who: 'system', summary: `minimax (skill=${Math.round(skillLevel)})`, details: { engine: 'minimax', skillLevel } });
      const result = getRookieMove(currentFen, Math.round(skillLevel));
      if (!result) { setRookieThinking(false); return; }
      rookieTimerRef.current = setTimeout(() => {
        applyRookieMove({ san: result.san });
      }, 500);
      return;
    }

    const [sfSkill, sfDepth] = interpolateSfConfig(skillLevel);
    log({ moveNum: moveNumRef.current, type: 'engine', who: 'system', summary: `stockfish (skill=${sfSkill}, depth=${sfDepth})`, details: { engine: 'stockfish', sfSkill, sfDepth, skillLevel } });
    const thinkStart = Date.now();
    stockfish.getBestMove(currentFen, sfSkill, sfDepth).then((uciMove) => {
      if (!uciMove) {
        const result = getRookieMove(currentFen, skillLevel);
        if (!result) { setRookieThinking(false); return; }
        const wait = Math.max(0, 500 - (Date.now() - thinkStart));
        rookieTimerRef.current = setTimeout(() => applyRookieMove({ san: result.san }), wait);
        return;
      }
      const from = uciMove.slice(0, 2);
      const to = uciMove.slice(2, 4);
      const promotion = uciMove.length > 4 ? uciMove[4] : undefined;
      const wait = Math.max(0, 500 - (Date.now() - thinkStart));
      rookieTimerRef.current = setTimeout(() => applyRookieMove({ from, to, promotion }), wait);
    });
  }, [skillLevel, playerName, playerColor, speech, updateMood, recordMoveToSession, endSession, updateEval, waitForSpeech, processNarrative, log]);

  // ════════════════════════════════
  // PLAYER'S MOVE
  // ════════════════════════════════
  const doPlayerMove = useCallback((from: Square, to: Square): boolean => {
    const g = new Chess(fen);
    const turn = g.turn();
    const myTurn = (turn === 'w' && playerColor === 'white') || (turn === 'b' && playerColor === 'black');
    if (!myTurn) return false;

    try {
      const result = g.move({ from, to, promotion: 'q' });
      if (!result) return false;

      moveNumRef.current++;
      lastMovedByRef.current = 'player';
      const newFen = g.fen();

      setFen(newFen);
      setLastMv({ from, to });
      setSelected(null);

      if (result.captured) playCaptureSound();
      else playMoveSound();

      log({
        moveNum: moveNumRef.current,
        type: 'move',
        who: 'player',
        summary: `${result.san}${result.captured ? ' captures ' + PIECE_NAMES[result.captured] : ''}${g.isCheck() ? ' +' : ''}`,
        details: { san: result.san, from, to, captured: result.captured || null },
      });

      // Update eval bar
      updateEval(newFen);

      const speechInput = {
        moveNumber: moveNumRef.current,
        rookieWinPercent: moodSystem.getRookieWinPercent(),
        prevRookieWinPercent: moodSystem.getPrevRookieWinPercent(),
        isGameOver: g.isGameOver(),
        piecesRemaining: countPieces(newFen),
        movedBy: 'player' as const,
        event: toGameEvent(g, result),
        playerName: playerName || 'friend',
        playerColor,
        capturedPiece: result.captured ? PIECE_NAMES[result.captured] : undefined,
        capturedPieceValue: result.captured ? PIECE_VALUES[result.captured] : undefined,
        movedPiece: PIECE_NAMES[result.piece],
      };
      // Suppress old quip system during opening book — narrative engine handles it
      if (!narrative.isInBook()) speech.onMove(speechInput);
      log({
        moveNum: moveNumRef.current,
        type: 'speech',
        who: 'player',
        summary: `onMove event=${speechInput.event} rookieWp=${speechInput.rookieWinPercent.toFixed(1)}%`,
        details: { event: speechInput.event, rookieWinPercent: speechInput.rookieWinPercent, capturedPiece: speechInput.capturedPiece || null },
      });

      updateMood(g, 'player');
      recordMoveToSession(g, result, 'player', fen);

      // Run 6-layer narrative engine (async, non-blocking for authored quips)
      processNarrative(g, result, 'player', newFen);

      if (g.isGameOver()) {
        const resultText = g.isCheckmate()
          ? ((g.turn() === 'w' && playerColor === 'white') || (g.turn() === 'b' && playerColor === 'black') ? 'Rookie wins by checkmate' : 'Player wins by checkmate')
          : g.isStalemate() ? 'Stalemate' : 'Draw';
        log({ moveNum: moveNumRef.current, type: 'game-event', who: 'system', summary: resultText, details: {} });
        if (g.isCheckmate()) {
          const loser = g.turn();
          const iLost = (loser === 'w' && playerColor === 'white') || (loser === 'b' && playerColor === 'black');
          setGameResult(iLost ? 'Rookie wins!' : 'You win!');
          if (!iLost) playCelebrationSound();
        } else {
          setGameResult(g.isStalemate() ? 'Stalemate!' : 'Draw!');
        }
        endSession(g);
        setPhase('gameover');
        return true;
      }

      setTimeout(() => scheduleRookieMove(newFen), ANIM_MS + 150);
      return true;
    } catch {
      return false;
    }
  }, [fen, playerColor, playerName, speech, scheduleRookieMove, updateMood, recordMoveToSession, endSession, updateEval, processNarrative, log]);

  // ════════════════════════════════
  // CLICK TO MOVE
  // ════════════════════════════════
  const onClickSquare = useCallback((square: Square) => {
    if (phase !== 'playing' || rookieThinking) return;
    const g = new Chess(fen);
    const turn = g.turn();
    const myTurn = (turn === 'w' && playerColor === 'white') || (turn === 'b' && playerColor === 'black');
    if (!myTurn) return;

    const ownColor = playerColor === 'white' ? 'w' : 'b';

    if (selected) {
      const ok = doPlayerMove(selected, square);
      if (!ok) {
        const pc = g.get(square);
        setSelected(pc && pc.color === ownColor ? square : null);
      }
    } else {
      const pc = g.get(square);
      if (pc && pc.color === ownColor) setSelected(square);
    }
  }, [phase, rookieThinking, fen, playerColor, selected, doPlayerMove]);

  // Kick off Rookie's first move if player is black
  useEffect(() => {
    if (phase === 'playing' && playerColor === 'black') {
      scheduleRookieMove(fen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ════════════════════════════════
  // REVIEW MODE — game navigation
  // ════════════════════════════════
  /** Update eval bar from stored position evals (index 0 = start, index N = after move N-1) */
  const updateEvalBarForPosition = useCallback((positionIndex: number) => {
    const evals = positionEvalsRef.current;
    if (positionIndex < 0 || positionIndex >= evals.length) return;
    const ev = evals[positionIndex];
    evalCp.current = ev.cp ?? 0;
    evalMate.current = ev.mate;
    setEvalPct(evalToWhitePercent(ev.cp, ev.mate));
  }, []);

  const navigateToMove = useCallback((index: number) => {
    const moves = moveLogRef.current;
    if (index < 0) {
      // Before first move — show starting position
      setReviewMoveIndex(-1);
      setFen(START_FEN);
      setLastMv(null);
      setReviewArrows([]);
      setReviewText('Starting position');
      updateEvalBarForPosition(0);
      return;
    }
    if (index >= moves.length) index = moves.length - 1;
    setReviewMoveIndex(index);

    const move = moves[index];
    setFen(move.fenAfter);
    setLastMv({ from: move.from as Square, to: move.to as Square });

    // Update eval bar from stored evals (position after this move = index + 1)
    updateEvalBarForPosition(index + 1);

    // Check if this move corresponds to a key moment
    const moment = keyMoments.find(m => m.moveNumber === move.moveNumber && m.movedBy === move.movedBy);
    if (moment) {
      setReviewText(moment.description);
      setReviewArrows([{
        startSquare: moment.from,
        endSquare: moment.to,
        color: getArrowColor(moment.type),
      }]);
      const mIdx = keyMoments.indexOf(moment);
      if (mIdx >= 0) setReviewMomentIndex(mIdx);
      return;
    }

    // Regular move — just show SAN
    const moveLabel = move.movedBy === 'player' ? (playerName || 'You') : 'Rookie';
    setReviewText(`${moveLabel} played ${move.san}`);
    setReviewArrows([]);
  }, [keyMoments, playerName, updateEvalBarForPosition]);

  const jumpToMoment = useCallback((moment: KeyMoment, momentIdx: number) => {
    setReviewMomentIndex(momentIdx);
    const moves = moveLogRef.current;
    const moveIdx = moves.findIndex(m => m.moveNumber === moment.moveNumber && m.movedBy === moment.movedBy);

    setFen(moment.fenBefore);
    if (moveIdx >= 0) {
      setReviewMoveIndex(moveIdx);
      setLastMv(null);
      updateEvalBarForPosition(moveIdx);
    }
    setReviewText(moment.description);
    setReviewArrows([{
      startSquare: moment.from,
      endSquare: moment.to,
      color: getArrowColor(moment.type),
    }]);
  }, [updateEvalBarForPosition]);

  // ════════════════════════════════
  // SQUARE STYLES
  // ════════════════════════════════
  const sqStyles = useMemo(() => {
    const s: Record<string, React.CSSProperties> = {};
    if (lastMv) {
      s[lastMv.from] = { background: 'rgba(255, 170, 0, 0.4)' };
      s[lastMv.to] = { background: 'rgba(255, 170, 0, 0.4)' };
    }
    if (game.isCheck()) {
      const board = game.board();
      const kingColor = game.turn();
      for (const row of board) {
        for (const sq of row) {
          if (sq && sq.type === 'k' && sq.color === kingColor) {
            s[sq.square] = {
              ...s[sq.square],
              background: 'radial-gradient(ellipse at center, rgba(255, 0, 0, 0.8) 0%, rgba(255, 0, 0, 0.35) 40%, rgba(255, 0, 0, 0) 70%)',
            };
          }
        }
      }
    }
    if (selected) {
      s[selected] = { ...s[selected], background: 'rgba(20, 85, 200, 0.5)' };
      const g = new Chess(fen);
      for (const m of g.moves({ square: selected, verbose: true })) {
        const has = g.get(m.to as Square);
        s[m.to] = {
          ...s[m.to],
          background: has
            ? 'radial-gradient(transparent 55%, rgba(20, 85, 200, 0.4) 55%)'
            : 'radial-gradient(rgba(20, 85, 200, 0.5) 22%, transparent 22%)',
        };
      }
    }
    return s;
  }, [fen, game, lastMv, selected]);

  // ════════════════════════════════
  // START GAME
  // ════════════════════════════════
  const startGame = () => {
    warmupAudio();
    speech.reset();
    if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
    moveNumRef.current = 0;
    moveLogRef.current = [];
    setFen(START_FEN);
    setLastMv(null);
    setSelected(null);
    setGameResult(null);
    setRookieThinking(false);
    setResignArmed(false);
    moodSystem.reset();
    setEvalPct(50);
    setKeyMoments([]);
    setReviewMoveIndex(0);
    setReviewMomentIndex(0);
    setReviewText(null);
    setReviewArrows([]);
    postGame.cancel(); // cancel any in-flight analysis
    setCoachingScript(null);
    setShowCoaching(false);
    moodSystem.reset(); // reset mood tracking for new game
    // Seed with starting position eval (0cp = equal)
    positionEvalsRef.current = [{ cp: 0, mate: null, bestMove: null, bestLine: [], depth: 0 }];

    // Clear debug log
    setDebugLog([]);
    debugIdCounter = 0;

    // Start session tracking (only for logged-in users)
    if (user?.id) {
      const session = new GameSession('play-rookie', user.id);
      session.setGameInfo({ playerColor, rookieDifficulty: skillLevel });
      sessionRef.current = session;
    }
    moveStartRef.current = Date.now();

    speech.onGameStart(playerColor, playerName || 'friend');
    narrative.resetForNewGame();
    narrative.setMemoryContext(rookieMemoryRef.current);
    honchoOpeningLoggedRef.current = false;

    // Use pre-fetched Honcho context (loaded on page mount) for narrative + opening line
    log({ moveNum: 0, type: 'game-event', who: 'system', summary: `[Honcho] user=${user?.id ? 'logged-in' : 'anonymous'}, context=${rookieMemoryRef.current.honchoSummary ? 'ready' : 'none'}`, details: { userId: user?.id ?? null, hasContext: !!rookieMemoryRef.current.honchoSummary } });

    // Honcho: create session for logging (context was pre-fetched on page load)
    if (user?.id) {
      const gameId = `game-${Date.now()}`;
      honchoGameIdRef.current = gameId;
      fetch('/api/honcho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start_session', gameId, userId: user.id }),
      }).then(res => {
        log({ moveNum: 0, type: 'game-event', who: 'system', summary: `[Honcho] session=${res.ok ? 'ok' : 'failed'}`, details: {} });
      }).catch((err) => {
        log({ moveNum: 0, type: 'game-event', who: 'system', summary: `[Honcho] session FAILED: ${err?.message || err}`, details: {} });
      });

      // Seed peer card on first game so Honcho has grounding context
      const gamesPlayed = rookieMemoryRef.current.gamesPlayed;
      if (gamesPlayed === 0) {
        const eloMap = [400, 800, 1200, 1600, 2000];
        fetch('/api/honcho', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'seed_card',
            userId: user.id,
            profile: {
              estimatedElo: eloMap[Math.round(skillLevel)] ?? 800,
              colorPreference: playerColor,
              experience: SKILL_LEVELS[Math.round(skillLevel)]?.name ?? 'Casual',
            },
          }),
        }).catch(() => {});
      }
    }
    log({ moveNum: 0, type: 'speech', who: 'system', summary: `onGameStart color=${playerColor} name=${playerName || 'friend'}`, details: { playerColor, playerName: playerName || 'friend' } });

    setPhase('playing');
  };

  const handleResign = useCallback(() => {
    if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
    setRookieThinking(false);
    setGameResult('You resigned');
    // Let Rookie react to the resignation
    speech.onMove({
      moveNumber: moveNumRef.current,
      rookieWinPercent: moodSystem.getRookieWinPercent(),
      prevRookieWinPercent: moodSystem.getPrevRookieWinPercent(),
      isGameOver: true,
      piecesRemaining: countPieces(fen),
      movedBy: 'player',
      event: 'resign',
      playerName: playerName || 'friend',
      playerColor,
    });
    const g = new Chess(fen);
    endSession(g);
    setPhase('gameover');
    setResignArmed(false);
  }, [fen, endSession, speech, playerName, playerColor]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
    };
  }, []);

  // ════════════════════════════════
  // PLAYER NAME DISPLAY (Candidates video style)
  // ════════════════════════════════
  const displayName = playerName || 'You';
  const playerIsWhite = playerColor === 'white';

  const PlayerLabel = ({ color, name }: { color: 'white' | 'black'; name: string }) => (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: color === 'white' ? '#e8e8e8' : '#2A3C45' }}
      />
      <span className="text-[10px] font-bold text-chess-text">{name}</span>
    </div>
  );

  // ════════════════════════════════
  // EVAL BAR (Candidates video style — horizontal with eval number inside)
  // ════════════════════════════════
  const EvalBar = () => {
    const cp = evalCp.current;
    const mate = evalMate.current;
    const isWhiteAdvantage = mate !== null ? mate > 0 : cp >= 0;
    const displayEval = mate !== null
      ? 'M' + Math.abs(mate)
      : (Math.abs(cp) / 100).toFixed(1);
    const showEval = mate !== null || Math.abs(cp) > 10;

    return (
      <div className="flex h-4 w-full items-stretch overflow-hidden rounded">
        {/* White section */}
        <div
          className="relative flex items-center justify-end pr-1.5 transition-all duration-500 ease-out"
          style={{ width: `${evalPct}%`, backgroundColor: '#e8e8e8' }}
        >
          {isWhiteAdvantage && showEval && (
            <span className="text-[8px] font-bold text-neutral-800">+{displayEval}</span>
          )}
        </div>
        {/* Black section */}
        <div
          className="relative flex items-center pl-1.5 transition-all duration-500 ease-out"
          style={{ width: `${100 - evalPct}%`, backgroundColor: '#2A3C45' }}
        >
          {!isWhiteAdvantage && showEval && (
            <span className="text-[8px] font-bold text-white">+{displayEval}</span>
          )}
        </div>
      </div>
    );
  };

  // ════════════════════════════════
  // REVIEW NAVIGATION
  // ════════════════════════════════
  const ReviewNav = () => {
    const totalMoves = moveLogRef.current.length;
    return (
      <div className="flex items-center justify-center gap-2 py-1">
        <button
          onClick={() => navigateToMove(-1)}
          disabled={reviewMoveIndex <= -1}
          className="w-10 h-10 rounded-xl bg-chess-surface border border-chess-disabled text-chess-text font-bold text-sm flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all"
        >
          |&#9665;
        </button>
        <button
          onClick={() => navigateToMove(reviewMoveIndex - 1)}
          disabled={reviewMoveIndex <= -1}
          className="w-10 h-10 rounded-xl bg-chess-surface border border-chess-disabled text-chess-text font-bold text-sm flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all"
        >
          &#9665;
        </button>
        <span className="text-xs text-chess-text-muted font-medium w-16 text-center">
          {reviewMoveIndex + 1} / {totalMoves}
        </span>
        <button
          onClick={() => navigateToMove(reviewMoveIndex + 1)}
          disabled={reviewMoveIndex >= totalMoves - 1}
          className="w-10 h-10 rounded-xl bg-chess-surface border border-chess-disabled text-chess-text font-bold text-sm flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all"
        >
          &#9655;
        </button>
        <button
          onClick={() => navigateToMove(totalMoves - 1)}
          disabled={reviewMoveIndex >= totalMoves - 1}
          className="w-10 h-10 rounded-xl bg-chess-surface border border-chess-disabled text-chess-text font-bold text-sm flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all"
        >
          &#9655;|
        </button>
      </div>
    );
  };

  // ════════════════════════════════
  // SETUP SCREEN
  // ════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="h-[100dvh] bg-chess-page text-chess-text flex flex-col items-center justify-center px-6 overflow-auto">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col items-center gap-3">
            <BreathingRook size="lg" />
            <h1 className="text-xl font-black">Play Against Rookie</h1>
            <p className="text-chess-text-muted text-sm text-center">
              All the chess. None of the bedside manner.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-chess-text-muted uppercase tracking-wide mb-1 block">
              What should I call you?
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name (or I'll just say 'friend')"
              className="w-full px-4 py-3 rounded-xl bg-chess-surface border border-chess-disabled text-chess-text placeholder:text-chess-text-faint focus:outline-none focus:ring-2 focus:ring-chess-green"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-chess-text-muted uppercase tracking-wide mb-2 block">
              Pick your color
            </label>
            <div className="flex gap-3">
              {(['white', 'black'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setPlayerColor(c)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    playerColor === c
                      ? c === 'white'
                        ? 'bg-white text-gray-900 ring-2 ring-chess-green shadow-lg'
                        : 'bg-gray-800 text-white ring-2 ring-chess-green shadow-lg'
                      : 'bg-chess-surface text-chess-text border border-chess-disabled'
                  }`}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-chess-text-muted uppercase tracking-wide mb-3 block">
              Rookie&apos;s strength
            </label>
            <SkillSlider value={skillLevel} onChange={setSkillLevel} />
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-chess-green text-white font-bold rounded-xl text-lg shadow-[0_4px_0_var(--color-chess-green-dark)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-chess-green-dark)] transition-all"
          >
            Let&apos;s Play
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════
  // ANALYSIS SUMMARY — move classification + accuracy
  // ════════════════════════════════
  const AnalysisSummary = ({ analysis }: { analysis: GameAnalysis }) => {
    const acc = Math.round(analysis.playerAccuracy);
    const accColor = acc >= 80 ? 'text-chess-green' : acc >= 60 ? 'text-amber-400' : 'text-red-400';

    return (
      <div className="bg-chess-surface rounded-xl px-3 py-2 text-left space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-chess-text-muted">Your Accuracy</span>
          <span className={`text-lg font-black ${accColor}`}>{acc}%</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold">
          {analysis.brilliantMoves > 0 && (
            <span className="text-cyan-400">{analysis.brilliantMoves} brilliant</span>
          )}
          {analysis.greatMoves > 0 && (
            <span className="text-chess-green">{analysis.greatMoves} great</span>
          )}
          {analysis.inaccuracies > 0 && (
            <span className="text-amber-400">{analysis.inaccuracies} inaccuracy</span>
          )}
          {analysis.mistakes > 0 && (
            <span className="text-orange-400">{analysis.mistakes} mistake</span>
          )}
          {analysis.blunders > 0 && (
            <span className="text-red-400">{analysis.blunders} blunder</span>
          )}
        </div>
      </div>
    );
  };

  // ════════════════════════════════
  // GAME SCREEN (playing, gameover, review)
  // ════════════════════════════════
  const isReview = phase === 'review';

  return (
    <div className="h-[100dvh] bg-chess-page text-chess-text flex flex-col">
      {/* Spacer for status bar */}
      <div className="h-2 flex-shrink-0" />

      {/* Board area */}
      <div className="flex-1 flex items-start justify-center px-4 pt-2 min-h-0">
        <div className="w-full max-w-lg">

          {/* Above board: Rookie always in same spot, content changes by phase */}
          {isReview ? (
            <div className="mb-2">
              <div className="bg-chess-surface rounded-2xl px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]">
                <p className="text-chess-text text-[13px] leading-relaxed font-medium min-h-[2em]">
                  {reviewText || 'Use the arrows below to step through the game.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 pb-2 min-h-[72px] relative z-10 overflow-visible">
              <div className="flex-shrink-0 pt-0.5">
                <BreathingRook
                  size="sm"
                  animation={phase === 'playing' && rookieThinking ? 'think' : undefined}
                  animate={phase === 'playing' && !rookieThinking && !isTalking}
                  mood={rookieMood}
                  alarmVariant={rookieAlarm}
                  talkIntensity={phase === 'playing' && isTalking && !rookieThinking ? talkIntensity : undefined}
                />
              </div>
              <div className="flex-1 min-w-0">
                {phase === 'gameover' && gameResult ? (
                  <div className="space-y-1.5">
                    <p className="text-sm font-black leading-tight">{gameResult}</p>
                    {postGame.isAnalyzing ? (
                      <div className="h-1 w-full bg-chess-surface rounded-full overflow-hidden">
                        <div className="h-full bg-chess-green rounded-full transition-all duration-300" style={{ width: `${postGame.progress}%` }} />
                      </div>
                    ) : postGame.analysis ? (
                      <AnalysisSummary analysis={postGame.analysis} />
                    ) : null}
                    <div className="flex gap-2">
                      <button
                        onClick={() => startGame()}
                        className="flex-1 py-1.5 bg-chess-green text-white font-bold rounded-lg text-xs"
                      >
                        Play Again
                      </button>
                      {coachingScript && coachingScript.messages.length > 0 && (
                        <button
                          onClick={() => setShowCoaching(true)}
                          className="flex-1 py-1.5 bg-chess-surface text-chess-text font-semibold rounded-lg text-xs border border-chess-disabled"
                        >
                          Rookie&apos;s Take
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (keyMoments.length > 0) {
                            const m = keyMoments[0];
                            setReviewMomentIndex(0);
                            setReviewMoveIndex(0);
                            setFen(m.fenBefore);
                            setReviewText(m.description);
                            setReviewArrows([{
                              startSquare: m.from,
                              endSquare: m.to,
                              color: getArrowColor(m.type),
                            }]);
                          } else {
                            setReviewMoveIndex(0);
                            setReviewText('Use the arrows to step through the game.');
                          }
                          setPhase('review');
                        }}
                        className="flex-1 py-1.5 bg-chess-surface text-chess-text font-semibold rounded-lg text-xs border border-chess-disabled"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ) : speech.displayText ? (
                  <div key={speech.msgKey} className="relative rookie-glitch">
                    <div
                      className="absolute top-3 -left-[6px] w-2.5 h-2.5 bg-chess-surface rotate-45 rounded-[2px]"
                      style={{ boxShadow: '-1px 1px 2px rgba(0,0,0,0.04)' }}
                    />
                    <div className="relative bg-chess-surface rounded-xl px-3 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]">
                      <p className="text-chess-text text-[13px] leading-relaxed font-medium glitch-text line-clamp-3">
                        {speech.displayText}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Top player (opponent from our perspective) */}
          <div className="flex justify-between items-center mb-0.5">
            <PlayerLabel
              color={playerIsWhite ? 'black' : 'white'}
              name="Rookie"
            />
          </div>

          {/* Chess board */}
          <ChessPathBoard
            options={{
              position: fen,
              boardOrientation: playerColor,
              onPieceDrop: isReview ? undefined : ((args: any) => {
                if (rookieThinking) return false;
                return doPlayerMove(args.sourceSquare as Square, args.targetSquare as Square);
              }) as any,
              onSquareClick: isReview ? undefined : ((args: any) => onClickSquare(args.square as Square)) as any,
              squareStyles: sqStyles,
              animationDurationInMs: ANIM_MS,
              ...(isReview && reviewArrows.length > 0 ? { arrows: reviewArrows } : {}),
            }}
          />

          {/* Below board area */}
          <div className="mt-0.5 space-y-1">
            {/* Bottom player (us) */}
            <div className="flex justify-between items-center">
              <PlayerLabel
                color={playerIsWhite ? 'white' : 'black'}
                name={displayName}
              />
            </div>

            {/* Eval bar — only visible during review (eval still runs during play for Rookie mood) */}
            {phase === 'review' && <EvalBar />}

            {/* Phase-specific content */}
            {phase === 'playing' && isMyTurn && !rookieThinking ? (
              <div className="flex items-center justify-between h-5">
                <div className="w-14" />
                <p className="text-xs font-semibold text-chess-green">Your move</p>
                <button
                  onClick={() => {
                    if (resignArmed) handleResign();
                    else setResignArmed(true);
                  }}
                  onBlur={() => setResignArmed(false)}
                  className={`text-xs font-semibold px-2 py-0.5 rounded transition-all ${
                    resignArmed
                      ? 'bg-red-500 text-white'
                      : 'text-chess-text-faint hover:text-chess-text-muted'
                  }`}
                >
                  {resignArmed ? 'Tap to resign' : 'Resign'}
                </button>
              </div>
            ) : phase === 'playing' && rookieThinking ? (
              <p className="text-xs font-medium text-chess-text-faint text-center h-5">Rookie is thinking...</p>
            ) : phase === 'gameover' ? (
              <div className="h-5" />
            ) : phase === 'review' ? (
              <div className="space-y-2">
                <ReviewNav />
                {keyMoments.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {keyMoments.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => jumpToMoment(m, i)}
                        className={`flex-1 min-w-0 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                          reviewMomentIndex === i
                            ? m.type === 'blunder' || m.type === 'mistake'
                              ? 'bg-red-500/15 border-2 border-red-500/40 text-red-400'
                              : m.type === 'turning-point'
                                ? 'bg-amber-500/15 border-2 border-amber-500/40 text-amber-400'
                                : 'bg-chess-green/15 border-2 border-chess-green text-chess-green'
                            : 'bg-chess-surface border border-chess-disabled text-chess-text-muted'
                        }`}
                      >
                        <div className="truncate">{m.title}</div>
                        <div className="text-[10px] opacity-70">Move {m.moveNumber}</div>
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => startGame()}
                  className="w-full py-2 bg-chess-green text-white font-bold rounded-xl text-sm"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <div className="h-5" />
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════ */}
      {/* DEBUG LOG PANEL */}
      {/* ════════════════════════════════ */}
      <div className="flex-shrink-0 border-t border-chess-disabled">
        <button
          onClick={() => setDebugOpen(!debugOpen)}
          className="w-full px-4 py-2 flex items-center justify-between text-xs font-mono text-chess-text-muted hover:bg-chess-surface transition-colors"
        >
          <span>Debug Log ({debugLog.length} entries)</span>
          <span>{debugOpen ? 'Hide' : 'Show'}</span>
        </button>

        {debugOpen && (
          <div className="max-h-[40vh] overflow-auto bg-[#0d1117] text-[11px] font-mono leading-relaxed">
            <div className="sticky top-0 z-10 bg-[#0d1117] border-b border-gray-800 px-4 py-1.5 flex justify-end">
              <button
                onClick={() => {
                  const text = debugLog.map(e => {
                    const details = Object.entries(e.details).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(' ');
                    return `#${e.moveNum} [${e.type}] ${e.who} | ${e.summary}${details ? '\n  ' + details : ''}`;
                  }).join('\n');
                  navigator.clipboard.writeText(text);
                }}
                className="px-2 py-0.5 text-[10px] text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
              >
                Copy Log
              </button>
            </div>
            {debugLog.length === 0 && (
              <div className="px-4 py-3 text-gray-500">No events yet. Make a move...</div>
            )}
            {debugLog.map((entry) => {
              const colors: Record<string, string> = {
                move: 'text-blue-400',
                mood: 'text-yellow-400',
                quip: 'text-green-400',
                engine: 'text-purple-400',
                eval: 'text-cyan-400',
                speech: 'text-orange-400',
                'game-event': 'text-red-400',
              };
              const whoColors: Record<string, string> = {
                player: 'text-cyan-300',
                rookie: 'text-orange-300',
                system: 'text-gray-400',
              };
              return (
                <div key={entry.id} className="px-4 py-1.5 border-b border-gray-800 hover:bg-gray-800/50">
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-600 w-6 text-right flex-shrink-0">#{entry.moveNum}</span>
                    <span className={`font-semibold ${colors[entry.type] || 'text-gray-400'}`}>
                      [{entry.type}]
                    </span>
                    <span className={whoColors[entry.who] || 'text-gray-400'}>
                      {entry.who}
                    </span>
                    <span className="text-gray-200">{entry.summary}</span>
                  </div>
                  {Object.keys(entry.details).length > 0 && (
                    <div className="ml-8 mt-0.5 text-gray-500">
                      {Object.entries(entry.details).map(([k, v]) => (
                        <span key={k} className="mr-3">
                          <span className="text-gray-600">{k}=</span>
                          <span className="text-gray-400">{JSON.stringify(v)}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={debugEndRef} />
          </div>
        )}
      </div>

      <div className="pb-[env(safe-area-inset-bottom)] flex-shrink-0" />

      <style>{`
        .rookie-glitch {
          animation: glitchIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes glitchIn {
          0% { opacity: 0; transform: translateX(-8px) skewX(-4deg); }
          15% { opacity: 1; transform: translateX(3px) skewX(2deg); filter: hue-rotate(90deg); }
          30% { transform: translateX(-2px) skewX(-1deg); filter: hue-rotate(-60deg); }
          45% { transform: translateX(1px) skewX(0.5deg); filter: hue-rotate(30deg); }
          60% { transform: translateX(0) skewX(0); filter: hue-rotate(0deg); }
          100% { opacity: 1; transform: translateX(0) skewX(0); filter: none; }
        }
        .rookie-glitch .glitch-text {
          animation: glitchShadow 0.5s steps(3, end) both;
        }
        @keyframes glitchShadow {
          0%, 60% { text-shadow: -2px 0 #58CC02, 2px 0 #1CB0F6; }
          70% { text-shadow: 1px 0 #58CC02, -1px 0 #1CB0F6; }
          80% { text-shadow: -0.5px 0 #58CC02, 0.5px 0 #1CB0F6; }
          100% { text-shadow: none; }
        }
      `}</style>

      {/* Coaching Drawer */}
      {showCoaching && coachingScript && (
        <CoachingDrawer
          script={coachingScript}
          onClose={() => setShowCoaching(false)}
          playerName={playerName || undefined}
        />
      )}
    </div>
  );
}
