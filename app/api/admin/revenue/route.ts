import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { verifyAdmin } from '@/lib/admin-auth';

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
    // Get last 90 days of snapshots
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const cutoffDate = ninetyDaysAgo.toISOString().split('T')[0];

    const { data: snapshots, error } = await admin
      .from('revenue_snapshots')
      .select('*')
      .gte('snapshot_date', cutoffDate)
      .order('snapshot_date', { ascending: true });

    if (error) {
      console.error('Error fetching revenue snapshots:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ snapshots: snapshots || [] });
  } catch (error) {
    console.error('Error in admin revenue API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
