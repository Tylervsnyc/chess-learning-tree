/**
 * Coaching Stats — cross-session aggregation for Rookie's coaching.
 *
 * Computes user patterns over time: accuracy by theme, improvement trends,
 * recurring weak spots. Powers the premium coaching experience.
 *
 * All queries hit game_sessions + session_moves tables.
 */

import { createClient } from '@/lib/supabase/client';

// ════════════════════════════════
// DB ROW TYPES (match Supabase query shapes)
// ════════════════════════════════

interface SessionRow {
  id: string;
  session_type: string;
  result: string | null;
  pieces_hung: number | null;
  captures_missed: number | null;
  themes_correct: string[] | null;
  themes_missed: string[] | null;
  created_at: string;
}

interface MoveRow {
  puzzle_theme: string | null;
  correct: boolean | null;
  created_at: string;
  session_id: string;
}

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export interface ThemeAccuracy {
  theme: string;
  attempts: number;
  correct: number;
  accuracy: number;       // 0-1
}

export interface ThemeTrend {
  theme: string;
  current7d: number;      // accuracy last 7 days (0-1)
  previous7d: number;     // accuracy 8-14 days ago (0-1)
  improving: boolean;
  delta: number;           // current - previous
}

export interface CoachingProfile {
  userId: string;
  // Session-level
  totalSessions: number;
  totalPlayRookieGames: number;
  totalDailyRooks: number;
  totalLessons: number;
  // Theme accuracy (all time)
  themeAccuracy: ThemeAccuracy[];
  // Strongest and weakest themes
  strongThemes: string[];   // top 3 by accuracy (min 3 attempts)
  weakThemes: string[];     // bottom 3 by accuracy (min 3 attempts)
  // Trends (7d vs prev 7d)
  trends: ThemeTrend[];
  // Recurring issues
  recurringWeaknesses: string[];  // themes missed 3+ sessions in a row
  // Play Rookie specific
  piecesHungTotal: number;
  capturesMissedTotal: number;
  winRate: number;          // 0-1, play-rookie games only
}

// ════════════════════════════════
// CURRENT SESSION STATS (free tier)
// ════════════════════════════════

export interface SessionCoachingData {
  themesSeen: string[];
  themesCorrect: string[];
  themesMissed: string[];
  puzzlesTotal: number;
  puzzlesCorrect: number;
  bestStreak: number;
  piecesHung: number;
  capturesMissed: number;
  result?: string;
}

/**
 * Build coaching context from a single session (free tier).
 * No DB queries — works from in-memory session data.
 */
export function getSessionCoachingData(sessionData: {
  themesSeen: string[];
  themesCorrect: string[];
  themesMissed: string[];
  puzzlesTotal?: number;
  puzzlesCorrect?: number;
  bestStreak?: number;
  piecesHung: number;
  capturesMissed: number;
  result?: string;
}): SessionCoachingData {
  return {
    themesSeen: sessionData.themesSeen,
    themesCorrect: sessionData.themesCorrect,
    themesMissed: sessionData.themesMissed,
    puzzlesTotal: sessionData.puzzlesTotal || 0,
    puzzlesCorrect: sessionData.puzzlesCorrect || 0,
    bestStreak: sessionData.bestStreak || 0,
    piecesHung: sessionData.piecesHung,
    capturesMissed: sessionData.capturesMissed,
    result: sessionData.result,
  };
}

// ════════════════════════════════
// CROSS-SESSION PROFILE (premium tier)
// ════════════════════════════════

/**
 * Build full coaching profile from DB history (premium tier).
 * Queries game_sessions and session_moves for the last 30 days.
 */
export async function getCoachingProfile(userId: string): Promise<CoachingProfile> {
  const supabase = createClient();
  const now = new Date();
  const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const d14 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

  // Fetch sessions (last 30 days)
  const { data: sessions } = await supabase
    .from('game_sessions')
    .select('id, session_type, result, pieces_hung, captures_missed, themes_correct, themes_missed, created_at')
    .eq('user_id', userId)
    .gte('created_at', d30)
    .order('created_at', { ascending: false });

  // Fetch puzzle moves with themes (last 30 days)
  const { data: puzzleMoves } = await supabase
    .from('session_moves')
    .select('puzzle_theme, correct, created_at, session_id')
    .not('puzzle_theme', 'is', null)
    .gte('created_at', d30)
    .in('session_id', ((sessions || []) as SessionRow[]).map(s => s.id));

  const allSessions: SessionRow[] = (sessions || []) as SessionRow[];
  const allMoves: MoveRow[] = (puzzleMoves || []) as MoveRow[];

  // Session counts
  const totalPlayRookie = allSessions.filter(s => s.session_type === 'play-rookie').length;
  const totalDailyRook = allSessions.filter(s => s.session_type === 'daily-rook').length;
  const totalLessons = allSessions.filter(s => s.session_type === 'lesson').length;

  // Win rate (play-rookie only)
  const prGames = allSessions.filter(s => s.session_type === 'play-rookie' && s.result);
  const wins = prGames.filter(s => s.result === 'win').length;
  const winRate = prGames.length > 0 ? wins / prGames.length : 0;

  // Pieces hung / captures missed totals
  const piecesHungTotal = allSessions.reduce((sum, s) => sum + (s.pieces_hung || 0), 0);
  const capturesMissedTotal = allSessions.reduce((sum, s) => sum + (s.captures_missed || 0), 0);

  // Theme accuracy (all 30 days)
  const themeStats = new Map<string, { attempts: number; correct: number }>();
  for (const m of allMoves) {
    if (!m.puzzle_theme) continue;
    const stat = themeStats.get(m.puzzle_theme) || { attempts: 0, correct: 0 };
    stat.attempts++;
    if (m.correct) stat.correct++;
    themeStats.set(m.puzzle_theme, stat);
  }

  const themeAccuracy: ThemeAccuracy[] = Array.from(themeStats.entries())
    .map(([theme, stat]) => ({
      theme,
      attempts: stat.attempts,
      correct: stat.correct,
      accuracy: stat.attempts > 0 ? stat.correct / stat.attempts : 0,
    }))
    .sort((a, b) => b.attempts - a.attempts);

  // Strong/weak themes (min 3 attempts)
  const qualified = themeAccuracy.filter(t => t.attempts >= 3);
  const sorted = [...qualified].sort((a, b) => a.accuracy - b.accuracy);
  const weakThemes = sorted.slice(0, 3).map(t => t.theme);
  const strongThemes = sorted.slice(-3).reverse().map(t => t.theme);

  // Trends: last 7 days vs previous 7 days
  const recent = allMoves.filter(m => m.created_at >= d7);
  const previous = allMoves.filter(m => m.created_at >= d14 && m.created_at < d7);

  const calcAccuracy = (moves: typeof allMoves, theme: string) => {
    const themed = moves.filter(m => m.puzzle_theme === theme);
    if (themed.length === 0) return -1; // no data
    return themed.filter(m => m.correct).length / themed.length;
  };

  const trends: ThemeTrend[] = [];
  for (const theme of themeStats.keys()) {
    const cur = calcAccuracy(recent, theme);
    const prev = calcAccuracy(previous, theme);
    if (cur === -1) continue;
    trends.push({
      theme,
      current7d: cur,
      previous7d: prev === -1 ? cur : prev,
      improving: prev !== -1 ? cur > prev : false,
      delta: prev !== -1 ? cur - prev : 0,
    });
  }

  // Recurring weaknesses: themes that appear in themes_missed across 3+ sessions
  const themeFailStreaks = new Map<string, number>();
  for (const s of allSessions) {
    const missed = s.themes_missed as string[] || [];
    for (const t of missed) {
      themeFailStreaks.set(t, (themeFailStreaks.get(t) || 0) + 1);
    }
  }
  const recurringWeaknesses = Array.from(themeFailStreaks.entries())
    .filter(([, count]) => count >= 3)
    .map(([theme]) => theme);

  return {
    userId,
    totalSessions: allSessions.length,
    totalPlayRookieGames: totalPlayRookie,
    totalDailyRooks: totalDailyRook,
    totalLessons,
    themeAccuracy,
    strongThemes,
    weakThemes,
    trends,
    recurringWeaknesses,
    piecesHungTotal,
    capturesMissedTotal,
    winRate,
  };
}
