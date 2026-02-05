'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { DailyChallengeReport } from '@/components/daily-challenge/DailyChallengeReport';

// Sample puzzle positions (interesting tactical positions)
const SAMPLE_FENS = [
  'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', // Scholar's mate threat
  'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', // Italian Game
  'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 1 5', // Sicilian
  'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 5', // Giuoco Piano
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', // Sicilian Defense
];

export default function TestDailyReportPage() {
  const [puzzlesSolved, setPuzzlesSolved] = useState(14);
  const [totalPuzzles] = useState(20);
  const [timeMs, setTimeMs] = useState(185000);
  const [mistakes, setMistakes] = useState(1);
  const [rank, setRank] = useState(47);
  const [totalParticipants, setTotalParticipants] = useState(234);
  const [highestPuzzleRating, setHighestPuzzleRating] = useState(1850);
  const [fenIndex, setFenIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const stories2Ref = useRef<HTMLDivElement>(null);

  const highestPuzzleFen = SAMPLE_FENS[fenIndex];

  const variants = [
    { id: 'stories-1', name: 'Clean Minimal', desc: 'White text, simple layout' },
    { id: 'stories-2', name: 'Orange Accent', desc: 'Gradient pill, framed board' },
    { id: 'stories-3', name: 'Bold Stacked', desc: 'Big typography, green CTA' },
    { id: 'stories-4', name: 'Glassmorphism', desc: 'Frosted glass cards' },
    { id: 'stories-5', name: 'Vibrant Split', desc: 'Colored sections' },
  ] as const;

  const saveStories2Image = async () => {
    if (!stories2Ref.current) return;
    setSaving(true);

    try {
      const canvas = await html2canvas(stories2Ref.current, {
        backgroundColor: null,
        scale: 2, // Higher resolution
      });

      const link = document.createElement('a');
      link.download = `daily-challenge-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to save image:', err);
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#0D1A1F] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-2 text-center">Daily Challenge Report</h1>
        <p className="text-gray-500 text-center mb-6">5 Instagram Stories designs with puzzle board</p>

        {/* Controls */}
        <div className="bg-[#1A2C35] rounded-xl p-4 mb-8 max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Puzzles: {puzzlesSolved}</label>
              <input
                type="range"
                min="1"
                max={totalPuzzles}
                value={puzzlesSolved}
                onChange={(e) => setPuzzlesSolved(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Time: {Math.floor(timeMs / 60000)}:{String(Math.floor((timeMs % 60000) / 1000)).padStart(2, '0')}</label>
              <input
                type="range"
                min="30000"
                max="300000"
                step="1000"
                value={timeMs}
                onChange={(e) => setTimeMs(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Rank: #{rank} of {totalParticipants}</label>
              <input
                type="range"
                min="1"
                max={totalParticipants}
                value={rank}
                onChange={(e) => setRank(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Total Players: {totalParticipants}</label>
              <input
                type="range"
                min="10"
                max="1000"
                value={totalParticipants}
                onChange={(e) => setTotalParticipants(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Top Puzzle Elo: {highestPuzzleRating}</label>
              <input
                type="range"
                min="800"
                max="2500"
                step="50"
                value={highestPuzzleRating}
                onChange={(e) => setHighestPuzzleRating(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Puzzle Position: {fenIndex + 1}/5</label>
              <input
                type="range"
                min="0"
                max="4"
                value={fenIndex}
                onChange={(e) => setFenIndex(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-center gap-6 text-center">
            <div>
              <div className="text-[#58CC02] font-bold">{Math.round(((totalParticipants - rank) / totalParticipants) * 100)}%</div>
              <div className="text-gray-500 text-xs">beat</div>
            </div>
            <div>
              <div className="text-white font-bold">Top {100 - Math.round(((totalParticipants - rank) / totalParticipants) * 100)}%</div>
              <div className="text-gray-500 text-xs">global</div>
            </div>
          </div>
        </div>

        {/* All 5 Stories variants */}
        <div className="flex flex-wrap justify-center gap-6">
          {variants.map((v) => (
            <div key={v.id} className="flex flex-col items-center">
              <div ref={v.id === 'stories-2' ? stories2Ref : undefined}>
                <DailyChallengeReport
                  puzzlesSolved={puzzlesSolved}
                  totalPuzzles={totalPuzzles}
                  timeMs={timeMs}
                  mistakes={mistakes}
                  rank={rank}
                  totalParticipants={totalParticipants}
                  highestPuzzleRating={highestPuzzleRating}
                  highestPuzzleFen={highestPuzzleFen}
                  variant={v.id}
                />
              </div>
              <div className="mt-3 text-center">
                <div className="text-white font-bold text-sm">{v.name}</div>
                <div className="text-gray-500 text-xs">{v.desc}</div>
                {v.id === 'stories-2' && (
                  <button
                    onClick={saveStories2Image}
                    disabled={saving}
                    className="mt-2 px-4 py-2 bg-[#1CB0F6] text-white text-sm font-bold rounded-lg hover:bg-[#0A9FE0] transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Image'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
