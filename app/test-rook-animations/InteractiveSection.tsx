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
type ModeId =
  | 'repel' | 'attract' | 'spotlight' | 'ripple' | 'paint'
  | 'gravity' | 'magnet' | 'tornado' | 'freeze' | 'grow'
  | 'xray' | 'blackhole' | 'fireworks' | 'elastic' | 'wave'
  | 'scatter' | 'orbit' | 'heat' | 'lightning' | 'bubble';

const MODES: { id: ModeId; label: string; description: string }[] = [
  { id: 'repel', label: 'Force Field', description: 'Blocks flee from your cursor' },
  { id: 'attract', label: 'Magnet', description: 'Blocks get pulled toward cursor' },
  { id: 'spotlight', label: 'Spotlight', description: 'Cursor illuminates nearby blocks' },
  { id: 'ripple', label: 'Ripple', description: 'Click to send shockwaves through blocks' },
  { id: 'paint', label: 'Paint', description: 'Drag to paint color trails on blocks' },
  { id: 'gravity', label: 'Tilt Gravity', description: 'Cursor position controls gravity direction' },
  { id: 'magnet', label: 'Polar Magnet', description: 'Left side attracts, right side repels' },
  { id: 'tornado', label: 'Tornado', description: 'Blocks orbit your cursor in a vortex' },
  { id: 'freeze', label: 'Freeze Ray', description: 'Hover to freeze blocks in ice' },
  { id: 'grow', label: 'Grow', description: 'Blocks near cursor grow huge, far ones shrink' },
  { id: 'xray', label: 'X-Ray', description: 'Cursor reveals skeleton structure underneath' },
  { id: 'blackhole', label: 'Black Hole', description: 'Click to create gravity wells that suck blocks in' },
  { id: 'fireworks', label: 'Fireworks', description: 'Click anywhere to launch blocks as fireworks' },
  { id: 'elastic', label: 'Elastic', description: 'Drag blocks and they snap back like rubber bands' },
  { id: 'wave', label: 'Wave Machine', description: 'Move mouse up/down to create waves' },
  { id: 'scatter', label: 'Scatter', description: 'Click to explode blocks, they slowly reform' },
  { id: 'orbit', label: 'Orbit', description: 'Blocks orbit cursor at different speeds' },
  { id: 'heat', label: 'Heat Finger', description: 'Hover heats blocks from blue to red' },
  { id: 'lightning', label: 'Lightning', description: 'Click to zap bolts between blocks' },
  { id: 'bubble', label: 'Bubble Wrap', description: 'Hover over blocks to pop them' },
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

function defaultState(): BlockState {
  return { offsetX: 0, offsetY: 0, scale: 1, rotation: 0, opacity: 1, brightness: 1, hueShift: 0, skewX: 0, skewY: 0, blur: 0 };
}

interface MouseState {
  x: number; // normalized 0-1 within grid
  y: number;
  down: boolean;
  clickX: number;
  clickY: number;
  clickTime: number;
  velocity: number; // mouse speed
}

// Per-block persistent state for physics
interface BlockPhysics {
  vx: number;
  vy: number;
  px: number;
  py: number;
  heat: number;
  frozen: boolean;
  popped: boolean;
  painted: number; // hue, -1 = not painted
}

function computeBlock(
  mode: ModeId, x: number, y: number, blockIdx: number,
  mouse: MouseState, t: number, physics: BlockPhysics,
  blockSize: number, gridWidth: number, gridHeight: number,
): BlockState {
  const state = defaultState();
  const gap = Math.max(1, Math.round(blockSize * 0.15));

  // Block center in normalized coords (0-1)
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
      // Ambient glow near cursor
      state.brightness = Math.max(state.brightness, 0.3 + Math.max(0, 0.2 - dist) * 3);
      break;
    }

    case 'paint': {
      if (physics.painted >= 0) {
        state.colorOverride = hslToHex(physics.painted, 80, 50);
        state.brightness = 1.3;
      }
      // Brush preview near cursor
      if (dist < 0.15) {
        const preview = 1 - dist / 0.15;
        state.brightness = 1 + preview;
        state.scale = 1 + preview * 0.15;
      }
      break;
    }

    case 'gravity': {
      // Mouse position = gravity direction
      const gx = (mouse.x - 0.5) * 60;
      const gy = (mouse.y - 0.5) * 60;
      state.offsetX = physics.px;
      state.offsetY = physics.py;
      // Update physics externally but preview here
      state.brightness = 0.8 + Math.abs(physics.vx + physics.vy) * 0.05;
      state.rotation = physics.vx * 2;
      break;
    }

    case 'magnet': {
      // Left half of grid = attract, right half = repel
      const polarity = mouse.x < 0.5 ? 1 : -1;
      const force2 = Math.max(0, 0.4 - dist) * 120 * polarity;
      state.offsetX = Math.cos(angle) * force2;
      state.offsetY = Math.sin(angle) * force2;
      state.hueShift = polarity > 0 ? 0 : 180; // red attract, cyan repel
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
        // Ice crystals — slight scale bump
        state.scale = 1.05;
      } else {
        // Normal breathing
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
        // Skeleton = just outline blocks
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
        // Explode from click point
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
          // Fade back
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
      // Blocks stretch toward cursor when mouse is down
      if (mouse.down && dist < 0.3) {
        const stretch = (0.3 - dist) / 0.3;
        state.offsetX = dx * gridWidth * stretch * 0.3;
        state.offsetY = dy * gridHeight * stretch * 0.3;
        state.scale = 1 + stretch * 0.2;
        state.brightness = 1 + stretch * 0.5;
        state.skewX = dx * 20;
        state.skewY = dy * 10;
      } else {
        // Spring back with oscillation
        state.offsetX = physics.px;
        state.offsetY = physics.py;
        state.brightness = 1 + Math.abs(physics.vx) * 0.1;
      }
      break;
    }

    case 'wave': {
      // Mouse Y position controls wave amplitude
      const amplitude = (mouse.y - 0.5) * 40;
      const wavePhase = t * 3 + x * 0.8;
      state.offsetY = Math.sin(wavePhase) * amplitude;
      state.brightness = 0.7 + (Math.sin(wavePhase) + 1) * 0.4;
      state.scale = 1 + Math.sin(wavePhase) * 0.05;
      // Mouse X controls wave speed/frequency (visual only through color)
      state.hueShift = mouse.x * 120;
      break;
    }

    case 'scatter': {
      if (timeSinceClick < 4) {
        const age2 = timeSinceClick;
        if (age2 < 0.5) {
          // Explode
          const p = age2 / 0.5;
          const scatterAngle = seededRandom(blockIdx * 37) * Math.PI * 2;
          const scatterForce = 30 + seededRandom(blockIdx * 43) * 70;
          state.offsetX = Math.cos(scatterAngle) * scatterForce * p;
          state.offsetY = Math.sin(scatterAngle) * scatterForce * p;
          state.rotation = (seededRandom(blockIdx * 53) - 0.5) * 360 * p;
          state.brightness = 2 - p;
        } else {
          // Slowly reform
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
      // Hovering heats blocks, they cool over time
      const temp = physics.heat;
      const hue2 = (1 - temp) * 240; // blue(cold) to red(hot)
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
        // Find closest block to click and chain outward
        const chainDist = timeSinceClick * 1.5; // expanding reach
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
        // Popped — slowly reform
        const reformSpeed = 0.3;
        state.scale = Math.min(1, physics.heat * reformSpeed);
        state.opacity = state.scale;
        state.brightness = 0.5 + state.scale * 0.5;
      } else {
        // Wobble when cursor is near
        if (dist < 0.15) {
          state.scale = 1.2 + Math.sin(t * 10 + blockIdx) * 0.1;
          state.brightness = 1.5;
          // About to pop!
          state.offsetX = Math.sin(t * 15 + blockIdx) * 2;
          state.offsetY = Math.cos(t * 12 + blockIdx) * 2;
        } else {
          state.brightness = 0.8 + Math.sin(t * 1.5 + blockIdx * 0.3) * 0.15;
          state.scale = 1 + Math.sin(t * 2 + blockIdx * 0.5) * 0.03;
        }
      }
      break;
    }
  }

  return state;
}

// ─── Interactive Rook ───
function InteractiveRook({ mode, blockSize = 28 }: { mode: ModeId; blockSize?: number }) {
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

  // Reset physics on mode change
  useEffect(() => {
    physicsRef.current = Array.from({ length: 30 }, () => ({
      vx: 0, vy: 0, px: 0, py: 0, heat: 0, frozen: false, popped: false, painted: -1,
    }));
  }, [mode]);

  // Mouse tracking
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

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      const t2 = (now - startRef.current) / 1000;
      const dt = 0.016;
      const mouse = mouseRef.current;

      // Update physics
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
          // Spring back to origin
          p.vx -= p.px * 2 * dt;
          p.vy -= p.py * 2 * dt;
          p.px += p.vx * dt;
          p.py += p.vy * dt;
          // Clamp
          p.px = Math.max(-40, Math.min(40, p.px));
          p.py = Math.max(-40, Math.min(40, p.py));
        }

        if (mode === 'elastic') {
          if (!mouse.down) {
            // Spring back
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
            p.heat += dt; // time since pop
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
          // Slowly thaw blocks far from cursor
          if (seededRandom(Math.floor(t2) + i) > 0.98) {
            p.frozen = false;
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
      style={{
        position: 'relative',
        width: gridWidth,
        height: gridHeight,
        transform: 'translate3d(0,0,0)',
        cursor: 'crosshair',
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

// ─── Page ───
const PER_PAGE = 12;
const TOTAL_PAGES = Math.ceil(MODES.length / PER_PAGE);

export default function InteractiveSection() {
  const [selected, setSelected] = useState<ModeId | null>(null);
  const [page, setPage] = useState(0);

  const pageModes = MODES.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div>
        {selected ? (
          <div>
            <button
              onClick={() => setSelected(null)}
              className="mb-6 px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 transition"
            >
              Back to gallery
            </button>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white/[0.03] rounded-2xl p-16 border border-white/[0.06]">
                <InteractiveRook mode={selected} blockSize={36} />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-white/80">
                  {MODES.find(a => a.id === selected)?.label}
                </p>
                <p className="text-sm text-white/40">
                  {MODES.find(a => a.id === selected)?.description}
                </p>
              </div>
            </div>
          </div>
        ) : (
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
              {pageModes.map(({ id, label, description }) => (
                <div
                  key={id}
                  className="flex flex-col items-center gap-3 bg-white/[0.03] rounded-xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition cursor-pointer"
                  onClick={() => setSelected(id)}
                >
                  <InteractiveRook mode={id} blockSize={18} />
                  <div className="text-center">
                    <p className="text-xs font-medium text-white/80">{label}</p>
                    <p className="text-[10px] text-white/35 mt-0.5 line-clamp-2">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="text-xs text-white/30">{page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, MODES.length)} of {MODES.length}</span>
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
    </div>
  );
}
