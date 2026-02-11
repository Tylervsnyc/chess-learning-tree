'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Block data from AnimatedLogo
const BLOCKS = [
  { x: 4, y: 8, color: '#1CB0F6' },
  { x: 40, y: 8, color: '#2FCBEF' },
  { x: 76, y: 8, color: '#A560E8' },
  { x: 4, y: 26, color: '#58CC02' },
  { x: 22, y: 26, color: '#FFC800' },
  { x: 40, y: 26, color: '#FF9600' },
  { x: 58, y: 26, color: '#FF6B6B' },
  { x: 76, y: 26, color: '#FF4B4B' },
  { x: 22, y: 44, color: '#1CB0F6' },
  { x: 40, y: 44, color: '#2FCBEF' },
  { x: 58, y: 44, color: '#A560E8' },
  { x: 22, y: 62, color: '#58CC02' },
  { x: 40, y: 62, color: '#FFC800' },
  { x: 58, y: 62, color: '#FF9600' },
  { x: 22, y: 80, color: '#FF6B6B' },
  { x: 40, y: 80, color: '#FF4B4B' },
  { x: 58, y: 80, color: '#1CB0F6' },
  { x: 4, y: 98, color: '#2FCBEF' },
  { x: 22, y: 98, color: '#A560E8' },
  { x: 40, y: 98, color: '#58CC02' },
  { x: 58, y: 98, color: '#FFC800' },
  { x: 76, y: 98, color: '#FF9600' },
];

const CENTER_X = 47;
const CENTER_Y = 60;

type AnimationType =
  | 'none'
  | 'pulse'
  | 'wave'
  | 'breathe'
  | 'cascade-down'
  | 'cascade-up'
  | 'rainbow-shift'
  | 'sparkle'
  | 'heartbeat'
  | 'ripple'
  | 'rotate-glow'
  | 'bounce';

const ANIMATIONS: { id: AnimationType; label: string; desc: string }[] = [
  { id: 'none', label: 'Static', desc: 'No animation' },
  { id: 'pulse', label: 'Pulse', desc: 'All blocks pulse scale + glow' },
  { id: 'wave', label: 'Wave', desc: 'Ripple from center outward' },
  { id: 'breathe', label: 'Breathe', desc: 'Gentle brightness breathing' },
  { id: 'cascade-down', label: 'Cascade ↓', desc: 'Rows light up top to bottom' },
  { id: 'cascade-up', label: 'Cascade ↑', desc: 'Rows light up bottom to top' },
  { id: 'rainbow-shift', label: 'Rainbow', desc: 'Colors rotate through blocks' },
  { id: 'sparkle', label: 'Sparkle', desc: 'Random blocks twinkle' },
  { id: 'heartbeat', label: 'Heartbeat', desc: 'Double-pulse rhythm' },
  { id: 'ripple', label: 'Ripple', desc: 'Concentric rings from center' },
  { id: 'rotate-glow', label: 'Sweep', desc: 'Glow sweeps clockwise' },
  { id: 'bounce', label: 'Bounce', desc: 'Blocks bounce in sequence' },
];

function getDistance(block: { x: number; y: number }) {
  return Math.sqrt(Math.pow(block.x + 7 - CENTER_X, 2) + Math.pow(block.y + 7 - CENTER_Y, 2));
}

function getAngle(block: { x: number; y: number }) {
  return Math.atan2(block.y + 7 - CENTER_Y, block.x + 7 - CENTER_X);
}

const maxDist = Math.max(...BLOCKS.map(getDistance));

function AnimatedRook({
  animation,
  scale = 1,
  speed = 1,
}: {
  animation: AnimationType;
  scale?: number;
  speed?: number;
}) {
  const [frame, setFrame] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (animation === 'none') return;
    startRef.current = performance.now();
    const tick = (now: number) => {
      setFrame((now - startRef.current) * speed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animation, speed]);

  const blockSize = 14 * scale;
  const blockRadius = 2 * scale;

  const getBlockStyle = useCallback(
    (block: (typeof BLOCKS)[number], index: number): React.CSSProperties => {
      const dist = getDistance(block);
      const normDist = dist / maxDist;
      const angle = getAngle(block);
      const row = Math.round(block.y / 18);
      const t = frame / 1000;

      switch (animation) {
        case 'pulse': {
          const s = 1 + 0.15 * Math.sin(t * 3);
          return { transform: `scale(${s})`, filter: `brightness(${1 + 0.3 * Math.sin(t * 3)})` };
        }
        case 'wave': {
          const phase = t * 4 - normDist * 2;
          const v = Math.max(0, Math.sin(phase));
          return { transform: `scale(${1 + 0.1 * v})`, filter: `brightness(${1 + 0.4 * v})` };
        }
        case 'breathe':
          return { filter: `brightness(${1 + 0.25 * Math.sin(t * 2 + normDist * 0.5)})` };
        case 'cascade-down': {
          const p = (t * 2 - row * 0.3) % 2;
          return { filter: `brightness(${p > 0 && p < 0.6 ? 1.5 : 1})` };
        }
        case 'cascade-up': {
          const p = (t * 2 - (5 - row) * 0.3) % 2;
          return { filter: `brightness(${p > 0 && p < 0.6 ? 1.5 : 1})` };
        }
        case 'rainbow-shift':
          return { filter: `hue-rotate(${(t * 60 + index * 15) % 360}deg)` };
        case 'sparkle': {
          const sp = Math.sin(t * 7 + index * 2.7);
          return sp > 0.7
            ? { transform: `scale(1.15)`, filter: `brightness(1.8)` }
            : {};
        }
        case 'heartbeat': {
          const beat = (t * 1.5) % 1;
          const s = beat < 0.1 ? 1.2 : beat < 0.2 ? 1.0 : beat < 0.3 ? 1.15 : 1.0;
          return { transform: `scale(${s})`, filter: `brightness(${s > 1.05 ? 1.3 : 1})` };
        }
        case 'ripple': {
          const ring = (t * 3 - normDist * 3) % 4;
          const active = ring > 0 && ring < 1;
          if (!active) return {};
          const v = Math.sin(ring * Math.PI);
          return { transform: `scale(${1 + 0.12 * v})`, filter: `brightness(${1 + 0.5 * v})` };
        }
        case 'rotate-glow': {
          const sweep = (t * 2) % (2 * Math.PI);
          let diff = Math.abs(angle - sweep);
          if (diff > Math.PI) diff = 2 * Math.PI - diff;
          return { filter: `brightness(${diff < 0.8 ? 1 + 0.6 * (1 - diff / 0.8) : 1})` };
        }
        case 'bounce': {
          const bp = (t * 3 + index * 0.15) % 2;
          const y = bp < 1 ? -Math.sin(bp * Math.PI) * 4 * scale : 0;
          return { transform: `translateY(${y}px)` };
        }
        default:
          return {};
      }
    },
    [animation, frame, scale],
  );

  return (
    <div style={{ position: 'relative', width: 94 * scale, height: 120 * scale }}>
      {BLOCKS.map((block, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: block.x * scale,
            top: block.y * scale,
            width: blockSize,
            height: blockSize,
            borderRadius: blockRadius,
            backgroundColor: block.color,
            boxShadow: `0 ${4 * scale}px ${12 * scale}px ${block.color}40`,
            willChange: animation !== 'none' ? 'transform, filter' : undefined,
            ...getBlockStyle(block, i),
          }}
        />
      ))}
    </div>
  );
}

export default function TestVideoRookPage() {
  const [selected, setSelected] = useState<AnimationType>('wave');
  const [speed, setSpeed] = useState(1);

  return (
    <div className="h-full overflow-auto" style={{ backgroundColor: '#f0f2f5' }}>
      <div className="text-center pt-10 pb-6 px-4">
        <h1 className="text-chess-text text-xl font-bold tracking-tight">
          Video Rook Animation Lab
        </h1>
        <p className="text-chess-text-muted text-sm mt-1">
          Pick a looping animation for the video rook icon
        </p>
      </div>

      {/* Big preview */}
      <div className="flex justify-center pb-6">
        <div
          className="rounded-3xl flex items-center justify-center"
          style={{
            width: 320,
            height: 320,
            backgroundColor: '#EBF0F5',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <AnimatedRook animation={selected} scale={2.5} speed={speed} />
        </div>
      </div>

      {/* Speed control */}
      <div className="flex items-center justify-center gap-3 pb-6 px-4">
        <span className="text-chess-text-muted text-xs font-medium">Speed</span>
        <input
          type="range"
          min={0.25}
          max={3}
          step={0.25}
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-48"
        />
        <span className="text-chess-text text-xs font-bold w-10 text-center">{speed}x</span>
      </div>

      {/* Animation grid */}
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {ANIMATIONS.map((anim) => (
            <button
              key={anim.id}
              onClick={() => setSelected(anim.id)}
              className="rounded-2xl p-4 text-left transition-all"
              style={{
                backgroundColor: selected === anim.id ? '#fff' : 'rgba(255,255,255,0.6)',
                border: selected === anim.id ? '2px solid #58CC02' : '2px solid transparent',
                boxShadow: selected === anim.id
                  ? '0 4px 16px rgba(88,204,2,0.2)'
                  : '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex justify-center mb-3">
                <AnimatedRook animation={anim.id} scale={0.6} speed={speed} />
              </div>
              <p className="text-chess-text text-xs font-bold">{anim.label}</p>
              <p className="text-chess-text-muted text-[10px] mt-0.5 leading-tight">
                {anim.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
