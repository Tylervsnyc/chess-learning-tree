/**
 * Fight Night share-card design data — shared between the satori card
 * (lib/og/fight-night.tsx, server) and the on-device canvas GIF renderer
 * (lib/share/fight-night-gif.ts, client). No JSX, no piece sprites here.
 * All coordinates are in the 300x533 design space.
 */

export type FightNightFrame = {
  /** FEN (board field is all that's read). */
  fen: string;
  /** Last move squares to highlight, e.g. "h5f7". */
  last?: string;
  /** Show the CHECKMATE stamp over the board. */
  stamp?: boolean;
};

export type FightNightBout = {
  outcome: string;
  username: string;
  moves: number;
  rounds: number;
  /** Formatted clock, e.g. "1:24". */
  clock: string;
  /** Override the outcome headline (workout share: "SOLVED a 1650 puzzle"). */
  headline?: { big: string; rest: string; win: boolean };
  /** Override the 3 stat tiles ([value, LABEL]); default = moves/round/clock. */
  stats?: [string, string][];
  /** Stamp word over the final frame (default CHECKMATE). */
  stampText?: string;
};

/** FEN letter -> piece code (uppercase = white). */
export function pieceCode(ch: string): string {
  return (ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase();
}

export function parseBoard(fen: string): (string | null)[][] {
  const field = (fen || '').trim().split(/\s+/)[0] || '8/8/8/8/8/8/8/8';
  const rows = field.split('/').slice(0, 8);
  return rows.map((row) => {
    const out: (string | null)[] = [];
    for (const ch of row) {
      if (/[1-8]/.test(ch)) {
        for (let i = 0; i < Number(ch); i++) out.push(null);
      } else if (/[prnbqkPRNBQK]/.test(ch)) {
        out.push(ch);
      }
      if (out.length >= 8) break;
    }
    while (out.length < 8) out.push(null);
    return out;
  });
}

/** "h5f7" -> Set of square names to highlight. */
export function lastSquares(last?: string): Set<string> {
  const out = new Set<string>();
  if (last && /^[a-h][1-8][a-h][1-8]$/.test(last)) {
    out.add(last.slice(0, 2));
    out.add(last.slice(2, 4));
  }
  return out;
}

/* ── outcome copy: gold word + white rest ── */
export const HEADLINES: Record<string, { big: string; rest: string; win: boolean }> = {
  ko_win: { big: 'KO', rest: 'by checkmate', win: true },
  ko_loss: { big: 'KO', rest: 'Rookie mates me', win: false },
  flag_loss: { big: 'LOSS', rest: 'on time', win: false },
  decision_win: { big: 'WIN', rest: 'on the board', win: true },
  decision_loss: { big: 'LOSS', rest: 'on the decision', win: false },
  draw: { big: 'DRAW', rest: 'at the final bell', win: false },
};

/* Crowd: components/chessboxing/Arena.tsx CROWD_ROWS scaled from its
   390-wide viewBox into the 300-wide design space (x0.77) — same terraces,
   same fills, same jitter, so the card's house matches the box homepage. */
export const CROWD_ROWS = [
  { y: 7.7, r: 2.3, sp: 10.0, off: 0, fill: '#121b30', op: 0.6 },
  { y: 18.5, r: 2.6, sp: 10.8, off: 5.4, fill: '#121b30', op: 0.62 },
  { y: 30.8, r: 2.9, sp: 11.6, off: 2.3, fill: '#111a2e', op: 0.65 },
  { y: 43.9, r: 3.3, sp: 13.1, off: 6.9, fill: '#111a2e', op: 0.68 },
  { y: 57.8, r: 3.7, sp: 13.9, off: 3.9, fill: '#101828', op: 0.7 },
  { y: 72.4, r: 4.2, sp: 15.4, off: 8.5, fill: '#101828', op: 0.72 },
  { y: 87.8, r: 4.6, sp: 16.9, off: 3.1, fill: '#0e1526', op: 0.78 },
  { y: 104.0, r: 5.4, sp: 18.5, off: 9.2, fill: '#0e1526', op: 0.85 },
  { y: 121.7, r: 6.9, sp: 20.8, off: 4.6, fill: '#0a101f', op: 1 },
];

/** Head jitter, same formula everywhere so DOM/satori/canvas crowds match. */
export function crowdJitter(i: number, ri: number): { dx: number; dy: number } {
  return {
    dx: (((i + ri) % 3) - 1) * 1.6,
    dy: (((i * 2 + ri) % 4) - 1.5) * 1.3,
  };
}

/** Flashbulb positions (design-space coords), spread across the terraces.
    A rotating handful fire every tick; the knockout adds a scattered flurry
    on top of the whole pool. */
export const FLASHES = [
  { x: 17, y: 12 }, { x: 37, y: 46 }, { x: 55, y: 88 }, { x: 71, y: 8 },
  { x: 86, y: 30 }, { x: 98, y: 58 }, { x: 112, y: 104 }, { x: 129, y: 24 },
  { x: 143, y: 70 }, { x: 157, y: 96 }, { x: 168, y: 42 }, { x: 180, y: 14 },
  { x: 195, y: 82 }, { x: 201, y: 62 }, { x: 214, y: 108 }, { x: 226, y: 34 },
  { x: 241, y: 8 }, { x: 254, y: 90 }, { x: 271, y: 16 }, { x: 289, y: 50 },
];

/** Extra knockout-only bulbs: a deterministic scatter that reshuffles every
    tick so the flurry crackles while the stamp holds. */
export function burstFlashes(seed: number): { x: number; y: number; size: number }[] {
  const out: { x: number; y: number; size: number }[] = [];
  for (let k = 0; k < 18; k++) {
    out.push({
      x: ((k * 67 + seed * 31) % 288) + 6,
      y: ((k * 43 + seed * 17) % 118) + 6,
      size: 5 + ((k + seed) % 4),
    });
  }
  return out;
}

/** The bulbs firing on a given tick (positions + design-space size). */
export function tickFlashes(seed: number, lit: boolean): { x: number; y: number; size: number }[] {
  return [
    ...FLASHES.filter((_, i) => lit || (i + seed) % 3 === 0).map((f, i) => ({
      ...f,
      size: lit ? 8 + ((i + seed) % 3) : 6 + ((i + seed) % 2),
    })),
    ...(lit ? burstFlashes(seed) : []),
  ];
}

/** GIF timing: each board state holds through several short flash ticks. */
export const MOVE_TICKS = 3;
export const MOVE_TICK_MS = 370;
export const END_TICKS = 5;
export const END_TICK_MS = 520;

export function fmtClock(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}
