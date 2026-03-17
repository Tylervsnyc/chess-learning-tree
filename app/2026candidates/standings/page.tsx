'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { OPEN_PLAYERS } from '@/data/2026candidates/players';
import type { Player } from '@/data/2026candidates/types';
import { CandidatesHeader } from '@/components/2026candidates';

export default function StandingsPage() {
  const sorted = [...OPEN_PLAYERS].sort((a, b) => b.points - a.points || b.rating - a.rating);

  return (
    <div className="flex min-h-dvh flex-col bg-chess-page overflow-auto">
      {/* Header */}
      <div
        className="mx-auto w-full max-w-lg px-4 pt-8 pb-6 animate-[fadeSlideDown_500ms_cubic-bezier(0.16,1,0.3,1)_both]"
      >
        <CandidatesHeader />
        <h1 className="mt-2 text-center text-2xl font-black text-chess-text">Standings</h1>
        <p className="mt-1 text-center text-sm text-chess-text-muted">Cyprus | Mar 28 - Apr 16</p>
      </div>

      {/* Standings */}
      <div className="mx-auto w-full max-w-lg px-4 pb-10">
        <div className="overflow-hidden rounded-2xl bg-chess-surface border border-slate-200 shadow-sm">
          {/* Column headers */}
          <div className="flex items-center px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-chess-text-faint border-b border-slate-100">
            <div className="w-8">#</div>
            <div className="flex-1">Player</div>
            <div className="w-12 text-center">Elo</div>
            <div className="w-12 text-center">Today</div>
            <div className="w-12 text-right">Pts</div>
          </div>

          {sorted.map((player, i) => (
            <StandingsRow
              key={player.id}
              player={player}
              rank={i + 1}
              isLast={i === sorted.length - 1}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Footer branding */}
      <div className="mt-auto pb-6 text-center">
        <span className="text-[11px] font-bold tracking-[0.15em] text-chess-green/30">
          chesspath.app
        </span>
      </div>

      {/* Keyframe definitions */}
      <style jsx global>{`
        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rowSlideIn {
          from {
            opacity: 0;
            transform: translateX(-16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes badgePop {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          70% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

const RANK_BADGE: Record<number, { bg: string; text: string; ring: string }> = {
  1: { bg: 'bg-amber-400', text: 'text-white', ring: 'ring-amber-300' },
  2: { bg: 'bg-slate-400', text: 'text-white', ring: 'ring-slate-300' },
  3: { bg: 'bg-orange-400', text: 'text-white', ring: 'ring-orange-300' },
};

function TodayBadge({ result }: { result?: 0 | 0.5 | 1 }) {
  if (result === undefined) return <span className="text-chess-text-faint">-</span>;

  if (result === 1) {
    return (
      <span className="inline-flex h-5 min-w-[28px] items-center justify-center rounded-md bg-chess-green/15 text-[11px] font-black text-chess-green">
        1
      </span>
    );
  }
  if (result === 0) {
    return (
      <span className="inline-flex h-5 min-w-[28px] items-center justify-center rounded-md bg-chess-red/10 text-[11px] font-black text-chess-red">
        0
      </span>
    );
  }
  // 0.5 — draw
  return (
    <span className="inline-flex h-5 min-w-[28px] items-center justify-center rounded-md bg-chess-blue/10 text-[11px] font-black text-chess-blue">
      ½
    </span>
  );
}

function StandingsRow({
  player,
  rank,
  isLast,
  index,
}: {
  player: Player;
  rank: number;
  isLast: boolean;
  index: number;
}) {
  const isTop3 = rank <= 3;
  const badge = RANK_BADGE[rank];
  const rowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const staggerDelay = Math.min(index * 60, 500);

  return (
    <div
      ref={rowRef}
      className={`flex items-center px-4 py-3.5 ${
        !isLast ? 'border-b border-slate-100' : ''
      } ${isTop3 ? 'bg-amber-50/40' : ''} group`}
      style={{
        animation: visible
          ? `rowSlideIn 400ms cubic-bezier(0.16,1,0.3,1) ${staggerDelay}ms both`
          : 'none',
        opacity: visible ? undefined : 0,
      }}
    >
      {/* Rank */}
      <div className="w-8">
        {badge ? (
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${badge.bg} ${badge.text}`}
            style={{
              animation: visible
                ? `badgePop 350ms cubic-bezier(0.16,1,0.3,1) ${staggerDelay + 200}ms both`
                : 'none',
            }}
          >
            {rank}
          </span>
        ) : (
          <span className="text-sm font-black text-chess-text-faint tabular-nums">
            {rank}
          </span>
        )}
      </div>

      {/* Player info */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div
          className={`relative shrink-0 overflow-hidden rounded-full bg-slate-100 transition-transform duration-200 group-hover:scale-105 ${
            isTop3 ? 'h-11 w-11 ring-2 ' + (badge?.ring || '') : 'h-10 w-10 ring-2 ring-slate-200/60'
          }`}
        >
          <Image
            src={player.photo}
            alt={player.name}
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>

        <div className="min-w-0">
          <div className={`truncate font-bold text-chess-text ${isTop3 ? 'text-[15px]' : 'text-sm'}`}>
            {player.name}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-chess-text-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://flagcdn.com/w40/${player.countryCode.toLowerCase()}.png`}
              alt={player.country}
              className="inline-block h-3 w-4 rounded-[2px] object-cover"
            />
            <span>{player.country}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="w-12 text-center text-sm font-medium text-chess-text-muted tabular-nums">
        {player.rating}
      </div>

      {/* Today's result */}
      <div className="w-12 text-center">
        <TodayBadge result={player.todayResult} />
      </div>

      {/* Points */}
      <div className="w-12 text-right">
        <span
          className={`text-sm font-black tabular-nums ${
            rank === 1 && player.points > 0
              ? 'text-chess-green'
              : 'text-chess-text'
          }`}
        >
          {player.points % 1 === 0 ? player.points : player.points.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
