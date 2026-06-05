'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { ABILITY_DEFS } from '@/lib/run/abilities';
import type { AbilityId } from '@/lib/run/abilities';

function artFile(id: AbilityId): string {
  if (id === 'poison-dart') return 'poison-dart-2.png';
  if (id === 'rabies-dart') return 'rabies-dart-2.png';
  if (id === 'freeze-ray') return 'freeze-ray-2.png';
  return `${id}-1.webp`;
}

const PAGES: { title: string; subtitle: string; ids: AbilityId[] }[] = [
  {
    title: 'Rookie’s Run',
    subtitle: 'The 12 Abilities — Part 1',
    ids: [
      'bishop-step',
      'knight-hop',
      'queen-pulse',
      'become-king',
      'convert',
      'drones',
    ],
  },
  {
    title: 'Rookie’s Run',
    subtitle: 'The 12 Abilities — Part 2',
    ids: [
      'surge',
      'aegis',
      'freeze-ray',
      'poison-dart',
      'rabies-dart',
      'decoy',
    ],
  },
];

export default function RookieAbilitiesReelPage() {
  return (
    <div className="min-h-screen w-full overflow-auto bg-neutral-900 py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 px-4">
        <h1 className="text-center font-serif text-2xl text-amber-100/80">
          Reel pages — 1080×1920 each
        </h1>
        {PAGES.map((page, idx) => (
          <ReelPage key={idx} {...page} pageNum={idx + 1} total={PAGES.length} />
        ))}
      </div>
    </div>
  );
}

function ReelPage({
  title,
  subtitle,
  ids,
  pageNum,
  total,
}: {
  title: string;
  subtitle: string;
  ids: AbilityId[];
  pageNum: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  async function handleDownload() {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current, {
      pixelRatio: 4, // 540×960 displayed -> 2160×3840 captured; 1080×1920 after Instagram resize
      cacheBust: true,
    });
    const link = document.createElement('a');
    link.download = `rookies-run-abilities-${pageNum}.png`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-3">
    <div
      ref={ref}
      className="relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      style={{
        width: 1080 / 2,
        height: 1920 / 2,
        background:
          'radial-gradient(ellipse at top, #5a3a1f 0%, #3a2412 45%, #1f1208 100%)',
      }}
    >
      {/* parchment grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, #fff 0px, transparent 1px), radial-gradient(circle at 80% 60%, #fff 0px, transparent 1px), radial-gradient(circle at 50% 80%, #fff 0px, transparent 1px)',
          backgroundSize: '7px 7px, 11px 11px, 13px 13px',
        }}
      />
      {/* outer card frame */}
      <div
        className="absolute inset-3 rounded-[14px]"
        style={{
          background:
            'linear-gradient(160deg, #c9a36a 0%, #6b4a26 25%, #2c1a0a 55%, #6b4a26 85%, #c9a36a 100%)',
          padding: 4,
        }}
      >
        <div
          className="relative h-full w-full rounded-[10px] px-5 pb-5 pt-6"
          style={{
            background:
              'linear-gradient(180deg, #2a1a0c 0%, #20130a 50%, #2a1a0c 100%)',
          }}
        >
          {/* Header */}
          <div className="mb-4 text-center">
            <div
              className="font-serif text-[28px] font-bold leading-none tracking-wide"
              style={{
                color: '#f3d68a',
                textShadow:
                  '0 2px 0 #1a0d04, 0 0 18px rgba(243,214,138,0.35)',
              }}
            >
              {title}
            </div>
            <div
              className="mt-1 font-serif text-[14px] italic"
              style={{ color: '#c8a063' }}
            >
              {subtitle}
            </div>
            <div
              className="mx-auto mt-2 h-px w-3/4"
              style={{
                background:
                  'linear-gradient(90deg, transparent, #c8a063, transparent)',
              }}
            />
          </div>

          {/* List of cards */}
          <div className="flex flex-col gap-3">
            {ids.map((id) => {
              const def = ABILITY_DEFS[id];
              return (
                <AbilityRow
                  key={id}
                  id={id}
                  name={def.name}
                  description={def.description}
                />
              );
            })}
          </div>

          {/* Footer */}
          <div
            className="absolute inset-x-0 bottom-3 text-center font-serif text-[11px] italic"
            style={{ color: '#8a6a3d' }}
          >
            — {pageNum} / {total} — a daily chess roguelike
          </div>
        </div>
      </div>
    </div>
      <button
        onClick={handleDownload}
        className="rounded-md bg-amber-200 px-4 py-2 font-serif text-sm font-bold text-amber-950 shadow hover:bg-amber-100"
      >
        Download Page {pageNum} (PNG)
      </button>
    </div>
  );
}

function AbilityRow({
  id,
  name,
  description,
}: {
  id: AbilityId;
  name: string;
  description: string;
}) {
  return (
    <div className="flex items-stretch gap-3">
      {/* Small MTG-style art card on left */}
      <div
        className="relative shrink-0 overflow-hidden rounded-[5px]"
        style={{
          width: 110,
          background:
            'linear-gradient(155deg, #b8893d 0%, #6b4a22 30%, #3a230d 60%, #6b4a22 90%, #b8893d 100%)',
          padding: 2,
          boxShadow:
            '0 3px 8px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(0,0,0,0.4)',
        }}
      >
        <div
          className="relative aspect-square overflow-hidden rounded-[3px]"
          style={{
            boxShadow: 'inset 0 0 0 2px #2a1a08',
            background: '#1a0e04',
          }}
        >
          <Image
            src={`/abilities/${artFile(id)}`}
            alt={name}
            fill
            sizes="120px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Text box on right */}
      <div
        className="flex-1 overflow-hidden rounded-[5px]"
        style={{
          background:
            'linear-gradient(155deg, #b8893d 0%, #6b4a22 60%, #b8893d 100%)',
          padding: 2,
          boxShadow:
            '0 3px 8px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(0,0,0,0.4)',
        }}
      >
        <div
          className="flex h-full flex-col rounded-[3px] px-3 py-2"
          style={{
            background:
              'linear-gradient(180deg, #ede2c2 0%, #d4bd8b 100%)',
            color: '#2a1a08',
          }}
        >
          <div
            className="font-serif text-[22px] font-bold leading-tight"
            style={{
              color: '#2a1a08',
              textShadow: '0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            {name}
          </div>
          <div
            className="my-1 h-px w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, #6b4a22, transparent)',
            }}
          />
          <div className="font-serif text-[16px] italic leading-snug">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}
