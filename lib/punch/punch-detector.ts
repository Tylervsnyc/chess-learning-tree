/**
 * Punch detection state machine — the ONE implementation, shared by the live
 * camera tracker (components/workout/PunchTracker) and the video grader
 * (/test/punch-grader). A punch = wrist extension away from the same-side
 * shoulder crossing `extendT` shoulder-widths at >3 shoulder-widths/sec,
 * counted once until the hand retracts below RETRACT_T.
 *
 * Pure per-frame update: pass pixel-space keypoints + a timestamp in SECONDS
 * (wall clock live, video.currentTime when grading a recording — velocity is
 * then in the video's own time, so playback hiccups don't distort it).
 */

export const RETRACT_T = 1.12;
export const MIN_SCORE = 0.3;
export const DEFAULT_SENSITIVITY = 1.4;
export const MIN_VELOCITY = 3; // shoulder-widths per second

// MediaPipe PoseLandmarker indices (33-point topology)
export const KP = { LS: 11, RS: 12, LE: 13, RE: 14, LW: 15, RW: 16 } as const;

export type Keypoint = { x: number; y: number; vis: number };
export type PunchSide = 'left' | 'right';
export type PunchEvent = { side: PunchSide; t: number; ext: number; velocity: number };

type HandState = {
  phase: 'retracted' | 'extended';
  lastExt: number;
  lastTime: number;
  velocity: number;
};

export function createPunchDetector() {
  const hands: Record<PunchSide, HandState> = {
    left: { phase: 'retracted', lastExt: 0, lastTime: 0, velocity: 0 },
    right: { phase: 'retracted', lastExt: 0, lastTime: 0, velocity: 0 },
  };

  /**
   * Feed one frame of pixel-space keypoints. Returns punches fired this frame
   * plus the live extension values (for debug display).
   */
  function update(
    kps: Keypoint[],
    tSeconds: number,
    extendT: number = DEFAULT_SENSITIVITY,
  ): { events: PunchEvent[]; ext: Record<PunchSide, number> } {
    const events: PunchEvent[] = [];
    const ext: Record<PunchSide, number> = { left: 0, right: 0 };

    const ok = (i: number) => (kps[i]?.vis ?? 0) > MIN_SCORE;
    const ls = kps[KP.LS], rs = kps[KP.RS];
    if (!ls || !rs || !ok(KP.LS) || !ok(KP.RS)) return { events, ext };
    const shoulderW = Math.hypot(ls.x - rs.x, ls.y - rs.y);
    if (shoulderW <= 20) return { events, ext };

    const sides: { side: PunchSide; wrist: number; shoulder: number }[] = [
      { side: 'left', wrist: KP.LW, shoulder: KP.LS },
      { side: 'right', wrist: KP.RW, shoulder: KP.RS },
    ];
    for (const s of sides) {
      if (!ok(s.wrist)) continue;
      const w = kps[s.wrist], sh = kps[s.shoulder];
      const e = Math.hypot(w.x - sh.x, w.y - sh.y) / shoulderW;
      ext[s.side] = e;
      const hand = hands[s.side];
      const dt = tSeconds - hand.lastTime;
      if (dt > 0 && dt < 0.5) {
        hand.velocity = (e - hand.lastExt) / dt;
      }
      if (hand.phase === 'retracted' && e > extendT && hand.velocity > MIN_VELOCITY) {
        hand.phase = 'extended';
        events.push({ side: s.side, t: tSeconds, ext: e, velocity: hand.velocity });
      } else if (hand.phase === 'extended' && e < RETRACT_T) {
        hand.phase = 'retracted';
      }
      hand.lastExt = e;
      hand.lastTime = tSeconds;
    }
    return { events, ext };
  }

  return { update };
}
