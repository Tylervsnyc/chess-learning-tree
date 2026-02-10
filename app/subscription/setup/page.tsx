'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function SetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchSessionDetails() {
      if (!sessionId) {
        router.push('/pricing');
        return;
      }

      try {
        const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setEmail(data.email);
        }
      } catch (err) {
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSessionDetails();
  }, [sessionId, router]);

  const handleSetupAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          displayName,
          sessionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to set up account');
      }

      // Auto sign in with the new credentials
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email!,
        password,
      });

      if (signInError) {
        // If sign in fails, still show success but redirect to login
        setSuccess(true);
        return;
      }

      // Redirect to success page
      router.push('/subscription/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-chess-page flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chess-green"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-full bg-chess-page flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-chess-green to-chess-green-dark flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-chess-text mb-2">Account Created!</h1>
          <p className="text-chess-text-muted mb-8">
            Your account is all set up. Please sign in to continue.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full py-4 rounded-xl bg-chess-green text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-chess-page flex flex-col">
      <div className="h-1 w-full bg-gradient-to-r from-chess-gold via-chess-orange to-chess-green" />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          {/* Success header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <span className="text-4xl">👑</span>
            </div>
            <h1 className="text-2xl font-bold text-chess-text mb-2">Payment Successful!</h1>
            <p className="text-chess-text-muted">
              Set up your password to access your Premium account
            </p>
          </div>

          <form onSubmit={handleSetupAccount} className="space-y-4">
            {error && (
              <div className="bg-chess-red/10 border border-chess-red/50 rounded-xl p-3 text-chess-red text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-chess-text-muted mb-1">
                Email
              </label>
              <input
                type="email"
                value={email || ''}
                disabled
                className="w-full px-4 py-3 bg-chess-text-faint/10 border-2 border-chess-text-faint/10 rounded-xl text-chess-text-muted cursor-not-allowed shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-chess-text-muted mb-1">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-chess-surface border-2 border-transparent rounded-xl text-chess-text placeholder-chess-text-faint focus:outline-none focus:border-chess-gold transition-colors shadow-sm"
                placeholder="ChessMaster2000"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-chess-text-muted mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-chess-surface border-2 border-transparent rounded-xl text-chess-text placeholder-chess-text-faint focus:outline-none focus:border-chess-gold transition-colors shadow-sm"
                placeholder="••••••••"
              />
              <p className="text-xs text-chess-text-faint mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-chess-text-muted mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-chess-surface border-2 border-transparent rounded-xl text-chess-text placeholder-chess-text-faint focus:outline-none focus:border-chess-gold transition-colors shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
              }}
            >
              {submitting ? 'Setting up...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionSetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-full bg-chess-page flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chess-green"></div>
      </div>
    }>
      <SetupContent />
    </Suspense>
  );
}
