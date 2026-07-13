'use client';

/**
 * POC: camera-based punch counter for Chess Boxing (FightCamp-style, no hardware).
 * MediaPipe PoseLandmarker runs fully in-browser — video never leaves the device.
 * WASM runtime + model load from Google's CDN at runtime (test page only).
 * Detection: wrist extension away from the same-side shoulder, normalized by
 * shoulder width so distance from camera doesn't matter. A punch = fast
 * extension past the threshold, counted once until the hand retracts.
 * Stand at a slight angle (~45°) to the camera for best counting.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'loading' | 'running' | 'error';

type HandState = {
  phase: 'retracted' | 'extended';
  lastExt: number;
  lastTime: number;
  velocity: number;
};

const HYPE_LINES = [
  'Okay HANDS. I saw that.',
  'Ten more and I start telling people I know you.',
  'The pawns are watching. They are terrified.',
  'You punch like you castle — early and with conviction.',
  'I would NOT want to be a heavy bag right now.',
];

const RETRACT_T = 1.12; // ext below this = arm back home, re-arm the counter
const MIN_SCORE = 0.3; // ignore low-visibility landmarks
// MediaPipe PoseLandmarker indices (33-point topology)
const KP = { LS: 11, RS: 12, LE: 13, RE: 14, LW: 15, RW: 16 } as const;
// Self-hosted (no CDN): wasm copied by scripts/copy-mediapipe-wasm.mjs, model committed.
const WASM_PATH = '/mediapipe/wasm';
const MODEL_URL = '/models/pose_landmarker_lite.task';

export default function PunchTrackerTestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<{ left: HandState; right: HandState }>({
    left: { phase: 'retracted', lastExt: 0, lastTime: 0, velocity: 0 },
    right: { phase: 'retracted', lastExt: 0, lastTime: 0, velocity: 0 },
  });
  const punchTimesRef = useRef<number[]>([]);
  const fpsRef = useRef<{ frames: number; since: number }>({ frames: 0, since: 0 });
  const sensitivityRef = useRef(1.4);

  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [counts, setCounts] = useState({ left: 0, right: 0 });
  const [ppm, setPpm] = useState(0);
  const [fps, setFps] = useState(0);
  const [flash, setFlash] = useState(false);
  const [hype, setHype] = useState('');
  const [sensitivity, setSensitivity] = useState(1.4);
  const [debug, setDebug] = useState({ left: 0, right: 0 });

  useEffect(() => {
    sensitivityRef.current = sensitivity;
  }, [sensitivity]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStatus('idle');
  }, []);

  useEffect(() => stop, [stop]);

  const registerPunch = useCallback((side: 'left' | 'right') => {
    const now = performance.now();
    punchTimesRef.current.push(now);
    setCounts((c) => {
      const next = { ...c, [side]: c[side] + 1 };
      const total = next.left + next.right;
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
    setStatus('loading');
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      // Model loads only on this page — never in the app bundle.
      const { FilesetResolver, PoseLandmarker } = await import('@mediapipe/tasks-vision');
      const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);
      const detector = await PoseLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numPoses: 1,
      });

      setStatus('running');
      fpsRef.current = { frames: 0, since: performance.now() };
      let lastVideoTime = -1;

      const loop = () => {
        if (!streamRef.current) return;
        const now = performance.now();
        let lms: { x: number; y: number; visibility?: number }[] | undefined;
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          lms = detector.detectForVideo(video, now).landmarks[0];
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
          // normalized 0-1 coords → pixel space
          const kps = lms.map((l) => ({
            x: l.x * video.videoWidth,
            y: l.y * video.videoHeight,
            vis: l.visibility ?? 1,
          }));
          const ls = kps[KP.LS], rs = kps[KP.RS];
          const shoulderW = Math.hypot(ls.x - rs.x, ls.y - rs.y);
          const ok = (i: number) => kps[i].vis > MIN_SCORE;

          if (shoulderW > 20 && ok(KP.LS) && ok(KP.RS)) {
            const sides = [
              { side: 'left' as const, wrist: KP.LW, shoulder: KP.LS, elbow: KP.LE },
              { side: 'right' as const, wrist: KP.RW, shoulder: KP.RS, elbow: KP.RE },
            ];
            const dbg = { left: 0, right: 0 };
            for (const s of sides) {
              if (!ok(s.wrist)) continue;
              const w = kps[s.wrist], sh = kps[s.shoulder];
              // extension: wrist distance from shoulder, in shoulder-widths
              const ext = Math.hypot(w.x - sh.x, w.y - sh.y) / shoulderW;
              dbg[s.side] = ext;
              const hand = handsRef.current[s.side];
              const dt = (now - hand.lastTime) / 1000;
              if (dt > 0 && dt < 0.5) {
                hand.velocity = (ext - hand.lastExt) / dt; // shoulder-widths per second
              }
              const extendT = sensitivityRef.current;
              if (hand.phase === 'retracted' && ext > extendT && hand.velocity > 3) {
                hand.phase = 'extended';
                registerPunch(s.side);
              } else if (hand.phase === 'extended' && ext < RETRACT_T) {
                hand.phase = 'retracted';
              }
              hand.lastExt = ext;
              hand.lastTime = now;
            }
            setDebug(dbg);
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
      console.error('[punch-tracker] start failed:', e);
      stop();
      setStatus('error');
      setErrorMsg(e instanceof Error && e.message ? e.message : 'Camera or model failed to load');
    }
  }, [registerPunch, stop]);

  const total = counts.left + counts.right;

  return (
    <div className="min-h-full bg-chess-page overflow-auto p-4">
      <div className="max-w-sm mx-auto space-y-4 pb-12">
        <h1 className="text-lg font-bold text-chess-text">Punch Tracker POC</h1>
        <p className="text-sm text-chess-text-muted">
          Prop your phone up, step back so your upper body is in frame, and stand at a
          slight angle. Everything runs on your phone — no video is uploaded, ever.
        </p>

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

        {hype && status === 'running' && (
          <div className="rounded-xl bg-chess-surface border border-slate-200 p-3 text-sm text-chess-text">🐴 {hype}</div>
        )}

        {status === 'running' && (
          <>
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
                <span>Sensitivity (extension threshold: {sensitivity.toFixed(2)})</span>
                <span>L {debug.left.toFixed(2)} · R {debug.right.toFixed(2)}</span>
              </div>
              <input
                type="range" min="1.2" max="1.8" step="0.05" value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-[11px] text-chess-text-muted">
                Lower = counts easier. If it counts arm waves, raise it. Live numbers on the
                right show your current arm extension — throw a punch and watch it spike.
              </p>
            </div>

            <button onClick={stop} className="w-full py-3 rounded-xl bg-slate-200 font-medium text-chess-text min-h-[44px]">
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}
