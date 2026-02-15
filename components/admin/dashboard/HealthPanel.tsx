'use client';

import { useEffect, useState } from 'react';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';

interface CronJob {
  name: string;
  status: 'healthy' | 'warning' | 'stale';
  lastRun: string | null;
  detail: string;
}

interface EmailStats {
  sent24h: number;
  failed24h: number;
  sent7d: number;
  failed7d: number;
  breakdown: { type: string; count: number }[];
}

interface HealthData {
  crons: CronJob[];
  email: EmailStats;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Fallback data when API is not yet built
const fallbackHealth: HealthData = {
  crons: [
    { name: 'Revenue Snapshot', status: 'stale', lastRun: null, detail: 'vercel.json crons empty' },
    { name: 'Drip Day 3', status: 'stale', lastRun: null, detail: 'Not deployed' },
    { name: 'Drip Day 5', status: 'stale', lastRun: null, detail: 'Not deployed' },
    { name: 'Drip Day 7', status: 'stale', lastRun: null, detail: 'Not deployed' },
    { name: 'Dunning', status: 'stale', lastRun: null, detail: 'Not deployed' },
    { name: 'Daily Puzzle', status: 'warning', lastRun: null, detail: 'Needs puzzle integration' },
  ],
  email: {
    sent24h: 0,
    failed24h: 0,
    sent7d: 0,
    failed7d: 0,
    breakdown: [
      { type: 'Welcome', count: 0 },
      { type: 'Drip Day 3', count: 0 },
      { type: 'Drip Day 5', count: 0 },
      { type: 'Drip Day 7', count: 0 },
      { type: 'Payment Failed', count: 0 },
    ],
  },
};

export default function HealthPanel({ refreshKey }: { refreshKey: number }) {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/admin/dashboard/health')
      .then((r) => {
        if (!r.ok) throw new Error('Health API not available');
        return r.json();
      })
      .then((raw) => {
        if (cancelled) return;
        // Transform API shape to component shape
        const transformed: HealthData = {
          crons: (raw.crons || []).map((c: { name: string; lastActivity: string | null; status: string; detail: string }) => ({
            name: c.name,
            lastRun: c.lastActivity,
            status: c.status as 'healthy' | 'warning' | 'stale',
            detail: c.detail,
          })),
          email: {
            sent24h: raw.emails?.last24h?.sent ?? 0,
            failed24h: raw.emails?.last24h?.failed ?? 0,
            sent7d: raw.emails?.last7d?.sent ?? 0,
            failed7d: raw.emails?.last7d?.failed ?? 0,
            breakdown: (raw.emails?.byType || []).map((t: { type: string; sent: number; failed: number }) => ({
              type: t.type,
              count: t.sent + t.failed,
            })),
          },
        };
        setHealth(transformed);
      })
      .catch(() => {
        if (!cancelled) {
          // Use fallback data when API is not yet built
          setHealth(fallbackHealth);
          setError('Using fallback data - API not yet deployed');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [refreshKey]);

  return (
    <DashboardCard
      title="Health & Ops"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      }
    >
      <div className="space-y-5">
        {error && (
          <div className="text-amber-700 text-xs bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">{error}</div>
        )}

        {/* Cron Status Grid */}
        <div>
          <h3 className="text-sm font-medium text-chess-text-muted mb-2">Cron Jobs</h3>
          {loading ? (
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {(health?.crons || []).map((cron) => (
                <div key={cron.name} className="bg-chess-page rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-chess-text font-medium">{cron.name}</span>
                    <StatusBadge status={cron.status} />
                  </div>
                  <div className="text-xs text-chess-text-muted">{timeAgo(cron.lastRun)}</div>
                  <div className="text-xs text-chess-text-faint mt-0.5">{cron.detail}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Stats */}
        {health?.email && !loading && (
          <div>
            <h3 className="text-sm font-medium text-chess-text-muted mb-2">Email Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <div className="bg-chess-page rounded-xl p-3 text-center border border-slate-100">
                <div className="text-lg font-bold text-chess-text tabular-nums">{health.email.sent24h}</div>
                <div className="text-xs text-chess-text-muted">Sent (24h)</div>
              </div>
              <div className="bg-chess-page rounded-xl p-3 text-center border border-slate-100">
                <div className={`text-lg font-bold tabular-nums ${health.email.failed24h > 0 ? 'text-chess-red' : 'text-chess-text'}`}>
                  {health.email.failed24h}
                </div>
                <div className="text-xs text-chess-text-muted">Failed (24h)</div>
              </div>
              <div className="bg-chess-page rounded-xl p-3 text-center border border-slate-100">
                <div className="text-lg font-bold text-chess-text tabular-nums">{health.email.sent7d}</div>
                <div className="text-xs text-chess-text-muted">Sent (7d)</div>
              </div>
              <div className="bg-chess-page rounded-xl p-3 text-center border border-slate-100">
                <div className={`text-lg font-bold tabular-nums ${health.email.failed7d > 0 ? 'text-chess-red' : 'text-chess-text'}`}>
                  {health.email.failed7d}
                </div>
                <div className="text-xs text-chess-text-muted">Failed (7d)</div>
              </div>
            </div>

            {/* Email Breakdown */}
            <div className="bg-chess-page rounded-xl overflow-hidden border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-3 py-2 text-xs text-chess-text-muted font-medium">Type</th>
                    <th className="text-right px-3 py-2 text-xs text-chess-text-muted font-medium">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {health.email.breakdown.map((row) => (
                    <tr key={row.type} className="border-b border-slate-100 last:border-0">
                      <td className="px-3 py-1.5 text-chess-text">{row.type}</td>
                      <td className="px-3 py-1.5 text-chess-text-muted text-right tabular-nums">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
