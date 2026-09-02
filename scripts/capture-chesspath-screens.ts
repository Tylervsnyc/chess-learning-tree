/**
 * Raw full-viewport captures of every distinct screen in the Chess Path iOS
 * app, so Tyler can pick App Store shots. No headline canvas, no compositing —
 * just the phone screen at 1320x2868 (viewport 440x956 @ 3x).
 *
 * Serves the already-built offline bundle `capacitor-shell-chesspath/` on
 * :4173 (same approach as scripts/build-chesspath-screenshots.ts) and drives
 * Playwright chromium with an iPhone UA. Does NOT run an offline build.
 *
 * Usage:  npx tsx scripts/capture-chesspath-screens.ts [--only=<substring>]
 * Output: out/appstore-chesspath/raw/NN-name.png + contact-sheet.png
 */
import sharp from 'sharp';
import { chromium, devices, type BrowserContext, type Page } from 'playwright';
import { mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';
import { Chess } from 'chess.js';

const ROOT = process.cwd();
const BUNDLE = join(ROOT, 'capacitor-shell-chesspath');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const OUT = join(ROOT, 'out', 'appstore-chesspath', 'raw');

const VIEWPORT = { width: 440, height: 956 };
const SCALE = 3;
const UA = devices['iPhone 15 Pro'].userAgent;

const only = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];

// ─── bookkeeping ───
let seq = 0;
const captured: string[] = [];
const failed: string[] = [];
const notes: string[] = [];

function nn(): string {
  seq += 1;
  return String(seq).padStart(2, '0');
}

/** Screenshot the viewport; drop it (and report) if it is blank or a 404. */
async function shoot(page: Page, name: string, opts: { allowBlank?: boolean } = {}): Promise<boolean> {
  const buf = await page.screenshot({ type: 'png' });
  const stats = await sharp(buf).stats();
  const maxStd = Math.max(...stats.channels.map((c) => c.stdev));
  const body = (await page.textContent('body').catch(() => '')) ?? '';
  const is404 = /could not be found|404/i.test(body.slice(0, 400)) && body.length < 600;
  const isDirListing = /Directory listing for/i.test(body.slice(0, 200));
  if ((maxStd < 4 && !opts.allowBlank) || is404 || isDirListing) {
    failed.push(`${name} (${is404 ? '404' : isDirListing ? 'no page, directory listing' : 'blank'}) at ${page.url()}`);
    return false;
  }
  const file = `${nn()}-${name}.png`;
  await sharp(buf).png().toFile(join(OUT, file));
  captured.push(file);
  console.log(`  ${file}`);
  return true;
}

async function goto(page: Page, route: string, settle = 2500): Promise<boolean> {
  try {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    failed.push(`${route} (goto: ${String(e).slice(0, 80)})`);
    return false;
  }
  await page.evaluate(() => (document as unknown as { fonts: { ready: Promise<unknown> } }).fonts.ready).catch(() => {});
  await page.waitForTimeout(settle);
  return true;
}

/** Body has overflow:hidden; find the tallest scroll container and scroll it. */
async function scrollMain(page: Page, y: number) {
  await page.evaluate((py) => {
    const els = [document.scrollingElement, ...Array.from(document.querySelectorAll('*'))] as Element[];
    let best: Element | null = null;
    let bestDelta = 0;
    for (const el of els) {
      if (!el) continue;
      const delta = el.scrollHeight - el.clientHeight;
      const ov = getComputedStyle(el).overflowY;
      if (delta > bestDelta && (ov === 'auto' || ov === 'scroll' || el === document.scrollingElement)) {
        best = el;
        bestDelta = delta;
      }
    }
    if (best) best.scrollTop = py;
    window.scrollTo(0, py);
  }, y);
  await page.waitForTimeout(800);
}

async function newContext(browser: Awaited<ReturnType<typeof chromium.launch>>, onboarded: boolean): Promise<BrowserContext> {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
    isMobile: true,
    hasTouch: true,
    userAgent: UA,
    colorScheme: 'light',
  });
  if (onboarded) {
    await ctx.addInitScript(() => {
      try { localStorage.setItem('chess_path_onboarded', 'true'); } catch {}
    });
  }
  return ctx;
}

async function withPage<T>(ctx: BrowserContext, fn: (page: Page) => Promise<T>): Promise<T | undefined> {
  const page = await ctx.newPage();
  try {
    return await fn(page);
  } catch (e) {
    console.warn(`  ! ${String(e).slice(0, 160)}`);
    failed.push(`step error: ${String(e).slice(0, 120)}`);
    return undefined;
  } finally {
    await page.close();
  }
}

// ─── lesson helpers ───

/** Piece map from react-chessboard's DOM: { e4: 'wP', ... } */
async function boardPosition(page: Page): Promise<Record<string, string>> {
  return page.evaluate(() => {
    const out: Record<string, string> = {};
    document.querySelectorAll('[data-square]').forEach((sq) => {
      const p = sq.querySelector('[data-piece]');
      if (p) out[sq.getAttribute('data-square')!] = p.getAttribute('data-piece')!;
    });
    return out;
  });
}

type PackPuzzle = { puzzleId: string; fen: string; moves: string };

function positionAfterSetup(p: PackPuzzle): Record<string, string> | null {
  try {
    const c = new Chess(p.fen);
    const [setup] = p.moves.split(' ');
    c.move({ from: setup.slice(0, 2), to: setup.slice(2, 4), promotion: setup[4] });
    const out: Record<string, string> = {};
    for (const row of c.board()) for (const cell of row) {
      if (cell) out[cell.square] = `${cell.color}${cell.type.toUpperCase()}`;
    }
    return out;
  } catch {
    return null;
  }
}

function samePosition(a: Record<string, string>, b: Record<string, string>): boolean {
  const ka = Object.keys(a);
  if (ka.length !== Object.keys(b).length) return false;
  return ka.every((k) => a[k] === b[k]);
}

async function clickMove(page: Page, from: string, to: string) {
  await page.locator(`[data-square="${from}"]`).click();
  await page.waitForTimeout(250);
  await page.locator(`[data-square="${to}"]`).click();
}

/**
 * Play through every puzzle of a loaded lesson using the pack data the page
 * itself fetched (matched against the on-screen position). Returns the number
 * of puzzles solved.
 */
async function solveLesson(page: Page, pack: PackPuzzle[], onFirstCorrect?: () => Promise<void>): Promise<number> {
  let solved = 0;
  let lastId = '';
  for (let i = 0; i < 8; i++) {
    // Wait for a fresh, matchable position.
    let match: PackPuzzle | null = null;
    for (let t = 0; t < 20 && !match; t++) {
      const pos = await boardPosition(page);
      match = pack.find((p) => p.puzzleId !== lastId && (() => { const q = positionAfterSetup(p); return q && samePosition(q, pos); })()) ?? null;
      if (!match) await page.waitForTimeout(500);
    }
    if (!match) break;
    lastId = match.puzzleId;
    const moves = match.moves.split(' ');
    for (let m = 1; m < moves.length; m += 2) {
      const mv = moves[m];
      await clickMove(page, mv.slice(0, 2), mv.slice(2, 4));
      if (mv[4]) {
        // Promotion dialog: pick the queen if one is offered.
        const q = page.locator('[data-piece$="Q"], button:has-text("Queen")').last();
        if (await q.count()) await q.click().catch(() => {});
      }
      await page.waitForTimeout(1600); // opponent reply / feedback
    }
    solved += 1;
    if (solved === 1 && onFirstCorrect) await onFirstCorrect();
    // The "correct" card ends on a CONTINUE button; the next puzzle loads after it.
    const cont = page.getByRole('button', { name: /^continue$/i });
    for (let t = 0; t < 10 && !(await cont.count()); t++) await page.waitForTimeout(300);
    if (await cont.count()) await cont.first().click().catch(() => {});
    await page.waitForTimeout(1500);
  }
  return solved;
}

/** Collect every /puzzle-pack/*.json response the page fetches. */
function collectPack(page: Page): PackPuzzle[] {
  const pack: PackPuzzle[] = [];
  page.on('response', async (r) => {
    if (!r.url().includes('/puzzle-pack/') || r.url().endsWith('index.json')) return;
    try {
      const j = (await r.json()) as { puzzles?: PackPuzzle[] };
      if (j.puzzles) pack.push(...j.puzzles);
    } catch { /* ignore */ }
  });
  return pack;
}

async function dismissIntro(page: Page, prefer: 'skip' | 'learn' | 'start') {
  const skip = page.getByRole('button', { name: /^skip$/i });
  const learn = page.getByRole('button', { name: /let'?s learn/i });
  const start = page.getByRole('button', { name: /^(start|let'?s go)$/i });
  for (let t = 0; t < 3; t++) {
    if (await start.count()) { await start.first().click(); await page.waitForTimeout(1200); continue; }
    if (prefer === 'learn' && (await learn.count())) { await learn.first().click(); await page.waitForTimeout(1500); return; }
    if (await skip.count()) { await skip.first().click(); await page.waitForTimeout(1500); return; }
    if (await learn.count()) { await learn.first().click(); await page.waitForTimeout(1500); return; }
    return;
  }
}

// ─── the run ───

async function serverUp(): Promise<boolean> {
  try { return (await fetch(`${BASE}/play/`)).ok; } catch { return false; }
}

async function main() {
  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  let server: ChildProcess | null = null;
  if (!(await serverUp())) {
    server = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', BUNDLE], { stdio: 'ignore' });
    for (let i = 0; i < 40 && !(await serverUp()); i++) await new Promise((r) => setTimeout(r, 250));
    if (!(await serverUp())) throw new Error(`Could not serve ${BUNDLE} on :${PORT}`);
  }

  const browser = await chromium.launch();
  const want = (k: string) => !only || k.includes(only);
  try {
    // ── 1. Onboarding (un-onboarded device) ──
    if (want('onboarding')) {
      console.log('\nonboarding');
      const fresh = await newContext(browser, false);
      await withPage(fresh, async (page) => {
        if (!(await goto(page, '/', 3500))) return;
        await shoot(page, 'onboarding-welcome');
        await page.waitForTimeout(6000); // let the typewriter finish a quip
        await shoot(page, 'onboarding-welcome-quip-done');
        const learn = page.getByRole('button', { name: /^learn/i }).last();
        if (await learn.count()) {
          await learn.click();
          await page.waitForTimeout(900);
          await shoot(page, 'onboarding-learn-expanded');
        }
        const checkmate = page.getByRole('button', { name: /checkmate/i }).last();
        if (await checkmate.count()) {
          await checkmate.click();
          await page.waitForURL(/lesson\/1\.1\.1/, { timeout: 20000 }).catch(() => {});
          await page.waitForTimeout(3000);
          await shoot(page, 'onboarding-tutorial-1.1.1-intro');
          // Advance the guided tutorial one step if there is a CTA.
          const cta = page.locator('button').filter({ hasText: /let'?s|start|next|go/i }).last();
          if (await cta.count()) {
            await cta.click().catch(() => {});
            await page.waitForTimeout(2500);
            await shoot(page, 'onboarding-tutorial-1.1.1-step');
          }
        }
      });
      await withPage(fresh, async (page) => {
        // Fresh device again (the tutorial click set the onboarded flag on the
        // previous page's origin — clear it so /welcome shows the flow).
        await page.addInitScript(() => { try { localStorage.removeItem('chess_path_onboarded'); } catch {} });
        if (!(await goto(page, '/welcome/', 3500))) return;
        await shoot(page, 'welcome-route');
        const basics = page.getByRole('button', { name: /^learn/i }).last();
        if (await basics.count()) {
          await basics.click();
          await page.waitForTimeout(700);
          const b = page.getByRole('button', { name: /basics/i }).last();
          if (await b.count()) {
            await b.click();
            await page.waitForURL(/basics/, { timeout: 20000 }).catch(() => {});
            await page.waitForTimeout(3000);
            await shoot(page, 'onboarding-to-basics');
          }
        }
      });
      await fresh.close();
    }

    const ctx = await newContext(browser, true);

    // ── 2. Simple routes ──
    const simple: Array<[string, string]> = [
      ['home-onboarded', '/'],
      ['path-top', '/path/'],
      ['basics', '/basics/'],
      ['openings-my-openings', '/openings/'],
      ['profile', '/profile/'],
      ['level-test-1-2', '/level-test/1-2/'],
      ['level-test-3-4', '/level-test/3-4/'],
      ['about', '/about/'],
      ['support', '/support/'],
      ['privacy', '/privacy/'],
      ['terms', '/terms/'],
      ['review', '/review/'],
      ['auth-login', '/auth/login/'],
      ['auth-signup', '/auth/signup/'],
      ['auth-forgot-password', '/auth/forgot-password/'],
      ['achievements', '/achievements/'],
      ['brand', '/brand/'],
    ];
    console.log('\nroutes');
    for (const [name, route] of simple) {
      if (!want(name)) continue;
      await withPage(ctx, async (page) => {
        if (!(await goto(page, route))) return;
        const ok = await shoot(page, name);
        if (!ok) return;
        if (name === 'path-top') {
          await scrollMain(page, 900);
          await shoot(page, 'path-scrolled-mid');
          await scrollMain(page, 2600);
          await shoot(page, 'path-scrolled-later-section');
        }
        if (name === 'basics') {
          await scrollMain(page, 800);
          await shoot(page, 'basics-scrolled');
          // Open the first basics item if it is a link/button.
          const first = page.locator('main a, main button').first();
          if (await first.count()) {
            await first.click().catch(() => {});
            await page.waitForTimeout(2500);
            await shoot(page, 'basics-first-item');
          }
        }
        if (name === 'profile') {
          await scrollMain(page, 800);
          await shoot(page, 'profile-scrolled');
        }
        if (name === 'level-test-1-2') {
          const cta = page.locator('button').filter({ hasText: /start|begin|let'?s|go/i }).last();
          if (await cta.count()) {
            await cta.click().catch(() => {});
            await page.waitForTimeout(3000);
            await shoot(page, 'level-test-1-2-in-progress');
          }
        }
      });
    }

    // ── 3. Header Learn dropdown ──
    if (want('header')) {
      await withPage(ctx, async (page) => {
        if (!(await goto(page, '/path/'))) return;
        const learn = page.locator('header button, nav button').filter({ hasText: /^learn/i }).first();
        if (!(await learn.count())) { failed.push('header-learn-dropdown (no Learn button found)'); return; }
        await learn.click();
        await page.waitForTimeout(700);
        await shoot(page, 'header-learn-dropdown-open');
      });
    }

    // ── 4. Openings ──
    if (want('openings')) {
      console.log('\nopenings');
      await withPage(ctx, async (page) => {
        if (!(await goto(page, '/openings/'))) return;
        const lib = page.getByText('Library', { exact: true }).first();
        if (await lib.count()) {
          await lib.click();
          await page.waitForTimeout(1500);
          await shoot(page, 'openings-library');
          await scrollMain(page, 900);
          await shoot(page, 'openings-library-scrolled');
        } else {
          failed.push('openings-library (no Library tab)');
        }
      });
      await withPage(ctx, async (page) => {
        if (!(await goto(page, '/openings/italian/'))) return;
        await shoot(page, 'opening-italian-course');
        await scrollMain(page, 700);
        await shoot(page, 'opening-italian-course-scrolled');
      });
      for (const r of ['/openings/italian/it-1/', '/openings/london/lo-1/']) {
        await withPage(ctx, async (page) => {
          if (!(await goto(page, r, 3500))) return;
          const slug = r.split('/').filter(Boolean).slice(1).join('-');
          if (!page.url().includes(r.replace(/\/$/, ''))) { failed.push(`${r} redirected to ${page.url()}`); return; }
          await shoot(page, `opening-lesson-${slug}-start`);
          const cta = page.locator('button').filter({ hasText: /start|begin|let'?s|next|continue|reveal|predict/i }).last();
          if (await cta.count()) {
            await cta.click().catch(() => {});
            await page.waitForTimeout(2500);
            await shoot(page, `opening-lesson-${slug}-in-progress`);
          }
        });
      }
    }

    // ── 5. Lessons: intro card, hint mode, mid-puzzle for several types ──
    if (want('lesson')) {
      console.log('\nlessons');
      // 1.2.1 back rank: intro card itself, then "Let's Learn!" (hint mode)
      await withPage(ctx, async (page) => {
        if (!(await goto(page, '/lesson/1.2.1/?from=onboarding', 3000))) return;
        await shoot(page, 'lesson-1.2.1-back-rank-intro-card');
        await dismissIntro(page, 'learn');
        await shoot(page, 'lesson-1.2.1-back-rank-tutorial-hint');
      });
      const midPuzzle: Array<[string, string]> = [
        ['1.2.1', 'back-rank-mate'],
        ['1.6.1', 'knight-fork'],
        ['1.2.2', 'smothered-mate'],
        ['1.3.1', 'mate-in-2'],
        ['1.7.1', 'skewer'],
        ['1.9.1', 'rook-endgame'],
        ['2.1.2', 'queen-fork'],
      ];
      for (const [id, label] of midPuzzle) {
        await withPage(ctx, async (page) => {
          if (!(await goto(page, `/lesson/${id}/?from=onboarding`, 3000))) return;
          await dismissIntro(page, 'skip');
          await page.waitForTimeout(800);
          if (!(await page.locator('[data-square]').count())) { failed.push(`lesson ${id} (no board)`); return; }
          await shoot(page, `lesson-${id}-${label}-mid-puzzle`);
        });
      }

      // Solve 1.1.3 (queen mate-in-1, no intro card) to reach the completion popup.
      await withPage(ctx, async (page) => {
        const pack = collectPack(page);
        if (!(await goto(page, '/lesson/1.1.3/?from=onboarding', 3000))) return;
        await dismissIntro(page, 'skip');
        for (let t = 0; t < 20 && pack.length === 0; t++) await page.waitForTimeout(300);
        if (pack.length === 0) { failed.push('lesson 1.1.3 solve (pack never loaded)'); return; }
        const solved = await solveLesson(page, pack, async () => {
          await page.waitForTimeout(400);
          await shoot(page, 'lesson-1.1.3-first-correct-feedback');
          // "WHY?" opens Rookie's explanation of the move.
          const why = page.getByRole('button', { name: /why/i }).first();
          if (await why.count()) {
            await why.click().catch(() => {});
            await page.waitForTimeout(1500);
            await shoot(page, 'lesson-1.1.3-why-explanation');
            // Close only a dialog-scoped button (the header's ✕ exits the lesson).
            const close = page.locator('[role="dialog"] button, [aria-modal="true"] button').filter({ hasText: /got it|close|okay|ok|✕|×/i }).last();
            if (await close.count()) await close.click().catch(() => {});
            else await page.keyboard.press('Escape');
            await page.waitForTimeout(800);
          }
        });
        notes.push(`lesson 1.1.3: solved ${solved} puzzles`);
        if (solved >= 6) {
          await page.waitForTimeout(1200);
          await shoot(page, 'lesson-1.1.3-complete-1');
          await page.waitForTimeout(3000);
          await shoot(page, 'lesson-1.1.3-complete-2');
          await page.waitForTimeout(4000);
          await shoot(page, 'lesson-1.1.3-complete-3');
          // Advance through the completion sequence (rating reveal / keep playing).
          for (let k = 0; k < 3; k++) {
            const btn = page.locator('button').filter({ hasText: /continue|next|keep|reveal|show|see|done|got it|save/i }).last();
            if (!(await btn.count())) break;
            const label = ((await btn.textContent()) ?? 'btn').trim().toLowerCase().replace(/[^a-z]+/g, '-').slice(0, 20);
            await btn.click().catch(() => {});
            await page.waitForTimeout(3500);
            await shoot(page, `lesson-1.1.3-complete-after-${label}`);
            if (!page.url().includes('/lesson/')) break;
          }
        } else {
          failed.push(`lesson 1.1.3 completion (only solved ${solved}/6)`);
          await shoot(page, 'lesson-1.1.3-partial');
        }
      });
    }

    // ── 6. Play ──
    if (want('play')) {
      console.log('\nplay');
      await withPage(ctx, async (page) => {
        if (!(await goto(page, '/play/', 3000))) return;
        await shoot(page, 'play-color-picker');
        const go = page.getByRole('button', { name: /let'?s play/i }).last();
        if (!(await go.count())) { failed.push('play (no Let\'s Play button)'); return; }
        await go.click();
        await page.waitForSelector('[data-square="e2"]', { timeout: 15000 });
        await page.waitForTimeout(1500);
        await shoot(page, 'play-game-start');
        const line: Array<[string, string]> = [['e2', 'e4'], ['g1', 'f3'], ['f1', 'c4'], ['d2', 'd3']];
        for (const [f, t] of line) {
          try {
            await clickMove(page, f, t);
          } catch { break; }
          await page.waitForTimeout(3500);
        }
        await shoot(page, 'play-mid-game');
        await page.waitForTimeout(5000);
        await shoot(page, 'play-mid-game-rookie-quip');
      });
    }

    await ctx.close();
  } finally {
    await browser.close();
    if (server) server.kill();
  }

  await contactSheet();

  console.log('\nCaptured:');
  for (const f of captured) console.log('  ' + f);
  if (notes.length) { console.log('\nNotes:'); for (const n of notes) console.log('  ' + n); }
  if (failed.length) { console.log('\nSkipped / failed:'); for (const f of failed) console.log('  ' + f); }
  console.log(`\nDone -> ${OUT}`);
}

async function contactSheet() {
  const files = readdirSync(OUT).filter((f) => /^\d\d-.*\.png$/.test(f)).sort();
  if (!files.length) return;
  const COLS = 6;
  const TW = 300;
  const TH = Math.round(TW * 2868 / 1320);
  const LABEL = 44;
  const PAD = 16;
  const rows = Math.ceil(files.length / COLS);
  const W = COLS * (TW + PAD) + PAD;
  const H = rows * (TH + LABEL + PAD) + PAD;
  const layers: sharp.OverlayOptions[] = [];
  for (let i = 0; i < files.length; i++) {
    const x = PAD + (i % COLS) * (TW + PAD);
    const y = PAD + Math.floor(i / COLS) * (TH + LABEL + PAD);
    const thumb = await sharp(join(OUT, files[i])).resize(TW, TH).png().toBuffer();
    layers.push({ input: thumb, left: x, top: y });
    const label = files[i].replace(/\.png$/, '');
    const svg = Buffer.from(
      `<svg width="${TW}" height="${LABEL}"><text x="0" y="16" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#101a33">${label.slice(0, 44)}</text>` +
      `<text x="0" y="32" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#101a33">${label.slice(44, 88)}</text></svg>`,
    );
    layers.push({ input: svg, left: x, top: y + TH + 4 });
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: '#eef6fc' } })
    .composite(layers)
    .png()
    .toFile(join(OUT, 'contact-sheet.png'));
  console.log(`\ncontact-sheet.png  ${W}x${H}  (${files.length} thumbs)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
