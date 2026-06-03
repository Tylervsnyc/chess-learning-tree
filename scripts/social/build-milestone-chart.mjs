/**
 * Milestone chart builder — renders a branded Chess Path "rating milestone"
 * social card (1080x1350) from a JSON config.
 *
 * The important bit: callout windows AUTO-FIT their text. We render the text
 * first, measure it with getComputedTextLength(), then draw the rounded window
 * around it (+ optional logo). Text can never overflow or be clipped.
 *
 *   node scripts/social/build-milestone-chart.mjs <config.json> <out.png>
 *
 * Config shape: see data/social/lichess-1800.json and the skill doc
 * .claude/commands/lichess-milestone.md
 */
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const configPath = process.argv[2];
const outPath = process.argv[3] || '/tmp/milestone-chart.png';
if (!configPath) {
  console.error('Usage: node build-milestone-chart.mjs <config.json> <out.png>');
  process.exit(1);
}
const cfg = JSON.parse(readFileSync(configPath, 'utf8'));

// Inline brand assets as data URIs so the SVG is self-contained.
const b64 = (p) => readFileSync(resolve(ROOT, p)).toString('base64');
const ICON = 'data:image/png;base64,' + b64('public/brand/icon-512.png');
const LOGO = 'data:image/svg+xml;base64,' + b64('public/brand/logo-horizontal-light.svg');

const HTML = `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'DM Sans',sans-serif}
  .card{width:1080px;height:1350px;background:#eef6fc;padding:84px 72px 64px;display:flex;flex-direction:column}
  .head{display:flex;align-items:center;gap:16px}
  .head img{height:44px}
  .kicker{font-size:26px;font-weight:700;color:#1CB0F6;letter-spacing:2px;text-transform:uppercase}
  .headline{font-size:72px;font-weight:800;color:#2A3C45;line-height:1.05;margin-top:28px}
  .headline em{font-style:normal;color:#58CC02}
  .panel{background:#fff;border-radius:32px;margin-top:50px;flex:1;box-shadow:0 20px 50px rgba(28,176,246,.14);border:1px solid #e4eef7;padding:48px 44px 36px;display:flex;flex-direction:column}
  .stats{display:flex;margin-bottom:30px}
  .stat{flex:1}
  .stat+.stat{border-left:2px solid #eef3f8;padding-left:34px}
  .stat .num{font-size:60px;font-weight:800;color:#2A3C45;line-height:1}
  .stat .lbl{font-size:21px;font-weight:500;color:#94a3b8;margin-top:8px}
  svg.chart{width:100%;flex:1}
  .footer{display:flex;align-items:flex-end;justify-content:space-between;margin-top:38px}
  .footer img{height:50px}
  .right{text-align:right}
  .url{font-size:27px;font-weight:800;color:#1CB0F6}
  .handle{font-size:23px;font-weight:500;color:#94a3b8;margin-top:4px}
</style></head><body>
  <div class="card">
    <div class="head"><img id="kicon"><div class="kicker" id="kicker"></div></div>
    <div class="headline" id="headline"></div>
    <div class="panel">
      <div class="stats" id="stats"></div>
      <svg class="chart" id="chart" viewBox="0 0 920 480" preserveAspectRatio="none"></svg>
    </div>
    <div class="footer"><img id="flogo"><div class="right">
      <div class="url" id="url"></div><div class="handle" id="handle"></div>
    </div></div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
await page.setContent(HTML, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

await page.evaluate(({ cfg, ICON, LOGO }) => {
  const NS = 'http://www.w3.org/2000/svg';
  // header / headline / footer
  document.getElementById('kicon').src = ICON;
  document.getElementById('flogo').src = LOGO;
  document.getElementById('kicker').textContent = cfg.kicker;
  document.getElementById('url').textContent = cfg.footer.url;
  document.getElementById('handle').textContent = cfg.footer.handle;
  document.getElementById('headline').innerHTML = cfg.headline
    .map((l) => l.replace(/\*(.+?)\*/g, '<em>$1</em>')).join('<br>');
  const statsEl = document.getElementById('stats');
  statsEl.innerHTML = cfg.stats.map((s) =>
    `<div class="stat"><div class="num" style="color:${s.color || '#2A3C45'}">${s.num}</div><div class="lbl">${s.label}</div></div>`).join('');

  const svg = document.getElementById('chart');
  const W = 920, H = 480, pad = { l: 60, r: 20, t: 30, b: 42 };
  const data = cfg.points;
  const xs = data.map((d) => d.t);
  const xmin = Math.min(...xs), xmax = Math.max(...xs);
  const ymin = cfg.yRange[0], ymax = cfg.yRange[1];
  const X = (t) => pad.l + (t - xmin) / (xmax - xmin) * (W - pad.l - pad.r);
  const Y = (r) => pad.t + (1 - (r - ymin) / (ymax - ymin)) * (H - pad.t - pad.b);

  const add = (tag, attrs, parent = svg) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
  };

  // defs: area gradient + tapered arrowheads (one per accent color used)
  const defs = add('defs', {});
  defs.innerHTML = `<linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${cfg.lineColor}" stop-opacity="0.30"/>
    <stop offset="100%" stop-color="${cfg.lineColor}" stop-opacity="0"/></linearGradient>`;
  const arrowColors = [...new Set((cfg.callouts || []).map((c) => c.accent))];
  arrowColors.forEach((c, i) => {
    const m = add('marker', { id: 'ah' + i, markerWidth: 9, markerHeight: 9, refX: 6, refY: 4.5, orient: 'auto' }, defs);
    add('path', { d: 'M0,0.5 L8.5,4.5 L0,8.5 Q3,4.5 0,0.5 Z', fill: c }, m);
  });
  const ahId = (c) => 'ah' + arrowColors.indexOf(c);

  // gridlines + y labels
  for (let r = cfg.gridFrom; r <= cfg.gridTo; r += cfg.gridStep) {
    const y = Y(r);
    add('line', { x1: pad.l, y1: y, x2: W - pad.r, y2: y, stroke: '#eef3f8', 'stroke-width': 2 });
    const t = add('text', { x: pad.l - 12, y: y + 6, 'text-anchor': 'end', 'font-size': 20, fill: '#94a3b8', 'font-family': 'DM Sans' });
    t.textContent = r;
  }
  // x labels
  (cfg.xLabels || []).forEach(({ t, label, anchor }) => {
    const e = add('text', { x: X(t), y: H - 8, 'text-anchor': anchor || 'middle', 'font-size': 20, fill: '#94a3b8', 'font-family': 'DM Sans' });
    e.textContent = label;
  });

  // area + line
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${X(d.t).toFixed(1)},${Y(d.r).toFixed(1)}`).join(' ');
  add('path', { d: line + ` L${X(xmax)},${Y(ymin)} L${X(xmin)},${Y(ymin)} Z`, fill: 'url(#area)' });
  add('path', { d: line, fill: 'none', stroke: cfg.lineColor, 'stroke-width': 4.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });

  // ---- AUTO-FITTING CALLOUT WINDOW ----------------------------------------
  // Render text first, measure, then draw the rounded window sized to fit.
  function drawCallout(c, tx) {
    const padX = c.padX ?? 22, padY = 16, lineGap = 6, logoSize = 46, logoGap = c.logoGap ?? 14;
    // measure lines
    const tmp = c.lines.map((ln) => {
      const t = add('text', { 'font-family': 'DM Sans', 'font-weight': ln.weight || 800, 'font-size': ln.size || 21, fill: ln.color });
      t.textContent = ln.text;
      return { t, ln, w: 0, h: ln.size || 21 };
    });
    tmp.forEach((o) => { o.w = o.t.getComputedTextLength(); });
    const textW = Math.max(...tmp.map((o) => o.w));
    const textH = tmp.reduce((a, o) => a + o.h, 0) + lineGap * (tmp.length - 1);
    const hasLogo = !!c.logo;
    const boxW = padX * 2 + (hasLogo ? logoSize + logoGap : 0) + textW;
    const boxH = Math.max(padY * 2 + textH, hasLogo ? logoSize + padY * 2 : 0);

    // position the box. If box.cx given, center on it. Otherwise derive from
    // the arrow style: 'down' centers over the target; 'up-right' sits to the
    // lower-left so its right edge is ~66px left of the target.
    let bx;
    if (c.box.cx != null) bx = Math.round(c.box.cx - boxW / 2);
    else if (c.arrow === 'up-right') bx = Math.round(tx - 66 - boxW);
    else bx = Math.round(tx - boxW / 2);
    // keep within the chart frame
    bx = Math.max(pad.l - 6, Math.min(bx, W - pad.r - boxW + 6));
    const by = c.box.top;

    // rounded window (tinted)
    add('rect', { x: bx, y: by, width: boxW, height: boxH, rx: 18, fill: c.fill, stroke: c.accent, 'stroke-width': 2.5, class: 'avoid' });
    // logo
    let textX = bx + padX;
    if (hasLogo) {
      add('image', { href: c.logo === 'icon' ? ICON : c.logo, x: bx + padX, y: by + (boxH - logoSize) / 2, width: logoSize, height: logoSize });
      textX = bx + padX + logoSize + logoGap;
    }
    // place measured text lines (left-aligned next to logo, or centered if no logo)
    const align = hasLogo ? 'start' : 'middle';
    const cx = hasLogo ? textX : bx + boxW / 2;
    let cursorY = by + (boxH - textH) / 2;
    tmp.forEach((o) => {
      cursorY += o.h;
      o.t.setAttribute('x', cx);
      o.t.setAttribute('y', cursorY - o.h * 0.18);
      o.t.setAttribute('text-anchor', align);
      cursorY += lineGap;
      svg.appendChild(o.t); // re-append so text paints on top of the rect
    });
    return { x: bx, y: by, w: boxW, h: boxH };
  }

  // draw callouts + their arrows to a target data point
  (cfg.callouts || []).forEach((c) => {
    const tx = X(c.target.t), ty = Y(c.target.r);
    const box = drawCallout(c, tx);
    // marker dot on the line
    add('circle', { cx: tx, cy: ty, r: 7, fill: c.accent, stroke: '#fff', 'stroke-width': 3 });
    // arrow from box edge to just shy of the dot
    if (c.arrow === 'down') {
      add('line', { x1: tx, y1: box.y + box.h + 2, x2: tx, y2: ty - 12, stroke: c.accent, 'stroke-width': 3, 'stroke-linecap': 'round', 'marker-end': `url(#${ahId(c.accent)})` });
    } else if (c.arrow === 'up-right') {
      const ax = box.x + box.w - 24, ay = box.y;
      add('path', { d: `M${ax},${ay} C${ax + 70},${ay - 30} ${tx},${ay - 70} ${tx},${ty + 16}`, fill: 'none', stroke: c.accent, 'stroke-width': 3, 'stroke-linecap': 'round', 'marker-end': `url(#${ahId(c.accent)})` });
    }
  });

  // peak dot + label live inside the chart; confetti is drawn on a page overlay
  let peakDot = null;
  if (cfg.confetti) {
    const last = data[data.length - 1], lx = X(last.t), ly = Y(last.r);
    peakDot = add('circle', { cx: lx, cy: ly, r: 9, fill: '#58CC02', stroke: '#fff', 'stroke-width': 3, id: 'peakdot' });
    const lab = add('text', { x: lx - 16, y: ly - 16, 'text-anchor': 'end', 'font-size': 24, 'font-weight': 800, fill: '#58CC02', 'font-family': 'DM Sans', class: 'avoid' });
    lab.textContent = cfg.peakLabel || '';
  }

  // ---- PAGE-LEVEL CONFETTI EXPLOSION --------------------------------------
  // Confetti bursts from the peak dot and scatters across the upper half of the
  // whole card (not clipped to the chart). Positions are deterministic.
  if (cfg.confetti && peakDot) {
    const card = document.querySelector('.card');
    const cardRect = card.getBoundingClientRect();
    const pr = peakDot.getBoundingClientRect();
    const ox = pr.left - cardRect.left + pr.width / 2;
    const oy = pr.top - cardRect.top + pr.height / 2;

    // Build "keep-out" boxes around every piece of text/UI so confetti never
    // covers a word. Card-relative, padded.
    const PAD = 10;
    const avoidSel = '.headline, .kicker, .stat, .url, .handle, .head img, .footer img, .avoid';
    const avoid = [...document.querySelectorAll(avoidSel)].map((el) => {
      const r = el.getBoundingClientRect();
      return { x0: r.left - cardRect.left - PAD, y0: r.top - cardRect.top - PAD,
               x1: r.right - cardRect.left + PAD, y1: r.bottom - cardRect.top + PAD };
    });
    const onText = (x, y, sz) => avoid.some((a) => x + sz > a.x0 && x - sz < a.x1 && y + sz > a.y0 && y - sz < a.y1);

    const ov = document.createElementNS(NS, 'svg');
    ov.setAttribute('viewBox', `0 0 ${cardRect.width} ${cardRect.height}`);
    ov.setAttribute('style', 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:5');
    card.appendChild(ov);
    const addO = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); ov.appendChild(e); return e; };

    const C = ['#1CB0F6', '#FFC800', '#58CC02', '#FF6B6B', '#A560E8', '#FF9600'];
    let seed = 987654321;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const target = cfg.confettiCount || 80;
    let placed = 0, tries = 0;
    while (placed < target && tries < target * 30) {
      tries++;
      const ang = rnd() * Math.PI * 2;
      const t = rnd();
      const dist = 30 + t * 680;                       // reach out across the page
      const x = ox + Math.cos(ang) * dist * 1.15;
      const vy = Math.sin(ang);
      const y = oy + vy * dist * (vy < 0 ? 1.05 : 0.32); // bias the blast upward
      const col = C[placed % C.length];
      const rot = (rnd() * 2 - 1) * 60;
      const sc = 0.85 + rnd() * 1.2;                    // varied sizes
      const kind = placed % 3;
      const sz = (kind === 2 ? 18 : 15) * sc;           // footprint for bounds/overlap test
      if (x < 24 || x > cardRect.width - 24 || y < 24 || y > cardRect.height * 0.64) continue;
      if (onText(x, y, sz * 0.6)) continue;             // never cover a word
      placed++;
      if (kind === 0) addO('circle', { cx: x, cy: y, r: 5 * sc, fill: col, opacity: 0.95 });
      else if (kind === 1) addO('rect', { x, y, width: 15 * sc, height: 9 * sc, rx: 2, fill: col, transform: `rotate(${rot} ${x} ${y})`, opacity: 0.95 });
      else addO('rect', { x, y, width: 6 * sc, height: 18 * sc, rx: 3, fill: col, transform: `rotate(${rot} ${x} ${y})`, opacity: 0.95 });
    }
  }
}, { cfg, ICON, LOGO });

await page.waitForTimeout(300);
await page.locator('.card').screenshot({ path: outPath });
await browser.close();
console.log('Wrote', outPath);
