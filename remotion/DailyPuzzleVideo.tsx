import React, { useMemo } from 'react';
import { Sequence } from 'remotion';
import { Chess } from 'chess.js';
import { parseUciMove, uciToSan } from '../lib/puzzle-utils';
import { describeResult } from './lib/describe-result';
import {
  STAGE_INITIAL_FRAMES,
  STAGE_COUNTDOWN_FRAMES,
  STAGE_CELEBRATE_FRAMES,
  FRAMES_PER_MOVE,
} from './lib/timing';
import { StageInitial } from './stages/StageInitial';
import { StageCountdown } from './stages/StageCountdown';
import { StageSolution } from './stages/StageSolution';
import { StageCelebrate } from './stages/StageCelebrate';

export interface DailyPuzzleVideoProps {
  puzzleId: string;
  rawFen: string;
  rawMoves: string[];
  rating: number;
  themes: string[];
  quip: string;
}

/**
 * Main Remotion composition — 4 Sequences (Initial, Countdown, Solution, Celebrate).
 */
export const DailyPuzzleVideo: React.FC<DailyPuzzleVideoProps> = ({
  rawFen,
  rawMoves,
  themes,
  quip,
}) => {
  const puzzle = useMemo(() => {
    // Apply setup move to get puzzle position
    const chess = new Chess(rawFen);
    const setup = parseUciMove(rawMoves[0]);
    chess.move({ from: setup.from, to: setup.to, promotion: setup.promotion });

    const puzzleFen = chess.fen();
    const playerColor = chess.turn() === 'w' ? 'white' : 'black';
    const solutionUciMoves = rawMoves.slice(1);

    // Get SAN notation
    const allSan = uciToSan(rawFen, rawMoves);
    const solutionSanMoves = allSan.slice(1);

    // Play through all moves to get final position
    const finalChess = new Chess(puzzleFen);
    for (const uci of solutionUciMoves) {
      const { from, to, promotion } = parseUciMove(uci);
      try {
        finalChess.move({ from, to, promotion });
      } catch {
        break;
      }
    }
    const finalFen = finalChess.fen();

    const result = describeResult(puzzleFen, finalFen, playerColor, themes);

    // Setup move highlight (the opponent's last move that created the tactic)
    const setupFrom = setup.from;
    const setupTo = setup.to;

    // Last solution move highlight (for celebrate stage)
    const lastSolutionUci = solutionUciMoves[solutionUciMoves.length - 1];
    const lastMove = parseUciMove(lastSolutionUci);

    return {
      puzzleFen,
      finalFen,
      playerColor: playerColor as 'white' | 'black',
      solutionUciMoves,
      solutionSanMoves,
      result,
      setupFrom,
      setupTo,
      lastMoveFrom: lastMove.from,
      lastMoveTo: lastMove.to,
    };
  }, [rawFen, rawMoves, themes]);

  const solutionFrames = puzzle.solutionUciMoves.length * FRAMES_PER_MOVE;
  const playerColorLabel = puzzle.playerColor === 'white' ? 'White' : 'Black';

  let offset = 0;

  return (
    <div style={{ width: 1080, height: 1920, backgroundColor: '#EBF0F5' }}>
      {/* Stage 1: Initial */}
      <Sequence from={offset} durationInFrames={STAGE_INITIAL_FRAMES}>
        <StageInitial
          puzzleFen={puzzle.puzzleFen}
          orientation={puzzle.playerColor}
          playerColorLabel={playerColorLabel}
          setupFrom={puzzle.setupFrom}
          setupTo={puzzle.setupTo}
        />
      </Sequence>

      {/* Stage 2: Countdown */}
      <Sequence
        from={(offset += STAGE_INITIAL_FRAMES)}
        durationInFrames={STAGE_COUNTDOWN_FRAMES}
      >
        <StageCountdown
          puzzleFen={puzzle.puzzleFen}
          orientation={puzzle.playerColor}
          setupFrom={puzzle.setupFrom}
          setupTo={puzzle.setupTo}
        />
      </Sequence>

      {/* Stage 3: Solution */}
      <Sequence
        from={(offset += STAGE_COUNTDOWN_FRAMES)}
        durationInFrames={solutionFrames}
      >
        <StageSolution
          puzzleFen={puzzle.puzzleFen}
          orientation={puzzle.playerColor}
          solutionUciMoves={puzzle.solutionUciMoves}
          solutionSanMoves={puzzle.solutionSanMoves}
          setupFrom={puzzle.setupFrom}
          setupTo={puzzle.setupTo}
        />
      </Sequence>

      {/* Stage 4: Celebrate */}
      <Sequence
        from={(offset += solutionFrames)}
        durationInFrames={STAGE_CELEBRATE_FRAMES}
      >
        <StageCelebrate
          finalFen={puzzle.finalFen}
          orientation={puzzle.playerColor}
          result={puzzle.result}
          quip={quip}
          lastMoveFrom={puzzle.lastMoveFrom}
          lastMoveTo={puzzle.lastMoveTo}
        />
      </Sequence>
    </div>
  );
};
