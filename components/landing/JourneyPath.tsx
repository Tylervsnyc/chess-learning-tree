'use client';

import { useState, useEffect, useRef } from 'react';

interface Milestone {
  piece: string;
  elo: number;
  label: string;
  y: number;
  x: number;
}

interface JourneyPathProps {
  currentElo?: number;
  animated?: boolean;
  autoAnimate?: boolean;
  onCtaHover?: boolean;
}

// Standard chess rating labels for 400-1200 range
const milestones: Milestone[] = [
  { piece: '\u2659', elo: 400, label: 'Novice', y: 440, x: 70 },
  { piece: '\u2658', elo: 700, label: 'Beginner', y: 360, x: 130 },
  { piece: '\u2657', elo: 900, label: 'Casual', y: 280, x: 70 },
  { piece: '\u2656', elo: 1000, label: 'Club', y: 200, x: 130 },
  { piece: '\u2655', elo: 1100, label: 'Skilled', y: 120, x: 70 },
  { piece: '\u2654', elo: 1200, label: 'Tournament', y: 50, x: 130 },
];

// Get color for a given ELO position
function getGradientColor(elo: number): string {
  const normalizedElo = (elo - 400) / 800;
  if (normalizedElo < 0.5) {
    return `rgb(${Math.round(34 + (6 - 34) * normalizedElo * 2)}, ${Math.round(197 + (182 - 197) * normalizedElo * 2)}, ${Math.round(94 + (212 - 94) * normalizedElo * 2)})`;
  } else {
    const t = (normalizedElo - 0.5) * 2;
    return `rgb(${Math.round(6 + (245 - 6) * t)}, ${Math.round(182 + (158 - 182) * t)}, ${Math.round(212 + (11 - 212) * t)})`;
  }
}

function getProgressInfo(elo: number): { completedMilestones: number; progressWithinSegment: number } {
  if (elo <= 400) return { completedMilestones: 0, progressWithinSegment: 0 };
  for (let i = 0; i < milestones.length - 1; i++) {
    if (elo < milestones[i + 1].elo) {
      const segmentStart = milestones[i].elo;
      const segmentEnd = milestones[i + 1].elo;
      const progress = (elo - segmentStart) / (segmentEnd - segmentStart);
      return { completedMilestones: i, progressWithinSegment: progress };
    }
  }
  return { completedMilestones: milestones.length - 1, progressWithinSegment: 1 };
}

export default function JourneyPath({
  currentElo = 0,
  animated = true,
  autoAnimate = false,
  onCtaHover = false
}: JourneyPathProps) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const [autoAnimateElo, setAutoAnimateElo] = useState(400);
  const animationFrameRef = useRef<number | null>(null);
  const autoAnimateRef = useRef<number | null>(null);

  const displayElo = autoAnimate ? autoAnimateElo : currentElo;
  const isNewUser = displayElo === 0 || displayElo < 400;
  const { completedMilestones, progressWithinSegment } = getProgressInfo(displayElo);

  // Winding path - more compact for mobile
  const pathD = `
    M 70 460
    C 70 420, 130 400, 130 370
    C 130 340, 70 320, 70 290
    C 70 260, 130 240, 130 210
    C 130 180, 70 160, 70 130
    C 70 100, 130 80, 130 50
  `;

  const totalSegments = milestones.length - 1;
  const currentSegment = completedMilestones + progressWithinSegment;
  const targetProgress = isNewUser ? 0 : currentSegment / totalSegments;

  // Auto-animate from bottom to top
  useEffect(() => {
    if (!autoAnimate) return;

    const duration = 4000; // 4 seconds to go from 400 to 1200
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const loopTime = elapsed % (duration + 1000); // Add 1s pause at top

      if (loopTime < duration) {
        const t = loopTime / duration;
        const eased = t < 0.5
          ? 2 * t * t
          : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease-in-out
        const elo = 400 + eased * 800;
        setAutoAnimateElo(Math.round(elo));
      } else {
        setAutoAnimateElo(1200);
      }

      autoAnimateRef.current = requestAnimationFrame(animate);
    };

    autoAnimateRef.current = requestAnimationFrame(animate);

    return () => {
      if (autoAnimateRef.current) {
        cancelAnimationFrame(autoAnimateRef.current);
      }
    };
  }, [autoAnimate]);

  // Progress animation
  useEffect(() => {
    if (!animated && !autoAnimate) {
      setAnimationProgress(targetProgress);
      return;
    }

    if (autoAnimate) {
      setAnimationProgress(targetProgress);
      return;
    }

    const startTime = performance.now();
    const duration = 1500;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimationProgress(targetProgress * eased);
      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animated, autoAnimate, targetProgress]);

  // Particles
  useEffect(() => {
    if (isNewUser) return;
    const currentMilestone = milestones[Math.min(completedMilestones, milestones.length - 1)];
    const newParticles = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: currentMilestone.x + (Math.random() - 0.5) * 20,
      y: currentMilestone.y,
      delay: i * 0.3,
    }));
    setParticles(newParticles);
  }, [completedMilestones, isNewUser]);

  const getMilestoneOpacity = (index: number): number => {
    if (isNewUser) return 0.25;
    if (index <= completedMilestones) return 1;
    if (index === completedMilestones + 1 && progressWithinSegment > 0) return 0.4 + progressWithinSegment * 0.6;
    return 0.25;
  };

  const isMilestoneCurrent = (index: number): boolean => {
    return !isNewUser && index === completedMilestones;
  };

  return (
    <div className="journey-path-container relative w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px]">
      <svg
        viewBox="0 0 200 500"
        className="w-full h-auto"
        style={{ filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.15))' }}
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="currentGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background path */}
        <path
          d={pathD}
          fill="none"
          stroke="#1A2C35"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={isNewUser && !onCtaHover ? "6 10" : "none"}
        />

        {/* Lit path */}
        {(animationProgress > 0 || targetProgress > 0 || onCtaHover) && (
          <path
            d={pathD}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glowFilter)"
            style={{
              strokeDasharray: 800,
              strokeDashoffset: 800 - (onCtaHover && isNewUser ? 80 : (autoAnimate ? targetProgress : animationProgress) * 800),
              transition: onCtaHover && !autoAnimate ? 'stroke-dashoffset 0.3s ease' : 'none',
            }}
          />
        )}

        {/* Milestones */}
        {milestones.map((milestone, index) => {
          const opacity = getMilestoneOpacity(index);
          const isCurrent = isMilestoneCurrent(index);
          const isReached = index <= completedMilestones && !isNewUser;
          const color = isReached ? getGradientColor(milestone.elo) : '#1A2C35';

          return (
            <g
              key={milestone.elo}
              onMouseEnter={() => setHoveredMilestone(index)}
              onMouseLeave={() => setHoveredMilestone(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={milestone.x}
                cy={milestone.y}
                r={isCurrent ? 22 : 18}
                fill="#0A1014"
                stroke={isReached ? color : '#1A2C35'}
                strokeWidth={isCurrent ? 2.5 : 2}
                opacity={opacity}
                filter={isCurrent ? 'url(#currentGlow)' : 'none'}
                className={isCurrent ? 'pulse-glow' : ''}
              />

              <text
                x={milestone.x}
                y={milestone.y + 6}
                textAnchor="middle"
                fontSize={isCurrent ? 24 : 20}
                fill={isReached ? color : '#3A4C55'}
                opacity={opacity}
                style={{ fontFamily: 'serif' }}
              >
                {milestone.piece}
              </text>

              {/* Label - positioned on opposite side of path */}
              <text
                x={milestone.x + (milestone.x < 100 ? -32 : 32)}
                y={milestone.y + 4}
                textAnchor={milestone.x < 100 ? 'end' : 'start'}
                fontSize={10}
                fill={isReached ? '#F1F5F9' : '#4A5C65'}
                opacity={opacity * 0.9}
                fontWeight={isCurrent ? 600 : 400}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {milestone.label}
              </text>

              <text
                x={milestone.x + (milestone.x < 100 ? -32 : 32)}
                y={milestone.y + 16}
                textAnchor={milestone.x < 100 ? 'end' : 'start'}
                fontSize={8}
                fill={isReached ? '#94A3B8' : '#3A4C55'}
                opacity={opacity * 0.7}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {milestone.elo}+
              </text>
            </g>
          );
        })}

        {/* Particles */}
        {!isNewUser && particles.map((particle) => (
          <circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={2}
            fill={getGradientColor(displayElo)}
            className="particle"
            style={{ animationDelay: `${particle.delay}s`, opacity: 0.8 }}
          />
        ))}

        {/* New user glow */}
        {isNewUser && (
          <circle
            cx={milestones[0].x}
            cy={milestones[0].y}
            r={28}
            fill="none"
            stroke="#22C55E"
            strokeWidth="1.5"
            opacity="0.4"
            className="pulse-glow"
          />
        )}
      </svg>

      {/* Tooltip */}
      {hoveredMilestone !== null && (
        <div
          className="milestone-tooltip visible"
          style={{
            left: milestones[hoveredMilestone].x > 100 ? '75%' : '5%',
            top: `${(milestones[hoveredMilestone].y / 500) * 100}%`,
          }}
        >
          <div className="font-semibold text-xs">{milestones[hoveredMilestone].label}</div>
          <div className="text-[10px] text-[#94A3B8]">
            {hoveredMilestone === milestones.length - 1
              ? `${milestones[hoveredMilestone].elo}+ ELO`
              : `${milestones[hoveredMilestone].elo}-${milestones[hoveredMilestone + 1].elo - 1}`}
          </div>
        </div>
      )}
    </div>
  );
}
