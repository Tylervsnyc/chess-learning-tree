import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Opening Lesson | Chess Path',
  description: 'Learn chess openings move by move with interactive lessons.',
}

export default function OpeningLessonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
