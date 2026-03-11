import type { Metadata } from 'next';
import { getOpeningBySlug } from '@/data/openings/registry';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string; status: string }>;
}): Promise<Metadata> {
  const { slug, lessonId } = await params;

  const opening = getOpeningBySlug(slug);
  const openingName = opening?.name || 'Opening';
  const color = opening?.color || '#FF9600';
  const colorLight = opening?.colorLight || '#FFB347';

  // Opening lessons always count as perfect — no scoring
  const ogParams = new URLSearchParams({
    opening: openingName,
    lesson: lessonId,
    score: 'perfect',
    color,
    colorLight,
  });

  const ogImageUrl = `https://chesspath.app/api/og/opening?${ogParams.toString()}`;
  const title = `Perfect! | ${openingName} | Chess Path`;
  const description = `I completed a ${openingName} lesson on Chess Path! Can you beat it?`;
  const url = `https://chesspath.app/openings/${slug}/${lessonId}/share/${status}`;

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
          alt: `Chess Path - ${openingName} - Perfect Score`,
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
