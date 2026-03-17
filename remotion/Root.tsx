import React from 'react';
import { Composition } from 'remotion';
import { DailyPuzzleVideo, type DailyPuzzleVideoProps } from './DailyPuzzleVideo';
import { DuolingoAdReel, DuolingoAdReelShort, DuolingoAdReelLong } from './DuolingoAdReel';
import { StrategyReel } from './StrategyReel';
import {
  MarketingReelCheckmate,
  MarketingReelBeginner,
  MarketingReelIntermediate,
  MarketingReelCTA,
} from './MarketingReel';
import { LogoReel, LOGO_REEL_FRAMES } from './LogoReel';
import {
  RookBrickRoadStaggered,
  BRICK_ROAD_STAGGERED_FRAMES,
  RookBrickRoadSimultaneous,
  BRICK_ROAD_SIMULTANEOUS_FRAMES,
} from './RookBrickRoad';
import { RookMultiplication, MULTIPLICATION_FRAMES } from './RookMultiplication';
import { RookFullStory, FULL_STORY_FRAMES } from './RookFullStory';
import { PuzzleExplainerReel, PUZZLE_EXPLAINER_TOTAL } from './PuzzleExplainerReel';
import {
  FPS,
  FRAME_W,
  FRAME_H,
  totalFrames,
  AD_TOTAL_FRAMES,
  AD_SHORT_TOTAL_FRAMES,
  AD_LONG_TOTAL_FRAMES,
  STRAT_TOTAL_FRAMES,
  MKT_CTA_FRAMES,
  MKT_CHECKMATE_TOTAL,
  MKT_BEGINNER_TOTAL,
  MKT_INTERMEDIATE_TOTAL,
} from './lib/timing';

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
      {/* Backwards-compatible alias for medium */}
      <Composition
        id="DuolingoAdReel"
        component={DuolingoAdReel as any} // eslint-disable-line
        durationInFrames={AD_TOTAL_FRAMES}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="DuolingoAdReel-Short"
        component={DuolingoAdReelShort as any} // eslint-disable-line
        durationInFrames={AD_SHORT_TOTAL_FRAMES}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="DuolingoAdReel-Medium"
        component={DuolingoAdReel as any} // eslint-disable-line
        durationInFrames={AD_TOTAL_FRAMES}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="DuolingoAdReel-Long"
        component={DuolingoAdReelLong as any} // eslint-disable-line
        durationInFrames={AD_LONG_TOTAL_FRAMES}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="StrategyReel"
        component={StrategyReel as any} // eslint-disable-line
        durationInFrames={STRAT_TOTAL_FRAMES}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      {/* Marketing Reels — Talking Head → Screen Recording → CTA */}
      <Composition
        id="MarketingReel-CTA"
        component={MarketingReelCTA as any} // eslint-disable-line
        durationInFrames={MKT_CTA_FRAMES}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="MarketingReel-Checkmate"
        component={MarketingReelCheckmate as any} // eslint-disable-line
        durationInFrames={MKT_CHECKMATE_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="MarketingReel-BeginnerLearn"
        component={MarketingReelBeginner as any} // eslint-disable-line
        durationInFrames={MKT_BEGINNER_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="MarketingReel-Intermediate"
        component={MarketingReelIntermediate as any} // eslint-disable-line
        durationInFrames={MKT_INTERMEDIATE_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="LogoReel"
        component={LogoReel as any} // eslint-disable-line
        durationInFrames={LOGO_REEL_FRAMES}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="RookBrickRoad-Staggered"
        component={RookBrickRoadStaggered as any} // eslint-disable-line
        durationInFrames={BRICK_ROAD_STAGGERED_FRAMES}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="RookBrickRoad-Simultaneous"
        component={RookBrickRoadSimultaneous as any} // eslint-disable-line
        durationInFrames={BRICK_ROAD_SIMULTANEOUS_FRAMES}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="RookMultiplication"
        component={RookMultiplication as any} // eslint-disable-line
        durationInFrames={MULTIPLICATION_FRAMES}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="RookFullStory"
        component={RookFullStory as any} // eslint-disable-line
        durationInFrames={FULL_STORY_FRAMES}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="PuzzleExplainerReel"
        component={PuzzleExplainerReel as any} // eslint-disable-line
        durationInFrames={PUZZLE_EXPLAINER_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
    </>
  );
};
