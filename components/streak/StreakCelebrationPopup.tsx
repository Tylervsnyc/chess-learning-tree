'use client';

import { useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface StreakCelebrationPopupProps {
  isOpen: boolean;
  previousStreak: number;
  newStreak: number;
  onClose: () => void;
}

// Milestone configurations
const MILESTONES: Record<number, { icon: string; message: string; confettiType: 'orange' | 'gold' | 'emoji' }> = {
  7: { icon: '🔥', message: 'One week strong!', confettiType: 'orange' },
  30: { icon: '👑', message: 'A whole month! Legendary.', confettiType: 'gold' },
  100: { icon: '🏆', message: "100 DAYS. You're unstoppable.", confettiType: 'emoji' },
};

// Orange side cannons (default celebration)
function fireOrangeCannons() {
  const end = Date.now() + 1500;
  const colors = ['#FF6B00', '#FF9500', '#FFB800', '#FFFFFF'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
      zIndex: 10001,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
      zIndex: 10001,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// Gold realistic burst (30-day milestone)
function fireGoldBurst() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 10001,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#FFD700', '#FFC800'],
  });

  fire(0.2, {
    spread: 60,
    colors: ['#FFA500', '#FF8C00'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#FFE4B5', '#FFECD2'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#FFFFFF', '#FFF8DC'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#FFD700', '#FFA500'],
  });
}

// Emoji celebration (100-day milestone)
function fireEmojiCelebration() {
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
    zIndex: 10001,
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
}

export function StreakCelebrationPopup({
  isOpen,
  previousStreak,
  newStreak,
  onClose,
}: StreakCelebrationPopupProps) {
  const [displayNumber, setDisplayNumber] = useState(previousStreak);
  const [showContent, setShowContent] = useState(false);

  // Check for milestone
  const milestone = MILESTONES[newStreak];
  const icon = milestone?.icon || '🔥';
  const message = milestone?.message || `${newStreak} day streak!`;

  // Fire confetti based on milestone
  const fireCelebration = useCallback(() => {
    if (milestone?.confettiType === 'gold') {
      fireGoldBurst();
    } else if (milestone?.confettiType === 'emoji') {
      fireEmojiCelebration();
    } else {
      fireOrangeCannons();
    }
  }, [milestone?.confettiType]);

  // Animation sequence when popup opens
  useEffect(() => {
    if (!isOpen) {
      setShowContent(false);
      setDisplayNumber(previousStreak);
      return;
    }

    // Step 1: Show content with animation
    const showTimer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    // Step 2: Count up the number
    const countTimer = setTimeout(() => {
      const duration = 500;
      const startTime = Date.now();
      const startValue = previousStreak;
      const endValue = newStreak;

      function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startValue + (endValue - startValue) * eased);
        setDisplayNumber(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }
      animate();
    }, 400);

    // Step 3: Fire confetti
    const confettiTimer = setTimeout(() => {
      fireCelebration();
    }, 600);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(countTimer);
      clearTimeout(confettiTimer);
    };
  }, [isOpen, previousStreak, newStreak, fireCelebration]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 transition-opacity duration-200"
        style={{ opacity: showContent ? 1 : 0 }}
      />

      {/* Card */}
      <div
        className="relative bg-[#1A2C35] rounded-2xl p-8 max-w-sm w-full text-center transition-all duration-300"
        style={{
          transform: showContent ? 'scale(1)' : 'scale(0.8)',
          opacity: showContent ? 1 : 0,
          boxShadow: '0 0 40px rgba(255, 107, 0, 0.3), 0 0 80px rgba(255, 149, 0, 0.15)',
          border: '2px solid rgba(255, 107, 0, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon with bounce animation */}
        <div
          className="text-7xl mb-4 transition-all duration-300"
          style={{
            transform: showContent ? 'scale(1)' : 'scale(0)',
            animationName: showContent ? 'bounce-in' : 'none',
            animationDuration: '0.5s',
            animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          {icon}
        </div>

        {/* Streak number */}
        <div
          className="text-6xl font-black mb-2"
          style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FF9500 50%, #FFB800 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {displayNumber}
        </div>

        {/* Message */}
        <div className="text-xl font-bold text-white mb-2">
          {milestone ? message : 'DAY STREAK!'}
        </div>

        {!milestone && (
          <p className="text-gray-400 text-sm mb-6">
            You&apos;re on fire! Keep it going tomorrow.
          </p>
        )}
        {milestone && <div className="mb-6" />}

        {/* Continue button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-white font-bold text-lg transition-transform active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FF9500 100%)',
          }}
        >
          Continue
        </button>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
