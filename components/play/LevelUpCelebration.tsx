'use client';

export function LevelUpCelebration({ active }: { active: boolean }) {
  if (!active) return null;
  const sparks = Array.from({ length: 18 });
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
      <div className="levelup-glow absolute inset-0" />
      <div className="absolute left-1/2 top-1/2">
        {sparks.map((_, i) => (
          <span
            key={i}
            className="levelup-spark"
            style={
              {
                '--angle': `${(i * 360) / sparks.length + (i % 2 ? 8 : -8)}deg`,
                '--distance': `${90 + (i % 4) * 22}px`,
                '--delay': `${(i % 3) * 70}ms`,
                '--size': `${7 + (i % 3) * 3}px`,
                '--hue': i % 2 === 0 ? '#FFD700' : '#FFB347',
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <style>{`
        @keyframes levelup-glow-anim {
          0%   { opacity: 0; transform: scale(0.7); }
          15%  { opacity: 1; }
          60%  { opacity: 0.85; }
          100% { opacity: 0; transform: scale(1.35); }
        }
        .levelup-glow {
          background: radial-gradient(ellipse at center,
            rgba(255, 215, 0, 0.7) 0%,
            rgba(255, 165, 0, 0.35) 35%,
            rgba(255, 140, 0, 0.1) 60%,
            transparent 75%);
          border-radius: 9999px;
          filter: blur(10px);
          animation: levelup-glow-anim 1900ms ease-out forwards;
        }
        @keyframes levelup-spark-anim {
          0%   { transform: rotate(var(--angle)) translateX(0) scale(0.3); opacity: 0; }
          12%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: rotate(var(--angle)) translateX(var(--distance)) scale(1); opacity: 0; }
        }
        .levelup-spark {
          position: absolute;
          left: 0;
          top: 0;
          width: var(--size);
          height: var(--size);
          margin-left: calc(var(--size) / -2);
          margin-top: calc(var(--size) / -2);
          border-radius: 9999px;
          background: radial-gradient(circle, var(--hue) 0%, rgba(255, 140, 0, 0.9) 55%, transparent 100%);
          box-shadow: 0 0 10px var(--hue), 0 0 20px rgba(255, 165, 0, 0.9);
          animation: levelup-spark-anim 1700ms ease-out forwards;
          animation-delay: var(--delay);
        }
      `}</style>
    </div>
  );
}
