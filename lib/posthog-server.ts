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
