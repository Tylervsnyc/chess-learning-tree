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
 *
 * CRITICAL: Everything here must be SYNCHRONOUS within the user gesture.
 * iOS Safari will permanently block audio if AudioContext creation or
 * resume() happens in a .then() or async callback.
 */
export function warmupAudio(): void {
  if (typeof window === 'undefined') return;
  if (isAudioWarmedUp) return;

  // Step 1: Create AudioContext synchronously during user gesture
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContext();
  }

  // Step 2: Resume synchronously during user gesture (don't await)
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume();
  }

  // Step 3: Play a silent sound synchronously to fully unlock iOS Safari
  try {
    const osc = sharedAudioContext.createOscillator();
    const gain = sharedAudioContext.createGain();
    gain.gain.value = 0; // Silent
    osc.connect(gain);
    gain.connect(sharedAudioContext.destination);
    osc.start();
    osc.stop(sharedAudioContext.currentTime + 0.001);
  } catch {
    // Ignore - context may not be fully ready yet, but it's unlocked
  }

  // Step 4: Preload mp3 sounds (async is fine here, context is already unlocked)
  preloadSounds();

  isAudioWarmedUp = true;
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

// Celebration sound - bright C Major arpeggio with compressor to prevent clipping
async function playCelebration(): Promise<void> {
  const ctx = await ensureAudioReady();
  if (!ctx) return;

  // Compressor prevents distortion when oscillators overlap
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -8;
  compressor.knee.value = 10;
  compressor.ratio.value = 12;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.1;
  compressor.connect(ctx.destination);

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.5;
  masterGain.connect(compressor);

  const notes = [262, 330, 392, 523]; // C4, E4, G4, C5 — warm register
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.11;
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.45);
  });
}

/**
 * Play celebration sound - warm ascending C Major chord
 */
export function playCelebrationSound(_correctCount?: number): void {
  if (typeof window === 'undefined') return;
  playCelebration();
}

// Play a preloaded buffer sound
async function playBuffer(buffer: AudioBuffer | null): Promise<void> {
  const ctx = await ensureAudioReady();
  if (!ctx) return;
  if (!buffersLoaded) await preloadSounds();
  if (!buffer) return;

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
}

/** Play move sound - uses preloaded mp3 file */
export async function playMoveSound(): Promise<void> {
  return playBuffer(moveBuffer);
}

/** Play capture sound - uses preloaded mp3 file */
export async function playCaptureSound(): Promise<void> {
  return playBuffer(captureBuffer);
}

/**
 * Haptic feedback for correct answer - single short vibration
 */
// Pre-cached buffers for instant button click playback
let clickNoiseBuffer: AudioBuffer | null = null;
let clickReverbBuffer: AudioBuffer | null = null;

function ensureClickBuffers(ctx: AudioContext) {
  if (!clickNoiseBuffer) {
    const len = Math.floor(ctx.sampleRate * 0.01);
    clickNoiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = clickNoiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }
  if (!clickReverbBuffer) {
    const reverbLen = Math.floor(ctx.sampleRate * 0.5);
    clickReverbBuffer = ctx.createBuffer(2, reverbLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const rd = clickReverbBuffer.getChannelData(ch);
      for (let i = 0; i < reverbLen; i++) {
        rd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 1.8);
      }
    }
  }
}

/**
 * Play button click — tongue-click with roomy reverb.
 * Buffers are pre-generated so playback is instant.
 */
export function playButtonClick(): void {
  if (typeof window === 'undefined') return;

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContext();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume();
  }
  const ctx = sharedAudioContext;
  ensureClickBuffers(ctx);
  const t = ctx.currentTime;

  const src = ctx.createBufferSource();
  src.buffer = clickNoiseBuffer;

  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2200;
  bp.Q.value = 4;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(4800, t);
  lp.frequency.exponentialRampToValueAtTime(700, t + 0.03);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

  const convolver = ctx.createConvolver();
  convolver.buffer = clickReverbBuffer;
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  const dry = ctx.createGain();
  dry.gain.value = 1;

  src.connect(bp).connect(lp).connect(gain);
  gain.connect(dry).connect(ctx.destination);
  gain.connect(convolver).connect(wet).connect(ctx.destination);
  src.start(t);
}

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

