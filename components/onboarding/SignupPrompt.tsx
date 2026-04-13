'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { ActionButton } from '@/components/ui/ActionButton';
import { playButtonClick } from '@/lib/sounds';
import { OnboardingEvents, type OnboardingSource } from '@/lib/analytics/posthog';

const ROOKIE_LINES = [
  "I saved your spot. Sign up so I don't forget.",
  "You're pretty good at this. Create an account and I'll remember everything.",
  "That was fun. Sign up and we can keep going.",
  "I have a terrible memory. Sign up so your progress sticks around.",
];

function pickLine() {
  return ROOKIE_LINES[Math.floor(Math.random() * ROOKIE_LINES.length)];
}

/**
 * Soft, dismissible signup prompt shown after completing a tutorial or game.
 * Modal card over backdrop. User can skip.
 */
export function SignupPrompt({ onDismiss, source }: { onDismiss: () => void; source: OnboardingSource }) {
  const router = useRouter();
  const [line] = useState(pickLine);

  useEffect(() => {
    OnboardingEvents.signupPromptShown(source);
  }, [source]);

  const dismiss = (method: 'x' | 'backdrop' | 'maybe_later') => {
    OnboardingEvents.signupPromptDismissed(source, method);
    playButtonClick();
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <style>{`
        @keyframes sp-backdrop { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sp-card {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ animation: 'sp-backdrop 0.3s ease-out' }}
        onClick={() => dismiss('backdrop')}
      />

      {/* Card */}
      <div
        className="relative bg-chess-page rounded-3xl max-w-sm w-full mx-4 shadow-2xl overflow-hidden"
        style={{ animation: 'sp-card 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        {/* Close button */}
        <button
          onClick={() => dismiss('x')}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4 text-chess-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center px-6 pt-8 pb-6">
          <BreathingRook size="lg" animate mood="happy" />

          <div className="mt-4 mb-6 w-full">
            <div className="relative">
              <div
                className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 rounded-[2px]"
                style={{ boxShadow: '-1px -1px 2px rgba(0,0,0,0.03)' }}
              />
              <div className="relative bg-white rounded-2xl px-5 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)]">
                <p
                  className="text-chess-text text-center font-medium leading-relaxed"
                  style={{ fontSize: 'clamp(13px, 3.5vw, 15px)' }}
                >
                  {line}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full space-y-2.5">
            <ActionButton
              color="green"
              size="md"
              fullWidth
              onClick={() => {
                OnboardingEvents.signupPromptClicked(source, 'signup');
                playButtonClick();
                router.push('/auth/signup');
              }}
            >
              <span className="font-black block" style={{ fontSize: 'clamp(16px, 4.5vw, 20px)' }}>
                Sign Up Free
              </span>
            </ActionButton>

            <ActionButton
              color="white"
              size="md"
              fullWidth
              onClick={() => {
                OnboardingEvents.signupPromptClicked(source, 'login');
                playButtonClick();
                router.push('/auth/login');
              }}
            >
              <span className="font-bold block text-chess-text" style={{ fontSize: 'clamp(13px, 3.5vw, 15px)' }}>
                I already have an account
              </span>
            </ActionButton>
          </div>

          <button
            onClick={() => dismiss('maybe_later')}
            className="mt-4 text-[13px] font-semibold text-chess-text-muted hover:text-chess-text transition-colors py-2 px-4"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
