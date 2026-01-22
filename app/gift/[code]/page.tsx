'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function GiftPage() {
  const params = useParams();
  const code = (params.code as string)?.toUpperCase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    // Sign up with redirect to apply promo code
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          promo_code: code, // Store the promo code to apply after confirmation
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/gift/welcome?code=${code}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">✉️</div>
          <h1 className="text-2xl font-bold text-white mb-3">Check your email!</h1>
          <p className="text-gray-400 mb-2">
            We sent a confirmation link to
          </p>
          <p className="text-white font-medium text-lg mb-6">{email}</p>
          <p className="text-gray-500 text-sm">
            Click the link in your email to activate your free premium membership.
          </p>
        </div>
      </div>
    );
  }

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
            {loading ? 'Creating account...' : 'Claim My Free Month'}
          </button>

          <p className="text-center text-gray-500 text-xs">
            By signing up, you agree to our terms of service.
          </p>
        </form>
      </div>
    </div>
  );
}
