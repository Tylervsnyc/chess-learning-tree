import { MobileContainer } from '@/components/layout/MobileContainer';
import { Header } from '@/components/layout/Header';
import { LearningTree } from '@/components/tree/LearningTree';

export default function Home() {
  return (
    <MobileContainer>
      <Header level={1} eloRange="400-600 ELO" />
      <main className="overflow-y-auto smooth-scroll hide-scrollbar">
        <div className="py-8">
          <LearningTree />
        </div>
      </main>
    </MobileContainer>
  );
}
