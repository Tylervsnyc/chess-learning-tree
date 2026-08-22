import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await p.goto('http://localhost:3000/play?boxapp=1'); await p.waitForTimeout(2500);
await p.goto('http://localhost:3000/play?boxapp=1'); await p.waitForTimeout(4000);
await p.screenshot({ path: process.argv[2] || 'out.png' });
await b.close();
