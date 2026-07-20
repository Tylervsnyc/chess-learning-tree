import React, { useMemo } from 'react';
import {
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { loadFont } from './lib/dm-sans';
import { Chess } from 'chess.js';
import { BoardSlot } from './components/BoardSlot';
import { ReelLogo } from './components/ReelLogo';
import { FPS, FRAME_W, FRAME_H } from './lib/timing';

const { fontFamily } = loadFont();

const BG = '#0a0a0f';
const GOLD = '#FFC800';
const RED = '#ff4444';
const GREEN = '#58CC02';
const BLUE = '#1CB0F6';
const PURPLE = '#A560E8';

// ── Puzzle: Back rank mate — Qe8+!! ──────────────────────────────────
// White sacs the queen: Qe8+! Rxe8 forced, Rxe8# checkmate.
// King trapped behind f7/g7/h7 pawns. Clean, simple, devastating.
const PUZZLE_FEN = '2r3k1/5ppp/p7/1p6/8/1P2Q3/P4PPP/4R1K1 w - - 0 1';
const MOVE_1 = { from: 'e3', to: 'e8' } as const; // Qe8+!!
const MOVE_2 = { from: 'c8', to: 'e8' } as const; // Rxe8 (forced)
const MOVE_3 = { from: 'e1', to: 'e8' } as const; // Rxe8# checkmate

// ── Timing ────────────────────────────────────────────────────────────
export const PUZZLE_EXPLAINER_BEAT1 = 120; // 4.0s — Hook: "A puzzle is a position you can win"
export const PUZZLE_EXPLAINER_BEAT2 = 90;  // 3.0s — Show position
export const PUZZLE_EXPLAINER_BEAT3 = 210; // 7.0s — The solution plays out
export const PUZZLE_EXPLAINER_BEAT4 = 120; // 4.0s — Theme: "Back Rank Mate"
export const PUZZLE_EXPLAINER_BEAT5 = 120; // 4.0s — CTA
export const PUZZLE_EXPLAINER_TOTAL =
  PUZZLE_EXPLAINER_BEAT1 + PUZZLE_EXPLAINER_BEAT2 + PUZZLE_EXPLAINER_BEAT3 +
  PUZZLE_EXPLAINER_BEAT4 + PUZZLE_EXPLAINER_BEAT5; // 660 = 22s

/* ── Beat 1: Hook — The core idea ──────────────────────────────────── */

const BeatHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line 1: "A chess puzzle is a position"
  const line1Scale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 220 },
  });
  const line1Opacity = interpolate(line1Scale, [0, 0.5], [0, 1]);

  // Board fades in
  const boardFrame = Math.max(0, frame - 12);
  const boardY = interpolate(boardFrame, [0, 20], [80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const boardOpacity = interpolate(boardFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Line 2: "you can WIN" — slams in after board
  const line2Frame = Math.max(0, frame - 40);
  const line2Scale = spring({
    frame: line2Frame,
    fps,
    config: { damping: 8, stiffness: 220 },
  });
  const line2Opacity = interpolate(line2Scale, [0, 0.5], [0, 1]);

  // Line 3: "and there's nothing they can do about it."
  const line3Frame = Math.max(0, frame - 70);
  const line3Opacity = interpolate(line3Frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const line3Y = interpolate(line3Frame, [0, 15], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
        gap: 24,
      }}
    >
      {/* "A chess puzzle is a position..." */}
      <div style={{ opacity: line1Opacity, transform: `scale(${line1Scale})`, padding: '0 60px' }}>
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 56,
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          A chess puzzle is a position...
        </p>
      </div>

      {/* Board preview */}
      <div
        style={{
          opacity: boardOpacity,
          transform: `translateY(${boardY}px) scale(0.6)`,
        }}
      >
        <BoardSlot fen={PUZZLE_FEN} orientation="white" />
      </div>

      {/* "you can WIN" */}
      <div style={{ opacity: line2Opacity, transform: `scale(${line2Scale})` }}>
        <p
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 96,
            color: GREEN,
            margin: 0,
            textAlign: 'center',
            textShadow: '0 0 60px rgba(88,204,2,0.4)',
          }}
        >
          you can WIN.
        </p>
      </div>

      {/* "And there's nothing they can do about it." */}
      <div style={{ opacity: line3Opacity, transform: `translateY(${line3Y}px)`, padding: '0 60px' }}>
        <p
          style={{
            fontFamily,
            fontWeight: 600,
            fontSize: 44,
            color: 'rgba(255,255,255,0.6)',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          And there's nothing your
          <br />
          opponent can do about it.
        </p>
      </div>
    </div>
  );
};

/* ── Beat 2: The Position — "White to move" ────────────────────────── */

const BeatPosition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boardScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  // "White to move" text
  const textFrame = Math.max(0, frame - 15);
  const textOpacity = interpolate(textFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "One move wins. Can you find it?" fades in
  const findFrame = Math.max(0, frame - 50);
  const findOpacity = interpolate(findFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
        gap: 32,
      }}
    >
      {/* "White to move" */}
      <div style={{ opacity: textOpacity }}>
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 56,
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          White to move.
        </p>
      </div>

      {/* Board — full size */}
      <div style={{ transform: `scale(${boardScale * 0.75})` }}>
        <BoardSlot
          fen={PUZZLE_FEN}
          orientation="white"
        />
      </div>

      {/* "One move wins. Can you find it?" */}
      <div style={{ opacity: findOpacity, padding: '0 60px' }}>
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 52,
            color: GOLD,
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          One move wins.
          <br />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 44 }}>Can you find it?</span>
        </p>
      </div>
    </div>
  );
};

/* ── Beat 3: The Solution — Qe8+!! Rxe8 Rxe8# ────────────────────── */

const BeatSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (frame 0-30): Show position
  // Phase 2 (frame 30): Qe8+!! — queen sac
  // Phase 3 (frame 80): Rxe8 — forced capture
  // Phase 4 (frame 130): Rxe8# — checkmate

  const phase = frame < 30 ? 0 : frame < 80 ? 1 : frame < 130 ? 2 : 3;

  const currentFen = useMemo(() => {
    const chess = new Chess(PUZZLE_FEN);
    try {
      if (phase >= 1) chess.move({ from: MOVE_1.from, to: MOVE_1.to });
      if (phase >= 2) chess.move({ from: MOVE_2.from, to: MOVE_2.to });
      if (phase >= 3) chess.move({ from: MOVE_3.from, to: MOVE_3.to });
    } catch {
      // fall through
    }
    return chess.fen();
  }, [phase]);

  // Highlight squares based on phase
  const highlights = useMemo(() => {
    if (phase === 1) return { from: 'e3', to: 'e8' }; // Qe8+
    if (phase === 2) return { from: 'c8', to: 'e8' }; // Rxe8
    if (phase === 3) return { from: 'e1', to: 'e8' }; // Rxe8#
    return { from: undefined, to: undefined };
  }, [phase]);

  // "Qe8+!!" slams in at phase 1
  const sacFrame = Math.max(0, frame - 30);
  const sacScale = spring({
    frame: sacFrame,
    fps,
    config: { damping: 8, stiffness: 220 },
  });
  const sacOpacity = interpolate(sacScale, [0, 0.5], [0, 1]);

  // "Sacrifice the queen!" fades in
  const sacTextFrame = Math.max(0, frame - 40);
  const sacTextOpacity = interpolate(sacTextFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "Rxe8 — forced" at phase 2
  const captureFrame = Math.max(0, frame - 80);
  const captureOpacity = interpolate(captureFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "Rxe8# CHECKMATE" at phase 3
  const mateFrame = Math.max(0, frame - 130);
  const mateScale = spring({
    frame: mateFrame,
    fps,
    config: { damping: 6, stiffness: 200 },
  });
  const mateOpacity = interpolate(mateScale, [0, 0.5], [0, 1]);

  // "Nothing black could do." final line
  const nothingFrame = Math.max(0, frame - 165);
  const nothingOpacity = interpolate(nothingFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily,
        paddingTop: 60,
        gap: 16,
      }}
    >
      {/* Board — shows moves playing out */}
      <div style={{ transform: 'scale(0.62)' }}>
        <BoardSlot
          fen={currentFen}
          orientation="white"
          highlightFrom={highlights.from}
          highlightTo={highlights.to}
        />
      </div>

      {/* Move annotations */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, minHeight: 400 }}>
        {/* "Qe8+!!" */}
        {phase >= 1 && (
          <div style={{ opacity: sacOpacity, transform: `scale(${sacScale})` }}>
            <p
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 88,
                color: GREEN,
                margin: 0,
                textAlign: 'center',
                textShadow: '0 0 40px rgba(88,204,2,0.4)',
              }}
            >
              Qe8+!!
            </p>
          </div>
        )}

        {/* "Sacrifice the queen!" */}
        {phase >= 1 && (
          <div style={{ opacity: sacTextOpacity }}>
            <p
              style={{
                fontFamily,
                fontWeight: 700,
                fontSize: 48,
                color: GOLD,
                margin: 0,
                textAlign: 'center',
              }}
            >
              Sacrifice the queen!
            </p>
          </div>
        )}

        {/* "Rxe8 — forced" */}
        {phase >= 2 && (
          <div style={{ opacity: captureOpacity, marginTop: 8 }}>
            <p
              style={{
                fontFamily,
                fontWeight: 600,
                fontSize: 44,
                color: 'rgba(255,255,255,0.7)',
                margin: 0,
                textAlign: 'center',
              }}
            >
              Rxe8 — forced.
            </p>
          </div>
        )}

        {/* "Rxe8# CHECKMATE" */}
        {phase >= 3 && (
          <div style={{ opacity: mateOpacity, transform: `scale(${mateScale})`, marginTop: 12 }}>
            <p
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 72,
                color: RED,
                margin: 0,
                textAlign: 'center',
                textShadow: '0 0 50px rgba(255,68,68,0.5)',
              }}
            >
              Rxe8#
            </p>
            <p
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 56,
                color: '#fff',
                margin: '4px 0 0',
                textAlign: 'center',
                letterSpacing: '0.1em',
              }}
            >
              CHECKMATE.
            </p>
          </div>
        )}

        {/* "Nothing black could do." */}
        {phase >= 3 && (
          <div style={{ opacity: nothingOpacity, marginTop: 8 }}>
            <p
              style={{
                fontFamily,
                fontWeight: 600,
                fontSize: 40,
                color: 'rgba(255,255,255,0.4)',
                margin: 0,
                textAlign: 'center',
              }}
            >
              Nothing black could do.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Beat 4: Theme Reveal — "Back Rank Mate" ──────────────────────── */

const BeatTheme: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Theme name slams in
  const themeScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 200 },
  });
  const themeOpacity = interpolate(themeScale, [0, 0.5], [0, 1]);

  // Subtitle fades in
  const subFrame = Math.max(0, frame - 20);
  const subOpacity = interpolate(subFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subY = interpolate(subFrame, [0, 15], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "Chess Path shows you..." text
  const cpFrame = Math.max(0, frame - 50);
  const cpOpacity = interpolate(cpFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cpY = interpolate(cpFrame, [0, 15], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Decorative ring animation
  const ringScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
        gap: 48,
      }}
    >
      {/* Decorative rings */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${ringScale})`,
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: `4px solid ${RED}30`,
            boxShadow: `0 0 80px ${RED}20`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${ringScale * 0.7})`,
            width: 350,
            height: 350,
            borderRadius: '50%',
            border: `3px solid ${GOLD}25`,
          }}
        />

        {/* Theme name */}
        <div style={{ opacity: themeOpacity, transform: `scale(${themeScale})`, position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: 80,
              color: RED,
              margin: 0,
              textAlign: 'center',
              lineHeight: 1.2,
              textShadow: `0 0 60px ${RED}50`,
            }}
          >
            BACK RANK
            <br />
            MATE
          </p>
        </div>
      </div>

      {/* Subtitle — what it means */}
      <div style={{ opacity: subOpacity, transform: `translateY(${subY}px)`, padding: '0 80px' }}>
        <p
          style={{
            fontFamily,
            fontWeight: 600,
            fontSize: 44,
            color: 'rgba(255,255,255,0.8)',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          The king is trapped
          <br />
          behind its own pawns.
        </p>
      </div>

      {/* Chess Path pitch */}
      <div style={{ opacity: cpOpacity, transform: `translateY(${cpY}px)`, padding: '0 60px' }}>
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 48,
            color: GOLD,
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          Chess Path shows you all the ideas
          <br />
          you need to improve at chess.
        </p>
      </div>
    </div>
  );
};

/* ── Beat 5: CTA — "Join today" ───────────────────────────────────── */

const BeatCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const logoOpacity = interpolate(logoScale, [0, 1], [0, 1]);

  // Tagline fades in
  const tagFrame = Math.max(0, frame - 14);
  const tagOpacity = interpolate(tagFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tagY = interpolate(tagFrame, [0, 12], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // CTA button
  const ctaFrame = Math.max(0, frame - 40);
  const ctaScale = spring({ frame: ctaFrame, fps, config: { damping: 10, stiffness: 180 } });
  const ctaOpacity = interpolate(ctaScale, [0, 1], [0, 1]);

  // Footer
  const footerFrame = Math.max(0, frame - 60);
  const footerOpacity = interpolate(footerFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
        fontFamily,
      }}
    >
      {/* Logo */}
      <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
        <ReelLogo darkBg />
      </div>

      {/* "The easy way to learn chess." */}
      <div style={{ opacity: tagOpacity, transform: `translateY(${tagY}px)`, padding: '0 60px' }}>
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 56,
            color: 'rgba(255,255,255,0.8)',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          The easy way to learn chess.
        </p>
      </div>

      {/* CTA Button — "Join today" */}
      <div style={{ opacity: ctaOpacity, transform: `scale(${ctaScale})` }}>
        <span
          style={{
            display: 'inline-block',
            borderRadius: 9999,
            paddingLeft: 80,
            paddingRight: 80,
            paddingTop: 24,
            paddingBottom: 24,
            fontSize: 52,
            fontWeight: 800,
            fontFamily,
            background: `linear-gradient(135deg, ${GREEN} 0%, #46a302 100%)`,
            color: '#fff',
            boxShadow: '0 8px 32px rgba(88,204,2,0.4)',
          }}
        >
          Join today
        </span>
      </div>

      {/* Footer */}
      <div style={{ opacity: footerOpacity }}>
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
          }}
        >
          chesspath.app
        </p>
      </div>
    </div>
  );
};

/* ── Main Composition ──────────────────────────────────────────────── */

export const PuzzleExplainerReel: React.FC = () => {
  let offset = 0;

  return (
    <div style={{ width: FRAME_W, height: FRAME_H, backgroundColor: BG }}>
      <Sequence from={offset} durationInFrames={PUZZLE_EXPLAINER_BEAT1}>
        <BeatHook />
      </Sequence>

      <Sequence from={(offset += PUZZLE_EXPLAINER_BEAT1)} durationInFrames={PUZZLE_EXPLAINER_BEAT2}>
        <BeatPosition />
      </Sequence>

      <Sequence from={(offset += PUZZLE_EXPLAINER_BEAT2)} durationInFrames={PUZZLE_EXPLAINER_BEAT3}>
        <BeatSolution />
      </Sequence>

      <Sequence from={(offset += PUZZLE_EXPLAINER_BEAT3)} durationInFrames={PUZZLE_EXPLAINER_BEAT4}>
        <BeatTheme />
      </Sequence>

      <Sequence from={(offset += PUZZLE_EXPLAINER_BEAT4)} durationInFrames={PUZZLE_EXPLAINER_BEAT5}>
        <BeatCTA />
      </Sequence>
    </div>
  );
};
