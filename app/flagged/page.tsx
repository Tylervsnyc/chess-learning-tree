'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FlaggedPuzzlesPage() {
  const router = useRouter();
  const [flaggedPuzzles, setFlaggedPuzzles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('flagged-puzzles');
      if (stored) {
        setFlaggedPuzzles(JSON.parse(stored));
      }
    } catch {
      // Ignore errors
    }
  }, []);

  const removeFlagged = (puzzleId: string) => {
    const updated = flaggedPuzzles.filter(id => id !== puzzleId);
    setFlaggedPuzzles(updated);
    localStorage.setItem('flagged-puzzles', JSON.stringify(updated));
  };

  const clearAll = () => {
    setFlaggedPuzzles([]);
    localStorage.setItem('flagged-puzzles', JSON.stringify([]));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(flaggedPuzzles.join('\n'));
  };

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white"
          >
            &larr; Back
          </button>
          <h1 className="text-2xl font-bold">Flagged Puzzles</h1>
          <div className="w-16" />
        </div>

        {flaggedPuzzles.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No puzzles flagged yet. Click the flag icon on any puzzle to mark it.
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-[#1A2C35] text-white rounded-lg hover:bg-[#2A3C45] transition-colors"
              >
                Copy All IDs
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2">
              {flaggedPuzzles.map(puzzleId => (
                <div
                  key={puzzleId}
                  className="flex items-center justify-between p-3 bg-[#1A2C35] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <code className="text-gray-300">{puzzleId}</code>
                    <a
                      href={`https://lichess.org/training/${puzzleId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View on Lichess
                    </a>
                  </div>
                  <button
                    onClick={() => removeFlagged(puzzleId)}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#1A2C35] rounded-lg">
              <h3 className="font-semibold mb-2">All Flagged IDs:</h3>
              <pre className="text-sm text-gray-400 whitespace-pre-wrap break-all">
                {flaggedPuzzles.join(', ')}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
