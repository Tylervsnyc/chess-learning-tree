'use client';

import { useEffect, useState } from 'react';
import { ProPaywall } from '@/components/pro/ProPaywall';

/**
 * Test page: the REAL Rookie Pro paywall (components/pro/ProPaywall.tsx),
 * mounted directly so it shows even while FEATURE_FLAGS.PRO is off. The
 * buttons are live: on the web "Start" opens Stripe checkout for a signed-in
 * account — don't tap it with a real card. Container MUST be overflow-auto
 * (body is overflow:hidden globally).
 *
 * ?open=<trigger> opens it straight away (screenshots), e.g.
 *   /test/pro-family-popup?open=limit_lesson&trialUsed=1&wrong=1
 * Must fit an iPhone SE (667px tall) with NO scrolling (Tyler 2026-10-18).
 */

const TRIGGERS: { id: string; label: string }[] = [
  { id: 'limit_lesson', label: 'Chess Path: lesson limit' },
  { id: 'limit_review', label: 'Chess Path: review limit' },
  { id: 'variations', label: 'Chess Path: Try it' },
  { id: 'limit_bout', label: 'Chess Boxing: fight limit' },
  { id: 'limit_workout', label: 'Chess Boxing: Puzzle Boxing limit' },
  { id: 'custom_rounds', label: 'Chess Boxing: custom rounds' },
];

export default function ProFamilyPopupTest() {
  const [open, setOpen] = useState<string | null>(null);
  const [trialUsed, setTrialUsed] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [wrongAccount, setWrongAccount] = useState(false);
  const [fakeEmail, setFakeEmail] = useState(true);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setTrialUsed(q.get('trialUsed') === '1');
    setIsPremium(q.get('pro') === '1');
    setWrongAccount(q.get('wrong') === '1');
    const t = q.get('open');
    if (t) setOpen(t);
  }, []);

  return (
    <div className="h-full overflow-auto bg-slate-100">
      <div className="mx-auto max-w-xl px-4 py-6 space-y-5">
        <div>
          <h1 className="text-xl font-black text-chess-text">Rookie Pro paywall</h1>
          <p className="text-sm text-chess-text-muted mt-1">
            The real component. Buttons are live, so don&apos;t check out with a real card.
          </p>
        </div>

        <Group title="Preview state">
          <Chip on={trialUsed} onClick={() => setTrialUsed((v) => !v)}>Trial already used</Chip>
          <Chip on={isPremium} onClick={() => setIsPremium((v) => !v)}>Already Pro</Chip>
          <Chip on={wrongAccount} onClick={() => setWrongAccount((v) => !v)}>Pro on another account</Chip>
          <Chip on={fakeEmail} onClick={() => setFakeEmail((v) => !v)}>Sample email</Chip>
        </Group>

        <Group title="Open it from">
          {TRIGGERS.map((t) => (
            <Chip key={t.id} on={open === t.id} onClick={() => setOpen(t.id)}>
              {t.label}
            </Chip>
          ))}
        </Group>
      </div>

      {open && (
        <ProPaywall
          trigger={open}
          onClose={() => setOpen(null)}
          preview={{
            trialUsed,
            isPremium,
            wrongAccount,
            ...(fakeEmail ? { email: 'tyler@example.com' } : {}),
          }}
        />
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-black uppercase tracking-wide text-chess-text-muted mb-1.5">{title}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[44px] rounded-xl px-3 text-xs font-bold ${on ? 'bg-chess-blue text-white' : 'bg-white text-chess-text shadow-sm'}`}
    >
      {children}
    </button>
  );
}
