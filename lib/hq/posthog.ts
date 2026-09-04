/**
 * Live usage per app from PostHog (HogQL). One project holds all three apps;
 * we bucket events by host / pathname / the in_native_app super property.
 */
import { queryPostHog } from '@/lib/posthog-server';
import type { HqAppKey } from './apps';

export interface AppUsage {
  activeNow: number; // distinct people, last 10 min
  today: number; // distinct people since local midnight (PostHog project tz)
  last24h: number;
  last7d: number;
  nativeLast24h: number;
  signups24h: number;
  purchases24h: number;
  /** last 7 days, oldest first, distinct people per day */
  series: number[];
}

const APP_BUCKET = `
  multiIf(
    startsWith(toString(properties.$host), 'run.') OR startsWith(toString(properties.$pathname), '/run'), 'rookies',
    startsWith(toString(properties.$pathname), '/box'), 'boxing',
    'chesspath'
  )`;

const NOISE = `
  AND event NOT LIKE '$feature%'
  AND NOT startsWith(toString(properties.$host), 'localhost:')
  AND NOT startsWith(toString(properties.$host), '127.0.0.1')
  AND NOT startsWith(toString(properties.$host), '192.168.')`;

const empty = (): AppUsage => ({
  activeNow: 0, today: 0, last24h: 0, last7d: 0, nativeLast24h: 0, signups24h: 0, purchases24h: 0, series: [0, 0, 0, 0, 0, 0, 0],
});

export async function fetchUsage(): Promise<Record<HqAppKey, AppUsage>> {
  const [totals, daily] = await Promise.all([
    queryPostHog(`
      SELECT ${APP_BUCKET} AS app,
        uniqIf(person_id, timestamp >= now() - interval 10 minute) AS active_now,
        uniqIf(person_id, timestamp >= today()) AS today_users,
        uniqIf(person_id, timestamp >= now() - interval 24 hour) AS last24h,
        uniq(person_id) AS last7d,
        uniqIf(person_id, timestamp >= now() - interval 24 hour AND toString(properties.in_native_app) = 'true') AS native24h,
        countIf(event = 'signup_completed' AND timestamp >= now() - interval 24 hour) AS signups24h,
        countIf(event IN ('pro_purchase_completed', 'checkout_completed') AND timestamp >= now() - interval 24 hour) AS purchases24h
      FROM events
      WHERE timestamp >= now() - interval 7 day ${NOISE}
      GROUP BY app
    `),
    queryPostHog(`
      SELECT ${APP_BUCKET} AS app, toDate(timestamp) AS d, uniq(person_id) AS people
      FROM events
      WHERE timestamp >= today() - interval 6 day ${NOISE}
      GROUP BY app, d
      ORDER BY d
    `),
  ]);

  const out: Record<HqAppKey, AppUsage> = { boxing: empty(), chesspath: empty(), rookies: empty() };
  for (const row of totals.results) {
    const key = String(row[0]) as HqAppKey;
    if (!(key in out)) continue;
    out[key] = {
      ...out[key],
      activeNow: Number(row[1]), today: Number(row[2]), last24h: Number(row[3]), last7d: Number(row[4]),
      nativeLast24h: Number(row[5]), signups24h: Number(row[6]), purchases24h: Number(row[7]),
    };
  }

  // Index the 7-day series by day offset so missing days stay 0.
  const dayMs = 86_400_000;
  const todayUtc = Math.floor(Date.now() / dayMs);
  for (const row of daily.results) {
    const key = String(row[0]) as HqAppKey;
    if (!(key in out)) continue;
    const dayIdx = Math.floor(new Date(String(row[1])).getTime() / dayMs);
    const offset = 6 - (todayUtc - dayIdx);
    if (offset >= 0 && offset < 7) out[key].series[offset] = Number(row[2]);
  }
  return out;
}
