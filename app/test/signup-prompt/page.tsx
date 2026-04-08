'use client';

import { useState } from 'react';
import { SignupPrompt } from '@/components/onboarding/SignupPrompt';

export default function TestSignupPrompt() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="h-[100dvh] overflow-auto flex flex-col items-center justify-center bg-chess-page gap-4">
        <p className="text-chess-text font-bold">Prompt dismissed</p>
        <button
          onClick={() => setDismissed(false)}
          className="px-4 py-2 bg-chess-green text-white rounded-lg font-bold"
        >
          Show Again
        </button>
      </div>
    );
  }

  return <SignupPrompt onDismiss={() => setDismissed(true)} />;
}
