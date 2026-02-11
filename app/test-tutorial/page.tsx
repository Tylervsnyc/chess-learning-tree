'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
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
import { BOARD_COLORS } from '@/lib/puzzle-utils';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup';
import { IntroPopup } from '@/components/puzzle/IntroPopup';
import { useAudioWarmup } from '@/hooks/useAudioWarmup';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import {
  RookProgressAnimationRef,
  ANIMATION_STYLES,
  AnimationStyle,
} from '@/components/lesson/RookProgressAnimation';
import {
  RookWrongAnimationRef,
  WRONG_ANIMATION_STYLES,
  WrongAnimationStyle,
} from '@/components/lesson/RookWrongAnimation';

// ═══════════════════════════════════════════
// FIXED TUTORIAL PUZZLES (6 total)
// ═══════════════════════════════════════════

interface TutorialPuzzle {
  fen: string;
  puzzleFen: string;
  setupFrom: Square;
  setupTo: Square;
  queenSquare: Square;
  checkmateSquare: Square;
  playerColor: 'white' | 'black';
  description: string;
}

// P1: Qd4→g7 mate (rating 566) — FULLY GUIDED
// Queen swoops from center to g7, king trapped by own f7/h7 pawns.
const PUZZLE_1: TutorialPuzzle = {
  fen: '4r1k1/pp3ppp/2p5/P2p1q2/1P1Q4/2P2P2/7P/2K3R1 b - - 3 28',
  puzzleFen: '4r1k1/1p3ppp/p1p5/P2p1q2/1P1Q4/2P2P2/7P/2K3R1 w - - 0 29',
  setupFrom: 'a7' as Square,
  setupTo: 'a6' as Square,
  queenSquare: 'd4' as Square,
  checkmateSquare: 'g7' as Square,
  playerColor: 'white',
  description: 'Queen swoops to g7, king trapped by its own pawns',
};

// P2: Qd7→d1 back rank (28 pieces, rating 407) — SEMI-GUIDED
// Black queen infiltrates to the back rank while white's pieces are misplaced.
const PUZZLE_2: TutorialPuzzle = {
  fen: 'r3k1nr/pppq1ppp/2n1p3/1B2P3/Q3P1b1/8/PP1N1PPP/R1B1K2R w KQkq - 1 12',
  puzzleFen: 'r3k1nr/pppq1ppp/2n1p3/1B2P3/Q3P1b1/1N6/PP3PPP/R1B1K2R b KQkq - 2 12',
  setupFrom: 'd2' as Square,
  setupTo: 'b3' as Square,
  queenSquare: 'd7' as Square,
  checkmateSquare: 'd1' as Square,
  playerColor: 'black',
  description: 'Black queen infiltrates the back rank',
};

// P3: Qd7→h3 mate (rating 530) — LIGHT TIP
// Queen + bishop cooperation — bishop on h2 traps king, queen delivers on h3.
const PUZZLE_3: TutorialPuzzle = {
  fen: 'r5k1/pp1q1p1p/6p1/2p4r/8/3P1QP1/PPP2PKb/R1B2R2 w - - 3 21',
  puzzleFen: 'r5k1/pp1q1p1p/6p1/2p4r/8/3P1QP1/PPP2PKb/R1B4R b - - 4 21',
  setupFrom: 'f1' as Square,
  setupTo: 'h1' as Square,
  queenSquare: 'd7' as Square,
  checkmateSquare: 'h3' as Square,
  playerColor: 'black',
  description: 'Queen and bishop team up to trap the king',
};

// P4: Qh5→g6 mate (rating 471) — MINIMAL HINT
// Distance mate — queen lands on g6, bishop on d3 covers diagonal, king stuck on e8.
const PUZZLE_4: TutorialPuzzle = {
  fen: 'rn1qkbnr/1bppp1p1/p6p/1p2p2Q/3PP3/3B4/PPP2PPP/RNB2RK1 b kq - 1 7',
  puzzleFen: 'rn1qkbnr/1bppp3/p5pp/1p2p2Q/3PP3/3B4/PPP2PPP/RNB2RK1 w kq - 0 8',
  setupFrom: 'g7' as Square,
  setupTo: 'g6' as Square,
  queenSquare: 'h5' as Square,
  checkmateSquare: 'g6' as Square,
  playerColor: 'white',
  description: 'Queen lands on g6 — bishop covers the diagonal',
};

// P5: Qd6→h2 mate (26 pieces, rating 500) — NO HELP
// Black queen finds the h2 weakness with white's king exposed.
const PUZZLE_5: TutorialPuzzle = {
  fen: '1r2k2r/ppb2ppp/2pq1n2/P2p4/3P4/4P2P/1PQBNPP1/R4RK1 w k - 4 17',
  puzzleFen: '1r2k2r/ppb2ppp/2pq1n2/P2p4/1P1P4/4P2P/2QBNPP1/R4RK1 b k - 0 17',
  setupFrom: 'b2' as Square,
  setupTo: 'b4' as Square,
  queenSquare: 'd6' as Square,
  checkmateSquare: 'h2' as Square,
  playerColor: 'black',
  description: 'Black queen finds h2 checkmate',
};

// P6: Qg2→g3 mate (rating 562) — NO HELP
// Endgame — queen takes rook on g3, knight on e2 covers escape squares, king trapped on g4.
const PUZZLE_6: TutorialPuzzle = {
  fen: '8/p3Q2p/6pk/8/P1Pp2KP/5R2/2P1n1q1/8 w - - 0 44',
  puzzleFen: '8/p3Q2p/6pk/8/P1Pp2KP/6R1/2P1n1q1/8 b - - 1 44',
  setupFrom: 'f3' as Square,
  setupTo: 'g3' as Square,
  queenSquare: 'g2' as Square,
  checkmateSquare: 'g3' as Square,
  playerColor: 'black',
  description: 'Queen takes the rook — king has nowhere to go',
};

const ALL_PUZZLES: TutorialPuzzle[] = [PUZZLE_1, PUZZLE_2, PUZZLE_3, PUZZLE_4, PUZZLE_5, PUZZLE_6];

// All 64 squares for dimming
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
const ALL_SQUARES: Square[] = FILES.flatMap(f =>
  RANKS.map(r => `${f}${r}` as Square)
);

// ═══════════════════════════════════════════
// SCAFFOLDING LEVELS
// ═══════════════════════════════════════════

type ScaffoldLevel = 0 | 1 | 2 | 3 | 4 | 5;

function getScaffoldLevel(puzzleIndex: number): ScaffoldLevel {
  return Math.min(puzzleIndex, 5) as ScaffoldLevel;
}

// ═══════════════════════════════════════════
// GUIDED TUTORIAL STEPS (Puzzle 1 only)
// ═══════════════════════════════════════════

type GuidedStepId =
  | 'welcome'
  | 'last-move'
  | 'your-turn'
  | 'goal'
  | 'tap-queen'
  | 'see-moves'
  | 'find-mate'
  | 'checkmate';

interface GuidedStep {
  id: GuidedStepId;
  title?: string;
  message: string;
  buttonText?: string;
  useIntroPopup: boolean;
  boardInteractive: boolean;
  dimExcept?: Square[];
  highlightSquares?: Square[];
  autoAdvance?: number;
}

const GUIDED_STEPS: GuidedStep[] = [
  {
    id: 'welcome',
    title: 'Your First Puzzle',
    message: 'Find the best move and play it!',
    buttonText: 'Got It',
    useIntroPopup: true,
    boardInteractive: false,
  },
  {
    id: 'last-move',
    title: 'Yellow Squares',
    message: "These show your opponent's last move.",
    buttonText: 'Got It',
    useIntroPopup: false,
    boardInteractive: false,
    highlightSquares: ['a7', 'a6'] as Square[],
  },
  {
    id: 'your-turn',
    title: 'Your Turn',
    message: '"White to move" means you\'re White!',
    buttonText: 'Got It',
    useIntroPopup: false,
    boardInteractive: false,
  },
  {
    id: 'goal',
    title: 'Find Checkmate',
    message: 'Trap the king with your queen!',
    buttonText: "Let's Do It",
    useIntroPopup: false,
    boardInteractive: false,
  },
  {
    id: 'tap-queen',
    message: 'Tap the white queen.',
    useIntroPopup: false,
    boardInteractive: true,
    dimExcept: ['d4'] as Square[],
    highlightSquares: ['d4'] as Square[],
  },
  {
    id: 'see-moves',
    message: 'One of these circles is checkmate!',
    useIntroPopup: false,
    boardInteractive: false,
    autoAdvance: 3500,
  },
  {
    id: 'find-mate',
    message: 'Tap the checkmate square!',
    useIntroPopup: false,
    boardInteractive: true,
    highlightSquares: ['g7'] as Square[],
  },
  {
    id: 'checkmate',
    title: 'Checkmate!',
    message: 'The king had no escape!',
    buttonText: 'Next Puzzle',
    useIntroPopup: false,
    boardInteractive: false,
  },
];

// ═══════════════════════════════════════════
// TIP MESSAGES PER SCAFFOLD LEVEL
// ═══════════════════════════════════════════

function getTipForLevel(level: ScaffoldLevel, puzzle: TutorialPuzzle): { title: string; message: string; buttonText?: string } | null {
  switch (level) {
    case 0: return null;
    case 1: return {
      title: 'Your Turn!',
      message: 'Find the queen checkmate!',
      buttonText: "Let's Go",
    };
    case 2: return {
      title: 'Teamwork',
      message: "Look for pieces already cutting off the king's escape!",
      buttonText: 'Got It',
    };
    case 3: return {
      title: 'Long Range',
      message: 'The queen can strike from a distance. Crash through!',
      buttonText: 'Find It',
    };
    case 4: return null;
    case 5: return null;
  }
}

// Completion messages per puzzle
const COMPLETION_MESSAGES = [
  'Sealed by its own pawns!',
  'Back rank mate!',
  'Queen and bishop teamwork!',
  'No escape!',
  'Beautiful mate!',
  "Six for six! Let's go!",
];

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

interface TutorialFlowProps {
  onComplete?: (correctCount: number, wrongCount: number) => void;
}

export function TutorialFlow({ onComplete }: TutorialFlowProps) {
  const router = useRouter();
  useAudioWarmup();

  // Puzzle state
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [currentFen, setCurrentFen] = useState<string>(ALL_PUZZLES[0].fen);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [isSetupDone, setIsSetupDone] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hintShown, setHintShown] = useState(false);
  const [shakeBoard, setShakeBoard] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [isBoardTransitioning, setIsBoardTransitioning] = useState(false);

  // Progress tracking
  const [streak, setStreak] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [hadWrongAnswer, setHadWrongAnswer] = useState(false);

  // Guards against double-firing (state updates batch, so boolean state can't prevent same-cycle duplicates)
  const solvedRef = React.useRef(false);
  const advancingRef = React.useRef(false);

  // Rook animation state
  const correctAnimStyles = Object.keys(ANIMATION_STYLES) as AnimationStyle[];
  const wrongAnimStyles = Object.keys(WRONG_ANIMATION_STYLES) as WrongAnimationStyle[];
  const [lessonAnimIndex] = useState(() => Math.floor(Math.random() * correctAnimStyles.length));
  const [wrongAnimCount, setWrongAnimCount] = useState(0);
  const rookCorrectStyle = correctAnimStyles[lessonAnimIndex % correctAnimStyles.length];
  const rookWrongStyle = wrongAnimStyles[wrongAnimCount % wrongAnimStyles.length];
  const rookProgressRef = useRef<RookProgressAnimationRef>(null);
  const rookWrongRef = useRef<RookWrongAnimationRef>(null);

  // Guided tutorial state (puzzle 1 only)
  const [guidedStepIndex, setGuidedStepIndex] = useState(-1);
  const guidedStep = guidedStepIndex >= 0 && guidedStepIndex < GUIDED_STEPS.length
    ? GUIDED_STEPS[guidedStepIndex]
    : null;

  const activePuzzle = ALL_PUZZLES[puzzleIndex];
  const scaffoldLevel = getScaffoldLevel(puzzleIndex);

  // Chess game instance
  const game = useMemo(() => {
    try {
      return new Chess(currentFen);
    } catch {
      return null;
    }
  }, [currentFen]);

  // Tip card for current level (computed once)
  const tipForCurrentLevel = useMemo(() => {
    if (!showTip || scaffoldLevel === 0) return null;
    return getTipForLevel(scaffoldLevel, activePuzzle);
  }, [showTip, scaffoldLevel, activePuzzle]);

  // ─── Setup animation (runs on mount and puzzle change) ───
  useEffect(() => {
    const puzzle = ALL_PUZZLES[puzzleIndex];
    setSelectedSquare(null);
    setWrongAttempts(0);
    setHintShown(false);
    setPuzzleComplete(false);
    setIsSetupDone(false);
    setShowTip(false);
    solvedRef.current = false;
    advancingRef.current = false;

    // Always reset guided step index — leftover values from puzzle 1
    // could interact unexpectedly even though guided logic is gated
    // on scaffoldLevel === 0.
    setGuidedStepIndex(-1);

    // Snap to pre-move position
    setAnimationDuration(0);
    setCurrentFen(puzzle.fen);

    const t1 = setTimeout(() => {
      // Animate the setup move
      setAnimationDuration(300);
      setCurrentFen(puzzle.puzzleFen);

      const t2 = setTimeout(() => {
        setIsSetupDone(true);

        if (scaffoldLevel === 0) {
          setGuidedStepIndex(0);
        } else {
          const tip = getTipForLevel(scaffoldLevel, puzzle);
          if (tip) {
            setShowTip(true);
          }
        }
      }, 450);

      return () => clearTimeout(t2);
    }, 400);

    return () => clearTimeout(t1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzleIndex]);

  // ─── Auto-advance for timed guided steps ───
  useEffect(() => {
    if (guidedStep?.autoAdvance) {
      const timer = setTimeout(() => {
        setGuidedStepIndex(prev => prev + 1);
      }, guidedStep.autoAdvance);
      return () => clearTimeout(timer);
    }
  }, [guidedStep]);

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
    if (puzzleIndex >= ALL_PUZZLES.length - 1) {
      if (onComplete) {
        const wrong = ALL_PUZZLES.length - completedCount;
        onComplete(completedCount, wrong);
        return;
      }
      setAllDone(true);
      return;
    }

    setIsBoardTransitioning(true);
    setTimeout(() => {
      setPuzzleIndex(prev => prev + 1);
      setTimeout(() => setIsBoardTransitioning(false), 50);
    }, 150);
  }, [puzzleIndex, onComplete, completedCount]);

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
        setWrongAnimCount(prev => prev + 1);
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
  }, [game, selectedSquare, tryFreeMove, puzzleComplete]);

  // ─── Free play drag handler ───
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFreePieceDrop = useCallback((args: any) => {
    return tryFreeMove(args.sourceSquare as Square, args.targetSquare as Square);
  }, [tryFreeMove]);

  // ─── Guided step square click (puzzle 1 only) ───
  const handleGuidedSquareClick = useCallback(({ square }: { piece: unknown; square: string }) => {
    if (!game || !guidedStep?.boardInteractive || solvedRef.current) return;
    const sq = square as Square;

    if (guidedStep.id === 'tap-queen') {
      if (sq === activePuzzle.queenSquare) {
        setSelectedSquare(sq);
        playMoveSound();
        setTimeout(() => setGuidedStepIndex(prev => prev + 1), 350);
      }
      return;
    }

    if (guidedStep.id === 'find-mate') {
      // Select the queen first
      if (sq === activePuzzle.queenSquare) {
        setSelectedSquare(sq);
        return;
      }

      if (!selectedSquare) return;

      if (sq === activePuzzle.checkmateSquare) {
        // Correct!
        solvedRef.current = true; // prevent duplicate fires
        try {
          const gameCopy = new Chess(currentFen);
          gameCopy.move({ from: selectedSquare, to: sq, promotion: 'q' });
          setCurrentFen(gameCopy.fen());
          setSelectedSquare(null);
          playCorrectSound(0);
          vibrateOnCorrect();
          setCompletedCount(c => c + 1);
          setStreak(s => s + 1);
          setPuzzleComplete(true);
        } catch {
          playErrorSound();
        }
      } else {
        // Wrong square — check if it was at least a legal move
        const legalMoves = game.moves({ square: selectedSquare, verbose: true });
        if (legalMoves.some(m => m.to === sq)) {
          // Legal but wrong — show answer after 1 mistake
          playErrorSound();
          vibrateOnError();
          triggerShake();
          setHintShown(true);
        }
      }
      return;
    }
  }, [game, guidedStep, activePuzzle, selectedSquare, currentFen, triggerShake]);

  // ─── Square highlight styles ───
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Layer 1: Yellow last-move highlights
    const isOverlay = scaffoldLevel === 0 ? (guidedStep?.useIntroPopup || false) : false;
    if (!isOverlay && isSetupDone && !puzzleComplete) {
      styles[activePuzzle.setupFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
      styles[activePuzzle.setupTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
    }

    // Layer 2: Dim board except target (guided mode only)
    if (scaffoldLevel === 0 && guidedStep?.dimExcept) {
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

      const moves = game.moves({ square: selectedSquare, verbose: true });
      for (const move of moves) {
        const targetSq = move.to as Square;

        // Don't override green checkmate highlight
        if (hintShown && targetSq === activePuzzle.checkmateSquare) continue;
        if (scaffoldLevel === 0 && guidedStep?.id === 'find-mate' && targetSq === activePuzzle.checkmateSquare) continue;

        styles[targetSq] = {
          ...styles[targetSq],
          background: move.captured
            ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
            : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
        };
      }
    }

    // Layer 4: Tutorial spotlight highlights (guided mode)
    if (scaffoldLevel === 0 && guidedStep?.highlightSquares && !guidedStep.useIntroPopup) {
      guidedStep.highlightSquares.forEach(sq => {
        const isYellowHighlight = guidedStep.id === 'last-move';
        styles[sq] = {
          backgroundColor: isYellowHighlight
            ? 'rgba(255, 170, 0, 0.6)'
            : 'rgba(88, 204, 2, 0.45)',
          boxShadow: isYellowHighlight
            ? 'inset 0 0 0 3px rgba(255, 170, 0, 0.9), 0 0 14px rgba(255, 170, 0, 0.6)'
            : 'inset 0 0 0 3px #58CC02, 0 0 18px rgba(88, 204, 2, 0.7)',
        };
      });
    }

    // Layer 5: Hint highlight after wrong attempt
    if (hintShown) {
      styles[activePuzzle.checkmateSquare] = {
        backgroundColor: 'rgba(88, 204, 2, 0.45)',
        boxShadow: 'inset 0 0 0 3px #58CC02, 0 0 18px rgba(88, 204, 2, 0.7)',
      };
    }

    return styles;
  }, [guidedStep, activePuzzle, selectedSquare, game, isSetupDone, hintShown, scaffoldLevel, puzzleComplete]);

  // ─── Is board interactive right now? ───
  const boardInteractive = useMemo(() => {
    if (!isSetupDone) return false;
    if (puzzleComplete) return false;
    if (showTip) return false;

    if (scaffoldLevel === 0) {
      return guidedStep?.boardInteractive ?? false;
    }

    return true;
  }, [isSetupDone, puzzleComplete, showTip, scaffoldLevel, guidedStep]);

  // ─── Click handler based on scaffold level ───
  const onSquareClick = scaffoldLevel === 0 ? handleGuidedSquareClick : handleFreeSquareClick;

  // ─── Highlight callout flags ───
  const highlightGoal = scaffoldLevel === 0 && guidedStep?.id === 'goal';
  const highlightTurn = scaffoldLevel === 0 && guidedStep?.id === 'your-turn';

  // ─── Bottom hint card for guided steps and wrong feedback ───
  const bottomHintCard = useMemo(() => {
    // During guided mode: show card for non-overlay, non-checkmate steps
    if (scaffoldLevel === 0 && guidedStep && !guidedStep.useIntroPopup && !puzzleComplete) {
      return {
        title: guidedStep.title,
        message: guidedStep.message,
        buttonText: guidedStep.buttonText,
        onButton: () => {
          warmupAudio();
          if (guidedStep.id === 'checkmate') {
            nextPuzzle();
          } else {
            setGuidedStepIndex(prev => prev + 1);
          }
        },
      };
    }

    // During free play: wrong attempt feedback
    if (scaffoldLevel > 0 && hintShown && !puzzleComplete) {
      return {
        message: "That's not checkmate. The green square shows you where to go!",
      };
    }

    // During free play: status text (levels 1-3)
    if (scaffoldLevel >= 1 && scaffoldLevel <= 3 && !showTip && !puzzleComplete && !hintShown && isSetupDone) {
      const msgs: Record<number, string> = {
        1: 'Find the checkmate! Use your queen to trap the king.',
        2: 'The f7 pawn is barely defended. Can your queen get there?',
        3: 'The king is stuck on the edge. Where does your queen strike?',
      };
      if (msgs[scaffoldLevel]) {
        return { message: msgs[scaffoldLevel] };
      }
    }

    return null;
  }, [scaffoldLevel, guidedStep, puzzleComplete, hintShown, showTip, isSetupDone, nextPuzzle]);

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════

  // ─── Done screen ───
  if (allDone) {
    return (
      <div className="h-full bg-chess-page text-chess-text flex flex-col items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="text-6xl mb-5">🎉</div>
          <h1 className="text-2xl font-bold mb-3">Tutorial Complete!</h1>
          <p className="text-chess-text-muted mb-3 leading-relaxed">
            Six checkmates! You nailed every single one.
          </p>
          <p className="text-chess-text-faint text-sm mb-8 leading-relaxed">
            In the real app, these 6 puzzles replace the first lesson. After this, puzzles come from the full library — no more hand-holding.
          </p>
          <button
            onClick={() => {
              setAllDone(false);
              setPuzzleIndex(0);
              setCompletedCount(0);
              setStreak(0);
              setHadWrongAnswer(false);
              solvedRef.current = false;
              advancingRef.current = false;
            }}
            className="w-full py-3 bg-chess-green text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_#46A302] transition-all mb-3"
          >
            Replay Tutorial
          </button>
          <button
            onClick={() => router.push('/learn')}
            className="w-full py-3 bg-white text-chess-text font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ← Back to Learn
          </button>
        </div>
      </div>
    );
  }

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
              onClick={() => router.push('/learn')}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Real ChessProgressBar component */}
          <div className="flex-1 mx-4 ml-3">
            <ChessProgressBar
              current={completedCount}
              total={ALL_PUZZLES.length}
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
            {/* Lesson name with highlight callout */}
            <div className="relative inline-flex items-center">
              {highlightGoal && (
                <div
                  className="absolute -inset-x-3 -inset-y-1.5 rounded-lg border-2 border-chess-green z-0"
                  style={{
                    backgroundColor: 'rgba(88, 204, 2, 0.12)',
                    animation: 'tutPulseGreen 1.5s ease-in-out infinite',
                  }}
                />
              )}
              <h1 className="relative z-10 text-base font-semibold text-chess-text">
                Queen Checkmate: Easy
              </h1>
            </div>

            {/* Turn indicator with highlight callout */}
            <div className="relative inline-flex items-center">
              {highlightTurn && (
                <div
                  className="absolute -inset-x-3 -inset-y-1.5 rounded-lg border-2 border-chess-blue z-0"
                  style={{
                    backgroundColor: 'rgba(28, 176, 246, 0.12)',
                    animation: 'tutPulseBlue 1.5s ease-in-out infinite',
                  }}
                />
              )}
              <span className="relative z-10 text-base font-bold text-chess-text">
                {activePuzzle.playerColor === 'white' ? 'White' : 'Black'} to move
              </span>
            </div>
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
              <Chessboard
                options={{
                  position: currentFen,
                  boardOrientation: activePuzzle.playerColor,
                  onSquareClick: boardInteractive ? onSquareClick : undefined,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPieceDrop: (boardInteractive && scaffoldLevel > 0) ? handleFreePieceDrop as any : undefined,
                  allowDragging: boardInteractive && scaffoldLevel > 0,
                  squareStyles,
                  animationDurationInMs: animationDuration,
                  boardStyle: {
                    borderRadius: '8px 8px 0 0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  },
                  darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
                  lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
                }}
              />
            </div>

            {/* IntroPopup: Welcome overlay (guided puzzle 1) */}
            {scaffoldLevel === 0 && guidedStep?.useIntroPopup && (
              <IntroPopup
                title={guidedStep.title || ''}
                message={guidedStep.message}
                onStart={() => {
                  warmupAudio();
                  setGuidedStepIndex(prev => prev + 1);
                }}
                buttonText={guidedStep.buttonText}
                onSkip={guidedStep.id === 'welcome' ? () => {
                  if (onComplete) {
                    onComplete(6, 0);
                  } else {
                    router.push('/learn');
                  }
                } : undefined}
                skipText={guidedStep.id === 'welcome' ? 'Skip Tutorial' : undefined}
              />
            )}

            {/* IntroPopup: Tip card overlay (puzzles 2-4) */}
            {tipForCurrentLevel && (
              <IntroPopup
                title={tipForCurrentLevel.title}
                message={tipForCurrentLevel.message}
                onStart={() => {
                  warmupAudio();
                  setShowTip(false);
                }}
                buttonText={tipForCurrentLevel.buttonText}
              />
            )}
          </div>

          {/* PuzzleResultPopup — correct answer (matches real lesson page) */}
          {puzzleComplete && (
            <PuzzleResultPopup
              key={`correct-${completedCount}`}
              type="correct"
              message={COMPLETION_MESSAGES[puzzleIndex] || 'Checkmate!'}
              onContinue={nextPuzzle}
              rookAnimationStyle={rookCorrectStyle}
              rookProgressRef={rookProgressRef}
              rookCurrentStage={completedCount - 1}
            />
          )}

          {/* Bottom hint card — guided steps + wrong attempt feedback */}
          {bottomHintCard && !puzzleComplete && (
            <div
              key={`hint-${puzzleIndex}-${guidedStep?.id || 'play'}-${wrongAttempts}`}
              className="w-full rounded-b-2xl py-2.5 px-4"
              style={{
                animation: 'tutSlideUp 0.3s ease-out',
                backgroundColor: '#FFF3CD',
                boxShadow: '0 2px 8px rgba(180, 140, 0, 0.15)',
              }}
            >
              <div className="max-w-lg mx-auto">
                {bottomHintCard.title && (
                  <p
                    className="font-bold leading-tight mb-1"
                    style={{ fontSize: 15, color: '#7A6200' }}
                  >
                    {bottomHintCard.title}
                  </p>
                )}

                <div className="space-y-1">
                  {bottomHintCard.message.split('\n\n').map((p, i) => (
                    <p key={i} className="leading-snug" style={{ fontSize: 14, color: '#8B7000' }}>
                      {p}
                    </p>
                  ))}
                </div>

                {bottomHintCard.buttonText && bottomHintCard.onButton && (
                  <button
                    onClick={bottomHintCard.onButton}
                    className="w-full mt-2 py-1.5 font-bold rounded-xl uppercase tracking-wide text-[13px] transition-all active:translate-y-[1px]"
                    style={{
                      backgroundColor: '#D4A017',
                      color: '#FFFFFF',
                      boxShadow: '0 3px 0 #A67C00',
                    }}
                  >
                    {bottomHintCard.buttonText}
                  </button>
                )}
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
        @keyframes tutPulseGreen {
          0%, 100% { box-shadow: 0 0 0 0 rgba(88, 204, 2, 0.3); }
          50% { box-shadow: 0 0 16px 6px rgba(88, 204, 2, 0.5); }
        }
        @keyframes tutPulseBlue {
          0%, 100% { box-shadow: 0 0 0 0 rgba(28, 176, 246, 0.3); }
          50% { box-shadow: 0 0 16px 6px rgba(28, 176, 246, 0.5); }
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

// Test page wrapper — keeps /test-tutorial working
export default function TestTutorialPage() {
  return <TutorialFlow />;
}
