'use client';

const IMAGES = [
  { src: '/abilities/concepts/smoke-1.png', label: 'Smoke 1 — censer' },
  { src: '/abilities/concepts/smoke-2.png', label: 'Smoke 2 — orb' },
  { src: '/abilities/concepts/boulder-1.png', label: 'Boulder 1 — cracked granite' },
  { src: '/abilities/concepts/boulder-2.png', label: 'Boulder 2 — menhir' },
];

export default function AbilityConceptsPage() {
  return (
    <div className="h-full overflow-auto bg-slate-900 p-6 text-white">
      <h1 className="mb-6 text-2xl font-bold">Ability concept art — Smoke + Boulder</h1>
      <div className="grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {IMAGES.map((img) => (
          <figure key={img.src} className="overflow-hidden rounded-xl bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.label} className="aspect-square w-full object-cover" />
            <figcaption className="p-3 text-sm text-slate-300">{img.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
