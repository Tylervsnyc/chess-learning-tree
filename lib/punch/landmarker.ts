/**
 * Shared MediaPipe PoseLandmarker loader (client-only). Model + WASM are
 * self-hosted in public/ (scripts/copy-mediapipe-wasm.mjs). Cached per tab —
 * the model is ~6MB, so live rounds 2+ and repeat gradings start instantly.
 */

import type { PoseLandmarker } from '@mediapipe/tasks-vision';

const WASM_PATH = '/mediapipe/wasm';
const MODEL_URL = '/models/pose_landmarker_lite.task';

async function build(): Promise<PoseLandmarker> {
  const { FilesetResolver, PoseLandmarker } = await import('@mediapipe/tasks-vision');
  const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);
  return PoseLandmarker.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
    runningMode: 'VIDEO',
    numPoses: 1,
  });
}

let landmarkerPromise: Promise<PoseLandmarker> | null = null;

export function getLandmarker(): Promise<PoseLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = build().catch((e) => {
      landmarkerPromise = null; // allow retry after a failed load
      throw e;
    });
  }
  return landmarkerPromise;
}

/**
 * Un-cached instance. The VIDEO-mode landmarker smooths poses using the
 * timestamps it is fed, and timestamps must increase monotonically per
 * instance — deterministic grading (video-time timestamps) needs its own
 * instance so it can't clash with a live wall-clock instance.
 */
export function createFreshLandmarker(): Promise<PoseLandmarker> {
  return build();
}
