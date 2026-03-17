import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';

const { fontFamily } = loadFont();

export type Caption = {
  text: string;
  startFrame: number;
  endFrame: number;
};

/**
 * Burned-in caption overlay for talking-head clips.
 * White bold text with black stroke/shadow, centered in the bottom third.
 * Each caption segment fades in with a quick spring and fades out.
 */
export const BurnedCaption: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find the active caption for this frame
  const active = captions.find((c) => frame >= c.startFrame && frame < c.endFrame);
  if (!active) return null;

  const localFrame = frame - active.startFrame;
  const remaining = active.endFrame - frame;

  // Spring entrance
  const enterScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 200 },
  });
  const enterOpacity = interpolate(enterScale, [0, 1], [0, 1]);

  // Quick fade-out in last 4 frames
  const fadeOut = remaining <= 4
    ? interpolate(remaining, [0, 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  const opacity = enterOpacity * fadeOut;
  const scale = 0.9 + 0.1 * enterScale;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 200,
        left: 60,
        right: 60,
        textAlign: 'center',
        opacity,
        transform: `scale(${scale})`,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <span
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 72,
          color: '#FFFFFF',
          lineHeight: 1.25,
          textShadow: [
            '0 0 12px rgba(0,0,0,0.95)',
            '0 4px 8px rgba(0,0,0,0.8)',
            '2px 2px 0 rgba(0,0,0,0.9)',
            '-2px -2px 0 rgba(0,0,0,0.9)',
            '2px -2px 0 rgba(0,0,0,0.9)',
            '-2px 2px 0 rgba(0,0,0,0.9)',
          ].join(', '),
        }}
      >
        {active.text}
      </span>
    </div>
  );
};

/**
 * Large text caption for screen recording segments.
 * Displayed above the phone frame on a dark background.
 */
export const ScreenCaption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const opacity = interpolate(enterScale, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 80,
        left: 60,
        right: 60,
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
          fontWeight: 700,
          fontSize: 52,
          color: '#FFFFFF',
          margin: 0,
          lineHeight: 1.3,
          textShadow: '0 4px 24px rgba(0,0,0,0.8)',
        }}
      >
        {text}
      </p>
    </div>
  );
};
