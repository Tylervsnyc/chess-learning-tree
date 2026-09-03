// Headless smoke test for the shared GameReview "Try it" variations
// (components/shared/GameReview.tsx — the bout review and /review surfaces).
// Uses /test/game-review, which renders GameReview over the real Stockfish
// pipeline on a hardcoded Italian Game. Then: step onto the mainline, make an
// off-game move (branch), check the amber label + best-move arrow, Back to
// game, ArrowLeft at the root, and ArrowLeft/ArrowRight on the mainline.
//
//   ./scripts/ensure-dev.sh && node scripts/dev/game-review-branch-smoke.mjs [screenshot.png]
import { chromium } from 'playwright';

const shot = process.argv[2] || 'gamereview-branch-360.png';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const log = (...a) => console.log('[smoke]', ...a);
p.on('pageerror', (e) => console.log('[smoke] PAGE ERROR:', String(e).slice(0, 300)));
p.on('console', (m) => { if (m.type() === 'error' && !/401|favicon/.test(m.text())) console.log('[smoke] console.error:', m.text().slice(0, 300)); });
const fail = (msg) => { console.error('[smoke] FAIL:', msg); process.exitCode = 1; };

const sq = (s) => p.locator(`[data-square="${s}"]`).first();
const tap = async (s) => { await sq(s).scrollIntoViewIfNeeded(); await sq(s).tap({ force: true }); await p.waitForTimeout(150); };
const label = () => p.locator('span:has-text("Trying:")').first();
// The mainline label nests the classification badge (shared ReviewNav, same as
// /play) — read only the move text, not the badge glyph.
const mainLabel = () => ({
  innerText: () => p.locator('span.font-mono').first().evaluate((el) => (el.firstChild?.textContent || '').trim()),
});
const boardArrows = async () => p.evaluate(() => document.querySelectorAll('svg polygon, svg line, svg path[stroke]').length);
const noOverflow = async (tag) => {
  const w = await p.evaluate(() => document.documentElement.scrollWidth);
  log(`${tag}: scrollWidth=${w}`);
  if (w > 360) fail(`horizontal overflow at 360px (${tag}): scrollWidth ${w}`);
};

await p.goto('http://localhost:3000/test/game-review');
await p.waitForSelector('[data-square="e2"]', { timeout: 30000 });
await p.getByRole('button', { name: 'Next move' }).waitFor({ timeout: 10000 });
await p.waitForTimeout(1000);
log('review mounted');

// Step onto the mainline: 1. e4 e5 2. Nf3 → position after 2. Nf3, black to move.
for (let i = 0; i < 3; i++) { await p.getByRole('button', { name: 'Next move' }).tap(); await p.waitForTimeout(250); }
const mainlineLabelBefore = await mainLabel().innerText();
log('mainline label:', mainlineLabelBefore);
if (mainlineLabelBefore !== '2. Nf3') fail(`expected "2. Nf3", got "${mainlineLabelBefore}"`);

// Off-game move (black to move): 2... d6 instead of Nc6.
await tap('d7'); await tap('d6');
await p.waitForTimeout(500);
if (!(await label().count())) fail('could not start a branch (no Trying: label)');
const labelText = await label().innerText();
log('label:', labelText);
const cls = await label().getAttribute('class');
if (!/text-amber/.test(cls || '')) fail('label is not amber');
if (!/Trying: 2\.\.\. d6/.test(labelText)) fail(`label text unexpected: "${labelText}"`);
if (await p.locator('span:has-text("Trying:")').locator('..').locator('span.font-black').count()) fail('badge pill visible in branch');

const backBtn = p.getByRole('button', { name: 'Back to game' });
if (!(await backBtn.count())) fail('Back to game button missing');
const bh = await backBtn.boundingBox();
log('Back to game box:', bh && `${Math.round(bh.width)}x${Math.round(bh.height)}`);
if (!bh || bh.height < 44) fail(`Back to game height ${bh?.height} < 44`);
if (await p.getByRole('button', { name: 'Jump to end' }).count()) fail('Jump to end still visible in branch');
if (!(await p.locator('text=Trying a line. Tap Back to game to return.').count())) fail('quiet line missing');

// Best-move arrow: wait for the depth-12 eval to land (arrow drawn in the board SVG).
let arrowsInBranch = 0;
for (let i = 0; i < 30; i++) {
  arrowsInBranch = await boardArrows();
  if (arrowsInBranch > 0) break;
  await p.waitForTimeout(500);
}
log('svg arrow elements in branch:', arrowsInBranch);
if (arrowsInBranch === 0) fail('no best-move arrow in branch after 15s');
await noOverflow('branch');

await p.screenshot({ path: shot });
log('screenshot →', shot);

// Extend one move (white), then ArrowLeft/Right inside the branch.
await tap('d2'); await tap('d4'); await p.waitForTimeout(300);
const tipLabel = await label().innerText();
log('extended:', tipLabel);
if (tipLabel === labelText) fail('could not extend the branch');
await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(300);
if (!(await label().count())) fail('ArrowLeft at cursor>0 should stay in branch');
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
if ((await label().innerText()) !== tipLabel) fail('ArrowRight did not return to the tip');

// Back to game restores the mainline label + the jump buttons.
await backBtn.tap(); await p.waitForTimeout(400);
if (await label().count()) fail('still in branch after Back to game');
const mainlineLabelAfter = await mainLabel().innerText();
log('mainline label after Back to game:', mainlineLabelAfter);
if (mainlineLabelAfter !== mainlineLabelBefore) fail(`mainline position changed: ${mainlineLabelBefore} → ${mainlineLabelAfter}`);
if (!(await p.getByRole('button', { name: 'Jump to end' }).count())) fail('Jump to end missing after Back to game');
await noOverflow('mainline');

// ArrowLeft past the root exits the branch and stays on the root.
await tap('d7'); await tap('d6'); await p.waitForTimeout(300);
if (!(await label().count())) fail('second branch did not start');
await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(200);
if (!(await label().count())) fail('ArrowLeft to the root should stay in the branch');
await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(400);
if (await label().count()) fail('ArrowLeft at root did not exit the branch');
{
  const l = await mainLabel().innerText();
  if (l !== mainlineLabelBefore) fail(`root exit landed on ${l}, expected ${mainlineLabelBefore}`);
  log('ArrowLeft at root exits to', l);
}

// Mainline keyboard nav still works.
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
const r = await mainLabel().innerText();
log('after ArrowRight:', r);
if (r !== '2... Nc6') fail(`ArrowRight on mainline expected "2... Nc6", got "${r}"`);
await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(300);
const l2 = await mainLabel().innerText();
log('after ArrowLeft:', l2);
if (l2 !== '2. Nf3') fail(`ArrowLeft on mainline expected "2. Nf3", got "${l2}"`);

await b.close();
log(process.exitCode ? 'DONE WITH FAILURES' : 'ALL GOOD');
