import React from 'react';
import { loadFont } from '@remotion/google-fonts/DMSans';

const { fontFamily } = loadFont();

/**
 * Dark overlay result badge on the board (stage 4).
 * 4x scale: 18px → 72px, px-5 → 80px, py-3 → 48px.
 */
export const ResultPopup: React.FC<{ result: string }> = ({ result }) => {
  return (
    <div
      style={{
        borderRadius: 32,
        paddingLeft: 80,
        paddingRight: 80,
        paddingTop: 48,
        paddingBottom: 48,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 32px 96px rgba(0,0,0,0.4)',
      }}
    >
      <p
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 72,
          color: '#FFFFFF',
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        {result}
      </p>
    </div>
  );
};
