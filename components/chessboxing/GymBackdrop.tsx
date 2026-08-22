'use client';

/**
 * GymBackdrop — "The Gym After Hours" background for the /play setup screen
 * inside the Chess Boxing shell (picked by Tyler from /test/play-boxing-bg,
 * 2026-08-07). Heavy bags on chains framing the edges, one warm bulb, the
 * "THERE IS NO TOMORROW" neon, cinderblock wall, chalk dust, and a soft spotlight
 * pooling where Rookie stands. Pure CSS/SVG — no assets, no state.
 *
 * Render absolutely inside a relative dark container (bg-[#10162a]); put the
 * screen content above it with z-10.
 */

const GYM_CSS = `
@keyframes cbgFlicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:.55} 94%{opacity:1} 97%{opacity:.75} 98%{opacity:1} }
@keyframes cbgSway { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2.4deg)} }
@keyframes cbgSwaySlow { 0%,100%{transform:rotate(1.4deg)} 50%{transform:rotate(-1.6deg)} }
@keyframes cbgBreathe { 0%,100%{opacity:.7} 50%{opacity:1} }
@keyframes cbgGlow { 0%,100%{opacity:.55} 50%{opacity:1} }
@keyframes cbgDust { 0%{transform:translateY(0); opacity:.4} 100%{transform:translateY(-46px); opacity:0} }
@media (prefers-reduced-motion: reduce) {
  .cbg-anim, .cbg-anim * { animation: none !important; }
}
`;

export function GymBackdrop() {
  return (
    <div className="cbg-anim absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <style>{GYM_CSS}</style>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #141c33 0%, #10162a 55%, #0b101e 100%)' }} />
      {/* cinderblock wall */}
      <div
        className="absolute inset-x-0 top-0 h-[55%] opacity-[0.13]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0 24px, rgba(255,255,255,0.35) 24px 25px), repeating-linear-gradient(90deg, transparent 0 50px, rgba(255,255,255,0.25) 50px 51px)',
        }}
      />
      {/* neon */}
      <div className="absolute top-[54px] left-1/2 -translate-x-1/2 whitespace-nowrap" style={{ animation: 'cbgFlicker 7s linear infinite' }}>
        <span
          className="text-[12px] font-black uppercase tracking-[0.3em] text-[#ff7a7a]"
          style={{ textShadow: '0 0 8px rgba(255,90,90,0.9), 0 0 22px rgba(255,60,60,0.55)' }}
        >
          there is no tomorrow
        </span>
      </div>
      {/* bulb */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-7 bg-black/60" />
      <div
        className="absolute left-1/2 top-7 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#ffd98a] shadow-[0_0_16px_6px_rgba(255,200,110,0.5)]"
        style={{ animation: 'cbgGlow 4s ease-in-out infinite' }}
      />
      {/* heavy bags framing the edges */}
      <HeavyBag side="left" delay={0} h={170} />
      <HeavyBag side="right" delay={1.6} h={140} slow />
      {/* chalk dust */}
      {[20, 46, 64, 80, 33].map((x, i) => (
        <span
          key={x}
          className="absolute rounded-full bg-white/30"
          style={{ left: `${x}%`, top: `${42 + ((i * 11) % 26)}%`, width: 2, height: 2, animation: `cbgDust ${6 + i}s linear ${i * 0.9}s infinite` }}
        />
      ))}
      {/* spotlight pooling on Rookie */}
      <div
        className="absolute inset-x-0 top-[8%] h-[52%]"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 38%, rgba(255,225,170,0.14), transparent 72%)', animation: 'cbgBreathe 6s ease-in-out infinite' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-44" style={{ background: 'linear-gradient(to top, rgba(4,7,14,0.85), transparent)' }} />
    </div>
  );
}

function HeavyBag({ side, delay, h, slow }: { side: 'left' | 'right'; delay: number; h: number; slow?: boolean }) {
  const bagTop = 58;
  const total = bagTop + h + 8;
  return (
    <div
      className="absolute top-0 drop-shadow-[0_16px_20px_rgba(0,0,0,0.55)]"
      style={{
        [side]: '-14px',
        transformOrigin: 'top center',
        animation: `${slow ? 'cbgSwaySlow' : 'cbgSway'} ${slow ? 7.5 : 6}s ease-in-out ${delay}s infinite`,
      }}
    >
      <svg width={76} height={total} viewBox={`0 0 76 ${total}`} aria-hidden>
        <defs>
          <linearGradient id={`cbgBag-${side}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5c1e1e" />
            <stop offset="0.3" stopColor="#8a2f2f" />
            <stop offset="0.55" stopColor="#963933" />
            <stop offset="0.8" stopColor="#61201f" />
            <stop offset="1" stopColor="#401414" />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={38} cy={8 + i * 9} rx={3.2} ry={4.6} fill="none" stroke="#8b98ab" strokeWidth="2" opacity={0.85} />
        ))}
        <circle cx={38} cy={36} r={5} fill="none" stroke="#a8b4c4" strokeWidth="2.6" />
        {[14, 28, 48, 62].map((x) => (
          <path key={x} d={`M38 39 L${x} ${bagTop + 4}`} stroke="#2e1010" strokeWidth="4.5" strokeLinecap="round" />
        ))}
        <rect x={10} y={bagTop} width={56} height={9} rx={4.5} fill="#331111" />
        <path
          d={`M12 ${bagTop + 7}
              C 10 ${bagTop + h * 0.45}, 9 ${bagTop + h * 0.75}, 13 ${bagTop + h - 12}
              Q 15 ${bagTop + h}, 26 ${bagTop + h + 3}
              Q 38 ${bagTop + h + 6}, 50 ${bagTop + h + 3}
              Q 61 ${bagTop + h}, 63 ${bagTop + h - 12}
              C 67 ${bagTop + h * 0.75}, 66 ${bagTop + h * 0.45}, 64 ${bagTop + 7}
              Z`}
          fill={`url(#cbgBag-${side})`}
        />
        {[24, 38, 52].map((x) => (
          <path
            key={x}
            d={`M${x} ${bagTop + 9} C ${x - 1} ${bagTop + h * 0.5}, ${x - 1} ${bagTop + h * 0.75}, ${x} ${bagTop + h - 4}`}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="1.4"
            fill="none"
          />
        ))}
        <path d={`M12 ${bagTop + h * 0.42} Q 38 ${bagTop + h * 0.46} 64 ${bagTop + h * 0.42}`} stroke="rgba(0,0,0,0.3)" strokeWidth="5" fill="none" />
        <path d={`M12 ${bagTop + h * 0.42} Q 38 ${bagTop + h * 0.46} 64 ${bagTop + h * 0.42}`} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
        <path
          d={`M20 ${bagTop + 10} C 17 ${bagTop + h * 0.4}, 17 ${bagTop + h * 0.7}, 21 ${bagTop + h - 14}`}
          stroke="rgba(255,205,130,0.28)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          style={{ filter: 'blur(2px)' }}
        />
        <ellipse cx={44} cy={bagTop + h * 0.55} rx={7} ry={3.5} fill="rgba(0,0,0,0.18)" />
        <ellipse cx={30} cy={bagTop + h * 0.68} rx={5} ry={2.6} fill="rgba(0,0,0,0.15)" />
      </svg>
    </div>
  );
}
