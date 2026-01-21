'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding, SelectedLevel } from '@/hooks/useOnboarding';
import { LevelCard, LEVEL_CONFIGS } from '@/components/onboarding/LevelCard';

export default function SelectLevelPage() {
  const router = useRouter();
  const { selectLevel } = useOnboarding();
  const [selected, setSelected] = useState<SelectedLevel>(null);

  const handleContinue = () => {
    if (!selected) return;

    selectLevel(selected);

    // Beginner skips placement, goes directly to complete
    if (selected === 'beginner') {
      router.push('/onboarding/complete?elo=600&level=beginner');
    } else {
      // Intermediate and Advanced go to placement test
      router.push('/onboarding/placement');
    }
  };

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center">
          <button
            onClick={() => router.push('/onboarding')}
            className="text-gray-400 hover:text-white mr-4"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-white font-semibold">Select Your Level</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          {/* Instructions */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white mb-2">
              What best describes your chess experience?
            </h2>
            <p className="text-gray-400 text-sm">
              Don&apos;t worry, you can always adjust this later
            </p>
          </div>

          {/* Level cards */}
          <div className="space-y-3 mb-8">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <LevelCard
                key={level}
                level={level}
                {...LEVEL_CONFIGS[level]}
                selected={selected === level}
                onClick={() => setSelected(level)}
              />
            ))}
          </div>

          {/* Placement note */}
          {selected && selected !== 'beginner' && (
            <div className="mb-6 p-3 rounded-lg bg-[#1A2C35] border border-white/10">
              <p className="text-gray-400 text-sm text-center">
                Take a short diagnostic to find your level
              </p>
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-all
              ${selected
                ? 'bg-[#58CC02] text-white shadow-[0_4px_0_#3d8c01] hover:shadow-[0_2px_0_#3d8c01] hover:translate-y-[2px]'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
