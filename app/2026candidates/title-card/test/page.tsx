'use client';

import { useState } from 'react';
import Image from 'next/image';
import { OPEN_PLAYERS, WOMENS_PLAYERS, getPlayer } from '@/data/2026candidates/players';
import { BreathingRook } from '@/components/ui/BreathingRook';

/**
 * Test page — static final title card layout.
 *
 * Layout (960px):
 *   Top bar: chesspath.app + FIDE left, Round # right
 *   "Re-Cap in 59 Seconds" title overlaid on white player photo
 *   White photo: ~48% with name overlaid at bottom
 *   Thin bolt separator with rook on the line
 *   Black photo: ~48% with name overlaid at top
 *   Bottom bar: location + live
 */
export default function TitleCardTestPage() {
  const [whiteId, setWhiteId] = useState('caruana');
  const [blackId, setBlackId] = useState('nakamura');
  const [round, setRound] = useState(1);

  const white = getPlayer(whiteId);
  const black = getPlayer(blackId);
  const allPlayers = [...OPEN_PLAYERS, ...WOMENS_PLAYERS];

  if (!white || !black) return null;

  return (
    <div className="flex min-h-dvh flex-col items-center bg-neutral-900 p-8 overflow-auto">
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-neutral-400">
          White:
          <select value={whiteId} onChange={(e) => setWhiteId(e.target.value)} className="rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-200">
            {allPlayers.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-400">
          Black:
          <select value={blackId} onChange={(e) => setBlackId(e.target.value)} className="rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-200">
            {allPlayers.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-400">
          Round:
          <input type="number" value={round} onChange={(e) => setRound(parseInt(e.target.value) || 1)} className="w-16 rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-200" min={1} max={14} />
        </label>
      </div>

      {/* ── Card 540x960 ── */}
      <div className="relative overflow-hidden" style={{ width: 540, height: 960 }}>

        {/* Background */}
        <div className="absolute inset-0" style={{ background: '#1a2228' }} />

        {/* ═══ WHITE PLAYER PHOTO — top half ═══ */}
        <div className="absolute inset-x-0 top-0 z-10" style={{ height: 480 }}>
          <Image
            src={white.photo}
            alt={white.name}
            fill
            className="object-cover"
            style={{ objectPosition: 'center 20%' }}
            sizes="540px"
            priority
          />
          {/* Bottom fade */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(180deg, rgba(26,34,40,0.05) 0%, transparent 15%, transparent 50%, rgba(26,34,40,0.85) 85%, rgba(26,34,40,1) 100%),
                linear-gradient(90deg, rgba(26,34,40,0.3) 0%, transparent 15%)
              `,
            }}
          />

          {/* ── Top bar: branding left, round right ── */}
          <div className="absolute top-0 left-0 right-0 z-20 px-5 pt-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <BreathingRook size="md" animate animation="breathe" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-chess-green" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                      chesspath.app
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                      FIDE Candidates 2026
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/35" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                  Round
                </div>
                <div
                  className="text-[44px] font-black leading-[0.8] tabular-nums"
                  style={{ color: '#FFD700', textShadow: '0 2px 16px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.15)' }}
                >
                  {round}
                </div>
              </div>
            </div>
          </div>

          {/* ── "Re-Cap in 59 Seconds" — overlaid on photo ── */}
          <div className="absolute top-[100px] left-5 z-20">
            <div
              className="text-[34px] font-black leading-[1.05] text-white"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.6), 0 4px 32px rgba(0,0,0,0.3)' }}
            >
              Re-Cap in<br />59 Seconds
            </div>
          </div>

          {/* ── White player name — bottom of photo ── */}
          <div className="absolute bottom-4 left-5 z-20">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#e8e8e8', boxShadow: '0 0 6px rgba(255,255,255,0.3)' }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50">White</span>
              <span className="text-[9px] font-black tabular-nums text-chess-green">{white.rating}</span>
            </div>
            <div className="text-[48px] font-black leading-[0.85] tracking-tighter text-white" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
              {white.name.split(' ').pop()}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-[12px] font-bold text-white/40">{white.name.split(' ').slice(0, -1).join(' ')}</span>
              <img src={`https://flagcdn.com/w40/${white.countryCode.toLowerCase()}.png`} alt={white.country} width={16} height={12} className="rounded-[2px] opacity-60" />
            </div>
          </div>
        </div>

        {/* ═══ BLACK PLAYER PHOTO — bottom half ═══ */}
        <div className="absolute inset-x-0 bottom-0 z-10" style={{ height: 480 }}>
          <Image
            src={black.photo}
            alt={black.name}
            fill
            className="object-cover"
            style={{ objectPosition: 'center 20%' }}
            sizes="540px"
            priority
          />
          {/* Top fade */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(0deg, rgba(26,34,40,0.05) 0%, transparent 15%, transparent 50%, rgba(26,34,40,0.85) 85%, rgba(26,34,40,1) 100%),
                linear-gradient(270deg, rgba(26,34,40,0.3) 0%, transparent 15%)
              `,
            }}
          />

          {/* ── Black player name — top of photo ── */}
          <div className="absolute top-4 right-5 z-20 text-right">
            <div className="flex items-center justify-end gap-2 mb-0.5">
              <span className="text-[9px] font-black tabular-nums text-chess-green">{black.rating}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50">Black</span>
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#2A3C45', border: '1.5px solid rgba(255,255,255,0.2)' }} />
            </div>
            <div className="text-[48px] font-black leading-[0.85] tracking-tighter text-white" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
              {black.name.split(' ').pop()}
            </div>
            <div className="mt-0.5 flex items-center justify-end gap-2">
              <img src={`https://flagcdn.com/w40/${black.countryCode.toLowerCase()}.png`} alt={black.country} width={16} height={12} className="rounded-[2px] opacity-60" />
              <span className="text-[12px] font-bold text-white/40">{black.name.split(' ').slice(0, -1).join(' ')}</span>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-4">
            <div className="flex items-end justify-between">
              <div className="text-[9px] font-medium text-white/25" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Toronto, Canada</div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-chess-red animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/35" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ BOLT SEPARATOR — thin horizontal band at the seam ═══ */}
        <div className="absolute inset-x-0 z-30 pointer-events-none" style={{ top: 460, height: 40 }}>
          <svg width="540" height="40" viewBox="0 0 540 40" fill="none" className="absolute inset-0">
            {/* Wide glow */}
            <line x1="0" y1="20" x2="540" y2="20" stroke="#FFD700" strokeWidth="40" opacity="0.06" />
            {/* Medium glow */}
            <line x1="0" y1="20" x2="540" y2="20" stroke="#FFD700" strokeWidth="12" opacity="0.12" />
            {/* Bright core */}
            <line x1="0" y1="20" x2="540" y2="20" stroke="url(#bolt-sep)" strokeWidth="3" />
            {/* Hot center */}
            <line x1="0" y1="20" x2="540" y2="20" stroke="white" strokeWidth="1" opacity="0.5" />
            <defs>
              <linearGradient id="bolt-sep" x1="0" y1="20" x2="540" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF6B00" /><stop offset="0.3" stopColor="#FFD700" /><stop offset="0.7" stopColor="#FFD700" /><stop offset="1" stopColor="#FF6B00" />
              </linearGradient>
            </defs>
          </svg>

          {/* Rook on the bolt line */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <BreathingRook size="lg" animate animation="celebrate" />
          </div>
        </div>
      </div>
    </div>
  );
}
