'use client';

import { BreathingRook } from '@/components/ui/BreathingRook';

export default function GoldenRookieTestPage() {
  return (
    <div className="h-full overflow-auto bg-white p-8">
      <style jsx global>{`
        .no-anim *,
        .no-anim {
          animation: none !important;
          transition: none !important;
        }
      `}</style>
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Excited Rookie (Static)</h1>
        <p className="text-sm text-gray-600">
          <code>BreathingRook</code> in <code>excited</code> mood, all animations
          forcibly disabled. Screenshot this.
        </p>
        <div className="flex items-center justify-center rounded-xl bg-white p-8 shadow">
          <div className="no-anim">
            <BreathingRook size="xl" mood="excited" animate={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
