'use client';

import { useState } from 'react';
import { playCorrectSound, CHROMATIC_SCALE } from '@/lib/sounds';

// Shared AudioContext
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

// Sound Option 1: Current MP3
function playCurrentMP3() {
  getAudioContext();
  const audio = new Audio('/sounds/correct.mp3');
  audio.volume = 0.7;
  audio.play().catch(() => {});
}

// Sound Option 2: Simple coin chime (two-note)
function playSimpleCoin() {
  const ctx = getAudioContext();

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'sine';
  osc1.frequency.value = 880; // A5
  osc2.frequency.value = 1320; // E6 (perfect fifth)

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start();
  osc2.start(ctx.currentTime + 0.08);
  osc1.stop(ctx.currentTime + 0.15);
  osc2.stop(ctx.currentTime + 0.3);
}

// Sound Option 3: Soft ding (single note with harmonics)
function playSoftDing() {
  const ctx = getAudioContext();

  const frequencies = [1047, 1319, 1568]; // C6, E6, G6 (major chord)

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    const volume = 0.2 - i * 0.05; // Lower volume for higher harmonics
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  });
}

// Sound Option 4: Pop sound
function playPop() {
  const ctx = getAudioContext();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

// Sound Option 5: Rising chime
function playRisingChime() {
  const ctx = getAudioContext();

  const notes = [523, 659, 784]; // C5, E5, G5
  let time = ctx.currentTime;

  notes.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.15);
    time += 0.08;
  });
}

// Sound Option 6: Duolingo-style "ding" (short and sweet)
function playDuolingoDing() {
  const ctx = getAudioContext();

  // Main note
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = 880; // A5
  gain1.gain.setValueAtTime(0.3, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start();
  osc1.stop(ctx.currentTime + 0.25);

  // Harmonic
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 1760; // A6 (octave up)
  gain2.gain.setValueAtTime(0.1, ctx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start();
  osc2.stop(ctx.currentTime + 0.15);
}

// Sound Option 7: XP gain sound (game-like)
function playXPGain() {
  const ctx = getAudioContext();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

// Sound Option 8: Soft bell
function playSoftBell() {
  const ctx = getAudioContext();

  const fundamental = 800;
  const partials = [1, 2.4, 3, 4.5]; // Bell-like overtones

  partials.forEach((ratio, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = fundamental * ratio;

    const vol = 0.2 / (i + 1);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5 - i * 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  });
}

// Sound Option 9: Minimal blip
function playMinimalBlip() {
  const ctx = getAudioContext();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = 1200;

  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

// Sound Option 10: Two-tone success
function playTwoToneSuccess() {
  const ctx = getAudioContext();

  // First note
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.value = 587; // D5
  gain1.gain.setValueAtTime(0.25, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start();
  osc1.stop(ctx.currentTime + 0.12);

  // Second note (higher)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.value = 880; // A5
  gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(ctx.currentTime + 0.1);
  osc2.stop(ctx.currentTime + 0.35);
}

const SOUND_OPTIONS = [
  { name: 'Current MP3', description: 'The current correct.mp3 file', play: playCurrentMP3 },
  { name: 'Simple Coin', description: 'Two-note coin chime (A5 + E6)', play: playSimpleCoin },
  { name: 'Soft Ding', description: 'Major chord harmonics', play: playSoftDing },
  { name: 'Pop', description: 'Quick descending pop', play: playPop },
  { name: 'Rising Chime', description: 'C-E-G arpeggio', play: playRisingChime },
  { name: 'Duolingo Ding', description: 'Short A5 with octave harmonic', play: playDuolingoDing },
  { name: 'XP Gain', description: 'Game-like rising square wave', play: playXPGain },
  { name: 'Soft Bell', description: 'Bell with overtones', play: playSoftBell },
  { name: 'Minimal Blip', description: 'Ultra-short high blip', play: playMinimalBlip },
  { name: 'Two-Tone Success', description: 'D5 to A5 triangle waves', play: playTwoToneSuccess },
];

export default function TestSoundsPage() {
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [favorite, setFavorite] = useState<string | null>(null);

  const handlePlay = (name: string, playFn: () => void) => {
    setLastPlayed(name);
    playFn();
  };

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-2">Sound Test Page</h1>
        <p className="text-gray-400 mb-6">
          Test different correct answer sounds on mobile. Tap each button to hear the sound.
        </p>

        {/* Activation button for mobile */}
        <div className="bg-[#1A2C35] rounded-lg p-4 mb-6 border border-white/10">
          <p className="text-sm text-gray-400 mb-3">
            On mobile, tap here first to enable audio:
          </p>
          <button
            onClick={() => {
              const ctx = getAudioContext();
              ctx.resume();
            }}
            className="w-full py-3 bg-[#58CC02] rounded-lg font-semibold text-black"
          >
            Enable Audio
          </button>
        </div>

        {/* Sound options */}
        <div className="space-y-3">
          {SOUND_OPTIONS.map((option) => (
            <div
              key={option.name}
              className={`bg-[#1A2C35] rounded-lg p-4 border transition-all ${
                lastPlayed === option.name
                  ? 'border-[#58CC02]'
                  : 'border-white/10'
              } ${favorite === option.name ? 'ring-2 ring-yellow-400' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{option.name}</h3>
                  <p className="text-sm text-gray-400">{option.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFavorite(option.name)}
                    className={`p-2 rounded ${
                      favorite === option.name
                        ? 'bg-yellow-400 text-black'
                        : 'bg-white/10'
                    }`}
                    title="Mark as favorite"
                  >
                    ★
                  </button>
                </div>
              </div>
              <button
                onClick={() => handlePlay(option.name, option.play)}
                className="w-full py-3 bg-[#1CB0F6] rounded-lg font-semibold text-black"
              >
                Play Sound
              </button>
            </div>
          ))}
        </div>

        {/* Quick comparison section */}
        <div className="mt-8 bg-[#1A2C35] rounded-lg p-4 border border-white/10">
          <h2 className="font-semibold mb-3">Quick Compare</h2>
          <p className="text-sm text-gray-400 mb-4">
            Rapidly play sounds to compare them:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SOUND_OPTIONS.map((option) => (
              <button
                key={option.name}
                onClick={() => handlePlay(option.name, option.play)}
                className={`py-2 px-3 rounded text-sm ${
                  lastPlayed === option.name
                    ? 'bg-[#58CC02] text-black'
                    : 'bg-white/10'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        {/* Favorite display */}
        {favorite && (
          <div className="mt-6 bg-yellow-400/10 border border-yellow-400 rounded-lg p-4">
            <p className="text-yellow-400">
              Your favorite: <strong>{favorite}</strong>
            </p>
          </div>
        )}

        {/* Streak Tester */}
        <div className="mt-8 bg-[#1A2C35] rounded-lg p-4 border border-[#58CC02]">
          <h2 className="font-semibold mb-2 text-[#58CC02]">Streak Sound Tester</h2>
          <p className="text-sm text-gray-400 mb-4">
            This uses the actual playCorrectSound() with chromatic progression.
            Each button simulates a different streak position (0 = first correct, 5 = sixth correct).
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <button
                key={index}
                onClick={() => playCorrectSound(index, 0)}
                className="py-3 bg-[#58CC02] text-black rounded-lg font-semibold"
              >
                #{index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              // Play full streak sequence
              [0, 1, 2, 3, 4, 5].forEach((index) => {
                setTimeout(() => playCorrectSound(index, 0), index * 500);
              });
            }}
            className="w-full py-3 bg-gradient-to-r from-[#58CC02] to-[#1CB0F6] text-black rounded-lg font-semibold"
          >
            Play Full Streak (1-6)
          </button>
        </div>

        {/* Extended chromatic scale */}
        <div className="mt-6 bg-[#1A2C35] rounded-lg p-4 border border-white/10">
          <h2 className="font-semibold mb-2">Full Chromatic Scale</h2>
          <p className="text-sm text-gray-400 mb-4">
            Hear all 13 notes (C4 to C5):
          </p>
          <div className="grid grid-cols-4 gap-2">
            {CHROMATIC_SCALE.map((freq, index) => (
              <button
                key={index}
                onClick={() => playCorrectSound(index, 0)}
                className="py-2 bg-white/10 rounded text-sm"
              >
                {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'][index]}
              </button>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <a href="/learn" className="text-[#1CB0F6] underline">
            Back to Learn
          </a>
        </div>
      </div>
    </div>
  );
}
