'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useOnboarding, SelectedLevel } from '@/hooks/useOnboarding';
import { PlacementResults } from '@/components/onboarding/PlacementResults';
import { playCelebrationSound } from '@/lib/sounds';

function OnboardingCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();
  const { complete } = useOnboarding();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Parse URL params
  const elo = parseInt(searchParams.get('elo') || '600', 10);
  const level = searchParams.get('level') as SelectedLevel;
  const passed = searchParams.get('passed') === 'true';
  const score = searchParams.get('score') || '0/0';
  const suggestedLevel = searchParams.get('suggestedLevel') as SelectedLevel | undefined;
  const isDiagnostic = searchParams.get('diagnostic') === 'true';
  const finalRating = searchParams.get('finalRating')
    ? parseInt(searchParams.get('finalRating')!, 10)
    : undefined;

  // Play celebration sound on mount
  useEffect(() => {
    if (!hasCelebrated) {
      setHasCelebrated(true);
      playCelebrationSound();
    }
  }, [hasCelebrated]);

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, userLoading, router]);

  // Save rating and complete onboarding
  const saveAndContinue = useCallback(async (eloToSave: number) => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/profile/update-rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elo_rating: eloToSave,
          onboarding_completed: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      // Clear onboarding state
      complete();

      // Redirect to learn page
      router.push('/learn');
    } catch (err) {
      console.error('Error saving rating:', err);
      setError(err instanceof Error ? err.message : 'Failed to save your rating');
      setSaving(false);
    }
  }, [complete, router]);

  // Handle continue (use current ELO)
  const handleContinue = useCallback(() => {
    saveAndContinue(elo);
  }, [elo, saveAndContinue]);

  // Handle trying lower level
  const handleTryLower = useCallback(() => {
    // Redirect to lower level's complete page
    if (suggestedLevel === 'beginner') {
      saveAndContinue(600);
    } else if (suggestedLevel === 'intermediate') {
      saveAndContinue(800);
    }
  }, [suggestedLevel, saveAndContinue]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col items-center justify-center px-4 py-8">
      {/* Error message */}
      {error && (
        <div className="max-w-md w-full mb-6 p-4 bg-red-600/20 border border-red-500 rounded-xl text-center">
          <p className="text-red-400 mb-3">{error}</p>
          <button
            onClick={handleContinue}
            className="text-sm text-white underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A2C35] rounded-xl p-6 text-center">
            <div className="text-2xl mb-3">🚀</div>
            <div className="text-white font-semibold">Setting up your account...</div>
          </div>
        </div>
      )}

      {/* Results */}
      <PlacementResults
        score={score}
        passed={passed || isDiagnostic}
        determinedLevel={level}
        startingElo={elo}
        suggestedLevel={suggestedLevel}
        isDiagnostic={isDiagnostic}
        finalRating={finalRating}
        onContinue={handleContinue}
        onTryLower={handleTryLower}
      />
    </div>
  );
}

export default function OnboardingCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <OnboardingCompleteContent />
    </Suspense>
  );
}
