import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { verifyAdmin } from '@/lib/admin-auth';

interface CronHealth {
  name: string;
  lastActivity: string | null;
  status: 'healthy' | 'warning' | 'stale';
  detail: string;
}

// All crons declared in vercel.json. Each runs daily, so 1.5d = healthy threshold.
const REGISTERED_CRONS: Array<{ name: string; label: string }> = [
  { name: 'drip', label: 'Drip Campaign' },
  { name: 'revenue-snapshot', label: 'Revenue Snapshot' },
  { name: 'report-revenue', label: 'Report: Revenue' },
  { name: 'report-engagement', label: 'Report: Engagement' },
  { name: 'report-content', label: 'Report: Content' },
  { name: 'report-growth', label: 'Report: Growth' },
];

function getCronStatus(lastDate: string | null): 'healthy' | 'warning' | 'stale' {
  if (!lastDate) return 'stale';
  const now = new Date();
  const last = new Date(lastDate);
  const diffMs = now.getTime() - last.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays < 1.5) return 'healthy';
  if (diffDays < 3) return 'warning';
  return 'stale';
}

export async function GET() {
  const { isAdmin, error: authError } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: authError },
      { status: authError?.includes('Unauthorized') ? 401 : 403 }
    );
  }

  const admin = createServiceClient();

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      heartbeatsResult,
      emails24hResult,
      emails7dResult,
      emailsByTypeResult,
    ] = await Promise.all([
      admin
        .from('cron_heartbeats')
        .select('cron_name, status, duration_ms, error, ran_at')
        .gte('ran_at', sevenDaysAgo)
        .order('ran_at', { ascending: false }),
      admin
        .from('email_log')
        .select('status')
        .gte('sent_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      admin
        .from('email_log')
        .select('status')
        .gte('sent_at', sevenDaysAgo),
      admin
        .from('email_log')
        .select('email_type, status')
        .gte('sent_at', sevenDaysAgo),
    ]);

    const heartbeats = heartbeatsResult.data || [];
    const latestByCron = new Map<string, { ran_at: string; status: string; error: string | null; duration_ms: number }>();
    const counts7d = new Map<string, { ok: number; err: number }>();
    for (const hb of heartbeats as Array<{ cron_name: string; status: string; duration_ms: number; error: string | null; ran_at: string }>) {
      if (!latestByCron.has(hb.cron_name)) {
        latestByCron.set(hb.cron_name, { ran_at: hb.ran_at, status: hb.status, error: hb.error, duration_ms: hb.duration_ms });
      }
      const c = counts7d.get(hb.cron_name) || { ok: 0, err: 0 };
      if (hb.status === 'success') c.ok++;
      else c.err++;
      counts7d.set(hb.cron_name, c);
    }

    const crons: CronHealth[] = REGISTERED_CRONS.map(({ name, label }) => {
      const latest = latestByCron.get(name);
      const c = counts7d.get(name) || { ok: 0, err: 0 };
      const lastActivity = latest?.ran_at ?? null;
      const baseStatus = getCronStatus(lastActivity);
      const status = latest?.status === 'error' && baseStatus === 'healthy' ? 'warning' : baseStatus;
      const detail = lastActivity
        ? `${c.ok} ok, ${c.err} err (7d)${latest?.status === 'error' ? ` — last error: ${latest.error ?? 'unknown'}` : ''}`
        : 'No heartbeats recorded';
      return { name: label, lastActivity, status, detail };
    });

    const emailsByType7d = emailsByTypeResult.data || [];

    const last24h = emails24hResult.data || [];
    const last7d = emails7dResult.data || [];

    const typeMap = new Map<string, { sent: number; failed: number }>();
    for (const row of emailsByType7d) {
      const r = row as { email_type: string; status: string };
      const existing = typeMap.get(r.email_type) || { sent: 0, failed: 0 };
      if (r.status === 'sent') existing.sent++;
      else if (r.status === 'failed') existing.failed++;
      typeMap.set(r.email_type, existing);
    }

    const byType = Array.from(typeMap.entries())
      .map(([type, counts]) => ({ type, ...counts }))
      .sort((a, b) => (b.sent + b.failed) - (a.sent + a.failed));

    return NextResponse.json({
      crons,
      emails: {
        last24h: {
          sent: last24h.filter((e: { status: string }) => e.status === 'sent').length,
          failed: last24h.filter((e: { status: string }) => e.status === 'failed').length,
        },
        last7d: {
          sent: last7d.filter((e: { status: string }) => e.status === 'sent').length,
          failed: last7d.filter((e: { status: string }) => e.status === 'failed').length,
        },
        byType,
      },
    });
  } catch (error) {
    console.error('Error in admin dashboard health API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
