/**
 * CHE-368 — audit (and optionally repair) profiles.current_streak /
 * best_streak / last_activity_date vs the derived truth (same algorithm as
 * /api/workout/streak: finished units across lesson_progress, game_sessions,
 * workout_sessions, opening_progress; UTC days).
 *
 * Default run is READ-ONLY. Pass --apply to write the derived values back
 * to profiles (one update per mismatched user).
 *
 * Run: npx tsx scripts/streak-audit.ts [--apply]
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function toDay(ts: string): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function shiftDate(yyyyMmDd: string, deltaDays: number): string {
  const d = new Date(yyyyMmDd + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

function deriveStreaks(days: Set<string>, today: string) {
  let current = 0;
  let cursor = days.has(today) ? today : shiftDate(today, -1);
  while (days.has(cursor)) {
    current++;
    cursor = shiftDate(cursor, -1);
  }
  const sorted = [...days].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev && shiftDate(prev, 1) === d) run++;
    else run = 1;
    if (run > longest) longest = run;
    prev = d;
  }
  return { current, longest, lastDay: sorted[sorted.length - 1] ?? null };
}

async function fetchAll(table: string, col: string, extra?: (q: any) => any) {
  const out: { user_id: string; ts: string }[] = [];
  let from = 0;
  const page = 1000;
  for (;;) {
    let q = supabase.from(table).select(`user_id, ${col}`).range(from, from + page - 1);
    if (extra) q = extra(q);
    const { data, error } = await q;
    if (error) throw new Error(`${table}: ${error.message}`);
    for (const r of data ?? []) {
      const ts = (r as any)[col];
      if (ts) out.push({ user_id: (r as any).user_id, ts });
    }
    if (!data || data.length < page) break;
    from += page;
  }
  return out;
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);

  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, email, display_name, current_streak, best_streak, last_activity_date, created_at');
  if (pErr) throw new Error(pErr.message);

  const [lessons, games, workouts, openings] = await Promise.all([
    fetchAll('lesson_progress', 'completed_at'),
    fetchAll('game_sessions', 'ended_at', (q) => q.not('ended_at', 'is', null)),
    fetchAll('workout_sessions', 'created_at'),
    fetchAll('opening_progress', 'completed_at'),
  ]);

  const daysByUser = new Map<string, Set<string>>();
  for (const rows of [lessons, games, workouts, openings]) {
    for (const { user_id, ts } of rows) {
      if (!daysByUser.has(user_id)) daysByUser.set(user_id, new Set());
      daysByUser.get(user_id)!.add(toDay(ts));
    }
  }

  const apply = process.argv.includes('--apply');
  let ghosts = 0; // stored current > 0 but derived current = 0
  let inflated = 0; // stored current > derived current (and derived > 0)
  let currentGtBest = 0;
  let bestWrong = 0;
  let lastActivityWrong = 0; // derived last day differs from stored by > 1 day
  let winbackMisclass = 0; // stored says inactive 14d+ but derived activity within 14d (or vice versa)
  const rows: string[] = [];
  const repairs: { id: string; current_streak: number; best_streak: number; last_activity_date: string | null }[] = [];

  for (const p of profiles ?? []) {
    const days = daysByUser.get(p.id) ?? new Set<string>();
    const d = deriveStreaks(days, today);
    const sc = p.current_streak ?? 0;
    const sb = p.best_streak ?? 0;

    if (sc > sb) currentGtBest++;
    if (sc > 0 && d.current === 0) ghosts++;
    else if (sc > d.current) inflated++;
    if (sb !== d.longest) bestWrong++;

    const storedLast = p.last_activity_date as string | null;
    if ((storedLast ?? '') !== (d.lastDay ?? '')) {
      // allow exact match only; count real divergence
      if (storedLast || d.lastDay) lastActivityWrong++;
    }
    const cutoff14 = shiftDate(today, -14);
    const storedInactive = !storedLast || storedLast <= cutoff14;
    const derivedInactive = !d.lastDay || d.lastDay <= cutoff14;
    if (storedInactive !== derivedInactive) winbackMisclass++;

    if (sc !== d.current || sb !== d.longest || (storedLast ?? null) !== (d.lastDay ?? null)) {
      rows.push(
        `${(p.email || p.display_name || p.id).slice(0, 32).padEnd(34)} stored cur/best=${sc}/${sb}  derived cur/longest=${d.current}/${d.longest}  lastAct stored=${storedLast ?? '-'} derived=${d.lastDay ?? '-'}`,
      );
      repairs.push({
        id: p.id,
        current_streak: d.current,
        best_streak: d.longest,
        last_activity_date: d.lastDay,
      });
    }
  }

  console.log(`profiles: ${profiles?.length}`);
  console.log(`activity rows: lessons=${lessons.length} games=${games.length} workouts=${workouts.length} openings=${openings.length}`);
  console.log('');
  console.log(`current_streak ghosts (stored>0, derived=0):    ${ghosts}`);
  console.log(`current_streak inflated (stored>derived>0):     ${inflated}`);
  console.log(`current > best (impossible):                    ${currentGtBest}`);
  console.log(`best_streak wrong vs derived longest:           ${bestWrong}`);
  console.log(`last_activity_date wrong vs derived:            ${lastActivityWrong}`);
  console.log(`winback 14d-window misclassified:               ${winbackMisclass}`);
  console.log('');
  console.log('--- per-user mismatches (stored vs derived) ---');
  for (const r of rows) console.log(r);

  if (!apply) {
    console.log(`\nDRY RUN — ${repairs.length} profiles would be repaired. Re-run with --apply to write.`);
    return;
  }

  console.log(`\nApplying repairs to ${repairs.length} profiles...`);
  let ok = 0;
  for (const r of repairs) {
    const { error } = await supabase
      .from('profiles')
      .update({
        current_streak: r.current_streak,
        best_streak: r.best_streak,
        last_activity_date: r.last_activity_date,
      })
      .eq('id', r.id);
    if (error) console.error(`  FAILED ${r.id}: ${error.message}`);
    else ok++;
  }
  console.log(`Repaired ${ok}/${repairs.length}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
