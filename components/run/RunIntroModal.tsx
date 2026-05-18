'use client';

import { RookiesRunLogo } from './RookiesRunLogo';

interface RunIntroModalProps {
  onClose: () => void;
  /** Optional tagline shown in the flavor text area (e.g. STC co-brand). */
  tagline?: string;
}

const RULES: { n: number; text: string }[] = [
  { n: 1, text: 'Reach the 8th rank.' },
  { n: 2, text: 'Capture to charge tempo.' },
  { n: 3, text: 'Show no mercy.' },
];

export function RunIntroModal({ onClose, tagline }: RunIntroModalProps) {
  const title = "Rookie's Run";

  return (
    <>
      <style>{`
        @keyframes mtgCardEntry {
          0%   { opacity: 0; transform: rotateY(-22deg) scale(0.9); }
          60%  { opacity: 1; transform: rotateY(4deg) scale(1.02); }
          100% { opacity: 1; transform: rotateY(0) scale(1); }
        }
        @keyframes mtgRuleSlide {
          0%   { opacity: 0; transform: translateX(-6px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes mtgShine {
          0%   { transform: translateX(-120%) skewX(-20deg); }
          100% { transform: translateX(220%) skewX(-20deg); }
        }
        .mtg-card {
          background:
            radial-gradient(ellipse at 30% 0%, #2a1a08 0%, #120902 70%),
            linear-gradient(180deg, #2a1a08 0%, #0c0501 100%);
          box-shadow:
            0 0 0 1px #6b4a1a,
            0 0 0 3px #1a0d05,
            0 24px 60px -10px rgba(0,0,0,0.7),
            0 8px 20px -4px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,220,150,0.15);
        }
        .mtg-art {
          background:
            radial-gradient(ellipse at 50% 30%, #fbe9b8 0%, #e9c976 55%, #b88f3a 100%);
          box-shadow:
            inset 0 0 0 1px #6b4a1a,
            inset 0 0 14px rgba(80,40,0,0.35),
            inset 0 2px 0 rgba(255,235,180,0.4);
        }
        .mtg-textbox {
          background: linear-gradient(180deg, #f3e5c2 0%, #e6d4a3 100%);
          box-shadow:
            inset 0 0 0 1px #6b4a1a,
            inset 0 2px 4px rgba(0,0,0,0.15);
          color: #1a1207;
        }
        .mtg-typeline {
          background: linear-gradient(180deg, #2a1a08 0%, #1a0d05 100%);
          box-shadow:
            inset 0 0 0 1px #6b4a1a,
            inset 0 1px 0 rgba(255,220,150,0.2);
        }
        .mtg-title-bar {
          background: linear-gradient(180deg, #2a1a08 0%, #1a0d05 100%);
          box-shadow:
            inset 0 0 0 1px #6b4a1a,
            inset 0 1px 0 rgba(255,220,150,0.25);
        }
        .mtg-cost {
          background: radial-gradient(circle at 35% 30%, #fff5d6 0%, #f5c850 45%, #b88820 100%);
          box-shadow:
            0 0 0 1px #6b4a1a,
            inset 0 -1px 2px rgba(0,0,0,0.4),
            inset 0 1px 1px rgba(255,255,255,0.5);
          color: #1a0d05;
        }
        .mtg-pt-box {
          background: linear-gradient(180deg, #2a1a08 0%, #120902 100%);
          box-shadow:
            inset 0 0 0 1px #6b4a1a,
            inset 0 1px 0 rgba(255,220,150,0.25),
            0 2px 6px rgba(0,0,0,0.5);
        }
        .mtg-begin {
          background: linear-gradient(180deg, #c9a14a 0%, #8a6a1f 100%);
          box-shadow:
            inset 0 0 0 1px #2a1a08,
            inset 0 1px 0 rgba(255,235,180,0.6),
            inset 0 -2px 0 rgba(0,0,0,0.3);
          color: #1a0d05;
          text-shadow: 0 1px 0 rgba(255,235,180,0.5);
        }
        .mtg-begin:active { transform: translateY(1px); filter: brightness(0.95); }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-3 py-3 overflow-auto"
        onClick={onClose}
      >
        <div
          className="mtg-card relative w-full max-w-[300px] rounded-[14px] p-2"
          style={{ animation: 'mtgCardEntry 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.1) backwards', perspective: '1000px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title bar */}
          <div className="mtg-title-bar rounded-md px-3 py-1.5 flex items-center justify-between gap-2">
            <h2 className="text-[13px] font-black text-[#f3e5c2] uppercase tracking-wide truncate leading-none">
              {title}
            </h2>
            <div className="mtg-cost w-6 h-6 rounded-full flex items-center justify-center text-xs font-black leading-none shrink-0">
              R
            </div>
          </div>

          {/* Art box */}
          <div className="mtg-art mt-1.5 rounded-md h-[130px] flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{ animation: 'mtgShine 2.4s ease-in-out 0.6s 1 backwards' }}
              />
            </div>
            <div style={{ transform: 'scale(0.55)' }}>
              <RookiesRunLogo scale={0.55} />
            </div>
          </div>

          {/* Type line */}
          <div className="mtg-typeline mt-1.5 rounded-md px-3 py-1">
            <p className="text-[10px] font-black text-[#f3e5c2] uppercase tracking-[0.14em] leading-none">
              Daily · Roguelike Run
            </p>
          </div>

          {/* Text box */}
          <div className="mtg-textbox mt-1.5 rounded-md px-3 py-2.5 flex flex-col gap-1.5">
            {RULES.map((r, i) => (
              <div
                key={r.n}
                className="flex items-start gap-2.5"
                style={{ animation: `mtgRuleSlide 0.3s ease-out ${0.35 + i * 0.08}s backwards` }}
              >
                <span className="mtg-cost w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black leading-none shrink-0 mt-px">
                  {r.n}
                </span>
                <span className="text-[13px] font-bold leading-snug">{r.text}</span>
              </div>
            ))}

            <div className="mt-0.5 pt-1.5 border-t border-[#6b4a1a]/30">
              <p className="text-[11px] italic leading-snug text-[#5a3a14]">
                {tagline || '"She\'s got this. (She does not have this.)"'}
              </p>
            </div>
          </div>

          {/* Power/toughness slot — repurposed as the Begin CTA */}
          <div className="mt-1.5 flex items-end justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="mtg-begin flex-1 py-2 rounded-md text-[13px] font-black uppercase tracking-[0.18em] transition-all"
            >
              Begin
            </button>
            <div className="mtg-pt-box rounded-md px-2.5 py-1 text-[#f3e5c2] text-[11px] font-black leading-none tabular-nums">
              10/10
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
