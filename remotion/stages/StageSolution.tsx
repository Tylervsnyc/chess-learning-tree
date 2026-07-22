import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { Chess } from 'chess.js';
import { parseUciMove } from '../../lib/puzzle-utils';
import { ReelLayout } from '../components/ReelLayout';
import { BottomCard } from '../components/BottomCard';
import { FRAMES_PER_MOVE } from '../lib/timing';

const { fontFamily } = loadFont();

/**
 * Stage 3: Solution — board animates moves one at a time, notation builds.
 * ~1.2s per move. Uses useCurrentFrame() to determine which move to show.
 */
export const StageSolution: React.FC<{
  puzzleFen: string;
  orientation: 'white' | 'black';
  solutionUciMoves: string[];
  solutionSanMoves: string[];
  setupFrom: string;
  setupTo: string;
  difficult?: boolean;
}> = ({ puzzleFen, orientation, solutionUciMoves, solutionSanMoves, setupFrom, setupTo, difficult }) => {
  const frame = useCurrentFrame();

  // Which move are we on? One move every FRAMES_PER_MOVE frames.
  const moveIndex = Math.min(
    Math.floor(frame / FRAMES_PER_MOVE),
    solutionUciMoves.length,
  );

  // Calculate FEN after applying moveIndex moves
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

  // Highlight the most recent move (or setup move before first move)
  const { highlightFrom, highlightTo } = useMemo(() => {
    if (moveIndex === 0) return { highlightFrom: setupFrom, highlightTo: setupTo };
    const lastUci = solutionUciMoves[moveIndex - 1];
    const { from, to } = parseUciMove(lastUci);
    return { highlightFrom: from, highlightTo: to };
  }, [moveIndex, solutionUciMoves, setupFrom, setupTo]);

  // Build notation string for visible moves
  const notation = useMemo(() => {
    const visible = solutionSanMoves.slice(0, moveIndex);
    let result = '';
    for (let i = 0; i < visible.length; i++) {
      if (i % 2 === 0) {
        result += `${Math.floor(i / 2) + 1}. ${visible[i]} `;
      } else {
        result += `${visible[i]} `;
      }
    }
    return result.trim();
  }, [solutionSanMoves, moveIndex]);

  // Scale font to fit: big when short, shrinks for long notation
  // Card content width ~880px. At ~0.55em per char (monospace), calculate max chars.
  const notationFontSize = useMemo(() => {
    const len = notation.length;
    if (len <= 12) return 80;  // "1. Rxh5 gxh5" — plenty of room
    if (len <= 20) return 68;  // medium notation
    if (len <= 28) return 56;  // getting longer
    return 46;                 // very long — 6+ move puzzles
  }, [notation]);

  return (
    <ReelLayout
      fen={currentFen}
      orientation={orientation}
      difficult={difficult}
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
            Solution
          </p>
          <p
            style={{
              fontFamily,
              fontWeight: 600,
              fontSize: notationFontSize,
              letterSpacing: '0.02em',
              color: '#FFFFFF',
              margin: '4px 0 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              maxWidth: 880,
            }}
          >
            {notation || '\u00A0'}
          </p>
        </BottomCard>
      }
    />
  );
};
