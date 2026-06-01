'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics/posthog';
import { BreathingRook } from '@/components/ui/BreathingRook';

function ForgotPasswordContent() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Auto-clear errors after 5 seconds
  // useEffect intentionally omitted — keeping consistent with login page pattern
  // but errors here are unlikely to need auto-clear since the form is simple

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    trackEvent('password_reset_requested', { version: 'v2' });
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="h-full md:h-auto bg-chess-page flex flex-col overflow-hidden">
        <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6">
          <div className="mx-auto w-full max-w-md md:max-w-lg">
            <div className="bg-chess-surface border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-4"><BreathingRook size="md" /></div>
              <h1 className="text-2xl font-bold text-chess-text mb-2">Check your email</h1>
              <p className="text-chess-text-muted text-sm mb-1">
                We sent a password reset link to
              </p>
              <p className="text-chess-text font-bold text-sm mb-6">{email}</p>
              <p className="text-chess-text-faint text-xs mb-6">
                Click the link in the email to set a new password. It may take a minute to arrive.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center w-full min-h-[44px] py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#0d7ec4] bg-chess-blue text-center"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full md:h-auto bg-chess-page flex flex-col overflow-hidden">
      {/* Gradient top bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />

      <div className="flex-1 flex flex-col items-center px-4 md:px-6 pt-6 min-h-0">
        {/* Brand header */}
        <div className="mb-6 text-center">
          <Image
            src="/brand/logo-horizontal-light.svg"
            alt="Chess Path"
            width={260}
            height={60}
            className="mx-auto mb-2"
            priority
          />
        </div>

        <div className="mx-auto w-full max-w-md md:max-w-lg">
          {/* Card container */}
          <div className="bg-chess-surface border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h1 className="text-xl font-bold text-chess-text text-center mb-1">Reset your password</h1>
            <p className="text-chess-text-muted text-sm text-center mb-4">
              Enter your email and we&apos;ll send a reset link
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm mb-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-chess-text-muted mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-chess-text placeholder-slate-400 focus:outline-none focus:border-chess-blue focus:bg-white transition-colors disabled:opacity-50"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] disabled:opacity-50 disabled:shadow-none bg-chess-green flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>

          <p className="text-center text-chess-text-muted text-sm pt-4">
            <Link href="/auth/login" className="text-chess-green hover:underline font-medium">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-chess-page flex items-center justify-center">
        <BreathingRook label="Loading..." />
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}
