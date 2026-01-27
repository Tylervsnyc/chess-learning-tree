'use client';

import { useRouter } from 'next/navigation';
import { LEVEL_TEST_CONFIG } from '@/data/level-unlock-tests';

interface UnlockTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLevel: number;
  targetLevelName: string;
  fromLevel: number;
}

export default function UnlockTestModal({
  isOpen,
  onClose,
  targetLevel,
  targetLevelName,
  fromLevel,
}: UnlockTestModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const transition = `${fromLevel}-${targetLevel}`;

  const handleStartTest = () => {
    onClose();
    router.push(`/level-test/${transition}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[#1A2C35] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white text-xl"
        >
          ✕
        </button>

        {/* Lock icon */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0D1A1F] rounded-full border border-white/10">
            <span className="text-3xl">🔒</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white text-center mb-2">
          Unlock {targetLevelName}
        </h2>

        {/* Description */}
        <p className="text-white/60 text-center mb-6">
          Ready to move on? Take a quick test to prove you've mastered the basics.
        </p>

        {/* Test info */}
        <div className="bg-[#0D1A1F] rounded-xl p-4 mb-6 border border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#58CC02]">
                {LEVEL_TEST_CONFIG.puzzleCount}
              </div>
              <div className="text-xs text-white/40">Puzzles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#58CC02]">
                {LEVEL_TEST_CONFIG.passingScore}+
              </div>
              <div className="text-xs text-white/40">To Pass</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#FF4B4B]">
                {LEVEL_TEST_CONFIG.maxWrongAnswers + 1}
              </div>
              <div className="text-xs text-white/40">Max Wrong</div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleStartTest}
            className="w-full py-3 bg-[#58CC02] text-white font-bold rounded-xl hover:bg-[#4CAF00] transition-colors shadow-[0_4px_0_#3d8a01] active:translate-y-[2px] active:shadow-[0_2px_0_#3d8a01]"
          >
            Start Test
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-transparent text-white/60 font-medium rounded-xl hover:text-white hover:bg-white/5 transition-colors"
          >
            Not Yet
          </button>
        </div>
      </div>
    </div>
  );
}
