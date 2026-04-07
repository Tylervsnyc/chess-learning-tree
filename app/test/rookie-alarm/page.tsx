'use client';

import { useState, useEffect } from 'react';
import { BreathingRook, type AlarmVariant } from '@/components/ui/BreathingRook';
import { ALARM_VARIANTS } from '@/lib/rookie-os/types';

const VARIANT_META: Record<AlarmVariant, { name: string; desc: string }> = {
  heartbeat: { name: 'Heartbeat', desc: 'Two quick pulses then a pause — racing heartbeat' },
  sos: { name: 'SOS Morse', desc: 'Morse code for SOS — ... --- ... — emergency broadcast' },
  shiver: { name: 'Shiver', desc: 'Tiny rapid horizontal jitter — shaking with panic' },
  ringPulse: { name: 'Ring Pulse', desc: 'Concentric rings pulse outward — sonar alarm' },
  flickerOut: { name: 'Flicker Out', desc: 'Blocks randomly go dark — power failing under load' },
};

export default function RookieAlarmPage() {
  const [selected, setSelected] = useState<AlarmVariant>('heartbeat');
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(k => k + 1);
  }, [selected]);

  return (
    <div className="h-[100dvh] bg-chess-page text-chess-text overflow-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black mb-1">Rookie Alarm Variations</h1>
          <p className="text-chess-text-muted text-sm">
            5 alarm animations randomized when Rookie is 8+ pawns behind. All use the panicking mood (red tint).
          </p>
        </div>

        {/* Large preview */}
        <div className="bg-chess-surface rounded-3xl p-8 flex flex-col items-center gap-5">
          <BreathingRook
            key={`large-${selected}-${key}`}
            size="xl"
            mood="panicking"
            alarmVariant={selected}
            animate
          />
          <div className="text-center">
            <p className="text-xl font-black text-red-400">{VARIANT_META[selected].name}</p>
            <p className="text-chess-text-muted text-sm mt-1">{VARIANT_META[selected].desc}</p>
          </div>
        </div>

        {/* Grid of all 5 */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-chess-text-muted mb-3">All Variants</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {ALARM_VARIANTS.map((variant) => (
              <button
                key={`${variant}-${key}`}
                onClick={() => setSelected(variant)}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl transition-all ${
                  selected === variant ? 'bg-red-500/15 ring-2 ring-red-500' : 'bg-chess-surface hover:bg-chess-surface/80'
                }`}
              >
                <BreathingRook
                  size="lg"
                  mood="panicking"
                  alarmVariant={variant}
                  animate
                />
                <div className="text-center">
                  <p className="text-sm font-bold">{VARIANT_META[variant].name}</p>
                  <p className="text-[11px] text-chess-text-muted mt-0.5">{VARIANT_META[variant].desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Default siren for comparison */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-chess-text-muted mb-3">Default Siren (no variant)</h2>
          <div className="bg-chess-surface rounded-2xl p-6 flex items-center gap-6">
            <BreathingRook
              size="lg"
              mood="panicking"
              animate
            />
            <div>
              <p className="text-sm font-bold">Siren Sweep</p>
              <p className="text-[11px] text-chess-text-muted mt-0.5">The original — rotating beam. Used when panicking but not in alarm territory (under 8 pawns behind).</p>
            </div>
          </div>
        </div>

        {/* Mood trigger table */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-chess-text-muted mb-3">Full Mood Trigger Map</h2>
          <div className="bg-chess-surface rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 font-bold text-chess-text-muted text-xs uppercase">Mood</th>
                  <th className="text-left px-4 py-3 font-bold text-chess-text-muted text-xs uppercase">Trigger</th>
                  <th className="text-left px-4 py-3 font-bold text-chess-text-muted text-xs uppercase">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { mood: 'smug', trigger: 'Rookie win% >= 75% (dominating) or mate in N', source: 'Eval zone' },
                  { mood: 'happy', trigger: 'Rookie win% 60-75% (comfortable edge)', source: 'Eval zone' },
                  { mood: 'scheming', trigger: 'Rookie win% 55-60% (slight edge, plotting)', source: 'Eval zone' },
                  { mood: 'neutral', trigger: 'Rookie win% 45-55% (balanced)', source: 'Eval zone' },
                  { mood: 'nervous', trigger: 'Rookie win% 35-45% (losing ground)', source: 'Eval zone' },
                  { mood: 'panicking', trigger: 'Rookie win% 12-35% (serious trouble — default siren)', source: 'Eval zone' },
                  { mood: 'panicking + alarm', trigger: 'Rookie win% < 12% (~8+ pawns behind — random alarm variant)', source: 'Eval zone', highlight: true },
                  { mood: 'defeated', trigger: 'Rookie win% < 10% (hopeless)', source: 'Eval zone' },
                  { mood: 'excited', trigger: '15-30% swing in Rookie\'s favor', source: 'Swing' },
                  { mood: 'feral', trigger: '30%+ swing in Rookie\'s favor (massive)', source: 'Swing' },
                  { mood: 'surprised', trigger: '15-30% swing against Rookie', source: 'Swing' },
                  { mood: 'heartbroken', trigger: '30%+ swing against Rookie (devastating)', source: 'Swing' },
                  { mood: 'angry', trigger: 'Rookie gets checkmated', source: 'Game event' },
                  { mood: 'smug', trigger: 'Rookie delivers checkmate or check', source: 'Game event' },
                  { mood: 'surprised', trigger: 'Player gives Rookie check', source: 'Game event' },
                  { mood: 'nervous', trigger: 'Stalemate or draw', source: 'Game event' },
                ].map((row, i) => (
                  <tr key={i} className={row.highlight ? 'bg-red-500/8' : ''}>
                    <td className="px-4 py-2.5 font-semibold">{row.mood}</td>
                    <td className="px-4 py-2.5 text-chess-text-muted">{row.trigger}</td>
                    <td className="px-4 py-2.5 text-chess-text-faint">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
