'use client';

import { useState } from 'react';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { BreathingRook, type RookieMood } from '@/components/ui/BreathingRook';
import { ActionButton } from '@/components/ui/ActionButton';
import { RookieBubble } from '@/components/ui/RookieBubble';

const MOODS: RookieMood[] = [
  'neutral', 'happy', 'nervous', 'angry', 'smug', 'surprised',
  'embarrassed', 'excited', 'defeated', 'scheming', 'panicking', 'zen',
  'feral', 'heartbroken', 'shadow', 'proud', 'suspicious', 'mischievous',
  'sleepy', 'starstruck', 'confused', 'stubborn', 'grateful', 'royal',
];

export default function RookieDesignPage() {
  const [activeMood, setActiveMood] = useState<RookieMood>('neutral');

  return (
    <div className="min-h-screen bg-chess-page overflow-auto p-6 space-y-10">
      {/* AnimatedLogo — dark bg */}
      <section>
        <h2 className="text-sm font-bold text-chess-text-muted uppercase tracking-wide mb-4">
          Animated Logo — Dark Background
        </h2>
        <div className="bg-gray-900 rounded-2xl p-8 flex items-center justify-center">
          <AnimatedLogo theme="dark" size="md" perpetual autoPlay />
        </div>
      </section>

      {/* AnimatedLogo — light bg */}
      <section>
        <h2 className="text-sm font-bold text-chess-text-muted uppercase tracking-wide mb-4">
          Animated Logo — Light Background
        </h2>
        <div className="bg-chess-surface rounded-2xl p-8 flex items-center justify-center">
          <AnimatedLogo theme="light" size="md" perpetual autoPlay />
        </div>
      </section>

      {/* Icon only — sizes */}
      <section>
        <h2 className="text-sm font-bold text-chess-text-muted uppercase tracking-wide mb-4">
          Icon Only — All Sizes
        </h2>
        <div className="bg-chess-surface rounded-2xl p-8 flex items-end gap-8 justify-center">
          <div className="text-center space-y-2">
            <AnimatedLogo theme="light" size="sm" iconOnly perpetual autoPlay />
            <p className="text-xs text-chess-text-muted">sm</p>
          </div>
          <div className="text-center space-y-2">
            <AnimatedLogo theme="light" size="md" iconOnly perpetual autoPlay />
            <p className="text-xs text-chess-text-muted">md</p>
          </div>
          <div className="text-center space-y-2">
            <AnimatedLogo theme="light" size="lg" iconOnly perpetual autoPlay />
            <p className="text-xs text-chess-text-muted">lg</p>
          </div>
        </div>
      </section>

      {/* BreathingRook — all sizes */}
      <section>
        <h2 className="text-sm font-bold text-chess-text-muted uppercase tracking-wide mb-4">
          BreathingRook — All Sizes
        </h2>
        <div className="bg-chess-surface rounded-2xl p-8 flex items-end gap-8 justify-center">
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
            <div key={size} className="text-center space-y-2">
              <BreathingRook size={size} animate />
              <p className="text-xs text-chess-text-muted">{size}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BreathingRook — mood tinting */}
      <section>
        <h2 className="text-sm font-bold text-chess-text-muted uppercase tracking-wide mb-4">
          Mood Tinting — Tap to Preview Large
        </h2>
        <div className="bg-chess-surface rounded-2xl p-6">
          {/* Large preview of active mood */}
          <div className="flex items-center justify-center gap-4 mb-6 pb-6 border-b border-chess-disabled">
            <BreathingRook size="xl" mood={activeMood} animate />
            <div>
              <p className="text-lg font-bold text-chess-text">{activeMood}</p>
              <p className="text-sm text-chess-text-muted">Current mood preview</p>
            </div>
          </div>
          {/* Grid of all moods */}
          <div className="grid grid-cols-4 gap-3">
            {MOODS.map(mood => (
              <button
                key={mood}
                onClick={() => setActiveMood(mood)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                  activeMood === mood
                    ? 'bg-chess-green/10 ring-2 ring-chess-green'
                    : 'hover:bg-chess-page'
                }`}
              >
                <BreathingRook size="sm" mood={mood} />
                <span className="text-[10px] text-chess-text-muted font-medium">{mood}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BreathingRook — animation modes */}
      <section>
        <h2 className="text-sm font-bold text-chess-text-muted uppercase tracking-wide mb-4">
          Animation Modes
        </h2>
        <div className="bg-chess-surface rounded-2xl p-8 flex items-end gap-8 justify-center">
          <div className="text-center space-y-2">
            <BreathingRook size="lg" animate />
            <p className="text-xs text-chess-text-muted">breathe</p>
          </div>
          <div className="text-center space-y-2">
            <BreathingRook size="lg" animation="think" />
            <p className="text-xs text-chess-text-muted">think</p>
          </div>
          <div className="text-center space-y-2">
            <BreathingRook size="lg" animation="celebrate" />
            <p className="text-xs text-chess-text-muted">celebrate</p>
          </div>
          <div className="text-center space-y-2">
            <BreathingRook size="lg" animation="enter" />
            <p className="text-xs text-chess-text-muted">enter</p>
          </div>
        </div>
      </section>

      {/* RookieBubble component */}
      <section>
        <h2 className="text-sm font-bold text-chess-text-muted uppercase tracking-wide mb-4">
          RookieBubble Component
        </h2>
        <div className="bg-chess-surface rounded-2xl p-6 space-y-4">
          <RookieBubble mood="happy">
            Nice fork! I didn&apos;t even see that coming. And I&apos;m literally a computer.
          </RookieBubble>
          <RookieBubble mood="nervous">
            Oh no. Oh no no no. You&apos;re building something scary over there.
          </RookieBubble>
          <RookieBubble mood="defeated">
            Well. That happened. I&apos;ll be in my corner, recalculating my life choices.
          </RookieBubble>
          <RookieBubble mood="excited">
            YOUR FIRST CHECKMATE! Wait, sorry — I shouldn&apos;t yell. But CHECKMATE!
          </RookieBubble>
        </div>

        <h2 className="text-sm font-bold text-chess-text-muted uppercase tracking-wide mb-4 mt-6">
          RookieBubble — Vertical / Centered
        </h2>
        <div className="bg-chess-surface rounded-2xl p-6 max-w-sm mx-auto">
          <RookieBubble mood="happy" direction="up" centered>
            Your puzzles are ready. Let&apos;s go!
          </RookieBubble>
        </div>
      </section>

      {/* ActionButton component */}
      <section>
        <h2 className="text-sm font-bold text-chess-text-muted uppercase tracking-wide mb-4">
          ActionButton Component
        </h2>
        <div className="bg-chess-surface rounded-2xl p-6 space-y-6">
          {/* Full Rookie palette */}
          <div className="space-y-3">
            <p className="text-xs text-chess-text-muted font-semibold uppercase">Rookie Palette — Full Width</p>
            <ActionButton color="green" size="lg" fullWidth>Green — Start Learning</ActionButton>
            <ActionButton color="blue" size="lg" fullWidth>Blue — Continue</ActionButton>
            <ActionButton color="cyan" size="lg" fullWidth>Cyan — Try Again</ActionButton>
            <ActionButton color="purple" size="lg" fullWidth>Purple — Achievement</ActionButton>
            <ActionButton color="gold" size="lg" fullWidth>Gold — Go Premium</ActionButton>
            <ActionButton color="orange" size="lg" fullWidth>Orange — Warning</ActionButton>
            <ActionButton color="coral" size="lg" fullWidth>Coral — Attention</ActionButton>
            <ActionButton color="red" size="lg" fullWidth>Red — Give Up</ActionButton>
            <ActionButton color="white" size="lg" fullWidth>White — Skip</ActionButton>
          </div>

          {/* Medium inline */}
          <div className="space-y-3">
            <p className="text-xs text-chess-text-muted font-semibold uppercase">Medium / Inline</p>
            <div className="flex flex-wrap gap-3">
              <ActionButton color="green" size="md">Play Again</ActionButton>
              <ActionButton color="blue" size="md">Review</ActionButton>
              <ActionButton color="purple" size="md">Share</ActionButton>
              <ActionButton color="white" size="md">Skip</ActionButton>
            </div>
          </div>

          {/* Small inline */}
          <div className="space-y-3">
            <p className="text-xs text-chess-text-muted font-semibold uppercase">Small / Inline</p>
            <div className="flex flex-wrap gap-2">
              <ActionButton color="green" size="sm">Next</ActionButton>
              <ActionButton color="white" size="sm">Skip</ActionButton>
              <ActionButton color="blue" size="sm">Hint</ActionButton>
              <ActionButton color="orange" size="sm">Retry</ActionButton>
              <ActionButton color="coral" size="sm">Reset</ActionButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
