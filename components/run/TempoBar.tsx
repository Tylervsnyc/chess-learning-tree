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
    <div className="bg-chess-surface rounded-lg px-2.5 py-1.5 shadow-sm flex items-center gap-2.5">
      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-chess-text-muted leading-none">
        Tempo
      </span>
      <div className="flex items-baseline gap-0.5">
        <span className="text-sm font-black text-chess-text tabular-nums leading-none">
          {tempo}
        </span>
        <span className="text-chess-text-faint text-[10px] font-bold leading-none">
          /{TEMPO_MAX}
        </span>
      </div>

      <div className="flex-1 flex gap-0.5">
        {Array.from({ length: TEMPO_MAX }, (_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-sm ${
              i < tempo
                ? 'bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.6)]'
                : 'bg-chess-text/10'
            }`}
          />
        ))}
      </div>

      <div className="text-xs font-black text-chess-text leading-none">
        {FORM_LABEL[form]}
        {form !== 'rook' && formMovesLeft > 0 && (
          <span className="ml-1 text-chess-text-faint text-[10px] font-bold">
            ·{formMovesLeft}
          </span>
        )}
      </div>
    </div>
  );
}
