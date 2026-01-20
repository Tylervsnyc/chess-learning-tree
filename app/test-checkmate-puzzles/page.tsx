'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

// 5 longer checkmate puzzles for landing page selection
const CHECKMATE_PUZZLES = [
  {
    id: 1,
    name: "The Opera Game Finale",
    description: "Paul Morphy's immortal combination (1858) - Queen sacrifice into back rank mate",
    fen: "3rkb1r/pp1nqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR3R w k - 0 1",
    moves: ["d1d7", "d8d7", "h1d1", "e7e6", "b5d7", "f6d7", "b3b8", "d7b8", "d1d8"],
    orientation: "white" as const,
    moveCount: 9,
  },
  {
    id: 2,
    name: "Two Rook Staircase",
    description: "The classic 'ladder mate' - Two rooks coordinate to drive the king across the board",
    fen: "k7/8/8/8/8/8/8/R3R2K w - - 0 1",
    moves: ["a1a8", "a8b7", "e1b1", "b7c6", "a8c8", "c6d5", "b1b5", "d5e4", "c8e8", "e4f3", "b5b3", "f3g2", "e8e2", "g2f1", "b3b1"],
    orientation: "white" as const,
    moveCount: 15,
  },
  {
    id: 3,
    name: "Queen & Rook Domination",
    description: "Heavy pieces coordinate to trap the king - Methodical queen and rook checkmate",
    fen: "6k1/8/8/8/8/8/8/R3Q2K w - - 0 1",
    moves: ["e1e7", "g8f8", "a1a8", "f8g8", "e7e8", "g8h7", "a8a7", "h7g6", "e8e6", "g6f5", "a7a5", "f5g4", "e6e4", "g4f3", "a5a3", "f3g2", "e4e2", "g2h1", "a3a1"],
    orientation: "white" as const,
    moveCount: 19,
  },
  {
    id: 4,
    name: "Philidor's Smothered Mate",
    description: "The legendary knight suffocation - Queen sacrifice forces king into corner for knight mate",
    fen: "r4rk1/6pp/8/6N1/8/1Q6/8/6K1 w - - 0 1",
    moves: ["b3f7", "f8f7", "g5e6", "g8f8", "e6g7", "f8e8", "g7f5", "e8d8", "f5e3", "d8c8", "e3d5", "c8b8", "d5c7", "a8a7", "c7a6", "b8a8", "a6c7"],
    orientation: "white" as const,
    moveCount: 17,
  },
  {
    id: 5,
    name: "The Immortal Zugzwang",
    description: "King hunt with precise coordination - Every move forces the king closer to doom",
    fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
    moves: ["f7f6", "e8e7", "c4d5", "c6d4", "d5c4", "d4c6", "f6g7", "h8g8", "c4f7", "e7d6", "f7g8", "d8e8", "g8e6", "d6c5", "e6d5", "c5b4", "d5c6", "b4a5", "c6b7"],
    orientation: "white" as const,
    moveCount: 19,
  },
];

function AnimatedBoard({
  puzzle,
  size,
  isPlaying,
  onComplete,
}: {
  puzzle: typeof CHECKMATE_PUZZLES[0];
  size: number;
  isPlaying: boolean;
  onComplete: () => void;
}) {
  const [game, setGame] = useState(() => new Chess(puzzle.fen));
  const [moveIndex, setMoveIndex] = useState(-1);
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);
  const [isCheckmate, setIsCheckmate] = useState(false);

  const resetPuzzle = useCallback(() => {
    setGame(new Chess(puzzle.fen));
    setMoveIndex(-1);
    setLastMove(null);
    setIsCheckmate(false);
  }, [puzzle.fen]);

  // Reset when puzzle changes
  useEffect(() => {
    resetPuzzle();
  }, [puzzle.id, resetPuzzle]);

  useEffect(() => {
    if (!isPlaying) return;

    const timeout = setTimeout(() => {
      if (moveIndex < puzzle.moves.length - 1) {
        const nextIndex = moveIndex + 1;
        const move = puzzle.moves[nextIndex];
        const from = move.slice(0, 2);
        const to = move.slice(2, 4);
        const promotion = move.length > 4 ? move[4] : undefined;

        try {
          const newGame = new Chess(game.fen());
          newGame.move({ from, to, promotion });
          setGame(newGame);
          setLastMove([from, to]);
          setMoveIndex(nextIndex);

          // Check if this move is checkmate
          if (newGame.isCheckmate()) {
            setIsCheckmate(true);
            setTimeout(() => {
              onComplete();
              setTimeout(resetPuzzle, 1500);
            }, 2000);
          }
        } catch (e) {
          console.error('Invalid move:', move, e);
          resetPuzzle();
        }
      } else {
        // End of moves - wait then reset
        setTimeout(() => {
          onComplete();
          setTimeout(resetPuzzle, 1500);
        }, 2000);
      }
    }, moveIndex === -1 ? 1200 : 800);

    return () => clearTimeout(timeout);
  }, [moveIndex, game, puzzle, isPlaying, resetPuzzle, onComplete]);

  const customSquareStyles: Record<string, React.CSSProperties> = {};

  if (lastMove) {
    customSquareStyles[lastMove[0]] = { backgroundColor: 'rgba(88, 204, 2, 0.5)' };
    customSquareStyles[lastMove[1]] = { backgroundColor: 'rgba(88, 204, 2, 0.5)' };
  }

  // Highlight king square red on checkmate
  if (isCheckmate) {
    const kingSquare = game.board().flat().find(sq => sq?.type === 'k' && sq.color !== game.turn())?.square;
    if (kingSquare) {
      customSquareStyles[kingSquare as string] = { backgroundColor: 'rgba(255, 0, 0, 0.6)' };
    }
  }

  return (
    <div style={{ width: size, height: size }} className="relative">
      <Chessboard
        options={{
          position: game.fen(),
          boardOrientation: puzzle.orientation,
          squareStyles: customSquareStyles,
          boardStyle: { borderRadius: '8px' },
          darkSquareStyle: { backgroundColor: '#779952' },
          lightSquareStyle: { backgroundColor: '#edeed1' },
        }}
      />
      {isCheckmate && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xl animate-pulse shadow-lg">
            CHECKMATE!
          </div>
        </div>
      )}
    </div>
  );
}

export default function TestCheckmatePuzzles() {
  const [selectedPuzzle, setSelectedPuzzle] = useState(CHECKMATE_PUZZLES[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);

  const handleComplete = () => {
    setCompletedCount(c => c + 1);
  };

  const handleRestart = () => {
    setCompletedCount(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Checkmate Puzzle Test</h1>
          <p className="text-gray-400 text-sm">
            Select a puzzle to preview for the landing page
          </p>
        </div>

        {/* Puzzle selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {CHECKMATE_PUZZLES.map((puzzle) => (
            <button
              key={puzzle.id}
              onClick={() => {
                setSelectedPuzzle(puzzle);
                setIsPlaying(true);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPuzzle.id === puzzle.id
                  ? 'bg-[#58CC02] text-white'
                  : 'bg-[#1A2C35] text-gray-300 hover:bg-[#243B47]'
              }`}
            >
              #{puzzle.id}: {puzzle.name}
            </button>
          ))}
        </div>

        {/* Main puzzle display */}
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
          {/* Board with neon border */}
          <div
            className="p-1 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #00FFFF, #FF00FF, #FFFF00)',
              boxShadow: '0 0 30px rgba(0,255,255,0.3), 0 0 60px rgba(255,0,255,0.2)',
            }}
          >
            <div className="bg-[#131F24] rounded-lg p-1">
              <AnimatedBoard
                puzzle={selectedPuzzle}
                size={320}
                isPlaying={isPlaying}
                onComplete={handleComplete}
              />
            </div>
          </div>

          {/* Info panel */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <h2 className="text-xl font-bold text-[#58CC02] mb-2">
                {selectedPuzzle.name}
              </h2>
              <p className="text-gray-300 text-sm mb-4">
                {selectedPuzzle.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="bg-[#131F24] px-3 py-1.5 rounded-lg">
                  <span className="text-gray-400">Moves:</span>{' '}
                  <span className="text-white font-bold">{selectedPuzzle.moveCount}</span>
                </div>
                <div className="bg-[#131F24] px-3 py-1.5 rounded-lg">
                  <span className="text-gray-400">Loops:</span>{' '}
                  <span className="text-white font-bold">{completedCount}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  isPlaying
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-[#58CC02] hover:bg-[#4AB302]'
                }`}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 py-3 rounded-xl font-bold bg-[#1CB0F6] hover:bg-[#0A9FE5] transition-all"
              >
                Restart
              </button>
            </div>

            {/* Move list */}
            <div className="bg-[#1A2C35] rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Move Sequence (UCI):</h3>
              <div className="flex flex-wrap gap-1 text-xs font-mono">
                {selectedPuzzle.moves.map((move, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded ${
                      i % 2 === 0 ? 'bg-[#131F24]' : 'bg-[#243B47]'
                    }`}
                  >
                    {Math.floor(i / 2) + 1}.{i % 2 === 0 ? '' : '..'} {move}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* All puzzles grid preview */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-center">All Puzzles Preview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHECKMATE_PUZZLES.map((puzzle) => (
              <div
                key={puzzle.id}
                className={`bg-[#1A2C35] rounded-xl p-3 cursor-pointer transition-all border-2 ${
                  selectedPuzzle.id === puzzle.id
                    ? 'border-[#58CC02]'
                    : 'border-transparent hover:border-gray-600'
                }`}
                onClick={() => {
                  setSelectedPuzzle(puzzle);
                  setIsPlaying(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 flex-shrink-0">
                    <Chessboard
                      options={{
                        position: puzzle.fen,
                        boardOrientation: puzzle.orientation,
                        boardStyle: { borderRadius: '4px' },
                        darkSquareStyle: { backgroundColor: '#779952' },
                        lightSquareStyle: { backgroundColor: '#edeed1' },
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-white truncate">
                      #{puzzle.id} {puzzle.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {puzzle.moveCount} moves
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-[#1A2C35] rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">
            Review each puzzle animation. When you&apos;ve chosen your favorite,
            let me know and I&apos;ll add it to the main landing page!
          </p>
        </div>
      </div>
    </div>
  );
}
