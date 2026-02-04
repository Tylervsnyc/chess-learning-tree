'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import {
  playCorrectSound,
  playErrorSound,
  playCelebrationSound,
  playMoveSound,
  playCaptureSound,
  warmupAudio,
  vibrateOnCorrect,
  vibrateOnError,
} from '@/lib/sounds';
import {
  getAllLessonIds,
  getLessonById,
  getLevelFromLessonId,
  getIntroMessagesForLesson,
  getLessonWithContext,
} from '@/lib/curriculum-registry';
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup';
import { IntroPopup } from '@/components/puzzle/IntroPopup';
import { ThemeHelpModal, HelpIconButton } from '@/components/puzzle/ThemeHelpModal';
import { getThemeExplanation } from '@/data/theme-explanations';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';
import { SyncStatus } from '@/components/ui/SyncStatus';
import { getV2Response, getSectionFromLessonId } from '@/data/staging/v2-puzzle-responses';
import { IntroMessages } from '@/data/staging/level1-v2-curriculum';
import { useLessonProgress } from '@/hooks/useProgress';
import { useUser } from '@/hooks/useUser';
import { usePermissions } from '@/hooks/usePermissions';
import { LessonLimitModal } from '@/components/subscription/LessonLimitModal';
import { LearningEvents } from '@/lib/analytics/posthog';
import { parseUciMove } from '@/lib/puzzle-utils';
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

// Get intro messages from any level using the curriculum registry
function getIntroMessagesFromAnyLevel(lessonId: string): IntroMessages {
  const messages = getIntroMessagesForLesson(lessonId);
  const result: IntroMessages = {};

  const context = getLessonWithContext(lessonId);

  if (messages.blockIntro && context) {
    result.blockIntro = {
      title: context.block.name,
      message: messages.blockIntro,
    };
  }

  if (messages.themeIntro && context) {
    result.themeIntro = {
      title: context.section.name,
      message: messages.themeIntro,
    };
  }

  return result;
}

// Transform API puzzle to lesson puzzle format
function transformPuzzle(puzzle: Puzzle): LessonPuzzle {
  const chess = new Chess(puzzle.fen);

  const setupMove = puzzle.moves[0];
  const solutionMoves = puzzle.moves.slice(1);
  const { from, to, promotion } = parseUciMove(setupMove);

  try {
    chess.move({ from, to, promotion });
  } catch {
    // Invalid setup move - ignore
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

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;

  // Progress tracking (Supabase + localStorage)
  const { completeLesson, recordPuzzleAttempt, syncState, retryPendingSyncs, isLessonUnlocked, loaded: progressLoaded } = useLessonProgress();

  // User and permissions
  const { user, profile, loading: userLoading } = useUser();
  const {
    canAccessLesson,
    shouldPromptSignup,
    shouldPromptPremium,
    lessonsCompletedToday,
    recordLessonComplete,
    loading: permissionsLoading,
  } = usePermissions();

  // State for lesson limit modal
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Theme help modal
  const [showHelpModal, setShowHelpModal] = useState(false);

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

  // Track time spent on puzzle (for analytics)
  const [puzzleStartTime, setPuzzleStartTime] = useState<number>(Date.now());

  // Board transition animation
  const [isBoardTransitioning, setIsBoardTransitioning] = useState(false);

  // Intro popup state
  type IntroState = 'block' | 'theme' | 'playing';
  const [introState, setIntroState] = useState<IntroState>('playing');
  const [introMessages, setIntroMessages] = useState<IntroMessages>({});

  // Confetti ref to prevent re-firing
  const confettiFired = useRef(false);

  // Get all lesson IDs for unlock checking and tracking next lesson
  const allLessonIds = useMemo(() => getAllLessonIds(), []);

  // Calculate next lesson ID for navigation after completion
  const nextLessonId = useMemo(() => {
    const currentIndex = allLessonIds.indexOf(lessonId);
    console.log('[DEBUG] lessonId:', lessonId, 'currentIndex:', currentIndex, 'nextLessonId:', allLessonIds[currentIndex + 1]);
    if (currentIndex >= 0 && currentIndex < allLessonIds.length - 1) {
      return allLessonIds[currentIndex + 1];
    }
    return null;
  }, [allLessonIds, lessonId]);


  // Warmup audio on first user interaction (unlocks audio on mobile)
  useEffect(() => {
    const handleFirstInteraction = () => {
      warmupAudio();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Current puzzle
  const currentPuzzle = inRetryMode
    ? retryQueue[currentIndex]
    : puzzles[currentIndex];

  const totalPuzzles = inRetryMode ? retryQueue.length : puzzles.length;

  // Find primary theme from puzzles (for help modal)
  const primaryTheme = useMemo(() => {
    if (puzzles.length === 0) return null;
    const themeCounts: Record<string, number> = {};
    for (const puzzle of puzzles) {
      for (const theme of puzzle.themes) {
        if (getThemeExplanation(theme)) {
          themeCounts[theme] = (themeCounts[theme] || 0) + 1;
        }
      }
    }
    let maxTheme: string | null = null;
    let maxCount = 0;
    for (const [theme, count] of Object.entries(themeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxTheme = theme;
      }
    }
    return maxTheme;
  }, [puzzles]);

  // Fetch lesson data and puzzles
  useEffect(() => {
    async function loadLesson() {
      setLoading(true);
      setError(null);

      const lesson = getLessonById(lessonId);
      if (!lesson) {
        setError(`Lesson ${lessonId} not found`);
        setLoading(false);
        return;
      }

      const lessonLevel = getLevelFromLessonId(lessonId);
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

        // Track lesson started
        LearningEvents.lessonStarted(lessonId, lesson.name);

        setLoading(false);
      } catch {
        setError('Failed to load puzzles');
        setLoading(false);
      }
    }

    loadLesson();
  }, [lessonId]);

  // Load intro messages from v2 curriculum
  useEffect(() => {
    const messages = getIntroMessagesFromAnyLevel(lessonId);
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
    // Warmup audio NOW - user just clicked the start button
    warmupAudio();

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
      setPuzzleStartTime(Date.now()); // Reset timer for new puzzle
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
          vibrateOnCorrect();
          setStreak(newStreak);
          setCompletedPuzzleCount(c => c + 1);

          // Track puzzle attempt
          LearningEvents.puzzleAttempted(lessonId, currentIndex + 1, true, currentPuzzle.rating);

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
              vibrateOnCorrect();
              setStreak(newStreak);
              setCompletedPuzzleCount(c => c + 1);

              // Track puzzle attempt
              LearningEvents.puzzleAttempted(lessonId, currentIndex + 1, true, currentPuzzle.rating);
            }
          } catch {
            const newStreak = streak + 1;
            setMoveStatus('correct');
            setFeedbackMessage(getV2Response(getSectionFromLessonId(lessonId), currentPuzzle.themes));
            playCorrectSound(completedPuzzleCount);
            vibrateOnCorrect();
            setStreak(newStreak);
            setCompletedPuzzleCount(c => c + 1);

            // Track puzzle attempt
            LearningEvents.puzzleAttempted(lessonId, currentIndex + 1, true, currentPuzzle.rating);
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
          vibrateOnCorrect();
          setStreak(newStreak);
          setCompletedPuzzleCount(c => c + 1);

          // Track puzzle attempt
          LearningEvents.puzzleAttempted(lessonId, currentIndex + 1, true, currentPuzzle.rating);

          return true;
        }

        // Wrong move
        setSelectedSquare(null);
        playErrorSound();
        vibrateOnError();
        setStreak(0);
        setHadWrongAnswer(true);
        setPuzzleHadWrongAttempt(true);

        // Track wrong attempt
        LearningEvents.puzzleAttempted(lessonId, currentIndex + 1, false, currentPuzzle.rating);

        if (showMoveHint) {
          return false;
        }

        const newWrongAttempts = wrongAttempts + 1;
        setWrongAttempts(newWrongAttempts);

        if (newWrongAttempts < 3) {
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
  }, [game, currentPuzzle, currentFen, moveIndex, moveStatus, streak, completedPuzzleCount, wrongAttempts, showMoveHint, lessonId, currentIndex]);

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
      const timeSpentMs = Date.now() - puzzleStartTime;
      recordPuzzleAttempt(currentPuzzle.puzzleId, lessonId, result === 'correct', {
        themes: currentPuzzle.themes,
        rating: currentPuzzle.rating,
        fen: currentPuzzle.puzzleFen,
        solution: currentPuzzle.solution,
        timeSpentMs,
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
  }, [currentPuzzle, currentIndex, totalPuzzles, inRetryMode, retryQueue, puzzles, results, firstAttemptCorrectCount, lessonId, recordPuzzleAttempt, puzzleStartTime]);

  // Handle continue with board transition animation
  const handleContinue = useCallback(() => {
    // Start fade out
    setIsBoardTransitioning(true);

    // After fade out, advance to next puzzle
    setTimeout(() => {
      if (moveStatus === 'correct') {
        recordAndAdvance(puzzleHadWrongAttempt ? 'wrong' : 'correct');
      } else if (moveStatus === 'wrong') {
        recordAndAdvance('wrong');
      }

      // Fade back in after state updates
      setTimeout(() => {
        setIsBoardTransitioning(false);
      }, 50);
    }, 150);
  }, [moveStatus, recordAndAdvance, puzzleHadWrongAttempt]);

  // Handle try again
  const handleTryAgain = useCallback(() => {
    setMoveStatus('playing');
    setSelectedSquare(null);
  }, []);

  // Keep these for retry logic
  const correctCount = Object.values(results).filter(r => r === 'correct').length;

  // Save completion via progress hook (localStorage + Supabase for authenticated users)
  useEffect(() => {
    if (lessonComplete) {
      completeLesson(lessonId, allLessonIds);
    }
  }, [lessonComplete, lessonId, completeLesson, allLessonIds]);

  // Record lesson completion and show limit modal if needed
  useEffect(() => {
    if (lessonComplete) {
      // Record the lesson completion for permission tracking
      recordLessonComplete();

      // Track in analytics
      const accuracy = Math.round((firstAttemptCorrectCount / puzzles.length) * 100);
      LearningEvents.lessonCompleted(lessonId, accuracy, 0);

      // Show limit modal for users who've hit their limit
      if (shouldPromptSignup || shouldPromptPremium) {
        const timer = setTimeout(() => {
          setShowLimitModal(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [lessonComplete, shouldPromptSignup, shouldPromptPremium, recordLessonComplete, firstAttemptCorrectCount, puzzles.length, lessonId]);

  // Confetti effect on lesson complete - wrapped in useEffect
  useEffect(() => {
    if (lessonComplete && !confettiFired.current && typeof window !== 'undefined') {
      confettiFired.current = true;
      const isPerfect = firstAttemptCorrectCount === puzzles.length;

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
  }, [lessonComplete, firstAttemptCorrectCount, puzzles.length]);

  // Unlock check - redirect to /learn if lesson is locked
  // Admin users bypass this check
  const lessonUnlocked = isLessonUnlocked(lessonId, allLessonIds);

  // Wait for auth AND profile to load before checking admin status
  // Auth is loading if userLoading is true
  // Profile is loading if user exists but profile is null
  const isAuthLoading = userLoading;
  const isProfileLoadingFlag = !!user && !profile;
  const isFullyLoaded = !isAuthLoading && !isProfileLoadingFlag;

  // Admin users have unrestricted access to all lessons and levels
  // While loading, default to false (secure default) to prevent flash of unlocked content
  const isAdmin = profile?.is_admin ?? false;

  useEffect(() => {
    // Only check once progress AND auth/profile are fully loaded, and skip for admins
    if (progressLoaded && isFullyLoaded && !lessonUnlocked && !isAdmin) {
      router.replace('/learn');
    }
  }, [progressLoaded, isFullyLoaded, lessonUnlocked, isAdmin, router]);

  // Don't render if we're about to redirect (locked lesson)
  // Also don't render while auth/profile is loading (to avoid flash)
  if (!isFullyLoaded) {
    return null; // Will show loading state from permissions check below
  }
  if (progressLoaded && !lessonUnlocked && !isAdmin) {
    return null;
  }

  // Permission gate - check if user can access lessons
  // Only show blocked state AFTER permissions have finished loading
  if (!permissionsLoading && !canAccessLesson) {
    return (
      <div className="h-screen bg-[#eef6fc] text-[#3c3c3c] flex flex-col overflow-hidden">
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push('/learn')}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex-1" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            {shouldPromptSignup ? (
              <>
                <div className="text-5xl mb-4">🔒</div>
                <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
                <p className="text-white/60 mb-6">
                  Sign up for free to continue learning! You&apos;ll get 2 lessons per day.
                </p>
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="px-8 py-3 bg-[#58CC02] text-white font-bold rounded-xl hover:bg-[#4CAF00] transition-colors"
                >
                  Sign Up Free
                </button>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">⏰</div>
                <h1 className="text-2xl font-bold mb-2">Daily Limit Reached</h1>
                <p className="text-white/60 mb-6">
                  You&apos;ve completed your 2 free lessons today. Come back tomorrow or upgrade for unlimited access!
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => router.push('/pricing')}
                    className="px-8 py-3 bg-[#58CC02] text-white font-bold rounded-xl hover:bg-[#4CAF00] transition-colors"
                  >
                    Upgrade to Premium
                  </button>
                  <button
                    onClick={() => router.push('/learn')}
                    className="px-8 py-3 bg-[#1A2C35] text-white/70 font-bold rounded-xl border border-white/10 hover:bg-[#243842] transition-colors"
                  >
                    Back to Learn
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading state (either permissions or puzzle data)
  if (loading || permissionsLoading) {
    return (
      <div className="h-screen bg-[#eef6fc] text-[#3c3c3c] flex flex-col overflow-hidden">
        <style>{progressBarStyles}</style>
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push(`/learn?level=${level}&scrollTo=${lessonId}`)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex-1 mx-4">
              <ChessProgressBar current={0} total={6} streak={0} />
            </div>
            <div className="text-gray-400">...</div>
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
      <div className="h-screen bg-[#eef6fc] text-[#3c3c3c] flex flex-col overflow-hidden">
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.push(`/learn?level=${level}&scrollTo=${lessonId}`)}
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
              onClick={() => router.push(`/learn?level=${level}&scrollTo=${lessonId}`)}
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

    return (
      <>
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
                onClick={() => router.push(`/learn?level=${level}&scrollTo=${nextLessonId || lessonId}`)}
                className="w-full py-4 rounded-xl font-bold text-lg text-white bg-[#58CC02] shadow-[0_4px_0_#3d8c01] active:translate-y-[2px] active:shadow-[0_2px_0_#3d8c01] transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
        <LessonLimitModal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          lessonsCompleted={lessonsCompletedToday}
          isLoggedIn={!!user}
        />
      </>
    );
  }

  if (!currentPuzzle) {
    return (
      <div className="h-screen bg-[#eef6fc] text-[#3c3c3c] flex flex-col overflow-hidden">
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.push(`/learn?level=${level}&scrollTo=${lessonId}`)}
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
    <div className="h-screen bg-[#eef6fc] text-[#3c3c3c] flex flex-col overflow-hidden">
      <style>{progressBarStyles}</style>
      {/* Header */}
      <div className="bg-[#eef6fc] border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push(`/learn?level=${level}&scrollTo=${lessonId}`)}
            className="text-gray-500 hover:text-gray-700"
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

          <div className="flex items-center gap-3">
            <div className="text-gray-500">
              {currentIndex + 1}/{totalPuzzles}
              {inRetryMode && <span className="text-yellow-600 ml-2">(retry)</span>}
            </div>
            <SyncStatus state={syncState} onRetry={retryPendingSyncs} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-1 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Theme + Turn indicator */}
          <div className="flex items-center justify-between mb-2 h-8">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-[#3c3c3c]">{lessonName}</h1>
              {inRetryMode && (
                <span className="text-yellow-600 text-xs">(retry)</span>
              )}
              {primaryTheme && (
                <HelpIconButton onClick={() => setShowHelpModal(true)} />
              )}
            </div>
            <span className="text-base font-bold text-[#3c3c3c]">
              {currentPuzzle.playerColor === 'white' ? 'White' : 'Black'} to move
            </span>
          </div>

          {/* Chessboard with intro popup overlay */}
          <div className="relative">
            <div
              style={{
                opacity: isBoardTransitioning ? 0 : 1,
                transition: 'opacity 150ms ease-in-out',
              }}
            >
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
            </div>

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
              puzzleShareData={currentPuzzle ? {
                fen: currentPuzzle.puzzleFen,
                playerColor: currentPuzzle.playerColor,
                lastMoveFrom: currentPuzzle.lastMoveFrom,
                lastMoveTo: currentPuzzle.lastMoveTo,
                solutionMoves: currentPuzzle.solution.split(' '),
              } : undefined}
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

      {/* Theme help modal */}
      {primaryTheme && (
        <ThemeHelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          themeId={primaryTheme}
        />
      )}
    </div>
  );
}
