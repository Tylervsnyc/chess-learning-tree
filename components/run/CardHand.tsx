'use client';

import { CARD_DEFS, HAND_SIZE, type CardId } from '@/lib/run/cards';
import { CardIcon } from './CardIcon';

interface CardHandProps {
  hand: CardId[];
  onPlay?: (slotIndex: number) => void;
  /** Slot index currently in targeting mode; rendered with an active style. */
  activeSlot?: number | null;
}

export function CardHand({ hand, onPlay, activeSlot = null }: CardHandProps) {
  const slots = Array.from({ length: HAND_SIZE }, (_, i) => hand[i] ?? null);

  return (
    <div className="flex gap-2">
      {slots.map((cardId, i) => (
        <CardSlot
          key={i}
          cardId={cardId}
          active={activeSlot === i}
          onClick={cardId && onPlay ? () => onPlay(i) : undefined}
        />
      ))}
    </div>
  );
}

interface CardSlotProps {
  cardId: CardId | null;
  active?: boolean;
  onClick?: () => void;
}

function CardSlot({ cardId, active = false, onClick }: CardSlotProps) {
  if (!cardId) {
    return (
      <div className="flex-1 h-9 rounded-lg border border-dashed border-chess-text/15 bg-chess-surface/40" />
    );
  }

  const def = CARD_DEFS[cardId];
  return (
    <button
      type="button"
      onClick={onClick}
      title={def.blurb}
      className={`flex-1 h-9 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-950/40 shadow-sm px-2 flex items-center justify-center gap-1.5 text-indigo-700 dark:text-indigo-300 active:scale-[0.97] transition-transform border ${active ? 'border-amber-400 ring-2 ring-amber-300/60' : 'border-indigo-300 dark:border-indigo-700'}`}
    >
      <CardIcon cardId={cardId} size={16} />
      <div className="text-xs font-black text-chess-text leading-none">
        {def.name}
      </div>
    </button>
  );
}
