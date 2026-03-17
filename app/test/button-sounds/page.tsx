'use client';

import { useRef, useCallback } from 'react';

// ─────────────────────────────────────────────
// Tongue-click family: mid-high, quick, gentle
// transient with subtle verb. Not harsh or shocking.
// ─────────────────────────────────────────────

function getAudioCtx(ref: React.MutableRefObject<AudioContext | null>) {
  if (!ref.current) ref.current = new AudioContext();
  if (ref.current.state === 'suspended') ref.current.resume();
  return ref.current;
}

function noiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1);
  }
  return buf;
}

function reverbBuffer(ctx: AudioContext, decay: number, duration: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

function addReverb(ctx: AudioContext, input: AudioNode, wetAmount: number, decay: number, duration: number) {
  const convolver = ctx.createConvolver();
  convolver.buffer = reverbBuffer(ctx, decay, duration);
  const wet = ctx.createGain();
  wet.gain.value = wetAmount;
  const dry = ctx.createGain();
  dry.gain.value = 1;
  input.connect(dry).connect(ctx.destination);
  input.connect(convolver).connect(wet).connect(ctx.destination);
}

// Original tongue click for reference
function playOriginalTongueClick(ctx: AudioContext) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 0.012);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2200;
  bp.Q.value = 4;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(5000, t);
  lp.frequency.exponentialRampToValueAtTime(800, t + 0.03);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.55, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  src.connect(bp).connect(lp).connect(gain);
  addReverb(ctx, gain, 0.18, 3, 0.3);
  src.start(t);
}

// 1. Softer — same shape, lower volume, more verb
function playSofterClick(ctx: AudioContext) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 0.01);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2000;
  bp.Q.value = 5;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(4000, t);
  lp.frequency.exponentialRampToValueAtTime(600, t + 0.03);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  src.connect(bp).connect(lp).connect(gain);
  addReverb(ctx, gain, 0.25, 2.5, 0.35);
  src.start(t);
}

// 2. Brighter — slightly higher center freq, crisper
function playBrighterClick(ctx: AudioContext) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 0.008);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 3000;
  bp.Q.value = 4;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(5500, t);
  lp.frequency.exponentialRampToValueAtTime(1000, t + 0.025);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
  src.connect(bp).connect(lp).connect(gain);
  addReverb(ctx, gain, 0.18, 3, 0.28);
  src.start(t);
}

// 3. Warmer — lower center, rounder
function playWarmerClick(ctx: AudioContext) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 0.014);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1600;
  bp.Q.value = 5;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(3500, t);
  lp.frequency.exponentialRampToValueAtTime(500, t + 0.035);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
  src.connect(bp).connect(lp).connect(gain);
  addReverb(ctx, gain, 0.2, 2.5, 0.3);
  src.start(t);
}

// 4. Tight — shorter, punchier, less verb
function playTightClick(ctx: AudioContext) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 0.006);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2400;
  bp.Q.value = 5;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(4500, t);
  lp.frequency.exponentialRampToValueAtTime(900, t + 0.02);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
  src.connect(bp).connect(lp).connect(gain);
  addReverb(ctx, gain, 0.1, 3.5, 0.2);
  src.start(t);
}

// 5. Roomy — same click but more spacious reverb
function playRoomyClick(ctx: AudioContext) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 0.01);
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
  src.connect(bp).connect(lp).connect(gain);
  addReverb(ctx, gain, 0.35, 1.8, 0.5);
  src.start(t);
}

// 6. Double Tap — two tiny clicks in quick succession
function playDoubleTap(ctx: AudioContext) {
  const t = ctx.currentTime;
  for (let n = 0; n < 2; n++) {
    const offset = n * 0.035;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 0.007);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2200 + n * 400;
    bp.Q.value = 5;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(4500, t + offset);
    lp.frequency.exponentialRampToValueAtTime(800, t + offset + 0.025);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(n === 0 ? 0.4 : 0.3, t + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.03);
    src.connect(bp).connect(lp).connect(gain);
    addReverb(ctx, gain, 0.15, 3, 0.25);
    src.start(t + offset);
  }
}

// 7. Whisper Click — very quiet, airy, ASMR-ish
function playWhisperClick(ctx: AudioContext) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 0.015);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1800;
  bp.Q.value = 3;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(3000, t);
  lp.frequency.exponentialRampToValueAtTime(400, t + 0.04);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  src.connect(bp).connect(lp).connect(gain);
  addReverb(ctx, gain, 0.3, 2, 0.4);
  src.start(t);
}

// 8. Snick — like flicking a light switch
function playSnick(ctx: AudioContext) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 0.005);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2800;
  bp.Q.value = 6;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(6000, t);
  lp.frequency.exponentialRampToValueAtTime(1200, t + 0.015);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.45, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
  src.connect(bp).connect(lp).connect(gain);
  addReverb(ctx, gain, 0.15, 3, 0.22);
  src.start(t);
}

// 9. Perc Tap — like tapping a muted drum with your finger
function playPercTap(ctx: AudioContext) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 0.018);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1400;
  bp.Q.value = 4;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 600;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(3800, t);
  lp.frequency.exponentialRampToValueAtTime(500, t + 0.04);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.45, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  src.connect(hp).connect(bp).connect(lp).connect(gain);
  addReverb(ctx, gain, 0.2, 2.5, 0.3);
  src.start(t);
}

// 10. Marble Drop — tiny click with a round resonant tail
function playMarbleDrop(ctx: AudioContext) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 0.008);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2600;
  bp.Q.value = 8;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(5000, t);
  lp.frequency.exponentialRampToValueAtTime(900, t + 0.04);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  src.connect(bp).connect(lp).connect(gain);
  addReverb(ctx, gain, 0.28, 2, 0.4);
  src.start(t);
}

// ─────────────────────────────────────────────

const SOUNDS = [
  { id: 'original', name: 'Original Tongue Click', desc: 'The one you liked (reference)', play: playOriginalTongueClick, color: '#58CC02', dark: '#3d8c01' },
  { id: 'softer', name: 'Softer', desc: 'Quieter, more verb', play: playSofterClick, color: '#1CB0F6', dark: '#1487c0' },
  { id: 'brighter', name: 'Brighter', desc: 'Higher, crisper', play: playBrighterClick, color: '#CE82FF', dark: '#a855c7' },
  { id: 'warmer', name: 'Warmer', desc: 'Lower center, rounder', play: playWarmerClick, color: '#FF9500', dark: '#cc7700' },
  { id: 'tight', name: 'Tight', desc: 'Shorter, punchier, less verb', play: playTightClick, color: '#2FCBEF', dark: '#1a9bb8' },
  { id: 'roomy', name: 'Roomy', desc: 'Same click, spacious reverb', play: playRoomyClick, color: '#FF6B6B', dark: '#cc4444' },
  { id: 'double-tap', name: 'Double Tap', desc: 'Two tiny clicks, quick', play: playDoubleTap, color: '#00B894', dark: '#008c70' },
  { id: 'whisper', name: 'Whisper Click', desc: 'Very quiet, airy, ASMR', play: playWhisperClick, color: '#FFC800', dark: '#cc9f00' },
  { id: 'snick', name: 'Snick', desc: 'Like flicking a light switch', play: playSnick, color: '#6366F1', dark: '#4f46e5' },
  { id: 'perc-tap', name: 'Perc Tap', desc: 'Muted drum finger tap', play: playPercTap, color: '#FF4B4B', dark: '#cc3030' },
  { id: 'marble', name: 'Marble Drop', desc: 'Click with round resonant tail', play: playMarbleDrop, color: '#A560E8', dark: '#8040c0' },
];

export default function ButtonSoundsTestPage() {
  const ctxRef = useRef<AudioContext | null>(null);

  const handlePlay = useCallback((playFn: (ctx: AudioContext) => void) => {
    const ctx = getAudioCtx(ctxRef);
    playFn(ctx);
  }, []);

  return (
    <div className="overflow-auto h-[100dvh] bg-white px-6 py-10">
      <div className="max-w-sm mx-auto">
        <h1 className="text-xl font-black text-chess-text mb-1">Tongue Click Variations</h1>
        <p className="text-sm text-chess-text-muted mb-6">
          All variations on the tongue click you liked. First one is the original for reference.
        </p>

        <div className="space-y-3">
          {SOUNDS.map((s) => (
            <button
              key={s.id}
              onClick={() => handlePlay(s.play)}
              className="w-full flex items-center gap-4 text-left px-5 py-4 rounded-2xl text-white transition-all active:translate-y-[2px]"
              style={{
                backgroundColor: s.color,
                boxShadow: `0 4px 0 ${s.dark}`,
              }}
            >
              <div>
                <span className="font-bold text-[15px] block">{s.name}</span>
                <span className="text-xs block mt-0.5 text-white/75">{s.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
