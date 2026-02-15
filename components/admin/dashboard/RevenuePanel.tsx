'use client';

import { useEffect, useState, useMemo } from 'react';
import DashboardCard from './DashboardCard';
import MetricCard from './MetricCard';

interface RevSnapshot {
  snapshot_date: string;
  mrr_cents: number;
  arr_cents: number;
  total_subscribers: number;
  monthly_subscribers: number;
  yearly_subscribers: number;
  trial_users: number;
  free_users: number;
  churn_rate_pct: number;
  ltv_cents: number;
  churned_last_30d: number;
  new_subscribers_last_30d: number;
  active_last_30d: number;
}

interface PaywallData {
  trigger: string;
  views: number;
  conversions: number;
  rate: number;
}

interface PricingVariant {
  variant: string;
  usersSeen: number;
  conversions: number;
  conversionRate: number;
  avgRevenue: number;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function MrrSparkline({ data }: { data: RevSnapshot[] }) {
  if (data.length < 2) return <div className="text-chess-text-muted text-sm">Not enough data</div>;

  const last30 = data.slice(-30);
  const values = last30.map((d) => d.mrr_cents);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const width = 300;
  const height = 60;
  const padding = 4;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  // Fill area under the line
  const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16">
      <defs>
        <linearGradient id="mrr-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#58CC02" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#58CC02" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#mrr-gradient)" />
      <path d={pathD} fill="none" stroke="#58CC02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SubscriberBar({ data }: { data: RevSnapshot }) {
  const total = data.monthly_subscribers + data.yearly_subscribers + data.trial_users + data.free_users || 1;
  const segments = [
    { label: 'Monthly', count: data.monthly_subscribers, color: 'bg-chess-green' },
    { label: 'Yearly', count: data.yearly_subscribers, color: 'bg-chess-blue' },
    { label: 'Trial', count: data.trial_users, color: 'bg-chess-orange' },
    { label: 'Free', count: data.free_users, color: 'bg-slate-300' },
  ];

  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden bg-chess-page border border-slate-100">
        {segments.map((seg) =>
          seg.count > 0 ? (
            <div
              key={seg.label}
              className={`${seg.color} transition-all`}
              style={{ width: `${(seg.count / total) * 100}%` }}
            />
          ) : null
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-xs text-chess-text-muted">
            <span className={`w-2 h-2 rounded-full ${seg.color}`} />
            {seg.label}: <span className="text-chess-text tabular-nums font-medium">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RevenuePanel({ refreshKey }: { refreshKey: number }) {
  const [snapshots, setSnapshots] = useState<RevSnapshot[]>([]);
  const [paywallData, setPaywallData] = useState<PaywallData[]>([]);
  const [paywallTotals, setPaywallTotals] = useState<{ views: number; conversions: number; rate: number } | null>(null);
  const [variants, setVariants] = useState<PricingVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetch('/api/admin/revenue').then((r) => (r.ok ? r.json() : Promise.reject('Revenue API failed'))),
      fetch('/api/admin/paywall-analytics?period=30d').then((r) =>
        r.ok ? r.json() : Promise.reject('Paywall API failed')
      ),
      fetch('/api/admin/pricing-experiments').then((r) =>
        r.ok ? r.json() : Promise.reject('Pricing API failed')
      ),
    ])
      .then(([revData, paywallRes, pricingRes]) => {
        if (cancelled) return;
        setSnapshots(revData.snapshots || []);
        setPaywallData(paywallRes.data || []);
        setPaywallTotals(paywallRes.totals || null);
        setVariants(pricingRes.variants || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(typeof err === 'string' ? err : 'Failed to load revenue data');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [refreshKey]);

  const latest = useMemo(() => (snapshots.length > 0 ? snapshots[snapshots.length - 1] : null), [snapshots]);

  if (error) {
    return (
      <DashboardCard
        title="Revenue & Monetization"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <div className="text-chess-red text-sm py-4">{error}</div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Revenue & Monetization"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    >
      <div className="space-y-5">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <MetricCard label="MRR" value={latest ? formatCents(latest.mrr_cents) : '--'} loading={loading} />
          <MetricCard label="ARR" value={latest ? formatCents(latest.arr_cents) : '--'} loading={loading} />
          <MetricCard label="Subscribers" value={latest?.total_subscribers ?? '--'} loading={loading} />
          <MetricCard label="Churn Rate" value={latest ? `${latest.churn_rate_pct}%` : '--'} loading={loading} />
          <MetricCard label="LTV" value={latest ? formatCents(latest.ltv_cents) : '--'} loading={loading} />
        </div>

        {/* MRR Sparkline */}
        <div>
          <h3 className="text-sm font-medium text-chess-text-muted mb-2">MRR Trend (30d)</h3>
          {loading ? (
            <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
          ) : (
            <MrrSparkline data={snapshots} />
          )}
        </div>

        {/* Subscriber Mix */}
        {latest && !loading && (
          <div>
            <h3 className="text-sm font-medium text-chess-text-muted mb-2">Subscriber Mix</h3>
            <SubscriberBar data={latest} />
          </div>
        )}

        {/* Conversion Funnel */}
        {paywallData.length > 0 && !loading && (
          <div>
            <h3 className="text-sm font-medium text-chess-text-muted mb-2">
              Conversion Funnel
              {paywallTotals && (
                <span className="ml-2 text-chess-text-faint font-normal">
                  Overall: {paywallTotals.rate}%
                </span>
              )}
            </h3>
            <div className="space-y-2">
              {paywallData.slice(0, 8).map((pw) => (
                <div key={pw.trigger} className="flex items-center gap-3">
                  <div className="w-28 text-xs text-chess-text-muted truncate shrink-0">{pw.trigger}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-5 bg-chess-page rounded-full overflow-hidden flex border border-slate-100">
                      <div
                        className="h-full bg-chess-green/30 rounded-full"
                        style={{ width: `${Math.min(100, (pw.views / (paywallTotals?.views || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-chess-text-muted tabular-nums w-16 text-right shrink-0">
                      {pw.views} / {pw.conversions}
                    </span>
                    <span className="text-xs font-medium text-chess-text tabular-nums w-12 text-right shrink-0">
                      {pw.rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* A/B Results */}
        {variants.length > 0 && !loading && (
          <div>
            <h3 className="text-sm font-medium text-chess-text-muted mb-2">Pricing A/B Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {variants.map((v) => (
                <div key={v.variant} className="bg-chess-page rounded-xl p-3 border border-slate-100">
                  <div className="text-sm font-medium text-chess-text capitalize mb-1">{v.variant}</div>
                  <div className="text-xl font-bold text-chess-green tabular-nums">
                    {(v.conversionRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-chess-text-muted mt-1">
                    {v.conversions}/{v.usersSeen} seen &middot; Avg {formatCents(v.avgRevenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
