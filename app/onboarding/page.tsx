'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useOnboarding } from '@/hooks/useOnboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { reset } = useOnboarding();

  // Reset onboarding state when starting fresh
  useEffect(() => {
    reset();
  }, [reset]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="text-5xl mb-4">♟️</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome to The Chess Path
          </h1>
          <p className="text-gray-400">
            How would you like to get started?
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* Manual Selection Option */}
          <button
            onClick={() => router.push('/onboarding/select-level')}
            className="w-full p-5 rounded-xl bg-[#1A2C35] border border-white/10 hover:border-white/30 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#58CC02] to-[#2FCBEF] flex items-center justify-center text-2xl">
                🎯
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg group-hover:text-[#58CC02] transition-colors">
                  I know my level
                </h3>
                <p className="text-gray-400 text-sm">
                  Choose your skill level and start learning
                </p>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </button>

          {/* Diagnostic Quiz Option */}
          <button
            onClick={() => router.push('/onboarding/diagnostic')}
            className="w-full p-5 rounded-xl bg-[#1A2C35] border border-white/10 hover:border-white/30 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1CB0F6] to-[#A560E8] flex items-center justify-center text-2xl">
                🧩
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg group-hover:text-[#1CB0F6] transition-colors">
                  Find my level
                </h3>
                <p className="text-gray-400 text-sm">
                  Take a short quiz to determine your starting point
                </p>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Skip option */}
        <button
          onClick={() => router.push('/learn')}
          className="mt-8 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
