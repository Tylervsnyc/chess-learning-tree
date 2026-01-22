'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { AuthEvents, identifyUser } from '@/lib/analytics/posthog';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromLesson = searchParams.get('from') === 'lesson';

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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
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
      <div className="min-h-screen bg-[#131F24] flex flex-col">
        <div className="h-1 w-full bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]" />
        <div className="flex-1 flex items-center justify-center px-5">
          <div className="max-w-sm w-full text-center">
            <div className="text-5xl mb-4">✉️</div>
            <h1 className="text-2xl font-black text-white mb-2">Check your email</h1>
            <p className="text-gray-400 mb-6">
              We sent a confirmation link to <strong className="text-white">{email}</strong>
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#0e7fb5]"
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
    <div className="min-h-screen bg-[#131F24] flex flex-col">
      {/* Gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]" />

      <div className="flex-1 flex items-center justify-center px-5 py-6">
        <div className="max-w-sm w-full">
          {/* Congratulatory header for guests who completed a lesson */}
          {fromLesson ? (
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">🎉</div>
              <h1
                className="text-2xl font-black bg-clip-text text-transparent mb-2"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #58CC02, #1CB0F6, #FF9600)',
                }}
              >
                You're on The Chess Path!
              </h1>
              <p className="text-gray-400 text-sm">
                Create an account to save your progress and keep learning
              </p>
            </div>
          ) : (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black text-white mb-2">Create Account</h1>
              <p className="text-gray-400 text-sm">Start your chess improvement journey</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
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
              className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] disabled:opacity-50 disabled:shadow-none"
              style={{ backgroundColor: '#58CC02' }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-gray-400 text-sm pt-2">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#1CB0F6] hover:underline font-medium">
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
