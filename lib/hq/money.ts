/**
 * Money + audience from Supabase. The nightly revenue-snapshot cron already
 * computes MRR/churn at 02:00; live subscriber counts come straight from profiles.
 */
import { createServiceClient } from '@/lib/supabase/service';

export interface MoneySummary {
  totalUsers: number;
  newUsers24h: number;
  newUsers7d: number;
  premium: number; // status=premium and not expired
  premiumStripe: number; // has a stripe_customer_id
  premiumOther: number; // IAP or comped (no Stripe customer)
  trial: number;
  expiring7d: number;
  snapshot: {
    date: string;
    mrrUsd: number;
    subscribers: number;
    churnPct: number;
    newLast30d: number;
    churnedLast30d: number;
  } | null;
}

export async function fetchMoney(): Promise<MoneySummary> {
  const db = createServiceClient();
  const now = new Date();
  const iso = (msAgo: number) => new Date(now.getTime() - msAgo).toISOString();
  const nowIso = now.toISOString();
  const in7d = new Date(now.getTime() + 7 * 86_400_000).toISOString();

  const count = (q: PromiseLike<{ count: number | null; error: unknown }>) =>
    Promise.resolve(q).then((r) => (r.error ? 0 : r.count ?? 0));
  const premiumBase = () =>
    db.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_status', 'premium')
      .or(`subscription_expires_at.is.null,subscription_expires_at.gt.${nowIso}`);

  const [totalUsers, newUsers24h, newUsers7d, premium, premiumStripe, trial, expiring7d, snap] = await Promise.all([
    count(db.from('profiles').select('id', { count: 'exact', head: true })),
    count(db.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', iso(86_400_000))),
    count(db.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', iso(7 * 86_400_000))),
    count(premiumBase()),
    count(premiumBase().not('stripe_customer_id', 'is', null)),
    count(db.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_status', 'trial')),
    count(db.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_status', 'premium')
      .gt('subscription_expires_at', nowIso).lt('subscription_expires_at', in7d)),
    db.from('revenue_snapshots')
      .select('snapshot_date, mrr_cents, total_subscribers, churn_rate_pct, new_subscribers_last_30d, churned_last_30d')
      .order('snapshot_date', { ascending: false }).limit(1).maybeSingle(),
  ]);

  const s = snap.data as Record<string, number | string> | null;
  return {
    totalUsers, newUsers24h, newUsers7d, premium, premiumStripe,
    premiumOther: Math.max(0, premium - premiumStripe), trial, expiring7d,
    snapshot: s ? {
      date: String(s.snapshot_date),
      mrrUsd: Number(s.mrr_cents ?? 0) / 100,
      subscribers: Number(s.total_subscribers ?? 0),
      churnPct: Number(s.churn_rate_pct ?? 0),
      newLast30d: Number(s.new_subscribers_last_30d ?? 0),
      churnedLast30d: Number(s.churned_last_30d ?? 0),
    } : null,
  };
}

export interface StoreListing {
  version: string;
  ratingCount: number;
  rating: number | null;
  url: string;
  releasedAt: string | null;
}

/** Public iTunes lookup — ratings and the store URL. No auth needed. */
export async function fetchStoreListing(appleId: string): Promise<StoreListing | null> {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${appleId}&country=us`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = (await res.json()) as { results: Array<Record<string, unknown>> };
  const r = json.results?.[0];
  if (!r) return null;
  return {
    version: String(r.version ?? '?'),
    ratingCount: Number(r.userRatingCount ?? 0),
    rating: r.averageUserRating != null ? Number(r.averageUserRating) : null,
    url: String(r.trackViewUrl ?? ''),
    releasedAt: (r.currentVersionReleaseDate as string) ?? null,
  };
}
