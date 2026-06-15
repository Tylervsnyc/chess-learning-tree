/**
 * Server-side PostHog API client for querying analytics data.
 *
 * SETUP: Add POSTHOG_PERSONAL_API_KEY to .env.local
 * (This is already present if you followed the PostHog setup.)
 *
 * Also requires NEXT_PUBLIC_POSTHOG_KEY to extract the project token,
 * which PostHog uses for the query API's project scoping.
 */

const POSTHOG_API_BASE = 'https://us.posthog.com';

function getApiKey(): string | null {
  return process.env.POSTHOG_PERSONAL_API_KEY || null;
}

/**
 * Fire a PostHog event from the server (ingestion API, public project key).
 *
 * Why this exists: client-side events fired right after the OAuth redirect drop
 * ~57% of the time (the IG in-app->system-browser handoff, PostHog not loaded
 * yet, or the user bouncing before it fires). Server-side capture at the moment
 * the event truly happens is 100% reliable. Pass the browser's anonymous
 * distinct_id (from phDistinctIdFromCookie) so the event lands on the SAME
 * person/session as the pre-auth events. Fire-and-forget; never throws.
 */
export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || !distinctId) return;
  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '');
  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        event,
        distinct_id: distinctId,
        properties: { ...properties, $lib: 'server' },
      }),
    });
  } catch (err) {
    console.error('[posthog] server capture failed:', err);
  }
}

/**
 * Pull posthog-js's anonymous distinct_id out of its cookie so a server-fired
 * event can attach to the same person as the user's browser events. The cookie
 * is `ph_<projectKey>_posthog` holding URL-encoded JSON with a distinct_id.
 * Returns null if absent/unparseable. `cookieValue` is the raw cookie string.
 */
export function phDistinctIdFromCookie(cookieValue: string | undefined | null): string | null {
  if (!cookieValue) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue));
    const id = parsed?.distinct_id;
    return typeof id === 'string' && id ? id : null;
  } catch {
    return null;
  }
}

interface PostHogEvent {
  uuid: string;
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
  distinct_id: string;
}

interface PostHogQueryResult {
  results: unknown[][];
  columns: string[];
  hasMore?: boolean;
}

/**
 * Run a HogQL query against PostHog.
 * Uses the /api/projects/@current/query endpoint with the personal API key.
 */
export async function queryPostHog(hogql: string): Promise<PostHogQueryResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('POSTHOG_PERSONAL_API_KEY is not configured');
  }

  const response = await fetch(`${POSTHOG_API_BASE}/api/projects/@current/query/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query: hogql,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PostHog API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return {
    results: data.results || [],
    columns: data.columns || [],
    hasMore: data.hasMore ?? false,
  };
}

/**
 * Get event counts grouped by a specific property value.
 *
 * Returns an array of { value, count } objects sorted by count descending.
 */
export async function getEventCountsByProperty(
  eventName: string,
  propertyName: string,
  daysBack: number
): Promise<Array<{ value: string; count: number }>> {
  const hogql = `
    SELECT
      properties.${propertyName} AS prop_value,
      count() AS event_count
    FROM events
    WHERE event = '${eventName}'
      AND timestamp >= now() - interval ${daysBack} day
      AND properties.${propertyName} IS NOT NULL
      AND properties.${propertyName} != ''
    GROUP BY prop_value
    ORDER BY event_count DESC
    LIMIT 100
  `;

  const result = await queryPostHog(hogql);

  return result.results.map((row) => ({
    value: String(row[0] ?? 'unknown'),
    count: Number(row[1] ?? 0),
  }));
}

/**
 * Get raw events with filters.
 * Useful for detailed event inspection.
 */
export async function getEvents(
  eventName: string,
  daysBack: number,
  limit: number = 100
): Promise<PostHogEvent[]> {
  const hogql = `
    SELECT
      uuid,
      event,
      properties,
      timestamp,
      distinct_id
    FROM events
    WHERE event = '${eventName}'
      AND timestamp >= now() - interval ${daysBack} day
    ORDER BY timestamp DESC
    LIMIT ${limit}
  `;

  const result = await queryPostHog(hogql);

  return result.results.map((row) => ({
    uuid: String(row[0]),
    event: String(row[1]),
    properties: (row[2] as Record<string, unknown>) || {},
    timestamp: String(row[3]),
    distinct_id: String(row[4]),
  }));
}
