import React from 'react';
import { Composition } from 'remotion';
import { DailyPuzzleVideo, type DailyPuzzleVideoProps } from './DailyPuzzleVideo';
import { FPS, FRAME_W, FRAME_H, totalFrames } from './lib/timing';

const defaultProps: DailyPuzzleVideoProps = {
  puzzleId: 'Ttdum',
  rawFen: '4rbrk/p1q2p1p/5Pp1/3pP3/2p4R/2P4Q/PP4PP/4R2K b - - 11 30',
  rawMoves: ['h7h5', 'h4h5', 'g6h5', 'h3h5', 'f8h6', 'h5h6'],
  rating: 829,
  themes: ['exposedKing', 'kingsideAttack', 'mateIn3', 'sacrifice'],
  quip: 'That rook had places to be!',
};

const numSolutionMoves = defaultProps.rawMoves.length - 1;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="DailyPuzzleVideo"
        // Remotion 4 Composition types require Record<string, unknown>; cast needed for typed props
        component={DailyPuzzleVideo as any} // eslint-disable-line
        durationInFrames={totalFrames(numSolutionMoves)}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={defaultProps as any} // eslint-disable-line
        calculateMetadata={({ props }) => {
          const p = props as unknown as DailyPuzzleVideoProps;
          const moves = p.rawMoves.length - 1;
          return { durationInFrames: totalFrames(moves) };
        }}
      />
    </>
  );
};
