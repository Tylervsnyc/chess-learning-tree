'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirect}`,
          },
        });

        if (error) throw error;

        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push(redirect);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <button
          onClick={() => router.push('/')}
          className="mb-4 text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </button>
        <h1 className="text-3xl font-bold">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-gray-400 mt-2">
          {isSignUp
            ? 'Start your chess journey today'
            : 'Sign in to continue learning'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-[#58CC02]/20 border border-[#58CC02] rounded-lg text-[#58CC02] text-sm">
            {message}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#1A2C35] border border-[#2A3F4D] rounded-xl focus:outline-none focus:border-[#58CC02] transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-[#1A2C35] border border-[#2A3F4D] rounded-xl focus:outline-none focus:border-[#58CC02] transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[#58CC02] text-black font-bold rounded-xl hover:bg-[#4AB302] transition-colors disabled:opacity-50"
        >
          {isLoading
            ? 'Loading...'
            : isSignUp
            ? 'Create Account'
            : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-[#58CC02] hover:underline"
        >
          {isSignUp
            ? 'Already have an account? Sign in'
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="mb-4 h-6 w-24 bg-[#1A2C35] rounded animate-pulse mx-auto" />
        <div className="h-8 w-48 bg-[#1A2C35] rounded animate-pulse mx-auto mb-2" />
        <div className="h-4 w-64 bg-[#1A2C35] rounded animate-pulse mx-auto" />
      </div>
      <div className="space-y-4">
        <div className="h-12 bg-[#1A2C35] rounded-xl animate-pulse" />
        <div className="h-12 bg-[#1A2C35] rounded-xl animate-pulse" />
        <div className="h-12 bg-[#1A2C35] rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#131F24] text-white flex items-center justify-center px-4">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
