/**
 * Punch detection — the ONE implementation, shared by the live camera tracker
 * (components/workout/PunchTracker) and the video grader (/test/punch-grader).
 *
 * Algorithm (v2, tuned against real footage 2026-07-13 — 32 ground-truth
 * punches, see data note below): a punch is a spike in WRIST SPEED measured
 * relative to the same-side shoulder in MediaPipe WORLD space (3D meters),
 * normalized by 3D shoulder width:
 *
 *   - speed crosses `speedT` shoulder-widths/sec  (slider-tunable, default 6)
 *   - while moving OUTWARD (radial velocity > MIN_RADIAL) — the return stroke
 *     of the same punch is inward and gets suppressed
 *   - per-hand refractory of REFRACTORY_S, re-armed once speed falls below
 *     speedT * HYSTERESIS
 *
 * Why not wrist-extension thresholds (v1): extension only sees straight
 * punches. On the field video v1 counted 15/32 — it missed hooks/compact
 * shots (bent elbow ≈ constant wrist-shoulder distance) and toward-camera
 * punches (monocular depth compresses them, right hand peaked at ext 1.36
 * under a 1.4 threshold). Speed-relative-to-shoulder sees all of them and
 * ignores body translation (bobbing/footwork). v2 counts 33/32 on the same
 * clip.
 *
 * Pass timestamps in SECONDS (wall clock live; video.currentTime when grading
 * a recording, so playback speed never distorts the physics).
 */

export const MIN_SCORE = 0.3;
/**
 * Default speed threshold (shoulder-widths/sec over the fixed lookback
 * window). The UI "sensitivity". Fit on three 2026-07-13 field clips with
 * human ground truth (32/24/29 punches): TH=4.25 + 0.10s cross-hand window
 * scores 30/25/25 at deterministic 30fps sampling — balanced slight
 * undercount on fast combos, never inflated.
 */
export const DEFAULT_SENSITIVITY = 4.25;
export const SENSITIVITY_MIN = 2.5;
export const SENSITIVITY_MAX = 6.5;
export const MIN_RADIAL = 1; // sw/s outward — gates out return strokes
export const REFRACTORY_S = 0.3; // min gap between counts on one hand
export const HYSTERESIS = 0.6; // re-arm once speed < speedT * this
export const MIN_SHOULDER_W = 0.05; // meters — degenerate-pose guard
/**
 * Cross-hand phantom suppression: a hard punch rotates the torso, which
 * whips the OTHER wrist relative to its shoulder and double-fires (seen on
 * field video: app counter jumped +2 on single punches). Fires are held
 * PENDING_S before emitting; if the other hand fires within the window, only
 * the one with the higher ABSOLUTE wrist speed survives (the phantom wrist
 * barely moves in world space — the shoulder moves under it).
 */
export const PENDING_S = 0.1;

// MediaPipe PoseLandmarker indices (33-point topology)
export const KP = { LS: 11, RS: 12, LE: 13, RE: 14, LW: 15, RW: 16 } as const;

export type Keypoint = { x: number; y: number; z?: number; vis: number };
export type PunchSide = 'left' | 'right';
export type PunchEvent = { side: PunchSide; t: number; ext: number; velocity: number };

type Vec3 = { x: number; y: number; z: number };
type Sample = { t: number; ext: number; rel: Vec3; wrist: Vec3 };

type HandState = {
  armed: boolean;
  lastFire: number;
  radial: number;
  speed: number;
  absSpeed: number;
  history: Sample[];
};

/**
 * Speeds are measured over a fixed ~120ms lookback window, NOT between
 * consecutive frames — consecutive-frame speeds scale with camera FPS
 * (undersampled spikes flatten), which made thresholds device-dependent.
 * With a fixed window the same punch reads the same at 15fps and 60fps.
 */
const LOOKBACK_S = 0.12;
const LOOKBACK_MIN_S = 0.05; // need at least this much span to trust a speed
const HISTORY_MAX_S = 0.4;

const dist3 = (a: Keypoint, b: Keypoint) =>
  Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0));

export function createPunchDetector(opts?: { refractoryS?: number; pendingS?: number }) {
  const refractoryS = opts?.refractoryS ?? REFRACTORY_S;
  const pendingS = opts?.pendingS ?? PENDING_S;
  const mkHand = (): HandState => ({
    armed: true,
    lastFire: -Infinity,
    radial: 0,
    speed: 0,
    absSpeed: 0,
    history: [],
  });
  const hands: Record<PunchSide, HandState> = { left: mkHand(), right: mkHand() };
  // fires held for PENDING_S so a stronger cross-hand fire can cancel a phantom
  let pending: { ev: PunchEvent; abs: number }[] = [];

  /**
   * Feed one frame of WORLD landmarks (meters). Returns punches fired this
   * frame plus live extension/speed/radial values (for debug + tracing).
   */
  function update(
    kps: Keypoint[],
    tSeconds: number,
    speedT: number = DEFAULT_SENSITIVITY,
  ): {
    events: PunchEvent[];
    ext: Record<PunchSide, number>;
    speed: Record<PunchSide, number>;
    radial: Record<PunchSide, number>;
    /** absolute wrist speed in world space (phantom check — see fire gate) */
    abs: Record<PunchSide, number>;
  } {
    const events: PunchEvent[] = [];
    const ext: Record<PunchSide, number> = { left: 0, right: 0 };
    const speed: Record<PunchSide, number> = { left: 0, right: 0 };
    const radial: Record<PunchSide, number> = { left: 0, right: 0 };
    const abs: Record<PunchSide, number> = { left: 0, right: 0 };

    const ok = (i: number) => (kps[i]?.vis ?? 0) > MIN_SCORE;
    const ls = kps[KP.LS], rs = kps[KP.RS];
    if (!ls || !rs || !ok(KP.LS) || !ok(KP.RS)) return { events, ext, speed, radial, abs };
    const shoulderW = dist3(ls, rs);
    if (shoulderW <= MIN_SHOULDER_W) return { events, ext, speed, radial, abs };

    const sides: { side: PunchSide; wrist: number; shoulder: number }[] = [
      { side: 'left', wrist: KP.LW, shoulder: KP.LS },
      { side: 'right', wrist: KP.RW, shoulder: KP.RS },
    ];
    for (const s of sides) {
      if (!ok(s.wrist)) continue;
      const w = kps[s.wrist], sh = kps[s.shoulder];
      const e = dist3(w, sh) / shoulderW;
      ext[s.side] = e;
      const hand = hands[s.side];
      // wrist position relative to the shoulder (removes body translation)
      const rel = { x: w.x - sh.x, y: w.y - sh.y, z: (w.z ?? 0) - (sh.z ?? 0) };
      const wpos = { x: w.x, y: w.y, z: w.z ?? 0 };

      // fixed-window speeds: measure against the sample nearest LOOKBACK_S ago
      hand.history = hand.history.filter((p) => tSeconds - p.t <= HISTORY_MAX_S);
      let ref: Sample | null = null;
      for (const p of hand.history) {
        const span = tSeconds - p.t;
        if (span < LOOKBACK_MIN_S) break; // history is time-ordered
        if (!ref || Math.abs(span - LOOKBACK_S) < Math.abs(tSeconds - ref.t - LOOKBACK_S)) ref = p;
      }
      if (ref) {
        const span = tSeconds - ref.t;
        hand.radial = (e - ref.ext) / span;
        hand.speed =
          Math.hypot(rel.x - ref.rel.x, rel.y - ref.rel.y, rel.z - ref.rel.z) / shoulderW / span;
        hand.absSpeed =
          Math.hypot(wpos.x - ref.wrist.x, wpos.y - ref.wrist.y, wpos.z - ref.wrist.z) /
          shoulderW /
          span;
      } else {
        hand.radial = 0;
        hand.speed = 0;
        hand.absSpeed = 0;
      }
      hand.history.push({ t: tSeconds, ext: e, rel, wrist: wpos });
      speed[s.side] = hand.speed;
      radial[s.side] = hand.radial;
      abs[s.side] = hand.absSpeed;

      if (
        hand.armed &&
        hand.speed > speedT &&
        hand.radial > MIN_RADIAL &&
        tSeconds - hand.lastFire > refractoryS
      ) {
        hand.armed = false;
        hand.lastFire = tSeconds;
        const ev: PunchEvent = { side: s.side, t: tSeconds, ext: e, velocity: hand.speed };
        // cross-hand phantom check: within PENDING_S only the higher
        // absolute-wrist-speed fire survives
        const rival = pending.find((p) => p.ev.side !== s.side);
        if (rival) {
          if (hand.absSpeed > rival.abs) {
            pending = pending.filter((p) => p !== rival);
            pending.push({ ev, abs: hand.absSpeed });
          }
          // else: this fire is the phantom — drop it
        } else {
          pending.push({ ev, abs: hand.absSpeed });
        }
      } else if (!hand.armed && hand.speed < speedT * HYSTERESIS) {
        hand.armed = true;
      }
    }
    // emit pending fires once they survive the suppression window
    for (const p of pending) {
      if (tSeconds - p.ev.t >= pendingS) events.push(p.ev);
    }
    pending = pending.filter((p) => tSeconds - p.ev.t < pendingS);
    return { events, ext, speed, radial, abs };
  }

  return { update };
}
