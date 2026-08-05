import React from 'react';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { ReelLayout } from '../components/ReelLayout';
import { BottomCard } from '../components/BottomCard';

const { fontFamily } = loadFont();

/**
 * Stage 1: the setup (2s / 60 frames). Board shows the puzzle position.
 *
 * This card says ONE thing — whose move it is. No tactic, no mate count, no
 * "can you find it" framing. Anything before the reveal that describes the
 * answer robs the viewer of the puzzle (RULES.md §44, no-spoiler rule).
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
              fontWeight: 700,
              fontSize: 84,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {playerColorLabel} to move
          </p>
        </BottomCard>
      }
    />
  );
};
