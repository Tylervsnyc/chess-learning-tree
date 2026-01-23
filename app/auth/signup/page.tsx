'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { AuthEvents, identifyUser } from '@/lib/analytics/posthog';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromLesson = searchParams.get('from') === 'lesson';
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    AuthEvents.signupPageViewed();
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    AuthEvents.signupStarted();

    const supabase = createClient();

    // Build the callback URL with redirect
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    if (redirectTo) {
      callbackUrl.searchParams.set('next', redirectTo);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
        emailRedirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      AuthEvents.signupFailed(error.message);
      setError(error.message);
      setLoading(false);
      return;
    }

    // Identify the user in PostHog
    if (data.user) {
      identifyUser(data.user.id, { email, displayName });
    }
    AuthEvents.signupCompleted('email');

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
        <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />
        <div className="flex-1 flex flex-col items-center justify-center px-3">
          <div className="max-w-[320px] w-full text-center">
            <div className="text-5xl mb-4">✉️</div>
            <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-gray-400 mb-6">
              We sent a confirmation link to <strong className="text-white">{email}</strong>
            </p>
            <Link
              href="/auth/login"
              className="inline-block w-full py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#0d7ec4]"
              style={{ backgroundColor: '#1CB0F6' }}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
      {/* Gradient top bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />

      <div className="flex-1 flex flex-col items-center px-3 pt-6 min-h-0">
        {/* Brand header */}
        <div className="mb-4 text-center">
          <Image
            src="/brand/icon-96.svg"
            alt="Chess Path"
            width={64}
            height={64}
            className="mx-auto mb-2"
          />
          <div className="font-bold text-2xl">
            <span className="text-white">chess</span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }}>path</span>
          </div>
        </div>

        <div className="w-full max-w-[320px]">
          {/* Congratulatory header for guests who completed a lesson */}
          {fromLesson ? (
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-white mb-1">Nice work! 🎉</h1>
              <p className="text-gray-400 text-sm">Create an account to save progress</p>
            </div>
          ) : (
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-white mb-1">Create Account</h1>
              <p className="text-gray-400 text-sm">Start your chess journey</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3">
            {error && (
              <div className="bg-[#FF4B4B]/10 border border-[#FF4B4B]/50 rounded-xl p-3 text-[#FF4B4B] text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1A2C35] border-2 border-transparent rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1CB0F6] transition-colors"
                placeholder="ChessMaster2000"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1A2C35] border-2 border-transparent rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1CB0F6] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-[#1A2C35] border-2 border-transparent rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1CB0F6] transition-colors"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] disabled:opacity-50 disabled:shadow-none"
              style={{ backgroundColor: '#58CC02' }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-gray-400 text-sm pt-2">
              Already have an account?{' '}
              <Link
                href={redirectTo ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}` : '/auth/login'}
                className="text-[#1CB0F6] hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
