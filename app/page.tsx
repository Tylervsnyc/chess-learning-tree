import { MobileContainer } from '@/components/layout/MobileContainer';
import { CurriculumTree } from '@/components/tree/CurriculumTree';

export default function Home() {
  return (
    <MobileContainer>
      <main className="overflow-y-auto smooth-scroll hide-scrollbar pt-6">
        <CurriculumTree />
      </main>
    </MobileContainer>
  );
}
