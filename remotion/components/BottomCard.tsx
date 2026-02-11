import React from 'react';

/**
 * 3D layered card (4x scale from test page).
 * Green border, depth layers, corner accent.
 */
const CARD_COLOR = '#58CC02';
const CARD_H = 224; // 56 * 4

export const BottomCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ width: '100%', paddingLeft: 48, paddingRight: 48, height: CARD_H }}>
      <div style={{ position: 'relative', height: '100%' }}>
        {/* Back depth layers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 32,
            backgroundColor: CARD_COLOR,
            transform: 'translate(20px, 20px)',
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 32,
            backgroundColor: CARD_COLOR,
            transform: 'translate(10px, 10px)',
            opacity: 0.4,
          }}
        />
        {/* Main card */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 32,
            border: `8px solid ${CARD_COLOR}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: '#1a2a33',
            boxShadow: '0 32px 64px rgba(0,0,0,0.2)',
          }}
        >
          {/* Corner accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 48 * 4,
              height: 48 * 4,
              background: `linear-gradient(135deg, transparent 50%, ${CARD_COLOR}20 50%)`,
              borderTopRightRadius: 16 * 4,
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 48px' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
