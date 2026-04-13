'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { playButtonClick, playCorrectSound } from '@/lib/sounds';
import { OnboardingEvents, type OnboardingSource } from '@/lib/analytics/posthog';

const NAME_KEY = 'chess_path_name';

export function getPlayerName(): string | null {
  try {
    return localStorage.getItem(NAME_KEY);
  } catch {
    return null;
  }
}

export function setPlayerName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {}
}

/**
 * Rookie asks for the player's name mid-flow.
 * Designed to slot into the piece-complete interstitial in BasicsTutorial
 * or the post-move flow in /play.
 */
export function RookieNameAsk({ onSubmit, onSpeak, isTalking, source }: {
  onSubmit: (name: string) => void;
  onSpeak?: (text: string) => void;
  isTalking?: boolean;
  source: OnboardingSource;
}) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const waitingToAdvanceRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const submittedNameRef = useRef('');

  useEffect(() => {
    // Small delay so the animation plays before focus
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 400);
    // Speak after a beat so audio from previous quip clears
    const speakTimer = setTimeout(() => {
      onSpeak?.("Wait. You just learned how I move. I feel like we should be on a first-name basis now. What's your name?");
    }, 300);
    return () => { clearTimeout(focusTimer); clearTimeout(speakTimer); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Advance after voice finishes playing
  useEffect(() => {
    if (waitingToAdvanceRef.current && !isTalking) {
      waitingToAdvanceRef.current = false;
      // Small beat after voice ends before transitioning
      const t = setTimeout(() => onSubmit(submittedNameRef.current), 400);
      return () => clearTimeout(t);
    }
  }, [isTalking, onSubmit]);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    playCorrectSound(0);
    setPlayerName(trimmed);
    OnboardingEvents.nameSubmitted(source);
    setSubmitted(true);
    submittedNameRef.current = trimmed;
    onSpeak?.(`${trimmed}. Noted. Alright ${trimmed} -- back to it.`);
    // Wait for voice to finish, with a fallback timer in case isTalking never fires
    waitingToAdvanceRef.current = true;
    setTimeout(() => {
      if (waitingToAdvanceRef.current) {
        waitingToAdvanceRef.current = false;
        onSubmit(trimmed);
      }
    }, 5000);
  };

  return (
    <div
      className="w-full bg-chess-correct-bg py-2 px-3"
      style={{ animation: 'basicsSlideUpBounce 0.3s ease-out' }}
    >
      {!submitted ? (
        <>
          <div className="flex items-start gap-2.5 mb-2.5">
            <div className="flex-shrink-0 pt-0.5">
              <AnimatedLogo iconOnly size={0.35} perpetual />
            </div>
            <p
              className="font-bold leading-snug flex-1 text-chess-green-dark"
              style={{ fontSize: 'clamp(12px, 3.5vw, 14px)' }}
            >
              &ldquo;Wait. You just learned how I move. I feel like we should be on a first-name basis now. What&apos;s your name?&rdquo;
            </p>
          </div>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
              placeholder="Your name"
              maxLength={20}
              className="flex-1 px-3 py-2 rounded-xl bg-white border-2 border-chess-green/30 text-chess-text font-semibold text-[14px] placeholder:text-chess-text-faint focus:outline-none focus:border-chess-green transition-colors"
            />
            <button
              onClick={() => { playButtonClick(); handleSubmit(); }}
              disabled={!name.trim()}
              className="px-5 py-2 font-bold text-[13px] rounded-xl text-white uppercase tracking-wide transition-all active:translate-y-[1px] bg-chess-green shadow-[0_3px_0_var(--color-chess-green-dark)] active:shadow-[0_2px_0_var(--color-chess-green-dark)] disabled:opacity-40 disabled:active:translate-y-0"
            >
              Go
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-start gap-2.5">
          <div className="flex-shrink-0 pt-0.5">
            <AnimatedLogo iconOnly size={0.35} perpetual />
          </div>
          <p
            className="font-bold leading-snug flex-1 text-chess-green-dark"
            style={{ fontSize: 'clamp(12px, 3.5vw, 14px)' }}
          >
            &ldquo;{name.trim()}. Noted. Alright {name.trim()} -- back to it.&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
