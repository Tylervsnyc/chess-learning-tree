'use client';

import { useEffect, useState } from 'react';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';

interface UXIssue {
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
}

interface RageClick {
  element: string;
  page: string;
  count: number;
}

interface ExitPage {
  page: string;
  exitRate: number;
}

interface TopEvent {
  event: string;
  count: number;
}

interface UXData {
  issues: UXIssue[];
  rageClicks: RageClick[];
  exitPages: ExitPage[];
  deviceSplit: { mobile: number; desktop: number; tablet: number };
  topEvents: TopEvent[];
}

const fallbackUX: UXData = {
  issues: [
    { severity: 'high', title: 'No error boundaries on lesson pages', detail: 'Chess.js crash = white screen' },
    { severity: 'medium', title: 'Paywall shows on free period', detail: 'FREE_UNTIL_MARCH flag active but paywall still triggers' },
    { severity: 'low', title: 'Share buttons hidden', detail: 'SHOW_SHARING flag is off' },
  ],
  rageClicks: [],
  exitPages: [],
  deviceSplit: { mobile: 70, desktop: 25, tablet: 5 },
  topEvents: [],
};

const severityMap = {
  high: { badge: 'error' as const, color: 'border-l-red-400' },
  medium: { badge: 'warning' as const, color: 'border-l-amber-400' },
  low: { badge: 'healthy' as const, color: 'border-l-blue-400' },
};

export default function UXReportPanel({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<UXData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/admin/dashboard/ux-report')
      .then((r) => {
        if (!r.ok) throw new Error('UX API not available');
        return r.json();
      })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) {
          setData(fallbackUX);
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
      title="UX Report"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      }
    >
      <div className="space-y-5">
        {error && (
          <div className="text-amber-400/70 text-xs bg-amber-500/10 rounded px-2 py-1">{error}</div>
        )}

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-zinc-700/30 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : data ? (
          <>
            {/* Issues */}
            {data.issues.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Issues ({data.issues.length})</h3>
                <div className="space-y-1.5">
                  {data.issues
                    .sort((a, b) => {
                      const order = { high: 0, medium: 1, low: 2 };
                      return order[a.severity] - order[b.severity];
                    })
                    .map((issue, i) => (
                      <div
                        key={i}
                        className={`bg-zinc-900/40 rounded-lg p-3 border-l-2 ${severityMap[issue.severity].color}`}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <StatusBadge status={severityMap[issue.severity].badge} />
                          <span className="text-sm text-zinc-200">{issue.title}</span>
                        </div>
                        <div className="text-xs text-zinc-500 ml-[70px]">{issue.detail}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Rage Clicks */}
            {data.rageClicks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Rage Clicks</h3>
                <div className="space-y-1">
                  {data.rageClicks.slice(0, 5).map((rc, i) => (
                    <div key={i} className="flex items-center justify-between bg-zinc-900/40 rounded-lg px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-zinc-200 truncate font-mono text-xs">{rc.element}</div>
                        <div className="text-xs text-zinc-500 truncate">{rc.page}</div>
                      </div>
                      <span className="text-sm font-medium text-red-400 tabular-nums ml-2 shrink-0">{rc.count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exit Pages */}
            {data.exitPages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Top Exit Pages</h3>
                <div className="space-y-1.5">
                  {data.exitPages.slice(0, 5).map((ep, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 w-32 truncate shrink-0">{ep.page}</span>
                      <div className="flex-1 h-4 bg-zinc-900/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500/30 rounded-full"
                          style={{ width: `${ep.exitRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400 tabular-nums w-10 text-right shrink-0">{ep.exitRate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Device Split */}
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Device Split</h3>
              <div className="flex h-4 rounded-full overflow-hidden bg-zinc-900/50">
                <div className="bg-blue-500" style={{ width: `${data.deviceSplit.mobile}%` }} />
                <div className="bg-emerald-500" style={{ width: `${data.deviceSplit.desktop}%` }} />
                <div className="bg-amber-500" style={{ width: `${data.deviceSplit.tablet}%` }} />
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Mobile: <span className="text-zinc-200 tabular-nums">{data.deviceSplit.mobile}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Desktop: <span className="text-zinc-200 tabular-nums">{data.deviceSplit.desktop}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Tablet: <span className="text-zinc-200 tabular-nums">{data.deviceSplit.tablet}%</span>
                </div>
              </div>
            </div>

            {/* Top Events */}
            {data.topEvents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Top Events</h3>
                <div className="bg-zinc-900/30 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {data.topEvents.slice(0, 10).map((ev, i) => (
                        <tr key={i} className="border-b border-zinc-800/50 last:border-0">
                          <td className="px-3 py-1.5 text-zinc-300 text-xs font-mono">{ev.event}</td>
                          <td className="px-3 py-1.5 text-zinc-400 text-right tabular-nums text-xs">{ev.count.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </DashboardCard>
  );
}
