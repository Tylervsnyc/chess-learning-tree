import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { getSkillProfile } from '@/lib/skill-profile';
import { buildFixitRecipe, fillFixitRecipe } from '@/lib/workout/fixit-recipe';

/**
 * GET /api/workout/fixit
 *
 * Builds a 10-puzzle Fix-It set from the user's LAST workout: the themes they
 * missed + their skill-profile blind spots (lib/workout/fixit-recipe.ts).
 * Untimed, unscored — the puzzles are served in the same shape as
 * /api/workout/puzzles plus a `slotLabel` ("Forks that finish the job").
 *
 * 401 not signed in · 404 flag off or no workout yet.
 */

// Same bounded / time-boxed history read as /api/workout/puzzles — the seen
// set keeps the set fresh but must never hold up the response.
const SEEN_READ_TIMEOUT_MS = 2500;
const SEEN_READ_LIMIT = 5000;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise
      .then((value) => resolve(value))
      .catch(() => resolve(fallback))
      .finally(() => clearTimeout(timer));
  });
}

interface MissedRow {
  id?: string | null;
  puzzleId?: string | null;
  rating?: number;
  themes?: string[];
}

export async function GET() {
  if (!FEATURE_FLAGS.WORKOUT_FIXIT) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data: session, error: sessionError } = await supabase
    .from('workout_sessions')
    .select('id, created_at, missed_puzzles')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sessionError) {
    console.error('fixit: session read failed', sessionError);
    return NextResponse.json({ error: 'read failed' }, { status: 500 });
  }
  if (!session) {
    return NextResponse.json({ error: 'no workout yet' }, { status: 404 });
  }

  const misses: MissedRow[] = Array.isArray(session.missed_puzzles)
    ? (session.missed_puzzles as unknown[]).filter(
        (m): m is MissedRow => !!m && typeof m === 'object',
      )
    : [];

  // Skill profile (service role — user_skill has no user read policy needed
  // here) and seen history, in parallel. Both degrade gracefully.
  const readSeen = async (): Promise<string[]> => {
    const { data } = await supabase
      .from('workout_seen_puzzles')
      .select('puzzle_id')
      .eq('user_id', user.id)
      .limit(SEEN_READ_LIMIT);
    return (data ?? [])
      .map((row) => row.puzzle_id)
      .filter((id): id is string => typeof id === 'string');
  };
  const seenPromise = withTimeout(readSeen(), SEEN_READ_TIMEOUT_MS, []);

  let weakest: Awaited<ReturnType<typeof getSkillProfile>>['weakest'] = [];
  let userLevel: number | undefined;
  try {
    const profile = await getSkillProfile(createServiceClient(), user.id);
    weakest = profile.weakest;
    userLevel = profile.userLevel ?? undefined;
  } catch (e) {
    console.error('fixit: skill profile read failed', e);
  }

  const exclude = new Set<string>(await seenPromise);
  for (const m of misses) {
    if (typeof m.puzzleId === 'string') exclude.add(m.puzzleId);
    if (typeof m.id === 'string') exclude.add(m.id);
  }

  const slots = buildFixitRecipe({
    weakest,
    lastMisses: misses.map((m) => ({
      puzzleId: typeof m.puzzleId === 'string' ? m.puzzleId : typeof m.id === 'string' ? m.id : undefined,
      themes: Array.isArray(m.themes) ? m.themes : undefined,
      rating: typeof m.rating === 'number' ? m.rating : undefined,
    })),
    userLevel,
  });
  const picks = fillFixitRecipe(slots, exclude);

  const targets = Array.from(new Set(picks.map((p) => p.slotLabel)));
  const slotList = slots.map((s) => ({ label: s.label, reason: s.reason, count: s.count }));

  const puzzles = picks.map((p) => ({
    id: p.puzzleId,
    puzzleId: p.puzzleId,
    fen: p.fen,
    moves: p.moves.split(' '),
    rating: p.rating,
    themes: p.allThemes,
    theme: p.theme,
    url: `https://lichess.org/training/${p.puzzleId}`,
    slotLabel: p.slotLabel,
    slotReason: p.slotReason,
  }));

  return NextResponse.json({ sessionId: session.id, targets, slots: slotList, puzzles });
}
