/**
 * Client side of "grade once": post a finished graded pass to
 * POST /api/games/[id]/grades. Fire-and-forget — a failed save leaves the game
 * ungraded (move_grades NULL), which /review and the backfill both handle.
 */

import type { GameAnalysis } from '@/lib/game-eval';
import { toStoredGrades } from '@/lib/review/grade';

export async function saveGameGrades(sessionId: string, analysis: GameAnalysis, level: number | null): Promise<void> {
  try {
    const res = await fetch(`/api/games/${sessionId}/grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grades: toStoredGrades(analysis, level) }),
    });
    if (!res.ok) console.warn('[grades] save failed:', res.status);
  } catch (err) {
    console.warn('[grades] save failed:', err);
  }
}
