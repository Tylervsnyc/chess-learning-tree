import type { Metadata } from 'next';

// Internal dev/test routes — keep out of search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
