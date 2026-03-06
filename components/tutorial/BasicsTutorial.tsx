'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { Chess, Square } from 'chess.js';
import { BOARD_COLORS } from '@/lib/puzzle-utils';
import {
  playCorrectSound,
  playMoveSound,
  playCaptureSound,
  playErrorSound,
  playCelebrationSound,
  playButtonClick,
  vibrateOnCorrect,
  vibrateOnError,
} from '@/lib/sounds';
import confetti from 'canvas-confetti';
import { useAudioWarmup } from '@/hooks/useAudioWarmup';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { TutorialEvents } from '@/lib/analytics/posthog';

// ══════════════════════════════════════════════════
// TUTORIAL DATA
// ══════════════════════════════════════════════════

interface Exercise {
  type: 'tap' | 'move' | 'checkmate';
  fen: string;
  targetSquare: string;
  fromSquare?: string;
  instruction: string;
}

interface TutorialStep {
  id: string;
  title: string;
  introText: string;
  introFen: string;
  introPieceSquare?: string;
  exercises: Exercise[];
}

const STEPS: TutorialStep[] = [
  {
    id: 'rook',
    title: 'The Rook',
    introText: 'Moves in straight lines — up, down, left, right.\nAs far as it wants!',
    introFen: '8/8/1k6/8/3R4/8/8/7K w - - 0 1',
    introPieceSquare: 'd4',
    exercises: [
      { type: 'move', fen: '8/8/1k6/8/8/8/8/R6K w - - 0 1', fromSquare: 'a1', targetSquare: 'a8', instruction: 'Move the rook to the green square!' },
      { type: 'move', fen: '8/3p4/1k6/8/8/8/8/3R3K w - - 0 1', fromSquare: 'd1', targetSquare: 'd7', instruction: 'Capture the black pawn!' },
    ],
  },
  {
    id: 'bishop',
    title: 'The Bishop',
    introText: 'Moves diagonally — and stays on one color\nfor the entire game!',
    introFen: '8/8/1k6/8/3B4/8/8/7K w - - 0 1',
    introPieceSquare: 'd4',
    exercises: [
      { type: 'move', fen: '8/8/1k6/8/8/8/8/2B4K w - - 0 1', fromSquare: 'c1', targetSquare: 'h6', instruction: 'Move the bishop to the green square!' },
      { type: 'move', fen: '8/8/1k6/8/2p5/8/8/5B1K w - - 0 1', fromSquare: 'f1', targetSquare: 'c4', instruction: 'Capture the black pawn!' },
    ],
  },
  {
    id: 'queen',
    title: 'The Queen',
    introText: 'The most powerful piece!\nMoves like a rook AND bishop combined.',
    introFen: '8/8/1k6/8/3Q4/8/8/7K w - - 0 1',
    introPieceSquare: 'd4',
    exercises: [
      { type: 'move', fen: '8/8/1k6/8/8/8/8/Q6K w - - 0 1', fromSquare: 'a1', targetSquare: 'a8', instruction: 'Move the queen to the green square!' },
      { type: 'move', fen: '8/4p3/1k6/8/4Q3/8/8/7K w - - 0 1', fromSquare: 'e4', targetSquare: 'e7', instruction: 'Capture the black pawn!' },
    ],
  },
  {
    id: 'king',
    title: 'The King',
    introText: 'The most important piece!\nMoves one square in any direction.',
    introFen: '8/8/8/8/4K3/8/8/1k6 w - - 0 1',
    introPieceSquare: 'e4',
    exercises: [
      { type: 'move', fen: '8/8/1k6/8/8/8/8/4K3 w - - 0 1', fromSquare: 'e1', targetSquare: 'e2', instruction: 'Move the king one square forward!' },
      { type: 'move', fen: 'k7/8/8/8/3K4/8/8/8 w - - 0 1', fromSquare: 'd4', targetSquare: 'c5', instruction: 'Now move diagonally!' },
    ],
  },
  {
    id: 'pawn',
    title: 'The Pawn',
    introText: 'Moves forward one square (or two on its first move).\nCaptures diagonally!',
    introFen: '8/8/1k6/8/8/3p1p2/4P3/7K w - - 0 1',
    introPieceSquare: 'e2',
    exercises: [
      { type: 'move', fen: '8/8/1k6/8/8/8/4P3/7K w - - 0 1', fromSquare: 'e2', targetSquare: 'e4', instruction: 'Push the pawn two squares!' },
      { type: 'move', fen: '8/8/1k6/4p3/3P4/8/8/7K w - - 0 1', fromSquare: 'd4', targetSquare: 'e5', instruction: 'Capture diagonally!' },
    ],
  },
  {
    id: 'knight',
    title: 'The Knight',
    introText: "Moves in an L-shape — two squares one way,\nthen one square sideways. The only jumper!",
    introFen: '8/8/1k6/8/3N4/8/8/7K w - - 0 1',
    introPieceSquare: 'd4',
    exercises: [
      { type: 'move', fen: '8/8/1k6/8/8/8/8/1N5K w - - 0 1', fromSquare: 'b1', targetSquare: 'c3', instruction: 'Move the knight in an L-shape!' },
      { type: 'move', fen: '8/8/1k6/5p2/3N4/8/8/7K w - - 0 1', fromSquare: 'd4', targetSquare: 'f5', instruction: 'Capture with the knight!' },
    ],
  },
  {
    id: 'checkmate',
    title: 'Checkmate!',
    introText: "When the king is attacked and can't escape,\nthat's checkmate — you win the game!",
    introFen: '6k1/5ppp/8/8/8/8/8/3Q3K w - - 0 1',
    introPieceSquare: 'd1',
    exercises: [
      { type: 'checkmate', fen: '6k1/5ppp/8/8/8/8/8/3Q3K w - - 0 1', fromSquare: 'd1', targetSquare: 'd8', instruction: 'Deliver checkmate with the queen!' },
    ],
  },
];

// ══════════════════════════════════════════════════
// DONE SCREEN
// ══════════════════════════════════════════════════

function BasicsDoneScreen({ onContinue }: { onContinue: () => void }) {
  const [entered, setEntered] = useState(false);

  React.useEffect(() => {
    // Fire confetti from both sides
    confetti({
      particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.65 },
      colors: ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF', '#FFFFFF'],
      gravity: 1.2, ticks: 200,
    });
    confetti({
      particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.65 },
      colors: ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF', '#FFFFFF'],
      gravity: 1.2, ticks: 200,
    });
    playCelebrationSound();

    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="h-[100dvh] bg-chess-page text-chess-text flex flex-col items-center justify-center px-6">
      <div
        className="mb-6"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <BreathingRook size="xl" animation="celebrate" />
      </div>

      <h1
        className="text-2xl font-black mb-2 text-center"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
        }}
      >
        You&apos;re Ready!
      </h1>
      <p
        className="text-chess-text-muted text-sm text-center max-w-[280px] mb-10"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s',
        }}
      >
        You know how all the pieces move.
        <br />
        Time to start solving puzzles!
      </p>

      <button
        onClick={onContinue}
        className="w-full max-w-sm py-4 font-bold text-lg rounded-2xl text-white transition-all hover:brightness-105 active:translate-y-[2px] bg-chess-green"
        style={{
          boxShadow: '0 4px 0 var(--color-chess-green-dark)',
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
        }}
      >
        Start Learning
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════

export function BasicsTutorial() {
  const router = useRouter();
  useAudioWarmup();
  const trackedStartRef = useRef(false);

  // Track tutorial start once
  React.useEffect(() => {
    if (!trackedStartRef.current) {
      trackedStartRef.current = true;
      TutorialEvents.tutorialStarted('basics');
    }
  }, []);

  // State
  const [stepIndex, setStepIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentFen, setCurrentFen] = useState(STEPS[0].exercises[0].fen);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [tutorialDone, setTutorialDone] = useState(false);
  const [shakeBoard, setShakeBoard] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0); // 0 for transitions, 200 for user moves
  const [boardKey, setBoardKey] = useState(0); // increment to force-remount board (kills all animation)
  // Track completed exercises for sound progression
  const completedCountRef = useRef(0);

  // Track previously highlighted selection squares so we can explicitly clear them
  // (react-chessboard v5 caches square styles — omitting a style doesn't remove it)
  const prevSelectionSquaresRef = useRef<Square[]>([]);

  // Prevent double-fire during advance
  const advancingRef = useRef(false);

  const currentStep = STEPS[stepIndex];
  const currentExercise = exerciseIndex >= 0 ? currentStep.exercises[exerciseIndex] : null;

  // Chess game for current position
  const game = useMemo(() => {
    try {
      return new Chess(currentFen);
    } catch {
      return null;
    }
  }, [currentFen]);

  // ── Square highlight styles ──
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    if (currentExercise && !exerciseComplete) {
      // EXERCISE: highlight target square in neon green with breathing pulse
      styles[currentExercise.targetSquare] = {
        backgroundColor: 'rgba(0, 255, 100, 0.45)',
        boxShadow: 'inset 0 0 0 3px #00FF64, 0 0 20px rgba(0, 255, 100, 0.6), 0 0 40px rgba(0, 255, 100, 0.2)',
        animation: 'basicsTargetPulse 1.5s ease-in-out infinite',
      };

      // Pulse the piece they need to move (if not selected yet)
      if (currentExercise.fromSquare && currentExercise.type !== 'tap' && !selectedSquare) {
        styles[currentExercise.fromSquare] = {
          ...styles[currentExercise.fromSquare],
          boxShadow: 'inset 0 0 0 3px rgba(28, 176, 246, 0.7)',
          backgroundColor: 'rgba(28, 176, 246, 0.15)',
        };
      }

      // Selected piece + legal move indicators
      if (selectedSquare && game) {
        styles[selectedSquare] = {
          backgroundColor: 'rgba(100, 200, 255, 0.6)',
        };
        const currentSelectionSquares: Square[] = [selectedSquare];
        const moves = game.moves({ square: selectedSquare, verbose: true });
        for (const move of moves) {
          // Don't override the green target highlight
          if (move.to === currentExercise.targetSquare) continue;
          styles[move.to] = {
            ...styles[move.to],
            background: move.captured
              ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
              : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
          };
          currentSelectionSquares.push(move.to as Square);
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
    }

    // Success highlight
    if (exerciseComplete && currentExercise) {
      styles[currentExercise.targetSquare] = {
        backgroundColor: 'rgba(88, 204, 2, 0.7)',
        boxShadow: 'inset 0 0 0 3px #58CC02, 0 0 18px rgba(88, 204, 2, 0.6)',
      };
    }

    return styles;
  }, [exerciseIndex, currentStep, currentExercise, selectedSquare, game, exerciseComplete]);

  // ── Blue arrow from piece to target ──
  const boardArrows = useMemo(() => {
    if (!currentExercise || exerciseComplete) return [];
    if (currentExercise.type === 'tap' || !currentExercise.fromSquare) return [];
    return [{ startSquare: currentExercise.fromSquare, endSquare: currentExercise.targetSquare, color: 'rgba(28, 176, 246, 0.85)' }];
  }, [currentExercise, exerciseComplete]);

  // ── Advance to next exercise/step ──
  // Force-remount the board (boardKey++) so pieces snap — no sliding animation
  const advance = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;

    const step = STEPS[stepIndex];
    if (exerciseIndex < step.exercises.length - 1) {
      const nextIdx = exerciseIndex + 1;
      const nextEx = step.exercises[nextIdx];
      setExerciseIndex(nextIdx);
      setCurrentFen(nextEx.fen);
      setSelectedSquare(null);
      setExerciseComplete(false);
    } else if (stepIndex < STEPS.length - 1) {
      TutorialEvents.tutorialStepCompleted('basics', step.id, stepIndex);
      const nextStep = STEPS[stepIndex + 1];
      setStepIndex(stepIndex + 1);
      setExerciseIndex(0);
      setCurrentFen(nextStep.exercises[0].fen);
      setSelectedSquare(null);
      setExerciseComplete(false);
    } else {
      TutorialEvents.tutorialStepCompleted('basics', step.id, stepIndex);
      TutorialEvents.tutorialCompleted('basics');
      setTutorialDone(true);
    }

    setBoardKey(k => k + 1); // remount board = zero animation
    setAnimationDuration(0);
    setTimeout(() => { advancingRef.current = false; }, 100);
  }, [stepIndex, exerciseIndex]);

  // ── Handle exercise success ──
  const handleExerciseSuccess = useCallback(() => {
    if (exerciseComplete) return;
    setExerciseComplete(true);
    playCorrectSound(completedCountRef.current);
    vibrateOnCorrect();
    completedCountRef.current += 1;

    // Auto-advance after brief pause
    setTimeout(() => advance(), 900);
  }, [advance, exerciseComplete]);

  // ── Board shake ──
  const triggerShake = useCallback(() => {
    setShakeBoard(true);
    setTimeout(() => setShakeBoard(false), 400);
  }, []);

  // ── Handle square click ──
  const handleSquareClick = useCallback(({ square }: { piece: unknown; square: string }) => {
    if (!currentExercise || exerciseComplete) return;
    const sq = square as Square;

    // TAP exercise
    if (currentExercise.type === 'tap') {
      if (sq === currentExercise.targetSquare) {
        handleExerciseSuccess();
      }
      return;
    }

    // MOVE / CHECKMATE exercise
    if (!game) return;

    if (!selectedSquare) {
      const piece = game.get(sq);
      if (piece && piece.color === 'w') {
        setSelectedSquare(sq);
      }
      return;
    }

    if (selectedSquare === sq) {
      setSelectedSquare(null);
      return;
    }

    // Check if move is legal
    const legalMoves = game.moves({ square: selectedSquare, verbose: true });
    const isLegal = legalMoves.some(m => m.to === sq);

    if (!isLegal) {
      // Maybe selecting a different piece
      const piece = game.get(sq);
      if (piece && piece.color === 'w') {
        setSelectedSquare(sq);
      } else {
        setSelectedSquare(null);
      }
      return;
    }

    if (sq === currentExercise.targetSquare) {
      // Correct move — animate it!
      setAnimationDuration(200);
      try {
        const gameCopy = new Chess(currentFen);
        const move = gameCopy.move({ from: selectedSquare, to: sq, promotion: 'q' });
        if (move) {
          setCurrentFen(gameCopy.fen());
          setSelectedSquare(null);
          if (move.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
          handleExerciseSuccess();
        }
      } catch { /* ignore */ }
    } else {
      // Legal but wrong target
      playErrorSound();
      vibrateOnError();
      triggerShake();
      setSelectedSquare(null);
    }
  }, [game, currentExercise, currentFen, selectedSquare, exerciseComplete, handleExerciseSuccess, triggerShake]);

  // ── Handle piece drop (drag & drop) ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePieceDrop = useCallback((args: any) => {
    if (!currentExercise || exerciseComplete || currentExercise.type === 'tap') return false;
    if (!game) return false;

    const from = args.sourceSquare as Square;
    const to = args.targetSquare as Square;

    const legalMoves = game.moves({ square: from, verbose: true });
    const isLegal = legalMoves.some(m => m.to === to);
    if (!isLegal) return false;

    if (to === currentExercise.targetSquare) {
      setAnimationDuration(200); // Animate the correct move
      try {
        const gameCopy = new Chess(currentFen);
        const move = gameCopy.move({ from, to, promotion: 'q' });
        if (move) {
          setCurrentFen(gameCopy.fen());
          setSelectedSquare(null);
          if (move.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
          handleExerciseSuccess();
          return true;
        }
      } catch { /* ignore */ }
    }

    // Wrong target
    playErrorSound();
    vibrateOnError();
    triggerShake();
    return false;
  }, [game, currentExercise, currentFen, exerciseComplete, handleExerciseSuccess, triggerShake]);

  // ══════════════════════════════════════════════════
  // TUTORIAL DONE SCREEN
  // ══════════════════════════════════════════════════

  if (tutorialDone) {
    return <BasicsDoneScreen onContinue={() => {
      try { localStorage.setItem('chess_path_onboarded', 'true'); } catch {}
      router.push('/auth/signup?from=lesson');
    }} />;
  }

  // ══════════════════════════════════════════════════
  // MAIN TUTORIAL VIEW
  // ══════════════════════════════════════════════════

  const boardInteractive = !exerciseComplete;

  return (
    <div className="h-full bg-chess-page text-chess-text flex flex-col overflow-hidden">
      {/* No header — locked onboarding, no escape */}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Step title */}
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-chess-text">{currentStep.title}</h2>
          </div>

          {/* Board */}
          <div className={`relative ${shakeBoard ? 'basics-shake' : ''}`}>
            <ChessPathBoard
              key={boardKey}
              options={{
                position: currentFen,
                boardOrientation: 'white' as const,
                onSquareClick: boardInteractive ? handleSquareClick : undefined,
                onPieceDrop: boardInteractive ? handlePieceDrop : undefined,
                allowDragging: boardInteractive && currentExercise?.type !== 'tap',
                squareStyles,
                arrows: boardArrows,
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

            {/* No intro overlay — go straight to exercises */}
          </div>

          {/* Below board: instruction popup with Rookie */}
          {currentExercise ? (
            <div
              key={`ex-${stepIndex}-${exerciseIndex}`}
              className={`w-full rounded-b-2xl py-2.5 px-4 ${exerciseComplete ? 'bg-chess-correct-bg' : 'bg-chess-correct-bg'}`}
              style={{
                animation: exerciseComplete ? 'basicsSlideUpBounce 0.3s ease-out' : 'basicsSlideUp 0.3s ease-out',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <BreathingRook
                    size="sm"
                    animation={exerciseComplete
                      ? 'celebrate'
                      : (['breathe', 'think', 'breathe', 'think', 'breathe', 'think', 'breathe'] as const)[stepIndex % 7]
                    }
                  />
                </div>
                <p
                  className="font-bold text-[15px] leading-tight flex-1"
                  style={{ color: exerciseComplete ? 'var(--color-chess-green-dark)' : 'var(--color-chess-green-dark)' }}
                >
                  {exerciseComplete ? 'Nice!' : currentExercise.instruction}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes basicsSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes basicsSlideUpBounce {
          0% { opacity: 0; transform: translateY(20px); }
          70% { transform: translateY(-4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .basics-shake {
          animation: basicsShake 0.4s ease-in-out;
        }
        @keyframes basicsShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes basicsTargetPulse {
          0%, 100% { box-shadow: inset 0 0 0 3px #00FF64, 0 0 20px rgba(0, 255, 100, 0.6), 0 0 40px rgba(0, 255, 100, 0.2); }
          50% { box-shadow: inset 0 0 0 3px #00FF64, 0 0 30px rgba(0, 255, 100, 0.9), 0 0 60px rgba(0, 255, 100, 0.4); }
        }
      `}</style>
    </div>
  );
}
