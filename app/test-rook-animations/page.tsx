'use client';

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { ROOK_BLOCKS, getMatteBackground } from '@/lib/daily-rook-blocks';

const InteractiveSection = lazy(() => import('./InteractiveSection'));

// ─── Block Data ───
const BLOCK_MAP = new Map(ROOK_BLOCKS.map(b => [`${b.x},${b.y}`, b]));
const ALL_CELLS = Array.from({ length: 30 }, (_, i) => ({
  x: i % 5,
  y: Math.floor(i / 5),
}));
const CENTER_X = 2;
const CENTER_Y = 2.5;

// ─── Animation Definitions ───
type AnimationId =
  | 'gravitySplash' | 'orbitalSpin' | 'matrixRain' | 'heartbeat3d'
  | 'glitchStorm' | 'firework' | 'dnaHelix' | 'blackHole'
  | 'rave' | 'jellyfish' | 'pixelSort' | 'earthquake'
  // New 40
  | 'lavaLamp' | 'typewriter' | 'tornado' | 'wave3d'
  | 'neonPulse' | 'tetrisDrop' | 'breathing' | 'supernova'
  | 'rubiksTwist' | 'clockwork' | 'aurora' | 'popcorn'
  | 'snake' | 'magneticField' | 'disco' | 'waterfall'
  | 'pinball' | 'origami' | 'fireflies' | 'sonar'
  | 'domino' | 'windmill' | 'bubbles' | 'laserGrid'
  | 'shuffle' | 'slingshot' | 'kaleidoscope' | 'tidal'
  | 'strobe' | 'pendulum' | 'morphWave' | 'constellation'
  | 'flipCards' | 'springy' | 'hologram' | 'drunkWalk'
  | 'vortexRings' | 'campfire' | 'glitchHop' | 'cosmicDust'
  // Batch 3 — 50 more
  | 'accordion' | 'antFarm' | 'beeSwarm' | 'bigBang' | 'blinds'
  | 'boiling' | 'carousel' | 'catScan' | 'centrifuge' | 'chainReaction'
  | 'clapboard' | 'comet' | 'crt' | 'crystalGrow' | 'diceRoll'
  | 'digitize' | 'drip' | 'electricArc' | 'elevator' | 'fibonacci'
  | 'filmReel' | 'fishSchool' | 'flameWar' | 'fracture' | 'fuse'
  | 'galaxySpiral' | 'geiger' | 'gravity' | 'heatMap' | 'hypnotize'
  | 'iceCrack' | 'jello' | 'jumpRope' | 'knightsTour' | 'lightsaber'
  | 'liquidMetal' | 'meltdown' | 'metronome' | 'mirage' | 'morse'
  | 'neutronStar' | 'piston' | 'plasma' | 'quantum' | 'radar'
  | 'ricochet' | 'sandstorm' | 'shatter' | 'sineCity' | 'teleport';

const ANIMATIONS: { id: AnimationId; label: string; description: string; sound?: { src: string; interval: number } }[] = [
  // Original 12
  { id: 'gravitySplash', label: 'Gravity Splash', description: 'Blocks fall from sky and bounce into place' },
  { id: 'orbitalSpin', label: 'Orbital Spin', description: 'Blocks orbit around center like planets' },
  { id: 'matrixRain', label: 'Matrix Rain', description: 'Blocks cascade down like digital rain' },
  { id: 'heartbeat3d', label: '3D Heartbeat', description: 'Pulsing heart with 3D perspective tilt' },
  { id: 'glitchStorm', label: 'Glitch Storm', description: 'Violent digital glitching and color corruption' },
  { id: 'firework', label: 'Firework', description: 'Blocks explode outward then reform' },
  { id: 'dnaHelix', label: 'DNA Helix', description: 'Double helix rotation with depth' },
  { id: 'blackHole', label: 'Black Hole', description: 'Blocks get sucked into center vortex' },
  { id: 'rave', label: 'Rave Mode', description: 'Strobing rainbow colors with bass drop scale' },
  { id: 'jellyfish', label: 'Jellyfish', description: 'Flowing tentacle-like wave motion' },
  { id: 'pixelSort', label: 'Pixel Sort', description: 'Glitch art sorting effect' },
  { id: 'earthquake', label: 'Earthquake', description: 'Violent shaking with blocks flying off' },
  // New 40
  { id: 'lavaLamp', label: 'Lava Lamp', description: 'Slow blobby rising and falling motion' },
  { id: 'typewriter', label: 'Typewriter', description: 'Blocks appear one by one like typing' },
  { id: 'tornado', label: 'Tornado', description: 'Spinning funnel that sucks blocks upward' },
  { id: 'wave3d', label: '3D Wave', description: 'Ocean wave rolling through with depth' },
  { id: 'neonPulse', label: 'Neon Pulse', description: 'Cyberpunk neon glow chase around edges' },
  { id: 'tetrisDrop', label: 'Tetris Drop', description: 'Rows drop in from top one at a time' },
  { id: 'breathing', label: 'Deep Breath', description: 'Whole rook expands and contracts like lungs' },
  { id: 'supernova', label: 'Supernova', description: 'Builds energy then detonates in blinding flash' },
  { id: 'rubiksTwist', label: 'Rubiks Twist', description: 'Rows and columns rotate independently' },
  { id: 'clockwork', label: 'Clockwork', description: 'Mechanical gear-like rotation with ticking' },
  { id: 'aurora', label: 'Aurora', description: 'Northern lights color waves flowing through' },
  { id: 'popcorn', label: 'Popcorn', description: 'Random blocks pop up with increasing frequency' },
  { id: 'snake', label: 'Snake', description: 'A light trail snakes through all blocks' },
  { id: 'magneticField', label: 'Magnetic Field', description: 'Blocks repel and attract like magnets' },
  { id: 'disco', label: 'Disco Floor', description: 'Alternating checkerboard color patterns' },
  { id: 'waterfall', label: 'Waterfall', description: 'Blocks flow downward like cascading water' },
  { id: 'pinball', label: 'Pinball', description: 'Blocks bounce around like pinballs' },
  { id: 'origami', label: 'Origami', description: 'Blocks fold and unfold like paper' },
  { id: 'fireflies', label: 'Fireflies', description: 'Random blocks glow and dim like fireflies' },
  { id: 'sonar', label: 'Sonar', description: 'Concentric rings pulse outward from center', sound: { src: '/sounds/sonar-ping.mp3', interval: 2 } },
  { id: 'domino', label: 'Domino', description: 'Blocks topple in sequence like dominoes' },
  { id: 'windmill', label: 'Windmill', description: 'Blocks rotate in windmill blade pattern' },
  { id: 'bubbles', label: 'Bubbles', description: 'Blocks float up like rising bubbles' },
  { id: 'laserGrid', label: 'Laser Grid', description: 'Scanning laser lines activate rows/columns' },
  { id: 'shuffle', label: 'Card Shuffle', description: 'Blocks shuffle and deal like playing cards' },
  { id: 'slingshot', label: 'Slingshot', description: 'Blocks pull back then snap forward' },
  { id: 'kaleidoscope', label: 'Kaleidoscope', description: 'Mirrored rotating color symmetry' },
  { id: 'tidal', label: 'Tidal', description: 'Slow massive wave rolling side to side' },
  { id: 'strobe', label: 'Strobe', description: 'Hard black/white strobe with scale punch' },
  { id: 'pendulum', label: 'Pendulum', description: 'Blocks swing like pendulums at different speeds' },
  { id: 'morphWave', label: 'Morph Wave', description: 'Blocks morph shape through wave distortion' },
  { id: 'constellation', label: 'Constellation', description: 'Blocks twinkle like stars at random' },
  { id: 'flipCards', label: 'Flip Cards', description: 'Blocks flip over revealing bright backs' },
  { id: 'springy', label: 'Springy', description: 'Blocks attached to springs, bouncing wildly' },
  { id: 'hologram', label: 'Hologram', description: 'Flickering scan-line holographic projection' },
  { id: 'drunkWalk', label: 'Drunk Walk', description: 'Blocks stumble around randomly' },
  { id: 'vortexRings', label: 'Vortex Rings', description: 'Rings of blocks rotate at different speeds' },
  { id: 'campfire', label: 'Campfire', description: 'Flickering warm glow rising upward' },
  { id: 'glitchHop', label: 'Glitch Hop', description: 'Musical rhythm with glitch transitions' },
  { id: 'cosmicDust', label: 'Cosmic Dust', description: 'Blocks drift apart like particles in space' },
  // Batch 3 — 50 more
  { id: 'accordion', label: 'Accordion', description: 'Rows compress and expand like an accordion' },
  { id: 'antFarm', label: 'Ant Farm', description: 'Blocks crawl around following invisible trails' },
  { id: 'beeSwarm', label: 'Bee Swarm', description: 'Chaotic buzzing motion around a moving queen' },
  { id: 'bigBang', label: 'Big Bang', description: 'Everything from a single point, expanding universe', sound: { src: '/sounds/epic-intro.mp3', interval: 6 } },
  { id: 'blinds', label: 'Window Blinds', description: 'Rows flip open and closed like venetian blinds' },
  { id: 'boiling', label: 'Boiling', description: 'Blocks bubble up from bottom with increasing fury' },
  { id: 'carousel', label: 'Carousel', description: '3D merry-go-round spinning with depth' },
  { id: 'catScan', label: 'CAT Scan', description: 'Medical scanner slice moving through the rook' },
  { id: 'centrifuge', label: 'Centrifuge', description: 'Spinning faster and faster, blocks fly outward', sound: { src: '/sounds/tribal-perc.mp3', interval: 30 } },
  { id: 'chainReaction', label: 'Chain Reaction', description: 'One block triggers the next in an explosive chain' },
  { id: 'clapboard', label: 'Clapboard', description: 'Movie clapboard snap with blocks falling into place' },
  { id: 'comet', label: 'Comet', description: 'Blocks streak across with glowing tail' },
  { id: 'crt', label: 'CRT TV', description: 'Old TV turn on/off with scan lines and static' },
  { id: 'crystalGrow', label: 'Crystal Grow', description: 'Blocks crystallize outward from a seed point' },
  { id: 'diceRoll', label: 'Dice Roll', description: 'Blocks tumble and land on random faces' },
  { id: 'digitize', label: 'Digitize', description: 'Blocks dissolve into pixels and reassemble' },
  { id: 'drip', label: 'Drip', description: 'Blocks melt and drip downward like paint' },
  { id: 'electricArc', label: 'Electric Arc', description: 'Lightning bolts jump between blocks' },
  { id: 'elevator', label: 'Elevator', description: 'Columns ride up and down at different floors' },
  { id: 'fibonacci', label: 'Fibonacci', description: 'Blocks spiral outward in golden ratio pattern' },
  { id: 'filmReel', label: 'Film Reel', description: 'Vertical film strip scrolling with sprocket holes' },
  { id: 'fishSchool', label: 'Fish School', description: 'Blocks move as one fluid school, changing direction' },
  { id: 'flameWar', label: 'Flame War', description: 'Two sides of the rook battle with fire colors' },
  { id: 'fracture', label: 'Fracture', description: 'Cracks spread through the rook then it shatters' },
  { id: 'fuse', label: 'Fuse', description: 'A burning fuse travels through blocks to detonation' },
  { id: 'galaxySpiral', label: 'Galaxy Spiral', description: 'Blocks form a rotating spiral galaxy with arms' },
  { id: 'geiger', label: 'Geiger Counter', description: 'Random radiation clicks with block flashes' },
  { id: 'gravity', label: 'Zero Gravity', description: 'Blocks float weightlessly with gentle collisions' },
  { id: 'heatMap', label: 'Heat Map', description: 'Temperature visualization cycling hot to cold' },
  { id: 'hypnotize', label: 'Hypnotize', description: 'Concentric pulsing rings that draw you in' },
  { id: 'iceCrack', label: 'Ice Crack', description: 'Frozen blocks crack and shatter with blue flash' },
  { id: 'jello', label: 'Jello', description: 'Wobbly gelatinous bouncing on impact' },
  { id: 'jumpRope', label: 'Jump Rope', description: 'Blocks arc up and over in jump rope motion' },
  { id: 'knightsTour', label: 'Knights Tour', description: 'Light moves in L-shaped chess knight pattern' },
  { id: 'lightsaber', label: 'Lightsaber', description: 'Blocks ignite row by row with energy sword glow' },
  { id: 'liquidMetal', label: 'Liquid Metal', description: 'T-1000 style mercury morphing and reforming' },
  { id: 'meltdown', label: 'Meltdown', description: 'Blocks melt from top to bottom into puddles' },
  { id: 'metronome', label: 'Metronome', description: 'Columns tick back and forth in perfect time' },
  { id: 'mirage', label: 'Mirage', description: 'Heat shimmer distortion like desert mirage' },
  { id: 'morse', label: 'Morse Code', description: 'Blocks flash SOS in morse code pattern' },
  { id: 'neutronStar', label: 'Neutron Star', description: 'Ultra-dense spinning with lighthouse beam' },
  { id: 'piston', label: 'Piston', description: 'Rows pump up and down like engine pistons' },
  { id: 'plasma', label: 'Plasma Ball', description: 'Electric tendrils reach from center to edges' },
  { id: 'quantum', label: 'Quantum', description: 'Blocks exist in superposition, flickering between states' },
  { id: 'radar', label: 'Radar Sweep', description: 'Rotating radar beam illuminates blocks it passes' },
  { id: 'ricochet', label: 'Ricochet', description: 'A bullet bounces between blocks lighting them up' },
  { id: 'sandstorm', label: 'Sandstorm', description: 'Blocks scatter in gusting desert wind' },
  { id: 'shatter', label: 'Shatter', description: 'Glass break effect with pieces flying everywhere' },
  { id: 'sineCity', label: 'Sine City', description: 'Multiple sine waves creating interference patterns' },
  { id: 'teleport', label: 'Teleport', description: 'Blocks dissolve and reassemble in new positions' },
];

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Deterministic pseudo-random based on seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// ─── Animation Engine ───
interface BlockState {
  x: number;
  y: number;
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

function getDefaultState(x: number, y: number): BlockState {
  return { x, y, offsetX: 0, offsetY: 0, scale: 1, rotation: 0, opacity: 1, brightness: 1, hueShift: 0, skewX: 0, skewY: 0, blur: 0 };
}

function animateBlock(anim: AnimationId, x: number, y: number, t: number, blockSize: number): BlockState {
  const state = getDefaultState(x, y);
  const dist = Math.sqrt((x - CENTER_X) ** 2 + (y - CENTER_Y) ** 2);
  const maxDist = 3.2;
  const normDist = dist / maxDist;
  const angle = Math.atan2(y - CENTER_Y, x - CENTER_X);
  const blockIdx = x + y * 5;

  switch (anim) {
    // ═══════════════════════════════════════════
    // ORIGINAL 12
    // ═══════════════════════════════════════════
    case 'gravitySplash': {
      const dropDelay = normDist * 0.5;
      const localT = Math.max(0, t - dropDelay);
      if (localT < 0.6) {
        const fallProgress = localT / 0.6;
        state.offsetY = -300 * (1 - fallProgress * fallProgress);
        state.opacity = fallProgress;
        state.scale = 0.5 + fallProgress * 0.5;
      } else {
        const bounceT = (localT - 0.6);
        const bounce = Math.abs(Math.sin(bounceT * 8)) * Math.exp(-bounceT * 3);
        state.offsetY = -bounce * 40;
        state.scale = 1 + bounce * 0.15;
        state.brightness = 1 + bounce * 0.8;
      }
      break;
    }

    case 'orbitalSpin': {
      const orbitSpeed = 0.8 + normDist * 0.4;
      const radius = 20 + normDist * 60;
      const phase = angle + t * orbitSpeed;
      state.offsetX = Math.cos(phase) * radius - (x - CENTER_X) * blockSize * 0.3;
      state.offsetY = Math.sin(phase) * radius * 0.5;
      state.scale = 0.7 + 0.3 * (1 + Math.sin(phase)) / 2;
      state.brightness = 0.6 + 0.8 * (1 + Math.sin(phase)) / 2;
      state.rotation = phase * 30;
      break;
    }

    case 'matrixRain': {
      const columnSpeed = 1.5 + (x * 0.3);
      const cyclePos = ((t * columnSpeed + y * 0.3) % 3);
      state.offsetY = cyclePos < 1 ? cyclePos * 40 : 0;
      state.opacity = cyclePos < 0.5 ? 1 : Math.max(0.1, 1 - (cyclePos - 0.5) * 0.8);
      state.brightness = cyclePos < 0.3 ? 2 : 0.5 + seededRandom(t * 10 + blockIdx) * 0.3;
      state.colorOverride = cyclePos < 0.3 ? '#00ff41' : cyclePos < 0.6 ? '#00cc33' : undefined;
      break;
    }

    case 'heartbeat3d': {
      const beatCycle = t % 1.2;
      let beatScale = 1;
      if (beatCycle < 0.1) beatScale = 1 + 0.25 * (beatCycle / 0.1);
      else if (beatCycle < 0.2) beatScale = 1.25 - 0.15 * ((beatCycle - 0.1) / 0.1);
      else if (beatCycle < 0.3) beatScale = 1.1 + 0.2 * ((beatCycle - 0.2) / 0.1);
      else if (beatCycle < 0.5) beatScale = 1.3 - 0.3 * ((beatCycle - 0.3) / 0.2);
      const perspY = (y - CENTER_Y) * 0.05 * Math.sin(t * 0.7);
      state.scale = beatScale * (1 - normDist * 0.1);
      state.skewX = perspY * 15;
      state.skewY = (x - CENTER_X) * 0.03 * Math.cos(t * 0.7) * 10;
      state.brightness = 0.8 + beatScale * 0.5;
      state.hueShift = beatScale > 1.1 ? -20 : 0;
      break;
    }

    case 'glitchStorm': {
      const glitchChance = Math.sin(t * 13 + x * 7 + y * 11);
      if (glitchChance > 0.3) {
        state.offsetX = (seededRandom(t * 100 + blockIdx) - 0.5) * 30;
        state.offsetY = (seededRandom(t * 100 + blockIdx + 99) - 0.5) * 10;
        state.hueShift = seededRandom(t * 50 + blockIdx) * 360;
        state.scale = 0.8 + seededRandom(t * 80 + blockIdx) * 0.6;
      }
      const splitPhase = Math.sin(t * 5 + y * 2);
      if (Math.abs(splitPhase) > 0.7) {
        state.offsetX += splitPhase * 8;
        state.brightness = 1.5 + seededRandom(t * 20 + blockIdx) * 0.5;
      }
      if (Math.sin(t * 3) > 0.85) {
        state.offsetX = Math.sin(t * 50 + y) * 20;
        state.blur = 2;
      }
      break;
    }

    case 'firework': {
      const cycle = t % 3;
      if (cycle < 0.5) {
        const gather = cycle / 0.5;
        state.offsetX = -(x - CENTER_X) * blockSize * gather * 0.8;
        state.offsetY = -(y - CENTER_Y) * blockSize * gather * 0.8;
        state.scale = 1 - gather * 0.5;
        state.brightness = 1 + gather;
      } else if (cycle < 1.2) {
        const explode = (cycle - 0.5) / 0.7;
        const force = explode * (1 - explode * 0.3);
        state.offsetX = (x - CENTER_X) * 35 * force;
        state.offsetY = (y - CENTER_Y) * 35 * force - 20 * force;
        state.scale = 0.5 + explode * 1.2;
        state.rotation = explode * 180 * (x > CENTER_X ? 1 : -1);
        state.brightness = 2.5 - explode * 1.5;
        state.hueShift = explode * 120;
      } else {
        const settle = (cycle - 1.2) / 1.8;
        const remaining = 1 - settle;
        state.offsetX = (x - CENTER_X) * 25 * remaining * (1 - settle);
        state.offsetY = (y - CENTER_Y) * 25 * remaining * (1 - settle) + Math.sin(settle * 6) * 5;
        state.scale = 1 + Math.sin(settle * 8) * 0.05;
        state.brightness = 1 + Math.sin(settle * 12) * 0.3;
        state.rotation = remaining * 60 * (x > CENTER_X ? 1 : -1);
      }
      break;
    }

    case 'dnaHelix': {
      const helixPhase = t * 1.5 + y * 0.8;
      const strand = x < CENTER_X ? -1 : x > CENTER_X ? 1 : 0;
      const depth = Math.sin(helixPhase + strand * Math.PI);
      state.offsetX = depth * 30 * (strand || Math.sin(helixPhase * 2));
      state.scale = 0.6 + 0.4 * (1 + depth) / 2;
      state.opacity = 0.4 + 0.6 * (1 + depth) / 2;
      state.brightness = 0.5 + (1 + depth) / 2;
      state.rotation = depth * 15;
      state.hueShift = depth * 60;
      break;
    }

    case 'blackHole': {
      const pullStrength = (Math.sin(t * 0.5) + 1) / 2;
      const spiralAngle = angle + t * 2 + normDist * 3;
      const pullDist = normDist * (1 - pullStrength * 0.7);
      state.offsetX = Math.cos(spiralAngle) * pullDist * 40 - (x - CENTER_X) * blockSize;
      state.offsetY = Math.sin(spiralAngle) * pullDist * 40 - (y - CENTER_Y) * blockSize;
      state.scale = 0.3 + pullDist * 0.9;
      state.rotation = t * 100 * (1 - normDist);
      state.brightness = 0.3 + pullDist * 1.2;
      state.opacity = 0.3 + pullDist * 0.7;
      break;
    }

    case 'rave': {
      const beat = t % 0.5;
      const beatHit = beat < 0.08;
      const bassScale = beatHit ? 1.3 : 1 + Math.sin(beat * Math.PI * 4) * 0.05;
      state.scale = bassScale;
      state.hueShift = (t * 200 + x * 60 + y * 80) % 360;
      state.brightness = beatHit ? 2.5 : 0.8 + Math.sin(t * 12 + normDist * 4) * 0.5;
      if (Math.sin(t * 20) > 0.9) {
        state.brightness = 3;
        state.colorOverride = '#ffffff';
      }
      state.offsetY = beatHit ? -8 : Math.sin(t * 6 + x) * 3;
      break;
    }

    case 'jellyfish': {
      const wave1 = Math.sin(t * 1.2 + x * 0.5 + y * 0.8);
      const wave2 = Math.sin(t * 0.8 - y * 0.6 + x * 0.3);
      const tentacle = Math.sin(t * 2 + y * 1.5) * (y / 5);
      state.offsetX = wave1 * 8 + tentacle * 6;
      state.offsetY = wave2 * 12 + Math.sin(t * 0.5) * 15 * (y / 5);
      state.scale = 1 + wave1 * 0.08;
      state.rotation = tentacle * 8;
      state.brightness = 0.7 + (wave1 + 1) * 0.4;
      state.hueShift = wave2 * 30 + y * 15;
      state.opacity = 0.6 + (1 - y / 5) * 0.4;
      break;
    }

    case 'pixelSort': {
      const sortWave = (t * 0.8 + x * 0.2) % 2;
      if (sortWave < 1) {
        const sortProgress = sortWave;
        const targetX = (x + Math.floor(sortProgress * 3)) % 5;
        state.offsetX = (targetX - x) * blockSize * sortProgress;
        state.brightness = 1.5;
        state.hueShift = sortProgress * 90;
      } else {
        const glitchP = sortWave - 1;
        state.offsetX = Math.sin(glitchP * 20 + y * 5) * 15;
        state.brightness = 0.5 + seededRandom(Math.floor(t * 8) + blockIdx) * 1.5;
        state.scale = 1 + Math.sin(glitchP * 10) * 0.1;
        if (seededRandom(Math.floor(t * 6) + blockIdx * 3) > 0.7) state.colorOverride = hslToHex(seededRandom(Math.floor(t * 4) + blockIdx) * 360, 100, 50);
      }
      break;
    }

    case 'earthquake': {
      const quakePhase = Math.sin(t * 3);
      const quakeIntensity = (quakePhase + 1) / 2;
      const shake = quakeIntensity * 12;
      state.offsetX = Math.sin(t * 30 + y * 5) * shake;
      state.offsetY = Math.cos(t * 25 + x * 4) * shake * 0.5;
      const flyChance = Math.sin(t * 7 + x * 11 + y * 13);
      if (flyChance > 0.85 && quakeIntensity > 0.6) {
        state.offsetY -= 30 * (flyChance - 0.85) * 6;
        state.rotation = (flyChance - 0.85) * 200;
        state.scale = 0.8;
      }
      state.brightness = 1 + quakeIntensity * 0.3;
      if (x === 2 && quakeIntensity > 0.7) {
        state.brightness = 2;
        state.colorOverride = '#ff4400';
      }
      break;
    }

    // ═══════════════════════════════════════════
    // NEW 40 ANIMATIONS
    // ═══════════════════════════════════════════

    case 'lavaLamp': {
      const blobPhase = Math.sin(t * 0.4 + x * 1.2) * Math.cos(t * 0.3 + y * 0.9);
      const rise = Math.sin(t * 0.6 + blockIdx * 0.5) * 20;
      state.offsetY = rise * blobPhase;
      state.offsetX = Math.sin(t * 0.3 + y * 0.7) * 6;
      state.scale = 0.85 + (blobPhase + 1) * 0.15;
      state.brightness = 0.7 + (blobPhase + 1) * 0.4;
      state.hueShift = t * 20 + y * 30;
      state.skewX = Math.sin(t * 0.5 + x) * 5;
      break;
    }

    case 'typewriter': {
      // Blocks appear sequentially like typing
      const totalBlocks = 22;
      const typeSpeed = 4; // blocks per second
      const cycle = t % ((totalBlocks / typeSpeed) + 2);
      const currentBlock = Math.floor(cycle * typeSpeed);
      // Sort blocks by reading order (top-left to bottom-right)
      const readingOrder = y * 5 + x;
      const blockVisible = readingOrder <= currentBlock;
      if (!blockVisible) {
        state.opacity = 0;
        state.scale = 0;
      } else if (readingOrder === currentBlock) {
        // Just appeared - punch effect
        state.scale = 1.4;
        state.brightness = 2;
        state.offsetY = -3;
      } else {
        // Settled
        state.brightness = 1 + Math.sin(t * 2 + blockIdx) * 0.1;
      }
      break;
    }

    case 'tornado': {
      const height = 1 - y / 5; // 1 at top, 0 at bottom
      const funnelWidth = 0.3 + height * 0.7;
      const spinSpeed = 2 + height * 3;
      const spiralAngle2 = t * spinSpeed + blockIdx * 0.5;
      state.offsetX = Math.cos(spiralAngle2) * funnelWidth * 40;
      state.offsetY = Math.sin(spiralAngle2) * funnelWidth * 8 - height * 15;
      state.scale = 0.6 + height * 0.5;
      state.rotation = t * spinSpeed * 20;
      state.brightness = 0.5 + height * 1.0;
      state.hueShift = spiralAngle2 * 15;
      state.opacity = 0.5 + height * 0.5;
      break;
    }

    case 'wave3d': {
      const waveX = Math.sin(t * 1.5 + x * 1.2);
      const waveY = Math.cos(t * 1.0 + y * 0.8);
      const combined = (waveX + waveY) / 2;
      // Simulate 3D by adjusting scale (depth) and position
      const depthScale = 0.7 + (combined + 1) * 0.3;
      state.scale = depthScale;
      state.offsetY = combined * 20;
      state.offsetX = Math.sin(t + x * 0.5) * 5;
      state.brightness = 0.5 + depthScale;
      state.skewX = waveX * 8;
      state.skewY = waveY * 4;
      state.hueShift = combined * 40 + 200;
      break;
    }

    case 'neonPulse': {
      // Light chases around the perimeter of the rook
      const isEdge = x === 0 || x === 4 || y === 0 || y === 5;
      const perimeter = (x + y * 3) / 15; // rough perimeter position
      const chasePos = (t * 0.8) % 1;
      const proximity = 1 - Math.min(Math.abs(perimeter - chasePos), Math.abs(perimeter - chasePos + 1), Math.abs(perimeter - chasePos - 1)) * 4;
      const glow = Math.max(0, proximity);
      if (isEdge) {
        state.brightness = 0.4 + glow * 2.5;
        state.scale = 1 + glow * 0.15;
        state.hueShift = t * 60 + glow * 40;
        state.colorOverride = glow > 0.5 ? hslToHex((t * 80) % 360, 100, 60) : undefined;
      } else {
        state.brightness = 0.3 + glow * 0.5;
        state.hueShift = t * 30;
      }
      break;
    }

    case 'tetrisDrop': {
      const rowDelay = y * 0.8;
      const cycle2 = (t % 6);
      const localT2 = cycle2 - rowDelay;
      if (localT2 < 0) {
        state.offsetY = -200;
        state.opacity = 0;
      } else if (localT2 < 0.3) {
        // Falling fast
        const fall = localT2 / 0.3;
        state.offsetY = -200 * (1 - fall * fall);
        state.opacity = fall;
      } else if (localT2 < 0.5) {
        // Landing squish
        const squish = (localT2 - 0.3) / 0.2;
        state.scale = 1 + Math.sin(squish * Math.PI) * 0.2;
        state.brightness = 1 + (1 - squish) * 0.8;
      } else {
        // Row complete flash
        const flash = Math.max(0, 1 - (localT2 - 0.5) * 2);
        state.brightness = 1 + flash * 0.3;
      }
      break;
    }

    case 'breathing': {
      // Whole rook breathes as one organism
      const inhale = (Math.sin(t * 0.8) + 1) / 2; // 0 to 1
      const breathScale = 0.85 + inhale * 0.3;
      // Blocks spread from center on inhale
      state.offsetX = (x - CENTER_X) * inhale * 4;
      state.offsetY = (y - CENTER_Y) * inhale * 4;
      state.scale = breathScale;
      state.brightness = 0.7 + inhale * 0.6;
      // Slight warm color on inhale
      state.hueShift = inhale * -15;
      break;
    }

    case 'supernova': {
      const cycle3 = t % 5;
      if (cycle3 < 2.5) {
        // Building energy - blocks vibrate and glow increasingly
        const build = cycle3 / 2.5;
        state.offsetX = Math.sin(t * 20 * build + blockIdx) * build * 6;
        state.offsetY = Math.cos(t * 18 * build + blockIdx) * build * 4;
        state.brightness = 1 + build * 2;
        state.scale = 1 + build * 0.1;
        state.hueShift = build * 60;
      } else if (cycle3 < 3.0) {
        // FLASH - everything white and huge
        const flash = (cycle3 - 2.5) / 0.5;
        state.scale = 1.5 + flash * 2;
        state.brightness = 4 - flash * 2;
        state.colorOverride = '#ffffff';
        state.offsetX = (x - CENTER_X) * flash * 80;
        state.offsetY = (y - CENTER_Y) * flash * 80;
      } else {
        // Collapse back with afterglow
        const collapse = (cycle3 - 3.0) / 2.0;
        const remaining = 1 - collapse;
        state.offsetX = (x - CENTER_X) * remaining * 60;
        state.offsetY = (y - CENTER_Y) * remaining * 60;
        state.scale = 0.5 + collapse * 0.5;
        state.brightness = 0.3 + collapse * 0.7;
        state.hueShift = remaining * 180;
        state.opacity = 0.3 + collapse * 0.7;
      }
      break;
    }

    case 'rubiksTwist': {
      // Rows rotate on X, columns rotate on Y
      const rowPhase = Math.sin(t * 1.2 + y * 1.5);
      const colPhase = Math.cos(t * 0.9 + x * 1.8);
      state.offsetX = rowPhase * 15;
      state.offsetY = colPhase * 10;
      state.rotation = (rowPhase + colPhase) * 25;
      state.skewX = rowPhase * 12;
      state.skewY = colPhase * 8;
      state.brightness = 1 + Math.abs(rowPhase * colPhase) * 0.5;
      state.hueShift = (rowPhase + 1) * 90;
      break;
    }

    case 'clockwork': {
      // Concentric rings rotate like gears
      const ring = Math.round(normDist * 3);
      const gearSpeed = (ring % 2 === 0 ? 1 : -1) * (1 + ring * 0.3);
      const gearAngle = t * gearSpeed + angle;
      const tickT = t * 4;
      const tick = Math.floor(tickT) !== Math.floor(tickT - 0.016); // tick detection
      state.offsetX = Math.cos(gearAngle) * ring * 5;
      state.offsetY = Math.sin(gearAngle) * ring * 5;
      state.rotation = gearAngle * 30;
      if (tick) {
        state.brightness = 2;
        state.scale = 1.15;
      } else {
        state.brightness = 0.8 + ring * 0.15;
      }
      break;
    }

    case 'aurora': {
      const wave = Math.sin(t * 0.5 + x * 0.8 + y * 0.3);
      const wave2a = Math.sin(t * 0.3 - x * 0.5 + y * 0.6);
      const shimmer = (wave + wave2a) / 2;
      state.brightness = 0.5 + (shimmer + 1) * 0.6;
      state.hueShift = (t * 30 + x * 40 + wave * 60) % 360;
      state.offsetY = shimmer * 5;
      state.scale = 1 + shimmer * 0.04;
      // Aurora curtain effect
      state.colorOverride = hslToHex(
        (120 + wave * 60 + t * 20) % 360,
        70 + shimmer * 30,
        40 + shimmer * 20
      );
      break;
    }

    case 'popcorn': {
      // Blocks randomly pop with increasing frequency
      const freq = 1 + (t % 4) * 3; // accelerating
      const seed = seededRandom(Math.floor(t * freq) + blockIdx * 7);
      const isPop = seed > 0.85;
      const popPhase = (t * freq + blockIdx * 0.3) % 1;
      if (isPop && popPhase < 0.3) {
        const p = popPhase / 0.3;
        state.offsetY = -30 * Math.sin(p * Math.PI);
        state.scale = 1 + (1 - p) * 0.4;
        state.brightness = 1.5 + (1 - p);
        state.rotation = (seededRandom(blockIdx) - 0.5) * 40 * (1 - p);
      }
      break;
    }

    case 'snake': {
      // A bright trail snakes through blocks in sequence
      const snakeLen = 6;
      const snakeSpeed = 8;
      const snakePos = (t * snakeSpeed) % 22;
      // Use block reading order as position
      const blockPos = blockIdx % 22;
      const distFromSnake = Math.min(
        Math.abs(blockPos - snakePos),
        Math.abs(blockPos - snakePos + 22),
        Math.abs(blockPos - snakePos - 22)
      );
      if (distFromSnake < snakeLen) {
        const intensity = 1 - distFromSnake / snakeLen;
        state.brightness = 0.5 + intensity * 2;
        state.scale = 1 + intensity * 0.2;
        state.hueShift = intensity * 60 + t * 40;
        state.colorOverride = hslToHex((t * 50 + intensity * 60) % 360, 80, 50 + intensity * 20);
      } else {
        state.brightness = 0.3;
      }
      break;
    }

    case 'magneticField': {
      // Blocks repel from a moving point
      const magnetX = CENTER_X + Math.sin(t * 0.8) * 2;
      const magnetY = CENTER_Y + Math.cos(t * 0.6) * 2.5;
      const dx = x - magnetX;
      const dy = y - magnetY;
      const magDist = Math.sqrt(dx * dx + dy * dy) + 0.1;
      const force = 2 / (magDist * magDist);
      state.offsetX = (dx / magDist) * force * 25;
      state.offsetY = (dy / magDist) * force * 25;
      state.scale = 1 + force * 0.3;
      state.brightness = 0.8 + force * 1.5;
      state.hueShift = force * 100;
      // Field lines
      const fieldAngle = Math.atan2(dy, dx);
      state.rotation = fieldAngle * (180 / Math.PI) * 0.2;
      break;
    }

    case 'disco': {
      const checkerboard = (x + y) % 2;
      const beat2 = Math.floor(t * 4);
      const color1 = (beat2 * 47 + checkerboard * 180) % 360;
      const color2 = (beat2 * 73 + (1 - checkerboard) * 180) % 360;
      state.colorOverride = hslToHex(checkerboard ? color1 : color2, 80, 50);
      state.brightness = 0.8 + Math.sin(t * 8 + blockIdx) * 0.6;
      state.scale = 1 + Math.sin(t * 4) * 0.08 * (checkerboard ? 1 : -1);
      // Floor tile tilt
      state.skewX = Math.sin(t * 2 + x) * 5;
      state.skewY = Math.cos(t * 2 + y) * 5;
      break;
    }

    case 'waterfall': {
      const fallSpeed2 = 1.5 + x * 0.2;
      const fallPos = (t * fallSpeed2 + y * 0.5) % 4;
      // Cascading downward
      state.offsetY = fallPos * 15;
      state.opacity = fallPos < 2 ? 1 : Math.max(0.1, 1 - (fallPos - 2) * 0.5);
      // Water shimmer
      state.brightness = 0.7 + Math.sin(t * 3 + x * 2 + y) * 0.3;
      state.hueShift = 200 + Math.sin(t + x) * 20; // blue tones
      // Splash at bottom
      if (y === 5 || y === 4) {
        state.offsetX = Math.sin(t * 5 + x * 3) * 3;
        state.scale = 1 + Math.sin(t * 4 + x) * 0.1;
      }
      state.colorOverride = hslToHex(200 + Math.sin(t + blockIdx) * 30, 70, 45 + fallPos * 5);
      break;
    }

    case 'pinball': {
      // Each block bounces independently in a contained area
      const seed2 = seededRandom(blockIdx * 37);
      const speedX = 0.8 + seed2 * 1.5;
      const speedY = 0.6 + seededRandom(blockIdx * 53) * 1.2;
      const bounceX = Math.sin(t * speedX + seed2 * 10) * 20;
      const bounceY = Math.sin(t * speedY + seed2 * 7) * 20;
      state.offsetX = bounceX;
      state.offsetY = bounceY;
      // Speed-based glow
      const speed = Math.abs(Math.cos(t * speedX)) + Math.abs(Math.cos(t * speedY));
      state.brightness = 0.7 + speed * 0.5;
      state.rotation = t * speedX * 20;
      state.scale = 1 + Math.abs(Math.sin(t * 3 + blockIdx)) * 0.15;
      break;
    }

    case 'origami': {
      // Blocks fold along axes
      const foldPhase = Math.sin(t * 0.8);
      const foldX = x < CENTER_X ? foldPhase : -foldPhase;
      const foldY = y < CENTER_Y ? foldPhase : -foldPhase;
      state.skewX = foldX * 30;
      state.skewY = foldY * 15;
      state.scale = 1 - Math.abs(foldPhase) * 0.2;
      // Paper-like brightness
      state.brightness = 1 + foldX * 0.3;
      state.offsetX = foldX * (Math.abs(x - CENTER_X)) * 5;
      state.offsetY = foldY * (Math.abs(y - CENTER_Y)) * 3;
      // Crease line glow
      if (x === 2) state.brightness += Math.abs(foldPhase) * 0.5;
      break;
    }

    case 'fireflies': {
      // Random blocks glow softly and dim
      const glowSeed = seededRandom(Math.floor(t * 0.5) + blockIdx * 13);
      const isGlowing = glowSeed > 0.75;
      const glowCycle = (t * 2 + blockIdx * 0.7) % 3;
      if (isGlowing) {
        const intensity2 = Math.sin(glowCycle * Math.PI / 3);
        state.brightness = 0.3 + intensity2 * 2;
        state.scale = 1 + intensity2 * 0.15;
        state.colorOverride = hslToHex(50 + intensity2 * 20, 90, 40 + intensity2 * 30); // warm yellow
        state.offsetY = -intensity2 * 3; // float up slightly
      } else {
        state.brightness = 0.15;
        state.opacity = 0.5;
      }
      break;
    }

    case 'sonar': {
      // Concentric rings pulse outward
      const pingSpeed = 1.5;
      const pingInterval = 2;
      const pingAge = (t % pingInterval) * pingSpeed;
      const ringDist = Math.abs(normDist - pingAge * 0.5);
      const onRing = ringDist < 0.15;
      if (onRing) {
        const ringIntensity = 1 - ringDist / 0.15;
        state.brightness = 0.5 + ringIntensity * 2;
        state.scale = 1 + ringIntensity * 0.2;
        state.colorOverride = hslToHex(160, 80, 30 + ringIntensity * 40);
      } else {
        state.brightness = 0.25;
        state.opacity = 0.6;
      }
      // Center ping flash
      if (normDist < 0.2 && pingAge < 0.2) {
        state.brightness = 3;
        state.scale = 1.3;
      }
      break;
    }

    case 'domino': {
      // Blocks topple in a wave
      const dominoSpeed = 3;
      const dominoPos = (t * dominoSpeed) % 30;
      const myOrder = x + y * 5;
      const diff = dominoPos - myOrder;
      if (diff < 0 || diff > 5) {
        // Standing or fully fallen
        if (diff < 0) {
          state.rotation = 0; // standing
        } else {
          state.rotation = 90; // fallen
          state.offsetY = blockSize * 0.3;
          state.brightness = 0.5;
        }
      } else {
        // Currently falling
        const fallProgress2 = diff / 5;
        state.rotation = fallProgress2 * 90;
        state.offsetY = Math.sin(fallProgress2 * Math.PI * 0.5) * blockSize * 0.3;
        state.brightness = 1 + (1 - fallProgress2) * 0.8;
      }
      break;
    }

    case 'windmill': {
      // Four blades rotating from center
      const blade = Math.floor(((angle + Math.PI) / (Math.PI * 2)) * 4) % 4;
      const bladeAngle = t * 1.5 + blade * (Math.PI / 2);
      const bladeRadius = normDist * 30;
      state.offsetX = Math.cos(bladeAngle) * bladeRadius * 0.5;
      state.offsetY = Math.sin(bladeAngle) * bladeRadius * 0.3;
      state.rotation = bladeAngle * (180 / Math.PI);
      state.brightness = 0.6 + (Math.sin(bladeAngle) + 1) * 0.5;
      state.scale = 0.9 + normDist * 0.2;
      // Each blade different color
      state.hueShift = blade * 90;
      break;
    }

    case 'bubbles': {
      // Blocks float up like bubbles
      const bubbleSpeed = 0.5 + seededRandom(blockIdx * 11) * 0.8;
      const bubblePhase = (t * bubbleSpeed + seededRandom(blockIdx * 23) * 10) % 5;
      const rising = bubblePhase < 3;
      if (rising) {
        const p2 = bubblePhase / 3;
        state.offsetY = -p2 * 60;
        state.offsetX = Math.sin(p2 * Math.PI * 3 + blockIdx) * 10;
        state.scale = 1 + Math.sin(p2 * Math.PI * 2) * 0.15;
        state.brightness = 0.8 + p2 * 0.5;
        state.opacity = 1 - p2 * 0.5;
      } else {
        // Pop and reset
        const pop = (bubblePhase - 3) / 2;
        state.scale = pop < 0.1 ? 1.5 : 0.3 + pop * 0.7;
        state.brightness = pop < 0.1 ? 2.5 : 0.5 + pop * 0.5;
        state.opacity = pop < 0.1 ? 1 : 0.3 + pop * 0.7;
      }
      break;
    }

    case 'laserGrid': {
      // Horizontal and vertical scan lines
      const scanRow = Math.floor((t * 2) % 6);
      const scanCol = Math.floor((t * 2.5 + 3) % 5);
      const onRow = y === scanRow;
      const onCol = x === scanCol;
      const onCross = onRow && onCol;
      if (onCross) {
        state.brightness = 3;
        state.colorOverride = '#ff0000';
        state.scale = 1.3;
      } else if (onRow) {
        state.brightness = 2;
        state.colorOverride = '#ff3333';
        state.scale = 1.1;
      } else if (onCol) {
        state.brightness = 1.8;
        state.colorOverride = '#3333ff';
        state.scale = 1.1;
      } else {
        state.brightness = 0.3;
        state.opacity = 0.6;
      }
      break;
    }

    case 'shuffle': {
      // Cards shuffle - blocks fly to random positions and back
      const shuffleCycle = t % 3;
      const seed3 = seededRandom(Math.floor(t / 3) * 100 + blockIdx);
      const targetOX = (seed3 - 0.5) * 100;
      const targetOY = (seededRandom(Math.floor(t / 3) * 100 + blockIdx + 50) - 0.5) * 80;
      if (shuffleCycle < 0.5) {
        // Fly out
        const p3 = shuffleCycle / 0.5;
        const ease = p3 * p3;
        state.offsetX = targetOX * ease;
        state.offsetY = targetOY * ease;
        state.rotation = (seed3 - 0.5) * 360 * ease;
        state.scale = 1 - ease * 0.3;
      } else if (shuffleCycle < 1.5) {
        // Hovering scattered
        state.offsetX = targetOX + Math.sin(t * 3 + blockIdx) * 3;
        state.offsetY = targetOY + Math.cos(t * 3 + blockIdx) * 3;
        state.rotation = (seed3 - 0.5) * 360;
        state.scale = 0.7;
        state.brightness = 0.8;
      } else {
        // Fly back
        const p3 = (shuffleCycle - 1.5) / 1.5;
        const ease = 1 - (1 - p3) * (1 - p3);
        state.offsetX = targetOX * (1 - ease);
        state.offsetY = targetOY * (1 - ease);
        state.rotation = (seed3 - 0.5) * 360 * (1 - ease);
        state.scale = 0.7 + ease * 0.3;
        state.brightness = 0.8 + ease * 0.5;
      }
      break;
    }

    case 'slingshot': {
      // Pull back then snap forward
      const slingCycle = t % 2;
      if (slingCycle < 1) {
        // Pull back (slow)
        const pull = slingCycle;
        state.offsetX = -pull * 30 * (1 + normDist * 0.5);
        state.scale = 1 + pull * 0.1;
        state.brightness = 0.7 + pull * 0.5;
        state.skewX = -pull * 10;
      } else if (slingCycle < 1.15) {
        // SNAP forward
        const snap = (slingCycle - 1) / 0.15;
        state.offsetX = -30 + snap * 80;
        state.scale = 1.1 + snap * 0.3;
        state.brightness = 1.2 + snap * 1.5;
        state.blur = snap * 3;
      } else {
        // Wobble settle
        const settle2 = (slingCycle - 1.15) / 0.85;
        const wobble = Math.sin(settle2 * Math.PI * 4) * Math.exp(-settle2 * 4);
        state.offsetX = 50 * (1 - settle2) + wobble * 15;
        state.scale = 1 + wobble * 0.1;
        state.brightness = 1 + Math.abs(wobble) * 0.5;
      }
      break;
    }

    case 'kaleidoscope': {
      // Mirror rotations creating symmetric patterns
      const kAngle = angle + t * 0.5;
      const kSector = Math.floor((kAngle + Math.PI) / (Math.PI / 3)); // 6 sectors
      const mirroredAngle = kAngle - kSector * (Math.PI / 3);
      const symAngle = kSector % 2 === 0 ? mirroredAngle : (Math.PI / 3) - mirroredAngle;
      state.offsetX = Math.cos(symAngle + t) * normDist * 20;
      state.offsetY = Math.sin(symAngle + t) * normDist * 20;
      state.hueShift = (kSector * 60 + t * 30) % 360;
      state.brightness = 0.6 + (Math.sin(symAngle * 3 + t * 2) + 1) * 0.5;
      state.scale = 0.8 + (Math.sin(t + normDist * 3) + 1) * 0.2;
      state.rotation = symAngle * (180 / Math.PI);
      break;
    }

    case 'tidal': {
      // Huge slow wave rolling side to side
      const tidalPhase = Math.sin(t * 0.3);
      const waveHeight = Math.sin(x * 0.8 + t * 0.6) * 25;
      const depth2 = (tidalPhase + 1) / 2;
      state.offsetY = waveHeight * depth2;
      state.offsetX = tidalPhase * 8 * (y / 5);
      state.scale = 0.9 + depth2 * 0.15;
      state.brightness = 0.5 + depth2 * 0.8;
      state.hueShift = 200 + waveHeight * 2; // ocean blue
      state.colorOverride = hslToHex(
        200 + Math.sin(t * 0.2 + x) * 20,
        60 + depth2 * 30,
        30 + depth2 * 25
      );
      break;
    }

    case 'strobe': {
      // Hard strobe with scale punches
      const strobeBeat = Math.floor(t * 8);
      const isOn = strobeBeat % 2 === 0;
      const blockBeat = (strobeBeat + blockIdx) % 4 === 0;
      if (blockBeat) {
        state.brightness = 3;
        state.colorOverride = '#ffffff';
        state.scale = 1.4;
      } else if (isOn) {
        state.brightness = 1.5;
        state.scale = 1.05;
      } else {
        state.brightness = 0.05;
        state.scale = 0.95;
      }
      break;
    }

    case 'pendulum': {
      // Each block swings like a pendulum
      const pendLength = 0.5 + normDist * 1.5;
      const pendAngle2 = Math.sin(t * pendLength + blockIdx * 0.3) * 0.8;
      const pendX = Math.sin(pendAngle2) * 30 * normDist;
      const pendY = (1 - Math.cos(pendAngle2)) * 20 * normDist;
      state.offsetX = pendX;
      state.offsetY = pendY;
      state.rotation = pendAngle2 * (180 / Math.PI) * 0.5;
      state.brightness = 0.7 + Math.abs(Math.sin(pendAngle2)) * 0.8;
      // Speed glow
      const speed2 = Math.abs(Math.cos(t * pendLength + blockIdx * 0.3));
      state.brightness += speed2 * 0.3;
      break;
    }

    case 'morphWave': {
      // Blocks stretch and morph through wave distortion
      const morphX = Math.sin(t * 1.5 + y * 0.8);
      const morphY = Math.cos(t * 1.2 + x * 0.6);
      state.skewX = morphX * 25;
      state.skewY = morphY * 15;
      state.scale = 0.8 + (morphX * morphY + 1) * 0.2;
      state.offsetX = morphY * 8;
      state.offsetY = morphX * 6;
      state.brightness = 0.6 + (morphX + 1) * 0.5;
      state.hueShift = (morphX + morphY) * 45;
      break;
    }

    case 'constellation': {
      // Blocks twinkle like stars
      const twinkleSpeed = seededRandom(blockIdx * 31) * 3 + 1;
      const twinklePhase = Math.sin(t * twinkleSpeed + seededRandom(blockIdx * 47) * Math.PI * 2);
      const isBright = twinklePhase > 0.5;
      state.brightness = isBright ? 0.8 + (twinklePhase - 0.5) * 3 : 0.15 + twinklePhase * 0.3;
      state.scale = isBright ? 1 + (twinklePhase - 0.5) * 0.3 : 0.9;
      // Gentle drift
      state.offsetX = Math.sin(t * 0.2 + blockIdx) * 2;
      state.offsetY = Math.cos(t * 0.15 + blockIdx) * 2;
      // Star color
      if (isBright) {
        const starHue = seededRandom(blockIdx * 67) * 60 + 200; // blue-white range
        state.colorOverride = hslToHex(starHue, 30, 70 + twinklePhase * 20);
      }
      break;
    }

    case 'flipCards': {
      // Blocks flip over revealing bright colored backs
      const flipSpeed2 = 0.6 + seededRandom(blockIdx * 19) * 0.4;
      const flipAngle = (t * flipSpeed2 + seededRandom(blockIdx * 29) * Math.PI * 2) % (Math.PI * 2);
      const isFront = Math.cos(flipAngle) > 0;
      const flipScale = Math.abs(Math.cos(flipAngle));
      state.scale = 0.2 + flipScale * 0.8; // squeeze on edge
      state.skewY = Math.sin(flipAngle) * 20;
      if (isFront) {
        state.brightness = 0.8 + flipScale * 0.4;
      } else {
        // Back side - bright color
        const backHue = seededRandom(blockIdx * 41) * 360;
        state.colorOverride = hslToHex(backHue, 80, 55);
        state.brightness = 1 + flipScale * 0.8;
      }
      break;
    }

    case 'springy': {
      // Blocks on springs - periodic bouncing with overshoot
      const springFreq = 2 + seededRandom(blockIdx * 17) * 3;
      const springDamp = 0.3;
      const phase2 = t * springFreq + seededRandom(blockIdx * 43) * Math.PI * 2;
      const springY = Math.sin(phase2) * Math.exp(-((t % 3) * springDamp)) * 25;
      const springX = Math.cos(phase2 * 0.7) * Math.exp(-((t % 3) * springDamp)) * 10;
      state.offsetY = springY;
      state.offsetX = springX;
      state.scale = 1 + Math.abs(springY / 25) * 0.2;
      state.brightness = 1 + Math.abs(springY / 25) * 0.5;
      state.rotation = springX * 2;
      break;
    }

    case 'hologram': {
      // Scan lines + flicker + blue tint
      const scanLine = Math.floor(t * 15) % 6;
      const isScanned = y === scanLine;
      const flicker = Math.sin(t * 40 + blockIdx * 7) > 0.8;
      state.colorOverride = hslToHex(200, 80, 50);
      state.opacity = 0.6 + Math.sin(t * 2) * 0.2;
      state.brightness = isScanned ? 2.5 : 0.5 + Math.sin(t * 3 + y * 0.5) * 0.3;
      if (flicker) {
        state.opacity *= 0.3;
        state.offsetX = (seededRandom(Math.floor(t * 30) + blockIdx) - 0.5) * 6;
      }
      // Holographic wobble
      state.skewX = Math.sin(t * 1.5 + y * 0.3) * 3;
      state.offsetY = Math.sin(t * 0.8) * 2;
      // Interlace effect - offset every other row
      if (y % 2 === 0) state.offsetX += Math.sin(t * 5) * 1.5;
      break;
    }

    case 'drunkWalk': {
      // Each block stumbles around drunkenly
      const stumbleX = seededRandom(Math.floor(t * 2) + blockIdx * 11);
      const stumbleY = seededRandom(Math.floor(t * 2) + blockIdx * 23);
      const prevX = seededRandom(Math.floor(t * 2 - 1) + blockIdx * 11);
      const prevY = seededRandom(Math.floor(t * 2 - 1) + blockIdx * 23);
      const lerp = (t * 2) % 1;
      state.offsetX = ((prevX + (stumbleX - prevX) * lerp) - 0.5) * 40;
      state.offsetY = ((prevY + (stumbleY - prevY) * lerp) - 0.5) * 40;
      state.rotation = (stumbleX - 0.5) * 30;
      state.brightness = 0.8 + seededRandom(Math.floor(t * 3) + blockIdx) * 0.6;
      state.scale = 0.9 + Math.sin(t * 3 + blockIdx) * 0.15;
      break;
    }

    case 'vortexRings': {
      // Blocks in concentric rings rotating at different speeds
      const ring2 = Math.round(normDist * 4);
      const ringSpeed = (ring2 + 1) * 0.5 * (ring2 % 2 === 0 ? 1 : -1);
      const ringAngle2 = angle + t * ringSpeed;
      const ringRadius = ring2 * 12;
      state.offsetX = Math.cos(ringAngle2) * ringRadius * 0.3;
      state.offsetY = Math.sin(ringAngle2) * ringRadius * 0.2;
      state.rotation = ringAngle2 * (180 / Math.PI);
      state.hueShift = ring2 * 72; // each ring different color
      state.brightness = 0.6 + (Math.sin(ringAngle2) + 1) * 0.4;
      state.scale = 0.85 + (Math.sin(ringAngle2 * 2) + 1) * 0.1;
      break;
    }

    case 'campfire': {
      // Warm flickering glow rising upward
      const flameHeight = 1 - y / 5; // stronger at top
      const flicker2 = seededRandom(Math.floor(t * 12) + blockIdx) * 0.4;
      const baseWarm = 0.5 + flameHeight * 0.8;
      state.brightness = baseWarm + flicker2;
      state.offsetY = -flameHeight * Math.sin(t * 3 + x * 2) * 8;
      state.offsetX = Math.sin(t * 2 + y * 1.5 + x) * flameHeight * 5;
      // Fire colors: bottom red, middle orange, top yellow
      const fireHue = 0 + flameHeight * 50; // 0 (red) to 50 (yellow-orange)
      state.colorOverride = hslToHex(
        fireHue + flicker2 * 20,
        90 - flameHeight * 20,
        30 + flameHeight * 30 + flicker2 * 15
      );
      state.scale = 1 + flameHeight * Math.sin(t * 4 + blockIdx) * 0.1;
      break;
    }

    case 'glitchHop': {
      // Musical rhythm: kick-snare pattern with glitch fills
      const measure = t % 2;
      const beat3 = Math.floor(measure * 4); // 0-3 beats per measure
      const beatPos = (measure * 4) % 1; // position within beat

      // Kick on 1 and 3
      if ((beat3 === 0 || beat3 === 2) && beatPos < 0.1) {
        state.scale = 1.25;
        state.brightness = 2;
        state.offsetY = 5;
      }
      // Snare on 2 and 4
      else if ((beat3 === 1 || beat3 === 3) && beatPos < 0.08) {
        state.offsetX = (seededRandom(Math.floor(t * 8) + blockIdx) - 0.5) * 20;
        state.brightness = 2.5;
        state.hueShift = seededRandom(Math.floor(t * 8) + blockIdx * 3) * 360;
        state.scale = 1.15;
      }
      // Hi-hat fills between
      else {
        const hihat = Math.sin(t * 16 + blockIdx * 2) > 0.7;
        if (hihat) {
          state.brightness = 1.3;
          state.scale = 1.05;
        } else {
          state.brightness = 0.6;
        }
      }
      // Glitch fill every 4th measure
      if (Math.floor(t / 2) % 4 === 3 && beat3 === 3) {
        state.offsetX = Math.sin(t * 30 + blockIdx) * 15;
        state.hueShift = t * 500 % 360;
        state.blur = 1;
      }
      break;
    }

    case 'cosmicDust': {
      // Blocks slowly drift apart like particles in expanding space
      const expansion = (Math.sin(t * 0.2) + 1) / 2;
      const driftAngle = angle + seededRandom(blockIdx * 7) * 0.5;
      const driftSpeed = 0.3 + seededRandom(blockIdx * 13) * 0.7;
      const driftDist2 = normDist * expansion * 40 * driftSpeed;
      state.offsetX = Math.cos(driftAngle + t * 0.1) * driftDist2;
      state.offsetY = Math.sin(driftAngle + t * 0.1) * driftDist2;
      // Cosmic glow
      state.brightness = 0.3 + (1 - expansion) * 1.2;
      state.scale = 0.7 + (1 - expansion) * 0.3;
      state.hueShift = (t * 10 + blockIdx * 30) % 360;
      state.opacity = 0.4 + (1 - expansion) * 0.6;
      // Nebula colors
      state.colorOverride = hslToHex(
        (270 + seededRandom(blockIdx * 19) * 120) % 360,
        60 + expansion * 30,
        20 + (1 - expansion) * 40
      );
      break;
    }

    // ═══════════════════════════════════════════
    // BATCH 3 — 50 MORE ANIMATIONS
    // ═══════════════════════════════════════════

    case 'accordion': {
      const squeeze = Math.sin(t * 1.5);
      const rowOffset = (y - CENTER_Y) * squeeze * 12;
      state.offsetY = rowOffset;
      state.scale = 1 - Math.abs(squeeze) * 0.15;
      state.skewX = squeeze * 8;
      state.brightness = 1 + Math.abs(squeeze) * 0.3;
      // Compress = darker, expand = brighter
      state.hueShift = squeeze * 30;
      break;
    }

    case 'antFarm': {
      // Each block follows a unique looping trail
      const trailSeed = seededRandom(blockIdx * 31);
      const trailSpeed = 0.5 + trailSeed * 0.8;
      const trailPhase = t * trailSpeed;
      const pathX = Math.sin(trailPhase * 1.3 + trailSeed * 10) * Math.cos(trailPhase * 0.7) * 15;
      const pathY = Math.cos(trailPhase * 0.9 + trailSeed * 7) * Math.sin(trailPhase * 1.1) * 12;
      state.offsetX = pathX;
      state.offsetY = pathY;
      state.rotation = Math.atan2(Math.cos(trailPhase * 0.9), Math.sin(trailPhase * 1.3)) * 20;
      state.brightness = 0.6 + Math.abs(Math.sin(trailPhase)) * 0.6;
      state.scale = 0.9 + Math.abs(Math.sin(trailPhase * 2)) * 0.15;
      break;
    }

    case 'beeSwarm': {
      // Queen position moves slowly
      const queenX = CENTER_X + Math.sin(t * 0.4) * 2;
      const queenY = CENTER_Y + Math.cos(t * 0.3) * 2;
      const toQueenX = queenX - x;
      const toQueenY = queenY - y;
      const queenDist = Math.sqrt(toQueenX * toQueenX + toQueenY * toQueenY) + 0.1;
      // Buzz around queen
      const buzzX = Math.sin(t * 8 + blockIdx * 2.3) * 12;
      const buzzY = Math.cos(t * 7 + blockIdx * 3.1) * 10;
      // Pull toward queen
      state.offsetX = (toQueenX / queenDist) * 8 + buzzX;
      state.offsetY = (toQueenY / queenDist) * 6 + buzzY;
      state.scale = 0.85 + (1 / (queenDist + 1)) * 0.3;
      state.brightness = 0.6 + (1 / (queenDist + 1)) * 1.0;
      state.hueShift = 40 + buzzX * 2; // yellow-ish
      break;
    }

    case 'bigBang': {
      const age = t % 6;
      if (age < 0.3) {
        // Singularity — everything at center
        state.offsetX = -(x - CENTER_X) * blockSize * (1 - age / 0.3 * 0.1);
        state.offsetY = -(y - CENTER_Y) * blockSize * (1 - age / 0.3 * 0.1);
        state.scale = 0.1 + age / 0.3 * 0.2;
        state.brightness = 1 + age / 0.3 * 4;
        state.colorOverride = '#ffffff';
      } else if (age < 1) {
        // Rapid expansion
        const expand = (age - 0.3) / 0.7;
        const eased = 1 - (1 - expand) * (1 - expand);
        state.offsetX = (x - CENTER_X) * eased * 25;
        state.offsetY = (y - CENTER_Y) * eased * 25;
        state.scale = 0.3 + eased * 1.2;
        state.brightness = 5 - eased * 4;
        state.hueShift = eased * 180;
      } else {
        // Cool down — drift and dim
        const cool = (age - 1) / 5;
        state.offsetX = (x - CENTER_X) * 25 * (1 - cool * 0.8);
        state.offsetY = (y - CENTER_Y) * 25 * (1 - cool * 0.8);
        state.scale = 1 + Math.sin(cool * 4) * 0.05;
        state.brightness = 1 - cool * 0.3;
        state.hueShift = 180 - cool * 180;
      }
      break;
    }

    case 'blinds': {
      const blindPhase = (t * 0.8 + y * 0.3) % 2;
      const isOpen = blindPhase < 1;
      const progress = isOpen ? blindPhase : blindPhase - 1;
      state.skewX = isOpen ? progress * 40 - 20 : 20 - progress * 40;
      state.scale = isOpen ? 0.5 + progress * 0.5 : 1 - progress * 0.5;
      state.brightness = isOpen ? 0.3 + progress * 1.0 : 1.3 - progress * 1.0;
      state.opacity = isOpen ? 0.4 + progress * 0.6 : 1 - progress * 0.6;
      break;
    }

    case 'boiling': {
      const heat = (Math.sin(t * 0.3) + 1) / 2; // 0-1 intensity
      const bubbleSeed = seededRandom(Math.floor(t * (3 + heat * 8)) + blockIdx * 7);
      const isBubble = bubbleSeed > (1 - heat * 0.6);
      const bubbleAge = (t * 2 + blockIdx * 0.3) % 1;
      if (isBubble) {
        state.offsetY = -bubbleAge * 30 * heat;
        state.scale = 1 + bubbleAge * 0.3 * heat;
        state.brightness = 1 + heat * 1.5;
        state.colorOverride = hslToHex(20 - heat * 20, 80, 50 + heat * 20);
      } else {
        state.brightness = 0.5 + heat * 0.5;
        state.offsetX = Math.sin(t * heat * 5 + blockIdx) * heat * 3;
      }
      break;
    }

    case 'carousel': {
      const carouselAngle = angle + t * 0.8;
      const depth3d = Math.cos(carouselAngle);
      const sideOffset = Math.sin(carouselAngle);
      state.offsetX = sideOffset * 40;
      state.scale = 0.5 + (depth3d + 1) * 0.35;
      state.brightness = 0.3 + (depth3d + 1) * 0.5;
      state.opacity = 0.3 + (depth3d + 1) * 0.35;
      state.offsetY = Math.sin(t * 2 + angle) * 5; // bobbing
      state.hueShift = (angle * 180 / Math.PI + t * 30) % 360;
      break;
    }

    case 'catScan': {
      // Scanning plane moves through
      const scanZ = (Math.sin(t * 0.8) + 1) * 2.5; // 0-5 row position
      const distToScan = Math.abs(y - scanZ);
      if (distToScan < 0.8) {
        const intensity3 = 1 - distToScan / 0.8;
        state.brightness = 0.5 + intensity3 * 2.5;
        state.scale = 1 + intensity3 * 0.15;
        state.colorOverride = hslToHex(0, 0, 40 + intensity3 * 60); // greyscale
      } else {
        state.brightness = 0.15;
        state.opacity = 0.4;
      }
      // Cross-section reveal
      state.skewY = (y - scanZ) * 3;
      break;
    }

    case 'centrifuge': {
      const spinRate = 0.5 + (t % 6) * 0.5; // accelerating
      const centAngle = angle + t * spinRate;
      const flingDist = Math.min(normDist + spinRate * 0.08, 1) * 40;
      state.offsetX = Math.cos(centAngle) * flingDist - (x - CENTER_X) * 3;
      state.offsetY = Math.sin(centAngle) * flingDist - (y - CENTER_Y) * 3;
      state.rotation = centAngle * (180 / Math.PI);
      state.scale = 1 - spinRate * 0.03;
      state.brightness = 0.7 + spinRate * 0.15;
      state.blur = spinRate > 3 ? (spinRate - 3) * 0.5 : 0;
      break;
    }

    case 'chainReaction': {
      // Explosion front travels outward from (0,0)
      const frontSpeed = 1.5;
      const frontPos = (t * frontSpeed) % 4;
      const blockDist2 = Math.sqrt(x * x + y * y) / 7; // 0-1 from top-left
      const hitTime = blockDist2 - frontPos;
      if (hitTime > 0) {
        // Not yet hit
        state.brightness = 0.3;
      } else if (hitTime > -0.3) {
        // Just hit — explode
        const boom = -hitTime / 0.3;
        state.scale = 1 + boom * 0.6;
        state.brightness = 1 + boom * 2.5;
        state.colorOverride = hslToHex(40 - boom * 40, 100, 50 + boom * 20);
        state.offsetY = -boom * 8;
      } else {
        // Aftermath — glowing embers
        const ember = Math.min(1, (-hitTime - 0.3) / 1);
        state.brightness = 1.5 - ember * 1.0;
        state.colorOverride = hslToHex(20, 80 - ember * 50, 50 - ember * 20);
        state.scale = 1 + Math.sin(t * 3 + blockIdx) * 0.03;
      }
      break;
    }

    case 'clapboard': {
      const clapCycle = t % 3;
      if (clapCycle < 0.1) {
        // CLAP — everything slams
        state.scale = 1.2;
        state.brightness = 2.5;
        state.offsetY = 3;
      } else if (clapCycle < 0.8) {
        // Blocks fall into place from above, staggered by position
        const fallDelay = (x + y) * 0.08;
        const fallT = Math.max(0, clapCycle - 0.1 - fallDelay) / 0.5;
        if (fallT < 1) {
          state.offsetY = -100 * (1 - fallT * fallT);
          state.opacity = fallT;
          state.rotation = (1 - fallT) * 20 * (x > CENTER_X ? 1 : -1);
        } else {
          state.brightness = 1.2;
        }
      }
      break;
    }

    case 'comet': {
      // A comet streaks diagonally, blocks glow as it passes
      const cometX = ((t * 2) % 4 - 1) * 5; // -1 to 3 range on x
      const cometY = ((t * 2) % 4 - 1) * 6;
      const toCometDist = Math.sqrt((x - cometX) ** 2 + (y - cometY) ** 2);
      // Tail extends behind the comet
      const behindComet = (x - cometX) * -1 + (y - cometY) * -1;
      const inTail = behindComet > 0 && behindComet < 4 && toCometDist < 3;
      if (toCometDist < 1) {
        // Comet head
        state.brightness = 3;
        state.colorOverride = '#ffffff';
        state.scale = 1.3;
      } else if (inTail) {
        const tailFade = behindComet / 4;
        state.brightness = 2 - tailFade * 1.5;
        state.colorOverride = hslToHex(30 + tailFade * 20, 90, 50 + (1 - tailFade) * 20);
        state.scale = 1 + (1 - tailFade) * 0.1;
      } else {
        state.brightness = 0.15;
      }
      break;
    }

    case 'crt': {
      const crtCycle = t % 5;
      if (crtCycle < 0.5) {
        // Power on — single bright line expanding
        const scanY = crtCycle / 0.5 * 6;
        state.scale = Math.abs(y - 2.5) < scanY / 2 ? 1 : 0.01;
        state.brightness = Math.abs(y - 2.5) < 0.5 ? 2.5 : 1;
      } else if (crtCycle < 4) {
        // Static/content with scan lines
        const scanLine2 = (Math.floor(t * 20) + y) % 3 === 0;
        state.brightness = scanLine2 ? 0.5 : 1 + seededRandom(Math.floor(t * 10) + blockIdx) * 0.3;
        state.offsetX = Math.sin(t * 30 + y * 10) * 0.5; // slight jitter
        // Occasional horizontal tear
        if (Math.sin(t * 7 + y * 3) > 0.95) {
          state.offsetX += 10;
          state.hueShift = 90;
        }
      } else {
        // Power off — collapse to center line
        const off = (crtCycle - 4) / 1;
        state.scale = y === 3 || y === 2 ? 1 - off * 0.5 : Math.max(0.01, 1 - off * 2);
        state.brightness = 1 - off * 0.7;
        state.offsetY = (y - 2.5) * -off * blockSize * 0.3;
      }
      break;
    }

    case 'crystalGrow': {
      // Crystal grows from center outward over time
      const growFront = (t * 0.5) % 2; // 0-2 normalized distance
      const myDist = normDist * 2;
      if (myDist < growFront) {
        // Grown — crystallized
        const age2 = growFront - myDist;
        state.brightness = 1 + Math.sin(t * 2 + blockIdx) * 0.2;
        state.scale = 1;
        // Crystal facet shimmer
        state.hueShift = (blockIdx * 30 + Math.sin(t + blockIdx) * 15) % 360;
        state.colorOverride = hslToHex(200 + age2 * 30, 60, 50 + Math.sin(t * 3 + blockIdx) * 10);
      } else if (myDist < growFront + 0.2) {
        // Growing edge — bright flash
        const edge = (myDist - growFront) / 0.2;
        state.brightness = 3 - edge * 2;
        state.scale = 0.5 + (1 - edge) * 0.7;
        state.colorOverride = '#aaddff';
      } else {
        state.opacity = 0.1;
        state.scale = 0.3;
        state.brightness = 0.2;
      }
      break;
    }

    case 'diceRoll': {
      const rollCycle = t % 2;
      if (rollCycle < 1) {
        // Tumbling
        const tumble = rollCycle;
        state.rotation = tumble * 360 * (1 + seededRandom(blockIdx * 11) * 2);
        state.offsetX = Math.sin(tumble * Math.PI * 3 + blockIdx) * 15;
        state.offsetY = -Math.abs(Math.sin(tumble * Math.PI * 2)) * 20;
        state.scale = 0.8 + Math.abs(Math.sin(tumble * Math.PI * 4)) * 0.3;
        state.brightness = 1 + Math.abs(Math.sin(tumble * 10)) * 0.5;
      } else {
        // Landed — wobble settle
        const settle3 = rollCycle - 1;
        const wobble2 = Math.sin(settle3 * 15) * Math.exp(-settle3 * 5);
        state.rotation = wobble2 * 20;
        state.brightness = 1;
      }
      break;
    }

    case 'digitize': {
      const digiCycle = t % 3;
      if (digiCycle < 1) {
        // Dissolving into pixels
        const dissolve = digiCycle;
        const shouldDissolve = seededRandom(Math.floor(t) + blockIdx * 7) < dissolve;
        if (shouldDissolve) {
          state.offsetX = (seededRandom(blockIdx * 13) - 0.5) * 60 * dissolve;
          state.offsetY = (seededRandom(blockIdx * 17) - 0.5) * 60 * dissolve;
          state.scale = 0.5;
          state.opacity = 1 - dissolve;
          state.brightness = 1.5;
        }
      } else if (digiCycle < 2) {
        // Scattered
        state.offsetX = (seededRandom(blockIdx * 13) - 0.5) * 60;
        state.offsetY = (seededRandom(blockIdx * 17) - 0.5) * 60;
        state.scale = 0.3 + seededRandom(blockIdx * 23) * 0.3;
        state.opacity = 0.3 + Math.sin(t * 5 + blockIdx) * 0.2;
        state.hueShift = t * 60;
      } else {
        // Reassembling
        const reassemble = digiCycle - 2;
        state.offsetX = (seededRandom(blockIdx * 13) - 0.5) * 60 * (1 - reassemble);
        state.offsetY = (seededRandom(blockIdx * 17) - 0.5) * 60 * (1 - reassemble);
        state.scale = 0.3 + reassemble * 0.7;
        state.opacity = 0.3 + reassemble * 0.7;
        state.brightness = 1 + (1 - reassemble) * 0.5;
      }
      break;
    }

    case 'drip': {
      // Blocks melt and drip from their position
      const dripPhase = (t * 0.5 + seededRandom(blockIdx * 19) * 3) % 3;
      if (dripPhase < 1) {
        // Melting — stretching downward
        state.skewY = dripPhase * 15;
        state.offsetY = dripPhase * dripPhase * 20;
        state.scale = 1 + dripPhase * 0.2;
        state.brightness = 0.8;
      } else if (dripPhase < 1.5) {
        // Dripping — detach and fall
        const drop = (dripPhase - 1) * 2;
        state.offsetY = 20 + drop * 40;
        state.scale = 0.7 - drop * 0.3;
        state.opacity = 1 - drop;
        state.brightness = 0.5;
      } else {
        // Reform
        const reform = (dripPhase - 1.5) / 1.5;
        state.offsetY = (1 - reform) * 5;
        state.scale = 0.7 + reform * 0.3;
        state.opacity = reform;
        state.brightness = 0.5 + reform * 0.5;
      }
      break;
    }

    case 'electricArc': {
      // Arcs between random block pairs
      const arcPair = Math.floor(t * 3);
      const srcBlock = arcPair % 22;
      const dstBlock = (arcPair * 7 + 3) % 22;
      const myIdx = blockIdx % 22;
      const isSource = myIdx === srcBlock;
      const isDest = myIdx === dstBlock;
      const arcProgress = (t * 3) % 1;
      // Path between src and dst
      const pathPos = Math.abs(myIdx - srcBlock) / Math.max(1, Math.abs(dstBlock - srcBlock));
      const onPath = pathPos >= 0 && pathPos <= 1 && Math.abs(pathPos - arcProgress) < 0.15;
      if (isSource || isDest) {
        state.brightness = 2 + Math.sin(t * 20) * 0.5;
        state.colorOverride = '#4488ff';
        state.scale = 1.2;
      } else if (onPath) {
        state.brightness = 2.5;
        state.colorOverride = '#88ccff';
        state.offsetX = (seededRandom(Math.floor(t * 15) + blockIdx) - 0.5) * 4;
        state.offsetY = (seededRandom(Math.floor(t * 15) + blockIdx + 50) - 0.5) * 4;
      } else {
        state.brightness = 0.2;
      }
      break;
    }

    case 'elevator': {
      // Each column is an elevator at different floors
      const floor = Math.sin(t * (0.5 + x * 0.3) + x * 2) * 2;
      state.offsetY = floor * blockSize * 0.5;
      // Door opening effect
      const doorPhase = Math.sin(t * 2 + x * 1.5);
      if (Math.abs(doorPhase) > 0.8) {
        state.scale = 1.1;
        state.brightness = 1.5;
      } else {
        state.brightness = 0.7 + (floor + 2) / 4 * 0.5;
      }
      break;
    }

    case 'fibonacci': {
      // Golden spiral from center
      const phi = (1 + Math.sqrt(5)) / 2;
      const fibAngle = blockIdx * phi * Math.PI * 2 + t * 0.5;
      const fibRadius = Math.sqrt(blockIdx + 1) * 6;
      state.offsetX = Math.cos(fibAngle) * fibRadius * 0.4 - (x - CENTER_X) * blockSize * 0.15;
      state.offsetY = Math.sin(fibAngle) * fibRadius * 0.3 - (y - CENTER_Y) * blockSize * 0.1;
      state.rotation = fibAngle * (180 / Math.PI) * 0.3;
      state.hueShift = (fibAngle * 30) % 360;
      state.brightness = 0.6 + (Math.sin(fibAngle) + 1) * 0.4;
      state.scale = 0.8 + (Math.sin(t + blockIdx * 0.5) + 1) * 0.15;
      break;
    }

    case 'filmReel': {
      // Vertical scrolling film strip
      const scrollSpeed2 = 2;
      const frameHeight = 6;
      const scrollPos = (t * scrollSpeed2) % frameHeight;
      state.offsetY = -scrollPos * blockSize * 0.3;
      // Sprocket jitter
      if (x === 0 || x === 4) {
        state.brightness = 0.4;
        state.scale = 0.7;
      }
      // Film grain
      state.brightness = (state.brightness || 1) + seededRandom(Math.floor(t * 24) + blockIdx) * 0.15 - 0.075;
      // Sepia tone
      state.hueShift = 30;
      // Frame line flash
      if (Math.abs(scrollPos - Math.round(scrollPos)) < 0.05) {
        state.brightness = 0.3;
      }
      break;
    }

    case 'fishSchool': {
      // All blocks move together but with slight individual lag
      const schoolDirX = Math.sin(t * 0.5);
      const schoolDirY = Math.cos(t * 0.4);
      const lag = seededRandom(blockIdx * 11) * 0.3;
      state.offsetX = schoolDirX * 25 * (1 - lag);
      state.offsetY = schoolDirY * 15 * (1 - lag);
      // Turn direction affects skew
      const turnRate = Math.cos(t * 0.5);
      state.skewX = turnRate * 8 * (1 - lag);
      state.rotation = turnRate * 10;
      state.brightness = 0.7 + (1 - lag) * 0.5;
      state.scale = 0.95 + Math.sin(t * 3 + blockIdx * 0.5) * 0.05;
      // Shimmering fish scales
      state.hueShift = 180 + Math.sin(t * 2 + blockIdx) * 20;
      break;
    }

    case 'flameWar': {
      const isLeft = x < CENTER_X;
      const isRight = x > CENTER_X;
      const isCenter = x === Math.round(CENTER_X);
      const warPhase = Math.sin(t * 2);
      if (isLeft) {
        const push = Math.max(0, warPhase) * 12;
        state.offsetX = push;
        state.colorOverride = hslToHex(0 + Math.sin(t * 4 + blockIdx) * 15, 90, 45);
        state.brightness = 1 + Math.max(0, warPhase) * 0.8;
      } else if (isRight) {
        const push = Math.max(0, -warPhase) * 12;
        state.offsetX = -push;
        state.colorOverride = hslToHex(220 + Math.sin(t * 4 + blockIdx) * 15, 90, 45);
        state.brightness = 1 + Math.max(0, -warPhase) * 0.8;
      }
      if (isCenter) {
        // Clash zone
        state.brightness = 2 + Math.abs(warPhase);
        state.colorOverride = '#ffffff';
        state.scale = 1 + Math.abs(warPhase) * 0.2;
        state.offsetX = Math.sin(t * 15) * 3;
      }
      break;
    }

    case 'fracture': {
      const fracCycle = t % 4;
      if (fracCycle < 2) {
        // Cracks spreading
        const crackFront = fracCycle / 2;
        const crackDist = normDist;
        if (crackDist < crackFront) {
          const crackAge = crackFront - crackDist;
          state.offsetX = (seededRandom(blockIdx * 7) - 0.5) * crackAge * 8;
          state.offsetY = (seededRandom(blockIdx * 13) - 0.5) * crackAge * 6;
          state.brightness = 1 + crackAge * 0.5;
        }
      } else if (fracCycle < 2.5) {
        // SHATTER
        const shatter2 = (fracCycle - 2) / 0.5;
        state.offsetX = (seededRandom(blockIdx * 7) - 0.5) * 80 * shatter2;
        state.offsetY = (seededRandom(blockIdx * 13) - 0.5) * 60 * shatter2 + shatter2 * 40;
        state.rotation = (seededRandom(blockIdx * 19) - 0.5) * 360 * shatter2;
        state.scale = 1 - shatter2 * 0.5;
        state.brightness = 2 - shatter2 * 1.5;
      } else {
        // Reassemble
        const fix = (fracCycle - 2.5) / 1.5;
        const eased2 = fix * fix;
        state.offsetX = (seededRandom(blockIdx * 7) - 0.5) * 80 * (1 - eased2);
        state.offsetY = (seededRandom(blockIdx * 13) - 0.5) * 60 * (1 - eased2);
        state.rotation = (seededRandom(blockIdx * 19) - 0.5) * 360 * (1 - eased2);
        state.scale = 0.5 + eased2 * 0.5;
        state.opacity = 0.5 + eased2 * 0.5;
      }
      break;
    }

    case 'fuse': {
      // Fuse burns through blocks in sequence, then boom
      const fuseLen = 22;
      const fuseSpeed2 = 4;
      const fuseCycle = t % (fuseLen / fuseSpeed2 + 1);
      const fusePos = fuseCycle * fuseSpeed2;
      const myOrder = blockIdx % 22;
      if (fusePos >= fuseLen - 0.5) {
        // DETONATION
        const boomP = (fusePos - (fuseLen - 0.5)) * 2;
        state.offsetX = (x - CENTER_X) * boomP * 20;
        state.offsetY = (y - CENTER_Y) * boomP * 20;
        state.brightness = 3 - boomP * 2;
        state.scale = 1 + boomP * 0.5;
        state.colorOverride = hslToHex(40 - boomP * 40, 100, 55);
      } else if (myOrder < fusePos) {
        // Burned — glowing ember
        state.brightness = 0.3 + Math.sin(t * 5 + blockIdx) * 0.1;
        state.colorOverride = '#331100';
      } else if (Math.abs(myOrder - fusePos) < 1.5) {
        // Burning point — sparks!
        state.brightness = 2.5;
        state.colorOverride = hslToHex(30 + Math.sin(t * 20) * 15, 100, 55);
        state.scale = 1.2;
        state.offsetY = -3;
      } else {
        state.brightness = 0.5;
      }
      break;
    }

    case 'galaxySpiral': {
      const armCount = 2;
      const spiralTightness = 1.5;
      const galAngle = angle + t * 0.3;
      const arm = galAngle * armCount / (Math.PI * 2);
      const spiralFit = Math.sin(arm * Math.PI * 2 - normDist * spiralTightness * Math.PI);
      const onArm = spiralFit > 0.3;
      state.offsetX = Math.cos(galAngle + normDist * 2) * normDist * 15;
      state.offsetY = Math.sin(galAngle + normDist * 2) * normDist * 8;
      if (onArm) {
        state.brightness = 0.8 + spiralFit * 1.2;
        state.colorOverride = hslToHex(220 + spiralFit * 40, 70, 50 + spiralFit * 20);
      } else {
        state.brightness = 0.15 + normDist * 0.15;
        state.opacity = 0.4;
      }
      state.rotation = t * 10;
      state.scale = 0.8 + (onArm ? 0.2 : 0);
      break;
    }

    case 'geiger': {
      // Random clicks with sharp flashes
      const clickSeed = seededRandom(Math.floor(t * 6) + blockIdx * 31);
      const isClick = clickSeed > 0.92;
      const clickAge2 = (t * 6) % 1;
      if (isClick && clickAge2 < 0.15) {
        state.brightness = 3;
        state.scale = 1.3;
        state.colorOverride = '#00ff00';
      } else {
        state.brightness = 0.15 + seededRandom(Math.floor(t * 2) + blockIdx) * 0.1;
        state.opacity = 0.5;
      }
      break;
    }

    case 'gravity': {
      // Zero-G floating
      const floatX = Math.sin(t * (0.2 + seededRandom(blockIdx * 11) * 0.3) + seededRandom(blockIdx * 7) * Math.PI * 2);
      const floatY = Math.cos(t * (0.15 + seededRandom(blockIdx * 13) * 0.25) + seededRandom(blockIdx * 17) * Math.PI * 2);
      state.offsetX = floatX * 15;
      state.offsetY = floatY * 12;
      state.rotation = Math.sin(t * 0.3 + blockIdx) * 15;
      state.scale = 1 + Math.sin(t * 0.5 + blockIdx * 0.7) * 0.05;
      state.brightness = 0.8 + (floatY + 1) * 0.2;
      break;
    }

    case 'heatMap': {
      // Temperature cycling from center outward
      const tempPhase = (t * 0.5 + normDist * 0.8) % 2;
      const temp = tempPhase < 1 ? tempPhase : 2 - tempPhase; // 0=cold, 1=hot
      const hue = (1 - temp) * 240; // 240=blue, 0=red
      state.colorOverride = hslToHex(hue, 80, 35 + temp * 25);
      state.brightness = 0.6 + temp * 0.8;
      state.scale = 1 + temp * 0.1;
      // Heat shimmer on hot blocks
      if (temp > 0.7) {
        state.offsetY = Math.sin(t * 8 + blockIdx) * 2 * temp;
        state.offsetX = Math.sin(t * 6 + blockIdx * 1.3) * 1;
      }
      break;
    }

    case 'hypnotize': {
      const ringSpeed2 = 1.2;
      const ringCount = 4;
      const ringPhase = (t * ringSpeed2 + normDist * ringCount) % 1;
      const ringPulse = Math.sin(ringPhase * Math.PI * 2);
      state.brightness = 0.3 + (ringPulse + 1) * 0.6;
      state.scale = 0.9 + (ringPulse + 1) * 0.1;
      // Black and white hypno spiral
      const spiral = Math.sin(angle * 3 + t * 2 + normDist * 6);
      state.colorOverride = spiral > 0
        ? hslToHex(270, 60, 20 + ringPulse * 20)
        : hslToHex(270, 20, 60 + ringPulse * 15);
      // Slow pull inward
      state.offsetX = -(x - CENTER_X) * Math.sin(t * 0.5) * 2;
      state.offsetY = -(y - CENTER_Y) * Math.sin(t * 0.5) * 2;
      break;
    }

    case 'iceCrack': {
      const iceCycle = t % 4;
      if (iceCycle < 2) {
        // Frozen — subtle shimmer
        state.colorOverride = hslToHex(200 + seededRandom(blockIdx * 7) * 20, 50, 60 + Math.sin(t * 2 + blockIdx) * 5);
        state.brightness = 0.9 + Math.sin(t * 3 + blockIdx * 0.5) * 0.1;
      } else if (iceCycle < 2.5) {
        // Cracking — lines of bright blue
        const crackP = (iceCycle - 2) / 0.5;
        const isCrackLine = (x + y) % 2 === 0;
        if (isCrackLine && crackP > seededRandom(blockIdx * 23)) {
          state.brightness = 2.5;
          state.colorOverride = '#aaeeff';
          state.scale = 1.1;
        } else {
          state.colorOverride = hslToHex(200, 50, 60);
        }
      } else {
        // Shatter and reform
        const shatterP = (iceCycle - 2.5) / 1.5;
        if (shatterP < 0.4) {
          const fly = shatterP / 0.4;
          state.offsetX = (seededRandom(blockIdx * 11) - 0.5) * 50 * fly;
          state.offsetY = (seededRandom(blockIdx * 17) - 0.5) * 40 * fly;
          state.rotation = (seededRandom(blockIdx * 29) - 0.5) * 180 * fly;
          state.brightness = 2 - fly;
          state.colorOverride = '#aaeeff';
        } else {
          const reform2 = (shatterP - 0.4) / 0.6;
          state.offsetX = (seededRandom(blockIdx * 11) - 0.5) * 50 * (1 - reform2);
          state.offsetY = (seededRandom(blockIdx * 17) - 0.5) * 40 * (1 - reform2);
          state.rotation = (seededRandom(blockIdx * 29) - 0.5) * 180 * (1 - reform2);
          state.opacity = 0.5 + reform2 * 0.5;
        }
      }
      break;
    }

    case 'jello': {
      // Wobbly jello physics
      const impact = Math.sin(t * 1.5);
      const impactHit = impact > 0.9;
      const wobbleFreq = 4;
      const wobbleDecay = 2;
      const timeSinceImpact = (t * 1.5 % Math.PI) / Math.PI;
      const wobbleAmt = Math.exp(-timeSinceImpact * wobbleDecay);
      const wobbleX = Math.sin(t * wobbleFreq + x * 1.2) * wobbleAmt * 8;
      const wobbleY = Math.sin(t * wobbleFreq * 1.3 + y * 0.9) * wobbleAmt * 6;
      state.offsetX = wobbleX;
      state.offsetY = wobbleY + (impactHit ? 5 : 0);
      state.skewX = wobbleX * 1.5;
      state.skewY = wobbleY;
      state.scale = 1 + wobbleAmt * 0.1;
      state.brightness = 1 + wobbleAmt * 0.3;
      break;
    }

    case 'jumpRope': {
      // Blocks arc over in a jump rope motion
      const ropePhase = (t * 0.8 + blockIdx * 0.05) % 2;
      const inArc = ropePhase < 1;
      if (inArc) {
        const arcP = ropePhase;
        const arcHeight = Math.sin(arcP * Math.PI) * 50;
        state.offsetY = -arcHeight;
        state.offsetX = (arcP - 0.5) * 30;
        state.rotation = (arcP - 0.5) * 60;
        state.brightness = 1 + arcHeight / 50 * 0.5;
        state.scale = 1 + arcHeight / 50 * 0.1;
      } else {
        state.brightness = 0.7;
      }
      break;
    }

    case 'knightsTour': {
      // L-shaped knight moves, light follows the path
      const knightMoves = [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
      const moveIdx = ((Math.floor(t * 2) % 8) + 8) % 8;
      const moveProgress = ((t * 2) % 1 + 1) % 1;
      const km = knightMoves[moveIdx];
      const knightX = (CENTER_X + km[0] * moveProgress + 5) % 5;
      const knightY = (CENTER_Y + km[1] * moveProgress + 6) % 6;
      const toKnight = Math.sqrt((x - knightX) ** 2 + (y - knightY) ** 2);
      if (toKnight < 1.2) {
        const intensity4 = 1 - toKnight / 1.2;
        state.brightness = 1 + intensity4 * 2;
        state.scale = 1 + intensity4 * 0.2;
        state.colorOverride = hslToHex(45, 70, 50 + intensity4 * 20); // golden
      } else {
        state.brightness = 0.15 + Math.sin(t * 0.5 + blockIdx) * 0.05;
      }
      break;
    }

    case 'lightsaber': {
      // Rows ignite sequentially with energy glow
      const igniteSpeed = 1.5;
      const igniteCycle = t % (6 / igniteSpeed + 1);
      const igniteRow = igniteCycle * igniteSpeed;
      if (y < igniteRow - 0.5) {
        // Fully ignited
        state.brightness = 1.2 + Math.sin(t * 6 + x * 2) * 0.2;
        state.colorOverride = hslToHex(120, 80, 45 + Math.sin(t * 4 + blockIdx) * 10);
        state.scale = 1.05;
      } else if (y < igniteRow + 0.5) {
        // Igniting edge
        const edgeP = 1 - (y - (igniteRow - 0.5));
        state.brightness = 1 + edgeP * 2;
        state.colorOverride = '#ffffff';
        state.scale = 1 + edgeP * 0.2;
      } else {
        state.brightness = 0.15;
        state.opacity = 0.4;
      }
      break;
    }

    case 'liquidMetal': {
      // Mercury blob morphing
      const blobX = CENTER_X + Math.sin(t * 0.7) * 1.5;
      const blobY = CENTER_Y + Math.cos(t * 0.5) * 2;
      const blobDist = Math.sqrt((x - blobX) ** 2 + (y - blobY) ** 2);
      const inBlob = blobDist < 2.5 + Math.sin(t * 1.5 + angle) * 0.8;
      if (inBlob) {
        state.brightness = 1.5 + (1 - blobDist / 3) * 1;
        state.colorOverride = hslToHex(210, 10, 65 + (1 - blobDist / 3) * 20);
        state.scale = 1 + (1 - blobDist / 3) * 0.1;
        // Reflective shimmer
        state.hueShift = Math.sin(t * 3 + angle * 2) * 20;
      } else {
        state.opacity = 0.1;
        state.brightness = 0.2;
        state.scale = 0.5;
      }
      break;
    }

    case 'meltdown': {
      const meltCycle = t % 4;
      const meltFront = meltCycle * 1.5; // row 0-6
      if (y < meltFront) {
        // Melted — dripping down
        const meltAge = meltFront - y;
        state.offsetY = meltAge * 10;
        state.skewY = meltAge * 8;
        state.scale = 1 + meltAge * 0.05;
        state.brightness = 0.4;
        state.opacity = Math.max(0.1, 1 - meltAge * 0.2);
        state.colorOverride = hslToHex(30, 60, 30);
      } else if (y < meltFront + 1) {
        // Melting edge
        const edgeP2 = y - meltFront;
        state.brightness = 2 - edgeP2;
        state.colorOverride = hslToHex(40, 100, 50);
        state.skewY = (1 - edgeP2) * 10;
      }
      break;
    }

    case 'metronome': {
      // Columns tick left and right
      const metSpeed = 1 + x * 0.2;
      const metAngle = Math.sin(t * metSpeed) * 20;
      state.offsetX = Math.sin(t * metSpeed) * 10;
      state.rotation = metAngle;
      // Tick at extremes
      const atExtreme = Math.abs(Math.cos(t * metSpeed)) < 0.05;
      if (atExtreme) {
        state.brightness = 2;
        state.scale = 1.1;
      } else {
        state.brightness = 0.7 + Math.abs(Math.sin(t * metSpeed)) * 0.4;
      }
      break;
    }

    case 'mirage': {
      // Heat shimmer distortion
      const heatWave1 = Math.sin(t * 2 + y * 1.5 + x * 0.3) * 4;
      const heatWave2 = Math.sin(t * 1.5 + y * 0.8 - x * 0.5) * 3;
      state.offsetX = heatWave1 + heatWave2;
      state.offsetY = Math.sin(t * 1.8 + x * 1.2) * 2;
      state.skewX = heatWave1 * 1.5;
      state.brightness = 1 + Math.sin(t * 3 + y * 2) * 0.15;
      // Slight transparency ripple
      state.opacity = 0.7 + Math.sin(t * 2.5 + blockIdx * 0.3) * 0.3;
      state.hueShift = heatWave1 * 5;
      break;
    }

    case 'morse': {
      // SOS: ... --- ... in brightness
      const morsePattern = [1,0,1,0,1,0,0,0,3,0,3,0,3,0,0,0,1,0,1,0,1]; // 1=dit, 3=dah, 0=gap
      const unitLen = 0.15;
      const totalLen = morsePattern.reduce((a, b) => a + Math.max(b, 1), 0) * unitLen;
      let morseCursor = (t + blockIdx * 0.1) % totalLen;
      let currentUnit = 0;
      for (const unit of morsePattern) {
        const dur = Math.max(unit, 1) * unitLen;
        if (morseCursor < dur) {
          currentUnit = unit;
          break;
        }
        morseCursor -= dur;
      }
      state.brightness = currentUnit > 0 ? 2.5 : 0.1;
      state.scale = currentUnit > 0 ? 1.1 : 0.95;
      break;
    }

    case 'neutronStar': {
      // Dense spinning with lighthouse beam
      const nsSpeed = t * 3;
      const beamAngle2 = nsSpeed % (Math.PI * 2);
      const blockAngle = Math.atan2(y - CENTER_Y, x - CENTER_X) + Math.PI;
      let angleDiff = Math.abs(blockAngle - beamAngle2);
      if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
      const inBeam = angleDiff < 0.4;
      // Core
      if (normDist < 0.3) {
        state.brightness = 2;
        state.colorOverride = '#ffffff';
        state.scale = 1.2;
      } else if (inBeam) {
        const beamIntensity = 1 - angleDiff / 0.4;
        state.brightness = beamIntensity * 2.5;
        state.colorOverride = hslToHex(200, 60, 50 + beamIntensity * 30);
      } else {
        state.brightness = 0.1;
        state.opacity = 0.4;
      }
      state.rotation = t * 50 * (1 - normDist);
      break;
    }

    case 'piston': {
      // Rows pump up and down like engine pistons
      const pistonPhase = y * (Math.PI / 3); // offset per row
      const pistonY = Math.sin(t * 3 + pistonPhase) * 15;
      state.offsetY = pistonY;
      // Compression glow
      const compressed = pistonY > 10;
      state.brightness = compressed ? 1.5 + (pistonY - 10) * 0.2 : 0.7;
      state.scale = 1 - Math.abs(pistonY) * 0.003;
      // Engine heat
      state.hueShift = Math.max(0, pistonY) * 3;
      break;
    }

    case 'plasma': {
      // Electric tendrils from center
      const tendrilCount = 5;
      const tendrilAngle = (blockIdx / 22) * Math.PI * 2 * tendrilCount;
      const tendrilReach = (Math.sin(t * 2 + tendrilAngle) + 1) / 2;
      const onTendril = Math.abs(Math.sin(angle * tendrilCount - t * 3)) < 0.3 + tendrilReach * 0.2;
      if (normDist < 0.25) {
        // Core
        state.brightness = 2.5;
        state.colorOverride = '#ff88ff';
        state.scale = 1.15;
      } else if (onTendril && normDist < tendrilReach + 0.3) {
        state.brightness = 1 + (1 - normDist) * 1.5;
        state.colorOverride = hslToHex(280 + normDist * 40, 80, 45 + (1 - normDist) * 25);
        state.offsetX = Math.sin(t * 10 + blockIdx) * 2;
        state.offsetY = Math.cos(t * 8 + blockIdx) * 2;
      } else {
        state.brightness = 0.1;
        state.opacity = 0.3;
      }
      break;
    }

    case 'quantum': {
      // Blocks flicker between states
      const quantumSeed = seededRandom(Math.floor(t * 4) + blockIdx * 37);
      const isObserved = quantumSeed > 0.5;
      if (isObserved) {
        state.brightness = 1.2;
        state.scale = 1;
        state.opacity = 1;
      } else {
        // Superposition — ghost
        state.brightness = 0.5;
        state.scale = 0.7 + Math.sin(t * 8 + blockIdx) * 0.2;
        state.opacity = 0.3 + Math.sin(t * 6 + blockIdx) * 0.2;
        state.offsetX = Math.sin(t * 5 + blockIdx) * 5;
        state.offsetY = Math.cos(t * 4 + blockIdx) * 3;
        state.hueShift = 180;
      }
      // Measurement collapse flash
      const collapse2 = Math.sin(t * 2);
      if (Math.abs(collapse2) > 0.98) {
        state.brightness = 2.5;
        state.colorOverride = '#ffffff';
      }
      break;
    }

    case 'radar': {
      // Rotating sweep beam
      const radarAngle = (t * 1.5) % (Math.PI * 2);
      const blockAngle2 = Math.atan2(y - CENTER_Y, x - CENTER_X) + Math.PI;
      let radarDiff = radarAngle - blockAngle2;
      if (radarDiff < 0) radarDiff += Math.PI * 2;
      // Beam with fade trail
      const trailLen = 0.8;
      if (radarDiff < trailLen) {
        const trailFade = radarDiff / trailLen;
        state.brightness = 2 - trailFade * 1.5;
        state.colorOverride = hslToHex(120, 80, 30 + (1 - trailFade) * 30);
        state.scale = 1 + (1 - trailFade) * 0.1;
      } else {
        state.brightness = 0.15;
        state.colorOverride = hslToHex(120, 50, 15);
      }
      // Center dot
      if (normDist < 0.2) {
        state.brightness = 1.5;
        state.scale = 1.1;
      }
      break;
    }

    case 'ricochet': {
      // Bullet bounces between blocks
      const bulletSpeed = 6;
      const bulletPath = (t * bulletSpeed) % 22;
      const bulletBlock = Math.floor(bulletPath);
      const myBlock = blockIdx % 22;
      const distFromBullet = Math.min(
        Math.abs(myBlock - bulletBlock),
        Math.abs(myBlock - bulletBlock + 22),
        Math.abs(myBlock - bulletBlock - 22)
      );
      if (distFromBullet === 0) {
        state.brightness = 3;
        state.colorOverride = '#ffff00';
        state.scale = 1.4;
        state.offsetX = (seededRandom(bulletBlock * 31) - 0.5) * 4;
        state.offsetY = (seededRandom(bulletBlock * 37) - 0.5) * 4;
      } else if (distFromBullet < 3) {
        const fade = distFromBullet / 3;
        state.brightness = 2 - fade * 1.5;
        state.colorOverride = hslToHex(40, 90, 40);
        state.scale = 1 + (1 - fade) * 0.1;
      } else {
        state.brightness = 0.15;
      }
      break;
    }

    case 'sandstorm': {
      // Gusting wind with particles
      const gustPhase = Math.sin(t * 0.5);
      const gustStrength = (gustPhase + 1) / 2;
      const particleX = Math.sin(t * 3 + blockIdx * 2.3) * gustStrength * 25;
      const particleY = Math.cos(t * 2 + blockIdx * 1.7) * gustStrength * 8;
      state.offsetX = particleX + gustStrength * 15; // wind pushes right
      state.offsetY = particleY;
      state.opacity = 0.4 + (1 - gustStrength) * 0.6;
      state.brightness = 0.5 + gustStrength * 0.5;
      state.colorOverride = hslToHex(35 + gustStrength * 10, 50, 40 + gustStrength * 15);
      state.blur = gustStrength * 1.5;
      state.rotation = gustStrength * 15;
      break;
    }

    case 'shatter': {
      const shatterCycle = t % 3;
      if (shatterCycle < 0.1) {
        // Impact
        state.brightness = 3;
        state.colorOverride = '#ffffff';
        state.scale = 1.3;
      } else if (shatterCycle < 1.5) {
        // Flying apart
        const fly2 = (shatterCycle - 0.1) / 1.4;
        const launchAngle = seededRandom(blockIdx * 41) * Math.PI * 2;
        const launchForce = 30 + seededRandom(blockIdx * 47) * 50;
        state.offsetX = Math.cos(launchAngle) * launchForce * fly2;
        state.offsetY = Math.sin(launchAngle) * launchForce * fly2 + fly2 * fly2 * 40; // gravity
        state.rotation = (seededRandom(blockIdx * 53) - 0.5) * 720 * fly2;
        state.scale = 1 - fly2 * 0.5;
        state.opacity = 1 - fly2 * 0.6;
        state.brightness = 2 - fly2 * 1.5;
      } else {
        // Reverse — pieces fly back
        const back = (shatterCycle - 1.5) / 1.5;
        const eased3 = back * back;
        const launchAngle = seededRandom(blockIdx * 41) * Math.PI * 2;
        const launchForce = 30 + seededRandom(blockIdx * 47) * 50;
        state.offsetX = Math.cos(launchAngle) * launchForce * (1 - eased3);
        state.offsetY = Math.sin(launchAngle) * launchForce * (1 - eased3);
        state.rotation = (seededRandom(blockIdx * 53) - 0.5) * 720 * (1 - eased3);
        state.scale = 0.5 + eased3 * 0.5;
        state.opacity = 0.4 + eased3 * 0.6;
      }
      break;
    }

    case 'sineCity': {
      // Multiple sine waves creating interference
      const wave1a = Math.sin(t * 1.5 + x * 1.0);
      const wave2b = Math.sin(t * 1.2 + y * 1.2);
      const wave3a = Math.sin(t * 0.8 + (x + y) * 0.6);
      const wave4 = Math.cos(t * 1.0 + (x - y) * 0.8);
      const combined2 = (wave1a + wave2b + wave3a + wave4) / 4;
      state.brightness = 0.3 + (combined2 + 1) * 0.8;
      state.offsetY = combined2 * 10;
      state.offsetX = (wave1a - wave2b) * 5;
      state.scale = 0.9 + (combined2 + 1) * 0.1;
      state.hueShift = combined2 * 90 + t * 20;
      state.colorOverride = hslToHex(
        (240 + combined2 * 60 + t * 15) % 360,
        60 + Math.abs(combined2) * 30,
        35 + (combined2 + 1) * 15
      );
      break;
    }

    case 'teleport': {
      const teleCycle = t % 2.5;
      if (teleCycle < 0.5) {
        // Dissolving
        const dissolve2 = teleCycle / 0.5;
        const shouldGo = seededRandom(Math.floor(t / 2.5) + blockIdx * 11) < dissolve2;
        if (shouldGo) {
          state.scale = 1 - dissolve2;
          state.brightness = 1 + dissolve2 * 2;
          state.opacity = 1 - dissolve2;
          state.hueShift = 180;
        }
      } else if (teleCycle < 1.5) {
        // Gone — only sparkles
        state.opacity = 0;
        state.scale = 0;
      } else {
        // Reassembling at position
        const reassemble2 = (teleCycle - 1.5) / 1;
        const shouldAppear = seededRandom(Math.floor(t / 2.5) + blockIdx * 11) < reassemble2;
        if (shouldAppear) {
          state.scale = reassemble2;
          state.brightness = 2 - reassemble2;
          state.opacity = reassemble2;
          state.hueShift = 180 * (1 - reassemble2);
        } else {
          state.opacity = 0;
          state.scale = 0;
        }
      }
      break;
    }
  }

  return state;
}

// ─── Rook Display Component ───
function AnimatedRook({ animation, blockSize = 24, enableSound = false }: { animation: AnimationId; blockSize?: number; enableSound?: boolean }) {
  const [time, setTime] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      setTime((now - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animation]);

  // Sound loop for animations that have one
  useEffect(() => {
    if (!enableSound) return;
    const animDef = ANIMATIONS.find(a => a.id === animation);
    if (!animDef?.sound) return;
    const { src, interval } = animDef.sound;
    const audio = new Audio(src);
    audio.volume = 0.5;
    // Play immediately + on interval
    audio.play().catch(() => {});
    const id = setInterval(() => {
      const a = new Audio(src);
      a.volume = 0.5;
      a.play().catch(() => {});
    }, interval * 1000);
    return () => clearInterval(id);
  }, [animation, enableSound]);

  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const radius = Math.max(1, Math.round(blockSize * 0.14));
  const gridWidth = 5 * blockSize + 4 * gap;
  const gridHeight = 6 * blockSize + 5 * gap;
  const scale = blockSize / 14;
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  const insetShadow = `inset 0 ${s(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${s(0.75)} 0 rgba(255,255,255,0.15)`;

  return (
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
        const state = animateBlock(animation, x, y, time, blockSize);

        const bgColor = state.colorOverride || block.color;
        const noTransition = animation === 'glitchStorm' || animation === 'strobe' || animation === 'glitchHop';

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
              transition: noTransition ? 'none' : 'left 0.03s, top 0.03s',
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Page ───
const PER_PAGE = 12;
const TOTAL_PAGES = Math.ceil(ANIMATIONS.length / PER_PAGE);

type Tab = 'animations' | 'interactive';

export default function TestRookAnimations() {
  const [tab, setTab] = useState<Tab>('animations');
  const [selected, setSelected] = useState<AnimationId | null>(null);
  const [page, setPage] = useState(0);

  const pageAnims = ANIMATIONS.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-auto p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-1 text-white/90">Rook Animation Lab</h1>
        <p className="text-sm text-white/40 mb-4">
          {tab === 'animations'
            ? `${ANIMATIONS.length} animations · Page ${page + 1} of ${TOTAL_PAGES}`
            : '20 mouse-reactive modes · hover, click, drag'}
        </p>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setTab('animations'); setSelected(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'animations'
                ? 'bg-indigo-500/30 text-indigo-300 ring-1 ring-indigo-500/50'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            Animations ({ANIMATIONS.length})
          </button>
          <button
            onClick={() => { setTab('interactive'); setSelected(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'interactive'
                ? 'bg-emerald-500/30 text-emerald-300 ring-1 ring-emerald-500/50'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            Interactive (20)
          </button>
        </div>

        {tab === 'interactive' ? (
          <Suspense fallback={<div className="text-white/30 text-sm">Loading interactive modes...</div>}>
            <InteractiveSection />
          </Suspense>
        ) : (
        <>
        {selected ? (
          /* ─── Focus View ─── */
          <div>
            <button
              onClick={() => setSelected(null)}
              className="mb-6 px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 transition"
            >
              Back to gallery
            </button>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white/[0.03] rounded-2xl p-12 border border-white/[0.06]">
                <AnimatedRook animation={selected} blockSize={36} enableSound />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-white/80">
                  {ANIMATIONS.find(a => a.id === selected)?.label}
                </p>
                <p className="text-sm text-white/40">
                  {ANIMATIONS.find(a => a.id === selected)?.description}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ─── Gallery View (paginated) ─── */
          <div>
            {/* Page nav */}
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

            {/* Grid — only 12 rAFs at a time */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {pageAnims.map(({ id, label, description }) => (
                <div
                  key={id}
                  className="flex flex-col items-center gap-3 bg-white/[0.03] rounded-xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition cursor-pointer"
                  onClick={() => setSelected(id)}
                >
                  <AnimatedRook animation={id} blockSize={18} />
                  <div className="text-center">
                    <p className="text-xs font-medium text-white/80">{label}</p>
                    <p className="text-[10px] text-white/35 mt-0.5 line-clamp-2">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom nav */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="text-xs text-white/30">{page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, ANIMATIONS.length)} of {ANIMATIONS.length}</span>
              <button
                onClick={() => setPage(p => Math.min(TOTAL_PAGES - 1, p + 1))}
                disabled={page === TOTAL_PAGES - 1}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
