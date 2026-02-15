'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface PositionStats {
  position: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

type DateRange = '7d' | '30d' | '90d';

// Simple admin password protection (same pattern as other admin pages)
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'chesspath2024';

function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('admin-auth');
    if (stored === 'true') {
      setIsAuthed(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin-auth', 'true');
      setIsAuthed(true);
    } else {
      setError('Incorrect password');
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-[#1A2C35] p-6 rounded-xl max-w-sm w-full mx-4">
          <h1 className="text-xl font-bold text-white mb-4">Admin Access</h1>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-2 bg-[#131F24] border border-gray-600 rounded-lg text-white mb-4"
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#58CC02] text-white font-bold rounded-lg"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}

function AdPerformanceContent() {
  const [dateRange, setDateRange] = useState<DateRange>('7d');
  const [stats, setStats] = useState<PositionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  const fetchStats = useCallback(async (range: DateRange) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/ad-performance?range=${range}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();

      setStats(data.positions || []);
      setTotalImpressions(data.totalImpressions || 0);
      setTotalClicks(data.totalClicks || 0);
    } catch (err) {
      console.error('Failed to fetch ad performance:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats(dateRange);
  }, [dateRange, fetchStats]);

  const overallCtr = totalImpressions > 0
    ? ((totalClicks / totalImpressions) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              href="/admin"
              className="text-sm text-gray-400 hover:text-white transition-colors mb-2 inline-block"
            >
              &larr; Back to Admin
            </Link>
            <h1 className="text-2xl font-bold">Ad Performance</h1>
            <p className="text-gray-400 text-sm">Impressions, clicks, and CTR by position</p>
          </div>
        </div>

        {/* Date range selector */}
        <div className="flex gap-2 mb-6">
          {(['7d', '30d', '90d'] as DateRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-[#58CC02] text-white'
                  : 'bg-[#1A2C35] text-gray-400 hover:text-white'
              }`}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1A2C35] rounded-xl p-4">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Impressions</div>
            <div className="text-2xl font-bold">{loading ? '...' : totalImpressions.toLocaleString()}</div>
          </div>
          <div className="bg-[#1A2C35] rounded-xl p-4">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Clicks</div>
            <div className="text-2xl font-bold">{loading ? '...' : totalClicks.toLocaleString()}</div>
          </div>
          <div className="bg-[#1A2C35] rounded-xl p-4">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Overall CTR</div>
            <div className="text-2xl font-bold">{loading ? '...' : `${overallCtr}%`}</div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => fetchStats(dateRange)}
              className="text-red-300 text-xs underline mt-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#1A2C35] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-400 font-medium">Position</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-gray-400 font-medium">Impressions</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-gray-400 font-medium">Clicks</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-gray-400 font-medium">CTR %</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : stats.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No ad events recorded yet
                  </td>
                </tr>
              ) : (
                stats.map((row) => (
                  <tr key={row.position} className="border-b border-gray-700/50 hover:bg-[#131F24]/50">
                    <td className="px-4 py-3">
                      <span className="font-medium">{row.position}</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{row.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{row.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className={row.ctr > 5 ? 'text-[#58CC02]' : row.ctr > 2 ? 'text-[#1CB0F6]' : 'text-gray-300'}>
                        {row.ctr.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Info note */}
        <div className="mt-4 text-xs text-gray-500">
          Data sourced from PostHog events: <code className="text-gray-400">ad_impression</code> and <code className="text-gray-400">ad_click</code>, grouped by <code className="text-gray-400">position</code> property.
        </div>
      </div>
    </div>
  );
}

export default function AdPerformancePage() {
  return (
    <AdminAuth>
      <AdPerformanceContent />
    </AdminAuth>
  );
}
