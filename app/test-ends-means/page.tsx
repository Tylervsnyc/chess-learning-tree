'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { level1v2, Module, LessonCriteria } from '@/data/staging/level1-curriculum-v2';
import {
  playCorrectSound,
  playErrorSound,
  playMoveSound,
  playCaptureSound,
} from '@/lib/sounds';
import { normalizeMove } from '@/lib/puzzle-utils';

// CSS for rotating border animation
const rotatingBorderStyles = `
  @keyframes rotateBorder {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .rotating-border {
    position: relative;
    background: linear-gradient(90deg, #10b981, #3b82f6, #a855f7, #10b981);
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

// Theme type colors
const TYPE_COLORS = {
  end: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', label: 'GOAL', accent: '#10b981' },
  means: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', label: 'TOOL', accent: '#a855f7' },
  mixed: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', label: 'REVIEW', accent: '#3b82f6' },
};

export default function TestEndsMeansPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get('lesson');

  if (lessonId) {
    return <LessonPuzzleView lessonId={lessonId} onBack={() => router.push('/test-ends-means')} />;
  }

  return <CurriculumOverview />;
}

// Curriculum Overview
function CurriculumOverview() {
  const router = useRouter();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<string>('1.1.1');

  // Load current lesson from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('test-curriculum-current-lesson');
    if (saved) setCurrentLesson(saved);
  }, []);

  // Get all lesson IDs in order
  const allLessonIds = useMemo(() => {
    return level1v2.modules.flatMap(m => m.lessons.map(l => l.id));
  }, []);

  const currentLessonIndex = allLessonIds.indexOf(currentLesson);

  const endModules = level1v2.modules.filter(m => m.themeType === 'end');
  const meansModules = level1v2.modules.filter(m => m.themeType === 'means');
  const mixedModules = level1v2.modules.filter(m => m.themeType === 'mixed');
  const totalLessons = level1v2.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  const handleSelectLesson = (lessonId: string) => {
    localStorage.setItem('test-curriculum-current-lesson', lessonId);
    setCurrentLesson(lessonId);
    router.push(`/test-ends-means?lesson=${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-[#0A1214] text-white">
      <style>{rotatingBorderStyles}</style>
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0D1A1F]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Level 1: ENDS → MEANS Framework</h1>
              <p className="text-white/50 text-sm mt-1">
                {level1v2.modules.length} modules, {totalLessons} lessons • All unlocked for testing
              </p>
            </div>
            <button
              onClick={() => router.push('/test-theme-connections')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
            >
              Theme Constellation →
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Framework explanation */}
        <div className="mb-8 p-4 bg-[#1A2C35] rounded-xl border border-white/10">
          <h2 className="font-bold text-lg mb-2">The Teaching Order</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <div className="font-bold text-emerald-400 mb-1">Phase 1: GOALS (Ends)</div>
              <p className="text-white/60">"Here's WHAT you're trying to achieve" — checkmates, forks, skewers</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
              <div className="font-bold text-purple-400 mb-1">Phase 2: TOOLS (Means)</div>
              <p className="text-white/60">"Here's HOW to achieve it" — sacrifice, deflection, attraction</p>
            </div>
          </div>
          <p className="mt-3 text-white/40 text-sm">
            Students learn ENDS first, so when they see MEANS, they think: "OH, that's how I GET the fork I already know!"
          </p>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-6">
          {Object.entries(TYPE_COLORS).map(([type, style]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${style.bg} ${style.border} border`} />
              <span className="text-sm text-white/60">{style.label}</span>
            </div>
          ))}
        </div>

        {/* Phase 1: ENDS */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 bg-emerald-500 rounded-full" />
            <h2 className="text-xl font-bold text-emerald-400">Phase 1: Learn the GOALS</h2>
          </div>
          <div className="space-y-3">
            {endModules.map(mod => (
              <ModuleCard
                key={mod.id}
                module={mod}
                expanded={expandedModule === mod.id}
                onToggle={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                onSelectLesson={handleSelectLesson}
                currentLesson={currentLesson}
                allLessonIds={allLessonIds}
              />
            ))}
          </div>
        </section>

        {/* Checkpoint */}
        {mixedModules.filter(m => m.id.includes('checkpoint')).length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-1 bg-blue-500 rounded-full" />
              <h2 className="text-xl font-bold text-blue-400">Checkpoint</h2>
            </div>
            <div className="space-y-3">
              {mixedModules.filter(m => m.id.includes('checkpoint')).map(mod => (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  expanded={expandedModule === mod.id}
                  onToggle={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                  onSelectLesson={handleSelectLesson}
                  currentLesson={currentLesson}
                  allLessonIds={allLessonIds}
                />
              ))}
            </div>
          </section>
        )}

        {/* Phase 2: MEANS */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 bg-purple-500 rounded-full" />
            <h2 className="text-xl font-bold text-purple-400">Phase 2: Learn the TOOLS</h2>
          </div>
          <div className="space-y-3">
            {meansModules.map(mod => (
              <ModuleCard
                key={mod.id}
                module={mod}
                expanded={expandedModule === mod.id}
                onToggle={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                onSelectLesson={handleSelectLesson}
                currentLesson={currentLesson}
                allLessonIds={allLessonIds}
              />
            ))}
          </div>
        </section>

        {/* Final */}
        {mixedModules.filter(m => m.id.includes('final')).length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-1 bg-blue-500 rounded-full" />
              <h2 className="text-xl font-bold text-blue-400">Final Review</h2>
            </div>
            <div className="space-y-3">
              {mixedModules.filter(m => m.id.includes('final')).map(mod => (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  expanded={expandedModule === mod.id}
                  onToggle={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                  onSelectLesson={handleSelectLesson}
                  currentLesson={currentLesson}
                  allLessonIds={allLessonIds}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Module Card
function ModuleCard({
  module,
  expanded,
  onToggle,
  onSelectLesson,
  currentLesson,
  allLessonIds,
}: {
  module: Module;
  expanded: boolean;
  onToggle: () => void;
  onSelectLesson: (lessonId: string) => void;
  currentLesson: string;
  allLessonIds: string[];
}) {
  const typeStyle = TYPE_COLORS[module.themeType];
  const currentLessonIndex = allLessonIds.indexOf(currentLesson);
  const moduleContainsCurrent = module.lessons.some(l => l.id === currentLesson);

  return (
    <div className={`rounded-xl border ${typeStyle.border} overflow-hidden transition-all ${expanded ? typeStyle.bg : 'bg-[#1A2C35]/50'}`}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${typeStyle.text} border ${typeStyle.border}`} style={{ backgroundColor: `${typeStyle.accent}20` }}>
            {typeStyle.label}
          </span>
          <div className="text-left">
            <h3 className="font-semibold">{module.name}</h3>
            <p className="text-sm text-white/40">{module.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/30">{module.lessons.length}</span>
          <svg className={`w-5 h-5 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/10">
          {module.lessons.map((lesson) => {
            const lessonIndex = allLessonIds.indexOf(lesson.id);
            const isCurrent = lesson.id === currentLesson;
            const isCompleted = lessonIndex < currentLessonIndex;
            const isUpcoming = lessonIndex > currentLessonIndex;

            return (
              <div key={lesson.id} className={isCurrent ? 'rotating-border m-1' : ''}>
                <button
                  onClick={() => onSelectLesson(lesson.id)}
                  className={`w-full px-4 py-3 flex items-center justify-between transition-colors text-left ${
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
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {lesson.requiredTags.length > 0 ? (
                        lesson.requiredTags.map(tag => (
                          <span key={tag} className={`text-xs px-1.5 py-0.5 rounded ${isUpcoming ? 'bg-white/5 text-white/40' : 'bg-white/10 text-white/60'}`}>
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${isUpcoming ? 'bg-blue-500/10 text-blue-400/60' : 'bg-blue-500/20 text-blue-400'}`}>
                          mixed practice
                        </span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded ${isUpcoming ? 'bg-white/5 text-white/30' : 'bg-white/5 text-white/40'}`}>
                        {lesson.ratingMin}-{lesson.ratingMax}
                      </span>
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

  // Find lesson
  const lessonData = useMemo(() => {
    for (const mod of level1v2.modules) {
      const found = mod.lessons.find(l => l.id === lessonId);
      if (found) return { lesson: found, module: mod };
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

  const typeStyle = lessonData ? TYPE_COLORS[lessonData.module.themeType] : TYPE_COLORS.mixed;

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
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${typeStyle.text} border ${typeStyle.border}`} style={{ backgroundColor: `${typeStyle.accent}20` }}>
                {typeStyle.label}
              </span>
              <span className="font-medium text-sm">{lessonData?.lesson.name}</span>
            </div>
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
                  <strong>What you achieved (END):</strong> {currentPuzzle.themes.filter(t => ['mateIn1', 'mateIn2', 'mateIn3', 'fork', 'skewer', 'promotion', 'hangingPiece'].includes(t)).join(', ') || 'Checkmate/Material'}
                </p>
                <p className="text-white/40 text-sm">
                  <strong>How (MEANS):</strong> {currentPuzzle.themes.filter(t => ['sacrifice', 'deflection', 'attraction', 'clearance', 'quietMove'].includes(t)).join(', ') || 'Direct play'}
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
                  <strong>Themes:</strong> {currentPuzzle.themes.join(', ')}
                </p>
                <p className="text-white/30 text-xs mt-1">
                  Setup: {currentPuzzle.setupMove} • Solution: {currentPuzzle.solutionMoves.join(' ')}
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
              ✓ Good
            </button>
            <button onClick={() => { console.log('BAD:', currentPuzzle.puzzleId, currentPuzzle.themes); goToNext(); }} className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-colors">
              ✗ Bad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
