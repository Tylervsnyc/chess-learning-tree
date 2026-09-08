import React from 'react';
import { staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { ReelLogo } from '../components/ReelLogo';
import { AppStoreBadge } from '../components/AppStoreBadge';
import { EndCardBackdrop } from '../components/EndCardBackdrop';
import { FRAME_W, FRAME_H, SAFE_PAD } from '../lib/timing';

const { fontFamily } = loadFont();

const APPS = [
  { name: 'Chess Path', sub: 'Learn + play', icon: 'family/appicon/chesspath.png', from: -1 },
  { name: 'Chess Boxing', sub: 'Train + fight', icon: 'family/appicon/chessboxing.png', from: 1 },
];

const ICON = 320;
/** Frames after an icon's spring starts that it reads as having landed. */
export const ICON_LAND = 16;
/** When each icon's spring starts — the sound cues off these. */
export const ICON_STARTS = [14, 40];
/** When the App Store badge reads as having landed — its own sound cues here. */
export const BADGE_LAND = 98;

/**
 * The App Store end card — both iOS apps fly in, then the store badge lands.
 * Runs as Stage 5 of the daily puzzle reel (3s) and as the whole of the
 * standalone announcement reel, so the animation has to read fast and then
 * sit still: everything is settled by ~1.6s and holds for as long as it's given.
 */
export const StageApps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headline = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // The badge is the point of the card, so it lands last and lands hardest.
  const badge = spring({ frame: frame - 82, fps, config: { damping: 13, stiffness: 95 } });
  const badgeSince = Math.max(0, frame - 98);
  const badgeBounce = frame >= 98 ? Math.exp(-badgeSince / 7) * Math.cos(badgeSince / 3.6) : 0;

  const footer = interpolate(frame, [106, 124], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: FRAME_W,
        height: FRAME_H,
        backgroundColor: '#EBF0F5',
        position: 'relative',
        fontFamily,
        padding: SAFE_PAD,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 64,
        overflow: 'hidden',
      }}
    >
      <EndCardBackdrop />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64 }}>
      <ReelLogo />

      <p
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 76,
          color: '#2A3C45',
          margin: 0,
          textAlign: 'center',
          lineHeight: 1.15,
          opacity: headline,
        }}
      >
        Now on the App Store
      </p>

      <div style={{ display: 'flex', gap: 88, alignItems: 'flex-start' }}>
        {APPS.map((app, i) => {
          // Each icon flies in from its own side on a slow spring, then LANDS:
          // a short squash-and-settle at the impact frame. The travel is calm,
          // the arrival is not — that contrast is what the pop sound is for.
          const start = ICON_STARTS[i];
          const t = spring({ frame: frame - start, fps, config: { damping: 16, stiffness: 62 } });
          const x = interpolate(t, [0, 1], [app.from * 780, 0]);
          const rot = interpolate(t, [0, 1], [app.from * 14, 0]);

          const since = Math.max(0, frame - (start + ICON_LAND));
          // one decaying bounce: overshoot, squash, settle by ~20 frames
          const bounce = Math.exp(-since / 6.5) * Math.cos(since / 3.4);
          const landed = frame >= start + ICON_LAND ? 1 : 0;
          const sx = interpolate(t, [0, 0.7, 1], [0.82, 1.04, 1]) * (1 + 0.11 * bounce * landed);
          const sy = interpolate(t, [0, 0.7, 1], [0.82, 1.04, 1]) * (1 - 0.09 * bounce * landed);
          // the shadow spreads on impact, then tightens back
          const lift = 1 + 0.55 * Math.max(0, bounce) * landed;

          // Label follows the icon in, a beat later.
          const label = interpolate(frame - start, [26, 44], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={app.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 24,
                width: ICON + 40,
              }}
            >
              <img
                src={staticFile(app.icon)}
                width={ICON}
                height={ICON}
                style={{
                  width: ICON,
                  height: ICON,
                  borderRadius: ICON * 0.225,
                  boxShadow: `0 ${24 * lift}px ${48 * lift}px rgba(42,60,69,${0.28 / lift})`,
                  transform: `translateX(${x}px) rotate(${rot}deg) scale(${sx}, ${sy})`,
                  transformOrigin: 'center bottom',
                }}
              />
              <p
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 46,
                  color: '#2A3C45',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.15,
                  opacity: label,
                }}
              >
                {app.name}
              </p>
              <p
                style={{
                  fontFamily,
                  fontWeight: 600,
                  fontSize: 34,
                  color: 'rgba(42,60,69,0.68)',
                  margin: 0,
                  textAlign: 'center',
                  opacity: label,
                }}
              >
                {app.sub}
              </p>
            </div>
          );
        })}
      </div>

      <div
        style={{
          transform: `scale(${badge * (1 + 0.06 * badgeBounce)}) translateY(${interpolate(badge, [0, 1], [40, 0])}px)`,
          opacity: badge,
        }}
      >
        <AppStoreBadge height={110} />
      </div>

      <p
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: '0.05em',
          color: 'rgba(42,60,69,0.74)',
          margin: 0,
          textAlign: 'center',
          opacity: footer,
        }}
      >
        chesspath.app
      </p>
      </div>
    </div>
  );
};
