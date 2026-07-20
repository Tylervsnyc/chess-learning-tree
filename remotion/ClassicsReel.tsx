import React, { useMemo } from 'react';
import { Sequence, useCurrentFrame } from 'remotion';
import { loadFont } from './lib/dm-sans';
import { Chess } from 'chess.js';
import { parseUciMove } from '../lib/puzzle-utils';
import { ReelLayout } from './components/ReelLayout';
import { BottomCard } from './components/BottomCard';
import { ResultPopup } from './components/ResultPopup';
import {
  STAGE_COUNTDOWN_FRAMES,
  STAGE_CELEBRATE_FRAMES,
  FRAMES_PER_MOVE,
  COUNTDOWN_INTERVAL_FRAMES,
} from './lib/timing';

const { fontFamily } = loadFont();

/**
 * Chess Path Classics — famous combinations from chess history, one per day.
 * Same 3-zone reel skeleton as the Daily Puzzle, but with a gold CLASSICS
 * badge, a week/day line, the players + event byline, and each move of the
 * combination shown big (with !! annotations) instead of building notation.
 *
 * Data lives in data/classics/*.json; render via scripts/render-classics.ts.
 */

export const CLASSICS_INITIAL_FRAMES = 90; // 3s — time to read the matchup + hook

export function classicsTotalFrames(numSolutionMoves: number): number {
  return (
    CLASSICS_INITIAL_FRAMES +
    STAGE_COUNTDOWN_FRAMES +
    numSolutionMoves * FRAMES_PER_MOVE +
    STAGE_CELEBRATE_FRAMES
  );
}

const BADGE = {
  badgeText: 'Chess Path Classics',
  badgeGradient: 'linear-gradient(135deg, #FFC800 0%, #FF9600 100%)',
  badgeShadow: '0 8px 24px rgba(255,150,0,0.35)',
};

export interface ClassicsReelProps {
  classicId: string;
  /** FEN before the opponent's setup move */
  rawFen: string;
  /** UCI moves — [0] is the opponent's setup move, the rest is the combination */
  rawMoves: string[];
  /** Display SAN for each combination ply, with real move numbers + annotations, e.g. "19. Qxf7!!" */
  displaySan: string[];
  /** The star of the game, e.g. "Tal" */
  heroName: string;
  /** e.g. "Tal Week · Day 1 of 7" */
  weekLabel: string;
  /** e.g. "Tal vs Smyslov · Candidates 1959" */
  byline: string;
  /** Stage-1 hook line */
  hook: string;
  /** Stage-4 board overlay, e.g. "Queen sac. Game over." */
  resultText: string;
  /** Stage-4 Rookie quip */
  quip: string;
}

const CInitial: React.FC<{
  fen: string;
  orientation: 'white' | 'black';
  weekLabel: string;
  byline: string;
  hook: string;
  setupFrom: string;
  setupTo: string;
}> = ({ fen, orientation, weekLabel, byline, hook, setupFrom, setupTo }) => (
  <ReelLayout
    {...BADGE}
    badgeSubtext={weekLabel}
    fen={fen}
    orientation={orientation}
    highlightFrom={setupFrom}
    highlightTo={setupTo}
    bottomContent={
      <BottomCard>
        <p
          style={{
            fontFamily,
            fontWeight: 600,
            fontSize: 58,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {hook}
        </p>
        <p
          style={{
            fontFamily,
            fontWeight: 500,
            fontSize: 38,
            color: 'rgba(255,255,255,0.65)',
            margin: '12px 0 0',
          }}
        >
          {byline}
        </p>
      </BottomCard>
    }
  />
);

const CCountdown: React.FC<{
  fen: string;
  orientation: 'white' | 'black';
  weekLabel: string;
  heroName: string;
  setupFrom: string;
  setupTo: string;
}> = ({ fen, orientation, weekLabel, heroName, setupFrom, setupTo }) => {
  const frame = useCurrentFrame();
  const countdownIndex = Math.floor(frame / COUNTDOWN_INTERVAL_FRAMES);
  const countdownValues = [3, 2, 1, 0];
  const count = countdownValues[Math.min(countdownIndex, countdownValues.length - 1)];

  return (
    <ReelLayout
      {...BADGE}
      badgeSubtext={weekLabel}
      fen={fen}
      orientation={orientation}
      highlightFrom={setupFrom}
      highlightTo={setupTo}
      bottomContent={
        <BottomCard>
          <p
            style={{
              fontFamily,
              fontWeight: 600,
              fontSize: 72,
              color: '#FFFFFF',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {count > 0 ? `${heroName}'s move in ${count}` : 'GO!'}
          </p>
          <p
            style={{
              fontFamily,
              fontWeight: 400,
              fontSize: 32,
              color: 'rgba(255,255,255,0.5)',
              margin: '4px 0 0',
            }}
          >
            (Tap Screen to Pause)
          </p>
        </BottomCard>
      }
    />
  );
};

const CMoves: React.FC<{
  puzzleFen: string;
  orientation: 'white' | 'black';
  weekLabel: string;
  heroName: string;
  solutionUciMoves: string[];
  displaySan: string[];
  setupFrom: string;
  setupTo: string;
}> = ({ puzzleFen, orientation, weekLabel, heroName, solutionUciMoves, displaySan, setupFrom, setupTo }) => {
  const frame = useCurrentFrame();
  const moveIndex = Math.min(Math.floor(frame / FRAMES_PER_MOVE), solutionUciMoves.length);

  const currentFen = useMemo(() => {
    const chess = new Chess(puzzleFen);
    for (let i = 0; i < moveIndex && i < solutionUciMoves.length; i++) {
      const { from, to, promotion } = parseUciMove(solutionUciMoves[i]);
      try {
        chess.move({ from, to, promotion });
      } catch {
        break;
      }
    }
    return chess.fen();
  }, [puzzleFen, moveIndex, solutionUciMoves]);

  const { highlightFrom, highlightTo } = useMemo(() => {
    if (moveIndex === 0) return { highlightFrom: setupFrom, highlightTo: setupTo };
    const { from, to } = parseUciMove(solutionUciMoves[moveIndex - 1]);
    return { highlightFrom: from, highlightTo: to };
  }, [moveIndex, solutionUciMoves, setupFrom, setupTo]);

  const currentSan = moveIndex > 0 ? displaySan[moveIndex - 1] ?? '' : '';

  return (
    <ReelLayout
      {...BADGE}
      badgeSubtext={weekLabel}
      fen={currentFen}
      orientation={orientation}
      highlightFrom={highlightFrom}
      highlightTo={highlightTo}
      bottomContent={
        <BottomCard>
          <p
            style={{
              fontFamily,
              fontWeight: 500,
              fontSize: 44,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
            }}
          >
            {heroName} played
          </p>
          <p
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 92,
              letterSpacing: '0.02em',
              color: currentSan.includes('!') ? '#FFC800' : '#FFFFFF',
              margin: '4px 0 0',
              whiteSpace: 'nowrap',
            }}
          >
            {currentSan || ' '}
          </p>
        </BottomCard>
      }
    />
  );
};

const CCelebrate: React.FC<{
  finalFen: string;
  orientation: 'white' | 'black';
  weekLabel: string;
  byline: string;
  resultText: string;
  quip: string;
  lastMoveFrom: string;
  lastMoveTo: string;
}> = ({ finalFen, orientation, weekLabel, byline, resultText, quip, lastMoveFrom, lastMoveTo }) => (
  <ReelLayout
    {...BADGE}
    badgeSubtext={weekLabel}
    fen={finalFen}
    orientation={orientation}
    highlightFrom={lastMoveFrom}
    highlightTo={lastMoveTo}
    boardOverlay={<ResultPopup result={resultText} />}
    bottomContent={
      <BottomCard>
        <p
          style={{
            fontFamily,
            fontWeight: 600,
            fontSize: 56,
            fontStyle: 'italic',
            color: '#FFFFFF',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          &ldquo;{quip}&rdquo;
        </p>
        <p
          style={{
            fontFamily,
            fontWeight: 500,
            fontSize: 32,
            color: 'rgba(255,255,255,0.55)',
            margin: '12px 0 0',
          }}
        >
          {byline}
        </p>
      </BottomCard>
    }
  />
);

export const ClassicsReel: React.FC<ClassicsReelProps> = ({
  rawFen,
  rawMoves,
  displaySan,
  heroName,
  weekLabel,
  byline,
  hook,
  resultText,
  quip,
}) => {
  const clip = useMemo(() => {
    // Apply the opponent's setup move to get the featured position
    const chess = new Chess(rawFen);
    const setup = parseUciMove(rawMoves[0]);
    chess.move({ from: setup.from, to: setup.to, promotion: setup.promotion });

    const puzzleFen = chess.fen();
    const heroColor = chess.turn() === 'w' ? 'white' : 'black';
    const solutionUciMoves = rawMoves.slice(1);

    const finalChess = new Chess(puzzleFen);
    for (const uci of solutionUciMoves) {
      const { from, to, promotion } = parseUciMove(uci);
      try {
        finalChess.move({ from, to, promotion });
      } catch {
        break;
      }
    }

    const lastMove = parseUciMove(solutionUciMoves[solutionUciMoves.length - 1]);

    return {
      puzzleFen,
      finalFen: finalChess.fen(),
      heroColor: heroColor as 'white' | 'black',
      solutionUciMoves,
      setupFrom: setup.from,
      setupTo: setup.to,
      lastMoveFrom: lastMove.from,
      lastMoveTo: lastMove.to,
    };
  }, [rawFen, rawMoves]);

  const solutionFrames = clip.solutionUciMoves.length * FRAMES_PER_MOVE;
  let offset = 0;

  return (
    <div style={{ width: 1080, height: 1920, backgroundColor: '#EBF0F5' }}>
      <Sequence from={offset} durationInFrames={CLASSICS_INITIAL_FRAMES}>
        <CInitial
          fen={clip.puzzleFen}
          orientation={clip.heroColor}
          weekLabel={weekLabel}
          byline={byline}
          hook={hook}
          setupFrom={clip.setupFrom}
          setupTo={clip.setupTo}
        />
      </Sequence>

      <Sequence from={(offset += CLASSICS_INITIAL_FRAMES)} durationInFrames={STAGE_COUNTDOWN_FRAMES}>
        <CCountdown
          fen={clip.puzzleFen}
          orientation={clip.heroColor}
          weekLabel={weekLabel}
          heroName={heroName}
          setupFrom={clip.setupFrom}
          setupTo={clip.setupTo}
        />
      </Sequence>

      <Sequence from={(offset += STAGE_COUNTDOWN_FRAMES)} durationInFrames={solutionFrames}>
        <CMoves
          puzzleFen={clip.puzzleFen}
          orientation={clip.heroColor}
          weekLabel={weekLabel}
          heroName={heroName}
          solutionUciMoves={clip.solutionUciMoves}
          displaySan={displaySan}
          setupFrom={clip.setupFrom}
          setupTo={clip.setupTo}
        />
      </Sequence>

      <Sequence from={(offset += solutionFrames)} durationInFrames={STAGE_CELEBRATE_FRAMES}>
        <CCelebrate
          finalFen={clip.finalFen}
          orientation={clip.heroColor}
          weekLabel={weekLabel}
          byline={byline}
          resultText={resultText}
          quip={quip}
          lastMoveFrom={clip.lastMoveFrom}
          lastMoveTo={clip.lastMoveTo}
        />
      </Sequence>
    </div>
  );
};
