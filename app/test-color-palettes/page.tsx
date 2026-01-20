'use client';

import { useState } from 'react';

// Official Duolingo colors
const DUO_COLORS = {
  featherGreen: '#58CC02',
  maskGreen: '#89E219',
  blue: '#1CB0F6',
  red: '#FF4B4B',
  orange: '#FF9600',
  yellow: '#FFC800',
  purple: '#CE82FF',
  white: '#FFFFFF',
  eel: '#4B4B4B',
};

// 10 different 5-color combinations using Duo colors
const PALETTES = [
  {
    name: 'Classic Duo',
    colors: [DUO_COLORS.featherGreen, DUO_COLORS.blue, DUO_COLORS.orange, DUO_COLORS.yellow, DUO_COLORS.purple],
  },
  {
    name: 'Green Focus',
    colors: [DUO_COLORS.featherGreen, DUO_COLORS.maskGreen, DUO_COLORS.blue, DUO_COLORS.yellow, DUO_COLORS.purple],
  },
  {
    name: 'Warm Duo',
    colors: [DUO_COLORS.featherGreen, DUO_COLORS.orange, DUO_COLORS.yellow, DUO_COLORS.red, DUO_COLORS.purple],
  },
  {
    name: 'Cool Duo',
    colors: [DUO_COLORS.featherGreen, DUO_COLORS.blue, DUO_COLORS.purple, DUO_COLORS.maskGreen, DUO_COLORS.yellow],
  },
  {
    name: 'High Energy',
    colors: [DUO_COLORS.featherGreen, DUO_COLORS.red, DUO_COLORS.orange, DUO_COLORS.yellow, DUO_COLORS.blue],
  },
  {
    name: 'Muted Start',
    colors: [DUO_COLORS.maskGreen, DUO_COLORS.blue, DUO_COLORS.purple, DUO_COLORS.orange, DUO_COLORS.yellow],
  },
  {
    name: 'Bold Primary',
    colors: [DUO_COLORS.featherGreen, DUO_COLORS.red, DUO_COLORS.blue, DUO_COLORS.yellow, DUO_COLORS.orange],
  },
  {
    name: 'Purple Lead',
    colors: [DUO_COLORS.purple, DUO_COLORS.featherGreen, DUO_COLORS.blue, DUO_COLORS.yellow, DUO_COLORS.orange],
  },
  {
    name: 'Blue Lead',
    colors: [DUO_COLORS.blue, DUO_COLORS.featherGreen, DUO_COLORS.purple, DUO_COLORS.orange, DUO_COLORS.yellow],
  },
  {
    name: 'Full Spectrum',
    colors: [DUO_COLORS.red, DUO_COLORS.orange, DUO_COLORS.yellow, DUO_COLORS.featherGreen, DUO_COLORS.blue],
  },
];

// Background options
const BACKGROUNDS = {
  dark1: { bg: '#0A0A0A', surface: '#141414', name: 'Pure Dark' },
  dark2: { bg: '#0D1117', surface: '#161B22', name: 'GitHub Dark' },
  dark3: { bg: '#131F24', surface: '#1A2C35', name: 'Current (Teal)' },
};

// 5 neon intensity levels
const INTENSITIES = [
  { name: 'Flat', glow: 0, textGlow: 0 },
  { name: 'Soft', glow: 8, textGlow: 4 },
  { name: 'Medium', glow: 16, textGlow: 8 },
  { name: 'Bright', glow: 28, textGlow: 14 },
  { name: 'Neon', glow: 44, textGlow: 22 },
];

interface MiniChessPathProps {
  colors: string[];
  bg: string;
  surface: string;
  intensity: typeof INTENSITIES[0];
}

function MiniChessPath({ colors, bg, surface, intensity }: MiniChessPathProps) {
  const { glow, textGlow } = intensity;
  const [c1, c2, c3] = colors;

  const boxGlow = (color: string) =>
    glow > 0 ? `0 0 ${glow}px ${color}50, 0 0 ${glow * 2}px ${color}25` : 'none';

  const txtGlow = (color: string) =>
    textGlow > 0 ? `0 0 ${textGlow}px ${color}` : 'none';

  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: bg }}>
      {/* Header */}
      <div
        className="text-center text-[11px] font-bold mb-2 tracking-wide"
        style={{ color: c1, textShadow: txtGlow(c1) }}
      >
        THE CHESS PATH
      </div>

      {/* Level tabs - shows 5 colors */}
      <div className="flex gap-1 mb-2">
        {['1', '2', '3', '4', '5'].map((level, i) => (
          <button
            key={level}
            className="flex-1 py-1 text-[9px] font-bold rounded-md"
            style={{
              backgroundColor: i === 0 ? colors[i] : surface,
              color: i === 0 ? bg : colors[i],
              border: `1px solid ${colors[i]}${i === 0 ? '' : '40'}`,
              boxShadow: i === 0 ? boxGlow(colors[i]) : 'none',
              textShadow: i !== 0 ? txtGlow(colors[i]) : 'none',
            }}
          >
            L{level}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full mb-2 overflow-hidden" style={{ backgroundColor: surface }}>
        <div
          className="h-full rounded-full"
          style={{
            width: '40%',
            backgroundColor: c1,
            boxShadow: glow > 0 ? `0 0 ${glow}px ${c1}` : 'none',
          }}
        />
      </div>

      {/* Module cards */}
      <div className="space-y-1.5">
        {/* Completed - color 1 */}
        <div
          className="rounded-lg p-2"
          style={{ backgroundColor: c1, boxShadow: boxGlow(c1) }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-black/20 flex items-center justify-center text-[8px] text-white font-bold">✓</div>
            <span className="text-[9px] font-semibold text-white">Module 1</span>
          </div>
        </div>

        {/* Active - color 2 */}
        <div
          className="rounded-lg p-2 border"
          style={{
            backgroundColor: surface,
            borderColor: `${c2}50`,
            boxShadow: glow > 0 ? `0 0 ${glow/2}px ${c2}30, inset 0 0 ${glow}px ${c2}10` : 'none',
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold"
              style={{ backgroundColor: c2, color: bg, boxShadow: glow > 0 ? `0 0 ${glow/2}px ${c2}` : 'none' }}
            >
              2
            </div>
            <span className="text-[9px] font-semibold" style={{ color: c2, textShadow: txtGlow(c2) }}>Module 2</span>
          </div>
        </div>

        {/* Locked - color 3 */}
        <div
          className="rounded-lg p-2 border opacity-50"
          style={{ backgroundColor: surface, borderColor: `${c3}30` }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-[8px]"
              style={{ backgroundColor: `${c3}20`, color: `${c3}80` }}
            >
              🔒
            </div>
            <span className="text-[9px]" style={{ color: `${c3}60` }}>Module 3</span>
          </div>
        </div>
      </div>

      {/* Color swatches */}
      <div className="flex gap-1 mt-2 justify-center">
        {colors.map((color, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded border border-white/20"
            style={{
              backgroundColor: color,
              boxShadow: glow > 0 ? `0 0 ${glow/4}px ${color}` : 'none',
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}

export default function TestColorPalettes() {
  const [selectedPalette, setSelectedPalette] = useState<number | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<number | null>(null);
  const [selectedBg, setSelectedBg] = useState<keyof typeof BACKGROUNDS>('dark3');

  const bgOption = BACKGROUNDS[selectedBg];

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#050505' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold mb-1">Official Duolingo Colors</h1>
          <p className="text-gray-400 text-sm mb-3">
            All colors from design.duolingo.com — pick 5 + glow intensity
          </p>

          {/* All Duo colors reference */}
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(DUO_COLORS).map(([name, hex]) => (
              <div key={name} className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: hex }} />
                <span className="text-xs text-gray-400">{name}</span>
                <span className="text-xs font-mono text-gray-500">{hex}</span>
              </div>
            ))}
          </div>

          {/* Background selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Background:</span>
            {Object.entries(BACKGROUNDS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelectedBg(key as keyof typeof BACKGROUNDS)}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                  selectedBg === key
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <span className="inline-block w-3 h-3 rounded mr-1.5" style={{ backgroundColor: val.bg }} />
                {val.name}
              </button>
            ))}
          </div>

          {selectedPalette !== null && selectedIntensity !== null && (
            <div className="mt-3 p-2 rounded-lg text-sm flex items-center gap-2 bg-white/5">
              <span className="text-green-400">✓</span>
              <strong>{PALETTES[selectedPalette].name}</strong>
              <span className="text-gray-500">+</span>
              <strong>{INTENSITIES[selectedIntensity].name}</strong>
              <span className="text-gray-500">+</span>
              <strong>{bgOption.name}</strong>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Intensity legend */}
        <div className="flex justify-center gap-8 mb-6 text-sm border-b border-gray-800 pb-4">
          {INTENSITIES.map((int, i) => (
            <div key={i} className="text-center">
              <div className="text-gray-600 text-[10px] uppercase tracking-wider mb-1">Level {i + 1}</div>
              <div className="font-semibold text-gray-300">{int.name}</div>
              <div className="text-[10px] text-gray-600">{int.glow}px glow</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="space-y-6">
          {PALETTES.map((palette, pIndex) => (
            <div key={pIndex} className="border border-gray-800 rounded-2xl p-4 bg-[#0A0A0A]">
              {/* Palette header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: color, color: '#000' }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="font-bold text-lg text-white">{pIndex + 1}. {palette.name}</div>
              </div>

              {/* 5 intensity variations */}
              <div className="grid grid-cols-5 gap-3">
                {INTENSITIES.map((intensity, iIndex) => {
                  const isSelected = selectedPalette === pIndex && selectedIntensity === iIndex;
                  return (
                    <button
                      key={iIndex}
                      onClick={() => {
                        setSelectedPalette(pIndex);
                        setSelectedIntensity(iIndex);
                      }}
                      className={`rounded-xl border-2 transition-all hover:scale-[1.02] overflow-hidden ${
                        isSelected
                          ? 'border-white ring-2 ring-white/30'
                          : 'border-transparent hover:border-gray-700'
                      }`}
                    >
                      <MiniChessPath
                        colors={palette.colors}
                        bg={bgOption.bg}
                        surface={bgOption.surface}
                        intensity={intensity}
                      />
                      <div className="text-[10px] text-center py-1.5 font-medium bg-black/50 text-gray-400">
                        {intensity.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Selected details */}
        {selectedPalette !== null && selectedIntensity !== null && (
          <div className="sticky bottom-4 mt-8">
            <div className="border border-gray-700 rounded-2xl p-5 shadow-2xl" style={{ backgroundColor: bgOption.bg }}>
              <h2 className="font-bold mb-4 text-lg">
                {PALETTES[selectedPalette].name} + {INTENSITIES[selectedIntensity].name}
              </h2>

              <div className="grid grid-cols-5 gap-4 mb-4">
                {PALETTES[selectedPalette].colors.map((color, i) => (
                  <div key={i}>
                    <div
                      className="h-16 rounded-xl mb-2 border border-white/10 flex items-center justify-center text-2xl font-bold"
                      style={{
                        backgroundColor: color,
                        color: '#000',
                        boxShadow: INTENSITIES[selectedIntensity].glow > 0
                          ? `0 0 ${INTENSITIES[selectedIntensity].glow}px ${color}60`
                          : 'none',
                      }}
                    >
                      {i + 1}
                    </div>
                    <div className="font-mono text-xs text-center text-gray-300">{color}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl font-mono text-xs bg-black/30">
                <div className="text-gray-500 mb-2">// Your palette:</div>
                <div className="text-gray-300">
{`const COLORS = {
  bg: '${bgOption.bg}',
  surface: '${bgOption.surface}',
  primary: '${PALETTES[selectedPalette].colors[0]}',
  secondary: '${PALETTES[selectedPalette].colors[1]}',
  accent1: '${PALETTES[selectedPalette].colors[2]}',
  accent2: '${PALETTES[selectedPalette].colors[3]}',
  accent3: '${PALETTES[selectedPalette].colors[4]}',
};

const GLOW = ${INTENSITIES[selectedIntensity].glow}; // px`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
