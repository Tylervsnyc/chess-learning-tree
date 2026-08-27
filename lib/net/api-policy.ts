/**
 * What the offline app is allowed to do with each API route.
 *
 * Two deliberately-short allowlists. Everything not named here simply fails
 * when there's no network, which is the correct and safe default — the danger
 * is a route that gets replayed when it shouldn't be, not one that doesn't.
 */

/**
 * Writes that are safe to send LATER, possibly much later, possibly twice.
 *
 * Every entry has to be genuinely replay-safe:
 *   /api/progress, /api/progress/sync   upserts keyed by lesson
 *   /api/opening-progress               upserts keyed by opening + node
 *   /api/rookie/level                   records a game result; ordered by the queue
 *   /api/workout/finish                 idempotent by client session id (CHE-358)
 *   /api/workout/celebrate              first-claim-per-user-per-day wins
 *   /api/bout/finish                    a completed bout row
 *   /api/achievements                   idempotent unlock
 *
 * NOT here, on purpose: anything under /api/stripe (never replay a payment),
 * /api/account/delete, /api/email/*, /api/push/subscribe, /api/leaderboard/join,
 * /api/profile/username. Replaying those hours later ranges from confusing to
 * genuinely harmful, so offline they fail like any other request.
 */
const QUEUEABLE_WRITES: RegExp[] = [
  /^\/api\/progress(\/sync)?$/,
  /^\/api\/opening-progress$/,
  /^\/api\/rookie\/level$/,
  /^\/api\/workout\/(finish|celebrate)$/,
  /^\/api\/bout\/finish$/,
  /^\/api\/achievements$/,
];

/**
 * Reads worth keeping a last-known-good copy of, so the app shows your real
 * progress underground instead of looking freshly installed.
 *
 * The cache is only ever consulted when the request FAILS. Online, the server
 * answers and the cache is refreshed — it never shadows a live response, so it
 * can't become a second source of truth.
 */
const CACHEABLE_READS: RegExp[] = [
  /^\/api\/progress$/,
  /^\/api\/workout\/streak$/,
  /^\/api\/profile\/dashboard$/,
  /^\/api\/profile\/unlocked-levels$/,
  /^\/api\/rookie\/level$/,
  /^\/api\/opening-progress$/,
  /^\/api\/achievements$/,
  /^\/api\/anonymous-lessons$/,
  // Premium state: cached so a paying user keeps their features in a tunnel.
  // Display only — the server still enforces entitlement on anything that counts.
  /^\/api\/subscription\/status$/,
];

export function isQueueableWrite(pathname: string, method: string): boolean {
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return false;
  return QUEUEABLE_WRITES.some((re) => re.test(pathname));
}

export function isCacheableRead(pathname: string, method: string): boolean {
  if (method !== 'GET') return false;
  return CACHEABLE_READS.some((re) => re.test(pathname));
}
