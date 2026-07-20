import React from 'react';
import {
  Sequence,
  Audio,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  OffthreadVideo,
  staticFile,
} from 'remotion';
import { loadFont } from './lib/dm-sans';
import { ReelLogo } from './components/ReelLogo';
import { BurnedCaption, ScreenCaption, type Caption } from './components/BurnedCaption';
import { FRAME_W, FRAME_H, FPS, MKT_CTA_FRAMES } from './lib/timing';

const { fontFamily } = loadFont();

const BG_DARK = '#0a0a0a';
const GREEN = '#58CC02';

/* ── Phone Frame (reused from DuolingoAdReel pattern) ─────────────── */

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

/* ── VideoSafe error boundary ─────────────────────────────────────── */

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
        style={{ width: w, height: h, objectFit: 'cover' }}
      />
    );
  }
}

const VideoOrPlaceholder: React.FC<{
  src: string;
  label: string;
  width?: number;
  height?: number;
}> = ({ src, label, width = FRAME_W, height = FRAME_H }) => (
  <div style={{ position: 'relative', width, height }}>
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
        <p style={{ fontFamily, fontWeight: 700, fontSize: 48, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
          {label}
        </p>
        <p style={{ fontFamily, fontWeight: 500, fontSize: 32, color: 'rgba(255,255,255,0.15)', margin: '16px 0 0' }}>
          Place video file to replace
        </p>
      </div>
    </div>
    <div style={{ position: 'absolute', inset: 0 }}>
      <VideoSafe src={src} width={width} height={height} />
    </div>
  </div>
);

/* ── Beat 1: Talking Head with Burned Captions ────────────────────── */

const BeatTalkingHead: React.FC<{
  src: string;
  captions: Caption[];
  durationInFrames: number;
}> = ({ src, captions }) => {
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
      <VideoOrPlaceholder
        src={src}
        label="FOOTAGE: Talking Head"
        width={FRAME_W}
        height={FRAME_H}
      />
      <BurnedCaption captions={captions} />
    </div>
  );
};

/* ── Beat 2: Screen Recording in Phone Frame ──────────────────────── */

const BeatScreenRecording: React.FC<{
  src: string;
  caption: string;
}> = ({ src, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 160 },
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
      <div style={{ transform: `scale(${phoneScale})` }}>
        <PhoneFrame>
          <VideoOrPlaceholder
            src={src}
            label="FOOTAGE: Screen Recording"
            width={PHONE_W}
            height={PHONE_H}
          />
        </PhoneFrame>
      </div>
      <ScreenCaption text={caption} />
    </div>
  );
};

/* ── Feature buttons (matching header nav style) ──────────────────── */

const FEATURES = [
  { label: 'Path', sublabel: 'Tactics Trainer', color: GREEN, shadow: '#46a302' },
  { label: 'Openings', sublabel: 'Opening Explorer', color: '#CE82FF', shadow: '#a050d0' },
  { label: 'Daily', sublabel: 'Daily Challenge', color: '#1CB0F6', shadow: '#0d9ee0' },
];

const FeatureButton: React.FC<{
  feature: (typeof FEATURES)[number];
  delay: number;
}> = ({ feature, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const f = Math.max(0, frame - delay);
  const scale = spring({ frame: f, fps, config: { damping: 12, stiffness: 180 } });
  const opacity = interpolate(scale, [0, 1], [0, 1]);

  return (
    <div style={{ opacity, transform: `scale(${scale})`, display: 'flex', alignItems: 'center', gap: 28 }}>
      {/* Nav-style button pill */}
      <span
        style={{
          display: 'inline-block',
          fontFamily,
          fontWeight: 700,
          fontSize: 40,
          color: '#FFFFFF',
          background: feature.color,
          borderRadius: 16,
          padding: '14px 36px',
          boxShadow: `0 4px 0 0 ${feature.shadow}, 0 8px 24px ${feature.color}40`,
          whiteSpace: 'nowrap',
        }}
      >
        {feature.label}
      </span>
      {/* Description label */}
      <span
        style={{
          fontFamily,
          fontWeight: 600,
          fontSize: 44,
          color: 'rgba(255,255,255,0.85)',
          whiteSpace: 'nowrap',
        }}
      >
        {feature.sublabel}
      </span>
    </div>
  );
};

/* ── Beat 3: BeatCTA (logo + features + url + free badge) ─────────── */

const BeatCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const logoOpacity = interpolate(logoScale, [0, 1], [0, 1]);

  const urlFrame = Math.max(0, frame - 50);
  const urlOpacity = interpolate(urlFrame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const badgeFrame = Math.max(0, frame - 60);
  const badgeScale = spring({ frame: badgeFrame, fps, config: { damping: 10, stiffness: 180 } });
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
        <ReelLogo darkBg />
      </div>

      {/* Feature buttons — staggered entrance */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 16 }}>
        {FEATURES.map((feat, i) => (
          <FeatureButton key={feat.label} feature={feat} delay={12 + i * 10} />
        ))}
      </div>

      {/* URL */}
      <div style={{ opacity: urlOpacity, marginTop: 16 }}>
        <p style={{ fontFamily, fontWeight: 700, fontSize: 52, letterSpacing: '0.05em', color: '#94A3B8', margin: 0, textAlign: 'center' }}>
          chesspath.app
        </p>
      </div>

      {/* Free to play badge */}
      <div style={{ opacity: badgeOpacity, transform: `scale(${badgeScale})` }}>
        <span
          style={{
            display: 'inline-block',
            borderRadius: 9999,
            paddingLeft: 56, paddingRight: 56, paddingTop: 16, paddingBottom: 16,
            fontSize: 44, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            background: `linear-gradient(135deg, ${GREEN} 0%, #46a302 100%)`,
            color: '#fff',
            boxShadow: '0 8px 32px rgba(88,204,2,0.4)',
          }}
        >
          Free to play
        </span>
      </div>
    </div>
  );
};

/* ── Standalone CTA endcap ─────────────────────────────────────────── */

export const MarketingReelCTA: React.FC = () => (
  <div style={{ width: FRAME_W, height: FRAME_H, backgroundColor: BG_DARK }}>
    <Sequence from={0} durationInFrames={MKT_CTA_FRAMES}>
      <BeatCTA />
    </Sequence>
  </div>
);

/* ── MarketingReel: Shared composition for all 3 videos ───────────── */

export interface MarketingReelProps {
  talkingHeadSrc: string;
  talkingHeadFrames: number;
  screenRecordingSrc: string;
  screenRecordingFrames: number;
  captions: Caption[];
  screenCaption: string;
  /** Path relative to /public — e.g. "music/bg-track.mp3". Omit to skip music. */
  musicSrc?: string;
  /** 0–1, default 0.3 (low enough to not overpower speech) */
  musicVolume?: number;
}

export const MarketingReel: React.FC<MarketingReelProps> = ({
  talkingHeadSrc,
  talkingHeadFrames,
  screenRecordingSrc,
  screenRecordingFrames,
  captions,
  screenCaption,
  musicSrc,
  musicVolume = 0.3,
}) => {
  const screenStart = talkingHeadFrames;
  const ctaStart = screenStart + screenRecordingFrames;

  return (
    <div style={{ width: FRAME_W, height: FRAME_H, backgroundColor: BG_DARK }}>
      {/* Background music — drop an mp3 in /public and pass musicSrc */}
      {musicSrc && (
        <Audio src={staticFile(musicSrc)} volume={musicVolume} />
      )}

      {/* Beat 1: Talking Head + Burned Captions */}
      <Sequence from={0} durationInFrames={talkingHeadFrames}>
        <BeatTalkingHead
          src={staticFile(talkingHeadSrc)}
          captions={captions}
          durationInFrames={talkingHeadFrames}
        />
      </Sequence>

      {/* Beat 2: Screen Recording in Phone Frame */}
      <Sequence from={screenStart} durationInFrames={screenRecordingFrames}>
        <BeatScreenRecording
          src={staticFile(screenRecordingSrc)}
          caption={screenCaption}
        />
      </Sequence>

      {/* Beat 3: CTA End Card */}
      <Sequence from={ctaStart} durationInFrames={MKT_CTA_FRAMES}>
        <BeatCTA />
      </Sequence>
    </div>
  );
};

/* ── Video 1: "Don't Know How to Checkmate" (~23s) ────────────────── */
// New version: pre-edited clip (18.8s, has its own subtitles) + BeatCTA endcap

export const MarketingReelCheckmate: React.FC = () => {
  const clipFrames = 564; // 18.8s @ 30fps
  return (
    <div style={{ width: FRAME_W, height: FRAME_H, backgroundColor: BG_DARK }}>
      <Sequence from={0} durationInFrames={clipFrames}>
        <VideoOrPlaceholder
          src={staticFile('3.4 videos/dontknowcheckmate.mp4')}
          label="FOOTAGE: Don't Know Checkmate"
          width={FRAME_W}
          height={FRAME_H}
        />
      </Sequence>
      <Sequence from={clipFrames} durationInFrames={MKT_CTA_FRAMES}>
        <BeatCTA />
      </Sequence>
    </div>
  );
};

/* ── Video 2: "Always Wanted to Learn Chess" (~25s) ───────────────── */

// 12.38s = 371 frames. Adjust startFrame/endFrame after previewing.
const BEGINNER_CAPTIONS: Caption[] = [
  { text: "Have you always wanted\nto get better at chess", startFrame: 0, endFrame: 80 },
  { text: "but you don't know\nwhere to begin?", startFrame: 85, endFrame: 160 },
  { text: "Great, I made Chess Path\njust for you.", startFrame: 165, endFrame: 270 },
  { text: "Here's how it works.", startFrame: 275, endFrame: 371 },
];

export const MarketingReelBeginner: React.FC = () => (
  <MarketingReel
    talkingHeadSrc="3.4 videos/alwayswantedtolearnchess.MOV"
    talkingHeadFrames={371} // 12.38s @ 30fps
    screenRecordingSrc="3.4 videos/tutorialvid.MP4"
    screenRecordingFrames={240} // 8s
    captions={BEGINNER_CAPTIONS}
    screenCaption="A colorful tutorial that walks you through everything — from how pieces move to your first checkmate"
  />
);

/* ── Video 3: "Stuck Between 800-1500" (~25s) ─────────────────────── */

// 12.96s = 389 frames. Adjust startFrame/endFrame after previewing.
const INTERMEDIATE_CAPTIONS: Caption[] = [
  { text: "Are you stuck between\n800 and 1500 ELO in chess", startFrame: 0, endFrame: 90 },
  { text: "and you don't know\nhow to improve?", startFrame: 95, endFrame: 175 },
  { text: "Great, I made Chess Path\njust for you.", startFrame: 180, endFrame: 290 },
  { text: "Here's how it works.", startFrame: 295, endFrame: 389 },
];

export const MarketingReelIntermediate: React.FC = () => (
  <MarketingReel
    talkingHeadSrc="3.4 videos/stuck8001500.MOV"
    talkingHeadFrames={389} // 12.96s @ 30fps
    screenRecordingSrc="3.4 videos/lvltestvid.MP4"
    screenRecordingFrames={240} // 8s
    captions={INTERMEDIATE_CAPTIONS}
    screenCaption="Skip the tutorial and find the Level Test that feels right for you"
  />
);
