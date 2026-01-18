'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { curriculum } from '@/data/curriculum';
import { getPuzzleSolutionSan } from '@/lib/chess-utils';

interface LichessPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string;
  gameUrl: string;
}

interface PuzzleReview {
  puzzleId: string;
  decision: 'approved' | 'rejected' | 'maybe';
  assignedTheme: string | null;
  originalThemes: string;
  rating: number;
  notes: string;
  reviewedAt: string;
}

const RATING_BANDS = [
  { value: '0400-0800', label: '400-800 (Beginner)' },
  { value: '0800-1200', label: '800-1200 (Intermediate)' },
  { value: '1200-1600', label: '1200-1600 (Advanced)' },
  { value: '1600-2000', label: '1600-2000 (Expert)' },
  { value: '2000-plus', label: '2000+ (Master)' },
];

const LICHESS_THEMES = [
  'defensiveMove',
  'fork',
  'pin',
  'skewer',
  'mateIn1',
  'mateIn2',
  'discoveredAttack',
  'hangingPiece',
  'sacrifice',
  'backRankMate',
  'deflection',
  'attraction',
  'interference',
  'trappedPiece',
  'quietMove',
  'promotion',
];

export default function ReviewPage() {
  const [ratingBand, setRatingBand] = useState('0800-1200');
  const [lichessTheme, setLichessTheme] = useState('defensiveMove');
  const [puzzles, setPuzzles] = useState<LichessPuzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<Record<string, PuzzleReview>>({});
  const [notes, setNotes] = useState('');
  const [assignedTheme, setAssignedTheme] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  const currentPuzzle = puzzles[currentIndex];

  // Load puzzles when filters change
  useEffect(() => {
    async function loadPuzzles() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/puzzles?rating=${ratingBand}&theme=${lichessTheme}&limit=100`
        );
        const data = await res.json();
        setPuzzles(data.puzzles || []);
        setTotal(data.total || 0);
        setCurrentIndex(0);
        setShowSolution(false);
        setSelectedSquare(null);
      } catch (error) {
        console.error('Failed to load puzzles:', error);
      }
      setLoading(false);
    }
    loadPuzzles();
  }, [ratingBand, lichessTheme]);

  // Load existing reviews
  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        const reviewMap: Record<string, PuzzleReview> = {};
        for (const r of data.reviews || []) {
          reviewMap[r.puzzleId] = r;
        }
        setReviews(reviewMap);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      }
    }
    loadReviews();
  }, []);

  // Update notes when puzzle changes
  useEffect(() => {
    if (currentPuzzle) {
      const existing = reviews[currentPuzzle.puzzleId];
      setNotes(existing?.notes || '');
      setAssignedTheme(existing?.assignedTheme || '');
      setShowSolution(false);
      setSelectedSquare(null);
    }
  }, [currentPuzzle, reviews]);

  // Create chess game for display
  const game = useMemo(() => {
    if (!currentPuzzle) return null;
    try {
      const chess = new Chess(currentPuzzle.fen);
      // Apply first move (opponent's last move) to show puzzle position
      const moves = currentPuzzle.moves.split(' ');
      if (moves[0]) {
        const from = moves[0].slice(0, 2);
        const to = moves[0].slice(2, 4);
        chess.move({ from, to, promotion: 'q' });
      }
      return chess;
    } catch {
      return null;
    }
  }, [currentPuzzle]);

  // Determine player color (opposite of who just moved)
  const playerColor = game ? (game.turn() === 'w' ? 'white' : 'black') : 'white';

  // Get solution moves in SAN format (e.g., "1.e4 e5 2.Nf3")
  const solutionSan = useMemo(() => {
    if (!currentPuzzle) return '';
    return getPuzzleSolutionSan(currentPuzzle.fen, currentPuzzle.moves);
  }, [currentPuzzle]);

  // Legal moves for click-to-move
  const legalMoves = useMemo(() => {
    if (!selectedSquare || !game) return [];
    return game.moves({ square: selectedSquare, verbose: true });
  }, [game, selectedSquare]);

  // Square styles for highlighting
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (selectedSquare) {
      styles[selectedSquare] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
    }
    for (const move of legalMoves) {
      styles[move.to] = {
        background: move.captured
          ? 'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.3) 60%)'
          : 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 25%, transparent 25%)',
      };
    }
    return styles;
  }, [selectedSquare, legalMoves]);

  // Handle square click for exploring position
  const onSquareClick = useCallback(
    ({ square }: { piece: { pieceType: string } | null; square: string }) => {
      if (!game) return;
      const clickedSquare = square as Square;
      if (!selectedSquare) {
        const piece = game.get(clickedSquare);
        if (piece) setSelectedSquare(clickedSquare);
      } else if (selectedSquare === clickedSquare) {
        setSelectedSquare(null);
      } else {
        const piece = game.get(clickedSquare);
        if (piece) {
          setSelectedSquare(clickedSquare);
        } else {
          setSelectedSquare(null);
        }
      }
    },
    [game, selectedSquare]
  );

  // Save review
  const saveReview = useCallback(
    async (decision: 'approved' | 'rejected' | 'maybe') => {
      if (!currentPuzzle) return;

      const review: PuzzleReview = {
        puzzleId: currentPuzzle.puzzleId,
        decision,
        assignedTheme: assignedTheme || null,
        originalThemes: currentPuzzle.themes,
        rating: currentPuzzle.rating,
        notes,
        reviewedAt: new Date().toISOString(),
      };

      try {
        await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(review),
        });

        setReviews(prev => ({ ...prev, [currentPuzzle.puzzleId]: review }));

        // Auto-advance to next puzzle
        if (currentIndex < puzzles.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      } catch (error) {
        console.error('Failed to save review:', error);
      }
    },
    [currentPuzzle, assignedTheme, notes, currentIndex, puzzles.length]
  );

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'a':
        case '1':
          saveReview('approved');
          break;
        case 'r':
        case '2':
          saveReview('rejected');
          break;
        case 'm':
        case '3':
          saveReview('maybe');
          break;
        case 'ArrowRight':
        case 'n':
          if (currentIndex < puzzles.length - 1) {
            setCurrentIndex(prev => prev + 1);
          }
          break;
        case 'ArrowLeft':
        case 'p':
          if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
          }
          break;
        case 's':
          setShowSolution(prev => !prev);
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveReview, currentIndex, puzzles.length]);

  // Get curriculum themes for assignment dropdown
  const curriculumThemes = curriculum.flatMap(lesson =>
    lesson.themes.map(t => ({ id: t.id, name: `${lesson.name} > ${t.name}` }))
  );

  const existingReview = currentPuzzle ? reviews[currentPuzzle.puzzleId] : null;

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Puzzle Review</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <select
            value={ratingBand}
            onChange={e => setRatingBand(e.target.value)}
            className="bg-[#1A2C35] border border-white/20 rounded-lg px-3 py-2"
          >
            {RATING_BANDS.map(rb => (
              <option key={rb.value} value={rb.value}>
                {rb.label}
              </option>
            ))}
          </select>

          <select
            value={lichessTheme}
            onChange={e => setLichessTheme(e.target.value)}
            className="bg-[#1A2C35] border border-white/20 rounded-lg px-3 py-2"
          >
            {LICHESS_THEMES.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div className="text-gray-400 flex items-center">
            {loading ? 'Loading...' : `${total.toLocaleString()} puzzles available`}
          </div>
        </div>

        {currentPuzzle && game && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Board */}
            <div>
              <div className="mb-2 text-sm text-gray-400">
                Puzzle {currentIndex + 1} of {puzzles.length} | {playerColor} to move
              </div>
              <div className="max-w-md">
                <Chessboard
                  options={{
                    position: game.fen(),
                    boardOrientation: playerColor,
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

              {/* Solution toggle */}
              <button
                onClick={() => setShowSolution(prev => !prev)}
                className="mt-4 px-4 py-2 bg-[#1A2C35] border border-white/20 rounded-lg text-sm"
              >
                {showSolution ? 'Hide' : 'Show'} Solution (S)
              </button>
              {showSolution && (
                <div className="mt-2 p-3 bg-[#1A2C35] rounded-lg">
                  <div className="text-sm text-gray-400">Solution:</div>
                  <div className="font-mono">{solutionSan}</div>
                </div>
              )}
            </div>

            {/* Right: Info & Controls */}
            <div className="space-y-4">
              {/* Puzzle info */}
              <div className="p-4 bg-[#1A2C35] rounded-lg space-y-2">
                <div>
                  <span className="text-gray-400">ID:</span>{' '}
                  <a
                    href={currentPuzzle.gameUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1CB0F6] hover:underline"
                  >
                    {currentPuzzle.puzzleId}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400">Rating:</span> {currentPuzzle.rating}
                </div>
                <div>
                  <span className="text-gray-400">Lichess Themes:</span>{' '}
                  <span className="text-yellow-400">{currentPuzzle.themes}</span>
                </div>
                {existingReview && (
                  <div>
                    <span className="text-gray-400">Previous Decision:</span>{' '}
                    <span
                      className={
                        existingReview.decision === 'approved'
                          ? 'text-green-400'
                          : existingReview.decision === 'rejected'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }
                    >
                      {existingReview.decision}
                    </span>
                  </div>
                )}
              </div>

              {/* Assign to curriculum theme */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Assign to Curriculum Theme:
                </label>
                <select
                  value={assignedTheme}
                  onChange={e => setAssignedTheme(e.target.value)}
                  className="w-full bg-[#1A2C35] border border-white/20 rounded-lg px-3 py-2"
                >
                  <option value="">-- Select Theme --</option>
                  {curriculumThemes.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes:</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Why is this a good/bad puzzle for learning?"
                  className="w-full bg-[#1A2C35] border border-white/20 rounded-lg px-3 py-2 h-24"
                />
              </div>

              {/* Decision buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => saveReview('approved')}
                  className="flex-1 py-3 bg-[#58CC02] hover:bg-[#4CAD02] text-white font-bold rounded-lg transition-colors"
                >
                  Approve (A)
                </button>
                <button
                  onClick={() => saveReview('rejected')}
                  className="flex-1 py-3 bg-[#FF4B4B] hover:bg-[#E04040] text-white font-bold rounded-lg transition-colors"
                >
                  Reject (R)
                </button>
                <button
                  onClick={() => saveReview('maybe')}
                  className="flex-1 py-3 bg-[#FFC800] hover:bg-[#E0B000] text-black font-bold rounded-lg transition-colors"
                >
                  Maybe (M)
                </button>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex-1 py-2 bg-[#1A2C35] border border-white/20 rounded-lg disabled:opacity-50"
                >
                  Previous (P)
                </button>
                <button
                  onClick={() => setCurrentIndex(prev => Math.min(puzzles.length - 1, prev + 1))}
                  disabled={currentIndex >= puzzles.length - 1}
                  className="flex-1 py-2 bg-[#1A2C35] border border-white/20 rounded-lg disabled:opacity-50"
                >
                  Next (N)
                </button>
              </div>

              {/* Keyboard shortcuts help */}
              <div className="text-xs text-gray-500 p-3 bg-[#1A2C35]/50 rounded-lg">
                <div className="font-semibold mb-1">Keyboard Shortcuts:</div>
                <div>A/1 = Approve | R/2 = Reject | M/3 = Maybe</div>
                <div>N/Arrow Right = Next | P/Arrow Left = Previous</div>
                <div>S = Toggle Solution</div>
              </div>

              {/* Stats */}
              <div className="text-sm text-gray-400">
                Reviewed: {Object.keys(reviews).length} total |{' '}
                {Object.values(reviews).filter(r => r.decision === 'approved').length} approved |{' '}
                {Object.values(reviews).filter(r => r.decision === 'rejected').length} rejected
              </div>
            </div>
          </div>
        )}

        {!currentPuzzle && !loading && (
          <div className="text-center text-gray-400 py-12">
            No puzzles found for this filter combination.
          </div>
        )}
      </div>
    </div>
  );
}
