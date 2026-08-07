'use client';

/**
 * /box/bout — Bout mode v1 (BOUT_MODE flag).
 *
 * ONE game vs Rookie split across chess rounds; the board freezes during
 * boxing rounds; you resume the same position gassed. Design doc:
 * docs/chess-boxing-app-structure.md ("Bout mode" — binding).
 *
 * Engine: pickRookieMove (lib/rookie/pick-move.ts) — the SAME picker /play and
 * the workout's Fight Rounds use. No second implementation.
 *
 * Boxing rounds have NO physical tracking (2026-08-05, Tyler): no camera, no
 * tap pad, nothing counted. A boxing round is a timer and Rookie in your
 * corner — reaching the bell IS the achievement. Consequently the final bell
 * is decided on the BOARD (material, decideOnMaterial), not on judges' cards.
 *
 * v2 (2026-08-05): a finished bout is a real finished unit. On the result
 * screen it POSTs to /api/bout/finish (idempotent per bout), which stores the
 * row that feeds the streak, the leaderboard windows, and the fight record on
 * /profile. The streak celebration is claimed through claimStreakToday() —
 * the ONE trigger, from a completion screen, exactly as CHE-388 requires. A
 * logged-out fighter still gets the full result screen; nothing is persisted.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chess, type Square } from 'chess.js';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { useClickToMove, reconcileSelectionAfterOpponentMove } from '@/hooks/useClickToMove';
import { usePremove } from '@/hooks/usePremove';
import { premoveDests, premoveSquareStyles } from '@/lib/chess/premove';
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import { pickRookieMove } from '@/lib/rookie/pick-move';
import { getRookieLevel, peekRookieLevel } from '@/lib/rookie/level-client';
import { getLevelElo } from '@/lib/rookie-levels';
import { useName } from '@/hooks/useName';
import { useGameReview } from '@/hooks/useGameReview';
import { GameReview } from '@/components/shared/GameReview';
import type { ReviewMove } from '@/lib/review/review-core';
import { FIGHT_MAX_LEVEL } from '@/lib/workout/schedule';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { fireConfetti } from '@/lib/confetti';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { ArenaBackButton, ArenaScene, GymSign } from '@/components/chessboxing/Arena';
import { BoutEvents } from '@/lib/analytics/posthog';
import { claimStreakToday } from '@/lib/streak-client';
import {
  warmupAudio,
  playButtonClick,
  playBoxingBell,
  playWoodClap,
  playMoveSound,
  playCaptureSound,
  playCelebrationSound,
} from '@/lib/sounds';
import {
  buildSegments,
  bankSeconds,
  boxingRoundCount,
  chessRoundCount,
  boutDurationSeconds,
  BOUT_FORMATS,
  BOUT_FORMAT_ORDER,
  RANKED_FORMAT,
  ROOKIE_CLOCK_FLOOR,
  ROOKIE_THINK_MIN_MS,
  ROOKIE_THINK_MAX_MS,
  CHESS_ROUND_SECONDS,
  BOXING_ROUND_SECONDS,
  BREAK_SECONDS,
  boutPoints,
  decideOnMaterial,
  materialBalance,
  fmtClock,
  pickLine,
  BOUT_LINES,
  type BoutFormat,
  type BoutOutcome,
} from '@/lib/bout/bout';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const ANIM_MS = 300;

/**
 * A finished bout that hit a 401 (logged-out fighter) waits here, and the next
 * AUTHED load of this page replays it to /api/bout/finish — which is idempotent
 * per clientSessionId, so a replay can never double-count. A fight is never
 * silently lost.
 */
const PENDING_BOUT_KEY = 'cp:pending-bout';

function stashPendingBout(payload: Record<string, unknown>) {
  try {
    localStorage.setItem(PENDING_BOUT_KEY, JSON.stringify(payload));
  } catch {
    /* storage full / private mode — nothing more we can do */
  }
}

/**
 * 'break' is a REAL round on the card, not a transition: 1:00 between every
 * round, counted down on screen. The card structure (chess · break · boxing ·
 * break · chess …) is locked in lib/bout/bout.ts — this page only runs it.
 */
type Phase = 'prefight' | 'chess' | 'break' | 'boxing' | 'done';

/** "a rook" / "2 pawns" — material spoken the way a person would say it. */
function fmtMaterial(pawns: number): string {
  const n = Math.abs(pawns);
  if (n === 9) return 'a queen';
  if (n === 5) return 'a rook';
  if (n === 3) return 'a piece';
  if (n === 1) return 'a pawn';
  return `${n} pawns`;
}

interface BoutResult {
  outcome: BoutOutcome;
  rookieLine: string;
  meltdown: boolean;
  /** Material at the final bell, in pawns, from the user's side. */
  material: number;
  /** Boxing rounds the user reached the bell in. */
  roundsSurvived: number;
  /** Frozen at the final bell so the result card and the share card agree. */
  moves: number;
  clockLeft: number;
  points: number;
  finalFen: string;
  /** Idempotency key for /api/bout/finish — one per bout, not per render. */
  boutKey: string;
}

export default function BoutPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>('prefight');

  // ── The card ──────────────────────────────────────────────────────────────
  // Format picks the LENGTH; the structure is built, never chosen. Only
  // RANKED_FORMAT pays points (and only once a day) — see /api/bout/finish.
  const [format, setFormat] = useState<BoutFormat>(RANKED_FORMAT);
  const segments = useMemo(() => buildSegments(format), [format]);
  // Callbacks read the card off a ref so a mid-bout re-render can't rebuild
  // them, exactly like the clock refs below.
  const segmentsRef = useRef(segments);
  segmentsRef.current = segments;
  const bank = bankSeconds(format);
  const chessRounds = chessRoundCount(format);
  const boxingRounds = boxingRoundCount(format);
  // Whether TODAY's ranked bout is still available (server is the authority;
  // this is only so the pre-fight screen can be honest before you fight).
  const [rankedLeft, setRankedLeft] = useState<number | null>(null);
  const [wasRanked, setWasRanked] = useState<boolean | null>(null);

  const [segIndex, setSegIndex] = useState(0); // into segments
  const [roundLeft, setRoundLeft] = useState(0); // bell timer for current segment
  const [bellLine, setBellLine] = useState('');

  // ── Clocks ────────────────────────────────────────────────────────────────
  // userBank is the ONE real clock; rookieClock is flavor and never flags.
  const [userBank, setUserBank] = useState(bank);
  // Mirror of userBank for the finish path — finishBout has no deps on purpose
  // (it must never be re-created mid-bout), so it reads the clock off a ref.
  const userBankRef = useRef(bank);
  // One idempotency key per bout, minted in begin(). A retry or a double-tap
  // on the result screen can never write a second row.
  const boutKeyRef = useRef('');
  // One persist attempt per bout (the effect can re-run on re-render).
  const persistedRef = useRef(false);
  // Points confirmed by the server — the client preview is the fallback.
  const [savedPoints, setSavedPoints] = useState<number | null>(null);
  // The finish POST came back 401: the fighter isn't signed in, the bout is
  // stashed, and the result card must say so instead of pretending it saved.
  const [needsSignIn, setNeedsSignIn] = useState(false);
  // One replay attempt per page load (StrictMode double-mounts effects).
  const replayTriedRef = useRef(false);
  const [sharing, setSharing] = useState(false);
  const [rookieClock, setRookieClock] = useState(bank);

  // ── Game (same shape as the workout's Fight Rounds) ───────────────────────
  const [fen, setFen] = useState(START_FEN);
  const fenRef = useRef(START_FEN);
  const movesRef = useRef<string[]>([]); // SAN history (opening book)
  // Full move log for post-bout review — the whole continuous game across all
  // chess rounds (one bout = one game, so review covers everything).
  const reviewMovesRef = useRef<ReviewMove[]>([]);
  const [level, setLevel] = useState(1);
  const levelRef = useRef(1);
  const [selected, setSelected] = useState<Square | null>(null);
  const [lastMv, setLastMv] = useState<{ from: Square; to: Square } | null>(null);
  const [rookieThinking, setRookieThinking] = useState(false);
  const rookieThinkingRef = useRef(false);
  const [rookieLine, setRookieLine] = useState<string | null>(null);

  const rookieTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chessActiveRef = useRef(false); // gates moves + engine replies
  const sfInitStartedRef = useRef(false);
  const sfReadyRef = useRef(false);
  const finishedRef = useRef(false);
  const tauntedRef = useRef(false); // under-30s taunt fires once per bout
  const confettiFiredRef = useRef(false);

  const seedRef = useRef(1);
  // Boxing rounds the user reached the bell in. Nothing else about a boxing
  // round is measured — reaching every bell is the "went the distance" bonus.
  const roundsSurvivedRef = useRef(0);
  // Card facts frozen at the opening bell, so finishBout (which deliberately
  // has no deps) scores the bout that was actually fought.
  const boxingRoundsRef = useRef(boxingRounds);
  const rankedRef = useRef(true);

  const [result, setResult] = useState<BoutResult | null>(null);
  // ── Post-bout review (shared pipeline — same experience as /play's review) ─
  const { name: playerName } = useName();
  const gameReview = useGameReview();
  // Stable callbacks pulled off the hook so begin()/effects can depend on
  // them without re-running every render (the data object changes identity).
  const { start: startGameReview, reset: resetGameReview } = gameReview;
  const [showReview, setShowReview] = useState(false);
  // "Throw in the towel" is two taps: the first flips the button into a
  // confirm row (no browser dialogs), which auto-reverts after 4s untouched.
  const [towelConfirm, setTowelConfirm] = useState(false);
  const towelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Rookie's corner: one line at a time during a boxing round, swapped on a
  // timer. She is the entire round now, so she can't go quiet.
  const [cornerLine, setCornerLine] = useState<string>(BOUT_LINES.boxing[0]);

  const seg = segments[segIndex];

  // ── Finish ────────────────────────────────────────────────────────────────
  const finishBout = useCallback(
    (outcome: BoutOutcome) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      chessActiveRef.current = false;
      if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
      stockfish.cancel();
      setRookieThinking(false);

      const material = materialBalance(fenRef.current);
      // Meltdown: mated in a position she was WINNING on material. She does not
      // take that well.
      const meltdown = outcome === 'ko_win' && material < 0;

      const seed = movesRef.current.length + roundsSurvivedRef.current;
      const line = meltdown
        ? pickLine(BOUT_LINES.meltdown, seed)
        : outcome === 'ko_win'
          ? pickLine(BOUT_LINES.koWin, seed)
          : outcome === 'ko_loss'
            ? pickLine(BOUT_LINES.koLoss, seed)
            : outcome === 'flag_loss'
              ? pickLine(BOUT_LINES.flagLoss, seed)
              : outcome === 'decision_win'
                ? pickLine(BOUT_LINES.decisionWin, seed)
                : outcome === 'decision_loss'
                  ? pickLine(BOUT_LINES.decisionLoss, seed)
                  : pickLine(BOUT_LINES.draw, seed);

      if (outcome === 'ko_win' || outcome === 'decision_win') playCelebrationSound();
      else playBoxingBell();

      BoutEvents.finished({
        outcome,
        moves: movesRef.current.length,
        punches: 0, // no physical tracking — kept for event-schema stability
        level: levelRef.current,
      });

      setResult({
        outcome,
        rookieLine: line,
        meltdown,
        material,
        roundsSurvived: roundsSurvivedRef.current,
        moves: movesRef.current.length,
        clockLeft: userBankRef.current,
        // Client-side PREVIEW only — the server recomputes and may zero it out
        // (unranked format, or today's ranked bout already spent).
        points: boutPoints({
          outcome,
          roundsSurvived: roundsSurvivedRef.current,
          level: levelRef.current,
          boxingRounds: boxingRoundsRef.current,
          ranked: rankedRef.current,
        }),
        finalFen: fenRef.current,
        boutKey: boutKeyRef.current,
      });
      setPhase('done');
    },
    [],
  );

  // ── Game over on the board = KO / draw, ends the bout immediately ─────────
  const onGameOver = useCallback(
    (g: Chess) => {
      if (g.isCheckmate()) {
        // Player is white; if it's black's turn, black (Rookie) is mated.
        finishBout(g.turn() === 'b' ? 'ko_win' : 'ko_loss');
      } else {
        finishBout('draw');
      }
    },
    [finishBout],
  );

  // ── Rookie's reply: book → blunder chance → sampled Stockfish, 2-4s pace ──
  const scheduleRookieMove = useCallback(
    (currentFen: string) => {
      if (!chessActiveRef.current) return;
      if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
      setRookieThinking(true);
      rookieThinkingRef.current = true;

      const thinkMs =
        ROOKIE_THINK_MIN_MS + Math.random() * (ROOKIE_THINK_MAX_MS - ROOKIE_THINK_MIN_MS);
      const thinkStart = Date.now();

      const applyRookieMove = (
        moveInfo: { from: string; to: string; promotion?: string } | { san: string },
      ) => {
        rookieTimerRef.current = null;
        if (!chessActiveRef.current) return; // bell rang while she was thinking
        const g = new Chess(fenRef.current);
        if (g.turn() !== 'b' || g.isGameOver()) {
          setRookieThinking(false);
          rookieThinkingRef.current = false;
          return;
        }
        let mv;
        try {
          mv =
            'san' in moveInfo
              ? g.move(moveInfo.san)
              : g.move({
                  from: moveInfo.from as Square,
                  to: moveInfo.to as Square,
                  promotion: (moveInfo.promotion || 'q') as 'q' | 'r' | 'b' | 'n',
                });
        } catch {
          mv = null;
        }
        if (!mv) {
          setRookieThinking(false);
          rookieThinkingRef.current = false;
          return;
        }
        const newFen = g.fen();
        fenRef.current = newFen;
        setFen(newFen);
        movesRef.current.push(mv.san);
        reviewMovesRef.current.push({
          san: mv.san,
          from: mv.from,
          to: mv.to,
          fenAfter: newFen,
          movedBy: 'rookie',
          moveNumber: reviewMovesRef.current.length + 1,
        });
        setLastMv({ from: mv.from as Square, to: mv.to as Square });
        setSelected((prev) => reconcileSelectionAfterOpponentMove(prev, mv));
        setRookieThinking(false);
        rookieThinkingRef.current = false;
        if (mv.captured) playCaptureSound();
        else playMoveSound();
        if (g.isGameOver()) onGameOver(g);
      };

      const scheduleApply = (
        moveInfo: { from: string; to: string; promotion?: string } | { san: string },
      ) => {
        // Pad every reply to the 2-4s pacing window (micro-recovery for you;
        // her clock ticks the whole time for flavor).
        const wait = Math.max(0, thinkMs - (Date.now() - thinkStart));
        rookieTimerRef.current = setTimeout(() => applyRookieMove(moveInfo), wait);
      };

      const fallbackRandom = () => {
        const g = new Chess(currentFen);
        const moves = g.moves({ verbose: true });
        if (!moves.length) {
          setRookieThinking(false);
          rookieThinkingRef.current = false;
          return;
        }
        const mv = moves[Math.floor(Math.random() * moves.length)];
        scheduleApply({ from: mv.from, to: mv.to, promotion: mv.promotion });
      };

      // ONE picker for every surface (lib/rookie/pick-move.ts) — the bell can
      // freeze the board mid-think, so the guard is re-checked on resolve.
      pickRookieMove({
        fen: currentFen,
        sans: movesRef.current,
        rookieColor: 'black',
        level: levelRef.current,
        engineReady: sfReadyRef.current,
      })
        .then((decision) => {
          if (!chessActiveRef.current) return;
          if (!decision) {
            fallbackRandom();
            return;
          }
          scheduleApply(decision.move);
        })
        .catch(() => {
          if (chessActiveRef.current) fallbackRandom();
        });
    },
    [onGameOver],
  );

  // ── Player's move (white) ─────────────────────────────────────────────────
  const doMove = useCallback(
    (from: Square, to: Square): boolean => {
      if (!chessActiveRef.current || rookieThinkingRef.current) return false;
      const g = new Chess(fenRef.current);
      if (g.turn() !== 'w') return false;
      let mv;
      try {
        mv = g.move({ from, to, promotion: 'q' });
      } catch {
        return false;
      }
      if (!mv) return false;
      const newFen = g.fen();
      fenRef.current = newFen;
      setFen(newFen);
      movesRef.current.push(mv.san);
      reviewMovesRef.current.push({
        san: mv.san,
        from,
        to,
        fenAfter: newFen,
        movedBy: 'player',
        moveNumber: reviewMovesRef.current.length + 1,
      });
      setLastMv({ from, to });
      setSelected(null);
      if (mv.captured) playCaptureSound();
      else playMoveSound();
      if (g.isGameOver()) {
        onGameOver(g);
        return true;
      }
      rookieTimerRef.current = setTimeout(() => scheduleRookieMove(newFen), ANIM_MS + 100);
      return true;
    },
    [onGameOver, scheduleRookieMove],
  );

  const game = useMemo(() => {
    try {
      return new Chess(fen);
    } catch {
      return null;
    }
  }, [fen]);

  // Premove — the bout's think window is a padded 2-4s, so this is where it
  // matters most: queue your reply while Rookie stalls and the round keeps moving.
  const { premove, setPremove, clearPremove, premoveEnabled } = usePremove({
    fen,
    isMyTurn: game?.turn() === 'w',
    tryMove: doMove,
    enabled: phase === 'chess',
    fireDelayMs: ANIM_MS,
  });

  const { onSquareClick, onPremoveDrop } = useClickToMove({
    game,
    ownColor: 'w',
    selectedSquare: selected,
    setSelectedSquare: setSelected,
    tryMove: doMove,
    // Stays on during Rookie's turn so a premove can be set; useClickToMove
    // still refuses to EXECUTE a move when it isn't white's turn.
    enabled: phase === 'chess',
    premoveEnabled,
    setPremove,
  });

  const sqStyles = useMemo(() => {
    const s: Record<string, React.CSSProperties> = {};
    if (!game) return s;
    if (lastMv) {
      s[lastMv.from] = { background: 'rgba(255, 170, 0, 0.4)' };
      s[lastMv.to] = { background: 'rgba(255, 170, 0, 0.4)' };
    }
    if (game.isCheck()) {
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
    if (selected) {
      s[selected] = { ...s[selected], background: 'rgba(20, 85, 200, 0.5)' };
      // Our turn: real legal moves. Rookie's turn: relaxed premove targets.
      const dests =
        game.turn() === 'w'
          ? game.moves({ square: selected, verbose: true }).map((m) => m.to as Square)
          : premoveEnabled
            ? premoveDests(fen, selected, 'w')
            : [];
      for (const to of dests) {
        const has = game.get(to);
        s[to] = {
          ...s[to],
          background: has
            ? 'radial-gradient(transparent 55%, rgba(20, 85, 200, 0.4) 55%)'
            : 'radial-gradient(rgba(20, 85, 200, 0.5) 22%, transparent 22%)',
        };
      }
    }
    for (const [sq, style] of Object.entries(premoveSquareStyles(premove))) {
      s[sq] = { ...s[sq], ...style };
    }
    return s;
  }, [game, fen, lastMv, selected, premove, premoveEnabled]);

  // ── Segment transitions ───────────────────────────────────────────────────

  /** Move onto the next segment of the card (chess · break · boxing · break …). */
  const advance = useCallback(() => {
    const next = segIndex + 1;
    const nextSeg = segmentsRef.current[next];
    if (!nextSeg) return; // final bell already decided the bout
    setSegIndex(next);
    setRoundLeft(nextSeg.seconds);
    if (nextSeg.kind === 'boxing') {
      setRookieLine(pickLine(BOUT_LINES.boxing, next));
      setPhase('boxing');
    } else if (nextSeg.kind === 'break') {
      setPhase('break');
    } else {
      setRookieLine(pickLine(BOUT_LINES.bellResume, next + movesRef.current.length));
      setPhase('chess');
    }
  }, [segIndex]);

  /**
   * A segment hit zero. The bell always wins: a chess round freezes the board
   * mid-position, a boxing round is banked as survived, a break just ends.
   * Every one of them rolls straight into the next segment — the 1:00 break
   * IS the transition, so nothing else sits between rounds.
   */
  const ringBell = useCallback(() => {
    const cur = segmentsRef.current[segIndex];
    if (!cur) return;
    const isLast = segIndex >= segmentsRef.current.length - 1;

    if (cur.kind === 'chess') {
      playBoxingBell();
      // FREEZE: kill Rookie's pending move + engine work.
      chessActiveRef.current = false;
      if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
      stockfish.cancel();
      setRookieThinking(false);
      rookieThinkingRef.current = false;
      if (isLast) {
        // Final bell, nobody mated: the decision is the position itself.
        finishBout(decideOnMaterial(fenRef.current));
        return;
      }
      setBellLine(pickLine(BOUT_LINES.bellFreeze, segIndex + movesRef.current.length));
    } else if (cur.kind === 'boxing') {
      playBoxingBell();
      // Boxing round survived to the bell. Nothing is measured inside it —
      // reaching the end IS the achievement.
      roundsSurvivedRef.current = Math.max(roundsSurvivedRef.current, cur.round);
      setBellLine(pickLine(BOUT_LINES.bellResume, segIndex + roundsSurvivedRef.current));
    } else {
      // End of the break — the next round's bell.
      playBoxingBell();
    }
    advance();
  }, [segIndex, finishBout, advance]);

  // Rookie's corner rotation — a fresh line every ~12s for the whole boxing
  // round, walking forward through the pool from a per-round offset so two
  // rounds in one bout don't hear the same run of lines.
  useEffect(() => {
    if (phase !== 'boxing') return;
    const pool = BOUT_LINES.boxing;
    let i = (segIndex * 5 + movesRef.current.length) % pool.length;
    setCornerLine(pool[i]);
    const t = setInterval(() => {
      i = (i + 1) % pool.length;
      setCornerLine(pool[i]);
    }, 12000);
    return () => clearInterval(t);
  }, [phase, segIndex]);

  // Rookie's break line — one per break, picked when the break starts.
  useEffect(() => {
    if (phase !== 'break') return;
    setCornerLine(pickLine(BOUT_LINES.breakLines, segIndex + movesRef.current.length));
  }, [phase, segIndex]);

  // Entering a chess segment: unfreeze; if it's Rookie's turn (bell caught her
  // mid-think last round) reschedule her move.
  useEffect(() => {
    if (phase !== 'chess') return;
    chessActiveRef.current = true;
    const g = new Chess(fenRef.current);
    if (!g.isGameOver() && g.turn() === 'b') {
      rookieTimerRef.current = setTimeout(() => scheduleRookieMove(fenRef.current), 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, segIndex]);

  // ── The 1s tick: round timer + clocks ─────────────────────────────────────
  useEffect(() => {
    if (phase !== 'chess' && phase !== 'boxing' && phase !== 'break') return;
    if (roundLeft <= 0) {
      ringBell();
      return;
    }
    // The 10-second warning belongs to the rounds, not the rest.
    if (roundLeft === 10 && phase !== 'break') playWoodClap();
    const t = setTimeout(() => {
      setRoundLeft((s) => s - 1);
      if (phase === 'chess') {
        const turn = fenRef.current.split(' ')[1];
        if (turn === 'w' && !rookieThinkingRef.current) {
          // The ONE real clock. Zero = flagged = real loss.
          setUserBank((b) => {
            const next = Math.max(0, b - 1);
            userBankRef.current = next;
            if (next <= 0) finishBout('flag_loss');
            return next;
          });
        } else if (rookieThinkingRef.current) {
          // Flavor only — ticks while she thinks, never reaches zero.
          setRookieClock((c) => Math.max(ROOKIE_CLOCK_FLOOR, c - 1));
        }
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, roundLeft, ringBell, finishBout]);

  // Rookie leans in when YOUR clock drops under 30s (once per bout).
  useEffect(() => {
    if (phase !== 'chess' || tauntedRef.current || userBank > 30 || userBank <= 0) return;
    tauntedRef.current = true;
    setRookieLine(pickLine(BOUT_LINES.clockTaunt, movesRef.current.length));
  }, [phase, userBank]);

  // ── Persist the bout, then claim the streak (Bout v2) ─────────────────────
  // Order matters: the row must LAND before claimStreakToday() polls for it,
  // otherwise the celebration slips to the next finished unit. Both are
  // idempotent, so a re-render or a retry can't double-count anything.
  // Logged-out fighters get a 401 here and simply keep their result screen.
  useEffect(() => {
    if (phase !== 'done' || !result || persistedRef.current) return;
    persistedRef.current = true;
    let cancelled = false;

    (async () => {
      const payload = {
        outcome: result.outcome,
        roundsSurvived: result.roundsSurvived,
        moves: result.moves,
        level: levelRef.current,
        format,
        clockLeftSeconds: result.clockLeft,
        finalFen: result.finalFen,
        clientSessionId: result.boutKey,
      };
      try {
        const res = await fetch('/api/bout/finish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.status === 401) {
          // Logged-out fighter — NEVER silently lose the fight. Stash the
          // payload; the next authed load of this page replays it.
          stashPendingBout(payload);
          if (!cancelled) setNeedsSignIn(true);
          return;
        }
        if (!res.ok) return; // a real failure — nothing to claim
        const body = (await res.json()) as { ok?: boolean; points?: number; ranked?: boolean };
        if (cancelled) return;
        if (typeof body.points === 'number') setSavedPoints(body.points);
        // The server decides ranked vs exhibition — the card says whichever
        // it actually was, never the client's guess.
        if (typeof body.ranked === 'boolean') setWasRanked(body.ranked);
        // The bout is a finished unit — it can earn the day.
        await claimStreakToday();
      } catch {
        /* offline / blocked — the bout still happened on screen */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [phase, result, format]);

  // Kick off review analysis as soon as the result card shows, so the review
  // is warm (or done) by the time the fighter taps Review — same rhythm as
  // /play, which analyzes in the background behind its result screen.
  // useGameReview.start is idempotent until reset(), so re-renders are safe.
  useEffect(() => {
    if (phase !== 'done' || !result || reviewMovesRef.current.length === 0) return;
    startGameReview({
      moves: reviewMovesRef.current,
      playerColor: 'white', // the bout fighter is always white
      playerElo: getLevelElo(levelRef.current),
      result:
        result.outcome === 'ko_win' || result.outcome === 'decision_win'
          ? 'win'
          : result.outcome === 'draw'
            ? 'draw'
            : 'loss',
      playerName: playerName || undefined,
    });
  }, [phase, result, startGameReview, playerName]);

  // Confetti when the user wins the bout.
  useEffect(() => {
    if (phase !== 'done' || !result || confettiFiredRef.current) return;
    if (result.outcome !== 'ko_win' && result.outcome !== 'decision_win') return;
    confettiFiredRef.current = true;
    const colors = ['#58CC02', '#1CB0F6', '#FFC800', '#FF4B4B', '#A560E8'];
    fireConfetti({ particleCount: 90, spread: 70, origin: { x: 0.2, y: 0.5 }, colors });
    fireConfetti({ particleCount: 90, spread: 70, origin: { x: 0.8, y: 0.5 }, colors });
  }, [phase, result]);

  // Kill any pending Rookie move on unmount.
  useEffect(() => {
    return () => {
      if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
      if (towelTimerRef.current) clearTimeout(towelTimerRef.current);
      stockfish.cancel();
    };
  }, []);

  // ── Begin ─────────────────────────────────────────────────────────────────
  const begin = useCallback(() => {
    warmupAudio();
    playButtonClick();
    playBoxingBell();
    seedRef.current = 1 + Math.floor(Math.random() * 0x7fffffff);
    fenRef.current = START_FEN;
    setFen(START_FEN);
    movesRef.current = [];
    reviewMovesRef.current = [];
    // Kill the previous bout's review: cancel any in-flight deep analysis and
    // flush its queued engine work so it can't slow Rookie's moves this bout.
    resetGameReview();
    stockfish.cancel();
    setShowReview(false);
    setSelected(null);
    clearPremove();
    setLastMv(null);
    setRookieThinking(false);
    rookieThinkingRef.current = false;
    setUserBank(bank);
    userBankRef.current = bank;
    // Rookie's clock is flavor — it only has to look like a peer of yours.
    setRookieClock(bank);
    boxingRoundsRef.current = boxingRounds;
    // Preview only; /api/bout/finish has the final say on whether this pays.
    rankedRef.current = format === RANKED_FORMAT && (rankedLeft ?? 1) > 0;
    setWasRanked(null);
    boutKeyRef.current =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `bout-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
    roundsSurvivedRef.current = 0;
    finishedRef.current = false;
    tauntedRef.current = false;
    confettiFiredRef.current = false;
    persistedRef.current = false;
    setSavedPoints(null);
    setNeedsSignIn(false);
    setResult(null);

    // Matched level, capped — the deeper engines are too heavy for a bout.
    const lvl = Math.min(FIGHT_MAX_LEVEL, peekRookieLevel().level);
    setLevel(lvl);
    levelRef.current = lvl;

    // Lazy engine init — 7.3MB wasm worker, only ever at bout start.
    if (!sfInitStartedRef.current) {
      sfInitStartedRef.current = true;
      stockfish
        .init()
        .then(() => {
          sfReadyRef.current = true;
        })
        .catch(() => {});
    }

    setSegIndex(0);
    setRoundLeft(segmentsRef.current[0].seconds);
    setRookieLine(null);
    setPhase('chess');
    BoutEvents.started(lvl);
  }, [bank, boxingRounds, format, rankedLeft, clearPremove, resetGameReview]);

  // Is today's ranked bout still on the table? Read once on the pre-fight
  // screen and after every finish, so the picker never promises points it
  // can't pay. Failure is silent — never block a fight over a stat line.
  // Refresh the matched level while we're on the pre-fight screen, so the bout
  // uses the same Rookie /play just matched to you.
  useEffect(() => {
    if (phase !== 'prefight') return;
    void getRookieLevel({ fresh: true });
  }, [phase]);

  // Replay a stashed logged-out bout on the next authed load. The endpoint is
  // idempotent per clientSessionId, so retrying is always safe: 401 keeps the
  // stash (still logged out), success or a payload rejection clears it, and a
  // network/server hiccup leaves it for the load after. No streak claim here —
  // the celebration belongs to completion screens only (CHE-388); once the row
  // lands, the streak derives it live.
  useEffect(() => {
    if (replayTriedRef.current) return;
    replayTriedRef.current = true;
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(PENDING_BOUT_KEY);
    } catch {
      return;
    }
    if (!raw) return;
    (async () => {
      try {
        const res = await fetch('/api/bout/finish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: raw,
        });
        if (res.status === 401) return; // still logged out — keep the stash
        if (res.ok || (res.status >= 400 && res.status < 500)) {
          // Saved, or the server will never accept it — either way, done.
          localStorage.removeItem(PENDING_BOUT_KEY);
        }
      } catch {
        /* offline — keep the stash for the next load */
      }
    })();
  }, []);

  useEffect(() => {
    if (phase !== 'prefight') return;
    let cancelled = false;
    fetch('/api/bout/today')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && typeof d?.rankedLeft === 'number') setRankedLeft(d.rankedLeft);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [phase]);

  if (!FEATURE_FLAGS.BOUT_MODE) {
    return (
      <div className="h-full overflow-auto bg-chess-page flex items-center justify-center p-6 text-center">
        <p className="text-chess-text-muted font-semibold">Bout mode is coming soon.</p>
      </div>
    );
  }

  // ── PRE-FIGHT ─────────────────────────────────────────────────────────────
  // HARD RULE (docs/chess-boxing-app-structure.md): no scroll — the whole
  // pre-fight card stack fits a 375×667 window (tab bar hidden on this route).
  if (phase === 'prefight') {
    return (
      <div className="h-full overflow-hidden bg-[#131a2e] flex flex-col relative">
        <ArenaScene />
        <ArenaBackButton />
        {/* The hanging sign — same slot as RingHome so it never moves between windows. */}
        <div className="pt-[max(0.9rem,env(safe-area-inset-top))] flex justify-center relative z-10 shrink-0">
          <div className="ring-swing"><GymSign /></div>
        </div>
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-2.5 my-auto flex flex-col gap-2 min-h-0 relative z-10">
          <div className="text-center shrink-0">
            <h1 className="text-lg font-black text-white tracking-tight">Bout vs Rookie</h1>
            <p className="text-[11px] font-bold text-white/60 mt-0.5">
              One game. The bell always wins.
            </p>
          </div>

          {/* Format — the ONLY thing that varies. Structure is always
              chess · break · boxing · break · chess. */}
          <div className="shrink-0">
            <div className="flex gap-1.5" role="group" aria-label="Bout length">
              {BOUT_FORMAT_ORDER.map((id) => {
                const spec = BOUT_FORMATS[id];
                const active = format === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      playButtonClick();
                      setFormat(id);
                    }}
                    aria-pressed={active}
                    className={`flex-1 rounded-xl px-2 py-2 min-h-[48px] border-2 transition tap-highlight ${
                      active
                        ? 'border-[#e5484d] bg-[#e5484d]/15'
                        : 'border-white/15 bg-white/[0.07]'
                    }`}
                  >
                    <span
                      className={`block text-[13px] font-black leading-tight ${
                        active ? 'text-[#ff8a8e]' : 'text-white'
                      }`}
                    >
                      {spec.label}
                    </span>
                    <span className="block text-[10px] font-bold text-white/50 tabular-nums">
                      {Math.round(boutDurationSeconds(id) / 60)} min
                      {id === RANKED_FORMAT ? ' · ranked' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-[11px] font-semibold text-white/60 mt-1 leading-snug">
              {format === RANKED_FORMAT && rankedLeft === 0
                ? "Today's ranked bout is spent — this one's an exhibition. Still counts for your streak."
                : BOUT_FORMATS[format].blurb}
            </p>
          </div>

          {/* Round card — a strip, not a list: the Championship card is 11
              rounds and this screen never scrolls (see HARD RULE above). The
              widths are proportional to the seconds, so the shape of the bout
              reads at a glance and the breaks look like the rests they are. */}
          <div className="bg-white/[0.06] rounded-2xl border border-white/10 p-3 shrink-0">
            <h2 className="text-[10px] font-black text-white/50 uppercase tracking-wide text-center mb-1.5">
              Round card
            </h2>
            <div className="flex gap-[3px] h-7" aria-hidden>
              {segments.map((s, i) => (
                <div
                  key={i}
                  className={`rounded-md flex items-center justify-center overflow-hidden ${
                    s.kind === 'chess'
                      ? 'bg-violet-200 text-violet-900'
                      : s.kind === 'boxing'
                        ? 'bg-orange-200 text-orange-900'
                        : 'bg-white/15'
                  }`}
                  style={{ flexGrow: s.seconds, flexBasis: 0 }}
                >
                  {s.kind !== 'break' && (
                    <span className="text-[11px] font-black leading-none">
                      {s.kind === 'chess' ? 'C' : 'B'}
                      {s.round}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[11px] font-bold text-white/60 text-center mt-1.5 leading-snug">
              {chessRounds} × chess {fmtClock(CHESS_ROUND_SECONDS)}
              {boxingRounds > 0 && <> · {boxingRounds} × boxing {fmtClock(BOXING_ROUND_SECONDS)}</>}
              <br />
              {fmtClock(BREAK_SECONDS)} break between every round
            </p>
          </div>

          {/* Rules in one glance */}
          <div
            className="rounded-2xl border border-amber-200 shadow-sm p-3 shrink-0"
            style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' }}
          >
            <ul className="flex flex-col gap-1 text-xs font-bold text-amber-900 leading-snug">
              <li>One game, frozen at every bell — you come back gassed.</li>
              <li>Your clock: {fmtClock(bank)} for all chess rounds. Flag = loss.</li>
              <li>Rookie thinks 2-4s a move. She never flags. Rude, honestly.</li>
              <li>
                Boxing rounds: {Math.round(BOXING_ROUND_SECONDS / 60)} min of work,{' '}
                {BREAK_SECONDS}s rest between every round.
              </li>
              <li>No mate by the final bell — material decides. Level goes to you.</li>
            </ul>
          </div>

          <p className="text-center text-xs font-semibold text-white/55 leading-snug px-2 shrink-0">
            {pickLine(BOUT_LINES.prefight, new Date().getDate())}
          </p>

          <button
            onClick={begin}
            className="w-full rounded-2xl bg-[#e5484d] text-white font-black text-lg py-3 min-h-[48px] shadow-[0_4px_0_#b53437] tap-highlight shrink-0"
          >
            Fight
          </button>
        </div>
      </div>
    );
  }

  // ── DONE — result + judges' scorecard reveal ──────────────────────────────
  if (phase === 'done' && result) {
    // Full game review — the same experience as /play's review phase, over the
    // whole continuous bout game. Exits back to the result card.
    if (showReview) {
      return (
        <GameReview
          moves={reviewMovesRef.current}
          playerColor="white"
          playerName={playerName || undefined}
          review={gameReview}
          onExit={() => {
            playButtonClick();
            setShowReview(false);
          }}
          exitLabel="Back to the result"
        />
      );
    }
    const won = result.outcome === 'ko_win' || result.outcome === 'decision_win';
    const headline =
      result.outcome === 'ko_win'
        ? 'KO — checkmate!'
        : result.outcome === 'ko_loss'
          ? 'KO — Rookie mates you'
          : result.outcome === 'flag_loss'
            ? 'Loss on time'
            : result.outcome === 'decision_win'
              ? 'You win the decision'
              : result.outcome === 'decision_loss'
                ? 'Rookie takes the decision'
                : 'Draw';
    const earned = savedPoints ?? result.points;

    const shareBout = async () => {
      setSharing(true);
      const params = new URLSearchParams({
        outcome: result.outcome,
        material: String(result.material),
        rounds: String(result.roundsSurvived),
        moves: String(result.moves),
        clock: String(result.clockLeft),
        points: String(earned),
      });
      const imgUrl = `/api/og/bout?${params.toString()}`;
      try {
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        const file = new File([blob], 'chess-boxing-bout.png', { type: 'image/png' });
        const nav = navigator as Navigator & { canShare?: (d?: unknown) => boolean };
        if (nav.canShare?.({ files: [file] })) {
          await nav.share({ files: [file], title: 'Chess Boxing', text: headline });
          return;
        }
        window.open(imgUrl, '_blank');
      } catch {
        window.open(imgUrl, '_blank');
      } finally {
        setSharing(false);
      }
    };

    return (
      <div className="h-full overflow-hidden bg-chess-page">
        {/* HARD RULE: no scroll — the card is compact enough to fit 375×667. */}
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <style>{`
            @keyframes boutCardIn { 0% { opacity:0; transform: scale(.7) translateY(16px);} 60%{opacity:1; transform: scale(1.04);} 100%{transform: scale(1);} }
            .bout-result-card { animation: boutCardIn .45s cubic-bezier(.2,.9,.3,1.2); }
            @keyframes boutRowIn { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform: none;} }
            .bout-score-row { opacity:0; animation: boutRowIn .4s ease-out forwards; }
          `}</style>
          <div className="bout-result-card w-full max-w-xs bg-chess-surface rounded-3xl shadow-2xl p-4 flex flex-col items-center gap-2 text-center">
            <h1
              className={`text-xl font-black ${
                won ? 'text-chess-green' : result.meltdown ? 'text-chess-text' : 'text-chess-text'
              }`}
            >
              {headline}
            </h1>

            <BreathingRook size="sm" animate mood={result.meltdown ? 'panicking' : 'neutral'} />
            <div
              className={`w-full rounded-xl px-3 py-2 text-xs font-semibold leading-snug ${
                result.meltdown
                  ? 'bg-red-50 text-red-700'
                  : 'bg-chess-page text-chess-text'
              }`}
            >
              {result.rookieLine}
            </div>

            {/* The decision — material when the bell rang. No judges, no
                cards: nothing about the boxing rounds is measured. */}
            <div className="w-full rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-chess-page px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-chess-text-muted">
                On the board
              </div>
              <div className="px-3 py-2.5 flex flex-col gap-1">
                <div className="text-sm font-black text-chess-text">
                  {result.material > 0
                    ? `You finished up ${fmtMaterial(result.material)}`
                    : result.material < 0
                      ? `Rookie finished up ${fmtMaterial(-result.material)}`
                      : 'Dead level on material'}
                </div>
                <div className="text-[11px] font-semibold text-chess-text-muted leading-snug">
                  {result.roundsSurvived > 0
                    ? `${result.roundsSurvived} boxing ${
                        result.roundsSurvived === 1 ? 'round' : 'rounds'
                      } survived`
                    : 'Ended before the gloves came on'}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 w-full pt-2 border-t border-slate-100">
              <div>
                <div className="text-xl font-black text-chess-text tabular-nums">
                  {result.moves}
                </div>
                <div className="text-[11px] font-semibold text-chess-text-muted">moves</div>
              </div>
              <div>
                <div className="text-xl font-black text-chess-text tabular-nums">
                  {fmtClock(result.clockLeft)}
                </div>
                <div className="text-[11px] font-semibold text-chess-text-muted">clock left</div>
              </div>
              <div>
                <div
                  className={`text-xl font-black tabular-nums ${
                    earned > 0 ? 'text-chess-green' : 'text-chess-text-muted'
                  }`}
                >
                  {earned.toLocaleString()}
                </div>
                <div className="text-[11px] font-semibold text-chess-text-muted">points</div>
              </div>
            </div>

            {/* Not signed in: the fight is stashed, not saved — say so plainly
                and make signing in the loudest thing on the card. */}
            {needsSignIn && (
              <p className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] font-bold text-amber-900 leading-snug">
                Not saved yet — sign in and this fight goes on your record and the standings.
              </p>
            )}

            {/* Why it paid nothing — said plainly, so a 0 never reads as a bug. */}
            {!needsSignIn && wasRanked === false && (
              <p className="text-[11px] font-bold text-chess-text-muted leading-snug">
                {format === RANKED_FORMAT
                  ? "Exhibition — today's ranked bout was already in the books. It still counts for your streak."
                  : `Exhibition — only the ${BOUT_FORMATS[RANKED_FORMAT].label} card is ranked. It still counts for your streak.`}
              </p>
            )}

            <div className="flex gap-2 w-full mt-1">
              <button
                onClick={() => {
                  playButtonClick();
                  void shareBout();
                }}
                disabled={sharing}
                className="flex-1 rounded-2xl border-2 border-slate-200 text-chess-text font-black text-sm py-2.5 transition tap-highlight disabled:opacity-60"
              >
                {sharing ? 'Sharing…' : 'Share'}
              </button>
              {reviewMovesRef.current.length > 0 && (
                <button
                  onClick={() => {
                    playButtonClick();
                    setShowReview(true);
                  }}
                  className="flex-1 rounded-2xl border-2 border-slate-200 text-chess-text font-black text-sm py-2.5 transition tap-highlight"
                >
                  Review
                </button>
              )}
              <button
                onClick={() => {
                  playButtonClick();
                  setPhase('prefight');
                }}
                className="flex-1 rounded-2xl bg-[#e5484d] text-white font-black text-sm py-2.5 shadow-sm transition tap-highlight"
              >
                Rematch
              </button>
            </div>
            {needsSignIn ? (
              // Sign in takes the prime slot; the standings demote to a text
              // link — an unsaved fight isn't on them yet.
              <>
                <button
                  onClick={() => {
                    playButtonClick();
                    router.push('/auth/login?redirect=/box/bout');
                  }}
                  className="w-full rounded-2xl bg-chess-green hover:bg-chess-green-dark text-white font-black text-base py-2.5 shadow-sm transition tap-highlight"
                >
                  Sign in to save this fight
                </button>
                {FEATURE_FLAGS.LEADERBOARDS && (
                  <button
                    onClick={() => {
                      playButtonClick();
                      router.push('/leaderboard');
                    }}
                    className="text-xs font-bold text-chess-text-muted underline underline-offset-2 py-1 min-h-[40px] tap-highlight"
                  >
                    See the standings
                  </button>
                )}
              </>
            ) : (
              FEATURE_FLAGS.LEADERBOARDS && (
                <button
                  onClick={() => {
                    playButtonClick();
                    router.push('/leaderboard');
                  }}
                  className="w-full rounded-2xl bg-chess-green hover:bg-chess-green-dark text-white font-black text-base py-2.5 shadow-sm transition tap-highlight"
                >
                  See the standings
                </button>
              )
            )}
            <button
              onClick={() => {
                playButtonClick();
                router.push('/box');
              }}
              className="w-full rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-base py-2.5 shadow-sm transition tap-highlight"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RUNNING (chess / bell / boxing) ───────────────────────────────────────
  const isBoxing = phase === 'boxing';
  const isBreak = phase === 'break';
  // During a break the header names what's COMING — that's what you're
  // resting for.
  const upNext = isBreak ? segments[segIndex + 1] : null;
  const roundLabel = isBreak
    ? upNext
      ? upNext.kind === 'chess'
        ? `Chess ${upNext.round} of ${chessRounds} next`
        : `Boxing ${upNext.round} of ${boxingRounds} next`
      : 'Break'
    : seg
      ? seg.kind === 'chess'
        ? `Chess ${seg.round} of ${chessRounds}`
        : `Boxing ${seg.round} of ${boxingRounds}`
      : '';

  return (
    // HARD RULE: no scroll. Fixed column — header + flexible middle + footer.
    // The board sizes itself off the leftover height via container queries,
    // so nothing ever pushes past the window.
    <div className="h-full overflow-hidden bg-chess-page flex flex-col">
      {/* Header: round + bell timer */}
      <div className="bg-chess-surface border-b border-slate-200 shrink-0">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-2 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-chess-text-muted">
              {isBreak
                ? 'Break'
                : seg?.kind === 'chess' && seg.round === chessRounds
                  ? 'Final round'
                  : 'Round'}
            </span>
            <span className="text-sm font-black text-chess-text">{roundLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wide text-chess-text-muted">
              Bell
            </span>
            <span
              className={`text-lg font-black tabular-nums leading-none rounded-xl px-3 py-1.5 ${
                roundLeft <= 10 ? 'bg-red-50 text-[#e5484d]' : 'bg-chess-page text-chess-text'
              }`}
            >
              {fmtClock(roundLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Corner lines cross-fade in rather than snapping — she's talking, not
          flashing cue cards. */}
      <style>{`
        @keyframes boutCornerIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .bout-corner-line { animation: boutCornerIn .5s ease-out; }
      `}</style>

      <div className="flex-1 min-h-0 flex flex-col">
        {isBoxing ? (
          // ── Boxing round: a timer and Rookie in your corner ──────────────
          // NOTHING is measured here (2026-08-05, Tyler): no camera, no tap
          // pad, no count. Reaching the bell is the achievement, and Rookie
          // talking you through it is the whole experience.
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 md:px-6 py-2 text-center gap-4 max-w-md md:max-w-lg mx-auto w-full">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#e5484d] shrink-0">
              Boxing round {seg?.round}
            </div>
            <div className="text-7xl font-black text-chess-text tabular-nums shrink-0 leading-none">
              {fmtClock(roundLeft)}
            </div>
            {/* Persistent instruction — the one thing this round asks of you.
                Rookie's rotating corner lines are color; this is the job. */}
            <p className="text-xs font-black text-chess-text uppercase tracking-wide shrink-0">
              Gloves up — shadowbox or work the bag until the bell.
            </p>
            <BreathingRook size="lg" animate mood="excited" />
            {/* Rookie's corner — rotates through the round so she keeps talking */}
            <p
              key={cornerLine}
              className="bout-corner-line text-sm font-bold text-chess-text leading-snug max-w-xs min-h-[3rem] flex items-center justify-center shrink-0"
            >
              {cornerLine}
            </p>
            {/* The frozen game, visible but locked — soaks up whatever height
                is left (may get small on an SE; it's decoration here) */}
            <div
              className="flex-1 min-h-0 w-full flex items-center justify-center"
              style={{ containerType: 'size' }}
            >
              <div
                className="relative"
                style={{ width: 'min(100%, 200px, 100cqh)', aspectRatio: '1 / 1' }}
              >
                <div className="pointer-events-none opacity-40 grayscale">
                  <ChessPathBoard
                    options={{ position: fen, boardOrientation: 'white', animationDurationInMs: 0 }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-lg bg-slate-800/80 text-white text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1.5">
                    Frozen
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ── Chess round (also shown, dimmed, under the bell overlay) ─────
          <div className="flex-1 min-h-0 max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-2 flex flex-col gap-1.5">
            {/* Rookie's clock — pacing/flavor only, she can never flag */}
            <div className="flex items-center justify-between shrink-0">
              <span className="text-sm font-black text-chess-text">
                Rookie <span className="text-chess-text-muted font-bold">· Level {level}</span>
              </span>
              <span
                className={`text-base font-black tabular-nums rounded-lg px-2.5 py-0.5 ${
                  rookieThinking ? 'bg-violet-100 text-violet-700' : 'bg-chess-page text-chess-text-muted'
                }`}
              >
                {fmtClock(rookieClock)}
              </span>
            </div>

            {/* Board scales to the leftover height: square, capped by width.
                Centered so slack splits evenly between the two clocks. */}
            <div
              className="flex-1 min-h-0 w-full flex items-center justify-center"
              style={{ containerType: 'size' }}
            >
              <div className="w-full" style={{ width: 'min(100%, 100cqh)', aspectRatio: '1 / 1' }}>
                <ChessPathBoard
                  options={{
                    position: fen,
                    boardOrientation: 'white',
                    onPieceDrop: (args: any) => {
                      const from = args.sourceSquare as Square;
                      const to = args.targetSquare as Square;
                      // Dragging on Rookie's turn queues a premove (snaps back
                      // — the highlight is what says a move is waiting).
                      if (rookieThinking || game?.turn() !== 'w') return onPremoveDrop(from, to);
                      return doMove(from, to);
                    },
                    onSquareClick: (args: any) => onSquareClick(args.square as Square),
                    squareStyles: sqStyles,
                    animationDurationInMs: ANIM_MS,
                  }}
                />
              </div>
            </div>

            {/* YOUR clock — the one real clock */}
            <div className="flex items-center justify-between shrink-0">
              <span className="text-sm font-black text-chess-text">You</span>
              <span
                className={`text-xl font-black tabular-nums rounded-lg px-3 py-0.5 ${
                  userBank <= 30
                    ? 'bg-red-50 text-[#e5484d]'
                    : game && game.turn() === 'w' && !rookieThinking
                      ? 'bg-chess-green/10 text-chess-green'
                      : 'bg-chess-page text-chess-text'
                }`}
              >
                {fmtClock(userBank)}
              </span>
            </div>

            {/* Status / Rookie's line — fixed height so the board never shifts */}
            <div className="text-center min-h-[2rem] shrink-0">
              {rookieLine ? (
                <span
                  className={`text-xs font-semibold leading-snug ${
                    userBank <= 30 ? 'text-[#e5484d]' : 'text-chess-text-muted'
                  }`}
                >
                  {rookieLine}
                </span>
              ) : rookieThinking ? (
                <span className="text-xs font-medium text-chess-text-muted">
                  Rookie is thinking…
                </span>
              ) : game && game.turn() === 'w' ? (
                <span className="text-xs font-semibold text-chess-green">
                  Your move — your clock is running
                </span>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Footer: quit — two taps, never one. First tap arms a confirm row that
          auto-reverts after 4s so a stray thumb can't end the bout. */}
      <div className="bg-chess-surface border-t border-slate-200 shrink-0">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-1 flex items-center justify-center gap-2">
          {towelConfirm ? (
            <>
              <span className="text-xs font-bold text-chess-text leading-snug text-left">
                Quit the bout? Today&apos;s ranked card is spent.
              </span>
              <button
                onClick={() => {
                  playButtonClick();
                  if (towelTimerRef.current) clearTimeout(towelTimerRef.current);
                  setTowelConfirm(false);
                }}
                className="rounded-xl bg-chess-green text-white font-black text-sm px-3 py-1.5 min-h-[40px] tap-highlight shrink-0"
              >
                Keep fighting
              </button>
              <button
                onClick={() => {
                  playButtonClick();
                  if (towelTimerRef.current) clearTimeout(towelTimerRef.current);
                  router.push('/box');
                }}
                className="rounded-xl border-2 border-slate-200 text-chess-text-muted font-black text-sm px-3 py-1.5 min-h-[40px] tap-highlight shrink-0"
              >
                Quit
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                playButtonClick();
                setTowelConfirm(true);
                if (towelTimerRef.current) clearTimeout(towelTimerRef.current);
                towelTimerRef.current = setTimeout(() => setTowelConfirm(false), 4000);
              }}
              className="text-chess-text-muted font-bold text-sm py-1 px-4 min-h-[40px] tap-highlight"
            >
              Throw in the towel
            </button>
          )}
        </div>
      </div>

      {/* BREAK — a real 1:00 round on the card, counted down. Sits over the
          frozen board so you can still see the position you're coming back to. */}
      {isBreak && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <style>{`
            @keyframes bellPop { 0% { opacity:0; transform: scale(.92);} 100%{opacity:1; transform: scale(1);} }
            .bout-bell-card { animation: bellPop .35s cubic-bezier(.16,1,.3,1); }
          `}</style>
          <div className="bout-bell-card w-full max-w-xs bg-chess-surface rounded-3xl shadow-2xl p-6 flex flex-col items-center gap-2 text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#e5484d]">
              The bell
            </span>
            <h2 className="text-2xl font-black text-chess-text">
              {upNext?.kind === 'boxing' ? 'Gloves on' : 'Back to the board'}
            </h2>
            <div
              className={`text-6xl font-black tabular-nums leading-none my-1 ${
                roundLeft <= 10 ? 'text-[#e5484d]' : 'text-chess-text'
              }`}
              aria-label="Break time remaining"
            >
              {fmtClock(roundLeft)}
            </div>
            <p className="text-sm font-semibold text-chess-text-muted leading-snug">{bellLine}</p>
            <p className="text-xs font-bold text-chess-text leading-snug">{cornerLine}</p>
          </div>
        </div>
      )}
    </div>
  );
}
