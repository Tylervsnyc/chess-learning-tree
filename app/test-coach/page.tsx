'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { Chess, Square } from 'chess.js';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { playMoveSound, playCaptureSound, warmupAudio } from '@/lib/sounds';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import { useClickToMove } from '@/hooks/useClickToMove';
import { maia, type MaiaStatus } from '@/lib/maia/maia-adapter';
import type { MoveAnalysis } from '@/app/api/coach-review/route';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const ANIM_MS = 300;
const PLAYER_ELO = 1200;

type Phase = 'setup' | 'playing' | 'analyzing' | 'review';

interface MoveRecord {
  moveNumber: number;
  color: 'white' | 'black';
  san: string;
  uci: string;
  fenBefore: string;
  fenAfter: string;
  captured?: string;
}

// Review data from Claude
interface ReviewData {
  summary: string;
  moves: Record<string, string>; // "1w" -> commentary, "1b" -> commentary
  takeaway: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function cpToPawns(cp: number | null): string {
  if (cp === null) return '0.0';
  const val = cp / 100;
  return (val >= 0 ? '+' : '') + val.toFixed(1);
}

function evalBarPercent(cp: number | null): number {
  if (cp === null) return 50;
  // Sigmoid-ish mapping: +-500cp = roughly 90/10
  const clamped = Math.max(-1000, Math.min(1000, cp));
  return 50 + 50 * (2 / (1 + Math.exp(-clamped / 200)) - 1);
}

function getClassificationLabel(cls: MoveAnalysis['classification']): string | null {
  switch (cls) {
    case 'brilliant': return 'Brilliant';
    case 'great': return 'Good move';
    case 'blunder': return 'Blunder';
    case 'mistake': return 'Mistake';
    case 'inaccuracy': return 'Inaccuracy';
    default: return null;
  }
}

function getClassificationBadgeColor(cls: MoveAnalysis['classification']): string {
  switch (cls) {
    case 'brilliant': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    case 'great': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'blunder': return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'mistake': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case 'inaccuracy': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    default: return '';
  }
}

// ═════════════════════════════════════════════════════════════════════════════

export default function TestCoachPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [fen, setFen] = useState(START_FEN);
  const [selected, setSelected] = useState<Square | null>(null);
  const [lastMv, setLastMv] = useState<{ from: Square; to: Square } | null>(null);
  const [rookieThinking, setRookieThinking] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  // Maia status
  const [maiaStatus, setMaiaStatus] = useState<MaiaStatus>('idle');
  const [maiaProgress, setMaiaProgress] = useState(0);

  // Move history
  const moveHistoryRef = useRef<MoveRecord[]>([]);
  const moveNumRef = useRef(0);

  // Live analysis — evals collected during play (keyed by move index)
  const liveEvalsRef = useRef<Map<number, {
    evalBefore: number | null;
    evalAfter: number | null;
    bestMove: string | null;
    threat: string | null;
  }>>(new Map());

  // Analysis + review
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [analyzedMoves, setAnalyzedMoves] = useState<MoveAnalysis[]>([]);
  const [review, setReview] = useState<ReviewData | null>(null);
  const [reviewIndex, setReviewIndex] = useState(-1); // -1 = start
  const [reviewFen, setReviewFen] = useState(START_FEN);

  // Derived
  const game = useMemo(() => new Chess(fen), [fen]);
  const isMyTurn = game.turn() === 'w';

  // ── Engine init ────────────────────────────────────────────────────────────

  const sfReadyRef = useRef(false);

  useEffect(() => {
    stockfish.init().then(() => { sfReadyRef.current = true; }).catch(() => {});
    const unsub = maia.addListener({
      onStatus: setMaiaStatus,
      onProgress: setMaiaProgress,
    });
    maia.init();
    return () => { unsub(); };
  }, []);

  // ── Start game ─────────────────────────────────────────────────────────────

  const startGame = useCallback(async () => {
    warmupAudio();
    moveHistoryRef.current = [];
    moveNumRef.current = 0;
    liveEvalsRef.current.clear();
    setFen(START_FEN);
    setSelected(null);
    setLastMv(null);
    setGameResult(null);
    setReview(null);
    setAnalyzedMoves([]);
    setReviewIndex(-1);

    setMaiaStatus('loading');
    const ready = await maia.ensureReady();
    if (!ready) setMaiaStatus('error');

    setPhase('playing');
  }, []);

  // ── Live background analysis (runs during play) ────────────────────────────

  const analyzeMoveLive = useCallback((moveIdx: number, fenBefore: string, fenAfter: string) => {
    // Fire and forget — results stored in ref, no state updates during play
    (async () => {
      try {
        const fullBefore = await stockfish.getFullEval(fenBefore, 14);
        const fullAfter = await stockfish.getFullEval(fenAfter, 14);
        liveEvalsRef.current.set(moveIdx, {
          evalBefore: fullBefore?.cp ?? null,
          evalAfter: fullAfter?.cp ?? null,
          bestMove: fullBefore?.bestMove ?? null,
          threat: fullAfter?.bestMove ?? null,
        });
      } catch {
        // Non-critical — if it fails we'll re-analyze post-game
      }
    })();
  }, []);

  // ── Rookie's move ──────────────────────────────────────────────────────────

  const scheduleRookieMove = useCallback((currentFen: string) => {
    setRookieThinking(true);
    stockfish.getBestMove(currentFen, 5, 6).then((uciMove) => {
      if (!uciMove) { setRookieThinking(false); return; }
      const g = new Chess(currentFen);
      const from = uciMove.slice(0, 2) as Square;
      const to = uciMove.slice(2, 4) as Square;
      const promotion = uciMove.length > 4 ? uciMove[4] as 'q' | 'r' | 'b' | 'n' : undefined;
      const result = g.move({ from, to, promotion });
      if (!result) { setRookieThinking(false); return; }

      moveNumRef.current++;
      const moveIdx = moveHistoryRef.current.length;
      const newFen = g.fen();
      moveHistoryRef.current.push({
        moveNumber: Math.ceil(moveNumRef.current / 2),
        color: 'black',
        san: result.san,
        uci: uciMove,
        fenBefore: currentFen,
        fenAfter: newFen,
        captured: result.captured || undefined,
      });
      analyzeMoveLive(moveIdx, currentFen, newFen);

      setTimeout(() => {
        setFen(newFen);
        setLastMv({ from: result.from as Square, to: result.to as Square });
        setRookieThinking(false);
        if (result.captured) playCaptureSound(); else playMoveSound();
        if (g.isGameOver()) {
          const txt = g.isCheckmate() ? 'Rookie wins!' : g.isStalemate() ? 'Stalemate!' : 'Draw!';
          setGameResult(txt);
          setPhase('analyzing');
          runAnalysis(moveHistoryRef.current, txt);
        }
      }, 500);
    });
  }, []);

  // ── Player's move ──────────────────────────────────────────────────────────

  const tryMove = useCallback((from: Square, to: Square): boolean => {
    if (phase !== 'playing' || !isMyTurn || rookieThinking) return false;

    const g = new Chess(fen);
    const fenBefore = fen;
    const result = g.move({ from, to, promotion: 'q' });
    if (!result) return false;

    moveNumRef.current++;
    const uci = result.from + result.to + (result.promotion || '');
    const moveIdx = moveHistoryRef.current.length;
    const newFen = g.fen();
    moveHistoryRef.current.push({
      moveNumber: Math.ceil(moveNumRef.current / 2),
      color: 'white',
      san: result.san,
      uci,
      fenBefore,
      fenAfter: newFen,
      captured: result.captured || undefined,
    });
    analyzeMoveLive(moveIdx, fenBefore, newFen);

    setFen(newFen);
    setLastMv({ from: result.from as Square, to: result.to as Square });
    setSelected(null);
    if (result.captured) playCaptureSound(); else playMoveSound();

    if (g.isGameOver()) {
      const txt = g.isCheckmate() ? 'You win!' : g.isStalemate() ? 'Stalemate!' : 'Draw!';
      setGameResult(txt);
      setPhase('analyzing');
      runAnalysis(moveHistoryRef.current, txt);
    } else {
      scheduleRookieMove(g.fen());
    }
    return true;
  }, [fen, phase, isMyTurn, rookieThinking, scheduleRookieMove, analyzeMoveLive]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = useCallback((args: any) => {
    return tryMove(args.sourceSquare as Square, args.targetSquare as Square);
  }, [tryMove]);

  const onClickSquare = useClickToMove({
    game,
    ownColor: 'w',
    selectedSquare: selected,
    setSelectedSquare: setSelected,
    tryMove,
    enabled: phase === 'playing' && isMyTurn && !rookieThinking,
  });

  // ── Post-game analysis ─────────────────────────────────────────────────────

  const runAnalysis = useCallback(async (moves: MoveRecord[], result: string) => {
    const analyzed: MoveAnalysis[] = [];

    // Use live evals collected during play, only re-analyze if missing
    for (let i = 0; i < moves.length; i++) {
      const m = moves[i];
      let cached = liveEvalsRef.current.get(i);

      if (!cached) {
        setAnalysisProgress(`Finishing analysis: move ${i + 1}/${moves.length}...`);
        const fullBefore = await stockfish.getFullEval(m.fenBefore, 14);
        const fullAfter = await stockfish.getFullEval(m.fenAfter, 14);
        cached = {
          evalBefore: fullBefore?.cp ?? null,
          evalAfter: fullAfter?.cp ?? null,
          bestMove: fullBefore?.bestMove ?? null,
          threat: fullAfter?.bestMove ?? null,
        };
      }

      const { evalBefore, evalAfter, bestMove, threat } = cached;

      // Classify based on eval swing
      let classification: MoveAnalysis['classification'] = null;
      if (evalBefore !== null && evalAfter !== null) {
        const swing = m.color === 'white'
          ? evalBefore - evalAfter
          : evalAfter - evalBefore;

        if (swing > 300) classification = 'blunder';
        else if (swing > 150) classification = 'mistake';
        else if (swing > 75) classification = 'inaccuracy';
        else if (swing < -150) classification = 'brilliant';
        else if (swing < -50) classification = 'great';
        else classification = 'good';
      }

      analyzed.push({
        moveNumber: m.moveNumber,
        color: m.color,
        san: m.san,
        uci: m.uci,
        fen: m.fenBefore,
        evalBefore,
        evalAfter,
        bestMove,
        threat,
        classification,
      });
    }

    // Send to Claude
    setAnalysisProgress('Rookie is writing commentary...');

    try {
      const res = await fetch('/api/coach-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moves: analyzed,
          playerColor: 'white',
          playerElo: PLAYER_ELO,
          result,
        }),
      });

      const data = await res.json();
      if (data.review) {
        setAnalyzedMoves(analyzed);
        setReview(data.review);
        setReviewIndex(-1);
        setReviewFen(START_FEN);
        setPhase('review');
      } else {
        setAnalysisProgress('Review failed. Try again.');
      }
    } catch {
      setAnalysisProgress('Review failed. Try again.');
    }
  }, []);

  // ── Review navigation ──────────────────────────────────────────────────────

  const goToMove = useCallback((idx: number) => {
    const clamped = Math.max(-1, Math.min(idx, moveHistoryRef.current.length - 1));
    setReviewIndex(clamped);
    setReviewFen(clamped === -1 ? START_FEN : moveHistoryRef.current[clamped].fenAfter);
  }, []);

  // Current move's analysis data
  const currentAnalysis = reviewIndex >= 0 ? analyzedMoves[reviewIndex] : null;
  const currentRecord = reviewIndex >= 0 ? moveHistoryRef.current[reviewIndex] : null;

  // Current eval (after this move)
  const currentEval = currentAnalysis?.evalAfter ?? (reviewIndex === -1 ? 0 : null);

  // Commentary for current move
  const currentCommentary = useMemo(() => {
    if (!review) return null;
    if (reviewIndex === -1) return review.summary;
    const m = moveHistoryRef.current[reviewIndex];
    if (!m) return null;
    const key = `${m.moveNumber}${m.color === 'white' ? 'w' : 'b'}`;
    const moveComment = review.moves[key];
    // On last move, append takeaway
    if (reviewIndex === moveHistoryRef.current.length - 1) {
      return moveComment
        ? `${moveComment}\n\n${review.takeaway}`
        : review.takeaway;
    }
    return moveComment ?? null;
  }, [reviewIndex, review]);

  // Build arrows for the board
  // After a move, the board shows the resulting position. We show:
  //   - Best move: what the side-to-move should play next (golden)
  //   - Threat: same thing framed as "threat" — it IS the best move for the side to move
  // This avoids showing arrows for both sides simultaneously.
  const reviewArrows = useMemo(() => {
    if (reviewIndex < 0) return [];
    const arrows: { startSquare: string; endSquare: string; color: string }[] = [];

    // The "threat" is the opponent's best reply from the position AFTER this move.
    // That's the only arrow we need — it shows what's coming next from the
    // side whose turn it is on the board right now.
    if (currentAnalysis?.threat) {
      const from = currentAnalysis.threat.slice(0, 2);
      const to = currentAnalysis.threat.slice(2, 4);
      arrows.push({ startSquare: from, endSquare: to, color: 'rgba(218, 165, 32, 0.8)' }); // golden
    }

    return arrows;
  }, [reviewIndex, currentAnalysis]);

  // Build square styles for review
  const reviewSquareStyles = useMemo(() => {
    if (reviewIndex < 0 || !currentRecord || !currentAnalysis) return {};

    const cls = currentAnalysis.classification;
    const from = currentRecord.uci.slice(0, 2);
    const to = currentRecord.uci.slice(2, 4);

    // Red for mistakes/blunders
    if (cls === 'blunder' || cls === 'mistake') {
      return {
        [from]: { backgroundColor: 'rgba(239, 68, 68, 0.5)' },
        [to]: { backgroundColor: 'rgba(239, 68, 68, 0.5)' },
      };
    }

    // Green for great/brilliant
    if (cls === 'brilliant' || cls === 'great') {
      return {
        [from]: { backgroundColor: 'rgba(34, 197, 94, 0.45)' },
        [to]: { backgroundColor: 'rgba(34, 197, 94, 0.45)' },
      };
    }

    // Yellow for inaccuracy
    if (cls === 'inaccuracy') {
      return {
        [from]: { backgroundColor: 'rgba(234, 179, 8, 0.4)' },
        [to]: { backgroundColor: 'rgba(234, 179, 8, 0.4)' },
      };
    }

    // Normal: subtle highlight
    return {
      [from]: { backgroundColor: 'rgba(255, 170, 0, 0.3)' },
      [to]: { backgroundColor: 'rgba(255, 170, 0, 0.3)' },
    };
  }, [reviewIndex, currentRecord, currentAnalysis]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="overflow-auto flex flex-col items-center min-h-full bg-[#1a1a2e] text-white p-4 gap-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BreathingRook mood="neutral" size="sm" />
        <div>
          <h1 className="text-lg font-bold">Coach Rookie</h1>
          <p className="text-xs text-white/50">Stockfish + Maia + Claude</p>
        </div>
      </div>

      {/* Maia badge */}
      {phase === 'setup' && (
        <div className="text-xs px-3 py-1 rounded-full bg-white/10">
          Maia: {maiaStatus === 'ready' ? 'cached' : maiaStatus === 'idle' ? 'will download on start' : maiaStatus}
          {maiaStatus === 'downloading' && ` (${maiaProgress}%)`}
        </div>
      )}

      {/* ── SETUP ── */}
      {phase === 'setup' && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <p className="text-white/70 text-sm text-center max-w-xs">
            Play a game, then get a full move-by-move review with engine analysis, best moves, threats, and coaching commentary.
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold text-lg transition-colors"
          >
            Play a Game
          </button>
          <p className="text-white/30 text-xs">You play white. Maia model ~44MB (cached after first load).</p>
        </div>
      )}

      {/* ── PLAYING ── */}
      {phase === 'playing' && (
        <>
          <div className="w-full max-w-[min(90vw,400px)]">
            <ChessPathBoard
              options={{
                position: fen,
                onPieceDrop: onDrop,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSquareClick: (args: any) => onClickSquare(args.square as Square),
                boardOrientation: 'white',
                animationDurationInMs: ANIM_MS,
                allowDragging: isMyTurn && !rookieThinking,
                squareStyles: {
                  ...(lastMv ? {
                    [lastMv.from]: { backgroundColor: 'rgba(255, 170, 0, 0.4)' },
                    [lastMv.to]: { backgroundColor: 'rgba(255, 170, 0, 0.4)' },
                  } : {}),
                  ...(selected ? { [selected]: { backgroundColor: 'rgba(66, 135, 245, 0.5)' } } : {}),
                },
              }}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">
              {rookieThinking ? 'Rookie is thinking...' : isMyTurn ? 'Your move' : ''}
            </span>
            <button
              onClick={() => {
                setGameResult('You resigned');
                setPhase('analyzing');
                runAnalysis(moveHistoryRef.current, 'You resigned');
              }}
              className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
            >
              Resign
            </button>
          </div>
        </>
      )}

      {/* ── ANALYZING ── */}
      {phase === 'analyzing' && (
        <div className="flex flex-col items-center gap-4 mt-8">
          {gameResult && <p className="text-xl font-bold">{gameResult}</p>}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white/70 text-sm">{analysisProgress}</p>
          </div>
        </div>
      )}

      {/* ── REVIEW ── */}
      {phase === 'review' && (
        <>
          {/* Board area with side badges */}
          <div className="flex items-start gap-2 w-full max-w-[min(95vw,520px)]">
            {/* Side badges — threat + engine */}
            <div className="hidden sm:flex flex-col gap-2 pt-8 min-w-[80px] text-xs">
              {currentAnalysis && getClassificationLabel(currentAnalysis.classification) && (
                <span className={`px-2 py-1 rounded-lg border text-center ${getClassificationBadgeColor(currentAnalysis.classification)}`}>
                  {(currentAnalysis.classification === 'blunder' || currentAnalysis.classification === 'mistake') ? '\u{1F44E} ' : ''}
                  {(currentAnalysis.classification === 'brilliant' || currentAnalysis.classification === 'great') ? '\u2713 ' : ''}
                  {getClassificationLabel(currentAnalysis.classification)}
                </span>
              )}
              {currentAnalysis?.threat && (
                <span className="px-2 py-1 rounded-lg bg-white/10 text-white/50 text-center">
                  Threat<br />{currentAnalysis.threat}
                </span>
              )}
              {currentAnalysis?.bestMove && currentAnalysis.bestMove !== currentAnalysis.uci && (
                <span className="px-2 py-1 rounded-lg bg-white/10 text-white/50 text-center">
                  Engine<br />{currentAnalysis.bestMove}
                </span>
              )}
            </div>

            {/* Eval bar + board + controls stacked tight */}
            <div className="flex-1 flex flex-col gap-1 min-w-0">
              {/* Eval bar */}
              <div className="relative h-5 rounded-md overflow-hidden bg-[#333]">
                <div
                  className="h-full bg-white transition-all duration-500 ease-out"
                  style={{ width: `${evalBarPercent(currentEval)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-[11px] font-bold font-mono ${
                    (currentEval ?? 0) >= 0 ? 'text-black/70' : 'text-white/70'
                  }`}>
                    {cpToPawns(currentEval)}
                  </span>
                </div>
              </div>

              {/* Board */}
              <ChessPathBoard
                options={{
                  position: reviewFen,
                  boardOrientation: 'white',
                  animationDurationInMs: ANIM_MS,
                  allowDragging: false,
                  arrows: reviewArrows,
                  squareStyles: reviewSquareStyles,
                }}
              />

              {/* Nav controls — directly under board */}
              <div className="flex items-center justify-center gap-1.5 py-1">
                <button
                  onClick={() => goToMove(-1)}
                  disabled={reviewIndex === -1}
                  className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg transition-colors text-sm"
                >
                  &#x23EE;
                </button>
                <button
                  onClick={() => goToMove(reviewIndex - 1)}
                  disabled={reviewIndex === -1}
                  className="w-8 h-8 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 rounded-lg transition-colors font-bold"
                >
                  &#x2039;
                </button>
                <span className="text-xs text-white/40 min-w-[70px] text-center font-mono">
                  {reviewIndex === -1 ? 'Start' : `${reviewIndex + 1} of ${moveHistoryRef.current.length}`}
                </span>
                <button
                  onClick={() => goToMove(reviewIndex + 1)}
                  disabled={reviewIndex >= moveHistoryRef.current.length - 1}
                  className="w-8 h-8 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 rounded-lg transition-colors font-bold"
                >
                  &#x203A;
                </button>
                <button
                  onClick={() => goToMove(moveHistoryRef.current.length - 1)}
                  disabled={reviewIndex >= moveHistoryRef.current.length - 1}
                  className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg transition-colors text-sm"
                >
                  &#x23ED;
                </button>
              </div>
            </div>
          </div>

          {/* Mobile badges — shown below board on small screens */}
          <div className="flex sm:hidden flex-wrap items-center justify-center gap-2 text-xs">
            {currentAnalysis && getClassificationLabel(currentAnalysis.classification) && (
              <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${getClassificationBadgeColor(currentAnalysis.classification)}`}>
                {(currentAnalysis.classification === 'blunder' || currentAnalysis.classification === 'mistake') ? '\u{1F44E} ' : ''}
                {(currentAnalysis.classification === 'brilliant' || currentAnalysis.classification === 'great') ? '\u2713 ' : ''}
                {getClassificationLabel(currentAnalysis.classification)}
              </span>
            )}
            {currentAnalysis?.threat && (
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                Threat: {currentAnalysis.threat}
              </span>
            )}
            {currentAnalysis?.bestMove && currentAnalysis.bestMove !== currentAnalysis.uci && (
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                Engine: {currentAnalysis.bestMove}
              </span>
            )}
          </div>

          {/* Commentary */}
          {currentCommentary && (
            <div className={`w-full max-w-[400px] rounded-xl p-3 ${
              reviewIndex === -1 ? 'bg-emerald-500/15 border border-emerald-500/20' : 'bg-white/5'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-line">{currentCommentary}</p>
            </div>
          )}

          {/* Result + play again */}
          <div className="flex items-center gap-4">
            {gameResult && <span className="text-sm text-white/50">{gameResult}</span>}
            <button
              onClick={() => setPhase('setup')}
              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-sm text-emerald-300 transition-colors"
            >
              Play Again
            </button>
          </div>
        </>
      )}
    </div>
  );
}
