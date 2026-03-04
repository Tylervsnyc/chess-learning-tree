import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { verifyAdmin } from '@/lib/admin-auth';

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
