'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { AuthEvents, identifyUser } from '@/lib/analytics/posthog';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AuthEvents.loginPageViewed();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      AuthEvents.loginFailed(error.message);
      setError(error.message);
      setLoading(false);
      return;
    }

    // Identify the user in PostHog
    if (data.user) {
      identifyUser(data.user.id, { email: data.user.email });
    }
    AuthEvents.loginCompleted();

    router.push(redirectTo || '/');
    router.refresh();
  };

  return (
    <div className="h-screen bg-[#131F24] flex flex-col overflow-hidden">
      {/* Gradient top bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)' }} />

      <div className="flex-1 flex flex-col items-center px-3 pt-6 min-h-0">
        {/* Brand header */}
        <div className="mb-6 text-center">
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
          <h1 className="text-xl font-bold text-white text-center mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm text-center mb-4">Sign in to continue</p>

          <form onSubmit={handleLogin} className="space-y-3">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

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
                className="w-full px-4 py-3 bg-[#1A2C35] border-2 border-transparent rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1CB0F6] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#0d7ec4] disabled:opacity-50 disabled:shadow-none"
              style={{ backgroundColor: '#1CB0F6' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-gray-400 text-sm pt-2">
              Don&apos;t have an account?{' '}
              <Link
                href={redirectTo ? `/auth/signup?redirect=${encodeURIComponent(redirectTo)}` : '/auth/signup'}
                className="text-[#58CC02] hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
