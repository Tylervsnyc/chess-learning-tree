import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { verifyAdmin } from '@/lib/admin-auth';

interface DashboardReport {
  metrics: Record<string, any>;
  suggestions: Record<string, any>;
  generatedAt: string;
  period: string;
}

interface ReportsResponse {
  reports: Record<string, DashboardReport>;
  engagementTrend: Array<{ metrics: Record<string, any>; generated_at: string }>;
  lastUpdated: string | null;
}

export async function GET(): Promise<NextResponse<ReportsResponse | { error: string }>> {
  const { isAdmin, error: authError } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: authError || 'Forbidden' },
      { status: authError?.includes('Unauthorized') ? 401 : 403 }
    );
  }

  const admin = createServiceClient();

  try {
    const reportTypes = ['revenue', 'engagement', 'ux', 'content', 'growth'];

    const reports: Record<string, DashboardReport> = {};

    // Fetch latest report for each type in parallel
    await Promise.all(
      reportTypes.map(async (type) => {
        const { data, error } = await admin
          .from('dashboard_reports')
          .select('*')
          .eq('report_type', type)
          .order('generated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          reports[type] = {
            metrics: data.metrics,
            suggestions: data.suggestions,
            generatedAt: data.generated_at,
            period: data.period,
          };
        }
      })
    );

    // Fetch trend data: last 7 days of engagement reports for sparklines
    const { data: engagementTrend, error: trendError } = await admin
      .from('dashboard_reports')
      .select('metrics, generated_at')
      .eq('report_type', 'engagement')
      .order('generated_at', { ascending: true })
      .limit(7);

    if (trendError) {
      console.warn('Warning fetching engagement trend:', trendError);
    }

    const lastUpdated =
      Object.values(reports).length > 0
        ? Object.values(reports)
            .map((r) => r.generatedAt)
            .sort()
            .pop() || null
        : null;

    return NextResponse.json({
      reports,
      engagementTrend: engagementTrend || [],
      lastUpdated,
    });
  } catch (error) {
    console.error('Error fetching dashboard reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
