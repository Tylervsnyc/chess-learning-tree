'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { CurriculumTree } from '@/components/tree/CurriculumTree';

function LearnContent() {
  const searchParams = useSearchParams();
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
    master: 6,
    grandmaster: 7,
  };
  const levelIndex = level ? (levelMap[level] ?? 0) : 0;

  return (
    <MobileContainer>
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
