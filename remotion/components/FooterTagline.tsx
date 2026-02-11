import React from 'react';
import { loadFont } from '@remotion/google-fonts/DMSans';

const { fontFamily } = loadFont();

/**
 * "chesspath.app" footer — every stage.
 * 4x scale: 11px → 44px.
 */
export const FooterTagline: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <p
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: '0.05em',
          color: '#2A3C45',
          margin: 0,
        }}
      >
        chesspath.app
      </p>
    </div>
  );
};
