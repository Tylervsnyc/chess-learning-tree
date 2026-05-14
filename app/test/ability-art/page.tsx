'use client';

/**
 * /test/ability-art — pick which AI-generated illustration to use for each ability.
 * Tap a card to select it. Picks summary appears at the top, copyable for handoff.
 */

import { useState } from 'react';
import { ABILITY_DEFS, blurbForTier, ALL_ABILITY_IDS } from '@/lib/run/abilities';
import type { AbilityId } from '@/lib/run/abilities';

const T1 = {
  border: 'linear-gradient(135deg, #6b6f76, #3f4248 35%, #9aa0a8 70%, #3f4248)',
  face: '#e7e4dc',
  text: '#3a3a3a',
};

const VARIANTS_BY_ABILITY: Partial<Record<string, number[]>> = {};
const DEFAULT_VARIANTS = [1];

function Card({
  abilityId,
  name,
  typeLine,
  blurb,
  variant,
  picked,
  onClick,
}: {
  abilityId: AbilityId;
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
            src={`/abilities/${abilityId}-${variant}.webp`}
            alt={`${name} option ${variant}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ borderBottom: '1px solid #a8a39580' }}
          />
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
        <div
          className="absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: '#6b6f76' }}
        >
          1
        </div>
      </div>
      <div className="mt-1 text-center text-xs font-medium text-zinc-700">
        Option {variant}
      </div>
    </button>
  );
}

export default function AbilityArtPickerPage() {
  const [picks, setPicks] = useState<Record<string, number>>({});

  const choose = (id: AbilityId, variant: number) => {
    setPicks((prev) => ({
      ...prev,
      [id]: prev[id] === variant ? 0 : variant,
    }));
  };

  const summary = ALL_ABILITY_IDS
    .map((id) => `${id}: ${picks[id] ? `option ${picks[id]}` : '—'}`)
    .join('\n');

  return (
    <div className="min-h-screen overflow-auto bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Rookie&apos;s Run — Pick Ability Art
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            AI-generated illustrations. Tap a card to pick it for that ability. Tap again to deselect.
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

        {ALL_ABILITY_IDS.map((id) => {
          const def = ABILITY_DEFS[id];
          const blurb = blurbForTier(id, 1);
          return (
            <section key={id} className="mb-10">
              <div className="mb-3">
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {def.name}
                </h2>
                <div className="text-xs italic text-zinc-500 dark:text-zinc-400">
                  {def.typeLine} · {blurb}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {(VARIANTS_BY_ABILITY[id] ?? DEFAULT_VARIANTS).map((v) => (
                  <Card
                    key={v}
                    abilityId={id}
                    name={def.name}
                    typeLine={def.typeLine}
                    blurb={blurb}
                    variant={v}
                    picked={picks[id] === v}
                    onClick={() => choose(id, v)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
