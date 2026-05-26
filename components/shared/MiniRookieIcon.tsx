import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';

/**
 * Mini Rookie — the rook mascot shrunk down for the nav streak badge.
 * Uses the same colored-block shape as the header logo / BreathingRook.
 *
 * - `active` (workout complete today): full color + happy bob + block sparkle wave
 * - inactive (streak alive, not done today): desaturated + gentle pulse
 * - `gold` (100+ day streak): gold drop-shadow rim
 */
export function MiniRookieIcon({
  active,
  gold = false,
  size = 18,
}: {
  active: boolean;
  gold?: boolean;
  size?: number;
}) {
  const BLOCK = 2.4;
  const GAP = 0.2;
  const PAD = 1.4;
  const cell = BLOCK + GAP;
  const w = PAD * 2 + 5 * cell - GAP;
  const h = PAD * 2 + 6 * cell - GAP;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      aria-hidden
      className={active ? 'mini-rookie-happy' : 'animate-pulse opacity-60'}
      style={
        gold
          ? {
              filter:
                'drop-shadow(0 0 0.6px #F5B40A) drop-shadow(0 0 1.4px #F5B40A)',
            }
          : undefined
      }
    >
      <style>{`
        @keyframes miniRookieBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%      { transform: translateY(-0.6px) rotate(-2deg); }
          50%      { transform: translateY(-1.2px) rotate(0deg); }
          75%      { transform: translateY(-0.6px) rotate(2deg); }
        }
        @keyframes miniRookieSparkle {
          0%, 70%, 100% { filter: brightness(1); }
          80%           { filter: brightness(1.6); }
        }
        .mini-rookie-happy {
          transform-origin: center 95%;
          animation: miniRookieBob 1.6s ease-in-out infinite;
        }
        .mini-rookie-happy rect {
          animation: miniRookieSparkle 2.4s ease-in-out infinite;
        }
      `}</style>

      {ROOK_BLOCKS.map((b, i) => {
        // Stagger the sparkle wave left→right, top→bottom so it ripples across.
        const delay = active ? `${b.x * 0.08 + b.y * 0.05}s` : '0s';
        return (
          <rect
            key={i}
            x={PAD + b.x * cell}
            y={PAD + b.y * cell}
            width={BLOCK}
            height={BLOCK}
            rx={0.45}
            fill={active ? b.color : '#94a3b8'}
            style={active ? { animationDelay: delay } : undefined}
          />
        );
      })}
    </svg>
  );
}
