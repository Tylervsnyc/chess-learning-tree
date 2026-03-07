'use client';

import { useEffect, useState, useCallback } from 'react';

interface FunnelStage {
  id: string;
  label: string;
  icon: string;
  count: number | null;
}

interface ConversionFunnelProps {
  refreshKey: number;
}

const STAGE_COLORS = [
  { bg: 'bg-[#1CB0F6]', text: 'text-[#1CB0F6]', hex: '#1CB0F6' },        // Ad Traffic - blue
  { bg: 'bg-[#1899D6]', text: 'text-[#1899D6]', hex: '#1899D6' },        // Landing - blue dark
  { bg: 'bg-[#3EAF5C]', text: 'text-[#3EAF5C]', hex: '#3EAF5C' },        // Signup Page - blue→green
  { bg: 'bg-[#58CC02]', text: 'text-[#58CC02]', hex: '#58CC02' },        // Signed Up - green
  { bg: 'bg-[#58CC02]', text: 'text-[#58CC02]', hex: '#58CC02' },        // First Lesson - green
  { bg: 'bg-[#46A302]', text: 'text-[#46A302]', hex: '#46A302' },        // Lesson Done - green dark
  { bg: 'bg-[#FF9500]', text: 'text-[#FF9500]', hex: '#FF9500' },        // Paywall - orange
  { bg: 'bg-[#E8A020]', text: 'text-[#E8A020]', hex: '#E8A020' },        // Checkout - orange→gold
  { bg: 'bg-[#FFD700]', text: 'text-[#FFD700]', hex: '#FFD700' },        // Premium - gold
];

const PERIODS = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

function ConversionBadge({ from, to }: { from: number; to: number }) {
  if (from === 0) return null;
  const rate = (to / from) * 100;
  const dropped = from - to;

  let colorClass = 'bg-[#58CC02]/15 text-[#58CC02]';
  if (rate < 20) colorClass = 'bg-[#FF4B4B]/15 text-[#FF4B4B]';
  else if (rate < 50) colorClass = 'bg-[#FF9500]/15 text-[#FF9500]';

  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${colorClass}`}>
        {rate.toFixed(1)}%
      </span>
      <span className="text-[10px] text-chess-text-faint">
        -{formatNumber(dropped)} dropped
      </span>
    </div>
  );
}

function FunnelConnector({
  upperWidthPct,
  lowerWidthPct,
  colorTop,
  colorBottom,
}: {
  upperWidthPct: number;
  lowerWidthPct: number;
  colorTop: string;
  colorBottom: string;
}) {
  const gradientId = `grad-${colorTop.replace('#', '')}-${colorBottom.replace('#', '')}`;

  // Calculate the trapezoid shape
  const uHalf = upperWidthPct / 2;
  const lHalf = lowerWidthPct / 2;

  return (
    <svg
      viewBox="0 0 100 16"
      className="w-full h-4"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorTop} stopOpacity="0.25" />
          <stop offset="100%" stopColor={colorBottom} stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path
        d={`
          M ${50 - uHalf} 0
          Q ${50 - (uHalf + lHalf) / 2} 8, ${50 - lHalf} 16
          L ${50 + lHalf} 16
          Q ${50 + (uHalf + lHalf) / 2} 8, ${50 + uHalf} 0
          Z
        `}
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

function StageBar({
  stage,
  index,
  widthPct,
  color,
  isLast,
  visible,
  hoveredIndex,
  onHover,
  prevCount,
}: {
  stage: FunnelStage;
  index: number;
  widthPct: number;
  color: (typeof STAGE_COLORS)[0];
  isLast: boolean;
  visible: boolean;
  hoveredIndex: number | null;
  onHover: (i: number | null) => void;
  prevCount: number | null;
}) {
  const isNoData = stage.count === null;
  const isHovered = hoveredIndex === index;
  const isPremium = isLast;

  return (
    <div
      className={`
        transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div
        className="mx-auto transition-transform duration-200 cursor-pointer"
        style={{ width: `${widthPct}%` }}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
      >
        <div
          className={`
            relative rounded-xl px-4 py-3 transition-all duration-200
            ${isHovered ? 'scale-[1.03]' : ''}
            ${isNoData
              ? 'border-2 border-dashed border-slate-300 bg-slate-50'
              : isPremium
                ? 'border-2 border-[#FFD700] bg-gradient-to-r from-[#FFD700]/10 via-[#FFF8DC]/20 to-[#FFD700]/10 shadow-[0_0_24px_rgba(255,215,0,0.25)]'
                : `${color.bg}/10 border border-slate-200`
            }
          `}
        >
          {/* Shimmer overlay for premium */}
          {isPremium && !isNoData && (
            <div
              className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.15), transparent)',
                animation: 'shimmer 2.5s ease-in-out infinite',
              }}
            />
          )}

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`
                w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0
                ${isNoData ? 'bg-slate-200' : isPremium ? 'bg-[#FFD700]/20' : `${color.bg}/20`}
              `}>
                {stage.icon}
              </span>
              <div className="min-w-0">
                <div className={`text-sm font-semibold truncate ${isPremium ? 'text-[#B8860B]' : 'text-chess-text'}`}>
                  {stage.label}
                </div>
                {isNoData && (
                  <div className="text-[10px] text-chess-text-faint">
                    Connect via UTM params
                  </div>
                )}
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              {isNoData ? (
                <span className="text-sm text-chess-text-faint italic">No data</span>
              ) : (
                <span className={`text-lg font-bold tabular-nums ${isPremium ? 'text-[#B8860B]' : 'text-chess-text'}`}>
                  {formatNumber(stage.count!)}
                </span>
              )}
            </div>
          </div>

          {/* Hover tooltip */}
          {isHovered && !isNoData && prevCount !== null && prevCount > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-chess-text-muted">
              <span>From previous: {((stage.count! / prevCount) * 100).toFixed(1)}% converted</span>
              <span>{formatNumber(prevCount - stage.count!)} dropped off</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConversionFunnel({ refreshKey }: ConversionFunnelProps) {
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setVisible(false);
    setError(null);
    try {
      const res = await fetch(`/api/admin/conversion-funnel?period=${period}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setStages(data.stages);
      // Trigger entrance animation after data loads
      setTimeout(() => setVisible(true), 50);
    } catch {
      setError('Failed to load funnel data');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  // Calculate widths based on max count
  const validCounts = stages
    .map(s => s.count)
    .filter((c): c is number => c !== null && c > 0);
  const maxCount = Math.max(...validCounts, 1);
  const getWidthPct = (count: number | null) => {
    if (count === null || count === 0) return 30;
    return Math.max(20, (count / maxCount) * 100);
  };

  // Overall conversion
  const topCount = stages.find(s => s.count !== null && s.count > 0)?.count ?? 0;
  const bottomCount = stages[stages.length - 1]?.count ?? 0;
  const overallRate = topCount > 0 ? ((bottomCount / topCount) * 100).toFixed(2) : '0';

  return (
    <div className="col-span-1 md:col-span-2 bg-chess-surface rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base font-bold text-chess-text flex items-center gap-2">
              <span className="text-lg">📊</span>
              Conversion Funnel
            </h2>
            <p className="text-xs text-chess-text-faint mt-0.5">
              Ad traffic to premium — {overallRate}% overall conversion
            </p>
          </div>

          {/* Period selector */}
          <div className="flex bg-chess-page rounded-lg p-0.5">
            {PERIODS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-md transition-all
                  ${period === p.value
                    ? 'bg-white text-chess-text shadow-sm'
                    : 'text-chess-text-muted hover:text-chess-text'
                  }
                `}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel body */}
      <div className="px-5 py-6">
        {loading ? (
          <div className="space-y-3 max-w-lg mx-auto">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="mx-auto h-12 bg-slate-100 rounded-xl animate-pulse"
                style={{ width: `${100 - i * 8}%` }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-chess-text-muted">
            <p>{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 text-chess-blue text-sm hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            {stages.map((stage, i) => {
              const widthPct = getWidthPct(stage.count);
              const color = STAGE_COLORS[i];
              const isLast = i === stages.length - 1;
              const prevStage = i > 0 ? stages[i - 1] : null;
              const prevCount = prevStage?.count ?? null;

              return (
                <div key={stage.id}>
                  {/* Conversion badge between stages */}
                  {i > 0 &&
                    prevCount !== null &&
                    prevCount > 0 &&
                    stage.count !== null && (
                      <>
                        <FunnelConnector
                          upperWidthPct={getWidthPct(prevCount)}
                          lowerWidthPct={widthPct}
                          colorTop={STAGE_COLORS[i - 1].hex}
                          colorBottom={color.hex}
                        />
                        <ConversionBadge from={prevCount} to={stage.count} />
                      </>
                    )}

                  <StageBar
                    stage={stage}
                    index={i}
                    widthPct={widthPct}
                    color={color}
                    isLast={isLast}
                    visible={visible}
                    hoveredIndex={hoveredIndex}
                    onHover={setHoveredIndex}
                    prevCount={prevCount}
                  />
                </div>
              );
            })}

            {/* Bottom summary */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full px-4 py-2">
                <span>👑</span>
                <span className="text-sm font-bold text-[#B8860B]">
                  {formatNumber(bottomCount)} premium members
                </span>
                <span className="text-xs text-[#B8860B]/60">
                  from {formatNumber(topCount)} visitors
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shimmer keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
