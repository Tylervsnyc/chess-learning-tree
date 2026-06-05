import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

// Post 2 = "Showing up beats talent." (dark card + Rookie on fire)
const POST_ID = process.argv[2] || '2';
const OUT_DIR = 'public/social/streak';
const OUT = `${OUT_DIR}/streak-talent.png`;

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 1500 },
  deviceScaleFactor: 2, // crisp retina export
  reducedMotion: 'reduce', // hold a static lit flame frame for a clean capture
});
await page.goto(`http://localhost:3000/test/streak-ig?raw=${POST_ID}`, {
  waitUntil: 'networkidle',
});
await page.waitForTimeout(700); // let fonts + flame settle
await page.locator('#ig-card').screenshot({ path: OUT });
await browser.close();
console.log(`Saved ${OUT} (1080x1350 @2x)`);
