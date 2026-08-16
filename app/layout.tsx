import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { AbortErrorSuppressor } from '@/components/providers/ErrorBoundary';
import { RookieErrorBoundary } from '@/components/ui/RookieErrorBoundary';
import { NativeSplash } from '@/components/run/NativeSplash';
import { StatusBarSync } from '@/components/run/StatusBarSync';

const TITLE = "Rookies Run";
const DESCRIPTION =
  'A daily chess roguelike. Help Rookie cross the board: unlock powers, clear 10 levels, new board every day.';
const SITE_URL = 'https://run.chesspath.app';
const OG_IMAGE = `${SITE_URL}/og/run.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: TITLE,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: TITLE,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Rookies Run — a daily chess roguelike",
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // The board is a drag target — pinch-zoom on it is never what someone meant.
  maximumScale: 1,
  userScalable: false,
  // Must stay in step with the native splash: see SPLASH_BG in
  // components/run/NativeSplash.tsx and capacitor.config.ts.
  themeColor: '#eef6fc',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/dm-sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <NativeSplash />
        <Suspense fallback={null}>
          <AbortErrorSuppressor />
          <PostHogProvider>
            {/* No nav chrome and no max-width wrapper — the game owns the
                whole viewport. Chess Path's NavHeader/BoxTabBar/main wrapper
                deliberately do not come across. */}
            <RookieErrorBoundary>{children}</RookieErrorBoundary>
            <StatusBarSync />
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
