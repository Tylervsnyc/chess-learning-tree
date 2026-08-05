'use client';

import { useEffect, useState } from 'react';
import { getStreak, peekStreak, getStoredUserId, type StreakData } from '@/lib/streak-client';
import { ChessChase } from '@/components/chessboxing/ChessChase';

/**
 * LockerHome — the Chess Boxing home screen. Layered art (GPT-cut from
 * home-locker-v2-3.png) with live behavior:
 *  - chalk tally marks on the door = the user's REAL streak (drawn in code)
 *  - gloves sway idle, swing when tapped  -> FIGHT (bout)
 *  - chess pieces bob                      -> TRAIN (workout)
 *
 * Streak reads go through lib/streak-client (rule: never fetch the endpoint
 * directly). `previewStreak` overrides for test pages.
 */

const ASSET = {
  base: '/boxing/locker/base.webp',
  gloves: '/boxing/locker/gloves.webp',
};

/** Door swing: open = edge-on past the hinge (invisible), closed = frontal. */
const DOOR_OPEN_DEG = -108;

const KEYFRAMES = `
  @keyframes lhGloveIdle {
    0%, 100% { transform: rotate(-1.3deg); }
    50% { transform: rotate(1.3deg); }
  }
  @keyframes lhGloveSwing {
    0% { transform: rotate(0deg); }
    18% { transform: rotate(11deg); }
    42% { transform: rotate(-8deg); }
    64% { transform: rotate(5deg); }
    82% { transform: rotate(-2deg); }
    100% { transform: rotate(0deg); }
  }
  @keyframes lhPiecesBob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-0.6%); }
  }
  /* the open door never sits perfectly still */
  @keyframes lhDoorSway {
    0%, 100% { transform: rotateY(25deg); }
    50% { transform: rotateY(28.5deg); }
  }
  @keyframes lhChalkDraw {
    0% { stroke-dashoffset: 30; opacity: 0; }
    20% { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }
`;

// Deterministic chalk jitter per mark index
const j = (i: number, k: number) => (((i * 37 + k * 13) % 7) - 3) * 0.45;

/**
 * The chalk filter — roughens edges and eats into the strokes so text and
 * tallies read as chalk dragged over painted steel, not as clean vector type.
 * Defined once; both the heading and the tallies reference it.
 */
function ChalkDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="rough" />
        {/* patchy coverage — chalk skips where the surface is smooth */}
        <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="2" seed="3" result="patch" />
        <feColorMatrix in="patch" type="matrix" result="patchA"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.7 0.4 0 0 0.35" />
        <feComposite in="rough" in2="patchA" operator="in" result="worn" />
        <feBlend in="worn" in2="rough" mode="normal" />
      </filter>
    </defs>
  );
}

/**
 * Punched air holes — seen from the INSIDE of the open door, so each hole is
 * a dark bore with the light catching its lower lip.
 */
function DoorHoles() {
  const cols = [0, 1, 2, 3, 4];
  const rows = [0, 1];
  return (
    <svg viewBox="0 0 100 34" width="100%" style={{ display: 'block', flexShrink: 0 }} aria-hidden>
      {rows.map((r) =>
        cols.map((c) => (
          <g key={`${r}-${c}`}>
            <ellipse cx={14 + c * 18} cy={9 + r * 16} rx="4.6" ry="4" fill="#141c30" />
            <path
              d={`M ${9.4 + c * 18} ${9 + r * 16} a 4.6 4 0 0 0 9.2 0`}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.1"
            />
          </g>
        ))
      )}
    </svg>
  );
}

/** "DAILY STREAK", written on the door in chalk. */
function ChalkHeading() {
  return (
    <svg viewBox="0 0 100 26" width="100%" style={{ display: 'block', flexShrink: 0 }} aria-hidden>
      <ChalkDefs id="lhChalkHead" />
      <g filter="url(#lhChalkHead)" transform="rotate(-1.6 50 10)">
        <text
          x="50" y="11" textAnchor="middle"
          fontSize="13" fontWeight="800" letterSpacing="0.3"
          fill="#eef3ff" opacity="0.95"
          style={{ fontFamily: 'inherit' }}
        >
          DAILY
        </text>
        <text
          x="50" y="24" textAnchor="middle"
          fontSize="13" fontWeight="800" letterSpacing="0.3"
          fill="#eef3ff" opacity="0.95"
          style={{ fontFamily: 'inherit' }}
        >
          STREAK
        </text>
      </g>
    </svg>
  );
}

/**
 * Chalk tallies scrawled on the inside of the door. Groups of 5 (4 verticals +
 * a diagonal slash) run left to right and wrap; the newest mark draws itself
 * on. Groups past what fits become a written number instead.
 */
function ChalkTallies({ count, perRow = 4 }: { count: number; perRow?: number }) {
  const total = Math.max(0, count);
  const groups = Math.floor(total / 5);
  const rem = total % 5;
  const marks: { g: number; i: number; isLast: boolean }[] = [];
  for (let g = 0; g < groups; g++) for (let i = 0; i < 5; i++) marks.push({ g, i, isLast: false });
  for (let i = 0; i < rem; i++) marks.push({ g: groups, i, isLast: false });
  if (marks.length > 0) marks[marks.length - 1].isLast = true;

  const PER_ROW = perRow; // groups per row
  const ROWS = 4;
  const MAX_GROUPS = PER_ROW * ROWS; // then we just write the number instead
  const GROUP_W = 46;
  const ROW_H = 40;
  const shown = marks.filter((m) => m.g < MAX_GROUPS);
  const overflow = total > MAX_GROUPS * 5;
  const W = PER_ROW * GROUP_W + 8;
  const H = ROWS * ROW_H;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <ChalkDefs id="lhChalkMarks" />
      <g filter="url(#lhChalkMarks)">
      {!overflow &&
        shown.map(({ g, i, isLast }, idx) => {
          const col = g % PER_ROW;
          const row = Math.floor(g / PER_ROW);
          const x0 = 8 + col * GROUP_W;
          const y0 = 8 + row * ROW_H;
          const stroke = {
            stroke: '#dfe7f5',
            strokeWidth: 3.2,
            strokeLinecap: 'round' as const,
            opacity: 0.92,
          };
          if (i < 4) {
            const x = x0 + i * 8 + j(idx, 1);
            return (
              <line key={idx} x1={x} y1={y0 + j(idx, 2)} x2={x + j(idx, 3) * 0.6} y2={y0 + 24 + j(idx, 4)}
                {...stroke}
                strokeDasharray={isLast ? 30 : undefined}
                style={isLast ? { animation: 'lhChalkDraw 0.7s ease-out 0.9s both' } : undefined}
              />
            );
          }
          return (
            <line key={idx} x1={x0 - 4 + j(idx, 1)} y1={y0 + 22 + j(idx, 2)} x2={x0 + 32 + j(idx, 3)} y2={y0 + 2 + j(idx, 4)}
              {...stroke}
              strokeDasharray={isLast ? 42 : undefined}
              style={isLast ? { animation: 'lhChalkDraw 0.7s ease-out 0.9s both' } : undefined}
            />
          );
        })}
      {overflow && (
        <text x={W / 2} y={H / 2 + 16} textAnchor="middle" fontSize={44} fontWeight={800}
          fill="#dfe7f5" opacity={0.92} style={{ fontFamily: 'inherit' }}>
          {total}
        </text>
      )}
      {total === 0 && (
        <text x={W / 2} y={H / 2} textAnchor="middle" fontSize={15} fontWeight={700}
          fill="#dfe7f5" opacity={0.55} style={{ fontFamily: 'inherit' }}>
          0
        </text>
      )}
      </g>
    </svg>
  );
}

export function LockerHome({
  previewStreak,
  streak: streakData,
  lastScore,
  lastScoreWhen,
  rank,
  onFight,
  onTrain,
}: {
  previewStreak?: number;
  /** Live streak (BoxToday already holds it) — falls back to a local read. */
  streak?: StreakData | null;
  /** undefined = still loading, null = none yet. */
  lastScore?: number | null;
  lastScoreWhen?: string | null;
  rank?: { rank: number; total: number } | null;
  onFight?: () => void;
  onTrain?: () => void;
}) {
  const [streak, setStreak] = useState<number>(previewStreak ?? 0);
  const [punchId, setPunchId] = useState(0);
  const [hover, setHover] = useState<'fight' | 'train' | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (previewStreak !== undefined) {
      setStreak(previewStreak);
      return;
    }
    if (streakData) {
      setStreak(streakData.current);
      return;
    }
    const uid = getStoredUserId();
    const snap = uid ? peekStreak(uid) : null;
    if (snap) setStreak(snap.current);
    getStreak().then((d) => { if (d) setStreak(d.current); });
  }, [previewStreak, streakData]);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1024 / 1536', userSelect: 'none', perspective: '1400px', containerType: 'inline-size' }}>
      <style>{KEYFRAMES}</style>

      {/* base scene (locker, shelf, board, wraps, bottle — no gloves, no chalk) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ASSET.base} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* gloves layer — idle sway, tap to swing; pivot near the hook */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ASSET.gloves} alt="" draggable={false}
        key={punchId}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          transformOrigin: '53% 16%',
          animation: punchId > 0
            ? 'lhGloveSwing 1.1s cubic-bezier(0.22, 1, 0.36, 1)'
            : 'lhGloveIdle 3.6s ease-in-out 1s infinite',
          filter: hover === 'fight' ? 'brightness(1.12)' : 'none',
          transition: 'filter 0.2s',
        }} />

      {/* the perpetual chase on the chess board */}
      <ChessChase />

      {/* ── What's INSIDE the locker: your own numbers ────────────────────── */}

      {/* The INSIDE of the open door — the strip down the left of the scene.
          Chalked streak up top, then the two plaques stacked, exactly how a
          fighter's locker door carries their record. Fades out as the door
          swings shut (it's turning away from us). */}
      <div
        style={{
          position: 'absolute', left: '2%', top: '12%', width: '15%', height: '58%',
          display: 'flex', flexDirection: 'column', gap: '3%',
          // The open door is a panel turned toward us — everything screwed or
          // chalked to it has to live in ITS plane, not flat on the screen.
          transformOrigin: 'right center',
          transform: 'rotateY(26deg)',
          animation: closed ? 'none' : 'lhDoorSway 7s ease-in-out 1.2s infinite',
          pointerEvents: 'none',
          opacity: closed ? 0 : 1,
          transition: `opacity ${closed ? '0.2s' : '0.35s'} ease ${closed ? '0s' : '0.35s'}`,
        }}
      >
        {/* punched air holes, same as the front of the door */}
        <DoorHoles />
        <ChalkHeading />
        <div style={{ flex: '1 1 auto', minHeight: 0 }}>
          <ChalkTallies count={streak} perRow={1} />
        </div>
        <Plaque
          label="Last"
          value={lastScore === undefined ? '' : lastScore === null ? '—' : lastScore.toLocaleString()}
          sub={lastScore ? (lastScoreWhen ?? '') : 'no rounds'}
        />
        <Plaque
          label="Rank"
          value={rank === undefined ? '' : rank === null ? '—' : `#${rank.rank}`}
          sub={rank ? `of ${rank.total}` : 'unranked'}
        />
      </div>

      {/* Enemy's Tears — label WRAPPED on the round bottle (curved band, arced
          text, cylinder shading dark at both edges). */}
      <BottleLabel />

      {/* FIGHT tap zone (gloves) */}
      <button
        onClick={() => { setPunchId((p) => p + 1); onFight?.(); }}
        onMouseEnter={() => setHover('fight')} onMouseLeave={() => setHover(null)}
        aria-label="Fight — start a bout"
        style={{ position: 'absolute', left: '22%', top: '18%', width: '58%', height: '38%', background: 'none', border: 'none', cursor: 'pointer' }}
      />
      {/* TRAIN tap zone (board) */}
      <button
        onClick={() => onTrain?.()}
        onMouseEnter={() => setHover('train')} onMouseLeave={() => setHover(null)}
        aria-label="Train — puzzle workout"
        style={{ position: 'absolute', left: '18%', top: '64%', width: '68%', height: '20%', background: 'none', border: 'none', cursor: 'pointer',
          filter: hover === 'train' ? 'brightness(1.1)' : 'none' }}
      />

      {/* labels */}
      <div style={{ position: 'absolute', left: '50%', top: '43.5%', transform: 'translateX(-50%)', padding: '4px 14px', borderRadius: 999,
        background: hover === 'fight' ? '#e5484d' : 'rgba(9, 14, 28, 0.65)', color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 1.5,
        transition: 'background 0.2s', pointerEvents: 'none' }}>
        FIGHT
      </div>
      <div style={{ position: 'absolute', left: '50%', top: '82%', transform: 'translateX(-50%)', padding: '4px 14px', borderRadius: 999,
        background: hover === 'train' ? '#e5484d' : 'rgba(9, 14, 28, 0.65)', color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 1.5,
        transition: 'background 0.2s', pointerEvents: 'none' }}>
        TRAIN
      </div>

      {/* THE DOOR — swings shut over the locker. Its inside face carries every
          number: streak chalk, the two plaques, and the standings sheet. */}
      <LockerDoor closed={closed} onToggle={() => setClosed((c) => !c)} />
    </div>
  );
}

/* ── The door ─────────────────────────────────────────────────────────────── */

interface LeaderRow {
  rank: number;
  username: string;
  points: number;
  isSelf: boolean;
}

/**
 * The locker door. Hinged on the left: open = swung past the frame (edge-on,
 * out of sight), closed = frontal, filling the locker mouth. Everything the
 * user wants to check lives on this face, the way a real gym locker carries
 * taped-up standings and a chalked streak.
 *
 * Standings load lazily — the first time the door is shut — so the home screen
 * doesn't pay for a leaderboard read it may never show.
 */
function LockerDoor({ closed, onToggle }: { closed: boolean; onToggle: () => void }) {
  const [rows, setRows] = useState<LeaderRow[] | null | undefined>(undefined);

  useEffect(() => {
    if (!closed || rows !== undefined) return;
    fetch('/api/leaderboard?scope=global&period=weekly')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setRows(Array.isArray(d?.rows) ? (d.rows as LeaderRow[]) : null))
      .catch(() => setRows(null));
  }, [closed, rows]);

  return (
    <>
      {/* Grab tab on the jamb — the affordance for pulling the door shut.
          Hidden once the door is closed (the door itself is then the target). */}
      <button
        onClick={onToggle}
        aria-label="Close the locker — see the standings"
        style={{
          position: 'absolute', left: '5.5%', top: '74%', width: '8%', height: '7%',
          zIndex: 25,
          borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0,
          // brushed steel pull, lit from the left like the rest of the scene
          background: 'linear-gradient(90deg, #93a2c4 0%, #cdd8ee 32%, #7f8dad 70%, #55628a 100%)',
          boxShadow: '2px 0 5px rgba(0,0,0,0.4)',
          opacity: closed ? 0 : 1,
          pointerEvents: closed ? 'none' : 'auto',
          transition: 'opacity 0.25s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#2a3552',
        }}
      >
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div
        onClick={closed ? onToggle : undefined}
        role={closed ? 'button' : undefined}
        aria-label={closed ? 'Open the locker' : undefined}
        style={{
          position: 'absolute', left: '9%', top: '0%', width: '87%', height: '92%',
          transformOrigin: 'left center',
          transform: `rotateY(${closed ? 0 : DOOR_OPEN_DEG}deg)`,
          transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          backfaceVisibility: 'hidden',
          pointerEvents: closed ? 'auto' : 'none',
          cursor: closed ? 'pointer' : 'default',
          zIndex: 30, // must cover the gloves and the live chase board
          borderRadius: '4px 10px 10px 4px',
          background: 'linear-gradient(100deg, #46557d 0%, #3c4a6b 38%, #2f3b57 100%)',
          border: '2px solid #2a3552',
          boxShadow: closed ? '-18px 0 40px rgba(0,0,0,0.45)' : 'none',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          // top padding clears the floating sign + settings button
          // Top padding clears the floating CHESS BOXING sign, which hangs ON
          // the closed door. The sign is fixed-size type while the door scales
          // with the screen — so the clearance is a px clamp, not a %.
          padding: '7%',
          paddingTop: 'clamp(140px, 32%, 210px)',
          paddingBottom: '13%',
          gap: '3%',
          // every cqw inside the door is a share of the DOOR's width
          containerType: 'inline-size',
        }}
      >
        {/* louvered air vents, stamped into the top of the door */}
        <Louvers />

        {/* the pull handle — the way back into the locker */}
        <div
          style={{
            position: 'absolute', right: '3%', top: '44%', width: '2.6%', height: '13%',
            borderRadius: 99,
            background: 'linear-gradient(90deg, #cdd8ee 0%, #93a2c4 55%, #55628a 100%)',
            boxShadow: '-2px 0 5px rgba(0,0,0,0.35)',
          }}
        />

        {/* the official standings, bolted to the front of the locker */}
        <Standings rows={rows} />
      </div>
    </>
  );
}

/**
 * Louvered air holes — the thing that makes a metal panel read as a locker
 * door. Stamped slots with a lit top lip and a dark throat, two banks: one
 * above the standings and one below.
 */
function Louvers() {
  const bank = (top: string) => (
    <div
      key={top}
      style={{
        position: 'absolute', left: '50%', top, transform: 'translateX(-50%)',
        width: '46%', display: 'flex', flexDirection: 'column', gap: '38%',
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: '0.9cqw',
            minHeight: 3,
            borderRadius: 99,
            background: '#1e2740',
            boxShadow: '0 1px 0 0 rgba(255,255,255,0.16), inset 0 1px 2px rgba(0,0,0,0.8)',
          }}
        />
      ))}
    </div>
  );
  return (
    <>
      {bank('7%')}
      {bank('86%')}
    </>
  );
}

/** A brass plaque screwed to the door. */
function Plaque({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div
      style={{
        flexShrink: 0, minWidth: 0, textAlign: 'center',
        background: 'linear-gradient(160deg, #d9b862 0%, #c8a24a 45%, #a8842f 100%)',
        border: '1px solid #8a6b22',
        borderRadius: 4,
        boxShadow: '0 2px 0 0 #6f5518, inset 0 1px 0 rgba(255,255,255,0.35)',
        padding: '7% 4%',
      }}
    >
      <div style={{ fontSize: 'clamp(3px, 1.05cqw, 6.5px)', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#5b4413', lineHeight: 1.25 }}>
        {label}
      </div>
      <div style={{ fontSize: 'clamp(7px, 2.6cqw, 16px)', fontWeight: 900, lineHeight: 1.15, color: '#3a2b08', fontVariantNumeric: 'tabular-nums' }}>
        {value || ' '}
      </div>
      <div style={{ fontSize: 'clamp(3px, 0.95cqw, 6px)', fontWeight: 700, color: '#6b5316', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {sub}
      </div>
    </div>
  );
}

/** The standings sheet — a printout taped inside the door. */
function Standings({ rows }: { rows: LeaderRow[] | null | undefined }) {
  return (
    <div style={{ flex: '1 1 auto', minHeight: 0, position: 'relative', display: 'flex', marginTop: '3%' }}>
      {/* tape */}
      {[
        { left: '4%', rotate: '-24deg' },
        { right: '4%', rotate: '22deg' },
      ].map((t, i) => (
        <div key={i} style={{ position: 'absolute', top: '-2.5%', width: '16%', height: '5%', background: 'rgba(240,236,214,0.55)', transform: `rotate(${t.rotate})`, zIndex: 2, ...t }} />
      ))}

      <div
        style={{
          flex: 1, minWidth: 0,
          background: '#f4ecd9',
          borderRadius: 2,
          transform: 'rotate(-0.6deg)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.35)',
          padding: '4% 5%',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          color: '#22293a',
        }}
      >
        <div style={{ fontSize: 'clamp(7px, 2.8cqw, 13px)', fontWeight: 900, letterSpacing: '0.16em', textAlign: 'center', borderBottom: '1.5px solid #22293a33', paddingBottom: '2%' }}>
          OFFICIAL STANDINGS
        </div>
        <div style={{ fontSize: 'clamp(5px, 2cqw, 10px)', fontWeight: 700, letterSpacing: '0.12em', textAlign: 'center', color: '#22293a99', paddingTop: '1%' }}>
          THIS WEEK
        </div>

        {rows === undefined && (
          <Note>loading the card…</Note>
        )}
        {rows === null && (
          <Note>sign in to see where you stand</Note>
        )}
        {rows && rows.length === 0 && (
          <Note>nobody has scored yet. be first.</Note>
        )}

        {rows && rows.length > 0 && (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingTop: '2%' }}>
            {rows.slice(0, 6).map((r) => (
              <div
                key={r.rank}
                style={{
                  display: 'flex', alignItems: 'baseline', gap: '4%',
                  fontSize: 'clamp(7px, 3cqw, 14px)',
                  fontWeight: r.isSelf ? 900 : 600,
                  color: r.isSelf ? '#b3261e' : '#22293a',
                }}
              >
                <span style={{ width: '12%', fontVariantNumeric: 'tabular-nums' }}>{r.rank}.</span>
                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.username}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>{r.points.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 'clamp(7px, 2.6cqw, 12px)', fontWeight: 700, color: '#22293a99', padding: '0 6%' }}>
      {children}
    </div>
  );
}

/**
 * "Enemy's Tears" written straight onto the bottle in black marker (Tyler: no
 * sticker). It wraps the barrel — the text rides an arc and the ink fades at
 * the edges where the surface turns away.
 */
function BottleLabel() {
  return (
    <div style={{ position: 'absolute', left: '80.9%', top: '75%', width: '11.9%', pointerEvents: 'none' }}>
      <svg viewBox="0 0 100 46" width="100%" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          {/* the marker rides the barrel */}
          <path id="lhBottleArc" d="M 12 18 Q 50 10 88 18" fill="none" />
          <path id="lhBottleArc2" d="M 12 38 Q 50 30 88 38" fill="none" />
          {/* ink thins out where the bottle curves away */}
          <linearGradient id="lhInk" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#0d1220" stopOpacity="0.25" />
            <stop offset="22%" stopColor="#0d1220" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#0d1220" stopOpacity="0.9" />
            <stop offset="82%" stopColor="#0d1220" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0d1220" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <g fill="url(#lhInk)" style={{ fontFamily: 'inherit' }} fontWeight="900" textAnchor="middle" transform="rotate(-3 50 24)">
          <text fontSize="15" letterSpacing="-0.3">
            <textPath href="#lhBottleArc" startOffset="50%">ENEMY&apos;S</textPath>
          </text>
          <text fontSize="15" letterSpacing="-0.3">
            <textPath href="#lhBottleArc2" startOffset="50%">TEARS</textPath>
          </text>
        </g>
      </svg>
    </div>
  );
}
