'use client';

/**
 * /test/play-gym — the SHIPPING gym backdrop, in a phone frame, so the
 * hittable bags can be tested without booting the Chess Boxing shell.
 *
 * This page renders the REAL <GymBackdrop /> (components/chessboxing) — it
 * does not own a copy of the bags. The old 5-variant decor picker lived here
 * until the Blue Corner winner shipped; its duplicated bag physics went stale
 * the moment the real ones gained impact FX + sound, so it is gone. If the
 * bags change, they change in one place.
 */

import { useState } from 'react';
import { PlayPageRookie } from '@/components/play/PlayPageRookie';
import { GymBackdrop } from '@/components/chessboxing/GymBackdrop';

export default function PlayGymTest() {
  return (
    <div className="h-full overflow-auto bg-[#0b101e] text-white p-6">
      <h1 className="text-2xl font-black">/play gym — hittable bags</h1>
      <p className="text-white/60 text-sm mt-1 max-w-xl">
        The live <code className="text-[#f6c445]">GymBackdrop</code> from the Chess Boxing shell. Punch the
        speed bag (left) and the heavy bag (right) — squash, dust burst, chain rattle, haptics, and sound.
        Off-centre hits land harder and push the bag away from your finger.
      </p>

      <div className="mt-6 flex flex-wrap gap-8">
        {/* phone */}
        <Frame label="Phone — 390x720" w={390} h={720} />
        {/* wide, to check the bags still frame the edges */}
        <Frame label="Tablet — 620x720" w={620} h={720} />
      </div>
      <div className="h-12" />
    </div>
  );
}

function Frame({ label, w, h }: { label: string; w: number; h: number }) {
  const [quip, setQuip] = useState('');
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative rounded-[28px] overflow-hidden border-4 border-white/15"
        style={{ width: w, height: h, background: '#10162a' }}
      >
        <GymBackdrop />
        <div className="relative z-10 h-full">
          <Setup quip={quip} onQuip={setQuip} />
        </div>
      </div>
      <div className="text-[12px] text-white/50">{label}</div>
    </div>
  );
}

/** A stand-in for the /play setup content, so the bags are tested in context. */
function Setup({ quip, onQuip }: { quip: string; onQuip: (q: string) => void }) {
  return (
    <div className="absolute inset-x-0 top-[215px] flex flex-col items-center px-6 pointer-events-none">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
        style={{ background: 'linear-gradient(135deg, rgba(88,204,2,0.22), rgba(88,204,2,0.10))', border: '1px solid rgba(88,204,2,0.45)' }}
      >
        <span className="text-chess-green font-black text-sm">LV. 3</span>
        <span className="font-semibold text-xs text-white/50">&middot;</span>
        <span className="font-semibold text-xs text-white/70">Scrapper</span>
      </div>
      <div className="mt-2 pointer-events-auto"><PlayPageRookie onQuip={onQuip} /></div>
      <div className="relative w-full max-w-[330px] h-[72px] mt-2">
        <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#f6efe0] rotate-45 rounded-[2px]" />
        <div className="relative rounded-2xl px-5 py-3 h-full bg-[#f6efe0] flex items-center justify-center">
          <p className="text-chess-text text-[14px] leading-relaxed font-medium text-center line-clamp-2">
            {quip || "Gloves on. Let's go."}
          </p>
        </div>
      </div>
      <div className="mt-4 w-full max-w-[330px] h-[52px] rounded-2xl bg-chess-red border-2 border-[#e86060] shadow-[0_5px_0_0_#CC3939] flex items-center justify-center text-white font-black uppercase tracking-wide">
        Fight Rookie
      </div>
    </div>
  );
}
