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
  warmupAudio,
  vibrateOnCorrect,
  vibrateOnError,
} from '@/lib/sounds';
import { useAudioWarmup } from '@/hooks/useAudioWarmup';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';

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
    id: 'board',
    title: 'The Chessboard',
    introText: '64 squares — light and dark.\nYou always play from the bottom!',
    introFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    exercises: [
      { type: 'tap', fen: '8/8/1k6/8/8/8/8/7K w - - 0 1', targetSquare: 'e4', instruction: 'Tap the green square!' },
      { type: 'tap', fen: '8/8/1k6/8/8/8/8/7K w - - 0 1', targetSquare: 'a8', instruction: 'Now tap this one!' },
    ],
  },
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
// COMPONENT
// ══════════════════════════════════════════════════

export function BasicsTutorial() {
  const router = useRouter();
  useAudioWarmup();

  // State
  const [stepIndex, setStepIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(-1); // -1 = showing intro
  const [currentFen, setCurrentFen] = useState(STEPS[0].introFen);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [tutorialDone, setTutorialDone] = useState(false);
  const [shakeBoard, setShakeBoard] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0); // 0 for transitions, 200 for user moves

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

    if (exerciseIndex === -1 && currentStep.introPieceSquare) {
      // INTRO: highlight all reachable squares for the piece
      try {
        const introGame = new Chess(currentStep.introFen);
        const moves = introGame.moves({ square: currentStep.introPieceSquare as Square, verbose: true });
        for (const move of moves) {
          styles[move.to] = {
            backgroundColor: 'rgba(28, 176, 246, 0.3)',
          };
        }
        // Highlight the piece itself
        styles[currentStep.introPieceSquare] = {
          boxShadow: 'inset 0 0 0 3px rgba(28, 176, 246, 0.7)',
          backgroundColor: 'rgba(28, 176, 246, 0.15)',
        };
      } catch { /* ignore */ }
    } else if (currentExercise && !exerciseComplete) {
      // EXERCISE: highlight target square in green
      styles[currentExercise.targetSquare] = {
        backgroundColor: 'rgba(88, 204, 2, 0.5)',
        boxShadow: 'inset 0 0 0 3px #58CC02, 0 0 12px rgba(88, 204, 2, 0.4)',
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

  // ── Advance to next exercise/step ──
  const advance = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;

    // Kill animation FIRST, then change FEN on next tick
    // so the board registers duration=0 before seeing the new position
    setAnimationDuration(0);

    requestAnimationFrame(() => {
      const step = STEPS[stepIndex];
      if (exerciseIndex < step.exercises.length - 1) {
        const nextIdx = exerciseIndex + 1;
        const nextEx = step.exercises[nextIdx];
        setExerciseIndex(nextIdx);
        setCurrentFen(nextEx.fen);
        setSelectedSquare(null);
        setExerciseComplete(false);
      } else if (stepIndex < STEPS.length - 1) {
        const nextStep = STEPS[stepIndex + 1];
        setStepIndex(stepIndex + 1);
        setExerciseIndex(-1);
        setCurrentFen(nextStep.introFen);
        setSelectedSquare(null);
        setExerciseComplete(false);
      } else {
        setTutorialDone(true);
      }

      setTimeout(() => { advancingRef.current = false; }, 100);
    });
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

  // ── Start exercises (dismiss intro) ──
  const handleStartExercises = useCallback(() => {
    warmupAudio();
    setAnimationDuration(0);
    requestAnimationFrame(() => {
      const ex = currentStep.exercises[0];
      setExerciseIndex(0);
      setCurrentFen(ex.fen);
      setSelectedSquare(null);
      setExerciseComplete(false);
    });
  }, [currentStep]);

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
    return (
      <div className="h-full bg-chess-page text-chess-text flex flex-col items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="mb-6">
            <AnimatedLogo theme="dark" perpetual autoPlay size={1} iconOnly />
          </div>
          <h1
            className="text-2xl font-black mb-2"
            style={{ animation: 'basicsFadeUp 0.5s ease-out' }}
          >
            You&apos;re Ready!
          </h1>
          <p
            className="text-chess-text-muted text-sm mb-8"
            style={{ animation: 'basicsFadeUp 0.5s ease-out 0.1s both' }}
          >
            You know how all the pieces move.
            <br />
            Time to start solving puzzles!
          </p>
          <button
            onClick={() => router.push('/learn')}
            className="w-full py-4 font-bold text-lg rounded-2xl text-white transition-all hover:brightness-105 active:translate-y-[2px] shadow-[0_4px_0_var(--color-chess-green-shadow)] bg-chess-green"
            style={{ animation: 'basicsFadeUp 0.5s ease-out 0.2s both' }}
          >
            Start Learning
          </button>
        </div>

        <style jsx>{`
          @keyframes basicsFadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ══════════════════════════════════════════════════
  // MAIN TUTORIAL VIEW
  // ══════════════════════════════════════════════════

  const boardInteractive = exerciseIndex >= 0 && !exerciseComplete;

  return (
    <div className="h-full bg-chess-page text-chess-text flex flex-col overflow-hidden">
      {/* Header: X button + progress dots */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={() => router.push('/about')}
            className="text-gray-500 hover:text-gray-300 text-lg w-8"
          >
            ✕
          </button>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  i < stepIndex ? 'bg-chess-green' :
                  i === stepIndex ? 'bg-chess-blue' :
                  'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <div className="w-8" />
        </div>
      </div>

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
              options={{
                position: currentFen,
                boardOrientation: 'white' as const,
                onSquareClick: boardInteractive ? handleSquareClick : undefined,
                onPieceDrop: boardInteractive ? handlePieceDrop : undefined,
                allowDragging: boardInteractive && currentExercise?.type !== 'tap',
                squareStyles,
                animationDurationInMs: animationDuration,
                boardStyle: {
                  borderRadius: exerciseIndex === -1 ? '8px' : '8px 8px 0 0',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                },
                darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
                lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
              }}
            />
          </div>

          {/* Below board: intro card or exercise instruction */}
          {exerciseIndex === -1 ? (
            <div
              key={`intro-${stepIndex}`}
              className="w-full rounded-2xl p-4 mt-3 text-center border border-white/10"
              style={{
                backgroundColor: '#1A2C35',
                animation: 'basicsSlideUp 0.3s ease-out',
              }}
            >
              {/* Accent bar */}
              <div className="h-1 bg-gradient-to-r from-[#58CC02] to-[#1CB0F6] rounded-full mb-3 mx-auto w-16" />

              <p className="text-white text-sm whitespace-pre-line leading-relaxed mb-3">
                {currentStep.introText}
              </p>

              <div className="flex gap-2">
                {stepIndex === 0 && (
                  <button
                    onClick={() => router.push('/learn')}
                    className="flex-1 py-2.5 text-center text-sm font-semibold text-[#A3B8C2] border border-white/20 rounded-xl hover:bg-white/10 active:bg-white/15 transition-all"
                  >
                    Skip
                  </button>
                )}
                <button
                  onClick={handleStartExercises}
                  className={`${stepIndex === 0 ? 'flex-[2]' : 'w-full'} py-2.5 font-bold rounded-xl text-white text-sm uppercase tracking-wide transition-all active:translate-y-[1px]`}
                  style={{
                    backgroundColor: '#1CB0F6',
                    boxShadow: '0 3px 0 #1489bd',
                  }}
                >
                  Got It
                </button>
              </div>
            </div>
          ) : currentExercise ? (
            <div
              key={`ex-${stepIndex}-${exerciseIndex}`}
              className="w-full rounded-b-2xl py-3 px-4 text-center"
              style={{
                backgroundColor: exerciseComplete ? '#d4edda' : '#FFF3CD',
                animation: 'basicsSlideUp 0.3s ease-out',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <p
                className="font-semibold text-sm"
                style={{ color: exerciseComplete ? '#2d6a30' : '#7A6200' }}
              >
                {exerciseComplete ? 'Nice!' : currentExercise.instruction}
              </p>
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
      `}</style>
    </div>
  );
}
