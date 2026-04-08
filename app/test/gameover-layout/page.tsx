'use client';

import React, { useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';

const SAMPLE_FEN = 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4';

function PlayerLabel({ color, name }: { color: 'white' | 'black'; name: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: color === 'white' ? '#e8e8e8' : '#2A3C45' }}
      />
      <span className="text-[10px] font-bold text-chess-text">{name}</span>
    </div>
  );
}

export default function GameOverLayoutTest() {
  const [accuracy, setAccuracy] = useState(72);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [resultText, setResultText] = useState('You won by checkmate!');

  return (
    <div className="h-[100dvh] bg-chess-page text-chess-text flex flex-col overflow-auto">
      <div className="h-2 flex-shrink-0" />

      {/* Controls */}
      <div className="px-4 pb-2 space-y-2">
        <p className="text-xs font-bold text-chess-text-muted">Test Controls</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setResultText('You won by checkmate!')} className="text-xs px-2 py-1 bg-chess-green text-white rounded">Win</button>
          <button onClick={() => setResultText('Rookie wins. Better luck next time.')} className="text-xs px-2 py-1 bg-red-500 text-white rounded">Loss</button>
          <button onClick={() => setResultText('Draw by stalemate.')} className="text-xs px-2 py-1 bg-amber-500 text-white rounded">Draw</button>
          <button onClick={() => setShowAnalysis(!showAnalysis)} className="text-xs px-2 py-1 bg-chess-surface border border-chess-disabled rounded">{showAnalysis ? 'Hide' : 'Show'} Accuracy</button>
          <input type="range" min={20} max={100} value={accuracy} onChange={e => setAccuracy(+e.target.value)} className="w-24" />
          <span className="text-xs font-bold">{accuracy}%</span>
        </div>
      </div>

      {/* Game layout */}
      <div className="flex-1 flex items-start justify-center px-4 pt-2 min-h-0">
        <div className="w-full max-w-lg">

          {/* Above board: Rookie with speech bubble */}
          <div className="flex items-start gap-2.5 pb-2 min-h-[72px] relative z-10 overflow-visible">
            <div className="flex-shrink-0 pt-0.5">
              <BreathingRook size="sm" mood="happy" animate />
            </div>
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div
                  className="absolute top-3 -left-[6px] w-2.5 h-2.5 bg-chess-surface rotate-45 rounded-[2px]"
                  style={{ boxShadow: '-1px 1px 2px rgba(0,0,0,0.04)' }}
                />
                <div className="relative bg-chess-surface rounded-xl px-3 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]">
                  <p className="text-chess-text text-[13px] leading-relaxed font-medium">
                    {resultText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top player */}
          <div className="flex justify-between items-center mb-0.5">
            <PlayerLabel color="black" name="Rookie" />
          </div>

          {/* Board */}
          <ChessPathBoard
            options={{
              position: SAMPLE_FEN,
              boardOrientation: 'white',
              animationDurationInMs: 200,
            }}
          />

          {/* Below board */}
          <div className="mt-0.5 space-y-1">
            <div className="flex justify-between items-center">
              <PlayerLabel color="white" name="Tyler" />
            </div>

            {/* Gameover content */}
            <div className="space-y-2 pt-1">
              {showAnalysis && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-semibold text-chess-text-muted">Accuracy</span>
                  <span className={`text-lg font-black ${
                    accuracy >= 80 ? 'text-chess-green' :
                    accuracy >= 60 ? 'text-amber-400' : 'text-red-400'
                  }`}>{accuracy}%</span>
                </div>
              )}
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-chess-green text-white font-bold rounded-xl text-sm">
                  Play Again
                </button>
                <button className="flex-1 py-2 bg-chess-surface border border-chess-disabled text-chess-text font-bold rounded-xl text-sm">
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
