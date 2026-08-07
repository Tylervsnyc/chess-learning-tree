'use client';

/**
 * QUADRANT FIGHT — the camera boxing mini-game, extracted verbatim from
 * /test/punch-zones (playtest-tuned; game logic/timing/judging FROZEN).
 *
 * Camera divided into quarters. Commands (several can run AT ONCE from round 3):
 *   PUNCH      — get a wrist into the lit quadrant before it fills
 *   POWER      — orange, fast, staggers the opponent
 *   DOUBLE     — both hands, one per lit quadrant
 *   DODGE      — head out of the red quadrant when it fills (impact window)
 *   HALF DODGE — clear a whole side (left/right) or DUCK under the top half
 *   COMBO      — punch while a dodge zone runs
 *
 * Pose model: MoveNet SinglePose Lightning via TF.js, loaded from CDN so the
 * app bundle is untouched (zero npm deps — deliberate). Scripts + camera only
 * load when this component MOUNTS, so embedding surfaces must gate the mount
 * behind the user's opt-in. Camera stream is stopped on unmount.
 *
 * PURE VISUAL LAYER: no API calls, no DB, no analytics, no streak/points.
 */

import { useEffect, useRef, useState } from 'react';

type Phase = 'boot' | 'ready' | 'playing' | 'gameover' | 'error';
type HalfSide = 'left' | 'right' | 'top';

// Per-punch tracking travels WITH the command so several can run at once.
type Track = { clear: number; armed: boolean; hold: number; done: boolean };
const newTrack = (): Track => ({ clear: 0, armed: false, hold: 0, done: false });

type Command =
  | { kind: 'punch'; zone: number; deadline: number; winMs: number; t: Track }
  | { kind: 'power'; zone: number; deadline: number; winMs: number; t: Track }
  | { kind: 'double'; zoneA: number; zoneB: number; deadline: number; winMs: number; tA: Track; tB: Track }
  | { kind: 'dodge'; zone: number; deadline: number; winMs: number; inFrames: number }
  | { kind: 'halfdodge'; side: HalfSide; deadline: number; winMs: number; inFrames: number }
  | { kind: 'combo'; punchZone: number; dodgeZone: number; deadline: number; winMs: number; t: Track; punchDone: boolean; inFrames: number };

type Flash = { zone: number; ok: boolean; blocked?: boolean; until: number };

const COLS = 2;
const ROWS = 2;
const CONFIDENCE = 0.3;
const PUNCH_FRAMES = 2; // consecutive frames a wrist must be in-zone
const HP_MAX = 100;
const DMG_CAUGHT = 15; // their punch landed (you got caught in a dodge zone)
const DMG_WHIFF = 8; // you whiffed a punch and ate the counter
const ROUND_HEAL = 30; // corner recovery between rounds

const ZONE_LABELS = ['TOP LEFT', 'TOP RIGHT', 'BOTTOM LEFT', 'BOTTOM RIGHT'];
const HALF_ZONES: Record<HalfSide, number[]> = { left: [0, 2], right: [1, 3], top: [0, 1] };
const HALF_BANNERS: Record<HalfSide, string> = {
  left: 'BIG DODGE — CLEAR THE LEFT SIDE',
  right: 'BIG DODGE — CLEAR THE RIGHT SIDE',
  top: 'DUCK — GET UNDER THE TOP HALF',
};

// Base window shrinks each round; then YOUR missing health speeds everything
// up further — take damage and the whole fight accelerates. Module-scope so
// the HUD Speed tile shows the exact number the game uses.
function windowMs(round: number, hp: number) {
  const base = Math.max(1100, 2100 - (round - 1) * 150);
  return Math.round(base * (0.6 + 0.4 * (hp / HP_MAX)));
}
// Power punches are the fast ones — a bit over half the normal window.
function powerWindowMs(round: number, hp: number) {
  return Math.max(750, Math.round(windowMs(round, hp) * 0.55));
}
// How many commands can be live at once — the chaos dial.
function maxConcurrent(round: number) {
  return round < 3 ? 1 : round < 6 ? 2 : 3;
}

const WIN_LINES = [
  'Clean.', 'That one had hips behind it.', 'The quadrant never saw it coming.',
  'Crisp. Do it again.', 'You fight like a rook. Straight lines. No mercy.',
];
const MISS_LINES = [
  'The quadrant wins that exchange.', 'Too slow. It happens. Once.',
  'Shake it out. Reset.', 'That square is feeling very smug right now.',
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export default function QuadrantFight({
  onClose,
  compact = false,
}: {
  /** Rendered as a small "Turn off" control when provided (embedded surfaces). */
  onClose?: () => void;
  /** Embedded mode: dark self-contained card, evidence gallery trimmed. */
  compact?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const [phase, setPhase] = useState<Phase>('boot');
  const [bootMsg, setBootMsg] = useState('Loading pose model…');
  const [score, setScore] = useState(0);
  const [, setLevel] = useState(1);
  const [playerHp, setPlayerHp] = useState(HP_MAX);
  const [oppHp, setOppHp] = useState(HP_MAX);
  const [round, setRound] = useState(1);
  // Damage chips: red −N on your bar = damage you TOOK; amber −N on his = damage you DEALT.
  const [youChip, setYouChip] = useState<{ amt: number; id: number } | null>(null);
  const [oppChip, setOppChip] = useState<{ amt: number; id: number } | null>(null);
  const [streak, setStreak] = useState(0);
  const [banner, setBanner] = useState('');
  const [quip, setQuip] = useState('');
  const [missShots, setMissShots] = useState<{ url: string; label: string }[]>([]);

  // Mutable game state lives in a ref so the rAF loop never sees stale closures.
  const game = useRef({
    phase: 'boot' as Phase,
    detector: null as any,
    commands: [] as Command[], // several can be live at once — the chaos
    flashes: [] as Flash[],
    nextSpawnAt: 0,
    staggerUntil: 0, // power punch landed: opponent staggered — slow windows, bonus damage, no blocks
    playerStaggerUntil: 0, // you just got hit — you're rocked: he pours on attacks to dodge
    score: 0,
    level: 1,
    playerHp: HP_MAX,
    oppHp: HP_MAX,
    round: 1,
    roundBreakUntil: 0, // corner break after a KO — no commands until this passes
    hitFlashUntil: 0, // red vignette when you take damage
    streak: 0,
  });

  useEffect(() => {
    let cancelled = false;
    const g = game.current;

    async function boot() {
      try {
        setBootMsg('Loading TensorFlow.js…');
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js');
        if (cancelled) return;

        setBootMsg('Starting camera…');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();

        setBootMsg('Warming up MoveNet…');
        const pd = (window as any).poseDetection;
        g.detector = await pd.createDetector(pd.SupportedModels.MoveNet, {
          modelType: pd.movenet.modelType.SINGLEPOSE_LIGHTNING,
        });
        if (cancelled) return;

        g.phase = 'ready';
        setPhase('ready');
        loop();
      } catch (err: any) {
        console.error('[quadrant-fight]', err);
        setBootMsg(err?.message ?? 'Something broke while booting');
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

    const GAP_MS = 1200; // rest beat once the board clears
    // The dodge is judged ONLY at impact: the rising fill is the punch coming
    // in, and full color is when it LANDS. Being in the zone mid-window is
    // fine — you just have to be out for the final stretch.
    const IMPACT_MS = 300;

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
      const lvl = g.level;
      const used = usedZones();
      const free = [0, 1, 2, 3].filter((z) => !used.has(z));
      if (free.length === 0) return false;
      const pick = (arr: number[]) => arr[Math.floor(Math.random() * arr.length)];

      // A staggered opponent means slower incoming windows — breathing room.
      const stag = now < g.staggerUntil ? 1.35 : 1;
      const win = Math.round(windowMs(g.round, g.playerHp) * stag);
      const deadline = now + win;

      const oppStag = now < g.staggerUntil;
      const youStag = now < g.playerStaggerUntil;

      // Normally only ONE evasion (dodge/halfdodge/combo) at a time — you
      // can't slip two punches in two directions. But when YOU'RE rocked, he
      // pours it on: two evasions can run at once.
      const evasionCount = g.commands.filter((c) => c.kind === 'dodge' || c.kind === 'halfdodge' || c.kind === 'combo').length;
      const evasionCap = youStag ? 2 : 1;

      // Weighted pool — dodges from the start, defense density climbs with level.
      let pool: Command['kind'][] = ['punch', 'punch', 'punch', 'dodge'];
      if (lvl >= 2) pool.push('power', 'dodge', 'halfdodge');
      if (lvl >= 3) pool.push('double', 'dodge');
      if (lvl >= 4) pool.push('combo', 'halfdodge', 'double');
      // Opponent staggered = YOUR flurry: pure offense (no power — one stagger
      // per power punch, no chaining). You rocked = his flurry: defense-heavy.
      if (oppStag) pool = pool.filter((k) => k === 'punch' || k === 'double');
      else if (youStag) pool.push('dodge', 'dodge', 'halfdodge');
      if (evasionCount >= evasionCap) pool = pool.filter((k) => k === 'punch' || k === 'power' || k === 'double');
      // Feasibility: multi-zone commands need the space.
      const freeSides = (['left', 'right', 'top'] as HalfSide[]).filter((s) => HALF_ZONES[s].every((z) => free.includes(z)));
      pool = pool.filter((k) => {
        if (k === 'double' || k === 'combo') return free.length >= 2;
        if (k === 'halfdodge') return freeSides.length > 0;
        return true;
      });
      if (pool.length === 0) return false;
      const kind = pool[Math.floor(Math.random() * pool.length)];
      const zone = pick(free);

      if (kind === 'power') {
        const pw = Math.round(powerWindowMs(g.round, g.playerHp) * stag);
        g.commands.push({ kind: 'power', zone, deadline: now + pw, winMs: pw, t: newTrack() });
        setBanner(`POWER PUNCH ${ZONE_LABELS[zone]} — NOW!`);
      } else if (kind === 'double') {
        const zoneB = pick(free.filter((z) => z !== zone));
        g.commands.push({ kind: 'double', zoneA: zone, zoneB, deadline, winMs: win, tA: newTrack(), tB: newTrack() });
        setBanner(`DOUBLE — BOTH HANDS: ${ZONE_LABELS[zone]} + ${ZONE_LABELS[zoneB]}`);
      } else if (kind === 'halfdodge') {
        const side = freeSides[Math.floor(Math.random() * freeSides.length)];
        g.commands.push({ kind: 'halfdodge', side, deadline, winMs: win, inFrames: 0 });
        setBanner(HALF_BANNERS[side]);
      } else if (kind === 'combo') {
        const dodgeZone = pick(free.filter((z) => z !== zone));
        g.commands.push({ kind: 'combo', punchZone: zone, dodgeZone, deadline, winMs: win, t: newTrack(), punchDone: false, inFrames: 0 });
        setBanner(`PUNCH ${ZONE_LABELS[zone]} — HEAD OUT OF ${ZONE_LABELS[dodgeZone]}`);
      } else if (kind === 'dodge') {
        g.commands.push({ kind: 'dodge', zone, deadline, winMs: win, inFrames: 0 });
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

    let youTimer: ReturnType<typeof setTimeout>, oppTimer: ReturnType<typeof setTimeout>;
    function showDmg(target: 'you' | 'opp', amt: number) {
      const chip = { amt, id: performance.now() };
      if (target === 'you') {
        setYouChip(chip);
        clearTimeout(youTimer);
        youTimer = setTimeout(() => setYouChip(null), 900);
      } else {
        setOppChip(chip);
        clearTimeout(oppTimer);
        oppTimer = setTimeout(() => setOppChip(null), 900);
      }
    }

    // The single damage bookkeeper: all HP changes, round transitions, and
    // KO handling live here. flashZones: every zone that gets a result mark.
    function resolveCmd(cmd: Command, ok: boolean, flashZones: number[]) {
      const now = performance.now();
      g.commands = g.commands.filter((c) => c !== cmd);
      for (const z of flashZones) g.flashes.push({ zone: z, ok, until: now + 550 });
      // Empty board = rest beat — unless a flurry is on, then keep it coming.
      const restMs = now < g.staggerUntil ? 350 : GAP_MS;
      if (g.commands.length === 0) g.nextSpawnAt = Math.max(g.nextSpawnAt, now + restMs);

      if (ok) {
        g.streak += 1;
        const base = 10 * g.level + g.streak * 2;
        if (g.streak % 5 === 0) g.level += 1;
        const staggered = now < g.staggerUntil;
        // Damage dealt: punches hurt, doubles hurt more, power punches stagger.
        // Surviving a combo stings extra; a clean dodge deals nothing.
        let dmg = cmd.kind === 'power' ? 25 : cmd.kind === 'double' ? 20 + Math.min(5, g.streak) : 10 + Math.min(5, g.streak);
        if (cmd.kind === 'combo') dmg += 5;
        if (cmd.kind === 'dodge' || cmd.kind === 'halfdodge') dmg = 0;
        if (staggered) dmg = Math.round(dmg * 1.5);

        // Not every punch connects — he blocks ~1 in 5. Power punches always
        // land, and a staggered opponent can't block anything.
        const blockable = cmd.kind === 'punch' || cmd.kind === 'double' || cmd.kind === 'combo';
        const blocked = blockable && !staggered && Math.random() < 0.2;
        if (blocked) {
          g.flashes = g.flashes.filter((f) => !flashZones.includes(f.zone));
          for (const z of flashZones) g.flashes.push({ zone: z, ok: true, blocked: true, until: now + 550 });
          g.score += Math.round(base / 2);
          setQuip('Blocked. He is learning. That is concerning.');
        } else {
          g.score += cmd.kind === 'power' ? base * 3 : base;
          if (dmg > 0) {
            g.oppHp = Math.max(0, g.oppHp - dmg);
            showDmg('opp', dmg);
          }
          if (cmd.kind === 'power') {
            g.staggerUntil = now + 6000;
            setQuip('POWER PUNCH. He is seeing three of you and they are all winning.');
          } else {
            setQuip(WIN_LINES[Math.floor(Math.random() * WIN_LINES.length)]);
          }
        }
        if (g.oppHp <= 0) {
          // Round won: fresh opponent, faster base clock, corner heal.
          g.round += 1;
          g.oppHp = HP_MAX;
          g.staggerUntil = 0; // the new opponent walks in fresh
          g.playerHp = Math.min(HP_MAX, g.playerHp + ROUND_HEAL);
          g.score += 50 * g.round;
          g.commands = []; // wipe the board for the interstitial
          g.roundBreakUntil = now + 2200;
          g.nextSpawnAt = g.roundBreakUntil + 400;
          setBanner(`ROUND ${g.round} — faster now`);
          setQuip('Opponent down. The next one is quicker. I believe in you an alarming amount.');
        }
      } else {
        const isWhiff = cmd.kind === 'punch' || cmd.kind === 'power' || cmd.kind === 'double' ||
          (cmd.kind === 'combo' && !cmd.punchDone && flashZones[0] === cmd.punchZone);
        const label = isWhiff ? 'TOO SLOW' : 'CAUGHT IN THE ZONE';
        captureEvidence(flashZones[0], label);
        g.streak = 0;
        const dmg = isWhiff ? DMG_WHIFF : DMG_CAUGHT;
        g.playerHp = Math.max(0, g.playerHp - dmg);
        g.hitFlashUntil = now + 350;
        g.playerStaggerUntil = now + 4000; // rocked: brace for his follow-up barrage
        showDmg('you', dmg);
        setQuip(MISS_LINES[Math.floor(Math.random() * MISS_LINES.length)]);
        if (g.playerHp > 0) {
          setBanner(`${label} — took ${dmg} damage`);
        } else {
          g.commands = [];
          g.phase = 'gameover';
          setPhase('gameover');
          setBanner('');
        }
      }
      setScore(g.score);
      setLevel(g.level);
      setStreak(g.streak);
      setPlayerHp(g.playerHp);
      setOppHp(g.oppHp);
      setRound(g.round);
    }

    async function loop() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || cancelled) return;

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

      const wrists: { x: number; y: number }[] = [];
      const head: { x: number; y: number }[] = [];
      if (g.detector) {
        try {
          const poses = await g.detector.estimatePoses(video);
          const kps = poses?.[0]?.keypoints ?? [];
          for (const kp of kps) {
            if (kp.score < CONFIDENCE) continue;
            const p = { x: w - kp.x, y: kp.y }; // mirror keypoints to match the flipped frame
            if (kp.name === 'left_wrist' || kp.name === 'right_wrist') wrists.push(p);
            if (kp.name === 'nose' || kp.name === 'left_eye' || kp.name === 'right_eye') head.push(p);
          }
        } catch { /* dropped frame — state-based logic tolerates it */ }
      }

      const now = performance.now();
      const wristsDetected = wrists.length > 0;
      const zoneOfPoint = (p: { x: number; y: number }) =>
        (p.x >= w / 2 ? 1 : 0) + (p.y >= h / 2 ? 2 : 0);

      // Arm-then-enter punch tracking. Arms ONLY after 2 frames where wrists
      // are DETECTED and clear of the zone — losing tracking is not "hands
      // clear" (that was the early-count bug). Returns true when the punch lands.
      const trackPunch = (t: Track, zone: number): boolean => {
        if (t.done) return false;
        const isIn = wrists.some((p) => inZone(p.x, p.y, zone, w, h));
        if (!t.armed) {
          if (wristsDetected && !isIn) {
            t.clear += 1;
            if (t.clear >= 2) t.armed = true;
          } else {
            t.clear = 0;
          }
          return false;
        }
        if (isIn) {
          t.hold += 1;
          if (t.hold >= PUNCH_FRAMES) { t.done = true; return true; }
        } else {
          t.hold = 0;
        }
        return false;
      };

      if (g.phase === 'playing') {
        // Spawner: overlapping commands from round 3 — a punch can arrive
        // while a dodge is still live, or before the last punch resolved.
        // Staggers turn up the density: opponent staggered = your flurry
        // (+1 slot, rapid spawns); you rocked = his flurry (faster spawns).
        const oppStag = now < g.staggerUntil;
        const youStag = now < g.playerStaggerUntil;
        const maxCmds = maxConcurrent(g.round) + (oppStag ? 1 : 0);
        if (now >= g.roundBreakUntil && now >= g.nextSpawnAt && g.commands.length < maxCmds) {
          if (issueCommand(now)) {
            g.nextSpawnAt = now + (oppStag ? 250 + Math.random() * 350 : youStag ? 450 + Math.random() * 550 : 700 + Math.random() * 900);
          }
        }

        for (const cmd of [...g.commands]) {
          if (!g.commands.includes(cmd)) continue; // removed by an earlier resolve (KO/round)
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
          const remaining = Math.max(0, cmd.deadline - now);
          const elapsed = Math.min(1, Math.max(0, 1 - remaining / cmd.winMs));
          const secs = (remaining / 1000).toFixed(1);
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
            ctx.fillStyle = remaining < 500 ? '#f87171' : '#fff';
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

      // ---- Result flashes (checkmark / blocked / hit) ----
      g.flashes = g.flashes.filter((f) => now < f.until);
      for (const f of g.flashes) {
        const r = zoneRect(f.zone, w, h);
        if (f.ok && f.blocked) {
          // Blocked: blue disc with a bar — he caught that one on the gloves.
          const cx = r.x + r.w / 2, cy = r.y + r.h / 2, s = Math.min(r.w, r.h) * 0.18;
          ctx.beginPath();
          ctx.arc(cx, cy, s * 1.9, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(59,130,246,0.85)';
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(cx - s, cy);
          ctx.lineTo(cx + s, cy);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = Math.max(4, s * 0.35);
          ctx.lineCap = 'round';
          ctx.stroke();
        } else if (f.ok) {
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
      if (g.phase === 'playing' && now >= g.roundBreakUntil) {
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

      // Red vignette while a hit stings, then the round interstitial on top.
      if (now < g.hitFlashUntil) {
        const a = (g.hitFlashUntil - now) / 350;
        ctx.strokeStyle = `rgba(239,68,68,${0.8 * a})`;
        ctx.lineWidth = 18;
        ctx.strokeRect(9, 9, w - 18, h - 18);
      }
      if (g.phase === 'playing' && now < g.roundBreakUntil) {
        ctx.fillStyle = 'rgba(2,6,23,0.55)';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.round(h / 8)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`ROUND ${g.round}`, w / 2, h / 2);
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
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      const v = videoRef.current;
      if (v?.srcObject) (v.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startGame(hard = false) {
    const g = game.current;
    const startLevel = hard ? 10 : 1;
    const startRound = hard ? 3 : 1;
    g.score = 0; g.level = startLevel; g.streak = 0;
    g.playerHp = HP_MAX; g.oppHp = HP_MAX; g.round = startRound;
    g.roundBreakUntil = 0; g.hitFlashUntil = 0; g.staggerUntil = 0; g.playerStaggerUntil = 0;
    g.commands = []; g.flashes = [];
    g.nextSpawnAt = performance.now() + 1200;
    g.phase = 'playing';
    setScore(0); setLevel(startLevel); setStreak(0);
    setPlayerHp(HP_MAX); setOppHp(HP_MAX); setRound(startRound);
    setYouChip(null); setOppChip(null);
    setQuip(''); setMissShots([]); setBanner('Get ready…');
    setPhase('playing');
  }

  return (
    <div
      className={
        compact
          ? 'w-full rounded-2xl bg-slate-950 text-white p-3 flex flex-col gap-3 text-left'
          : 'flex flex-col gap-4'
      }
    >
      <div className="flex flex-col gap-2">
        {[
          { label: 'THE QUADFATHER', hp: oppHp, fill: 'bg-red-500', chip: oppChip, chipClass: 'text-amber-400' },
          { label: 'YOU', hp: playerHp, fill: 'bg-green-500', chip: youChip, chipClass: 'text-red-400' },
        ].map((b) => (
          <div key={b.label}>
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-slate-400">
              <span>{b.label}</span>
              <span className="font-bold text-slate-200">
                {b.chip && <span className={`mr-1.5 ${b.chipClass}`}>−{b.chip.amt}</span>}
                {b.hp} HP
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
              <div className={`h-full ${b.fill} transition-all duration-300`} style={{ width: `${b.hp}%` }} />
            </div>
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
        {(phase === 'ready' || phase === 'gameover') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/60">
            {phase === 'gameover' && (
              <div className="text-center">
                <p className="text-3xl font-bold">KO — Round {round}</p>
                <p className="text-slate-300">Final score: {score}</p>
              </div>
            )}
            <button
              onClick={() => startGame(false)}
              className="min-h-11 px-8 py-3 rounded-full bg-green-500 text-green-950 font-bold text-lg active:scale-95 transition-transform"
            >
              {phase === 'gameover' ? 'Run it back' : 'Fight'}
            </button>
            <button
              onClick={() => startGame(true)}
              className="min-h-11 px-6 py-2.5 rounded-full bg-orange-500 text-orange-950 font-bold active:scale-95 transition-transform"
            >
              Hard start — Rd 3 · Lvl 10
            </button>
            {phase === 'ready' && <p className="text-slate-300 text-sm text-center px-4">Stand back so your head + hands are in frame</p>}
          </div>
        )}
        {phase === 'playing' && banner && (
          <div className="absolute top-2 inset-x-2 text-center">
            <span className="inline-block rounded-full bg-slate-950/70 px-4 py-1.5 text-sm font-bold">{banner}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          ['Score', score],
          ['Round', round],
          ['Speed', `${(windowMs(round, playerHp) / 1000).toFixed(1)}s`],
          ['Streak', streak],
        ].map(([label, val]) => (
          <div key={label as string} className="rounded-xl bg-slate-900 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
            <div className="text-lg font-bold">{val || '—'}</div>
          </div>
        ))}
      </div>

      {quip && <p className="text-center text-slate-300 text-sm italic">&ldquo;{quip}&rdquo;</p>}

      {!compact && missShots.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Evidence ({missShots.length} miss{missShots.length === 1 ? '' : 'es'})
          </p>
          {phase === 'gameover' ? (
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
