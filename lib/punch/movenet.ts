/**
 * Shared MoveNet SinglePose Lightning loader (client-only) for Quadrant Fight.
 * Mirrors lib/punch/landmarker.ts: tfjs + pose-detection come from npm (no
 * CDN on the boot path), the graph model is self-hosted in
 * public/models/movenet-lightning/ (scripts/copy-movenet.mjs), and the
 * detector is memoized per tab — boxing rounds 2+ skip the model load and
 * warm-up entirely (only the camera is re-acquired).
 */

import type { PoseDetector } from '@tensorflow-models/pose-detection';

const MODEL_URL = '/models/movenet-lightning/model.json';

async function build(): Promise<PoseDetector> {
  const [tf, pd] = await Promise.all([
    import('@tensorflow/tfjs'),
    import('@tensorflow-models/pose-detection'),
  ]);
  await tf.setBackend('webgl');
  await tf.ready();
  const detector = await pd.createDetector(pd.SupportedModels.MoveNet, {
    modelType: pd.movenet.modelType.SINGLEPOSE_LIGHTNING,
    modelUrl: MODEL_URL,
  });
  // One warm-up inference on a blank frame so the first real frame isn't the
  // one paying for shader compilation.
  const warm = document.createElement('canvas');
  warm.width = 192;
  warm.height = 192;
  await detector.estimatePoses(warm).catch(() => []);
  return detector;
}

let detectorPromise: Promise<PoseDetector> | null = null;

export function getMoveNet(): Promise<PoseDetector> {
  if (!detectorPromise) {
    detectorPromise = build().catch((e) => {
      detectorPromise = null; // allow retry after a failed load
      throw e;
    });
  }
  return detectorPromise;
}

/** Fire-and-forget preload — call on the prefight screen / round breaks. */
export function warmMoveNet(): void {
  getMoveNet().catch(() => {});
}
