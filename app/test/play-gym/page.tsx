'use client';

/**
 * /test/play-gym — the REAL /play setup screen inside the Chess Boxing shell,
 * in phone + tablet frames, so the hittable bags can be tested without booting
 * the native app.
 *
 * This page owns NOTHING. It iframes `/play?boxapp=frame` — the exact screen that
 * ships. It used to render <GymBackdrop /> under a hand-written stand-in for
 * the setup content, and that stand-in had `pointer-events-none` on its
 * overlay while the real page did not. So the bags were punchable here and
 * dead in the app, and this page reported "working" the whole time. A test
 * page that renders a copy of the thing is a test page that can lie.
 *
 * It uses ?boxapp=frame, NOT ?boxapp=1. The sticky flag writes cp:boxapp into
 * sessionStorage, which a tab shares with its same-origin iframes — so an
 * earlier version of this page left the whole tab in shell mode and plain
 * /play rendered the boxing gym until the tab was closed. `frame` previews
 * this document only and writes nothing.
 *
 * Test page: container MUST be overflow-auto (body is overflow:hidden globally).
 */

export default function PlayGymTest() {
  return (
    <div className="h-full overflow-auto bg-[#0b101e] text-white p-6">
      <h1 className="text-2xl font-black">/play gym — hittable bags</h1>
      <p className="text-white/60 text-sm mt-1 max-w-2xl">
        The live <code className="text-[#f6c445]">/play?boxapp=frame</code> setup screen, iframed — not a copy.
        Punch the speed bag (left) and the heavy bag (right): squash, dust burst, chain rattle, haptics and
        sound. Off-centre hits land harder and push the bag away from your finger. Everything except Rookie,
        the colour buttons and Let&apos;s Play passes taps through to the bags.
      </p>

      <div className="mt-6 flex flex-wrap gap-8">
        <Frame label="Phone — 393x780" w={393} h={780} />
        <Frame label="Tablet — 620x780" w={620} h={780} />
      </div>
      <div className="h-12" />
    </div>
  );
}

function Frame({ label, w, h }: { label: string; w: number; h: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative rounded-[28px] overflow-hidden border-4 border-white/15"
        style={{ width: w, height: h, background: '#10162a' }}
      >
        <iframe src="/play?boxapp=frame" title={label} className="w-full h-full border-0" />
      </div>
      <div className="text-[12px] text-white/50">{label}</div>
    </div>
  );
}
