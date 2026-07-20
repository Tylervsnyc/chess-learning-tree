import React from 'react';
import { Composition } from 'remotion';
import { DailyPuzzleVideo, type DailyPuzzleVideoProps } from './DailyPuzzleVideo';
import { ClassicsReel, classicsTotalFrames, type ClassicsReelProps } from './ClassicsReel';
import { DuolingoAdReel, DuolingoAdReelShort, DuolingoAdReelLong } from './DuolingoAdReel';
import { StrategyReel } from './StrategyReel';
import { StreakReel, STREAK_REEL_FRAMES } from './StreakReel';
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
// DataRiver reels: source files were never committed to the repo (exist only on
// Tyler's machine), which broke `remotion render` from a fresh clone. Re-enable
// by committing remotion/DataRiverDailyReel.tsx + DataRiverWomensDailyReel.tsx.
// import { DataRiverDailyReel, DATA_RIVER_DAILY_TOTAL } from './DataRiverDailyReel';
// import { DataRiverWomensDailyReel, DATA_RIVER_WOMENS_DAILY_TOTAL } from './DataRiverWomensDailyReel';
// RookiesRunDailyReel: source file was never committed to the repo (exists only
// on Tyler's machine), which broke `remotion render` from a fresh clone.
// Re-enable by committing remotion/RookiesRunDailyReel.tsx.
// import {
//   RookiesRunDailyReel,
//   ROOKIES_RUN_REEL_INTRO,
//   ROOKIES_RUN_REEL_OUTRO,
//   type RookiesRunDailyReelProps,
// } from './RookiesRunDailyReel';
// import { buildAutoplaySequence } from './lib/run-autoplay';
// import { getRunById } from '@/lib/run/runs';
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

// Chess Path Classics default: Tal Week Day 1 — Tal vs Smyslov, Candidates 1959 (19.Qxf7!!)
const classicsDefaultProps: ClassicsReelProps = {
  classicId: 'tal-smyslov-1959',
  rawFen: 'r1bb1r1k/p2n1ppp/2p4N/7Q/2p5/2B2N2/qPP2PPP/2KR3R b - - 1 18',
  rawMoves: ['d7f6', 'h5f7', 'a2a1', 'c1d2', 'f8f7', 'h6f7', 'h8g8', 'd1a1', 'g8f7', 'f3e5', 'f7e6', 'e5c6'],
  displaySan: [
    '19. Qxf7!!', '19... Qa1+', '20. Kd2', '20... Rxf7', '21. Nxf7+', '21... Kg8',
    '22. Rxa1', '22... Kxf7', '23. Ne5+', '23... Ke6', '24. Nxc6',
  ],
  heroName: 'Tal',
  weekLabel: 'Tal Week · Day 1 of 7',
  byline: 'Tal vs Smyslov · Candidates 1959',
  hook: 'Tal sacs his QUEEN here. Can you see it?',
  resultText: 'Queen sac. Game over.',
  quip: 'A whole queen?! Misha, you beautiful maniac.',
};

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
      <Composition
        id="ClassicsReel"
        component={ClassicsReel as any} // eslint-disable-line
        durationInFrames={classicsTotalFrames(classicsDefaultProps.rawMoves.length - 1)}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={classicsDefaultProps as any} // eslint-disable-line
        calculateMetadata={({ props }) => {
          const p = props as unknown as ClassicsReelProps;
          return { durationInFrames: classicsTotalFrames(p.rawMoves.length - 1) };
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
      <Composition
        id="StreakReel"
        component={StreakReel as any} // eslint-disable-line
        durationInFrames={STREAK_REEL_FRAMES}
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
      {/* DataRiverDaily + DataRiverWomensDaily disabled — see import note above */}
      {/* RookiesRunDailyReel disabled — see import note above
      <Composition
        id="RookiesRunDailyReel"
        component={RookiesRunDailyReel as any}
        durationInFrames={ROOKIES_RUN_REEL_INTRO + 12 * FPS + ROOKIES_RUN_REEL_OUTRO}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={
          {
            date: '2026-05-21',
            runName: "Knight's Academy",
            audioSrc: '/run-reel/sample/voice.wav',
            alignSrc: undefined,
            themeMusicSrc: undefined,
            captions: [
              { text: "Today's run.", startSec: 0, endSec: 1.6 },
              { text: "Knight's Academy.", startSec: 1.95, endSec: 3.6 },
              {
                text: 'L-shaped problems. One knight more than I would prefer.',
                startSec: 3.95,
                endSec: 7.2,
              },
              {
                text: "Cross the board. Don't die.",
                startSec: 7.55,
                endSec: 10.2,
              },
            ],
            durationFrames: ROOKIES_RUN_REEL_INTRO + 12 * FPS + ROOKIES_RUN_REEL_OUTRO,
            pieceCounts: { pawn: 12, knight: 3, bishop: 0, queen: 0 },
            hasHazards: false,
            moveLimit: null,
            enemiesPerTurn: null,
            totalLevels: 10,
            autoplay: DEFAULT_AUTOPLAY,
            hazards: [],
          } satisfies RookiesRunDailyReelProps as unknown as Record<string, unknown>
        }
        calculateMetadata={({ props }) => {
          const p = props as unknown as RookiesRunDailyReelProps;
          return { durationInFrames: p.durationFrames };
        }}
      />
      */}
    </>
  );
};
