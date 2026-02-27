'use client';

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { ROOK_BLOCKS_PIXEL, ROOK_FILL_ORDER, getMatteBackground, getMatteBoxShadow, lighten } from '@/lib/daily-rook-blocks';

/**
 * ChessPath Rook Progress Animation Component
 *
 * A 6-stage rook assembly animation for chess lessons.
 * Each stage is triggered when a user answers correctly.
 * Block data is derived from the canonical ROOK_BLOCKS_PIXEL source.
 *
 * Animation Styles Available:
 * - lightning: Electric bolt strike effect
 * - neon: Flickering neon sign effect
 * - emp: EMP pulse with expanding rings
 * - hologram: Sci-fi hologram materialization
 * - grid: Power grid energy lines
 * - hack: Matrix-style cyber hack
 * - fusion: Nuclear fusion core explosion
 * - tesla: Tesla coil arc electricity
 * - voltage: Power surge with skew effect
 * - ion: Swirling ion particle storm
 */

interface Block {
  x: number;
  y: number;
  color: string;
}

interface Stage {
  name: string;
  blocks: Block[];
}

// The 22 blocks that form the rook, organized by assembly stage.
// Derived from the canonical ROOK_BLOCKS_PIXEL + ROOK_FILL_ORDER source of truth.
const STAGE_NAMES = ['Foundation', 'Body', 'Neck', 'Head', 'Crown Rim', 'Crown Points'];
const STAGE_SIZES = [5, 3, 3, 3, 5, 3]; // blocks per stage

const STAGES: Stage[] = (() => {
  const stages: Stage[] = [];
  let offset = 0;
  for (let i = 0; i < STAGE_NAMES.length; i++) {
    const size = STAGE_SIZES[i];
    const blocks: Block[] = ROOK_FILL_ORDER.slice(offset, offset + size).map(idx => ROOK_BLOCKS_PIXEL[idx]);
    stages.push({ name: STAGE_NAMES[i], blocks });
    offset += size;
  }
  return stages;
})();

export type AnimationStyle =
  | 'lightning'
  | 'neon'
  | 'emp'
  | 'hologram'
  | 'grid'
  | 'hack'
  | 'fusion'
  | 'tesla'
  | 'voltage'
  | 'ion';

export const ANIMATION_STYLES: Record<AnimationStyle, { name: string; emoji: string; color: string; description: string }> = {
  lightning: { name: 'Lightning Strike', emoji: '⚡', color: '#fff', description: 'Electric bolt strike with screen flash and sparks' },
  neon: { name: 'Neon Surge', emoji: '💡', color: '#1CB0F6', description: 'Flickering neon sign effect' },
  emp: { name: 'EMP Pulse', emoji: '📡', color: '#1CB0F6', description: 'Electromagnetic pulse with expanding rings' },
  hologram: { name: 'Hologram', emoji: '🔮', color: '#2FCBEF', description: 'Sci-fi hologram materialization' },
  grid: { name: 'Power Grid', emoji: '🔌', color: '#58CC02', description: 'Energy lines connecting to power grid' },
  hack: { name: 'Cyber Hack', emoji: '💻', color: '#58CC02', description: 'Matrix-style binary flicker' },
  fusion: { name: 'Fusion Core', emoji: '☢️', color: '#FFC800', description: 'Nuclear fusion with spiraling energy' },
  tesla: { name: 'Tesla Coil', emoji: '🌩️', color: '#A560E8', description: 'Arc electricity with purple sparks' },
  voltage: { name: 'Voltage Spike', emoji: '🔋', color: '#FFC800', description: 'Power surge with skew distortion' },
  ion: { name: 'Ion Storm', emoji: '🌀', color: '#1CB0F6', description: 'Swirling ion particles converging' }
};

export interface RookProgressAnimationProps {
  style?: AnimationStyle;
  currentStage?: number;
  onStageComplete?: (stage: number) => void;
  onAllComplete?: () => void;
  scale?: number;
  showProgress?: boolean;
  showLabel?: boolean;
  compact?: boolean; // Remove margins for tight spaces
}

export interface RookProgressAnimationRef {
  triggerNextStage: () => void;
  reset: () => void;
  currentStage: number;
}

export const RookProgressAnimation = forwardRef<RookProgressAnimationRef, RookProgressAnimationProps>(
  function RookProgressAnimation(
    {
      style = 'lightning',
      currentStage: externalStage,
      onStageComplete,
      onAllComplete,
      scale = 1.8,
      showProgress = true,
      showLabel = true,
      compact = false,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const fxRef = useRef<HTMLDivElement>(null);
    const blockRefs = useRef<(HTMLDivElement | null)[][]>(STAGES.map(() => []));
    const [stage, setStage] = useState(externalStage ?? 0);
    const [animating, setAnimating] = useState(false);

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    // Restore matte base appearance on a block element
    const restoreMatte = (el: HTMLDivElement) => {
      const color = el.dataset.color || '#58CC02';
      el.style.boxShadow = getMatteBoxShadow(color);
      el.style.filter = 'brightness(1)';
    };

    // On mount, make previous stages visible (for when currentStage > 0)
    useEffect(() => {
      if (stage > 0) {
        // Make all blocks from stages 0 to stage-1 visible
        for (let s = 0; s < stage; s++) {
          const blocks = blockRefs.current[s];
          blocks?.forEach(el => {
            if (el) {
              el.style.opacity = '1';
              restoreMatte(el);
            }
          });
        }
      }
    }, []); // Only run on mount

    const flash = useCallback((_color: string, _intensity = 0.5) => {
      // Disabled - was causing visible box flash
      return;
    }, []);

    const sparks = useCallback((el: HTMLDivElement | null, count: number, color: string) => {
      if (!fxRef.current || !el || !containerRef.current) return;
      const r = el.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        const relX = r.left - containerRect.left + 7;
        const relY = r.top - containerRect.top + 7;
        s.style.cssText = `position:absolute;width:2px;height:6px;background:${color};left:${relX}px;top:${relY}px;box-shadow:0 0 4px ${color};`;
        fxRef.current.appendChild(s);
        const angle = rand(0, Math.PI * 2);
        s.animate([
          { transform: `rotate(${angle}rad) translateY(0)`, opacity: 1 },
          { transform: `rotate(${angle}rad) translateY(${rand(15, 30)}px)`, opacity: 0 }
        ], { duration: 200 }).onfinish = () => s.remove();
      }
    }, []);

    // Animation implementations
    const animations: Record<AnimationStyle, (blocks: (HTMLDivElement | null)[]) => void> = {
      lightning: (blocks) => {
        flash('#fff', 0.6);
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            const c = el.dataset.color || '#58CC02';
            el.style.opacity = '1';
            el.style.transform = 'scale(1.5)';
            el.style.boxShadow = `0 0 30px ${lighten(c, 18)}, 0 0 60px #fff`;
            el.style.filter = 'brightness(3)';
            sparks(el, 6, lighten(c, 30));
            setTimeout(() => {
              el.style.transition = 'all 0.25s ease-out';
              el.style.transform = 'scale(1)';
              restoreMatte(el);
            }, 80);
          }, 100 + rand(0, 100));
        });
      },

      neon: (blocks) => {
        blocks.forEach((el, i) => {
          if (!el) return;
          const c = el.dataset.color || '#1CB0F6';
          const glow = lighten(c, 18);
          el.style.boxShadow = `0 0 25px ${glow}, 0 0 50px ${c}`;
          const flickers = [0, 40, 90, 150, 200, 280];
          const states = [1, 0, 1, 0, 0.4, 1];
          flickers.forEach((t, fi) => {
            setTimeout(() => {
              el.style.opacity = String(states[fi]);
              el.style.filter = states[fi] === 1 ? 'brightness(2.5)' : 'brightness(0.3)';
            }, i * 70 + t);
          });
          setTimeout(() => {
            el.style.transition = 'all 0.3s ease-out';
            el.style.opacity = '1';
            restoreMatte(el);
          }, i * 70 + 380);
        });
      },

      emp: (blocks) => {
        flash(lighten('#1CB0F6', 18), 0.4);
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            el.style.opacity = '1';
            el.style.transform = 'scale(0) rotate(180deg)';
            el.style.filter = 'brightness(3) hue-rotate(90deg)';
            setTimeout(() => {
              el.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
              el.style.transform = 'scale(1) rotate(0deg)';
              restoreMatte(el);
            }, 50);
          }, 150 + i * 60);
        });
      },

      hologram: (blocks) => {
        blocks.forEach((el, i) => {
          if (!el) return;
          const c = el.dataset.color || '#2FCBEF';
          el.style.opacity = '0';
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.boxShadow = `0 0 15px ${lighten(c, 18)}, inset 0 0 10px rgba(255,255,255,0.3)`;
            setTimeout(() => {
              el.style.transition = 'all 0.3s ease-out';
              restoreMatte(el);
            }, 300);
          }, i * 80 + 250);
        });
      },

      grid: (blocks) => {
        const glowGreen = lighten('#58CC02', 18);
        flash(glowGreen, 0.3);
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            const c = el.dataset.color || '#58CC02';
            el.style.opacity = '1';
            el.style.transform = 'scale(1.3)';
            el.style.boxShadow = `0 0 30px ${lighten(c, 18)}, 0 0 15px ${c}`;
            el.style.filter = 'brightness(2)';
            sparks(el, 4, lighten(c, 30));
            setTimeout(() => {
              el.style.transition = 'all 0.2s ease-out';
              el.style.transform = 'scale(1)';
              restoreMatte(el);
            }, 150);
          }, i * 100 + 150);
        });
      },

      hack: (blocks) => {
        blocks.forEach((el) => {
          if (!el) return;
          el.style.opacity = '0';
          let count = 0;
          const flickerInt = setInterval(() => {
            count++;
            el.style.opacity = count % 2 === 0 ? '1' : '0';
            el.style.filter = count % 2 === 0 ? 'brightness(2) hue-rotate(120deg)' : 'brightness(0.5)';
            if (count > 8) {
              clearInterval(flickerInt);
              el.style.opacity = '1';
              restoreMatte(el);
            }
          }, 50);
        });
      },

      fusion: (blocks) => {
        const glowGold = lighten('#FFC800', 18);
        flash(glowGold, 0.5);
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            const c = el.dataset.color || '#FFC800';
            el.style.opacity = '1';
            el.style.transform = 'scale(0)';
            el.style.filter = 'brightness(3) saturate(2)';
            el.style.boxShadow = `0 0 30px ${lighten(c, 18)}`;
            setTimeout(() => {
              el.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
              el.style.transform = 'scale(1)';
              restoreMatte(el);
            }, 50);
          }, 200 + i * 50);
        });
      },

      tesla: (blocks) => {
        const glowPurple = lighten('#A560E8', 18);
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            const c = el.dataset.color || '#A560E8';
            flash(glowPurple, 0.2);
            el.style.opacity = '1';
            el.style.transform = 'scale(1.4)';
            el.style.boxShadow = `0 0 40px ${lighten(c, 18)}, 0 0 20px ${c}`;
            el.style.filter = 'brightness(2.5)';
            sparks(el, 8, lighten(c, 30));
            setTimeout(() => {
              el.style.transition = 'all 0.2s ease-out';
              el.style.transform = 'scale(1)';
              restoreMatte(el);
            }, 100);
          }, i * 100 + 150);
        });
      },

      voltage: (blocks) => {
        const glowGold = lighten('#FFC800', 18);
        flash(glowGold, 0.4);
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            const c = el.dataset.color || '#FFC800';
            el.style.opacity = '1';
            el.style.transform = 'scale(1.2) skewX(-10deg)';
            el.style.boxShadow = `0 0 30px ${lighten(c, 18)}, -5px 0 20px ${lighten('#FF4B4B', 12)}, 5px 0 20px ${lighten('#58CC02', 12)}`;
            el.style.filter = 'brightness(2.5)';
            for (let j = 0; j < 3; j++) {
              setTimeout(() => sparks(el, 3, lighten(c, 30)), j * 40);
            }
            setTimeout(() => {
              el.style.transition = 'all 0.25s ease-out';
              el.style.transform = 'scale(1) skewX(0deg)';
              restoreMatte(el);
            }, 150);
          }, i * 80);
        });
      },

      ion: (blocks) => {
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            const c = el.dataset.color || '#1CB0F6';
            el.style.opacity = '1';
            el.style.transform = 'scale(0) rotate(180deg)';
            el.style.boxShadow = `0 0 30px ${lighten(c, 18)}`;
            el.style.filter = 'brightness(2) hue-rotate(20deg)';
            setTimeout(() => {
              el.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
              el.style.transform = 'scale(1) rotate(0deg)';
              restoreMatte(el);
            }, 50);
          }, 150 + i * 60);
        });
      }
    };

    const triggerNextStage = useCallback(() => {
      if (stage >= 6 || animating) return;

      setAnimating(true);
      const blocks = blockRefs.current[stage];
      const animFn = animations[style] || animations.lightning;

      animFn(blocks);

      const newStage = stage + 1;
      setStage(newStage);

      setTimeout(() => {
        setAnimating(false);
        onStageComplete?.(newStage);
        if (newStage === 6) {
          celebrate();
          onAllComplete?.();
        }
      }, 1000);
    }, [stage, animating, style, onStageComplete, onAllComplete, flash, sparks]);

    const celebrate = useCallback(() => {
      const glowColors = ['#1CB0F6', '#A560E8', '#FFC800', '#58CC02', '#FF6B6B'].map(c => lighten(c, 18));
      for (let i = 0; i < 5; i++) {
        setTimeout(() => flash(glowColors[i], 0.25), i * 100);
      }

      // Pulse all blocks
      blockRefs.current.flat().forEach((el, i) => {
        if (!el) return;
        setTimeout(() => {
          const c = el.dataset.color || '#58CC02';
          el.style.boxShadow = `0 0 40px ${lighten(c, 18)}`;
          el.animate([
            { transform: 'scale(1)', filter: 'brightness(1)' },
            { transform: 'scale(1.3)', filter: 'brightness(2.5)' },
            { transform: 'scale(1)', filter: 'brightness(1)' }
          ], { duration: 400 });
          setTimeout(() => {
            restoreMatte(el);
          }, 400);
        }, i * 20);
      });
    }, [flash]);

    const reset = useCallback(() => {
      setStage(0);
      setAnimating(false);
      blockRefs.current.flat().forEach(el => {
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = '';
        el.style.boxShadow = '';
        el.style.filter = '';
        el.style.transition = '';
        el.style.background = '';
      });
    }, []);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      triggerNextStage,
      reset,
      currentStage: stage,
    }), [triggerNextStage, reset, stage]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        {showProgress && (
          <>
            <div style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: "var(--font-body), 'DM Sans', system-ui, sans-serif"
            }}>
              Stage <span style={{ color: 'var(--color-chess-green)', fontSize: '18px', textShadow: '0 0 8px var(--color-chess-green)' }}>{stage}</span> / 6
            </div>
            <div style={{
              width: '200px',
              height: '4px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${(stage / 6) * 100}%`,
                background: `linear-gradient(90deg, ${lighten('#58CC02', 12)}, #58CC02, ${lighten('#1CB0F6', 8)})`,
                borderRadius: '2px',
                transition: 'width 0.4s',
                boxShadow: `0 0 8px ${lighten('#58CC02', 10)}`
              }} />
            </div>
          </>
        )}

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
          {STAGES.map((stageData, stageIndex) =>
            stageData.blocks.map((block, blockIndex) => (
              <div
                key={`${stageIndex}-${blockIndex}`}
                ref={el => {
                  if (!blockRefs.current[stageIndex]) blockRefs.current[stageIndex] = [];
                  blockRefs.current[stageIndex][blockIndex] = el;
                }}
                data-color={block.color}
                style={{
                  position: 'absolute',
                  width: '14px',
                  height: '14px',
                  borderRadius: '2px',
                  left: `${block.x}px`,
                  top: `${block.y}px`,
                  background: getMatteBackground(block.color),
                  opacity: 0,
                  boxShadow: getMatteBoxShadow(block.color)
                }}
              />
            ))
          )}
          <div
            ref={fxRef}
            style={{ position: 'absolute', inset: '-50px', pointerEvents: 'none', overflow: 'visible' }}
          />
        </div>

        {showLabel && (
          <div style={{
            color: stage === 6 ? lighten('#FFC800', 18) : 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            textShadow: stage === 6 ? `0 0 8px ${lighten('#FFC800', 12)}` : 'none',
            fontFamily: "var(--font-body), 'DM Sans', system-ui, sans-serif"
          }}>
            {stage === 0 ? 'Answer to build!' : stage < 6 ? `${STAGES[stage - 1].name} ⚡` : 'COMPLETE!'}
          </div>
        )}
      </div>
    );
  }
);

// Export constants for external use
export { STAGES };
