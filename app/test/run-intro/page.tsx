'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { defaultPieces } from 'react-chessboard';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { RookieCell } from '@/components/run/RookieCell';

/**
 * /test/run-intro — playground for round-start animations.
 *
 * The BLACK PIECES are the stars here. Each option shows a different
 * dramatic, movement-heavy entrance for the opposition. Rookie's
 * slot-machine reel is the same on every card (a soft fade-and-bounce
 * onto a random rank-1 square) so the focus is the enemy animation.
 *
 * Whole intro = 1 second.
 */

type Square = string;
interface Enemy { sq: Square; type: 'pawn' | 'knight' | 'bishop' | 'queen' }

const ENEMY_SPRITE: Record<Enemy['type'], keyof typeof defaultPieces> = {
  pawn: 'bP', knight: 'bN', bishop: 'bB', queen: 'bQ',
};

const SAMPLE_ENEMIES: Enemy[] = [
  { sq: 'a4', type: 'pawn' },   { sq: 'b4', type: 'pawn' },
  { sq: 'c5', type: 'knight' }, { sq: 'd4', type: 'pawn' },
  { sq: 'e4', type: 'pawn' },   { sq: 'f5', type: 'bishop' },
  { sq: 'g4', type: 'pawn' },   { sq: 'h4', type: 'pawn' },
  { sq: 'c6', type: 'pawn' },   { sq: 'f6', type: 'knight' },
];
const SAMPLE_HAZARDS: Square[] = ['d3', 'e3'];

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
function randomStart(): Square {
  return FILES[Math.floor(Math.random() * 8)] + '1';
}
function fileIdx(sq: Square): number { return sq.charCodeAt(0) - 97; }
function rankIdx(sq: Square): number { return parseInt(sq[1], 10) - 1; }

type OppAnim =
  | 'emerge'     // soft rise + fade from below the square (portals minus the portal)
  | 'slide'      // smooth slide in from nearest edge (rails minus the rail)
  | 'settle'     // short drop from above with cushioned settle
  | 'iris'       // scale from 0 outward, clean expand-to-place
  | 'glide'      // long diagonal glide from off-board corner with curve
  | 'cascade';   // coordinated top-down slide, file by file from h→a

interface Option { key: OppAnim; label: string; description: string }

const OPTIONS: Option[] = [
  { key: 'emerge',  label: 'Emerge',  description: 'Pieces rise softly up from below the square, fading in.' },
  { key: 'slide',   label: 'Slide',   description: 'Pieces glide in smoothly from the nearest board edge.' },
  { key: 'settle',  label: 'Settle',  description: 'Short drop from above with a soft cushioned landing.' },
  { key: 'iris',    label: 'Iris',    description: 'Scale up from zero with a clean expand into place.' },
  { key: 'glide',   label: 'Glide',   description: 'Diagonal glide from off-board with a smooth curve.' },
  { key: 'cascade', label: 'Cascade', description: 'Top-down slide cascading file by file across the board.' },
];

export default function RunIntroTestPage() {
  return (
    <div className="h-screen w-full overflow-auto bg-stone-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-black text-stone-900">
          Rookie's Run — Opposition Entrance
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          1-second intro. Each card shows a different entrance for the BLACK
          pieces. Rookie always lands the same way (small fade + bounce) on
          a randomized rank-1 file.
        </p>
        <ReplayAllButton />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {OPTIONS.map((opt) => <IntroPreview key={opt.key} option={opt} />)}
        </div>
      </div>
    </div>
  );
}

function ReplayAllButton() {
  const [, setTick] = useState(0);
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent('rr-intro-replay-all'));
        setTick((t) => t + 1);
      }}
      className="mt-4 rounded-full bg-stone-900 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:bg-stone-700"
    >
      Replay All
    </button>
  );
}

function IntroPreview({ option }: { option: Option }) {
  const [runId, setRunId] = useState(0);
  const [rookieSq, setRookieSq] = useState<Square>(() => randomStart());
  useEffect(() => {
    const onReplay = () => { setRookieSq(randomStart()); setRunId((n) => n + 1); };
    window.addEventListener('rr-intro-replay-all', onReplay);
    return () => window.removeEventListener('rr-intro-replay-all', onReplay);
  }, []);
  const replay = () => { setRookieSq(randomStart()); setRunId((n) => n + 1); };
  return (
    <div
      className="cursor-pointer rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md"
      onClick={replay}
    >
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-base font-extrabold text-stone-900">{option.label}</div>
        <div className="text-xs font-semibold text-stone-400">tap to replay</div>
      </div>
      <p className="mb-3 text-xs text-stone-500">{option.description}</p>
      <BoardWithIntro
        key={runId}
        anim={option.key}
        enemies={SAMPLE_ENEMIES}
        hazards={SAMPLE_HAZARDS}
        rookieSq={rookieSq}
      />
    </div>
  );
}

const TOTAL_MS = 1000;

interface BoardProps { anim: OppAnim; enemies: Enemy[]; hazards: Square[]; rookieSq: Square }

function BoardWithIntro({ anim, enemies, hazards, rookieSq }: BoardProps) {
  const introIdRef = useRef(Math.floor(Math.random() * 1_000_000));

  // We mount the chessboard WITHOUT enemies — they're rendered as a
  // separate overlay on top of the board so we can fully control their
  // motion (translate from off-board, rotate, etc) without fighting the
  // chessboard's own animation system.
  const position = useMemo(
    () => ({ [rookieSq]: { pieceType: 'wR' } }),
    [rookieSq],
  );
  const pieces = useMemo(
    () => ({
      ...defaultPieces,
      wR: () => <RookieCell form="rook" dying={false} glitching={false} />,
    }),
    [],
  );
  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    for (let f = 0; f < 8; f++) {
      const sq = `${FILES[f]}8`;
      styles[sq] = {
        backgroundImage: 'linear-gradient(180deg, #fff1b8 0%, #ffd56a 45%, #e89c1a 100%)',
      };
    }
    for (const sq of hazards) {
      styles[sq] = {
        ...styles[sq],
        backgroundColor: 'rgba(190, 18, 60, 0.45)',
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.18) 0 6px, transparent 6px 12px)',
      };
    }
    return styles;
  }, [hazards]);

  return (
    <div className="relative">
      <ChessPathBoard
        options={{
          id: `intro-${anim}-${introIdRef.current}`,
          position,
          pieces,
          squareStyles,
          showNotation: false,
          boardOrientation: 'white',
          allowDragging: false,
          animationDurationInMs: 0,
        }}
      />
      <EnemyOverlay anim={anim} enemies={enemies} introId={introIdRef.current} />
      <RookieReveal rookieSq={rookieSq} introId={introIdRef.current} />
    </div>
  );
}

/**
 * Renders all enemies as absolute-positioned overlay pieces on top of
 * the chessboard. Each enemy gets its own keyframe driven by `anim`.
 * The board itself shows just the bare squares + Rookie underneath.
 */
function EnemyOverlay({
  anim, enemies, introId,
}: { anim: OppAnim; enemies: Enemy[]; introId: number }) {
  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {enemies.map((e, i) => (
        <EnemySprite
          key={`${e.sq}-${introId}`}
          enemy={e}
          index={i}
          total={enemies.length}
          anim={anim}
          introId={introId}
        />
      ))}
    </div>
  );
}

function EnemySprite({
  enemy, index, total, anim, introId,
}: {
  enemy: Enemy; index: number; total: number; anim: OppAnim; introId: number;
}) {
  const f = fileIdx(enemy.sq);
  const r = rankIdx(enemy.sq);
  const left = f * 12.5;
  const top = (7 - r) * 12.5;
  const PieceComp = defaultPieces[ENEMY_SPRITE[enemy.type]];

  // Stagger across the first 500ms so the wave reads but everything
  // still completes inside the 1-second budget.
  const baseDelay = Math.round((index / Math.max(1, total - 1)) * 450);
  const ns = `rrE-${introId}-${index}-${anim}`;
  const variant = buildVariant(anim, f, r, index, total, ns);
  const delay = variant.delayMs ?? baseDelay;

  return (
    <>
      <style>{variant.css}</style>
      <div
        style={{
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          width: '12.5%',
          height: '12.5%',
          animation: `${ns}-main ${variant.durationMs}ms ${variant.easing} ${delay}ms both`,
          transformOrigin: variant.origin ?? '50% 70%',
          zIndex: 3,
        }}
      >
        <PieceComp />
      </div>
    </>
  );
}

interface Variant {
  css: string;
  durationMs: number;
  easing: string;
  origin?: string;
  delayMs?: number;
}

function buildVariant(
  anim: OppAnim, f: number, r: number, idx: number, total: number, ns: string,
): Variant {
  switch (anim) {
    case 'emerge': {
      // Soft rise from below + fade. Stagger by rank so the wave
      // travels bottom-of-board → top: low-rank pieces appear first,
      // high-rank pieces appear last.
      return {
        durationMs: 550,
        easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
        delayMs: r * 90,
        css: `
          @keyframes ${ns}-main {
            0%   { transform: translateY(45%) scale(0.55); opacity: 0; }
            60%  { transform: translateY(-6%) scale(1.04); opacity: 1; }
            100% { transform: translateY(0)   scale(1);    opacity: 1; }
          }
        `,
      };
    }

    case 'slide': {
      // Smooth slide from nearest edge — no rail viz.
      const distTop = r;
      const distBottom = 7 - r;
      const distLeft = f;
      const distRight = 7 - f;
      const min = Math.min(distTop, distBottom, distLeft, distRight);
      let startX = 0, startY = 0;
      if (min === distLeft)        startX = -(f + 1.5) * 100;
      else if (min === distRight)  startX =  (7 - f + 1.5) * 100;
      else if (min === distTop)    startY = -(r + 1.5) * 100;
      else                         startY =  (7 - r + 1.5) * 100;
      return {
        durationMs: 600,
        easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
        css: `
          @keyframes ${ns}-main {
            0%   { transform: translate(${startX}%, ${startY}%); opacity: 0; }
            15%  { opacity: 1; }
            100% { transform: translate(0, 0); opacity: 1; }
          }
        `,
      };
    }

    case 'settle': {
      // Short drop with a cushioned settle — nothing harsh.
      return {
        durationMs: 550,
        easing: 'cubic-bezier(0.3, 0.6, 0.3, 1)',
        css: `
          @keyframes ${ns}-main {
            0%   { transform: translateY(-90%) scale(1, 0.95); opacity: 0; }
            20%  { opacity: 1; }
            72%  { transform: translateY(0)    scale(1.03, 0.92); }
            88%  { transform: translateY(0)    scale(0.98, 1.04); }
            100% { transform: translateY(0)    scale(1); opacity: 1; }
          }
        `,
        origin: '50% 100%',
      };
    }

    case 'iris': {
      // Scale-from-zero with a smooth cubic — pieces just bloom into place.
      return {
        durationMs: 500,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        origin: '50% 50%',
        css: `
          @keyframes ${ns}-main {
            0%   { transform: scale(0);    opacity: 0; }
            50%  { opacity: 1; }
            80%  { transform: scale(1.05); }
            100% { transform: scale(1);    opacity: 1; }
          }
        `,
      };
    }

    case 'glide': {
      // Diagonal glide from off-board corner with a smooth curve. Top
      // corner picked so motion feels gravity-assisted.
      const fromLeft = f < 4;
      const startX = fromLeft ? -200 : 200;
      const startY = -180;
      return {
        durationMs: 700,
        easing: 'cubic-bezier(0.25, 0.5, 0.25, 1)',
        css: `
          @keyframes ${ns}-main {
            0%   { transform: translate(${startX}%, ${startY}%); opacity: 0; }
            15%  { opacity: 1; }
            55%  { transform: translate(${startX * 0.4}%, ${startY * 0.3}%); }
            85%  { transform: translate(-2%, -2%); }
            100% { transform: translate(0, 0); opacity: 1; }
          }
        `,
      };
    }

    case 'cascade': {
      // Top-down drop, file-by-file from h→a. Each file lands cleanly
      // before the next starts — reads as a coordinated wave.
      const fileDelay = (7 - f) * 55;
      return {
        durationMs: 450,
        easing: 'cubic-bezier(0.3, 0.6, 0.3, 1)',
        delayMs: fileDelay,
        css: `
          @keyframes ${ns}-main {
            0%   { transform: translateY(-140%); opacity: 0; }
            25%  { opacity: 1; }
            85%  { transform: translateY(2%); }
            100% { transform: translateY(0); opacity: 1; }
          }
        `,
      };
    }
  }
}

/**
 * Rookie reveal — simpler now: she fades in with a small drop-bounce on
 * her randomized rank-1 square. Not the focus.
 */
function RookieReveal({ rookieSq, introId }: { rookieSq: Square; introId: number }) {
  const ns = `rrRk-${introId}-${rookieSq}`;
  return (
    <style>{`
      [data-square="${rookieSq}"] > div > img,
      [data-square="${rookieSq}"] > div > svg {
        animation: ${ns}-land 600ms cubic-bezier(0.3, 0.1, 0.4, 1.5) 600ms both;
        transform-origin: 50% 100%;
      }
      @keyframes ${ns}-land {
        0%   { transform: translateY(-180%) scale(0.8); opacity: 0; }
        25%  { opacity: 1; }
        65%  { transform: translateY(0) scale(1.2, 0.7); }
        80%  { transform: translateY(0) scale(0.9, 1.12); }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }
    `}</style>
  );
}
