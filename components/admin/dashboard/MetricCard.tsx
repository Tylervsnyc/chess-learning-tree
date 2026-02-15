'use client';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: number | null;
  deltaLabel?: string;
  loading?: boolean;
}

export default function MetricCard({ label, value, delta, deltaLabel, loading }: MetricCardProps) {
  if (loading) {
    return (
      <div className="bg-zinc-900/50 rounded-lg p-3 min-w-[120px]">
        <div className="h-7 w-20 bg-zinc-700/50 rounded animate-pulse mb-1" />
        <div className="h-4 w-16 bg-zinc-700/30 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 rounded-lg p-3 min-w-[120px]">
      <div className="text-2xl font-bold text-zinc-100 tabular-nums">{value}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
      {delta !== undefined && delta !== null && (
        <div
          className={`text-xs font-medium mt-1 tabular-nums ${
            delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-red-400' : 'text-zinc-500'
          }`}
        >
          {delta > 0 ? '+' : ''}{delta}%{deltaLabel ? ` ${deltaLabel}` : ''}
        </div>
      )}
    </div>
  );
}
