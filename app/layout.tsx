import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { NavHeader } from '@/components/layout/NavHeader';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { AbortErrorSuppressor } from '@/components/providers/ErrorBoundary';
import { ScrollToTop } from '@/components/providers/ScrollToTop';
import { InstallPrompt } from '@/components/InstallPrompt';

export const metadata: Metadata = {
  title: 'The Chess Path',
  description: 'Chess. Made Simple.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Chess Path',
  },
  icons: {
    apple: '/brand/apple-touch-icon.png',
  },
  openGraph: {
    title: 'The Chess Path',
    description: 'Chess. Made Simple.',
    url: 'https://chesspath.app',
    siteName: 'The Chess Path',
    images: [
      {
        url: 'https://chesspath.app/api/og/default',
        width: 1200,
        height: 630,
        alt: 'The Chess Path - Chess. Made Simple.',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Chess Path',
    description: 'Chess. Made Simple.',
    images: ['https://chesspath.app/api/og/default'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#eef6fc',
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
            <InstallPrompt />
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
