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
 * Default speed threshold (shoulder-widths/sec). The UI "sensitivity".
 * Tuned on the 2026-07-13 field clip: 31-34 detected vs 32 real punches at
 * 7.75-8 across runs (frame-sampling jitter moves counts a few percent).
 */
export const DEFAULT_SENSITIVITY = 7.75;
export const SENSITIVITY_MIN = 6;
export const SENSITIVITY_MAX = 10;
export const MIN_RADIAL = 1; // sw/s outward — gates out return strokes
export const REFRACTORY_S = 0.3; // min gap between counts on one hand
export const HYSTERESIS = 0.6; // re-arm once speed < speedT * this
export const MIN_SHOULDER_W = 0.05; // meters — degenerate-pose guard

// MediaPipe PoseLandmarker indices (33-point topology)
export const KP = { LS: 11, RS: 12, LE: 13, RE: 14, LW: 15, RW: 16 } as const;

export type Keypoint = { x: number; y: number; z?: number; vis: number };
export type PunchSide = 'left' | 'right';
export type PunchEvent = { side: PunchSide; t: number; ext: number; velocity: number };

type HandState = {
  armed: boolean;
  lastFire: number;
  lastExt: number;
  lastTime: number;
  radial: number;
  speed: number;
  lastRel: { x: number; y: number; z: number } | null;
};

const dist3 = (a: Keypoint, b: Keypoint) =>
  Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0));

export function createPunchDetector() {
  const mkHand = (): HandState => ({
    armed: true,
    lastFire: -Infinity,
    lastExt: 0,
    lastTime: 0,
    radial: 0,
    speed: 0,
    lastRel: null,
  });
  const hands: Record<PunchSide, HandState> = { left: mkHand(), right: mkHand() };

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
  } {
    const events: PunchEvent[] = [];
    const ext: Record<PunchSide, number> = { left: 0, right: 0 };
    const speed: Record<PunchSide, number> = { left: 0, right: 0 };
    const radial: Record<PunchSide, number> = { left: 0, right: 0 };

    const ok = (i: number) => (kps[i]?.vis ?? 0) > MIN_SCORE;
    const ls = kps[KP.LS], rs = kps[KP.RS];
    if (!ls || !rs || !ok(KP.LS) || !ok(KP.RS)) return { events, ext, speed, radial };
    const shoulderW = dist3(ls, rs);
    if (shoulderW <= MIN_SHOULDER_W) return { events, ext, speed, radial };

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
      const dt = tSeconds - hand.lastTime;
      // wrist position relative to the shoulder (removes body translation)
      const rel = { x: w.x - sh.x, y: w.y - sh.y, z: (w.z ?? 0) - (sh.z ?? 0) };
      if (dt > 0 && dt < 0.5) {
        hand.radial = (e - hand.lastExt) / dt;
        if (hand.lastRel) {
          hand.speed =
            Math.hypot(rel.x - hand.lastRel.x, rel.y - hand.lastRel.y, rel.z - hand.lastRel.z) /
            shoulderW /
            dt;
        }
      }
      speed[s.side] = hand.speed;
      radial[s.side] = hand.radial;

      if (
        hand.armed &&
        hand.speed > speedT &&
        hand.radial > MIN_RADIAL &&
        tSeconds - hand.lastFire > REFRACTORY_S
      ) {
        hand.armed = false;
        hand.lastFire = tSeconds;
        events.push({ side: s.side, t: tSeconds, ext: e, velocity: hand.speed });
      } else if (!hand.armed && hand.speed < speedT * HYSTERESIS) {
        hand.armed = true;
      }

      hand.lastExt = e;
      hand.lastTime = tSeconds;
      hand.lastRel = rel;
    }
    return { events, ext, speed, radial };
  }

  return { update };
}
