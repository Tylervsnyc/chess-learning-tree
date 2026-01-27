'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import {
  playCorrectSound,
  playErrorSound,
  playCelebrationSound,
  playMoveSound,
  playCaptureSound,
} from '@/lib/sounds';
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup';
import { IntroPopup } from '@/components/puzzle/IntroPopup';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';
import { getV2Response, getSectionFromLessonId } from '@/data/staging/v2-puzzle-responses';
import { level1V2, getLessonById, getIntroMessages, IntroMessages } from '@/data/staging/level1-v2-curriculum';
import { level2V2, getLessonByIdL2 } from '@/data/staging/level2-v2-curriculum';
import { level3V2, getLessonByIdL3 } from '@/data/staging/level3-v2-curriculum';
import { useLessonProgress } from '@/hooks/useProgress';
import confetti from 'canvas-confetti';

interface Puzzle {
  id: string;
  fen: string;
  moves: string[];
  rating: number;
  theme: string;
  themes: string[];
  url: string;
}

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

type PuzzleResult = 'pending' | 'correct' | 'wrong';

// Get lesson from any level
function getLessonFromAnyLevel(lessonId: string) {
  let lesson = getLessonById(lessonId);
  if (lesson) return { lesson, level: 1 };

  lesson = getLessonByIdL2(lessonId);
  if (lesson) return { lesson, level: 2 };

  lesson = getLessonByIdL3(lessonId);
  if (lesson) return { lesson, level: 3 };

  return null;
}

// Parse UCI move (e.g., "e2e4" or "e7e8q")
function parseUciMove(uci: string): { from: string; to: string; promotion?: string } {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.length > 4 ? uci[4] : undefined;
  return { from, to, promotion };
}

// Transform API puzzle to lesson puzzle format
function transformPuzzle(puzzle: Puzzle): LessonPuzzle {
  const chess = new Chess(puzzle.fen);

  const setupMove = puzzle.moves[0];
  const solutionMoves = puzzle.moves.slice(1);
  const { from, to, promotion } = parseUciMove(setupMove);

  try {
    chess.move({ from, to, promotion });
  } catch (e) {
    console.error('Invalid setup move:', setupMove, 'for FEN:', puzzle.fen);
  }

  const puzzleFen = chess.fen();
  const playerColor = chess.turn() === 'w' ? 'white' : 'black';

  // Convert UCI moves to SAN for solutionMoves
  const sanMoves: string[] = [];
  const tempChess = new Chess(puzzleFen);
  for (const uciMove of solutionMoves) {
    const { from: f, to: t, promotion: p } = parseUciMove(uciMove);
    try {
      const move = tempChess.move({ from: f, to: t, promotion: p });
      if (move) {
        sanMoves.push(move.san);
      }
    } catch {
      sanMoves.push(uciMove);
    }
  }

  return {
    puzzleId: puzzle.id,
    fen: puzzle.fen,
    puzzleFen,
    moves: puzzle.moves.join(' '),
    rating: puzzle.rating,
    themes: puzzle.themes,
    url: puzzle.url,
    setupMove,
    lastMoveFrom: from,
    lastMoveTo: to,
    solution: solutionMoves.join(' '),
    solutionMoves: sanMoves,
    playerColor,
  };
}

export default function StagingLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;

  // Progress tracking (Supabase + localStorage)
  const { completeLesson, recordPuzzleAttempt } = useLessonProgress();

  // Lesson state
  const [lessonName, setLessonName] = useState('');
  const [puzzles, setPuzzles] = useState<LessonPuzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState(1);

  // Progress state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Record<string, PuzzleResult>>({});
  const [firstAttemptResults, setFirstAttemptResults] = useState<Record<string, PuzzleResult>>({});
  const [retryQueue, setRetryQueue] = useState<LessonPuzzle[]>([]);
  const [inRetryMode, setInRetryMode] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  // Puzzle interaction state
  const [currentFen, setCurrentFen] = useState<string | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveStatus, setMoveStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Streak tracking
  const [streak, setStreak] = useState(0);
  const [hadWrongAnswer, setHadWrongAnswer] = useState(false);
  const [completedPuzzleCount, setCompletedPuzzleCount] = useState(0);

  // Feedback
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Duolingo-style wrong answer flow
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showMoveHint, setShowMoveHint] = useState(false);
  const [hintSquares, setHintSquares] = useState<{ from: Square; to: Square } | null>(null);
  const [puzzleHadWrongAttempt, setPuzzleHadWrongAttempt] = useState(false);

  // Intro popup state
  type IntroState = 'block' | 'theme' | 'playing';
  const [introState, setIntroState] = useState<IntroState>('playing');
  const [introMessages, setIntroMessages] = useState<IntroMessages>({});

  // Current puzzle
  const currentPuzzle = inRetryMode
    ? retryQueue[currentIndex]
    : puzzles[currentIndex];

  const totalPuzzles = inRetryMode ? retryQueue.length : puzzles.length;

  // Fetch lesson data and puzzles
  useEffect(() => {
    async function loadLesson() {
      setLoading(true);
      setError(null);

      const result = getLessonFromAnyLevel(lessonId);
      if (!result) {
        setError(`Lesson ${lessonId} not found`);
        setLoading(false);
        return;
      }

      const { lesson, level: lessonLevel } = result;
      setLessonName(lesson.name);
      setLevel(lessonLevel);

      const themes = lesson.isMixedPractice
        ? lesson.mixedThemes?.join(',') || ''
        : lesson.requiredTags.join(',');

      if (!themes) {
        setError('No themes defined for this lesson');
        setLoading(false);
        return;
      }

      const queryParams = new URLSearchParams({
        themes,
        mixed: lesson.isMixedPractice ? 'true' : 'false',
        ratingMin: lesson.ratingMin.toString(),
        ratingMax: lesson.ratingMax.toString(),
        minPlays: (lesson.minPlays || 1000).toString(),
      });

      if (lesson.pieceFilter) {
        queryParams.set('pieceFilter', lesson.pieceFilter);
      }

      if (lesson.excludeTags?.length) {
        queryParams.set('excludeThemes', lesson.excludeTags.join(','));
      }

      try {
        const response = await fetch(`/api/puzzles/lesson?${queryParams}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to load puzzles');
          setLoading(false);
          return;
        }

        if (!data.puzzles || data.puzzles.length === 0) {
          setError('No puzzles found for this lesson criteria');
          setLoading(false);
          return;
        }

        const transformedPuzzles = data.puzzles.map(transformPuzzle);
        setPuzzles(transformedPuzzles);
        setCurrentFen(transformedPuzzles[0].puzzleFen);

        // Initialize results
        const initialResults: Record<string, PuzzleResult> = {};
        transformedPuzzles.forEach((p: LessonPuzzle) => {
          initialResults[p.puzzleId] = 'pending';
        });
        setResults(initialResults);

        setLoading(false);
      } catch (e) {
        console.error('Error loading puzzles:', e);
        setError('Failed to load puzzles');
        setLoading(false);
      }
    }

    loadLesson();
  }, [lessonId]);

  // Load intro messages from v2 curriculum
  useEffect(() => {
    const messages = getIntroMessages(lessonId);
    setIntroMessages(messages);

    // Determine initial intro state
    if (messages.blockIntro) {
      setIntroState('block');
    } else if (messages.themeIntro) {
      setIntroState('theme');
    } else {
      setIntroState('playing');
    }
  }, [lessonId]);

  // Handle dismissing intro popups
  const handleIntroDismiss = useCallback(() => {
    if (introState === 'block') {
      // If there's a theme intro, show it next
      if (introMessages.themeIntro) {
        setIntroState('theme');
      } else {
        setIntroState('playing');
      }
    } else if (introState === 'theme') {
      setIntroState('playing');
    }
  }, [introState, introMessages]);

  // Reset puzzle state when current puzzle changes
  useEffect(() => {
    if (currentPuzzle) {
      setCurrentFen(currentPuzzle.puzzleFen);
      setMoveIndex(0);
      setMoveStatus('playing');
      setSelectedSquare(null);
      setWrongAttempts(0);
      setShowMoveHint(false);
      setHintSquares(null);
      setPuzzleHadWrongAttempt(false);
    }
  }, [currentPuzzle, inRetryMode, currentIndex]);

  // Chess game for current position
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

    if (showMoveHint && hintSquares) {
      styles[hintSquares.from] = {
        backgroundColor: 'rgba(88, 204, 2, 0.7)',
        boxShadow: 'inset 0 0 0 3px #58CC02',
      };
      styles[hintSquares.to] = {
        backgroundColor: 'rgba(88, 204, 2, 0.5)',
        boxShadow: 'inset 0 0 0 3px #58CC02',
      };
    } else if (currentPuzzle && moveIndex === 0 && !showMoveHint) {
      styles[currentPuzzle.lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
      styles[currentPuzzle.lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
    }

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
  }, [selectedSquare, game, currentPuzzle, moveIndex, showMoveHint, hintSquares]);

  // Try to make a move
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
        // Correct move
        setCurrentFen(gameCopy.fen());
        setSelectedSquare(null);
        setShowMoveHint(false);
        setHintSquares(null);
        setWrongAttempts(0);

        if (move.captured) {
          playCaptureSound();
        } else {
          playMoveSound();
        }

        const nextMoveIndex = moveIndex + 1;
        setMoveIndex(nextMoveIndex);

        if (nextMoveIndex >= currentPuzzle.solutionMoves.length) {
          // Puzzle complete!
          const newStreak = streak + 1;
          setMoveStatus('correct');
          setFeedbackMessage(getV2Response(getSectionFromLessonId(lessonId), currentPuzzle.themes));
          playCorrectSound(completedPuzzleCount);
          setStreak(newStreak);
          setCompletedPuzzleCount(c => c + 1);
          return true;
        }

        // Auto-play opponent's response
        setTimeout(() => {
          const opponentGame = new Chess(gameCopy.fen());
          const opponentMove = currentPuzzle.solutionMoves[nextMoveIndex];
          try {
            const oppMove = opponentGame.move(opponentMove);
            setCurrentFen(opponentGame.fen());
            setMoveIndex(nextMoveIndex + 1);

            if (oppMove && oppMove.captured) {
              playCaptureSound();
            } else {
              playMoveSound();
            }

            if (nextMoveIndex + 1 >= currentPuzzle.solutionMoves.length) {
              const newStreak = streak + 1;
              setMoveStatus('correct');
              setFeedbackMessage(getV2Response(getSectionFromLessonId(lessonId), currentPuzzle.themes));
              playCorrectSound(completedPuzzleCount);
              setStreak(newStreak);
              setCompletedPuzzleCount(c => c + 1);
            }
          } catch {
            const newStreak = streak + 1;
            setMoveStatus('correct');
            setFeedbackMessage(getV2Response(getSectionFromLessonId(lessonId), currentPuzzle.themes));
            playCorrectSound(completedPuzzleCount);
            setStreak(newStreak);
            setCompletedPuzzleCount(c => c + 1);
          }
        }, 400);

        return true;
      } else {
        // Check for alternate checkmate
        const isMatingPuzzle = currentPuzzle.themes.some((t: string) =>
          t.toLowerCase().includes('mate')
        );

        if (isMatingPuzzle && gameCopy.isCheckmate()) {
          setCurrentFen(gameCopy.fen());
          setSelectedSquare(null);
          setShowMoveHint(false);
          setHintSquares(null);
          setWrongAttempts(0);
          if (move.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
          const newStreak = streak + 1;
          setMoveStatus('correct');
          setFeedbackMessage(getV2Response(getSectionFromLessonId(lessonId), currentPuzzle.themes));
          playCorrectSound(completedPuzzleCount);
          setStreak(newStreak);
          setCompletedPuzzleCount(c => c + 1);
          return true;
        }

        // Wrong move
        setSelectedSquare(null);
        playErrorSound();
        setStreak(0);
        setHadWrongAnswer(true);
        setPuzzleHadWrongAttempt(true);

        if (showMoveHint) {
          return false;
        }

        const newWrongAttempts = wrongAttempts + 1;
        setWrongAttempts(newWrongAttempts);

        if (newWrongAttempts < 3) {
          const puzzleNum = completedPuzzleCount + 1;
          setMoveStatus('wrong');
          setFeedbackMessage(`Oops, that's not correct. ${3 - newWrongAttempts} ${3 - newWrongAttempts === 1 ? 'attempt' : 'attempts'} remaining.`);
        } else {
          // Show hint after 3 wrong attempts
          try {
            if (currentFen) {
              const chess = new Chess(currentFen);
              const currentMove = currentPuzzle.solutionMoves[moveIndex];
              if (currentMove) {
                const hintMove = chess.move(currentMove);
                if (hintMove) {
                  setHintSquares({ from: hintMove.from as Square, to: hintMove.to as Square });
                  setShowMoveHint(true);
                  return false;
                }
              }
            }
          } catch {
            // Fallback
          }
          setMoveStatus('wrong');
          setFeedbackMessage("Not quite. Look for the pattern.");
        }
        return false;
      }
    } catch {
      return false;
    }
  }, [game, currentPuzzle, currentFen, moveIndex, moveStatus, streak, completedPuzzleCount, wrongAttempts, showMoveHint, lessonId]);

  // Handle square click
  const onSquareClick = useCallback(
    ({ square }: { piece: { pieceType: string } | null; square: string }) => {
      if (!game || moveStatus !== 'playing' || introState !== 'playing') return;
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
    [game, selectedSquare, moveStatus, tryMove, introState]
  );

  // Progress stats - use first attempt results for final score (declared before recordAndAdvance)
  const firstAttemptCorrectCount = Object.values(firstAttemptResults).filter(r => r === 'correct').length;

  // Record result and advance
  const recordAndAdvance = useCallback((result: 'correct' | 'wrong') => {
    if (!currentPuzzle) return;

    // Always update results for retry logic
    setResults(prev => ({ ...prev, [currentPuzzle.puzzleId]: result }));

    // Only record first attempt results during the initial pass (not retry mode)
    if (!inRetryMode) {
      setFirstAttemptResults(prev => ({ ...prev, [currentPuzzle.puzzleId]: result }));

      // Record puzzle attempt to Supabase (only on first attempt)
      recordPuzzleAttempt(currentPuzzle.puzzleId, lessonId, result === 'correct', {
        themes: currentPuzzle.themes,
        rating: currentPuzzle.rating,
        fen: currentPuzzle.puzzleFen,
        solution: currentPuzzle.solution,
      });
    }

    if (currentIndex >= totalPuzzles - 1) {
      if (inRetryMode) {
        const stillWrong = retryQueue.filter(p =>
          results[p.puzzleId] === 'wrong' || (p.puzzleId === currentPuzzle.puzzleId && result === 'wrong')
        );

        if (stillWrong.length > 0 || result === 'wrong') {
          const newRetryQueue = result === 'wrong' ? [currentPuzzle] : [];
          setRetryQueue(newRetryQueue);
          setCurrentIndex(0);

          if (newRetryQueue.length === 0) {
            setLessonComplete(true);
            playCelebrationSound(firstAttemptCorrectCount);
          }
        } else {
          setLessonComplete(true);
          playCelebrationSound(firstAttemptCorrectCount);
        }
      } else {
        const wrongPuzzles = puzzles.filter(p =>
          results[p.puzzleId] === 'wrong' || (p.puzzleId === currentPuzzle.puzzleId && result === 'wrong')
        );

        if (wrongPuzzles.length > 0 || result === 'wrong') {
          const toRetry = result === 'wrong'
            ? [...wrongPuzzles.filter(p => p.puzzleId !== currentPuzzle.puzzleId), currentPuzzle]
            : wrongPuzzles;
          setRetryQueue(toRetry);
          setInRetryMode(true);
          setCurrentIndex(0);
        } else {
          setLessonComplete(true);
          playCelebrationSound(firstAttemptCorrectCount);
        }
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentPuzzle, currentIndex, totalPuzzles, inRetryMode, retryQueue, puzzles, results, firstAttemptCorrectCount, lessonId, recordPuzzleAttempt]);

  // Handle continue
  const handleContinue = useCallback(() => {
    if (moveStatus === 'correct') {
      recordAndAdvance(puzzleHadWrongAttempt ? 'wrong' : 'correct');
    } else if (moveStatus === 'wrong') {
      recordAndAdvance('wrong');
    }
  }, [moveStatus, recordAndAdvance, puzzleHadWrongAttempt]);

  // Handle try again
  const handleTryAgain = useCallback(() => {
    setMoveStatus('playing');
    setSelectedSquare(null);
  }, []);

  // Keep these for retry logic
  const correctCount = Object.values(results).filter(r => r === 'correct').length;
  const wrongCount = Object.values(results).filter(r => r === 'wrong').length;

  // Save completion via progress hook (localStorage + Supabase for authenticated users)
  useEffect(() => {
    if (lessonComplete) {
      completeLesson(lessonId);
    }
  }, [lessonComplete, lessonId, completeLesson]);

  // Loading state
  if (loading) {
    return (
      <div className="h-screen bg-[#131F24] text-white flex flex-col overflow-hidden">
        <style>{progressBarStyles}</style>
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push(`/staging/learn?level=${level}`)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex-1 mx-4">
              <ChessProgressBar current={0} total={6} streak={0} />
            </div>
            <div className="text-gray-400">0/6</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center px-4 pt-1 overflow-hidden">
          <div className="w-full max-w-lg">
            <div className="flex items-center justify-between mb-2 h-8">
              <div className="h-5 w-24 bg-gray-700 rounded animate-pulse" />
              <div className="h-5 w-28 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="aspect-square bg-gray-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen bg-[#131F24] text-white flex flex-col overflow-hidden">
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.push(`/staging/learn?level=${level}`)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => router.push(`/staging/learn?level=${level}`)}
              className="text-[#1CB0F6] hover:underline"
            >
              ← Back to curriculum
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Lesson complete state
  if (lessonComplete) {
    const isPerfect = firstAttemptCorrectCount === puzzles.length;
    const accuracy = Math.round((firstAttemptCorrectCount / puzzles.length) * 100);

    // Confetti effect
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: isPerfect ? 100 : firstAttemptCorrectCount >= 5 ? 60 : 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: isPerfect
          ? ['#FFC800', '#FFD700', '#FFAA00', '#FFFFFF']
          : ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF'],
      });
      confetti({
        particleCount: isPerfect ? 100 : firstAttemptCorrectCount >= 5 ? 60 : 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: isPerfect
          ? ['#FFC800', '#FFD700', '#FFAA00', '#FFFFFF']
          : ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF'],
      });
    }

    return (
      <div className="min-h-screen bg-[#131F24] text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="max-w-sm w-full text-center">
            <div
              className="text-6xl font-black mb-2"
              style={{ color: isPerfect ? '#FFC800' : '#58CC02' }}
            >
              {firstAttemptCorrectCount}/{puzzles.length}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-6">
              {isPerfect ? 'Perfect!' : firstAttemptCorrectCount >= 5 ? 'Great job!' : 'Good effort!'}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#58CC02]">{firstAttemptCorrectCount}</div>
                <div className="text-sm text-gray-400">First try</div>
              </div>
              <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold" style={{ color: accuracy === 100 ? '#FFC800' : '#1CB0F6' }}>
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
            </div>

            <div className="text-gray-500 text-sm mb-6">{lessonName}</div>

            <button
              onClick={() => router.push(`/staging/learn?level=${level}`)}
              className="w-full py-4 rounded-xl font-bold text-lg text-white bg-[#58CC02] shadow-[0_4px_0_#3d8c01] active:translate-y-[2px] active:shadow-[0_2px_0_#3d8c01] transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPuzzle) {
    return (
      <div className="h-screen bg-[#131F24] text-white flex flex-col overflow-hidden">
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.push(`/staging/learn?level=${level}`)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-gray-400">No puzzles found for this lesson.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#131F24] text-white flex flex-col overflow-hidden">
      <style>{progressBarStyles}</style>
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push(`/staging/learn?level=${level}`)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>

          {/* Progress bar with streak effect */}
          <div className="flex-1 mx-4">
            <ChessProgressBar
              current={currentIndex + (moveStatus === 'correct' ? 1 : 0)}
              total={totalPuzzles}
              streak={streak}
              hadWrongAnswer={hadWrongAnswer}
            />
          </div>

          <div className="text-gray-400">
            {currentIndex + 1}/{totalPuzzles}
            {inRetryMode && <span className="text-yellow-400 ml-2">(retry)</span>}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-1 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Theme + Turn indicator */}
          <div className="flex items-center justify-between mb-2 h-8">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-gray-300">{lessonName}</h1>
              {inRetryMode && (
                <span className="text-yellow-400 text-xs">(retry)</span>
              )}
            </div>
            <span className={`text-base font-bold ${
              currentPuzzle.playerColor === 'white' ? 'text-white' : 'text-gray-300'
            }`}>
              {currentPuzzle.playerColor === 'white' ? 'White' : 'Black'} to move
            </span>
          </div>

          {/* Chessboard with intro popup overlay */}
          <div className="relative">
            <Chessboard
              options={{
                position: currentFen || currentPuzzle.puzzleFen,
                boardOrientation: currentPuzzle.playerColor,
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

            {/* Block intro popup */}
            {introState === 'block' && introMessages.blockIntro && (
              <IntroPopup
                title={introMessages.blockIntro.title}
                message={introMessages.blockIntro.message}
                onStart={handleIntroDismiss}
                buttonText="Let's Go"
              />
            )}

            {/* Theme intro popup */}
            {introState === 'theme' && introMessages.themeIntro && (
              <IntroPopup
                title={introMessages.themeIntro.title}
                message={introMessages.themeIntro.message}
                onStart={handleIntroDismiss}
                buttonText="Start"
              />
            )}
          </div>

          {/* Result popup - only show when not in intro state */}
          {moveStatus === 'correct' && introState === 'playing' && (
            <PuzzleResultPopup
              type="correct"
              message={feedbackMessage}
              onContinue={handleContinue}
            />
          )}

          {moveStatus === 'wrong' && !showMoveHint && introState === 'playing' && (
            <PuzzleResultPopup
              type="incorrect"
              message={feedbackMessage}
              onContinue={handleContinue}
              showSolution={false}
              onShowSolution={handleTryAgain}
            />
          )}
        </div>
      </div>
    </div>
  );
}
