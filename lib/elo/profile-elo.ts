import { unstable_cache } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createServiceClient } from '@/lib/supabase/service';
import { getLevelElo } from '@/lib/rookie-levels';
import {
  estimateElo,
  applyEloEvent,
  isRatedEloEvent,
  PROVISIONAL_EVENTS,
  type EloEvent,
  type EloEstimate,
} from '@/lib/elo/estimate';
import ratingIndex from '@/data/puzzle-rating-index.json';

/**
 * Estimated chess rating + rating-over-time series for a user — shared by
 * GET /api/profile/elo and GET /api/profile/dashboard.
 *
 *   → { current: number, events: number, series: [{ date, elo }] }
 *
 * The rating is DERIVED by replaying the user's puzzle attempts and Rookie
 * games through an Elo model (lib/elo/estimate.ts) — but since CHE-375 the
 * latest value is also CACHED on the profile (`profiles.estimated_elo` +
 * `profiles.elo_updated_at` watermark) so reads don't replay up to 10,000
 * attempts + 5,000 games every time. `getCurrentElo` reads the stored value
 * and folds in only the events newer than the watermark, using the SAME
 * per-event update step as the batch replay (applyEloEvent) so the two paths
 * can never drift.
 *
 * Puzzles whose difficulty we can't resolve (lesson puzzles, the daily-
 * challenge alias) are skipped; everything else feeds the estimate.
 */

const PUZZLE_RATINGS = ratingIndex as Record<string, number>;

// Watermark stored for a user with no rated history yet — every future event
// is strictly newer than this, so the first real event is always picked up.
const EPOCH = '1970-01-01T00:00:00Z';

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

// ── Row → EloEvent mappers (single source for both full + incremental) ──────

interface PuzzleRow {
  puzzle_id: string;
  correct: boolean;
  attempted_at: string | null;
}

interface GameRow {
  rookie_difficulty: number | null;
  result: string | null;
  ended_at: string | null;
}

function puzzleRowToEvent(p: PuzzleRow): EloEvent | null {
  const rating = PUZZLE_RATINGS[p.puzzle_id];
  if (typeof rating !== 'number' || !p.attempted_at) return null;
  return { at: p.attempted_at, kind: 'puzzle', opponent: rating, score: p.correct ? 1 : 0 };
}

function gameRowToEvent(g: GameRow): EloEvent | null {
  const score = scoreFromResult(g.result);
  if (score === null || !g.ended_at) return null;
  return { at: g.ended_at, kind: 'game', opponent: getLevelElo(g.rookie_difficulty ?? 1), score };
}

/**
 * Fetch a user's rated events, sorted chronologically. With `since`, fetches
 * ONLY events strictly newer than that timestamp — the cheap, indexed
 * catch-up read (note prod column is `puzzle_attempts.attempted_at`, NOT
 * created_at). `ok` is false if either table read errored, in which case the
 * result may be partial and must NOT be persisted as a watermark.
 */
async function fetchEvents(
  supabase: SupabaseClient,
  userId: string,
  since?: string,
): Promise<{ events: EloEvent[]; ok: boolean }> {
  let puzzleQ = supabase
    .from('puzzle_attempts')
    .select('puzzle_id, correct, attempted_at')
    .eq('user_id', userId)
    .order('attempted_at', { ascending: true })
    .limit(10000);
  if (since) puzzleQ = puzzleQ.gt('attempted_at', since);

  let gameQ = supabase
    .from('game_sessions')
    .select('rookie_difficulty, result, ended_at')
    .eq('user_id', userId)
    .not('ended_at', 'is', null)
    .order('ended_at', { ascending: true })
    .limit(5000);
  if (since) gameQ = gameQ.gt('ended_at', since);

  const [puzzles, games] = await Promise.all([puzzleQ, gameQ]);

  if (puzzles.error) console.error('elo: puzzle read failed', puzzles.error);
  if (games.error) console.error('elo: game read failed', games.error);

  const events: EloEvent[] = [];
  for (const p of (puzzles.data ?? []) as PuzzleRow[]) {
    const e = puzzleRowToEvent(p);
    if (e) events.push(e);
  }
  for (const g of (games.data ?? []) as GameRow[]) {
    const e = gameRowToEvent(g);
    if (e) events.push(e);
  }

  return {
    events: events.filter(isRatedEloEvent).sort((a, b) => a.at.localeCompare(b.at)),
    ok: !puzzles.error && !games.error,
  };
}

// ── Full replay (series + cache) ─────────────────────────────────────────────

/**
 * The full replay — read every puzzle attempt + game, replay through the Elo
 * model. Still the source of the day-by-day `series`; `current` now comes
 * from the cheap stored-watermark path (getCurrentElo) instead.
 */
export const runEloCompute = async (userId: string): Promise<EloEstimate> => {
  const supabase = createServiceClient();
  const { events } = await fetchEvents(supabase, userId);
  return estimateElo(events);
};

/**
 * The full replay is the same answer for ~minutes at a time and barely moves
 * between page loads. Cache it per-user for 5 minutes so navigating to
 * /profile is instant after the first hit. Uses the service client
 * (RLS-bypassing) and filters by user_id explicitly, because cookie-bound
 * clients can't be read inside an unstable_cache callback.
 */
export const computeEloForUser = (userId: string) =>
  unstable_cache(() => runEloCompute(userId), ['profile-elo', userId], {
    revalidate: 300,
  })();

// ── Incremental current rating (CHE-375) ────────────────────────────────────

async function writeEloWatermark(
  supabase: SupabaseClient,
  userId: string,
  elo: number,
  at: string,
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ estimated_elo: elo, elo_updated_at: at })
    .eq('id', userId);
  if (error) console.error('elo: watermark write failed', error);
}

/** Full replay + persist the result and the latest-event watermark. */
async function backfillElo(supabase: SupabaseClient, userId: string): Promise<number> {
  const { events, ok } = await fetchEvents(supabase, userId);
  const estimate = estimateElo(events);
  if (ok) {
    const latest = events.length > 0 ? events[events.length - 1].at : EPOCH;
    await writeEloWatermark(supabase, userId, estimate.current, latest);
  }
  return estimate.current;
}

// How many of the oldest prior puzzle attempts we're willing to scan to pin
// down a provisional-period event index. Past this, just recompute fully.
const PRIOR_PROBE_LIMIT = 500;

/**
 * 0-based index of the FIRST event after the watermark within the user's full
 * history — needed because the provisional-K ramp (first PROVISIONAL_EVENTS
 * events) depends on the global event index. Returns the exact count when
 * it's below PROVISIONAL_EVENTS, PROVISIONAL_EVENTS once the ramp is provably
 * over (any value past the ramp behaves identically in applyEloEvent), or
 * null when it can't be determined cheaply (caller falls back to the full
 * replay).
 */
async function getPriorEventIndex(
  supabase: SupabaseClient,
  userId: string,
  upTo: string,
): Promise<number | null> {
  // Games: the rated-game filter is fully expressible in SQL → exact count.
  const { count, error: gameErr } = await supabase
    .from('game_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .not('ended_at', 'is', null)
    .in('result', ['win', 'draw', 'loss'])
    .lte('ended_at', upTo);
  if (gameErr) {
    console.error('elo: prior game count failed', gameErr);
    return null;
  }
  const games = count ?? 0;
  if (games >= PROVISIONAL_EVENTS) return PROVISIONAL_EVENTS;

  // Puzzles: rated-ness lives in a JSON index, not SQL — probe the oldest
  // prior attempts until we've seen enough rated ones to clear the ramp.
  const { data, error } = await supabase
    .from('puzzle_attempts')
    .select('puzzle_id')
    .eq('user_id', userId)
    .lte('attempted_at', upTo)
    .order('attempted_at', { ascending: true })
    .limit(PRIOR_PROBE_LIMIT);
  if (error) {
    console.error('elo: prior puzzle probe failed', error);
    return null;
  }

  let rated = 0;
  for (const row of data ?? []) {
    if (typeof PUZZLE_RATINGS[row.puzzle_id as string] === 'number') {
      rated++;
      if (games + rated >= PROVISIONAL_EVENTS) return PROVISIONAL_EVENTS;
    }
  }
  // Saw every prior attempt → the count is exact.
  if ((data ?? []).length < PRIOR_PROBE_LIMIT) return games + rated;
  // Pathological: 500+ prior attempts yet still in the provisional ramp.
  return null;
}

/**
 * The user's current estimated rating — cheap on every read (CHE-375).
 *
 * - First read (estimated_elo NULL): runs the full replay once and persists
 *   the result + the latest-event watermark — self-backfilling, no separate
 *   backfill job needed.
 * - Every read after: fetches ONLY events newer than `elo_updated_at` (same
 *   tables/filters/ordering as the full replay) and folds them through the
 *   SAME per-event step (applyEloEvent). Zero new events → zero extra
 *   queries beyond the profile read and the two cheap, indexed since-queries.
 *
 * Concurrency: two simultaneous reads may both catch up from the same
 * watermark — that's fine. The fold is deterministic from (stored value,
 * events since watermark), so both compute identical results and the
 * last-write-wins on profiles carries identical values.
 *
 * Precision: profiles.estimated_elo is an integer, so each catch-up resumes
 * from a rounded value while the batch replay keeps floats throughout. The
 * sub-point drift is acceptable for an estimate (and the series path stays
 * float-exact).
 *
 * Pass a service-role client — the profile write and cross-table reads
 * happen here, outside any request cookie context.
 */
export async function getCurrentElo(supabase: SupabaseClient, userId: string): Promise<number> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('estimated_elo, elo_updated_at')
    .eq('id', userId)
    .maybeSingle();
  if (error) console.error('elo: profile read failed', error);

  const stored = profile?.estimated_elo as number | null | undefined;
  const since = profile?.elo_updated_at as string | null | undefined;

  // No stored rating yet (or a half-written row) → full replay + persist.
  if (typeof stored !== 'number' || !since) {
    return backfillElo(supabase, userId);
  }

  // Catch-up read: only events strictly newer than the watermark. (An event
  // landing with EXACTLY the watermark timestamp is treated as already
  // consumed — timestamps are µs-precision, so collisions are negligible.)
  const { events: fresh, ok } = await fetchEvents(supabase, userId, since);
  if (fresh.length === 0) return stored;

  const priorIndex = await getPriorEventIndex(supabase, userId, since);
  if (priorIndex === null) return backfillElo(supabase, userId);

  let rating: number = stored;
  fresh.forEach((e, i) => {
    rating = applyEloEvent(rating, e, priorIndex + i);
  });
  const rounded = Math.round(rating);

  if (ok) {
    await writeEloWatermark(supabase, userId, rounded, fresh[fresh.length - 1].at);
  }
  return rounded;
}

// ── Combined API response ────────────────────────────────────────────────────

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * The estimate both API routes return — byte-compatible with the old full
 * compute: { current, events, series }.
 *
 * `current` is ALWAYS caught up (stored-watermark fold, cheap). `series`
 * comes from the 5-min cached full replay, with today's point patched to the
 * fresh `current` (appended if missing) so the graph's "today" value always
 * matches the headline number even while the cache is stale — this replaces
 * the old `?fresh=1` full recompute on every completion.
 */
export async function getEloEstimate(userId: string): Promise<EloEstimate> {
  const supabase = createServiceClient();
  const [current, cached] = await Promise.all([
    getCurrentElo(supabase, userId),
    computeEloForUser(userId),
  ]);

  const today = todayUTC();
  const series = [...cached.series];
  const last = series[series.length - 1];
  if (last && last.date === today) {
    series[series.length - 1] = { date: today, elo: current };
  } else {
    series.push({ date: today, elo: current });
  }

  return { current, events: cached.events, series };
}
