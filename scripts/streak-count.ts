/**
 * streak-count.ts — READ-ONLY. How many users currently have a streak?
 *
 * Mirrors app/api/workout/streak: a day counts if the user did ANYTHING
 * (lesson, game, puzzle, opening) that day. Streak walks back from today
 * (alive if active today OR yesterday). Uses UTC for the aggregate (the live
 * API uses the user's TZ; we don't store it), so this is a close approximation.
 *
 * Run: npx tsx scripts/streak-count.ts
 */
import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s+/g, '');
if (!url || !key) { console.error('Missing Supabase env'); process.exit(1); }

const sb: SupabaseClient = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function shift(d: string, delta: number): string {
  const x = new Date(d + 'T00:00:00Z');
  x.setUTCDate(x.getUTCDate() + delta);
  return x.toISOString().slice(0, 10);
}
const dayUTC = (ts: string) => new Date(ts).toISOString().slice(0, 10);

async function pullAll(table: string, col: string): Promise<Record<string, string[]>> {
  const since = shift(new Date().toISOString().slice(0, 10), -400) + 'T00:00:00Z';
  const byUser: Record<string, string[]> = {};
  let from = 0;
  const page = 1000;
  for (;;) {
    let q = sb.from(table).select(`user_id, ${col}`).gte(col, since).range(from, from + page - 1);
    if (table === 'game_sessions') q = q.not(col, 'is', null);
    const { data, error } = await q;
    if (error) { console.error(`${table} read error`, error.message); break; }
    if (!data || data.length === 0) break;
    for (const r of data as any[]) {
      if (!r.user_id || !r[col]) continue;
      (byUser[r.user_id] ||= []).push(r[col]);
    }
    if (data.length < page) break;
    from += page;
  }
  return byUser;
}

(async () => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = shift(today, -1);

  const [lessons, games, puzzles, openings] = await Promise.all([
    pullAll('lesson_progress', 'completed_at'),
    pullAll('game_sessions', 'ended_at'),
    pullAll('puzzle_attempts', 'attempted_at'),
    pullAll('opening_progress', 'completed_at'),
  ]);

  const users = new Set<string>([
    ...Object.keys(lessons), ...Object.keys(games),
    ...Object.keys(puzzles), ...Object.keys(openings),
  ]);

  const streaks: { user: string; current: number; longest: number; lastActive: string }[] = [];

  for (const u of users) {
    const days = new Set<string>();
    for (const src of [lessons[u], games[u], puzzles[u], openings[u]]) {
      for (const ts of src ?? []) days.add(dayUTC(ts));
    }
    const completedToday = days.has(today);
    let cursor = completedToday ? today : yesterday;
    let current = 0;
    while (days.has(cursor)) { current++; cursor = shift(cursor, -1); }

    const sorted = [...days].sort();
    let longest = 0, run = 0, prev: string | null = null;
    for (const d of sorted) {
      if (prev && shift(prev, 1) === d) run++; else run = 1;
      if (run > longest) longest = run;
      prev = d;
    }
    streaks.push({ user: u, current, longest, lastActive: sorted[sorted.length - 1] ?? '' });
  }

  const alive = streaks.filter(s => s.current >= 1);
  const real = streaks.filter(s => s.current >= 2);
  const big = streaks.filter(s => s.current >= 3);

  console.log('\n=== STREAK COUNT (UTC approximation) ===');
  console.log(`Today (UTC): ${today}`);
  console.log(`Users with ANY activity in last 400d: ${users.size}`);
  console.log('');
  console.log(`Live streak  (current >= 1, active today/yesterday): ${alive.length}`);
  console.log(`Real streak  (current >= 2 days):                    ${real.length}`);
  console.log(`3+ day streak:                                       ${big.length}`);
  console.log('');
  console.log('All users with a LIVE streak (current >= 1):');
  for (const s of alive.sort((a, b) => b.current - a.current)) {
    console.log(`  ${s.user.slice(0, 8)}…  current=${s.current}  longest=${s.longest}  lastActive=${s.lastActive}`);
  }

  const longestEver = [...streaks].sort((a, b) => b.longest - a.longest).slice(0, 5);
  console.log('\nTop 5 longest streaks ever (any user):');
  for (const s of longestEver) {
    console.log(`  ${s.user.slice(0, 8)}…  longest=${s.longest}  current=${s.current}`);
  }
})();
