'use client';

/**
 * QUADRANT FIGHT — the camera boxing mini-game, extracted from
 * /test/punch-zones (playtest-tuned; judging/tracking logic FROZEN).
 *
 * Camera divided into quarters. Commands (several can run AT ONCE later on):
 *   PUNCH      — get a wrist into the lit quadrant before it fills
 *   POWER      — orange, fast, staggers the opponent
 *   DOUBLE     — both hands, one per lit quadrant
 *   DODGE      — head out of the red quadrant when it fills (impact window)
 *   HALF DODGE — clear a whole side (left/right) or DUCK under the top half
 *   COMBO      — punch while a dodge zone runs
 *
 * ONE ROUND, ONE CLOCK (2026-08-17): the fight is a single `durationMs` round
 * (a real boxing round — 3:00 in the bout). Difficulty ramps with PROGRESS
 * through the round (`p = elapsed / durationMs`) plus the Rookie fight
 * `level`; there are no internal "rounds".
 *
 * NO HP, NO KNOCKDOWNS (2026-08-21): the score IS the counts — punches
 * landed vs missed, dodges made vs hits taken — shown live above the camera.
 * On top of the time ramp sits a rubber-band "heat" scalar driven by rolling
 * accuracy: hold the target accuracy and the tempo keeps climbing; start
 * missing and it backs off (twice as fast). One steady round, no freezes.
 * ONLY THE BELL ENDS IT: at `durationMs` the board freezes, a compact card
 * summary shows, and `onFinish(stats)` fires exactly once. `onStats` streams
 * the same numbers ~1/s for a live HUD.
 *
 * Pose model: MoveNet SinglePose Lightning via TF.js from npm, weights
 * self-hosted (lib/punch/movenet.ts — memoized per tab, so rounds 2+ boot in
 * the time it takes to re-open the camera). Camera stream is stopped on
 * unmount. Embedding surfaces gate the mount behind the user's opt-in.
 *
 * No API calls, no DB, no analytics here — the parent owns persistence.
 */

import { useEffect, useRef, useState } from 'react';
import { getMoveNet } from '@/lib/punch/movenet';
import { emptyFightStats, type FightStats } from '@/lib/box/fight-stats';
import type { PoseDetector } from '@tensorflow-models/pose-detection';

type Phase = 'boot' | 'ready' | 'playing' | 'done' | 'error';
type HalfSide = 'left' | 'right' | 'top';

// Per-punch tracking travels WITH the command so several can run at once.
// Arming is tracked PER WRIST (2026-08-13): a single shared "no wrist is in
// the zone" gate meant a resting guard hand parked in a bottom quadrant
// permanently blocked arming, so bottom-quadrant punches never fired.
type Side = 'L' | 'R';
type Arm = { clear: number; armed: boolean; hold: number };
type Track = { L: Arm; R: Arm; done: boolean };
const newArm = (): Arm => ({ clear: 0, armed: false, hold: 0 });
const newTrack = (): Track => ({ L: newArm(), R: newArm(), done: false });

type Command =
  | { kind: 'punch'; zone: number; deadline: number; winMs: number; t: Track }
  | { kind: 'power'; zone: number; deadline: number; winMs: number; t: Track }
  | { kind: 'double'; zoneA: number; zoneB: number; deadline: number; winMs: number; tA: Track; tB: Track }
  | { kind: 'dodge'; zone: number; deadline: number; winMs: number; inFrames: number }
  | { kind: 'halfdodge'; side: HalfSide; deadline: number; winMs: number; inFrames: number }
  | { kind: 'combo'; punchZone: number; dodgeZone: number; deadline: number; winMs: number; t: Track; punchDone: boolean; inFrames: number };

type Flash = { zone: number; ok: boolean; until: number };

const COLS = 2;
const ROWS = 2;
const CONFIDENCE = 0.3;
const PUNCH_FRAMES = 2; // consecutive frames a wrist must be in-zone
const DEFAULT_DURATION_MS = 180_000;

// ---- Rubber-band difficulty ("heat") ----
// Rolling accuracy over the last RB_WINDOW resolves steers a 0..1 heat
// scalar: above target → heat climbs, below → it backs off twice as fast.
const RB_WINDOW = 8; // rolling window: last N command results
const RB_MIN_SAMPLES = 4; // don't judge the opener
const RB_TARGET = 0.75; // accuracy we steer the player toward
const RB_GAIN_UP = 0.06; // heat added per resolve when at/above target
const RB_GAIN_DOWN = 0.12; // heat removed per resolve when below — backs off 2x faster

const ZONE_LABELS = ['TOP LEFT', 'TOP RIGHT', 'BOTTOM LEFT', 'BOTTOM RIGHT'];
const HALF_ZONES: Record<HalfSide, number[]> = { left: [0, 2], right: [1, 3], top: [0, 1] };
const HALF_BANNERS: Record<HalfSide, string> = {
  left: 'BIG DODGE — CLEAR THE LEFT SIDE',
  right: 'BIG DODGE — CLEAR THE RIGHT SIDE',
  top: 'DUCK — GET UNDER THE TOP HALF',
};

// ---- Pacing: progress through the round (0→1) + level + heat ----
// Playtest 2026-08-10/13 lineage: the old per-round ramp got fast too soon.
// Now the ramp is eased over the WHOLE round so the last minute is the hard
// one. Level 1 opens at ~2.0s windows and ends ~1.4s; level 10 opens ~1.6s
// and ends ~1.0s. On top of that, `heat` (0..1 rolling-accuracy rubber-band)
// scales the window: heat 0 is ~15% easier than the base, heat 1 ~20% faster.
// Module-scope so the HUD Speed tile shows the exact number used.
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIn = (t: number) => t * t;
const levelT = (level: number) => (Math.min(10, Math.max(1, level)) - 1) / 9;
function startWindow(level: number) { return lerp(2000, 1600, levelT(level)); }
function endWindow(level: number) { return lerp(1400, 1000, levelT(level)); }
function windowMs(p: number, level: number, heat: number) {
  const base = lerp(startWindow(level), endWindow(level), easeIn(clamp01(p)));
  return Math.round(base * (1.15 - 0.35 * heat));
}
// Power punches are the fast ones — a bit over half the normal window.
function powerWindowMs(p: number, level: number, heat: number) {
  return Math.max(700, Math.round(windowMs(p, level, heat) * 0.55));
}
// Incoming punches you have to dodge come in HOT — you react, you don't aim.
function dodgeWindowMs(p: number, level: number, heat: number) {
  return Math.max(800, Math.round(windowMs(p, level, heat) * 0.7));
}
// How many commands can be live at once — the chaos dial. One at a time for
// the first half; two after; three only when you've EARNED it (high heat).
function maxConcurrent(p: number, level: number, heat: number) {
  if (p < 0.5) return 1;
  if (heat > 0.7 && level >= 3) return 3;
  return 2;
}

const WIN_LINES = [
  'Clean.', 'That one had hips behind it.', 'The quadrant never saw it coming.',
  'Crisp. Do it again.', 'You fight like a rook. Straight lines. No mercy.',
];
const MISS_LINES = [
  'The quadrant wins that exchange.', 'Too slow. It happens. Once.',
  'Shake it out. Reset.', 'That square is feeling very smug right now.',
];
const BELL_LINES = [
  'That is the bell. Every one of those punches counts.',
  'Bell. Hands down. I am proud of you and I am not being subtle about it.',
];

const fmtClock = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export default function QuadrantFight({
  onClose,
  compact = false,
  durationMs = DEFAULT_DURATION_MS,
  level = 1,
  onFinish,
  onStats,
}: {
  /** Rendered as a small "Turn off" control when provided (embedded surfaces). */
  onClose?: () => void;
  /** Embedded mode: dark self-contained card, evidence gallery trimmed. */
  compact?: boolean;
  /** Round length. The clock starts at MOUNT (the parent's bell and ours agree). */
  durationMs?: number;
  /** Rookie fight level 1–10 → base tempo. */
  level?: number;
  /** Fires exactly once — at the bell (or from unmount cleanup if the parent's bell rang first). */
  onFinish?: (stats: FightStats) => void;
  /** Live stats, throttled to ~1/s while playing. */
  onStats?: (stats: FightStats) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  // Generation counter: a boot superseded mid-await (StrictMode double-mount,
  // fast toggle) bails instead of driving a dead component.
  const genRef = useRef(0);
  const onFinishRef = useRef(onFinish);
  const onStatsRef = useRef(onStats);
  useEffect(() => { onFinishRef.current = onFinish; }, [onFinish]);
  useEffect(() => { onStatsRef.current = onStats; }, [onStats]);

  const [phase, setPhase] = useState<Phase>('boot');
  const [bootMsg, setBootMsg] = useState('Starting camera…');
  const [bootMs, setBootMs] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMs);
  const [progress, setProgress] = useState(0);
  const [heatUI, setHeatUI] = useState(0);
  // The live counter above the camera — the score IS these counts.
  const [counts, setCounts] = useState({ landed: 0, missed: 0, dodged: 0, taken: 0 });
  const [streak, setStreak] = useState(0);
  const [banner, setBanner] = useState('');
  const [quip, setQuip] = useState('');
  const [missShots, setMissShots] = useState<{ url: string; label: string }[]>([]);
  const [finalStats, setFinalStats] = useState<FightStats | null>(null);

  // Mutable game state lives in a ref so the rAF loop never sees stale closures.
  const game = useRef({
    phase: 'boot' as Phase,
    detector: null as PoseDetector | null,
    commands: [] as Command[], // several can be live at once — the chaos
    flashes: [] as Flash[],
    nextSpawnAt: 0,
    staggerUntil: 0, // power punch landed: opponent staggered — slow windows, your flurry
    playerStaggerUntil: 0, // you just got hit — you're rocked: he pours on attacks to dodge
    score: 0,
    level,
    durationMs,
    clockStart: 0, // the round clock — set at mount, reset by "Run it back"
    heat: 0, // rubber-band difficulty scalar 0..1 (rolling accuracy)
    results: [] as boolean[], // last RB_WINDOW resolve outcomes
    hitFlashUntil: 0, // red vignette when you get caught
    streak: 0,
    stats: emptyFightStats(durationMs),
    finished: false, // onFinish fired
    lastStatsAt: 0,
    lastTickSec: -1,
  });
  useEffect(() => { game.current.level = level; }, [level]);

  // Boot + game loop. Runs once per mount: `durationMs` is read at mount (the
  // clock starts here) — parents remount (key) to change the round length.
  useEffect(() => {
    const gen = ++genRef.current;
    const g = game.current;
    g.clockStart = performance.now();
    g.durationMs = durationMs;
    g.stats = emptyFightStats(durationMs);
    g.finished = false;

    const snapshot = (): FightStats => ({
      ...g.stats,
      score: g.score,
      durationMs: Math.min(g.durationMs, Math.round(performance.now() - g.clockStart)),
    });

    // The bell. Freezes the board, fires onFinish ONCE, shows the card.
    function finish() {
      if (g.finished) return;
      g.finished = true;
      g.commands = [];
      g.phase = 'done';
      const s = snapshot();
      s.durationMs = g.durationMs;
      setFinalStats(s);
      setPhase('done');
      setBanner('');
      setQuip(BELL_LINES[Math.floor(Math.random() * BELL_LINES.length)]);
      setTimeLeft(0);
      onFinishRef.current?.(s);
    }

    async function boot() {
      try {
        performance.mark('qf-boot-start');
        // Model first so the download/warm-up overlaps the camera permission
        // prompt; awaited after the camera is up. Memoized per tab — round 2+
        // resolves instantly.
        const det = getMoveNet();
        det.catch(() => {}); // observed at the await below

        setBootMsg('Starting camera…');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (gen !== genRef.current) { stream.getTracks().forEach((t) => t.stop()); return; }
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();
        performance.mark('qf-boot-camera');

        setBootMsg('Almost ready…');
        g.detector = await det;
        if (gen !== genRef.current) return;
        performance.mark('qf-boot-model');

        const ms = (a: string, b: string) => Math.round(performance.measure(`${a}->${b}`, a, b).duration);
        const camMs = ms('qf-boot-start', 'qf-boot-camera');
        const modelMs = ms('qf-boot-camera', 'qf-boot-model');
        const total = ms('qf-boot-start', 'qf-boot-model');
        console.info(`[qf-boot] camera ${camMs}ms model ${modelMs}ms total ${total}ms`);
        setBootMs(total);

        g.phase = 'ready';
        setPhase('ready');
        loop();
      } catch (err: unknown) {
        console.error('[quadrant-fight]', err);
        setBootMsg(err instanceof Error ? err.message : 'Something broke while booting');
        setPhase('error');
      }
    }

    function zoneRect(zone: number, w: number, h: number) {
      const col = zone % COLS;
      const row = Math.floor(zone / COLS);
      return { x: (col * w) / COLS, y: (row * h) / ROWS, w: w / COLS, h: h / ROWS };
    }

    function inZone(x: number, y: number, zone: number, w: number, h: number) {
      const r = zoneRect(zone, w, h);
      return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
    }

    const GAP_MS = 850; // rest beat once the board clears
    // The dodge is judged ONLY at impact: the rising fill is the punch coming
    // in, and full color is when it LANDS. Being in the zone mid-window is
    // fine — you just have to be out for the final stretch.
    const IMPACT_MS = 300;

    const progressAt = (now: number) => clamp01((now - g.clockStart) / g.durationMs);

    // Zones already claimed by live commands — new commands never overlap them.
    function usedZones(): Set<number> {
      const s = new Set<number>();
      for (const c of g.commands) {
        if (c.kind === 'punch' || c.kind === 'power' || c.kind === 'dodge') s.add(c.zone);
        else if (c.kind === 'double') { s.add(c.zoneA); s.add(c.zoneB); }
        else if (c.kind === 'combo') { s.add(c.punchZone); s.add(c.dodgeZone); }
        else if (c.kind === 'halfdodge') HALF_ZONES[c.side].forEach((z) => s.add(z));
      }
      return s;
    }

    // Returns true if a command was spawned.
    function issueCommand(now: number): boolean {
      const used = usedZones();
      const free = [0, 1, 2, 3].filter((z) => !used.has(z));
      if (free.length === 0) return false;
      const pick = (arr: number[]) => arr[Math.floor(Math.random() * arr.length)];

      const p = progressAt(now);
      // A staggered opponent means slower incoming windows — breathing room.
      const stag = now < g.staggerUntil ? 1.35 : 1;
      const win = Math.round(windowMs(p, g.level, g.heat) * stag);
      const dwin = Math.round(dodgeWindowMs(p, g.level, g.heat) * stag);
      const deadline = now + win;

      const oppStag = now < g.staggerUntil;
      const youStag = now < g.playerStaggerUntil;

      // Only ONE evasion (dodge/halfdodge/combo) at a time — always. Two
      // dodge directions at once was the "everything is a block" spiral.
      const evasionCount = g.commands.filter((c) => c.kind === 'dodge' || c.kind === 'halfdodge' || c.kind === 'combo').length;

      // Weighted pool — punch-majority always; new moves unlock by PROGRESS
      // through the round so each gets time to breathe: power at 15%, half
      // dodges at 30%, doubles at 50%, combos at 70% (never at level 1–2).
      const pool: Command['kind'][] = ['punch', 'punch', 'punch', 'dodge'];
      if (p >= 0.15) pool.push('power');
      if (p >= 0.3) pool.push('halfdodge');
      if (p >= 0.5) pool.push('double', 'punch');
      if (p >= 0.7 && g.level >= 3) pool.push('combo');
      // Opponent staggered = YOUR flurry: pure offense (no power — one stagger
      // per power punch, no chaining). You rocked = a touch more to dodge, not
      // a wall of it.
      let mix = pool;
      if (oppStag) mix = pool.filter((k) => k === 'punch' || k === 'double');
      else if (youStag) mix = [...pool, 'dodge'];
      if (evasionCount >= 1) mix = mix.filter((k) => k === 'punch' || k === 'power' || k === 'double');
      // Feasibility: multi-zone commands need the space.
      const freeSides = (['left', 'right', 'top'] as HalfSide[]).filter((s) => HALF_ZONES[s].every((z) => free.includes(z)));
      mix = mix.filter((k) => {
        if (k === 'double' || k === 'combo') return free.length >= 2;
        if (k === 'halfdodge') return freeSides.length > 0;
        return true;
      });
      if (mix.length === 0) return false;
      const kind = mix[Math.floor(Math.random() * mix.length)];
      const zone = pick(free);

      if (kind === 'power') {
        const pw = Math.round(powerWindowMs(p, g.level, g.heat) * stag);
        g.commands.push({ kind: 'power', zone, deadline: now + pw, winMs: pw, t: newTrack() });
        setBanner(`POWER PUNCH ${ZONE_LABELS[zone]} — NOW!`);
      } else if (kind === 'double') {
        const zoneB = pick(free.filter((z) => z !== zone));
        g.commands.push({ kind: 'double', zoneA: zone, zoneB, deadline, winMs: win, tA: newTrack(), tB: newTrack() });
        setBanner(`DOUBLE — BOTH HANDS: ${ZONE_LABELS[zone]} + ${ZONE_LABELS[zoneB]}`);
      } else if (kind === 'halfdodge') {
        const side = freeSides[Math.floor(Math.random() * freeSides.length)];
        g.commands.push({ kind: 'halfdodge', side, deadline: now + dwin, winMs: dwin, inFrames: 0 });
        setBanner(HALF_BANNERS[side]);
      } else if (kind === 'combo') {
        const dodgeZone = pick(free.filter((z) => z !== zone));
        g.commands.push({ kind: 'combo', punchZone: zone, dodgeZone, deadline, winMs: win, t: newTrack(), punchDone: false, inFrames: 0 });
        setBanner(`PUNCH ${ZONE_LABELS[zone]} — HEAD OUT OF ${ZONE_LABELS[dodgeZone]}`);
      } else if (kind === 'dodge') {
        g.commands.push({ kind: 'dodge', zone, deadline: now + dwin, winMs: dwin, inFrames: 0 });
        setBanner(`DODGE — head out of ${ZONE_LABELS[zone]}`);
      } else {
        g.commands.push({ kind: 'punch', zone, deadline, winMs: win, t: newTrack() });
        setBanner(`PUNCH ${ZONE_LABELS[zone]}`);
      }
      return true;
    }

    // Snapshot the current canvas with the offending zone circled — the
    // "caught on camera" evidence shot shown after a miss.
    function captureEvidence(zone: number, label: string) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = canvas.width, h = canvas.height;
      const snap = document.createElement('canvas');
      snap.width = w; snap.height = h;
      const sctx = snap.getContext('2d')!;
      sctx.drawImage(canvas, 0, 0);
      const col = zone % COLS, row = Math.floor(zone / COLS);
      const rx = (col * w) / COLS, ry = (row * h) / ROWS;
      sctx.fillStyle = 'rgba(239,68,68,0.3)';
      sctx.fillRect(rx, ry, w / COLS, h / ROWS);
      sctx.strokeStyle = '#ef4444';
      sctx.lineWidth = 6;
      sctx.strokeRect(rx + 3, ry + 3, w / COLS - 6, h / ROWS - 6);
      sctx.fillStyle = '#fff';
      sctx.font = `bold ${Math.round(h / 16)}px sans-serif`;
      sctx.textAlign = 'center';
      sctx.fillText(label, w / 2, h - h / 20);
      setMissShots((prev) => [{ url: snap.toDataURL('image/jpeg', 0.7), label }, ...prev].slice(0, 6));
    }

    // The single bookkeeper: every command resolves here — stat counters, the
    // rolling-accuracy rubber-band, and the derived score (= clean actions).
    // flashZones: every zone that gets a result mark.
    function resolveCmd(cmd: Command, ok: boolean, flashZones: number[]) {
      const now = performance.now();
      const st = g.stats;
      g.commands = g.commands.filter((c) => c !== cmd);
      for (const z of flashZones) g.flashes.push({ zone: z, ok, until: now + 550 });
      // Empty board = rest beat — unless a flurry is on, then keep it coming.
      const restMs = now < g.staggerUntil ? 350 : GAP_MS;
      if (g.commands.length === 0) g.nextSpawnAt = Math.max(g.nextSpawnAt, now + restMs);

      // Rubber-band: fold this result into the rolling window, then steer heat.
      g.results.push(ok);
      if (g.results.length > RB_WINDOW) g.results.shift();
      if (g.results.length >= RB_MIN_SAMPLES) {
        const acc = g.results.filter(Boolean).length / g.results.length;
        g.heat = Math.min(1, Math.max(0, g.heat + (acc >= RB_TARGET ? RB_GAIN_UP : -RB_GAIN_DOWN)));
      }

      if (ok) {
        g.streak += 1;
        st.bestStreak = Math.max(st.bestStreak, g.streak);
        const isEvasion = cmd.kind === 'dodge' || cmd.kind === 'halfdodge';
        if (isEvasion) st.dodgesMade += 1;
        if (cmd.kind === 'combo') st.dodgesMade += 1; // you survived the dodge half too
        if (!isEvasion) {
          st.punchesLanded += 1;
          if (cmd.kind === 'power') st.powerLanded += 1;
          if (cmd.kind === 'double') st.doublesLanded += 1;
          if (cmd.kind === 'combo') st.combosLanded += 1;
        }
        if (cmd.kind === 'power') {
          g.staggerUntil = now + 6000;
          setQuip('POWER PUNCH. He is seeing three of you and they are all winning.');
        } else {
          setQuip(WIN_LINES[Math.floor(Math.random() * WIN_LINES.length)]);
        }
      } else {
        const isWhiff = cmd.kind === 'punch' || cmd.kind === 'power' || cmd.kind === 'double' ||
          (cmd.kind === 'combo' && !cmd.punchDone && flashZones[0] === cmd.punchZone);
        const label = isWhiff ? 'TOO SLOW' : 'CAUGHT IN THE ZONE';
        captureEvidence(flashZones[0], label);
        g.streak = 0;
        if (isWhiff) st.punchesMissed += 1; else st.hitsTaken += 1;
        g.hitFlashUntil = now + 350;
        // Rocked ONLY when his punch actually lands (caught in a zone) — a
        // whiffed punch shouldn't trigger the barrage, and it's brief. This
        // killed the "everything is a block and it never stops" spiral.
        if (!isWhiff) g.playerStaggerUntil = now + 2500;
        setQuip(MISS_LINES[Math.floor(Math.random() * MISS_LINES.length)]);
        setBanner(label);
      }
      // The score IS the counts: total clean actions this round.
      g.score = st.punchesLanded + st.dodgesMade;
      setScore(g.score);
      setStreak(g.streak);
      setCounts({ landed: st.punchesLanded, missed: st.punchesMissed, dodged: st.dodgesMade, taken: st.hitsTaken });
    }

    let lastVideoTime = -1;
    let lastWrists: { x: number; y: number; side: Side }[] = [];
    let lastHead: { x: number; y: number }[] = [];

    async function loop() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || gen !== genRef.current) return;

      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;
      if (canvas.width !== w) { canvas.width = w; canvas.height = h; }
      const ctx = canvas.getContext('2d')!;

      // Mirror everything so it behaves like a mirror.
      ctx.save();
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, w, h);
      ctx.restore();

      // Only run inference on a NEW camera frame — rAF outpaces the camera,
      // and re-inferring the same frame is pure wasted GPU.
      if (g.detector && video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        try {
          const poses = await g.detector.estimatePoses(video);
          const wr: typeof lastWrists = [];
          const hd: typeof lastHead = [];
          const kps = poses?.[0]?.keypoints ?? [];
          for (const kp of kps) {
            if ((kp.score ?? 0) < CONFIDENCE) continue;
            const p = { x: w - kp.x, y: kp.y }; // mirror keypoints to match the flipped frame
            if (kp.name === 'left_wrist') wr.push({ ...p, side: 'L' });
            if (kp.name === 'right_wrist') wr.push({ ...p, side: 'R' });
            if (kp.name === 'nose' || kp.name === 'left_eye' || kp.name === 'right_eye') hd.push(p);
          }
          lastWrists = wr;
          lastHead = hd;
        } catch { /* dropped frame — state-based logic tolerates it */ }
      }
      const wrists = lastWrists;
      const head = lastHead;

      const now = performance.now();
      const zoneOfPoint = (p: { x: number; y: number }) =>
        (p.x >= w / 2 ? 1 : 0) + (p.y >= h / 2 ? 2 : 0);

      // ---- The clock: ticks from mount; the bell ends everything. ----
      const remaining = g.clockStart + g.durationMs - now;
      const sec = Math.max(0, Math.ceil(remaining / 1000));
      if (sec !== g.lastTickSec) {
        g.lastTickSec = sec;
        setTimeLeft(Math.max(0, remaining));
        setProgress(progressAt(now));
        setHeatUI(g.heat);
      }
      if (remaining <= 0 && (g.phase === 'playing' || g.phase === 'ready')) finish();
      if (g.phase === 'playing' && now - g.lastStatsAt >= 1000) {
        g.lastStatsAt = now;
        onStatsRef.current?.(snapshot());
      }

      // Arm-then-enter punch tracking, judged PER WRIST. Each hand arms after 2
      // frames where THAT hand is detected and clear of the zone (losing
      // tracking is not "hand clear" — that was the early-count bug), then
      // lands by entering. Either hand can score, so a guard hand resting in a
      // bottom quadrant no longer blocks the other hand's punch.
      const trackPunch = (t: Track, zone: number): boolean => {
        if (t.done) return false;
        for (const p of wrists) {
          const a = t[p.side];
          const isIn = inZone(p.x, p.y, zone, w, h);
          if (!a.armed) {
            if (!isIn) {
              a.clear += 1;
              if (a.clear >= 2) a.armed = true;
            } else {
              a.clear = 0;
            }
            continue;
          }
          if (isIn) {
            a.hold += 1;
            if (a.hold >= PUNCH_FRAMES) { t.done = true; return true; }
          } else {
            a.hold = 0;
          }
        }
        return false;
      };

      if (g.phase === 'playing') {
        // Spawner: overlapping commands from mid-round — a punch can arrive
        // while a dodge is still live, or before the last punch resolved.
        // Staggers turn up the density: opponent staggered = your flurry
        // (+1 slot, rapid spawns); you rocked = his flurry (faster spawns).
        const oppStag = now < g.staggerUntil;
        const youStag = now < g.playerStaggerUntil;
        const maxCmds = maxConcurrent(progressAt(now), g.level, g.heat) + (oppStag ? 1 : 0);
        if (now >= g.nextSpawnAt && g.commands.length < maxCmds) {
          if (issueCommand(now)) {
            // Heat also drives cadence: cool = roomy gaps, hot = relentless.
            const heatGap = lerp(1.25, 0.8, g.heat);
            g.nextSpawnAt = now + (oppStag ? 250 + Math.random() * 350 : youStag ? 450 + Math.random() * 500 : (550 + Math.random() * 700) * heatGap);
          }
        }

        for (const cmd of [...g.commands]) {
          if (!g.commands.includes(cmd)) continue; // removed by an earlier resolve
          if (now > cmd.deadline) {
            // Time up: dodges succeed if you're out at impact; combo succeeds
            // if the punch landed AND you survived; punch/power/double fail.
            if (cmd.kind === 'dodge') resolveCmd(cmd, true, [cmd.zone]);
            else if (cmd.kind === 'halfdodge') resolveCmd(cmd, true, HALF_ZONES[cmd.side]);
            else if (cmd.kind === 'combo') resolveCmd(cmd, cmd.punchDone, [cmd.punchDone ? cmd.dodgeZone : cmd.punchZone]);
            else if (cmd.kind === 'double') resolveCmd(cmd, false, [cmd.tA.done ? cmd.zoneB : cmd.zoneA]);
            else resolveCmd(cmd, false, [cmd.zone]);
            continue;
          }

          // Dodges are judged ONLY inside the impact window (final IMPACT_MS)
          // — full color = the punch landing. 2 consecutive head-in frames
          // there = caught; before that you can stand anywhere.
          const inImpact = now >= cmd.deadline - IMPACT_MS;
          if ((cmd.kind === 'dodge' || cmd.kind === 'combo') && inImpact) {
            const dz = cmd.kind === 'dodge' ? cmd.zone : cmd.dodgeZone;
            if (head.some((p) => inZone(p.x, p.y, dz, w, h))) {
              cmd.inFrames += 1;
              if (cmd.inFrames >= 2) { resolveCmd(cmd, false, [dz]); continue; }
            } else {
              cmd.inFrames = 0;
            }
          }
          if (cmd.kind === 'halfdodge' && inImpact) {
            const caught = head.find((p) =>
              cmd.side === 'left' ? p.x < w / 2 : cmd.side === 'right' ? p.x >= w / 2 : p.y < h / 2,
            );
            if (caught) {
              cmd.inFrames += 1;
              if (cmd.inFrames >= 2) { resolveCmd(cmd, false, [zoneOfPoint(caught)]); continue; }
            } else {
              cmd.inFrames = 0;
            }
          }

          if (cmd.kind === 'punch' || cmd.kind === 'power') {
            if (trackPunch(cmd.t, cmd.zone)) resolveCmd(cmd, true, [cmd.zone]);
          } else if (cmd.kind === 'combo' && !cmd.punchDone) {
            if (trackPunch(cmd.t, cmd.punchZone)) {
              // Punch landed — but the dodge keeps running to the deadline.
              cmd.punchDone = true;
              g.flashes.push({ zone: cmd.punchZone, ok: true, until: now + 450 });
            }
          } else if (cmd.kind === 'double') {
            if (trackPunch(cmd.tA, cmd.zoneA)) g.flashes.push({ zone: cmd.zoneA, ok: true, until: now + 450 });
            if (trackPunch(cmd.tB, cmd.zoneB)) g.flashes.push({ zone: cmd.zoneB, ok: true, until: now + 450 });
            // Both landed: checkmarks on BOTH quads.
            if (cmd.tA.done && cmd.tB.done) resolveCmd(cmd, true, [cmd.zoneA, cmd.zoneB]);
          }
        }
      }

      // ---- Draw zones ----
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath();
      ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
      ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
      ctx.stroke();

      if (g.phase === 'playing') {
        for (const cmd of g.commands) {
          // Elapsed fraction: color RISES from the bottom of the zone as time
          // runs out — full color = impact.
          const remainingCmd = Math.max(0, cmd.deadline - now);
          const elapsed = Math.min(1, Math.max(0, 1 - remainingCmd / cmd.winMs));
          const secs = (remainingCmd / 1000).toFixed(1);
          const paint = (zone: number, rgb: string) => {
            const r = zoneRect(zone, w, h);
            ctx.fillStyle = `rgba(${rgb},0.18)`; // faint base so the target reads instantly
            ctx.fillRect(r.x, r.y, r.w, r.h);
            const fillH = r.h * elapsed;
            ctx.fillStyle = `rgba(${rgb},${0.25 + 0.35 * elapsed})`; // gets hotter as it climbs
            ctx.fillRect(r.x, r.y + r.h - fillH, r.w, fillH);
            ctx.strokeStyle = `rgba(${rgb},0.9)`;
            ctx.lineWidth = 4;
            ctx.strokeRect(r.x + 2, r.y + 2, r.w - 4, r.h - 4);
            // Per-zone countdown — with overlapping commands each zone keeps
            // its own clock.
            ctx.font = `bold ${Math.round(h / 14)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.lineWidth = Math.max(3, h / 140);
            ctx.strokeStyle = 'rgba(2,6,23,0.8)';
            ctx.strokeText(secs, r.x + r.w / 2, r.y + r.h * 0.28);
            ctx.fillStyle = remainingCmd < 500 ? '#f87171' : '#fff';
            ctx.fillText(secs, r.x + r.w / 2, r.y + r.h * 0.28);
          };
          if (cmd.kind === 'punch') paint(cmd.zone, '34,197,94');
          if (cmd.kind === 'power') paint(cmd.zone, '249,115,22');
          if (cmd.kind === 'dodge') paint(cmd.zone, '239,68,68');
          if (cmd.kind === 'halfdodge') for (const z of HALF_ZONES[cmd.side]) paint(z, '239,68,68');
          if (cmd.kind === 'double') {
            if (!cmd.tA.done) paint(cmd.zoneA, '34,197,94');
            if (!cmd.tB.done) paint(cmd.zoneB, '34,197,94');
          }
          if (cmd.kind === 'combo') {
            if (!cmd.punchDone) paint(cmd.punchZone, '34,197,94');
            paint(cmd.dodgeZone, '239,68,68');
          }
        }
      }

      // ---- Result flashes (checkmark / hit) ----
      g.flashes = g.flashes.filter((f) => now < f.until);
      for (const f of g.flashes) {
        const r = zoneRect(f.zone, w, h);
        if (f.ok) {
          // Checkmark, not a green slab — a filled square reads as "punch me".
          const cx = r.x + r.w / 2, cy = r.y + r.h / 2, s = Math.min(r.w, r.h) * 0.18;
          ctx.beginPath();
          ctx.arc(cx, cy, s * 1.9, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(cx - s, cy);
          ctx.lineTo(cx - s * 0.25, cy + s * 0.75);
          ctx.lineTo(cx + s, cy - s * 0.7);
          ctx.strokeStyle = '#16a34a';
          ctx.lineWidth = Math.max(4, s * 0.35);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        } else {
          ctx.fillStyle = 'rgba(239,68,68,0.55)';
          ctx.fillRect(r.x, r.y, r.w, r.h);
        }
      }

      // Stagger indicators — his wobble is your flurry; yours is his.
      if (g.phase === 'playing') {
        ctx.textAlign = 'center';
        if (now < g.staggerUntil) {
          ctx.font = `bold ${Math.round(h / 18)}px sans-serif`;
          ctx.fillStyle = '#facc15';
          ctx.fillText('STAGGERED — UNLOAD ON HIM', w / 2, h * 0.13);
        }
        if (now < g.playerStaggerUntil) {
          ctx.font = `bold ${Math.round(h / 20)}px sans-serif`;
          ctx.fillStyle = '#f87171';
          ctx.fillText('YOU ARE ROCKED — DEFEND', w / 2, h * 0.2);
        }
      }

      // Red vignette while a hit stings.
      if (now < g.hitFlashUntil) {
        const a = (g.hitFlashUntil - now) / 350;
        ctx.strokeStyle = `rgba(239,68,68,${0.8 * a})`;
        ctx.lineWidth = 18;
        ctx.strokeRect(9, 9, w - 18, h - 18);
      }

      // ---- Draw tracked points ----
      for (const p of wrists) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250,204,21,0.85)';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
      }
      if (head[0]) {
        ctx.beginPath();
        ctx.arc(head[0].x, head[0].y, 20, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(96,165,250,0.9)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    boot();
    return () => {
      genRef.current++;
      cancelAnimationFrame(rafRef.current);
      const v = videoRef.current;
      if (v?.srcObject) (v.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      // The parent's bell rang first (or the surface was torn down mid-round):
      // hand over whatever was counted so far, exactly once.
      if (!g.finished && (g.phase === 'playing' || g.phase === 'ready')) {
        g.finished = true;
        onFinishRef.current?.(snapshot());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startGame() {
    const g = game.current;
    const now = performance.now();
    g.score = 0; g.streak = 0;
    g.heat = 0; g.results = [];
    g.hitFlashUntil = 0; g.staggerUntil = 0; g.playerStaggerUntil = 0;
    g.commands = []; g.flashes = [];
    g.nextSpawnAt = now + 800;
    g.stats = emptyFightStats(g.durationMs);
    // "Run it back" (harness) restarts the clock; a first Fight keeps the
    // mount clock so our bell matches the parent's.
    if (g.phase === 'done') { g.clockStart = now; g.finished = false; g.lastTickSec = -1; }
    g.phase = 'playing';
    setScore(0); setStreak(0); setHeatUI(0);
    setCounts({ landed: 0, missed: 0, dodged: 0, taken: 0 });
    setFinalStats(null);
    setQuip(''); setMissShots([]); setBanner('Get ready…');
    setPhase('playing');
  }

  const clock = fmtClock(timeLeft);

  return (
    <div
      className={
        compact
          ? 'w-full rounded-2xl bg-slate-950 text-white p-3 flex flex-col gap-3 text-left'
          : 'flex flex-col gap-4'
      }
    >
      {/* The live counter — the score IS these counts. Sits above the camera. */}
      <div className="flex items-center justify-center gap-4 rounded-xl bg-slate-900 px-3 py-2 text-center">
        {[
          { label: 'LANDED', val: counts.landed, cls: 'text-green-400' },
          { label: 'MISS', val: counts.missed, cls: 'text-red-400' },
          { label: 'DODGED', val: counts.dodged, cls: 'text-green-400' },
          { label: 'HIT', val: counts.taken, cls: 'text-red-400' },
        ].map((c, i) => (
          <div key={c.label} className={`flex items-baseline gap-1.5 ${i === 2 ? 'border-l border-slate-700 pl-4' : ''}`}>
            <span className="text-[10px] uppercase tracking-wide text-slate-400">{c.label}</span>
            <span className={`text-lg font-bold tabular-nums ${c.cls}`}>{c.val}</span>
          </div>
        ))}
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-black">
        <video ref={videoRef} playsInline muted className="hidden" />
        <canvas ref={canvasRef} className="w-full block" />

        {phase === 'boot' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 min-h-40">
            <p className="text-slate-300 animate-pulse">{bootMsg}</p>
          </div>
        )}
        {phase === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 p-6 text-center min-h-40">
            <p className="text-red-400 text-sm">{bootMsg}<br />Camera permission + a non-Safari-private window usually fixes it.</p>
          </div>
        )}
        {phase === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/60">
            <button
              onClick={startGame}
              className="min-h-11 px-8 py-3 rounded-full bg-green-500 text-green-950 font-bold text-lg active:scale-95 transition-transform"
            >
              Fight
            </button>
            <p className="text-slate-300 text-sm text-center px-4">Stand back so your head + hands are in frame</p>
          </div>
        )}
        {phase === 'done' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/70 p-4">
            <p className="text-2xl font-bold tracking-wide">THE BELL</p>
            {finalStats && (
              <div className="grid grid-cols-4 gap-2 text-center w-full max-w-xs">
                {[
                  ['Landed', finalStats.punchesLanded],
                  ['Missed', finalStats.punchesMissed],
                  ['Dodged', finalStats.dodgesMade],
                  ['Hits taken', finalStats.hitsTaken],
                ].map(([label, val]) => (
                  <div key={label as string} className="rounded-xl bg-slate-900/90 py-2">
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
                    <div className="text-lg font-bold tabular-nums">{val}</div>
                  </div>
                ))}
              </div>
            )}
            {!onFinish && (
              <button
                onClick={startGame}
                className="min-h-11 px-8 py-3 rounded-full bg-green-500 text-green-950 font-bold text-lg active:scale-95 transition-transform"
              >
                Run it back
              </button>
            )}
          </div>
        )}
        {(phase === 'playing' || phase === 'ready') && (
          <div className="absolute top-2 right-2 rounded-full bg-slate-950/70 px-3 py-1 text-sm font-bold tabular-nums">
            {clock}
          </div>
        )}
        {phase === 'playing' && banner && (
          <div className="absolute top-2 left-2 right-16 text-center">
            <span className="inline-block rounded-full bg-slate-950/70 px-4 py-1.5 text-sm font-bold">{banner}</span>
          </div>
        )}
      </div>

      {/* Embedded surfaces skip the stat tiles + quip so the card fits a
          boxing round without scrolling — counter + canvas are the game. */}
      {!compact && (
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            ['Score', score],
            ['Time', clock],
            ['Speed', `${(windowMs(progress, level, heatUI) / 1000).toFixed(1)}s`],
            ['Streak', streak],
          ].map(([label, val]) => (
            <div key={label as string} className="rounded-xl bg-slate-900 py-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
              <div className="text-lg font-bold tabular-nums">{val || '—'}</div>
            </div>
          ))}
        </div>
      )}

      {!compact && bootMs !== null && (
        <p className="text-center text-[10px] text-slate-500 tabular-nums">boot {bootMs}ms · level {level}</p>
      )}

      {!compact && quip && <p className="text-center text-slate-300 text-sm italic">&ldquo;{quip}&rdquo;</p>}

      {!compact && missShots.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Evidence ({missShots.length} miss{missShots.length === 1 ? '' : 'es'})
          </p>
          {phase === 'done' ? (
            <div className="grid grid-cols-2 gap-2">
              {missShots.map((s, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={s.url} alt={s.label} className="rounded-xl w-full" />
              ))}
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={missShots[0].url} alt={missShots[0].label} className="rounded-xl w-full" />
          )}
        </div>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="self-center text-sm font-semibold text-slate-400 underline underline-offset-2 min-h-[44px] px-4"
        >
          Turn off Quadrant Fight
        </button>
      )}
    </div>
  );
}
