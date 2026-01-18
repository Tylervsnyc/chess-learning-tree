'use client';

import React, { useState, useRef, useCallback } from 'react';

// ============================================
// SOUND GENERATORS (Web Audio API)
// ============================================

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3
) {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playChord(frequencies: number[], duration: number, type: OscillatorType = 'sine') {
  frequencies.forEach((f, i) => {
    setTimeout(() => playTone(f, duration, type, 0.2), i * 30);
  });
}

// SCALE FREQUENCIES
// Major scale: C, D, E, F, G, A (6 notes)
const MAJOR_SCALE = [262, 294, 330, 349, 392, 440];
const MAJOR_NAMES = ['C', 'D', 'E', 'F', 'G', 'A'];

// Chromatic scale: C, C#, D, D#, E, F (6 half steps)
const CHROMATIC_SCALE = [262, 277, 294, 311, 330, 349];
const CHROMATIC_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F'];

// Pentatonic scale: C, D, E, G, A, C+
const PENTATONIC_SCALE = [262, 294, 330, 392, 440, 523];
const PENTATONIC_NAMES = ['C', 'D', 'E', 'G', 'A', 'C+'];

// Mellow coin at a specific frequency
function playMellowCoin(baseFreq: number) {
  const ctx = new AudioContext();
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  osc1.type = 'triangle';
  osc2.type = 'triangle';
  osc1.frequency.value = baseFreq;
  osc2.frequency.value = baseFreq * 1.26; // Major third above
  gain.gain.setValueAtTime(0.35, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  osc1.start();
  osc2.start(ctx.currentTime + 0.1);
  osc1.stop(ctx.currentTime + 0.25);
  osc2.stop(ctx.currentTime + 0.55);
}

// Scale sounds for testing
const majorScaleSounds = MAJOR_SCALE.map((freq, i) => ({
  name: `${MAJOR_NAMES[i]} (${freq}Hz)`,
  note: MAJOR_NAMES[i],
  play: () => playMellowCoin(freq),
}));

const chromaticScaleSounds = CHROMATIC_SCALE.map((freq, i) => ({
  name: `${CHROMATIC_NAMES[i]} (${freq}Hz)`,
  note: CHROMATIC_NAMES[i],
  play: () => playMellowCoin(freq),
}));

const pentatonicSounds = PENTATONIC_SCALE.map((freq, i) => ({
  name: `${PENTATONIC_NAMES[i]} (${freq}Hz)`,
  note: PENTATONIC_NAMES[i],
  play: () => playMellowCoin(freq),
}));

// SUCCESS SOUNDS (puzzle correct) - Coin variations
const successSounds = [
  {
    name: 'Classic Coin',
    play: () => {
      const ctx = new AudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'square';
      osc2.type = 'square';
      osc1.frequency.value = 587; // D5
      osc2.frequency.value = 784; // G5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start(ctx.currentTime + 0.12);
      osc1.stop(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.4);
    },
  },
  {
    name: 'Rich Coin',
    play: () => {
      const ctx = new AudioContext();
      // First hit
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.value = 523; // C5
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.2);
      // Second hit with shimmer
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'square';
        osc3.type = 'sine';
        osc2.frequency.value = 698; // F5
        osc3.frequency.value = 1047; // C6 shimmer
        gain2.gain.setValueAtTime(0.22, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc2.connect(gain2);
        osc3.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc3.start();
        osc2.stop(ctx.currentTime + 0.35);
        osc3.stop(ctx.currentTime + 0.35);
      }, 100);
    },
  },
  {
    name: 'Deep Coin',
    play: () => {
      const ctx = new AudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'square';
      osc2.type = 'square';
      osc1.frequency.value = 392; // G4
      osc2.frequency.value = 523; // C5
      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start(ctx.currentTime + 0.1);
      osc1.stop(ctx.currentTime + 0.18);
      osc2.stop(ctx.currentTime + 0.45);
    },
  },
  {
    name: 'Triple Coin',
    play: () => {
      const ctx = new AudioContext();
      const notes = [440, 554, 659]; // A4, C#5, E5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    },
  },
  {
    name: 'Warm Coin',
    play: () => {
      const ctx = new AudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'triangle';
      osc2.type = 'square';
      osc1.frequency.value = 349; // F4
      osc2.frequency.value = 523; // C5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start(ctx.currentTime + 0.08);
      osc1.stop(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.5);
    },
  },
  {
    name: 'Chunky Coin',
    play: () => {
      const ctx = new AudioContext();
      // Bass thump
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'sine';
      bass.frequency.value = 180;
      bassGain.gain.setValueAtTime(0.3, ctx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      bass.connect(bassGain);
      bassGain.connect(ctx.destination);
      bass.start();
      bass.stop(ctx.currentTime + 0.15);
      // Coin sound
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'square';
      osc2.type = 'square';
      osc1.frequency.value = 466; // Bb4
      osc2.frequency.value = 622; // Eb5
      gain.gain.setValueAtTime(0.22, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(ctx.currentTime + 0.05);
      osc2.start(ctx.currentTime + 0.15);
      osc1.stop(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.45);
    },
  },
  {
    name: 'Retro Coin',
    play: () => {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(330, ctx.currentTime); // E4
      osc.frequency.setValueAtTime(494, ctx.currentTime + 0.1); // B4
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    },
  },
  {
    name: 'Bouncy Coin',
    play: () => {
      const ctx = new AudioContext();
      const times = [0, 0.08, 0.14, 0.19];
      const freqs = [392, 494, 587, 659]; // G4, B4, D5, E5
      times.forEach((t, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freqs[i];
        const startTime = ctx.currentTime + t;
        const duration = 0.12 + (i * 0.05);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    },
  },
  {
    name: 'Mellow Coin',
    play: () => {
      const ctx = new AudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'triangle';
      osc2.type = 'triangle';
      osc1.frequency.value = 440; // A4
      osc2.frequency.value = 554; // C#5
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start(ctx.currentTime + 0.1);
      osc1.stop(ctx.currentTime + 0.25);
      osc2.stop(ctx.currentTime + 0.55);
    },
  },
  {
    name: 'Loot Coin',
    play: () => {
      const ctx = new AudioContext();
      // Sparkle layer
      const sparkle = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      sparkle.type = 'sine';
      sparkle.frequency.value = 880;
      sparkleGain.gain.setValueAtTime(0.1, ctx.currentTime);
      sparkleGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      sparkle.connect(sparkleGain);
      sparkleGain.connect(ctx.destination);
      sparkle.start();
      sparkle.stop(ctx.currentTime + 0.3);
      // Main coin
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'square';
      osc2.type = 'square';
      osc1.frequency.value = 370; // F#4
      osc2.frequency.value = 554; // C#5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start(ctx.currentTime + 0.1);
      osc1.stop(ctx.currentTime + 0.18);
      osc2.stop(ctx.currentTime + 0.5);
    },
  },
];

// CHESS MOVE SOUNDS (using actual audio files)
function playMoveSound() {
  const audio = new Audio('/sounds/move.mp3');
  audio.volume = 0.7;
  audio.play();
}

function playCaptureSound() {
  const audio = new Audio('/sounds/capture.mp3');
  audio.volume = 0.7;
  audio.play();
}

const moveSounds = [
  {
    name: 'Move',
    description: 'Piece placement sound',
    play: playMoveSound,
  },
  {
    name: 'Capture',
    description: 'Piece capture sound',
    play: playCaptureSound,
  },
];

// ERROR SOUNDS (puzzle wrong)
const errorSounds = [
  {
    name: 'Buzz',
    play: () => playTone(150, 0.2, 'sawtooth', 0.25),
  },
  {
    name: 'Low Thud',
    play: () => playTone(100, 0.15, 'sine', 0.4),
  },
  {
    name: 'Double Buzz',
    play: () => {
      playTone(180, 0.1, 'square', 0.2);
      setTimeout(() => playTone(150, 0.15, 'square', 0.2), 120);
    },
  },
  {
    name: 'Descending',
    play: () => {
      playTone(400, 0.1, 'sine', 0.3);
      setTimeout(() => playTone(300, 0.15, 'sine', 0.3), 100);
    },
  },
  {
    name: 'Soft Bonk',
    play: () => {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    },
  },
  {
    name: 'Nope',
    play: () => {
      playTone(523, 0.08, 'sine', 0.3);
      setTimeout(() => playTone(466, 0.12, 'sine', 0.3), 100);
    },
  },
  {
    name: 'Wobble',
    play: () => {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.setValueAtTime(200, ctx.currentTime + 0.05);
      osc.frequency.setValueAtTime(250, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    },
  },
  {
    name: 'Dull Click',
    play: () => playTone(200, 0.08, 'triangle', 0.35),
  },
  {
    name: 'Minor Chord',
    play: () => playChord([220, 262, 330], 0.2, 'sine'),
  },
  {
    name: 'Static Burst',
    play: () => {
      const ctx = new AudioContext();
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      gain.gain.value = 0.15;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    },
  },
];

// CELEBRATION SOUNDS (lesson complete) - Resolves from chromatic buildup ending on F
// Chromatic ends on F (349Hz), so these should feel like satisfying resolutions
const celebrationSounds = [
  {
    name: 'Major Resolution',
    play: () => {
      // F -> G -> C chord resolution
      const ctx = new AudioContext();
      playMellowCoin(349); // F continuation
      setTimeout(() => {
        // Big C major chord
        const freqs = [262, 330, 392, 523];
        freqs.forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.8);
        });
      }, 300);
    },
  },
  {
    name: 'Triumphant Climb',
    play: () => {
      // Continue chromatic then burst into major
      const ctx = new AudioContext();
      const buildup = [370, 392, 415]; // F#, G, G#
      buildup.forEach((f, i) => {
        setTimeout(() => playMellowCoin(f), i * 100);
      });
      setTimeout(() => {
        // Explosion into C major
        [523, 659, 784, 1047].forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1);
        });
      }, 350);
    },
  },
  {
    name: 'Sparkle Burst',
    play: () => {
      const ctx = new AudioContext();
      // Quick ascending sparkle
      const sparkles = [523, 659, 784, 880, 1047, 1175, 1319, 1568];
      sparkles.forEach((f, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        }, i * 50);
      });
      // Final chord
      setTimeout(() => {
        [523, 784, 1047].forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.7);
        });
      }, 400);
    },
  },
  {
    name: 'Victory Fanfare',
    play: () => {
      const ctx = new AudioContext();
      // Classic fanfare rhythm
      const notes = [
        { f: 392, t: 0, d: 0.15 },     // G
        { f: 392, t: 150, d: 0.15 },   // G
        { f: 392, t: 300, d: 0.15 },   // G
        { f: 523, t: 450, d: 0.5 },    // C (hold)
        { f: 440, t: 700, d: 0.15 },   // A
        { f: 494, t: 850, d: 0.15 },   // B
        { f: 523, t: 1000, d: 0.8 },   // C (final)
      ];
      notes.forEach(({ f, t, d }) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + d);
        }, t);
      });
    },
  },
  {
    name: 'Warm Glow',
    play: () => {
      const ctx = new AudioContext();
      // Soft pad-like resolution
      const chord = [262, 330, 392, 523];
      chord.forEach((f, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        }, i * 80);
      });
    },
  },
  {
    name: 'Retro Complete',
    play: () => {
      const ctx = new AudioContext();
      // 8-bit style victory
      const melody = [523, 523, 523, 659, 784, 659, 784, 1047];
      const durations = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.4];
      let time = 0;
      melody.forEach((f, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durations[i]);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + durations[i]);
        }, time);
        time += durations[i] * 1000 * 0.8;
      });
    },
  },
  {
    name: 'Bell Cascade',
    play: () => {
      const ctx = new AudioContext();
      const bells = [784, 988, 1175, 1319, 1568, 1047];
      bells.forEach((f, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc2.type = 'sine';
          osc.frequency.value = f;
          osc2.frequency.value = f * 2.5; // Overtone
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
          osc.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc2.start();
          osc.stop(ctx.currentTime + 0.6);
          osc2.stop(ctx.currentTime + 0.6);
        }, i * 100);
      });
    },
  },
  {
    name: 'Heroic Resolve',
    play: () => {
      const ctx = new AudioContext();
      // Power chord progression
      const chords = [
        [349, 440, 523],  // F major
        [392, 494, 587],  // G major
        [523, 659, 784],  // C major
      ];
      chords.forEach((chord, i) => {
        setTimeout(() => {
          chord.forEach(f => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = f;
            const dur = i === 2 ? 0.9 : 0.25;
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + dur);
          });
        }, i * 250);
      });
    },
  },
  {
    name: 'Swoosh & Shine',
    play: () => {
      const ctx = new AudioContext();
      // Rising swoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
      // Shimmer chord
      setTimeout(() => {
        [523, 659, 784, 1047, 1319].forEach((f, i) => {
          setTimeout(() => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'triangle';
            o.frequency.value = f;
            g.gain.setValueAtTime(0.15, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
            o.connect(g);
            g.connect(ctx.destination);
            o.start();
            o.stop(ctx.currentTime + 0.7);
          }, i * 30);
        });
      }, 300);
    },
  },
  {
    name: 'Gentle Celebration',
    play: () => {
      const ctx = new AudioContext();
      // Soft, satisfying resolution
      const notes = [
        { f: 392, t: 0 },    // G
        { f: 440, t: 150 },  // A
        { f: 523, t: 300 },  // C
        { f: 659, t: 500 },  // E
        { f: 784, t: 700 },  // G
      ];
      notes.forEach(({ f, t }) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc2.type = 'sine';
          osc.frequency.value = f;
          osc2.frequency.value = f * 1.5; // Fifth
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc2.start();
          osc.stop(ctx.currentTime + 0.5);
          osc2.stop(ctx.currentTime + 0.5);
        }, t);
      });
    },
  },
];

// ============================================
// PROGRESS BAR ANIMATIONS (basic)
// ============================================

const progressAnimations = [
  {
    name: 'Simple Fill',
    className: 'transition-all duration-500 ease-out',
    style: {},
  },
  {
    name: 'Bounce',
    className: 'transition-all duration-700',
    style: { transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
  },
  {
    name: 'Elastic',
    className: 'transition-all duration-1000',
    style: { transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
  },
  {
    name: 'Smooth Slide',
    className: 'transition-all duration-600 ease-in-out',
    style: {},
  },
  {
    name: 'Quick Snap',
    className: 'transition-all duration-200 ease-out',
    style: {},
  },
  {
    name: 'Overshoot',
    className: 'transition-all duration-500',
    style: { transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  },
  {
    name: 'Slow Start',
    className: 'transition-all duration-800 ease-in',
    style: {},
  },
  {
    name: 'Decelerate',
    className: 'transition-all duration-600',
    style: { transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
  },
  {
    name: 'Spring',
    className: 'transition-all duration-700',
    style: { transitionTimingFunction: 'cubic-bezier(0.5, 1.8, 0.5, 0.8)' },
  },
  {
    name: 'Steps',
    className: 'transition-all duration-500',
    style: { transitionTimingFunction: 'steps(6, end)' },
  },
];

// ============================================
// STREAK EFFECTS (building intensity)
// ============================================

interface StreakStyle {
  name: string;
  description: string;
  getStyle: (streak: number) => React.CSSProperties;
  getClassName: (streak: number) => string;
}

const streakEffects: StreakStyle[] = [
  {
    name: 'Lava Pulse',
    description: 'Pulses orange/red, glows more intensely',
    getClassName: (streak) => streak >= 2 ? 'animate-pulse' : '',
    getStyle: (streak) => {
      if (streak === 0) return { backgroundColor: '#58CC02' };
      if (streak === 1) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        backgroundColor: `rgb(${88 + 167 * intensity}, ${204 - 134 * intensity}, ${2})`,
        boxShadow: `0 0 ${10 + streak * 5}px rgba(255, ${100 - streak * 15}, 0, ${0.3 + intensity * 0.5})`,
      };
    },
  },
  {
    name: 'Trembling Energy',
    description: 'Shakes more as streak builds',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      return {
        backgroundColor: '#58CC02',
        animation: `shake ${0.5 - streak * 0.05}s infinite`,
        boxShadow: `0 0 ${streak * 4}px rgba(88, 204, 2, 0.6)`,
      };
    },
  },
  {
    name: 'Heat Rising',
    description: 'Green → Yellow → Orange → Red',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      const colors = ['#58CC02', '#7ACC02', '#AACC02', '#CCAA02', '#CC7702', '#CC4402'];
      const color = colors[Math.min(streak, 5)];
      const glow = streak >= 2 ? `0 0 ${streak * 6}px ${color}` : 'none';
      return { backgroundColor: color, boxShadow: glow };
    },
  },
  {
    name: 'Electric Charge',
    description: 'Flickering, electric glow builds up',
    getClassName: (streak) => streak >= 3 ? 'animate-pulse' : '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      return {
        backgroundColor: '#58CC02',
        boxShadow: `0 0 ${streak * 4}px #58CC02, 0 0 ${streak * 8}px #7DF9FF, 0 0 ${streak * 12}px rgba(125, 249, 255, 0.3)`,
      };
    },
  },
  {
    name: 'Magma Bubble',
    description: 'Deep red with bubbling animation',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `linear-gradient(90deg,
          rgb(${180 + 75 * intensity}, ${80 - 40 * intensity}, 0) 0%,
          rgb(${255}, ${120 - 80 * intensity}, 0) 50%,
          rgb(${180 + 75 * intensity}, ${80 - 40 * intensity}, 0) 100%)`,
        backgroundSize: '200% 100%',
        animation: streak >= 2 ? `magmaFlow ${2 - streak * 0.2}s ease infinite` : 'none',
        boxShadow: `0 0 ${streak * 5}px rgba(255, 100, 0, 0.7)`,
      };
    },
  },
  {
    name: 'Power Surge',
    description: 'White-hot center, shaking',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `linear-gradient(90deg,
          #58CC02 0%,
          rgb(${88 + 167 * intensity}, ${204 + 51 * intensity}, ${2 + 253 * intensity}) 50%,
          #58CC02 100%)`,
        animation: streak >= 3 ? `shake ${0.4 - streak * 0.04}s infinite, pulse 0.5s infinite` : 'none',
        boxShadow: `0 0 ${streak * 8}px rgba(255, 255, 255, ${0.2 + intensity * 0.5})`,
      };
    },
  },
  {
    name: 'Rainbow Fire',
    description: 'Cycles through colors, intensifies',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      return {
        background: `linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000)`,
        backgroundSize: '400% 100%',
        animation: `rainbowFlow ${3 - streak * 0.3}s linear infinite`,
        boxShadow: `0 0 ${streak * 5}px rgba(255, 255, 255, 0.5)`,
      };
    },
  },
  {
    name: 'Volcanic',
    description: 'Dark red base, bright cracks appear',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const crackIntensity = Math.min((streak - 1) / 5, 1);
      return {
        backgroundColor: `rgb(${139 + 60 * crackIntensity}, ${30 + 40 * crackIntensity}, 0)`,
        boxShadow: `
          inset 0 0 ${streak * 3}px rgba(255, 200, 0, ${crackIntensity}),
          0 0 ${streak * 4}px rgba(255, 100, 0, 0.8)
        `,
        animation: streak >= 4 ? 'shake 0.15s infinite' : 'none',
      };
    },
  },
  {
    name: 'Neon Overload',
    description: 'Neon green intensifies to white',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        backgroundColor: `rgb(${88 + 167 * intensity}, ${204 + 51 * intensity}, ${2 + 100 * intensity})`,
        boxShadow: `
          0 0 ${5 + streak * 3}px #58CC02,
          0 0 ${10 + streak * 5}px rgba(88, 255, 2, 0.5),
          0 0 ${15 + streak * 8}px rgba(150, 255, 100, 0.3)
        `,
        animation: streak >= 4 ? 'pulse 0.3s infinite' : 'none',
      };
    },
  },
  {
    name: 'Unstable Core',
    description: 'Pulsing core, violent shake at max',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `radial-gradient(ellipse at center,
          rgba(255, ${255 - 155 * intensity}, ${200 - 200 * intensity}, 1) 0%,
          rgba(${88 + 100 * intensity}, ${150 - 80 * intensity}, 2, 1) 100%)`,
        boxShadow: `0 0 ${streak * 6}px rgba(255, ${150 - streak * 20}, 0, 0.7)`,
        animation: streak >= 3
          ? `shake ${0.3 - (streak - 3) * 0.03}s infinite, pulse ${0.8 - streak * 0.1}s infinite`
          : 'none',
      };
    },
  },
  {
    name: 'Supernova: Gentle',
    description: 'Slow shake, soft white/pink glow',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `
          radial-gradient(ellipse at center,
            rgba(255, 255, 255, ${0.3 + intensity * 0.7}) 0%,
            rgba(255, 220, 240, ${0.2 + intensity * 0.4}) 20%,
            transparent 50%),
          linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
        `,
        backgroundSize: '100% 100%, 300% 100%',
        animation: streak >= 2
          ? `rainbowFlow ${3 - streak * 0.2}s linear infinite${streak >= 4 ? `, shake ${0.4}s infinite` : ''}`
          : 'none',
        boxShadow: `
          0 0 ${streak * 5}px rgba(255, 200, 220, ${0.4 + intensity * 0.4}),
          0 0 ${streak * 10}px rgba(255, 150, 200, 0.4)
        `,
      };
    },
  },
  {
    name: 'Supernova: Aggressive',
    description: 'Fast shake, hot orange/red glow',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `
          radial-gradient(ellipse at center,
            rgba(255, 255, 200, ${0.4 + intensity * 0.6}) 0%,
            rgba(255, 150, 50, ${0.3 + intensity * 0.4}) 25%,
            transparent 50%),
          linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
        `,
        backgroundSize: '100% 100%, 300% 100%',
        animation: streak >= 2
          ? `rainbowFlow ${2 - streak * 0.2}s linear infinite${streak >= 3 ? `, shake ${0.15 - (streak - 3) * 0.02}s infinite` : ''}`
          : 'none',
        boxShadow: `
          0 0 ${streak * 6}px rgba(255, 100, 0, ${0.5 + intensity * 0.5}),
          0 0 ${streak * 12}px rgba(255, 50, 0, 0.6)
        `,
      };
    },
  },
  {
    name: 'Supernova: Electric',
    description: 'Medium shake, cyan/electric blue glow',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `
          radial-gradient(ellipse at center,
            rgba(200, 255, 255, ${0.4 + intensity * 0.6}) 0%,
            rgba(100, 200, 255, ${0.2 + intensity * 0.4}) 20%,
            transparent 50%),
          linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
        `,
        backgroundSize: '100% 100%, 300% 100%',
        animation: streak >= 2
          ? `rainbowFlow ${2.5 - streak * 0.25}s linear infinite${streak >= 4 ? `, shake ${0.2 - (streak - 4) * 0.03}s infinite` : ''}`
          : 'none',
        boxShadow: `
          0 0 ${streak * 5}px rgba(100, 200, 255, ${0.5 + intensity * 0.5}),
          0 0 ${streak * 10}px rgba(0, 255, 255, 0.4),
          0 0 ${streak * 15}px rgba(100, 150, 255, 0.3)
        `,
      };
    },
  },
  {
    name: 'Supernova: Golden',
    description: 'Smooth shake, warm gold/yellow glow',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `
          radial-gradient(ellipse at center,
            rgba(255, 255, 220, ${0.4 + intensity * 0.6}) 0%,
            rgba(255, 215, 0, ${0.3 + intensity * 0.4}) 25%,
            transparent 55%),
          linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
        `,
        backgroundSize: '100% 100%, 300% 100%',
        animation: streak >= 2
          ? `rainbowFlow ${2.8 - streak * 0.3}s linear infinite${streak >= 4 ? `, shake ${0.3 - (streak - 4) * 0.04}s infinite` : ''}`
          : 'none',
        boxShadow: `
          0 0 ${streak * 6}px rgba(255, 215, 0, ${0.5 + intensity * 0.5}),
          0 0 ${streak * 12}px rgba(255, 180, 0, 0.5)
        `,
      };
    },
  },
  {
    name: 'Supernova: Neon',
    description: 'Vibrating shake, bright green/lime glow',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `
          radial-gradient(ellipse at center,
            rgba(220, 255, 220, ${0.4 + intensity * 0.6}) 0%,
            rgba(100, 255, 100, ${0.3 + intensity * 0.4}) 20%,
            transparent 50%),
          linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
        `,
        backgroundSize: '100% 100%, 300% 100%',
        animation: streak >= 2
          ? `rainbowFlow ${2.2 - streak * 0.2}s linear infinite${streak >= 3 ? `, shake ${0.12 - (streak - 3) * 0.015}s infinite` : ''}`
          : 'none',
        boxShadow: `
          0 0 ${streak * 6}px rgba(50, 255, 50, ${0.6 + intensity * 0.4}),
          0 0 ${streak * 12}px rgba(100, 255, 100, 0.5),
          0 0 ${streak * 18}px rgba(150, 255, 150, 0.3)
        `,
      };
    },
  },
  {
    name: 'Supernova: Inferno',
    description: 'Violent shake, deep red/magma glow',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `
          radial-gradient(ellipse at center,
            rgba(255, 255, 150, ${0.5 + intensity * 0.5}) 0%,
            rgba(255, 100, 0, ${0.4 + intensity * 0.4}) 20%,
            rgba(200, 0, 0, ${0.2 + intensity * 0.3}) 40%,
            transparent 60%),
          linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
        `,
        backgroundSize: '100% 100%, 300% 100%',
        animation: streak >= 2
          ? `rainbowFlow ${1.8 - streak * 0.15}s linear infinite${streak >= 3 ? `, shake ${0.1 - (streak - 3) * 0.012}s infinite` : ''}`
          : 'none',
        boxShadow: `
          0 0 ${streak * 5}px rgba(255, 50, 0, ${0.6 + intensity * 0.4}),
          0 0 ${streak * 10}px rgba(255, 0, 0, 0.6),
          0 0 ${streak * 16}px rgba(150, 0, 0, 0.4)
        `,
      };
    },
  },
  {
    name: 'Supernova: Cosmic',
    description: 'Pulsing shake, purple/violet glow',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `
          radial-gradient(ellipse at center,
            rgba(255, 230, 255, ${0.4 + intensity * 0.6}) 0%,
            rgba(200, 100, 255, ${0.3 + intensity * 0.4}) 25%,
            transparent 55%),
          linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
        `,
        backgroundSize: '100% 100%, 300% 100%',
        animation: streak >= 2
          ? `rainbowFlow ${2.6 - streak * 0.25}s linear infinite${streak >= 4 ? `, shake ${0.25 - (streak - 4) * 0.035}s infinite` : ''}`
          : 'none',
        boxShadow: `
          0 0 ${streak * 5}px rgba(200, 100, 255, ${0.5 + intensity * 0.5}),
          0 0 ${streak * 10}px rgba(150, 50, 255, 0.5),
          0 0 ${streak * 15}px rgba(100, 0, 200, 0.3)
        `,
      };
    },
  },
  {
    name: 'Supernova: Ice',
    description: 'Crisp shake, white/ice blue glow',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `
          radial-gradient(ellipse at center,
            rgba(255, 255, 255, ${0.5 + intensity * 0.5}) 0%,
            rgba(200, 230, 255, ${0.3 + intensity * 0.4}) 20%,
            transparent 50%),
          linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
        `,
        backgroundSize: '100% 100%, 300% 100%',
        animation: streak >= 2
          ? `rainbowFlow ${2.4 - streak * 0.2}s linear infinite${streak >= 4 ? `, shake ${0.18 - (streak - 4) * 0.025}s infinite` : ''}`
          : 'none',
        boxShadow: `
          0 0 ${streak * 6}px rgba(200, 230, 255, ${0.6 + intensity * 0.4}),
          0 0 ${streak * 12}px rgba(150, 200, 255, 0.5),
          0 0 ${streak * 18}px rgba(255, 255, 255, 0.4)
        `,
      };
    },
  },
  {
    name: 'Supernova: Plasma',
    description: 'Erratic shake, mixed pink/blue glow',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `
          radial-gradient(ellipse at center,
            rgba(255, 255, 255, ${0.4 + intensity * 0.6}) 0%,
            rgba(255, 100, 200, ${0.2 + intensity * 0.3}) 15%,
            rgba(100, 150, 255, ${0.2 + intensity * 0.3}) 30%,
            transparent 50%),
          linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
        `,
        backgroundSize: '100% 100%, 300% 100%',
        animation: streak >= 2
          ? `rainbowFlow ${2 - streak * 0.18}s linear infinite${streak >= 3 ? `, shake ${0.22 - (streak - 3) * 0.03}s infinite` : ''}`
          : 'none',
        boxShadow: `
          0 0 ${streak * 4}px rgba(255, 100, 200, ${0.4 + intensity * 0.4}),
          0 0 ${streak * 8}px rgba(100, 150, 255, 0.4),
          0 0 ${streak * 14}px rgba(200, 100, 255, 0.3)
        `,
      };
    },
  },
  {
    name: 'Supernova: Solar',
    description: 'Building shake, warm white/sun glow',
    getClassName: (streak) => '',
    getStyle: (streak) => {
      if (streak < 2) return { backgroundColor: '#58CC02' };
      const intensity = Math.min(streak / 6, 1);
      return {
        background: `
          radial-gradient(ellipse at center,
            rgba(255, 255, 255, ${0.5 + intensity * 0.5}) 0%,
            rgba(255, 250, 200, ${0.4 + intensity * 0.4}) 15%,
            rgba(255, 200, 100, ${0.2 + intensity * 0.3}) 35%,
            transparent 55%),
          linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
        `,
        backgroundSize: '100% 100%, 300% 100%',
        animation: streak >= 2
          ? `rainbowFlow ${2.5 - streak * 0.22}s linear infinite${streak >= 4 ? `, shake ${0.28 - (streak - 4) * 0.04}s infinite` : ''}`
          : 'none',
        boxShadow: `
          0 0 ${streak * 6}px rgba(255, 255, 200, ${0.5 + intensity * 0.5}),
          0 0 ${streak * 12}px rgba(255, 220, 100, 0.5),
          0 0 ${streak * 20}px rgba(255, 180, 50, 0.3)
        `,
      };
    },
  },
];

// ============================================
// COMPONENTS
// ============================================

interface SoundButtonProps {
  name: string;
  play: () => void;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

function SoundButton({ name, play, index, selected, onSelect }: SoundButtonProps) {
  return (
    <button
      onClick={() => {
        play();
        onSelect();
      }}
      className={`p-3 rounded-lg text-left transition-all ${
        selected
          ? 'bg-[#58CC02] text-white'
          : 'bg-[#1A2C35] text-gray-300 hover:bg-[#2A3C45]'
      }`}
    >
      <div className="font-medium">{index + 1}. {name}</div>
    </button>
  );
}

interface ProgressDemoProps {
  animation: typeof progressAnimations[0];
  index: number;
  selected: boolean;
  onSelect: () => void;
}

function ProgressDemo({ animation, index, selected, onSelect }: ProgressDemoProps) {
  const [progress, setProgress] = useState(30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startDemo = useCallback(() => {
    onSelect();
    setProgress(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let current = 0;
    intervalRef.current = setInterval(() => {
      current += 16.67;
      setProgress(Math.min(current, 100));
      if (current >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 300);
  }, [onSelect]);

  return (
    <button
      onClick={startDemo}
      className={`p-4 rounded-lg text-left transition-all w-full ${
        selected
          ? 'bg-[#58CC02]/20 border-2 border-[#58CC02]'
          : 'bg-[#1A2C35] border-2 border-transparent hover:bg-[#2A3C45]'
      }`}
    >
      <div className="font-medium text-white mb-3">{index + 1}. {animation.name}</div>
      <div className="h-3 bg-[#131F24] rounded-full overflow-hidden">
        <div
          className={`h-full bg-[#58CC02] ${animation.className}`}
          style={{ width: `${progress}%`, ...animation.style }}
        />
      </div>
    </button>
  );
}

// Streak Effect Demo Component
interface StreakDemoProps {
  effect: StreakStyle;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

function StreakDemo({ effect, index, selected, onSelect }: StreakDemoProps) {
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState(0);

  const simulateCorrect = useCallback(() => {
    if (streak < 6) {
      setStreak(s => s + 1);
      setProgress(p => Math.min(p + 16.67, 100));
      // Play chromatic sound
      playMellowCoin(CHROMATIC_SCALE[streak]);
    }
  }, [streak]);

  const simulateWrong = useCallback(() => {
    setStreak(0);
    // Play error sound
    playTone(150, 0.2, 'sawtooth', 0.25);
  }, []);

  const reset = useCallback(() => {
    setStreak(0);
    setProgress(0);
    onSelect();
  }, [onSelect]);

  return (
    <div
      className={`p-4 rounded-lg transition-all ${
        selected
          ? 'bg-[#FF9600]/20 border-2 border-[#FF9600]'
          : 'bg-[#1A2C35] border-2 border-transparent'
      }`}
    >
      <div className="font-medium text-white mb-1">{index + 1}. {effect.name}</div>
      <div className="text-gray-400 text-xs mb-3">{effect.description}</div>

      {/* Progress bar with streak effect */}
      <div className="h-4 bg-[#131F24] rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-300 ${effect.getClassName(streak)}`}
          style={{
            width: `${progress}%`,
            ...effect.getStyle(streak),
          }}
        />
      </div>

      {/* Streak indicator */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-400 text-sm">Streak:</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < streak ? 'bg-[#FF9600] scale-110' : 'bg-[#2A3C45]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-2">
        <button
          onClick={simulateCorrect}
          disabled={streak >= 6}
          className="flex-1 py-2 bg-[#58CC02] hover:bg-[#4CAF00] disabled:bg-[#2A3C45] disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-all"
        >
          Correct
        </button>
        <button
          onClick={simulateWrong}
          className="flex-1 py-2 bg-[#FF4B4B] hover:bg-[#E04040] text-white text-sm font-medium rounded-lg transition-all"
        >
          Wrong
        </button>
        <button
          onClick={reset}
          className="px-3 py-2 bg-[#2A3C45] hover:bg-[#3A4C55] text-white text-sm rounded-lg transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// CSS for custom animations
const customStyles = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
  }

  @keyframes magmaFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes rainbowFlow {
    0% { background-position: 0% 50%; }
    100% { background-position: 400% 50%; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

export default function TestSoundsPage() {
  const [selectedSuccess, setSelectedSuccess] = useState<number | null>(null);
  const [selectedError, setSelectedError] = useState<number | null>(null);
  const [selectedCelebration, setSelectedCelebration] = useState<number | null>(null);
  const [selectedAnimation, setSelectedAnimation] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-6">
      <style>{customStyles}</style>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Sound & Animation Test Page</h1>
        <p className="text-gray-400 mb-8">Click to play sounds and preview animations. Selected items are highlighted in green.</p>

        {/* Major Scale - Mellow Coin */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#58CC02] mb-4">
            Major Scale (C D E F G A)
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Classic major scale - feels happy and resolved
          </p>
          <div className="flex gap-2 flex-wrap mb-4">
            {majorScaleSounds.map((sound, i) => (
              <button
                key={i}
                onClick={sound.play}
                className="px-6 py-4 bg-[#58CC02] hover:bg-[#4CAF00] text-white font-bold rounded-xl transition-all text-lg"
              >
                {i + 1}. {sound.note}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              majorScaleSounds.forEach((sound, i) => {
                setTimeout(sound.play, i * 600);
              });
            }}
            className="px-6 py-3 bg-[#1A2C35] hover:bg-[#2A3C45] text-white font-medium rounded-lg border border-[#58CC02] transition-all"
          >
            Play All 6 Notes
          </button>
        </section>

        {/* Chromatic Scale - Mellow Coin */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#FF9600] mb-4">
            Chromatic Scale (C C# D D# E F)
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Half steps - more tension, building suspense
          </p>
          <div className="flex gap-2 flex-wrap mb-4">
            {chromaticScaleSounds.map((sound, i) => (
              <button
                key={i}
                onClick={sound.play}
                className="px-6 py-4 bg-[#FF9600] hover:bg-[#E08600] text-white font-bold rounded-xl transition-all text-lg"
              >
                {i + 1}. {sound.note}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              chromaticScaleSounds.forEach((sound, i) => {
                setTimeout(sound.play, i * 600);
              });
            }}
            className="px-6 py-3 bg-[#1A2C35] hover:bg-[#2A3C45] text-white font-medium rounded-lg border border-[#FF9600] transition-all"
          >
            Play All 6 Notes
          </button>
        </section>

        {/* Pentatonic Scale - Mellow Coin */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1CB0F6] mb-4">
            Pentatonic Scale (C D E G A C+)
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Skips some notes - more open, Eastern feel
          </p>
          <div className="flex gap-2 flex-wrap mb-4">
            {pentatonicSounds.map((sound, i) => (
              <button
                key={i}
                onClick={sound.play}
                className="px-6 py-4 bg-[#1CB0F6] hover:bg-[#0EA0E6] text-white font-bold rounded-xl transition-all text-lg"
              >
                {i + 1}. {sound.note}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              pentatonicSounds.forEach((sound, i) => {
                setTimeout(sound.play, i * 600);
              });
            }}
            className="px-6 py-3 bg-[#1A2C35] hover:bg-[#2A3C45] text-white font-medium rounded-lg border border-[#1CB0F6] transition-all"
          >
            Play All 6 Notes
          </button>
        </section>

        {/* Chess Move Sounds */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#A560E8] mb-4">
            Chess Move & Capture Sounds
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Lichess-style move and capture sounds
          </p>
          <div className="flex gap-4">
            {moveSounds.map((sound, i) => (
              <button
                key={i}
                onClick={sound.play}
                className="px-8 py-4 bg-[#A560E8] hover:bg-[#9550D8] text-white font-bold rounded-xl transition-all"
              >
                <div className="text-lg">{sound.name}</div>
                <div className="text-sm opacity-70">{sound.description}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Success Sounds */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#58CC02] mb-4">
            Other Coin Variations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {successSounds.map((sound, i) => (
              <SoundButton
                key={i}
                name={sound.name}
                play={sound.play}
                index={i}
                selected={selectedSuccess === i}
                onSelect={() => setSelectedSuccess(i)}
              />
            ))}
          </div>
        </section>

        {/* Error Sounds */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#FF4B4B] mb-4">
            Puzzle Wrong Sounds
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {errorSounds.map((sound, i) => (
              <SoundButton
                key={i}
                name={sound.name}
                play={sound.play}
                index={i}
                selected={selectedError === i}
                onSelect={() => setSelectedError(i)}
              />
            ))}
          </div>
        </section>

        {/* Celebration Sounds */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#FFC800] mb-4">
            Lesson Complete Sounds
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {celebrationSounds.map((sound, i) => (
              <SoundButton
                key={i}
                name={sound.name}
                play={sound.play}
                index={i}
                selected={selectedCelebration === i}
                onSelect={() => setSelectedCelebration(i)}
              />
            ))}
          </div>
        </section>

        {/* Streak Effects */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#FF9600] mb-4">
            Streak Effects (Building Intensity)
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Click &quot;Correct&quot; to build streak (plays chromatic sound). Click &quot;Wrong&quot; to break it and see it reset.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {streakEffects.map((effect, i) => (
              <StreakDemo
                key={i}
                effect={effect}
                index={i}
                selected={selectedAnimation === i}
                onSelect={() => setSelectedAnimation(i)}
              />
            ))}
          </div>
        </section>

        {/* Progress Bar Animations */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1CB0F6] mb-4">
            Basic Progress Bar Animations
          </h2>
          <p className="text-gray-400 text-sm mb-4">Click to see the animation play from 0 to 100%</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {progressAnimations.map((anim, i) => (
              <ProgressDemo
                key={i}
                animation={anim}
                index={i}
                selected={selectedAnimation === i}
                onSelect={() => setSelectedAnimation(i)}
              />
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="p-6 bg-[#1A2C35] rounded-xl">
          <h2 className="text-lg font-bold mb-4">Your Selections</h2>
          <div className="space-y-2 text-gray-300">
            <div>
              <span className="text-[#58CC02]">Correct:</span>{' '}
              {selectedSuccess !== null ? successSounds[selectedSuccess].name : 'None selected'}
            </div>
            <div>
              <span className="text-[#FF4B4B]">Wrong:</span>{' '}
              {selectedError !== null ? errorSounds[selectedError].name : 'None selected'}
            </div>
            <div>
              <span className="text-[#FFC800]">Celebration:</span>{' '}
              {selectedCelebration !== null ? celebrationSounds[selectedCelebration].name : 'None selected'}
            </div>
            <div>
              <span className="text-[#1CB0F6]">Animation:</span>{' '}
              {selectedAnimation !== null ? progressAnimations[selectedAnimation].name : 'None selected'}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
