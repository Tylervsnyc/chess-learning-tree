'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { InteractiveRook, type InteractiveModeId } from '@/components/ui/InteractiveRook';
import { LEARN_TAP_REACTIONS } from '@/data/quips/learn-tap-quips';
import { ShuffleBag } from '@/lib/shuffle-bag';

// ─── Shuffle Bags ───
// Outer bag: cycles through all 12 effects before repeating
// Inner bags: cycles through quips per effect

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

const MODE_LABELS = new Map(LEARN_TAP_REACTIONS.map(r => [r.mode, r.label]));

interface PlayPageRookieProps {
  /** Callback when user taps — parent can use for quip override */
  onQuip?: (quip: string) => void;
}

export function PlayPageRookie({ onQuip }: PlayPageRookieProps) {
  const modeBagRef = useRef(createModeBag());
  const quipBagsRef = useRef(createQuipBags());

  const [mode, setMode] = useState<InteractiveModeId>(() => modeBagRef.current.draw());
  const quipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const quipsUsedRef = useRef(0); // how many quips shown for current mode
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_QUIPS_PER_MODE = 3;

  // Show a quip on interaction — up to 3 per mode
  const handleInteraction = useCallback(() => {
    if (quipsUsedRef.current >= MAX_QUIPS_PER_MODE) return;
    // Debounce: ignore taps while a quip is still showing
    if (quipTimerRef.current) return;

    const bag = quipBagsRef.current.get(mode);
    if (!bag) return;

    quipsUsedRef.current += 1;
    const newQuip = bag.draw();
    onQuip?.(newQuip);

    // Lock out next quip until this one clears
    quipTimerRef.current = setTimeout(() => {
      quipTimerRef.current = null;
    }, 4000);
  }, [mode, onQuip]);

  // Shuffle to next mode
  const shuffle = useCallback(() => {
    quipsUsedRef.current = 0;
    if (quipTimerRef.current) {
      clearTimeout(quipTimerRef.current);
      quipTimerRef.current = null;
    }
    setMode(modeBagRef.current.draw());
  }, []);

  // Auto-shuffle after 20s of no interaction
  useEffect(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      shuffle();
    }, 20000);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [mode, shuffle]);

  useEffect(() => {
    return () => {
      if (quipTimerRef.current) clearTimeout(quipTimerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Interactive Rook — sized to match BreathingRook lg */}
      <div
        onPointerDown={handleInteraction}
        className="relative my-1"
      >
        <InteractiveRook mode={mode} blockSize={24} />
      </div>

      {/* Mode label + shuffle */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] text-chess-text-muted/40 uppercase tracking-wider font-medium">
          {MODE_LABELS.get(mode) || mode}
        </span>
        <button
          onClick={shuffle}
          className="text-[10px] text-chess-text-muted/25 hover:text-chess-text-muted/60 transition-colors uppercase tracking-wider"
          aria-label="Shuffle effect"
        >
          shuffle
        </button>
      </div>
    </div>
  );
}
