'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard';
import { EvalBar, CandidatesHeader } from '@/components/2026candidates';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { getPlayer } from '@/data/2026candidates/players';
import type { GameConfig } from '@/data/2026candidates/types';

// ── Demo: Botvinnik vs Tal, 1960 World Championship Game 6 ──────────
const DEMO_GAME: GameConfig = {
  id: 'demo-tal-botvinnik-g6',
  round: 6,
  date: '1960-03-26',
  white: 'caruana',
  black: 'nakamura',
  result: '0-1',
  moments: [
    {
      title: 'The Knight Repositions',
      moveNumber: 15,
      fen: 'r1r3k1/pp1b1pbp/1q1p2p1/3Pp2n/4P3/2NQ2PP/PP3PB1/1RB2RK1 w - - 3 16',
      eval: 37,
      lastMove: { from: 'f6', to: 'h5' },
      arrows: [{ from: 'h5', to: 'f4' }],
      comment: 'Tal repositions the knight — eyeing f4.',
    },
    {
      title: '21...Nf4!! The Sacrifice',
      moveNumber: 21,
      fen: '2r3k1/pp4bp/3p2p1/3Ppb2/1qr2n2/2N1B1PP/PP2QPBK/R1R5 w - - 2 22',
      eval: -160,
      lastMove: { from: 'h5', to: 'f4' },
      arrows: [
        { from: 'f4', to: 'g2' },
        { from: 'f4', to: 'h3' },
        { from: 'f5', to: 'h3' },
      ],
      comment: 'Tal throws the knight into the fire.',
    },
    {
      title: '23...Qxb2 — Grabbing Material',
      moveNumber: 23,
      fen: '2r3k1/pp4bp/3p2p1/3P1b2/2r2p2/2N4P/Pq1BQPBK/R1R5 w - - 0 24',
      eval: -140,
      lastMove: { from: 'b4', to: 'b2' },
      arrows: [
        { from: 'b2', to: 'a1' },
        { from: 'f4', to: 'f3' },
      ],
      comment: 'The queen is deep in enemy territory.',
    },
    {
      title: '25...fxe2! — The Crusher',
      moveNumber: 25,
      fen: '2r3k1/pp4bp/3p2p1/3P1b2/2r5/2N4P/PR1BpPBK/2R5 w - - 0 26',
      eval: -274,
      lastMove: { from: 'f3', to: 'e2' },
      arrows: [
        { from: 'e2', to: 'e1' },
        { from: 'f5', to: 'e4' },
      ],
      comment: 'The passed pawn on e2 is worth more than the queen.',
    },
    {
      title: '27...Be5+ — Total Domination',
      moveNumber: 27,
      fen: '2r3k1/pp5p/3p2p1/3Pbb2/3r4/1RN4P/P3pPBK/2R1B3 w - - 4 28',
      eval: -525,
      lastMove: { from: 'g7', to: 'e5' },
      arrows: [
        { from: 'e5', to: 'h2' },
        { from: 'd4', to: 'd1' },
        { from: 'c8', to: 'c1' },
      ],
      comment: 'The rooks are crashing through.',
    },
    {
      title: 'Botvinnik Resigns',
      moveNumber: 47,
      fen: '8/3R3p/6p1/8/3k1P2/2p3KP/8/4r3 b - - 3 47',
      eval: -1742,
      lastMove: { from: 'c7', to: 'd7' },
      arrows: [],
      comment: 'The passed c-pawn queens. Tal wins.',
    },
  ],
};

const ARROW_GREEN = 'rgba(88, 204, 2, 0.85)';
const ARROW_BLUE = 'rgba(28, 176, 246, 0.85)';
const ARROW_RED = 'rgba(255, 75, 75, 0.75)';

function arrowColor(index: number): string {
  return [ARROW_GREEN, ARROW_BLUE, ARROW_RED][index % 3] ?? ARROW_GREEN;
}

export default function PresenterPage() {
  const [game] = useState<GameConfig>(DEMO_GAME);
  const [momentIndex, setMomentIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [visibleArrowLayers, setVisibleArrowLayers] = useState<Set<number>>(new Set());
  const [fullscreen, setFullscreen] = useState(false);

  const moment = game.moments[momentIndex];
  const white = getPlayer(game.white);
  const black = getPlayer(game.black);

  const nextMoment = useCallback(() => {
    setMomentIndex((i) => Math.min(i + 1, game.moments.length - 1));
    setShowArrows(false);
    setVisibleArrowLayers(new Set());
  }, [game.moments.length]);

  const prevMoment = useCallback(() => {
    setMomentIndex((i) => Math.max(i - 1, 0));
    setShowArrows(false);
    setVisibleArrowLayers(new Set());
  }, []);

  const toggleArrows = useCallback(() => {
    setShowArrows((s) => !s);
    if (!showArrows) {
      setVisibleArrowLayers(new Set(moment?.arrows.map((_, i) => i) ?? []));
    }
  }, [showArrows, moment?.arrows]);

  const toggleArrowLayer = useCallback((layer: number) => {
    setVisibleArrowLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      setShowArrows(next.size > 0);
      return next;
    });
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowRight': e.preventDefault(); nextMoment(); break;
        case 'ArrowLeft': e.preventDefault(); prevMoment(); break;
        case ' ': e.preventDefault(); toggleArrows(); break;
        case 'f': case 'F': e.preventDefault(); setFullscreen((f) => !f); break;
        case '1': case '2': case '3': case '4': case '5':
          e.preventDefault(); toggleArrowLayer(parseInt(e.key) - 1); break;
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextMoment, prevMoment, toggleArrows, toggleArrowLayer]);

  if (!moment || !white || !black) return null;

  const activeArrows = showArrows
    ? moment.arrows
        .filter((_, i) => visibleArrowLayers.has(i))
        .map((a, i) => ({
          startSquare: a.from,
          endSquare: a.to,
          color: a.color ?? arrowColor(i),
        }))
    : [];

  const squareStyles: Record<string, React.CSSProperties> = {};
  if (moment.lastMove) {
    squareStyles[moment.lastMove.from] = { backgroundColor: 'rgba(255, 170, 0, 0.5)' };
    squareStyles[moment.lastMove.to] = { backgroundColor: 'rgba(255, 170, 0, 0.6)' };
  }

  // The actual 9:16 content
  // Instagram safe zones: top ~80px and bottom ~120px get covered by UI
  const content = (
    <div className="relative flex h-full w-full flex-col bg-chess-page">
      {/* Header */}
      <div className="shrink-0 px-3 pt-2 pb-1">
        <CandidatesHeader round={game.round} />
      </div>

      {/* Board */}
      <div className="w-full px-3">
        <div className="aspect-square w-full">
          <ChessPathBoard
            options={{
              position: moment.fen,
              boardOrientation: 'white',
              animationDurationInMs: 300,
              boardStyle: { borderRadius: '4px' },
              squareStyles,
              arrows: activeArrows,
            }}
          />
        </div>
      </div>

      {/* Scoreboard — players + eval bar unified */}
      <div className="px-3 py-1.5">
        <EvalBar eval={moment.eval} white={white} black={black} />
      </div>

      {/* Facecam zone */}
      <div className="relative flex-1 overflow-hidden">
        <video
          src="/2026candidates/2026canidatestest.mov"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Title card — upper left */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-2 rounded-xl border border-white/15 bg-black/55 px-2.5 py-2 backdrop-blur-md">
          <BreathingRook size="xs" />
          <div>
            <div className="text-[12px] font-bold tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <span className="text-white">chess</span>
              <span style={{
                background: 'linear-gradient(90deg, #FFC800 0%, #FFC800 55%, #FF6B6B 75%, #1CB0F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>path</span>
            </div>
            <div className="text-[10px] font-bold text-white">
              1 Minute Recap
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Fullscreen mode — edge to edge for recording
  if (fullscreen) {
    return (
      <div className="h-dvh w-dvw overflow-hidden" style={{ aspectRatio: '9 / 16', maxWidth: '56.25dvh', margin: '0 auto' }}>
        {content}
      </div>
    );
  }

  // Preview mode — phone frame
  return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-slate-100 overflow-hidden">
      <div
        className="relative rounded-[3rem] border-[6px] border-slate-300 shadow-2xl overflow-hidden"
        style={{ aspectRatio: '9 / 16', height: 'min(92dvh, 900px)' }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 z-20 -translate-x-1/2 rounded-b-2xl bg-slate-300" style={{ width: 120, height: 24 }} />
        {content}
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 flex gap-3">
        <kbd className="rounded bg-black/5 px-2 py-1 text-[10px] text-chess-text-muted">
          LEFT/RIGHT moments
        </kbd>
        <kbd className="rounded bg-black/5 px-2 py-1 text-[10px] text-chess-text-muted">
          SPACE arrows
        </kbd>
        <kbd className="rounded bg-black/5 px-2 py-1 text-[10px] text-chess-text-muted">
          1-5 layers
        </kbd>
        <kbd className="rounded bg-black/5 px-2 py-1 text-[10px] text-chess-text-muted">
          F fullscreen
        </kbd>
      </div>
    </div>
  );
}
