'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ROOK_BLOCKS, getMatteBackground } from '@/lib/daily-rook-blocks';

const BLOCK_MAP = new Map(ROOK_BLOCKS.map(b => [`${b.x},${b.y}`, b]));
const ALL_CELLS = Array.from({ length: 30 }, (_, i) => ({
  x: i % 5,
  y: Math.floor(i / 5),
}));
const CENTER_X = 2;
const CENTER_Y = 2.5;

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

type ComboId =
  | 'raveRepel' | 'fireSpotlight' | 'dnaElastic' | 'tornadoPaint'
  | 'earthquakeHeat' | 'supernovaRipple' | 'jellyGrow' | 'matrixFreeze'
  | 'auroraWave' | 'cosmicOrbit' | 'heartbeatInflate' | 'glitchFlick'
  | 'campfireAttract' | 'sonarPuppet' | 'blackholeSpiral' | 'crystalSearch'
  | 'fireworkBowl' | 'plasmaVortex' | 'snakeDrum' | 'galaxyHover';

interface ComboMeta {
  id: ComboId;
  label: string;
  description: string;
  anim: string;
  interact: string;
}

const COMBOS: ComboMeta[] = [
  { id: 'raveRepel', label: 'Rave Repel', description: 'Rave strobing + blocks flee your cursor', anim: 'Rave', interact: 'Force Field' },
  { id: 'fireSpotlight', label: 'Fire Spotlight', description: 'Campfire flicker revealed only by cursor light', anim: 'Campfire', interact: 'Spotlight' },
  { id: 'dnaElastic', label: 'DNA Elastic', description: 'Helix rotation + drag to stretch like rubber', anim: 'DNA Helix', interact: 'Elastic' },
  { id: 'tornadoPaint', label: 'Tornado Paint', description: 'Vortex spins + drag to paint rainbow trails', anim: 'Tornado', interact: 'Paint' },
  { id: 'earthquakeHeat', label: 'Quake Heat', description: 'Shaking ground + cursor heats blocks red', anim: 'Earthquake', interact: 'Heat' },
  { id: 'supernovaRipple', label: 'Nova Ripple', description: 'Supernova cycle + click sends shockwaves', anim: 'Supernova', interact: 'Ripple' },
  { id: 'jellyGrow', label: 'Jelly Grow', description: 'Wobbly jelly physics + cursor inflates blocks', anim: 'Jellyfish', interact: 'Grow' },
  { id: 'matrixFreeze', label: 'Matrix Freeze', description: 'Digital rain + hover freezes blocks in ice', anim: 'Matrix Rain', interact: 'Freeze' },
  { id: 'auroraWave', label: 'Aurora Wave', description: 'Northern lights + mouse controls wave amplitude', anim: 'Aurora', interact: 'Wave' },
  { id: 'cosmicOrbit', label: 'Cosmic Orbit', description: 'Drifting particles + blocks orbit your cursor', anim: 'Cosmic Dust', interact: 'Orbit' },
  { id: 'heartbeatInflate', label: 'Heart Inflate', description: 'Heartbeat pulse + hold to inflate until pop', anim: 'Heartbeat', interact: 'Inflate' },
  { id: 'glitchFlick', label: 'Glitch Flick', description: 'Glitch storm + flick blocks with fast mouse', anim: 'Glitch Storm', interact: 'Flick' },
  { id: 'campfireAttract', label: 'Moth to Flame', description: 'Campfire glow + blocks pull toward cursor', anim: 'Campfire', interact: 'Magnet' },
  { id: 'sonarPuppet', label: 'Sonar Puppet', description: 'Sonar pings + blocks tilt watching your cursor', anim: 'Sonar', interact: 'Puppeteer' },
  { id: 'blackholeSpiral', label: 'Black Hole Vortex', description: 'Gravity vortex + click to create singularities', anim: 'Black Hole', interact: 'Black Hole' },
  { id: 'crystalSearch', label: 'Crystal Search', description: 'Crystal growing + searchlight cone reveals', anim: 'Crystal Grow', interact: 'Searchlight' },
  { id: 'fireworkBowl', label: 'Firework Bowl', description: 'Firework explosions + bowling ball scatters', anim: 'Firework', interact: 'Bowling' },
  { id: 'plasmaVortex', label: 'Plasma Vortex', description: 'Plasma tendrils + tornado vortex at cursor', anim: 'Plasma Ball', interact: 'Tornado' },
  { id: 'snakeDrum', label: 'Snake Drum', description: 'Snake trail + each block is a drum pad', anim: 'Snake', interact: 'Drum Pad' },
  { id: 'galaxyHover', label: 'Galaxy Hover', description: 'Spiral galaxy + tilt the whole thing with cursor', anim: 'Galaxy Spiral', interact: 'Hoverboard' },
];

interface BlockState {
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  opacity: number;
  brightness: number;
  hueShift: number;
  skewX: number;
  skewY: number;
  blur: number;
  colorOverride?: string;
}

function ds(): BlockState {
  return { offsetX: 0, offsetY: 0, scale: 1, rotation: 0, opacity: 1, brightness: 1, hueShift: 0, skewX: 0, skewY: 0, blur: 0 };
}

interface MouseState {
  x: number;
  y: number;
  down: boolean;
  clickX: number;
  clickY: number;
  clickTime: number;
  velocity: number;
}

function computeCombo(
  combo: ComboId, x: number, y: number, blockIdx: number,
  t: number, mouse: MouseState, blockSize: number,
  gridWidth: number, gridHeight: number,
): BlockState {
  const state = ds();
  const dist = Math.sqrt((x - CENTER_X) ** 2 + (y - CENTER_Y) ** 2);
  const maxDist = 3.2;
  const normDist = dist / maxDist;
  const angle = Math.atan2(y - CENTER_Y, x - CENTER_X);
  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const bx = (x * (blockSize + gap) + blockSize / 2) / gridWidth;
  const by = (y * (blockSize + gap) + blockSize / 2) / gridHeight;
  const dx = mouse.x - bx;
  const dy = mouse.y - by;
  const mDist = Math.sqrt(dx * dx + dy * dy) + 0.001;
  const mAngle = Math.atan2(dy, dx);
  const timeSinceClick = t - mouse.clickTime;
  const clickDx = mouse.clickX - bx;
  const clickDy = mouse.clickY - by;
  const clickDist = Math.sqrt(clickDx * clickDx + clickDy * clickDy) + 0.001;

  switch (combo) {
    case 'raveRepel': {
      // Rave colors + repel from cursor
      const beat = t % 0.5;
      const beatHit = beat < 0.08;
      state.hueShift = (t * 200 + x * 60 + y * 80) % 360;
      state.brightness = beatHit ? 2.5 : 0.8 + Math.sin(t * 12 + normDist * 4) * 0.5;
      if (Math.sin(t * 20) > 0.9) { state.brightness = 3; state.colorOverride = '#ffffff'; }
      // Repel
      const force = Math.max(0, 0.3 - mDist) * 200;
      state.offsetX = -Math.cos(mAngle) * force;
      state.offsetY = -Math.sin(mAngle) * force;
      state.scale = (beatHit ? 1.3 : 1) + Math.max(0, 0.2 - mDist) * 2;
      break;
    }

    case 'fireSpotlight': {
      // Campfire colors but only visible in spotlight
      const flameHeight = 1 - y / 5;
      const flicker = seededRandom(Math.floor(t * 12) + blockIdx) * 0.4;
      const fireHue = 0 + flameHeight * 50;
      state.colorOverride = hslToHex(fireHue + flicker * 20, 90 - flameHeight * 20, 30 + flameHeight * 30 + flicker * 15);
      state.offsetY = -flameHeight * Math.sin(t * 3 + x * 2) * 8;
      state.offsetX = Math.sin(t * 2 + y * 1.5 + x) * flameHeight * 5;
      // Spotlight mask
      const radius2 = 0.25;
      const inLight = mDist < radius2;
      const falloff = inLight ? 1 - mDist / radius2 : 0;
      state.brightness = (0.5 + flameHeight * 0.8 + flicker) * (0.05 + falloff * 0.95);
      state.opacity = 0.1 + falloff * 0.9;
      break;
    }

    case 'dnaElastic': {
      // DNA helix base
      const helixPhase = t * 1.5 + y * 0.8;
      const strand = x < CENTER_X ? -1 : x > CENTER_X ? 1 : 0;
      const depth = Math.sin(helixPhase + strand * Math.PI);
      state.offsetX = depth * 20 * (strand || Math.sin(helixPhase * 2));
      state.scale = 0.7 + 0.3 * (1 + depth) / 2;
      state.brightness = 0.5 + (1 + depth) / 2;
      state.hueShift = depth * 60;
      // Elastic — drag and stretch
      if (mouse.down && mDist < 0.3) {
        const stretch = (0.3 - mDist) / 0.3;
        state.offsetX += dx * gridWidth * stretch * 0.3;
        state.offsetY = dy * gridHeight * stretch * 0.3;
        state.skewX = dx * 15;
        state.brightness += stretch * 0.5;
      }
      break;
    }

    case 'tornadoPaint': {
      // Tornado spin base
      const height = 1 - y / 5;
      const funnelWidth = 0.3 + height * 0.7;
      const spinSpeed = 2 + height * 3;
      const spiralAngle = t * spinSpeed + blockIdx * 0.5;
      state.offsetX = Math.cos(spiralAngle) * funnelWidth * 30;
      state.offsetY = Math.sin(spiralAngle) * funnelWidth * 5 - height * 10;
      state.rotation = t * spinSpeed * 15;
      state.brightness = 0.5 + height * 0.8;
      // Paint trail
      if (mouse.down && mDist < 0.15) {
        state.colorOverride = hslToHex((t * 50 + blockIdx * 20) % 360, 80, 55);
        state.brightness = 1.5;
      }
      break;
    }

    case 'earthquakeHeat': {
      // Earthquake shake
      const quakePhase = Math.sin(t * 3);
      const quakeIntensity = (quakePhase + 1) / 2;
      const shake = quakeIntensity * 8;
      state.offsetX = Math.sin(t * 30 + y * 5) * shake;
      state.offsetY = Math.cos(t * 25 + x * 4) * shake * 0.5;
      state.brightness = 1 + quakeIntensity * 0.2;
      // Heat from cursor
      const heatRadius = 0.2;
      if (mDist < heatRadius) {
        const heat = 1 - mDist / heatRadius;
        const hue = (1 - heat) * 240;
        state.colorOverride = hslToHex(hue, 80, 35 + heat * 25);
        state.brightness += heat * 0.8;
        state.scale = 1 + heat * 0.1;
      }
      break;
    }

    case 'supernovaRipple': {
      // Supernova cycle
      const cycle = t % 5;
      if (cycle < 2.5) {
        const build = cycle / 2.5;
        state.offsetX = Math.sin(t * 20 * build + blockIdx) * build * 4;
        state.offsetY = Math.cos(t * 18 * build + blockIdx) * build * 3;
        state.brightness = 1 + build * 1.5;
        state.hueShift = build * 60;
      } else if (cycle < 3.0) {
        const flash = (cycle - 2.5) / 0.5;
        state.scale = 1.3 + flash * 1.5;
        state.brightness = 3 - flash;
        state.colorOverride = '#ffffff';
        state.offsetX = (x - CENTER_X) * flash * 50;
        state.offsetY = (y - CENTER_Y) * flash * 50;
      } else {
        const collapse = (cycle - 3.0) / 2.0;
        state.offsetX = (x - CENTER_X) * (1 - collapse) * 40;
        state.offsetY = (y - CENTER_Y) * (1 - collapse) * 40;
        state.brightness = 0.3 + collapse * 0.7;
        state.scale = 0.5 + collapse * 0.5;
      }
      // Ripple on click
      if (timeSinceClick < 2) {
        const rippleR = timeSinceClick * 0.5;
        const rippleDist = Math.abs(clickDist - rippleR);
        if (rippleDist < 0.08) {
          const ri = (1 - rippleDist / 0.08) * Math.exp(-timeSinceClick * 1.5);
          state.offsetY -= ri * 15;
          state.brightness += ri * 2;
          state.scale += ri * 0.2;
        }
      }
      break;
    }

    case 'jellyGrow': {
      // Jellyfish wave
      const w1 = Math.sin(t * 1.2 + x * 0.5 + y * 0.8);
      const w2 = Math.sin(t * 0.8 - y * 0.6 + x * 0.3);
      const tentacle = Math.sin(t * 2 + y * 1.5) * (y / 5);
      state.offsetX = w1 * 6 + tentacle * 4;
      state.offsetY = w2 * 8 + Math.sin(t * 0.5) * 10 * (y / 5);
      state.brightness = 0.7 + (w1 + 1) * 0.3;
      state.hueShift = w2 * 30 + y * 15;
      // Grow near cursor
      const growFactor = Math.max(0, 0.35 - mDist) / 0.35;
      state.scale = (1 + w1 * 0.06) * (0.6 + growFactor * 1.2);
      state.brightness += growFactor * 0.8;
      break;
    }

    case 'matrixFreeze': {
      // Matrix rain
      const colSpeed = 1.5 + (x * 0.3);
      const cyclePos = ((t * colSpeed + y * 0.3) % 3);
      state.offsetY = cyclePos < 1 ? cyclePos * 30 : 0;
      state.brightness = cyclePos < 0.3 ? 1.8 : 0.5;
      state.colorOverride = cyclePos < 0.3 ? '#00ff41' : cyclePos < 0.6 ? '#00cc33' : undefined;
      // Freeze near cursor
      if (mDist < 0.2) {
        state.colorOverride = hslToHex(200, 50, 65);
        state.brightness = 1.2;
        state.offsetY = 0; // frozen in place
        state.scale = 1.05;
      }
      break;
    }

    case 'auroraWave': {
      // Aurora colors
      const wave = Math.sin(t * 0.5 + x * 0.8 + y * 0.3);
      const wave2 = Math.sin(t * 0.3 - x * 0.5 + y * 0.6);
      const shimmer = (wave + wave2) / 2;
      state.colorOverride = hslToHex((120 + wave * 60 + t * 20) % 360, 70 + shimmer * 30, 40 + shimmer * 20);
      // Wave amplitude from mouse Y
      const amplitude = (mouse.y - 0.5) * 30;
      state.offsetY = Math.sin(t * 3 + x * 0.8) * amplitude + shimmer * 5;
      state.brightness = 0.5 + (shimmer + 1) * 0.5;
      state.scale = 1 + shimmer * 0.04;
      state.hueShift = mouse.x * 120;
      break;
    }

    case 'cosmicOrbit': {
      // Cosmic dust expansion
      const expansion = (Math.sin(t * 0.2) + 1) / 2;
      const driftAngle = angle + seededRandom(blockIdx * 7) * 0.5;
      const driftDist = normDist * expansion * 20 * (0.3 + seededRandom(blockIdx * 13) * 0.7);
      state.offsetX = Math.cos(driftAngle + t * 0.1) * driftDist;
      state.offsetY = Math.sin(driftAngle + t * 0.1) * driftDist;
      state.colorOverride = hslToHex((270 + seededRandom(blockIdx * 19) * 120) % 360, 60 + expansion * 30, 20 + (1 - expansion) * 40);
      // Orbit cursor
      if (mDist < 0.4) {
        const orbitSpeed = 2 + (0.4 - mDist) * 6;
        const orbitA = mAngle + t * orbitSpeed;
        const orbitR = mDist * gridWidth * 0.2;
        state.offsetX += Math.cos(orbitA) * orbitR - dx * gridWidth * 0.5;
        state.offsetY += Math.sin(orbitA) * orbitR * 0.5 - dy * gridHeight * 0.3;
        state.brightness = 0.5 + (0.4 - mDist) * 2;
      } else {
        state.brightness = 0.3 + (1 - expansion) * 0.5;
      }
      break;
    }

    case 'heartbeatInflate': {
      // Heartbeat base
      const beatCycle = t % 1.2;
      let beatScale = 1;
      if (beatCycle < 0.1) beatScale = 1 + 0.2 * (beatCycle / 0.1);
      else if (beatCycle < 0.2) beatScale = 1.2 - 0.1 * ((beatCycle - 0.1) / 0.1);
      else if (beatCycle < 0.3) beatScale = 1.1 + 0.15 * ((beatCycle - 0.2) / 0.1);
      else if (beatCycle < 0.5) beatScale = 1.25 - 0.25 * ((beatCycle - 0.3) / 0.2);
      state.scale = beatScale;
      state.brightness = 0.8 + beatScale * 0.4;
      state.hueShift = beatScale > 1.1 ? -20 : 0;
      // Inflate near cursor
      if (mouse.down && mDist < 0.25) {
        const inflateAmt = Math.min(1.5, (0.25 - mDist) / 0.25 * 1.5);
        state.scale *= (1 + inflateAmt * 0.6);
        state.brightness += inflateAmt * 0.5;
        if (inflateAmt > 1) {
          state.offsetX = Math.sin(t * 20 + blockIdx) * 2;
          state.colorOverride = hslToHex(0, 80, 50);
        }
      }
      break;
    }

    case 'glitchFlick': {
      // Glitch base
      const glitchChance = Math.sin(t * 13 + x * 7 + y * 11);
      if (glitchChance > 0.3) {
        state.hueShift = seededRandom(Math.floor(t * 50) + blockIdx) * 360;
        state.scale = 0.8 + seededRandom(Math.floor(t * 80) + blockIdx) * 0.6;
      }
      if (Math.sin(t * 5 + y * 2) > 0.7) {
        state.offsetX = Math.sin(t * 5 + y * 2) * 8;
        state.brightness = 1.5;
      }
      // Flick physics
      const speed = mouse.velocity * 300;
      if (speed > 2 && mDist < 0.2) {
        const flickForce = Math.min(1, speed / 10) * (1 - mDist / 0.2);
        state.offsetX += Math.cos(mAngle) * flickForce * 30;
        state.offsetY += Math.sin(mAngle) * flickForce * 25;
        state.brightness = 2;
      }
      break;
    }

    case 'campfireAttract': {
      // Campfire
      const fh = 1 - y / 5;
      const fl = seededRandom(Math.floor(t * 12) + blockIdx) * 0.4;
      state.colorOverride = hslToHex(fh * 50 + fl * 20, 90 - fh * 20, 30 + fh * 30 + fl * 15);
      state.offsetY = -fh * Math.sin(t * 3 + x * 2) * 6;
      state.offsetX = Math.sin(t * 2 + y * 1.5 + x) * fh * 4;
      state.brightness = 0.5 + fh * 0.8 + fl;
      // Attract to cursor (moth to flame)
      const pull = Math.max(0, 0.5 - mDist) * 50;
      state.offsetX += Math.cos(mAngle) * pull;
      state.offsetY += Math.sin(mAngle) * pull;
      break;
    }

    case 'sonarPuppet': {
      // Sonar ping
      const pingAge = (t % 2) * 1.5;
      const ringDist = Math.abs(normDist - pingAge * 0.5);
      const onRing = ringDist < 0.15;
      if (onRing) {
        const ri2 = 1 - ringDist / 0.15;
        state.brightness = 0.5 + ri2 * 2;
        state.colorOverride = hslToHex(160, 80, 30 + ri2 * 40);
      } else {
        state.brightness = 0.25;
      }
      if (normDist < 0.2 && pingAge < 0.2) {
        state.brightness = 3; state.scale = 1.3;
      }
      // Puppeteer — blocks watch cursor
      const lookAngle = Math.atan2(dy, dx);
      const lookStrength = Math.min(1, 0.4 / (mDist + 0.1));
      state.skewX = Math.cos(lookAngle) * lookStrength * 12;
      state.skewY = Math.sin(lookAngle) * lookStrength * 6;
      state.rotation = Math.cos(lookAngle) * lookStrength * 5;
      break;
    }

    case 'blackholeSpiral': {
      // Background spiral
      const pullStrength = (Math.sin(t * 0.5) + 1) / 2;
      const spiralAngle2 = angle + t * 1.5 + normDist * 3;
      const pullDist = normDist * (1 - pullStrength * 0.5);
      state.offsetX = Math.cos(spiralAngle2) * pullDist * 25;
      state.offsetY = Math.sin(spiralAngle2) * pullDist * 25;
      state.rotation = t * 60 * (1 - normDist);
      state.brightness = 0.3 + pullDist * 0.8;
      // Click creates extra singularity
      if (timeSinceClick < 3) {
        const clickPull = Math.exp(-timeSinceClick * 0.8) * 100;
        const cf = clickPull / (clickDist * 10 + 1);
        state.offsetX += (clickDx / clickDist) * cf;
        state.offsetY += (clickDy / clickDist) * cf;
        state.scale = Math.max(0.2, 1 - cf * 0.008);
        state.brightness += cf * 0.015;
      }
      break;
    }

    case 'crystalSearch': {
      // Crystal growing from center
      const growFront = (t * 0.5) % 2;
      const myD = normDist * 2;
      if (myD < growFront) {
        state.colorOverride = hslToHex(200 + (growFront - myD) * 30, 60, 50 + Math.sin(t * 3 + blockIdx) * 10);
        state.brightness = 1;
      } else if (myD < growFront + 0.2) {
        state.brightness = 3 - ((myD - growFront) / 0.2) * 2;
        state.colorOverride = '#aaddff';
      } else {
        state.opacity = 0.1;
        state.brightness = 0.2;
      }
      // Searchlight cone
      const lightAngle = Math.atan2(mouse.y - 1, mouse.x - 0.5);
      const blockA = Math.atan2(by - 1, bx - 0.5);
      let aDiff = Math.abs(lightAngle - blockA);
      if (aDiff > Math.PI) aDiff = Math.PI * 2 - aDiff;
      if (aDiff < 0.3) {
        const coneI = 1 - aDiff / 0.3;
        state.brightness = Math.max(state.brightness, coneI * 2.5);
        state.opacity = Math.max(state.opacity, 0.3 + coneI * 0.7);
      }
      break;
    }

    case 'fireworkBowl': {
      // Firework cycle
      const fc = t % 3;
      if (fc < 0.5) {
        const g = fc / 0.5;
        state.offsetX = -(x - CENTER_X) * blockSize * g * 0.5;
        state.offsetY = -(y - CENTER_Y) * blockSize * g * 0.5;
        state.brightness = 1 + g;
      } else if (fc < 1.2) {
        const e = (fc - 0.5) / 0.7;
        state.offsetX = (x - CENTER_X) * 25 * e;
        state.offsetY = (y - CENTER_Y) * 25 * e;
        state.brightness = 2.5 - e;
        state.hueShift = e * 120;
        state.rotation = e * 120 * (x > CENTER_X ? 1 : -1);
      } else {
        const s2 = (fc - 1.2) / 1.8;
        state.offsetX = (x - CENTER_X) * 25 * (1 - s2) * (1 - s2);
        state.offsetY = (y - CENTER_Y) * 25 * (1 - s2) * (1 - s2);
        state.brightness = 1;
      }
      // Bowling ball on click
      if (timeSinceClick < 3) {
        const ballX = timeSinceClick * 0.4;
        const ballY = mouse.clickY;
        const toBall = Math.sqrt((bx - ballX) ** 2 + (by - ballY) ** 2);
        if (toBall < 0.12 && ballX < bx + 0.05) {
          const hitA = Math.atan2(by - ballY, bx - ballX);
          const hitF = (0.12 - toBall) / 0.12;
          const age = Math.max(0, timeSinceClick - bx / 0.4);
          state.offsetX += Math.cos(hitA) * hitF * age * 60;
          state.offsetY += Math.sin(hitA) * hitF * age * 40;
          state.rotation += age * hitF * 200;
        }
      }
      break;
    }

    case 'plasmaVortex': {
      // Plasma tendrils
      const tendrilCount = 5;
      const tendrilReach = (Math.sin(t * 2) + 1) / 2;
      const onTendril = Math.abs(Math.sin(angle * tendrilCount - t * 3)) < 0.3 + tendrilReach * 0.2;
      if (normDist < 0.25) {
        state.brightness = 2; state.colorOverride = '#ff88ff';
      } else if (onTendril && normDist < tendrilReach + 0.3) {
        state.brightness = 1 + (1 - normDist) * 1.2;
        state.colorOverride = hslToHex(280 + normDist * 40, 80, 45 + (1 - normDist) * 25);
      } else {
        state.brightness = 0.15;
      }
      // Tornado at cursor
      if (mDist < 0.35) {
        const strength = (0.35 - mDist) / 0.35;
        const orbitA = mAngle + t * 5 * strength;
        const orbitR = mDist * gridWidth * 0.3;
        state.offsetX = Math.cos(orbitA) * orbitR - dx * gridWidth * 0.5;
        state.offsetY = Math.sin(orbitA) * orbitR - dy * gridHeight * 0.3;
        state.rotation = orbitA * 30;
        state.brightness = Math.max(state.brightness, 0.5 + strength * 1.5);
      }
      break;
    }

    case 'snakeDrum': {
      // Snake trail
      const snakeLen = 6;
      const snakePos = (t * 6) % 22;
      const bPos = blockIdx % 22;
      const distFromSnake = Math.min(Math.abs(bPos - snakePos), Math.abs(bPos - snakePos + 22), Math.abs(bPos - snakePos - 22));
      if (distFromSnake < snakeLen) {
        const si = 1 - distFromSnake / snakeLen;
        state.brightness = 0.4 + si * 1.5;
        state.colorOverride = hslToHex((t * 50 + si * 60) % 360, 80, 45 + si * 15);
      } else {
        state.brightness = 0.2;
      }
      // Drum pad on hover
      if (mDist < 0.1) {
        const hitAge = (t * 2 + blockIdx) % 0.5;
        if (hitAge < 0.15) {
          const hit = hitAge / 0.15;
          state.scale = 1.3 - hit * 0.3;
          state.brightness = 2.5 - hit * 1.5;
          state.offsetY = -4 * (1 - hit);
          state.colorOverride = hslToHex((blockIdx * 47) % 360, 80, 55);
        }
      }
      break;
    }

    case 'galaxyHover': {
      // Galaxy spiral
      const armCount = 2;
      const galAngle = angle + t * 0.3;
      const spiralFit = Math.sin(galAngle * armCount / (Math.PI * 2) * Math.PI * 2 - normDist * 1.5 * Math.PI);
      const onArm = spiralFit > 0.3;
      state.offsetX = Math.cos(galAngle + normDist * 2) * normDist * 10;
      state.offsetY = Math.sin(galAngle + normDist * 2) * normDist * 6;
      state.brightness = onArm ? 0.8 + spiralFit * 0.8 : 0.15;
      if (onArm) state.colorOverride = hslToHex(220 + spiralFit * 40, 70, 50 + spiralFit * 15);
      state.rotation = t * 8;
      // Hoverboard tilt
      const tiltX = (mouse.x - 0.5) * 2;
      const tiltY = (mouse.y - 0.5) * 2;
      state.skewX = tiltX * 10;
      state.skewY = tiltY * 5;
      state.offsetY += -4 + tiltY * 3;
      state.offsetX += tiltX * 4;
      break;
    }
  }

  return state;
}

// ─── Combo Rook ───
function ComboRook({ combo, blockSize = 24 }: { combo: ComboId; blockSize?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const mouseRef = useRef<MouseState>({ x: 0.5, y: 0.5, down: false, clickX: 0.5, clickY: 0.5, clickTime: -10, velocity: 0 });
  const prevRef = useRef({ x: 0.5, y: 0.5 });

  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const radius = Math.max(1, Math.round(blockSize * 0.14));
  const gridWidth = 5 * blockSize + 4 * gap;
  const gridHeight = 6 * blockSize + 5 * gap;
  const scale = blockSize / 14;
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  const insetShadow = `inset 0 ${s(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${s(0.75)} 0 rgba(255,255,255,0.15)`;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    const p = prevRef.current;
    mouseRef.current.velocity = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
    mouseRef.current.x = mx;
    mouseRef.current.y = my;
    prevRef.current = { x: mx, y: my };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.clickX = (e.clientX - rect.left) / rect.width;
    mouseRef.current.clickY = (e.clientY - rect.top) / rect.height;
    mouseRef.current.clickTime = (performance.now() - startRef.current) / 1000;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !e.touches[0]) return;
    const mx = (e.touches[0].clientX - rect.left) / rect.width;
    const my = (e.touches[0].clientY - rect.top) / rect.height;
    const p = prevRef.current;
    mouseRef.current.velocity = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
    mouseRef.current.x = mx;
    mouseRef.current.y = my;
    prevRef.current = { x: mx, y: my };
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !e.touches[0]) return;
    const mx = (e.touches[0].clientX - rect.left) / rect.width;
    const my = (e.touches[0].clientY - rect.top) / rect.height;
    mouseRef.current.x = mx;
    mouseRef.current.y = my;
    mouseRef.current.down = true;
    mouseRef.current.clickX = mx;
    mouseRef.current.clickY = my;
    mouseRef.current.clickTime = (performance.now() - startRef.current) / 1000;
    prevRef.current = { x: mx, y: my };
  }, []);

  const handleTouchEnd = useCallback(() => {
    mouseRef.current.down = false;
  }, []);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      setTime((now - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [combo]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseDown={() => { mouseRef.current.down = true; }}
      onMouseUp={() => { mouseRef.current.down = false; }}
      onMouseLeave={() => { mouseRef.current.down = false; }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative', width: gridWidth, height: gridHeight, transform: 'translate3d(0,0,0)', cursor: 'crosshair', touchAction: 'none' }}
    >
      {ALL_CELLS.map(({ x, y }) => {
        const block = BLOCK_MAP.get(`${x},${y}`);
        if (!block) return null;
        const baseLeft = x * (blockSize + gap);
        const baseTop = y * (blockSize + gap);
        const idx = x + y * 5;
        const state = computeCombo(combo, x, y, idx, time, mouseRef.current, blockSize, gridWidth, gridHeight);
        const bgColor = state.colorOverride || block.color;
        return (
          <div
            key={`${x},${y}`}
            style={{
              position: 'absolute',
              left: baseLeft + state.offsetX,
              top: baseTop + state.offsetY,
              width: blockSize, height: blockSize,
              borderRadius: radius,
              background: getMatteBackground(bgColor),
              boxShadow: insetShadow,
              transform: `scale(${state.scale}) rotate(${state.rotation}deg) skewX(${state.skewX}deg) skewY(${state.skewY}deg)`,
              filter: `brightness(${state.brightness}) hue-rotate(${state.hueShift}deg)${state.blur ? ` blur(${state.blur}px)` : ''}`,
              opacity: state.opacity,
              transition: combo === 'glitchFlick' ? 'none' : 'left 0.03s, top 0.03s',
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Section ───
const PER_PAGE = 12;
const TOTAL_PAGES = Math.ceil(COMBOS.length / PER_PAGE);

export default function ComboSection() {
  const [selected, setSelected] = useState<ComboId | null>(null);
  const [page, setPage] = useState(0);
  const pageItems = COMBOS.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div>
      {selected ? (() => {
        const idx = COMBOS.findIndex(a => a.id === selected);
        const prev = idx > 0 ? COMBOS[idx - 1] : null;
        const next = idx < COMBOS.length - 1 ? COMBOS[idx + 1] : null;
        return (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 transition">Back to gallery</button>
            <div className="flex-1" />
            <button onClick={() => prev && setSelected(prev.id)} disabled={!prev} className="px-3 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition">Prev</button>
            <span className="text-xs text-white/30">{idx + 1}/{COMBOS.length}</span>
            <button onClick={() => next && setSelected(next.id)} disabled={!next} className="px-3 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition">Next</button>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white/[0.03] rounded-2xl p-4 sm:p-16 border border-white/[0.06]">
              <ComboRook combo={selected} blockSize={40} />
            </div>
            <div className="text-center max-w-md">
              <p className="text-lg font-medium text-white/80">{COMBOS[idx]?.label}</p>
              <p className="text-sm text-white/40 mt-1">{COMBOS[idx]?.description}</p>
              <p className="text-xs text-white/20 mt-2">{COMBOS[idx]?.anim} + {COMBOS[idx]?.interact}</p>
            </div>
          </div>
        </div>);
      })() : (
        <div>
          {TOTAL_PAGES > 1 && (
            <div className="flex items-center gap-2 mb-6">
              {Array.from({ length: TOTAL_PAGES }, (_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${page === i ? 'bg-indigo-500/30 text-indigo-300 ring-1 ring-indigo-500/50' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'}`}
                >{i + 1}</button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {pageItems.map(({ id, label, description, anim, interact }) => (
              <div key={id}
                className="flex flex-col items-center gap-2 sm:gap-3 bg-white/[0.03] rounded-xl p-3 sm:p-5 border border-white/[0.06] hover:border-white/[0.12] transition cursor-pointer"
                onClick={() => setSelected(id)}
              >
                <ComboRook combo={id} blockSize={18} />
                <div className="text-center">
                  <p className="text-xs font-medium text-white/80">{label}</p>
                  <p className="text-[10px] text-white/35 mt-0.5 line-clamp-2">{description}</p>
                  <p className="text-[9px] text-white/20 mt-0.5">{anim} + {interact}</p>
                </div>
              </div>
            ))}
          </div>
          {TOTAL_PAGES > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition">Previous</button>
              <span className="text-xs text-white/30">{page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, COMBOS.length)} of {COMBOS.length}</span>
              <button onClick={() => setPage(p => Math.min(TOTAL_PAGES - 1, p + 1))} disabled={page === TOTAL_PAGES - 1}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
