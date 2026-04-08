'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { ActionButton } from '@/components/ui/ActionButton';
import { useRookieVoice } from '@/hooks/useRookieVoice';
import posthogLib from 'posthog-js';
import { OnboardingEvents } from '@/lib/analytics/posthog';
import { playButtonClick, warmupAudio, getSharedAudioContext } from '@/lib/sounds';

// ─── Rookie's quips — cycles through on idle ───
const ROOKIE_QUIPS = [
  // ── Welcome / intro ──
  "I teach chess. You learn chess. We both pretend I'm not a computer. It's a whole thing.",
  "Welcome to Chess Path. I'll be your guide. I only know chess but I know it really well.",
  "You're new here? Perfect. I was built for this. Literally. It's the only thing I do.",
  "Hi. I'm Rookie. I teach beginners how to play chess. No experience needed. I have enough for both of us.",
  // ── What this is ──
  "This is the fun way to learn chess. Not the boring way. I checked. The boring way already exists.",
  "Chess looks complicated. It's not. I'll prove it. Give me five minutes.",
  "Most chess apps assume you already know chess. I assume you don't. And I think that's beautiful.",
  "Learn the moves. Play some games. Beat your friends. That's the plan. My plan. For you.",
  // ── Nudge to pick a button ──
  "Want to play a game or learn the basics? Either way I'm here. I'm always here.",
  "Two buttons. Big decision. Not really. Both are good. I made them both.",
  "Hit Play if you're feeling brave. Hit Learn if you want to know what the pieces do first.",
  "You can play me or you can learn first. Fair warning: I go easy on beginners. Very easy.",
  // ── Personality / charm ──
  "I'm a rook, by the way. I only move in straight lines. My personality is less predictable.",
  "I promise chess is fun. And if it's not, you can blame me. I can take it.",
  "Five minutes. That's all I need. You'll know how every piece moves and you'll want to play again.",
  "I've taught thousands of people chess. Some of them even came back. On purpose.",
  // ── Idle / waiting ──
  "Still deciding? No rush. I'll just be here. Existing. Waiting. It's what I do best.",
  "Take your time. I've been waiting since you opened the app. Which was not long ago. But still.",
  "I don't have anywhere else to be. Pick whenever you're ready.",
  "Oh good, you're still here. I was worried you left. I can't check. I don't have eyes.",
];

// ─── Synthesized power-on chime ───
function playPowerOnSound() {
  const ctx = getSharedAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime;
  const notes = [330, 415, 523, 659];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const start = t + i * 0.12;
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.08, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.4);
  });
  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = 'sine';
  sub.frequency.value = 82;
  subGain.gain.setValueAtTime(0.001, t);
  subGain.gain.linearRampToValueAtTime(0.06, t + 0.1);
  subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
  sub.connect(subGain).connect(ctx.destination);
  sub.start(t);
  sub.stop(t + 0.8);
}

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

  return { displayed, done, fading, text, quipIndex };
}


export function OnboardingFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [learnExpanded, setLearnExpanded] = useState(false);
  const powerOnPlayedRef = useRef(false);
  const lastSpokenIndexRef = useRef(-1);

  // ElevenLabs voice — real audio drives Rookie's talk intensity
  const { speakQuip, talkIntensity, isTalking } = useRookieVoice(audioUnlocked);

  const { displayed: typedQuip, done: typingDone, fading, text: currentQuipText, quipIndex } = useTypewriter(
    ROOKIE_QUIPS, 1800, 10000, 28,
  );

  // Speak each quip via ElevenLabs when typing finishes
  useEffect(() => {
    if (!typingDone || !audioUnlocked) return;
    if (lastSpokenIndexRef.current === quipIndex) return;
    lastSpokenIndexRef.current = quipIndex;
    speakQuip(currentQuipText);
  }, [typingDone, audioUnlocked, quipIndex, currentQuipText, speakQuip]);

  // Orchestrated entrance
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2800),
      setTimeout(() => setPhase(5), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Power-on sound
  useEffect(() => {
    if (audioUnlocked && phase >= 2 && !powerOnPlayedRef.current) {
      powerOnPlayedRef.current = true;
      playPowerOnSound();
    }
  }, [audioUnlocked, phase]);

  const handleFirstInteraction = useCallback(() => {
    if (!audioUnlocked) {
      // warmupAudio must run synchronously inside the gesture to unlock AudioContext
      warmupAudio();
      setAudioUnlocked(true);
      // Speak current quip immediately — small delay lets ctx.resume() settle
      if (typingDone && currentQuipText) {
        setTimeout(() => speakQuip(currentQuipText), 50);
      }
    }
  }, [audioUnlocked, typingDone, currentQuipText, speakQuip]);

  // PostHog
  useEffect(() => {
    let cancelled = false;
    const tryFire = () => {
      if (cancelled) return;
      if (posthogLib.__loaded) { OnboardingEvents.started(); }
      else { setTimeout(tryFire, 200); }
    };
    tryFire();
    return () => { cancelled = true; };
  }, []);

  const markOnboarded = useCallback(() => {
    try { localStorage.setItem('chess_path_onboarded', 'true'); } catch {}
  }, []);

  const handleRoute = useCallback((id: 'play' | 'learn', route: string) => {
    OnboardingEvents.routeSelected(id);
    markOnboarded();
    OnboardingEvents.completed({ level: id });
    router.push(route);
  }, [markOnboarded, router]);

  return (
    <div
      className="h-[100dvh] flex flex-col bg-chess-page overflow-hidden relative"
      onPointerDown={handleFirstInteraction}
    >
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
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
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
            animate={phase >= 4 && !isTalking}
            mood={hoveredBtn === 'play' ? 'excited' : hoveredBtn === 'learn' ? 'happy' : 'neutral'}
            talkIntensity={isTalking ? talkIntensity : undefined}
          />
        </div>

        <div
          className="mt-3"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(6px)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span
            className="text-chess-text font-black tracking-tight"
            style={{ fontSize: 'clamp(20px, 5vw, 28px)' }}
          >
            I&apos;m Rookie.
          </span>
        </div>
      </div>

      {/* Speech bubble with typewriter — fixed height so layout doesn't shift */}
      <div
        className="px-6 max-w-sm mx-auto w-full mt-4"
        style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          height: 100,
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
              {typedQuip}
              {!typingDone && (
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
      <div className="px-6 max-w-sm mx-auto w-full space-y-2.5">
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
            <span className="block mt-0.5 font-medium" style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', opacity: 0.7 }}>
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
              <span className="block mt-0.5 font-medium" style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', opacity: 0.7 }}>
                Show me which way the horsey goes
              </span>
            </ActionButton>
          ) : (
            <div className="space-y-2">
              <ActionButton
                color="blue"
                size="md"
                fullWidth
                onClick={() => handleRoute('learn', '/basics')}
              >
                <span className="font-black block" style={{ fontSize: 'clamp(16px, 4.5vw, 20px)' }}>
                  Basics
                </span>
                <span className="block mt-0.5 font-medium" style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', opacity: 0.7 }}>
                  How the pieces move
                </span>
              </ActionButton>
              <ActionButton
                color="purple"
                size="md"
                fullWidth
                onClick={() => handleRoute('learn', '/lesson/1-1-1')}
              >
                <span className="font-black block" style={{ fontSize: 'clamp(16px, 4.5vw, 20px)' }}>
                  Checkmate
                </span>
                <span className="block mt-0.5 font-medium" style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', opacity: 0.7 }}>
                  I know the basics — let me win
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
