import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getLevelElo } from '@/lib/rookie-levels';
import { estimateElo, type EloEvent } from '@/lib/elo/estimate';
import ratingIndex from '@/data/puzzle-rating-index.json';

/**
 * GET /api/profile/elo
 *
 * Estimated chess rating + rating-over-time series for the signed-in user.
 * Derived (not stored — see RULES.md §20) by replaying the user's puzzle
 * attempts and Rookie games through an Elo model. See lib/elo/estimate.ts.
 *
 *   → { current: number, events: number, series: [{ date, elo }] }
 *
 * Puzzles whose difficulty we can't resolve (lesson puzzles, the daily-
 * challenge alias) are skipped; everything else feeds the estimate.
 */

const PUZZLE_RATINGS = ratingIndex as Record<string, number>;

function scoreFromResult(result: string | null): number | null {
  switch (result) {
    case 'win':
      return 1;
    case 'draw':
      return 0.5;
    case 'loss':
      return 0;
    default:
      return null; // null / abandoned / unknown → not a rated outcome
  }
}

/**
 * The heavy part — read every puzzle attempt + game, replay through the Elo
 * model — is the same answer for ~minutes at a time and barely moves between
 * page loads. Cache it per-user for 5 minutes so navigating to /profile is
 * instant after the first hit. Uses the service client (RLS-bypassing) and
 * filters by user_id explicitly, because cookie-bound clients can't be read
 * inside an unstable_cache callback.
 */
const computeEloForUser = (userId: string) =>
  unstable_cache(
    async () => {
      const supabase = createServiceClient();

      const [puzzles, games] = await Promise.all([
        supabase
          .from('puzzle_attempts')
          .select('puzzle_id, correct, attempted_at')
          .eq('user_id', userId)
          .order('attempted_at', { ascending: true })
          .limit(10000),
        supabase
          .from('game_sessions')
          .select('rookie_difficulty, result, ended_at')
          .eq('user_id', userId)
          .not('ended_at', 'is', null)
          .order('ended_at', { ascending: true })
          .limit(5000),
      ]);

      if (puzzles.error) console.error('elo: puzzle read failed', puzzles.error);
      if (games.error) console.error('elo: game read failed', games.error);

      const events: EloEvent[] = [];

      for (const p of puzzles.data ?? []) {
        const rating = PUZZLE_RATINGS[p.puzzle_id as string];
        if (typeof rating !== 'number' || !p.attempted_at) continue;
        events.push({
          at: p.attempted_at,
          kind: 'puzzle',
          opponent: rating,
          score: p.correct ? 1 : 0,
        });
      }

      for (const g of games.data ?? []) {
        const score = scoreFromResult(g.result as string | null);
        if (score === null || !g.ended_at) continue;
        events.push({
          at: g.ended_at,
          kind: 'game',
          opponent: getLevelElo((g.rookie_difficulty as number) ?? 1),
          score,
        });
      }

      return estimateElo(events);
    },
    ['profile-elo', userId],
    { revalidate: 300 },
  )();

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const estimate = await computeEloForUser(user.id);
  return NextResponse.json(estimate);
}
