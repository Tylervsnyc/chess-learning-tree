import React from 'react';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { ReelLayout } from '../components/ReelLayout';
import { BottomCard } from '../components/BottomCard';

const { fontFamily } = loadFont();

/**
 * Stage 1: "Can you find the solution?" (4s / 120 frames)
 * Board shows starting puzzle position. Static — no animations.
 */
export const StageInitial: React.FC<{
  puzzleFen: string;
  orientation: 'white' | 'black';
  playerColorLabel: string;
  setupFrom: string;
  setupTo: string;
  difficult?: boolean;
}> = ({ puzzleFen, orientation, playerColorLabel, setupFrom, setupTo, difficult }) => {
  return (
    <ReelLayout
      fen={puzzleFen}
      orientation={orientation}
      difficult={difficult}
      highlightFrom={setupFrom}
      highlightTo={setupTo}
      bottomContent={
        <BottomCard>
          <p
            style={{
              fontFamily,
              fontWeight: 600,
              fontSize: 68,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Can you find the solution?
          </p>
          <p
            style={{
              fontFamily,
              fontWeight: 500,
              fontSize: 44,
              color: 'rgba(255,255,255,0.7)',
              margin: '8px 0 0',
            }}
          >
            {playerColorLabel} to play
          </p>
        </BottomCard>
      }
    />
  );
};
