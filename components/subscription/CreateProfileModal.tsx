'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { SubscriptionEvents } from '@/lib/analytics/posthog';

export type SignupContext = 'lesson-limit' | 'level-test' | 'daily-rook' | 'daily-rook-results' | 'lesson-gate' | 'skip-quiz';

const CONTEXT_COPY: Record<SignupContext, { heading: string; subtext: string; analytics: string }> = {
  'lesson-limit': {
    heading: 'Nice work! Keep going?',
    subtext: 'Create an account to save your progress.',
    analytics: 'guest_limit',
  },
  'level-test': {
    heading: 'Ready to test your skills?',
    subtext: 'Sign in to take the level test and skip ahead.',
    analytics: 'level_test_gate',
  },
  'daily-rook': {
    heading: 'The Daily Rook awaits!',
    subtext: 'Sign in to play today\u2019s challenge and compete.',
    analytics: 'daily_rook_gate',
  },
  'daily-rook-results': {
    heading: 'How did you stack up?',
    subtext: 'Create an account to track your scores and streaks.',
    analytics: 'daily_rook_results',
  },
  'lesson-gate': {
    heading: 'Keep learning!',
    subtext: 'Create a free account to continue your chess journey.',
    analytics: 'lesson_gate',
  },
  'skip-quiz': {
    heading: 'Ready to skip ahead?',
    subtext: 'Sign in to take the skip quiz and advance faster.',
    analytics: 'skip_quiz_gate',
  },
};

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: SignupContext;
  lessonsCompleted?: number;
}

export function CreateProfileModal({ isOpen, onClose, context = 'lesson-limit', lessonsCompleted }: CreateProfileModalProps) {
  const router = useRouter();
  const copy = CONTEXT_COPY[context];

  useEffect(() => {
    if (isOpen) {
      SubscriptionEvents.paywallViewed(copy.analytics);
    }
  }, [isOpen, copy.analytics]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  const handlePremium = () => {
    router.push('/auth/signup?redirect=/pricing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <style>{`
        @keyframes cpm-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cpm-slide {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ animation: 'cpm-fade 0.3s ease-out' }}
        onClick={onClose}
      />

      {/* Card */}
      <div
        className="relative bg-white rounded-3xl max-w-sm w-full mx-4 shadow-2xl overflow-hidden"
        style={{ animation: 'cpm-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        <div className="px-6 pt-6 pb-5">
          {/* Static logo with color breathing */}
          <div className="flex justify-center mb-4">
            <AnimatedLogo iconOnly size={0.8} theme="light" autoPlay perpetual />
          </div>

          <h2 className="text-xl font-black text-chess-text text-center mb-1">
            {copy.heading}
          </h2>
          <p className="text-chess-text-muted text-sm text-center mb-5">
            {copy.subtext}
          </p>

          {/* Free tier */}
          <div className="bg-chess-page rounded-2xl p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-chess-text text-sm">Free Account</p>
                <p className="text-chess-text-faint text-xs">2 lessons per day</p>
              </div>
              <span className="text-chess-green font-black text-sm">$0</span>
            </div>
            <button
              onClick={handleSignUp}
              className="w-full py-3 rounded-xl font-bold text-white bg-chess-green active:translate-y-[2px] shadow-[0_3px_0_var(--color-chess-green-shadow)] transition-all text-sm"
            >
              Sign Up Free
            </button>
            <button
              onClick={handleSignUp}
              className="w-full mt-2 py-2.5 rounded-xl font-bold text-chess-text bg-white border border-slate-200 flex items-center justify-center gap-2 active:translate-y-[1px] transition-all text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google Sign In
            </button>
          </div>

          {/* Premium tier — Gold Gradient */}
          <div
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFECB3)' }}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-600 to-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg">
              BEST VALUE
            </div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-amber-600">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" fill="currentColor" />
                    <path d="M5 19a2 2 0 012-2h10a2 2 0 012 2v0a2 2 0 01-2 2H7a2 2 0 01-2-2v0z" fill="currentColor" />
                  </svg>
                  <p className="font-bold text-chess-text text-sm">Premium</p>
                </div>
                <p className="text-amber-700/60 text-xs mt-0.5">Unlimited lessons every day</p>
              </div>
              <div className="text-right">
                <span className="text-amber-700 font-black text-lg">$4.99</span>
                <span className="text-amber-700/50 text-xs">/mo</span>
              </div>
            </div>
            <button
              onClick={handlePremium}
              className="w-full py-3 rounded-xl font-bold text-white active:translate-y-[2px] transition-all text-sm"
              style={{
                background: 'linear-gradient(135deg, #D4A017, #B8860B)',
                boxShadow: '0 3px 0 #8B6508',
              }}
            >
              Start Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
