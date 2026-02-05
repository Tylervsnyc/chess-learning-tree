'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

// Styles for animations
export const progressBarStyles = `
  @keyframes lavaSurge {
    0%, 100% {
      background-position: 0% 50%;
      filter: brightness(1);
    }
    25% {
      filter: brightness(1.1);
    }
    50% {
      background-position: 100% 50%;
      filter: brightness(1.2);
    }
    75% {
      filter: brightness(1.05);
    }
  }

  @keyframes lavaGlow {
    0%, 100% {
      opacity: 0.4;
      transform: scaleY(1);
    }
    50% {
      opacity: 0.7;
      transform: scaleY(1.3);
    }
  }

  @keyframes lavaBubble {
    0%, 100% {
      transform: translateY(0) scale(1);
      opacity: 0.6;
    }
    50% {
      transform: translateY(-2px) scale(1.2);
      opacity: 1;
    }
  }

  @keyframes magicTravel {
    0% {
      left: 0%;
      transform: translateX(-50%) scale(0.5);
      opacity: 0;
    }
    10% {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }
    90% {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }
    100% {
      left: var(--travel-end, 80%);
      transform: translateX(-50%) scale(1.5);
      opacity: 1;
    }
  }

  @keyframes magicBurst {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(2.5);
      opacity: 0.8;
    }
    100% {
      transform: scale(3);
      opacity: 0;
    }
  }

  @keyframes magicSparkle {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes magicRing {
    0% {
      transform: scale(0.5);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes trailFade {
    0% {
      opacity: 0.8;
      transform: scaleX(1);
    }
    100% {
      opacity: 0;
      transform: scaleX(0.3);
    }
  }

  @keyframes comboFlash {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    15% {
      opacity: 1;
      transform: scale(1.1);
    }
    100% {
      opacity: 0;
      transform: scale(1.5);
    }
  }

  @keyframes comboRainbow {
    0% {
      background-position: 0% 50%;
      filter: brightness(1.5) saturate(1.5);
    }
    50% {
      background-position: 100% 50%;
      filter: brightness(2) saturate(2);
    }
    100% {
      background-position: 200% 50%;
      filter: brightness(1) saturate(1);
    }
  }

  @keyframes particleBurst {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes shockwave {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    100% {
      transform: scale(3);
      opacity: 0;
    }
  }

  @keyframes starPop {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: scale(1.2) rotate(180deg);
      opacity: 1;
    }
    100% {
      transform: scale(0) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes flashPulse {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
    100% {
      opacity: 0;
      transform: scale(1.2);
    }
  }

  @keyframes electricField {
    0% {
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes trailGrow {
    0% {
      transform: translateY(-50%) scaleX(0);
      transform-origin: left center;
    }
    100% {
      transform: translateY(-50%) scaleX(1);
      transform-origin: left center;
    }
  }

  @keyframes crackle {
    0% {
      opacity: 0;
      transform: translateY(-50%) scale(0.5);
    }
    50% {
      opacity: 1;
      transform: translateY(-50%) scale(1.2);
    }
    100% {
      opacity: 0;
      transform: translateY(-50%) scale(0.8);
    }
  }

  @keyframes boltTravel {
    0% {
      left: 5px;
      transform: translateY(-50%) scale(0.8);
      opacity: 0;
    }
    10% {
      transform: translateY(-50%) scale(1);
      opacity: 1;
    }
    100% {
      left: var(--travel-end, 80%);
      transform: translateY(-50%) scale(1.1);
      opacity: 1;
    }
  }

  @keyframes glowPulse {
    0%, 100% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  @keyframes impactFlash {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes megaBurst {
    0% {
      transform: scale(0.3);
      opacity: 1;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.8;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  @keyframes electricRing {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(5);
      opacity: 0;
    }
  }

  @keyframes afterglowFade {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes streakLossFall {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(30px) scale(0.5);
    }
  }

  @keyframes streakLossFlash {
    0%, 100% {
      background-color: transparent;
    }
    50% {
      background-color: rgba(255, 75, 75, 0.3);
    }
  }
`;

// ============================================
// LIGHTNING STREAK CELEBRATION
// Duolingo-style: Lightning bolt shoots across the progress bar
// Extends OUTSIDE the bar for dramatic effect
// ============================================
interface MagicStreakProps {
  endPosition: number; // 0-100 percentage
  onComplete: () => void;
}

function MagicStreakCelebration({ endPosition, onComplete }: MagicStreakProps) {
  const [phase, setPhase] = useState<'flash' | 'travel' | 'burst' | 'afterglow' | 'done'>('flash');
  const containerRef = useRef<HTMLDivElement>(null);

  // Timing
  const flashDuration = 80;
  const travelDuration = 350;
  const burstDuration = 500;
  const afterglowDuration = 400;

  useEffect(() => {
    // Flash phase (instant bright flash)
    const flashTimer = setTimeout(() => {
      setPhase('travel');
    }, flashDuration);

    // Travel phase
    const travelTimer = setTimeout(() => {
      setPhase('burst');
    }, flashDuration + travelDuration);

    // Afterglow phase
    const afterglowTimer = setTimeout(() => {
      setPhase('afterglow');
    }, flashDuration + travelDuration + burstDuration);

    // End
    const endTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, flashDuration + travelDuration + burstDuration + afterglowDuration);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(travelTimer);
      clearTimeout(afterglowTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  // Generate static random values for consistent rendering
  const sparkOffsets = [12, -18, 8, -25, 20, -10, 15, -22];
  const sparkSizes = [5, 4, 6, 3, 5, 4, 7, 3];
  const cracklePositions = [15, 30, 45, 60, 75];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 100,
        overflow: 'visible',
      }}
    >
      {/* Initial screen flash */}
      {phase === 'flash' && (
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,220,100,0.4) 40%, transparent 70%)',
            animation: 'flashPulse 80ms ease-out forwards',
          }}
        />
      )}

      {/* Lightning bolt traveling across */}
      {phase === 'travel' && (
        <>
          {/* Electric field glow along the bar */}
          <div
            className="absolute top-1/2 h-8 rounded-full"
            style={{
              left: '5px',
              right: '5px',
              transform: 'translateY(-50%)',
              background: 'linear-gradient(90deg, rgba(255,220,100,0.1) 0%, rgba(255,200,50,0.2) 50%, rgba(255,220,100,0.1) 100%)',
              filter: 'blur(8px)',
              animation: `electricField ${travelDuration}ms ease-out forwards`,
            }}
          />

          {/* Bright electric trail */}
          <div
            className="absolute top-1/2 h-2 rounded-full"
            style={{
              left: '5px',
              width: `calc(${endPosition}% - 10px)`,
              transform: 'translateY(-50%)',
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(255, 240, 100, 0.3) 10%,
                rgba(255, 255, 150, 0.7) 50%,
                rgba(255, 255, 255, 1) 100%
              )`,
              boxShadow: '0 0 15px rgba(255, 220, 50, 0.8), 0 0 30px rgba(255, 180, 50, 0.4)',
              animation: `trailGrow ${travelDuration}ms cubic-bezier(0.1, 0, 0.2, 1) forwards`,
            }}
          />

          {/* Electric crackles along the path */}
          {cracklePositions.map((pos, i) => (
            <div
              key={`crackle-${i}`}
              className="absolute top-1/2"
              style={{
                left: `calc(5px + ${(pos * endPosition) / 100}%)`,
                transform: 'translateY(-50%)',
                opacity: 0,
                animation: `crackle 100ms ease-out ${(pos / 100) * travelDuration}ms forwards`,
              }}
            >
              <svg width="16" height="24" viewBox="0 0 16 24" style={{ filter: 'drop-shadow(0 0 3px #FFD700)' }}>
                <path
                  d={i % 2 === 0
                    ? "M8,0 L6,8 L10,10 L4,24 M8,0 L10,6 L6,8"
                    : "M8,0 L10,7 L6,9 L12,24 M8,0 L5,5 L9,7"}
                  stroke="#FFE566"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
          ))}

          {/* Main lightning bolt head - larger and more dramatic */}
          <div
            className="absolute top-1/2"
            style={{
              left: '5px',
              transform: 'translateY(-50%)',
              animation: `boltTravel ${travelDuration}ms cubic-bezier(0.1, 0, 0.2, 1) forwards`,
              '--travel-end': `calc(${endPosition}% - 20px)`,
            } as React.CSSProperties}
          >
            {/* Massive outer glow */}
            <div
              className="absolute rounded-full"
              style={{
                width: 80,
                height: 80,
                left: -40,
                top: -40,
                background: 'radial-gradient(circle, rgba(255,240,100,0.6) 0%, rgba(255,200,50,0.3) 40%, transparent 70%)',
                filter: 'blur(10px)',
                animation: 'glowPulse 100ms ease-in-out infinite',
              }}
            />

            {/* Lightning bolt shape - bigger */}
            <svg width="50" height="60" viewBox="0 0 50 60" className="relative"
              style={{
                marginTop: -30,
                marginLeft: -15,
                filter: 'drop-shadow(0 0 12px #FFD700) drop-shadow(0 0 25px #FFA500) drop-shadow(0 0 40px rgba(255,150,0,0.5))',
              }}>
              <polygon
                points="28,0 10,26 22,26 14,60 40,24 26,24 35,0"
                fill="url(#boltGradient2)"
              />
              <polygon
                points="28,0 10,26 22,26 14,60 40,24 26,24 35,0"
                fill="none"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="1"
              />
              <defs>
                <linearGradient id="boltGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="20%" stopColor="#FFFACD" />
                  <stop offset="50%" stopColor="#FFE566" />
                  <stop offset="80%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>
            </svg>

            {/* Ultra bright core */}
            <div
              className="absolute w-6 h-6 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, white 0%, rgba(255,255,200,0.9) 40%, transparent 80%)',
                boxShadow: '0 0 30px white, 0 0 60px #FFD700, 0 0 90px rgba(255,150,0,0.5)',
              }}
            />
          </div>

          {/* Trailing sparks - more dramatic */}
          {sparkOffsets.map((offset, i) => (
            <div
              key={i}
              className="absolute top-1/2 rounded-full"
              style={{
                width: sparkSizes[i],
                height: sparkSizes[i],
                left: '5px',
                transform: `translateY(${offset}px)`,
                background: i % 3 === 0 ? '#FFF' : i % 3 === 1 ? '#FFE566' : '#FFD700',
                boxShadow: `0 0 ${sparkSizes[i] * 2}px ${i % 3 === 0 ? '#FFF' : '#FFD700'}`,
                animation: `boltTravel ${travelDuration}ms cubic-bezier(0.1, 0, 0.2, 1) forwards`,
                animationDelay: `${i * 20}ms`,
                '--travel-end': `calc(${endPosition - 3 - i * 2}% - 20px)`,
              } as React.CSSProperties}
            />
          ))}
        </>
      )}

      {/* Burst phase - massive explosion */}
      {(phase === 'burst' || phase === 'afterglow') && (
        <div
          className="absolute"
          style={{
            left: `${endPosition}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Screen flash on impact */}
          {phase === 'burst' && (
            <div
              className="fixed inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                animation: 'impactFlash 150ms ease-out forwards',
              }}
            />
          )}

          {/* Massive central flash */}
          <div
            className="absolute rounded-full"
            style={{
              width: 120,
              height: 120,
              left: -60,
              top: -60,
              background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,240,150,0.9) 20%, rgba(255,200,50,0.6) 50%, transparent 80%)',
              animation: 'megaBurst 400ms ease-out forwards',
            }}
          />

          {/* Electric discharge rings */}
          {[0, 80, 160].map((delay, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 30,
                height: 30,
                left: -15,
                top: -15,
                border: `${4 - i}px solid`,
                borderColor: ['#FFF', '#FFE566', '#FFD700'][i],
                boxShadow: `0 0 ${10 - i * 2}px ${['#FFF', '#FFE566', '#FFD700'][i]}`,
                animation: `electricRing 400ms ease-out ${delay}ms forwards`,
              }}
            />
          ))}

          {/* Explosion particles - more and brighter */}
          {[...Array(24)].map((_, i) => {
            const angle = (i / 24) * 360;
            const rad = (angle * Math.PI) / 180;
            const distance = 50 + (i % 3) * 20;
            const x = Math.cos(rad) * distance;
            const y = Math.sin(rad) * distance;
            const size = 4 + (i % 4);
            const colors = ['#FFF', '#FFFACD', '#FFE566', '#FFD700', '#FFA500'];

            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  left: -size / 2,
                  top: -size / 2,
                  background: colors[i % colors.length],
                  boxShadow: `0 0 ${size * 3}px ${colors[i % colors.length]}`,
                }}
                ref={(el) => {
                  if (el) {
                    el.animate([
                      { transform: 'translate(0, 0) scale(1.5)', opacity: 1 },
                      { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
                    ], {
                      duration: 350 + (i % 3) * 100,
                      delay: i * 10,
                      easing: 'cubic-bezier(0, 0.6, 0.4, 1)',
                      fill: 'forwards'
                    });
                  }
                }}
              />
            );
          })}

          {/* Lightning mini-bolts shooting out - 8 directions */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <svg
              key={`bolt-${i}`}
              width="24"
              height="36"
              viewBox="0 0 24 36"
              className="absolute"
              style={{
                left: -12,
                top: -18,
                transform: `rotate(${angle}deg)`,
                transformOrigin: '12px 18px',
                filter: 'drop-shadow(0 0 6px #FFD700) drop-shadow(0 0 12px #FFA500)',
              }}
              ref={(el) => {
                if (el) {
                  el.animate([
                    { transform: `rotate(${angle}deg) translateY(0) scale(1)`, opacity: 1 },
                    { transform: `rotate(${angle}deg) translateY(-45px) scale(0.3)`, opacity: 0 }
                  ], {
                    duration: 300,
                    delay: i * 25,
                    easing: 'ease-out',
                    fill: 'forwards'
                  });
                }
              }}
            >
              <polygon
                points="14,0 8,14 12,14 10,36 16,12 12,12"
                fill="url(#miniBoltGradient)"
              />
              <defs>
                <linearGradient id="miniBoltGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFF" />
                  <stop offset="50%" stopColor="#FFE566" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
              </defs>
            </svg>
          ))}

          {/* Sparkle stars */}
          {[...Array(8)].map((_, i) => {
            const angle = i * 45 + 22.5;
            const rad = (angle * Math.PI) / 180;
            const distance = 60;
            return (
              <div
                key={`star-${i}`}
                className="absolute"
                style={{
                  fontSize: 16 + (i % 3) * 4,
                  left: 0,
                  top: 0,
                  color: '#FFE566',
                  textShadow: '0 0 10px #FFD700, 0 0 20px #FFA500',
                }}
                ref={(el) => {
                  if (el) {
                    el.animate([
                      { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 1 },
                      { transform: `translate(calc(-50% + ${Math.cos(rad) * distance}px), calc(-50% + ${Math.sin(rad) * distance}px)) scale(1.2) rotate(180deg)`, opacity: 1 },
                      { transform: `translate(calc(-50% + ${Math.cos(rad) * distance * 1.3}px), calc(-50% + ${Math.sin(rad) * distance * 1.3}px)) scale(0) rotate(360deg)`, opacity: 0 }
                    ], {
                      duration: 450,
                      delay: 50 + i * 30,
                      easing: 'ease-out',
                      fill: 'forwards'
                    });
                  }
                }}
              >
                ✦
              </div>
            );
          })}
        </div>
      )}

      {/* Afterglow on the progress bar */}
      {phase === 'afterglow' && (
        <div
          className="absolute top-1/2 h-6 rounded-full"
          style={{
            left: '5px',
            right: '5px',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,220,100,0.3) 30%, rgba(255,200,50,0.5) 50%, rgba(255,220,100,0.3) 70%, transparent 100%)',
            filter: 'blur(6px)',
            animation: 'afterglowFade 400ms ease-out forwards',
          }}
        />
      )}
    </div>
  );
}

// Old particle component (keeping for backwards compatibility)
function ComboParticle({
  index,
  total,
  color
}: {
  index: number;
  total: number;
  color: string;
}) {
  const angle = (index / total) * 360;
  const distance = 60 + Math.random() * 40;
  const size = 4 + Math.random() * 6;
  const duration = 0.6 + Math.random() * 0.3;

  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * distance;
  const y = Math.sin(rad) * distance;

  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
        boxShadow: `0 0 ${size}px ${color}`,
        animation: `particleBurst ${duration}s ease-out forwards`,
        '--tx': `${x}px`,
        '--ty': `${y}px`,
        transform: `translate(0, 0)`,
        animationName: 'none',
      } as React.CSSProperties}
      ref={(el) => {
        if (el) {
          el.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
          ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
            fill: 'forwards'
          });
        }
      }}
    />
  );
}

// Star burst component
function ComboBurst({ onComplete }: { onComplete: () => void }) {
  const colors = ['#FFD700', '#FF6B35', '#FF4500', '#FFA500', '#FFEC8B', '#FF8C00'];
  const particleCount = 16;

  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 50 }}>
      {/* Central flash */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(255,150,0,0.5) 30%, transparent 70%)',
          animation: 'comboFlash 0.6s ease-out forwards',
        }}
      />

      {/* Shockwave ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-yellow-400"
        style={{
          animation: 'shockwave 0.5s ease-out forwards',
        }}
      />

      {/* Particles */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <ComboParticle
          key={i}
          index={i}
          total={particleCount}
          color={colors[i % colors.length]}
        />
      ))}

      {/* Star shapes */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <div
          key={`star-${i}`}
          className="absolute left-1/2 top-1/2 text-yellow-400"
          style={{
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-30px)`,
            animation: `starPop 0.8s ease-out ${i * 0.05}s forwards`,
            fontSize: 12 + i * 2,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
}

interface ChessProgressBarProps {
  current: number; // e.g., 2
  total: number;   // e.g., 6
  streak?: number;
  hadWrongAnswer?: boolean;
  className?: string;
}

export function ChessProgressBar({
  current,
  total,
  streak = 0,
  hadWrongAnswer = false,
  className = '',
}: ChessProgressBarProps) {
  const progress = (current / total) * 100;
  const [showMagicStreak, setShowMagicStreak] = useState(false);
  const [showStreakLoss, setShowStreakLoss] = useState(false);
  const [lostStreakValue, setLostStreakValue] = useState(0);
  const prevStreakRef = useRef(streak);

  // Trigger magic streak celebration when streak hits 5
  // Trigger streak loss animation when streak drops to 0 from 2+
  useEffect(() => {
    const prevStreak = prevStreakRef.current;

    if (streak === 5 && prevStreak === 4 && !hadWrongAnswer) {
      setShowMagicStreak(true);
    }

    // Detect streak loss (went from 2+ to 0)
    if (streak === 0 && prevStreak >= 2) {
      setLostStreakValue(prevStreak);
      setShowStreakLoss(true);
      setTimeout(() => setShowStreakLoss(false), 800);
    }

    prevStreakRef.current = streak;
  }, [streak, hadWrongAnswer]);

  // Memoize the completion callback
  const handleMagicComplete = useCallback(() => {
    setShowMagicStreak(false);
  }, []);

  // Determine visual state based on streak
  const isStreaking = streak >= 2 && !hadWrongAnswer;
  const isOnFire = streak >= 4 && !hadWrongAnswer;

  // Generate segment markers
  const segmentMarkers = [];
  for (let i = 1; i < total; i++) {
    const position = (i / total) * 100;
    const isCompleted = i <= current;
    segmentMarkers.push(
      <div
        key={i}
        className="absolute top-0 bottom-0 w-[2px] z-10"
        style={{
          left: `${position}%`,
          background: isCompleted
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(0, 0, 0, 0.3)',
        }}
      />
    );
  }

  // Get lava fill gradient based on state
  const getFillStyle = (): React.CSSProperties => {
    if (isOnFire) {
      // Intense molten lava - slow surging
      return {
        backgroundImage: `linear-gradient(
          90deg,
          #FF4500 0%,
          #FF6B35 15%,
          #FFD93D 30%,
          #FF8C00 50%,
          #FF6B35 70%,
          #FF4500 85%,
          #FF6B35 100%
        )`,
        backgroundSize: '200% 100%',
        animation: 'lavaSurge 4s ease-in-out infinite',
      };
    }

    if (isStreaking) {
      // Warming up - yellow-green glow
      return {
        backgroundImage: `linear-gradient(
          90deg,
          #7CB518 0%,
          #9BD41A 20%,
          #C5E535 40%,
          #E2F050 50%,
          #C5E535 60%,
          #9BD41A 80%,
          #7CB518 100%
        )`,
        backgroundSize: '200% 100%',
        animation: 'lavaSurge 6s ease-in-out infinite',
      };
    }

    // Default: cool emerald
    return {
      backgroundImage: `linear-gradient(
        90deg,
        #2E7D0A 0%,
        #3D9E1E 30%,
        #58CC02 50%,
        #3D9E1E 70%,
        #2E7D0A 100%
      )`,
    };
  };

  return (
    <div className={`relative ${className}`} style={{ overflow: 'visible' }}>
      {/* Outer metal frame */}
      <div
        className="relative rounded-full p-[3px]"
        style={{
          background: `linear-gradient(
            180deg,
            #6B7280 0%,
            #9CA3AF 15%,
            #D1D5DB 30%,
            #9CA3AF 50%,
            #6B7280 70%,
            #4B5563 100%
          )`,
          boxShadow: `
            0 2px 4px rgba(0, 0, 0, 0.4),
            0 4px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.4)
          `,
        }}
      >
        {/* Inner metal ring */}
        <div
          className="relative rounded-full p-[2px]"
          style={{
            background: `linear-gradient(
              180deg,
              #374151 0%,
              #4B5563 30%,
              #6B7280 50%,
              #4B5563 70%,
              #1F2937 100%
            )`,
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Glass/viewport containment */}
          <div
            className="relative h-4 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #0A0E12 0%, #111820 50%, #0D1117 100%)',
              boxShadow: `
                inset 0 2px 6px rgba(0, 0, 0, 0.8),
                inset 0 -1px 2px rgba(255, 255, 255, 0.05)
              `,
            }}
          >
            {/* Segment markers - metal dividers */}
            {segmentMarkers}

            {/* Lava fill */}
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${Math.max(progress, 0)}%`,
                transition: 'width 500ms ease-out',
                ...getFillStyle(),
              }}
            >
              {/* Surface highlight - molten glow on top */}
              <div
                className="absolute inset-x-0 top-0 h-[45%] rounded-t-full"
                style={{
                  background: isOnFire
                    ? 'linear-gradient(180deg, rgba(255,255,200,0.5) 0%, rgba(255,200,100,0.2) 50%, transparent 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                }}
              />

              {/* Depth shadow at bottom */}
              <div
                className="absolute inset-x-0 bottom-0 h-[35%] rounded-b-full"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
                }}
              />

              {/* Lava bubbles when on fire */}
              {isOnFire && progress > 20 && (
                <>
                  <div
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      right: '15%',
                      top: '20%',
                      background: 'radial-gradient(circle, rgba(255,255,200,0.9) 0%, rgba(255,200,100,0.4) 50%, transparent 70%)',
                      animation: 'lavaBubble 3s ease-in-out infinite',
                    }}
                  />
                  <div
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      right: '35%',
                      top: '30%',
                      background: 'radial-gradient(circle, rgba(255,255,200,0.8) 0%, rgba(255,180,80,0.3) 50%, transparent 70%)',
                      animation: 'lavaBubble 4s ease-in-out infinite',
                      animationDelay: '1s',
                    }}
                  />
                  <div
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      right: '55%',
                      top: '25%',
                      background: 'radial-gradient(circle, rgba(255,255,180,0.7) 0%, transparent 70%)',
                      animation: 'lavaBubble 3.5s ease-in-out infinite',
                      animationDelay: '2s',
                    }}
                  />
                </>
              )}
            </div>

            {/* Glow at leading edge */}
            {isStreaking && progress > 5 && !showMagicStreak && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none"
                style={{
                  left: `calc(${progress}% - 8px)`,
                  background: isOnFire
                    ? 'radial-gradient(circle, rgba(255,200,100,0.8) 0%, rgba(255,100,0,0.3) 40%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(150,255,100,0.6) 0%, rgba(88,204,2,0.2) 50%, transparent 70%)',
                  animation: 'lavaGlow 3s ease-in-out infinite',
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Rivets on the frame */}
      <div
        className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #9CA3AF 0%, #4B5563 50%, #374151 100%)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.3)',
        }}
      />
      <div
        className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #9CA3AF 0%, #4B5563 50%, #374151 100%)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.3)',
        }}
      />

      {/* Ambient glow underneath when hot */}
      {isOnFire && (
        <div
          className="absolute -bottom-2 left-4 right-4 h-3 rounded-full blur-md pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,100,0,0.4) 0%, rgba(255,50,0,0.2) 50%, transparent 80%)',
            animation: 'lavaGlow 4s ease-in-out infinite',
          }}
        />
      )}

      {/* Lightning streak celebration - renders OUTSIDE the bar */}
      {showMagicStreak && (
        <MagicStreakCelebration
          endPosition={progress}
          onComplete={handleMagicComplete}
        />
      )}

      {/* Streak loss animation */}
      {showStreakLoss && (
        <>
          {/* Red flash overlay on the bar */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none z-20"
            style={{
              animation: 'streakLossFlash 0.4s ease-out',
            }}
          />
          {/* Falling streak number */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FF4B4B] font-bold text-lg pointer-events-none z-30"
            style={{
              animation: 'streakLossFall 0.8s ease-out forwards',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            -{lostStreakValue}
          </div>
        </>
      )}
    </div>
  );
}
