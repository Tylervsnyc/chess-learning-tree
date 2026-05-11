'use client';

interface LevelClearedModalProps {
  level: number;
  totalLevels: number;
  tempo: number;
  onNext: () => void;
}

export function LevelClearedModal({
  level,
  totalLevels,
  tempo,
  onNext,
}: LevelClearedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-[rookiesRunFadeIn_180ms_ease-out]">
      <style>{`
        @keyframes rookiesRunFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rookiesRunPopIn {
          0%   { opacity: 0; transform: scale(0.85) translateY(8px); }
          60%  { opacity: 1; transform: scale(1.03) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        className="w-full max-w-sm rounded-3xl bg-chess-surface shadow-2xl p-6 text-center"
        style={{ animation: 'rookiesRunPopIn 360ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="text-xs uppercase tracking-widest text-chess-text-faint">
          Level {level} of {totalLevels}
        </div>
        <h2 className="mt-1 text-3xl font-black text-chess-text">Cleared!</h2>
        <p className="mt-2 text-sm text-chess-text-muted">
          {tempo > 0
            ? `Carrying ${tempo} tempo into level ${level + 1}.`
            : `Onward to level ${level + 1}.`}
        </p>

        <div className="mt-5 flex justify-center">
          <button
            onClick={onNext}
            className="tap-highlight px-6 py-2.5 rounded-xl bg-chess-text text-white text-sm font-bold"
          >
            Next level →
          </button>
        </div>
      </div>
    </div>
  );
}
