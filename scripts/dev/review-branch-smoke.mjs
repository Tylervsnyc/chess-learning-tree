// Headless smoke test for the /play review "Try it" variations.
// Plays a couple of moves vs Rookie, resigns, opens the review, then:
// makes an off-game move (branch), checks the amber label + best-move arrow,
// Back to game, and ArrowLeft/ArrowRight.
//
//   ./scripts/ensure-dev.sh && node scripts/dev/review-branch-smoke.mjs [screenshot.png]
import { chromium } from 'playwright';

const shot = process.argv[2] || 'review-branch-360.png';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const log = (...a) => console.log('[smoke]', ...a);
p.on('pageerror', (e) => console.log('[smoke] PAGE ERROR:', String(e).slice(0, 300)));
p.on('console', (m) => { if (m.type() === 'error' && !/401|favicon/.test(m.text())) console.log('[smoke] console.error:', m.text().slice(0, 300)); });
const fail = (msg) => { console.error('[smoke] FAIL:', msg); process.exitCode = 1; };

const sq = (s) => p.locator(`[data-square="${s}"]`).first();
const tap = async (s) => { await sq(s).tap({ force: true }); await p.waitForTimeout(150); };
const label = () => p.locator('span:has-text("Trying:")').first();
const boardArrows = async () => p.evaluate(() => document.querySelectorAll('svg polygon, svg line, svg path[stroke]').length);

await p.goto('http://localhost:3000/play');
// The DEV-ONLY engine-log overlay (bottom-right, 360px wide) would swallow taps on a phone viewport.
await p.addStyleTag({ content: '.fixed.bottom-2.right-2.z-50 { display: none !important; }' });
await p.waitForTimeout(1500);
await p.getByRole('button', { name: /Let's Play/i }).tap();
await p.waitForSelector('[data-square="e2"]', { timeout: 15000 });
await p.waitForTimeout(1500);

// Play 1. e4 ... 2. Nf3 (tap-to-move) with waits for Rookie's reply.
for (const [from, to] of [['e2', 'e4'], ['g1', 'f3']]) {
  await tap(from); await tap(to);
  await p.waitForTimeout(2500);
}
// Resign (armed on the first tap).
const resign = p.getByRole('button', { name: /^Resign$/ });
await resign.tap(); await p.getByRole('button', { name: /Tap to resign/ }).tap();
await p.waitForTimeout(1500);
// Dismiss the completion card → review.
const reviewBtn = p.getByRole('button', { name: /Review Game/i });
await reviewBtn.waitFor({ timeout: 15000 });
await reviewBtn.tap();
await p.getByRole('button', { name: 'Next move' }).waitFor({ timeout: 10000 });
log('in review');

// Step to the end so the last shown position is after Rookie's reply, then back one.
await p.getByRole('button', { name: 'Jump to end' }).tap();
await p.waitForTimeout(300);
await p.keyboard.press('ArrowLeft');
await p.waitForTimeout(300);
const mainlineLabelBefore = await p.locator('span.font-mono').first().innerText();
log('mainline label:', mainlineLabelBefore);

// Off-game move: whichever side is to move, try a pawn push that is legal in
// most 2-move positions (d2-d4 for white / d7-d5 for black), else fall back.
const fen = await p.evaluate(() => {
  const el = document.querySelector('[data-square="e4"]');
  return el ? 'ok' : 'no';
});
if (fen !== 'ok') fail('board not found in review');

let branched = false;
for (const [from, to] of [['d2', 'd4'], ['d7', 'd5'], ['b1', 'c3'], ['b8', 'c6'], ['h2', 'h3'], ['h7', 'h6']]) {
  await tap(from); await tap(to);
  await p.waitForTimeout(400);
  if (await label().count()) { branched = true; log('branched with', from, to); break; }
}
if (!branched) fail('could not start a branch');
const labelText = await label().innerText();
log('label:', labelText);
const cls = await label().getAttribute('class');
if (!/text-amber/.test(cls || '')) fail('label is not amber');
if (!/Trying:/.test(labelText)) fail('label missing "Trying:"');

const backBtn = p.getByRole('button', { name: 'Back to game' });
if (!(await backBtn.count())) fail('Back to game button missing');
const bh = await backBtn.boundingBox();
if (bh && bh.height < 44) fail(`Back to game height ${bh.height} < 44`);
if (!(await p.locator('text=Trying a line. Tap Back to game to return.').count())) fail('quiet line missing');

// Best-move arrow: wait for the depth-12 eval to land (arrow drawn in the board SVG).
await p.waitForTimeout(3500);
const arrowsInBranch = await boardArrows();
log('svg arrow elements in branch:', arrowsInBranch);
if (arrowsInBranch === 0) fail('no best-move arrow in branch');

// No horizontal overflow at 360px.
const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
if (overflow) fail('horizontal overflow at 360px');

await p.screenshot({ path: shot });
log('screenshot →', shot);

// Extend the line with one more move, then ArrowLeft/Right inside the branch.
let extended = false;
for (const [from, to] of [['d7', 'd5'], ['d2', 'd4'], ['g8', 'f6'], ['b1', 'c3'], ['a7', 'a6'], ['a2', 'a3']]) {
  await tap(from); await tap(to);
  await p.waitForTimeout(300);
  const t = await label().innerText();
  if (t !== labelText) { extended = true; log('extended:', t); break; }
}
if (!extended) fail('could not extend the branch');
const tipLabel = await label().innerText();
await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(300);
if (!(await label().count())) fail('ArrowLeft at cursor>0 should stay in branch');
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
if ((await label().innerText()) !== tipLabel) fail('ArrowRight did not return to the tip');

// Graph is dimmed while in a branch.
const graphOpacity = await p.evaluate(() => { const g = document.querySelector('svg.w-full.rounded-lg'); return g ? getComputedStyle(g.parentElement).opacity : 'none'; });
log('graph opacity in branch:', graphOpacity);
if (graphOpacity !== '0.5') fail(`graph opacity ${graphOpacity}, expected 0.5`);

// Long line: the label must trim from the front (leading ellipsis), never wrap.
for (const [from, to] of [['a7', 'a6'], ['a2', 'a3'], ['h7', 'h6'], ['h2', 'h3'], ['b7', 'b6'], ['b2', 'b3'], ['g7', 'g6'], ['g2', 'g3']]) {
  await tap(from); await tap(to); await p.waitForTimeout(200);
}
const longBox = await label().locator('span.whitespace-nowrap').boundingBox();
log('long label:', await label().innerText(), 'box', longBox && `${Math.round(longBox.width)}x${Math.round(longBox.height)}`);
if (longBox && longBox.height > 24) fail('branch label wrapped');
if (!(await label().innerText()).startsWith('\u2026')) fail('long line missing the leading ellipsis');
const overflow2 = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
if (overflow2) fail('horizontal overflow with a long line');
await p.screenshot({ path: shot.replace(/\.png$/, '-long.png') });
{
  const playAgain = await p.getByRole('button', { name: 'Play Again' }).boundingBox();
  if (!playAgain) fail('Play Again not visible in branch');
}

// Back to game restores the mainline label.
await backBtn.tap(); await p.waitForTimeout(400);
if (await label().count()) fail('still in branch after Back to game');
const mainlineLabelAfter = await p.locator('span.font-mono').first().innerText();
log('mainline label after:', mainlineLabelAfter);
if (mainlineLabelAfter !== mainlineLabelBefore) fail(`mainline position changed: ${mainlineLabelBefore} → ${mainlineLabelAfter}`);

// ArrowLeft past the root exits the branch and stays on the root.
await tap('h2'); await tap('h3'); await tap('h7'); await tap('h6'); await p.waitForTimeout(300);
if (await label().count()) {
  // One-move branch: first ArrowLeft goes to the root (cursor -1), the second exits.
  await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(200);
  if (!(await label().count())) fail('ArrowLeft to the root should stay in the branch');
  await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(400);
  if (await label().count()) fail('ArrowLeft at root did not exit the branch');
  const l = await p.locator('span.font-mono').first().innerText();
  if (l !== mainlineLabelBefore) fail(`root exit landed on ${l}, expected ${mainlineLabelBefore}`);
  log('ArrowLeft at root exits to', l);
}

// Mainline keyboard nav still works.
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
log('after ArrowRight:', await p.locator('span.font-mono').first().innerText());

await b.close();
log(process.exitCode ? 'DONE WITH FAILURES' : 'ALL GOOD');
