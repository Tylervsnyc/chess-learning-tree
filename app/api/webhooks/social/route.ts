import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Webhook receiver for Late.dev post events (published, failed, etc).
 * Late.dev does NOT support DM webhooks — DMs are handled by the polling cron.
 * This logs post lifecycle events for monitoring.
 */
export async function POST(request: NextRequest) {
  // Verify webhook signature
  const signature = request.headers.get('x-late-signature');
  const body = await request.text();

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(body);
  const { event } = payload;

  // Log post events for monitoring
  console.log(`[Late webhook] ${event}:`, JSON.stringify(payload.data || {}));

  // Could extend to alert on failures, update funnel log, etc.
  if (event === 'post.failed') {
    console.error('[Late webhook] Post failed:', payload.data);
  }

  return NextResponse.json({ ok: true, event });
}

function verifySignature(body: string, signature: string | null): boolean {
  const secret = process.env.LATE_WEBHOOK_SECRET;
  if (!secret) {
    // No secret configured — skip verification (webhook not registered yet)
    return true;
  }
  if (!signature) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
