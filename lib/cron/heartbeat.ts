import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { verifyCronSecret } from '@/lib/cron-auth';

type Handler = (request: NextRequest) => Promise<NextResponse> | NextResponse;

export function withCronHeartbeat(cronName: string, handler: Handler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    if (!verifyCronSecret(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const startedAt = Date.now();
    let status: 'success' | 'error' = 'success';
    let errorMessage: string | null = null;

    try {
      const response = await handler(request);
      if (response.status >= 400) {
        status = 'error';
        errorMessage = `HTTP ${response.status}`;
      }
      return response;
    } catch (err) {
      status = 'error';
      errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Cron ${cronName} threw:`, err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
      const durationMs = Date.now() - startedAt;
      try {
        const supabase = createServiceClient();
        await supabase.from('cron_heartbeats').insert({
          cron_name: cronName,
          status,
          duration_ms: durationMs,
          error: errorMessage,
        });
      } catch (writeErr) {
        console.error(`Failed to record heartbeat for ${cronName}:`, writeErr);
      }

      if (status === 'error' && process.env.CRON_ALERT_WEBHOOK_URL) {
        try {
          await fetch(process.env.CRON_ALERT_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `:warning: Cron *${cronName}* failed (${durationMs}ms): ${errorMessage}`,
            }),
          });
        } catch (alertErr) {
          console.error(`Failed to send cron alert for ${cronName}:`, alertErr);
        }
      }
    }
  };
}
