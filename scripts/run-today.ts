import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { queryPostHog } from '../lib/posthog-server';

async function run() {
  const queries: { name: string; q: string }[] = [
    {
      name: 'Event counts (today)',
      q: `SELECT event, count() AS n, count(DISTINCT distinct_id) AS people
          FROM events
          WHERE event LIKE 'run_%' AND toDate(timestamp) = today()
          GROUP BY event ORDER BY n DESC`,
    },
    {
      name: 'Per-person breakdown',
      q: `SELECT distinct_id,
                 countIf(event='run_started') AS starts,
                 countIf(event='run_level_cleared') AS cleared,
                 countIf(event='run_level_lost') AS lost,
                 countIf(event='run_completed') AS completed,
                 countIf(event='run_replayed') AS replays,
                 countIf(event='run_ability_used') AS abilities,
                 countIf(event='run_offer_picked') AS picks,
                 countIf(event='run_offer_skipped') AS skips,
                 min(timestamp) AS first_seen,
                 max(timestamp) AS last_seen
          FROM events
          WHERE event LIKE 'run_%' AND toDate(timestamp) = today()
          GROUP BY distinct_id ORDER BY starts DESC`,
    },
    {
      name: 'Level reached distribution',
      q: `SELECT properties.level AS level,
                 countIf(event='run_level_cleared') AS cleared,
                 countIf(event='run_level_lost') AS lost
          FROM events
          WHERE event IN ('run_level_cleared','run_level_lost') AND toDate(timestamp) = today()
          GROUP BY level ORDER BY level`,
    },
    {
      name: 'Completions',
      q: `SELECT distinct_id, timestamp, properties.run AS run_id
          FROM events
          WHERE event = 'run_completed' AND toDate(timestamp) = today()
          ORDER BY timestamp`,
    },
    {
      name: 'Abilities used',
      q: `SELECT properties.ability AS ability, count() AS n
          FROM events
          WHERE event = 'run_ability_used' AND toDate(timestamp) = today()
          GROUP BY ability ORDER BY n DESC`,
    },
    {
      name: 'Offers picked',
      q: `SELECT properties.ability AS ability, count() AS n
          FROM events
          WHERE event = 'run_offer_picked' AND toDate(timestamp) = today()
          GROUP BY ability ORDER BY n DESC`,
    },
  ];

  for (const { name, q } of queries) {
    console.log(`\n=== ${name} ===`);
    try {
      const r = await queryPostHog(q);
      console.log(r.columns.join(' | '));
      console.log('-'.repeat(60));
      for (const row of r.results) console.log(row.join(' | '));
    } catch (e) {
      console.error('ERR:', (e as Error).message);
    }
  }
}

run();
