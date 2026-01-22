'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Platform = 'lichess' | 'chesscom' | null;

interface RatingResult {
  username: string;
  platform: string;
  puzzleRating: number | null;
  rapidRating: number | null;
  blitzRating: number | null;
  bulletRating: number | null;
}

export default function ConnectAccountPage() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RatingResult | null>(null);

  const handleFetchRating = async () => {
    if (!selectedPlatform || !username.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/fetch-rating?platform=${selectedPlatform}&username=${encodeURIComponent(username.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch rating');
        setLoading(false);
        return;
      }

      setResult(data);
    } catch {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const handleContinue = () => {
    if (!result) return;

    // Use puzzle rating if available, otherwise use rapid, then blitz, then bullet
    const elo = result.puzzleRating || result.rapidRating || result.blitzRating || result.bulletRating || 800;

    // Map ELO to level
    const levelIndex = elo < 800 ? 0 :
                       elo < 1000 ? 1 :
                       elo < 1200 ? 2 :
                       elo < 1400 ? 3 :
                       elo < 1600 ? 4 : 5;

    const levelNames = ['beginner', 'casual', 'club', 'tournament', 'advanced', 'expert'];
    const levelName = levelNames[levelIndex];

    const params = new URLSearchParams({
      elo: elo.toString(),
      level: levelName,
      source: result.platform,
      username: result.username,
    });

    router.push(`/onboarding/complete?${params.toString()}`);
  };

  const handleBack = () => {
    if (result) {
      setResult(null);
    } else if (selectedPlatform) {
      setSelectedPlatform(null);
      setUsername('');
      setError(null);
    } else {
      router.push('/onboarding');
    }
  };

  // Results screen
  if (result) {
    const displayRating = result.puzzleRating || result.rapidRating || result.blitzRating || result.bulletRating;

    return (
      <div className="min-h-screen bg-[#131F24] flex flex-col">
        <div className="h-1 w-full bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]" />

        <div className="flex-1 flex flex-col items-center justify-center px-5 -mt-16">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🎉</div>
            <h1 className="text-xl font-black text-white mb-1">
              Found you!
            </h1>
            <p className="text-gray-400 text-sm">
              Welcome, {result.username}
            </p>
          </div>

          <div className="w-full max-w-[320px] space-y-4">
            {/* Rating display */}
            <div className="bg-[#1A2C35] rounded-2xl p-6 text-center">
              <div className="text-gray-400 text-sm mb-1">
                {result.puzzleRating ? 'Puzzle Rating' : 'Playing Rating'}
              </div>
              <div className="text-4xl font-black text-[#1CB0F6] mb-2">
                {displayRating || 'Unrated'}
              </div>
              <div className="text-gray-500 text-xs">
                from {result.platform === 'lichess' ? 'Lichess' : 'Chess.com'}
              </div>

              {/* Show other ratings if available */}
              {(result.rapidRating || result.blitzRating) && result.puzzleRating && (
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-center gap-6 text-sm">
                  {result.rapidRating && (
                    <div>
                      <div className="text-gray-500">Rapid</div>
                      <div className="text-white font-bold">{result.rapidRating}</div>
                    </div>
                  )}
                  {result.blitzRating && (
                    <div>
                      <div className="text-gray-500">Blitz</div>
                      <div className="text-white font-bold">{result.blitzRating}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Continue button */}
            <button
              onClick={handleContinue}
              className="block w-full p-4 rounded-2xl transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] text-center font-bold text-white text-lg"
              style={{ backgroundColor: '#58CC02' }}
            >
              Start Learning
            </button>

            {/* Back button */}
            <button
              onClick={handleBack}
              className="w-full text-gray-400 hover:text-white text-sm py-2"
            >
              Try a different account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Username input screen
  if (selectedPlatform) {
    const platformName = selectedPlatform === 'lichess' ? 'Lichess' : 'Chess.com';
    const placeholder = selectedPlatform === 'lichess' ? 'e.g. DrNykterstein' : 'e.g. MagnusCarlsen';

    return (
      <div className="min-h-screen bg-[#131F24] flex flex-col">
        <div className="h-1 w-full bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]" />

        <div className="flex-1 flex flex-col items-center justify-center px-5 -mt-16">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">
              {selectedPlatform === 'lichess' ? '🐴' : '♟️'}
            </div>
            <h1 className="text-xl font-black text-white mb-1">
              Enter your {platformName} username
            </h1>
            <p className="text-gray-400 text-sm">
              We&apos;ll fetch your puzzle rating
            </p>
          </div>

          <div className="w-full max-w-[320px] space-y-4">
            {/* Username input */}
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchRating()}
                placeholder={placeholder}
                autoFocus
                className="w-full px-4 py-4 bg-[#1A2C35] border border-gray-600 rounded-xl text-white text-center text-lg placeholder-gray-500 focus:outline-none focus:border-[#1CB0F6]"
              />
              {error && (
                <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
              )}
            </div>

            {/* Fetch button */}
            <button
              onClick={handleFetchRating}
              disabled={loading || !username.trim()}
              className="block w-full p-4 rounded-2xl transition-all active:translate-y-[2px] shadow-[0_4px_0_#0d7ec4] text-center font-bold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#1CB0F6' }}
            >
              {loading ? 'Looking you up...' : 'Find My Rating'}
            </button>

            {/* Back button */}
            <button
              onClick={handleBack}
              className="w-full text-gray-400 hover:text-white text-sm py-2"
            >
              ← Choose a different platform
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Platform selection screen
  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col">
      <div className="h-1 w-full bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]" />

      <div className="flex-1 flex flex-col items-center justify-center px-5 -mt-16">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔗</div>
          <h1 className="text-xl font-black text-white mb-1">
            Where do you play?
          </h1>
          <p className="text-gray-400 text-sm">
            We&apos;ll import your rating to start you at the right level
          </p>
        </div>

        <div className="w-full max-w-[320px] space-y-4">
          {/* Lichess */}
          <button
            onClick={() => setSelectedPlatform('lichess')}
            className="block w-full p-4 rounded-2xl transition-all active:translate-y-[2px] bg-[#1A2C35] border-2 border-gray-600 hover:border-white/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <svg viewBox="0 0 50 50" className="w-8 h-8">
                  <path fill="#000" d="M36.7 8.3c-1.1-.8-2.6-.6-3.4.5l-5.8 8.1c-.3.4-.7.5-1.1.3l-5.4-2.7c-.9-.5-2.1-.2-2.6.7-.5.9-.2 2.1.7 2.6l6.8 3.4c.7.3 1.5.2 2-.4l6.3-8.8c.8-1.2.6-2.7-.5-3.7zM25 2C12.3 2 2 12.3 2 25s10.3 23 23 23 23-10.3 23-23S37.7 2 25 2zm0 42C14.5 44 6 35.5 6 25S14.5 6 25 6s19 8.5 19 19-8.5 19-19 19z"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-white text-lg">Lichess</div>
                <div className="text-gray-400 text-sm">lichess.org</div>
              </div>
              <div className="text-gray-400">→</div>
            </div>
          </button>

          {/* Chess.com */}
          <button
            onClick={() => setSelectedPlatform('chesscom')}
            className="block w-full p-4 rounded-2xl transition-all active:translate-y-[2px] bg-[#1A2C35] border-2 border-gray-600 hover:border-white/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#769656] flex items-center justify-center">
                <span className="text-2xl">♟</span>
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-white text-lg">Chess.com</div>
                <div className="text-gray-400 text-sm">chess.com</div>
              </div>
              <div className="text-gray-400">→</div>
            </div>
          </button>

          {/* Back button */}
          <button
            onClick={handleBack}
            className="w-full text-gray-400 hover:text-white text-sm py-2"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
