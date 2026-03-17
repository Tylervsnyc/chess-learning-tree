import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { verifyAdmin } from '@/lib/admin-auth';

interface CronHealth {
  name: string;
  lastActivity: string | null;
  status: 'healthy' | 'warning' | 'stale';
  detail: string;
}

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
    const [
      revenueSnapshotResult,
      dripResult,
      emails24hResult,
      emails7dResult,
      emailsByTypeResult,
    ] = await Promise.all([
      admin
        .from('revenue_snapshots')
        .select('snapshot_date')
        .order('snapshot_date', { ascending: false })
        .limit(1),
      admin
        .from('email_log')
        .select('sent_at')
        .in('email_type', ['drip_day3'])
        .order('sent_at', { ascending: false })
        .limit(1),
      admin
        .from('email_log')
        .select('status')
        .gte('sent_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      admin
        .from('email_log')
        .select('status')
        .gte('sent_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      admin
        .from('email_log')
        .select('email_type, status')
        .gte('sent_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

    const revenueDate = revenueSnapshotResult.data?.[0]?.snapshot_date ?? null;
    const dripDate = dripResult.data?.[0]?.sent_at ?? null;

    const emailsByType7d = emailsByTypeResult.data || [];

    const countByType = (types: string[]) => {
      const matching = emailsByType7d.filter((e: { email_type: string; status: string }) =>
        types.includes(e.email_type)
      );
      return {
        sent: matching.filter((e: { status: string }) => e.status === 'sent').length,
        failed: matching.filter((e: { status: string }) => e.status === 'failed').length,
      };
    };

    const dripCounts = countByType(['drip_day3']);

    const crons: CronHealth[] = [
      {
        name: 'Revenue Snapshot',
        lastActivity: revenueDate,
        status: getCronStatus(revenueDate),
        detail: revenueDate ? `Last snapshot: ${revenueDate}` : 'No snapshots found',
      },
      {
        name: 'Drip Campaign',
        lastActivity: dripDate,
        status: getCronStatus(dripDate),
        detail: `${dripCounts.sent} sent, ${dripCounts.failed} failed (7d)`,
      },
    ];

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
