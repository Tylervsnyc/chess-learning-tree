'use client';

import { useParams, useRouter } from 'next/navigation';
import LevelSkipQuiz from '@/components/quiz/LevelSkipQuiz';
import { useUser } from '@/hooks/useUser';
import { usePermissions } from '@/hooks/usePermissions';

export default function SkipQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { canSkipLevels, loading: permissionsLoading } = usePermissions();

  const level = parseInt(params.level as string);
  const isLoading = userLoading || permissionsLoading;

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#58CC02] border-t-transparent rounded-full" />
      </div>
    );
  }

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

  // Check if user is logged in first
  if (!user) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Sign In Required</h1>
          <p className="text-white/60 mb-4">
            Please sign in to take the level skip quiz.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-2 bg-[#1CB0F6] text-white rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-6 py-2 bg-[#58CC02] text-white rounded-lg"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check permissions (user is logged in but might not have skip access)
  if (!canSkipLevels) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Required</h1>
          <p className="text-white/60 mb-4">
            Upgrade to premium to skip levels.
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="px-6 py-2 bg-[#58CC02] text-white rounded-lg"
          >
            View Pricing
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
