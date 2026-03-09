'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Stage {
  id: string;
  label: string;
  count: number;
}

interface LessonDay {
  date: string;
  count: number;
}

interface TopUser {
  email: string | null;
  displayName: string | null;
  events: number;
  lessons: number;
  dailyRooks: number;
  lastSeen: string;
}

interface ChurnedUser {
  email: string | null;
  displayName: string | null;
  lastSeen: string;
  totalLessons: number;
}

interface FunnelData {
  today: {
    date: string;
    stages: Stage[];
    totalUsers: number;
    dau: number;
  };
  history: {
    dates: string[];
    stages: Record<string, number[]>;
  };
  lessonsPerDay: LessonDay[];
  topUsers: TopUser[];
  churnedUsers: ChurnedUser[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Hero stat card
// ---------------------------------------------------------------------------

function HeroCard({
  label,
  value,
  sparkData,
  color,
  loading,
}: {
  label: string;
  value: number;
  sparkData: number[];
  color: string;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
        <div className="h-8 w-20 bg-slate-200 rounded mb-2" />
        <div className="h-4 w-16 bg-slate-100 rounded mb-3" />
        <div className="h-8 w-full bg-slate-100 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="text-2xl font-bold text-[#131F24]">{value.toLocaleString()}</div>
      <div className="text-sm text-slate-500 mt-0.5">{label}</div>
      <div className="mt-3">
        <Sparkline data={sparkData} color={color} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Conversion badge
// ---------------------------------------------------------------------------

function ConversionBadge({ from, to }: { from: number; to: number }) {
  if (from === 0) return null;
  const rate = (to / from) * 100;
  const dropped = from - to;

  let badgeColor = 'bg-emerald-100 text-emerald-700';
  if (rate < 30) badgeColor = 'bg-red-100 text-red-700';
  else if (rate < 60) badgeColor = 'bg-amber-100 text-amber-700';

  return (
    <div className="flex items-center justify-center gap-2 py-1 text-xs">
      <span className={`px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>
        {rate.toFixed(1)}%
      </span>
      <span className="text-slate-400">{dropped.toLocaleString()} dropped</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Funnel bar color gradient
// ---------------------------------------------------------------------------

const FUNNEL_COLORS = [
  '#1CB0F6', // blue
  '#1CBBEF',
  '#1DC6E8',
  '#28CFC0',
  '#35D898',
  '#43E070',
  '#58CC02', // green
  '#79C902',
  '#9AC502',
  '#D4B800',
  '#FFD700', // gold
];

// ---------------------------------------------------------------------------
// Skeleton loaders
// ---------------------------------------------------------------------------

function FunnelSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: 11 }).map((_, i) => {
        const w = 100 - i * 7;
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-32 h-4 bg-slate-200 rounded shrink-0" />
            <div className="flex-1 flex justify-center">
              <div
                className="h-10 bg-slate-200 rounded-lg"
                style={{ width: `${w}%` }}
              />
            </div>
            <div className="w-12 h-4 bg-slate-200 rounded shrink-0" />
          </div>
        );
      })}
    </div>
  );
}

function TrendSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 11 }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
          <div className="h-5 w-12 bg-slate-200 rounded mb-2" />
          <div className="h-8 w-full bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FunnelPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (d: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/funnel?days=${d}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const json: FunnelData = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load funnel data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(days);
  }, [days, fetchData]);

  const periods = [
    { label: '7d', value: 7 },
    { label: '14d', value: 14 },
    { label: '30d', value: 30 },
  ];

  const stages = data?.today.stages ?? [];
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="min-h-screen bg-[#131F24] overflow-y-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-[#131F24]/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">Sales Funnel</h1>
          </div>
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setDays(p.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  days === p.value
                    ? 'bg-[#58CC02] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Error state */}
        {error && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-2xl p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Hero stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HeroCard
            label="Total Users"
            value={data?.today.totalUsers ?? 0}
            sparkData={data?.history.stages.total_users ?? []}
            color="#1CB0F6"
            loading={loading}
          />
          <HeroCard
            label="DAU"
            value={data?.today.dau ?? 0}
            sparkData={data?.history.stages.daily_active_users ?? []}
            color="#58CC02"
            loading={loading}
          />
          <HeroCard
            label="Paywall Views"
            value={stages.find((s) => s.id === 'paywall_viewed')?.count ?? 0}
            sparkData={data?.history.stages.paywall_viewed ?? []}
            color="#FFD700"
            loading={loading}
          />
          <HeroCard
            label="Premium"
            value={stages.find((s) => s.id === 'premium_converted')?.count ?? 0}
            sparkData={data?.history.stages.premium_converted ?? []}
            color="#FF4B4B"
            loading={loading}
          />
        </div>

        {/* Funnel visualization */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-[#131F24] mb-6">
            Today&apos;s Funnel
          </h2>
          {loading ? (
            <FunnelSkeleton />
          ) : (
            <div className="space-y-0">
              {stages.map((stage, i) => {
                const barWidth = Math.max(8, (stage.count / maxCount) * 100);
                const color = FUNNEL_COLORS[i] ?? FUNNEL_COLORS[FUNNEL_COLORS.length - 1];

                return (
                  <div key={stage.id}>
                    {/* Conversion badge between stages */}
                    {i > 0 && (
                      <ConversionBadge
                        from={stages[i - 1].count}
                        to={stage.count}
                      />
                    )}

                    {/* Stage bar */}
                    <div
                      className="flex items-center gap-3 opacity-0 translate-y-2"
                      style={{
                        animation: `funnelFadeIn 0.4s ease-out ${i * 0.06}s forwards`,
                      }}
                    >
                      <div className="w-28 md:w-36 text-right text-sm font-medium text-slate-600 shrink-0">
                        {stage.label}
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div
                          className="h-10 rounded-lg transition-all duration-700 ease-out flex items-center justify-center"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: color,
                            minWidth: '60px',
                          }}
                        >
                          <span className="text-white text-sm font-bold drop-shadow-sm">
                            {stage.count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Trend sparklines grid */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">
            Trends ({days}d)
          </h2>
          {loading ? (
            <TrendSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stages.map((stage, i) => {
                const histData = data?.history.stages[stage.id] ?? [];
                const color = FUNNEL_COLORS[i] ?? FUNNEL_COLORS[FUNNEL_COLORS.length - 1];
                const latest = histData[histData.length - 1] ?? 0;
                const prev = histData[histData.length - 2] ?? 0;
                const delta = prev > 0 ? ((latest - prev) / prev) * 100 : 0;

                return (
                  <div
                    key={stage.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 opacity-0 translate-y-2"
                    style={{
                      animation: `funnelFadeIn 0.4s ease-out ${i * 0.04}s forwards`,
                    }}
                  >
                    <div className="text-xs text-slate-500 mb-1">{stage.label}</div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg font-bold text-[#131F24]">
                        {stage.count.toLocaleString()}
                      </span>
                      {delta !== 0 && histData.length >= 2 && (
                        <span
                          className={`text-xs font-medium ${
                            delta > 0 ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {delta > 0 ? '+' : ''}
                          {delta.toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <Sparkline data={histData} color={color} />
                  </div>
                );
              })}

              {/* DAU trend card */}
              <div
                className="bg-white border border-slate-200 rounded-2xl p-4 opacity-0 translate-y-2"
                style={{
                  animation: `funnelFadeIn 0.4s ease-out ${stages.length * 0.04}s forwards`,
                }}
              >
                <div className="text-xs text-slate-500 mb-1">Daily Active Users</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-bold text-[#131F24]">
                    {(data?.today.dau ?? 0).toLocaleString()}
                  </span>
                </div>
                <Sparkline
                  data={data?.history.stages.daily_active_users ?? []}
                  color="#58CC02"
                />
              </div>
            </div>
          )}
        </div>

        {/* Lessons per day bar chart */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">
            Lessons Completed Per Day
          </h2>
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
              <div className="flex items-end gap-1 h-40">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-slate-200 rounded-t"
                    style={{ height: `${20 + Math.random() * 80}%` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              {(data?.lessonsPerDay?.length ?? 0) === 0 ? (
                <div className="text-sm text-slate-400 text-center py-8">
                  No lesson data yet
                </div>
              ) : (() => {
                const lpd = data!.lessonsPerDay;
                const maxLessons = Math.max(...lpd.map((d) => d.count), 1);
                const totalLessons = lpd.reduce((s, d) => s + d.count, 0);
                const avg = Math.round(totalLessons / lpd.length);
                return (
                  <>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-2xl font-bold text-[#131F24]">
                        {totalLessons.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-500">
                        total ({avg}/day avg)
                      </span>
                    </div>
                    <div className="flex items-end gap-[3px] h-40">
                      {lpd.map((d, i) => {
                        const h = Math.max(4, (d.count / maxLessons) * 100);
                        return (
                          <div
                            key={d.date}
                            className="flex-1 group relative"
                            style={{ height: '100%' }}
                          >
                            <div
                              className="absolute bottom-0 left-0 right-0 bg-[#58CC02] rounded-t transition-all duration-300 hover:bg-[#46A302]"
                              style={{
                                height: `${h}%`,
                                animation: `funnelFadeIn 0.4s ease-out ${i * 0.03}s forwards`,
                                opacity: 0,
                              }}
                            />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                              {d.date.slice(5)}: {d.count}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                      <span>{lpd[0]?.date.slice(5)}</span>
                      <span>{lpd[lpd.length - 1]?.date.slice(5)}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Top Users */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">
            Top Users (7d)
          </h2>
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0" />
                  <div className="flex-1 h-4 bg-slate-200 rounded" />
                  <div className="w-16 h-4 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              {(data?.topUsers?.length ?? 0) === 0 ? (
                <div className="text-sm text-slate-400 text-center py-8">
                  No user data yet
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                      <th className="px-4 py-3 font-medium">#</th>
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium text-right">Events</th>
                      <th className="px-4 py-3 font-medium text-right">Lessons</th>
                      <th className="px-4 py-3 font-medium text-right">Daily Rooks</th>
                      <th className="px-4 py-3 font-medium text-right hidden sm:table-cell">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data!.topUsers.map((user, i) => {
                      const name = user.displayName || user.email || 'Anonymous';
                      const initial = name[0]?.toUpperCase() ?? '?';
                      const rankColors = ['bg-[#FFD700]', 'bg-slate-300', 'bg-amber-600'];
                      return (
                        <tr
                          key={i}
                          className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                                rankColors[i] ?? 'bg-slate-400'
                              }`}
                            >
                              {i + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 bg-[#1CB0F6]/10 text-[#1CB0F6] rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                {initial}
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-[#131F24] truncate max-w-[200px]">
                                  {user.displayName || 'No name'}
                                </div>
                                {user.email && (
                                  <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                    {user.email}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-[#131F24] tabular-nums">
                            {user.events.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            <span className="text-[#58CC02] font-medium">{user.lessons}</span>
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            <span className="text-[#FF9500] font-medium">{user.dailyRooks}</span>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-400 text-xs hidden sm:table-cell">
                            {formatTimeAgo(user.lastSeen)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Churned / At-Risk Users */}
        <div>
          <h2 className="text-lg font-bold text-white mb-1">
            At-Risk Users
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Active users who haven&apos;t been back in 7+ days
          </p>
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0" />
                  <div className="flex-1 h-4 bg-slate-200 rounded" />
                  <div className="w-20 h-4 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              {(data?.churnedUsers?.length ?? 0) === 0 ? (
                <div className="text-sm text-slate-400 text-center py-8">
                  No at-risk users found
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {data!.churnedUsers.map((user, i) => {
                    const name = user.displayName || user.email || 'Anonymous';
                    const initial = name[0]?.toUpperCase() ?? '?';
                    const daysGone = Math.floor(
                      (Date.now() - new Date(user.lastSeen).getTime()) / 86400000
                    );
                    const urgency =
                      daysGone >= 21
                        ? 'bg-red-100 text-red-700'
                        : daysGone >= 14
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-yellow-100 text-yellow-700';
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                          {initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-[#131F24] truncate">
                            {user.displayName || 'No name'}
                          </div>
                          {user.email && (
                            <div className="text-[11px] text-slate-400 truncate">
                              {user.email}
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${urgency}`}
                          >
                            {daysGone}d ago
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {user.totalLessons} lessons
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer spacing */}
        <div className="h-8" />
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes funnelFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
