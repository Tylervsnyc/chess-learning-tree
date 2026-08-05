'use client';

/**
 * /box/bout — Bout mode v1 (BOUT_MODE flag).
 *
 * ONE game vs Rookie split across chess rounds; the board freezes during
 * boxing rounds; you resume the same position gassed. Design doc:
 * docs/chess-boxing-app-structure.md ("Bout mode" — binding).
 *
 * Engine: the SAME vs-Rookie stack /play and the workout's Fight Rounds use —
 * stockfish adapter + getLevelEngineConfig + reactive opening book. No second
 * implementation.
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
import { stockfish } from '@/lib/stockfish/stockfish-adapter';
import { getLevelEngineConfig } from '@/lib/rookie-levels';
import { getReactiveBookMove } from '@/lib/rookie-opening-book';
import { FIGHT_MAX_LEVEL } from '@/lib/workout/schedule';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { fireConfetti } from '@/lib/confetti';
import { BreathingRook } from '@/components/ui/BreathingRook';
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
  BOUT_SEGMENTS,
  BOXING_ROUND_COUNT,
  USER_BANK_SECONDS,
  ROOKIE_CLOCK_SECONDS,
  ROOKIE_CLOCK_FLOOR,
  ROOKIE_THINK_MIN_MS,
  ROOKIE_THINK_MAX_MS,
  CHESS_ROUND_SECONDS,
  BOXING_ROUND_SECONDS,
  boutPoints,
  decideOnMaterial,
  materialBalance,
  fmtClock,
  pickLine,
  BOUT_LINES,
  type BoutOutcome,
} from '@/lib/bout/bout';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const ANIM_MS = 300;

type Phase = 'prefight' | 'chess' | 'bell' | 'boxing' | 'done';

/** User's unlocked /play level (same localStorage key /play writes). */
function loadRookieLevel(): number {
  if (typeof window === 'undefined') return 1;
  const level = parseInt(window.localStorage.getItem('rookie-level') || '1', 10);
  return Number.isFinite(level) ? Math.max(1, Math.min(10, level)) : 1;
}

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
  const [segIndex, setSegIndex] = useState(0); // into BOUT_SEGMENTS
  const [roundLeft, setRoundLeft] = useState(0); // bell timer for current segment
  const [bellLine, setBellLine] = useState('');

  // ── Clocks ────────────────────────────────────────────────────────────────
  // userBank is the ONE real clock; rookieClock is flavor and never flags.
  const [userBank, setUserBank] = useState(USER_BANK_SECONDS);
  // Mirror of userBank for the finish path — finishBout has no deps on purpose
  // (it must never be re-created mid-bout), so it reads the clock off a ref.
  const userBankRef = useRef(USER_BANK_SECONDS);
  // One idempotency key per bout, minted in begin(). A retry or a double-tap
  // on the result screen can never write a second row.
  const boutKeyRef = useRef('');
  // One persist attempt per bout (the effect can re-run on re-render).
  const persistedRef = useRef(false);
  // Points confirmed by the server — the client preview is the fallback.
  const [savedPoints, setSavedPoints] = useState<number | null>(null);
  const [sharing, setSharing] = useState(false);
  const [rookieClock, setRookieClock] = useState(ROOKIE_CLOCK_SECONDS);

  // ── Game (same shape as the workout's Fight Rounds) ───────────────────────
  const [fen, setFen] = useState(START_FEN);
  const fenRef = useRef(START_FEN);
  const movesRef = useRef<string[]>([]); // SAN history (opening book)
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
  // Boxing rounds the user reached the bell in — the conditioning half of the
  // score. Nothing else about a boxing round is measured (see below).
  const roundsSurvivedRef = useRef(0);

  const [result, setResult] = useState<BoutResult | null>(null);
  // Rookie's corner: one line at a time during a boxing round, swapped on a
  // timer. She is the entire round now, so she can't go quiet.
  const [cornerLine, setCornerLine] = useState<string>(BOUT_LINES.boxing[0]);

  const seg = BOUT_SEGMENTS[segIndex];

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
        points: boutPoints({ outcome, roundsSurvived: roundsSurvivedRef.current }),
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

      // Opening book (Rookie is black): first 5 of her moves at L3+ — same cap
      // /play and Fight Rounds use.
      const sans = movesRef.current;
      const rookieMovesPlayed = sans.filter((_, i) => i % 2 === 1).length;
      if (levelRef.current >= 3 && rookieMovesPlayed < 5) {
        const book = getReactiveBookMove(currentFen, sans, 'black');
        if (book.inBook && book.moveSan) {
          scheduleApply({ san: book.moveSan });
          return;
        }
      }

      const cfg = getLevelEngineConfig(levelRef.current);
      if (cfg.randomMoveChance && Math.random() < cfg.randomMoveChance) {
        fallbackRandom();
        return;
      }
      if (!sfReadyRef.current) {
        fallbackRandom();
        return;
      }
      stockfish
        .getBestMoveSampled(currentFen, cfg.skillLevel, cfg.depth, cfg.multiPV, cfg.poolSize, cfg.tolerance)
        .then((uci) => {
          if (!chessActiveRef.current) return;
          if (!uci) {
            fallbackRandom();
            return;
          }
          scheduleApply({
            from: uci.slice(0, 2),
            to: uci.slice(2, 4),
            promotion: uci.length > 4 ? uci[4] : undefined,
          });
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

  const onSquareClick = useClickToMove({
    game,
    ownColor: 'w',
    selectedSquare: selected,
    setSelectedSquare: setSelected,
    tryMove: doMove,
    enabled: phase === 'chess' && !rookieThinking,
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
      for (const m of game.moves({ square: selected, verbose: true })) {
        const has = game.get(m.to as Square);
        s[m.to] = {
          ...s[m.to],
          background: has
            ? 'radial-gradient(transparent 55%, rgba(20, 85, 200, 0.4) 55%)'
            : 'radial-gradient(rgba(20, 85, 200, 0.5) 22%, transparent 22%)',
        };
      }
    }
    return s;
  }, [game, lastMv, selected]);

  // ── Segment transitions ───────────────────────────────────────────────────

  /** The bell always wins: freeze the board mid-position (or end a boxing round). */
  const ringBell = useCallback(() => {
    playBoxingBell();
    const cur = BOUT_SEGMENTS[segIndex];
    const isLast = segIndex >= BOUT_SEGMENTS.length - 1;

    if (cur.kind === 'chess') {
      // FREEZE: kill Rookie's pending move + engine work.
      chessActiveRef.current = false;
      if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
      stockfish.cancel();
      setRookieThinking(false);
      rookieThinkingRef.current = false;
      if (isLast) {
        // Final bell, no mate → the judges decide.
        // Final bell, nobody mated: the decision is the position itself.
        finishBout(decideOnMaterial(fenRef.current));
        return;
      }
      setBellLine(pickLine(BOUT_LINES.bellFreeze, segIndex + movesRef.current.length));
    } else {
      // Boxing round survived to the bell. Nothing is measured inside it —
      // reaching the end IS the achievement.
      roundsSurvivedRef.current = Math.max(roundsSurvivedRef.current, cur.round);
      setBellLine(pickLine(BOUT_LINES.bellResume, segIndex + roundsSurvivedRef.current));
    }
    setPhase('bell');
  }, [segIndex, finishBout]);

  /** Leave the bell overlay into the next segment. */
  const nextSegment = useCallback(() => {
    const next = segIndex + 1;
    const nextSeg = BOUT_SEGMENTS[next];
    if (!nextSeg) return; // final bell already decided the bout
    setSegIndex(next);
    setRoundLeft(nextSeg.seconds);
    if (nextSeg.kind === 'boxing') {
      setRookieLine(pickLine(BOUT_LINES.boxing, next));
      setPhase('boxing');
    } else {
      setRookieLine(pickLine(BOUT_LINES.bellResume, next + movesRef.current.length));
      setPhase('chess');
    }
    playBoxingBell();
  }, [segIndex]);

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

  // Auto-advance the bell overlay after a short beat.
  useEffect(() => {
    if (phase !== 'bell') return;
    const t = setTimeout(nextSegment, 2600);
    return () => clearTimeout(t);
  }, [phase, nextSegment]);

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
    if (phase !== 'chess' && phase !== 'boxing') return;
    if (roundLeft <= 0) {
      ringBell();
      return;
    }
    if (roundLeft === 10) playWoodClap();
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
      try {
        const res = await fetch('/api/bout/finish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            outcome: result.outcome,
            roundsSurvived: result.roundsSurvived,
            moves: result.moves,
            level: levelRef.current,
            clockLeftSeconds: result.clockLeft,
            finalFen: result.finalFen,
            clientSessionId: result.boutKey,
          }),
        });
        if (!res.ok) return; // 401 logged-out, or a real failure — nothing to claim
        const body = (await res.json()) as { ok?: boolean; points?: number };
        if (cancelled) return;
        if (typeof body.points === 'number') setSavedPoints(body.points);
        // The bout is a finished unit — it can earn the day.
        await claimStreakToday();
      } catch {
        /* offline / blocked — the bout still happened on screen */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [phase, result]);

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
    setSelected(null);
    setLastMv(null);
    setRookieThinking(false);
    rookieThinkingRef.current = false;
    setUserBank(USER_BANK_SECONDS);
    userBankRef.current = USER_BANK_SECONDS;
    setRookieClock(ROOKIE_CLOCK_SECONDS);
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
    setResult(null);

    const lvl = Math.min(FIGHT_MAX_LEVEL, loadRookieLevel());
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
    setRoundLeft(BOUT_SEGMENTS[0].seconds);
    setRookieLine(null);
    setPhase('chess');
    BoutEvents.started(lvl);
  }, []);

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
      <div className="h-full overflow-hidden bg-chess-page flex flex-col">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-2.5 my-auto flex flex-col gap-2 min-h-0">
          <div
            className="rounded-2xl p-3 text-center shadow-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #b91c1c, #e5484d, #f97316)' }}
          >
            <h1
              className="text-xl md:text-3xl font-black text-white tracking-tight"
              style={{ textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}
            >
              Bout vs Rookie
            </h1>
            <p className="text-white/90 text-xs md:text-sm font-bold mt-0.5">
              One game. The bell always wins.
            </p>
          </div>

          {/* Round card */}
          <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-3 shrink-0">
            <h2 className="text-[10px] font-black text-chess-text-muted uppercase tracking-wide text-center mb-1.5">
              Round card
            </h2>
            <div className="flex flex-col gap-1">
              {BOUT_SEGMENTS.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-3 py-1 ${
                    s.kind === 'chess' ? 'bg-violet-50' : 'bg-orange-50'
                  }`}
                >
                  <span className="text-[13px] font-black text-chess-text">
                    {s.kind === 'chess' ? `Chess ${s.round}` : `Boxing ${s.round}`}
                    {s.kind === 'chess' && s.round === 3 && (
                      <span className="text-chess-text-muted font-bold"> · final round</span>
                    )}
                  </span>
                  <span className="text-xs font-bold text-chess-text-muted tabular-nums">
                    {fmtClock(s.seconds)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules in one glance */}
          <div
            className="rounded-2xl border border-amber-200 shadow-sm p-3 shrink-0"
            style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' }}
          >
            <ul className="flex flex-col gap-1 text-xs font-bold text-amber-900 leading-snug">
              <li>One game, frozen at every bell — you come back gassed.</li>
              <li>
                Your clock: {fmtClock(USER_BANK_SECONDS)} for all chess rounds. Flag = loss.
              </li>
              <li>Rookie thinks 2-4s a move. She never flags. Rude, honestly.</li>
              <li>Boxing rounds: {BOXING_ROUND_SECONDS}s of work. Rookie&apos;s in your corner.</li>
              <li>No mate by the final bell — material decides. Level goes to you.</li>
            </ul>
          </div>

          <p className="text-center text-xs font-semibold text-chess-text-muted leading-snug px-2 shrink-0">
            {pickLine(BOUT_LINES.prefight, new Date().getDate())}
          </p>

          <button
            onClick={begin}
            className="w-full rounded-2xl bg-[#e5484d] text-white font-black text-lg py-3 min-h-[48px] shadow-[0_4px_0_#b53437] tap-highlight shrink-0"
          >
            Fight
          </button>
          <button
            onClick={() => {
              playButtonClick();
              router.push('/box');
            }}
            className="text-sm font-bold text-chess-text-muted py-1 min-h-[40px] tap-highlight shrink-0"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ── DONE — result + judges' scorecard reveal ──────────────────────────────
  if (phase === 'done' && result) {
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
                <div className="text-xl font-black text-chess-green tabular-nums">
                  {earned.toLocaleString()}
                </div>
                <div className="text-[11px] font-semibold text-chess-text-muted">points</div>
              </div>
            </div>

            <div className="flex gap-2 w-full mt-1">
              <button
                onClick={() => {
                  playButtonClick();
                  void shareBout();
                }}
                disabled={sharing}
                className="flex-1 rounded-2xl border-2 border-slate-200 text-chess-text font-black text-base py-2.5 transition tap-highlight disabled:opacity-60"
              >
                {sharing ? 'Sharing…' : 'Share'}
              </button>
              <button
                onClick={() => {
                  playButtonClick();
                  setPhase('prefight');
                }}
                className="flex-1 rounded-2xl bg-[#e5484d] text-white font-black text-base py-2.5 shadow-sm transition tap-highlight"
              >
                Rematch
              </button>
            </div>
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
  const isChess = phase === 'chess';
  const isBoxing = phase === 'boxing';
  const roundLabel = seg
    ? seg.kind === 'chess'
      ? `Chess ${seg.round} of 3`
      : `Boxing ${seg.round} of ${BOXING_ROUND_COUNT}`
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
              {seg?.kind === 'chess' && seg.round === 3 ? 'Final round' : 'Round'}
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
                      if (rookieThinking) return false;
                      return doMove(args.sourceSquare as Square, args.targetSquare as Square);
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

      {/* Footer: quit */}
      <div className="bg-chess-surface border-t border-slate-200 shrink-0">
        <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 py-1 flex justify-center">
          <button
            onClick={() => {
              playButtonClick();
              router.push('/box');
            }}
            className="text-chess-text-muted font-bold text-sm py-1 px-4 min-h-[40px] tap-highlight"
          >
            Throw in the towel
          </button>
        </div>
      </div>

      {/* Bell overlay — the freeze moment between rounds */}
      {phase === 'bell' && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <style>{`
            @keyframes bellPop { 0% { opacity:0; transform: scale(.6);} 60%{opacity:1; transform: scale(1.08);} 100%{transform: scale(1);} }
            .bout-bell-card { animation: bellPop .35s cubic-bezier(.2,.9,.3,1.2); }
          `}</style>
          <div className="bout-bell-card w-full max-w-xs bg-chess-surface rounded-3xl shadow-2xl p-6 flex flex-col items-center gap-3 text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#e5484d]">
              The bell
            </span>
            <h2 className="text-2xl font-black text-chess-text">
              {BOUT_SEGMENTS[segIndex]?.kind === 'chess' ? 'Gloves on' : 'Back to the board'}
            </h2>
            <p className="text-sm font-semibold text-chess-text-muted leading-snug">{bellLine}</p>
          </div>
        </div>
      )}
    </div>
  );
}
