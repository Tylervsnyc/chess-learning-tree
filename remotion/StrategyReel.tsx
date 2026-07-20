import React, { useMemo } from 'react';
import {
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  OffthreadVideo,
  staticFile,
} from 'remotion';
import { loadFont } from './lib/dm-sans';
import { Chess } from 'chess.js';
import { parseUciMove } from '../lib/puzzle-utils';
import { BoardSlot } from './components/BoardSlot';
import { ReelLogo } from './components/ReelLogo';
import {
  FPS,
  FRAME_W,
  FRAME_H,
  STRAT_BEAT1,
  STRAT_BEAT2,
  STRAT_BEAT3,
} from './lib/timing';

const { fontFamily } = loadFont();

const BG = '#0a0a0f';
const GOLD = '#FFC800';
const RED = '#ff4444';
const GREEN = '#58CC02';

/* ── Puzzle data for animated board ────────────────────────────────── */

const PUZZLE_FEN = '3r1rk1/pp3pp1/q1p4p/3n4/2pP4/4R3/PPQ2PPP/1B1R2K1 b - - 10 24';
const PUZZLE_MOVES = [
  'd5f6', 'e3f3', 'f8e8', 'f3f6', 'g7f6', 'c2h7', 'g8f8',
  'h7h8', 'f8e7', 'd1e1', 'e7d7', 'b1f5', 'd7c7', 'e1e8', 'd8e8', 'h8e8',
];
const MOVE_INTERVAL = 15; // frames per move (0.5s)

/* ── Beat 1: Hook — quick 3s — board + text ───────────────────────── */

const BeatHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animate a few puzzle moves (won't finish — just visual motion)
  const puzzleFrame = Math.max(0, frame - 10);
  const moveIndex = Math.min(
    Math.floor(puzzleFrame / MOVE_INTERVAL),
    PUZZLE_MOVES.length,
  );

  const currentFen = useMemo(() => {
    const chess = new Chess(PUZZLE_FEN);
    for (let i = 0; i < moveIndex; i++) {
      const { from, to, promotion } = parseUciMove(PUZZLE_MOVES[i]);
      try {
        chess.move({ from, to, promotion });
      } catch {
        break;
      }
    }
    return chess.fen();
  }, [moveIndex]);

  const { highlightFrom, highlightTo } = useMemo(() => {
    if (moveIndex === 0) return { highlightFrom: undefined, highlightTo: undefined };
    const { from, to } = parseUciMove(PUZZLE_MOVES[moveIndex - 1]);
    return { highlightFrom: from, highlightTo: to };
  }, [moveIndex]);

  // Everything appears fast for 3s beat
  const line1Opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const boardScale = spring({ frame: Math.max(0, frame - 3), fps, config: { damping: 12, stiffness: 200 } });

  const line2Frame = Math.max(0, frame - 8);
  const line2Opacity = interpolate(line2Frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slamFrame = Math.max(0, frame - 14);
  const slamScale = spring({
    frame: slamFrame,
    fps,
    config: { damping: 8, stiffness: 220 },
  });
  const slamOpacity = interpolate(slamFrame, [0, 3], [0, 1], {
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
        overflow: 'hidden',
        gap: 24,
      }}
    >
      {/* Top: "You learned chess" */}
      <div style={{ opacity: line1Opacity }}>
        <p
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 88,
            color: '#fff',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.15,
          }}
        >
          You learned <span style={{ color: GOLD }}>chess</span>.
        </p>
      </div>

      {/* Middle: Animated chess board */}
      <div
        style={{
          transform: `scale(${boardScale * 0.7})`,
          opacity: interpolate(boardScale, [0, 0.5], [0, 1]),
          height: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <BoardSlot
          fen={currentFen}
          orientation="white"
          highlightFrom={highlightFrom}
          highlightTo={highlightTo}
        />
      </div>

      {/* Bottom: "but you never learned STRATEGY" */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <div style={{ opacity: line2Opacity }}>
          <p
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 60,
              color: '#fff',
              margin: 0,
              textAlign: 'center',
            }}
          >
            But you never learned
          </p>
        </div>

        <div
          style={{
            opacity: slamOpacity,
            transform: `scale(${slamScale})`,
          }}
        >
          <p
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: 110,
              color: RED,
              margin: 0,
              textAlign: 'center',
              textShadow: '0 0 60px rgba(255,68,68,0.5)',
            }}
          >
            STRATEGY.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Beat 2: Chess Path + Full-Screen Gameplay ─────────────────────── */

const BeatLearnStrategy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoFrame = Math.max(0, frame - 2);
  const logoScale = spring({ frame: logoFrame, fps, config: { damping: 12, stiffness: 200 } });
  const logoOpacity = interpolate(logoScale, [0, 1], [0, 1]);

  // Copy text — line 1
  const copyFrame = Math.max(0, frame - 12);
  const copyOpacity = interpolate(copyFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const copyY = interpolate(copyFrame, [0, 12], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Copy text — line 2 ("all the tools…")
  const copy2Frame = Math.max(0, frame - 160);
  const copy2Opacity = interpolate(copy2Frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const copy2Y = interpolate(copy2Frame, [0, 15], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Video scales in
  const videoFrame = Math.max(0, frame - 24);
  const videoScale = spring({
    frame: videoFrame,
    fps,
    config: { damping: 14, stiffness: 160 },
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
        paddingTop: 80,
        gap: 20,
      }}
    >
      {/* Logo */}
      <div style={{ opacity: logoOpacity, transform: `scale(${logoScale * 0.6})` }}>
        <ReelLogo darkBg />
      </div>

      {/* Copy — "Learn Forks, Pins, and more" */}
      <div style={{ opacity: copyOpacity, transform: `translateY(${copyY}px)`, padding: '0 60px' }}>
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 52,
            color: '#fff',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          Learn <span style={{ color: GOLD }}>Forks</span>, <span style={{ color: '#ff6b6b' }}>Pins</span>,
          <br />
          and <span style={{ color: GREEN }}>more</span>
        </p>
      </div>

      {/* Gameplay video */}
      <div style={{ transform: `scale(${videoScale})`, flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: FRAME_W - 80,
            height: 1200,
            borderRadius: 32,
            border: 'none',
            overflow: 'hidden',
            boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
          }}
        >
          <VideoSafe
            src={staticFile('Gameplay/mategameplay.mov')}
            width={FRAME_W - 80}
            height={1200}
          />
        </div>
      </div>

      {/* "All the tools you need to win" — fades in after concepts */}
      <div
        style={{
          opacity: copy2Opacity,
          transform: `translateY(${copy2Y}px)`,
          padding: '0 60px 40px',
        }}
      >
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 48,
            color: '#fff',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          All the tools you need
          <br />
          to <span style={{ color: GREEN }}>win at chess</span>
        </p>
      </div>
    </div>
  );
};

/* ── Beat 3: CTA ──────────────────────────────────────────────────── */

const CTA_FEATURES = [
  'Beginner friendly',
  'Puzzles for every level',
  'Daily challenges',
];

const Checkmark: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 13l4 4L19 7"
      stroke={GREEN}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BeatCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const logoOpacity = interpolate(logoScale, [0, 1], [0, 1]);

  // Tagline
  const tagFrame = Math.max(0, frame - 14);
  const tagOpacity = interpolate(tagFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tagY = interpolate(tagFrame, [0, 12], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Features stagger in after tagline
  const featureAnims = CTA_FEATURES.map((_, i) => {
    const f = Math.max(0, frame - 30 - i * 12);
    const opacity = interpolate(f, [0, 8], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const x = interpolate(f, [0, 10], [40, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return { opacity, x };
  });

  // CTA button pops in after features
  const ctaFrame = Math.max(0, frame - 72);
  const ctaScale = spring({ frame: ctaFrame, fps, config: { damping: 10, stiffness: 180 } });
  const ctaOpacity = interpolate(ctaScale, [0, 1], [0, 1]);

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
        gap: 40,
        fontFamily,
      }}
    >
      {/* Breathing rook logo + wordmark */}
      <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
        <ReelLogo darkBg />
      </div>

      {/* "The fun way to learn chess." */}
      <div style={{ opacity: tagOpacity, transform: `translateY(${tagY}px)` }}>
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 56,
            color: 'rgba(255,255,255,0.8)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          The fun way to learn chess.
        </p>
      </div>

      {/* Feature list with checkmarks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingLeft: 80 }}>
        {CTA_FEATURES.map((text, i) => (
          <div
            key={text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: featureAnims[i].opacity,
              transform: `translateX(${featureAnims[i].x}px)`,
            }}
          >
            <Checkmark />
            <span
              style={{
                fontFamily,
                fontWeight: 600,
                fontSize: 44,
                color: '#FFFFFF',
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div style={{ opacity: ctaOpacity, transform: `scale(${ctaScale})` }}>
        <span
          style={{
            display: 'inline-block',
            borderRadius: 9999,
            paddingLeft: 64,
            paddingRight: 64,
            paddingTop: 20,
            paddingBottom: 20,
            fontSize: 44,
            fontWeight: 800,
            fontFamily,
            background: `linear-gradient(135deg, ${GREEN} 0%, #46a302 100%)`,
            color: '#fff',
            boxShadow: `0 8px 32px rgba(88,204,2,0.4)`,
          }}
        >
          Start your first lesson!
        </span>
      </div>
    </div>
  );
};

/* ── Video helper (error boundary) ─────────────────────────────────── */

class VideoSafe extends React.Component<
  { src: string; width?: number; height?: number; playbackRate?: number },
  { hasError: boolean }
> {
  constructor(props: { src: string; width?: number; height?: number; playbackRate?: number }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: this.props.width ?? FRAME_W,
            height: this.props.height ?? FRAME_H,
            backgroundColor: '#1a1a2e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 48, color: 'rgba(255,255,255,0.3)' }}>
            FOOTAGE: Gameplay
          </p>
        </div>
      );
    }
    return (
      <OffthreadVideo
        src={this.props.src}
        playbackRate={this.props.playbackRate}
        style={{
          width: this.props.width ?? FRAME_W,
          height: this.props.height ?? FRAME_H,
          objectFit: 'contain',
        }}
      />
    );
  }
}

/* ── Main Composition ──────────────────────────────────────────────── */

export const StrategyReel: React.FC = () => {
  let offset = 0;

  return (
    <div style={{ width: FRAME_W, height: FRAME_H, backgroundColor: BG }}>
      {/* Beat 1: Hook (0-3s) */}
      <Sequence from={offset} durationInFrames={STRAT_BEAT1}>
        <BeatHook />
      </Sequence>

      {/* Beat 2: Chess Path + gameplay video (3-15s) */}
      <Sequence from={(offset += STRAT_BEAT1)} durationInFrames={STRAT_BEAT2}>
        <BeatLearnStrategy />
      </Sequence>

      {/* Beat 3: CTA (15-19s) */}
      <Sequence from={(offset += STRAT_BEAT2)} durationInFrames={STRAT_BEAT3}>
        <BeatCTA />
      </Sequence>
    </div>
  );
};
