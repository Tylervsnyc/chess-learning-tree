'use client';

/**
 * /test/decoy-art — three painted illustration options for the new "Decoy"
 * ability, generated via scripts/gen-ability-art.ts (gpt-image-1, Power-9 MTG
 * relic style). Each is rendered inside the same MTG-style card frame used by
 * AbilityCardFull.
 *
 * Decoy: turn an enemy piece into a target for all other enemy pieces for X turns.
 */

import { useState } from 'react';

const FRAME = {
  border:
    'linear-gradient(135deg, #173a7a, #0a1f4d 30%, #3d76d9 65%, #0a1f4d)',
  face: '#dce6f5',
  art: 'radial-gradient(ellipse at center, #1a2a4a 0%, #07101f 100%)',
  gem: '#173a7a',
  text: '#0a1f4d',
};

type Option = {
  variant: 1 | 2 | 3;
  title: string;
  pitch: string;
};

const OPTIONS: Option[] = [
  {
    variant: 1,
    title: 'A · Bullseye Lure',
    pitch:
      'Concentric jeweled target with crossed arrows and a hypnotic ruby bullseye. Reads instantly as "shoot here."',
  },
  {
    variant: 2,
    title: 'B · Jester Mask',
    pitch:
      'Theatrical jester half-mask glowing violet, with a ruby tear and sapphire tear. Leans into the "trick" flavor.',
  },
  {
    variant: 3,
    title: 'C · Golden Idol',
    pitch:
      'Slender chess-piece idol on a filigree pedestal, radiant diamond crown, silhouettes drawn toward it. Most epic.',
  },
];

function DecoyCard({
  variant,
  selected,
  onClick,
}: {
  variant: 1 | 2 | 3;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full max-w-[220px] mx-auto group transition-transform ${
        selected ? 'scale-[1.03]' : 'active:scale-[0.98]'
      }`}
      style={{
        aspectRatio: '5 / 7',
        background: FRAME.border,
        borderRadius: 14,
        padding: 5,
        boxShadow: selected
          ? '0 0 0 3px #ffd87a, 0 8px 22px rgba(0,0,0,0.45)'
          : '0 6px 18px rgba(0,0,0,0.35)',
      }}
    >
      <div
        className="relative w-full h-full rounded-[10px] flex flex-col overflow-hidden"
        style={{ background: FRAME.face, color: FRAME.text }}
      >
        <div
          className="px-3 pt-2.5 pb-1.5 text-center"
          style={{
            fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
            fontWeight: 900,
            fontSize: 18,
            lineHeight: 1.05,
            color: FRAME.text,
          }}
        >
          Decoy
        </div>

        <div
          className="mx-2.5 rounded-md overflow-hidden relative"
          style={{
            background: FRAME.art,
            height: '60%',
            boxShadow:
              'inset 0 0 14px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.18)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/abilities/decoy-${variant}.webp`}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        <div
          className="px-3 pt-1.5 pb-0 text-center text-[10px]"
          style={{
            fontFamily: 'ui-serif, Georgia, serif',
            fontStyle: 'italic',
            color: FRAME.text,
            opacity: 0.8,
          }}
        >
          Trick · Lasts 2 turns
        </div>

        <div
          className="mx-2.5 mt-1.5 mb-2 flex-1 rounded-md px-2 py-1.5 flex items-center"
          style={{
            background: 'rgba(255,255,255,0.55)',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)',
          }}
        >
          <p
            className="text-[11px] leading-snug font-medium"
            style={{ color: '#241b08' }}
          >
            Mark an enemy piece. Every other enemy piece must move toward it for
            2 turns.
          </p>
        </div>

        <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
          <span
            className="text-[10px] font-black"
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: FRAME.gem,
              color: FRAME.face,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 1.5px rgba(0,0,0,0.18)',
            }}
          >
            3
          </span>
        </div>
      </div>
    </button>
  );
}

export default function DecoyArtTestPage() {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-full overflow-auto bg-[#0d1424] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-black tracking-tight">
            Decoy — illustration options
          </h1>
          <p className="text-sm text-white/70 mt-1 max-w-2xl">
            Three painted concept directions for the new <b>Decoy</b> ability,
            in the same Power-9 relic style as the existing cards. Tap to mark
            your pick.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {OPTIONS.map((o) => (
            <div key={o.variant} className="flex flex-col items-center gap-3">
              <DecoyCard
                variant={o.variant}
                selected={picked === o.variant}
                onClick={() => setPicked(o.variant)}
              />
              <div className="text-center max-w-[240px]">
                <div className="text-sm font-bold">{o.title}</div>
                <div className="text-xs text-white/65 mt-1">{o.pitch}</div>
              </div>
            </div>
          ))}
        </div>

        {picked ? (
          <div className="mt-8 text-center text-sm text-amber-300">
            Picked: <b>{OPTIONS.find((o) => o.variant === picked)?.title}</b>
          </div>
        ) : null}
      </div>
    </div>
  );
}
