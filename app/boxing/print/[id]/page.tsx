'use client';

import { useEffect, useState, use } from 'react';
import { BoxingSheet, type SheetPuzzle } from '@/components/boxing/BoxingSheet';

interface DrawResponse {
  draw: {
    id: string;
    theme: string;
    pages: number;
    showThemes: boolean;
    createdAt: string;
  };
  puzzles: SheetPuzzle[];
}

export default function BoxingPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<DrawResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/boxing/draw/${id}`)
      .then((r) => (r.ok ? r.json() : r.json().then((j) => Promise.reject(j))))
      .then(setData)
      .catch((e) => setError(e?.error ?? 'Failed to load draw'));
  }, [id]);

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">Error: {error}</div>
    );
  }
  if (!data) {
    return (
      <div className="p-8 text-center text-neutral-500">Loading puzzles…</div>
    );
  }

  return (
    <>
      <div className="no-print flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-6 py-3 sticky top-0 z-50">
        <div className="text-sm text-neutral-700">
          <span className="font-semibold">{data.puzzles.length} puzzles</span>
          {' · '}
          <span className="capitalize">{data.draw.theme}</span>
          {' · '}
          <span>{data.draw.pages} page{data.draw.pages === 1 ? '' : 's'} + answer key</span>
        </div>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-chess-green px-4 py-2 text-sm font-semibold text-white hover:bg-chess-green/90"
        >
          Download PDF
        </button>
      </div>
      <BoxingSheet
        puzzles={data.puzzles}
        pages={data.draw.pages}
        showThemes={data.draw.showThemes}
      />
      <style jsx global>{`
        body header.sticky,
        body > div header[class*='sticky'] {
          display: none !important;
        }
        main {
          max-width: none !important;
        }
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
