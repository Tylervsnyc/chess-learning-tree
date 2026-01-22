import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { NavHeader } from '@/components/layout/NavHeader';
import { PostHogProvider } from '@/components/providers/PostHogProvider';

export const metadata: Metadata = {
  title: 'The Chess Path',
  description: 'Master chess tactics through a structured learning journey',
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
          <PostHogProvider>
            <NavHeader />
            {children}
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
