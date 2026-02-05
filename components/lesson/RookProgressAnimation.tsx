'use client';

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';

/**
 * ChessPath Rook Progress Animation Component
 *
 * A 6-stage rook assembly animation for chess lessons.
 * Each stage is triggered when a user answers correctly.
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

// The 22 blocks that form the rook, organized by assembly stage
const STAGES: Stage[] = [
  {
    name: "Foundation",
    blocks: [
      { x: 8, y: 98, color: '#2FCBEF' },
      { x: 26, y: 98, color: '#A560E8' },
      { x: 44, y: 98, color: '#58CC02' },
      { x: 62, y: 98, color: '#FFC800' },
      { x: 80, y: 98, color: '#FF9600' }
    ]
  },
  {
    name: "Body",
    blocks: [
      { x: 26, y: 80, color: '#FF6B6B' },
      { x: 44, y: 80, color: '#FF4B4B' },
      { x: 62, y: 80, color: '#1CB0F6' }
    ]
  },
  {
    name: "Neck",
    blocks: [
      { x: 26, y: 62, color: '#58CC02' },
      { x: 44, y: 62, color: '#FFC800' },
      { x: 62, y: 62, color: '#FF9600' }
    ]
  },
  {
    name: "Head",
    blocks: [
      { x: 26, y: 44, color: '#1CB0F6' },
      { x: 44, y: 44, color: '#2FCBEF' },
      { x: 62, y: 44, color: '#A560E8' }
    ]
  },
  {
    name: "Crown Rim",
    blocks: [
      { x: 8, y: 26, color: '#58CC02' },
      { x: 26, y: 26, color: '#FFC800' },
      { x: 44, y: 26, color: '#FF9600' },
      { x: 62, y: 26, color: '#FF6B6B' },
      { x: 80, y: 26, color: '#FF4B4B' }
    ]
  },
  {
    name: "Crown Points",
    blocks: [
      { x: 8, y: 8, color: '#1CB0F6' },
      { x: 44, y: 8, color: '#2FCBEF' },
      { x: 80, y: 8, color: '#A560E8' }
    ]
  }
];

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

    // On mount, make previous stages visible (for when currentStage > 0)
    useEffect(() => {
      if (stage > 0) {
        // Make all blocks from stages 0 to stage-1 visible
        for (let s = 0; s < stage; s++) {
          const blocks = blockRefs.current[s];
          blocks?.forEach(el => {
            if (el) {
              el.style.opacity = '1';
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
            el.style.opacity = '1';
            el.style.transform = 'scale(1.5)';
            el.style.boxShadow = `0 0 30px ${el.dataset.color}, 0 0 60px #fff`;
            el.style.filter = 'brightness(3)';
            sparks(el, 6, '#fff');
            setTimeout(() => {
              el.style.transition = 'all 0.25s ease-out';
              el.style.transform = 'scale(1)';
              el.style.boxShadow = 'none';
              el.style.filter = 'brightness(1)';
            }, 80);
          }, 100 + rand(0, 100));
        });
      },

      neon: (blocks) => {
        blocks.forEach((el, i) => {
          if (!el) return;
          el.style.boxShadow = `0 0 25px ${el.dataset.color}, 0 0 50px ${el.dataset.color}`;
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
            el.style.filter = 'brightness(1)';
            el.style.boxShadow = 'none';
          }, i * 70 + 380);
        });
      },

      emp: (blocks) => {
        flash('#1CB0F6', 0.4);
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            el.style.opacity = '1';
            el.style.transform = 'scale(0) rotate(180deg)';
            el.style.filter = 'brightness(3) hue-rotate(90deg)';
            setTimeout(() => {
              el.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
              el.style.transform = 'scale(1) rotate(0deg)';
              el.style.filter = 'brightness(1) hue-rotate(0deg)';
              el.style.boxShadow = 'none';
            }, 50);
          }, 150 + i * 60);
        });
      },

      hologram: (blocks) => {
        blocks.forEach((el, i) => {
          if (!el) return;
          el.style.opacity = '0';
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.boxShadow = `0 0 15px ${el.dataset.color}, inset 0 0 10px rgba(255,255,255,0.3)`;
          }, i * 80 + 250);
        });
      },

      grid: (blocks) => {
        flash('#58CC02', 0.3);
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            el.style.opacity = '1';
            el.style.transform = 'scale(1.3)';
            el.style.boxShadow = `0 0 30px #58CC02, 0 0 15px ${el.dataset.color}`;
            el.style.filter = 'brightness(2)';
            sparks(el, 4, '#58CC02');
            setTimeout(() => {
              el.style.transition = 'all 0.2s ease-out';
              el.style.transform = 'scale(1)';
              el.style.boxShadow = 'none';
              el.style.filter = 'brightness(1)';
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
              el.style.filter = 'brightness(1) hue-rotate(0deg)';
              el.style.boxShadow = 'none';
            }
          }, 50);
        });
      },

      fusion: (blocks) => {
        flash('#FFC800', 0.5);
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            el.style.opacity = '1';
            el.style.transform = 'scale(0)';
            el.style.filter = 'brightness(3) saturate(2)';
            el.style.boxShadow = `0 0 30px #FFC800`;
            setTimeout(() => {
              el.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
              el.style.transform = 'scale(1)';
              el.style.filter = 'brightness(1) saturate(1)';
              el.style.boxShadow = 'none';
            }, 50);
          }, 200 + i * 50);
        });
      },

      tesla: (blocks) => {
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            flash('#A560E8', 0.2);
            el.style.opacity = '1';
            el.style.transform = 'scale(1.4)';
            el.style.boxShadow = `0 0 40px #A560E8, 0 0 20px ${el.dataset.color}`;
            el.style.filter = 'brightness(2.5)';
            sparks(el, 8, '#A560E8');
            setTimeout(() => {
              el.style.transition = 'all 0.2s ease-out';
              el.style.transform = 'scale(1)';
              el.style.boxShadow = 'none';
              el.style.filter = 'brightness(1)';
            }, 100);
          }, i * 100 + 150);
        });
      },

      voltage: (blocks) => {
        flash('#FFC800', 0.4);
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            el.style.opacity = '1';
            el.style.transform = 'scale(1.2) skewX(-10deg)';
            el.style.boxShadow = `0 0 30px #FFC800, -5px 0 20px #FF4B4B, 5px 0 20px #58CC02`;
            el.style.filter = 'brightness(2.5)';
            for (let c = 0; c < 3; c++) {
              setTimeout(() => sparks(el, 3, '#FFC800'), c * 40);
            }
            setTimeout(() => {
              el.style.transition = 'all 0.25s ease-out';
              el.style.transform = 'scale(1) skewX(0deg)';
              el.style.boxShadow = 'none';
              el.style.filter = 'brightness(1)';
            }, 150);
          }, i * 80);
        });
      },

      ion: (blocks) => {
        blocks.forEach((el, i) => {
          setTimeout(() => {
            if (!el) return;
            el.style.opacity = '1';
            el.style.transform = 'scale(0) rotate(180deg)';
            el.style.boxShadow = `0 0 30px #1CB0F6`;
            el.style.filter = 'brightness(2) hue-rotate(20deg)';
            setTimeout(() => {
              el.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
              el.style.transform = 'scale(1) rotate(0deg)';
              el.style.boxShadow = 'none';
              el.style.filter = 'brightness(1) hue-rotate(0deg)';
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
      const colors = ['#1CB0F6', '#A560E8', '#FFC800', '#58CC02', '#FF6B6B'];
      for (let i = 0; i < 5; i++) {
        setTimeout(() => flash(colors[i], 0.25), i * 100);
      }

      // Pulse all blocks
      blockRefs.current.flat().forEach((el, i) => {
        if (!el) return;
        setTimeout(() => {
          el.style.boxShadow = `0 0 40px ${el.dataset.color}`;
          el.animate([
            { transform: 'scale(1)', filter: 'brightness(1)' },
            { transform: 'scale(1.3)', filter: 'brightness(2.5)' },
            { transform: 'scale(1)', filter: 'brightness(1)' }
          ], { duration: 400 });
          setTimeout(() => {
            el.style.boxShadow = 'none';
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
              fontFamily: 'system-ui, sans-serif'
            }}>
              Stage <span style={{ color: '#58CC02', fontSize: '18px', textShadow: '0 0 8px #58CC02' }}>{stage}</span> / 6
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
                background: 'linear-gradient(90deg, #58CC02, #7ED321)',
                borderRadius: '2px',
                transition: 'width 0.4s',
                boxShadow: '0 0 8px #58CC02'
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
                  backgroundColor: block.color,
                  opacity: 0,
                  boxShadow: 'none'
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
            color: stage === 6 ? '#FFC800' : 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            textShadow: stage === 6 ? '0 0 8px #FFC800' : 'none',
            fontFamily: 'system-ui, sans-serif'
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
