import { NextRequest, NextResponse } from 'next/server';
import { withCronHeartbeat } from '@/lib/cron/heartbeat';
import { createServiceClient } from '@/lib/supabase/service';
import { getStripe } from '@/lib/stripe';
import type Stripe from 'stripe';

interface Suggestion {
  priority: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  action: string;
}

export const GET = withCronHeartbeat('report-revenue', async (_request: NextRequest) => {
  const supabase = createServiceClient();
  const today = new Date().toISOString().split('T')[0];
  const metrics: Record<string, number | null> = {};
  const suggestions: Suggestion[] = [];
  const errors: string[] = [];

  // --- Current MRR from Stripe ---
  try {
    const stripe = getStripe();
    let mrrCents = 0;
    let totalSubscribers = 0;
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
        const amount = item.price.unit_amount || 0;
        const interval = item.price.recurring?.interval;
        mrrCents += interval === 'year' ? Math.round(amount / 12) : amount;
      }

      hasMore = subs.has_more;
      if (subs.data.length > 0) {
        startingAfter = subs.data[subs.data.length - 1].id;
      }
    }

    metrics.mrr_current = mrrCents;

    // LTV calculation
    const mrrPerSub = totalSubscribers > 0 ? mrrCents / totalSubscribers : 0;
    metrics.ltv_current = Math.round(mrrPerSub); // will refine with churn below
  } catch (err) {
    console.error('Revenue report: MRR fetch failed:', err);
    errors.push('mrr_fetch');
    metrics.mrr_current = null;
    metrics.ltv_current = null;
  }

  // --- MRR 7 days ago from revenue_snapshots ---
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const { data: snapshot } = await supabase
      .from('revenue_snapshots')
      .select('mrr_cents')
      .eq('snapshot_date', sevenDaysAgo)
      .single();

    if (snapshot && metrics.mrr_current != null) {
      const oldMrr = snapshot.mrr_cents || 0;
      metrics.mrr_change_pct = oldMrr > 0
        ? Math.round(((metrics.mrr_current - oldMrr) / oldMrr) * 10000) / 100
        : 0;
    } else {
      metrics.mrr_change_pct = null;
    }
  } catch (err) {
    console.error('Revenue report: MRR change fetch failed:', err);
    errors.push('mrr_change');
    metrics.mrr_change_pct = null;
  }

  // --- New subscribers last 7 days ---
  try {
    const stripe = getStripe();
    const sevenDaysAgoUnix = Math.floor((Date.now() - 7 * 86400000) / 1000);
    let newSubs = 0;
    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const params: Stripe.SubscriptionListParams = {
        status: 'active',
        limit: 100,
        created: { gte: sevenDaysAgoUnix },
      };
      if (startingAfter) params.starting_after = startingAfter;

      const subs = await stripe.subscriptions.list(params);
      newSubs += subs.data.length;
      hasMore = subs.has_more;
      if (subs.data.length > 0) {
        startingAfter = subs.data[subs.data.length - 1].id;
      }
    }

    metrics.new_subscribers_7d = newSubs;
  } catch (err) {
    console.error('Revenue report: new subscribers fetch failed:', err);
    errors.push('new_subs');
    metrics.new_subscribers_7d = null;
  }

  // --- Churned last 7 days ---
  try {
    const stripe = getStripe();
    const sevenDaysAgoUnix = Math.floor((Date.now() - 7 * 86400000) / 1000);
    let churned = 0;
    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const params: Stripe.SubscriptionListParams = {
        status: 'canceled',
        limit: 100,
        created: { gte: sevenDaysAgoUnix },
      };
      if (startingAfter) params.starting_after = startingAfter;

      const subs = await stripe.subscriptions.list(params);
      churned += subs.data.length;
      hasMore = subs.has_more;
      if (subs.data.length > 0) {
        startingAfter = subs.data[subs.data.length - 1].id;
      }
    }

    metrics.churned_7d = churned;
  } catch (err) {
    console.error('Revenue report: churned fetch failed:', err);
    errors.push('churned');
    metrics.churned_7d = null;
  }

  // --- Trial conversions last 7 days ---
  try {
    const stripe = getStripe();
    const sevenDaysAgoUnix = Math.floor((Date.now() - 7 * 86400000) / 1000);
    let trialConversions = 0;
    let totalTrialsEnded = 0;
    let hasMore = true;
    let startingAfter: string | undefined;

    // Active subs that were created from trials in last 7d
    while (hasMore) {
      const params: Stripe.SubscriptionListParams = {
        status: 'active',
        limit: 100,
        created: { gte: sevenDaysAgoUnix },
      };
      if (startingAfter) params.starting_after = startingAfter;

      const subs = await stripe.subscriptions.list(params);
      for (const sub of subs.data) {
        if (sub.trial_end && sub.trial_end <= Math.floor(Date.now() / 1000)) {
          trialConversions++;
          totalTrialsEnded++;
        }
      }
      hasMore = subs.has_more;
      if (subs.data.length > 0) {
        startingAfter = subs.data[subs.data.length - 1].id;
      }
    }

    metrics.trial_conversions = trialConversions;
  } catch (err) {
    console.error('Revenue report: trial conversions fetch failed:', err);
    errors.push('trial_conversions');
    metrics.trial_conversions = null;
  }

  // --- Dunning recovery rate ---
  try {
    const stripe = getStripe();
    const sevenDaysAgoUnix = Math.floor((Date.now() - 7 * 86400000) / 1000);
    let failedPayments = 0;
    let recoveredPayments = 0;
    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const params: Stripe.InvoiceListParams = {
        limit: 100,
        created: { gte: sevenDaysAgoUnix },
      };
      if (startingAfter) params.starting_after = startingAfter;

      const invoices = await stripe.invoices.list(params);
      for (const invoice of invoices.data) {
        if (invoice.attempted && invoice.status !== 'paid') {
          failedPayments++;
        }
        if (invoice.attempted && invoice.status === 'paid' && invoice.attempt_count && invoice.attempt_count > 1) {
          recoveredPayments++;
        }
      }
      hasMore = invoices.has_more;
      if (invoices.data.length > 0) {
        startingAfter = invoices.data[invoices.data.length - 1].id;
      }
    }

    const totalFailed = failedPayments + recoveredPayments;
    metrics.dunning_recovery_rate = totalFailed > 0
      ? Math.round((recoveredPayments / totalFailed) * 10000) / 100
      : null;
  } catch (err) {
    console.error('Revenue report: dunning rate fetch failed:', err);
    errors.push('dunning');
    metrics.dunning_recovery_rate = null;
  }

  // --- Refine LTV with churn data ---
  if (metrics.mrr_current != null && metrics.churned_7d != null && metrics.new_subscribers_7d != null) {
    const { data: latestSnapshot } = await supabase
      .from('revenue_snapshots')
      .select('total_subscribers, churn_rate_pct')
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single();

    if (latestSnapshot) {
      const monthlyChurnRate = (latestSnapshot.churn_rate_pct || 0) / 100;
      const mrrPerSub = latestSnapshot.total_subscribers > 0
        ? metrics.mrr_current / latestSnapshot.total_subscribers
        : 0;
      metrics.ltv_current = monthlyChurnRate > 0
        ? Math.round(mrrPerSub / monthlyChurnRate)
        : null;
    }
  }

  // --- Generate suggestions ---
  if (metrics.churned_7d != null && metrics.new_subscribers_7d != null) {
    const total = (metrics.new_subscribers_7d || 0) + (metrics.churned_7d || 0);
    const churnRate = total > 0 ? ((metrics.churned_7d || 0) / total) * 100 : 0;

    if (churnRate > 5) {
      suggestions.push({
        priority: 'high',
        title: 'High churn rate',
        detail: `Churn rate at ${churnRate.toFixed(1)}% — review dunning emails and cancellation reasons`,
        action: 'Review dunning flow and cancellation survey responses',
      });
    }
  }

  if (metrics.mrr_change_pct != null) {
    if (metrics.mrr_change_pct < 0) {
      suggestions.push({
        priority: 'high',
        title: 'MRR decreased',
        detail: `MRR decreased ${Math.abs(metrics.mrr_change_pct)}% this week — investigate subscriber losses`,
        action: 'Check cancellation reasons and failed payments',
      });
    } else if (metrics.mrr_change_pct > 0) {
      suggestions.push({
        priority: 'low',
        title: 'MRR growing',
        detail: `MRR grew ${metrics.mrr_change_pct}% — keep momentum with retention focus`,
        action: 'Continue current growth strategy',
      });
    }
  }

  if (metrics.trial_conversions != null) {
    // Rough trial conversion estimate
    if (metrics.trial_conversions < 2 && metrics.new_subscribers_7d != null && metrics.new_subscribers_7d > 0) {
      const conversionPct = (metrics.trial_conversions / Math.max(metrics.new_subscribers_7d, 1)) * 100;
      if (conversionPct < 20) {
        suggestions.push({
          priority: 'medium',
          title: 'Low trial conversion',
          detail: `Only ${conversionPct.toFixed(0)}% of trials converted — consider extending trial or adding onboarding`,
          action: 'A/B test trial length or add onboarding emails',
        });
      }
    }
  }

  if (metrics.new_subscribers_7d != null && metrics.churned_7d != null) {
    const netNew = metrics.new_subscribers_7d - metrics.churned_7d;
    if (netNew > 0) {
      suggestions.push({
        priority: 'low',
        title: 'Net positive growth',
        detail: `Net positive: +${netNew} subscribers this week`,
        action: 'Keep up current acquisition and retention efforts',
      });
    }
  }

  // --- Store report ---
  await supabase
    .from('dashboard_reports')
    .delete()
    .eq('report_type', 'revenue')
    .eq('period', today);

  const { error: insertError } = await supabase
    .from('dashboard_reports')
    .insert({
      report_type: 'revenue',
      generated_at: new Date().toISOString(),
      period: today,
      metrics,
      suggestions,
      raw_data: { errors },
    });

  if (insertError) {
    console.error('Revenue report: failed to store:', insertError);
    return NextResponse.json(
      { error: `Failed to store report: ${insertError.message}` },
      { status: 500 }
    );
  }

  console.log(`[Revenue Report] Generated for ${today}: MRR=${metrics.mrr_current}, change=${metrics.mrr_change_pct}%, ${suggestions.length} suggestions`);

  return NextResponse.json({
    success: true,
    report_type: 'revenue',
    period: today,
    metrics,
    suggestions,
    errors: errors.length > 0 ? errors : undefined,
  });
});
