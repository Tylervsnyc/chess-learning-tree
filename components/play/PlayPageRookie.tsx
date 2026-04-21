'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { InteractiveRook, type InteractiveModeId } from '@/components/ui/InteractiveRook';
import { LEARN_TAP_REACTIONS } from '@/data/quips/learn-tap-quips';
import { ShuffleBag } from '@/lib/shuffle-bag';

function createModeBag() {
  return new ShuffleBag(LEARN_TAP_REACTIONS.map(r => r.mode));
}

function createQuipBags() {
  const bags = new Map<InteractiveModeId, ShuffleBag<string>>();
  for (const reaction of LEARN_TAP_REACTIONS) {
    bags.set(reaction.mode, new ShuffleBag(reaction.quips));
  }
  return bags;
}

interface PlayPageRookieProps {
  onQuip?: (quip: string) => void;
}

export function PlayPageRookie({ onQuip }: PlayPageRookieProps) {
  const modeBagRef = useRef(createModeBag());
  const quipBagsRef = useRef(createQuipBags());

  // One random mode per visit. Deferred to after mount so SSR and first client
  // render match (otherwise server and client draw different modes → hydration
  // mismatch on InteractiveRook's brightness filter).
  const [mode, setMode] = useState<InteractiveModeId | null>(null);
  useEffect(() => {
    setMode(modeBagRef.current.draw());
  }, []);
  const quipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const quipsUsedRef = useRef(0);
  const MAX_QUIPS_PER_MODE = 3;

  const handleInteraction = useCallback(() => {
    if (!mode) return;
    if (quipsUsedRef.current >= MAX_QUIPS_PER_MODE) return;
    if (quipTimerRef.current) return;

    const bag = quipBagsRef.current.get(mode);
    if (!bag) return;

    quipsUsedRef.current += 1;
    const newQuip = bag.draw();
    onQuip?.(newQuip);

    quipTimerRef.current = setTimeout(() => {
      quipTimerRef.current = null;
    }, 4000);
  }, [mode, onQuip]);

  useEffect(() => {
    return () => {
      if (quipTimerRef.current) clearTimeout(quipTimerRef.current);
    };
  }, []);

  return (
    <div
      onPointerDown={handleInteraction}
      className="my-1"
    >
      {mode && <InteractiveRook mode={mode} blockSize={24} />}
    </div>
  );
}
