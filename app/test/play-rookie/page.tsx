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
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import { useRookieVoice } from '@/hooks/useRookieVoice';
import { useClickToMove, reconcileSelectionAfterOpponentMove } from '@/hooks/useClickToMove';

const SKILL_LEVELS = [
  { name: 'Beginner', label: 'I just learned the rules' },
  { name: 'Casual', label: 'I know the basics' },
  { name: 'Intermediate', label: 'I play sometimes' },
  { name: 'Advanced', label: 'I study chess' },
  { name: 'Expert', label: 'Challenge me' },
];

// [skillLevel, depth, multiPV, poolSize]
const SF_CONFIG: [number, number, number, number][] = [
  [0,  3,  8, 8],  // Beginner — shallow + wide pool
  [3,  5,  4, 3],  // Casual
  [8,  8,  2, 2],  // Intermediate
  [14, 12, 2, 1],  // Advanced
  [20, 16, 1, 1],  // Expert
];

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const ANIM_MS = 300;

type Phase = 'setup' | 'playing' | 'gameover';

// ════════════════════════════════
// DEBUG LOG
// ════════════════════════════════
interface DebugEntry {
  id: number;
  moveNum: number;
  timestamp: number;
  type: 'move' | 'mood' | 'quip' | 'engine' | 'game-event';
  who: 'player' | 'rookie' | 'system';
  summary: string;
  details: Record<string, unknown>;
}

let debugIdCounter = 0;

export default function RookieChatPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [skillLevel, setSkillLevel] = useState(1);
  const [playerName, setPlayerName] = useState('');

  // FEN is the single source of truth for board state
  const [fen, setFen] = useState(START_FEN);
  const [selected, setSelected] = useState<Square | null>(null);
  const [lastMv, setLastMv] = useState<{ from: Square; to: Square } | null>(null);
  const [rookieThinking, setRookieThinking] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  // Quip state
  const [rookieText, setRookieText] = useState<string | null>(null);
  const [audioOn, setAudioOn] = useState(true);
  const [msgKey, setMsgKey] = useState(0);
  const [rookieMood, setRookieMood] = useState<RookieMood>('neutral');

  // Debug log
  const [debugLog, setDebugLog] = useState<DebugEntry[]>([]);
  const [debugOpen, setDebugOpen] = useState(false);
  const debugEndRef = useRef<HTMLDivElement>(null);

  const log = useCallback((entry: Omit<DebugEntry, 'id' | 'timestamp'>) => {
    setDebugLog(prev => [...prev, { ...entry, id: debugIdCounter++, timestamp: Date.now() }]);
  }, []);

  const moveNumRef = useRef(0);
  const rookieTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll debug log
  useEffect(() => {
    if (debugOpen && debugEndRef.current) {
      debugEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [debugLog, debugOpen]);

  // Stockfish init
  const sfReadyRef = useRef(false);
  useEffect(() => {
    stockfish.init().then(() => { sfReadyRef.current = true; }).catch(() => {});
  }, []);

  // Derive game state from FEN (no mutable ref)
  const game = useMemo(() => new Chess(fen), [fen]);
  const isGameOver = game.isGameOver();
  const currentTurn = game.turn();
  const isMyTurn = (currentTurn === 'w' && playerColor === 'white') || (currentTurn === 'b' && playerColor === 'black');

  // ════════════════════════════════
  // AUDIO (with real-time amplitude for talk animation)
  // ════════════════════════════════
  const { speakQuip, talkIntensity, isTalking, lastSpokeAtRef } = useRookieVoice(audioOn);

  const QUIP_COOLDOWN_MS = 2000;

  const showRookieMsg = useCallback((text: string) => {
    if (isTalking) return;
    if (Date.now() - lastSpokeAtRef.current < QUIP_COOLDOWN_MS) return;

    setRookieText(text);
    setMsgKey(k => k + 1);
    speakQuip(text);
  }, [speakQuip, isTalking, lastSpokeAtRef]);

  // ════════════════════════════════
  // BINARY BLURTS (visual-only)
  // ════════════════════════════════

  // ════════════════════════════════
  // MOOD — octopus color shifts based on game state
  // ════════════════════════════════
  const prevMoodRef = useRef<RookieMood>('neutral');
  const moodSetAtMoveRef = useRef(0); // move number when mood last changed
  const MOOD_HOLD_MOVES = 4; // hold a mood for at least this many moves

  const updateMood = useCallback((g: Chess, movedBy: 'player' | 'rookie', captured?: string) => {
    let newMood: RookieMood = 'neutral';
    let isHighPriority = false;
    let trigger = 'none';

    if (g.isCheckmate()) {
      const loser = g.turn();
      const rookieLost = (loser === 'w' && playerColor === 'black') || (loser === 'b' && playerColor === 'white');
      newMood = rookieLost ? 'angry' : 'smug';
      isHighPriority = true;
      trigger = `checkmate — rookie ${rookieLost ? 'lost' : 'won'}`;
    } else if (g.isDraw() || g.isStalemate()) {
      newMood = 'nervous';
      isHighPriority = true;
      trigger = g.isStalemate() ? 'stalemate' : 'draw';
    } else if (g.isCheck()) {
      newMood = movedBy === 'player' ? 'surprised' : 'smug';
      isHighPriority = true;
      trigger = `check by ${movedBy}`;
    } else if (captured) {
      const bigPiece = ['q', 'r'].includes(captured);
      if (movedBy === 'rookie') {
        newMood = bigPiece ? 'excited' : 'happy';
      } else {
        newMood = bigPiece ? 'panicking' : 'nervous';
      }
      isHighPriority = true;
      trigger = `${movedBy} captured ${captured}${bigPiece ? ' (big piece)' : ''}`;
    } else {
      // Material count for general vibe
      const fenPos = g.fen().split(' ')[0];
      const rookiePieces = playerColor === 'white' ? fenPos.replace(/[^pnbrqk]/g, '') : fenPos.replace(/[^PNBRQK]/g, '');
      const playerPieces = playerColor === 'white' ? fenPos.replace(/[^PNBRQK]/g, '') : fenPos.replace(/[^pnbrqk]/g, '');
      const rookieMat = rookiePieces.length;
      const playerMat = playerPieces.length;
      if (rookieMat > playerMat + 2) { newMood = 'happy'; trigger = `material: rookie ${rookieMat} vs player ${playerMat}`; }
      else if (playerMat > rookieMat + 2) { newMood = 'nervous'; trigger = `material: rookie ${rookieMat} vs player ${playerMat}`; }
      else { trigger = `material even: rookie ${rookieMat} vs player ${playerMat}`; }
    }

    // Hold current mood unless high priority or enough moves have passed
    const movesSinceMoodChange = moveNumRef.current - moodSetAtMoveRef.current;
    if (!isHighPriority && newMood !== prevMoodRef.current && movesSinceMoodChange < MOOD_HOLD_MOVES) {
      log({
        moveNum: moveNumRef.current,
        type: 'mood',
        who: 'system',
        summary: `HELD mood at "${prevMoodRef.current}" (would be "${newMood}")`,
        details: { trigger, isHighPriority, movesSinceMoodChange, holdThreshold: MOOD_HOLD_MOVES, prevMood: prevMoodRef.current, proposedMood: newMood },
      });
      return;
    }

    if (newMood === prevMoodRef.current) {
      log({
        moveNum: moveNumRef.current,
        type: 'mood',
        who: 'system',
        summary: `Mood unchanged: "${newMood}"`,
        details: { trigger, isHighPriority },
      });
      return;
    }

    log({
      moveNum: moveNumRef.current,
      type: 'mood',
      who: 'system',
      summary: `Mood: "${prevMoodRef.current}" -> "${newMood}"`,
      details: { trigger, isHighPriority, movesSinceMoodChange, prevMood: prevMoodRef.current },
    });

    setRookieMood(newMood);
    prevMoodRef.current = newMood;
    moodSetAtMoveRef.current = moveNumRef.current;

  }, [playerColor, showRookieMsg, log]);

  // ════════════════════════════════
  // ROOKIE'S TURN — schedules a FEN update after delay
  // ════════════════════════════════
  const scheduleRookieMove = useCallback((currentFen: string) => {
    setRookieThinking(true);

    const applyRookieMove = (moveInfo: { from: string; to: string; promotion?: string } | { san: string }) => {
      // Create fresh game from the FEN Rookie is responding to
      const g = new Chess(currentFen);
      const result = 'san' in moveInfo
        ? g.move(moveInfo.san)
        : g.move({ from: moveInfo.from as Square, to: moveInfo.to as Square, promotion: (moveInfo.promotion || 'q') as 'q' | 'r' | 'b' | 'n' });
      if (!result) { setRookieThinking(false); return; }

      moveNumRef.current++;
      const newFen = g.fen();

      log({
        moveNum: moveNumRef.current,
        type: 'move',
        who: 'rookie',
        summary: `Rookie plays ${result.san}${result.captured ? ` (captures ${result.captured})` : ''}${g.isCheck() ? '+' : ''}`,
        details: { san: result.san, from: result.from, to: result.to, captured: result.captured || null, isCheck: g.isCheck(), fen: newFen },
      });

      // Update FEN — react-chessboard diffs old vs new position and animates
      setFen(newFen);
      setLastMv({ from: result.from as Square, to: result.to as Square });
      setSelected(prev => reconcileSelectionAfterOpponentMove(prev, result));
      setRookieThinking(false);

      // Sound after move (Lichess pattern: move/capture, then check on top)
      if (result.captured) playCaptureSound();
      else playMoveSound();


      updateMood(g, 'rookie', result.captured || undefined);

      if (g.isGameOver()) {
        const resultText = g.isCheckmate()
          ? (() => { const loser = g.turn(); const iLost = (loser === 'w' && playerColor === 'white') || (loser === 'b' && playerColor === 'black'); return iLost ? 'Rookie wins!' : 'You win!'; })()
          : g.isStalemate() ? 'Stalemate!' : 'Draw!';

        log({ moveNum: moveNumRef.current, type: 'game-event', who: 'system', summary: `Game over: ${resultText}`, details: { checkmate: g.isCheckmate(), stalemate: g.isStalemate(), draw: g.isDraw() } });

        if (g.isCheckmate()) {
          const loser = g.turn();
          const iLost = (loser === 'w' && playerColor === 'white') || (loser === 'b' && playerColor === 'black');
          setGameResult(iLost ? 'Rookie wins!' : 'You win!');
          if (!iLost) playCelebrationSound();
        } else {
          setGameResult(g.isStalemate() ? 'Stalemate!' : 'Draw!');
        }
        setPhase('gameover');
      }
    };

    if (!sfReadyRef.current) {
      log({ moveNum: moveNumRef.current + 1, type: 'engine', who: 'rookie', summary: `stockfish not ready — skip`, details: { skillLevel } });
      setRookieThinking(false);
      return;
    }

    const [sfSkill, sfDepth, sfMultiPV, sfPool] = SF_CONFIG[Math.min(skillLevel, SF_CONFIG.length - 1)];
    const thinkStart = Date.now();
    log({ moveNum: moveNumRef.current + 1, type: 'engine', who: 'rookie', summary: `Engine: stockfish skill=${sfSkill} depth=${sfDepth} multiPV=${sfMultiPV} pool=${sfPool}`, details: { engine: 'stockfish', sfSkill, sfDepth, sfMultiPV, sfPool, skillLevel } });
    stockfish.getBestMoveSampled(currentFen, sfSkill, sfDepth, sfMultiPV, sfPool).then((uciMove) => {
      if (!uciMove) { setRookieThinking(false); return; }
      const from = uciMove.slice(0, 2);
      const to = uciMove.slice(2, 4);
      const promotion = uciMove.length > 4 ? uciMove[4] : undefined;
      const wait = Math.max(0, 500 - (Date.now() - thinkStart));
      rookieTimerRef.current = setTimeout(() => applyRookieMove({ from, to, promotion }), wait);
    });
  }, [skillLevel, playerName, playerColor, showRookieMsg, updateMood]);

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
      const newFen = g.fen();

      log({
        moveNum: moveNumRef.current,
        type: 'move',
        who: 'player',
        summary: `Player plays ${result.san}${result.captured ? ` (captures ${result.captured})` : ''}${g.isCheck() ? '+' : ''}`,
        details: { san: result.san, from: result.from, to: result.to, captured: result.captured || null, isCheck: g.isCheck(), fen: newFen },
      });

      setFen(newFen);
      setLastMv({ from, to });
      setSelected(null);

      // Sound (Lichess pattern: move/capture sound, then check layered on top)
      if (result.captured) playCaptureSound();
      else playMoveSound();


      updateMood(g, 'player', result.captured || undefined);

      if (g.isGameOver()) {
        const resultText = g.isCheckmate()
          ? (() => { const loser = g.turn(); const iLost = (loser === 'w' && playerColor === 'white') || (loser === 'b' && playerColor === 'black'); return iLost ? 'Rookie wins!' : 'You win!'; })()
          : g.isStalemate() ? 'Stalemate!' : 'Draw!';
        log({ moveNum: moveNumRef.current, type: 'game-event', who: 'system', summary: `Game over: ${resultText}`, details: { checkmate: g.isCheckmate(), stalemate: g.isStalemate(), draw: g.isDraw() } });

        if (g.isCheckmate()) {
          const loser = g.turn();
          const iLost = (loser === 'w' && playerColor === 'white') || (loser === 'b' && playerColor === 'black');
          setGameResult(iLost ? 'Rookie wins!' : 'You win!');
          if (!iLost) playCelebrationSound();
        } else {
          setGameResult(g.isStalemate() ? 'Stalemate!' : 'Draw!');
        }
        setPhase('gameover');
        return true;
      }

      // Wait for board animation to fully complete before Rookie responds.
      // ANIM_MS + 150ms buffer ensures react-chessboard's position diff,
      // CSS transition, and setTimeout resolution are all done.
      setTimeout(() => scheduleRookieMove(newFen), ANIM_MS + 150);
      return true;
    } catch {
      return false;
    }
  }, [fen, playerColor, playerName, showRookieMsg, scheduleRookieMove, updateMood]);

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
  useEffect(() => {
    if (phase === 'playing' && playerColor === 'black') {
      scheduleRookieMove(fen);
    }
    // Only on phase change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ════════════════════════════════
  // SQUARE STYLES (Lichess-style highlights)
  // ════════════════════════════════
  const sqStyles = useMemo(() => {
    const s: Record<string, React.CSSProperties> = {};
    // Last move highlight
    if (lastMv) {
      s[lastMv.from] = { background: 'rgba(255, 170, 0, 0.4)' };
      s[lastMv.to] = { background: 'rgba(255, 170, 0, 0.4)' };
    }
    // Check highlight — red glow on king square (like Lichess)
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
    // Selected piece + legal move dots
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
    if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
    moveNumRef.current = 0;
    setFen(START_FEN);
    setLastMv(null);
    setSelected(null);
    setGameResult(null);
    setRookieThinking(false);
    setRookieText(null);
    setRookieMood('neutral');
    setDebugLog([]);
    debugIdCounter = 0;

    setPhase('playing');
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
    };
  }, []);

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
            <label className="text-xs font-semibold text-chess-text-muted uppercase tracking-wide mb-2 block">
              Rookie&apos;s strength
            </label>
            <div className="space-y-2">
              {SKILL_LEVELS.map((lv, i) => (
                <button
                  key={lv.name}
                  onClick={() => setSkillLevel(i)}
                  className={`w-full py-2.5 px-4 rounded-xl text-left transition-all flex items-center justify-between ${
                    skillLevel === i
                      ? 'bg-chess-green/15 border-2 border-chess-green text-chess-text'
                      : 'bg-chess-surface border border-chess-disabled text-chess-text-muted hover:border-chess-green/50'
                  }`}
                >
                  <span className="font-semibold text-sm">{lv.name}</span>
                  <span className="text-xs opacity-70">{lv.label}</span>
                </button>
              ))}
            </div>
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
  // GAME SCREEN
  // ════════════════════════════════
  return (
    <div className="h-[100dvh] bg-chess-page text-chess-text flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0">
        <button onClick={() => setPhase('setup')} className="text-chess-text-muted text-sm font-medium">
          Quit
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-chess-text-muted font-medium">{SKILL_LEVELS[skillLevel].name}</span>
          <button
            onClick={() => setAudioOn(!audioOn)}
            className="text-chess-text-muted text-xs px-2 py-1 rounded-lg hover:bg-chess-surface transition-colors"
          >
            {audioOn ? 'Sound On' : 'Sound Off'}
          </button>
        </div>
      </div>

      {/* Board area — pinned to top, never shifts */}
      <div className="flex-1 flex items-start justify-center px-4 pt-2 min-h-0">
        <div className="w-full max-w-lg">
          {/* Rookie (left) + Speech bubble (right) — fixed height so board never shifts */}
          <div className="flex items-start gap-3 pb-4 h-[116px] relative z-10 overflow-visible">
            <div className="flex-shrink-0 relative">
              <BreathingRook
                size="md"
                animation={rookieThinking ? 'think' : undefined}
                animate={!rookieThinking && !isTalking}
                mood={rookieMood}
                talkIntensity={isTalking && !rookieThinking ? talkIntensity : undefined}
              />
            </div>

            <div className="flex-1 flex items-center">
              {rookieText && (
                <div key={msgKey} className="relative rookie-glitch">
                  <div
                    className="absolute top-4 -left-[6px] w-3 h-3 bg-chess-surface rotate-45 rounded-[2px]"
                    style={{ boxShadow: '-1px 1px 2px rgba(0,0,0,0.04)' }}
                  />
                  <div className="relative bg-chess-surface rounded-2xl px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]">
                    <p className="text-chess-text text-[14px] leading-relaxed font-medium glitch-text line-clamp-3">
                      {rookieText}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <ChessPathBoard
            options={{
              position: fen,
              boardOrientation: playerColor,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onPieceDrop: (args: any) => {
                if (rookieThinking) return false;
                // Return true so react-chessboard knows the drop succeeded.
                // This sets manuallyDroppedPieceAndSquare internally, which:
                // 1. Keeps the dragged piece at its destination (no snap-back)
                // 2. Skips animation for the player's move (piece is already there)
                // 3. Allows Rookie's next move to animate properly
                return doPlayerMove(args.sourceSquare as Square, args.targetSquare as Square);
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onSquareClick: (args: any) => onClickSquare(args.square as Square),
              squareStyles: sqStyles,
              animationDurationInMs: ANIM_MS,
            }}
          />

          {/* Status — fixed height so board never shifts */}
          <div className="text-center mt-2 h-5">
            {phase === 'playing' && isMyTurn && !rookieThinking ? (
              <span className="text-xs font-semibold text-chess-green">Your move</span>
            ) : phase === 'playing' && rookieThinking ? (
              <span className="text-xs font-medium text-chess-text-faint">Rookie is thinking...</span>
            ) : null}
          </div>
        </div>
      </div>

      {phase === 'gameover' && gameResult && (
        <div className="px-4 pb-6 pt-2 flex-shrink-0">
          <div className="max-w-lg mx-auto text-center space-y-3">
            <p className="text-xl font-black">{gameResult}</p>
            <button
              onClick={() => setPhase('setup')}
              className="w-full py-3 bg-chess-green text-white font-bold rounded-xl shadow-[0_3px_0_var(--color-chess-green-dark)] active:translate-y-[1px] active:shadow-[0_2px_0_var(--color-chess-green-dark)] transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

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
            {debugLog.length === 0 && (
              <div className="px-4 py-3 text-gray-500">No events yet. Make a move...</div>
            )}
            {debugLog.map((entry) => {
              const colors: Record<string, string> = {
                move: 'text-blue-400',
                mood: 'text-yellow-400',
                quip: 'text-green-400',
                engine: 'text-purple-400',
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
    </div>
  );
}
