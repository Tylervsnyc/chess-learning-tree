// Sound utilities for the chess learning app
// Fixed version with proper async handling, preloading, and warmup

// Chromatic scale frequencies - 20 notes for daily challenge progression
// G3 to D5 (196Hz to 587Hz) - starts warm and low, builds without getting shrill
export const CHROMATIC_SCALE = [
  196,  // G3
  208,  // G#3
  220,  // A3
  233,  // A#3
  247,  // B3
  262,  // C4 (middle C)
  277,  // C#4
  294,  // D4
  311,  // D#4
  330,  // E4
  349,  // F4
  370,  // F#4
  392,  // G4
  415,  // G#4
  440,  // A4 (concert pitch)
  466,  // A#4
  494,  // B4
  523,  // C5
  554,  // C#5
  587,  // D5 (climax - where old scale started!)
];

// Shared AudioContext for Web Audio API sounds
let sharedAudioContext: AudioContext | null = null;
let isAudioWarmedUp = false;

// Preloaded audio buffers for move/capture sounds
let moveBuffer: AudioBuffer | null = null;
let captureBuffer: AudioBuffer | null = null;
let buffersLoading = false;
let buffersLoaded = false;

// Get or create AudioContext, properly handling suspended state
async function ensureAudioReady(): Promise<AudioContext | null> {
  if (typeof window === 'undefined') return null;

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContext();
  }

  // Properly await the resume if suspended (browser autoplay policy)
  if (sharedAudioContext.state === 'suspended') {
    try {
      await sharedAudioContext.resume();
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('AudioContext resume failed:', err);
      }
    }
  }

  return sharedAudioContext;
}

// Load audio buffer from URL
async function loadBuffer(url: string): Promise<AudioBuffer | null> {
  const ctx = await ensureAudioReady();
  if (!ctx) return null;

  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await ctx.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn('Failed to load sound:', url, err);
    return null;
  }
}

// Preload move and capture sounds
async function preloadSounds(): Promise<void> {
  if (buffersLoaded || buffersLoading) return;
  buffersLoading = true;

  const [move, capture] = await Promise.all([
    loadBuffer('/sounds/move.mp3'),
    loadBuffer('/sounds/capture.mp3'),
  ]);

  moveBuffer = move;
  captureBuffer = capture;
  buffersLoaded = true;
  buffersLoading = false;
}

/**
 * Warmup audio system - call this on first user interaction (click/touch)
 * This unlocks AudioContext on mobile browsers and preloads sounds
 */
export function warmupAudio(): void {
  if (typeof window === 'undefined') return;
  if (isAudioWarmedUp) return;

  // Start preloading sounds
  preloadSounds();

  // Unlock AudioContext with a silent oscillator
  ensureAudioReady().then(ctx => {
    if (ctx && ctx.state === 'running') {
      // Play a silent sound to fully unlock on iOS
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0; // Silent
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.001);
    }
  });

  isAudioWarmedUp = true;
}

/**
 * Check if audio has been warmed up
 */
export function isAudioReady(): boolean {
  return isAudioWarmedUp;
}

// Mellow coin sound at a specific frequency
export async function playMellowCoin(baseFreq: number): Promise<void> {
  const ctx = await ensureAudioReady();
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

/**
 * Play correct sound - two-tone success with chromatic progression
 * Each correct answer in a streak goes up one chromatic step
 * @param puzzleIndex - The puzzle index (0-based) to determine pitch
 * @param delay - Delay in ms before playing (default 250ms to prevent overlap with move sounds)
 */
export function playCorrectSound(puzzleIndex: number, delay: number = 250): void {
  if (typeof window === 'undefined') return;

  setTimeout(async () => {
    // Wait for AudioContext to be ready instead of giving up
    const ctx = await ensureAudioReady();
    if (!ctx) return;

    // Use puzzleIndex to climb the chromatic scale (capped at scale length)
    const scaleIndex = Math.min(puzzleIndex, CHROMATIC_SCALE.length - 1);
    const baseFreq = CHROMATIC_SCALE[scaleIndex];

    // First note (base frequency)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.value = baseFreq;
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
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
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.35);
  }, delay);
}

/**
 * Play error sound - Duolingo-style gentle "womp womp"
 */
export async function playErrorSound(): Promise<void> {
  // Wait for AudioContext to be ready instead of giving up
  const ctx = await ensureAudioReady();
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

// Celebration sound - warm C Major arpeggio with reverb-like decay
async function playCelebration(): Promise<void> {
  const ctx = await ensureAudioReady();
  if (!ctx) return;

  const notes = [262, 330, 392, 523]; // C4, E4, G4, C5
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
}

/**
 * Play celebration sound - warm ascending C Major chord
 * @param _correctCount - unused, kept for backwards compatibility
 */
export function playCelebrationSound(_correctCount?: number): void {
  if (typeof window === 'undefined') return;
  playCelebration();
}

/**
 * Play move sound - uses preloaded mp3 file
 */
export async function playMoveSound(): Promise<void> {
  const ctx = await ensureAudioReady();
  if (!ctx) return;

  // Ensure sounds are preloaded
  if (!buffersLoaded) {
    await preloadSounds();
  }

  if (!moveBuffer) return;

  const source = ctx.createBufferSource();
  source.buffer = moveBuffer;
  source.connect(ctx.destination);
  source.start();
}

/**
 * Play capture sound - uses preloaded mp3 file
 */
export async function playCaptureSound(): Promise<void> {
  const ctx = await ensureAudioReady();
  if (!ctx) return;

  // Ensure sounds are preloaded
  if (!buffersLoaded) {
    await preloadSounds();
  }

  if (!captureBuffer) return;

  const source = ctx.createBufferSource();
  source.buffer = captureBuffer;
  source.connect(ctx.destination);
  source.start();
}

/**
 * Haptic feedback for correct answer - single short vibration
 */
export function vibrateOnCorrect(): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(100);
  }
}

/**
 * Haptic feedback for wrong answer - double pulse pattern
 */
export function vibrateOnError(): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([50, 30, 50]);
  }
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
