import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * AI route guard — the single chokepoint that protects every paid AI endpoint
 * (Claude, ElevenLabs, etc.) from cost abuse.
 *
 * Every AI route MUST call this at the top of its handler. It enforces:
 *   1. Authenticated Supabase user (401 otherwise)
 *   2. Request body size cap (413 otherwise)
 *   3. Per-user per-route daily quota via the `ai_usage` table (429 otherwise)
 *
 * On success it returns the parsed JSON body so the route does not need to
 * call `request.json()` again.
 */

export type AiGuardOptions = {
  route: string;
  dailyLimit: number;
  /** Max bytes allowed in the request body. Defaults to 10KB. */
  maxBodyBytes?: number;
};

export type AiGuardResult =
  | { ok: true; userId: string; body: unknown }
  | { ok: false; response: NextResponse };

const DEFAULT_MAX_BODY_BYTES = 10_000;

export async function aiGuard(
  request: Request,
  opts: AiGuardOptions,
): Promise<AiGuardResult> {
  const maxBodyBytes = opts.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;

  // 1. Auth — require a real Supabase user
  let userId: string;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 },
        ),
      };
    }
    userId = data.user.id;
  } catch (err) {
    console.error('[ai-guard] auth error:', err);
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      ),
    };
  }

  // 2. Body size — read as text so we can measure before parsing
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch (err) {
    console.error('[ai-guard] body read error:', err);
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid request body' }, { status: 400 }),
    };
  }

  const byteLength = new TextEncoder().encode(rawBody).length;
  if (byteLength > maxBodyBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: `Request body too large (max ${maxBodyBytes} bytes)` },
        { status: 413 },
      ),
    };
  }

  let body: unknown;
  try {
    body = rawBody.length > 0 ? JSON.parse(rawBody) : {};
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    };
  }

  // 3. Quota — atomic-ish check + increment using the service role
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD in UTC
  const service = createServiceClient();

  const { data: existing, error: selectErr } = await service
    .from('ai_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('date', today)
    .eq('route', opts.route)
    .maybeSingle();

  if (selectErr) {
    console.error('[ai-guard] quota select error:', selectErr);
    // Fail open on infra errors — better to serve users than to 500 everyone.
    return { ok: true, userId, body };
  }

  const currentCount = existing?.count ?? 0;
  if (currentCount >= opts.dailyLimit) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: `Daily AI request limit reached for this feature (${opts.dailyLimit}). Try again tomorrow.`,
        },
        { status: 429 },
      ),
    };
  }

  const { error: upsertErr } = await service.from('ai_usage').upsert(
    {
      user_id: userId,
      date: today,
      route: opts.route,
      count: currentCount + 1,
    },
    { onConflict: 'user_id,date,route' },
  );

  if (upsertErr) {
    console.error('[ai-guard] quota upsert error:', upsertErr);
    // Fail open on infra errors.
  }

  return { ok: true, userId, body };
}
