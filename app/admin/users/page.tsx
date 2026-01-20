'use client';

import { useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  display_name: string | null;
  subscription_status: 'free' | 'premium' | 'trial';
  subscription_expires_at: string | null;
  elo_rating: number;
  created_at: string;
}

export default function AdminUsersPage() {
  const [searchEmail, setSearchEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const searchUsers = async () => {
    if (!searchEmail.trim()) {
      setError('Please enter an email to search');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/admin/users?email=${encodeURIComponent(searchEmail)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to search users');
        setUsers([]);
      } else {
        setUsers(data.users);
        if (data.users.length === 0) {
          setError('No users found with that email');
        }
      }
    } catch {
      setError('Failed to connect to server');
      setUsers([]);
    }

    setLoading(false);
  };

  const updateSubscription = async (userId: string, status: 'free' | 'premium' | 'trial', expiresAt: string | null, eloRating?: number) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          subscriptionStatus: status,
          expiresAt,
          eloRating,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update user');
      } else {
        setSuccessMessage('User updated successfully! They now have premium + all levels unlocked.');
        // Update local state
        setUsers(users.map(u =>
          u.id === userId
            ? { ...u, subscription_status: status, subscription_expires_at: expiresAt, elo_rating: eloRating ?? u.elo_rating }
            : u
        ));
      }
    } catch {
      setError('Failed to connect to server');
    }

    setLoading(false);
  };

  const grantPremium = (userId: string) => {
    // Set expiry far in the future (2099) and ELO to 1700 to unlock all levels
    updateSubscription(userId, 'premium', '2099-12-31T23:59:59.000Z', 1700);
  };

  const revokePremium = (userId: string) => {
    updateSubscription(userId, 'free', null);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'premium':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#58CC02]/20 text-[#58CC02]">Premium</span>;
      case 'trial':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#1CB0F6]/20 text-[#1CB0F6]">Trial</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">Free</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">User Management</h1>
              <p className="text-sm text-gray-400">Search and manage user subscriptions</p>
            </div>
            <Link
              href="/admin"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Box */}
        <div className="bg-[#1A2C35] rounded-xl p-6 mb-6 border border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search by Email
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
              placeholder="tyler@example.com"
              className="flex-1 px-4 py-3 bg-[#131F24] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#58CC02] transition-colors"
            />
            <button
              onClick={searchUsers}
              disabled={loading}
              className="px-6 py-3 bg-[#58CC02] text-white font-semibold rounded-lg hover:bg-[#46A302] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-[#58CC02]/10 border border-[#58CC02]/30 text-[#58CC02] px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {/* Results */}
        {users.length > 0 && (
          <div className="bg-[#1A2C35] rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="font-semibold">Search Results ({users.length})</h2>
            </div>

            <div className="divide-y divide-gray-700">
              {users.map((user) => (
                <div key={user.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-lg">{user.display_name || 'No name'}</span>
                        {getStatusBadge(user.subscription_status)}
                      </div>
                      <div className="text-gray-400 text-sm space-y-1">
                        <p><span className="text-gray-500">Email:</span> {user.email}</p>
                        <p><span className="text-gray-500">ELO:</span> {user.elo_rating}</p>
                        <p><span className="text-gray-500">Joined:</span> {formatDate(user.created_at)}</p>
                        {user.subscription_status !== 'free' && (
                          <p><span className="text-gray-500">Expires:</span> {formatDate(user.subscription_expires_at)}</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      {user.subscription_status === 'premium' ? (
                        <button
                          onClick={() => revokePremium(user.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-red-500/20 text-red-400 font-medium rounded-lg hover:bg-red-500/30 disabled:opacity-50 transition-colors text-sm"
                        >
                          Revoke Premium
                        </button>
                      ) : (
                        <button
                          onClick={() => grantPremium(user.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-[#58CC02]/20 text-[#58CC02] font-medium rounded-lg hover:bg-[#58CC02]/30 disabled:opacity-50 transition-colors text-sm"
                        >
                          Grant Premium
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-[#1A2C35] rounded-xl p-6 border border-gray-700">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <p className="text-gray-400 text-sm mb-4">
            Search for &quot;tyler@learnthroughstories.com&quot; and click &quot;Grant Premium&quot; to give full access.
          </p>
          <button
            onClick={() => {
              setSearchEmail('tyler@learnthroughstories.com');
              setTimeout(() => searchUsers(), 100);
            }}
            className="text-[#1CB0F6] text-sm hover:underline"
          >
            Search for tyler@learnthroughstories.com →
          </button>
        </div>
      </div>
    </div>
  );
}
