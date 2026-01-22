'use client';

import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { THEME_EXPLANATIONS, getAllThemeIds } from '@/data/theme-explanations';

type ThemeKey = keyof typeof THEME_EXPLANATIONS;

// Test Page - Show all boards at once with arrows
export default function TestThemeHelpPage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey | null>(null);

  const themes = getAllThemeIds() as ThemeKey[];

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Theme Explanation Preview</h1>
        <p className="text-white/60 mb-6">
          Review all theme positions with arrows and highlights showing the tactics.
        </p>

        {/* Grid of all themes with boards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => {
            const data = THEME_EXPLANATIONS[theme];
            return (
              <div
                key={theme}
                className="bg-[#1A2C35] rounded-xl p-4 border border-white/10 cursor-pointer hover:border-[#1CB0F6]/50 transition-colors"
                onClick={() => setSelectedTheme(theme)}
              >
                {/* Theme Name */}
                <h3 className="font-bold text-lg mb-1 text-[#1CB0F6]">{data.name}</h3>

                {/* Who to move */}
                <p className="text-white/50 text-xs mb-2">{data.toMove}</p>

                {/* Chess Board with highlights */}
                <div className="w-full aspect-square mb-3">
                  <Chessboard
                    options={{
                      position: data.exampleFen,
                      squareStyles: data.highlights,
                      boardStyle: { borderRadius: '8px' },
                      darkSquareStyle: { backgroundColor: '#769656' },
                      lightSquareStyle: { backgroundColor: '#eeeed2' },
                    }}
                  />
                </div>

                {/* Description */}
                <p className="text-white/80 text-sm leading-relaxed">
                  {data.exampleDescription}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for full view */}
      {selectedTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedTheme(null)}
          />
          <div className="relative bg-[#1A2C35] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
            {/* Header */}
            <div className="sticky top-0 bg-[#1A2C35] px-4 py-3 border-b border-white/10 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1CB0F6]/20 border border-[#1CB0F6]/50 text-[#1CB0F6] text-sm">?</span>
                {THEME_EXPLANATIONS[selectedTheme].name}
              </h2>
              <button
                onClick={() => setSelectedTheme(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <p className="text-white/90 text-base leading-relaxed">
                {THEME_EXPLANATIONS[selectedTheme].description}
              </p>

              <div className="bg-[#131F24] rounded-xl p-3">
                <p className="text-[#1CB0F6] text-sm font-semibold mb-2">Example Position</p>
                <p className="text-white/50 text-xs mb-2">{THEME_EXPLANATIONS[selectedTheme].toMove}</p>
                <div className="w-full aspect-square max-w-[300px] mx-auto">
                  <Chessboard
                    options={{
                      position: THEME_EXPLANATIONS[selectedTheme].exampleFen,
                      squareStyles: THEME_EXPLANATIONS[selectedTheme].highlights,
                      boardStyle: { borderRadius: '8px' },
                      darkSquareStyle: { backgroundColor: '#769656' },
                      lightSquareStyle: { backgroundColor: '#eeeed2' },
                    }}
                  />
                </div>
                <p className="text-white/70 text-sm mt-3 leading-relaxed">
                  {THEME_EXPLANATIONS[selectedTheme].exampleDescription}
                </p>
              </div>

              <div>
                <p className="text-[#58CC02] text-sm font-semibold mb-2">Key Points</p>
                <ul className="space-y-2">
                  {THEME_EXPLANATIONS[selectedTheme].keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-white/80 text-sm">
                      <span className="text-[#58CC02] mt-0.5">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-[#1A2C35] px-4 py-3 border-t border-white/10">
              <button
                onClick={() => setSelectedTheme(null)}
                className="w-full py-3 bg-[#58CC02] text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_#46A302] transition-all"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
