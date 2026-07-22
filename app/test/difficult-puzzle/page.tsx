'use client';

/**
 * Test page: preview the DIFFICULT daily-puzzle reel variant.
 * Shows the rendered MP4 (red "Difficult Puzzle" pill throughout) + the
 * generated caption with the "guess in the comments" ask.
 */
export default function DifficultPuzzleTestPage() {
  const caption = `DIFFICULT PUZZLE. Most people miss it — can you?

Drop your guess in the comments BEFORE you watch the solution 👇

Rating: 2096 ⭐
"Step aside or lose what's behind you."

Play daily puzzles free → chesspath.app

#chess #chesspuzzle #chesspath #dailypuzzle #chessmoves #learnchess`;

  return (
    <div className="min-h-full w-full overflow-auto bg-[#EBF0F5] px-4 py-8">
      {/* Siren keyframes — mirrors the frame-driven glow baked into the reel */}
      <style>{`
        @keyframes siren {
          0%   { box-shadow: 0 0 20px rgba(255,75,75,0.65), 0 0 24px rgba(56,132,255,0.18); }
          50%  { box-shadow: 0 0 20px rgba(255,75,75,0.18), 0 0 24px rgba(56,132,255,0.65); }
          100% { box-shadow: 0 0 20px rgba(255,75,75,0.65), 0 0 24px rgba(56,132,255,0.18); }
        }
      `}</style>
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <header className="text-center">
          <span
            className="inline-block rounded-full px-6 py-2 text-sm font-bold uppercase tracking-widest text-white"
            style={{
              background: 'linear-gradient(135deg, #FF4B4B 0%, #d63333 100%)',
              animation: 'siren 0.8s ease-in-out infinite',
            }}
          >
            Difficult Puzzle
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-800">
            Thu / Sat DIFFICULT variant
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Harder puzzle (rating ≥ 1700), red pill, same solution reveal.
          </p>
        </header>

        {/* The rendered reel */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <video
            src="/test/difficult-daily.mp4"
            controls
            autoPlay
            loop
            muted
            playsInline
            className="w-full"
          />
        </div>

        {/* The generated caption */}
        <div className="rounded-2xl bg-white p-5 shadow-lg">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Generated caption (emojis stripped on IG post)
          </p>
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-slate-700">
            {caption}
          </pre>
        </div>

        <p className="text-center text-xs text-slate-400">
          Normal days keep the green “Daily Puzzle” pill and no “guess” line.
        </p>
      </div>
    </div>
  );
}
