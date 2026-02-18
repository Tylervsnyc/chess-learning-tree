import React from 'react';
import { useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { FPS } from '../lib/timing';

const { fontFamily } = loadFont();

/**
 * Rook icon + "chesspath" wordmark at 4x scale.
 * Rook blocks breathe gently (brightness oscillation) throughout the video.
 */
const ROOK_BLOCKS = [
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
const maxDist = Math.max(
  ...ROOK_BLOCKS.map((b) =>
    Math.sqrt(Math.pow(b.x + 7 - CENTER_X, 2) + Math.pow(b.y + 7 - CENTER_Y, 2)),
  ),
);

const SCALE = 2.0;
const BLOCK_SIZE = 14 * SCALE;
const BLOCK_RADIUS = 2 * SCALE;
const ROOK_W = (76 + 14) * SCALE;
const ROOK_H = (98 + 14) * SCALE;
const WORDMARK_FONT_SIZE = 72 * SCALE;
const GAP = 32;

export const LOGO_H = 240;

export const ReelLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS; // time in seconds

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        height: LOGO_H,
        gap: GAP,
      }}
    >
      {/* Rook icon — breathe animation */}
      <div style={{ position: 'relative', width: ROOK_W, height: ROOK_H, flexShrink: 0 }}>
        {ROOK_BLOCKS.map((block, i) => {
          const dist = Math.sqrt(
            Math.pow(block.x + 7 - CENTER_X, 2) + Math.pow(block.y + 7 - CENTER_Y, 2),
          );
          const normDist = dist / maxDist;
          // Gentle breathe: brightness oscillates 1.0–1.25, offset by distance from center
          const brightness = 1 + 0.25 * Math.sin(t * 2 * Math.PI + normDist * 0.5);

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: block.x * SCALE,
                top: block.y * SCALE,
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                borderRadius: BLOCK_RADIUS,
                backgroundColor: block.color,
                boxShadow: `0 ${4 * SCALE}px ${12 * SCALE}px ${block.color}40`,
                filter: `brightness(${brightness})`,
              }}
            />
          );
        })}
      </div>

      {/* Wordmark */}
      <div
        style={{
          fontFamily,
          fontSize: WORDMARK_FONT_SIZE,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}
      >
        <span style={{ color: '#2A3C45' }}>chess</span>
        <span
          style={{
            background:
              'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          path
        </span>
      </div>
    </div>
  );
};
