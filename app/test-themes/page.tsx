'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';

interface PuzzleAnalysis {
  puzzleId: string;
  fen: string;
  puzzleFen: string;  // Position after setup move - the actual puzzle
  rating: number;
  lichessThemes: string[];
  setupMove: string;
  lastMoveFrom: string;  // For highlighting
  lastMoveTo: string;    // For highlighting
  solution: string;
  solutionMoves: string[];
  playerColor: 'white' | 'black';
  outcome: 'checkmate' | 'material' | 'positional';
  predictedPrimaryTheme: string;
  reasoning: string;
  url: string;
}

const RATING_BANDS = [
  { value: '0400-0800', label: '400-800 (Beginner)' },
  { value: '0800-1200', label: '800-1200 (Intermediate)' },
  { value: '1200-1600', label: '1200-1600 (Advanced)' },
  { value: '1600-2000', label: '1600-2000 (Expert)' },
  { value: '2000-plus', label: '2000+ (Master)' },
];

export default function TestThemesPage() {
  const [ratingBand, setRatingBand] = useState('0400-0800');
  const [puzzles, setPuzzles] = useState<PuzzleAnalysis[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'wrong' | 'partial'>>({});
  const [seenPuzzleIds, setSeenPuzzleIds] = useState<Set<string>>(new Set());
  const [moveIndex, setMoveIndex] = useState(0); // Which solution move we're on
  const [currentFen, setCurrentFen] = useState<string | null>(null); // Current board position
  const [moveStatus, setMoveStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');

  const currentPuzzle = puzzles[currentIndex];

  // Load puzzles (excludes already-seen puzzles)
  const loadPuzzles = useCallback(async (resetSeen = false) => {
    setLoading(true);
    try {
      const excludeIds = resetSeen ? [] : Array.from(seenPuzzleIds);
      const excludeParam = excludeIds.length > 0 ? `&exclude=${excludeIds.join(',')}` : '';
      const res = await fetch(`/api/analyze-themes?rating=${ratingBand}&batch=10${excludeParam}`);
      const data = await res.json();
      const newPuzzles = data.puzzles || [];
      setPuzzles(newPuzzles);
      setCurrentIndex(0);
      setShowSolution(false);
      setSelectedSquare(null);

      // Track these puzzles as seen
      if (resetSeen) {
        setSeenPuzzleIds(new Set(newPuzzles.map((p: PuzzleAnalysis) => p.puzzleId)));
      } else {
        setSeenPuzzleIds(prev => {
          const next = new Set(prev);
          newPuzzles.forEach((p: PuzzleAnalysis) => next.add(p.puzzleId));
          return next;
        });
      }
    } catch (error) {
      console.error('Failed to load puzzles:', error);
    }
    setLoading(false);
  }, [ratingBand, seenPuzzleIds]);

  // Reset seen puzzles when rating band changes
  const handleRatingChange = (newRating: string) => {
    setRatingBand(newRating);
    setSeenPuzzleIds(new Set());
    setFeedback({});
  };

  // Load puzzles on mount and when rating band changes
  useEffect(() => {
    loadPuzzles(true); // Reset seen puzzles on rating change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingBand]);

  // Reset puzzle state when changing puzzles
  useEffect(() => {
    if (currentPuzzle) {
      setCurrentFen(currentPuzzle.puzzleFen);
      setMoveIndex(0);
      setMoveStatus('playing');
      setSelectedSquare(null);
    }
  }, [currentPuzzle]);

  // Create chess game from current position (tracks moves made)
  const game = useMemo(() => {
    const fen = currentFen || currentPuzzle?.puzzleFen;
    if (!fen) return null;
    try {
      return new Chess(fen);
    } catch {
      return null;
    }
  }, [currentFen, currentPuzzle]);

  // Position to display (tracks user's moves)
  const displayPosition = useMemo(() => {
    return currentFen || currentPuzzle?.puzzleFen || null;
  }, [currentFen, currentPuzzle]);

  // Square styles for highlighting (last move + selected piece moves)
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Highlight last move (setup move) with yellow/orange
    if (currentPuzzle) {
      styles[currentPuzzle.lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
      styles[currentPuzzle.lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
    }

    // Highlight selected piece and its legal moves
    if (selectedSquare && game) {
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
  }, [selectedSquare, game, currentPuzzle]);

  // Try to make a move and check if it's correct
  const tryMove = useCallback((from: Square, to: Square) => {
    if (!game || !currentPuzzle || moveStatus !== 'playing') return false;

    // Check if it's player's turn (even indices in solution are player moves)
    if (moveIndex >= currentPuzzle.solutionMoves.length) return false;

    // Try the move
    const gameCopy = new Chess(game.fen());
    try {
      // Try with promotion to queen (most common)
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (!move) return false;

      const expectedMove = currentPuzzle.solutionMoves[moveIndex];

      // Check if move matches (compare SAN)
      if (move.san === expectedMove) {
        // Correct move!
        setCurrentFen(gameCopy.fen());
        setSelectedSquare(null);

        const nextMoveIndex = moveIndex + 1;
        setMoveIndex(nextMoveIndex);

        // Check if puzzle is complete
        if (nextMoveIndex >= currentPuzzle.solutionMoves.length) {
          setMoveStatus('correct');
          return true;
        }

        // Auto-play opponent's response after a delay
        setTimeout(() => {
          const opponentGame = new Chess(gameCopy.fen());
          const opponentMove = currentPuzzle.solutionMoves[nextMoveIndex];
          try {
            opponentGame.move(opponentMove);
            setCurrentFen(opponentGame.fen());
            setMoveIndex(nextMoveIndex + 1);

            // Check if puzzle complete after opponent's move
            if (nextMoveIndex + 1 >= currentPuzzle.solutionMoves.length) {
              setMoveStatus('correct');
            }
          } catch {
            // Opponent move failed - puzzle complete
            setMoveStatus('correct');
          }
        }, 400);

        return true;
      } else {
        // Wrong move
        setMoveStatus('wrong');
        setSelectedSquare(null);
        return false;
      }
    } catch {
      return false;
    }
  }, [game, currentPuzzle, moveIndex, moveStatus]);

  const onSquareClick = useCallback(
    ({ square }: { piece: { pieceType: string } | null; square: string }) => {
      if (!game || moveStatus !== 'playing') return;
      const clickedSquare = square as Square;

      if (!selectedSquare) {
        // Select a piece
        const piece = game.get(clickedSquare);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(clickedSquare);
        }
      } else if (selectedSquare === clickedSquare) {
        // Deselect
        setSelectedSquare(null);
      } else {
        // Try to move
        const legalMoves = game.moves({ square: selectedSquare, verbose: true });
        const isLegalMove = legalMoves.some(m => m.to === clickedSquare);

        if (isLegalMove) {
          tryMove(selectedSquare, clickedSquare);
        } else {
          // Maybe clicked another piece
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

  // Retry puzzle from beginning
  const retryPuzzle = useCallback(() => {
    if (currentPuzzle) {
      setCurrentFen(currentPuzzle.puzzleFen);
      setMoveIndex(0);
      setMoveStatus('playing');
      setSelectedSquare(null);
    }
  }, [currentPuzzle]);

  // Record feedback
  const recordFeedback = (puzzleId: string, result: 'correct' | 'wrong' | 'partial') => {
    setFeedback(prev => ({ ...prev, [puzzleId]: result }));
    // Auto-advance after feedback
    if (currentIndex < puzzles.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'n':
          if (currentIndex < puzzles.length - 1) setCurrentIndex(prev => prev + 1);
          break;
        case 'ArrowLeft':
        case 'p':
          if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
          break;
        case 's':
          setShowSolution(prev => !prev);
          break;
        case '1':
          if (currentPuzzle) recordFeedback(currentPuzzle.puzzleId, 'correct');
          break;
        case '2':
          if (currentPuzzle) recordFeedback(currentPuzzle.puzzleId, 'partial');
          break;
        case '3':
          if (currentPuzzle) recordFeedback(currentPuzzle.puzzleId, 'wrong');
          break;
        case 'r':
          loadPuzzles(false);
          break;
        case 't':
          retryPuzzle();
          break;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, puzzles.length, currentPuzzle, loadPuzzles, retryPuzzle]);

  // Stats
  const stats = useMemo(() => {
    const correct = Object.values(feedback).filter(f => f === 'correct').length;
    const partial = Object.values(feedback).filter(f => f === 'partial').length;
    const wrong = Object.values(feedback).filter(f => f === 'wrong').length;
    return { correct, partial, wrong, total: correct + partial + wrong };
  }, [feedback]);

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Primary Theme Recognition Test</h1>
        <p className="text-gray-400 mb-4">
          Review my predicted primary theme for each puzzle. Rate if my analysis is correct.
        </p>

        {/* Controls */}
        <div className="flex gap-4 mb-6 flex-wrap items-center">
          <select
            value={ratingBand}
            onChange={e => handleRatingChange(e.target.value)}
            className="bg-[#1A2C35] border border-white/20 rounded-lg px-3 py-2"
          >
            {RATING_BANDS.map(rb => (
              <option key={rb.value} value={rb.value}>
                {rb.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => loadPuzzles(false)}
            className="px-4 py-2 bg-[#1CB0F6] rounded-xl font-semibold transition-all duration-100 shadow-[0_3px_0_#1278a8] hover:shadow-[0_2px_0_#1278a8] hover:translate-y-[1px] active:shadow-[0_1px_0_#1278a8] active:translate-y-[2px]"
          >
            New Batch (R)
          </button>

          <div className="text-xs text-gray-500">
            {seenPuzzleIds.size} puzzles seen
          </div>

          <div className="text-gray-400">
            {loading ? 'Loading...' : `Puzzle ${currentIndex + 1} of ${puzzles.length}`}
          </div>

          {stats.total > 0 && (
            <div className="text-sm">
              <span className="text-green-400">{stats.correct} correct</span>
              {' | '}
              <span className="text-yellow-400">{stats.partial} partial</span>
              {' | '}
              <span className="text-red-400">{stats.wrong} wrong</span>
            </div>
          )}
        </div>

        {currentPuzzle && displayPosition && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Board */}
            <div>
              {/* Turn and Rating - Large Display */}
              <div className="mb-4 flex items-center justify-between">
                <div className={`text-2xl font-bold ${
                  currentPuzzle.playerColor === 'white' ? 'text-white' : 'text-gray-300'
                }`}>
                  {currentPuzzle.playerColor === 'white' ? 'White' : 'Black'} to move
                </div>
                <div className="text-xl font-semibold text-[#FFC800]">
                  Rating: {currentPuzzle.rating}
                </div>
              </div>

              {/* Last Move Info */}
              <div className="mb-3 text-sm flex items-center justify-between">
                <div>
                  <span className="text-gray-400">Last move: </span>
                  <span className="font-mono text-orange-400 font-semibold">{currentPuzzle.setupMove}</span>
                  <span className="text-gray-500 ml-2">({currentPuzzle.lastMoveFrom} → {currentPuzzle.lastMoveTo})</span>
                </div>
                <div className="text-gray-400">
                  Move {Math.floor(moveIndex / 2) + 1} of {Math.ceil(currentPuzzle.solutionMoves.length / 2)}
                </div>
              </div>

              <div className="max-w-md">
                <Chessboard
                  options={{
                    position: displayPosition,
                    boardOrientation: currentPuzzle.playerColor,
                    onSquareClick: onSquareClick,
                    squareStyles: squareStyles,
                    boardStyle: {
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    },
                    darkSquareStyle: { backgroundColor: '#779952' },
                    lightSquareStyle: { backgroundColor: '#edeed1' },
                  }}
                />
              </div>

              {/* Move status feedback */}
              {moveStatus === 'correct' && (
                <div className="mt-4 p-3 bg-green-600/30 border border-green-500 rounded-lg text-green-400 font-semibold">
                  Correct! Puzzle solved.
                </div>
              )}
              {moveStatus === 'wrong' && (
                <div className="mt-4 p-3 bg-red-600/30 border border-red-500 rounded-lg text-red-400 font-semibold">
                  Wrong move. Try again?
                </div>
              )}

              <div className="mt-4 flex gap-2">
                {moveStatus !== 'playing' && (
                  <button
                    onClick={retryPuzzle}
                    className="px-4 py-2 bg-[#1A2C35] border border-white/20 rounded-lg text-sm hover:bg-[#2A3C45]"
                  >
                    Retry Puzzle
                  </button>
                )}
                <button
                  onClick={() => setShowSolution(prev => !prev)}
                  className="px-4 py-2 bg-[#1A2C35] border border-white/20 rounded-lg text-sm hover:bg-[#2A3C45]"
                >
                  {showSolution ? 'Hide' : 'Show'} Solution (S)
                </button>
              </div>
            </div>

            {/* Right: Analysis */}
            <div className="space-y-4">
              {/* Puzzle Info */}
              <div className="p-4 bg-[#1A2C35] rounded-lg space-y-3">
                <div>
                  <span className="text-gray-400">Puzzle ID: </span>
                  <a
                    href={currentPuzzle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1CB0F6] hover:underline"
                  >
                    {currentPuzzle.puzzleId}
                  </a>
                </div>

                <div>
                  <span className="text-gray-400">Setup move: </span>
                  <span className="font-mono">{currentPuzzle.setupMove}</span>
                </div>

                {showSolution && (
                  <div>
                    <span className="text-gray-400">Solution: </span>
                    <span className="font-mono text-green-400">{currentPuzzle.solution}</span>
                  </div>
                )}

                <div>
                  <span className="text-gray-400">Outcome: </span>
                  <span className={
                    currentPuzzle.outcome === 'checkmate' ? 'text-red-400' :
                    currentPuzzle.outcome === 'material' ? 'text-yellow-400' : 'text-blue-400'
                  }>
                    {currentPuzzle.outcome}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Lichess Tags: </span>
                  <span className="text-gray-300">{currentPuzzle.lichessThemes.join(', ')}</span>
                </div>
              </div>

              {/* My Prediction */}
              <div className="p-4 bg-[#2A3C45] rounded-lg border-2 border-[#1CB0F6]">
                <div className="text-sm text-gray-400 mb-1">MY PREDICTED PRIMARY THEME:</div>
                <div className="text-2xl font-bold text-[#1CB0F6] mb-2">
                  {currentPuzzle.predictedPrimaryTheme}
                </div>
                <div className="text-sm text-gray-300">
                  {currentPuzzle.reasoning}
                </div>
              </div>

              {/* Feedback Buttons */}
              <div>
                <div className="text-sm text-gray-400 mb-2">Is my prediction correct?</div>
                <div className="flex gap-3">
                  <button
                    onClick={() => recordFeedback(currentPuzzle.puzzleId, 'correct')}
                    className={`flex-1 py-3 font-bold rounded-xl transition-all duration-100 ${
                      feedback[currentPuzzle.puzzleId] === 'correct'
                        ? 'bg-green-600 shadow-[0_2px_0_#166534] translate-y-[2px]'
                        : 'bg-[#58CC02] shadow-[0_4px_0_#3d8c01] hover:shadow-[0_3px_0_#3d8c01] hover:translate-y-[1px] active:shadow-[0_1px_0_#3d8c01] active:translate-y-[3px]'
                    }`}
                  >
                    Correct (1)
                  </button>
                  <button
                    onClick={() => recordFeedback(currentPuzzle.puzzleId, 'partial')}
                    className={`flex-1 py-3 font-bold rounded-xl transition-all duration-100 text-black ${
                      feedback[currentPuzzle.puzzleId] === 'partial'
                        ? 'bg-yellow-600 shadow-[0_2px_0_#a16207] translate-y-[2px]'
                        : 'bg-[#FFC800] shadow-[0_4px_0_#b8920a] hover:shadow-[0_3px_0_#b8920a] hover:translate-y-[1px] active:shadow-[0_1px_0_#b8920a] active:translate-y-[3px]'
                    }`}
                  >
                    Partial (2)
                  </button>
                  <button
                    onClick={() => recordFeedback(currentPuzzle.puzzleId, 'wrong')}
                    className={`flex-1 py-3 font-bold rounded-xl transition-all duration-100 ${
                      feedback[currentPuzzle.puzzleId] === 'wrong'
                        ? 'bg-red-700 shadow-[0_2px_0_#7f1d1d] translate-y-[2px]'
                        : 'bg-[#FF4B4B] shadow-[0_4px_0_#cc2929] hover:shadow-[0_3px_0_#cc2929] hover:translate-y-[1px] active:shadow-[0_1px_0_#cc2929] active:translate-y-[3px]'
                    }`}
                  >
                    Wrong (3)
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex-1 py-2 bg-[#1A2C35] rounded-xl transition-all duration-100 shadow-[0_3px_0_#0d1a1f] hover:shadow-[0_2px_0_#0d1a1f] hover:translate-y-[1px] active:shadow-[0_1px_0_#0d1a1f] active:translate-y-[2px] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_3px_0_#0d1a1f]"
                >
                  ← Previous (P)
                </button>
                <button
                  onClick={() => setCurrentIndex(prev => Math.min(puzzles.length - 1, prev + 1))}
                  disabled={currentIndex >= puzzles.length - 1}
                  className="flex-1 py-2 bg-[#1A2C35] rounded-xl transition-all duration-100 shadow-[0_3px_0_#0d1a1f] hover:shadow-[0_2px_0_#0d1a1f] hover:translate-y-[1px] active:shadow-[0_1px_0_#0d1a1f] active:translate-y-[2px] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_3px_0_#0d1a1f]"
                >
                  Next (N) →
                </button>
              </div>

              {/* Keyboard shortcuts */}
              <div className="text-xs text-gray-500 p-3 bg-[#1A2C35]/50 rounded-lg">
                <div className="font-semibold mb-1">Keyboard Shortcuts:</div>
                <div>1 = Correct | 2 = Partial | 3 = Wrong</div>
                <div>N/→ = Next | P/← = Previous | S = Solution | R = New Batch | T = Retry</div>
              </div>
            </div>
          </div>
        )}

        {/* Batch Summary */}
        {puzzles.length > 0 && (
          <div className="mt-8 p-4 bg-[#1A2C35] rounded-lg">
            <h2 className="text-lg font-bold mb-3">Batch Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              {puzzles.map((p, i) => (
                <div
                  key={p.puzzleId}
                  onClick={() => setCurrentIndex(i)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    i === currentIndex ? 'bg-[#1CB0F6]' :
                    feedback[p.puzzleId] === 'correct' ? 'bg-green-600/30' :
                    feedback[p.puzzleId] === 'partial' ? 'bg-yellow-600/30' :
                    feedback[p.puzzleId] === 'wrong' ? 'bg-red-600/30' :
                    'bg-[#2A3C45] hover:bg-[#3A4C55]'
                  }`}
                >
                  <div className="font-mono text-xs">{p.puzzleId}</div>
                  <div className="text-xs text-gray-400 truncate">{p.predictedPrimaryTheme}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
