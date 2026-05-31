import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * Web Push subscription storage (CHE-345 / Engine 2 — Retain).
 *
 * POST   /api/push/subscribe  — upsert a browser PushManager subscription.
 * DELETE /api/push/subscribe  — remove a subscription (on unsubscribe).
 *
 * Storing a subscription does NOT send anything. Actual sends are gated by
 * WEB_PUSH_ENABLED in lib/push/web-push.ts. user_id is optional so anonymous
 * visitors can subscribe; if a session exists we attach it.
 */

interface SubscribeBody {
  subscription?: {
    endpoint?: string;
    keys?: { p256dh?: string; auth?: string };
  };
}

export async function POST(request: NextRequest) {
  let body: SubscribeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  const sub = body.subscription;
  const endpoint = sub?.endpoint;
  const p256dh = sub?.keys?.p256dh;
  const auth = sub?.keys?.auth;

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: 'missing subscription fields' }, { status: 400 });
  }

  // Attach the user if signed in; anonymous subscriptions are allowed (user_id null).
  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  // Service client bypasses RLS — this route is the sole writer (see migration).
  const supabase = createServiceClient();
  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: user?.id ?? null,
      endpoint,
      p256dh,
      auth,
      user_agent: request.headers.get('user-agent'),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'endpoint' }
  );

  if (error) {
    console.error('[push/subscribe] upsert failed', error);
    return NextResponse.json({ error: 'failed to store subscription' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  let body: SubscribeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  const endpoint = body.subscription?.endpoint;
  if (!endpoint) {
    return NextResponse.json({ error: 'missing endpoint' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);

  if (error) {
    console.error('[push/subscribe] delete failed', error);
    return NextResponse.json({ error: 'failed to remove subscription' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
