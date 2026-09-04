'use client';

/**
 * GameReview — the full-screen game review, matching /play's review phase
 * feature-for-feature: move-by-move navigation (|< < label > >|), Claude
 * coach commentary per move + summary at the start + takeaway on the last
 * move, key-moment descriptions with red/green arrows, the golden
 * best-response arrow on regular moves (toggle shared with /play's settings
 * menu), blunder/mistake square tinting, the check highlight, the whole-game
 * eval graph (tap to seek), the shared ReviewNav controls, the exit button
 * pinned to the bottom, and (behind REVIEW_VARIATIONS)
 * "Try it" variations: move either side from any reviewed position, the
 * engine's best-move arrow follows whoever is to move, amber "Trying:" label,
 * "Back to game" returns to the mainline (hooks/useReviewBranch.ts).
 *
 * /play's review is still rendered in-page (it shares the live board and the
 * evals collected during play); this component is the same experience for
 * surfaces that review after the fact — feed it a ReviewMove log and the
 * useGameReview hook's data. Do NOT build a third review UI.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess, type Square } from 'chess.js';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { EvalGraph } from '@/components/shared/EvalGraph';
import { ReviewNav } from '@/components/shared/ReviewNav';
import { useBestArrowSetting } from '@/hooks/useBestArrowSetting';
import {
  ARROW_BEST,
  commentaryKey,
  getArrowColor,
  START_FEN,
  type ReviewMove,
} from '@/lib/review/review-core';
import type { GameReviewData } from '@/hooks/useGameReview';
import { BADGE_SPECS, badgeSquareStyle } from '@/lib/review/move-badges';
import type { MoveClassification } from '@/lib/game-eval';
import { useReviewBranch } from '@/hooks/useReviewBranch';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

interface GameReviewProps {
  moves: ReviewMove[];
  playerColor: 'white' | 'black';
  playerName?: string;
  /** Analysis + coach data — pass the useGameReview hook's return. */
  review: GameReviewData;
  onExit: () => void;
  /** Label for the exit button (e.g. "Play Again", "Back to the result"). */
  exitLabel?: string;
  startFen?: string;
}

type ReviewArrow = { startSquare: string; endSquare: string; color: string };

// "Try it" variations — one implementation, one flag (same as /play).
const canBranch = FEATURE_FLAGS.REVIEW_VARIATIONS;

export function GameReview({
  moves,
  playerColor,
  playerName,
  review,
  onExit,
  exitLabel = 'Done',
  startFen = START_FEN,
}: GameReviewProps) {
  const [moveIndex, setMoveIndex] = useState(-1);
  const [fen, setFen] = useState(startFen);
  const [lastMv, setLastMv] = useState<{ from: Square; to: Square } | null>(null);
  const [reviewText, setReviewText] = useState<string | null>(null);
  const [arrows, setArrows] = useState<ReviewArrow[]>([]);
  // Tap-to-move selection (branching only).
  const [selected, setSelected] = useState<Square | null>(null);
  // Mirror for the data-arrival effect below — navigate() must not depend on
  // moveIndex or every tap would rebuild it.
  const moveIndexRef = useRef(-1);
  // Golden best-reply arrow on/off — same per-device key as /play's settings menu.
  const { showBestArrow, showBestArrowRef, setShowBestArrow } = useBestArrowSetting();

  const {
    analysis, isAnalyzing, progress, keyMoments, positionEvals,
    coachReady, coachMoves, coachSummary, coachTakeaway,
  } = review;

  // ── "Try it" branch — rooted at the MAINLINE position (moveIndexRef), not
  // the displayed fen, so it stays put while the board follows the branch.
  const movesRef = useRef(moves);
  movesRef.current = moves;
  const positionEvalsRef = useRef(positionEvals);
  positionEvalsRef.current = positionEvals;
  const branch = useReviewBranch({
    getMainline: () => {
      const ply = moveIndexRef.current;
      const move = ply >= 0 ? movesRef.current[ply] : null;
      const rootPly = move ? ply : -1;
      return {
        ply: rootPly,
        fen: move ? move.fenAfter : startFen,
        eval: positionEvalsRef.current[rootPly + 1] ?? null,
      };
    },
  });

  const navigate = useCallback((index: number) => {
    if (index < 0) {
      // Before first move — starting position + game summary
      moveIndexRef.current = -1;
      setMoveIndex(-1);
      setFen(startFen);
      setLastMv(null);
      setArrows([]);
      setReviewText(coachSummary || 'Starting position');
      return;
    }
    if (index >= moves.length) index = moves.length - 1;
    moveIndexRef.current = index;
    setMoveIndex(index);

    const move = moves[index];
    setFen(move.fenAfter);
    setLastMv({ from: move.from as Square, to: move.to as Square });

    // Claude commentary key: "1w" or "1b" (chess move numbers, not plies)
    const coachText = coachMoves[commentaryKey(index, move.movedBy, playerColor)];

    // On last move, append takeaway
    let displayText = coachText || null;
    if (index === moves.length - 1 && coachTakeaway) {
      displayText = displayText ? `${displayText}\n\n${coachTakeaway}` : coachTakeaway;
    }

    // Key moment on this move? Prefer Claude commentary over its description.
    const moment = keyMoments.find(
      (m) => m.moveNumber === move.moveNumber && m.movedBy === move.movedBy,
    );
    if (moment) {
      setReviewText(displayText || moment.description);
      setArrows([{
        startSquare: moment.from,
        endSquare: moment.to,
        color: getArrowColor(moment.type),
      }]);
      return;
    }

    // Regular move — Claude commentary or fallback to SAN
    if (displayText) {
      setReviewText(displayText);
    } else {
      const moveLabel = move.movedBy === 'player' ? (playerName || 'You') : 'Rookie';
      setReviewText(`${moveLabel} played ${move.san}`);
    }

    // Best move arrow (golden) — the engine's best response from this position
    const posEval = positionEvals[index + 1];
    if (posEval?.bestMove && showBestArrowRef.current) {
      setArrows([{
        startSquare: posEval.bestMove.slice(0, 2),
        endSquare: posEval.bestMove.slice(2, 4),
        color: ARROW_BEST,
      }]);
    } else {
      setArrows([]);
    }
  }, [moves, playerColor, playerName, startFen, coachMoves, coachSummary, coachTakeaway, keyMoments, positionEvals, showBestArrowRef]);

  // Initial position, and re-render the current position whenever analysis /
  // key moments / Claude commentary land (navigate's identity tracks the data).
  useEffect(() => {
    navigate(moveIndexRef.current);
  }, [navigate]);

  // ── Branch wiring ─────────────────────────────────────────────────────────
  const inBranch = branch.inBranch;
  // The board follows the branch cursor; the mainline state stays untouched.
  const shownFen = inBranch && branch.currentFen ? branch.currentFen : fen;
  const branchMove = branch.currentMove;
  const shownLastMv = useMemo<{ from: Square; to: Square } | null>(() => (
    inBranch
      ? (branchMove ? { from: branchMove.from as Square, to: branchMove.to as Square } : null)
      : lastMv
  ), [inBranch, branchMove, lastMv]);
  const game = useMemo(() => {
    try { return new Chess(shownFen); } catch { return null; }
  }, [shownFen]);

  // Any position change drops the tap selection.
  useEffect(() => { setSelected(null); }, [shownFen]);

  const exitBranch = useCallback(() => {
    const root = branch.rootPly;
    branch.exit();
    setSelected(null);
    navigate(root);
  }, [branch, navigate]);

  const reviewPrev = useCallback(() => {
    if (branch.inBranch) {
      if (branch.cursor < 0) exitBranch();
      else branch.back();
      return;
    }
    navigate(moveIndex - 1);
  }, [branch, exitBranch, navigate, moveIndex]);

  const reviewNext = useCallback(() => {
    if (branch.inBranch) { branch.forward(); return; }
    navigate(moveIndex + 1);
  }, [branch, navigate, moveIndex]);

  // Tapping the graph always returns to the mainline.
  const selectGraphMove = useCallback((index: number) => {
    if (branch.inBranch) { branch.exit(); setSelected(null); }
    navigate(index);
  }, [branch, navigate]);

  /** Board drop: start or extend the branch (queen promotion). */
  const onReviewDrop = useCallback((from: Square, to: Square): boolean => {
    if (!canBranch) return false;
    return branch.startOrExtend(from, to);
  }, [branch]);

  /** Tap-to-move: the side to move owns the pieces (both sides are the user). */
  const onReviewSquareClick = useCallback((square: Square) => {
    if (!canBranch || !game) return;
    const turn = game.turn();
    const piece = game.get(square);
    if (!selected) {
      if (piece && piece.color === turn) setSelected(square);
      return;
    }
    if (selected === square) { setSelected(null); return; }
    const legal = game.moves({ square: selected, verbose: true }).some((m) => m.to === square);
    if (legal) {
      branch.startOrExtend(selected, square);
      setSelected(null);
      return;
    }
    setSelected(piece && piece.color === turn ? square : null);
  }, [game, selected, branch]);

  // Best-move arrow for the branch position (instant PV hint, then depth 12).
  const branchArrows = useMemo<ReviewArrow[]>(() => {
    if (!branch.inBranch || !showBestArrow || !branch.bestMoveForCurrent) return [];
    const uci = branch.bestMoveForCurrent;
    return [{ startSquare: uci.slice(0, 2), endSquare: uci.slice(2, 4), color: ARROW_BEST }];
  }, [branch.inBranch, branch.bestMoveForCurrent, showBestArrow]);
  const shownArrows = inBranch ? branchArrows : arrows;

  // Leaving the review clears the branch.
  const branchExit = branch.exit;
  const handleExit = useCallback(() => {
    branchExit();
    onExit();
  }, [branchExit, onExit]);

  // ── Square styles: classification badge + tint on the move played ────────
  const currentClassification = useMemo(() => {
    if (inBranch) return null; // no classification tint on a tried line
    const cls = moveIndex >= 0 && analysis ? analysis.moves[moveIndex]?.classification ?? null : null;
    return cls === 'unknown' ? null : cls; // ungradable move — show no badge
  }, [moveIndex, analysis, inBranch]);

  const sqStyles = useMemo(() => {
    const s: Record<string, React.CSSProperties> = {};
    if (shownLastMv) {
      const tint = currentClassification
        ? BADGE_SPECS[currentClassification].tint
        : 'rgba(255, 170, 0, 0.4)'; // default orange while analysis is pending / in a branch
      s[shownLastMv.from] = { background: tint };
      // Destination: matching tint + the corner badge (longhand props — a
      // `background` shorthand would wipe the badge image).
      s[shownLastMv.to] = currentClassification
        ? badgeSquareStyle(currentClassification)
        : { background: tint };
    }
    if (game?.isCheck()) {
      const kingColor = game.turn();
      for (const row of game.board()) {
        for (const sq of row) {
          if (sq && sq.type === 'k' && sq.color === kingColor) {
            s[sq.square] = {
              ...s[sq.square],
              background:
                'radial-gradient(ellipse at center, rgba(255, 0, 0, 0.8) 0%, rgba(255, 0, 0, 0.35) 40%, rgba(255, 0, 0, 0) 70%)',
            };
          }
        }
      }
    }
    if (selected && game) {
      s[selected] = { ...s[selected], background: 'rgba(20, 85, 200, 0.5)' };
      for (const m of game.moves({ square: selected, verbose: true })) {
        const to = m.to as Square;
        s[to] = {
          ...s[to],
          background: game.get(to)
            ? 'radial-gradient(transparent 55%, rgba(20, 85, 200, 0.4) 55%)'
            : 'radial-gradient(rgba(20, 85, 200, 0.5) 22%, transparent 22%)',
        };
      }
    }
    return s;
  }, [game, shownLastMv, currentClassification, selected]);

  // ── Nav state ─────────────────────────────────────────────────────────────
  const totalMoves = moves.length;
  const atStart = moveIndex <= -1;
  const atEnd = moveIndex >= totalMoves - 1;

  const moveLabel = (() => {
    if (moveIndex < 0) return 'Start';
    const m = moves[moveIndex];
    if (!m) return 'Start';
    const chessMoveNum = Math.ceil((moveIndex + 1) / 2);
    const isBlack = m.movedBy === 'player' ? playerColor === 'black' : playerColor === 'white';
    return `${chessMoveNum}${isBlack ? '...' : '.'} ${m.san}`;
  })();

  const displayName = playerName || 'You';
  const playerIsWhite = playerColor === 'white';

  const playerLabel = (color: 'white' | 'black', name: string) => (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: color === 'white' ? '#e8e8e8' : '#2A3C45' }}
      />
      <span className="text-[10px] font-bold text-chess-text">{name}</span>
    </div>
  );

  const graphMoves = useMemo(
    () => moves.map((m, i) => ({
      movedBy: m.movedBy,
      classification: (analysis?.moves[i]?.classification ?? null) as MoveClassification | null,
    })),
    [moves, analysis],
  );

  const toggleBestArrow = () => {
    const on = !showBestArrow;
    setShowBestArrow(on);
    // In a branch the arrow derives from state; re-navigating would yank the board to the mainline.
    if (!inBranch) navigate(moveIndexRef.current);
  };

  return (
    <div className="h-full bg-chess-page text-chess-text flex flex-col">
      <div className="h-2 flex-shrink-0" />
      {/* The review column scrolls if a device is too short; the exit button stays pinned below. */}
      <div className="flex-1 flex items-start justify-center px-4 md:px-6 pt-2 min-h-0 overflow-y-auto">
        <div className="w-full max-w-md md:max-w-[40rem] mx-auto">
          {/* Coach commentary panel */}
          <div className="mb-2">
            <div className="bg-chess-surface rounded-2xl px-3.5 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] h-[52px] flex items-center gap-2 overflow-hidden">
              {inBranch ? (
                <p className="text-[13px] leading-snug font-medium text-chess-text-muted">
                  Trying a line. Tap Back to game to return.
                  {branch.currentEval && (branch.currentEval.cp !== null || branch.currentEval.mate !== null) && (
                    <span className="ml-2 font-mono text-[11px] text-amber-700">
                      {branch.currentEval.mate !== null
                        ? `M${Math.abs(branch.currentEval.mate)}`
                        : (() => {
                            const v = Math.round((branch.currentEval.cp ?? 0) / 10) / 10 || 0; // no "-0.0"
                            return `${v > 0 ? '+' : ''}${v.toFixed(1)}`;
                          })()}
                    </span>
                  )}
                </p>
              ) : (<>
                {!coachReady && (
                  <div className="flex-shrink-0">
                    <BreathingRook size="xs" animation="think" />
                  </div>
                )}
                <p className={`text-chess-text leading-snug font-medium ${
                  (reviewText?.length ?? 0) > 100 ? 'text-[11px]' :
                  (reviewText?.length ?? 0) > 70 ? 'text-[12px]' : 'text-[13px]'
                }`}>
                  {!coachReady
                    ? (reviewText || 'Rookie is reviewing your game...')
                    : (reviewText || 'Use the arrows to step through the game.')}
                </p>
              </>)}
            </div>
          </div>

          {/* Top player (opponent) */}
          <div className="flex justify-between items-center mb-0.5">
            {playerLabel(playerIsWhite ? 'black' : 'white', 'Rookie')}
          </div>

          {/* Board — read-only unless "Try it" variations are on */}
          {/* The graph + controls + pinned exit need ~8rem more below the board (same as /play) */}
          <div className="w-full max-w-[min(92vw,440px)] mx-auto aspect-square md:max-w-[min(40rem,calc(100dvh-26rem))]">
            <ChessPathBoard
              options={{
                position: shownFen,
                boardOrientation: playerColor,
                squareStyles: sqStyles,
                animationDurationInMs: 300,
                ...(canBranch
                  ? {
                      onPieceDrop: ((args: any) => onReviewDrop(args.sourceSquare as Square, args.targetSquare as Square)) as any,
                      onSquareClick: ((args: any) => onReviewSquareClick(args.square as Square)) as any,
                    }
                  : {}),
                ...(shownArrows.length > 0 ? { arrows: shownArrows } : {}),
              }}
            />
          </div>

          {/* Below board */}
          <div className="mt-0.5 space-y-1">
            {/* Bottom player (us) + best-move arrow toggle (no settings menu here) */}
            <div className="flex justify-between items-center">
              {playerLabel(playerIsWhite ? 'white' : 'black', displayName)}
              <button
                type="button"
                role="switch"
                aria-checked={showBestArrow}
                aria-label="Show best-move arrow"
                onClick={toggleBestArrow}
                className="flex items-center gap-2 min-h-[44px] pl-2 -mr-1 pr-1 select-none touch-manipulation"
              >
                <span className="text-[10px] font-bold text-chess-text-muted">Best-move arrow</span>
                <span className={`relative inline-block w-10 h-6 rounded-full transition-colors ${showBestArrow ? 'bg-chess-green' : 'bg-chess-disabled'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${showBestArrow ? 'translate-x-4' : ''}`} />
                </span>
              </button>
            </div>

            {/* Eval graph — the whole game, board-width; tap/drag to seek */}
            <div className={inBranch ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
              <EvalGraph
                evals={positionEvals}
                moves={graphMoves}
                currentMoveIndex={inBranch ? branch.rootPly : moveIndex}
                onSelectMove={selectGraphMove}
              />
            </div>

            {/* Analysis still running — thin progress bar, review stays usable */}
            {isAnalyzing && (
              <div className="flex flex-col gap-0.5">
                <div className="h-1 w-full bg-chess-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-chess-green rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-chess-text-muted font-medium text-center">
                  Analyzing move {Math.min(totalMoves, Math.max(1, Math.ceil((progress / 100) * totalMoves)))}/{totalMoves}
                </span>
              </div>
            )}

            {/* Move navigation — shared with /play */}
            <ReviewNav
              moveLabel={moveLabel}
              classification={currentClassification}
              atStart={atStart}
              atEnd={atEnd}
              inBranch={inBranch}
              branchLineSan={branch.lineSan}
              branchAtTip={branch.atTip}
              onPrev={reviewPrev}
              onNext={reviewNext}
              onJumpToEnd={() => navigate(totalMoves - 1)}
              onExitBranch={exitBranch}
            />
          </div>
        </div>
      </div>

      {/* Exit pinned to the bottom, clear of the move controls (same sizing as /play's Play Again) */}
      <div className="flex-shrink-0 px-4 md:px-6 pt-2 pb-3">
        <div className="w-full max-w-md md:max-w-[40rem] mx-auto">
          <button
            onClick={handleExit}
            className="block mx-auto w-full max-w-[240px] min-h-[44px] py-2 bg-chess-green text-white font-bold rounded-xl text-sm"
          >
            {exitLabel}
          </button>
        </div>
      </div>
      <div className="pb-[env(safe-area-inset-bottom)] flex-shrink-0" />
    </div>
  );
}
