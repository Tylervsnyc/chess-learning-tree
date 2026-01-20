'use client';

import { useState } from 'react';

// Different progress bar style options
const STYLE_OPTIONS = {
  // Option 1: Gradual green to gold to rainbow
  gradualRainbow: (progress: number, streak: number) => {
    // Phase 1 (0-30%): Solid green
    if (progress < 0.3) {
      return {
        background: '#58CC02',
      };
    }
    // Phase 2 (30-60%): Green to teal gradient
    if (progress < 0.6) {
      const blend = (progress - 0.3) / 0.3;
      return {
        background: `linear-gradient(90deg, #58CC02 0%, #2DD4BF ${blend * 100}%)`,
      };
    }
    // Phase 3 (60-80%): Teal to gold
    if (progress < 0.8) {
      const blend = (progress - 0.6) / 0.2;
      return {
        background: `linear-gradient(90deg, #58CC02 0%, #2DD4BF 50%, #F59E0B ${blend * 100}%)`,
      };
    }
    // Phase 4 (80-100%): Full spectrum
    const intensity = (progress - 0.8) / 0.2;
    return {
      background: `linear-gradient(90deg,
        #58CC02 0%,
        #2DD4BF 25%,
        #F59E0B 50%,
        #EC4899 75%,
        #8B5CF6 100%)`,
      boxShadow: `0 0 ${intensity * 15}px rgba(236, 72, 153, ${intensity * 0.5})`,
    };
  },

  // Option 2: Intensity-based glow
  glowIntensity: (progress: number, streak: number) => {
    const glowSize = progress * 20;
    const glowOpacity = progress * 0.6;

    // Color shifts from green -> cyan -> blue -> purple
    const hue = 120 - (progress * 180); // 120 (green) to -60 (purple)

    return {
      background: `hsl(${hue}, 80%, 50%)`,
      boxShadow: progress > 0.3
        ? `0 0 ${glowSize}px hsla(${hue}, 80%, 50%, ${glowOpacity})`
        : 'none',
    };
  },

  // Option 3: Duolingo-style with streak multiplier
  streakMultiplier: (progress: number, streak: number) => {
    const baseColor = '#58CC02';

    if (streak < 2) {
      return { background: baseColor };
    }
    if (streak < 4) {
      return {
        background: `linear-gradient(90deg, ${baseColor}, #84CC16)`,
        boxShadow: '0 0 8px rgba(132, 204, 22, 0.4)',
      };
    }
    if (streak < 6) {
      return {
        background: `linear-gradient(90deg, #84CC16, #FBBF24)`,
        boxShadow: '0 0 12px rgba(251, 191, 36, 0.5)',
      };
    }
    if (streak < 8) {
      return {
        background: `linear-gradient(90deg, #FBBF24, #F97316)`,
        boxShadow: '0 0 15px rgba(249, 115, 22, 0.5)',
        animation: 'pulse 2s ease-in-out infinite',
      };
    }
    // 8+ streak: Fire mode
    return {
      background: `linear-gradient(90deg, #F97316, #EF4444, #F97316)`,
      backgroundSize: '200% 100%',
      animation: 'fireFlow 1s ease-in-out infinite',
      boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
    };
  },

  // Option 4: Energy bar (game-style)
  energyBar: (progress: number, streak: number) => {
    // Segments that light up
    const segments = Math.floor(progress * 10);
    const colors = [
      '#22C55E', '#22C55E', '#22C55E', // Green
      '#84CC16', '#84CC16', // Lime
      '#EAB308', '#EAB308', // Yellow
      '#F97316', // Orange
      '#EF4444', // Red
      '#EC4899', // Pink (max)
    ];

    const activeColors = colors.slice(0, segments + 1);
    const gradient = activeColors.length > 1
      ? `linear-gradient(90deg, ${activeColors.join(', ')})`
      : activeColors[0];

    return {
      background: gradient,
      boxShadow: segments >= 8
        ? `0 0 ${segments * 2}px ${colors[segments]}`
        : 'none',
    };
  },

  // Option 5: Smooth heat map
  heatMap: (progress: number, streak: number) => {
    // Smooth transition through temperature colors
    const stops = [
      { pos: 0, color: '#22C55E' },    // Green (cool)
      { pos: 0.25, color: '#84CC16' }, // Lime
      { pos: 0.5, color: '#EAB308' },  // Yellow
      { pos: 0.75, color: '#F97316' }, // Orange
      { pos: 1, color: '#EF4444' },    // Red (hot)
    ];

    // Find which segment we're in
    let fromStop = stops[0];
    let toStop = stops[1];
    for (let i = 0; i < stops.length - 1; i++) {
      if (progress >= stops[i].pos && progress <= stops[i + 1].pos) {
        fromStop = stops[i];
        toStop = stops[i + 1];
        break;
      }
    }

    const gradientProgress = progress * 100;

    return {
      background: `linear-gradient(90deg,
        #22C55E 0%,
        #84CC16 ${Math.min(gradientProgress, 25)}%,
        #EAB308 ${Math.min(gradientProgress, 50)}%,
        #F97316 ${Math.min(gradientProgress, 75)}%,
        #EF4444 ${Math.min(gradientProgress, 100)}%)`,
      boxShadow: progress > 0.7
        ? `0 0 ${(progress - 0.7) * 50}px rgba(239, 68, 68, ${(progress - 0.7) * 2})`
        : 'none',
    };
  },

  // Option 6: XP bar with shimmer
  xpShimmer: (progress: number, streak: number) => {
    const baseHue = 142; // Green
    const targetHue = 45; // Gold
    const currentHue = baseHue - (progress * (baseHue - targetHue));

    return {
      background: `
        linear-gradient(90deg,
          hsl(${currentHue}, 70%, 45%) 0%,
          hsl(${currentHue}, 80%, 55%) 50%,
          hsl(${currentHue}, 70%, 45%) 100%)
      `,
      backgroundSize: '200% 100%',
      animation: progress > 0.5 ? 'shimmer 2s linear infinite' : 'none',
      boxShadow: progress > 0.8
        ? `0 0 15px hsla(${currentHue}, 80%, 55%, 0.5)`
        : 'none',
    };
  },

  // Option 7: Level-up style (discrete jumps)
  levelUp: (progress: number, streak: number) => {
    const level = Math.floor(progress * 5); // 0-4 levels

    const levelStyles = [
      { bg: '#58CC02', glow: 'none' }, // Level 0: Basic green
      { bg: 'linear-gradient(90deg, #58CC02, #22D3EE)', glow: '0 0 8px rgba(34, 211, 238, 0.4)' }, // Level 1: Green-cyan
      { bg: 'linear-gradient(90deg, #22D3EE, #818CF8)', glow: '0 0 12px rgba(129, 140, 248, 0.5)' }, // Level 2: Cyan-indigo
      { bg: 'linear-gradient(90deg, #818CF8, #E879F9)', glow: '0 0 15px rgba(232, 121, 249, 0.5)' }, // Level 3: Indigo-fuchsia
      { bg: 'linear-gradient(90deg, #E879F9, #FB923C, #FBBF24)', glow: '0 0 20px rgba(251, 191, 36, 0.6)' }, // Level 4: Rainbow gold
    ];

    const style = levelStyles[Math.min(level, 4)];

    return {
      background: style.bg,
      boxShadow: style.glow,
      transition: 'all 0.5s ease-out',
    };
  },
};

export default function TestProgressPage() {
  const [progress, setProgress] = useState(0.5);
  const [streak, setStreak] = useState(3);
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof STYLE_OPTIONS>('gradualRainbow');

  const styleNames: Record<keyof typeof STYLE_OPTIONS, string> = {
    gradualRainbow: '1. Gradual Rainbow',
    glowIntensity: '2. Glow Intensity',
    streakMultiplier: '3. Streak Multiplier',
    energyBar: '4. Energy Bar',
    heatMap: '5. Heat Map',
    xpShimmer: '6. XP Shimmer',
    levelUp: '7. Level Up',
  };

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-8">
      <style jsx global>{`
        @keyframes fireFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 50%; }
          100% { background-position: -200% 50%; }
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Progress Bar Test</h1>

        {/* Controls */}
        <div className="bg-[#1A2C35] rounded-xl p-6 mb-8 space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Progress: {Math.round(progress * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress * 100}
              onChange={(e) => setProgress(parseInt(e.target.value) / 100)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Streak: {streak}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={streak}
              onChange={(e) => setStreak(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Style</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as keyof typeof STYLE_OPTIONS)}
              className="w-full px-3 py-2 bg-[#131F24] border border-gray-600 rounded-lg"
            >
              {Object.keys(STYLE_OPTIONS).map((key) => (
                <option key={key} value={key}>
                  {styleNames[key as keyof typeof STYLE_OPTIONS]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-[#1A2C35] rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>

          {/* Progress bar container */}
          <div className="h-4 bg-[#131F24] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress * 100}%`,
                ...STYLE_OPTIONS[selectedStyle](progress, streak),
              }}
            />
          </div>

          <div className="mt-4 text-sm text-gray-500">
            {Math.round(progress * 10)}/10 puzzles • Streak: {streak}
          </div>
        </div>

        {/* All styles comparison */}
        <div className="bg-[#1A2C35] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">All Styles Comparison</h2>

          <div className="space-y-4">
            {(Object.keys(STYLE_OPTIONS) as Array<keyof typeof STYLE_OPTIONS>).map((key) => (
              <div key={key}>
                <div className="text-sm text-gray-400 mb-1">{styleNames[key]}</div>
                <div className="h-3 bg-[#131F24] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress * 100}%`,
                      ...STYLE_OPTIONS[key](progress, streak),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick test buttons */}
        <div className="mt-8 flex gap-2 flex-wrap">
          <button
            onClick={() => { setProgress(0); setStreak(0); }}
            className="px-4 py-2 bg-gray-700 rounded-lg text-sm"
          >
            Reset
          </button>
          <button
            onClick={() => { setProgress(0.2); setStreak(2); }}
            className="px-4 py-2 bg-gray-700 rounded-lg text-sm"
          >
            20% / 2 streak
          </button>
          <button
            onClick={() => { setProgress(0.5); setStreak(4); }}
            className="px-4 py-2 bg-gray-700 rounded-lg text-sm"
          >
            50% / 4 streak
          </button>
          <button
            onClick={() => { setProgress(0.8); setStreak(6); }}
            className="px-4 py-2 bg-gray-700 rounded-lg text-sm"
          >
            80% / 6 streak
          </button>
          <button
            onClick={() => { setProgress(1); setStreak(10); }}
            className="px-4 py-2 bg-gray-700 rounded-lg text-sm"
          >
            100% / 10 streak
          </button>
        </div>
      </div>
    </div>
  );
}
