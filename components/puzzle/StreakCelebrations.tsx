'use client';

import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

// Utility for random range
function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// ============================================
// OPTION 1: FIREWORKS SPECTACULAR
// Multiple random bursts like real fireworks
// ============================================
export function useFireworksCelebration() {
  return useCallback(() => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);

      // Random positions for firework effect
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF6B35', '#FFFFFF'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF6B35', '#FFFFFF'],
      });
    }, 250);

    // Cleanup after duration
    setTimeout(() => clearInterval(interval), duration + 100);
  }, []);
}

// ============================================
// OPTION 2: REALISTIC BURST
// Duolingo-style layered explosion
// ============================================
export function useRealisticCelebration() {
  return useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1000,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // Layer 1: Tight burst with high velocity
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#FFD700', '#FFC800'],
    });

    // Layer 2: Medium spread
    fire(0.2, {
      spread: 60,
      colors: ['#FFA500', '#FF8C00'],
    });

    // Layer 3: Wide spread, slower decay
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#FF6B35', '#FF4500'],
    });

    // Layer 4: Very wide, small particles
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#FFFFFF', '#FFF8DC'],
    });

    // Layer 5: Fast outer ring
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#FFE4B5', '#FFECD2'],
    });
  }, []);
}

// ============================================
// OPTION 3: GOLDEN STARS
// Star-shaped confetti with gold palette
// ============================================
export function useStarsCelebration() {
  return useCallback(() => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 20,
      zIndex: 1000,
      colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star'],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle'],
      });
    }

    // Multiple bursts
    shoot();
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  }, []);
}

// ============================================
// OPTION 4: SIDE CANNONS
// School pride style - cannons from both sides
// ============================================
export function useSideCannonsCelebration() {
  return useCallback(() => {
    const end = Date.now() + 1500;
    const colors = ['#58CC02', '#7FE030', '#FFD700', '#FFFFFF'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
        zIndex: 1000,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
        zIndex: 1000,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);
}

// ============================================
// OPTION 5: EMOJI EXPLOSION
// Chess-themed emoji celebration
// ============================================
export function useEmojiCelebration() {
  return useCallback(() => {
    const scalar = 2;
    const crown = confetti.shapeFromText({ text: '👑', scalar });
    const star = confetti.shapeFromText({ text: '⭐', scalar });
    const fire = confetti.shapeFromText({ text: '🔥', scalar });
    const sparkle = confetti.shapeFromText({ text: '✨', scalar });
    const trophy = confetti.shapeFromText({ text: '🏆', scalar });

    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.4,
      decay: 0.96,
      startVelocity: 20,
      zIndex: 1000,
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 10,
        scalar: scalar * 0.8,
        shapes: [crown, star, fire, sparkle, trophy],
      });
    }

    shoot();
    setTimeout(shoot, 150);
    setTimeout(shoot, 300);
  }, []);
}

// ============================================
// COMBINED: All celebration options
// ============================================
export type CelebrationType = 'fireworks' | 'realistic' | 'stars' | 'sideCannons' | 'emoji';

export function useCelebration(type: CelebrationType) {
  const fireworks = useFireworksCelebration();
  const realistic = useRealisticCelebration();
  const stars = useStarsCelebration();
  const sideCannons = useSideCannonsCelebration();
  const emoji = useEmojiCelebration();

  return useCallback(() => {
    switch (type) {
      case 'fireworks':
        return fireworks();
      case 'realistic':
        return realistic();
      case 'stars':
        return stars();
      case 'sideCannons':
        return sideCannons();
      case 'emoji':
        return emoji();
    }
  }, [type, fireworks, realistic, stars, sideCannons, emoji]);
}

// ============================================
// COMPONENT: Trigger celebration on mount
// ============================================
interface CelebrationProps {
  type: CelebrationType;
  onComplete?: () => void;
}

export function Celebration({ type, onComplete }: CelebrationProps) {
  const celebrate = useCelebration(type);

  useEffect(() => {
    celebrate();

    // Call onComplete after animation
    const timer = setTimeout(() => {
      onComplete?.();
    }, type === 'fireworks' ? 2200 : 1000);

    return () => clearTimeout(timer);
  }, [celebrate, type, onComplete]);

  return null;
}
