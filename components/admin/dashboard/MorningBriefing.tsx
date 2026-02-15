'use client';

import { useEffect, useState } from 'react';

// --- Types ---

interface Suggestion {
  priority: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  action: string;
}

interface DashboardReport {
  metrics: Record<string, any>;
  suggestions: Suggestion[];
  generatedAt: string;
  period: string;
}

interface ReportsResponse {
  reports: Record<string, DashboardReport>;
  engagementTrend: Array<{ metrics: Record<string, any>; generated_at: string }>;
  lastUpdated: string | null;
}

type ReportSource = 'revenue' | 'engagement' | 'ux' | 'content' | 'growth';

interface MergedSuggestion extends Suggestion {
  source: ReportSource;
}

// --- Helpers ---

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

const sourceBadgeColors: Record<ReportSource, string> = {
  revenue: 'bg-chess-gold/20 text-chess-gold-dark',
  engagement: 'bg-chess-blue/15 text-chess-blue-dark',
  ux: 'bg-chess-purple/15 text-purple-700',
  content: 'bg-chess-green/15 text-chess-green-dark',
  growth: 'bg-chess-orange/15 text-orange-700',
};

const priorityColors: Record<string, { border: string; badge: string; text: string }> = {
  high: { border: 'border-l-chess-red', badge: 'bg-red-50 text-chess-red', text: 'HIGH' },
  medium: { border: 'border-l-chess-orange', badge: 'bg-amber-50 text-amber-700', text: 'MED' },
  low: { border: 'border-l-chess-green', badge: 'bg-emerald-50 text-chess-green-dark', text: 'LOW' },
};

// --- Sub-components ---

function HighlightCard({
  label,
  value,
  changePct,
  loading,
}: {
  label: string;
  value: number | string;
  changePct?: number | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-chess-surface rounded-2xl border border-slate-200 p-4 flex-1 min-w-[140px]">
        <div className="h-10 w-20 bg-slate-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
      </div>
    );
  }

  const isUp = changePct != null && changePct > 0;
  const isDown = changePct != null && changePct < 0;

  return (
    <div className="bg-chess-surface rounded-2xl border border-slate-200 p-4 flex-1 min-w-[140px]">
      <div className="text-4xl font-bold text-chess-text tabular-nums">{value}</div>
      <div className="text-sm text-chess-text-muted mt-1">{label}</div>
      {changePct != null && (
        <div className={`flex items-center gap-1 mt-2 text-sm font-semibold tabular-nums ${
          isUp ? 'text-emerald-600' : isDown ? 'text-amber-600' : 'text-chess-text-faint'
        }`}>
          {isUp && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
            </svg>
          )}
          {isDown && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {changePct > 0 ? '+' : ''}{Math.round(changePct)}% vs 7d avg
        </div>
      )}
    </div>
  );
}

function SuggestionCard({ suggestion }: { suggestion: MergedSuggestion }) {
  const p = priorityColors[suggestion.priority] || priorityColors.low;
  const sourceColor = sourceBadgeColors[suggestion.source] || 'bg-slate-100 text-slate-600';

  return (
    <div className={`bg-chess-surface rounded-xl border border-slate-200 border-l-4 ${p.border} p-4`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${p.badge}`}>
          {p.text}
        </span>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${sourceColor}`}>
          {suggestion.source}
        </span>
      </div>
      <div className="font-semibold text-sm text-chess-text">{suggestion.title}</div>
      <div className="text-xs text-chess-text-muted mt-0.5">{suggestion.detail}</div>
      <div className="text-xs text-chess-blue font-medium mt-2">{suggestion.action}</div>
    </div>
  );
}

// --- Main Component ---

export default function MorningBriefing({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<ReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/admin/dashboard/reports')
      .then((r) => {
        if (!r.ok) throw new Error('Reports API not available');
        return r.json();
      })
      .then((json: ReportsResponse) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load reports');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [refreshKey]);

  // Extract engagement metrics
  const em = data?.reports?.engagement?.metrics;
  const hasReports = data && Object.keys(data.reports).length > 0;

  // Merge all suggestions from all report types
  const allSuggestions: MergedSuggestion[] = [];
  if (data?.reports) {
    for (const [source, report] of Object.entries(data.reports)) {
      if (Array.isArray(report.suggestions)) {
        for (const s of report.suggestions) {
          allSuggestions.push({ ...s, source: source as ReportSource });
        }
      }
    }
  }
  allSuggestions.sort((a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2));

  return (
    <div className="col-span-1 md:col-span-2 bg-chess-surface rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Greeting Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-chess-text">{getGreeting()}, Tyler</h2>
            <p className="text-sm text-chess-text-muted mt-0.5">{formatDate()}</p>
          </div>
          {data?.lastUpdated && (
            <div className="flex items-center gap-1.5 text-xs text-chess-text-faint bg-chess-page rounded-full px-3 py-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last report: {timeAgo(data.lastUpdated)}
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!loading && !hasReports && (
        <div className="px-5 pb-6">
          <div className="bg-chess-page rounded-xl p-8 text-center">
            <svg className="w-10 h-10 text-chess-text-faint mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-chess-text-muted font-medium">No reports yet</p>
            <p className="text-xs text-chess-text-faint mt-1">They'll generate at 7am tomorrow</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && !hasReports && (
        <div className="px-5 pb-5">
          <div className="text-amber-700 text-xs bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            {error}
          </div>
        </div>
      )}

      {/* Yesterday's Highlights */}
      {(loading || hasReports) && (
        <div className="px-5 pb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-chess-text-faint mb-3">
            Yesterday's Highlights
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <HighlightCard
              label="Lessons Completed"
              value={em?.lessons_yesterday ?? '--'}
              changePct={em?.lessons_change_pct}
              loading={loading}
            />
            <HighlightCard
              label="Daily Rooks"
              value={em?.daily_rooks_yesterday ?? '--'}
              changePct={em?.daily_rook_change_pct}
              loading={loading}
            />
            <HighlightCard
              label="New Signups"
              value={em?.signups_yesterday ?? '--'}
              changePct={null}
              loading={loading}
            />
            <HighlightCard
              label="Puzzles Solved"
              value={em?.puzzles_solved_yesterday ?? '--'}
              changePct={null}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Suggestions Feed */}
      {!loading && allSuggestions.length > 0 && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-chess-text-faint mb-3">
            Suggestions ({allSuggestions.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allSuggestions.map((s, i) => (
              <SuggestionCard key={`${s.source}-${i}`} suggestion={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
