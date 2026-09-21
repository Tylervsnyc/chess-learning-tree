import React from 'react';
import type { ReelTier } from '../../lib/ig-difficult-days';
import { useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { ReelLogo, LOGO_H } from './ReelLogo';
import { BoardSlot } from './BoardSlot';
import { FooterTagline } from './FooterTagline';
import { FRAME_H, BOARD_SIZE, ZONE_H, SAFE_PAD } from '../lib/timing';

const { fontFamily } = loadFont();

const LOGO_TOP = 88; // pushed down so logo+badge feel centered in top zone

/**
 * 3-zone reel layout (1080x1920). Board is dead center, never moves.
 * Logo rendered here — not in stages — so it never shifts.
 */
export const ReelLayout: React.FC<{
  fen: string;
  orientation: 'white' | 'black';
  bottomContent?: React.ReactNode;
  boardOverlay?: React.ReactNode;
  highlightFrom?: string;
  highlightTo?: string;
  tier?: ReelTier;
}> = ({ fen, orientation, bottomContent, boardOverlay, highlightFrom, highlightTo, tier }) => {
  const frame = useCurrentFrame();

  // Ambulance-siren pulse for the DIFFICULT/IMPOSSIBLE pills: two opposite-phase glows
  // (red + blue) breathe in and out on a ~0.8s cycle. Subtle — the pill stays
  // red; only the glow alternates color.
  const SIREN_CYCLE = 24; // frames per full cycle (~0.8s at 30fps)
  const wave = (Math.sin((frame / SIREN_CYCLE) * Math.PI * 2) + 1) / 2; // 0..1
  const redGlow = 0.18 + 0.5 * wave;
  const blueGlow = 0.18 + 0.5 * (1 - wave);
  const difficultShadow = `0 0 36px rgba(255,75,75,${redGlow.toFixed(3)}), 0 0 44px rgba(56,132,255,${blueGlow.toFixed(3)})`;
  // IMPOSSIBLE: same pulse, but violet ↔ red over a near-black pill — reads as
  // one step past the red DIFFICULT pill.
  const impossibleShadow = `0 0 40px rgba(155,77,255,${redGlow.toFixed(3)}), 0 0 48px rgba(255,75,75,${blueGlow.toFixed(3)})`;

  const badge = {
    normal: {
      label: 'Daily Puzzle',
      background: 'linear-gradient(135deg, #58CC02 0%, #46a302 100%)',
      boxShadow: '0 8px 24px rgba(88,204,2,0.3)',
    },
    difficult: {
      label: 'Difficult Puzzle',
      background: 'linear-gradient(135deg, #FF4B4B 0%, #d63333 100%)',
      boxShadow: difficultShadow,
    },
    impossible: {
      label: 'Impossible Puzzle',
      background: 'linear-gradient(135deg, #1B1030 0%, #4B1D8F 100%)',
      boxShadow: impossibleShadow,
    },
  }[tier ?? 'normal'];

  return (
    <div
      style={{
        width: 1080,
        height: FRAME_H,
        position: 'relative',
        backgroundColor: '#EBF0F5',
        fontFamily,
        padding: SAFE_PAD,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* TOP ZONE */}
      <div style={{ height: ZONE_H - SAFE_PAD, position: 'relative' }}>
        {/* Logo — absolute, pixel-pinned */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: LOGO_TOP,
          }}
        >
          <ReelLogo />
        </div>
        {/* "Daily Puzzle" badge */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: LOGO_TOP + LOGO_H,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              borderRadius: 9999,
              paddingLeft: 48,
              paddingRight: 48,
              paddingTop: 8,
              paddingBottom: 8,
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: badge.background,
              color: '#fff',
              boxShadow: badge.boxShadow,
            }}
          >
            {badge.label}
          </span>
        </div>
      </div>

      {/* BOARD — centered, inset by SAFE_PAD */}
      <div style={{ position: 'relative', alignSelf: 'center' }}>
        <BoardSlot fen={fen} orientation={orientation} highlightFrom={highlightFrom} highlightTo={highlightTo} />
        {boardOverlay && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {boardOverlay}
          </div>
        )}
      </div>

      {/* BOTTOM ZONE */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          paddingTop: 24,
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>{bottomContent}</div>
        <FooterTagline />
      </div>
    </div>
  );
};
