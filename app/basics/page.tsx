import type { Metadata } from 'next';
import { BasicsTutorial } from '@/components/tutorial/BasicsTutorial';

export const metadata: Metadata = {
  title: 'Learn the Basics - Chess Path',
  description: 'Learn how each chess piece moves in under 2 minutes.',
};

export default function BasicsPage() {
  return (
    <div className="h-[100dvh] overflow-auto">
      <BasicsTutorial />
    </div>
  );
}
