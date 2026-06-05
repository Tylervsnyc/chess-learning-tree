'use client';

import type { ReactNode } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { ActionButton } from '@/components/ui/ActionButton';

// Day-2 value-led copy. Default fallback when the Day-3 ad-hook copy is off.
const DEFAULT_HEADLINE = (
  <>Learn chess in<br />5 minutes. Free.</>
);
const DEFAULT_SUBHEAD = 'No account needed. Just start.';

/**
 * Cold-traffic landing (CHE-359, Day 2). Value headline + one dominant CTA,
 * basics demoted to a link. Shown only to the IG cohort behind
 * IG_SPRINT_FLAGS.IG_LANDING_VALUE_CTA (see OnboardingFlow). Presentational —
 * the parent wires what each action does so this stays testable in isolation.
 *
 * Day 3 (IG_LANDING_COPY): the parent passes `headline`/`subhead` to echo the
 * paid ad hook; omit them to keep the Day-2 value copy.
 *
 * Mobile-first, centered + capped, ≥44px tap targets (RULES.md §50).
 */
export function ColdLanding({
  onPlay,
  onBasics,
  onSignIn,
  headline = DEFAULT_HEADLINE,
  subhead = DEFAULT_SUBHEAD,
  ctaLabel = 'Start playing',
}: {
  onPlay: () => void;
  onBasics: () => void;
  onSignIn: () => void;
  headline?: ReactNode;
  subhead?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="h-[100dvh] flex flex-col bg-chess-page overflow-hidden relative">
      {/* Logo */}
      <div className="pt-5 pl-5">
        <AnimatedLogo size={0.28} perpetual theme="light" />
      </div>

      {/* Hero: Rookie + value headline */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-sm md:max-w-md mx-auto w-full">
        <BreathingRook size="lg" animate mood="happy" />
        <h1
          className="mt-6 font-black text-chess-text leading-[1.05]"
          style={{ fontSize: 'clamp(28px, 8.5vw, 40px)' }}
        >
          {headline}
        </h1>
        <p
          className="mt-3 text-chess-text-muted font-semibold"
          style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}
        >
          {subhead}
        </p>
      </div>

      {/* Dominant CTA + demoted basics link */}
      <div className="px-6 max-w-sm md:max-w-md mx-auto w-full space-y-1">
        <ActionButton color="green" size="lg" fullWidth onClick={onPlay}>
          <span className="font-black block" style={{ fontSize: 'clamp(19px, 5.2vw, 23px)' }}>
            {ctaLabel}
          </span>
        </ActionButton>
        <button
          onClick={onBasics}
          className="block w-full text-center font-semibold text-chess-text-muted hover:text-chess-text transition-colors min-h-[44px]"
          style={{ fontSize: 'clamp(13px, 3.4vw, 15px)' }}
        >
          Just want the basics? &rarr;
        </button>
      </div>

      {/* Sign in */}
      <div className="text-center pb-6 pt-1">
        <button
          onClick={onSignIn}
          className="text-[13px] font-semibold text-chess-text-muted hover:text-chess-text transition-colors min-h-[44px] px-4"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}
