'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import MorningBriefing from '@/components/admin/dashboard/MorningBriefing';
import CommandCenter from '@/components/admin/dashboard/CommandCenter';
import RevenuePanel from '@/components/admin/dashboard/RevenuePanel';
import HealthPanel from '@/components/admin/dashboard/HealthPanel';
import EngagementPanel from '@/components/admin/dashboard/EngagementPanel';
import UXReportPanel from '@/components/admin/dashboard/UXReportPanel';
import ProductionStatus from '@/components/admin/dashboard/ProductionStatus';

export default function AdminDashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setLastRefresh(new Date());
  }, []);

  return (
    <div className="min-h-screen bg-chess-page text-chess-text overflow-y-auto w-screen relative left-1/2 -translate-x-1/2 max-w-none">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-chess-text-faint hover:text-chess-text transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-chess-text">Chess Path Dashboard</h1>
              <p className="text-xs text-chess-text-faint">
                Last refresh: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-chess-green text-white font-bold rounded-xl
                       shadow-[0_4px_0_var(--color-chess-green-shadow)] hover:bg-chess-green-dark
                       active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-chess-green-shadow)]
                       transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Panel 0: Morning Briefing — full width */}
          <MorningBriefing refreshKey={refreshKey} />

          {/* Panel 1: Command Center — full width */}
          <CommandCenter />

          {/* Panel 2: Revenue — left column */}
          <RevenuePanel refreshKey={refreshKey} />

          {/* Panel 3: Health — right column */}
          <HealthPanel refreshKey={refreshKey} />

          {/* Panel 4: Engagement — left column */}
          <EngagementPanel refreshKey={refreshKey} />

          {/* Panel 5: UX Report — right column */}
          <UXReportPanel refreshKey={refreshKey} />

          {/* Panel 6: Production Status — full width */}
          <ProductionStatus />
        </div>
      </div>
    </div>
  );
}
