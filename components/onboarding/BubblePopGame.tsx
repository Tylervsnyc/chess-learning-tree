'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';

const BLOCK_KEYS = ROOK_BLOCKS.map(b => `${b.x},${b.y}`);

const POP_QUIPS: Record<number, string> = {
  3: "Be careful. I'm vibe-coded.",
  6: "Okay that actually tickles.",
  10: "You know there's buttons down there, right?",
  15: "I'm going to run out of blocks at this rate.",
  20: "You've popped twenty of my blocks. We're past chess now.",
};

/** Tiny pop sound */
function playPopSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

interface PopState {
  /** "x,y" → timestamp when popped (for reform animation) */
  poppedAt: Map<string, number>;
  popCount: number;
  quip: string | null;
  /** Block key that subtly shrinks to invite a tap */
  teaseBlock: string | null;
}

export function useBubblePopGame() {
  const [state, setState] = useState<PopState>({
    poppedAt: new Map(),
    popCount: 0,
    quip: null,
    teaseBlock: null,
  });
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const quipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const teaseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Animation loop — checks if popped blocks should reform (4s)
  useEffect(() => {
    if (!activeRef.current) return;

    const tick = () => {
      const now = Date.now();
      setState(prev => {
        let changed = false;
        const next = new Map(prev.poppedAt);
        for (const [key, poppedTime] of next) {
          if (now - poppedTime > 4000) {
            next.delete(key);
            changed = true;
          }
        }
        return changed ? { ...prev, poppedAt: next } : prev;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state.popCount]); // restart loop when pops happen

  const start = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    // After 5s, pick a random block to subtly shrink as an invitation
    teaseTimerRef.current = setTimeout(() => {
      const pick = BLOCK_KEYS[Math.floor(Math.random() * BLOCK_KEYS.length)];
      setState(prev => ({ ...prev, teaseBlock: pick }));
    }, 5000);
  }, []);

  const onBlockTap = useCallback((x: number, y: number) => {
    if (!activeRef.current) return;
    const key = `${x},${y}`;

    setState(prev => {
      if (prev.poppedAt.has(key)) return prev; // already popped, ignore

      const next = new Map(prev.poppedAt);
      next.set(key, Date.now());
      const newCount = prev.popCount + 1;
      const quip = POP_QUIPS[newCount] || null;

      return { poppedAt: next, popCount: newCount, quip: quip || prev.quip, teaseBlock: null };
    });

    playPopSound();

    // Clear quip after display
    if (quipTimerRef.current) clearTimeout(quipTimerRef.current);
    quipTimerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, quip: null }));
    }, 4000);
  }, []);

  // Build the reform progress map: "x,y" → 0 (just popped) to 1 (fully reformed)
  const getReformProgress = useCallback((): Map<string, number> => {
    const now = Date.now();
    const progress = new Map<string, number>();
    for (const [key, poppedTime] of state.poppedAt) {
      const elapsed = now - poppedTime;
      progress.set(key, Math.min(1, elapsed / 4000));
    }
    return progress;
  }, [state.poppedAt]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (quipTimerRef.current) clearTimeout(quipTimerRef.current);
      if (teaseTimerRef.current) clearTimeout(teaseTimerRef.current);
    };
  }, []);

  return {
    poppedAt: state.poppedAt,
    getReformProgress,
    popCount: state.popCount,
    popQuip: state.quip,
    teaseBlock: state.teaseBlock,
    onBlockTap,
    start,
  };
}
