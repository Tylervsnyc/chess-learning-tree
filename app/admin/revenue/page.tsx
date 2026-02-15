'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RevenueSnapshot {
  id: string;
  snapshot_date: string;
  mrr_cents: number;
  arr_cents: number;
  total_subscribers: number;
  monthly_subscribers: number;
  yearly_subscribers: number;
  churned_last_30d: number;
  new_subscribers_last_30d: number;
  trial_users: number;
  free_users: number;
  churn_rate_pct: number | null;
  ltv_cents: number | null;
  created_at: string;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatCompactCents(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 10000) return `$${(dollars / 1000).toFixed(1)}k`;
  return `$${dollars.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function DeltaBadge({ current, previous, format = 'number' }: { current: number; previous: number; format?: 'number' | 'cents' | 'pct' }) {
  if (previous === 0 && current === 0) return null;

  const diff = current - previous;
  if (diff === 0) return null;

  const isPositive = diff > 0;
  // For churn rate, going up is bad
  const isGood = format === 'pct' ? !isPositive : isPositive;

  let label: string;
  if (format === 'cents') {
    label = `${isPositive ? '+' : ''}${formatCompactCents(diff)}`;
  } else if (format === 'pct') {
    label = `${isPositive ? '+' : ''}${diff.toFixed(2)}%`;
  } else {
    label = `${isPositive ? '+' : ''}${diff}`;
  }

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isGood ? 'text-[#58CC02]' : 'text-red-400'}`}>
      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
        {isPositive ? (
          <path d="M6 2L10 7H2L6 2Z" />
        ) : (
          <path d="M6 10L2 5H10L6 10Z" />
        )}
      </svg>
      {label}
    </span>
  );
}

function MrrChart({ snapshots }: { snapshots: RevenueSnapshot[] }) {
  if (snapshots.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
        Need at least 2 snapshots for chart
      </div>
    );
  }

  const values = snapshots.map(s => s.mrr_cents);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const width = 800;
  const height = 200;
  const padX = 40;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = snapshots.map((s, i) => ({
    x: padX + (i / (snapshots.length - 1)) * chartW,
    y: padY + chartH - ((s.mrr_cents - minVal) / range) * chartH,
  }));

  // Build SVG path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  // Fill area under the line
  const areaPath = `${linePath} L${points[points.length - 1].x},${padY + chartH} L${points[0].x},${padY + chartH} Z`;

  // Y-axis labels (3 ticks)
  const yTicks = [minVal, minVal + range / 2, maxVal].map(v => ({
    label: formatCompactCents(v),
    y: padY + chartH - ((v - minVal) / range) * chartH,
  }));

  // X-axis labels (first, middle, last)
  const xIndices = [0, Math.floor(snapshots.length / 2), snapshots.length - 1];
  const xTicks = xIndices.map(i => ({
    label: new Date(snapshots[i].snapshot_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    x: points[i].x,
  }));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48" preserveAspectRatio="none">
      {/* Grid lines */}
      {yTicks.map((tick, i) => (
        <line key={i} x1={padX} y1={tick.y} x2={width - padX} y2={tick.y} stroke="#2A3F4A" strokeWidth="1" />
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#mrrGradient)" opacity="0.3" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#58CC02" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Dots on endpoints */}
      <circle cx={points[0].x} cy={points[0].y} r="3" fill="#58CC02" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill="#58CC02" stroke="#131F24" strokeWidth="2" />

      {/* Y-axis labels */}
      {yTicks.map((tick, i) => (
        <text key={i} x={padX - 6} y={tick.y + 4} textAnchor="end" fill="#6B7280" fontSize="10">
          {tick.label}
        </text>
      ))}

      {/* X-axis labels */}
      {xTicks.map((tick, i) => (
        <text key={i} x={tick.x} y={height - 2} textAnchor="middle" fill="#6B7280" fontSize="10">
          {tick.label}
        </text>
      ))}

      {/* Gradient definition */}
      <defs>
        <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#58CC02" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#58CC02" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function RevenueDashboardPage() {
  const [snapshots, setSnapshots] = useState<RevenueSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/revenue');
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to fetch revenue data');
        } else {
          setSnapshots(data.snapshots);
        }
      } catch {
        setError('Failed to connect to server');
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const latest = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  const previous = snapshots.length > 1 ? snapshots[snapshots.length - 2] : null;

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Revenue Dashboard</h1>
              <p className="text-sm text-gray-400">
                {latest
                  ? `Last snapshot: ${new Date(latest.snapshot_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                  : 'No data yet'}
              </p>
            </div>
            <Link
              href="/admin"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              &larr; Back to Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-[#58CC02] border-t-transparent rounded-full" />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && !latest && (
          <div className="bg-[#1A2C35] rounded-xl p-12 text-center border border-gray-700">
            <p className="text-gray-400 mb-2">No revenue snapshots yet</p>
            <p className="text-gray-500 text-sm">
              Run the cron job at <code className="bg-[#131F24] px-2 py-0.5 rounded text-xs">/api/cron/revenue-snapshot</code> to generate the first snapshot.
            </p>
          </div>
        )}

        {latest && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {/* MRR */}
              <div className="bg-[#1A2C35] rounded-xl p-5 border border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">MRR</div>
                <div className="text-2xl font-bold text-[#58CC02]">{formatCents(latest.mrr_cents)}</div>
                {previous && <DeltaBadge current={latest.mrr_cents} previous={previous.mrr_cents} format="cents" />}
              </div>

              {/* ARR */}
              <div className="bg-[#1A2C35] rounded-xl p-5 border border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">ARR</div>
                <div className="text-2xl font-bold">{formatCents(latest.arr_cents)}</div>
                {previous && <DeltaBadge current={latest.arr_cents} previous={previous.arr_cents} format="cents" />}
              </div>

              {/* Total Subscribers */}
              <div className="bg-[#1A2C35] rounded-xl p-5 border border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Subscribers</div>
                <div className="text-2xl font-bold">{latest.total_subscribers}</div>
                {previous && <DeltaBadge current={latest.total_subscribers} previous={previous.total_subscribers} />}
              </div>

              {/* Churn Rate */}
              <div className="bg-[#1A2C35] rounded-xl p-5 border border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Churn Rate</div>
                <div className="text-2xl font-bold">
                  {latest.churn_rate_pct !== null ? `${latest.churn_rate_pct}%` : '--'}
                </div>
                {previous && latest.churn_rate_pct !== null && previous.churn_rate_pct !== null && (
                  <DeltaBadge current={latest.churn_rate_pct} previous={previous.churn_rate_pct} format="pct" />
                )}
              </div>

              {/* LTV */}
              <div className="bg-[#1A2C35] rounded-xl p-5 border border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">LTV</div>
                <div className="text-2xl font-bold">
                  {latest.ltv_cents !== null ? formatCents(latest.ltv_cents) : '--'}
                </div>
                {previous && latest.ltv_cents !== null && previous.ltv_cents !== null && (
                  <DeltaBadge current={latest.ltv_cents} previous={previous.ltv_cents} format="cents" />
                )}
              </div>
            </div>

            {/* MRR Trend Chart */}
            <div className="bg-[#1A2C35] rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">MRR Trend (Last 90 Days)</h2>
              <MrrChart snapshots={snapshots} />
            </div>

            {/* Subscriber Breakdown + Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subscriber Breakdown */}
              <div className="bg-[#1A2C35] rounded-xl p-6 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">Subscriber Breakdown</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#1CB0F6]" />
                      <span className="text-gray-300">Monthly</span>
                    </div>
                    <span className="font-semibold">{latest.monthly_subscribers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#CE82FF]" />
                      <span className="text-gray-300">Yearly</span>
                    </div>
                    <span className="font-semibold">{latest.yearly_subscribers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#FF9600]" />
                      <span className="text-gray-300">Trial</span>
                    </div>
                    <span className="font-semibold">{latest.trial_users}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gray-500" />
                      <span className="text-gray-300">Free</span>
                    </div>
                    <span className="font-semibold">{latest.free_users}</span>
                  </div>

                  {/* Visual bar */}
                  {latest.total_subscribers > 0 && (
                    <div className="mt-4">
                      <div className="flex h-3 rounded-full overflow-hidden bg-gray-700">
                        <div
                          className="bg-[#1CB0F6]"
                          style={{ width: `${(latest.monthly_subscribers / (latest.total_subscribers + latest.free_users)) * 100}%` }}
                        />
                        <div
                          className="bg-[#CE82FF]"
                          style={{ width: `${(latest.yearly_subscribers / (latest.total_subscribers + latest.free_users)) * 100}%` }}
                        />
                        <div
                          className="bg-[#FF9600]"
                          style={{ width: `${(latest.trial_users / (latest.total_subscribers + latest.free_users)) * 100}%` }}
                        />
                        <div
                          className="bg-gray-500"
                          style={{ width: `${(latest.free_users / (latest.total_subscribers + latest.free_users)) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 30-Day Activity */}
              <div className="bg-[#1A2C35] rounded-xl p-6 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">30-Day Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">New Subscribers</span>
                    <span className="font-semibold text-[#58CC02]">+{latest.new_subscribers_last_30d}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Churned</span>
                    <span className="font-semibold text-red-400">-{latest.churned_last_30d}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Net Change</span>
                    <span className={`font-semibold ${
                      latest.new_subscribers_last_30d - latest.churned_last_30d >= 0
                        ? 'text-[#58CC02]'
                        : 'text-red-400'
                    }`}>
                      {latest.new_subscribers_last_30d - latest.churned_last_30d >= 0 ? '+' : ''}
                      {latest.new_subscribers_last_30d - latest.churned_last_30d}
                    </span>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">MRR per Subscriber</span>
                      <span className="text-gray-300">
                        {latest.total_subscribers > 0
                          ? formatCents(Math.round(latest.mrr_cents / latest.total_subscribers))
                          : '--'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
