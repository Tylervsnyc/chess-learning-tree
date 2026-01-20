'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { CurriculumTree } from '@/components/tree/CurriculumTree';

function LearnContent() {
  const searchParams = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';
  const level = searchParams.get('level');

  // Map level name to index (6 levels total)
  const levelMap: Record<string, number> = {
    beginner: 0,
    intermediate: 1,
    advanced: 2,
    expert: 3,
    master: 4,
    grandmaster: 5,
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
