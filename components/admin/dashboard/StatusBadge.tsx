'use client';

type Status = 'healthy' | 'warning' | 'stale' | 'error' | 'ready' | 'wip' | 'on' | 'off';

const statusStyles: Record<Status, string> = {
  healthy: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-600 border border-amber-200',
  stale: 'bg-red-50 text-red-600 border border-red-200',
  error: 'bg-red-50 text-red-600 border border-red-200',
  ready: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  wip: 'bg-amber-50 text-amber-600 border border-amber-200',
  on: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  off: 'bg-slate-50 text-chess-text-faint border border-slate-200',
};

const statusLabels: Record<Status, string> = {
  healthy: 'Healthy',
  warning: 'Warning',
  stale: 'Stale',
  error: 'Error',
  ready: 'Ready',
  wip: 'WIP',
  on: 'ON',
  off: 'OFF',
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'healthy' || status === 'ready' || status === 'on'
            ? 'bg-emerald-500'
            : status === 'warning' || status === 'wip'
              ? 'bg-amber-500'
              : status === 'off'
                ? 'bg-slate-400'
                : 'bg-red-500'
        }`}
      />
      {statusLabels[status]}
    </span>
  );
}
