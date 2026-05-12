import type { Metadata } from 'next';

const TITLE = "Rookie's Run | The Chess Path";
const DESCRIPTION =
  "A daily chess roguelike. Help Rookie cross the board: unlock powers, clear 10 levels, new board every day.";
const OG_IMAGE = 'https://chesspath.app/api/og/run';
const URL = 'https://chesspath.app/run';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'The Chess Path',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Rookie's Run — a daily chess roguelike",
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RunLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
