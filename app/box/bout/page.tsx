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
 * implementation. Boxing rounds reuse the workout's punch machinery
 * (PunchTracker camera counter); with the camera off, a tap-to-count pad keeps
 * the round playable (and doubles as the no-camera dev path).
 *
 * v1 scope: local state only — no DB writes, no leaderboard, no streak claim.
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
import { PunchTracker } from '@/components/workout/PunchTracker';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { fireConfetti } from '@/lib/confetti';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { BoutEvents } from '@/lib/analytics/posthog';
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
  BOXING_PAR,
  rookieBoxingScore,
  decideOnCards,
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

interface BoutResult {
  outcome: BoutOutcome;
  userCards: number[];
  rookieCards: number[];
  punches: number;
  rookieLine: string;
  meltdown: boolean;
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

  // ── Cards + punches ───────────────────────────────────────────────────────
  const seedRef = useRef(1);
  const userCardsRef = useRef<number[]>([]);
  const [punchCamOn, setPunchCamOn] = useState(false);
  const punchesRef = useRef(0); // whole-bout total
  const segPunchBaseRef = useRef(0); // per-mount cumulative base (PunchTracker restarts)
  const roundStartPunchesRef = useRef(0);
  const [punchTotal, setPunchTotal] = useState(0);

  const [result, setResult] = useState<BoutResult | null>(null);

  const seg = BOUT_SEGMENTS[segIndex];
  const rookieCards = useMemo(
    () =>
      Array.from({ length: BOXING_ROUND_COUNT }, (_, i) =>
        rookieBoxingScore(seedRef.current, i + 1),
      ),
    // seedRef is set before first render of any card UI (begin())
    [phase], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setPunchCamOn(window.localStorage.getItem('cp_punch_cam') === '1');
  }, []);

  const onPunch = useCallback((mountTotal: number) => {
    const delta = mountTotal - segPunchBaseRef.current;
    if (delta > 0) {
      punchesRef.current += delta;
      setPunchTotal(punchesRef.current);
    }
    segPunchBaseRef.current = mountTotal;
  }, []);

  const addTapPunch = useCallback(() => {
    punchesRef.current += 1;
    setPunchTotal(punchesRef.current);
  }, []);

  // ── Finish ────────────────────────────────────────────────────────────────
  const finishBout = useCallback(
    (outcome: BoutOutcome) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      chessActiveRef.current = false;
      if (rookieTimerRef.current) clearTimeout(rookieTimerRef.current);
      stockfish.cancel();
      setRookieThinking(false);

      // Pad unfought boxing rounds with zeros so the scorecard always shows
      // both rounds (a KO in Chess 1 means empty cards — that reads right).
      const userCards = Array.from(
        { length: BOXING_ROUND_COUNT },
        (_, i) => userCardsRef.current[i] ?? 0,
      );
      const rCards = Array.from({ length: BOXING_ROUND_COUNT }, (_, i) =>
        rookieBoxingScore(seedRef.current, i + 1),
      );
      // Meltdown: mated in a bout she was WINNING on the cards (fought rounds).
      const fought = userCardsRef.current.length;
      const userSoFar = userCardsRef.current.reduce((s, n) => s + n, 0);
      const rookieSoFar = rCards.slice(0, fought).reduce((s, n) => s + n, 0);
      const meltdown = outcome === 'ko_win' && fought > 0 && rookieSoFar > userSoFar;

      const seed = movesRef.current.length + punchesRef.current;
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
        punches: punchesRef.current,
        level: levelRef.current,
      });

      setResult({
        outcome,
        userCards,
        rookieCards: rCards,
        punches: punchesRef.current,
        rookieLine: line,
        meltdown,
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
        finishBout(decideOnCards(userCardsRef.current, rookieCards));
        return;
      }
      setBellLine(pickLine(BOUT_LINES.bellFreeze, segIndex + movesRef.current.length));
    } else {
      // Boxing round over — bank this round's punch score on the cards.
      const roundPunches = punchesRef.current - roundStartPunchesRef.current;
      userCardsRef.current[cur.round - 1] = roundPunches;
      setBellLine(pickLine(BOUT_LINES.bellResume, segIndex + punchesRef.current));
    }
    setPhase('bell');
  }, [segIndex, finishBout, rookieCards]);

  /** Leave the bell overlay into the next segment. */
  const nextSegment = useCallback(() => {
    const next = segIndex + 1;
    const nextSeg = BOUT_SEGMENTS[next];
    if (!nextSeg) return; // final bell already decided the bout
    setSegIndex(next);
    setRoundLeft(nextSeg.seconds);
    if (nextSeg.kind === 'boxing') {
      segPunchBaseRef.current = 0; // fresh PunchTracker mount
      roundStartPunchesRef.current = punchesRef.current;
      setRookieLine(pickLine(BOUT_LINES.boxing, next));
      setPhase('boxing');
    } else {
      setRookieLine(pickLine(BOUT_LINES.bellResume, next + movesRef.current.length));
      setPhase('chess');
    }
    playBoxingBell();
  }, [segIndex]);

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
            const next = b - 1;
            if (next <= 0) finishBout('flag_loss');
            return Math.max(0, next);
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
    setRookieClock(ROOKIE_CLOCK_SECONDS);
    userCardsRef.current = [];
    punchesRef.current = 0;
    segPunchBaseRef.current = 0;
    roundStartPunchesRef.current = 0;
    setPunchTotal(0);
    finishedRef.current = false;
    tauntedRef.current = false;
    confettiFiredRef.current = false;
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
              <li>Boxing rounds score the cards: your punches vs hers.</li>
              <li>No mate by the final bell — judges decide. Tie goes to you.</li>
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
              ? 'You win on the cards'
              : result.outcome === 'decision_loss'
                ? 'Rookie takes the decision'
                : 'Draw';
    const userTotal = result.userCards.reduce((s, n) => s + n, 0);
    const rookieTotal = result.rookieCards.reduce((s, n) => s + n, 0);
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

            {/* Judges' scorecard */}
            <div className="w-full rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-chess-page px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-chess-text-muted">
                Judges&apos; scorecard
              </div>
              <div className="grid grid-cols-3 text-xs font-bold text-chess-text-muted px-3 pt-2">
                <span className="text-left">Round</span>
                <span>You</span>
                <span>Rookie</span>
              </div>
              {result.userCards.map((u, i) => (
                <div
                  key={i}
                  className="bout-score-row grid grid-cols-3 px-3 py-1 text-sm font-black text-chess-text tabular-nums"
                  style={{ animationDelay: `${0.3 + i * 0.35}s` }}
                >
                  <span className="text-left text-chess-text-muted font-bold">
                    Boxing {i + 1}
                  </span>
                  <span className={u >= result.rookieCards[i] ? 'text-chess-green' : ''}>
                    {u}
                  </span>
                  <span className={result.rookieCards[i] > u ? 'text-[#e5484d]' : ''}>
                    {result.rookieCards[i]}
                  </span>
                </div>
              ))}
              <div
                className="bout-score-row grid grid-cols-3 px-3 py-1.5 text-sm font-black tabular-nums border-t border-slate-100"
                style={{ animationDelay: `${0.3 + result.userCards.length * 0.35 + 0.2}s` }}
              >
                <span className="text-left text-chess-text-muted font-bold">Total</span>
                <span className={userTotal >= rookieTotal ? 'text-chess-green' : 'text-chess-text'}>
                  {userTotal}
                </span>
                <span className={rookieTotal > userTotal ? 'text-[#e5484d]' : 'text-chess-text'}>
                  {rookieTotal}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-6 w-full pt-2 border-t border-slate-100">
              <div>
                <div className="text-xl font-black text-chess-text tabular-nums">
                  {movesRef.current.length}
                </div>
                <div className="text-[11px] font-semibold text-chess-text-muted">moves</div>
              </div>
              <div>
                <div className="text-xl font-black text-chess-text tabular-nums">
                  {result.punches}
                </div>
                <div className="text-[11px] font-semibold text-chess-text-muted">punches</div>
              </div>
              <div>
                <div className="text-xl font-black text-chess-text tabular-nums">
                  {fmtClock(userBank)}
                </div>
                <div className="text-[11px] font-semibold text-chess-text-muted">clock left</div>
              </div>
            </div>

            <button
              onClick={() => {
                playButtonClick();
                setPhase('prefight');
              }}
              className="w-full rounded-2xl bg-[#e5484d] text-white font-black text-base py-2.5 shadow-sm transition mt-1 tap-highlight"
            >
              Rematch
            </button>
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
    // The board (and the punch cam) size themselves off the leftover height
    // via container queries, so nothing ever pushes past the window.
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

      <div className="flex-1 min-h-0 flex flex-col">
        {isBoxing ? (
          // ── Boxing round: punch machinery, board frozen ──────────────────
          <div className="flex-1 min-h-0 flex flex-col items-center px-4 md:px-6 py-2 text-center gap-2 max-w-md md:max-w-lg mx-auto w-full">
            <div className="text-5xl font-black text-chess-text tabular-nums shrink-0">
              {fmtClock(roundLeft)}
            </div>
            <p className="text-xs font-semibold text-chess-text-muted leading-snug max-w-xs shrink-0">
              {rookieLine}
            </p>
            <div className="text-sm font-black text-chess-text shrink-0">
              {punchTotal - (roundStartPunchesRef.current ?? 0)} punches this round
              <span className="text-chess-text-muted font-bold">
                {' '}
                · Rookie&apos;s pace ~{BOXING_PAR}
              </span>
            </div>
            {FEATURE_FLAGS.WORKOUT_PUNCH_CAM && punchCamOn ? (
              <>
                {/* Cam feed scales to leftover height (3:4), never overflows */}
                <div
                  className="flex-[3] min-h-0 w-full flex items-center justify-center"
                  style={{ containerType: 'size' }}
                >
                  <div style={{ width: 'min(100%, 20rem, calc(100cqh * 3 / 4))' }}>
                    <PunchTracker
                      key={`bout-${segIndex}`}
                      autoStart
                      onPunch={onPunch}
                      className="w-full"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    playButtonClick();
                    setPunchCamOn(false);
                    window.localStorage.setItem('cp_punch_cam', '0');
                  }}
                  className="text-xs font-semibold text-chess-text-muted underline underline-offset-2 min-h-[36px] shrink-0"
                >
                  Turn off camera
                </button>
              </>
            ) : (
              <>
                {/* No camera: tap-to-count keeps the cards honest-ish. Also the
                    dev path for faking punches in a web preview. */}
                <button
                  onClick={addTapPunch}
                  className="w-full max-w-xs rounded-3xl bg-[#e5484d] text-white font-black text-xl py-7 shadow-[0_5px_0_#b53437] active:translate-y-[2px] active:shadow-[0_3px_0_#b53437] transition tap-highlight select-none shrink-0"
                >
                  Tap per punch
                </button>
                <p className="text-[11px] text-chess-text-muted max-w-xs shrink-0">
                  Shadowbox and tap with each punch — or turn on the camera and it counts for
                  you.
                </p>
                {FEATURE_FLAGS.WORKOUT_PUNCH_CAM && (
                  <button
                    onClick={() => {
                      playButtonClick();
                      setPunchCamOn(true);
                      window.localStorage.setItem('cp_punch_cam', '1');
                    }}
                    className="flex items-center gap-2 rounded-xl border-2 border-chess-green text-chess-green font-bold px-4 py-2 min-h-[40px] hover:bg-chess-green/5 transition shrink-0"
                  >
                    Count my punches
                  </button>
                )}
              </>
            )}
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
