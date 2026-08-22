'use client';

/**
 * /test/corner-icons — pick new icons for the Puzzle Boxing (red) and
 * Play Boxing (blue) corner buttons on the Chess Boxing home (RingHome).
 * Each option renders on the REAL corner button styling so you see it in place.
 */

import { useState } from 'react';
import Image from 'next/image';

type Opt = { id: string; label: string; render: (corner: 'red' | 'blue') => React.ReactNode };

const stroke = (d: React.ReactNode, sw = 2.2) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className="w-[58px] h-[58px] mx-auto drop-shadow-[0_3px_2px_rgba(0,0,0,0.35)]" aria-hidden>
    {d}
  </svg>
);

const img = (src: string, extra = '') => (
  <div className="mx-auto w-[72px] h-[66px] relative">
    <Image src={src} alt="" fill sizes="72px" unoptimized className={`object-contain drop-shadow-[0_3px_2px_rgba(0,0,0,0.35)] ${extra}`} />
  </div>
);

const glyph = (ch: string) => (
  <div className="mx-auto h-[58px] flex items-center justify-center text-[46px] leading-none font-black drop-shadow-[0_3px_2px_rgba(0,0,0,0.35)]" style={{ fontFamily: 'Georgia, serif' }}>
    {ch}
  </div>
);

/* ---- Puzzle Boxing (ranked) options ---- */
const PUZZLE: Opt[] = [
  { id: 'p0', label: 'p-gloves-hung', render: () => img('/test-assets/corner-icons/p-gloves-hung.png') },
  { id: 'p1', label: 'p-speedbag', render: () => img('/test-assets/corner-icons/p-speedbag.png') },
  { id: 'p2', label: 'p-heavybag', render: () => img('/test-assets/corner-icons/p-heavybag.png') },
  { id: 'p3', label: 'p-belt', render: () => img('/test-assets/corner-icons/p-belt.png') },
  { id: 'p4', label: 'p-bell', render: () => img('/test-assets/corner-icons/p-bell.png') },
  { id: 'p5', label: 'p-laurel-glove', render: () => img('/test-assets/corner-icons/p-laurel-glove.png') },
  { id: 'p6', label: 'p-star-glove', render: () => img('/test-assets/corner-icons/p-star-glove.png') },
  { id: 'p7', label: 'p-trophy', render: () => img('/test-assets/corner-icons/p-trophy.png') },
  { id: 'p8', label: 'p-rook-glove', render: () => img('/test-assets/corner-icons/p-rook-glove.png') },
  { id: 'p9', label: 'p-rounds-card', render: () => img('/test-assets/corner-icons/p-rounds-card.png') },
  { id: 'p10', label: 'p2-piece-glove', render: () => img('/test-assets/corner-icons/p2-piece-glove.png') },
  { id: 'p11', label: 'p2-piece-laurel', render: () => img('/test-assets/corner-icons/p2-piece-laurel.png') },
  { id: 'p12', label: 'p2-piece-bag', render: () => img('/test-assets/corner-icons/p2-piece-bag.png') },
  { id: 'p13', label: 'p2-piece-belt', render: () => img('/test-assets/corner-icons/p2-piece-belt.png') },
  { id: 'p14', label: 'p2-piece-fist', render: () => img('/test-assets/corner-icons/p2-piece-fist.png') },
  { id: 'p15', label: 'p2-piece-star', render: () => img('/test-assets/corner-icons/p2-piece-star.png') },
  { id: 'p16', label: 'p2-piece-bell', render: () => img('/test-assets/corner-icons/p2-piece-bell.png') },
  { id: 'p17', label: 'p2-piece-rook', render: () => img('/test-assets/corner-icons/p2-piece-rook.png') },
  { id: 'p18', label: 'p2-piece-trophy', render: () => img('/test-assets/corner-icons/p2-piece-trophy.png') },
  { id: 'p19', label: 'p2-piece-speedbag', render: () => img('/test-assets/corner-icons/p2-piece-speedbag.png') },
];

/* ---- Play Boxing (vs Rookie) options ---- */
const PLAY: Opt[] = [
  { id: 'b0', label: 'b-two-gloves', render: () => img('/test-assets/corner-icons/b-two-gloves.png') },
  { id: 'b1', label: 'b-ring', render: () => img('/test-assets/corner-icons/b-ring.png') },
  { id: 'b2', label: 'b-knight-glove', render: () => img('/test-assets/corner-icons/b-knight-glove.png') },
  { id: 'b3', label: 'b-stool-bucket', render: () => img('/test-assets/corner-icons/b-stool-bucket.png') },
  { id: 'b4', label: 'b-fighters', render: () => img('/test-assets/corner-icons/b-fighters.png') },
  { id: 'b5', label: 'b-mouthguard-towel', render: () => img('/test-assets/corner-icons/b-mouthguard-towel.png') },
  { id: 'b6', label: 'b-robot-glove', render: () => img('/test-assets/corner-icons/b-robot-glove.png') },
  { id: 'b7', label: 'b-crossed-gloves', render: () => img('/test-assets/corner-icons/b-crossed-gloves.png') },
  { id: 'b8', label: 'b-board-ring', render: () => img('/test-assets/corner-icons/b-board-ring.png') },
  { id: 'b9', label: 'b-king-knight', render: () => img('/test-assets/corner-icons/b-king-knight.png') },
  { id: 'b10', label: 'b2-knight-fist', render: () => img('/test-assets/corner-icons/b2-knight-fist.png') },
  { id: 'b11', label: 'b2-ropes-board', render: () => img('/test-assets/corner-icons/b2-ropes-board.png') },
  { id: 'b12', label: 'b2-bell-ring', render: () => img('/test-assets/corner-icons/b2-bell-ring.png') },
  { id: 'b13', label: 'b2-two-kings', render: () => img('/test-assets/corner-icons/b2-two-kings.png') },
  { id: 'b14', label: 'b2-corner-post', render: () => img('/test-assets/corner-icons/b2-corner-post.png') },
  { id: 'b15', label: 'b2-headguard', render: () => img('/test-assets/corner-icons/b2-headguard.png') },
  { id: 'b16', label: 'b2-stool-rook', render: () => img('/test-assets/corner-icons/b2-stool-rook.png') },
  { id: 'b17', label: 'b2-glove-pawn', render: () => img('/test-assets/corner-icons/b2-glove-pawn.png') },
  { id: 'b18', label: 'b2-ring-bird', render: () => img('/test-assets/corner-icons/b2-ring-bird.png') },
  { id: 'b19', label: 'b2-handwrap', render: () => img('/test-assets/corner-icons/b2-handwrap.png') },
];

function Corner({ corner, title, tag, icon }: { corner: 'red' | 'blue'; title: string; tag: string; icon: React.ReactNode }) {
  const red = corner === 'red';
  return (
    <div className={`rounded-2xl px-3 pt-4 pb-3.5 text-center text-white border-2 w-[150px] ${
      red ? 'bg-chess-red border-[#e86060] shadow-[0_5px_0_0_#CC3939]' : 'bg-chess-blue border-[#54c2f8] shadow-[0_5px_0_0_#0d7ec4]'
    }`}>
      {icon}
      <div className="mt-2 text-[19px] font-black uppercase leading-[0.95] tracking-tight">{title}<br />Boxing</div>
      <div className={`mt-2 inline-flex items-center rounded-full px-2.5 py-[3px] text-[9.5px] font-black uppercase tracking-[0.14em] ${red ? 'bg-[#a32b2b] text-[#ffd7a1]' : 'bg-[#116b9c] text-[#d8f1ff]'}`}>{tag}</div>
    </div>
  );
}

function Grid({ opts, corner, title, tag, picked, onPick }: { opts: Opt[]; corner: 'red' | 'blue'; title: string; tag: string; picked: string; onPick: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-4">
      {opts.map((o) => (
        <button key={o.id} onClick={() => onPick(o.id)} className={`rounded-2xl p-2 text-left transition ${picked === o.id ? 'ring-4 ring-[#f6c445]' : 'ring-1 ring-white/10'}`}>
          <Corner corner={corner} title={title} tag={tag} icon={o.render(corner)} />
          <div className="mt-2 text-[11px] text-white/70 w-[150px] leading-tight"><span className="text-white/40 mr-1">{o.id}</span>{o.label}</div>
        </button>
      ))}
    </div>
  );
}

export default function CornerIconsTest() {
  const [p, setP] = useState('p10');
  const [b, setB] = useState('b10');
  return (
    <div className="h-full overflow-auto bg-[#10162a] text-white p-6">
      <h1 className="text-2xl font-black">Corner icon picker</h1>
      <p className="text-white/60 text-sm mt-1">Tap an option to highlight it. Tell me the IDs (e.g. &quot;p3 + b1&quot;) and I&apos;ll wire them into RingHome.</p>

      <div className="mt-6 mb-6 flex gap-4 items-center">
        <Corner corner="red" title="Puzzle" tag="Ranked" icon={PUZZLE.find((o) => o.id === p)!.render('red')} />
        <Corner corner="blue" title="Play" tag="vs Rookie" icon={PLAY.find((o) => o.id === b)!.render('blue')} />
        <div className="text-sm text-white/70">Picked: <b className="text-[#f6c445]">{p} + {b}</b></div>
      </div>

      <h2 className="text-lg font-black mt-8 mb-3 text-[#ff7a7a]">Puzzle Boxing (red)</h2>
      <Grid opts={PUZZLE} corner="red" title="Puzzle" tag="Ranked" picked={p} onPick={setP} />

      <h2 className="text-lg font-black mt-10 mb-3 text-[#54c2f8]">Play Boxing (blue)</h2>
      <Grid opts={PLAY} corner="blue" title="Play" tag="vs Rookie" picked={b} onPick={setB} />
      <div className="h-16" />
    </div>
  );
}
