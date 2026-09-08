import React from 'react';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { AppStoreBadge } from './AppStoreBadge';

const { fontFamily } = loadFont();

/**
 * Footer row — "chesspath.app" plus the App Store badge, on every stage.
 * The badge lives here (not only on the end card) so a viewer who bails
 * mid-reel has still seen that the apps exist on iOS.
 */
export const FooterTagline: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
      }}
    >
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
      <AppStoreBadge height={64} />
    </div>
  );
};
