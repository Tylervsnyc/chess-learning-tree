import type { Metadata } from 'next';
import { OnboardFlow } from '@/components/chessboxing/OnboardFlow';

export const metadata: Metadata = {
  title: 'Welcome — Chess Boxing',
};

export default function BoxOnboardingPage() {
  return <OnboardFlow />;
}
