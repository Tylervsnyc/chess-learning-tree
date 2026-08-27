import type { Metadata } from 'next';

/**
 * The shareable launch page. This exists because a Claude artifact serves
 * claude.ai's own Open Graph tags ("Claude Artifact" + the Claude logo) and
 * nothing in the page body can override them — so a link pasted into WhatsApp
 * or iMessage previewed as Claude, not as Chess Boxing.
 *
 * Hosting it here means we own the card, the domain, and the analytics.
 */

const TITLE = 'Chess Boxing | Out now on the App Store';
const DESCRIPTION =
  'Chess boxing is a real sport: three minutes of chess, three minutes of boxing, until checkmate or knockout. Now there is an app. Free on the App Store.';
const OG_IMAGE = 'https://chesspath.app/og/chessboxing.png';
const URL = 'https://chesspath.app/chessboxing';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: 'Chess Boxing is live',
    description: DESCRIPTION,
    url: URL,
    siteName: 'The Chess Path',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'The Chessboxing NYC crew in the ring at Gleason’s Gym',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chess Boxing is live',
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  alternates: { canonical: URL },
};

export default function ChessBoxingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
