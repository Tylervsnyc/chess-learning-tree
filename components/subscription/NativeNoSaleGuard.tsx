'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsNativeApp } from '@/lib/native-app';

/**
 * NativeNoSaleGuard — wraps purchase pages (/pricing, /premium-signup,
 * /subscription/setup). Inside the Chess Boxing iOS shell there is no web
 * checkout (Apple Guideline 3.1.1), so it renders nothing and sends the user
 * home. On the web it is a transparent passthrough — pages SSR as before.
 */
export function NativeNoSaleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const nativeApp = useIsNativeApp();

  useEffect(() => {
    if (nativeApp) router.replace('/');
  }, [nativeApp, router]);

  if (nativeApp) return <div className="h-full bg-chess-page" />;
  return <>{children}</>;
}
