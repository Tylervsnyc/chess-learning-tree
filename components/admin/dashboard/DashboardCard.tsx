'use client';

import { useState } from 'react';

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
  defaultCollapsed?: boolean;
}

export default function DashboardCard({
  title,
  icon,
  children,
  fullWidth = false,
  defaultCollapsed = false,
}: DashboardCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div
      className={`bg-chess-surface rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${
        fullWidth ? 'col-span-1 md:col-span-2' : ''
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between p-5 pb-3 text-left hover:bg-chess-page/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-chess-text-muted">{icon}</span>
          <h2 className="text-lg font-semibold text-chess-text">{title}</h2>
        </div>
        <svg
          className={`w-4 h-4 text-chess-text-faint transition-transform ${collapsed ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {!collapsed && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}
