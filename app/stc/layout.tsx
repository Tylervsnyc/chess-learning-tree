import type { Metadata } from 'next';

const TITLE = 'Story Time Chess × Rookie’s Run';
const DESCRIPTION =
  'A co-branded basics mini-run series. Learn how each piece moves the Story Time Chess way — Kings, Bishops, Pawns, Knights, Queens.';
const URL = 'https://run.chesspath.app/stc';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'Rookie’s Run',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function StcLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
