import React from 'react';
import { useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { ReelLayout } from '../components/ReelLayout';
import { BottomCard } from '../components/BottomCard';
import { COUNTDOWN_INTERVAL_FRAMES } from '../lib/timing';

const { fontFamily } = loadFont();

/**
 * Stage 2: Countdown — "Solution in 3" → "Solution in 2" → "Solution in 1" → "GO!"
 * 4s / 120 frames. Board unchanged.
 */
export const StageCountdown: React.FC<{
  puzzleFen: string;
  orientation: 'white' | 'black';
  setupFrom: string;
  setupTo: string;
}> = ({ puzzleFen, orientation, setupFrom, setupTo }) => {
  const frame = useCurrentFrame();

  // 30 frames per count: 0-29=3, 30-59=2, 60-89=1, 90+=GO!
  const countdownIndex = Math.floor(frame / COUNTDOWN_INTERVAL_FRAMES);
  const countdownValues = [3, 2, 1, 0];
  const count = countdownValues[Math.min(countdownIndex, countdownValues.length - 1)];

  return (
    <ReelLayout
      fen={puzzleFen}
      orientation={orientation}
      highlightFrom={setupFrom}
      highlightTo={setupTo}
      bottomContent={
        <BottomCard>
          <p
            style={{
              fontFamily,
              fontWeight: 600,
              fontSize: 72,
              color: '#FFFFFF',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {count > 0 ? `Solution in ${count}` : 'GO!'}
          </p>
          <p
            style={{
              fontFamily,
              fontWeight: 400,
              fontSize: 32,
              color: 'rgba(255,255,255,0.5)',
              margin: '4px 0 0',
            }}
          >
            (Tap Screen to Pause)
          </p>
        </BottomCard>
      }
    />
  );
};
