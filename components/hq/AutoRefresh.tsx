'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

/** Re-fetches the server component every 60s and whenever the tab comes back. */
export default function AutoRefresh({ generatedAt }: { generatedAt: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [age, setAge] = useState(0);

  useEffect(() => {
    const refresh = () => start(() => router.refresh());
    const tick = setInterval(() => setAge(Math.round((Date.now() - new Date(generatedAt).getTime()) / 1000)), 1000);
    const auto = setInterval(refresh, 60_000);
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(tick); clearInterval(auto); document.removeEventListener('visibilitychange', onVisible); };
  }, [generatedAt, router]);

  return (
    <button
      onClick={() => start(() => router.refresh())}
      className="text-xs text-zinc-400 tabular-nums active:text-white"
      aria-label="Refresh"
    >
      {pending ? 'refreshing…' : age < 5 ? 'live' : `${age}s ago`} ↻
    </button>
  );
}
