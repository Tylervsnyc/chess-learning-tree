'use client';

import React, { useState, useEffect } from 'react';
import { warmupAudio, playCelebrationSound, playMoveSound, playCaptureSound } from '@/lib/sounds';

// Warm ascending chord variations
const SOUNDS: Record<string, {
  name: string;
  play: (ctx: AudioContext) => void;
}> = {
  // Major chord arpeggios (warm)
  cMajorSlow: {
    name: 'C Major (slow)',
    play: (ctx) => {
      const notes = [262, 330, 392, 523]; // C4, E4, G4, C5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    },
  },
  cMajorFast: {
    name: 'C Major (fast)',
    play: (ctx) => {
      const notes = [262, 330, 392, 523];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.06;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    },
  },
  gMajor: {
    name: 'G Major',
    play: (ctx) => {
      const notes = [392, 494, 587, 784]; // G4, B4, D5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    },
  },
  fMajor: {
    name: 'F Major',
    play: (ctx) => {
      const notes = [349, 440, 523, 698]; // F4, A4, C5, F5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    },
  },

  // With octave doubling (fuller sound)
  cMajorFull: {
    name: 'C Major (full)',
    play: (ctx) => {
      const notes = [262, 330, 392, 523];
      notes.forEach((freq, i) => {
        [freq, freq * 2].forEach((f, j) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = f;
          const t = ctx.currentTime + i * 0.09;
          gain.gain.setValueAtTime(j === 0 ? 0.18 : 0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.3);
        });
      });
    },
  },

  // Sine wave (softer)
  cMajorSine: {
    name: 'C Major (sine)',
    play: (ctx) => {
      const notes = [262, 330, 392, 523];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    },
  },

  // Extended (5 notes)
  cMajor5: {
    name: 'C Major (5 notes)',
    play: (ctx) => {
      const notes = [262, 330, 392, 523, 659]; // +E5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    },
  },

  // Lower register (warmer)
  cMajorLow: {
    name: 'C Major (low)',
    play: (ctx) => {
      const notes = [131, 165, 196, 262]; // C3, E3, G3, C4
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    },
  },

  // With reverb-like tail
  cMajorReverb: {
    name: 'C Major (reverb)',
    play: (ctx) => {
      const notes = [262, 330, 392, 523];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.6);
      });
    },
  },

  // Stacked chord (all at once then resolve)
  stackedResolve: {
    name: 'Stacked resolve',
    play: (ctx) => {
      const chord = [262, 330, 392];
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      });
      // Resolve note
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 523;
      gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + 0.15);
      osc.stop(ctx.currentTime + 0.5);
    },
  },

  // Harp-like (quick)
  harpQuick: {
    name: 'Harp (quick)',
    play: (ctx) => {
      const notes = [262, 330, 392, 523, 659, 784];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.04;
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    },
  },

  // Two-note simple
  twoNote: {
    name: 'Two note',
    play: (ctx) => {
      [392, 523].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    },
  },

  // Three note
  threeNote: {
    name: 'Three note',
    play: (ctx) => {
      [330, 392, 523].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    },
  },

  // Piano-like attack
  pianoChord: {
    name: 'Piano chord',
    play: (ctx) => {
      const notes = [262, 330, 392, 523];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc2.type = 'sine';
        osc.frequency.value = freq;
        osc2.frequency.value = freq * 2;
        const t = ctx.currentTime + i * 0.05;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc2.start(t);
        osc.stop(t + 0.4);
        osc2.stop(t + 0.4);
      });
    },
  },

  // Gentle with fifth harmony
  gentleFifth: {
    name: 'Gentle fifth',
    play: (ctx) => {
      const notes = [262, 330, 392, 523];
      notes.forEach((freq, i) => {
        [freq, freq * 1.5].forEach((f, j) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;
          const t = ctx.currentTime + i * 0.1;
          gain.gain.setValueAtTime(j === 0 ? 0.15 : 0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.35);
        });
      });
    },
  },

  // Bright and quick
  brightQuick: {
    name: 'Bright quick',
    play: (ctx) => {
      const notes = [523, 659, 784, 1047]; // C5 up
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.06;
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
      });
    },
  },
};

export default function TestSoundsPage() {
  const [ctx, setCtx] = useState<AudioContext | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    const audioCtx = new AudioContext();
    setCtx(audioCtx);
    warmupAudio();
    return () => { audioCtx.close(); };
  }, []);

  const play = async (id: string) => {
    if (!ctx) return;
    if (ctx.state === 'suspended') await ctx.resume();
    setPlaying(id);
    SOUNDS[id].play(ctx);
    setTimeout(() => setPlaying(null), 300);
  };

  return (
    <div className="h-full overflow-auto bg-[#131F24] text-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Celebration Sounds</h1>
          <a href="/learn" className="text-gray-400 hover:text-white text-sm">← Back</a>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {Object.entries(SOUNDS).map(([id, sound]) => (
            <button
              key={id}
              onClick={() => play(id)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${playing === id
                  ? 'bg-[#58CC02] text-white'
                  : 'bg-[#1A2C35] hover:bg-[#243842] text-gray-200'
                }
              `}
            >
              {sound.name}
            </button>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-gray-400 text-sm mb-3">Actual app sounds:</p>
          <div className="flex gap-2">
            <button
              onClick={() => playCelebrationSound()}
              className="px-4 py-2 bg-[#58CC02] rounded-lg text-sm font-medium hover:bg-[#4CAF00]"
            >
              Celebration
            </button>
            <button
              onClick={() => playMoveSound()}
              className="px-4 py-2 bg-[#1A2C35] rounded-lg text-sm font-medium hover:bg-[#243842]"
            >
              Move
            </button>
            <button
              onClick={() => playCaptureSound()}
              className="px-4 py-2 bg-[#1A2C35] rounded-lg text-sm font-medium hover:bg-[#243842]"
            >
              Capture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
