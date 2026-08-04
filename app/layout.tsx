import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { NavHeader } from '@/components/layout/NavHeader';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { AbortErrorSuppressor } from '@/components/providers/ErrorBoundary';
import { RookieErrorBoundary } from '@/components/ui/RookieErrorBoundary';
import { SilentErrorBoundary } from '@/components/ui/SilentErrorBoundary';
import { NativeSplash } from '@/components/chessboxing/NativeSplash';
import { BoxTabBar } from '@/components/chessboxing/BoxTabBar';
import { NativeHomeRedirect } from '@/components/chessboxing/NativeHomeRedirect';
import { organizationJsonLd, webSiteJsonLd } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'The Chess Path',
  description: 'The Fun Way to Learn Chess.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Chess Path',
  },
  icons: {
    icon: [
      { url: '/brand/icon-32-favicon.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/brand/icon-96.svg', sizes: '96x96', type: 'image/svg+xml' },
    ],
    apple: '/brand/apple-touch-icon.png',
  },
  openGraph: {
    title: 'The Chess Path',
    description: 'The Fun Way to Learn Chess.',
    url: 'https://chesspath.app',
    siteName: 'The Chess Path',
    images: [
      {
        url: 'https://chesspath.app/og/default.png',
        width: 1200,
        height: 630,
        alt: 'The Chess Path - The Fun Way to Learn Chess.',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Chess Path',
    description: 'The Fun Way to Learn Chess.',
    images: ['https://chesspath.app/og/default.png'],
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
        <SilentErrorBoundary label="NativeHomeRedirect">
          <NativeHomeRedirect />
        </SilentErrorBoundary>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd()) }}
        />
        <Suspense fallback={null}>
          <AbortErrorSuppressor />
          <PostHogProvider>
            <SilentErrorBoundary label="NavHeader">
              <NavHeader />
            </SilentErrorBoundary>
            <main className="flex-1 min-h-0 flex flex-col max-w-3xl mx-auto w-full">
              <RookieErrorBoundary>
                {children}
              </RookieErrorBoundary>
            </main>
            <SilentErrorBoundary label="BoxTabBar">
              <BoxTabBar />
            </SilentErrorBoundary>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
