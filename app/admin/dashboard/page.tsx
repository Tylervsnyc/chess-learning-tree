'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ConversionFunnel from '@/components/admin/dashboard/ConversionFunnel';

// ─── Types ───────────────────────────────────────────────

interface Suggestion {
  priority: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  action: string;
}

interface ReportsData {
  reports: Record<string, {
    metrics: Record<string, number | string | null>;
    suggestions: Suggestion[];
    generatedAt: string;
    period: string;
  }>;
  lastUpdated: string | null;
}

interface EngagementData {
  activeUsers: { daily: number; weekly: number; monthly: number } | null;
  metrics: {
    lessonStarts: number;
    lessonCompletions: number;
    dailyRookStarts: number;
    dailyRookCompletions: number;
    signups: number;
    puzzlesSolved: number;
  } | null;
  funnels: {
    signup: { viewed: number; started: number; completed: number };
    lesson: { started: number; completed: number };
    subscription: { paywallViewed: number; pricingViewed: number; checkoutStarted: number; paid: number };
    dailyChallenge: { viewed: number; started: number; completed: number };
  } | null;
  retention: { day1: number; day7: number; day30: number } | null;
}

interface RevenueSnapshot {
  snapshot_date: string;
  mrr_cents: number;
  arr_cents: number;
  total_subscribers: number;
  monthly_subscribers: number;
  yearly_subscribers: number;
  trial_users: number;
  free_users: number;
  churn_rate_pct: number;
  ltv_cents: number | null;
}

interface CronJob {
  name: string;
  status: 'healthy' | 'warning' | 'stale';
  lastRun: string;
  detail: string;
}

interface HealthData {
  crons: CronJob[];
  email: {
    sent24h: number;
    failed24h: number;
    sent7d: number;
    failed7d: number;
  };
}

interface UXData {
  issues: { severity: string; title: string; detail: string }[];
  rageClicks: { element: string; page: string; count: number }[];
  exitPages: { page: string; exitRate: number }[];
  deviceSplit: { mobile: number; desktop: number; tablet: number };
  topEvents: { event: string; count: number }[];
}

// ─── Helpers ─────────────────────────────────────────────

function fmt(n: number | null | undefined, prefix = ''): string {
  if (n == null) return '—';
  if (prefix === '$') return `$${(n / 100).toFixed(0)}`;
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`;
  if (n >= 1000) return n.toLocaleString();
  return String(n);
}

function pct(n: number | null | undefined): string {
  if (n == null) return '—';
  return `${n.toFixed(1)}%`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

// ─── Sub-components ──────────────────────────────────────

function HeroCard({
  label, value, delta, deltaLabel, color, loading,
}: {
  label: string; value: string; delta?: number | null; deltaLabel?: string; color: string; loading: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-4 min-w-0">
        <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse mb-2" />
        <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 min-w-0 hover:shadow-md transition-shadow">
      <div className={`text-2xl sm:text-3xl font-extrabold tabular-nums ${color}`}>{value}</div>
      <div className="text-xs text-chess-text-muted mt-1 font-medium">{label}</div>
      {delta != null && (
        <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold tabular-nums ${
          delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-red-500' : 'text-chess-text-faint'
        }`}>
          {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} {delta > 0 ? '+' : ''}{Math.round(delta)}%
          {deltaLabel && <span className="font-normal text-chess-text-faint ml-0.5">{deltaLabel}</span>}
        </div>
      )}
    </div>
  );
}

function AlertCard({ s, source }: { s: Suggestion; source: string }) {
  const colors: Record<string, { border: string; badge: string; text: string }> = {
    high: { border: 'border-l-[#FF4B4B]', badge: 'bg-red-50 text-[#FF4B4B]', text: 'URGENT' },
    medium: { border: 'border-l-[#FF9500]', badge: 'bg-amber-50 text-amber-700', text: 'WATCH' },
    low: { border: 'border-l-[#58CC02]', badge: 'bg-emerald-50 text-emerald-700', text: 'GOOD' },
  };
  const c = colors[s.priority] || colors.low;
  const sourceBadge: Record<string, string> = {
    revenue: 'bg-amber-100/60 text-amber-800',
    engagement: 'bg-blue-100/60 text-blue-800',
    ux: 'bg-purple-100/60 text-purple-800',
    content: 'bg-green-100/60 text-green-800',
    growth: 'bg-orange-100/60 text-orange-800',
  };
  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${c.border} p-3.5`}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${c.badge}`}>{c.text}</span>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${sourceBadge[source] || 'bg-slate-100 text-slate-600'}`}>{source}</span>
      </div>
      <div className="font-semibold text-sm text-chess-text">{s.title}</div>
      <div className="text-xs text-chess-text-muted mt-0.5">{s.detail}</div>
      <div className="text-xs text-[#1CB0F6] font-medium mt-1.5">{s.action}</div>
    </div>
  );
}

function Sparkline({ data, color = '#58CC02' }: { data: number[]; color?: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} className="inline-block">
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-bold text-chess-text uppercase tracking-wider mb-3">
      <span>{icon}</span> {title}
    </h3>
  );
}

function StatBox({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
      <div className="text-lg font-bold text-chess-text tabular-nums">{value}</div>
      <div className="text-[11px] text-chess-text-muted font-medium">{label}</div>
      {sub && <div className={`text-[10px] mt-0.5 font-semibold ${sub.startsWith('+') ? 'text-emerald-600' : sub.startsWith('-') ? 'text-red-500' : 'text-chess-text-faint'}`}>{sub}</div>}
    </div>
  );
}

function RetentionBadge({ label, value }: { label: string; value: number }) {
  const color = value >= 40 ? 'text-emerald-600 bg-emerald-50' : value >= 20 ? 'text-amber-600 bg-amber-50' : 'text-red-500 bg-red-50';
  return (
    <div className={`rounded-xl px-4 py-2.5 text-center ${color}`}>
      <div className="text-xl font-bold tabular-nums">{value}%</div>
      <div className="text-[11px] font-medium opacity-70">{label}</div>
    </div>
  );
}

function CronBadge({ cron }: { cron: CronJob }) {
  const dot: Record<string, string> = { healthy: 'bg-emerald-500', warning: 'bg-amber-500', stale: 'bg-red-500' };
  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-3 py-2">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${dot[cron.status] || 'bg-slate-400'}`} />
        <span className="text-xs font-medium text-chess-text">{cron.name}</span>
      </div>
      <span className="text-[10px] text-chess-text-faint">{cron.lastRun ? timeAgo(cron.lastRun) : '—'}</span>
    </div>
  );
}

function BarStat({ label, value, maxValue }: { label: string; value: number; maxValue: number }) {
  const widthPct = maxValue > 0 ? Math.max(4, (value / maxValue) * 100) : 4;
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 sm:w-36 text-xs text-chess-text-muted truncate text-right">{label}</div>
      <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#FF4B4B]/70 rounded-full transition-all duration-500" style={{ width: `${widthPct}%` }} />
      </div>
      <div className="w-12 text-xs font-semibold text-chess-text tabular-nums text-right">{pct(value)}</div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────

export default function AdminDashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [engagement, setEngagement] = useState<EngagementData | null>(null);
  const [snapshots, setSnapshots] = useState<RevenueSnapshot[]>([]);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [ux, setUX] = useState<UXData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [rep, eng, rev, hlt, uxd] = await Promise.all([
      fetchJSON<ReportsData>('/api/admin/dashboard/reports'),
      fetchJSON<EngagementData>('/api/admin/dashboard/engagement?period=7d'),
      fetchJSON<{ snapshots: RevenueSnapshot[] }>('/api/admin/revenue'),
      fetchJSON<HealthData>('/api/admin/dashboard/health'),
      fetchJSON<UXData>('/api/admin/dashboard/ux-report?period=7d'),
    ]);
    setReports(rep);
    setEngagement(eng);
    setSnapshots(rev?.snapshots || []);
    setHealth(hlt);
    setUX(uxd);
    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll, refreshKey]);

  // Derived data
  const em = reports?.reports?.engagement?.metrics;
  const rm = reports?.reports?.revenue?.metrics;
  const gm = reports?.reports?.growth?.metrics;
  const latestSnap = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  const mrrData = snapshots.map(s => s.mrr_cents / 100);

  // Merge all suggestions sorted by severity
  const allSuggestions: (Suggestion & { source: string })[] = [];
  if (reports?.reports) {
    for (const [source, report] of Object.entries(reports.reports)) {
      if (Array.isArray(report.suggestions)) {
        for (const s of report.suggestions) {
          allSuggestions.push({ ...s, source });
        }
      }
    }
  }
  allSuggestions.sort((a, b) => {
    const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return (order[a.priority] ?? 2) - (order[b.priority] ?? 2);
  });

  return (
    <div className="min-h-screen bg-chess-page text-chess-text overflow-y-auto w-screen relative left-1/2 -translate-x-1/2 max-w-none">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-chess-text-faint hover:text-chess-text transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-chess-text">Chess Path HQ</h1>
              <p className="text-[10px] text-chess-text-faint">
                Updated {lastRefresh.toLocaleTimeString()}
                {reports?.lastUpdated && <> · Report: {timeAgo(reports.lastUpdated)}</>}
              </p>
            </div>
          </div>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-chess-green text-white font-bold rounded-xl
                       shadow-[0_3px_0_#46A302] hover:bg-chess-green-dark
                       active:translate-y-[1px] active:shadow-[0_2px_0_#46A302]
                       transition-all text-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {/* ─── Hero Metrics ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <HeroCard
            label="MRR"
            value={latestSnap ? fmt(latestSnap.mrr_cents, '$') : (rm?.mrr_current != null ? fmt(Number(rm.mrr_current), '$') : '—')}
            delta={rm?.mrr_change_pct != null ? Number(rm.mrr_change_pct) : null}
            deltaLabel="vs 7d"
            color="text-chess-text"
            loading={loading}
          />
          <HeroCard
            label="DAU"
            value={engagement?.activeUsers ? fmt(engagement.activeUsers.daily) : '—'}
            color="text-[#1CB0F6]"
            loading={loading}
          />
          <HeroCard
            label="Signups (7d)"
            value={em?.signups_7d != null ? fmt(Number(em.signups_7d)) : '—'}
            color="text-[#58CC02]"
            loading={loading}
          />
          <HeroCard
            label="Paywall Conv."
            value={gm?.paywall_conversion_rate != null ? pct(Number(gm.paywall_conversion_rate)) : '—'}
            color={Number(gm?.paywall_conversion_rate || 0) > 5 ? 'text-[#58CC02]' : 'text-[#FF9500]'}
            loading={loading}
          />
          <HeroCard
            label="Churn"
            value={latestSnap ? pct(latestSnap.churn_rate_pct) : '—'}
            color={Number(latestSnap?.churn_rate_pct || 0) < 5 ? 'text-[#58CC02]' : 'text-[#FF4B4B]'}
            loading={loading}
          />
        </div>

        {/* ─── Alerts ─── */}
        {!loading && allSuggestions.length > 0 && (
          <div>
            <SectionHeader title="Today's Insights" icon="🔔" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {allSuggestions.map((s, i) => (
                <AlertCard key={`${s.source}-${i}`} s={s} source={s.source} />
              ))}
            </div>
          </div>
        )}

        {/* ─── Conversion Funnel ─── */}
        <ConversionFunnel refreshKey={refreshKey} />

        {/* ─── Revenue ─── */}
        <div>
          <SectionHeader title="Revenue" icon="💰" />
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            {loading ? (
              <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-end gap-3 mb-1">
                    <span className="text-2xl font-extrabold tabular-nums">
                      {latestSnap ? fmt(latestSnap.mrr_cents, '$') : '—'}
                    </span>
                    <span className="text-xs text-chess-text-muted mb-1">MRR</span>
                    <Sparkline data={mrrData} />
                  </div>
                  <div className="text-xs text-chess-text-faint">{snapshots.length} days of data</div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-chess-text">{latestSnap?.monthly_subscribers ?? '—'}</div>
                    <div className="text-[10px] text-chess-text-muted">Monthly</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-chess-text">{latestSnap?.yearly_subscribers ?? '—'}</div>
                    <div className="text-[10px] text-chess-text-muted">Yearly</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-chess-text">{latestSnap?.trial_users ?? '—'}</div>
                    <div className="text-[10px] text-chess-text-muted">Trial</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-chess-text">{latestSnap?.free_users ?? '—'}</div>
                    <div className="text-[10px] text-chess-text-muted">Free</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Engagement ─── */}
        <div>
          <SectionHeader title="Engagement" icon="📊" />
          <div className="space-y-3">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <StatBox label="DAU" value={engagement?.activeUsers?.daily ?? '—'} />
              <StatBox label="WAU" value={engagement?.activeUsers?.weekly ?? '—'} />
              <StatBox label="MAU" value={engagement?.activeUsers?.monthly ?? '—'} />
              <StatBox
                label="Lessons"
                value={em?.lessons_yesterday ?? '—'}
                sub={em?.lessons_change_pct != null ? `${Number(em.lessons_change_pct) > 0 ? '+' : ''}${Math.round(Number(em.lessons_change_pct))}%` : undefined}
              />
              <StatBox label="Daily Rooks" value={em?.daily_rooks_yesterday ?? '—'} />
              <StatBox label="Puzzles" value={em?.puzzles_solved_yesterday ?? '—'} />
            </div>
            {engagement?.retention && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="text-xs font-semibold text-chess-text-muted mb-2">Retention</div>
                <div className="grid grid-cols-3 gap-3">
                  <RetentionBadge label="Day 1" value={engagement.retention.day1} />
                  <RetentionBadge label="Day 7" value={engagement.retention.day7} />
                  <RetentionBadge label="Day 30" value={engagement.retention.day30} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── UX Health ─── */}
        {ux && (
          <div>
            <SectionHeader title="UX Health" icon="🔍" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="text-xs font-semibold text-chess-text-muted mb-2">Rage Clicks</div>
                {ux.rageClicks.length === 0 ? (
                  <div className="text-xs text-chess-text-faint">None detected</div>
                ) : (
                  <div className="space-y-1.5">
                    {ux.rageClicks.slice(0, 5).map((rc, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-chess-text truncate max-w-[200px]">{rc.element}</span>
                        <span className="text-chess-text-faint ml-2">{rc.count}x on {rc.page}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="text-xs font-semibold text-chess-text-muted mb-2">Top Exit Pages</div>
                {ux.exitPages.length === 0 ? (
                  <div className="text-xs text-chess-text-faint">No data</div>
                ) : (
                  <div className="space-y-1.5">
                    {ux.exitPages.slice(0, 5).map((ep, i) => (
                      <BarStat key={i} label={ep.page} value={ep.exitRate} maxValue={100} />
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="text-xs font-semibold text-chess-text-muted mb-2">Devices</div>
                <div className="flex items-center gap-1 h-6 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1CB0F6] rounded-l-full" style={{ width: `${ux.deviceSplit.mobile}%` }} />
                  <div className="h-full bg-[#58CC02]" style={{ width: `${ux.deviceSplit.desktop}%` }} />
                  <div className="h-full bg-[#CE82FF] rounded-r-full" style={{ width: `${ux.deviceSplit.tablet}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-chess-text-muted mt-1.5">
                  <span>📱 {pct(ux.deviceSplit.mobile)}</span>
                  <span>💻 {pct(ux.deviceSplit.desktop)}</span>
                  <span>📋 {pct(ux.deviceSplit.tablet)}</span>
                </div>
              </div>
              {ux.issues.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4">
                  <div className="text-xs font-semibold text-chess-text-muted mb-2">Issues</div>
                  <div className="space-y-1.5">
                    {ux.issues.slice(0, 4).map((issue, i) => (
                      <div key={i} className={`text-xs p-2 rounded-lg border-l-2 ${
                        issue.severity === 'high' ? 'border-l-[#FF4B4B] bg-red-50/50' :
                        issue.severity === 'medium' ? 'border-l-[#FF9500] bg-amber-50/50' :
                        'border-l-[#58CC02] bg-emerald-50/50'
                      }`}>
                        <div className="font-medium text-chess-text">{issue.title}</div>
                        <div className="text-chess-text-faint">{issue.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Operations ─── */}
        {health && (
          <div>
            <SectionHeader title="Operations" icon="⚙️" />
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {health.crons.map((cron, i) => (
                  <CronBadge key={i} cron={cron} />
                ))}
              </div>
              <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="font-semibold text-chess-text">{health.email.sent24h}</span>
                  <span className="text-chess-text-muted ml-1">emails sent (24h)</span>
                </div>
                {health.email.failed24h > 0 && (
                  <div className="text-[#FF4B4B]">
                    <span className="font-semibold">{health.email.failed24h}</span>
                    <span className="ml-1">failed</span>
                  </div>
                )}
                <div className="text-chess-text-faint ml-auto">
                  {health.email.sent7d} sent this week
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}
