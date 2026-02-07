import type { Metadata } from 'next';
import { getLessonById, getLevelFromLessonId, getLevelConfig } from '@/lib/curriculum-registry';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { lessonId } = await params;
  const sp = await searchParams;
  const score = sp.score as string | undefined;

  // Dynamic OG when share params are present
  if (score) {
    const accuracy = sp.accuracy as string | undefined;
    const streak = sp.streak as string | undefined;

    const lesson = getLessonById(lessonId);
    const lessonName = lesson?.name || 'Lesson';
    const levelNum = getLevelFromLessonId(lessonId);
    const levelConfig = getLevelConfig(levelNum);
    const levelName = levelConfig?.data.name || '';

    const ogParams = new URLSearchParams({ score });
    ogParams.set('lesson', lessonName);
    ogParams.set('level', String(levelNum));
    if (levelName) ogParams.set('levelName', levelName);
    if (accuracy) ogParams.set('accuracy', accuracy);
    if (streak) ogParams.set('streak', streak);

    const ogImageUrl = `https://chesspath.app/api/og/lesson?${ogParams.toString()}`;
    const title = `${score} | ${lessonName} | Chess Path`;
    const description = `I scored ${score} on "${lessonName}" on Chess Path! Can you beat my score?`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://chesspath.app/lesson/${lessonId}`,
        siteName: 'The Chess Path',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `Chess Path - ${lessonName} - Score: ${score}`,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
      },
    };
  }

  // Default metadata
  return {
    title: 'Lesson | The Chess Path',
    description: 'Practice chess tactics with interactive puzzles on Chess Path.',
  };
}

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
