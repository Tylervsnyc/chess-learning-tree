'use client';

import { useMemo, useState } from 'react';
import { Chess, type Square } from 'chess.js';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { useClickToMove } from '@/hooks/useClickToMove';
import { usePremove } from '@/hooks/usePremove';
import { premoveDests, premoveSquareStyles } from '@/lib/chess/premove';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * Premove sandbox.
 *
 * A fake opponent that thinks for a configurable delay and plays a random legal
 * move, so premove rules can be exercised without an engine: relaxed targeting,
 * strict execution, silent cancellation, one-at-a-time replacement.
 */
export default function PremoveTestPage() {
  const [fen, setFen] = useState(START_FEN);
  const [selected, setSelected] = useState<Square | null>(null);
  const [thinking, setThinking] = useState(false);
  const [thinkMs, setThinkMs] = useState(2000);
  const [log, setLog] = useState<string[]>([]);

  const game = useMemo(() => new Chess(fen), [fen]);
  const isMyTurn = game.turn() === 'w';

  const say = (line: string) => setLog(l => [line, ...l].slice(0, 12));

  const opponentReply = (afterFen: string, delay: number) => {
    setThinking(true);
    setTimeout(() => {
      const g = new Chess(afterFen);
      const moves = g.moves({ verbose: true });
      if (!moves.length) {
        setThinking(false);
        return;
      }
      const mv = moves[Math.floor(Math.random() * moves.length)];
      g.move(mv);
      setFen(g.fen());
      setThinking(false);
      say(`opponent played ${mv.san}`);
    }, delay);
  };

  const tryMove = (from: Square, to: Square): boolean => {
    const g = new Chess(fen);
    if (g.turn() !== 'w') return false;
    let mv;
    try {
      mv = g.move({ from, to, promotion: 'q' });
    } catch {
      return false;
    }
    if (!mv) return false;
    const next = g.fen();
    setFen(next);
    setSelected(null);
    say(`you played ${mv.san}`);
    if (!g.isGameOver()) opponentReply(next, thinkMs);
    return true;
  };

  const { premove, setPremove, clearPremove, premoveEnabled } = usePremove({
    fen,
    isMyTurn,
    tryMove,
    enabled: true,
    fireDelayMs: 300,
  });

  const { onSquareClick, onPremoveDrop } = useClickToMove({
    game,
    ownColor: 'w',
    selectedSquare: selected,
    setSelectedSquare: setSelected,
    tryMove,
    enabled: true,
    premoveEnabled,
    setPremove,
  });

  const squareStyles = useMemo(() => {
    const s: Record<string, React.CSSProperties> = {};
    if (selected) {
      s[selected] = { background: 'rgba(20, 85, 200, 0.5)' };
      const dests = isMyTurn
        ? game.moves({ square: selected, verbose: true }).map(m => m.to as Square)
        : premoveDests(fen, selected, 'w');
      for (const to of dests) {
        s[to] = {
          background: game.get(to)
            ? 'radial-gradient(transparent 55%, rgba(20, 85, 200, 0.4) 55%)'
            : 'radial-gradient(rgba(20, 85, 200, 0.5) 22%, transparent 22%)',
        };
      }
    }
    for (const [sq, style] of Object.entries(premoveSquareStyles(premove))) {
      s[sq] = { ...s[sq], ...style };
    }
    return s;
  }, [game, fen, selected, isMyTurn, premove]);

  return (
    <div className="min-h-full overflow-auto bg-chess-page px-4 py-6">
      <div className="mx-auto w-full max-w-md md:max-w-lg flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold text-chess-text">Premove sandbox</h1>
          <p className="text-sm text-chess-text-muted">
            Flag {FEATURE_FLAGS.PREMOVE ? 'ON' : 'OFF'} · the opponent plays a random legal
            move after thinking. Queue a move while it&apos;s their turn.
          </p>
        </div>

        <div className="w-full aspect-square">
          <ChessPathBoard
            options={{
              position: fen,
              boardOrientation: 'white',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onPieceDrop: ((args: any) => {
                const from = args.sourceSquare as Square;
                const to = args.targetSquare as Square;
                if (!isMyTurn || thinking) return onPremoveDrop(from, to);
                return tryMove(from, to);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              }) as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onSquareClick: ((args: any) => onSquareClick(args.square as Square)) as any,
              squareStyles,
              animationDurationInMs: 300,
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-chess-text">
            {thinking ? 'Opponent thinking…' : isMyTurn ? 'Your move' : 'Opponent to move'}
          </span>
          <span className="text-chess-text-muted">
            premove: {premove ? `${premove.from}→${premove.to}` : 'none'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[500, 2000, 4000, 15000].map(ms => (
            <button
              key={ms}
              onClick={() => setThinkMs(ms)}
              className={`min-h-[44px] px-4 rounded-lg text-sm font-semibold ${
                thinkMs === ms
                  ? 'bg-chess-green text-white'
                  : 'bg-white text-chess-text border border-chess-border'
              }`}
            >
              think {ms}ms
            </button>
          ))}
          <button
            onClick={() => {
              setFen(START_FEN);
              setSelected(null);
              clearPremove();
              setLog([]);
            }}
            className="min-h-[44px] px-4 rounded-lg text-sm font-semibold bg-white text-chess-text border border-chess-border"
          >
            reset
          </button>
        </div>

        <ul className="bg-white rounded-lg p-3 text-sm text-chess-text-muted min-h-[120px]">
          {log.map((line, i) => (
            <li key={`${line}-${i}`}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
