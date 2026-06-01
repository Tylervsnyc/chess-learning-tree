/**
 * Capture app screenshots of the 3 live features for use in lifecycle emails.
 * Dev server must be running on :3000.
 *   npx tsx scripts/screenshot-features.ts
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const OUT = 'public/email';
const SHOTS = [
  { name: 'play', url: 'http://localhost:3000/play' },
  { name: 'tactics', url: 'http://localhost:3000/path' },
  { name: 'learn', url: 'http://localhost:3000/openings' },
];

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  // Mobile-ish portrait; capture the top of each page (the hero/board).
  const ctx = await browser.newContext({ viewport: { width: 420, height: 720 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  for (const s of SHOTS) {
    console.log(`Capturing ${s.name} <- ${s.url}`);
    await page.goto(s.url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2500); // let boards/animations settle
    await page.screenshot({ path: `${OUT}/${s.name}.png` });
    console.log(`  saved ${OUT}/${s.name}.png`);
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
