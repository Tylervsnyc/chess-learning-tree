import { chromium } from 'playwright';

// Export the "How to begin with AI" scoresheet card (#card-3a) at true 1080x1350.
const OUT = 'linkedin-how-to-begin-with-ai.png';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1300, height: 1500 },
  deviceScaleFactor: 2, // crisp retina export
});
await page.goto('http://localhost:3007/test/linkedin-ai-post', { waitUntil: 'networkidle' });
await page.waitForTimeout(700); // let fonts + headshot settle

// The card renders inside a scale() wrapper — lift it out so it screenshots at full size.
await page.evaluate(() => {
  // strip the Next.js dev-tools badge so it can't land in the shot
  document.querySelectorAll('nextjs-portal, [data-nextjs-toast], #__next-build-watcher').forEach((el) => el.remove());
  const card = document.querySelector('#card-3a');
  card.style.position = 'fixed';
  card.style.top = '0';
  card.style.left = '0';
  card.style.zIndex = '9999';
  document.body.appendChild(card);
});
await page.setViewportSize({ width: 1080, height: 1350 });
await page.waitForTimeout(200);
await page.locator('#card-3a').screenshot({ path: OUT });
await browser.close();
console.log(`Saved ${OUT} (1080x1350 @2x)`);
