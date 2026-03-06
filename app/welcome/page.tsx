import type { Metadata } from 'next';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export const metadata: Metadata = {
  title: 'Welcome to Chess Path',
  description: 'Start your chess journey. Learn tactics the fun way in just 5 minutes a day.',
};

export default function WelcomePage() {
  return <OnboardingFlow />;
}
