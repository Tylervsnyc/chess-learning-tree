import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';

/**
 * Verify the requesting user is authenticated and has admin privileges
 */
async function verifyAdmin(): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { isAdmin: false, error: 'Unauthorized - please log in' };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !profile.is_admin) {
      return { isAdmin: false, error: 'Forbidden - admin access required' };
    }

    return { isAdmin: true };
  } catch {
    return { isAdmin: false, error: 'Authentication error' };
  }
}

interface VariantStats {
  variant: string;
  usersSeen: number;
  conversions: number;
  conversionRate: number;
  avgRevenue: number;
}

/**
 * GET /api/admin/pricing-experiments
 * Returns experiment results by variant, pulling data from Stripe checkout metadata.
 */
export async function GET() {
  const { isAdmin, error: authError } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: authError },
      { status: authError?.includes('Unauthorized') ? 401 : 403 }
    );
  }

  try {
    const stripe = getStripe();

    // Fetch recent checkout sessions (last 100) that have pricing_variant metadata
    // Stripe API limits to 100 per request
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.subscription'],
    });

    // Aggregate by variant
    const variantMap: Record<string, { seen: number; converted: number; totalRevenue: number }> = {
      control: { seen: 0, converted: 0, totalRevenue: 0 },
      low: { seen: 0, converted: 0, totalRevenue: 0 },
      high: { seen: 0, converted: 0, totalRevenue: 0 },
    };

    for (const session of sessions.data) {
      const variant = session.metadata?.pricing_variant || 'control';

      // Only count variants we recognize
      if (!(variant in variantMap)) continue;

      variantMap[variant].seen += 1;

      if (session.payment_status === 'paid') {
        variantMap[variant].converted += 1;
        variantMap[variant].totalRevenue += session.amount_total || 0;
      }
    }

    const variants: VariantStats[] = Object.entries(variantMap).map(([variant, stats]) => ({
      variant,
      usersSeen: stats.seen,
      conversions: stats.converted,
      conversionRate: stats.seen > 0 ? stats.converted / stats.seen : 0,
      avgRevenue: stats.converted > 0 ? Math.round(stats.totalRevenue / stats.converted) : 0,
    }));

    return NextResponse.json({ variants });
  } catch (error) {
    console.error('Pricing experiments API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiment data' },
      { status: 500 }
    );
  }
}
