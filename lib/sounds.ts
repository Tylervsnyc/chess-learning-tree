// Sound utilities for the chess learning app

// Chromatic scale frequencies - full octave for building tension
// D5 to D6 (587Hz to 1175Hz) - 13 notes (higher range for mobile clarity)
export const CHROMATIC_SCALE = [
  587,  // D5
  622,  // D#5
  659,  // E5
  698,  // F5
  740,  // F#5
  784,  // G5
  831,  // G#5
  880,  // A5
  932,  // A#5
  988,  // B5
  1047, // C6
  1109, // C#6
  1175, // D6 (octave up - climax!)
];

// Shared AudioContext for better browser compatibility
let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContext();
  }

  // Resume if suspended (browser autoplay policy)
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume();
  }

  return sharedAudioContext;
}

// Mellow coin sound at a specific frequency
export function playMellowCoin(baseFreq: number) {
  const ctx = getAudioContext();
  if (!ctx) return;

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

// Play correct sound - two-tone success with chromatic progression
// Each correct answer in a streak goes up one chromatic step
// Delay prevents overlap with move/capture sounds
export function playCorrectSound(puzzleIndex: number, delay: number = 150) {
  if (typeof window === 'undefined') return;

  setTimeout(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Use puzzleIndex to climb the chromatic scale (capped at scale length)
    const scaleIndex = Math.min(puzzleIndex, CHROMATIC_SCALE.length - 1);
    const baseFreq = CHROMATIC_SCALE[scaleIndex];

    // First note (base frequency)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.value = baseFreq;
    gain1.gain.setValueAtTime(0.25, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.12);

    // Second note (perfect fifth above - 1.5x frequency)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.value = baseFreq * 1.5;
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.35);
  }, delay);
}

// Play error sound - Duolingo-style gentle "womp womp"
export function playErrorSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // First note
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = 350;
  gain1.gain.setValueAtTime(0.18, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.12);

  // Second note (lower, slightly delayed)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 280;
  gain2.gain.setValueAtTime(0.18, ctx.currentTime + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(ctx.currentTime + 0.12);
  osc2.stop(ctx.currentTime + 0.3);
}

// Perfect score - triumphant fanfare (C-E-G-C arpeggio)
function playPerfectCelebration() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
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

  // Add a shimmer
  setTimeout(() => {
    const newCtx = getAudioContext();
    if (!newCtx) return;
    const osc = newCtx.createOscillator();
    const gain = newCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1568; // G6
    gain.gain.setValueAtTime(0.15, newCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, newCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(newCtx.destination);
    osc.start();
    osc.stop(newCtx.currentTime + 0.5);
  }, 400);
}

// Great score - happy two-note success (like Duolingo correct)
function playGreatCelebration() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // First note
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.value = 440; // A4
  gain1.gain.setValueAtTime(0.25, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start();
  osc1.stop(ctx.currentTime + 0.15);

  // Second note (higher)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.value = 659; // E5
  gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(ctx.currentTime + 0.12);
  osc2.stop(ctx.currentTime + 0.4);
}

// Complete score - gentle single chime
function playCompleteCelebration() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 392; // G4
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

// Play celebration sound based on performance
// Perfect (6/6): triumphant fanfare
// Great (5/6): happy success
// Complete (0-4/6): gentle chime
export function playCelebrationSound(correctCount: number = 6) {
  if (typeof window === 'undefined') return;

  if (correctCount === 6) {
    playPerfectCelebration();
  } else if (correctCount >= 5) {
    playGreatCelebration();
  } else {
    playCompleteCelebration();
  }
}

// Play move sound
export function playMoveSound() {
  if (typeof window === 'undefined') return;
  // Ensure AudioContext is active for better browser compatibility
  getAudioContext();
  const audio = new Audio('/sounds/move.mp3');
  audio.volume = 0.7;
  audio.play().catch(() => {
    // Ignore autoplay errors
  });
}

// Play capture sound
export function playCaptureSound() {
  if (typeof window === 'undefined') return;
  // Ensure AudioContext is active for better browser compatibility
  getAudioContext();
  const audio = new Audio('/sounds/capture.mp3');
  audio.volume = 0.7;
  audio.play().catch(() => {
    // Ignore autoplay errors
  });
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
