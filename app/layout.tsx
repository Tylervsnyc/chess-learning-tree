import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { NavHeader } from '@/components/layout/NavHeader';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { AbortErrorSuppressor } from '@/components/providers/ErrorBoundary';
import { ScrollToTop } from '@/components/providers/ScrollToTop';

export const metadata: Metadata = {
  title: 'The Chess Path',
  description: 'The shortest path to chess improvement',
  openGraph: {
    title: 'The Chess Path',
    description: 'The shortest path to chess improvement',
    url: 'https://chesspath.app',
    siteName: 'The Chess Path',
    images: [
      {
        url: 'https://chesspath.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Chess Path - The shortest path to chess improvement',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Chess Path',
    description: 'The shortest path to chess improvement',
    images: ['https://chesspath.app/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#131F24',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Suspense fallback={null}>
          <AbortErrorSuppressor />
          <ScrollToTop />
          <PostHogProvider>
            <NavHeader />
            <main className="flex-1 min-h-0 flex flex-col">
              {children}
            </main>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
