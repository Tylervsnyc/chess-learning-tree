/**
 * CHE-375 verification: for the most active real users, compare the
 * incremental getCurrentElo path (seed -> fold) against the full batch
 * replay on the LIVE database. Read-mostly: it writes only the new
 * estimated_elo/elo_updated_at columns, which is the feature itself.
 *
 * Run: npx tsx scripts/verify-elo-incremental.ts
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const { getCurrentElo, runEloCompute } = await import('../lib/elo/profile-elo');

  // Most active users by puzzle attempts.
  const { data: attempts } = await supabase
    .from('puzzle_attempts')
    .select('user_id')
    .not('user_id', 'is', null)
    .limit(5000);
  const counts = new Map<string, number>();
  for (const a of attempts ?? []) counts.set(a.user_id, (counts.get(a.user_id) ?? 0) + 1);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  let failures = 0;
  for (const [userId, n] of top) {
    const full = await runEloCompute(userId);
    const seeded = await getCurrentElo(supabase, userId); // null column -> seeds
    const second = await getCurrentElo(supabase, userId); // stored -> catch-up fold (0 new events)
    const ok = Math.abs(seeded - full.current) <= 1 && second === seeded;
    if (!ok) failures++;
    console.log(
      `${userId.slice(0, 8)} attempts=${n} full=${full.current} seeded=${seeded} second=${second} ${ok ? 'OK' : 'MISMATCH'}`,
    );
  }
  console.log(failures === 0 ? 'ALL OK' : `${failures} MISMATCHES`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
