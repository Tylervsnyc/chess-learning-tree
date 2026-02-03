'use client';

import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { ChessProgressBar, progressBarStyles } from '@/components/puzzle/ChessProgressBar';

type DesignVariant = 1 | 2 | 3 | 4 | 5;

const DEMO_FEN = 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4';

export default function TestPuzzleDesigns() {
  const [activeDesign, setActiveDesign] = useState<DesignVariant>(1);
  const [showResult, setShowResult] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D1A1F]">
      <style>{progressBarStyles}</style>

      {/* Design Selector - compact */}
      <div className="sticky top-0 z-50 bg-[#0D1A1F] border-b border-white/10 px-2 py-2">
        <div className="flex gap-1 justify-center items-center">
          <span className="text-white/50 text-xs mr-2">Layout:</span>
          {([1, 2, 3, 4, 5] as DesignVariant[]).map((num) => (
            <button
              key={num}
              onClick={() => setActiveDesign(num)}
              className={`w-8 h-8 rounded-lg font-medium transition-all text-sm ${
                activeDesign === num
                  ? 'bg-[#58CC02] text-white'
                  : 'bg-[#1A2C35] text-white/70'
              }`}
            >
              {num}
            </button>
          ))}
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button
            onClick={() => setShowResult(!showResult)}
            className={`px-3 h-8 rounded-lg font-medium transition-all text-xs ${
              showResult
                ? 'bg-[#58CC02] text-white'
                : 'bg-[#1A2C35] text-white/70'
            }`}
          >
            {showResult ? 'Result ON' : 'Result OFF'}
          </button>
        </div>
      </div>

      {/* Active Design */}
      {activeDesign === 1 && <Design1 showResult={showResult} />}
      {activeDesign === 2 && <Design2 showResult={showResult} />}
      {activeDesign === 3 && <Design3 showResult={showResult} />}
      {activeDesign === 4 && <Design4 showResult={showResult} />}
      {activeDesign === 5 && <Design5 showResult={showResult} />}
    </div>
  );
}

// ============================================================================
// DESIGN 1: Current Layout (Baseline)
// ============================================================================
function Design1({ showResult }: { showResult: boolean }) {
  return (
    <div className="h-[calc(100vh-52px)] bg-[#131F24] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button className="text-gray-400 hover:text-white">✕</button>
          <div className="flex-1 mx-4">
            <ChessProgressBar current={3} total={6} streak={2} />
          </div>
          <div className="text-gray-400 text-sm">3/6</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-2 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Theme + Turn indicator */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-semibold text-gray-300">Fork Basics</h1>
            <span className="text-sm font-bold text-white">White to move</span>
          </div>

          {/* Chessboard */}
          <div className="relative">
            <Chessboard
              position={DEMO_FEN}
              boardOrientation="white"
              arePiecesDraggable={false}
              customBoardStyle={{
                borderRadius: showResult ? '8px 8px 0 0' : '8px',
              }}
              customDarkSquareStyle={{ backgroundColor: '#779952' }}
              customLightSquareStyle={{ backgroundColor: '#edeed1' }}
            />

            {/* Result popup - attached to board */}
            {showResult && (
              <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-[#D7FFB8] px-4 py-2.5 rounded-b-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#58CC02] flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                  <span className="text-base font-bold text-[#58CC02]">Nice fork!</span>
                </div>
                <button className="w-full py-2.5 bg-[#58CC02] text-white font-bold rounded-xl uppercase tracking-wide text-sm">
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DESIGN 2: Feedback as overlay on board
// ============================================================================
function Design2({ showResult }: { showResult: boolean }) {
  return (
    <div className="h-[calc(100vh-52px)] bg-[#131F24] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button className="text-gray-400 hover:text-white">✕</button>
          <div className="flex-1 mx-4">
            <ChessProgressBar current={3} total={6} streak={2} />
          </div>
          <div className="text-gray-400 text-sm">3/6</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-2 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Theme + Turn indicator */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-semibold text-gray-300">Fork Basics</h1>
            <span className="text-sm font-bold text-white">White to move</span>
          </div>

          {/* Chessboard with overlay */}
          <div className="relative">
            <Chessboard
              position={DEMO_FEN}
              boardOrientation="white"
              arePiecesDraggable={false}
              customBoardStyle={{ borderRadius: '8px' }}
              customDarkSquareStyle={{ backgroundColor: '#779952' }}
              customLightSquareStyle={{ backgroundColor: '#edeed1' }}
            />

            {/* Overlay result on bottom of board */}
            {showResult && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#58CC02] to-[#58CC02]/90 px-4 py-3 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="text-white font-bold">Nice fork!</span>
                  </div>
                  <button className="px-4 py-1.5 bg-white text-[#58CC02] font-bold rounded-lg text-sm">
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DESIGN 3: Centered title, minimal chrome
// ============================================================================
function Design3({ showResult }: { showResult: boolean }) {
  return (
    <div className="h-[calc(100vh-52px)] bg-[#131F24] text-white flex flex-col overflow-hidden">
      {/* Minimal header */}
      <div className="px-4 py-2 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button className="text-gray-400 hover:text-white">✕</button>
          <div className="flex-1">
            <ChessProgressBar current={3} total={6} streak={2} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Centered title with turn pill */}
          <div className="text-center mb-2">
            <h1 className="text-base font-semibold text-white">Fork Basics</h1>
            <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 bg-white/10 rounded-full">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
              <span className="text-xs text-white/70">White to move</span>
            </div>
          </div>

          {/* Chessboard */}
          <div className="relative">
            <Chessboard
              position={DEMO_FEN}
              boardOrientation="white"
              arePiecesDraggable={false}
              customBoardStyle={{
                borderRadius: showResult ? '8px 8px 0 0' : '8px',
              }}
              customDarkSquareStyle={{ backgroundColor: '#779952' }}
              customLightSquareStyle={{ backgroundColor: '#edeed1' }}
            />

            {showResult && (
              <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-[#D7FFB8] px-4 py-2.5 rounded-b-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#58CC02] flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                  <span className="text-base font-bold text-[#58CC02]">Nice fork!</span>
                </div>
                <button className="w-full py-2.5 bg-[#58CC02] text-white font-bold rounded-xl uppercase tracking-wide text-sm">
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DESIGN 4: Fixed bottom bar for actions
// ============================================================================
function Design4({ showResult }: { showResult: boolean }) {
  return (
    <div className="h-[calc(100vh-52px)] bg-[#131F24] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button className="text-gray-400 hover:text-white">✕</button>
          <div className="flex-1 mx-4">
            <ChessProgressBar current={3} total={6} streak={2} />
          </div>
          <div className="text-gray-400 text-sm">3/6</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-2 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Theme + Turn indicator */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-semibold text-gray-300">Fork Basics</h1>
            <span className="text-sm font-bold text-white">White to move</span>
          </div>

          {/* Chessboard */}
          <Chessboard
            position={DEMO_FEN}
            boardOrientation="white"
            arePiecesDraggable={false}
            customBoardStyle={{ borderRadius: '8px' }}
            customDarkSquareStyle={{ backgroundColor: '#779952' }}
            customLightSquareStyle={{ backgroundColor: '#edeed1' }}
          />

          {/* Inline feedback (no button here) */}
          {showResult && (
            <div className="mt-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#58CC02] flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <span className="text-[#58CC02] font-bold text-sm">Nice fork!</span>
              <span className="text-white/50 text-xs">Knight attacks both pieces</span>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom action bar */}
      {showResult && (
        <div className="flex-shrink-0 bg-[#1A2C35] border-t border-white/10 px-4 py-3">
          <div className="max-w-lg mx-auto">
            <button className="w-full py-3 bg-[#58CC02] text-white font-bold rounded-xl text-base shadow-[0_4px_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_#46A302] transition-all">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DESIGN 5: Full-width bottom sheet style
// ============================================================================
function Design5({ showResult }: { showResult: boolean }) {
  return (
    <div className="h-[calc(100vh-52px)] bg-[#131F24] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button className="text-gray-400 hover:text-white">✕</button>
          <div className="flex-1 mx-4">
            <ChessProgressBar current={3} total={6} streak={2} />
          </div>
          <div className="text-gray-400 text-sm">3/6</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-2 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Theme + Turn indicator */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-semibold text-gray-300">Fork Basics</h1>
            <span className="text-sm font-bold text-white">White to move</span>
          </div>

          {/* Chessboard */}
          <Chessboard
            position={DEMO_FEN}
            boardOrientation="white"
            arePiecesDraggable={false}
            customBoardStyle={{ borderRadius: '8px' }}
            customDarkSquareStyle={{ backgroundColor: '#779952' }}
            customLightSquareStyle={{ backgroundColor: '#edeed1' }}
          />
        </div>
      </div>

      {/* Bottom sheet result */}
      {showResult && (
        <div className="flex-shrink-0 bg-[#D7FFB8] px-4 py-4 rounded-t-3xl">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#58CC02] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <div>
                <div className="text-[#58CC02] font-bold text-lg">Nice fork!</div>
                <div className="text-[#58CC02]/70 text-sm">Knight attacks both pieces</div>
              </div>
            </div>
            <button className="w-full py-3 bg-[#58CC02] text-white font-bold rounded-xl text-base shadow-[0_4px_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_#46A302] transition-all">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
