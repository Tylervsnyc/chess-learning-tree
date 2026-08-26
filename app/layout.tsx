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
import { StatusBarSync } from '@/components/chessboxing/StatusBarSync';
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
        {/* Chess Boxing shell home redirect — runs before paint so the web
            home never flashes inside the app. First launch: detect Capacitor
            (its bridge is injected before page scripts), set the cp_boxapp
            cookie (the middleware then handles / server-side on every later
            launch), and replace to /box. Once per session so the Play tab and
            in-app browsing are left alone. Debug on web with ?boxapp=1;
            ?boxapp=frame previews one document and writes nothing (iframes). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var p=location.pathname;if(['/','/welcome','/path','/play'].indexOf(p)<0)return;var w=window;if(/[?&]boxapp=frame/.test(location.search))return;var inApp=(w.Capacitor&&w.Capacitor.isNativePlatform&&w.Capacitor.isNativePlatform())||/[?&]boxapp/.test(location.search)||sessionStorage.getItem('cp:boxapp')==='1';if(!inApp)return;sessionStorage.setItem('cp:boxapp','1');document.cookie='cp_boxapp=1;path=/;max-age=31536000;SameSite=Lax';if(sessionStorage.getItem('cp:box-home-redirected')==='1')return;sessionStorage.setItem('cp:box-home-redirected','1');location.replace('/box');}catch(e){}})();",
          }}
        />
      </head>
      <body className="antialiased">
        <NativeSplash />
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
            {/* The shell cap is a variable so a native-app section can opt out.
                Chess Boxing (/box) screens are full-bleed-background + inner
                cap; capping <main> at 768px let the light page background show
                as bars beside the dark arena on every iPad wider than that.
                See app/box/layout.tsx, which sets --shell-max to none. */}
            <main
              className="flex-1 min-h-0 flex flex-col mx-auto w-full"
              style={{ maxWidth: 'var(--shell-max, 48rem)' }}
            >
              <RookieErrorBoundary>
                {children}
              </RookieErrorBoundary>
            </main>
            <SilentErrorBoundary label="BoxTabBar">
              <BoxTabBar />
              <StatusBarSync />
            </SilentErrorBoundary>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
