/**
 * Game Session Tracker — captures move data during play for coaching.
 *
 * Usage:
 *   const session = new GameSession('play-rookie', userId);
 *   session.setGameInfo({ playerColor: 'white', rookieDifficulty: 1 });
 *   session.recordMove({ ... });
 *   await session.end('win', 'checkmate');
 *
 * Data is written to Supabase on session end (single batch write).
 * During play, everything is held in memory — zero latency impact.
 */

import { createClient } from '@/lib/supabase/client';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export type SessionType = 'play-rookie' | 'daily-rook' | 'lesson';
export type GameResult = 'win' | 'loss' | 'draw';
export type ResultMethod = 'checkmate' | 'stalemate' | 'resignation' | 'timeout';
export type MovedBy = 'player' | 'rookie';

export interface MoveRecord {
  moveNumber: number;
  movedBy: MovedBy;
  san: string;
  piece: string;
  from: string;
  to: string;
  isCapture: boolean;
  isCheck: boolean;
  isCastling: boolean;
  fenAfter: string;
  timeToMoveMs: number | null;   // null for rookie moves
  pieceHung: boolean;
  captureAvailable: boolean;
  captureTaken: boolean;
  rookieMood: string;
}

export interface PuzzleMoveRecord {
  moveNumber: number;
  puzzleId: string;
  puzzleTheme: string;
  puzzleRating: number;
  correct: boolean;
  firstAttemptSan: string | null;
  retryCount: number;
  timeToMoveMs: number;
  fenAfter?: string;
}

export interface SessionSummary {
  sessionId: string;
  sessionType: SessionType;
  durationMs: number;
  result?: GameResult;
  resultMethod?: ResultMethod;
  totalMoves: number;
  piecesHung: number;
  capturesMissed: number;
  themesSeen: string[];
  themesCorrect: string[];
  themesMissed: string[];
  puzzlesTotal?: number;
  puzzlesCorrect?: number;
  puzzlesWrong?: number;
  bestStreak?: number;
  moves: (MoveRecord | PuzzleMoveRecord)[];
}

// ════════════════════════════════
// SESSION CLASS
// ════════════════════════════════

export class GameSession {
  private sessionType: SessionType;
  private userId: string;
  private startedAt: number;
  private moves: (MoveRecord | PuzzleMoveRecord)[] = [];

  // Game info (play-rookie)
  private playerColor: string | null = null;
  private rookieDifficulty: number | null = null;

  // Puzzle tracking
  private puzzlesCorrect = 0;
  private puzzlesWrong = 0;
  private currentStreak = 0;
  private bestStreak = 0;

  // Computed at end
  private piecesHung = 0;
  private capturesMissed = 0;
  private themesSeen = new Set<string>();
  private themesCorrect = new Set<string>();
  private themesMissed = new Set<string>();

  constructor(type: SessionType, userId: string) {
    this.sessionType = type;
    this.userId = userId;
    this.startedAt = Date.now();
  }

  setGameInfo(info: { playerColor: string; rookieDifficulty: number }) {
    this.playerColor = info.playerColor;
    this.rookieDifficulty = info.rookieDifficulty;
  }

  /** Record a move during a Play Rookie game */
  recordMove(move: MoveRecord) {
    this.moves.push(move);
    if (move.movedBy === 'player') {
      if (move.pieceHung) this.piecesHung++;
      if (move.captureAvailable && !move.captureTaken) this.capturesMissed++;
    }
  }

  /** Record a puzzle attempt (Daily Rook / Lesson) */
  recordPuzzle(puzzle: PuzzleMoveRecord) {
    this.moves.push(puzzle);
    this.themesSeen.add(puzzle.puzzleTheme);

    if (puzzle.correct) {
      this.puzzlesCorrect++;
      this.currentStreak++;
      this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
      this.themesCorrect.add(puzzle.puzzleTheme);
    } else {
      this.puzzlesWrong++;
      this.currentStreak = 0;
      this.themesMissed.add(puzzle.puzzleTheme);
    }
  }

  /** Get current session summary (for coaching prompt, before DB write) */
  getSummary(result?: GameResult, resultMethod?: ResultMethod): SessionSummary {
    const durationMs = Date.now() - this.startedAt;
    return {
      sessionId: '', // filled after DB write
      sessionType: this.sessionType,
      durationMs,
      result,
      resultMethod,
      totalMoves: this.moves.length,
      piecesHung: this.piecesHung,
      capturesMissed: this.capturesMissed,
      themesSeen: Array.from(this.themesSeen),
      themesCorrect: Array.from(this.themesCorrect),
      themesMissed: Array.from(this.themesMissed),
      puzzlesTotal: this.puzzlesCorrect + this.puzzlesWrong || undefined,
      puzzlesCorrect: this.puzzlesCorrect || undefined,
      puzzlesWrong: this.puzzlesWrong || undefined,
      bestStreak: this.bestStreak || undefined,
      moves: this.moves,
    };
  }

  /** End session — writes everything to Supabase in one batch */
  async end(result?: GameResult, resultMethod?: ResultMethod): Promise<SessionSummary | null> {
    const durationMs = Date.now() - this.startedAt;
    const supabase = createClient();

    // 1. Insert session row
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .insert({
        user_id: this.userId,
        session_type: this.sessionType,
        started_at: new Date(this.startedAt).toISOString(),
        ended_at: new Date().toISOString(),
        duration_ms: durationMs,
        result: result || null,
        result_method: resultMethod || null,
        player_color: this.playerColor,
        rookie_difficulty: this.rookieDifficulty,
        puzzles_total: this.puzzlesCorrect + this.puzzlesWrong || null,
        puzzles_correct: this.puzzlesCorrect || null,
        puzzles_wrong: this.puzzlesWrong || null,
        best_streak: this.bestStreak || null,
        total_moves: this.moves.length,
        pieces_hung: this.piecesHung,
        captures_missed: this.capturesMissed,
        themes_seen: Array.from(this.themesSeen),
        themes_correct: Array.from(this.themesCorrect),
        themes_missed: Array.from(this.themesMissed),
      })
      .select('id')
      .single();

    if (sessionError || !session) {
      console.error('Failed to save game session:', sessionError);
      return null;
    }

    // 2. Insert all moves in batch
    if (this.moves.length > 0) {
      const moveRows = this.moves.map((m, i) => {
        if ('san' in m) {
          // MoveRecord (play-rookie)
          return {
            session_id: session.id,
            move_number: m.moveNumber,
            moved_by: m.movedBy,
            move_san: m.san,
            piece: m.piece,
            from_square: m.from,
            to_square: m.to,
            is_capture: m.isCapture,
            is_check: m.isCheck,
            is_castling: m.isCastling,
            fen_after: m.fenAfter,
            time_to_move_ms: m.timeToMoveMs,
            piece_hung: m.pieceHung,
            capture_available: m.captureAvailable,
            capture_taken: m.captureTaken,
            rookie_mood: m.rookieMood,
          };
        } else {
          // PuzzleMoveRecord (daily-rook / lesson)
          return {
            session_id: session.id,
            move_number: i + 1,
            puzzle_id: m.puzzleId,
            puzzle_theme: m.puzzleTheme,
            puzzle_rating: m.puzzleRating,
            correct: m.correct,
            first_attempt_san: m.firstAttemptSan,
            retry_count: m.retryCount,
            time_to_move_ms: m.timeToMoveMs,
            fen_after: m.fenAfter || null,
          };
        }
      });

      const { error: movesError } = await supabase
        .from('session_moves')
        .insert(moveRows);

      if (movesError) {
        console.error('Failed to save session moves:', movesError);
      }
    }

    const summary = this.getSummary(result, resultMethod);
    summary.sessionId = session.id;
    return summary;
  }
}
