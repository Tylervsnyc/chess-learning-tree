import sharp from 'sharp';
import opentype from 'opentype.js';

const font900 = opentype.loadSync('/Users/tyler.schwartz/chess-learning-tree/scripts/fonts/nunito-900.woff');
const font700 = opentype.loadSync('/Users/tyler.schwartz/chess-learning-tree/scripts/fonts/nunito-700.woff');

function textPath(font, text, x, y, fontSize, fill, letterSpacing = 0) {
  // Emulate letter-spacing by rendering glyph-by-glyph.
  let cursor = x;
  const paths = [];
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    const path = glyph.getPath(cursor, y, fontSize);
    path.fill = fill;
    paths.push(path.toSVG(2));
    const advance = (glyph.advanceWidth / font.unitsPerEm) * fontSize;
    cursor += advance + letterSpacing;
  }
  return paths.join('');
}

function textWidth(font, text, fontSize, letterSpacing = 0) {
  let w = 0;
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    w += (glyph.advanceWidth / font.unitsPerEm) * fontSize + letterSpacing;
  }
  return w - letterSpacing;
}

const ROOK_BLOCKS = [
  { x: 0, y: 0, color: '#1CB0F6' },
  { x: 2, y: 0, color: '#2FCBEF' },
  { x: 4, y: 0, color: '#A560E8' },
  { x: 0, y: 1, color: '#58CC02' },
  { x: 1, y: 1, color: '#FFC800' },
  { x: 2, y: 1, color: '#FF9600' },
  { x: 3, y: 1, color: '#FF6B6B' },
  { x: 4, y: 1, color: '#FF4B4B' },
  { x: 1, y: 2, color: '#1CB0F6' },
  { x: 2, y: 2, color: '#2FCBEF' },
  { x: 3, y: 2, color: '#A560E8' },
  { x: 1, y: 3, color: '#58CC02' },
  { x: 2, y: 3, color: '#FFC800' },
  { x: 3, y: 3, color: '#FF9600' },
  { x: 1, y: 4, color: '#FF6B6B' },
  { x: 2, y: 4, color: '#FF4B4B' },
  { x: 3, y: 4, color: '#1CB0F6' },
  { x: 0, y: 5, color: '#2FCBEF' },
  { x: 1, y: 5, color: '#A560E8' },
  { x: 2, y: 5, color: '#58CC02' },
  { x: 3, y: 5, color: '#FFC800' },
  { x: 4, y: 5, color: '#FF9600' },
];

const hexToRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
const toHex = (r, g, b) =>
  '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('');
function lighten(hex, amount) {
  const [r, g, b] = hexToRgb(hex);
  const f = amount / 100;
  return toHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f);
}
function darken(hex, amount) {
  const [r, g, b] = hexToRgb(hex);
  const f = 1 - amount / 100;
  return toHex(r * f, g * f, b * f);
}

const SIZE = 2048;
const GRID_W = 5;
const GRID_H = 6;
const BLOCK = 266;
const GAP = 20;
const GRID_PX_W = GRID_W * BLOCK + (GRID_W - 1) * GAP;
const GRID_PX_H = GRID_H * BLOCK + (GRID_H - 1) * GAP;
const OFFSET_X = (SIZE - GRID_PX_W) / 2;
const OFFSET_Y = (SIZE - GRID_PX_H) / 2;
const RADIUS = 40;

function blocksSvg(colorFn) {
  return ROOK_BLOCKS.map((b, i) => {
    const base = colorFn(b.color, i);
    const top = lighten(base, 18);
    const mid = lighten(base, 12);
    const bot = darken(base, 12);
    const gradId = `g${i}`;
    const x = OFFSET_X + b.x * (BLOCK + GAP);
    const y = OFFSET_Y + b.y * (BLOCK + GAP);
    return `
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${top}"/>
          <stop offset="20%" stop-color="${mid}"/>
          <stop offset="40%" stop-color="${base}"/>
          <stop offset="100%" stop-color="${bot}"/>
        </linearGradient>
      </defs>
      <rect x="${x}" y="${y}" width="${BLOCK}" height="${BLOCK}" rx="${RADIUS}" fill="url(#${gradId})"/>
    `;
  }).join('\n');
}

const variants = [
  { name: 'color', fn: (c) => c },
  { name: 'black', fn: () => '#1A1A1A' },
  { name: 'green', fn: () => '#58CC02' },
  { name: 'gold', fn: () => '#D4AF37' },
  { name: 'white', fn: () => '#FFFFFF' },
];

const outDir = '/Users/tyler.schwartz/chess-learning-tree/public/event/merch';

for (const v of variants) {
  const inner = blocksSvg(v.fn);
  const svgTransparent = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${inner}</svg>`;
  const svgWhite = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="#FFFFFF"/>${inner}</svg>`;
  await sharp(Buffer.from(svgTransparent)).png().toFile(`${outDir}/logo-${v.name}.png`);
  await sharp(Buffer.from(svgWhite)).jpeg({ quality: 95 }).toFile(`${outDir}/logo-${v.name}-white-bg.jpg`);
  if (v.name === 'white') {
    const svgBlack = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="#1A1A1A"/>${inner}</svg>`;
    await sharp(Buffer.from(svgBlack)).jpeg({ quality: 95 }).toFile(`${outDir}/logo-white-black-bg.jpg`);
  }
  console.log(`wrote logo-${v.name}`);
}

// Wordmark: "Chess Path" stacked over "the fun way to learn chess"
// Two variants: light (for dark hats) and dark (for light hats).
const WM_W = 3000;
const WM_H = 1200;
const tagline = 'the fun way to learn chess';
const title = 'Chess Path';

function wordmarkSvg({ titleColor, taglineColor, bg }) {
  const bgRect = bg ? `<rect width="${WM_W}" height="${WM_H}" fill="${bg}"/>` : '';
  const titleSize = 520;
  const titleSpacing = -12;
  const taglineSize = 180;
  const taglineSpacing = 4;
  const titleW = textWidth(font900, title, titleSize, titleSpacing);
  const taglineW = textWidth(font700, tagline, taglineSize, taglineSpacing);
  const titleX = (WM_W - titleW) / 2;
  const taglineX = (WM_W - taglineW) / 2;
  const titleSvg = textPath(font900, title, titleX, WM_H * 0.58, titleSize, titleColor, titleSpacing);
  const taglineSvg = textPath(font700, tagline, taglineX, WM_H * 0.82, taglineSize, taglineColor, taglineSpacing);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WM_W}" height="${WM_H}" viewBox="0 0 ${WM_W} ${WM_H}">${bgRect}${titleSvg}${taglineSvg}</svg>`;
}

const wordmarks = [
  { name: 'wordmark-dark', titleColor: '#1A1A1A', taglineColor: '#58CC02', bg: null },
  { name: 'wordmark-light', titleColor: '#FFFFFF', taglineColor: '#FFC800', bg: null },
  { name: 'wordmark-dark-on-white', titleColor: '#1A1A1A', taglineColor: '#58CC02', bg: '#FFFFFF' },
];

for (const w of wordmarks) {
  const svg = wordmarkSvg(w);
  await sharp(Buffer.from(svg)).png().toFile(`${outDir}/${w.name}.png`);
  console.log(`wrote ${w.name}`);
}

// Single-line horizontal wordmark: "chesspath.app" — sized for hat embroidery
// (dad hat front, beanie cuff, trucker back strap).
const URL_TEXT = 'chesspath.app';
const URL_FONT_SIZE = 600;
const URL_SPACING = -6;
const URL_PAD_X = 80;
const URL_PAD_Y = 80;
const urlTextW = textWidth(font900, URL_TEXT, URL_FONT_SIZE, URL_SPACING);
const URL_W = Math.ceil(urlTextW + URL_PAD_X * 2);
const URL_H = Math.ceil(URL_FONT_SIZE + URL_PAD_Y * 2);

function urlmarkSvg(color, bg) {
  const bgRect = bg ? `<rect width="${URL_W}" height="${URL_H}" fill="${bg}"/>` : '';
  const textSvg = textPath(font900, URL_TEXT, URL_PAD_X, URL_PAD_Y + URL_FONT_SIZE * 0.82, URL_FONT_SIZE, color, URL_SPACING);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${URL_W}" height="${URL_H}" viewBox="0 0 ${URL_W} ${URL_H}">${bgRect}${textSvg}</svg>`;
}

const urlmarks = [
  { name: 'urlmark-black', color: '#1A1A1A', bg: null },
  { name: 'urlmark-white', color: '#FFFFFF', bg: null },
  { name: 'urlmark-green', color: '#58CC02', bg: null },
  { name: 'urlmark-gold', color: '#D4AF37', bg: null },
];

for (const u of urlmarks) {
  const svg = urlmarkSvg(u.color, u.bg);
  await sharp(Buffer.from(svg)).png().toFile(`${outDir}/${u.name}.png`);
  console.log(`wrote ${u.name}`);
}

// Lockup: rook + wordmark side-by-side (for wide prints like back-of-shirt).
const LU_W = 4000;
const LU_H = 1600;
function lockupSvg(colorFn, titleColor, taglineColor) {
  const rookSize = 1400;
  const rookScale = rookSize / SIZE;
  const rookX = 120;
  const rookY = (LU_H - rookSize) / 2;
  const rookInner = blocksSvg(colorFn);
  const textX = rookX + rookSize + 120;
  const titleSvg = textPath(font900, title, textX, 880, 440, titleColor, -8);
  const taglineSvg = textPath(font700, tagline, textX, 1060, 140, taglineColor, 3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${LU_W}" height="${LU_H}" viewBox="0 0 ${LU_W} ${LU_H}"><g transform="translate(${rookX},${rookY}) scale(${rookScale})">${rookInner}</g>${titleSvg}${taglineSvg}</svg>`;
}

const lockups = [
  { name: 'lockup-color', fn: (c) => c, title: '#1A1A1A', tagline: '#58CC02' },
  { name: 'lockup-black', fn: () => '#1A1A1A', title: '#1A1A1A', tagline: '#1A1A1A' },
  { name: 'lockup-white', fn: () => '#FFFFFF', title: '#FFFFFF', tagline: '#FFFFFF' },
];

for (const l of lockups) {
  const svg = lockupSvg(l.fn, l.title, l.tagline);
  await sharp(Buffer.from(svg)).png().toFile(`${outDir}/${l.name}.png`);
  console.log(`wrote ${l.name}`);
}

console.log('done');
