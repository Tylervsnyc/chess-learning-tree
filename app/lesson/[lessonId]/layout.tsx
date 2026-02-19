import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lesson | The Chess Path',
  description: 'Practice chess tactics with interactive puzzles on Chess Path.',
};

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
