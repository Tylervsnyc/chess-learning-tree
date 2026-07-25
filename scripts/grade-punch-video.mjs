/**
 * Headless harness for /test/punch-grader: feed it a video file, get the
 * detector's punch report as JSON on stdout.
 *
 *   node scripts/grade-punch-video.mjs <video-path> [--sensitivity=1.4] [--base=http://localhost:3000]
 *
 * Notes: iPhone HEVC (.mov) may not decode in Chromium — transcode first:
 *   ffmpeg -i in.mov -c:v libx264 -pix_fmt yuv420p -an out.mp4
 */
import { chromium } from '@playwright/test';

const args = process.argv.slice(2);
const videoPath = args.find((a) => !a.startsWith('--'));
const sensitivity = args.find((a) => a.startsWith('--sensitivity='))?.split('=')[1];
const rate = args.find((a) => a.startsWith('--rate='))?.split('=')[1];
const step = args.find((a) => a.startsWith('--step='))?.split('=')[1];
const refrac = args.find((a) => a.startsWith('--refrac='))?.split('=')[1];
const win = args.find((a) => a.startsWith('--window='))?.split('=')[1];
const base = args.find((a) => a.startsWith('--base='))?.split('=')[1] ?? 'http://localhost:3000';
if (!videoPath) {
  console.error('usage: node scripts/grade-punch-video.mjs <video-path> [--sensitivity=1.4] [--base=URL]');
  process.exit(1);
}

const executablePath = process.env.PW_CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 480, height: 900 } });
page.on('pageerror', (e) => console.error('[pageerror]', e.message));

const qs = new URLSearchParams();
if (step) qs.set('step', step);
else if (rate) qs.set('rate', rate);
if (refrac) qs.set('refrac', refrac);
if (win) qs.set('window', win);
const query = qs.size ? `?${qs}` : '';
await page.goto(`${base}/test/punch-grader${query}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForSelector('[data-testid="video-input"]', { timeout: 60000 });
await page.setInputFiles('[data-testid="video-input"]', videoPath);

if (sensitivity) {
  await page.locator('input[type="range"]').fill(sensitivity);
}

await page.waitForSelector('[data-testid="grade-button"]:not([disabled])', { timeout: 30000 });
await page.click('[data-testid="grade-button"]');

// grading runs at 1x playback — allow video duration + model load headroom
await page.waitForSelector('[data-grade-done]', { timeout: 600000 });
const json = await page.locator('[data-testid="grade-json"]').textContent();
console.log(json);
await browser.close();
