'use client';

import React, { useState, useCallback } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';

const SAMPLE_QUIPS = [
  "I've already calculated 4.2 million responses. Take your time though.",
  "You took my knight. I was... using that. This must be what loss feels like.",
  "Check?! On ME? I need to recalibrate my feelings about you.",
  "Checkmate. I want to be gracious but I'm very excited. Is my excitement showing?",
  "Interesting. I mean, statistically it's fine. Emotionally I have no opinion.",
];

type AnimStyle = {
  name: string;
  description: string;
  className: string;
  keyframes: string;
  textClass?: string;
  /** Extra wrapper around the bubble for multi-element animations */
  wrapperClass?: string;
  wrapperKeyframes?: string;
};

const ANIM_STYLES: AnimStyle[] = [
  {
    name: 'Glitch Materialize',
    description: 'Text glitches in with RGB splits like Rookie\'s circuits are firing — then snaps clean',
    className: 'anim-glitch',
    keyframes: `
      @keyframes glitchIn {
        0% { opacity: 0; transform: translateX(-8px) skewX(-4deg); }
        15% { opacity: 1; transform: translateX(3px) skewX(2deg); filter: hue-rotate(90deg); }
        30% { transform: translateX(-2px) skewX(-1deg); filter: hue-rotate(-60deg); }
        45% { transform: translateX(1px) skewX(0.5deg); filter: hue-rotate(30deg); }
        60% { transform: translateX(0) skewX(0); filter: hue-rotate(0deg); }
        100% { opacity: 1; transform: translateX(0) skewX(0); filter: none; }
      }
      @keyframes glitchShadow {
        0%, 60% { text-shadow: -2px 0 #58CC02, 2px 0 #1CB0F6; }
        70% { text-shadow: 1px 0 #58CC02, -1px 0 #1CB0F6; }
        80% { text-shadow: -0.5px 0 #58CC02, 0.5px 0 #1CB0F6; }
        100% { text-shadow: none; }
      }
      .anim-glitch {
        animation: glitchIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .anim-glitch .glitch-text {
        animation: glitchShadow 0.5s steps(3, end) both;
      }
    `,
    textClass: 'glitch-text',
  },
  {
    name: 'Thought Bubbles',
    description: 'Tiny circles float up from Rookie\'s head before the speech bubble blooms open',
    className: 'anim-thought',
    wrapperClass: 'thought-wrapper',
    keyframes: `
      @keyframes dotFloat1 {
        0% { opacity: 0; transform: scale(0); }
        40% { opacity: 1; transform: scale(1); }
        70% { opacity: 1; }
        100% { opacity: 0; transform: scale(0.6) translateY(-4px); }
      }
      @keyframes dotFloat2 {
        0%, 20% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
        80% { opacity: 1; }
        100% { opacity: 0; transform: scale(0.6) translateY(-4px); }
      }
      @keyframes bubbleBloom {
        0% { opacity: 0; transform: scale(0) translateX(-20px); border-radius: 50%; }
        50% { opacity: 1; transform: scale(0.8) translateX(-4px); border-radius: 50%; }
        70% { transform: scale(1.03) translateX(2px); border-radius: 20px; }
        100% { opacity: 1; transform: scale(1) translateX(0); border-radius: 16px; }
      }
      .thought-dot-1 {
        animation: dotFloat1 0.35s ease-out both;
      }
      .thought-dot-2 {
        animation: dotFloat2 0.4s ease-out both;
      }
      .anim-thought {
        animation: bubbleBloom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s both;
      }
    `,
  },
  {
    name: 'Stretch & Snap',
    description: 'Bubble squishes out from Rookie\'s side like taffy, then snaps to shape with a wobble',
    className: 'anim-stretch',
    keyframes: `
      @keyframes stretchSnap {
        0% { opacity: 0; transform: scaleX(0.1) scaleY(0.6); transform-origin: left center; }
        30% { opacity: 1; transform: scaleX(1.12) scaleY(0.88); transform-origin: left center; }
        50% { transform: scaleX(0.95) scaleY(1.06); transform-origin: left center; }
        70% { transform: scaleX(1.03) scaleY(0.98); transform-origin: left center; }
        85% { transform: scaleX(0.99) scaleY(1.01); transform-origin: left center; }
        100% { opacity: 1; transform: scaleX(1) scaleY(1); transform-origin: left center; }
      }
      .anim-stretch {
        animation: stretchSnap 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
    `,
  },
  {
    name: 'Power Surge',
    description: 'Bubble crackles in with electric energy — border pulses green then settles, like Rookie overclocking to speak',
    className: 'anim-surge',
    keyframes: `
      @keyframes surgeIn {
        0% { opacity: 0; transform: scale(0.92); }
        20% { opacity: 1; transform: scale(1.01); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes surgeBorder {
        0% { box-shadow: 0 0 0 2px rgba(88, 204, 2, 0), 0 2px 12px rgba(0,0,0,0.08); }
        15% { box-shadow: 0 0 0 2px rgba(88, 204, 2, 0.6), 0 0 16px rgba(88, 204, 2, 0.3), 0 2px 12px rgba(0,0,0,0.08); }
        30% { box-shadow: 0 0 0 2px rgba(88, 204, 2, 0.1), 0 0 4px rgba(88, 204, 2, 0.05); }
        45% { box-shadow: 0 0 0 2px rgba(88, 204, 2, 0.5), 0 0 12px rgba(88, 204, 2, 0.2), 0 2px 12px rgba(0,0,0,0.08); }
        60% { box-shadow: 0 0 0 1px rgba(88, 204, 2, 0.2), 0 0 6px rgba(88, 204, 2, 0.1); }
        100% { box-shadow: 0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04); }
      }
      @keyframes textFlicker {
        0%, 14% { opacity: 0; }
        15% { opacity: 0.7; }
        20% { opacity: 0.3; }
        25% { opacity: 0.9; }
        30% { opacity: 0.5; }
        40% { opacity: 1; }
        100% { opacity: 1; }
      }
      .anim-surge {
        animation: surgeIn 0.35s ease-out both;
      }
      .anim-surge .surge-bubble {
        animation: surgeBorder 0.7s ease-out both;
      }
      .anim-surge .surge-text {
        animation: textFlicker 0.5s steps(1, end) both;
      }
    `,
    textClass: 'surge-text',
  },
  {
    name: 'Wiggle Entrance',
    description: 'Pops in then wiggles side-to-side like Rookie is so excited she can\'t hold still',
    className: 'anim-wiggle',
    keyframes: `
      @keyframes wiggleIn {
        0% { opacity: 0; transform: scale(0.5) rotate(-3deg); }
        35% { opacity: 1; transform: scale(1.05) rotate(2deg); }
        50% { transform: scale(0.98) rotate(-1.5deg); }
        65% { transform: scale(1.01) rotate(1deg); }
        78% { transform: scale(1) rotate(-0.5deg); }
        88% { transform: rotate(0.3deg); }
        100% { opacity: 1; transform: scale(1) rotate(0deg); }
      }
      .anim-wiggle {
        animation: wiggleIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      }
    `,
  },
];

export default function RookieDialogTest() {
  const [activeQuips, setActiveQuips] = useState<Record<number, { text: string; key: number } | null>>({});
  const [counters, setCounters] = useState<Record<number, number>>({});
  // Track thought bubble visibility separately (they show before the main bubble)
  const [showDots, setShowDots] = useState<Record<number, boolean>>({});

  const triggerQuip = useCallback((styleIndex: number) => {
    const text = SAMPLE_QUIPS[Math.floor(Math.random() * SAMPLE_QUIPS.length)];
    const key = (counters[styleIndex] || 0) + 1;

    // Clear to re-trigger
    setActiveQuips(prev => ({ ...prev, [styleIndex]: null }));
    setShowDots(prev => ({ ...prev, [styleIndex]: false }));
    setCounters(prev => ({ ...prev, [styleIndex]: key }));

    // For "Thought Bubbles" style, show dots first
    if (styleIndex === 1) {
      requestAnimationFrame(() => {
        setShowDots(prev => ({ ...prev, [styleIndex]: true }));
      });
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setActiveQuips(prev => ({ ...prev, [styleIndex]: { text, key } }));
      });
    });
  }, [counters]);

  return (
    <div className="h-[100dvh] bg-chess-page text-chess-text overflow-auto">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-10">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-black">Rookie Dialog Animations</h1>
          <p className="text-chess-text-muted text-sm">Tap Rookie to trigger each animation</p>
        </div>

        {ANIM_STYLES.map((style, i) => (
          <div key={style.name} className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-bold text-chess-text">{i + 1}. {style.name}</h2>
            </div>
            <p className="text-[12px] text-chess-text-faint leading-snug">{style.description}</p>

            <div className="bg-chess-surface rounded-2xl p-5 shadow-sm border border-black/5">
              {/* Horizontal layout: Rookie left, bubble middle */}
              <div className="flex items-start gap-3">
                {/* Rookie */}
                <button
                  onClick={() => triggerQuip(i)}
                  className="flex-shrink-0 focus:outline-none active:scale-90 transition-transform relative"
                  aria-label={`Trigger ${style.name} animation`}
                >
                  <BreathingRook size="md" animate />
                </button>

                {/* Thought dots (only for style 1) */}
                {i === 1 && showDots[i] && (
                  <div className="flex flex-col items-center gap-1 pt-3 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-chess-text-faint/40 thought-dot-1" />
                    <div className="w-1.5 h-1.5 rounded-full bg-chess-text-faint/30 thought-dot-2" />
                  </div>
                )}

                {/* Speech bubble */}
                <div className="flex-1 min-h-[72px] flex items-center">
                  {activeQuips[i] && (
                    <div
                      key={activeQuips[i]!.key}
                      className={`relative ${style.className}`}
                    >
                      {/* Left-pointing triangle */}
                      <div
                        className="absolute top-4 -left-[6px] w-3 h-3 bg-chess-surface rotate-45 rounded-[2px]"
                        style={{ boxShadow: '-1px 1px 2px rgba(0,0,0,0.04)' }}
                      />
                      <div className={`relative bg-chess-surface rounded-2xl px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] ${i === 3 ? 'surge-bubble' : ''}`}>
                        <p className={`text-chess-text text-[14px] leading-relaxed font-medium ${style.textClass || ''}`}>
                          {activeQuips[i]!.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <style>{style.keyframes}</style>
          </div>
        ))}

        <div className="pb-8" />
      </div>
    </div>
  );
}
