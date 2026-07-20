import React from 'react';
import { loadFont } from '../lib/dm-sans';
import { ReelLogo, LOGO_H } from './ReelLogo';
import { BoardSlot } from './BoardSlot';
import { FooterTagline } from './FooterTagline';
import { FRAME_H, BOARD_SIZE, ZONE_H, SAFE_PAD } from '../lib/timing';

const { fontFamily } = loadFont();

const LOGO_TOP = 88; // pushed down so logo+badge feel centered in top zone
const LOGO_TOP_WITH_SUBTEXT = 24; // lifted so badge + subtext line both fit above the board

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
  badgeText?: string;
  badgeGradient?: string;
  badgeShadow?: string;
  badgeSubtext?: string;
}> = ({
  fen,
  orientation,
  bottomContent,
  boardOverlay,
  highlightFrom,
  highlightTo,
  badgeText = 'Daily Puzzle',
  badgeGradient = 'linear-gradient(135deg, #58CC02 0%, #46a302 100%)',
  badgeShadow = '0 8px 24px rgba(88,204,2,0.3)',
  badgeSubtext,
}) => {
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
            top: badgeSubtext ? LOGO_TOP_WITH_SUBTEXT : LOGO_TOP,
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
            top: (badgeSubtext ? LOGO_TOP_WITH_SUBTEXT : LOGO_TOP) + LOGO_H,
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
              background: badgeGradient,
              color: '#fff',
              boxShadow: badgeShadow,
            }}
          >
            {badgeText}
          </span>
          {badgeSubtext && (
            <span
              style={{
                marginTop: 18,
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#2A3C45',
              }}
            >
              {badgeSubtext}
            </span>
          )}
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
