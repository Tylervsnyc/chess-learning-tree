'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup';
import {
  playCorrectSound,
  playErrorSound as playErrorSoundOriginal,
  playMoveSound,
  playCaptureSound,
} from '@/lib/sounds';

// ============================================
// ERROR SOUND OPTIONS - Testing different feels
// ============================================

type ErrorSoundType = 'current' | 'gentle-boop' | 'soft-womp' | 'duolingo-style' | 'muted-thud' | 'none';

const ERROR_SOUND_OPTIONS: { id: ErrorSoundType; label: string; description: string }[] = [
  { id: 'current', label: 'Current (Harsh)', description: 'Sawtooth buzz - the jarring one' },
  { id: 'gentle-boop', label: 'Gentle Boop', description: 'Soft single tone, quick fade' },
  { id: 'soft-womp', label: 'Soft Womp', description: 'Descending tone, sympathetic feel' },
  { id: 'duolingo-style', label: 'Duolingo Style', description: 'Two-note "womp womp" like Duolingo' },
  { id: 'muted-thud', label: 'Muted Thud', description: 'Very short, low thump' },
  { id: 'none', label: 'No Sound', description: 'Silent - visual feedback only' },
];

// Get or create shared AudioContext
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  return new AudioContext();
}

// Current harsh sound (for comparison)
function playErrorCurrent() {
  playErrorSoundOriginal();
}

// Gentle single boop - soft sine wave
function playErrorGentleBoop() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = 280; // Softer, mid-range tone

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

// Soft womp - descending tone that feels sympathetic
function playErrorSoftWomp() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.25);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

// Duolingo-style "womp womp" - two descending notes
function playErrorDuolingoStyle() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // First note
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = 350;
  gain1.gain.setValueAtTime(0.18, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.12);

  // Second note (lower, slightly delayed)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 280;
  gain2.gain.setValueAtTime(0.18, ctx.currentTime + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(ctx.currentTime + 0.12);
  osc2.stop(ctx.currentTime + 0.3);
}

// Muted thud - very short, low frequency
function playErrorMutedThud() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = 100; // Low thump

  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

// Play error sound based on selected type
function playErrorSound(type: ErrorSoundType) {
  switch (type) {
    case 'current': playErrorCurrent(); break;
    case 'gentle-boop': playErrorGentleBoop(); break;
    case 'soft-womp': playErrorSoftWomp(); break;
    case 'duolingo-style': playErrorDuolingoStyle(); break;
    case 'muted-thud': playErrorMutedThud(); break;
    case 'none': break; // No sound
  }
}

// Simple puzzle - Scholar's mate! (1 move)
// White to move and checkmate
const TEST_PUZZLE = {
  puzzleId: 'test-scholars-mate',
  // Position: 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? and now...
  puzzleFen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
  // Qxf7# is checkmate
  solutionMoves: ['Qxf7#'],
  playerColor: 'white' as const,
  themes: ['mate', 'mateIn1', 'opening'],
  rating: 500,
  lastMoveFrom: 'g8',
  lastMoveTo: 'f6',
};

// Longer puzzle - Back rank mate in 2 (from Lichess 001Wz)
// After Black takes rook with Rxe5, White has a back rank mate
const LONG_PUZZLE = {
  puzzleId: '001Wz',
  // Position AFTER Black played Rxe5 (taking White's rook)
  // White to move and mate in 2
  puzzleFen: '6k1/5ppp/r1p5/p1n1rP2/8/2P2N1P/2P3P1/3R2K1 w - - 0 22',
  // Solution: Rd8+! Re8 (forced block) Rxe8# (back rank mate)
  solutionMoves: ['Rd8+', 'Re8', 'Rxe8#'],
  playerColor: 'white' as const,
  themes: ['backRankMate', 'mateIn2'],
  rating: 1118,
  lastMoveFrom: 'e8',
  lastMoveTo: 'e5',
};

// Design options to test
type WrongAnswerFlow = 'current' | 'retry-first' | 'show-full-solution' | 'explain-then-retry' | 'duolingo';

const FLOW_OPTIONS: { id: WrongAnswerFlow; label: string; description: string }[] = [
  {
    id: 'duolingo',
    label: 'Duolingo Style (Recommended)',
    description: 'Retry up to 3x, then highlight the correct piece and square',
  },
  {
    id: 'current',
    label: 'Current Flow',
    description: '"Try Again" shows solution, then Continue',
  },
  {
    id: 'retry-first',
    label: 'Retry First',
    description: 'Let user try again once before showing solution',
  },
  {
    id: 'show-full-solution',
    label: 'Full Solution',
    description: 'Animate the entire winning sequence',
  },
  {
    id: 'explain-then-retry',
    label: 'Explain + Retry',
    description: 'Show hint about the theme, then let them retry',
  },
];

export default function TestWrongFlowPage() {
  const [selectedFlow, setSelectedFlow] = useState<WrongAnswerFlow>('duolingo');
  const [selectedErrorSound, setSelectedErrorSound] = useState<ErrorSoundType>('duolingo-style');
  const [useLongPuzzle, setUseLongPuzzle] = useState(false);
  const puzzle = useLongPuzzle ? LONG_PUZZLE : TEST_PUZZLE;

  // Puzzle state
  const [currentFen, setCurrentFen] = useState(puzzle.puzzleFen);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveStatus, setMoveStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Wrong answer flow state
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showingSolution, setShowingSolution] = useState(false);
  const [solutionStep, setSolutionStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [canRetry, setCanRetry] = useState(false);

  // Duolingo-style hint: highlight the piece to move and target square
  const [showMoveHint, setShowMoveHint] = useState(false);
  const [hintSquares, setHintSquares] = useState<{ from: Square; to: Square } | null>(null);

  // Event log for debugging
  const [eventLog, setEventLog] = useState<string[]>([]);
  const log = (message: string) => {
    setEventLog(prev => [...prev.slice(-20), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Reset puzzle
  const resetPuzzle = useCallback(() => {
    setCurrentFen(puzzle.puzzleFen);
    setMoveIndex(0);
    setMoveStatus('playing');
    setSelectedSquare(null);
    setWrongAttempts(0);
    setShowingSolution(false);
    setSolutionStep(0);
    setShowHint(false);
    setCanRetry(false);
    setShowMoveHint(false);
    setHintSquares(null);
    log('Puzzle reset');
  }, [puzzle.puzzleFen]);

  // Calculate the from/to squares for the current solution move
  const getSolutionMoveSquares = useCallback((): { from: Square; to: Square } | null => {
    try {
      const chess = new Chess(currentFen);
      const moveStr = puzzle.solutionMoves[moveIndex];
      if (!moveStr) return null;

      // Try to parse the move to get from/to squares
      const move = chess.move(moveStr);
      if (move) {
        return { from: move.from as Square, to: move.to as Square };
      }
    } catch {
      // Fallback: try to extract from SAN notation
    }
    return null;
  }, [currentFen, puzzle.solutionMoves, moveIndex]);

  // Reset when puzzle changes
  useEffect(() => {
    resetPuzzle();
  }, [useLongPuzzle, resetPuzzle]);

  // Chess game
  const game = useMemo(() => {
    try {
      return new Chess(currentFen);
    } catch {
      return null;
    }
  }, [currentFen]);

  // Square styles
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Show last move highlight at start
    if (moveIndex === 0 && !showingSolution && !showMoveHint) {
      styles[puzzle.lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
      styles[puzzle.lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
    }

    // Duolingo-style hint: highlight the piece to move and target square
    if (showMoveHint && hintSquares) {
      // Pulsing green highlight for the piece that needs to move
      styles[hintSquares.from] = {
        backgroundColor: 'rgba(88, 204, 2, 0.7)',
        boxShadow: 'inset 0 0 0 3px #58CC02',
        animation: 'pulse 1s infinite',
      };
      // Arrow-like indicator to the target square
      styles[hintSquares.to] = {
        backgroundColor: 'rgba(88, 204, 2, 0.5)',
        boxShadow: 'inset 0 0 0 3px #58CC02, 0 0 10px rgba(88, 204, 2, 0.5)',
      };
    }

    // Selected square
    if (selectedSquare && game && !showMoveHint) {
      styles[selectedSquare] = { backgroundColor: 'rgba(100, 200, 255, 0.6)' };
      const moves = game.moves({ square: selectedSquare, verbose: true });
      for (const move of moves) {
        styles[move.to] = {
          background: move.captured
            ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
            : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
        };
      }
    }

    return styles;
  }, [selectedSquare, game, puzzle, moveIndex, showingSolution, showMoveHint, hintSquares]);

  // Try to make a move
  const tryMove = useCallback((from: Square, to: Square) => {
    if (!game || moveStatus !== 'playing') return false;
    if (moveIndex >= puzzle.solutionMoves.length) return false;

    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (!move) return false;

      const expectedMove = puzzle.solutionMoves[moveIndex];
      const normalizeMove = (m: string) => m.replace(/[+#]$/, '');

      if (normalizeMove(move.san) === normalizeMove(expectedMove)) {
        // Correct move!
        log(`Correct: ${move.san}`);
        setCurrentFen(gameCopy.fen());
        setSelectedSquare(null);
        move.captured ? playCaptureSound() : playMoveSound();

        const nextMoveIndex = moveIndex + 1;
        setMoveIndex(nextMoveIndex);

        if (nextMoveIndex >= puzzle.solutionMoves.length) {
          // Puzzle complete!
          setMoveStatus('correct');
          playCorrectSound(3);
          log('PUZZLE COMPLETE!');
          return true;
        }

        // Auto-play opponent's response
        setTimeout(() => {
          const opponentGame = new Chess(gameCopy.fen());
          const opponentMove = puzzle.solutionMoves[nextMoveIndex];
          try {
            const oppMove = opponentGame.move(opponentMove);
            setCurrentFen(opponentGame.fen());
            setMoveIndex(nextMoveIndex + 1);
            oppMove?.captured ? playCaptureSound() : playMoveSound();
            log(`Opponent: ${opponentMove}`);

            if (nextMoveIndex + 1 >= puzzle.solutionMoves.length) {
              setMoveStatus('correct');
              playCorrectSound(3);
              log('PUZZLE COMPLETE!');
            }
          } catch {
            setMoveStatus('correct');
            playCorrectSound(3);
          }
        }, 400);

        return true;
      } else {
        // Wrong move!
        log(`Wrong: ${move.san} (expected ${expectedMove})`);

        // When hint is showing, just play sound and let them keep trying (no popup)
        if (showMoveHint) {
          setSelectedSquare(null);
          playErrorSound(selectedErrorSound);
          return false;
        }

        setWrongAttempts(prev => prev + 1);
        setMoveStatus('wrong');
        setSelectedSquare(null);
        playErrorSound(selectedErrorSound);
        return false;
      }
    } catch {
      return false;
    }
  }, [game, moveIndex, moveStatus, puzzle.solutionMoves, showMoveHint, selectedErrorSound]);

  // Handle square click
  const onSquareClick = useCallback(
    ({ square }: { piece: { pieceType: string } | null; square: string }) => {
      if (!game || moveStatus !== 'playing') return;
      const clickedSquare = square as Square;

      if (!selectedSquare) {
        const piece = game.get(clickedSquare);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(clickedSquare);
        }
      } else if (selectedSquare === clickedSquare) {
        setSelectedSquare(null);
      } else {
        const legalMoves = game.moves({ square: selectedSquare, verbose: true });
        const isLegalMove = legalMoves.some(m => m.to === clickedSquare);

        if (isLegalMove) {
          tryMove(selectedSquare, clickedSquare);
        } else {
          const piece = game.get(clickedSquare);
          if (piece && piece.color === game.turn()) {
            setSelectedSquare(clickedSquare);
          } else {
            setSelectedSquare(null);
          }
        }
      }
    },
    [game, selectedSquare, moveStatus, tryMove]
  );

  // Handle "Try Again" button based on selected flow
  const handleTryAgain = useCallback(() => {
    log(`handleTryAgain (flow: ${selectedFlow}, attempts: ${wrongAttempts})`);

    switch (selectedFlow) {
      case 'duolingo':
        // Duolingo style: retry up to 3 times, then show hint squares
        if (wrongAttempts < 3) {
          // Reset position and let them try again
          setCurrentFen(puzzle.puzzleFen);
          setMoveIndex(0);
          setMoveStatus('playing');
          setSelectedSquare(null);
          log(`Retry attempt ${wrongAttempts + 1}/3`);
        } else {
          // After 3 wrong attempts, show the hint highlighting the correct squares
          const squares = getSolutionMoveSquares();
          if (squares) {
            setHintSquares(squares);
            setShowMoveHint(true);
            setMoveStatus('playing'); // Let them still make the move
            log(`Showing hint: ${squares.from} → ${squares.to}`);
          } else {
            // Fallback: just show solution if we can't parse squares
            setShowingSolution(true);
            try {
              const chess = new Chess(puzzle.puzzleFen);
              chess.move(puzzle.solutionMoves[0]);
              setCurrentFen(chess.fen());
            } catch {}
            log('Could not parse hint squares, showing solution');
          }
        }
        break;

      case 'current':
        // Current behavior: show first move of solution
        setShowingSolution(true);
        try {
          const chess = new Chess(puzzle.puzzleFen);
          chess.move(puzzle.solutionMoves[0]);
          setCurrentFen(chess.fen());
          log(`Showing solution: ${puzzle.solutionMoves[0]}`);
        } catch (e) {
          log(`Error showing solution: ${e}`);
        }
        break;

      case 'retry-first':
        // Let them try again (once)
        if (wrongAttempts < 2) {
          setMoveStatus('playing');
          setCanRetry(true);
          log('Allowing retry');
        } else {
          // After 2 wrong attempts, show solution
          setShowingSolution(true);
          try {
            const chess = new Chess(puzzle.puzzleFen);
            chess.move(puzzle.solutionMoves[0]);
            setCurrentFen(chess.fen());
            log('Max retries, showing solution');
          } catch {}
        }
        break;

      case 'show-full-solution':
        // Animate full solution
        setShowingSolution(true);
        animateFullSolution();
        break;

      case 'explain-then-retry':
        // Show hint first, then let them retry
        if (!showHint) {
          setShowHint(true);
          log('Showing hint');
        } else {
          setMoveStatus('playing');
          setShowHint(false);
          log('Retry after hint');
        }
        break;
    }
  }, [selectedFlow, wrongAttempts, showHint, puzzle, getSolutionMoveSquares]);

  // Animate the full solution
  const animateFullSolution = useCallback(() => {
    log('Animating full solution...');
    let step = 0;
    const chess = new Chess(puzzle.puzzleFen);

    const playNext = () => {
      if (step >= puzzle.solutionMoves.length) {
        log('Solution animation complete');
        return;
      }

      const move = puzzle.solutionMoves[step];
      try {
        const result = chess.move(move);
        setCurrentFen(chess.fen());
        setSolutionStep(step + 1);
        result?.captured ? playCaptureSound() : playMoveSound();
        log(`Solution step ${step + 1}: ${move}`);
        step++;
        setTimeout(playNext, 800);
      } catch (e) {
        log(`Solution error at step ${step}: ${e}`);
      }
    };

    setTimeout(playNext, 500);
  }, [puzzle]);

  // Handle continue (after correct or showing solution)
  const handleContinue = useCallback(() => {
    log('Continue clicked - would advance to next puzzle');
    resetPuzzle();
  }, [resetPuzzle]);

  // Get hint text based on themes
  const getHintText = () => {
    if (puzzle.themes.includes('backRankMate')) {
      return "Hint: The opponent's back rank is weak. Look for a check that forces them into a mating net!";
    }
    if (puzzle.themes.includes('mate') || puzzle.themes.includes('mateIn1')) {
      return "Hint: There's a checkmate in one move. Which piece can deliver it?";
    }
    if (puzzle.themes.includes('fork')) {
      return "Hint: Look for a fork! Which move attacks two pieces at once?";
    }
    return "Hint: Think about what tactical pattern might work here.";
  };

  // CSS for hint pulse animation
  const hintStyles = `
    @keyframes pulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
  `;

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-4">
      <style>{hintStyles}</style>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Wrong Answer Flow Testing</h1>
        <p className="text-gray-400 mb-6">
          Make a wrong move to see what happens. Test different flows to find what feels best.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Controls */}
          <div className="space-y-4">
            {/* Puzzle selector */}
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <h2 className="font-semibold mb-3">Puzzle Length</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setUseLongPuzzle(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !useLongPuzzle
                      ? 'bg-[#58CC02] text-white'
                      : 'bg-[#2A3C45] text-gray-300 hover:bg-[#3A4C55]'
                  }`}
                >
                  Scholar&apos;s Mate (1 move)
                </button>
                <button
                  onClick={() => setUseLongPuzzle(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    useLongPuzzle
                      ? 'bg-[#58CC02] text-white'
                      : 'bg-[#2A3C45] text-gray-300 hover:bg-[#3A4C55]'
                  }`}
                >
                  Back Rank Mate (3 moves)
                </button>
              </div>
            </div>

            {/* Flow selector */}
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <h2 className="font-semibold mb-3">Wrong Answer Flow</h2>
              <div className="space-y-2">
                {FLOW_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedFlow(option.id);
                      resetPuzzle();
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedFlow === option.id
                        ? 'bg-[#1CB0F6] text-white'
                        : 'bg-[#2A3C45] text-gray-300 hover:bg-[#3A4C55]'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className={`text-sm ${selectedFlow === option.id ? 'text-blue-100' : 'text-gray-500'}`}>
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Sound selector */}
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <h2 className="font-semibold mb-3">Wrong Answer Sound</h2>
              <div className="space-y-2">
                {ERROR_SOUND_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedErrorSound(option.id);
                      // Play the sound so they can preview it
                      playErrorSound(option.id);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedErrorSound === option.id
                        ? 'bg-[#FF9600] text-white'
                        : 'bg-[#2A3C45] text-gray-300 hover:bg-[#3A4C55]'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className={`text-xs ${selectedErrorSound === option.id ? 'text-orange-100' : 'text-gray-500'}`}>
                        {option.description}
                      </div>
                    </div>
                    <span className="text-lg">🔊</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Click to preview each sound</p>
            </div>

            {/* State info */}
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <h2 className="font-semibold mb-3">Current State</h2>
              <div className="space-y-1 text-sm font-mono">
                <div>Flow: <span className="text-blue-400">{selectedFlow}</span></div>
                <div>Sound: <span className="text-orange-400">{selectedErrorSound}</span></div>
                <div>Status: <span className={
                  moveStatus === 'correct' ? 'text-green-400' :
                  moveStatus === 'wrong' ? 'text-red-400' : 'text-gray-400'
                }>{moveStatus}</span></div>
                <div>Move index: {moveIndex} / {puzzle.solutionMoves.length}</div>
                <div>Wrong attempts: <span className={wrongAttempts >= 3 ? 'text-red-400' : ''}>{wrongAttempts}</span></div>
                <div>Move hint visible: <span className={showMoveHint ? 'text-green-400' : ''}>{showMoveHint ? 'yes' : 'no'}</span></div>
                {hintSquares && <div>Hint squares: {hintSquares.from} → {hintSquares.to}</div>}
              </div>
            </div>

            {/* Event log */}
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <h2 className="font-semibold mb-3">Event Log</h2>
              <div className="h-40 overflow-y-auto text-xs font-mono text-gray-400 space-y-1">
                {eventLog.length === 0 ? (
                  <div className="text-gray-600">Make a move to see events...</div>
                ) : (
                  eventLog.map((event, i) => <div key={i}>{event}</div>)
                )}
              </div>
            </div>

            {/* Reset button */}
            <button
              onClick={resetPuzzle}
              className="w-full py-3 bg-[#2A3C45] hover:bg-[#3A4C55] rounded-xl font-medium transition-colors"
            >
              Reset Puzzle
            </button>
          </div>

          {/* Right: Chessboard */}
          <div>
            <div className="bg-[#1A2C35] rounded-xl p-4">
              {/* Turn indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400">
                  {puzzle.playerColor === 'white' ? 'White' : 'Black'} to move
                </span>
                <span className="text-gray-500 text-sm">
                  Rating: {puzzle.rating}
                </span>
              </div>

              {/* Hint display (for explain-then-retry flow) */}
              {showHint && (
                <div className="mb-3 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg text-yellow-200 text-sm">
                  {getHintText()}
                </div>
              )}

              {/* Duolingo-style move hint - just highlights, no banner to avoid layout shift */}

              {/* Solution progress (for full solution flow) */}
              {showingSolution && selectedFlow === 'show-full-solution' && (
                <div className="mb-3 p-3 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-200 text-sm">
                  Showing solution: {solutionStep} / {puzzle.solutionMoves.length} moves
                  <div className="mt-1 text-xs text-blue-300">
                    {puzzle.solutionMoves.slice(0, solutionStep).join(' → ')}
                  </div>
                </div>
              )}

              {/* Chessboard */}
              <div className="relative">
                <Chessboard
                  options={{
                    position: currentFen,
                    boardOrientation: puzzle.playerColor,
                    onSquareClick: onSquareClick,
                    squareStyles: squareStyles,
                    boardStyle: {
                      borderRadius: '8px 8px 0 0',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    },
                    darkSquareStyle: { backgroundColor: '#779952' },
                    lightSquareStyle: { backgroundColor: '#edeed1' },
                  }}
                />
              </div>

              {/* Result popup */}
              {moveStatus === 'correct' && (
                <PuzzleResultPopup
                  type="correct"
                  message="Excellent! You found the winning sequence."
                  onContinue={handleContinue}
                />
              )}

              {moveStatus === 'wrong' && (
                <div className="w-full bg-[#FFDFE0] px-4 py-2.5 rounded-b-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-[#FF4B4B] flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-[#FF4B4B]">
                      {showingSolution
                        ? `The answer was: ${puzzle.solutionMoves[0]}`
                        : showMoveHint
                        ? 'Move the highlighted piece!'
                        : showHint
                        ? 'Think about the hint above...'
                        : selectedFlow === 'duolingo' && wrongAttempts < 3
                        ? "Oops, that's not correct."
                        : selectedFlow === 'retry-first' && wrongAttempts < 2
                        ? `Not quite! You have ${2 - wrongAttempts} ${2 - wrongAttempts === 1 ? 'try' : 'tries'} left.`
                        : "That's not the best move."
                      }
                    </span>
                  </div>

                  {/* Duolingo: show attempts remaining */}
                  {selectedFlow === 'duolingo' && wrongAttempts < 3 && (
                    <div className="text-sm text-[#CC3939] mb-2">
                      {3 - wrongAttempts} {3 - wrongAttempts === 1 ? 'attempt' : 'attempts'} remaining
                    </div>
                  )}

                  {/* Dynamic button based on flow */}
                  {showingSolution ? (
                    <button
                      onClick={handleContinue}
                      className="w-full py-2.5 bg-[#FF4B4B] text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_#CC3939] active:translate-y-[2px]"
                    >
                      Continue
                    </button>
                  ) : showMoveHint ? (
                    <button
                      onClick={() => setMoveStatus('playing')}
                      className="w-full py-2.5 bg-[#58CC02] text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_#46A302] active:translate-y-[2px]"
                    >
                      Try Again
                    </button>
                  ) : showHint ? (
                    <button
                      onClick={handleTryAgain}
                      className="w-full py-2.5 bg-[#1CB0F6] text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_#1899D6] active:translate-y-[2px]"
                    >
                      Try Again
                    </button>
                  ) : (
                    <button
                      onClick={handleTryAgain}
                      className="w-full py-2.5 bg-[#FF4B4B] text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_#CC3939] active:translate-y-[2px]"
                    >
                      {selectedFlow === 'duolingo'
                        ? 'Try Again'
                        : selectedFlow === 'retry-first' && wrongAttempts < 2
                        ? 'Try Again'
                        : selectedFlow === 'explain-then-retry'
                        ? 'Show Hint'
                        : selectedFlow === 'show-full-solution'
                        ? 'Show Solution'
                        : 'Try Again'
                      }
                    </button>
                  )}
                </div>
              )}

              {/* Expected moves reference */}
              <div className="mt-4 p-3 bg-[#0D1A1F] rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Solution (for reference):</div>
                <div className="text-sm text-gray-400 font-mono">
                  {puzzle.solutionMoves.map((move, i) => (
                    <span key={i} className={i < moveIndex ? 'text-green-400' : ''}>
                      {i > 0 && ' → '}{move}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
