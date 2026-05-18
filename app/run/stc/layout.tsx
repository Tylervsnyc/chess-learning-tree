import type { Metadata } from 'next';

const TITLE = 'Story Time Chess × Rookie’s Run | The Chess Path';
const DESCRIPTION =
  'A co-branded basics mini-run series. Learn how each piece moves the Story Time Chess way — Kings, Bishops, Pawns, Knights, Queens.';
const URL = 'https://chesspath.app/run/stc';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'The Chess Path',
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
