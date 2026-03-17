'use client';

import { useState } from 'react';
import Image from 'next/image';
import { OPEN_PLAYERS, WOMENS_PLAYERS, getPlayer } from '@/data/2026candidates/players';
import type { Player } from '@/data/2026candidates/types';
import { RookTornado } from '@/components/2026candidates/RookTornado';
import { BreathingRook } from '@/components/ui/BreathingRook';

/**
 * Title card — Candidates 2026 matchup card.
 * Dark cinematic sports broadcast style.
 *
 * Layout: Two players face off across a diagonal lightning bolt tear.
 * Photos dominate. Names are massive. The rook sits in the bolt.
 */
export default function TitleCardPage() {
  const [whiteId, setWhiteId] = useState('caruana');
  const [blackId, setBlackId] = useState('nakamura');
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<'intro' | 'card'>('intro');

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
          <select
            value={whiteId}
            onChange={(e) => setWhiteId(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-200"
          >
            {allPlayers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-400">
          Black:
          <select
            value={blackId}
            onChange={(e) => setBlackId(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-200"
          >
            {allPlayers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-400">
          Round:
          <input
            type="number"
            value={round}
            onChange={(e) => setRound(parseInt(e.target.value) || 1)}
            className="w-16 rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-200"
            min={1}
            max={14}
          />
        </label>
        <button
          onClick={() => setPhase('intro')}
          className="rounded-xl bg-chess-green px-4 py-1.5 text-xs font-bold text-white active:scale-95 transition-transform"
        >
          Replay
        </button>
      </div>

      {/* ── The Title Card (9:16 / 540x960) ── */}
      <div
        className="relative overflow-hidden"
        style={{ width: 540, height: 960 }}
      >
        <style>{CARD_KEYFRAMES}</style>

        {/* ── INTRO: Rook Tornado on dark ── */}
        {phase === 'intro' && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, #1a2228 0%, #1e2830 50%, #1a2228 100%)',
              animation: 'introFadeOut 0.5s cubic-bezier(0.7, 0, 0.84, 0) 2.8s both',
            }}
          >
            <RookTornado
              onComplete={() => setPhase('card')}
              duration={3200}
              blockSize={16}
              spread={0.7}
            />
            <div
              className="mt-4 text-[10px] font-black tracking-[0.4em]"
              style={{
                color: '#58CC02',
                animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 2.2s both',
              }}
            >
              CHESSPATH.APP
            </div>
          </div>
        )}

        {/* ── MATCHUP CARD ── */}
        <div
          className="absolute inset-0"
          style={{
            opacity: phase === 'intro' ? 0 : 1,
            transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* ── Warm dark background — not pure black ── */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(170deg, #1a2228 0%, #1e2830 40%, #1a2228 100%)',
            }}
          />

          {/* ── Subtle noise texture ── */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* ═══ WHITE PLAYER — top half ═══ */}
          <div
            className="absolute inset-x-0 top-0 z-10"
            style={{
              height: '52%',
              clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)',
              ...(phase === 'card' ? { animation: 'photoSlamLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0s both' } : {}),
            }}
          >
            {/* Photo — object-[center_20%] to keep full face visible */}
            <div className="absolute inset-0">
              <Image
                src={white.photo}
                alt={white.name}
                fill
                className="object-cover"
                style={{ objectPosition: 'center 20%' }}
                sizes="540px"
                priority
              />
            </div>

            {/* Cinematic gradient overlays */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(180deg, rgba(26,34,40,0.3) 0%, transparent 30%, transparent 50%, rgba(26,34,40,0.95) 100%),
                  linear-gradient(90deg, rgba(26,34,40,0.5) 0%, transparent 30%)
                `,
              }}
            />

            {/* White player name — bottom-left, inside the photo */}
            <div
              className="absolute bottom-16 left-5 z-10"
              style={phase === 'card' ? { animation: 'nameSlideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both' } : {}}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: '#e8e8e8',
                    boxShadow: '0 0 6px rgba(255,255,255,0.3)',
                  }}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
                  White
                </span>
                <span className="text-[10px] font-black tabular-nums text-chess-green">
                  {white.rating}
                </span>
              </div>
              <div
                className="text-[52px] font-black leading-[0.85] tracking-tighter text-white"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
              >
                {white.name.split(' ').pop()}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[14px] font-bold text-white/40">
                  {white.name.split(' ').slice(0, -1).join(' ')}
                </span>
                <img
                  src={`https://flagcdn.com/w40/${white.countryCode.toLowerCase()}.png`}
                  alt={white.country}
                  width={18}
                  height={13}
                  className="rounded-[2px] opacity-60"
                />
              </div>
            </div>
          </div>

          {/* ═══ BLACK PLAYER — bottom half ═══ */}
          <div
            className="absolute inset-x-0 bottom-0 z-10"
            style={{
              height: '52%',
              clipPath: 'polygon(0 25%, 100% 0, 100% 100%, 0 100%)',
              ...(phase === 'card' ? { animation: 'photoSlamRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0s both' } : {}),
            }}
          >
            {/* Photo — object-[center_20%] to keep full face visible */}
            <div className="absolute inset-0">
              <Image
                src={black.photo}
                alt={black.name}
                fill
                className="object-cover"
                style={{ objectPosition: 'center 20%' }}
                sizes="540px"
                priority
              />
            </div>

            {/* Cinematic gradient overlays */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(0deg, rgba(26,34,40,0.3) 0%, transparent 30%, transparent 50%, rgba(26,34,40,0.95) 100%),
                  linear-gradient(270deg, rgba(26,34,40,0.5) 0%, transparent 30%)
                `,
              }}
            />

            {/* Black player name — top-right, inside the photo */}
            <div
              className="absolute top-16 right-5 z-10 text-right"
              style={phase === 'card' ? { animation: 'nameSlideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both' } : {}}
            >
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-[10px] font-black tabular-nums text-chess-green">
                  {black.rating}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
                  Black
                </span>
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: '#2A3C45',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                  }}
                />
              </div>
              <div
                className="text-[52px] font-black leading-[0.85] tracking-tighter text-white"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
              >
                {black.name.split(' ').pop()}
              </div>
              <div className="mt-1 flex items-center justify-end gap-2">
                <img
                  src={`https://flagcdn.com/w40/${black.countryCode.toLowerCase()}.png`}
                  alt={black.country}
                  width={18}
                  height={13}
                  className="rounded-[2px] opacity-60"
                />
                <span className="text-[14px] font-bold text-white/40">
                  {black.name.split(' ').slice(0, -1).join(' ')}
                </span>
              </div>
            </div>
          </div>

          {/* ═══ THE DIAGONAL — lightning bolt tear ═══ */}
          {/* This is the structural divider, not a decoration */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Gold diagonal line — the "crack" */}
            <svg
              className="absolute inset-0"
              width="540"
              height="960"
              viewBox="0 0 540 960"
              fill="none"
              style={phase === 'card' ? { animation: 'boltTear 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both' } : {}}
            >
              {/* Glow layer */}
              <path
                d="M540 370 L320 460 L340 470 L0 590"
                stroke="#FFD700"
                strokeWidth="28"
                strokeLinecap="round"
                opacity="0.15"
                filter="blur(12px)"
              />
              {/* Bright core */}
              <path
                d="M540 370 L320 460 L340 470 L0 590"
                stroke="url(#bolt-line)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Hot white center */}
              <path
                d="M540 370 L320 460 L340 470 L0 590"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              <defs>
                <linearGradient id="bolt-line" x1="0" y1="590" x2="540" y2="370" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF6B00" />
                  <stop offset="0.5" stopColor="#FFD700" />
                  <stop offset="1" stopColor="#FF9500" />
                </linearGradient>
              </defs>
            </svg>

            {/* Rook logo at the bolt's bend point */}
            <div
              className="absolute z-30"
              style={{
                left: 310,
                top: 448,
                ...(phase === 'card' ? { animation: 'rookSlam 0.25s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' } : {}),
              }}
            >
              <div className="relative">
                {/* Warm glow behind rook */}
                <div
                  className="absolute -inset-6 rounded-full blur-xl"
                  style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.25) 0%, transparent 70%)' }}
                />
                <BreathingRook size="lg" animate animation="celebrate" />
              </div>
            </div>
          </div>

          {/* ═══ TOP BAR — tournament info ═══ */}
          <div
            className="absolute top-0 left-0 right-0 z-30 px-5 pt-5"
            style={phase === 'card' ? { animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both' } : {}}
          >
            <div className="flex items-start justify-between">
              {/* Tournament badge */}
              <div>
                <div className="flex items-center gap-2">
                  <BreathingRook size="xs" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-chess-green">
                    chesspath.app
                  </span>
                </div>
                <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                  FIDE Candidates 2026
                </div>
              </div>

              {/* Round number — big and bold */}
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                  Round
                </div>
                <div
                  className="text-[48px] font-black leading-[0.8] tabular-nums"
                  style={{
                    color: '#FFD700',
                    textShadow: '0 0 30px rgba(255,215,0,0.2)',
                  }}
                >
                  {round}
                </div>
              </div>
            </div>

            {/* "Re-Cap in 59 Seconds" — the hook */}
            <div
              className="mt-3"
              style={phase === 'card' ? { animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' } : {}}
            >
              <span
                className="text-[28px] font-black leading-tight text-white"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
              >
                Re-Cap in 59 Seconds
              </span>
            </div>
          </div>

          {/* ═══ BOTTOM BAR ═══ */}
          <div
            className="absolute bottom-0 left-0 right-0 z-30 px-5 pb-5"
            style={phase === 'card' ? { animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both' } : {}}
          >
            <div className="flex items-end justify-between">
              <div className="text-[10px] font-medium text-white/20">
                Toronto, Canada
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-chess-red animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CARD_KEYFRAMES = `
  @keyframes introFadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; pointer-events: none; }
  }
  @keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes photoSlamLeft {
    0% { opacity: 0; transform: translateX(-30px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes photoSlamRight {
    0% { opacity: 0; transform: translateX(30px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes nameSlideRight {
    0% { opacity: 0; transform: translateX(-20px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes nameSlideLeft {
    0% { opacity: 0; transform: translateX(20px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes boltTear {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes rookSlam {
    0% { opacity: 0; transform: scale(0.3); }
    70% { opacity: 1; transform: scale(1.15); }
    100% { opacity: 1; transform: scale(1); }
  }
`;
