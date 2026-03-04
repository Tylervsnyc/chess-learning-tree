#!/usr/bin/env node
/**
 * One-off script: Add matte gradients to all brand SVG files.
 * Replaces flat fill="#COLOR" on rook blocks with fill="url(#g-HASH)" + gradient defs.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Color math (same as daily-rook-blocks.ts)
function hexToRgb(hex) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function lighten(hex, amount) {
  const [r, g, b] = hexToRgb(hex);
  const f = amount / 100;
  return rgbToHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f);
}
function darken(hex, amount) {
  const [r, g, b] = hexToRgb(hex);
  const f = 1 - amount / 100;
  return rgbToHex(r * f, g * f, b * f);
}

// 8 brand colors used in rook blocks
const BRAND_COLORS = ['#1CB0F6', '#2FCBEF', '#A560E8', '#58CC02', '#FFC800', '#FF9600', '#FF6B6B', '#FF4B4B'];

// Generate gradient SVG defs for all brand colors
function generateGradientDefs() {
  const gradients = BRAND_COLORS.map(color => {
    const id = `g-${color.slice(1)}`;
    return `    <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${lighten(color, 18)}"/>
      <stop offset="20%" stop-color="${lighten(color, 12)}"/>
      <stop offset="40%" stop-color="${color}"/>
      <stop offset="100%" stop-color="${darken(color, 12)}"/>
    </linearGradient>`;
  }).join('\n');
  return gradients;
}

function processIconSvg(filePath) {
  let svg = readFileSync(filePath, 'utf-8');
  const gradientDefs = generateGradientDefs();

  // Replace flat fills with gradient references
  for (const color of BRAND_COLORS) {
    const id = `g-${color.slice(1)}`;
    svg = svg.replaceAll(`fill="${color}"`, `fill="url(#${id})"`);
  }

  // Add defs block after the opening <svg> tag (icons don't have <defs>)
  if (!svg.includes('<defs>')) {
    svg = svg.replace(/(xmlns="[^"]*">)/, `$1\n  <defs>\n${gradientDefs}\n  </defs>`);
  } else {
    // Insert gradients into existing defs
    svg = svg.replace('</defs>', `${gradientDefs}\n  </defs>`);
  }

  writeFileSync(filePath, svg);
  console.log(`Updated: ${filePath}`);
}

const brandDir = join(process.cwd(), 'public/brand');

// Icon SVGs (no existing defs)
processIconSvg(join(brandDir, 'icon-32-favicon.svg'));
processIconSvg(join(brandDir, 'icon-48.svg'));
processIconSvg(join(brandDir, 'icon-96.svg'));

// Logo SVGs (have existing defs with pathGradient)
processIconSvg(join(brandDir, 'logo-horizontal-light.svg'));
processIconSvg(join(brandDir, 'logo-horizontal-dark.svg'));
processIconSvg(join(brandDir, 'logo-stacked-light.svg'));
processIconSvg(join(brandDir, 'logo-stacked-dark.svg'));

console.log('\nDone! All 7 SVGs updated with matte gradients.');
