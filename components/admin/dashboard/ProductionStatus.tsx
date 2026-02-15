'use client';

import { useState } from 'react';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';

const featureFlags = [
  { name: 'SHOW_STREAK_COUNTER', description: 'Fire emoji + streak badge on learn/daily pages', state: false },
  { name: 'SHOW_SHARING', description: 'Share buttons on lesson complete + Daily Rook', state: false },
  { name: 'FREE_UNTIL_MARCH', description: 'Free access until March 1, 2026', state: true },
];

const builtNotDeployed = [
  { name: 'Email System', detail: '5 templates, 6 cron jobs — vercel.json crons empty', status: 'ready' as const },
  { name: "King's Path", detail: 'Playable demo, needs production route + scoring', status: 'wip' as const },
  { name: 'Daily Puzzle Video', detail: 'Remotion pipeline added, needs real puzzle integration', status: 'wip' as const },
];

const deadAnalytics = [
  'lesson_abandoned', 'tree_level_viewed', 'logout', 'streak_updated', 'profile_viewed',
  'onboarding_started', 'onboarding_completed', 'onboarding_skipped', 'onboarding_step_viewed',
  'onboarding_step_completed', 'onboarding_step_skipped', 'onboarding_cta_clicked',
];

const quickWins = [
  'Deploy vercel.json crons to activate email + revenue snapshot pipeline',
  'Enable SHOW_STREAK_COUNTER — code is complete, just flip the flag',
  'Enable SHOW_SHARING — share buttons are built, needs flag toggle',
  'Add error boundaries to /lesson/[id] and /daily-challenge pages',
  'Wire up Daily Puzzle Video to real puzzle data from the day\'s challenge',
];

export default function ProductionStatus() {
  const [showDeadAnalytics, setShowDeadAnalytics] = useState(false);

  return (
    <DashboardCard
      title="Production Status"
      fullWidth
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Feature Flags Table */}
        <div>
          <h3 className="text-sm font-medium text-chess-text-muted mb-2">Feature Flags</h3>
          <div className="bg-chess-page rounded-xl overflow-hidden border border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-3 py-2 text-xs text-chess-text-muted font-medium">Flag</th>
                  <th className="text-left px-3 py-2 text-xs text-chess-text-muted font-medium">Description</th>
                  <th className="text-center px-3 py-2 text-xs text-chess-text-muted font-medium">State</th>
                </tr>
              </thead>
              <tbody>
                {featureFlags.map((flag) => (
                  <tr key={flag.name} className="border-b border-slate-100 last:border-0">
                    <td className="px-3 py-2 text-chess-text font-mono text-xs whitespace-nowrap">{flag.name}</td>
                    <td className="px-3 py-2 text-chess-text-muted text-xs">{flag.description}</td>
                    <td className="px-3 py-2 text-center">
                      <StatusBadge status={flag.state ? 'on' : 'off'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Built Not Deployed */}
        <div>
          <h3 className="text-sm font-medium text-chess-text-muted mb-2">Built Not Deployed</h3>
          <div className="space-y-2">
            {builtNotDeployed.map((item) => (
              <div key={item.name} className="bg-chess-page rounded-xl p-3 flex items-start justify-between border border-slate-100">
                <div>
                  <div className="text-sm text-chess-text font-medium">{item.name}</div>
                  <div className="text-xs text-chess-text-muted mt-0.5">{item.detail}</div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Dead Analytics */}
        <div>
          <h3 className="text-sm font-medium text-chess-text-muted mb-2">
            Dead Analytics
            <button
              onClick={() => setShowDeadAnalytics(!showDeadAnalytics)}
              className="ml-2 text-xs text-chess-text-faint hover:text-chess-text-muted transition-colors"
            >
              {showDeadAnalytics ? 'Hide' : `Show (${deadAnalytics.length})`}
            </button>
          </h3>
          {showDeadAnalytics && (
            <div className="bg-chess-page rounded-xl p-3 border border-slate-100">
              <div className="flex flex-wrap gap-1.5">
                {deadAnalytics.map((event) => (
                  <span
                    key={event}
                    className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-chess-text-muted"
                  >
                    {event}
                  </span>
                ))}
              </div>
              <div className="text-xs text-chess-text-faint mt-2">
                These events are defined in code but never called. Safe to remove.
              </div>
            </div>
          )}
        </div>

        {/* Quick Wins */}
        <div>
          <h3 className="text-sm font-medium text-chess-text-muted mb-2">Quick Wins</h3>
          <div className="space-y-1.5">
            {quickWins.map((win, i) => (
              <div key={i} className="flex items-start gap-2 bg-chess-page rounded-xl px-3 py-2 border border-slate-100">
                <span className="text-xs font-bold text-chess-green mt-0.5 shrink-0">{i + 1}.</span>
                <span className="text-xs text-chess-text">{win}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
