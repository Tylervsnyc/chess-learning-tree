/**
 * Rookie's Run replay video composition.
 *
 * Renders a per-turn playback of a decision trace as a 9:16 portrait video.
 * Layout (top → bottom):
 *   1. Header — turn counter + tier badge.
 *   2. Board — big chess board rendered from the current turn's beforeBoard.
 *   3. Reason — Rookie's rationale + eval score for the move.
 *
 * Why we inline a Remotion-friendly board rather than importing ReplayBoard:
 *   - ReplayBoard depends on Tailwind class names (`grid grid-cols-8`, `aspect-square`).
 *     Remotion's bundle does include the global stylesheet, but to keep this
 *     composition standalone and frame-deterministic we use inline styles for
 *     the board markup. The visual palette and Unicode glyphs match ReplayBoard.
 *
 * Why fade-then-snap turn transitions (no piece tweening):
 *   - Each `beforeBoard` is a discrete snapshot. Sliding glyphs between two
 *     snapshots would lie about ability/transform jumps, captures, and
 *     pawn promotions. A clean cross-fade reads the state honestly.
 */

import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';
import type {
  DecisionLogEntry,
  DecisionTrace,
  SerializedBoard,
  TierId,
} from '../../scripts/run-playtest/types';
import type { PieceType, RookieForm } from '../../lib/run/types';

const { fontFamily } = loadFont();

// ── Layout ────────────────────────────────────────────────────────────────
// Portrait 9:16. 1080x1920 is the social-share standard the rest of the
// project's reels use (see remotion/lib/timing.ts).
export const REPLAY_W = 1080;
export const REPLAY_H = 1920;
export const REPLAY_FPS = 30;

/** Frames per turn. 1.5s feels right for "watch and read" without dragging. */
const FRAMES_PER_TURN = 45; // 1.5s @ 30fps
/** Outcome splash duration (frames). */
const OUTCOME_FRAMES = 90; // 3.0s @ 30fps
/** Hard cap on total render length (frames). Tyler wants ~30s shorts. */
const MAX_TURN_TOTAL_FRAMES = 30 * REPLAY_FPS - OUTCOME_FRAMES; // 810

/**
 * Pick a per-turn frame budget that keeps the full video <= 30s.
 * If the trace is long, we shrink per-turn time rather than letting it run on.
 */
export function framesPerTurn(turnCount: number): number {
  const desired = FRAMES_PER_TURN;
  if (turnCount <= 0) return desired;
  if (turnCount * desired <= MAX_TURN_TOTAL_FRAMES) return desired;
  // Floor to avoid sub-frame timing. Never drop below ~0.4s/turn (12 frames)
  // so captions still register.
  return Math.max(12, Math.floor(MAX_TURN_TOTAL_FRAMES / turnCount));
}

/** Total composition length for a given trace. */
export function totalReplayFrames(trace: DecisionTrace): number {
  const turns = trace.decisionLog.length;
  return turns * framesPerTurn(turns) + OUTCOME_FRAMES;
}

// ── Palette ───────────────────────────────────────────────────────────────
// Background uses the "warm off-white" the brief calls for. Other tokens
// match ReplayBoard for visual continuity with the playtest viewer.
const BG_COLOR = '#fafaf9'; // stone-50
const TEXT_PRIMARY = '#0c0a09'; // stone-950
const TEXT_MUTED = '#57534e'; // stone-600
const ACCENT_GREEN = '#10b981'; // chess-green
const ACCENT_RED = '#dc2626'; // red-600
const LIGHT_SQ = '#f0d9b5';
const DARK_SQ = '#b58863';
const GOAL_GRAD = 'linear-gradient(180deg, #fff1b8 0%, #ffd56a 45%, #e89c1a 100%)';
const HAZARD_BG = 'rgba(190, 18, 60, 0.55)';
const FROZEN_BG = 'rgba(125, 211, 252, 0.55)';
const FROM_BG = 'rgba(28, 176, 246, 0.30)';
const FROM_RING = 'inset 0 0 0 6px rgba(28, 176, 246, 0.85)';
const TO_BG = 'rgba(132, 204, 22, 0.35)';
const TO_RING = 'inset 0 0 0 6px rgba(101, 163, 13, 0.95)';

// Unicode glyphs match ReplayBoard exactly.
const ROOKIE_GLYPH: Record<RookieForm, string> = {
  rook: '♖',
  knight: '♘',
  bishop: '♗',
  queen: '♕',
};
const ENEMY_GLYPH: Record<PieceType, string> = {
  pawn: '♟',
  knight: '♞',
  bishop: '♝',
  queen: '♛',
};

// Tier copy. Mirrors the bot labels Tyler uses elsewhere.
const TIER_LABEL: Record<TierId, string> = {
  T3: 'T3 · Steady',
  T4: 'T4 · Sharp',
  T5: 'T5 · Surgical',
};

// ── Utility helpers ────────────────────────────────────────────────────────
function toSquare(file: number, rank: number): string {
  return `${String.fromCharCode('a'.charCodeAt(0) + file - 1)}${rank}`;
}

/**
 * Pull from/to squares out of an action, if any. Mirrors the helper in
 * ReplayBoard.actionHighlights but only handles the spatial cases we care
 * about for the replay (move + ability-target). Offer picks have no spatial
 * anchor, so they return null/null.
 */
function highlightsFor(
  before: SerializedBoard,
  action: DecisionLogEntry['action'],
): { from: string | null; to: string | null } {
  switch (action.kind) {
    case 'move':
    case 'ability-target':
      return {
        from: toSquare(before.rookie.file, before.rookie.rank),
        to: toSquare(action.target.file, action.target.rank),
      };
    case 'activate-ability':
      return { from: toSquare(before.rookie.file, before.rookie.rank), to: null };
    case 'pick-offer':
    case 'dismiss-offer':
      return { from: null, to: null };
  }
}

/** Short human-readable summary of what just happened — slotted as a label. */
function actionLabel(action: DecisionLogEntry['action']): string {
  switch (action.kind) {
    case 'move':
      return 'Move';
    case 'ability-target':
      return `Ability: ${action.abilityId}`;
    case 'activate-ability':
      return `Activate: ${action.abilityId}`;
    case 'pick-offer':
      return `Pick offer #${action.optionIndex + 1}`;
    case 'dismiss-offer':
      return 'Skip offer';
  }
}

/** Format an outcome into a one-line headline + sub-line. */
function outcomeHeadline(trace: DecisionTrace): { title: string; sub: string; color: string } {
  const o = trace.outcome;
  if (o.win) {
    return {
      title: 'Rookie won.',
      sub: `Level ${trace.level} · ${o.movesUsed} moves`,
      color: ACCENT_GREEN,
    };
  }
  switch (o.failMode) {
    case 'captured':
      return {
        title: `Captured by the ${o.capturedBy ?? 'enemy'}.`,
        sub: `Level ${trace.level} · ${o.movesUsed} moves`,
        color: ACCENT_RED,
      };
    case 'move-limit':
      return {
        title: 'Ran out of moves.',
        sub: `Level ${trace.level} · ${o.movesUsed}/${o.movesUsed} used`,
        color: ACCENT_RED,
      };
    case 'dead-end':
      return {
        title: 'No legal moves.',
        sub: `Level ${trace.level} · ${o.movesUsed} moves`,
        color: ACCENT_RED,
      };
    default:
      return { title: 'Run ended.', sub: `Level ${trace.level}`, color: TEXT_MUTED };
  }
}

// ── Subcomponents ──────────────────────────────────────────────────────────

interface BoardProps {
  board: SerializedBoard;
  fromSquare: string | null;
  toSquareHi: string | null;
  size: number;
}

/**
 * 8x8 board rendered with inline styles for Remotion. No Tailwind classes —
 * keeps the bundle simple and avoids "did Tailwind tree-shake this class?"
 * surprises during render.
 */
function ReplayBoardSVG({
  board,
  fromSquare,
  toSquareHi,
  size,
}: BoardProps): React.ReactElement {
  const cell = size / 8;
  const enemyAt = new Map<string, PieceType>();
  for (const p of board.pieces) {
    enemyAt.set(toSquare(p.file, p.rank), p.type);
  }
  const hazardSet = new Set(board.hazards.map((h) => toSquare(h.file, h.rank)));
  const frozenSet = new Set(board.frozenSquares);
  const rookieSq = toSquare(board.rookie.file, board.rookie.rank);

  const cells: React.ReactElement[] = [];
  // Rank 8 on top → rank 1 on bottom. Files a..h left→right.
  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 1; file <= 8; file++) {
      const sq = toSquare(file, rank);
      const isLight = (file + rank) % 2 === 1;
      const isGoal = rank === 8;
      const isHazard = hazardSet.has(sq);
      const isFrozen = frozenSet.has(sq);
      const isRookie = sq === rookieSq;
      const enemy = enemyAt.get(sq);
      const isFrom = fromSquare === sq;
      const isTo = toSquareHi === sq;

      let background: string | undefined;
      let backgroundColor: string | undefined;
      if (isGoal) {
        background = GOAL_GRAD;
      } else if (isHazard) {
        backgroundColor = HAZARD_BG;
      } else if (isFrozen) {
        backgroundColor = FROZEN_BG;
      } else {
        backgroundColor = isLight ? LIGHT_SQ : DARK_SQ;
      }
      if (isFrom) backgroundColor = FROM_BG;
      if (isTo) backgroundColor = TO_BG;

      const boxShadow = isFrom ? FROM_RING : isTo ? TO_RING : undefined;

      const glyph = isRookie
        ? ROOKIE_GLYPH[board.form]
        : enemy
          ? ENEMY_GLYPH[enemy]
          : '';
      const glyphColor = isRookie ? '#0f172a' : enemy ? '#000000' : 'transparent';

      // Top-left origin so cells line up regardless of flex/grid quirks.
      const left = (file - 1) * cell;
      const top = (8 - rank) * cell;

      cells.push(
        <div
          key={sq}
          style={{
            position: 'absolute',
            left,
            top,
            width: cell,
            height: cell,
            background,
            backgroundColor,
            boxShadow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Why a serif fallback first: Unicode chess glyphs render
            // tallest/cleanest in symbol-aware fonts; DM Sans is for labels.
            fontFamily:
              '"Noto Sans Symbols 2", "Segoe UI Symbol", "Apple Symbols", serif',
            fontSize: cell * 0.78,
            lineHeight: 1,
            color: glyphColor,
            // Frozen enemies get an icy tint; matches ReplayBoard's feel.
            textShadow:
              isFrozen && !isRookie ? '0 0 8px rgba(56,189,248,0.95)' : undefined,
            filter:
              isRookie && board.shieldUp
                ? 'drop-shadow(0 0 6px rgba(56,189,248,1)) drop-shadow(0 0 12px rgba(125,211,252,0.9))'
                : undefined,
            userSelect: 'none',
          }}
        >
          {glyph}
        </div>,
      );
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        border: '2px solid #e7e5e4', // stone-200
      }}
    >
      {cells}
    </div>
  );
}

interface TurnSceneProps {
  trace: DecisionTrace;
  entry: DecisionLogEntry;
  turnIndex: number;
  totalTurns: number;
  durationFrames: number;
}

/**
 * One turn on screen. Cross-fades in over the first 6 frames, holds steady,
 * then cross-fades out over the last 6 frames. Remotion <Sequence /> handles
 * the absolute positioning in time.
 */
function TurnScene({
  trace,
  entry,
  turnIndex,
  totalTurns,
  durationFrames,
}: TurnSceneProps): React.ReactElement {
  const frame = useCurrentFrame();
  const fadeIn = Math.min(6, Math.floor(durationFrames / 4));
  const fadeOut = Math.min(6, Math.floor(durationFrames / 4));
  const opacity = interpolate(
    frame,
    [0, fadeIn, durationFrames - fadeOut, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const { from, to } = highlightsFor(entry.beforeBoard, entry.action);
  const tierText = TIER_LABEL[trace.tier];

  // Strip the bracketed "1-ply best of 9 (eval 17.6)" tail from the reason —
  // it's noisy for a marketing video and we render eval separately below.
  const cleanReason = entry.reason.replace(/\s*—\s*1-ply best of \d+.*$/u, '').trim();
  // Cap at ~140 chars so we never overflow two lines on portrait.
  const truncatedReason =
    cleanReason.length > 140 ? `${cleanReason.slice(0, 137)}...` : cleanReason;

  // Board is sized to fit comfortably above the caption block.
  const boardSize = Math.min(REPLAY_W - 120, 960);
  const evalScore = entry.evalScore;

  return (
    <AbsoluteFill style={{ opacity, padding: '60px 60px', boxSizing: 'border-box' }}>
      {/* Header band — turn counter + tier badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 30,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 44,
            fontWeight: 800,
            color: TEXT_PRIMARY,
            letterSpacing: -0.5,
          }}
        >
          Turn {turnIndex + 1} <span style={{ color: TEXT_MUTED }}>/ {totalTurns}</span>
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 30,
            fontWeight: 700,
            color: '#fff',
            background: ACCENT_GREEN,
            padding: '10px 22px',
            borderRadius: 999,
            letterSpacing: 0.5,
          }}
        >
          {tierText}
        </div>
      </div>

      {/* Board */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <ReplayBoardSVG
          board={entry.beforeBoard}
          fromSquare={from}
          toSquareHi={to}
          size={boardSize}
        />
      </div>

      {/* Reason caption */}
      <div
        style={{
          marginTop: 60,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 700,
            color: ACCENT_GREEN,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          {actionLabel(entry.action)}
          {evalScore !== undefined && (
            <span style={{ color: TEXT_MUTED, marginLeft: 14, letterSpacing: 0.5 }}>
              · eval {evalScore.toFixed(1)}
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 52,
            fontWeight: 700,
            color: TEXT_PRIMARY,
            lineHeight: 1.2,
          }}
        >
          {truncatedReason}
        </div>
      </div>
    </AbsoluteFill>
  );
}

interface OutcomeSceneProps {
  trace: DecisionTrace;
  durationFrames: number;
}

/** End-of-run splash: big "Rookie won" / capture line + level ID. */
function OutcomeScene({ trace, durationFrames }: OutcomeSceneProps): React.ReactElement {
  const frame = useCurrentFrame();
  const headline = outcomeHeadline(trace);

  // Punch in: scale 0.85 → 1.0, fade in over first 8 frames; hold; fade out
  // the last 6 frames so the cut to nothing isn't jarring on social loops.
  const opacity = interpolate(
    frame,
    [0, 8, durationFrames - 6, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const scale = interpolate(frame, [0, 14], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: BG_COLOR,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 56,
            fontWeight: 700,
            color: TEXT_MUTED,
            letterSpacing: -0.5,
          }}
        >
          {TIER_LABEL[trace.tier]}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 120,
            fontWeight: 800,
            color: headline.color,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {headline.title}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 48,
            fontWeight: 600,
            color: TEXT_PRIMARY,
            letterSpacing: -0.5,
          }}
        >
          {headline.sub}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 36,
            fontWeight: 500,
            color: TEXT_MUTED,
            marginTop: 24,
          }}
        >
          Rookie&apos;s Run · {trace.levelId}
        </div>
      </div>
    </AbsoluteFill>
  );
}

export interface ReplayCompositionProps {
  trace: DecisionTrace;
}

/** Main composition. Stitches per-turn scenes + the outcome splash. */
export function ReplayComposition({
  trace,
}: ReplayCompositionProps): React.ReactElement {
  const turns = trace.decisionLog;
  const turnFrames = framesPerTurn(turns.length);

  return (
    <AbsoluteFill style={{ background: BG_COLOR }}>
      {turns.map((entry, i) => (
        <Sequence
          key={i}
          from={i * turnFrames}
          durationInFrames={turnFrames}
          name={`turn-${i}`}
        >
          <TurnScene
            trace={trace}
            entry={entry}
            turnIndex={i}
            totalTurns={turns.length}
            durationFrames={turnFrames}
          />
        </Sequence>
      ))}
      <Sequence
        from={turns.length * turnFrames}
        durationInFrames={OUTCOME_FRAMES}
        name="outcome"
      >
        <OutcomeScene trace={trace} durationFrames={OUTCOME_FRAMES} />
      </Sequence>
    </AbsoluteFill>
  );
}
