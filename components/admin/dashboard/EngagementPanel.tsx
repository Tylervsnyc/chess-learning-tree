'use client';

import { useEffect, useState } from 'react';
import DashboardCard from './DashboardCard';
import MetricCard from './MetricCard';

interface EngagementData {
  activeUsers: { dau: number; wau: number; mau: number };
  weekActivity: {
    lessonStarts: number;
    lessonCompletions: number;
    dailyRookStarts: number;
    dailyRookCompletions: number;
    signups: number;
    puzzlesSolved: number;
  };
  funnels: {
    name: string;
    stages: { label: string; count: number }[];
  }[];
  retention: { day1: number; day7: number; day30: number };
}

const fallbackEngagement: EngagementData = {
  activeUsers: { dau: 0, wau: 0, mau: 0 },
  weekActivity: {
    lessonStarts: 0,
    lessonCompletions: 0,
    dailyRookStarts: 0,
    dailyRookCompletions: 0,
    signups: 0,
    puzzlesSolved: 0,
  },
  funnels: [
    { name: 'Signup', stages: [{ label: 'Visit', count: 0 }, { label: 'Signup', count: 0 }, { label: 'First Lesson', count: 0 }] },
    { name: 'Lesson', stages: [{ label: 'Start', count: 0 }, { label: 'Puzzle 3', count: 0 }, { label: 'Complete', count: 0 }] },
    { name: 'Subscription', stages: [{ label: 'Paywall View', count: 0 }, { label: 'Checkout', count: 0 }, { label: 'Paid', count: 0 }] },
    { name: 'Daily Challenge', stages: [{ label: 'Open', count: 0 }, { label: 'Start', count: 0 }, { label: 'Complete', count: 0 }] },
  ],
  retention: { day1: 0, day7: 0, day30: 0 },
};

function FunnelBar({ funnel }: { funnel: EngagementData['funnels'][0] }) {
  const maxCount = Math.max(...funnel.stages.map((s) => s.count), 1);
  const colors = ['bg-emerald-500', 'bg-emerald-500/70', 'bg-amber-500/70', 'bg-amber-500'];

  return (
    <div className="bg-zinc-900/40 rounded-lg p-3">
      <div className="text-sm font-medium text-zinc-200 mb-2">{funnel.name}</div>
      <div className="space-y-1.5">
        {funnel.stages.map((stage, i) => {
          const widthPct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          const dropoff =
            i > 0 && funnel.stages[i - 1].count > 0
              ? Math.round(((funnel.stages[i - 1].count - stage.count) / funnel.stages[i - 1].count) * 100)
              : null;

          return (
            <div key={stage.label}>
              {dropoff !== null && (
                <div className="text-[10px] text-zinc-600 ml-1 -mb-0.5">
                  -{dropoff}% drop
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-20 text-xs text-zinc-400 shrink-0 truncate">{stage.label}</div>
                <div className="flex-1 h-4 bg-zinc-900/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors[i] || colors[colors.length - 1]} transition-all`}
                    style={{ width: `${Math.max(widthPct, 2)}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400 tabular-nums w-10 text-right shrink-0">{stage.count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RetentionBadge({ label, value }: { label: string; value: number }) {
  const color = value > 40 ? 'text-emerald-400' : value > 20 ? 'text-amber-400' : 'text-red-400';
  const bg = value > 40 ? 'bg-emerald-500/10' : value > 20 ? 'bg-amber-500/10' : 'bg-red-500/10';

  return (
    <div className={`${bg} rounded-lg p-3 text-center`}>
      <div className={`text-xl font-bold tabular-nums ${color}`}>{value}%</div>
      <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
    </div>
  );
}

export default function EngagementPanel({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/admin/dashboard/engagement')
      .then((r) => {
        if (!r.ok) throw new Error('Engagement API not available');
        return r.json();
      })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) {
          setData(fallbackEngagement);
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
      title="User Engagement"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      }
    >
      <div className="space-y-5">
        {error && (
          <div className="text-amber-400/70 text-xs bg-amber-500/10 rounded px-2 py-1">{error}</div>
        )}

        {/* Active Users */}
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Active Users</h3>
          <div className="grid grid-cols-3 gap-2">
            <MetricCard label="DAU" value={data?.activeUsers.dau ?? '--'} loading={loading} />
            <MetricCard label="WAU" value={data?.activeUsers.wau ?? '--'} loading={loading} />
            <MetricCard label="MAU" value={data?.activeUsers.mau ?? '--'} loading={loading} />
          </div>
        </div>

        {/* 7-Day Activity */}
        {data && !loading && (
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-2">7-Day Activity</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-zinc-900/40 rounded-lg p-2.5">
                <div className="text-lg font-bold text-zinc-100 tabular-nums">{data.weekActivity.lessonStarts}</div>
                <div className="text-xs text-zinc-500">Lesson Starts</div>
              </div>
              <div className="bg-zinc-900/40 rounded-lg p-2.5">
                <div className="text-lg font-bold text-zinc-100 tabular-nums">{data.weekActivity.lessonCompletions}</div>
                <div className="text-xs text-zinc-500">Completions</div>
              </div>
              <div className="bg-zinc-900/40 rounded-lg p-2.5">
                <div className="text-lg font-bold text-zinc-100 tabular-nums">{data.weekActivity.dailyRookStarts}</div>
                <div className="text-xs text-zinc-500">Rook Starts</div>
              </div>
              <div className="bg-zinc-900/40 rounded-lg p-2.5">
                <div className="text-lg font-bold text-zinc-100 tabular-nums">{data.weekActivity.dailyRookCompletions}</div>
                <div className="text-xs text-zinc-500">Rook Completions</div>
              </div>
              <div className="bg-zinc-900/40 rounded-lg p-2.5">
                <div className="text-lg font-bold text-zinc-100 tabular-nums">{data.weekActivity.signups}</div>
                <div className="text-xs text-zinc-500">Signups</div>
              </div>
              <div className="bg-zinc-900/40 rounded-lg p-2.5">
                <div className="text-lg font-bold text-zinc-100 tabular-nums">{data.weekActivity.puzzlesSolved}</div>
                <div className="text-xs text-zinc-500">Puzzles Solved</div>
              </div>
            </div>
          </div>
        )}

        {/* Funnels */}
        {data && !loading && (
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-2">Funnels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.funnels.map((funnel) => (
                <FunnelBar key={funnel.name} funnel={funnel} />
              ))}
            </div>
          </div>
        )}

        {/* Retention */}
        {data && !loading && (
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-2">Retention</h3>
            <div className="grid grid-cols-3 gap-2">
              <RetentionBadge label="Day 1" value={data.retention.day1} />
              <RetentionBadge label="Day 7" value={data.retention.day7} />
              <RetentionBadge label="Day 30" value={data.retention.day30} />
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
