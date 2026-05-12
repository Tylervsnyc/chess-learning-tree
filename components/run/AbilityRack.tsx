'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MAX_OWNED_ABILITIES,
  type AbilityId,
  type AbilityTier,
  type OwnedAbility,
} from '@/lib/run/abilities';
import { AbilityCardMini } from './AbilityCard';

interface AbilityRackProps {
  abilities: OwnedAbility[];
  activeId: AbilityId | null;
  onActivate: (id: AbilityId) => void;
}

export function AbilityRack({
  abilities,
  activeId,
  onActivate,
}: AbilityRackProps) {
  const emptySlots = Math.max(0, MAX_OWNED_ABILITIES - abilities.length);

  return (
    <>
      <style>{`
        @keyframes abilityCardFlash {
          0%   { transform: scale(1); filter: brightness(1); box-shadow: 0 0 0 0 rgba(255,255,255,0); }
          15%  { transform: scale(1.1); filter: brightness(1.6); box-shadow: 0 0 24px 6px rgba(255,255,255,0.9); }
          50%  { transform: scale(1.05); filter: brightness(1.2); }
          100% { transform: scale(1); filter: brightness(1); box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
        .ability-card-flash { animation: abilityCardFlash 700ms ease-out; }
        .ability-card-active {
          transform: translateY(-3px) scale(1.04);
          filter: drop-shadow(0 0 6px rgba(251,191,36,0.85));
        }
      `}</style>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2 justify-center items-end pb-1">
          {abilities.map((a) => (
            <RackEntry
              key={a.id}
              ability={a}
              active={activeId === a.id}
              onActivate={() => onActivate(a.id)}
            />
          ))}
          {Array.from({ length: emptySlots }, (_, i) => (
            <EmptySlot key={`empty-${i}`} />
          ))}
        </div>
        <div className="text-center text-[10px] text-chess-text-faint font-bold uppercase tracking-wider leading-none">
          {abilities.length === 0
            ? 'Fill tempo to claim a power'
            : abilities.length >= MAX_OWNED_ABILITIES
              ? 'Rack full — fill tempo to upgrade'
              : `${abilities.length}/${MAX_OWNED_ABILITIES} powers · refills each level`}
        </div>
      </div>
    </>
  );
}

function EmptySlot() {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 rounded-[7px] border-2 border-dashed border-chess-text/15 flex items-center justify-center"
      style={{ width: 64, aspectRatio: '5 / 7' }}
    >
      <span className="text-chess-text/20 text-xl font-black select-none">+</span>
    </div>
  );
}

function RackEntry({
  ability,
  active,
  onActivate,
}: {
  ability: OwnedAbility;
  active: boolean;
  onActivate: () => void;
}) {
  const prevTierRef = useRef<AbilityTier>(ability.tier);
  const [flashing, setFlashing] = useState(false);
  useEffect(() => {
    if (prevTierRef.current !== ability.tier) {
      prevTierRef.current = ability.tier;
      setFlashing(true);
      const t = setTimeout(() => setFlashing(false), 720);
      return () => clearTimeout(t);
    }
  }, [ability.tier]);

  return (
    <AbilityCardMini
      ability={ability}
      active={active}
      flashing={flashing}
      onClick={onActivate}
    />
  );
}
