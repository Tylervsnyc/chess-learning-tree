'use client';

import { useState } from 'react';

export default function TestSharePreviewPage() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const params = new URLSearchParams({
    format: 'story',
    score: '18',
    time: '225000',
    name: 'TacticQueen',
    rank: '3',
    total: '47',
    results: '1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0',
  });

  const ogUrl = `/api/og/daily-challenge?${params.toString()}`;

  const fetchImage = async () => {
    setLoading(true);
    try {
      const res = await fetch(ogUrl);
      const blob = await res.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <h1 className="text-2xl font-black mb-2">Share Card Preview</h1>
      <p className="text-white/40 text-sm mb-4">
        This shows the actual OG-generated story image (1080×1920) that gets shared.
      </p>

      <button
        onClick={fetchImage}
        disabled={loading}
        className="px-6 py-3 rounded-xl font-bold text-sm text-white mb-6"
        style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)' }}
      >
        {loading ? 'Generating...' : imageUrl ? 'Regenerate' : 'Generate Share Card'}
      </button>

      {imageUrl && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ maxWidth: 360 }}>
            <img src={imageUrl} alt="Share card preview" className="w-full h-auto" />
          </div>
          <p className="text-white/30 text-xs">1080×1920 — this is what gets texted/shared</p>
        </div>
      )}
    </div>
  );
}
