'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';

/**
 * Rookie appears on a back-rank square — and the animation IS the
 * randomization. Slot-machine / roulette feel. Pure motion, no overlays.
 *
 * Each option is a sequence of keyframes that walk Rookie across files
 * before settling on the chosen square. Mode controls whether she
 * teleports between squares (discrete, slot-reel style) or slides
 * smoothly between them (continuous, roulette style).
 */

type Mode = 'discrete' | 'continuous';

type Keyframe = {
  /** ms from start. */
  t: number;
  /** Target file 0..7 (a..h). Fractional allowed in continuous mode. */
  file: number;
  /** Extra scale at this keyframe (default 1). */
  scale?: number;
  /** Extra rotation in deg (default 0). */
  rot?: number;
  /** Extra Y offset as fraction of square size (default 0). Negative = up. */
  y?: number;
  /** Horizontal squash for motion blur (default 1). */
  sx?: number;
};

type Option = {
  id: string;
  name: string;
  blurb: string;
  mode: Mode;
  /** Total animation duration. */
  totalMs: number;
  /** Build keyframes given the chosen final file. Last frame must land on it. */
  build: (finalFile: number) => Keyframe[];
};

const LIGHT = '#f0d9b5';
const DARK = '#b58863';
const ROW = 7; // White back rank in our visual board (row index from top).

/* ----------------------------- sequences ----------------------------- */

/** Cycle 0,1,2,...7,0,1,... accelerating then decelerating to land on F. */
function slotCycle(finalFile: number): Keyframe[] {
  const N = 14;
  const frames: Keyframe[] = [];
  // pick a start so that ramping forward lands on finalFile
  const startFile = (finalFile - (N - 1) + 800) % 8;
  // ease-out timing: more time near the end
  for (let i = 0; i < N; i++) {
    const p = i / (N - 1);
    const eased = 1 - Math.pow(1 - p, 2.4); // ease-out cubic-ish
    frames.push({
      t: eased * 1050,
      file: (startFile + i) % 8,
    });
  }
  // tiny bounce settle
  frames.push({ t: 1110, file: finalFile, scale: 1.12 });
  frames.push({ t: 1180, file: finalFile, scale: 0.96 });
  frames.push({ t: 1240, file: finalFile, scale: 1 });
  return frames;
}

/** Continuous smooth slide cycling through the rank, easing to a stop on F. */
function rouletteGlide(finalFile: number): Keyframe[] {
  const passes = 2; // full back-rank passes before settling
  const frames: Keyframe[] = [];
  const total = 1100;
  // Total "files traveled" — multiple passes then land on F
  const traveled = passes * 8 + finalFile; // moving right
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    const file = (eased * traveled) % 8;
    frames.push({ t: p * total, file });
  }
  // settle bounce
  frames.push({ t: 1170, file: finalFile, scale: 1.1 });
  frames.push({ t: 1240, file: finalFile, scale: 1 });
  return frames;
}

/** Random files, fast then slowing, teleporting (discrete). */
function randomStutter(finalFile: number): Keyframe[] {
  const N = 12;
  const frames: Keyframe[] = [];
  let t = 0;
  // generate a deterministic-ish pseudo-random sequence each call
  let prev = -1;
  for (let i = 0; i < N - 1; i++) {
    let f;
    do {
      f = Math.floor(Math.random() * 8);
    } while (f === prev);
    prev = f;
    frames.push({ t, file: f });
    // each tick is longer than the last (ease-out)
    const p = i / (N - 2);
    const dt = 30 + Math.pow(p, 2) * 160;
    t += dt;
  }
  frames.push({ t, file: finalFile, scale: 1.15 });
  frames.push({ t: t + 90, file: finalFile, scale: 0.94 });
  frames.push({ t: t + 170, file: finalFile, scale: 1 });
  return frames;
}

/** Ping-pong: bounces between extremes, narrowing range, lands on F. */
function pingPongNarrow(finalFile: number): Keyframe[] {
  const frames: Keyframe[] = [];
  // sequence of files: 0, 7, 1, 6, 2, 5, 3, 4 then F
  const seq = [0, 7, 1, 6, 2, 5, finalFile];
  const N = seq.length;
  let t = 0;
  for (let i = 0; i < N; i++) {
    const p = i / (N - 1);
    const dt = 70 + p * 160; // slower toward the end
    frames.push({ t, file: seq[i] });
    t += dt;
  }
  frames.push({ t, file: finalFile, scale: 1.12 });
  frames.push({ t: t + 90, file: finalFile, scale: 1 });
  return frames;
}

/** Sequential hops with an arc trajectory, decelerating to F. */
function hopWalk(finalFile: number): Keyframe[] {
  // start on far side relative to F so we hop toward it
  const startFile = finalFile <= 3 ? 7 : 0;
  const dir = startFile < finalFile ? 1 : -1;
  const dist = Math.abs(finalFile - startFile);
  const hops = Math.max(4, dist); // at least 4 hops feel
  const frames: Keyframe[] = [];
  let t = 0;
  for (let i = 0; i <= hops; i++) {
    // each hop is two keyframes: peak (mid air) and land
    const p = i / hops;
    const eased = 1 - Math.pow(1 - p, 2);
    const file = startFile + dir * eased * dist;
    // bottom of hop
    frames.push({ t, file, y: 0 });
    // top of hop (between this and next)
    if (i < hops) {
      const nextEased = 1 - Math.pow(1 - (i + 1) / hops, 2);
      const nextFile = startFile + dir * nextEased * dist;
      const midFile = (file + nextFile) / 2;
      const dt = 90 + p * 60;
      frames.push({ t: t + dt, file: midFile, y: -0.55, scale: 1.04 });
      t += dt * 2;
    }
  }
  // squash on final land
  frames.push({ t: t + 40, file: finalFile, y: 0, scale: 1.12, sx: 1.08 });
  frames.push({ t: t + 130, file: finalFile, scale: 1, sx: 1 });
  return frames;
}

/** Sweep left → right across the rank twice, snap on F. */
function strobeSweep(finalFile: number): Keyframe[] {
  const frames: Keyframe[] = [];
  let t = 0;
  // two fast L→R sweeps (discrete)
  for (let sweep = 0; sweep < 2; sweep++) {
    for (let f = 0; f < 8; f++) {
      frames.push({ t, file: f });
      t += 40;
    }
  }
  // third sweep, slower, stops at F
  for (let f = 0; f <= finalFile; f++) {
    frames.push({ t, file: f });
    t += 50 + f * 18;
  }
  frames.push({ t, file: finalFile, scale: 1.14 });
  frames.push({ t: t + 90, file: finalFile, scale: 1 });
  return frames;
}

/** Spin-step: each hop she rotates 360°, decelerating to F upright. */
function spinStep(finalFile: number): Keyframe[] {
  const startFile = finalFile <= 3 ? 7 : 0;
  const dir = startFile < finalFile ? 1 : -1;
  const dist = Math.abs(finalFile - startFile);
  const N = Math.max(5, dist + 1);
  const frames: Keyframe[] = [];
  let t = 0;
  for (let i = 0; i < N; i++) {
    const p = i / (N - 1);
    const eased = 1 - Math.pow(1 - p, 2.2);
    const file = startFile + dir * eased * dist;
    const rot = i * 360; // each step adds a full rotation
    frames.push({ t, file, rot });
    t += 80 + p * 110;
  }
  // settle on F, upright
  const lastRot = (N - 1) * 360;
  frames.push({ t, file: finalFile, rot: lastRot, scale: 1.1 });
  frames.push({ t: t + 90, file: finalFile, rot: lastRot, scale: 1 });
  return frames;
}

/** Continuous slide, very fast, with horizontal motion smear via scaleX. */
function reelSmear(finalFile: number): Keyframe[] {
  const traveled = 16 + finalFile; // 2 passes then land
  const total = 1050;
  const steps = 20;
  const frames: Keyframe[] = [];
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    const eased = 1 - Math.pow(1 - p, 3.2);
    const file = (eased * traveled) % 8;
    // velocity proportional to derivative — fake via scaleX
    const v = 1 - eased; // higher at start
    const sx = 1 + v * 0.35;
    const scale = 1 - v * 0.08;
    frames.push({ t: p * total, file, sx, scale });
  }
  frames.push({ t: 1100, file: finalFile, sx: 1, scale: 1.08 });
  frames.push({ t: 1180, file: finalFile, sx: 1, scale: 1 });
  return frames;
}

/** Scatter lock: a few wide jumps with shrinking gaps, slam land on F. */
function scatterLock(finalFile: number): Keyframe[] {
  // pick 4 random distant files, then F
  const picks: number[] = [];
  let prev = finalFile;
  while (picks.length < 4) {
    const f = Math.floor(Math.random() * 8);
    if (Math.abs(f - prev) >= 3) {
      picks.push(f);
      prev = f;
    }
  }
  const frames: Keyframe[] = [];
  let t = 0;
  const gaps = [230, 200, 170, 140];
  for (let i = 0; i < picks.length; i++) {
    frames.push({ t, file: picks[i], scale: 1.05 });
    frames.push({ t: t + 30, file: picks[i], scale: 0.95 });
    frames.push({ t: t + 80, file: picks[i], scale: 1 });
    t += gaps[i];
  }
  // slam down on F with a satisfying squash
  frames.push({ t, file: finalFile, scale: 1.25, sx: 1.15 });
  frames.push({ t: t + 90, file: finalFile, scale: 0.92, sx: 0.95 });
  frames.push({ t: t + 170, file: finalFile, scale: 1, sx: 1 });
  return frames;
}

/** Reverse roulette: smooth slide RIGHT→LEFT cycling backward, lands on F. */
function rouletteReverse(finalFile: number): Keyframe[] {
  const passes = 2;
  // moving leftward (negative direction)
  const traveled = passes * 8 + (8 - finalFile); // distance going left
  const total = 1100;
  const steps = 24;
  const frames: Keyframe[] = [];
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    const eased = 1 - Math.pow(1 - p, 3);
    // start at finalFile, move left by traveled, mod 8
    const file = ((finalFile - eased * traveled) % 8 + 800) % 8;
    frames.push({ t: p * total, file });
  }
  frames.push({ t: 1170, file: finalFile, scale: 1.1 });
  frames.push({ t: 1240, file: finalFile, scale: 1 });
  return frames;
}

/* ----------------------------- options ----------------------------- */

const OPTIONS: Option[] = [
  {
    id: 'slot-cycle',
    name: '1 — Slot Cycle',
    blurb: 'Hard teleports across files, accelerates then slows. Classic reel.',
    mode: 'discrete',
    totalMs: 1240,
    build: slotCycle,
  },
  {
    id: 'roulette-glide',
    name: '2 — Roulette Glide',
    blurb: 'Smooth slide through 2 passes of the rank, eases to a stop.',
    mode: 'continuous',
    totalMs: 1240,
    build: rouletteGlide,
  },
  {
    id: 'random-stutter',
    name: '3 — Random Stutter',
    blurb: 'Truly random files, each tick longer than the last, lands.',
    mode: 'discrete',
    totalMs: 1300,
    build: randomStutter,
  },
  {
    id: 'ping-pong',
    name: '4 — Ping-Pong Narrow',
    blurb: 'Bounces between extremes, narrowing in on her square.',
    mode: 'discrete',
    totalMs: 1250,
    build: pingPongNarrow,
  },
  {
    id: 'hop-walk',
    name: '5 — Hop Walk',
    blurb: 'Physical arc-hops along the rank, squash on final landing.',
    mode: 'continuous',
    totalMs: 1300,
    build: hopWalk,
  },
  {
    id: 'strobe-sweep',
    name: '6 — Strobe Sweep',
    blurb: 'Two fast L→R sweeps across the rank, third sweep parks on F.',
    mode: 'discrete',
    totalMs: 1300,
    build: strobeSweep,
  },
  {
    id: 'spin-step',
    name: '7 — Spin-Step',
    blurb: 'Each step she rotates a full turn, decelerates upright on F.',
    mode: 'continuous',
    totalMs: 1250,
    build: spinStep,
  },
  {
    id: 'reel-smear',
    name: '8 — Reel Smear',
    blurb: 'Continuous slide with horizontal motion-smear, resolves clean.',
    mode: 'continuous',
    totalMs: 1180,
    build: reelSmear,
  },
  {
    id: 'scatter-lock',
    name: '9 — Scatter Lock',
    blurb: 'Few wide jumps with shrinking gaps, slams down on F.',
    mode: 'discrete',
    totalMs: 1100,
    build: scatterLock,
  },
  {
    id: 'roulette-reverse',
    name: '10 — Reverse Roulette',
    blurb: 'Right→left smooth slide, opposite spin from #2. Roulette wheel.',
    mode: 'continuous',
    totalMs: 1240,
    build: rouletteReverse,
  },
];

/* ----------------------------- player ----------------------------- */

type FrameState = {
  file: number;
  scale: number;
  rot: number;
  y: number;
  sx: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function evalFrames(frames: Keyframe[], mode: Mode, tMs: number): FrameState {
  if (frames.length === 0) {
    return { file: 0, scale: 1, rot: 0, y: 0, sx: 1 };
  }
  if (tMs <= frames[0].t) {
    const f = frames[0];
    return {
      file: f.file,
      scale: f.scale ?? 1,
      rot: f.rot ?? 0,
      y: f.y ?? 0,
      sx: f.sx ?? 1,
    };
  }
  const last = frames[frames.length - 1];
  if (tMs >= last.t) {
    return {
      file: last.file,
      scale: last.scale ?? 1,
      rot: last.rot ?? 0,
      y: last.y ?? 0,
      sx: last.sx ?? 1,
    };
  }
  // find bracket
  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i];
    const b = frames[i + 1];
    if (tMs >= a.t && tMs <= b.t) {
      if (mode === 'discrete') {
        return {
          file: a.file,
          scale: a.scale ?? 1,
          rot: a.rot ?? 0,
          y: a.y ?? 0,
          sx: a.sx ?? 1,
        };
      }
      const p = (tMs - a.t) / Math.max(1, b.t - a.t);
      return {
        file: lerp(a.file, b.file, p),
        scale: lerp(a.scale ?? 1, b.scale ?? 1, p),
        rot: lerp(a.rot ?? 0, b.rot ?? 0, p),
        y: lerp(a.y ?? 0, b.y ?? 0, p),
        sx: lerp(a.sx ?? 1, b.sx ?? 1, p),
      };
    }
  }
  const f = last;
  return {
    file: f.file,
    scale: f.scale ?? 1,
    rot: f.rot ?? 0,
    y: f.y ?? 0,
    sx: f.sx ?? 1,
  };
}

function MiniBoard({
  option,
  replayKey,
  finalFile,
}: {
  option: Option;
  replayKey: number;
  finalFile: number;
}) {
  const [state, setState] = useState<FrameState>({
    file: finalFile,
    scale: 1,
    rot: 0,
    y: 0,
    sx: 1,
  });
  const framesRef = useRef<Keyframe[]>([]);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const frames = option.build(finalFile);
    framesRef.current = frames;
    startRef.current = performance.now();

    const tick = () => {
      const now = performance.now();
      const t = now - startRef.current;
      const s = evalFrames(framesRef.current, option.mode, t);
      setState(s);
      const last = framesRef.current[framesRef.current.length - 1];
      if (t < last.t) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayKey, option.id, finalFile]);

  // Position Rookie absolutely on the back rank.
  // Square width = 12.5% of board. Rookie's left = file * 12.5%.
  const left = state.file * 12.5;
  const top = ROW * 12.5;

  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        width: '100%',
        maxWidth: 360,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
      }}
    >
      {/* Board grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gridTemplateRows: 'repeat(8, 1fr)',
        }}
      >
        {Array.from({ length: 64 }).map((_, idx) => {
          const r = Math.floor(idx / 8);
          const c = idx % 8;
          const isLight = (r + c) % 2 === 0;
          return <div key={idx} style={{ background: isLight ? LIGHT : DARK }} />;
        })}
      </div>

      {/* Rookie — absolutely positioned, drives all motion. */}
      <div
        style={{
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          width: '12.5%',
          height: '12.5%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'left, transform',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${state.y * 100}%) scale(${state.scale * 0.9}) scaleX(${state.sx}) rotate(${state.rot}deg)`,
            transformOrigin: 'center center',
          }}
        >
          <BreathingRook size="xs" animate mood="neutral" />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- page ----------------------------- */

function randFile() {
  return Math.floor(Math.random() * 8);
}

export default function RookieAppearTestPage() {
  const [state, setState] = useState(() =>
    OPTIONS.reduce<Record<string, { key: number; file: number }>>((acc, o) => {
      acc[o.id] = { key: 0, file: randFile() };
      return acc;
    }, {}),
  );

  const replay = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      [id]: { key: prev[id].key + 1, file: randFile() },
    }));
  }, []);

  const replayAll = useCallback(() => {
    setState((prev) => {
      const next: typeof prev = {};
      for (const id of Object.keys(prev)) {
        next[id] = { key: prev[id].key + 1, file: randFile() };
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(replayAll, 300);
    return () => clearTimeout(t);
  }, [replayAll]);

  const [pick, setPick] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full overflow-auto bg-stone-900 text-stone-100">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold">Rookie&apos;s Run — Roulette Appear</h1>
          <button
            onClick={replayAll}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-amber-400 active:scale-95 transition"
          >
            Replay all
          </button>
        </div>
        <p className="text-stone-400 mb-8">
          Ten ways for the animation to BE the randomization — slot reel, roulette, ping-pong, etc.
          Pure motion, no overlay colors. Tap a board or Replay to re-roll the landing file.
        </p>

        <div className="grid gap-8 sm:grid-cols-2">
          {OPTIONS.map((opt) => {
            const selected = pick === opt.id;
            const s = state[opt.id];
            return (
              <div
                key={opt.id}
                className={`rounded-2xl p-4 transition-all ${
                  selected
                    ? 'bg-amber-500/15 ring-2 ring-amber-400'
                    : 'bg-stone-800/60 ring-1 ring-stone-700'
                }`}
              >
                <div className="flex items-baseline justify-between mb-3">
                  <button
                    onClick={() => setPick(opt.id)}
                    className="text-lg font-semibold text-left hover:text-amber-300"
                  >
                    {opt.name}
                  </button>
                  <button
                    onClick={() => replay(opt.id)}
                    className="rounded-md bg-stone-700 px-3 py-1 text-xs font-medium hover:bg-stone-600 active:scale-95 transition"
                  >
                    Replay
                  </button>
                </div>
                <button
                  onClick={() => replay(opt.id)}
                  className="block w-full"
                  aria-label={`Replay ${opt.name}`}
                >
                  <MiniBoard option={opt} replayKey={s.key} finalFile={s.file} />
                </button>
                <p className="text-sm text-stone-400 mt-3">{opt.blurb}</p>
                <p className="text-xs text-stone-500 mt-1">
                  Landed on: <span className="text-stone-300">{'abcdefgh'[s.file]}1</span>
                </p>
              </div>
            );
          })}
        </div>

        {pick ? (
          <div className="mt-10 rounded-xl bg-amber-500/10 ring-1 ring-amber-400/40 p-4 text-sm">
            You picked <span className="font-semibold text-amber-200">{pick}</span>. Tell Claude to
            wire this into Rookie&apos;s spawn on <code>components/run/Board.tsx</code>.
          </div>
        ) : null}
      </div>
    </div>
  );
}
