import React from 'react';
import { loadFont } from '../lib/dm-sans';
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
}> = ({ finalFen, orientation, result, quip, lastMoveFrom, lastMoveTo }) => {
  return (
    <ReelLayout
      fen={finalFen}
      orientation={orientation}
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
