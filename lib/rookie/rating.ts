/**
 * lib/rookie/rating.ts
 *
 * The ROOKIE RATING — the one number that decides how strong Rookie plays.
 *
 * Distinct from Chess Path ELO, deliberately (RULES §20):
 *   - Chess Path ELO is the DISPLAY rating. Puzzles dominate it, and it's the
 *     legible-progress number on the profile and completion popup.
 *   - The Rookie rating is the MATCHMAKING rating. Games only. It exists to
 *     answer one question — how hard should she play — and it is allowed to
 *     fall, which the display rating's job doesn't require.
 *
 * They share the one Elo update step (`applyEloEvent` in lib/elo/estimate.ts).
 * Never write a second one; that function's provisional-K ramp is what makes a
 * new player's level land fast and then settle.
 *
 * Seeded from Chess Path ELO on first read, so someone who has solved fifty
 * puzzles doesn't get put back in Baby Mode, and backfilled from the games
 * they have already played — `game_sessions` already stores
 * `rookie_difficulty` + `result`, so no data migration is needed.
 *
 * Storage: `profiles.rookie_rating` + `profiles.rookie_rating_events`. Both
 * are optional at runtime — until the DDL is run on the live DB the whole
 * module degrades to "derive it every time", which is correct, just slower.
 * A rating must never fail in a player's face over a missing column.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { applyEloEvent, ELO_BASELINE, type EloEvent } from '@/lib/elo/estimate';
import { getCurrentElo } from '@/lib/elo/profile-elo';
import { getLevelElo } from '@/lib/rookie-levels';

export interface RookieRating {
  rating: number;
  /** Games folded in so far — drives the provisional-K ramp. */
  events: number;
  /** True while the rating is still moving fast and shouldn't be trusted hard. */
  provisional: boolean;
}

/** Games before the rating is considered settled. Matches the Elo ramp. */
export const SETTLED_AFTER_GAMES = 15;

/** True when a Supabase error is just "that column/table isn't there yet". */
function isMissingSchema(message: string | undefined): boolean {
  return /rookie_rating|does not exist|column .* of relation/i.test(message ?? '');
}

function scoreFromResult(result: string | null | undefined): number | null {
  if (result === 'win') return 1;
  if (result === 'loss') return 0;
  if (result === 'draw') return 0.5;
  return null;
}

/**
 * Every finished Rookie game the user has played, oldest first, as Elo events.
 * The opponent rating is the level's ELO — which is exactly why the ladder has
 * to be calibrated (lib/rookie/calibrate.ts): a wrong ladder here is a wrong
 * rating for everyone.
 */
async function fetchGameEvents(supabase: SupabaseClient, userId: string): Promise<EloEvent[]> {
  const { data, error } = await supabase
    .from('game_sessions')
    .select('rookie_difficulty, result, ended_at')
    .eq('user_id', userId)
    .not('ended_at', 'is', null)
    .order('ended_at', { ascending: true });

  if (error) {
    console.error('rookie rating: game read failed', error);
    return [];
  }

  const events: EloEvent[] = [];
  for (const row of data ?? []) {
    const score = scoreFromResult(row.result as string | null);
    const level = row.rookie_difficulty as number | null;
    if (score === null || typeof level !== 'number') continue;
    events.push({
      at: row.ended_at as string,
      kind: 'game',
      opponent: getLevelElo(level),
      score,
    });
  }
  return events;
}

/** Replay every game from the Chess Path seed. The slow, always-correct path. */
async function derive(supabase: SupabaseClient, userId: string): Promise<RookieRating> {
  // Seed: what we already believe about this player from everything they've
  // done, puzzles included. A brand-new player falls back to the baseline.
  let seed = ELO_BASELINE;
  try {
    seed = await getCurrentElo(supabase, userId);
  } catch {
    /* no Chess Path rating yet — baseline is the honest starting guess */
  }

  const events = await fetchGameEvents(supabase, userId);
  let rating = seed;
  events.forEach((e, i) => {
    rating = applyEloEvent(rating, e, i);
  });

  return {
    rating: Math.round(rating),
    events: events.length,
    provisional: events.length < SETTLED_AFTER_GAMES,
  };
}

/** Persist, best-effort. A missing column is expected pre-migration. */
async function store(
  supabase: SupabaseClient,
  userId: string,
  value: RookieRating,
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ rookie_rating: value.rating, rookie_rating_events: value.events })
    .eq('id', userId);
  if (error && !isMissingSchema(error.message)) {
    console.error('rookie rating: write failed', error);
  }
}

/**
 * The user's current Rookie rating. Reads the stored value when it's there,
 * derives + persists it when it isn't.
 */
export async function getRookieRating(
  supabase: SupabaseClient,
  userId: string,
): Promise<RookieRating> {
  const { data, error } = await supabase
    .from('profiles')
    .select('rookie_rating, rookie_rating_events')
    .eq('id', userId)
    .maybeSingle();

  // Pre-migration (or a read failure): derive it live. Correct, just slower.
  if (error) {
    if (!isMissingSchema(error.message)) {
      console.error('rookie rating: profile read failed', error);
    }
    return derive(supabase, userId);
  }

  const stored = data?.rookie_rating as number | null | undefined;
  const events = data?.rookie_rating_events as number | null | undefined;
  if (typeof stored !== 'number' || typeof events !== 'number') {
    const derived = await derive(supabase, userId);
    await store(supabase, userId, derived);
    return derived;
  }

  return { rating: stored, events, provisional: events < SETTLED_AFTER_GAMES };
}

/**
 * Fold ONE finished game into the rating and persist it.
 *
 * `level` is Rookie's level in that game and `score` the user's result. The
 * rating moves both ways — a loss lowers it, which is the entire point: the
 * level is derived from this number, so falling here is how Rookie eases off
 * without any separate demotion rule to keep in sync.
 */
export async function applyGameResult(
  supabase: SupabaseClient,
  userId: string,
  level: number,
  score: 0 | 0.5 | 1,
): Promise<RookieRating> {
  const current = await getRookieRating(supabase, userId);
  const next = applyEloEvent(
    current.rating,
    { at: new Date().toISOString(), kind: 'game', opponent: getLevelElo(level), score },
    current.events,
  );

  const updated: RookieRating = {
    rating: Math.round(next),
    events: current.events + 1,
    provisional: current.events + 1 < SETTLED_AFTER_GAMES,
  };
  await store(supabase, userId, updated);
  return updated;
}
