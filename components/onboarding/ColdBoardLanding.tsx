// SERVER COMPONENT — no 'use client'. This is the whole point: cold-IG visitors
// see an interactive-looking checkmate board at FIRST CONTENTFUL PAINT, before
// any JS hydrates. The old client <OnboardingFlow> left the screen blank for
// ~8s on a throttled IG in-app webview; ~346/384 cold landers bounced under 3s.
//
// The board is plain HTML/CSS (an 8x8 grid of <div>s + unicode piece glyphs) —
// NO react-chessboard, NO chess.js, NO image fetches on the critical path. A
// tiny client island (<ColdBoardIsland>) layers tap-to-move on top once it
// hydrates; until then the position is already legible and the intent (tap the
// queen, then the glowing square) reads from CSS highlights alone.
//
// Gated to cold-IG + FEATURE_FLAGS.IG_FAST_LANDING in app/welcome/page.tsx.

import { ColdBoardIsland } from './ColdBoardIsland';

// The ad's exact moment — lesson 1.1.1 PUZZLE_1 (Qd3->h7#, bishop on c2 defends
// h7). Same FEN/squares as CheckmateLanding so the message-match holds.
const FEN = 'r1b2rk1/4qpp1/p2np2p/1p1p4/3P4/1PPQ1N2/P1B2PPP/R4RK1 w - - 0 19';
const QUEEN_SQUARE = 'd3';
const WIN_SQUARE = 'h7';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const; // top-to-bottom, white at bottom

// Unicode chess glyphs. Uppercase = white piece, lowercase = black.
const GLYPHS: Record<string, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

/**
 * Tiny pure FEN parser (~15 lines, no chess.js). Returns a square->piece map
 * keyed by algebraic square ('a1'..'h8'); value is the FEN letter (case = color).
 */
function parseFen(fen: string): Record<string, string> {
  const map: Record<string, string> = {};
  const rows = fen.split(' ')[0].split('/'); // rank 8 down to rank 1
  rows.forEach((row, i) => {
    const rank = 8 - i;
    let file = 0;
    for (const ch of row) {
      if (ch >= '1' && ch <= '8') {
        file += Number(ch);
      } else {
        map[`${FILES[file]}${rank}`] = ch;
        file += 1;
      }
    }
  });
  return map;
}

export function ColdBoardLanding() {
  const pieces = parseFen(FEN);

  return (
    <div className="h-[100dvh] flex flex-col bg-chess-page overflow-hidden relative">
      {/* Logo — lightweight inline text mark, no heavy logo component / deps. */}
      <div className="pt-5 pl-5">
        <span className="font-black text-chess-text text-lg tracking-tight">
          Chess<span style={{ color: 'var(--color-chess-green)' }}>Path</span>
        </span>
      </div>

      {/* Headline — server text, instant at FCP. Message-matches the ad. */}
      <div className="px-6 max-w-lg mx-auto w-full text-center mt-1">
        <h1
          className="font-black text-chess-text leading-tight"
          style={{ fontSize: 'clamp(22px, 6.5vw, 30px)' }}
        >
          Win this game of chess.
        </h1>
        <p
          className="mt-1 text-chess-text-muted font-semibold"
          style={{ fontSize: 'clamp(13px, 3.6vw, 15px)' }}
        >
          Tap your queen, then the glowing square.
        </p>
      </div>

      {/* The board — server-rendered, visible at FCP. The island enhances it. */}
      <div className="flex-1 flex items-center justify-center px-3">
        <div className="w-full max-w-[min(92vw,440px)] md:max-w-[520px] mx-auto">
          <ColdBoardIsland
            pieces={pieces}
            queenSquare={QUEEN_SQUARE}
            winSquare={WIN_SQUARE}
          >
            {/* SSR fallback board — identical layout, no interactivity. The
                island re-renders the same grid once hydrated; until then THIS
                paints at FCP so the position + highlights are instantly legible. */}
            <StaticBoard pieces={pieces} queenSquare={QUEEN_SQUARE} winSquare={WIN_SQUARE} />
          </ColdBoardIsland>
        </div>
      </div>

      {/* Rookie hint bar — warm, ≤2 sentences, server text. */}
      <div className="w-full">
        <div className="max-w-lg mx-auto px-6 pb-6">
          <div
            className="rounded-2xl py-2.5 px-4 flex items-center gap-2.5"
            style={{
              backgroundColor: 'var(--color-chess-green)',
              boxShadow:
                '0 4px 0 var(--color-chess-green-dark), 0 2px 8px rgba(88, 204, 2, 0.3)',
            }}
          >
            <span className="text-2xl flex-shrink-0" aria-hidden>
              {'♜'}
            </span>
            <p className="font-bold text-white leading-snug" style={{ fontSize: 15 }}>
              One move from checkmate. Tap the queen, then the glowing square.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Pure HTML/CSS 8x8 board. Shared by the server fallback above AND the client
 * island (so hydration is a no-op shape match). Light/dark squares, unicode
 * glyphs, queen highlighted, win square glowing — all from CSS, zero JS needed.
 */
export function StaticBoard({
  pieces,
  queenSquare,
  winSquare,
  selected,
  shake,
  onSquareTap,
}: {
  pieces: Record<string, string>;
  queenSquare: string;
  winSquare: string;
  selected?: string | null;
  shake?: boolean;
  onSquareTap?: (square: string) => void;
}) {
  return (
    <div
      className="grid grid-cols-8 w-full aspect-square rounded-xl overflow-hidden select-none"
      style={{
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
        animation: shake ? 'cbl-shake 0.4s ease-in-out' : undefined,
      }}
    >
      {RANKS.map((rank) =>
        FILES.map((file) => {
          const square = `${file}${rank}`;
          const isDark = (FILES.indexOf(file) + rank) % 2 === 0;
          const piece = pieces[square];
          const isQueen = square === queenSquare;
          const isWin = square === winSquare;
          const isSelected = selected === square;

          // Square background: dark/light by default, blue if it's the queen
          // (start here) or selected, green glow on the win target.
          let background = isDark ? '#779952' : '#edeed1';
          let boxShadow: string | undefined;
          if (isWin) {
            background = isDark
              ? 'rgba(88,204,2,0.55)'
              : 'rgba(88,204,2,0.45)';
            boxShadow =
              'inset 0 0 0 3px #58CC02, inset 0 0 14px rgba(88,204,2,0.6)';
          } else if (isSelected) {
            background = 'rgba(100,200,255,0.6)';
          } else if (isQueen) {
            background = isDark
              ? 'rgba(28,176,246,0.5)'
              : 'rgba(28,176,246,0.35)';
            boxShadow = 'inset 0 0 0 3px rgba(28,176,246,0.95)';
          }

          const isWhitePiece = piece && piece === piece.toUpperCase();

          return (
            <div
              key={square}
              data-square={square}
              role={onSquareTap ? 'button' : undefined}
              onClick={onSquareTap ? () => onSquareTap(square) : undefined}
              className="relative flex items-center justify-center"
              style={{
                background,
                boxShadow,
                cursor: onSquareTap ? 'pointer' : undefined,
                // Whole square is the tap target — ≥44px on phone (board ÷ 8 of
                // a ~360px column ≈ 45px; the board only grows on bigger screens).
              }}
            >
              {piece && (
                <span
                  style={{
                    fontSize: 'min(7vw, 38px)',
                    lineHeight: 1,
                    color: isWhitePiece ? '#fafafa' : '#1a1a1a',
                    textShadow: isWhitePiece
                      ? '0 1px 1px rgba(0,0,0,0.35)'
                      : '0 1px 1px rgba(255,255,255,0.15)',
                  }}
                  aria-hidden
                >
                  {GLYPHS[piece]}
                </span>
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}
