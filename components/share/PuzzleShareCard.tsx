'use client';

import React from 'react';
import { Chessboard } from 'react-chessboard';

interface PuzzleShareCardProps {
  fen: string;
  playerColor: 'white' | 'black';
  lastMoveFrom?: string;
  lastMoveTo?: string;
}

/**
 * Static share card for a puzzle - renders at 1080x1080 for Instagram feed
 * Design matches the test-share page preview
 */
export function PuzzleShareCard({
  fen,
  playerColor,
  lastMoveFrom,
  lastMoveTo,
}: PuzzleShareCardProps) {
  const toMove = playerColor === 'white' ? 'White' : 'Black';

  // Highlight the opponent's last move
  const getSquareStyles = () => {
    const styles: Record<string, React.CSSProperties> = {};
    if (lastMoveFrom) {
      styles[lastMoveFrom] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
    }
    if (lastMoveTo) {
      styles[lastMoveTo] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
    }
    return styles;
  };

  return (
    <div
      id="puzzle-share-card"
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: '#1A2C35',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '80px 80px 100px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Corner accent - top right */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 350,
          height: 350,
          background: 'linear-gradient(135deg, transparent 50%, rgba(88, 204, 2, 0.12) 50%)',
        }}
      />
      {/* Corner accent - bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 280,
          height: 280,
          background: 'linear-gradient(-45deg, transparent 50%, rgba(88, 204, 2, 0.08) 50%)',
        }}
      />

      {/* Logo */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <img
          src="/brand/logo-stacked-dark.svg"
          alt="Chess Path"
          style={{ height: 320 }}
        />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <p
          style={{
            color: '#ffffff',
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          I SOLVED this
        </p>
        <p
          style={{
            color: '#58CC02',
            fontSize: 52,
            fontWeight: 700,
            margin: 0,
            marginTop: 8,
          }}
        >
          tricky puzzle
        </p>
      </div>

      {/* Chessboard with 3D layered effect */}
      <div style={{ position: 'relative', width: 840, height: 840 }}>
        {/* Back layers for depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 24,
            backgroundColor: '#58CC02',
            transform: 'translate(14px, 14px)',
            opacity: 0.25,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 24,
            backgroundColor: '#58CC02',
            transform: 'translate(7px, 7px)',
            opacity: 0.5,
          }}
        />
        {/* Board */}
        <div
          style={{
            position: 'relative',
            borderRadius: 20,
            overflow: 'hidden',
            border: '5px solid #58CC02',
            width: 840,
            height: 840,
          }}
        >
          <Chessboard
            options={{
              position: fen,
              boardOrientation: playerColor,
              squareStyles: getSquareStyles(),
              darkSquareStyle: { backgroundColor: '#779952' },
              lightSquareStyle: { backgroundColor: '#edeed1' },
            }}
          />
        </div>
      </div>

      {/* Player to move */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: playerColor === 'white' ? '#ffffff' : '#1a1a1a',
            border: playerColor === 'black' ? '3px solid #555' : 'none',
            boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
          }}
        />
        <span
          style={{
            color: '#ffffff',
            fontSize: 44,
            fontWeight: 600,
          }}
        >
          {toMove} to move
        </span>
      </div>

      {/* CTA Button with 3D effect */}
      <div style={{ position: 'relative', width: 840 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 28,
            backgroundColor: '#46A302',
            transform: 'translate(0, 10px)',
          }}
        />
        <div
          style={{
            position: 'relative',
            textAlign: 'center',
            padding: '40px 0',
            borderRadius: 28,
            backgroundColor: '#58CC02',
            overflow: 'hidden',
          }}
        >
          {/* Triangle accent on button */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 140,
              height: 140,
              background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.15) 50%)',
            }}
          />
          <p
            style={{
              color: '#ffffff',
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: '0.01em',
              margin: 0,
              position: 'relative',
              zIndex: 10,
            }}
          >
            Chesspath.app
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 32,
              fontWeight: 500,
              margin: 0,
              marginTop: 12,
              position: 'relative',
              zIndex: 10,
            }}
          >
            the shortest path to chess improvement
          </p>
        </div>
      </div>
    </div>
  );
}
