'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';

export default function LandingPage() {
  const router = useRouter();
  const { user, profile, loading } = useUser();

  // Redirect logged-in users based on onboarding status
  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.onboarding_completed) {
        router.push('/learn');
      } else {
        router.push('/onboarding');
      }
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // Show landing page for non-logged-in users
  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#131F24] flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">♟️</div>
        <h1 className="text-3xl font-bold text-white mb-2">
          The Chess Path
        </h1>
        <p className="text-gray-400 mb-8">
          A structured journey to master chess tactics, from beginner to expert
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <span
            className="px-3 py-1.5 rounded-full text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #58CC02, #2FCBEF)' }}
          >
            400-1200 ELO
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #1CB0F6, #A560E8)' }}
          >
            40 Modules
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}
          >
            100+ Lessons
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/auth/signup"
            className="w-full py-3 rounded-xl text-white font-semibold text-center transition-transform active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)' }}
          >
            Get Started Free
          </Link>
          <Link
            href="/auth/login"
            className="w-full py-3 rounded-xl text-gray-300 font-medium text-center bg-[#1A2C35] border border-white/10 hover:border-white/20 transition-colors"
          >
            I already have an account
          </Link>
        </div>
      </div>

      {/* Preview - Level indicators */}
      <div className="mt-12 flex gap-3 max-w-md w-full opacity-60">
        <div className="flex-1 rounded-xl bg-gradient-to-br from-[#58CC02] to-[#2FCBEF] p-3 text-center">
          <div className="text-white font-bold">Level 1</div>
          <div className="text-white/70 text-xs">400-800</div>
        </div>
        <div className="flex-1 rounded-xl bg-gradient-to-br from-[#1CB0F6] to-[#A560E8] p-3 text-center">
          <div className="text-white font-bold">Level 2</div>
          <div className="text-white/70 text-xs">800-1000</div>
        </div>
        <div className="flex-1 rounded-xl bg-gradient-to-br from-[#FF9600] to-[#FF6B6B] p-3 text-center">
          <div className="text-white font-bold">Level 3</div>
          <div className="text-white/70 text-xs">1000-1200</div>
        </div>
      </div>
    </div>
  );
}
