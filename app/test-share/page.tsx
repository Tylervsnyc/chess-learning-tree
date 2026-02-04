'use client';

import React from 'react';
import { Chessboard } from 'react-chessboard';

// Back rank mate - Queen sacrifice into Rook checkmate
const DEMO_FEN = '3qr1k1/5ppp/8/8/4Q3/8/5PPP/4R1K1 w - - 0 1';
const DEMO_LAST_MOVE = { from: 'c8', to: 'd8' }; // Opponent's previous move

export default function TestSharePage() {
  // Square styles for highlights
  const getSquareStyles = (highlights: string[]) => {
    const styles: Record<string, React.CSSProperties> = {};
    for (const sq of highlights) {
      styles[sq] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
    }
    return styles;
  };

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <p className="text-[#58CC02] font-bold text-sm uppercase tracking-widest mb-2">Share Preview</p>
        <h1 className="text-4xl font-black">Share Card Design</h1>
        <p className="text-white/50 mt-2">Ready for Instagram & Twitter</p>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Static Image Card */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-[#58CC02]" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Static Image (PNG)</h2>
          </div>

          {/* Simple outer card */}
          <div
            className="relative overflow-hidden"
            style={{
              width: 380,
              backgroundColor: '#1A2C35',
              borderRadius: 20,
              padding: 24,
            }}
          >
            {/* Corner accents - top right and bottom left */}
            <div
              className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, transparent 50%, rgba(88, 204, 2, 0.12) 50%)',
                borderTopRightRadius: 20,
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none"
              style={{
                background: 'linear-gradient(-45deg, transparent 50%, rgba(88, 204, 2, 0.08) 50%)',
                borderBottomLeftRadius: 20,
              }}
            />

            {/* Logo */}
            <div className="flex justify-center mb-4 relative z-10">
              <img src="/brand/logo-horizontal-dark.svg" alt="Chess Path" style={{ height: 40 }} />
            </div>

            {/* Header */}
            <div className="text-center mb-4 relative z-10">
              <p className="text-white font-black text-2xl tracking-tight">I SOLVED this</p>
              <p className="text-[#58CC02] font-bold text-xl mt-1">tricky puzzle</p>
            </div>

            {/* Chessboard with 3D layered effect */}
            <div className="relative mb-4">
              {/* Back layers for depth */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: '#58CC02', transform: 'translate(6px, 6px)', opacity: 0.25 }}
              />
              <div
                className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: '#58CC02', transform: 'translate(3px, 3px)', opacity: 0.5 }}
              />
              {/* Board */}
              <div className="relative" style={{ borderRadius: 12, overflow: 'hidden', border: '2px solid #58CC02' }}>
                <Chessboard
                  options={{
                    position: DEMO_FEN,
                    boardOrientation: 'white',
                    squareStyles: getSquareStyles([DEMO_LAST_MOVE.from, DEMO_LAST_MOVE.to]),
                    darkSquareStyle: { backgroundColor: '#779952' },
                    lightSquareStyle: { backgroundColor: '#edeed1' },
                  }}
                />
              </div>
            </div>

            {/* White to move */}
            <div className="flex items-center justify-center gap-2 mb-4 relative z-10">
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
              <span className="text-white font-semibold text-lg">White to move</span>
            </div>

            {/* CTA Button with 3D effect */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: '#46A302', transform: 'translate(0, 4px)' }}
              />
              <div
                className="relative text-center py-4 rounded-xl overflow-hidden"
                style={{ backgroundColor: '#58CC02' }}
              >
                {/* Triangle accent on button */}
                <div
                  className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.15) 50%)' }}
                />
                <p className="text-white font-bold text-xl tracking-wide relative z-10">SWIPE TO SEE THE SOLUTION</p>
                <p className="text-white/80 text-sm mt-1 relative z-10">chesspath.app</p>
              </div>
            </div>
          </div>

          <p className="text-white/40 text-sm mt-6 text-center max-w-sm">
            This is what users see when they share a puzzle. The actual share button appears in the puzzle success popup.
          </p>
        </div>
      </div>
    </div>
  );
}
