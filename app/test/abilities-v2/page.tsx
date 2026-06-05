'use client';

/**
 * /test/abilities-v2 — preview the three new abilities (Convert, Squad, Drones)
 * with two art variants each, plus tier proposals.
 *
 * Drop art at /public/abilities/{id}-{1|2}.webp (or .png — falls back if missing).
 */

import { useState } from 'react';

type AbilityV2 = {
  id: 'convert' | 'squad' | 'drones';
  name: string;
  typeLine: string;
  oneLiner: string;
  tiers: { tier: 1 | 2 | 3; name: string; cost: string; effect: string }[];
  notes: string[];
};

const ABILITIES: AbilityV2[] = [
  {
    id: 'convert',
    name: 'Convert',
    typeLine: 'Targeted · Rainbow allegiance',
    oneLiner: 'Flip an enemy piece to Rookie\'s team. Converted pieces render rainbow.',
    tiers: [
      {
        tier: 1,
        name: 'Convert: Pawn',
        cost: '1 charge',
        effect:
          'Tap any enemy pawn. It joins your team and starts moving down the board on your turn like the rest of your squad.',
      },
      {
        tier: 2,
        name: 'Convert: Minor',
        cost: '2 charges',
        effect:
          'Tap any enemy knight or bishop. It flips to rainbow and follows your side\'s movement rules.',
      },
      {
        tier: 3,
        name: 'Convert: Major',
        cost: '3 charges (ultimate)',
        effect:
          'Tap any enemy rook or queen. It defects to your team in full rainbow plumage. King is never targetable.',
      },
    ],
    notes: [
      'Converted pieces use the same auto-move logic as Squad spawns (greedy capture, advance toward rank 8).',
      'If a converted pawn reaches rank 8 it promotes to a rainbow queen.',
      'Visually: full rainbow palette swap, no white pieces ever appear on the board.',
    ],
  },
  {
    id: 'squad',
    name: 'Squad',
    typeLine: 'Spawn · Marches & captures',
    oneLiner: 'Summon a rainbow squad on a chosen file. They march down and capture greedily.',
    tiers: [
      {
        tier: 1,
        name: 'Squad: Pawn Line',
        cost: '1 charge',
        effect:
          'Pick a file. 2 rainbow pawns spawn on ranks 1–2 of that file and auto-advance each turn, capturing what they can.',
      },
      {
        tier: 2,
        name: 'Squad: Strike Team',
        cost: '2 charges',
        effect:
          'Pick a file. 2 pawns + 1 knight spawn near rank 1. Knight roams toward the nearest enemy; pawns push.',
      },
      {
        tier: 3,
        name: 'Squad: Full Battalion',
        cost: '3 charges (ultimate)',
        effect:
          'Pick a file. 3 pawns + 1 knight + 1 bishop spawn across ranks 1–2. Pawns promote on rank 8.',
      },
    ],
    notes: [
      'All squad pieces are rainbow and auto-move on Rookie\'s turn (Rookie still gets her own move).',
      'Squad pieces block enemy moves like normal pieces — they\'re real, not phantoms.',
      'Promotion on rank 8 = rainbow queen.',
    ],
  },
  {
    id: 'drones',
    name: 'Drones',
    typeLine: 'Swarm · One-capture kamikaze',
    oneLiner: 'Spawn mini-Rookies that hunt the nearest enemy, capture once, then vanish.',
    tiers: [
      {
        tier: 1,
        name: 'Drones: Pair',
        cost: '1 charge',
        effect:
          '2 mini-rookies spawn adjacent to Rookie. Each turn they step toward the nearest enemy (slight randomness) and vanish on capture.',
      },
      {
        tier: 2,
        name: 'Drones: Swarm',
        cost: '2 charges',
        effect:
          '4 mini-rookies spawn. Same hunt-and-die behavior, more board coverage.',
      },
      {
        tier: 3,
        name: 'Drones: Hive',
        cost: '3 charges (ultimate)',
        effect:
          '6 mini-rookies spawn in a ring around Rookie. They saturate the board for one big breakthrough turn.',
      },
    ],
    notes: [
      'Movement: weighted toward nearest enemy with ~20% random step so they feel alive, not robotic.',
      'Drones die after 1 capture OR after 5 turns with no capture (so they don\'t clog the board forever).',
      'Drones can\'t be captured by enemies — they\'re too small. They just expire.',
    ],
  },
];

function ArtCard({ id, variant }: { id: string; variant: 1 | 2 }) {
  const [errored, setErrored] = useState(false);
  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
      style={{ aspectRatio: '1 / 1' }}
    >
      {errored ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
          <div className="text-3xl mb-1 opacity-40">+</div>
          <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 break-all">
            /abilities/{id}-{variant}.png
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">drop image here</div>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/abilities/${id}-${variant}.png`}
          alt={`${id} variant ${variant}`}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setErrored(true)}
        />
      )}
      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold">
        Option {variant}
      </div>
    </div>
  );
}

export default function AbilitiesV2Page() {
  const [picks, setPicks] = useState<Record<string, 1 | 2 | null>>({});

  const choose = (id: string, v: 1 | 2) =>
    setPicks((p) => ({ ...p, [id]: p[id] === v ? null : v }));

  return (
    <div className="min-h-screen overflow-auto bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Rookie&apos;s Run — Abilities v2
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Shipped abilities: <strong>Convert</strong>, <strong>Squad</strong>, and{' '}
            <strong>Drones</strong>. Play the test run at{' '}
            <a href="/run?run=abilities-v2" className="underline">/run?run=abilities-v2</a>.
          </p>
        </header>

        {ABILITIES.map((a) => (
          <section
            key={a.id}
            className="mb-10 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/60 p-5 sm:p-6"
          >
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {a.name}
              </h2>
              <div className="text-[11px] italic text-zinc-500 dark:text-zinc-400">
                {a.typeLine}
              </div>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">{a.oneLiner}</p>

            <div className="grid grid-cols-2 gap-3 mb-5 max-w-md">
              {([1, 2] as const).map((v) => {
                const picked = picks[a.id] === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => choose(a.id, v)}
                    className={`rounded-xl transition-transform active:scale-[0.98] ${
                      picked ? 'ring-4 ring-amber-400 ring-offset-2 dark:ring-offset-zinc-800' : ''
                    }`}
                  >
                    <ArtCard id={a.id} variant={v} />
                  </button>
                );
              })}
            </div>

            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">
                Tier ladder
              </div>
              <div className="space-y-2">
                {a.tiers.map((t) => (
                  <div
                    key={t.tier}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40 px-3 py-2"
                  >
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold text-white"
                        style={{
                          background:
                            t.tier === 1 ? '#6b7280' : t.tier === 2 ? '#9333ea' : '#f59e0b',
                        }}
                      >
                        {t.tier}
                      </span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {t.name}
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        · {t.cost}
                      </span>
                    </div>
                    <div className="text-[12px] leading-snug text-zinc-700 dark:text-zinc-300 pl-7">
                      {t.effect}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">
                Notes
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[12px] text-zinc-700 dark:text-zinc-300">
                {a.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/60 p-4 text-[12px] font-mono text-zinc-700 dark:text-zinc-200">
          <div className="font-bold mb-1">Your picks</div>
          {ABILITIES.map((a) => (
            <div key={a.id}>
              {a.id}: {picks[a.id] ? `option ${picks[a.id]}` : '—'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
