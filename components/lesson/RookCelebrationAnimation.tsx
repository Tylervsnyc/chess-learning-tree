'use client';

import React, { useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';

/**
 * ChessPath Rook Celebration Animation Component
 *
 * Celebration animations for lesson completion.
 * Shows the rook with celebratory effects when user completes a lesson.
 *
 * Animation Styles Available:
 * - sparkleBurst: Solid particles burst from each block
 * - wave: Blocks pop up in sequence
 * - levitate: Rook floats up with particles underneath
 * - pulse: Blocks scale outward from center with ring
 * - shimmer: Highlight bar passes through
 * - ripple: Blocks ripple outward from center
 * - cascade: Blocks light up diagonally
 * - orbit: Solid particles orbit around
 * - bloom: Blocks expand outward then snap back
 * - radiate: Solid lines shoot outward
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

const COLORS = ['#2FCBEF', '#A560E8', '#58CC02', '#FFC800', '#FF9600', '#FF6B6B', '#FF4B4B', '#1CB0F6'];

export type CelebrationAnimationStyle =
  | 'sparkleBurst'
  | 'wave'
  | 'levitate'
  | 'pulse'
  | 'shimmer'
  | 'ripple'
  | 'cascade'
  | 'orbit'
  | 'bloom'
  | 'radiate';

export const CELEBRATION_ANIMATION_STYLES: Record<CelebrationAnimationStyle, { name: string; color: string; description: string }> = {
  sparkleBurst: { name: 'Sparkle Burst', color: '#FFC800', description: 'Solid particles burst from blocks' },
  wave: { name: 'Wave', color: '#58CC02', description: 'Blocks pop up in sequence' },
  levitate: { name: 'Levitate', color: '#1CB0F6', description: 'Rook floats up with particles' },
  pulse: { name: 'Pulse', color: '#A560E8', description: 'Blocks scale from center' },
  shimmer: { name: 'Shimmer', color: '#2FCBEF', description: 'Highlight bar passes through' },
  ripple: { name: 'Ripple', color: '#FF9600', description: 'Blocks ripple from center' },
  cascade: { name: 'Cascade', color: '#FF6B6B', description: 'Blocks light up diagonally' },
  orbit: { name: 'Orbit', color: '#FF4B4B', description: 'Particles orbit around' },
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
        el.style.backgroundColor = BLOCKS[i].color;
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

    // Animation: Levitate
    const animLevitate = useCallback(async () => {
      reset();
      await wait(200);

      if (!rookRef.current || !fxRef.current) return;

      rookRef.current.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      rookRef.current.style.transform = 'translateY(-30px)';

      // Solid rising particles
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          if (!fxRef.current) return;
          const p = document.createElement('div');
          const size = rand(4, 8);
          const color = COLORS[Math.floor(rand(0, COLORS.length))];

          p.style.cssText = `
            position: absolute;
            left: ${rand(20, 80)}px;
            top: 120px;
            width: ${size}px; height: ${size}px;
            background: ${color};
            border-radius: 1px;
            pointer-events: none;
          `;
          fxRef.current.appendChild(p);

          p.animate([
            { transform: 'translateY(0) scale(1)', opacity: 0.9 },
            { transform: `translateY(-${rand(35, 65)}px) scale(0.4)`, opacity: 0 }
          ], { duration: rand(400, 600) }).onfinish = () => p.remove();
        }, i * 40);
      }

      await wait(800);

      // Gentle bob
      for (let bob = 0; bob < 2; bob++) {
        if (!rookRef.current) break;
        rookRef.current.style.transition = 'transform 0.5s ease-in-out';
        rookRef.current.style.transform = 'translateY(-35px)';
        await wait(500);
        rookRef.current.style.transform = 'translateY(-25px)';
        await wait(500);
      }

      if (rookRef.current) {
        rookRef.current.style.transition = 'transform 0.4s ease-in';
        rookRef.current.style.transform = '';
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

    // Animation: Shimmer
    const animShimmer = useCallback(async () => {
      reset();
      await wait(200);

      for (let pass = 0; pass < 3; pass++) {
        if (fxRef.current) {
          const shine = document.createElement('div');
          shine.style.cssText = `
            position: absolute;
            left: -30px; top: -20px;
            width: 20px; height: 160px;
            background: rgba(255,255,255,0.3);
            transform: translateX(-100px) skewX(-15deg);
            pointer-events: none;
          `;
          fxRef.current.appendChild(shine);

          shine.animate([
            { transform: 'translateX(-100px) skewX(-15deg)' },
            { transform: 'translateX(200px) skewX(-15deg)' }
          ], { duration: 500, easing: 'ease-in-out' }).onfinish = () => shine.remove();
        }

        // Blocks briefly highlight as shine passes
        blockRefs.current.forEach((el, i) => {
          if (!el) return;
          const x = BLOCKS[i].x;
          const delay = (x / 80) * 350;

          setTimeout(() => {
            el.style.transition = 'transform 0.1s ease-out';
            el.style.transform = 'scale(1.15)';
            setTimeout(() => {
              el.style.transition = 'transform 0.15s ease-in';
              el.style.transform = '';
            }, 100);
          }, delay);
        });

        await wait(700);
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

    // Animation: Orbit
    const animOrbit = useCallback(async () => {
      reset();
      await wait(200);

      if (!fxRef.current) return;

      // Create orbiting particles
      interface Orbiter { el: HTMLDivElement; angle: number; radius: number; }
      const orbiters: Orbiter[] = [];

      for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        const size = rand(6, 10);
        const color = COLORS[i % COLORS.length];
        p.style.cssText = `
          position: absolute;
          left: 47px; top: 53px;
          width: ${size}px; height: ${size}px;
          background: ${color};
          border-radius: 2px;
          pointer-events: none;
        `;
        fxRef.current.appendChild(p);
        orbiters.push({ el: p, angle: (i / 8) * Math.PI * 2, radius: 70 + rand(-10, 10) });
      }

      const duration = 2000;
      const startTime = Date.now();

      const animateOrbit = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed > duration) {
          orbiters.forEach(o => o.el.remove());
          return;
        }

        const progress = elapsed / duration;
        orbiters.forEach((o) => {
          const angle = o.angle + progress * Math.PI * 4;
          const radius = o.radius * (1 - progress * 0.5);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.5;
          o.el.style.transform = `translate(${x}px, ${y}px) scale(${1 - progress * 0.5}) rotate(${progress * 360}deg)`;
          o.el.style.opacity = String(1 - progress);
        });

        requestAnimationFrame(animateOrbit);
      };

      animateOrbit();

      // Blocks pulse during orbit
      await wait(500);
      blockRefs.current.forEach((el, i) => {
        if (!el) return;
        setTimeout(() => {
          el.style.transition = 'transform 0.15s ease-out';
          el.style.transform = 'scale(1.15)';
          setTimeout(() => {
            el.style.transition = 'transform 0.2s ease-in';
            el.style.transform = '';
          }, 150);
        }, i * 30);
      });

      await wait(1500);
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
      levitate: animLevitate,
      pulse: animPulse,
      shimmer: animShimmer,
      ripple: animRipple,
      cascade: animCascade,
      orbit: animOrbit,
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
                backgroundColor: block.color,
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
