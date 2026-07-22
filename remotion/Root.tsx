import React from 'react';
import { Composition } from 'remotion';
import { DailyPuzzleVideo, type DailyPuzzleVideoProps } from './DailyPuzzleVideo';
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
import { OperaGameReel, OPERA_GAME_TOTAL } from './OperaGameReel';
import {
  SaavedraReel,
  SAAVEDRA_TOTAL,
  SaavedraTeachReel,
  SAAVEDRA_TEACH_TOTAL,
} from './SaavedraReel';
import { ZugzwangReel, ZUGZWANG_TOTAL } from './ZugzwangReel';
import { ChosenOneReel, CHOSEN_ONE_TOTAL } from './ChosenOneReel';
import { ImmortalReel, IMMORTAL_TOTAL } from './ImmortalReel';
import { MarshallReel, MARSHALL_TOTAL } from './MarshallReel';
import { SmotheredReel, SMOTHERED_TOTAL } from './SmotheredReel';
import { LegalReel, LEGAL_TOTAL } from './LegalReel';
import { DataRiverDailyReel, DATA_RIVER_DAILY_TOTAL } from './DataRiverDailyReel';
import { DataRiverWomensDailyReel, DATA_RIVER_WOMENS_DAILY_TOTAL } from './DataRiverWomensDailyReel';
import {
  RookiesRunDailyReel,
  ROOKIES_RUN_REEL_INTRO,
  ROOKIES_RUN_REEL_OUTRO,
  type RookiesRunDailyReelProps,
} from './RookiesRunDailyReel';
import { buildAutoplaySequence } from './lib/run-autoplay';
import { getRunById } from '@/lib/run/runs';

const DEFAULT_RUN_LEVEL = getRunById('knight-academy').levels[0]({ file: 4, rank: 1 });
const DEFAULT_AUTOPLAY = buildAutoplaySequence(DEFAULT_RUN_LEVEL, {
  fixedStart: { file: 4, rank: 1 },
  maxMoves: 10,
});
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
      <Composition
        id="OperaGameReel"
        component={OperaGameReel}
        durationInFrames={OPERA_GAME_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
      />
      <Composition
        id="SaavedraReel"
        component={SaavedraReel}
        durationInFrames={SAAVEDRA_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
      />
      <Composition
        id="SaavedraTeachReel"
        component={SaavedraTeachReel}
        durationInFrames={SAAVEDRA_TEACH_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
      />
      <Composition
        id="ZugzwangReel"
        component={ZugzwangReel}
        durationInFrames={ZUGZWANG_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
      />
      <Composition
        id="ChosenOneReel"
        component={ChosenOneReel}
        durationInFrames={CHOSEN_ONE_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
      />
      <Composition
        id="ImmortalReel"
        component={ImmortalReel}
        durationInFrames={IMMORTAL_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
      />
      <Composition
        id="MarshallReel"
        component={MarshallReel}
        durationInFrames={MARSHALL_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
      />
      <Composition
        id="SmotheredReel"
        component={SmotheredReel}
        durationInFrames={SMOTHERED_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
      />
      <Composition
        id="LegalReel"
        component={LegalReel}
        durationInFrames={LEGAL_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
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
      <Composition
        id="DataRiverDaily"
        component={DataRiverDailyReel as any} // eslint-disable-line
        durationInFrames={DATA_RIVER_DAILY_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="DataRiverWomensDaily"
        component={DataRiverWomensDailyReel as any} // eslint-disable-line
        durationInFrames={DATA_RIVER_WOMENS_DAILY_TOTAL}
        fps={FPS}
        width={FRAME_W}
        height={FRAME_H}
        defaultProps={{}}
      />
      <Composition
        id="RookiesRunDailyReel"
        component={RookiesRunDailyReel as any} // eslint-disable-line
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
    </>
  );
};
