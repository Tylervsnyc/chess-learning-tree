'use client';

import { useState } from 'react';

// Module colors from the curriculum
const moduleColors = [
  '#58CC02', // Green
  '#1CB0F6', // Blue
  '#FF9600', // Orange
  '#A560E8', // Purple
];

interface DesignConfig {
  enable3D: boolean;
  enableAnimation: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  borderWidth: number;
  depth: number;
}

// Design 1: Embossed 3D Card with Inner Shadow
function Design1({ config, color }: { config: DesignConfig; color: string }) {
  const { enable3D, enableAnimation, depth } = config;

  return (
    <div
      className={`
        relative rounded-2xl p-6 overflow-hidden
        ${enableAnimation ? 'transition-all duration-300 hover:scale-[1.02]' : ''}
      `}
      style={{
        background: `linear-gradient(145deg, ${color}15, ${color}08)`,
        boxShadow: enable3D
          ? `
            inset 2px 2px ${depth}px rgba(255,255,255,0.2),
            inset -2px -2px ${depth}px rgba(0,0,0,0.2),
            0 ${depth * 2}px ${depth * 4}px rgba(0,0,0,0.3),
            0 ${depth}px ${depth}px rgba(0,0,0,0.2)
          `
          : 'none',
        border: `2px solid ${color}40`,
      }}
    >
      {/* Top highlight bar */}
      <div
        className="absolute top-0 left-4 right-4 h-1 rounded-b-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: enable3D ? 0.6 : 0,
        }}
      />

      {/* Level badge */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
            ${enableAnimation ? 'animate-pulse-slow' : ''}
          `}
          style={{
            background: color,
            boxShadow: enable3D ? `0 4px 0 ${color}99, 0 6px 12px rgba(0,0,0,0.3)` : 'none',
          }}
        >
          L1
        </div>
        <div>
          <div className="text-sm text-white/60 uppercase tracking-wider">Level 1</div>
          <div className="text-xl font-bold">Beginner Tactics</div>
        </div>
      </div>

      {/* Mock sections */}
      <div className="space-y-2 opacity-50">
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  );
}

// Design 2: Gradient Border with Glow
function Design2({ config, color }: { config: DesignConfig; color: string }) {
  const { enable3D, enableAnimation, borderWidth, depth } = config;

  return (
    <div className="relative p-[2px] rounded-2xl overflow-hidden group">
      {/* Animated gradient border */}
      <div
        className={`
          absolute inset-0 rounded-2xl
          ${enableAnimation ? 'animate-gradient-rotate' : ''}
        `}
        style={{
          background: `conic-gradient(from 0deg, ${color}, #1CB0F6, #A560E8, #FF9600, ${color})`,
          padding: borderWidth,
        }}
      />

      {/* Glow effect */}
      {enable3D && (
        <div
          className={`absolute inset-0 rounded-2xl blur-xl ${enableAnimation ? 'animate-pulse-glow' : ''}`}
          style={{
            background: `conic-gradient(from 0deg, ${color}60, #1CB0F640, #A560E840, #FF960040, ${color}60)`,
          }}
        />
      )}

      {/* Inner content */}
      <div
        className="relative rounded-2xl p-6 bg-[#1A2C35]"
        style={{
          boxShadow: enable3D ? `inset 0 0 ${depth * 3}px ${color}20` : 'none',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg relative"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
          >
            {enableAnimation && (
              <div
                className="absolute inset-0 rounded-full animate-ping-slow"
                style={{ background: color, opacity: 0.3 }}
              />
            )}
            <span className="relative z-10">L1</span>
          </div>
          <div>
            <div className="text-sm text-white/60 uppercase tracking-wider">Level 1</div>
            <div className="text-xl font-bold">Beginner Tactics</div>
          </div>
        </div>

        <div className="space-y-2 opacity-50">
          <div className="h-3 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

// Design 3: Floating Card with Layered Depth
function Design3({ config, color }: { config: DesignConfig; color: string }) {
  const { enable3D, enableAnimation, depth } = config;

  return (
    <div className={`relative ${enableAnimation ? 'group' : ''}`}>
      {/* Back layer */}
      {enable3D && (
        <>
          <div
            className={`
              absolute inset-0 rounded-2xl
              ${enableAnimation ? 'transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3' : ''}
            `}
            style={{
              background: color,
              transform: `translate(${depth}px, ${depth}px)`,
              opacity: 0.3,
            }}
          />
          <div
            className={`
              absolute inset-0 rounded-2xl
              ${enableAnimation ? 'transition-transform duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5' : ''}
            `}
            style={{
              background: color,
              transform: `translate(${depth/2}px, ${depth/2}px)`,
              opacity: 0.5,
            }}
          />
        </>
      )}

      {/* Main card */}
      <div
        className={`
          relative rounded-2xl p-6 border-2
          ${enableAnimation ? 'transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1' : ''}
        `}
        style={{
          background: '#1A2C35',
          borderColor: color,
          boxShadow: enable3D ? `0 ${depth * 2}px ${depth * 4}px rgba(0,0,0,0.4)` : 'none',
        }}
      >
        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-16 h-16"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${color}30 50%)`,
            borderTopRightRadius: '1rem',
          }}
        />

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center font-bold text-xl relative overflow-hidden"
            style={{
              background: color,
              boxShadow: enable3D ? `4px 4px 0 ${color}60` : 'none',
            }}
          >
            {enableAnimation && (
              <div
                className="absolute inset-0 bg-white/20 animate-shimmer"
                style={{ transform: 'skewX(-20deg) translateX(-100%)' }}
              />
            )}
            <span className="relative">L1</span>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wider" style={{ color }}>Level 1</div>
            <div className="text-xl font-bold">Beginner Tactics</div>
          </div>
        </div>

        <div className="space-y-2 opacity-50">
          <div className="h-3 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

// Design 4: Neon Gaming Style
function Design4({ config, color }: { config: DesignConfig; color: string }) {
  const { enable3D, enableAnimation, borderWidth } = config;

  return (
    <div
      className={`
        relative rounded-2xl p-6 overflow-hidden
        ${enableAnimation ? 'group' : ''}
      `}
      style={{
        background: 'linear-gradient(180deg, #1A2C35 0%, #0D1A1F 100%)',
        border: `${borderWidth}px solid transparent`,
        backgroundClip: 'padding-box',
      }}
    >
      {/* Neon border effect */}
      <div
        className={`
          absolute inset-0 rounded-2xl
          ${enableAnimation ? 'animate-neon-pulse' : ''}
        `}
        style={{
          border: `${borderWidth}px solid ${color}`,
          boxShadow: enable3D
            ? `
              0 0 10px ${color}80,
              0 0 20px ${color}40,
              0 0 40px ${color}20,
              inset 0 0 20px ${color}10
            `
            : `0 0 5px ${color}60`,
        }}
      />

      {/* Scan line effect */}
      {enableAnimation && enable3D && (
        <div
          className="absolute inset-0 pointer-events-none animate-scan-line"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${color}10 50%, transparent 100%)`,
            height: '50%',
          }}
        />
      )}

      {/* Corner brackets */}
      {enable3D && (
        <>
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2" style={{ borderColor: color }} />
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2" style={{ borderColor: color }} />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2" style={{ borderColor: color }} />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2" style={{ borderColor: color }} />
        </>
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`
              w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg
              ${enableAnimation ? 'animate-glow-pulse' : ''}
            `}
            style={{
              background: 'transparent',
              border: `2px solid ${color}`,
              color: color,
              boxShadow: enable3D ? `0 0 15px ${color}60, inset 0 0 15px ${color}20` : 'none',
              textShadow: enable3D ? `0 0 10px ${color}` : 'none',
            }}
          >
            L1
          </div>
          <div>
            <div
              className="text-sm uppercase tracking-widest font-mono"
              style={{ color, textShadow: enable3D ? `0 0 5px ${color}` : 'none' }}
            >
              LEVEL 01
            </div>
            <div className="text-xl font-bold">Beginner Tactics</div>
          </div>
        </div>

        {/* Progress bar style indicator */}
        <div className="relative h-2 bg-black/40 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${enableAnimation ? 'animate-progress-glow' : ''}`}
            style={{
              width: '35%',
              background: `linear-gradient(90deg, ${color}80, ${color})`,
              boxShadow: enable3D ? `0 0 10px ${color}` : 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TestLevelDesigns() {
  const [config, setConfig] = useState<DesignConfig>({
    enable3D: true,
    enableAnimation: true,
    animationSpeed: 'normal',
    borderWidth: 2,
    depth: 6,
  });

  const [selectedColor, setSelectedColor] = useState(moduleColors[0]);

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-6">
      <style jsx global>{`
        @keyframes gradient-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { transform: skewX(-20deg) translateX(-100%); }
          100% { transform: skewX(-20deg) translateX(300%); }
        }

        @keyframes neon-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 15px var(--glow-color, #58CC02)60, inset 0 0 15px var(--glow-color, #58CC02)20; }
          50% { box-shadow: 0 0 25px var(--glow-color, #58CC02)80, inset 0 0 25px var(--glow-color, #58CC02)40; }
        }

        @keyframes progress-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        .animate-gradient-rotate {
          animation: gradient-rotate 4s linear infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-neon-pulse {
          animation: neon-pulse 2s ease-in-out infinite;
        }

        .animate-scan-line {
          animation: scan-line 3s linear infinite;
        }

        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        .animate-progress-glow {
          animation: progress-glow 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-2">Level Window Designs</h1>
        <p className="text-white/60">Experiment with different styles to make levels more distinct from sections</p>
      </div>

      {/* Controls */}
      <div className="max-w-6xl mx-auto mb-8 p-4 bg-[#1A2C35] rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Controls</h2>
        <div className="flex flex-wrap gap-6">
          {/* Toggle 3D */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enable3D}
              onChange={(e) => setConfig({ ...config, enable3D: e.target.checked })}
              className="w-5 h-5 rounded accent-[#58CC02]"
            />
            <span>Enable 3D Effects</span>
          </label>

          {/* Toggle Animation */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enableAnimation}
              onChange={(e) => setConfig({ ...config, enableAnimation: e.target.checked })}
              className="w-5 h-5 rounded accent-[#58CC02]"
            />
            <span>Enable Animations</span>
          </label>

          {/* Border Width */}
          <div className="flex items-center gap-2">
            <span className="text-white/60">Border:</span>
            <input
              type="range"
              min="1"
              max="4"
              value={config.borderWidth}
              onChange={(e) => setConfig({ ...config, borderWidth: Number(e.target.value) })}
              className="w-24 accent-[#58CC02]"
            />
            <span>{config.borderWidth}px</span>
          </div>

          {/* Depth */}
          <div className="flex items-center gap-2">
            <span className="text-white/60">3D Depth:</span>
            <input
              type="range"
              min="2"
              max="12"
              value={config.depth}
              onChange={(e) => setConfig({ ...config, depth: Number(e.target.value) })}
              className="w-24 accent-[#58CC02]"
            />
            <span>{config.depth}px</span>
          </div>

          {/* Color Selection */}
          <div className="flex items-center gap-2">
            <span className="text-white/60">Color:</span>
            <div className="flex gap-2">
              {moduleColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    selectedColor === color ? 'scale-110 ring-2 ring-white' : ''
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Design Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Design 1 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white/80">
            Design 1: Embossed 3D Card
          </h3>
          <p className="text-sm text-white/50 mb-4">
            Inner shadow + raised effect with highlight bar
          </p>
          <Design1 config={config} color={selectedColor} />
        </div>

        {/* Design 2 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white/80">
            Design 2: Gradient Border Glow
          </h3>
          <p className="text-sm text-white/50 mb-4">
            Animated rainbow border with outer glow
          </p>
          <Design2 config={config} color={selectedColor} />
        </div>

        {/* Design 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white/80">
            Design 3: Floating Layered Card
          </h3>
          <p className="text-sm text-white/50 mb-4">
            Stacked layers create depth, hover to lift
          </p>
          <Design3 config={config} color={selectedColor} />
        </div>

        {/* Design 4 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white/80">
            Design 4: Neon Gaming Style
          </h3>
          <p className="text-sm text-white/50 mb-4">
            Cyberpunk-inspired with scan lines and corner brackets
          </p>
          <Design4 config={config} color={selectedColor} />
        </div>
      </div>

      {/* Comparison with Section */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-4">Side-by-Side Comparison</h2>
        <p className="text-white/60 mb-6">Level window (left) vs current section style (right)</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Selected Level Design */}
          <div>
            <div className="text-sm text-white/50 mb-2 uppercase tracking-wider">Level Window</div>
            <Design3 config={config} color={selectedColor} />
          </div>

          {/* Current Section Style */}
          <div>
            <div className="text-sm text-white/50 mb-2 uppercase tracking-wider">Section Window (Current)</div>
            <div
              className="rounded-2xl p-4 transition-all"
              style={{
                backgroundColor: selectedColor,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                  ♟
                </div>
                <div>
                  <div className="text-sm text-white/80">Section</div>
                  <div className="text-lg font-semibold">Basic Forks</div>
                </div>
                <div className="ml-auto">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
