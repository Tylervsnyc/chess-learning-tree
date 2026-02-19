import type { Metadata } from 'next';
import { getLessonById, getLevelFromLessonId, getLevelConfig } from '@/lib/curriculum-registry';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonId: string; status: string }>;
}): Promise<Metadata> {
  const { lessonId, status } = await params;

  const lesson = getLessonById(lessonId);
  const lessonName = lesson?.name || 'Lesson';
  const levelNum = getLevelFromLessonId(lessonId);
  const levelConfig = getLevelConfig(levelNum);
  const levelName = levelConfig?.data.name || '';

  const isPerfect = status === 'perfect';
  const score = isPerfect ? '6/6' : '5/6';

  const ogParams = new URLSearchParams({
    score,
    lesson: lessonName,
    level: String(levelNum),
  });
  if (levelName) ogParams.set('levelName', levelName);

  const ogImageUrl = `https://chesspath.app/api/og/lesson?${ogParams.toString()}`;
  const title = `${isPerfect ? 'Perfect!' : 'Completed!'} | ${lessonName} | Chess Path`;
  const description = `I ${isPerfect ? 'got a perfect score' : 'completed'} "${lessonName}" on Chess Path! Can you beat it?`;
  const url = `https://chesspath.app/lesson/${lessonId}/share/${status}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'The Chess Path',
      images: [
        {
          url: ogImageUrl,
          width: 1080,
          height: 1080,
          alt: `Chess Path - ${lessonName} - ${isPerfect ? 'Perfect Score' : 'Completed'}`,
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

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
