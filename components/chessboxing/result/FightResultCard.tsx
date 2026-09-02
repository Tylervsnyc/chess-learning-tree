'use client';

/**
 * FightResultCard — THE Chess Boxing finish window for /workout and
 * /box/bout. The old white popups and the FIGHT_RESULT_CARD flag were
 * deleted 2026-08-25; this is the only result screen.
 * One shared modal for /workout (puzzle + fight-round sessions) and /box/bout.
 * Hero strip = CardRaysHero; body = the same facts the old white popups showed
 * (points, solved/missed, best round, punches, lifetime · bout: outcome,
 * points split, moves, clock, rounds survived, judges' cards), then the
 * <StreakComplete /> slot, the not-signed-in block, and the actions.
 *
 * The page still owns: the data, the share/review handlers, the medal
 * overlay (AchievementUnlockOverlay renders ABOVE this at z-110), routing.
 */

import { BreathingRook } from '@/components/ui/BreathingRook';
import { useEffect, type ReactNode } from 'react';
import { StreakComplete } from '@/components/shared/StreakComplete';
import { maybeRequestReview } from '@/lib/native/review';
import { playBoxingBell, playButtonClick } from '@/lib/sounds';
import { CardRaysHero, HERO_DONE_MS } from './CardRaysHero';
import type { NextMedal } from '@/lib/achievements/types';

const PUZZLE_ICON = '/boxing/locker/corner-puzzle.webp';
const PLAY_ICON = '/boxing/locker/corner-play.webp';

export interface WorkoutCardData {
  kind: 'workout';
  sessionPoints: number;
  bestRoundPoints: number;
  lifetime: number | null;
  right: number;
  wrong: number;
  perfect: boolean;
  perfectBonus: number;
  isPersonalBest: boolean;
  previousBest: number;
  punches: number;
  rookieLine: string;
  /** Fight sessions — "You beat Rookie (Level 3)"; null for puzzle sessions. */
  fightSummary: string | null;
  /** Fight sessions only — did the user win the game? Puzzle sessions are always a "win". */
  fightWon: boolean | null;
}

export interface BoutCardData {
  kind: 'bout';
  won: boolean;
  draw: boolean;
  headline: string;
  rookieLine: string;
  meltdown: boolean;
  /** Server-confirmed total (may be 0 — exhibition / ranked already spent). */
  earned: number;
  chessPts: number;
  boxingPts: number;
  moves: number;
  clockLeft: string;
  roundsSurvived: number;
  punches: number;
  materialLine: string;
  userCards: number[];
  rookieCards: number[];
  cardsDecidedIt: boolean;
  ranked: boolean;
  /** "Exhibition — …" note when it paid nothing; null otherwise. */
  exhibitionNote: string | null;
}

interface Props {
  data: WorkoutCardData | BoutCardData;
  needsSignIn: boolean;
  showLeaderboard: boolean;
  leaderboardLabel: string;
  sharing?: boolean;
  onShare?: () => void;
  onReview?: () => void;
  reviewLabel?: string;
  /** Bout: Rematch. Workout: none. */
  onRematch?: () => void;
  onSignIn: () => void;
  onLeaderboard: () => void;
  onDone: () => void;
  /** "Next: Thousand Fists — 412/1000" — closest in-progress medal (server-computed). */
  nextMedal?: NextMedal | null;
}

export function FightResultCard(p: Props) {
  const { data } = p;
  const won = data.kind === 'workout' ? data.fightWon ?? true : data.won;
  const draw = data.kind === 'bout' && data.draw;
  const points = data.kind === 'workout' ? data.sessionPoints : data.earned;
  const d = HERO_DONE_MS / 1000;

  useEffect(() => { void playBoxingBell(); }, []);
  // App Store rating sheet — asked once the card has fully landed (hero +
  // streak), never on a loss. lib/native/review.ts owns the 2nd-session gate.
  useEffect(() => {
    if (!won || draw) return;
    const t = setTimeout(() => { void maybeRequestReview(); }, HERO_DONE_MS + 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ribbon =
    data.kind === 'workout'
      ? data.fightSummary
        ? data.fightSummary
        : data.isPersonalBest
          ? `New best · was ${data.previousBest}`
          : 'Workout complete'
      : `${data.headline}${data.ranked ? ' · Ranked' : ''}`;
  const ribbonColor: 'gold' | 'red' | 'navy' =
    !won || draw ? 'navy' : data.kind === 'workout' && data.isPersonalBest ? 'gold' : 'red';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm frc-fade">
      <style>{CSS}</style>
      <div className="frc-window w-full max-w-[360px] max-h-full overflow-y-auto rounded-3xl bg-[#f3e9d2] text-[#1b2340] shadow-[0_30px_80px_rgba(0,0,0,.7)] border-[3px] border-[#1b2340]">
        <CardRaysHero
          icon={data.kind === 'workout' && !data.fightSummary ? PUZZLE_ICON : PLAY_ICON}
          points={points}
          won={won && !draw}
          kicker={data.kind === 'workout' ? (data.fightSummary ? 'Fight rounds' : 'Workout') : 'Bout'}
          word={draw ? 'Draw' : won ? 'Winner' : 'Lost'}
          height={data.kind === 'bout' ? 200 : 230}
        />
        <div className="h-[3px] bg-[#1b2340]" />
        <div className="px-4 pt-3 pb-4">
          <Ribbon delay={d} color={ribbonColor}>{ribbon}</Ribbon>
          {data.kind === 'workout' ? <WorkoutBody d={data} delay={d} /> : <BoutBody d={data} delay={d} />}
          <Rookie line={data.rookieLine} delay={d + 0.55} meltdown={data.kind === 'bout' && data.meltdown} />
          {p.nextMedal && (
            <Land delay={d + 0.58} className="mt-2 px-1 flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#1b2340]/60">
              <span className="truncate">Next medal: <span className="text-[#1b2340]">{p.nextMedal.icon.startsWith('/') ? <img src={p.nextMedal.icon} alt="" className="inline-block h-3.5 w-3.5 align-[-2px]" /> : p.nextMedal.icon} {p.nextMedal.name}</span></span>
              <span className="tabular-nums shrink-0 text-[#1b2340]">{p.nextMedal.progress.toLocaleString()}/{p.nextMedal.target.toLocaleString()}</span>
            </Land>
          )}

          <Land delay={d + 0.6} className="mt-3 pt-2 border-t border-dashed border-[#1b2340]/25">
            <StreakComplete />
          </Land>

          {p.needsSignIn && (
            <Land delay={d + 0.65} className="mt-3 rounded-xl bg-amber-50 border-2 border-amber-300 px-3 py-2 text-[11px] font-bold text-amber-900 leading-snug">
              Not saved yet — sign in and this fight goes on your record and the {data.kind === 'bout' ? 'standings' : 'leaderboard'}.
            </Land>
          )}
          {data.kind === 'bout' && !p.needsSignIn && data.exhibitionNote && (
            <Land delay={d + 0.65} className="mt-2 text-[11px] font-bold text-[#1b2340]/60 leading-snug">{data.exhibitionNote}</Land>
          )}

          {/* actions */}
          <Land delay={d + 0.7} className="mt-3 grid gap-2" >
            {p.onShare && (
              <Btn onClick={p.onShare} disabled={p.sharing} primary>
                <span className="inline-flex items-center gap-2"><ShareIcon />{p.sharing ? 'Making your clip…' : 'Share the fight'}</span>
              </Btn>
            )}
            {(p.onReview || p.onRematch) && (
              <div className={`grid gap-2 ${p.onReview && p.onRematch ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {p.onReview && <Btn onClick={p.onReview}>{p.reviewLabel ?? 'Review'}</Btn>}
                {p.onRematch && <Btn onClick={p.onRematch} primary={!p.onShare} blue={!!p.onShare}>Rematch</Btn>}
              </div>
            )}
            {p.needsSignIn ? (
              <>
                <Btn onClick={p.onSignIn} green>Sign in to save this fight</Btn>
                {p.showLeaderboard && (
                  <button onClick={() => { playButtonClick(); p.onLeaderboard(); }} className="min-h-[44px] text-xs font-black text-[#1b2340]/60 underline underline-offset-2 tap-highlight">
                    {p.leaderboardLabel}
                  </button>
                )}
              </>
            ) : (
              p.showLeaderboard && <Btn onClick={p.onLeaderboard} green>{p.leaderboardLabel}</Btn>
            )}
            <Btn onClick={p.onDone} blue>Done</Btn>
          </Land>
        </div>
      </div>
    </div>
  );
}

/* ---------- bodies ---------- */
function WorkoutBody({ d, delay }: { d: WorkoutCardData; delay: number }) {
  const total = d.right + d.wrong;
  const isFight = !!d.fightSummary;
  return (
    <>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <Stat v={`+${d.sessionPoints}`} l="points" delay={delay + 0.1} accent={d.isPersonalBest ? 'gold' : 'red'} />
        {isFight ? (
          <Stat v={d.bestRoundPoints} l="best round" delay={delay + 0.2} />
        ) : (
          <Stat v={<>{d.right}<span className="text-[13px] text-[#1b2340]/50">/{total}</span></>} l="solved" delay={delay + 0.2} />
        )}
        <Stat v={d.punches} l="punches" delay={delay + 0.3} accent="blue" />
      </div>
      <div className="mt-2 px-1">
        {!isFight && d.bestRoundPoints > 0 && <Row l="Best round" v={`${d.bestRoundPoints} pts`} delay={delay + 0.35} />}
        {d.perfect && <Row l="Flawless run" v={`+${d.perfectBonus} bonus`} delay={delay + 0.4} gold />}
        {!d.isPersonalBest && d.previousBest > 0 && <Row l="Your best" v={`${d.previousBest} pts`} delay={delay + 0.45} />}
        {d.lifetime !== null && <Row l="Lifetime points" v={d.lifetime.toLocaleString()} delay={delay + 0.5} />}
      </div>
    </>
  );
}

function BoutBody({ d, delay }: { d: BoutCardData; delay: number }) {
  const zero = d.earned === 0;
  return (
    <>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <Stat v={`+${d.earned}`} l="points" delay={delay + 0.1} accent={zero ? undefined : 'red'} />
        <Stat v={d.moves} l="moves" delay={delay + 0.2} />
        <Stat v={d.punches} l="punches" delay={delay + 0.3} accent="blue" />
      </div>
      <div className="mt-2 px-1">
        <Row l="Points split" v={<span>{d.chessPts} chess <span className="text-[#1b2340]/40">·</span> {d.boxingPts} boxing</span>} delay={delay + 0.35} />
        <Row l="On the board" v={d.materialLine} delay={delay + 0.4} />
        <Row l="Rounds survived" v={d.roundsSurvived > 0 ? d.roundsSurvived : 'Before the gloves'} delay={delay + 0.45} />
        <Row l="Clock left" v={d.clockLeft} delay={delay + 0.5} />
        {d.userCards.length > 0 && (
          <Row
            l={d.cardsDecidedIt ? 'Cards decided it' : "Judges' cards"}
            v={<span className="tabular-nums">{d.userCards.reduce((a, b) => a + b, 0)} <span className="text-[#1b2340]/40">·</span> {d.rookieCards.reduce((a, b) => a + b, 0)}</span>}
            delay={delay + 0.55}
          />
        )}
      </div>
    </>
  );
}

/* ---------- primitives ---------- */
function Land({ children, delay, className = '' }: { children: ReactNode; delay: number; className?: string }) {
  return <div className={`frc-land ${className}`} style={{ animationDelay: `${delay}s` }}>{children}</div>;
}
function Stat({ v, l, delay, accent }: { v: ReactNode; l: string; delay: number; accent?: 'red' | 'gold' | 'blue' }) {
  const col = accent === 'red' ? 'text-[#ff4b4b]' : accent === 'gold' ? 'text-[#b8860b]' : accent === 'blue' ? 'text-[#1cb0f6]' : 'text-[#1b2340]';
  return (
    <Land delay={delay} className="rounded-xl border-2 border-[#1b2340]/15 bg-white/60 px-2 py-2 text-center">
      <div className={`text-[22px] font-black tabular-nums leading-none ${col}`}>{v}</div>
      <div className="text-[9px] font-black uppercase tracking-[0.22em] text-[#1b2340]/55 mt-1">{l}</div>
    </Land>
  );
}
function Row({ l, v, delay, gold }: { l: string; v: ReactNode; delay: number; gold?: boolean }) {
  return (
    <Land delay={delay} className="flex items-center justify-between gap-2 py-1 border-b border-dashed border-[#1b2340]/20 last:border-0">
      <span className="text-[#1b2340]/60 uppercase tracking-[0.12em] text-[10px] font-black shrink-0">{l}</span>
      <span className={`text-[12px] font-black tabular-nums text-right ${gold ? 'text-[#b8860b]' : ''}`}>{v}</span>
    </Land>
  );
}
function Rookie({ line, delay, meltdown }: { line: string; delay: number; meltdown: boolean }) {
  return (
    <Land delay={delay} className={`mt-3 flex items-start gap-2 rounded-xl px-3 py-2 ${meltdown ? 'bg-[#8a1f1f] text-[#ffd7a1]' : 'bg-[#1b2340] text-[#f3e9d2]'}`}>
      <div className="shrink-0 w-7 h-8 overflow-visible [&>*]:scale-[0.5] [&>*]:origin-top-left"><BreathingRook size="sm" animate mood={meltdown ? 'panicking' : 'neutral'} /></div>
      <p className="text-[12px] font-semibold leading-snug">{line}</p>
    </Land>
  );
}
function Ribbon({ children, delay, color }: { children: ReactNode; delay: number; color: 'red' | 'gold' | 'navy' }) {
  const bg = color === 'red' ? 'bg-[#ff4b4b] text-[#f3e9d2]' : color === 'gold' ? 'bg-[#f6c445] text-[#3d2e00]' : 'bg-[#1b2340] text-[#f3e9d2]';
  return (
    <Land delay={delay} className="flex justify-center">
      <span className={`inline-block -mt-[22px] relative z-10 max-w-full truncate px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border-[3px] border-[#f3e9d2] rotate-[-2deg] ${bg}`} style={{ boxShadow: '0 3px 0 rgba(0,0,0,.25)' }}>
        {children}
      </span>
    </Land>
  );
}
function Btn({ children, onClick, primary, green, blue, disabled, ...rest }: { children: ReactNode; onClick: () => void; primary?: boolean; green?: boolean; blue?: boolean; disabled?: boolean; 'aria-label'?: string }) {
  const skin = primary
    ? 'bg-[#ff4b4b] border-[#8a1f1f] text-[#f3e9d2] shadow-[0_3px_0_#8a1f1f]'
    : green
      ? 'bg-[#2f7d4a] border-[#1d5432] text-[#f3e9d2] shadow-[0_3px_0_#1d5432]'
      : blue
        ? 'bg-[#1cb0f6] border-[#0d7ec4] text-white shadow-[0_3px_0_#0d7ec4]'
        : 'bg-white/70 border-[#1b2340] text-[#1b2340] shadow-[0_3px_0_#1b2340]';
  return (
    <button {...rest} disabled={disabled} onClick={() => { playButtonClick(); onClick(); }}
      className={`min-h-[44px] px-2 rounded-xl border-2 flex items-center justify-center text-[11px] font-black uppercase tracking-wide active:translate-y-[2px] active:shadow-none transition-transform tap-highlight disabled:opacity-60 ${skin}`}>
      {children}
    </button>
  );
}
function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

const CSS = `
.frc-fade{animation:frc-fade .25s both}
.frc-window{animation:frc-window .45s cubic-bezier(.2,1.3,.4,1) both}
@keyframes frc-window{from{transform:translateY(40px) scale(.9);opacity:0}to{transform:none;opacity:1}}
.frc-land{animation:frc-up .45s cubic-bezier(.2,1.3,.4,1) both}
@keyframes frc-up{from{transform:translateY(14px);opacity:0}to{transform:none;opacity:1}}
@media (prefers-reduced-motion:reduce){.frc-window,.frc-land{animation-duration:.01s!important;animation-delay:0s!important}}
`;
