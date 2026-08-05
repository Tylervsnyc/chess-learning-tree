import React from 'react';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { ReelLayout } from '../components/ReelLayout';
import { BottomCard } from '../components/BottomCard';
import { ResultPopup } from '../components/ResultPopup';

const { fontFamily } = loadFont();

/**
 * Stage 4: the payoff — result overlay on the board, and in the bottom card the
 * explanation of WHY the solution works, with the quip underneath.
 * 5s / 150 frames. Static — the celebration moment.
 *
 * This is where the smart line belongs. Everything before the reveal says only
 * whose move it is (RULES.md §44, no-spoiler rule), so the insight has to land
 * here or it never lands at all.
 */
export const StageCelebrate: React.FC<{
  finalFen: string;
  orientation: 'white' | 'black';
  result: string;
  quip: string;
  insight?: string;
  lastMoveFrom: string;
  lastMoveTo: string;
  difficult?: boolean;
}> = ({ finalFen, orientation, result, quip, insight, lastMoveFrom, lastMoveTo, difficult }) => {
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
          {insight && (
            <p
              style={{
                fontFamily,
                fontWeight: 700,
                // The explanation is the point of this card, so it leads. Long
                // lines shrink rather than overflow the 272px card.
                fontSize: insight.length > 64 ? 40 : insight.length > 44 ? 46 : 54,
                letterSpacing: '-0.01em',
                color: '#FFFFFF',
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              {insight}
            </p>
          )}
          <p
            style={{
              fontFamily,
              fontWeight: 600,
              fontSize: insight ? 38 : 64,
              fontStyle: 'italic',
              color: insight ? 'rgba(255,255,255,0.65)' : '#FFFFFF',
              lineHeight: 1.3,
              margin: insight ? '14px 0 0' : 0,
            }}
          >
            &ldquo;{quip}&rdquo;
          </p>
        </BottomCard>
      }
    />
  );
};
