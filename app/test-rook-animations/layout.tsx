import type { Metadata } from 'next';

// Internal dev/test route — keep out of search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TestRookAnimationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
