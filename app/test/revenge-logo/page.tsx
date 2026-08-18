'use client';

import { RevengeMarkSvg, RevengeIcon, RookiesRevengeLogo, RookiesRevengeLogoStacked, REVENGE_RED } from '@/components/run/RookiesRevengeLogo';

/** /test/revenge-logo — Rookie's Revenge brand sheet. Everything derives from RevengeMarkSvg. */
export default function RevengeLogoPage() {
  return (
    <div className="h-full overflow-auto bg-chess-page p-6 pb-24">
      <div className="mx-auto max-w-5xl space-y-12">
        <header>
          <h1 className="text-3xl font-black text-chess-text">Rookie&rsquo;s Revenge — brand sheet</h1>
          <p className="text-chess-text-muted mt-1">One mark. Straight rook, red target. Everything below is the same SVG.</p>
          <p className="mt-3 text-lg font-bold text-chess-text">Tagline: &ldquo;The game ended. And Rookie took that personally.&rdquo;</p>
        </header>

        <section>
          <h2 className="text-xl font-bold text-chess-text mb-4">The mark</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-wrap items-end justify-center gap-10">
            <RevengeMarkSvg size={260} />
            <RevengeMarkSvg size={120} />
            <RevengeMarkSvg size={64} />
            <RevengeMarkSvg size={32} />
            <RevengeMarkSvg size={16} />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-chess-text mb-4">App icon (iOS radius) — 180 / 120 / 60 / 40</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-wrap items-end gap-8">
            {[180, 120, 60, 40].map((s) => <RevengeIcon key={s} size={s} className="shadow-md" />)}
            <div className="w-px self-stretch bg-gray-200" />
            <RevengeIcon size={120} bg="#DDF4FF" className="shadow-md" />
            <RevengeIcon size={120} bg={REVENGE_RED} ringColor="#fff" className="shadow-md" />
            <RevengeIcon size={120} bg="#1f2937" ringColor="#FF5252" className="shadow-md" />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-chess-text mb-4">Lockups</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm flex items-center justify-center"><RookiesRevengeLogo scale={0.8} /></div>
            <div className="rounded-2xl p-8 shadow-sm flex items-center justify-center" style={{ background: '#1f2937' }}><RookiesRevengeLogo dark scale={0.8} /></div>
            <div className="bg-white rounded-2xl p-8 shadow-sm flex items-center justify-center"><RookiesRevengeLogoStacked /></div>
            <div className="bg-white rounded-2xl p-8 shadow-sm flex items-center justify-center"><RookiesRevengeLogo scale={0.45} /></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-chess-text mb-4">In context — nav header + phone splash</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100">
                <RookiesRevengeLogo scale={0.28} />
                <div className="text-sm font-bold text-chess-text-muted">Day 12</div>
              </div>
              <div className="h-40 bg-chess-page" />
            </div>
            <div className="flex justify-center">
              <div className="rounded-[36px] shadow-lg bg-chess-page flex flex-col items-center justify-center" style={{ width: 240, height: 480, border: '8px solid #111' }}>
                <RookiesRevengeLogoStacked scale={0.7} />
                <div className="mt-8 text-xs font-bold text-chess-text-muted text-center px-6">The game ended.<br />And Rookie took that personally.</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
