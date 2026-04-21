'use client';

import { Chess } from 'chess.js';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { SheetHeader } from './BrandFooter';

const PRINT_BOARD_LIGHT = '#ffffff';
const PRINT_BOARD_DARK = '#9ca3af';

export interface SheetPuzzle {
  puzzleId: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
}

// The Lichess puzzle FEN shows the position BEFORE the opponent's setup move.
// moves[0] is played by the opponent, then the user solves from there.
// So "to move" on the shown board = the side whose turn it is AFTER moves[0].
function puzzleStart(p: SheetPuzzle): { fen: string; toMove: 'White' | 'Black' } {
  const chess = new Chess(p.fen);
  const setup = p.moves[0];
  if (setup && setup.length >= 4) {
    try {
      chess.move({ from: setup.slice(0, 2), to: setup.slice(2, 4), promotion: setup[4] });
    } catch {
      // malformed; fall back to raw fen
    }
  }
  return {
    fen: chess.fen(),
    toMove: chess.turn() === 'w' ? 'White' : 'Black',
  };
}

function solutionSAN(p: SheetPuzzle): string {
  const chess = new Chess(p.fen);
  const sans: string[] = [];
  for (const m of p.moves) {
    if (!m || m.length < 4) continue;
    try {
      const res = chess.move({ from: m.slice(0, 2), to: m.slice(2, 4), promotion: m[4] });
      if (res) sans.push(res.san);
    } catch {
      break;
    }
  }
  // Skip the opponent's setup move so the key shows only the solver's moves.
  const solverMoves = sans.slice(1);
  const pairs: string[] = [];
  for (let i = 0; i < solverMoves.length; i += 2) {
    const a = solverMoves[i];
    const b = solverMoves[i + 1];
    pairs.push(b ? `${a} ${b}` : a);
  }
  return pairs.join('  ');
}

function formatTheme(theme: string): string {
  return theme
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function PuzzleCard({
  puzzle,
  index,
  showThemes,
}: {
  puzzle: SheetPuzzle;
  index: number;
  showThemes: boolean;
}) {
  const { fen, toMove } = puzzleStart(puzzle);
  const primaryTheme = puzzle.themes.find(
    (t) => !['short', 'long', 'veryLong', 'middlegame', 'endgame', 'opening', 'master', 'masterVsMaster', 'oneMove', 'crushing', 'advantage', 'equality', 'mate'].includes(t),
  );

  return (
    <div className="puzzle-card flex flex-col items-center break-inside-avoid">
      <div className="flex items-baseline justify-between px-1 pb-1 text-xs" style={{ width: '2.8in' }}>
        <span className="font-bold text-black">#{index + 1}</span>
        <span className="text-neutral-700">{toMove} to move</span>
      </div>
      <div className="puzzle-board" style={{ width: '2.8in', height: '2.8in' }}>
        <ChessPathBoard
          options={{
            position: fen,
            allowDragging: false,
            showNotation: true,
            boardOrientation: toMove === 'White' ? 'white' : 'black',
            boardStyle: {
              borderRadius: '2px',
              boxShadow: 'none',
              border: '1px solid #000',
            },
            darkSquareStyle: { backgroundColor: PRINT_BOARD_DARK },
            lightSquareStyle: { backgroundColor: PRINT_BOARD_LIGHT },
          }}
        />
      </div>
      {showThemes && primaryTheme && (
        <div className="w-full px-1 pt-1 text-center text-[10px] text-neutral-600">
          {formatTheme(primaryTheme)}
        </div>
      )}
    </div>
  );
}

export function BoxingSheet({
  puzzles,
  pages,
  showThemes,
}: {
  puzzles: SheetPuzzle[];
  pages: number;
  showThemes: boolean;
}) {
  const pageGroups: SheetPuzzle[][] = [];
  for (let i = 0; i < pages; i++) {
    pageGroups.push(puzzles.slice(i * 6, (i + 1) * 6));
  }

  return (
    <div className="boxing-sheet bg-white text-black">
      {pageGroups.map((group, pageIdx) => (
        <section
          key={pageIdx}
          className="sheet-page relative mx-auto flex flex-col"
          style={{ pageBreakAfter: 'always' }}
        >
          <SheetHeader />
          <div
            className="grid grid-cols-2 justify-items-center content-start gap-y-3 gap-x-6 px-4 py-3"
          >
            {group.map((p, i) => (
              <PuzzleCard
                key={p.puzzleId}
                puzzle={p}
                index={pageIdx * 6 + i}
                showThemes={showThemes}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="sheet-page answer-key relative mx-auto flex flex-col">
        <SheetHeader />
        <div className="px-5 py-4">
          <h2 className="text-base font-bold mb-3">Answer Key</h2>
          <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-xs">
            {puzzles.map((p, i) => (
              <div key={p.puzzleId} className="flex gap-2 py-0.5">
                <span className="w-6 shrink-0 font-bold">#{i + 1}</span>
                <span className="flex-1 font-mono">{solutionSAN(p)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .boxing-sheet,
        .boxing-sheet * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .boxing-sheet .sheet-page {
          width: 8.5in;
          min-height: 11in;
          padding: 0;
        }
        @media print {
          @page {
            size: letter;
            margin: 0.35in;
          }
          html,
          body {
            background: white !important;
          }
          .boxing-sheet .sheet-page {
            width: 100%;
            min-height: auto;
            page-break-after: always;
          }
          .boxing-sheet .sheet-page:last-child {
            page-break-after: auto;
          }
          .puzzle-card {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
