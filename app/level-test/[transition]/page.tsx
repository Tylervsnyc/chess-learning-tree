'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LevelUnlockTest from '@/components/quiz/LevelUnlockTest';
import { getLevelTestConfig } from '@/data/level-unlock-tests';

export default function LevelTestPage() {
  const params = useParams();
  const router = useRouter();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const transition = params.transition as string;

  useEffect(() => {
    // Validate the transition parameter
    const config = getLevelTestConfig(transition);
    if (!config) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [transition]);

  // Loading state while validating
  if (isValid === null) {
    return (
      <div className="h-screen bg-[#131F24] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Invalid transition
  if (!isValid) {
    return (
      <div className="h-screen bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Test</h1>
          <p className="text-white/60 mb-6">
            The test "{transition}" doesn't exist.
          </p>
          <button
            onClick={() => router.push('/learn')}
            className="px-6 py-2 bg-[#1CB0F6] text-white font-bold rounded-xl hover:bg-[#1A9FE0] transition-colors"
          >
            Back to Learn
          </button>
        </div>
      </div>
    );
  }

  return <LevelUnlockTest transition={transition} />;
}
