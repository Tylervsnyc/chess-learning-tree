/**
 * Standalone Remotion entrypoint for Rookie's Run replay videos.
 *
 * Why a separate entry rather than just adding to the main remotion/Root.tsx:
 *   - The main Root has unresolved imports for unbuilt experimental reels
 *     (DataRiverDailyReel etc.) that error out the bundler. Until those are
 *     committed, sharing the entrypoint would block every replay render.
 *   - This entry only registers the replay composition, keeping the surface
 *     tiny and the bundle fast. Production-quality but isolated.
 */

import React from 'react';
import { Composition, registerRoot } from 'remotion';
import {
  ReplayComposition,
  totalReplayFrames,
  REPLAY_W,
  REPLAY_H,
  REPLAY_FPS,
  type ReplayCompositionProps,
} from './ReplayComposition';
import type { DecisionTrace } from '../../scripts/run-playtest/types';

// Why a small default trace: Remotion needs concrete defaultProps at root
// registration so the studio renders something before a real --props payload
// is supplied. CLI renders always override this.
const defaultReplayTrace: DecisionTrace = {
  runId: 'daily',
  level: 1,
  levelIndex: 0,
  levelId: 'daily/0',
  tier: 'T3',
  trial: 0,
  seed: 'default',
  generatedAt: new Date(0).toISOString(),
  outcome: {
    win: true,
    movesUsed: 1,
    failMode: 'won',
    captures: [],
    abilitiesOffered: 0,
    abilitiesTaken: [],
    abilitiesUsed: [],
    nearDeathTurns: 0,
    excludedAbilities: [],
    seed: 0,
    levelId: 'daily/0',
    runId: 'daily',
    levelIndex: 0,
    level: 1,
    tier: 'T3',
    trial: 0,
  },
  decisionLog: [
    {
      turn: 0,
      moveCount: 0,
      beforeBoard: {
        rookie: { file: 4, rank: 1 },
        pieces: [],
        hazards: [],
        frozenSquares: [],
        shieldUp: false,
        form: 'rook',
        formMovesLeft: 0,
        tempo: 0,
        moveCount: 0,
        moveLimit: null,
        bonusMovesLeft: 0,
        abilities: [],
        pendingOffer: null,
        turn: 'rookie',
        status: 'playing',
      },
      action: { kind: 'move', target: { file: 4, rank: 8 } },
      reason: 'd1 → d8; reaches the goal',
      evalScore: 0,
    },
  ],
  finalBoard: {
    rookie: { file: 4, rank: 8 },
    pieces: [],
    hazards: [],
    frozenSquares: [],
    shieldUp: false,
    form: 'rook',
    formMovesLeft: 0,
    tempo: 0,
    moveCount: 1,
    moveLimit: null,
    bonusMovesLeft: 0,
    abilities: [],
    pendingOffer: null,
    turn: 'rookie',
    status: 'won',
  },
};

const ReplayRoot: React.FC = () => {
  return (
    <Composition
      id="RookiesRunReplay"
      component={ReplayComposition as unknown as React.FC<Record<string, unknown>>}
      durationInFrames={totalReplayFrames(defaultReplayTrace)}
      fps={REPLAY_FPS}
      width={REPLAY_W}
      height={REPLAY_H}
      defaultProps={
        { trace: defaultReplayTrace } as unknown as Record<string, unknown>
      }
      calculateMetadata={({ props }) => {
        const p = props as unknown as ReplayCompositionProps;
        return { durationInFrames: totalReplayFrames(p.trace) };
      }}
    />
  );
};

registerRoot(ReplayRoot);
