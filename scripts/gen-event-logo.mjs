import sharp from 'sharp';

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

const blockSvgs = ROOK_BLOCKS.map((b, i) => {
  const top = lighten(b.color, 18);
  const mid = lighten(b.color, 12);
  const bot = darken(b.color, 12);
  const gradId = `g${i}`;
  const x = OFFSET_X + b.x * (BLOCK + GAP);
  const y = OFFSET_Y + b.y * (BLOCK + GAP);
  return `
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${top}"/>
        <stop offset="20%" stop-color="${mid}"/>
        <stop offset="40%" stop-color="${b.color}"/>
        <stop offset="100%" stop-color="${bot}"/>
      </linearGradient>
    </defs>
    <rect x="${x}" y="${y}" width="${BLOCK}" height="${BLOCK}" rx="${RADIUS}" fill="url(#${gradId})"/>
  `;
}).join('\n');

const svgTransparent = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  ${blockSvgs}
</svg>`;

const svgWhite = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="#FFFFFF"/>
  ${blockSvgs}
</svg>`;

const outDir = '/Users/tyler.schwartz/chess-learning-tree/public/event';

await sharp(Buffer.from(svgTransparent))
  .png()
  .toFile(`${outDir}/chess-path-logo.png`);

await sharp(Buffer.from(svgWhite))
  .jpeg({ quality: 95 })
  .toFile(`${outDir}/chess-path-logo.jpg`);

console.log('done');
