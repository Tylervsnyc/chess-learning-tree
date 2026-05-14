'use client';

/**
 * /test/dart-art — pick which AI-generated illustration to use for the new dart abilities.
 * Tap a card to select it.
 */

import { useState } from 'react';

const T1 = {
  border: 'linear-gradient(135deg, #6b6f76, #3f4248 35%, #9aa0a8 70%, #3f4248)',
  face: '#e7e4dc',
  text: '#3a3a3a',
};

const ABILITIES = [
  {
    id: 'poison-dart',
    name: 'Poison Dart',
    typeLine: 'Action · Ranged',
    blurb: 'Poisons a square. Pieces that step onto it suffer damage over time.',
    variants: [1, 2],
  },
  {
    id: 'rabies-dart',
    name: 'Rabies Dart',
    typeLine: 'Action · Ranged',
    blurb: 'Infects a piece. It attacks its own allies until it falls.',
    variants: [1, 2],
  },
  {
    id: 'freeze-ray',
    name: 'Freeze Ray',
    typeLine: 'Action · Ranged',
    blurb: 'Freezes a piece in place for a turn.',
    variants: [2, 3],
  },
];

// Bubble field for poison/rabies — rising bubbles that fade as they ascend.
// Positions are fixed so each render of the same card is stable but staggered.
const BUBBLES: Array<[number, number, number, number]> = [
  // [left%, sizePx, delayS, durS]
  [8, 8, 0.0, 2.6], [18, 6, 0.7, 2.2], [27, 10, 1.4, 2.9],
  [36, 7, 0.3, 2.5], [44, 12, 1.0, 3.1], [53, 6, 1.7, 2.3],
  [61, 9, 0.5, 2.7], [69, 7, 1.2, 2.4], [78, 11, 0.1, 3.0],
  [86, 6, 0.9, 2.5], [92, 8, 1.5, 2.8], [14, 5, 2.0, 2.1],
  [40, 5, 2.1, 2.2], [66, 5, 0.4, 2.0], [82, 5, 1.8, 2.6],
];

function BubbleField({ color, glow }: { color: string; glow: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <style>{`
        @keyframes dartBubbleRise {
          0%   { transform: translate(-50%, 0) scale(0.4); opacity: 0; }
          15%  { opacity: 0.9; }
          80%  { opacity: 0.7; }
          100% { transform: translate(-50%, -110%) scale(1.1); opacity: 0; }
        }
      `}</style>
      {BUBBLES.map(([left, size, delay, dur], i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${left}%`,
            bottom: '-6%',
            width: size,
            height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.85), ${color} 55%, ${color} 100%)`,
            boxShadow: `0 0 6px ${glow}`,
            animation: `dartBubbleRise ${dur}s ease-in ${delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function FreezeRayFx() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <style>{`
        @keyframes dartFreezeBeam {
          0%   { transform: translateY(-50%) scaleX(0); opacity: 0.9; }
          35%  { transform: translateY(-50%) scaleX(1); opacity: 1; }
          75%  { transform: translateY(-50%) scaleX(1); opacity: 1; }
          100% { transform: translateY(-50%) scaleX(1); opacity: 0; }
        }
        @keyframes dartFreezeFlake {
          0%   { left: 10%;  transform: translate(-50%, -50%) rotate(0deg)   scale(0.6); opacity: 0; }
          15%  { opacity: 1; }
          70%  { left: 90%;  transform: translate(-50%, -50%) rotate(540deg) scale(1.4); opacity: 1; }
          100% { left: 90%;  transform: translate(-50%, -50%) rotate(720deg) scale(2);   opacity: 0; }
        }
        @keyframes dartFreezeBurst {
          0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
          60%  { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
          70%  { transform: translate(-50%, -50%) scale(0.6); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
        }
      `}</style>
      <div
        style={{
          position: 'absolute',
          left: '10%',
          top: '50%',
          width: '80%',
          height: '6%',
          transformOrigin: '0% 50%',
          background:
            'linear-gradient(90deg, rgba(125,211,252,0) 0%, rgba(125,211,252,0.85) 20%, rgba(255,255,255,1) 50%, rgba(125,211,252,0.85) 80%, rgba(125,211,252,0) 100%)',
          filter: 'drop-shadow(0 0 8px rgba(125,211,252,1))',
          borderRadius: '999px',
          animation: 'dartFreezeBeam 2.4s ease-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          width: '18%',
          height: '18%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14cqw',
          color: '#e0f2fe',
          filter: 'drop-shadow(0 0 6px rgba(125,211,252,1))',
          animation: 'dartFreezeFlake 2.4s ease-out infinite',
        }}
      >
        ❄
      </div>
      <div
        style={{
          position: 'absolute',
          left: '90%',
          top: '50%',
          width: '28%',
          height: '28%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(125,211,252,0.6) 40%, transparent 75%)',
          animation: 'dartFreezeBurst 2.4s ease-out infinite',
        }}
      />
    </div>
  );
}

function AbilityFxOverlay({ abilityId }: { abilityId: string }) {
  if (abilityId === 'poison-dart') {
    return <BubbleField color="rgba(34,197,94,0.85)" glow="rgba(34,197,94,0.9)" />;
  }
  if (abilityId === 'rabies-dart') {
    return <BubbleField color="rgba(220,38,38,0.85)" glow="rgba(220,38,38,0.9)" />;
  }
  if (abilityId === 'freeze-ray') {
    return <FreezeRayFx />;
  }
  return null;
}

function Card({
  abilityId,
  name,
  typeLine,
  blurb,
  variant,
  picked,
  onClick,
}: {
  abilityId: string;
  name: string;
  typeLine: string;
  blurb: string;
  variant: number;
  picked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full active:scale-[0.98] transition-transform ${
        picked ? 'ring-4 ring-amber-400 ring-offset-2 rounded-[14px]' : ''
      }`}
      style={{
        aspectRatio: '5 / 7',
        background: T1.border,
        borderRadius: 14,
        padding: 5,
      }}
    >
      <div
        className="relative w-full h-full flex flex-col"
        style={{ background: T1.face, borderRadius: 10, overflow: 'hidden' }}
      >
        <div
          className="px-2 py-1 text-[11px] font-semibold tracking-wide text-center"
          style={{
            fontFamily: 'ui-serif, Georgia, serif',
            color: T1.text,
            background: 'linear-gradient(to bottom, #d6d2c6, #c5c1b4)',
            borderBottom: '1px solid #a8a39580',
          }}
        >
          {name}
        </div>
        <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/abilities/${abilityId}-${variant}.png`}
            alt={`${name} option ${variant}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ borderBottom: '1px solid #a8a39580' }}
          />
          <AbilityFxOverlay abilityId={abilityId} />
        </div>
        <div
          className="px-2 py-0.5 text-[8px] italic text-center"
          style={{ color: '#6b6f76', borderBottom: '1px solid #a8a39580' }}
        >
          {typeLine}
        </div>
        <div
          className="flex-1 px-2 py-1.5 text-[9px] leading-tight text-center"
          style={{ color: T1.text }}
        >
          {blurb}
        </div>
      </div>
      <div className="mt-1 text-center text-xs font-medium text-zinc-700">
        Option {variant}
      </div>
    </button>
  );
}

export default function DartArtPickerPage() {
  const [picks, setPicks] = useState<Record<string, number>>({});

  const choose = (id: string, variant: number) => {
    setPicks((prev) => ({
      ...prev,
      [id]: prev[id] === variant ? 0 : variant,
    }));
  };

  const summary = ABILITIES.map(
    (a) => `${a.id}: ${picks[a.id] ? `option ${picks[a.id]}` : '—'}`,
  ).join('\n');

  return (
    <div className="min-h-screen overflow-auto bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Rookie&apos;s Run — Pick Dart Art
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Two AI-generated options each. Tap to pick. Tap again to deselect.
          </p>
        </header>

        <div className="mb-8 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 p-4">
          <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
            Your picks
          </div>
          <pre className="text-[11px] font-mono text-zinc-800 dark:text-zinc-100 whitespace-pre-wrap">
            {summary}
          </pre>
        </div>

        {ABILITIES.map((a) => (
          <section key={a.id} className="mb-10">
            <div className="mb-3">
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {a.name}
              </h2>
              <div className="text-xs italic text-zinc-500 dark:text-zinc-400">
                {a.typeLine} · {a.blurb}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {a.variants.map((v) => (
                <Card
                  key={v}
                  abilityId={a.id}
                  name={a.name}
                  typeLine={a.typeLine}
                  blurb={a.blurb}
                  variant={v}
                  picked={picks[a.id] === v}
                  onClick={() => choose(a.id, v)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
