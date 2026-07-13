'use client';

/**
 * Punch grader: run the EXACT same detection pipeline as the live workout
 * punch cam over a recorded video file, and report every detected punch with
 * its timestamp. Used to grade detector accuracy against real footage —
 * compare the events list to what actually happens in the video.
 * Detection timebase is video.currentTime, so results are identical no matter
 * how smoothly the video plays back. Drive headlessly with
 * scripts/grade-punch-video.mjs.
 */

import { useCallback, useRef, useState } from 'react';
import { createFreshLandmarker, getLandmarker } from '@/lib/punch/landmarker';
import {
  createPunchDetector,
  DEFAULT_SENSITIVITY,
  SENSITIVITY_MIN,
  SENSITIVITY_MAX,
  KP,
  MIN_SCORE,
  type Keypoint,
  type PunchEvent,
} from '@/lib/punch/punch-detector';

type VideoWithRVFC = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
};

type GradeResult = {
  file: string;
  durationSec: number;
  sensitivity: number;
  total: number;
  left: number;
  right: number;
  framesAnalyzed: number;
  events: { side: string; t: number; velocity: number }[];
  /** per-frame extension / rel-speed / radial / abs-speed, for diagnosing misses */
  trace: {
    t: number; eL: number; eR: number; sL: number; sR: number;
    rL: number; rR: number; aL: number; aR: number;
  }[];
};

export default function PunchGraderPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runIdRef = useRef(0);

  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState<'idle' | 'ready' | 'grading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [sensitivity, setSensitivity] = useState(DEFAULT_SENSITIVITY);
  const [liveCount, setLiveCount] = useState(0);
  const [result, setResult] = useState<GradeResult | null>(null);

  const onFile = useCallback((f: File | undefined) => {
    if (!f) return;
    runIdRef.current++;
    const video = videoRef.current!;
    video.src = URL.createObjectURL(f);
    setFileName(f.name);
    setResult(null);
    setLiveCount(0);
    setStatus('ready');
  }, []);

  const grade = useCallback(async () => {
    const runId = ++runIdRef.current;
    const video = videoRef.current!;
    setStatus('grading');
    setErrorMsg('');
    setResult(null);
    setLiveCount(0);
    try {
      const qp = new URLSearchParams(window.location.search);
      const stepped = Number(qp.get('step')) > 0;
      // stepped mode feeds video-time timestamps (deterministic smoothing) —
      // needs its own landmarker instance; timestamps are monotonic per instance
      const detector = stepped ? await createFreshLandmarker() : await getLandmarker();
      // ?refrac= / ?window= override detector timing for tuning experiments
      const refrac = Number(qp.get('refrac'));
      const win = Number(qp.get('window'));
      const punchDetector = createPunchDetector({
        refractoryS: refrac > 0 ? refrac : undefined,
        pendingS: win > 0 ? win : undefined,
      });
      const events: PunchEvent[] = [];
      const trace: GradeResult['trace'] = [];
      let frames = 0;
      let lastVideoTime = -1;

      video.currentTime = 0;
      video.muted = true;
      const params = new URLSearchParams(window.location.search);
      // ?rate=0.25 plays slower so slow (software-rendered/headless) machines
      // analyze more frames. Detection uses VIDEO time, so results don't skew.
      const rate = Number(params.get('rate'));
      // ?step=30 skips realtime playback entirely: seek frame-by-frame at an
      // exact sampling fps. Deterministic (no dropped frames, no run-to-run
      // jitter) — the mode used for tuning/grading on slow machines.
      const stepFps = Number(params.get('step'));

      let finished = false;
      const finish = () => {
        if (runId !== runIdRef.current || finished) return;
        finished = true;
        const counts = { left: 0, right: 0 };
        for (const e of events) counts[e.side]++;
        setResult({
          file: fileName,
          durationSec: Math.round(video.duration * 100) / 100,
          sensitivity,
          total: events.length,
          left: counts.left,
          right: counts.right,
          framesAnalyzed: frames,
          events: events.map((e) => ({
            side: e.side,
            t: Math.round(e.t * 100) / 100,
            velocity: Math.round(e.velocity * 10) / 10,
          })),
          trace,
        });
        setStatus('done');
      };

      const processFrame = () => {
        frames++;
        // stepped: video-time ts (deterministic, phone-like 33ms spacing);
        // realtime: wall clock. Punch timing always uses VIDEO time.
        const ts = stepped ? video.currentTime * 1000 : performance.now();
        const res = detector.detectForVideo(video, ts);
        const lms = res.landmarks[0];
        const world = res.worldLandmarks[0];
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (!lms) return;
        const kps: Keypoint[] = lms.map((l) => ({
          x: l.x * video.videoWidth,
          y: l.y * video.videoHeight,
          vis: l.visibility ?? 1,
        }));
        if (world) {
          const wkps: Keypoint[] = world.map((l) => ({ ...l, vis: l.visibility ?? 1 }));
          const r = punchDetector.update(wkps, video.currentTime, sensitivity);
          if (r.events.length) {
            events.push(...r.events);
            setLiveCount(events.length);
          }
          if (trace.length < 800) {
            const rnd = (n: number) => Math.round(n * 100) / 100;
            trace.push({
              t: rnd(video.currentTime),
              eL: rnd(r.ext.left),
              eR: rnd(r.ext.right),
              sL: rnd(r.speed.left),
              sR: rnd(r.speed.right),
              rL: rnd(r.radial.left),
              rR: rnd(r.radial.right),
              aL: rnd(r.abs.left),
              aR: rnd(r.abs.right),
            });
          }
        }
        if (ctx && canvas) {
          const ok = (i: number) => kps[i].vis > MIN_SCORE;
          for (const [a, b] of [[KP.LS, KP.LE], [KP.LE, KP.LW], [KP.RS, KP.RE], [KP.RE, KP.RW], [KP.LS, KP.RS]]) {
            if (!ok(a) || !ok(b)) continue;
            ctx.beginPath();
            ctx.moveTo(kps[a].x, kps[a].y);
            ctx.lineTo(kps[b].x, kps[b].y);
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.9)';
            ctx.lineWidth = 4;
            ctx.stroke();
          }
        }
      };

      video.addEventListener(
        'error',
        () => {
          if (runId !== runIdRef.current) return;
          setStatus('error');
          setErrorMsg(
            `Video decode failed (${video.error?.message || 'unsupported codec'}). ` +
              'Headless Chromium lacks H.264/HEVC — transcode with: ffmpeg -i in -c:v libvpx-vp9 -an out.webm',
          );
        },
        { once: true },
      );

      if (stepFps > 0) {
        // stepped mode: pause + seek through the whole file at exact intervals
        if (Number.isNaN(video.duration)) {
          await new Promise((res) => video.addEventListener('loadedmetadata', res, { once: true }));
        }
        video.pause();
        const dt = 1 / stepFps;
        for (let t = 0; t < video.duration; t += dt) {
          if (runId !== runIdRef.current) return;
          const seeked = new Promise((res) => video.addEventListener('seeked', res, { once: true }));
          video.currentTime = Math.min(t, Math.max(0, video.duration - 0.001));
          await seeked;
          processFrame();
        }
        finish();
        return;
      }

      video.playbackRate = rate > 0 && rate <= 1 ? rate : 1;
      await video.play();

      const step = () => {
        if (runId !== runIdRef.current) return;
        if (video.ended) {
          finish();
          return;
        }
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          processFrame();
        }
        const v = video as VideoWithRVFC;
        if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(step);
        else requestAnimationFrame(step);
      };
      // rvfc only fires on NEW frames — after the last frame it goes silent,
      // so 'ended' is the reliable completion signal.
      video.addEventListener('ended', finish, { once: true });
      step();
    } catch (e) {
      console.error('[punch-grader] failed:', e);
      setStatus('error');
      setErrorMsg(e instanceof Error && e.message ? e.message : 'Grading failed');
    }
  }, [fileName, sensitivity]);

  return (
    <div className="min-h-full bg-chess-page overflow-auto p-4">
      <div className="max-w-sm mx-auto space-y-4 pb-12">
        <h1 className="text-lg font-bold text-chess-text">Punch Grader</h1>
        <p className="text-sm text-chess-text-muted">
          Runs the workout punch cam&apos;s exact detection over a recorded video and
          lists every counted punch with its timestamp. Processing happens entirely
          in this tab.
        </p>

        <input
          type="file"
          accept="video/*"
          data-testid="video-input"
          onChange={(e) => onFile(e.target.files?.[0])}
          className="block w-full text-sm text-chess-text file:mr-3 file:rounded-xl file:border-0 file:bg-chess-surface file:px-4 file:py-2.5 file:font-bold file:text-chess-text"
        />

        <div className="rounded-xl bg-chess-surface border border-slate-200 p-3 space-y-2">
          <div className="text-xs text-chess-text-muted">
            Sensitivity (speed threshold: {sensitivity.toFixed(2)})
          </div>
          <input
            type="range" min={SENSITIVITY_MIN} max={SENSITIVITY_MAX} step="0.25" value={sensitivity}
            disabled={status === 'grading'}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-slate-900">
          <video ref={videoRef} playsInline muted className="w-full" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          {status === 'grading' && (
            <div className="absolute top-3 left-3 rounded-xl bg-black/60 px-4 py-2 text-white pointer-events-none">
              <div className="text-[10px] uppercase tracking-wide opacity-70">Punches</div>
              <div className="text-3xl font-bold leading-none" data-testid="live-count">{liveCount}</div>
            </div>
          )}
        </div>

        <button
          onClick={grade}
          disabled={status === 'idle' || status === 'grading'}
          data-testid="grade-button"
          className="w-full py-3 rounded-xl bg-green-500 font-bold text-white min-h-[44px] disabled:opacity-40"
        >
          {status === 'grading' ? 'Grading…' : '🥊 Grade video'}
        </button>

        {status === 'error' && <p className="text-sm text-red-500">{errorMsg}</p>}

        {result && (
          <div className="space-y-3" data-grade-done="true">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-chess-surface border border-slate-200 p-3">
                <div className="text-xs text-chess-text-muted">Total</div>
                <div className="text-xl font-bold text-chess-text">{result.total}</div>
              </div>
              <div className="rounded-xl bg-chess-surface border border-slate-200 p-3">
                <div className="text-xs text-chess-text-muted">Left</div>
                <div className="text-xl font-bold text-chess-text">{result.left}</div>
              </div>
              <div className="rounded-xl bg-chess-surface border border-slate-200 p-3">
                <div className="text-xs text-chess-text-muted">Right</div>
                <div className="text-xl font-bold text-chess-text">{result.right}</div>
              </div>
            </div>
            <div className="rounded-xl bg-chess-surface border border-slate-200 p-3">
              <div className="text-xs font-bold text-chess-text-muted uppercase mb-2">Detected punches</div>
              <div className="max-h-48 overflow-auto text-sm text-chess-text space-y-1">
                {result.events.length === 0 && <div className="text-chess-text-muted">None detected</div>}
                {result.events.map((e, i) => (
                  <div key={i} className="flex justify-between tabular-nums">
                    <span>#{i + 1} · {e.side}</span>
                    <span>{e.t.toFixed(2)}s · v{e.velocity}</span>
                  </div>
                ))}
              </div>
            </div>
            <pre
              data-testid="grade-json"
              className="rounded-xl bg-slate-900 text-green-300 text-[11px] p-3 overflow-auto max-h-64"
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
