'use client';

import { useParams, useRouter } from 'next/navigation';
import LevelSkipQuiz from '@/components/quiz/LevelSkipQuiz';
import { useUser } from '@/hooks/useUser';
import { usePermissions } from '@/hooks/usePermissions';
import { CreateProfileModal } from '@/components/subscription/CreateProfileModal';

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
      <div className="min-h-full bg-chess-page flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-chess-green border-t-transparent rounded-full" />
      </div>
    );
  }

  // Validate level
  if (level !== 2 && level !== 3) {
    return (
      <div className="min-h-full bg-chess-page flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-chess-text mb-2">Invalid Level</h1>
          <p className="text-chess-text-muted mb-4">You can only skip to Level 2 or Level 3.</p>
          <button
            onClick={() => router.push('/learn')}
            className="px-6 py-2 bg-chess-blue text-white rounded-lg hover:shadow-md transition-shadow"
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
      <CreateProfileModal
        isOpen={true}
        onClose={() => router.push('/learn')}
        context="skip-quiz"
      />
    );
  }

  // Check permissions (user is logged in but might not have skip access)
  if (!canSkipLevels) {
    return (
      <div className="min-h-full bg-chess-page flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-chess-text mb-2">Access Required</h1>
          <p className="text-chess-text-muted mb-4">
            Upgrade to premium to skip levels.
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="px-6 py-2 bg-chess-green text-white rounded-lg hover:shadow-md transition-shadow"
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
