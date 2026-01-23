'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { useLessonProgress } from '@/hooks/useProgress';
import { useUser } from '@/hooks/useUser';
import { LessonLimitModal } from '@/components/subscription/LessonLimitModal';
import {
  playCorrectSound,
  playErrorSound,
  playCelebrationSound,
  playMoveSound,
  playCaptureSound,
} from '@/lib/sounds';
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup';
import { ThemeHelpModal, HelpIconButton } from '@/components/puzzle/ThemeHelpModal';
import { getThemeExplanation } from '@/data/theme-explanations';
import { level1 } from '@/data/level1-curriculum';
import { level2 } from '@/data/level2-curriculum';
import { level3 } from '@/data/level3-curriculum';
import { level4 } from '@/data/level4-curriculum';
import { level5 } from '@/data/level5-curriculum';
import { level6 } from '@/data/level6-curriculum';
import { level7 } from '@/data/level7-curriculum';
import { level8 } from '@/data/level8-curriculum';
import { getPuzzleResponse } from '@/data/puzzle-responses';
import { LearningEvents } from '@/lib/analytics/posthog';
import { LessonCompleteScreen } from '@/components/lesson/LessonCompleteScreen';

const LEVELS = [level1, level2, level3, level4, level5, level6, level7, level8];

// CSS for streak animations
const streakStyles = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
  }
  @keyframes rainbowFlow {
    0% { background-position: 0% 50%, 0% 50%; }
    100% { background-position: 0% 50%, 300% 50%; }
  }
`;

// Supernova Gentle streak effect
function getStreakStyle(streak: number, hadWrongAnswer: boolean): React.CSSProperties {
  if (hadWrongAnswer || streak < 2) {
    return {
      background: '#58CC02',
      backgroundSize: 'auto',
      animation: 'none',
      boxShadow: 'none',
    };
  }
  const intensity = Math.min(streak / 6, 1);
  return {
    background: `
      radial-gradient(ellipse at center,
        rgba(255, 255, 255, ${0.3 + intensity * 0.7}) 0%,
        rgba(255, 220, 240, ${0.2 + intensity * 0.4}) 20%,
        transparent 50%),
      linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
    `,
    backgroundSize: '100% 100%, 300% 100%',
    animation: `rainbowFlow ${3 - streak * 0.2}s linear infinite${streak >= 4 ? `, shake 0.4s infinite` : ''}`,
    boxShadow: `
      0 0 ${streak * 5}px rgba(255, 200, 220, ${0.4 + intensity * 0.4}),
      0 0 ${streak * 10}px rgba(255, 150, 200, 0.4)
    `,
  };
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

// Duolingo colors
const COLORS = {
  green: '#58CC02',
  blue: '#1CB0F6',
  orange: '#FF9600',
  background: '#131F24',
  card: '#1A2C35',
};

// Map level number to level key for navigation
const LEVEL_KEYS = ['beginner', 'casual', 'club', 'tournament', 'advanced', 'expert'];
function getLevelKeyFromLessonId(lessonId: string): string {
  const levelNum = parseInt(lessonId.split('.')[0], 10);
  return LEVEL_KEYS[levelNum - 1] || 'beginner';
}

// Get the next lesson ID in the curriculum
function getNextLessonId(currentLessonId: string): string | null {
  const levelNum = parseInt(currentLessonId.split('.')[0], 10);
  const level = LEVELS[levelNum - 1];
  if (!level) return null;

  // Get all lesson IDs in order
  const allLessonIds = level.modules.flatMap(m => m.lessons.map(l => l.id));
  const currentIndex = allLessonIds.indexOf(currentLessonId);

  if (currentIndex === -1 || currentIndex >= allLessonIds.length - 1) {
    return null; // Not found or last lesson
  }

  return allLessonIds[currentIndex + 1];
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = params.lessonId as string;
  const isGuest = searchParams.get('guest') === 'true';
  const { completeLesson, recordPuzzleAttempt, lessonsCompletedToday } = useLessonProgress();
  const { user, profile } = useUser();

  // Check if user is premium (has active subscription)
  const isPremium = profile?.subscription_status === 'premium' || profile?.subscription_status === 'trial';

  // State for lesson limit modal
  const [showLimitModal, setShowLimitModal] = useState(false);

  // State for theme help modal
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Lesson state
  const [lessonName, setLessonName] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [puzzles, setPuzzles] = useState<LessonPuzzle[]>([]);
  const [loading, setLoading] = useState(true);

  // Progress state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Record<string, PuzzleResult>>({});
  const [retryQueue, setRetryQueue] = useState<LessonPuzzle[]>([]);
  const [inRetryMode, setInRetryMode] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  // Puzzle interaction state
  const [currentFen, setCurrentFen] = useState<string | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveStatus, setMoveStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [showingSolution, setShowingSolution] = useState(false);
  const [solutionMoveShown, setSolutionMoveShown] = useState(false);

  // Streak tracking for progress bar effect
  const [streak, setStreak] = useState(0);
  const [hadWrongAnswer, setHadWrongAnswer] = useState(false);
  const [completedPuzzleCount, setCompletedPuzzleCount] = useState(0);

  // Feedback message for popup
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Flagged puzzles tracking
  const [flaggedPuzzles, setFlaggedPuzzles] = useState<Set<string>>(new Set());

  // Duolingo-style wrong answer flow
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showMoveHint, setShowMoveHint] = useState(false);
  const [hintSquares, setHintSquares] = useState<{ from: Square; to: Square } | null>(null);
  // Track if user made ANY wrong attempt on current puzzle (for final scoring)
  const [puzzleHadWrongAttempt, setPuzzleHadWrongAttempt] = useState(false);

  // Load flagged puzzles from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('flagged-puzzles');
      if (stored) {
        setFlaggedPuzzles(new Set(JSON.parse(stored)));
      }
    } catch {
      // Ignore errors
    }
  }, []);

  // Show lesson limit modal after completing 2 lessons (for non-premium users)
  useEffect(() => {
    if (lessonComplete && !isPremium && lessonsCompletedToday >= 2) {
      // Delay slightly so user sees the celebration first
      const timer = setTimeout(() => {
        setShowLimitModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lessonComplete, isPremium, lessonsCompletedToday]);

  // Track lesson completion in analytics
  useEffect(() => {
    if (lessonComplete && puzzles.length > 0) {
      const correctCount = Object.values(results).filter(r => r === 'correct').length;
      const accuracy = Math.round((correctCount / puzzles.length) * 100);
      LearningEvents.lessonCompleted(lessonId, accuracy, 0);
    }
  }, [lessonComplete, lessonId, puzzles.length, results]);

  // Flag/unflag a puzzle
  const toggleFlag = useCallback((puzzleId: string) => {
    setFlaggedPuzzles(prev => {
      const next = new Set(prev);
      if (next.has(puzzleId)) {
        next.delete(puzzleId);
      } else {
        next.add(puzzleId);
      }
      localStorage.setItem('flagged-puzzles', JSON.stringify([...next]));
      return next;
    });
  }, []);

  // Current puzzle (from main list or retry queue)
  const currentPuzzle = inRetryMode
    ? retryQueue[currentIndex]
    : puzzles[currentIndex];

  const totalPuzzles = inRetryMode ? retryQueue.length : puzzles.length;

  // Find primary theme from puzzles (for help modal)
  const primaryTheme = useMemo(() => {
    if (puzzles.length === 0) return null;
    // Count theme occurrences across puzzles
    const themeCounts: Record<string, number> = {};
    for (const puzzle of puzzles) {
      for (const theme of puzzle.themes) {
        // Only count themes we have explanations for
        if (getThemeExplanation(theme)) {
          themeCounts[theme] = (themeCounts[theme] || 0) + 1;
        }
      }
    }
    // Return the most common theme we have an explanation for
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

  // Load lesson puzzles
  useEffect(() => {
    async function loadLesson() {
      setLoading(true);
      try {
        const res = await fetch(`/api/lesson-puzzles?lessonId=${lessonId}&count=6`);
        const data = await res.json();
        if (data.puzzles) {
          setPuzzles(data.puzzles);
          setLessonName(data.lessonName);
          setLessonDescription(data.lessonDescription);
          // Initialize results
          const initialResults: Record<string, PuzzleResult> = {};
          data.puzzles.forEach((p: LessonPuzzle) => {
            initialResults[p.puzzleId] = 'pending';
          });
          setResults(initialResults);

          // Track lesson started
          LearningEvents.lessonStarted(lessonId, data.lessonName);
        }
      } catch (error) {
        console.error('Failed to load lesson:', error);
      }
      setLoading(false);
    }
    loadLesson();
  }, [lessonId]);

  // Reset puzzle state when current puzzle changes or when entering retry mode
  useEffect(() => {
    if (currentPuzzle) {
      setCurrentFen(currentPuzzle.puzzleFen);
      setMoveIndex(0);
      setMoveStatus('playing');
      setSelectedSquare(null);
      setShowingSolution(false);
      setSolutionMoveShown(false);
      // Reset Duolingo-style hint state
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

  // Square styles (last move highlight + selected piece + solution highlight + hint squares)
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Duolingo-style hint: highlight the piece to move and target square
    if (showMoveHint && hintSquares) {
      styles[hintSquares.from] = {
        backgroundColor: 'rgba(88, 204, 2, 0.7)',
        boxShadow: 'inset 0 0 0 3px #58CC02',
      };
      styles[hintSquares.to] = {
        backgroundColor: 'rgba(88, 204, 2, 0.5)',
        boxShadow: 'inset 0 0 0 3px #58CC02',
      };
    } else if (solutionMoveShown && currentPuzzle) {
      // When showing solution, highlight the move that was played
      // Get the first move's from/to squares
      try {
        const chess = new Chess(currentPuzzle.puzzleFen);
        const firstMove = currentPuzzle.solutionMoves[0];
        if (firstMove) {
          const move = chess.move(firstMove);
          if (move) {
            styles[move.from] = { backgroundColor: 'rgba(88, 204, 2, 0.5)' };
            styles[move.to] = { backgroundColor: 'rgba(88, 204, 2, 0.6)' };
          }
        }
      } catch {
        // Ignore errors
      }
    } else if (currentPuzzle && moveIndex === 0 && !showMoveHint) {
      // Show last move highlight only at start (not when hint is showing)
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
  }, [selectedSquare, game, currentPuzzle, moveIndex, solutionMoveShown, showMoveHint, hintSquares]);

  // Try to make a move
  const tryMove = useCallback((from: Square, to: Square) => {
    if (!game || !currentPuzzle || moveStatus !== 'playing') return false;

    if (moveIndex >= currentPuzzle.solutionMoves.length) return false;

    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (!move) return false;

      const expectedMove = currentPuzzle.solutionMoves[moveIndex];

      // Normalize both moves by stripping check/checkmate symbols for comparison
      // This handles cases where puzzle says Qe6+ but actual position is Qe6# (mate)
      const normalizeMove = (m: string) => m.replace(/[+#]$/, '');
      if (normalizeMove(move.san) === normalizeMove(expectedMove)) {
        // Correct move
        setCurrentFen(gameCopy.fen());
        setSelectedSquare(null);

        // Clear hint highlights and reset attempts for next move in solution
        setShowMoveHint(false);
        setHintSquares(null);
        setWrongAttempts(0);

        // Play move or capture sound based on whether piece was captured
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
          const puzzleNum = completedPuzzleCount + 1;
          setMoveStatus('correct');
          setFeedbackMessage(getPuzzleResponse(true, newStreak, currentPuzzle.themes, streak, puzzleNum));
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

            // Play move or capture sound for opponent
            if (oppMove && oppMove.captured) {
              playCaptureSound();
            } else {
              playMoveSound();
            }

            if (nextMoveIndex + 1 >= currentPuzzle.solutionMoves.length) {
              const newStreak = streak + 1;
              const puzzleNum = completedPuzzleCount + 1;
              setMoveStatus('correct');
              setFeedbackMessage(getPuzzleResponse(true, newStreak, currentPuzzle.themes, streak, puzzleNum));
              playCorrectSound(completedPuzzleCount);
              setStreak(newStreak);
              setCompletedPuzzleCount(c => c + 1);
            }
          } catch {
            const newStreak = streak + 1;
            const puzzleNum = completedPuzzleCount + 1;
            setMoveStatus('correct');
            setFeedbackMessage(getPuzzleResponse(true, newStreak, currentPuzzle.themes, streak, puzzleNum));
            playCorrectSound(completedPuzzleCount);
            setStreak(newStreak);
            setCompletedPuzzleCount(c => c + 1);
          }
        }, 400);

        return true;
      } else {
        // Check if this is an alternate checkmate - if so, accept it!
        const isMatingPuzzle = currentPuzzle.themes.some((t: string) =>
          t.toLowerCase().includes('mate')
        );

        if (isMatingPuzzle && gameCopy.isCheckmate()) {
          // They found an alternate checkmate - that's correct!
          setCurrentFen(gameCopy.fen());
          setSelectedSquare(null);
          // Clear hint highlights and reset attempts
          setShowMoveHint(false);
          setHintSquares(null);
          setWrongAttempts(0);
          if (move.captured) {
            playCaptureSound();
          } else {
            playMoveSound();
          }
          const newStreak = streak + 1;
          const puzzleNum = completedPuzzleCount + 1;
          setMoveStatus('correct');
          setFeedbackMessage(getPuzzleResponse(true, newStreak, currentPuzzle.themes, streak, puzzleNum));
          playCorrectSound(completedPuzzleCount);
          setStreak(newStreak);
          setCompletedPuzzleCount(c => c + 1);
          return true;
        }

        // Wrong move - Duolingo style flow
        setSelectedSquare(null);
        playErrorSound();
        setStreak(0);
        setHadWrongAnswer(true);
        setPuzzleHadWrongAttempt(true); // Mark this puzzle as having a wrong attempt for final scoring

        // If hint is already showing, just let them keep trying (no popup)
        if (showMoveHint) {
          return false;
        }

        const newWrongAttempts = wrongAttempts + 1;
        setWrongAttempts(newWrongAttempts);

        if (newWrongAttempts < 3) {
          // Let them try again - reset position and show popup
          const puzzleNum = completedPuzzleCount + 1;
          setMoveStatus('wrong');
          setFeedbackMessage(`Oops, that's not correct. ${3 - newWrongAttempts} ${3 - newWrongAttempts === 1 ? 'attempt' : 'attempts'} remaining.`);
        } else {
          // After 3 wrong attempts, show hint squares for current move
          try {
            // Use currentFen (current position), not puzzleFen (starting position)
            if (currentFen) {
              const chess = new Chess(currentFen);
              const currentMove = currentPuzzle.solutionMoves[moveIndex];
              if (currentMove) {
                const hintMove = chess.move(currentMove);
                if (hintMove) {
                  setHintSquares({ from: hintMove.from as Square, to: hintMove.to as Square });
                  setShowMoveHint(true);
                  // Don't reset position or moveIndex - stay at current move
                  // Stay in playing mode - no popup needed
                  return false;
                }
              }
            }
          } catch {
            // Fallback to old behavior if we can't parse hint
          }
          const puzzleNum = completedPuzzleCount + 1;
          setMoveStatus('wrong');
          setFeedbackMessage(getPuzzleResponse(false, 0, currentPuzzle.themes, streak, puzzleNum));
        }
        return false;
      }
    } catch {
      return false;
    }
  }, [game, currentPuzzle, currentFen, moveIndex, moveStatus, streak, completedPuzzleCount, wrongAttempts, showMoveHint]);

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

  // Record result and advance
  const recordAndAdvance = useCallback((result: 'correct' | 'wrong') => {
    if (!currentPuzzle) return;

    // Update results
    setResults(prev => ({ ...prev, [currentPuzzle.puzzleId]: result }));

    // Record puzzle attempt for stats (with theme data for profile)
    recordPuzzleAttempt(currentPuzzle.puzzleId, lessonId, result === 'correct', {
      themes: currentPuzzle.themes,
      rating: currentPuzzle.rating,
      fen: currentPuzzle.puzzleFen,
      solution: currentPuzzle.solution,
    });

    // Track puzzle attempt in analytics
    LearningEvents.puzzleAttempted(lessonId, currentIndex + 1, result === 'correct', currentPuzzle.rating);

    // Check if this is end of current set
    if (currentIndex >= totalPuzzles - 1) {
      if (inRetryMode) {
        // Check if any retries were wrong
        const stillWrong = retryQueue.filter(p =>
          results[p.puzzleId] === 'wrong' || (p.puzzleId === currentPuzzle.puzzleId && result === 'wrong')
        );

        if (stillWrong.length > 0 || result === 'wrong') {
          // Need to retry the ones that are still wrong
          const newRetryQueue = result === 'wrong'
            ? [currentPuzzle]
            : [];
          setRetryQueue(newRetryQueue);
          setCurrentIndex(0);

          if (newRetryQueue.length === 0) {
            // All done!
            setLessonComplete(true);
            completeLesson(lessonId);
            playCelebrationSound(correctCount);
          }
        } else {
          // All retries passed!
          setLessonComplete(true);
          completeLesson(lessonId);
          playCelebrationSound(correctCount);
        }
      } else {
        // End of main puzzles - check for wrong answers
        const wrongPuzzles = puzzles.filter(p =>
          results[p.puzzleId] === 'wrong' || (p.puzzleId === currentPuzzle.puzzleId && result === 'wrong')
        );

        if (wrongPuzzles.length > 0 || result === 'wrong') {
          // Enter retry mode
          const toRetry = result === 'wrong'
            ? [...wrongPuzzles.filter(p => p.puzzleId !== currentPuzzle.puzzleId), currentPuzzle]
            : wrongPuzzles;
          setRetryQueue(toRetry);
          setInRetryMode(true);
          setCurrentIndex(0);
        } else {
          // Perfect score!
          setLessonComplete(true);
          completeLesson(lessonId);
          playCelebrationSound(correctCount);
        }
      }
    } else {
      // Move to next puzzle
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentPuzzle, currentIndex, totalPuzzles, inRetryMode, retryQueue, puzzles, results, completeLesson, recordPuzzleAttempt, lessonId]);

  // Handle continue after correct/wrong
  // Note: If user had ANY wrong attempt on this puzzle, it counts as wrong for scoring
  // even if they eventually solved it (Duolingo-style first-try scoring)
  const handleContinue = useCallback(() => {
    if (moveStatus === 'correct') {
      // If they had a wrong attempt earlier, still count as wrong for final score
      recordAndAdvance(puzzleHadWrongAttempt ? 'wrong' : 'correct');
    } else if (moveStatus === 'wrong') {
      recordAndAdvance('wrong');
    }
  }, [moveStatus, recordAndAdvance, puzzleHadWrongAttempt]);

  // Duolingo-style: Let user try again from current position (don't reset)
  const handleTryAgain = useCallback(() => {
    if (!currentPuzzle) return;

    // Just return to playing mode - don't reset position or moveIndex
    // User stays at the current move they're working on
    setMoveStatus('playing');
    setSelectedSquare(null);
  }, [currentPuzzle]);

  // Show solution by playing the first move on the board (fallback for old flow)
  const showSolutionAndContinue = useCallback(() => {
    if (!currentPuzzle || !currentFen) return;

    setShowingSolution(true);

    // Play the first solution move on the board
    try {
      const chess = new Chess(currentPuzzle.puzzleFen);
      const firstMove = currentPuzzle.solutionMoves[0];
      if (firstMove) {
        chess.move(firstMove);
        setCurrentFen(chess.fen());
        setSolutionMoveShown(true);
      }
    } catch {
      // If move fails, just show notation
    }
  }, [currentPuzzle, currentFen]);

  // Progress stats
  const correctCount = Object.values(results).filter(r => r === 'correct').length;
  const wrongCount = Object.values(results).filter(r => r === 'wrong').length;

  if (loading) {
    return (
      <div className="h-screen bg-[#131F24] text-white flex flex-col overflow-hidden">
        <style>{streakStyles}</style>
        {/* Header placeholder */}
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => {
                const levelKey = getLevelKeyFromLessonId(lessonId);
                router.push(isGuest ? `/learn?guest=true&level=${levelKey}` : `/learn?level=${levelKey}`);
              }}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex-1 mx-4">
              <div className="h-3 bg-[#0D1A1F] rounded-full overflow-hidden border border-white/10">
                <div className="h-full w-0 bg-[#58CC02]" />
              </div>
            </div>
            <div className="text-gray-400">0/6</div>
          </div>
        </div>
        {/* Loading content */}
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

  if (lessonComplete) {
    return (
      <>
        <LessonCompleteScreen
          correctCount={correctCount}
          wrongCount={wrongCount}
          lessonName={lessonName}
          lessonId={lessonId}
          isGuest={isGuest}
          getLevelKeyFromLessonId={getLevelKeyFromLessonId}
        />
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
      <div className="h-screen bg-[#131F24] text-white flex flex-col overflow-hidden">
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => {
                const levelKey = getLevelKeyFromLessonId(lessonId);
                router.push(isGuest ? `/learn?guest=true&level=${levelKey}` : `/learn?level=${levelKey}`);
              }}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex-1 mx-4" />
            <div />
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
      <style>{streakStyles}</style>
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              const levelKey = getLevelKeyFromLessonId(lessonId);
              router.push(isGuest ? `/learn?guest=true&level=${levelKey}` : `/learn?level=${levelKey}`);
            }}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>

          {/* Progress bar with streak effect */}
          <div className="flex-1 mx-4">
            <div className="h-3 bg-[#0D1A1F] rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + (moveStatus === 'correct' ? 1 : 0)) / totalPuzzles) * 100}%`,
                  ...getStreakStyle(streak, hadWrongAnswer),
                }}
              />
            </div>
          </div>

          <div className="text-gray-400">
            {currentIndex + 1}/{totalPuzzles}
            {inRetryMode && <span className="text-yellow-400 ml-2">(retry)</span>}
          </div>
        </div>
      </div>

      {/* Main content - fixed layout to prevent board movement */}
      <div className="flex-1 flex flex-col items-center px-4 pt-1 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Theme + Turn indicator on same line */}
          <div className="flex items-center justify-between mb-2 h-8">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-gray-300">{lessonName}</h1>
              {inRetryMode && (
                <span className="text-yellow-400 text-xs">(retry)</span>
              )}
              {primaryTheme && (
                <HelpIconButton onClick={() => setShowHelpModal(true)} />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-base font-bold ${
                currentPuzzle.playerColor === 'white' ? 'text-white' : 'text-gray-300'
              }`}>
                {currentPuzzle.playerColor === 'white' ? 'White' : 'Black'} to move
              </span>
              <button
                onClick={() => toggleFlag(currentPuzzle.puzzleId)}
                className={`p-1 rounded transition-colors ${
                  flaggedPuzzles.has(currentPuzzle.puzzleId)
                    ? 'text-red-500 bg-red-500/20'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/10'
                }`}
                title={flaggedPuzzles.has(currentPuzzle.puzzleId) ? 'Unflag puzzle' : 'Flag puzzle as problematic'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chessboard */}
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
          </div>

          {/* Result popup - directly below board */}
          {moveStatus === 'correct' && (
            <PuzzleResultPopup
              type="correct"
              message={feedbackMessage}
              onContinue={handleContinue}
            />
          )}

          {moveStatus === 'wrong' && !showMoveHint && (
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
