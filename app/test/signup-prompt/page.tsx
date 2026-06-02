'use client';

import { useState } from 'react';
import { SignupPrompt } from '@/components/onboarding/SignupPrompt';

// CHE-339 visual check. The live prompt picks its variant from the
// `win_signup_capture` PostHog experiment (default = treatment). This page
// forces a preview so you can eyeball it without playing a game to a win.
export default function TestSignupPrompt() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-auto bg-chess-page p-6">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-black text-chess-text">CHE-339 — Win-moment signup prompt</h1>
        <p className="text-chess-text-muted text-sm">
          Treatment (default): concrete value headline + one-tap Google/Apple — the
          leak fix. Control routes to the form. Live variant comes from the{' '}
          <code>win_signup_capture</code> experiment.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="w-full py-3 rounded-2xl font-bold text-white bg-chess-green shadow-[0_4px_0_#3d8c01]"
        >
          Show prompt (valueLabel = &quot;3-day streak&quot;)
        </button>
      </div>

      {open && (
        <SignupPrompt source="test" valueLabel="3-day streak" onDismiss={() => setOpen(false)} />
      )}
    </div>
  );
}
