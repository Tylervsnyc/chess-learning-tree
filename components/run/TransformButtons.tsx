'use client';

import { PieceBlocks } from './PieceBlocks';
import { transformCost } from '@/lib/run/movement';
import type { RookieForm } from '@/lib/run/types';

interface TransformButtonsProps {
  tempo: number;
  currentForm: RookieForm;
  allowedForms: ReadonlyArray<RookieForm>;
  onTransform: (form: RookieForm) => void;
  disabled?: boolean;
}

const FORM_LABEL: Record<RookieForm, string> = {
  rook: 'Rook',
  knight: 'Knight',
  bishop: 'Bishop',
  queen: 'Queen',
};

export function TransformButtons({
  tempo,
  currentForm,
  allowedForms,
  onTransform,
  disabled = false,
}: TransformButtonsProps) {
  const forms = allowedForms.filter((f) => f !== 'rook');
  if (forms.length === 0) return null;

  return (
    <div className="flex gap-2">
      {forms.map((f) => {
        const cost = transformCost(f);
        const cantAfford = tempo < cost;
        const isActive = currentForm === f;
        const btnDisabled = disabled || cantAfford;
        return (
          <button
            key={f}
            type="button"
            disabled={btnDisabled}
            onClick={() => onTransform(f)}
            className={`tap-highlight relative flex-1 rounded-2xl px-3 py-3 font-bold border-2 transition overflow-hidden
              ${
                isActive
                  ? 'bg-gradient-to-br from-amber-200 to-amber-300 border-amber-500 text-amber-950 shadow-inner'
                  : btnDisabled
                    ? 'bg-chess-surface border-chess-text/10 text-chess-text-faint opacity-50'
                    : 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-chess-text/15 text-chess-text hover:from-amber-50 hover:to-amber-100 hover:border-amber-300 active:scale-95 shadow-md'
              }`}
            style={{
              boxShadow: isActive
                ? '0 0 0 3px rgba(251, 191, 36, 0.4), inset 0 2px 6px rgba(0,0,0,0.1)'
                : undefined,
            }}
          >
            {isActive && (
              <span
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background:
                    'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.6), transparent 60%)',
                }}
              />
            )}
            <div className="relative flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 shrink-0">
                <PieceBlocks
                  piece={f === 'knight' ? 'N' : 'B'}
                  blockSize={2}
                  animate={!btnDisabled}
                />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm leading-none">{FORM_LABEL[f]}</div>
                <div
                  className={`mt-1 inline-flex items-center gap-1 text-[11px] font-black tabular-nums px-1.5 py-0.5 rounded-md
                    ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-900'
                        : cantAfford
                          ? 'bg-chess-text/5 text-chess-text-faint'
                          : 'bg-amber-100 text-amber-700'
                    }`}
                >
                  <span className="text-amber-500">◆</span> {cost} tempo
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
