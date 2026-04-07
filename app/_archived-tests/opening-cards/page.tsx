'use client';

import { useState } from 'react';

// ─── Design 1: Floating Pill Tabs ──────────────────────
// Chunky Duolingo-style pill with 3D press depth
function Design1({ active, onSwitch }: { active: 'my' | 'lib'; onSwitch: (t: 'my' | 'lib') => void }) {
  return (
    <div className="p-1.5 rounded-2xl" style={{ backgroundColor: '#e2ecf3' }}>
      <div className="flex gap-1.5">
        {(['my', 'lib'] as const).map(tab => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              onClick={() => onSwitch(tab)}
              className="flex-1 relative py-3 rounded-xl font-bold text-sm transition-all duration-200"
              style={{
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#2A3C45' : '#94a3b8',
                boxShadow: isActive
                  ? '0 4px 0 #d1dde6, 0 2px 8px rgba(0,0,0,0.08)'
                  : 'none',
                transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
              }}
            >
              <div className="flex items-center justify-center gap-2">
                {tab === 'my' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                )}
                {tab === 'my' ? 'My Openings' : 'Library'}
              </div>
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#CE82FF' }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Design 2: Layered 3D Cards ──────────────────────
// Two separate floating cards side-by-side, active one pops forward
function Design2({ active, onSwitch }: { active: 'my' | 'lib'; onSwitch: (t: 'my' | 'lib') => void }) {
  return (
    <div className="flex gap-3">
      {(['my', 'lib'] as const).map(tab => {
        const isActive = active === tab;
        const color = tab === 'my' ? '#CE82FF' : '#1CB0F6';
        const colorDark = tab === 'my' ? '#A855D8' : '#1899D6';
        return (
          <button
            key={tab}
            onClick={() => onSwitch(tab)}
            className="flex-1 relative"
          >
            {/* Shadow layers */}
            {isActive && (
              <>
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ backgroundColor: color, transform: 'translate(5px, 5px)', opacity: 0.15 }}
                />
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ backgroundColor: color, transform: 'translate(2.5px, 2.5px)', opacity: 0.3 }}
                />
              </>
            )}

            {/* Main card */}
            <div
              className="relative rounded-2xl px-4 py-4 transition-all duration-300 overflow-hidden"
              style={{
                backgroundColor: isActive ? '#ffffff' : '#f0f5fa',
                border: `2.5px solid ${isActive ? color : '#e2ecf3'}`,
                boxShadow: isActive
                  ? `0 8px 20px rgba(0,0,0,0.08)`
                  : '0 2px 4px rgba(0,0,0,0.04)',
                transform: isActive ? 'scale(1)' : 'scale(0.97)',
              }}
            >
              {/* Corner accent */}
              {isActive && (
                <div
                  className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, transparent 50%, ${color}15 50%)`,
                    borderTopRightRadius: '14px',
                  }}
                />
              )}

              <div className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? color : '#e2ecf3',
                    boxShadow: isActive ? `0 3px 0 ${colorDark}` : 'none',
                  }}
                >
                  {tab === 'my' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : '#94a3b8'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : '#94a3b8'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    </svg>
                  )}
                </div>
                <span
                  className="font-bold text-sm transition-colors duration-300"
                  style={{ color: isActive ? '#2A3C45' : '#94a3b8' }}
                >
                  {tab === 'my' ? 'My Openings' : 'Library'}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Design 3: Neon Underline Tabs ──────────────────────
// Dark themed with glowing underline and icon badges
function Design3({ active, onSwitch }: { active: 'my' | 'lib'; onSwitch: (t: 'my' | 'lib') => void }) {
  return (
    <div className="rounded-2xl p-1" style={{ backgroundColor: '#131F24', border: '1px solid #ffffff12' }}>
      <div className="flex">
        {(['my', 'lib'] as const).map(tab => {
          const isActive = active === tab;
          const color = tab === 'my' ? '#CE82FF' : '#1CB0F6';
          return (
            <button
              key={tab}
              onClick={() => onSwitch(tab)}
              className="flex-1 relative py-3 px-4 transition-all duration-300"
            >
              {/* Active glow bg */}
              {isActive && (
                <div
                  className="absolute inset-1 rounded-xl"
                  style={{
                    background: `${color}12`,
                    border: `1px solid ${color}30`,
                    boxShadow: `0 0 16px ${color}15, inset 0 0 16px ${color}08`,
                  }}
                />
              )}

              <div className="relative flex items-center justify-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? `${color}20` : 'transparent',
                    border: isActive ? `1px solid ${color}40` : '1px solid transparent',
                  }}
                >
                  {tab === 'my' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isActive ? color : '#ffffff30'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isActive ? color : '#ffffff30'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    </svg>
                  )}
                </div>
                <span
                  className="font-bold text-sm transition-colors duration-300"
                  style={{ color: isActive ? '#ffffff' : '#ffffff40' }}
                >
                  {tab === 'my' ? 'My Openings' : 'Library'}
                </span>
              </div>

              {/* Glow bar at bottom */}
              {isActive && (
                <div
                  className="absolute bottom-0.5 left-1/4 right-1/4 h-0.5 rounded-full"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}80, 0 0 16px ${color}40`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Design 4: Chunky Color Blocks ──────────────────────
// Bold Duolingo-style colored blocks with press effect
function Design4({ active, onSwitch }: { active: 'my' | 'lib'; onSwitch: (t: 'my' | 'lib') => void }) {
  return (
    <div className="flex gap-3">
      {(['my', 'lib'] as const).map(tab => {
        const isActive = active === tab;
        const color = tab === 'my' ? '#CE82FF' : '#1CB0F6';
        const colorDark = tab === 'my' ? '#A855D8' : '#1899D6';
        return (
          <button
            key={tab}
            onClick={() => onSwitch(tab)}
            className="flex-1 transition-all duration-150"
            style={{
              transform: isActive ? 'translateY(3px)' : 'translateY(0)',
            }}
          >
            <div
              className="rounded-2xl px-4 py-4 overflow-hidden relative"
              style={{
                backgroundColor: isActive ? color : '#f0f5fa',
                boxShadow: isActive
                  ? `0 2px 0 ${colorDark}`
                  : '0 5px 0 #d1dde6',
              }}
            >
              {/* Decorative circle */}
              {isActive && (
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
              )}

              <div className="relative flex flex-col items-center gap-2">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#e2ecf3',
                    boxShadow: isActive ? 'inset 0 -2px 0 rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {tab === 'my' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : '#94a3b8'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : '#94a3b8'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    </svg>
                  )}
                </div>
                <span
                  className="font-black text-sm uppercase tracking-wide"
                  style={{ color: isActive ? '#ffffff' : '#94a3b8' }}
                >
                  {tab === 'my' ? 'My Openings' : 'Library'}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Design 5: Sliding Window Card ──────────────────────
// Single card with sliding indicator window
function Design5({ active, onSwitch }: { active: 'my' | 'lib'; onSwitch: (t: 'my' | 'lib') => void }) {
  const color = active === 'my' ? '#CE82FF' : '#1CB0F6';
  const colorDark = active === 'my' ? '#A855D8' : '#1899D6';
  return (
    <div className="relative">
      {/* Outer card */}
      <div
        className="rounded-2xl p-2 relative overflow-hidden"
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 0 #d1dde6, 0 2px 12px rgba(0,0,0,0.06)',
          border: '2px solid #e2ecf3',
        }}
      >
        {/* Sliding highlight */}
        <div
          className="absolute top-2 bottom-2 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            width: 'calc(50% - 4px)',
            left: active === 'my' ? '8px' : 'calc(50% + 0px)',
            background: `linear-gradient(135deg, ${color}, ${colorDark})`,
            boxShadow: `0 4px 12px ${color}30`,
          }}
        />

        <div className="relative flex">
          {(['my', 'lib'] as const).map(tab => {
            const isActive = active === tab;
            return (
              <button
                key={tab}
                onClick={() => onSwitch(tab)}
                className="flex-1 py-3.5 flex items-center justify-center gap-2 transition-all duration-300 relative z-10"
              >
                {tab === 'my' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : '#94a3b8'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : '#94a3b8'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                )}
                <span
                  className="font-bold text-sm transition-colors duration-300"
                  style={{ color: isActive ? '#ffffff' : '#94a3b8' }}
                >
                  {tab === 'my' ? 'My Openings' : 'Library'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Fake Content ──────────────────────
function FakeContent({ tab }: { tab: 'my' | 'lib' }) {
  if (tab === 'my') {
    return (
      <div className="space-y-3 mt-5">
        {[
          { name: 'Ruy Lopez', sub: '5/12 lessons', color: '#E85D3A', pct: 42 },
          { name: 'Caro-Kann', sub: '8/10 lessons', color: '#43A047', pct: 80 },
        ].map(o => (
          <div key={o.name} className="flex items-center gap-3 bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: o.color }}>♟</div>
            <div className="flex-1">
              <div className="text-sm font-bold text-[#2A3C45]">{o.name}</div>
              <div className="h-1.5 rounded-full bg-gray-100 mt-1.5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${o.pct}%`, backgroundColor: o.color }} />
              </div>
            </div>
            <div className="text-xs text-[#94a3b8] font-medium">{o.sub}</div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3 mt-5">
      {['Italian Game', 'Sicilian Defense', 'French Defense', 'London System'].map(name => (
        <div key={name} className="flex items-center gap-3 bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">♟</div>
          <div className="flex-1">
            <div className="text-sm font-bold text-[#2A3C45]">{name}</div>
            <div className="text-xs text-[#94a3b8]">12 lessons</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      ))}
    </div>
  );
}

// ─── Main Test Page ──────────────────────
const designs = [
  { name: 'Pill Toggle', desc: 'Rounded pill with 3D press depth, subtle dot indicator', component: Design1 },
  { name: 'Layered Cards', desc: 'Two separate floating cards with stacked shadow layers', component: Design2 },
  { name: 'Neon Dark', desc: 'Dark themed with glowing underline bar', component: Design3 },
  { name: 'Color Blocks', desc: 'Bold Duolingo-style chunky colored press blocks', component: Design4 },
  { name: 'Sliding Window', desc: 'Single card with spring-animated sliding highlight', component: Design5 },
];

export default function OpeningTabsTest() {
  const [designIndex, setDesignIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'my' | 'lib'>('my');
  const ActiveDesign = designs[designIndex].component;

  return (
    <div className="min-h-screen bg-[#eef6fc] overflow-auto">
      {/* Design picker */}
      <div className="sticky top-0 z-50 bg-[#131F24] border-b border-white/10">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">Tab Switcher Designs</h1>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {designs.map((d, i) => (
              <button
                key={i}
                onClick={() => setDesignIndex(i)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  backgroundColor: designIndex === i ? '#58CC02' : '#ffffff10',
                  color: designIndex === i ? '#131F24' : '#ffffff60',
                  boxShadow: designIndex === i ? '0 3px 0 #46A302' : 'none',
                }}
              >
                {i + 1}. {d.name}
              </button>
            ))}
          </div>
          <div className="text-white/30 text-[11px] mt-2">{designs[designIndex].desc}</div>
        </div>
      </div>

      {/* Mock openings page */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Back + title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-white/60 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A3C45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#2A3C45' }}>Openings</h1>
        </div>

        {/* THE TAB DESIGN */}
        <ActiveDesign active={activeTab} onSwitch={setActiveTab} />

        {/* Fake content below */}
        <FakeContent tab={activeTab} />
      </div>
    </div>
  );
}