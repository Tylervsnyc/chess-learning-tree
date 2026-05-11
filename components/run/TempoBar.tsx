'use client';

import { TEMPO_MAX } from '@/lib/run/scoring';
import type { RookieForm } from '@/lib/run/types';

interface TempoBarProps {
  tempo: number;
  form: RookieForm;
  formMovesLeft: number;
}

const FORM_LABEL: Record<RookieForm, string> = {
  rook: 'Rook',
  knight: 'Knight',
  bishop: 'Bishop',
  queen: 'Queen',
};

export function TempoBar({ tempo, form, formMovesLeft }: TempoBarProps) {
  return (
    <div className="bg-chess-surface rounded-xl px-3 py-2 shadow-sm flex items-center gap-3">
      <div className="flex flex-col">
        <div className="text-[10px] uppercase tracking-wide text-chess-text-faint">
          Tempo
        </div>
        <div className="text-lg font-black text-chess-text tabular-nums leading-tight">
          {tempo}
          <span className="text-chess-text-faint text-xs font-bold">/{TEMPO_MAX}</span>
        </div>
      </div>

      <div className="flex-1 flex gap-0.5">
        {Array.from({ length: TEMPO_MAX }, (_, i) => (
          <div
            key={i}
            className={`flex-1 h-3 rounded-sm ${
              i < tempo
                ? 'bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.6)]'
                : 'bg-chess-text/10'
            }`}
          />
        ))}
      </div>

      <div className="text-right">
        <div className="text-[10px] uppercase tracking-wide text-chess-text-faint">
          Form
        </div>
        <div className="text-sm font-black text-chess-text leading-tight">
          {FORM_LABEL[form]}
          {form !== 'rook' && formMovesLeft > 0 && (
            <span className="ml-1 text-chess-text-faint text-xs">
              · {formMovesLeft}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
