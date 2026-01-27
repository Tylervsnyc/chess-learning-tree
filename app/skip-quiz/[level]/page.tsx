'use client';

import { useParams, useRouter } from 'next/navigation';
import LevelSkipQuiz from '@/components/quiz/LevelSkipQuiz';
import { usePermissions } from '@/hooks/usePermissions';

export default function SkipQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { canSkipLevels, tier } = usePermissions();

  const level = parseInt(params.level as string);

  // Validate level
  if (level !== 2 && level !== 3) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Level</h1>
          <p className="text-white/60 mb-4">You can only skip to Level 2 or Level 3.</p>
          <button
            onClick={() => router.push('/learn')}
            className="px-6 py-2 bg-[#1CB0F6] text-white rounded-lg"
          >
            Back to Learn
          </button>
        </div>
      </div>
    );
  }

  // Check permissions
  if (!canSkipLevels) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Sign Up Required</h1>
          <p className="text-white/60 mb-4">
            Create a free account to take the level skip quiz.
          </p>
          <button
            onClick={() => router.push('/auth/signup')}
            className="px-6 py-2 bg-[#58CC02] text-white rounded-lg"
          >
            Sign Up Free
          </button>
        </div>
      </div>
    );
  }

  const handlePass = () => {
    // TODO: Save that user passed this level's quiz
    // For now, redirect to the learn page
    router.push(`/learn?level=${level}`);
  };

  const handleFail = () => {
    router.push('/learn');
  };

  const handleCancel = () => {
    router.push('/learn');
  };

  return (
    <LevelSkipQuiz
      targetLevel={level as 2 | 3}
      onPass={handlePass}
      onFail={handleFail}
      onCancel={handleCancel}
    />
  );
}
