'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function GiftPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params.code as string)?.toUpperCase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      // If user already exists
      if (data.user.identities?.length === 0) {
        setError('An account with this email already exists. Please log in instead.');
        setLoading(false);
        return;
      }

      // If email confirmation is required, user won't have a session yet
      // Try to sign in immediately (works if email confirmation is disabled)
      if (!data.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // Email confirmation is required - show message
          setError(null);
          router.push(`/gift/check-email?email=${encodeURIComponent(email)}&code=${code}`);
          return;
        }
      }

      // Wait a moment for the profile to be created by the database trigger
      await new Promise(resolve => setTimeout(resolve, 1000));

      // User is signed in - apply promo code
      const promoResponse = await fetch('/api/promo/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const promoData = await promoResponse.json();

      if (!promoResponse.ok) {
        console.error('Promo error:', promoData.error);
        // Still continue - user can redeem later
      }

      // Success! Go to onboarding
      router.push('/onboarding');

    } catch (err) {
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎁</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            You've been gifted
          </h1>
          <p className="text-2xl font-bold text-[#58CC02] mb-4">
            1 Month of Premium Chess Training
          </p>
          <p className="text-gray-400">
            Create your account to start learning
          </p>
        </div>

        <form onSubmit={handleSignup} className="bg-[#1A2C35] rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#131F24] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#58CC02]"
              placeholder="What should we call you?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#131F24] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#58CC02]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-[#131F24] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#58CC02]"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#58CC02] hover:bg-[#4CAD02] disabled:bg-[#58CC02]/50 text-white font-bold text-lg rounded-xl transition-colors"
          >
            {loading ? 'Setting up your account...' : 'Claim My Free Month'}
          </button>

          <p className="text-center text-gray-500 text-xs">
            By signing up, you agree to our terms of service.
          </p>
        </form>
      </div>
    </div>
  );
}
