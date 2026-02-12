'use client';

import { useState } from 'react';
import { CreateProfileModal, SignupContext } from '@/components/subscription/CreateProfileModal';

const CONTEXTS: { context: SignupContext; label: string }[] = [
  { context: 'lesson-limit', label: 'After 2 Lessons' },
  { context: 'level-test', label: 'Level Test Gate' },
  { context: 'daily-rook', label: 'Daily Rook Gate' },
];

export default function TestCreateProfilePage() {
  const [active, setActive] = useState(0);
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="min-h-screen bg-chess-page">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-200 px-4 py-3">
        <p className="text-xs text-chess-text-muted mb-2 font-medium">Context:</p>
        <div className="flex gap-2">
          {CONTEXTS.map((c, i) => (
            <button key={i}
              onClick={() => { setActive(i); setShowModal(true); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                active === i ? 'bg-chess-green text-white' : 'bg-slate-100 text-chess-text-muted hover:bg-slate-200'
              }`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <button onClick={() => setShowModal(true)}
          className="bg-chess-green text-white font-bold py-3 px-6 rounded-xl hover:bg-chess-green-dark active:scale-95 transition-all">
          Show Modal
        </button>
      </div>

      <CreateProfileModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        context={CONTEXTS[active].context}
        lessonsCompleted={2}
      />
    </div>
  );
}
