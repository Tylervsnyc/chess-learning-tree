import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { StageApps, ICON_STARTS, ICON_LAND, BADGE_LAND } from './stages/StageApps';
import { FPS } from './lib/timing';

const sec = (s: number) => Math.round(s * FPS);

/**
 * The standalone announcement post: the App Store end card on its own — the
 * apps fly in, the badge lands.
 *
 * Sound is two things only: the UI pop as each icon lands, and the same
 * background track the app plays under /play. Anything more (thuds, stingers,
 * a ceremony hit) read as noise on a phone speaker.
 */
export const APPS_LAUNCH_TOTAL = sec(10);

// One pop per landing, cued off the card's own landing frames so the sound
// and the squash happen on the same frame.
const POP_FRAMES = ICON_STARTS.map((f) => f + ICON_LAND);

export const AppsLaunchReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#EBF0F5' }}>
      <StageApps />

      {/* /play background music, well under the pops */}
      <Audio
        src={staticFile('music/dust-on-the-cartridge.mp3')}
        // start half a second into the track — past the very top of the
        // fade-up, but keeping the run-in Tyler wanted back
        trimBefore={sec(0.5)}
        volume={(f) =>
          interpolate(
            f,
            [0, 3, APPS_LAUNCH_TOTAL - 50, APPS_LAUNCH_TOTAL],
            [0, 0.24, 0.24, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )
        }
      />

      {POP_FRAMES.map((f, i) => (
        <Sequence key={f} from={f} durationInFrames={sec(1.6)}>
          <Audio src={staticFile('sounds/ui/icon-pop-a.mp3')} volume={0.22 - i * 0.02} />
        </Sequence>
      ))}

      {/* the badge gets its own, heavier click — it's the payoff beat */}
      <Sequence from={BADGE_LAND} durationInFrames={sec(1.6)}>
        <Audio src={staticFile('sounds/ui/icon-pop-b.mp3')} volume={0.24} />
      </Sequence>
    </AbsoluteFill>
  );
};
