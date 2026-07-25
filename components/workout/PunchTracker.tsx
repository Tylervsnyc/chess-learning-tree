'use client';

/**
 * Camera punch counter (Chess Boxing, WORKOUT_PUNCH_CAM flag).
 * MediaPipe PoseLandmarker runs fully in-browser — video never leaves the
 * device. A punch = fast wrist extension away from the same-side shoulder,
 * normalized by shoulder width (so camera distance doesn't matter), counted
 * once per extend/retract cycle. Model + WASM are self-hosted in public/
 * (scripts/copy-mediapipe-wasm.mjs). The landmarker is cached module-level so
 * round 2+ starts instantly.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { getLandmarker } from '@/lib/punch/landmarker';
import {
  createPunchDetector,
  DEFAULT_SENSITIVITY,
  SENSITIVITY_MIN,
  SENSITIVITY_MAX,
  KP,
  MIN_SCORE,
  type Keypoint,
} from '@/lib/punch/punch-detector';

type Status = 'idle' | 'loading' | 'running' | 'error';

const HYPE_LINES = [
  'Okay HANDS. I saw that.',
  'Ten more and I start telling people I know you.',
  'The pawns are watching. They are terrified.',
  'You punch like you castle — early and with conviction.',
  'I would NOT want to be a heavy bag right now.',
];


export function PunchTracker({
  autoStart = false,
  debug = false,
  className = '',
  onPunch,
}: {
  /** Start camera + model immediately on mount (used inside the workout). */
  autoStart?: boolean;
  /** Show sensitivity slider + live extension values (test page). */
  debug?: boolean;
  className?: string;
  /** Fires on every counted punch with the new session total. */
  onPunch?: (total: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef(createPunchDetector());
  const punchTimesRef = useRef<number[]>([]);
  const fpsRef = useRef<{ frames: number; since: number }>({ frames: 0, since: 0 });
  const sensitivityRef = useRef(DEFAULT_SENSITIVITY);
  const onPunchRef = useRef(onPunch);
  // Generation counter: each start()/stop() bumps it, so a start superseded
  // mid-await (StrictMode double-mount, fast toggle) cleans up and bails
  // instead of erroring with an interrupted play() request.
  const genRef = useRef(0);

  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [counts, setCounts] = useState({ left: 0, right: 0 });
  const [ppm, setPpm] = useState(0);
  const [fps, setFps] = useState(0);
  const [flash, setFlash] = useState(false);
  const [hype, setHype] = useState('');
  const [sensitivity, setSensitivity] = useState(DEFAULT_SENSITIVITY);
  const [dbgExt, setDbgExt] = useState({ left: 0, right: 0 });

  useEffect(() => {
    sensitivityRef.current = sensitivity;
  }, [sensitivity]);
  useEffect(() => {
    onPunchRef.current = onPunch;
  }, [onPunch]);

  const stop = useCallback(() => {
    genRef.current++;
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStatus('idle');
  }, []);

  const registerPunch = useCallback((side: 'left' | 'right') => {
    const now = performance.now();
    punchTimesRef.current.push(now);
    setCounts((c) => {
      const next = { ...c, [side]: c[side] + 1 };
      const total = next.left + next.right;
      onPunchRef.current?.(total);
      if (total > 0 && total % 10 === 0) {
        setHype(HYPE_LINES[(total / 10 - 1) % HYPE_LINES.length]);
      }
      return next;
    });
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    // punches per minute over the trailing 60s
    const cutoff = now - 60_000;
    punchTimesRef.current = punchTimesRef.current.filter((t) => t > cutoff);
    setPpm(punchTimesRef.current.length);
  }, []);

  const start = useCallback(async () => {
    const gen = ++genRef.current;
    setStatus('loading');
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      if (gen !== genRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      const detector = await getLandmarker();
      if (gen !== genRef.current) return;

      setStatus('running');
      fpsRef.current = { frames: 0, since: performance.now() };
      let lastVideoTime = -1;

      const loop = () => {
        if (gen !== genRef.current || !streamRef.current) return;
        const now = performance.now();
        let lms: { x: number; y: number; visibility?: number }[] | undefined;
        let world: { x: number; y: number; z: number; visibility?: number }[] | undefined;
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          const res = detector.detectForVideo(video, now);
          lms = res.landmarks[0];
          world = res.worldLandmarks[0];
        }

        const f = fpsRef.current;
        f.frames++;
        if (now - f.since > 1000) {
          setFps(Math.round((f.frames * 1000) / (now - f.since)));
          fpsRef.current = { frames: 0, since: now };
        }

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas && lms) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        if (lms) {
          // detection runs on WORLD landmarks (3D meters — rotation-proof);
          // pixel-space landmarks are only for drawing the overlay
          const kps: Keypoint[] = lms.map((l) => ({
            x: l.x * video.videoWidth,
            y: l.y * video.videoHeight,
            vis: l.visibility ?? 1,
          }));
          const ok = (i: number) => kps[i].vis > MIN_SCORE;

          if (world) {
            const wkps: Keypoint[] = world.map((l) => ({ ...l, vis: l.visibility ?? 1 }));
            const result = detectorRef.current.update(wkps, now / 1000, sensitivityRef.current);
            for (const ev of result.events) registerPunch(ev.side);
            if (debug) setDbgExt(result.ext);
          }

          if (ctx && canvas) {
            for (const [a, b] of [[KP.LS, KP.LE], [KP.LE, KP.LW], [KP.RS, KP.RE], [KP.RE, KP.RW], [KP.LS, KP.RS]]) {
              if (!ok(a) || !ok(b)) continue;
              ctx.beginPath();
              ctx.moveTo(kps[a].x, kps[a].y);
              ctx.lineTo(kps[b].x, kps[b].y);
              ctx.strokeStyle = 'rgba(74, 222, 128, 0.9)';
              ctx.lineWidth = 4;
              ctx.stroke();
            }
            for (const i of [KP.LW, KP.RW]) {
              if (!ok(i)) continue;
              ctx.beginPath();
              ctx.arc(kps[i].x, kps[i].y, 10, 0, Math.PI * 2);
              ctx.fillStyle = '#facc15';
              ctx.fill();
            }
          }
        }

        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (e) {
      if (gen !== genRef.current) return; // superseded start — not a real error
      console.error('[punch-tracker] start failed:', e);
      stop();
      setStatus('error');
      setErrorMsg(e instanceof Error && e.message ? e.message : 'Camera or model failed to load');
    }
  }, [registerPunch, stop, debug]);

  // autoStart + cleanup on unmount (segment end stops the camera)
  useEffect(() => {
    if (autoStart) start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = counts.left + counts.right;

  return (
    <div className={className}>
      <div className={`relative rounded-2xl overflow-hidden bg-slate-900 aspect-[3/4] transition-shadow ${flash ? 'ring-4 ring-yellow-400' : ''}`}>
        {/* mirror both layers so it feels like a mirror */}
        <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover -scale-x-100" />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover -scale-x-100" />

        {status === 'running' && (
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
            <div className="rounded-xl bg-black/60 px-4 py-2 text-white">
              <div className="text-[10px] uppercase tracking-wide opacity-70">Punches</div>
              <div className="text-4xl font-bold leading-none">{total}</div>
            </div>
            <div className="rounded-xl bg-black/60 px-3 py-2 text-white text-right">
              <div className="text-[10px] uppercase tracking-wide opacity-70">Per min</div>
              <div className="text-xl font-bold leading-none">{ppm}</div>
            </div>
          </div>
        )}

        {status === 'running' && hype && (
          <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
            <div className="rounded-xl bg-black/60 px-3 py-2 text-sm text-white">🐴 {hype}</div>
          </div>
        )}

        {status !== 'running' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white p-6 text-center">
            {status === 'loading' && <div className="text-sm animate-pulse">Loading model + camera…</div>}
            {status === 'error' && <div className="text-sm text-red-300">{errorMsg}</div>}
            {status !== 'loading' && (
              <button onClick={start} className="py-3 px-6 rounded-xl bg-green-500 font-bold text-white min-h-[44px]">
                📷 Start tracking
              </button>
            )}
          </div>
        )}
      </div>

      {debug && status === 'running' && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-chess-surface border border-slate-200 p-3">
              <div className="text-xs text-chess-text-muted">Left</div>
              <div className="text-xl font-bold text-chess-text">{counts.left}</div>
            </div>
            <div className="rounded-xl bg-chess-surface border border-slate-200 p-3">
              <div className="text-xs text-chess-text-muted">Right</div>
              <div className="text-xl font-bold text-chess-text">{counts.right}</div>
            </div>
            <div className="rounded-xl bg-chess-surface border border-slate-200 p-3">
              <div className="text-xs text-chess-text-muted">FPS</div>
              <div className="text-xl font-bold text-chess-text">{fps}</div>
            </div>
          </div>

          <div className="rounded-xl bg-chess-surface border border-slate-200 p-3 space-y-2">
            <div className="flex justify-between text-xs text-chess-text-muted">
              <span>Sensitivity (speed threshold: {sensitivity.toFixed(2)})</span>
              <span>L {dbgExt.left.toFixed(2)} · R {dbgExt.right.toFixed(2)}</span>
            </div>
            <input
              type="range" min={SENSITIVITY_MIN} max={SENSITIVITY_MAX} step="0.25" value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[11px] text-chess-text-muted">
              Lower = counts easier. If it counts arm waves, raise it. Live numbers on the
              right show current arm extension — throw a punch and watch it spike.
            </p>
          </div>

          <button onClick={stop} className="w-full py-3 rounded-xl bg-slate-200 font-medium text-chess-text min-h-[44px]">
            Stop
          </button>
        </div>
      )}
    </div>
  );
}
