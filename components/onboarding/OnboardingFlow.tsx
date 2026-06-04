'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { ActionButton } from '@/components/ui/ActionButton';
import { OnboardingEvents } from '@/lib/analytics/posthog';
import { playButtonClick } from '@/lib/sounds';
import { isIgCohort } from '@/lib/growth/ig-cohort';
import { IG_SPRINT_FLAGS } from '@/lib/config/feature-flags';
import { useBubblePopGame } from './BubblePopGame';
import { ColdLanding } from './ColdLanding';

// ─── Rookie's quips — cycles through on idle ───
const ROOKIE_QUIPS = [
  // ── Hook — lead with fun ──
  "Chess is fun. I'll prove it.",
  "Most chess apps are boring. I'm not most chess apps.",
  "You're new here? Perfect. This is the fun way to learn chess. The boring way already exists.",
  // ── Personality ──
  "I teach chess. You learn chess. We both pretend I'm not a computer. It's a whole thing.",
  "I'm a rook, by the way. I only move in straight lines. My personality is less predictable.",
  "If chess isn't fun, you can blame me. I can take it.",
  // ── Nudge to pick a button ──
  "Want to play a game or learn the basics? Either way I'm here. I'm always here.",
  "Two buttons. Big decision. Not really. Both are good. I made them both.",
  "Hit Play if you're feeling brave. Hit Learn if you want to know what the pieces do first.",
  // ── Idle / waiting ──
  "Still deciding? No rush. I'll just be here. Existing. Waiting. It's what I do best.",
  "Take your time. I've been waiting since you opened the app. Which was not long ago. But still.",
  "Oh good, you're still here. I was worried you left. I can't check. I don't have eyes.",
];

// ─── Typewriter hook with quip cycling ───
function useTypewriter(quips: string[], startDelay: number, idleInterval: number, speed = 28) {
  const [quipIndex, setQuipIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [fading, setFading] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const text = quips[quipIndex];

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    let timeout: NodeJS.Timeout;

    const startTimeout = setTimeout(() => {
      const type = () => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
          const char = text[i - 1];
          const delay = char === '.' || char === '!' || char === '?' ? speed * 6
            : char === ',' ? speed * 3
            : speed;
          timeout = setTimeout(type, delay);
        } else {
          setDone(true);
        }
      };
      type();
    }, quipIndex === 0 ? startDelay : 300);

    return () => { clearTimeout(startTimeout); clearTimeout(timeout); };
  }, [text, startDelay, speed, quipIndex]);

  // Cycle on idle
  useEffect(() => {
    if (!done) return;
    idleTimerRef.current = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setDisplayed('');
        setQuipIndex((prev) => (prev + 1) % quips.length);
        setFading(false);
      }, 300);
    }, idleInterval);
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [done, quips.length, idleInterval]);

  return { displayed, done, fading };
}


export function OnboardingFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [learnExpanded, setLearnExpanded] = useState(false);
  // Day-2 cold-traffic landing (CHE-359). Client-only — false on SSR/first paint
  // (matches the default flow, no hydration mismatch), flips on after mount for
  // the IG cohort. Existing users never enter this branch.
  const [coldVariant, setColdVariant] = useState(false);

  const { displayed: typedQuip, done: typingDone, fading } = useTypewriter(
    ROOKIE_QUIPS, 800, 30000, 28,
  );

  // Bubble-pop mini-game — activates after entrance finishes
  const { poppedAt, popQuip, teaseBlock, onBlockTap, start: startBubblePop } = useBubblePopGame();

  // Orchestrated entrance: Rookie first, then buttons, then logo
  // 1=Rookie appears, 2=powerOn anim, 3=speech bubble, 4=buttons, 5=logo+sign in
  //
  // Day 1 of the IG sprint (CHE-359): cold ad traffic bounces 94% on this
  // screen, and the staged reveal hides the CTAs until 1000ms. For the IG
  // cohort only, jump straight to fully-visible so the buttons are instant.
  useEffect(() => {
    // Day 2: value-led cold landing. Render our own screen and jump to phase 5
    // so the phase>=4 effect still fires `onboarding_started` (the funnel's
    // landing->started step) for this variant too.
    if (IG_SPRINT_FLAGS.IG_LANDING_VALUE_CTA && isIgCohort()) {
      setColdVariant(true);
      setPhase(5);
      return;
    }
    if (IG_SPRINT_FLAGS.IG_LANDING_FASTPATH && isIgCohort()) {
      setPhase(5);
      return;
    }
    const timers = [
      setTimeout(() => setPhase(1), 50),
      setTimeout(() => setPhase(2), 150),
      setTimeout(() => setPhase(3), 400),
      setTimeout(() => setPhase(4), 1000),
      setTimeout(() => setPhase(5), 1300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Start bubble-pop game after everything has loaded
  useEffect(() => {
    if (phase >= 5) startBubblePop();
  }, [phase, startBubblePop]);

  // PostHog — fire onboarding_started once CTAs are visible (phase 4).
  // Firing on page load counted every bounce as a start and made the funnel unreadable.
  const startedFiredRef = useRef(false);
  useEffect(() => {
    if (phase < 4 || startedFiredRef.current) return;
    startedFiredRef.current = true;
    let cancelled = false;
    const tryFire = async () => {
      if (cancelled) return;
      try {
        const posthog = (await import('posthog-js')).default;
        if (cancelled) return;
        if (posthog.__loaded) { OnboardingEvents.started(); }
        else { setTimeout(tryFire, 200); }
      } catch {
        if (!cancelled) setTimeout(tryFire, 200);
      }
    };
    tryFire();
    return () => { cancelled = true; };
  }, [phase]);

  const markOnboarded = useCallback(() => {
    try { localStorage.setItem('chess_path_onboarded', 'true'); } catch {}
  }, []);

  const handleRoute = useCallback((id: 'play' | 'learn', route: string) => {
    playButtonClick();
    OnboardingEvents.routeSelected(id);
    markOnboarded();
    OnboardingEvents.completed({ level: id });
    router.push(route);
  }, [markOnboarded, router]);

  // ─── Day-2 cold-traffic landing (CHE-359) — value headline + one dominant CTA ───
  if (coldVariant) {
    return (
      <ColdLanding
        onPlay={() => handleRoute('play', '/play')}
        onBasics={() => handleRoute('learn', '/basics')}
        onSignIn={() => { playButtonClick(); router.push('/auth/login'); }}
      />
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-chess-page overflow-hidden relative">
      <style>{`
@keyframes onb-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes onb-pulse-ring {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

{/* Logo */}
      <div
        className="pt-5 pl-5"
        style={{
          opacity: phase >= 5 ? 1 : 0,
          transform: phase >= 5 ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <AnimatedLogo size={0.28} perpetual theme="light" />
      </div>

      <div className="flex-1" />

      {/* Rookie entrance */}
      <div
        className="flex flex-col items-center"
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'scale(1)' : 'scale(0.7)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="relative">
          {phase >= 2 && phase < 4 && (
            <div
              className="absolute -inset-6 rounded-full"
              style={{
                background: 'radial-gradient(circle, var(--color-chess-green) 0%, transparent 70%)',
                opacity: 0.12,
                animation: 'onb-pulse-ring 2s ease-out 0.3s',
                animationFillMode: 'forwards',
              }}
            />
          )}
          <BreathingRook
            size="xl"
            animation={phase >= 2 && phase < 4 ? 'powerOn' : undefined}
            animate={phase >= 4}
            mood={hoveredBtn === 'play' ? 'excited' : hoveredBtn === 'learn' ? 'happy' : 'neutral'}
            onBlockTap={onBlockTap}
            poppedAt={poppedAt}
            teaseBlock={teaseBlock}
          />
        </div>

      </div>

      {/* Speech bubble with typewriter — fixed height so layout doesn't shift */}
      <div
        className="px-4 md:px-6 max-w-sm md:max-w-md mx-auto w-full mt-4"
        style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          height: 90,
        }}
      >
        <div className="relative h-full">
          <div
            className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 rounded-[2px]"
            style={{ boxShadow: '-1px -1px 2px rgba(0,0,0,0.03)' }}
          />
          <div className="relative bg-white rounded-2xl px-5 py-3.5 h-full flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)]">
            <p
              className="text-chess-text text-center font-medium leading-relaxed"
              style={{
                fontSize: 'clamp(13px, 3.5vw, 15px)',
                opacity: fading ? 0 : 1,
                transition: 'opacity 0.3s ease-out',
              }}
            >
              <span className="font-black block" style={{ fontSize: 'clamp(15px, 4vw, 17px)' }}>I&apos;m Rookie.</span>{popQuip || typedQuip}
              {!popQuip && !typingDone && (
                <span
                  className="inline-block w-[2px] h-[1em] bg-chess-text ml-0.5 align-text-bottom"
                  style={{ animation: 'onb-cursor-blink 0.8s step-end infinite' }}
                />
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-[0.8]" />

      {/* Play / Learn */}
      <div className="px-4 md:px-6 max-w-sm md:max-w-md mx-auto w-full space-y-2.5">
        <div
          onPointerEnter={() => setHoveredBtn('play')}
          onPointerLeave={() => setHoveredBtn(null)}
          style={{
            opacity: phase >= 4 ? 1 : 0,
            transform: phase >= 4 ? 'translateY(0)' : 'translateY(28px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <ActionButton
            color="green"
            size="md"
            fullWidth
            onClick={() => handleRoute('play', '/play')}
          >
            <span className="font-black block" style={{ fontSize: 'clamp(18px, 5vw, 22px)' }}>
              Play
            </span>
            <span className="block mt-0.5 font-semibold" style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', opacity: 0.85 }}>
              I&apos;ll go easy. Probably.
            </span>
          </ActionButton>
        </div>

        <div
          onPointerEnter={() => setHoveredBtn('learn')}
          onPointerLeave={() => setHoveredBtn(null)}
          style={{
            opacity: phase >= 4 ? 1 : 0,
            transform: phase >= 4 ? 'translateY(0)' : 'translateY(28px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 80ms',
          }}
        >
          {!learnExpanded ? (
            <ActionButton
              color="blue"
              size="md"
              fullWidth
              onClick={() => { playButtonClick(); setLearnExpanded(true); }}
            >
              <span className="font-black block" style={{ fontSize: 'clamp(18px, 5vw, 22px)' }}>
                Learn
              </span>
              <span className="block mt-0.5 font-semibold" style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', opacity: 0.85 }}>
                Show me which way the horsey goes
              </span>
            </ActionButton>
          ) : (
            <div className="flex gap-2.5">
              <ActionButton
                color="blue"
                size="md"
                fullWidth
                onClick={() => handleRoute('learn', '/basics')}
              >
                <span className="font-black block" style={{ fontSize: 'clamp(14px, 4vw, 17px)' }}>
                  Basics
                </span>
                <span className="block mt-0.5 font-semibold" style={{ fontSize: 'clamp(12px, 2.8vw, 13px)', opacity: 0.85 }}>
                  How pieces move
                </span>
              </ActionButton>
              <ActionButton
                color="purple"
                size="md"
                fullWidth
                onClick={() => handleRoute('learn', '/lesson/1.1.1?from=onboarding')}
              >
                <span className="font-black block" style={{ fontSize: 'clamp(14px, 4vw, 17px)' }}>
                  Checkmate
                </span>
                <span className="block mt-0.5 font-semibold" style={{ fontSize: 'clamp(12px, 2.8vw, 13px)', opacity: 0.85 }}>
                  I know the basics
                </span>
              </ActionButton>
            </div>
          )}
        </div>
      </div>

      <div className="flex-[0.6]" />

      {/* Sign in */}
      <div
        className="text-center pb-6"
        style={{ opacity: phase >= 5 ? 1 : 0, transition: 'opacity 0.5s ease-out' }}
      >
        <button
          onClick={() => { playButtonClick(); router.push('/auth/login'); }}
          className="text-[13px] font-semibold text-chess-text-muted hover:text-chess-text transition-colors py-2 px-4"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}
