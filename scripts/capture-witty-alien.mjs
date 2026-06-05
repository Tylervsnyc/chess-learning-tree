import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT_DIR = 'public/social/witty-alien';
const OUT = `${OUT_DIR}/witty-alien-openings.png`;

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 1500 },
  deviceScaleFactor: 2, // crisp retina export
});
await page.goto('http://localhost:3000/test/witty-alien-ig?raw=1', {
  waitUntil: 'networkidle',
});
await page.waitForTimeout(600); // let fonts settle
// Screenshot the card element directly so app nav / page offsets don't interfere
await page.locator('#ig-card').screenshot({ path: OUT });
await browser.close();
console.log(`Saved ${OUT} (1080x1350 @2x)`);
