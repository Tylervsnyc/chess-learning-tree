'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface TriggerData {
  trigger: string;
  views: number;
  conversions: number;
  rate: number;
}

interface AnalyticsResponse {
  period: string;
  daysBack: number;
  data: TriggerData[];
  totals: {
    views: number;
    conversions: number;
    rate: number;
  };
  error?: string;
}

type Period = '7d' | '30d' | '90d';

const PERIODS: { value: Period; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
];

// Human-readable trigger labels
const TRIGGER_LABELS: Record<string, string> = {
  guest_limit: 'Guest Lesson Limit',
  daily_limit: 'Daily Lesson Limit',
  level_test_gate: 'Level Test Gate',
  daily_rook_gate: 'Daily Rook Gate',
  daily_rook_results: 'Daily Rook Results',
  lesson_gate: 'Lesson Gate',
  skip_quiz_gate: 'Skip Quiz Gate',
};

function getRateColor(rate: number): string {
  if (rate >= 5) return '#58CC02';   // green — high
  if (rate >= 2) return '#FFC800';   // yellow — medium
  return '#FF4B4B';                  // red — low
}

function getRateBgColor(rate: number): string {
  if (rate >= 5) return 'rgba(88, 204, 2, 0.15)';
  if (rate >= 2) return 'rgba(255, 200, 0, 0.15)';
  return 'rgba(255, 75, 75, 0.15)';
}

function formatTrigger(trigger: string): string {
  return TRIGGER_LABELS[trigger] || trigger.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function PaywallAnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (p: Period) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/paywall-analytics?period=${p}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Failed to fetch analytics');
        setData(null);
      } else {
        setData(json);
      }
    } catch {
      setError('Failed to connect to server');
      setData(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(period);
  }, [period, fetchData]);

  const maxViews = data?.data.reduce((max, d) => Math.max(max, d.views), 0) || 1;
  const maxRate = data?.data.reduce((max, d) => Math.max(max, d.rate), 0) || 1;

  return (
    <div className="min-h-screen bg-chess-bg text-white">
      {/* Header */}
      <div className="bg-chess-bg-light border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Paywall Analytics</h1>
              <p className="text-sm text-gray-400">Conversion rates per paywall trigger point</p>
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
        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                period === p.value
                  ? 'bg-chess-green text-black'
                  : 'bg-chess-bg-light text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-chess-green border-t-transparent rounded-full" />
          </div>
        )}

        {/* Data Display */}
        {!loading && data && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-chess-bg-light rounded-xl p-5 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Total Views</p>
                <p className="text-3xl font-black">{data.totals.views.toLocaleString()}</p>
              </div>
              <div className="bg-chess-bg-light rounded-xl p-5 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Total Conversions</p>
                <p className="text-3xl font-black text-chess-green">{data.totals.conversions.toLocaleString()}</p>
              </div>
              <div className="bg-chess-bg-light rounded-xl p-5 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Overall Rate</p>
                <p className="text-3xl font-black" style={{ color: getRateColor(data.totals.rate) }}>
                  {data.totals.rate}%
                </p>
              </div>
            </div>

            {data.data.length === 0 ? (
              <div className="bg-chess-bg-light rounded-xl p-12 border border-gray-700 text-center">
                <p className="text-gray-400">No paywall events found for this period.</p>
                <p className="text-gray-500 text-sm mt-2">
                  Events tracked: <code className="text-gray-400">paywall_viewed</code> and <code className="text-gray-400">checkout_completed</code>
                </p>
              </div>
            ) : (
              <>
                {/* Bar Chart — Conversion Rate by Trigger */}
                <div className="bg-chess-bg-light rounded-xl p-6 border border-gray-700 mb-8">
                  <h2 className="font-bold text-lg mb-6">Conversion Rate by Trigger</h2>
                  <svg
                    viewBox={`0 0 800 ${Math.max(data.data.length * 52 + 20, 100)}`}
                    className="w-full"
                    style={{ maxHeight: 500 }}
                  >
                    {data.data.map((d, i) => {
                      const barWidth = maxRate > 0 ? (d.rate / maxRate) * 500 : 0;
                      const y = i * 52 + 10;
                      const color = getRateColor(d.rate);

                      return (
                        <g key={d.trigger}>
                          {/* Trigger label */}
                          <text
                            x={195}
                            y={y + 20}
                            textAnchor="end"
                            fill="#9CA3AF"
                            fontSize="13"
                            fontFamily="system-ui, sans-serif"
                          >
                            {formatTrigger(d.trigger)}
                          </text>
                          {/* Bar background */}
                          <rect
                            x={210}
                            y={y + 6}
                            width={500}
                            height={24}
                            rx={4}
                            fill="#0D1A1F"
                          />
                          {/* Bar */}
                          <rect
                            x={210}
                            y={y + 6}
                            width={Math.max(barWidth, 2)}
                            height={24}
                            rx={4}
                            fill={color}
                            opacity={0.85}
                          />
                          {/* Rate label */}
                          <text
                            x={720}
                            y={y + 22}
                            textAnchor="start"
                            fill={color}
                            fontSize="14"
                            fontWeight="bold"
                            fontFamily="system-ui, sans-serif"
                          >
                            {d.rate}%
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Legend */}
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#58CC02' }} />
                      <span className="text-gray-400 text-xs">High (&ge;5%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#FFC800' }} />
                      <span className="text-gray-400 text-xs">Medium (2-5%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#FF4B4B' }} />
                      <span className="text-gray-400 text-xs">Low (&lt;2%)</span>
                    </div>
                  </div>
                </div>

                {/* Data Table */}
                <div className="bg-chess-bg-light rounded-xl border border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-700">
                    <h2 className="font-bold text-lg">Trigger Breakdown</h2>
                  </div>

                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700 text-gray-400 text-sm">
                        <th className="text-left px-6 py-3 font-medium">Trigger Point</th>
                        <th className="text-right px-6 py-3 font-medium">Views</th>
                        <th className="text-right px-6 py-3 font-medium">Conversions</th>
                        <th className="text-right px-6 py-3 font-medium">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.map((d) => (
                        <tr key={d.trigger} className="border-b border-gray-700/50 hover:bg-chess-bg/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-medium">{formatTrigger(d.trigger)}</span>
                            <span className="text-gray-500 text-xs ml-2">({d.trigger})</span>
                          </td>
                          <td className="px-6 py-4 text-right tabular-nums">
                            {d.views.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right tabular-nums text-chess-green">
                            {d.conversions.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span
                              className="inline-block px-2.5 py-1 rounded-full text-sm font-bold tabular-nums"
                              style={{
                                color: getRateColor(d.rate),
                                backgroundColor: getRateBgColor(d.rate),
                              }}
                            >
                              {d.rate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    {/* Totals row */}
                    <tfoot>
                      <tr className="bg-chess-bg-deep font-bold">
                        <td className="px-6 py-4">Total</td>
                        <td className="px-6 py-4 text-right tabular-nums">
                          {data.totals.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums text-chess-green">
                          {data.totals.conversions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className="inline-block px-2.5 py-1 rounded-full text-sm font-bold tabular-nums"
                            style={{
                              color: getRateColor(data.totals.rate),
                              backgroundColor: getRateBgColor(data.totals.rate),
                            }}
                          >
                            {data.totals.rate}%
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Views Bar Chart */}
                <div className="bg-chess-bg-light rounded-xl p-6 border border-gray-700 mt-8">
                  <h2 className="font-bold text-lg mb-6">Views by Trigger</h2>
                  <svg
                    viewBox={`0 0 800 ${Math.max(data.data.length * 52 + 20, 100)}`}
                    className="w-full"
                    style={{ maxHeight: 500 }}
                  >
                    {data.data.map((d, i) => {
                      const barWidth = maxViews > 0 ? (d.views / maxViews) * 500 : 0;
                      const y = i * 52 + 10;

                      return (
                        <g key={d.trigger}>
                          {/* Label */}
                          <text
                            x={195}
                            y={y + 20}
                            textAnchor="end"
                            fill="#9CA3AF"
                            fontSize="13"
                            fontFamily="system-ui, sans-serif"
                          >
                            {formatTrigger(d.trigger)}
                          </text>
                          {/* Bar bg */}
                          <rect
                            x={210}
                            y={y + 6}
                            width={500}
                            height={24}
                            rx={4}
                            fill="#0D1A1F"
                          />
                          {/* Views bar */}
                          <rect
                            x={210}
                            y={y + 6}
                            width={Math.max(barWidth, 2)}
                            height={24}
                            rx={4}
                            fill="#1CB0F6"
                            opacity={0.85}
                          />
                          {/* Count */}
                          <text
                            x={720}
                            y={y + 22}
                            textAnchor="start"
                            fill="#1CB0F6"
                            fontSize="14"
                            fontWeight="bold"
                            fontFamily="system-ui, sans-serif"
                          >
                            {d.views.toLocaleString()}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
