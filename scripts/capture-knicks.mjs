import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

// Knicks takeover cards: IG hype + LinkedIn dog-walk story.
mkdirSync('public/social', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 1500 },
  deviceScaleFactor: 2, // crisp retina export
  reducedMotion: 'reduce',
});

for (const [key, out] of [
  ['ig', 'public/social/knicks-takeover-ig.png'],
  ['li', 'public/social/knicks-dogwalk-li.png'],
]) {
  await page.goto(`http://localhost:3000/test/knicks-ig?raw=${key}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700); // let fonts settle
  await page.locator(`#card-${key}`).screenshot({ path: out });
  console.log(`Saved ${out} (1080x1350 @2x)`);
}

await browser.close();
