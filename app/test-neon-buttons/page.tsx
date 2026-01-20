'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestNeonButtons() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-gray-800 p-3 sticky top-0 z-50 bg-[#111]">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <span className="text-white font-medium">Neon Button Styles</span>
          {selected !== null && (
            <span className="text-cyan-400 text-sm ml-auto">Selected: Style {selected + 1}</span>
          )}
        </div>
      </div>

      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="grid gap-8">

          {/* Style 1: Simple outline */}
          <ButtonRow index={0} selected={selected} setSelected={setSelected} name="Simple Outline">
            {['#00FFFF', '#FF00FF', '#FFFF00'].map((color, i) => (
              <button
                key={i}
                className="flex-1 py-3 rounded-lg font-bold text-sm border-2 transition-all hover:scale-105"
                style={{
                  borderColor: color,
                  color: color,
                  backgroundColor: 'transparent',
                }}
              >
                {['400-800', '800-1200', '1200-1600'][i]}
              </button>
            ))}
          </ButtonRow>

          {/* Style 2: Outline with glow */}
          <ButtonRow index={1} selected={selected} setSelected={setSelected} name="Outline + Glow">
            {['#00FFFF', '#FF00FF', '#FFFF00'].map((color, i) => (
              <button
                key={i}
                className="flex-1 py-3 rounded-lg font-bold text-sm border-2 transition-all hover:scale-105"
                style={{
                  borderColor: color,
                  color: color,
                  backgroundColor: 'transparent',
                  boxShadow: `0 0 20px ${color}40, inset 0 0 15px ${color}20`,
                  textShadow: `0 0 10px ${color}`,
                }}
              >
                {['400-800', '800-1200', '1200-1600'][i]}
              </button>
            ))}
          </ButtonRow>

          {/* Style 3: Filled solid */}
          <ButtonRow index={2} selected={selected} setSelected={setSelected} name="Solid Fill">
            {['#00FFFF', '#FF00FF', '#FFFF00'].map((color, i) => (
              <button
                key={i}
                className="flex-1 py-3 rounded-lg font-bold text-sm transition-all hover:scale-105"
                style={{
                  backgroundColor: color,
                  color: '#000',
                  boxShadow: `0 0 20px ${color}50`,
                }}
              >
                {['400-800', '800-1200', '1200-1600'][i]}
              </button>
            ))}
          </ButtonRow>

          {/* Style 4: 3D with bottom shadow */}
          <ButtonRow index={3} selected={selected} setSelected={setSelected} name="3D Depth">
            {[
              { color: '#00FFFF', dark: '#00b3b3' },
              { color: '#FF00FF', dark: '#b300b3' },
              { color: '#FFFF00', dark: '#b3b300' },
            ].map((btn, i) => (
              <button
                key={i}
                className="flex-1 py-3 rounded-lg font-bold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0.5"
                style={{
                  background: `linear-gradient(180deg, ${btn.color} 0%, ${btn.dark} 100%)`,
                  color: '#000',
                  boxShadow: `0 4px 0 ${btn.dark}, 0 0 15px ${btn.color}40`,
                }}
              >
                {['400-800', '800-1200', '1200-1600'][i]}
              </button>
            ))}
          </ButtonRow>

          {/* Style 5: Glassmorphism */}
          <ButtonRow index={4} selected={selected} setSelected={setSelected} name="Glass">
            {['#00FFFF', '#FF00FF', '#FFFF00'].map((color, i) => (
              <button
                key={i}
                className="flex-1 py-3 rounded-lg font-bold text-sm backdrop-blur-sm border transition-all hover:scale-105"
                style={{
                  backgroundColor: `${color}15`,
                  borderColor: `${color}40`,
                  color: color,
                  boxShadow: `0 4px 20px ${color}20`,
                }}
              >
                {['400-800', '800-1200', '1200-1600'][i]}
              </button>
            ))}
          </ButtonRow>

          {/* Style 6: Pill with inner glow */}
          <ButtonRow index={5} selected={selected} setSelected={setSelected} name="Pill + Inner Glow">
            {['#00FFFF', '#FF00FF', '#FFFF00'].map((color, i) => (
              <button
                key={i}
                className="flex-1 py-3 rounded-full font-bold text-sm border-2 transition-all hover:scale-105"
                style={{
                  borderColor: color,
                  color: color,
                  backgroundColor: 'transparent',
                  boxShadow: `inset 0 0 20px ${color}30, 0 0 10px ${color}20`,
                }}
              >
                {['400-800', '800-1200', '1200-1600'][i]}
              </button>
            ))}
          </ButtonRow>

          {/* Style 7: Gradient border */}
          <ButtonRow index={6} selected={selected} setSelected={setSelected} name="Gradient Border">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex-1 p-0.5 rounded-lg bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400">
                <button
                  className="w-full py-3 rounded-md font-bold text-sm bg-[#0a0a0a] text-white transition-all hover:bg-[#151515]"
                >
                  {['400-800', '800-1200', '1200-1600'][i]}
                </button>
              </div>
            ))}
          </ButtonRow>

          {/* Style 8: Neon underline */}
          <ButtonRow index={7} selected={selected} setSelected={setSelected} name="Neon Underline">
            {['#00FFFF', '#FF00FF', '#FFFF00'].map((color, i) => (
              <button
                key={i}
                className="flex-1 py-3 font-bold text-sm transition-all hover:scale-105 relative"
                style={{ color: color }}
              >
                {['400-800', '800-1200', '1200-1600'][i]}
                <div
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}, 0 0 20px ${color}50`
                  }}
                />
              </button>
            ))}
          </ButtonRow>

          {/* Style 9: Cyberpunk cut corners */}
          <ButtonRow index={8} selected={selected} setSelected={setSelected} name="Cyber Cut">
            {['#00FFFF', '#FF00FF', '#FFFF00'].map((color, i) => (
              <button
                key={i}
                className="flex-1 py-3 font-bold text-sm transition-all hover:scale-105"
                style={{
                  backgroundColor: `${color}15`,
                  color: color,
                  clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                  boxShadow: `0 0 15px ${color}30`,
                }}
              >
                {['400-800', '800-1200', '1200-1600'][i]}
              </button>
            ))}
          </ButtonRow>

          {/* Style 10: Animated pulse border */}
          <ButtonRow index={9} selected={selected} setSelected={setSelected} name="Pulse Border">
            {['#00FFFF', '#FF00FF', '#FFFF00'].map((color, i) => (
              <button
                key={i}
                className="flex-1 py-3 rounded-lg font-bold text-sm border-2 transition-all hover:scale-105 relative overflow-hidden"
                style={{
                  borderColor: color,
                  color: color,
                  backgroundColor: 'transparent',
                }}
              >
                <span className="relative z-10">{['400-800', '800-1200', '1200-1600'][i]}</span>
                <div
                  className="absolute inset-0 opacity-30 animate-pulse"
                  style={{ backgroundColor: color }}
                />
              </button>
            ))}
          </ButtonRow>

        </div>

        {/* Preview section */}
        <div className="mt-12 p-6 rounded-xl bg-[#111] border border-gray-800">
          <h2 className="text-white font-bold mb-4">Preview in Context</h2>
          <div className="max-w-xs mx-auto">
            <div className="text-center mb-4">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400">
                THE CHESS PATH
              </span>
            </div>
            <div className="w-48 h-48 mx-auto mb-4 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-500">
              [Board]
            </div>
            {selected !== null ? (
              <PreviewButtons style={selected} />
            ) : (
              <p className="text-gray-500 text-center text-sm">Click "Use This" on a style above to preview</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonRow({
  children,
  index,
  selected,
  setSelected,
  name
}: {
  children: React.ReactNode;
  index: number;
  selected: number | null;
  setSelected: (i: number | null) => void;
  name: string;
}) {
  const isSelected = selected === index;

  return (
    <div className={`p-4 rounded-xl border transition-all ${isSelected ? 'border-cyan-400 bg-cyan-400/5' : 'border-gray-800 bg-[#111]'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{index + 1}. {name}</span>
        <button
          onClick={() => setSelected(isSelected ? null : index)}
          className={`text-xs px-3 py-1 rounded-full transition-all ${
            isSelected
              ? 'bg-cyan-400 text-black'
              : 'border border-gray-700 text-gray-500 hover:border-cyan-400 hover:text-cyan-400'
          }`}
        >
          {isSelected ? 'Selected' : 'Use This'}
        </button>
      </div>
      <div className="flex gap-3">
        {children}
      </div>
    </div>
  );
}

function PreviewButtons({ style }: { style: number }) {
  const labels = ['400-800', '800-1200', '1200-1600'];
  const colors = ['#00FFFF', '#FF00FF', '#FFFF00'];

  const renderButton = (color: string, label: string, i: number) => {
    switch (style) {
      case 0: // Simple outline
        return (
          <button key={i} className="flex-1 py-2.5 rounded-lg font-bold text-sm border-2" style={{ borderColor: color, color }}>
            {label}
          </button>
        );
      case 1: // Outline + glow
        return (
          <button key={i} className="flex-1 py-2.5 rounded-lg font-bold text-sm border-2" style={{ borderColor: color, color, boxShadow: `0 0 20px ${color}40, inset 0 0 15px ${color}20`, textShadow: `0 0 10px ${color}` }}>
            {label}
          </button>
        );
      case 2: // Solid
        return (
          <button key={i} className="flex-1 py-2.5 rounded-lg font-bold text-sm" style={{ backgroundColor: color, color: '#000', boxShadow: `0 0 20px ${color}50` }}>
            {label}
          </button>
        );
      case 3: // 3D
        const darks = ['#00b3b3', '#b300b3', '#b3b300'];
        return (
          <button key={i} className="flex-1 py-2.5 rounded-lg font-bold text-sm" style={{ background: `linear-gradient(180deg, ${color} 0%, ${darks[i]} 100%)`, color: '#000', boxShadow: `0 4px 0 ${darks[i]}, 0 0 15px ${color}40` }}>
            {label}
          </button>
        );
      case 4: // Glass
        return (
          <button key={i} className="flex-1 py-2.5 rounded-lg font-bold text-sm border" style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color, boxShadow: `0 4px 20px ${color}20` }}>
            {label}
          </button>
        );
      case 5: // Pill
        return (
          <button key={i} className="flex-1 py-2.5 rounded-full font-bold text-sm border-2" style={{ borderColor: color, color, boxShadow: `inset 0 0 20px ${color}30, 0 0 10px ${color}20` }}>
            {label}
          </button>
        );
      case 6: // Gradient border
        return (
          <div key={i} className="flex-1 p-0.5 rounded-lg bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400">
            <button className="w-full py-2.5 rounded-md font-bold text-sm bg-[#0a0a0a] text-white">{label}</button>
          </div>
        );
      case 7: // Underline
        return (
          <button key={i} className="flex-1 py-2.5 font-bold text-sm relative" style={{ color }}>
            {label}
            <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
          </button>
        );
      case 8: // Cyber
        return (
          <button key={i} className="flex-1 py-2.5 font-bold text-sm" style={{ backgroundColor: `${color}15`, color, clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)', boxShadow: `0 0 15px ${color}30` }}>
            {label}
          </button>
        );
      case 9: // Pulse
        return (
          <button key={i} className="flex-1 py-2.5 rounded-lg font-bold text-sm border-2 relative overflow-hidden" style={{ borderColor: color, color }}>
            <span className="relative z-10">{label}</span>
            <div className="absolute inset-0 opacity-30 animate-pulse" style={{ backgroundColor: color }} />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-2">
      {colors.map((color, i) => renderButton(color, labels[i], i))}
    </div>
  );
}
