import { OnboardGate } from '@/components/chessboxing/OnboardGate';

/**
 * /box layout — mounts the first-launch onboarding gate over every /box
 * route. The gate itself only redirects '/box' (see OnboardGate).
 */
export default function BoxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OnboardGate />
      {children}
    </>
  );
}
