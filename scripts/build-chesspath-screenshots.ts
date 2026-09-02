/**
 * Build App Store screenshots for the Chess Path iOS app (the learning app,
 * not Chess Boxing).
 *
 * Unlike the boxing script (which composites raw phone grabs), this one
 * captures the already-built offline bundle in `capacitor-shell-chesspath/`
 * with Playwright, then composites each capture onto a branded canvas:
 * headline on top, the screen below at ~86% width, rounded + shadowed,
 * bleeding off the bottom edge.
 *
 *   iPhone 6.9"  1320x2868  = viewport 440x956  @ 3x
 *   iPad 13"     2064x2752  = viewport 1032x1376 @ 2x
 *
 * Prereqs: the bundle served statically (the script starts its own server):
 *   python3 -m http.server 4173 --directory capacitor-shell-chesspath
 * Playwright chromium: `npx playwright install chromium` if missing.
 *
 * Usage: npx tsx scripts/build-chesspath-screenshots.ts [--device=iphone|ipad]
 * Output: out/appstore-chesspath/{iphone,ipad}/NN-name.png
 */
import sharp from 'sharp';
import { chromium, devices, type Page } from 'playwright';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';

const ROOT = process.cwd();
const BUNDLE = join(ROOT, 'capacitor-shell-chesspath');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const OUT = join(ROOT, 'out', 'appstore-chesspath');

// Brand — Chess Path light theme (.claude/design-system.md).
const PAGE_BLUE = '#eef6fc';
const INK = '#101a33';
const MUTED = '#4a5878';
const GREEN = '#58cc02';

// DM Sans, self-hosted (public/fonts/dm-sans.woff2), embedded in the SVG so
// sharp/librsvg renders the same face the app uses.
const FONT_PATH = join(ROOT, 'public', 'fonts', 'dm-sans.woff2');
const FONT_DATA = existsSync(FONT_PATH) ? readFileSync(FONT_PATH).toString('base64') : null;

type Device = {
  key: 'iphone' | 'ipad';
  W: number;
  H: number;
  viewport: { width: number; height: number };
  scale: number;
  isMobile: boolean;
  userAgent: string;
  headlineSize: number;
  subSize: number;
  gutter: number;
  screenTop: number;
  radius: number;
};

const DEVICES: Device[] = [
  {
    key: 'iphone',
    W: 1320,
    H: 2868,
    viewport: { width: 440, height: 956 },
    scale: 3,
    isMobile: true,
    userAgent: devices['iPhone 15 Pro'].userAgent,
    headlineSize: 96,
    subSize: 42,
    gutter: 80,
    screenTop: 600,
    radius: 48,
  },
  {
    key: 'ipad',
    W: 2064,
    H: 2752,
    viewport: { width: 1032, height: 1376 },
    scale: 2,
    isMobile: false,
    userAgent: devices['iPad Pro 11'].userAgent,
    headlineSize: 120,
    subSize: 52,
    gutter: 120,
    screenTop: 700,
    radius: 56,
  },
];

type Shot = {
  out: string;
  route: string;
  headline: string;
  sub: string;
  /** Fraction of the capture height to crop off the top. Full-viewport captures have no status bar. */
  cropTop: number;
  /** Optional interaction after load (start a game, open a tab, skip an intro). */
  prep?: (page: Page) => Promise<void>;
};

/** Lesson used for the "learn by moving" shot. 1.2.1 = Back Rank Mate. */
const LESSON_ID = '1.2.1';

const SHOTS: Shot[] = [
  {
    out: '01-play',
    route: '/play/',
    headline: 'Play chess\nagainst Rookie.',
    sub: "She's on your side. She's a terrible loser.",
    cropTop: 0,
    prep: async (page) => {
      // Start a game so the board (not the pre-game picker) is on screen,
      // then play 1.e4 so Rookie answers and talks.
      await page.getByRole('button', { name: /let'?s play/i }).last().click();
      await page.waitForSelector('[data-square="e2"]', { timeout: 15000 });
      await page.waitForTimeout(1500);
      try {
        await page.locator('[data-square="e2"]').click();
        await page.waitForTimeout(300);
        await page.locator('[data-square="e4"]').click();
        await page.waitForTimeout(4500);
      } catch {
        /* board still shows; the move is a nice-to-have */
      }
    },
  },
  {
    out: '02-path',
    route: '/path/',
    headline: '446 lessons.\nOne path.',
    sub: 'From how the pieces move to real checkmates.',
    cropTop: 0,
  },
  {
    out: '03-lesson',
    // `from=onboarding` bypasses the unlock redirect for a fresh profile.
    route: `/lesson/${LESSON_ID}/?from=onboarding`,
    headline: 'Learn by moving,\nnot reading.',
    sub: 'Every lesson is a position you solve on the board.',
    cropTop: 0,
    prep: async (page) => {
      // Dismiss the theme intro card so the puzzle position is visible.
      const skip = page.getByRole('button', { name: /^skip$/i });
      if (await skip.count()) {
        await skip.first().click();
        await page.waitForTimeout(1500);
      }
    },
  },
  {
    out: '04-openings',
    route: '/openings/',
    headline: 'Real openings,\nreal moves.',
    sub: 'Every move is the top choice in the masters database.',
    cropTop: 0,
    prep: async (page) => {
      // A fresh profile has no openings; show the Library tab instead.
      await page.getByText('Library', { exact: true }).first().click();
      await page.waitForTimeout(1500);
    },
  },
  {
    out: '05-basics',
    route: '/basics/',
    headline: 'Start from zero.',
    sub: 'How the pieces move, in minutes.',
    cropTop: 0,
  },
];

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fontFace(): string {
  if (!FONT_DATA) return '';
  return `<style>@font-face{font-family:"DM Sans";src:url(data:font/woff2;base64,${FONT_DATA}) format("woff2");font-weight:100 900;}</style>`;
}

function canvasSvg(d: Device, headline: string, sub: string): Buffer {
  const lines = headline.split('\n');
  const lh = Math.round(d.headlineSize * 1.12);
  const x = d.gutter;
  const y0 = Math.round(d.headlineSize * 2.2);
  const tspans = lines
    .map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lh}">${esc(l)}</tspan>`)
    .join('');
  const subY = y0 + (lines.length - 1) * lh + Math.round(d.subSize * 1.9);
  return Buffer.from(`
    <svg width="${d.W}" height="${d.H}" xmlns="http://www.w3.org/2000/svg">
      ${fontFace()}
      <rect width="${d.W}" height="${d.H}" fill="${PAGE_BLUE}"/>
      <rect x="${x}" y="${Math.round(d.headlineSize * 1.1)}" width="${Math.round(d.headlineSize * 1.1)}" height="${Math.round(d.headlineSize * 0.11)}" rx="${Math.round(d.headlineSize * 0.055)}" fill="${GREEN}"/>
      <text x="${x}" y="${y0}" font-family="DM Sans, Helvetica Neue, Arial, sans-serif"
            font-size="${d.headlineSize}" font-weight="700" fill="${INK}" letter-spacing="-1">${tspans}</text>
      <text x="${x}" y="${subY}" font-family="DM Sans, Helvetica Neue, Arial, sans-serif"
            font-size="${d.subSize}" font-weight="400" fill="${MUTED}">${esc(sub)}</text>
    </svg>
  `);
}

async function capture(page: Page, d: Device, shot: Shot): Promise<Buffer> {
  await page.goto(`${BASE}${shot.route}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => (document as unknown as { fonts: { ready: Promise<unknown> } }).fonts.ready);
  await page.waitForTimeout(2500);
  if (shot.prep) await shot.prep(page);
  await page.waitForTimeout(500);
  const url = page.url();
  if (!url.includes(shot.route.split('?')[0])) {
    console.warn(`  ! ${shot.out}: navigated away to ${url}`);
  }
  return page.screenshot({ type: 'png' });
}

async function compose(d: Device, shot: Shot, raw: Buffer, outDir: string) {
  const meta = await sharp(raw).metadata();
  const sw = meta.width!;
  const sh = meta.height!;
  if (sw !== d.viewport.width * d.scale || sh !== d.viewport.height * d.scale) {
    throw new Error(`${shot.out}: capture is ${sw}x${sh}, expected ${d.viewport.width * d.scale}x${d.viewport.height * d.scale}`);
  }

  const cropPx = Math.round(sh * shot.cropTop);
  const insetW = Math.round(d.W * 0.86);
  const screen = await sharp(raw)
    .extract({ left: 0, top: cropPx, width: sw, height: sh - cropPx })
    .resize({ width: insetW })
    .png()
    .toBuffer();
  const sm = await sharp(screen).metadata();
  const pw = sm.width!;
  const ph = sm.height!;

  const mask = Buffer.from(
    `<svg width="${pw}" height="${ph}"><rect width="${pw}" height="${ph}" rx="${d.radius}" ry="${d.radius}" fill="#fff"/></svg>`
  );
  const rounded = await sharp(screen).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();

  const left = Math.round((d.W - pw) / 2);
  const top = d.screenTop;

  // Soft shadow under the screen (drawn on the canvas, then blurred).
  const shadowPad = 120;
  const shadow = await sharp(
    Buffer.from(
      `<svg width="${pw + shadowPad * 2}" height="${ph + shadowPad * 2}">
         <rect x="${shadowPad}" y="${shadowPad + 24}" width="${pw}" height="${ph}" rx="${d.radius}" ry="${d.radius}" fill="rgba(16,26,51,0.22)"/>
       </svg>`
    )
  )
    .blur(30)
    .png()
    .toBuffer();

  // The screen bleeds off the bottom (and the shadow past the sides); sharp
  // needs every overlay fully inside the canvas, so clip to the canvas box.
  const clip = async (buf: Buffer, x: number, y: number) => {
    const m = await sharp(buf).metadata();
    const cx = Math.max(0, -x);
    const cy = Math.max(0, -y);
    const w = Math.min(m.width! - cx, d.W - Math.max(0, x));
    const h = Math.min(m.height! - cy, d.H - Math.max(0, y));
    const input = await sharp(buf).extract({ left: cx, top: cy, width: w, height: h }).png().toBuffer();
    return { input, left: Math.max(0, x), top: Math.max(0, y) };
  };
  const shadowLayer = await clip(shadow, left - shadowPad, top - shadowPad);
  const screenLayer = await clip(rounded, left, top);

  await sharp(canvasSvg(d, shot.headline, shot.sub))
    .composite([shadowLayer, screenLayer])
    .flatten({ background: PAGE_BLUE })
    .png()
    .toFile(join(outDir, `${shot.out}.png`));

  const check = await sharp(join(outDir, `${shot.out}.png`)).metadata();
  console.log(`  ${d.key}/${shot.out}.png  ${check.width}x${check.height}`);
}

async function serverUp(): Promise<boolean> {
  try {
    const r = await fetch(`${BASE}/play/`);
    return r.ok;
  } catch {
    return false;
  }
}

async function main() {
  const only = process.argv.find((a) => a.startsWith('--device='))?.split('=')[1];
  const targets = DEVICES.filter((d) => !only || d.key === only);

  let server: ChildProcess | null = null;
  if (!(await serverUp())) {
    server = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', BUNDLE], { stdio: 'ignore' });
    for (let i = 0; i < 40 && !(await serverUp()); i++) await new Promise((r) => setTimeout(r, 250));
    if (!(await serverUp())) throw new Error(`Could not serve ${BUNDLE} on :${PORT}`);
  }

  const browser = await chromium.launch();
  try {
    for (const d of targets) {
      const outDir = join(OUT, d.key);
      mkdirSync(outDir, { recursive: true });
      console.log(`\n${d.key}: ${d.W}x${d.H}`);
      const ctx = await browser.newContext({
        viewport: d.viewport,
        deviceScaleFactor: d.scale,
        isMobile: d.isMobile,
        hasTouch: true,
        userAgent: d.userAgent,
        colorScheme: 'light',
      });
      // The root route bounces un-onboarded devices to onboarding.
      await ctx.addInitScript(() => {
        try { localStorage.setItem('chess_path_onboarded', 'true'); } catch {}
      });
      for (const shot of SHOTS) {
        const page = await ctx.newPage();
        const errors: string[] = [];
        page.on('pageerror', (e) => errors.push(String(e)));
        try {
          const raw = await capture(page, d, shot);
          await compose(d, shot, raw, outDir);
          if (errors.length) console.warn(`  ! ${shot.out}: page errors: ${errors.slice(0, 2).join(' | ')}`);
        } finally {
          await page.close();
        }
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    if (server) server.kill();
  }
  console.log(`\nDone -> ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
