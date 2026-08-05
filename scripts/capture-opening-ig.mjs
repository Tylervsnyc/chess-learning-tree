import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

// Opening sparring card: learn an opening -> Rookie plays it with you.
const OUT = 'public/social/opening-sparring.png';
mkdirSync('public/social', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 1500 },
  deviceScaleFactor: 2, // crisp retina export
  reducedMotion: 'reduce',
});
await page.goto('http://localhost:3007/test/opening-ig?raw=1', { waitUntil: 'networkidle' });
await page.waitForTimeout(700); // let fonts settle
await page.locator('#card').screenshot({ path: OUT });
await browser.close();
console.log(`Saved ${OUT} (1080x1350 @2x)`);
