// Copies the MediaPipe tasks-vision WASM runtime from node_modules into
// public/ so the punch tracker loads it same-origin (no CDN dependency —
// IG webviews and CSP stay happy). public/mediapipe/ is gitignored; this
// runs via predev/prebuild so dev and Vercel builds always have it.
import { cpSync, mkdirSync } from 'node:fs';

mkdirSync('public/mediapipe/wasm', { recursive: true });
cpSync('node_modules/@mediapipe/tasks-vision/wasm', 'public/mediapipe/wasm', { recursive: true });
console.log('mediapipe wasm copied to public/mediapipe/wasm');
