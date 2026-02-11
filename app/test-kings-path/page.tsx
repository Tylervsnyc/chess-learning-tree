'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  warmupAudio,
  playMoveSound,
  playErrorSound,
  playCelebrationSound,
  playCorrectSound,
} from '@/lib/sounds';

// ============================================================
// TYPES
// ============================================================
type PieceType = 'knight' | 'bishop' | 'rook';
type Phase = 'menu' | 'playing' | 'won' | 'lost';

interface Enemy {
  type: PieceType;
  col: number;
  row: number;
}

interface LevelDef {
  name: string;
  subtitle: string;
  size: number;
  king: [number, number];
  target: [number, number];
  enemies: Enemy[];
  revealRadius: number;
}

// ============================================================
// LEVELS (hand-crafted, no-guess guaranteed)
// ============================================================
const LEVELS: LevelDef[] = [
  // Monday 5x5: Simple intro — learn the mechanics
  // Two knights in the center. Player discovers both and navigates around their L-shapes.
  // Path: (0,4)→(1,3)→(2,2)→(1,1)→(2,0)→(3,0)→(4,0)
  {
    name: 'Monday',
    subtitle: 'First Steps',
    size: 5,
    king: [0, 4],
    target: [4, 0],
    enemies: [
      { type: 'knight', col: 3, row: 3 },   // mid-board, discovered early
      { type: 'knight', col: 3, row: 1 },   // guards target approach
    ],
    revealRadius: 2,
  },

  // Wednesday 6x6: THE BISHOP GATE
  // Bishop at (1,3) has a long NE diagonal that seems to block the target approach.
  // But knight at (2,2) sits ON that diagonal and BLOCKS it!
  // Squares (3,1) and (4,0) become safe — the only approach to the target.
  // Knight (3,0) attacks (5,1) forcing the player to use the gate at (4,0).
  // AHA: "The bishop's diagonal looks deadly, but the knight breaks the line!"
  {
    name: 'Wednesday',
    subtitle: 'The Bishop Gate',
    size: 6,
    king: [0, 5],
    target: [5, 0],
    enemies: [
      { type: 'bishop', col: 1, row: 3 },   // long NE diagonal toward target
      { type: 'knight', col: 2, row: 2 },   // BLOCKS bishop's NE diagonal!
      { type: 'knight', col: 4, row: 4 },   // mid-board hazard
      { type: 'knight', col: 3, row: 0 },   // attacks (5,1), forces gate approach
    ],
    revealRadius: 2,
  },

  // Saturday 7x7: THE ROOK TUNNEL
  // Rook at (3,3) controls ALL of row 3 + col 3 — looks like an impassable cross.
  // But knight at (5,3) sits on row 3 and BLOCKS the rook's rightward attack!
  // Square (6,3) is safe — the tunnel through the wall.
  // Bishop (3,5) blocks the rook's column downward so (3,6) is safe too.
  // AHA: "The rook blocks everything... wait, the knight breaks the row! I can cross at (6,3)!"
  {
    name: 'Saturday',
    subtitle: 'The Rook Tunnel',
    size: 7,
    king: [0, 6],
    target: [6, 0],
    enemies: [
      { type: 'rook', col: 3, row: 3 },     // THE WALL — row 3 + col 3
      { type: 'knight', col: 5, row: 3 },   // BLOCKS rook row 3 right → (6,3) safe!
      { type: 'bishop', col: 3, row: 5 },   // blocks rook col 3 down → (3,6) safe
      { type: 'knight', col: 6, row: 1 },   // guards target area
      { type: 'bishop', col: 1, row: 1 },   // guards top-left approach
    ],
    revealRadius: 2,
  },

  // Sunday 8x8: THE GAUNTLET — rook tunnel + forced routing
  // Bishop (1,5) blocks the left column (attacks (0,4),(0,6)) — can't hug the edge!
  // Rook (4,4) creates a massive row 4 + col 4 cross barrier.
  // Knight (6,4) blocks rook row 4 right → (7,4) safe. THE ROOK TUNNEL!
  // Bishop (4,6) blocks rook col 4 down — second blocking interaction.
  // Player MUST go south, around the bishop, through the tunnel, then up to target.
  // Path: (0,7)→(1,6)→(2,5)→(3,6)→(4,7)→(5,6)→(6,5)→(7,4)→(6,3)→(6,2)→(7,1)→(7,0)
  {
    name: 'Sunday',
    subtitle: 'The Gauntlet',
    size: 8,
    king: [0, 7],
    target: [7, 0],
    enemies: [
      { type: 'rook', col: 4, row: 4 },     // THE WALL — row 4 + col 4 cross
      { type: 'knight', col: 6, row: 4 },   // BLOCKS rook row 4 right → (7,4) safe!
      { type: 'bishop', col: 4, row: 6 },   // blocks rook col 4 down
      { type: 'bishop', col: 2, row: 2 },   // diagonal barrier, guards northern approach
      { type: 'bishop', col: 1, row: 5 },   // blocks left column — forces right-side routing
      { type: 'knight', col: 6, row: 1 },   // guards target area
    ],
    revealRadius: 2,
  },
];

// ============================================================
// CHESS ATTACK LOGIC
// ============================================================
function onBoard(c: number, r: number, size: number) {
  return c >= 0 && c < size && r >= 0 && r < size;
}

function attackedBy(enemy: Enemy, size: number, allEnemies: Enemy[]): string[] {
  const out: string[] = [];
  const { type, col, row } = enemy;

  if (type === 'knight') {
    for (const [dc, dr] of [
      [1, 2], [1, -2], [-1, 2], [-1, -2],
      [2, 1], [2, -1], [-2, 1], [-2, -1],
    ]) {
      const nc = col + dc, nr = row + dr;
      if (onBoard(nc, nr, size)) out.push(`${nc},${nr}`);
    }
  } else {
    // bishop or rook — sliding pieces
    const dirs =
      type === 'bishop'
        ? [[1, 1], [1, -1], [-1, 1], [-1, -1]]
        : [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dc, dr] of dirs) {
      for (let i = 1; i < size; i++) {
        const nc = col + dc * i, nr = row + dr * i;
        if (!onBoard(nc, nr, size)) break;
        out.push(`${nc},${nr}`);
        // blocked by another piece
        if (allEnemies.some((e) => e !== enemy && e.col === nc && e.row === nr))
          break;
      }
    }
  }
  return out;
}

function buildAttackMap(enemies: Enemy[], size: number) {
  const map = new Map<string, Enemy[]>();
  for (const e of enemies) {
    for (const sq of attackedBy(e, size, enemies)) {
      if (!map.has(sq)) map.set(sq, []);
      map.get(sq)!.push(e);
    }
  }
  return map;
}

function revealSet(positions: [number, number][], radius: number, size: number) {
  const set = new Set<string>();
  for (const [kc, kr] of positions) {
    for (let c = Math.max(0, kc - radius); c <= Math.min(size - 1, kc + radius); c++) {
      for (let r = Math.max(0, kr - radius); r <= Math.min(size - 1, kr + radius); r++) {
        set.add(`${c},${r}`);
      }
    }
  }
  return set;
}

// ============================================================
// LEVEL VALIDATOR (dev/debug only)
// ============================================================
interface ValidatorResult {
  solvable: boolean;
  path: [number, number][] | null;
  reason?: string;
  pathLength?: number;
  enemiesEncountered?: string[];
}

function validateLevel(level: LevelDef): ValidatorResult {
  const { size, king, target, enemies, revealRadius } = level;
  const numEnemies = enemies.length;

  // Pre-check: no two pieces on the same square
  const occupied = new Set<string>();
  for (const e of enemies) {
    const k = `${e.col},${e.row}`;
    if (occupied.has(k)) return { solvable: false, path: null, reason: `Two enemies on same square ${k}` };
    occupied.add(k);
  }
  if (occupied.has(`${king[0]},${king[1]}`))
    return { solvable: false, path: null, reason: 'King starts on an enemy square' };
  if (occupied.has(`${target[0]},${target[1]}`))
    return { solvable: false, path: null, reason: 'Target is occupied by an enemy' };

  // Pre-check: target must not be attacked by ANY piece (visible or not)
  const fullAttackMap = buildAttackMap(enemies, size);
  const targetKey = `${target[0]},${target[1]}`;
  if (fullAttackMap.has(targetKey) && fullAttackMap.get(targetKey)!.length > 0)
    return { solvable: false, path: null, reason: `Target square is attacked by: ${fullAttackMap.get(targetKey)!.map(e => `${e.type}@(${e.col},${e.row})`).join(', ')}` };

  // Compute which enemies are revealed by being within revealRadius of a position
  function enemyBitmaskAt(col: number, row: number): number {
    let mask = 0;
    for (let i = 0; i < numEnemies; i++) {
      const e = enemies[i];
      if (Math.max(Math.abs(col - e.col), Math.abs(row - e.row)) <= revealRadius) {
        mask |= (1 << i);
      }
    }
    return mask;
  }

  // Compute attacked squares from a set of visible enemies (given by bitmask)
  function attackedSquaresForMask(mask: number): Set<string> {
    const visibleEnemies = enemies.filter((_, i) => mask & (1 << i));
    const attacked = new Set<string>();
    for (const e of visibleEnemies) {
      for (const sq of attackedBy(e, size, visibleEnemies)) {
        attacked.add(sq);
      }
    }
    return attacked;
  }

  // Pre-check: king start must not be attacked by initially-visible enemies
  const initialMask = enemyBitmaskAt(king[0], king[1]);
  const initialAttacked = attackedSquaresForMask(initialMask);
  if (initialAttacked.has(`${king[0]},${king[1]}`))
    return { solvable: false, path: null, reason: 'King start position is attacked by initially-visible enemies' };

  // BFS: state = (col, row, revealedEnemyBitmask)
  // State key = `col,row,mask`
  const startMask = initialMask;
  const startKey = `${king[0]},${king[1]},${startMask}`;

  const visited = new Set<string>([startKey]);
  const queue: { col: number; row: number; mask: number; path: [number, number][] }[] = [
    { col: king[0], row: king[1], mask: startMask, path: [king] },
  ];

  // Cache attacked squares per mask to avoid recomputing
  const attackCache = new Map<number, Set<string>>();
  function getAttacked(mask: number): Set<string> {
    if (!attackCache.has(mask)) {
      attackCache.set(mask, attackedSquaresForMask(mask));
    }
    return attackCache.get(mask)!;
  }

  let statesExplored = 0;

  while (queue.length > 0) {
    const { col, row, mask, path: curPath } = queue.shift()!;
    statesExplored++;

    // Try all 8 king moves
    for (let dc = -1; dc <= 1; dc++) {
      for (let dr = -1; dr <= 1; dr++) {
        if (dc === 0 && dr === 0) continue;
        const nc = col + dc;
        const nr = row + dr;
        if (!onBoard(nc, nr, size)) continue;

        // Can't move onto enemy squares
        if (enemies.some(e => e.col === nc && e.row === nr)) continue;

        // Check if this square is attacked by currently-visible enemies (BEFORE move reveals new ones)
        const currentAttacked = getAttacked(mask);
        if (currentAttacked.has(`${nc},${nr}`)) continue;

        // Compute new mask after moving to (nc, nr) — reveals new enemies
        const newMask = mask | enemyBitmaskAt(nc, nr);
        const stateKey = `${nc},${nr},${newMask}`;

        if (visited.has(stateKey)) continue;
        visited.add(stateKey);

        const newPath: [number, number][] = [...curPath, [nc, nr]];

        // Check win
        if (nc === target[0] && nr === target[1]) {
          // Collect which enemies were encountered (revealed) along the path
          const encounteredEnemies = enemies
            .filter((_, i) => newMask & (1 << i))
            .map(e => `${e.type}@(${e.col},${e.row})`);

          return {
            solvable: true,
            path: newPath,
            pathLength: newPath.length - 1,
            enemiesEncountered: encounteredEnemies,
          };
        }

        queue.push({ col: nc, row: nr, mask: newMask, path: newPath });
      }
    }
  }

  return {
    solvable: false,
    path: null,
    reason: `No safe path found after exploring ${statesExplored} states. All paths are blocked by enemy attacks.`,
  };
}

// ============================================================
// PIECE SVGs (Lichess set)
// ============================================================
const PIECE_SVGS = {
  king: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`,
  knight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#fff" stroke="#fff"/><path d="M24.55 10.4l-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34-2.37-4.49-5.79-6.64-9.19-7.16l-.51-.1z" fill="#fff" stroke="none"/></g></svg>`,
  bishop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" stroke-linejoin="miter"/></g></svg>`,
  rook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z" stroke-linecap="butt"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt"/><path d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23" fill="none" stroke="#fff" stroke-width="1" stroke-linejoin="miter"/></g></svg>`,
  targetRook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" fill="none" stroke-linejoin="miter"/></g></svg>`,
} as const;

type PieceSvgType = keyof typeof PIECE_SVGS;

function PieceSvg({ type, size, className, style }: {
  type: PieceSvgType;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{ width: size, height: size, ...style }}
      dangerouslySetInnerHTML={{ __html: PIECE_SVGS[type] }}
    />
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function KingsPathPage() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('menu');
  const [kingPos, setKingPos] = useState<[number, number]>([0, 0]);
  const [path, setPath] = useState<[number, number][]>([]);
  const [lives, setLives] = useState(3);
  const [moves, setMoves] = useState(0);
  const [hitKey, setHitKey] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [hitEnemies, setHitEnemies] = useState<Set<string>>(new Set());
  const [audioReady, setAudioReady] = useState(false);

  const level = LEVELS[levelIdx];

  const revealed = useMemo(() => {
    const s = revealSet(path, level.revealRadius, level.size);
    for (const k of hitEnemies) s.add(k);
    return s;
  }, [path, level, hitEnemies]);

  const visibleEnemies = useMemo(
    () => level.enemies.filter((e) => revealed.has(`${e.col},${e.row}`)),
    [level.enemies, revealed],
  );

  // Attack map from ONLY currently visible enemies — used for damage checks
  const visibleAttackMap = useMemo(
    () => buildAttackMap(visibleEnemies, level.size),
    [visibleEnemies, level.size],
  );

  const validMoves = useMemo(() => {
    if (phase !== 'playing') return [] as [number, number][];
    const [kc, kr] = kingPos;
    const out: [number, number][] = [];
    for (let dc = -1; dc <= 1; dc++) {
      for (let dr = -1; dr <= 1; dr++) {
        if (!dc && !dr) continue;
        const nc = kc + dc, nr = kr + dr;
        if (!onBoard(nc, nr, level.size)) continue;
        if (level.enemies.some((e) => e.col === nc && e.row === nr)) continue;
        out.push([nc, nr]);
      }
    }
    return out;
  }, [phase, kingPos, level]);

  // --------------------------------------------------------
  // ACTIONS
  // --------------------------------------------------------
  const ensureAudio = useCallback(() => {
    if (!audioReady) {
      warmupAudio();
      setAudioReady(true);
    }
  }, [audioReady]);

  useEffect(() => {
    if (phase === 'playing') {
      const result = validateLevel(level);
      if (result.solvable) {
        console.log(`[Kings Path] Level "${level.name}" is solvable in ${result.pathLength} moves`);
      } else {
        console.warn(`[Kings Path] WARNING: Level "${level.name}" is NOT solvable! Reason: ${result.reason}`);
      }
    }
  }, [phase, level]);

  const startGame = useCallback(
    (idx: number) => {
      ensureAudio();
      const lvl = LEVELS[idx];
      setLevelIdx(idx);
      setKingPos(lvl.king);
      setPath([lvl.king]);
      setLives(3);
      setMoves(0);
      setHitKey(null);
      setShaking(false);
      setHitEnemies(new Set());
      setPhase('playing');
    },
    [ensureAudio],
  );

  const moveKing = useCallback(
    (col: number, row: number) => {
      if (phase !== 'playing') return;
      if (!validMoves.some(([c, r]) => c === col && r === row)) return;

      // Check attacks from VISIBLE enemies BEFORE the move reveals new squares.
      // Only pieces the player can already see can hurt them — no guessing.
      const key = `${col},${row}`;
      const visibleAttackers = visibleAttackMap.get(key);
      const isAttacked = visibleAttackers && visibleAttackers.length > 0;

      const pos: [number, number] = [col, row];
      setKingPos(pos);
      setPath((p) => [...p, pos]);
      setMoves((m) => m + 1);

      // Win
      if (col === level.target[0] && row === level.target[1]) {
        playCelebrationSound();
        setPhase('won');
        return;
      }

      // Damage from visible attackers only
      if (isAttacked) {
        const newLives = lives - 1;
        setLives(newLives);
        setHitKey(key);
        setShaking(true);
        playErrorSound();

        const next = new Set(hitEnemies);
        visibleAttackers.forEach((a) => next.add(`${a.col},${a.row}`));
        setHitEnemies(next);

        setTimeout(() => {
          setHitKey(null);
          setShaking(false);
        }, 500);

        if (newLives <= 0) {
          setTimeout(() => setPhase('lost'), 700);
        }
      } else {
        playMoveSound();
        playCorrectSound(moves);
      }
    },
    [phase, validMoves, level, visibleAttackMap, lives, hitEnemies, moves],
  );

  // --------------------------------------------------------
  // COMPUTED SQUARE SIZE
  // --------------------------------------------------------
  const sqPx = Math.floor(Math.min(64, (340 - 4) / level.size));

  // --------------------------------------------------------
  // RENDER: MENU
  // --------------------------------------------------------
  if (phase === 'menu') {
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-lg mx-auto w-full px-4 py-6 flex flex-col items-center gap-6">
          {/* Title */}
          <div className="text-center mt-4">
            <div className="inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 mb-3">
              <h1 className="text-2xl font-black text-white tracking-wider">
                THE KING&apos;S PATH
              </h1>
            </div>
            <p className="text-chess-text-muted text-sm italic font-semibold">
              Guide your King through the fog. Reach the Golden Rook.
            </p>
          </div>

          {/* How to play */}
          <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-5 w-full">
            <h2 className="font-bold text-chess-text mb-3">How to Play</h2>
            <div className="space-y-2 text-sm text-chess-text-muted">
              <div className="flex items-center gap-2">
                <PieceSvg type="king" size={24} className="shrink-0" />
                <span>Tap an adjacent square to move your King</span>
              </div>
              <div className="flex items-center gap-2">
                <PieceSvg type="targetRook" size={24} className="shrink-0" style={{ filter: 'sepia(1) saturate(5) hue-rotate(10deg) brightness(1.1)' }} />
                <span>Reach the <span className="text-amber-500 font-bold">Golden Rook</span> to win</span>
              </div>
              <div className="flex items-center gap-2">
                <PieceSvg type="knight" size={24} className="shrink-0" />
                <span>Enemy pieces hide in the fog — avoid their attacks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg shrink-0 w-6 text-center">{'\u2665'}</span>
                <span>3 lives — step on an attacked square and you lose one</span>
              </div>
            </div>
          </div>

          {/* Levels */}
          <div className="w-full space-y-3">
            {LEVELS.map((lvl, i) => (
              <button
                key={i}
                onClick={() => startGame(i)}
                className="w-full bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 text-left
                           hover:border-amber-400 hover:shadow-md active:scale-[0.98] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-chess-text-faint uppercase tracking-wider">
                      {lvl.name}
                    </span>
                    <h3 className="font-bold text-chess-text">{lvl.subtitle}</h3>
                  </div>
                  <div className="text-right text-xs text-chess-text-faint">
                    <div>
                      {lvl.size}x{lvl.size}
                    </div>
                    <div>
                      {lvl.enemies.length} piece{lvl.enemies.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // RENDER: WON
  // --------------------------------------------------------
  if (phase === 'won') {
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-lg mx-auto w-full px-4 flex flex-col items-center justify-center min-h-full gap-5">
          {/* Gold rook */}
          <div className="relative">
            <PieceSvg
              type="targetRook"
              size={96}
              style={{
                filter: 'sepia(1) saturate(5) hue-rotate(10deg) brightness(1.1) drop-shadow(0 0 20px rgba(255,215,0,0.6))',
              }}
            />
          </div>

          <h1 className="text-2xl font-black text-chess-text">PATH FOUND!</h1>
          <p className="text-chess-text-muted text-sm italic">
            The King reaches the Golden Rook.
          </p>

          {/* Stats */}
          <div className="flex gap-3">
            <div className="bg-chess-surface rounded-xl border border-slate-200 px-5 py-3 text-center">
              <div className="text-2xl font-black text-chess-text">{moves}</div>
              <div className="text-xs text-chess-text-faint">Moves</div>
            </div>
            <div className="bg-chess-surface rounded-xl border border-slate-200 px-5 py-3 text-center">
              <div className="text-2xl font-black flex gap-0.5 justify-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={i < lives ? 'text-red-500' : 'text-slate-300'}
                  >
                    {'\u2665'}
                  </span>
                ))}
              </div>
              <div className="text-xs text-chess-text-faint">Lives</div>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-chess-surface rounded-xl border border-slate-200 px-5 py-2 text-center">
            <span className="text-sm font-bold" style={{ color: '#FFD700' }}>
              {lives === 3
                ? 'Perfect — Zero mistakes!'
                : lives === 2
                  ? 'Great path — barely scratched!'
                  : 'Made it through — just barely!'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            {levelIdx < LEVELS.length - 1 && (
              <button
                onClick={() => startGame(levelIdx + 1)}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-chess-green
                           shadow-[0_4px_0_#3d8c01] active:translate-y-[2px] active:shadow-[0_2px_0_#3d8c01]"
              >
                Next Level
              </button>
            )}
            <button
              onClick={() => startGame(levelIdx)}
              className="flex-1 py-3 rounded-xl font-bold text-chess-text bg-chess-surface
                         border border-slate-200 shadow-sm active:scale-[0.98]"
            >
              Replay
            </button>
          </div>
          <button
            onClick={() => setPhase('menu')}
            className="text-sm text-chess-text-muted underline"
          >
            Back to menu
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // RENDER: LOST
  // --------------------------------------------------------
  if (phase === 'lost') {
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <div className="max-w-lg mx-auto w-full px-4 flex flex-col items-center justify-center min-h-full gap-5">
          <PieceSvg type="king" size={72} />
          <h1 className="text-2xl font-black text-chess-text">PATH BLOCKED</h1>
          <p className="text-chess-text-muted text-sm italic">
            The King fell to the enemy pieces.
          </p>
          <button
            onClick={() => startGame(levelIdx)}
            className="py-3 px-8 rounded-xl font-bold text-white bg-chess-green
                       shadow-[0_4px_0_#3d8c01] active:translate-y-[2px] active:shadow-[0_2px_0_#3d8c01]"
          >
            Try Again
          </button>
          <button
            onClick={() => setPhase('menu')}
            className="text-sm text-chess-text-muted underline"
          >
            Back to menu
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // RENDER: PLAYING
  // --------------------------------------------------------
  const boardPx = sqPx * level.size;

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-lg mx-auto w-full px-4 py-3 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-1">
          <div className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500">
            <span className="text-sm font-black text-white tracking-wider">
              THE KING&apos;S PATH
            </span>
          </div>
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`text-xl transition-all duration-300 ${i < lives ? 'text-red-500 scale-100' : 'text-slate-300 scale-90'}`}
              >
                {'\u2665'}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full flex items-center justify-between mb-3">
          <span className="text-xs text-chess-text-muted">
            {level.name} — {level.subtitle}
          </span>
          <span className="text-xs text-chess-text-muted">{moves} moves</span>
        </div>

        {/* Board */}
        <div
          className="relative rounded-lg overflow-hidden shadow-xl"
          style={{
            width: boardPx,
            height: boardPx,
            animation: shaking ? 'kp-shake 0.4s ease-out' : undefined,
          }}
        >
          {Array.from({ length: level.size }, (_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: level.size }, (_, col) => {
                const key = `${col},${row}`;
                const isRevealed = revealed.has(key);
                const isLight = (col + row) % 2 === 0;
                const isKing = kingPos[0] === col && kingPos[1] === row;
                const isTarget =
                  level.target[0] === col && level.target[1] === row;
                const isOnPath = path.some(([c, r]) => c === col && r === row);
                const isValid = validMoves.some(
                  ([c, r]) => c === col && r === row,
                );
                const enemy = visibleEnemies.find(
                  (e) => e.col === col && e.row === row,
                );
                const isHit = hitKey === key;

                // Colors
                let bg: string;
                if (isHit) {
                  bg = '#ef4444'; // red flash
                } else if (isRevealed) {
                  bg = isLight ? '#edeed1' : '#779952';
                } else {
                  bg = isLight ? '#2a3a4a' : '#1e2e3e';
                }

                // Path overlay
                const pathOverlay =
                  isOnPath && isRevealed && !isKing
                    ? 'rgba(255, 215, 0, 0.15)'
                    : undefined;

                return (
                  <div
                    key={key}
                    onClick={() => moveKing(col, row)}
                    className={`relative flex items-center justify-center select-none
                      ${isValid ? 'cursor-pointer' : ''}
                    `}
                    style={{
                      width: sqPx,
                      height: sqPx,
                      backgroundColor: bg,
                      transition: 'background-color 0.4s ease-out',
                      boxShadow: !isRevealed
                        ? 'inset 0 0 0 1px rgba(255,255,255,0.04)'
                        : undefined,
                    }}
                  >
                    {/* Path overlay */}
                    {pathOverlay && (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: pathOverlay }}
                      />
                    )}

                    {/* Target rook — always visible as beacon */}
                    {isTarget && !isKing && (
                      <PieceSvg
                        type="targetRook"
                        size={sqPx * 0.75}
                        className="relative z-[2]"
                        style={{
                          filter: `sepia(1) saturate(5) hue-rotate(10deg) brightness(1.1) ${
                            isRevealed
                              ? 'drop-shadow(0 0 8px rgba(255,215,0,0.7))'
                              : 'drop-shadow(0 0 12px rgba(255,215,0,0.5))'
                          }`,
                          opacity: isRevealed ? 1 : 0.7,
                          animation: 'kp-gold-pulse 2s ease-in-out infinite',
                        }}
                      />
                    )}

                    {/* Enemy piece */}
                    {enemy && !isKing && !isTarget && (
                      <PieceSvg
                        type={enemy.type}
                        size={sqPx * 0.75}
                        className="relative z-[2]"
                        style={{
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                          animation: 'kp-piece-appear 0.4s ease-out',
                        }}
                      />
                    )}

                    {/* King */}
                    {isKing && (
                      <PieceSvg
                        type="king"
                        size={sqPx * 0.75}
                        className="relative z-[3]"
                        style={{
                          filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5)) drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                        }}
                      />
                    )}

                    {/* Valid move dot */}
                    {isValid && !isKing && !isTarget && !enemy && (
                      <div
                        className="relative z-[1] rounded-full"
                        style={{
                          width: sqPx * 0.22,
                          height: sqPx * 0.22,
                          backgroundColor: isRevealed
                            ? 'rgba(0,0,0,0.18)'
                            : 'rgba(255,255,255,0.15)',
                        }}
                      />
                    )}

                    {/* Valid move ring on target */}
                    {isValid && isTarget && (
                      <div
                        className="absolute inset-1 rounded-sm border-2 z-[1]"
                        style={{ borderColor: 'rgba(255,215,0,0.5)' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Piece legend */}
        <div className="mt-4 flex gap-3 flex-wrap justify-center">
          {visibleEnemies.map((e, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-chess-surface rounded-lg border border-slate-200 px-3 py-1.5"
            >
              <PieceSvg type={e.type} size={22} />
              <span className="text-xs text-chess-text-muted capitalize">
                {e.type}
              </span>
            </div>
          ))}
          {visibleEnemies.length === 0 && (
            <span className="text-xs text-chess-text-faint italic">
              No enemies revealed yet — explore carefully
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => startGame(levelIdx)}
            className="px-4 py-2 rounded-xl text-sm font-bold text-chess-text bg-chess-surface
                       border border-slate-200 shadow-sm active:scale-[0.98] transition-all"
          >
            Reset
          </button>
          <button
            onClick={() => setPhase('menu')}
            className="px-4 py-2 rounded-xl text-sm font-bold text-chess-text-muted
                       active:scale-[0.98] transition-all"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes kp-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(2px); }
        }
        @keyframes kp-gold-pulse {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(255,215,0,0.4)); }
          50% { filter: drop-shadow(0 0 14px rgba(255,215,0,0.9)); }
        }
        @keyframes kp-piece-appear {
          from { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
