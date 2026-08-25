'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { InteractiveRook, type InteractiveModeId } from '@/components/ui/InteractiveRook';
import { LEARN_TAP_REACTIONS } from '@/data/quips/learn-tap-quips';
import { ShuffleBag } from '@/lib/shuffle-bag';
import { useDailyWorkout } from '@/hooks/useDailyWorkout';
import { isKnicksTime, KNICKS_ROOK_BLOCKS } from '@/lib/knicks-finals';

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

// Nudge lines surfaced when the player has already logged today's Play pillar
// but still owes Learn or Run. Used on the first tap, then we fall back to the
// generic mood pool so it doesn't feel preachy.
const WORKOUT_NUDGE_LEARN = [
  "Game's logged. Want to see what cost you that knight? Learn has it.",
  "Nice. Learn's quick — same energy, fewer surprises.",
  "Play, done. The Learn tab has a lesson with your name on it. Loosely.",
];

interface PlayPageRookieProps {
  onQuip?: (quip: string) => void;
  /** Override pool (e.g. boxing quips in the Chess Boxing shell). When set,
      taps draw ONLY from this bag — no mood pools, no workout nudges. */
  quipPool?: readonly string[];
  /** Extra classes on the tap target (the /play setup screen re-enables
      pointer events here — its content layer is pass-through so the gym
      bags behind it stay punchable). */
  className?: string;
}

export function PlayPageRookie({ onQuip, quipPool, className = '' }: PlayPageRookieProps) {
  const modeBagRef = useRef(createModeBag());
  const quipBagsRef = useRef(createQuipBags());
  const nudgeBagRef = useRef<ShuffleBag<string> | null>(null);
  const poolBagRef = useRef<ShuffleBag<string> | null>(null);

  const { status } = useDailyWorkout();

  // One random mode per visit. Deferred to after mount so SSR and first client
  // render match (otherwise server and client draw different modes → hydration
  // mismatch on InteractiveRook's brightness filter).
  const [mode, setMode] = useState<InteractiveModeId | null>(null);
  useEffect(() => {
    setMode(modeBagRef.current.draw());
  }, []);
  const quipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const quipsUsedRef = useRef(0);
  const nudgesUsedRef = useRef(0);
  const MAX_QUIPS_PER_MODE = 3;
  const MAX_NUDGES = 1;

  // Lazily build the nudge bag from the current pillar state so each tap reads
  // fresh status (player might finish Learn in another tab).
  const pickNudgePool = useCallback(() => {
    if (!status.play) return null;
    if (status.tactics) return null;
    return WORKOUT_NUDGE_LEARN;
  }, [status.play, status.tactics]);

  const handleInteraction = useCallback(() => {
    if (!mode) return;
    if (quipTimerRef.current) return;

    // Override pool (boxing shell): draw from it and skip everything else.
    if (quipPool && quipPool.length > 0) {
      if (!poolBagRef.current) poolBagRef.current = new ShuffleBag([...quipPool]);
      onQuip?.(poolBagRef.current.draw());
      quipTimerRef.current = setTimeout(() => {
        quipTimerRef.current = null;
      }, 4000);
      return;
    }

    let newQuip: string | null = null;

    // First tap (or first eligible tap): try a workout nudge.
    if (nudgesUsedRef.current < MAX_NUDGES) {
      const pool = pickNudgePool();
      if (pool) {
        if (!nudgeBagRef.current) nudgeBagRef.current = new ShuffleBag(pool);
        newQuip = nudgeBagRef.current.draw();
        nudgesUsedRef.current += 1;
      }
    }

    // Fall back to the mood pool.
    if (!newQuip) {
      if (quipsUsedRef.current >= MAX_QUIPS_PER_MODE) return;
      const bag = quipBagsRef.current.get(mode);
      if (!bag) return;
      quipsUsedRef.current += 1;
      newQuip = bag.draw();
    }

    onQuip?.(newQuip);

    quipTimerRef.current = setTimeout(() => {
      quipTimerRef.current = null;
    }, 4000);
  }, [mode, onQuip, pickNudgePool, quipPool]);

  useEffect(() => {
    return () => {
      if (quipTimerRef.current) clearTimeout(quipTimerRef.current);
    };
  }, []);

  return (
    <div
      onPointerDown={handleInteraction}
      className={`my-1 ${className}`}
    >
      {mode && <InteractiveRook mode={mode} blockSize={24} blocks={isKnicksTime() ? KNICKS_ROOK_BLOCKS : undefined} />}
    </div>
  );
}
