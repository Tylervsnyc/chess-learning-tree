'use client';

import { RUNS, type RunDef } from '@/lib/run/runs';
import { RookiesRunLogo } from './RookiesRunLogo';

interface RunPickerModalProps {
  currentRunId: string;
  onPick: (runId: string) => void;
  onClose: () => void;
}

export function RunPickerModal({ currentRunId, onPick, onClose }: RunPickerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6">
      <div className="w-full max-w-sm bg-chess-surface rounded-3xl shadow-2xl flex flex-col relative overflow-hidden max-h-full">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-chess-text/10 hover:bg-chess-text/20 active:scale-90 flex items-center justify-center text-chess-text-muted transition-all z-10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-3 flex flex-col items-center gap-3">
          <RookiesRunLogo scale={0.6} />
          <h2 className="text-sm font-black text-chess-text-muted leading-tight">
            {RUNS.length} ways to climb
          </h2>
        </div>

        <div className="flex-1 overflow-auto px-4 pb-5 flex flex-col gap-2">
          {RUNS.map((run, idx) => (
            <RunRow
              key={run.id}
              run={run}
              index={idx}
              active={run.id === currentRunId}
              onClick={() => onPick(run.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface RunRowProps {
  run: RunDef;
  index: number;
  active: boolean;
  onClick: () => void;
}

function RunRow({ run, index, active, onClick }: RunRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl p-3 border-2 transition-all active:scale-[0.98] flex items-center gap-3 ${
        active
          ? 'bg-indigo-500/15 border-indigo-400 dark:border-indigo-500'
          : 'bg-chess-page hover:bg-chess-text/5 border-transparent'
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center font-black shrink-0 ${
          active
            ? 'bg-indigo-500 text-white'
            : 'bg-chess-text/10 text-chess-text-muted'
        }`}
      >
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-black text-chess-text text-sm leading-tight flex items-center gap-2">
          {run.name}
          {active && (
            <span className="text-[10px] uppercase tracking-wide text-indigo-500 font-black">
              Playing
            </span>
          )}
        </div>
        <div className="text-[11px] text-chess-text-muted leading-snug mt-0.5">
          {run.blurb} · {run.levels.length} levels
        </div>
      </div>
    </button>
  );
}
