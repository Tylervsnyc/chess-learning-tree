'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { level1Ends, Block, Section, LessonCriteria } from '@/data/staging/level1-ends-only';
import {
  playCorrectSound,
  playErrorSound,
  playMoveSound,
  playCaptureSound,
} from '@/lib/sounds';

// CSS for rotating border animation
const rotatingBorderStyles = `
  @keyframes rotateBorder {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .rotating-border {
    position: relative;
    background: linear-gradient(90deg, #10b981, #3b82f6, #f59e0b, #10b981);
    background-size: 300% 100%;
    animation: rotateBorder 3s linear infinite;
    padding: 2px;
    border-radius: 12px;
  }

  .rotating-border-inner {
    background: #1A2C35;
    border-radius: 10px;
    width: 100%;
    height: 100%;
  }
`;

// Types
interface LessonPuzzle {
  puzzleId: string;
  fen: string;
  puzzleFen: string;
  moves: string;
  rating: number;
  themes: string[];
  url: string;
  setupMove: string;
  lastMoveFrom: string;
  lastMoveTo: string;
  solution: string;
  solutionMoves: string[];
  playerColor: 'white' | 'black';
}

// Block colors
const BLOCK_COLORS = [
  { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', accent: '#ef4444' },
  { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', accent: '#f59e0b' },
  { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', accent: '#10b981' },
  { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', accent: '#3b82f6' },
];

export default function TestLevel1EndsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get('lesson');

  if (lessonId) {
    return <LessonPuzzleView lessonId={lessonId} onBack={() => router.push('/test-level1-ends')} />;
  }

  return <CurriculumOverview />;
}

// Curriculum Overview
function CurriculumOverview() {
  const router = useRouter();
  const [expandedBlock, setExpandedBlock] = useState<string | null>('block-1');
  const [currentLesson, setCurrentLesson] = useState<string>('1.1.1');

  // Load current lesson from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('test-level1-ends-current');
    if (saved) setCurrentLesson(saved);
  }, []);

  // Get all lesson IDs in order
  const allLessonIds = useMemo(() => {
    return level1Ends.blocks.flatMap(b => b.sections.flatMap(s => s.lessons.map(l => l.id)));
  }, []);

  const currentLessonIndex = allLessonIds.indexOf(currentLesson);

  const handleSelectLesson = (lessonId: string) => {
    localStorage.setItem('test-level1-ends-current', lessonId);
    setCurrentLesson(lessonId);
    router.push(`/test-level1-ends?lesson=${lessonId}`);
  };

  const stats = useMemo(() => {
    const sections = level1Ends.blocks.flatMap(b => b.sections);
    const lessons = sections.flatMap(s => s.lessons);
    return {
      blocks: level1Ends.blocks.length,
      sections: sections.length,
      lessons: lessons.length,
      puzzles: lessons.length * 6,
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A1214] text-white">
      <style>{rotatingBorderStyles}</style>

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0D1A1F]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Level 1: Pattern Spotter</h1>
              <p className="text-white/50 text-sm mt-1">
                {stats.blocks} blocks, {stats.sections} sections, {stats.lessons} lessons ({stats.puzzles} puzzles)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-400 text-sm font-medium">
                ENDS ONLY
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Philosophy banner */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-white/10">
          <p className="text-white/70 text-sm">
            <span className="font-bold text-white">Level 1 Philosophy:</span> Learn to RECOGNIZE tactical patterns.
            See the checkmate. Spot the fork. Find the pin. Pure pattern recognition - no fancy setup moves yet.
          </p>
        </div>
      </div>

      {/* Blocks */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="space-y-4">
          {level1Ends.blocks.map((block, blockIndex) => (
            <BlockCard
              key={block.id}
              block={block}
              blockIndex={blockIndex}
              expanded={expandedBlock === block.id}
              onToggle={() => setExpandedBlock(expandedBlock === block.id ? null : block.id)}
              onSelectLesson={handleSelectLesson}
              currentLesson={currentLesson}
              allLessonIds={allLessonIds}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Block Card
function BlockCard({
  block,
  blockIndex,
  expanded,
  onToggle,
  onSelectLesson,
  currentLesson,
  allLessonIds,
}: {
  block: Block;
  blockIndex: number;
  expanded: boolean;
  onToggle: () => void;
  onSelectLesson: (lessonId: string) => void;
  currentLesson: string;
  allLessonIds: string[];
}) {
  const colors = BLOCK_COLORS[blockIndex % BLOCK_COLORS.length];
  const currentLessonIndex = allLessonIds.indexOf(currentLesson);
  const lessonCount = block.sections.reduce((sum, s) => sum + s.lessons.length, 0);

  // Check if block contains current lesson
  const blockContainsCurrent = block.sections.some(s => s.lessons.some(l => l.id === currentLesson));

  return (
    <div className={`rounded-xl border ${colors.border} overflow-hidden transition-all ${expanded ? colors.bg : 'bg-[#1A2C35]/50'}`}>
      {/* Block Header */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center`}>
            <span className={`font-bold ${colors.text}`}>{blockIndex + 1}</span>
          </div>
          <div className="text-left">
            <h2 className="font-bold text-lg">{block.name}</h2>
            <p className="text-sm text-white/50">{block.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/30">{lessonCount} lessons</span>
          <svg className={`w-5 h-5 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Sections */}
      {expanded && (
        <div className="border-t border-white/10">
          {block.sections.map((section, sectionIndex) => (
            <SectionCard
              key={section.id}
              section={section}
              sectionIndex={sectionIndex}
              blockColors={colors}
              onSelectLesson={onSelectLesson}
              currentLesson={currentLesson}
              allLessonIds={allLessonIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Section Card
function SectionCard({
  section,
  sectionIndex,
  blockColors,
  onSelectLesson,
  currentLesson,
  allLessonIds,
}: {
  section: Section;
  sectionIndex: number;
  blockColors: typeof BLOCK_COLORS[0];
  onSelectLesson: (lessonId: string) => void;
  currentLesson: string;
  allLessonIds: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const currentLessonIndex = allLessonIds.indexOf(currentLesson);
  const sectionContainsCurrent = section.lessons.some(l => l.id === currentLesson);

  // Auto-expand if contains current lesson
  useEffect(() => {
    if (sectionContainsCurrent) setExpanded(true);
  }, [sectionContainsCurrent]);

  return (
    <div className={`border-b border-white/5 last:border-b-0 ${section.isReview ? 'bg-white/5' : ''}`}>
      {/* Section Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {section.isReview ? (
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/50">
              REVIEW
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/10 text-white/60">
              {sectionIndex + 1}
            </span>
          )}
          <span className="font-medium">{section.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30">{section.lessons.length}</span>
          <svg className={`w-4 h-4 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Lessons */}
      {expanded && (
        <div className="px-5 pb-3">
          {section.lessons.map((lesson) => {
            const lessonIndex = allLessonIds.indexOf(lesson.id);
            const isCurrent = lesson.id === currentLesson;
            const isCompleted = lessonIndex < currentLessonIndex;
            const isUpcoming = lessonIndex > currentLessonIndex;

            return (
              <div key={lesson.id} className={isCurrent ? 'rotating-border my-1' : 'my-1'}>
                <button
                  onClick={() => onSelectLesson(lesson.id)}
                  className={`w-full px-4 py-2.5 rounded-lg flex items-center justify-between transition-colors text-left ${
                    isCurrent
                      ? 'rotating-border-inner'
                      : isCompleted
                      ? 'bg-white/5 hover:bg-white/10'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${isUpcoming ? 'text-white/60' : 'text-white'}`}>
                      {lesson.name}
                      {isCurrent && <span className="ml-2 text-xs text-emerald-400">← Current</span>}
                      {isCompleted && <span className="ml-2 text-xs text-white/40">✓</span>}
                    </div>
                    <div className={`text-xs mt-0.5 ${isUpcoming ? 'text-white/30' : 'text-white/50'}`}>
                      {lesson.description}
                    </div>
                  </div>
                  <svg className={`w-4 h-4 ${isUpcoming ? 'text-white/20' : 'text-white/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Lesson Puzzle View
function LessonPuzzleView({ lessonId, onBack }: { lessonId: string; onBack: () => void }) {
  const [puzzles, setPuzzles] = useState<LessonPuzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFen, setCurrentFen] = useState<string | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveStatus, setMoveStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Find lesson info
  const lessonData = useMemo(() => {
    for (const block of level1Ends.blocks) {
      for (const section of block.sections) {
        const found = section.lessons.find(l => l.id === lessonId);
        if (found) return { lesson: found, section, block };
      }
    }
    return null;
  }, [lessonId]);

  // Load puzzles
  useEffect(() => {
    async function loadPuzzles() {
      setLoading(true);
      setError(null);

      if (!lessonData) {
        setError('Lesson not found');
        setLoading(false);
        return;
      }

      try {
        // Build query params from lesson criteria
        const params = new URLSearchParams({
          count: '6',
          ratingMin: lessonData.lesson.ratingMin.toString(),
          ratingMax: lessonData.lesson.ratingMax.toString(),
        });

        if (lessonData.lesson.requiredTags.length > 0) {
          params.set('themes', lessonData.lesson.requiredTags.join(','));
        }
        if (lessonData.lesson.excludeTags && lessonData.lesson.excludeTags.length > 0) {
          params.set('excludeThemes', lessonData.lesson.excludeTags.join(','));
        }
        if (lessonData.lesson.pieceFilter) {
          params.set('pieceFilter', lessonData.lesson.pieceFilter);
        }
        if (lessonData.lesson.isMixedPractice && lessonData.lesson.mixedThemes) {
          params.set('mixedThemes', lessonData.lesson.mixedThemes.join(','));
        }

        const res = await fetch(`/api/lesson-puzzles?lessonId=${lessonId}&count=6&curriculumVersion=v2`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
        } else if (data.puzzles && data.puzzles.length > 0) {
          setPuzzles(data.puzzles);
        } else {
          setError('No puzzles found matching criteria');
        }
      } catch (err) {
        setError('Failed to load puzzles');
        console.error(err);
      }
      setLoading(false);
    }
    loadPuzzles();
  }, [lessonId, lessonData]);

  const currentPuzzle = puzzles[currentIndex];

  // Reset on puzzle change
  useEffect(() => {
    if (currentPuzzle) {
      setCurrentFen(currentPuzzle.puzzleFen);
      setMoveIndex(0);
      setMoveStatus('playing');
      setSelectedSquare(null);
    }
  }, [currentPuzzle]);

  // Chess game
  const game = useMemo(() => {
    const fen = currentFen || currentPuzzle?.puzzleFen;
    if (!fen) return null;
    try {
      return new Chess(fen);
    } catch {
      return null;
    }
  }, [currentFen, currentPuzzle]);

  // Square styles
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    if (currentPuzzle && moveIndex === 0) {
      styles[currentPuzzle.lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
      styles[currentPuzzle.lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
    }

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
  }, [selectedSquare, game, currentPuzzle, moveIndex]);

  // Try move
  const tryMove = useCallback((from: Square, to: Square) => {
    if (!game || !currentPuzzle || moveStatus !== 'playing') return false;
    if (moveIndex >= currentPuzzle.solutionMoves.length) return false;

    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (!move) return false;

      const expectedMove = currentPuzzle.solutionMoves[moveIndex];
      const normalizeMove = (m: string) => m.replace(/[+#]$/, '');

      if (normalizeMove(move.san) === normalizeMove(expectedMove)) {
        setCurrentFen(gameCopy.fen());
        setSelectedSquare(null);
        if (move.captured) playCaptureSound(); else playMoveSound();

        const nextMoveIndex = moveIndex + 1;
        setMoveIndex(nextMoveIndex);

        if (nextMoveIndex >= currentPuzzle.solutionMoves.length) {
          setMoveStatus('correct');
          playCorrectSound(currentIndex);
          return true;
        }

        setTimeout(() => {
          const opponentGame = new Chess(gameCopy.fen());
          const opponentMove = currentPuzzle.solutionMoves[nextMoveIndex];
          try {
            const oppMove = opponentGame.move(opponentMove);
            setCurrentFen(opponentGame.fen());
            setMoveIndex(nextMoveIndex + 1);
            if (oppMove?.captured) playCaptureSound(); else playMoveSound();

            if (nextMoveIndex + 1 >= currentPuzzle.solutionMoves.length) {
              setMoveStatus('correct');
              playCorrectSound(currentIndex);
            }
          } catch {
            setMoveStatus('correct');
            playCorrectSound(currentIndex);
          }
        }, 400);

        return true;
      } else {
        if (currentPuzzle.themes.some(t => t.toLowerCase().includes('mate')) && gameCopy.isCheckmate()) {
          setCurrentFen(gameCopy.fen());
          setSelectedSquare(null);
          if (move.captured) playCaptureSound(); else playMoveSound();
          setMoveStatus('correct');
          playCorrectSound(currentIndex);
          return true;
        }

        setSelectedSquare(null);
        playErrorSound();
        setMoveStatus('wrong');
        return false;
      }
    } catch {
      return false;
    }
  }, [game, currentPuzzle, moveIndex, moveStatus, currentIndex]);

  // Square click
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

  const goToNext = () => currentIndex < puzzles.length - 1 && setCurrentIndex(currentIndex + 1);
  const goToPrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);
  const retry = () => {
    if (currentPuzzle) {
      setCurrentFen(currentPuzzle.puzzleFen);
      setMoveIndex(0);
      setMoveStatus('playing');
      setSelectedSquare(null);
    }
  };

  const blockIndex = lessonData ? level1Ends.blocks.indexOf(lessonData.block) : 0;
  const colors = BLOCK_COLORS[blockIndex % BLOCK_COLORS.length];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131F24] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-white/50">Loading puzzles...</p>
        </div>
      </div>
    );
  }

  if (error || !currentPuzzle) {
    return (
      <div className="min-h-screen bg-[#131F24] text-white flex flex-col">
        <header className="border-b border-white/10 px-4 py-3">
          <button onClick={onBack} className="text-white/60 hover:text-white">← Back</button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <p className="text-xl text-white/50 mb-2">No puzzles found</p>
            <p className="text-sm text-white/30">{error}</p>
            {lessonData && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg text-left text-sm">
                <p className="text-white/50"><strong>Criteria:</strong></p>
                <p className="text-white/30">Tags: {lessonData.lesson.requiredTags.join(', ') || 'mixed'}</p>
                <p className="text-white/30">Rating: {lessonData.lesson.ratingMin}-{lessonData.lesson.ratingMax}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131F24] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#1A2C35] px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={onBack} className="text-white/60 hover:text-white text-sm">← Back</button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${colors.text} border ${colors.border}`} style={{ backgroundColor: `${colors.accent}20` }}>
                {lessonData?.block.name}
              </span>
            </div>
            <span className="font-medium text-sm">{lessonData?.lesson.name}</span>
          </div>
          <div className="text-white/40 text-sm">{currentIndex + 1}/{puzzles.length}</div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center px-4 py-4">
        <div className="w-full max-w-lg">
          {/* Info bar */}
          <div className="flex items-center justify-between mb-3">
            <span className={`font-bold ${currentPuzzle.playerColor === 'white' ? 'text-white' : 'text-gray-300'}`}>
              {currentPuzzle.playerColor === 'white' ? 'White' : 'Black'} to move
            </span>
            <a
              href={`https://lichess.org/training/${currentPuzzle.puzzleId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:underline"
            >
              {currentPuzzle.puzzleId} ({currentPuzzle.rating})
            </a>
          </div>

          {/* Board */}
          <Chessboard
            options={{
              position: currentFen || currentPuzzle.puzzleFen,
              boardOrientation: currentPuzzle.playerColor,
              onSquareClick: onSquareClick,
              squareStyles: squareStyles,
              boardStyle: { borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' },
              darkSquareStyle: { backgroundColor: '#779952' },
              lightSquareStyle: { backgroundColor: '#edeed1' },
            }}
          />

          {/* Status */}
          <div className="mt-4">
            {moveStatus === 'correct' && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-400 font-bold">Correct!</p>
                <p className="text-white/50 text-sm mt-1">
                  <strong>Pattern:</strong> {currentPuzzle.themes.join(', ')}
                </p>
              </div>
            )}
            {moveStatus === 'wrong' && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 font-bold">Not quite</p>
                <p className="text-white/50 text-sm mt-1">Expected: {currentPuzzle.solutionMoves[moveIndex]}</p>
              </div>
            )}
            {moveStatus === 'playing' && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-white/50 text-sm">
                  <strong>Find the pattern:</strong> {currentPuzzle.themes.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-4">
            <button onClick={goToPrev} disabled={currentIndex === 0} className="flex-1 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg transition-colors">← Prev</button>
            <button onClick={retry} className="flex-1 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors">Retry</button>
            <button onClick={goToNext} disabled={currentIndex === puzzles.length - 1} className="flex-1 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg transition-colors">Next →</button>
          </div>

          {/* Quick rating */}
          <div className="flex gap-3 mt-3">
            <button onClick={() => { console.log('GOOD:', currentPuzzle.puzzleId, currentPuzzle.themes); goToNext(); }} className="flex-1 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold rounded-lg transition-colors">
              Good Puzzle
            </button>
            <button onClick={() => { console.log('BAD:', currentPuzzle.puzzleId, currentPuzzle.themes); goToNext(); }} className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-colors">
              Bad Puzzle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
