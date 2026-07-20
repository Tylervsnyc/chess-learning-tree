import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';
import { loadFont } from './lib/dm-sans';
import { ROOK_BLOCKS, getMatteBackground } from '@/lib/daily-rook-blocks';
import { FPS } from './lib/timing';

const { fontFamily } = loadFont();

export const STREAK_REEL_FRAMES = 5 * FPS; // 5s loop

const ORANGE = '#FF9500';

// Brand logo block sprite (rainbow rook), same as the social card.
const LOGO_BLOCKS = [
  { x: 0, y: 0, color: '#1CB0F6' }, { x: 2, y: 0, color: '#2FCBEF' }, { x: 4, y: 0, color: '#A560E8' },
  { x: 0, y: 1, color: '#58CC02' }, { x: 1, y: 1, color: '#FFC800' }, { x: 2, y: 1, color: '#FF9600' },
  { x: 3, y: 1, color: '#FF6B6B' }, { x: 4, y: 1, color: '#FF4B4B' },
  { x: 1, y: 2, color: '#1CB0F6' }, { x: 2, y: 2, color: '#2FCBEF' }, { x: 3, y: 2, color: '#A560E8' },
  { x: 1, y: 3, color: '#58CC02' }, { x: 2, y: 3, color: '#FFC800' }, { x: 3, y: 3, color: '#FF9600' },
  { x: 1, y: 4, color: '#FF6B6B' }, { x: 2, y: 4, color: '#FF4B4B' }, { x: 3, y: 4, color: '#1CB0F6' },
  { x: 0, y: 5, color: '#2FCBEF' }, { x: 1, y: 5, color: '#A560E8' }, { x: 2, y: 5, color: '#58CC02' },
  { x: 3, y: 5, color: '#FFC800' }, { x: 4, y: 5, color: '#FF9600' },
];

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function BrandLogo({ size = 18 }: { size?: number }) {
  const spacing = Math.round(size * 1.14);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: spacing * 4 + size, height: spacing * 5 + size }}>
        {LOGO_BLOCKS.map((b, i) => (
          <div key={i} style={{
            position: 'absolute', left: b.x * spacing, top: b.y * spacing,
            width: size, height: size, borderRadius: 4, background: getMatteBackground(b.color),
          }} />
        ))}
      </div>
      <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: -0.5 }}>
        <span style={{ color: '#fff' }}>chess</span>
        <span style={{
          backgroundImage: 'linear-gradient(90deg,#FFC800,#FF6B6B,#1CB0F6)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        }}>path</span>
      </div>
    </div>
  );
}

// Frame-driven flame: Rookie's blocks flicker red->yellow and rise.
function FlameRook({ t, blockSize }: { t: number; blockSize: number }) {
  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const gridWidth = 5 * blockSize + 4 * gap;
  const gridHeight = 6 * blockSize + 5 * gap;
  const amp = 1.2; // blaze = 1

  return (
    <div style={{ position: 'relative', width: gridWidth, height: gridHeight }}>
      {/* ground glow */}
      <div style={{
        position: 'absolute', left: gridWidth / 2, bottom: -gridHeight * 0.08,
        width: gridWidth * 1.25, height: gridHeight * 0.5, transform: 'translateX(-50%)',
        borderRadius: '50%', background: 'rgba(255,140,0,0.28)',
        filter: 'blur(40px)', opacity: 0.6 + 0.35 * (0.5 + 0.5 * Math.sin(t * 4)),
      }} />
      {/* rising embers */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const cycle = (t * 0.5 + i * 0.37) % 1; // 0..1 rise
        const ex = Math.sin(t * 1.5 + i) * 18;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: gridWidth * (0.2 + i * 0.12) + ex * cycle,
            top: gridHeight * 0.7 - cycle * gridHeight * 0.85,
            width: 7, height: 7, borderRadius: '50%', background: '#FFD24D',
            boxShadow: '0 0 12px 3px rgba(255,180,60,0.9)',
            opacity: Math.sin(cycle * Math.PI),
          }} />
        );
      })}
      {/* blocks */}
      {ROOK_BLOCKS.map((block) => {
        const { x, y } = block;
        const blockIdx = x + y * 5;
        const baseLeft = x * (blockSize + gap);
        const baseTop = y * (blockSize + gap);
        const flameHeight = 1 - y / 5;
        const flicker = seededRandom(Math.floor(t * 12) + blockIdx) * 0.4;
        const brightness = 0.5 + flameHeight * 0.8 + flicker;
        const offY = -flameHeight * Math.sin(t * 3 + x * 2) * 8 * amp;
        const offX = Math.sin(t * 2 + y * 1.5 + x) * flameHeight * 5 * amp;
        const fireHue = flameHeight * 50;
        const bg = hslToHex(fireHue + flicker * 20, 90 - flameHeight * 20, 30 + flameHeight * 30 + flicker * 15);
        const scale = 1 + flameHeight * Math.sin(t * 4 + blockIdx) * 0.1 * amp;
        return (
          <div key={`${x},${y}`} style={{
            position: 'absolute',
            left: baseLeft + offX, top: baseTop + offY,
            width: blockSize, height: blockSize, borderRadius: Math.round(blockSize * 0.14),
            background: getMatteBackground(bg),
            boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.15), inset 0 -1px 0 rgba(255,255,255,0.15)',
            transform: `scale(${scale})`, filter: `brightness(${brightness})`,
          }} />
        );
      })}
    </div>
  );
}

export const StreakReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // gentle entrance
  const headIn = interpolate(frame, [6, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subIn = interpolate(frame, [16, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ctaIn = interpolate(frame, [26, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      fontFamily,
      background: 'linear-gradient(180deg, #2A3C45 0%, #33373f 52%, #3a2e26 100%)',
      padding: 80, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {/* header */}
      <div style={{ alignSelf: 'flex-start' }}>
        <BrandLogo size={18} />
      </div>

      {/* flame */}
      <div style={{ marginTop: 90, marginBottom: 40 }}>
        <FlameRook t={t} blockSize={118} />
      </div>

      {/* headline */}
      <div style={{
        textAlign: 'center', opacity: headIn,
        transform: `translateY(${(1 - headIn) * 30}px)`,
      }}>
        <div style={{ fontSize: 148, fontWeight: 800, color: '#fff', lineHeight: 0.95, letterSpacing: -4 }}>
          Showing up
        </div>
        <div style={{ fontSize: 148, fontWeight: 800, color: ORANGE, lineHeight: 0.95, letterSpacing: -4 }}>
          beats talent.
        </div>
      </div>

      {/* subtext */}
      <div style={{
        textAlign: 'center', marginTop: 44, maxWidth: 820, opacity: subIn,
        fontSize: 44, fontWeight: 600, color: 'rgba(255,255,255,0.72)', lineHeight: 1.3,
      }}>
        A streak keeps you honest. Chess Path makes coming back the fun part.
      </div>

      {/* CTA */}
      <div style={{
        marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        opacity: ctaIn, transform: `translateY(${(1 - ctaIn) * 20}px)`,
      }}>
        <div style={{
          background: '#58CC02', color: '#fff', fontWeight: 800, fontSize: 46,
          padding: '28px 64px', borderRadius: 999, boxShadow: '0 8px 0 #46A302',
        }}>
          Start your streak
        </div>
        <div style={{ fontSize: 44, fontWeight: 900, color: '#fff' }}>chesspath.app</div>
      </div>
    </AbsoluteFill>
  );
};
