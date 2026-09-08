'use client';

/**
 * Test page — the App Store end card on the daily puzzle reel.
 * Left: the 3s end card alone. Right: the whole reel, so you can see it land.
 */
export default function PuzzleEndCardTestPage() {
  return (
    <div className="h-full overflow-auto bg-[#EBF0F5] p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-[#2A3C45]">Daily puzzle — App Store end card</h1>
        <p className="mt-2 text-sm text-[#2A3C45]/70">
          New Stage 5, 5s, plays after the celebrate card. The
          &ldquo;Download on the App Store&rdquo; badge now also sits in the footer of
          every stage, next to chesspath.app.
        </p>

        <figure className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
          <figcaption className="mb-3 text-sm font-bold text-[#2A3C45]">
            App announcement post — 9s. Slower entrances, pop on each icon, /play music.
          </figcaption>
          <video
            src="/test-assets/endcard/apps-launch.mp4"
            controls
            loop
            playsInline
            className="mx-auto w-full max-w-sm rounded-xl"
          />
        </figure>

        <h2 className="mt-10 text-lg font-bold text-[#2A3C45]">Daily puzzle reel</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          <figure className="rounded-2xl bg-white p-4 shadow-sm">
            <figcaption className="mb-3 text-sm font-bold text-[#2A3C45]">
              End card only (5s, loops)
            </figcaption>
            <video
              src="/test-assets/endcard/endcard.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-xl"
            />
          </figure>

          <figure className="rounded-2xl bg-white p-4 shadow-sm">
            <figcaption className="mb-3 text-sm font-bold text-[#2A3C45]">
              Full reel (20s) — end card at the end
            </figcaption>
            <video
              src="/test-assets/endcard/full.mp4"
              controls
              loop
              muted
              playsInline
              className="w-full rounded-xl"
            />
          </figure>
        </div>
      </div>
    </div>
  );
}
