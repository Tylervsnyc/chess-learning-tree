'use client';

import { useRouter } from 'next/navigation';
import { LEVEL_TEST_CONFIG } from '@/data/level-unlock-tests';

interface NextLevelCardProps {
  currentLevel: number;
  nextLevelName: string;
  nextLevelKey: string;
  isUnlocked: boolean;
}

export default function NextLevelCard({
  currentLevel,
  nextLevelName,
  nextLevelKey,
  isUnlocked,
}: NextLevelCardProps) {
  const router = useRouter();
  const transition = `${currentLevel}-${currentLevel + 1}`;

  const handleClick = () => {
    if (isUnlocked) {
      // Go directly to the next level
      router.push(`/learn?level=${nextLevelKey}`);
    } else {
      // Go to the test
      router.push(`/level-test/${transition}`);
    }
  };

  return (
    <div className="mt-8 mb-4 px-4">
      <div
        className={`
          relative overflow-hidden rounded-2xl p-6 cursor-pointer
          transition-all duration-200 hover:scale-[1.02]
          ${isUnlocked
            ? 'bg-gradient-to-br from-[#58CC02] to-[#3d8a01] shadow-lg'
            : 'bg-gradient-to-br from-[#1A2C35] to-[#0D1A1F] border border-white/10'
          }
        `}
        onClick={handleClick}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          {/* Level badge */}
          <div className={`
            inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3
            ${isUnlocked
              ? 'bg-white/20 text-white'
              : 'bg-white/10 text-white/60'
            }
          `}>
            {isUnlocked ? (
              <>
                <span>✓</span>
                <span>Unlocked</span>
              </>
            ) : (
              <>
                <span>🔒</span>
                <span>Locked</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-2xl font-black mb-2 ${isUnlocked ? 'text-white' : 'text-white'}`}>
            {nextLevelName}
          </h3>

          {/* Description */}
          {isUnlocked ? (
            <p className="text-white/80 mb-4">
              You've unlocked this level! Tap to start learning.
            </p>
          ) : (
            <p className="text-white/60 mb-4">
              Prove you're ready with a {LEVEL_TEST_CONFIG.puzzleCount}-puzzle test.
              <br />
              Get {LEVEL_TEST_CONFIG.passingScore}+ correct to unlock.
            </p>
          )}

          {/* Button */}
          <button
            className={`
              w-full py-3 rounded-xl font-bold text-lg transition-all
              ${isUnlocked
                ? 'bg-white text-[#58CC02] hover:bg-white/90 shadow-[0_4px_0_rgba(0,0,0,0.2)]'
                : 'bg-[#58CC02] text-white hover:bg-[#4CAF00] shadow-[0_4px_0_#3d8a01]'
              }
              active:translate-y-[2px] active:shadow-[0_2px_0_#3d8a01]
            `}
          >
            {isUnlocked ? 'Continue to Level' : 'Take Unlock Test'}
          </button>
        </div>
      </div>
    </div>
  );
}
