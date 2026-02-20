import React from 'react';
import {
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  OffthreadVideo,
  staticFile,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { parseUciMove } from '../lib/puzzle-utils';
import { BoardSlot } from './components/BoardSlot';
import { ReelLogo } from './components/ReelLogo';
import {
  FPS,
  FRAME_H,
  FRAME_W,
  AD_BEAT1_FRAMES,
  AD_BEAT2_FRAMES,
  AD_BEAT3_FRAMES,
  AD_BEAT4_FRAMES,
  AD_BEAT5_FRAMES,
  AD_BEAT6_FRAMES,
  AD_SHORT_BEAT1,
  AD_SHORT_BEAT2,
  AD_SHORT_BEAT3,
  AD_SHORT_BEAT4,
  AD_LONG_BEAT1,
  AD_LONG_BEAT2,
  AD_LONG_BEAT3,
  AD_LONG_BEAT4,
  AD_LONG_BEAT5,
  AD_LONG_BEAT6,
} from './lib/timing';

const { fontFamily } = loadFont();

// ── Matte block styling utilities (duplicated for Remotion bundling) ──
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const factor = amount / 100;
  return rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
}
function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const factor = 1 - amount / 100;
  return rgbToHex(r * factor, g * factor, b * factor);
}
function getMatteBackground(color: string): string {
  return `linear-gradient(to bottom, ${lighten(color, 18)} 0%, ${lighten(color, 12)} 20%, ${color} 40%, ${darken(color, 12)} 100%)`;
}
function getMatteBoxShadow(color: string, scale: number = 1): string {
  const s = (v: number) => `${(v * scale).toFixed(2)}px`;
  return [
    `inset 0 ${s(0.75)} 0 ${darken(color, 6)}`,
    `inset 0 -${s(0.75)} 0 ${lighten(color, 6)}`,
    `0 ${s(0.5)} 0 rgba(0,0,0,0.25)`,
    `0 0 0 ${s(0.5)} rgba(0,0,0,0.15)`,
  ].join(', ');
}

/* ── Constants ──────────────────────────────────────────────────────── */

const BG_DARK = '#0a0a0a';
const GREEN = '#58CC02';

/* ── Puzzle data for Beat 4 (montage) ───────────────────────────────── */

const PUZZLES = [
  {
    label: 'Fork!',
    fen: 'r2q1rk1/ppp2ppp/2n5/3Np3/2B1P1b1/8/PPPP1PPP/R1BQ1RK1 w - - 0 9',
    uci: 'd5f6',
    afterFen: 'r2q1rk1/ppp2ppp/2n2N2/4p3/2B1P1b1/8/PPPP1PPP/R1BQ1RK1 b - - 1 9',
  },
  {
    label: 'Pin!',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    uci: 'c1g5',
    afterFen: 'r1bqkb1r/pppp1ppp/2n2n2/4p1B1/2B1P3/5N2/PPPP1PPP/RN1QK2R b KQkq - 5 4',
  },
  {
    label: 'Checkmate!',
    fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    uci: 'e1e8',
    afterFen: '4R1k1/5ppp/8/8/8/8/5PPP/6K1 b - - 1 1',
  },
];

/* ── Beat 1: "Duolingo, but for Chess" ──────────────────────────────── */

const BeatHookText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Duolingo" appears first
  const word1Scale = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const word1Opacity = interpolate(word1Scale, [0, 1], [0, 1]);

  // "but for" appears next (delayed ~12 frames)
  const word2Frame = Math.max(0, frame - 12);
  const word2Opacity = interpolate(word2Frame, [0, 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const word2Y = interpolate(word2Frame, [0, 8], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "Chess" appears last (delayed ~28 frames) with emphasis
  const word3Frame = Math.max(0, frame - 28);
  const word3Scale = spring({
    frame: word3Frame,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const word3Opacity = interpolate(word3Scale, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG_DARK,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontFamily,
      }}
    >
      {/* Duolingo */}
      <div
        style={{
          opacity: word1Opacity,
          transform: `scale(${word1Scale})`,
        }}
      >
        <p
          style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 120,
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Duolingo
        </p>
      </div>

      {/* but for */}
      <div
        style={{
          opacity: word2Opacity,
          transform: `translateY(${word2Y}px)`,
        }}
      >
        <p
          style={{
            fontFamily,
            fontWeight: 600,
            fontSize: 64,
            color: 'rgba(255,255,255,0.7)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          but for
        </p>
      </div>

      {/* Chess */}
      <div
        style={{
          opacity: word3Opacity,
          transform: `scale(${word3Scale})`,
        }}
      >
        <p
          style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 140,
            color: GREEN,
            margin: 0,
            lineHeight: 1.2,
            textShadow: `0 0 60px ${GREEN}60`,
          }}
        >
          Chess
        </p>
      </div>
    </div>
  );
};

/* ── Beat 2: Logo Flash ─────────────────────────────────────────────── */

const BeatLogoFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;

  // White flash: 0→1 over 3 frames, hold 1 for 1 frame, 1→0 over 3 frames
  const flash = interpolate(frame, [0, 3, 4, 7], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Logo entrance — big spring with overshoot
  const logoScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 8, stiffness: 120 },
  });
  const logoOpacity = interpolate(frame, [5, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Tagline slides up after logo settles
  const tagFrame = Math.max(0, frame - 20);
  const tagOpacity = interpolate(tagFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tagY = interpolate(tagFrame, [0, 12], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG_DARK,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Breathing rook background */}
      <div
        style={{
          position: 'absolute',
          left: (FRAME_W - BG_ROOK_W) / 2,
          top: (FRAME_H - BG_ROOK_H) / 2,
          width: BG_ROOK_W,
          height: BG_ROOK_H,
          opacity: 0.06,
        }}
      >
        {BG_ROOK_BLOCKS.map((block, i) => {
          const dist = Math.sqrt(
            Math.pow(block.x + 7 - BG_ROOK_CENTER_X, 2) +
              Math.pow(block.y + 7 - BG_ROOK_CENTER_Y, 2),
          );
          const normDist = dist / BG_ROOK_MAX_DIST;
          const brightness = 1 + 0.25 * Math.sin(t * 2 * Math.PI + normDist * 0.5);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: block.x * BG_ROOK_SCALE,
                top: block.y * BG_ROOK_SCALE,
                width: BG_ROOK_BLOCK,
                height: BG_ROOK_BLOCK,
                borderRadius: BG_ROOK_RADIUS,
                background: getMatteBackground(block.color),
                boxShadow: getMatteBoxShadow(block.color, BG_ROOK_SCALE),
                filter: `brightness(${brightness})`,
              }}
            />
          );
        })}
      </div>

      {/* Foreground content */}
      <div
        style={{
          position: 'relative',
          width: FRAME_W,
          height: FRAME_H,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        {/* Logo — enters big */}
        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
          <ReelLogo />
        </div>

        {/* Tagline */}
        <div style={{ opacity: tagOpacity, transform: `translateY(${tagY}px)` }}>
          <p
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 64,
              color: '#FFFFFF',
              textAlign: 'center',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            The Fun Way to Learn Chess.
          </p>
        </div>
      </div>

      {/* White flash overlay */}
      {flash > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#FFFFFF',
            opacity: flash,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

/* ── Phone Frame wrapper for footage ───────────────────────────────── */

const PHONE_W = 740;
const PHONE_H = 1480;
const PHONE_RADIUS = 48;
const PHONE_BORDER = 6;

const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: PHONE_W + PHONE_BORDER * 2,
      height: PHONE_H + PHONE_BORDER * 2,
      borderRadius: PHONE_RADIUS + PHONE_BORDER,
      border: `${PHONE_BORDER}px solid rgba(255,255,255,0.2)`,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
      position: 'relative',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: PHONE_W,
        height: PHONE_H,
        borderRadius: PHONE_RADIUS,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {children}
    </div>
  </div>
);

/* ── Beat 3: Path Scroll — Real Footage ─────────────────────────────── */

const BeatPathScroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone scales in
  const phoneScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  // Subtle overlay text
  const textOpacity = interpolate(frame, [10, 20, 50, 60], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG_DARK,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Phone with footage */}
      <div style={{ transform: `scale(${phoneScale})` }}>
        <PhoneFrame>
          <VideoOrPlaceholder
            src={staticFile('learnSC.MP4')}
            label="FOOTAGE: Path Scroll"
            width={PHONE_W}
            height={PHONE_H}
          />
        </PhoneFrame>
      </div>

      {/* Caption above phone */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: textOpacity,
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 60,
            color: '#FFFFFF',
            margin: 0,
            textShadow: '0 4px 24px rgba(0,0,0,0.8)',
          }}
        >
          Dynamic curriculum!
        </p>
      </div>
    </div>
  );
};

/* ── Beat 4: Quick Puzzle Montage ───────────────────────────────────── */

const MONTAGE_PUZZLE_FRAMES = 35; // 35 frames per puzzle

/** Single puzzle solve animation within the montage */
const MontagePuzzle: React.FC<{
  puzzle: (typeof PUZZLES)[number];
}> = ({ puzzle }) => {
  const frame = useCurrentFrame();

  // Board appears immediately; move happens at frame 10
  const showAfter = frame >= 10;
  const fen = showAfter ? puzzle.afterFen : puzzle.fen;

  const { from, to } = parseUciMove(puzzle.uci);
  const hlFrom = showAfter ? from : undefined;
  const hlTo = showAfter ? to : undefined;

  // Label flash after move
  const labelFrame = Math.max(0, frame - 14);
  const labelScale = interpolate(labelFrame, [0, 4, 8], [0.5, 1.15, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const labelOpacity = interpolate(labelFrame, [0, 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Board entrance
  const boardScale = interpolate(frame, [0, 5], [0.95, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const boardOpacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG_DARK,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
      }}
    >
      {/* Board */}
      <div
        style={{
          opacity: boardOpacity,
          transform: `scale(${boardScale})`,
        }}
      >
        <BoardSlot fen={fen} orientation="white" highlightFrom={hlFrom} highlightTo={hlTo} />
      </div>

      {/* Label flash */}
      {showAfter && (
        <div
          style={{
            position: 'absolute',
            bottom: 280,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: labelOpacity,
            transform: `scale(${labelScale})`,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily,
              fontWeight: 800,
              fontSize: 72,
              color: '#FFFFFF',
              backgroundColor: GREEN,
              borderRadius: 24,
              padding: '12px 48px',
              boxShadow: `0 8px 32px ${GREEN}60`,
            }}
          >
            {puzzle.label}
          </span>
        </div>
      )}
    </div>
  );
};

/* ── Beat 5: Daily Challenge — Real Footage ─────────────────────────── */

const BeatDailyChallenge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  const textOpacity = interpolate(frame, [8, 16, 36, 45], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG_DARK,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Phone with footage */}
      <div style={{ transform: `scale(${phoneScale})` }}>
        <PhoneFrame>
          <VideoOrPlaceholder
            src={staticFile('DailyRookSC.MP4')}
            label="FOOTAGE: Daily Challenge"
            width={PHONE_W}
            height={PHONE_H}
          />
        </PhoneFrame>
      </div>

      {/* Caption above phone */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: textOpacity,
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 60,
            color: '#FFFFFF',
            margin: 0,
            textShadow: '0 4px 24px rgba(0,0,0,0.8)',
          }}
        >
          EPIC daily challenge!
        </p>
      </div>
    </div>
  );
};

/* ── Beat 6: CTA End Card ───────────────────────────────────────────── */

const BeatCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const logoOpacity = interpolate(logoScale, [0, 1], [0, 1]);

  // Tagline (staggered by 8 frames)
  const tagFrame = Math.max(0, frame - 8);
  const tagOpacity = interpolate(tagFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tagY = interpolate(tagFrame, [0, 8], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // URL (staggered by 16 frames)
  const urlFrame = Math.max(0, frame - 16);
  const urlOpacity = interpolate(urlFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Free badge (staggered by 24 frames)
  const badgeFrame = Math.max(0, frame - 24);
  const badgeScale = spring({
    frame: badgeFrame,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const badgeOpacity = interpolate(badgeScale, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG_DARK,
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
        <ReelLogo />
      </div>

      {/* Tagline */}
      <div style={{ opacity: tagOpacity, transform: `translateY(${tagY}px)` }}>
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 72,
            color: '#FFFFFF',
            textAlign: 'center',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          The Fun Way to Learn Chess.
        </p>
      </div>

      {/* URL */}
      <div style={{ opacity: urlOpacity }}>
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 52,
            letterSpacing: '0.05em',
            color: '#94A3B8',
            margin: 0,
            textAlign: 'center',
          }}
        >
          chesspath.app
        </p>
      </div>

      {/* Free to play badge */}
      <div style={{ opacity: badgeOpacity, transform: `scale(${badgeScale})` }}>
        <span
          style={{
            display: 'inline-block',
            borderRadius: 9999,
            paddingLeft: 56,
            paddingRight: 56,
            paddingTop: 16,
            paddingBottom: 16,
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            background: `linear-gradient(135deg, ${GREEN} 0%, #46a302 100%)`,
            color: '#fff',
            boxShadow: `0 8px 32px rgba(88,204,2,0.4)`,
          }}
        >
          Free to play
        </span>
      </div>
    </div>
  );
};

/* ── Video/Placeholder helper ───────────────────────────────────────── */

/**
 * Renders an OffthreadVideo if available, otherwise a styled placeholder.
 * Remotion will throw during render if the file doesn't exist, so we use
 * delayRender/continueRender pattern isn't needed — instead we catch the
 * error at the composition level. For preview safety, we wrap in an
 * ErrorBoundary-like pattern using a simple state check.
 */
const VideoOrPlaceholder: React.FC<{
  src: string;
  label: string;
  width?: number;
  height?: number;
}> = ({ src, label, width = FRAME_W, height = FRAME_H }) => {
  return (
    <div style={{ position: 'relative', width, height }}>
      {/* Placeholder (always rendered underneath) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 48,
              color: 'rgba(255,255,255,0.3)',
              margin: 0,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontFamily,
              fontWeight: 500,
              fontSize: 32,
              color: 'rgba(255,255,255,0.15)',
              margin: '16px 0 0',
            }}
          >
            Place video file to replace
          </p>
        </div>
      </div>

      {/* Video layer — renders on top if file exists */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <VideoSafe src={src} width={width} height={height} />
      </div>
    </div>
  );
};

/**
 * Wrapper that catches missing video files gracefully.
 * Uses React error boundary pattern — if OffthreadVideo fails, nothing renders
 * and the placeholder underneath shows through.
 */
class VideoSafe extends React.Component<
  { src: string; width?: number; height?: number },
  { hasError: boolean }
> {
  constructor(props: { src: string; width?: number; height?: number }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    const w = this.props.width ?? FRAME_W;
    const h = this.props.height ?? FRAME_H;
    return (
      <OffthreadVideo
        src={this.props.src}
        style={{
          width: w,
          height: h,
          objectFit: 'cover',
        }}
      />
    );
  }
}

/* ── Beat 6 (Long variant): CTA End Card with extra line ──────────── */

const BeatCTALong: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const logoOpacity = interpolate(logoScale, [0, 1], [0, 1]);

  // Tagline (staggered by 12 frames — more room)
  const tagFrame = Math.max(0, frame - 12);
  const tagOpacity = interpolate(tagFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tagY = interpolate(tagFrame, [0, 10], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // URL (staggered by 28 frames)
  const urlFrame = Math.max(0, frame - 28);
  const urlOpacity = interpolate(urlFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Extra social proof line (staggered by 44 frames)
  const socialFrame = Math.max(0, frame - 44);
  const socialOpacity = interpolate(socialFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const socialY = interpolate(socialFrame, [0, 10], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Free badge (staggered by 60 frames)
  const badgeFrame = Math.max(0, frame - 60);
  const badgeScale = spring({
    frame: badgeFrame,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const badgeOpacity = interpolate(badgeScale, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG_DARK,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        fontFamily,
      }}
    >
      {/* Logo */}
      <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
        <ReelLogo />
      </div>

      {/* Tagline */}
      <div style={{ opacity: tagOpacity, transform: `translateY(${tagY}px)` }}>
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 72,
            color: '#FFFFFF',
            textAlign: 'center',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          The Fun Way to Learn Chess.
        </p>
      </div>

      {/* URL */}
      <div style={{ opacity: urlOpacity }}>
        <p
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 52,
            letterSpacing: '0.05em',
            color: '#94A3B8',
            margin: 0,
            textAlign: 'center',
          }}
        >
          chesspath.app
        </p>
      </div>

      {/* Social proof line */}
      <div style={{ opacity: socialOpacity, transform: `translateY(${socialY}px)` }}>
        <p
          style={{
            fontFamily,
            fontWeight: 600,
            fontSize: 44,
            color: 'rgba(255,255,255,0.6)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Join thousands learning chess
        </p>
      </div>

      {/* Free to play badge */}
      <div style={{ opacity: badgeOpacity, transform: `scale(${badgeScale})` }}>
        <span
          style={{
            display: 'inline-block',
            borderRadius: 9999,
            paddingLeft: 56,
            paddingRight: 56,
            paddingTop: 16,
            paddingBottom: 16,
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            background: `linear-gradient(135deg, ${GREEN} 0%, #46a302 100%)`,
            color: '#fff',
            boxShadow: `0 8px 32px rgba(88,204,2,0.4)`,
          }}
        >
          Free to play
        </span>
      </div>
    </div>
  );
};

/* ── Persistent montage caption (overlays all puzzle boards) ─────── */

const MontageCaption: React.FC<{ top?: number }> = ({ top = 100 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance: spring scale + fade
  const enterScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 150 },
  });
  const opacity = interpolate(enterScale, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        transform: `scale(${enterScale})`,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <p
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 76,
          color: '#FFFFFF',
          margin: 0,
          textShadow: `0 4px 32px rgba(0,0,0,0.9), 0 0 60px ${GREEN}30`,
          lineHeight: 1.2,
        }}
      >
        All the tactics
      </p>
      <p
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 76,
          color: GREEN,
          margin: 0,
          textShadow: `0 4px 32px rgba(0,0,0,0.9), 0 0 40px ${GREEN}40`,
          lineHeight: 1.2,
        }}
      >
        you need to win
      </p>
    </div>
  );
};

/* ── Main Composition (Medium — 12s) ─────────────────────────────── */

export const DuolingoAdReel: React.FC = () => {
  let offset = 0;

  return (
    <div style={{ width: FRAME_W, height: FRAME_H, backgroundColor: BG_DARK }}>
      {/* Beat 1: "Duolingo, but for Chess" (0-2.5s) */}
      <Sequence from={offset} durationInFrames={AD_BEAT1_FRAMES}>
        <BeatHookText />
      </Sequence>

      {/* Beat 2: Logo Flash (2.5-3.5s) */}
      <Sequence from={(offset += AD_BEAT1_FRAMES)} durationInFrames={AD_BEAT2_FRAMES}>
        <BeatLogoFlash />
      </Sequence>

      {/* Beat 3: Path Scroll — Real Footage (3.5-5.5s) */}
      <Sequence from={(offset += AD_BEAT2_FRAMES)} durationInFrames={AD_BEAT3_FRAMES}>
        <BeatPathScroll />
      </Sequence>

      {/* Beat 4: Quick Puzzle Montage (5.5-9s) — 3 puzzles x 35 frames */}
      {PUZZLES.map((puzzle, i) => (
        <Sequence
          key={i}
          from={(i === 0 ? (offset += AD_BEAT3_FRAMES) : offset) + i * MONTAGE_PUZZLE_FRAMES}
          durationInFrames={MONTAGE_PUZZLE_FRAMES}
        >
          <MontagePuzzle puzzle={puzzle} />
        </Sequence>
      ))}
      {/* Persistent caption over entire montage */}
      <Sequence from={offset} durationInFrames={AD_BEAT4_FRAMES}>
        <MontageCaption />
      </Sequence>

      {/* Beat 5: Daily Challenge — Real Footage (9-10.5s) */}
      <Sequence
        from={(offset += AD_BEAT4_FRAMES)}
        durationInFrames={AD_BEAT5_FRAMES}
      >
        <BeatDailyChallenge />
      </Sequence>

      {/* Beat 6: CTA End Card (10.5-12s) */}
      <Sequence from={(offset += AD_BEAT5_FRAMES)} durationInFrames={AD_BEAT6_FRAMES}>
        <BeatCTA />
      </Sequence>
    </div>
  );
};

/* ── Short: Feature List CTA ──────────────────────────────────────── */

const FEATURES = [
  'Beginner friendly',
  'Puzzles for every level',
  'Daily challenges',
];

/* Breathing rook blocks (same data as ReelLogo but rendered large as background) */
const BG_ROOK_BLOCKS = [
  { x: 4, y: 8, color: '#1CB0F6' },
  { x: 40, y: 8, color: '#2FCBEF' },
  { x: 76, y: 8, color: '#A560E8' },
  { x: 4, y: 26, color: '#58CC02' },
  { x: 22, y: 26, color: '#FFC800' },
  { x: 40, y: 26, color: '#FF9600' },
  { x: 58, y: 26, color: '#FF6B6B' },
  { x: 76, y: 26, color: '#FF4B4B' },
  { x: 22, y: 44, color: '#1CB0F6' },
  { x: 40, y: 44, color: '#2FCBEF' },
  { x: 58, y: 44, color: '#A560E8' },
  { x: 22, y: 62, color: '#58CC02' },
  { x: 40, y: 62, color: '#FFC800' },
  { x: 58, y: 62, color: '#FF9600' },
  { x: 22, y: 80, color: '#FF6B6B' },
  { x: 40, y: 80, color: '#FF4B4B' },
  { x: 58, y: 80, color: '#1CB0F6' },
  { x: 4, y: 98, color: '#2FCBEF' },
  { x: 22, y: 98, color: '#A560E8' },
  { x: 40, y: 98, color: '#58CC02' },
  { x: 58, y: 98, color: '#FFC800' },
  { x: 76, y: 98, color: '#FF9600' },
];

const BG_ROOK_CENTER_X = 47;
const BG_ROOK_CENTER_Y = 60;
const BG_ROOK_MAX_DIST = Math.max(
  ...BG_ROOK_BLOCKS.map((b) =>
    Math.sqrt(Math.pow(b.x + 7 - BG_ROOK_CENTER_X, 2) + Math.pow(b.y + 7 - BG_ROOK_CENTER_Y, 2)),
  ),
);
const BG_ROOK_SCALE = 8;
const BG_ROOK_BLOCK = 14 * BG_ROOK_SCALE;
const BG_ROOK_RADIUS = 2 * BG_ROOK_SCALE;
const BG_ROOK_W = (76 + 14) * BG_ROOK_SCALE;
const BG_ROOK_H = (98 + 14) * BG_ROOK_SCALE;

/** Green checkmark SVG */
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

const BeatFeatureCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;

  // Logo entrance
  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const logoOpacity = interpolate(logoScale, [0, 1], [0, 1]);

  // Features stagger in
  const featureAnims = FEATURES.map((_, i) => {
    const f = Math.max(0, frame - 12 - i * 12);
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

  // Tagline after features
  const tagFrame = Math.max(0, frame - 55);
  const tagOpacity = interpolate(tagFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // URL + badge
  const urlFrame = Math.max(0, frame - 68);
  const urlOpacity = interpolate(urlFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const badgeFrame = Math.max(0, frame - 80);
  const badgeScale = spring({
    frame: badgeFrame,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const badgeOpacity = interpolate(badgeScale, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: BG_DARK,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Breathing rook background — centered, large, low opacity */}
      <div
        style={{
          position: 'absolute',
          left: (FRAME_W - BG_ROOK_W) / 2,
          top: (FRAME_H - BG_ROOK_H) / 2,
          width: BG_ROOK_W,
          height: BG_ROOK_H,
          opacity: 0.08,
        }}
      >
        {BG_ROOK_BLOCKS.map((block, i) => {
          const dist = Math.sqrt(
            Math.pow(block.x + 7 - BG_ROOK_CENTER_X, 2) +
              Math.pow(block.y + 7 - BG_ROOK_CENTER_Y, 2),
          );
          const normDist = dist / BG_ROOK_MAX_DIST;
          const brightness = 1 + 0.25 * Math.sin(t * 2 * Math.PI + normDist * 0.5);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: block.x * BG_ROOK_SCALE,
                top: block.y * BG_ROOK_SCALE,
                width: BG_ROOK_BLOCK,
                height: BG_ROOK_BLOCK,
                borderRadius: BG_ROOK_RADIUS,
                background: getMatteBackground(block.color),
                boxShadow: getMatteBoxShadow(block.color, BG_ROOK_SCALE),
                filter: `brightness(${brightness})`,
              }}
            />
          );
        })}
      </div>

      {/* Foreground content */}
      <div
        style={{
          position: 'relative',
          width: FRAME_W,
          height: FRAME_H,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
          fontFamily,
        }}
      >
        {/* Logo */}
        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})`, marginBottom: 16 }}>
          <ReelLogo />
        </div>

        {/* Feature list with checkmarks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {FEATURES.map((text, i) => (
            <div
              key={i}
              style={{
                opacity: featureAnims[i].opacity,
                transform: `translateX(${featureAnims[i].x}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <Checkmark />
              <span
                style={{
                  fontFamily,
                  fontWeight: 600,
                  fontSize: 52,
                  color: '#FFFFFF',
                }}
              >
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div style={{ opacity: tagOpacity, marginTop: 24 }}>
          <p
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 64,
              color: '#FFFFFF',
              textAlign: 'center',
              margin: 0,
            }}
          >
            The Fun Way to Learn Chess.
          </p>
        </div>

        {/* URL */}
        <div style={{ opacity: urlOpacity }}>
          <p
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 48,
              letterSpacing: '0.05em',
              color: '#94A3B8',
              margin: 0,
            }}
          >
            chesspath.app
          </p>
        </div>

        {/* Free badge */}
        <div style={{ opacity: badgeOpacity, transform: `scale(${badgeScale})` }}>
          <span
            style={{
              display: 'inline-block',
              borderRadius: 9999,
              paddingLeft: 48,
              paddingRight: 48,
              paddingTop: 14,
              paddingBottom: 14,
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              background: `linear-gradient(135deg, ${GREEN} 0%, #46a302 100%)`,
              color: '#fff',
              boxShadow: `0 8px 32px rgba(88,204,2,0.4)`,
            }}
          >
            Free to play
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Short Composition (7s = 210 frames) ─────────────────────────── */

export const DuolingoAdReelShort: React.FC = () => {
  return (
    <div style={{ width: FRAME_W, height: FRAME_H, backgroundColor: BG_DARK }}>
      {/* Beat 1: "Duolingo, but for Chess" (0-3s) */}
      <Sequence from={0} durationInFrames={AD_SHORT_BEAT1}>
        <BeatHookText />
      </Sequence>

      {/* Beat 2: Feature list CTA (3-7s) */}
      <Sequence from={AD_SHORT_BEAT1} durationInFrames={AD_SHORT_BEAT2 + AD_SHORT_BEAT3 + AD_SHORT_BEAT4}>
        <BeatFeatureCTA />
      </Sequence>
    </div>
  );
};

/* ── Long Composition (20s = 600 frames) ─────────────────────────── */

const LONG_MONTAGE_PUZZLE_FRAMES = 80; // 2.7s per puzzle — room to breathe

export const DuolingoAdReelLong: React.FC = () => {
  let offset = 0;

  return (
    <div style={{ width: FRAME_W, height: FRAME_H, backgroundColor: BG_DARK }}>
      {/* Beat 1: "Duolingo, but for Chess" (0-3s) — more hold time */}
      <Sequence from={offset} durationInFrames={AD_LONG_BEAT1}>
        <BeatHookText />
      </Sequence>

      {/* Beat 2: Logo Flash (3-4s) */}
      <Sequence from={(offset += AD_LONG_BEAT1)} durationInFrames={AD_LONG_BEAT2}>
        <BeatLogoFlash />
      </Sequence>

      {/* Beat 3: Path Scroll — longer footage clip (4-7s) */}
      <Sequence from={(offset += AD_LONG_BEAT2)} durationInFrames={AD_LONG_BEAT3}>
        <BeatPathScroll />
      </Sequence>

      {/* Beat 4: Puzzle Montage (7-12s) — 3 puzzles x 80 frames each */}
      {PUZZLES.map((puzzle, i) => (
        <Sequence
          key={i}
          from={(i === 0 ? (offset += AD_LONG_BEAT3) : offset) + i * LONG_MONTAGE_PUZZLE_FRAMES}
          durationInFrames={LONG_MONTAGE_PUZZLE_FRAMES}
        >
          <MontagePuzzle puzzle={puzzle} />
        </Sequence>
      ))}
      {/* Persistent caption over entire montage */}
      <Sequence from={offset} durationInFrames={AD_LONG_BEAT4}>
        <MontageCaption top={280} />
      </Sequence>

      {/* Beat 5: Daily Challenge — longer footage clip (12-16s) */}
      <Sequence from={(offset += AD_LONG_BEAT4)} durationInFrames={AD_LONG_BEAT5}>
        <BeatDailyChallenge />
      </Sequence>

      {/* Beat 6: CTA End Card with social proof (16-20s) */}
      <Sequence from={(offset += AD_LONG_BEAT5)} durationInFrames={AD_LONG_BEAT6}>
        <BeatFeatureCTA />
      </Sequence>
    </div>
  );
};
