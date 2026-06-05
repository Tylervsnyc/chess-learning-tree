'use client';

import React, { useEffect, useRef, useState } from 'react';

const ROOK_GRID = [
  { x: 0, y: 0, color: '#1CB0F6' }, { x: 2, y: 0, color: '#2FCBEF' },
  { x: 4, y: 0, color: '#A560E8' }, { x: 0, y: 1, color: '#58CC02' },
  { x: 1, y: 1, color: '#FFC800' }, { x: 2, y: 1, color: '#FF9600' },
  { x: 3, y: 1, color: '#FF6B6B' }, { x: 4, y: 1, color: '#FF4B4B' },
  { x: 1, y: 2, color: '#1CB0F6' }, { x: 2, y: 2, color: '#2FCBEF' },
  { x: 3, y: 2, color: '#A560E8' }, { x: 1, y: 3, color: '#58CC02' },
  { x: 2, y: 3, color: '#FFC800' }, { x: 3, y: 3, color: '#FF9600' },
  { x: 1, y: 4, color: '#FF6B6B' }, { x: 2, y: 4, color: '#FF4B4B' },
  { x: 3, y: 4, color: '#1CB0F6' }, { x: 0, y: 5, color: '#2FCBEF' },
  { x: 1, y: 5, color: '#A560E8' }, { x: 2, y: 5, color: '#58CC02' },
  { x: 3, y: 5, color: '#FFC800' }, { x: 4, y: 5, color: '#FF9600' },
];

const CENTER_X = 2;
const CENTER_Y = 2.5;
const AUDIO_SRC = '/rookie-voice/pizza-ranking/voice.mp3';
const ALIGN_SRC = '/rookie-voice/pizza-ranking/voice.mp3.align.json';

type AlignedWord = { word: string; start: number; end: number; type: string };
type Alignment = { text: string; words: AlignedWord[]; duration: number };

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}
function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * v).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}
function lighten(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex); const f = a / 100;
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [c(r + (255 - r) * f), c(g + (255 - g) * f), c(b + (255 - b) * f)].map(v => v.toString(16).padStart(2, '0')).join('');
}
function darken(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex); const f = 1 - a / 100;
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [c(r * f), c(g * f), c(b * f)].map(v => v.toString(16).padStart(2, '0')).join('');
}
function matte(color: string): string {
  return `linear-gradient(to bottom, ${lighten(color, 18)} 0%, ${lighten(color, 12)} 20%, ${color} 40%, ${darken(color, 12)} 100%)`;
}
function hexWithAlpha(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, a)).toFixed(2)})`;
}

// ── Audio hook + envelope follower (attack/release → shapes amp into a "beat punch") ──
function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const envRef = useRef(0);
  const [amp, setAmp] = useState(0);
  const [env, setEnv] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio(AUDIO_SRC);
    a.preload = 'auto';
    audioRef.current = a;
    return () => { a.pause(); };
  }, []);

  const start = async () => {
    const a = audioRef.current; if (!a) return;
    if (!ctxRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const src = ctx.createMediaElementSource(a);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx; analyserRef.current = analyser;
    }
    await ctxRef.current.resume();
    a.currentTime = 0; a.play();
    setPlaying(true);
  };

  useEffect(() => {
    let raf = 0;
    const buf = new Uint8Array(128);
    let lastT = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = (now - lastT) / 1000;
      lastT = now;
      const an = analyserRef.current;
      let a = 0;
      if (an) {
        an.getByteFrequencyData(buf);
        let sum = 0;
        for (let i = 0; i < 64; i++) sum += buf[i];
        a = sum / 64 / 255;
      }
      // Envelope follower: fast attack, slow release → shapes syllable bursts
      const attack = 1 - Math.exp(-dt / 0.02);
      const release = 1 - Math.exp(-dt / 0.18);
      if (a > envRef.current) envRef.current += (a - envRef.current) * attack;
      else envRef.current += (a - envRef.current) * release;
      setAmp(a);
      setEnv(envRef.current);
      const au = audioRef.current;
      if (au) setTime(au.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const onEnded = () => setPlaying(false);
    a.addEventListener('ended', onEnded);
    return () => a.removeEventListener('ended', onEnded);
  }, []);

  return { amp, env, time, playing, start };
}

type BlockState = {
  scale?: number; brightness?: number; hueShift?: number; saturate?: number;
  offsetX?: number; offsetY?: number; opacity?: number;
  skewX?: number; skewY?: number; colorOverride?: string;
  glow?: { color: string; opacity: number; radius: number };
};

type RookieProps = { amp: number; env: number; time: number; alignment: Alignment | null; blockSize?: number };

// Build a fast "active word at time t" envelope from alignment:
// each word ramps 0→1 over first 60ms, holds, then decays 1→0 over last 80ms.
function alignedEnvelope(alignment: Alignment | null, t: number): number {
  if (!alignment) return 0;
  for (const w of alignment.words) {
    if (w.type !== 'word') continue;
    if (t < w.start - 0.04 || t > w.end + 0.12) continue;
    const attack = 0.06;
    const release = 0.1;
    if (t < w.start) {
      return Math.max(0, 1 - (w.start - t) / attack);
    }
    if (t < w.end) {
      return 1;
    }
    return Math.max(0, 1 - (t - w.end) / release);
  }
  return 0;
}

// Current word (for display / per-word triggering)
function activeWord(alignment: Alignment | null, t: number): AlignedWord | null {
  if (!alignment) return null;
  for (const w of alignment.words) {
    if (w.type === 'word' && t >= w.start && t < w.end) return w;
  }
  return null;
}

// ── Variants ──

// 1. 3D Heartbeat — gentle saturation lift on beat
function variant_Heartbeat3D({ env, time, blockSize = 42 }: RookieProps) {
  const beatScale = 1 + 0.1 * env;
  return (
    <Rook
      blockSize={blockSize}
      state={(b) => {
        const dist = Math.sqrt((b.x - CENTER_X) ** 2 + (b.y - CENTER_Y) ** 2);
        const normDist = dist / 3.2;
        const perspY = (b.y - CENTER_Y) * 0.05 * Math.sin(time * 0.7);
        return {
          scale: beatScale * (1 - normDist * 0.08),
          brightness: 0.95 + env * 0.2,
          saturate: 1 + env * 0.25,
          skewX: perspY * 15,
          skewY: (b.x - CENTER_X) * 0.03 * Math.cos(time * 0.7) * 10,
        };
      }}
    />
  );
}

// 2. Pixel Sort — horizontal sort wave; intensity modulated by audio
function variant_PixelSort({ env, time, blockSize = 42 }: RookieProps) {
  const pulse = Math.min(1, env * 2.4);
  return (
    <Rook
      blockSize={blockSize}
      state={(b, i) => {
        const sortWave = (time * 0.9 + b.x * 0.25) % 2;
        const amp = 0.3 + 0.7 * pulse;
        if (sortWave < 1) {
          const p = sortWave;
          const target = (b.x + Math.floor(p * 3)) % 5;
          return {
            offsetX: (target - b.x) * blockSize * p * 0.5 * amp,
            brightness: 1 + 0.35 * amp,
            hueShift: p * 70 * amp,
          };
        }
        const g = sortWave - 1;
        return {
          offsetX: Math.sin(g * 22 + b.y * 5) * 14 * amp,
          brightness: 0.8 + seededRandom(Math.floor(time * 8) + i) * 1.1 * amp,
          scale: 1 + Math.sin(g * 11) * 0.08 * amp,
        };
      }}
    />
  );
}

// 3. Neon Pulse — edge chase speeds up on syllables
function variant_NeonPulse({ env, time, blockSize = 42 }: RookieProps) {
  const pulse = Math.min(1, env * 2.4);
  const chaseSpeed = 0.6 + pulse * 1.8;
  return (
    <Rook
      blockSize={blockSize}
      state={(b) => {
        const isEdge = b.x === 0 || b.x === 4 || b.y === 0 || b.y === 5;
        const perim = (b.x + b.y * 3) / 15;
        const chasePos = (time * chaseSpeed) % 1;
        const prox = 1 - Math.min(Math.abs(perim - chasePos), Math.abs(perim - chasePos + 1), Math.abs(perim - chasePos - 1)) * 4;
        const glow = Math.max(0, prox);
        if (isEdge) {
          return {
            brightness: 0.4 + glow * 2.5,
            scale: 1 + glow * 0.12,
            hueShift: time * 60 + glow * 40,
            colorOverride: glow > 0.5 ? hslToHex((time * 80) % 360, 100, 60) : undefined,
          };
        }
        return { brightness: 0.35 + glow * 0.4, hueShift: time * 30 };
      }}
    />
  );
}

// 4. Strobe — only flashes on syllable peaks
function variant_Strobe({ env, time, blockSize = 42 }: RookieProps) {
  const hot = env > 0.25;
  const strobeBeat = Math.floor(time * 14);
  return (
    <Rook
      blockSize={blockSize}
      state={(_b, i) => {
        const blockBeat = (strobeBeat + i) % 4 === 0;
        if (!hot) return { brightness: 0.7 };
        if (blockBeat) return { brightness: 2.6, colorOverride: '#ffffff', scale: 1.18 };
        if (strobeBeat % 2 === 0) return { brightness: 1.6, scale: 1.04 };
        return { brightness: 0.15, scale: 0.97 };
      }}
    />
  );
}

// 5. Glitch Hop — kick/snare pattern, syllables = kicks
function variant_GlitchHop({ env, time, blockSize = 42 }: RookieProps) {
  const pulse = Math.min(1, env * 2.4);
  return (
    <Rook
      blockSize={blockSize}
      state={(_b, i) => {
        const measure = time % 2;
        const beat = Math.floor(measure * 4);
        const beatPos = (measure * 4) % 1;
        // Kick fires on syllables (pulse > threshold) at start of beats 0/2
        if ((beat === 0 || beat === 2) && beatPos < 0.12 && pulse > 0.25) {
          return { scale: 1 + 0.2 * pulse, brightness: 1.8, offsetY: 4 };
        }
        if ((beat === 1 || beat === 3) && beatPos < 0.1 && pulse > 0.25) {
          return {
            offsetX: (seededRandom(Math.floor(time * 8) + i) - 0.5) * 16,
            brightness: 2.2,
            hueShift: seededRandom(Math.floor(time * 8) + i * 3) * 360,
            scale: 1 + 0.1 * pulse,
          };
        }
        const hihat = Math.sin(time * 16 + i * 2) > 0.7;
        return hihat
          ? { brightness: 1.1 + 0.3 * pulse, scale: 1.03 }
          : { brightness: 0.75 };
      }}
    />
  );
}

// 6. Digitize — dissolve/scatter/reassemble driven by amplitude
function variant_Digitize({ env, time, blockSize = 42 }: RookieProps) {
  const pulse = Math.min(1, env * 2.2);
  return (
    <Rook
      blockSize={blockSize}
      state={(_b, i) => {
        const scatterAmt = pulse;
        if (scatterAmt < 0.1) return { opacity: 1, scale: 1 };
        const dissolve = scatterAmt;
        const shouldDissolve = seededRandom(Math.floor(time * 3) + i * 7) < dissolve;
        if (shouldDissolve) {
          return {
            offsetX: (seededRandom(i * 13) - 0.5) * 40 * dissolve,
            offsetY: (seededRandom(i * 17) - 0.5) * 40 * dissolve,
            scale: 1 - 0.4 * dissolve,
            opacity: 1 - dissolve * 0.5,
            brightness: 1 + 0.5 * dissolve,
            hueShift: time * 60,
          };
        }
        return { opacity: 1 };
      }}
    />
  );
}

// 7. Electric Arc — arcs jump to a new block on each syllable peak
function variant_ElectricArc({ env, amp, time, blockSize = 42 }: RookieProps) {
  // Use env peaks to choose arc pair (semi-stable)
  const arcSeed = Math.floor(time * 4) + (env > 0.3 ? 1 : 0);
  const srcBlock = Math.abs(Math.floor(seededRandom(arcSeed) * 22)) % 22;
  const dstBlock = Math.abs(Math.floor(seededRandom(arcSeed + 999) * 22)) % 22;
  const pulse = Math.min(1, env * 2.6);
  return (
    <Rook
      blockSize={blockSize}
      state={(_b, i) => {
        const my = i % 22;
        const isSource = my === srcBlock;
        const isDest = my === dstBlock;
        const onPath = (my === srcBlock + 1 || my === dstBlock - 1) && pulse > 0.3;
        if (isSource || isDest) {
          return {
            brightness: 1.8 + pulse * 0.8,
            colorOverride: '#4488ff',
            scale: 1 + 0.12 * pulse,
          };
        }
        if (onPath) {
          return {
            brightness: 2.2,
            colorOverride: '#88ccff',
            offsetX: (seededRandom(Math.floor(amp * 100) + i) - 0.5) * 4,
            offsetY: (seededRandom(Math.floor(amp * 100) + i + 50) - 0.5) * 4,
          };
        }
        return { brightness: 0.35 + pulse * 0.3 };
      }}
    />
  );
}

// 8. Quantum — ghostly flicker, collapse flash on loud syllables
function variant_Quantum({ env, time, blockSize = 42 }: RookieProps) {
  const collapse = env > 0.35;
  return (
    <Rook
      blockSize={blockSize}
      state={(_b, i) => {
        const obsSeed = seededRandom(Math.floor(time * 5) + i * 37);
        const observed = obsSeed > 0.45;
        if (collapse && seededRandom(Math.floor(time * 8) + i) > 0.55) {
          return { brightness: 2.4, colorOverride: '#ffffff', scale: 1.06 };
        }
        if (observed) return { brightness: 1.15, opacity: 1, scale: 1 };
        return {
          brightness: 0.55,
          scale: 0.8 + Math.sin(time * 8 + i) * 0.1,
          opacity: 0.35 + Math.sin(time * 6 + i) * 0.15,
          offsetX: Math.sin(time * 5 + i) * 4,
          offsetY: Math.cos(time * 4 + i) * 2,
          hueShift: 160,
        };
      }}
    />
  );
}

// 9. Teleport — re-teleports on each syllable burst
function variant_Teleport({ env, time, blockSize = 42 }: RookieProps) {
  // Cycle: 0-0.3 dissolve, 0.3-0.7 gone, 0.7-1.0 reassemble. Driven by env > threshold.
  const trigger = env > 0.3 ? 1 : 0;
  const period = 0.9;
  const phase = (time % period) / period;
  return (
    <Rook
      blockSize={blockSize}
      state={(_b, i) => {
        if (trigger) {
          if (phase < 0.3) {
            const p = phase / 0.3;
            if (seededRandom(Math.floor(time / period) + i * 11) < p) {
              return { scale: 1 - p, opacity: 1 - p, brightness: 1 + p * 1.5, hueShift: 180 };
            }
            return {};
          }
          if (phase < 0.6) return { opacity: 0, scale: 0 };
          const r = (phase - 0.6) / 0.4;
          if (seededRandom(Math.floor(time / period) + i * 11) < r) {
            return { scale: r, opacity: r, brightness: 2 - r, hueShift: 180 * (1 - r) };
          }
          return { opacity: 0, scale: 0 };
        }
        return {};
      }}
    />
  );
}

// ── Generic rook renderer ──
function Rook({ blockSize, state }: { blockSize: number; state: (b: { x: number; y: number; color: string }, i: number) => BlockState }) {
  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const w = 5 * blockSize + 4 * gap;
  const h = 6 * blockSize + 5 * gap;
  const radius = Math.max(1, Math.round(blockSize * 0.14));
  const sc = blockSize / 14;
  const insetShadow = `inset 0 ${(0.75 * sc).toFixed(2)}px 0 rgba(0,0,0,0.15), inset 0 -${(0.75 * sc).toFixed(2)}px 0 rgba(255,255,255,0.15)`;
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      {ROOK_GRID.map((b, i) => {
        const s: BlockState = state(b, i);
        const color = s.colorOverride ?? b.color;
        const left = b.x * (blockSize + gap) + (s.offsetX ?? 0);
        const top = b.y * (blockSize + gap) + (s.offsetY ?? 0);
        const glow = s.glow;
        const shadow = glow
          ? `${insetShadow}, 0 0 ${glow.radius.toFixed(0)}px ${glow.radius.toFixed(0)}px ${hexWithAlpha(glow.color, glow.opacity)}`
          : insetShadow;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left,
              top,
              width: blockSize,
              height: blockSize,
              borderRadius: radius,
              background: matte(color),
              boxShadow: shadow,
              opacity: s.opacity ?? 1,
              filter: `brightness(${(s.brightness ?? 1).toFixed(2)}) saturate(${(s.saturate ?? 1).toFixed(2)}) hue-rotate(${(s.hueShift ?? 0).toFixed(0)}deg)`,
              transform: `scale(${(s.scale ?? 1).toFixed(3)}) skew(${(s.skewX ?? 0).toFixed(2)}deg, ${(s.skewY ?? 0).toFixed(2)}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

const VARIANTS = [
  { id: 'heartbeat3d', label: '1 · 3D Heartbeat', desc: 'Lub-dub scale punch + perspective tilt. Driven by word-aligned envelope.', render: variant_Heartbeat3D },
  { id: 'pixelSort', label: '2 · Pixel Sort', desc: 'Horizontal glitch-sort. Amplitude amps up displacement and brightness.', render: variant_PixelSort },
  { id: 'neonPulse', label: '3 · Neon Pulse', desc: 'Perimeter light chase. Speeds up on louder syllables.', render: variant_NeonPulse },
  { id: 'strobe', label: '4 · Strobe', desc: 'Hard white strobe — only fires on syllable peaks.', render: variant_Strobe },
  { id: 'glitchHop', label: '5 · Glitch Hop', desc: 'Kick/snare rhythm; kicks trigger on syllables.', render: variant_GlitchHop },
  { id: 'digitize', label: '6 · Digitize', desc: 'Blocks scatter + dissolve by syllable amplitude.', render: variant_Digitize },
  { id: 'electricArc', label: '7 · Electric Arc', desc: 'Lightning jumps between blocks on each syllable.', render: variant_ElectricArc },
  { id: 'quantum', label: '8 · Quantum', desc: 'Ghostly superposition → collapse flash on loud syllables.', render: variant_Quantum },
  { id: 'teleport', label: '9 · Teleport', desc: 'Re-teleports in on each syllable burst.', render: variant_Teleport },
] as const;

export default function RookieSpeakingTestPage() {
  const { amp, env, time, playing, start } = useAudio();
  const [alignment, setAlignment] = useState<Alignment | null>(null);
  useEffect(() => {
    fetch(ALIGN_SRC).then(r => r.json()).then(setAlignment).catch(() => setAlignment(null));
  }, []);

  return (
    <div className="min-h-full w-full overflow-auto bg-[#FAFAFA] p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-black text-[#2A3C45]">Rookie Speaking — 9 Variants</h1>
        <p className="mb-6 text-[#6b7c8a]">All synced to the mp3 via an envelope follower (fast attack, slow release) — syllables drive the motion.</p>

        <button
          onClick={start}
          className="mb-6 rounded-full bg-[#FF9600] px-8 py-3 text-lg font-bold text-white shadow-lg hover:brightness-110"
        >
          {playing ? 'Playing…' : 'Play audio'}
        </button>

        <div className="mb-6 flex items-center gap-4">
          <div className="text-sm font-mono text-[#6b7c8a] w-28">amp {amp.toFixed(2)}</div>
          <div className="h-2 w-40 overflow-hidden rounded-full bg-[#e4e9ee]">
            <div className="h-full bg-[#6b7c8a]" style={{ width: `${Math.min(100, amp * 240)}%` }} />
          </div>
          <div className="text-sm font-mono text-[#6b7c8a] w-28">env {env.toFixed(2)}</div>
          <div className="h-2 w-40 overflow-hidden rounded-full bg-[#e4e9ee]">
            <div className="h-full bg-[#FF9600]" style={{ width: `${Math.min(100, env * 240)}%` }} />
          </div>
          <div className="text-sm font-mono text-[#6b7c8a]">t {time.toFixed(2)}s</div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VARIANTS.map((v) => {
            // Use aligned envelope when available (frame-perfect), fall back to FFT envelope
            const alignedEnv = alignment ? alignedEnvelope(alignment, time) : env;
            const word = activeWord(alignment, time);
            return (
              <div key={v.id} className="rounded-2xl bg-white p-6 shadow-md">
                <div className="mb-2 text-lg font-bold text-[#2A3C45]">{v.label}</div>
                <div className="mb-4 min-h-[40px] text-sm text-[#6b7c8a]">{v.desc}</div>
                <div className="flex h-[340px] items-center justify-center">
                  <v.render amp={amp} env={alignedEnv} time={time} alignment={alignment} blockSize={42} />
                </div>
                <div className="mt-2 h-5 text-center text-xs font-mono text-[#FF9600]">{word?.word ?? ''}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
