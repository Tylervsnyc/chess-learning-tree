'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DailyChallengeReport } from '@/components/daily-challenge/DailyChallengeReport';

// Sample puzzle position
const SAMPLE_FEN = 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4';

export default function TestGuestDailyPage() {
  const router = useRouter();
  const [puzzlesSolved] = useState(8);
  const [totalPuzzles] = useState(20);
  const [timeMs] = useState(185000);
  const [mistakes] = useState(2);
  const [highestPuzzleRating] = useState(1450);

  // Format time display
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0D1A1F] py-8 px-4">
      <div className="max-w-sm mx-auto">
        <h1 className="text-white text-lg font-bold mb-2 text-center">Guest Finished Screen</h1>
        <p className="text-gray-500 text-sm text-center mb-6">This is what non-logged-in users see after completing the daily challenge</p>

        {/* Shareable Results Card */}
        <div className="mb-3 flex justify-center">
          <DailyChallengeReport
            puzzlesSolved={puzzlesSolved}
            totalPuzzles={totalPuzzles}
            timeMs={timeMs}
            mistakes={mistakes}
            highestPuzzleRating={highestPuzzleRating}
            highestPuzzleFen={SAMPLE_FEN}
            variant="stories-2"
          />
        </div>

        {/* Share Button - same as logged in users */}
        <button
          onClick={async () => {
            const shareText = [
              `Chess Path Daily Challenge`,
              `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
              ``,
              `${puzzlesSolved} puzzles in ${formatTime(timeMs)}`,
              ``,
              `chesspath.com/daily-challenge`,
            ].filter(Boolean).join('\n');

            if (navigator.share) {
              try {
                await navigator.share({ text: shareText });
              } catch {
                await navigator.clipboard.writeText(shareText);
              }
            } else {
              await navigator.clipboard.writeText(shareText);
              alert('Results copied!');
            }
          }}
          className="w-full py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-[0.98] mb-4"
          style={{ background: 'linear-gradient(135deg, #1CB0F6, #0A9FE0)', boxShadow: '0 4px 0 #0077A3' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Results
        </button>

        {/* Login CTA Section - replaces leaderboard for guests */}
        <div className="bg-[#131F24] rounded-xl p-5 mb-4">
          <div className="text-center">
            {/* Trophy/leaderboard icon */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF9600]/20 to-[#FF6B6B]/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-[#FF9600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>

            <h2 className="text-white font-bold text-lg mb-2">
              How did you stack up?
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Log in to see how you compare to other players and track your daily streak
            </p>

            <button
              onClick={() => router.push('/auth/signup')}
              className="w-full py-3 rounded-xl text-white font-bold transition-transform active:scale-[0.98] mb-2"
              style={{ background: 'linear-gradient(135deg, #FF9600, #FF6B6B)', boxShadow: '0 4px 0 #CC6600' }}
            >
              Create Free Account
            </button>

            <button
              onClick={() => router.push('/auth/login')}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Already have an account? Log in
            </button>
          </div>
        </div>

        {/* Back to Path button - no replay option for guests */}
        <button
          onClick={() => router.push('/learn')}
          className="w-full py-3 rounded-xl text-white font-bold transition-transform active:scale-[0.98] shadow-[0_4px_0_#3d8c01]"
          style={{ backgroundColor: '#58CC02' }}
        >
          Start Learning →
        </button>

        <div className="mt-3 text-gray-500 text-sm text-center">
          New challenge drops at midnight!
        </div>
      </div>
    </div>
  );
}
