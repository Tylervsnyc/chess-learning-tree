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
  getSharedAudioContext,
} from '@/lib/sounds';
import { getReactiveBookMove } from '@/lib/rookie-opening-book';
import {
  ROOKIE_LEVELS,
  WINS_TO_ADVANCE,
  getRookieLevel,
  getLevelElo,
  getLevelEngineConfig,
} from '@/lib/rookie-levels';
import { useOpeningProgress } from '@/hooks/useOpeningProgress';
import { PlayEvents } from '@/lib/analytics/posthog';
import { useRookieSpeech, type EvalUpdate } from '@/hooks/useRookieSpeech';
import { type GameEvent } from '@/lib/speech/priority-queue';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import { maia } from '@/lib/maia/maia-adapter';
import { GameSession, MoveRecord, GameResult, ResultMethod } from '@/lib/game-session';
import { useUser } from '@/hooks/useUser';
import { selectByCategory } from '@/lib/speech/priority-queue';
import { QUIP_POOL } from '@/lib/quips/quip-pool';
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
import { useClickToMove, reconcileSelectionAfterOpponentMove } from '@/hooks/useClickToMove';
import { SignupPrompt } from '@/components/onboarding/SignupPrompt';
import { RookieNameAsk } from '@/components/onboarding/RookieNameAsk';
import { useName } from '@/hooks/useName';
import { ActivityComplete } from '@/components/shared/ActivityComplete';
import {
  buildRookieMemoryContext,
  EMPTY_ROOKIE_MEMORY,
  toSpeechMemory,
  updateRookieMemoryContext,
  type RookieMemoryContext,
} from '@/lib/rookie-memory';
import { consumeBreadcrumb } from '@/lib/session-breadcrumb';
import { LevelUpCelebration } from '@/components/play/LevelUpCelebration';
import { PlayPageRookie } from '@/components/play/PlayPageRookie';

// ════════════════════════════════
// LEVEL PERSISTENCE (localStorage)
// ════════════════════════════════

const LEVEL_STORAGE_KEY = 'rookie-level';
const WINS_STORAGE_KEY = 'rookie-level-wins';

function loadLevelProgress(): { level: number; wins: number } {
  if (typeof window === 'undefined') return { level: 1, wins: 0 };
  const level = parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10);
  const wins = parseInt(localStorage.getItem(WINS_STORAGE_KEY) || '0', 10);
  return { level: Math.max(1, Math.min(10, level)), wins: Math.max(0, wins) };
}

function saveLevelProgress(level: number, wins: number) {
  localStorage.setItem(LEVEL_STORAGE_KEY, String(level));
  localStorage.setItem(WINS_STORAGE_KEY, String(wins));
}

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const ANIM_MS = 300;

// ════════════════════════════════
// LEVEL PROGRESS BAR (from test/play-design)
// ════════════════════════════════

function LevelProgressBar({
  currentLevel,
  playingLevel,
  winsAtLevel,
  animDurationMs = 700,
  celebrate = false,
  onPickLevel,
}: {
  currentLevel: number;
  /** Level currently being played. When !== currentLevel, user has picked a lower level for this session. */
  playingLevel?: number;
  winsAtLevel: number;
  animDurationMs?: number;
  celebrate?: boolean;
  onPickLevel?: (level: number) => void;
}) {
  const isDev = process.env.NODE_ENV === 'development';
  const activePlayLevel = playingLevel ?? currentLevel;
  // 9 gaps between 10 levels. Level 1 = 0%, level 10 = 100%.
  const levelPct = (lvl: number) => ((lvl - 1) / 9) * 100;
  const fillPct = levelPct(currentLevel) + (winsAtLevel / WINS_TO_ADVANCE) * (100 / 9);

  return (
    <div className="w-full">
      {/* Level numbers above */}
      <div className="relative h-4 mb-1">
        {ROOKIE_LEVELS.map((l) => {
          const pos = levelPct(l.level);
          const isCompleted = l.level < currentLevel;
          const isCurrent = l.level === currentLevel;
          const isPlaying = l.level === activePlayLevel;
          const isUnlocked = l.level <= currentLevel;
          const clickable = onPickLevel && (isDev || isUnlocked);
          return (
            <span
              key={l.level}
              onClick={clickable ? () => onPickLevel!(l.level) : undefined}
              className={`absolute -translate-x-1/2 text-[10px] font-bold tabular-nums ${
                isPlaying ? 'text-chess-green underline decoration-2 underline-offset-2'
                  : isCurrent ? 'text-chess-green'
                  : isCompleted ? 'text-chess-text-muted' : 'text-chess-disabled'
              } ${clickable ? 'cursor-pointer hover:text-chess-green hover:scale-125 transition-transform' : ''}`}
              style={{ left: `${pos}%` }}
            >
              {l.level}
            </span>
          );
        })}
      </div>
      {/* Bar track */}
      <div className="relative h-3.5 rounded-full overflow-hidden bg-slate-200"
        style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.04)' }}
      >
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full ease-out"
          style={{
            width: `${Math.max(fillPct, 1)}%`,
            background: celebrate
              ? 'linear-gradient(to right, #FFD700, #FFA500, #FFD700)'
              : 'linear-gradient(to right, #58CC02, #6EE018)',
            boxShadow: celebrate
              ? 'inset 0 -1px 0 rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5), 0 0 18px rgba(255, 200, 0, 0.8)'
              : 'inset 0 -1px 0 rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
            transition: `width ${animDurationMs}ms ease-out, background 300ms ease-out, box-shadow 300ms ease-out`,
          }}
        />
        {/* Shine */}
        <div
          className="absolute inset-y-0 left-0 rounded-full pointer-events-none ease-out"
          style={{
            width: `${Math.max(fillPct, 1)}%`,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, transparent 50%)',
            transition: `width ${animDurationMs}ms ease-out`,
          }}
        />
        {/* Level divider lines (skip level 1 at 0% and level 10 at 100%) */}
        {ROOKIE_LEVELS.slice(1, -1).map((l) => {
          const pos = levelPct(l.level);
          const isCompleted = l.level < currentLevel;
          return (
            <div
              key={l.level}
              className="absolute top-0 bottom-0 w-[2px] z-10"
              style={{
                left: `${pos}%`,
                background: isCompleted
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.12)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function WinsIndicator({ wins, needed, nextLevel }: { wins: number; needed: number; nextLevel: number }) {
  if (nextLevel > 10) {
    return (
      <div className="text-center">
        <span className="text-xs font-bold text-chess-gold">MAX LEVEL</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {Array.from({ length: needed }).map((_, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              i < wins ? 'bg-chess-green text-white scale-105' : 'bg-slate-200'
            }`}
            style={i < wins ? { boxShadow: '0 2px 0 var(--color-chess-green-dark)' } : { boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }}
          >
            {i < wins && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <span className="text-xs text-chess-text-muted font-semibold">
        {wins === 0
          ? `Win ${needed} to reach Level ${nextLevel}`
          : `${needed - wins} more win${needed - wins !== 1 ? 's' : ''} to Level ${nextLevel}`
        }
      </span>
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
  const { user, attitudeLevel, setAttitudeLevel, talkativenessLevel, setTalkativenessLevel } = useUser();
  const { getMyOpenings } = useOpeningProgress();
  const studiedSlugs = useMemo(() => getMyOpenings().map(o => o.slug), [getMyOpenings]);
  const matchedOpeningRef = useRef<{ slug: string; name: string } | null>(null);
  const [rookieMemory, setRookieMemory] = useState<RookieMemoryContext>(EMPTY_ROOKIE_MEMORY);
  const rookieMemoryRef = useRef<RookieMemoryContext>(EMPTY_ROOKIE_MEMORY);
  const honchoLoadedRef = useRef(false);

  // Load speech memory + Honcho context on login (before game starts)
  useEffect(() => {
    if (!user?.id) {
      setRookieMemory(EMPTY_ROOKIE_MEMORY);
      rookieMemoryRef.current = EMPTY_ROOKIE_MEMORY;
      honchoLoadedRef.current = false;
      return;
    }

    honchoLoadedRef.current = false;

    // Honcho context disabled — just load speech memory for now
    loadSpeechMemory(user.id).then((speechMemory) => {
      const memory = buildRookieMemoryContext({ speechMemory });
      setRookieMemory(memory);
      rookieMemoryRef.current = memory;
      honchoLoadedRef.current = true;
    });
  }, [user?.id]);

  const [phase, setPhase] = useState<Phase>('setup');
  const [tapQuip, setTapQuip] = useState<string | null>(null);
  const tapQuipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handleTapQuip = useCallback((quip: string) => {
    setTapQuip(quip);
    if (tapQuipTimerRef.current) clearTimeout(tapQuipTimerRef.current);
    tapQuipTimerRef.current = setTimeout(() => setTapQuip(null), 4000);
  }, []);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  // unlockedLevel = progression level shown on the progress bar; advances with wins.
  // rookieLevel = the level we're actually playing at right now; user can drop below
  // unlockedLevel for a lighter session without affecting progression.
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [rookieLevel, setRookieLevel] = useState(1);
  const [winsAtLevel, setWinsAtLevel] = useState(0);
  const { name: playerNameValue, setName: setPlayerNameValue } = useName();
  const playerName = playerNameValue || '';
  const [showNameAsk, setShowNameAsk] = useState(false);
  const nameAskedRef = useRef(false);

  // Win/loss/landing quip dedup is now handled by the unified QueueState inside useRookieSpeech.
  const pendingPostGameRef = useRef<'win' | 'loss' | null>(null);
  const pendingLevelUpRef = useRef<{ oldLevel: number; newLevel: number } | null>(null);
  const lastResultForTrackingRef = useRef<'win' | 'loss' | 'none'>('none');
  const landingFiredRef = useRef(false);
  const [levelBarAnim, setLevelBarAnim] = useState<{ level: number; wins: number; duration: number } | null>(null);

  // Load persisted level on mount
  useEffect(() => {
    const { level, wins } = loadLevelProgress();
    setUnlockedLevel(level);
    setRookieLevel(level);
    setWinsAtLevel(wins);
  }, []);

  // FEN is the single source of truth for board state
  const [fen, setFen] = useState(START_FEN);
  const [selected, setSelected] = useState<Square | null>(null);
  const [lastMv, setLastMv] = useState<{ from: Square; to: Square } | null>(null);
  const [rookieThinking, setRookieThinking] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [showActivityComplete, setShowActivityComplete] = useState(false);
  const [resignArmed, setResignArmed] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

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

  // Claude coaching commentary (per-move, fetched at game end)
  const coachCommentaryRef = useRef<Record<string, string>>({}); // "1w" -> text, "1b" -> text
  const coachSummaryRef = useRef<string | null>(null);
  const coachTakeawayRef = useRef<string | null>(null);
  const [coachReady, setCoachReady] = useState(false);

  // Post-game analysis
  const postGame = usePostGameAnalysis();

  // 6-layer narrative engine
  const narrative = useRookieNarrative();

  // Coaching drawer
  const [coachingScript, setCoachingScript] = useState<CoachingScript | null>(null);
  const [showCoaching, setShowCoaching] = useState(false);

  // Quip state — persisted in localStorage
  const [audioOn, setAudioOn] = useState(() => {
    if (typeof window === 'undefined') return true;
    try { const s = JSON.parse(localStorage.getItem('play-settings') || '{}'); return s.speechOn !== false; } catch { return true; }
  });
  const [soundsOn, setSoundsOn] = useState(() => {
    if (typeof window === 'undefined') return true;
    try { const s = JSON.parse(localStorage.getItem('play-settings') || '{}'); return s.soundsOn !== false; } catch { return true; }
  });
  const [showSettings, setShowSettings] = useState(false);

  // Ref for sounds (used in closures)
  const soundsOnRef = useRef(soundsOn);
  useEffect(() => { soundsOnRef.current = soundsOn; }, [soundsOn]);

  // Persist settings
  useEffect(() => {
    try { localStorage.setItem('play-settings', JSON.stringify({ speechOn: audioOn, soundsOn })); } catch {}
  }, [audioOn, soundsOn]);

  // Prepare Maia for L5/L6 — spins up worker on mount, triggers download only when user picks L5/L6.
  useEffect(() => { maia.init(); }, []);
  useEffect(() => {
    if (rookieLevel === 5 || rookieLevel === 6) maia.ensureReady();
  }, [rookieLevel]);

  // Unified mood system
  const moodSystem = useRookieMood(playerColor);
  const rookieMood = moodSystem.mood;
  const rookieAlarm = moodSystem.alarmVariant;

  // DEV-ONLY engine log (remove before shipping). Prints to console + floating panel.
  const [devLog, setDevLog] = useState<Array<{ moveNum: number; type: string; who: string; summary: string }>>([]);
  const log = useCallback((entry: { moveNum?: number; type?: string; who?: string; summary?: string; details?: unknown }) => {
    if (process.env.NODE_ENV !== 'development') return;
    const e = { moveNum: entry.moveNum ?? 0, type: entry.type ?? '', who: entry.who ?? '', summary: entry.summary ?? '' };
    // eslint-disable-next-line no-console
    console.log(`[engine] m${e.moveNum} ${e.type}: ${e.summary}`);
    setDevLog((prev) => [...prev.slice(-49), e]);
  }, []);

  const moveNumRef = useRef(0);
  const playerMoveCountRef = useRef(0);
  const rookieTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleRookieMoveRef = useRef<(fen: string) => void>(() => {});
  // Game generation counter — increments on each new game.
  // Stale closures from previous games check this before applying moves.
  const gameGenRef = useRef(0);

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
    const gen = gameGenRef.current;
    stockfish.getFullEval(fenStr, 10).then((result) => {
      if (gen !== gameGenRef.current) return; // stale — new game started
      if (!result) {
        console.warn('[play] stockfish eval returned null — engine likely crashed');
        return;
      }
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

      // Check for blunders via speech system (pawn units from OSOT)
      speechEvalUpdateRef.current?.({
        rookiePawns: moodUpdate.rookiePawns,
        prevRookiePawns: moodSystem.getPrevRookiePawns(),
        moveNumber: moveNumRef.current,
        lastMovedBy: lastMovedByRef.current,
        playerName: playerName || 'friend',
        playerColor,
      });

      // Honcho: log blunders/mistakes from eval swings (pawn units)
      if (user?.id && honchoGameIdRef.current && lastMovedByRef.current === 'player') {
        const prevPawns = moodSystem.getPrevRookiePawns() ?? 0;
        const pawnDelta = moodUpdate.rookiePawns - prevPawns; // positive = Rookie gained = player lost
        const lastMove = moveLogRef.current[moveLogRef.current.length - 1];
        if (pawnDelta >= 2.5 && lastMove) {
          // Blunder: 2.5+ pawn swing against player
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
          log({ moveNum: moveNumRef.current, type: 'game-event', who: 'system', summary: `[Honcho] blunder logged: ${lastMove.san} (${pawnDelta.toFixed(1)} pawn swing)`, details: { pawnDelta, bestMove } });
        } else if (pawnDelta >= 1.5 && lastMove) {
          // Mistake: 1.5+ pawn swing
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
          log({ moveNum: moveNumRef.current, type: 'game-event', who: 'system', summary: `[Honcho] mistake logged: ${lastMove.san} (${pawnDelta.toFixed(1)} pawn swing)`, details: { pawnDelta, bestMove } });
        }
      }

      // Let Rookie react when the eval mood zone changes (pawn units)
      if (moodSystem.checkEvalMoodZone(moodUpdate.rookiePawns)) {
        speech.onMoodChange(moveNumRef.current, moodUpdate.rookiePawns);
      }

      // Fire sore loser quips when alarm is active (5+ pawns behind)
      if (moodSystem.alarmVariant) {
        speech.onAlarm(moveNumRef.current, moodUpdate.rookiePawns);
      }

      log({
        moveNum: moveNumRef.current,
        type: 'eval',
        who: 'system',
        summary: `cp=${cp} mate=${mate} rookiePawns=${moodUpdate.rookiePawns.toFixed(2)} mood=${moodUpdate.mood}${moodUpdate.applied ? ' APPLIED' : ' held'}`,
        details: { cp, mate, rookiePawns: moodUpdate.rookiePawns, mood: moodUpdate.mood, isComeback: moodUpdate.isComeback, moodApplied: moodUpdate.applied },
      });
    }).catch((err) => {
      console.error('[play] stockfish getFullEval threw:', err);
    });
  }, [phase, playerColor, playerName, log]);

  // ════════════════════════════════
  // AUDIO (with real-time amplitude for talk animation)
  // ════════════════════════════════
  const { speakQuip, talkIntensity, isTalking, isTalkingRef, stopAudio } = useRookieVoice(audioOn);

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
          attitudeLevel,
        },
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.text) throw new Error('Failed');
    return data.text;
  }, [attitudeLevel]);

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
          attitudeLevel,
        },
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.text) throw new Error('Failed');
    return data.text;
  }, [narrative, attitudeLevel]);

  const speech = useRookieSpeech({
    speakQuip,
    isTalkingRef,
    generateOpeningLine,
    generateGameEndLine,
    initialUsedRecently: rookieMemory.usedRecently,
    attitudeLevel,
    talkativenessLevel,
  });

  // Speak the setup greeting on first interaction (audio requires user gesture)
  const setupGreetingSpokenRef = useRef(false);
  const speakSetupGreeting = useCallback(() => {
    if (setupGreetingSpokenRef.current || phase !== 'setup') return;
    setupGreetingSpokenRef.current = true;
    // warmupAudio must run synchronously inside the gesture to unlock AudioContext
    warmupAudio();
    // Speak whatever text is currently displayed in the bubble
    const text = speech.displayText;
    if (text) {
      setTimeout(() => speakQuip(text), 50);
    }
  }, [phase, speech.displayText, speakQuip]);

  // Wire up eval-based blunder detection (speech is defined after updateEval, so use ref)
  speechEvalUpdateRef.current = speech.onEvalUpdate;

  const runLevelUpAnimation = useCallback((oldLevel: number, newLevel: number) => {
    const DURATION = 1600;
    PlayEvents.levelUpTriggered(oldLevel, newLevel);
    setLevelBarAnim({ level: oldLevel, wins: WINS_TO_ADVANCE, duration: 0 });
    window.setTimeout(() => {
      setLevelBarAnim({ level: newLevel, wins: 0, duration: DURATION });
    }, 80);
    window.setTimeout(() => {
      setUnlockedLevel(newLevel);
      setRookieLevel(newLevel);
      setWinsAtLevel(0);
      setLevelBarAnim(null);
      const quip = speech.queueLevelUpQuip(newLevel);
      if (quip) {
        PlayEvents.quipShown('level_up', quip);
      }
      try {
        localStorage.setItem('rookie-celebrated-level-' + newLevel, '1');
      } catch {}
    }, 80 + DURATION + 100);
  }, [speech]);

  useEffect(() => {
    if (phase !== 'setup') return;
    if (landingFiredRef.current) return;

    // Defer one tick so StrictMode's remount cleanup can cancel the first
    // mount's fire before it happens. Without this, both mounts fire the
    // landing quip and two audios play ~600ms apart (queue GAP_MS).
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled || landingFiredRef.current) return;

      const pendingLevelUp = pendingLevelUpRef.current;
      if (pendingLevelUp !== null) {
        pendingLevelUpRef.current = null;
        pendingPostGameRef.current = null;
        landingFiredRef.current = true;
        setupGreetingSpokenRef.current = true;
        PlayEvents.landingViewed('level_up', pendingLevelUp.newLevel);
        let alreadyCelebrated = false;
        try {
          alreadyCelebrated = localStorage.getItem('rookie-celebrated-level-' + pendingLevelUp.newLevel) === '1';
        } catch {}
        if (alreadyCelebrated) {
          setUnlockedLevel(pendingLevelUp.newLevel);
          setRookieLevel(pendingLevelUp.newLevel);
          setWinsAtLevel(0);
        } else {
          runLevelUpAnimation(pendingLevelUp.oldLevel, pendingLevelUp.newLevel);
        }
        return;
      }

      const pendingResult = pendingPostGameRef.current;
      if (pendingResult !== null) {
        pendingPostGameRef.current = null;
        landingFiredRef.current = true;
        setupGreetingSpokenRef.current = true;
        PlayEvents.landingViewed('post_game', rookieLevel);
        const line = pendingResult === 'win' ? speech.queueWinQuip() : speech.queueLossQuip();
        if (line) {
          PlayEvents.quipShown(pendingResult, line);
        }
        return;
      }

      landingFiredRef.current = true;
      setupGreetingSpokenRef.current = true;
      PlayEvents.landingViewed('direct', rookieLevel);
      const mem = rookieMemoryRef.current;
      const line = speech.queueLandingQuip({
        breadcrumb: consumeBreadcrumb(),
        gamesPlayed: mem.gamesPlayed,
        winsAtLevel,
        winsNeeded: WINS_TO_ADVANCE,
      });
      if (line) {
        PlayEvents.quipShown('landing', line);
      }
    }, 0);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [phase, user?.id, rookieLevel, winsAtLevel, runLevelUpAnimation, speech]);

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

    PlayEvents.gameEnded(result ?? 'unknown', moveLogRef.current.length, playerColor, rookieLevel, matchedOpeningRef.current?.name);

    const postGameResult: 'win' | 'loss' = result === 'win' ? 'win' : 'loss';
    pendingPostGameRef.current = postGameResult;
    lastResultForTrackingRef.current = postGameResult;

    // Progression only counts when playing at your unlocked level (no farming at lower levels).
    if (result === 'win' && rookieLevel === unlockedLevel && unlockedLevel < 10) {
      const newWins = winsAtLevel + 1;
      if (newWins >= WINS_TO_ADVANCE) {
        const newLevel = unlockedLevel + 1;
        // localStorage written now so refresh keeps the new level; React state is committed by the setup-phase animation.
        pendingLevelUpRef.current = { oldLevel: unlockedLevel, newLevel };
        saveLevelProgress(newLevel, 0);
      } else {
        setWinsAtLevel(newWins);
        saveLevelProgress(unlockedLevel, newWins);
      }
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
      setKeyMoments(extractKeyMoments(analysis, moveRecs, playerName || undefined).filter(m => m.type !== 'best-move' && m.type !== 'turning-point'));

      // Show instant analysis immediately, then kick off deep analysis (depth 18)
      postGame.setInstantAnalysis(analysis);
      postGame.analyze(moves, playerColor).then((deepAnalysis) => {
        if (deepAnalysis) {
          // Update key moments with deeper eval
          const deepMoveRecs = moves.map(m => ({ san: m.san, movedBy: m.movedBy, moveNumber: m.moveNumber, fenAfter: m.fenAfter, from: m.from, to: m.to }));
          setKeyMoments(extractKeyMoments(deepAnalysis, deepMoveRecs, playerName || undefined).filter(m => m.type !== 'best-move' && m.type !== 'turning-point'));
        }
      });

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

      // Fire Claude coaching commentary (non-blocking)
      (async () => {
        try {
          const evals = positionEvalsRef.current;
          const coachMoves = analysis.moves.map((mv, i) => ({
            moveNumber: Math.ceil((i + 1) / 2), // chess move number: 1,1,2,2,3,3...
            color: (mv.movedBy === 'player' ? playerColor : (playerColor === 'white' ? 'black' : 'white')) as 'white' | 'black',
            san: mv.san,
            uci: moves[i] ? (moves[i].from + moves[i].to) : '',
            fen: i > 0 ? moves[i - 1].fenAfter : START_FEN,
            evalBefore: evals[i]?.cp ?? null,
            evalAfter: evals[i + 1]?.cp ?? null,
            bestMove: evals[i]?.bestMove ?? null,
            threat: evals[i + 1]?.bestMove ?? null,
            classification: mv.classification as 'brilliant' | 'great' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | null,
          }));

          const res = await fetch('/api/coach-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              moves: coachMoves,
              playerColor,
              playerElo: getLevelElo(rookieLevel),
              result: result || 'loss',
            }),
          });
          const data = await res.json();
          console.log('[coach-review] response:', JSON.stringify(data).slice(0, 500));
          if (data.review) {
            coachCommentaryRef.current = data.review.moves || {};
            coachSummaryRef.current = data.review.summary || null;
            coachTakeawayRef.current = data.review.takeaway || null;
            setCoachReady(true);
            console.log('[coach-review] ready, moves:', Object.keys(data.review.moves || {}).length);
          } else {
            console.warn('[coach-review] no review in response:', data);
          }
        } catch (err) {
          console.error('[coach-review] failed:', err);
        }
      })();

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
              openingName: opening?.name ?? matchedOpeningRef.current?.name ?? null,
              openingEco: opening?.eco ?? null,
              rookieOpeningPlayed: matchedOpeningRef.current?.name ?? null,
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
        }).catch(() => {});
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
    const gen = gameGenRef.current; // capture current generation

    const applyRookieMove = async (moveInfo: { from: string; to: string; promotion?: string } | { san: string }) => {
      // Stale closure guard — if a new game started, discard this move
      if (gen !== gameGenRef.current) return;
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
      setSelected(prev => reconcileSelectionAfterOpponentMove(prev, result));
      setRookieThinking(false);

      if (soundsOnRef.current) {
        if (result.captured) playCaptureSound();
        else playMoveSound();
      }

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
        rookiePawns: moodSystem.getRookiePawns(),
        prevRookiePawns: moodSystem.getPrevRookiePawns(),
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
      speech.onMove(speechInput);
      log({
        moveNum: moveNumRef.current,
        type: 'speech',
        who: 'rookie',
        summary: `onMove event=${speechInput.event} rookiePawns=${speechInput.rookiePawns.toFixed(2)}`,
        details: { event: speechInput.event, rookiePawns: speechInput.rookiePawns, capturedPiece: speechInput.capturedPiece || null },
      });

      updateMood(g, 'rookie');
      recordMoveToSession(g, result, 'rookie', currentFen);

      // Run 6-layer narrative engine (async, non-blocking)
      processNarrative(g, result, 'rookie', newFen).catch(() => {});

      if (g.isGameOver()) {
        const resultText = g.isCheckmate()
          ? ((g.turn() === 'w' && playerColor === 'white') || (g.turn() === 'b' && playerColor === 'black') ? 'Rookie wins by checkmate' : 'Player wins by checkmate')
          : g.isStalemate() ? 'Stalemate' : 'Draw';
        log({ moveNum: moveNumRef.current, type: 'game-event', who: 'system', summary: resultText, details: {} });
        if (g.isCheckmate()) {
          const loser = g.turn();
          const iLost = (loser === 'w' && playerColor === 'white') || (loser === 'b' && playerColor === 'black');
          setGameResult(iLost ? 'Rookie wins!' : 'You win!');
          if (!iLost && soundsOnRef.current) playCelebrationSound();
        } else {
          setGameResult(g.isStalemate() ? 'Stalemate!' : 'Draw!');
        }
        endSession(g);
        setPhase('gameover');
        setShowActivityComplete(true);
      }
    };

    // Opening book check — skip at low levels so Rookie doesn't play perfect theory
    // Levels 1-3 (ELO 200-600): no book, just engine moves
    // Levels 4+: use the opening book
    const rookieColor = playerColor === 'white' ? 'black' : 'white';
    const gameMoves = moveLogRef.current.map(m => m.san);
    // Cap book to Rookie's first 5 moves at L1-L4 so beginners don't play
    // 15 moves of Ruy Lopez theory. L5+ use the full opening trie since
    // stronger players legitimately know theory.
    const rookieMovesPlayed = gameMoves.filter((_, i) => (rookieColor === 'white' ? i % 2 === 0 : i % 2 === 1)).length;
    const bookCapped = rookieLevel <= 4 && rookieMovesPlayed >= 5;
    const bookResult = !bookCapped
      ? getReactiveBookMove(currentFen, gameMoves, rookieColor, studiedSlugs)
      : { inBook: false, moveSan: null, moveUci: null, matchedSlug: null, matchedName: null };
    if (bookResult.inBook && bookResult.moveSan) {
      if (bookResult.matchedSlug) {
        matchedOpeningRef.current = { slug: bookResult.matchedSlug, name: bookResult.matchedName! };
      }
      log({ moveNum: moveNumRef.current, type: 'engine', who: 'system', summary: `opening-book: ${bookResult.moveSan} (${bookResult.matchedName})`, details: { engine: 'opening-book', opening: bookResult.matchedSlug, move: bookResult.moveSan } });
      rookieTimerRef.current = setTimeout(() => applyRookieMove({ san: bookResult.moveSan! }), 400);
      return;
    }

    // Maia at L5/L6 — neural-net moves tuned to human ELO (1100/1200).
    // Falls through to Stockfish if Maia isn't ready (model not downloaded yet).
    const useMaia = rookieLevel === 5 || rookieLevel === 6;
    if (useMaia && maia.getStatus() === 'ready') {
      const maiaElo = rookieLevel === 5 ? 1300 : 1500;
      log({ moveNum: moveNumRef.current, type: 'engine', who: 'system', summary: `maia (elo=${maiaElo})`, details: { engine: 'maia', rookieLevel, eloSelf: maiaElo } });
      const thinkStart = Date.now();
      maia.getMaiaMove(currentFen, maiaElo, maiaElo).then((uciMove) => {
        if (gen !== gameGenRef.current) return;
        if (!uciMove) { fallbackRandomMove(currentFen, gen); return; }
        const from = uciMove.slice(0, 2);
        const to = uciMove.slice(2, 4);
        const promotion = uciMove.length > 4 ? uciMove[4] : undefined;
        const wait = Math.max(0, 500 - (Date.now() - thinkStart));
        rookieTimerRef.current = setTimeout(() => applyRookieMove({ from, to, promotion }), wait);
      }).catch(() => {
        if (gen !== gameGenRef.current) return;
        fallbackRandomMove(currentFen, gen);
      });
      return;
    }

    // Stockfish MultiPV sampling — weak-human feel via top-N candidate pool
    const cfg = getLevelEngineConfig(rookieLevel);

    // Random move injection for L1-L3 — true beginner "hung piece" feel that
    // Stockfish can't produce on its own (even at skill 0, its worst move is ~1000 ELO).
    if (cfg.randomMoveChance && Math.random() < cfg.randomMoveChance) {
      const g = new Chess(currentFen);
      const moves = g.moves({ verbose: true });
      if (moves.length > 0) {
        const pick = moves[Math.floor(Math.random() * moves.length)];
        log({ moveNum: moveNumRef.current, type: 'engine', who: 'system', summary: `random move (level=${rookieLevel}, chance=${cfg.randomMoveChance}) -> ${pick.san}`, details: { engine: 'random', rookieLevel, chance: cfg.randomMoveChance, move: pick.san } });
        rookieTimerRef.current = setTimeout(() => applyRookieMove({ from: pick.from, to: pick.to, promotion: pick.promotion }), 500);
        return;
      }
    }

    log({ moveNum: moveNumRef.current, type: 'engine', who: 'system', summary: `stockfish sampled (level=${rookieLevel}, skill=${cfg.skillLevel}, depth=${cfg.depth}, pool=${cfg.poolSize}/${cfg.multiPV})`, details: { engine: 'stockfish-sampled', rookieLevel, ...cfg } });
    const thinkStart = Date.now();
    stockfish.getBestMoveSampled(currentFen, cfg.skillLevel, cfg.depth, cfg.multiPV, cfg.poolSize).then((uciMove) => {
      if (gen !== gameGenRef.current) return; // stale — new game started
      if (!uciMove) { fallbackRandomMove(currentFen, gen); return; }
      const from = uciMove.slice(0, 2);
      const to = uciMove.slice(2, 4);
      const promotion = uciMove.length > 4 ? uciMove[4] : undefined;
      const wait = Math.max(0, 500 - (Date.now() - thinkStart));
      rookieTimerRef.current = setTimeout(() => applyRookieMove({ from, to, promotion }), wait);
    }).catch(() => {
      if (gen !== gameGenRef.current) return;
      fallbackRandomMove(currentFen, gen);
    });

    function fallbackRandomMove(fenStr: string, capturedGen: number) {
      if (capturedGen !== gameGenRef.current) return;
      const g = new Chess(fenStr);
      const moves = g.moves({ verbose: true });
      if (moves.length === 0) { setRookieThinking(false); return; }
      const pick = moves[Math.floor(Math.random() * moves.length)];
      log({ moveNum: moveNumRef.current, type: 'engine', who: 'system', summary: `engine error → random fallback: ${pick.san}`, details: { engine: 'random-fallback', move: pick.san } });
      rookieTimerRef.current = setTimeout(() => applyRookieMove({ from: pick.from, to: pick.to, promotion: pick.promotion }), 300);
    }
  }, [rookieLevel, playerName, playerColor, speech, updateMood, recordMoveToSession, endSession, updateEval, waitForSpeech, processNarrative, log, studiedSlugs]);
  scheduleRookieMoveRef.current = scheduleRookieMove;

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
      playerMoveCountRef.current++;
      lastMovedByRef.current = 'player';
      const newFen = g.fen();

      setFen(newFen);
      setLastMv({ from, to });
      setSelected(null);

      if (soundsOnRef.current) {
        if (result.captured) playCaptureSound();
        else playMoveSound();
      }

      // After the player has made a few moves, ask their name if we don't
      // have one yet. Don't stack on top of other overlays.
      if (
        !nameAskedRef.current
        && !playerNameValue
        && playerMoveCountRef.current >= 4
        && !gameResult
        && !showSignupPrompt
        && !showCoaching
        && !isTalkingRef.current
      ) {
        nameAskedRef.current = true;
        setShowNameAsk(true);
      }

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
        rookiePawns: moodSystem.getRookiePawns(),
        prevRookiePawns: moodSystem.getPrevRookiePawns(),
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
      speech.onMove(speechInput);
      log({
        moveNum: moveNumRef.current,
        type: 'speech',
        who: 'player',
        summary: `onMove event=${speechInput.event} rookiePawns=${speechInput.rookiePawns.toFixed(2)}`,
        details: { event: speechInput.event, rookiePawns: speechInput.rookiePawns, capturedPiece: speechInput.capturedPiece || null },
      });

      updateMood(g, 'player');
      recordMoveToSession(g, result, 'player', fen);

      // Run 6-layer narrative engine (async, non-blocking for authored quips)
      processNarrative(g, result, 'player', newFen).catch(() => {});

      if (g.isGameOver()) {
        const resultText = g.isCheckmate()
          ? ((g.turn() === 'w' && playerColor === 'white') || (g.turn() === 'b' && playerColor === 'black') ? 'Rookie wins by checkmate' : 'Player wins by checkmate')
          : g.isStalemate() ? 'Stalemate' : 'Draw';
        log({ moveNum: moveNumRef.current, type: 'game-event', who: 'system', summary: resultText, details: {} });
        if (g.isCheckmate()) {
          const loser = g.turn();
          const iLost = (loser === 'w' && playerColor === 'white') || (loser === 'b' && playerColor === 'black');
          setGameResult(iLost ? 'Rookie wins!' : 'You win!');
          if (!iLost && soundsOnRef.current) playCelebrationSound();
        } else {
          setGameResult(g.isStalemate() ? 'Stalemate!' : 'Draw!');
        }
        endSession(g);
        setPhase('gameover');
        setShowActivityComplete(true);
        return true;
      }

      setTimeout(() => scheduleRookieMove(newFen), ANIM_MS + 150);
      return true;
    } catch {
      return false;
    }
  }, [fen, playerColor, playerName, playerNameValue, gameResult, showSignupPrompt, showCoaching, isTalkingRef, speech, scheduleRookieMove, updateMood, recordMoveToSession, endSession, updateEval, processNarrative, log]);

  // ════════════════════════════════
  // CLICK TO MOVE — shared hook
  // ════════════════════════════════
  const clickGame = useMemo(() => { try { return new Chess(fen); } catch { return null; } }, [fen]);

  const onClickSquare = useClickToMove({
    game: clickGame,
    ownColor: playerColor === 'white' ? 'w' : 'b',
    selectedSquare: selected,
    setSelectedSquare: setSelected,
    tryMove: doPlayerMove,
    enabled: phase === 'playing',
  });

  // Kick off Rookie's first move if player is black
  // Uses ref to avoid re-firing when scheduleRookieMove's deps change
  useEffect(() => {
    if (phase === 'playing' && playerColor === 'black') {
      scheduleRookieMoveRef.current(START_FEN);
    }
    return () => {
      if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
    };
  }, [phase, playerColor]);

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
      setReviewText(coachSummaryRef.current || 'Starting position');
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

    // Claude commentary key: "1w" or "1b" (chess move numbers, not sequential)
    const chessMoveNum = Math.ceil((index + 1) / 2);
    const colorKey = move.movedBy === 'player'
      ? (playerColor === 'white' ? 'w' : 'b')
      : (playerColor === 'white' ? 'b' : 'w');
    const commentKey = `${chessMoveNum}${colorKey}`;
    const coachText = coachCommentaryRef.current[commentKey];

    // On last move, append takeaway
    let displayText = coachText || null;
    if (index === moves.length - 1 && coachTakeawayRef.current) {
      displayText = displayText
        ? `${displayText}\n\n${coachTakeawayRef.current}`
        : coachTakeawayRef.current;
    }

    // Check if this move corresponds to a key moment
    const moment = keyMoments.find(m => m.moveNumber === move.moveNumber && m.movedBy === move.movedBy);
    if (moment) {
      // Prefer Claude commentary over key moment description
      setReviewText(displayText || moment.description);
      setReviewArrows([{
        startSquare: moment.from,
        endSquare: moment.to,
        color: getArrowColor(moment.type),
      }]);
      const mIdx = keyMoments.indexOf(moment);
      if (mIdx >= 0) setReviewMomentIndex(mIdx);
      return;
    }

    // Regular move — Claude commentary or fallback to SAN
    if (displayText) {
      setReviewText(displayText);
    } else {
      const moveLabel = move.movedBy === 'player' ? (playerName || 'You') : 'Rookie';
      setReviewText(`${moveLabel} played ${move.san}`);
    }

    // Best move arrow (golden) — show opponent's best response from this position
    const evals = positionEvalsRef.current;
    const posEval = evals[index + 1]; // eval after this move
    if (posEval?.bestMove) {
      const from = posEval.bestMove.slice(0, 2);
      const to = posEval.bestMove.slice(2, 4);
      setReviewArrows([{ startSquare: from, endSquare: to, color: 'rgba(218, 165, 32, 0.8)' }]);
    } else {
      setReviewArrows([]);
    }
  }, [keyMoments, playerName, playerColor, updateEvalBarForPosition]);

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

  // Re-render current review position when Claude commentary arrives
  useEffect(() => {
    if (coachReady && phase === 'review') {
      console.log('[coach-review] coachReady fired, re-navigating to move', reviewMoveIndex);
      navigateToMove(reviewMoveIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coachReady]);

  // ════════════════════════════════
  // SQUARE STYLES
  // ════════════════════════════════
  const sqStyles = useMemo(() => {
    const s: Record<string, React.CSSProperties> = {};
    if (lastMv) {
      // In review mode with analysis, color squares by classification
      let moveColor = 'rgba(255, 170, 0, 0.4)'; // default orange
      if (phase === 'review' && coachReady && reviewMoveIndex >= 0) {
        const move = moveLogRef.current[reviewMoveIndex];
        if (move && postGame.analysis) {
          const moveEval = postGame.analysis.moves[reviewMoveIndex];
          if (moveEval) {
            const cls = moveEval.classification;
            if (cls === 'blunder' || cls === 'mistake') moveColor = 'rgba(239, 68, 68, 0.5)';
            else if (cls === 'inaccuracy') moveColor = 'rgba(234, 179, 8, 0.4)';
          }
        }
      }
      s[lastMv.from] = { background: moveColor };
      s[lastMv.to] = { background: moveColor };
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
  }, [fen, game, lastMv, selected, phase, coachReady, reviewMoveIndex, postGame.analysis]);

  const resetToSetup = useCallback(() => {
    PlayEvents.playAgainClicked(lastResultForTrackingRef.current, rookieLevel);
    gameGenRef.current++; // invalidate all stale closures from previous game
    if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
    stockfish.cancel(); // flush pending Stockfish requests from previous game
    speech.reset();
    moveNumRef.current = 0;
    playerMoveCountRef.current = 0;
    nameAskedRef.current = false;
    setShowNameAsk(false);
    moveLogRef.current = [];
    coachCommentaryRef.current = {};
    coachSummaryRef.current = null;
    coachTakeawayRef.current = null;
    setCoachReady(false);
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
    postGame.cancel();
    setCoachingScript(null);
    setShowCoaching(false);
    positionEvalsRef.current = [{ cp: 0, mate: null, bestMove: null, bestLine: [], depth: 0 }];
    setupGreetingSpokenRef.current = false;
    setPhase('setup');
  }, [speech, moodSystem, postGame, rookieLevel]);

  // ════════════════════════════════
  // START GAME
  // ════════════════════════════════
  const startGame = () => {
    // Prevent setup greeting from firing (onPointerDown fires before onClick)
    setupGreetingSpokenRef.current = true;
    warmupAudio();
    gameGenRef.current++; // invalidate all stale closures from previous game
    speech.reset();
    stopAudio(); // kill any in-progress landing quip audio
    stockfish.cancel(); // flush pending Stockfish requests from previous game
    if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
    moveNumRef.current = 0;
    playerMoveCountRef.current = 0;
    nameAskedRef.current = false;
    setShowNameAsk(false);
    moveLogRef.current = [];
    coachCommentaryRef.current = {};
    coachSummaryRef.current = null;
    coachTakeawayRef.current = null;
    setCoachReady(false);
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

    // Start session tracking (only for logged-in users)
    if (user?.id) {
      const session = new GameSession('play-rookie', user.id);
      session.setGameInfo({ playerColor, rookieDifficulty: rookieLevel });
      sessionRef.current = session;
    }
    moveStartRef.current = Date.now();

    speech.onGameStart(playerColor, playerName || 'friend');
    narrative.resetForNewGame();
    narrative.setMemoryContext(rookieMemoryRef.current);
    honchoOpeningLoggedRef.current = false;
    matchedOpeningRef.current = null;

    // Use pre-fetched Honcho context (loaded on page mount) for narrative + opening line
    const hasChat = !!rookieMemoryRef.current.honchoSummary;
    const hasLastGame = !!rookieMemoryRef.current.lastGameContext;
    const hasRep = !!rookieMemoryRef.current.honchoRepresentation;
    const loaded = honchoLoadedRef.current;
    log({ moveNum: 0, type: 'game-event', who: 'system', summary: `[Honcho] user=${user?.id ? 'logged-in' : 'anonymous'}, loaded=${loaded}, chat=${hasChat}, lastGame=${hasLastGame}, rep=${hasRep}`, details: { userId: user?.id ?? null, honchoLoaded: loaded, hasChat, hasLastGame, hasRep } });

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
        const currentRookieLevel = getRookieLevel(rookieLevel);
        fetch('/api/honcho', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'seed_card',
            userId: user.id,
            profile: {
              estimatedElo: currentRookieLevel.elo,
              colorPreference: playerColor,
              experience: `Level ${rookieLevel}: ${currentRookieLevel.title}`,
            },
          }),
        }).catch(() => {});
      }
    }
    log({ moveNum: 0, type: 'speech', who: 'system', summary: `onGameStart color=${playerColor} name=${playerName || 'friend'}`, details: { playerColor, playerName: playerName || 'friend' } });
    PlayEvents.gameStarted(rookieLevel, playerColor);

    setPhase('playing');
  };

  const handleResign = useCallback(() => {
    if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
    setRookieThinking(false);
    setGameResult('You resigned');
    // Let Rookie react to the resignation
    speech.onMove({
      moveNumber: moveNumRef.current,
      rookiePawns: moodSystem.getRookiePawns(),
      prevRookiePawns: moodSystem.getPrevRookiePawns(),
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
    setShowActivityComplete(true);
    setResignArmed(false);
  }, [fen, endSession, speech, playerName, playerColor]);

  // Auto-show signup prompt for guests after first game ends
  useEffect(() => {
    if (phase !== 'gameover' || user || showSignupPrompt) return;
    // Let them see the result for 3 seconds before prompting
    const timer = setTimeout(() => setShowSignupPrompt(true), 3000);
    return () => clearTimeout(timer);
  }, [phase, user, showSignupPrompt]);

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
        <span className="text-xs text-chess-text-muted font-medium min-w-[56px] text-center font-mono">
          {reviewMoveIndex < 0 ? 'Start' : (() => {
            const m = moveLogRef.current[reviewMoveIndex];
            const chessMoveNum = Math.ceil((reviewMoveIndex + 1) / 2);
            const isBlack = m.movedBy === 'player' ? playerColor === 'black' : playerColor === 'white';
            return `${chessMoveNum}${isBlack ? '...' : '.'} ${m.san}`;
          })()}
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
    const currentRookieLevel = getRookieLevel(rookieLevel);

    return (
      <div className="h-full bg-chess-page text-chess-text flex flex-col overflow-auto" onPointerDown={speakSetupGreeting}>
        {/* Top: Level progress bar */}
        <div className="px-5 pt-4 pb-2 flex-shrink-0">
          <div className="relative">
            <LevelProgressBar
              currentLevel={levelBarAnim ? levelBarAnim.level : unlockedLevel}
              playingLevel={rookieLevel}
              winsAtLevel={levelBarAnim ? levelBarAnim.wins : winsAtLevel}
              animDurationMs={levelBarAnim ? levelBarAnim.duration : 700}
              celebrate={!!levelBarAnim}
              onPickLevel={(lvl) => {
                // In prod: only let user pick ≤ unlocked level (no farming, no skipping ahead).
                // Dev: any level.
                const isDev = process.env.NODE_ENV === 'development';
                if (!isDev && lvl > unlockedLevel) return;
                setRookieLevel(lvl);
              }}
            />
            <LevelUpCelebration active={!!levelBarAnim} />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 pb-4">
          <div className="w-full max-w-sm space-y-5">
            {/* Level badge + Rookie */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(88,204,2,0.12), rgba(88,204,2,0.06))',
                  border: '1px solid rgba(88,204,2,0.2)',
                }}
              >
                <span className="text-chess-green font-black text-sm">LV. {rookieLevel}</span>
                <span className="text-chess-text-muted font-semibold text-xs">&middot;</span>
                <span className="text-chess-text-muted font-semibold text-xs">{currentRookieLevel.title}</span>
              </div>

              <PlayPageRookie onQuip={handleTapQuip} />

              {/* Speech bubble */}
              <div className="relative w-full h-[88px]">
                <div
                  className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 rounded-[2px]"
                  style={{ boxShadow: '-1px -1px 2px rgba(0,0,0,0.03)' }}
                />
                <div className="relative bg-white rounded-2xl px-5 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)] h-full flex items-center justify-center">
                  <p key={tapQuip || speech.msgKey} className="text-chess-text text-[14px] leading-relaxed font-medium text-center line-clamp-3">
                    {tapQuip || speech.displayText || "Let's play."}
                  </p>
                </div>
              </div>
            </div>

            {/* Wins progress */}
            <div className="flex justify-center">
              <WinsIndicator wins={winsAtLevel} needed={WINS_TO_ADVANCE} nextLevel={rookieLevel + 1} />
            </div>

            {/* Color picker */}
            <div>
              <label className="text-[11px] font-semibold text-chess-text-muted uppercase tracking-wide mb-1.5 block">
                Your color
              </label>
              <div className="flex gap-2">
                {(['white', 'black'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setPlayerColor(c)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      playerColor === c
                        ? c === 'white'
                          ? 'bg-white text-chess-text ring-2 ring-chess-green shadow-md'
                          : 'bg-gray-800 text-white ring-2 ring-chess-green shadow-md'
                        : 'bg-chess-surface text-chess-text-muted border border-slate-200'
                    }`}
                  >
                    {c === 'white' ? 'White' : 'Black'}
                  </button>
                ))}
              </div>
            </div>

            {/* Play button */}
            <button
              onClick={startGame}
              onPointerDown={(e) => { setupGreetingSpokenRef.current = true; e.stopPropagation(); }}
              className="w-full py-4 bg-chess-green text-white font-bold rounded-xl text-lg shadow-[0_4px_0_var(--color-chess-green-dark)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-chess-green-dark)] transition-all"
            >
              Let&apos;s Play
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════
  // ANALYSIS SUMMARY — move classification + accuracy
  // ════════════════════════════════
  const AnalysisSummary = ({ analysis }: { analysis: GameAnalysis }) => {
    const hasEvals = analysis.playerMoveCount > 0;
    const acc = Math.round(analysis.playerAccuracy);
    const accColor = acc >= 80 ? 'text-chess-green' : acc >= 60 ? 'text-amber-400' : 'text-red-400';

    return (
      <div className="bg-chess-surface rounded-xl px-3 py-2 text-left space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-chess-text-muted">Your Accuracy</span>
          {hasEvals ? (
            <span className={`text-lg font-black ${accColor}`}>{acc}%</span>
          ) : (
            <span className="text-xs font-semibold text-chess-text-faint">Unavailable</span>
          )}
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
    <div className="h-full bg-chess-page text-chess-text flex flex-col">
      {/* Spacer for status bar */}
      <div className="h-2 flex-shrink-0" />

      {/* Board area */}
      <div className="flex-1 flex items-start justify-center px-4 pt-2 min-h-0">
        <div className="w-full max-w-lg">

          {/* Above board: Rookie always in same spot, content changes by phase */}
          {isReview ? (
            <div className="mb-2">
              <div className="bg-chess-surface rounded-2xl px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] h-[72px] flex items-center gap-2.5">
                {!coachReady && (
                  <div className="flex-shrink-0">
                    <BreathingRook size="xs" animation="think" />
                  </div>
                )}
                <p className={`text-chess-text leading-snug font-medium ${
                  (reviewText?.length ?? 0) > 120 ? 'text-[11px]' :
                  (reviewText?.length ?? 0) > 80 ? 'text-[12px]' : 'text-[13px]'
                }`}>
                  {!coachReady ? 'Rookie is reviewing your game...' : (reviewText || 'Use the arrows to step through the game.')}
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
                  <div key="gameover-bubble" className="relative rookie-glitch">
                    <div
                      className="absolute top-3 -left-[6px] w-2.5 h-2.5 bg-chess-surface rotate-45 rounded-[2px]"
                      style={{ boxShadow: '-1px 1px 2px rgba(0,0,0,0.04)' }}
                    />
                    <div className="relative bg-chess-surface rounded-xl px-3 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]">
                      <p className="text-chess-text text-[13px] leading-relaxed font-medium">
                        {gameResult}
                      </p>
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
            <div className="relative">
              <button
                onClick={() => setShowSettings(s => !s)}
                className="p-2 rounded-lg text-chess-text-muted hover:text-chess-text hover:bg-chess-surface-subtle transition-colors"
                aria-label="Game settings"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="5" r="2" fill="currentColor" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <circle cx="12" cy="19" r="2" fill="currentColor" />
                </svg>
              </button>
              {showSettings && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
                  <div className="absolute right-0 top-7 z-50 bg-chess-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)] w-56 py-2 px-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-chess-text">Rookie commentary</p>
                        <p className="text-[10px] text-chess-text-faint">Voice and speech bubbles</p>
                      </div>
                      <button
                        onClick={() => setAudioOn(v => !v)}
                        className={`relative w-10 h-6 rounded-full transition-colors ${audioOn ? 'bg-chess-green' : 'bg-chess-disabled'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${audioOn ? 'translate-x-4' : ''}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-chess-text">Move sounds</p>
                        <p className="text-[10px] text-chess-text-faint">Piece move and capture sounds</p>
                      </div>
                      <button
                        onClick={() => setSoundsOn(v => !v)}
                        className={`relative w-10 h-6 rounded-full transition-colors ${soundsOn ? 'bg-chess-green' : 'bg-chess-disabled'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${soundsOn ? 'translate-x-4' : ''}`} />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-chess-text">Rookie&apos;s mood</p>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={attitudeLevel}
                        onChange={(e) => setAttitudeLevel(Number(e.target.value))}
                        onPointerUp={(e) => {
                          const level = Number((e.target as HTMLInputElement).value);
                          const pick = selectByCategory(QUIP_POOL, `attitude:${level}`);
                          if (pick) speech.queueDirect(pick.text, 'high');
                        }}
                        onKeyUp={(e) => {
                          const level = Number((e.target as HTMLInputElement).value);
                          const pick = selectByCategory(QUIP_POOL, `attitude:${level}`);
                          if (pick) speech.queueDirect(pick.text, 'high');
                        }}
                        aria-label="Rookie's mood"
                        className="mt-2 w-full h-2 appearance-none bg-chess-disabled rounded-full accent-chess-green cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-chess-green [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-chess-green [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                      />
                      <div className="mt-0.5 flex justify-between text-[10px] text-chess-text-faint">
                        <span>Polite</span>
                        <span>Confrontational</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-chess-text">How often Rookie talks</p>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={talkativenessLevel}
                        onChange={(e) => setTalkativenessLevel(Number(e.target.value))}
                        onPointerUp={(e) => {
                          const level = Number((e.target as HTMLInputElement).value);
                          const pick = selectByCategory(QUIP_POOL, `talk:${level}`);
                          if (pick) speech.queueDirect(pick.text, 'high');
                        }}
                        onKeyUp={(e) => {
                          const level = Number((e.target as HTMLInputElement).value);
                          const pick = selectByCategory(QUIP_POOL, `talk:${level}`);
                          if (pick) speech.queueDirect(pick.text, 'high');
                        }}
                        aria-label="How often Rookie talks"
                        className="mt-2 w-full h-2 appearance-none bg-chess-disabled rounded-full accent-chess-green cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-chess-green [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-chess-green [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                      />
                      <div className="mt-0.5 flex justify-between text-[10px] text-chess-text-faint">
                        <span>Quiet</span>
                        <span>Chatty</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
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
              <div className="space-y-2 pt-1">
                {postGame.analysis ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-semibold text-chess-text-muted">Accuracy</span>
                    {postGame.analysis.playerMoveCount > 0 ? (
                      <span className={`text-lg font-black ${
                        Math.round(postGame.analysis.playerAccuracy) >= 80 ? 'text-chess-green' :
                        Math.round(postGame.analysis.playerAccuracy) >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>{Math.round(postGame.analysis.playerAccuracy)}%</span>
                    ) : (
                      <span className="text-xs font-semibold text-chess-text-faint">Unavailable</span>
                    )}
                  </div>
                ) : postGame.isAnalyzing ? (
                  <div className="h-1 w-full bg-chess-surface rounded-full overflow-hidden">
                    <div className="h-full bg-chess-green rounded-full transition-all duration-300" style={{ width: `${postGame.progress}%` }} />
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!user) {
                        setShowSignupPrompt(true);
                      } else {
                        resetToSetup();
                      }
                    }}
                    className="flex-1 py-2 bg-chess-green text-white font-bold rounded-xl text-sm"
                  >
                    Play Again
                  </button>
                  {moveLogRef.current.length > 0 && (
                    <button
                      onClick={() => {
                        setReviewMoveIndex(-1);
                        setPhase('review');
                      }}
                      className="flex-1 py-2 bg-chess-surface border border-chess-disabled text-chess-text font-bold rounded-xl text-sm"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            ) : phase === 'review' ? (
              <div className="space-y-2">
                <ReviewNav />
                <button
                  onClick={() => resetToSetup()}
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

      {/* Post-game transition screen */}
      {phase === 'gameover' && showActivityComplete && (
        <ActivityComplete
          source="play"
          mode="dismissible"
          outcome={
            gameResult === 'You win!' ? 'win'
              : gameResult === 'Rookie wins!' ? 'loss'
              : gameResult === 'You resigned' ? 'resign'
              : 'draw'
          }
          playerName={playerName || undefined}
          shareConfig={{
            shareUrl: 'https://chesspath.app/play',
            ogEndpoint: '/api/og/play',
            ogParams: {
              outcome: gameResult === 'You win!' ? 'win' : gameResult === 'Rookie wins!' || gameResult === 'You resigned' ? 'loss' : 'draw',
              level: String(rookieLevel),
            },
            source: 'play',
            title: 'Play Rookie | Chess Path',
            text: gameResult === 'You win!' ? 'I beat Rookie on Chess Path!' : 'I just played Rookie on Chess Path!',
          }}
          onDismiss={() => {
            setShowActivityComplete(false);
            setReviewMoveIndex(-1);
            setPhase('review');
          }}
          onContinue={() => {
            setShowActivityComplete(false);
            if (!user) {
              setShowSignupPrompt(true);
            } else {
              resetToSetup();
            }
          }}
        />
      )}

      {/* Guest signup prompt after game */}
      {showSignupPrompt && (
        <SignupPrompt source="play" onDismiss={() => { setShowSignupPrompt(false); resetToSetup(); }} />
      )}

      {/* Rookie asks for the player's name mid-game */}
      {showNameAsk && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[env(safe-area-inset-bottom,0)]">
          <RookieNameAsk
            source="play"
            onSubmit={(n) => {
              setPlayerNameValue(n);
              setShowNameAsk(false);
            }}
            onSpeak={speakQuip}
            isTalking={isTalking}
          />
        </div>
      )}

      {/* DEV-ONLY engine log + level picker — remove before shipping */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-2 right-2 z-50 max-h-[50vh] w-[360px] overflow-auto rounded-md bg-black/85 p-2 font-mono text-[10px] leading-tight text-green-300 shadow-lg">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-bold text-white">dev · level {rookieLevel}</span>
            <button onClick={() => setDevLog([])} className="text-white/60 hover:text-white">clear</button>
          </div>
          <div className="mb-2 flex flex-wrap gap-1">
            {[1,2,3,4,5,6,7,8,9,10].map((lv) => (
              <button
                key={lv}
                onClick={() => setRookieLevel(lv)}
                className={`h-6 w-6 rounded text-[10px] font-bold ${rookieLevel === lv ? 'bg-chess-green text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
              >
                {lv}
              </button>
            ))}
          </div>
          {devLog.slice().reverse().map((e, i) => (
            <div key={i} className={e.type === 'engine' ? 'text-yellow-300' : 'text-green-300'}>
              m{e.moveNum} · {e.type} · {e.summary}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
