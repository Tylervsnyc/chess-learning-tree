'use client';

import { MobileContainer } from '@/components/layout/MobileContainer';
import { CurriculumTree } from '@/components/tree/CurriculumTree';

export default function LearnPage() {
  return (
    <MobileContainer>
      <main className="overflow-y-auto smooth-scroll hide-scrollbar pt-2">
        <CurriculumTree />
      </main>
    </MobileContainer>
  );
}
