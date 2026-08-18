// One-off: render Rookie's Revenge mark → public/revenge/{mark.svg, icon-1024.png, icon-512.png, icon-180.png}
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import sharp from 'sharp';
import fs from 'fs';
import { RevengeMarkSvg } from '../components/run/RookiesRevengeLogo';

const markSvg = renderToStaticMarkup(React.createElement(RevengeMarkSvg, { size: 200 }));
fs.writeFileSync('public/revenge/mark.svg', markSvg);
// iOS icon: white square, mark at 84% (Apple masks the corners itself)
const icon = (s: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 200 200"><rect width="200" height="200" fill="#fff"/><g transform="translate(16 16) scale(0.84)">${markSvg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g></svg>`;
(async () => {
  for (const s of [1024, 512, 180]) {
    await sharp(Buffer.from(icon(s))).png().toFile(`public/revenge/icon-${s}.png`);
  }
  await sharp(Buffer.from(markSvg), { density: 400 }).resize(1024, 1024).png().toFile('public/revenge/mark-1024.png');
  console.log('done', fs.readdirSync('public/revenge'));
})();
