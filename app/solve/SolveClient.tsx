'use client';

import { useRouter } from 'next/navigation';
import { CheckmateLanding } from '@/components/onboarding/CheckmateLanding';

export function SolveClient({ authed }: { authed: boolean }) {
  const router = useRouter();
  return (
    <CheckmateLanding
      postWin={authed ? 'continue' : 'signup'}
      onContinue={(route) => router.push(route)}
      onSignIn={() => router.push('/auth/login')}
    />
  );
}
