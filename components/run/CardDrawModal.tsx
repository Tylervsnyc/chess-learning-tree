'use client';

import { CARD_DEFS, type CardId } from '@/lib/run/cards';
import { CardIcon } from './CardIcon';

interface CardDrawModalProps {
  options: CardId[];
  handFull: boolean;
  onPick: (cardId: CardId) => void;
  onDismiss: () => void;
}

export function CardDrawModal({
  options,
  handFull,
  onPick,
  onDismiss,
}: CardDrawModalProps) {
  return (
    <>
      <style>{`
        @keyframes rookiesRunDrawPop {
          0%   { opacity: 0; transform: scale(0.85) translateY(20px); }
          70%  { opacity: 1; transform: scale(1.04) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes rookiesRunCardEntrance {
          0%   { opacity: 0; transform: translateY(40px) rotate(-8deg); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg); }
        }
        @keyframes rookiesRunSparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%      { opacity: 1;   transform: scale(1.1); }
        }
        .rookies-run-draw-card {
          animation: rookiesRunCardEntrance 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
        }
        .rookies-run-draw-card:nth-child(1) { animation-delay: 0.15s; }
        .rookies-run-draw-card:nth-child(2) { animation-delay: 0.28s; }
        .rookies-run-draw-card:hover:not(:disabled) {
          transform: translateY(-4px) rotate(-1deg);
        }
        .rookies-run-draw-card:nth-child(2):hover:not(:disabled) {
          transform: translateY(-4px) rotate(1deg);
        }
        .rookies-run-sparkle {
          animation: rookiesRunSparkle 1.6s ease-in-out infinite;
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        style={{ animation: 'rookiesRunDrawPop 0.35s ease-out backwards' }}
      >
        <div className="w-full max-w-sm bg-chess-surface rounded-3xl shadow-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
          {/* decorative sparkles */}
          <div
            className="absolute top-3 right-4 text-amber-400 rookies-run-sparkle"
            style={{ animationDelay: '0s' }}
          >
            ✦
          </div>
          <div
            className="absolute top-8 left-5 text-amber-400 rookies-run-sparkle text-xs"
            style={{ animationDelay: '0.4s' }}
          >
            ✦
          </div>
          <div
            className="absolute bottom-10 right-6 text-amber-400 rookies-run-sparkle text-sm"
            style={{ animationDelay: '0.8s' }}
          >
            ✦
          </div>

          <div className="text-center relative z-10">
            <div className="text-[11px] uppercase tracking-[0.2em] text-amber-500 font-black">
              ★ Tempo Full ★
            </div>
            <div className="text-2xl font-black text-chess-text leading-tight mt-1">
              {handFull ? 'No room for cards' : 'Pick your power'}
            </div>
          </div>

          {handFull ? (
            <div className="flex flex-col items-center gap-4 relative z-10 py-2">
              <p className="text-center text-sm text-chess-text-muted px-2 leading-snug">
                Your hand is full. The tempo fizzles out — play a card to make
                room for the next one.
              </p>
              <button
                type="button"
                onClick={onDismiss}
                className="rookies-run-draw-card px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-black text-sm shadow-lg transition-all"
              >
                OK
              </button>
            </div>
          ) : (
            <div className="flex gap-3 relative z-10">
              {options.map((cardId) => {
                const def = CARD_DEFS[cardId];
                return (
                  <button
                    key={cardId}
                    type="button"
                    onClick={() => onPick(cardId)}
                    className="rookies-run-draw-card flex-1 aspect-[3/4] rounded-2xl bg-gradient-to-br from-indigo-200 via-indigo-100 to-purple-100 dark:from-indigo-800/60 dark:via-indigo-900/60 dark:to-purple-900/60 border-2 border-indigo-400 dark:border-indigo-600 shadow-lg p-3 flex flex-col items-center justify-between text-center active:scale-[0.95] transition-transform text-indigo-700 dark:text-indigo-200"
                  >
                    <div className="text-sm font-semibold text-indigo-700/90 dark:text-indigo-100/90 leading-tight tracking-wide">
                      {def.name}
                    </div>
                    <CardIcon cardId={cardId} size={48} />
                    <div className="text-[10px] font-normal text-indigo-900/60 dark:text-indigo-100/70 leading-snug px-1">
                      {def.blurb}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
