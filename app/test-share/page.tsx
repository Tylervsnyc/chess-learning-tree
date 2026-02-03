'use client';

import React, { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { generatePuzzleGif } from '@/lib/share/generate-puzzle-gif';

// Back rank mate - Queen sacrifice into Rook checkmate
// White sacs Queen on e8, Black recaptures, White delivers mate with Rook
const DEMO_FEN = '3qr1k1/5ppp/8/8/4Q3/8/5PPP/4R1K1 w - - 0 1';
const DEMO_SOLUTION = ['e4e8', 'd8e8', 'e1e8']; // 1.Qxe8+! Qxe8 2.Rxe8#
const DEMO_LAST_MOVE = { from: 'c8', to: 'd8' }; // Opponent's previous move (Queen to d8)

// Centered text logo component
function CenteredLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const fontSize = size === 'sm' ? 20 : size === 'md' ? 24 : 32;
  return (
    <div className="flex items-center justify-center gap-1">
      <span
        style={{
          color: '#ffffff',
          fontSize,
          fontWeight: 800,
          letterSpacing: '-0.02em',
        }}
      >
        chess
      </span>
      <span
        style={{
          fontSize,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        path
      </span>
    </div>
  );
}

export default function TestSharePage() {
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // For GIF generation - controllable board state
  const [gifBoardFen, setGifBoardFen] = useState(DEMO_FEN);
  const [gifHighlights, setGifHighlights] = useState<string[]>([DEMO_LAST_MOVE.from, DEMO_LAST_MOVE.to]);
  const boardRef = useRef<HTMLDivElement>(null);

  const generateGif = async () => {
    if (!boardRef.current) return;
    setGenerating(true);

    try {
      const blob = await generatePuzzleGif({
        fen: DEMO_FEN,
        moves: DEMO_SOLUTION,
        playerColor: 'white',
        lastMoveFrom: DEMO_LAST_MOVE.from,
        lastMoveTo: DEMO_LAST_MOVE.to,
        boardElement: boardRef.current,
        onPositionChange: async (fen, highlights) => {
          flushSync(() => {
            setGifBoardFen(fen);
            setGifHighlights(highlights);
          });
        },
      });
      setGifUrl(URL.createObjectURL(blob));
      // Reset board to starting position
      setGifBoardFen(DEMO_FEN);
      setGifHighlights([DEMO_LAST_MOVE.from, DEMO_LAST_MOVE.to]);
    } catch (error) {
      console.error('GIF generation failed:', error);
    }
    setGenerating(false);
  };

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
        <h1 className="text-4xl font-black">Marketing Assets</h1>
        <p className="text-white/50 mt-2">Ready for Instagram & Twitter</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Static Image Card */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-[#58CC02]" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Static Image</h2>
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
              <img src="/brand/logo-stacked-dark.svg" alt="Chess Path" style={{ height: 70 }} />
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
        </div>

        {/* GIF Preview */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-[#1CB0F6]" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Animated GIF</h2>
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
                background: 'linear-gradient(135deg, transparent 50%, rgba(28, 176, 246, 0.12) 50%)',
                borderTopRightRadius: 20,
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none"
              style={{
                background: 'linear-gradient(-45deg, transparent 50%, rgba(28, 176, 246, 0.08) 50%)',
                borderBottomLeftRadius: 20,
              }}
            />

            {/* Logo */}
            <div className="flex justify-center mb-4 relative z-10">
              <img src="/brand/logo-stacked-dark.svg" alt="Chess Path" style={{ height: 70 }} />
            </div>

            {/* Header */}
            <div className="text-center mb-4 relative z-10">
              <p className="text-white font-black text-2xl tracking-tight">THE SOLUTION</p>
            </div>

            {/* GIF/Board with 3D layered effect */}
            <div className="relative mb-4">
              {/* Back layers for depth */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: '#1CB0F6', transform: 'translate(6px, 6px)', opacity: 0.25 }}
              />
              <div
                className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: '#1CB0F6', transform: 'translate(3px, 3px)', opacity: 0.5 }}
              />
              {/* Content */}
              {gifUrl ? (
                <img
                  src={gifUrl}
                  alt="Puzzle solution"
                  className="relative"
                  style={{ borderRadius: 12, width: '100%', border: '2px solid #1CB0F6' }}
                />
              ) : (
                <div className="relative" style={{ borderRadius: 12, overflow: 'hidden', border: '2px solid #1CB0F6' }}>
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
              )}
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
                <p className="text-white font-bold text-lg tracking-wide relative z-10">Solve your own at</p>
                <p className="text-white font-black text-2xl mt-1 relative z-10">CHESSPATH.APP</p>
              </div>
            </div>
          </div>

          {/* Generate button with 3D effect */}
          <div className="relative mt-8">
            <div
              className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: '#0A8ACB', transform: 'translate(0, 4px)' }}
            />
            <button
              onClick={generateGif}
              disabled={generating}
              className="relative px-10 py-4 text-white font-bold text-lg rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-wait overflow-hidden"
              style={{ backgroundColor: '#1CB0F6' }}
            >
              {/* Triangle accent */}
              <div
                className="absolute top-0 right-0 w-12 h-12 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.2) 50%)' }}
              />
              <span className="relative z-10">
                {generating ? 'Generating GIF...' : gifUrl ? 'Regenerate GIF' : 'Generate GIF'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Board for GIF capture - off-screen but rendered */}
      <div
        style={{
          position: 'fixed',
          left: -9999,
          top: -9999,
          width: 480,
          height: 480,
        }}
      >
        <div
          ref={boardRef}
          style={{
            width: 480,
            height: 480,
          }}
        >
          <Chessboard
            options={{
              position: gifBoardFen,
              boardOrientation: 'white',
              squareStyles: getSquareStyles(gifHighlights),
              darkSquareStyle: { backgroundColor: '#779952' },
              lightSquareStyle: { backgroundColor: '#edeed1' },
              animationDurationInMs: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
