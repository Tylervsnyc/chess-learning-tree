import React from 'react';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { ReelLayout } from '../components/ReelLayout';
import { BottomCard } from '../components/BottomCard';
import { ResultPopup } from '../components/ResultPopup';

const { fontFamily } = loadFont();

/**
 * Stage 4: Celebration — result overlay on board + quip in bottom card.
 * 3s / 90 frames. Static — the celebration moment.
 */
export const StageCelebrate: React.FC<{
  finalFen: string;
  orientation: 'white' | 'black';
  result: string;
  quip: string;
  lastMoveFrom: string;
  lastMoveTo: string;
  difficult?: boolean;
}> = ({ finalFen, orientation, result, quip, lastMoveFrom, lastMoveTo, difficult }) => {
  return (
    <ReelLayout
      fen={finalFen}
      orientation={orientation}
      difficult={difficult}
      highlightFrom={lastMoveFrom}
      highlightTo={lastMoveTo}
      boardOverlay={<ResultPopup result={result} />}
      bottomContent={
        <BottomCard>
          <p
            style={{
              fontFamily,
              fontWeight: 600,
              fontSize: 64,
              fontStyle: 'italic',
              color: '#FFFFFF',
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            &ldquo;{quip}&rdquo;
          </p>
        </BottomCard>
      }
    />
  );
};
