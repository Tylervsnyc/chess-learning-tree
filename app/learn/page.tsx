'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { CurriculumTree } from '@/components/tree/CurriculumTree';
import { useUser } from '@/hooks/useUser';

function LearnContent() {
  const searchParams = useSearchParams();
  const { user, loading } = useUser();
  const isGuest = searchParams.get('guest') === 'true';
  const level = searchParams.get('level');

  // Map level name to index (8 levels total)
  const levelMap: Record<string, number> = {
    beginner: 0,
    casual: 1,
    club: 2,
    tournament: 3,
    advanced: 4,
    expert: 5,
    elite: 6,
    legend: 7,
  };
  const levelIndex = level ? (levelMap[level] ?? 0) : 0;

  // Show Buy Premium for non-logged-in users
  const showBuyPremium = !loading && !user;

  return (
    <MobileContainer>
      {showBuyPremium && (
        <div className="flex justify-end px-4 pt-2 pb-1">
          <Link
            href="/premium-signup"
            className="px-3 py-1.5 rounded-lg font-bold text-sm transition-all active:translate-y-[1px]"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
            }}
          >
            Buy Premium
          </Link>
        </div>
      )}
      <main className="overflow-y-auto smooth-scroll hide-scrollbar pt-2">
        <CurriculumTree isGuest={isGuest} initialLevel={levelIndex} />
      </main>
    </MobileContainer>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={
      <MobileContainer>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Loading...</div>
        </div>
      </MobileContainer>
    }>
      <LearnContent />
    </Suspense>
  );
}
