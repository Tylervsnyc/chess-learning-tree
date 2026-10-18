'use client';

import { useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { KNICKS_ROOK_BLOCKS, KNICKS_BLUE } from '@/lib/knicks-finals';
import type { RookBlock } from '@/lib/daily-rook-blocks';
import { FAN_PRESETS, FAN_KNICKS_LINE, FAN_SWITCH_LINE } from '../script';
import type { Stage } from '../stage';

/** Any two team colors, laid out in the same pattern as the shipped Knicks jersey. */
function teamBlocks(primary: string, secondary: string): RookBlock[] {
  return KNICKS_ROOK_BLOCKS.map((b) => ({ ...b, color: b.color === KNICKS_BLUE ? primary : secondary }));
}

export function FanColors({ stage }: { stage: Stage }) {
  const [active, setActive] = useState<string | null>(null);
  const [primary, setPrimary] = useState('#00843D');
  const [secondary, setSecondary] = useState('#FFCD00');

  const wear = (id: string, blocks: RookBlock[], line: string) => {
    setActive(id);
    stage.setLook('neutral');
    stage.dressUp(blocks);
    stage.say(line);
  };

  const tile = (selected: boolean) =>
    `bg-white rounded-2xl p-4 flex flex-col items-center gap-2 min-h-[44px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition ${
      selected ? 'ring-2 ring-chess-text' : 'hover:-translate-y-0.5'
    }`;

  return (
    <>
      {/* The real one */}
      <button onClick={() => wear('knicks', KNICKS_ROOK_BLOCKS, FAN_KNICKS_LINE)} className={`${tile(active === 'knicks')} w-full sm:flex-row sm:gap-5 sm:text-left`}>
        <BreathingRook size="md" blocks={KNICKS_ROOK_BLOCKS} animate />
        <span>
          <span className="block font-black text-lg">Knicks Rookie</span>
          <span className="block text-sm text-chess-text-muted">
            Shipped for the 2026 NBA Finals: orange-and-blue Rookie on the Play and Welcome screens, with a Knicks voice pack.
          </span>
          <span className="mt-2 inline-block text-sm font-bold text-chess-blue">Watch Rookie change →</span>
        </span>
      </button>

      <p className="mt-6 text-xs font-bold uppercase tracking-wider text-chess-text-faint">Any team&apos;s colors</p>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {FAN_PRESETS.map((p) => {
          const b = teamBlocks(p.primary, p.secondary);
          return (
            <button key={p.name} onClick={() => wear(p.name, b, FAN_SWITCH_LINE)} className={tile(active === p.name)}>
              <BreathingRook size="sm" blocks={b} />
              <span className="text-sm font-bold">{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Build your own */}
      <div className="mt-6 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)] flex flex-wrap items-center gap-4">
        <BreathingRook size="sm" blocks={teamBlocks(primary, secondary)} />
        <label className="flex items-center gap-2 text-sm font-bold min-h-[44px]">
          <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="w-11 h-11 rounded-lg cursor-pointer" />
          Main
        </label>
        <label className="flex items-center gap-2 text-sm font-bold min-h-[44px]">
          <input type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="w-11 h-11 rounded-lg cursor-pointer" />
          Accent
        </label>
        <button
          onClick={() => wear('custom', teamBlocks(primary, secondary), FAN_SWITCH_LINE)}
          className="min-h-[48px] px-5 rounded-2xl bg-chess-blue text-white font-bold shadow-[0_4px_0_var(--color-chess-blue-shadow)] active:translate-y-[2px]"
        >
          Dress Rookie
        </button>
      </div>

      <button
        onClick={() => { setActive(null); stage.dressUp(null); }}
        className="mt-4 min-h-[44px] text-sm font-bold text-chess-text-muted hover:text-chess-text"
      >
        Back to Rookie&apos;s own colors
      </button>
    </>
  );
}
