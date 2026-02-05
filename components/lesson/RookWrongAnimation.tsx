'use client';

import React, { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

/**
 * ChessPath Rook Wrong Animation Component
 *
 * Disassembly animations for wrong answers.
 * Shows the rook falling apart when user gets an answer wrong.
 *
 * Animation Styles Available:
 * - powerDown: Quick flicker then blocks go dark
 * - shortCircuit: Sparks fly, blocks flash and fall
 * - pixelFade: Blocks randomly flicker and fade out
 * - shrink: Blocks collapse to center
 * - signalLoss: Glitchy RGB effect, blocks disappear
 */

interface Block {
  x: number;
  y: number;
  color: string;
}

// The 22 blocks that form the rook
const BLOCKS: Block[] = [
  { x: 8, y: 98, color: '#2FCBEF' }, { x: 26, y: 98, color: '#A560E8' }, { x: 44, y: 98, color: '#58CC02' }, { x: 62, y: 98, color: '#FFC800' }, { x: 80, y: 98, color: '#FF9600' },
  { x: 26, y: 80, color: '#FF6B6B' }, { x: 44, y: 80, color: '#FF4B4B' }, { x: 62, y: 80, color: '#1CB0F6' },
  { x: 26, y: 62, color: '#58CC02' }, { x: 44, y: 62, color: '#FFC800' }, { x: 62, y: 62, color: '#FF9600' },
  { x: 26, y: 44, color: '#1CB0F6' }, { x: 44, y: 44, color: '#2FCBEF' }, { x: 62, y: 44, color: '#A560E8' },
  { x: 8, y: 26, color: '#58CC02' }, { x: 26, y: 26, color: '#FFC800' }, { x: 44, y: 26, color: '#FF9600' }, { x: 62, y: 26, color: '#FF6B6B' }, { x: 80, y: 26, color: '#FF4B4B' },
  { x: 8, y: 8, color: '#1CB0F6' }, { x: 44, y: 8, color: '#2FCBEF' }, { x: 80, y: 8, color: '#A560E8' },
];

// Rows for row-based animations (top to bottom)
const ROWS = [
  [19, 20, 21],           // Crown points
  [14, 15, 16, 17, 18],   // Crown rim
  [11, 12, 13],           // Head
  [8, 9, 10],             // Neck
  [5, 6, 7],              // Body
  [0, 1, 2, 3, 4]         // Foundation
];

export type WrongAnimationStyle =
  | 'powerDown'
  | 'shortCircuit'
  | 'pixelFade'
  | 'shrink'
  | 'signalLoss';

export const WRONG_ANIMATION_STYLES: Record<WrongAnimationStyle, { name: string; emoji: string; color: string; description: string }> = {
  powerDown: { name: 'Power Down', emoji: '🔌', color: '#FF6B6B', description: 'Quick flicker then blocks go dark' },
  shortCircuit: { name: 'Short Circuit', emoji: '⚡', color: '#FFC800', description: 'Sparks fly, blocks flash and fall' },
  pixelFade: { name: 'Pixel Fade', emoji: '📺', color: '#A560E8', description: 'Blocks randomly flicker and fade' },
  shrink: { name: 'Shrink', emoji: '🎯', color: '#1CB0F6', description: 'Blocks collapse to center' },
  signalLoss: { name: 'Signal Loss', emoji: '📡', color: '#FF4B4B', description: 'Glitchy RGB effect' },
};

export interface RookWrongAnimationProps {
  style?: WrongAnimationStyle;
  onComplete?: () => void;
  scale?: number;
  visibleStages?: number; // How many stages of the rook are visible (0-6)
  compact?: boolean; // Remove margins for tight spaces
}

export interface RookWrongAnimationRef {
  triggerAnimation: () => void;
  reset: () => void;
  showFull: () => void;
}

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export const RookWrongAnimation = forwardRef<RookWrongAnimationRef, RookWrongAnimationProps>(
  function RookWrongAnimation(
    {
      style = 'powerDown',
      onComplete,
      scale = 1.6,
      visibleStages = 6,
      compact = false,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const fxRef = useRef<HTMLDivElement>(null);
    const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rookRef = useRef<HTMLDivElement>(null);

    // Get visible block indices based on stages
    const getVisibleIndices = useCallback(() => {
      const stageBlocks = [
        [0, 1, 2, 3, 4],       // Stage 1: Foundation
        [5, 6, 7],             // Stage 2: Body
        [8, 9, 10],            // Stage 3: Neck
        [11, 12, 13],          // Stage 4: Head
        [14, 15, 16, 17, 18],  // Stage 5: Crown Rim
        [19, 20, 21],          // Stage 6: Crown Points
      ];
      const visible: number[] = [];
      for (let i = 0; i < visibleStages; i++) {
        visible.push(...stageBlocks[i]);
      }
      return visible;
    }, [visibleStages]);

    const reset = useCallback(() => {
      const visible = getVisibleIndices();
      blockRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = visible.includes(i) ? '1' : '0';
        el.style.transform = '';
        el.style.transition = '';
        el.style.filter = '';
        el.style.backgroundColor = BLOCKS[i].color;
        el.style.boxShadow = 'none';
      });
      if (rookRef.current) {
        rookRef.current.style.filter = '';
      }
      if (fxRef.current) {
        fxRef.current.innerHTML = '';
      }
    }, [getVisibleIndices]);

    const showFull = useCallback(() => {
      blockRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = '';
        el.style.transition = '';
        el.style.filter = '';
        el.style.backgroundColor = BLOCKS[i].color;
        el.style.boxShadow = 'none';
      });
      if (rookRef.current) {
        rookRef.current.style.filter = '';
      }
    }, []);

    // Animation: Power Down
    const animPowerDown = useCallback(async () => {
      const visible = getVisibleIndices();
      if (visible.length === 0) return;

      // Quick flicker
      for (let f = 0; f < 2; f++) {
        if (rookRef.current) rookRef.current.style.filter = 'brightness(0.3)';
        await wait(60);
        if (rookRef.current) rookRef.current.style.filter = '';
        await wait(60);
      }

      await wait(150);

      // Power down blocks in quick batches
      const order = [...visible].sort(() => Math.random() - 0.5);

      for (let i = 0; i < order.length; i += 3) {
        const batch = order.slice(i, i + 3);

        for (const idx of batch) {
          const el = blockRefs.current[idx];
          if (!el) continue;
          el.style.transition = 'none';
          el.style.filter = 'brightness(2)';
        }

        await wait(30);

        for (const idx of batch) {
          const el = blockRefs.current[idx];
          if (!el) continue;
          el.style.transition = 'all 0.2s ease-out';
          el.style.filter = 'brightness(0.1) saturate(0)';
          el.style.boxShadow = 'none';
        }

        await wait(50);
      }
    }, [getVisibleIndices]);

    // Animation: Short Circuit
    const animShortCircuit = useCallback(async () => {
      const visible = getVisibleIndices();
      if (visible.length === 0) return;

      const spark = (x: number, y: number) => {
        if (!fxRef.current || !containerRef.current) return;
        const s = document.createElement('div');
        s.style.cssText = `
          position: absolute;
          left: ${x}px; top: ${y}px;
          width: 4px; height: 4px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 10px #fff, 0 0 20px #ff0;
          pointer-events: none;
        `;
        fxRef.current.appendChild(s);
        const angle = rand(0, Math.PI * 2);
        s.animate([
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${Math.cos(angle) * 30}px, ${Math.sin(angle) * 30}px) scale(0)`, opacity: 0 }
        ], { duration: 300 }).onfinish = () => s.remove();
      };

      for (let r = 0; r < ROWS.length; r++) {
        const rowBlocks = ROWS[r].filter(i => visible.includes(i));
        if (rowBlocks.length === 0) continue;

        // Sparks
        for (let i = 0; i < 5; i++) {
          spark(rand(30, 70), rand(20 + r * 15, 40 + r * 15));
        }

        await wait(80);

        for (const idx of rowBlocks) {
          const el = blockRefs.current[idx];
          if (!el) continue;
          el.style.transition = 'none';
          el.style.backgroundColor = '#fff';
          el.style.boxShadow = '0 0 20px #fff';
        }

        await wait(60);

        for (const idx of rowBlocks) {
          const el = blockRefs.current[idx];
          if (!el) continue;
          el.style.transition = 'all 0.3s ease-in';
          el.style.backgroundColor = '#333';
          el.style.boxShadow = 'none';
          el.style.transform = `translateY(${150 - BLOCKS[idx].y}px)`;
          el.style.opacity = '0.2';
        }

        await wait(120);
      }
    }, [getVisibleIndices]);

    // Animation: Pixel Fade
    const animPixelFade = useCallback(async () => {
      const visible = getVisibleIndices();
      if (visible.length === 0) return;

      const order = [...visible].sort(() => Math.random() - 0.5);

      for (const idx of order) {
        const el = blockRefs.current[idx];
        if (!el) continue;

        el.style.transition = 'opacity 0.08s';
        el.style.opacity = '0.5';
        await wait(30);
        el.style.opacity = '1';
        await wait(30);
        el.style.opacity = '0.3';
        await wait(30);

        el.style.transition = 'opacity 0.25s ease-out';
        el.style.opacity = '0';

        await wait(50);
      }
    }, [getVisibleIndices]);

    // Animation: Shrink
    const animShrink = useCallback(async () => {
      const visible = getVisibleIndices();
      if (visible.length === 0) return;

      const centerX = 44;
      const centerY = 53;

      const sortedByDist = [...visible].sort((a, b) => {
        const distA = Math.hypot(BLOCKS[a].x - centerX, BLOCKS[a].y - centerY);
        const distB = Math.hypot(BLOCKS[b].x - centerX, BLOCKS[b].y - centerY);
        return distA - distB;
      });

      for (const idx of sortedByDist) {
        const el = blockRefs.current[idx];
        if (!el) continue;

        el.style.transition = 'all 0.25s cubic-bezier(0.55, 0.055, 0.675, 0.19)';
        el.style.transform = 'scale(0)';
        el.style.opacity = '0';

        await wait(45);
      }
    }, [getVisibleIndices]);

    // Animation: Signal Loss
    const animSignalLoss = useCallback(async () => {
      const visible = getVisibleIndices();
      if (visible.length === 0) return;

      for (let pass = 0; pass < 4; pass++) {
        const flickerCount = 5 + pass * 3;
        const available = visible.filter(i => {
          const el = blockRefs.current[i];
          return el && el.style.opacity !== '0';
        });
        const toFlicker = available.sort(() => Math.random() - 0.5).slice(0, flickerCount);

        for (const idx of toFlicker) {
          const el = blockRefs.current[idx];
          if (!el) continue;
          el.style.transition = 'none';
          el.style.filter = 'brightness(3) saturate(0)';
        }

        if (rookRef.current) {
          rookRef.current.style.filter = pass % 2 === 0 ?
            'drop-shadow(2px 0 0 red) drop-shadow(-2px 0 0 cyan)' : '';
        }

        await wait(60);

        for (const idx of toFlicker) {
          const el = blockRefs.current[idx];
          if (!el) continue;
          if (Math.random() > 0.5 - pass * 0.12) {
            el.style.transition = 'opacity 0.15s';
            el.style.opacity = '0';
            el.style.filter = '';
          } else {
            el.style.filter = '';
          }
        }

        await wait(150);
      }

      if (rookRef.current) {
        rookRef.current.style.filter = '';
      }

      blockRefs.current.forEach((el, i) => {
        if (!el || !visible.includes(i)) return;
        if (el.style.opacity !== '0') {
          el.style.transition = 'opacity 0.2s';
          el.style.opacity = '0';
        }
      });
    }, [getVisibleIndices]);

    const animations: Record<WrongAnimationStyle, () => Promise<void>> = {
      powerDown: animPowerDown,
      shortCircuit: animShortCircuit,
      pixelFade: animPixelFade,
      shrink: animShrink,
      signalLoss: animSignalLoss,
    };

    const triggerAnimation = useCallback(async () => {
      reset();
      await wait(100);
      const animFn = animations[style] || animations.powerDown;
      await animFn();
      onComplete?.();
    }, [style, reset, onComplete, animations]);

    useImperativeHandle(ref, () => ({
      triggerAnimation,
      reset,
      showFull,
    }), [triggerAnimation, reset, showFull]);

    const visible = getVisibleIndices();

    return (
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '94px',
          height: '112px',
          transform: `scale(${scale})`,
          margin: compact ? '0' : '20px 0'
        }}
      >
        <div ref={rookRef} style={{ width: '100%', height: '100%' }}>
          {BLOCKS.map((block, i) => (
            <div
              key={i}
              ref={el => { blockRefs.current[i] = el; }}
              style={{
                position: 'absolute',
                width: '14px',
                height: '14px',
                borderRadius: '2px',
                left: `${block.x}px`,
                top: `${block.y}px`,
                backgroundColor: block.color,
                boxShadow: 'none',
                opacity: visible.includes(i) ? 1 : 0,
              }}
            />
          ))}
        </div>
        <div
          ref={fxRef}
          style={{ position: 'absolute', inset: '-50px', pointerEvents: 'none', overflow: 'visible' }}
        />
      </div>
    );
  }
);
