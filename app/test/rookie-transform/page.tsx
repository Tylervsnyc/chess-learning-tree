'use client';

import { useEffect, useRef, useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { PieceBlocks } from '@/components/run/PieceBlocks';
import type { RookieForm } from '@/lib/run/types';

/**
 * /test/rookie-transform — 5 candidate transform animations for Rookie's Run.
 *
 * Tap a tile to cycle through forms (rook → knight → bishop → rook). Each
 * option implements the same cycle but with a different transition animation.
 */

const FORMS: RookieForm[] = ['rook', 'knight', 'bishop'];

function nextForm(f: RookieForm): RookieForm {
  return FORMS[(FORMS.indexOf(f) + 1) % FORMS.length];
}

function FormSprite({
  form,
  blockSize = 4,
  animate = true,
}: {
  form: RookieForm;
  blockSize?: number;
  animate?: boolean;
}) {
  if (form === 'rook') {
    return (
      <BreathingRook
        size="md"
        animate={animate}
        mood="neutral"
      />
    );
  }
  return (
    <PieceBlocks
      piece={form === 'knight' ? 'N' : 'B'}
      blockSize={blockSize}
      animate={animate}
    />
  );
}

/* ===========================================================
 * OPTION 1 — Dissolve & Reassemble
 * Blocks scatter outward into confetti, new piece blocks fly
 * in from random offsets and snap into place.
 * =========================================================== */
function OptionDissolve({ form, onCycle }: { form: RookieForm; onCycle: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const [shownForm, setShownForm] = useState(form);
  const pendingRef = useRef<RookieForm>(form);

  const handle = () => {
    if (phase !== 'idle') return;
    pendingRef.current = nextForm(form);
    setPhase('out');
  };

  useEffect(() => {
    if (phase === 'out') {
      const t = setTimeout(() => {
        setShownForm(pendingRef.current);
        setPhase('in');
        onCycle();
      }, 380);
      return () => clearTimeout(t);
    }
    if (phase === 'in') {
      const t = setTimeout(() => setPhase('idle'), 480);
      return () => clearTimeout(t);
    }
  }, [phase, onCycle]);

  return (
    <button
      onClick={handle}
      className="relative w-32 h-32 flex items-center justify-center bg-white rounded-2xl shadow-md hover:shadow-lg transition"
    >
      <style>{`
        @keyframes dissolveOut {
          0%   { opacity: 1; transform: scale(1)   rotate(0); filter: blur(0); }
          60%  { opacity: 0.6; transform: scale(1.15) rotate(15deg); filter: blur(2px); }
          100% { opacity: 0; transform: scale(0.4) rotate(-25deg); filter: blur(8px); }
        }
        @keyframes dissolveIn {
          0%   { opacity: 0; transform: scale(0.4) rotate(25deg); filter: blur(8px); }
          50%  { opacity: 0.9; transform: scale(1.1) rotate(-8deg); filter: blur(1px); }
          100% { opacity: 1; transform: scale(1)   rotate(0); filter: blur(0); }
        }
      `}</style>
      <div
        style={{
          animation:
            phase === 'out'
              ? 'dissolveOut 380ms ease-in forwards'
              : phase === 'in'
                ? 'dissolveIn 480ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                : undefined,
        }}
      >
        <FormSprite form={shownForm} animate={phase === 'idle'} />
      </div>
    </button>
  );
}

/* ===========================================================
 * OPTION 2 — Spin & Morph
 * Piece spins 360° while scaling down to a dot then up into
 * the new form. Classic transformation feel.
 * =========================================================== */
function OptionSpinMorph({ form, onCycle }: { form: RookieForm; onCycle: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'shrink' | 'grow'>('idle');
  const [shownForm, setShownForm] = useState(form);
  const pendingRef = useRef<RookieForm>(form);

  const handle = () => {
    if (phase !== 'idle') return;
    pendingRef.current = nextForm(form);
    setPhase('shrink');
  };

  useEffect(() => {
    if (phase === 'shrink') {
      const t = setTimeout(() => {
        setShownForm(pendingRef.current);
        setPhase('grow');
        onCycle();
      }, 320);
      return () => clearTimeout(t);
    }
    if (phase === 'grow') {
      const t = setTimeout(() => setPhase('idle'), 420);
      return () => clearTimeout(t);
    }
  }, [phase, onCycle]);

  return (
    <button
      onClick={handle}
      className="relative w-32 h-32 flex items-center justify-center bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
    >
      <style>{`
        @keyframes spinShrink {
          0%   { transform: scale(1)    rotate(0); }
          100% { transform: scale(0.05) rotate(540deg); }
        }
        @keyframes spinGrow {
          0%   { transform: scale(0.05) rotate(540deg); }
          70%  { transform: scale(1.15) rotate(990deg); }
          100% { transform: scale(1)    rotate(1080deg); }
        }
        @keyframes flashGlow {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.9; }
        }
      `}</style>
      <div
        className="absolute inset-0 bg-amber-300/60 pointer-events-none"
        style={{
          animation:
            phase === 'shrink'
              ? 'flashGlow 320ms ease-out forwards'
              : phase === 'grow'
                ? 'flashGlow 420ms ease-in reverse'
                : undefined,
          opacity: phase === 'idle' ? 0 : undefined,
        }}
      />
      <div
        style={{
          animation:
            phase === 'shrink'
              ? 'spinShrink 320ms ease-in forwards'
              : phase === 'grow'
                ? 'spinGrow 420ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                : undefined,
        }}
      >
        <FormSprite form={shownForm} animate={phase === 'idle'} />
      </div>
    </button>
  );
}

/* ===========================================================
 * OPTION 3 — Glitch Flicker
 * RGB-split + scanline flicker. Rookie is a computer learning
 * to feel — leans into her digital nature. Quick, punchy.
 * =========================================================== */
function OptionGlitch({ form, onCycle }: { form: RookieForm; onCycle: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'glitch'>('idle');
  const [shownForm, setShownForm] = useState(form);
  const swappedRef = useRef(false);

  const handle = () => {
    if (phase !== 'idle') return;
    swappedRef.current = false;
    setPhase('glitch');
  };

  useEffect(() => {
    if (phase === 'glitch') {
      const swap = setTimeout(() => {
        setShownForm(nextForm(form));
        swappedRef.current = true;
        onCycle();
      }, 220);
      const done = setTimeout(() => setPhase('idle'), 440);
      return () => {
        clearTimeout(swap);
        clearTimeout(done);
      };
    }
  }, [phase, form, onCycle]);

  return (
    <button
      onClick={handle}
      className="relative w-32 h-32 flex items-center justify-center bg-slate-900 rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
    >
      <style>{`
        @keyframes glitchShakeR {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          10% { transform: translate(3px, -2px); opacity: 0.7; }
          30% { transform: translate(-2px, 1px); opacity: 0.6; }
          50% { transform: translate(4px, 2px); opacity: 0.7; }
          70% { transform: translate(-3px, -1px); opacity: 0.5; }
        }
        @keyframes glitchShakeB {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          15% { transform: translate(-3px, 2px); opacity: 0.7; }
          35% { transform: translate(2px, -1px); opacity: 0.6; }
          55% { transform: translate(-4px, -2px); opacity: 0.7; }
          75% { transform: translate(3px, 1px); opacity: 0.5; }
        }
        @keyframes glitchScanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes glitchBase {
          0%, 100% { transform: translate(0,0); }
          20% { transform: translate(2px,0); }
          40% { transform: translate(-2px,0); }
          60% { transform: translate(0, 1px); }
        }
      `}</style>
      {phase === 'glitch' && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 4px)',
              mixBlendMode: 'overlay',
            }}
          />
          <div
            className="absolute left-0 right-0 h-6 bg-cyan-300/30 pointer-events-none"
            style={{ animation: 'glitchScanline 220ms linear' }}
          />
        </>
      )}
      <div className="relative" style={{ animation: phase === 'glitch' ? 'glitchBase 440ms steps(8)' : undefined }}>
        <div className="relative">
          <FormSprite form={shownForm} animate={phase === 'idle'} />
        </div>
        {phase === 'glitch' && (
          <>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                animation: 'glitchShakeR 440ms steps(6)',
                filter: 'drop-shadow(2px 0 0 #ff4b4b)',
                mixBlendMode: 'screen',
              }}
            >
              <FormSprite form={shownForm} animate={false} />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                animation: 'glitchShakeB 440ms steps(6)',
                filter: 'drop-shadow(-2px 0 0 #1cb0f6)',
                mixBlendMode: 'screen',
              }}
            >
              <FormSprite form={shownForm} animate={false} />
            </div>
          </>
        )}
      </div>
    </button>
  );
}

/* ===========================================================
 * OPTION 4 — Block Cascade
 * Blocks crumble away top-to-bottom (gravity); new piece's
 * blocks rise from the bottom and lock in. Tactile, blocky.
 * =========================================================== */
function OptionCascade({ form, onCycle }: { form: RookieForm; onCycle: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'fall' | 'rise'>('idle');
  const [shownForm, setShownForm] = useState(form);
  const pendingRef = useRef<RookieForm>(form);

  const handle = () => {
    if (phase !== 'idle') return;
    pendingRef.current = nextForm(form);
    setPhase('fall');
  };

  useEffect(() => {
    if (phase === 'fall') {
      const t = setTimeout(() => {
        setShownForm(pendingRef.current);
        setPhase('rise');
        onCycle();
      }, 360);
      return () => clearTimeout(t);
    }
    if (phase === 'rise') {
      const t = setTimeout(() => setPhase('idle'), 460);
      return () => clearTimeout(t);
    }
  }, [phase, onCycle]);

  return (
    <button
      onClick={handle}
      className="relative w-32 h-32 flex items-center justify-center bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
    >
      <style>{`
        @keyframes cascadeFall {
          0%   { transform: translateY(0)   skewY(0deg);   opacity: 1; }
          40%  { transform: translateY(4px) skewY(2deg);   opacity: 0.9; }
          100% { transform: translateY(140px) skewY(8deg); opacity: 0; }
        }
        @keyframes cascadeRise {
          0%   { transform: translateY(140px) skewY(-8deg); opacity: 0; }
          50%  { transform: translateY(-6px) skewY(-2deg);  opacity: 1; }
          75%  { transform: translateY(3px) skewY(1deg);    opacity: 1; }
          100% { transform: translateY(0)    skewY(0);      opacity: 1; }
        }
      `}</style>
      <div
        style={{
          animation:
            phase === 'fall'
              ? 'cascadeFall 360ms cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards'
              : phase === 'rise'
                ? 'cascadeRise 460ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                : undefined,
        }}
      >
        <FormSprite form={shownForm} animate={phase === 'idle'} />
      </div>
      {phase !== 'idle' && (
        <div
          className="absolute inset-x-0 bottom-0 h-1 bg-amber-300/60 pointer-events-none"
          style={{ animation: 'cascadeFall 360ms ease-out reverse' }}
        />
      )}
    </button>
  );
}

/* ===========================================================
 * OPTION 5 — Burst & Reform
 * Bright flash + radial confetti burst, new piece pops in
 * with overshoot. Celebratory, big "TADA" energy.
 * =========================================================== */
function OptionBurst({ form, onCycle }: { form: RookieForm; onCycle: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'burst' | 'pop'>('idle');
  const [shownForm, setShownForm] = useState(form);
  const pendingRef = useRef<RookieForm>(form);

  const handle = () => {
    if (phase !== 'idle') return;
    pendingRef.current = nextForm(form);
    setPhase('burst');
  };

  useEffect(() => {
    if (phase === 'burst') {
      const t = setTimeout(() => {
        setShownForm(pendingRef.current);
        setPhase('pop');
        onCycle();
      }, 200);
      return () => clearTimeout(t);
    }
    if (phase === 'pop') {
      const t = setTimeout(() => setPhase('idle'), 520);
      return () => clearTimeout(t);
    }
  }, [phase, onCycle]);

  const SHARDS = 12;

  return (
    <button
      onClick={handle}
      className="relative w-32 h-32 flex items-center justify-center bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
    >
      <style>{`
        @keyframes burstFlash {
          0%   { opacity: 0; transform: scale(0.2); }
          50%  { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1.6); }
        }
        @keyframes burstShard {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.2); opacity: 0; }
        }
        @keyframes burstSquishOut {
          0%   { transform: scale(1, 1); opacity: 1; }
          100% { transform: scale(1.3, 0.6); opacity: 0; }
        }
        @keyframes burstPopIn {
          0%   { transform: scale(0.3, 1.4); opacity: 0; }
          40%  { transform: scale(1.2, 0.8); opacity: 1; }
          70%  { transform: scale(0.95, 1.05); }
          100% { transform: scale(1, 1); opacity: 1; }
        }
      `}</style>
      <div
        className="absolute inset-0 m-auto w-20 h-20 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,200,0,0.6) 50%, transparent 75%)',
          opacity: 0,
          animation: phase === 'burst' ? 'burstFlash 360ms ease-out forwards' : undefined,
        }}
      />
      {phase === 'burst' &&
        Array.from({ length: SHARDS }, (_, i) => {
          const angle = (i / SHARDS) * Math.PI * 2;
          const dist = 50 + (i % 3) * 10;
          const tx = Math.cos(angle) * dist;
          const ty = Math.sin(angle) * dist;
          const color = ['#FFC800', '#FF9600', '#1CB0F6', '#58CC02'][i % 4];
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-sm pointer-events-none"
              style={
                {
                  background: color,
                  ['--tx' as string]: `${tx}px`,
                  ['--ty' as string]: `${ty}px`,
                  animation: 'burstShard 460ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
                } as React.CSSProperties
              }
            />
          );
        })}
      <div
        style={{
          animation:
            phase === 'burst'
              ? 'burstSquishOut 200ms ease-in forwards'
              : phase === 'pop'
                ? 'burstPopIn 520ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                : undefined,
        }}
      >
        <FormSprite form={shownForm} animate={phase === 'idle'} />
      </div>
    </button>
  );
}

/* ===========================================================
 * Page
 * =========================================================== */

interface CardSpec {
  title: string;
  blurb: string;
  Component: React.ComponentType<{ form: RookieForm; onCycle: () => void }>;
}

const OPTIONS: CardSpec[] = [
  {
    title: '1 · Dissolve & Reassemble',
    blurb: 'Old form blurs out & shrinks; new form pops in with overshoot. Soft + magical.',
    Component: OptionDissolve,
  },
  {
    title: '2 · Spin & Morph',
    blurb: 'Triple-spin shrink to a pinprick, then explode back out. Classic transformation.',
    Component: OptionSpinMorph,
  },
  {
    title: '3 · Glitch Flicker',
    blurb: 'RGB split + scanlines. Leans into Rookie being a computer rebooting.',
    Component: OptionGlitch,
  },
  {
    title: '4 · Block Cascade',
    blurb: 'Blocks fall like sand, new piece rises from below. Tactile + blocky.',
    Component: OptionCascade,
  },
  {
    title: '5 · Burst & Reform',
    blurb: 'Flash, confetti burst, big TADA squish-in. Celebratory.',
    Component: OptionBurst,
  },
];

export default function RookieTransformTestPage() {
  // One form per card so each demo is independent.
  const [forms, setForms] = useState<RookieForm[]>(() => OPTIONS.map(() => 'rook'));

  const cycle = (idx: number) => {
    setForms((arr) => arr.map((f, i) => (i === idx ? nextForm(f) : f)));
  };

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-md mx-auto w-full px-4 py-6 flex flex-col gap-5">
        <header>
          <h1 className="text-2xl font-black text-chess-text">Transform Animations</h1>
          <p className="mt-1 text-sm text-chess-text-muted">
            5 candidate transitions for Rookie shifting between rook, knight, and bishop.
            Tap any tile to cycle.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {OPTIONS.map((opt, i) => {
            const { Component } = opt;
            return (
              <div
                key={opt.title}
                className="bg-chess-surface rounded-2xl p-4 shadow-sm flex items-center gap-4"
              >
                <Component form={forms[i]} onCycle={() => cycle(i)} />
                <div className="flex-1">
                  <div className="text-sm font-black text-chess-text">{opt.title}</div>
                  <div className="mt-1 text-xs text-chess-text-muted leading-snug">
                    {opt.blurb}
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-wide text-chess-text-faint">
                    Showing: {forms[i]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-chess-text-faint pt-4">
          Tap a tile repeatedly to see all three forms cycle.
        </p>
      </div>
    </div>
  );
}
