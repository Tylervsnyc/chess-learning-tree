'use client';

type Status = 'healthy' | 'warning' | 'stale' | 'error' | 'ready' | 'wip' | 'on' | 'off';

const statusStyles: Record<Status, string> = {
  healthy: 'bg-emerald-500/20 text-emerald-400',
  warning: 'bg-amber-500/20 text-amber-400',
  stale: 'bg-red-500/20 text-red-400',
  error: 'bg-red-500/20 text-red-400',
  ready: 'bg-emerald-500/20 text-emerald-400',
  wip: 'bg-amber-500/20 text-amber-400',
  on: 'bg-emerald-500/20 text-emerald-400',
  off: 'bg-zinc-600/30 text-zinc-400',
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
            ? 'bg-emerald-400'
            : status === 'warning' || status === 'wip'
              ? 'bg-amber-400'
              : status === 'off'
                ? 'bg-zinc-500'
                : 'bg-red-400'
        }`}
      />
      {statusLabels[status]}
    </span>
  );
}
