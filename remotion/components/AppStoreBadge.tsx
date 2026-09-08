import React from 'react';
import { loadFont } from '@remotion/google-fonts/DMSans';

const { fontFamily } = loadFont();

const APPLE_PATH =
  'M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z';

/**
 * "Download on the App Store" pill — the black Apple badge, drawn so it scales
 * cleanly at reel resolution. Shown on every stage of the daily puzzle video
 * so the store is on screen the whole time, not only on the end card.
 */
export const AppStoreBadge: React.FC<{ height?: number }> = ({ height = 68 }) => {
  const glyph = height * 0.62;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: height * 0.2,
        height,
        paddingLeft: height * 0.34,
        paddingRight: height * 0.42,
        borderRadius: height * 0.22,
        backgroundColor: '#000000',
        boxShadow: '0 6px 18px rgba(42,60,69,0.22)',
      }}
    >
      <svg
        width={glyph * 0.814}
        height={glyph}
        viewBox="0 0 814 1000"
        style={{ display: 'block', marginTop: -height * 0.04 }}
      >
        <path d={APPLE_PATH} fill="#FFFFFF" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span
          style={{
            fontFamily,
            fontWeight: 500,
            fontSize: height * 0.2,
            lineHeight: 1.1,
            letterSpacing: '0.02em',
            color: '#FFFFFF',
          }}
        >
          Download on the
        </span>
        <span
          style={{
            fontFamily,
            fontWeight: 600,
            fontSize: height * 0.36,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            color: '#FFFFFF',
          }}
        >
          App Store
        </span>
      </div>
    </div>
  );
};
