import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPricingVariant } from '@/lib/posthog-flags';
import { EXPERIMENT_DISPLAY_PRICES } from '@/lib/stripe';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

const ANONYMOUS_ID_COOKIE = 'cp_anon_id';

/**
 * GET /api/pricing-experiment
 * Returns the pricing variant and display prices for the current user.
 * Uses authenticated user ID or a cookie-based anonymous ID.
 */
export async function GET() {
  try {
    let distinctId: string;

    // Try to get authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      distinctId = user.id;
    } else {
      // Use cookie-based anonymous ID for non-authenticated users
      const cookieStore = await cookies();
      const existingId = cookieStore.get(ANONYMOUS_ID_COOKIE)?.value;

      if (existingId) {
        distinctId = existingId;
      } else {
        distinctId = randomUUID();
        // Set cookie — max age 1 year
        cookieStore.set(ANONYMOUS_ID_COOKIE, distinctId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 365,
          path: '/',
        });
      }
    }

    const variant = await getPricingVariant(distinctId);
    const prices = EXPERIMENT_DISPLAY_PRICES[variant] || EXPERIMENT_DISPLAY_PRICES.control;

    return NextResponse.json({
      variant,
      prices: {
        monthly: prices.monthly,
        yearly: prices.yearly,
      },
    });
  } catch (error) {
    console.error('Pricing experiment error:', error);
    // Fall back to control prices on error
    return NextResponse.json({
      variant: 'control',
      prices: EXPERIMENT_DISPLAY_PRICES.control,
    });
  }
}
