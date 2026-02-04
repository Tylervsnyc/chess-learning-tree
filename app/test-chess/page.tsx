'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { parseUciMove } from '@/lib/puzzle-utils';

// Sample puzzles in raw Lichess format
const SAMPLE_PUZZLES = [
  {
    id: 'ZIgpI',
    fen: '6k1/1p2Rp1p/p5p1/3b4/3r4/1B6/PP3PPP/6K1 w - - 1 26',
    moves: ['b3d5', 'd4d1', 'e7e1', 'd1e1'],
    rating: 400,
    theme: 'fork',
    themes: ['backRankMate', 'endgame', 'fork', 'mate', 'mateIn2'],
  },
  {
    id: 'AIQrp',
    fen: '1k6/1pp5/p7/4p3/5b2/4r1pN/PPP5/1K1R3B w - - 2 34',
    moves: ['d1d7', 'e3e1', 'd7d1', 'e1d1'],
    rating: 400,
    theme: 'fork',
    themes: ['backRankMate', 'endgame', 'fork', 'mate', 'mateIn2'],
  },
  {
    id: '00sHx',
    fen: 'r4rk1/pp1b1ppp/1qnbpn2/8/2BN4/2N1B3/PPP1QPPP/R4RK1 w - - 5 12',
    moves: ['d4f5', 'e6f5', 'c4f7', 'f8f7'],
    rating: 800,
    theme: 'discoveredAttack',
    themes: ['advantage', 'discoveredAttack', 'middlegame', 'short'],
  },
];

// Board styling constants
const BOARD_STYLES = {
  darkSquare: '#779952',
  lightSquare: '#edeed1',
  selected: 'rgba(255, 255, 0, 0.4)',
  lastMoveFrom: 'rgba(255, 170, 0, 0.5)',
  lastMoveTo: 'rgba(255, 170, 0, 0.6)',
  hintFrom: 'rgba(88, 204, 2, 0.7)',
  legalMoveDot: 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
  legalMoveRing: 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)',
};

interface ProcessedPuzzle {
  id: string;
  originalFen: string;
  puzzleFen: string;
  setupMove: { from: string; to: string; promotion?: string };
  solutionMoves: string[]; // SAN notation
  playerColor: 'white' | 'black';
  rating: number;
  theme: string;
}

function processPuzzle(raw: typeof SAMPLE_PUZZLES[0]): ProcessedPuzzle {
  // Step 1: Load the original FEN
  const chess = new Chess(raw.fen);

  // Step 2: Parse and apply the setup move (opponent's last move)
  const setupUci = raw.moves[0];
  const setupMove = parseUciMove(setupUci);

  try {
    chess.move({ from: setupMove.from, to: setupMove.to, promotion: setupMove.promotion });
  } catch (e) {
    console.error('Invalid setup move:', setupUci, e);
  }

  // Step 3: The puzzle position is AFTER the setup move
  const puzzleFen = chess.fen();

  // Step 4: Player color is whoever's turn it is now
  const playerColor = chess.turn() === 'w' ? 'white' : 'black';

  // Step 5: Convert solution moves (UCI) to SAN
  const solutionUci = raw.moves.slice(1);
  const sanMoves: string[] = [];
  const tempChess = new Chess(puzzleFen);

  for (const uci of solutionUci) {
    const { from, to, promotion } = parseUciMove(uci);
    try {
      const move = tempChess.move({ from, to, promotion });
      if (move) sanMoves.push(move.san);
    } catch {
      sanMoves.push(uci); // Fallback to UCI if conversion fails
    }
  }

  return {
    id: raw.id,
    originalFen: raw.fen,
    puzzleFen,
    setupMove,
    solutionMoves: sanMoves,
    playerColor,
    rating: raw.rating,
    theme: raw.theme,
  };
}

type PuzzlePhase = 'initial' | 'animating-setup' | 'playing' | 'correct' | 'wrong';

export default function TestChessPage() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [phase, setPhase] = useState<PuzzlePhase>('initial');
  const [displayFen, setDisplayFen] = useState<string>('');
  const [game, setGame] = useState<Chess | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [feedback, setFeedback] = useState('');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Process current puzzle
  const puzzle = useMemo(() => processPuzzle(SAMPLE_PUZZLES[puzzleIndex]), [puzzleIndex]);

  // Initialize puzzle - show original position first
  const initializePuzzle = useCallback(() => {
    setPhase('initial');
    setDisplayFen(puzzle.originalFen);
    setGame(null);
    setMoveIndex(0);
    setSelectedSquare(null);
    setLastMove(null);
    setFeedback('Click "Play Setup Move" to see opponent\'s move');
    setWrongAttempts(0);
    setShowHint(false);
  }, [puzzle]);

  // Animate the setup move
  const playSetupMove = useCallback(() => {
    setPhase('animating-setup');
    setFeedback('Opponent plays...');

    // Change position - react-chessboard will animate this
    setDisplayFen(puzzle.puzzleFen);
    setLastMove({ from: puzzle.setupMove.from, to: puzzle.setupMove.to });

    // After animation completes, switch to playing phase
    setTimeout(() => {
      setPhase('playing');
      setGame(new Chess(puzzle.puzzleFen));
      setFeedback(`Your turn! Find the best ${puzzle.theme}.`);
    }, 500); // Match animation duration
  }, [puzzle]);

  // Get legal moves for selected piece
  const legalMoves = useMemo(() => {
    if (!selectedSquare || !game) return [];
    return game.moves({ square: selectedSquare, verbose: true });
  }, [game, selectedSquare]);

  // Compute square styles
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Highlight last move (setup move)
    if (lastMove) {
      styles[lastMove.from] = { backgroundColor: BOARD_STYLES.lastMoveFrom };
      styles[lastMove.to] = { backgroundColor: BOARD_STYLES.lastMoveTo };
    }

    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = { backgroundColor: BOARD_STYLES.selected };
    }

    // Highlight legal moves
    for (const move of legalMoves) {
      const isCapture = move.captured;
      styles[move.to] = {
        background: isCapture ? BOARD_STYLES.legalMoveRing : BOARD_STYLES.legalMoveDot,
      };
    }

    // Show hint after 3 wrong attempts
    if (showHint && puzzle.solutionMoves[moveIndex]) {
      // Parse the expected move to get from/to squares
      const tempGame = new Chess(game?.fen() || puzzle.puzzleFen);
      const moves = tempGame.moves({ verbose: true });
      const expectedSan = puzzle.solutionMoves[moveIndex].replace(/[+#]$/, '');
      const hintMove = moves.find(m => m.san.replace(/[+#]$/, '') === expectedSan);

      if (hintMove) {
        styles[hintMove.from] = {
          backgroundColor: BOARD_STYLES.hintFrom,
          boxShadow: 'inset 0 0 0 3px #58CC02',
        };
        styles[hintMove.to] = {
          backgroundColor: BOARD_STYLES.hintFrom,
          boxShadow: 'inset 0 0 0 3px #58CC02',
        };
      }
    }

    return styles;
  }, [lastMove, selectedSquare, legalMoves, showHint, puzzle, moveIndex, game]);

  // Handle making a move
  const tryMove = useCallback((from: string, to: string) => {
    if (!game || phase !== 'playing') return false;

    const gameCopy = new Chess(game.fen());

    try {
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (!move) return false;

      // Normalize for comparison (strip check/mate symbols)
      const normalize = (m: string) => m.replace(/[+#]$/, '');
      const expected = normalize(puzzle.solutionMoves[moveIndex]);
      const actual = normalize(move.san);

      if (actual === expected) {
        // Correct move!
        setGame(gameCopy);
        setDisplayFen(gameCopy.fen());
        setLastMove({ from, to });
        setSelectedSquare(null);
        setWrongAttempts(0);
        setShowHint(false);

        const nextMoveIndex = moveIndex + 1;

        if (nextMoveIndex >= puzzle.solutionMoves.length) {
          // Puzzle complete!
          setPhase('correct');
          setFeedback('Correct! Puzzle solved!');
        } else {
          // More moves to make - play opponent's response
          setMoveIndex(nextMoveIndex);
          setFeedback('Correct! Opponent responds...');

          // Auto-play opponent's response after a delay
          setTimeout(() => {
            const opponentMove = puzzle.solutionMoves[nextMoveIndex];
            const { from: oFrom, to: oTo, promotion: oProm } = parseUciMove(opponentMove);

            // Try to apply as UCI first, then as SAN
            const afterOpponent = new Chess(gameCopy.fen());
            try {
              afterOpponent.move({ from: oFrom, to: oTo, promotion: oProm });
            } catch {
              // Try as SAN
              try {
                afterOpponent.move(opponentMove);
              } catch {
                console.error('Could not play opponent move:', opponentMove);
              }
            }

            setGame(afterOpponent);
            setDisplayFen(afterOpponent.fen());
            setMoveIndex(nextMoveIndex + 1);
            setFeedback('Your turn again!');
          }, 500);
        }

        return true;
      } else {
        // Wrong move
        const newWrongAttempts = wrongAttempts + 1;
        setWrongAttempts(newWrongAttempts);

        if (newWrongAttempts >= 3) {
          setShowHint(true);
          setFeedback(`Not quite. Here's a hint - the correct squares are highlighted.`);
        } else {
          setFeedback(`Oops! That's not right. ${3 - newWrongAttempts} attempts remaining.`);
        }

        return false;
      }
    } catch {
      return false;
    }
  }, [game, phase, puzzle, moveIndex, wrongAttempts]);

  // Handle square click
  const onSquareClick = useCallback(({ square }: { piece: unknown; square: string }) => {
    if (!game || phase !== 'playing') return;

    const clickedSquare = square as Square;

    if (!selectedSquare) {
      // Select piece if it's the right color
      const piece = game.get(clickedSquare);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(clickedSquare);
      }
      return;
    }

    if (selectedSquare === clickedSquare) {
      setSelectedSquare(null);
      return;
    }

    // Try to make the move
    const isLegal = legalMoves.some(m => m.to === clickedSquare);
    if (isLegal) {
      tryMove(selectedSquare, clickedSquare);
    } else {
      // Maybe clicking another piece of same color
      const piece = game.get(clickedSquare);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(clickedSquare);
      } else {
        setSelectedSquare(null);
      }
    }
  }, [game, phase, selectedSquare, legalMoves, tryMove]);

  // Handle drag and drop
  const onDrop = useCallback(({ sourceSquare, targetSquare }: { piece: unknown; sourceSquare: string; targetSquare: string | null }) => {
    if (!targetSquare) return false;
    setSelectedSquare(null);
    return tryMove(sourceSquare, targetSquare);
  }, [tryMove]);

  // Initialize on mount and puzzle change
  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  const nextPuzzle = () => {
    setPuzzleIndex((i) => (i + 1) % SAMPLE_PUZZLES.length);
  };

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-4">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center">Chess Board Test Page</h1>

        {/* Info Panel */}
        <div className="bg-[#1A2C35] rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Puzzle:</span>
            <span>{puzzle.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Theme:</span>
            <span className="capitalize">{puzzle.theme}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Rating:</span>
            <span>{puzzle.rating}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">You play as:</span>
            <span className="capitalize">{puzzle.playerColor}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Phase:</span>
            <span className="capitalize">{phase}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Solution:</span>
            <span className="font-mono text-xs">{puzzle.solutionMoves.join(' ')}</span>
          </div>
        </div>

        {/* Feedback */}
        <div className={`p-3 rounded-lg text-center font-medium ${
          phase === 'correct' ? 'bg-[#58CC02]/20 text-[#58CC02]' :
          phase === 'wrong' ? 'bg-[#FF4B4B]/20 text-[#FF4B4B]' :
          'bg-[#1A2C35] text-white'
        }`}>
          {feedback}
        </div>

        {/* Chess Board */}
        <div className="w-full">
          <Chessboard
            options={{
              position: displayFen,
              boardOrientation: puzzle.playerColor,
              onSquareClick: onSquareClick,
              onPieceDrop: onDrop,
              squareStyles: squareStyles,
              animationDurationInMs: 300,
              boardStyle: {
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              },
              darkSquareStyle: { backgroundColor: BOARD_STYLES.darkSquare },
              lightSquareStyle: { backgroundColor: BOARD_STYLES.lightSquare },
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {phase === 'initial' && (
            <button
              onClick={playSetupMove}
              className="flex-1 bg-[#58CC02] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#4CAF00] transition-colors"
            >
              Play Setup Move (Animate)
            </button>
          )}

          {(phase === 'correct' || phase === 'wrong') && (
            <button
              onClick={nextPuzzle}
              className="flex-1 bg-[#1CB0F6] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#0A9FE0] transition-colors"
            >
              Next Puzzle
            </button>
          )}

          <button
            onClick={initializePuzzle}
            className="bg-[#1A2C35] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#243C48] transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Rules Reference */}
        <div className="bg-[#1A2C35] rounded-lg p-4 space-y-3 text-sm">
          <h2 className="font-bold text-lg">Chess Board Rules</h2>

          <div>
            <h3 className="font-semibold text-[#58CC02]">1. Lichess Format</h3>
            <p className="text-gray-400">
              <code>moves[0]</code> is the opponent&apos;s setup move. Apply it first, THEN show the board.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#58CC02]">2. Animate Setup Move</h3>
            <p className="text-gray-400">
              Show original FEN first, then change to puzzle FEN. The board animates the transition automatically via <code>animationDurationInMs</code>.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#58CC02]">3. Board Colors</h3>
            <p className="text-gray-400">
              Dark: <code>#779952</code> | Light: <code>#edeed1</code>
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#58CC02]">4. Highlighting</h3>
            <ul className="text-gray-400 list-disc list-inside">
              <li>Selected: Yellow <code>rgba(255,255,0,0.4)</code></li>
              <li>Last move: Orange <code>rgba(255,170,0,0.5)</code></li>
              <li>Hints: Green <code>#58CC02</code></li>
              <li>Legal moves: Dots (empty) or rings (captures)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#58CC02]">5. Move Validation</h3>
            <p className="text-gray-400">
              Compare SAN notation. Normalize by stripping <code>+</code> and <code>#</code> symbols.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#58CC02]">6. Auto-Queen Promotion</h3>
            <p className="text-gray-400">
              Always promote to queen. No UI choice needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
