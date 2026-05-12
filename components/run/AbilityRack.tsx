'use client';

import { useEffect, useRef, useState } from 'react';
import {
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
  if (abilities.length === 0) {
    return (
      <div className="text-center text-[11px] text-chess-text-faint italic">
        Fill the tempo meter to earn abilities.
      </div>
    );
  }

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
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1 -mx-1 px-1">
        {abilities.map((a) => (
          <RackEntry
            key={a.id}
            ability={a}
            active={activeId === a.id}
            onActivate={() => onActivate(a.id)}
          />
        ))}
      </div>
    </>
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
