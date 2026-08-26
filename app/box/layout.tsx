import { OnboardGate } from '@/components/chessboxing/OnboardGate';
import { FullBleedShell } from '@/components/chessboxing/FullBleedShell';

/**
 * /box layout — mounts the first-launch onboarding gate over every /box
 * route. The gate itself only redirects '/box' (see OnboardGate).
 *
 * It also drops the site shell's 768px width cap for the whole section — see
 * components/chessboxing/FullBleedShell.
 */
export default function BoxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FullBleedShell />
      <OnboardGate />
      {children}
    </>
  );
}
