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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-[rookiesRunFadeIn_220ms_ease-out]">
      <style>{`
        @keyframes rookiesRunFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rookiesRunPopIn {
          0%   { opacity: 0; transform: scale(0.7) translateY(20px); }
          55%  { opacity: 1; transform: scale(1.05) translateY(0); }
          80%  { transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes rookiesRunRays {
          0%   { transform: rotate(0deg) scale(0.6); opacity: 0; }
          25%  { opacity: 0.85; }
          100% { transform: rotate(180deg) scale(1.4); opacity: 0; }
        }
        @keyframes rookiesRunSparkleA {
          0%, 100% { opacity: 0; transform: scale(0.4) rotate(0deg); }
          50%      { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        @keyframes rookiesRunSparkleB {
          0%, 100% { opacity: 0; transform: scale(0.6) translateY(0); }
          40%      { opacity: 1; transform: scale(1.1) translateY(-4px); }
        }
        @keyframes rookiesRunParticleUp {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.6); }
          15%  { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--dx, 0px), -60px) scale(1.1); }
        }
        @keyframes rookiesRunHeadingGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(255,215,0,0.4), 0 0 24px rgba(255,180,40,0.15); }
          50%      { text-shadow: 0 0 18px rgba(255,215,0,0.8), 0 0 40px rgba(255,180,40,0.45); }
        }
      `}</style>

      <div
        className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-amber-900/30 dark:via-chess-surface dark:to-amber-950/30 shadow-2xl p-6 text-center overflow-hidden"
        style={{ animation: 'rookiesRunPopIn 520ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {/* Radial sunburst behind the headline */}
        <div
          aria-hidden
          className="absolute left-1/2 top-16 -translate-x-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(255,215,0,0) 0deg, rgba(255,215,0,0.35) 20deg, rgba(255,215,0,0) 40deg, rgba(255,215,0,0.35) 60deg, rgba(255,215,0,0) 80deg, rgba(255,215,0,0.35) 100deg, rgba(255,215,0,0) 120deg, rgba(255,215,0,0.35) 140deg, rgba(255,215,0,0) 160deg, rgba(255,215,0,0.35) 180deg, rgba(255,215,0,0) 200deg, rgba(255,215,0,0.35) 220deg, rgba(255,215,0,0) 240deg, rgba(255,215,0,0.35) 260deg, rgba(255,215,0,0) 280deg, rgba(255,215,0,0.35) 300deg, rgba(255,215,0,0) 320deg, rgba(255,215,0,0.35) 340deg, rgba(255,215,0,0) 360deg)',
            animation: 'rookiesRunRays 1500ms ease-out forwards',
            filter: 'blur(2px)',
          }}
        />
        {/* Floating sparkles */}
        {[
          { top: '12%', left: '14%', size: 18, delay: '0s' },
          { top: '18%', right: '12%', size: 22, delay: '0.18s' },
          { top: '40%', left: '8%', size: 14, delay: '0.36s' },
          { top: '46%', right: '7%', size: 16, delay: '0.5s' },
          { top: '8%', left: '52%', size: 12, delay: '0.7s' },
        ].map((s, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute text-amber-400 pointer-events-none font-black"
            style={{
              top: s.top,
              left: s.left,
              right: s.right,
              fontSize: s.size,
              animation: `rookiesRunSparkleA 1.6s ease-in-out ${s.delay} infinite`,
            }}
          >
            ✦
          </div>
        ))}
        {/* Particle puffs from below */}
        {[10, 28, 50, 72, 90].map((leftPct, i) => (
          <div
            key={`p${i}`}
            aria-hidden
            className="absolute bottom-3 w-1.5 h-1.5 rounded-full bg-amber-400 pointer-events-none"
            style={{
              left: `${leftPct}%`,
              ['--dx' as string]: `${i % 2 === 0 ? -6 : 8}px`,
              animation: `rookiesRunParticleUp ${1200 + i * 120}ms ease-out ${i * 80}ms infinite`,
            }}
          />
        ))}

        <div className="relative z-10">
          <div className="text-xs uppercase tracking-widest text-chess-text-faint">
            Level {level} of {totalLevels}
          </div>
          <h2
            className="mt-1 text-4xl font-black text-chess-text"
            style={{ animation: 'rookiesRunHeadingGlow 2s ease-in-out infinite' }}
          >
            Cleared!
          </h2>
          <p className="mt-2 text-sm text-chess-text-muted">
            {tempo > 0
              ? `Carrying ${tempo} tempo into level ${level + 1}.`
              : `Onward to level ${level + 1}.`}
          </p>

          <div className="mt-5 flex justify-center">
            <button
              onClick={onNext}
              className="tap-highlight px-6 py-2.5 rounded-xl bg-chess-text text-white text-sm font-bold shadow-lg active:scale-95 transition-transform"
            >
              Next level →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
