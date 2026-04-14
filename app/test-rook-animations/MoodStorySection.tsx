'use client';

import { useState, useEffect, useRef } from 'react';
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

// Easing functions
function easeInOut(t: number): number { return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; }
function easeOut(t: number): number { return 1 - (1 - t) * (1 - t); }
function easeIn(t: number): number { return t * t; }

type StoryId =
  | 'wakeUp' | 'seeSpider' | 'victory' | 'stubToe' | 'loveStruck'
  | 'sneeze' | 'nightmare' | 'coffee' | 'awkwardWave' | 'showOff'
  | 'brainFreeze' | 'hiccups' | 'startle' | 'yawn' | 'tantrum'
  | 'shy' | 'discovery' | 'workout' | 'dizzy' | 'goodnight';

const STORIES: { id: StoryId; label: string; description: string; duration: number }[] = [
  { id: 'wakeUp', label: 'Wake Up', description: 'Rookie boots up for a new day', duration: 6 },
  { id: 'seeSpider', label: 'See Spider', description: 'Rookie spots something scary', duration: 5 },
  { id: 'victory', label: 'Victory', description: 'Rookie just won a game!', duration: 5 },
  { id: 'stubToe', label: 'Stub Toe', description: 'Rookie bumps into something', duration: 4 },
  { id: 'loveStruck', label: 'Love Struck', description: 'Rookie sees a cute queen piece', duration: 6 },
  { id: 'sneeze', label: 'Sneeze', description: 'Ah... ah... ACHOO!', duration: 4 },
  { id: 'nightmare', label: 'Nightmare', description: 'Rookie has a bad dream', duration: 7 },
  { id: 'coffee', label: 'Morning Coffee', description: 'From sleepy to WIRED', duration: 6 },
  { id: 'awkwardWave', label: 'Awkward Wave', description: 'Waves at someone who wasn\'t waving at them', duration: 5 },
  { id: 'showOff', label: 'Show Off', description: 'Rookie tries to impress and fails', duration: 6 },
  { id: 'brainFreeze', label: 'Brain Freeze', description: 'Ate ice cream too fast', duration: 4 },
  { id: 'hiccups', label: 'Hiccups', description: 'Can\'t. Stop. Hiccupping.', duration: 6 },
  { id: 'startle', label: 'Jump Scare', description: 'BOO!', duration: 3 },
  { id: 'yawn', label: 'Big Yawn', description: 'So sleepy... contagious yawning', duration: 5 },
  { id: 'tantrum', label: 'Tantrum', description: 'Rookie throws a fit after losing', duration: 5 },
  { id: 'shy', label: 'Stage Fright', description: 'Rookie has to present and freezes up', duration: 6 },
  { id: 'discovery', label: 'Eureka!', description: 'Rookie figures something out', duration: 5 },
  { id: 'workout', label: 'Workout', description: 'Rookie does reps and gets tired', duration: 6 },
  { id: 'dizzy', label: 'Dizzy', description: 'Rookie spins around too much', duration: 5 },
  { id: 'goodnight', label: 'Goodnight', description: 'Rookie powers down for sleep', duration: 6 },
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

// Tint all blocks to a mood color
function applyMood(state: BlockState, mood: string, strength: number) {
  const moods: Record<string, [number, number, number]> = {
    sleep: [140, 100, 180],
    happy: [88, 204, 2],
    scared: [220, 40, 40],
    love: [220, 80, 160],
    angry: [220, 30, 30],
    cold: [100, 180, 240],
    hot: [255, 100, 0],
    proud: [180, 140, 50],
    embarrassed: [60, 40, 40],
    neutral: [128, 128, 128],
    excited: [255, 200, 0],
    zen: [180, 200, 220],
  };
  const [cr, cg, cb] = moods[mood] || moods.neutral;
  state.colorOverride = hslToHex(
    (Math.atan2(cb - 128, cr - 128) * 180 / Math.PI + 360) % 360,
    50 + strength * 30,
    35 + strength * 20
  );
}

function computeStory(
  story: StoryId, x: number, y: number, blockIdx: number, t: number,
  duration: number,
): BlockState {
  const state = ds();
  const dist = Math.sqrt((x - CENTER_X) ** 2 + (y - CENTER_Y) ** 2);
  const normDist = dist / 3.2;
  const angle = Math.atan2(y - CENTER_Y, x - CENTER_X);
  // Normalized progress through the story (0-1, looping)
  const raw = (t % duration) / duration;

  switch (story) {
    case 'wakeUp': {
      // Phase 1 (0-0.3): dark/asleep, blocks dim
      // Phase 2 (0.3-0.5): one block flickers on
      // Phase 3 (0.5-0.8): all blocks power on outward from center
      // Phase 4 (0.8-1): happy stretch
      if (raw < 0.3) {
        state.brightness = 0.05 + Math.sin(t * 0.5) * 0.02;
        state.opacity = 0.3;
      } else if (raw < 0.5) {
        const flickerP = (raw - 0.3) / 0.2;
        if (x === 2 && y === 1) {
          // One eye opens
          const flicker = Math.sin(flickerP * 20) > 0 ? 1 : 0;
          state.brightness = flicker * flickerP * 1.5;
          state.opacity = 0.3 + flickerP * 0.7;
        } else {
          state.brightness = 0.05;
          state.opacity = 0.3;
        }
      } else if (raw < 0.8) {
        const bootP = (raw - 0.5) / 0.3;
        const bootDelay = normDist * 0.8;
        const localBoot = Math.max(0, bootP - bootDelay) / (1 - bootDelay);
        state.brightness = 0.05 + easeOut(Math.min(1, localBoot)) * 1.1;
        state.opacity = 0.3 + easeOut(Math.min(1, localBoot)) * 0.7;
        if (localBoot > 0 && localBoot < 0.3) {
          state.brightness += 0.5; // flash on boot
        }
      } else {
        // Stretch! Blocks spread outward slightly
        const stretchP = (raw - 0.8) / 0.2;
        const stretch = Math.sin(stretchP * Math.PI);
        state.offsetX = (x - CENTER_X) * stretch * 3;
        state.offsetY = (y - CENTER_Y) * stretch * 2;
        state.brightness = 1.1 + stretch * 0.3;
        state.scale = 1 + stretch * 0.05;
        state.hueShift = -15; // warm morning glow
      }
      break;
    }

    case 'seeSpider': {
      // Phase 1 (0-0.2): calm, looking around
      // Phase 2 (0.2-0.3): FREEZE — spot the spider
      // Phase 3 (0.3-0.6): panic shake
      // Phase 4 (0.6-1): slowly calming down
      if (raw < 0.2) {
        const look = Math.sin(raw * 20);
        state.offsetX = look * 3;
        state.brightness = 1;
      } else if (raw < 0.3) {
        // FREEZE
        state.brightness = 1.5;
        state.scale = 1.1;
        // Everything locks
      } else if (raw < 0.6) {
        // PANIC
        const panic = (raw - 0.3) / 0.3;
        const shake = (1 - panic) * 8;
        state.offsetX = Math.sin(t * 30) * shake;
        state.offsetY = Math.cos(t * 25) * shake * 0.5;
        state.brightness = 0.8 + Math.sin(t * 10) * 0.4;
        state.colorOverride = hslToHex(0, 60 + (1 - panic) * 30, 40);
        // Jump back
        state.offsetY -= (1 - panic) * 10;
        state.scale = 1 + (1 - panic) * 0.1;
      } else {
        // Calm down
        const calm = (raw - 0.6) / 0.4;
        const shiver = (1 - calm) * 2;
        state.offsetX = Math.sin(t * 8) * shiver;
        state.brightness = 0.8 + calm * 0.2;
        state.hueShift = (1 - calm) * -20; // back to normal
      }
      break;
    }

    case 'victory': {
      // Phase 1 (0-0.15): moment of realization
      // Phase 2 (0.15-0.4): EXPLOSION of joy — blocks burst outward
      // Phase 3 (0.4-0.7): bouncing celebration
      // Phase 4 (0.7-1): proud glow
      if (raw < 0.15) {
        const build = raw / 0.15;
        state.scale = 1 + build * 0.15;
        state.brightness = 1 + build * 0.8;
      } else if (raw < 0.4) {
        const burst = (raw - 0.15) / 0.25;
        const burstOut = Math.sin(burst * Math.PI);
        state.offsetX = (x - CENTER_X) * burstOut * 12;
        state.offsetY = (y - CENTER_Y) * burstOut * 10;
        state.scale = 1 + burstOut * 0.3;
        state.brightness = 1.5 + burstOut * 1.0;
        state.hueShift = burst * 120;
        state.rotation = burstOut * 15 * (x > CENTER_X ? 1 : -1);
      } else if (raw < 0.7) {
        const bounceP = (raw - 0.4) / 0.3;
        const bounce = Math.abs(Math.sin(bounceP * Math.PI * 3)) * (1 - bounceP);
        state.offsetY = -bounce * 15;
        state.scale = 1 + bounce * 0.1;
        state.brightness = 1.2 + bounce * 0.4;
        state.colorOverride = hslToHex(50, 70, 50); // golden
      } else {
        const glow = (raw - 0.7) / 0.3;
        state.brightness = 1.2 - glow * 0.2;
        state.colorOverride = hslToHex(45, 60 - glow * 20, 50);
        state.scale = 1 + Math.sin(glow * Math.PI * 2) * 0.02;
      }
      break;
    }

    case 'stubToe': {
      // Phase 1 (0-0.1): walking along
      // Phase 2 (0.1-0.15): IMPACT
      // Phase 3 (0.15-0.5): hopping in pain
      // Phase 4 (0.5-1): slowly recovering
      if (raw < 0.1) {
        const walk = Math.sin(raw * 40) * 2;
        state.offsetX = raw * 30;
        state.offsetY = Math.abs(walk);
        state.brightness = 1;
      } else if (raw < 0.15) {
        // WHAM
        state.offsetX = 3;
        state.brightness = 2.5;
        state.scale = 1.2;
        state.colorOverride = '#ffffff';
        state.offsetY = 3;
      } else if (raw < 0.5) {
        const hop = (raw - 0.15) / 0.35;
        const hopBounce = Math.abs(Math.sin(hop * Math.PI * 4));
        state.offsetY = -hopBounce * 12;
        state.offsetX = -hop * 8; // hopping backward
        state.brightness = 1 + (1 - hop) * 0.5;
        state.colorOverride = hslToHex(0, 50 + (1 - hop) * 40, 45);
        // Throbbing pain at base
        if (y >= 4) {
          state.scale = 1 + Math.sin(t * 8) * 0.1 * (1 - hop);
          state.brightness += 0.3;
        }
      } else {
        const recover = (raw - 0.5) / 0.5;
        state.brightness = 0.8 + recover * 0.2;
        // Slight limp
        state.offsetY = Math.sin(t * 2) * (1 - recover) * 2;
      }
      break;
    }

    case 'loveStruck': {
      // Phase 1 (0-0.2): normal, looking
      // Phase 2 (0.2-0.4): sees someone — eyes widen, brightens
      // Phase 3 (0.4-0.8): heart beating, pink glow, slight float
      // Phase 4 (0.8-1): dreamy swaying
      if (raw < 0.2) {
        state.brightness = 0.9;
        state.offsetX = Math.sin(raw * 15) * 2;
      } else if (raw < 0.4) {
        const notice = (raw - 0.2) / 0.2;
        state.scale = 1 + easeOut(notice) * 0.15;
        state.brightness = 1 + easeOut(notice) * 0.8;
        state.colorOverride = hslToHex(340, notice * 60, 50 + notice * 15);
      } else if (raw < 0.8) {
        const loveP = (raw - 0.4) / 0.4;
        // Heartbeat
        const beat = t % 1;
        let heartScale = 1;
        if (beat < 0.08) heartScale = 1.15;
        else if (beat < 0.2) heartScale = 1.05;
        else if (beat < 0.28) heartScale = 1.12;
        state.scale = heartScale;
        state.colorOverride = hslToHex(340, 60, 50 + Math.sin(t * 3) * 5);
        state.brightness = 1.2 + Math.sin(t * 2) * 0.2;
        // Floating
        state.offsetY = -3 + Math.sin(t * 1.5) * 3;
      } else {
        const dreamy = (raw - 0.8) / 0.2;
        state.offsetX = Math.sin(t * 0.8) * 5;
        state.offsetY = Math.sin(t * 0.6) * 3;
        state.brightness = 1.1;
        state.colorOverride = hslToHex(340, 40 - dreamy * 20, 50);
        state.skewX = Math.sin(t * 0.8) * 3;
      }
      break;
    }

    case 'sneeze': {
      // Phase 1 (0-0.4): building up — "ah... ah..."
      // Phase 2 (0.4-0.5): ACHOO — explosive
      // Phase 3 (0.5-1): recovery, dazed
      if (raw < 0.4) {
        const build = raw / 0.4;
        // Tilting back — wind up
        const tiltBack = Math.sin(build * Math.PI * 3) * build;
        state.offsetY = -tiltBack * 8;
        state.offsetX = -tiltBack * 2;
        state.scale = 1 + build * 0.1;
        state.brightness = 1 + build * 0.5;
        // Scrunching
        state.skewX = tiltBack * 5;
        // Getting redder
        state.colorOverride = hslToHex(0, build * 40, 45 + build * 10);
      } else if (raw < 0.5) {
        // ACHOO!
        const sneeze = (raw - 0.4) / 0.1;
        state.offsetY = 8 + sneeze * 5;
        state.offsetX = sneeze * 6;
        state.scale = 0.85;
        state.brightness = 2 + (1 - sneeze) * 1;
        // Blocks scatter forward
        state.offsetX += (x - CENTER_X) * sneeze * 8;
        state.offsetY += sneeze * 5;
        state.rotation = (x - CENTER_X) * sneeze * 10;
      } else {
        // Recovery
        const recover = (raw - 0.5) / 0.5;
        state.offsetY = 5 * (1 - easeOut(recover));
        state.brightness = 0.7 + easeOut(recover) * 0.3;
        state.scale = 0.9 + easeOut(recover) * 0.1;
        // Dazed wobble
        state.offsetX = Math.sin(t * 2) * (1 - recover) * 3;
      }
      break;
    }

    case 'nightmare': {
      // Phase 1 (0-0.2): peaceful sleeping
      // Phase 2 (0.2-0.5): dream turns bad — dark colors, jitter
      // Phase 3 (0.5-0.7): peak terror — violent shake, red flashes
      // Phase 4 (0.7-0.85): WAKE UP — bright flash
      // Phase 5 (0.85-1): panting, slowly calming
      if (raw < 0.2) {
        state.brightness = 0.15 + Math.sin(t * 0.5) * 0.05;
        state.opacity = 0.5;
        state.colorOverride = hslToHex(260, 30, 20);
      } else if (raw < 0.5) {
        const dread = (raw - 0.2) / 0.3;
        state.brightness = 0.15 + dread * 0.2;
        state.colorOverride = hslToHex(280 - dread * 40, 40 + dread * 30, 15 + dread * 5);
        state.offsetX = Math.sin(t * 5 * dread) * dread * 3;
        state.offsetY = Math.cos(t * 4 * dread) * dread * 2;
        state.opacity = 0.5 + dread * 0.2;
        // Shadow growing
        state.scale = 1 + dread * 0.05;
      } else if (raw < 0.7) {
        const terror = (raw - 0.5) / 0.2;
        state.offsetX = Math.sin(t * 20) * 6;
        state.offsetY = Math.cos(t * 18) * 4;
        state.brightness = 0.2 + Math.sin(t * 8) * 0.3;
        state.colorOverride = hslToHex(0, 70, 25 + Math.sin(t * 6) * 10);
        state.scale = 1 + Math.sin(t * 10) * 0.08;
      } else if (raw < 0.85) {
        const wake = (raw - 0.7) / 0.15;
        if (wake < 0.3) {
          // FLASH — waking up
          state.brightness = 3;
          state.colorOverride = '#ffffff';
          state.scale = 1.2;
        } else {
          state.brightness = 3 - (wake - 0.3) * 3;
          state.scale = 1.2 - (wake - 0.3) * 0.2;
        }
      } else {
        // Panting
        const calm = (raw - 0.85) / 0.15;
        const pant = Math.sin(t * 6) * (1 - calm);
        state.scale = 1 + pant * 0.05;
        state.brightness = 1 + pant * 0.1;
        state.offsetY = pant * 2;
      }
      break;
    }

    case 'coffee': {
      // Phase 1 (0-0.3): sleepy, dim, droopy
      // Phase 2 (0.3-0.5): sipping — slight perk up
      // Phase 3 (0.5-0.7): caffeine hits — vibrating
      // Phase 4 (0.7-1): WIRED — fast, bright, jittery
      if (raw < 0.3) {
        state.brightness = 0.3 + Math.sin(t * 0.3) * 0.05;
        state.offsetY = 3; // drooping
        state.scale = 0.95;
        state.colorOverride = hslToHex(260, 20, 25);
      } else if (raw < 0.5) {
        const sip = (raw - 0.3) / 0.2;
        state.brightness = 0.3 + sip * 0.5;
        state.offsetY = 3 - sip * 2;
        state.scale = 0.95 + sip * 0.05;
        state.colorOverride = hslToHex(30, sip * 40, 25 + sip * 15);
      } else if (raw < 0.7) {
        const kick = (raw - 0.5) / 0.2;
        state.brightness = 0.8 + kick * 0.7;
        state.scale = 1 + kick * 0.05;
        state.offsetX = Math.sin(t * 10 * kick) * kick * 2;
        state.offsetY = 1 - kick * 2;
        state.colorOverride = hslToHex(40, 50 + kick * 30, 40 + kick * 15);
      } else {
        // WIRED
        const wired = (raw - 0.7) / 0.3;
        state.brightness = 1.5 + Math.sin(t * 15) * 0.3;
        state.scale = 1.05 + Math.sin(t * 12) * 0.03;
        state.offsetX = Math.sin(t * 20) * 2;
        state.offsetY = Math.cos(t * 18) * 1.5 - 2;
        state.colorOverride = hslToHex(50, 80, 50 + Math.sin(t * 8) * 5);
        state.rotation = Math.sin(t * 15) * 3;
      }
      break;
    }

    case 'awkwardWave': {
      // Phase 1 (0-0.2): sees someone, waves enthusiastically
      // Phase 2 (0.2-0.4): waving — top blocks move
      // Phase 3 (0.4-0.6): realizes they weren't waving at them
      // Phase 4 (0.6-1): slowly shrinks in embarrassment
      if (raw < 0.2) {
        const notice = raw / 0.2;
        state.brightness = 1 + notice * 0.3;
        state.scale = 1 + notice * 0.05;
      } else if (raw < 0.4) {
        const wave = (raw - 0.2) / 0.2;
        // Top blocks wave
        if (y <= 1) {
          state.offsetX = Math.sin(wave * Math.PI * 4) * 8;
          state.offsetY = -Math.abs(Math.sin(wave * Math.PI * 4)) * 4;
        }
        state.brightness = 1.3;
        state.colorOverride = hslToHex(50, 50, 50);
      } else if (raw < 0.6) {
        const realize = (raw - 0.4) / 0.2;
        // Freeze mid-wave
        if (y <= 1) {
          state.offsetX = 6 * (1 - realize);
          state.offsetY = -3 * (1 - realize);
        }
        state.brightness = 1.3 - realize * 0.5;
      } else {
        const shrink = (raw - 0.6) / 0.4;
        // Embarrassed shrink
        state.scale = 1 - easeIn(shrink) * 0.2;
        state.brightness = 0.5 + (1 - shrink) * 0.3;
        state.colorOverride = hslToHex(0, shrink * 30, 35);
        state.offsetY = shrink * 3; // sinking
      }
      break;
    }

    case 'showOff': {
      // Phase 1 (0-0.3): spinning trick attempt
      // Phase 2 (0.3-0.5): doing great! Glowing
      // Phase 3 (0.5-0.6): loses balance
      // Phase 4 (0.6-1): falls over, embarrassed
      if (raw < 0.3) {
        const spin = raw / 0.3;
        state.rotation = spin * 360;
        state.scale = 1 + spin * 0.1;
        state.brightness = 1 + spin * 0.5;
        state.offsetY = -spin * 5;
      } else if (raw < 0.5) {
        const glory = (raw - 0.3) / 0.2;
        state.rotation = 360 + glory * 180;
        state.brightness = 1.5 + Math.sin(glory * Math.PI) * 0.5;
        state.colorOverride = hslToHex(45, 70, 50);
        state.offsetY = -5;
        state.scale = 1.1;
      } else if (raw < 0.6) {
        // Wobble
        const wobble = (raw - 0.5) / 0.1;
        state.rotation = 540 + wobble * 30;
        state.skewX = Math.sin(wobble * 10) * 15;
        state.offsetX = wobble * 10;
        state.brightness = 1.2;
      } else {
        // FALL
        const fall = (raw - 0.6) / 0.4;
        if (fall < 0.3) {
          state.rotation = 570 + fall * 90;
          state.offsetY = fall * 15;
          state.offsetX = 10 + fall * 5;
        } else {
          // On the ground
          state.rotation = 90;
          state.offsetY = 8;
          state.offsetX = 12;
          state.brightness = 0.5;
          state.colorOverride = hslToHex(0, 25, 35);
        }
      }
      break;
    }

    case 'brainFreeze': {
      // Phase 1 (0-0.2): happily eating
      // Phase 2 (0.2-0.3): FREEZE hits
      // Phase 3 (0.3-0.8): agony — cold colors, squeezing
      // Phase 4 (0.8-1): relief
      if (raw < 0.2) {
        state.brightness = 1.1;
        state.offsetY = Math.sin(raw * 20) * 1;
        state.colorOverride = hslToHex(45, 40, 50);
      } else if (raw < 0.3) {
        // FREEZE
        state.brightness = 2;
        state.colorOverride = hslToHex(200, 80, 60);
        state.scale = 1.15;
      } else if (raw < 0.8) {
        const agony = (raw - 0.3) / 0.5;
        state.colorOverride = hslToHex(200 + agony * 20, 60, 45);
        state.brightness = 0.7 + Math.sin(t * 4) * 0.2;
        // Squeezing head — blocks compress
        state.offsetX = -(x - CENTER_X) * (1 - agony) * 2;
        state.offsetY = -(y - CENTER_Y) * (1 - agony) * 1.5;
        state.scale = 0.9 + agony * 0.1;
        if (y <= 1) {
          // Crown throbs
          state.brightness += Math.sin(t * 6) * 0.3;
        }
      } else {
        const relief = (raw - 0.8) / 0.2;
        state.brightness = 0.8 + relief * 0.2;
        state.scale = 1;
        state.offsetY = Math.sin(relief * Math.PI) * -2; // relief sigh
      }
      break;
    }

    case 'hiccups': {
      // Repeated jolts
      const hiccupInterval = 0.8; // seconds
      const hiccupPhase = (t % hiccupInterval) / hiccupInterval;
      const isHiccup = hiccupPhase < 0.1;
      if (isHiccup) {
        const jolt = hiccupPhase / 0.1;
        state.offsetY = -8 * (1 - jolt);
        state.scale = 1 + (1 - jolt) * 0.15;
        state.brightness = 1 + (1 - jolt) * 0.8;
      } else {
        // Between hiccups — slight dread of next one
        const dread = (hiccupPhase - 0.1) / 0.9;
        state.brightness = 0.8 + dread * 0.1;
        state.offsetY = Math.sin(dread * Math.PI * 0.5) * 1;
        // Getting tenser
        state.scale = 1 - dread * 0.03;
      }
      // Getting more annoyed over time
      const annoyance = Math.min(1, raw * 2);
      state.hueShift = annoyance * -20;
      break;
    }

    case 'startle': {
      // Phase 1 (0-0.1): calm
      // Phase 2 (0.1-0.2): BOO! — blocks explode outward
      // Phase 3 (0.2-1): shocked, slowly settling
      if (raw < 0.1) {
        state.brightness = 0.9;
      } else if (raw < 0.2) {
        const boom = (raw - 0.1) / 0.1;
        state.offsetX = (x - CENTER_X) * boom * 15;
        state.offsetY = (y - CENTER_Y) * boom * 12 - boom * 10;
        state.scale = 1 + boom * 0.4;
        state.brightness = 3 - boom * 1.5;
        state.colorOverride = '#ffffff';
      } else {
        const settle = (raw - 0.2) / 0.8;
        const eased = easeOut(settle);
        state.offsetX = (x - CENTER_X) * 15 * (1 - eased);
        state.offsetY = ((y - CENTER_Y) * 12 - 10) * (1 - eased);
        state.scale = 1.4 - eased * 0.4;
        state.brightness = 1.5 - eased * 0.5;
        // Residual trembling
        state.offsetX += Math.sin(t * 10) * (1 - settle) * 2;
      }
      break;
    }

    case 'yawn': {
      // Phase 1 (0-0.3): building yawn — mouth opens (blocks spread vertically)
      // Phase 2 (0.3-0.6): full yawn — stretched wide, eyes squint
      // Phase 3 (0.6-0.8): closing — blocks compress back
      // Phase 4 (0.8-1): sleepy blink
      if (raw < 0.3) {
        const open = easeIn(raw / 0.3);
        state.offsetY = (y - CENTER_Y) * open * 3;
        state.brightness = 0.7 + open * 0.3;
        state.scale = 1 + open * 0.05;
      } else if (raw < 0.6) {
        const full = (raw - 0.3) / 0.3;
        state.offsetY = (y - CENTER_Y) * 3;
        state.brightness = 0.8;
        // Watery eyes — top blocks shimmer
        if (y <= 1) {
          state.brightness = 0.8 + Math.sin(full * Math.PI * 2) * 0.3;
        }
        state.scale = 1.05;
        // Slight lean back
        state.skewY = 2;
      } else if (raw < 0.8) {
        const close = (raw - 0.6) / 0.2;
        state.offsetY = (y - CENTER_Y) * 3 * (1 - easeOut(close));
        state.brightness = 0.7;
        state.scale = 1 + (1 - close) * 0.05;
      } else {
        // Sleepy
        const drowsy = (raw - 0.8) / 0.2;
        state.brightness = 0.5 + drowsy * 0.2;
        state.colorOverride = hslToHex(260, 20, 30);
        // Drooping
        state.offsetY = drowsy * 2;
      }
      break;
    }

    case 'tantrum': {
      // Phase 1 (0-0.1): upset face
      // Phase 2 (0.1-0.7): full tantrum — shaking, red, blocks flying
      // Phase 3 (0.7-1): exhausted, deflated
      if (raw < 0.1) {
        state.brightness = 0.8;
        state.colorOverride = hslToHex(0, 40, 40);
        state.skewX = -5;
      } else if (raw < 0.7) {
        const rage = (raw - 0.1) / 0.6;
        const intensity = Math.sin(rage * Math.PI); // peaks mid-tantrum
        state.offsetX = Math.sin(t * 25) * intensity * 10;
        state.offsetY = Math.cos(t * 20) * intensity * 5 - intensity * 5;
        state.rotation = Math.sin(t * 15) * intensity * 15;
        state.brightness = 1 + intensity * 1.0;
        state.colorOverride = hslToHex(0, 60 + intensity * 30, 40 + intensity * 10);
        state.scale = 1 + intensity * 0.1;
        // Blocks occasionally fly off
        if (Math.sin(t * 7 + blockIdx * 3) > 0.9 && intensity > 0.5) {
          state.offsetY -= 20;
          state.rotation = 45;
        }
      } else {
        const exhausted = (raw - 0.7) / 0.3;
        state.brightness = 0.4 + exhausted * 0.1;
        state.scale = 0.9;
        state.offsetY = 5 * (1 - exhausted * 0.3);
        state.colorOverride = hslToHex(0, 20, 30);
      }
      break;
    }

    case 'shy': {
      // Phase 1 (0-0.2): pushed onto stage — slides in
      // Phase 2 (0.2-0.5): freezes, shrinks
      // Phase 3 (0.5-0.8): blocks try to hide behind each other
      // Phase 4 (0.8-1): tiny wave, still scared
      if (raw < 0.2) {
        const enter = raw / 0.2;
        state.offsetX = (1 - easeOut(enter)) * -60;
        state.brightness = 0.7 + enter * 0.3;
      } else if (raw < 0.5) {
        const freeze = (raw - 0.2) / 0.3;
        state.scale = 1 - freeze * 0.2;
        state.brightness = 0.7 - freeze * 0.2;
        state.offsetY = freeze * 3;
        // Blushing
        state.colorOverride = hslToHex(0, freeze * 30, 40);
      } else if (raw < 0.8) {
        const hide = (raw - 0.5) / 0.3;
        // Blocks cluster toward center
        state.offsetX = -(x - CENTER_X) * hide * 4;
        state.offsetY = -(y - CENTER_Y) * hide * 3 + 3;
        state.scale = 0.8;
        state.brightness = 0.5;
        state.colorOverride = hslToHex(0, 20, 35);
      } else {
        // Tiny wave
        const wave = (raw - 0.8) / 0.2;
        state.offsetX = -(x - CENTER_X) * (1 - wave * 0.3) * 4;
        state.offsetY = -(y - CENTER_Y) * (1 - wave * 0.3) * 3 + 3;
        state.scale = 0.8;
        if (x === 4 && y === 0) {
          // One tiny wave
          state.offsetX += Math.sin(wave * Math.PI * 2) * 3;
          state.offsetY -= 2;
          state.brightness = 0.8;
        }
      }
      break;
    }

    case 'discovery': {
      // Phase 1 (0-0.3): thinking — blocks pulse slowly, looking around
      // Phase 2 (0.3-0.4): light bulb moment!
      // Phase 3 (0.4-0.7): EUREKA — radiating energy
      // Phase 4 (0.7-1): satisfied glow
      if (raw < 0.3) {
        const think = raw / 0.3;
        state.brightness = 0.6 + Math.sin(t * 2) * 0.1;
        state.offsetX = Math.sin(think * Math.PI * 2) * 3;
        // Crown block "thinking"
        if (x === 2 && y === 0) {
          state.brightness = 0.6 + Math.sin(t * 3) * 0.3;
        }
      } else if (raw < 0.4) {
        const bulb = (raw - 0.3) / 0.1;
        // Crown lights up first
        if (y <= 1) {
          state.brightness = 1 + bulb * 2;
          state.colorOverride = hslToHex(50, 80, 55);
          state.scale = 1 + bulb * 0.2;
        } else {
          state.brightness = 0.6 + bulb * 0.4;
        }
      } else if (raw < 0.7) {
        const eureka = (raw - 0.4) / 0.3;
        // Energy radiates from crown downward
        const radiateDelay = y * 0.15;
        const localRadiate = Math.max(0, eureka - radiateDelay);
        state.brightness = 1 + localRadiate * 1.5;
        state.colorOverride = hslToHex(50, 70, 45 + localRadiate * 15);
        state.scale = 1 + localRadiate * 0.1;
        state.offsetY = -localRadiate * 2;
        // Sparkle
        state.brightness += Math.sin(t * 8 + blockIdx * 2) * localRadiate * 0.3;
      } else {
        const glow = (raw - 0.7) / 0.3;
        state.brightness = 1.3 - glow * 0.3;
        state.colorOverride = hslToHex(50, 50 - glow * 20, 50);
        state.scale = 1.05 - glow * 0.05;
      }
      break;
    }

    case 'workout': {
      // Phase 1 (0-0.2): warm up — small bounces
      // Phase 2 (0.2-0.5): pumping — big movements
      // Phase 3 (0.5-0.8): slowing down, getting tired
      // Phase 4 (0.8-1): collapsed, panting
      if (raw < 0.2) {
        const warmup = raw / 0.2;
        const bounce = Math.sin(t * 4) * warmup * 5;
        state.offsetY = -Math.abs(bounce);
        state.brightness = 1 + warmup * 0.2;
      } else if (raw < 0.5) {
        const pump = (raw - 0.2) / 0.3;
        const rep = Math.sin(t * 6);
        state.offsetY = rep * 8;
        state.scale = 1 + Math.abs(rep) * 0.08;
        state.brightness = 1.2 + Math.abs(rep) * 0.3;
        // Getting red
        state.colorOverride = hslToHex(0, pump * 40, 45 + Math.abs(rep) * 5);
      } else if (raw < 0.8) {
        const tired = (raw - 0.5) / 0.3;
        const slowRep = Math.sin(t * (4 - tired * 2));
        state.offsetY = slowRep * (6 - tired * 4);
        state.brightness = 1 - tired * 0.3;
        state.colorOverride = hslToHex(0, 40 - tired * 10, 42);
        state.scale = 1 - tired * 0.05;
      } else {
        // Collapsed
        const collapse = (raw - 0.8) / 0.2;
        state.offsetY = 5;
        state.brightness = 0.4 + Math.sin(t * 3) * 0.05; // panting
        state.scale = 0.9;
        state.skewX = 5;
        state.colorOverride = hslToHex(0, 30, 35);
      }
      break;
    }

    case 'dizzy': {
      // Phase 1 (0-0.3): spinning fast
      // Phase 2 (0.3-0.5): stopping
      // Phase 3 (0.5-0.8): wobbling, seeing stars
      // Phase 4 (0.8-1): falling over
      if (raw < 0.3) {
        const spinSpeed = 8 - raw * 10;
        state.rotation = t * spinSpeed * 60;
        state.offsetX = Math.cos(t * spinSpeed) * 5;
        state.offsetY = Math.sin(t * spinSpeed) * 3;
        state.brightness = 1 + Math.sin(t * 10) * 0.3;
        state.blur = raw * 2;
      } else if (raw < 0.5) {
        const slow = (raw - 0.3) / 0.2;
        state.rotation = t * (8 * (1 - slow)) * 60;
        state.brightness = 1;
        state.blur = (1 - slow) * 2;
      } else if (raw < 0.8) {
        const wobble = (raw - 0.5) / 0.3;
        state.offsetX = Math.sin(t * 3) * (1 - wobble) * 10;
        state.offsetY = Math.cos(t * 2.5) * (1 - wobble) * 5;
        state.skewX = Math.sin(t * 4) * (1 - wobble) * 10;
        state.brightness = 0.9;
        // Seeing stars — random bright flashes
        if (y <= 1 && Math.sin(t * 12 + blockIdx * 5) > 0.8) {
          state.brightness = 2;
          state.colorOverride = hslToHex(50, 80, 60);
        }
      } else {
        // Topple
        const fall = (raw - 0.8) / 0.2;
        state.rotation = fall * 70;
        state.offsetX = fall * 10;
        state.offsetY = fall * 5;
        state.brightness = 0.6;
      }
      break;
    }

    case 'goodnight': {
      // Phase 1 (0-0.2): yawning, dimming
      // Phase 2 (0.2-0.5): blocks shut down top to bottom
      // Phase 3 (0.5-0.8): gentle breathing in sleep
      // Phase 4 (0.8-1): deep sleep, one block flickers (dreaming)
      if (raw < 0.2) {
        const dim = raw / 0.2;
        state.brightness = 1 - dim * 0.5;
        state.scale = 1 - dim * 0.03;
        state.colorOverride = hslToHex(260, dim * 30, 40 - dim * 10);
      } else if (raw < 0.5) {
        const shutdown = (raw - 0.2) / 0.3;
        const shutdownRow = shutdown * 6;
        if (y < shutdownRow) {
          state.brightness = 0.05;
          state.opacity = 0.3;
          state.colorOverride = hslToHex(260, 20, 15);
        } else if (y < shutdownRow + 1) {
          const edge = y - shutdownRow;
          state.brightness = 0.5 * edge;
          state.opacity = 0.3 + edge * 0.5;
        } else {
          state.brightness = 0.5 - shutdown * 0.2;
          state.colorOverride = hslToHex(260, 25, 30);
        }
      } else if (raw < 0.8) {
        // Gentle breathing in sleep
        const breathe = Math.sin(t * 0.8);
        state.brightness = 0.05 + (breathe + 1) * 0.03;
        state.opacity = 0.3;
        state.scale = 1 + breathe * 0.01;
        state.colorOverride = hslToHex(260, 20, 12);
      } else {
        // Deep sleep — one dream flicker
        state.brightness = 0.03;
        state.opacity = 0.25;
        state.colorOverride = hslToHex(260, 15, 10);
        // Dream flicker
        if (x === 3 && y === 2) {
          const dream = Math.sin(t * 1.5);
          state.brightness = 0.03 + Math.max(0, dream) * 0.15;
          state.opacity = 0.3;
        }
      }
      break;
    }
  }

  return state;
}

// ─── Story Rook Display ───
function StoryRook({ story, blockSize = 24 }: { story: StoryId; blockSize?: number }) {
  const [time, setTime] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const storyDuration = STORIES.find(s => s.id === story)?.duration || 5;

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      setTime((now - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [story]);

  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const radius = Math.max(1, Math.round(blockSize * 0.14));
  const gridWidth = 5 * blockSize + 4 * gap;
  const gridHeight = 6 * blockSize + 5 * gap;
  const scale = blockSize / 14;
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  const insetShadow = `inset 0 ${s(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${s(0.75)} 0 rgba(255,255,255,0.15)`;

  // Progress bar
  const progress = (time % storyDuration) / storyDuration;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        style={{
          position: 'relative',
          width: gridWidth,
          height: gridHeight,
          transform: 'translate3d(0,0,0)',
        }}
      >
        {ALL_CELLS.map(({ x, y }) => {
          const block = BLOCK_MAP.get(`${x},${y}`);
          if (!block) return null;

          const baseLeft = x * (blockSize + gap);
          const baseTop = y * (blockSize + gap);
          const idx = x + y * 5;
          const state = computeStory(story, x, y, idx, time, storyDuration);
          const bgColor = state.colorOverride || block.color;

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
                transition: 'left 0.05s, top 0.05s',
              }}
            />
          );
        })}
      </div>
      {/* Mini progress bar */}
      <div style={{ width: gridWidth, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: 'rgba(255,255,255,0.3)', borderRadius: 1, transition: 'width 0.1s linear' }} />
      </div>
    </div>
  );
}

// ─── Section ───
const PER_PAGE = 12;
const TOTAL_PAGES = Math.ceil(STORIES.length / PER_PAGE);

export default function MoodStorySection() {
  const [selected, setSelected] = useState<StoryId | null>(null);
  const [page, setPage] = useState(0);

  const pageItems = STORIES.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div>
      {selected ? (() => {
        const idx = STORIES.findIndex(a => a.id === selected);
        const prev = idx > 0 ? STORIES[idx - 1] : null;
        const next = idx < STORIES.length - 1 ? STORIES[idx + 1] : null;
        return (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 transition">Back to gallery</button>
            <div className="flex-1" />
            <button onClick={() => prev && setSelected(prev.id)} disabled={!prev} className="px-3 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition">Prev</button>
            <span className="text-xs text-white/30">{idx + 1}/{STORIES.length}</span>
            <button onClick={() => next && setSelected(next.id)} disabled={!next} className="px-3 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition">Next</button>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white/[0.03] rounded-2xl p-16 border border-white/[0.06]">
              <StoryRook story={selected} blockSize={40} />
            </div>
            <div className="text-center max-w-md">
              <p className="text-lg font-medium text-white/80">{STORIES[idx]?.label}</p>
              <p className="text-sm text-white/40 mt-1">{STORIES[idx]?.description}</p>
              <p className="text-xs text-white/25 mt-2">{STORIES[idx]?.duration}s loop</p>
            </div>
          </div>
        </div>);
      })() : (
        <div>
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                  page === i
                    ? 'bg-indigo-500/30 text-indigo-300 ring-1 ring-indigo-500/50'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {pageItems.map(({ id, label, description }) => (
              <div
                key={id}
                className="flex flex-col items-center gap-3 bg-white/[0.03] rounded-xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition cursor-pointer"
                onClick={() => setSelected(id)}
              >
                <StoryRook story={id} blockSize={18} />
                <div className="text-center">
                  <p className="text-xs font-medium text-white/80">{label}</p>
                  <p className="text-[10px] text-white/35 mt-0.5 line-clamp-2">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {TOTAL_PAGES > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="text-xs text-white/30">{page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, STORIES.length)} of {STORIES.length}</span>
              <button
                onClick={() => setPage(p => Math.min(TOTAL_PAGES - 1, p + 1))}
                disabled={page === TOTAL_PAGES - 1}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
