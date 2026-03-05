'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { Chess, Square } from 'chess.js';
import {
  playCorrectSound,
  playMoveSound,
  playErrorSound,
  playCaptureSound,
  warmupAudio,
  vibrateOnCorrect,
  vibrateOnError,
} from '@/lib/sounds';
import { BOARD_COLORS, getCheckmateSquareHighlights } from '@/lib/puzzle-utils';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup';
import { IntroPopup } from '@/components/puzzle/IntroPopup';
import { useAudioWarmup } from '@/hooks/useAudioWarmup';
import { BreathingRook } from '@/components/ui/BreathingRook';
import {
  RookProgressAnimation,
  RookProgressAnimationRef,
} from '@/components/lesson/RookProgressAnimation';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { TutorialEvents } from '@/lib/analytics/posthog';

// ═══════════════════════════════════════════
// PROPS & TYPES
// ═══════════════════════════════════════════

export interface TutorialPuzzle {
  fen: string;
  puzzleFen: string;
  setupFrom: Square;
  setupTo: Square;
  pieceSquare: Square;
  checkmateSquare: Square;
  playerColor: 'white' | 'black';
  description: string;
}

export interface TutorialConfig {
  /** Display name of the mating piece, e.g. "queen" or "rook" */
  pieceName: string;
  /** Lesson display name shown in the header */
  lessonDisplayName: string;
  /** Analytics key for TutorialEvents */
  analyticsKey: 'checkmate' | 'rook-checkmate';
  /** Welcome popup title (first puzzle only) */
  welcomeTitle: string;
  /** Welcome popup message */
  welcomeMessage: string;
  /** Skip tutorial redirect URL */
  skipUrl: string;
  /** Per-puzzle completion messages (one per puzzle) */
  completionMessages?: string[];
  /** Free play intro messages keyed by puzzle index (puzzles 4-6) */
  freePlayIntros?: Record<number, string>;
}

interface TutorialFlowProps {
  onComplete: (correctCount: number, wrongCount: number) => void;
  lessonId: string;
  /** Custom puzzles — defaults to QUEEN_PUZZLES if not provided */
  puzzles?: TutorialPuzzle[];
  /** Custom config — defaults to queen checkmate config if not provided */
  config?: TutorialConfig;
}

// P1: Qd3→h7 mate (26 pieces, rating 400) — FULLY GUIDED
// Classic h7 checkmate pattern. Knight on f3 + bishop on c2 support.
const PUZZLE_1: TutorialPuzzle = {
  fen: 'r1b2rk1/p3qpp1/3np2p/1p1p4/3P4/1PPQ1N2/P1B2PPP/R4RK1 b - - 1 18',
  puzzleFen: 'r1b2rk1/4qpp1/p2np2p/1p1p4/3P4/1PPQ1N2/P1B2PPP/R4RK1 w - - 0 19',
  setupFrom: 'a7' as Square,
  setupTo: 'a6' as Square,
  pieceSquare: 'd3' as Square,
  checkmateSquare: 'h7' as Square,
  playerColor: 'white',
  description: 'Queen delivers classic h7 checkmate',
};

// P2: Qd7→d1 back rank (28 pieces, rating 407) — SEMI-GUIDED
// Black queen infiltrates to the back rank while white's pieces are misplaced.
const PUZZLE_2: TutorialPuzzle = {
  fen: 'r3k1nr/pppq1ppp/2n1p3/1B2P3/Q3P1b1/8/PP1N1PPP/R1B1K2R w KQkq - 1 12',
  puzzleFen: 'r3k1nr/pppq1ppp/2n1p3/1B2P3/Q3P1b1/1N6/PP3PPP/R1B1K2R b KQkq - 2 12',
  setupFrom: 'd2' as Square,
  setupTo: 'b3' as Square,
  pieceSquare: 'd7' as Square,
  checkmateSquare: 'd1' as Square,
  playerColor: 'black',
  description: 'Black queen infiltrates the back rank',
};

// P3: Qb3→f7 mate (31 pieces, rating 450) — LIGHT TIP
// The classic f7 weakness — queen strikes the undefended pawn.
const PUZZLE_3: TutorialPuzzle = {
  fen: 'rnbqkb1r/pp2pppp/2p2n2/6N1/4p3/1QP5/PP1P1PPP/RNB1KB1R b KQkq - 3 5',
  puzzleFen: 'rnbqkb1r/pp3ppp/2p2n2/4p1N1/4p3/1QP5/PP1P1PPP/RNB1KB1R w KQkq - 0 6',
  setupFrom: 'e7' as Square,
  setupTo: 'e5' as Square,
  pieceSquare: 'b3' as Square,
  checkmateSquare: 'f7' as Square,
  playerColor: 'white',
  description: 'Queen exploits the f7 weakness',
};

// P4: Qg4→g7 mate (26 pieces, rating 437) — MINIMAL HINT
// Queen crashes through on g7, king trapped on h-file by its own pawns.
const PUZZLE_4: TutorialPuzzle = {
  fen: '3rr3/2pq1ppk/p1npB2p/1p2pN2/4P1QP/P1PP4/1P3PP1/R4RK1 b - - 0 20',
  puzzleFen: '3rr3/2p2ppk/p1npq2p/1p2pN2/4P1QP/P1PP4/1P3PP1/R4RK1 w - - 0 21',
  setupFrom: 'd7' as Square,
  setupTo: 'e6' as Square,
  pieceSquare: 'g4' as Square,
  checkmateSquare: 'g7' as Square,
  playerColor: 'white',
  description: 'Queen crashes through on the g-file',
};

// P5: Qd6→h2 mate (26 pieces, rating 500) — NO HELP
// Black queen finds the h2 weakness with white's king exposed.
const PUZZLE_5: TutorialPuzzle = {
  fen: '1r2k2r/ppb2ppp/2pq1n2/P2p4/3P4/4P2P/1PQBNPP1/R4RK1 w k - 4 17',
  puzzleFen: '1r2k2r/ppb2ppp/2pq1n2/P2p4/1P1P4/4P2P/2QBNPP1/R4RK1 b k - 0 17',
  setupFrom: 'b2' as Square,
  setupTo: 'b4' as Square,
  pieceSquare: 'd6' as Square,
  checkmateSquare: 'h2' as Square,
  playerColor: 'black',
  description: 'Black queen finds h2 checkmate',
};

// P6: Qf3→f7 mate (31 pieces, rating 448) — NO HELP
// Full opening position — queen strikes f7 while knight lurks on h5.
const PUZZLE_6: TutorialPuzzle = {
  fen: 'r1bqk2r/ppp2pb1/2np1np1/4p1P1/2B1P3/2P2Q1P/PP1P1P2/RNB1K1NR b KQkq - 0 7',
  puzzleFen: 'r1bqk2r/ppp2pb1/2np2p1/4p1Pn/2B1P3/2P2Q1P/PP1P1P2/RNB1K1NR w KQkq - 1 8',
  setupFrom: 'f6' as Square,
  setupTo: 'h5' as Square,
  pieceSquare: 'f3' as Square,
  checkmateSquare: 'f7' as Square,
  playerColor: 'white',
  description: 'Queen strikes f7 in a crowded position',
};

const QUEEN_PUZZLES: TutorialPuzzle[] = [PUZZLE_1, PUZZLE_2, PUZZLE_3, PUZZLE_4, PUZZLE_5, PUZZLE_6];

const DEFAULT_CONFIG: TutorialConfig = {
  pieceName: 'queen',
  lessonDisplayName: 'Queen Checkmate: Easy',
  analyticsKey: 'checkmate',
  welcomeTitle: '',
  welcomeMessage: "\"Hi, I'm Rookie. Welcome to Chess Path. I'm going to show you how to checkmate!\"",
  skipUrl: '/lesson/1.1.1?skipTutorial=true',
};

// ═══════════════════════════════════════════
// ROOK MATE-IN-1 PUZZLES (lesson 1.1.2)
// All verified back-rank mates, rating 400-445
// ═══════════════════════════════════════════

// R1: Rd1→d8 mate (rating 400) — FULLY GUIDED
// White rook slides to d8 for a classic back-rank mate.
const ROOK_PUZZLE_1: TutorialPuzzle = {
  fen: '1k4nr/ppp2p2/5q2/1P6/2P3p1/P5Pp/1Q3P1K/3R3R b - - 3 26',
  puzzleFen: '1k4nr/ppp2p2/8/1P6/2P3p1/P5Pp/1q3P1K/3R3R w - - 0 27',
  setupFrom: 'f6' as Square,
  setupTo: 'b2' as Square,
  pieceSquare: 'd1' as Square,
  checkmateSquare: 'd8' as Square,
  playerColor: 'white',
  description: 'Rook delivers back rank checkmate',
};

// R2: Rd7→d1 mate (rating 400) — SEMI-GUIDED
// Black rook infiltrates to the back rank while white's pieces can't defend.
const ROOK_PUZZLE_2: TutorialPuzzle = {
  fen: '6k1/3r1p1p/4p1p1/1R6/8/P1P5/1P3PPP/6K1 w - - 0 29',
  puzzleFen: '6k1/3r1p1p/4p1p1/1R6/P7/2P5/1P3PPP/6K1 b - - 0 29',
  setupFrom: 'a3' as Square,
  setupTo: 'a4' as Square,
  pieceSquare: 'd7' as Square,
  checkmateSquare: 'd1' as Square,
  playerColor: 'black',
  description: 'Rook sneaks to the back rank',
};

// R3: Rc3→c1 mate (rating 414) — SEMI-GUIDED
// Black rook drops to c1 for a clean back-rank mate.
const ROOK_PUZZLE_3: TutorialPuzzle = {
  fen: '5k2/p4p1p/1p4p1/8/4P3/2r5/P4PPP/1R4K1 w - - 0 23',
  puzzleFen: '5k2/p4p1p/1p4p1/8/4P3/2r5/PR3PPP/6K1 b - - 1 23',
  setupFrom: 'b1' as Square,
  setupTo: 'b2' as Square,
  pieceSquare: 'c3' as Square,
  checkmateSquare: 'c1' as Square,
  playerColor: 'black',
  description: 'Rook drops to the back rank',
};

// R4: Rc1→c8 mate (rating 412) — FREE PLAY
// White rook strikes the back rank after black's knight moves away.
const ROOK_PUZZLE_4: TutorialPuzzle = {
  fen: '6k1/5ppp/4p1b1/1N1pP3/1P1n4/r7/5PPP/2R2BK1 b - - 0 25',
  puzzleFen: '6k1/5ppp/4p1b1/1n1pP3/1P6/r7/5PPP/2R2BK1 w - - 0 26',
  setupFrom: 'd4' as Square,
  setupTo: 'b5' as Square,
  pieceSquare: 'c1' as Square,
  checkmateSquare: 'c8' as Square,
  playerColor: 'white',
  description: 'Rook punishes the undefended back rank',
};

// R5: Rf1→f8 mate (rating 437) — FREE PLAY
// White rook uses the open f-file to deliver mate on the back rank.
const ROOK_PUZZLE_5: TutorialPuzzle = {
  fen: '7k/6p1/2p4p/p3P3/P7/1P1Bq2P/2P3P1/5R1K b - - 0 32',
  puzzleFen: '7k/6p1/2p4p/p3q3/P7/1P1B3P/2P3P1/5R1K w - - 0 33',
  setupFrom: 'e3' as Square,
  setupTo: 'e5' as Square,
  pieceSquare: 'f1' as Square,
  checkmateSquare: 'f8' as Square,
  playerColor: 'white',
  description: 'Rook crashes through on the f-file',
};

// R6: Re6→e1 mate (rating 445) — FREE PLAY
// Black rook races to the back rank in a busy position.
const ROOK_PUZZLE_6: TutorialPuzzle = {
  fen: '8/ppR3pp/4rk2/n4p2/3q4/1P6/P4PPP/3R2K1 w - - 6 29',
  puzzleFen: '8/ppR3pp/4rk2/n4p2/3R4/1P6/P4PPP/6K1 b - - 0 29',
  setupFrom: 'd1' as Square,
  setupTo: 'd4' as Square,
  pieceSquare: 'e6' as Square,
  checkmateSquare: 'e1' as Square,
  playerColor: 'black',
  description: 'Rook finds the back rank mate',
};

export const ROOK_PUZZLES: TutorialPuzzle[] = [
  ROOK_PUZZLE_1, ROOK_PUZZLE_2, ROOK_PUZZLE_3,
  ROOK_PUZZLE_4, ROOK_PUZZLE_5, ROOK_PUZZLE_6,
];

export const ROOK_TUTORIAL_CONFIG: TutorialConfig = {
  pieceName: 'rook',
  lessonDisplayName: 'Rook Checkmate: Easy',
  analyticsKey: 'rook-checkmate',
  welcomeTitle: "Now let's try rook checkmates!",
  welcomeMessage: "The rook is great at back-rank mates.\n\nSlide your rook to deliver checkmate!",
  skipUrl: '/lesson/1.1.2?skipTutorial=true',
  completionMessages: [
    "Slammed the back door shut!",
    "That king never saw it coming!",
    "Back rank is your playground now.",
    "Cold, clean, ruthless. Love it.",
    "The rook does the heavy lifting!",
    "Six rook mates down. You're dangerous!",
  ],
  freePlayIntros: {
    3: "Your turn. Find the back rank mate!",
    4: "No hints this time. You've got this.",
    5: "Last one. Show me what you learned.",
  },
};

// All 64 squares for dimming
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
const ALL_SQUARES: Square[] = FILES.flatMap(f =>
  RANKS.map(r => `${f}${r}` as Square)
);

// ═══════════════════════════════════════════
// GUIDANCE SYSTEM — 3 tiers:
//   Puzzle 1: fully guided (step-by-step)
//   Puzzles 2-3: semi-guided (tap queen prompt + timed hint)
//   Puzzles 4-6: free play
// ═══════════════════════════════════════════

type GuidedStepId = 'welcome' | 'tap-piece' | 'tap-mate';

interface GuidedStep {
  id: GuidedStepId;
  title?: string;
  message: string;
  buttonText?: string;
  useIntroPopup: boolean;
  boardInteractive: boolean;
  dimExcept?: Square[];
  highlightSquares?: Square[];
}

function buildGuidedSteps(firstPuzzle: TutorialPuzzle, config: TutorialConfig): GuidedStep[] {
  const capPiece = config.pieceName.charAt(0).toUpperCase() + config.pieceName.slice(1);
  return [
    {
      id: 'welcome',
      title: config.welcomeTitle,
      message: config.welcomeMessage,
      buttonText: "Let's Play!",
      useIntroPopup: true,
      boardInteractive: false,
    },
    {
      id: 'tap-piece',
      message: `Checkmate with your ${config.pieceName}! Tap your ${config.pieceName}!`,
      useIntroPopup: false,
      boardInteractive: true,
      dimExcept: [firstPuzzle.pieceSquare],
      highlightSquares: [firstPuzzle.pieceSquare],
    },
    {
      id: 'tap-mate',
      message: 'Now tap this square!',
      useIntroPopup: false,
      boardInteractive: true,
      highlightSquares: [firstPuzzle.checkmateSquare],
    },
  ];
}

// Semi-guided state for puzzles 2-3
type SemiPhase = 'tap-piece' | 'find-mate' | 'show-hint';

function getHintDelay(puzzleIndex: number): number {
  if (puzzleIndex === 1) return 3000;
  if (puzzleIndex === 2) return 5000;
  return 0;
}

// Completion messages per puzzle
const DEFAULT_COMPLETION_MESSAGES = [
  "The King has nowhere to run, nowhere to hide!",
  'You did it!',
  'Hope that king had life insurance!',
  'Checkmate!',
  'Well played!',
  "Six for six! You're a natural!",
];

// Free play intro messages (puzzles 4-6, shown before board becomes interactive)
const DEFAULT_FREE_PLAY_INTROS: Record<number, string> = {
  3: "You're on your own! Tap the queen and find the checkmate.",
  4: "I believe in you. Don't think. Become.",
  5: "One last puzzle to make sure you know your stuff.",
};

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

export function TutorialFlow({ onComplete, lessonId, puzzles: customPuzzles, config: customConfig }: TutorialFlowProps) {
  const router = useRouter();
  useAudioWarmup();
  const trackedStartRef = React.useRef(false);

  const allPuzzles = customPuzzles || QUEEN_PUZZLES;
  const config = customConfig || DEFAULT_CONFIG;
  const completionMessages = config.completionMessages || DEFAULT_COMPLETION_MESSAGES;
  const freePlayIntros = config.freePlayIntros || DEFAULT_FREE_PLAY_INTROS;
  const guidedSteps = useMemo(() => buildGuidedSteps(allPuzzles[0], config), [allPuzzles, config]);

  // Track tutorial start once
  React.useEffect(() => {
    if (!trackedStartRef.current) {
      trackedStartRef.current = true;
      TutorialEvents.tutorialStarted(config.analyticsKey);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Puzzle state
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [currentFen, setCurrentFen] = useState<string>(allPuzzles[0].fen);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [isSetupDone, setIsSetupDone] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hintShown, setHintShown] = useState(false);
  const [shakeBoard, setShakeBoard] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [isBoardTransitioning, setIsBoardTransitioning] = useState(false);
  const [showCheckmateHighlights, setShowCheckmateHighlights] = useState(false);

  // Progress tracking
  const [streak, setStreak] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [hadWrongAnswer, setHadWrongAnswer] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);

  // Guards against double-firing (state updates batch, so boolean state can't prevent same-cycle duplicates)
  const solvedRef = React.useRef(false);
  const advancingRef = React.useRef(false);

  // Track previously highlighted selection squares so we can explicitly clear them
  // (react-chessboard v5 caches square styles — omitting a style doesn't remove it)
  const prevSelectionSquaresRef = useRef<Square[]>([]);

  // Guided tutorial state (puzzle 1 only)
  const [guidedStepIndex, setGuidedStepIndex] = useState(-1);
  const guidedStep = guidedStepIndex >= 0 && guidedStepIndex < guidedSteps.length
    ? guidedSteps[guidedStepIndex]
    : null;

  // Semi-guided state (puzzles 2-3)
  const [semiPhase, setSemiPhase] = useState<SemiPhase | null>(null);
  const hintTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rookProgressRef = useRef<RookProgressAnimationRef>(null);

  // Free play intro card (puzzles 4-6)
  const [freePlayIntro, setFreePlayIntro] = useState<string | null>(null);

  const activePuzzle = allPuzzles[puzzleIndex];
  const isGuided = puzzleIndex === 0;
  const isSemiGuided = puzzleIndex === 1 || puzzleIndex === 2;

  // Chess game instance
  const game = useMemo(() => {
    try {
      return new Chess(currentFen);
    } catch {
      return null;
    }
  }, [currentFen]);

  // ─── Setup animation (runs on mount and puzzle change) ───
  useEffect(() => {
    const puzzle = allPuzzles[puzzleIndex];
    setSelectedSquare(null);
    setWrongAttempts(0);
    setHintShown(false);
    setPuzzleComplete(false);
    setIsSetupDone(false);
    setShowCheckmateHighlights(false);
    setSemiPhase(null);
    setFreePlayIntro(null);
    solvedRef.current = false;
    advancingRef.current = false;
    setGuidedStepIndex(-1);
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }

    // Snap to pre-move position
    setAnimationDuration(0);
    setCurrentFen(puzzle.fen);

    const t1 = setTimeout(() => {
      setAnimationDuration(300);
      setCurrentFen(puzzle.puzzleFen);

      const t2 = setTimeout(() => {
        setIsSetupDone(true);

        if (puzzleIndex === 0) {
          setGuidedStepIndex(0); // Start guided flow
        } else if (puzzleIndex <= 2) {
          setSemiPhase('tap-piece'); // Start semi-guided
        } else if (freePlayIntros[puzzleIndex]) {
          setFreePlayIntro(freePlayIntros[puzzleIndex]);
        }
      }, 450);

      return () => clearTimeout(t2);
    }, 400);

    return () => clearTimeout(t1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzleIndex]);

  // ─── Semi-guided hint timer (puzzles 2-3) ───
  useEffect(() => {
    if (semiPhase !== 'find-mate') return;
    const delay = getHintDelay(puzzleIndex);
    if (!delay) return;

    hintTimerRef.current = setTimeout(() => {
      setSemiPhase('show-hint');
    }, delay);

    return () => {
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
        hintTimerRef.current = null;
      }
    };
  }, [semiPhase, puzzleIndex]);

  // Auto-select queen when hint timer fires so user can just tap mate square
  useEffect(() => {
    if (semiPhase === 'show-hint') {
      setSelectedSquare(activePuzzle.pieceSquare);
    }
  }, [semiPhase, activePuzzle]);

  // ─── Board shake helper ───
  const triggerShake = useCallback(() => {
    setShakeBoard(true);
    setTimeout(() => setShakeBoard(false), 400);
  }, []);

  // ─── Advance to next puzzle with transition ───
  const nextPuzzle = useCallback(() => {
    if (advancingRef.current) return; // prevent double-calls
    advancingRef.current = true;

    // Check completion BEFORE entering any state updater — side effects
    // inside setState updaters are unsafe (React StrictMode double-invokes them).
    if (puzzleIndex >= allPuzzles.length - 1) {
      // All puzzles done — call onComplete instead of showing done screen
      TutorialEvents.tutorialStepCompleted(config.analyticsKey, `puzzle_${puzzleIndex + 1}`, puzzleIndex);
      TutorialEvents.tutorialCompleted(config.analyticsKey);
      onComplete(completedCount, wrongCount);
      return;
    }

    TutorialEvents.tutorialStepCompleted(config.analyticsKey, `puzzle_${puzzleIndex + 1}`, puzzleIndex);
    setIsBoardTransitioning(true);
    setTimeout(() => {
      setPuzzleIndex(prev => prev + 1);
      setTimeout(() => setIsBoardTransitioning(false), 50);
    }, 150);
  }, [puzzleIndex, onComplete, completedCount, wrongCount, config, allPuzzles]);

  // ─── Try a move (free play, puzzles 2-6) ───
  const tryFreeMove = useCallback((from: Square, to: Square) => {
    if (!game || puzzleComplete || solvedRef.current) return false;

    try {
      const gameCopy = new Chess(currentFen);
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (!move) return false;

      if (gameCopy.isCheckmate()) {
        // Correct — checkmate!
        solvedRef.current = true; // prevent duplicate fires
        setCurrentFen(gameCopy.fen());
        setSelectedSquare(null);
        if (move.captured) { playCaptureSound(); } else { playMoveSound(); }
        playCorrectSound(puzzleIndex);
        vibrateOnCorrect();
        setPuzzleComplete(true);
        setStreak(s => s + 1);
        setCompletedCount(c => c + 1);
        if (hintTimerRef.current) {
          clearTimeout(hintTimerRef.current);
          hintTimerRef.current = null;
        }
        return true;
      } else {
        // Wrong — not checkmate. Show answer after 1 attempt.
        playErrorSound();
        vibrateOnError();
        triggerShake();
        setSelectedSquare(null);
        setWrongAttempts(1);
        setHintShown(true);
        setStreak(0);
        setHadWrongAnswer(true);
        setWrongCount(w => w + 1);
        // Reset position after brief delay
        setTimeout(() => setCurrentFen(activePuzzle.puzzleFen), 500);
        return false;
      }
    } catch {
      return false;
    }
  }, [game, currentFen, activePuzzle, puzzleIndex, puzzleComplete, triggerShake]);

  // ─── Free play square click handler ───
  const handleFreeSquareClick = useCallback(({ square }: { piece: unknown; square: string }) => {
    if (!game || puzzleComplete) return;
    const sq = square as Square;

    if (!selectedSquare) {
      const piece = game.get(sq);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(sq);
        if (freePlayIntro) setFreePlayIntro(null);
      }
    } else if (selectedSquare === sq) {
      setSelectedSquare(null);
    } else {
      const legalMoves = game.moves({ square: selectedSquare, verbose: true });
      const isLegal = legalMoves.some(m => m.to === sq);

      if (isLegal) {
        tryFreeMove(selectedSquare, sq);
      } else {
        const piece = game.get(sq);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(sq);
        } else {
          setSelectedSquare(null);
        }
      }
    }
  }, [game, selectedSquare, tryFreeMove, puzzleComplete, freePlayIntro]);

  // ─── Free play drag handler ───
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFreePieceDrop = useCallback((args: any) => {
    return tryFreeMove(args.sourceSquare as Square, args.targetSquare as Square);
  }, [tryFreeMove]);

  // ─── Guided click handler (puzzle 1 only) ───
  const handleGuidedSquareClick = useCallback(({ square }: { piece: unknown; square: string }) => {
    if (!game || !guidedStep?.boardInteractive || solvedRef.current) return;
    const sq = square as Square;

    if (guidedStep.id === 'tap-piece') {
      if (sq === activePuzzle.pieceSquare) {
        setSelectedSquare(sq);
        setGuidedStepIndex(prev => prev + 1);
      }
      return;
    }

    if (guidedStep.id === 'tap-mate') {
      // Allow re-selecting queen if deselected
      if (sq === activePuzzle.pieceSquare) {
        setSelectedSquare(sq);
        return;
      }
      if (!selectedSquare) return;

      if (sq === activePuzzle.checkmateSquare) {
        solvedRef.current = true;
        try {
          const gameCopy = new Chess(currentFen);
          const move = gameCopy.move({ from: selectedSquare, to: sq, promotion: 'q' });
          setCurrentFen(gameCopy.fen());
          setSelectedSquare(null);
          if (move?.captured) { playCaptureSound(); } else { playMoveSound(); }
          playCorrectSound(0);
          vibrateOnCorrect();
          setCompletedCount(c => c + 1);
          setStreak(s => s + 1);
          setPuzzleComplete(true);
        } catch {
          playErrorSound();
        }
      } else {
        const legalMoves = game.moves({ square: selectedSquare, verbose: true });
        if (legalMoves.some(m => m.to === sq)) {
          playErrorSound();
          vibrateOnError();
          triggerShake();
        }
      }
      return;
    }
  }, [game, guidedStep, activePuzzle, selectedSquare, currentFen, triggerShake]);

  // ─── Semi-guided click handler (puzzles 2-3) ───
  const handleSemiGuidedClick = useCallback(({ square }: { piece: unknown; square: string }) => {
    if (!game || puzzleComplete || solvedRef.current) return;
    const sq = square as Square;

    if (semiPhase === 'tap-piece') {
      if (sq === activePuzzle.pieceSquare) {
        setSelectedSquare(sq);
        setSemiPhase('find-mate');
      }
      return;
    }

    // find-mate or show-hint: normal piece selection + move
    if (!selectedSquare) {
      const piece = game.get(sq);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(sq);
      }
    } else if (selectedSquare === sq) {
      setSelectedSquare(null);
    } else {
      const legalMoves = game.moves({ square: selectedSquare, verbose: true });
      const isLegal = legalMoves.some(m => m.to === sq);
      if (isLegal) {
        tryFreeMove(selectedSquare, sq);
      } else {
        const piece = game.get(sq);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(sq);
        } else {
          setSelectedSquare(null);
        }
      }
    }
  }, [game, semiPhase, activePuzzle, selectedSquare, tryFreeMove, puzzleComplete]);

  // ─── Square highlight styles ───
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Layer 1: No last-move highlights in tutorial — they're distracting for new players

    // Layer 2: Dim board except target (guided mode only)
    if (isGuided && guidedStep?.dimExcept) {
      ALL_SQUARES.forEach(sq => {
        if (!guidedStep.dimExcept!.includes(sq)) {
          styles[sq] = {
            ...styles[sq],
            boxShadow: 'inset 0 0 0 100px rgba(0,0,0,0.45)',
          };
        }
      });
    }

    // Layer 3: Selected piece + legal move indicators
    if (selectedSquare && game) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(100, 200, 255, 0.6)',
      };

      const currentSelectionSquares: Square[] = [selectedSquare];
      const moves = game.moves({ square: selectedSquare, verbose: true });
      for (const move of moves) {
        const targetSq = move.to as Square;

        // Don't override green checkmate highlight
        if (hintShown && targetSq === activePuzzle.checkmateSquare) continue;
        if (isGuided && guidedStep?.id === 'tap-mate' && targetSq === activePuzzle.checkmateSquare) continue;
        if (isSemiGuided && semiPhase === 'show-hint' && targetSq === activePuzzle.checkmateSquare) continue;

        styles[targetSq] = {
          ...styles[targetSq],
          backgroundImage: move.captured
            ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
            : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
        };
        currentSelectionSquares.push(targetSq);
      }
      // Track current selection squares so we can clear them when deselected
      prevSelectionSquaresRef.current = currentSelectionSquares;
    } else {
      // Explicitly clear previous selection squares so react-chessboard removes cached styles
      for (const sq of prevSelectionSquaresRef.current) {
        if (!styles[sq]) {
          styles[sq] = {};
        }
      }
      prevSelectionSquaresRef.current = [];
    }

    // Layer 4: Guided spotlight highlights (puzzle 1)
    if (isGuided && guidedStep?.highlightSquares && !guidedStep.useIntroPopup) {
      guidedStep.highlightSquares.forEach(sq => {
        styles[sq] = {
          backgroundColor: 'rgba(88, 204, 2, 0.45)',
          boxShadow: 'inset 0 0 0 3px #58CC02, 0 0 18px rgba(88, 204, 2, 0.7)',
        };
      });
    }

    // Layer 4b: Semi-guided queen highlight (puzzles 2-3)
    if (isSemiGuided && semiPhase === 'tap-piece') {
      styles[activePuzzle.pieceSquare] = {
        backgroundColor: 'rgba(88, 204, 2, 0.45)',
        boxShadow: 'inset 0 0 0 3px #58CC02, 0 0 18px rgba(88, 204, 2, 0.7)',
      };
    }

    // Layer 5: Hint highlight (wrong attempt OR semi-guided timer expiry)
    if (hintShown || (isSemiGuided && semiPhase === 'show-hint')) {
      styles[activePuzzle.checkmateSquare] = {
        backgroundColor: 'rgba(88, 204, 2, 0.45)',
        boxShadow: 'inset 0 0 0 3px #58CC02, 0 0 18px rgba(88, 204, 2, 0.7)',
      };
    }

    // Layer 6: Checkmate explanation highlights (red = attacked, yellow = blocked by friendly)
    if (game && game.isCheckmate()) {
      const kingColor = game.turn(); // The side in checkmate is the one whose turn it is
      const highlights = getCheckmateSquareHighlights(game, kingColor);
      const allHighlightSquares = [...highlights.attackedSquares, ...highlights.blockedByFriendlySquares];

      if (showCheckmateHighlights) {
        highlights.attackedSquares.forEach(sq => {
          styles[sq] = {
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            boxShadow: 'inset 0 0 0 3px rgba(255, 0, 0, 0.8), 0 0 12px rgba(255, 0, 0, 0.4)',
          };
        });

        highlights.blockedByFriendlySquares.forEach(sq => {
          styles[sq] = {
            backgroundColor: 'rgba(255, 255, 0, 0.5)',
            boxShadow: 'inset 0 0 0 3px rgba(255, 200, 0, 0.8), 0 0 12px rgba(255, 255, 0, 0.4)',
          };
        });
      } else {
        // Explicitly clear highlight squares so react-chessboard removes cached styles
        allHighlightSquares.forEach(sq => {
          styles[sq] = {};
        });
      }
    }

    return styles;
  }, [guidedStep, activePuzzle, selectedSquare, game, isSetupDone, hintShown, isGuided, isSemiGuided, semiPhase, puzzleComplete, showCheckmateHighlights]);

  // ─── Is board interactive right now? ───
  const boardInteractive = useMemo(() => {
    if (!isSetupDone) return false;
    if (puzzleComplete) return false;

    if (isGuided) {
      return guidedStep?.boardInteractive ?? false;
    }

    return true; // semi-guided + free play always interactive after setup
  }, [isSetupDone, puzzleComplete, isGuided, guidedStep, freePlayIntro]);

  // ─── Click handler routing ───
  const onSquareClick = isGuided
    ? handleGuidedSquareClick
    : isSemiGuided
      ? handleSemiGuidedClick
      : handleFreeSquareClick;

  // ─── Bottom hint card ───
  const bottomHintCard = useMemo(() => {
    // Free play intro (puzzles 4-6): Rookie message before play starts
    if (freePlayIntro && !puzzleComplete) {
      return { message: freePlayIntro, showRookie: true };
    }

    // Guided (puzzle 1): show step message
    if (isGuided && guidedStep && !guidedStep.useIntroPopup && !puzzleComplete) {
      return { message: guidedStep.message };
    }

    // Semi-guided (puzzles 2-3): phase-based messages
    if (isSemiGuided && !puzzleComplete && isSetupDone) {
      if (semiPhase === 'tap-piece') {
        return puzzleIndex === 2
          ? { message: `Now you're on your own! Tap the ${config.pieceName} and find checkmate!` }
          : { message: `Tap the ${config.pieceName} again!` };
      }
      if (semiPhase === 'find-mate') return { message: 'Can you find the checkmate?' };
      if (semiPhase === 'show-hint') return { message: 'Tap here!' };
    }

    // Wrong attempt feedback (semi-guided + free play)
    if (!isGuided && hintShown && !puzzleComplete) {
      return { message: "That's not checkmate. The green square shows you where!" };
    }

    return null;
  }, [isGuided, isSemiGuided, guidedStep, semiPhase, puzzleComplete, hintShown, isSetupDone, puzzleIndex, config, freePlayIntro]);

  // ─── Blue arrow showing the checkmate move ───
  const boardArrows = useMemo(() => {
    // Puzzle 1: show arrow immediately on tap-mate step
    if (isGuided && guidedStep?.id === 'tap-mate') {
      return [{ startSquare: activePuzzle.pieceSquare, endSquare: activePuzzle.checkmateSquare, color: 'rgba(28, 176, 246, 0.85)' }];
    }
    // Puzzles 2-3: show arrow when hint timer expires
    if (isSemiGuided && semiPhase === 'show-hint') {
      return [{ startSquare: activePuzzle.pieceSquare, endSquare: activePuzzle.checkmateSquare, color: 'rgba(28, 176, 246, 0.85)' }];
    }
    return [];
  }, [isGuided, isSemiGuided, guidedStep, semiPhase, activePuzzle]);

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════

  // ─── Main tutorial view ───
  return (
    <div className="h-full bg-chess-page text-chess-text flex flex-col overflow-hidden">
      <style>{progressBarStyles}</style>

      {/* Header — matches real lesson page */}
      <div className="bg-chess-page border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AnimatedLogo theme="light" size={0.28} iconOnly autoPlay={false} />
            <button
              onClick={() => {
                TutorialEvents.tutorialSkipped(config.analyticsKey, `puzzle_${puzzleIndex + 1}`, puzzleIndex);
                router.push('/');
              }}
              className="text-chess-text-faint hover:text-chess-text-muted"
            >
              ✕
            </button>
          </div>

          {/* Real ChessProgressBar component */}
          <div className="flex-1 mx-4 ml-3">
            <ChessProgressBar
              current={completedCount}
              total={allPuzzles.length}
              streak={streak}
              hadWrongAnswer={hadWrongAnswer}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-1 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Lesson name + Turn indicator */}
          <div className="flex items-center justify-between mb-2 h-8">
            <h1 className="text-base font-semibold text-chess-text">
              {config.lessonDisplayName}
            </h1>
            <span className="text-base font-bold text-chess-text">
              {activePuzzle.playerColor === 'white' ? 'White' : 'Black'} to move
            </span>
          </div>

          {/* Chessboard with overlays */}
          <div className="relative">
            <div
              className={shakeBoard ? 'tut-shake' : ''}
              style={{
                opacity: isBoardTransitioning ? 0 : 1,
                transition: 'opacity 150ms ease-in-out',
              }}
            >
              <ChessPathBoard
                options={{
                  position: currentFen,
                  boardOrientation: activePuzzle.playerColor,
                  onSquareClick: boardInteractive ? onSquareClick : undefined,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPieceDrop: (boardInteractive && !isGuided && !isSemiGuided) ? handleFreePieceDrop as any : undefined,
                  allowDragging: boardInteractive && !isGuided && !isSemiGuided,
                  arrows: boardArrows,
                  squareStyles,
                  animationDurationInMs: animationDuration,
                  draggingPieceGhostStyle: { opacity: 1 },
                  boardStyle: {
                    borderRadius: '8px 8px 0 0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  },
                  darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
                  lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
                }}
              />
            </div>

            {/* Welcome overlay (puzzle 1 only) */}
            {isGuided && guidedStep?.useIntroPopup && (
              <IntroPopup
                title={guidedStep.title || ''}
                message={guidedStep.message}
                showRookie
                onStart={() => {
                  warmupAudio();
                  setGuidedStepIndex(prev => prev + 1);
                }}
                buttonText={guidedStep.buttonText}
                onSkip={() => {
                  TutorialEvents.tutorialSkipped(config.analyticsKey, `puzzle_${puzzleIndex + 1}`, puzzleIndex);
                  router.push(config.skipUrl);
                }}
                skipText="Skip Tutorial"
              />
            )}
          </div>

          {/* PuzzleResultPopup — correct answer (matches real lesson page) */}
          {puzzleComplete && (
            <PuzzleResultPopup
              key={`correct-${completedCount}`}
              type="correct"
              message={completionMessages[puzzleIndex] || 'Checkmate!'}
              onContinue={nextPuzzle}
              rookAnimationStyle="lightning"
              rookProgressRef={rookProgressRef}
              rookCurrentStage={completedCount - 1}
              isCheckmate={game?.isCheckmate()}
              onShowCheckmateExplain={(show) => setShowCheckmateHighlights(show)}
              checkmateExplainActive={showCheckmateHighlights}
              showRookie
            />
          )}

          {/* Bottom hint card — green message bar */}
          {bottomHintCard && !puzzleComplete && (
            <div
              key={`hint-${puzzleIndex}-${guidedStep?.id || semiPhase || freePlayIntro || 'play'}-${wrongAttempts}`}
              className="w-full rounded-b-2xl py-2.5 px-4"
              style={{
                animation: 'tutSlideUp 0.3s ease-out',
                backgroundColor: 'var(--color-chess-green)',
                boxShadow: '0 4px 0 var(--color-chess-green-dark), 0 2px 8px rgba(88, 204, 2, 0.3)',
              }}
            >
              <div className="max-w-lg mx-auto flex items-center gap-2.5">
                <div className="flex-shrink-0">
                  <BreathingRook size="xs" animate />
                </div>
                <p className="font-bold text-white leading-snug" style={{ fontSize: 15 }}>
                  {bottomHintCard.message}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes tutSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tut-shake {
          animation: tutShake 0.4s ease-in-out;
        }
        @keyframes tutShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
