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
      <div className="bg-chess-page rounded-xl p-3 min-w-[120px] border border-slate-100">
        <div className="h-7 w-20 bg-slate-200 rounded animate-pulse mb-1" />
        <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-chess-page rounded-xl p-3 min-w-[120px] border border-slate-100">
      <div className="text-2xl font-bold text-chess-text tabular-nums">{value}</div>
      <div className="text-xs text-chess-text-muted mt-0.5">{label}</div>
      {delta !== undefined && delta !== null && (
        <div
          className={`text-xs font-medium mt-1 tabular-nums ${
            delta > 0 ? 'text-chess-green' : delta < 0 ? 'text-chess-red' : 'text-chess-text-faint'
          }`}
        >
          {delta > 0 ? '+' : ''}{delta}%{deltaLabel ? ` ${deltaLabel}` : ''}
        </div>
      )}
    </div>
  );
}
