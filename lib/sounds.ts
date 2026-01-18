// Sound utilities for the chess learning app

// Chromatic scale frequencies (C, C#, D, D#, E, F)
export const CHROMATIC_SCALE = [262, 277, 294, 311, 330, 349];

// Mellow coin sound at a specific frequency
export function playMellowCoin(baseFreq: number) {
  if (typeof window === 'undefined') return;

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

// Play correct sound based on puzzle index (chromatic scale)
export function playCorrectSound(puzzleIndex: number) {
  const noteIndex = Math.min(puzzleIndex, CHROMATIC_SCALE.length - 1);
  playMellowCoin(CHROMATIC_SCALE[noteIndex]);
}

// Play error sound
export function playErrorSound() {
  if (typeof window === 'undefined') return;

  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.value = 150;

  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

// Play triumphant climb celebration (for lesson complete)
export function playCelebrationSound() {
  if (typeof window === 'undefined') return;

  const ctx = new AudioContext();

  // Continue chromatic then burst into major
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
}

// Play move sound
export function playMoveSound() {
  if (typeof window === 'undefined') return;
  const audio = new Audio('/sounds/move.mp3');
  audio.volume = 0.7;
  audio.play();
}

// Play capture sound
export function playCaptureSound() {
  if (typeof window === 'undefined') return;
  const audio = new Audio('/sounds/capture.mp3');
  audio.volume = 0.7;
  audio.play();
}

// Supernova Gentle streak effect styles
export function getStreakStyle(streak: number, hadWrongAnswer: boolean): React.CSSProperties {
  // If had wrong answer, just return normal green
  if (hadWrongAnswer || streak < 2) {
    return { backgroundColor: '#58CC02' };
  }

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
    animation: `rainbowFlow ${3 - streak * 0.2}s linear infinite${streak >= 4 ? `, shake 0.4s infinite` : ''}`,
    boxShadow: `
      0 0 ${streak * 5}px rgba(255, 200, 220, ${0.4 + intensity * 0.4}),
      0 0 ${streak * 10}px rgba(255, 150, 200, 0.4)
    `,
  };
}
