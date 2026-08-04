'use client';

import { useId } from 'react';
import { ROOK_BLOCKS, lighten, darken } from '@/lib/daily-rook-blocks';

/**
 * Chess Boxing app icon explorations — round 2.
 * The REAL BreathingRook (exact ROOK_BLOCKS colors + matte gradient look)
 * with minimal boxing-ring additions: ropes, corner post, canvas. No gloves.
 */

const NAVY = '#1b2a4a';
const NAVY_DEEP = '#101a33';
const ROPE_RED = '#e5484d';
const ROPE_BLUE = '#3b82f6';

// ─── Matte rook, drawn in SVG with the exact BreathingRook gradient ───
// Grid: 5×6, cell + gap matches BreathingRook proportions (gap = 15% of block).
function MatteDefs({ prefix }: { prefix: string }) {
  const colors = Array.from(new Set(ROOK_BLOCKS.map((b) => b.color)));
  return (
    <defs>
      {colors.map((c) => (
        <linearGradient key={c} id={`${prefix}${c.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(c, 18)} />
          <stop offset="20%" stopColor={lighten(c, 12)} />
          <stop offset="40%" stopColor={c} />
          <stop offset="100%" stopColor={darken(c, 12)} />
        </linearGradient>
      ))}
    </defs>
  );
}

function MatteRook({ x, y, cell, prefix }: { x: number; y: number; cell: number; prefix: string }) {
  const gap = cell * 0.15;
  const step = cell + gap;
  return (
    <g>
      {ROOK_BLOCKS.map((b, i) => (
        <rect
          key={i}
          x={x + b.x * step}
          y={y + b.y * step}
          width={cell}
          height={cell}
          rx={cell * 0.14}
          fill={`url(#${prefix}${b.color.slice(1)})`}
        />
      ))}
    </g>
  );
}
const rookW = (cell: number) => 5 * cell + 4 * cell * 0.15;
const rookH = (cell: number) => 6 * cell + 5 * cell * 0.15;

// ─── Icon squircle wrapper ───
function Icon({ bg, children }: { bg: string; children: (prefix: string) => React.ReactNode }) {
  // useId can emit chars (« » :) that break url(#...) refs — strip them
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clipId = `${id}c`;
  return (
    <svg viewBox="0 0 100 100" width="100%" style={{ display: 'block' }}>
      <MatteDefs prefix={id} />
      <clipPath id={clipId}>
        <rect x={0} y={0} width={100} height={100} rx={22.4} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect x={0} y={0} width={100} height={100} fill={bg} />
        {children(id)}
      </g>
    </svg>
  );
}

// Rope: a horizontal line with a subtle highlight, edge to edge.
function Rope({ y, color, w = 4.5 }: { y: number; color: string; w?: number }) {
  return (
    <g>
      <rect x={-2} y={y - w / 2} width={104} height={w} rx={w / 2} fill={color} />
      <rect x={-2} y={y - w / 2 + 0.8} width={104} height={w * 0.28} rx={w * 0.14} fill="rgba(255,255,255,0.35)" />
    </g>
  );
}

// ─── Variants ───

// A — In the ring: 3 ropes BEHIND the rook (red/white/blue), navy bg
function VariantA() {
  const cell = 11;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg={NAVY}>
      {(p) => (
        <>
          <Rope y={34} color={ROPE_RED} />
          <Rope y={50} color="#e8edf7" />
          <Rope y={66} color={ROPE_BLUE} />
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// B — On the canvas: rook stands on the ring floor, ropes behind upper body
function VariantB() {
  const cell = 10.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const floorY = 82;
  return (
    <Icon bg={NAVY_DEEP}>
      {(p) => (
        <>
          {/* ring canvas */}
          <rect x={-2} y={floorY} width={104} height={22} fill="#e8edf7" />
          <rect x={-2} y={floorY} width={104} height={2.4} fill="rgba(0,0,0,0.15)" />
          <Rope y={26} color={ROPE_RED} />
          <Rope y={42} color={ROPE_BLUE} />
          <MatteRook x={(100 - rw) / 2} y={floorY - rh} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// C — Corner post: ropes converge into a red turnbuckle corner, rook front
function VariantC() {
  const cell = 11;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg={NAVY}>
      {(p) => (
        <>
          {/* two rope pairs angling into the top-left corner post */}
          <g stroke={ROPE_RED} strokeWidth={4} strokeLinecap="round">
            <line x1={10} y1={16} x2={104} y2={34} />
          </g>
          <g stroke="#e8edf7" strokeWidth={4} strokeLinecap="round">
            <line x1={10} y1={30} x2={104} y2={56} />
          </g>
          <g stroke={ROPE_BLUE} strokeWidth={4} strokeLinecap="round">
            <line x1={10} y1={44} x2={104} y2={78} />
          </g>
          {/* corner post pad */}
          <rect x={2} y={8} width={13} height={44} rx={6.5} fill={ROPE_RED} />
          <rect x={4.5} y={11} width={4} height={38} rx={2} fill="rgba(255,255,255,0.3)" />
          <MatteRook x={54 - rw / 2 + 8} y={(100 - rh) / 2 + 4} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// D — Top-down ring: square rope border around the rook (ring from above)
function VariantD() {
  const cell = 9;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg={NAVY_DEEP}>
      {(p) => (
        <>
          {/* canvas */}
          <rect x={12} y={12} width={76} height={76} rx={6} fill={NAVY} />
          {/* rope border, outer red / inner white */}
          <rect x={9} y={9} width={82} height={82} rx={9} fill="none" stroke={ROPE_RED} strokeWidth={3.6} />
          <rect x={15.5} y={15.5} width={69} height={69} rx={6} fill="none" stroke="#e8edf7" strokeWidth={2.6} />
          {/* corner pads */}
          {[[9, 9], [91, 9], [9, 91], [91, 91]].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={6} fill={ROPE_RED} stroke={NAVY_DEEP} strokeWidth={1.5} />
          ))}
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// E — Minimal: rook + ONE red rope crossing low, nothing else
function VariantE() {
  const cell = 11.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg={NAVY}>
      {(p) => (
        <>
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2 - 2} cell={cell} prefix={p} />
          <Rope y={80} color={ROPE_RED} w={5.5} />
        </>
      )}
    </Icon>
  );
}

// ─── Round 3: 10 new concepts ───

// F — Spotlight: dark arena, light cone on Rookie center ring
function VariantF() {
  const cell = 10.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg="#0a1122">
      {(p) => (
        <>
          <polygon points="38,-4 62,-4 88,100 12,100" fill="rgba(232,237,247,0.13)" />
          <ellipse cx={50} cy={92} rx={40} ry={10} fill="rgba(232,237,247,0.18)" />
          <Rope y={58} color="rgba(229,72,77,0.5)" w={3.5} />
          <Rope y={70} color="rgba(59,130,246,0.5)" w={3.5} />
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2 + 6} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// G — Chessboard canvas: top-down ring where the floor IS a chessboard
function VariantG() {
  const cell = 8.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const sq = 76 / 6;
  return (
    <Icon bg={NAVY_DEEP}>
      {(p) => (
        <>
          {Array.from({ length: 36 }, (_, i) => {
            const cx = i % 6;
            const cy = Math.floor(i / 6);
            return (
              <rect
                key={i}
                x={12 + cx * sq}
                y={12 + cy * sq}
                width={sq}
                height={sq}
                fill={(cx + cy) % 2 === 0 ? '#26355c' : NAVY}
              />
            );
          })}
          <rect x={9.5} y={9.5} width={81} height={81} rx={8} fill="none" stroke={ROPE_RED} strokeWidth={3.4} />
          {[[9.5, 9.5], [90.5, 9.5], [9.5, 90.5], [90.5, 90.5]].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={5.5} fill={ROPE_RED} stroke={NAVY_DEEP} strokeWidth={1.5} />
          ))}
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// H — Red corner vs blue corner: diagonal split, Rookie on the line
function VariantH() {
  const cell = 11;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg="#b83338">
      {(p) => (
        <>
          <polygon points="100,0 100,100 0,100" fill="#2f66c4" />
          <line x1={100} y1={0} x2={0} y2={100} stroke="rgba(255,255,255,0.55)" strokeWidth={2.2} />
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// I — Champion: Rookie wearing the title belt
function VariantI() {
  const cell = 11;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const rx = (100 - rw) / 2;
  const ry = (100 - rh) / 2 - 3;
  const beltY = ry + rh - cell * 1.35;
  return (
    <Icon bg={NAVY}>
      {(p) => (
        <>
          <MatteRook x={rx} y={ry} cell={cell} prefix={p} />
          {/* belt strap + gold plate over the body row */}
          <rect x={-2} y={beltY} width={104} height={9} fill="#8f1d1d" />
          <rect x={-2} y={beltY + 1} width={104} height={1.6} fill="rgba(255,255,255,0.25)" />
          <circle cx={50} cy={beltY + 4.5} r={9.5} fill="#f0cb3a" stroke="#b8912a" strokeWidth={1.6} />
          <circle cx={50} cy={beltY + 4.5} r={5.5} fill="none" stroke="#b8912a" strokeWidth={1.2} />
          <circle cx={33} cy={beltY + 4.5} r={3.6} fill="#f0cb3a" stroke="#b8912a" strokeWidth={1} />
          <circle cx={67} cy={beltY + 4.5} r={3.6} fill="#f0cb3a" stroke="#b8912a" strokeWidth={1} />
        </>
      )}
    </Icon>
  );
}

// J — Face-off: Rookie vs a shadow king, fight-poster style
function VariantJ() {
  const cell = 7.5;
  const rh = rookH(cell);
  return (
    <Icon bg={NAVY_DEEP}>
      {(p) => (
        <>
          <polygon points="58,0 100,0 100,100 42,100" fill="#1c2846" />
          <line x1={58} y1={0} x2={42} y2={100} stroke={ROPE_RED} strokeWidth={2.4} />
          <MatteRook x={8} y={(100 - rh) / 2} cell={cell} prefix={p} />
          {/* shadow king silhouette */}
          <g fill="#0b1226">
            <polygon points="74,26 71,33 83,33 80,26" />
            <rect x={75.5} y={18} width={3} height={9} rx={1.2} />
            <rect x={72.5} y={21} width={9} height={3} rx={1.2} />
            <path d="M 70 33 Q 66 44 71 56 L 69 74 Q 69 78 73 78 L 81 78 Q 85 78 85 74 L 83 56 Q 88 44 84 33 Z" />
            <rect x={66} y={78} width={22} height={7} rx={2.5} />
          </g>
        </>
      )}
    </Icon>
  );
}

// K — On the ropes: ropes BEND around Rookie, mid-fight physics
function VariantK() {
  const cell = 11;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg={NAVY}>
      {(p) => (
        <>
          <g strokeLinecap="round" fill="none">
            <path d="M -2 30 Q 50 44 102 30" stroke={ROPE_RED} strokeWidth={4.5} />
            <path d="M -2 48 Q 50 64 102 48" stroke="#e8edf7" strokeWidth={4.5} />
            <path d="M -2 66 Q 50 84 102 66" stroke={ROPE_BLUE} strokeWidth={4.5} />
          </g>
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2 - 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// L — Between rounds: corner post + towel over the rope
function VariantL() {
  const cell = 10.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg={NAVY_DEEP}>
      {(p) => (
        <>
          <g stroke={ROPE_RED} strokeWidth={4} strokeLinecap="round">
            <line x1={8} y1={20} x2={104} y2={38} />
          </g>
          <g stroke="#e8edf7" strokeWidth={4} strokeLinecap="round">
            <line x1={8} y1={36} x2={104} y2={64} />
          </g>
          <rect x={1} y={10} width={12} height={42} rx={6} fill={ROPE_RED} />
          <rect x={3.5} y={13} width={3.5} height={36} rx={1.75} fill="rgba(255,255,255,0.3)" />
          {/* towel draped over the top rope */}
          <path d="M 68 24 L 68 12 Q 74 9 80 12 L 80 27 Q 80 31 76 31 L 72 31 Q 68 31 68 27 Z" fill="#f4f6fb" />
          <path d="M 68 24 Q 74 27 80 25" stroke="rgba(0,0,0,0.12)" strokeWidth={1.6} fill="none" />
          <MatteRook x={(100 - rw) / 2 + 4} y={(100 - rh) / 2 + 8} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// M — Knockout: comic impact burst behind Rookie
function VariantM() {
  const cell = 10.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const spikes = 12;
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 46 : 27;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    pts.push(`${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`);
  }
  return (
    <Icon bg={C_RED}>
      {(p) => (
        <>
          <polygon points={pts.join(' ')} fill="#f0cb3a" />
          <polygon points={pts.join(' ')} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={1.5} transform="scale(0.82)" transform-origin="50 50" />
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// N — Neon ring: glowing rope-square sign around Rookie, fight-night marquee
function VariantN() {
  const cell = 9.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg="#0a0f1e">
      {(p) => (
        <>
          <filter id={`${p}glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
          <rect x={11} y={11} width={78} height={78} rx={12} fill="none" stroke={ROPE_RED} strokeWidth={4} filter={`url(#${p}glow)`} opacity={0.9} />
          <rect x={11} y={11} width={78} height={78} rx={12} fill="none" stroke="#ff8a8d" strokeWidth={1.8} />
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// O — The bell: Rookie + ring bell, seconds out
function VariantO() {
  const cell = 10.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg={NAVY}>
      {(p) => (
        <>
          <MatteRook x={(100 - rw) / 2 - 8} y={(100 - rh) / 2 + 2} cell={cell} prefix={p} />
          {/* gold ring bell, top-right */}
          <g>
            <rect x={66} y={8} width={26} height={22} rx={4} fill="#f0cb3a" stroke="#b8912a" strokeWidth={1.6} />
            <circle cx={79} cy={19} r={4.5} fill="#b8912a" />
            {/* hammer */}
            <line x1={92} y1={34} x2={84} y2={26} stroke="#8a6b1f" strokeWidth={2.6} strokeLinecap="round" />
            <circle cx={94} cy={36} r={4} fill="#b8912a" />
            {/* ding lines */}
            <g stroke="#f0cb3a" strokeWidth={1.8} strokeLinecap="round">
              <line x1={60} y1={10} x2={56} y2={6} />
              <line x1={62} y1={17} x2={57} y2={16} />
            </g>
          </g>
        </>
      )}
    </Icon>
  );
}

const C_RED = '#b83338';

// ─── Round 4: variations on F (spotlight) and G (chessboard canvas) ───

// F1 — Pure spotlight: no ropes, tighter cone, brighter pool of light
function VariantF1() {
  const cell = 11;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg="#080e1d">
      {(p) => (
        <>
          <polygon points="40,-4 60,-4 82,96 18,96" fill="rgba(232,237,247,0.15)" />
          <ellipse cx={50} cy={90} rx={34} ry={9} fill="rgba(232,237,247,0.25)" />
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2 + 4} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// F2 — Crossed beams: two spotlights meeting on Rookie
function VariantF2() {
  const cell = 10.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg="#080e1d">
      {(p) => (
        <>
          <polygon points="2,-4 22,-4 78,100 34,100" fill="rgba(232,237,247,0.12)" />
          <polygon points="78,-4 98,-4 66,100 22,100" fill="rgba(232,237,247,0.12)" />
          <ellipse cx={50} cy={91} rx={30} ry={8} fill="rgba(232,237,247,0.22)" />
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2 + 5} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// F3 — Spotlight on a checkered floor: the F×G hybrid
function VariantF3() {
  const cell = 10.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const sq = 13;
  const floorY = 78;
  return (
    <Icon bg="#080e1d">
      {(p) => (
        <>
          {/* checkered floor strip */}
          {Array.from({ length: 16 }, (_, i) => {
            const cx = i % 8;
            const cy = Math.floor(i / 8);
            return (
              <rect
                key={i}
                x={-2 + cx * sq}
                y={floorY + cy * 11}
                width={sq}
                height={11}
                fill={(cx + cy) % 2 === 0 ? '#1c2846' : '#111a33'}
              />
            );
          })}
          <polygon points="39,-4 61,-4 84,100 16,100" fill="rgba(232,237,247,0.14)" />
          <ellipse cx={50} cy={floorY + 10} rx={36} ry={9} fill="rgba(232,237,247,0.18)" />
          <MatteRook x={(100 - rw) / 2} y={floorY - rh + 3} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// F4 — Big fight: spotlight + crowd silhouettes at the bottom
function VariantF4() {
  const cell = 10;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg="#080e1d">
      {(p) => (
        <>
          <polygon points="38,-4 62,-4 86,92 14,92" fill="rgba(232,237,247,0.14)" />
          <ellipse cx={50} cy={86} rx={36} ry={8} fill="rgba(232,237,247,0.18)" />
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
          {/* crowd: dark head-and-shoulder bumps along the bottom */}
          <g fill="#04070f">
            {[-4, 10, 24, 38, 52, 66, 80, 94].map((hx, i) => (
              <circle key={hx} cx={hx} cy={i % 2 === 0 ? 102 : 105} r={12} />
            ))}
          </g>
        </>
      )}
    </Icon>
  );
}

// F5 — Red light: fight-night red spotlight, everything else black
function VariantF5() {
  const cell = 11;
  const rw = rookW(cell);
  const rh = rookH(cell);
  return (
    <Icon bg="#0a0508">
      {(p) => (
        <>
          <polygon points="40,-4 60,-4 84,96 16,96" fill="rgba(229,72,77,0.22)" />
          <ellipse cx={50} cy={90} rx={35} ry={9} fill="rgba(229,72,77,0.3)" />
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2 + 4} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// G1 — Bolder board: 4×4 squares, thicker ropes, bigger Rookie
function VariantG1() {
  const cell = 9.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const sq = 76 / 4;
  return (
    <Icon bg={NAVY_DEEP}>
      {(p) => (
        <>
          {Array.from({ length: 16 }, (_, i) => {
            const cx = i % 4;
            const cy = Math.floor(i / 4);
            return (
              <rect key={i} x={12 + cx * sq} y={12 + cy * sq} width={sq} height={sq}
                fill={(cx + cy) % 2 === 0 ? '#28375f' : NAVY} />
            );
          })}
          <rect x={9} y={9} width={82} height={82} rx={9} fill="none" stroke={ROPE_RED} strokeWidth={4.5} />
          {[[9, 9], [91, 9], [9, 91], [91, 91]].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={6.5} fill={ROPE_RED} stroke={NAVY_DEEP} strokeWidth={1.8} />
          ))}
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// G2 — Zoomed in: the ring runs past the icon edges, Rookie big
function VariantG2() {
  const cell = 11.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const sq = 30;
  return (
    <Icon bg={NAVY}>
      {(p) => (
        <>
          {Array.from({ length: 16 }, (_, i) => {
            const cx = i % 4;
            const cy = Math.floor(i / 4);
            return (
              <rect key={i} x={-10 + cx * sq} y={-10 + cy * sq} width={sq} height={sq}
                fill={(cx + cy) % 2 === 0 ? '#28375f' : NAVY} />
            );
          })}
          {/* one rope corner clipping through the top-left */}
          <rect x={-30} y={-30} width={92} height={92} rx={14} fill="none" stroke={ROPE_RED} strokeWidth={5} />
          <circle cx={62} cy={-8} r={7} fill={ROPE_RED} />
          <circle cx={-8} cy={62} r={7} fill={ROPE_RED} />
          <MatteRook x={(100 - rw) / 2 + 6} y={(100 - rh) / 2 + 6} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// G3 — Diamond ring: the board ring rotated 45°
function VariantG3() {
  const cell = 8.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const sq = 64 / 4;
  return (
    <Icon bg={NAVY_DEEP}>
      {(p) => (
        <>
          <g transform="rotate(45 50 50)">
            {Array.from({ length: 16 }, (_, i) => {
              const cx = i % 4;
              const cy = Math.floor(i / 4);
              return (
                <rect key={i} x={18 + cx * sq} y={18 + cy * sq} width={sq} height={sq}
                  fill={(cx + cy) % 2 === 0 ? '#28375f' : NAVY} />
              );
            })}
            <rect x={15.5} y={15.5} width={69} height={69} rx={7} fill="none" stroke={ROPE_RED} strokeWidth={3.6} />
            {[[15.5, 15.5], [84.5, 15.5], [15.5, 84.5], [84.5, 84.5]].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={5} fill={ROPE_RED} stroke={NAVY_DEEP} strokeWidth={1.5} />
            ))}
          </g>
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// G4 — Double ropes: red outer + white inner around the board
function VariantG4() {
  const cell = 8.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const sq = 68 / 4;
  return (
    <Icon bg={NAVY_DEEP}>
      {(p) => (
        <>
          {Array.from({ length: 16 }, (_, i) => {
            const cx = i % 4;
            const cy = Math.floor(i / 4);
            return (
              <rect key={i} x={16 + cx * sq} y={16 + cy * sq} width={sq} height={sq}
                fill={(cx + cy) % 2 === 0 ? '#28375f' : NAVY} />
            );
          })}
          <rect x={8.5} y={8.5} width={83} height={83} rx={10} fill="none" stroke={ROPE_RED} strokeWidth={3.4} />
          <rect x={14} y={14} width={72} height={72} rx={7} fill="none" stroke="#e8edf7" strokeWidth={2.4} />
          {[[8.5, 8.5], [91.5, 8.5], [8.5, 91.5], [91.5, 91.5]].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={6} fill={ROPE_RED} stroke={NAVY_DEEP} strokeWidth={1.6} />
          ))}
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// G5 — Light mode: classic chesspath blue board on the app's light look
function VariantG5() {
  const cell = 8.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const sq = 76 / 4;
  return (
    <Icon bg="#eef4fd">
      {(p) => (
        <>
          {Array.from({ length: 16 }, (_, i) => {
            const cx = i % 4;
            const cy = Math.floor(i / 4);
            return (
              <rect key={i} x={12 + cx * sq} y={12 + cy * sq} width={sq} height={sq}
                fill={(cx + cy) % 2 === 0 ? '#cfe2f8' : '#eef4fd'} />
            );
          })}
          <rect x={9.5} y={9.5} width={81} height={81} rx={9} fill="none" stroke={ROPE_RED} strokeWidth={3.6} />
          {[[9.5, 9.5], [90.5, 9.5], [9.5, 90.5], [90.5, 90.5]].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={5.5} fill={ROPE_RED} stroke="#eef4fd" strokeWidth={1.5} />
          ))}
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// ─── Round 5: G1 structure locked (rook center, 4 posts, board, ropes) ───
// One parameterized ring; sweep colors / square size / rope color / corner design.

type CornerStyle = 'circle' | 'ring' | 'square' | 'diamond';

interface RingConfig {
  bg: string;          // outside the ring
  sqA: string;         // board light squares
  sqB: string;         // board dark squares
  rope: string;        // rope color
  rope2?: string;      // optional inner second rope
  grid: number;        // squares per side (2 / 4 / 8)
  corner: CornerStyle;
  cornerColor: string;
  cornerAccent?: string; // ring/bolt accent inside the pad
  cell?: number;       // rook block size
}

function RingIcon({ cfg }: { cfg: RingConfig }) {
  const cell = cfg.cell ?? 9.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const board = 76;
  const sq = board / cfg.grid;
  const corners: [number, number][] = [[9, 9], [91, 9], [9, 91], [91, 91]];
  return (
    <Icon bg={cfg.bg}>
      {(p) => (
        <>
          {Array.from({ length: cfg.grid * cfg.grid }, (_, i) => {
            const cx = i % cfg.grid;
            const cy = Math.floor(i / cfg.grid);
            return (
              <rect key={i} x={12 + cx * sq} y={12 + cy * sq} width={sq} height={sq}
                fill={(cx + cy) % 2 === 0 ? cfg.sqB : cfg.sqA} />
            );
          })}
          <rect x={9} y={9} width={82} height={82} rx={9} fill="none" stroke={cfg.rope} strokeWidth={4.5} />
          {cfg.rope2 && (
            <rect x={14.5} y={14.5} width={71} height={71} rx={6} fill="none" stroke={cfg.rope2} strokeWidth={2.6} />
          )}
          {corners.map(([cx, cy]) => {
            const key = `${cx}-${cy}`;
            switch (cfg.corner) {
              case 'ring':
                return (
                  <g key={key}>
                    <circle cx={cx} cy={cy} r={7} fill={cfg.cornerColor} stroke={cfg.bg} strokeWidth={1.8} />
                    <circle cx={cx} cy={cy} r={3.2} fill="none" stroke={cfg.cornerAccent ?? cfg.bg} strokeWidth={1.8} />
                  </g>
                );
              case 'square':
                return (
                  <g key={key}>
                    <rect x={cx - 6.5} y={cy - 6.5} width={13} height={13} rx={4} fill={cfg.cornerColor} stroke={cfg.bg} strokeWidth={1.8} />
                    {cfg.cornerAccent && <rect x={cx - 3} y={cy - 3} width={6} height={6} rx={2} fill={cfg.cornerAccent} />}
                  </g>
                );
              case 'diamond':
                return (
                  <rect key={key} x={cx - 5.5} y={cy - 5.5} width={11} height={11} rx={2.5}
                    transform={`rotate(45 ${cx} ${cy})`} fill={cfg.cornerColor} stroke={cfg.bg} strokeWidth={1.8} />
                );
              case 'circle':
              default:
                return (
                  <g key={key}>
                    <circle cx={cx} cy={cy} r={6.5} fill={cfg.cornerColor} stroke={cfg.bg} strokeWidth={1.8} />
                    {cfg.cornerAccent && <circle cx={cx} cy={cy} r={2.6} fill={cfg.cornerAccent} />}
                  </g>
                );
            }
          })}
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// ─── Round 6: the ring IS the icon — rope follows the squircle edge ───
// Concentric radii: rope rect at inset i gets rx = 22.4 - i, so it hugs the
// icon's own rounded corners instead of leaving dead space around a square.

function FullBoard({ grid, sqA, sqB }: { grid: number; sqA: string; sqB: string }) {
  const sq = 100 / grid;
  return (
    <>
      {Array.from({ length: grid * grid }, (_, i) => {
        const cx = i % grid;
        const cy = Math.floor(i / grid);
        return (
          <rect key={i} x={cx * sq} y={cy * sq} width={sq} height={sq}
            fill={(cx + cy) % 2 === 0 ? sqB : sqA} />
        );
      })}
    </>
  );
}

// Corner pad centered on the midpoint of the squircle's corner arc
function cornerArcPoints(inset: number): [number, number][] {
  const r = 22.4 - inset;
  const c = inset + r;
  const d = r * (1 - Math.SQRT1_2);
  const lo = inset + d + (r * 0.0);
  const pos = c - r * Math.SQRT1_2;
  void lo;
  return [
    [pos, pos],
    [100 - pos, pos],
    [pos, 100 - pos],
    [100 - pos, 100 - pos],
  ];
}

// X1 — Edge ring: board bleeds to the icon edge, rope hugs the squircle
function VariantX1() {
  const cell = 9.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const inset = 4.5;
  return (
    <Icon bg={NAVY_DEEP}>
      {(p) => (
        <>
          <FullBoard grid={4} sqA={NAVY} sqB="#28375f" />
          <rect x={inset} y={inset} width={100 - inset * 2} height={100 - inset * 2}
            rx={22.4 - inset} fill="none" stroke={ROPE_RED} strokeWidth={4.5} />
          {cornerArcPoints(inset).map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r={6.5} fill={ROPE_RED} stroke={NAVY_DEEP} strokeWidth={1.8} />
              <circle cx={cx} cy={cy} r={2.6} fill="#f0cb3a" />
            </g>
          ))}
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// X2 — Double edge ropes: red outer + white inner, both concentric with the icon
function VariantX2() {
  const cell = 9.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const i1 = 4;
  const i2 = 11;
  return (
    <Icon bg={NAVY_DEEP}>
      {(p) => (
        <>
          <FullBoard grid={4} sqA={NAVY} sqB="#28375f" />
          <rect x={i1} y={i1} width={100 - i1 * 2} height={100 - i1 * 2}
            rx={22.4 - i1} fill="none" stroke={ROPE_RED} strokeWidth={4.5} />
          <rect x={i2} y={i2} width={100 - i2 * 2} height={100 - i2 * 2}
            rx={22.4 - i2} fill="none" stroke="#e8edf7" strokeWidth={2.6} />
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// X3 — Quarter-pad corners: the icon's corners ARE the turnbuckle pads
function VariantX3() {
  const cell = 9.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const inset = 5;
  return (
    <Icon bg={NAVY_DEEP}>
      {(p) => (
        <>
          <FullBoard grid={4} sqA={NAVY} sqB="#28375f" />
          {/* corner pads: quarter-rounds filling each icon corner */}
          {[[0, 0, 1], [100, 0, 2], [0, 100, 4], [100, 100, 3]].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={21} fill={ROPE_RED} />
          ))}
          {[[0, 0], [100, 0], [0, 100], [100, 100]].map(([cx, cy]) => (
            <circle key={`i-${cx}-${cy}`} cx={cx} cy={cy} r={13} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2.2} />
          ))}
          <rect x={inset} y={inset} width={100 - inset * 2} height={100 - inset * 2}
            rx={22.4 - inset} fill="none" stroke={ROPE_RED} strokeWidth={4} />
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

// X4 — Bigger everything: board to the edge, no pads, fat rope, biggest Rookie
function VariantX4() {
  const cell = 10.5;
  const rw = rookW(cell);
  const rh = rookH(cell);
  const inset = 3.5;
  return (
    <Icon bg={NAVY_DEEP}>
      {(p) => (
        <>
          <FullBoard grid={4} sqA={NAVY} sqB="#28375f" />
          <rect x={inset} y={inset} width={100 - inset * 2} height={100 - inset * 2}
            rx={22.4 - inset} fill="none" stroke={ROPE_RED} strokeWidth={5.5} />
          <MatteRook x={(100 - rw) / 2} y={(100 - rh) / 2} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

const ROUND6 = [
  { name: 'X1 — Edge ring', note: 'Board bleeds to the icon edge; rope + turnbuckles ride the squircle corners. Zero dead space.', El: VariantX1 },
  { name: 'X2 — Double edge ropes', note: 'Red outer + white inner, both concentric with the icon shape. No pads.', El: VariantX2 },
  { name: 'X3 — Quarter-pad corners', note: 'The icon corners themselves become the four turnbuckle pads.', El: VariantX3 },
  { name: 'X4 — Max size', note: 'Fat rope at the very edge, no pads, biggest board + biggest Rookie.', El: VariantX4 },
];

const ROUND5: { name: string; note: string; cfg: RingConfig }[] = [
  {
    name: 'G1-1 — Baseline + gold bolts',
    note: 'The G1 you liked, corners upgraded to turnbuckles with gold bolts.',
    cfg: { bg: NAVY_DEEP, sqA: NAVY, sqB: '#28375f', rope: ROPE_RED, grid: 4, corner: 'circle', cornerColor: ROPE_RED, cornerAccent: '#f0cb3a' },
  },
  {
    name: 'G1-2 — Real board',
    note: 'Classic wood chessboard colors inside the ring. Chess side speaks louder.',
    cfg: { bg: NAVY_DEEP, sqA: '#f0d9b5', sqB: '#b58863', rope: ROPE_RED, grid: 4, corner: 'circle', cornerColor: ROPE_RED, cornerAccent: '#f0d9b5' },
  },
  {
    name: 'G1-3 — Championship gold',
    note: 'Charcoal board, gold ropes, gold ring turnbuckles. Title-fight premium.',
    cfg: { bg: '#0c0c12', sqA: '#1d1d26', sqB: '#2a2a38', rope: '#f0cb3a', grid: 4, corner: 'ring', cornerColor: '#f0cb3a', cornerAccent: '#0c0c12' },
  },
  {
    name: 'G1-4 — Red vs blue corners',
    note: 'Real boxing: 2 red + 2 blue corner pads on white ropes.',
    cfg: { bg: NAVY_DEEP, sqA: NAVY, sqB: '#28375f', rope: '#e8edf7', grid: 4, corner: 'circle', cornerColor: ROPE_RED, cornerAccent: undefined },
  },
  {
    name: 'G1-5 — Fine board (8×8)',
    note: 'A true 8×8 with subtle contrast so it texture-reads, not noise-reads.',
    cfg: { bg: NAVY_DEEP, sqA: NAVY, sqB: '#222f52', rope: ROPE_RED, grid: 8, corner: 'circle', cornerColor: ROPE_RED, cornerAccent: '#f0cb3a', cell: 10 },
  },
  {
    name: 'G1-6 — Giant squares (2×2)',
    note: 'Four huge squares — the boldest, most abstract board.',
    cfg: { bg: NAVY_DEEP, sqA: NAVY, sqB: '#2b3a63', rope: ROPE_RED, grid: 2, corner: 'diamond', cornerColor: ROPE_RED, cell: 10 },
  },
  {
    name: 'G1-7 — Blood red ring',
    note: 'Deep red outside, dark board, white ropes. Meanest of the set.',
    cfg: { bg: '#7e1d20', sqA: '#151d33', sqB: '#1f2a48', rope: '#f4f6fb', grid: 4, corner: 'square', cornerColor: '#f4f6fb', cornerAccent: '#7e1d20' },
  },
  {
    name: 'G1-8 — Double ropes + square pads',
    note: 'Red outer + white inner rope, rounded-square corner pads.',
    cfg: { bg: NAVY_DEEP, sqA: NAVY, sqB: '#28375f', rope: ROPE_RED, rope2: '#e8edf7', grid: 4, corner: 'square', cornerColor: ROPE_RED, cornerAccent: '#f0cb3a', cell: 9 },
  },
  {
    name: 'G1-9 — Chesspath blue',
    note: 'Brand-blue ropes + light board. The "sibling of the main app" take.',
    cfg: { bg: '#eef4fd', sqA: '#ffffff', sqB: '#cfe2f8', rope: '#4a90e5', grid: 4, corner: 'circle', cornerColor: '#4a90e5', cornerAccent: '#ffffff' },
  },
  {
    name: 'G1-10 — Midnight green',
    note: 'Tournament-green board (lichess energy) in a dark ring, red corners.',
    cfg: { bg: '#0d1410', sqA: '#4e7a4a', sqB: '#3a5c38', rope: '#e8edf7', grid: 4, corner: 'ring', cornerColor: ROPE_RED, cornerAccent: '#0d1410' },
  },
];

const ROUND4 = [
  { name: 'F1 — Pure spotlight', note: 'No ropes at all. Tight cone, bright pool. Cleanest F.', El: VariantF1 },
  { name: 'F2 — Crossed beams', note: 'Two spotlights meeting on Rookie. More drama, still minimal.', El: VariantF2 },
  { name: 'F3 — Spotlight on the board', note: 'F×G hybrid: checkered floor under the light.', El: VariantF3 },
  { name: 'F4 — Big fight', note: 'Crowd silhouettes along the bottom. Arena scale.', El: VariantF4 },
  { name: 'F5 — Red light', note: 'Fight-night red spotlight on black. Most intense.', El: VariantF5 },
  { name: 'G1 — Bolder board', note: '4×4 squares + thicker ropes. Reads better at 48 than the 6×6.', El: VariantG1 },
  { name: 'G2 — Zoomed in', note: 'The ring runs past the icon edges — you are IN it. Biggest Rookie.', El: VariantG2 },
  { name: 'G3 — Diamond ring', note: 'The board-ring rotated 45°, Rookie upright on top.', El: VariantG3 },
  { name: 'G4 — Double ropes', note: 'Red outer + white inner rope. Most "real boxing ring".', El: VariantG4 },
  { name: 'G5 — Light mode', note: 'Chesspath light-blue board. Matches the main app family.', El: VariantG5 },
];

const ROUND3 = [
  { name: 'F — Under the lights', note: 'Dark arena, spotlight cone on Rookie center ring. Moody, big-fight energy.', El: VariantF },
  { name: 'G — Chessboard canvas', note: 'Top-down ring where the floor IS a chessboard. The whole sport in one mark.', El: VariantG },
  { name: 'H — Red corner / blue corner', note: 'Diagonal corner-color split, Rookie standing on the line. Loudest shelf read.', El: VariantH },
  { name: 'I — The champ', note: 'Rookie wearing the title belt, gold plate center. Aspirational.', El: VariantI },
  { name: 'J — Face-off', note: 'Fight poster: Rookie vs a shadow king across the red line.', El: VariantJ },
  { name: 'K — On the ropes', note: 'The ropes BEND around Rookie — mid-fight physics, subtle at small size.', El: VariantK },
  { name: 'L — Seconds out', note: 'Corner post + towel over the rope. Quietest storytelling.', El: VariantL },
  { name: 'M — Knockout', note: 'Comic impact burst behind Rookie on red. Pure energy.', El: VariantM },
  { name: 'N — Fight night neon', note: 'Glowing neon ring-square around Rookie, marquee vibes.', El: VariantN },
  { name: 'O — The bell', note: 'Rookie + the ring bell mid-ding. Round one starts now.', El: VariantO },
];

const VARIANTS = [
  { name: 'A — Between the ropes', note: 'Three ring ropes (red / white / blue) behind Rookie. The ring reads even at 48px.', El: VariantA },
  { name: 'B — On the canvas', note: 'Rookie standing on the ring floor, ropes behind. Most "in the arena".', El: VariantB },
  { name: 'C — Corner post', note: 'Ropes converge into a red turnbuckle. Rookie in her corner between rounds.', El: VariantC },
  { name: 'D — Top-down ring', note: 'The ring from above — square rope border, corner pads, Rookie center ring.', El: VariantD },
  { name: 'E — One rope (minimal)', note: 'Just Rookie + a single red rope crossing in front. The most minimal addition.', El: VariantE },
];

const SIZES = [160, 80, 48];

// ─── C color studies: same corner-post layout, calmer palettes ───
// Rookie is the only multicolor element; ring elements go tonal.

function CornerScene({
  bg, ropes, post, postHi, cell = 11,
}: {
  bg: string; ropes: [string, string, string]; post: string; postHi: string; cell?: number;
}) {
  const rw = rookW(cell);
  const rh = rookH(cell);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  void id;
  return (
    <Icon bg={bg}>
      {(p) => (
        <>
          <g strokeWidth={4} strokeLinecap="round">
            <line x1={10} y1={16} x2={104} y2={34} stroke={ropes[0]} />
            <line x1={10} y1={30} x2={104} y2={56} stroke={ropes[1]} />
            <line x1={10} y1={44} x2={104} y2={78} stroke={ropes[2]} />
          </g>
          <rect x={2} y={8} width={13} height={44} rx={6.5} fill={post} />
          <rect x={4.5} y={11} width={4} height={38} rx={2} fill={postHi} />
          <MatteRook x={54 - rw / 2 + 8} y={(100 - rh) / 2 + 4} cell={cell} prefix={p} />
        </>
      )}
    </Icon>
  );
}

const C_STUDIES = [
  {
    name: 'C1 — Tonal',
    note: 'Everything ring-related is a shade of the navy bg. Rookie owns all the color.',
    El: () => (
      <CornerScene
        bg={NAVY_DEEP}
        ropes={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.32)', 'rgba(255,255,255,0.18)']}
        post="#33436e"
        postHi="rgba(255,255,255,0.18)"
      />
    ),
  },
  {
    name: 'C2 — One red',
    note: 'Soft white ropes, the post is the single red accent.',
    El: () => (
      <CornerScene
        bg={NAVY_DEEP}
        ropes={['rgba(240,244,251,0.75)', 'rgba(240,244,251,0.5)', 'rgba(240,244,251,0.3)']}
        post={ROPE_RED}
        postHi="rgba(255,255,255,0.3)"
      />
    ),
  },
  {
    name: 'C3 — Charcoal',
    note: 'Near-black bg, graphite ropes, deep-red post. Moodiest.',
    El: () => (
      <CornerScene
        bg="#10131c"
        ropes={['#414a5e', '#333a4d', '#272d3d']}
        post="#8f2a2e"
        postHi="rgba(255,255,255,0.18)"
      />
    ),
  },
  {
    name: 'C4 — Navy on navy',
    note: 'Classic navy bg, ropes in lighter navy steps, slate post. Quietest.',
    El: () => (
      <CornerScene
        bg={NAVY}
        ropes={['#3d5586', '#33486f', '#28395c']}
        post="#141f3a"
        postHi="rgba(255,255,255,0.12)"
      />
    ),
  },
];

const FINALISTS = [
  { name: 'G1 — Bolder board (the favorite)', note: 'Rookie center ring, 4 posts, 4×4 board, red ropes.', El: VariantG1 },
  { name: 'A — Between the ropes', note: 'Three straight ropes (red / white / blue) behind Rookie.', El: VariantA },
  { name: 'K — On the ropes', note: 'Same three ropes, but they bend around Rookie.', El: VariantK },
  { name: 'B — On the canvas', note: 'Two ropes behind, Rookie standing on the ring floor.', El: VariantB },
  { name: 'C — Corner post', note: 'Ropes coming in diagonally from a red turnbuckle corner.', El: VariantC },
  { name: 'L — Seconds out', note: 'Same diagonal ropes + a towel over the top rope.', El: VariantL },
];

export default function ChessBoxingIconPage() {
  return (
    <div className="h-full overflow-auto bg-[#0f1524] text-white">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold">Chess Boxing — app icon</h1>
        <p className="mt-1 text-sm text-white/60">
          PICKED: G1 — Rookie center ring, 4 posts, 4×4 board, red ropes.
        </p>

        <div className="mt-8 space-y-10">
          {[{ name: 'G1 — THE PICK', note: 'Rookie center ring, 4 corner posts, 4×4 chessboard canvas, red ropes.', El: VariantG1 }, ...C_STUDIES, { name: 'C (original) — for comparison', note: 'The red/white/blue version.', El: VariantC }].map(({ name, note, El }) => (
            <div key={name}>
              <h2 className="font-semibold">{name}</h2>
              <p className="text-sm text-white/50">{note}</p>
              <div className="mt-3 flex items-end gap-6">
                {SIZES.map((s) => (
                  <div key={s} style={{ width: s }}>
                    <El />
                    <div className="mt-1 text-center text-xs text-white/40">{s}px</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-lg font-bold text-white/70">G1 original (for reference)</h2>
        <div className="mt-4 space-y-10">
          {ROUND4.filter(v => v.name.startsWith('G1 ')).map(({ name, note, El }) => (
            <div key={name}>
              <h2 className="font-semibold">{name}</h2>
              <p className="text-sm text-white/50">{note}</p>
              <div className="mt-3 flex items-end gap-6">
                {SIZES.map((s) => (
                  <div key={s} style={{ width: s }}>
                    <El />
                    <div className="mt-1 text-center text-xs text-white/40">{s}px</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
