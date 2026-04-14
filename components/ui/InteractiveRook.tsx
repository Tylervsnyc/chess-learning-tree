'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ROOK_BLOCKS, getMatteBackground } from '@/lib/daily-rook-blocks';

// ─── Block Data ───
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

// ─── Interaction Modes ───
export type InteractiveModeId =
  | 'repel' | 'attract' | 'spotlight' | 'ripple' | 'paint'
  | 'gravity' | 'magnet' | 'tornado' | 'freeze' | 'grow'
  | 'xray' | 'blackhole' | 'fireworks' | 'elastic' | 'wave'
  | 'scatter' | 'orbit' | 'heat' | 'lightning' | 'bubble'
  | 'eraser' | 'pixelate' | 'trampoline' | 'tractor' | 'mirror'
  | 'smear' | 'whirlpool' | 'inflate' | 'revealer' | 'dominos'
  | 'antigravity' | 'shockwave' | 'colorDrain' | 'puppeteer' | 'earthquake2'
  | 'jellyPoke' | 'lavalamp2' | 'magnetSnap' | 'vaporize' | 'glueGun'
  | 'slingshot2' | 'stacking' | 'bowling' | 'flick' | 'seesaw'
  | 'searchlight' | 'suction' | 'catapult' | 'lasso' | 'timeSlow'
  | 'splitMerge' | 'rowing' | 'drumPad' | 'sponge' | 'wrecking'
  | 'squeegee' | 'claw' | 'vacuum' | 'hoverboard' | 'yoyo';

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

function defaultState(): BlockState {
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

interface BlockPhysics {
  vx: number;
  vy: number;
  px: number;
  py: number;
  heat: number;
  frozen: boolean;
  popped: boolean;
  painted: number;
}

function computeBlock(
  mode: InteractiveModeId, x: number, y: number, blockIdx: number,
  mouse: MouseState, t: number, physics: BlockPhysics,
  blockSize: number, gridWidth: number, gridHeight: number,
): BlockState {
  const state = defaultState();
  const gap = Math.max(1, Math.round(blockSize * 0.15));

  const bx = (x * (blockSize + gap) + blockSize / 2) / gridWidth;
  const by = (y * (blockSize + gap) + blockSize / 2) / gridHeight;

  const dx = mouse.x - bx;
  const dy = mouse.y - by;
  const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
  const angle = Math.atan2(dy, dx);

  const clickDx = mouse.clickX - bx;
  const clickDy = mouse.clickY - by;
  const clickDist = Math.sqrt(clickDx * clickDx + clickDy * clickDy) + 0.001;
  const timeSinceClick = t - mouse.clickTime;

  switch (mode) {
    case 'repel': {
      const force = Math.max(0, 0.3 - dist) * 200;
      state.offsetX = -Math.cos(angle) * force;
      state.offsetY = -Math.sin(angle) * force;
      state.scale = 1 + Math.max(0, 0.2 - dist) * 2;
      state.brightness = 1 + Math.max(0, 0.3 - dist) * 3;
      state.rotation = -Math.cos(angle) * force * 0.5;
      break;
    }

    case 'attract': {
      const pull = Math.max(0, 0.5 - dist) * 80;
      state.offsetX = Math.cos(angle) * pull;
      state.offsetY = Math.sin(angle) * pull;
      state.scale = 1 - Math.max(0, 0.3 - dist) * 0.5;
      state.brightness = 0.5 + (1 - Math.min(1, dist * 2)) * 1.5;
      break;
    }

    case 'spotlight': {
      const radius = 0.25;
      const inLight = dist < radius;
      const falloff = inLight ? 1 - dist / radius : 0;
      state.brightness = 0.1 + falloff * 2.5;
      state.scale = 0.9 + falloff * 0.2;
      state.opacity = 0.2 + falloff * 0.8;
      if (inLight) {
        state.hueShift = falloff * 30;
      }
      break;
    }

    case 'ripple': {
      if (timeSinceClick < 2) {
        const rippleRadius = timeSinceClick * 0.5;
        const rippleDist = Math.abs(clickDist - rippleRadius);
        if (rippleDist < 0.08) {
          const intensity = (1 - rippleDist / 0.08) * Math.exp(-timeSinceClick * 1.5);
          state.offsetY = -intensity * 20;
          state.scale = 1 + intensity * 0.3;
          state.brightness = 1 + intensity * 2;
        }
      }
      state.brightness = Math.max(state.brightness, 0.3 + Math.max(0, 0.2 - dist) * 3);
      break;
    }

    case 'paint': {
      if (physics.painted >= 0) {
        state.colorOverride = hslToHex(physics.painted, 80, 50);
        state.brightness = 1.3;
      }
      if (dist < 0.15) {
        const preview = 1 - dist / 0.15;
        state.brightness = 1 + preview;
        state.scale = 1 + preview * 0.15;
      }
      break;
    }

    case 'gravity': {
      state.offsetX = physics.px;
      state.offsetY = physics.py;
      state.brightness = 0.8 + Math.abs(physics.vx + physics.vy) * 0.05;
      state.rotation = physics.vx * 2;
      break;
    }

    case 'magnet': {
      const polarity = mouse.x < 0.5 ? 1 : -1;
      const force2 = Math.max(0, 0.4 - dist) * 120 * polarity;
      state.offsetX = Math.cos(angle) * force2;
      state.offsetY = Math.sin(angle) * force2;
      state.hueShift = polarity > 0 ? 0 : 180;
      state.brightness = 1 + Math.max(0, 0.3 - dist) * 1.5;
      state.scale = 1 + Math.abs(force2) * 0.002;
      break;
    }

    case 'tornado': {
      const tornadoDist = dist;
      if (tornadoDist < 0.4) {
        const strength = (0.4 - tornadoDist) / 0.4;
        const orbitAngle = angle + t * 5 * strength + (1 - strength) * 2;
        const orbitRadius = tornadoDist * gridWidth * 0.4;
        state.offsetX = Math.cos(orbitAngle) * orbitRadius - dx * gridWidth;
        state.offsetY = Math.sin(orbitAngle) * orbitRadius - dy * gridHeight;
        state.rotation = orbitAngle * (180 / Math.PI);
        state.scale = 0.7 + strength * 0.3;
        state.brightness = 0.5 + strength * 1.5;
      }
      break;
    }

    case 'freeze': {
      if (dist < 0.2) {
        physics.frozen = true;
      }
      if (physics.frozen) {
        state.colorOverride = hslToHex(200 + seededRandom(blockIdx * 7) * 20, 50, 65);
        state.brightness = 1.2 + Math.sin(t * 2 + blockIdx) * 0.1;
        state.scale = 1.05;
      } else {
        state.brightness = 0.8 + Math.sin(t * 1.5 + blockIdx * 0.3) * 0.2;
      }
      break;
    }

    case 'grow': {
      const growFactor = Math.max(0, 0.4 - dist) / 0.4;
      state.scale = 0.5 + growFactor * 1.5;
      state.brightness = 0.4 + growFactor * 1.2;
      state.opacity = 0.3 + growFactor * 0.7;
      break;
    }

    case 'xray': {
      const xrayRadius = 0.25;
      const inXray = dist < xrayRadius;
      if (inXray) {
        const depth = 1 - dist / xrayRadius;
        const isEdge = x === 0 || x === 4 || y === 0 || y === 5;
        if (isEdge) {
          state.brightness = 0.5 + depth * 2;
          state.colorOverride = hslToHex(180, 60, 40 + depth * 30);
        } else {
          state.brightness = depth * 0.8;
          state.colorOverride = hslToHex(180, 30, 20);
          state.opacity = 0.3 + depth * 0.3;
        }
      } else {
        state.brightness = 1;
      }
      break;
    }

    case 'blackhole': {
      if (timeSinceClick < 3) {
        const pullStrength2 = Math.exp(-timeSinceClick * 0.8) * 150;
        const pullForce = pullStrength2 / (clickDist * 10 + 1);
        state.offsetX = clickDx / clickDist * pullForce;
        state.offsetY = clickDy / clickDist * pullForce;
        state.scale = Math.max(0.1, 1 - pullForce * 0.01);
        state.rotation = t * 200 / (clickDist * 5 + 1);
        state.brightness = 0.3 + pullForce * 0.02;
        state.opacity = Math.max(0.1, 1 - pullForce * 0.015);
      }
      break;
    }

    case 'fireworks': {
      if (timeSinceClick < 2) {
        const launchAngle = seededRandom(blockIdx * 41) * Math.PI * 2;
        const launchForce = 20 + seededRandom(blockIdx * 47) * 60;
        const age = timeSinceClick;
        if (age < 0.8) {
          const p = age / 0.8;
          state.offsetX = Math.cos(launchAngle) * launchForce * p + (clickDx - dx) * gridWidth;
          state.offsetY = Math.sin(launchAngle) * launchForce * p + (clickDy - dy) * gridHeight + p * p * 30;
          state.brightness = 2.5 - p * 1.5;
          state.hueShift = seededRandom(blockIdx * 53) * 360;
          state.scale = 1 + (1 - p) * 0.3;
        } else {
          const fade = (age - 0.8) / 1.2;
          const remaining = 1 - fade;
          state.offsetX = Math.cos(launchAngle) * launchForce * remaining * 0.3;
          state.offsetY = Math.sin(launchAngle) * launchForce * remaining * 0.3;
          state.brightness = 0.5 + fade * 0.5;
          state.scale = 0.8 + fade * 0.2;
        }
      }
      break;
    }

    case 'elastic': {
      if (mouse.down && dist < 0.3) {
        const stretch = (0.3 - dist) / 0.3;
        state.offsetX = dx * gridWidth * stretch * 0.3;
        state.offsetY = dy * gridHeight * stretch * 0.3;
        state.scale = 1 + stretch * 0.2;
        state.brightness = 1 + stretch * 0.5;
        state.skewX = dx * 20;
        state.skewY = dy * 10;
      } else {
        state.offsetX = physics.px;
        state.offsetY = physics.py;
        state.brightness = 1 + Math.abs(physics.vx) * 0.1;
      }
      break;
    }

    case 'wave': {
      const amplitude = (mouse.y - 0.5) * 40;
      const wavePhase = t * 3 + x * 0.8;
      state.offsetY = Math.sin(wavePhase) * amplitude;
      state.brightness = 0.7 + (Math.sin(wavePhase) + 1) * 0.4;
      state.scale = 1 + Math.sin(wavePhase) * 0.05;
      state.hueShift = mouse.x * 120;
      break;
    }

    case 'scatter': {
      if (timeSinceClick < 4) {
        const age2 = timeSinceClick;
        if (age2 < 0.5) {
          const p = age2 / 0.5;
          const scatterAngle = seededRandom(blockIdx * 37) * Math.PI * 2;
          const scatterForce = 30 + seededRandom(blockIdx * 43) * 70;
          state.offsetX = Math.cos(scatterAngle) * scatterForce * p;
          state.offsetY = Math.sin(scatterAngle) * scatterForce * p;
          state.rotation = (seededRandom(blockIdx * 53) - 0.5) * 360 * p;
          state.brightness = 2 - p;
        } else {
          const reform = (age2 - 0.5) / 3.5;
          const eased = reform * reform;
          const scatterAngle = seededRandom(blockIdx * 37) * Math.PI * 2;
          const scatterForce = 30 + seededRandom(blockIdx * 43) * 70;
          state.offsetX = Math.cos(scatterAngle) * scatterForce * (1 - eased);
          state.offsetY = Math.sin(scatterAngle) * scatterForce * (1 - eased);
          state.rotation = (seededRandom(blockIdx * 53) - 0.5) * 360 * (1 - eased);
          state.brightness = 0.5 + eased * 0.5;
          state.scale = 0.7 + eased * 0.3;
        }
      }
      break;
    }

    case 'orbit': {
      if (dist < 0.5) {
        const orbitSpeed2 = 2 + (0.5 - dist) * 8;
        const orbitAngle2 = angle + t * orbitSpeed2;
        const orbitR = dist * gridWidth * 0.3;
        state.offsetX = Math.cos(orbitAngle2) * orbitR - dx * gridWidth;
        state.offsetY = Math.sin(orbitAngle2) * orbitR * 0.5 - dy * gridHeight;
        state.scale = 0.6 + (0.5 - dist) * 0.8;
        state.brightness = 0.5 + (0.5 - dist) * 2;
        state.rotation = orbitAngle2 * 30;
        state.hueShift = (orbitAngle2 * 30) % 360;
      } else {
        state.brightness = 0.3;
      }
      break;
    }

    case 'heat': {
      const temp = physics.heat;
      const hue2 = (1 - temp) * 240;
      state.colorOverride = hslToHex(hue2, 80, 30 + temp * 30);
      state.brightness = 0.5 + temp * 1.2;
      state.scale = 1 + temp * 0.15;
      if (temp > 0.7) {
        state.offsetY = Math.sin(t * 8 + blockIdx) * temp * 3;
        state.offsetX = Math.sin(t * 6 + blockIdx * 1.3) * temp * 2;
      }
      break;
    }

    case 'lightning': {
      if (timeSinceClick < 0.8) {
        const chainDist = timeSinceClick * 1.5;
        if (clickDist < chainDist && clickDist > chainDist - 0.15) {
          state.brightness = 3;
          state.colorOverride = '#aaddff';
          state.scale = 1.2;
          state.offsetX = (seededRandom(Math.floor(t * 30) + blockIdx) - 0.5) * 4;
        } else if (clickDist < chainDist) {
          const fade = (chainDist - clickDist) / chainDist;
          state.brightness = 0.5 + fade * 0.5;
          state.colorOverride = hslToHex(220, 50, 30);
        } else {
          state.brightness = 0.15;
        }
      } else {
        state.brightness = 0.3 + Math.max(0, 0.15 - dist) * 4;
      }
      break;
    }

    case 'bubble': {
      if (physics.popped) {
        const reformSpeed = 0.3;
        state.scale = Math.min(1, physics.heat * reformSpeed);
        state.opacity = state.scale;
        state.brightness = 0.5 + state.scale * 0.5;
      } else {
        if (dist < 0.15) {
          state.scale = 1.2 + Math.sin(t * 10 + blockIdx) * 0.1;
          state.brightness = 1.5;
          state.offsetX = Math.sin(t * 15 + blockIdx) * 2;
          state.offsetY = Math.cos(t * 12 + blockIdx) * 2;
        } else {
          state.brightness = 0.8 + Math.sin(t * 1.5 + blockIdx * 0.3) * 0.15;
          state.scale = 1 + Math.sin(t * 2 + blockIdx * 0.5) * 0.03;
        }
      }
      break;
    }

    case 'eraser': {
      if (physics.heat > 0) {
        const regrow = physics.heat;
        state.scale = Math.min(1, regrow * 0.25);
        state.opacity = state.scale;
        state.brightness = 0.5 + state.scale * 0.5;
      } else {
        state.brightness = 1;
      }
      if (dist < 0.12 && !physics.popped) {
        state.brightness = 0.5;
        state.scale = 0.9;
      }
      break;
    }

    case 'pixelate': {
      const inRange = dist < 0.3;
      if (inRange) {
        const chunkSize = 2;
        const snapX = Math.round(x / chunkSize) * chunkSize;
        const snapY = Math.round(y / chunkSize) * chunkSize;
        state.offsetX = (snapX - x) * blockSize * 0.3;
        state.offsetY = (snapY - y) * blockSize * 0.3;
        state.scale = 1.3;
        state.brightness = 1.2;
        const flatHue = Math.round(blockIdx / 5) * 72;
        state.colorOverride = hslToHex(flatHue, 60, 50);
      } else {
        state.brightness = 0.8;
      }
      break;
    }

    case 'trampoline': {
      if (timeSinceClick < 3) {
        const impactDist = clickDist;
        const delay = impactDist * 1.5;
        const localT = timeSinceClick - delay;
        if (localT > 0 && localT < 2) {
          const bounce = Math.abs(Math.sin(localT * 5)) * Math.exp(-localT * 2);
          state.offsetY = -bounce * 40;
          state.scale = 1 + bounce * 0.2;
          state.brightness = 1 + bounce * 1.0;
        }
      }
      break;
    }

    case 'tractor': {
      if (mouse.down) {
        const pull = Math.max(0, 0.6 - dist) * 100;
        state.offsetX = Math.cos(angle) * pull;
        state.offsetY = Math.sin(angle) * pull;
        state.scale = 1 - Math.max(0, 0.4 - dist) * 0.8;
        state.brightness = 0.5 + (0.6 - Math.min(0.6, dist)) * 2;
        state.rotation = t * 100 * Math.max(0, 0.3 - dist);
        if (dist < 0.3) {
          state.colorOverride = hslToHex(120, 60, 40 + (0.3 - dist) * 100);
        }
      } else {
        state.brightness = 0.8 + Math.sin(t * 1.5 + blockIdx * 0.3) * 0.15;
      }
      break;
    }

    case 'mirror': {
      const isLeft = x < CENTER_X;
      const isRight = x > CENTER_X;
      const mouseInfluence = Math.max(0, 0.5 - Math.abs(mouse.y - by) * 2);
      if (isLeft) {
        state.offsetY = (mouse.y - 0.5) * 20 * mouseInfluence;
        state.brightness = 0.7 + mouseInfluence * 0.8;
      } else if (isRight) {
        state.offsetY = -(mouse.y - 0.5) * 20 * mouseInfluence;
        state.brightness = 0.7 + mouseInfluence * 0.8;
        state.hueShift = 180;
      } else {
        state.brightness = 1.3;
        state.scale = 1.05;
      }
      break;
    }

    case 'smear': {
      const velX = mouse.x - prevMouseX(mouse);
      const velY = mouse.y - prevMouseY(mouse);
      const speed = mouse.velocity * 200;
      if (dist < 0.25 && speed > 0.5) {
        const smearAmount = Math.min(1, speed * 2) * (1 - dist / 0.25);
        state.skewX = velX * smearAmount * 200;
        state.skewY = velY * smearAmount * 100;
        state.scale = 1 + smearAmount * 0.3;
        state.brightness = 1 + smearAmount * 0.5;
        state.blur = smearAmount * 2;
      }
      break;
    }

    case 'whirlpool': {
      if (timeSinceClick < 4) {
        const whirlStrength = Math.exp(-timeSinceClick * 0.5);
        const whirlAngle = angle + timeSinceClick * 4 * whirlStrength;
        const pullIn = whirlStrength * 30 * (1 - clickDist * 0.5);
        state.offsetX = Math.cos(whirlAngle) * clickDist * pullIn - (clickDx) * gridWidth * whirlStrength * 0.5;
        state.offsetY = Math.sin(whirlAngle) * clickDist * pullIn - (clickDy) * gridHeight * whirlStrength * 0.5;
        state.rotation = whirlAngle * 60;
        state.scale = 0.5 + (1 - whirlStrength) * 0.5;
        state.brightness = 0.5 + whirlStrength * 1.0;
        state.hueShift = whirlAngle * 30;
      }
      break;
    }

    case 'inflate': {
      if (mouse.down && dist < 0.25) {
        const inflateAmount = Math.min(2, physics.heat);
        state.scale = 1 + inflateAmount * 0.8;
        state.brightness = 1 + inflateAmount * 0.5;
        if (inflateAmount > 1.5) {
          state.offsetX = Math.sin(t * 20 + blockIdx) * inflateAmount * 2;
          state.offsetY = Math.cos(t * 18 + blockIdx) * inflateAmount * 2;
          state.colorOverride = hslToHex(0, 80, 50);
        }
        if (inflateAmount >= 2) {
          state.scale = 0.1;
          state.opacity = 0.2;
          state.brightness = 3;
        }
      } else if (physics.heat > 2) {
        state.scale = 0.3;
        state.opacity = 0.4;
      } else {
        state.brightness = 0.8;
      }
      break;
    }

    case 'revealer': {
      if (physics.painted >= 0) {
        state.opacity = 1;
        state.brightness = 1 + Math.sin(t * 2 + blockIdx * 0.3) * 0.1;
      } else {
        state.opacity = 0.03;
        state.brightness = 0.1;
      }
      if (dist < 0.15) {
        state.opacity = Math.max(state.opacity, 0.5);
        state.brightness = 1.5;
      }
      break;
    }

    case 'dominos': {
      if (timeSinceClick < 4) {
        const chainSpeed = 5;
        const chainFront = timeSinceClick * chainSpeed;
        const myDist = Math.sqrt((x - Math.round(mouse.clickX * 5)) ** 2 + (y - Math.round(mouse.clickY * 6)) ** 2);
        const hitTime = myDist - chainFront / 3;
        if (hitTime < 0 && hitTime > -1) {
          const topple = Math.min(1, -hitTime);
          state.rotation = topple * 90;
          state.offsetY = Math.sin(topple * Math.PI * 0.5) * blockSize * 0.3;
          state.brightness = 2 - topple;
        } else if (hitTime < -1) {
          state.rotation = 90;
          state.offsetY = blockSize * 0.3;
          state.brightness = 0.4;
        }
      }
      break;
    }

    case 'antigravity': {
      if (mouse.down) {
        state.offsetY = physics.py;
        state.offsetX = Math.sin(t * 2 + blockIdx * 0.5) * 3;
        state.brightness = 0.8 + Math.abs(physics.py) * 0.02;
        state.rotation = Math.sin(t + blockIdx) * 5;
      } else {
        state.offsetY = physics.py;
        state.brightness = 0.8;
      }
      break;
    }

    case 'shockwave': {
      if (timeSinceClick < 2) {
        const ringRadius = timeSinceClick * 0.6;
        const ringWidth = 0.1;
        const distToRing = Math.abs(clickDist - ringRadius);
        if (distToRing < ringWidth) {
          const intensity = (1 - distToRing / ringWidth) * Math.exp(-timeSinceClick * 1.5);
          state.rotation = intensity * 180;
          state.scale = 1 + intensity * 0.4;
          state.brightness = 1 + intensity * 2;
          state.offsetY = -intensity * 15;
          state.hueShift = intensity * 90;
        }
      }
      break;
    }

    case 'colorDrain': {
      const drainRadius = 0.3;
      const inDrain = dist < drainRadius;
      if (inDrain) {
        const drainAmount = 1 - dist / drainRadius;
        state.colorOverride = hslToHex(0, 0, 40 + drainAmount * 20);
        state.brightness = 0.6 + drainAmount * 0.3;
      } else {
        state.brightness = 1.2;
        state.hueShift = t * 20 + blockIdx * 15;
      }
      break;
    }

    case 'puppeteer': {
      const lookAngle = Math.atan2(dy, dx);
      const lookStrength = Math.min(1, 0.5 / (dist + 0.1));
      state.skewX = Math.cos(lookAngle) * lookStrength * 15;
      state.skewY = Math.sin(lookAngle) * lookStrength * 8;
      state.rotation = Math.cos(lookAngle) * lookStrength * 8;
      state.brightness = 0.7 + lookStrength * 0.6;
      if (dist < 0.1) {
        state.scale = 1.2;
        state.brightness = 1.5;
      }
      break;
    }

    case 'earthquake2': {
      const intensity = Math.sqrt((mouse.x - 0.5) ** 2 + (mouse.y - 0.5) ** 2) * 2;
      const shake = intensity * 15;
      state.offsetX = Math.sin(t * 25 + y * 5) * shake;
      state.offsetY = Math.cos(t * 22 + x * 4) * shake * 0.5;
      state.brightness = 1 + intensity * 0.3;
      if (timeSinceClick < 0.3) {
        const jolt = (0.3 - timeSinceClick) / 0.3;
        state.offsetX += (seededRandom(Math.floor(t * 30) + blockIdx) - 0.5) * 30 * jolt;
        state.offsetY -= jolt * 15;
        state.brightness = 1 + jolt * 2;
      }
      break;
    }

    case 'jellyPoke': {
      if (timeSinceClick < 3) {
        const wobbleDist = clickDist;
        const delay2 = wobbleDist * 2;
        const localT2 = timeSinceClick - delay2;
        if (localT2 > 0) {
          const wobble = Math.sin(localT2 * 12) * Math.exp(-localT2 * 2);
          const pushDir = Math.atan2(by - mouse.clickY, bx - mouse.clickX);
          state.offsetX = Math.cos(pushDir) * wobble * 15;
          state.offsetY = Math.sin(pushDir) * wobble * 12;
          state.skewX = wobble * 10;
          state.scale = 1 + Math.abs(wobble) * 0.1;
          state.brightness = 1 + Math.abs(wobble) * 0.5;
        }
      }
      break;
    }

    case 'lavalamp2': {
      const temp = physics.heat;
      if (temp > 0.1) {
        state.offsetY = -temp * 20;
        state.offsetX = Math.sin(t * 2 + blockIdx) * temp * 5;
        state.scale = 1 + temp * 0.2;
        state.colorOverride = hslToHex(30 - temp * 30, 80, 40 + temp * 25);
        state.brightness = 0.8 + temp * 0.8;
      } else {
        state.brightness = 0.5;
        state.colorOverride = hslToHex(240, 30, 25);
      }
      break;
    }

    case 'magnetSnap': {
      if (dist < 0.3) {
        const snapStrength = 1 - dist / 0.3;
        const gridSnap = blockSize + gap;
        const snapX = Math.round((bx * gridWidth) / gridSnap) * gridSnap;
        const snapY = Math.round((by * gridHeight) / gridSnap) * gridSnap;
        const currentX = x * (blockSize + gap);
        const currentY = y * (blockSize + gap);
        state.offsetX = (snapX - currentX) * snapStrength * 0.3;
        state.offsetY = (snapY - currentY) * snapStrength * 0.3;
        state.brightness = 1 + snapStrength * 0.8;
        state.scale = 1 + snapStrength * 0.1;
        state.colorOverride = hslToHex(200 + snapStrength * 40, 70, 45 + snapStrength * 20);
      } else {
        state.brightness = 0.6;
      }
      break;
    }

    case 'vaporize': {
      if (dist < 0.2) {
        const dissolveAmount = (0.2 - dist) / 0.2;
        state.scale = 1 - dissolveAmount * 0.7;
        state.opacity = 1 - dissolveAmount * 0.8;
        state.offsetX = (seededRandom(Math.floor(t * 8) + blockIdx * 11) - 0.5) * dissolveAmount * 20;
        state.offsetY = -dissolveAmount * 15 + (seededRandom(Math.floor(t * 8) + blockIdx * 17) - 0.5) * dissolveAmount * 10;
        state.brightness = 1 + dissolveAmount * 2;
        state.blur = dissolveAmount * 3;
        state.hueShift = dissolveAmount * 180;
      } else if (physics.popped) {
        const reform = Math.min(1, physics.heat * 0.3);
        state.scale = reform;
        state.opacity = reform;
      }
      break;
    }

    case 'glueGun': {
      if (physics.painted >= 0) {
        const glueX = physics.painted / 360;
        const glueY = physics.heat;
        state.offsetX = (glueX - bx) * gridWidth * 0.15;
        state.offsetY = (glueY - by) * gridHeight * 0.15;
        state.scale = 1.1;
        state.brightness = 1.2;
        state.colorOverride = hslToHex(45, 60, 55);
      } else {
        state.brightness = 0.7;
      }
      break;
    }

    case 'slingshot2': {
      if (mouse.down) {
        const stretch = Math.min(1, dist * 3);
        state.offsetX = -(mouse.x - 0.5) * stretch * 40;
        state.offsetY = -(mouse.y - 0.5) * stretch * 30;
        state.scale = 1 + stretch * 0.1;
        state.brightness = 1 + stretch * 0.5;
        state.skewX = -(mouse.x - 0.5) * stretch * 15;
      } else {
        state.offsetX = physics.px;
        state.offsetY = physics.py;
        state.brightness = 1 + Math.abs(physics.vx + physics.vy) * 0.03;
        state.blur = Math.abs(physics.vx) * 0.05;
      }
      break;
    }

    case 'stacking': {
      if (timeSinceClick < 3) {
        const dropCol = Math.round(mouse.clickX * 4);
        if (x === dropCol) {
          const dropDelay = (5 - y) * 0.15;
          const localDrop = Math.max(0, timeSinceClick - dropDelay);
          if (localDrop < 0.4) {
            const fall = localDrop / 0.4;
            state.offsetY = -80 * (1 - fall * fall);
            state.brightness = 1.5;
          } else {
            const squish = Math.min(1, (localDrop - 0.4) * 5);
            const bounce2 = Math.sin(squish * Math.PI * 3) * Math.exp(-squish * 3);
            state.offsetY = -Math.abs(bounce2) * 8;
            state.scale = 1 + Math.abs(bounce2) * 0.1;
            state.brightness = 1 + Math.abs(bounce2) * 0.5;
          }
        }
      }
      break;
    }

    case 'bowling': {
      if (timeSinceClick < 3) {
        const ballX = timeSinceClick * 0.4;
        const ballY = mouse.clickY;
        const toBall = Math.sqrt((bx - ballX) ** 2 + (by - ballY) ** 2);
        if (toBall < 0.12 && ballX < bx + 0.05) {
          const hitAngle = Math.atan2(by - ballY, bx - ballX);
          const hitForce = (0.12 - toBall) / 0.12;
          const age = Math.max(0, timeSinceClick - bx / 0.4);
          state.offsetX = Math.cos(hitAngle) * hitForce * age * 80;
          state.offsetY = Math.sin(hitAngle) * hitForce * age * 60 + age * age * 20;
          state.rotation = age * hitForce * 300;
          state.brightness = 1.5 - age * 0.5;
          state.scale = 1 - age * 0.2;
        }
      }
      state.brightness = Math.max(state.brightness, 0.6);
      break;
    }

    case 'flick': {
      const speed2 = mouse.velocity * 300;
      if (speed2 > 2 && dist < 0.2) {
        const flickForce = Math.min(1, speed2 / 10) * (1 - dist / 0.2);
        const flickAngle2 = Math.atan2(mouse.y - by, mouse.x - bx);
        physics.vx += Math.cos(flickAngle2) * flickForce * 30;
        physics.vy += Math.sin(flickAngle2) * flickForce * 25;
      }
      state.offsetX = physics.px;
      state.offsetY = physics.py;
      state.rotation = physics.vx * 1.5;
      state.brightness = 0.8 + Math.abs(physics.vx + physics.vy) * 0.05;
      break;
    }

    case 'seesaw': {
      const tiltAmount = physics.heat;
      const tiltEffect = tiltAmount * (x - CENTER_X) * 5;
      state.offsetY = tiltEffect;
      state.rotation = tiltAmount * 3;
      state.brightness = 1 + Math.abs(tiltEffect) * 0.02;
      if (tiltEffect < -3) {
        state.brightness += 0.3;
      }
      break;
    }

    case 'searchlight': {
      const lightAngle2 = Math.atan2(mouse.y - 1, mouse.x - 0.5);
      const blockAngle3 = Math.atan2(by - 1, bx - 0.5);
      let angleDiff2 = Math.abs(lightAngle2 - blockAngle3);
      if (angleDiff2 > Math.PI) angleDiff2 = Math.PI * 2 - angleDiff2;
      const coneWidth = 0.3;
      const inCone = angleDiff2 < coneWidth;
      if (inCone) {
        const coneIntensity = 1 - angleDiff2 / coneWidth;
        state.brightness = 0.2 + coneIntensity * 2.5;
        state.scale = 1 + coneIntensity * 0.1;
      } else {
        state.brightness = 0.05;
        state.opacity = 0.4;
      }
      break;
    }

    case 'suction': {
      if (mouse.down) {
        const dragX = (mouse.x - mouse.clickX) * gridWidth * 0.8;
        const dragY = (mouse.y - mouse.clickY) * gridHeight * 0.8;
        state.offsetX = dragX;
        state.offsetY = dragY;
        if (clickDist < 0.15) {
          state.scale = 1.15;
          state.brightness = 1.4;
        }
        state.brightness = Math.max(state.brightness, 1);
      } else {
        state.offsetX = physics.px;
        state.offsetY = physics.py;
      }
      break;
    }

    case 'catapult': {
      if (timeSinceClick < 2) {
        const clickedBottom = mouse.clickY > 0.6;
        if (clickedBottom) {
          if (y <= 2) {
            const launchDelay = (2 - y) * 0.08;
            const localLaunch = Math.max(0, timeSinceClick - launchDelay);
            if (localLaunch < 0.5) {
              const up = localLaunch / 0.5;
              state.offsetY = -up * 80;
              state.offsetX = (x - CENTER_X) * up * 10;
              state.rotation = up * 180 * (x > CENTER_X ? 1 : -1);
              state.brightness = 2 - up;
              state.scale = 1 + up * 0.3;
            } else {
              const fall2 = (localLaunch - 0.5) / 1.5;
              const eased = easeOut(Math.min(1, fall2));
              state.offsetY = -80 * (1 - eased);
              state.offsetX = (x - CENTER_X) * 10 * (1 - eased);
              state.rotation = 180 * (1 - eased) * (x > CENTER_X ? 1 : -1);
              state.brightness = 1;
            }
          } else {
            const leverP = Math.min(1, timeSinceClick * 5);
            state.skewY = -leverP * 10 * (1 - timeSinceClick * 0.5);
            state.brightness = 1 + leverP * 0.3;
          }
        }
      }
      break;
    }

    case 'lasso': {
      if (dist < 0.15) {
        physics.frozen = true;
      }
      if (physics.frozen) {
        const pullX = (mouse.x - bx) * gridWidth * 0.3;
        const pullY = (mouse.y - by) * gridHeight * 0.3;
        state.offsetX = pullX;
        state.offsetY = pullY;
        state.brightness = 1.3;
        state.scale = 1.1;
        state.colorOverride = hslToHex(45, 60, 50);
        state.offsetX += Math.sin(t * 3 + blockIdx) * 3;
        state.offsetY += Math.cos(t * 3 + blockIdx) * 3;
      } else {
        state.brightness = 0.5;
      }
      break;
    }

    case 'timeSlow': {
      const normalSpeed = 4;
      const slowRadius = 0.25;
      const inSlow = dist < slowRadius;
      const timeScale = inSlow ? 0.1 : 1;
      const breathePhase = t * normalSpeed * timeScale + blockIdx * 0.3;
      state.brightness = 0.7 + Math.sin(breathePhase) * 0.4;
      state.scale = 1 + Math.sin(breathePhase) * 0.05;
      state.offsetY = Math.sin(breathePhase * 0.5) * 3 * timeScale;
      if (inSlow) {
        const slowAmount = 1 - dist / slowRadius;
        state.hueShift = 200 * slowAmount;
        state.brightness += slowAmount * 0.3;
      }
      break;
    }

    case 'splitMerge': {
      const isSplit = physics.heat > 0.5;
      if (isSplit) {
        const splitAmount = Math.min(1, physics.heat);
        if (x < CENTER_X) {
          state.offsetX = -splitAmount * 25;
        } else if (x > CENTER_X) {
          state.offsetX = splitAmount * 25;
        }
        state.brightness = 0.8;
        if (x === 1 || x === 3) {
          state.brightness = 1 + Math.sin(t * 3) * 0.3;
        }
      } else {
        state.brightness = 1 + Math.sin(t * 1.5 + blockIdx * 0.2) * 0.1;
      }
      break;
    }

    case 'rowing': {
      const rowPhase = mouse.x * Math.PI * 4;
      const rowSide = x < CENTER_X ? -1 : x > CENTER_X ? 1 : 0;
      const oarAngle = Math.sin(rowPhase + rowSide * Math.PI);
      state.offsetX = oarAngle * rowSide * 8;
      state.offsetY = Math.abs(oarAngle) * 3;
      state.rotation = oarAngle * rowSide * 10;
      state.brightness = 0.7 + Math.abs(oarAngle) * 0.5;
      if (x === Math.round(CENTER_X)) {
        state.offsetX = 0;
        state.offsetY = Math.sin(rowPhase * 0.5) * 2;
        state.rotation = 0;
        state.brightness = 1;
      }
      break;
    }

    case 'drumPad': {
      if (dist < 0.1) {
        const hitAge = (t * 2 + blockIdx) % 0.5;
        if (hitAge < 0.15) {
          const hit = hitAge / 0.15;
          state.scale = 1.4 - hit * 0.4;
          state.brightness = 2.5 - hit * 1.5;
          state.offsetY = -5 * (1 - hit);
          state.colorOverride = hslToHex((blockIdx * 47) % 360, 80, 50);
        }
      } else {
        state.brightness = 0.4 + Math.max(0, 0.15 - dist) * 3;
        state.colorOverride = hslToHex((blockIdx * 47) % 360, 30, 25);
      }
      break;
    }

    case 'sponge': {
      const absorbed = physics.heat;
      if (dist < 0.15 && !mouse.down) {
        state.brightness = 1 + absorbed;
        state.scale = 1 + absorbed * 0.15;
        state.colorOverride = hslToHex((t * 40 + blockIdx * 20) % 360, 60 + absorbed * 30, 40 + absorbed * 20);
      } else if (mouse.down && absorbed > 0.1) {
        const squeeze = Math.min(1, absorbed);
        state.scale = 1 - squeeze * 0.2;
        state.brightness = 0.5 + squeeze;
        state.colorOverride = hslToHex((t * 40 + blockIdx * 20) % 360, squeeze * 80, 40);
        state.offsetY = squeeze * 3;
      } else {
        state.brightness = 0.5;
      }
      break;
    }

    case 'wrecking': {
      if (dist < 0.12 && mouse.velocity > 0.005) {
        const smashDir = Math.atan2(by - mouse.y, bx - mouse.x);
        const smashForce = Math.min(1, mouse.velocity * 100);
        physics.vx = Math.cos(smashDir) * smashForce * 40;
        physics.vy = Math.sin(smashDir) * smashForce * 30;
      }
      state.offsetX = physics.px;
      state.offsetY = physics.py;
      state.rotation = physics.px * 2;
      state.brightness = 0.7 + Math.abs(physics.vx) * 0.05;
      if (dist < 0.1) {
        state.brightness = 1.5;
        state.scale = 0.9;
      }
      break;
    }

    case 'squeegee': {
      if (physics.painted >= 0) {
        state.brightness = 1.5;
        state.colorOverride = hslToHex(physics.painted, 70, 55);
      } else {
        state.brightness = 0.3;
        state.colorOverride = hslToHex(30, 20, 20);
        if (dist < 0.12) {
          state.brightness = 0.6;
        }
      }
      break;
    }

    case 'claw': {
      if (timeSinceClick < 3) {
        const clawX = mouse.clickX;
        const clawPhase = timeSinceClick;
        const clawY = clawPhase < 1 ? clawPhase * 0.8 : 0.8;
        const toClawDist = Math.sqrt((bx - clawX) ** 2 + (by - clawY) ** 2);
        if (clawPhase > 1 && clawPhase < 2 && toClawDist < 0.15) {
          const liftP = (clawPhase - 1) / 1;
          state.offsetY = -liftP * 50;
          state.offsetX = (clawX - bx) * gridWidth * 0.3;
          state.scale = 1.1;
          state.brightness = 1.5;
          state.colorOverride = hslToHex(50, 60, 50);
        } else if (clawPhase > 2 && toClawDist < 0.15) {
          const dropP = (clawPhase - 2) / 1;
          state.offsetY = -50 * (1 - dropP * dropP) + 10 * dropP;
          state.brightness = 1;
        }
      }
      break;
    }

    case 'vacuum': {
      if (mouse.down) {
        const suckForce = Math.max(0, 0.4 - dist) * 120;
        state.offsetX = Math.cos(angle) * suckForce;
        state.offsetY = Math.sin(angle) * suckForce;
        state.scale = Math.max(0.3, 1 - suckForce * 0.01);
        state.rotation = t * suckForce * 2;
        state.brightness = 0.5 + suckForce * 0.02;
      } else if (physics.px !== 0 || physics.py !== 0) {
        state.offsetX = physics.px;
        state.offsetY = physics.py;
        state.brightness = 1 + Math.abs(physics.vx) * 0.05;
        state.scale = 1 + Math.abs(physics.vx) * 0.005;
      } else {
        state.brightness = 0.8;
      }
      break;
    }

    case 'hoverboard': {
      const tiltX = (mouse.x - 0.5) * 2;
      const tiltY = (mouse.y - 0.5) * 2;
      state.skewX = tiltX * 12;
      state.skewY = tiltY * 6;
      state.offsetY = -5 + tiltY * 3;
      state.offsetX = tiltX * 5;
      const depthFactor = 1 + (y - CENTER_Y) * tiltY * 0.03 + (x - CENTER_X) * tiltX * 0.02;
      state.scale = depthFactor;
      state.brightness = 0.7 + depthFactor * 0.4;
      if (y >= 4) {
        state.brightness += 0.2 + Math.sin(t * 3 + x) * 0.1;
        state.colorOverride = hslToHex(200, 50, 40);
      }
      break;
    }

    case 'yoyo': {
      if (timeSinceClick < 3) {
        const yoPhase = timeSinceClick;
        if (yoPhase < 0.6) {
          const down = yoPhase / 0.6;
          state.offsetY = down * 60 * (1 - dist * 0.5);
          state.scale = 1 - down * 0.2;
          state.brightness = 1 + down * 0.3;
          state.rotation = down * 360;
        } else if (yoPhase < 0.8) {
          state.offsetY = 60 * (1 - dist * 0.5);
          state.rotation = yoPhase * 720;
          state.brightness = 1.5;
          state.scale = 0.8;
        } else {
          const back = (yoPhase - 0.8) / 0.5;
          const eased3 = easeOut(Math.min(1, back));
          state.offsetY = 60 * (1 - eased3) * (1 - dist * 0.5);
          state.scale = 0.8 + eased3 * 0.2;
          state.rotation = 720 * (1 - eased3);
          state.brightness = 1 + (1 - eased3) * 0.3;
        }
      }
      break;
    }
  }

  return state;
}

function easeOut(t2: number): number { return 1 - (1 - t2) * (1 - t2); }

function prevMouseX(mouse: MouseState): number { return mouse.x - mouse.velocity * 0.5; }
function prevMouseY(mouse: MouseState): number { return mouse.y - mouse.velocity * 0.3; }

// ─── Interactive Rook Component ───
export function InteractiveRook({ mode, blockSize = 28 }: { mode: InteractiveModeId; blockSize?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const mouseRef = useRef<MouseState>({ x: 0.5, y: 0.5, down: false, clickX: 0.5, clickY: 0.5, clickTime: -10, velocity: 0 });
  const physicsRef = useRef<BlockPhysics[]>(
    Array.from({ length: 30 }, () => ({ vx: 0, vy: 0, px: 0, py: 0, heat: 0, frozen: false, popped: false, painted: -1 }))
  );
  const prevMouseRef = useRef({ x: 0.5, y: 0.5 });

  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const radius = Math.max(1, Math.round(blockSize * 0.14));
  const gridWidth = 5 * blockSize + 4 * gap;
  const gridHeight = 6 * blockSize + 5 * gap;
  const scale = blockSize / 14;
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  const insetShadow = `inset 0 ${s(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${s(0.75)} 0 rgba(255,255,255,0.15)`;

  useEffect(() => {
    physicsRef.current = Array.from({ length: 30 }, () => ({
      vx: 0, vy: 0, px: 0, py: 0, heat: 0, frozen: false, popped: false, painted: -1,
    }));
  }, [mode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    const prev = prevMouseRef.current;
    const vel = Math.sqrt((mx - prev.x) ** 2 + (my - prev.y) ** 2);
    mouseRef.current.x = mx;
    mouseRef.current.y = my;
    mouseRef.current.velocity = vel;
    prevMouseRef.current = { x: mx, y: my };
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
    const prev = prevMouseRef.current;
    mouseRef.current.velocity = Math.sqrt((mx - prev.x) ** 2 + (my - prev.y) ** 2);
    mouseRef.current.x = mx;
    mouseRef.current.y = my;
    prevMouseRef.current = { x: mx, y: my };
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
    prevMouseRef.current = { x: mx, y: my };
  }, []);

  const handleTouchEnd = useCallback(() => {
    mouseRef.current.down = false;
  }, []);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      const t2 = (now - startRef.current) / 1000;
      const dt = 0.016;
      const mouse = mouseRef.current;

      physicsRef.current.forEach((p, i) => {
        const cellX = i % 5;
        const cellY = Math.floor(i / 5);
        if (!BLOCK_MAP.has(`${cellX},${cellY}`)) return;

        const bx = (cellX * (blockSize + gap) + blockSize / 2) / gridWidth;
        const by = (cellY * (blockSize + gap) + blockSize / 2) / gridHeight;
        const dx2 = mouse.x - bx;
        const dy2 = mouse.y - by;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) + 0.001;

        if (mode === 'gravity') {
          const gx = (mouse.x - 0.5) * 300;
          const gy = (mouse.y - 0.5) * 300;
          p.vx += gx * dt;
          p.vy += gy * dt;
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.vx -= p.px * 2 * dt;
          p.vy -= p.py * 2 * dt;
          p.px += p.vx * dt;
          p.py += p.vy * dt;
          p.px = Math.max(-40, Math.min(40, p.px));
          p.py = Math.max(-40, Math.min(40, p.py));
        }

        if (mode === 'elastic') {
          if (!mouse.down) {
            p.vx -= p.px * 8 * dt;
            p.vy -= p.py * 8 * dt;
            p.vx *= 0.9;
            p.vy *= 0.9;
            p.px += p.vx * dt;
            p.py += p.vy * dt;
          } else {
            p.px *= 0.95;
            p.py *= 0.95;
          }
        }

        if (mode === 'heat') {
          if (dist2 < 0.15) {
            p.heat = Math.min(1, p.heat + dt * 2);
          } else {
            p.heat = Math.max(0, p.heat - dt * 0.3);
          }
        }

        if (mode === 'paint' && mouse.down && dist2 < 0.12) {
          p.painted = (t2 * 50 + i * 10) % 360;
        }

        if (mode === 'bubble') {
          if (p.popped) {
            p.heat += dt;
            if (p.heat > 4) {
              p.popped = false;
              p.heat = 0;
            }
          } else if (dist2 < 0.1) {
            p.popped = true;
            p.heat = 0;
          }
        }

        if (mode === 'freeze' && dist2 > 0.4 && p.frozen) {
          if (seededRandom(Math.floor(t2) + i) > 0.98) {
            p.frozen = false;
          }
        }

        if (mode === 'eraser') {
          if (mouse.down && dist2 < 0.12 && p.heat <= 0) {
            p.popped = true;
            p.heat = 0.01;
          }
          if (p.popped) {
            p.heat += dt * 0.5;
            if (p.heat > 5) { p.popped = false; p.heat = 0; }
          }
        }

        if (mode === 'revealer' && dist2 < 0.12) {
          p.painted = 1;
        }

        if (mode === 'antigravity') {
          if (mouse.down) {
            p.vy -= 80 * dt;
          } else {
            p.vy += 120 * dt;
          }
          p.vy *= 0.95;
          p.py += p.vy * dt;
          p.py = Math.max(-50, Math.min(0, p.py));
          if (p.py >= 0) { p.py = 0; p.vy = 0; }
        }

        if (mode === 'inflate' && mouse.down && dist2 < 0.25) {
          p.heat += dt * 0.8;
        }

        if (mode === 'inflate' && !mouse.down && p.heat < 2) {
          p.heat = Math.max(0, p.heat - dt * 0.5);
        }

        if (mode === 'lavalamp2') {
          if (mouse.down && dist2 < 0.15) {
            p.heat = Math.min(1, p.heat + dt * 1.5);
          } else {
            p.heat = Math.max(0, p.heat - dt * 0.2);
          }
        }

        if (mode === 'vaporize') {
          if (dist2 < 0.15 && !p.popped) {
            p.popped = true;
            p.heat = 0;
          }
          if (p.popped) {
            p.heat += dt;
            if (p.heat > 4) { p.popped = false; p.heat = 0; }
          }
        }

        if (mode === 'glueGun' && mouse.down && dist2 < 0.15 && p.painted < 0) {
          p.painted = mouse.x * 360;
          p.heat = mouse.y;
        }

        if (mode === 'slingshot2') {
          if (!mouse.down) {
            p.vx -= p.px * 12 * dt;
            p.vy -= p.py * 12 * dt;
            p.vx *= 0.92;
            p.vy *= 0.92;
            p.px += p.vx * dt;
            p.py += p.vy * dt;
          } else {
            p.px = -((mouse.x - 0.5) * 40);
            p.py = -((mouse.y - 0.5) * 30);
            p.vx = 0; p.vy = 0;
          }
        }

        if (mode === 'flick' || mode === 'wrecking') {
          p.vx *= 0.93;
          p.vy *= 0.93;
          p.vx -= p.px * 3 * dt;
          p.vy -= p.py * 3 * dt;
          p.px += p.vx * dt;
          p.py += p.vy * dt;
          p.px = Math.max(-50, Math.min(50, p.px));
          p.py = Math.max(-50, Math.min(50, p.py));
        }

        if (mode === 'seesaw') {
          const target = mouse.down ? (mouse.x < 0.5 ? -1 : 1) : 0;
          p.heat += (target - p.heat) * 3 * dt;
        }

        if (mode === 'splitMerge') {
          if (t2 - mouse.clickTime < dt * 2 && mouse.clickTime > 0) {
            p.heat = p.heat > 0.5 ? 0 : 1;
          }
          const target2 = p.heat > 0.5 ? 1 : 0;
          p.heat += (target2 - p.heat) * 5 * dt;
        }

        if (mode === 'sponge') {
          if (dist2 < 0.15 && !mouse.down) {
            p.heat = Math.min(1, p.heat + dt * 1.5);
          }
          if (mouse.down) {
            p.heat = Math.max(0, p.heat - dt * 2);
          }
        }

        if (mode === 'squeegee' && mouse.down && dist2 < 0.12 && p.painted < 0) {
          p.painted = (t2 * 30 + i * 15) % 360;
        }

        if (mode === 'suction') {
          if (!mouse.down) {
            p.vx -= p.px * 6 * dt;
            p.vy -= p.py * 6 * dt;
            p.vx *= 0.9;
            p.vy *= 0.9;
            p.px += p.vx * dt;
            p.py += p.vy * dt;
          } else {
            p.px = (mouse.x - mouse.clickX) * 100;
            p.py = (mouse.y - mouse.clickY) * 80;
          }
        }

        if (mode === 'vacuum') {
          if (mouse.down) {
            p.vx = -(mouse.x - 0.5) * 40;
            p.vy = -(mouse.y - 0.5) * 30;
          } else {
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.vx -= p.px * 4 * dt;
            p.vy -= p.py * 4 * dt;
            p.px += p.vx * dt;
            p.py += p.vy * dt;
            p.px = Math.max(-60, Math.min(60, p.px));
            p.py = Math.max(-60, Math.min(60, p.py));
          }
        }
      });

      setTime(t2);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mode, blockSize, gap, gridWidth, gridHeight]);

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
      style={{
        position: 'relative',
        width: gridWidth,
        height: gridHeight,
        transform: 'translate3d(0,0,0)',
        cursor: 'crosshair',
        touchAction: 'none',
      }}
    >
      {ALL_CELLS.map(({ x, y }) => {
        const block = BLOCK_MAP.get(`${x},${y}`);
        if (!block) return null;

        const baseLeft = x * (blockSize + gap);
        const baseTop = y * (blockSize + gap);
        const idx = x + y * 5;
        const physics = physicsRef.current[idx];
        const state = computeBlock(mode, x, y, idx, mouseRef.current, time, physics, blockSize, gridWidth, gridHeight);
        const bgColor = state.colorOverride || block.color;
        const noTransition = mode === 'lightning' || mode === 'fireworks';

        return (
          <div
            key={`${x},${y}`}
            style={{
              position: 'absolute',
              left: baseLeft + state.offsetX,
              top: baseTop + state.offsetY,
              width: blockSize,
              height: blockSize,
              borderRadius: radius,
              background: getMatteBackground(bgColor),
              boxShadow: insetShadow,
              transform: `scale(${state.scale}) rotate(${state.rotation}deg) skewX(${state.skewX}deg) skewY(${state.skewY}deg)`,
              filter: `brightness(${state.brightness}) hue-rotate(${state.hueShift}deg)${state.blur ? ` blur(${state.blur}px)` : ''}`,
              opacity: state.opacity,
              transition: noTransition ? 'none' : 'left 0.05s, top 0.05s',
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </div>
  );
}
