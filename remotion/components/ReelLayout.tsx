import React from 'react';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { ReelLogo, LOGO_H } from './ReelLogo';
import { BoardSlot } from './BoardSlot';
import { FooterTagline } from './FooterTagline';
import { FRAME_H, BOARD_SIZE, ZONE_H } from '../lib/timing';

const { fontFamily } = loadFont();

const LOGO_TOP = 72; // pushed down so logo+badge feel centered in top zone

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
}> = ({ fen, orientation, bottomContent, boardOverlay, highlightFrom, highlightTo }) => {
  return (
    <div
      style={{
        width: 1080,
        height: FRAME_H,
        position: 'relative',
        backgroundColor: '#EBF0F5',
        fontFamily,
      }}
    >
      {/* TOP ZONE */}
      <div style={{ height: ZONE_H, position: 'relative' }}>
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
            padding: '0 48px',
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
              background: 'linear-gradient(135deg, #58CC02 0%, #46a302 100%)',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(88,204,2,0.3)',
            }}
          >
            Daily Puzzle
          </span>
        </div>
      </div>

      {/* BOARD — dead center */}
      <div style={{ position: 'relative' }}>
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
          height: ZONE_H,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          paddingTop: 48,
          paddingBottom: 32,
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>{bottomContent}</div>
        <FooterTagline />
      </div>
    </div>
  );
};
