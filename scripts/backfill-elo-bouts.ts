/**
 * backfill-elo-bouts.ts — ONE-OFF backfill for the 2026-08-07 model change:
 * Chess Boxing bouts now feed the Chess Path ELO (one game event per bout) and
 * the Rookie matchmaking rating (double weight, BOUT_GAME_WEIGHT).
 *
 * Stored values were computed WITHOUT bouts, and old bouts predate each user's
 * `elo_updated_at` watermark, so the incremental catch-up would never see them.
 * This recomputes both ratings for every user under the new model and rewrites:
 *   profiles.estimated_elo + elo_updated_at   (Chess Path ELO + watermark)
 *   profiles.rookie_rating + rookie_rating_events (matchmaking rating)
 *
 * Mirrors lib/elo/profile-elo.ts fetchEvents + lib/rookie/rating.ts derive —
 * imports only the PURE modules (estimate.ts, rookie-levels) so it runs under
 * tsx without Next.
 *
 * Run: npx tsx scripts/backfill-elo-bouts.ts [--dry]
 */
import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { estimateElo, applyEloEvent, isRatedEloEvent, type EloEvent } from '../lib/elo/estimate';
import { getLevelElo } from '../lib/rookie-levels';
import ratingIndex from '../data/puzzle-rating-index.json';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s+/g, '');
if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
const supabase: SupabaseClient = createClient(supabaseUrl, serviceRoleKey);

const DRY = process.argv.includes('--dry');
const PUZZLE_RATINGS = ratingIndex as Record<string, number>;
const BOUT_GAME_WEIGHT = 2; // keep in sync with lib/rookie/rating.ts
const EPOCH = '1970-01-01T00:00:00Z';

function scoreFromResult(result: string | null): number | null {
  if (result === 'win') return 1;
  if (result === 'draw') return 0.5;
  if (result === 'loss') return 0;
  return null;
}

interface UserEvents {
  all: EloEvent[]; // puzzles + games + bouts (bout = 1 event) — Chess Path ELO
  games: EloEvent[]; // games + bouts×WEIGHT — Rookie rating replay
}

async function fetchUserEvents(userId: string): Promise<UserEvents> {
  const [puzzles, games, bouts] = await Promise.all([
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
    supabase
      .from('bout_sessions')
      .select('level, result, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(5000),
  ]);
  for (const r of [puzzles, games, bouts]) {
    if (r.error && !/bout_sessions/.test(r.error.message ?? '')) {
      throw new Error(`read failed for ${userId}: ${r.error.message}`);
    }
  }

  const all: EloEvent[] = [];
  const gameEvents: EloEvent[] = [];

  for (const p of puzzles.data ?? []) {
    const rating = PUZZLE_RATINGS[p.puzzle_id as string];
    if (typeof rating !== 'number' || !p.attempted_at) continue;
    all.push({ at: p.attempted_at, kind: 'puzzle', opponent: rating, score: p.correct ? 1 : 0 });
  }
  for (const g of games.data ?? []) {
    const score = scoreFromResult(g.result as string | null);
    if (score === null || !g.ended_at) continue;
    const e: EloEvent = {
      at: g.ended_at,
      kind: 'game',
      opponent: getLevelElo((g.rookie_difficulty as number | null) ?? 1),
      score,
    };
    all.push(e);
    gameEvents.push(e);
  }
  for (const b of bouts.data ?? []) {
    const score = scoreFromResult(b.result as string | null);
    if (score === null || !b.created_at || typeof b.level !== 'number') continue;
    const e: EloEvent = { at: b.created_at, kind: 'game', opponent: getLevelElo(b.level), score };
    all.push(e);
    for (let i = 0; i < BOUT_GAME_WEIGHT; i++) gameEvents.push(e);
  }

  const byTime = (a: EloEvent, b: EloEvent) => a.at.localeCompare(b.at);
  return {
    all: all.filter(isRatedEloEvent).sort(byTime),
    games: gameEvents.filter(isRatedEloEvent).sort(byTime),
  };
}

async function main() {
  const { data: profiles, error } = await supabase.from('profiles').select('id, estimated_elo, rookie_rating');
  if (error) throw error;

  let changed = 0;
  for (const profile of profiles ?? []) {
    const userId = profile.id as string;
    const { all, games } = await fetchUserEvents(userId);

    // Chess Path ELO: full replay under the new model.
    const estimate = estimateElo(all);
    const watermark = all.length > 0 ? all[all.length - 1].at : EPOCH;

    // Rookie rating: seeded from the fresh estimate, then every game + bout.
    let rookie = estimate.current;
    games.forEach((e, i) => {
      rookie = applyEloEvent(rookie, e, i);
    });
    rookie = Math.round(rookie);

    const before = `elo ${profile.estimated_elo ?? '—'} rookie ${profile.rookie_rating ?? '—'}`;
    const after = `elo ${estimate.current} rookie ${rookie} (events ${estimate.events}, games ${games.length})`;
    console.log(`${userId}  ${before}  →  ${after}`);

    if (!DRY) {
      const { error: writeErr } = await supabase
        .from('profiles')
        .update({
          estimated_elo: estimate.current,
          elo_updated_at: watermark,
          rookie_rating: rookie,
          rookie_rating_events: games.length,
        })
        .eq('id', userId);
      if (writeErr) throw new Error(`write failed for ${userId}: ${writeErr.message}`);
    }
    changed++;
  }
  console.log(`\n${DRY ? 'DRY RUN — ' : ''}${changed} profiles recomputed.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
