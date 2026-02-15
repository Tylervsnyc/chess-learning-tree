import { NextRequest, NextResponse } from 'next/server';
import { verifyCronSecret } from '@/lib/cron-auth';
import { createServiceClient } from '@/lib/supabase/service';
import { getStripe } from '@/lib/stripe';
import type Stripe from 'stripe';

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stripe = getStripe();
    const supabase = createServiceClient();
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

    // --- Paginate ALL active/trialing subscriptions ---
    let mrrCents = 0;
    let totalSubscribers = 0;
    let monthlySubscribers = 0;
    let yearlySubscribers = 0;
    let trialUsers = 0;

    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const params: Stripe.SubscriptionListParams = {
        status: 'active',
        limit: 100,
        expand: ['data.items.data.price'],
      };
      if (startingAfter) params.starting_after = startingAfter;

      const subs = await stripe.subscriptions.list(params);

      for (const sub of subs.data) {
        totalSubscribers++;
        const item = sub.items.data[0];
        if (!item?.price) continue;

        const price = item.price;
        const amount = price.unit_amount || 0;
        const interval = price.recurring?.interval;

        // Normalize to monthly MRR
        if (interval === 'year') {
          mrrCents += Math.round(amount / 12);
          yearlySubscribers++;
        } else {
          // month or any other interval treated as monthly
          mrrCents += amount;
          monthlySubscribers++;
        }
      }

      hasMore = subs.has_more;
      if (subs.data.length > 0) {
        startingAfter = subs.data[subs.data.length - 1].id;
      }
    }

    // --- Paginate trialing subscriptions separately ---
    hasMore = true;
    startingAfter = undefined;

    while (hasMore) {
      const params: Stripe.SubscriptionListParams = {
        status: 'trialing',
        limit: 100,
      };
      if (startingAfter) params.starting_after = startingAfter;

      const subs = await stripe.subscriptions.list(params);

      trialUsers += subs.data.length;

      hasMore = subs.has_more;
      if (subs.data.length > 0) {
        startingAfter = subs.data[subs.data.length - 1].id;
      }
    }

    // --- Count churned in last 30 days (canceled subscriptions) ---
    let churnedLast30d = 0;
    hasMore = true;
    startingAfter = undefined;

    while (hasMore) {
      const params: Stripe.SubscriptionListParams = {
        status: 'canceled',
        limit: 100,
        created: { gte: thirtyDaysAgo },
      };
      if (startingAfter) params.starting_after = startingAfter;

      const subs = await stripe.subscriptions.list(params);
      churnedLast30d += subs.data.length;

      hasMore = subs.has_more;
      if (subs.data.length > 0) {
        startingAfter = subs.data[subs.data.length - 1].id;
      }
    }

    // --- Count new subscribers in last 30 days ---
    let newSubscribersLast30d = 0;
    hasMore = true;
    startingAfter = undefined;

    while (hasMore) {
      const params: Stripe.SubscriptionListParams = {
        status: 'active',
        limit: 100,
        created: { gte: thirtyDaysAgo },
      };
      if (startingAfter) params.starting_after = startingAfter;

      const subs = await stripe.subscriptions.list(params);
      newSubscribersLast30d += subs.data.length;

      hasMore = subs.has_more;
      if (subs.data.length > 0) {
        startingAfter = subs.data[subs.data.length - 1].id;
      }
    }

    // --- Count free users from Supabase ---
    const { count: freeUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('subscription_status', 'free');

    // --- Derived metrics ---
    const arrCents = mrrCents * 12;

    // Churn rate: churned / (total active + churned) * 100
    const churnDenominator = totalSubscribers + churnedLast30d;
    const churnRatePct = churnDenominator > 0
      ? Math.round((churnedLast30d / churnDenominator) * 10000) / 100
      : 0;

    // LTV: (MRR per subscriber / monthly churn rate) in cents
    // Monthly churn rate = churn_rate_pct / 100
    const monthlyChurnRate = churnRatePct / 100;
    const mrrPerSubscriber = totalSubscribers > 0 ? mrrCents / totalSubscribers : 0;
    const ltvCents = monthlyChurnRate > 0
      ? Math.round(mrrPerSubscriber / monthlyChurnRate)
      : null; // null if no churn (infinite LTV)

    // --- Insert snapshot ---
    const today = new Date().toISOString().split('T')[0];

    const { error: insertError } = await supabase
      .from('revenue_snapshots')
      .upsert({
        snapshot_date: today,
        mrr_cents: mrrCents,
        arr_cents: arrCents,
        total_subscribers: totalSubscribers,
        monthly_subscribers: monthlySubscribers,
        yearly_subscribers: yearlySubscribers,
        churned_last_30d: churnedLast30d,
        new_subscribers_last_30d: newSubscribersLast30d,
        trial_users: trialUsers,
        free_users: freeUsers || 0,
        churn_rate_pct: churnRatePct,
        ltv_cents: ltvCents,
      }, { onConflict: 'snapshot_date' });

    if (insertError) {
      console.error('Error inserting revenue snapshot:', insertError);
      return NextResponse.json(
        { error: `Failed to insert snapshot: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      snapshot: {
        date: today,
        mrr_cents: mrrCents,
        arr_cents: arrCents,
        total_subscribers: totalSubscribers,
        monthly_subscribers: monthlySubscribers,
        yearly_subscribers: yearlySubscribers,
        churned_last_30d: churnedLast30d,
        new_subscribers_last_30d: newSubscribersLast30d,
        trial_users: trialUsers,
        free_users: freeUsers || 0,
        churn_rate_pct: churnRatePct,
        ltv_cents: ltvCents,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revenue snapshot cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
