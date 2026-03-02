'use client';

import React, { useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { ROOK_BLOCKS_PIXEL, getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';

/**
 * ChessPath Rook Celebration Animation Component
 *
 * Celebration animations for lesson completion.
 * Shows the rook with celebratory effects when user completes a lesson.
 * Uses matte gradient brand styling on all blocks.
 *
 * Animation Styles Available:
 * - sparkleBurst: Solid particles burst from each block
 * - wave: Blocks pop up in sequence
 * - pulse: Blocks scale outward from center with ring
 * - ripple: Blocks ripple outward from center
 * - cascade: Blocks light up diagonally
 * - bloom: Blocks expand outward then snap back
 * - radiate: Solid lines shoot outward
 */

// Use the shared rook block pixel data (same source as AnimatedLogo, BreathingRook, etc.)
const BLOCKS = ROOK_BLOCKS_PIXEL;

// Unique colors extracted from block data for particle effects
const COLORS = [...new Set(ROOK_BLOCKS_PIXEL.map(b => b.color))];

export type CelebrationAnimationStyle =
  | 'sparkleBurst'
  | 'wave'
  | 'pulse'
  | 'ripple'
  | 'cascade'
  | 'bloom'
  | 'radiate';

export const CELEBRATION_ANIMATION_STYLES: Record<CelebrationAnimationStyle, { name: string; color: string; description: string }> = {
  sparkleBurst: { name: 'Sparkle Burst', color: '#FFC800', description: 'Solid particles burst from blocks' },
  wave: { name: 'Wave', color: '#58CC02', description: 'Blocks pop up in sequence' },
  pulse: { name: 'Pulse', color: '#A560E8', description: 'Blocks scale from center' },
  ripple: { name: 'Ripple', color: '#FF9600', description: 'Blocks ripple from center' },
  cascade: { name: 'Cascade', color: '#FF6B6B', description: 'Blocks light up diagonally' },
  bloom: { name: 'Bloom', color: '#58CC02', description: 'Blocks expand and snap back' },
  radiate: { name: 'Radiate', color: '#FFC800', description: 'Lines shoot outward' },
};

export interface RookCelebrationAnimationProps {
  style?: CelebrationAnimationStyle;
  onComplete?: () => void;
  scale?: number;
  autoPlay?: boolean;
  loop?: boolean;
}

export interface RookCelebrationAnimationRef {
  triggerAnimation: () => void;
  reset: () => void;
}

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export const RookCelebrationAnimation = forwardRef<RookCelebrationAnimationRef, RookCelebrationAnimationProps>(
  function RookCelebrationAnimation(
    {
      style = 'sparkleBurst',
      onComplete,
      scale = 1.4,
      autoPlay = true,
      loop = false,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const fxRef = useRef<HTMLDivElement>(null);
    const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rookRef = useRef<HTMLDivElement>(null);
    const isAnimatingRef = useRef(false);

    const reset = useCallback(() => {
      blockRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = '';
        el.style.transition = '';
        el.style.filter = '';
        el.style.left = `${BLOCKS[i].x}px`;
        el.style.top = `${BLOCKS[i].y}px`;
        el.style.background = getMatteBackground(BLOCKS[i].color);
        el.style.boxShadow = getMatteBoxShadow(BLOCKS[i].color);
      });
      if (rookRef.current) {
        rookRef.current.style.transform = '';
        rookRef.current.style.transition = '';
        rookRef.current.style.filter = '';
      }
      if (fxRef.current) {
        fxRef.current.innerHTML = '';
      }
    }, []);

    // Animation: Sparkle Burst
    const animSparkleBurst = useCallback(async () => {
      reset();
      await wait(200);

      for (let i = 0; i < blockRefs.current.length; i++) {
        setTimeout(() => {
          const el = blockRefs.current[i];
          if (!el || !fxRef.current) return;

          const blockX = BLOCKS[i].x + 7;
          const blockY = BLOCKS[i].y + 7;

          // Solid square particles
          for (let s = 0; s < 4; s++) {
            const spark = document.createElement('div');
            const size = rand(4, 7);
            spark.style.cssText = `
              position: absolute;
              left: ${blockX}px; top: ${blockY}px;
              width: ${size}px; height: ${size}px;
              background: ${BLOCKS[i].color};
              border-radius: 1px;
              pointer-events: none;
            `;
            fxRef.current.appendChild(spark);

            const angle = rand(0, Math.PI * 2);
            const dist = rand(25, 55);

            spark.animate([
              { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
              { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0.3) rotate(180deg)`, opacity: 0 }
            ], { duration: rand(300, 450) }).onfinish = () => spark.remove();
          }

          // Pop the block
          el.style.transition = 'transform 0.1s ease-out';
          el.style.transform = 'scale(1.3)';
          setTimeout(() => {
            el.style.transition = 'transform 0.15s ease-in';
            el.style.transform = '';
          }, 100);
        }, i * 50);
      }

      await wait(blockRefs.current.length * 50 + 200);
    }, [reset]);

    // Animation: Wave
    const animWave = useCallback(async () => {
      reset();
      await wait(200);

      for (let wave = 0; wave < 3; wave++) {
        for (let i = 0; i < blockRefs.current.length; i++) {
          const el = blockRefs.current[i];
          if (!el) continue;

          setTimeout(() => {
            el.style.transition = 'transform 0.15s ease-out';
            el.style.transform = 'translateY(-10px) scale(1.15)';

            setTimeout(() => {
              el.style.transition = 'transform 0.2s ease-in';
              el.style.transform = '';
            }, 150);
          }, i * 25);
        }

        await wait(22 * 25 + 250);
      }
    }, [reset]);

    // Animation: Pulse
    const animPulse = useCallback(async () => {
      reset();
      await wait(200);

      const centerX = 44;
      const centerY = 53;

      for (let pulse = 0; pulse < 3; pulse++) {
        // Ring expanding outward
        if (fxRef.current) {
          const ring = document.createElement('div');
          ring.style.cssText = `
            position: absolute;
            left: 47px; top: 53px;
            width: 10px; height: 10px;
            border: 3px solid rgba(88,204,2,0.6);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
          `;
          fxRef.current.appendChild(ring);

          ring.animate([
            { width: '10px', height: '10px', opacity: 0.8 },
            { width: '180px', height: '180px', opacity: 0 }
          ], { duration: 600 }).onfinish = () => ring.remove();
        }

        // Blocks scale based on distance
        const byDistance = [...Array(22).keys()].map(i => ({
          idx: i,
          dist: Math.hypot(BLOCKS[i].x - centerX, BLOCKS[i].y - centerY)
        })).sort((a, b) => a.dist - b.dist);

        for (const { idx, dist } of byDistance) {
          const el = blockRefs.current[idx];
          if (!el) continue;

          setTimeout(() => {
            el.style.transition = 'transform 0.15s ease-out';
            el.style.transform = 'scale(1.25)';

            setTimeout(() => {
              el.style.transition = 'transform 0.2s ease-in';
              el.style.transform = '';
            }, 150);
          }, dist * 2);
        }

        await wait(600);
      }
    }, [reset]);

    // Animation: Ripple
    const animRipple = useCallback(async () => {
      reset();
      await wait(200);

      const centerX = 44;
      const centerY = 53;

      const byDistance = [...Array(22).keys()].map(i => ({
        idx: i,
        dist: Math.hypot(BLOCKS[i].x - centerX, BLOCKS[i].y - centerY)
      })).sort((a, b) => a.dist - b.dist);

      for (let ripple = 0; ripple < 3; ripple++) {
        for (const { idx, dist } of byDistance) {
          const el = blockRefs.current[idx];
          if (!el) continue;

          setTimeout(() => {
            el.style.transition = 'transform 0.2s ease-out';
            el.style.transform = 'scale(1.25) translateY(-3px)';

            setTimeout(() => {
              el.style.transition = 'transform 0.25s ease-in';
              el.style.transform = '';
            }, 200);
          }, dist * 3);
        }

        await wait(450);
      }
    }, [reset]);

    // Animation: Cascade
    const animCascade = useCallback(async () => {
      reset();
      await wait(200);

      // Sort diagonally (top-left to bottom-right)
      const sorted = [...Array(22).keys()].sort((a, b) => {
        const sumA = BLOCKS[a].x + BLOCKS[a].y;
        const sumB = BLOCKS[b].x + BLOCKS[b].y;
        return sumA - sumB;
      });

      for (let cascade = 0; cascade < 2; cascade++) {
        for (let i = 0; i < sorted.length; i++) {
          const idx = sorted[i];
          const el = blockRefs.current[idx];
          if (!el) continue;

          setTimeout(() => {
            // Pop up
            el.style.transition = 'transform 0.12s ease-out';
            el.style.transform = 'scale(1.3) translateY(-5px)';

            // Small particle
            if (fxRef.current) {
              const blockX = BLOCKS[idx].x + 7;
              const blockY = BLOCKS[idx].y + 7;
              const spark = document.createElement('div');
              spark.style.cssText = `
                position: absolute;
                left: ${blockX}px; top: ${blockY}px;
                width: 5px; height: 5px;
                background: ${BLOCKS[idx].color};
                border-radius: 1px;
                pointer-events: none;
              `;
              fxRef.current.appendChild(spark);
              spark.animate([
                { transform: 'scale(1) translateY(0)', opacity: 1 },
                { transform: 'scale(0.5) translateY(-25px)', opacity: 0 }
              ], { duration: 250 }).onfinish = () => spark.remove();
            }

            setTimeout(() => {
              el.style.transition = 'transform 0.15s ease-in';
              el.style.transform = '';
            }, 120);
          }, i * 35);
        }

        await wait(sorted.length * 35 + 300);
      }
    }, [reset]);

    // Animation: Bloom
    const animBloom = useCallback(async () => {
      reset();
      await wait(200);

      const centerX = 44;
      const centerY = 53;

      // All blocks expand outward
      blockRefs.current.forEach((el, i) => {
        if (!el) return;
        const origX = BLOCKS[i].x;
        const origY = BLOCKS[i].y;
        const dx = (origX - centerX) * 0.35;
        const dy = (origY - centerY) * 0.35;

        setTimeout(() => {
          el.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
          el.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`;
        }, i * 15);
      });

      await wait(450);

      // Snap back with bounce
      blockRefs.current.forEach((el, i) => {
        if (!el) return;
        setTimeout(() => {
          el.style.transition = 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
          el.style.transform = '';
        }, i * 10);
      });

      await wait(350);

      // Quick pop
      blockRefs.current.forEach(el => {
        if (!el) return;
        el.style.transition = 'transform 0.1s ease-out';
        el.style.transform = 'scale(1.2)';
      });
      await wait(100);
      blockRefs.current.forEach(el => {
        if (!el) return;
        el.style.transition = 'transform 0.15s ease-in';
        el.style.transform = '';
      });
    }, [reset]);

    // Animation: Radiate
    const animRadiate = useCallback(async () => {
      reset();
      await wait(200);

      for (let burst = 0; burst < 2; burst++) {
        // Shoot rays outward
        if (fxRef.current) {
          for (let i = 0; i < 12; i++) {
            const ray = document.createElement('div');
            const angle = (i / 12) * Math.PI * 2;
            const length = rand(50, 80);

            ray.style.cssText = `
              position: absolute;
              left: 47px; top: 53px;
              width: ${length}px;
              height: 4px;
              background: ${COLORS[i % COLORS.length]};
              transform-origin: left center;
              transform: rotate(${angle}rad) scaleX(0);
              border-radius: 2px;
              pointer-events: none;
            `;
            fxRef.current.appendChild(ray);

            ray.animate([
              { transform: `rotate(${angle}rad) scaleX(0)`, opacity: 1 },
              { transform: `rotate(${angle}rad) scaleX(1)`, opacity: 1 },
              { transform: `rotate(${angle}rad) scaleX(1) translateX(30px)`, opacity: 0 }
            ], { duration: 400, easing: 'ease-out' }).onfinish = () => ray.remove();
          }
        }

        // Blocks pop
        blockRefs.current.forEach((el, i) => {
          if (!el) return;
          setTimeout(() => {
            el.style.transition = 'transform 0.1s ease-out';
            el.style.transform = 'scale(1.25)';
            setTimeout(() => {
              el.style.transition = 'transform 0.15s ease-in';
              el.style.transform = '';
            }, 100);
          }, i * 15);
        });

        await wait(500);
      }
    }, [reset]);

    const animations: Record<CelebrationAnimationStyle, () => Promise<void>> = {
      sparkleBurst: animSparkleBurst,
      wave: animWave,
      pulse: animPulse,
      ripple: animRipple,
      cascade: animCascade,
      bloom: animBloom,
      radiate: animRadiate,
    };

    const triggerAnimation = useCallback(async () => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      reset();
      await wait(100);
      const animFn = animations[style] || animations.sparkleBurst;
      await animFn();

      isAnimatingRef.current = false;
      onComplete?.();

      if (loop) {
        triggerAnimation();
      }
    }, [style, reset, onComplete, loop, animations]);

    useImperativeHandle(ref, () => ({
      triggerAnimation,
      reset,
    }), [triggerAnimation, reset]);

    // Auto-play on mount
    useEffect(() => {
      if (autoPlay) {
        triggerAnimation();
      }
    }, [autoPlay, triggerAnimation]);

    return (
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '94px',
          height: '112px',
          transform: `scale(${scale})`,
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
                background: getMatteBackground(block.color),
                boxShadow: getMatteBoxShadow(block.color),
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
