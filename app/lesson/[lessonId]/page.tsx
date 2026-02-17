'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
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
import {
  RookProgressAnimationRef,
  ANIMATION_STYLES,
  AnimationStyle,
} from '@/components/lesson/RookProgressAnimation';
import {
  RookWrongAnimationRef,
  WRONG_ANIMATION_STYLES,
  WrongAnimationStyle,
} from '@/components/lesson/RookWrongAnimation';
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
import { CreateProfileModal } from '@/components/subscription/CreateProfileModal';
import { LearningEvents } from '@/lib/analytics/posthog';
import { normalizeMove, processPuzzleWithSAN, isAlternateCheckmate, getCheckmateSquareHighlights, getHeroPiece, getPlayerMoveCount, BOARD_COLORS } from '@/lib/puzzle-utils';
import { useAudioWarmup } from '@/hooks/useAudioWarmup';
import { LessonCompleteScreen } from '@/components/lesson/LessonCompleteScreen';
import { LessonTryAgainScreen } from '@/components/lesson/LessonTryAgainScreen';
import { TutorialFlow } from '@/components/tutorial/TutorialFlow';
import { getTutorialForLesson, ThemeTutorial } from '@/data/theme-tutorials';

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

// Transform API puzzle to lesson puzzle format using shared processPuzzleWithSAN
function transformPuzzle(puzzle: Puzzle): LessonPuzzle {
  const processed = processPuzzleWithSAN({
    id: puzzle.id,
    fen: puzzle.fen,
    moves: puzzle.moves,
    rating: puzzle.rating,
    themes: puzzle.themes,
    url: puzzle.url,
  });

  return {
    puzzleId: processed.id,
    fen: processed.originalFen,
    puzzleFen: processed.puzzleFen,
    moves: [puzzle.moves[0], ...processed.solutionMoves].join(' '),
    rating: processed.rating,
    themes: processed.themes || [],
    url: processed.url || '',
    setupMove: puzzle.moves[0],
    lastMoveFrom: processed.lastMoveFrom,
    lastMoveTo: processed.lastMoveTo,
    solution: processed.solutionMoves.join(' '),
    solutionMoves: processed.solutionMovesSAN,
    playerColor: processed.playerColor,
  };
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = params.lessonId as string;
  const skipTutorial = searchParams.get('skipTutorial') === 'true';
  const isTutorial = lessonId === '1.1.1' && !skipTutorial;
  const [tutorialCorrectCount, setTutorialCorrectCount] = useState(6);

  // Progress tracking (Supabase + localStorage)
  const { completeLesson, recordPuzzleAttempt, syncState, retryPendingSyncs, isLessonUnlocked, loaded: progressLoaded, currentStreak } = useLessonProgress();

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

  // State for lesson limit modal / create profile modal
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);

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
  const [lessonPassed, setLessonPassed] = useState<boolean | null>(null);

  // Puzzle interaction state
  const [currentFen, setCurrentFen] = useState<string | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveStatus, setMoveStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Track previously highlighted selection squares so we can explicitly clear them
  // (react-chessboard v5 caches square styles — omitting a style doesn't remove it)
  const prevSelectionSquaresRef = useRef<Square[]>([]);

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

  // Checkmate explanation highlights
  const [showCheckmateHighlights, setShowCheckmateHighlights] = useState(false);

  // Board transition animation
  const [isBoardTransitioning, setIsBoardTransitioning] = useState(false);

  // Setup move animation - show opponent's last move animating
  const [isAnimatingSetup, setIsAnimatingSetup] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0); // Start at 0 to prevent piece flying

  // Intro popup state
  type IntroState = 'block' | 'theme' | 'playing';
  const [introState, setIntroState] = useState<IntroState>('playing');
  const [introMessages, setIntroMessages] = useState<IntroMessages>({});

  // Tutorial state
  const [tutorialConfig] = useState<ThemeTutorial | undefined>(() => getTutorialForLesson(lessonId));
  const [tutorialSkipped, setTutorialSkipped] = useState(false);


  // Rook animation state - one style per lesson (cycles through), wrong styles cycle each wrong
  const correctAnimStyles = Object.keys(ANIMATION_STYLES) as AnimationStyle[];
  const wrongAnimStyles = Object.keys(WRONG_ANIMATION_STYLES) as WrongAnimationStyle[];
  const [lessonAnimIndex] = useState(() => Math.floor(Math.random() * correctAnimStyles.length));
  const [wrongAnimCount, setWrongAnimCount] = useState(() => Math.floor(Math.random() * wrongAnimStyles.length));
  const rookCorrectStyle = correctAnimStyles[lessonAnimIndex % correctAnimStyles.length];
  const rookWrongStyle = wrongAnimStyles[wrongAnimCount % wrongAnimStyles.length];
  const rookProgressRef = useRef<RookProgressAnimationRef>(null);
  const rookWrongRef = useRef<RookWrongAnimationRef>(null);

  // Get all lesson IDs for unlock checking and tracking next lesson
  const allLessonIds = useMemo(() => getAllLessonIds(), []);

  // Warmup audio on first user interaction (unlocks audio on mobile)
  useAudioWarmup();

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
    if (isTutorial) return; // Tutorial uses its own fixed puzzles
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

        // Animate the opponent's setup move
        const firstPuzzle = transformedPuzzles[0];
        setAnimationDuration(0); // Instant snap to starting position
        setCurrentFen(firstPuzzle.fen); // Start with position BEFORE opponent's move
        setIsAnimatingSetup(true);
        setTimeout(() => {
          setAnimationDuration(300); // Enable animation for setup move
          setCurrentFen(firstPuzzle.puzzleFen); // Animate to puzzle position
          setTimeout(() => {
            setIsAnimatingSetup(false); // Allow interaction after animation
          }, 300);
        }, 100);

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
  }, [lessonId, isTutorial]);

  // Load intro messages from v2 curriculum
  useEffect(() => {
    if (isTutorial) return; // Tutorial has its own intro flow
    const messages = getIntroMessagesFromAnyLevel(lessonId);

    // If this lesson has a tutorial, replace the theme intro with the tutorial intro
    if (tutorialConfig) {
      // Suppress the normal theme intro - tutorial replaces it
      messages.themeIntro = undefined;
    }

    setIntroMessages(messages);

    // Determine initial intro state
    if (messages.blockIntro) {
      setIntroState('block');
    } else if (tutorialConfig) {
      // Show tutorial intro in the 'theme' slot
      setIntroState('theme');
    } else if (messages.themeIntro) {
      setIntroState('theme');
    } else {
      setIntroState('playing');
    }
  }, [lessonId, isTutorial, tutorialConfig]);

  // Handle dismissing intro popups
  const handleIntroDismiss = useCallback(() => {
    // Warmup audio NOW - user just clicked the start button
    warmupAudio();

    if (introState === 'block') {
      // If there's a tutorial or theme intro, show it next
      if (tutorialConfig || introMessages.themeIntro) {
        setIntroState('theme');
      } else {
        setIntroState('playing');
      }
    } else if (introState === 'theme') {
      setIntroState('playing');
    }
  }, [introState, introMessages, tutorialConfig]);

  // Handle skipping the tutorial
  const handleSkipTutorial = useCallback(() => {
    warmupAudio();
    setTutorialSkipped(true);
    setIntroState('playing');
  }, []);

  // Tutorial hint card: show when tutorial is active, not skipped, and current puzzle is guided
  const tutorialHint = useMemo(() => {
    if (!tutorialConfig?.hints || tutorialSkipped) return null;
    return tutorialConfig.hints.find(h => h.puzzleIndex === currentIndex) ?? null;
  }, [tutorialConfig, tutorialSkipped, currentIndex]);

  // Reset puzzle state when current puzzle changes
  useEffect(() => {
    if (currentPuzzle) {
      // Animate the opponent's setup move
      // Step 1: Instantly snap to starting position (no flying pieces)
      setAnimationDuration(0);
      setCurrentFen(currentPuzzle.fen); // Start with position BEFORE opponent's move
      setIsAnimatingSetup(true);
      setMoveIndex(0);
      setMoveStatus('playing');
      setSelectedSquare(null);
      setWrongAttempts(0);
      setShowMoveHint(false);
      setHintSquares(null);
      setPuzzleHadWrongAttempt(false);
      setPuzzleStartTime(Date.now()); // Reset timer for new puzzle
      setShowCheckmateHighlights(false);

      // Step 2: Enable animation, then animate the setup move
      const timer = setTimeout(() => {
        setAnimationDuration(300); // Enable animation
        setCurrentFen(currentPuzzle.puzzleFen); // Animate setup move
        setTimeout(() => {
          setIsAnimatingSetup(false); // Allow interaction after animation
        }, 300);
      }, 100); // Brief delay to ensure instant position is rendered first

      return () => clearTimeout(timer);
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

  // Detect if current puzzle is a checkmate puzzle (themes include 'mate')
  const isCheckmatePuzzle = useMemo(() => {
    if (!currentPuzzle) return false;
    return currentPuzzle.themes.some(t => t.toLowerCase().includes('mate'));
  }, [currentPuzzle]);

  // Square styles
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    if (showMoveHint && hintSquares) {
      styles[hintSquares.from] = {
        backgroundColor: 'rgba(88, 204, 2, 0.7)',
        boxShadow: 'inset 0 0 0 3px var(--color-chess-green)',
      };
      styles[hintSquares.to] = {
        backgroundColor: 'rgba(88, 204, 2, 0.5)',
        boxShadow: 'inset 0 0 0 3px var(--color-chess-green)',
      };
    } else if (currentPuzzle && moveIndex === 0 && !showMoveHint) {
      styles[currentPuzzle.lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
      styles[currentPuzzle.lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
    }

    if (selectedSquare && game && !showMoveHint) {
      styles[selectedSquare] = { backgroundColor: 'rgba(100, 200, 255, 0.6)' };
      const moves = game.moves({ square: selectedSquare, verbose: true });
      const currentSelectionSquares: Square[] = [selectedSquare];
      for (const move of moves) {
        styles[move.to] = {
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

    // Checkmate explanation highlights (red = attacked, yellow = blocked by friendly)
    if (game && game.isCheckmate()) {
      const kingColor = game.turn(); // The side in checkmate is the one whose turn it is
      const highlights = getCheckmateSquareHighlights(game, kingColor);

      const allHighlightSquares = [...highlights.attackedSquares, ...highlights.blockedByFriendlySquares];

      if (showCheckmateHighlights) {
        highlights.attackedSquares.forEach(sq => {
          styles[sq] = {
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            boxShadow: 'inset 0 0 0 3px rgba(255, 0, 0, 0.8), 0 0 12px rgba(255, 0, 0, 0.4)',
          };
        });

        highlights.blockedByFriendlySquares.forEach(sq => {
          styles[sq] = {
            backgroundColor: 'rgba(255, 255, 0, 0.5)',
            boxShadow: 'inset 0 0 0 3px rgba(255, 200, 0, 0.8), 0 0 12px rgba(255, 255, 0, 0.4)',
          };
        });
      } else {
        // Explicitly clear highlight squares so react-chessboard removes cached styles
        allHighlightSquares.forEach(sq => {
          styles[sq] = {};
        });
      }
    }

    return styles;
  }, [selectedSquare, game, currentPuzzle, moveIndex, showMoveHint, hintSquares, showCheckmateHighlights]);

  // Try to make a move
  const tryMove = useCallback((from: Square, to: Square) => {
    if (!game || !currentPuzzle || moveStatus !== 'playing') return false;

    if (moveIndex >= currentPuzzle.solutionMoves.length) return false;

    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (!move) return false;

      const expectedMove = currentPuzzle.solutionMoves[moveIndex];


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
          setFeedbackMessage(getV2Response(getSectionFromLessonId(lessonId), currentPuzzle.themes, getHeroPiece(currentPuzzle.puzzleFen, currentPuzzle.moves), getPlayerMoveCount(currentPuzzle.solutionMoves.length)));
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
              setFeedbackMessage(getV2Response(getSectionFromLessonId(lessonId), currentPuzzle.themes, getHeroPiece(currentPuzzle.puzzleFen, currentPuzzle.moves), getPlayerMoveCount(currentPuzzle.solutionMoves.length)));
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
            setFeedbackMessage(getV2Response(getSectionFromLessonId(lessonId), currentPuzzle.themes, getHeroPiece(currentPuzzle.puzzleFen, currentPuzzle.moves), getPlayerMoveCount(currentPuzzle.solutionMoves.length)));
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
        if (isAlternateCheckmate(gameCopy, currentPuzzle.themes)) {
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
          setFeedbackMessage(getV2Response(getSectionFromLessonId(lessonId), currentPuzzle.themes, getHeroPiece(currentPuzzle.puzzleFen, currentPuzzle.moves), getPlayerMoveCount(currentPuzzle.solutionMoves.length)));
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
        setWrongAnimCount(prev => prev + 1); // Cycle to next wrong animation style

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
            if (firstAttemptCorrectCount >= 4) {
              playCelebrationSound(firstAttemptCorrectCount);
            }
          }
        } else {
          setLessonComplete(true);
          if (firstAttemptCorrectCount >= 4) {
            playCelebrationSound(firstAttemptCorrectCount);
          }
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
          if (firstAttemptCorrectCount >= 4) {
            playCelebrationSound(firstAttemptCorrectCount);
          }
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

  // Determine pass/fail and save completion via progress hook
  useEffect(() => {
    if (isTutorial) return; // Tutorial handles its own persistence in onComplete
    if (lessonComplete && lessonPassed === null) {
      const passed = firstAttemptCorrectCount >= 4;
      setLessonPassed(passed);

      if (passed) {
        // Pass: advance to next lesson
        completeLesson(lessonId, allLessonIds, firstAttemptCorrectCount);
      }
      // Fail: don't call completeLesson — lesson stays as currentPosition
      // User returns to /learn and can retry with fresh puzzles
    }
  }, [lessonComplete, lessonPassed, firstAttemptCorrectCount, lessonId, completeLesson, allLessonIds, isTutorial]);

  // Record lesson completion and show limit modal if needed (only when passed)
  useEffect(() => {
    if (isTutorial) return; // Tutorial handles its own completion in onComplete
    if (lessonComplete && lessonPassed === true) {
      // Trigger PWA install prompt after first puzzle experience
      window.dispatchEvent(new Event('chess-path:puzzle-complete'));

      // Record the lesson completion for permission tracking
      // Use the returned value (not the stale closure) to check signup prompt
      const { shouldPromptSignup: promptSignup } = recordLessonComplete();

      // Track in analytics
      const accuracy = Math.round((firstAttemptCorrectCount / puzzles.length) * 100);
      LearningEvents.lessonCompleted(lessonId, accuracy, 0);

      // Show appropriate modal for users who've hit their limit
      if (promptSignup) {
        const timer = setTimeout(() => {
          setShowCreateProfileModal(true);
        }, 2000);
        return () => clearTimeout(timer);
      } else if (shouldPromptPremium) {
        const timer = setTimeout(() => {
          setShowLimitModal(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [lessonComplete, lessonPassed, shouldPromptPremium, recordLessonComplete, firstAttemptCorrectCount, puzzles.length, lessonId]);

  // Confetti + celebration sound now handled by LessonCompleteScreen component

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
    if (shouldPromptSignup) {
      return (
        <CreateProfileModal
          isOpen={true}
          onClose={() => router.push('/learn')}
          context="lesson-gate"
        />
      );
    }
    return (
      <div className="h-full bg-chess-page text-chess-text flex flex-col overflow-hidden">
        <div className="bg-chess-bg-light border-b border-white/10 px-4 py-3 flex-shrink-0">
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
            <div className="text-5xl mb-4">⏰</div>
            <h1 className="text-2xl font-bold mb-2">Daily Limit Reached</h1>
            <p className="text-white/60 mb-6">
              You&apos;ve completed your 2 free lessons today. Come back tomorrow or upgrade for unlimited access!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/pricing')}
                className="px-8 py-3 bg-chess-green text-white font-bold rounded-xl hover:bg-[#4CAF00] transition-colors"
              >
                Upgrade to Premium
              </button>
              <button
                onClick={() => router.push('/learn')}
                className="px-8 py-3 bg-chess-bg-light text-white/70 font-bold rounded-xl border border-white/10 hover:bg-[#243842] transition-colors"
              >
                Back to Learn
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tutorial for lesson 1.1.1
  if (isTutorial) {
    if (lessonComplete) {
      return (
        <>
          <LessonCompleteScreen
            correctCount={tutorialCorrectCount}
            wrongCount={6 - tutorialCorrectCount}
            lessonName="Queen Checkmate: Easy"
            lessonId={lessonId}
            isGuest={!user}
            getLevelKeyFromLessonId={(id) => String(getLevelFromLessonId(id) || 1)}
            streak={currentStreak}
            puzzleResults={Array.from({ length: 6 }, (_, i) => i < tutorialCorrectCount ? 'correct' : 'wrong') as ('correct' | 'wrong')[]}
          />
          <CreateProfileModal
            isOpen={showCreateProfileModal}
            onClose={() => setShowCreateProfileModal(false)}
            lessonsCompleted={lessonsCompletedToday}
          />
          {user ? (
            <LessonLimitModal
              isOpen={showLimitModal}
              onClose={() => setShowLimitModal(false)}
              lessonsCompleted={lessonsCompletedToday}
              isLoggedIn={true}
            />
          ) : (
            <CreateProfileModal
              isOpen={showLimitModal}
              onClose={() => setShowLimitModal(false)}
              context="lesson-limit"
            />
          )}
        </>
      );
    }
    return (
      <TutorialFlow
        lessonId={lessonId}
        onComplete={(correctCount) => {
          setTutorialCorrectCount(correctCount);
          completeLesson(lessonId, allLessonIds);
          const { shouldPromptSignup: promptSignup } = recordLessonComplete();
          const accuracy = Math.round((correctCount / 6) * 100);
          LearningEvents.lessonCompleted(lessonId, accuracy, 0);
          window.dispatchEvent(new Event('chess-path:puzzle-complete'));
          setLessonComplete(true);
          if (promptSignup) {
            setTimeout(() => setShowCreateProfileModal(true), 2000);
          } else if (shouldPromptPremium) {
            setTimeout(() => setShowLimitModal(true), 2000);
          }
        }}
      />
    );
  }

  // Loading state (either permissions or puzzle data)
  if (loading || permissionsLoading) {
    return (
      <div className="h-full bg-chess-page text-chess-text flex flex-col overflow-hidden">
        <style>{progressBarStyles}</style>
        <div className="bg-chess-bg-light border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push('/learn')}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex-1 mx-4">
              <ChessProgressBar current={0} total={6} streak={0} />
            </div>
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
      <div className="h-full bg-chess-page text-chess-text flex flex-col overflow-hidden">
        <div className="bg-chess-bg-light border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.push('/learn')}
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
              onClick={() => router.push('/learn')}
              className="text-chess-blue hover:underline"
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
    // Show try-again screen if user didn't pass (score <= 3)
    if (lessonPassed === false) {
      return (
        <LessonTryAgainScreen
          score={firstAttemptCorrectCount}
          totalPuzzles={puzzles.length}
          lessonName={lessonName}
          onContinue={() => router.push('/learn')}
        />
      );
    }

    // Show celebration screen if user passed (score >= 4)
    if (lessonPassed === true) {
      return (
        <>
          <LessonCompleteScreen
            correctCount={firstAttemptCorrectCount}
            wrongCount={puzzles.length - firstAttemptCorrectCount}
            lessonName={lessonName}
            lessonId={lessonId}
            isGuest={!user}
            getLevelKeyFromLessonId={(id) => String(getLevelFromLessonId(id) || 1)}
            streak={currentStreak}
            puzzleResults={puzzles.map(p => firstAttemptResults[p.puzzleId] === 'correct' ? 'correct' : 'wrong')}
          />
          <CreateProfileModal
            isOpen={showCreateProfileModal}
            onClose={() => setShowCreateProfileModal(false)}
            lessonsCompleted={lessonsCompletedToday}
          />
          {user ? (
            <LessonLimitModal
              isOpen={showLimitModal}
              onClose={() => setShowLimitModal(false)}
              lessonsCompleted={lessonsCompletedToday}
              isLoggedIn={true}
            />
          ) : (
            <CreateProfileModal
              isOpen={showLimitModal}
              onClose={() => setShowLimitModal(false)}
              context="lesson-limit"
            />
          )}
        </>
      );
    }

    // lessonPassed is null — still determining pass/fail, show nothing
    return null;
  }

  if (!currentPuzzle) {
    return (
      <div className="h-full bg-chess-page text-chess-text flex flex-col overflow-hidden">
        <div className="bg-chess-bg-light border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.push('/learn')}
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
    <div className="h-full bg-chess-page text-chess-text flex flex-col overflow-hidden">
      <style>{progressBarStyles}{`
        @keyframes tutorialSlideUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Header */}
      <div className="bg-chess-page border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              if (!lessonComplete && puzzles.length > 0) {
                LearningEvents.lessonAbandoned(lessonId, currentIndex + 1, totalPuzzles);
              }
              router.push('/learn');
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          {/* Progress bar with streak effect */}
          <div className="flex-1 mx-4">
            <ChessProgressBar
              current={inRetryMode
                ? currentIndex + (moveStatus === 'correct' ? 1 : 0)
                : completedPuzzleCount}
              total={totalPuzzles}
              streak={streak}
              hadWrongAnswer={hadWrongAnswer}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-1 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Theme + Turn indicator */}
          <div className="flex items-center justify-between mb-2 h-8">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-chess-text">{lessonName}</h1>
              {inRetryMode && (
                <span className="text-yellow-600 text-xs">(retry)</span>
              )}
              {primaryTheme && (
                <HelpIconButton onClick={() => setShowHelpModal(true)} />
              )}
            </div>
            <span className="text-base font-bold text-chess-text">
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
              <ChessPathBoard
                options={{
                  position: currentFen || currentPuzzle.puzzleFen,
                  boardOrientation: currentPuzzle.playerColor,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPieceDrop: isAnimatingSetup ? undefined : (args: any) => {
                    tryMove(args.sourceSquare as Square, args.targetSquare as Square);
                    return true;
                  },
                  onSquareClick: isAnimatingSetup ? undefined : onSquareClick,
                  squareStyles: squareStyles,
                  animationDurationInMs: animationDuration,
                  boardStyle: {
                    borderRadius: '8px 8px 0 0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  },
                  darkSquareStyle: { backgroundColor: BOARD_COLORS.dark },
                  lightSquareStyle: { backgroundColor: BOARD_COLORS.light },
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

            {/* Tutorial intro popup (replaces theme intro when tutorial exists) */}
            {introState === 'theme' && tutorialConfig && (
              <IntroPopup
                title={tutorialConfig.intro.title}
                message={tutorialConfig.intro.message}
                onStart={handleIntroDismiss}
                buttonText="Let's Learn!"
                onSkip={handleSkipTutorial}
                skipText="Skip"
              />
            )}

            {/* Normal theme intro popup (when no tutorial) */}
            {introState === 'theme' && !tutorialConfig && introMessages.themeIntro && (
              <IntroPopup
                title={introMessages.themeIntro.title}
                message={introMessages.themeIntro.message}
                onStart={handleIntroDismiss}
                buttonText="Start"
              />
            )}
          </div>

          {/* Tutorial hint card — shows below board during guided puzzles */}
          {tutorialHint && moveStatus === 'playing' && introState === 'playing' && (
            <div
              key={`tutorial-hint-${currentIndex}`}
              className="w-full rounded-b-2xl py-2.5 px-4"
              style={{
                animation: 'tutorialSlideUp 0.3s ease-out',
                backgroundColor: '#FFF3CD',
                boxShadow: '0 2px 8px rgba(180, 140, 0, 0.15)',
              }}
            >
              {tutorialHint.title && (
                <div className="font-bold mb-0.5" style={{ color: '#7A6200', fontSize: '15px' }}>
                  {tutorialHint.title}
                </div>
              )}
              <div style={{ color: '#8B7000', fontSize: '14px', lineHeight: '1.4' }}>
                {tutorialHint.message}
              </div>
            </div>
          )}

          {/* Result popup - only show when not in intro state */}
          {moveStatus === 'correct' && introState === 'playing' && (
            <PuzzleResultPopup
              key={`correct-${completedPuzzleCount}`}
              type="correct"
              message={feedbackMessage}
              onContinue={handleContinue}
              rookAnimationStyle={rookCorrectStyle}
              rookProgressRef={rookProgressRef}
              rookCurrentStage={completedPuzzleCount - 1}
              isCheckmate={isCheckmatePuzzle && game?.isCheckmate()}
              onShowCheckmateExplain={(show) => setShowCheckmateHighlights(show)}
              checkmateExplainActive={showCheckmateHighlights}
            />
          )}

          {moveStatus === 'wrong' && !showMoveHint && introState === 'playing' && (
            <PuzzleResultPopup
              key={`wrong-${wrongAnimCount}`}
              type="incorrect"
              message={feedbackMessage}
              onContinue={handleContinue}
              showSolution={false}
              onShowSolution={handleTryAgain}
              rookWrongStyle={rookWrongStyle}
              rookWrongRef={rookWrongRef}
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
