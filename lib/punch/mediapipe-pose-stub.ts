/**
 * Stub for `@mediapipe/pose`, aliased in next.config.ts.
 *
 * @tensorflow-models/pose-detection statically imports `{ Pose }` from
 * `@mediapipe/pose` for its BlazePose-MediaPipe runtime. We only use MoveNet
 * (lib/punch/movenet.ts), and the real package is a global-injecting script
 * with no ES exports (Turbopack refuses to build it). This keeps the import
 * resolvable and the 50MB package out of node_modules. Never call this.
 */
export class Pose {
  constructor() {
    throw new Error('@mediapipe/pose is stubbed — Quadrant Fight uses MoveNet only');
  }
}
