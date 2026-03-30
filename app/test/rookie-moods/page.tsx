'use client';

import { useState } from 'react';
import { BreathingRook, RookieMood } from '@/components/ui/BreathingRook';

type AnimationMode = 'breathe' | 'think' | 'celebrate' | 'powerOn' | 'enter';

const MOODS: { mood: RookieMood; label: string; desc: string }[] = [
  { mood: 'neutral', label: 'Neutral', desc: 'Default rainbow' },
  { mood: 'happy', label: 'Happy', desc: 'Warm green glow — winning material' },
  { mood: 'nervous', label: 'Nervous', desc: 'Washed out grey-blue — losing material' },
  { mood: 'angry', label: 'Angry', desc: 'Deep red, nearly mono — got checkmated' },
  { mood: 'smug', label: 'Smug', desc: 'Rich purple royalty — delivered check' },
  { mood: 'surprised', label: 'Surprised', desc: 'Electric cyan — got checked' },
  { mood: 'embarrassed', label: 'Embarrassed', desc: 'Power flickers out — blundered' },
  { mood: 'excited', label: 'Excited', desc: 'Golden overdrive — captured big piece' },
  { mood: 'defeated', label: 'Defeated', desc: 'Dark husk, barely alive — lost badly' },
  { mood: 'scheming', label: 'Scheming', desc: 'Sinister matrix green — sees a tactic' },
  { mood: 'panicking', label: 'Panicking', desc: 'Alarm orange pulse — lost big piece' },
  { mood: 'zen', label: 'Zen', desc: 'Soft pastel calm — even position' },
];

const NEW_MOODS: { mood: RookieMood; label: string; desc: string; merch: string }[] = [
  { mood: 'shadow', label: 'Shadow', desc: 'Matte black villain arc — Rookie goes dark', merch: 'Dark alter-ego Rookie. The villain hat.' },
  { mood: 'proud', label: 'Proud', desc: 'Warm bronze glow — found a hard move', merch: 'Trophy energy. Earned it.' },
  { mood: 'suspicious', label: 'Suspicious', desc: 'Narrow amber — opponent played something weird', merch: 'Detective Rookie.' },
  { mood: 'heartbroken', label: 'Heartbroken', desc: 'Deep indigo — hung the queen', merch: 'Emo Rookie with a cracked rook.' },
  { mood: 'mischievous', label: 'Mischievous', desc: 'Hot pink sparkle — setting a trap', merch: 'Winking Rookie.' },
  { mood: 'sleepy', label: 'Sleepy', desc: 'Dim warm purple — long endgame grind', merch: 'Cozy Rookie with a little Z.' },
  { mood: 'starstruck', label: 'Starstruck', desc: 'Silver shimmer — user played a brilliancy', merch: 'Glowing halo Rookie.' },
  { mood: 'confused', label: 'Confused', desc: 'Swirling unsettled — complex position', merch: 'Spiral-eyed Rookie.' },
  { mood: 'stubborn', label: 'Stubborn', desc: 'Burnt orange rigid — keeps trying same move', merch: 'Arms-crossed Rookie.' },
  { mood: 'grateful', label: 'Grateful', desc: 'Soft warm pink — end of lesson, post-streak', merch: 'Wholesome Rookie, heart accent.' },
  { mood: 'feral', label: 'Feral', desc: 'Chaotic rainbow strobe — massive streak', merch: 'Unhinged Rookie. Cult favorite.' },
  { mood: 'royal', label: 'Royal', desc: 'Deep gold + purple — premium crown energy', merch: 'Crown Rookie. Premium tier.' },
];

const ANIMATIONS: { mode: AnimationMode | undefined; label: string; desc: string }[] = [
  { mode: undefined, label: 'Static', desc: 'No animation' },
  { mode: 'breathe', label: 'Breathe', desc: 'Gentle pulse — idle state' },
  { mode: 'think', label: 'Think', desc: 'Fast shimmer — processing a move' },
  { mode: 'celebrate', label: 'Celebrate', desc: 'Scale bounce — puzzle solved' },
  { mode: 'enter', label: 'Enter', desc: 'Blocks pop in — page load' },
  { mode: 'powerOn', label: 'Power On + Morse', desc: 'Boot sequence with morse code blink — "chess" and "path"' },
];

export default function RookieMoodsPage() {
  const [activeMood, setActiveMood] = useState<RookieMood>('neutral');
  const [activeAnim, setActiveAnim] = useState<AnimationMode | undefined>('breathe');
  const [animKey, setAnimKey] = useState(0);

  const selectAnim = (mode: AnimationMode | undefined) => {
    setActiveAnim(mode);
    setAnimKey(k => k + 1); // reset animation so enter/powerOn replay
  };

  return (
    <div className="h-[100dvh] bg-chess-page text-chess-text overflow-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black mb-1">Rookie Mood Board</h1>
          <p className="text-chess-text-muted text-sm">
            Official reference for Rookie&apos;s emotional color system. She changes colors like an octopus based on game state.
          </p>
        </div>

        {/* Large preview */}
        <div className="bg-chess-surface rounded-3xl p-8 flex flex-col items-center gap-5">
          <BreathingRook
            key={`${activeMood}-${animKey}`}
            size="xl"
            mood={activeMood}
            animate={activeAnim === 'breathe' || !activeAnim}
            animation={activeAnim && activeAnim !== 'breathe' ? activeAnim : undefined}
          />
          <div className="text-center">
            <p className="text-xl font-black">{MOODS.find(m => m.mood === activeMood)?.label}</p>
            <p className="text-chess-text-muted text-sm mt-1">{MOODS.find(m => m.mood === activeMood)?.desc}</p>
            {activeAnim && (
              <p className="text-chess-text-faint text-xs mt-2">
                Animation: {ANIMATIONS.find(a => a.mode === activeAnim)?.label}
              </p>
            )}
          </div>
        </div>

        {/* Animation modes */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-chess-text-muted mb-3">Animation Modes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {ANIMATIONS.map(({ mode, label, desc }) => (
              <button
                key={label}
                onClick={() => selectAnim(mode)}
                className={`p-3 rounded-xl text-left transition-all ${
                  activeAnim === mode
                    ? 'bg-chess-green/15 ring-2 ring-chess-green'
                    : 'bg-chess-surface hover:bg-chess-surface/80'
                }`}
              >
                <p className="text-xs font-bold">{label}</p>
                <p className="text-[10px] text-chess-text-muted mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Mood grid */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-chess-text-muted mb-3">Moods</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {MOODS.map(({ mood, label }) => (
              <button
                key={mood}
                onClick={() => setActiveMood(mood)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                  activeMood === mood
                    ? 'bg-chess-green/15 ring-2 ring-chess-green'
                    : 'bg-chess-surface hover:bg-chess-surface/80'
                }`}
              >
                <BreathingRook
                  size="md"
                  mood={mood}
                  animate
                />
                <span className="text-xs font-semibold">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Potential new moods */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-chess-text-muted mb-1">Potential New Moods</h2>
          <p className="text-chess-text-faint text-xs mb-4">Candidates for game triggers + merch designs. Click to preview.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {NEW_MOODS.map(({ mood, label, desc, merch }) => (
              <button
                key={mood}
                onClick={() => setActiveMood(mood)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all text-left ${
                  activeMood === mood
                    ? 'bg-chess-green/15 ring-2 ring-chess-green'
                    : 'bg-chess-surface hover:bg-chess-surface/80'
                }`}
              >
                <BreathingRook
                  size="md"
                  mood={mood}
                  animate
                />
                <div className="text-center">
                  <span className="text-xs font-semibold block">{label}</span>
                  <span className="text-[10px] text-chess-text-muted block mt-0.5">{desc}</span>
                  <span className="text-[10px] text-chess-text-faint block mt-1 italic">Hat: {merch}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Morse code detail */}
        <div className="bg-chess-surface rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-chess-text-muted mb-3">Morse Code Easter Egg</h2>
          <p className="text-sm text-chess-text leading-relaxed mb-4">
            After the Power On boot sequence, two blocks continue blinking in morse code. The yellow crown block (1,1) blinks
            &quot;CHESS&quot; on a 6-second loop. The purple head block (3,2) blinks &quot;PATH&quot; on an 18-second loop starting at 8 seconds.
            Select &quot;Power On + Morse&quot; above to see it.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <BreathingRook
                key={`morse-${animKey}`}
                size="lg"
                animation="powerOn"
              />
              <span className="text-xs text-chess-text-muted font-mono">powerOn + morse</span>
            </div>
            <div className="text-xs text-chess-text-muted font-mono space-y-1">
              <p>C: -.-. &nbsp; H: .... &nbsp; E: . &nbsp; S: ... &nbsp; S: ...</p>
              <p>P: .--. &nbsp; A: .- &nbsp; T: - &nbsp; H: ....</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
