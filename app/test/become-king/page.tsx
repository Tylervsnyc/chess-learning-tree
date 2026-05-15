'use client';

import { PieceBlocks, GOLDEN_KING_PALETTE } from '@/components/run/PieceBlocks';
import Image from 'next/image';

export default function BecomeKingPreviewPage() {
  return (
    <div className="overflow-auto min-h-screen bg-neutral-950 text-white p-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Become King — preview
          </h1>
          <p className="text-neutral-400">
            Pick a card art + check the golden king sprite. Both art variants
            were generated with gpt-image-1 in the same Power-9 relic style as
            the other abilities.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Card art variants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ArtTile
              src="/abilities/become-king-1.png"
              label="Variant 1 — Imperial crown"
            />
            <ArtTile
              src="/abilities/become-king-2.png"
              label="Variant 2 — King chess piece"
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Golden king sprite</h2>
          <p className="text-sm text-neutral-400">
            What Rookie looks like during the Become King transform — gold
            palette to read as &ldquo;impervious / royal&rdquo;. Default Rookie
            palette shown next to it for comparison.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <SpriteTile label="Golden King (Become King form)">
              <PieceBlocks piece="K" blockSize={12} palette={GOLDEN_KING_PALETTE} />
            </SpriteTile>
            <SpriteTile label="Default Rookie palette King (for comparison)">
              <PieceBlocks piece="K" blockSize={12} />
            </SpriteTile>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Spec recap</h2>
          <ul className="list-disc list-inside space-y-1 text-neutral-300 text-sm leading-relaxed">
            <li>Activation: <strong>Transform · Royal</strong></li>
            <li>T1: <strong>1 turn</strong> as King, 1/level</li>
            <li>Move 1 square in any direction (king-style)</li>
            <li><strong>Impervious</strong> — cannot be captured. Attempted captures bounce the attacker back.</li>
            <li>Royal aura — adjacent enemies can&rsquo;t move toward you</li>
            <li>Replaces Pawn Charge</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function ArtTile({ src, label }: { src: string; label: string }) {
  return (
    <div className="space-y-2">
      <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-square relative">
        <Image src={src} alt={label} fill sizes="(max-width: 640px) 100vw, 512px" className="object-cover" />
      </div>
      <p className="text-sm text-neutral-300">{label}</p>
    </div>
  );
}

function SpriteTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 aspect-square flex items-center justify-center p-4">
        {children}
      </div>
      <p className="text-sm text-neutral-300">{label}</p>
    </div>
  );
}
