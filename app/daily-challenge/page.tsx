'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { useUser } from '@/hooks/useUser';
import { useLessonProgress } from '@/hooks/useProgress';
import { createClient } from '@/lib/supabase/client';
import { ThemeHelpModal, HelpIconButton } from '@/components/puzzle/ThemeHelpModal';
import { getThemeExplanation } from '@/data/theme-explanations';
import {
  playCorrectSound,
  playErrorSound,
  playMoveSound,
  playCaptureSound,
  warmupAudio,
} from '@/lib/sounds';
import { ShareButton } from '@/components/share/ShareButton';
import { StreakCelebrationPopup } from '@/components/streak/StreakCelebrationPopup';

interface Puzzle {
  puzzleId: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
  gameUrl: string;
}

// Processed puzzle format (like LessonPuzzle)
interface ProcessedPuzzle {
  puzzleId: string;
  originalFen: string;
  puzzleFen: string; // Position after opponent's first move
  rating: number;
  themes: string[];
  solutionMoves: string[]; // Player's moves in SAN format
  uciSolutionMoves: string[]; // Player's moves in UCI format (for sharing)
  playerColor: 'white' | 'black';
  lastMoveFrom: string;
  lastMoveTo: string;
}

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  puzzlesCompleted: number;
  timeMs: number; // completion time in ms
  isCurrentUser: boolean;
}

const TOTAL_TIME = 5 * 60 * 1000; // 5 minutes in ms
const MAX_LIVES = 3;

// Transform raw puzzle to processed format (like lesson page)
function processPuzzle(puzzle: Puzzle): ProcessedPuzzle {
  const chess = new Chess(puzzle.fen);

  // First move is opponent's setup move
  const setupMove = puzzle.moves[0];
  const from = setupMove.slice(0, 2);
  const to = setupMove.slice(2, 4);
  const promotion = setupMove.length > 4 ? setupMove[4] : undefined;

  chess.move({ from, to, promotion });

  const puzzleFen = chess.fen();
  const playerColor = chess.turn() === 'w' ? 'white' : 'black';

  // Convert remaining UCI moves to SAN (player's solution moves)
  const solutionMoves: string[] = [];
  const tempChess = new Chess(puzzleFen);

  for (let i = 1; i < puzzle.moves.length; i++) {
    const uciMove = puzzle.moves[i];
    const moveFrom = uciMove.slice(0, 2);
    const moveTo = uciMove.slice(2, 4);
    const movePromo = uciMove.length > 4 ? uciMove[4] : undefined;

    try {
      const move = tempChess.move({ from: moveFrom, to: moveTo, promotion: movePromo });
      if (move) {
        solutionMoves.push(move.san);
      }
    } catch {
      solutionMoves.push(uciMove);
    }
  }

  return {
    puzzleId: puzzle.puzzleId,
    originalFen: puzzle.fen,
    puzzleFen,
    rating: puzzle.rating,
    themes: puzzle.themes,
    solutionMoves,
    uciSolutionMoves: puzzle.moves.slice(1), // Original UCI moves (skip setup move)
    playerColor,
    lastMoveFrom: from,
    lastMoveTo: to,
  };
}

export default function DailyChallengePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const {
    recordDailyActivity,
    currentStreak,
    streakJustExtended,
    previousStreak,
    dismissStreakCelebration,
  } = useLessonProgress();

  // Dev mode: use ?testSeed=X to get different puzzles
  const testSeed = searchParams.get('testSeed');

  // Game state - simple: just an array of puzzles and current index
  const [gameState, setGameState] = useState<'ready' | 'loading' | 'playing' | 'finished'>('ready');
  const [allPuzzles, setAllPuzzles] = useState<ProcessedPuzzle[]>([]);
  const [puzzleIndex, setPuzzleIndex] = useState(0);

  // Board state (like lesson page pattern)
  const [currentFen, setCurrentFen] = useState<string | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveStatus, setMoveStatus] = useState<'playing' | 'correct' | 'incorrect'>('playing');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Challenge stats
  const [lives, setLives] = useState(MAX_LIVES);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [puzzlesWrong, setPuzzlesWrong] = useState(0);

  // Track results for each puzzle
  const [puzzleResults, setPuzzleResults] = useState<Record<string, 'correct' | 'wrong'>>({});

  // Review mode state
  const [reviewingPuzzle, setReviewingPuzzle] = useState<ProcessedPuzzle | null>(null);
  const [reviewMoveIndex, setReviewMoveIndex] = useState(0);
  const [reviewFen, setReviewFen] = useState<string | null>(null);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Track if user already completed today (prevents replay)
  const [alreadyCompletedToday, setAlreadyCompletedToday] = useState(false);
  const [checkingCompletion, setCheckingCompletion] = useState(true);

  // Help modal state
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Leaderboard view toggle - default to My Standing
  const [showMyStanding, setShowMyStanding] = useState(true);

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasRecordedRef = useRef(false);

  // Current puzzle - simple array index
  const currentPuzzle = allPuzzles[puzzleIndex] || null;

  // Derive game from currentFen (like lesson page - prevents jerky updates)
  const game = useMemo(() => {
    const fen = currentFen || currentPuzzle?.puzzleFen;
    if (!fen) return null;
    try {
      return new Chess(fen);
    } catch {
      return null;
    }
  }, [currentFen, currentPuzzle]);

  // Board orientation based on player color
  const boardOrientation = currentPuzzle?.playerColor || 'white';

  // Review game (for finished screen)
  const reviewGame = useMemo(() => {
    if (!reviewFen) return null;
    try {
      return new Chess(reviewFen);
    } catch {
      return null;
    }
  }, [reviewFen]);

  // Start reviewing a puzzle
  const startReview = useCallback((puzzle: ProcessedPuzzle) => {
    setReviewingPuzzle(puzzle);
    setReviewFen(puzzle.puzzleFen);
    setReviewMoveIndex(0);
  }, []);

  // Play next move in review
  const playNextReviewMove = useCallback(() => {
    if (!reviewingPuzzle || !reviewGame) return;
    if (reviewMoveIndex >= reviewingPuzzle.solutionMoves.length) return;

    const move = reviewingPuzzle.solutionMoves[reviewMoveIndex];
    try {
      const newGame = new Chess(reviewGame.fen());
      newGame.move(move);
      setReviewFen(newGame.fen());
      setReviewMoveIndex(prev => prev + 1);
      playMoveSound();
    } catch {
      // Move failed
    }
  }, [reviewingPuzzle, reviewGame, reviewMoveIndex]);

  // Reset review to start
  const resetReview = useCallback(() => {
    if (!reviewingPuzzle) return;
    setReviewFen(reviewingPuzzle.puzzleFen);
    setReviewMoveIndex(0);
  }, [reviewingPuzzle]);

  // Close review
  const closeReview = useCallback(() => {
    setReviewingPuzzle(null);
    setReviewFen(null);
    setReviewMoveIndex(0);
  }, []);

  // Get list of attempted puzzles with results
  const attemptedPuzzles = useMemo(() => {
    return allPuzzles
      .filter(p => puzzleResults[p.puzzleId])
      .map(p => ({
        ...p,
        result: puzzleResults[p.puzzleId],
      }));
  }, [allPuzzles, puzzleResults]);

  // Check if user already completed today's challenge
  useEffect(() => {
    const checkTodayCompletion = async () => {
      if (!user) {
        setCheckingCompletion(false);
        return;
      }

      try {
        const res = await fetch('/api/daily-challenge/leaderboard?limit=10');
        const data = await res.json();

        // Check if user has a result - either in userEntry OR in leaderboard with isCurrentUser
        const userInLeaderboard = (data.leaderboard || []).find((e: LeaderboardEntry) => e.isCurrentUser);
        const existingResult = data.userEntry || userInLeaderboard;

        if (existingResult) {
          // User already completed today - show finished screen
          setAlreadyCompletedToday(true);
          setPuzzlesSolved(existingResult.puzzlesCompleted);
          setTimeLeft(TOTAL_TIME - existingResult.timeUsedMs);
          setLeaderboard(data.leaderboard || []);
          setUserEntry(data.userEntry || userInLeaderboard);
          setGameState('finished');
        }
      } catch (error) {
        console.error('Failed to check completion:', error);
      }

      setCheckingCompletion(false);
    };

    checkTodayCompletion();
  }, [user]);

  // Warmup audio on first interaction
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

  // Timer effect - use end time ref for accuracy
  const endTimeRef = useRef<number>(0);

  useEffect(() => {
    if (gameState === 'playing') {
      // Set end time when game starts
      if (endTimeRef.current === 0) {
        endTimeRef.current = Date.now() + TOTAL_TIME;
      }

      timerRef.current = setInterval(() => {
        const remaining = endTimeRef.current - Date.now();
        if (remaining <= 0) {
          setTimeLeft(0);
          setGameState('finished');
          if (timerRef.current) clearInterval(timerRef.current);
        } else {
          setTimeLeft(remaining);
        }
      }, 100);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else if (gameState === 'ready' || gameState === 'loading') {
      // Reset end time when not playing
      endTimeRef.current = 0;
    }
  }, [gameState]);

  // Initialize puzzle when currentElo or tierPuzzleIndex changes
  useEffect(() => {
    if (currentPuzzle && gameState === 'playing') {
      setCurrentFen(currentPuzzle.puzzleFen);
      setMoveIndex(0);
      setMoveStatus('playing');
      setSelectedSquare(null);
    }
  }, [currentPuzzle, gameState]);

  // Fetch today's puzzles
  const fetchDailyPuzzles = useCallback(async () => {
    try {
      const url = testSeed
        ? `/api/daily-challenge/puzzles?testSeed=${testSeed}`
        : '/api/daily-challenge/puzzles';
      const res = await fetch(url);
      const data = await res.json();
      if (data.puzzles) {
        const processed = data.puzzles.map((p: Puzzle) => processPuzzle(p));
        setAllPuzzles(processed);
        return processed;
      }
    } catch (error) {
      console.error('Failed to fetch daily puzzles:', error);
    }
    return [];
  }, [testSeed]);

  // Start the challenge
  const startChallenge = async () => {
    // Reset state
    setLives(MAX_LIVES);
    setStreak(0);
    setTimeLeft(TOTAL_TIME);
    setPuzzlesSolved(0);
    setPuzzlesWrong(0);
    setPuzzleResults({});
    setPuzzleIndex(0);
    setCurrentFen(null);
    setMoveIndex(0);
    setMoveStatus('playing');
    setSelectedSquare(null);
    setReviewingPuzzle(null);
    hasRecordedRef.current = false;

    // Show loading state
    setGameState('loading');

    // Fetch puzzles FIRST
    const puzzles = await fetchDailyPuzzles();

    // Only start the game (and timer) after puzzles are loaded
    if (puzzles.length > 0) {
      setCurrentFen(puzzles[0].puzzleFen);
      setGameState('playing');
    }
  };

  // Handle correct answer - advance to next puzzle
  const handleCorrect = useCallback(() => {
    setStreak(prev => prev + 1);
    setPuzzlesSolved(prev => prev + 1);
    setMoveStatus('correct');
    playCorrectSound(puzzlesSolved);

    // Record result
    if (currentPuzzle) {
      setPuzzleResults(prev => ({ ...prev, [currentPuzzle.puzzleId]: 'correct' }));
    }

    // Advance to next puzzle after brief delay
    setTimeout(() => {
      const nextIndex = puzzleIndex + 1;
      if (nextIndex >= allPuzzles.length) {
        // Completed all puzzles!
        setGameState('finished');
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setPuzzleIndex(nextIndex);
        setMoveIndex(0);
        setMoveStatus('playing');
        setSelectedSquare(null);
      }
    }, 600);
  }, [currentPuzzle, puzzlesSolved, puzzleIndex, allPuzzles.length]);

  // Handle incorrect answer - lose a life, advance to next puzzle
  const handleIncorrect = useCallback(() => {
    const newLives = lives - 1;
    setLives(newLives);
    setStreak(0);
    setPuzzlesWrong(prev => prev + 1);
    setMoveStatus('incorrect');
    playErrorSound();

    // Record result
    if (currentPuzzle) {
      setPuzzleResults(prev => ({ ...prev, [currentPuzzle.puzzleId]: 'wrong' }));
    }

    if (newLives <= 0) {
      setGameState('finished');
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      // Advance to next puzzle
      setTimeout(() => {
        const nextIndex = puzzleIndex + 1;
        if (nextIndex >= allPuzzles.length) {
          setGameState('finished');
          if (timerRef.current) clearInterval(timerRef.current);
        } else {
          setPuzzleIndex(nextIndex);
          setMoveIndex(0);
          setMoveStatus('playing');
          setSelectedSquare(null);
        }
      }, 800);
    }
  }, [lives, currentPuzzle, puzzleIndex, allPuzzles.length]);

  // Try to make a move (core puzzle logic from lesson page)
  const tryMove = useCallback((from: Square, to: Square): boolean => {
    if (!game || !currentPuzzle || moveStatus !== 'playing') return false;
    if (moveIndex >= currentPuzzle.solutionMoves.length) return false;

    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (!move) return false;

      const expectedMove = currentPuzzle.solutionMoves[moveIndex];
      const normalizeMove = (m: string) => m.replace(/[+#]$/, '');

      if (normalizeMove(move.san) === normalizeMove(expectedMove)) {
        // Correct move!
        setCurrentFen(gameCopy.fen());
        setSelectedSquare(null);

        if (move.captured) {
          playCaptureSound();
        } else {
          playMoveSound();
        }

        const nextMoveIndex = moveIndex + 1;
        setMoveIndex(nextMoveIndex);

        // Check if puzzle complete
        if (nextMoveIndex >= currentPuzzle.solutionMoves.length) {
          handleCorrect();
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

            if (oppMove?.captured) {
              playCaptureSound();
            } else {
              playMoveSound();
            }

            // Check if puzzle complete after opponent move
            if (nextMoveIndex + 1 >= currentPuzzle.solutionMoves.length) {
              handleCorrect();
            }
          } catch {
            // Puzzle complete
            handleCorrect();
          }
        }, 300);

        return true;
      } else {
        // Wrong move
        setSelectedSquare(null);
        handleIncorrect();
        return false;
      }
    } catch {
      return false;
    }
  }, [game, currentPuzzle, moveIndex, moveStatus, handleCorrect, handleIncorrect]);

  // Handle piece drop (drag and drop)
  const onDrop = useCallback(({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string; piece: string }) => {
    if (!targetSquare) return false;
    setSelectedSquare(null);
    return tryMove(sourceSquare as Square, targetSquare as Square);
  }, [tryMove]);

  // Handle square click (click-to-move)
  const onSquareClick = useCallback(
    ({ square }: { piece: { pieceType: string } | null; square: string }) => {
      if (!game || moveStatus !== 'playing' || gameState !== 'playing') return;
      const clickedSquare = square as Square;

      if (!selectedSquare) {
        // No square selected - select if it's player's piece
        const piece = game.get(clickedSquare);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(clickedSquare);
        }
      } else if (selectedSquare === clickedSquare) {
        // Clicked same square - deselect
        setSelectedSquare(null);
      } else {
        // Different square clicked - try to move or select new piece
        const legalMoves = game.moves({ square: selectedSquare, verbose: true });
        const isLegalMove = legalMoves.some(m => m.to === clickedSquare);

        if (isLegalMove) {
          tryMove(selectedSquare, clickedSquare);
        } else {
          // Not a legal move - check if clicking on another friendly piece
          const piece = game.get(clickedSquare);
          if (piece && piece.color === game.turn()) {
            setSelectedSquare(clickedSquare);
          } else {
            setSelectedSquare(null);
          }
        }
      }
    },
    [game, selectedSquare, moveStatus, gameState, tryMove]
  );

  // Record result to Supabase
  const recordResult = useCallback(async (finalPuzzlesSolved: number, finalTimeLeft: number) => {
    if (!user) {
      console.warn('Cannot record result: user not logged in');
      return;
    }
    if (hasRecordedRef.current) return;
    hasRecordedRef.current = true;

    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from('daily_challenge_results').upsert({
      user_id: user.id,
      challenge_date: today,
      score: finalPuzzlesSolved, // score = puzzles completed
      puzzles_completed: finalPuzzlesSolved,
      time_used_ms: TOTAL_TIME - finalTimeLeft,
    }, { onConflict: 'user_id,challenge_date' });

    if (error) {
      console.error('Failed to record result:', error.message, error.code);
    } else {
      console.log('Daily challenge result recorded:', { puzzles: finalPuzzlesSolved, time: TOTAL_TIME - finalTimeLeft });
      setAlreadyCompletedToday(true); // Prevent replay in same session
    }
  }, [user]);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await fetch('/api/daily-challenge/leaderboard?limit=10');
      const data = await res.json();
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
        setUserEntry(data.userEntry);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
    setLoadingLeaderboard(false);
  }, []);

  // Record when finished and fetch leaderboard
  useEffect(() => {
    if (gameState === 'finished') {
      recordResult(puzzlesSolved, timeLeft);
      // Update global day streak (per RULES.md Section 11)
      recordDailyActivity();
      setTimeout(() => fetchLeaderboard(), 500);
    }
  }, [gameState, puzzlesSolved, timeLeft, recordResult, fetchLeaderboard, recordDailyActivity]);

  // Format time display
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Find primary theme from current puzzle for help modal
  const primaryTheme = useMemo(() => {
    if (!currentPuzzle?.themes) return null;
    for (const theme of currentPuzzle.themes) {
      if (getThemeExplanation(theme)) return theme;
    }
    return null;
  }, [currentPuzzle]);

  // Square styles (highlight opponent's last move and selected square)
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Highlight opponent's last move with orange (only before player's first move)
    if (currentPuzzle && moveIndex === 0 && !selectedSquare) {
      styles[currentPuzzle.lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
      styles[currentPuzzle.lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
    }

    // Highlight selected square and show legal moves
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
  }, [currentPuzzle, moveIndex, selectedSquare, game]);

  // Loading state while checking if user already completed today
  if (checkingCompletion) {
    return (
      <div className="h-screen bg-[#1A2C35] flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="text-center max-w-sm w-full">
          {/* Same brand logo as ready screen for seamless transition */}
          <div className="mb-6">
            <svg width="120" height="120" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2">
              <rect x="15" y="3" width="18" height="18" rx="4" fill="#4ade80"/>
              <rect x="63" y="3" width="18" height="18" rx="4" fill="#a78bfa"/>
              <rect x="39" y="27" width="18" height="18" rx="4" fill="#38bdf8"/>
              <rect x="63" y="27" width="18" height="18" rx="4" fill="#a78bfa"/>
              <rect x="15" y="51" width="18" height="18" rx="4" fill="#fb923c"/>
              <rect x="39" y="51" width="18" height="18" rx="4" fill="#f87171"/>
              <rect x="15" y="75" width="18" height="18" rx="4" fill="#fbbf24"/>
            </svg>
            <div className="text-2xl font-bold">
              <span className="text-white">chess</span>
              <span className="bg-gradient-to-r from-[#4ade80] via-[#38bdf8] to-[#a78bfa] bg-clip-text text-transparent">path</span>
            </div>
          </div>
          <div
            className="inline-block px-6 py-3 rounded-xl mb-6 border-2 border-[#FF9600]/50"
            style={{ background: 'linear-gradient(135deg, rgba(255,150,0,0.15), rgba(255,107,107,0.15))' }}
          >
            <h1
              className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF9600] via-[#FF6B6B] to-[#FF9600]"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              DAILY CHALLENGE
            </h1>
          </div>
          <div className="text-gray-400 animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  // Ready screen
  if (gameState === 'ready' || gameState === 'loading') {
    return (
      <div className="h-screen bg-[#1A2C35] flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="text-center max-w-sm w-full">
          {/* Brand logo with wordmark - compact */}
          <div className="mb-3">
            <svg width="72" height="72" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-1">
              <rect x="15" y="3" width="18" height="18" rx="4" fill="#4ade80"/>
              <rect x="63" y="3" width="18" height="18" rx="4" fill="#a78bfa"/>
              <rect x="39" y="27" width="18" height="18" rx="4" fill="#38bdf8"/>
              <rect x="63" y="27" width="18" height="18" rx="4" fill="#a78bfa"/>
              <rect x="15" y="51" width="18" height="18" rx="4" fill="#fb923c"/>
              <rect x="39" y="51" width="18" height="18" rx="4" fill="#f87171"/>
              <rect x="15" y="75" width="18" height="18" rx="4" fill="#fbbf24"/>
            </svg>
            <div className="text-xl font-bold">
              <span className="text-white">chess</span>
              <span className="bg-gradient-to-r from-[#4ade80] via-[#38bdf8] to-[#a78bfa] bg-clip-text text-transparent">path</span>
            </div>
          </div>

          <div
            className="inline-block px-4 py-2 rounded-xl mb-3 border-2 border-[#FF9600]/50"
            style={{ background: 'linear-gradient(135deg, rgba(255,150,0,0.15), rgba(255,107,107,0.15))' }}
          >
            <h1
              className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF9600] via-[#FF6B6B] to-[#FF9600]"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              DAILY CHALLENGE
            </h1>
          </div>

          {/* Fun description - compact */}
          <div className="bg-[#131F24] rounded-xl p-3 mb-3 text-left space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#38bdf8]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#38bdf8] font-bold text-xs">5</span>
              </div>
              <div className="text-white font-medium text-sm">5 minutes on the clock</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#4ade80]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <div className="text-white font-medium text-sm">Puzzles get harder as you go</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#f87171]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#f87171] font-bold text-xs">3</span>
              </div>
              <div className="text-white font-medium text-sm">3 mistakes and you&apos;re out</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#fbbf24]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-[#fbbf24]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 3h14a2 2 0 0 1 2 2v2a5 5 0 0 1-5 5h-1v2h2a2 2 0 0 1 2 2v4h-4v-2H9v2H5v-4a2 2 0 0 1 2-2h2v-2H8a5 5 0 0 1-5-5V5a2 2 0 0 1 2-2z"/>
                </svg>
              </div>
              <div className="text-white font-medium text-sm">Same puzzles for everyone</div>
            </div>
          </div>

          <button
            onClick={startChallenge}
            disabled={gameState === 'loading'}
            className="w-full py-3 rounded-xl text-white font-bold text-lg transition-transform active:scale-[0.98] disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}
          >
            {gameState === 'loading' ? 'Loading puzzles...' : "Let's Go!"}
          </button>

          <button
            onClick={() => router.push('/learn')}
            className="mt-2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            Back to Path
          </button>
        </div>
      </div>
    );
  }

  // Dummy leaderboard data (sorted by puzzles desc, then time asc)
  const dummyLeaderboard: LeaderboardEntry[] = [
    { rank: 1, displayName: 'GrandMaster42', puzzlesCompleted: 18, timeMs: 245000, isCurrentUser: false },
    { rank: 2, displayName: 'TacticQueen', puzzlesCompleted: 16, timeMs: 198000, isCurrentUser: false },
    { rank: 3, displayName: 'ChessNinja', puzzlesCompleted: 15, timeMs: 212000, isCurrentUser: false },
    { rank: 4, displayName: 'PawnStorm', puzzlesCompleted: 14, timeMs: 187000, isCurrentUser: false },
    { rank: 5, displayName: 'BishopSniper', puzzlesCompleted: 13, timeMs: 234000, isCurrentUser: false },
    { rank: 6, displayName: 'KnightRider99', puzzlesCompleted: 12, timeMs: 178000, isCurrentUser: false },
    { rank: 7, displayName: 'RookieMove', puzzlesCompleted: 11, timeMs: 256000, isCurrentUser: false },
    { rank: 8, displayName: 'CheckMate101', puzzlesCompleted: 10, timeMs: 189000, isCurrentUser: false },
    { rank: 9, displayName: 'CastleKing', puzzlesCompleted: 9, timeMs: 221000, isCurrentUser: false },
    { rank: 10, displayName: 'EndgameExpert', puzzlesCompleted: 8, timeMs: 167000, isCurrentUser: false },
  ];

  // Use dummy data if no real leaderboard
  const displayLeaderboard = leaderboard.length > 0 ? leaderboard : dummyLeaderboard;

  // Completion time (time used)
  const completionTimeMs = TOTAL_TIME - timeLeft;

  // Dummy user standing
  const dummyUserEntry: LeaderboardEntry = {
    rank: 47,
    displayName: 'You',
    puzzlesCompleted: puzzlesSolved,
    timeMs: completionTimeMs,
    isCurrentUser: true,
  };

  // Finished screen with leaderboard
  if (gameState === 'finished') {
    return (
      <div className="h-screen bg-[#1A2C35] flex flex-col items-center py-6 px-4 overflow-auto">
        <div className="text-center max-w-sm w-full">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <svg width="32" height="32" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="15" y="3" width="18" height="18" rx="4" fill="#4ade80"/>
                <rect x="63" y="3" width="18" height="18" rx="4" fill="#a78bfa"/>
                <rect x="39" y="27" width="18" height="18" rx="4" fill="#38bdf8"/>
                <rect x="63" y="27" width="18" height="18" rx="4" fill="#a78bfa"/>
                <rect x="15" y="51" width="18" height="18" rx="4" fill="#fb923c"/>
                <rect x="39" y="51" width="18" height="18" rx="4" fill="#f87171"/>
                <rect x="15" y="75" width="18" height="18" rx="4" fill="#fbbf24"/>
              </svg>
              <div className="text-lg font-bold">
                <span className="text-white">chess</span>
                <span className="bg-gradient-to-r from-[#4ade80] via-[#38bdf8] to-[#a78bfa] bg-clip-text text-transparent">path</span>
              </div>
            </div>
            <div
              className="inline-block px-4 py-1.5 rounded-lg border-2 border-[#FF9600]/50 mt-1"
              style={{ background: 'linear-gradient(135deg, rgba(255,150,0,0.15), rgba(255,107,107,0.15))' }}
            >
              <span
                className="text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF9600] via-[#FF6B6B] to-[#FF9600]"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                DAILY CHALLENGE
              </span>
            </div>
          </div>

          {/* Results card - compact */}
          <div className="bg-gradient-to-br from-[#131F24] to-[#0D1A1F] rounded-xl p-3 mb-3 border border-white/5">
            <div className="flex items-center justify-between">
              {/* Left: puzzle count */}
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black bg-gradient-to-r from-[#58CC02] to-[#4ade80] bg-clip-text text-transparent">
                  {puzzlesSolved}
                </span>
                <span className="text-gray-400 text-sm">/ {allPuzzles.length}</span>
              </div>

              {/* Right: time and mistakes */}
              <div className="flex gap-3 text-right">
                <div>
                  <div className="text-white font-bold text-sm">{formatTime(TOTAL_TIME - timeLeft)}</div>
                  <div className="text-gray-500 text-[10px]">time</div>
                </div>
                <div>
                  <div className={`font-bold text-sm ${MAX_LIVES - lives === 0 ? 'text-[#58CC02]' : 'text-[#FF4B4B]'}`}>
                    {MAX_LIVES - lives}
                  </div>
                  <div className="text-gray-500 text-[10px]">mistakes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-[#131F24] rounded-xl p-3 mb-4">
            {/* Toggle buttons */}
            <div className="flex rounded-lg bg-[#0D1A1F] p-1 mb-3">
              <button
                onClick={() => setShowMyStanding(false)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  !showMyStanding ? 'bg-[#1A2C35] text-white' : 'text-gray-400'
                }`}
              >
                Top 10
              </button>
              <button
                onClick={() => setShowMyStanding(true)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  showMyStanding ? 'bg-[#1A2C35] text-white' : 'text-gray-400'
                }`}
              >
                My Standing
              </button>
            </div>

            {loadingLeaderboard ? (
              <div className="text-gray-400 py-3 text-sm">Loading...</div>
            ) : showMyStanding ? (
              /* My Standing view */
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#58CC02]/20 border border-[#58CC02]/30">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#58CC02]/30 flex items-center justify-center text-[#58CC02] font-bold text-sm">
                      #{userEntry?.rank || dummyUserEntry.rank}
                    </span>
                    <div className="text-left">
                      <div className="text-[#58CC02] font-semibold text-sm">Your Rank</div>
                      <div className="text-gray-400 text-xs">out of 1,247 players today</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">{puzzlesSolved} puzzles</div>
                    <div className="text-gray-500 text-xs">{formatTime(completionTimeMs)}</div>
                  </div>
                </div>
                <div className="text-center text-gray-500 text-xs py-2">
                  {puzzlesSolved > 0 ? `Beat ${Math.max(0, (userEntry?.rank || dummyUserEntry.rank) - 1)} players!` : 'Complete puzzles to rank up!'}
                </div>
              </div>
            ) : (
              /* Top 10 view */
              <div className="space-y-1">
                {displayLeaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      entry.isCurrentUser ? 'bg-[#58CC02]/20 border border-[#58CC02]/30' : 'bg-[#0D1A1F]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 text-center font-bold text-xs ${
                        entry.rank === 1 ? 'text-yellow-400' :
                        entry.rank === 2 ? 'text-gray-300' :
                        entry.rank === 3 ? 'text-orange-400' :
                        'text-gray-500'
                      }`}>
                        #{entry.rank}
                      </span>
                      <span className={`text-sm ${entry.isCurrentUser ? 'text-[#58CC02] font-semibold' : 'text-white'}`}>
                        {entry.displayName}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-sm">{entry.puzzlesCompleted} puzzles</div>
                      <div className="text-gray-500 text-[10px]">{formatTime(entry.timeMs)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Puzzle Review Section */}
          {attemptedPuzzles.length > 0 && (
            <div className="bg-[#131F24] rounded-xl p-3 mb-4">
              <h2 className="text-sm font-bold text-white mb-2">Review Puzzles</h2>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {attemptedPuzzles.map((puzzle, idx) => (
                  <button
                    key={puzzle.puzzleId}
                    onClick={() => startReview(puzzle)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      reviewingPuzzle?.puzzleId === puzzle.puzzleId
                        ? 'bg-[#38bdf8]/20 border border-[#38bdf8]/30'
                        : 'bg-[#0D1A1F] hover:bg-[#1A2C35]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                        puzzle.result === 'correct'
                          ? 'bg-[#58CC02]/20 text-[#58CC02]'
                          : 'bg-[#FF4B4B]/20 text-[#FF4B4B]'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="text-white text-sm">Puzzle {idx + 1}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{puzzle.rating}</span>
                  </button>
                ))}
              </div>

              {/* Review Board */}
              {reviewingPuzzle && reviewGame && (
                <div className="mt-3">
                  <div className="bg-[#0D1A1F] rounded-lg p-2 mb-2">
                    <Chessboard
                      options={{
                        position: reviewGame.fen(),
                        boardOrientation: reviewingPuzzle.playerColor,
                        boardStyle: {
                          borderRadius: '6px',
                        },
                        darkSquareStyle: { backgroundColor: '#779952' },
                        lightSquareStyle: { backgroundColor: '#edeed1' },
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={resetReview}
                      className="flex-1 py-2 rounded-lg bg-[#0D1A1F] text-gray-400 text-xs font-medium hover:bg-[#1A2C35] transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={playNextReviewMove}
                      disabled={reviewMoveIndex >= reviewingPuzzle.solutionMoves.length}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                        reviewMoveIndex >= reviewingPuzzle.solutionMoves.length
                          ? 'bg-gray-700 text-gray-500'
                          : 'bg-[#58CC02] text-white hover:bg-[#4CAF00]'
                      }`}
                    >
                      {reviewMoveIndex >= reviewingPuzzle.solutionMoves.length
                        ? 'Done'
                        : `Play ${reviewingPuzzle.solutionMoves[reviewMoveIndex]}`}
                    </button>
                    <div className="relative">
                      <ShareButton
                        fen={reviewingPuzzle.puzzleFen}
                        playerColor={reviewingPuzzle.playerColor}
                        lastMoveFrom={reviewingPuzzle.lastMoveFrom}
                        lastMoveTo={reviewingPuzzle.lastMoveTo}
                        source="daily_challenge"
                      />
                    </div>
                    <button
                      onClick={closeReview}
                      className="flex-1 py-2 rounded-lg bg-[#0D1A1F] text-gray-400 text-xs font-medium hover:bg-[#1A2C35] transition-colors"
                    >
                      Close
                    </button>
                  </div>
                  <div className="text-center text-gray-500 text-[10px] mt-1">
                    Move {reviewMoveIndex}/{reviewingPuzzle.solutionMoves.length}
                  </div>
                </div>
              )}
            </div>
          )}

          {alreadyCompletedToday ? (
            <>
              <button
                onClick={() => router.push('/learn')}
                className="w-full py-3 rounded-xl text-white font-bold transition-transform active:scale-[0.98] shadow-[0_4px_0_#3d8c01]"
                style={{ backgroundColor: '#58CC02' }}
              >
                Keep Training →
              </button>
              <div className="mt-3 text-gray-500 text-sm text-center">
                New challenge drops at midnight!
              </div>
            </>
          ) : (
            <>
              <button
                onClick={startChallenge}
                className="w-full py-3 rounded-xl text-white font-bold transition-transform active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}
              >
                Play Again
              </button>
              <button
                onClick={() => router.push('/learn')}
                className="mt-2 text-gray-500 hover:text-gray-300 transition-colors block w-full text-sm"
              >
                Back to Path
              </button>
            </>
          )}
        </div>

        {/* Streak Celebration Popup */}
        <StreakCelebrationPopup
          isOpen={streakJustExtended}
          previousStreak={previousStreak}
          newStreak={currentStreak}
          onClose={dismissStreakCelebration}
        />
      </div>
    );
  }

  // Playing screen
  return (
    <div className="h-screen bg-[#1A2C35] text-white overflow-hidden flex flex-col">
      {/* Header with stats */}
      <div
        className="px-4 py-2"
        style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <svg key={i} className={`w-5 h-5 ${i < lives ? 'text-white' : 'text-white/30'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ))}
          </div>
          <div className="text-xl font-bold">{formatTime(timeLeft)}</div>
          <div className="text-right">
            <div className="text-[10px] opacity-80">Solved</div>
            <div className="font-bold text-sm">{puzzlesSolved}</div>
          </div>
        </div>
      </div>

      {/* Stats bar - fixed height to prevent layout shift */}
      <div className="bg-[#131F24] h-10 flex items-center justify-center gap-4">
        {/* Correct counter */}
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded border-2 border-[#58CC02] bg-[#58CC02]/20 flex items-center justify-center">
            <span className="text-[#58CC02] font-bold text-sm">{puzzlesSolved}</span>
          </div>
          <span className="text-gray-500 text-[10px]">correct</span>
        </div>

        {/* Streak indicator - always takes space */}
        <div className={`px-2 py-0.5 rounded text-xs font-medium ${
          streak > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'text-transparent'
        }`}>
          {streak > 0 ? `${streak} streak${streak >= 3 ? ` +${Math.floor(streak / 3) * 10}` : ''}` : '-'}
        </div>

        {/* Wrong counter */}
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded border-2 border-[#FF4B4B] bg-[#FF4B4B]/20 flex items-center justify-center">
            <span className="text-[#FF4B4B] font-bold text-sm">{puzzlesWrong}</span>
          </div>
          <span className="text-gray-500 text-[10px]">wrong</span>
        </div>
      </div>

      {/* Simple puzzle counter */}
      <div className="bg-[#131F24] h-8 flex items-center justify-center text-sm">
        <span className="text-white font-bold">Puzzle {puzzleIndex + 1}</span>
        <span className="text-gray-500 ml-1">/ {allPuzzles.length}</span>
      </div>

      {/* Board container */}
      <div className="flex-1 flex flex-col max-w-sm mx-auto px-3 py-2 w-full">
        <div className="mb-2">
          {game && (
            <Chessboard
              options={{
                position: game.fen(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onPieceDrop: (args: any) =>
                  onDrop({ sourceSquare: args.sourceSquare, targetSquare: args.targetSquare, piece: args.piece }),
                onSquareClick: onSquareClick,
                boardOrientation: boardOrientation,
                squareStyles: squareStyles,
                boardStyle: {
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                },
                darkSquareStyle: { backgroundColor: '#779952' },
                lightSquareStyle: { backgroundColor: '#edeed1' },
              }}
            />
          )}
        </div>

        {/* Status */}
        <div className="text-center text-sm">
          {moveStatus === 'playing' && currentPuzzle && game && (
            <div className="flex flex-col items-center gap-1">
              <div className={`font-bold ${game.turn() === 'w' ? 'text-white' : 'text-gray-300'}`}>
                {game.turn() === 'w' ? 'White' : 'Black'} to move
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <span>Find the best move</span>
                {primaryTheme && (
                  <HelpIconButton onClick={() => setShowHelpModal(true)} />
                )}
              </div>
            </div>
          )}
          {moveStatus === 'correct' && (
            <div className="text-green-400 font-semibold animate-pulse">
              Correct!
            </div>
          )}
          {moveStatus === 'incorrect' && (
            <div className="text-red-400 font-semibold">
              Wrong! {lives > 0 ? 'Next puzzle...' : 'No lives left'}
            </div>
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
