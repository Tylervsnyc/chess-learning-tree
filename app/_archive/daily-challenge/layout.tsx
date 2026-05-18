import type { Metadata } from 'next';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  if (!params) {
    return {
      title: 'The Daily Rook | The Chess Path',
      description: '22 puzzles. Build the rook. Test your skills against the same puzzles as everyone else.',
    };
  }
  const score = params.score as string | undefined;
  const time = params.time as string | undefined;
  const rank = params.rank as string | undefined;
  const total = params.total as string | undefined;
  const results = params.results as string | undefined;
  const name = params.name as string | undefined;
  const streak = params.streak as string | undefined;

  // If we have score params, generate a dynamic OG image
  if (score) {
    const ogParams = new URLSearchParams({ score, variant: '3' });
    if (time) ogParams.set('time', time);
    if (rank) ogParams.set('rank', rank);
    if (total) ogParams.set('total', total);
    if (results) ogParams.set('results', results);
    if (name) ogParams.set('name', name);
    if (streak) ogParams.set('streak', streak);

    const ogImageUrl = `https://chesspath.app/api/og/daily-challenge?${ogParams.toString()}`;

    // Format time for description
    const timeMs = parseInt(time || '0');
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeFormatted = minutes === 0 ? `${seconds}s` : `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const description = `I solved ${score} puzzles in ${timeFormatted} on today's Daily Rook! Can you beat my score?`;

    return {
      title: `${score} Puzzles Solved | The Daily Rook`,
      description,
      openGraph: {
        title: `${score} Puzzles Solved | The Daily Rook`,
        description,
        url: 'https://chesspath.app/daily-challenge',
        siteName: 'The Chess Path',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `The Daily Rook - ${score} puzzles solved`,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${score} Puzzles Solved | The Daily Rook`,
        description,
        images: [ogImageUrl],
      },
    };
  }

  // Default metadata (no score params - just visiting the page)
  return {
    title: 'The Daily Rook | The Chess Path',
    description: '22 puzzles. Build the rook. Test your skills against the same puzzles as everyone else. Solve as many as you can in 5 minutes with only 3 lives. Compare your score on the global leaderboard.',
    openGraph: {
      title: 'The Daily Rook | The Chess Path',
      description: '22 puzzles. Build the rook. Solve as many as you can in 5 minutes with only 3 lives.',
      url: 'https://chesspath.app/daily-challenge',
      siteName: 'The Chess Path',
      images: [
        {
          url: 'https://chesspath.app/og-image.png',
          width: 1200,
          height: 630,
          alt: 'The Chess Path - The Daily Rook',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'The Daily Rook | The Chess Path',
      description: '22 puzzles. Build the rook. Solve as many as you can in 5 minutes with only 3 lives.',
      images: ['https://chesspath.app/og-image.png'],
    },
  };
}

export default function DailyChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
