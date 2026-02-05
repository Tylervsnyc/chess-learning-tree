'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

// Block data: position and color
const BLOCKS = [
  // Row 0: Crown points
  { x: 8, y: 8, color: '#1CB0F6' },
  { x: 44, y: 8, color: '#2FCBEF' },
  { x: 80, y: 8, color: '#A560E8' },
  // Row 1: Crown rim
  { x: 8, y: 26, color: '#58CC02' },
  { x: 26, y: 26, color: '#FFC800' },
  { x: 44, y: 26, color: '#FF9600' },
  { x: 62, y: 26, color: '#FF6B6B' },
  { x: 80, y: 26, color: '#FF4B4B' },
  // Row 2: Head
  { x: 26, y: 44, color: '#1CB0F6' },
  { x: 44, y: 44, color: '#2FCBEF' },
  { x: 62, y: 44, color: '#A560E8' },
  // Row 3: Neck
  { x: 26, y: 62, color: '#58CC02' },
  { x: 44, y: 62, color: '#FFC800' },
  { x: 62, y: 62, color: '#FF9600' },
  // Row 4: Body
  { x: 26, y: 80, color: '#FF6B6B' },
  { x: 44, y: 80, color: '#FF4B4B' },
  { x: 62, y: 80, color: '#1CB0F6' },
  // Row 5: Base
  { x: 8, y: 98, color: '#2FCBEF' },
  { x: 26, y: 98, color: '#A560E8' },
  { x: 44, y: 98, color: '#58CC02' },
  { x: 62, y: 98, color: '#FFC800' },
  { x: 80, y: 98, color: '#FF9600' },
];

// Animation configuration
const CONFIG = {
  centerX: 51,
  centerY: 60,
  maxDelay: 400,
  duration: 400,
  wordmarkDelay: 550,
  easing: 'ease-out',
  initialScale: 0.95,
  initialOpacity: 0,
};

const SIZE_MAP = {
  sm: 0.5,
  md: 1,
  lg: 1.5,
};

interface AnimatedLogoProps {
  theme?: 'dark' | 'light';
  autoPlay?: boolean;
  onAnimationComplete?: () => void;
  showWordmark?: boolean;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | number;
}

export function AnimatedLogo({
  theme = 'dark',
  autoPlay = true,
  onAnimationComplete,
  showWordmark = true,
  iconOnly = false,
  size = 'md',
}: AnimatedLogoProps) {
  const [animationState, setAnimationState] = useState<'pending' | 'animating' | 'complete'>(
    autoPlay ? 'pending' : 'complete'
  );
  const [wordmarkVisible, setWordmarkVisible] = useState(!autoPlay);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const scale = typeof size === 'number' ? size : SIZE_MAP[size] || 1;
  const blockSize = 14 * scale;
  const containerWidth = iconOnly ? 94 * scale : 520 * scale;
  const containerHeight = 120 * scale;

  const getDistance = (block: { x: number; y: number }) => {
    const x = block.x + 7;
    const y = block.y + 7;
    return Math.sqrt(
      Math.pow(x - CONFIG.centerX, 2) + Math.pow(y - CONFIG.centerY, 2)
    );
  };

  const maxDistance = Math.max(...BLOCKS.map((b) => getDistance(b)));

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const play = useCallback(() => {
    clearTimeouts();
    setAnimationState('animating');
    setWordmarkVisible(false);

    const wordmarkTimeout = setTimeout(() => {
      setWordmarkVisible(true);
    }, CONFIG.wordmarkDelay);
    timeoutsRef.current.push(wordmarkTimeout);

    const completeTimeout = setTimeout(() => {
      setAnimationState('complete');
      onAnimationComplete?.();
    }, CONFIG.wordmarkDelay + 300);
    timeoutsRef.current.push(completeTimeout);
  }, [onAnimationComplete]);

  const reset = useCallback(() => {
    clearTimeouts();
    setAnimationState('pending');
    setWordmarkVisible(false);
  }, []);

  useEffect(() => {
    if (autoPlay) {
      const startTimeout = setTimeout(play, 100);
      return () => {
        clearTimeout(startTimeout);
        clearTimeouts();
      };
    }
  }, [autoPlay, play]);

  const textColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';

  return (
    <div
      style={{
        position: 'relative',
        width: containerWidth,
        height: containerHeight,
        fontFamily: "var(--font-body), 'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Blocks */}
      {BLOCKS.map((block, index) => {
        const distance = getDistance(block);
        const delay = (distance / maxDistance) * CONFIG.maxDelay;
        const isVisible = animationState !== 'pending';

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: block.x * scale,
              top: block.y * scale,
              width: blockSize,
              height: blockSize,
              borderRadius: 2 * scale,
              backgroundColor: block.color,
              boxShadow: `0 ${4 * scale}px ${12 * scale}px ${block.color}40`,
              opacity: isVisible ? 1 : CONFIG.initialOpacity,
              transform: isVisible ? 'scale(1)' : `scale(${CONFIG.initialScale})`,
              transition:
                animationState === 'animating'
                  ? `all ${CONFIG.duration}ms ${CONFIG.easing} ${delay}ms`
                  : 'none',
            }}
          />
        );
      })}

      {/* Wordmark */}
      {showWordmark && !iconOnly && (
        <div
          style={{
            position: 'absolute',
            left: 120 * scale,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 72 * scale,
            fontWeight: 700,
            opacity: wordmarkVisible ? 1 : 0,
            transition: 'opacity 0.4s ease-out',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: textColor }}>chess</span>
          <span
            style={{
              background:
                'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            path
          </span>
        </div>
      )}
    </div>
  );
}

// Export for manual control
export { BLOCKS, CONFIG as ANIMATION_CONFIG };
