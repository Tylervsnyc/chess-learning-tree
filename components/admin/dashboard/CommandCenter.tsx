'use client';

import { useState, useCallback } from 'react';
import DashboardCard from './DashboardCard';

const skillCommands = [
  { name: 'UX Insights', command: '/ux-insights', icon: '🔍', description: 'Analyze user experience' },
  { name: 'Bug Triage', command: '/bug-triage', icon: '🐛', description: 'Prioritize open bugs' },
  { name: 'Code Review', command: '/code-review', icon: '📝', description: 'Review recent changes' },
  { name: 'Dep Audit', command: '/dependency-audit', icon: '📦', description: 'Check dependencies' },
];

const featureFlags = [
  { name: 'SHOW_STREAK_COUNTER', description: 'Fire emoji + streak badge on learn/daily pages', state: false },
  { name: 'SHOW_SHARING', description: 'Share buttons on lesson complete + Daily Rook', state: false },
  { name: 'FREE_UNTIL_MARCH', description: 'Free access until March 1, 2026', state: true },
];

interface UserResult {
  id: string;
  email: string;
  display_name: string | null;
  subscription_status: string;
  subscription_expires_at: string | null;
  created_at: string;
}

export default function CommandCenter() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [users, setUsers] = useState<UserResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  const copyCommand = useCallback((command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  }, []);

  const searchUsers = useCallback(async () => {
    if (!searchEmail.trim()) return;
    setSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(`/api/admin/users?email=${encodeURIComponent(searchEmail)}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setSearchError('Failed to search users');
    } finally {
      setSearching(false);
    }
  }, [searchEmail]);

  const updateSubscription = useCallback(async (userId: string, status: 'premium' | 'free') => {
    setUpdatingUser(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          subscriptionStatus: status,
          expiresAt: status === 'premium'
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : null,
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      // Re-search to refresh
      await searchUsers();
    } catch {
      setSearchError('Failed to update user');
    } finally {
      setUpdatingUser(null);
    }
  }, [searchUsers]);

  return (
    <DashboardCard
      title="Command Center"
      fullWidth
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      }
    >
      <div className="space-y-5">
        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-medium text-chess-text-muted mb-2">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            {skillCommands.map((cmd) => (
              <button
                key={cmd.command}
                onClick={() => copyCommand(cmd.command)}
                className="flex items-center gap-2 px-3 py-2 bg-chess-page border border-slate-200 rounded-xl
                           hover:border-chess-green hover:bg-emerald-50/50 transition-all text-sm group"
              >
                <span>{cmd.icon}</span>
                <span className="text-chess-text group-hover:text-chess-green-dark font-medium">{cmd.name}</span>
                {copiedCommand === cmd.command ? (
                  <span className="text-chess-green text-xs font-medium">Copied!</span>
                ) : (
                  <span className="text-chess-text-faint text-xs group-hover:text-chess-text-muted">
                    {cmd.command}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* User Search */}
          <div>
            <h3 className="text-sm font-medium text-chess-text-muted mb-2">User Search</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                placeholder="Search by email..."
                className="flex-1 px-3 py-2 bg-chess-page border border-slate-200 rounded-xl text-sm
                           text-chess-text placeholder:text-chess-text-faint focus:outline-none focus:ring-2 focus:ring-chess-green/40 focus:border-chess-green"
              />
              <button
                onClick={searchUsers}
                disabled={searching}
                className="px-4 py-2 bg-chess-blue text-white font-bold rounded-xl text-sm
                           shadow-[0_3px_0_var(--color-chess-blue-shadow)]
                           hover:bg-chess-blue-dark active:translate-y-[1px] active:shadow-[0_1px_0_var(--color-chess-blue-shadow)]
                           transition-all disabled:opacity-50"
              >
                {searching ? '...' : 'Search'}
              </button>
            </div>
            {searchError && <p className="text-chess-red text-xs mt-1">{searchError}</p>}
            {users.length > 0 && (
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between px-3 py-2 bg-chess-page rounded-xl border border-slate-100"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-chess-text truncate">{user.email}</div>
                      <div className="text-xs text-chess-text-muted">
                        {user.subscription_status || 'free'} &middot; Joined{' '}
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2 shrink-0">
                      {user.subscription_status === 'premium' ? (
                        <button
                          onClick={() => updateSubscription(user.id, 'free')}
                          disabled={updatingUser === user.id}
                          className="px-2 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg
                                     hover:bg-red-100 transition-colors disabled:opacity-50 font-medium"
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          onClick={() => updateSubscription(user.id, 'premium')}
                          disabled={updatingUser === user.id}
                          className="px-2 py-1 text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg
                                     hover:bg-emerald-100 transition-colors disabled:opacity-50 font-medium"
                        >
                          Grant Premium
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feature Flags */}
          <div>
            <h3 className="text-sm font-medium text-chess-text-muted mb-2">Feature Flags</h3>
            <div className="space-y-2">
              {featureFlags.map((flag) => (
                <div
                  key={flag.name}
                  className="flex items-center justify-between px-3 py-2 bg-chess-page rounded-xl border border-slate-100"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-chess-text font-mono">{flag.name}</div>
                    <div className="text-xs text-chess-text-muted">{flag.description}</div>
                  </div>
                  <button
                    onClick={() => {
                      // Display-only toggle with instruction
                      alert(`To toggle ${flag.name}, update the flag in lib/posthog-flags.ts or code config.`);
                    }}
                    className={`relative ml-2 w-10 h-5 rounded-full transition-colors shrink-0 ${
                      flag.state ? 'bg-chess-green' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                        flag.state
                          ? 'translate-x-5 bg-white'
                          : 'translate-x-0.5 bg-white'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
