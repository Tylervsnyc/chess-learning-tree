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
import { BOARD_COLORS } from '@/lib/puzzle-utils';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup';
import { IntroPopup } from '@/components/puzzle/IntroPopup';
import { useAudioWarmup } from '@/hooks/useAudioWarmup';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';

// ═══════════════════════════════════════════
// PROPS
// ═══════════════════════════════════════════

interface TutorialFlowProps {
  onComplete: (correctCount: number, wrongCount: number) => void;
  lessonId: string;
}

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

// P1: Qd3→h7 mate (26 pieces, rating 400) — FULLY GUIDED
// Classic h7 checkmate pattern. Knight on f3 + bishop on c2 support.
const PUZZLE_1: TutorialPuzzle = {
  fen: 'r1b2rk1/p3qpp1/3np2p/1p1p4/3P4/1PPQ1N2/P1B2PPP/R4RK1 b - - 1 18',
  puzzleFen: 'r1b2rk1/4qpp1/p2np2p/1p1p4/3P4/1PPQ1N2/P1B2PPP/R4RK1 w - - 0 19',
  setupFrom: 'a7' as Square,
  setupTo: 'a6' as Square,
  queenSquare: 'd3' as Square,
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
  queenSquare: 'd7' as Square,
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
  queenSquare: 'b3' as Square,
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
  queenSquare: 'g4' as Square,
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
  queenSquare: 'd6' as Square,
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
  queenSquare: 'f3' as Square,
  checkmateSquare: 'f7' as Square,
  playerColor: 'white',
  description: 'Queen strikes f7 in a crowded position',
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
    dimExcept: ['d3'] as Square[],
    highlightSquares: ['d3'] as Square[],
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
    highlightSquares: ['h7'] as Square[],
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
      title: 'f7 Weakness',
      message: 'The f7 pawn is barely guarded — strike!',
      buttonText: 'Got It',
    };
    case 3: return {
      title: 'Trapped King',
      message: 'The king is boxed in. Crash through!',
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
  'f7 weakness exploited!',
  'No escape!',
  'Beautiful mate!',
  "Six for six! Let's go!",
];

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

export function TutorialFlow({ onComplete, lessonId: _lessonId }: TutorialFlowProps) {
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
  const [isBoardTransitioning, setIsBoardTransitioning] = useState(false);

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
      // All puzzles done — call onComplete instead of showing done screen
      onComplete(completedCount, wrongCount);
      return;
    }

    setIsBoardTransitioning(true);
    setTimeout(() => {
      setPuzzleIndex(prev => prev + 1);
      setTimeout(() => setIsBoardTransitioning(false), 50);
    }, 150);
  }, [puzzleIndex, onComplete, completedCount, wrongCount]);

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

      const currentSelectionSquares: Square[] = [selectedSquare];
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
              <ChessPathBoard
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
                onSkip={guidedStep.id === 'welcome' ? () => router.push('/lesson/1.1.1?skipTutorial=true') : undefined}
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
