'use client';

import React, { useState, useEffect } from 'react';

// Sound library - all synthesized with Web Audio API
// Inspired by Chess.com, Lichess, and other chess apps

interface SoundVariant {
  name: string;
  description: string;
  category: 'wooden' | 'digital' | 'soft' | 'retro' | 'premium';
  playMove: (ctx: AudioContext) => void;
  playCapture: (ctx: AudioContext) => void;
}

const SOUND_LIBRARY: Record<string, SoundVariant> = {
  // === WOODEN / CLASSIC ===
  classic: {
    name: 'Classic Wood',
    description: 'Traditional wooden piece on board',
    category: 'wooden',
    playMove: (ctx) => {
      // Low thud with quick decay
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);

      filter.type = 'lowpass';
      filter.frequency.value = 400;

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    },
    playCapture: (ctx) => {
      // Heavier thud with more body
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(150, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);

      filter.type = 'lowpass';
      filter.frequency.value = 500;

      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.15);
    },
  },

  chesscom: {
    name: 'Chess.com Style',
    description: 'Similar to Chess.com default',
    category: 'wooden',
    playMove: (ctx) => {
      // Characteristic "thock" sound
      const osc = ctx.createOscillator();
      const noise = ctx.createOscillator();
      const gain = ctx.createGain();
      const noiseGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);

      noise.type = 'triangle';
      noise.frequency.value = 100;

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      noiseGain.gain.setValueAtTime(0.1, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.connect(filter);
      noise.connect(noiseGain);
      noiseGain.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      noise.start();
      osc.stop(ctx.currentTime + 0.08);
      noise.stop(ctx.currentTime + 0.08);
    },
    playCapture: (ctx) => {
      // More aggressive thock with snap
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.06);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(180, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.04);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.45, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.12);
      osc2.stop(ctx.currentTime + 0.12);
    },
  },

  lichess: {
    name: 'Lichess Style',
    description: 'Similar to Lichess default',
    category: 'digital',
    playMove: (ctx) => {
      // Clean, digital click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    },
    playCapture: (ctx) => {
      // Slightly more impact
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    },
  },

  // === DIGITAL / MODERN ===
  digital: {
    name: 'Digital Click',
    description: 'Sharp, clean digital sound',
    category: 'digital',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.03);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(600, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.08);
      osc2.stop(ctx.currentTime + 0.08);
    },
  },

  modern: {
    name: 'Modern UI',
    description: 'Sleek app-style feedback',
    category: 'digital',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.04);

      filter.type = 'bandpass';
      filter.frequency.value = 350;
      filter.Q.value = 2;

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.05);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(300, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.1);
    },
  },

  snap: {
    name: 'Snap',
    description: 'Quick snappy click',
    category: 'digital',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.02);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1500, ctx.currentTime + 0.01);
      osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc2.start(ctx.currentTime + 0.01);
      osc.stop(ctx.currentTime + 0.05);
      osc2.stop(ctx.currentTime + 0.05);
    },
  },

  // === SOFT / GENTLE ===
  soft: {
    name: 'Soft Touch',
    description: 'Gentle, quiet feedback',
    category: 'soft',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

      filter.type = 'lowpass';
      filter.frequency.value = 200;

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.12);

      filter.type = 'lowpass';
      filter.frequency.value = 250;

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    },
  },

  whisper: {
    name: 'Whisper',
    description: 'Very subtle, airy',
    category: 'soft',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.value = 100;

      filter.type = 'lowpass';
      filter.frequency.value = 150;

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.value = 120;
      osc2.type = 'sine';
      osc2.frequency.value = 90;

      filter.type = 'lowpass';
      filter.frequency.value = 180;

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.25);
      osc2.stop(ctx.currentTime + 0.25);
    },
  },

  pillow: {
    name: 'Pillow',
    description: 'Ultra soft landing',
    category: 'soft',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);

      filter.type = 'lowpass';
      filter.frequency.value = 100;

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.18);

      filter.type = 'lowpass';
      filter.frequency.value = 120;

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    },
  },

  // === RETRO / ARCADE ===
  arcade: {
    name: 'Arcade',
    description: '8-bit game style',
    category: 'retro',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(330, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.02);
      osc.frequency.setValueAtTime(330, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    },
  },

  gameboy: {
    name: 'Game Boy',
    description: 'Classic handheld vibe',
    category: 'retro',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(523, ctx.currentTime);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(784, ctx.currentTime);
      osc.frequency.setValueAtTime(523, ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    },
  },

  blip: {
    name: 'Blip',
    description: 'Retro sci-fi beep',
    category: 'retro',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    },
  },

  // === PREMIUM / UNIQUE ===
  marble: {
    name: 'Marble',
    description: 'Heavy marble piece',
    category: 'premium',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(180, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.1);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.15);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(220, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.12);

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(400, ctx.currentTime);
      osc3.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.06);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      osc.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc2.start();
      osc3.start();
      osc.stop(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.2);
      osc3.stop(ctx.currentTime + 0.2);
    },
  },

  crystal: {
    name: 'Crystal',
    description: 'Glass-like resonance',
    category: 'premium',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = 1200;

      osc2.type = 'sine';
      osc2.frequency.value = 1800;

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.15);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = 1400;
      osc2.type = 'sine';
      osc2.frequency.value = 2100;
      osc3.type = 'sine';
      osc3.frequency.value = 800;

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      osc.connect(gain);
      osc2.connect(gain);
      osc3.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc2.start();
      osc3.start();
      osc.stop(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.2);
      osc3.stop(ctx.currentTime + 0.2);
    },
  },

  thump: {
    name: 'Thump',
    description: 'Deep bass hit',
    category: 'premium',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.12);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(80, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.2);
    },
  },

  pluck: {
    name: 'Pluck',
    description: 'String-like attack',
    category: 'premium',
    playMove: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.value = 220;

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    },
    playCapture: (ctx) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.value = 330;
      osc2.type = 'sawtooth';
      osc2.frequency.value = 165;

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.15);
    },
  },
};

const CATEGORIES = [
  { id: 'wooden', name: 'Wooden / Classic', color: '#8B4513' },
  { id: 'digital', name: 'Digital / Modern', color: '#1CB0F6' },
  { id: 'soft', name: 'Soft / Gentle', color: '#A560E8' },
  { id: 'retro', name: 'Retro / Arcade', color: '#58CC02' },
  { id: 'premium', name: 'Premium / Unique', color: '#FFC800' },
];

export default function TestSoundsPage() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [selectedSound, setSelectedSound] = useState<string>('chesscom');
  const [lastPlayed, setLastPlayed] = useState<{ type: 'move' | 'capture'; id: string } | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    setAudioContext(ctx);
    return () => {
      ctx.close();
    };
  }, []);

  const playSound = async (soundId: string, type: 'move' | 'capture') => {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const sound = SOUND_LIBRARY[soundId];
    if (!sound) return;

    if (type === 'move') {
      sound.playMove(audioContext);
    } else {
      sound.playCapture(audioContext);
    }

    setLastPlayed({ type, id: soundId });
    setTimeout(() => setLastPlayed(null), 200);
  };

  const playSequence = async (soundId: string) => {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const sound = SOUND_LIBRARY[soundId];
    if (!sound) return;

    // Play: move, move, capture, move, capture
    const sequence = ['move', 'move', 'capture', 'move', 'capture'] as const;

    for (let i = 0; i < sequence.length; i++) {
      setTimeout(() => {
        if (sequence[i] === 'move') {
          sound.playMove(audioContext);
        } else {
          sound.playCapture(audioContext);
        }
      }, i * 400);
    }
  };

  const selectedInfo = SOUND_LIBRARY[selectedSound];

  return (
    <div className="h-full overflow-y-auto bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Move & Capture Sounds</h1>
            <p className="text-gray-400 text-sm">16 sound variations inspired by Chess.com, Lichess, and more</p>
          </div>
          <a
            href="/learn"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Selected Sound Preview */}
        <div className="bg-[#1A2C35] rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">{selectedInfo?.name}</h2>
              <p className="text-gray-400">{selectedInfo?.description}</p>
            </div>
            <div
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${CATEGORIES.find(c => c.id === selectedInfo?.category)?.color}20`,
                color: CATEGORIES.find(c => c.id === selectedInfo?.category)?.color,
              }}
            >
              {CATEGORIES.find(c => c.id === selectedInfo?.category)?.name}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => playSound(selectedSound, 'move')}
              className="px-8 py-4 bg-[#58CC02] text-white font-bold rounded-xl hover:bg-[#4CAF00] active:translate-y-[1px] transition-all text-lg"
            >
              Play Move
            </button>
            <button
              onClick={() => playSound(selectedSound, 'capture')}
              className="px-8 py-4 bg-[#FF4B4B] text-white font-bold rounded-xl hover:bg-[#e04343] active:translate-y-[1px] transition-all text-lg"
            >
              Play Capture
            </button>
            <button
              onClick={() => playSequence(selectedSound)}
              className="px-8 py-4 bg-[#1CB0F6] text-white font-bold rounded-xl hover:bg-[#0d9ee0] active:translate-y-[1px] transition-all text-lg"
            >
              Play Sequence
            </button>
          </div>
        </div>

        {/* Sound Grid by Category */}
        {CATEGORIES.map((category) => {
          const sounds = Object.entries(SOUND_LIBRARY).filter(
            ([, sound]) => sound.category === category.id
          );
          if (sounds.length === 0) return null;

          return (
            <div key={category.id} className="mb-8">
              <h3
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: category.color }}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sounds.map(([id, sound]) => {
                  const isSelected = selectedSound === id;
                  const isMovePlaying = lastPlayed?.id === id && lastPlayed?.type === 'move';
                  const isCapturePlaying = lastPlayed?.id === id && lastPlayed?.type === 'capture';

                  return (
                    <div
                      key={id}
                      onClick={() => setSelectedSound(id)}
                      className={`
                        bg-[#1A2C35] rounded-xl p-4 cursor-pointer transition-all
                        ${isSelected ? 'ring-2' : 'hover:bg-[#243842]'}
                      `}
                      style={{
                        '--tw-ring-color': isSelected ? category.color : undefined,
                      } as React.CSSProperties}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">{sound.name}</h4>
                        {isSelected && (
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mb-4">{sound.description}</p>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playSound(id, 'move');
                          }}
                          className={`
                            flex-1 py-2 rounded-lg text-sm font-medium transition-all
                            ${isMovePlaying
                              ? 'bg-[#58CC02] text-white'
                              : 'bg-[#2a3f4a] text-gray-300 hover:bg-[#3a5060]'
                            }
                          `}
                        >
                          Move
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playSound(id, 'capture');
                          }}
                          className={`
                            flex-1 py-2 rounded-lg text-sm font-medium transition-all
                            ${isCapturePlaying
                              ? 'bg-[#FF4B4B] text-white'
                              : 'bg-[#2a3f4a] text-gray-300 hover:bg-[#3a5060]'
                            }
                          `}
                        >
                          Capture
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Quick Compare */}
        <div className="bg-[#1A2C35] rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Quick Compare</h3>
          <p className="text-gray-500 mb-4">Click to hear each sound side by side</p>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {Object.entries(SOUND_LIBRARY).map(([id, sound]) => (
              <button
                key={id}
                onClick={() => {
                  setSelectedSound(id);
                  playSound(id, 'move');
                }}
                className={`
                  p-3 rounded-lg text-xs font-medium transition-all text-center
                  ${selectedSound === id
                    ? 'bg-[#58CC02] text-white'
                    : 'bg-[#2a3f4a] text-gray-400 hover:bg-[#3a5060] hover:text-white'
                  }
                `}
              >
                {sound.name}
              </button>
            ))}
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="bg-[#1A2C35] rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Implementation Notes</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• All sounds synthesized with Web Audio API - no external files needed</li>
            <li>• Works offline and loads instantly</li>
            <li>• <strong className="text-white">Chess.com Style</strong> and <strong className="text-white">Lichess Style</strong> are close matches to those sites</li>
            <li>• <strong className="text-white">Classic Wood</strong> is a good default for traditional feel</li>
            <li>• <strong className="text-white">Soft</strong> category is good for late-night playing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
