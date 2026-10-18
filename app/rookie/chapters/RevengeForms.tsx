'use client';

import { useEffect, useRef, useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { PieceBlocks, type BlockPieceType } from '@/components/run/PieceBlocks';
import { CHESS_PIECE_SVG } from '@/components/seo/chessPieces';
import { REVENGE_FORMS, type RevengeForm } from '../script';
import type { Stage } from '../stage';

// Rookie's Revenge look (~/rookies-run): navy page, green/cream board.
const LIGHT = '#edeed1';
const DARK = '#779952';
const NAVY = 'linear-gradient(180deg, #182a5c 0%, #0f1c3f 60%)';

// Rookie's square (file index 0-7, row index 0-7 from the top) + a few enemies.
const ROOKIE_SQ = { col: 3, row: 4 }; // d4
const ENEMIES: { col: number; row: number; key: string }[] = [
  { col: 4, row: 0, key: 'bK' },
  { col: 2, row: 2, key: 'bN' },
  { col: 5, row: 1, key: 'bP' },
  { col: 6, row: 1, key: 'bP' },
  { col: 5, row: 3, key: 'bB' },
];

const GLITCH_MS = 440;
const PIECE_OF: Record<Exclude<RevengeForm, 'rook'>, BlockPieceType> = {
  pawn: 'P', knight: 'N', bishop: 'B', queen: 'Q', dragon: 'D',
};

/** BreathingRook 'xs' is drawn at 34x41px — scale it so its height matches `px`. */
const ROOK_XS_H = 41;

function Sprite({ form, px, animate }: { form: RevengeForm; px: number; animate: boolean }) {
  if (form === 'rook') {
    return (
      <div style={{ transform: `scale(${px / ROOK_XS_H})` }} className="flex">
        <BreathingRook size="xs" animate={animate} />
      </div>
    );
  }
  return <PieceBlocks piece={PIECE_OF[form]} blockSize={3} fit={px} animate={animate} />;
}

export function RevengeForms({ stage }: { stage: Stage }) {
  const [form, setForm] = useState<RevengeForm>('rook');
  const [glitching, setGlitching] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [cell, setCell] = useState(0);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const measure = () => setCell(el.offsetWidth / 8);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const transform = (next: RevengeForm) => {
    const f = REVENGE_FORMS.find((x) => x.form === next)!;
    stage.say(f.line, { mood: f.mood });
    timers.current.forEach(clearTimeout);
    setGlitching(true);
    // The old shape glitches out, the new one glitches in.
    timers.current = [
      setTimeout(() => setForm(next), GLITCH_MS / 2),
      setTimeout(() => setGlitching(false), GLITCH_MS),
    ];
  };

  const isDragon = form === 'dragon';
  // Pieces fill ~80% of the square; the dragon is bigger and spills over it.
  const spritePx = Math.round(cell * (isDragon ? 1.3 : form === 'rook' ? 0.78 : 0.8));

  return (
    <div>
      <style>{GLITCH_CSS}</style>
      <div className="rounded-2xl p-3 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]" style={{ background: NAVY }}>
        <div
          ref={boardRef}
          className="relative mx-auto w-full max-w-[420px] aspect-square grid grid-cols-8 grid-rows-8 rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          {Array.from({ length: 64 }, (_, i) => {
            const col = i % 8;
            const row = Math.floor(i / 8);
            const enemy = ENEMIES.find((e) => e.col === col && e.row === row);
            return (
              <div key={i} style={{ background: (col + row) % 2 === 0 ? LIGHT : DARK }} className="relative">
                {enemy && (
                  <svg
                    viewBox="0 0 45 45"
                    aria-hidden
                    className="absolute inset-[6%] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
                    dangerouslySetInnerHTML={{ __html: CHESS_PIECE_SVG[enemy.key] }}
                  />
                )}
              </div>
            );
          })}

          {/* Rookie — laid over the grid so the dragon can spill past the square. */}
          {cell > 0 && (
            <div
              className="absolute flex items-center justify-center pointer-events-none"
              style={{
                left: ROOKIE_SQ.col * cell,
                top: ROOKIE_SQ.row * cell,
                width: cell,
                height: cell,
                zIndex: 2,
              }}
              aria-label={`Rookie as a ${form}`}
            >
              {isDragon && !glitching && (
                <div
                  className="absolute rounded-full"
                  style={{
                    width: cell * 1.9,
                    height: cell * 1.9,
                    background: 'radial-gradient(circle, rgba(255,200,0,0.55) 0%, rgba(255,150,0,0.25) 45%, transparent 70%)',
                    animation: 'revengeDragonGlow 1.6s ease-in-out infinite',
                  }}
                />
              )}
              {glitching && (
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 4px)',
                      mixBlendMode: 'overlay',
                    }}
                  />
                  <div
                    className="absolute left-0 right-0"
                    style={{ height: '20%', background: 'rgba(28, 176, 246, 0.35)', animation: `rookieGlitchScan ${GLITCH_MS}ms linear` }}
                  />
                </div>
              )}
              <div
                key={form}
                className="relative flex items-center justify-center"
                style={{
                  animation: glitching
                    ? `rookieGlitchBase ${GLITCH_MS}ms steps(8)`
                    : isDragon ? 'revengeDragonIn 420ms cubic-bezier(0.16, 1, 0.3, 1)' : undefined,
                }}
              >
                <Sprite form={form} px={spritePx} animate={!glitching} />
                {glitching && (
                  <>
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ animation: `rookieGlitchShakeR ${GLITCH_MS}ms steps(6)`, filter: 'drop-shadow(2px 0 0 #ff4b4b)', mixBlendMode: 'screen' }}
                    >
                      <Sprite form={form} px={spritePx} animate={false} />
                    </div>
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ animation: `rookieGlitchShakeB ${GLITCH_MS}ms steps(6)`, filter: 'drop-shadow(-2px 0 0 #1cb0f6)', mixBlendMode: 'screen' }}
                    >
                      <Sprite form={form} px={spritePx} animate={false} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
        {REVENGE_FORMS.map((f) => {
          const active = form === f.form;
          const dragon = f.form === 'dragon';
          return (
            <button
              key={f.form}
              onClick={() => transform(f.form)}
              className={`flex flex-col items-center justify-center gap-1.5 min-h-[72px] rounded-2xl px-2 py-2.5 font-black text-sm shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition ${
                dragon ? 'bg-[#fff6d6] text-[#7a4a00]' : 'bg-white text-chess-text'
              } ${active ? 'ring-2 ring-chess-text' : 'hover:-translate-y-0.5'}`}
            >
              <span className="flex items-center justify-center h-7 w-7">
                <Sprite form={f.form} px={26} animate={false} />
              </span>
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Copied from Rookie's Revenge (~/rookies-run/components/run/Board.tsx) — the shipped transform glitch.
const GLITCH_CSS = `
@keyframes rookieGlitchBase {
  0%, 100% { transform: translate(0, 0); }
  20%      { transform: translate(2px, 0); }
  40%      { transform: translate(-2px, 0); }
  60%      { transform: translate(0, 1px); }
  80%      { transform: translate(1px, -1px); }
}
@keyframes rookieGlitchShakeR {
  0%, 100% { transform: translate(0, 0); opacity: 0; }
  10%      { transform: translate(3px, -2px); opacity: 0.75; }
  30%      { transform: translate(-2px, 1px); opacity: 0.6; }
  50%      { transform: translate(4px, 2px); opacity: 0.75; }
  70%      { transform: translate(-3px, -1px); opacity: 0.5; }
}
@keyframes rookieGlitchShakeB {
  0%, 100% { transform: translate(0, 0); opacity: 0; }
  15%      { transform: translate(-3px, 2px); opacity: 0.75; }
  35%      { transform: translate(2px, -1px); opacity: 0.6; }
  55%      { transform: translate(-4px, -2px); opacity: 0.75; }
  75%      { transform: translate(3px, 1px); opacity: 0.5; }
}
@keyframes rookieGlitchScan {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(500%); }
}
@keyframes revengeDragonGlow {
  0%, 100% { opacity: 0.6; transform: scale(0.92); }
  50%      { opacity: 1;   transform: scale(1.05); }
}
@keyframes revengeDragonIn {
  0%   { transform: scale(0.6); }
  100% { transform: scale(1); }
}
`;
