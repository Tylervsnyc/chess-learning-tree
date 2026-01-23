'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { PERFECT_QUOTES, GREAT_QUOTES, OKAY_QUOTES, getRandomQuote, getTierLabel } from '@/data/celebration-quotes';

const COLORS = {
  green: '#58CC02',
  blue: '#1CB0F6',
};

// Celebration styles
const celebrationStyles = `
  @keyframes fadeInUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  .animate-fadeInUp {
    animation: fadeInUp 0.4s ease-out forwards;
  }
  .animate-pulse-slow {
    animation: pulse 2s ease-in-out infinite;
  }
`;

// Sound options
const SOUND_OPTIONS = {
  perfect: [
    { id: 'fanfare', name: 'Fanfare', description: 'Triumphant C-E-G-C arpeggio' },
    { id: 'tada', name: 'Ta-da!', description: 'Classic celebration' },
    { id: 'choir', name: 'Choir', description: 'Angelic "ahhh"' },
    { id: 'fireworks', name: 'Fireworks', description: 'Sparkly explosion' },
  ],
  great: [
    { id: 'success', name: 'Success', description: 'Happy two-note' },
    { id: 'ding', name: 'Ding!', description: 'Bright bell' },
    { id: 'levelup', name: 'Level Up', description: 'Rising tones' },
  ],
  complete: [
    { id: 'chime', name: 'Chime', description: 'Gentle single note' },
    { id: 'soft', name: 'Soft', description: 'Quiet acknowledgment' },
    { id: 'click', name: 'Click', description: 'Minimal confirmation' },
  ],
};

// Sound functions using Web Audio API
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Perfect sounds
function playFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [523, 659, 784, 1047];
  const durations = [0.15, 0.15, 0.15, 0.4];
  let time = ctx.currentTime;
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + durations[i]);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + durations[i]);
    time += durations[i] * 0.7;
  });
}

function playTada() {
  const ctx = getAudioContext();
  if (!ctx) return;
  // Two chord burst
  [0, 0.15].forEach((delay, idx) => {
    const freqs = idx === 0 ? [392, 494, 587] : [523, 659, 784];
    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.4);
    });
  });
}

function playChoir() {
  const ctx = getAudioContext();
  if (!ctx) return;
  // Angelic chord with vibrato
  [523, 659, 784, 1047].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;
    vibrato.frequency.value = 5;
    vibratoGain.gain.value = 3;

    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.05);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.05 + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.05);
    vibrato.start(ctx.currentTime + i * 0.05);
    osc.stop(ctx.currentTime + 1.2);
    vibrato.stop(ctx.currentTime + 1.2);
  });
}

function playFireworks() {
  const ctx = getAudioContext();
  if (!ctx) return;
  // Rising whistle then burst
  const whistle = ctx.createOscillator();
  const wGain = ctx.createGain();
  whistle.type = 'sine';
  whistle.frequency.setValueAtTime(400, ctx.currentTime);
  whistle.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.3);
  wGain.gain.setValueAtTime(0.15, ctx.currentTime);
  wGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  whistle.connect(wGain);
  wGain.connect(ctx.destination);
  whistle.start();
  whistle.stop(ctx.currentTime + 0.3);

  // Burst
  setTimeout(() => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = 800 + Math.random() * 1200;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }, i * 30);
    }
  }, 300);
}

// Great sounds
function playSuccess() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.value = 440;
  gain1.gain.setValueAtTime(0.25, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start();
  osc1.stop(ctx.currentTime + 0.15);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.value = 659;
  gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(ctx.currentTime + 0.12);
  osc2.stop(ctx.currentTime + 0.4);
}

function playDing() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}

function playLevelUp() {
  const ctx = getAudioContext();
  if (!ctx) return;
  [440, 554, 659, 880].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.08);
    osc.stop(ctx.currentTime + i * 0.08 + 0.15);
  });
}

// Complete sounds
function playChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 392;
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

function playSoft() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 330;
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

function playClick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = 600;
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

const SOUND_FUNCTIONS: Record<string, () => void> = {
  fanfare: playFanfare,
  tada: playTada,
  choir: playChoir,
  fireworks: playFireworks,
  success: playSuccess,
  ding: playDing,
  levelup: playLevelUp,
  chime: playChime,
  soft: playSoft,
  click: playClick,
};


// Celebration preview component
function CelebrationPreview({
  correctCount,
  isGuest,
  animationKey,
  message,
  soundId,
}: {
  correctCount: number;
  isGuest: boolean;
  animationKey: number;
  message: string;
  soundId: string;
}) {
  const isPerfect = correctCount === 6;
  const accuracy = Math.round((correctCount / 6) * 100);

  // Trigger confetti and sound when key changes
  useEffect(() => {
    if (animationKey === 0) return;

    confetti({
      particleCount: isPerfect ? 100 : correctCount >= 5 ? 60 : 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.25, y: 0.5 },
      colors: isPerfect
        ? ['#FFC800', '#FFD700', '#FFAA00', '#FFFFFF']
        : ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF'],
      gravity: 1.2,
      ticks: 200,
    });
    confetti({
      particleCount: isPerfect ? 100 : correctCount >= 5 ? 60 : 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.75, y: 0.5 },
      colors: isPerfect
        ? ['#FFC800', '#FFD700', '#FFAA00', '#FFFFFF']
        : ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF'],
      gravity: 1.2,
      ticks: 200,
    });

    SOUND_FUNCTIONS[soundId]?.();
  }, [animationKey, isPerfect, correctCount, soundId]);

  return (
    <div key={animationKey} className="h-full flex items-center justify-center p-6">
      <style>{celebrationStyles}</style>
      <div className="max-w-sm w-full">
        {/* Score display */}
        <div className="text-center mb-6">
          <div
            className="text-6xl font-black mb-2 animate-fadeInUp"
            style={{
              color: isPerfect ? '#FFC800' : COLORS.green,
              animationFillMode: 'backwards',
            }}
          >
            {correctCount}/6
          </div>
          <div
            className="text-sm text-gray-400 uppercase tracking-wider animate-fadeInUp"
            style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
          >
            {getTierLabel(correctCount)}
          </div>
        </div>

        {/* Funny message */}
        <div
          className="text-center mb-8 animate-fadeInUp"
          style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
        >
          <p className="text-xl text-white font-medium italic">
            "{message}"
          </p>
        </div>

        {/* Stats cards */}
        <div
          className="grid grid-cols-2 gap-3 mb-8 animate-fadeInUp"
          style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}
        >
          <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: COLORS.green }}>
              {correctCount}
            </div>
            <div className="text-sm text-gray-400">First try</div>
          </div>
          <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: accuracy === 100 ? '#FFC800' : COLORS.blue }}>
              {accuracy}%
            </div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
        </div>

        {/* Lesson name */}
        <div
          className="text-center text-gray-500 text-sm mb-6 animate-fadeInUp"
          style={{ animationDelay: '0.35s', animationFillMode: 'backwards' }}
        >
          Beginner Forks
        </div>

        {/* Continue button */}
        <button
          className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] animate-fadeInUp cursor-default"
          style={{
            backgroundColor: COLORS.green,
            animationDelay: '0.4s',
            animationFillMode: 'backwards',
          }}
        >
          Continue
        </button>

        {/* Guest signup prompt */}
        {isGuest && (
          <div
            className="mt-4 bg-[#1A2C35] rounded-xl p-4 animate-fadeInUp"
            style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}
          >
            <p className="text-gray-400 text-sm mb-3 text-center">Create a free account to save progress</p>
            <div className="flex gap-3">
              <div className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white text-center bg-[#2A3C45]">
                Sign Up
              </div>
              <div className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white text-center bg-[#2A3C45]">
                Sign In
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestCelebrationPage() {
  const [correctCount, setCorrectCount] = useState(6);
  const [isGuest, setIsGuest] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [message, setMessage] = useState(PERFECT_QUOTES[0]);

  // Sound selections
  const [perfectSound, setPerfectSound] = useState('fanfare');
  const [greatSound, setGreatSound] = useState('success');
  const [completeSound, setCompleteSound] = useState('chime');

  const getCurrentSoundId = () => {
    if (correctCount === 6) return perfectSound;
    if (correctCount >= 5) return greatSound;
    return completeSound;
  };

  const triggerAnimation = () => {
    setMessage(getRandomQuote(correctCount));
    setAnimationKey(k => k + 1);
  };

  const handleScoreChange = (newScore: number) => {
    setCorrectCount(newScore);
    setMessage(getRandomQuote(newScore));
    setAnimationKey(k => k + 1);
  };

  return (
    <div className="h-screen bg-[#131F24] text-white flex">
      {/* Left side - Controls */}
      <div className="w-1/2 border-r border-white/10 p-6 overflow-y-auto">
        <Link href="/learn" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
          ← Back to Learn
        </Link>

        <h1 className="text-2xl font-bold mb-6">Celebration Test</h1>

        {/* Score selector */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            First-try correct: <span className="text-white font-bold">{correctCount}/6</span>
          </label>
          <input
            type="range"
            min="0"
            max="6"
            value={correctCount}
            onChange={(e) => handleScoreChange(parseInt(e.target.value))}
            className="w-full accent-[#58CC02]"
          />
        </div>

        {/* Quick buttons */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { score: 6, label: 'Perfect', color: '#FFC800' },
            { score: 5, label: 'Great', color: '#58CC02' },
            { score: 3, label: 'Okay', color: '#6B7280' },
          ].map(({ score, label, color }) => (
            <button
              key={score}
              onClick={() => handleScoreChange(score)}
              className={`p-3 rounded-xl text-center transition-all ${
                correctCount === score ? 'ring-2 ring-white' : ''
              }`}
              style={{ backgroundColor: '#1A2C35' }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color }}>{score}/6</div>
              <div className="text-xs text-gray-400">{label}</div>
            </button>
          ))}
        </div>

        {/* Guest toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isGuest}
              onChange={(e) => setIsGuest(e.target.checked)}
              className="w-5 h-5 accent-[#58CC02]"
            />
            <span className="text-sm">Show guest signup prompt</span>
          </label>
        </div>

        {/* Replay button */}
        <button
          onClick={triggerAnimation}
          className="w-full py-3 rounded-xl font-bold text-white bg-[#58CC02] shadow-[0_4px_0_#3d8c01] active:translate-y-[2px] transition-all mb-6"
        >
          Replay Animation
        </button>

        {/* Sound Selection */}
        <div className="bg-[#1A2C35] rounded-xl p-4 mb-6">
          <h2 className="font-bold mb-4">Sound Selection</h2>

          {/* Perfect sound */}
          <div className="mb-4">
            <label className="block text-sm text-yellow-400 mb-2">Perfect (6/6)</label>
            <div className="grid grid-cols-2 gap-2">
              {SOUND_OPTIONS.perfect.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => {
                    setPerfectSound(sound.id);
                    SOUND_FUNCTIONS[sound.id]?.();
                  }}
                  className={`p-2 rounded-lg text-left transition-all ${
                    perfectSound === sound.id
                      ? 'bg-yellow-400/20 ring-1 ring-yellow-400'
                      : 'bg-[#2A3C45] hover:bg-[#3A4C55]'
                  }`}
                >
                  <div className="text-sm font-medium">{sound.name}</div>
                  <div className="text-xs text-gray-400">{sound.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Great sound */}
          <div className="mb-4">
            <label className="block text-sm text-green-400 mb-2">Great (5/6)</label>
            <div className="grid grid-cols-3 gap-2">
              {SOUND_OPTIONS.great.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => {
                    setGreatSound(sound.id);
                    SOUND_FUNCTIONS[sound.id]?.();
                  }}
                  className={`p-2 rounded-lg text-left transition-all ${
                    greatSound === sound.id
                      ? 'bg-green-400/20 ring-1 ring-green-400'
                      : 'bg-[#2A3C45] hover:bg-[#3A4C55]'
                  }`}
                >
                  <div className="text-sm font-medium">{sound.name}</div>
                  <div className="text-xs text-gray-400">{sound.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Complete sound */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Complete (0-4/6)</label>
            <div className="grid grid-cols-3 gap-2">
              {SOUND_OPTIONS.complete.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => {
                    setCompleteSound(sound.id);
                    SOUND_FUNCTIONS[sound.id]?.();
                  }}
                  className={`p-2 rounded-lg text-left transition-all ${
                    completeSound === sound.id
                      ? 'bg-gray-400/20 ring-1 ring-gray-400'
                      : 'bg-[#2A3C45] hover:bg-[#3A4C55]'
                  }`}
                >
                  <div className="text-sm font-medium">{sound.name}</div>
                  <div className="text-xs text-gray-400">{sound.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages preview */}
        <div className="bg-[#1A2C35] rounded-xl p-4">
          <h2 className="font-bold mb-3">Sample Quotes ({PERFECT_QUOTES.length + GREAT_QUOTES.length + OKAY_QUOTES.length} total)</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <div>
              <div className="text-xs text-yellow-400 mb-1">Perfect ({PERFECT_QUOTES.length})</div>
              {PERFECT_QUOTES.slice(0, 3).map((q, i) => (
                <div key={i} className="text-sm text-gray-300 italic mb-1">"{q}"</div>
              ))}
            </div>
            <div>
              <div className="text-xs text-green-400 mb-1">Great ({GREAT_QUOTES.length})</div>
              {GREAT_QUOTES.slice(0, 3).map((q, i) => (
                <div key={i} className="text-sm text-gray-300 italic mb-1">"{q}"</div>
              ))}
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Okay ({OKAY_QUOTES.length})</div>
              {OKAY_QUOTES.slice(0, 3).map((q, i) => (
                <div key={i} className="text-sm text-gray-300 italic mb-1">"{q}"</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Celebration Preview */}
      <div className="w-1/2 bg-[#131F24]">
        <CelebrationPreview
          correctCount={correctCount}
          isGuest={isGuest}
          animationKey={animationKey}
          message={message}
          soundId={getCurrentSoundId()}
        />
      </div>
    </div>
  );
}
