'use client';

interface RunIntroModalProps {
  onClose: () => void;
}

const RULES: { n: number; text: string }[] = [
  { n: 1, text: 'Reach the 8th rank' },
  { n: 2, text: 'Capture to charge tempo' },
  { n: 3, text: 'Show no mercy' },
];

export function RunIntroModal({ onClose }: RunIntroModalProps) {
  return (
    <>
      <style>{`
        @keyframes rookiesRunIntroPop {
          0%   { opacity: 0; transform: scale(0.92) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes rookiesRunRuleSlide {
          0%   { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-xs bg-chess-surface rounded-2xl shadow-2xl relative overflow-hidden"
          style={{ animation: 'rookiesRunIntroPop 0.25s ease-out backwards' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-chess-text/10 hover:bg-chess-text/20 active:scale-90 flex items-center justify-center text-chess-text-muted transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="px-5 pt-5 pb-3">
            <h2 className="text-base font-black text-chess-text uppercase tracking-wide">
              How to play
            </h2>
          </div>

          <ul className="px-5 pb-5 flex flex-col gap-2.5">
            {RULES.map((r, i) => (
              <li
                key={r.n}
                className="flex items-center gap-3"
                style={{ animation: `rookiesRunRuleSlide 0.3s ease-out ${0.1 + i * 0.08}s backwards` }}
              >
                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {r.n}
                </span>
                <span className="text-sm font-bold text-chess-text leading-tight">
                  {r.text}
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 active:scale-[0.99] text-white font-black text-sm uppercase tracking-wide transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  );
}
